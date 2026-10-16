/* ============================================================================
   [DADOS · REINOS E ATRIBUTOS] — reinos, atributos e traços
   ============================================================================ */
Object.assign(DATA, {
  /* 10 NOVOS REINOS — EDIÇÃO EXPLORADOR */
  kingdoms: [
    {
      id: "tianxia",
      name: "Império Celeste de Tianxia",
      inspiration: "China Imperial (Tang/Song)",
      law: "Mandato Celeste e Exame Imperial",
      desc: "Metrópoles muradas, canais grandiosos, burocracia de mandarins letrados e manufaturas de seda, papel e porcelana.",
      tax: 0.16
    },
    {
      id: "yamato",
      name: "Xogunato Insular de Yamato",
      inspiration: "Japão Feudal (Kamakura/Heian)",
      law: "Código de Linhagem Buke",
      desc: "Arquipélago de montanhas enevoadas, santuários sagrados e clãs guerreiros regidos pela honra implacável da lâmina.",
      tax: 0.14
    },
    {
      id: "suvarnabhumi",
      name: "Maha-Reinos de Suvarnabhumi",
      inspiration: "Índia Clássica e Reinos Rajput/Chola",
      law: "Dharma Real de Sangue",
      desc: "Vales fluviais opulentos, templos esculpidos na rocha, elefantes de guerra, especiarias raras e guildas mercantis milenares.",
      tax: 0.13
    },
    {
      id: "parsa",
      name: "Império Real de Parsa (Xanato)",
      inspiration: "Pérsia (Sassânida/Corásmia)",
      law: "Sucessão da Chama Imperial",
      desc: "Planaltos de jardins murados, rotas de caravanas da seda, cavalaria catafractária pesada e astrónomos da corte do Xá.",
      tax: 0.15
    },
    {
      id: "al_zahra",
      name: "Califado Dourado de Al-Zahra",
      inspiration: "Califados Árabes (Abássida/Omíada)",
      law: "Conselho de Sangue e Sabedoria",
      desc: "Oásis resplandecentes, Casas de Sabedoria repletas de tratados de medicina e álgebra, e bazares que unem três continentes.",
      tax: 0.12
    },
    {
      id: "valois",
      name: "Reino da Flor-de-Lis de Valois",
      inspiration: "França Medieval (Capetíngia)",
      law: "Primogenitura Sálica",
      desc: "Campos férteis de vinhedos, catedrais góticas altaneiras, cortes de amor cortês e a cavalaria mais orgulhosa do Ocidente.",
      tax: 0.16
    },
    {
      id: "albion",
      name: "Coroa Insular de Álbion",
      inspiration: "Inglaterra Medieval (Plantageneta)",
      law: "Magna Carta e Primogenitura",
      desc: "Colinas verdes e costas bravas, barões ciosos dos seus forais, arqueiros de arco longo e parlamentos turbulentos.",
      tax: 0.15
    },
    {
      id: "severnaya",
      name: "Grão-Principado de Severnaya",
      inspiration: "Rússia de Quieve / Novgorod",
      law: "Escada de Sangue dos Boiardos",
      desc: "Florestas boreais infinitas, rios gelados cruzados por dracares fluviais, cidadelas de madeira (Kremlins) e comércio de peles e âmbar.",
      tax: 0.14
    },
    {
      id: "teutonia",
      name: "Sacro Império de Teutónia",
      inspiration: "Sacro Império Romano-Germânico",
      law: "Bula Dourada Eleitoral",
      desc: "Mosaico de ducados alpinos, cidades livres fortificadas, minas de prata profundas e príncipes-eleitores em eterna disputa com o Imperador.",
      tax: 0.17
    },
    {
      id: "serenissima",
      name: "Liga das Repúblicas da Sereníssima",
      inspiration: "Repúblicas Marítimas Italianas (Veneza/Génova/Florença)",
      law: "Partilha Patricial Mercantil",
      desc: "Cidades-estado de mármore e canais dominadas por Doges, famílias banqueiras, galés de guerra, mecenas das artes e veneno político.",
      tax: 0.11
    }
  ],

  attributes: [
    { id: "forca", name: "Força", desc: "Poder físico, combate corpo-a-corpo e trabalho pesado." },
    { id: "destreza", name: "Destreza", desc: "Agilidade, furtividade, pontaria e ofícios manuais." },
    { id: "intelecto", name: "Intelecto", desc: "Erudição, estratégia, medicina, leis e administração." },
    { id: "carisma", name: "Carisma", desc: "Lábia, liderança, sedução, comércio e intriga." },
    { id: "beleza", name: "Beleza", desc: "Traços harmoniosos, porte magnético, atração romântica e prestígio na corte." },
    { id: "saude", name: "Saúde", desc: "Vitalidade máxima, resistência a pragas, ferimentos e velhice." },
    { id: "fe", name: "Fé", desc: "Devoção espiritual, autoridade eclesiástica e fervor." },
    { id: "sorte", name: "Sorte", desc: "O capricho do destino em todos os testes e reviravoltas." }
  ],

  traits: {
    good: [
      { id: "robusto", name: "Sangue de Ferro", mods: { saude: 18 } },
      { id: "genio", name: "Mente Lúcida", mods: { intelecto: 18 } },
      { id: "herculeo", name: "Braço de Forja", mods: { forca: 18 } },
      { id: "lingua_prata", name: "Língua de Prata", mods: { carisma: 18 } },
      { id: "belo", name: "Rosto Angelical", mods: { beleza: 20, carisma: 6 } },
      { id: "elegancia_nata", name: "Graça Soberana", mods: { beleza: 24, destreza: 8, carisma: 8 } },
      { id: "felino", name: "Passo de Sombra", mods: { destreza: 18 } },
      { id: "devoto", name: "Tocado pelo Sagrado", mods: { fe: 18 } },
      { id: "afortunado", name: "Estrela Dourada", mods: { sorte: 18 } },
      { id: "justo", name: "Coração Íntegro", mods: { carisma: 10, fe: 10 } }
    ],
    bad: [
      { id: "doentio", name: "Pulmão Fraco", mods: { saude: -15 } },
      { id: "obtuso", name: "Mente Turva", mods: { intelecto: -15 } },
      { id: "fraco", name: "Ossos de Vidro", mods: { forca: -15 } },
      { id: "repulsivo", name: "Olhar de Corvo", mods: { carisma: -15, beleza: -15 } },
      { id: "desfigurado", name: "Feições Rudes", mods: { beleza: -20 } },
      { id: "desastrado", name: "Mãos Trêmulas", mods: { destreza: -15 } },
      { id: "impio", name: "Alma Cética", mods: { fe: -15 } },
      { id: "amaldicoado", name: "Marca do Azar", mods: { sorte: -15 } },
      { id: "cruel", name: "Sangue Frio", mods: { carisma: -10, fe: -10 } }
    ]
  }
});
