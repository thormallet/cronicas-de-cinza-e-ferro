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
    const wTier = STATE && STATE.wealthTier;
    const wObj = (wTier && DATA.socialClassThresholds && DATA.socialClassThresholds[wTier]) ? DATA.socialClassThresholds[wTier] : null;
    if (c === "nobre") {
      const titleStr = (STATE && STATE.socialClass === "nobre") ? this.getNobleTitleLabel() : "";
      if (titleStr) return `Nobreza (${titleStr})`;
      if (wObj && wTier === "nobre") return `Nobreza (${wObj.label})`;
      return "Nobreza";
    }
    if (c === "media") {
      return wObj ? `Classe Média (${wObj.label})` : "Classe Média";
    }
    return wObj ? `Plebeu (${wObj.label})` : "Plebeu";
  },

  getPhase(age = STATE.age) {
    if (age <= 5) return "Infância";
    if (age <= 15) return "Juventude";
    if (age < 55) return "Adulto";
    return "Velhice";
  },

  /* Bônus de equipamento com multiplicador de performance do estado de conservação */
  getEffectiveAttr(attrId) {
    let val = STATE.attrs[attrId] || 0;
    const uniqueItems = new Set(STATE.inventory);
    uniqueItems.forEach(itemId => {
      const it = DATA.items.find(x => x.id === itemId);
      if (it && it.bonus && it.bonus[attrId]) {
        let multPerf = 1.0;
        if (Array.isArray(STATE.itemInstances)) {
          const inst = STATE.itemInstances.find(x => x.id === itemId && !x.mortgaged);
          if (inst && DATA.itemStates && DATA.itemStates[inst.state]) {
            multPerf = DATA.itemStates[inst.state].multPerf;
          }
        }
        val += Math.round(it.bonus[attrId] * multPerf);
      }
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
    if (!Array.isArray(STATE.itemInstances)) STATE.itemInstances = [];
    if (!Array.isArray(STATE.activeLoans)) STATE.activeLoans = [];
    if (!Array.isArray(STATE.bankerLoans)) STATE.bankerLoans = [];
    if (!Array.isArray(STATE.pregnancies)) STATE.pregnancies = [];
    if (!Array.isArray(STATE.pendingBirthQueue)) STATE.pendingBirthQueue = [];
    if (!STATE.successionLaw) STATE.successionLaw = "primogenitura";
    if (STATE.designatedHeirId === undefined) STATE.designatedHeirId = null;
    if (!STATE.wealthTier) {
      STATE.wealthTier = STATE.socialClass === "nobre" ? "nobre" : (STATE.socialClass === "media" ? "burgues" : "plebeu");
    }
    if (STATE.abandonedChildrenCount === undefined) STATE.abandonedChildrenCount = 0;
    if (STATE.duelsWon === undefined) STATE.duelsWon = 0;
    if (STATE.bargainsWon === undefined) STATE.bargainsWon = 0;
    if (STATE.bankerProfits === undefined) STATE.bankerProfits = 0;
    if (!Array.isArray(STATE.usedItemUidsThisYear)) STATE.usedItemUidsThisYear = [];

    /* Sincronização retrocompatível de inventário e instâncias de bens */
    if (Array.isArray(STATE.inventory)) {
      const instCounts = {};
      STATE.itemInstances.forEach(inst => {
        instCounts[inst.id] = (instCounts[inst.id] || 0) + 1;
      });
      const invCounts = {};
      STATE.inventory.forEach(id => {
        invCounts[id] = (invCounts[id] || 0) + 1;
      });
      Object.keys(invCounts).forEach(itemId => {
        const needed = invCounts[itemId] - (instCounts[itemId] || 0);
        const it = DATA.items.find(x => x.id === itemId);
        for (let i = 0; i < needed; i++) {
          STATE.itemInstances.push({
            uid: "it_" + Math.random().toString(36).slice(2, 9),
            id: itemId,
            state: "bom",
            kingdom: STATE.kingdom,
            cityId: STATE.currentCityId,
            buyPrice: (it && it.price) ? it.price : 50,
            mortgaged: false
          });
        }
      });

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

    /* Migração de gravidez única legada para array de gestações */
    if (STATE.pregnancy && STATE.pregnancies.length === 0) {
      STATE.pregnancies.push({
        id: STATE.pregnancy.id || ("preg_" + Math.random().toString(36).slice(2, 8)),
        motherId: STATE.pregnancy.motherId || (STATE.sex === "F" ? "player" : (STATE.pregnancy.partner ? STATE.pregnancy.partner.id : "npc_partner")),
        motherName: STATE.pregnancy.motherName || (STATE.sex === "F" ? STATE.name : (STATE.pregnancy.partner ? STATE.pregnancy.partner.name : "Parceira")),
        motherRole: STATE.pregnancy.motherRole || (STATE.sex === "F" ? "hero" : "Esposa"),
        fatherId: STATE.pregnancy.fatherId || (STATE.sex === "M" ? "player" : (STATE.pregnancy.partner ? STATE.pregnancy.partner.id : "npc_partner")),
        fatherName: STATE.pregnancy.fatherName || (STATE.sex === "M" ? STATE.name : (STATE.pregnancy.partner ? STATE.pregnancy.partner.name : "Parceiro")),
        isPlayerMother: STATE.pregnancy.isPlayerMother !== undefined ? STATE.pregnancy.isPlayerMother : (STATE.sex === "F"),
        isBastard: !!STATE.pregnancy.isBastard,
        isTwins: !!STATE.pregnancy.isTwins
      });
    }
    if (STATE.pregnancies.length > 0 && !STATE.pregnancy) {
      STATE.pregnancy = STATE.pregnancies[0];
    }
  },

  consumeVigor(amount, label = "Ação") {
    this.ensureVigorFields();
    if ((STATE.vigor || 0) < amount) {
      if (window.UI && window.UI.notify) {
        UI.notify("Vigor Insuficiente", `Você precisa de ${amount} de Vigor para "${label}" (Vigor atual: ${STATE.vigor}/${STATE.maxVigor}).`);
      }
      return false;
    }
    STATE.vigor = Math.max(0, STATE.vigor - amount);
    return true;
  },

  getItemDef(itemId) {
    return (DATA.items || []).find(i => i.id === itemId) || null;
  },

  getItemName(itemId) {
    const it = this.getItemDef(itemId);
    return it ? it.name : itemId;
  },

  hasActiveItem(itemId) {
    if (!STATE) return false;
    if (Array.isArray(STATE.itemInstances) && STATE.itemInstances.length > 0) {
      return STATE.itemInstances.some(inst => inst.id === itemId && !inst.mortgaged && inst.state !== "arruinado");
    }
    return Array.isArray(STATE.inventory) && STATE.inventory.includes(itemId);
  },

  hasAnyActiveItem(itemIdsArray) {
    if (!Array.isArray(itemIdsArray)) return false;
    return itemIdsArray.some(id => this.hasActiveItem(id));
  },

  getBestWeaponBonus() {
    const table = [
      { id: "lamina_damasco", mult: 0.25 },
      { id: "espada_longa", mult: 0.18 },
      { id: "arco_composto", mult: 0.15 },
      { id: "adaga_ferro", mult: 0.10 }
    ];
    for (const w of table) {
      if (this.hasActiveItem(w.id)) {
        return { mult: w.mult, name: this.getItemName(w.id) };
      }
    }
    return { mult: 0, name: null };
  },

  getBestArmorReduction() {
    const table = [
      { id: "armadura_placas", reduction: 0.60 },
      { id: "cota_malha", reduction: 0.40 },
      { id: "gibao_couro", reduction: 0.20 }
    ];
    for (const a of table) {
      if (this.hasActiveItem(a.id)) {
        return { reduction: a.reduction, name: this.getItemName(a.id), blocksScars: this.hasActiveItem("armadura_placas") };
      }
    }
    return { reduction: 0, name: null, blocksScars: false };
  },

  getBestInstrumentBonus() {
    const table = [
      { id: "harpa_dourada", bonus: 18 },
      { id: "alaude_nobre", bonus: 12 },
      { id: "flauta_osso", bonus: 6 }
    ];
    for (const inst of table) {
      if (this.hasActiveItem(inst.id)) {
        return { affinityBonus: inst.bonus, goldBonus: inst.bonus, name: this.getItemName(inst.id) };
      }
    }
    return { affinityBonus: 0, goldBonus: 0, name: null };
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

    let upkeep = STATE.socialClass === "nobre" ? 22 : (STATE.socialClass === "media" ? 8 : 3);
    if (STATE.wealthTier === "patricio") upkeep = Math.max(upkeep, 15);
    else if (STATE.wealthTier === "nobre") upkeep = Math.max(upkeep, 28);
    if (curCity.tier === "vila") upkeep = Math.max(1, Math.round(upkeep * 0.8));
    else if (curCity.tier === "capital") upkeep = Math.round(upkeep * 1.25);
    if (STATE.age < 14 && STATE.job === "crianca" && !STATE.guildTraining) upkeep = 0;

    /* Renda e manutenção de instâncias de bens e propriedades */
    if (Array.isArray(STATE.itemInstances) && STATE.itemInstances.length > 0) {
      STATE.itemInstances.forEach(inst => {
        const it = DATA.items.find(x => x.id === inst.id);
        if (it) {
          const stateObj = (DATA.itemStates && DATA.itemStates[inst.state]) || { multValue: 1.0, multPerf: 1.0 };
          if (it.income && !inst.mortgaged) {
            const regFactor = (inst.kingdom && inst.kingdom !== STATE.kingdom) ? 0.65 : 1.0;
            gross += Math.round(it.income * stateObj.multValue * regFactor);
          }
          if (it.upkeep) {
            const decayFactor = inst.state === "arruinado" ? 1.4 : (inst.state === "desgastado" ? 1.2 : 1.0);
            upkeep += Math.round(it.upkeep * decayFactor);
          }
        }
      });
    } else {
      /* Fallback retrocompatível para inventário sem instâncias */
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
    }

    const taxRate = this.getKingdom().tax;
    const taxes = Math.floor(gross * taxRate);
    let debtInterest = Math.floor((STATE.debt || 0) * 0.10);
    if (Array.isArray(STATE.activeLoans)) {
      STATE.activeLoans.forEach(l => {
        debtInterest += Math.floor((l.balance || 0) * (l.interestRate || 0.10));
      });
    }
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
