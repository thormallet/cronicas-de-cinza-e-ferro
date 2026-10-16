/* ============================================================================
   [ENGINE · NÚCLEO] — acesso a reino/ofício, fase de vida, atributos, vigor, testes, finanças anuais e log
   ============================================================================ */
const Engine = {
  getKingdom() {
    return DATA.kingdoms.find(k => k.id === STATE.kingdom) || DATA.kingdoms[0];
  },

  getJob() {
    return DATA.jobs.find(j => j.id === STATE.job) || DATA.jobs[0];
  },

  getClassRankValue(c) {
    return c === "nobre" ? 3 : (c === "media" ? 2 : 1);
  },

  getClassLabel(c) {
    if (c === "nobre") {
      const titleStr = (STATE && STATE.socialClass === "nobre") ? this.getNobleTitleLabel() : "";
      return titleStr ? `Nobreza (${titleStr})` : "Nobreza";
    }
    return c === "media" ? "Classe Média" : "Plebeu";
  },

  getPhase(age = STATE.age) {
    if (age <= 5) return "Infância";
    if (age <= 15) return "Juventude";
    if (age < 55) return "Adulto";
    return "Velhice";
  },

  /* Bônus de equipamento contam apenas 1 vez por item único (propriedades continuam gerando renda cumulativa) */
  getEffectiveAttr(attrId) {
    let val = STATE.attrs[attrId] || 0;
    const uniqueItems = new Set(STATE.inventory);
    uniqueItems.forEach(itemId => {
      const it = DATA.items.find(x => x.id === itemId);
      if (it && it.bonus && it.bonus[attrId]) val += it.bonus[attrId];
    });
    return Utils.clamp(val, 0, 100);
  },

  ensureVigorFields() {
    if (STATE.maxVigor === undefined) STATE.maxVigor = 100;
    if (STATE.vigor === undefined) STATE.vigor = STATE.maxVigor;
    if (STATE.healthCareUsedThisYear === undefined) STATE.healthCareUsedThisYear = false;
    if (!STATE.activityYearCount) STATE.activityYearCount = {};
    if (STATE.jobPerformance === undefined) STATE.jobPerformance = 50;
    if (STATE.jobRank === undefined) STATE.jobRank = 0;
    if (STATE.guildTraining === undefined) STATE.guildTraining = null;
    if (STATE.specialTrial === undefined) STATE.specialTrial = null;
    if (!Array.isArray(STATE.completedGuilds)) STATE.completedGuilds = [];
    if (STATE.expelledEcclesiastical === undefined) STATE.expelledEcclesiastical = false;
    if (STATE.careerChanges === undefined) STATE.careerChanges = 0;
    if (STATE.nobleTitleLevel === undefined) STATE.nobleTitleLevel = STATE.socialClass === "nobre" ? 1 : 0;
    if (!STATE.fief) {
      STATE.fief = { prosperity: 55, loyalty: 60, defense: 50, influence: 50, peasantry: 60 };
    }
    if (STATE.nobleTitleLevel >= 1) {
      this.ensureCourtMembers();
    }
    if (!Array.isArray(STATE.visibleJobIds) || STATE.visibleJobIds.length === 0) {
      this.refreshVisibleJobsAndGuilds();
    }
    if (!Array.isArray(STATE.visibleJobActivityIds)) {
      this.refreshVisibleJobActivities();
    }
    if (!STATE.birthKingdom) STATE.birthKingdom = STATE.kingdom;
    if (!STATE.currentCityId) {
      const cities = this.getKingdomCities ? this.getKingdomCities(STATE.kingdom) : [];
      STATE.currentCityId = cities.length ? Utils.pick(cities).id : "default_city";
    }
    if (!STATE.birthCityId) STATE.birthCityId = STATE.currentCityId;
    if (!Array.isArray(STATE.visitedCities)) STATE.visitedCities = [STATE.currentCityId];
    if (!STATE.visitedCities.includes(STATE.currentCityId)) STATE.visitedCities.push(STATE.currentCityId);
    if (!Array.isArray(STATE.visitedKingdoms)) STATE.visitedKingdoms = [STATE.kingdom];
    if (!STATE.visitedKingdoms.includes(STATE.kingdom)) STATE.visitedKingdoms.push(STATE.kingdom);
    if (STATE.travelCount === undefined) STATE.travelCount = 0;
    if (!STATE.travelMode) STATE.travelMode = "regular";
    if (!Array.isArray(STATE.pendingFiefOrders)) STATE.pendingFiefOrders = [];
    if (STATE.alive === undefined) STATE.alive = true;
    if (STATE.isDead === undefined) STATE.isDead = false;
    if (!Array.isArray(STATE.propertyMeta)) STATE.propertyMeta = [];
    if (Array.isArray(STATE.inventory)) {
      const propIds = STATE.inventory.filter(id => {
        const it = DATA.items.find(x => x.id === id);
        return it && it.type === "propriedade";
      });
      while (STATE.propertyMeta.length < propIds.length) {
        STATE.propertyMeta.push({
          id: propIds[STATE.propertyMeta.length],
          kingdom: STATE.kingdom,
          cityId: STATE.currentCityId
        });
      }
      if (STATE.propertyMeta.length > propIds.length) {
        STATE.propertyMeta.length = propIds.length;
      }
    }
  },

  rollCheck(attrId, difficulty) {
    const attrVal = this.getEffectiveAttr(attrId);
    const luckMod = Math.floor(this.getEffectiveAttr("sorte") * 0.20);
    const beautyMod = attrId === "carisma" ? Math.floor((this.getEffectiveAttr("beleza") - 35) * 0.18) : 0;
    const die = Utils.d50();
    const total = Math.round(attrVal * 0.65) + luckMod + beautyMod + die;
    const success = total >= difficulty;
    return { success, total, die, attrVal, luckMod, difficulty };
  },

  calcAnnualFinances() {
    const job = this.getJob();
    const rankMultiplier = 1 + ((STATE.jobRank || 0) * 0.28);
    const perfMod = STATE.job !== "crianca" && !STATE.guildTraining
      ? (0.65 + (Utils.clamp(STATE.jobPerformance || 50, 0, 100) / 100) * 0.75) * rankMultiplier
      : 0;
    const curCity = this.getCityObj ? this.getCityObj(STATE.currentCityId, STATE.kingdom) : { tier: "vila" };
    let locIncomeMult = 1.0;
    if (curCity.tier === "vila" && ["servo","campones","lenhador","mineiro","pastor","cacador","pescador","curandeiro"].includes(job.id)) {
      locIncomeMult = 1.15;
    } else if (curCity.tier === "cidade" && ["artesao","ferreiro","ourives","mercador","pedreiro","alquimista","taverneiro","moleiro","bordadeira"].includes(job.id)) {
      locIncomeMult = 1.15;
    } else if (curCity.tier === "capital" && ["chanceler","diplomata","juiz","dama_companhia","bispo","abadessa","erudito","medico","espiao"].includes(job.id)) {
      locIncomeMult = 1.15;
    }
    let gross = STATE.guildTraining ? 0 : Math.round((job.income || 0) * perfMod * locIncomeMult);
    if (STATE.socialClass === "nobre") {
      const tObj = this.getNobleTitleObj(STATE.nobleTitleLevel || 1);
      const fProsperity = (STATE.fief && STATE.fief.prosperity !== undefined) ? STATE.fief.prosperity : 55;
      if (tObj && tObj.bonusIncome) {
        gross += Math.round(tObj.bonusIncome * (0.5 + (fProsperity / 100)));
      }
    }
    let upkeep = STATE.socialClass === "nobre" ? 18 : (STATE.socialClass === "media" ? 7 : 3);
    if (curCity.tier === "vila") upkeep = Math.max(1, Math.round(upkeep * 0.8));
    else if (curCity.tier === "capital") upkeep = Math.round(upkeep * 1.25);
    if (STATE.age < 14 && STATE.job === "crianca" && !STATE.guildTraining) upkeep = 0;

    let propCursor = 0;
    STATE.inventory.forEach(itemId => {
      const it = DATA.items.find(x => x.id === itemId);
      if (it) {
        if (it.income) {
          let itemInc = it.income;
          if (it.type === "propriedade" && Array.isArray(STATE.propertyMeta)) {
            const meta = STATE.propertyMeta[propCursor++];
            if (meta && meta.kingdom && meta.kingdom !== STATE.kingdom) {
              itemInc = Math.round(itemInc * 0.65);
            }
          }
          gross += itemInc;
        }
        if (it.upkeep) upkeep += it.upkeep;
      }
    });

    const taxRate = this.getKingdom().tax;
    const taxes = Math.floor(gross * taxRate);
    const debtInterest = Math.floor(STATE.debt * 0.10);
    const net = gross - upkeep - taxes - debtInterest;
    return { gross, upkeep, taxes, debtInterest, net };
  },

  addLog(text, type = "") {
    STATE.log.push({ text, type, year: STATE.year, age: STATE.age });
    STATE.history.push(`[Ano ${STATE.year} | ${STATE.age} anos] ${text}`);
    UI.appendLogEntry({ text, type });
  },

  formatText(str) {
    const cityObj = this.getCityObj ? this.getCityObj(STATE.currentCityId, STATE.kingdom) : { name: this.getKingdom().name };
    const capObj = this.getCapitalCity ? this.getCapitalCity(STATE.kingdom) : cityObj;
    const lex = (DATA.kingdomLexicon && DATA.kingdomLexicon[STATE.kingdom]) || {};
    return String(str || "")
      .replace(/\{kingdom\}/g, this.getKingdom().name)
      .replace(/\{city\}/g, cityObj.name)
      .replace(/\{capital\}/g, capObj.name)
      .replace(/\{temple\}/g, lex.temple || "templo sagrado")
      .replace(/\{clergy\}/g, lex.clergy || "sacerdote")
      .replace(/\{guard\}/g, lex.guard || "guarda local")
      .replace(/\{fisco\}/g, lex.fisco || "coletor de impostos")
      .replace(/\{name\}/g, STATE.name);
  }
};
