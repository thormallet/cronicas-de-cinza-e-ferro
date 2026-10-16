/* ============================================================================
   [ENGINE · PROVAÇÃO TÁTICA · INÍCIO] — provação de ofício em 3 fases (startSpecialJobTrial)
   ============================================================================ */
Object.assign(Engine, {
  /* ==========================================================================
     EVENTOS ESPECIAIS INTERATIVOS COM MECÂNICAS PRÓPRIAS DE OFÍCIO (3 RODADAS)
     ========================================================================== */
  startSpecialJobTrial(customKind = null) {
    if (!STATE) return;
    const activeId = STATE.guildTraining ? STATE.guildTraining.jobId : STATE.job;
    const martialIds = ["soldado","mercenario","cavaleiro","escudeiro","falcoeiro"];
    const clergyIds = ["monge","freira","clerigo","abadessa","inquisidor","bispo"];
    const craftIds = ["artesao","bordadeira","ferreiro","pedreiro","ourives","moleiro","mineiro","lenhador","lavadeira","servo","campones","pastor"];
    const scholarIds = ["erudito","medico","alquimista","curandeiro","parteira","juiz","chanceler","diplomata"];
    const rogueIds = ["ladrao","bandido","pirata","espiao","coveiro"];
    const explorerIds = ["explorador","cacador","pescador"];

    let kind = customKind;
    if (!kind) {
      if (explorerIds.includes(activeId)) kind = "expedition";
      else if (martialIds.includes(activeId)) kind = (activeId === "cavaleiro" || activeId === "escudeiro") && Math.random() < 0.5 ? "joust" : "battle";
      else if (clergyIds.includes(activeId)) kind = "inquisition";
      else if (craftIds.includes(activeId)) kind = "masterpiece";
      else if (scholarIds.includes(activeId)) kind = "surgery";
      else if (rogueIds.includes(activeId)) kind = "heist";
      else kind = "gala";
    }

    const templates = {
      battle: {
        title: "⚔️ [Batalha Campal] O Choque das Linhas de Ferro",
        enemyLabel: "Moral da Hoste Inimiga",
        playerLabel: "Coesão da Sua Ala",
        stages: [
          {
            desc: "Fase 1/3 (Vanguarda): Os besteiros inimigos disparam uma nuvem negra de virotes enquanto a infantaria avança pelo barro.",
            choices: [
              { label: "🛡️ Erguer parede de escudos em formação tartaruga e avançar passo a passo", attr: "saude", diff: 52, dmg: 35, selfDmg: 10 },
              { label: "🏇 Ordenar carga rápida pelos flancos antes que recarreguem as bestas", attr: "destreza", diff: 58, dmg: 50, selfDmg: 22 },
              { label: "📯 Brado de guerra inflamado para manter os recrutas firmes sob a chuva de ferro", attr: "carisma", diff: 54, dmg: 40, selfDmg: 15 }
            ]
          },
          {
            desc: "Fase 2/3 (Corpo a Corpo): As lanças se despedaçam! O combate vira uma prensa brutal de espadas, maças e lama sangrenta.",
            choices: [
              { label: "⚔️ Abrir uma cunha a golpes pesados de aço rumo ao porta-estandarte", attr: "forca", diff: 60, dmg: 50, selfDmg: 24 },
              { label: "🗡️ Explorar as frestas das armaduras inimigas com estocadas ágeis", attr: "destreza", diff: 56, dmg: 42, selfDmg: 16 },
              { label: "📐 Reorganizar a segunda fileira de piques para esmagar o centro adversário", attr: "intelecto", diff: 58, dmg: 45, selfDmg: 14 }
            ]
          },
          {
            desc: "Fase 3/3 (Desfecho): O comandante inimigo vacila com a guarda aberta no alto da colina!",
            choices: [
              { label: "🦁 Investida pessoal decisiva para derrubar o líder inimigo no aço", attr: "forca", diff: 64, dmg: 60, selfDmg: 25 },
              { label: "🏹 Concentrar salva certeira sobre a guarda pessoal do comandante", attr: "destreza", diff: 60, dmg: 50, selfDmg: 18 },
              { label: "👑 Intimar a rendição honrosa prometendo poupar a vida dos vencidos", attr: "carisma", diff: 62, dmg: 55, selfDmg: 15 }
            ]
          }
        ]
      },
      joust: {
        title: "🏇 [Grande Torneio de Justas] Três Carreiras de Lança",
        enemyLabel: "Equilíbrio do Campeão Rival",
        playerLabel: "Firmeza na Sua Sela",
        stages: [
          {
            desc: "1ª Carreira: As trombetas soam diante da tribuna real! O cavaleiro adversário baixa a lança pintada de negro.",
            choices: [
              { label: "🎯 Mirar na viseira do elmo para um impacto devastador", attr: "destreza", diff: 62, dmg: 55, selfDmg: 25 },
              { label: "🛡️ Cravar a lança no centro do escudo e travar os estribos com força bruta", attr: "forca", diff: 56, dmg: 42, selfDmg: 14 },
              { label: "🐎 Inclinar o torso no último instante para fazer a lança rival resvalar", attr: "sorte", diff: 54, dmg: 38, selfDmg: 10 }
            ]
          },
          {
            desc: "2ª Carreira: Lascas de freixo voam pela arena! Os destrieros bufam para o segundo encontro.",
            choices: [
              { label: "⚡ Esporear a galope máximo concentrando todo o peso no ombro do rival", attr: "forca", diff: 60, dmg: 50, selfDmg: 22 },
              { label: "📐 Golpear o canto superior do escudo onde a correia já está frouxa", attr: "intelecto", diff: 58, dmg: 46, selfDmg: 15 },
              { label: "✨ Saudar a dama na tribuna com graça soberana antes do choque", attr: "beleza", diff: 55, dmg: 42, selfDmg: 16 }
            ]
          },
          {
            desc: "3ª Carreira (Combate no Chão ou Lança Final): A multidão ergue-se em delírio para o choque derradeiro!",
            choices: [
              { label: "🗡️ Desmontar o rival com um golpe demolidor de maça/lança", attr: "forca", diff: 64, dmg: 60, selfDmg: 24 },
              { label: "🤺 Cansar o oponente pesado e atingi-lo na junta da couraça", attr: "destreza", diff: 60, dmg: 50, selfDmg: 16 },
              { label: "🙏 Invocar São Jorge e confiar o golpe final à fé e à honra", attr: "fe", diff: 58, dmg: 48, selfDmg: 15 }
            ]
          }
        ]
      },
      inquisition: {
        title: "⚖️ [Tribunal & Sínodo] O Grande Processo Canônico",
        enemyLabel: "Resistência da Tese Adversária",
        playerLabel: "Autoridade Doutrinária",
        stages: [
          {
            desc: "Sessão 1/3: Diante do capítulo reunido, o acusado apresenta argumentos capciosos que dividem os clérigos.",
            choices: [
              { label: "📕 Citar os Padres da Igreja e a Suma Teológica de memória em latim", attr: "intelecto", diff: 58, dmg: 48, selfDmg: 15 },
              { label: "✝️ Exortar o temor de Deus com voz trovejante que ecoa na abóbada", attr: "fe", diff: 56, dmg: 45, selfDmg: 14 },
              { label: "🕊️ Interrogar com mansidão paternal para que o próprio réu se contradiga", attr: "carisma", diff: 58, dmg: 46, selfDmg: 16 }
            ]
          },
          {
            desc: "Sessão 2/3: Surgem documentos selados e testemunhas conflitantes no púlpito.",
            choices: [
              { label: "🔍 Examinar a tinta e a caligrafia dos pergaminhos à luz de velas", attr: "destreza", diff: 56, dmg: 44, selfDmg: 14 },
              { label: "⚖️ Desmontar o sofisma jurídico com lógica escolástica impecável", attr: "intelecto", diff: 62, dmg: 52, selfDmg: 18 },
              { label: "🙏 Convocar juramento solene sobre as relíquias sagradas do altar", attr: "fe", diff: 58, dmg: 46, selfDmg: 15 }
            ]
          },
          {
            desc: "Sessão 3/3 (Sentença Final): Todos os olhares da diocese voltam-se para o seu veredito.",
            choices: [
              { label: "🔥 Pronunciar sentença exemplar que reafirma a ortodoxia e a lei", attr: "fe", diff: 62, dmg: 55, selfDmg: 20 },
              { label: "📜 Lavrar acórdão erudito reconciliando a paz da comarca e os dízimos", attr: "intelecto", diff: 60, dmg: 50, selfDmg: 15 },
              { label: "👑 Conquistar aclamação unânime dos prelados e nobres presentes", attr: "carisma", diff: 60, dmg: 50, selfDmg: 16 }
            ]
          }
        ]
      },
      masterpiece: {
        title: "🏆 [Exame da Guilda] A Forja da Grande Obra-Prima",
        enemyLabel: "Complexidade da Obra",
        playerLabel: "Integridade do Material",
        stages: [
          {
            desc: "Etapa 1/3 (Fundação): Os síndicos da corporação selam a oficina. Você precisa preparar a estrutura base.",
            choices: [
              { label: "🔥 Levar o forno/material ao limite máximo de resistência física", attr: "forca", diff: 56, dmg: 46, selfDmg: 18 },
              { label: "📐 Traçar proporções geométricas áureas com compasso e prumo", attr: "intelecto", diff: 58, dmg: 48, selfDmg: 14 },
              { label: "🛠️ Selecionar os veios mais puros pelo tato e experiência", attr: "destreza", diff: 56, dmg: 45, selfDmg: 15 }
            ]
          },
          {
            desc: "Etapa 2/3 (Execução): Na metade do trabalho, uma tensão oculta ameaça trincar a peça principal!",
            choices: [
              { label: "⚡ Corrigir a falha com mãos rápidas antes que o material esfrie", attr: "destreza", diff: 62, dmg: 54, selfDmg: 20 },
              { label: "🧪 Aplicar têmpera e liga especial aprendida nos segredos antigos", attr: "intelecto", diff: 58, dmg: 48, selfDmg: 15 },
              { label: "💪 Sustentar a prensa no braço por horas sem deixar o eixo ceder", attr: "saude", diff: 56, dmg: 44, selfDmg: 16 }
            ]
          },
          {
            desc: "Etapa 3/3 (Ornamentação e Julgamento): Os Mestres-Síndicos entram com lupas e balanças para o veredito.",
            choices: [
              { label: "✨ Cravar arabescos e filigranas de beleza estonteante", attr: "beleza", diff: 56, dmg: 48, selfDmg: 14 },
              { label: "🎯 Polir cada aresta até atingir precisão absoluta", attr: "destreza", diff: 60, dmg: 52, selfDmg: 18 },
              { label: "🗣️ Apresentar a obra com discurso eloquente sobre a glória da Guilda", attr: "carisma", diff: 58, dmg: 48, selfDmg: 15 }
            ]
          }
        ]
      },
      surgery: {
        title: "🩺 [Emergência na Corte] Tratamento de Alto Risco",
        enemyLabel: "Avanço do Mal / Crise",
        playerLabel: "Vitalidade do Paciente",
        stages: [
          {
            desc: "Fase 1/3 (Diagnóstico): Um alto dignitário arde em febre e delírio. Toda a corte observa suas mãos.",
            choices: [
              { label: "🔍 Examinar pulso, humores e reflexos segundo os tratados de Galeno", attr: "intelecto", diff: 58, dmg: 48, selfDmg: 14 },
              { label: "🌿 Preparar infusão imediata de ervas calmantes e triaga", attr: "destreza", diff: 56, dmg: 45, selfDmg: 15 },
              { label: "🙏 Acalmar a família em pânico com postura serena e confiante", attr: "carisma", diff: 54, dmg: 40, selfDmg: 12 }
            ]
          },
          {
            desc: "Fase 2/3 (Intervenção): O quadro agrava-se subitamente; é preciso intervir sem hesitar!",
            choices: [
              { label: "🔪 Realizar incisão e drenagem com precisão cirúrgica milimétrica", attr: "destreza", diff: 62, dmg: 54, selfDmg: 22 },
              { label: "⚗️ Administrar quinta-essência alquímica calculada gota a gota", attr: "intelecto", diff: 60, dmg: 50, selfDmg: 18 },
              { label: "🕯️ Sustentar o enfermo em vigília contínua durante toda a madrugada", attr: "saude", diff: 56, dmg: 44, selfDmg: 15 }
            ]
          },
          {
            desc: "Fase 3/3 (Convalescença): A crise atinge o clímax antes do amanhecer.",
            choices: [
              { label: "📜 Ajustar o regime de bálsamos para restaurar o equilíbrio humoral", attr: "intelecto", diff: 58, dmg: 50, selfDmg: 15 },
              { label: "✨ Aplicar unguentos cicatrizantes que não deixem marcas visíveis", attr: "beleza", diff: 54, dmg: 44, selfDmg: 14 },
              { label: "🍀 Arriscar um elixir raro de última hora", attr: "sorte", diff: 56, dmg: 48, selfDmg: 18 }
            ]
          }
        ]
      },
      heist: {
        title: "🎭 [Operação Noturna] Infiltração & Assalto",
        enemyLabel: "Defesas do Alvo",
        playerLabel: "Furtividade da Equipe",
        stages: [
          {
            desc: "Etapa 1/3 (Perímetro): Tochas patrulham os muros sob a garoa. É hora de entrar sem dar alarme.",
            choices: [
              { label: "🧗 Escalar a fachada de pedra pelas sombras usando arpéu", attr: "destreza", diff: 58, dmg: 48, selfDmg: 16 },
              { label: "🎭 Passar pelo portão disfarçado de emissário com selo falsificado", attr: "carisma", diff: 58, dmg: 48, selfDmg: 18 },
              { label: "🗡️ Neutralizar a sentinela solitária com um bote silencioso", attr: "forca", diff: 56, dmg: 45, selfDmg: 18 }
            ]
          },
          {
            desc: "Etapa 2/3 (Câmara Forte): Diante do cofre de ferro com fechadura tripla, passos aproximam-se no corredor!",
            choices: [
              { label: "🔓 Destravar os pinos da fechadura com gazuas finas pelo ouvido", attr: "destreza", diff: 62, dmg: 54, selfDmg: 20 },
              { label: "🧪 Corroer o pino mestre usando ácido alquímico sem fazer ruído", attr: "intelecto", diff: 58, dmg: 48, selfDmg: 15 },
              { label: "💪 Forçar a alavanca de ferro com potência bruta controlada", attr: "forca", diff: 60, dmg: 50, selfDmg: 22 }
            ]
          },
          {
            desc: "Etapa 3/3 (Fuga com o Espólio): Um cão de guarda late no pátio! Vocês precisam escapar com os sacos de ouro.",
            choices: [
              { label: "🌑 Deslizar pelos telhados e canais fluviais na cerração", attr: "destreza", diff: 60, dmg: 52, selfDmg: 18 },
              { label: "🔥 Lançar fumaça/distração no estábulo para abrir caminho", attr: "intelecto", diff: 58, dmg: 48, selfDmg: 15 },
              { label: "⚔️ Abrir caminho a ferro através dos guardas da ronda", attr: "forca", diff: 62, dmg: 52, selfDmg: 24 }
            ]
          }
        ]
      },
      gala: {
        title: "👑 [Grande Sarau da Corte] Noite de Intriga, Arte & Ouro",
        enemyLabel: "Ceticismo dos Grandes",
        playerLabel: "Seu Prestígio no Salão",
        stages: [
          {
            desc: "Ato 1/3 (Entrada Triunfal): Os arautos anunciam os presentes no salão iluminado por cem tochas de cera.",
            choices: [
              { label: "✨ Desfilar com porte deslumbrante e trajes de brocado impecáveis", attr: "beleza", diff: 54, dmg: 48, selfDmg: 12 },
              { label: "🗣️ Saudar os senhores com versos espirituosos e cortesia magnética", attr: "carisma", diff: 56, dmg: 48, selfDmg: 14 },
              { label: "📐 Observar as alianças de mesa e posicionar-se junto aos mais ricos", attr: "intelecto", diff: 56, dmg: 45, selfDmg: 14 }
            ]
          },
          {
            desc: "Ato 2/3 (O Centro das Atenções): Um rival tenta ofuscar sua presença diante do patrono principal.",
            choices: [
              { label: "🪕 Executar uma performance/discurso virtuoso de tirar o fôlego", attr: "destreza", diff: 60, dmg: 52, selfDmg: 18 },
              { label: "🌹 Encantar a mesa principal com charme irresistível e olhar envolvente", attr: "beleza", diff: 58, dmg: 50, selfDmg: 15 },
              { label: "🍷 Devolver a provocação com uma ironia fina que faz todo o salão rir dele", attr: "carisma", diff: 58, dmg: 48, selfDmg: 16 }
            ]
          },
          {
            desc: "Ato 3/3 (Consagração): É o momento de colher os frutos políticos e financeiros da noite.",
            choices: [
              { label: "💰 Fechar contrato exclusivo com os mecenas e mercadores da corte", attr: "intelecto", diff: 58, dmg: 50, selfDmg: 15 },
              { label: "👑 Receber o brinde de honra das mãos da alta nobreza", attr: "carisma", diff: 60, dmg: 52, selfDmg: 16 },
              { label: "🍀 Apostar alto na mesa de honra do banquete", attr: "sorte", diff: 56, dmg: 48, selfDmg: 18 }
            ]
          }
        ]
      },
      expedition: {
        title: "🧭 [Grande Expedição] Fronteiras do Desconhecido",
        enemyLabel: "Perigos da Terra Incógnita",
        playerLabel: "Vigor da Expedição",
        stages: [
          {
            desc: "Etapa 1/3 (Travessia Hostil): Tempestades e desfiladeiros sem trilha bloqueiam o avanço além das fronteiras de {city}.",
            choices: [
              { label: "🧭 Guiar o grupo pelas estrelas e relevo usando o astrolábio", attr: "intelecto", diff: 56, dmg: 48, selfDmg: 14 },
              { label: "🧗 Abrir caminho com cordas e facões pela encosta íngreme", attr: "destreza", diff: 58, dmg: 50, selfDmg: 18 },
              { label: "🛡️ Marchar na dianteira suportando o vento e a intempérie", attr: "saude", diff: 54, dmg: 44, selfDmg: 12 }
            ]
          },
          {
            desc: "Etapa 2/3 (Ruínas e Feras): No coração do território inexplorado, feras famintas guardam um entreposto antigo abandonado.",
            choices: [
              { label: "🏹 Abater o predador alfa à distância com disparo certeiro", attr: "destreza", diff: 60, dmg: 52, selfDmg: 16 },
              { label: "⚔️ Formar linha de lanças e expulsar a alcateia a ferro", attr: "forca", diff: 58, dmg: 48, selfDmg: 20 },
              { label: "🔥 Usar tochas de resina e fumaça para afugentar as feras sem baixas", attr: "intelecto", diff: 58, dmg: 48, selfDmg: 14 }
            ]
          },
          {
            desc: "Etapa 3/3 (O Retorno Triunfal): Com os alforjes carregados de mapas raros e relíquias, resta cruzar as correntes de retorno a {city}.",
            choices: [
              { label: "🗺️ Traçar a rota mestra definitiva para as guildas de {kingdom}", attr: "intelecto", diff: 60, dmg: 55, selfDmg: 15 },
              { label: "🍀 Seguir um atalho oculto pelas gargantas da montanha", attr: "sorte", diff: 56, dmg: 50, selfDmg: 18 },
              { label: "📯 Manter o moral da comitiva elevado até avistar os muros de {city}", attr: "carisma", diff: 58, dmg: 50, selfDmg: 14 }
            ]
          }
        ]
      }
    };

    const tpl = templates[kind] || templates.battle;
    STATE.specialTrial = {
      kind,
      title: tpl.title,
      enemyLabel: tpl.enemyLabel,
      playerLabel: tpl.playerLabel,
      enemyHp: 100,
      playerHp: 100,
      stageIdx: 0,
      stages: tpl.stages,
      logNotes: []
    };
    SoundFX.play("sword");
    UI.renderEventModal();
  }
});
