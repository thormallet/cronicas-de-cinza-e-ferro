/* ============================================================================
   [DADOS · EDIÇÃO EXPLORADOR] — cidades (vila/cidade/capital), fenótipos regionais,
   nobreza cultural e léxico local por reino
   ============================================================================ */
Object.assign(DATA, {
  /* 5 LOCALIDADES POR REINO (1 capital, 2 cidades, 2 vilas) */
  cities: {
    tianxia: [
      { id: "tx_luoyang", name: "Chang'an Celeste", tier: "capital", desc: "Capital imperial murada, sede do Palácio do Dragão e dos Exames Imperiais." },
      { id: "tx_suzhou", name: "Suzhou das Sedas", tier: "cidade", desc: "Metrópole mercantil cortada por canais, pontes de pedra e teares de brocado." },
      { id: "tx_quanzhou", name: "Porto de Quanzhou", tier: "cidade", desc: "Grande entreposto marítimo onde juncos imperiais trocam porcelana e especiarias." },
      { id: "tx_qinghe", name: "Aldeia de Qinghe", tier: "vila", desc: "Vila agrícola de terraços de arroz e bambuzais às margens do Rio Amarelo." },
      { id: "tx_longxi", name: "Povoado de Longxi", tier: "vila", desc: "Assentamento fronteiriço de pastores, caravaneiros e torres de vigia de taipa." }
    ],
    yamato: [
      { id: "ym_heian", name: "Heian-kyō", tier: "capital", desc: "Capital imperial dos palácios de cipreste, santuários vermelhos e corte do Xogum." },
      { id: "ym_kamakura", name: "Kamakura Costeira", tier: "cidade", desc: "Cidade fortificada de clãs guerreiros, forjas de katanas e templos zen." },
      { id: "ym_sakai", name: "Porto Livre de Sakai", tier: "cidade", desc: "Cidade portuária movimentada por guildas mercantis e armadores insulares." },
      { id: "ym_kiso", name: "Vila de Kiso", tier: "vila", desc: "Aldeia montanhosa envolta em neblina, cedros seculares e águas termais." },
      { id: "ym_ine", name: "Enseada de Ine", tier: "vila", desc: "Vila pesqueira de casas sobre estacas voltada para o mar bravio." }
    ],
    suvarnabhumi: [
      { id: "sv_kanauj", name: "Indraprastha Real", tier: "capital", desc: "Capital opulenta de templos dourados, elefantes de guerra e corte do Marajá." },
      { id: "sv_ujjain", name: "Ujjain dos Sábios", tier: "cidade", desc: "Centro urbano de observatórios astrais, bazares de gemas e santuários." },
      { id: "sv_calicut", name: "Porto de Kozhikode", tier: "cidade", desc: "Cidade costeira dominada pelo comércio marítimo de pimenta, canela e marfim." },
      { id: "sv_champa", name: "Vila de Champaner", tier: "vila", desc: "Aldeia fértil cercada por bananais, poços em degraus e teares de algodão." },
      { id: "sv_kaveri", name: "Povoado do Kaveri", tier: "vila", desc: "Comunidade ribeirinha de lavradores de especiarias e templos talhados na rocha." }
    ],
    parsa: [
      { id: "pr_isfahan", name: "Ctesifonte de Parsa", tier: "capital", desc: "Capital do Xá dos Xás, célebre pelos jardins reais, cúpulas turquesa e Templo do Fogo." },
      { id: "pr_nishapur", name: "Nishapur das Caravanas", tier: "cidade", desc: "Cidade da Rota da Seda famosa por astrônomos, tapetes e minas de turquesa." },
      { id: "pr_shiraz", name: "Shiraz dos Rosais", tier: "cidade", desc: "Centro urbano de poetas, vinhedos murados, alquimistas e mercados cobertos." },
      { id: "pr_yazd", name: "Oásis de Meybod", tier: "vila", desc: "Vila do planalto árido abastecida por aquedutos subterrâneos e torres de vento." },
      { id: "pr_zagros", name: "Aldeia de Zagros", tier: "vila", desc: "Povoado pastoril encravado nas gargantas rochosas das montanhas." }
    ],
    al_zahra: [
      { id: "az_madinat", name: "Madinat al-Zahra", tier: "capital", desc: "Capital resplandecente do Califado, sede da Casa da Sabedoria e do Palácio de Mármore." },
      { id: "az_damasco", name: "Al-Sham dos Bazares", tier: "cidade", desc: "Cidade milenar famosa pelo aço damasceno, caravanserais e cátedras de medicina." },
      { id: "az_basra", name: "Porto de Al-Basra", tier: "cidade", desc: "Empório portuário de onde partem sambucos carregados de pérolas e incenso." },
      { id: "az_tayma", name: "Oásis de Tayma", tier: "vila", desc: "Vila de tamareiras e poços artesianos na rota das cáfilas do deserto." },
      { id: "az_rif", name: "Alcaria de Al-Rif", tier: "vila", desc: "Aldeia caiada nas colinas, rodeada de olivais, moinhos d'água e hortas cítricas." }
    ],
    valois: [
      { id: "vl_lutecia", name: "Lutèce-sur-Seine", tier: "capital", desc: "Capital régia da Flor-de-Lis, coroada por catedrais góticas, universidade e o Paço Real." },
      { id: "vl_lyon", name: "Lyon das Feiras", tier: "cidade", desc: "Cidade episcopal e mercantil na confluência dos rios, célebre por feiras e sedas." },
      { id: "vl_bordeaux", name: "Bordéus Ducal", tier: "cidade", desc: "Cidade portuária fortificada, coração do comércio de vinhos e torneios de justa." },
      { id: "vl_clairvaux", name: "Vila de Clairvaux", tier: "vila", desc: "Aldeia vinícola pacata à sombra de uma abadia cisterciense e bosques de caça." },
      { id: "vl_montfort", name: "Burgo de Montfort", tier: "vila", desc: "Vila camponesa de moinhos de vento e terras de corveia ao pé de uma colina." }
    ],
    albion: [
      { id: "ab_londinium", name: "Londínio Real", tier: "capital", desc: "Capital da Coroa de Álbion às margens do Tâmisa, sede da Torre Real e do Parlamento." },
      { id: "ab_york", name: "Eboracum do Norte", tier: "cidade", desc: "Cidade amuralhada setentrional, bastião de barões fronteiriços e feiras de lã." },
      { id: "ab_bristol", name: "Porto de Bristólia", tier: "cidade", desc: "Cidade marítima de estaleiros, guildas de navegadores e comércio atlântico." },
      { id: "ab_sherwood", name: "Aldeia de Oakhaven", tier: "vila", desc: "Vila de cabanas de colmo na orla da floresta real, terra de arqueiros e lenhadores." },
      { id: "ab_penzance", name: "Vila de Tinmouth", tier: "vila", desc: "Povoado costeiro de falésias enevoadas, pescadores e minas de estanho." }
    ],
    severnaya: [
      { id: "sv_novgorod", name: "Veliky Kholm", tier: "capital", desc: "Capital do Grão-Principado, erguida em torno do Kremlin dourado e da corte dos Boiardos." },
      { id: "sv_kiev", name: "Chernigov Fluvial", tier: "cidade", desc: "Cidade fortificada sobre o grande rio, entreposto de dracares, peles de marta e âmbar." },
      { id: "sv_pskov", name: "Cidadela de Pskov", tier: "cidade", desc: "Praça-forte de pedra branca na fronteira gelada, famosa por armeiros e sinos." },
      { id: "sv_beloozero", name: "Vila de Beloozero", tier: "vila", desc: "Aldeia de isbás de toras junto ao lago congelado, cercada pela taiga infinita." },
      { id: "sv_vyatka", name: "Povoado de Vyatka", tier: "vila", desc: "Assentamento florestal de caçadores de ursos, apicultores e lenhadores." }
    ],
    teutonia: [
      { id: "tt_aachen", name: "Aquisgrano Imperial", tier: "capital", desc: "Capital sagrada do Sacro Império, sede da Capela Palatina e da Dieta Imperial." },
      { id: "tt_nuremberg", name: "Nuremberga Livre", tier: "cidade", desc: "Cidade livre imperial de mestres armeiros, relojoeiros, ourives e muralhas duplas." },
      { id: "tt_luebeck", name: "Lübeck da Hansa", tier: "cidade", desc: "Cidade portuária de tijolos góticos, rainha das frotas mercantis do Mar do Norte." },
      { id: "tt_schwarzwald", name: "Vila de Falkenstein", tier: "vila", desc: "Aldeia alpina de minas de prata e carvoarias na Floresta Negra." },
      { id: "tt_rotbach", name: "Aldeia de Rotbach", tier: "vila", desc: "Vila agrícola de enxaimel nos vales renanos, entre moinhos e cervejarias." }
    ],
    serenissima: [
      { id: "sr_veneza", name: "Veneza da Laguna", tier: "capital", desc: "Capital da Sereníssima República, cidade de canais, palácios de mármore e do Grande Conselho." },
      { id: "sr_florenca", name: "Florença dos Bancos", tier: "cidade", desc: "Cidade esplendorosa de casas banqueiras, guildas de lã, cúpulas e mecenas." },
      { id: "sr_genova", name: "Gênova Soberba", tier: "cidade", desc: "Cidade marítima em anfiteatro, potência naval de galés, capitães e armadores." },
      { id: "sr_murano", name: "Vila de Murano", tier: "vila", desc: "Ilhota de fornos de cristal, pescadores da laguna e oficinas secretas." },
      { id: "sr_san_gimignano", name: "Burgo de Monteriggioni", tier: "vila", desc: "Vila murada nas colinas toscanas, rodeada de ciprestes, olivais e vinhedos." }
    ]
  },

  /* FENÓTIPOS DE RETRATO POR REINO (1ª Geração e NPCs Nativos) */
  kingdomPhenotypes: {
    tianxia:       { skins: [0, 1, 2, 7], hairs: [0, 1, 11], eyes: [2, 3, 6], eyeShapes: [1, 3, 5, 7], beards: [1, 3, 6, 7] },
    yamato:        { skins: [0, 1, 7],    hairs: [0, 1, 11], eyes: [2, 3],    eyeShapes: [1, 3, 5, 7], beards: [1, 3, 5, 7] },
    suvarnabhumi:  { skins: [3, 4, 5, 6], hairs: [0, 1, 11], eyes: [2, 3, 6], eyeShapes: [0, 2, 4, 6], beards: [0, 2, 3, 4] },
    parsa:         { skins: [2, 3, 4],    hairs: [0, 1, 2, 11], eyes: [2, 3, 4, 7], eyeShapes: [0, 2, 4, 6], beards: [0, 2, 4] },
    al_zahra:      { skins: [3, 4, 5],    hairs: [0, 1, 2, 11], eyes: [2, 3, 6], eyeShapes: [0, 2, 4, 6], beards: [0, 2, 4] },
    valois:        { skins: [0, 1, 2, 7], hairs: [1, 2, 3, 4, 5, 7, 9], eyes: [0, 1, 2, 4, 5], eyeShapes: [0, 1, 2, 4], beards: [0, 1, 3, 4, 5] },
    albion:        { skins: [0, 1, 7],    hairs: [2, 3, 4, 5, 6, 7, 8], eyes: [0, 1, 5], eyeShapes: [0, 1, 2, 4], beards: [0, 2, 4, 5] },
    severnaya:     { skins: [0, 1, 7],    hairs: [2, 4, 5, 6, 8, 10], eyes: [0, 1, 5], eyeShapes: [0, 1, 2, 3], beards: [0, 2, 4] },
    teutonia:      { skins: [0, 1, 2, 7], hairs: [2, 3, 4, 5, 6, 10], eyes: [0, 1, 4, 5], eyeShapes: [0, 1, 2, 4], beards: [0, 2, 3, 4, 5] },
    serenissima:   { skins: [1, 2, 3],    hairs: [0, 1, 2, 3, 7, 9], eyes: [1, 2, 3, 4, 6], eyeShapes: [0, 2, 4, 6], beards: [1, 3, 4, 5] }
  },

  /* NOBREZA E TÍTULOS CULTURAIS POR REINO */
  kingdomNobility: {
    tianxia: {
      systemName: "Mandarinato e Nobreza Imperial",
      rulerM: "Imperador (Filho do Céu)", rulerF: "Imperatriz Soberana",
      princeM: "Príncipe Imperial", princeF: "Princesa Imperial",
      titles: [
        { level: 1, titleM: "Mandarim Letrado (Shi)", titleF: "Dama Letrada (Shi)", consortM: "Consorte Letrado", consortF: "Dama Consorte", heirM: "Jovem Herdeiro Letrado", heirF: "Jovem Herdeira Letrada", bonusIncome: 30 },
        { level: 2, titleM: "Barão Imperial (Nan)", titleF: "Baronesa Imperial (Nan)", consortM: "Consorte Nan", consortF: "Consorte Nan", heirM: "Herdeiro Nan", heirF: "Herdeira Nan", bonusIncome: 65 },
        { level: 3, titleM: "Visconde Celeste (Zi)", titleF: "Viscondessa Celeste (Zi)", consortM: "Consorte Zi", consortF: "Consorte Zi", heirM: "Herdeiro Zi", heirF: "Herdeira Zi", bonusIncome: 105 },
        { level: 4, titleM: "Conde de Comenda (Bo)", titleF: "Condessa de Comenda (Bo)", consortM: "Consorte Bo", consortF: "Consorte Bo", heirM: "Herdeiro Bo", heirF: "Herdeira Bo", bonusIncome: 155 },
        { level: 5, titleM: "Duque de Estado (Gong)", titleF: "Duquesa de Estado (Gong)", consortM: "Consorte Ducal Gong", consortF: "Consorte Ducal Gong", heirM: "Grão-Herdeiro Gong", heirF: "Grã-Herdeira Gong", bonusIncome: 230 }
      ]
    },
    yamato: {
      systemName: "Linhagem Buke e Corte Kuge",
      rulerM: "Xogum Supremo", rulerF: "Xogum-Regente",
      princeM: "Jovem Senhor do Bakufu", princeF: "Princesa do Bakufu",
      titles: [
        { level: 1, titleM: "Samurai Gokenin", titleF: "Onna-musha Gokenin", consortM: "Consorte Gokenin", consortF: "Dama Gokenin", heirM: "Jovem Wakatonosama", heirF: "Jovem Hime", bonusIncome: 30 },
        { level: 2, titleM: "Hatamoto de Estandarte", titleF: "Dama Hatamoto", consortM: "Consorte Hatamoto", consortF: "Esposa Hatamoto", heirM: "Herdeiro Hatamoto", heirF: "Herdeira Hatamoto", bonusIncome: 65 },
        { level: 3, titleM: "Kokujin de Província", titleF: "Senhora Kokujin", consortM: "Consorte Kokujin", consortF: "Dama Provincial", heirM: "Herdeiro Provincial", heirF: "Hime Provincial", bonusIncome: 105 },
        { level: 4, titleM: "Shugo Militar", titleF: "Shugo-Dama", consortM: "Consorte Shugo", consortF: "Midokoro Shugo", heirM: "Herdeiro Shugo", heirF: "Princesa Shugo", bonusIncome: 155 },
        { level: 5, titleM: "Daimyo Soberano", titleF: "Daimyo Soberana", consortM: "Consorte Daimyo", consortF: "Kita-no-Mandokoro", heirM: "Grão-Herdeiro do Clã", heirF: "Grã-Hime do Clã", bonusIncome: 230 }
      ]
    },
    suvarnabhumi: {
      systemName: "Kshatriyas e Samantas Reais",
      rulerM: "Chakravartin / Marajá", rulerF: "Maharani Soberana",
      princeM: "Yuvaraja (Príncipe)", princeF: "Rajkumari (Princesa)",
      titles: [
        { level: 1, titleM: "Nayak de Fortaleza", titleF: "Nayika de Fortaleza", consortM: "Consorte Nayak", consortF: "Dama Nayika", heirM: "Jovem Nayak", heirF: "Jovem Nayika", bonusIncome: 30 },
        { level: 2, titleM: "Thakur de Domínio", titleF: "Thakurani de Domínio", consortM: "Consorte Thakur", consortF: "Thakurani Consorte", heirM: "Herdeiro Thakur", heirF: "Herdeira Thakurani", bonusIncome: 65 },
        { level: 3, titleM: "Samanta Feudatário", titleF: "Samanta-Devi", consortM: "Consorte Samanta", consortF: "Devi Consorte", heirM: "Kumara Herdeiro", heirF: "Kumari Herdeira", bonusIncome: 105 },
        { level: 4, titleM: "Raja de Principado", titleF: "Rani de Principado", consortM: "Raja Consorte", consortF: "Rani Consorte", heirM: "Rajkumar Herdeiro", heirF: "Rajkumari Herdeira", bonusIncome: 155 },
        { level: 5, titleM: "Mahasamanta Real", titleF: "Maharani Feudatária", consortM: "Príncipe Consorte", consortF: "Maharani Consorte", heirM: "Grão-Yuvaraja", heirF: "Grã-Rajkumari", bonusIncome: 230 }
      ]
    },
    parsa: {
      systemName: "Aristocracia Bozorgan e Marzbans",
      rulerM: "Xá dos Xás (Shahanshah)", rulerF: "Banbishn Soberana",
      princeM: "Mirza Imperial", princeF: "Shahzadi Imperial",
      titles: [
        { level: 1, titleM: "Dehqan de Solar", titleF: "Banu Dehqan", consortM: "Consorte Dehqan", consortF: "Khatun Dehqan", heirM: "Jovem Dehqan", heirF: "Jovem Banu", bonusIncome: 30 },
        { level: 2, titleM: "Azatan Cavaleiro", titleF: "Azat-Banu", consortM: "Consorte Azatan", consortF: "Khatun Azatan", heirM: "Herdeiro Azatan", heirF: "Herdeira Azatan", bonusIncome: 65 },
        { level: 3, titleM: "Sardar da Comarca", titleF: "Sardar-Banu", consortM: "Consorte Sardar", consortF: "Begum Consorte", heirM: "Mirza Sardar", heirF: "Banu Herdeira", bonusIncome: 105 },
        { level: 4, titleM: "Marzban da Marca", titleF: "Marzban-Banu", consortM: "Consorte Marzban", consortF: "Khatun da Marca", heirM: "Herdeiro Marzban", heirF: "Herdeira Marzban", bonusIncome: 155 },
        { level: 5, titleM: "Spahbed / Grão-Sátrapa", titleF: "Grã-Banu Imperial", consortM: "Príncipe Spahbed", consortF: "Grã-Khatun", heirM: "Grão-Mirza", heirF: "Grã-Shahzadi", bonusIncome: 230 }
      ]
    },
    al_zahra: {
      systemName: "Emirado e Linhagens Notáveis",
      rulerM: "Califa Soberano", rulerF: "Sultana Regente",
      princeM: "Príncipe Emir", princeF: "Princesa Amira",
      titles: [
        { level: 1, titleM: "Notável A'yan", titleF: "Sayyida de Solar", consortM: "Consorte A'yan", consortF: "Dama Sayyida", heirM: "Jovem A'yan", heirF: "Jovem Sayyida", bonusIncome: 30 },
        { level: 2, titleM: "Sheik de Alcaria", titleF: "Sheikha de Alcaria", consortM: "Consorte Sheik", consortF: "Sheikha Consorte", heirM: "Herdeiro Sheik", heirF: "Herdeira Sheikha", bonusIncome: 65 },
        { level: 3, titleM: "Wali Governador", titleF: "Waliya da Província", consortM: "Consorte Wali", consortF: "Amira Consorte", heirM: "Herdeiro do Wali", heirF: "Herdeira do Wali", bonusIncome: 105 },
        { level: 4, titleM: "Xerife de Linhagem", titleF: "Sharifa Nobre", consortM: "Xerife Consorte", consortF: "Sharifa Consorte", heirM: "Jovem Xerife", heirF: "Jovem Sharifa", bonusIncome: 155 },
        { level: 5, titleM: "Grão-Emir de Província", titleF: "Grã-Amira de Província", consortM: "Emir Consorte", consortF: "Amira Consorte", heirM: "Grão-Herdeiro Emir", heirF: "Grã-Herdeira Amira", bonusIncome: 230 }
      ]
    },
    valois: {
      systemName: "Pares e Nobreza Feudal de Valois",
      rulerM: "Rei Cristianíssimo", rulerF: "Rainha Soberana",
      princeM: "Delfim Real", princeF: "Princesa da Flor-de-Lis",
      titles: [
        { level: 1, titleM: "Sieur / Fidalgo de Solar", titleF: "Dame de Solar", consortM: "Sieur Consorte", consortF: "Dame Consorte", heirM: "Jovem Damas-Herdeiro", heirF: "Jovem Demoiselle", bonusIncome: 30 },
        { level: 2, titleM: "Barão de Valois", titleF: "Baronesa de Valois", consortM: "Barão Consorte", consortF: "Baronesa Consorte", heirM: "Barãozinho Herdeiro", heirF: "Baronesinha Herdeira", bonusIncome: 65 },
        { level: 3, titleM: "Visconde da Comarca", titleF: "Viscondessa da Comarca", consortM: "Visconde Consorte", consortF: "Viscondessa Consorte", heirM: "Visconde Herdeiro", heirF: "Viscondessa Herdeira", bonusIncome: 105 },
        { level: 4, titleM: "Conde de Paria", titleF: "Condessa de Paria", consortM: "Conde Consorte", consortF: "Condessa Consorte", heirM: "Conde Herdeiro", heirF: "Condessa Herdeira", bonusIncome: 155 },
        { level: 5, titleM: "Duque e Par de Valois", titleF: "Duquesa e Par de Valois", consortM: "Duque Consorte", consortF: "Duquesa Consorte", heirM: "Grão-Herdeiro Ducal", heirF: "Grã-Herdeira Ducal", bonusIncome: 230 }
      ]
    },
    albion: {
      systemName: "Pariato Real de Álbion",
      rulerM: "Rei de Álbion", rulerF: "Rainha de Álbion",
      princeM: "Príncipe da Coroa", princeF: "Princesa Real",
      titles: [
        { level: 1, titleM: "Lorde de Solar (Lord of the Manor)", titleF: "Lady de Solar", consortM: "Lorde Consorte", consortF: "Lady Consorte", heirM: "Jovem Squire Herdeiro", heirF: "Jovem Lady Herdeira", bonusIncome: 30 },
        { level: 2, titleM: "Barão do Parlamento", titleF: "Baronesa do Parlamento", consortM: "Barão Consorte", consortF: "Lady Baronesa", heirM: "Herdeiro Baronial", heirF: "Herdeira Baronial", bonusIncome: 65 },
        { level: 3, titleM: "Visconde do Shire", titleF: "Viscondessa do Shire", consortM: "Visconde Consorte", consortF: "Viscondessa Consorte", heirM: "Visconde Herdeiro", heirF: "Viscondessa Herdeira", bonusIncome: 105 },
        { level: 4, titleM: "Conde (Earl) do Condado", titleF: "Condessa (Countess)", consortM: "Earl Consorte", consortF: "Condessa Consorte", heirM: "Lorde Herdeiro", heirF: "Lady Herdeira", bonusIncome: 155 },
        { level: 5, titleM: "Duque Real de Álbion", titleF: "Duquesa Real de Álbion", consortM: "Duque Consorte", consortF: "Duquesa Consorte", heirM: "Grão-Lorde Ducal", heirF: "Grã-Lady Ducal", bonusIncome: 230 }
      ]
    },
    severnaya: {
      systemName: "Duma de Boiardos e Príncipes Knyaz",
      rulerM: "Grão-Príncipe (Veliky Knyaz)", rulerF: "Grã-Princesa (Velikaya Knyaginya)",
      princeM: "Knyazich Herdeiro", princeF: "Knyazhna Real",
      titles: [
        { level: 1, titleM: "Dvorianin (Fidalgo da Druzhina)", titleF: "Baryshnya de Solar", consortM: "Consorte Dvorianin", consortF: "Dama Dvorianka", heirM: "Jovem Dvorianin", heirF: "Jovem Baryshnya", bonusIncome: 30 },
        { level: 2, titleM: "Voivoda de Fronteira", titleF: "Voivodina de Fronteira", consortM: "Consorte Voivoda", consortF: "Esposa do Voivoda", heirM: "Herdeiro Voivoda", heirF: "Herdeira Voivodina", bonusIncome: 65 },
        { level: 3, titleM: "Posadnik da Comarca", titleF: "Posadnitsa da Comarca", consortM: "Consorte Posadnik", consortF: "Dama Posadnitsa", heirM: "Herdeiro Posadnik", heirF: "Herdeira Posadnitsa", bonusIncome: 105 },
        { level: 4, titleM: "Boiardo da Duma", titleF: "Boiarda (Boyarynya)", consortM: "Boiardo Consorte", consortF: "Boiarda Consorte", heirM: "Jovem Boiardo", heirF: "Jovem Boiarda", bonusIncome: 155 },
        { level: 5, titleM: "Príncipe Apanágio (Knyaz)", titleF: "Princesa (Knyaginya)", consortM: "Knyaz Consorte", consortF: "Knyaginya Consorte", heirM: "Grão-Knyazich", heirF: "Grã-Knyazhna", bonusIncome: 230 }
      ]
    },
    teutonia: {
      systemName: "Círculo Imperial e Príncipes-Eleitores",
      rulerM: "Kaiser do Sacro Império", rulerF: "Kaiserin Soberana",
      princeM: "Príncipe Imperial (Reichsfürst)", princeF: "Princesa Imperial",
      titles: [
        { level: 1, titleM: "Ritter / Junker de Solar", titleF: "Edelfrau de Solar", consortM: "Ritter Consorte", consortF: "Edelfrau Consorte", heirM: "Jovem Junker", heirF: "Jovem Fräulein", bonusIncome: 30 },
        { level: 2, titleM: "Freiherr (Barão Livre)", titleF: "Freifrau (Baronesa Livre)", consortM: "Freiherr Consorte", consortF: "Freifrau Consorte", heirM: "Freiherr Herdeiro", heirF: "Freiin Herdeira", bonusIncome: 65 },
        { level: 3, titleM: "Burgrave (Burggraf)", titleF: "Burgravina (Burggräfin)", consortM: "Burgrave Consorte", consortF: "Burgravina Consorte", heirM: "Herdeiro Burgrave", heirF: "Herdeira Burgravina", bonusIncome: 105 },
        { level: 4, titleM: "Conde Palatino (Pfalzgraf)", titleF: "Condessa Palatina (Pfalzgräfin)", consortM: "Graf Consorte", consortF: "Gräfin Consorte", heirM: "Jovem Graf", heirF: "Jovem Gräfin", bonusIncome: 155 },
        { level: 5, titleM: "Herzog / Príncipe-Eleitor", titleF: "Herzogin / Eleitora", consortM: "Herzog Consorte", consortF: "Herzogin Consorte", heirM: "Erbprinz Ducal", heirF: "Erbprinzessin Ducal", bonusIncome: 230 }
      ]
    },
    serenissima: {
      systemName: "Patriciado Veneziano e Senhoria Mercantil",
      rulerM: "Sereníssimo Doge", rulerF: "Sereníssima Dogaressa Soberana",
      princeM: "Jovem Patrício Ducal", princeF: "Donzela Ducal",
      titles: [
        { level: 1, titleM: "Cittadino Originario", titleF: "Dama Cittadina", consortM: "Consorte Cittadino", consortF: "Consorte Cittadina", heirM: "Jovem Cittadino", heirF: "Jovem Cittadina", bonusIncome: 30 },
        { level: 2, titleM: "Patrício do Livro de Ouro", titleF: "Patrícia do Livro de Ouro", consortM: "Patrício Consorte", consortF: "Patrícia Consorte", heirM: "Herdeiro Patrício", heirF: "Herdeira Patrícia", bonusIncome: 65 },
        { level: 3, titleM: "Podestà / Cônsul de Galés", titleF: "Consulesa da Senhoria", consortM: "Cônsul Consorte", consortF: "Consulesa Consorte", heirM: "Jovem Cônsul", heirF: "Jovem Consulesa", bonusIncome: 105 },
        { level: 4, titleM: "Senador da Quarantia", titleF: "Senadora Patrícia", consortM: "Senador Consorte", consortF: "Senadora Consorte", heirM: "Herdeiro Senatorial", heirF: "Herdeira Senatorial", bonusIncome: 155 },
        { level: 5, titleM: "Procurador de São Marcos / Gonfaloneiro", titleF: "Grã-Procuradora da República", consortM: "Procurador Consorte", consortF: "Dogaressa Consorte", heirM: "Grão-Herdeiro Patrício", heirF: "Grã-Herdeira Patrícia", bonusIncome: 230 }
      ]
    }
  },

  /* LÉXICO CULTURAL E GRUPO REGIONAL POR REINO (Para Eventos Adaptados) */
  kingdomLexicon: {
    tianxia:      { group: "oriente",      temple: "Templo dos Ancestrais", clergy: "mestre taoísta",   guard: "guarda imperial", fisco: "mandarim censor" },
    yamato:       { group: "oriente",      temple: "Santuário Xintoísta",   clergy: "monge budista",    guard: "patrulha ashigaru", fisco: "intendente do Xogum" },
    suvarnabhumi: { group: "orientemedio", temple: "Templo de Pedra Sagrada", clergy: "brâmane",        guard: "guarda rajput",   fisco: "coletor real" },
    parsa:        { group: "orientemedio", temple: "Templo do Fogo Sagrado", clergy: "mobed sacerdote", guard: "guarda imortal",  fisco: "cobrador do Xá" },
    al_zahra:     { group: "orientemedio", temple: "Grande Mesquita",       clergy: "imame e cádi",     guard: "guarda do Emir",  fisco: "oficial do Diwan" },
    valois:       { group: "ocidente",     temple: "Catedral Gótica",       clergy: "prelado",          guard: "sargento d'armas", fisco: "bailio real" },
    albion:       { group: "ocidente",     temple: "Abadia de Pedra",       clergy: "pároco do shire",  guard: "xerife do condado", fisco: "coletor do Exchequer" },
    severnaya:    { group: "norte_leste",  temple: "Catedral de Cúpulas",   clergy: "padre ortodoxo",   guard: "druzhina do Kremlin", fisco: "coletor boiardo" },
    teutonia:     { group: "ocidente",     temple: "Sé Imperial",           clergy: "cônego capitular", guard: "alabardeiro municipal", fisco: "vogt imperial" },
    serenissima:  { group: "mediterraneo", temple: "Basílica de Mármore",   clergy: "cardeal legado",   guard: "esbirro da Senhoria", fisco: "camerlingo da República" }
  }
});