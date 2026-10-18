/* ============================================================================
   [UI · NÚCLEO v3.5.1] — efeitos, avisos, diálogos, navegação de telas e painéis (sheets), tema, menu e feed
   ============================================================================ */
const UI = {
  triggerStageFX(symbol = "✨") {
    const overlay = document.getElementById("fx-stage-overlay");
    const emb = document.getElementById("fx-stage-emblem");
    if (!overlay || !emb) return;
    emb.textContent = symbol;
    overlay.classList.remove("active");
    void overlay.offsetWidth;
    overlay.classList.add("active");
    setTimeout(() => overlay.classList.remove("active"), 1450);
  },

  notify(title, message, soundEffect = "click") {
    SoundFX.play(soundEffect);
    const backdrop = document.getElementById("dialog-backdrop");
    document.getElementById("dialog-title").textContent = title;
    document.getElementById("dialog-msg").textContent = message;
    const btnBox = document.getElementById("dialog-buttons");
    btnBox.innerHTML = `<button type="button" class="primary" onclick="window.UI.closeDialog()">Entendido</button>`;
    backdrop.classList.add("active");
  },

  askConfirm(title, message, onYes) {
    SoundFX.play("click");
    const backdrop = document.getElementById("dialog-backdrop");
    document.getElementById("dialog-title").textContent = title;
    document.getElementById("dialog-msg").textContent = message;
    const btnBox = document.getElementById("dialog-buttons");
    btnBox.innerHTML = "";

    const yesBtn = document.createElement("button");
    yesBtn.type = "button";
    yesBtn.className = "primary";
    yesBtn.textContent = "Confirmar";
    yesBtn.onclick = () => { this.closeDialog(); onYes(); };

    const noBtn = document.createElement("button");
    noBtn.type = "button";
    noBtn.textContent = "Recusar";
    noBtn.onclick = () => this.closeDialog();

    btnBox.appendChild(yesBtn);
    btnBox.appendChild(noBtn);
    backdrop.classList.add("active");
  },

  closeDialog() {
    document.getElementById("dialog-backdrop").classList.remove("active");
  },

  openChildNameModal() {
    if (!STATE || !STATE.pendingChild) return;
    const { child, partnerName, fatherSurname, motherSurname, isBastard } = STATE.pendingChild;
    const modal = document.getElementById("child-name-backdrop");
    const sexLabel = child.sex === "M" ? "um varão (menino)" : "uma filha (menina)";
    document.getElementById("child-modal-title").textContent = `👶 Nascimento ${isBastard ? '(Bastardo)' : `na Casa ${STATE.surname}`}`;
    const partnerDesc = (partnerName === "um romance furtivo")
      ? (STATE.sex === "F" ? "de um romance furtivo" : "com sua amante secreta")
      : `com ${partnerName}`;
    document.getElementById("child-modal-desc").textContent = STATE.sex === "F"
      ? `Chegado o momento do parto fruto da união ${partnerDesc}, você deu à luz ${sexLabel} de olhos vivos! Escolha o nome de batismo e a linhagem que herdará:`
      : `Completado o tempo de gestação ${partnerDesc}, nasceu ${sexLabel} de olhos vivos! Escolha o nome de batismo e se herdará o sobrenome paterno ou materno:`;
    const firstPart = (child.name || "").split(" ")[0];
    document.getElementById("child-custom-name").value = firstPart;

    const pSur = fatherSurname || STATE.surname;
    const mSur = motherSurname || STATE.surname;
    const surnameSelect = document.getElementById("child-custom-surname");
    if (surnameSelect) {
      if (pSur === mSur) {
        surnameSelect.innerHTML = `<option value="${pSur}">Casa ${pSur} (Linhagem Paterna e Materna)</option>`;
      } else {
        surnameSelect.innerHTML = isBastard
          ? `<option value="${mSur}">Materno: ${mSur} (Comum para Bastardos)</option><option value="${pSur}">Paterno: ${pSur} (Reconhecer na Casa Paterna)</option>`
          : `<option value="${pSur}">Paterno: Casa ${pSur}</option><option value="${mSur}">Materno: Casa ${mSur}</option>`;
      }
    }
    modal.classList.add("active");
  },

  _activateChip(btn) {
    if (!btn || !btn.parentElement) return;
    const parent = btn.parentElement;
    parent.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    // Rolar apenas o container de chips horizontalmente, NUNCA a janela inteira do navegador
    try {
      const parentRect = parent.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      const offset = (btnRect.left - parentRect.left) - (parent.clientWidth / 2) + (btn.clientWidth / 2);
      parent.scrollBy({ left: offset, behavior: "smooth" });
    } catch (e) { /* fallback sem scroll */ }
  },

  switchRelSubTab(panelId, btn) {
    SoundFX.play("click");
    document.querySelectorAll(".rel-sub-panel").forEach(p => { p.style.display = "none"; });
    const target = document.getElementById(panelId);
    if (target) target.style.display = "block";
    this._activateChip(btn);
  },

  switchJobSubTab(panelId, btn) {
    SoundFX.play("click");
    document.querySelectorAll(".job-sub-panel").forEach(p => { p.style.display = "none"; });
    const target = document.getElementById(panelId);
    if (target) target.style.display = "block";
    this._activateChip(btn);
  },

  closeNPCModal() {
    CONFIG.selectedNpcId = null;
    document.getElementById("npc-modal-backdrop").classList.remove("active");
  },

  isDesktop() {
    return !!(typeof window !== "undefined" && window.matchMedia && window.matchMedia("(min-width: 1200px)").matches);
  },

  showScreen(id) {
    if (id !== "screen-death" && typeof document !== "undefined") {
      document.body.classList.remove("memento-mori-active");
      const vig = document.getElementById("memento-vignette");
      if (vig && vig.parentNode) vig.parentNode.removeChild(vig);
    }
    SoundFX.play("click");
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    const screenEl = document.getElementById(id);
    if (screenEl) screenEl.classList.add("active");
    const isGame = id === "screen-game" && !!(typeof STATE !== "undefined" && STATE);
    document.body.classList.toggle("in-game", isGame);
    const hudBar = document.getElementById("hud-top-bar");
    if (hudBar) {
      if (isGame) hudBar.classList.add("active");
      else hudBar.classList.remove("active");
    }
    if (id === "screen-menu") this.renderMenuSlots();

    if (isGame) {
      if (this.isDesktop()) {
        this.openSheet("tab-atividades", true);
      } else {
        this.closeSheets(true);
      }
    } else {
      this.closeSheets(true);
    }
  },

  /* PAINÉIS "BOTTOM SHEET": abre/fecha por id; a navegação inferior usa switchTab */
  openSheet(id, silent) {
    if (this.isDesktop() && id === "sheet-ficha") return;

    const sheet = document.getElementById(id);
    if (!sheet) return;

    if (id === "sheet-config") {
      const isAlreadyActive = sheet.classList.contains("active");
      if (isAlreadyActive) {
        if (!silent) SoundFX.play("click");
        sheet.classList.remove("active");
        document.body.classList.remove("config-open");
        if (!this.isDesktop()) {
          const anyOther = document.querySelector(".sheet.active:not(#sheet-config)");
          if (!anyOther) document.body.classList.remove("sheet-open");
        }
        return;
      }
      if (!silent) SoundFX.play("click");
      if (!this.isDesktop()) {
        document.querySelectorAll(".sheet.active").forEach(s => { if (s !== sheet) s.classList.remove("active"); });
      }
      sheet.classList.add("active");
      document.body.classList.add("config-open");
      document.body.classList.add("sheet-open");
      const body = sheet.querySelector(".sheet-body");
      if (body) body.scrollTop = 0;
      return;
    }

    const cfg = document.getElementById("sheet-config");
    if (cfg && cfg.classList.contains("active")) {
      cfg.classList.remove("active");
      document.body.classList.remove("config-open");
    }

    if (!silent) SoundFX.play("click");
    const wasOpen = sheet.classList.contains("active");
    document.querySelectorAll(".sheet.active").forEach(s => {
      if (s !== sheet && s.id !== "sheet-ficha") s.classList.remove("active");
    });
    sheet.classList.add("active");
    document.body.classList.add("sheet-open");
    if (!wasOpen) {
      const body = sheet.querySelector(".sheet-body");
      if (body) body.scrollTop = 0;
    }
    document.querySelectorAll(".nav-btn").forEach(b => {
      const oc = b.getAttribute("onclick") || "";
      b.classList.toggle("active", oc.indexOf(`'${id}'`) !== -1);
    });
  },

  closeSheets(silent) {
    if (this.isDesktop() && document.body.classList.contains("in-game")) {
      const cfg = document.getElementById("sheet-config");
      if (cfg && cfg.classList.contains("active")) {
        if (!silent) SoundFX.play("click");
        cfg.classList.remove("active");
        document.body.classList.remove("config-open");
      }
      return;
    }
    if (!silent && document.querySelector(".sheet.active")) SoundFX.play("click");
    document.querySelectorAll(".sheet.active").forEach(s => s.classList.remove("active"));
    document.body.classList.remove("sheet-open");
    document.body.classList.remove("config-open");
    document.querySelectorAll(".nav-btn.active").forEach(b => b.classList.remove("active"));
  },

  switchTab(tabId, btn) {
    const target = document.getElementById(tabId);
    if (!target) return;
    if (tabId === "tab-cronica" || target.classList.contains("active")) {
      if (this.isDesktop() && document.body.classList.contains("in-game")) {
        return;
      }
      this.closeSheets();
      return;
    }
    this.openSheet(tabId);
    if (btn && btn.classList) btn.classList.add("active");
  },

  toggleTheme() {
    SoundFX.play("click");
    CONFIG.theme = CONFIG.theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", CONFIG.theme);
    document.getElementById("btn-theme").textContent = CONFIG.theme === "light" ? "☀️ Tema: Claro" : "🌙 Tema: Escuro";
  },

  toggleTypewriter() {
    SoundFX.play("click");
    CONFIG.typewriter = !CONFIG.typewriter;
    document.getElementById("btn-typewriter").textContent = `✒️ Digitação: ${CONFIG.typewriter ? "ON" : "OFF"}`;
  },

  renderMenuSlots() {
    const slots = Storage.getSlots();
    const box = document.getElementById("menu-slots");
    box.innerHTML = slots.map((s, i) => {
      if (!s) {
        return `<div class="slot-item">
          <span><strong>Slot ${i + 1}:</strong> Pergaminho em Branco</span>
          <button type="button" onclick="window.CONFIG.activeSlot=${i};window.Creator.init()">Forjar Linhagem</button>
        </div>`;
      }
      return `<div class="slot-item">
        <div style="display:flex;align-items:center;gap:0.75rem">
          ${Utils.renderPortraitHTML(s)}
          <div>
            <strong>Slot ${i + 1}: ${Utils.renderCrestHTML(s.surname || s.name)}${s.name}</strong> (${s.generation}ª Ger. | ${s.age} anos, Ano ${s.year})<br>
            <small>Casa ${s.surname} • ${s.socialClass.toUpperCase()} — Ouro: ${s.gold} 🪙</small>
          </div>
        </div>
        <div style="display:flex;gap:0.4rem">
          <button type="button" class="primary" onclick="window.Storage.loadSlot(${i})">Continuar</button>
          <button type="button" onclick="window.Storage.deleteSlot(${i})">Apagar</button>
        </div>
      </div>`;
    }).join("");

    try {
      const dyn = Storage.getDynasty();
      const gBox = document.getElementById("dynasty-gallery");
      if (gBox) {
        if (!Array.isArray(dyn) || dyn.length === 0) {
          gBox.innerHTML = `<p style="color:var(--text-muted)">Nenhuma vida encerrada registrada no memorial ainda.</p>`;
        } else {
          gBox.innerHTML = dyn.map(d => {
            const crest = (window.Utils && Utils.renderCrestHTML) ? Utils.renderCrestHTML(d.surname || d.name) : "";
            const tagsHtml = (Array.isArray(d.legacyTags) && d.legacyTags.length > 0)
              ? `<div style="margin-top:0.25rem;display:flex;gap:0.25rem;flex-wrap:wrap">` +
                d.legacyTags.map(t => `<span class="badge gold" style="font-size:0.7rem;padding:0.1rem 0.35rem" title="${t.desc || ''}">${t.icon || '⚜️'} ${t.name || t.id}</span>`).join("") +
                `</div>`
              : "";
            return `
        <div class="slot-item">
          <div>
            <strong>${crest}${d.name}</strong> (${d.generation}ª Geração | ${d.years}, ${d.age} anos)<br>
            <small>${d.job} em ${d.kingdom} | Ouro final: ${d.gold} | <em>${d.cause}</em></small>
            ${tagsHtml}
          </div>
        </div>
      `;
          }).join("");
        }
      }
    } catch (e) {
      console.error(e);
    }
  },

  /* FORMATAÇÃO DO LOG: escapa HTML e converte **x** em <strong>x</strong> */
  fmtLog(texto) {
    if (texto == null) return "";
    const escaped = String(texto)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
    return escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  },

  /* FEED EM LINHA DO TEMPO: cada ano ganha um cabeçalho ("Idade N • Ano Y") e as entradas viram blocos */
  appendLogEntry(entry) {
    const box = document.getElementById("log-container");
    if (!box) return;
    const isHeader = entry.type === "year-header";
    let grp = this._logGroup;
    if (isHeader || !grp || !box.contains(grp)) {
      grp = document.createElement("section");
      grp.className = "log-year";
      const age = entry.age != null ? entry.age : (typeof STATE !== "undefined" && STATE ? STATE.age : 0);
      const year = entry.year != null ? entry.year : (typeof STATE !== "undefined" && STATE ? STATE.year : "");
      const head = document.createElement("div");
      head.className = "log-year-head";
      head.innerHTML = `<span class="log-age">Idade ${age}</span><span class="log-dot">•</span><span class="log-yr">Ano ${year}</span>`;
      grp.appendChild(head);
      box.appendChild(grp);
      this._logGroup = grp;
    }
    const div = document.createElement("div");
    div.className = `log-entry ${entry.type || ""}`;
    grp.appendChild(div);

    if (CONFIG.typewriter && !isHeader) {
      const fullHtml = this.fmtLog(entry.text);
      const plain = (entry.text || "").replace(/\*\*(.+?)\*\*/g, "$1");
      let i = 0;
      div.textContent = "";
      if (!plain) {
        div.innerHTML = fullHtml;
        return;
      }
      const timer = setInterval(() => {
        div.textContent += plain.charAt(i);
        i++;
        box.scrollTop = box.scrollHeight;
        if (i >= plain.length) {
          clearInterval(timer);
          div.innerHTML = fullHtml;
        }
      }, 12);
    } else {
      div.innerHTML = this.fmtLog(entry.text);
      box.scrollTop = box.scrollHeight;
    }
  }
};
if (typeof window !== "undefined") window.UI = UI;

/* RESPONSIVIDADE DESKTOP / MOBILE */
if (typeof window !== "undefined") {
  const _desktopMq = window.matchMedia ? window.matchMedia("(min-width: 1200px)") : null;
  let _wasDesktopState = _desktopMq ? _desktopMq.matches : false;

  const _handleViewportBreakpoint = () => {
    const isDesk = UI.isDesktop();
    if (isDesk === _wasDesktopState) return;
    _wasDesktopState = isDesk;
    if (isDesk) {
      if (document.body && document.body.classList.contains("in-game")) {
        const hasRightActive = Array.from(document.querySelectorAll(".sheet.active"))
          .some(s => s.id !== "sheet-ficha" && s.id !== "sheet-config");
        if (!hasRightActive) {
          UI.openSheet("tab-atividades", true);
        }
      }
    } else {
      UI.closeSheets(true);
    }
  };

  if (_desktopMq) {
    if (_desktopMq.addEventListener) _desktopMq.addEventListener("change", _handleViewportBreakpoint);
    else if (_desktopMq.addListener) _desktopMq.addListener(_handleViewportBreakpoint);
  }
  if (window.addEventListener) {
    window.addEventListener("resize", _handleViewportBreakpoint);
  }
}

/* CONTROLE GLOBAL DA TECLA ESCAPE */
if (typeof window !== "undefined") {
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const topDialog = document.querySelector(".custom-dialog-backdrop.active, #event-popup-backdrop.active, #achievements-modal-backdrop.active, #radar-modal-backdrop.active, #child-name-backdrop.active");
      if (topDialog) {
        topDialog.classList.remove("active");
        return;
      }
      if (document.querySelector(".sheet.active")) {
        UI.closeSheets();
      }
    }
  });
}
