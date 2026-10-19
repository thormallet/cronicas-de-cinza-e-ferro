/* ============================================================================
   [ENGINE · PROVAÇÃO TÁTICA · RESOLUÇÃO E AÇÕES DE OFÍCIO] — resolução das escolhas da provação e ações de desempenho
   ============================================================================ */
Object.assign(Engine, {
  resolveSpecialTrialChoice(choiceIdx) {
    const tr = STATE.specialTrial;
    if (!tr) return;
    const st = tr.stages[tr.stageIdx];
    const ch = st.choices[choiceIdx];
    if (!ch) return;

    const wpn = this.getBestWeaponBonus ? this.getBestWeaponBonus() : { mult: 0 };
    const arm = this.getBestArmorReduction ? this.getBestArmorReduction() : { reduction: 0 };
    const trialType = tr.kind || tr.type;
    const isCombatTrial = ["battle", "joust", "heist", "expedition"].includes(trialType);

    let progDmg = ch.dmg;
    if (wpn.mult > 0 && isCombatTrial) {
      progDmg = Math.round(progDmg * (1 + wpn.mult));
    }
    let selfDmg = ch.selfDmg;
    if (arm.reduction > 0) {
      selfDmg = Math.max(1, Math.round(selfDmg * (1 - arm.reduction)));
    }

    const check = this.rollCheck(ch.attr, ch.diff);
    if (check.success) {
      SoundFX.play("sword");
      tr.enemyHp = Math.max(0, tr.enemyHp - progDmg);
      tr.logNotes.push(`✔ Fase ${tr.stageIdx + 1}: Êxito em ${ch.attr.toUpperCase()} (-${progDmg}% em ${tr.enemyLabel}).`);
    } else {
      SoundFX.play("fail");
      const glancing = Math.round(progDmg * 0.35);
      tr.enemyHp = Math.max(0, tr.enemyHp - glancing);
      tr.playerHp = Math.max(0, tr.playerHp - selfDmg);
      STATE.hp = Math.max(5, STATE.hp - Math.max(1, Math.round(selfDmg * 0.35)));
      tr.logNotes.push(`✖ Fase ${tr.stageIdx + 1}: Contratempo (-${selfDmg}% em ${tr.playerLabel}, avanço parcial de ${glancing}%).`);
    }

    tr.stageIdx++;

    if (tr.enemyHp <= 0 || tr.playerHp <= 0 || tr.stageIdx >= tr.stages.length) {
      const victory = tr.enemyHp <= 0 || (tr.playerHp > 0 && tr.enemyHp <= 35);
      const title = this.formatText(tr.title);
      STATE.specialTrial = null;

      if (victory) {
        const goldReward = 35 + (STATE.jobRank || 0) * 14;
        const perfReward = 18;
        STATE.gold += goldReward;
        STATE.reputation = Utils.clamp(STATE.reputation + 1, -10, 10);
        STATE.honor = Utils.clamp(STATE.honor + 6, 0, 100);
        if (this.hasActiveOccupation()) {
          STATE.jobPerformance = Utils.clamp((STATE.jobPerformance || 50) + perfReward, 0, 100);
        }
        if (trialType === "battle" || trialType === "joust") {
          STATE.duelsWon = (STATE.duelsWon || 0) + 1;
        }
        if (this.checkAchievements) this.checkAchievements();
        SoundFX.play("bells");
        const winMsg = `Triunfo memorável em ${title}! Você conquistou +${goldReward} Ouro, +${perfReward} Desempenho, +6 Honra e +1 Reputação!`;
        this.addLog(`🏆 ${winMsg}`, "epoch");
        UI.notify("🏆 Vitória na Provação Especial!", winMsg, "bells");
      } else {
        STATE.jobPerformance = Utils.clamp((STATE.jobPerformance || 50) - 8, 0, 100);
        STATE.honor = Utils.clamp(STATE.honor - 4, 0, 100);
        SoundFX.play("fail");
        const loseMsg = `Revés amargo em ${title}. Apesar do esforço, você sofreu desgaste (-8 Desempenho, -4 Honra).`;
        this.addLog(`⚠️ ${loseMsg}`, "bad");
        UI.notify("Revés na Provação", loseMsg, "fail");
      }
      Storage.saveToSlot(CONFIG.activeSlot);
      UI.renderAll();
      return;
    }

    UI.renderEventModal();
  },

  performJobAction(actionType) {
    this.ensureVigorFields();
    if (!this.hasActiveOccupation()) return;

    const actions = this.getJobDedicatedActions();
    const actObj = actions.find(a => a.id === actionType);
    const isGuild = !!STATE.guildTraining;
    const occName = this.getOccupationLabel();

    if (actObj) {
      if (actObj.gold > 0 && STATE.gold < actObj.gold) {
        UI.notify("Ouro Insuficiente", `Esta dedicação exige ${actObj.gold} moedas de ouro.`);
        return;
      }
      if (STATE.vigor < actObj.vigor) {
        UI.notify("Vigor Insuficiente", `Você precisa de ao menos ${actObj.vigor} de Vigor para "${actObj.title}".`);
        return;
      }
      STATE.gold -= actObj.gold || 0;
      STATE.vigor -= actObj.vigor;

      if (actObj.isTrial) {
        this.startSpecialJobTrial();
        return;
      }

      const rankPenalty = Math.min(6, (STATE.jobRank || 0) * 1.5);
      const check = this.rollCheck(actObj.attr, actObj.diff + (STATE.jobRank || 0) * 2);
      const hasJobTools = this.hasAnyActiveItem(["ferramentas_mestre", "astrolabio_bronze", "alambique_alquimia", "oficina_artesao"]);

      if (check.success) {
        const baseGain = actObj.highReward ? Utils.rand(13, 19) : Utils.rand(9, 15);
        const gainPerf = Math.max(5, Math.round(baseGain - rankPenalty)) + (hasJobTools ? 4 : 0);
        STATE.jobPerformance = Utils.clamp(STATE.jobPerformance + gainPerf, 0, 100);
        const visitedBonus = (actObj.isItinerantShared || actObj.isItinerantSpec)
          ? Math.min(24, (Array.isArray(STATE.visitedCities) ? STATE.visitedCities.length : 1) * 2)
          : 0;
        let bonusGold = (isGuild || (actObj.gold > 0 && !actObj.isItinerantSpec))
          ? 0
          : ((actObj.highReward ? Utils.rand(14, 28) : Utils.rand(6, 15)) + visitedBonus);
        if (actObj.id === "it_spec_mercador" && !isGuild) bonusGold += 18;
        if ((actObj.id === "it_spec_pirata" || actObj.id === "it_spec_bandido") && !isGuild) bonusGold += 14;
        if (hasJobTools && bonusGold > 0) {
          bonusGold = Math.round(bonusGold * 1.25);
        }
        STATE.gold += bonusGold;

        if (STATE.attrs[actObj.attr] !== undefined && STATE.attrs[actObj.attr] < 100 && Math.random() < 0.65) {
          STATE.attrs[actObj.attr] = Math.min(100, STATE.attrs[actObj.attr] + 2);
          if (actObj.attr === "saude") {
            STATE.maxHp = Math.max(10, this.getEffectiveAttr("saude"));
            STATE.hp = Math.min(STATE.maxHp, STATE.hp + 2);
          }
        }
        if (["armor_inspect", "clergy_synod", "it_spec_diplomata", "it_spec_cavaleiro", "it_spec_soldado", "it_spec_escudeiro"].includes(actObj.id)) {
          STATE.honor = Utils.clamp(STATE.honor + 4, 0, 100);
        }
        if (actObj.id === "it_spec_bandido") {
          STATE.honor = Utils.clamp(STATE.honor - 3, 0, 100);
        }
        if (["it_spec_bardo", "it_spec_diplomata", "it_spec_cavaleiro"].includes(actObj.id)) {
          STATE.reputation = Utils.clamp(STATE.reputation + 1, -10, 10);
        }

        const curCity = this.getCityObj ? this.getCityObj(STATE.currentCityId, STATE.kingdom) : { name: "" };
        const msg = `Em ${curCity.name} (${occName}), você executou "${actObj.title}" com maestria (+${gainPerf} Desempenho${bonusGold ? `, +${bonusGold} Ouro` : ''}, +${actObj.attr.toUpperCase()})!`;
        this.addLog(`${actObj.icon} ${msg}`, "good");
        UI.notify(actObj.title, msg, bonusGold ? "coin" : "success");
      } else {
        STATE.jobPerformance = Utils.clamp(STATE.jobPerformance - 3, 0, 100);
        STATE.hp = Math.max(5, STATE.hp - 4);
        const msg = `Contratempo durante "${actObj.title}" em ${occName} (-3 Desempenho, -4 Saúde).`;
        this.addLog(`${actObj.icon} ${msg}`, "bad");
        UI.notify("Revés no Ofício", msg, "fail");
      }

      Storage.saveToSlot(CONFIG.activeSlot);
      UI.renderAll();
      return;
    }
  },

  startDuelQTE(opponentNpc, duelType = "honra") {
    if (!STATE) return;
    this.ensureVigorFields();
    if (this.ensureStateIntegrity) this.ensureStateIntegrity();
    const dest = (STATE.attrs && STATE.attrs.destreza) || 50;
    const sweetWidth = Utils.clamp(Math.round(dest * 0.4) + 15, 15, 45);
    const sweetCenter = Utils.rand(35, 65);
    const stances = ["Golpe Alto Descendente", "Estocada Furtiva", "Aparar & Riposte"];
    const oppStance = stances[Math.floor(Math.random() * stances.length)];

    STATE.activeDuelQTE = {
      opponent: opponentNpc,
      duelType,
      sweetCenter,
      sweetWidth,
      oppStance,
      timestamp: Date.now()
    };

    if (window.UI && typeof UI.openDuelQTEModal === "function") {
      UI.openDuelQTEModal(STATE.activeDuelQTE);
    }
  },

  resolveDuelQTE(hitPos, selectedStance) {
    if (!STATE || !STATE.activeDuelQTE) return;
    const qte = STATE.activeDuelQTE;
    const diff = Math.abs(hitPos - qte.sweetCenter);
    const isCritical = diff <= (qte.sweetWidth / 2);
    const isHit = diff <= (qte.sweetWidth * 0.85);

    let resultMsg = "";
    if (isCritical) {
      STATE.duelsWon = (STATE.duelsWon || 0) + 1;
      STATE.honor = Utils.clamp((STATE.honor || 50) + 12, 0, 100);
      STATE.reputation = Utils.clamp((STATE.reputation || 0) + 2, -10, 10);
      resultMsg = `✨ GOLPE CRÍTICO PERFEITO! Sua lâmina atingiu a guarda de ${qte.opponent.name} com maestria devastadora. O adversário foi desarmado e rendeu-se (+12 Honra, +2 Reputação)!`;
      SoundFX.play("sword_clash");
      if (this.unlockAchievement && STATE.duelsWon >= 5) {
        this.unlockAchievement("conq_mestre_duelo");
      }
    } else if (isHit) {
      STATE.duelsWon = (STATE.duelsWon || 0) + 1;
      STATE.honor = Utils.clamp((STATE.honor || 50) + 6, 0, 100);
      resultMsg = `⚔️ ACERTO TÁTICO: Você superou a postura de ${qte.opponent.name} após trocas de golpes intensas, forçando sua retirada (+6 Honra).`;
      SoundFX.play("sword_clash");
    } else {
      STATE.hp = Utils.clamp((STATE.hp || 80) - 18, 1, STATE.maxHp || 100);
      STATE.honor = Utils.clamp((STATE.honor || 50) - 8, 0, 100);
      resultMsg = `🩸 GOLPE RECEBIDO: Sua agulha errou o tempo do impacto e ${qte.opponent.name} contra-atacou com ferocidade (-18 Saúde, -8 Honra).`;
      SoundFX.play("damage");
    }

    this.addLog(resultMsg, isHit ? "good" : "bad");
    STATE.activeDuelQTE = null;
    if (window.UI && UI.closeModal) UI.closeModal();
    UI.notify("🤺 Duelo Singular Encerrado", resultMsg, isHit ? "success" : "fail");
    UI.renderAll();
  }
});
