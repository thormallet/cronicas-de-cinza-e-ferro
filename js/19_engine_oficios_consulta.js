/* ============================================================================
   [ENGINE · OFÍCIOS · CONSULTAS] — listas visíveis, hierarquia, rótulos, requisitos de promoção e ações dedicadas de cada ofício
   ============================================================================ */
Object.assign(Engine, {
  refreshVisibleJobsAndGuilds() {
    if (!STATE) return;
    const accessibleJobs = DATA.jobs.filter(j => this.isJobAccessibleForPlayer(j));
    const accessibleGuilds = accessibleJobs.filter(j => j.guildYears && j.guildYears > 0);

    const pickRandomIds = (list, currentId, maxCount = 10) => {
      const shuffled = [...list].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, maxCount).map(x => x.id);
      if (currentId && list.some(x => x.id === currentId) && !selected.includes(currentId)) {
        selected[0] = currentId;
      }
      return selected;
    };

    const curJobId = !STATE.guildTraining && STATE.job !== "crianca" ? STATE.job : null;
    const curGuildId = STATE.guildTraining ? STATE.guildTraining.jobId : null;

    STATE.visibleJobIds = pickRandomIds(accessibleJobs, curJobId, 10);
    STATE.visibleGuildIds = pickRandomIds(accessibleGuilds, curGuildId, 10);
    this.refreshVisibleJobActivities();
  },

  refreshVisibleJobActivities() {
    if (!STATE) return;
    const activeJobId = STATE.guildTraining ? STATE.guildTraining.jobId : STATE.job;
    if (!activeJobId || activeJobId === "crianca") {
      STATE.visibleJobActivityIds = [];
      return;
    }
    const matching = DATA.activities.filter(a =>
      a.jobPool &&
      STATE.age >= a.minAge &&
      STATE.age <= a.maxAge &&
      (!this.isActivityAllowedInCurrentCity || this.isActivityAllowedInCurrentCity(a.id)) &&
      (a.jobs.includes(activeJobId) || a.jobs.includes(STATE.socialClass))
    );
    const shuffled = [...matching].sort(() => Math.random() - 0.5);
    STATE.visibleJobActivityIds = shuffled.slice(0, 2).map(a => a.id);
  },

  hasActiveOccupation() {
    return (STATE.job && STATE.job !== "crianca") || !!STATE.guildTraining;
  },

  getGuildHierarchyRank() {
    if (!STATE.guildTraining) return "";
    const perf = STATE.jobPerformance || 50;
    const progress = (STATE.guildTraining.yearsDone || 0) / Math.max(1, STATE.guildTraining.yearsReq || 1);
    if (progress >= 0.5 && perf >= 65) return "Aprendiz Sênior (Companheiro)";
    return "Aprendiz Iniciante (Noviciato)";
  },

  getJobRankLabel(job = this.getJob(), rankIdx = STATE.jobRank || 0) {
    if (!job || job.id === "crianca") return "Sem Cargo";
    const ranks = job.ranks || [job.name];
    const safeIdx = Utils.clamp(rankIdx, 0, ranks.length - 1);
    return ranks[safeIdx];
  },

  getOccupationLabel() {
    if (STATE.guildTraining) {
      return `${this.getGuildHierarchyRank()} — ${STATE.guildTraining.guildName}`;
    }
    if (!STATE.job || STATE.job === "crianca") {
      return "Sem Ofício";
    }
    const job = this.getJob();
    const rankTitle = this.getJobRankLabel(job, STATE.jobRank || 0);
    return `${rankTitle} (${job.name})`;
  },

  /* REQUISITOS DE PROMOÇÃO ESCALONADOS CONFORME MAIS ALTO FOR O CARGO */
  getPromotionRequirements(rankIdx = STATE ? (STATE.jobRank || 0) : 0) {
    const reqPerf = Math.min(96, 76 + rankIdx * 5);
    const reqAttrDiff = Math.min(86, 52 + rankIdx * 7);
    const perfDecay = 4 + Math.floor(rankIdx * 1.5);
    return { reqPerf, reqAttrDiff, perfDecay };
  },

  /* CATÁLOGO DE AÇÕES DE DESEMPENHO E DEDICAÇÃO PERSONALIZADAS POR CATEGORIA DE OFÍCIO */
  getJobDedicatedActions() {
    if (!STATE || !this.hasActiveOccupation()) return [];
    const activeId = STATE.guildTraining ? STATE.guildTraining.jobId : STATE.job;
    const isGuild = !!STATE.guildTraining;

    const martialIds = ["soldado","mercenario","cavaleiro","escudeiro","falcoeiro"];
    const clergyIds = ["monge","freira","clerigo","abadessa","inquisidor","bispo"];
    const craftIds = ["artesao","bordadeira","ferreiro","pedreiro","ourives","moleiro","mineiro","lenhador","lavadeira","servo","campones","pastor"];
    const scholarIds = ["erudito","medico","alquimista","curandeiro","parteira","juiz","chanceler","diplomata"];
    const rogueIds = ["ladrao","bandido","pirata","espiao","coveiro"];
    const socialIds = ["bardo","dancarina","taverneiro","mercador","dama_companhia"];
    const explorerIds = ["explorador","cacador","pescador"];

    let specific = [];
    if (martialIds.includes(activeId)) {
      specific = [
        { id: "martial_drill", icon: "⚔️", title: "Manobras Táticas e Esgrima", sub: "-14 Vigor | Treino de formação (+Desempenho, +Força)", vigor: 14, gold: 0, attr: "forca", diff: 50 },
        { id: "armor_inspect", icon: "🛡️", title: "Inspecionar Arsenal e Montarias", sub: "-12 Vigor | Zelo militar (+Desempenho, +Honra)", vigor: 12, gold: 0, attr: "destreza", diff: 48 },
        { id: "lead_patrol", icon: "🏇", title: "Comandar Ronda de Fronteira", sub: "-18 Vigor | Risco marcial (+Alto Desempenho e Ouro)", vigor: 18, gold: 0, attr: "forca", diff: 58, highReward: true },
        { id: "special_trial", icon: "🚩", title: "Provação Especial: Batalha / Justa", sub: "-20 Vigor | Evento Tático de Comando em 3 Fases!", vigor: 20, gold: 0, isTrial: true }
      ];
    } else if (clergyIds.includes(activeId)) {
      specific = [
        { id: "clergy_vigil", icon: "🕯️", title: "Vigília de Salmos e Jejum", sub: "-14 Vigor | Devoção claustral (+Desempenho, +Fé)", vigor: 14, gold: 0, attr: "fe", diff: 48 },
        { id: "clergy_codex", icon: "📜", title: "Redigir Homilia e Códices", sub: "-14 Vigor | Erudição sacra (+Desempenho, +Intelecto)", vigor: 14, gold: 0, attr: "intelecto", diff: 52 },
        { id: "clergy_synod", icon: "⛪", title: "Auditar Dízimos e Paróquias", sub: "-16 Vigor | Ordem canônica (+Alto Desempenho e Honra)", vigor: 16, gold: 0, attr: "carisma", diff: 55, highReward: true },
        { id: "special_trial", icon: "⚖️", title: "Provação Especial: Disputatio / Sínodo", sub: "-18 Vigor | Evento Especial de Tribunal Eclesiástico!", vigor: 18, gold: 0, isTrial: true }
      ];
    } else if (craftIds.includes(activeId)) {
      specific = [
        { id: "craft_shift", icon: "🔨", title: "Jornada Dobrada na Bancada", sub: `-14 Vigor | Produção intensa (+Desempenho${isGuild ? '' : ', +Ouro'})`, vigor: 14, gold: 0, attr: "forca", diff: 48 },
        { id: "craft_precision", icon: "📐", title: "Refinar Acabamento de Mestre", sub: "-15 Vigor | Perfeição técnica (+Desempenho, +Destreza)", vigor: 15, gold: 0, attr: "destreza", diff: 52 },
        { id: "craft_raw", icon: "💎", title: "Selecionar Matéria-Prima Rara", sub: "-10 Ouro, -10 Vigor | Eleva qualidade (+Alto Desempenho)", vigor: 10, gold: 10, attr: "intelecto", diff: 46, highReward: true },
        { id: "special_trial", icon: "🏆", title: "Provação Especial: Grande Obra-Prima", sub: "-18 Vigor | Apresentar Obra-Prima ao Júri da Corporação!", vigor: 18, gold: 0, isTrial: true }
      ];
    } else if (scholarIds.includes(activeId)) {
      specific = [
        { id: "scholar_treatise", icon: "✒️", title: "Redigir Tratado Escolástico", sub: "-14 Vigor | Pesquisa profunda (+Desempenho, +Intelecto)", vigor: 14, gold: 0, attr: "intelecto", diff: 52 },
        { id: "scholar_practice", icon: "⚗️", title: "Atendimento e Experimentação", sub: `-15 Vigor | Prática aplicada (+Desempenho${isGuild ? '' : ', +Ouro'})`, vigor: 15, gold: 0, attr: "destreza", diff: 52 },
        { id: "scholar_debate", icon: "🏛️", title: "Sustentar Tese Magistral", sub: "-16 Vigor | Prestígio entre pares (+Alto Desempenho e Rep)", vigor: 16, gold: 0, attr: "carisma", diff: 56, highReward: true },
        { id: "special_trial", icon: "🩺", title: "Provação Especial: Caso Crítico da Corte", sub: "-18 Vigor | Operação / Julgamento de Alto Risco!", vigor: 18, gold: 0, isTrial: true }
      ];
    } else if (rogueIds.includes(activeId)) {
      specific = [
        { id: "rogue_scout", icon: "🌑", title: "Mapear Rotas e Vigias Noturnos", sub: "-13 Vigor | Reconhecimento furtivo (+Desempenho, +Destreza)", vigor: 13, gold: 0, attr: "destreza", diff: 50 },
        { id: "rogue_informants", icon: "🗡️", title: "Subornar Rede de Informantes", sub: "-8 Ouro, -10 Vigor | Segredos de rua (+Desempenho, +Intelecto)", vigor: 10, gold: 8, attr: "carisma", diff: 48 },
        { id: "rogue_heist", icon: "🏴‍☠️", title: "Golpe Audacioso na Calada", sub: "-18 Vigor | Alto risco (+Alto Desempenho e +Ouro)", vigor: 18, gold: 0, attr: "destreza", diff: 60, highReward: true },
        { id: "special_trial", icon: "🎭", title: "Provação Especial: Infiltração / Abordagem", sub: "-20 Vigor | Operação Clandestina em Múltiplas Etapas!", vigor: 20, gold: 0, isTrial: true }
      ];
    } else if (socialIds.includes(activeId)) {
      specific = [
        { id: "social_rehearse", icon: "🪕", title: "Ensaiar Repertório & Etiqueta", sub: "-13 Vigor | Graça e presença (+Desempenho, +Beleza/Carisma)", vigor: 13, gold: 0, attr: "beleza", diff: 48 },
        { id: "social_ledger", icon: "⚖️", title: "Negociar Acordos e Fornecedores", sub: `-14 Vigor | Trato mercantil (+Desempenho${isGuild ? '' : ', +Ouro'})`, vigor: 14, gold: 0, attr: "intelecto", diff: 50 },
        { id: "social_gala", icon: "🍷", title: "Anfitriar Noite de Gala / Degustação", sub: "-12 Ouro, -10 Vigor | Encanta patronos (+Alto Desempenho)", vigor: 10, gold: 12, attr: "carisma", diff: 50, highReward: true },
        { id: "special_trial", icon: "👑", title: "Provação Especial: Grande Sarau / Feira Real", sub: "-18 Vigor | Evento Especial Diante dos Grandes do Reino!", vigor: 18, gold: 0, isTrial: true }
      ];
    } else if (explorerIds.includes(activeId)) {
      specific = [
        { id: "exp_chart", icon: "🗺️", title: "Cartografar Rotas e Passagens", sub: `-13 Vigor | Mapear terreno (+Desempenho, +Intelecto)`, vigor: 13, gold: 0, attr: "intelecto", diff: 50 },
        { id: "exp_forage", icon: "🏹", title: "Desbravar Ermos e Suprimentos", sub: `-14 Vigor | Sobrevivência (+Desempenho${isGuild ? '' : ', +Ouro'})`, vigor: 14, gold: 0, attr: "destreza", diff: 52 },
        { id: "exp_escort", icon: "🧭", title: "Guiar Expedição de Fronteira", sub: "-16 Vigor | Alto risco nos ermos (+Alto Desempenho e Ouro)", vigor: 16, gold: 0, attr: "saude", diff: 56, highReward: true },
        { id: "special_trial", icon: "🏔️", title: "Provação Especial: Grande Expedição", sub: "-18 Vigor | Jornada Tática de Desbravamento em 3 Fases!", vigor: 18, gold: 0, isTrial: true }
      ];
    }

    const itMeta = (DATA.itinerantCareerMeta && DATA.itinerantCareerMeta[activeId]) ? DATA.itinerantCareerMeta[activeId] : null;
    if (itMeta) {
      specific.unshift(
        {
          id: itMeta.specId,
          icon: itMeta.specIcon,
          title: `[Especialidade] ${itMeta.specTitle}`,
          sub: itMeta.specSub,
          vigor: 14,
          gold: itMeta.costGold || 0,
          attr: itMeta.attr,
          diff: itMeta.diff,
          highReward: true,
          isItinerantSpec: true
        },
        {
          id: "it_shared_route",
          icon: "🧭",
          title: "[Itinerante] Reconhecer Rotas & Entrepostos",
          sub: `-12 Vigor | Função compartilhada (+Desempenho, +Intelecto${isGuild ? "" : ", +Ouro"})`,
          vigor: 12,
          gold: 0,
          attr: "intelecto",
          diff: 48,
          isItinerantShared: true
        },
        {
          id: "it_shared_commission",
          icon: "📜",
          title: "[Itinerante] Cumprir Encomenda da Comarca",
          sub: `-14 Vigor | Contrato móvel local (+Alto Desempenho${isGuild ? "" : ", +Ouro por Cidades Visitadas"})`,
          vigor: 14,
          gold: 0,
          attr: "carisma",
          diff: 52,
          highReward: true,
          isItinerantShared: true
        }
      );
    }

    specific.push({
      id: "please_masters",
      icon: "🎁",
      title: "Presentear Superiores e Síndicos",
      sub: "-12 Ouro, -8 Vigor | Cultiva influência política na hierarquia",
      vigor: 8,
      gold: 12,
      attr: "carisma",
      diff: 42
    });

    return specific;
  },

  isJobAccessibleForPlayer(job, ignoreCityTier = false) {
    if (!job || job.id === "crianca" || job.titular) return false;
    const tiers = job.tiers || ["plebeu", "media", "nobre"];
    if (!tiers.includes(STATE.socialClass)) return false;
    if (job.gender && job.gender !== "any" && job.gender !== STATE.sex) return false;
    if (!ignoreCityTier && this.isJobAllowedInCityTier) {
      const curCity = this.getCityObj ? this.getCityObj(STATE.currentCityId, STATE.kingdom) : { tier: "capital" };
      if (!this.isJobAllowedInCityTier(job.id, curCity.tier)) return false;
    }
    return true;
  },

  getJobMobilityCost(job) {
    let baseCost = job.cost || 0;
    if (job.transitionTo && job.transitionTo !== STATE.socialClass) {
      baseCost = Math.round(baseCost * 1.35) + 25;
    }
    return baseCost;
  },

  completeGuildTraining() {
    if (!STATE.guildTraining) return;
    this.ensureVigorFields();
    const targetJob = DATA.jobs.find(x => x.id === STATE.guildTraining.jobId);
    const guildName = STATE.guildTraining.guildName;
    if (targetJob && !STATE.completedGuilds.includes(targetJob.id)) {
      STATE.completedGuilds.push(targetJob.id);
    }
    STATE.guildTraining = null;
    if (!targetJob) return;

    STATE.job = targetJob.id;
    STATE.jobRank = 0;
    STATE.jobPerformance = Math.max(55, STATE.jobPerformance);
    const initialRank = this.getJobRankLabel(targetJob, 0);
    SoundFX.play("bells");

    if (targetJob.transitionTo && targetJob.transitionTo !== STATE.socialClass && this.getClassRankValue(targetJob.transitionTo) > this.getClassRankValue(STATE.socialClass)) {
      const oldClass = STATE.socialClass;
      this.setFamilySocialClass(
        targetJob.transitionTo,
        `Você concluiu com honras o treinamento na ${guildName}, ingressou no cargo inicial de ${initialRank} (${targetJob.name}) e elevou sua família de ${this.getClassLabel(oldClass)} para ${this.getClassLabel(targetJob.transitionTo)}!`
      );
    } else {
      this.addLog(`🎓 INVESTIDURA NA GUILDA: Após cumprir o aprendizado sob os Mestres da **${guildName}**, você ingressou no cargo inicial de **${initialRank}** na carreira de **${targetJob.name}**!`, "epoch");
    }
    this.refreshVisibleJobActivities();
    this.ensureColleagues(true);
  }
});
