/* ============================================================================
   [ENGINE · EDIÇÃO EXPLORADOR · NÚCLEO] — cidades, corte, regras locais e ofícios feudais
   ============================================================================ */
Object.assign(Engine, {
  getKingdomCities(kId = STATE ? STATE.kingdom : "valois") {
    return (DATA.cities && DATA.cities[kId]) ? DATA.cities[kId] : [];
  },

  getCapitalCity(kId = STATE ? STATE.kingdom : "valois") {
    const list = this.getKingdomCities(kId);
    return list.find(c => c.tier === "capital") || list[0] || { id: "cap", name: "Capital Real", tier: "capital", desc: "" };
  },

  getCityObj(cityId = STATE ? STATE.currentCityId : null, kId = STATE ? STATE.kingdom : "valois") {
    const list = this.getKingdomCities(kId);
    if (!list.length) return { id: "default_city", name: this.getKingdom().name, tier: "capital", desc: "" };
    return list.find(c => c.id === cityId) || list[0];
  },

  getCityTierLabel(tier) {
    if (tier === "capital") return "Capital";
    if (tier === "cidade") return "Cidade";
    return "Vila";
  },

  isInCapital() {
    if (!STATE) return false;
    return this.getCityObj(STATE.currentCityId, STATE.kingdom).tier === "capital";
  },

  isInUrbanCenter() {
    if (!STATE) return false;
    const tier = this.getCityObj(STATE.currentCityId, STATE.kingdom).tier;
    return tier === "cidade" || tier === "capital";
  },

  getKingdomNobilityData(kId = STATE ? STATE.kingdom : "valois") {
    return (DATA.kingdomNobility && DATA.kingdomNobility[kId]) ? DATA.kingdomNobility[kId] : null;
  },

  getRoyalCourtPools(kId = STATE ? STATE.kingdom : "valois") {
    const nob = this.getKingdomNobilityData(kId);
    if (!nob || !Array.isArray(nob.titles)) {
      return {
        rulerM: "Rei Soberano", rulerF: "Rainha Consorte",
        princeM: "Príncipe Real", princeF: "Princesa Real",
        poolM: ["Príncipe Real", "Duque de Sangue Real", "Conde Palatino", "Visconde da Comarca", "Barão Feudal", "Fidalgo de Solar"],
        poolF: ["Princesa Real", "Duquesa de Sangue Real", "Condessa Palatina", "Viscondessa da Comarca", "Baronesa Feudal", "Fidalga de Solar"]
      };
    }
    return {
      rulerM: nob.rulerM,
      rulerF: nob.rulerF,
      princeM: nob.princeM,
      princeF: nob.princeF,
      poolM: [nob.princeM, ...nob.titles.slice().reverse().map(t => t.titleM)],
      poolF: [nob.princeF, ...nob.titles.slice().reverse().map(t => t.titleF)]
    };
  },

  getJobLocalityRule(jobId) {
    const rules = (DATA && DATA.jobLocalityRules) ? DATA.jobLocalityRules : {};
    return rules[jobId] || { tiers: ["vila", "cidade", "capital"], portable: false, crossKingdom: false };
  },

  isJobAllowedInCityTier(jobId, cityTier) {
    if (!jobId || jobId === "crianca") return true;
    const rule = this.getJobLocalityRule(jobId);
    return !rule.tiers || rule.tiers.includes(cityTier);
  },

  isActivityAllowedInCurrentCity(actId) {
    if (!STATE) return true;
    const rules = (DATA && DATA.activityLocalityRules) ? DATA.activityLocalityRules : {};
    const allowedTiers = rules[actId];
    if (!allowedTiers) return true;
    const curCity = this.getCityObj(STATE.currentCityId, STATE.kingdom);
    return allowedTiers.includes(curCity.tier);
  },

  getJobLocalityBadgeLabel(jobId) {
    const rule = this.getJobLocalityRule(jobId);
    const t = rule.tiers || ["vila", "cidade", "capital"];
    let loc = "Qualquer Local";
    if (t.length === 1 && t[0] === "vila") loc = "Apenas Vila";
    else if (t.length === 1 && t[0] === "capital") loc = "Apenas Capital";
    else if (t.length === 2 && t.includes("vila") && t.includes("cidade")) loc = "Vila ou Cidade";
    else if (t.length === 2 && t.includes("cidade") && t.includes("capital")) loc = "Cidade ou Capital";
    const mob = rule.crossKingdom
      ? "🌍 Entre Reinos"
      : (rule.portable ? "🧭 Itinerante" : "🏠 Fixo");
    return `📍 ${loc} • ${mob}`;
  },

  isItinerantJob(jobId = STATE ? (STATE.guildTraining ? STATE.guildTraining.jobId : STATE.job) : null) {
    if (!jobId || jobId === "crianca") return false;
    const rule = this.getJobLocalityRule(jobId);
    return !!rule.portable;
  },

  getItinerantMeta(jobId = STATE ? (STATE.guildTraining ? STATE.guildTraining.jobId : STATE.job) : null) {
    if (!jobId || !DATA.itinerantCareerMeta) return null;
    return DATA.itinerantCareerMeta[jobId] || null;
  },

  getTravelModeObj(modeId = STATE ? STATE.travelMode : "regular") {
    const list = (DATA && DATA.travelModes) ? DATA.travelModes : [];
    return list.find(m => m.id === modeId) || list[1] || { id: "regular", name: "Caravana Regular", icon: "🐪", goldMult: 1, vigorMult: 1, riskBonus: 0, desc: "" };
  },

  setTravelMode(modeId, reopenFn = "openTravelDialog") {
    if (!STATE) return;
    STATE.travelMode = modeId;
    SoundFX.play("click");
    if (typeof this[reopenFn] === "function") this[reopenFn]();
  },

  getTravelingDependentsCount() {
    if (!STATE || !Array.isArray(STATE.npcs)) return 0;
    return STATE.npcs.filter(n => n.alive && (n.role === "Cônjuge" || (n.role === "Filho" && n.age < 16))).length;
  },

  registerLocationDiscovery(cityObj, kingdomId, isCrossKingdom = false) {
    if (!STATE || !cityObj) return "";
    this.ensureVigorFields();
    const itMeta = (!STATE.guildTraining && this.getItinerantMeta(STATE.job)) ? this.getItinerantMeta(STATE.job) : null;
    const mult = itMeta ? (itMeta.discoveryBonusMult || 1.2) : 1.0;
    let notes = [];

    if (!STATE.visitedCities.includes(cityObj.id)) {
      STATE.visitedCities.push(cityObj.id);
      const baseGold = cityObj.tier === "capital" ? 28 : (cityObj.tier === "cidade" ? 18 : 12);
      const bonusGold = Math.round(baseGold * mult);
      STATE.gold += bonusGold;
      STATE.attrs.intelecto = Math.min(100, (STATE.attrs.intelecto || 20) + 2);
      if (itMeta && this.hasActiveOccupation()) {
        STATE.jobPerformance = Utils.clamp((STATE.jobPerformance || 50) + 6, 0, 100);
      }
      notes.push(`🗺️ **Descoberta Inédita (${cityObj.name}):** +${bonusGold} Ouro, +2 Intelecto${itMeta ? ", +6 Desempenho" : ""} (${STATE.visitedCities.length}/50 comarcas catalogadas).`);
    }

    if (isCrossKingdom && !STATE.visitedKingdoms.includes(kingdomId)) {
      STATE.visitedKingdoms.push(kingdomId);
      const kBonus = Math.round(45 * mult);
      STATE.gold += kBonus;
      STATE.reputation = Utils.clamp(STATE.reputation + 1, -10, 10);
      STATE.honor = Utils.clamp(STATE.honor + 5, 0, 100);
      notes.push(`🌍 **Novo Reino Desbravado:** +${kBonus} Ouro, +1 Reputação e +5 Honra (${STATE.visitedKingdoms.length}/10 reinos visitados)!`);
    }
    return notes.length ? " " + notes.join(" ") : "";
  },

  performLocalSpecialty(fromDialog = false) {
    this.ensureVigorFields();
    const spec = (DATA.kingdomSpecialties && DATA.kingdomSpecialties[STATE.kingdom]) || null;
    if (!spec) return;
    const curCity = this.getCityObj(STATE.currentCityId, STATE.kingdom);
    const vCost = 12;
    const gCost = spec.costGold || 10;
    if (STATE.vigor < vCost || STATE.gold < gCost) {
      if (fromDialog) UI.closeDialog();
      UI.notify("Recursos Insuficientes", `Aproveitar "${spec.name}" exige ${vCost} de Vigor e ${gCost} Ouro.`);
      return;
    }
    STATE.vigor -= vCost;
    STATE.gold -= gCost;
    const check = this.rollCheck(spec.attr, spec.diff);
    if (fromDialog) UI.closeDialog();

    if (check.success) {
      const tierBonus = curCity.tier === "capital" ? 14 : (curCity.tier === "cidade" ? 7 : 0);
      const itMeta = this.getItinerantMeta(STATE.job);
      const itBonus = itMeta ? 10 : 0;
      const gain = spec.rewardGold + tierBonus + itBonus;
      STATE.gold += gain;
      if (spec.bonusAttr) {
        const [aKey, aVal] = spec.bonusAttr;
        STATE.attrs[aKey] = Utils.clamp((STATE.attrs[aKey] || 20) + aVal, 0, 100);
        STATE.maxHp = Math.max(10, this.getEffectiveAttr("saude"));
      }
      if (itMeta && this.hasActiveOccupation()) {
        STATE.jobPerformance = Utils.clamp((STATE.jobPerformance || 50) + 6, 0, 100);
      }
      SoundFX.play("coin");
      const msg = `Em ${curCity.name}, você aproveitou a especialidade regional **${spec.name}** (+${gain} Ouro${spec.bonusAttr ? `, +${spec.bonusAttr[1]} ${spec.bonusAttr[0].toUpperCase()}` : ""}${itMeta ? ", +6 Desempenho Itinerante" : ""})!`;
      this.addLog(`${spec.icon} ESPECIALIDADE DE ${this.getKingdom().name.toUpperCase()}: ${msg}`, "good");
      UI.notify(`${spec.icon} ${spec.name}`, msg, "coin");
    } else {
      SoundFX.play("fail");
      STATE.hp = Math.max(5, STATE.hp - 4);
      const msg = `A negociação em **${spec.name}** (${curCity.name}) não saiu como esperado (-${gCost} Ouro, -4 Saúde).`;
      this.addLog(`${spec.icon} ${msg}`, "bad");
      UI.notify("Oportunidade Frustrada", msg, "fail");
    }
    Storage.saveToSlot(CONFIG.activeSlot);
    UI.renderAll();
  },

  getNobleActionMeta(actionId) {
    const lvl = (STATE && STATE.nobleTitleLevel) ? STATE.nobleTitleLevel : 1;
    const map = {
      collect_tribute:  { reqLvl: 1, vigor: 12, gold: 0,            title: "Recolher Foros e Banalidades" },
      improve_lands:    { reqLvl: 1, vigor: 12, gold: 30 + lvl * 15, title: "Fomentar Moinhos e Lavouras" },
      baronial_justice: { reqLvl: 2, vigor: 14, gold: 0,            title: "Exercer Alta Justiça Senhorial" },
      viscount_charters:{ reqLvl: 3, vigor: 15, gold: 0,            title: "Outorgar Feiras na Comarca" },
      palatine_levy:    { reqLvl: 4, vigor: 16, gold: 75,           title: "Mobilizar Hostes do Domínio" },
      ducal_council:    { reqLvl: 5, vigor: 18, gold: 0,            title: "Intervir no Grande Conselho" }
    };
    return map[actionId] || null;
  },

  dispatchNobleOrder(actionId) {
    this.ensureVigorFields();
    const meta = this.getNobleActionMeta(actionId);
    if (!meta || (STATE.nobleTitleLevel || 0) < meta.reqLvl) return;
    if (!Array.isArray(STATE.pendingFiefOrders)) STATE.pendingFiefOrders = [];

    if (STATE.pendingFiefOrders.includes(actionId)) {
      UI.notify("Ofício já Despachado", "Um mensageiro já leva esta ordem para ser cumprida no início do próximo ano.");
      return;
    }
    if (STATE.vigor < meta.vigor || STATE.gold < meta.gold) {
      UI.notify("Recursos Insuficientes", `Enviar este ofício exige ${meta.vigor} de Vigor${meta.gold ? ` e ${meta.gold} Ouro` : ""}.`);
      return;
    }

    STATE.vigor -= meta.vigor;
    STATE.gold -= meta.gold;
    STATE.pendingFiefOrders.push(actionId);
    SoundFX.play("bells");

    const curCity = this.getCityObj(STATE.currentCityId, STATE.kingdom);
    const msg = `De ${curCity.name} [Vila], você selou e despachou um ofício senhorial para **${meta.title}** (-${meta.vigor} Vigor${meta.gold ? `, -${meta.gold} Ouro` : ""}). A ordem será cumprida na virada do próximo ano.`;
    this.addLog(`📜 OFÍCIO SENHORIAL EXPEDIDO: ${msg}`, "epoch");
    UI.notify("📜 Ofício Enviado!", msg, "bells");
    Storage.saveToSlot(CONFIG.activeSlot);
    UI.renderAll();
  },

  processPendingFiefOrders() {
    if (!STATE || !Array.isArray(STATE.pendingFiefOrders) || STATE.pendingFiefOrders.length === 0) return;
    const orders = [...STATE.pendingFiefOrders];
    STATE.pendingFiefOrders = [];
    orders.forEach(actionId => {
      const meta = this.getNobleActionMeta(actionId);
      if (meta) {
        STATE.vigor += meta.vigor;
        STATE.gold += meta.gold;
        this.addLog(`📬 CUMPRIMENTO DE OFÍCIO SENHORIAL: Seus intendentes na cidade executaram a ordem de **${meta.title}** despachada no ano anterior.`, "epoch");
        this.performNobleRealmAction(actionId, true);
      }
    });
  }
});