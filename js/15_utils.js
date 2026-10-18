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
  },

  /* ============================================================================
     RADAR DE VIRTUDES EM OCTÓGONO SVG (COMPARÁVEL & ACESSÍVEL — CCF v4.4.1)
     ============================================================================ */
  renderOctagonRadarSVG(playerAttrs = {}, compareAttrs = null, compareName = "NPC") {
    const keys = ["forca", "destreza", "intelecto", "carisma", "beleza", "saude", "fe", "sorte"];
    const labels = ["Força", "Destreza", "Intelecto", "Carisma", "Beleza", "Saúde", "Fé", "Sorte"];
    const icons = ["⚔️", "🏹", "🧠", "🎭", "✨", "❤️", "🙏", "🍀"];
    const cx = 130, cy = 130, r = 78;
    const count = keys.length;

    // Círculos concêntricos de referência (25%, 50%, 75%, 100%)
    let gridPolys = "";
    [0.25, 0.5, 0.75, 1.0].forEach(level => {
      const pts = [];
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i / count) - (Math.PI / 2);
        pts.push(`${(cx + r * level * Math.cos(angle)).toFixed(1)},${(cy + r * level * Math.sin(angle)).toFixed(1)}`);
      }
      gridPolys += `<polygon points="${pts.join(" ")}" fill="none" stroke="rgba(212,163,62,${level === 1.0 ? "0.45" : "0.18"})" stroke-width="${level === 1.0 ? "1.5" : "1"}"/>`;
    });

    let axes = "";
    let labelsSvg = "";
    const pPoints = [];
    const cPoints = [];

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i / count) - (Math.PI / 2);
      const ex = cx + r * Math.cos(angle);
      const ey = cy + r * Math.sin(angle);
      axes += `<line x1="${cx}" y1="${cy}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}" stroke="rgba(212,163,62,0.22)" stroke-width="1"/>`;

      // Jogador
      const pVal = Utils.clamp(playerAttrs[keys[i]] || 20, 5, 100);
      const pRatio = pVal / 100;
      pPoints.push(`${(cx + r * pRatio * Math.cos(angle)).toFixed(1)},${(cy + r * pRatio * Math.sin(angle)).toFixed(1)}`);

      // NPC Comparado (se houver)
      if (compareAttrs) {
        const cVal = Utils.clamp(compareAttrs[keys[i]] || 20, 5, 100);
        const cRatio = cVal / 100;
        cPoints.push(`${(cx + r * cRatio * Math.cos(angle)).toFixed(1)},${(cy + r * cRatio * Math.sin(angle)).toFixed(1)}`);
      }

      // Rótulos externos
      const lx = cx + (r + 18) * Math.cos(angle);
      const ly = cy + (r + 18) * Math.sin(angle);
      labelsSvg += `
        <text x="${lx.toFixed(1)}" y="${(ly + 4).toFixed(1)}" font-family="var(--font-serif)" font-size="8.5" font-weight="700" fill="#fcebd2" text-anchor="middle">
          ${icons[i]} ${labels[i]}
        </text>
      `;
    }

    // Polígono NPC (se houver)
    let comparePoly = "";
    if (compareAttrs && cPoints.length) {
      comparePoly = `
        <polygon points="${cPoints.join(" ")}" fill="rgba(96, 165, 250, 0.28)" stroke="#60a5fa" stroke-width="2" stroke-linejoin="round" stroke-dasharray="3,2"/>
        ${cPoints.map(p => `<circle cx="${p.split(",")[0]}" cy="${p.split(",")[1]}" r="3" fill="#93c5fd" stroke="#1d4ed8" stroke-width="1"/>`).join("")}
      `;
    }

    // Legenda interativa
    let legend = "";
    if (compareAttrs) {
      legend = `
        <div style="display:flex;justify-content:center;gap:1.25rem;font-family:var(--font-serif);font-size:0.8rem;font-weight:700;margin-top:0.4rem">
          <span style="color:var(--gold-bright)">🟡 Você (Linhagem)</span>
          <span style="color:#60a5fa">🔵 ${compareName}</span>
        </div>
      `;
    }

    // Tabela acessível com valores numéricos para quem não conseguir ler o gráfico
    const rowsHtml = keys.map((k, i) => {
      const pVal = Utils.clamp(playerAttrs[k] || 20, 5, 100);
      const cVal = compareAttrs ? Utils.clamp(compareAttrs[k] || 20, 5, 100) : null;
      const cDiff = cVal !== null ? (pVal >= cVal ? `<span style="color:#4ade80">(+${pVal - cVal})</span>` : `<span style="color:#ef4444">(${pVal - cVal})</span>`) : "";
      return `
        <div style="display:flex;justify-content:space-between;padding:0.2rem 0.45rem;border-bottom:1px solid rgba(212,163,62,0.12);font-size:0.82rem">
          <span>${icons[i]} <strong>${labels[i]}</strong></span>
          <span><strong>${pVal}</strong>${compareAttrs ? ` vs ${cVal} ${cDiff}` : ""}</span>
        </div>
      `;
    }).join("");

    return `
      <div class="octagon-radar-wrapper" style="width:100%;max-width:320px;margin:0 auto;text-align:center">
        <svg viewBox="0 0 260 260" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:240px;height:auto;filter:drop-shadow(0 4px 10px rgba(0,0,0,0.85))">
          <defs>
            <radialGradient id="octGlowPlayer" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#d4a33e" stop-opacity="0.45"/>
              <stop offset="80%" stop-color="#b8860b" stop-opacity="0.18"/>
              <stop offset="100%" stop-color="#120c08" stop-opacity="0.05"/>
            </radialGradient>
          </defs>
          ${gridPolys}
          ${axes}
          ${comparePoly}
          <polygon points="${pPoints.join(" ")}" fill="url(#octGlowPlayer)" stroke="var(--gold-bright)" stroke-width="2.2" stroke-linejoin="round"/>
          ${pPoints.map(p => `<circle cx="${p.split(",")[0]}" cy="${p.split(",")[1]}" r="3" fill="#fff4dc" stroke="#b8860b" stroke-width="1.2"/>`).join("")}
          ${labelsSvg}
        </svg>
        ${legend}
        <div style="margin-top:0.55rem;background:rgba(20,13,8,0.75);border:1px solid var(--border-gold);border-radius:8px;padding:0.35rem 0.5rem;text-align:left">
          <div style="font-family:var(--font-serif);font-size:0.75rem;font-weight:700;color:var(--gold-radiant);margin-bottom:0.25rem;text-transform:uppercase;letter-spacing:0.5px">Valores das Virtudes</div>
          ${rowsHtml}
        </div>
      </div>
    `;
  },

  /* ============================================================================
     MINI-DIORAMA PROCEDURAL DO FEUDO (CCF v4.4)
     ============================================================================ */
  renderFiefDioramaSVG(fief = {}) {
    const defense = Utils.clamp(fief.defense || 50, 0, 100);
    const prosperity = Utils.clamp(fief.prosperity || 55, 0, 100);
    const loyalty = Utils.clamp(fief.loyalty || 60, 0, 100);

    const wallHeight = Math.round(20 + (defense / 100) * 28);
    const keepHeight = Math.round(35 + (defense / 100) * 35);
    const houseCount = Math.min(5, Math.max(1, Math.round(prosperity / 20)));
    const bannerColor = loyalty >= 70 ? "#4ade80" : (loyalty >= 40 ? "#eab308" : "#ef4444");

    let houses = "";
    for (let i = 0; i < houseCount; i++) {
      const hx = 20 + i * 26;
      houses += `
        <polygon points="${hx},90 ${hx + 10},78 ${hx + 20},90" fill="#4a2818" stroke="#1f0f08" stroke-width="1"/>
        <rect x="${hx + 2}" y="90" width="16" height="15" fill="#2b1810" stroke="#1f0f08" stroke-width="1"/>
        <rect x="${hx + 8}" y="95" width="4" height="10" fill="#140a05"/>
      `;
    }

    return `
      <div class="fief-diorama-card" style="margin-bottom:0.75rem;padding:0.65rem;border-radius:12px;background:radial-gradient(circle at 50% 30%, #291812 0%, #110b07 100%);border:1.5px solid var(--border-gold);box-shadow:0 4px 16px rgba(0,0,0,0.85);text-align:center">
        <svg viewBox="0 0 320 120" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:340px;height:auto">
          <!-- Céu & Colinas -->
          <path d="M0,85 Q80,68 170,80 T320,84 L320,120 L0,120 Z" fill="#1a1410"/>
          <path d="M0,95 Q100,88 220,96 T320,95 L320,120 L0,120 Z" fill="#241910"/>
          <!-- Aldeia Campesina -->
          ${houses}
          <!-- Castelo Senhorial / Torreão Central -->
          <rect x="220" y="${105 - wallHeight}" width="80" height="${wallHeight}" fill="#3d3733" stroke="#1c1917" stroke-width="1.5"/>
          <!-- Ameias da Muralha -->
          <rect x="220" y="${102 - wallHeight}" width="8" height="5" fill="#3d3733"/>
          <rect x="236" y="${102 - wallHeight}" width="8" height="5" fill="#3d3733"/>
          <rect x="252" y="${102 - wallHeight}" width="8" height="5" fill="#3d3733"/>
          <rect x="268" y="${102 - wallHeight}" width="8" height="5" fill="#3d3733"/>
          <rect x="284" y="${102 - wallHeight}" width="8" height="5" fill="#3d3733"/>
          <rect x="245" y="${105 - keepHeight}" width="30" height="${keepHeight}" fill="#4a443e" stroke="#1c1917" stroke-width="1.5"/>
          <polygon points="242,${105 - keepHeight} 260,${88 - keepHeight} 278,${105 - keepHeight}" fill="#781919" stroke="#360a0a" stroke-width="1.2"/>
          <!-- Estandarte Feudal de Lealdade -->
          <line x1="260" y1="${88 - keepHeight}" x2="260" y2="${72 - keepHeight}" stroke="#d4a33e" stroke-width="1.5"/>
          <polygon points="260,${72 - keepHeight} 276,${76 - keepHeight} 260,${80 - keepHeight}" fill="${bannerColor}"/>
          <!-- Portal com Grade levadiça -->
          <path d="M252,105 A8,8 0 0 1 268,105 Z" fill="#120c08"/>
        </svg>
        <div style="display:flex;justify-content:space-around;font-family:var(--font-serif);font-size:0.75rem;font-weight:700;color:var(--gold-bright);margin-top:0.35rem">
          <span>🛡️ Defesa: ${defense}%</span>
          <span>🌾 Prosperidade: ${prosperity}%</span>
          <span>👑 Lealdade: ${loyalty}%</span>
        </div>
      </div>
    `;
  }
};
