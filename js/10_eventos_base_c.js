/* ============================================================================
   [EVENTOS · CATÁLOGO MANUAL C] — eventos narrativos escritos à mão (parte C), devolvidos por função para manter objetos novos a cada chamada
   ============================================================================ */
function buildEventsBaseC() {
  return [
    {
      id: "ev_new_fantasma_torre", phase: ["Juventude","Adulto","Velhice"], classes: ["any"], title: "Os Gemidos da Torre Velha",
      desc: "Moradores de {kingdom} juram ouvir correntes arrastadas e vozes sepulcrais vindas da atalaia abandonada na colina.",
      choices: [
        { label: "Subir sozinho à meia-noite com espada em punho para enfrentar o que houver lá", attr: "forca", diff: 60, ok: { gold: 45, rep: 2, msg: "Não eram fantasmas, mas contrabandistas usando lençóis! Você tomou o ouro deles." }, fail: { hp: -15, msg: "Os bandidos escondidos na torre emboscaram você no escuro." } },
        { label: "Investigar as pegadas na lama ao redor da base da torre durante o dia", attr: "intelecto", diff: 55, ok: { gold: 30, attr: ["intelecto", 5], msg: "Você descobriu o esconderijo de falsificadores e vendeu a informação ao bailio." }, fail: { msg: "A chuva apagou os rastros antes que você chegasse a uma conclusão." } },
        { label: "Organizar uma procissão com água benta e sal para abençoar as ruínas", attr: "fe", diff: 50, ok: { honor: 6, rep: 1, msg: "Os ruídos cessaram misteriosamente e sua fama de piedoso cresceu." }, fail: { honor: -2, msg: "Uma coruja voou sobre as tochas e fez metade dos fiéis correr de medo." } }
      ]
    },
    {
      id: "ev_new_festa_colheita_vinho", phase: ["Juventude","Adulto"], classes: ["any"], title: "A Noite das Pipas Abertas",
      desc: "A vindima terminou em {kingdom} e o vinho novo corre livremente ao som de tambores, violas e fogueiras.",
      choices: [
        { label: "Subir no tablado e liderar os brindes, cantigas e danças até a alvorada", attr: "carisma", diff: 52, ok: { rep: 1, attr: ["carisma", 5], hp: 5, msg: "Você foi a alma da festa e conquistou admiradores por toda a comarca!" }, fail: { gold: -12, hp: -4, msg: "Embriagado, você pagou rodadas demais e acordou com dor de cabeça." } },
        { label: "Competir no torneio de arremesso de barris e luta livre no terreiro", attr: "forca", diff: 58, ok: { gold: 22, attr: ["forca", 5], msg: "Você venceu os campeões locais e levou o prémio da festa!" }, fail: { hp: -10, msg: "Você distendeu um músculo ao tentar erguer o maior tonel." } },
        { label: "Aproveitar a distração geral para negociar grãos e barris a preço baixo", attr: "intelecto", diff: 55, ok: { gold: 35, msg: "Enquanto todos bebiam, você fechou o negócio mais lucrativo da estação." }, fail: { rep: -1, msg: "Chamaram você de avarento por fazer contas no meio da celebração." } }
      ]
    },
    {
      id: "ev_new_julgamento_bruxa", phase: ["Adulto","Velhice"], classes: ["any"], title: "A Velha Herborista no Pelourinho",
      desc: "Aldeões furiosos arrastam uma velha curandeira para a praça de {kingdom}, culpando suas ervas pela morte do gado de um homem rico.",
      choices: [
        { label: "Intervir com voz firme e provar que o gado morreu por beber água estagnada", attr: "intelecto", diff: 64, ok: { honor: 10, rep: 1, hp: 10, msg: "A velha foi libertada e entregou-lhe um elixir raro de longevidade!" }, fail: { rep: -2, hp: -8, msg: "A turba atirou pedras em você por defender a acusada." } },
        { label: "Exigir que o caso seja entregue à justiça formal e não à fúria da rua", attr: "fe", diff: 55, ok: { honor: 6, rep: 1, msg: "O magistrado apoiou sua intervenção e impediu o linchamento." }, fail: { honor: -3, msg: "Os ânimos estavam exaltados demais para ouvirem razões." } },
        { label: "Apoiar o homem rico na acusação para ganhar o favor político dele", attr: "carisma", diff: 50, ok: { gold: 25, honor: -12, msg: "O proprietário recompensou seu apoio, mas sua consciência pesou." }, fail: { honor: -10, rep: -1, msg: "Mais tarde descobriu-se a inocência dela e você ficou malvisto." } }
      ]
    },
    {
      id: "ev_new_embaixada_exotica", phase: ["Adulto","Velhice"], classes: ["media","nobre"], title: "Caravana das Rotas Distantes",
      desc: "Mercadores estrangeiros vestindo brocados de ouro chegam a {kingdom} trazendo animais raros, aço damasco de Al-Zahra e sedas de Tianxia.",
      choices: [
        { label: "Investir 40 moedas de ouro na compra de especiarias e lâminas orientais", attr: "intelecto", diff: 58, ok: { gold: 65, rep: 1, msg: "A revenda para a corte rendeu um lucro extraordinário!" }, fail: { gold: -40, msg: "Parte do lote estava húmido e você amargou prejuízo." } },
        { label: "Dialogar com o chefe da caravana sobre filosofia, astronomia e rotas", attr: "carisma", diff: 56, ok: { attr: ["intelecto", 6], attr2: ["carisma", 4], msg: "O sábio estrangeiro presenteou você com um astrolábio de latão!" }, fail: { msg: "A barreira do idioma dificultou um entendimento profundo." } },
        { label: "Desafiar o guarda-costas estrangeiro para um combate amistoso de exibição", attr: "destreza", diff: 64, ok: { rep: 2, attr: ["destreza", 6], gold: 25, msg: "Sua agilidade impressionou o embaixador, que lhe deu uma bolsa de ouro!" }, fail: { hp: -14, msg: "A lâmina cega dele deixou hematomas dolorosos nas suas costelas." } }
      ]
    },
    {
      id: "ev_new_inverno_fome_castelo", phase: ["Juventude","Adulto","Velhice"], classes: ["nobre"], title: "O Cerco da Nevasca",
      desc: "Três semanas de nevasca ininterrupta isolaram seu solar em {kingdom}. A lenha escasseia e os guardas reclamam da ração de carne salgada.",
      choices: [
        { label: "Liderar pessoalmente uma patrulha na neve para abater cervos e javalis na mata", attr: "forca", diff: 62, ok: { honor: 8, rep: 2, hp: 5, msg: "Você retornou com carne fresca em abundância e elevou o moral da guarnição!" }, fail: { hp: -18, msg: "O vento glacial congelou seus dedos e a caçada fracassou." } },
        { label: "Mandar queimar móveis velhos do salão e dividir sua própria adega com os soldados", attr: "carisma", diff: 52, ok: { honor: 10, rep: 1, gold: -15, msg: "Os homens juraram morrer por um senhor que partilha do mesmo frio que eles." }, fail: { gold: -20, msg: "Bebedeiras entre os guardas causaram brigas nos alojamentos." } },
        { label: "Racionar severamente os suprimentos sob pena de chibata para quem furtar", attr: "intelecto", diff: 58, ok: { gold: 15, msg: "A disciplina férrea garantiu que os estoques durassem até o degelo." }, fail: { rep: -2, honor: -5, msg: "O ressentimento espalhou-se silenciosamente pelos corredores." } }
      ]
    },
    {
      id: "ev_new_chantagem_segredo", phase: ["Adulto","Velhice"], classes: ["any"], title: "A Carta Selada com Cera Negra",
      desc: "Um mensageiro entrega um bilhete anónimo: alguém afirma conhecer um deslize oculto do seu passado e exige 30 moedas de ouro até a meia-noite.",
      choices: [
        { label: "Ir ao ponto de encontro armado e emboscar o chantagista nas sombras", attr: "destreza", diff: 64, ok: { gold: 20, rep: 1, msg: "Você rendeu o patife, recuperou as provas e ainda tomou a bolsa dele!" }, fail: { hp: -18, rep: -2, msg: "Havia dois capangas esperando; você foi ferido e o rumor espalhou-se." } },
        { label: "Comparar a caligrafia do bilhete com os registos do burgo para expor o autor", attr: "intelecto", diff: 62, ok: { rep: 2, honor: 5, msg: "Você desmascarou um escrivão corrupto e virou o jogo contra ele!" }, fail: { gold: -30, msg: "Sem conseguir descobrir a tempo, você teve de pagar para evitar o escândalo." } },
        { label: "Ignorar a ameaça e declarar publicamente que não teme caluniadores", attr: "carisma", diff: 58, ok: { honor: 4, msg: "Sua postura inabalável fez o chantagista recuar sem provas suficientes." }, fail: { rep: -3, honor: -8, msg: "Os boatos correram pelas tavernas e mancharam sua reputação." } }
      ]
    },
    {
      id: "ev_new_ponte_pedagio", phase: ["Juventude","Adulto"], classes: ["any"], title: "Os Ladrões da Ponte Velha",
      desc: "Ao cruzar o desfiladeiro de {kingdom}, três homens maltrapilhos armados com piques bloqueiam a ponte exigindo dez moedas de passagem.",
      choices: [
        { label: "Investir de espada em punho e arremessar o líder nas águas do rio", attr: "forca", diff: 60, ok: { gold: 18, honor: 5, attr: ["forca", 4], msg: "Com o chefe na correnteza, os outros dois largaram as armas e fugiram!" }, fail: { hp: -16, gold: -15, msg: "Os piques feriram seu flanco e levaram sua bolsa." } },
        { label: "Fingir ser o batedor avançado de uma companhia de cavaleiros que vem logo atrás", attr: "carisma", diff: 56, ok: { attr: ["carisma", 5], msg: "Assustados com a aproximação imaginária, eles abriram caminho às pressas!" }, fail: { gold: -12, msg: "Eles perceberam o blefe e cobraram o pedágio dobrado." } },
        { label: "Descer pela margem escarpada e atravessar o rio a vau longe das vistas deles", attr: "destreza", diff: 52, ok: { attr: ["destreza", 4], msg: "Você cruzou pelas pedras rasas sem perder uma única moeda." }, fail: { hp: -8, msg: "A água gelada e a correnteza deixaram você exausto e resfriado." } }
      ]
    },
    {
      id: "ev_new_epidemia_gado", phase: ["Adulto","Velhice"], classes: ["plebeu","nobre"], title: "A Peste Cinzenta dos Rebanhos",
      desc: "Vacas e ovelhas amanhecem caídas nos pastos de {kingdom}. Se o mal se espalhar, a fome e a ruína serão certas.",
      choices: [
        { label: "Abater imediatamente os animais doentes, queimar as carcaças com cal e isolar o pasto", attr: "intelecto", diff: 58, ok: { gold: -15, rep: 2, msg: "O sacrifício calculado salvou o restante do rebanho da comarca!" }, fail: { gold: -40, msg: "A medida veio tarde demais e metade da criação pereceu." } },
        { label: "Trabalhar dia e noite cavando valas de drenagem para secar o pântano vizinho", attr: "forca", diff: 60, ok: { attr: ["forca", 5], gold: 20, msg: "Com a água limpa renovada, o rebanho recuperou o vigor!" }, fail: { hp: -12, gold: -20, msg: "O trabalho extenuante sob a chuva derrubou sua saúde." } },
        { label: "Convidar os monges para benzer os campos com relíquias sagradas", attr: "fe", diff: 54, ok: { honor: 6, gold: 10, msg: "Os ventos mudaram e a mortandade estancou nos dias seguintes." }, fail: { gold: -25, msg: "As preces consolaram o povo, mas os prejuízos foram severos." } }
      ]
    },
    {
      id: "ev_new_aprendiz_genio", phase: ["Adulto","Velhice"], classes: ["media"], title: "O Jovem Órfão Talentoso",
      desc: "Um garoto de rua observa seu trabalho em {kingdom} e reproduz uma peça complexa usando apenas restos descartados.",
      choices: [
        { label: "Acolhê-lo como aprendiz formal sob seu teto e ensinar-lhe os segredos do ofício", attr: "carisma", diff: 50, ok: { gold: 30, honor: 6, rep: 1, msg: "A gratidão e o talento do jovem aumentaram a produção da sua oficina!" }, fail: { gold: -12, msg: "Após aprender o básico, o rapaz partiu com uma ferramenta sua." } },
        { label: "Aproveitar a mão de obra barata dele exigindo longas jornadas no porão", attr: "intelecto", diff: 58, ok: { gold: 45, honor: -8, msg: "Você lucrou alto vendendo o trabalho dele como se fosse seu." }, fail: { rep: -2, gold: -15, msg: "Mestres rivais descobriram a exploração e contrataram o jovem contra você." } },
        { label: "Apresentá-lo aos síndicos da guilda em troca de prestígio institucional", attr: "sorte", diff: 48, ok: { rep: 2, honor: 4, msg: "Os anciãos da corporação louvaram sua generosidade." }, fail: { msg: "O garoto assustou-se com os mestres e fugiu de volta para os becos." } }
      ]
    },
    {
      id: "ev_new_disputa_heranca_tio", phase: ["Adulto"], classes: ["any"], title: "O Testamento do Parente Distante",
      desc: "Um tio-avô solitário faleceu em {kingdom} deixando um baú de moedas e terras, mas primos distantes contestam seu direito no tribunal.",
      choices: [
        { label: "Contratar um legista escolástico e apresentar a árvore genealógica completa", attr: "intelecto", diff: 60, ok: { gold: 60, msg: "O magistrado reconheceu seu sangue como legítimo sucessor do espólio!" }, fail: { gold: -15, msg: "As custas judiciais consumiram suas moedas e o baú ficou retido." } },
        { label: "Propor aos primos uma divisão amigável regada a vinho para evitar processos", attr: "carisma", diff: 52, ok: { gold: 35, honor: 4, msg: "Todos saíram satisfeitos e você recebeu sua parte em ouro vivo." }, fail: { gold: 10, msg: "Eles aceitaram o acordo, mas ficaram com a melhor parte." } },
        { label: "Ir até a casa do defunto à noite e retirar o baú antes do inventário oficial", attr: "destreza", diff: 64, ok: { gold: 75, honor: -8, msg: "Quando os oficiais chegaram pela manhã, o ouro já estava seguro com você!" }, fail: { rep: -2, gold: -25, msg: "Você foi flagrado violando os selos judiciais e pagou multa pesada." } }
      ]
    },
    {
      id: "ev_new_retrato_pintor", phase: ["Juventude","Adulto"], classes: ["media","nobre"], title: "O Mestre Retratista na Corte",
      desc: "Um mestre pintor itinerante encanta-se com seu porte em {kingdom} e propõe retratar sua efígie com pigmentos raros.",
      choices: [
        { label: "Posar com trajes de gala, joias e óleos perfumados para imortalizar sua graça", attr: "beleza", diff: 52, ok: { attr: ["beleza", 7], rep: 1, honor: 5, msg: "A obra ficou deslumbrante! Sua fama de beleza e elegância correu pelos salões (+7 Beleza, +1 Rep)." }, fail: { gold: -15, msg: "A pintura demorou dias cansativos e custou boas moedas." } },
        { label: "Pedir que o pintor retrate você cercado de livros, armas e insígnias de poder", attr: "carisma", diff: 54, ok: { rep: 2, honor: 6, msg: "A obra transmitiu autoridade majestosa aos olhos da corte!" }, fail: { honor: -2, msg: "Críticos acharam a composição ostentosa demais." } },
        { label: "Agradecer a honra, mas encomendar um afresco sacro para o santuário local", attr: "fe", diff: 45, ok: { attr: ["fe", 6], honor: 6, msg: "Sua modéstia pia comoveu o clero e o povo." }, fail: { gold: -10, msg: "Você custeou as tintas do altar." } }
      ]
    }
  ];
}
