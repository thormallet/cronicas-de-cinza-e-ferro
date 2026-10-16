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
      } else if (n.role === "Filho") {
        n.socialClass = STATE.socialClass;
        if (isNoble && tObj) {
          n.nobleTitle = n.sex === "F"
            ? (tObj.heirF || `Herdeira de ${tObj.titleM}`)
            : (tObj.heirM || `Herdeiro de ${tObj.titleM}`);
        } else {
          n.nobleTitle = "";
        }
      }
    });
  },

  setFamilySocialClass(newClass, reasonMsg = "") {
    const oldClass = STATE.socialClass;
    STATE.socialClass = newClass;
    if (newClass === "nobre" && (!STATE.nobleTitleLevel || STATE.nobleTitleLevel < 1)) {
      STATE.nobleTitleLevel = 1;
      this.ensureCourtMembers();
    } else if (newClass !== "nobre") {
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

  getNobleTitleObj(level = STATE ? (STATE.nobleTitleLevel || 0) : 0) {
    if (!level || level <= 0) return null;
    const kId = STATE ? STATE.kingdom : "valois";
    const kNob = (DATA.kingdomNobility && DATA.kingdomNobility[kId]) ? DATA.kingdomNobility[kId] : null;
    const list = (kNob && Array.isArray(kNob.titles)) ? kNob.titles : DATA.nobleTitles;
    return list.find(t => t.level === level) || null;
  },

  getNobleTitleLabel() {
    if (!STATE || STATE.socialClass !== "nobre") return "";
    const tObj = this.getNobleTitleObj(STATE.nobleTitleLevel || 1);
    if (!tObj) return "";
    return STATE.sex === "F" ? tObj.titleF : tObj.titleM;
  },

  checkNobleTitleConferral() {
    if (!STATE || STATE.socialClass !== "nobre") return;
    if (!STATE.nobleTitleLevel || STATE.nobleTitleLevel < 1) STATE.nobleTitleLevel = 1;

    const hasEstate = STATE.inventory.includes("solar_nobre") || STATE.inventory.includes("terra_aravel");
    const hasDeeds = STATE.flags.length >= 2;
    const infBonus = (STATE.fief && STATE.fief.influence >= 75) ? 1 : 0;
    const effRep = STATE.reputation + infBonus;
    let targetLevel = STATE.nobleTitleLevel;

    if (STATE.nobleTitleLevel === 1 && (effRep >= 4 || STATE.honor >= 68 || hasEstate)) {
      targetLevel = 2;
    } else if (STATE.nobleTitleLevel === 2 && effRep >= 6 && STATE.honor >= 74 && (STATE.gold >= 300 || hasEstate)) {
      targetLevel = 3;
    } else if (STATE.nobleTitleLevel === 3 && effRep >= 8 && STATE.honor >= 80 && (hasEstate || hasDeeds)) {
      targetLevel = 4;
    } else if (STATE.nobleTitleLevel === 4 && effRep >= 9 && STATE.honor >= 88 && STATE.gold >= 800 && hasEstate) {
      targetLevel = 5;
    }

    if (targetLevel > STATE.nobleTitleLevel) {
      STATE.nobleTitleLevel = targetLevel;
      const newTitle = this.getNobleTitleLabel();
      this.syncFamilyNobleTitles();
      this.ensureCourtMembers();
      SoundFX.play("bells");
      const msg = `Pelo seu prestígio na corte, honra ilibada, posses e feitos extraordinários, a Coroa de ${this.getKingdom().name} conferiu a você a Carta Patente de **${newTitle}** da Casa ${STATE.surname} (estendendo o título de Consorte ao seu cônjuge e de Herdeiro aos seus filhos)!`;
      this.addLog(`👑 INVESTIDURA DE NOBREZA TITULAR: ${msg}`, "epoch");
      UI.notify("👑 Título Nobiliárquico Conferido!", msg, "bells");
    }
  }
});
