/* ============================================================================
   [RELAÇÕES · SUCESSÃO] — sucessão dinástica ao herdeiro (succeedWithHeir)
   ============================================================================ */
Object.assign(Engine, {
  succeedWithHeir(childId) {
    const heir = STATE.npcs.find(n => n.id === childId);
    if (!heir) return;
    SoundFX.play("bells");

    const k = this.getKingdom();
    const inheritanceRatio = k.id === "serenissima" ? 0.75 : 1.0;
    const inheritedGold = Math.floor(STATE.gold * inheritanceRatio);
    const inheritedDebt = STATE.debt;
    const inheritedRep = Math.round(STATE.reputation * 0.5);
    const prevName = STATE.name;

    const inheritedNpcs = STATE.npcs
      .filter(n => n.alive && n.id !== heir.id)
      .map(n => ({
        ...n,
        role: n.role === "Filho"
          ? "Irmão/Irmã"
          : (n.role === "Cônjuge"
              ? (n.sex === "F" ? "Mãe" : "Pai")
              : (["Corte", "Rival", "Mentor", "Amigo"].includes(n.role) ? n.role : "Conhecido")),
        maritalStatus: n.role === "Cônjuge" ? "Viúvo(a)" : n.maritalStatus,
        memory: `Lembra-se do seu predecessor, ${prevName}.`
      }));

    let heirJob = "crianca";
    let heirJobRank = 0;

    STATE = {
      generation: STATE.generation + 1,
      alive: true,
      isDead: false,
      name: heir.name,
      sex: heir.sex,
      surname: heir.surname || STATE.surname,
      appearance: heir.appearance || getOrCreateAppearanceDNA(heir),
      scars: heir.scars || [],
      age: heir.age,
      year: STATE.year,
      kingdom: STATE.kingdom,
      birthKingdom: heir.birthKingdom || STATE.kingdom,
      birthCityId: heir.birthCityId || heir.cityId || STATE.currentCityId,
      currentCityId: heir.cityId || STATE.currentCityId,
      visitedCities: Array.isArray(STATE.visitedCities) ? [...new Set([...STATE.visitedCities, heir.cityId || STATE.currentCityId])] : [heir.cityId || STATE.currentCityId],
      visitedKingdoms: Array.isArray(STATE.visitedKingdoms) ? [...new Set([...STATE.visitedKingdoms, STATE.kingdom])] : [STATE.kingdom],
      travelCount: STATE.travelCount || 0,
      travelMode: STATE.travelMode || "regular",
      pendingFiefOrders: [...(STATE.pendingFiefOrders || [])],
      propertyMeta: Array.isArray(STATE.propertyMeta) ? STATE.propertyMeta.map(m => ({ ...m })) : [],
      socialClass: STATE.socialClass,
      job: heirJob,
      gold: inheritedGold,
      debt: inheritedDebt,
      reputation: inheritedRep,
      honor: 50,
      hp: heir.attrs.saude,
      maxHp: heir.attrs.saude,
      vigor: 100,
      maxVigor: 100,
      attrs: { ...heir.attrs },
      traits: heir.hiddenTraits || Utils.genHiddenTraits(),
      npcs: inheritedNpcs,
      inventory: [...STATE.inventory],
      flags: [`Herdeiro de ${prevName}`],
      history: [...STATE.history],
      log: [],
      usedEvents: [],
      activeEvent: null,
      specialTrial: null,
      pregnancy: null,
      pendingChild: null,
      guildTraining: null,
      completedGuilds: [],
      expelledEcclesiastical: false,
      careerChanges: 0,
      nobleTitleLevel: STATE.socialClass === "nobre" ? Math.max(1, STATE.nobleTitleLevel || 1) : 0,
      fief: STATE.fief ? { ...STATE.fief } : { prosperity: 55, loyalty: 60, defense: 50, influence: 50, peasantry: 60 },
      visibleJobIds: [],
      visibleGuildIds: [],
      visibleJobActivityIds: [],
      jobRank: heirJobRank,
      jobPerformance: 55
    };

    this.refreshVisibleJobsAndGuilds();
    this.syncFamilyNobleTitles();
    document.getElementById("log-container").innerHTML = "";
    this.addLog(`Ano ${STATE.year} — SUCESSÃO DINÁSTICA (${STATE.generation}ª Geração): Você assumiu o legado da Casa ${STATE.surname} como ${STATE.name} aos ${STATE.age} anos!`, "year-header");
    Engine.ensureColleagues();
    Storage.saveToSlot(CONFIG.activeSlot);
    UI.showScreen("screen-game");
    UI.renderAll();
  }
});
