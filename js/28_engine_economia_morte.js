/* ============================================================================
   [ENGINE · MERCADO, BENS, BARGANHA E MORTALIDADE 4.0] — bens, conservação, barganha e morte
   ============================================================================ */
Object.assign(Engine, {
  getItemRegionalPrice(itemId, kingdomId = (STATE ? STATE.kingdom : "valois"), stateKey = "novo") {
    const it = DATA.items.find(x => x.id === itemId);
    if (!it) return 0;
    const regMult = (it.regionalMult && it.regionalMult[kingdomId]) !== undefined ? it.regionalMult[kingdomId] : 1.0;
    const stateObj = (DATA.itemStates && DATA.itemStates[stateKey]) || { multValue: 1.0 };
    const yearSeed = STATE ? STATE.year : 1200;
    const itemSeed = (itemId.charCodeAt(0) || 1) + (itemId.charCodeAt(itemId.length - 1) || 1);
    const hash = Math.sin(yearSeed * 13.37 + itemSeed * 7.19);
    const fluct = 1 + (hash * 0.08);
    return Math.max(1, Math.round(it.price * regMult * stateObj.multValue * fluct));
  },

  getNetWorth() {
    if (!STATE) return 0;
    let total = STATE.gold || 0;
    if (Array.isArray(STATE.itemInstances)) {
      STATE.itemInstances.forEach(inst => {
        total += this.getItemRegionalPrice(inst.id, inst.kingdom || STATE.kingdom, inst.state || "bom");
      });
    }
    const debtTotal = (STATE.debt || 0);
    return Math.max(0, total - debtTotal);
  },

  recalculateSocialClassByWealth() {
    if (!STATE) return;
    const worth = this.getNetWorth();
    let newWealthTier = "miseravel";
    if (worth >= 3000) newWealthTier = "nobre";
    else if (worth >= 1200) newWealthTier = "patricio";
    else if (worth >= 350) newWealthTier = "burgues";
    else if (worth >= 60) newWealthTier = "plebeu";

    STATE.wealthTier = newWealthTier;
    let targetClass = (newWealthTier === "nobre") ? "nobre" : (["burgues", "patricio"].includes(newWealthTier) ? "media" : "plebeu");

    if (STATE.socialClass === "nobre") {
      const hasProps = Array.isArray(STATE.itemInstances) && STATE.itemInstances.some(x => {
        const it = DATA.items.find(i => i.id === x.id);
        return it && it.category === "propriedade";
      });
      if (worth >= 600 && (STATE.nobleTitleLevel || 0) >= 1 && hasProps) {
        targetClass = "nobre";
      }
    }

    if (STATE.socialClass !== targetClass) {
      const reason = targetClass === "nobre"
        ? `Sua fabulosa fortuna acumulada (${worth} Moedas) abriu os salões senhoriais da corte!`
        : (targetClass === "media"
          ? (this.getClassRankValue(targetClass) > this.getClassRankValue(STATE.socialClass)
            ? `Seu patrimônio burguês (${worth} Moedas) consolidou sua posição na classe média urbana.`
            : `A perda de posses e terras nobres rebaixou sua casa ao estamento dos burgueses comuns.`)
          : `A penúria financeira (${worth} Moedas) reduziu sua família à plebe.`);
      this.setFamilySocialClass(targetClass, reason);
    }
  },

  buyItem(itemId, bargainedPrice = null, stateKey = "novo") {
    this.ensureVigorFields();
    const it = DATA.items.find(x => x.id === itemId);
    if (!it) return;
    const isMulti = it.category === "propriedade" || it.category === "transporte" || it.type === "propriedade";
    if (!isMulti && STATE.inventory.includes(it.id)) {
      UI.notify("Item Já Possuído", `Você já possui ${it.name} em seu espólio.`);
      return;
    }
    const finalPrice = bargainedPrice !== null ? bargainedPrice : this.getItemRegionalPrice(itemId, STATE.kingdom, stateKey);
    if (STATE.gold < finalPrice) {
      UI.notify("Ouro Insuficiente", `Você precisa de ${finalPrice} moedas de ouro para adquirir ${it.name}.`);
      return;
    }
    SoundFX.play("coin");
    STATE.gold -= finalPrice;
    STATE.inventory.push(it.id);
    const newUid = "it_" + Math.random().toString(36).slice(2, 9);
    STATE.itemInstances.push({
      uid: newUid,
      id: itemId,
      state: stateKey,
      kingdom: STATE.kingdom,
      cityId: STATE.currentCityId,
      buyPrice: finalPrice,
      mortgaged: false
    });
    if (it.type === "propriedade") {
      STATE.propertyMeta.push({ id: it.id, kingdom: STATE.kingdom, cityId: STATE.currentCityId });
    }
    STATE.maxHp = Math.max(10, this.getEffectiveAttr("saude"));
    this.addLog(`🪙 COMPRA NO MERCADO: Você adquiriu **${it.name}** [${(DATA.itemStates[stateKey] && DATA.itemStates[stateKey].label) || stateKey}] por ${finalPrice} Ouro.`, "good");
    this.recalculateSocialClassByWealth();
    if (this.checkAchievements) this.checkAchievements();
    Storage.saveToSlot(CONFIG.activeSlot);
    UI.renderAll();
  },

  negotiateItemPrice(itemId, mode = "buy", instUid = null) {
    this.ensureVigorFields();
    const it = DATA.items.find(x => x.id === itemId);
    if (!it) return;
    if (STATE.vigor < 3) {
      UI.notify("Vigor Esgotado", "Você não tem vigor suficiente para pechinchar nos mercados.");
      return;
    }
    STATE.vigor = Math.max(0, STATE.vigor - 3);
    const attrVal = Math.round((this.getEffectiveAttr("carisma") * 0.6) + (this.getEffectiveAttr("intelecto") * 0.4));
    const repMod = (STATE.reputation || 0) * 2;
    const die = Utils.d50();
    const total = Math.round(attrVal * 0.65) + repMod + die;
    const success = total >= 52;

    if (mode === "buy") {
      const basePrice = this.getItemRegionalPrice(itemId, STATE.kingdom, "novo");
      if (success) {
        const discountPct = Utils.rand(15, 30);
        const bargainedPrice = Math.max(1, Math.round(basePrice * (1 - discountPct / 100)));
        STATE.bargainsWon = (STATE.bargainsWon || 0) + 1;
        SoundFX.play("coin");
        this.addLog(`🤝 BARGANHA TRIUNFANTE: Sua lábia garantiu um desconto de ${discountPct}% em **${it.name}** (Preço: ${bargainedPrice} Ouro)!`, "good");
        this.buyItem(itemId, bargainedPrice, "novo");
      } else {
        const penaltyPrice = Math.round(basePrice * 1.12);
        this.addLog(`😤 BARGANHA FRACASSADA: O mercador se ofendeu com sua oferta mesquinha e subiu o preço de **${it.name}** para ${penaltyPrice} Ouro (+12%).`, "bad");
        UI.notify("Mercador Ofendido", `O comerciante recusou o desconto e exigirá ${penaltyPrice} Ouro.`);
      }
    } else {
      this.sellItemInstance(instUid || itemId, true);
    }
    Storage.saveToSlot(CONFIG.activeSlot);
    UI.renderAll();
  },

  sellItemInstance(uidOrItemId, bargained = false) {
    this.ensureVigorFields();
    let instIdx = STATE.itemInstances.findIndex(x => x.uid === uidOrItemId);
    if (instIdx === -1) instIdx = STATE.itemInstances.findIndex(x => x.id === uidOrItemId);
    if (instIdx === -1) return;
    const inst = STATE.itemInstances[instIdx];
    if (inst.mortgaged) {
      UI.notify("Bem Hipotecado", "Este bem está penhorado como garantia de empréstimo e não pode ser vendido!");
      return;
    }
    const it = DATA.items.find(x => x.id === inst.id);
    if (!it) return;
    const regPrice = this.getItemRegionalPrice(inst.id, STATE.kingdom, inst.state || "bom");
    let mult = 0.80;
    if (bargained) {
      const check = this.rollCheck("carisma", 50);
      if (check.success) {
        mult = (Utils.rand(95, 110) / 100);
        STATE.bargainsWon = (STATE.bargainsWon || 0) + 1;
        this.addLog(`🤝 VENDA VANTAJOSA: Você convenceu o comprador a pagar ${Math.round(mult * 100)}% do valor regional de **${it.name}**!`, "good");
      } else {
        mult = 0.65;
        this.addLog(`📉 VENDA APRESSADA: O comprador pressionou e pagou apenas 65% do valor regional de **${it.name}**.`, "bad");
      }
    }
    const saleVal = Math.max(1, Math.round(regPrice * mult));
    STATE.itemInstances.splice(instIdx, 1);
    const invIdx = STATE.inventory.indexOf(inst.id);
    if (invIdx !== -1) STATE.inventory.splice(invIdx, 1);
    if (it.type === "propriedade" && Array.isArray(STATE.propertyMeta)) {
      const pmIdx = STATE.propertyMeta.findIndex(p => p.id === inst.id);
      if (pmIdx !== -1) STATE.propertyMeta.splice(pmIdx, 1);
    }
    STATE.gold += saleVal;
    SoundFX.play("coin");
    this.addLog(`🪙 BEM ALIENADO: Você vendeu **${it.name}** [${inst.state}] recebendo +${saleVal} Moedas de Ouro.`, "good");
    this.recalculateSocialClassByWealth();
    if (this.checkAchievements) this.checkAchievements();
    Storage.saveToSlot(CONFIG.activeSlot);
    UI.renderAll();
  },

  sellProperty(itemId) {
    this.sellItemInstance(itemId, false);
  },

  repairItemInstance(uid) {
    this.ensureVigorFields();
    const inst = STATE.itemInstances.find(x => x.uid === uid);
    if (!inst) return;
    const it = DATA.items.find(x => x.id === inst.id);
    if (!it) return;
    if (inst.state === "novo") {
      UI.notify("Estado Impecável", "Este bem já se encontra em perfeito estado de conservação.");
      return;
    }
    const repairCost = Math.max(2, Math.round(it.price * 0.20));
    if (STATE.gold < repairCost) {
      UI.notify("Ouro Insuficiente", `Você precisa de ${repairCost} Ouro para restaurar este bem.`);
      return;
    }
    STATE.gold -= repairCost;
    const nextState = inst.state === "arruinado" ? "desgastado" : (inst.state === "desgastado" ? "bom" : "novo");
    const oldState = inst.state;
    inst.state = nextState;
    SoundFX.play("coin");
    this.addLog(`🛠️ RESTAURAÇÃO: Você investiu ${repairCost} Ouro na reforma de **${it.name}**, elevando seu estado de [${oldState}] para [${nextState}].`, "good");
    Storage.saveToSlot(CONFIG.activeSlot);
    UI.renderAll();
  },

  degradeItemsAnnually() {
    if (!STATE || !Array.isArray(STATE.itemInstances)) return;
    STATE.itemInstances.forEach(inst => {
      const it = DATA.items.find(x => x.id === inst.id);
      if (!it || inst.state === "arruinado") return;
      const decayRate = (DATA.itemStates[inst.state] && DATA.itemStates[inst.state].decayRate) || 0.08;
      if (Math.random() < decayRate) {
        const oldState = inst.state;
        inst.state = inst.state === "novo" ? "bom" : (inst.state === "bom" ? "desgastado" : "arruinado");
        this.addLog(`🏚️ DESGASTE DE BEM: A ação do tempo e intempéries desgastou **${it.name}** de [${oldState}] para [${inst.state}].`, "bad");
      }
    });
  },

  takeLoan(amount) {
    if (this.takeHistoricalLoan) {
      this.takeHistoricalLoan("cambistas_corte", amount);
      return;
    }
    SoundFX.play("coin");
    STATE.gold += amount;
    STATE.debt += Math.round(amount * 1.3);
    this.addLog(`Você tomou ${amount} Ouro com cambistas; sua dívida subiu em ${Math.round(amount * 1.3)} Ouro.`, "bad");
    Storage.saveToSlot(CONFIG.activeSlot);
    UI.renderAll();
  },

  payDebt() {
    if (STATE.debt <= 0 && (!STATE.activeLoans || STATE.activeLoans.length === 0)) return;
    const pay = Math.min(STATE.gold, STATE.debt);
    if (pay <= 0) {
      UI.notify("Sem Ouro", "Você não possui ouro disponível para abater a dívida.");
      return;
    }
    SoundFX.play("coin");
    STATE.gold -= pay;
    STATE.debt -= pay;
    if (Array.isArray(STATE.activeLoans) && STATE.activeLoans.length > 0) {
      let rem = pay;
      STATE.activeLoans.forEach(l => {
        const d = Math.min(l.balance, rem);
        l.balance -= d;
        rem -= d;
      });
      STATE.activeLoans = STATE.activeLoans.filter(l => l.balance > 0);
    }
    this.addLog(`Você pagou ${pay} Ouro aos credores (Dívida restante: ${STATE.debt}).`, "good");
    Storage.saveToSlot(CONFIG.activeSlot);
    UI.renderAll();
  },

  checkMortality() {
    if (STATE.hp <= 0) {
      if (STATE.age <= 12) {
        STATE.hp = 12;
        return false;
      }
      this.die("Seu corpo exaurido entregou a alma ao Criador.");
      return true;
    }

    if (STATE.age <= 12) return false;

    const jobRisk = this.getJob().risk || 0.01;
    let ageRisk = 0;
    if (STATE.age >= 55) ageRisk = (STATE.age - 52) * 0.025;
    if (STATE.age >= 75) ageRisk += 0.25;
    const healthMitigation = (this.getEffectiveAttr("saude") / 100) * 0.08;

    const totalRisk = Math.max(0.004, jobRisk + ageRisk - healthMitigation);
    if (Math.random() < totalRisk) {
      const save = this.rollCheck("saude", 58 + Math.floor(STATE.age / 3));
      if (!save.success) {
        const causes = [
          `Colapso súbito durante o inverno rigoroso de ${this.getKingdom().name}.`,
          `Infecção aguda contraída no exercício do ofício de ${this.getJob().name}.`,
          `Debilidade natural da carne aos ${STATE.age} anos de idade.`
        ];
        this.die(Utils.pick(causes));
        return true;
      } else {
        STATE.hp = Math.max(5, STATE.hp - 12);
        this.addLog("Você escapou por um triz das garras da morte neste ano!", "bad");
      }
    }
    return false;
  },

  die(cause) {
    SoundFX.play("death");
    if (window.UI && window.UI.triggerStageFX) window.UI.triggerStageFX("🕯️");
    STATE.alive = false;
    STATE.isDead = true;
    STATE.activeEvent = null;
    STATE.specialTrial = null;
    document.getElementById("event-popup-backdrop").classList.remove("active");
    UI.closeNPCModal();

    const occLabel = this.getOccupationLabel ? this.getOccupationLabel() : this.getJob().name;
    const epitaph = `“Aqui jaz ${STATE.name} (${STATE.year - STATE.age}–${STATE.year}), ${occLabel} de ${this.getKingdom().name}. Viveu ${STATE.age} anos sob o sol e a tormenta, partindo com ${STATE.gold} moedas de ouro e ${STATE.honor} de honra. ${cause}”`;

    const legacyTags = this.computeLegacyTags ? this.computeLegacyTags() : [];
    Storage.recordPastLife({
      name: STATE.name,
      surname: STATE.surname,
      generation: STATE.generation,
      years: `${STATE.year - STATE.age}–${STATE.year}`,
      age: STATE.age,
      job: occLabel,
      kingdom: this.getKingdom().name,
      gold: STATE.gold,
      cause,
      legacyTags
    });

    const deathPortraitEl = document.getElementById("death-portrait-box");
    if (deathPortraitEl) {
      deathPortraitEl.innerHTML = `<div style="filter:grayscale(0.95) contrast(1.1);opacity:0.82">${Utils.renderPortraitHTML({ ...STATE, alive: false }, "lg")}</div>`;
    }
    document.getElementById("death-epitaph").innerHTML = `${Utils.renderCrestHTML(STATE.surname)} ${epitaph}`;

    const tagsHtml = legacyTags.length
      ? legacyTags.map(t => `<span class="badge gold" title="${t.desc}">${t.icon || '⚜️'} ${t.name}</span>`).join(" ")
      : "<em>Nenhuma marca dinástica destacada</em>";

    document.getElementById("death-summary").innerHTML = `
      <p><strong>Causa da Morte:</strong> ${cause}</p>
      <p><strong>Casa & Geração:</strong> Casa ${STATE.surname} (${STATE.generation}ª Geração)</p>
      <p><strong>Marcas Ancestrais & Legado:</strong> ${tagsHtml}</p>
      <p><strong>Classe e Posição Final:</strong> ${this.getClassLabel(STATE.socialClass)} — ${occLabel}</p>
      <p><strong>Patrimônio Líquido:</strong> ${this.getNetWorth ? this.getNetWorth() : STATE.gold} Ouro (Dívidas: ${STATE.debt} Ouro) | ${STATE.inventory.length} bens possuídos</p>
      <p><strong>Reputação & Honra:</strong> Reputação ${STATE.reputation}/10 | Honra ${STATE.honor}/100</p>
      <p><strong>Marcas do Destino (Flags):</strong> ${STATE.flags.length ? STATE.flags.join(", ") : "Nenhuma marca especial"}</p>
    `;

    const k = this.getKingdom();
    const lawObj = (DATA.successionLaws && DATA.successionLaws[STATE.successionLaw]) ? DATA.successionLaws[STATE.successionLaw] : { name: k.law, desc: k.desc };
    document.getElementById("sucession-law-desc").textContent = `Lei de Sucessão Familiar: ${lawObj.name} — ${lawObj.desc}`;

    const eligibleChildren = this.getEligibleHeirs ? this.getEligibleHeirs() : STATE.npcs.filter(n => n.role === "Filho" && n.alive && !n.abandoned);
    const heirsBox = document.getElementById("heirs-list");

    if (eligibleChildren.length === 0) {
      heirsBox.innerHTML = `<div class="slot-item"><span>Sua linhagem direta extinguiu-se sem filhos vivos elegíveis.</span></div>`;
      Storage.deleteSlot(CONFIG.activeSlot);
    } else {
      heirsBox.innerHTML = eligibleChildren.map(child => {
        const bastTag = child.isBastard ? `<span class="badge red">Bastardo</span> ` : `<span class="badge gold">Legítimo</span> `;
        return `
        <div class="slot-item">
          <div style="display:flex;align-items:center;gap:0.75rem">
            ${Utils.renderPortraitHTML(child)}
            <div>
              <strong>${Utils.renderCrestHTML(child.surname || STATE.surname)}${child.name}</strong> ${bastTag}(${child.sex === 'M' ? 'Varão' : 'Filha'}, ${child.age} anos)<br>
              <small>${child.isBastard ? 'Reconhecido fora das núpcias' : 'Herdeiro legítimo do sangue e brasão'}</small>
            </div>
          </div>
          <button type="button" class="primary" onclick="window.Engine.succeedWithHeir('${child.id}')">👑 Assumir Sucessão</button>
        </div>
      `;
      }).join("");
    }

    UI.showScreen("screen-death");
  }
});
