/* ============================================================================
   [DADOS · CONQUISTAS E LEGADO DINÁSTICO 4.0] — proezas heroicas e traços ancestrais
   ============================================================================ */
Object.assign(DATA, {
  /* CONQUISTAS HISTÓRICAS E PROEZAS DE VIDA */
  achievements: [
    { id: "ach_primeira_moeda", icon: "🤝", name: "🤝 Arte da Barganha", category: "riqueza", points: 10, desc: "Venceu sua primeira negociação de preço no mercado." },
    { id: "ach_primeiro_negocio", icon: "⚖️", name: "⚖️ Mercador Astuto", category: "riqueza", points: 15, desc: "Concluiu 3 negociações vantajosas no mercado." },
    { id: "ach_milionario_ouro", icon: "💰", name: "💰 Cofres Transbordantes", category: "riqueza", points: 30, desc: "Acumulou 1.000 moedas de ouro líquido nos cofres." },
    { id: "ach_magnata_patrimonio", icon: "🏛️", name: "🏛️ Magnata do Continente", category: "riqueza", points: 45, desc: "Atingiu um Patrimônio Líquido total de 5.000 moedas." },
    { id: "ach_colecionador_supremo", icon: "🏺", name: "🏺 Gabinete de Maravilhas", category: "riqueza", points: 30, desc: "Possuiu 10 ou mais bens simultaneamente no inventário." },
    { id: "ach_banqueiro_reinos", icon: "🏦", name: "🏦 Senhor da Usura", category: "riqueza", points: 35, desc: "Atuou como banqueiro concedendo crédito de risco a terceiros." },
    { id: "ach_livre_dividas", icon: "📜", name: "📜 Nome Limpo na Praça", category: "riqueza", points: 20, desc: "Quitou integralmente um empréstimo bancário ou hipoteca." },
    { id: "ach_ascensao_burguesa", icon: "⚖️", name: "⚖️ Sangue Burguês", category: "riqueza", points: 20, desc: "Ascendeu do estamento Plebeu para a Classe Média pelo patrimônio." },
    { id: "ach_novo_nobre", icon: "👑", name: "👑 Sangue Dourado", category: "dinastia", points: 35, desc: "Alcançou o estamento da Alta Nobreza por riqueza e posses." },
    { id: "ach_duque_soberano", icon: "⚜️", name: "⚜️ Par do Reino", category: "dinastia", points: 50, desc: "Alcançou o Grau 5 (Duque / Grão-Duque) na Nobreza Titular." },
    { id: "ach_senhor_castelo", icon: "🏰", name: "🏰 Senhor de Pedra e Cal", category: "riqueza", points: 40, desc: "Tornou-se proprietário de um Castelo Feudal ou Palácio Real." },
    { id: "ach_patriarca_matriarca", icon: "🌳", name: "🌳 Árvore Frondosa", category: "dinastia", points: 25, desc: "Teve 5 ou mais filhos vivos na mesma geração." },
    { id: "ach_gemeos", icon: "👶👶", name: "👶👶 Bênção Dupla", category: "dinastia", points: 20, desc: "Presenciou o nascimento raro de gêmeos na família." },
    { id: "ach_amante_secreta", icon: "🌹", name: "🌹 Segredos de Alcova", category: "geral", points: 15, desc: "Manteve 2 ou mais amantes ativas simultaneamente." },
    { id: "ach_grande_sedutor", icon: "💘", name: "💘 Don Juan das Cortes", category: "geral", points: 25, desc: "Manteve 3 ou mais amantes ativas ao mesmo tempo." },
    { id: "ach_bastardo_legitimado", icon: "🩸", name: "🩸 Sangue Reconhecido", category: "dinastia", points: 20, desc: "Reconheceu e legitimou um filho bastardo como herdeiro pleno." },
    { id: "ach_coracao_pedra", icon: "🚪", name: "🚪 Coração de Pedra", category: "geral", points: 15, desc: "Entregou um filho à Roda dos Expostos ou ao abandono." },
    { id: "ach_dinastia_eterna", icon: "⏳", name: "⏳ Dinastia Imortal", category: "dinastia", points: 50, desc: "Alcançou a 5ª Geração da sua linhagem familiar." },
    { id: "ach_mestre_corporacao", icon: "⚒️", name: "⚒️ Grão-Mestre da Guilda", category: "geral", points: 30, desc: "Alcançou o grau máximo em qualquer ofício." },
    { id: "ach_oficio_regional", icon: "🗺️", name: "🗺️ Guardião da Tradição", category: "geral", points: 20, desc: "Ingressou em uma profissão exclusiva de região." },
    { id: "ach_explorador_mundi", icon: "🧭", name: "🧭 Desbravador de Fronteiras", category: "geral", points: 25, desc: "Viajou e conheceu pelo menos 5 Reinos diferentes." },
    { id: "ach_cidadao_mundo", icon: "🌍", name: "🌍 Cosmopolita dos Dez Reinos", category: "geral", points: 45, desc: "Visitou todos os 10 Reinos conhecidos do mundo." },
    { id: "ach_campeao_torneio", icon: "⚔️", name: "⚔️ Lâmina Invicta", category: "marcial", points: 30, desc: "Venceu 3 duelos de honra, justas ou provações marciais." },
    { id: "ach_mao_ferro", icon: "🔥", name: "🔥 Punho de Ferro", category: "geral", points: 25, desc: "Governou o feudo com Autoridade máxima (80+)." },
    { id: "ach_santo_vivo", icon: "✨", name: "✨ Odor de Santidade", category: "geral", points: 35, desc: "Atingiu Fé >= 95 e Honra >= 90 em vida." },
    { id: "ach_sobrevivente_epoca", icon: "🕯️", name: "🕯️ Ancião Venerável", category: "geral", points: 30, desc: "Sobreviveu até os 70 anos de idade desafiando pestes e guerras." },
    { id: "conq_veterano_guerra", category: "marcial", name: "Veterano de Sangue & Cinza", desc: "Lute e sobreviva como comandante ou soldado em uma grande Guerra Continental.", icon: "⚔️" },
    { id: "conq_marechal", category: "marcial", name: "Grão-Marechal da Coroa", desc: "Alcance o topo da hierarquia militar comandando os exércitos do reino.", icon: "🎖️" },
    { id: "conq_enobrecido_campo", category: "marcial", name: "Cavaleiro de Esporas Douradas", desc: "Ascenda da plebe à nobreza sagrado pelo Rei por bravura extraordinária em batalha.", icon: "⚜️" },
    { id: "conq_senhor_exercito", category: "marcial", name: "Senhor dos Estandartes", desc: "Construa Casernas, Armarias e guarneça um feudo com mais de 500 homens em armas.", icon: "🏰" },
    { id: "conq_pacificador", category: "marcial", name: "O Grande Pacificador", desc: "Negocie com sucesso um tratado de paz e encerre uma guerra como diplomata real.", icon: "🕊️" },
    { id: "conq_mestre_duelo", category: "marcial", name: "Invicto na Espada", desc: "Vença 5 duelos de honra singulares sem jamais ser subjugado.", icon: "🤺" },
    { id: "conq_reliquia_ancestral", category: "dinastia", name: "Herdeiro da Lâmina das Brasas", desc: "Encontre, empunhe e transmita a Lâmina Ancestral de Valença pela dinastia.", icon: "✨" }
  ],

  /* 16 MARCAS ANCESTRAIS E EPÍTETOS BIOGRÁFICOS DE LEGADO (PURAMENTE VISUAIS) */
  legacyTags: {
    sangue_guerreiro:     { name: "Sangue Guerreiro", icon: "⚔️", desc: "Vida marcada pelo tinir do aço, batalhas campais e destemor diante da morte." },
    mente_astuta:         { name: "Mente Astuta", icon: "📜", desc: "Trajetória dedicada às letras, tratados antigos, cálculos e segredos da erudição." },
    graca_cortes:         { name: "Graça das Cortes", icon: "🌹", desc: "Lembrado pela eloquência magnética, diplomacia refinada e domínio dos salões." },
    beleza_linhagem:      { name: "Beleza de Linhagem", icon: "✨", desc: "Figura de porte estatuário e feições admiradas por trovadores e retratistas da época." },
    vigor_ancestral:      { name: "Vigor Ancestral", icon: "🛡️", desc: "Compleição de ferro que resistiu a invernos atrozes, febres e privações sem dobrar." },
    maos_artifice:        { name: "Mãos de Artífice", icon: "🔨", desc: "Mestre do trabalho minucioso, cujas obras em forjas e oficinas atravessaram décadas." },
    favor_divino:         { name: "Favor Divino", icon: "🙏", desc: "Existência pautada pela devoção fervorosa, vigílias sagradas e temor aos céus." },
    estrela_sortuda:      { name: "Estrela Sortuda", icon: "🍀", desc: "Abençoado pelo acaso em mesas de dados, emboscadas e reviravoltas improváveis do destino." },
    cofre_hereditario:    { name: "Cofre Hereditário", icon: "💰", desc: "Acumulador prudente de ouro e prata, deixando arcas cheias como testemunho de sua ambição." },
    renome_ancestral:     { name: "Renome Ancestral", icon: "🏆", desc: "Nome gravado na memória de vilas e praças pelo prestígio conquistado em vida." },
    brasao_respeitado:    { name: "Brasão Respeitado", icon: "⚜️", desc: "Caminhou pela retidão da palavra empenhada, mantendo a honra da casa acima de qualquer suspeita." },
    nobreza_sangue:       { name: "Nobreza de Sangue", icon: "👑", desc: "Portador de pergaminhos e títulos senhoriais reconhecidos pelas mais altas cortes do continente." },
    tradicao_mercantil:   { name: "Tradição Mercantil", icon: "⚖️", desc: "Conhecido nas feiras e portos pela visão aguçada para contratos, frotas e mercadorias raras." },
    alma_itinerante:      { name: "Alma Itinerante", icon: "🧭", desc: "Espírito inquieto que trocou o conforto do lar pelas estradas poeirentas e mares distantes." },
    linhagem_imorredoura: { name: "Linhagem Imorredoura", icon: "🌳", desc: "Patriarca ou matriarca cuja descendência numerosa perpetuou o sangue da família pelas eras." },
    imperio_propriedades: { name: "Império de Propriedades", icon: "🏰", desc: "Grande senhorio de terras aráveis, solares urbanos e muralhas erguidas em seu nome." }
  }
});
