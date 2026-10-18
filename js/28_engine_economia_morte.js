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
      mortgaged: false,
      ruinedYears: 0
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
    if (Array.isArray(STATE.usedItemUidsThisYear)) {
      STATE.usedItemUidsThisYear = STATE.usedItemUidsThisYear.filter(u => u !== inst.uid);
    }
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

  useItemInstance(uid) {
    this.ensureVigorFields();
    const inst = (STATE.itemInstances || []).find(x => x.uid === uid);
    if (!inst) return;
    const it = DATA.items.find(x => x.id === inst.id);
    if (!it) return;

    if (inst.mortgaged) {
      this.addLog("⚠️ Este bem está hipotecado e não pode ser explorado diretamente.", "bad");
      if (window.UI && window.UI.notify) UI.notify("Bem Hipotecado", "Este bem está hipotecado e não pode ser explorado diretamente.", "fail");
      return;
    }
    if (inst.state === "arruinado") {
      this.addLog("⚠️ Este bem está arruinado! Restaure-o antes de utilizá-lo.", "bad");
      if (window.UI && window.UI.notify) UI.notify("Bem Arruinado", "Este bem está arruinado! Restaure-o antes de utilizá-lo.", "fail");
      return;
    }

    const isProperty = it.category === "propriedade" || it.type === "propriedade";
    const isDistant = isProperty && ((inst.kingdom && inst.kingdom !== STATE.kingdom) || (inst.cityId && inst.cityId !== STATE.currentCityId));
    if (isDistant) {
      const courierFee = 15;
      if (STATE.gold < courierFee) {
        UI.notify("Taxa de Feitor Insuficiente", `Explorar imóvel situado em outra comarca exige o pagamento de ${courierFee} Ouro a feitores e correios régios.`);
        return;
      }
      STATE.gold -= courierFee;
      this.addLog(`📬 SOBRETAXA DE DISTÂNCIA: Você pagou ${courierFee} Ouro a correios e feitores para administrar seu imóvel à distância em outra comarca.`, "bad");
    }

    if (!Array.isArray(STATE.usedItemUidsThisYear)) STATE.usedItemUidsThisYear = [];
    if (STATE.usedItemUidsThisYear.includes(inst.uid)) {
      const waitMsg = `⏳ Você já realizou a ação anual de **${it.name}** neste ano.`;
      this.addLog(waitMsg, "bad");
      if (window.UI && window.UI.notify) UI.notify("Ação Anual Realizada", `Você já realizou a ação anual de ${it.name} neste ano.`, "fail");
      return;
    }

    if (!this.consumeVigor(8, it.useLabel || "Usar Bem")) return;
    STATE.usedItemUidsThisYear.push(inst.uid);

    const addAttr = (attrKey, delta) => {
      STATE.attrs[attrKey] = Utils.clamp((STATE.attrs[attrKey] || 20) + delta, 0, 100);
      if (attrKey === "saude") {
        STATE.maxHp = Math.max(10, this.getEffectiveAttr("saude"));
      }
    };
    const healHp = (val) => {
      STATE.maxHp = Math.max(10, this.getEffectiveAttr("saude"));
      STATE.hp = Math.min(STATE.maxHp, STATE.hp + val);
    };

    let msg = "";
    switch (inst.id) {
      case "casebre_madeira":
        healHp(3);
        STATE.gold += 4;
        msg = "🏚️ Você cuidou da horta e reforçou o telhado do Casebre (+3 Saúde, +4 Ouro).";
        break;
      case "casa_urbana":
        STATE.gold += 10;
        addAttr("carisma", 3);
        msg = "🏠 Você recebeu mercadores e vizinhos influentes em sua Casa Urbana (+10 Ouro, +3 Carisma).";
        break;
      case "oficina_artesao":
        STATE.gold += 18;
        STATE.jobPerformance = Utils.clamp((STATE.jobPerformance || 50) + 5, 0, 100);
        msg = "⚒️ Turno extra de encomendas na Oficina de Artesão (+18 Ouro, +5 Desempenho).";
        break;
      case "moinho_vento":
        STATE.gold += 22;
        msg = "🌾 Você cobrou os direitos de moagem da safra local no Moinho (+22 Ouro).";
        break;
      case "taverna_porto":
        STATE.gold += 26;
        STATE.reputation = Utils.clamp(STATE.reputation + 1, -10, 10);
        msg = "🍺 Noite de música, dados e canecos cheios na sua Taverna do Porto (+26 Ouro, +1 Reputação).";
        break;
      case "terra_aravel":
        STATE.gold += 30;
        healHp(3);
        msg = "🌱 Você supervisionou pessoalmente a colheita nas Terras Aráveis (+30 Ouro, +3 Saúde).";
        break;
      case "solar_nobre":
        STATE.gold += 20;
        STATE.honor = Utils.clamp(STATE.honor + 2, 0, 100);
        addAttr("carisma", 2);
        msg = "🏛️ Recepção fidalga nos salões do seu Solar Nobre (+20 Ouro, +2 Honra, +2 Carisma).";
        break;
      case "forte_fronteira":
        STATE.gold += 35;
        STATE.honor = Utils.clamp(STATE.honor + 3, 0, 100);
        if (STATE.fief) STATE.fief.defense = Utils.clamp((STATE.fief.defense || 50) + 4, 0, 100);
        msg = "🛡️ Você passou a guarnição em revista e cobrou pedágio militar no Forte (+35 Ouro, +3 Honra).";
        break;
      case "castelo_feudal":
        STATE.gold += 45;
        STATE.honor = Utils.clamp(STATE.honor + 4, 0, 100);
        if (STATE.fief) {
          STATE.fief.defense = Utils.clamp((STATE.fief.defense || 50) + 6, 0, 100);
          STATE.fief.loyalty = Utils.clamp((STATE.fief.loyalty || 50) + 4, 0, 100);
        }
        msg = "🏰 Você presidiu a alta corte senhorial no Castelo Feudal (+45 Ouro, +4 Honra).";
        break;
      case "palacio_real":
        STATE.gold += 65;
        STATE.honor = Utils.clamp(STATE.honor + 5, 0, 100);
        STATE.reputation = Utils.clamp(STATE.reputation + 1, -10, 10);
        msg = "👑 Grande gala imperial nos jardins do Palácio Real (+65 Ouro, +5 Honra, +1 Reputação).";
        break;
      case "cavalo_carga":
        STATE.gold += 10;
        msg = "🐴 Você fretou seu Cavalo de Carga para entregas locais (+10 Ouro).";
        break;
      case "cavalo_guerra":
        addAttr("forca", 3);
        STATE.honor = Utils.clamp(STATE.honor + 2, 0, 100);
        msg = "🐎 Você treinou cargas de lança com seu Destriero de Guerra (+3 Força, +2 Honra).";
        break;
      case "carruagem_luxo":
        addAttr("carisma", 3);
        STATE.honor = Utils.clamp(STATE.honor + 2, 0, 100);
        msg = "🛞 Passeio triunfal de Carruagem Dourada pela cidade (+3 Carisma, +2 Honra).";
        break;
      case "barco_pesca":
        STATE.gold += 16;
        healHp(2);
        msg = "🚣 Você lançou redes ao largo com sua Barcaça Costeira (+16 Ouro, +2 Saúde).";
        break;
      case "navio_mercante":
        STATE.gold += 42;
        msg = "⛵ Sua Nau Mercante concluiu um frete costeiro de especiarias (+42 Ouro).";
        break;
      case "adaga_ferro":
        addAttr("destreza", 2);
        STATE.gold += 5;
        msg = "🗡️ Treino de reflexos e arremesso com a Adaga de Aço (+2 Destreza, +5 Ouro).";
        break;
      case "arco_composto":
        STATE.gold += 12;
        addAttr("destreza", 2);
        msg = "🏹 Você abateu caça fina usando seu Arco Composto (+12 Ouro, +2 Destreza).";
        break;
      case "espada_longa":
        addAttr("forca", 2);
        STATE.honor = Utils.clamp(STATE.honor + 2, 0, 100);
        msg = "⚔️ Sessão intensa de esgrima com a Espada Longa (+2 Força, +2 Honra).";
        break;
      case "lamina_damasco":
        addAttr("forca", 3);
        addAttr("destreza", 2);
        STATE.honor = Utils.clamp(STATE.honor + 3, 0, 100);
        msg = "🌙 Você poliu e exibiu a maestria da Lâmina de Damasco (+3 Força, +2 Destreza, +3 Honra).";
        break;
      case "gibao_couro":
        healHp(3);
        msg = "🦺 Você ajustou e reforçou seu Gibão de Couro (+3 Saúde).";
        break;
      case "cota_malha":
        healHp(3);
        addAttr("forca", 2);
        msg = "⛓️ Marcha de resistência envergando a Cota de Malha (+3 Saúde, +2 Força).";
        break;
      case "armadura_placas":
        STATE.honor = Utils.clamp(STATE.honor + 4, 0, 100);
        healHp(3);
        msg = "🛡️ Você desfilou em parada militar com sua Armadura de Placas (+4 Honra, +3 Saúde).";
        break;
      case "flauta_osso":
        STATE.gold += 8;
        addAttr("carisma", 2);
        msg = "🪈 Você tocou melodias populares na praça com sua Flauta (+8 Ouro, +2 Carisma).";
        break;
      case "alaude_nobre":
        STATE.gold += 14;
        addAttr("carisma", 3);
        msg = "🪕 Você apresentou uma serenata cortês no Alaúde Veneziano (+14 Ouro, +3 Carisma).";
        break;
      case "harpa_dourada":
        STATE.gold += 22;
        addAttr("carisma", 3);
        STATE.honor = Utils.clamp(STATE.honor + 2, 0, 100);
        msg = "🎶 Seu recital na Harpa Real encantou a nobreza local (+22 Ouro, +3 Carisma, +2 Honra).";
        break;
      case "ferramentas_mestre":
        STATE.gold += 15;
        addAttr("destreza", 2);
        STATE.jobPerformance = Utils.clamp((STATE.jobPerformance || 50) + 4, 0, 100);
        msg = "🔨 Você calibrou suas Ferramentas de Mestre e fez reparos de precisão (+15 Ouro, +2 Destreza).";
        break;
      case "astrolabio_bronze":
        addAttr("intelecto", 3);
        addAttr("sorte", 2);
        msg = "🧭 Você traçou cartas celestes com o Astrolábio de Bronze (+3 Intelecto, +2 Sorte).";
        break;
      case "alambique_alquimia":
        healHp(8);
        STATE.gold += 14;
        msg = "⚗️ Você destilou tônicos curativos e essências no Alambique (+8 Saúde, +14 Ouro).";
        break;
      case "espelho_veneziano":
        addAttr("beleza", 3);
        addAttr("carisma", 2);
        msg = "🪞 Ritual de estética e unguentos diante do Espelho Veneziano (+3 Beleza, +2 Carisma).";
        break;
      case "grimorio_latim":
        addAttr("intelecto", 3);
        addAttr("fe", 2);
        msg = "📕 Você decifrou tratados antigos no Grimório Iluminado (+3 Intelecto, +2 Fé).";
        break;
      case "reliquia_santa":
        addAttr("fe", 3);
        STATE.honor = Utils.clamp(STATE.honor + 3, 0, 100);
        healHp(5);
        msg = "⚱️ Vigília devota diante da Relíquia Sagrada (+3 Fé, +3 Honra, +5 Saúde).";
        break;
      case "coroa_colecionador":
        STATE.honor = Utils.clamp(STATE.honor + 4, 0, 100);
        STATE.reputation = Utils.clamp(STATE.reputation + 1, -10, 10);
        if (STATE.fief) STATE.fief.influence = Utils.clamp((STATE.fief.influence || 50) + 3, 0, 100);
        msg = "💎 Você exibiu a Coroa de Colecionador perante emissários (+4 Honra, +1 Reputação).";
        break;
      default:
        STATE.gold += 10;
        msg = `✨ Você utilizou **${it.name}** com proveito (+10 Ouro).`;
        break;
    }

    SoundFX.play("coin");
    this.addLog(msg, "good");
    if (window.UI && window.UI.notify) UI.notify(it.useLabel || it.name, msg, "coin");
    this.recalculateSocialClassByWealth();
    if (this.checkAchievements) this.checkAchievements();
    Storage.saveToSlot(CONFIG.activeSlot);
    UI.renderAll();
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
    const isProperty = it.category === "propriedade" || it.type === "propriedade";
    const isDistant = isProperty && ((inst.kingdom && inst.kingdom !== STATE.kingdom) || (inst.cityId && inst.cityId !== STATE.currentCityId));
    let repairCost = Math.max(2, Math.round(it.price * 0.20));
    if (isDistant) {
      repairCost = Math.round(repairCost * 1.50);
    }

    if (STATE.gold < repairCost) {
      UI.notify("Ouro Insuficiente", `Você precisa de ${repairCost} Ouro para restaurar este bem${isDistant ? " (inclui taxa extra de 50% de fiscalização à distância)" : ""}.`);
      return;
    }
    STATE.gold -= repairCost;
    inst.ruinedYears = 0;
    const nextState = inst.state === "arruinado" ? "desgastado" : (inst.state === "desgastado" ? "bom" : "novo");
    const oldState = inst.state;
    inst.state = nextState;
    SoundFX.play("coin");
    this.addLog(`🛠️ RESTAURAÇÃO: Você investiu ${repairCost} Ouro na reforma de **${it.name}**${isDistant ? " (com sobretaxa de fiscalização à distância)" : ""}, elevando seu estado de [${oldState}] para [${nextState}].`, "good");
    Storage.saveToSlot(CONFIG.activeSlot);
    UI.renderAll();
  },

  degradeItemsAnnually() {
    if (!STATE || !Array.isArray(STATE.itemInstances)) return;
    const toRemoveUids = [];

    STATE.itemInstances.forEach(inst => {
      const it = DATA.items.find(x => x.id === inst.id);
      if (!it) return;
      if (inst.ruinedYears === undefined) inst.ruinedYears = 0;

      if (inst.state === "arruinado") {
        inst.ruinedYears++;
        if (inst.ruinedYears >= 3) {
          toRemoveUids.push(inst.uid);
          SoundFX.play("death");
          const ruinMsg = `🏚️💥 DESMORONAMENTO E CONFISCO: Abandonado em ruínas por 3 anos consecutivos, seu bem **${it.name}** desmoronou irremediavelmente e os escombros foram confiscados pela comarca!`;
          this.addLog(ruinMsg, "bad");
          if (window.UI && window.UI.notify) UI.notify("💥 Colapso e Confisco de Bem!", ruinMsg, "fail");
        } else {
          this.addLog(`⚠️ RUÍNA CRÍTICA: Seu bem **${it.name}** está arruinado há ${inst.ruinedYears} ano(s). Se atingir 3 anos sem restauro, desmoronará e será confiscado!`, "bad");
        }
        return;
      }

      const decayRate = (DATA.itemStates[inst.state] && DATA.itemStates[inst.state].decayRate) || 0.08;
      if (Math.random() < decayRate) {
        const oldState = inst.state;
        inst.state = inst.state === "novo" ? "bom" : (inst.state === "bom" ? "desgastado" : "arruinado");
        if (inst.state === "arruinado") inst.ruinedYears = 0;
        this.addLog(`🏚️ DESGASTE DE BEM: A ação do tempo e intempéries desgastou **${it.name}** de [${oldState}] para [${inst.state}].`, "bad");
      }
    });

    if (toRemoveUids.length > 0) {
      toRemoveUids.forEach(uid => {
        const idx = STATE.itemInstances.findIndex(x => x.uid === uid);
        if (idx !== -1) {
          const removed = STATE.itemInstances.splice(idx, 1)[0];
          const invIdx = STATE.inventory.indexOf(removed.id);
          if (invIdx !== -1) STATE.inventory.splice(invIdx, 1);
          if (Array.isArray(STATE.propertyMeta)) {
            const pmIdx = STATE.propertyMeta.findIndex(p => p.id === removed.id);
            if (pmIdx !== -1) STATE.propertyMeta.splice(pmIdx, 1);
          }
          if (Array.isArray(STATE.usedItemUidsThisYear)) {
            STATE.usedItemUidsThisYear = STATE.usedItemUidsThisYear.filter(u => u !== uid);
          }
        }
      });
      this.recalculateSocialClassByWealth();
    }
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

    const eligibleChildren = this.getEligibleHeirs ? this.getEligibleHeirs() : STATE.npcs.filter(n => (n.role === "Filho" || n.role === "Filha") && n.alive && !n.abandoned);
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

    if (typeof document !== "undefined") {
      document.body.classList.add("memento-mori-active");
      if (!document.getElementById("memento-vignette")) {
        const vig = document.createElement("div");
        vig.id = "memento-vignette";
        vig.className = "memento-mori-vignette";
        document.body.appendChild(vig);
      }
    }

    UI.showScreen("screen-death");
  }
});
