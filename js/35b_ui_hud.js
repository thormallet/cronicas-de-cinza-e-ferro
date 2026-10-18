/* ============================================================================
   [UI · HUD v3.5.1] — HUD compacto, barras de status críticas, atividades em cartões e atalhos
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
    if (av) {
      av.innerHTML = Utils.renderPortraitHTML(STATE);
      av.style.cursor = "pointer";
      av.onclick = () => window.UI.openRadarModal();
      av.title = "Clique para abrir o Octógono das Virtudes";
    }
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
      } else if (stat === "honor" && STATE.honor < 30) {
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
      const regBadge = a.exclusiveKingdom ? ` <span class="badge gold">🌍 Tradição Regional</span>` : "";
      return `
        <button type="button" class="action-btn ${a.jobPool ? "primary" : ""}" ${isDisabled ? "disabled" : ""}
          onclick="window.Engine.performActivity('${a.id}')" title="${safeDesc}">
          <span class="act-icon">${a.icon}</span>
          <div>
            <strong>${a.name}${regBadge}</strong>
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
  },

  spawnFloatingStat(text, type = "gold", targetEl = null) {
    if (typeof document === "undefined") return;
    const shell = document.getElementById("app-shell") || document.body;
    let x, y;

    if (targetEl && targetEl.getBoundingClientRect) {
      const rect = targetEl.getBoundingClientRect();
      const shellRect = shell.getBoundingClientRect();
      x = (rect.left + rect.width / 2) - shellRect.left;
      y = rect.top - shellRect.top;
    } else {
      const hudGold = document.getElementById("hud-gold") || document.getElementById("st-gold");
      if (hudGold && hudGold.getBoundingClientRect) {
        const rect = hudGold.getBoundingClientRect();
        const shellRect = shell.getBoundingClientRect();
        x = (rect.left + rect.width / 2) - shellRect.left;
        y = rect.bottom - shellRect.top + 6;
      } else {
        x = shell.clientWidth / 2;
        y = 70;
      }
    }

    const pill = document.createElement("div");
    pill.className = `stat-floating-pill ${type}`;
    pill.style.left = `${Math.round(x)}px`;
    pill.style.top = `${Math.round(y)}px`;
    pill.setAttribute("role", "status");
    pill.setAttribute("aria-live", "polite");
    pill.innerHTML = text;

    shell.appendChild(pill);

    setTimeout(() => {
      if (pill.parentElement) {
        pill.parentElement.removeChild(pill);
      }
    }, 1600);
  }
});

/* ESC fecha modais ativos ou o painel aberto */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const modalActive = document.querySelector(".custom-dialog-backdrop.active, #event-popup-backdrop.active");
    if (modalActive) {
      if (UI.closeNPCModal) UI.closeNPCModal();
      if (UI.closeAchievementsModal) UI.closeAchievementsModal();
      if (UI.closeRadarModal) UI.closeRadarModal();
      if (UI.closeDialog) UI.closeDialog();
      return;
    }
    const activeSheet = document.querySelector(".sheet.active");
    if (activeSheet && UI.closeSheets) {
      UI.closeSheets();
      return;
    }
  }
});

/* GESTOS TOUCH NATIVOS (SWIPE & PULL-DOWN) — BitLife Medieval */
if (typeof window !== "undefined") {
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;

  window.addEventListener("DOMContentLoaded", () => {
    const gameScreen = document.getElementById("screen-game");
    if (!gameScreen) return;

    gameScreen.addEventListener("touchstart", (e) => {
      if (!e.touches || e.touches.length !== 1) return;
      const t = e.touches[0];
      touchStartX = t.clientX;
      touchStartY = t.clientY;
      touchStartTime = Date.now();
    }, { passive: true });

    gameScreen.addEventListener("touchend", (e) => {
      if (!e.changedTouches || e.changedTouches.length !== 1) return;
      const t = e.changedTouches[0];
      const deltaX = t.clientX - touchStartX;
      const deltaY = t.clientY - touchStartY;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);
      const dt = Date.now() - touchStartTime;

      if (dt > 750) return;

      const modalActive = document.querySelector(".custom-dialog-backdrop.active, #event-popup-backdrop.active");
      if (modalActive) return;

      const activeSheet = document.querySelector(".sheet.active");

      // 1. Pull-down vertical para baixo (>= 70px) em bottom sheet ativa
      if (activeSheet && deltaY >= 70 && absY > absX * 1.3) {
        const sheetBody = activeSheet.querySelector(".sheet-body");
        if (!sheetBody || sheetBody.scrollTop <= 10) {
          UI.closeSheets();
          return;
        }
      }

      // 2. Swipe horizontal (>= 60px) alternando abas na ordem cíclica
      if (absX >= 60 && absX > absY * 1.3) {
        const tabsCycle = ["tab-cronica", "tab-relacoes", "tab-oficios", "tab-atividades", "tab-inventario", "tab-historico"];
        let currentTabId = "tab-cronica";
        if (activeSheet) {
          currentTabId = activeSheet.id;
        }

        const currentIdx = tabsCycle.indexOf(currentTabId);
        if (currentIdx !== -1) {
          let nextIdx;
          if (deltaX < 0) {
            nextIdx = (currentIdx + 1) % tabsCycle.length;
          } else {
            nextIdx = (currentIdx - 1 + tabsCycle.length) % tabsCycle.length;
          }

          const nextTabId = tabsCycle[nextIdx];
          if (nextTabId === "tab-cronica") {
            UI.closeSheets();
          } else {
            UI.openSheet(nextTabId);
          }
        }
      }
    }, { passive: true });
  });
}

