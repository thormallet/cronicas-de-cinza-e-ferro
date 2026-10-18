/* ============================================================================
   [RELAÇÕES · INTERAÇÃO COM NPC] — ações sociais com personagens (interactNPC)
   ============================================================================ */
Object.assign(Engine, {
  interactNPC(npcId, action) {
    this.ensureVigorFields();
    const npc = STATE.npcs.find(n => n.id === npcId);
    if (!npc || !npc.alive) return;

    const requireVigor = (cost) => {
      if (STATE.vigor < cost) {
        UI.notify("Vigor Insuficiente", `Esta interação exige ${cost} de Vigor (Vigor atual: ${STATE.vigor}/${STATE.maxVigor}). Repouse ou avance o ano.`);
        return false;
      }
      STATE.vigor -= cost;
      return true;
    };

    const spouse = STATE.npcs.find(n => n.role === "Cônjuge" && n.alive);

    switch (action) {
      case "play_childhood": {
        if (!requireVigor(3)) return;
        npc.affinity = Utils.clamp(npc.affinity + 15, -100, 100);
        STATE.attrs.destreza = Math.min(100, STATE.attrs.destreza + 3);
        npc.memory = `Brincou de correr e construir fortes com você na infância (${STATE.year}).`;
        SoundFX.play("success");
        this.addLog(`🎠 Você passou a tarde brincando e correndo com ${npc.name} (-3 Vigor), criando memórias puras de infância (+15 Afinidade, +Destreza).`, "good");
        break;
      }

      case "ask_blessing": {
        if (!requireVigor(2)) return;
        npc.affinity = Utils.clamp(npc.affinity + 14, -100, 100);
        STATE.honor = Utils.clamp(STATE.honor + 4, 0, 100);
        if (STATE.age < 18 && Math.random() < 0.5) {
          STATE.gold += 5;
          this.addLog(`🙏 Você pediu a bênção e conselhos a ${npc.name} (-2 Vigor), que lhe entregou 5 moedas de prata e elogiou seu respeito filial (+4 Honra).`, "good");
        } else {
          this.addLog(`🙏 Você inclinou a cabeça pedindo a bênção de ${npc.name} (-2 Vigor), fortalecendo a união da família (+4 Honra).`, "good");
        }
        SoundFX.play("bells");
        break;
      }

      case "talk": {
        if (!requireVigor(3)) return;
        const check = this.rollCheck("carisma", 42);
        if (check.success) {
          npc.affinity = Utils.clamp(npc.affinity + 12, -100, 100);
          npc.memory = `Teve uma conversa franca e agradável com você no ano ${STATE.year}.`;
          SoundFX.play("success");
          this.addLog(`💬 Você conversou longamente com ${npc.name} (-3 Vigor), estreitando a confiança mútua.`, "good");
        } else {
          npc.affinity = Utils.clamp(npc.affinity - 6, -100, 100);
          SoundFX.play("fail");
          this.addLog(`💬 Uma palavra mal colocada durante a conversa com ${npc.name} (-3 Vigor) gerou atrito e desconfiança.`);
        }
        break;
      }

      case "befriend": {
        if (!requireVigor(4)) return;
        const pRank = this.getClassRankValue(STATE.socialClass);
        const nRank = this.getClassRankValue(npc.socialClass || "plebeu");
        const classGap = Math.abs(nRank - pRank);
        const friendDiff = 46 + (classGap * 18);
        const check = this.rollCheck("carisma", friendDiff);
        if (check.success) {
          npc.affinity = Utils.clamp(npc.affinity + 18, -100, 100);
          if (["Conhecido", "Colega de Ofício", "Pretendente"].includes(npc.role) && npc.affinity >= 45) {
            npc.role = "Amigo";
          }
          STATE.reputation = Utils.clamp(STATE.reputation + 1, -10, 10);
          npc.memory = `Jurou camaradagem e lealdade fraterna a você no ano ${STATE.year}.`;
          SoundFX.play("success");
          this.addLog(`🤝 Superando quaisquer barreiras sociais (-4 Vigor), você firmou um pacto de amizade sincera com ${npc.name} (+1 Reputação)!`, "good");
        } else {
          npc.affinity = Utils.clamp(npc.affinity - 6, -100, 100);
          SoundFX.play("fail");
          const gapMsg = classGap > 0
            ? `Devido à distância entre seus estamentos (${this.getClassLabel(STATE.socialClass)} vs ${this.getClassLabel(npc.socialClass)}), ${npc.name} tratou sua aproximação com frieza.`
            : `${npc.name} manteve distância cautelosa diante da sua tentativa de aproximação.`;
          this.addLog(`🤝 ${gapMsg}`);
        }
        break;
      }

      case "gift": {
        if (STATE.gold < 15) {
          UI.notify("Ouro Insuficiente", "Oferecer um presente digno custa 15 moedas de ouro.");
          return;
        }
        STATE.gold -= 15;
        npc.affinity = Utils.clamp(npc.affinity + 22, -100, 100);
        npc.memory = `Recebeu uma joia e tecidos finos de presente seu no ano ${STATE.year}.`;
        SoundFX.play("coin");
        this.addLog(`🎁 Você presenteou ${npc.name} com generosidade (-15 Ouro), encantando seu coração.`, "good");
        break;
      }

      case "work_together": {
        if (!requireVigor(6)) return;
        const check = this.rollCheck("intelecto", 50);
        if (check.success) {
          const profit = STATE.guildTraining ? Utils.rand(5, 12) : Utils.rand(16, 36);
          STATE.gold += profit;
          STATE.jobPerformance = Utils.clamp((STATE.jobPerformance || 50) + 8, 0, 100);
          npc.affinity = Utils.clamp(npc.affinity + 12, -100, 100);
          npc.memory = `Realizou um trabalho conjunto produtivo ao seu lado em ${STATE.year}.`;
          SoundFX.play("coin");
          this.addLog(`⚒️ Você e seu colega ${npc.name} cooperaram na lida (-6 Vigor, +8 Desempenho, +${profit} Ouro)!`, "good");
        } else {
          STATE.jobPerformance = Utils.clamp((STATE.jobPerformance || 50) - 4, 0, 100);
          npc.affinity = Utils.clamp(npc.affinity - 8, -100, 100);
          SoundFX.play("fail");
          this.addLog(`⚒️ O serviço conjunto com ${npc.name} (-6 Vigor) deu errado e prejudicou sua avaliação (-4 Desempenho).`, "bad");
        }
        break;
      }

      case "sabotage_colleague": {
        if (!requireVigor(5)) return;
        const check = this.rollCheck("destreza", 58);
        if (check.success) {
          const stolen = Utils.rand(20, 45);
          STATE.gold += stolen;
          STATE.reputation = Utils.clamp(STATE.reputation + 1, -10, 10);
          STATE.honor = Utils.clamp(STATE.honor - 8, 0, 100);
          npc.affinity = Utils.clamp(npc.affinity - 40, -100, 100);
          npc.memory = `Suspeita que você puxou o tapete dele no ofício em ${STATE.year}.`;
          SoundFX.play("coin");
          this.addLog(`🐍 Nas sombras da corporação (-5 Vigor), você desviou os clientes e ferramentas de ${npc.name}, lucrando +${stolen} Ouro (-8 Honra)!`, "good");
        } else {
          npc.role = "Rival";
          npc.affinity = -85;
          STATE.reputation = Utils.clamp(STATE.reputation - 2, -10, 10);
          STATE.honor = Utils.clamp(STATE.honor - 12, 0, 100);
          SoundFX.play("fail");
          this.addLog(`🐍 ${npc.name} flagrou sua sabotagem no ofício (-5 Vigor)! O escândalo manchou seu nome (-2 Rep, -12 Honra) e criou um inimigo mortal!`, "bad");
        }
        break;
      }

      case "court": {
        if (STATE.age < 14) {
          UI.notify("Muito Jovem", "Aguarde amadurecer para galantear e cortejar.");
          return;
        }
        if (!requireVigor(4)) return;
        const beautyBonus = Math.floor((this.getEffectiveAttr("beleza") - 40) * 0.25);
        const check = this.rollCheck("carisma", Math.max(25, 48 - beautyBonus));
        if (check.success) {
          const instBonus = this.getBestInstrumentBonus ? this.getBestInstrumentBonus() : { affinityBonus: 0 };
          const estateBonus = (this.hasAnyActiveItem && this.hasAnyActiveItem(["solar_nobre", "castelo_feudal", "palacio_real"])) ? 8 : 0;
          const gain = 18 + Math.max(0, Math.floor(this.getEffectiveAttr("beleza") / 12)) + (instBonus.affinityBonus || 0) + estateBonus;
          npc.affinity = Utils.clamp(npc.affinity + gain, -100, 100);
          if (npc.role === "Amigo" || npc.role === "Conhecido") npc.role = "Pretendente";
          npc.memory = `Suspirou com sua beleza, seus versos e galanteios apaixonados em ${STATE.year}.`;
          SoundFX.play("love");
          this.addLog(`🌹 Seus galanteios e porte (-4 Vigor) encantaram ${npc.name} (Casa ${npc.surname}) (+${gain} Afinidade)!`, "good");

          if (spouse && spouse.id !== npc.id && Math.random() < 0.45) {
            spouse.affinity = Utils.clamp(spouse.affinity - 25, -100, 100);
            spouse.memory = `Ouviu murmúrios sobre seus galanteios a ${npc.name} em ${STATE.year}.`;
            this.addLog(`⚠️ Consequência Conjugal: Os boatos do seu galanteio chegaram aos ouvidos de **${spouse.name}**, despertando ciúmes amargos!`, "bad");
          }
        } else {
          npc.affinity = Utils.clamp(npc.affinity - 8, -100, 100);
          SoundFX.play("fail");
          this.addLog(`🌹 Seu galanteio a ${npc.name} (-4 Vigor) pareceu forçado e causou constrangimento.`, "bad");
        }
        break;
      }

      case "seduce": {
        if (STATE.age < 16) {
          UI.notify("Muito Jovem", "Você ainda não tem idade para jogos de sedução furtiva.");
          return;
        }
        if (!requireVigor(6)) return;
        const beautyBonus = Math.floor((this.getEffectiveAttr("beleza") - 40) * 0.30);
        const check = this.rollCheck("carisma", Math.max(30, 58 - beautyBonus));
        if (check.success) {
          SoundFX.play("love");
          const instBonus = this.getBestInstrumentBonus ? this.getBestInstrumentBonus() : { affinityBonus: 0 };
          const estateBonus = (this.hasAnyActiveItem && this.hasAnyActiveItem(["solar_nobre", "castelo_feudal", "palacio_real"])) ? 8 : 0;
          const gain = 25 + (instBonus.affinityBonus || 0) + estateBonus;
          npc.affinity = Utils.clamp(npc.affinity + gain, -100, 100);
          if (!["Cônjuge", "Colega de Ofício"].includes(npc.role)) npc.role = "Amor";
          npc.memory = `Entregou-se a uma paixão secreta nos seus braços no ano ${STATE.year}.`;
          this.addLog(`🔥 Sedução Furtiva: Entre sussurros à meia-luz (-6 Vigor), sua beleza e lábia seduziram **${npc.name}** e compartilharam o leito em segredo (+${gain} Afinidade)!`, "good");
          if (this.checkAchievements) this.checkAchievements();

          if (this.isEcclesiasticalOccupation() && Math.random() < 0.65) {
            this.handleEcclesiasticalScandal(npc.name);
          }

          if (Math.random() < 0.14) {
            const preg = this.tryConceiveWithPartner(npc, npc.role !== "Cônjuge");
            if (preg) {
              this.addLog(`🤰 Sinais de Gestação: Poucas semanas após o encontro ardente, confirma-se que um filho com **${npc.name}** está sendo gerado! O parto ocorrerá no próximo ano.`, "epoch");
            }
          }

          if (spouse && spouse.id !== npc.id && Math.random() < 0.55) {
            spouse.affinity = Utils.clamp(spouse.affinity - 50, -100, 100);
            STATE.honor = Utils.clamp(STATE.honor - 10, 0, 100);
            STATE.reputation = Utils.clamp(STATE.reputation - 1, -10, 10);
            this.addLog(`💔 Escândalo de Adultério: **${spouse.name}** descobriu sua traição com ${npc.name}! Sua honra foi manchada (-10 Honra) e a paz do seu lar ruiu.`, "bad");
          }
        } else {
          npc.affinity = Utils.clamp(npc.affinity - 18, -100, 100);
          STATE.honor = Utils.clamp(STATE.honor - 5, 0, 100);
          SoundFX.play("fail");
          this.addLog(`🔥 **${npc.name}** repeliu suas investidas (-6 Vigor) com indignação e espalhou sua falta de decoro (-5 Honra)!`, "bad");
          if (this.isEcclesiasticalOccupation() && Math.random() < 0.75) {
            this.handleEcclesiasticalScandal(npc.name);
          }
        }
        break;
      }

      case "propose": {
        if (this.isEcclesiasticalOccupation()) {
          UI.notify("Voto Sagrado de Castidade", `Como membro do clero (${this.getOccupationLabel()}), você está sob voto perpétuo de celibato e impedido de contrair matrimônio!`);
          return;
        }
        if (STATE.age < 16) {
          UI.notify("Idade Mínima", "As leis do reino exigem 16 anos completos para celebrar o matrimônio.");
          return;
        }
        if (npc.sex === STATE.sex) {
          UI.notify("Impedimento Canônico", "As leis eclesiásticas e feudais do reino permitem o matrimônio apenas entre um homem e uma mulher.");
          return;
        }
        if (npc.maritalStatus === "Casado(a)") {
          UI.notify("Impedimento de Vínculo", `${npc.name} já possui vínculo matrimonial vigente.`);
          return;
        }
        if (spouse) {
          UI.notify("Laço Sagrado Existente", `Você já está casado(a) com ${spouse.name} perante a Igreja.`);
          return;
        }

        const pRank = this.getClassRankValue(STATE.socialClass);
        const nRank = this.getClassRankValue(npc.socialClass || "plebeu");
        const classDiff = nRank - pRank;

        let reqAff = 55 - Math.floor((this.getEffectiveAttr("beleza") - 50) * 0.2);
        if (classDiff === 1) reqAff += 25;
        else if (classDiff >= 2) reqAff += 40;

        if (npc.affinity < reqAff) {
          UI.notify(
            "Barreira de Estamento & Afeição",
            `${npc.name} pertence a um estamento superior (${this.getClassLabel(npc.socialClass)}) e exige ao menos ${reqAff} de afinidade (atual: ${npc.affinity}) para aceitar descer ao seu estamento pelo casamento!`
          );
          return;
        }

        if (!requireVigor(5)) return;

        if (classDiff > 0) {
          const checkDiff = 55 + classDiff * 18;
          const socialCheck = this.rollCheck("carisma", checkDiff);
          if (!socialCheck.success) {
            npc.affinity = Utils.clamp(npc.affinity - 12, -100, 100);
            SoundFX.play("fail");
            const rejectMsg = `Temendo perder seus privilégios de ${this.getClassLabel(npc.socialClass)} e ser rebaixado(a) ao estamento de ${this.getClassLabel(STATE.socialClass)}, **${npc.name}** recusou seu pedido de casamento!`;
            this.addLog(`💔 Pedido Recusado por Estamento: ${rejectMsg}`, "bad");
            UI.notify("Recusa por Diferença de Classe", rejectMsg, "fail");
            UI.renderAll();
            return;
          }
        }

        const dowry = npc.socialClass === "nobre" ? Utils.rand(90, 200) : (npc.socialClass === "media" ? Utils.rand(35, 80) : Utils.rand(12, 30));
        npc.role = "Cônjuge";
        npc.maritalStatus = "Casado(a) com Você";
        npc.affinity = Utils.clamp(npc.affinity + 25, -100, 100);
        npc.memory = `Uniu-se a você em sagrado matrimônio no ano ${STATE.year}.`;
        STATE.gold += dowry;
        STATE.honor = Utils.clamp(STATE.honor + 6, 0, 100);

        const rankMap = { 1: "plebeu", 2: "media", 3: "nobre" };
        const lowestRank = Math.min(pRank, nRank);
        const equalizedClass = rankMap[lowestRank];
        let classNote = "";

        if (pRank !== nRank) {
          const oldPlayerClass = STATE.socialClass;
          const oldNpcClass = npc.socialClass;
          npc.socialClass = equalizedClass;
          this.setFamilySocialClass(
            equalizedClass,
            `Pela lei feudal do matrimônio desigual entre ${this.getClassLabel(oldPlayerClass)} e ${this.getClassLabel(oldNpcClass)}, o casal foi equalizado pelo estamento mais baixo (${this.getClassLabel(equalizedClass)}).`
          );
          classNote = ` Pela lei estamental, a união foi nivelada como **${this.getClassLabel(equalizedClass)}**.`;
        } else {
          npc.socialClass = STATE.socialClass;
        }
        this.syncFamilyNobleTitles();
        if (npc.nobleTitle) {
          classNote += ` Seu cônjuge passa a ostentar a dignidade de **${npc.nobleTitle}**!`;
        }

        STATE.npcs.filter(n => n.alive && n.id !== npc.id && (n.role === "Pretendente" || n.role === "Amor") && n.affinity >= 50).forEach(ex => {
          ex.affinity = -45;
          ex.role = "Rival";
          ex.memory = `Sentiu-se traído(a) e humilhado(a) quando você se casou com ${npc.name}.`;
          this.addLog(`💔 Ciúme Amargo: Preterido(a) no altar, **${ex.name}** jurou rancor contra seu matrimônio!`, "bad");
        });

        SoundFX.play("bells");
        if (window.UI && window.UI.triggerStageFX) window.UI.triggerStageFX("💍");
        this.addLog(`💍 MATRIMÔNIO CELEBRADO: Os sinos dobraram pela sua união com **${npc.name}** (Casa ${npc.surname})! Dote integrado à arca: +${dowry} Ouro.${classNote}`, "epoch");
        if (this.checkAchievements) this.checkAchievements();
        break;
      }

      case "make_love": {
        if (!["Cônjuge", "Amor"].includes(npc.role) && npc.affinity < 75) {
          UI.notify("Recato Exigido", "Apenas seu cônjuge, amante ou alguém profundamente apaixonado aceita compartilhar o leito.");
          return;
        }
        if (!requireVigor(5)) return;
        SoundFX.play("love");
        npc.affinity = Utils.clamp(npc.affinity + 15, -100, 100);
        npc.memory = `Compartilhou noites ardentes de paixão com você em ${STATE.year}.`;

        if (this.isEcclesiasticalOccupation() && npc.role !== "Cônjuge" && Math.random() < 0.60) {
          this.handleEcclesiasticalScandal(npc.name);
        }

        const fertilityChance = (STATE.age < 40 && npc.age < 40) ? 0.25 : 0.10;
        let preg = null;
        if (Math.random() < fertilityChance) {
          preg = this.tryConceiveWithPartner(npc, npc.role !== "Cônjuge");
        }

        if (preg) {
          SoundFX.play("bells");
          this.addLog(`🤰 GRAVIDEZ CONFIRMADA: Após noites de paixão com **${npc.name}** (-5 Vigor), a semente da sua linhagem floresceu! A gestação seguirá durante este ano e o parto ocorrerá no ano seguinte.`, "epoch");
        } else {
          this.addLog(`❤️‍🔥 Você e **${npc.name}** entregaram-se ao calor do leito nos aposentos (-5 Vigor), renovando o laço de paixão.`, "good");
        }
        break;
      }

      case "train_child": {
        if (npc.role !== "Filho" && npc.role !== "Filha") return;
        if (!requireVigor(5)) return;
        npc.affinity = Utils.clamp(npc.affinity + 12, -100, 100);
        npc.attrs.forca = Math.min(100, npc.attrs.forca + 7);
        npc.attrs.intelecto = Math.min(100, npc.attrs.intelecto + 7);
        npc.attrs.carisma = Math.min(100, npc.attrs.carisma + 7);
        npc.memory = `Recebeu seus ensinamentos diretos sobre honra, letras e armas em ${STATE.year}.`;
        SoundFX.play("success");
        this.addLog(`🎓 Você dedicou horas instruindo pessoalmente seu(sua) filho(a) **${npc.name}** (-5 Vigor), preparando-o(a) para herdar o brasão da família!`, "good");
        break;
      }

      case "pass_wisdom": {
        if (npc.role !== "Filho" && npc.role !== "Filha") return;
        if (!requireVigor(4)) return;
        npc.affinity = Utils.clamp(npc.affinity + 15, -100, 100);
        npc.attrs.intelecto = Math.min(100, npc.attrs.intelecto + 9);
        npc.attrs.sorte = Math.min(100, npc.attrs.sorte + 6);
        STATE.honor = Utils.clamp(STATE.honor + 4, 0, 100);
        npc.memory = `Ouviu com reverência seus conselhos de ancião no ano ${STATE.year}.`;
        SoundFX.play("bells");
        this.addLog(`🕯️ Com a autoridade dos seus cabelos brancos (-4 Vigor), você transmitiu segredos da vida e da Casa a **${npc.name}** (+4 Honra)!`, "good");
        break;
      }

      case "study_mentor": {
        if (!requireVigor(5)) return;
        const check = this.rollCheck("intelecto", 48);
        if (check.success) {
          STATE.attrs.intelecto = Math.min(100, STATE.attrs.intelecto + 6);
          npc.affinity = Utils.clamp(npc.affinity + 10, -100, 100);
          SoundFX.play("success");
          this.addLog(`📚 Os ensinamentos de **${npc.name}** (-5 Vigor) expandiram seu Intelecto!`, "good");
        } else {
          SoundFX.play("click");
          this.addLog(`📚 Você debateu longamente com **${npc.name}** (-5 Vigor), absorvendo novas perspectivas.`);
        }
        break;
      }

      case "make_peace": {
        if (STATE.gold < 15) {
          UI.notify("Ouro Insuficiente", "Enviar vinho e compensação para selar a paz com um rival custa 15 moedas de ouro.");
          return;
        }
        STATE.gold -= 15;
        const check = this.rollCheck("carisma", 54);
        if (check.success) {
          npc.affinity = 20;
          npc.role = "Conhecido";
          npc.memory = `Selou a paz com você mediante um brinde honroso em ${STATE.year}.`;
          STATE.honor = Utils.clamp(STATE.honor + 5, 0, 100);
          SoundFX.play("bells");
          this.addLog(`🕊️ Você enviou compensação (-15 Ouro) e estendeu a mão a **${npc.name}**, encerrando a antiga inimizade (+5 Honra)!`, "good");
        } else {
          SoundFX.play("fail");
          this.addLog(`🕊️ **${npc.name}** aceitou suas moedas (-15 Ouro), mas cuspiu no chão jurando que o rancor permanece.`);
        }
        break;
      }

      case "confront": {
        if (!requireVigor(6)) return;
        SoundFX.play("sword");
        const check = this.rollCheck("forca", 58);
        if (check.success) {
          npc.affinity = Utils.clamp(npc.affinity - 40, -100, 100);
          npc.role = "Rival";
          STATE.reputation = Utils.clamp(STATE.reputation + 1, -10, 10);
          npc.memory = `Foi humilhado e intimidado por você diante de testemunhas em ${STATE.year}.`;
          this.addLog(`👊 Você encurralou e intimidou **${npc.name}** publicamente (-6 Vigor, +1 Reputação). Cuidado: ele agora nutre ódio aberto contra você!`, "good");
        } else {
          STATE.hp -= 12;
          npc.role = "Rival";
          this.addLog(`👊 **${npc.name}** reagiu à altura da sua intimidação (-6 Vigor) e feriu você na briga (-12 Saúde)!`, "bad");
          if (STATE.hp <= 0) {
            this.die(`Morto numa briga de rua após tentar intimidar ${npc.name}.`);
            return;
          }
        }
        break;
      }

      case "duel": {
        if (STATE.age < 15) {
          UI.notify("Muito Jovem", "Você ainda não tem idade para empunhar aço em duelo mortal.");
          return;
        }
        if (!requireVigor(10)) return;
        SoundFX.play("sword");
        const wpn = this.getBestWeaponBonus ? this.getBestWeaponBonus() : { mult: 0 };
        const arm = this.getBestArmorReduction ? this.getBestArmorReduction() : { reduction: 0, blocksScars: false };
        const diffMod = Math.round((wpn.mult || 0) * 40);
        const check = this.rollCheck("forca", Math.max(40, 64 - diffMod));
        if (check.success) {
          npc.alive = false;
          npc.memory = `Tombou pelo fio da sua lâmina em duelo de honra no ano ${STATE.year}.`;
          STATE.duelsWon = (STATE.duelsWon || 0) + 1;
          STATE.honor = Utils.clamp(STATE.honor + 8, 0, 100);
          STATE.reputation = Utils.clamp(STATE.reputation + 2, -10, 10);
          this.addLog(`⚔️ DUELO DE SANGUE: Diante de padrinhos ao amanhecer (-10 Vigor), você atravessou o peito de **${npc.name}** (Casa ${npc.surname}) (+2 Rep, +8 Honra)!`, "epoch");
          if (this.checkAchievements) this.checkAchievements();

          if (Math.random() < 0.65) {
            const avenger = Utils.genNPC("Rival", Utils.rand(18, 42), null, npc.surname, npc.socialClass);
            avenger.affinity = -90;
            avenger.memory = `Jurou vingança de sangue pela morte de ${npc.name} em duelo.`;
            STATE.npcs.push(avenger);
            this.addLog(`🩸 Vendeta de Sangue: **${avenger.name}**, parente da Casa ${npc.surname}, declarou inimizade mortal contra você para vingar o sangue caído!`, "bad");
          }
          UI.closeNPCModal();
        } else {
          const dmg = arm.reduction > 0 ? Math.max(1, Math.round(24 * (1 - arm.reduction))) : 24;
          STATE.hp -= dmg;
          let scarMsg = " e deixou uma cicatriz perpétua em seu rosto";
          if (!arm.blocksScars) {
            if (!STATE.scars) STATE.scars = [];
            if (STATE.scars.length < 3) STATE.scars.push(STATE.scars.length + 1);
            if (STATE.appearance) STATE.appearance.scars = STATE.scars;
          } else {
            scarMsg = " (seu Arnês de Placas impediu cicatrizes no rosto)";
          }
          this.addLog(`⚔️ A lâmina de **${npc.name}** abriu um talho profundo${scarMsg} durante o duelo (-10 Vigor, -${dmg} Saúde)!`, "bad");
          if (STATE.hp <= 0) {
            this.die(`Tombou em duelo de honra pelo aço de ${npc.name}.`);
            return;
          }
        }
        break;
      }

      case "make_lover": {
        if (!requireVigor(4)) return;
        if (npc.role === "Cônjuge") {
          UI.notify("Já Casados", "Esta pessoa já é seu cônjuge legítimo.");
          return;
        }
        if (npc.affinity < 40) {
          UI.notify("Afinidade Insuficiente", "É necessário ao menos 40 de Afinidade para estabelecer uma ligação amorosa fixa.");
          return;
        }
        npc.isLover = true;
        if (npc.role !== "Colega de Ofício") {
          npc.role = "Amor";
        }
        npc.memory = `Tornou-se seu amante fixo sob juramentos secretos no ano ${STATE.year}.`;
        SoundFX.play("love");
        this.addLog(`🌹 PAIXÃO JURADA: Você e **${npc.name}** firmaram um pacto amoroso fixo (-4 Vigor). A chama arde nos encontros reservados!`, "good");
        if (this.checkAchievements) this.checkAchievements();
        break;
      }

      case "break_lover": {
        if (!requireVigor(3)) return;
        SoundFX.play("click");
        const lowAff = (npc.affinity || 0) < 0;
        npc.isLover = false;
        if (npc.role !== "Colega de Ofício") {
          npc.role = lowAff ? "Rival" : "Conhecido";
        }
        npc.affinity = Utils.clamp(npc.affinity - 25, -100, 100);
        npc.memory = `Rompeu a ligação de amantes com você no ano ${STATE.year}.`;
        this.addLog(`💔 ROMPIMENTO: Você rompeu definitivamente a ligação romântica com **${npc.name}** (-3 Vigor, -25 Afinidade).`, "bad");
        break;
      }

      case "legitimize_child": {
        if (npc.role !== "Filho" && npc.role !== "Filha") return;
        const cost = 80;
        if (STATE.gold < cost) {
          UI.notify("Ouro Insuficiente", `A legitimação chancelar perante a Sé e a Coroa custa ${cost} Ouro.`);
          return;
        }
        const honorCost = STATE.socialClass === "nobre" ? 10 : 5;
        STATE.gold -= cost;
        STATE.honor = Math.max(0, STATE.honor - honorCost);
        npc.legitimacy = "legitimo";
        npc.isBastard = false;
        npc.surname = STATE.surname;
        const firstName = (npc.name || "").split(" ")[0];
        npc.name = `${firstName} ${STATE.surname}`;
        npc.memory = `Legitimado plenamente como filho de direito da Casa ${STATE.surname} no ano ${STATE.year}.`;
        SoundFX.play("bells");
        Storage.unlockAchievement("ach_bastardo_legitimado");
        if (this.checkAchievements) this.checkAchievements();
        this.syncFamilyNobleTitles();
        this.addLog(`📜 CARTA DE LEGITIMAÇÃO: Você investiu ${cost} Ouro e outorgou legitimidade plena a **${npc.name}** (-${honorCost} Honra). Agora é herdeiro legítimo do seu sangue e brasão!`, "epoch");
        break;
      }

      case "acknowledge_bastard": {
        npc.legitimacy = "bastardo_reconhecido";
        npc.isBastard = true;
        STATE.honor = Math.max(0, STATE.honor - 3);
        npc.memory = `Reconhecido como bastardo de sangue da Casa ${STATE.surname} no ano ${STATE.year}.`;
        SoundFX.play("bells");
        this.addLog(`⚜️ BASTARDO RECONHECIDO: Você reconheceu formalmente **${npc.name}** como bastardo da linhagem dos ${STATE.surname} (-3 Honra).`, "normal");
        break;
      }

      case "abandon_child": {
        if (npc.role !== "Filho" && npc.role !== "Filha") return;
        if (npc.age >= 16) {
          UI.notify("Maior de Idade", "Apenas crianças menores de 16 anos podem ser entregues a um mosteiro ou orfanato.");
          return;
        }
        STATE.honor = Math.max(0, STATE.honor - 12);
        STATE.abandonedChildrenCount = (STATE.abandonedChildrenCount || 0) + 1;
        npc.role = "Abandonado";
        npc.abandoned = true;
        npc.memory = `Entregue à roda dos expostos e apartado do convívio familiar no ano ${STATE.year}.`;
        SoundFX.play("fail");
        this.addLog(`🚪 RODA DOS EXPOSTOS: Você rompeu os laços paternos e entregou **${npc.name}** a um mosteiro (-12 Honra).`, "bad");
        if (this.checkAchievements) this.checkAchievements();
        UI.closeNPCModal();
        break;
      }
    }

    Storage.saveToSlot(CONFIG.activeSlot);
    UI.renderAll();
    if (CONFIG.selectedNpcId && npc.alive) {
      UI.openNPCModal(CONFIG.selectedNpcId);
    }
  }
});
