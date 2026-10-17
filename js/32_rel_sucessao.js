/* ============================================================================
   [RELAÇÕES · SUCESSÃO] — leis dinásticas, partilha e sucessão de herdeiro
   ============================================================================ */
Object.assign(Engine, {
  setSuccessionLaw(lawId) {
    if (!DATA.successionLaws || !DATA.successionLaws[lawId]) return;
    STATE.successionLaw = lawId;
    SoundFX.play("click");
    this.addLog(`📜 LEI DE SUCESSÃO ALTERADA: A Casa ${STATE.surname} agora adota a ${DATA.successionLaws[lawId].name}.`, "normal");
    Storage.saveToSlot(CONFIG.activeSlot);
    UI.renderAll();
  },

  setDesignatedHeir(childId) {
    const child = STATE.npcs.find(n => n.id === childId && n.role === "Filho" && n.alive && !n.abandoned);
    if (!child) return;
    STATE.designatedHeirId = childId;
    SoundFX.play("bells");
    this.addLog(`👑 HERDEIRO TESTAMENTÁRIO: Você registrou formalmente **${child.name}** como seu sucessor universal por testamento.`, "good");
    Storage.saveToSlot(CONFIG.activeSlot);
    UI.renderAll();
  },

  getEligibleHeirs() {
    if (!STATE || !Array.isArray(STATE.npcs)) return [];
    const children = STATE.npcs.filter(n => n.role === "Filho" && n.alive && !n.abandoned);
    const law = STATE.successionLaw || "primogenitura";

    if (law === "designada") {
      return [...children].sort((a, b) => {
        if (a.id === STATE.designatedHeirId) return -1;
        if (b.id === STATE.designatedHeirId) return 1;
        return (b.age || 0) - (a.age || 0);
      });
    }

    const legit = children.filter(c => !c.isBastard || c.legitimacy === "legitimo");
    if (legit.length > 0) {
      return legit.sort((a, b) => (b.age || 0) - (a.age || 0));
    }

    const bastards = children.filter(c => c.legitimacy === "bastardo_reconhecido" || c.isBastard);
    return bastards.sort((a, b) => (b.age || 0) - (a.age || 0));
  },

  succeedWithHeir(childId) {
    const heir = STATE.npcs.find(n => n.id === childId);
    if (!heir) return;
    SoundFX.play("bells");

    const k = this.getKingdom();
    const lawKey = STATE.successionLaw || "primogenitura";
    const lawObj = (DATA.successionLaws && DATA.successionLaws[lawKey]) || { splitPercent: 0.85, claimCost: 30 };
    const livingLegitSiblings = STATE.npcs.filter(n => n.role === "Filho" && n.alive && !n.abandoned && (!n.isBastard || n.legitimacy === "legitimo"));

    let inheritedGold = STATE.gold;
    if (lawKey === "partilha") {
      const numShares = Math.max(1, livingLegitSiblings.length);
      inheritedGold = Math.floor(STATE.gold / numShares);
    } else if (lawKey === "designada") {
      const claimCost = lawObj.claimCost || 50;
      inheritedGold = Math.max(0, Math.floor(STATE.gold * (lawObj.splitPercent || 0.80)) - claimCost);
    } else {
      const ratio = k.id === "serenissima" ? 0.75 : (lawObj.splitPercent || 0.85);
      inheritedGold = Math.floor(STATE.gold * ratio);
    }

    const inheritedDebt = STATE.debt || 0;
    const inheritedRep = Math.round((STATE.reputation || 0) * 0.5);
    const prevName = STATE.name;

    const inheritedNpcs = STATE.npcs
      .filter(n => n.alive && n.id !== heir.id)
      .map(n => {
        const isChildOfPrev = n.role === "Filho";
        const newRole = isChildOfPrev
          ? "Irmão/Irmã"
          : (n.role === "Cônjuge"
              ? (n.sex === "F" ? "Mãe" : "Pai")
              : (["Corte", "Rival", "Mentor", "Amigo"].includes(n.role) ? n.role : "Conhecido"));
        let aff = n.affinity || 0;
        if (isChildOfPrev && lawKey === "partilha") {
          aff = Utils.clamp(aff + 25, -100, 100);
        }
        return {
          ...n,
          role: newRole,
          affinity: aff,
          maritalStatus: n.role === "Cônjuge" ? "Viúvo(a)" : n.maritalStatus,
          memory: `Lembra-se do seu predecessor, ${prevName}.`
        };
      });

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
      itemInstances: Array.isArray(STATE.itemInstances) ? STATE.itemInstances.map(x => ({ ...x })) : [],
      activeLoans: Array.isArray(STATE.activeLoans) ? STATE.activeLoans.map(x => ({ ...x })) : [],
      bankerLoans: Array.isArray(STATE.bankerLoans) ? STATE.bankerLoans.map(x => ({ ...x })) : [],
      socialClass: STATE.socialClass,
      wealthTier: STATE.wealthTier || "plebeu",
      successionLaw: STATE.successionLaw || "primogenitura",
      designatedHeirId: null,
      abandonedChildrenCount: 0,
      duelsWon: 0,
      bargainsWon: 0,
      bankerProfits: 0,
      job: heirJob,
      gold: inheritedGold,
      debt: inheritedDebt,
      reputation: inheritedRep,
      honor: 50,
      hp: heir.attrs ? heir.attrs.saude : 50,
      maxHp: heir.attrs ? heir.attrs.saude : 50,
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
      pregnancies: [],
      pendingChild: null,
      pendingBirthQueue: [],
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

    if (STATE.generation >= 5 && Storage.unlockAchievement) {
      Storage.unlockAchievement("ach_dinastia_cinco");
    }

    this.refreshVisibleJobsAndGuilds();
    this.syncFamilyNobleTitles();
    const logBox = document.getElementById("log-container");
    if (logBox) logBox.innerHTML = "";
    this.addLog(`Ano ${STATE.year} — SUCESSÃO DINÁSTICA (${STATE.generation}ª Geração): Você assumiu o legado da Casa ${STATE.surname} como ${STATE.name} aos ${STATE.age} anos sob a lei de ${lawObj.name}!`, "year-header");
    Engine.ensureColleagues();
    if (this.checkAchievements) this.checkAchievements();
    Storage.saveToSlot(CONFIG.activeSlot);
    UI.showScreen("screen-game");
    UI.renderAll();
  }
});
