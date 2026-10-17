/* ============================================================================
   [ENGINE · NOBREZA E ESTAMENTOS] — títulos nobiliárquicos, classe social da família e escândalos eclesiásticos
   ============================================================================ */
Object.assign(Engine, {
  isEcclesiasticalOccupation() {
    if (!STATE) return false;
    if (STATE.guildTraining) {
      const gJob = DATA.jobs.find(j => j.id === STATE.guildTraining.jobId);
      return !!(gJob && gJob.ecclesiastical);
    }
    const curJob = this.getJob();
    return !!(curJob && curJob.ecclesiastical);
  },

  handleEcclesiasticalScandal(partnerName) {
    if (!this.isEcclesiasticalOccupation()) return false;
    const occLabel = this.getOccupationLabel();
    STATE.expelledEcclesiastical = true;
    STATE.job = "crianca";
    STATE.guildTraining = null;
    STATE.jobRank = 0;
    STATE.jobPerformance = 0;
    STATE.honor = Utils.clamp(STATE.honor - 25, 0, 100);
    STATE.reputation = Utils.clamp(STATE.reputation - 3, -10, 10);
    SoundFX.play("death");
    const msg = `ESCÂNDALO CANÔNICO E EXCOMUNHÃO DE CARGO: Seu envolvimento carnal ilícito com ${partnerName} violou o voto sagrado de castidade! O tribunal eclesiástico expulsou você sumariamente de ${occLabel} sem jamais permitir readmissão no clero (-25 Honra, -3 Reputação)!`;
    this.addLog(`⛪🔥 ${msg}`, "bad");
    UI.notify("⚡ Expulsão por Quebra de Castidade!", msg, "fail");
    return true;
  },

  syncFamilyNobleTitles() {
    if (!STATE || !STATE.npcs) return;
    const isNoble = STATE.socialClass === "nobre" && (STATE.nobleTitleLevel || 0) >= 1;
    const tObj = isNoble ? this.getNobleTitleObj(STATE.nobleTitleLevel || 1) : null;

    STATE.npcs.forEach(n => {
      if (n.role === "Cônjuge") {
        n.socialClass = STATE.socialClass;
        if (isNoble && tObj) {
          n.nobleTitle = n.sex === "F"
            ? (tObj.consortF || `${tObj.titleF} Consorte`)
            : (tObj.consortM || `${tObj.titleM} Consorte`);
        } else {
          n.nobleTitle = "";
        }
      } else if (n.role === "Filho" || n.role === "Filha") {
        n.socialClass = STATE.socialClass;
        n.nobleTitleLevel = 0;
        if (isNoble) {
          if ((n.age || 0) < 16) {
            n.nobleTitle = n.sex === "F" ? "Donzela Fidalga" : "Donzel Fidalgo";
          } else if (tObj) {
            n.nobleTitle = n.sex === "F"
              ? (tObj.heirF || `Herdeira de ${tObj.titleM}`)
              : (tObj.heirM || `Herdeiro de ${tObj.titleM}`);
          } else {
            n.nobleTitle = n.sex === "F" ? "Donzela Fidalga" : "Donzel Fidalgo";
          }
        } else {
          n.nobleTitle = "";
        }
      }
    });
  },

  setFamilySocialClass(newClass, reasonMsg = "") {
    const oldClass = STATE.socialClass;
    STATE.socialClass = newClass;
    if (newClass === "nobre") {
      STATE.nobleTitleLevel = (STATE.age >= 16 ? 1 : 0);
      if (STATE.nobleTitleLevel >= 1) {
        this.ensureCourtMembers();
      }
    } else {
      STATE.nobleTitleLevel = 0;
      STATE.pendingFiefOrders = [];
    }
    const activeJobId = STATE.guildTraining ? STATE.guildTraining.jobId : (STATE.job && STATE.job !== "crianca" ? STATE.job : null);
    if (activeJobId) {
      const activeJob = DATA.jobs.find(j => j.id === activeJobId);
      const allowedTiers = (activeJob && activeJob.tiers) ? activeJob.tiers : ["plebeu", "media", "nobre"];
      if (activeJob && !allowedTiers.includes(newClass)) {
        const lostOcc = this.getOccupationLabel();
        STATE.job = "crianca";
        STATE.guildTraining = null;
        STATE.jobRank = 0;
        STATE.jobPerformance = 50;
        if (Array.isArray(STATE.npcs)) {
          STATE.npcs = STATE.npcs.filter(n => n.role !== "Colega de Ofício");
        }
        this.addLog(`⚒️ Com a mudança de estamento para **${this.getClassLabel(newClass)}**, você perdeu a prerrogativa de exercer **${lostOcc}**.`, "bad");
      }
    }
    this.syncFamilyNobleTitles();
    this.refreshVisibleJobsAndGuilds();
    if (reasonMsg && oldClass !== newClass) {
      const dir = this.getClassRankValue(newClass) > this.getClassRankValue(oldClass) ? "ASCENSÃO DINÁSTICA" : "DECADÊNCIA ESTAMENTAL";
      this.addLog(`⚜️ ${dir}: ${reasonMsg} Seu cônjuge e filhos agora compartilham o estamento e as honras de **${this.getClassLabel(newClass)}**.`, this.getClassRankValue(newClass) > this.getClassRankValue(oldClass) ? "epoch" : "bad");
    }
  },

  getRealmStability() {
    if (!STATE) return 50;
    const f = STATE.fief || { prosperity: 55, loyalty: 60, defense: 50, peasantry: 60 };
    const p = f.prosperity !== undefined ? f.prosperity : 50;
    const l = f.loyalty !== undefined ? f.loyalty : 50;
    const d = f.defense !== undefined ? f.defense : 50;
    const pe = f.peasantry !== undefined ? f.peasantry : 50;
    return Utils.clamp(Math.round((p + l + d + pe) / 4), 0, 100);
  },

  getNobleTitleObj(level = STATE ? (STATE.nobleTitleLevel || 0) : 0) {
    if (!level || level <= 0) return null;
    const kId = STATE ? STATE.kingdom : "valois";
    const kNob = (DATA.kingdomNobility && DATA.kingdomNobility[kId]) ? DATA.kingdomNobility[kId] : null;
    const list = (kNob && Array.isArray(kNob.titles)) ? kNob.titles : DATA.nobleTitles;
    return list.find(t => t.level === level) || null;
  },

  getNobleTitleLabel() {
    if (!STATE || STATE.socialClass !== "nobre") return "";
    if (STATE.age < 16) {
      return STATE.sex === "F" ? "Donzela Fidalga" : "Donzel Fidalgo";
    }
    const tObj = this.getNobleTitleObj(STATE.nobleTitleLevel || 1);
    if (!tObj) return STATE.sex === "F" ? "Fidalga" : "Fidalgo";
    return STATE.sex === "F" ? tObj.titleF : tObj.titleM;
  },

  hasRequiredNoblePossessions(targetLevel) {
    if (!STATE) return false;
    const req = (DATA.noblePossessionReqs && DATA.noblePossessionReqs[targetLevel]) || { minWealth: 600, minProperties: 1 };
    const worth = this.getNetWorth ? this.getNetWorth() : STATE.gold;
    if (worth < req.minWealth) return false;

    const maritimeKingdoms = ["serenissima", "al_zahra", "suvarnabhumi", "tianxia"];
    const isMaritime = maritimeKingdoms.includes(STATE.kingdom);

    const properties = (STATE.itemInstances || []).filter(x => {
      const it = DATA.items.find(i => i.id === x.id);
      if (!it) return false;
      if (it.category === "propriedade") return true;
      if (isMaritime && (x.id === "navio_mercante" || x.id === "taverna_porto" || x.id === "oficina_artesao")) return true;
      return false;
    });

    if (properties.length < req.minProperties) return false;

    if (!isMaritime && targetLevel >= 3) {
      const feudalEstates = ["terra_aravel", "solar_nobre", "forte_fronteira", "castelo_feudal", "palacio_real"];
      const hasFeudalBase = STATE.itemInstances.some(x => feudalEstates.includes(x.id));
      if (!hasFeudalBase) return false;
    }

    return true;
  },

  checkNobleTitleConferral() {
    if (!STATE || STATE.socialClass !== "nobre") return;
    if (STATE.age < 16) return;

    if (STATE.nobleDemeritTurns === undefined) STATE.nobleDemeritTurns = 0;

    /* Revogação: só após 3 anos seguidos de Honra < 20 ou Reputação < -5 */
    if (STATE.honor < 20 || STATE.reputation < -5) {
      STATE.nobleDemeritTurns++;
      if (STATE.nobleDemeritTurns >= 3 && (STATE.nobleTitleLevel || 0) > 1) {
        STATE.nobleTitleLevel--;
        STATE.nobleDemeritTurns = 0;
        const downTitle = this.getNobleTitleLabel();
        this.syncFamilyNobleTitles();
        SoundFX.play("fail");
        this.addLog(`📉 CASSAÇÃO DE TÍTULO: Após 3 anos consecutivos de desonra e opróbrio régio (Honra < 20 ou Reputação < -5), a Coroa rebaixou seu título titular para **${downTitle}**!`, "bad");
        return;
      }
    } else {
      STATE.nobleDemeritTurns = 0;
    }

    if (!this.hasRequiredNoblePossessions(1)) {
      if (STATE.nobleTitleLevel > 1) {
        STATE.nobleTitleLevel--;
        const downTitle = this.getNobleTitleLabel();
        this.syncFamilyNobleTitles();
        this.addLog(`📉 DECLÍNIO NOBILIÁRQUICO: A perda de propriedades e ruína patrimonial levaram os arautos régios a rebaixar seu título para **${downTitle}**!`, "bad");
      }
      return;
    }

    const realmStab = this.getRealmStability();
    const infBonus = (STATE.fief && STATE.fief.influence >= 75) ? 1 : 0;
    const effRep = STATE.reputation + infBonus;
    let targetLevel = STATE.nobleTitleLevel || 0;

    if (targetLevel === 0 && effRep >= 3 && STATE.honor >= 65 && realmStab >= 55) {
      targetLevel = 1;
    } else if (targetLevel === 1 && effRep >= 5 && STATE.honor >= 70 && realmStab >= 60 && this.hasRequiredNoblePossessions(2)) {
      targetLevel = 2;
    } else if (targetLevel === 2 && effRep >= 6 && STATE.honor >= 75 && realmStab >= 65 && this.hasRequiredNoblePossessions(3)) {
      targetLevel = 3;
    } else if (targetLevel === 3 && effRep >= 7 && STATE.honor >= 80 && realmStab >= 70 && this.hasRequiredNoblePossessions(4)) {
      targetLevel = 4;
    } else if (targetLevel === 4 && effRep >= 8 && STATE.honor >= 85 && realmStab >= 75 && this.hasRequiredNoblePossessions(5)) {
      targetLevel = 5;
    }

    if (targetLevel > (STATE.nobleTitleLevel || 0)) {
      STATE.nobleTitleLevel = targetLevel;
      const newTitle = this.getNobleTitleLabel();
      this.syncFamilyNobleTitles();
      this.ensureCourtMembers();
      SoundFX.play("fanfare");
      const msg = `Pelo seu prestígio na corte, honra ilibada (${STATE.honor}), alta reputação (${effRep}), estabilidade do reino e feudo (${realmStab}%) e posses territoriais, a Coroa de ${this.getKingdom().name} conferiu a você a Carta Patente de **${newTitle}** da Casa ${STATE.surname}!`;
      this.addLog(`👑 INVESTIDURA DE NOBREZA TITULAR: ${msg}`, "epoch");
      UI.notify("👑 Título Nobiliárquico Conferido!", msg, "fanfare");
      if (this.checkAchievements) this.checkAchievements();
    }
  },

  buyNobilityCharter() {
    this.ensureVigorFields();
    if (STATE.socialClass === "nobre") {
      UI.notify("Já Nobre", "Sua linhagem já pertence à nobreza do reino.");
      return;
    }
    const worth = this.getNetWorth ? this.getNetWorth() : STATE.gold;
    const hasProp = Array.isArray(STATE.itemInstances) && STATE.itemInstances.some(x => {
      const it = DATA.items.find(i => i.id === x.id);
      return it && (it.category === "propriedade" || it.category === "transporte");
    });

    if (!hasProp) {
      UI.notify("Patrimônio Ausente", "A concessão de Carta de Nobreza exige ao menos uma propriedade ou feitoria fundiária.");
      return;
    }

    const gen = STATE.generation || 1;
    let minWorth, minHonor, minRep, charterCost, genLabel;

    if (gen === 1) {
      minWorth = 3500;
      minHonor = 80;
      minRep = 5;
      charterCost = 900;
      genLabel = "1ª Geração (Plebeia / Patrícia recém-chegada)";
    } else if (gen === 2) {
      minWorth = 1800;
      minHonor = 65;
      minRep = 3;
      charterCost = 500;
      genLabel = "2ª Geração (Linhagem Consolidada)";
    } else {
      minWorth = 1400;
      minHonor = 60;
      minRep = 2;
      charterCost = 400;
      genLabel = "3ª Geração ou Superior (Patriciado Ancestral)";
    }

    if (worth < minWorth || STATE.honor < minHonor || STATE.reputation < minRep) {
      UI.notify("Requisitos Nobiliárquicos Insuficientes", `Para a ${genLabel}, a Coroa exige fortuna mínima de ${minWorth} Ouro, ${minHonor} de Honra e ${minRep} de Reputação.`);
      return;
    }

    if (STATE.gold < charterCost) {
      UI.notify("Ouro Insuficiente", `A taxa chancelar para outorga de Carta de Fidalguia custa ${charterCost} Ouro.`);
      return;
    }

    STATE.gold -= charterCost;
    STATE.nobleTitleLevel = (STATE.age >= 16 ? 1 : 0);
    this.setFamilySocialClass("nobre", `Outorga formal e venalidade da Carta de Nobreza perante a Chancelaria Régia (${genLabel})`);
    SoundFX.play("fanfare");
    Storage.unlockAchievement("ach_sangue_nobre");
    const newTitle = this.getNobleTitleLabel();
    this.addLog(`⚜️ CARTA DE NOBREZA ADQUIRIDA: Você pagou ${charterCost} Ouro e ascendeu formalmente ao estamento nobre como **${newTitle}** da Casa ${STATE.surname}!`, "epoch");
    UI.notify("⚜️ Ascensão Nobiliárquica!", `Você foi investido formalmente como ${newTitle}!`, "fanfare");
    Storage.saveToSlot(CONFIG.activeSlot);
    UI.renderAll();
  }
});
