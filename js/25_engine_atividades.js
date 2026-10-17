/* ============================================================================
   [ENGINE · ATIVIDADES] — atividades anuais do personagem (performActivity)
   ============================================================================ */
Object.assign(Engine, {
  performActivity(actId) {
    this.ensureVigorFields();
    const act = DATA.activities.find(a => a.id === actId);
    if (!act) return;

    if (act.id === "cuidar_saude" && STATE.healthCareUsedThisYear) {
      UI.notify("Tratamento Já Realizado", "Você já recebeu infusões e repouso médico este ano. O corpo precisa de tempo para absorver o tratamento até o próximo ano.");
      return;
    }

    const vigorCost = act.id === "cuidar_saude" ? 0 : 12;
    let actualCost = act.cost || 0;
    if (["socializar_taverna", "jogos_azar", "festejo_desregrado"].includes(act.id) && this.hasActiveItem("taverna_porto")) {
      actualCost = 0;
    } else if (["dar_banquete", "patrocinar_torneio"].includes(act.id) && this.hasAnyActiveItem(["solar_nobre", "castelo_feudal", "palacio_real"])) {
      actualCost = Math.round(actualCost * 0.60);
    }

    if (actualCost > 0 && STATE.gold < actualCost) {
      UI.notify("Ouro Insuficiente", `Esta atividade exige ${actualCost} moedas de ouro.`);
      return;
    }
    if (vigorCost > 0 && STATE.vigor < vigorCost) {
      UI.notify("Vigor Exaurido", `Você precisa de ${vigorCost} de Vigor para esta atividade (Vigor atual: ${STATE.vigor}/${STATE.maxVigor}). Repouse com ervas medicinais ou avance o ano.`);
      return;
    }

    if (actualCost > 0) STATE.gold -= actualCost;
    if (vigorCost > 0) STATE.vigor = Math.max(0, STATE.vigor - vigorCost);

    if (act.id === "cortejar_romance") {
      this.introduceSuitor();
      return;
    }

    if (act.id === "disputar_torneio" && Math.random() < 0.45) {
      this.startSpecialJobTrial("joust");
      return;
    }
    if ((act.id === "marchar_guerra" || act.id === "liderar_cerco") && Math.random() < 0.45) {
      this.startSpecialJobTrial("battle");
      return;
    }

    const check = this.rollCheck(act.attr, act.diff);
    let popTitle = `${act.icon} ${act.name}`;
    let popMsg = "";
    let sfx = "success";

    if (check.success) {
      if (act.id === "cuidar_saude") {
        sfx = "love";
        STATE.healthCareUsedThisYear = true;
        const extraAlambique = this.hasActiveItem("alambique_alquimia") ? 10 : 0;
        const hpGain = Utils.rand(16, 20) + extraAlambique;
        STATE.hp = Math.min(STATE.maxHp, STATE.hp + hpGain);
        STATE.vigor = Math.min(STATE.maxVigor, STATE.vigor + 10);
        popMsg = `As infusões medicinais e o repouso restauraram sua Saúde Vital (+${hpGain} Saúde) e renovaram moderadamente suas energias (+10 Vigor, 1x no ano).`;
        this.addLog(`${act.icon} ${act.name}: ${popMsg}`, "good");
      } else if (act.id === "banho_perfumado") {
        sfx = "love";
        const extraMirror = this.hasActiveItem("espelho_veneziano") ? 4 : 0;
        const bGain = Utils.rand(5, 8) + extraMirror;
        STATE.attrs.beleza = Math.min(100, (STATE.attrs.beleza || 25) + bGain);
        STATE.attrs.carisma = Math.min(100, (STATE.attrs.carisma || 20) + 2);
        popMsg = `Os óleos aromáticos, unguentos reais e trajes alinhados realçaram notavelmente sua presença (+${bGain} Beleza, +2 Carisma)!`;
        this.addLog(`${act.icon} ${act.name}: ${popMsg}`, "good");
      } else if (act.id === "jogos_azar") {
        const prize = Utils.rand(22, 55);
        STATE.gold += prize;
        sfx = "coin";
        popMsg = `Os dados de marfim sorriram para você na taverna (+${prize} Moedas de Ouro)!`;
        this.addLog(`${act.icon} ${act.name}: ${popMsg}`, "good");
      } else if (act.jobPool) {
        const perfGain = Utils.rand(8, 14);
        const goldGain = STATE.guildTraining ? 0 : Utils.rand(12, 28);
        STATE.jobPerformance = Utils.clamp((STATE.jobPerformance || 50) + perfGain, 0, 100);
        STATE.gold += goldGain;
        if (STATE.attrs[act.attr] < 100 && Math.random() < 0.5) {
          STATE.attrs[act.attr] = Math.min(100, STATE.attrs[act.attr] + 3);
        }
        if (act.id === "job_act_sarau_corte") {
          STATE.attrs.beleza = Math.min(100, (STATE.attrs.beleza || 25) + 3);
        }
        sfx = "bells";
        popMsg = `Excelência profissional em ${act.name}: +${perfGain} Desempenho${goldGain ? `, +${goldGain} Ouro` : ''} e aprimoramento em ${act.attr.toUpperCase()}!`;
        this.addLog(`${act.icon} ${popMsg}`, "good");
      } else if (act.id === "caravana_comercial") {
        const curCity = this.getCityObj ? this.getCityObj(STATE.currentCityId, STATE.kingdom) : { name: "", tier: "vila" };
        const tierBonus = curCity.tier === "capital" ? 28 : (curCity.tier === "cidade" ? 14 : 0);
        const shipBonus = this.hasActiveItem("navio_mercante") ? 45 : 0;
        const horseBonus = this.hasActiveItem("cavalo_carga") ? 18 : 0;
        const gain = Utils.rand(22, 44) + tierBonus + shipBonus + horseBonus;
        STATE.gold += gain;
        if (curCity.tier !== "vila") STATE.reputation = Utils.clamp(STATE.reputation + 1, -10, 10);
        sfx = "coin";
        popMsg = `Sua caravana mercante partindo de ${curCity.name} [${this.getCityTierLabel(curCity.tier)}] rendeu +${gain} Ouro${curCity.tier !== "vila" ? " e +1 Reputação" : ""}!`;
        this.addLog(`${act.icon} ${act.name}: ${popMsg}`, "good");
      } else if (act.id === "peregrinacao") {
        const curCity = this.getCityObj ? this.getCityObj(STATE.currentCityId, STATE.kingdom) : { name: "", tier: "vila" };
        const isCap = curCity.tier === "capital";
        const repGain = isCap && Math.random() < 0.5 ? 1 : 0;
        const hasRelic = this.hasActiveItem("reliquia_santa");
        const hpRestored = 14 + (hasRelic ? 8 : 0);
        const honorGained = 4 + (hasRelic ? 5 : 0);
        STATE.hp = Math.min(STATE.maxHp, STATE.hp + hpRestored);
        STATE.attrs.fe = Math.min(100, (STATE.attrs.fe || 20) + 3);
        STATE.honor = Utils.clamp(STATE.honor + honorGained, 0, 100);
        if (repGain) STATE.reputation = Utils.clamp(STATE.reputation + 1, -10, 10);
        sfx = "bells";
        popMsg = this.formatText(`Em peregrinação devota até {temple} de {city}, você renovou o corpo e a alma (+${hpRestored} Saúde, +3 Fé, +${honorGained} Honra${repGain ? ", +1 Rep" : ""})!`);
        this.addLog(`${act.icon} ${act.name}: ${popMsg}`, "good");
      } else if (act.id === "trabalhar_duro" || act.id === "saquear_navio") {
        const extraShip = (act.id === "saquear_navio" && this.hasActiveItem("navio_mercante")) ? 50 : 0;
        const gain = Utils.rand(18, 45) + extraShip;
        STATE.gold += gain;
        sfx = "coin";
        popMsg = `Com suor e determinação (-${vigorCost} Vigor), você embolsou +${gain} Moedas de Ouro!`;
        this.addLog(`${act.icon} ${act.name}: ${popMsg}`, "good");
      } else if (act.id === "conspirar_golpe") {
        sfx = "coin";
        STATE.reputation = Utils.clamp(STATE.reputation + 2, -10, 10);
        STATE.gold += 50;
        if (!STATE.flags.includes("conspirador")) STATE.flags.push("conspirador");
        popMsg = `Sua articulação secreta derrubou rivais e rendeu influência e ouro (+50 🪙, +2 Reputação)!`;
        this.addLog(`${act.icon} ${act.name}: ${popMsg}`, "good");
      } else if (act.id === "duelo_clandestino") {
        sfx = "sword";
        const hasMartialGear = this.hasAnyActiveItem(["cavalo_guerra", "espada_longa", "lamina_damasco"]);
        const goldGain = Utils.rand(35, 70) + (hasMartialGear ? 15 : 0);
        const ronda = Math.random() < 0.30;
        STATE.gold += goldGain;
        STATE.attrs.forca = Math.min(100, (STATE.attrs.forca || 20) + 1);
        if (hasMartialGear) STATE.honor = Utils.clamp(STATE.honor + 3, 0, 100);
        if (ronda) STATE.honor = Utils.clamp(STATE.honor - 2, 0, 100);
        STATE.duelsWon = (STATE.duelsWon || 0) + 1;
        popMsg = `Vitória implacável no ringue clandestino (+${goldGain} Ouro, +1 Força${hasMartialGear ? ", +3 Honra" : ""}${ronda ? ", mas a ronda da guarda dispersou o local: -2 Honra" : ""})!`;
        this.addLog(`${act.icon} ${act.name}: ${popMsg}`, ronda ? "bad" : "good");
      } else if (act.id === "caca_furtiva") {
        sfx = "sword";
        const goldGain = Utils.rand(20, 42);
        STATE.gold += goldGain;
        STATE.attrs.destreza = Math.min(100, (STATE.attrs.destreza || 20) + 2);
        popMsg = `Caçada furtiva bem-sucedida nos bosques senhoriais (+${goldGain} Ouro, +2 Destreza)!`;
        this.addLog(`${act.icon} ${act.name}: ${popMsg}`, "good");
      } else if (act.id === "festejo_desregrado") {
        sfx = "love";
        STATE.attrs.carisma = Math.min(100, (STATE.attrs.carisma || 20) + 1);
        STATE.attrs.beleza = Math.min(100, (STATE.attrs.beleza || 20) + 1);
        STATE.vigor = Math.min(STATE.maxVigor, STATE.vigor + 10);
        const escandalo = Math.random() < 0.35;
        if (escandalo) STATE.honor = Utils.clamp(STATE.honor - 1, 0, 100);
        popMsg = `A noitada desregrada renovou o ânimo (+1 Carisma, +1 Beleza, +10 Vigor${escandalo ? ", mas um escândalo menor custou respeito: -1 Honra" : ""})!`;
        this.addLog(`${act.icon} ${act.name}: ${popMsg}`, escandalo ? "bad" : "good");
      } else if (act.id === "penitencia_flagelo") {
        sfx = "bells";
        STATE.honor = Utils.clamp(STATE.honor + 6, 0, 100);
        STATE.attrs.fe = Math.min(100, (STATE.attrs.fe || 20) + 2);
        STATE.hp = Math.max(1, STATE.hp - 8);
        popMsg = `Sua penitência severa e o cilício expiaram suas faltas (+6 Honra, +2 Fé, -8 Saúde)!`;
        this.addLog(`${act.icon} ${act.name}: ${popMsg}`, "good");
      } else if (act.id === "patrocinar_torneio") {
        sfx = "bells";
        STATE.honor = Utils.clamp(STATE.honor + 6, 0, 100);
        STATE.reputation = Utils.clamp(STATE.reputation + 1, -10, 10);
        STATE.attrs.carisma = Math.min(100, (STATE.attrs.carisma || 20) + 2);
        popMsg = `O grande torneio patrocinado por você consagrou seu renome (+6 Honra, +1 Reputação, +2 Carisma)!`;
        this.addLog(`${act.icon} ${act.name}: ${popMsg}`, "good");
      } else if (act.id === "doar_dizimo_extraordinario") {
        sfx = "bells";
        STATE.honor = Utils.clamp(STATE.honor + 4, 0, 100);
        STATE.attrs.fe = Math.min(100, (STATE.attrs.fe || 20) + 2);
        popMsg = `Sua doação extraordinária às obras da Sé foi abençoada pelo clero (+4 Honra, +2 Fé)!`;
        this.addLog(`${act.icon} ${act.name}: ${popMsg}`, "good");
      } else if (act.id === "jogos_dados_viciados") {
        sfx = "coin";
        const goldGain = Utils.rand(50, 95);
        STATE.gold += goldGain;
        STATE.attrs.destreza = Math.min(100, (STATE.attrs.destreza || 20) + 2);
        popMsg = `Com dados raspados e destreza furtiva, você limpou as bolsas da mesa (+${goldGain} Ouro, +2 Destreza)!`;
        this.addLog(`${act.icon} ${act.name}: ${popMsg}`, "good");
      } else if (act.exclusiveKingdom) {
        sfx = "coin";
        const kName = this.getKingdom().name;
        const regGold = Utils.rand(20, 45);
        STATE.gold += regGold;
        if (act.attr && STATE.attrs && STATE.attrs[act.attr] !== undefined) {
          STATE.attrs[act.attr] = Math.min(100, (STATE.attrs[act.attr] || 20) + 3);
        }
        const repBonus = Math.random() < 0.5;
        if (repBonus) {
          STATE.reputation = Utils.clamp(STATE.reputation + 1, -10, 10);
        } else {
          STATE.honor = Utils.clamp(STATE.honor + 4, 0, 100);
        }
        popMsg = `Com maestria nas tradições de ${kName}, sua atuação em ${act.name} foi aclamada (+${regGold} Ouro, +3 ${act.attr.toUpperCase()}${repBonus ? ", +1 Reputação" : ", +4 Honra"})!`;
        this.addLog(`${act.icon} ⚜️ TRADIÇÃO REGIONAL (${kName}): ${popMsg}`, "good");
      } else {
        if (["treinar_armas","treinar_arco","disputar_torneio","desafiar_duelo","marchar_guerra","liderar_cerco","cacar_lobos","cacar_floresta"].includes(act.id)) {
          sfx = "sword";
        } else if (["orar_jejuar","peregrinacao","fazer_caridade","ingressar_ordem"].includes(act.id)) {
          sfx = "bells";
        } else {
          sfx = "success";
        }

        let itemBonusNotes = [];
        if ((act.id === "cacar_floresta" || act.id === "cacar_lobos") && this.hasAnyActiveItem(["arco_composto", "cavalo_guerra"])) {
          STATE.gold += 15;
          STATE.attrs.destreza = Math.min(100, (STATE.attrs.destreza || 20) + 2);
          itemBonusNotes.push("+15 Ouro, +2 Destreza");
        }
        if (act.id === "pescar_rio" && this.hasActiveItem("barco_pesca")) {
          STATE.gold += 18;
          itemBonusNotes.push("+18 Ouro");
        }
        if (act.id === "forjar_equipamento" && this.hasAnyActiveItem(["oficina_artesao", "ferramentas_mestre"])) {
          STATE.gold += 20;
          itemBonusNotes.push("+20 Ouro");
        }
        if (["disputar_torneio", "marchar_guerra", "liderar_cerco"].includes(act.id)) {
          STATE.duelsWon = (STATE.duelsWon || 0) + 1;
          if (this.hasAnyActiveItem(["cavalo_guerra", "espada_longa", "lamina_damasco"])) {
            STATE.gold += 15;
            STATE.honor = Utils.clamp(STATE.honor + 3, 0, 100);
            itemBonusNotes.push("+15 Ouro, +3 Honra");
          }
        }
        if (act.id === "compor_balada" && this.hasAnyActiveItem(["flauta_osso", "alaude_nobre", "harpa_dourada"])) {
          STATE.gold += 15;
          STATE.attrs.carisma = Math.min(100, (STATE.attrs.carisma || 20) + 2);
          itemBonusNotes.push("+15 Ouro, +2 Carisma");
        }
        if (act.id === "tratar_doentes" && this.hasActiveItem("alambique_alquimia")) {
          STATE.hp = Math.min(STATE.maxHp, STATE.hp + 10);
          itemBonusNotes.push("+10 Saúde");
        }
        if ((act.id === "estudar_manuscritos" || act.id === "estudar_heresia") && this.hasActiveItem("grimorio_latim")) {
          STATE.attrs.intelecto = Math.min(100, (STATE.attrs.intelecto || 20) + 3);
          STATE.gold += 18;
          itemBonusNotes.push("+3 Intelecto, +18 Ouro");
        }
        if ((act.id === "orar_jejuar" || act.id === "fazer_caridade") && this.hasActiveItem("reliquia_santa")) {
          STATE.honor = Utils.clamp(STATE.honor + 5, 0, 100);
          STATE.hp = Math.min(STATE.maxHp, STATE.hp + 8);
          itemBonusNotes.push("+5 Honra, +8 Saúde");
        }
        const itemBonusStr = itemBonusNotes.length > 0 ? ` [Bônus de Posse: ${itemBonusNotes.join(", ")}]` : "";

        STATE.activityYearCount = STATE.activityYearCount || {};
        const count = STATE.activityYearCount[act.id] || 0;
        STATE.activityYearCount[act.id] = count + 1;

        const isFatigued = count > 0 && Math.random() > Math.pow(0.40, count);

        if (isFatigued) {
          popMsg = `A exaustão por repetição contínua (-${vigorCost} Vigor) limitou seu aproveitamento. O corpo e a mente demandam descanso para assimilar novos avanços.${itemBonusStr}`;
          this.addLog(`${act.icon} ${act.name}: ${popMsg}`);
        } else if (act.attr && STATE.attrs && STATE.attrs[act.attr] !== undefined) {
          const curVal = STATE.attrs[act.attr];
          let boost = 0;
          if (curVal >= 100) {
            boost = 0;
          } else if (curVal < 35) {
            boost = Utils.rand(1, 2);
          } else if (curVal < 55) {
            boost = Math.random() < 0.70 ? 1 : 0;
          } else if (curVal < 75) {
            boost = Math.random() < 0.40 ? 1 : 0;
          } else if (curVal < 90) {
            boost = Math.random() < 0.18 ? 1 : 0;
          } else {
            boost = Math.random() < 0.06 ? 1 : 0;
          }

          if (boost > 0) {
            STATE.attrs[act.attr] = Math.min(100, curVal + boost);
            if (act.attr === "saude") STATE.maxHp = Math.max(10, this.getEffectiveAttr("saude"));
            popMsg = `Dedicação exemplar (-${vigorCost} Vigor)! Seu domínio em ${act.attr.toUpperCase()} aprimorou-se notavelmente (+${boost}).${itemBonusStr}`;
            this.addLog(`${act.icon} ${act.name}: ${popMsg}`, "good");
          } else {
            popMsg = (curVal >= 100
              ? `Você já atingiu a mestria máxima em ${act.attr.toUpperCase()} (100). A prática (-${vigorCost} Vigor) manteve sua técnica lapidada.`
              : `A prática árdua (-${vigorCost} Vigor) manteve sua disciplina, mas seu domínio em ${act.attr.toUpperCase()} não avançou além do platô atual.`) + itemBonusStr;
            this.addLog(`${act.icon} ${act.name}: ${popMsg}`);
          }
        } else {
          popMsg = `Sua dedicação (-${vigorCost} Vigor) serviu para manter sua rotina e disciplina em dia.${itemBonusStr}`;
          this.addLog(`${act.icon} ${act.name}: ${popMsg}`);
        }
      }
    } else {
      sfx = "fail";
      let penaltyMsg = "";
      const arm = this.getBestArmorReduction ? this.getBestArmorReduction() : { reduction: 0 };

      const martialActs = ["treinar_armas","treinar_arco","disputar_torneio","desafiar_duelo","marchar_guerra","liderar_cerco","cacar_lobos","cacar_floresta"];
      const socialActs = ["socializar_taverna","jogos_azar","feira_burgo","banho_perfumado"];
      const religiousActs = ["orar_jejuar","peregrinacao"];

      if (martialActs.includes(act.id) && Math.random() < 0.45) {
        const stat = Math.random() < 0.5 ? "forca" : "destreza";
        if ((STATE.attrs[stat] || 0) > 10) STATE.attrs[stat] -= 1;
        STATE.honor = Utils.clamp(STATE.honor - 2, 0, 100);
        penaltyMsg = ` (-1 ${stat === "forca" ? "Força" : "Destreza"} por lesão e -2 Honra por fiasco na arena)`;
      } else if (socialActs.includes(act.id) && Math.random() < 0.40) {
        STATE.attrs.carisma = Math.max(10, (STATE.attrs.carisma || 15) - 1);
        STATE.honor = Utils.clamp(STATE.honor - 2, 0, 100);
        let repSub = "";
        if (STATE.reputation > 0) {
          STATE.reputation = Utils.clamp(STATE.reputation - 1, -10, 10);
          repSub = ", -1 Reputação";
        }
        penaltyMsg = ` (-1 Carisma, -2 Honra${repSub} por vexame público)`;
      } else if (religiousActs.includes(act.id) && Math.random() < 0.35) {
        STATE.attrs.fe = Math.max(10, (STATE.attrs.fe || 15) - 1);
        STATE.honor = Utils.clamp(STATE.honor - 2, 0, 100);
        penaltyMsg = " (-1 Fé, -2 Honra por crise de espírito)";
      }

      if (act.id === "duelo_clandestino") {
        const hLoss = Utils.rand(4, 8);
        const dmg = arm.reduction > 0 ? Math.max(1, Math.round(16 * (1 - arm.reduction))) : 16;
        STATE.reputation = Utils.clamp(STATE.reputation - 1, -10, 10);
        STATE.honor = Utils.clamp(STATE.honor - hLoss, 0, 100);
        STATE.hp = Math.max(1, STATE.hp - dmg);
        popMsg = `Derrotado e vaiado na arena clandestina: -1 Reputação, -${hLoss} Honra, -${dmg} HP.`;
        this.addLog(`${act.icon} ${act.name}: ${popMsg}`, "bad");
      } else if (act.id === "caca_furtiva") {
        const hLoss = Utils.rand(4, 8);
        STATE.reputation = Utils.clamp(STATE.reputation - 1, -10, 10);
        STATE.honor = Utils.clamp(STATE.honor - hLoss, 0, 100);
        STATE.hp = Math.max(5, STATE.hp - 12);
        STATE.gold = Math.max(0, STATE.gold - 20);
        popMsg = `Pego em flagrante nos bosques senhoriais: açoitado e multado (-1 Rep, -${hLoss} Honra, -12 HP, -20 🪙)!`;
        this.addLog(`${act.icon} ${act.name}: ${popMsg}`, "bad");
      } else if (act.id === "festejo_desregrado") {
        STATE.reputation = Utils.clamp(STATE.reputation - 1, -10, 10);
        STATE.honor = Utils.clamp(STATE.honor - 6, 0, 100);
        popMsg = "A festa virou pancadaria pública e queixas de vizinhos (-1 Reputação, -6 Honra).";
        this.addLog(`${act.icon} ${act.name}: ${popMsg}`, "bad");
      } else if (act.id === "jogos_dados_viciados") {
        const hLoss = Utils.rand(6, 8);
        STATE.reputation = Utils.clamp(STATE.reputation - 1, -10, 10);
        STATE.honor = Utils.clamp(STATE.honor - hLoss, 0, 100);
        STATE.hp = Math.max(1, STATE.hp - 20);
        STATE.flags = STATE.flags || [];
        if (!STATE.flags.includes("trapaceiro")) STATE.flags.push("trapaceiro");
        popMsg = `Desmascarado com dados viciados! Espancado pelos fregueses e marcado como trapaceiro (-1 Rep, -${hLoss} Honra, -20 HP)!`;
        this.addLog(`${act.icon} ${act.name}: ${popMsg}`, "bad");
      } else if (act.id === "patrocinar_torneio") {
        STATE.honor = Utils.clamp(STATE.honor + 2, 0, 100);
        popMsg = "Briga entre cavaleiros mancha a justa: gasto de ouro rendeu pouco renome (+2 Honra).";
        this.addLog(`${act.icon} ${act.name}: ${popMsg}`, "bad");
      } else if (["furtar_bolsas","assaltar_estrada","saquear_navio","conspirar_golpe"].includes(act.id)) {
        const baseDmg = STATE.age < 12 ? 2 : 6;
        const dmg = arm.reduction > 0 ? Math.max(1, Math.round(baseDmg * (1 - arm.reduction))) : baseDmg;
        const hLoss = Utils.rand(4, 8);
        STATE.hp = Math.max(STATE.age < 12 ? 5 : 0, STATE.hp - dmg);
        STATE.reputation = Utils.clamp(STATE.reputation - 1, -10, 10);
        STATE.honor = Utils.clamp(STATE.honor - hLoss, 0, 100);
        popMsg = `Os guardas deram o alarme e você escapou ferido pelos becos (-1 Rep, -${hLoss} Honra, -${dmg} Saúde, -${vigorCost} Vigor)${penaltyMsg}!`;
        this.addLog(`${act.icon} ${act.name}: ${popMsg}`, "bad");
      } else {
        const baseDmg = STATE.age < 12 ? 2 : 6;
        const usesArmor = ["cacar_floresta", "cacar_lobos", "disputar_torneio", "marchar_guerra", "liderar_cerco", "desafiar_duelo", "treinar_armas"].includes(act.id);
        const dmg = (usesArmor && arm.reduction > 0) ? Math.max(1, Math.round(baseDmg * (1 - arm.reduction))) : baseDmg;
        STATE.hp = Math.max(STATE.age < 12 ? 5 : 0, STATE.hp - dmg);
        popMsg = `O esforço exaustivo malogrou e cobrou pedágio do seu corpo (-${dmg} Saúde${vigorCost ? `, -${vigorCost} Vigor` : ""})${penaltyMsg}.`;
        this.addLog(`${act.icon} ${act.name}: ${popMsg}`, "bad");
      }
      if (STATE.hp <= 0) {
        this.die(`Caiu morto de exaustão e ferimentos durante ${act.name}.`);
        return;
      }
    }

    if (this.checkAchievements) this.checkAchievements();
    Storage.saveToSlot(CONFIG.activeSlot);
    UI.renderAll();
    UI.notify(popTitle, popMsg, sfx);
  }
});
