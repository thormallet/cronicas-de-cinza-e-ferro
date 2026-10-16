/* ============================================================================
   [UI · HUD v3.5] — HUD compacto, barras de status críticas, atividades em cartões e atalhos
   ============================================================================ */
Object.assign(UI, {
  ACTIVITY_GROUPS: [
    { id: "oficio", title: "⚜️ Ofício & Carreira" },
    { id: "corpo", title: "💪 Corpo & Vigor" },
    { id: "mente", title: "🧠 Mente & Espírito" },
    { id: "social", title: "🎭 Sociedade & Fortuna" }
  ],
  ACTIVITY_ATTR_GROUP: {
    forca: "corpo", destreza: "corpo", saude: "corpo",
    intelecto: "mente", fe: "mente",
    carisma: "social", beleza: "social", sorte: "social"
  },

  renderHud() {
    if (!STATE) return;
    const av = document.getElementById("hud-avatar");
    if (av) av.innerHTML = Utils.renderPortraitHTML(STATE);
    const nm = document.getElementById("hud-name");
    if (nm) nm.innerHTML = `${Utils.renderCrestHTML(STATE.surname)}<span>${STATE.name}</span>`;

    const pct = (v, max) => Utils.clamp(Math.round((v / (max || 100)) * 100), 0, 100);
    const levels = {
      hp: pct(STATE.hp, STATE.maxHp),
      vigor: pct(STATE.vigor, STATE.maxVigor),
      honor: Utils.clamp(STATE.honor, 0, 100),
      rep: Utils.clamp((STATE.reputation + 10) * 5, 0, 100)
    };
    Object.keys(levels).forEach(stat => {
      const el = document.querySelector(`.sbar[data-stat="${stat}"]`);
      if (!el) return;
      if (stat === "rep" && STATE.reputation < 0) {
        el.classList.add("crit");
        el.classList.remove("warn");
      } else {
        el.classList.toggle("crit", levels[stat] < 25);
        el.classList.toggle("warn", levels[stat] >= 25 && levels[stat] < 45);
      }
    });

    ["cnt-rel", "cnt-inv"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.toggle("zero", el.textContent.trim() === "0");
    });
  },

  renderActivityCards(list) {
    const box = document.getElementById("actions-container");
    if (!box) return;
    const gold = STATE.gold;
    const vigor = STATE.vigor;
    const buckets = {};
    list.forEach(a => {
      const gid = a.jobPool ? "oficio" : (this.ACTIVITY_ATTR_GROUP[a.attr] || "social");
      (buckets[gid] = buckets[gid] || []).push(a);
    });

    const card = a => {
      const heal = a.id === "cuidar_saude";
      const healUsed = heal && !!STATE.healthCareUsedThisYear;
      const needVigor = heal ? 0 : 12;
      const lackVigor = needVigor > 0 && vigor < needVigor;
      const lackGold = !!a.cost && gold < a.cost;
      const chips = [];
      if (heal) {
        if (healUsed) {
          chips.push(`<span class="cost-chip bad">Já Realizado neste Ano (1x/ano)</span>`);
        } else {
          chips.push(
            `<span class="cost-chip gain">+Saúde & +10 Vigor</span>`,
            `<span class="cost-chip gold">🪙 -${a.cost || 12} Ouro</span>`,
            `<span class="cost-chip">1x por ano</span>`
          );
        }
      } else {
        chips.push(`<span class="cost-chip ${lackVigor ? "bad" : "vigor"}">⚡ -${needVigor} Vigor</span>`);
        if (a.cost) chips.push(`<span class="cost-chip ${lackGold ? "bad" : "gold"}">🪙 -${a.cost} Ouro</span>`);
      }
      if (!healUsed) {
        if (lackVigor) chips.push(`<span class="cost-chip bad">Vigor insuficiente</span>`);
        if (lackGold) chips.push(`<span class="cost-chip bad">Ouro insuficiente</span>`);
      }
      const isDisabled = lackVigor || lackGold || healUsed;
      const safeDesc = String(a.desc || "").replace(/"/g, "&quot;");
      return `
        <button type="button" class="action-btn ${a.jobPool ? "primary" : ""}" ${isDisabled ? "disabled" : ""}
          onclick="window.Engine.performActivity('${a.id}')" title="${safeDesc}">
          <span class="act-icon">${a.icon}</span>
          <div>
            <strong>${a.name}</strong>
            <small>${a.desc || ""}</small>
            <span class="cost-row">${chips.join("")}</span>
          </div>
        </button>`;
    };

    const html = this.ACTIVITY_GROUPS.filter(g => buckets[g.id] && buckets[g.id].length).map(g => `
      <section>
        <div class="act-group-title">${g.title}</div>
        <div class="actions-panel">${buckets[g.id].map(card).join("")}</div>
      </section>`).join("");
    box.innerHTML = html || `<p class="act-empty">Nenhuma atividade disponível para sua idade e localidade neste momento.</p>`;
  },

  setModalArt(id, emoji) {
    const el = document.getElementById(id);
    if (el) el.textContent = emoji || "📜";
  }
});

/* ESC fecha o painel aberto (se nenhum modal estiver sobreposto) */
document.addEventListener("keydown", e => {
  if (e.key !== "Escape") return;
  if (document.querySelector(".custom-dialog-backdrop.active")) return;
  if (document.querySelector(".sheet.active")) UI.closeSheets();
});
