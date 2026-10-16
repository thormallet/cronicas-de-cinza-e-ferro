/* ============================================================================
   [ENGINE · TROCA DE OFÍCIO] — ingresso, promoção e troca de ofícios e guildas (changeJob)
   ============================================================================ */
Object.assign(Engine, {
  changeJob(jobId, mode = "job") {
    this.ensureVigorFields();
    const j = DATA.jobs.find(x => x.id === jobId);
    if (!j || !this.isJobAccessibleForPlayer(j)) return;

    if (STATE.age < j.minAge) {
      UI.notify("Idade Insuficiente", `Este caminho exige pelo menos ${j.minAge} anos.`);
      return;
    }

    if (j.maxHonor !== undefined && STATE.honor > j.maxHonor) {
      UI.notify("Honra Elevada Demais", `Sua índole honrada (${STATE.honor}/100) impede que você desça a este submundo (Máx Honra: ${j.maxHonor}).`);
      return;
    }

    if (j.ecclesiastical) {
      if (STATE.expelledEcclesiastical) {
        UI.notify("Excomungado do Estado Clerical", "Você foi expulso anteriormente por quebrar o voto de castidade e jamais poderá retornar a uma carreira ou noviciado eclesiástico!");
        return;
      }
      const hasSpouse = STATE.npcs.some(n => n.role === "Cônjuge" && n.alive);
      if (hasSpouse) {
        UI.notify("Voto de Castidade Exigido", `As carreiras eclesiásticas (${j.name}) exigem celibato e voto estrito de castidade. Pessoas casadas não podem ingressar.`);
        return;
      }
    }

    const graduated = STATE.completedGuilds.includes(j.id);
    if (mode === "job" && j.guildYears && j.guildYears > 0 && !graduated) {
      UI.notify(
        "Formação em Guilda Exigida",
        `O ofício de ${j.name} exige ${j.guildYears} ano(s) de aprendizado prévio na ${j.guildName}. Acesse a sub-aba "🏛️ Guildas" para matricular-se primeiro!`
      );
      return;
    }

    const finalCost = this.getJobMobilityCost(j);
    if (finalCost > 0 && STATE.gold < finalCost) {
      UI.notify("Ouro Insuficiente", `A taxa de matrícula ou investidura para ${j.name} exige ${finalCost} moedas de ouro.`);
      return;
    }

    for (const [k, v] of Object.entries(j.req || {})) {
      if (k === "rep" && STATE.reputation < v) {
        UI.notify("Reputação Insuficiente", `Requer Reputação mínima de ${v}.`);
        return;
      }
      if (k === "honor" && STATE.honor < v) {
        UI.notify("Honra Insuficiente", `Requer Honra mínima de ${v}.`);
        return;
      }
      if (STATE.attrs[k] !== undefined && this.getEffectiveAttr(k) < v) {
        UI.notify("Aptidão Insuficiente", `Sua barra de ${k.toUpperCase()} ainda não atingiu o nível exigido para ingressar.`);
        return;
      }
    }

    const isSwitchingCareer = (STATE.job !== "crianca" && STATE.job !== j.id) || (STATE.guildTraining && STATE.guildTraining.jobId !== j.id);
    const changesCount = STATE.careerChanges || 0;
    const agePenalty = STATE.age > 30 ? Math.floor((STATE.age - 30) * 1.4) : 0;
    const switchPenalty = (isSwitchingCareer ? 14 : 0) + (changesCount * 8);

    if (agePenalty > 0 || switchPenalty > 0) {
      if (STATE.vigor < 10) {
        UI.notify("Vigor Insuficiente", "Você precisa de ao menos 10 de Vigor para submeter-se à sabatina de admissão.");
        return;
      }
      const admissionDiff = Utils.clamp(38 + agePenalty + switchPenalty, 38, 92);
      const admCheck = this.rollCheck("carisma", admissionDiff);
      if (!admCheck.success) {
        STATE.vigor = Math.max(0, STATE.vigor - 10);
        SoundFX.play("fail");
        const reasonStr = agePenalty > 0 && switchPenalty > 0
          ? `sua idade (${STATE.age} anos) e seu histórico de trocas de ofício (${changesCount})`
          : (agePenalty > 0 ? `sua idade avançada (${STATE.age} anos)` : `sua inconstância profissional por trocar de carreira`);
        const failMsg = `Os síndicos e mestres olharam com desconfiança para ${reasonStr} e rejeitaram sua admissão em ${j.name} (-10 Vigor)!`;
        this.addLog(`🚫 Admissão Recusada: ${failMsg}`, "bad");
        UI.notify("Admissão Recusada pelos Mestres", failMsg, "fail");
        UI.renderAll();
        return;
      }
    }

    if (isSwitchingCareer || STATE.job !== "crianca" || STATE.guildTraining) {
      STATE.careerChanges = (STATE.careerChanges || 0) + 1;
    }

    if (finalCost > 0) STATE.gold -= finalCost;

    if (mode === "guild" || (j.guildYears && j.guildYears > 0 && !graduated)) {
      STATE.job = "crianca";
      STATE.jobRank = 0;
      STATE.guildTraining = {
        jobId: j.id,
        jobName: j.name,
        guildName: j.guildName || `Guilda de ${j.name}`,
        yearsDone: 0,
        yearsReq: j.guildYears
      };
      STATE.jobPerformance = 50;
      SoundFX.play("bells");
      this.addLog(`🏛️ INGRESSO NA GUILDA: Você foi aceito no grau mais baixo (**Aprendiz Iniciante**) sob a tutela dos Mestres da **${STATE.guildTraining.guildName}** (${j.guildYears} anos para formar-se em ${j.name}).`, "epoch");
    } else {
      STATE.guildTraining = null;
      STATE.job = j.id;
      STATE.jobRank = 0;
      STATE.jobPerformance = 50;
      const startRank = this.getJobRankLabel(j, 0);
      SoundFX.play("bells");
      this.addLog(`⚒️ NOVO OFÍCIO: Você ingressou no cargo inicial de **${startRank}** na carreira de **${j.name}**. Seu desempenho anual determinará suas promoções ou rebaixamentos!`, "good");
    }

    this.refreshVisibleJobActivities();
    this.ensureColleagues(true);
    Storage.saveToSlot(CONFIG.activeSlot);
    UI.renderAll();
  }
});
