/* ============================================================================
   [ENGINE · CICLO ANUAL] — avanço de ano e eventos de época
   ============================================================================ */
Object.assign(Engine, {
  advanceYear() {
    if (STATE.activeEvent || STATE.specialTrial) {
      UI.renderEventModal();
      return;
    }
    if (STATE.pendingChild) {
      UI.openChildNameModal();
      return;
    }

    SoundFX.play("year");
    this.ensureVigorFields();
    STATE.age++;
    STATE.year++;
    STATE.healthCareUsedThisYear = false;
    STATE.activityYearCount = {};

    const seasons = [
      "As geadas derretem nos campos lamacentos",
      "Os ventos de outono varrem as folhas secas pelas estradas",
      "As chuvas de primavera enchem os rios e moinhos",
      "O sol rubro de verão amadurece o centeio e aquece as pedras"
    ];
    this.addLog(`Ano do Senhor de ${STATE.year} — ${Utils.pick(seasons)} de ${this.getKingdom().name}. Você completa ${STATE.age} anos (${this.getPhase()}).`, "year-header");

    const hpRegen = STATE.age <= 15 ? 8 : (STATE.age < 50 ? 5 : 2);
    STATE.hp = Math.min(STATE.maxHp, STATE.hp + hpRegen);
    STATE.maxVigor = STATE.age < 55 ? 100 : Math.max(50, 100 - (STATE.age - 50) * 2);
    STATE.vigor = STATE.maxVigor;
    this.refreshVisibleJobsAndGuilds();
    
    if (this.processPendingFiefOrders) this.processPendingFiefOrders();

    if (STATE.age === 12 && STATE.job === "crianca" && !STATE.guildTraining) {
      this.addLog(`Aos 12 anos, você já tem idade para buscar um aprendizado em uma Guilda ou escolher seu primeiro Ofício na aba "Ofícios e Guildas".`, "epoch");
    }

    if (STATE.age === 16) {
      this.addLog(`🧭 MAIORIDADE E ESTRADAS ABERTAS: Aos 16 anos, você alcançou autonomia plena para viajar entre comarcas e liderar expedições pelo botão **🧭 Viajar**!`, "epoch");
      if (!STATE.npcs.some(n => n.role === "Pretendente" && n.alive)) {
        const oppSex = STATE.sex === "M" ? "F" : "M";
        const firstSuitor = Utils.genNPC("Pretendente", Utils.rand(16, 20), oppSex, null, STATE.socialClass);
        STATE.npcs.push(firstSuitor);
        this.addLog(`Com o florescer da sua juventude, ${firstSuitor.name} (da Casa ${firstSuitor.surname}) passa a enviar-lhe recados e olhares discretos na corte e nas festas.`);
      }
    }

    // Degradação Natural por Envelhecimento
    if (STATE.age >= 48 && STATE.age < 60) {
      if (Math.random() < 0.30) {
        const pool = ["forca", "destreza", "beleza"].filter(k => (STATE.attrs[k] || 0) > 15);
        if (pool.length > 0) {
          const target = Utils.pick(pool);
          STATE.attrs[target] -= 1;
          const targetName = target === "forca" ? "Força" : (target === "destreza" ? "Destreza" : "Beleza");
          this.addLog(`O peso dos anos começa a se fazer sentir (-1 ${targetName}).`, "bad");
        }
      }
    } else if (STATE.age >= 60 && STATE.age < 72) {
      if (Math.random() < 0.55) {
        const pool = ["forca", "destreza", "saude", "beleza"].filter(k => (STATE.attrs[k] || 0) > 15);
        if (pool.length > 0) {
          const target = Utils.pick(pool);
          STATE.attrs[target] -= 1;
          if (target === "saude") {
            STATE.maxHp = Math.max(10, this.getEffectiveAttr("saude"));
            STATE.hp = Math.min(STATE.hp, STATE.maxHp);
          }
          const targetName = target === "forca" ? "Força" : (target === "destreza" ? "Destreza" : (target === "saude" ? "Saúde" : "Beleza"));
          this.addLog(`A velhice cobra seu tributo sobre as juntas e a vitalidade (-1 ${targetName}).`, "bad");
        }
      }
    } else if (STATE.age >= 72) {
      if (Math.random() < 0.75) {
        const loss = Utils.rand(1, 2);
        const pool = ["forca", "destreza", "saude", "beleza"].filter(k => (STATE.attrs[k] || 0) > 10);
        if (pool.length > 0) {
          const target = Utils.pick(pool);
          const actualLoss = Math.min(loss, (STATE.attrs[target] || 10) - 10);
          if (actualLoss > 0) {
            STATE.attrs[target] -= actualLoss;
            if (target === "saude") {
              STATE.maxHp = Math.max(10, this.getEffectiveAttr("saude"));
              STATE.hp = Math.min(STATE.hp, STATE.maxHp);
            }
            const targetName = target === "forca" ? "Força" : (target === "destreza" ? "Destreza" : (target === "saude" ? "Saúde" : "Beleza"));
            this.addLog(`A idade avançada debilita inexoravelmente o vigor do corpo (-${actualLoss} ${targetName}).`, "bad");
          }
        }
      }
    }

    // Progresso Anual de Guilda ou de Desempenho no Ofício
    if (STATE.guildTraining) {
      this.ensureColleagues();
      STATE.guildTraining.yearsDone = (STATE.guildTraining.yearsDone || 0) + 1;
      STATE.jobPerformance = Utils.clamp((STATE.jobPerformance || 50) - 3, 0, 100);
      if (STATE.guildTraining.yearsDone >= STATE.guildTraining.yearsReq) {
        if (STATE.jobPerformance >= 45) {
          this.completeGuildTraining();
        } else {
          this.addLog(`⚠️ Os mestres de **${STATE.guildTraining.guildName}** julgaram seu desempenho insuficiente (${STATE.jobPerformance}/100, mínimo 45) e retiveram sua aprovação final! Dedique-se às ações de desempenho na aba Ofícios e Guildas.`, "bad");
        }
      } else {
        this.addLog(`🏛️ Treinamento na **${STATE.guildTraining.guildName}** (${this.getGuildHierarchyRank()}): Ano ${STATE.guildTraining.yearsDone}/${STATE.guildTraining.yearsReq} concluído (Desempenho atual: ${STATE.jobPerformance}/100).`);
      }
    } else if (STATE.job !== "crianca") {
      this.ensureColleagues();
      const curJob = this.getJob();
      const curRank = STATE.jobRank || 0;
      const maxRank = (curJob.ranks ? curJob.ranks.length : 1) - 1;
      const { reqPerf, reqAttrDiff, perfDecay } = this.getPromotionRequirements(curRank);

      STATE.jobPerformance = Utils.clamp((STATE.jobPerformance || 50) - perfDecay, 0, 100);

      if (STATE.jobPerformance >= reqPerf && curRank < maxRank) {
        const mainAttr = Object.keys(curJob.req || {})[0] || "intelecto";
        const promoCheck = this.rollCheck(mainAttr, reqAttrDiff);
        if (promoCheck.success) {
          STATE.jobRank = curRank + 1;
          STATE.jobPerformance = Math.max(48, 56 - STATE.jobRank * 2);
          const newRankTitle = this.getJobRankLabel(curJob, STATE.jobRank);
          SoundFX.play("bells");
          this.addLog(`⬆️ PROMOÇÃO HIERÁRQUICA: Superando o rigoroso escrutínio do cargo (Desempenho ≥ ${reqPerf} e prova de mérito), você foi elevado(a) a **${newRankTitle}** em ${curJob.name}!`, "good");
        } else {
          this.addLog(`📋 Escrutínio de Promoção: Seu desempenho (${STATE.jobPerformance}/100) qualificou você à vaga de **${this.getJobRankLabel(curJob, curRank + 1)}**, mas os veteranos exigem maior domínio prático (${mainAttr.toUpperCase()} / Sorte) para conceder o cargo superior.`);
        }
      } else if (STATE.jobPerformance <= 25 && curRank > 0) {
        STATE.jobRank = curRank - 1;
        STATE.jobPerformance = 45;
        const demotedTitle = this.getJobRankLabel(curJob, STATE.jobRank);
        SoundFX.play("fail");
        this.addLog(`⬇️ REGRESSÃO DE CARGO: Seu baixo rendimento levou os mestres a rebaixarem você para o cargo de **${demotedTitle}** em ${curJob.name}!`, "bad");
      }

      if (curJob.transitionTo && curJob.transitionTo !== STATE.socialClass && (STATE.jobRank || 0) >= maxRank && STATE.jobPerformance >= 90) {
        const prevClass = STATE.socialClass;
        SoundFX.play("bells");
        this.setFamilySocialClass(
          curJob.transitionTo,
          `Alcançando o ápice da hierarquia (${this.getJobRankLabel(curJob, STATE.jobRank)}) com desempenho lendário (${STATE.jobPerformance}/100) em ${curJob.name}, você elevou a Casa ${STATE.surname} de ${this.getClassLabel(prevClass)} para ${this.getClassLabel(curJob.transitionTo)}!`
        );
      } else if (STATE.jobPerformance <= 10 && (STATE.jobRank || 0) === 0) {
        const lostJobName = curJob.name;
        STATE.job = "crianca";
        STATE.jobRank = 0;
        this.addLog(`⚠️ EXPULSÃO DO OFÍCIO: Devido ao seu péssimo desempenho no cargo inicial (${STATE.jobPerformance}/100), você foi destituído de ${lostJobName}!`, "bad");

        if (STATE.socialClass !== "plebeu" && STATE.honor < 30 && STATE.debt > 100) {
          const lowerClass = STATE.socialClass === "nobre" ? "media" : "plebeu";
          this.setFamilySocialClass(lowerClass, `A ruína financeira, a perda do ofício e a desonra arrastaram sua família para a decadência social!`);
        }
      }
    }

    if (STATE.age >= 12) {
      const fin = this.calcAnnualFinances();
      STATE.gold += fin.net;
      if (STATE.debt > 0) STATE.debt += fin.debtInterest;
      const sign = fin.net >= 0 ? "+" : "";
      this.addLog(`Balanço Anual (${this.getOccupationLabel()}): Bruto ${fin.gross}, Custos/Impostos ${fin.upkeep + fin.taxes} => ${sign}${fin.net} Ouro.`);
      if (STATE.gold < 0) {
        STATE.debt += Math.abs(STATE.gold) + 5;
        STATE.gold = 0;
        STATE.hp -= 8;
        this.addLog("Endividado e sem moedas para o sustento, você passou privações.", "bad");
      }

      if (STATE.debt > 60 && STATE.gold <= 0 && Math.random() < 0.35) {
        const attrLoss = Math.random() < 0.5 ? "saude" : "carisma";
        if ((STATE.attrs[attrLoss] || 15) > 10) {
          STATE.attrs[attrLoss] -= 1;
          if (attrLoss === "saude") {
            STATE.maxHp = Math.max(10, this.getEffectiveAttr("saude"));
            STATE.hp = Math.min(STATE.hp, STATE.maxHp);
          }
          const attrLabel = attrLoss === "saude" ? "Saúde" : "Carisma";
          this.addLog(`A penúria das dívidas sufocantes, o assédio dos cobradores e a humilhação degradaram seu estado (-1 ${attrLabel}).`, "bad");
        }
      }
    }

    if (STATE.pregnancy) {
      this.resolveChildbirth();
    } else {
      const spouse = STATE.npcs.find(n => n.role === "Cônjuge" && n.alive);
      if (spouse) {
        const isOppositeSex = (STATE.sex === "M" && spouse.sex === "F") || (STATE.sex === "F" && spouse.sex === "M");
        const canConceive = isOppositeSex && STATE.age >= 16 && STATE.age < 50 && spouse.age >= 16 && spouse.age < 46;
        if (canConceive && Math.random() < 0.08) {
          STATE.pregnancy = { partnerId: spouse.id, partnerName: spouse.name, isBastard: false };
          const msgSpont = `Na convivência doce do matrimônio com ${spouse.name}, uma bênção inesperada floresceu: ${STATE.sex === "F" ? "você descobriu estar grávida" : `${spouse.name} anunciou estar esperando um filho seu`}! O parto é aguardado para o próximo ano.`;
          this.addLog(`🤰 GRAVIDEZ ESPONTÂNEA: ${msgSpont}`, "epoch");
          UI.notify("🤰 Gravidez Espontânea no Lar!", msgSpont, "bells");
        }
      }
    }

    this.updateNPCs();

    if (STATE.socialClass === "nobre" && (STATE.nobleTitleLevel || 0) >= 1 && STATE.fief) {
      if ((STATE.fief.peasantry < 25 || STATE.fief.loyalty < 25) && Math.random() < 0.45) {
        const loss = Math.min(STATE.gold, 22);
        STATE.gold -= loss;
        STATE.honor = Utils.clamp(STATE.honor - 4, 0, 100);
        STATE.fief.prosperity = Utils.clamp(STATE.fief.prosperity - 6, 0, 100);
        this.addLog(`🔥 MOTIM NO DOMÍNIO: A revolta dos camponeses e vassalos descontentes incendiou celeiros do seu feudo (-${loss} Ouro, -4 Honra, -6 Prosperidade)!`, "bad");
      }
    }

    if (STATE.socialClass === "nobre" && STATE.age >= 18) {
      this.checkNobleTitleConferral();
    }

    if (Math.random() < 0.18) {
      this.triggerEpochEvent();
    }

    if (STATE.alive === false || STATE.isDead || this.checkMortality()) return;

    if (!STATE.pendingChild) {
      this.triggerYearlyEvent();
    }

    Storage.saveToSlot(CONFIG.activeSlot);
    UI.renderAll();
  },

  triggerEpochEvent() {
    const ep = Utils.pick(DATA.epochEvents);
    const curCity = this.getCityObj ? this.getCityObj(STATE.currentCityId, STATE.kingdom) : { name: "", tier: "vila" };
    this.addLog(`[EVENTO DE ÉPOCA EM ${curCity.name.toUpperCase()}: ${ep.name}] ${ep.desc}`, "epoch");
    const isChild = STATE.age < 12;

    if (ep.effect === "plague") {
      const inUrban = curCity.tier === "cidade" || curCity.tier === "capital";
      const diff = isChild ? 40 : (inUrban ? 64 : 46);
      const dmg = isChild ? 6 : (inUrban ? 22 : 11);
      const res = this.rollCheck("saude", diff);
      if (!res.success) {
        STATE.hp -= dmg;
        this.addLog(`O miasma da praga (${inUrban ? "agravado pelas ruas apinhadas da cidade" : "nas terras da vila"}) debilitou sua saúde (-${dmg} Saúde)!`, "bad");
      } else {
        this.addLog(`Sua constituição resistiu ao contágio da pestilência em ${curCity.name}.`, "good");
      }
    } else if (ep.effect === "famine") {
      const grainCost = curCity.tier === "vila" ? 10 : 16;
      if (STATE.gold >= grainCost) {
        STATE.gold -= grainCost;
        this.addLog(`Você pagou caro por grãos estocados em ${curCity.name} (-${grainCost} Ouro).`);
      } else {
        STATE.hp -= isChild ? 4 : 14;
        this.addLog("A fome corroeu seu estômago durante o inverno.", "bad");
      }
    } else if (ep.effect === "harvest") {
      const bonus = curCity.tier === "vila" ? 22 : 14;
      STATE.gold += bonus;
      STATE.hp = Math.min(STATE.maxHp, STATE.hp + 10);
      if (STATE.fief) STATE.fief.prosperity = Utils.clamp(STATE.fief.prosperity + 6, 0, 100);
      this.addLog(`A fartura da colheita rendeu +${bonus} Ouro e revigorou sua saúde!`, "good");
    } else if (ep.effect === "war") {
      if (["soldado","mercenario","cavaleiro"].includes(STATE.job)) {
        const wCheck = this.rollCheck("forca", 56);
        if (wCheck.success) {
          STATE.gold += 30;
          STATE.honor = Utils.clamp(STATE.honor + 6, 0, 100);
          this.addLog("Convocado às fronteiras em guerra, você destacou-se em combate (+30 Ouro, +6 Honra)!", "good");
        } else {
          STATE.hp -= 14;
          this.addLog("Você foi ferido nas escaramuças sangrentas da fronteira (-14 Saúde).", "bad");
        }
      }
      if (STATE.socialClass === "nobre" && (STATE.nobleTitleLevel || 0) >= 1 && STATE.fief) {
        if (STATE.fief.defense >= 65) {
          STATE.gold += 25;
          STATE.honor = Utils.clamp(STATE.honor + 5, 0, 100);
          this.addLog("🛡️ Suas guarnições bem defendidas repeliram invasores nas fronteiras do feudo (+25 Ouro em presas, +5 Honra)!", "good");
        } else if (STATE.fief.defense < 35) {
          const loss = Math.min(STATE.gold, 25);
          STATE.gold -= loss;
          STATE.fief.prosperity = Utils.clamp(STATE.fief.prosperity - 8, 0, 100);
          this.addLog(`🔥 Com a defesa frágil (${STATE.fief.defense}/100), incursores saquearam seu domínio (-${loss} Ouro, -8 Prosperidade)!`, "bad");
        }
      }
    } else if (ep.effect === "crusade" && !isChild) {
      const cCheck = this.rollCheck("fe", 55);
      if (cCheck.success) {
        STATE.gold += 28;
        STATE.honor = Utils.clamp(STATE.honor + 8, 0, 100);
        STATE.reputation = Utils.clamp(STATE.reputation + 1, -10, 10);
        this.addLog("⛪ Seu fervor e contribuição na mobilização sagrada elevaram seu nome (+28 Ouro, +8 Honra, +1 Rep)!", "good");
      } else {
        STATE.gold = Math.max(0, STATE.gold - 10);
        this.addLog("As exigências de tributos de guerra santa pesaram sobre sua bolsa (-10 Ouro).");
      }
    } else if (ep.effect === "tournament" && !isChild) {
      if (curCity.tier === "capital" || STATE.socialClass === "nobre" || ["cavaleiro","escudeiro","soldado","mercenario","bardo"].includes(STATE.job)) {
        const tCheck = this.rollCheck("destreza", 56);
        if (tCheck.success) {
          STATE.gold += 35;
          STATE.honor = Utils.clamp(STATE.honor + 6, 0, 100);
          STATE.reputation = Utils.clamp(STATE.reputation + 1, -10, 10);
          this.addLog(`🏇 No Grande Torneio Real, sua atuação conquistou prêmios e aplausos (+35 Ouro, +6 Honra, +1 Rep)!`, "good");
        } else {
          this.addLog("Você assistiu às justas e celebrações do Grande Torneio Real.");
        }
      }
    }
  }
});
