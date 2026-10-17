/* ============================================================================
   [DADOS · MERCADO, BENS E SISTEMA FINANCEIRO 4.0] — bens, frotas, estados e leis
   ============================================================================ */
Object.assign(DATA, {
  items: [
    /* 1. IMÓVEIS E PROPRIEDADES (10) */
    { id: "casebre_madeira", name: "🏚️ Casebre de Madeira", category: "propriedade", type: "imovel", stackable: false, price: 40, income: 0, upkeep: 1, bonus: { saude: 2 }, regionalMult: { severnaya: 0.8 }, desc: "Abrigo rústico contra o vento cortante e geadas." },
    { id: "casa_urbana", name: "🏠 Casa Urbana no Burgo", category: "propriedade", type: "imovel", stackable: false, price: 120, income: 6, upkeep: 2, bonus: { carisma: 3 }, regionalMult: { teutonia: 0.9 }, desc: "Morada sólida de pedra situada no centro do burgo." },
    { id: "oficina_artesao", name: "🔨 Oficina com Forja", category: "propriedade", type: "imovel", stackable: false, price: 180, income: 24, upkeep: 4, bonus: { destreza: 4 }, regionalMult: { teutonia: 0.85 }, desc: "Espaço produtivo equipado com bigorna e bancadas de ofício." },
    { id: "moinho_vento", name: "🌬️ Moinho de Vento na Colina", category: "propriedade", type: "imovel", stackable: false, price: 240, income: 32, upkeep: 6, bonus: {}, regionalMult: { albion: 0.9 }, desc: "Mói grãos para vilas locais retendo a maquia em cereais." },
    { id: "taverna_porto", name: "🍺 Estalagem do Porto", category: "propriedade", type: "imovel", stackable: false, price: 320, income: 45, upkeep: 10, bonus: { carisma: 6 }, regionalMult: { serenissima: 0.9 }, desc: "Ponto de reunião de marinheiros, viajantes e mercadores." },
    { id: "terra_aravel", name: "🌾 Alódio de Terras Aráveis", category: "propriedade", type: "imovel", stackable: false, price: 420, income: 60, upkeep: 12, bonus: {}, regionalMult: { valois: 0.9 }, desc: "Férteis leiras de trigo e centeio trabalhadas por rendeiros." },
    { id: "solar_nobre", name: "🏰 Solar Senhorial Fortificado", category: "propriedade", type: "imovel", stackable: false, price: 900, income: 130, upkeep: 28, bonus: { carisma: 12, saude: 8 }, regionalMult: { valois: 0.95 }, desc: "Residência nobre com muralhas baixas, capela e aposentos amplos." },
    { id: "forte_fronteira", name: "🛡️ Forte Militar de Fronteira", category: "propriedade", type: "imovel", stackable: false, price: 1600, income: 190, upkeep: 45, bonus: { forca: 15, destreza: 8 }, regionalMult: { severnaya: 0.9 }, desc: "Reduto de pedra e paliçada para guarnecer tropas e cobrar pedágios." },
    { id: "castelo_feudal", name: "🏯 Castelo Feudal com Fosso", category: "propriedade", type: "imovel", stackable: false, price: 3500, income: 450, upkeep: 110, bonus: { carisma: 20, forca: 15 }, regionalMult: { teutonia: 0.95 }, desc: "Cidadela de menagem altaneira, baronia titular e vassalos juramentados." },
    { id: "palacio_real", name: "👑 Palácio Ducal de Mármore", category: "propriedade", type: "imovel", stackable: false, price: 8000, income: 1100, upkeep: 280, bonus: { carisma: 35, beleza: 25 }, regionalMult: { serenissima: 0.9 }, desc: "Sede principesca imponente com galerias de arte e cortesãos régios." },

    /* 2. MONTARIAS E EMBARCAÇÕES (5) */
    { id: "cavalo_carga", name: "🐴 Cavalo de Carga", category: "transporte", type: "montaria", stackable: false, price: 65, income: 0, upkeep: 3, bonus: { forca: 4 }, regionalMult: { severnaya: 0.9 }, desc: "Montaria robusta para viagens e transporte de mercadorias." },
    { id: "cavalo_guerra", name: "🐎 Destriero Pesado de Guerra", category: "transporte", type: "montaria", stackable: false, price: 220, income: 0, upkeep: 9, bonus: { forca: 12, carisma: 8 }, regionalMult: { valois: 0.9 }, desc: "Garanhão couraçado treinado para choque marcial em batalha." },
    { id: "carruagem_luxo", name: "🎠 Carruagem Nobre Entalhada", category: "transporte", type: "veiculo", stackable: false, price: 380, income: 0, upkeep: 14, bonus: { carisma: 14, beleza: 10 }, regionalMult: { valois: 0.9 }, desc: "Coche dourado com brasão heráldico nas portas para passeios da corte." },
    { id: "barco_pesca", name: "🛶 Barcaça Costeira", category: "transporte", type: "embarcacao", stackable: false, price: 90, income: 8, upkeep: 2, bonus: { destreza: 3 }, regionalMult: { albion: 0.9 }, desc: "Embarcação costeira a remos e pano para pesca e pequenas travessias." },
    { id: "navio_mercante", name: "⛵ Nau Mercante Armada", category: "transporte", type: "embarcacao", stackable: false, price: 850, income: 95, upkeep: 22, bonus: { carisma: 10, intelecto: 8 }, regionalMult: { serenissima: 0.85 }, desc: "Veleiro mercante com tripulação pronta para rotas ultramarinas." },

    /* 3. ARMAS (4) */
    { id: "adaga_ferro", name: "🗡️ Adaga de Ferro Temperado", category: "equipamento", type: "arma", stackable: false, price: 25, income: 0, upkeep: 0, bonus: { destreza: 6 }, regionalMult: {}, desc: "Lâmina ágil e oculta sob o gibão para golpes fulminantes." },
    { id: "arco_composto", name: "🏹 Arco Composto Laminado", category: "equipamento", type: "arma", stackable: false, price: 60, income: 0, upkeep: 1, bonus: { destreza: 12 }, regionalMult: { albion: 0.85 }, desc: "Arco recurvo de madeira e chifre com grande tensão e alcance." },
    { id: "espada_longa", name: "⚔️ Espada Longa de Aço", category: "equipamento", type: "arma", stackable: false, price: 95, income: 0, upkeep: 2, bonus: { forca: 14 }, regionalMult: { teutonia: 0.9 }, desc: "Lâmina equilibrada de fio duplo forjada para romper couraças." },
    { id: "lamina_damasco", name: "✨ Lâmina Curva de Damasco", category: "equipamento", type: "arma", stackable: false, price: 280, income: 0, upkeep: 3, bonus: { destreza: 18, forca: 10 }, regionalMult: { al_zahra: 0.8 }, desc: "Aço adamascado com ondas lendárias e corte quase sobrenatural." },

    /* 4. ARMADURAS (3) */
    { id: "gibao_couro", name: "🧥 Gibão de Couro Fervido", category: "equipamento", type: "armadura", stackable: false, price: 40, income: 0, upkeep: 0, bonus: { saude: 6, destreza: 2 }, regionalMult: {}, desc: "Proteção flexível e leve contra estocadas e arranhões." },
    { id: "cota_malha", name: "🛡️ Cota de Malha Rebitada", category: "equipamento", type: "armadura", stackable: false, price: 130, income: 0, upkeep: 3, bonus: { saude: 14 }, regionalMult: { teutonia: 0.9 }, desc: "Malha densa de elos rebitados que apara talhos de espada." },
    { id: "armadura_placas", name: "🪖 Arnês Completo de Placas", category: "equipamento", type: "armadura", stackable: false, price: 480, income: 0, upkeep: 8, bonus: { saude: 25, forca: 6 }, regionalMult: { teutonia: 0.85 }, desc: "Armadura integral de aço polido que desvia golpes e flechadas." },

    /* 5. INSTRUMENTOS (3) */
    { id: "flauta_osso", name: "🎵 Flauta Pastoril de Osso", category: "equipamento", type: "instrumento", stackable: false, price: 20, income: 0, upkeep: 0, bonus: { carisma: 4 }, regionalMult: {}, desc: "Instrumento bucólico de som doce para alegrar vigílias campesinas." },
    { id: "alaude_nobre", name: "🪕 Alaúde de Ébano e Madrepérola", category: "equipamento", type: "instrumento", stackable: false, price: 110, income: 0, upkeep: 1, bonus: { carisma: 12, beleza: 6 }, regionalMult: { serenissima: 0.9 }, desc: "Cordas de tripa afinadas para baladas corteses e serenatas na noite." },
    { id: "harpa_dourada", name: "🎶 Harpa Barroca Talhada", category: "equipamento", type: "instrumento", stackable: false, price: 340, income: 0, upkeep: 4, bonus: { carisma: 20, beleza: 12 }, regionalMult: { valois: 0.9 }, desc: "Estrutura dourada e acústica cristalina para saraus da mais alta nobreza." },

    /* 6. FERRAMENTAS (3) */
    { id: "ferramentas_mestre", name: "🛠️ Estojo de Ferramentas de Mestre", category: "equipamento", type: "ferramenta", stackable: false, price: 75, income: 0, upkeep: 1, bonus: { destreza: 8, intelecto: 4 }, regionalMult: { teutonia: 0.9 }, desc: "Cinzel, compasso e plainas de aço fino para obras-primas de artífice." },
    { id: "astrolabio_bronze", name: "🧭 Astrolábio de Bronze Náutico", category: "equipamento", type: "ferramenta", stackable: false, price: 160, income: 0, upkeep: 2, bonus: { intelecto: 14 }, regionalMult: { al_zahra: 0.85 }, desc: "Disco astronômico graduado para fixar latitudes e rumos oceânicos." },
    { id: "alambique_alquimia", name: "⚗️ Alambique e Serpentina de Cobre", category: "equipamento", type: "ferramenta", stackable: false, price: 210, income: 0, upkeep: 3, bonus: { intelecto: 16 }, regionalMult: { parsa: 0.9 }, desc: "Aparelhagem para destilar espíritos, águas florais e pós medicinais." },

    /* 7. RELÍQUIAS E LUXO (4) */
    { id: "espelho_veneziano", name: "🪞 Espelho de Cristal Veneziano", category: "luxo", type: "reliquia", stackable: false, price: 85, income: 0, upkeep: 1, bonus: { beleza: 14, carisma: 6 }, regionalMult: { serenissima: 0.8 }, desc: "Vidro azougado de pureza incomparável que realça os traços e a vaidade." },
    { id: "grimorio_latim", name: "📕 Códice Iluminado em Latim", category: "luxo", type: "reliquia", stackable: false, price: 125, income: 0, upkeep: 1, bonus: { intelecto: 16 }, regionalMult: { valois: 0.9 }, desc: "Manuscrito em velino com iluminuras sobre direito canônico e filosofia." },
    { id: "reliquia_santa", name: "⚱️ Relicário de Santo Mártir", category: "luxo", type: "reliquia", stackable: false, price: 175, income: 0, upkeep: 1, bonus: { fe: 18, sorte: 10 }, regionalMult: { suvarnabhumi: 0.9 }, desc: "Fragmento sagrado incrustado em prata, trazendo graças e bênçãos do céu." },
    { id: "coroa_colecionador", name: "👑 Coroa de Filigrana e Safiras", category: "luxo", type: "reliquia", stackable: false, price: 650, income: 0, upkeep: 6, bonus: { carisma: 24, beleza: 16 }, regionalMult: { tianxia: 0.9 }, desc: "Joia régia de ourivesaria imperial que irradia majestade e respeito." }
  ],

  /* ESTADOS DE CONSERVAÇÃO DE BENS */
  itemStates: {
    novo:       { label: "Novo", multValue: 1.0, multPerf: 1.0, decayRate: 0.05 },
    bom:        { label: "Bom", multValue: 0.8, multPerf: 0.9, decayRate: 0.08 },
    desgastado: { label: "Desgastado", multValue: 0.5, multPerf: 0.7, decayRate: 0.12 },
    arruinado:  { label: "Arruinado", multValue: 0.2, multPerf: 0.4, decayRate: 0.20 }
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
    1: { minWealth: 600, minProperties: 1, allowedCategories: ["propriedade", "transporte"], desc: "Fidalguia de solar: exige ao menos 1 propriedade e patrimônio de 600 moedas." },
    2: { minWealth: 1200, minProperties: 2, allowedCategories: ["propriedade", "transporte"], desc: "Baronia feudal: exige ao menos 2 propriedades sólidas e 1.200 moedas em patrimônio." },
    3: { minWealth: 2500, minProperties: 3, allowedCategories: ["propriedade", "transporte"], desc: "Viscondado: exige ao menos 3 propriedades produtivas e 2.500 moedas em bens." },
    4: { minWealth: 5000, minProperties: 4, allowedCategories: ["propriedade", "transporte"], desc: "Condado palatino: exige ao menos 4 propriedades e 5.000 moedas em terras e frotas." },
    5: { minWealth: 10000, minProperties: 5, allowedCategories: ["propriedade", "transporte"], desc: "Ducado de sangue: exige ao menos 5 propriedades com castelo ou solar e 10.000 moedas." }
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
