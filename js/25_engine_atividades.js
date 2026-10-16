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
    if (act.cost && STATE.gold < act.cost) {
      UI.notify("Ouro Insuficiente", `Esta atividade exige ${act.cost} moedas de ouro.`);
      return;
    }
    if (vigorCost > 0 && STATE.vigor < vigorCost) {
      UI.notify("Vigor Exaurido", `Você precisa de ${vigorCost} de Vigor para esta atividade (Vigor atual: ${STATE.vigor}/${STATE.maxVigor}). Repouse com ervas medicinais ou avance o ano.`);
      return;
    }

    if (act.cost) STATE.gold -= act.cost;
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
        const hpGain = Utils.rand(16, 20);
        STATE.hp = Math.min(STATE.maxHp, STATE.hp + hpGain);
        STATE.vigor = Math.min(STATE.maxVigor, STATE.vigor + 10);
        popMsg = `As infusões medicinais e o repouso restauraram sua Saúde Vital (+${hpGain} Saúde) e renovaram moderadamente suas energias (+10 Vigor, 1x no ano).`;
        this.addLog(`${act.icon} ${act.name}: ${popMsg}`, "good");
      } else if (act.id === "banho_perfumado") {
        sfx = "love";
        const bGain = Utils.rand(5, 8);
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
        const gain = Utils.rand(22, 44) + tierBonus;
        STATE.gold += gain;
        if (curCity.tier !== "vila") STATE.reputation = Utils.clamp(STATE.reputation + 1, -10, 10);
        sfx = "coin";
        popMsg = `Sua caravana mercante partindo de ${curCity.name} [${this.getCityTierLabel(curCity.tier)}] rendeu +${gain} Ouro${curCity.tier !== "vila" ? " e +1 Reputação" : ""}!`;
        this.addLog(`${act.icon} ${act.name}: ${popMsg}`, "good");
      } else if (act.id === "peregrinacao") {
        const curCity = this.getCityObj ? this.getCityObj(STATE.currentCityId, STATE.kingdom) : { name: "", tier: "vila" };
        const isCap = curCity.tier === "capital";
        STATE.hp = Math.min(STATE.maxHp, STATE.hp + 14);
        STATE.attrs.fe = Math.min(100, (STATE.attrs.fe || 20) + 6);
        STATE.honor = Utils.clamp(STATE.honor + (isCap ? 10 : 6), 0, 100);
        if (isCap) STATE.reputation = Utils.clamp(STATE.reputation + 1, -10, 10);
        sfx = "bells";
        popMsg = this.formatText(`Em peregrinação devota até {temple} de {city}, você renovou o corpo e a alma (+14 Saúde, +6 Fé, +${isCap ? 10 : 6} Honra${isCap ? ", +1 Rep" : ""})!`);
        this.addLog(`${act.icon} ${act.name}: ${popMsg}`, "good");
      } else if (act.id === "trabalhar_duro" || act.id === "saquear_navio") {
        const gain = Utils.rand(18, 45);
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
      } else {
        if (["treinar_armas","treinar_arco","disputar_torneio","desafiar_duelo","marchar_guerra","liderar_cerco","cacar_lobos","cacar_floresta"].includes(act.id)) {
          sfx = "sword";
        } else if (["orar_jejuar","peregrinacao","fazer_caridade","ingressar_ordem"].includes(act.id)) {
          sfx = "bells";
        } else {
          sfx = "success";
        }

        STATE.activityYearCount = STATE.activityYearCount || {};
        const count = STATE.activityYearCount[act.id] || 0;
        STATE.activityYearCount[act.id] = count + 1;

        const isFatigued = count > 0 && Math.random() > Math.pow(0.55, count);

        if (isFatigued) {
          popMsg = `A exaustão por repetição contínua (-${vigorCost} Vigor) limitou seu aproveitamento. O corpo e a mente demandam descanso para assimilar novos avanços.`;
          this.addLog(`${act.icon} ${act.name}: ${popMsg}`);
        } else if (act.attr && STATE.attrs && STATE.attrs[act.attr] !== undefined) {
          const curVal = STATE.attrs[act.attr];
          let boost = 0;
          if (curVal >= 100) {
            boost = 0;
          } else if (curVal < 40) {
            boost = Utils.rand(2, 3);
          } else if (curVal < 70) {
            boost = Utils.rand(1, 2);
          } else if (curVal < 85) {
            boost = Math.random() < 0.65 ? 1 : 0;
          } else {
            boost = Math.random() < 0.35 ? 1 : 0;
          }

          if (boost > 0) {
            STATE.attrs[act.attr] = Math.min(100, curVal + boost);
            if (act.attr === "saude") STATE.maxHp = Math.max(10, this.getEffectiveAttr("saude"));
            popMsg = `Dedicação exemplar (-${vigorCost} Vigor)! Seu domínio em ${act.attr.toUpperCase()} aprimorou-se notavelmente (+${boost}).`;
            this.addLog(`${act.icon} ${act.name}: ${popMsg}`, "good");
          } else {
            STATE.honor = Utils.clamp(STATE.honor + 1, 0, 100);
            popMsg = curVal >= 100
              ? `Você já atingiu a mestria máxima em ${act.attr.toUpperCase()} (100). Sua dedicação (-${vigorCost} Vigor) trouxe respeito (+1 Honra).`
              : `Sua dedicação (-${vigorCost} Vigor) trouxe disciplina e respeito (+1 Honra).`;
            this.addLog(`${act.icon} ${act.name}: ${popMsg}`, "good");
          }
        } else {
          STATE.honor = Utils.clamp(STATE.honor + 1, 0, 100);
          popMsg = `Sua dedicação (-${vigorCost} Vigor) trouxe disciplina e respeito (+1 Honra).`;
          this.addLog(`${act.icon} ${act.name}: ${popMsg}`, "good");
        }
      }
    } else {
      sfx = "fail";
      const dmg = STATE.age < 12 ? 2 : 6;
      STATE.hp = Math.max(STATE.age < 12 ? 5 : 0, STATE.hp - dmg);
      let penaltyMsg = "";

      const martialActs = ["treinar_armas","treinar_arco","disputar_torneio","desafiar_duelo","marchar_guerra","liderar_cerco","cacar_lobos","cacar_floresta"];
      const socialActs = ["socializar_taverna","jogos_azar","feira_burgo","banho_perfumado"];
      const religiousActs = ["orar_jejuar","peregrinacao"];

      if (martialActs.includes(act.id) && Math.random() < 0.30) {
        if (STATE.attrs.forca > 15 && Math.random() < 0.5) {
          STATE.attrs.forca -= 1;
          penaltyMsg = " (-1 Força por distensão muscular)";
        } else if (STATE.attrs.destreza > 15) {
          STATE.attrs.destreza -= 1;
          penaltyMsg = " (-1 Destreza por entorse)";
        }
      } else if (socialActs.includes(act.id) && Math.random() < 0.25) {
        STATE.attrs.carisma = Math.max(10, (STATE.attrs.carisma || 15) - 1);
        penaltyMsg = " (-1 Carisma por vexame público)";
      } else if (religiousActs.includes(act.id) && Math.random() < 0.20) {
        STATE.attrs.fe = Math.max(10, (STATE.attrs.fe || 15) - 1);
        penaltyMsg = " (-1 Fé por crise de espírito)";
      }

      if (["furtar_bolsas","assaltar_estrada","saquear_navio"].includes(act.id)) {
        STATE.reputation = Utils.clamp(STATE.reputation - 1, -10, 10);
        STATE.honor = Utils.clamp(STATE.honor - 5, 0, 100);
        popMsg = `Os guardas deram o alarme e você escapou ferido pelos becos (-1 Rep, -5 Honra, -${dmg} Saúde, -${vigorCost} Vigor)${penaltyMsg}!`;
        this.addLog(`${act.icon} ${act.name}: ${popMsg}`, "bad");
      } else {
        popMsg = `O esforço exaustivo malogrou e cobrou pedágio do seu corpo (-${dmg} Saúde${vigorCost ? `, -${vigorCost} Vigor` : ""})${penaltyMsg}.`;
        this.addLog(`${act.icon} ${act.name}: ${popMsg}`, "bad");
      }
      if (STATE.hp <= 0) {
        this.die(`Caiu morto de exaustão e ferimentos durante ${act.name}.`);
        return;
      }
    }

    Storage.saveToSlot(CONFIG.activeSlot);
    UI.renderAll();
    UI.notify(popTitle, popMsg, sfx);
  }
});
