/* ============================================================================
   [UI · MODAIS E CARDS] — audiência com NPC, pop-up de evento e card de pessoa
   ============================================================================ */
Object.assign(UI, {
  openNPCModal(npcId) {
    const npc = STATE.npcs.find(n => n.id === npcId);
    if (!npc || !npc.alive) return;
    if (npc.role === "Corte" && Engine.isInCapital && !Engine.isInCapital()) {
      const cap = Engine.getCapitalCity(STATE.kingdom);
      UI.notify("Corte Localizada na Capital", `Para ter audiência presencial com ${npc.name}, viaje até a capital (${cap.name}) usando o botão "🧭 Viajar" no topo da tela.`);
      return;
    }
    if (npc.role !== "Corte" && npc.cityId && STATE.currentCityId && npc.cityId !== STATE.currentCityId) {
      const npcCity = Engine.getCityObj ? Engine.getCityObj(npc.cityId, npc.kingdom || STATE.kingdom) : { name: "outra comarca" };
      const npcK = DATA.kingdoms.find(k => k.id === (npc.kingdom || STATE.kingdom));
      UI.notify("Pessoa em Outra Comarca", `${npc.name} encontra-se em ${npcCity.name}${npcK && npcK.id !== STATE.kingdom ? ` (${npcK.name})` : ""}. Viaje até lá pelo botão "🧭 Viajar" para interagir presencialmente.`);
      return;
    }
    SoundFX.play("click");
    CONFIG.selectedNpcId = npcId;

    const surname = npc.surname || Utils.extractSurname(npc.name);
    const crest = Utils.getCrestData(surname);
    const crestHTML = Utils.renderCrestHTML(surname);
    const maritalLabel = npc.role === "Cônjuge"
      ? "Casado(a) com Você"
      : (npc.maritalStatus || (npc.age < 15 ? "Menor / Solteiro(a)" : "Solteiro(a)"));
    const npcBeauty = (npc.attrs && npc.attrs.beleza) ? npc.attrs.beleza : 50;
    const npcClassLabel = npc.socialClass === "nobre" ? "Nobreza" : (npc.socialClass === "media" ? "Classe Média" : "Plebeu");
    const npcNobleBadge = (npc.socialClass === "nobre" && npc.nobleTitle)
      ? `<span class="badge gold">⚜️ Título: ${npc.nobleTitle}</span>`
      : "";
    const npcJobLabel = npc.jobTitle || (npc.age < 12 ? "Sem Ofício (Criança)" : "Ocupação Doméstica / Feudal");

    document.getElementById("npc-modal-header").innerHTML = `
      ${Utils.renderPortraitHTML(npc)}
      <div style="flex:1">
        <h3 style="margin:0;border:none;padding:0">${crestHTML}${npc.name}</h3>
        <div style="margin-top:0.25rem;display:flex;flex-wrap:wrap;gap:0.2rem">
          <span class="badge ${npc.role === 'Cônjuge' || npc.role === 'Pretendente' || npc.role === 'Amor' ? 'love' : ''}">${npc.role}</span>
          <span class="badge">${npc.age} anos</span>
          <span class="badge gold">👑 Classe: ${npcClassLabel}</span>
          ${npcNobleBadge}
          <span class="badge">⚒️ Ofício: ${npcJobLabel}</span>
          <span class="badge">💍 ${maritalLabel}</span>
        </div>
        <div style="margin-top:0.45rem;max-width:220px">
          <div style="font-size:0.76rem;font-weight:bold;color:var(--text-muted)">✨ Beleza & Porte</div>
          <div class="stat-bar" style="height:7px"><div class="stat-fill attr" style="width:${Utils.clamp(npcBeauty, 5, 100)}%"></div></div>
        </div>
      </div>
    `;

    document.getElementById("npc-modal-house").innerHTML = `
      <div style="font-size:1.5rem">${crest.symbol}</div>
      <div>
        <div style="font-weight:bold;font-size:0.9rem">Linhagem da Casa ${surname}</div>
        <div style="font-size:0.8rem;color:var(--text-muted)">Lema Heráldico: <em>"${crest.motto}"</em></div>
      </div>
    `;

    const affPct = Utils.clamp(Math.round((npc.affinity + 100) / 2), 0, 100);
    const affBar = document.getElementById("npc-modal-aff-bar");
    affBar.style.width = `${affPct}%`;
    affBar.className = `stat-fill ${npc.role === 'Cônjuge' || npc.role === 'Pretendente' || npc.role === 'Amor' ? 'aff-love' : (npc.affinity >= 0 ? 'aff-good' : 'aff-bad')}`;

    let affWord = "Neutro";
    if (npc.affinity >= 75) affWord = "Devoção Profunda";
    else if (npc.affinity >= 40) affWord = "Afeição Calorosa";
    else if (npc.affinity >= 10) affWord = "Cordialidade";
    else if (npc.affinity <= -50) affWord = "Ódio Mortal";
    else if (npc.affinity < 0) affWord = "Hostilidade";
    document.getElementById("npc-modal-aff-label").textContent = `${affWord} (${npc.affinity})`;
    document.getElementById("npc-modal-memory").textContent = `"${npc.memory}"`;
    Engine.ensureVigorFields();
    document.getElementById("npc-modal-ap").textContent = `${STATE.vigor}/${STATE.maxVigor}`;

    const phase = Engine.getPhase();
    const isFamilyBlood = ["Pai","Mãe","Irmão/Irmã","Filho"].includes(npc.role);
    const hasSpouse = STATE.npcs.some(n => n.role === "Cônjuge" && n.alive);
    const buttons = [];

    if (phase === "Infância") {
      if (npc.age <= 14) {
        buttons.push({ id: "play_childhood", icon: "🎠", title: "Brincar & Correr no Terreiro", sub: "-3 Vigor | Ganha afeição e Destreza", primary: true });
      }
      if (["Pai","Mãe","Mentor"].includes(npc.role)) {
        buttons.push({ id: "ask_blessing", icon: "🙏", title: "Pedir Bênção & Proteção", sub: "-2 Vigor | Eleva Honra e carinho familiar", primary: true });
      }
      buttons.push({ id: "talk", icon: "💬", title: "Conversar com Inocência", sub: "-3 Vigor | Estreita os laços" });
    } else {
      buttons.push({ id: "talk", icon: "💬", title: "Conversar & Sondar", sub: "-3 Vigor | Diálogo franco (pode agradar ou irritar)" });
      buttons.push({ id: "gift", icon: "🎁", title: "Oferecer Presente Fino", sub: "-15 Ouro | Grande ganho de afeição" });

      if (!isFamilyBlood && npc.role !== "Cônjuge") {
        buttons.push({ id: "befriend", icon: "🤝", title: "Pedir em Amizade / Aliança", sub: "-4 Vigor | Firma camaradagem (+Reputação)" });
      }

      if (npc.role === "Colega de Ofício") {
        buttons.push({ id: "work_together", icon: "⚒️", title: "Cooperar no Ofício", sub: "-6 Vigor | Empreitada conjunta por +Ouro", primary: true });
        buttons.push({ id: "sabotage_colleague", icon: "🐍", title: "Sabotar & Roubar Clientes", sub: "-5 Vigor | Ganha Ouro, mas pode criar Rival mortal" });
      }

      if (npc.role === "Cônjuge") {
        buttons.push({ id: "make_love", icon: "❤️‍🔥", title: STATE.pregnancy ? "Acariciar no Leito (Gestação em curso)" : "Fazer Amor", sub: "-5 Vigor | Paixão conjugal (Chance moderada de gravidez)", primary: true });
        buttons.push({ id: "court", icon: "🌹", title: "Dedicar Poema & Carinho", sub: "-4 Vigor | Renova a chama do matrimônio" });
      } else if (!isFamilyBlood && STATE.age >= 15 && npc.age >= 15) {
        buttons.push({ id: "court", icon: "🌹", title: "Cortejar & Galantear", sub: "-4 Vigor | Usa Carisma e Beleza (Cuidado se casado!)" });
        if (STATE.age >= 16 && npc.age >= 16) {
          buttons.push({ id: "seduce", icon: "🔥", title: "Tentar Seduzir em Segredo", sub: "-6 Vigor | Paixão furtiva facilitada pela sua Beleza" });
          if (npc.role === "Amor" || npc.affinity >= 75) {
            buttons.push({ id: "make_love", icon: "❤️‍🔥", title: "Encontro Ardente nos Aposentos", sub: "-5 Vigor | Paixão secreta nos aposentos", primary: true });
          }
          if (!hasSpouse && !Engine.isEcclesiasticalOccupation() && npc.sex !== STATE.sex && npc.maritalStatus !== "Casado(a)") {
            buttons.push({ id: "propose", icon: "💍", title: "Pedir em Casamento", sub: "-5 Vigor | Une as Casas (Homem e Mulher solteiros)", primary: true });
          }
        }
      }

      if (npc.role === "Filho" && STATE.age >= 16) {
        buttons.push({ id: "train_child", icon: "🎓", title: "Educar & Treinar Herdeiro", sub: "-5 Vigor | Eleva Força, Intelecto e Carisma do filho", primary: true });
      }

      if (phase === "Velhice" && (npc.role === "Filho" || npc.age < STATE.age - 15)) {
        buttons.push({ id: "pass_wisdom", icon: "🕯️", title: "Transmitir Sabedoria de Ancião", sub: "-4 Vigor | Legado de Intelecto, Sorte e +Honra", primary: true });
      }

      if (["Mentor","Pai","Mãe"].includes(npc.role)) {
        buttons.push({ id: "study_mentor", icon: "📚", title: "Pedir Conselhos & Lições", sub: "-5 Vigor | Aprimora seu Intelecto" });
      }

      if (npc.role === "Rival" || npc.affinity < -15) {
        buttons.push({ id: "make_peace", icon: "🕊️", title: "Propor Paz & Compensação", sub: "-15 Ouro | Tenta encerrar a vendeta (+Honra)" });
      }

      if (!["Pai","Mãe","Filho","Cônjuge"].includes(npc.role) && STATE.age >= 14) {
        buttons.push({ id: "confront", icon: "👊", title: "Intimidar & Humilhar", sub: "-6 Vigor | Impõe temor (+Rep), mas gera Rival vingativo" });
        if (STATE.age >= 16 && npc.age >= 16) {
          buttons.push({ id: "duel", icon: "⚔️", title: "Desafiar para Duelo Mortal", sub: "-10 Vigor | Combate singular (Risco de Vendeta da Casa)" });
        }
      }
    }

    document.getElementById("npc-modal-actions").innerHTML = buttons.map(b => `
      <button type="button" class="action-btn ${b.primary ? 'primary' : ''}" onclick="window.Engine.interactNPC('${npc.id}','${b.id}')">
        <span class="act-icon">${b.icon}</span>
        <div>
          <strong>${b.title}</strong><br>
          <small style="opacity:0.88">${b.sub}</small>
        </div>
      </button>
    `).join("");

    document.getElementById("npc-modal-backdrop").classList.add("active");
  },

  renderEventModal() {
    const popup = document.getElementById("event-popup-backdrop");
    const btnNext = document.getElementById("btn-next-year");

    if (STATE && STATE.specialTrial) {
      const tr = STATE.specialTrial;
      const st = tr.stages[tr.stageIdx];
      if (!st) {
        STATE.specialTrial = null;
        popup.classList.remove("active");
        if (btnNext) btnNext.disabled = false;
        return;
      }
      popup.classList.add("active");
      if (btnNext) btnNext.disabled = true;
      this.setModalArt("ev-art", "\u2694\uFE0F");
      document.getElementById("ev-title").textContent = Engine.formatText(tr.title);
      document.getElementById("ev-year-badge").textContent = `Fase ${tr.stageIdx + 1}/${tr.stages.length} • Ano ${STATE.year}`;

      const logHtml = tr.logNotes.length
        ? `<div style="margin-top:0.5rem;padding:0.45rem;background:rgba(0,0,0,0.08);border-radius:4px;font-size:0.82rem">${tr.logNotes.join("<br>")}</div>`
        : "";

      document.getElementById("ev-desc").innerHTML = `
        <div style="margin-bottom:0.65rem">${Engine.formatText(st.desc)}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.6rem;margin-bottom:0.4rem">
          <div>
            <div style="display:flex;justify-content:space-between;font-size:0.78rem;font-weight:bold">
              <span>🛡️ ${tr.playerLabel}</span><span>${tr.playerHp}%</span>
            </div>
            <div class="stat-bar" style="height:10px"><div class="stat-fill hp" style="width:${tr.playerHp}%"></div></div>
          </div>
          <div>
            <div style="display:flex;justify-content:space-between;font-size:0.78rem;font-weight:bold">
              <span>⚔️ ${tr.enemyLabel}</span><span>${tr.enemyHp}%</span>
            </div>
            <div class="stat-bar" style="height:10px"><div class="stat-fill aff-bad" style="width:${tr.enemyHp}%"></div></div>
          </div>
        </div>
        ${logHtml}
      `;

      document.getElementById("ev-choices").innerHTML = st.choices.map((c, idx) => `
        <button type="button" class="choice-btn" onclick="window.Engine.resolveSpecialTrialChoice(${idx})">
          <span>${Engine.formatText(c.label)} <small style="opacity:0.8">(${c.attr.toUpperCase()})</small></span>
          <span>&#10148;</span>
        </button>
      `).join("");
      return;
    }

    if (!STATE || !STATE.activeEvent) {
      popup.classList.remove("active");
      if (btnNext) btnNext.disabled = false;
      return;
    }
    const ev = STATE.activeEvent;
    popup.classList.add("active");
    if (btnNext) btnNext.disabled = true;
    const scopeLabel = ev.scope === "exclusivo" ? "Exclusivo" : (ev.scope === "compartilhado" ? "Compartilhado" : "Universal");
    const cityObj = Engine.getCityObj ? Engine.getCityObj(STATE.currentCityId, STATE.kingdom) : { name: "" };
    this.setModalArt("ev-art", ev.icon || "\uD83D\uDCDC");
    document.getElementById("ev-title").textContent = Engine.formatText(ev.title);
    document.getElementById("ev-year-badge").textContent = `${scopeLabel} • ${cityObj.name} • Ano ${STATE.year}`;
    document.getElementById("ev-desc").textContent = Engine.formatText(ev.desc);
    document.getElementById("ev-choices").innerHTML = ev.choices.map((c, idx) => `
      <button type="button" class="choice-btn" onclick="window.Engine.resolveEventChoice(${idx})">
        <span>&#9876; ${Engine.formatText(c.label)}</span>
        <span>&#10148;</span>
      </button>
    `).join("");
  },

  renderPersonCard(n) {
    const nSurname = n.surname || Utils.extractSurname(n.name);
    const nCrest = Utils.renderCrestHTML(nSurname);
    const affPct = Utils.clamp(Math.round((n.affinity + 100) / 2), 0, 100);
    const barClass = (n.role === "Cônjuge" || n.role === "Pretendente" || n.role === "Amor") ? "aff-love" : (n.affinity >= 0 ? "aff-good" : "aff-bad");
    const clickAttr = n.alive ? `onclick="window.UI.openNPCModal('${n.id}')"` : "";
    const nClassLabel = n.socialClass === "nobre" ? "Nobreza" : (n.socialClass === "media" ? "Classe Média" : "Plebeu");
    const nTitleBadge = (n.socialClass === "nobre" && n.nobleTitle) ? `<span class="badge gold">⚜️ ${n.nobleTitle}</span>` : "";
    const isAway = n.alive && n.role !== "Corte" && n.cityId && STATE.currentCityId && n.cityId !== STATE.currentCityId;
    const awayCityObj = isAway && Engine.getCityObj ? Engine.getCityObj(n.cityId, n.kingdom || STATE.kingdom) : null;
    const locNpcBadge = awayCityObj ? `<span class="badge">📍 Em ${awayCityObj.name}</span>` : "";
    const nJobLabel = n.jobTitle || (n.age < 12 ? "Sem Ofício" : "Sem Cargo");

    return `
      <div class="person-card ${n.alive ? '' : 'dead'}" ${clickAttr}>
        ${Utils.renderPortraitHTML(n)}
        <div class="person-info">
          <div class="person-name">${nCrest}<span>${n.name}</span></div>
          <div class="person-meta">
            <span class="badge ${n.role === 'Cônjuge' || n.role === 'Pretendente' || n.role === 'Amor' ? 'love' : ''}">${n.role}</span>
            ${nTitleBadge}
            ${locNpcBadge}
            <span class="badge">${nClassLabel}</span>
            ${n.alive ? `<span class="badge good">${n.age} anos</span>` : `<span class="badge bad">Falecido</span>`}
            <span>• ${nJobLabel}</span>
          </div>
          <div class="stat-bar" style="height:6px"><div class="stat-fill ${barClass}" style="width:${affPct}%"></div></div>
          ${n.alive ? `<span class="click-hint">✦ Clique para Audiência</span>` : `<small style="color:var(--text-muted)">Em memória (Casa ${nSurname})</small>`}
        </div>
      </div>
    `;
  }
});
