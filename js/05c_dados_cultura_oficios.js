/* ============================================================================
   [DADOS · CULTURA, NOMES E GEOGRAFIA DE OFÍCIOS/ATIVIDADES] — v3.2.1
   ============================================================================ */
Object.assign(DATA, {
  /* ANTROPONÍMIA REGIONAL POR GRUPO CULTURAL */
  culturalNames: {
    oriente: {
      namesM: ["Wei", "Jian", "Liang", "Chen", "Hao", "Ren", "Kenji", "Haruki", "Takashi", "Daiki", "Kaito", "Shin", "Akira", "Taro", "Ryu"],
      namesF: ["Mei", "Lin", "Xiu", "Yan", "Hua", "Yuki", "Sakura", "Hana", "Aoi", "Akemi", "Kaori", "Rei", "Haruka", "Sora"],
      surnames: ["Li", "Wang", "Zhang", "Chen", "Liu", "Zhao", "Takeda", "Minamoto", "Fujiwara", "Hojo", "Ashikaga", "Mori", "Oda", "Shimazu"]
    },
    orientemedio: {
      namesM: ["Tariq", "Rashid", "Zayd", "Harun", "Malik", "Karim", "Darius", "Khosrow", "Rostam", "Cyrus", "Arjun", "Vikram", "Rajendra", "Dev"],
      namesF: ["Layla", "Yasmin", "Zahara", "Noor", "Amina", "Soraya", "Shirin", "Roxana", "Parisa", "Priya", "Ananya", "Devi", "Kavya"],
      surnames: ["al-Mansur", "ibn Sina", "al-Rashid", "al-Zahir", "Barmakid", "Suren", "Karen", "Mihran", "Chola", "Rajput", "Chalukya", "Varman"]
    },
    norte_leste: {
      namesM: ["Vladimir", "Yaroslav", "Rurik", "Oleg", "Sviatoslav", "Igor", "Boris", "Gleb", "Mstislav", "Vsevolod", "Dmitri", "Nikolai"],
      namesF: ["Olga", "Svetlana", "Mila", "Yelena", "Anastasia", "Daria", "Nadezhda", "Vasilisa", "Marfa", "Liudmila", "Rogneda"],
      surnames: ["Rurikovich", "Morozov", "Vorontsov", "Shuisky", "Belsky", "Volkonsky", "Golytsin", "Obolensky", "Novgorodsky", "Kholmsky"]
    },
    mediterraneo: {
      namesM: ["Lorenzo", "Marco", "Enrico", "Leonardo", "Matteo", "Niccolò", "Cesare", "Filippo", "Giacomo", "Dante", "Vittorio", "Pietro"],
      namesF: ["Bianca", "Lucrezia", "Caterina", "Beatrice", "Alessandra", "Sofia", "Giulia", "Francesca", "Chiara", "Isabella", "Contarina"],
      surnames: ["Contarini", "Morosini", "Dandolo", "Visconti", "Medici", "Doria", "Spinola", "Grimaldi", "Bardi", "Strozzi", "Colonna"]
    },
    ocidente: {
      namesM: DATA.namesM,
      namesF: DATA.namesF,
      surnames: DATA.surnames
    }
  },

  /* REGRAS GEOGRÁFICAS DE OFÍCIOS (v3.2.1) */
  jobLocalityRules: {
    crianca:        { tiers: ["vila", "cidade", "capital"], portable: true },
    servo:          { tiers: ["vila"],                      portable: false },
    campones:       { tiers: ["vila"],                      portable: false },
    lenhador:       { tiers: ["vila"],                      portable: false },
    mineiro:        { tiers: ["vila"],                      portable: false },
    pastor:         { tiers: ["vila"],                      portable: false },
    cacador:        { tiers: ["vila"],                      portable: true },
    curandeiro:     { tiers: ["vila"],                      portable: false },
    lavadeira:      { tiers: ["vila", "cidade"],            portable: false },
    parteira:       { tiers: ["vila", "cidade"],            portable: false },
    coveiro:        { tiers: ["vila", "cidade"],            portable: false },
    pescador:       { tiers: ["vila", "cidade"],            portable: false },
    moleiro:        { tiers: ["vila", "cidade"],            portable: false },
    bandido:        { tiers: ["vila", "cidade"],            portable: true },
    dancarina:      { tiers: ["vila", "cidade", "capital"], portable: false },
    ladrao:         { tiers: ["vila", "cidade", "capital"], portable: true },
    soldado:        { tiers: ["vila", "cidade", "capital"], portable: true },
    pirata:         { tiers: ["vila", "cidade", "capital"], portable: true, crossKingdom: true },
    monge:          { tiers: ["vila", "cidade", "capital"], portable: false },
    freira:         { tiers: ["vila", "cidade", "capital"], portable: false },
    explorador:     { tiers: ["vila", "cidade", "capital"], portable: true, crossKingdom: true },
    mercenario:     { tiers: ["vila", "cidade", "capital"], portable: true, crossKingdom: true },
    taverneiro:     { tiers: ["vila", "cidade", "capital"], portable: false },
    bardo:          { tiers: ["vila", "cidade", "capital"], portable: true, crossKingdom: true },
    clerigo:        { tiers: ["vila", "cidade", "capital"], portable: false },
    espiao:         { tiers: ["vila", "cidade", "capital"], portable: true },
    cavaleiro:      { tiers: ["vila", "cidade", "capital"], portable: true },
    escudeiro:      { tiers: ["vila", "cidade", "capital"], portable: true },
    artesao:        { tiers: ["cidade", "capital"],         portable: false },
    bordadeira:     { tiers: ["cidade", "capital"],         portable: false },
    ferreiro:       { tiers: ["cidade", "capital"],         portable: false },
    pedreiro:       { tiers: ["cidade", "capital"],         portable: false },
    alquimista:     { tiers: ["cidade", "capital"],         portable: false },
    ourives:        { tiers: ["cidade", "capital"],         portable: false },
    erudito:        { tiers: ["cidade", "capital"],         portable: false },
    medico:         { tiers: ["cidade", "capital"],         portable: false },
    inquisidor:     { tiers: ["cidade", "capital"],         portable: false },
    mercador:       { tiers: ["cidade", "capital"],         portable: true, crossKingdom: true },
    juiz:           { tiers: ["cidade", "capital"],         portable: false },
    bispo:          { tiers: ["cidade", "capital"],         portable: false },
    abadessa:       { tiers: ["capital"],                   portable: false },
    dama_companhia: { tiers: ["capital"],                   portable: false },
    falcoeiro:      { tiers: ["capital"],                   portable: false },
    diplomata:      { tiers: ["capital"],                   portable: true, crossKingdom: true },
    chanceler:           { tiers: ["capital"],                   portable: false },
    mandarim_imperial:   { tiers: ["vila", "cidade", "capital"], portable: true },
    forjador_katana:     { tiers: ["vila", "cidade", "capital"], portable: true },
    mestre_especiarias:  { tiers: ["vila", "cidade", "capital"], portable: true },
    mestre_caravanserai: { tiers: ["vila", "cidade", "capital"], portable: true },
    astronomo_al_zahra:  { tiers: ["vila", "cidade", "capital"], portable: true },
    vinhateiro_ducal:    { tiers: ["vila", "cidade", "capital"], portable: true },
    arqueiro_reais:      { tiers: ["vila", "cidade", "capital"], portable: true },
    cacador_peles_norte: { tiers: ["vila", "cidade", "capital"], portable: true },
    mestre_prata_alpino: { tiers: ["vila", "cidade", "capital"], portable: true },
    banqueiro_laguna:    { tiers: ["vila", "cidade", "capital"], portable: true }
  },

  /* REGRAS GEOGRÁFICAS DE ATIVIDADES (v3.2.1) */
  activityLocalityRules: {
    cacar_floresta:              ["vila"],
    cacar_lobos:                 ["vila"],
    ritual_folclore:             ["vila"],
    job_act_colheita_mutirao:    ["vila"],
    pescar_rio:                  ["vila", "cidade"],
    tecer_intriga:               ["cidade", "capital"],
    conspirar_golpe:             ["cidade", "capital"],
    auditar_guilda:              ["cidade", "capital"],
    julgar_pleitos:              ["cidade", "capital"],
    job_act_sarau_corte:         ["cidade", "capital"],
    job_act_audiencia_chancelaria: ["cidade", "capital"],
    job_act_auto_inquisicao:     ["cidade", "capital"]
  },

  /* MODOS DE VIAGEM (v3.4) */
  travelModes: [
    { id: "economico", name: "Marcha Econômica", icon: "🥾", goldMult: 0.75, vigorMult: 1.25, riskBonus: 0.30, desc: "A pé ou em carroça comum (+25% Vigor, -25% Ouro, maior risco na estrada)." },
    { id: "regular",   name: "Caravana Regular", icon: "🐪", goldMult: 1.00, vigorMult: 1.00, riskBonus: 0.00, desc: "Comboio mercante com paradas em estalagens (Custo e segurança equilibrados)." },
    { id: "escolta",   name: "Escolta Armorial", icon: "🛡️", goldMult: 1.50, vigorMult: 0.80, riskBonus: -0.35, honorBonus: 3, desc: "Guardas contratados e montarias de muda (-20% Vigor, +50% Ouro, segura e +3 Honra)." }
  ],

  /* ESPECIALIDADES E COMPARTILHAMENTOS DAS 12 CARREIRAS ITINERANTES (v3.4) */
  itinerantCareerMeta: {
    explorador: { badge: "🧭 Desbravador-Mor", travelGoldMult: 0.70, travelVigorMult: 0.80, discoveryBonusMult: 1.5, specId: "it_spec_explorador", specIcon: "🏛️", specTitle: "Sondar Ruínas & Relíquias Antigas", specSub: "-15 Vigor | Descoberta arqueológica (+Alto Desempenho, +Ouro e +Intelecto)", attr: "intelecto", diff: 54 },
    mercador:   { badge: "🐪 Grão-Mercador",   travelGoldMult: 0.78, travelVigorMult: 0.95, discoveryBonusMult: 1.3, specId: "it_spec_mercador",   specIcon: "⚖️", specTitle: "Arbitragem de Especiarias Regionais", specSub: "-10 Ouro, -13 Vigor | Lucra com câmbio entre comarcas (+Alto Ouro e Desempenho)", attr: "carisma", diff: 52, costGold: 10 },
    pirata:     { badge: "🏴‍☠️ Lobo dos Mares",  travelGoldMult: 0.75, travelVigorMult: 0.85, discoveryBonusMult: 1.2, specId: "it_spec_pirata",     specIcon: "⚓", specTitle: "Incursão de Corso Costeiro", specSub: "-16 Vigor | Saqueia rotas marítimas (+Alto Ouro e Desempenho, risco de Saúde)", attr: "forca", diff: 56 },
    mercenario: { badge: "⚔️ Lança-Livre",     travelGoldMult: 0.82, travelVigorMult: 0.85, discoveryBonusMult: 1.1, specId: "it_spec_mercenario", specIcon: "🩸", specTitle: "Contrato de Sangue & Escolta", specSub: "-15 Vigor | Vende proteção armada na comarca (+Ouro, +Desempenho e +Força)", attr: "forca", diff: 54 },
    bardo:      { badge: "🪕 Trovador Errante", travelGoldMult: 0.80, travelVigorMult: 0.90, discoveryBonusMult: 1.25, specId: "it_spec_bardo",     specIcon: "🎭", specTitle: "Cantar Crônicas de Terras Distantes", specSub: "-12 Vigor | Encanta a praça com relatos de viagem (+Ouro, +Rep e +Carisma)", attr: "carisma", diff: 50 },
    diplomata:  { badge: "🕊️ Emissário Régio", travelGoldMult: 0.75, travelVigorMult: 0.90, discoveryBonusMult: 1.35, specId: "it_spec_diplomata",  specIcon: "📜", specTitle: "Apresentar Credenciais & Salvo-Conduto", specSub: "-13 Vigor | Negocia imunidades e tratados (+Desempenho, +Honra e +Rep)", attr: "carisma", diff: 54 },
    cacador:    { badge: "🏹 Rastreador Real", travelGoldMult: 0.85, travelVigorMult: 0.75, discoveryBonusMult: 1.2, specId: "it_spec_cacador",    specIcon: "🦌", specTitle: "Abater Fera Rara da Comarca", specSub: "-14 Vigor | Caça troféus e peles exóticas (+Ouro, +Desempenho e +Destreza)", attr: "destreza", diff: 52 },
    bandido:    { badge: "🎭 Salteador Errante",travelGoldMult: 0.80, travelVigorMult: 0.85, discoveryBonusMult: 1.1, specId: "it_spec_bandido",   specIcon: "💰", specTitle: "Pedágio Clandestino na Encruzilhada", specSub: "-15 Vigor | Extorque caravanas na estrada (+Alto Ouro e Desempenho, -Honra)", attr: "forca", diff: 54 },
    ladrao:     { badge: "🌑 Sombra Itinerante",travelGoldMult: 0.85, travelVigorMult: 0.85, discoveryBonusMult: 1.1, specId: "it_spec_ladrao",    specIcon: "🗝️", specTitle: "Infiltrar Entreposto Mercantil", specSub: "-14 Vigor | Furta cofres de viajantes (+Ouro, +Desempenho e +Destreza)", attr: "destreza", diff: 54 },
    soldado:    { badge: "🛡️ Marchador de Linha",travelGoldMult: 0.85, travelVigorMult: 0.85, discoveryBonusMult: 1.1, specId: "it_spec_soldado",  specIcon: "🚩", specTitle: "Requisitar Suprimentos de Guarnição", specSub: "-13 Vigor | Inspeciona postos militares (+Desempenho, +Honra e +Força)", attr: "forca", diff: 50 },
    espiao:     { badge: "🕯️ Agente Encoberto", travelGoldMult: 0.78, travelVigorMult: 0.88, discoveryBonusMult: 1.3, specId: "it_spec_espiao",    specIcon: "🕸️", specTitle: "Plantar Célula de Informantes", specSub: "-13 Vigor | Intercepta segredos locais (+Alto Desempenho, +Ouro e +Intelecto)", attr: "intelecto", diff: 54 },
    cavaleiro:  { badge: "🏇 Cavaleiro Andante",travelGoldMult: 0.85, travelVigorMult: 0.85, discoveryBonusMult: 1.2, specId: "it_spec_cavaleiro",  specIcon: "⚜️", specTitle: "Desafio de Armas na Liça Local", specSub: "-15 Vigor | Defende a honra em justa pública (+Desempenho, +Honra e +Rep)", attr: "forca", diff: 56 },
    escudeiro:  { badge: "🛡️ Escudeiro de Estrada",travelGoldMult: 0.88, travelVigorMult: 0.85, discoveryBonusMult: 1.15, specId: "it_spec_escudeiro", specIcon: "🐎", specTitle: "Zelar Armas & Montarias da Comitiva", specSub: "-12 Vigor | Prepara o acampamento marcial (+Desempenho, +Honra e +Destreza)", attr: "destreza", diff: 48 }
  },

  /* OPORTUNIDADES E ESPECIALIDADES REGIONAIS POR REINO E POR CIDADE (v3.4) */
  kingdomSpecialties: {
    tianxia:      { name: "Feira Imperial da Seda e Porcelana", icon: "🐉", attr: "intelecto", diff: 50, costGold: 12, rewardGold: 34, bonusAttr: ["intelecto", 3], desc: "Negociar rolos de seda, chá imperial e tratados caligráficos." },
    yamato:       { name: "Forjas de Aço Tamahagane & Zen",     icon: "⛩️", attr: "destreza",  diff: 52, costGold: 12, rewardGold: 32, bonusAttr: ["destreza", 4],  desc: "Adquirir lâminas temperadas e meditar nos santuários insulares." },
    suvarnabhumi: { name: "Empório de Especiarias e Gemas",     icon: "🐘", attr: "carisma",   diff: 50, costGold: 14, rewardGold: 38, bonusAttr: ["sorte", 4],     desc: "Comerciar pimenta-do-reino, safiras e incensos reais." },
    parsa:        { name: "Caravanserai da Rota das Turquesas", icon: "🔥", attr: "intelecto", diff: 50, costGold: 12, rewardGold: 35, bonusAttr: ["carisma", 3],   desc: "Trocar tapetes persas, astrolábios e essências de rosas." },
    al_zahra:     { name: "Bazar de Aço Damasceno e Sabedoria", icon: "🌙", attr: "intelecto", diff: 50, costGold: 12, rewardGold: 35, bonusAttr: ["intelecto", 4], desc: "Adquirir lâminas adamascadas, elixires e códices científicos." },
    valois:       { name: "Grande Feira de Vinhos e Tapeçarias",icon: "⚜️", attr: "carisma",   diff: 48, costGold: 12, rewardGold: 32, bonusAttr: ["carisma", 4],   desc: "Negociar barris de safra ducal e brocados da corte." },
    albion:       { name: "Bolsa Real de Lã e Estanho",         icon: "🦁", attr: "forca",     diff: 48, costGold: 10, rewardGold: 30, bonusAttr: ["forca", 3],     desc: "Comerciar fardos de lã fina e arcos longos de teixo." },
    severnaya:    { name: "Entreposto de Peles de Marta e Âmbar",icon: "❄️", attr: "saude",    diff: 50, costGold: 10, rewardGold: 34, bonusAttr: ["saude", 4],     desc: "Negociar peles nobres do norte, cera e âmbar báltico." },
    teutonia:     { name: "Câmara de Prata e Armaria Imperial", icon: "🦅", attr: "forca",     diff: 50, costGold: 14, rewardGold: 36, bonusAttr: ["forca", 4],     desc: "Investir em lingotes de prata e couraças góticas." },
    serenissima:  { name: "Banco de Câmbio e Cristais da Laguna",icon: "🎭", attr: "carisma",  diff: 52, costGold: 15, rewardGold: 42, bonusAttr: ["sorte", 4],     desc: "Operar letras de câmbio marítimo e vidros de Murano." }
  },

  /* EVENTOS INTERATIVOS DE ESTRADA E MAR DURANTE VIAGENS (v3.4) */
  travelEvents: [
    {
      id: "tr_ev_pedagio_ponte",
      icon: "🌉",
      title: "[Jornada] A Ponte Fortificada do Desfiladeiro",
      desc: "Ao cruzar a garganta que leva a {city}, mercenários e cobradores de pedágio bloqueiam a passagem exigindo uma taxa extra sobre suas bagagens.",
      choices: [
        { label: "Impor autoridade e exigir passagem livre pelo seu nome e porte", attr: "carisma", diff: 50, ok: { gold: 20, honor: 5, msg: "Os guardas recuaram diante da sua presença e ainda ofereceram escolta (+20 Ouro, +5 Honra)!" }, fail: { gold: -15, honor: -2, msg: "Eles riram das suas ameaças e cobraram multa dobrada (-15 Ouro)." } },
        { label: "Guiar a comitiva por uma trilha íngreme de caçadores contornando o posto", attr: "destreza", diff: 48, ok: { attr: ["destreza", 4], gold: 15, msg: "Você descobriu um atalho seguro e encontrou alforjes abandonados (+15 Ouro, +4 Destreza)!" }, fail: { hp: -7, msg: "As pedras soltas feriram seus pés na descida (-7 Saúde)." } },
        { label: "Enfrentar os extorsionários de mão no punho da arma", attr: "forca", diff: 54, ok: { gold: 32, rep: 1, msg: "Você pôs os cobradores para correr e tomou o cofre do pedágio (+32 Ouro, +1 Rep)!" }, fail: { hp: -10, gold: -10, msg: "A escaramuça deixou contusões e perdas na bagagem (-10 Saúde, -10 Ouro)." } }
      ]
    },
    {
      id: "tr_ev_caravana_atolada",
      icon: "🐪",
      title: "[Jornada] Mercadores Sitiados na Estrada",
      desc: "No caminho para {city}, você avista a carruagem de um rico dignitário de {kingdom} com o eixo quebrado sob forte chuva e cercada por saqueadores.",
      choices: [
        { label: "Intervir de armas em punho para dispersar os salteadores", attr: "forca", diff: 52, ok: { gold: 38, honor: 7, rep: 1, msg: "O dignitário recompensou generosamente sua bravura ao chegar a {city} (+38 Ouro, +7 Honra, +1 Rep)!" }, fail: { hp: -9, msg: "Os bandidos fugiram, mas um virote de raspão atingiu seu ombro (-9 Saúde)." } },
        { label: "Consertar o eixo da carruagem e negociar uma partilha da carga", attr: "intelecto", diff: 48, ok: { gold: 28, attr: ["intelecto", 4], msg: "Seu engenho salvou as mercadorias e rendeu ótima comissão (+28 Ouro, +4 Intelecto)!" }, fail: { gold: -8, msg: "A madeira cedeu novamente e atrasou toda a viagem (-8 Ouro)." } },
        { label: "Aproveitar a confusão na neblina para saquear os baús sem ser visto", attr: "destreza", diff: 52, ok: { gold: 45, honor: -4, msg: "Suas mãos rápidas garantiram um belo espólio na estrada (+45 Ouro, -4 Honra)!" }, fail: { hp: -8, honor: -5, msg: "Os escoltas perceberam o vulto e você escapou ferido (-8 Saúde, -5 Honra)." } }
      ]
    },
    {
      id: "tr_ev_ruina_marco",
      icon: "🏛️",
      title: "[Jornada] O Marco Antigo Esquecido",
      desc: "À margem da rota para {city}, sua expedição encontra um santuário de pedra ancestral semiencoberto pela vegetação e inscrições antigas.",
      choices: [
        { label: "Decifrar as inscrições e mapear a câmara oculta sob o altar", attr: "intelecto", diff: 50, ok: { gold: 35, attr: ["intelecto", 5], msg: "Você encontrou moedas antigas e registrou a descoberta no seu Diário (+35 Ouro, +5 Intelecto)!" }, fail: { hp: -5, msg: "Poeira antiga e morcegos assustaram a comitiva (-5 Saúde)." } },
        { label: "Fazer uma prece e oferenda respeitosa antes de seguir viagem", attr: "fe", diff: 45, ok: { hp: 12, honor: 6, attr: ["sorte", 4], msg: "Uma serenidade revigorante abençoou sua chegada a {city} (+12 Saúde, +6 Honra, +4 Sorte)!" }, fail: { gold: -6, msg: "O vento apagou as velas e levou algumas moedas da oferenda (-6 Ouro)." } },
        { label: "Acampar nas ruínas para caçar e recuperar o fôlego da jornada", attr: "saude", diff: 46, ok: { hp: 10, gold: 18, msg: "O acampamento rendeu caça farta e descanso seguro (+10 Saúde, +18 Ouro)!" }, fail: { hp: -6, msg: "A umidade noturna das pedras trouxe febre passageira (-6 Saúde)." } }
      ]
    },
    {
      id: "tr_ev_tempestade_travessia",
      icon: "⛵",
      title: "[Jornada] Tormenta na Travessia",
      desc: "Ventos violentos e correntes traiçoeiras atingem sua rota rumo a {city} ({kingdom}), ameaçando lançar cargas e montarias pelo barranco ou mar.",
      choices: [
        { label: "Orientar o rumo pelos astros e sinais do vento com sangue-frio", attr: "intelecto", diff: 52, ok: { gold: 26, rep: 1, attr: ["intelecto", 4], msg: "Sua liderança salvou toda a caravana e impressionou os viajantes (+26 Ouro, +1 Rep)!" }, fail: { gold: -14, msg: "Parte dos suprimentos precisou ser alijada na tempestade (-14 Ouro)." } },
        { label: "Segurar os cabos e cargas no braço contra a fúria do temporal", attr: "forca", diff: 50, ok: { gold: 24, attr: ["saude", 4], msg: "Sua força bruta manteve os baús intactos até {city} (+24 Ouro, +4 Saúde)!" }, fail: { hp: -8, msg: "Um cabo chicoteou seus braços durante a tormenta (-8 Saúde)." } },
        { label: "Confiar na estrela da sua fortuna e avançar a toda velocidade", attr: "sorte", diff: 48, ok: { gold: 34, honor: 4, msg: "Uma abertura milagrosa no tempo permitiu chegar primeiro ao mercado de {city} (+34 Ouro)!" }, fail: { hp: -6, gold: -8, msg: "O atraso na lama custou provisões extras (-6 Saúde, -8 Ouro)." } }
      ]
    }
  ]
});

