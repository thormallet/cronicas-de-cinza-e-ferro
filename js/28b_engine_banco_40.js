/* ============================================================================
   [ENGINE · BANCO, EMPRÉSTIMOS, CONQUISTAS E LEGADO 4.0] — crédito duplo, usura, legado e proezas
   ============================================================================ */
Object.assign(Engine, {
  takeHistoricalLoan(creditorId, customAmount = null, collateralUid = null) {
    this.ensureVigorFields();
    const cred = (DATA.loanCreditors && DATA.loanCreditors[creditorId]) || DATA.loanCreditors.agiotas_beco;
    if (!cred) return;
    const maxLoan = cred.maxLoan || 120;
    const amount = customAmount ? Math.min(customAmount, maxLoan) : maxLoan;

    let collatInst = null;
    if (creditorId === "cambistas_corte") {
      collatInst = collateralUid
        ? STATE.itemInstances.find(x => x.uid === collateralUid && !x.mortgaged)
        : STATE.itemInstances.find(x => !x.mortgaged);
      if (!collatInst) {
        UI.notify("Fiança Exigida", "Os cambistas da corte exigem ao menos um bem em garantia para liberar crédito.");
        return;
      }
    } else if (creditorId === "casa_bancaria") {
      collatInst = collateralUid
        ? STATE.itemInstances.find(x => x.uid === collateralUid && !x.mortgaged)
        : STATE.itemInstances.find(x => {
            const it = DATA.items.find(i => i.id === x.id);
            return it && (it.category === "propriedade" || it.category === "transporte") && !x.mortgaged;
          });
      if (!collatInst) {
        UI.notify("Hipoteca Exigida", "A Casa Bancária exige a hipoteca formal de um imóvel ou frota mercante.");
        return;
      }
    }

    if (collatInst) collatInst.mortgaged = true;
    STATE.gold += amount;
    const years = creditorId === "agiotas_beco" ? 3 : (creditorId === "cambistas_corte" ? 4 : 5);
    const loanUid = "loan_" + Math.random().toString(36).slice(2, 9);
    STATE.activeLoans.push({
      uid: loanUid,
      creditorId,
      creditorName: cred.name,
      principal: amount,
      balance: amount,
      interestRate: cred.interestRate || 0.15,
      yearsLeft: years,
      collateralUid: collatInst ? collatInst.uid : null,
      collateralItemId: collatInst ? collatInst.id : null,
      penaltyType: cred.penaltyRisk || 0.15
    });

    STATE.debt = STATE.activeLoans.reduce((sum, l) => sum + (l.balance || 0), 0);
    SoundFX.play("coin");
    const collatMsg = collatInst ? ` (Garantia penhorada: ${collatInst.id})` : " (Sem garantia)";
    this.addLog(`📜 CONTRATO DE CRÉDITO: Você tomou ${amount} Ouro com **${cred.name}** a ${(cred.interestRate * 100)}% ao ano${collatMsg}.`, "bad");
    Storage.saveToSlot(CONFIG.activeSlot);
    UI.renderAll();
  },

  payHistoricalLoan(loanUid, partial = false) {
    this.ensureVigorFields();
    const loan = STATE.activeLoans.find(l => l.uid === loanUid);
    if (!loan) return;
    const amountToPay = partial ? Math.min(STATE.gold, Math.ceil(loan.balance / 2)) : Math.min(STATE.gold, loan.balance);
    if (amountToPay <= 0) {
      UI.notify("Sem Moedas", "Você não possui moedas de ouro para amortizar este empréstimo.");
      return;
    }
    STATE.gold -= amountToPay;
    loan.balance -= amountToPay;
    SoundFX.play("coin");

    if (loan.balance <= 0) {
      if (loan.collateralUid) {
        const inst = STATE.itemInstances.find(x => x.uid === loan.collateralUid);
        if (inst) inst.mortgaged = false;
      }
      STATE.activeLoans = STATE.activeLoans.filter(l => l.uid !== loanUid);
      this.addLog(`🪙 DÍVIDA QUITADA: Você liquidou totalmente o empréstimo com **${loan.creditorName}**, liberando todas as garantias penhoradas!`, "good");
    } else {
      this.addLog(`🪙 AMORTIZAÇÃO: Você pagou ${amountToPay} Ouro a **${loan.creditorName}** (Saldo devedor: ${loan.balance} Ouro).`, "good");
    }

    STATE.debt = STATE.activeLoans.reduce((sum, l) => sum + (l.balance || 0), 0);
    Storage.saveToSlot(CONFIG.activeSlot);
    UI.renderAll();
  },

  issueBankerLoan(clientId) {
    this.ensureVigorFields();
    const client = (DATA.bankerClients && DATA.bankerClients[clientId]) || DATA.bankerClients.mercador_aventureiro;
    if (!client) return;
    if (STATE.gold < client.loanAmount) {
      UI.notify("Capital Insuficiente", `Você precisa de ao menos ${client.loanAmount} Ouro para financiar esta operação.`);
      return;
    }
    STATE.gold -= client.loanAmount;
    const totalReturn = Math.round(client.loanAmount * (1 + (client.returnRate * 3)));
    const collatMap = {
      mercador_aventureiro: "navio_mercante",
      barao_endividado: "terra_aravel",
      coroa_real: "coroa_colecionador"
    };

    STATE.bankerLoans.push({
      uid: "b_loan_" + Math.random().toString(36).slice(2, 9),
      clientId,
      clientName: client.name,
      principal: client.loanAmount,
      expectedReturn: totalReturn,
      interestRate: client.returnRate,
      defaultRisk: client.defaultRisk,
      yearsLeft: 3,
      collateralItemId: collatMap[clientId] || "casa_urbana"
    });

    SoundFX.play("bells");
    Storage.unlockAchievement("ach_banqueiro_reinos");
    this.addLog(`🏛️ FINANCIAMENTO BANCÁRIO: Você concedeu crédito de ${client.loanAmount} Ouro para **${client.name}** a ${(client.returnRate * 100)}%/ano (Retorno previsto: ${totalReturn} Ouro em 3 anos).`, "epoch");
    Storage.saveToSlot(CONFIG.activeSlot);
    UI.renderAll();
  },

  processAnnualLoans() {
    if (!STATE) return;
    /* 1. Empréstimos tomados pelo protagonista */
    if (Array.isArray(STATE.activeLoans) && STATE.activeLoans.length > 0) {
      STATE.activeLoans.forEach(loan => {
        loan.balance += Math.round(loan.balance * (loan.interestRate || 0.10));
        loan.yearsLeft--;
        if (loan.yearsLeft <= 0 && loan.balance > 0) {
          if (STATE.gold >= loan.balance) {
            STATE.gold -= loan.balance;
            this.addLog(`⚖️ COBRANÇA JUDICIAL: A corte executou o pagamento compulsório de ${loan.balance} Ouro a **${loan.creditorName}**.`, "bad");
            loan.balance = 0;
            if (loan.collateralUid) {
              const inst = STATE.itemInstances.find(x => x.uid === loan.collateralUid);
              if (inst) inst.mortgaged = false;
            }
          } else {
            if (loan.creditorId === "agiotas_beco") {
              STATE.hp = Math.max(1, STATE.hp - 28);
              STATE.honor = Math.max(0, STATE.honor - 5);
              STATE.scars.push("Cicatrizes de tortura por dívida de agiotas");
              loan.balance = Math.round(loan.balance * 1.35);
              loan.yearsLeft = 2;
              this.addLog(`🩸 AGRESSÃO DE COBRADORES: Capangas do beco espancaram você brutalmente por falta de pagamento (-28 Saúde, -5 Honra)! A dívida subiu para ${loan.balance} Ouro.`, "bad");
            } else {
              let seized = false;
              if (loan.collateralUid) {
                const cIdx = STATE.itemInstances.findIndex(x => x.uid === loan.collateralUid);
                if (cIdx !== -1) {
                  const inst = STATE.itemInstances[cIdx];
                  STATE.itemInstances.splice(cIdx, 1);
                  const invIdx = STATE.inventory.indexOf(inst.id);
                  if (invIdx !== -1) STATE.inventory.splice(invIdx, 1);
                  this.addLog(`⚖️ PENHORA EXECUTADA: Oficiais de justiça tomaram sua posse **${inst.id}** para liquidar o calote com ${loan.creditorName}!`, "bad");
                  seized = true;
                }
              }
              STATE.honor = Math.max(0, STATE.honor - 12);
              STATE.reputation = Utils.clamp(STATE.reputation - 2, -10, 10);
              loan.balance = seized ? 0 : Math.round(loan.balance * 0.5);
              loan.yearsLeft = 2;
            }
          }
        }
      });
      STATE.activeLoans = STATE.activeLoans.filter(l => l.balance > 0);
      STATE.debt = STATE.activeLoans.reduce((sum, l) => sum + (l.balance || 0), 0);
    }

    /* 2. Carteira de investimentos bancários concedidos pelo jogador */
    if (Array.isArray(STATE.bankerLoans) && STATE.bankerLoans.length > 0) {
      STATE.bankerLoans.forEach(bLoan => {
        bLoan.yearsLeft--;
        if (bLoan.yearsLeft <= 0) {
          const defaulted = Math.random() < bLoan.defaultRisk;
          if (!defaulted) {
            STATE.gold += bLoan.expectedReturn;
            const profit = bLoan.expectedReturn - bLoan.principal;
            STATE.bankerProfits = (STATE.bankerProfits || 0) + profit;
            SoundFX.play("coin");
            this.addLog(`💰 RENDIMENTO DE BANQUEIRO: **${bLoan.clientName}** quitou pontualmente o empréstimo! Você recebeu +${bLoan.expectedReturn} Ouro (+${profit} de lucro líquido).`, "epoch");
          } else {
            const collatId = bLoan.collateralItemId || "casa_urbana";
            STATE.inventory.push(collatId);
            STATE.itemInstances.push({
              uid: "it_seized_" + Math.random().toString(36).slice(2, 9),
              id: collatId,
              state: "bom",
              kingdom: STATE.kingdom,
              cityId: STATE.currentCityId,
              buyPrice: bLoan.principal,
              mortgaged: false
            });
            SoundFX.play("bells");
            this.addLog(`⚔️ EXECUÇÃO DE CAUÇÃO: **${bLoan.clientName}** deu calote no contrato! Você acionou os meirinhos e tomou posse definitiva de **${collatId}**!`, "good");
          }
        }
      });
      STATE.bankerLoans = STATE.bankerLoans.filter(b => b.yearsLeft > 0);
    }
  },

  checkAchievements() {
    if (!STATE || !DATA.achievements) return;
    const unlocked = Storage.getAchievements();
    const propsCount = Array.isArray(STATE.itemInstances) ? STATE.itemInstances.filter(x => {
      const it = DATA.items.find(i => i.id === x.id);
      return it && it.category === "propriedade";
    }).length : 0;

    DATA.achievements.forEach(ach => {
      if (unlocked.includes(ach.id)) return;
      let ok = false;
      if (ach.id === "ach_primeira_moeda" && STATE.gold >= 50) ok = true;
      else if (ach.id === "ach_mestre_oficio" && (STATE.jobRank || 0) >= 4) ok = true;
      else if (ach.id === "ach_sangue_nobre" && STATE.socialClass === "nobre") ok = true;
      else if (ach.id === "ach_duque_coroa" && (STATE.nobleTitleLevel || 0) >= 5) ok = true;
      else if (ach.id === "ach_fortuna_ouro" && STATE.gold >= 2000) ok = true;
      else if (ach.id === "ach_senhor_castelo" && STATE.inventory.includes("castelo_feudal")) ok = true;
      else if (ach.id === "ach_grande_armador" && STATE.inventory.includes("navio_mercante")) ok = true;
      else if (ach.id === "ach_longevidade_veneravel" && STATE.age >= 70) ok = true;
      else if (ach.id === "ach_honra_imaculada" && STATE.honor >= 90) ok = true;
      else if (ach.id === "ach_infamia_sombria" && (STATE.reputation <= -5 || STATE.honor <= 15)) ok = true;
      else if (ach.id === "ach_devoto_santo" && this.getEffectiveAttr("fe") >= 90) ok = true;
      else if (ach.id === "ach_erudito_astros" && this.getEffectiveAttr("intelecto") >= 90) ok = true;
      else if (ach.id === "ach_campeao_torneio" && (STATE.duelsWon || 0) >= 3) ok = true;
      else if (ach.id === "ach_banqueiro_reinos" && ((STATE.bankerLoans && STATE.bankerLoans.length > 0) || (STATE.bankerProfits || 0) > 0)) ok = true;
      else if (ach.id === "ach_dinastia_cinco" && (STATE.generation || 1) >= 5) ok = true;
      else if (ach.id === "ach_casamento_ouro" && STATE.npcs.some(n => n.role === "Cônjuge" && n.socialClass === "nobre")) ok = true;
      else if (ach.id === "ach_viajante_mundo" && (STATE.visitedKingdoms && STATE.visitedKingdoms.length >= 3)) ok = true;
      else if (ach.id === "ach_soberano_feudo" && propsCount >= 5) ok = true;
      else if (ach.id === "ach_sobrevivente_peste" && STATE.flags.some(f => f.toLowerCase().includes("peste"))) ok = true;
      else if (ach.id === "ach_lenda_cinza_ferro" && unlocked.length >= 10) ok = true;

      if (ok && Storage.unlockAchievement(ach.id)) {
        SoundFX.play("bells");
        const msg = `🏆 CONQUISTA DESBLOQUEADA: **${ach.name}** — ${ach.desc}`;
        this.addLog(msg, "epoch");
        if (window.UI && window.UI.notify) UI.notify("🏆 Conquista Desbloqueada!", `${ach.name}: ${ach.desc}`, "bells");
      }
    });
  },

  computeLegacyTags() {
    if (!STATE || !DATA.legacyTags) return [];
    const pool = [];
    const propsCount = Array.isArray(STATE.itemInstances) ? STATE.itemInstances.filter(x => {
      const it = DATA.items.find(i => i.id === x.id);
      return it && it.category === "propriedade";
    }).length : 0;

    if ((STATE.duelsWon || 0) >= 2 || (STATE.attrs.forca || 0) >= 65) pool.push("sangue_guerreiro");
    if ((STATE.attrs.intelecto || 0) >= 65 || (STATE.bargainsWon || 0) >= 2) pool.push("mente_astuta");
    if ((STATE.attrs.carisma || 0) >= 65 || (STATE.reputation || 0) >= 6) pool.push("graca_cortes");
    if ((STATE.attrs.beleza || 0) >= 70) pool.push("beleza_linhagem");
    if (STATE.age >= 60 || (STATE.attrs.saude || 0) >= 70) pool.push("vigor_ancestral");
    if ((STATE.attrs.destreza || 0) >= 65) pool.push("maos_artifice");
    if ((STATE.attrs.fe || 0) >= 65) pool.push("favor_divino");
    if ((STATE.attrs.sorte || 0) >= 65) pool.push("estrela_sortuda");
    if (STATE.gold >= 500) pool.push("cofre_hereditario");
    if (STATE.reputation >= 5) pool.push("renome_ancestral");
    if (STATE.honor >= 75) pool.push("brasao_respeitado");
    if (STATE.socialClass === "nobre") pool.push("nobreza_sangue");
    if ((STATE.bargainsWon || 0) >= 3 || (STATE.bankerProfits || 0) > 0) pool.push("tradicao_mercantil");
    if (STATE.visitedKingdoms && STATE.visitedKingdoms.length >= 3) pool.push("alma_itinerante");
    if (STATE.npcs.filter(n => n.role === "Filho").length >= 3) pool.push("linhagem_imorredoura");
    if (propsCount >= 3) pool.push("imperio_propriedades");

    const selectedKeys = pool.slice(0, 4);
    return selectedKeys.map(key => ({ id: key, ...DATA.legacyTags[key] }));
  }
});
