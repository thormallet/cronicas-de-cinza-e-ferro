/* ============================================================================
   [CRIADOR DE PERSONAGEM] — ficha de herói, sorteio ponderado e início do jogo (Creator)
   ============================================================================ */
const Creator = {
  points: 10,
  attrs: { forca: 20, destreza: 20, intelecto: 20, carisma: 20, beleza: 25, saude: 45, fe: 20, sorte: 20 },

  init() {
    SoundFX.play("click");
    const kSel = document.getElementById("cr-kingdom");
    kSel.innerHTML = DATA.kingdoms.map(k => `<option value="${k.id}">${k.name} (${k.law})</option>`).join("");
    this.rerollAll();
    UI.showScreen("screen-create");
  },

  randomName() {
    const sexEl = document.getElementById("cr-sex");
    const sex = sexEl ? sexEl.value : "M";
    const kId = document.getElementById("cr-kingdom") ? document.getElementById("cr-kingdom").value : "valois";
    document.getElementById("cr-name").value = Utils.genName(sex, kId);
    this.updateCrestPreview();
  },

  updateCrestPreview() {
    const name = document.getElementById("cr-name").value.trim() || "Aldous de Valença";
    const sex = document.getElementById("cr-sex") ? document.getElementById("cr-sex").value : "M";
    const sClass = document.getElementById("cr-class") ? document.getElementById("cr-class").value : "plebeu";
    const surname = Utils.extractSurname(name);
    const crest = Utils.getCrestData(surname);
    const kId = document.getElementById("cr-kingdom") ? document.getElementById("cr-kingdom").value : "valois";
    const previewBox = document.getElementById("cr-hero-preview");
    if (previewBox) {
      previewBox.innerHTML = `
        ${Utils.renderPortraitHTML({ name, surname, sex, age: 20, socialClass: sClass, birthKingdom: kId })}
        <div>
          <div style="font-weight:bold;font-size:1.05rem">${Utils.renderCrestHTML(surname)}${name}</div>
          <div style="font-size:0.84rem;color:var(--text-muted)">Casa <strong>${surname}</strong> • Lema: <em>"${crest.motto}"</em></div>
        </div>
      `;
    }
  },

  updateKingdomInfo() {
    const kId = document.getElementById("cr-kingdom").value;
    const k = DATA.kingdoms.find(x => x.id === kId) || DATA.kingdoms[0];
    document.getElementById("cr-kingdom-desc").textContent = `${k.desc} Taxa feudal base: ${Math.round(k.tax * 100)}%.`;
    this.updateCrestPreview();
  },

  renderAttrs() {
    document.getElementById("cr-points").textContent = this.points;
    const box = document.getElementById("cr-attrs");
    box.innerHTML = DATA.attributes.map(a => `
      <div class="attr-row">
        <div class="attr-header">
          <div><svg class="attr-icon-svg"><use href="#ico-${a.id}"/></svg><strong>${a.name}</strong> <small style="color:var(--text-muted)">(${a.desc})</small></div>
          <div class="attr-controls">
            <button type="button" onclick="window.Creator.modAttr('${a.id}', -1)">-</button>
            <button type="button" onclick="window.Creator.modAttr('${a.id}', 1)">+</button>
          </div>
        </div>
        <div class="stat-bar"><div class="stat-fill attr" style="width:${this.attrs[a.id]}%"></div></div>
      </div>
    `).join("");
  },

  modAttr(id, delta) {
    const step = 5;
    if (delta > 0 && this.points <= 0) return;
    if (delta < 0 && this.attrs[id] <= 10) return;
    if (delta > 0 && this.attrs[id] >= 85) return;
    SoundFX.play("click");
    this.attrs[id] += delta * step;
    this.points -= delta;
    this.renderAttrs();
  },

  randomize() {
    SoundFX.play("click");
    const roll = Math.random() * 100;
    const socialClass = roll < 70 ? "plebeu" : (roll < 95 ? "media" : "nobre");
    document.getElementById("cr-class").value = socialClass;
    document.getElementById("cr-sex").value = Math.random() < 0.5 ? "M" : "F";
    document.getElementById("cr-kingdom").value = Utils.pick(DATA.kingdoms).id;
    this.randomName();
    this.updateKingdomInfo();

    this.attrs = { forca: 15, destreza: 15, intelecto: 15, carisma: 15, beleza: 20, saude: 45, fe: 15, sorte: 15 };
    this.points = 10;
    const keys = Object.keys(this.attrs);
    while (this.points > 0) {
      const k = Utils.pick(keys);
      if (this.attrs[k] < 80) { this.attrs[k] += 5; this.points--; }
    }

    this.renderAttrs();
  },

  rerollAll() {
    this.randomize();
  },

  startGame() {
    SoundFX.play("bells");
    const sex = document.getElementById("cr-sex").value;
    const kingdom = document.getElementById("cr-kingdom").value;
    const name = document.getElementById("cr-name").value.trim() || Utils.genName(sex, kingdom);
    const sClass = document.getElementById("cr-class").value;

    const surname = Utils.extractSurname(name);
    const finalAttrs = { ...this.attrs };

    const secretTraits = Utils.genHiddenTraits();
    secretTraits.forEach(tId => {
      const tObj = [...DATA.traits.good, ...DATA.traits.bad].find(x => x.id === tId);
      if (tObj && tObj.mods) {
        Object.entries(tObj.mods).forEach(([k, v]) => {
          finalAttrs[k] = Utils.clamp(finalAttrs[k] + v, 5, 100);
        });
      }
    });

    const startGold = sClass === "nobre" ? 320 : (sClass === "media" ? 95 : 18);
    const startRep = sClass === "nobre" ? 3 : (sClass === "media" ? 1 : 0);
    const startHonor = sClass === "nobre" ? 65 : 50;

    const kCities = (DATA.cities && DATA.cities[kingdom]) ? DATA.cities[kingdom] : [{ id: "cap", name: "Capital", tier: "capital" }];
    const birthCity = Utils.pick(kCities);

    let initInventory = [];
    let initItemInstances = [];
    if (sClass === "nobre") {
      initInventory.push("solar_nobre");
      initItemInstances.push({
        uid: "it_init_solar",
        id: "solar_nobre",
        state: "bom",
        kingdom,
        cityId: birthCity.id,
        buyPrice: 900,
        mortgaged: false
      });
    } else if (sClass === "media") {
      initInventory.push("casa_urbana");
      initItemInstances.push({
        uid: "it_init_casa",
        id: "casa_urbana",
        state: "bom",
        kingdom,
        cityId: birthCity.id,
        buyPrice: 120,
        mortgaged: false
      });
    }

    let familyTitleObj = null;
    if (sClass === "nobre") {
      const kNob = (DATA.kingdomNobility && DATA.kingdomNobility[kingdom]) ? DATA.kingdomNobility[kingdom] : null;
      const titlesPool = (kNob && Array.isArray(kNob.titles)) ? kNob.titles : DATA.nobleTitles;
      familyTitleObj = Utils.pick(titlesPool);
    }

    const fatherTitle = familyTitleObj ? familyTitleObj.titleM : null;
    const motherTitle = familyTitleObj ? familyTitleObj.titleF : null;
    const father = Utils.genNPC("Pai", Utils.rand(22, 38), "M", surname, sClass, null, fatherTitle, kingdom);
    const mother = Utils.genNPC("Mãe", Utils.rand(20, 34), "F", surname, sClass, null, motherTitle, kingdom);
    const siblingTitle = familyTitleObj ? (Math.random() < 0.5 ? `Herdeiro de ${familyTitleObj.titleM}` : `Herdeira de ${familyTitleObj.titleF}`) : null;
    const sibling = Utils.genNPC("Irmão/Irmã", Utils.rand(1, 5), null, surname, sClass, null, siblingTitle, kingdom);
    [father, mother, sibling].forEach(fam => {
      fam.cityId = birthCity.id;
      fam.birthCityId = birthCity.id;
    });
    const heroAppearance = inheritChildAppearance(father, mother, sex, "player_" + name);
    sibling.appearance = inheritChildAppearance(father, mother, sibling.sex, sibling.id);

    STATE = {
      generation: 1,
      alive: true,
      isDead: false,
      name, sex, surname,
      appearance: heroAppearance,
      scars: [],
      age: 0,
      year: Utils.rand(1120, 1240),
      kingdom,
      birthKingdom: kingdom,
      birthCityId: birthCity.id,
      currentCityId: birthCity.id,
      visitedCities: [birthCity.id],
      visitedKingdoms: [kingdom],
      travelCount: 0,
      travelMode: "regular",
      pendingFiefOrders: [],
      socialClass: sClass,
      job: "crianca",
      gold: startGold,
      debt: 0,
      reputation: startRep,
      honor: startHonor,
      hp: finalAttrs.saude,
      maxHp: finalAttrs.saude,
      vigor: 100,
      maxVigor: 100,
      healthCareUsedThisYear: false,
      activityYearCount: {},
      attrs: finalAttrs,
      traits: secretTraits,
      npcs: [father, mother, sibling],
      inventory: initInventory,
      propertyMeta: [],
      itemInstances: initItemInstances,
      activeLoans: [],
      bankerLoans: [],
      pregnancies: [],
      pendingBirthQueue: [],
      successionLaw: "primogenitura",
      designatedHeirId: null,
      wealthTier: sClass === "nobre" ? "nobre" : (sClass === "media" ? "burgues" : "plebeu"),
      abandonedChildrenCount: 0,
      duelsWon: 0,
      bargainsWon: 0,
      bankerProfits: 0,
      flags: [],
      history: [],
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
      nobleTitleLevel: familyTitleObj ? familyTitleObj.level : 0,
      nobleTitle: familyTitleObj ? (sex === "M" ? `Herdeiro de ${familyTitleObj.titleM}` : `Herdeira de ${familyTitleObj.titleF}`) : "",
      nobleDemeritTurns: 0,
      fief: { prosperity: 55, loyalty: 60, defense: 50, influence: 50, peasantry: 60 },
      visibleJobIds: [],
      visibleGuildIds: [],
      visibleJobActivityIds: [],
      jobRank: 0,
      jobPerformance: 50
    };

    Engine.refreshVisibleJobsAndGuilds();
    document.getElementById("log-container").innerHTML = "";
    Engine.addLog(`Ano ${STATE.year} — Crônica Inaugural: Em **${birthCity.name}** [${Engine.getCityTierLabel(birthCity.tier)}], nas terras de ${Engine.getKingdom().name}, você veio ao mundo nos braços de ${mother.name} e sob a guarda de ${father.name}, trazendo no sangue o brasão da Casa ${surname} (${Engine.getClassLabel(sClass)}).`, "year-header");
    Storage.saveToSlot(CONFIG.activeSlot);
    UI.showScreen("screen-game");
    UI.renderAll();
  }
};
