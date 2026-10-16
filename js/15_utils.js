/* ============================================================================
   [UTILITÁRIOS] — nomes, brasões, retratos em HTML e geração de NPCs (Utils)
   ============================================================================ */
const Utils = {
  rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; },
  pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; },
  clamp(val, min, max) { return Math.max(min, Math.min(max, val)); },
  d50() { return this.rand(1, 50); },

  extractSurname(fullName) {
    const parts = (fullName || "").trim().split(" ");
    if (parts.length <= 1) return "de Valença";
    return parts.slice(1).join(" ");
  },

  getCrestData(surname) {
    if (DATA.familyCrests[surname]) return DATA.familyCrests[surname];
    const fallbackIcons = ["🛡️","⚜️","🦅","🦁","🐺","🦌","🏰","⚔️","🌹","☀️"];
    let hash = 0;
    const str = surname || "Casa";
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    const symbol = fallbackIcons[Math.abs(hash) % fallbackIcons.length];
    const hues = ["#5a1818","#1e3554","#1e4422","#4a3c2c","#4e1a2a","#2b303a"];
    const bg = hues[Math.abs(hash >> 3) % hues.length];
    return { symbol, bg, fg: "#f4d068", motto: `Linhagem ${str}` };
  },

  renderCrestHTML(nameOrSurname) {
    let surname = nameOrSurname || "de Valença";
    if (!DATA.familyCrests[surname] && surname.includes(" ")) {
      const candidate = this.extractSurname(surname);
      if (DATA.familyCrests[candidate]) surname = candidate;
    }
    const c = this.getCrestData(surname);
    return `<span class="fam-crest" style="background:${c.bg};color:${c.fg}" title="Brasão da Casa ${surname}: ${c.motto}">${c.symbol}</span>`;
  },

  renderPortraitHTML(person, sizeClass = "") {
    return renderRetrato(person, sizeClass);
  },

  getCulturalNamePools(kId = null) {
    const targetK = kId || (typeof STATE !== "undefined" && STATE ? STATE.kingdom : null);
    const grp = (targetK && DATA.kingdomLexicon && DATA.kingdomLexicon[targetK]) ? DATA.kingdomLexicon[targetK].group : "ocidente";
    return (DATA.culturalNames && DATA.culturalNames[grp]) ? DATA.culturalNames[grp] : { namesM: DATA.namesM, namesF: DATA.namesF, surnames: DATA.surnames };
  },

  genName(sex, kId = null) {
    const pools = this.getCulturalNamePools(kId);
    const first = sex === "M" ? this.pick(pools.namesM) : this.pick(pools.namesF);
    return `${first} ${this.pick(pools.surnames)}`;
  },

  genHiddenTraits() {
    const gPool = [...DATA.traits.good].sort(() => Math.random() - 0.5);
    const bPool = [...DATA.traits.bad].sort(() => Math.random() - 0.5);
    return [gPool[0].id, gPool[1].id, bPool[0].id];
  },

  genNPC(role, age, sex = null, surname = null, socialClass = null, jobTitle = null, nobleTitle = null, birthKingdom = null) {
    const kId = birthKingdom || (typeof STATE !== "undefined" && STATE ? STATE.kingdom : "valois");
    const kNob = (DATA.kingdomNobility && DATA.kingdomNobility[kId]) ? DATA.kingdomNobility[kId] : null;
    const titlesPool = (kNob && Array.isArray(kNob.titles)) ? kNob.titles : DATA.nobleTitles;
    const namePools = this.getCulturalNamePools(kId);
    const s = sex || (Math.random() < 0.5 ? "M" : "F");
    const first = s === "M" ? this.pick(namePools.namesM) : this.pick(namePools.namesF);
    const last = surname || this.pick(namePools.surnames);
    const hiddenTraits = this.genHiddenTraits();
    const sClass = socialClass || (Math.random() < 0.15 ? "nobre" : (Math.random() < 0.45 ? "media" : "plebeu"));
    let maritalStatus = "Solteiro(a)";
    if (role === "Pai" || role === "Mãe") maritalStatus = "Casado(a)";
    else if (role === "Cônjuge") maritalStatus = "Casado(a) com Você";
    else if (age >= 18 && role !== "Pretendente" && role !== "Filho" && Math.random() < 0.35) {
      maritalStatus = Math.random() < 0.8 ? "Casado(a)" : "Viúvo(a)";
    }

    let resolvedNobleTitle = nobleTitle;
    if (!resolvedNobleTitle && sClass === "nobre") {
      if (role === "Corte" && kNob) {
        const royalTitlesM = [kNob.princeM, ...titlesPool.map(t => t.titleM)];
        const royalTitlesF = [kNob.princeF, ...titlesPool.map(t => t.titleF)];
        resolvedNobleTitle = s === "F" ? this.pick(royalTitlesF) : this.pick(royalTitlesM);
      } else {
        const tObj = this.pick(titlesPool);
        resolvedNobleTitle = s === "F" ? tObj.titleF : tObj.titleM;
      }
    }

    let resolvedJob = jobTitle;
    if (!resolvedJob) {
      if (age < 12) {
        resolvedJob = "Sem Ofício (Criança)";
      } else if (role === "Corte" && resolvedNobleTitle) {
        resolvedJob = `Membro da Alta Corte (${resolvedNobleTitle})`;
      } else {
        const classJobs = DATA.jobs.filter(j =>
          j.id !== "crianca" &&
          !j.titular &&
          (j.tiers || []).includes(sClass) &&
          (!j.gender || j.gender === "any" || j.gender === s)
        );
        const pickedJob = classJobs.length ? this.pick(classJobs) : DATA.jobs[1];
        const ranks = pickedJob.ranks || [pickedJob.name];
        const rankIdx = age < 20 ? 0 : (age < 35 ? this.rand(0, Math.min(1, ranks.length - 1)) : this.rand(0, ranks.length - 1));
        resolvedJob = `${ranks[rankIdx]} (${pickedJob.name})`;
      }
    }

    return {
      id: "npc_" + Math.random().toString(36).substring(2, 9),
      name: `${first} ${last}`,
      surname: last,
      sex: s,
      birthKingdom: kId,
      kingdom: kId,
      cityId: (typeof STATE !== "undefined" && STATE) ? STATE.currentCityId : null,
      birthCityId: (typeof STATE !== "undefined" && STATE) ? STATE.currentCityId : null,
      role: role,
      maritalStatus: maritalStatus,
      jobTitle: resolvedJob,
      nobleTitle: resolvedNobleTitle || "",
      socialClass: sClass,
      age: age,
      alive: true,
      affinity: role === "Rival" ? this.rand(-70, -25) : (role === "Pretendente" ? this.rand(25, 55) : this.rand(35, 80)),
      hiddenTraits: hiddenTraits,
      memory: role === "Pretendente" ? "Troca olhares discretos e aguarda seu galanteio." : (role === "Colega de Ofício" ? `Compartilha o labor diário como ${resolvedJob}.` : (role === "Corte" ? `Ostenta o título de ${resolvedNobleTitle} nos salões do Reino.` : "Faz parte da sua história.")),
      attrs: {
        forca: this.rand(25, 75), destreza: this.rand(25, 75), intelecto: this.rand(25, 75),
        carisma: this.rand(25, 75), beleza: this.rand(25, 85), saude: this.rand(50, 90), fe: this.rand(25, 75), sorte: this.rand(25, 75)
      }
    };
  }
};
