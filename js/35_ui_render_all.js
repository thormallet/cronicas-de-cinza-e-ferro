/* ============================================================================
   [UI · RENDERIZAÇÃO GERAL v3.5.1] — renderAll — redesenha HUD, painéis, abas e listas
   ============================================================================ */
Object.assign(UI, {
  renderAll() {
    if (!STATE) return;
    Engine.ensureVigorFields();
    if (!Array.isArray(STATE.flags)) STATE.flags = [];
    if (!Array.isArray(STATE.history)) STATE.history = [];
    Engine.syncFamilyNobleTitles();
    Engine.ensureColleagues();
    const fin = Engine.calcAnnualFinances();
    const crestHTML = Utils.renderCrestHTML(STATE.surname);
    const crestInfo = Utils.getCrestData(STATE.surname);
    const playerNobleTitle = Engine.getNobleTitleLabel();

    const hudBar = document.getElementById("hud-top-bar");
    if (hudBar) {
      hudBar.classList.add("active");
      document.getElementById("hud-year").textContent = STATE.year;
      document.getElementById("hud-age").textContent = `${STATE.age}a (${Engine.getPhase()})`;
      const curCity = Engine.getCityObj ? Engine.getCityObj(STATE.currentCityId, STATE.kingdom) : { name: "-", tier: "vila" };
      const curTierLabel = Engine.getCityTierLabel ? Engine.getCityTierLabel(curCity.tier) : "";
      document.getElementById("hud-kingdom").textContent = `${curCity.name} (${curTierLabel})`;
      document.getElementById("hud-job").textContent = Engine.getOccupationLabel();
      document.getElementById("hud-gold").textContent = `${STATE.gold} 🪙`;
      const stCityEl = document.getElementById("st-city");
      if (stCityEl) stCityEl.textContent = `${curCity.name} [${curTierLabel}]`;
      const canTravel = STATE.age >= 16;
      ["btn-hud-travel", "btn-sheet-travel"].forEach(btnId => {
        const b = document.getElementById(btnId);
        if (b) {
          b.disabled = !canTravel;
          b.textContent = canTravel ? "🧭 Viajar" : "🔒 16+ anos";
          b.title = canTravel ? "Abrir Mapa de Viagens e Diário de Exploração" : "Crianças e menores de 16 anos não podem viajar.";
        }
      });
      const btnIntroLocal = document.getElementById("btn-intro-local");
      if (btnIntroLocal) btnIntroLocal.textContent = `🍷 Conhecer em ${curCity.name} (-8 Vigor)`;
    }
    const folioEl = document.getElementById("book-folio-label");
    if (folioEl) {
      const curCity = Engine.getCityObj ? Engine.getCityObj(STATE.currentCityId, STATE.kingdom) : { name: "" };
      folioEl.textContent = `Ano ${STATE.year} • ${curCity.name} • Casa ${STATE.surname}`;
    }

    document.getElementById("st-hero-header").innerHTML = `
      ${Utils.renderPortraitHTML(STATE, "lg")}
      <div>
        <h3 style="margin:0;border:none;padding:0;font-size:1.02rem">${crestHTML}${STATE.name}</h3>
        ${playerNobleTitle ? `<div style="margin-top:0.15rem"><span class="badge gold">⚜️ ${playerNobleTitle}</span></div>` : ""}
        <div style="font-size:0.78rem;color:var(--text-muted);margin-top:0.15rem">${STATE.generation}ª Geração • ${Engine.getOccupationLabel()}${STATE.pregnancy ? ' • 🤰 Gestação' : ''}</div>
      </div>
    `;

    document.getElementById("st-house-banner").innerHTML = `
      <div style="font-size:1.45rem">${crestInfo.symbol}</div>
      <div>
        <div style="font-weight:bold;font-size:0.86rem">Casa ${STATE.surname}</div>
        <div style="font-size:0.78rem;color:var(--text-muted)"><em>"${crestInfo.motto}"</em> • ${Engine.getKingdom().law}</div>
      </div>
    `;

    document.getElementById("st-age").textContent = STATE.age;
    document.getElementById("st-phase").textContent = Engine.getPhase();
    document.getElementById("st-year").textContent = STATE.year;
    document.getElementById("st-kingdom").textContent = Engine.getKingdom().name;
    document.getElementById("st-class").textContent = Engine.getClassLabel(STATE.socialClass);
    document.getElementById("st-job").textContent = Engine.getOccupationLabel();
    document.getElementById("st-gold").textContent = STATE.gold;
    document.getElementById("st-income").textContent = `${fin.net >= 0 ? "+" : ""}${fin.net}`;
    document.getElementById("st-debt").textContent = STATE.debt;
    document.getElementById("st-honor").textContent = STATE.honor;
    document.getElementById("st-ap").textContent = `(${STATE.vigor}/${STATE.maxVigor})`;

    let dishonorLabel = "";
    if (STATE.reputation <= -8) dishonorLabel = "Infame / Pária";
    else if (STATE.reputation <= -4) dishonorLabel = "Desprezado";
    else if (STATE.reputation <= -1) dishonorLabel = "Malvisto";

    let honorDegradedLabel = "";
    if (STATE.honor <= 15) honorDegradedLabel = "Desonrado / Vil";
    else if (STATE.honor < 30) honorDegradedLabel = "Manchada";
    else if (STATE.honor < 45) honorDegradedLabel = "Duvidosa";

    const honorEl = document.getElementById("st-honor");
    const honorBar = document.getElementById("st-honor-bar");
    const honorSbar = document.querySelector('.sbar[data-stat="honor"]');

    if (STATE.honor < 30) {
      if (honorEl) {
        honorEl.className = "aff-bad";
        honorEl.style.color = "#ef4444";
        honorEl.innerHTML = `${STATE.honor} <span class="rep-dishonor-badge" style="color:#ef4444;font-size:0.72rem" title="${honorDegradedLabel}">(${honorDegradedLabel})</span>`;
      }
      if (honorBar) {
        honorBar.className = "stat-fill honor aff-bad";
        honorBar.style.background = "linear-gradient(90deg, #8a0f0f, #e0392f)";
      }
      if (honorSbar) {
        honorSbar.classList.add("crit");
        honorSbar.title = `Honra da Casa: ${STATE.honor}/100 — ${honorDegradedLabel}`;
      }
    } else {
      if (honorEl) {
        honorEl.className = "";
        honorEl.style.color = "";
        honorEl.textContent = STATE.honor;
      }
      if (honorBar) {
        honorBar.className = "stat-fill honor";
        honorBar.style.background = "";
      }
      if (honorSbar) {
        honorSbar.title = `Honra da Casa: ${STATE.honor}/100${honorDegradedLabel ? ` — ${honorDegradedLabel}` : ""}`;
      }
    }

    const repEl = document.getElementById("st-rep");
    const repBar = document.getElementById("st-rep-bar");
    const repSbar = document.querySelector('.sbar[data-stat="rep"]');

    if (STATE.reputation < 0) {
      if (repEl) {
        repEl.className = "aff-bad";
        repEl.style.color = "#ef4444";
        repEl.innerHTML = `${STATE.reputation} <span class="rep-dishonor-badge" style="color:#ef4444;font-size:0.72rem" title="${dishonorLabel}">(${dishonorLabel})</span>`;
      }
      if (repBar) {
        repBar.className = "stat-fill rep aff-bad";
        repBar.style.background = "linear-gradient(90deg, #8a0f0f, #e0392f)";
      }
      if (repSbar) {
        repSbar.classList.add("crit");
        repSbar.title = `Reputação: ${STATE.reputation}/10 — ${dishonorLabel}`;
      }
    } else {
      if (repEl) {
        repEl.className = "";
        repEl.style.color = "";
        repEl.textContent = STATE.reputation;
      }
      if (repBar) {
        repBar.className = "stat-fill rep";
        repBar.style.background = "";
      }
      if (repSbar) {
        repSbar.title = `Reputação: ${STATE.reputation}/10`;
      }
    }

    const sheetHonorEl = document.getElementById("st-sheet-honor");
    if (sheetHonorEl) {
      if (STATE.honor < 30) {
        sheetHonorEl.className = "aff-bad";
        sheetHonorEl.style.color = "#ef4444";
        sheetHonorEl.textContent = STATE.honor;
        if (sheetHonorEl.parentElement) {
          let badgeSpan = sheetHonorEl.parentElement.querySelector(".honor-degraded-badge");
          if (!badgeSpan) {
            badgeSpan = document.createElement("span");
            badgeSpan.className = "badge bad honor-degraded-badge";
            badgeSpan.style.fontSize = "0.75rem";
            badgeSpan.style.marginLeft = "0.25rem";
            sheetHonorEl.parentElement.appendChild(badgeSpan);
          }
          badgeSpan.textContent = honorDegradedLabel;
        }
      } else {
        sheetHonorEl.className = "";
        sheetHonorEl.style.color = "";
        sheetHonorEl.textContent = STATE.honor;
        if (sheetHonorEl.parentElement) {
          const badgeSpan = sheetHonorEl.parentElement.querySelector(".honor-degraded-badge");
          if (badgeSpan) badgeSpan.remove();
        }
      }
    }

    const sheetRepEl = document.getElementById("st-sheet-rep");
    if (sheetRepEl) {
      if (STATE.reputation < 0) {
        sheetRepEl.className = "aff-bad";
        sheetRepEl.style.color = "#ef4444";
        sheetRepEl.innerHTML = `${STATE.reputation}/10 <span class="badge bad" style="font-size:0.75rem">${dishonorLabel}</span>`;
      } else {
        sheetRepEl.className = "";
        sheetRepEl.style.color = "";
        sheetRepEl.textContent = `${STATE.reputation}/10`;
      }
    }

    STATE.maxHp = Math.max(10, Engine.getEffectiveAttr("saude"));
    document.getElementById("st-hp-val").textContent = `${STATE.hp}/${STATE.maxHp}`;
    document.getElementById("st-hp-bar").style.width = `${Utils.clamp(Math.round((STATE.hp / STATE.maxHp) * 100), 0, 100)}%`;

    document.getElementById("st-vigor-val").textContent = `${STATE.vigor}/${STATE.maxVigor}`;
    document.getElementById("st-vigor-bar").style.width = `${Utils.clamp(Math.round((STATE.vigor / STATE.maxVigor) * 100), 0, 100)}%`;

    if (honorBar) honorBar.style.width = `${Utils.clamp(STATE.honor, 0, 100)}%`;
    if (repBar) repBar.style.width = `${Utils.clamp((STATE.reputation + 10) * 5, 0, 100)}%`;

    document.getElementById("st-attrs").innerHTML = DATA.attributes.map(a => {
      const eff = Engine.getEffectiveAttr(a.id);
      return `
        <div>
          <div class="attr-line-head">
            <span><svg class="attr-icon-svg"><use href="#ico-${a.id}"/></svg>${a.name}</span><span>${eff}</span>
          </div>
          <div class="stat-bar"><div class="stat-fill attr" style="width:${Math.min(100, eff)}%"></div></div>
        </div>
      `;
    }).join("");

    const fichaRadarSlot = document.getElementById("ficha-radar-slot");
    if (fichaRadarSlot && window.Utils && typeof Utils.renderOctagonRadarSVG === "function" && STATE) {
      fichaRadarSlot.innerHTML = Utils.renderOctagonRadarSVG(STATE.attrs);
    }

    const livingAll = STATE.npcs.filter(n => n.alive);
    document.getElementById("cnt-rel").textContent = livingAll.length;
    document.getElementById("cnt-inv").textContent = Array.isArray(STATE.itemInstances) ? STATE.itemInstances.length : STATE.inventory.length;

    const logBox = document.getElementById("log-container");
    if (logBox.children.length === 0 && STATE.log.length > 0) {
      STATE.log.slice(-40).forEach(e => this.appendLogEntry(e));
    }

    this.renderEventModal();

    const availActs = DATA.activities.filter(a => {
      const ageOk = STATE.age >= a.minAge && STATE.age <= a.maxAge;
      if (!ageOk) return false;
      if (a.exclusiveKingdom && a.exclusiveKingdom !== STATE.kingdom) return false;
      if (Engine.isActivityAllowedInCurrentCity && !Engine.isActivityAllowedInCurrentCity(a.id)) return false;
      if (a.jobPool) {
        return (STATE.visibleJobActivityIds || []).includes(a.id);
      }
      const jobOk = a.jobs.includes("any") || a.jobs.includes(STATE.job) || a.jobs.includes(STATE.socialClass);
      return jobOk;
    });

    this.renderActivityCards(availActs);

    const hasOcc = Engine.hasActiveOccupation();
    const perfPanel = document.getElementById("guild-perf-panel");
    if (perfPanel) {
      if (hasOcc) {
        perfPanel.style.display = "block";
        const isGuild = !!STATE.guildTraining;
        const curJob = Engine.getJob();
        const occName = Engine.getOccupationLabel();
        const perfVal = Utils.clamp(STATE.jobPerformance || 50, 0, 100);
        const ranksList = isGuild
          ? ["Aprendiz Iniciante (Noviciato)", "Aprendiz Sênior (Companheiro)", `Mestre Graduado (${STATE.guildTraining.jobName})`]
          : (curJob.ranks || [curJob.name]);
        const curRankIdx = isGuild ? (Engine.getGuildHierarchyRank().includes("Sênior") ? 1 : 0) : (STATE.jobRank || 0);
        const hierarchyStr = ranksList.map((r, i) => i === curRankIdx ? `<strong>[${r}]</strong>` : r).join(" &#8594; ");
        const promoReqs = Engine.getPromotionRequirements(curRankIdx);
        const activeJobId = isGuild ? STATE.guildTraining.jobId : STATE.job;
        const itMeta = (DATA.itinerantCareerMeta && DATA.itinerantCareerMeta[activeJobId]) ? DATA.itinerantCareerMeta[activeJobId] : null;
        const itRule = Engine.getJobLocalityRule ? Engine.getJobLocalityRule(activeJobId) : {};
        const itLine = itMeta
          ? `<br><span class="badge gold">${itMeta.badge}</span> <small>Carreira Itinerante (${itRule.crossKingdom ? "Mantém ofício entre Cidades e Reinos" : "Mantém ofício entre Cidades do Reino"} • Desconto de viagem e ações de rota ativas).</small>`
          : "";

        document.getElementById("perf-panel-title").textContent = isGuild
          ? `🏛️ Hierarquia da Guilda: ${STATE.guildTraining.guildName}`
          : `⚒️ Hierarquia do Ofício: ${occName}`;
        document.getElementById("perf-status-badge").textContent = isGuild
          ? `${Engine.getGuildHierarchyRank()} (${STATE.guildTraining.yearsDone}/${STATE.guildTraining.yearsReq}a)`
          : `Cargo ${curRankIdx + 1}/${ranksList.length}: ${Engine.getJobRankLabel(curJob, curRankIdx)}`;
        document.getElementById("perf-panel-desc").innerHTML = (isGuild
          ? `Graus da Guilda: ${hierarchyStr}.<br>Mantenha o desempenho acima de 45/100 ao concluir os ${STATE.guildTraining.yearsReq} anos sob os Mestres para formar-se.`
          : `Cargos da Carreira: ${hierarchyStr}.<br>Desempenho exigido para a próxima promoção: <strong>&#8805; ${promoReqs.reqPerf}/100</strong> + Prova de Mérito (Dificuldade ${promoReqs.reqAttrDiff}); &#8804; 25/100 rebaixa seu cargo. No ápice da carreira, &#8805; 90/100 eleva o estamento de toda a família!`) + itLine;
        document.getElementById("perf-bar-label").textContent = `${perfVal}/100`;
        document.getElementById("perf-bar-fill").style.width = `${perfVal}%`;

        const dedicatedActions = Engine.getJobDedicatedActions();
        document.getElementById("perf-actions").innerHTML = dedicatedActions.map(act => `
          <button type="button" class="action-btn ${(act.isTrial || act.isItinerantSpec) ? 'primary' : ''}" onclick="window.Engine.performJobAction('${act.id}')">
            <span class="act-icon">${act.icon}</span>
            <div><strong>${act.title}</strong><br><small>${act.sub}</small></div>
          </button>
        `).join("");
      } else {
        perfPanel.style.display = "none";
      }
    }

    const visibleJobs = DATA.jobs.filter(j => (STATE.visibleJobIds || []).includes(j.id) && Engine.isJobAccessibleForPlayer(j));
    const cntJobsEl = document.getElementById("cnt-sub-jobs");
    if (cntJobsEl) cntJobsEl.textContent = visibleJobs.length;
    const jobsBox = document.getElementById("jobs-list");
    if (jobsBox) {
      jobsBox.innerHTML = visibleJobs.map(j => {
        const isCurrent = !STATE.guildTraining && STATE.job === j.id;
        const graduated = (STATE.completedGuilds || []).includes(j.id);
        const needsGuild = j.guildYears && j.guildYears > 0 && !graduated;
        const mobCost = Engine.getJobMobilityCost(j);
        const reqStr = Object.entries(j.req || {}).map(([k, v]) => k === "rep" ? `REP ${v}` : (k === "honor" ? `HONRA ${v}` : `${k.toUpperCase()} ${v}`)).join(", ") || "Nenhum";
        const guildBadge = needsGuild
          ? `<span class="badge bad">Requer Guilda (${j.guildYears}a)</span>`
          : (j.guildYears ? `<span class="badge good">Diplomado na Guilda</span>` : "");
        const eccBadge = j.ecclesiastical ? `<span class="badge">⛪ Voto de Castidade</span>` : "";
        const locBadge = Engine.getJobLocalityBadgeLabel ? `<span class="badge">${Engine.getJobLocalityBadgeLabel(j.id)}</span>` : "";
        return `
          <div class="npc-card">
            <div>
              <strong>${j.name}</strong> <span class="badge gold">+${j.income} Ouro/ano</span> ${guildBadge} ${eccBadge} ${locBadge}<br>
              <small>${j.desc} | Idade mín: ${j.minAge} | Req: ${reqStr} | Taxa: ${mobCost} Ouro</small>
            </div>
            <button type="button" ${isCurrent ? "disabled" : ""} onclick="window.Engine.changeJob('${j.id}', 'job')">
              ${isCurrent ? "Ofício Atual" : (needsGuild ? "Ver Requisito" : "Assumir Ofício")}
            </button>
          </div>
        `;
      }).join("");
    }

    const visibleGuilds = DATA.jobs.filter(j => (STATE.visibleGuildIds || []).includes(j.id) && j.guildYears && Engine.isJobAccessibleForPlayer(j));
    const cntGuildsEl = document.getElementById("cnt-sub-guilds");
    if (cntGuildsEl) cntGuildsEl.textContent = visibleGuilds.length;
    const guildsBox = document.getElementById("guilds-list");
    if (guildsBox) {
      guildsBox.innerHTML = visibleGuilds.length === 0
        ? `<p style="color:var(--text-muted)">Nenhuma corporação de aprendizado disponível para sorteio neste ano.</p>`
        : visibleGuilds.map(j => {
            const isTraining = STATE.guildTraining && STATE.guildTraining.jobId === j.id;
            const graduated = (STATE.completedGuilds || []).includes(j.id);
            const mobCost = Engine.getJobMobilityCost(j);
            const reqStr = Object.entries(j.req || {}).map(([k, v]) => k === "rep" ? `REP ${v}` : (k === "honor" ? `HONRA ${v}` : `${k.toUpperCase()} ${v}`)).join(", ") || "Nenhum";
            const locBadge = Engine.getJobLocalityBadgeLabel ? `<span class="badge">${Engine.getJobLocalityBadgeLabel(j.id)}</span>` : "";
            return `
              <div class="npc-card">
                <div>
                  <strong>🏛️ ${j.guildName || `Guilda de ${j.name}`}</strong> <span class="badge gold">${j.guildYears} ano(s)</span>
                  ${graduated ? `<span class="badge good">Formado</span>` : ""} ${locBadge}<br>
                  <small>Habilita a carreira de <strong>${j.name}</strong> | Idade mín: ${j.minAge} | Req: ${reqStr} | Matrícula: ${mobCost} Ouro</small>
                </div>
                <button type="button" ${(isTraining || graduated) ? "disabled" : ""} onclick="window.Engine.changeJob('${j.id}', 'guild')">
                  ${isTraining ? `Cursando (${STATE.guildTraining.yearsDone}/${STATE.guildTraining.yearsReq}a)` : (graduated ? "Já Concluído" : "Matricular-se")}
                </button>
              </div>
            `;
          }).join("");
    }

    const hasNobleTitle = STATE.socialClass === "nobre" && (STATE.nobleTitleLevel || 0) >= 1;
    const tabBtnReino = document.getElementById("tab-btn-reino");
    if (tabBtnReino) tabBtnReino.style.display = hasNobleTitle ? "inline-block" : "none";
    const tabReinoEl = document.getElementById("tab-reino");
    if (!hasNobleTitle && tabReinoEl && tabReinoEl.classList.contains("active")) {
      this.switchTab("tab-oficios");
    }

    if (hasNobleTitle) {
      const f = STATE.fief;
      const lvl = STATE.nobleTitleLevel || 1;
      const tObj = Engine.getNobleTitleObj(lvl);
      document.getElementById("fief-panel-title").textContent = `🏰 Governação de ${playerNobleTitle} — Casa ${STATE.surname}`;
      document.getElementById("fief-title-badge").textContent = `${playerNobleTitle} (Grau ${lvl}/5 • +${tObj ? tObj.bonusIncome : 0} Ouro/ano)`;
      if (Engine.renderFief) Engine.renderFief();

      const realmStab = Engine.getRealmStability ? Engine.getRealmStability() : 50;
      const stabBadge = document.getElementById("fief-stability-badge");
      if (stabBadge) {
        stabBadge.className = `badge ${realmStab >= 60 ? "good" : (realmStab >= 40 ? "gold" : "bad")}`;
        stabBadge.textContent = `🛡️ Estabilidade do Reino: ${realmStab}%`;
      }

      const nextLvl = (STATE.nobleTitleLevel || 0) + 1;
      const nextTObj = Engine.getNobleTitleObj ? Engine.getNobleTitleObj(nextLvl) : null;
      const patentBox = document.getElementById("noble-patent-progression-box");
      if (patentBox) {
        if (nextLvl > 5 || !nextTObj) {
          patentBox.innerHTML = `
            <div class="card" style="margin-bottom:0.75rem;background:var(--panel-inner);border:1.5px solid var(--border-gold)">
              <h4 style="margin:0;border:none">👑 Ápice Nobiliárquico</h4>
              <small style="color:var(--text-muted)">Você atingiu o grau máximo de titularidade fidalga no Reino de ${Engine.getKingdom().name}.</small>
            </div>`;
        } else {
          const nextTitleName = STATE.sex === "F" ? nextTObj.titleF : nextTObj.titleM;
          const reqHonor = 60 + nextLvl * 5;
          const reqRep = 2 + nextLvl;
          const reqStab = 50 + nextLvl * 5;
          const hasPoss = Engine.hasRequiredNoblePossessions ? Engine.hasRequiredNoblePossessions(nextLvl) : true;
          const honorOk = STATE.honor >= reqHonor;
          const repOk = STATE.reputation >= reqRep;
          const stabOk = realmStab >= reqStab;

          patentBox.innerHTML = `
            <div class="card" style="margin-bottom:0.75rem;background:var(--panel-inner);border:1.5px solid var(--border-gold)">
              <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.4rem;margin-bottom:0.35rem">
                <h4 style="margin:0;border:none;padding:0;font-size:0.9rem">📜 Próxima Patente: ${nextTitleName} (Grau ${nextLvl})</h4>
                <span class="badge ${honorOk && repOk && stabOk && hasPoss ? 'good' : 'gold'}">${honorOk && repOk && stabOk && hasPoss ? 'Elegível para Outorga' : 'Em Progresso'}</span>
              </div>
              <p class="sheet-hint" style="font-size:0.8rem;margin-bottom:0.4rem">Requisitos régios para o chanceler outorgar seu novo título:</p>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.35rem;font-size:0.78rem">
                <div>Honra: <strong style="color:${honorOk ? 'var(--good-bright)' : '#ef4444'}">${STATE.honor}/${reqHonor}</strong> ${honorOk ? '✓' : '✗'}</div>
                <div>Reputação: <strong style="color:${repOk ? 'var(--good-bright)' : '#ef4444'}">${STATE.reputation}/${reqRep}</strong> ${repOk ? '✓' : '✗'}</div>
                <div>Estabilidade: <strong style="color:${stabOk ? 'var(--good-bright)' : '#ef4444'}">${realmStab}%/${reqStab}%</strong> ${stabOk ? '✓' : '✗'}</div>
                <div>Posses Nobres: <strong style="color:${hasPoss ? 'var(--good-bright)' : '#ef4444'}">${hasPoss ? 'Atestadas' : 'Insuficientes'}</strong> ${hasPoss ? '✓' : '✗'}</div>
              </div>
            </div>
          `;
        }
      }

      const curCityFief = Engine.getCityObj ? Engine.getCityObj(STATE.currentCityId, STATE.kingdom) : { name: "", tier: "capital" };
      const inUrban = Engine.isInUrbanCenter ? Engine.isInUrbanCenter() : true;
      document.getElementById("fief-panel-desc").innerHTML = inUrban
        ? `Você está em <strong>${curCityFief.name} [${Engine.getCityTierLabel(curCityFief.tier)}]</strong>: suas ordens administrativas em ${Engine.getKingdom().name} têm <strong>execução presencial imediata</strong>.`
        : `Você está em <strong>${curCityFief.name} [Vila]</strong>: fora das cidades, suas decisões são expedidas como <strong>📜 Ofício Senhorial</strong> para cumprimento na virada do próximo ano (ou viaje até uma Cidade/Capital para agir imediatamente).`;

      document.getElementById("fief-stats").innerHTML = `
        <div><strong>Prosperidade do Domínio:</strong> ${f.prosperity}/100</div>
        <div><strong>Lealdade dos Vassalos:</strong> ${f.loyalty}/100</div>
        <div><strong>Guarnição & Defesa:</strong> ${f.defense}/100</div>
        <div><strong>Influência na Corte:</strong> ${f.influence}/100</div>
        <div><strong>Contentamento Camponês:</strong> ${f.peasantry}/100</div>
        <div><strong>Renda Titular Anual:</strong> +${tObj ? tObj.bonusIncome : 0} Ouro</div>
      `;

      const t2Name = (Engine.getNobleTitleObj(2) || { titleM: "Grau 2" }).titleM;
      const t3Name = (Engine.getNobleTitleObj(3) || { titleM: "Grau 3" }).titleM;
      const t4Name = (Engine.getNobleTitleObj(4) || { titleM: "Grau 4" }).titleM;
      const t5Name = (Engine.getNobleTitleObj(5) || { titleM: "Grau 5" }).titleM;
      const fiefBtns = [
        { id: "collect_tribute", reqLvl: 1, icon: "🪙", title: "Recolher Foros e Banalidades", sub: "-12 Vigor | Arrecada Ouro do domínio (-Camponeses)" },
        { id: "improve_lands", reqLvl: 1, icon: "🌾", title: "Fomentar Moinhos e Lavouras", sub: `-${30 + lvl * 15} Ouro, -12 Vigor | +Prosperidade, +Camponeses, +Honra` },
        { id: "baronial_justice", reqLvl: 2, icon: "⚖️", title: `Exercer Alta Justiça Senhorial (${t2Name}+)`, sub: "-14 Vigor | Julga pleitos locais (+Lealdade, +Defesa, +Rep)" },
        { id: "viscount_charters", reqLvl: 3, icon: "📜", title: `Outorgar Feiras na Comarca (${t3Name}+)`, sub: "-15 Vigor | Atrai comércio (+Ouro, +Prosperidade, +Influência)" },
        { id: "palatine_levy", reqLvl: 4, icon: "🛡️", title: `Mobilizar Hostes da Província (${t4Name}+)`, sub: "-75 Ouro, -16 Vigor | Fortalece guarnições (+18 Defesa, +12 Influência)" },
        { id: "ducal_council", reqLvl: 5, icon: "👑", title: `Intervir no Grande Conselho (${t5Name})`, sub: "-18 Vigor | Direciona políticas de Estado (+Subsídio, +Influência)" }
      ];

      const inUrbanBtn = Engine.isInUrbanCenter ? Engine.isInUrbanCenter() : true;
      const pendingOrders = STATE.pendingFiefOrders || [];
      document.getElementById("fief-actions").innerHTML = fiefBtns.map(b => {
        const unlocked = lvl >= b.reqLvl;
        const isQueued = pendingOrders.includes(b.id);
        const actionLabel = !inUrbanBtn
          ? (isQueued ? `📬 [Ofício Enviado] ${b.title}` : `📜 [Enviar Ofício +1a] ${b.title}`)
          : b.title;
        return `
          <button type="button" class="action-btn ${unlocked && !isQueued ? 'primary' : ''}" ${(unlocked && !isQueued) ? `onclick="window.Engine.performNobleRealmAction('${b.id}')"` : 'disabled'}>
            <span class="act-icon">${b.icon}</span>
            <div>
              <strong>${actionLabel}</strong><br>
              <small>${unlocked ? b.sub : `Requer Título de Grau ${b.reqLvl} ou superior`}</small>
            </div>
          </button>
        `;
      }).join("");
    }

    const famMembers = STATE.npcs.filter(n => n.alive && ["Pai","Mãe","Irmão/Irmã","Cônjuge","Filho","Filha"].includes(n.role));
    document.getElementById("family-list").innerHTML = famMembers.length === 0
      ? `<p style="color:var(--text-muted)">Nenhum familiar próximo vivo no momento.</p>`
      : famMembers.map(n => this.renderPersonCard(n)).join("");

    const friendMembers = STATE.npcs.filter(n => n.alive && n.role === "Amigo");
    const cntFriendsEl = document.getElementById("cnt-friends");
    if (cntFriendsEl) cntFriendsEl.textContent = friendMembers.length;
    const friendsBox = document.getElementById("friends-list");
    if (friendsBox) {
      friendsBox.innerHTML = friendMembers.length === 0
        ? `<p style="color:var(--text-muted)">Você ainda não possui amigos juramentados vivos. Interaja com pessoas na vila, corte ou ofício e peça-as em amizade!</p>`
        : friendMembers.map(n => this.renderPersonCard(n)).join("");
    }

    const vilaMembers = STATE.npcs.filter(n => n.alive && ["Mentor","Conhecido"].includes(n.role));
    const cntVilaEl = document.getElementById("cnt-vila");
    if (cntVilaEl) cntVilaEl.textContent = vilaMembers.length;
    const vilaBox = document.getElementById("vila-list");
    if (vilaBox) {
      vilaBox.innerHTML = vilaMembers.length === 0
        ? `<p style="color:var(--text-muted)">Use o botão "🍷 Conhecer na Vila" acima para travar conhecimento com moradores e mentores.</p>`
        : vilaMembers.map(n => this.renderPersonCard(n)).join("");
    }

    const suitorMembers = STATE.npcs.filter(n => n.alive && n.role === "Pretendente");
    const cntSuitorsEl = document.getElementById("cnt-suitors");
    if (cntSuitorsEl) cntSuitorsEl.textContent = suitorMembers.length;
    const suitorsBox = document.getElementById("suitors-list");
    if (suitorsBox) {
      suitorsBox.innerHTML = suitorMembers.length === 0
        ? `<p style="color:var(--text-muted)">Nenhum pretendente formal ativo. Clique em "🌹 Procurar Pretendente" acima!</p>`
        : suitorMembers.map(n => this.renderPersonCard(n)).join("");
    }

    const rivalMembers = STATE.npcs.filter(n => n.alive && n.role === "Rival");
    const cntRivalsEl = document.getElementById("cnt-rivals");
    if (cntRivalsEl) cntRivalsEl.textContent = rivalMembers.length;
    const rivalsBox = document.getElementById("rivals-list");
    if (rivalsBox) {
      rivalsBox.innerHTML = rivalMembers.length === 0
        ? `<p style="color:var(--text-muted)">Você não possui inimigos ou rivais declarados no momento.</p>`
        : rivalMembers.map(n => this.renderPersonCard(n)).join("");
    }

    const tabBtnRelCorte = document.getElementById("tab-btn-rel-corte");
    const btnIntroRoyal = document.getElementById("btn-intro-royal");
    if (tabBtnRelCorte) tabBtnRelCorte.style.display = hasNobleTitle ? "inline-block" : "none";
    if (btnIntroRoyal) btnIntroRoyal.style.display = hasNobleTitle ? "inline-block" : "none";
    const subCorteEl = document.getElementById("sub-rel-corte-real");
    if (!hasNobleTitle && subCorteEl && subCorteEl.style.display !== "none") {
      const famBtn = document.querySelector("#tab-relacoes .tab-btn");
      this.switchRelSubTab("sub-rel-fam", famBtn);
    }

    const courtMembers = STATE.npcs.filter(n => n.alive && n.role === "Corte");
    const cntCourtEl = document.getElementById("cnt-court");
    if (cntCourtEl) cntCourtEl.textContent = hasNobleTitle ? courtMembers.length : 0;
    const inCap = Engine.isInCapital ? Engine.isInCapital() : true;
    const capCity = Engine.getCapitalCity ? Engine.getCapitalCity(STATE.kingdom) : { id: "", name: "Capital" };
    const courtBox = document.getElementById("court-list");
    if (courtBox) {
      const capNotice = (hasNobleTitle && !inCap)
        ? `<div class="npc-card" style="margin-bottom:0.65rem;grid-column:1/-1"><div><strong>👑 A Corte Real reúne-se em ${capCity.name} [Capital]</strong><br><small>Você precisa estar na Capital para apresentar-se ou ter audiência presencial com membros da Corte.</small></div><button type="button" class="primary" onclick="window.Engine.travelToCity('${capCity.id}')">🧭 Ir à Capital</button></div>`
        : "";
      courtBox.innerHTML = !hasNobleTitle
        ? `<p style="color:var(--text-muted)">Apenas portadores de Título Nobiliárquico têm acesso à Corte Real.</p>`
        : capNotice + (courtMembers.length === 0
            ? `<p style="color:var(--text-muted)">Use o botão "👑 Apresentar-se na Corte Real" para conhecer membros da realeza e alta fidalguia.</p>`
            : courtMembers.map(n => this.renderPersonCard(n)).join(""));
    }

    const colMembers = STATE.npcs.filter(n => n.alive && n.role === "Colega de Ofício");
    const tabBtnRelOficio = document.getElementById("tab-btn-rel-oficio");
    const btnIntroCol = document.getElementById("btn-intro-colleague");
    if (tabBtnRelOficio) tabBtnRelOficio.style.display = hasOcc ? "inline-block" : "none";
    if (btnIntroCol) btnIntroCol.style.display = hasOcc ? "inline-block" : "none";
    const subOficioEl = document.getElementById("sub-rel-oficio");
    if (!hasOcc && subOficioEl && subOficioEl.style.display !== "none") {
      const famBtn = document.querySelector("#tab-relacoes .tab-btn");
      this.switchRelSubTab("sub-rel-fam", famBtn);
    }

    const cntColEl = document.getElementById("cnt-colleagues");
    if (cntColEl) cntColEl.textContent = hasOcc ? colMembers.length : 0;
    const jobTitleEl = document.getElementById("rel-job-title");
    if (jobTitleEl) jobTitleEl.textContent = Engine.getOccupationLabel();
    const colBox = document.getElementById("colleagues-list");
    if (colBox) {
      colBox.innerHTML = !hasOcc
        ? `<p style="color:var(--text-muted)">Ingresse em uma Guilda ou assuma um Ofício para desbloquear suas relações sociais corporativas.</p>`
        : (colMembers.length === 0
            ? `<p style="color:var(--text-muted)">Use o botão acima para conhecer novos colegas da sua Guilda ou Ofício.</p>`
            : colMembers.map(n => this.renderPersonCard(n)).join(""));
    }

    const deadMembers = STATE.npcs.filter(n => !n.alive);
    const cntMemEl = document.getElementById("cnt-memoriam");
    if (cntMemEl) cntMemEl.textContent = deadMembers.length;
    const memBox = document.getElementById("memoriam-list");
    if (memBox) {
      memBox.innerHTML = deadMembers.length === 0
        ? `<p style="color:var(--text-muted)">Graças aos céus, nenhuma pessoa próxima partiu desta vida ainda.</p>`
        : deadMembers.map(n => this.renderPersonCard(n)).join("");
    }

    if (this.renderInventoryAndMarket) this.renderInventoryAndMarket();
    if (this.renderLoversList) this.renderLoversList();
    if (this.renderSuccessionLawSection) this.renderSuccessionLawSection();

    const flags = Array.isArray(STATE.flags) ? STATE.flags : [];
    const visC = Array.isArray(STATE.visitedCities) ? STATE.visitedCities.length : 1;
    const visK = Array.isArray(STATE.visitedKingdoms) ? STATE.visitedKingdoms.length : 1;
    const trCount = STATE.travelCount || 0;
    document.getElementById("history-flags").innerHTML =
      `<div style="margin-bottom:0.45rem"><strong>🧭 Diário de Exploração:</strong> ` +
      `<span class="badge gold">${visC}/50 Comarcas</span> <span class="badge gold">${visK}/10 Reinos</span> <span class="badge">${trCount} Jornadas</span></div>` +
      `<strong>Flags de História Persistentes:</strong> ` +
      (flags.length ? flags.map(f => `<span class="badge">${f}</span>`).join("") : "Nenhuma");
    const hist = Array.isArray(STATE.history) ? STATE.history : [];
    document.getElementById("full-history-list").innerHTML = hist.slice().reverse().map(h => `<div>• ${this.fmtLog(h)}</div>`).join("");

    if (STATE.pendingChild) {
      const childBackdrop = document.getElementById("child-name-backdrop");
      if (childBackdrop && !childBackdrop.classList.contains("active")) {
        this.openChildNameModal();
      }
    }

    this.renderHud();
  }
});
