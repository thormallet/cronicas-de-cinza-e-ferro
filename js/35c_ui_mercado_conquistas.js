/* ============================================================================
   [UI · MERCADO, BANCO, AMANTES E CONQUISTAS 4.0] — posses, usura, conquistas e sucessão
   ============================================================================ */
Object.assign(UI, {
  currentMarketCategory: "todos",

  switchInvSubTab(panelId, btn) {
    if (window.SoundFX) SoundFX.play("click");
    document.querySelectorAll(".inv-sub-panel").forEach(p => { p.style.display = "none"; });
    const target = document.getElementById(panelId);
    if (target) target.style.display = "block";
    this._activateChip(btn);
  },

  setMarketCategoryFilter(cat, btn) {
    if (window.SoundFX) SoundFX.play("click");
    this.currentMarketCategory = cat;
    this._activateChip(btn);
    this.renderMarketShop();
  },

  renderInventoryAndMarket() {
    if (!STATE) return;
    this.renderPlayerPossessions();
    this.renderMarketShop();
    this.renderBankPanel();

    const totalPossessions = Array.isArray(STATE.itemInstances) ? STATE.itemInstances.length : (STATE.inventory ? STATE.inventory.length : 0);
    const cntInv = document.getElementById("cnt-inv");
    if (cntInv) cntInv.textContent = totalPossessions;
    const cntInvTab = document.getElementById("cnt-inv-tab");
    if (cntInvTab) cntInvTab.textContent = totalPossessions;

    const netWorthEl = document.getElementById("inv-net-worth-badge");
    if (netWorthEl) {
      const nw = Engine.getNetWorth ? Engine.getNetWorth() : STATE.gold;
      netWorthEl.textContent = `Patrimônio Líquido: ${nw} 🪙`;
    }
  },

  renderPlayerPossessions() {
    if (!STATE) return;
    const listEl = document.getElementById("inventory-list");
    if (!listEl) return;

    const nw = Engine.getNetWorth ? Engine.getNetWorth() : (STATE.gold || 0);
    const hasProp = Array.isArray(STATE.itemInstances) && STATE.itemInstances.some(x => {
      const it = DATA.items.find(i => i.id === x.id);
      return it && (it.category === "propriedade" || it.category === "transporte");
    });
    const canPleitearCharter = STATE.socialClass !== "nobre" && nw >= 600;
    const readyCharter = nw >= 1200 && hasProp && STATE.gold >= 400;
    const charterHtml = canPleitearCharter ? `
      <div class="item-card" style="margin-bottom:0.75rem;border-left:3px solid var(--gold-bright);background:var(--panel-inner)">
        <div style="flex:1;min-width:200px">
          <div style="display:flex;align-items:center;gap:0.35rem;flex-wrap:wrap">
            <strong>⚜️ Pleitear Carta de Nobreza na Chancelaria Régia</strong>
            <span class="badge gold">Taxa: 400 🪙</span>
          </div>
          <div class="card-desc" style="font-size:0.75rem;margin-top:4px;margin-bottom:4px;color:var(--text-muted)">
            Adquira fidalguia hereditária para a Casa ${STATE.surname}. Requisitos: Patrimônio &#8805; 1.200 🪙 (Atual: ${nw} 🪙), ao menos 1 propriedade/frota e 400 Ouro em mãos.
          </div>
        </div>
        <div style="display:flex;gap:0.35rem;align-items:center">
          <button type="button" class="btn btn-sm gold primary" onclick="window.Engine.buyNobilityCharter()" ${!readyCharter ? 'disabled' : ''}>
            👑 Pleitear Carta de Nobreza (400 🪙)
          </button>
        </div>
      </div>
    ` : "";

    if (!Array.isArray(STATE.itemInstances) || STATE.itemInstances.length === 0) {
      listEl.innerHTML = charterHtml + `<p style="color:var(--text-muted)">Você não possui bens, imóveis ou frotas registradas em seu nome.</p>`;
      return;
    }

    const stateColors = {
      novo: "good",
      bom: "gold",
      desgastado: "bad",
      arruinado: "bad"
    };

    listEl.innerHTML = charterHtml + STATE.itemInstances.map(inst => {
      const it = DATA.items.find(x => x.id === inst.id);
      if (!it) return "";
      const stateObj = (DATA.itemStates && DATA.itemStates[inst.state]) || { label: inst.state || "Bom" };
      const stateClass = stateColors[inst.state] || "gold";
      const isRuined = inst.state === "arruinado";
      const ruinedBadge = isRuined
        ? `<span class="badge bad" style="animation:critPulse 1s infinite alternate;border:1.5px solid #ef4444" title="Se completar 3 anos arruinado, desmorona e é confiscado!">⚠️ Ruína: ${inst.ruinedYears || 0}/3 anos para confisco!</span>`
        : `<span class="badge ${stateClass}">${stateObj.label}</span>`;

      const isProperty = it.category === "propriedade" || it.type === "propriedade";
      const isDistant = isProperty && ((inst.kingdom && inst.kingdom !== STATE.kingdom) || (inst.cityId && inst.cityId !== STATE.currentCityId));
      const remoteBadge = isDistant
        ? `<span class="badge bad" title="Imóvel situado em outra comarca; sofre sobretaxa de manutenção de correios e feitores">📍 Comarca Remota (+100% manutenção)</span>`
        : "";

      const mortgagedBadge = inst.mortgaged ? `<span class="badge bad">🔒 Hipotecado</span>` : "";
      const incomeBadge = (it.income && it.income > 0) ? `<span class="badge good">+${it.income} 🪙/ano</span>` : "";
      const upkeepVal = isDistant ? ((it.upkeep || 0) * 2) : (it.upkeep || 0);
      const upkeepBadge = (upkeepVal > 0) ? `<span class="badge" style="background:#5c3a21">-${upkeepVal} 🪙/ano manuten.</span>` : "";
      const regPrice = Engine.getItemRegionalPrice ? Engine.getItemRegionalPrice(inst.id, inst.kingdom || STATE.kingdom, inst.state || "bom") : it.price;
      const estSaleVal = Math.round(regPrice * 0.80);
      const repairCost = Math.max(2, Math.round(it.price * 0.20));

      const usedThisYear = Array.isArray(STATE.usedItemUidsThisYear) && STATE.usedItemUidsThisYear.includes(inst.uid);
      const canUse = !inst.mortgaged && !isRuined && !usedThisYear;
      const useBtn = `<button type="button" class="btn btn-sm gold chip-btn" style="min-height:36px;padding:0.3rem 0.6rem" onclick="window.Engine.useItemInstance('${inst.uid}')" ${!canUse ? 'disabled' : ''}>⚡ ${usedThisYear ? 'Já Utilizado no Ano' : (it.useLabel || 'Usar Bem')} (-8⚡)</button>`;

      const repairBtn = (inst.state !== "novo" && !inst.mortgaged)
        ? `<button type="button" class="chip-btn" style="min-height:36px;padding:0.3rem 0.6rem" onclick="window.Engine.repairItemInstance('${inst.uid}')">🛠️ Reparar (${repairCost} 🪙)</button>`
        : "";

      const sellBtn = !inst.mortgaged
        ? `<button type="button" class="chip-btn" style="min-height:36px;padding:0.3rem 0.6rem" onclick="window.Engine.sellItemInstance('${inst.uid}', false)">🪙 Vender (~${estSaleVal} 🪙)</button>`
        : `<button type="button" class="chip-btn" disabled style="min-height:36px;padding:0.3rem 0.6rem">🔒 Hipotecado</button>`;

      const bargainBtn = !inst.mortgaged
        ? `<button type="button" class="chip-btn" style="min-height:36px;padding:0.3rem 0.6rem" onclick="window.Engine.sellItemInstance('${inst.uid}', true)">🤝 Barganhar Venda</button>`
        : "";

      return `
        <div class="item-card ${isRuined ? 'card-ruined' : ''}" style="margin-bottom:0.6rem;${isRuined ? 'border:1.5px solid #ef4444;box-shadow:0 0 10px rgba(239,68,68,0.3)' : ''}">
          <div style="flex:1;min-width:200px">
            <div style="display:flex;align-items:center;gap:0.35rem;flex-wrap:wrap">
              <strong>${it.name}</strong>
              ${ruinedBadge}
              ${remoteBadge}
              ${mortgagedBadge}
              ${incomeBadge}
              ${upkeepBadge}
            </div>
            <div class="card-desc" style="font-size:0.78rem;margin-top:0.25rem;margin-bottom:6px;color:var(--text-muted)">${it.desc}</div>
          </div>
          <div style="display:flex;gap:0.35rem;flex-wrap:wrap;align-items:center">
            ${useBtn}
            ${repairBtn}
            ${sellBtn}
            ${bargainBtn}
          </div>
        </div>
      `;
    }).join("");
  },

  renderMarketShop() {
    const shopEl = document.getElementById("shop-list");
    if (!shopEl) return;

    const cat = this.currentMarketCategory || "todos";
    const filtered = DATA.items.filter(it => {
      if (cat === "todos") return true;
      if (cat === "imovel") return it.category === "propriedade" || it.type === "imovel";
      if (cat === "transporte") return it.category === "transporte" || ["montaria", "veiculo", "embarcacao"].includes(it.type);
      if (cat === "arma") return it.type === "arma";
      if (cat === "armadura") return it.type === "armadura";
      if (cat === "instrumento") return it.type === "instrumento";
      if (cat === "ferramenta") return it.type === "ferramenta";
      if (cat === "reliquia") return it.type === "reliquia" || it.category === "luxo";
      return true;
    });

    shopEl.innerHTML = filtered.map(it => {
      const regPrice = Engine.getItemRegionalPrice ? Engine.getItemRegionalPrice(it.id, STATE.kingdom, "novo") : it.price;
      const isMulti = it.category === "propriedade" || it.category === "transporte" || it.stackable === true;
      const alreadyOwned = !isMulti && STATE.inventory && STATE.inventory.includes(it.id);

      let priceBadge = `<span class="badge gold">${regPrice} Ouro</span>`;
      if (regPrice < it.price) {
        priceBadge = `<span class="badge good" title="Preço regional vantajoso">${regPrice} Ouro (Base: ${it.price})</span>`;
      } else if (regPrice > it.price) {
        priceBadge = `<span class="badge bad" title="Preço inflacionado na região">${regPrice} Ouro (Base: ${it.price})</span>`;
      }

      return `
        <div class="item-card" style="margin-bottom:0.6rem">
          <div style="flex:1;min-width:200px">
            <div>
              <strong>${it.name}</strong> ${priceBadge}
              ${alreadyOwned ? `<span class="badge good">No Espólio</span>` : ""}
            </div>
            <small style="color:var(--text-muted);display:block;margin-top:0.2rem">${it.desc}</small>
            ${it.income ? `<small class="badge good" style="margin-top:0.25rem">+${it.income} Ouro/ano de renda</small>` : ""}
            ${it.upkeep ? `<small class="badge" style="margin-top:0.25rem;background:#5c3a21">Manutenção: -${it.upkeep} Ouro/ano</small>` : ""}
          </div>
          <div style="display:flex;gap:0.35rem;flex-wrap:wrap;align-items:center">
            <button type="button" class="primary" style="min-height:36px;padding:0.3rem 0.65rem" ${alreadyOwned ? "disabled" : ""} onclick="window.Engine.buyItem('${it.id}')">
              ${alreadyOwned ? "Adquirido" : "Comprar"}
            </button>
            <button type="button" style="min-height:36px;padding:0.3rem 0.65rem" ${alreadyOwned ? "disabled" : ""} onclick="window.Engine.negotiateItemPrice('${it.id}', 'buy')">
              🤝 Barganhar
            </button>
          </div>
        </div>
      `;
    }).join("");
  },

  renderBankPanel() {
    /* 1. Dívidas Ativas */
    const activeLoansEl = document.getElementById("bank-active-loans-list");
    if (activeLoansEl) {
      if (!Array.isArray(STATE.activeLoans) || STATE.activeLoans.length === 0) {
        activeLoansEl.innerHTML = `<p style="color:var(--text-muted)">Nenhuma dívida bancária ativa. Suas finanças estão livres de juros e cobranças.</p>`;
      } else {
        activeLoansEl.innerHTML = STATE.activeLoans.map(loan => {
          const colIt = (DATA.items || []).find(i => i.id === loan.collateralItemId);
          const colName = colIt ? colIt.name : loan.collateralItemId;
          const collatBadge = loan.collateralItemId ? `<span class="badge bad">Hipoteca: ${colName}</span>` : "";
          const jurosPct = Math.round((loan.interestRate || 0.15) * 100);
          return `
            <div class="item-card" style="margin-bottom:0.55rem">
              <div style="flex:1">
                <strong>${loan.creditorName}</strong>
                <span class="badge bad">Saldo: ${loan.balance} Ouro</span>
                <span class="badge gold">${jurosPct}% juros/ano</span>
                <span class="badge">${loan.yearsLeft} anos restantes</span>
                ${collatBadge}
              </div>
              <div style="display:flex;gap:0.3rem;flex-wrap:wrap">
                <button type="button" class="chip-btn" style="min-height:36px;padding:0.3rem 0.5rem" onclick="window.Engine.payHistoricalLoan('${loan.uid}', true)">🪙 Amortizar (50%)</button>
                <button type="button" class="primary chip-btn" style="min-height:36px;padding:0.3rem 0.5rem" onclick="window.Engine.payHistoricalLoan('${loan.uid}', false)">✨ Quitar Tudo</button>
              </div>
            </div>
          `;
        }).join("");
      }
    }

    /* 2. Credores Disponíveis */
    const credListEl = document.getElementById("bank-creditors-list");
    if (credListEl && DATA.loanCreditors) {
      credListEl.innerHTML = Object.entries(DATA.loanCreditors).map(([credKey, cred]) => {
        const jurosPct = Math.round((cred.interestRate || 0.15) * 100);
        let reqMsg = "Sem garantia exigida";
        if (credKey === "cambistas_corte") reqMsg = "Exige 1 posse como fiança";
        if (credKey === "casa_bancaria") reqMsg = "Exige hipoteca de imóvel/frota";

        return `
          <div class="item-card" style="margin-bottom:0.55rem">
            <div style="flex:1">
              <strong>${cred.name}</strong>
              <span class="badge gold">Até ${cred.maxLoan} 🪙</span>
              <span class="badge bad">${jurosPct}% juros/ano</span>
              <span class="badge">${reqMsg}</span>
              <small style="display:block;color:var(--text-muted);margin-top:0.2rem">${cred.desc}</small>
            </div>
            <button type="button" class="primary" style="min-height:38px;padding:0.35rem 0.75rem" onclick="window.Engine.takeHistoricalLoan('${credKey}')">
              ✍️ Tomar Empréstimo
            </button>
          </div>
        `;
      }).join("");
    }

    /* 3. Carteira de Investimentos do Jogador */
    const walletEl = document.getElementById("bank-investments-wallet");
    if (walletEl) {
      if (!Array.isArray(STATE.bankerLoans) || STATE.bankerLoans.length === 0) {
        walletEl.innerHTML = `<p style="color:var(--text-muted)">Nenhuma operação de empréstimo concedida no momento.</p>`;
      } else {
        walletEl.innerHTML = `<h4>Carteira Ativa de Financiamentos</h4>` + STATE.bankerLoans.map(bLoan => {
          const riskPct = Math.round((bLoan.defaultRisk || 0.15) * 100);
          return `
            <div class="item-card" style="margin-bottom:0.55rem">
              <div style="flex:1">
                <strong>🏛️ Empréstimo a ${bLoan.clientName}</strong>
                <span class="badge gold">Principal: ${bLoan.principal} 🪙</span>
                <span class="badge good">Retorno: ${bLoan.expectedReturn} 🪙</span>
                <span class="badge bad">Risco Calote: ${riskPct}%</span>
                <span class="badge">${bLoan.yearsLeft} anos restantes</span>
              </div>
            </div>
          `;
        }).join("");
      }
    }

    /* 4. Clientes para Emprestar (Banqueiro) */
    const clientsEl = document.getElementById("bank-clients-list");
    if (clientsEl && DATA.bankerClients) {
      clientsEl.innerHTML = Object.entries(DATA.bankerClients).map(([cKey, client]) => {
        const canAfford = STATE.gold >= client.loanAmount;
        const totalReturn = Math.round(client.loanAmount * (1 + (client.returnRate * 3)));
        const profit = totalReturn - client.loanAmount;
        const riskPct = Math.round((client.defaultRisk || 0.10) * 100);

        return `
          <div class="item-card" style="margin-bottom:0.55rem">
            <div style="flex:1">
              <strong>${client.name}</strong>
              <span class="badge gold">Exige: ${client.loanAmount} 🪙</span>
              <span class="badge good">Retorno: ${totalReturn} 🪙 (+${profit})</span>
              <span class="badge bad">Risco Calote: ${riskPct}%</span>
              <small style="display:block;color:var(--text-muted);margin-top:0.2rem">${client.desc}</small>
            </div>
            <button type="button" class="primary" style="min-height:38px;padding:0.35rem 0.75rem" ${canAfford ? "" : "disabled"} onclick="window.Engine.issueBankerLoan('${cKey}')">
              ${canAfford ? "💰 Financiar Operação" : "🔒 Ouro Insuficiente"}
            </button>
          </div>
        `;
      }).join("");
    }
  },

  renderLoversList() {
    if (!STATE) return;
    const lovers = STATE.npcs.filter(n => n.alive && n.role === "Amor");
    const cntEl = document.getElementById("cnt-amantes");
    if (cntEl) cntEl.textContent = lovers.length;

    const listEl = document.getElementById("lovers-list");
    if (!listEl) return;

    if (lovers.length === 0) {
      listEl.innerHTML = `
        <div class="card" style="text-align:center;padding:1.1rem;background:var(--panel-inner)">
          <div style="font-size:2rem;margin-bottom:0.4rem">🌹</div>
          <h4>Nenhum Romance Secreto no Momento</h4>
          <p style="font-size:0.86rem;color:var(--text-muted);max-width:440px;margin:0.3rem auto 0.6rem">
            Para iniciar uma ligação amorosa, estreite laços com pretendentes ou conhecidos até atingir ao menos <strong>40 de Afinidade</strong> e sele o pacto de amantes no painel de Audiência.
          </p>
        </div>
      `;
      return;
    }

    listEl.innerHTML = lovers.map(lover => {
      const nSurname = lover.surname || Utils.extractSurname(lover.name);
      const nCrest = Utils.renderCrestHTML(nSurname);
      const affPct = Utils.clamp(Math.round((lover.affinity + 100) / 2), 0, 100);

      return `
        <div class="person-card" style="border-color:var(--love)" onclick="window.UI.openNPCModal('${lover.id}')">
          ${Utils.renderPortraitHTML(lover)}
          <div class="person-info">
            <div class="person-name">${nCrest}<span>${lover.name}</span> <span class="badge love">Amante</span></div>
            <div class="person-meta">
              <span class="badge good">${lover.age} anos</span>
              <span>• ${lover.jobTitle || "Sem Ofício"}</span>
            </div>
            <div class="stat-bar" style="height:6px;margin:0.25rem 0"><div class="stat-fill aff-love" style="width:${affPct}%"></div></div>
            <div style="display:flex;gap:0.3rem;flex-wrap:wrap;margin-top:0.4rem" onclick="event.stopPropagation()">
              <button type="button" class="chip-btn primary" style="font-size:0.75rem;padding:0.25rem 0.5rem" onclick="window.Engine.interactNPC('${lover.id}', 'make_love')">🔥 Encontro Ardente</button>
              <button type="button" class="chip-btn" style="font-size:0.75rem;padding:0.25rem 0.5rem" onclick="window.Engine.interactNPC('${lover.id}', 'gift')">🎁 Presentear</button>
              <button type="button" class="chip-btn" style="font-size:0.75rem;padding:0.25rem 0.5rem;color:#ef4444" onclick="window.Engine.interactNPC('${lover.id}', 'break_lover')">💔 Romper</button>
            </div>
          </div>
        </div>
      `;
    }).join("");
  },

  renderSuccessionLawSection() {
    const box = document.getElementById("succession-law-box");
    if (!box || !STATE) return;

    const curLaw = STATE.successionLaw || "primogenitura";
    const laws = DATA.successionLaws || {};
    const lawOptions = Object.entries(laws).map(([k, l]) => {
      const sel = k === curLaw ? "selected" : "";
      return `<option value="${k}" ${sel}>${l.name}</option>`;
    }).join("");

    const activeLawData = laws[curLaw] || { desc: "Preserva a integridade da linhagem." };

    let designatedHeirSelect = "";
    if (curLaw === "designada") {
      const eligibleChildren = STATE.npcs.filter(n => n.role === "Filho" && n.alive && !n.abandoned);
      const heirOptions = eligibleChildren.map(c => {
        const sel = c.id === STATE.designatedHeirId ? "selected" : "";
        const bastTag = c.isBastard ? " [Bastardo]" : "";
        return `<option value="${c.id}" ${sel}>${c.name} (${c.age} anos)${bastTag}</option>`;
      }).join("");

      designatedHeirSelect = `
        <div class="form-group" style="margin-top:0.75rem">
          <label style="font-weight:bold;font-size:0.86rem">Herdeiro Universal Designado por Testamento:</label>
          <select onchange="window.Engine.setDesignatedHeir(this.value)">
            ${eligibleChildren.length ? heirOptions : `<option value="">Nenhum filho vivo elegível</option>`}
          </select>
        </div>
      `;
    }

    box.innerHTML = `
      <div class="form-group">
        <label style="font-weight:bold;font-size:0.86rem">Estatuto de Sucessão da Casa ${STATE.surname}:</label>
        <select onchange="window.Engine.setSuccessionLaw(this.value)">
          ${lawOptions}
        </select>
        <small style="display:block;margin-top:0.35rem;color:var(--text-muted);font-size:0.82rem">${activeLawData.desc}</small>
      </div>
      ${designatedHeirSelect}
    `;
  },

  openAchievementsModal() {
    if (window.SoundFX) SoundFX.play("click");
    const backdrop = document.getElementById("achievements-modal-backdrop");
    if (!backdrop) return;

    const unlocked = window.Storage && Storage.getAchievements ? Storage.getAchievements() : [];
    const allAchievements = DATA.achievements || [];

    const badgeEl = document.getElementById("achievements-progress-badge");
    if (badgeEl) {
      badgeEl.textContent = `${unlocked.length}/${allAchievements.length} Conquistas Desbloqueadas`;
    }

    const listEl = document.getElementById("achievements-list");
    if (listEl) {
      listEl.innerHTML = allAchievements.map(ach => {
        const isDone = unlocked.includes(ach.id);
        const icon = isDone ? (ach.icon || "✨") : "🔒";
        const statusBadge = isDone ? `<span class="badge gold">✨ Conquistada</span>` : `<span class="badge" style="background:#4b5563">🔒 Bloqueada</span>`;

        return `
          <div class="item-card" style="margin-bottom:0.5rem;opacity:${isDone ? "1" : "0.68"};border-left-color:${isDone ? "var(--gold-bright)" : "var(--border)"}">
            <div style="font-size:1.8rem;min-width:38px;text-align:center">${icon}</div>
            <div style="flex:1">
              <div style="display:flex;align-items:center;gap:0.35rem;flex-wrap:wrap">
                <strong style="color:${isDone ? "var(--gold-bright)" : "inherit"}">${ach.name}</strong>
                ${statusBadge}
                <span class="badge" style="background:var(--panel-inner)">+${ach.points || 10} pts</span>
              </div>
              <small style="color:var(--text-muted);display:block;margin-top:0.2rem">${ach.desc}</small>
            </div>
          </div>
        `;
      }).join("");
    }

    backdrop.classList.add("active");
  },

  closeAchievementsModal() {
    const backdrop = document.getElementById("achievements-modal-backdrop");
    if (backdrop) backdrop.classList.remove("active");
  }
});
