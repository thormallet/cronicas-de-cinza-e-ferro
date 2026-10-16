/* ============================================================================
   [EVENTOS · CATÁLOGO MANUAL B] — eventos narrativos escritos à mão (parte B), devolvidos por função para manter objetos novos a cada chamada
   ============================================================================ */
function buildEventsBaseB() {
  return [
    {
      id: "ev_adu_duelo_taverna", phase: ["Adulto"], classes: ["any"], title: "Aço Puxado sobre a Mesa",
      desc: "Um veterano embriagado vira seu jarro de vinho sobre a mesa e insulta a memória dos seus antepassados aos berros.",
      choices: [
        { label: "Desembainhar a lâmina num lampejo e exigir satisfação imediata em sangue", attr: "forca", diff: 65, ok: { rep: 2, honor: 6, gold: 20, msg: "Seu golpe certeiro derrubou o insolente antes que ele erguesse a guarda." }, fail: { hp: -22, honor: -2, msg: "O aço dele rasgou seu ombro num bote traiçoeiro." } },
        { label: "Virar o banco pesado nas pernas dele e imobilizá-lo com uma adaga na garganta", attr: "destreza", diff: 60, ok: { rep: 1, gold: 15, msg: "Humilhado no assoalho, ele implorou perdão e pagou pelo vinho derramado." }, fail: { hp: -15, msg: "Ele saltou para trás e golpeou seu rosto com o pomo da espada." } },
        { label: "Erguer-se sorrindo, propor um brinde irónico e fazer a taverna inteira rir dele", attr: "carisma", diff: 60, ok: { gold: -10, rep: 1, msg: "Desconcertado pelas gargalhadas, o bêbado tropeçou para fora na chuva." }, fail: { honor: -8, rep: -1, msg: "Os presentes julgaram que faltou coragem ao seu sangue." } }
      ]
    },
    {
      id: "ev_vel_legado_morte", phase: ["Velhice"], classes: ["any"], title: "O Peso dos Invernos",
      desc: "Suas juntas doem ao menor sinal de geada em {kingdom}. Diante do fogo baixo, você reflete sobre o que restará quando seus olhos se fecharem.",
      choices: [
        { label: "Passar as noites redigindo o Livro de Linhagem com conselhos estratégicos", attr: "intelecto", diff: 55, ok: { honor: 10, rep: 1, flag: "cronica_escrita", msg: "Sua sabedoria ficará imortalizada nos pergaminhos da família." }, fail: { honor: 3, msg: "A vista cansada borrou parte das páginas, mas a obra foi concluída." } },
        { label: "Fundar uma capelania perpétua com 50 moedas de ouro para sufrágio da alma", attr: "fe", diff: 45, ok: { gold: -50, attr: ["fe", 10], honor: 12, msg: "Seu brasão foi esculpido junto ao altar-mor para memória eterna." }, fail: { gold: -50, honor: 5, msg: "A doação foi registrada nos livros da paróquia." } },
        { label: "Convocar filhos e sobrinhos ao salão para transmitir-lhes seus segredos de vida", attr: "carisma", diff: 55, ok: { boostHeirs: 1, honor: 6, msg: "Seus herdeiros ouviram com reverência e amadureceram sob sua tutela!" }, fail: { msg: "Os mais jovens mostraram-se inquietos e ansiosos pela herança." } }
      ]
    },
    {
      id: "ev_new_casamento_arranjado", phase: ["Juventude","Adulto"], classes: ["nobre","media"], title: "Emissário de Aliança Matrimonial",
      desc: "Um arauto traz uma proposta formal em {kingdom}: uma família abastada deseja unir laços ou firmar um contrato nupcial vantajoso.",
      choices: [
        { label: "Exigir um dote maior e cláusulas de terras antes de assinar o pergaminho", attr: "intelecto", diff: 62, ok: { gold: 55, rep: 1, msg: "Sua astúcia negocial dobrou as vantagens do contrato para sua Casa!" }, fail: { rep: -1, msg: "A família ofendeu-se com sua ganância e retirou o emissário." } },
        { label: "Receber a comitiva com música, vinho fino e cortesia impecável", attr: "carisma", diff: 55, ok: { rep: 2, honor: 6, msg: "Encantados com sua hospitalidade, juraram amizade duradoura à sua linhagem." }, fail: { gold: -15, msg: "A recepção custou caro e terminou sem acordos concretos." } },
        { label: "Recusar qualquer interferência externa nos assuntos do seu coração", attr: "forca", diff: 45, ok: { honor: 4, msg: "Sua independência orgulhosa impôs respeito aos patriarcas." }, fail: { honor: -4, msg: "Acusaram você de desprezar as tradições diplomáticas." } }
      ]
    },
    {
      id: "ev_new_relíquia_falsa", phase: ["Adulto","Velhice"], classes: ["any"], title: "O Mercador de Relíquias",
      desc: "Um pregador itinerante exibe na praça de {kingdom} um frasco dizendo conter lágrimas de um santo mártir, cobrando moedas pela bênção.",
      choices: [
        { label: "Examinar o lacre de cera e o vidro para desmascarar a fraude em público", attr: "intelecto", diff: 64, ok: { rep: 2, attr: ["intelecto", 5], msg: "Você provou que o frasco continha água de rosas e expulsou o charlatão!" }, fail: { rep: -2, honor: -4, msg: "A multidão devota voltou-se contra você, chamando-o de blasfemo." } },
        { label: "Ajoelhar-se com devoção sincera e entregar 10 moedas pela bênção", attr: "fe", diff: 45, ok: { gold: -10, attr: ["fe", 6], honor: 5, msg: "Verdadeira ou não, sua fé inabalável trouxe paz profunda ao seu espírito." }, fail: { gold: -10, msg: "Você pagou as moedas e seguiu caminho." } },
        { label: "Negociar nos bastidores uma parte dos lucros dele em troca do seu silêncio", attr: "carisma", diff: 60, ok: { gold: 30, honor: -8, msg: "Assustado, o vendedor dividiu a bolsa de moedas com você antes de partir." }, fail: { rep: -2, msg: "Ele denunciou sua tentativa de extorsão aos guardas da feira." } }
      ]
    },
    {
      id: "ev_new_fome_inverno_lobos", phase: ["Juventude","Adulto","Velhice"], classes: ["any"], title: "Uivos Junto à Porta",
      desc: "A neve cobre os telhados de {kingdom}. Durante a madrugada, lobos famintos arranham a madeira da porta tentando entrar no abrigo dos animais.",
      choices: [
        { label: "Sair com lança de javali e tocha em punho para abater o macho alfa", attr: "forca", diff: 64, ok: { gold: 18, rep: 1, attr: ["forca", 5], msg: "Você cravou o ferro na fera e vendeu a pele espessa no mercado!" }, fail: { hp: -18, msg: "As presas rasgaram sua perna antes que a alcateia recuasse." } },
        { label: "Disparar pela seteira estreita do sótão mirando nos olhos brilhantes", attr: "destreza", diff: 60, ok: { attr: ["destreza", 6], msg: "Um disparo certeiro na escuridão pôs o bando em fuga imediata." }, fail: { gold: -15, msg: "As feras mataram uma criação antes de fugirem ao amanhecer." } },
        { label: "Reforçar as trancas com vigas de carvalho e manter o fogo alto até o sol nascer", attr: "intelecto", diff: 48, ok: { honor: 2, msg: "As defesas resistiram intactas à fúria da alcateia." }, fail: { hp: -6, msg: "O frio cortante da vigília noturna deixou você febril." } }
      ]
    },
    {
      id: "ev_new_naufragio_costa", phase: ["Juventude","Adulto"], classes: ["any"], title: "Destroços na Arrebentação",
      desc: "Uma galé mercante partiu-se nos rochedos próximos. Barris de vinho, fardos de seda e marinheiros desacordados dão à praia.",
      choices: [
        { label: "Mergulhar nas ondas geladas para arrastar os sobreviventes até a areia", attr: "saude", diff: 58, ok: { honor: 12, rep: 2, gold: 25, msg: "O capitão salvo recompensou seu heroísmo com um anel de sinete!" }, fail: { hp: -16, msg: "A correnteza jogou você contra as pedras e quase o afogou." } },
        { label: "Recolher rapidamente os baús mais valiosos antes que a guarda costeira chegue", attr: "destreza", diff: 58, ok: { gold: 55, honor: -6, msg: "Você ocultou sedas e especiarias numa gruta e vendeu tudo por bom ouro!" }, fail: { gold: -20, rep: -2, msg: "Patrulheiros confiscaram o saque e multaram você por pilhagem." } },
        { label: "Organizar os moradores para guardar a carga e cobrar taxa legal de salvamento", attr: "carisma", diff: 56, ok: { gold: 32, honor: 4, rep: 1, msg: "Os armadores pagaram a recompensa justa pela guarda das mercadorias." }, fail: { msg: "A confusão na praia impediu qualquer acordo organizado." } }
      ]
    },
    {
      id: "ev_new_veneno_banquete", phase: ["Adulto","Velhice"], classes: ["nobre","media"], title: "O Copeiro Nervoso",
      desc: "Durante um banquete importante em {kingdom}, você nota que o servo que lhe serve o cálice de vinho especiado está com as mãos trêmulas e suor frio na testa.",
      choices: [
        { label: "Obrigar o próprio servo a beber o primeiro gole da taça sob a ponta do punhal", attr: "forca", diff: 58, ok: { rep: 2, flag: "sobreviveu_veneno", msg: "O servo confessou em prantos a trama de um rival antes de beber!" }, fail: { honor: -5, rep: -1, msg: "O vinho era puro; você passou por paranoico e tirânico diante dos convivas." } },
        { label: "Derramar a taça disfarçadamente num vaso e observar quem vigia sua reação", attr: "intelecto", diff: 62, ok: { attr: ["intelecto", 6], rep: 1, msg: "Você identificou o mandante pelo olhar frustrado no outro lado do salão!" }, fail: { hp: -10, msg: "Você acabou provando algumas gotas que lhe causaram cólicas terríveis." } },
        { label: "Trocar sutilmente sua taça pela do convidado sentado à sua direita", attr: "destreza", diff: 65, ok: { honor: -8, attr: ["destreza", 5], msg: "O rival caiu espumando minutos depois, vítima da própria armadilha!" }, fail: { hp: -22, msg: "Perceberam o movimento das suas mãos e o tumulto foi generalizado." } }
      ]
    },
    {
      id: "ev_new_ferida_infeccionada", phase: ["Juventude","Adulto","Velhice"], classes: ["any"], title: "A Gangrena Rubra",
      desc: "Um corte antigo no braço inchou com linhas escuras e febre latejante. O barbeiro-cirurgião prepara ferros em brasa e sanguessugas.",
      choices: [
        { label: "Morder um pedaço de couro e mandar cauterizar a ferida com ferro em brasa", attr: "saude", diff: 60, ok: { hp: 10, attr: ["forca", 4], msg: "A dor foi lancinante, mas o fogo purificou a carne e salvou seu braço!" }, fail: { hp: -18, msg: "O choque da queimadura deixou você debilitado por meses." } },
        { label: "Recusar o ferro e aplicar cataplasmas de mel, alho e ervas segundo os antigos", attr: "intelecto", diff: 58, ok: { hp: 14, attr: ["intelecto", 4], msg: "O bálsamo natural extraiu a infecção sem deixar mutilação!" }, fail: { hp: -15, msg: "A febre demorou a ceder e consumiu suas forças." } },
        { label: "Lavar a chaga com água da fonte sagrada e passar a noite em vigília no templo", attr: "fe", diff: 55, ok: { hp: 12, attr: ["fe", 5], msg: "Ao amanhecer, o inchaço havia desaparecido como por milagre." }, fail: { hp: -14, msg: "A infecção cobrou pesado tributo do seu corpo antes de secar." } }
      ]
    },
    {
      id: "ev_new_desertor_foragido", phase: ["Adulto"], classes: ["any"], title: "O Desertor Ensanguentado",
      desc: "Um jovem soldado com o brasão rasgado esconde-se no seu quintal em {kingdom}, implorando água antes que a patrulha do preboste o alcance.",
      choices: [
        { label: "Fornecer roupas civis e indicar a trilha oculta pelos pântanos", attr: "destreza", diff: 56, ok: { honor: 8, gold: 15, msg: "Grato pela vida, ele deixou-lhe uma bolsa de moedas de campanha." }, fail: { gold: -25, rep: -2, msg: "O preboste descobriu seu auxílio e aplicou pesada multa por traição." } },
        { label: "Desarmá-lo e entregá-lo amarrado aos cavaleiros da patrulha", attr: "forca", diff: 52, ok: { gold: 25, rep: 1, honor: -6, msg: "Você recebeu a recompensa oficial pela captura do fugitivo." }, fail: { hp: -14, msg: "Desesperado para não ir à forca, ele feriu você com uma faca antes de fugir." } },
        { label: "Interceder diante do sargento da patrulha alegando que o rapaz é seu parente", attr: "carisma", diff: 62, ok: { honor: 6, rep: 1, msg: "Sua autoridade verbal convenceu os soldados a seguirem viagem." }, fail: { honor: -3, msg: "O sargento riu da sua mentira e levou o prisioneiro." } }
      ]
    },
    {
      id: "ev_new_manuscrito_proibido", phase: ["Juventude","Adulto","Velhice"], classes: ["media","nobre"], title: "O Códice de Cifras",
      desc: "Entre os pertences de um viajante falecido, você encontra um livro encadernado em couro negro repleto de diagramas alquímicos e cifras.",
      choices: [
        { label: "Passar meses decifrando os tratados de metalurgia e medicina oculta", attr: "intelecto", diff: 66, ok: { attr: ["intelecto", 9], gold: 35, msg: "Você dominou fórmulas raras que renderam ouro e saber extraordinário!" }, fail: { hp: -8, msg: "Os vapores de mercúrio dos experimentos intoxicaram seus pulmões." } },
        { label: "Vender o volume discretamente a um colecionador rico da Sereníssima", attr: "carisma", diff: 55, ok: { gold: 50, msg: "O comprador pagou uma pequena fortuna sem fazer perguntas." }, fail: { gold: 10, msg: "Temendo armadilhas, o mercador pagou apenas uma fração do valor." } },
        { label: "Entregar o livro imediatamente às autoridades religiosas para ser purificado pelo fogo", attr: "fe", diff: 40, ok: { honor: 6, rep: 1, attr: ["fe", 4], msg: "O clero elogiou sua retidão exemplar." }, fail: { msg: "O escrivão recebeu o livro com indiferença burocrática." } }
      ]
    },
    {
      id: "ev_new_incendio_forja", phase: ["Adulto"], classes: ["plebeu","media"], title: "Fogo no Quarteirão das Oficinas",
      desc: "Um caldeirão de piche vira no meio da rua estreita de {kingdom}, lançando labaredas contra as paredes de madeira seca.",
      choices: [
        { label: "Formar uma corrente humana com baldes do poço e derrubar o telhado vizinho com machado", attr: "forca", diff: 60, ok: { rep: 2, honor: 8, gold: 20, msg: "Sua liderança braçal conteve o incêndio e a guilda recompensou você!" }, fail: { hp: -16, msg: "Uma viga em chamas desabou sobre suas costas na fumaça." } },
        { label: "Correr para salvar suas ferramentas, livros-caixa e ouro antes que o fogo chegue", attr: "destreza", diff: 54, ok: { gold: 15, msg: "Você pôs todos os seus bens a salvo e ainda resgatou mercadorias vizinhas." }, fail: { gold: -25, msg: "A fumaça densa obrigou você a largar parte do património para trás." } },
        { label: "Coordenar a retirada das crianças e idosos pelos becos laterais", attr: "carisma", diff: 52, ok: { honor: 10, rep: 2, msg: "Nenhuma vida se perdeu graças ao seu sangue-frio no comando." }, fail: { hp: -10, msg: "Você inalou muita fuligem ao buscar os últimos moradores." } }
      ]
    },
    {
      id: "ev_new_cavalo_desgovernado", phase: ["Juventude","Adulto"], classes: ["any"], title: "O Destriero em Fúria",
      desc: "Na feira apinhada de {kingdom}, o corcel de guerra de um fidalgo assusta-se com tambores e dispara em direção a uma barraca cheia de pessoas.",
      choices: [
        { label: "Saltar à frente do animal e agarrar as rédeas de couro com a força dos braços", attr: "forca", diff: 64, ok: { rep: 2, honor: 8, gold: 30, msg: "Você deteve a besta espumante e o fidalgo recompensou sua bravura!" }, fail: { hp: -20, msg: "Os cascos ferrados atingiram seu peito ao tentar pará-lo." } },
        { label: "Empurrar as pessoas para fora do caminho num salto acrobático", attr: "destreza", diff: 56, ok: { honor: 7, rep: 1, msg: "Você salvou os transeuntes por um triz sem sofrer um arranhão." }, fail: { hp: -10, msg: "Você salvou uma criança, mas rolou rudemente sobre o calçamento." } },
        { label: "Assoviar alto e agitar uma capa para desviar o cavalo para o curral vazio", attr: "intelecto", diff: 58, ok: { attr: ["intelecto", 5], gold: 15, msg: "Sua presença de espírito guiou o animal sem confronto direto!" }, fail: { rep: -1, msg: "O cavalo ignorou o sinal e destroçou três barracas de cerâmica." } }
      ]
    }
  ];
}
