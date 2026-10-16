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

    const check = this.rollCheck(ch.attr, ch.diff);
    if (check.success) {
      SoundFX.play("sword");
      tr.enemyHp = Math.max(0, tr.enemyHp - ch.dmg);
      tr.logNotes.push(`✔ Fase ${tr.stageIdx + 1}: Êxito em ${ch.attr.toUpperCase()} (-${ch.dmg}% em ${tr.enemyLabel}).`);
    } else {
      SoundFX.play("fail");
      const glancing = Math.round(ch.dmg * 0.35);
      tr.enemyHp = Math.max(0, tr.enemyHp - glancing);
      tr.playerHp = Math.max(0, tr.playerHp - ch.selfDmg);
      STATE.hp = Math.max(5, STATE.hp - Math.round(ch.selfDmg * 0.35));
      tr.logNotes.push(`✖ Fase ${tr.stageIdx + 1}: Contratempo (-${ch.selfDmg}% em ${tr.playerLabel}, avanço parcial de ${glancing}%).`);
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

      if (check.success) {
        const baseGain = actObj.highReward ? Utils.rand(13, 19) : Utils.rand(9, 15);
        const gainPerf = Math.max(5, Math.round(baseGain - rankPenalty));
        STATE.jobPerformance = Utils.clamp(STATE.jobPerformance + gainPerf, 0, 100);
        const visitedBonus = (actObj.isItinerantShared || actObj.isItinerantSpec)
          ? Math.min(24, (Array.isArray(STATE.visitedCities) ? STATE.visitedCities.length : 1) * 2)
          : 0;
        let bonusGold = (isGuild || (actObj.gold > 0 && !actObj.isItinerantSpec))
          ? 0
          : ((actObj.highReward ? Utils.rand(14, 28) : Utils.rand(6, 15)) + visitedBonus);
        if (actObj.id === "it_spec_mercador" && !isGuild) bonusGold += 18;
        if ((actObj.id === "it_spec_pirata" || actObj.id === "it_spec_bandido") && !isGuild) bonusGold += 14;
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
  }
});
