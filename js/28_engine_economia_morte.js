/* ============================================================================
   [ENGINE · MERCADO, DÍVIDAS E MORTALIDADE] — compra de itens, empréstimos, quitação, mortalidade e morte
   ============================================================================ */
Object.assign(Engine, {
  /* Impede compra duplicada de equipamentos/relíquias únicos (apenas propriedades podem ser acumuladas) */
  buyItem(itemId) {
    this.ensureVigorFields();
    const it = DATA.items.find(x => x.id === itemId);
    if (!it) return;
    if (it.type !== "propriedade" && STATE.inventory.includes(it.id)) {
      UI.notify("Item Já Adquirido", `Você já possui ${it.name} em seu espólio pessoal.`);
      return;
    }
    if (STATE.gold < it.price) {
      UI.notify("Ouro Insuficiente", `Você precisa de ${it.price} moedas de ouro para adquirir ${it.name}.`);
      return;
    }
    SoundFX.play("coin");
    STATE.gold -= it.price;
    STATE.inventory.push(it.id);
    if (it.type === "propriedade") {
      if (!Array.isArray(STATE.propertyMeta)) STATE.propertyMeta = [];
      STATE.propertyMeta.push({ id: it.id, kingdom: STATE.kingdom, cityId: STATE.currentCityId });
    }
    STATE.maxHp = Math.max(10, this.getEffectiveAttr("saude"));
    this.addLog(`Você adquiriu: ${it.name} em ${this.getCityObj().name} (-${it.price} Ouro).`, "good");
    Storage.saveToSlot(CONFIG.activeSlot);
    UI.renderAll();
  },

  sellProperty(itemId) {
    this.ensureVigorFields();
    const idx = STATE.inventory.indexOf(itemId);
    const it = DATA.items.find(x => x.id === itemId);
    if (idx === -1 || !it || it.type !== "propriedade") return;
    const saleValue = Math.round(it.price * 0.75);
    STATE.inventory.splice(idx, 1);
    if (Array.isArray(STATE.propertyMeta)) {
      const mIdx = STATE.propertyMeta.findIndex(m => m.id === itemId);
      if (mIdx !== -1) STATE.propertyMeta.splice(mIdx, 1);
    }
    STATE.gold += saleValue;
    SoundFX.play("coin");
    this.addLog(`🪙 VENDA DE PROPRIEDADE: Você liquidou a escritura de **${it.name}** por +${saleValue} Moedas de Ouro (75% do valor).`, "good");
    UI.notify("Propriedade Vendida", `Você recebeu +${saleValue} Ouro pela venda de ${it.name}.`, "coin");
    Storage.saveToSlot(CONFIG.activeSlot);
    UI.renderAll();
  },

  takeLoan(amount) {
    SoundFX.play("coin");
    STATE.gold += amount;
    STATE.debt += Math.round(amount * 1.3);
    this.addLog(`Você tomou ${amount} Ouro com cambistas; sua dívida subiu em ${Math.round(amount * 1.3)} Ouro.`, "bad");
    Storage.saveToSlot(CONFIG.activeSlot);
    UI.renderAll();
  },

  payDebt() {
    if (STATE.debt <= 0) return;
    const pay = Math.min(STATE.gold, STATE.debt);
    if (pay <= 0) {
      UI.notify("Sem Ouro", "Você não possui ouro disponível para abater a dívida.");
      return;
    }
    SoundFX.play("coin");
    STATE.gold -= pay;
    STATE.debt -= pay;
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

    Storage.recordPastLife({
      name: STATE.name,
      surname: STATE.surname,
      generation: STATE.generation,
      years: `${STATE.year - STATE.age}–${STATE.year}`,
      age: STATE.age,
      job: occLabel,
      kingdom: this.getKingdom().name,
      gold: STATE.gold,
      cause
    });

    const deathPortraitEl = document.getElementById("death-portrait-box");
    if (deathPortraitEl) {
      deathPortraitEl.innerHTML = `<div style="filter:grayscale(0.95) contrast(1.1);opacity:0.82">${Utils.renderPortraitHTML({ ...STATE, alive: false }, "lg")}</div>`;
    }
    document.getElementById("death-epitaph").innerHTML = `${Utils.renderCrestHTML(STATE.surname)} ${epitaph}`;
    document.getElementById("death-summary").innerHTML = `
      <p><strong>Causa da Morte:</strong> ${cause}</p>
      <p><strong>Casa & Geração:</strong> Casa ${STATE.surname} (${STATE.generation}ª Geração)</p>
      <p><strong>Classe e Posição Final:</strong> ${this.getClassLabel(STATE.socialClass)} — ${occLabel}</p>
      <p><strong>Patrimônio Líquido:</strong> ${STATE.gold} Ouro (Dívidas: ${STATE.debt} Ouro) | ${STATE.inventory.length} bens/propriedades</p>
      <p><strong>Reputação & Honra:</strong> Reputação ${STATE.reputation}/10 | Honra ${STATE.honor}/100</p>
      <p><strong>Marcas do Destino (Flags):</strong> ${STATE.flags.length ? STATE.flags.join(", ") : "Nenhuma marca especial"}</p>
    `;

    const k = this.getKingdom();
    document.getElementById("sucession-law-desc").textContent = `Lei de Sucessão de ${k.name}: ${k.law} — ${k.desc}`;

    const livingChildren = STATE.npcs.filter(n => n.role === "Filho" && n.alive);
    const heirsBox = document.getElementById("heirs-list");

    if (livingChildren.length === 0) {
      heirsBox.innerHTML = `<div class="slot-item"><span>Sua linhagem direta extinguiu-se sem filhos vivos.</span></div>`;
      Storage.deleteSlot(CONFIG.activeSlot);
    } else {
      heirsBox.innerHTML = livingChildren.map(child => `
        <div class="slot-item">
          <div style="display:flex;align-items:center;gap:0.75rem">
            ${Utils.renderPortraitHTML(child)}
            <div>
              <strong>${Utils.renderCrestHTML(child.surname || STATE.surname)}${child.name}</strong> (${child.sex === 'M' ? 'Varão' : 'Filha'}, ${child.age} anos)<br>
              <small>Herdeiro legítimo do sangue e brasão dos ${STATE.surname}</small>
            </div>
          </div>
          <button type="button" class="primary" onclick="window.Engine.succeedWithHeir('${child.id}')">👑 Assumir Sucessão</button>
        </div>
      `).join("");
    }

    UI.showScreen("screen-death");
  }
});
