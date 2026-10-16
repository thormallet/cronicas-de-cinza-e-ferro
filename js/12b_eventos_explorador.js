/* ============================================================================
   [EVENTOS · EDIÇÃO EXPLORADOR] — eventos exclusivos por reino, compartilhados
   entre regiões/cidades e adaptação cultural/classificação do catálogo
   ============================================================================ */
function buildExplorerExclusiveEvents() {
  const makeEx = (id, kId, title, desc, a1, a2, a3, l1, l2, l3) => ({
    id,
    scope: "exclusivo",
    kingdoms: [kId],
    phase: ["Juventude", "Adulto", "Velhice"],
    classes: ["any"],
    title: `[Exclusivo] ${title}`,
    desc,
    choices: [
      { label: l1, attr: a1, diff: 54, ok: { gold: 28, rep: 1, attr: [a1, 5], msg: `Em {city}, seu feito em "${title}" correu por todo {kingdom} (+28 Ouro, +1 Rep)!` }, fail: { hp: -8, honor: -3, msg: `O revés em {city} custou caro ao seu prestígio local.` } },
      { label: l2, attr: a2, diff: 50, ok: { honor: 7, gold: 16, attr: [a2, 4], msg: `Sua conduta honrada em {city} elevou seu nome perante os notáveis (+7 Honra, +16 Ouro).` }, fail: { gold: -10, hp: -5, msg: `A tentativa malogrou e exigiu gastos inesperados em {city}.` } },
      { label: l3, attr: a3, diff: 48, ok: { hp: 8, attr: [a3, 4], msg: `A prudência guiou seus passos sob os costumes de {kingdom}.` }, fail: { rep: -1, msg: `Você hesitou diante das tradições de {city} e perdeu espaço.` } }
    ]
  });

  return [
    makeEx(
      "ev_ex_tianxia", "tianxia", "Exame Imperial de {city}",
      "Burocratas do Mandato Celeste abrem os portões de {city} para o exame de clássicos, caligrafia e decretos imperiais rumo a {capital}.",
      "intelecto", "carisma", "sorte",
      "Redigir um ensaio impecável sobre a harmonia do Estado e os clássicos antigos",
      "Presentear o {fisco} examinador com rolos de seda e chá raro",
      "Confiar na intuição para interpretar o enigma poético da banca imperial"
    ),
    makeEx(
      "ev_ex_yamato", "yamato", "Código da Lâmina sob as Cerejeiras",
      "Em {city}, um guerreiro de clã rival questiona a honra da sua linhagem diante do {temple} sob as pétalas que caem.",
      "destreza", "forca", "carisma",
      "Aceitar o duelo de saque rápido mantendo a mente serena como a água",
      "Impor respeito pela postura marcial inflexível sem desembainhar o aço",
      "Recitar um poema de honra que desarme a provocação diante das testemunhas"
    ),
    makeEx(
      "ev_ex_suvarnabhumi", "suvarnabhumi", "Procissão dos Elefantes Reais em {city}",
      "Os tambores ecoam no {temple} de {city}: um elefante de guerra adornado em ouro agita-se no meio do cortejo de especiarias.",
      "forca", "fe", "destreza",
      "Segurar as correntes da criatura ao lado dos cornacas reais",
      "Entoar os mantras sagrados junto ao {clergy} para acalmar o cortejo",
      "Guiar os mercadores e crianças pelas escadarias de pedra em segurança"
    ),
    makeEx(
      "ev_ex_parsa", "parsa", "Vigília da Chama Imperial em {city}",
      "No {temple} de {city}, emissários de {capital} buscam quem decifre os presságios astrais do equinócio e proteja a pira sagrada.",
      "intelecto", "fe", "carisma",
      "Calcular a conjunção dos astros com o astrolábio de latão dos sábios",
      "Alimentar o fogo sagrado com madeiras aromáticas ao lado do {clergy}",
      "Receber a caravana real nos jardins murados de {city} com pompa e poesia"
    ),
    makeEx(
      "ev_ex_al_zahra", "al_zahra", "Debate na Casa da Sabedoria de {city}",
      "Eruditos, médicos e mercadores reúnem-se junto à {temple} de {city} para disputar um prêmio em dinares oferecido pelo Califado.",
      "intelecto", "carisma", "sorte",
      "Apresentar um tratado de álgebra, óptica e farmacopeia diante dos mestres",
      "Negociar o patrocínio das cáfilas de incenso e aço damasceno no bazar",
      "Adquirir um pergaminho antigo trazido por viajantes do deserto"
    ),
    makeEx(
      "ev_ex_valois", "valois", "Corte de Amor Cortês em {city}",
      "Trovadores e fidalgos da Flor-de-Lis reúnem-se nos salões de {city} para julgar contendas de cavalaria, honra e galanteio.",
      "carisma", "destreza", "intelecto",
      "Declamar uma gesta heroica exaltando a nobreza da sua Casa",
      "Exibir destreza impecável na justa de anéis diante da corte local",
      "Arbitrar uma disputa de etiqueta e linhagem com subtileza jurídica"
    ),
    makeEx(
      "ev_ex_albion", "albion", "Foral do Shire e Arco Longo em {city}",
      "O {guard} convoca os homens e mulheres livres de {city} para o torneio de arqueiros e leitura das cartas da Coroa de Álbion.",
      "destreza", "carisma", "forca",
      "Cravar três flechas no centro do alvo a duzentos passos sob vento forte",
      "Reivindicar os direitos consuetudinários da comarca perante o {fisco}",
      "Vencer a luta campal de bastões no prado comunal de {city}"
    ),
    makeEx(
      "ev_ex_severnaya", "severnaya", "Dracares no Rio Congelado de {city}",
      "O gelo começa a quebrar nas margens de {city}, e boiardos contratam braços fortes para salvar o carregamento de peles de marta e âmbar.",
      "forca", "saude", "intelecto",
      "Puxar as amarras do dracar com cabos de cânhamo sobre o gelo estaladiço",
      "Mergulhar nas águas geladas para resgatar as arcas seladas do principado",
      "Coordenar os lenhadores com pranchas de pinho para erguer uma comporta"
    ),
    makeEx(
      "ev_ex_teutonia", "teutonia", "Dieta das Guildas Imperiais em {city}",
      "Mestres armeiros e emissários eleitorais discutem tarifas de prata e defesa das muralhas em {city} sob os olhos do {fisco}.",
      "intelecto", "forca", "carisma",
      "Auditar os livros de pesagem da prata e expor desvios na câmara",
      "Demonstrar a resistência das couraças forjadas na comarca",
      "Costurar um pacto de comércio livre entre os burgueses de {city} e {capital}"
    ),
    makeEx(
      "ev_ex_serenissima", "serenissima", "Regata e Intriga de Máscaras em {city}",
      "Gôndolas e galés embandeiradas tomam as águas de {city} enquanto patrícios mascarados negociam contratos e segredos de Estado.",
      "carisma", "destreza", "intelecto",
      "Circular pelo baile de máscaras colhendo confidências dos senadores",
      "Conduzir o barco na regata histórica desviando dos remos rivais",
      "Investir em uma participação de galé mercante que parte rumo ao Levante"
    )
  ];
}

function buildExplorerSharedEvents() {
  return [
    {
      id: "ev_sh_oriente_cha", scope: "compartilhado", kingdoms: ["tianxia", "yamato"],
      phase: ["Juventude", "Adulto", "Velhice"], classes: ["any"],
      title: "[Compartilhado] Pavilhão do Chá e Caligrafia em {city}",
      desc: "Mestres calígrafos e dignitários reúnem-se em {city} para avaliar a serenidade de espírito e o traço de pincel dos presentes.",
      choices: [
        { label: "Traçar um ideograma de força e equilíbrio com mão firme", attr: "destreza", diff: 50, ok: { honor: 6, attr: ["destreza", 5], msg: "Seu traço perfeito foi emoldurado no pavilhão de {city} (+6 Honra)!" }, fail: { honor: -3, msg: "Uma gota de nanquim borrou o papel de arroz." } },
        { label: "Discutir os clássicos da harmonia e etiqueta com os anciãos", attr: "intelecto", diff: 52, ok: { rep: 1, gold: 18, msg: "Sua erudição impressionou os mecenas de {city} (+18 Ouro, +1 Rep)." }, fail: { rep: -1, msg: "Sua interpretação foi considerada imatura pelos mestres." } }
      ]
    },
    {
      id: "ev_sh_rota_especiarias", scope: "compartilhado", kingdoms: ["suvarnabhumi", "parsa", "al_zahra"],
      phase: ["Juventude", "Adulto", "Velhice"], classes: ["any"],
      title: "[Compartilhado] Grande Cáfila de Especiarias em {city}",
      desc: "Uma caravana monumental de camelos e mercadores chega a {city} trazendo sedas, incenso, tapetes e tratados astronômicos.",
      choices: [
        { label: "Intermediar a troca de especiarias e gemas com os mercadores estrangeiros", attr: "carisma", diff: 52, ok: { gold: 32, attr: ["carisma", 4], msg: "Sua lábia no bazar de {city} rendeu +32 Ouro!" }, fail: { gold: -12, msg: "Você pagou caro por um lote de açafrão adulterado." } },
        { label: "Estudar os mapas e instrumentos trazidos pelos sábios da caravana", attr: "intelecto", diff: 50, ok: { attr: ["intelecto", 6], honor: 4, msg: "Você absorveu conhecimentos valiosos de astronomia e rotas!" }, fail: { hp: -4, msg: "O sol escaldante do mercado exauriu suas forças." } }
      ]
    },
    {
      id: "ev_sh_ocidente_justa", scope: "compartilhado", kingdoms: ["valois", "albion", "teutonia"],
      phase: ["Juventude", "Adulto", "Velhice"], classes: ["any"],
      title: "[Compartilhado] Feira de Armas e Relíquias em {city}",
      desc: "Arautos anunciam em {city} a chegada de cavaleiros andantes, armeiros e pregadores vindos de {capital}.",
      choices: [
        { label: "Medir forças nas provas de lança e escudo no campo de {city}", attr: "forca", diff: 54, ok: { gold: 25, honor: 6, msg: "Você derrubou seu oponente sob os aplausos de {city} (+25 Ouro, +6 Honra)!" }, fail: { hp: -10, msg: "Uma pancada no escudo deixou seu braço dormente." } },
        { label: "Ouvir o sermão do {clergy} diante da {temple} e fazer uma oferta", attr: "fe", diff: 46, ok: { honor: 7, attr: ["fe", 5], msg: "Sua devoção pública em {city} elevou sua honra (+7 Honra)." }, fail: { gold: -8, msg: "Batedores de carteira aproveitaram o tumulto na praça." } }
      ]
    },
    {
      id: "ev_sh_norte_inverno", scope: "compartilhado", kingdoms: ["severnaya", "teutonia", "albion"],
      phase: ["Juventude", "Adulto", "Velhice"], classes: ["any"],
      title: "[Compartilhado] Tempestade Boreal sobre {city}",
      desc: "Um vento glacial uiva pelos telhados de {city}, congelando poços e bloqueando as estradas que levam a {capital}.",
      choices: [
        { label: "Liderar o corte de lenha e abrir trincheiras na neve com os vizinhos", attr: "forca", diff: 52, ok: { rep: 1, attr: ["saude", 5], msg: "Seu vigor salvou famílias do frio em {city} (+1 Rep, +5 Saúde)!" }, fail: { hp: -9, msg: "O gelo cortante castigou suas mãos e pulmões." } },
        { label: "Racionar provisões aquecidas e abrigar viajantes junto ao fogo", attr: "intelecto", diff: 48, ok: { gold: 18, honor: 5, msg: "Os viajantes recompensaram sua hospitalidade em {city} (+18 Ouro)." }, fail: { gold: -10, msg: "O estoque de lenha custou o dobro do preço normal." } }
      ]
    },
    {
      id: "ev_sh_vila_mutirao", scope: "compartilhado", cityTiers: ["vila"],
      phase: ["Juventude", "Adulto", "Velhice"], classes: ["any"],
      title: "[Compartilhado • Vila] Mutirão Comunitário em {city}",
      desc: "Por ser uma vila rural, os moradores de {city} convocam todas as famílias para reparar o açude e os celeiros antes das chuvas.",
      choices: [
        { label: "Trabalhar ombro a ombro erguendo as toras e pedras do açude", attr: "forca", diff: 48, ok: { rep: 1, honor: 5, attr: ["forca", 4], msg: "Sua dedicação em {city} conquistou a gratidão dos anciãos!" }, fail: { hp: -6, msg: "O esforço pesado na lama deixou dores nas costas." } },
        { label: "Organizar a divisão de ferramentas e mantimentos da vila", attr: "carisma", diff: 48, ok: { gold: 15, rep: 1, msg: "Sua liderança agilizou a obra em {city} (+15 Ouro, +1 Rep)." }, fail: { honor: -3, msg: "Discussões entre vizinhos atrasaram o reparo." } }
      ]
    },
    {
      id: "ev_sh_urbano_patrulha", scope: "compartilhado", cityTiers: ["cidade", "capital"],
      phase: ["Juventude", "Adulto", "Velhice"], classes: ["any"],
      title: "[Compartilhado • Urbano] Toque de Recolher em {city}",
      desc: "Nas ruas movimentadas de {city}, o {guard} fecha os portões principais para investigar um carregamento suspeito vindo para a praça.",
      choices: [
        { label: "Apresentar seus documentos e colaborar com o {fisco} na vistoria", attr: "carisma", diff: 50, ok: { honor: 5, gold: 16, msg: "O comandante de {city} recompensou seu auxílio (+16 Ouro, +5 Honra)." }, fail: { gold: -8, msg: "Cobraram uma taxa de passagem nos portões de {city}." } },
        { label: "Tomar os becos elevados de {city} para contornar o bloqueio sem demora", attr: "destreza", diff: 52, ok: { attr: ["destreza", 5], gold: 14, msg: "Você conhecia cada atalho de {city} e chegou antes de todos!" }, fail: { hp: -6, msg: "Você escorregou nos degraus úmidos da viela." } }
      ]
    }
  ];
}

function adaptCatalogForExplorer(catalog) {
  const sharedWestIds = ["ev_adu_acusacao_heresia", "ev_nobre_revolta_servos", "ev_pleb_2", "ev_pleb_26", "ev_nob_5", "ev_nob_15"];
  const sharedMedIds = ["ev_med_10", "ev_med_7"];
  const sharedVilaIds = ["ev_inf_lobo_aldeia", "ev_pleb_0", "ev_pleb_1", "ev_pleb_4", "ev_pleb_7", "ev_pleb_15", "ev_pleb_20"];
  const sharedUrbanIds = ["ev_med_0", "ev_med_3", "ev_med_4", "ev_med_9", "ev_med_14", "ev_nob_0", "ev_nob_6", "ev_nob_7"];

  catalog.forEach(ev => {
    if (!ev.scope) {
      if (sharedWestIds.includes(ev.id)) {
        ev.scope = "compartilhado";
        ev.kingdoms = ["valois", "albion", "teutonia", "serenissima", "severnaya"];
      } else if (sharedMedIds.includes(ev.id)) {
        ev.scope = "compartilhado";
        ev.kingdoms = ["serenissima", "valois", "al_zahra", "tianxia"];
      } else if (sharedVilaIds.includes(ev.id)) {
        ev.scope = "compartilhado";
        ev.cityTiers = ["vila"];
      } else if (sharedUrbanIds.includes(ev.id)) {
        ev.scope = "compartilhado";
        ev.cityTiers = ["cidade", "capital"];
      } else {
        ev.scope = "universal";
      }
    }
    if (ev.desc) {
      ev.desc = ev.desc
        .replace(/coletor de impostos/gi, "{fisco}")
        .replace(/no adro do templo/gi, "diante de {temple} em {city}")
        .replace(/na aldeia/gi, "em {city}");
      if (!ev.desc.includes("{city}")) {
        ev.desc = `Em {city} ({kingdom}), ${ev.desc.charAt(0).toLowerCase()}${ev.desc.slice(1)}`;
      }
    }
  });
  return catalog;
}