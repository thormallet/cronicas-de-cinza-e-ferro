/* ============================================================================
   [EVENTOS · CONTEXTOS E ESTILOS] — contextos genéricos por fase/estamento e estilos narrativos por atributo
   ============================================================================ */
function buildEventContexts() {
  return [
    { prefix: "inf", classes: ["any"], phases: ["Infância"], themes: [
      ["Ninho de Pega no Telhado", "Uma ave brilhante escondeu pequenos objetos furtados na chaminé de casa.", "destreza", "sorte", "intelecto"],
      ["Cão Pastor Perdido", "Um filhote de mastim aparece tremendo de frio atrás do depósito de lenha.", "carisma", "fe", "sorte"],
      ["Brincadeira de Espadas de Pau", "As crianças da vizinhança organizam um combate simulado no terreiro.", "forca", "destreza", "carisma"],
      ["Favo de Mel na Despensa", "Um pote de mel dourado está na prateleira mais alta da cozinha.", "destreza", "sorte", "intelecto"],
      ["Procissão das Velas", "O sacerdote entrega círios acesos para as crianças caminharem cantando.", "fe", "carisma", "destreza"],
      ["Riacho Congelado", "Uma camada fina de gelo cobre a lagoa onde os gansos costumam nadar.", "intelecto", "destreza", "sorte"],
      ["Feira de Bonecos de Pano", "Saltimbancos montam um teatro de títeres contando lendas heroicas.", "intelecto", "carisma", "sorte"],
      ["Colheita de Amoras Silvestres", "Espinhos guardam as frutas mais doces na beira do barranco.", "destreza", "saude", "sorte"],
      ["Lição de Primeiras Letras", "Um parente mais velho desenha letras no chão de terra com um graveto.", "intelecto", "carisma", "fe"],
      ["Noite de Trovoada Forte", "Relâmpagos iluminam o quarto e fazem as vigas de madeira rangerem.", "saude", "fe", "sorte"]
    ]},
    { prefix: "pleb", classes: ["plebeu"], phases: ["Juventude","Adulto","Velhice"], themes: [
      ["Geada Negra na Lavoura", "A geada noturna queimou metade da colheita da aldeia em {kingdom}.", "forca", "intelecto", "fe"],
      ["O Boi Atolado no Pântano", "O único boi de tração da vizinhança afundou até o pescoço no charco lamacento.", "forca", "destreza", "sorte"],
      ["Corveia nas Obras Senhoriais", "O capataz do senhor feudal exige três dias extras de reparo nas muralhas sem pagamento.", "forca", "carisma", "destreza"],
      ["Disputa pela Água do Moinho", "O moleiro desviou o córrego e secou a horta da sua família.", "carisma", "forca", "intelecto"],
      ["Ladrões de Ovelhas na Calada", "Vultos furtivos tentam arrombar o curral durante o nevoeiro.", "destreza", "forca", "sorte"],
      ["Praga de Gafanhotos", "Uma nuvem escura devora as espigas antes da ceifa.", "intelecto", "fe", "saude"],
      ["Casamento Camponês Festivo", "A aldeia celebra a união de dois jovens com música e bebida farta.", "carisma", "saude", "destreza"],
      ["Achado no Sulco do Arado", "A lâmina do arado bate em uma caixa de ferro enferrujada enterrada há séculos.", "forca", "intelecto", "sorte"],
      ["Cão Danado na Estrada", "Um cão de fila espumando pela boca bloqueia o caminho da fonte.", "destreza", "forca", "sorte"],
      ["Inverno de Lenha Escassa", "Os guardas florestais proibiram o corte de lenha seca nas matas senhoriais.", "destreza", "carisma", "saude"],
      ["Incêndio no Palheiro Vizinho", "Faíscas de uma fornalha incendeiam o teto de palha ao lado do seu casebre.", "forca", "destreza", "carisma"],
      ["Passagem de Tropa Mercenária", "Soldados famintos exigem galinhas, pão e abrigo sob ameaça de saque.", "carisma", "forca", "intelecto"],
      ["Feira de Gado de Outono", "Criadores de toda a comarca reúnem-se para trocar animais e ferramentas.", "carisma", "intelecto", "sorte"],
      ["Telhado Desabado pelo Vendaval", "Uma tempestade violenta arranca as ripas do seu teto no meio da noite.", "forca", "destreza", "saude"],
      ["Fuga de Servo Marcado", "Um servo fugitivo com ferro em brasa no rosto implora esconderijo no seu celeiro.", "carisma", "fe", "destreza"],
      ["Colheita de Mel Selvagem", "Uma colmeia gigantesca pende de um penhasco íngreme na mata.", "destreza", "saude", "sorte"],
      ["Julgamento na Assembleia da Vila", "Os anciãos convocam você para depor sobre uma cerca movida durante a noite.", "carisma", "intelecto", "fe"],
      ["Surtos de Febre do Grão", "O pão húmido faz moradores caírem em delírio e ardor nas extremidades.", "intelecto", "saude", "fe"],
      ["Atravessando o Rio em Cheia", "A ponte de madeira ruiu e você precisa levar seus sacos de grãos à outra margem.", "forca", "destreza", "sorte"],
      ["Velho Eremita da Caverna", "Um asceta coberto de peles pede metade do seu pão em troca de uma bênção.", "fe", "carisma", "sorte"],
      ["Javali Ferido no Mato", "Um javali enorme com uma lança quebrada no lombo investe contra você.", "forca", "destreza", "saude"],
      ["Imposto do Sal", "Guardas confiscam carne salgada que não possui o selo oficial do fisco.", "carisma", "intelecto", "destreza"],
      ["Poço Contaminado na Aldeia", "A água da praça adquiriu gosto metálico e cheiro fétido.", "intelecto", "saude", "forca"],
      ["Noite de Solstício na Colina", "Fogueiras acesas atraem jovens para saltar as brasas e buscar sorte.", "destreza", "carisma", "sorte"],
      ["Roda de Carroça Partida", "Na lama profunda da estrada, o eixo da carroça estala sob o peso da carga.", "forca", "intelecto", "destreza"],
      ["Enxame de Vespas no Pomar", "Ao podar as árvores, você perturba um vespeiro oculto entre os ramos.", "destreza", "saude", "sorte"],
      ["Tributo da Mão-Morta", "O bailio exige a melhor cabeça de gado da família para renovar a posse da gleba.", "carisma", "intelecto", "sorte"],
      ["Lobo Branco na Nevasca", "Um predador colossal ronda as portas das cabanas uivando contra o vento.", "forca", "fe", "destreza"],
      ["Sementes de Grão Estrangeiro", "Um mascate vende sementes prometendo colheitas duas vezes maiores.", "intelecto", "sorte", "carisma"],
      ["Muro de Pedra Seca Desmoronado", "As criações escaparam para o bosque após a queda da divisa de pedra.", "forca", "destreza", "saude"]
    ]},
    { prefix: "med", classes: ["media"], phases: ["Juventude","Adulto","Velhice"], themes: [
      ["Inspeção dos Mestres da Guilda", "Os síndicos da corporação examinam a qualidade das suas peças e balanças em {kingdom}.", "intelecto", "carisma", "destreza"],
      ["Carregamento de Especiarias Mofado", "A humidade do porão ameaça arruinar sacas valiosas de pimenta e canela.", "intelecto", "destreza", "sorte"],
      ["Aprendiz Desonesto", "Você descobre que um jovem ajudante vem desviando moedas de prata do caixa.", "intelecto", "forca", "carisma"],
      ["Falsificadores de Moeda no Mercado", "Mercadores estrangeiros tentam pagar você com moedas de cobre banhadas a ouro.", "intelecto", "destreza", "carisma"],
      ["Incêndio no Bairro dos Curtidores", "As chamas alastram-se pelas oficinas de madeira estreitas do burgo.", "forca", "destreza", "saude"],
      ["Encomenda Urgente da Nobreza", "O mordomo de um grande senhor exige um serviço impecável até a lua cheia.", "destreza", "intelecto", "forca"],
      ["Greve dos Companheiros Artesãos", "Trabalhadores exigem melhor soldo e ameaçam fechar as portas da rua.", "carisma", "intelecto", "forca"],
      ["Contrabando pelo Portão Fluvial", "Um barqueiro oferece mercadorias sem taxas alfandegárias na calada da noite.", "destreza", "intelecto", "sorte"],
      ["Calúnia de Concorrente Invejoso", "Um rival espalha no mercado que seus produtos são amaldiçoados ou defeituosos.", "carisma", "forca", "intelecto"],
      ["Banquete da Câmara Municipal", "Os burgueses mais ricos de {kingdom} reúnem-se para eleger o novo conselho.", "carisma", "intelecto", "sorte"],
      ["Cobrança de Letra de Câmbio", "Um banqueiro da Sereníssima exige o pagamento imediato de uma promissória antiga.", "carisma", "intelecto", "sorte"],
      ["Ratos no Armazém de Tecidos", "Uma infestação voraz destrói fardos prontos para exportação.", "destreza", "intelecto", "sorte"],
      ["Viajante Misterioso na Estalagem", "Um hóspede ferido oferece uma joia rara em troca de silêncio e cavalos frescos.", "intelecto", "carisma", "destreza"],
      ["Disputa de Espaço na Feira Livre", "Um mercador corpulento monta a barraca dele exatamente diante da sua entrada.", "forca", "carisma", "intelecto"],
      ["Manuscrito Raro no Leilão", "O espólio de um velho sábio vai a leilão na praça central.", "intelecto", "carisma", "sorte"],
      ["Falta de Carvão e Ferro", "A guerra bloqueou as minas e o preço da matéria-prima disparou.", "intelecto", "carisma", "forca"],
      ["Noite de Jogo de Dados Pesado", "Mercadores ricos apostam bolsas cheias de ouro nos fundos de uma taverna.", "sorte", "intelecto", "destreza"],
      ["Processo no Tribunal Religioso", "Acusam seu negócio de praticar usura disfarçada.", "intelecto", "fe", "carisma"],
      ["Escolta de Carga Valiosa", "Bandidos rondam a estrada por onde sua carroça deve passar amanhã.", "forca", "intelecto", "sorte"],
      ["Pedido de Dote Exorbitante", "Uma família burguesa influente propõe aliança matrimonial, mas exige ouro pesado.", "carisma", "intelecto", "sorte"]
    ]},
    { prefix: "nob", classes: ["nobre"], phases: ["Juventude","Adulto","Velhice"], themes: [
      ["Intriga na Corte Soberana", "Cortesãos sussurram que sua família planeja aliar-se aos inimigos de {kingdom}.", "carisma", "intelecto", "forca"],
      ["Caçada Real ao Cervo Branco", "O soberano convida a nobreza para uma grande caçada com falcões e sabujos.", "destreza", "carisma", "sorte"],
      ["Vassalo Insubordinado", "Um guerreiro sob seu comando recusa-se a enviar homens para a guarda anual.", "forca", "carisma", "intelecto"],
      ["Vinho com Gosto de Amêndoas Amargas", "Durante um jantar diplomático, sua taça exala um odor estranho.", "intelecto", "saude", "sorte"],
      ["Disputa de Fronteira Feudal", "O senhor vizinho moveu os marcos de pedra para tomar um bosque seu.", "forca", "intelecto", "carisma"],
      ["Torneio de Armas da Primavera", "Arautos anunciam combates de honra diante das damas e senhores do reino.", "forca", "destreza", "sorte"],
      ["Embaixador Estrangeiro", "Um enviado de terras distantes propõe um tratado comercial secreto.", "intelecto", "carisma", "sorte"],
      ["Escândalo Amoroso no Palácio", "Cartas comprometedoras envolvendo o nome da sua casa são achadas no jardim.", "carisma", "destreza", "intelecto"],
      ["Reforma das Muralhas da Torre", "O mestre pedreiro alerta que a torre norte apresenta rachaduras perigosas.", "intelecto", "forca", "sorte"],
      ["Clero Exige Terras Antigas", "O templo reivindica a posse de um moinho antigo pertencente à sua linhagem.", "fe", "intelecto", "carisma"],
      ["Assassino na Galeria Escura", "Um vulto armado com punhal desliza pelos corredores do solar à meia-noite.", "destreza", "forca", "sorte"],
      ["Festa de Inverno no Salão Nobre", "Menestréis e malabaristas animam os salões enquanto alianças são costuradas.", "carisma", "intelecto", "saude"],
      ["Cavalo Campeão Adoecido", "Seu melhor corcel de guerra amanhece com cólicas graves antes da campanha.", "intelecto", "sorte", "fe"],
      ["Pedido de Resgate de Parente", "Piratas capturaram um primo seu no mar e exigem ouro pela vida dele.", "carisma", "intelecto", "forca"],
      ["Conspiração dos Grandes", "Senhores insatisfeitos sondam sua lealdade ao trono em uma reunião noturna.", "intelecto", "carisma", "fe"],
      ["Julgamento por Combate", "Um nobre rival exige que os céus decidam a verdade pelo fio da espada.", "forca", "destreza", "fe"],
      ["Bobo da Corte Insolente", "O bufão faz uma rima humilhante sobre suas cicatrizes diante de todos.", "carisma", "forca", "intelecto"],
      ["Saqueadores nas Vilas do Feudo", "Fumaça sobe no horizonte: bandidos atacaram os moinhos dos seus servos.", "forca", "destreza", "intelecto"],
      ["Herança Contestada por Tio", "Um parente distante apresenta um pergaminho com selo duvidoso exigindo metade das terras.", "intelecto", "carisma", "forca"],
      ["Hóspede Soberano Inesperado", "A comitiva real decide pernoitar no seu castelo, exigindo luxo absoluto.", "carisma", "intelecto", "sorte"]
    ]},
    { prefix: "gen", classes: ["any"], phases: ["Juventude","Adulto","Velhice"], themes: [
      ["Tempestade de Raios na Estrada", "O céu escurece subitamente e árvores partem-se ao redor do seu caminho.", "destreza", "saude", "sorte"],
      ["Encontro com Leprosos", "Um grupo fazendo soar matracas de madeira pede passagem e esmola na ponte.", "fe", "saude", "carisma"],
      ["Incêndio no Santuário Local", "O teto do templo arde após um raio; os fiéis gritam para salvar as relíquias sagradas.", "forca", "fe", "destreza"],
      ["Sonho Profético Angustiante", "Três noites seguidas você sonha com um corvo de três olhos pousado num crânio.", "fe", "intelecto", "sorte"],
      ["Forasteiro Ferido na Vala", "Você encontra um viajante sangrando na beira da estrada com uma bolsa selada.", "intelecto", "fe", "destreza"],
      ["Eclipse Solar ao Meio-Dia", "O sol torna-se um anel negro; o pânico toma conta do povo que teme o fim dos tempos.", "intelecto", "carisma", "fe"],
      ["Surto de Disenteria no Verão", "O calor intenso apodrece a carne e contamina as cisternas.", "saude", "intelecto", "sorte"],
      ["Acusação de Furto na Feira", "Um guarda aponta a lança para você dizendo que sua bolsa pertence a um mercador.", "carisma", "destreza", "intelecto"],
      ["Lobo Solitário no Inverno", "Na neve funda, uma fera faminta segue seus passos por léguas.", "forca", "destreza", "saude"],
      ["Caravana de Saltimbancos", "Artistas, engolidores de fogo e músicos acampam fora dos muros.", "carisma", "destreza", "sorte"],
      ["Dente Inflamado e Dor Aguda", "Uma infecção severa no maxilar impede você de comer ou dormir.", "saude", "forca", "sorte"],
      ["Discussão Teológica Acirrada", "Dois sábios debatem sobre a natureza do pecado e pedem sua opinião pública.", "intelecto", "fe", "carisma"],
      ["Ponte Cobrada por Mercenários", "Homens armados exigem pedágio ilegal para cruzar o vau do rio.", "forca", "carisma", "destreza"],
      ["Achado de Anel de Ouro na Lama", "Ao caminhar após a chuva, algo brilha entre os cascalhos.", "sorte", "intelecto", "fe"],
      ["Fofoca Escandalosa sobre Seu Nome", "Alguém espalhou boatos vis sobre sua conduta moral.", "carisma", "intelecto", "forca"],
      ["Convite para Peregrinação Noturna", "Devotos caminham com tochas rumo à colina sagrada.", "fe", "saude", "carisma"],
      ["Aposta de Braço de Ferro", "Um ferreiro viajante desafia qualquer um a dobrar-lhe o pulso por 15 moedas.", "forca", "saude", "sorte"],
      ["Fantasmas no Cemitério Antigo", "Luzes azuladas (fogo-fátuo) dançam sobre as covas na noite de outono.", "fe", "intelecto", "destreza"],
      ["Mordida de Víbora no Campo", "Ao mover uma pedra, uma serpente venenosa dá o bote.", "destreza", "saude", "sorte"],
      ["Pregador Apocalíptico", "Um asceta exorta a multidão a queimar vaidades e arrepender-se.", "fe", "carisma", "intelecto"],
      ["Desabamento na Pedreira", "Um estrondo sacode a colina e operários gritam soterrados sob o cascalho.", "forca", "destreza", "carisma"],
      ["Moeda Antiga do Império Caído", "Um velho oferece vender-lhe um medalhão imperial com inscrições misteriosas.", "intelecto", "carisma", "sorte"],
      ["Vento Gelado do Norte", "Uma frente polar congela rios e racha pedras em {kingdom}.", "saude", "forca", "intelecto"],
      ["Criança Perdida na Tempestade", "Uma mãe desesperada pede ajuda para achar o filho antes do cair da noite.", "destreza", "saude", "fe"],
      ["Desafiado no Jogo de Tábulas", "Um viajante astuto propõe uma partida de estratégia valendo prata.", "intelecto", "sorte", "carisma"],
      ["Boato de Besta no Pântano", "Camponeses juram que uma criatura escamosa devorou duas vacas no brejo.", "forca", "intelecto", "destreza"],
      ["Festa da Tosquia e Vinho Novo", "A comunidade celebra o fim do trabalho duro com danças e barris abertos.", "carisma", "saude", "sorte"],
      ["Encontro com Antigo Inimigo", "Numa encruzilhada estreita, você cruza o olhar com alguém que lhe deseja o mal.", "forca", "carisma", "destreza"],
      ["Tentação na Encruzilhada", "Na meia-noite sem lua, uma oportunidade sombria tenta sua ambição por poder fácil.", "fe", "intelecto", "sorte"],
      ["Relâmpago Atinge a Árvore Sagrada", "O povo interpreta o tronco partido como sinal de ira celeste.", "fe", "carisma", "intelecto"]
    ]}
  ];
}

function buildEventNarrativeStyle() {
  return {
    forca: [
      "Impor sua presença física e resolver a questão pelo esforço direto dos seus braços",
      "Enfrentar o obstáculo de peito aberto, sem recuar diante do perigo ou do peso",
      "Tomar a dianteira com firmeza implacável e submeter a situação pelo vigor"
    ],
    destreza: [
      "Agir com movimentos rápidos, silenciosos e calculados antes que percebam",
      "Valer-se de mãos leves, equilíbrio preciso e reflexos apurados no momento exato",
      "Contornar o perigo pelas frestas com agilidade furtiva e destreza"
    ],
    intelecto: [
      "Analisar friamente os indícios, calcular os riscos e aplicar uma solução engenhosa",
      "Recorrer ao saber acumulado nos livros, leis antigas e estratagemas sutis",
      "Estudar os pontos fracos da situação e arquitetar um plano meticuloso"
    ],
    carisma: [
      "Tomar a palavra diante de todos, persuadindo os ânimos com eloquência e postura",
      "Negociar um compromisso vantajoso apelando às vaidades e interesses alheios",
      "Usar de diplomacia cortês, charme e autoridade moral para conquistar apoio"
    ],
    saude: [
      "Suportar a provação com resistência estóica, confiando na têmpera do próprio corpo",
      "Perseverar sob a intempérie e o desgaste até que a crise se dissipe",
      "Manter a respiração firme e resistir ao cansaço sem ceder um palmo"
    ],
    fe: [
      "Elevar uma prece fervorosa aos céus e agir segundo os preceitos sagrados",
      "Confiar na providência divina e manter a integridade espiritual acima do medo",
      "Invocar a proteção sagrada e proceder com retidão e piedade"
    ],
    sorte: [
      "Seguir um pressentimento súbito e arriscar uma jogada ousada no escuro",
      "Deixar que a roda da fortuna decida o desfecho e apostar no inesperado",
      "Escolher o caminho menos óbvio confiando nos sinais sutis do acaso"
    ]
  };
}
