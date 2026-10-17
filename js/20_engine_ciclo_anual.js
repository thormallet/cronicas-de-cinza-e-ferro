/* ============================================================================
   [ENGINE · CICLO ANUAL] — avanço de ano e eventos de época
   ============================================================================ */
Object.assign(Engine, {
  advanceYear() {
    if (STATE.activeEvent || STATE.specialTrial) {
      UI.renderEventModal();
      return;
    }
    if (STATE.pendingChild || (STATE.pendingBirthQueue && STATE.pendingBirthQueue.length > 0)) {
      if (!STATE.pendingChild && STATE.pendingBirthQueue.length > 0) {
        STATE.pendingChild = STATE.pendingBirthQueue.shift();
      }
      if (this.ensureLegitimacyUI) this.ensureLegitimacyUI();
      UI.openChildNameModal();
      return;
    }

    SoundFX.play("year");
    this.ensureVigorFields();
    STATE.age++;
    STATE.year++;
    STATE.healthCareUsedThisYear = false;
    const pastYearActs = Object.keys(STATE.activityYearCount || {});
    STATE.activityYearCount = {};

    const seasons = [
      "As geadas derretem nos campos lamacentos",
      "Os ventos de outono varrem as folhas secas pelas estradas",
      "As chuvas de primavera enchem os rios e moinhos",
      "O sol rubro de verão amadurece o centeio e aquece as pedras"
    ];
    this.addLog(`Ano do Senhor de ${STATE.year} — ${Utils.pick(seasons)} de ${this.getKingdom().name}. Você completa ${STATE.age} anos (${this.getPhase()}).`, "year-header");

    const hpRegen = STATE.age <= 15 ? 8 : (STATE.age < 50 ? 5 : 2);
    STATE.hp = Math.min(STATE.maxHp, STATE.hp + hpRegen);
    STATE.maxVigor = STATE.age < 55 ? 100 : Math.max(50, 100 - (STATE.age - 50) * 2);
    STATE.vigor = STATE.maxVigor;
    this.refreshVisibleJobsAndGuilds();
    
    if (this.processPendingFiefOrders) this.processPendingFiefOrders();

    if (STATE.age === 12 && STATE.job === "crianca" && !STATE.guildTraining) {
      this.addLog(`Aos 12 anos, você já tem idade para buscar um aprendizado em uma Guilda ou escolher seu primeiro Ofício na aba "Ofícios e Guildas".`, "epoch");
    }

    if (STATE.age === 16) {
      this.addLog(`🧭 MAIORIDADE E ESTRADAS ABERTAS: Aos 16 anos, você alcançou autonomia plena para viajar entre comarcas e liderar expedições pelo botão **🧭 Viajar**!`, "epoch");
      if (!STATE.npcs.some(n => n.role === "Pretendente" && n.alive)) {
        const oppSex = STATE.sex === "M" ? "F" : "M";
        const firstSuitor = Utils.genNPC("Pretendente", Utils.rand(16, 20), oppSex, null, STATE.socialClass);
        STATE.npcs.push(firstSuitor);
        this.addLog(`Com o florescer da sua juventude, ${firstSuitor.name} (da Casa ${firstSuitor.surname}) passa a enviar-lhe recados e olhares discretos na corte e nas festas.`);
      }
    }

    // Erosão Orgânica da Glória & Fama (A Memória do Povo é Curta)
    const hasNobleRank = STATE.socialClass === "nobre" && (STATE.nobleTitleLevel || 0) >= 1;
    const didRecentFeat = pastYearActs.some(a => ["patrocinar_torneio", "disputar_torneio", "marchar_guerra", "liderar_cerco"].includes(a));
    if (STATE.reputation > 6) {
      if (Math.random() < 0.50) {
        STATE.reputation = Utils.clamp(STATE.reputation - 1, -10, 10);
        this.addLog("A corte é volúvel e esquece com facilidade os antigos favoritos: -1 Reputação.", "bad");
      }
    } else if (STATE.reputation > 2 && !hasNobleRank && !didRecentFeat) {
      if (Math.random() < 0.35) {
        STATE.reputation = Utils.clamp(STATE.reputation - 1, -10, 10);
        this.addLog("O tempo esmaece sua fama entre as praças e tavernas: -1 Reputação.", "bad");
      }
    }

    // Erosão da Alta Honra (A Inércia Moral Cobra seu Preço)
    const didHonorableActs = pastYearActs.some(a => ["fazer_caridade", "doar_dizimo_extraordinario", "patrocinar_torneio", "peregrinacao", "ingressar_ordem", "marchar_guerra", "liderar_cerco"].includes(a));
    if (STATE.honor > 85) {
      if (Math.random() < 0.55) {
        STATE.honor = Utils.clamp(STATE.honor - 2, 0, 100);
        this.addLog("Manter honra lendária exige dedicação ativa constante; a inércia moral cobra seu preço (-2 Honra).", "bad");
      }
    } else if (STATE.honor > 65 && !didHonorableActs) {
      if (Math.random() < 0.35) {
        const hDecay = Utils.rand(1, 2);
        STATE.honor = Utils.clamp(STATE.honor - hDecay, 0, 100);
        this.addLog(`Sem novos atos de cavalheirismo e retidão, o brilho da sua honra arrefece perante os pares (-${hDecay} Honra).`, "bad");
      }
    }

    // Atrofia por Desuso de Atributos Altos (>= 75)
    const highAttrs = ["forca", "destreza", "intelecto", "carisma", "fe"];
    const attrActsMap = {
      forca: ["treinar_armas", "disputar_torneio", "desafiar_duelo", "marchar_guerra", "liderar_cerco", "cacar_lobos", "trabalhar_duro", "duelo_clandestino"],
      destreza: ["treinar_arco", "cacar_floresta", "caca_furtiva", "furtar_bolsas", "jogos_dados_viciados"],
      intelecto: ["ler_livro", "estudar_academia", "conspirar_golpe", "caravana_comercial"],
      carisma: ["socializar_taverna", "festejo_desregrado", "patrocinar_torneio", "banho_perfumado", "cortejar_romance"],
      fe: ["orar_jejuar", "peregrinacao", "fazer_caridade", "penitencia_flagelo", "doar_dizimo_extraordinario", "ingressar_ordem"]
    };
    const attrLabels = { forca: "Força", destreza: "Destreza", intelecto: "Intelecto", carisma: "Carisma", fe: "Fé" };
    highAttrs.forEach(stat => {
      if ((STATE.attrs[stat] || 0) >= 75) {
        const relevantActs = attrActsMap[stat] || [];
        const practiced = pastYearActs.some(a => relevantActs.includes(a));
        if (!practiced && Math.random() < 0.30) {
          STATE.attrs[stat] -= 1;
          this.addLog(`Sem exercícios regulares, seu domínio outrora supremo em ${attrLabels[stat]} sofreu atrofia (-1).`, "bad");
        }
      }
    });

    // Desgaste por Envelhecimento Progressivo e Realista
    if (STATE.age >= 38 && STATE.age < 48) {
      if (Math.random() < 0.25) {
        const pool = ["forca", "destreza", "beleza"].filter(k => (STATE.attrs[k] || 0) > 15);
        if (pool.length > 0) {
          const target = Utils.pick(pool);
          STATE.attrs[target] -= 1;
          const targetName = target === "forca" ? "Força" : (target === "destreza" ? "Destreza" : "Beleza");
          this.addLog(`Com a chegada da meia-idade, o vigor juvenil dá os primeiros sinais de declínio (-1 ${targetName}).`, "bad");
        }
      }
    } else if (STATE.age >= 48 && STATE.age < 60) {
      if (Math.random() < 0.45) {
        const pool = ["forca", "destreza", "beleza"].filter(k => (STATE.attrs[k] || 0) > 15);
        if (pool.length > 0) {
          const target = Utils.pick(pool);
          STATE.attrs[target] -= 1;
          const targetName = target === "forca" ? "Força" : (target === "destreza" ? "Destreza" : "Beleza");
          this.addLog(`O peso dos anos se faz sentir com rigor sobre sua compleição (-1 ${targetName}).`, "bad");
        }
      }
    } else if (STATE.age >= 60 && STATE.age < 72) {
      if (Math.random() < 0.65) {
        const pool = ["forca", "destreza", "saude", "beleza"].filter(k => (STATE.attrs[k] || 0) > 12);
        if (pool.length > 0) {
          const target = Utils.pick(pool);
          const loss = Utils.rand(1, 2);
          const actualLoss = Math.min(loss, (STATE.attrs[target] || 12) - 10);
          if (actualLoss > 0) {
            STATE.attrs[target] -= actualLoss;
            if (target === "saude") {
              STATE.maxHp = Math.max(10, this.getEffectiveAttr("saude"));
              STATE.hp = Math.min(STATE.hp, STATE.maxHp);
            }
            const targetName = target === "forca" ? "Força" : (target === "destreza" ? "Destreza" : (target === "saude" ? "Saúde" : "Beleza"));
            this.addLog(`A velhice cobra seu tributo sobre as juntas e a vitalidade (-${actualLoss} ${targetName}).`, "bad");
          }
        }
      }
    } else if (STATE.age >= 72) {
      if (Math.random() < 0.85) {
        const pool = ["forca", "destreza", "saude", "beleza"].filter(k => (STATE.attrs[k] || 0) > 10);
        if (pool.length > 0) {
          const target = Utils.pick(pool);
          const loss = Utils.rand(2, 3);
          const actualLoss = Math.min(loss, (STATE.attrs[target] || 10) - 10);
          if (actualLoss > 0) {
            STATE.attrs[target] -= actualLoss;
            if (target === "saude") {
              STATE.maxHp = Math.max(10, this.getEffectiveAttr("saude"));
              STATE.hp = Math.min(STATE.hp, STATE.maxHp);
            }
            const targetName = target === "forca" ? "Força" : (target === "destreza" ? "Destreza" : (target === "saude" ? "Saúde" : "Beleza"));
            this.addLog(`A idade avançada debilita inexoravelmente o vigor do corpo (-${actualLoss} ${targetName}).`, "bad");
          }
        }
      }
    }

    // Inverno Rigoroso e Enfermidades Sazonais
    if (Math.random() < 0.20) {
      const hasShelter = STATE.properties && STATE.properties.length > 0 && STATE.socialClass !== "plebeu";
      if (!hasShelter) {
        const frostHp = Utils.rand(4, 8);
        STATE.hp = Math.max(1, STATE.hp - frostHp);
        let frostStr = false;
        if (Math.random() < 0.25 && (STATE.attrs.forca || 0) > 12) {
          STATE.attrs.forca -= 1;
          frostStr = true;
        }
        this.addLog(`O inverno impiedoso castigou seu corpo desprovido de luxos (-${frostHp} Saúde${frostStr ? ", -1 Força" : ""}).`, "bad");
      }
    }

    // Progresso Anual de Guilda ou de Desempenho no Ofício
    if (STATE.guildTraining) {
      this.ensureColleagues();
      STATE.guildTraining.yearsDone = (STATE.guildTraining.yearsDone || 0) + 1;
      STATE.jobPerformance = Utils.clamp((STATE.jobPerformance || 50) - 3, 0, 100);
      if (STATE.guildTraining.yearsDone >= STATE.guildTraining.yearsReq) {
        if (STATE.jobPerformance >= 45) {
          this.completeGuildTraining();
        } else {
          this.addLog(`⚠️ Os mestres de **${STATE.guildTraining.guildName}** julgaram seu desempenho insuficiente (${STATE.jobPerformance}/100, mínimo 45) e retiveram sua aprovação final! Dedique-se às ações de desempenho na aba Ofícios e Guildas.`, "bad");
        }
      } else {
        this.addLog(`🏛️ Treinamento na **${STATE.guildTraining.guildName}** (${this.getGuildHierarchyRank()}): Ano ${STATE.guildTraining.yearsDone}/${STATE.guildTraining.yearsReq} concluído (Desempenho atual: ${STATE.jobPerformance}/100).`);
      }
    } else if (STATE.job !== "crianca") {
      this.ensureColleagues();
      const curJob = this.getJob();
      const curRank = STATE.jobRank || 0;
      const maxRank = (curJob.ranks ? curJob.ranks.length : 1) - 1;
      const { reqPerf, reqAttrDiff, perfDecay } = this.getPromotionRequirements(curRank);

      STATE.jobPerformance = Utils.clamp((STATE.jobPerformance || 50) - perfDecay, 0, 100);

      if (STATE.jobPerformance >= reqPerf && curRank < maxRank) {
        const mainAttr = Object.keys(curJob.req || {})[0] || "intelecto";
        const promoCheck = this.rollCheck(mainAttr, reqAttrDiff);
        if (promoCheck.success) {
          STATE.jobRank = curRank + 1;
          STATE.jobPerformance = Math.max(48, 56 - STATE.jobRank * 2);
          const newRankTitle = this.getJobRankLabel(curJob, STATE.jobRank);
          SoundFX.play("bells");
          this.addLog(`⬆️ PROMOÇÃO HIERÁRQUICA: Superando o rigoroso escrutínio do cargo (Desempenho ≥ ${reqPerf} e prova de mérito), você foi elevado(a) a **${newRankTitle}** em ${curJob.name}!`, "good");
        } else {
          this.addLog(`📋 Escrutínio de Promoção: Seu desempenho (${STATE.jobPerformance}/100) qualificou você à vaga de **${this.getJobRankLabel(curJob, curRank + 1)}**, mas os veteranos exigem maior domínio prático (${mainAttr.toUpperCase()} / Sorte) para conceder o cargo superior.`);
        }
      } else if (STATE.jobPerformance <= 25 && curRank > 0) {
        STATE.jobRank = curRank - 1;
        STATE.jobPerformance = 45;
        const demotedTitle = this.getJobRankLabel(curJob, STATE.jobRank);
        SoundFX.play("fail");
        this.addLog(`⬇️ REGRESSÃO DE CARGO: Seu baixo rendimento levou os mestres a rebaixarem você para o cargo de **${demotedTitle}** em ${curJob.name}!`, "bad");
      }

      if (curJob.transitionTo && curJob.transitionTo !== STATE.socialClass && (STATE.jobRank || 0) >= maxRank && STATE.jobPerformance >= 90) {
        const prevClass = STATE.socialClass;
        SoundFX.play("bells");
        this.setFamilySocialClass(
          curJob.transitionTo,
          `Alcançando o ápice da hierarquia (${this.getJobRankLabel(curJob, STATE.jobRank)}) com desempenho lendário (${STATE.jobPerformance}/100) em ${curJob.name}, você elevou a Casa ${STATE.surname} de ${this.getClassLabel(prevClass)} para ${this.getClassLabel(curJob.transitionTo)}!`
        );
      } else if (STATE.jobPerformance <= 10 && (STATE.jobRank || 0) === 0) {
        const lostJobName = curJob.name;
        STATE.job = "crianca";
        STATE.jobRank = 0;
        this.addLog(`⚠️ EXPULSÃO DO OFÍCIO: Devido ao seu péssimo desempenho no cargo inicial (${STATE.jobPerformance}/100), você foi destituído de ${lostJobName}!`, "bad");

        if (STATE.socialClass !== "plebeu" && STATE.honor < 30 && STATE.debt > 100) {
          const lowerClass = STATE.socialClass === "nobre" ? "media" : "plebeu";
          this.setFamilySocialClass(lowerClass, `A ruína financeira, a perda do ofício e a desonra arrastaram sua família para a decadência social!`);
        }
      }
    }

    if (STATE.age >= 12) {
      const fin = this.calcAnnualFinances();
      STATE.gold += fin.net;
      if (STATE.debt > 0) STATE.debt += fin.debtInterest;
      const sign = fin.net >= 0 ? "+" : "";
      this.addLog(`Balanço Anual (${this.getOccupationLabel()}): Bruto ${fin.gross}, Custos/Impostos ${fin.upkeep + fin.taxes} => ${sign}${fin.net} Ouro.`);
      if (STATE.gold < 0) {
        STATE.debt += Math.abs(STATE.gold) + 5;
        STATE.gold = 0;
        STATE.hp -= 8;
        this.addLog("Endividado e sem moedas para o sustento, você passou privações.", "bad");
      }

      if (STATE.debt > 0) {
        if (STATE.debt > 40 || STATE.gold <= 0) {
          STATE.reputation = Utils.clamp(STATE.reputation - 1, -10, 10);
          STATE.honor = Utils.clamp(STATE.honor - 4, 0, 100);
          this.addLog("Cobradores e usurários denunciam seus calotes na praça da comarca (-1 Reputação, -4 Honra).", "bad");
        } else if (Math.random() < 0.35) {
          STATE.honor = Utils.clamp(STATE.honor - 2, 0, 100);
          this.addLog("A má fama de devedor corrói sua palavra de honra (-2 Honra).", "bad");
        }
      }

      if (STATE.debt > 60 && STATE.gold <= 0 && Math.random() < 0.35) {
        const attrLoss = Math.random() < 0.5 ? "saude" : "carisma";
        if ((STATE.attrs[attrLoss] || 15) > 10) {
          STATE.attrs[attrLoss] -= 1;
          if (attrLoss === "saude") {
            STATE.maxHp = Math.max(10, this.getEffectiveAttr("saude"));
            STATE.hp = Math.min(STATE.hp, STATE.maxHp);
          }
          const attrLabel = attrLoss === "saude" ? "Saúde" : "Carisma";
          this.addLog(`A penúria das dívidas sufocantes, o assédio dos cobradores e a humilhação degradaram seu estado (-1 ${attrLabel}).`, "bad");
        }
      }
    }

    if (STATE.age >= 20 && STATE.socialClass !== "nobre" && !this.hasActiveOccupation() && (!STATE.properties || STATE.properties.length === 0)) {
      if (Math.random() < 0.35) {
        STATE.reputation = Utils.clamp(STATE.reputation - 1, -10, 10);
        this.addLog("Viver como ocioso sem ofício ou terras mancha sua imagem perante a comunidade (-1 Reputação).", "bad");
      }
    }

    STATE.flags = STATE.flags || [];
    if (STATE.flags.includes("trapaceiro") && Math.random() < 0.35) {
      STATE.reputation = Utils.clamp(STATE.reputation - 1, -10, 10);
      this.addLog("Os rumores de suas trapaças passadas continuam a persegui-lo (-1 Reputação).", "bad");
    }

    if (this.processAnnualLoans) this.processAnnualLoans();
    if (this.degradeItemsAnnually) this.degradeItemsAnnually();
    if (this.recalculateSocialClassByWealth) this.recalculateSocialClassByWealth();
    if (this.checkAchievements) this.checkAchievements();

    if ((Array.isArray(STATE.pregnancies) && STATE.pregnancies.length > 0) || STATE.pregnancy) {
      this.resolveChildbirth();
    }

    // Gestações espontâneas anuais (Cônjuge e Amantes ativas)
    const spouse = STATE.npcs.find(n => n.role === "Cônjuge" && n.alive);
    if (spouse && Math.random() < 0.08) {
      const pregSpouse = this.tryConceiveWithPartner(spouse, false);
      if (pregSpouse) {
        const msgSpont = `Na convivência doce do matrimônio com ${spouse.name}, uma bênção inesperada floresceu: ${STATE.sex === "F" ? "você descobriu estar grávida" : `${spouse.name} anunciou estar esperando um filho seu`}! O parto é aguardado para o próximo ano.`;
        this.addLog(`🤰 GRAVIDEZ ESPONTÂNEA: ${msgSpont}`, "epoch");
        UI.notify("🤰 Gravidez Espontânea no Lar!", msgSpont, "bells");
      }
    }

    const lovers = STATE.npcs.filter(n => (n.role === "Amor" || n.role === "Amante") && n.alive && n.affinity >= 25);
    lovers.forEach(lover => {
      if (Math.random() < 0.06) {
        const pregLover = this.tryConceiveWithPartner(lover, true);
        if (pregLover) {
          const lMsg = STATE.sex === "F"
            ? `Um romance ardente com ${lover.name} deixou frutos: você percebe os sinais inequívocos de uma gravidez fora dos votos sagrados!`
            : `Um mensageiro discreto traz notícias de ${lover.name}: ela está esperando um filho do seu romance secreto!`;
          this.addLog(`🔥🤰 GRAVIDEZ SECRETA: ${lMsg}`, "epoch");
          UI.notify("🔥 Sinais de Gestação Secreta", lMsg, "bells");
        }
      }
    });

    this.updateNPCs();

    if (STATE.socialClass === "nobre" && (STATE.nobleTitleLevel || 0) >= 1 && STATE.fief) {
      if ((STATE.fief.peasantry < 25 || STATE.fief.loyalty < 25) && Math.random() < 0.45) {
        const loss = Math.min(STATE.gold, 22);
        STATE.gold -= loss;
        STATE.honor = Utils.clamp(STATE.honor - 4, 0, 100);
        STATE.fief.prosperity = Utils.clamp(STATE.fief.prosperity - 6, 0, 100);
        this.addLog(`🔥 MOTIM NO DOMÍNIO: A revolta dos camponeses e vassalos descontentes incendiou celeiros do seu feudo (-${loss} Ouro, -4 Honra, -6 Prosperidade)!`, "bad");
      }
    }

    if (STATE.socialClass === "nobre" && STATE.age >= 18) {
      this.checkNobleTitleConferral();
    }

    if (Math.random() < 0.18) {
      this.triggerEpochEvent();
    }

    if (STATE.alive === false || STATE.isDead || this.checkMortality()) return;

    if (!STATE.pendingChild) {
      this.triggerYearlyEvent();
    }

    Storage.saveToSlot(CONFIG.activeSlot);
    UI.renderAll();
  },

  triggerEpochEvent() {
    const ep = Utils.pick(DATA.epochEvents);
    const curCity = this.getCityObj ? this.getCityObj(STATE.currentCityId, STATE.kingdom) : { name: "", tier: "vila" };
    this.addLog(`[EVENTO DE ÉPOCA EM ${curCity.name.toUpperCase()}: ${ep.name}] ${ep.desc}`, "epoch");
    const isChild = STATE.age < 12;

    if (ep.effect === "plague") {
      const inUrban = curCity.tier === "cidade" || curCity.tier === "capital";
      const diff = isChild ? 40 : (inUrban ? 64 : 46);
      const dmg = isChild ? 6 : (inUrban ? 22 : 11);
      const res = this.rollCheck("saude", diff);
      if (!res.success) {
        STATE.hp -= dmg;
        this.addLog(`O miasma da praga (${inUrban ? "agravado pelas ruas apinhadas da cidade" : "nas terras da vila"}) debilitou sua saúde (-${dmg} Saúde)!`, "bad");
      } else {
        this.addLog(`Sua constituição resistiu ao contágio da pestilência em ${curCity.name}.`, "good");
      }
    } else if (ep.effect === "famine") {
      const grainCost = curCity.tier === "vila" ? 10 : 16;
      if (STATE.gold >= grainCost) {
        STATE.gold -= grainCost;
        this.addLog(`Você pagou caro por grãos estocados em ${curCity.name} (-${grainCost} Ouro).`);
      } else {
        STATE.hp -= isChild ? 4 : 14;
        this.addLog("A fome corroeu seu estômago durante o inverno.", "bad");
      }
    } else if (ep.effect === "harvest") {
      const bonus = curCity.tier === "vila" ? 22 : 14;
      STATE.gold += bonus;
      STATE.hp = Math.min(STATE.maxHp, STATE.hp + 10);
      if (STATE.fief) STATE.fief.prosperity = Utils.clamp(STATE.fief.prosperity + 6, 0, 100);
      this.addLog(`A fartura da colheita rendeu +${bonus} Ouro e revigorou sua saúde!`, "good");
    } else if (ep.effect === "war") {
      if (["soldado","mercenario","cavaleiro"].includes(STATE.job)) {
        const wCheck = this.rollCheck("forca", 56);
        if (wCheck.success) {
          STATE.gold += 30;
          STATE.honor = Utils.clamp(STATE.honor + 6, 0, 100);
          this.addLog("Convocado às fronteiras em guerra, você destacou-se em combate (+30 Ouro, +6 Honra)!", "good");
        } else {
          STATE.hp -= 14;
          this.addLog("Você foi ferido nas escaramuças sangrentas da fronteira (-14 Saúde).", "bad");
        }
      }
      if (STATE.socialClass === "nobre" && (STATE.nobleTitleLevel || 0) >= 1 && STATE.fief) {
        if (STATE.fief.defense >= 65) {
          STATE.gold += 25;
          STATE.honor = Utils.clamp(STATE.honor + 5, 0, 100);
          this.addLog("🛡️ Suas guarnições bem defendidas repeliram invasores nas fronteiras do feudo (+25 Ouro em presas, +5 Honra)!", "good");
        } else if (STATE.fief.defense < 35) {
          const loss = Math.min(STATE.gold, 25);
          STATE.gold -= loss;
          STATE.fief.prosperity = Utils.clamp(STATE.fief.prosperity - 8, 0, 100);
          this.addLog(`🔥 Com a defesa frágil (${STATE.fief.defense}/100), incursores saquearam seu domínio (-${loss} Ouro, -8 Prosperidade)!`, "bad");
        }
      }
    } else if (ep.effect === "crusade" && !isChild) {
      const cCheck = this.rollCheck("fe", 55);
      if (cCheck.success) {
        STATE.gold += 28;
        STATE.honor = Utils.clamp(STATE.honor + 8, 0, 100);
        STATE.reputation = Utils.clamp(STATE.reputation + 1, -10, 10);
        this.addLog("⛪ Seu fervor e contribuição na mobilização sagrada elevaram seu nome (+28 Ouro, +8 Honra, +1 Rep)!", "good");
      } else {
        STATE.gold = Math.max(0, STATE.gold - 10);
        this.addLog("As exigências de tributos de guerra santa pesaram sobre sua bolsa (-10 Ouro).");
      }
    } else if (ep.effect === "tournament" && !isChild) {
      if (curCity.tier === "capital" || STATE.socialClass === "nobre" || ["cavaleiro","escudeiro","soldado","mercenario","bardo"].includes(STATE.job)) {
        const tCheck = this.rollCheck("destreza", 56);
        if (tCheck.success) {
          STATE.gold += 35;
          STATE.honor = Utils.clamp(STATE.honor + 6, 0, 100);
          STATE.reputation = Utils.clamp(STATE.reputation + 1, -10, 10);
          this.addLog(`🏇 No Grande Torneio Real, sua atuação conquistou prêmios e aplausos (+35 Ouro, +6 Honra, +1 Rep)!`, "good");
        } else {
          this.addLog("Você assistiu às justas e celebrações do Grande Torneio Real.");
        }
      }
    }
  }
});
