/* ============================================================================
   [ENGINE · EDIÇÃO EXPLORADOR · VIAGENS E MIGRAÇÃO] — deslocamentos e fronteiras
   ============================================================================ */
Object.assign(Engine, {
  willLoseOccupationOnMove(destCityTier, isCrossKingdom = false) {
    if (!STATE || !this.hasActiveOccupation()) return false;
    if (STATE.guildTraining) return true;
    const rule = this.getJobLocalityRule(STATE.job);
    if (isCrossKingdom) return !rule.crossKingdom;
    if (!rule.portable) return true;
    return !this.isJobAllowedInCityTier(STATE.job, destCityTier);
  },

  handleOccupationOnMove(destCityObj, isCrossKingdom = false) {
    if (!this.willLoseOccupationOnMove(destCityObj.tier, isCrossKingdom)) {
      if (isCrossKingdom && STATE.job !== "crianca") {
        STATE.jobPerformance = Utils.clamp((STATE.jobPerformance || 50) - 12, 20, 100);
      }
      this.refreshVisibleJobsAndGuilds();
      return null;
    }
    const lostLabel = this.getOccupationLabel();
    STATE.job = "crianca";
    STATE.jobRank = 0;
    STATE.jobPerformance = 50;
    STATE.guildTraining = null;
    STATE.npcs = STATE.npcs.filter(n => n.role !== "Colega de Ofício");
    this.refreshVisibleJobsAndGuilds();
    return lostLabel;
  },

  syncFamilyLocationOnMove(oldCityId, oldKingdomId, newCityId, newKingdomId) {
    if (!STATE || !Array.isArray(STATE.npcs)) return;
    STATE.npcs.forEach(n => {
      if (!n.alive) return;
      if (!n.cityId) n.cityId = oldCityId;
      if (!n.kingdom) n.kingdom = oldKingdomId;
      const travelsWithPlayer = n.role === "Cônjuge" || (n.role === "Filho" && n.age < 16);
      if (travelsWithPlayer) {
        n.cityId = newCityId;
        n.kingdom = newKingdomId;
      }
    });
  },

  getCityTravelCost(targetCityId) {
    const curCity = this.getCityObj(STATE.currentCityId, STATE.kingdom);
    const destCity = this.getCityObj(targetCityId, STATE.kingdom);
    return this.getTravelCost(curCity, destCity);
  },

  getTravelCost(fromCity, toCity) {
    if (!fromCity || !toCity || fromCity.id === toCity.id) return { vigor: 0, gold: 0, deps: 0 };
    let vigor = 22;
    let baseGold = 55;
    if (fromCity.tier === "vila" && toCity.tier === "vila") {
      vigor = 18; baseGold = 38;
    } else if (fromCity.tier === "capital" || toCity.tier === "capital") {
      vigor = 28; baseGold = 95;
    } else if (fromCity.tier === "cidade" && toCity.tier === "cidade") {
      vigor = 24; baseGold = 70;
    }
    const sClass = STATE ? STATE.socialClass : "plebeu";
    const classMult = sClass === "nobre" ? 1.85 : (sClass === "media" ? 1.35 : 1.0);
    const deps = this.getTravelingDependentsCount ? this.getTravelingDependentsCount() : 0;
    const depUnit = sClass === "nobre" ? 28 : (sClass === "media" ? 18 : 12);
    let depGold = deps * depUnit;
    if (this.hasActiveItem && this.hasActiveItem("carruagem_luxo")) {
      depGold = 0;
      vigor = Math.max(8, vigor - 6);
    }
    let gold = Math.round(baseGold * classMult) + depGold;

    const itMeta = (!STATE.guildTraining && this.getItinerantMeta) ? this.getItinerantMeta(STATE.job) : null;
    if (itMeta) {
      vigor = Math.round(vigor * (itMeta.travelVigorMult || 0.85));
      gold = Math.round(gold * (itMeta.travelGoldMult || 0.80));
    }
    if (this.hasAnyActiveItem && this.hasAnyActiveItem(["cavalo_guerra", "cavalo_carga"])) {
      vigor = Math.max(8, vigor - 4);
      gold = Math.round(gold * 0.80);
    }
    if (this.hasActiveItem && this.hasActiveItem("astrolabio_bronze")) {
      gold = Math.round(gold * 0.85);
    }
    const mode = this.getTravelModeObj ? this.getTravelModeObj() : { goldMult: 1, vigorMult: 1 };
    vigor = Math.max(8, Math.round(vigor * (mode.vigorMult || 1)));
    gold = Math.max(10, Math.round(gold * (mode.goldMult || 1)));
    return { vigor, gold, deps };
  },

  getKingdomTravelCost(targetKingdomId) {
    const curK = STATE ? STATE.kingdom : "valois";
    const lexA = (DATA.kingdomLexicon && DATA.kingdomLexicon[curK]) || {};
    const lexB = (DATA.kingdomLexicon && DATA.kingdomLexicon[targetKingdomId]) || {};
    const sameGroup = !!(lexA.group && lexA.group === lexB.group);
    let vigor = sameGroup ? 38 : 48;
    let baseGold = sameGroup ? 240 : 380;

    const sClass = STATE ? STATE.socialClass : "plebeu";
    const classMult = sClass === "nobre" ? 1.75 : (sClass === "media" ? 1.30 : 1.0);
    const deps = this.getTravelingDependentsCount ? this.getTravelingDependentsCount() : 0;
    const depUnit = sClass === "nobre" ? 65 : (sClass === "media" ? 42 : 28);
    let gold = Math.round(baseGold * classMult) + deps * depUnit;

    const itMeta = (!STATE.guildTraining && this.getItinerantMeta) ? this.getItinerantMeta(STATE.job) : null;
    if (itMeta) {
      const rule = this.getJobLocalityRule(STATE.job);
      const discGold = rule.crossKingdom ? (itMeta.travelGoldMult || 0.75) : 0.88;
      vigor = Math.round(vigor * (itMeta.travelVigorMult || 0.85));
      gold = Math.round(gold * discGold);
    }
    if (this.hasActiveItem && this.hasActiveItem("navio_mercante")) {
      vigor = Math.max(14, vigor - 12);
      gold = Math.round(gold * 0.55);
    } else if (this.hasAnyActiveItem && this.hasAnyActiveItem(["barco_pesca", "carruagem_luxo"])) {
      vigor = Math.max(14, vigor - 6);
      gold = Math.round(gold * 0.75);
    } else if (this.hasActiveItem && this.hasActiveItem("cavalo_guerra")) {
      vigor = Math.max(14, vigor - 5);
      gold = Math.round(gold * 0.88);
    }
    const mode = this.getTravelModeObj ? this.getTravelModeObj() : { goldMult: 1, vigorMult: 1 };
    vigor = Math.max(14, Math.round(vigor * (mode.vigorMult || 1)));
    gold = Math.max(60, Math.round(gold * (mode.goldMult || 1)));
    return { vigor, gold, sameGroup, deps };
  },

  maybeTriggerTravelEncounter() {
    if (!STATE || STATE.activeEvent || STATE.specialTrial || !Array.isArray(DATA.travelEvents) || !DATA.travelEvents.length) return false;
    const mode = this.getTravelModeObj ? this.getTravelModeObj() : { riskBonus: 0 };
    const chance = Utils.clamp(0.55 + (mode.riskBonus || 0), 0.20, 0.85);
    if (Math.random() < chance) {
      STATE.activeEvent = Utils.pick(DATA.travelEvents);
      UI.renderEventModal();
      return true;
    }
    return false;
  },

  travelToCity(targetCityId) {
    this.ensureVigorFields();
    if (STATE.age < 16) {
      UI.closeDialog();
      UI.notify("Menor de Idade (16+ anos)", "Crianças e jovens menores de 16 anos não podem liderar viagens entre localidades.");
      return;
    }
    const curCity = this.getCityObj(STATE.currentCityId, STATE.kingdom);
    const destCity = this.getCityObj(targetCityId, STATE.kingdom);
    if (!destCity || curCity.id === destCity.id) {
      UI.closeDialog();
      return;
    }
    const { vigor: vigorCost, gold: goldCost } = this.getTravelCost(curCity, destCity);
    if (STATE.vigor < vigorCost) {
      UI.closeDialog();
      UI.notify("Vigor Insuficiente", `A jornada até ${destCity.name} exige ${vigorCost} de Vigor.`);
      return;
    }
    if (STATE.gold < goldCost) {
      UI.closeDialog();
      UI.notify("🪙 Fundos Insuficientes", "Você não possui moedas suficientes para custear a passagem e provisões desta viagem.", "fail");
      return false;
    }

    const mode = this.getTravelModeObj();
    const oldCityId = STATE.currentCityId;
    const wasDiscovered = Array.isArray(STATE.visitedCities) && STATE.visitedCities.includes(destCity.id);
    STATE.vigor -= vigorCost;
    STATE.gold -= goldCost;
    STATE.currentCityId = destCity.id;
    STATE.travelCount = (STATE.travelCount || 0) + 1;
    if (mode.honorBonus) STATE.honor = Utils.clamp(STATE.honor + mode.honorBonus, 0, 100);
    if (!wasDiscovered) {
      if (this.hasActiveItem && this.hasActiveItem("astrolabio_bronze")) {
        STATE.gold += 15;
      }
      if (this.hasActiveItem && this.hasActiveItem("carruagem_luxo")) {
        STATE.honor = Utils.clamp(STATE.honor + 2, 0, 100);
      }
    }

    this.syncFamilyLocationOnMove(oldCityId, STATE.kingdom, destCity.id, STATE.kingdom);
    const lostOcc = this.handleOccupationOnMove(destCity, false);
    const discNote = this.registerLocationDiscovery ? this.registerLocationDiscovery(destCity, STATE.kingdom, false) : "";
    UI.closeDialog();
    SoundFX.play("click");

    const tierLabel = this.getCityTierLabel(destCity.tier);
    const lostNote = lostOcc ? ` Ao deixar sua antiga comarca, você teve de abandonar o vínculo fixo em **${lostOcc}**.` : "";
    const msg = `Via ${mode.icon} **${mode.name}**, você viajou de ${curCity.name} para **${destCity.name}** [${tierLabel}] (-${vigorCost} Vigor, -${goldCost} Ouro). ${destCity.desc}${lostNote}${discNote}`;
    this.addLog(`🧭 JORNADA PELO REINO: ${msg}`, lostOcc ? "epoch" : "good");
    this.maybeTriggerTravelEncounter();
    if (this.checkAchievements) this.checkAchievements();
    Storage.saveToSlot(CONFIG.activeSlot);
    UI.renderAll();
  },

  travelToKingdom(targetKingdomId) {
    this.ensureVigorFields();
    if (!targetKingdomId || targetKingdomId === STATE.kingdom) {
      UI.closeDialog();
      return;
    }
    if (STATE.age < 16) {
      UI.closeDialog();
      UI.notify("Menor de Idade (16+ anos)", "Você precisa atingir a maioridade plena (16 anos) para liderar uma expedição rumo a outro Reino.");
      return;
    }
    const targetK = DATA.kingdoms.find(k => k.id === targetKingdomId);
    if (!targetK) return;
    const { vigor: vCost, gold: gCost } = this.getKingdomTravelCost(targetKingdomId);
    if (STATE.vigor < vCost) {
      UI.closeDialog();
      UI.notify("Vigor Insuficiente", `A travessia até ${targetK.name} exige ${vCost} de Vigor.`);
      return;
    }
    if (STATE.gold < gCost) {
      UI.closeDialog();
      UI.notify("🪙 Fundos Insuficientes", "Você não possui moedas suficientes para custear a passagem e provisões desta viagem.", "fail");
      return false;
    }

    const mode = this.getTravelModeObj();
    const oldK = this.getKingdom();
    const oldCityId = STATE.currentCityId;
    const destCities = this.getKingdomCities(targetKingdomId);
    const arrivalCity = destCities.find(c => c.tier === "cidade") || destCities[0];

    STATE.vigor -= vCost;
    STATE.gold -= gCost;
    STATE.kingdom = targetKingdomId;
    STATE.currentCityId = arrivalCity.id;
    STATE.travelCount = (STATE.travelCount || 0) + 1;
    if (mode.honorBonus) STATE.honor = Utils.clamp(STATE.honor + mode.honorBonus, 0, 100);
    STATE.pendingFiefOrders = [];
    this.syncFamilyLocationOnMove(oldCityId, oldK.id, arrivalCity.id, targetKingdomId);

    const lostOcc = this.handleOccupationOnMove(arrivalCity, true);
    const discNote = this.registerLocationDiscovery ? this.registerLocationDiscovery(arrivalCity, targetKingdomId, true) : "";

    let nobleNote = "";
    if (STATE.socialClass === "nobre" && (STATE.nobleTitleLevel || 0) > 1) {
      STATE.nobleTitleLevel = 1;
      if (STATE.fief) {
        STATE.fief.influence = Math.min(35, STATE.fief.influence);
        STATE.fief.loyalty = Math.min(45, STATE.fief.loyalty);
      }
      nobleNote = ` Como linhagem recém-chegada a uma nova Coroa, sua patente foi convertida ao grau inicial de **${this.getNobleTitleLabel()}**.`;
    }

    STATE.npcs = STATE.npcs.filter(n => n.role !== "Corte" && n.role !== "Colega de Ofício");
    if (STATE.socialClass === "nobre") {
      this.syncFamilyNobleTitles();
      this.ensureCourtMembers();
    }
    if (this.hasActiveOccupation()) {
      this.ensureColleagues(true);
    }

    const migFlag = `Emigrou para ${targetK.name}`;
    if (!STATE.flags.includes(migFlag)) STATE.flags.push(migFlag);

    UI.closeDialog();
    SoundFX.play("bells");
    const lostNote = lostOcc ? ` Sua antiga ocupação (${lostOcc}) ficou para trás em ${oldK.name}.` : "";
    const msg = `Cruzando mares e fronteiras via ${mode.icon} **${mode.name}** (-${vCost} Vigor, -${gCost} Ouro), você deixou ${oldK.name} e estabeleceu-se em **${arrivalCity.name}** [${this.getCityTierLabel(arrivalCity.tier)}], nas terras de **${targetK.name}**!${lostNote}${nobleNote}${discNote}`;
    this.addLog(`🌍 MIGRAÇÃO ENTRE REINOS: ${msg}`, "epoch");
    if (!this.maybeTriggerTravelEncounter()) {
      UI.notify(`🌍 Chegada a ${targetK.name}`, msg, "bells");
    }
    Storage.saveToSlot(CONFIG.activeSlot);
    UI.renderAll();
  },

  openTravelDialog() {
    this.ensureVigorFields();
    if (STATE.age < 16) {
      UI.notify("Viagens Bloqueadas na Infância/Juventude", `Você tem ${STATE.age} anos. Apenas personagens com 16 anos ou mais podem viajar pelas estradas e mares do mundo.`);
      return;
    }
    const cities = this.getKingdomCities(STATE.kingdom);
    const curCity = this.getCityObj(STATE.currentCityId, STATE.kingdom);
    const hasHorse = Array.isArray(STATE.inventory) && STATE.inventory.includes("cavalo_guerra");
    const itMeta = (!STATE.guildTraining && this.getItinerantMeta) ? this.getItinerantMeta(STATE.job) : null;
    const deps = this.getTravelingDependentsCount ? this.getTravelingDependentsCount() : 0;
    const curMode = this.getTravelModeObj();
    const spec = (DATA.kingdomSpecialties && DATA.kingdomSpecialties[STATE.kingdom]) || null;

    const modesHtml = (DATA.travelModes || []).map(m => `
      <button type="button" class="${m.id === curMode.id ? 'primary' : ''}" style="padding:0.35rem 0.5rem;font-size:0.78rem" onclick="window.Engine.setTravelMode('${m.id}','openTravelDialog')">
        ${m.icon} ${m.name}
      </button>
    `).join("");

    const specBtn = spec
      ? `<button type="button" onclick="window.Engine.performLocalSpecialty(true)">${spec.icon} <strong>Especialidade Local: ${spec.name}</strong> <small>(-12⚡ / -${spec.costGold}🪙 • +Ouro e Atributo)</small></button>`
      : "";

    const citiesHtml = cities.map(c => {
      const isHere = c.id === curCity.id;
      const visited = STATE.visitedCities.includes(c.id);
      const tBadge = c.tier === "capital" ? "👑 Capital" : (c.tier === "cidade" ? "🏛️ Cidade" : "🏘️ Vila");
      const cost = this.getTravelCost(curCity, c);
      const loseJob = !isHere && this.willLoseOccupationOnMove(c.tier, false);
      const newBadge = !visited ? " • ✨ Inédita (+Bônus)" : "";
      const costTag = isHere ? "(Atual)" : `(-${cost.vigor}⚡ / -${cost.gold}🪙${newBadge}${loseJob ? " • ⚠️ Perde Ofício" : ""})`;
      return `
        <button type="button" class="${c.tier === 'capital' ? 'primary' : ''}" ${isHere ? "disabled" : ""} onclick="window.Engine.travelToCity('${c.id}')">
          ${tBadge}: <strong>${c.name}</strong> <small>${costTag}</small>
        </button>
      `;
    }).join("");

    document.getElementById("dialog-title").textContent = `🧭 Mapa & Diário — ${this.getKingdom().name}`;
    document.getElementById("dialog-msg").innerHTML =
      `Local atual: <strong>${curCity.name} (${this.getCityTierLabel(curCity.tier)})</strong> • Diário: <strong>${STATE.visitedCities.length}/50 comarcas</strong> | <strong>${STATE.visitedKingdoms.length}/10 reinos</strong>.<br>` +
      `<small>Comitiva familiar: <strong>+${deps} dependente(s)</strong> • Estamento: <strong>${this.getClassLabel(STATE.socialClass)}</strong>${hasHorse ? " • 🐎 <em>Destriero (-Vigor/-Ouro)</em>" : ""}${itMeta ? ` • ${itMeta.badge} <em>(Desconto Itinerante)</em>` : ""}.</small>` +
      `<div style="display:flex;gap:0.35rem;flex-wrap:wrap;margin:0.45rem 0 0.2rem">${modesHtml}</div>` +
      `<small style="display:block;color:var(--text-muted)">Modo selecionado: <strong>${curMode.icon} ${curMode.name}</strong> — ${curMode.desc}</small>` +
      `<div class="travel-grid">${specBtn}${citiesHtml}</div>`;

    document.getElementById("dialog-buttons").innerHTML =
      `<button type="button" class="primary" onclick="window.Engine.openKingdomTravelDialog()">🌍 Expedição para Outro Reino (${STATE.visitedKingdoms.length}/10)</button>` +
      `<button type="button" onclick="window.UI.closeDialog()">Fechar</button>`;

    document.getElementById("dialog-backdrop").classList.add("active");
  },

  openKingdomTravelDialog() {
    this.ensureVigorFields();
    if (STATE.age < 16) {
      UI.notify("Viagens Bloqueadas na Infância/Juventude", "Apenas personagens com 16 anos ou mais podem liderar expedições entre Reinos.");
      return;
    }
    const otherKingdoms = DATA.kingdoms.filter(k => k.id !== STATE.kingdom);
    const curMode = this.getTravelModeObj();
    const deps = this.getTravelingDependentsCount ? this.getTravelingDependentsCount() : 0;

    const kingdomsHtml = otherKingdoms.map(k => {
      const cost = this.getKingdomTravelCost(k.id);
      const visitedK = STATE.visitedKingdoms.includes(k.id);
      const destCities = this.getKingdomCities(k.id);
      const arrivalCity = destCities.find(c => c.tier === "cidade") || destCities[0];
      const loseJob = this.willLoseOccupationOnMove(arrivalCity.tier, true);
      const newTag = !visitedK ? " • ✨ Inédito" : "";
      return `
        <button type="button" onclick="window.Engine.travelToKingdom('${k.id}')">
          🌍 <strong>${k.name}</strong> <small>(-${cost.vigor}⚡ / -${cost.gold}🪙${newTag}${loseJob ? " • ⚠️ Perde Ofício" : ""})</small>
        </button>
      `;
    }).join("");

    document.getElementById("dialog-title").textContent = `🌍 Expedição entre Reinos (${STATE.visitedKingdoms.length}/10)`;
    document.getElementById("dialog-msg").innerHTML =
      `Reino atual: <strong>${this.getKingdom().name}</strong> • Modo: <strong>${curMode.icon} ${curMode.name}</strong> (+${deps} dependentes).<br>` +
      `<small>Apenas as 6 carreiras transfronteiriças (Explorador, Mercador, Corsário, Mercenário, Trovador e Embaixador) mantêm o ofício ao mudar de Reino; desbravar um reino inédito concede ouro, reputação e honra!</small>` +
      `<div class="travel-grid">${kingdomsHtml}</div>`;

    document.getElementById("dialog-buttons").innerHTML =
      `<button type="button" class="primary" onclick="window.Engine.openTravelDialog()">⬅ Voltar ao Mapa Local</button>` +
      `<button type="button" onclick="window.UI.closeDialog()">Fechar</button>`;

    document.getElementById("dialog-backdrop").classList.add("active");
  }
});
