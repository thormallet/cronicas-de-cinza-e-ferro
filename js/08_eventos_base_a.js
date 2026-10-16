/* ============================================================================
   [EVENTOS · CATÁLOGO MANUAL A] — eventos narrativos escritos à mão (parte A), devolvidos por função para manter objetos novos a cada chamada
   ============================================================================ */
function buildEventsBaseA() {
  return [
    {
      id: "ev_inf_febre", phase: ["Infância"], classes: ["any"], title: "Febre da Calada da Noite",
      desc: "Em {kingdom}, o vento húmido do inverno penetra pelas frestas. Você sente calafrios intensos enquanto sua família prepara infusões ao pé da lareira.",
      choices: [
        { label: "Enrolar-se firme nos cobertores de lã crua e suar a febre até o amanhecer", attr: "saude", diff: 42, ok: { hp: 8, attr: ["saude", 5], msg: "Seu organismo superou a febre rapidamente e criou resistência duradoura." }, fail: { hp: -4, msg: "A tosse persistiu por algumas semanas, mas você se recuperou." } },
        { label: "Segurar o amuleto sagrado e acompanhar as preces sussurradas por sua mãe", attr: "fe", diff: 40, ok: { attr: ["fe", 5], hp: 6, msg: "O conforto espiritual acalmou seu sono até a febre ceder." }, fail: { hp: -3, msg: "Você teve pesadelos febris antes de melhorar." } },
        { label: "Engolir de uma vez o caldo amargo de raízes fervidas pela velha parteira", attr: "sorte", diff: 38, ok: { hp: 10, msg: "O xarope caseiro cortou o mal-estar já na manhã seguinte." }, fail: { hp: -4, msg: "O gosto horrível revirava o estômago, mas o perigo passou." } }
      ]
    },
    {
      id: "ev_inf_lobo_aldeia", phase: ["Infância"], classes: ["plebeu","media"], title: "Sombra entre as Árvores",
      desc: "Ao brincar perto da orla da mata de {kingdom}, você avista um lobo solitário de pelagem cinzenta farejando o chão a poucos passos.",
      choices: [
        { label: "Escalar rapidamente os galhos baixos do carvalho mais próximo", attr: "destreza", diff: 40, ok: { attr: ["destreza", 6], msg: "Você subiu nos galhos com agilidade admirável até a fera desistir!" }, fail: { hp: -4, msg: "Você ralou os joelhos na casca áspera da árvore ao subir às pressas." } },
        { label: "Brandir um galho seco em chamas e gritar alertando os lenhadores", attr: "forca", diff: 45, ok: { attr: ["forca", 6], rep: 1, msg: "Os homens ouviram seu brado firme e enxotaram o predador!" }, fail: { hp: -5, msg: "Você tropeçou na lama ao recuar, levando apenas um susto." } },
        { label: "Abaixar-se imóvel atrás das pedras musgosas controlando a respiração", attr: "sorte", diff: 40, ok: { attr: ["sorte", 6], msg: "O vento mudou de direção e o animal seguiu outro rastro sem notá-lo." }, fail: { hp: -3, msg: "Os espinhos da moita rasgaram sua túnica e arranharam seus braços." } }
      ]
    },
    {
      id: "ev_inf_berco_nobre", phase: ["Infância"], classes: ["nobre"], title: "O Preceptor Severo",
      desc: "Seu pai contratou um velho erudito de {kingdom} para ensinar-lhe genealogia, clássicos antigos e etiqueta da corte com régua de madeira na mão.",
      choices: [
        { label: "Passar a madrugada decorando os tratados e surpreendê-lo na arguição", attr: "intelecto", diff: 45, ok: { attr: ["intelecto", 8], msg: "O mestre elogiou sua mente afiada perante toda a família." }, fail: { hp: -2, msg: "O estudo exaustivo cansou sua vista sob a luz das velas." } },
        { label: "Elogiar a sabedoria do velho mestre e conduzir a conversa com cortesia", attr: "carisma", diff: 45, ok: { attr: ["carisma", 6], honor: 4, msg: "Você conquistou a simpatia do preceptor e evitou os castigos." }, fail: { honor: -2, msg: "Ele percebeu sua adulação e dobrou os exercícios de cópia." } },
        { label: "Escapar pela janela do solar para espiar o treino dos guerreiros no pátio", attr: "destreza", diff: 45, ok: { attr: ["forca", 6], msg: "Você aprendeu posturas de combate observando os veteranos de perto." }, fail: { honor: -3, msg: "Os guardas levaram você de volta pelas orelhas para a sala de estudos." } }
      ]
    },
    {
      id: "ev_juv_escolha_caminho", phase: ["Juventude"], classes: ["any"], title: "A Encruzilhada da Juventude",
      desc: "O tempo da infância ficou para trás em {kingdom}. Os mais velhos exigem que você tome rumo e mostre de que fibra é feito.",
      choices: [
        { label: "Tomar as tarefas mais pesadas na forja e no pátio de armas até calejar as mãos", attr: "forca", diff: 50, ok: { attr: ["forca", 10], msg: "Seus ombros alargaram e seu braço ganhou potência respeitável." }, fail: { attr: ["forca", 4], hp: -4, msg: "O esforço excessivo deixou dores musculares, mas você endureceu." } },
        { label: "Trancar-se com os escribas e mestres para dominar cálculos, mapas e leis", attr: "intelecto", diff: 50, ok: { attr: ["intelecto", 10], msg: "Você aprendeu a decifrar contratos, cartas náuticas e crônicas." }, fail: { attr: ["intelecto", 4], msg: "O aprendizado foi lento sob a fumaça das velas de sebo." } },
        { label: "Frequentar as rodas de mercadores e emissários nas feiras do burgo", attr: "carisma", diff: 50, ok: { attr: ["carisma", 10], gold: 15, msg: "Sua eloquência rendeu boas moedas e alianças promissoras." }, fail: { rep: -1, msg: "Você fez promessas precipitadas a homens mais experientes." } }
      ]
    },
    {
      id: "ev_juv_valentao", phase: ["Juventude"], classes: ["any"], title: "Rixa no Pátio de Lama",
      desc: "Um jovem mais velho e corpulento cospe no chão e zomba do nome da sua linhagem diante de uma roda de curiosos.",
      choices: [
        { label: "Avançar sem hesitar e derrubá-lo na lama no braço e na cabeçada", attr: "forca", diff: 55, ok: { rep: 1, honor: 5, attr: ["forca", 6], msg: "Você o deixou estatelado no barro sob os gritos da roda!" }, fail: { hp: -8, honor: -3, msg: "Você saiu com o lábio cortado, mas não recuou um passo." } },
        { label: "Virar a multidão contra ele com um impropério espirituoso e humilhante", attr: "carisma", diff: 55, ok: { rep: 1, attr: ["carisma", 6], msg: "Todos riram tanto da estupidez dele que ele se retirou rubro de fúria." }, fail: { hp: -6, msg: "Sem argumentos, ele partiu para a agressão e acertou seu queixo." } },
        { label: "Fingir indiferença e armar uma emboscada no beco estreito ao anoitecer", attr: "destreza", diff: 55, ok: { attr: ["destreza", 6], flag: "vingativo", msg: "Um golpe certeiro na escuridão ensinou-lhe a temer seu nome." }, fail: { rep: -1, honor: -5, msg: "Vigias noturnos flagraram você tocaiando nas sombras." } }
      ]
    },
    {
      id: "ev_adu_coletor_impostos", phase: ["Adulto","Velhice"], classes: ["plebeu","media"], title: "Os Homens do Fisco",
      desc: "O coletor de impostos de {kingdom} chega escoltado por dois guardas mal-encarados, exigindo uma derrama extraordinária para os cofres soberanos.",
      choices: [
        { label: "Abrir a arca e entregar 20 moedas de ouro mantendo a cabeça erguida", attr: "sorte", diff: 10, ok: { gold: -20, honor: 2, msg: "Você pagou o tributo sem dar pretexto para confiscos maiores." }, fail: { gold: -20, msg: "O ouro foi levado pelos oficiais." } },
        { label: "Exibir pergaminhos de foral antigo contestando a legalidade da cobrança", attr: "intelecto", diff: 65, ok: { rep: 1, msg: "O escrivão temeu violar os costumes antigos e isentou sua casa!" }, fail: { gold: -30, hp: -5, msg: "Irritados com sua insolência jurídica, cobraram multa dobrada." } },
        { label: "Ocultar o ouro num fundo falso sob a lareira e chorar miséria absoluta", attr: "destreza", diff: 65, ok: { attr: ["destreza", 5], msg: "Revistaram os colchões de palha e partiram de mãos abanando." }, fail: { gold: -35, hp: -12, rep: -1, msg: "Acharam o esconderijo com as lanças e espancaram você na rua." } }
      ]
    },
    {
      id: "ev_adu_peste_aldeia", phase: ["Juventude","Adulto","Velhice"], classes: ["any"], title: "A Carroça dos Mortos",
      desc: "Portas marcadas com cruzes de cal surgem na sua rua. O cheiro acre de vinagre e fumaça anuncia que a pestilência entrou em {kingdom}.",
      choices: [
        { label: "Calafetar janelas, estocar água limpa e queimar alecrim e enxofre", attr: "intelecto", diff: 60, ok: { gold: -12, msg: "A quarentena rigorosa manteve o miasma longe do seu teto." }, fail: { hp: -15, msg: "Mesmo trancado, a febre rastejou para dentro da casa." } },
        { label: "Sair com panos embebidos em vinagre para levar água e conforto aos vizinhos", attr: "fe", diff: 65, ok: { rep: 2, honor: 10, attr: ["fe", 6], msg: "Sua caridade heroica salvou almas e você permaneceu intocado pelo mal!" }, fail: { hp: -25, honor: 5, msg: "Você contraiu a febre negra ao amparar os moribundos." } },
        { label: "Esgueirar-se à noite pelos casarões vazios para recolher joias sem dono", attr: "destreza", diff: 60, ok: { gold: 45, honor: -12, msg: "Você encheu a algibeira com anéis e cálices dos defuntos." }, fail: { hp: -20, rep: -2, honor: -15, msg: "Além de ser visto como saqueador de mortos, você se contaminou!" } }
      ]
    },
    {
      id: "ev_adu_acusacao_heresia", phase: ["Adulto","Velhice"], classes: ["any"], title: "A Sombra do Inquisidor",
      desc: "Um inquisidor de olhos fundos aponta para você no adro do templo de {kingdom}, mencionando denúncias anónimas de práticas heterodoxas.",
      choices: [
        { label: "Doar 30 moedas de ouro para as obras sagradas e carregar o círio na procissão", attr: "fe", diff: 55, ok: { gold: -30, honor: 4, msg: "O gesto público de devoção e ouro encerrou o inquérito." }, fail: { gold: -30, rep: -2, msg: "Aceitaram o donativo, mas os olhares desconfiados permaneceram." } },
        { label: "Debater publicamente citando as escrituras e desmontar a calúnia ponto a ponto", attr: "intelecto", diff: 70, ok: { rep: 2, attr: ["intelecto", 6], msg: "Sua erudição deixou o acusador em silêncio diante dos prelados!" }, fail: { hp: -18, rep: -3, flag: "marcado_inquisicao", msg: "Sua altivez irritou o tribunal e você sofreu penitência pública." } },
        { label: "Descobrir quem fez a denúncia anónima e fazê-lo retirar a queixa sob ameaça", attr: "forca", diff: 65, ok: { rep: 1, honor: -5, msg: "O delator fugiu da comarca e o processo foi arquivado por falta de provas." }, fail: { hp: -22, gold: -40, msg: "Os meirinhos prenderam você por coação às testemunhas do tribunal." } }
      ]
    },
    {
      id: "ev_adu_proposta_bastardo", phase: ["Adulto"], classes: ["any"], title: "Segredo de Sangue",
      desc: "Uma figura encapuzada bate à sua porta sob a chuva trazendo uma criança nos braços, fruto de um encontro furtivo que você julgara esquecido.",
      choices: [
        { label: "Erguer a criança diante da casa, dar-lhe seu sobrenome e criá-la como sangue legítimo", attr: "carisma", diff: 35, ok: { honor: 5, rep: -1, addChild: true, msg: "Você acolheu o pequeno sob seu manto e assumiu sua responsabilidade." }, fail: { addChild: true, msg: "Você acolheu a criança apesar dos cochichos maldosos da vizinhança." } },
        { label: "Entregar uma bolsa com 35 moedas de ouro para que seja criada num burgo distante", attr: "sorte", diff: 45, ok: { gold: -35, msg: "O acordo foi selado em silêncio e ninguém jamais soube." }, fail: { gold: -35, rep: -2, msg: "O ouro foi aceito, mas os criados espalharam o boato pelas tavernas." } },
        { label: "Trancar a porta na cara do visitante e jurar que tudo não passa de uma extorsão vil", attr: "carisma", diff: 65, ok: { honor: -6, msg: "Sua frieza convenceu os presentes de que era uma armadilha." }, fail: { rep: -3, honor: -10, msg: "O escândalo explodiu na praça e manchou sua honra." } }
      ]
    },
    {
      id: "ev_nobre_revolta_servos", phase: ["Adulto","Velhice"], classes: ["nobre"], title: "Forquilhas e Tochas",
      desc: "Camponeses famintos de {kingdom}, exauridos pelas corveias de outono, cercam o portão do seu solar brandindo foices e exigindo pão.",
      choices: [
        { label: "Montar os homens de armas encouraçados e dispersar a turba a golpes de lança", attr: "forca", diff: 65, ok: { rep: 2, honor: -6, gold: 30, msg: "O choque da cavalaria quebrou a revolta; o tributo foi cobrado a ferro." }, fail: { hp: -20, gold: -50, msg: "Pedradas e foices derrubaram sua escolta e incendiaram o celeiro!" } },
        { label: "Sair à sacada sem elmo, mandar abrir três silos de grãos e ouvir os anciãos", attr: "carisma", diff: 60, ok: { gold: -25, rep: 2, honor: 8, msg: "Os servos ajoelharam-se abençoando a justiça da sua casa." }, fail: { gold: -45, rep: -1, msg: "Tomaram sua clemência por medo e saquearam a despensa inteira." } },
        { label: "Infiltrar agentes na multidão para capturar e enforcar apenas os três agitadores", attr: "intelecto", diff: 65, ok: { rep: 1, msg: "Sem os líderes, a massa recuou em silêncio para as cabanas." }, fail: { hp: -12, rep: -2, msg: "A tentativa falhou e inflamou ainda mais o motim nos portões." } }
      ]
    },
    {
      id: "ev_adu_tesouro_ruina", phase: ["Juventude","Adulto"], classes: ["any"], title: "A Cripta sob as Raízes",
      desc: "Após um temporal derrubar uma árvore secular em {kingdom}, revela-se a abóbada rachada de um mausoléu antigo.",
      choices: [
        { label: "Amarrar uma corda na cintura e descer com uma tocha acesa pelo fosso", attr: "destreza", diff: 65, ok: { gold: 75, attr: ["sorte", 6], msg: "Você saltou sobre lajes podres e resgatou um cofre de moedas imperiais!" }, fail: { hp: -18, msg: "A corda cedeu no limo e você caiu sobre pedras pontiagudas." } },
        { label: "Limpar o musgo do dintel e traduzir os avisos gravados na pedra arcaica", attr: "intelecto", diff: 60, ok: { attr: ["intelecto", 6], gold: 40, msg: "A inscrição indicava exatamente onde estava o relicário oculto." }, fail: { msg: "O texto estava corroído demais e o túnel acabou desmoronando com a chuva." } },
        { label: "Chamar o sacerdote local para aspergir água benta e lacrar a cova antiga", attr: "fe", diff: 45, ok: { attr: ["fe", 6], honor: 4, msg: "Sua piedade foi louvada no sermão da comunidade." }, fail: { msg: "Forasteiros violaram o lacre durante a madrugada e levaram tudo." } }
      ]
    }
  ];
}
