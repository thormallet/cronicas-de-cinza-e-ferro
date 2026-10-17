/* ============================================================================
   [DADOS · CONQUISTAS E LEGADO DINÁSTICO 4.0] — proezas heroicas e traços ancestrais
   ============================================================================ */
Object.assign(DATA, {
  /* 20 CONQUISTAS HISTÓRICAS E PROEZAS DE VIDA */
  achievements: [
    { id: "ach_primeira_moeda", icon: "🪙", name: "Primeiro Cobrezinho", category: "economia", points: 10, desc: "Acumular 50 moedas de ouro nos seus próprios cofres." },
    { id: "ach_mestre_oficio", icon: "🔨", name: "Mestre Juramentado", category: "oficio", points: 25, desc: "Alcançar a mais alta patente de uma guilda ou ofício formal." },
    { id: "ach_sangue_nobre", icon: "🛡️", name: "Brasão de Linhagem", category: "nobreza", points: 25, desc: "Obter ou herdar um título fidalgo na nobreza do reino." },
    { id: "ach_duque_coroa", icon: "👑", name: "Sangue Ducal", category: "nobreza", points: 50, desc: "Ascender ao título supremo de Duque de Sangue Real." },
    { id: "ach_fortuna_ouro", icon: "💰", name: "Cofres Transbordantes", category: "economia", points: 30, desc: "Acumular fortuna pessoal superior a 2.000 moedas de ouro." },
    { id: "ach_senhor_castelo", icon: "🏯", name: "Senhor da Fortaleza", category: "propriedade", points: 35, desc: "Adquirir ou comandar um castelo feudal de pedra com fosso." },
    { id: "ach_grande_armador", icon: "⛵", name: "Almirante dos Mares", category: "comercio", points: 20, desc: "Armar uma nau mercante e cruzar as rotas de mares bravios." },
    { id: "ach_longevidade_veneravel", icon: "👴", name: "Patriarca Centenário", category: "vida", points: 30, desc: "Sobreviver aos rigores e invernos medievais até os 70 anos de idade." },
    { id: "ach_honra_imaculada", icon: "⚜️", name: "Cavaleiro Sem Mácula", category: "moral", points: 25, desc: "Atingir 90 ou mais de Honra mantendo conduta cavalheiresca." },
    { id: "ach_infamia_sombria", icon: "🗡️", name: "Príncipe do Crime", category: "moral", points: 20, desc: "Viver no submundo com temida reputação de foragido lendário." },
    { id: "ach_devoto_santo", icon: "🙏", name: "Bênção dos Altares", category: "fe", points: 25, desc: "Alcançar 90 ou mais de Fé e dedicar-se às causas sagradas." },
    { id: "ach_erudito_astros", icon: "📜", name: "Luz da Razão", category: "conhecimento", points: 25, desc: "Alcançar 90 ou mais de Intelecto desvendando leis e efemérides." },
    { id: "ach_campeao_torneio", icon: "🏇", name: "Campeão da Liça", category: "marcial", points: 25, desc: "Vencer torneios de justas e duelos marciais perante a corte." },
    { id: "ach_banqueiro_reinos", icon: "🏛️", name: "Credor dos Tronos", category: "economia", points: 35, desc: "Financiar a Coroa Real ou grandes casas nobres com empréstimos." },
    { id: "ach_dinastia_cinco", icon: "🌳", name: "Cinco Gerações", category: "legado", points: 40, desc: "Dar continuidade à linhagem familiar por cinco sucessões consecutivas." },
    { id: "ach_casamento_ouro", icon: "💍", name: "Aliança de Sangue Real", category: "relacoes", points: 20, desc: "Consorciar-se em núpcias com a alta nobreza ou ramo principesco." },
    { id: "ach_viajante_mundo", icon: "🧭", name: "Caminhos do Mundo", category: "exploracao", points: 25, desc: "Visitar e exercer seu ofício em ao menos três reinos estrangeiros." },
    { id: "ach_soberano_feudo", icon: "🌾", name: "Soberano em Seu Domínio", category: "propriedade", points: 30, desc: "Acumular cinco ou mais propriedades produtivas simultâneas." },
    { id: "ach_sobrevivente_peste", icon: "💀", name: "Cicatrizes da Peste", category: "vida", points: 20, desc: "Superar a praga de bubões da Peste Negra sem sucumbir à febre." },
    { id: "ach_lenda_cinza_ferro", icon: "⚔️", name: "Lenda de Cinza e Ferro", category: "suprema", points: 100, desc: "Completar dez grandes conquistas em uma mesma crônica dinástica." }
  ],

  /* 16 MARCAS ANCESTRAIS E TRAÇOS HEREDITÁRIOS DE LEGADO */
  legacyTags: {
    sangue_guerreiro:     { name: "Sangue Guerreiro", icon: "⚔️", desc: "Tradição marcial no sangue (+5 Força inicial para herdeiros)." },
    mente_astuta:         { name: "Mente Astuta", icon: "📜", desc: "Linhagem afeiçoada a letras e cálculos (+5 Intelecto inicial)." },
    graca_cortes:         { name: "Graça das Cortes", icon: "🌹", desc: "Compostura e lábia herdadas no berço (+5 Carisma inicial)." },
    beleza_linhagem:      { name: "Beleza de Linhagem", icon: "✨", desc: "Harmonia facial e porte nobre passado entre gerações (+5 Beleza inicial)." },
    vigor_ancestral:      { name: "Vigor Ancestral", icon: "🛡️", desc: "Robustez física e imunidade a invernos rigorosos (+5 Saúde inicial)." },
    maos_artifice:        { name: "Mãos de Artífice", icon: "🔨", desc: "Habilidade cirúrgica com bigornas, agulhas e ferramentas (+5 Destreza inicial)." },
    favor_divino:         { name: "Favor Divino", icon: "🙏", desc: "Linhagem reverenciada pela piedade e devoção eclesiástica (+5 Fé inicial)." },
    estrela_sortuda:      { name: "Estrela Sortuda", icon: "🍀", desc: "Destino afortunado em jogos, intempéries e provações (+5 Sorte inicial)." },
    cofre_hereditario:    { name: "Cofre Hereditário", icon: "💰", desc: "Herdeiros iniciam suas jornadas com +50 moedas de ouro em caixa." },
    renome_ancestral:     { name: "Renome Ancestral", icon: "🏆", desc: "O prestígio do sobrenome garante +1 de Reputação na maioridade." },
    brasao_respeitado:    { name: "Brasão Respeitado", icon: "⚜️", desc: "Linhagem conhecida pela retidão (+10 de Honra ao assumir o legado)." },
    nobreza_sangue:       { name: "Nobreza de Sangue", icon: "👑", desc: "Fidalguia atestada por pergaminhos, facilitando ingresso em cortes régias." },
    tradicao_mercantil:   { name: "Tradição Mercantil", icon: "⚖️", desc: "Contatos com guildas aumentam o lucro de vendas de bens em +10%." },
    alma_itinerante:      { name: "Alma Itinerante", icon: "🧭", desc: "Custos de caravana e viagem marítima reduzidos em 20% para a casa." },
    linhagem_imorredoura: { name: "Linhagem Imorredoura", icon: "🌳", desc: "Resistência hereditária a epidemias e menor mortalidade puerperal." },
    imperio_propriedades: { name: "Império de Propriedades", icon: "🏰", desc: "Custo anual de manutenção de todos os imóveis reduzido em 15%." }
  }
});
