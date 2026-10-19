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
    const child = STATE.npcs.find(n => n.id === childId && (n.role === "Filho" || n.role === "Filha") && n.alive && !n.abandoned);
    if (!child) return;
    STATE.designatedHeirId = childId;
    SoundFX.play("bells");
    this.addLog(`👑 HERDEIRO TESTAMENTÁRIO: Você registrou formalmente **${child.name}** como seu sucessor universal por testamento.`, "good");
    Storage.saveToSlot(CONFIG.activeSlot);
    UI.renderAll();
  },

  getEligibleHeirs() {
    if (!STATE || !Array.isArray(STATE.npcs)) return [];
    const children = STATE.npcs.filter(n => (n.role === "Filho" || n.role === "Filha") && n.alive && !n.abandoned);
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
    SoundFX.play("cathedral_bells");

    const k = this.getKingdom();
    const lawKey = STATE.successionLaw || "primogenitura";
    const lawObj = (DATA.successionLaws && DATA.successionLaws[lawKey]) || { splitPercent: 0.85, claimCost: 30 };
    const livingLegitSiblings = STATE.npcs.filter(n => (n.role === "Filho" || n.role === "Filha") && n.alive && !n.abandoned && (!n.isBastard || n.legitimacy === "legitimo"));

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

    const activeLoanTotal = (STATE.activeLoans || []).reduce((acc, l) => acc + (l.remaining || 0), 0);
    const inheritedUnlinkedDebt = Math.max(0, (STATE.debt || 0) - activeLoanTotal);
    const inheritedDebt = STATE.debt || 0;
    const inheritedRep = Math.round((STATE.reputation || 0) * 0.5);
    const prevName = STATE.name;

    const isNoble = STATE.socialClass === "nobre";
    const inheritedNpcs = STATE.npcs
      .filter(n => n.alive && n.id !== heir.id)
      .filter(n => {
        // Manter APENAS laços de sangue (mãe, pai viúvo, irmãos) e membros da Corte (se nobre)
        if (n.role === "Filho" || n.role === "Filha") return true;
        if (n.role === "Cônjuge") return true;
        if (isNoble && n.role === "Corte") return true;
        return false;
      })
      .map(n => {
        const isChildOfPrev = (n.role === "Filho" || n.role === "Filha");
        const newRole = isChildOfPrev
          ? "Irmão/Irmã"
          : (n.role === "Cônjuge"
              ? (n.sex === "F" ? "Mãe" : "Pai")
              : n.role);
        let aff = n.affinity || 0;
        if (isChildOfPrev && lawKey === "partilha") {
          aff = Utils.clamp(aff + 25, -100, 100);
        }
        return {
          ...n,
          role: newRole,
          affinity: aff,
          maritalStatus: n.role === "Cônjuge" ? "Viúvo(a)" : n.maritalStatus,
          memory: `Lembra-se com reverência do seu predecessor, ${prevName}.`
        };
      });

    // Gerar proceduralmente novos NPCs próprios para o herdeiro
    if (heir.age < 16) {
      const friendCount = Utils.rand(1, 2);
      for (let i = 0; i < friendCount; i++) {
        const friendAge = Utils.clamp(heir.age + Utils.rand(-1, 2), 2, 15);
        const friendSex = Math.random() < 0.5 ? "M" : "F";
        const friend = Utils.genNPC("Amigo", friendAge, friendSex, null, STATE.socialClass, null, null, STATE.kingdom);
        friend.cityId = heir.cityId || STATE.currentCityId;
        friend.affinity = Utils.rand(35, 65);
        friend.memory = `Amigo(a) leal dos folguedos e brincadeiras de infância de ${heir.name}.`;
        inheritedNpcs.push(friend);
      }
    } else {
      const oppSex = heir.sex === "M" ? "F" : "M";
      const suitorAge = Utils.clamp(heir.age + Utils.rand(-2, 3), 16, 45);
      const suitor = Utils.genNPC("Pretendente", suitorAge, oppSex, null, STATE.socialClass, null, null, STATE.kingdom);
      suitor.cityId = heir.cityId || STATE.currentCityId;
      suitor.affinity = Utils.rand(30, 55);
      suitor.memory = `Atraído(a) pela linhagem e virtudes da Casa ${heir.surname || STATE.surname}.`;
      inheritedNpcs.push(suitor);

      const friendCount = Utils.rand(1, 2);
      for (let i = 0; i < friendCount; i++) {
        const friendAge = Utils.clamp(heir.age + Utils.rand(-3, 3), 16, 50);
        const friendSex = Math.random() < 0.5 ? "M" : "F";
        const friend = Utils.genNPC("Amigo", friendAge, friendSex, null, STATE.socialClass, null, null, STATE.kingdom);
        friend.cityId = heir.cityId || STATE.currentCityId;
        friend.affinity = Utils.rand(40, 70);
        friend.memory = `Companheiro(a) de convívio leal de ${heir.name}.`;
        inheritedNpcs.push(friend);
      }
    }

    let heirJob = "crianca";
    let heirJobRank = 0;

    if (heir.age >= 16) {
      let foundJob = null;
      if (heir.jobId) {
        foundJob = DATA.jobs.find(j => j.id === heir.jobId);
      }
      if (!foundJob && heir.jobTitle && !heir.jobTitle.includes("Criança") && !heir.jobTitle.includes("Sem Ofício")) {
        foundJob = DATA.jobs.find(j => j.id !== "crianca" && (
          heir.jobTitle.toLowerCase().includes(j.name.toLowerCase()) ||
          (Array.isArray(j.ranks) && j.ranks.some(r => heir.jobTitle.toLowerCase().includes(r.toLowerCase())))
        ));
      }

      if (foundJob && (foundJob.tiers || []).includes(STATE.socialClass)) {
        heirJob = foundJob.id;
        if (Array.isArray(foundJob.ranks) && heir.jobTitle) {
          const rIdx = foundJob.ranks.findIndex(r => heir.jobTitle.toLowerCase().includes(r.toLowerCase()));
          heirJobRank = rIdx >= 0 ? rIdx : 0;
        } else {
          heirJobRank = 0;
        }
      } else {
        const compJobs = DATA.jobs.filter(j =>
          j.id !== "crianca" &&
          !j.titular &&
          (j.tiers || []).includes(STATE.socialClass) &&
          (!j.gender || j.gender === "any" || j.gender === heir.sex)
        );
        if (compJobs.length > 0) {
          heirJob = compJobs[0].id;
          heirJobRank = 0;
        }
      }
    }

    const inheritedFlags = [`Herdeiro de ${prevName}`];
    if (Array.isArray(STATE.flags) && STATE.flags.includes("Portador da Lâmina Ancestral")) {
      inheritedFlags.push("Portador da Lâmina Ancestral");
    }

    const heirInventory = [...(STATE.inventory || [])];
    const heirItemInstances = Array.isArray(STATE.itemInstances) ? STATE.itemInstances.map(x => ({ ...x })) : [];
    ["lamina_ancestral_valenca", "codice_hermetico"].forEach(rId => {
      if ((STATE.inventory || []).includes(rId) && !heirInventory.includes(rId)) {
        heirInventory.push(rId);
      }
      const existingInst = (STATE.itemInstances || []).find(it => it.id === rId);
      if (existingInst && !heirItemInstances.some(it => it.id === rId)) {
        heirItemInstances.push({ ...existingInst, mortgaged: false });
      }
    });

    STATE = {
      generation: STATE.generation + 1,
      alive: true,
      isDead: false,
      name: heir.name,
      sex: heir.sex,
      surname: STATE.surname,
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
      itemInstances: heirItemInstances,
      activeLoans: Array.isArray(STATE.activeLoans) ? STATE.activeLoans.map(x => ({ ...x })) : [],
      bankerLoans: Array.isArray(STATE.bankerLoans) ? STATE.bankerLoans.map(x => ({ ...x })) : [],
      socialClass: STATE.socialClass,
      wealthTier: STATE.wealthTier || "plebeu",
      successionLaw: STATE.successionLaw || "primogenitura",
      designatedHeirId: null,
      abandonedChildrenCount: 0,
      army: STATE.army ? { ...STATE.army, morale: 75, readiness: 60 } : { levies: 0, archers: 0, knights: 0, siege: 0, morale: 75, supplies: 80, readiness: 60 },
      activeWar: null,
      warsWon: STATE.warsWon || 0,
      duelsWon: 0,
      relicsInherited: Array.isArray(STATE.relicsInherited) ? [...STATE.relicsInherited] : [],
      activeDuelQTE: null,
      bargainsWon: 0,
      bankerProfits: 0,
      job: heirJob,
      gold: inheritedGold,
      debt: inheritedDebt,
      unlinkedDebt: inheritedUnlinkedDebt,
      reputation: inheritedRep,
      honor: 50,
      hp: heir.attrs ? heir.attrs.saude : 50,
      maxHp: heir.attrs ? heir.attrs.saude : 50,
      vigor: 100,
      maxVigor: 100,
      attrs: { ...heir.attrs },
      traits: heir.hiddenTraits || Utils.genHiddenTraits(),
      npcs: inheritedNpcs,
      inventory: heirInventory,
      flags: inheritedFlags,
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
      nobleTitleLevel: (STATE.socialClass === "nobre" && heir.age >= 16) ? Math.max(1, STATE.nobleTitleLevel || 1) : 0,
      nobleDemeritTurns: 0,
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
    if (typeof document !== "undefined") {
      document.body.classList.remove("memento-mori-active");
      const vig = document.getElementById("memento-vignette");
      if (vig && vig.parentNode) vig.parentNode.removeChild(vig);
    }
    UI.showScreen("screen-game");
    UI.renderAll();
  }
});
