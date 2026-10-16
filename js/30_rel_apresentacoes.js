/* ============================================================================
   [RELAÇÕES · APRESENTAÇÕES] — pretendentes, vila, corte real e colegas de ofício
   ============================================================================ */
Object.assign(Engine, {
  introduceRoyalCourtier() {
    this.ensureVigorFields();
    if (!STATE.nobleTitleLevel || STATE.nobleTitleLevel < 1) {
      UI.notify("Acesso Restrito à Nobreza Titular", "Apenas portadores de Título de Nobreza têm assento no Salão da Corte Real.");
      return;
    }
    if (this.isInCapital && !this.isInCapital()) {
      const cap = this.getCapitalCity(STATE.kingdom);
      UI.notify("Corte Localizada na Capital", `A Corte reúne-se exclusivamente na capital (${cap.name}). Viaje até lá pela barra lateral para frequentar o Paço.`);
      return;
    }
    if (STATE.vigor < 10) {
      UI.notify("Vigor Insuficiente", "Exige 10 de Vigor para apresentar-se nas audiências da Corte Real.");
      return;
    }
    STATE.vigor -= 10;
    SoundFX.play("bells");
    const sex = Math.random() < 0.5 ? "M" : "F";
    const pools = this.getRoyalCourtPools ? this.getRoyalCourtPools(STATE.kingdom) : null;
    const poolM = pools ? pools.poolM : ["Príncipe Real", "Duque de Sangue Real", "Conde Palatino", "Visconde da Comarca", "Barão Feudal", "Fidalgo de Solar"];
    const poolF = pools ? pools.poolF : ["Princesa Real", "Duquesa de Sangue Real", "Condessa Palatina", "Viscondessa da Comarca", "Baronesa Feudal", "Fidalga de Solar"];
    const chosenTitle = sex === "F" ? Utils.pick(poolF) : Utils.pick(poolM);
    const courtier = Utils.genNPC("Corte", Utils.rand(18, 56), sex, null, "nobre", `Membro da Corte (${chosenTitle})`, chosenTitle);
    const capCity = this.getCapitalCity ? this.getCapitalCity(STATE.kingdom) : null;
    if (capCity && capCity.id) {
      courtier.cityId = capCity.id;
      courtier.birthCityId = capCity.id;
    }
    STATE.npcs.push(courtier);
    this.addLog(`👑 Nos salões de mármore da Corte Real (-10 Vigor), você foi apresentado(a) a **${courtier.name}**, **${chosenTitle}** da Casa ${courtier.surname}.`, "good");
    Storage.saveToSlot(CONFIG.activeSlot);
    UI.renderAll();
    UI.openNPCModal(courtier.id);
  },

  introduceColleague() {
    this.ensureVigorFields();
    if (!this.hasActiveOccupation()) {
      UI.notify("Sem Ofício ou Guilda", "Você precisa ingressar em uma Guilda ou assumir um Ofício na aba 'Ofícios e Guildas' para ter colegas.");
      return;
    }
    if (STATE.vigor < 8) {
      UI.notify("Vigor Insuficiente", "Você está sem Vigor para buscar novos contatos na corporação.");
      return;
    }
    STATE.vigor -= 8;
    SoundFX.play("click");
    const isGuild = !!STATE.guildTraining;
    const occLabel = isGuild ? STATE.guildTraining.guildName : this.getJob().name;
    let colTitle = occLabel;
    if (isGuild) {
      colTitle = Math.random() < 0.35 ? `Mestre da Guilda (${occLabel})` : `Aprendiz de Guilda (${occLabel})`;
    } else {
      const ranks = this.getJob().ranks || [occLabel];
      colTitle = `${Utils.pick(ranks)} (${occLabel})`;
    }
    const col = Utils.genNPC("Colega de Ofício", Utils.rand(16, 54), null, null, STATE.socialClass, colTitle);
    STATE.npcs.push(col);
    this.addLog(`⚒️ Na hierarquia de ${occLabel} (-8 Vigor), você estreitou contato com ${col.name} (${colTitle}, Casa ${col.surname}).`);
    Storage.saveToSlot(CONFIG.activeSlot);
    UI.renderAll();
    UI.openNPCModal(col.id);
  },

  introduceSuitor() {
    if (STATE.age < 15) {
      UI.notify("Muito Jovem", "Aguarde completar ao menos 15 anos para buscar pretendentes nas festas e feiras.");
      return;
    }
    if (STATE.gold < 5) {
      UI.notify("Ouro Insuficiente", "Frequentar os salões e feiras em busca de pretendentes custa 5 moedas de ouro.");
      return;
    }
    STATE.gold -= 5;
    SoundFX.play("love");
    const oppSex = STATE.sex === "M" ? "F" : "M";
    const sClass = Math.random() < 0.25 ? "nobre" : (Math.random() < 0.5 ? "media" : STATE.socialClass);
    const suitor = Utils.genNPC("Pretendente", Utils.rand(Math.max(16, STATE.age - 5), STATE.age + 4), oppSex, null, sClass);
    suitor.affinity = Utils.rand(35, 65);
    STATE.npcs.push(suitor);
    this.addLog(`🌹 Em uma festa local (-5 Ouro), seus olhares cruzaram-se com os de **${suitor.name}** (Casa ${suitor.surname}, ${this.getClassLabel(suitor.socialClass)}).`, "good");
    Storage.saveToSlot(CONFIG.activeSlot);
    UI.renderAll();
    UI.openNPCModal(suitor.id);
  },

  introduceCourtier() {
    this.ensureVigorFields();
    if (STATE.vigor < 8) {
      UI.notify("Vigor Insuficiente", "Você está sem Vigor. Repouse ou avance o ano.");
      return;
    }
    STATE.vigor -= 8;
    SoundFX.play("click");
    const role = Utils.pick(["Amigo", "Mentor", "Rival"]);
    const npc = Utils.genNPC(role, Utils.rand(18, 52));
    STATE.npcs.push(npc);
    this.addLog(`🍷 Circulando pelas rodas de conversa (-8 Vigor), você conheceu **${npc.name}** (Casa ${npc.surname}), que se revelou um ${role}.`);
    Storage.saveToSlot(CONFIG.activeSlot);
    UI.renderAll();
    UI.openNPCModal(npc.id);
  }
});
