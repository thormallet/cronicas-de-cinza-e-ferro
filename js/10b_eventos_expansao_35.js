/* ============================================================================
   [EVENTOS · EXPANSÃO v3.5] — eventos narrativos de alta intensidade, dilemas
   morais, Quick-Time Events (QTE) e consequências de honra e reputação
   ============================================================================ */
function buildEventsExpansao35() {
  return [
    /* ========================================================================
       QUICK-TIME EVENTS (QTE) — Reações instantâneas de alta adrenalina
       ======================================================================== */
    {
      id: "ev_qte_emboscada_ponte",
      isQTE: true,
      qteDuration: 4000,
      icon: "⚔️",
      phase: ["Juventude", "Adulto", "Velhice"],
      classes: ["any"],
      title: "Emboscada na Garganta do Lobo",
      desc: "Ao cruzar a estreita Garganta do Lobo em {city}, salteadores armados saltam abruptamente do penhasco exigindo seu cavalo, suas armas e sua bolsa de moedas!",
      choices: [
        {
          label: "Esquivar com rolamento veloz por baixo das lâminas dos salteadores",
          attr: "destreza", diff: 60,
          ok: { hp: 4, attr: ["destreza", 2], honor: 6, gold: 18, msg: "Com reflexos felinos, você rolou sob as lanças, desarmou o flanco e fez os salteadores recuarem assustados!" },
          fail: { hp: -16, gold: -20, msg: "A esquiva foi curta; uma lâmina cortou seu braço e os ladrões levaram sua bolsa no caos." }
        },
        {
          label: "Bloquear o ataque com a montaria e o escudo erguido em guarda de ferro",
          attr: "forca", diff: 62,
          ok: { honor: 8, rep: 1, attr: ["forca", 2], msg: "Seu bloqueio demolidor desequilibrou dois atacantes e você abriu caminho pela força!" },
          fail: { hp: -18, honor: -3, msg: "O impacto partiu sua defesa, derrubando você na poeira antes de conseguir reagir." }
        },
        {
          label: "Desembainhar num relance e contra-atacar o líder com golpe mortal",
          attr: "destreza", diff: 65,
          ok: { gold: 35, rep: 2, honor: 10, attr: ["forca", 2], msg: "Num corte relâmpago, você tombou o líder da quadrilha; os demais fugiram em pânico pelas fendas!" },
          fail: { hp: -22, honor: -4, gold: -15, msg: "A lâmina travou por um instante e você sofreu um golpe profundo no ombro." }
        },
        {
          label: "Ajoelhar-se na lama, entregar o cavalo e a bolsa, e implorar por piedade",
          attr: "carisma", diff: 45,
          ok: { gold: -30, honor: -12, rep: -2, msg: "Eles riram da sua covardia e pouparam sua vida, mas a vergonha de rastejar na lama manchará seu nome para sempre." },
          fail: { gold: -40, hp: -12, honor: -16, rep: -2, msg: "Mesmo após rastejar na lama, eles espancaram você na estrada antes de deixá-lo no chão." }
        }
      ]
    },
    {
      id: "ev_qte_cavalo_disparado",
      isQTE: true,
      qteDuration: 4000,
      icon: "🐎",
      phase: ["Juventude", "Adulto", "Velhice"],
      classes: ["any"],
      title: "Cavalo Desgovernado na Feira",
      desc: "Um destriero assustado rompe as amarras e dispara furioso pelas barracas da feira em {city}, galopando cego na direção de uma criança indefesa!",
      choices: [
        {
          label: "Puxar a rédea do animal com força brutal travando o bocado com as próprias mãos",
          attr: "forca", diff: 62,
          ok: { honor: 12, rep: 2, attr: ["forca", 2], msg: "Com poder muscular descomunal, você conteve o destriero pelas rédeas, salvando a criança sob aclamação geral!" },
          fail: { hp: -18, honor: 4, msg: "O peso do animal arrastou você pelo chão; a criança escapou, mas seus braços e costelas sofreram fortes pisões." }
        },
        {
          label: "Empurrar a criança com um salto acrobático certeiro para fora do trajeto dos cascos",
          attr: "destreza", diff: 58,
          ok: { honor: 10, rep: 1, attr: ["destreza", 2], msg: "Você voou como um raio, rolando com a criança nos braços para a segurança das esteiras de trigo!" },
          fail: { hp: -14, honor: 2, msg: "Você conseguiu afastar a criança, mas um casco raspou sua perna na queda." }
        },
        {
          label: "Gritar com autoridade estrondosa para abrir passagem e assustar a montaria com um manto",
          attr: "carisma", diff: 55,
          ok: { honor: 8, rep: 1, attr: ["carisma", 1], msg: "Seu grito ordenou a multidão e o movimento do manto fez o cavalo desviar rente à criança!" },
          fail: { hp: -12, honor: -2, msg: "O animal não desviou o bastante e derrubou caixotes pesados sobre seus ombros." }
        },
        {
          label: "Saltar para trás e proteger a própria vida sem se intrometer no perigo",
          attr: "sorte", diff: 45,
          ok: { honor: -10, rep: -2, msg: "Você escapou ileso, mas os olhares indignados dos aldeões condenaram sua omissão covarde diante da criança." },
          fail: { honor: -14, rep: -2, hp: -8, msg: "Na fuga desajeitada, você tropeçou numa estaca de barraca e foi publicamente vaiado por covardia." }
        }
      ]
    },
    {
      id: "ev_qte_lamina_banquete",
      isQTE: true,
      qteDuration: 4000,
      icon: "🗡️",
      phase: ["Juventude", "Adulto", "Velhice"],
      classes: ["any"],
      title: "Lâmina Sob o Veludo",
      desc: "Durante um brinde de honra em {city}, um copeiro traidor saca um punhal reluzente com veneno verde e avança diretamente contra o suserano!",
      choices: [
        {
          label: "Derrubar a pesada mesa de banquete para interceptar a investida do traidor",
          attr: "forca", diff: 58,
          ok: { honor: 12, rep: 2, gold: 35, msg: "A mesa tombou com estrondo, prensando o assassino contra os ladrilhos e salvando o senhor (+35 Ouro de recompensa)!" },
          fail: { hp: -10, honor: -3, msg: "A mesa estava pesada demais e você escorregou em jarras entornadas enquanto o pânico se alastrava." }
        },
        {
          label: "Desviar o golpe no ar com um tapa preciso no pulso do assassino",
          attr: "destreza", diff: 64,
          ok: { honor: 14, rep: 2, attr: ["destreza", 2], gold: 40, msg: "Reflexo magistral! O punhal venenoso voou pelo ar cravando no tabuado, e o traidor foi imobilizado." },
          fail: { hp: -20, honor: 4, msg: "Você impediu a morte do suserano, mas o fio da lâmina envenenada rasgou sua mão causando dores atrozes!" }
        },
        {
          label: "Bloquear a estocada no peito interpondo um pesado cálice de ferro maciço",
          attr: "destreza", diff: 56,
          ok: { honor: 10, rep: 1, gold: 25, msg: "O punhal bateu no cálice de ferro com faíscas brilhantes! O atentado gorou e a nobreza ovacionou sua presteza." },
          fail: { hp: -12, msg: "O metal desviou a ponta, mas o baque feriu seus dedos e o derrubou entre os convivas." }
        },
        {
          label: "Ficar paralisado de propósito e fingir pavor para não atrair a lâmina envenenada",
          attr: "carisma", diff: 45,
          ok: { honor: -12, rep: -2, msg: "Outro guardião agiu a tempo, mas sua hesitação covarde ficou gravada na memória de todos os nobres presentes." },
          fail: { honor: -16, rep: -3, hp: -6, msg: "Na correria que se seguiu você foi empurrado contra taças quebradas e taxado de cúmplice covarde." }
        }
      ]
    },
    {
      id: "ev_qte_incendio_palheiro",
      isQTE: true,
      qteDuration: 4000,
      icon: "🔥",
      phase: ["Juventude", "Adulto", "Velhice"],
      classes: ["any"],
      title: "Fogo nas Estrebarias",
      desc: "Tochas caídas ateiam fogo vivo nas estrebarias em {city}. Labaredas crepitam pelo teto de palha e os relinchos dos animais e gritos dos moços presos ecoam pelo pátio!",
      choices: [
        {
          label: "Arrombar a tranca em chamas da porta a pontapés e ombradas implacáveis",
          attr: "forca", diff: 62,
          ok: { honor: 10, rep: 2, attr: ["forca", 2], msg: "A madeira em brasa partiu-se sob seu impacto! Cavalos e moços ganharam a noite em segurança sob sua bravura." },
          fail: { hp: -18, honor: 2, msg: "Uma viga ardente desabou antes de abrir o ferrolho; você sofreu queimaduras severas nos ombros." }
        },
        {
          label: "Cobrir a cabeça com manto molhado e adentrar o inferno de fumo para soltar as baias",
          attr: "saude", diff: 58,
          ok: { honor: 12, rep: 1, attr: ["saude", 2], msg: "Com vigor pulmonar de aço, você cruzou o fogo, desatou todas as baias e liderou o resgate milagroso!" },
          fail: { hp: -20, msg: "A fumaça tóxica queimou seus brônquios; você foi retirado quase sem sentidos pelos baldes da vila." }
        },
        {
          label: "Guiar as montarias pelo fumo com calma e firmeza vocal abrindo passagem segura",
          attr: "carisma", diff: 56,
          ok: { honor: 8, rep: 1, gold: 20, msg: "Sua voz firme tranquilizou os cavalos aterrorizados, conduzindo-os para fora um a um sob gratidão dos criadores!" },
          fail: { hp: -12, msg: "O pânico dos animais assustados resultou em coices e empurrões violentos contra as paredes em brasas." }
        },
        {
          label: "Apanhar apenas os próprios pertences e correr para longe sem olhar para trás",
          attr: "sorte", diff: 45,
          ok: { honor: -10, rep: -2, msg: "Você salvou suas tralhas, mas a vila inteira testemunhou seu egoísmo desprezível enquanto criaturas pereciam." },
          fail: { honor: -14, rep: -2, hp: -8, gold: -15, msg: "Brasas voaram queimando suas roupas na fuga e você foi escorraçado pela população como covarde vil." }
        }
      ]
    },

    /* ========================================================================
       DILEMAS MORAIS, HONRA, TRAIÇÃO E DESTINO
       ======================================================================== */
    {
      id: "ev_adu_divida_sangue",
      icon: "📜",
      phase: ["Adulto", "Velhice"],
      classes: ["any"],
      title: "A Dívida de Sangue do Passado",
      desc: "Um nobre corrupto de {kingdom} aborda você a sós exibindo uma promessa selada há anos por seus antepassados. Ele exige falso testemunho num litígio de terras para favorecer sua linhagem, sob ameaça de ruína pública!",
      choices: [
        {
          label: "Recusar categoricamente a chantagem e declarar em alto e bom som que sua honra não está à venda",
          attr: "forca", diff: 62,
          ok: { honor: 14, rep: 2, attr: ["forca", 2], msg: "Sua determinação inabalável desarmou o conspirador; temendo ser denunciado, ele recuou e rasgou a promessa!" },
          fail: { rep: -2, gold: -25, msg: "O nobre usou sua influência com bailios venais para cobrar taxas ilegais em represália à sua recusa." }
        },
        {
          label: "Examinar os códices da chancelaria com minúcia para anular a dívida pelas leis do reino",
          attr: "intelecto", diff: 60,
          ok: { honor: 8, rep: 1, gold: 20, attr: ["intelecto", 2], msg: "Você provou que o documento fora fraudado décadas atrás e humilhou o patrício perante os juízes!" },
          fail: { gold: -20, honor: -2, msg: "Os escrivãos da comarca cobraram custas altíssimas e demoraram a validar sua petição." }
        },
        {
          label: "Convocar sacerdotes conceituados para arbitrar a disputa sob juramento sagrado",
          attr: "carisma", diff: 56,
          ok: { honor: 6, rep: 1, gold: -10, msg: "A arbitragem eclesiástica protegeu sua dignidade e reduziu as exigências do nobre a termos moderados." },
          fail: { gold: -20, msg: "Os clérigos exigiram compensação aos fundos paroquiais para homologar o acordo." }
        },
        {
          label: "Ceder à exigência torpe e cometer falso testemunho para livrar a própria pele",
          attr: "sorte", diff: 48,
          ok: { gold: 35, honor: -14, rep: -2, msg: "O corrupto cumpriu o pagamento, mas a pecha de perjuro e traidor da justiça corroerá sua alma." },
          fail: { honor: -16, rep: -3, gold: -25, hp: -10, msg: "O magistrado farejou a farsa, declarou seu perjúrio e aplicou pesada pena por cumplicidade criminosa!" }
        }
      ]
    },
    {
      id: "ev_adu_calunia_pracadeser",
      icon: "⚖️",
      phase: ["Adulto", "Velhice"],
      classes: ["any"],
      title: "A Calúnia no Pelourinho Público",
      desc: "Em plena feira movimentada de {city}, um rival desonesto aponta o dedo para você diante do {guard} e do povo, acusando sua pessoa de traição, calotes e perjúrio contra os nobres locais!",
      choices: [
        {
          label: "Subir no pelourinho e rebater a calúnia com oratória inflamada e testemunhas fidedignas",
          attr: "carisma", diff: 60,
          ok: { honor: 10, rep: 2, attr: ["carisma", 2], msg: "Sua retórica apaixonada eletrizou a praça! O povo vaiou o difamador e carregou você em triunfo cívico." },
          fail: { rep: -2, honor: -4, msg: "O alarido da multidão abafou seus argumentos e murmúrios venenosos permaneceram no ar." }
        },
        {
          label: "Exigir de pronto o Julgamento de Deus em duelo singular para lavar a honra com aço",
          attr: "forca", diff: 64,
          ok: { honor: 12, rep: 2, attr: ["forca", 2], msg: "Ante a frieza da sua lâmina desembainhada, o difamador amarelou e admitiu a armação de joelhos!" },
          fail: { hp: -18, honor: 2, msg: "Você venceu a liça, mas uma estocada profunda no flanco cobrou alto preço do seu vigor." }
        },
        {
          label: "Apresentar livros contábeis e certidões seladas para destruir a mentira na letra fria da lei",
          attr: "intelecto", diff: 56,
          ok: { honor: 8, rep: 1, gold: 15, msg: "O juiz multou o caluniador sumariamente e concedeu a você indenização em moedas de prata!" },
          fail: { gold: -15, rep: -1, msg: "A burocracia dos cartórios foi morosa e você arcou com as taxas de abertura de processo." }
        },
        {
          label: "Abaixar a fronte, fugir da praça pelas vielas e deixar que falem o que quiserem",
          attr: "sorte", diff: 45,
          ok: { honor: -10, rep: -2, msg: "Você escapou da confusão física, mas a fuga soou como confissão indiscutível em todos os cantos do burgo." },
          fail: { honor: -14, rep: -3, hp: -8, msg: "Mendigos e desocupados apedrejaram suas costas na retirada, taxando você de traidor covarde." }
        }
      ]
    },
    {
      id: "ev_adu_herege_encruzilhada",
      icon: "🕯️",
      phase: ["Juventude", "Adulto", "Velhice"],
      classes: ["any"],
      title: "Os Manuscritos da Encruzilhada Sombria",
      desc: "Cavalgando por uma trilha erma ao cair da noite em {kingdom}, você flagra encapuzados transportando caixas lacradas. São pergaminhos e relíquias sagradas saqueadas da abadia; eles oferecem uma arca de ouro pelo seu silêncio!",
      choices: [
        {
          label: "Erguer o crucifixo e repudiar o ouro maldito, ordenando a restituição das relíquias em nome da fé",
          attr: "fe", diff: 58,
          ok: { honor: 12, rep: 2, attr: ["fe", 2], msg: "Sua firmeza espiritual aterrorizou os conspiradores; eles largaram as caixas e fugiram pelas trevas!" },
          fail: { hp: -14, honor: 4, msg: "Eles riram de sua oração e atacaram em superioridade numérica, ferindo seu flanco antes de bater em retirada." }
        },
        {
          label: "Lançar-se de espada desembainhada contra a escolta armada e recuperar os tesouros à força",
          attr: "destreza", diff: 62,
          ok: { honor: 10, rep: 2, gold: 30, attr: ["destreza", 2], msg: "Com golpes velozes no escuro, você neutralizou a guarda dos hereges e entregou o espólio ao bispado!" },
          fail: { hp: -18, gold: -10, msg: "Eles armaram uma contra-emboscada entre as urzes e feriram você gravemente antes de fugir." }
        },
        {
          label: "Examinar as arcas sob a tocha para decifrar os tratados ocultos antes de devolvê-los à Igreja",
          attr: "intelecto", diff: 60,
          ok: { attr: ["intelecto", 2], honor: 4, gold: 20, msg: "Você assimilou saberes botânicos e filosóficos arcanos raríssimos antes de devolver as relíquias!" },
          fail: { honor: -4, rep: -1, msg: "Você foi surpreendido com páginas heréticas nas mãos e precisou jurar inocência diante do tribunal episcopal." }
        },
        {
          label: "Embolsar a arca de ouro e fazer vista grossa para o sacrilégio sob o manto da noite",
          attr: "carisma", diff: 48,
          ok: { gold: 50, honor: -14, rep: -2, attr: ["fe", -4], msg: "Você embolsou 50 moedas de ouro corrompido, mas o peso do sacrilégio e a fama nefasta assombrarão seu nome." },
          fail: { gold: 20, honor: -16, rep: -3, hp: -10, msg: "Eles entregaram menos do prometido e o apunhalaram à traição; para piorar, o prior soube de sua omissão sacrílega!" }
        }
      ]
    },
    {
      id: "ev_velhice_testamento_disputa",
      icon: "👴",
      phase: ["Velhice"],
      classes: ["any"],
      title: "A Rapina à Beira do Leito",
      desc: "Debilitado por febres no leito em {city}, você desperta e flagra parentes ingratos e falsos herdeiros brigando abertamente aos gritos pela divisão da sua herança, baús e terras antes do seu último suspiro!",
      choices: [
        {
          label: "Erguer-se com semblante austero de patriarca e expulsar os abutres de casa sob maldição familiar",
          attr: "carisma", diff: 58,
          ok: { honor: 12, rep: 2, attr: ["carisma", 2], msg: "Sua imponência moral calou os ingratos! Eles recuaram trêmulos de vergonha e a dignidade retornou ao seu lar." },
          fail: { hp: -8, honor: 2, msg: "O acesso de tosse abafou parte do discurso, mas sua atitude austera dispersou o tumulto no quarto." }
        },
        {
          label: "Chamar imediatamente o tabelião régio e o clérigo para lavrar novo testamento deserdando os aproveitadores",
          attr: "intelecto", diff: 56,
          ok: { honor: 10, rep: 1, boostHeirs: true, msg: "A caneta foi mais letal que a espada: seus leais herdeiros foram blindados por escritura irrevogável!" },
          fail: { gold: -15, msg: "As taxas do notário de urgência pesaram no bolso, embora sua vontade tenha sido registrada." }
        },
        {
          label: "Empunhar o pesado cajado de carvalho e fustigar as costas dos insolentes para provar que ainda há vigor nestes ossos",
          attr: "forca", diff: 60,
          ok: { honor: 8, rep: 1, attr: ["forca", 1], msg: "Braço de ferro! Bastonadas certeiras fizeram os sobrinhos cobiçosos correrem aos berros pelo corredor afora." },
          fail: { hp: -12, msg: "Uma pontada forte na lombar forçou você a largar o bastão, arrancando sorrisos insolentes dos parentes." }
        },
        {
          label: "Ceder ao desânimo da velhice, fechar os olhos e deixar que partilhem suas arcas sem resistência",
          attr: "sorte", diff: 45,
          ok: { gold: -40, honor: -10, rep: -2, msg: "Eles esvaziaram seus baús sob seu olhar cansado, comemorando desavergonhadamente a rendição do velho patriarca." },
          fail: { gold: -60, honor: -14, rep: -2, hp: -8, msg: "Eles tomaram quase tudo o que construiu em décadas, deixando apenas amargura e desonra em seus dias finais." }
        }
      ]
    },

    /* ========================================================================
       INFÂNCIA, JUVENTUDE, COMBATE E COMUNIDADE
       ======================================================================== */
    {
      id: "ev_inf_maca_pomar_guarda",
      icon: "🍎",
      phase: ["Infância"],
      classes: ["plebeu", "media"],
      title: "A Macieira Proibida do Castelo",
      desc: "Na comarca de {kingdom}, galhos carregados de maçãs rubras pendem para fora do muro do senhor feudal. Outros meninos desafiam você a saltar o muro e colher os frutos proibidos vigiados pela guarda!",
      choices: [
        {
          label: "Escalar os muros de pedra com destreza felina e colher as melhores frutas",
          attr: "destreza", diff: 44,
          ok: { hp: 6, attr: ["destreza", 1], honor: 4, msg: "Você saltou com graça ágil, encheu a túnica com maçãs doces e fez a alegria da garotada!" },
          fail: { hp: -6, msg: "O musgo fez seu pé escorregar e você caiu num espinheiro ralando joelhos e queixo." }
        },
        {
          label: "Abordar o velho feitor do pomar com respeito e pedir as frutas caídas do pé",
          attr: "carisma", diff: 42,
          ok: { honor: 6, attr: ["carisma", 1], hp: 4, msg: "Encantado com sua boa educação, o feitor presenteou o grupo com um cesto de maçãs frescas!" },
          fail: { honor: -2, msg: "O guarda resmungão não deu ouvidos e expulsou as crianças a gritos." }
        },
        {
          label: "Empurrar um companheiro para a frente para que ele leve a culpa se os cães latirem",
          attr: "sorte", diff: 40,
          ok: { honor: -8, rep: -1, msg: "Você não se machucou, mas o grupo inteiro desprezou sua atitude desleal e covarde." },
          fail: { hp: -4, honor: -10, rep: -2, msg: "O guarda pegou você pela gola no ato da covardia e entregou-o aos seus pais sob vara." }
        }
      ]
    },
    {
      id: "ev_juv_dilema_guarda_portao",
      icon: "🚪",
      phase: ["Juventude"],
      classes: ["any"],
      title: "O Fugitivo sob o Toque de Recolher",
      desc: "Os grandes portões de {city} estão fechando ao cair da noite quando um lavrador com o filho arfando de febre implora entrada para procurar auxílio, mas o {guard} exige um tributo de passagem que o homem não possui.",
      choices: [
        {
          label: "Pagar a taxa do camponês com suas parcas economias e garantir o socorro da criança",
          attr: "fe", diff: 46,
          ok: { gold: -6, honor: 8, rep: 1, attr: ["fe", 2], msg: "Sua compaixão nobre tocou a sentinela e salvou a vida do infante (+8 Honra, +1 Rep)!" },
          fail: { gold: -10, honor: 4, msg: "A sentinela cobrou sobretaxa abusiva, mas você não desistiu até ver a família abrigada." }
        },
        {
          label: "Argumentar energicamente com o oficial sobre as santas leis do asilo e da hospitalidade",
          attr: "carisma", diff: 54,
          ok: { honor: 6, rep: 1, attr: ["carisma", 1], msg: "Sua oratória convincente fez o comandante amolecer o coração e abrir a cancela sem custos!" },
          fail: { rep: -1, msg: "O guarda ríspido cruzou a lança e ordenou que não se intrometesse nas leis do feudo." }
        },
        {
          label: "Apoiar a expulsão do forasteiro para cortejar a simpatia dos guardas e passar por leal",
          attr: "intelecto", diff: 48,
          ok: { honor: -10, rep: -1, msg: "Os guardas riram da sua frieza e o deixaram passar, mas a vileza de virar as costas aos enfermos manchou sua honra perante os presentes." },
          fail: { honor: -14, rep: -2, msg: "Cidadãos que assistiam à cena reprovaram publicamente sua insensibilidade vil e vaiaram sua atitude covarde." }
        }
      ]
    },
    {
      id: "ev_adu_prisioneiro_resgate",
      icon: "🛡️",
      phase: ["Adulto"],
      classes: ["any"],
      title: "O Cavaleiro Prisioneiro e a Palavra de Honra",
      desc: "Após um recontro armado nos caminhos de {kingdom}, você subjuga um cavaleiro nobre ferido. Ele jura solenemente soltar 60 moedas de ouro como resgate legítimo caso você trate suas feridas e o liberte sob palavra de honra.",
      choices: [
        {
          label: "Confiar na palavra jurada do cavaleiro, estancar suas feridas e conceder-lhe salvo-conduto",
          attr: "fe", diff: 55,
          ok: { gold: 60, honor: 12, rep: 2, msg: "Semanas depois, emissários da casa dele entregaram as 60 moedas com efusivos louvores à sua nobreza cavalheiresca!" },
          fail: { gold: -15, honor: 4, msg: "A família demorou meses e pagou apenas após longas cartas, gerando gastos com mensageiros." }
        },
        {
          label: "Encarcerar o fidalgo em masmorra úmida até que o ouro sonante tilintar na sua mesa",
          attr: "intelecto", diff: 58,
          ok: { gold: 50, honor: -8, rep: -1, msg: "A desconfiança avara garantiu as moedas, mas o encarceramento indigno manchou sua honra perante a cavalaria." },
          fail: { gold: -15, honor: -10, rep: -2, msg: "Parentes do prisioneiro acionaram os tribunais acusando-o de vil crueldade contra um nobre de armas." }
        },
        {
          label: "Vender o cativo ferido a mercenários sem escrúpulos por uma ninharia imediata",
          attr: "sorte", diff: 48,
          ok: { gold: 25, honor: -14, rep: -2, msg: "Você recebeu 25 moedas sem esforço, mas a ordem da cavalaria amaldiçoou seu nome por vileza indigna de guerreiro." },
          fail: { gold: 10, honor: -16, rep: -3, hp: -10, msg: "Os mercenários enganaram você na pesagem do ouro e atacaram seu séquito; seu nome ficou manchado para sempre." }
        }
      ]
    },
    {
      id: "ev_adu_motim_mineiros",
      icon: "⚒️",
      phase: ["Adulto", "Velhice"],
      classes: ["media", "nobre"],
      title: "A Fúria no Fosso dos Ferreiros",
      desc: "Mineiros e forjadores de {city} armam-se com barras de ferro e tochas ardentes, cercando a intendência contra a fome e a opressão. A tensão é máxima e o fogo pode consumir a guilda inteira!",
      choices: [
        {
          label: "Ir desarmado ao centro do tumulto e negociar um pacto de justiça para o trabalho dos operários",
          attr: "carisma", diff: 60,
          ok: { honor: 10, rep: 2, gold: 20, attr: ["carisma", 2], msg: "Sua integridade e coragem civil acalmaram os ânimos! O trabalho foi retomado sob lealdade e respeito mútuo." },
          fail: { hp: -16, rep: -2, msg: "Pedras e lascas de carvão voaram no ar; você sofreu ferimentos dolorosos antes que houvesse trégua." }
        },
        {
          label: "Liderar a guarda de lanças e reprimir o levante com punho de ferro impiedoso",
          attr: "forca", diff: 62,
          ok: { rep: -1, gold: 35, honor: -8, msg: "A rebelião foi esmagada pela força bruta; a ordem foi reposta, mas a crueldade contra os trabalhadores manchou seu nome no burgo." },
          fail: { hp: -20, rep: -3, honor: -12, msg: "Os operários lutaram com desespero selvagem; a forja ardeu em chamas e perdas graves foram sofridas sob repúdio geral." }
        },
        {
          label: "Doar provisões de pão e cerveja dos seus celeiros para abrandar a revolta popular",
          attr: "intelecto", diff: 54,
          ok: { gold: -25, honor: 8, rep: 2, msg: "Sua generosidade prudente desfez o rancor e a plebe celebrou seu patronato de forma calorosa!" },
          fail: { gold: -35, msg: "A turba demandou mais concessões e a despesa superou suas estimativas." }
        },
        {
          label: "Fugir a cavalo pelas portas dos fundos e abandonar a cidade à mercê da fúria cega",
          attr: "sorte", diff: 45,
          ok: { honor: -12, rep: -3, msg: "Você manteve a pele intacta, mas foi marcado para sempre pelo estigma infame da deserção em hora crítica." },
          fail: { honor: -16, rep: -3, gold: -40, hp: -10, msg: "Amotinados cercaram sua carruagem na fuga, saquearam seus cofres e o desonraram em praça pública." }
        }
      ]
    }
  ];
}
