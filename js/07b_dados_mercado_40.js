/* ============================================================================
   [DADOS · MERCADO, BENS E SISTEMA FINANCEIRO 4.0] — bens, frotas, estados e leis
   ============================================================================ */
Object.assign(DATA, {
  items: [
    /* 1. IMÓVEIS E PROPRIEDADES (10) */
    { id: "casebre_madeira", name: "🏚️ Casebre de Madeira", category: "propriedade", type: "imovel", stackable: true, price: 40, income: 0, upkeep: 1, condition: "novo", originKingdom: "severnaya", comarca: "vila", bonus: { saude: 2 }, regionalMult: { severnaya: 0.8 }, useLabel: "Reparar Telhado & Horta", desc: "Abrigo contra o Inverno Rigoroso. Uso anual: cultiva horta doméstica (+3 Saúde, +4 Ouro)." },
    { id: "casa_urbana", name: "🏠 Casa Urbana no Burgo", category: "propriedade", type: "imovel", stackable: true, price: 120, income: 6, upkeep: 2, condition: "novo", originKingdom: "teutonia", comarca: "cidade", bonus: { carisma: 3 }, regionalMult: { teutonia: 0.9 }, useLabel: "Receber Mercadores", desc: "Abrigo seguro contra Inverno e Peste (+10 resist.). Uso anual: reunião burguesa (+10 Ouro, +3 Carisma)." },
    { id: "oficina_artesao", name: "🔨 Oficina com Forja", category: "propriedade", type: "imovel", stackable: true, price: 180, income: 24, upkeep: 4, condition: "novo", originKingdom: "teutonia", comarca: "cidade", bonus: { destreza: 4 }, regionalMult: { teutonia: 0.85 }, useLabel: "Turno Extra de Produção", desc: "+6 Desempenho anual e +30% lucro em ofícios artesanais e Forjar Equipamento. Uso: encomenda especial (+18 Ouro)." },
    { id: "moinho_vento", name: "🌬️ Moinho de Vento na Colina", category: "propriedade", type: "imovel", stackable: true, price: 240, income: 32, upkeep: 6, condition: "novo", originKingdom: "albion", comarca: "vila", bonus: {}, regionalMult: { albion: 0.9 }, useLabel: "Moer Safra Comunal", desc: "Imunidade à Fome em eventos de época e +6 Desempenho agrícola. Uso: cobrar taxa de moagem (+22 Ouro)." },
    { id: "taverna_porto", name: "🍺 Estalagem do Porto", category: "propriedade", type: "imovel", stackable: true, price: 320, income: 45, upkeep: 10, condition: "novo", originKingdom: "serenissima", comarca: "cidade", bonus: { carisma: 6 }, regionalMult: { serenissima: 0.9 }, useLabel: "Promover Noite de Jogos", desc: "Custo zero e +50% lucro em Taverna, Jogos de Azar e Festejos. Uso: noite de gala na estalagem (+26 Ouro, +1 Rep)." },
    { id: "terra_aravel", name: "🌾 Alódio de Terras Aráveis", category: "propriedade", type: "imovel", stackable: true, price: 420, income: 60, upkeep: 12, condition: "novo", originKingdom: "valois", comarca: "vila", bonus: {}, regionalMult: { valois: 0.9 }, useLabel: "Supervisionar Colheita", desc: "Imunidade à Fome, +25 Ouro na Colheita Dourada e requisito feudal. Uso: colheita direta (+30 Ouro, +3 Saúde)." },
    { id: "solar_nobre", name: "🏰 Solar Senhorial Fortificado", category: "propriedade", type: "imovel", stackable: true, price: 900, income: 130, upkeep: 28, condition: "novo", originKingdom: "valois", comarca: "cidade", bonus: { carisma: 12, saude: 8 }, regionalMult: { valois: 0.95 }, useLabel: "Dar Recepção Fidalga", desc: "Isolamento sanitário contra a Peste, -40% custo em Banquetes e +10 Afinidade em cortejos. Uso: recepção (+2 Honra, +20 Ouro)." },
    { id: "forte_fronteira", name: "🛡️ Forte Militar de Fronteira", category: "propriedade", type: "imovel", stackable: true, price: 1600, income: 190, upkeep: 45, condition: "novo", originKingdom: "severnaya", comarca: "vila", bonus: { forca: 15, destreza: 8 }, regionalMult: { severnaya: 0.9 }, useLabel: "Passar Tropas em Revista", desc: "+5 Defesa anual no Feudo, reduz motins e dá bônus em Guerra/Cerco. Uso: cobrar pedágio militar (+35 Ouro, +3 Honra)." },
    { id: "castelo_feudal", name: "🏯 Castelo Feudal com Fosso", category: "propriedade", type: "imovel", stackable: true, price: 3500, income: 450, upkeep: 110, condition: "novo", originKingdom: "teutonia", comarca: "capital", bonus: { carisma: 20, forca: 15 }, regionalMult: { teutonia: 0.95 }, useLabel: "Realizar Corte Feudal", desc: "+8 Defesa anual no Feudo, proteção máxima na Peste e prestígio em Torneios. Uso: audiência senhorial (+45 Ouro, +4 Honra)." },
    { id: "palacio_real", name: "👑 Palácio Ducal de Mármore", category: "propriedade", type: "imovel", stackable: true, price: 8000, income: 1100, upkeep: 280, condition: "novo", originKingdom: "serenissima", comarca: "capital", bonus: { carisma: 35, beleza: 25 }, regionalMult: { serenissima: 0.9 }, useLabel: "Grande Gala Imperial", desc: "Ápice do poder dinástico: -50% custo em Banquetes/Torneios e +15 Afinidade na Corte. Uso: gala real (+65 Ouro, +5 Honra, +1 Rep)." },

    /* 2. MONTARIAS E EMBARCAÇÕES (5) */
    { id: "cavalo_carga", name: "🐴 Cavalo de Carga", category: "transporte", type: "montaria", stackable: true, price: 65, income: 0, upkeep: 3, condition: "novo", originKingdom: "severnaya", comarca: "vila", bonus: { forca: 4 }, regionalMult: { severnaya: 0.9 }, useLabel: "Fretar Carga Local", desc: "-15% Ouro e -3 Vigor em viagens entre comarcas e +25% lucro em Caravanas. Uso: frete rápido (+10 Ouro)." },
    { id: "cavalo_guerra", name: "🐎 Destriero Pesado de Guerra", category: "transporte", type: "montaria", stackable: true, price: 220, income: 0, upkeep: 9, condition: "novo", originKingdom: "valois", comarca: "cidade", bonus: { forca: 12, carisma: 8 }, regionalMult: { valois: 0.9 }, useLabel: "Treinar Carga de Lança", desc: "-25% Ouro e -6 Vigor em viagens; +15 bônus em Torneios (Justas) e Guerra. Uso: treino montado (+3 Força, +2 Honra)." },
    { id: "carruagem_luxo", name: "🎠 Carruagem Nobre Entalhada", category: "transporte", type: "veiculo", stackable: true, price: 380, income: 0, upkeep: 14, condition: "novo", originKingdom: "valois", comarca: "capital", bonus: { carisma: 14, beleza: 10 }, regionalMult: { valois: 0.9 }, useLabel: "Passeio Triunfal", desc: "Isenta custo de família nas viagens, -8 Vigor gasto e +3 Honra ao chegar em cidades. Uso: passeio na praça (+3 Carisma, +2 Honra)." },
    { id: "barco_pesca", name: "🛶 Barcaça Costeira", category: "transporte", type: "embarcacao", stackable: true, price: 90, income: 8, upkeep: 2, condition: "novo", originKingdom: "albion", comarca: "vila", bonus: { destreza: 3 }, regionalMult: { albion: 0.9 }, useLabel: "Lançar Redes ao Largo", desc: "+18 Ouro extra em Pescar no Rio e descontos em rotas costeiras. Uso: expedição pesqueira (+16 Ouro, +2 Saúde)." },
    { id: "navio_mercante", name: "⛵ Nau Mercante Armada", category: "transporte", type: "embarcacao", stackable: true, price: 850, income: 95, upkeep: 22, condition: "novo", originKingdom: "serenissima", comarca: "capital", bonus: { carisma: 10, intelecto: 8 }, regionalMult: { serenissima: 0.85 }, useLabel: "Despachar Expedição", desc: "-45% Ouro e -12 Vigor em Viagens entre Reinos; dobra lucro em Caravana e Saque Naval. Uso: frete marítimo (+42 Ouro)." },

    /* 3. ARMAS (4) */
    { id: "adaga_ferro", name: "🗡️ Adaga de Ferro Temperado", category: "equipamento", type: "arma", stackable: false, price: 25, income: 0, upkeep: 0, condition: "novo", originKingdom: "teutonia", comarca: "vila", bonus: { destreza: 6 }, regionalMult: {}, useLabel: "Treinar Golpe Furtivo", desc: "+10% dano em Provações Táticas e bônus em Duelo Clandestino e Assaltos. Uso: treino de reflexos (+2 Destreza)." },
    { id: "arco_composto", name: "🏹 Arco Composto Laminado", category: "equipamento", type: "arma", stackable: false, price: 60, income: 0, upkeep: 1, condition: "novo", originKingdom: "albion", comarca: "vila", bonus: { destreza: 12 }, regionalMult: { albion: 0.85 }, useLabel: "Praticar Tiro ao Alvo", desc: "+15% dano em Provações e grande vantagem em Caçar na Floresta e Caçar Lobos. Uso: caçada rápida (+12 Ouro, +2 Destreza)." },
    { id: "espada_longa", name: "⚔️ Espada Longa de Aço", category: "equipamento", type: "arma", stackable: false, price: 95, income: 0, upkeep: 2, condition: "novo", originKingdom: "teutonia", comarca: "cidade", bonus: { forca: 14 }, regionalMult: { teutonia: 0.9 }, useLabel: "Treinar Esgrima", desc: "+18% dano em Batalhas, Duelos de Honra e Torneios. Uso: treino de armas (+2 Força, +2 Honra)." },
    { id: "lamina_damasco", name: "✨ Lâmina Curva de Damasco", category: "equipamento", type: "arma", stackable: false, price: 280, income: 0, upkeep: 3, condition: "novo", originKingdom: "al_zahra", comarca: "capital", bonus: { destreza: 18, forca: 10 }, regionalMult: { al_zahra: 0.8 }, useLabel: "Polir e Testar Fio", desc: "+25% dano crítico em Batalhas, Duelos e Provações Marciais. Uso: exibição magistral (+3 Força, +2 Destreza, +3 Honra)." },

    /* 4. ARMADURAS (3) */
    { id: "gibao_couro", name: "🧥 Gibão de Couro Fervido", category: "equipamento", type: "armadura", stackable: false, price: 40, income: 0, upkeep: 0, condition: "novo", originKingdom: "valois", comarca: "vila", bonus: { saude: 6, destreza: 2 }, regionalMult: {}, useLabel: "Ajustar Correias", desc: "Reduz em 20% o dano sofrido em combates, caçadas, assaltos e provações. Uso: marcha leve (+3 Saúde)." },
    { id: "cota_malha", name: "🛡️ Cota de Malha Rebitada", category: "equipamento", type: "armadura", stackable: false, price: 130, income: 0, upkeep: 3, condition: "novo", originKingdom: "teutonia", comarca: "cidade", bonus: { saude: 14 }, regionalMult: { teutonia: 0.9 }, useLabel: "Lubrificar Anéis", desc: "Reduz em 40% o dano sofrido em batalhas, duelos e torneios. Uso: treino de resistência (+3 Saúde, +2 Força)." },
    { id: "armadura_placas", name: "🪖 Arnês Completo de Placas", category: "equipamento", type: "armadura", stackable: false, price: 480, income: 0, upkeep: 8, condition: "novo", originKingdom: "teutonia", comarca: "capital", bonus: { saude: 25, forca: 6 }, regionalMult: { teutonia: 0.85 }, useLabel: "Envergar Arnês Completo", desc: "Reduz em 60% todo dano em combate e impede cicatrizes graves em duelos. Uso: parada militar (+4 Honra, +3 Saúde)." },

    /* 5. INSTRUMENTOS (3) */
    { id: "flauta_osso", name: "🎵 Flauta Pastoril de Osso", category: "equipamento", type: "instrumento", stackable: false, price: 20, income: 0, upkeep: 0, condition: "novo", originKingdom: "severnaya", comarca: "vila", bonus: { carisma: 4 }, regionalMult: {}, useLabel: "Tocar Melodia Popular", desc: "+6 Afinidade ao Cortejar/Seduzir e bônus em Compor Balada. Uso: tocar na praça (+8 Ouro, +2 Carisma)." },
    { id: "alaude_nobre", name: "🪕 Alaúde de Ébano e Madrepérola", category: "equipamento", type: "instrumento", stackable: false, price: 110, income: 0, upkeep: 1, condition: "novo", originKingdom: "serenissima", comarca: "cidade", bonus: { carisma: 12, beleza: 6 }, regionalMult: { serenissima: 0.9 }, useLabel: "Tocar Serenata Cortês", desc: "+12 Afinidade ao Cortejar/Seduzir e +20 Ouro em Saraus e Baladas. Uso: serenata nobre (+14 Ouro, +3 Carisma)." },
    { id: "harpa_dourada", name: "🎶 Harpa Barroca Talhada", category: "equipamento", type: "instrumento", stackable: false, price: 340, income: 0, upkeep: 4, condition: "novo", originKingdom: "valois", comarca: "capital", bonus: { carisma: 20, beleza: 12 }, regionalMult: { valois: 0.9 }, useLabel: "Concerto de Salão", desc: "+18 Afinidade ao Cortejar/Seduzir e dobra prestígio em Banquetes e Saraus. Uso: recital régio (+22 Ouro, +3 Carisma, +2 Honra)." },

    /* 6. FERRAMENTAS (3) */
    { id: "ferramentas_mestre", name: "🛠️ Estojo de Ferramentas de Mestre", category: "equipamento", type: "ferramenta", stackable: false, price: 75, income: 0, upkeep: 1, condition: "novo", originKingdom: "teutonia", comarca: "cidade", bonus: { destreza: 8, intelecto: 4 }, regionalMult: { teutonia: 0.9 }, useLabel: "Calibrar Instrumentos", desc: "+5 Desempenho em ações de ofício e +20 Ouro em Forjar Equipamento. Uso: reparo autônomo (+15 Ouro, +2 Destreza)." },
    { id: "astrolabio_bronze", name: "🧭 Astrolábio de Bronze Náutico", category: "equipamento", type: "ferramenta", stackable: false, price: 160, income: 0, upkeep: 2, condition: "novo", originKingdom: "al_zahra", comarca: "capital", bonus: { intelecto: 14 }, regionalMult: { al_zahra: 0.85 }, useLabel: "Traçar Carta Celeste", desc: "-20% custo de viagem, +15 Ouro ao explorar comarcas e +5 Desempenho acadêmico. Uso: leitura astral (+3 Intelecto, +2 Sorte)." },
    { id: "alambique_alquimia", name: "⚗️ Alambique e Serpentina de Cobre", category: "equipamento", type: "ferramenta", stackable: false, price: 210, income: 0, upkeep: 3, condition: "novo", originKingdom: "parsa", comarca: "cidade", bonus: { intelecto: 16 }, regionalMult: { parsa: 0.9 }, useLabel: "Destilar Elixir Vital", desc: "+10 HP extra em Cuidar da Saúde e Tratar Doentes, e +5 Desempenho médico/alquímico. Uso: destilar tônico (+8 Saúde, +14 Ouro)." },

    /* 7. RELÍQUIAS E LUXO (4) */
    { id: "espelho_veneziano", name: "🪞 Espelho de Cristal Veneziano", category: "luxo", type: "reliquia", stackable: false, price: 85, income: 0, upkeep: 1, condition: "novo", originKingdom: "serenissima", comarca: "cidade", bonus: { beleza: 14, carisma: 6 }, regionalMult: { serenissima: 0.8 }, useLabel: "Ritual de Beleza Real", desc: "+4 Beleza extra em Banho Perfumado e preserva a juventude no envelhecimento. Uso: tratamento estético (+3 Beleza, +2 Carisma)." },
    { id: "grimorio_latim", name: "📕 Códice Iluminado em Latim", category: "luxo", type: "reliquia", stackable: false, price: 125, income: 0, upkeep: 1, condition: "novo", originKingdom: "valois", comarca: "capital", bonus: { intelecto: 16 }, regionalMult: { valois: 0.9 }, useLabel: "Estudar Tratado Antigo", desc: "+3 Intelecto e +20 Ouro extra em Estudar Manuscritos e Heresia. Uso: decifrar capítulos (+3 Intelecto)." },
    { id: "reliquia_santa", name: "⚱️ Relicário de Santo Mártir", category: "luxo", type: "reliquia", stackable: false, price: 175, income: 0, upkeep: 1, condition: "novo", originKingdom: "suvarnabhumi", comarca: "capital", bonus: { fe: 18, sorte: 10 }, regionalMult: { suvarnabhumi: 0.9 }, useLabel: "Fazer Vigília Devota", desc: "+5 Honra e +8 Saúde em Orar, Peregrinação e Caridade; protege contra a Peste. Uso: bênção do relicário (+3 Fé, +3 Honra, +5 Saúde)." },
    { id: "coroa_colecionador", name: "👑 Coroa de Filigrana e Safiras", category: "luxo", type: "reliquia", stackable: false, price: 650, income: 0, upkeep: 6, condition: "novo", originKingdom: "tianxia", comarca: "capital", bonus: { carisma: 24, beleza: 16 }, regionalMult: { tianxia: 0.9 }, useLabel: "Exibir Tesouro Dinástico", desc: "+2 Influência anual no Feudo e +15 Afinidade com membros da Corte Real. Uso: exposição solene (+4 Honra, +1 Rep)." }
  ],

  /* ESTADOS DE CONSERVAÇÃO DE BENS */
  itemStates: {
    novo:       { label: "Novo", multValue: 1.0, multPerf: 1.0, incomeMult: 1.0, integrity: 100, decayRate: 0.05 },
    bom:        { label: "Bom", multValue: 0.8, multPerf: 0.9, incomeMult: 0.9, integrity: 80, decayRate: 0.08 },
    desgastado: { label: "Desgastado", multValue: 0.5, multPerf: 0.7, incomeMult: 0.6, integrity: 40, decayRate: 0.12 },
    arruinado:  { label: "Arruinado", multValue: 0.0, multPerf: 0.0, incomeMult: 0.0, integrity: 0, decayRate: 0.20 }
  },

  /* PATAMARES DE CLASSE SOCIAL POR PATRIMÔNIO */
  socialClassThresholds: {
    miseravel: { minWealth: 0, label: "Miserável", minRep: -99, desc: "Vive na extrema penúria sem propriedades ou reservas." },
    plebeu:    { minWealth: 60, label: "Plebeu", minRep: 0, desc: "Trabalhador livre com moradia alugada ou poupança modesta." },
    burgues:   { minWealth: 350, label: "Burguês", minRep: 2, desc: "Mestre artífice ou mercador com posses urbanas e capital de giro." },
    patricio:  { minWealth: 1200, label: "Patrício", minRep: 4, desc: "Grande proprietário e elite financeira de cidades e guildas." },
    nobre:     { minWealth: 3000, label: "Nobre", minRep: 6, desc: "Senhor de terras férteis, solares ou castelos com títulos hereditários." }
  },

  /* REQUISITOS DE POSSES PARA TÍTULOS DE NOBREZA (1 A 5) */
  noblePossessionReqs: {
    1: { minHonor: 65, minRep: 3, minOrder: 50, minEconomy: 50, minWealth: 600, minProperties: 1, allowedCategories: ["propriedade", "transporte"], desc: "Grau 1 (Fidalgo de Solar): exige ao menos 1 propriedade, Honra 65, Reputação 3, Ordem 50, Economia 50 e 600 moedas em patrimônio." },
    2: { minHonor: 70, minRep: 5, minOrder: 55, minEconomy: 55, minWealth: 1200, minProperties: 2, allowedCategories: ["propriedade", "transporte"], desc: "Grau 2 (Barão Feudal): exige ao menos 2 propriedades sólidas, Honra 70, Reputação 5, Ordem 55, Economia 55 e 1.200 moedas em patrimônio." },
    3: { minHonor: 75, minRep: 6, minOrder: 60, minEconomy: 60, minWealth: 2500, minProperties: 3, allowedCategories: ["propriedade", "transporte"], desc: "Grau 3 (Visconde): exige ao menos 3 propriedades produtivas, Honra 75, Reputação 6, Ordem 60, Economia 60 e 2.500 moedas em bens." },
    4: { minHonor: 80, minRep: 7, minOrder: 65, minEconomy: 65, minWealth: 5000, minProperties: 4, allowedCategories: ["propriedade", "transporte"], desc: "Grau 4 (Conde Palatino): exige ao menos 4 propriedades, Honra 80, Reputação 7, Ordem 65, Economia 65 e 5.000 moedas em terras e frotas." },
    5: { minHonor: 85, minRep: 8, minOrder: 70, minEconomy: 70, minWealth: 10000, minProperties: 5, allowedCategories: ["propriedade", "transporte"], desc: "Grau 5 (Duque de Sangue): exige ao menos 5 propriedades com castelo ou solar, Honra 85, Reputação 8, Ordem 70, Economia 70 e 10.000 moedas." }
  },

  /* REGRAS DE REVOGAÇÃO DE NOBREZA */
  nobilityRevocationRules: {
    minHonor: 20,
    minRep: -5,
    consecutiveYears: 3,
    lesaMajestade: true,
    desc: "Perda e revogação de privilégios nobiliárquicos ocorrem após 3 anos consecutivos com Honra < 20 ou Reputação < -5, ou imediatamente sob crime de lesa-majestade."
  },

  /* CREDORES DE EMPRÉSTIMO */
  loanCreditors: {
    agiotas_beco:    { name: "Agiotas do Beco Escuro", maxLoan: 100, interestRate: 0.25, penaltyRisk: 0.35, desc: "Moedas fáceis sem garantia, mas com juros predatórios e capangas impiedosos." },
    cambistas_corte: { name: "Cambistas e Mercadores da Corte", maxLoan: 450, interestRate: 0.15, penaltyRisk: 0.15, desc: "Crédito mercantil lastreado em fiança com cobrança moderada." },
    casa_bancaria:   { name: "Grande Casa Bancária da Laguna", maxLoan: 2000, interestRate: 0.08, penaltyRisk: 0.05, desc: "Grandes linhas de crédito com taxas institucionais e garantia hipotecária." }
  },

  /* CLIENTES DE BANQUEIRO (QUANDO O PROTAGONISTA EMPRESTA) */
  bankerClients: {
    mercador_aventureiro: { name: "Mercador Aventureiro", loanAmount: 150, returnRate: 0.20, defaultRisk: 0.25, desc: "Financiamento para viagem arriscada com potencial de alto retorno ou calote marítimo." },
    barao_endividado:     { name: "Barão Endividado", loanAmount: 500, returnRate: 0.12, defaultRisk: 0.15, desc: "Fidalgo que oferece safras futuras como caução para sustentar seus luxos." },
    coroa_real:           { name: "Tesouro da Coroa Real", loanAmount: 1500, returnRate: 0.08, defaultRisk: 0.05, desc: "Empréstimo régio para campanha militar, garantido por arrecadação tributária." }
  },

  /* LEIS DE SUCESSÃO FAMILIAR */
  successionLaws: {
    primogenitura: { name: "Primogenitura Feudal", splitPercent: 0.85, claimCost: 30, desc: "O herdeiro primogênito recebe 85% de terras e tesouro, preservando a grandeza da casa." },
    partilha:      { name: "Partilha Igualitária", splitPercent: 0.40, claimCost: 15, desc: "O patrimônio é dividido entre todos os filhos vivos, diluindo fortunas e títulos." },
    designada:     { name: "Sucessão Designada por Testamento", splitPercent: 0.70, claimCost: 50, desc: "O testador nomeia livremente o herdeiro principal mediante custas testamentárias." }
  }
});
