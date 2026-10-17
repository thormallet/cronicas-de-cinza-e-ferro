/* ============================================================================
   [ENGINE · NOBREZA E FEUDO] — decretos e ações de governação do feudo
   ============================================================================ */
Object.assign(Engine, {
  performNobleRealmAction(actionId, fromOrder = false) {
    this.ensureVigorFields();
    if (STATE.age < 16) {
      UI.notify("Menoridade Feudal", "Você ainda não possui a maioridade (16 anos) para emitir decretos ou governar o feudo diretamente.");
      return;
    }
    if (!STATE.nobleTitleLevel || STATE.nobleTitleLevel < 1) return;
    if (!fromOrder && this.isInUrbanCenter && !this.isInUrbanCenter()) {
      this.dispatchNobleOrder(actionId);
      return;
    }
    const f = STATE.fief;
    const lvl = STATE.nobleTitleLevel;
    const titleName = this.getNobleTitleLabel();

    if (actionId === "collect_tribute") {
      if (STATE.vigor < 12) { UI.notify("Vigor Insuficiente", "Exige 12 de Vigor."); return; }
      STATE.vigor -= 12;
      const gain = 20 + lvl * 18 + Math.floor(f.prosperity * 0.3);
      STATE.gold += gain;
      f.peasantry = Utils.clamp(f.peasantry - 8, 0, 100);
      f.loyalty = Utils.clamp(f.loyalty - 4, 0, 100);
      const msg = `Como ${titleName}, você cobrou banalidades e foros extraordinários nas suas terras (+${gain} Ouro, -8 Contentamento Camponês).`;
      this.addLog(`🪙 ${msg}`, "epoch");
      UI.notify("Arrecadação Senhorial", msg, "coin");
    } else if (actionId === "improve_lands") {
      const cost = 30 + lvl * 15;
      if (STATE.gold < cost || STATE.vigor < 12) { UI.notify("Recursos Insuficientes", `Exige ${cost} Ouro e 12 de Vigor.`); return; }
      STATE.gold -= cost;
      STATE.vigor -= 12;
      f.prosperity = Utils.clamp(f.prosperity + 12, 0, 100);
      f.peasantry = Utils.clamp(f.peasantry + 10, 0, 100);
      STATE.honor = Utils.clamp(STATE.honor + 4, 0, 100);
      const msg = `Você investiu ${cost} Ouro em moinhos, pontes e celeiros no seu domínio (+12 Prosperidade, +10 Camponeses, +4 Honra)!`;
      this.addLog(`🌾 ${msg}`, "good");
      UI.notify("Fomento do Domínio", msg, "success");
    } else if (actionId === "baronial_justice" && lvl >= 2) {
      if (STATE.vigor < 14) { UI.notify("Vigor Insuficiente", "Exige 14 de Vigor."); return; }
      STATE.vigor -= 14;
      const check = this.rollCheck("intelecto", 52);
      if (check.success) {
        f.loyalty = Utils.clamp(f.loyalty + 10, 0, 100);
        f.defense = Utils.clamp(f.defense + 8, 0, 100);
        STATE.reputation = Utils.clamp(STATE.reputation + 1, -10, 10);
        const msg = `Você presidiu a Alta Justiça Baronial e reforçou as patrulhas da baronia (+10 Lealdade, +8 Defesa, +1 Reputação)!`;
        this.addLog(`⚖️ ${msg}`, "good");
        UI.notify("Alta Justiça Baronial", msg, "bells");
      } else {
        f.loyalty = Utils.clamp(f.loyalty - 6, 0, 100);
        const msg = `Suas sentenças desagradaram os vassalos menores da baronia (-6 Lealdade).`;
        this.addLog(`⚖️ ${msg}`, "bad");
        UI.notify("Atrito Feudal", msg, "fail");
      }
    } else if (actionId === "viscount_charters" && lvl >= 3) {
      if (STATE.vigor < 15) { UI.notify("Vigor Insuficiente", "Exige 15 de Vigor."); return; }
      STATE.vigor -= 15;
      const check = this.rollCheck("carisma", 56);
      if (check.success) {
        const profit = 45 + lvl * 15;
        STATE.gold += profit;
        f.prosperity = Utils.clamp(f.prosperity + 8, 0, 100);
        f.influence = Utils.clamp(f.influence + 10, 0, 100);
        const msg = `Suas feiras francas na Comarca atraíram mercadores de todo o reino (+${profit} Ouro, +8 Prosperidade, +10 Influência)!`;
        this.addLog(`📜 ${msg}`, "good");
        UI.notify("Feiras da Comarca", msg, "coin");
      } else {
        const msg = `Disputas de pedágio entre guildas reduziram o lucro das feiras da comarca.`;
        this.addLog(`📜 ${msg}`, "bad");
        UI.notify("Impasse Mercantil", msg, "fail");
      }
    } else if (actionId === "palatine_levy" && lvl >= 4) {
      const cost = 75;
      if (STATE.gold < cost || STATE.vigor < 16) { UI.notify("Recursos Insuficientes", `Exige ${cost} Ouro e 16 de Vigor.`); return; }
      STATE.gold -= cost;
      STATE.vigor -= 16;
      f.defense = Utils.clamp(f.defense + 18, 0, 100);
      f.influence = Utils.clamp(f.influence + 12, 0, 100);
      STATE.reputation = Utils.clamp(STATE.reputation + 1, -10, 10);
      const msg = `Como ${titleName}, você convocou as hostes do Condado e fortaleceu os castelos fronteiriços (+18 Defesa, +12 Influência, +1 Reputação)!`;
      this.addLog(`🛡️ ${msg}`, "good");
      UI.notify("Hostes do Condado", msg, "sword");
    } else if (actionId === "ducal_council" && lvl >= 5) {
      if (STATE.vigor < 18) { UI.notify("Vigor Insuficiente", "Exige 18 de Vigor."); return; }
      STATE.vigor -= 18;
      const check = this.rollCheck("carisma", 62);
      if (check.success) {
        const tribute = Utils.rand(90, 160);
        STATE.gold += tribute;
        f.influence = Utils.clamp(f.influence + 16, 0, 100);
        STATE.honor = Utils.clamp(STATE.honor + 6, 0, 100);
        const msg = `No Grande Conselho Ducal, sua voz dobrou ministros e barões da Coroa (+${tribute} Ouro em subsídios reais, +16 Influência, +6 Honra)!`;
        this.addLog(`👑 ${msg}`, "epoch");
        UI.notify("Soberania Ducal na Corte", msg, "bells");
      } else {
        f.influence = Utils.clamp(f.influence - 8, 0, 100);
        const msg = `Facções rivais no Conselho Real bloquearam suas reivindicações ducais (-8 Influência).`;
        this.addLog(`👑 ${msg}`, "bad");
        UI.notify("Intriga no Conselho", msg, "fail");
      }
    }
    if (!fromOrder) {
      Storage.saveToSlot(CONFIG.activeSlot);
      UI.renderAll();
    }
  }
});
