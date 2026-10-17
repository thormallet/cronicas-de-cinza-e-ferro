# Registro de Mudanças — Crônicas de Cinza e Ferro

Todas as alterações notáveis no projeto **Crônicas de Cinza e Ferro** estão documentadas neste arquivo.

O formato baseia-se nas diretrizes do [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/) e adere ao versionamento semântico.

---

## Sumário
- [4.2.0 — Edição Feudos & Dinastias](#420--2026-10-17) *(Destaque / Atual)*
- [3.5.1 — Patch de Rigor Medieval, Atrofia & Desgaste Vital](#351--2026-10-16)
- [3.5.0 — Quick-Time Events, Moralidade & Dilemas Feudais](#350--2026-10-16)
- [3.4.1 — 2026-10-16](#341--2026-10-16)
- [3.4.0 — Edição Explorador, Viagens & Carreiras Itinerantes](#340--edição-explorador-viagens--carreiras-itinerantes)
- [3.3.0 — Novo HUD Estilo BitLife & Design System](#330--novo-hud-estilo-bitlife--design-system)
- [3.2.1 — Edição Explorador Refinada & Antroponímia Regional](#321--edição-explorador-refinada--antroponímia-regional)
- [3.2.0 — Edição Explorador Completa & Mobilidade Geográfica](#320--edição-explorador-completa--mobilidade-geográfica)
- [3.1.2 — Soberano Único, Títulos Culturais & Consistência](#312--soberano-único-títulos-culturais--consistência)
- [3.1.1 — Hotfix de Provações, Placeholders & Mortalidade](#311--hotfix-de-provações-placeholders--mortalidade)
- [3.1.0 — Títulos Nobiliárquicos Dinâmicos & Cortes Feudais](#310--títulos-nobiliárquicos-dinâmicos--cortes-feudais)
- [3.0.0 — O Grande Salto Modular & Retratos Procedurais](#300--o-grande-salto-modular--retratos-procedurais)
- [2.0.0 — Reinos Históricos & Dinastias](#200--reinos-históricos--dinastias)
- [1.0.0 — Fundação de Cinza e Ferro](#100--fundação-de-cinza-e-ferro)

---

## [4.2.0] — 2026-10-17
### Edição Feudos & Dinastias (Simulação Social, Nobreza & Design Premium)

> **Destaque:** Esta grande atualização traz uma revolução na simulação dinástica e aristocrática medieval de Crônicas de Cinza e Ferro. Implementa a ausência de funções administrativas e de títulos pessoais para crianças nobres, progressão social balanceada em três gerações, rigor institucional de honra e reputação com regra assimétrica de revogação, sucessão dinástica com renovação social e preservação consanguínea estrita, custos anuais de sustento de filhos menores escalonados por estamento, vinculação de concessões nobiliárquicas à saúde do reino, degradação patrimonial com confisco por abandono e sobretaxa para imóveis remotos. Na camada visual e sonora, estreia o novo design system 'Dark Medieval BitLife Premium' (obsidiana, veludo e ouro polido), ergonomia mobile-first 100% calibrada (toque >= 48px), bottom sheets deslizantes de 85vh, HUD heráldico renovado e sintetizador sonoro Web Audio API expandido com feedback háptico.

#### Bloco A: Conteúdo & Simulação Social e Nobiliárquica
- **Nobres Crianças sem Funções Administrativas (< 16 anos sob Tutoria Pedagógica):**
  - Crianças aristocráticas com idade inferior a 16 anos não podem exercer cargos de regência, ditar éditos ou administrar feudos.
  - Permanecem em regime de tutoria pedagógica e estudos cortesãos (heráldica, latim, equitação e manejo de armas).
  - Bloqueio completo do painel de administração senhorial até a maioridade civil.
- **Crianças Nobres sem Título Nobiliárquico Pessoal ao Nascer:**
  - Nascituros de linhagens nobres herdam a casta social fidalga e o sangue dinástico, mas não ostentam títulos no berço.
  - As dignidades nobiliárquicas (Barão, Visconde, Conde, Marquês, Duque) exigem sucessão testamentária formal ou investidura régia ao atingir 16 anos.
- **Ascensão Social Balanceada em Três Gerações (~3 Gerações):**
  - Fim da ascensão meteórica e artificial de plebeu a grão-duque em uma única vida:
    - *1ª Geração:* Consolidação comercial burguesa e patrícia (comércio, guildas, oficinas, alódios e acúmulo de capital).
    - *2ª Geração:* Fidalguia de toga ou militar (erudição, solares senhoriais, magistratura ou cavalaria a serviço da Coroa).
    - *3ª Geração:* Nobreza titular senhorial plena (posse de castelo, feudo hereditário e carta de mercê outorgada pelo Soberano).
- **Requisitos Rigorosos de Honra e Reputação Régia com Revogação Assimétrica:**
  - Exigência de altos índices de Honra (65 a 85 pontos) e Reputação Régia positiva para concessão de títulos.
  - *Regra Assimétrica de Revogação:* Para garantir estabilidade e percurso narrativo justo, o título só é revogado se a Honra cair abaixo de 20 pontos por 3 anos consecutivos, evitando perdas intempestivas por flutuações temporárias.
- **Sucessão Dinástica com Renovação Social Inteligente:**
  - Preservação estrita dos laços consanguíneos diretos (pais, irmãos, filhos, avós e colaterais legítimos) e da corte do Soberano na transição testamentária.
  - Purga automática de vínculos obsoletos de terceiros (amigos idosos do pai, pretendentes caducos e desafetos arcaicos).
  - Geração autônoma de um círculo social novo e vibrante para o herdeiro (companheiros de idade similar, colegas de armas e novos pretendentes).
- **Custo Anual de Sustento de Filhos Menores por Classe Social:**
  - Despesas anuais automáticas de sustento e guarda para cada filho menor de 16 anos:
    - *Plebeu:* 4 moedas de ouro por filho menor.
    - *Burguês / Patrício:* 15 moedas de ouro por filho menor.
    - *Nobre:* 45 moedas de ouro por filho menor (tutores, comitiva, librés e manutenção senhorial).
- **Progressão Nobiliárquica Vinculada aos Indicadores do Reino:**
  - A Coroa audita os índices de Estabilidade, Ordem e Saúde Econômica do Reino antes de homologar cartas de nobreza.
  - Em períodos de crise ou guerra, a concessão exige generoso socorro financeiro e empréstimos à Coroa.
- **Degradação de Bens, Rendimento Zero em Ruína e Confisco Compulsório:**
  - Imóveis sem manutenção regular deterioram-se até o estado "Arruinado".
  - Imóveis arruinados geram exatamente 0 moedas de ouro em rendimento passivo.
  - Caso permaneçam arruinados por 3 anos consecutivos sem reparos, a Coroa decreta Confisco Compulsório por abandono e perigo público.
- **Imóveis em Comarcas Remotas com Manutenção Dobrada e Sobretaxa:**
  - Bens imóveis fora da comarca de residência sofrem acréscimo de +100% no custo de manutenção anual (manutenção dobrada).
  - Sobretaxa destinada a honorários de feitores locais, correios e prestação de contas comarcais.

#### Bloco B: Design, UI/HUD Premium & Áudio Expandido
- **Reformulação Visual Total 'Dark Medieval BitLife Premium':**
  - Paleta nobre e imersiva: fundo em obsidiana pura (#0c0d10), veludo heráldico profundo, pergaminho antigo e detalhes em ouro polido (#d4af37 / #e6ca65).
  - Tipografia clássica de alto contraste com Cinzel (cabeçalhos, heráldica e marcos solenes) e Eczar (leitura contínua da crônica e descrições).
- **Ergonomia Mobile-First de Alta Fidelidade:**
  - Alvos de toque otimizados com dimensão mínima estrita de 48px por 48px em todos os elementos interativos.
  - Bottom Bar fixa e cômoda para operação com o polegar em qualquer orientação.
  - Conformidade estrita com safe-areas de tela em dispositivos modernos, sem cortes em telas compactas (360px a 430px).
- **Bottom Sheets Deslizantes de 85vh:**
  - Painéis modais retráteis no padrão Bottom Sheet com ocupação vertical máxima de 85vh em dispositivos móveis.
  - Puxador tátil (drag handle), cabeçalho fixo com fechamento rápido e rolagem interna independente com física suave.
- **HUD Superior Heráldico e Barras de Status BitLife Polidas:**
  - Brasão dinâmico da linhagem, insígnia régia, datação de ciclo e patrimônio líquido em destaque.
  - Barras de status (Saúde, Vigor, Honra, Reputação, Fé/Felicidade) no formato esmaltado BitLife, com preenchimentos gradientes e valores percentuais nítidos.
- **Sintetizador de Áudio Expandido (Web Audio API) & Feedback Háptico:**
  - Áudio 100% sintetizado via Web Audio API com latência zero e fidelidade acústica:
    - `fanfare`: Fanfarra de trombetas e cornetas régias para ascensão aristocrática, coroações e vitórias.
    - `cathedral_bells`: Harmonias profundas de sinos de bronze para matrimônios, missas e vigílias solenes.
    - `swords_clash`: Impacto metálico e reverberação de lâminas de aço em duelos e provações.
    - `wax_seal`: Estalo térmico e compressão de sinete sobre cera quente para selamento de documentos e decretos.
    - `heavy_coins`: Tilintar encorpado de moedas pesadas de ouro maciço em transações e tributos.
  - Feedback tátil com vibrações hápticas (`navigator.vibrate`) em ações transcendentais e avanço de ciclos.

---

## [3.5.1] — 2026-10-16
### Patch de Rigor Medieval, Atrofia de Atributos & Decaimento de Honra/Reconhecimento

> **Destaque:** Este patch reformula drasticamente o balanceamento e a progressão de Crônicas de Cinza e Ferro, introduzindo uma curva rigorosa de retornos decrescentes com fim da honra concedida gratuitamente em treinos simples, atrofia biológica e intelectual de atributos mestres sem prática anual, decaimento orgânico contínuo de alta Honra e alta Reputação, desgaste por envelhecimento a partir dos 38 anos, invernos impiedosos e punições implacáveis para falhas e dilemas morais de covardia e corrupção.

#### 1. Curva Rigorosa de Retornos Decrescentes e Fim da Honra Gratuita
- **Taxas Severas de Evolução de Atributos:**
  - `< 35 (Iniciante):` +1 a +2 pontos por treino bem-sucedido.
  - `< 55 (Praticante):` 70% de probabilidade de ganho de +1 ponto.
  - `< 75 (Veterano):` 40% de probabilidade de ganho de +1 ponto.
  - `< 90 (Especialista):` apenas 18% de probabilidade de ganho de +1 ponto sob esforço exaustivo.
  - `90+ (Mestre):` teto de maestria quase intransponível com apenas 6% de chance de +1 ponto (teto rígido absoluto em 100).
- **Eliminação da Honra Automática:** Treinar atributos físicos, mentais ou de ofício não concede mais Honra automática como prêmio de consolação por dedicação trivial. Honra feudal agora exige feitos autênticos de bravura, justiça e devoção perante o reino.
- **Fadiga Severa por Repetição Anual:** Repetições excessivas da mesma atividade no mesmo ano acumulam exaustão severa, reduzindo drasticamente as chances de sucesso.

#### 2. Decaimento Orgânico Anual de Honra e Reputação (Fama Fugaz e Inércia Moral)
- **Erosão Anual da Reputação Feudal:**
  - Patamar `Reputação > 2`: Perda orgânica de -1 ponto por ano caso o personagem não renove seus feitos perante o reino (o tempo e a corte esquecem antigos favoritos).
  - Patamar `Reputação > 6`: Alta celebridade sofre perda anual de -2 pontos caso não seja alimentada com grandes feitos ou patrocínios contínuos.
- **Decaimento Orgânico de Alta Honra:**
  - Patamar `Honra > 65`: Erosão natural de -1 ponto anual se a conduta não for reafirmada com atos contínuos de bravura e justiça cristã.
  - Patamar `Honra > 85`: A aura de virtude cavalheiresca suprema sofre decaimento de -2 pontos anuais se não for mantida ativamente.

#### 3. Atrofia por Desuso e Desgaste Vital Realista
- **Atrofia Biológica e Intelectual por Desuso:**
  - Atributos elevados (`>= 75`) não praticados ativamente durante o ano sofrem risco iminente de atrofia física e intelectual (-1 ponto).
- **Desgaste por Envelhecimento Antecipado:**
  - *Aos 38 anos (Meia-Idade):* Início precoce do declínio biológico com perda sutil de vitalidade física ou agilidade.
  - *Aos 48 anos:* Agravamento do desgaste articular e físico.
  - *Aos 60 anos e 72+ anos:* Queda acentuada e progressiva de Saúde, Força e Destreza com o peso implacável das décadas.
- **Invernos Rigorosos e Geadas:**
  - Invernos severos provocam perda sazonal de Saúde e aumentam o risco de febres e enfraquecimento geral, afetando duramente as classes mais vulneráveis.

#### 4. Severidade Aumentada em Falhas e Dilemas Morais
- **Fracassos Marciais Punitivos:** Fracassos em atividades marciais causam lesões musculares com maior frequência e perda de honra por fiasco na arena.
- **Falhas Sociais e Religiosas com Consequências Reais:**
  - Falhas sociais acarretam vexame público (**-1 Carisma**, **-2 Honra** e **-1 Reputação**).
  - Falhas religiosas geram crises de fé e espírito (**-1 Fé** e abalo moral).
- **Rebalanceamento Punitivo de Escolhas Covardes e Corruptas:**
  - Todas as escolhas narrativas de covardia, suborno, perjúrio ou traição em eventos e provações foram rebalanceadas para perdas severas de Honra (**-6 a -16**) e Reputação (**-1 a -3**).

#### 5. Refinamento Visual de Desonra e Versão
- **Alertas Visuais e Sonoros de Infâmia:**
  - Alertas visuais e sonoros aprimorados para Honra degradada (`< 30`) e Reputação negativa (`< 0`) tanto no HUD quanto na Ficha de Personagem.
  - Registros em destaque carmesim no feed de crônicas para expor publicamente a desonra e a má fama do protagonista.
- **Identificação da Versão 3.5.1:** Atualizada a versão no cabeçalho e metadados do projeto.

---

## [3.5.0] — 2026-10-16
### Quick-Time Events (QTEs), Moralidade & Dilemas Feudais

> **Destaque:** Esta grande atualização traz eventos de tempo de reação imediata (QTEs com barra de contagem regressiva pulsante), uma nova leva de atividades medievais de risco, honra e devoção, o sistema orgânico de perda de Honra e Reputação negativa (com novos títulos de desonra, calotes públicos e ociosidade) e uma seleção enriquecida de dilemas morais medievais.

#### 1. Quick-Time Events (QTEs) de Alta Adrenalina
- **Eventos com Tempo Real de Resposta (4 segundos):**
  - *Emboscada na Garganta do Lobo:* Reação veloz sob ataque furtivo nas estradas e gargantas.
  - *Cavalo Desgovernado na Feira:* Domar a montaria enfurecida em meio aos feirantes e mercadores.
  - *Lâmina Sob o Veludo:* Esquivar de um golpe de adaga traiçoeira em banquetes e vielas escuras.
  - *Fogo nas Estrebarias:* Luta contra o tempo para conter as chamas e salvar animais e vigas.
- **Barra de Contagem Regressiva e Alerta Pulsante:**
  - Renderização visual em tempo real no modal de evento com contagem regressiva de alta precisão e animação de urgência rubro/âmbar.
  - **Penalidade Severa por Hesitação:** Caso o tempo expire sem decisão do jogador, a inércia acarreta consequências desastrosas imediatas (**-6 Honra**, **-1 Reputação** e dano físico à Saúde por ferimentos ou queimaduras).

#### 2. Nova Leva de Atividades Medievais (Risco, Honra e Moralidade)
- **7 Novas Atividades Adicionadas ao Catálogo:**
  - *Duelo Clandestino de Apostas:* Luta bruta em becos e arenas clandestinas com risco de espancamento e ganho em moedas.
  - *Caça Furtiva nas Terras do Barão:* Desafio audacioso à autoridade senhorial; falhas acarretam multas pesadas de caça e humilhação.
  - *Promover Festejo Desregrado:* Orgia e bebedeira regadas a vinho caro; eleva a popularidade local à custa da honra e dos cofres.
  - *Penitência Pública e Cinzas:* Rito rigoroso de mortificação da carne na praça da igreja; restaura a Honra e a Fé perante o clero.
  - *Patrocinar Grande Liça de Armas:* Alto investimento financeiro para celebrar um torneio de cavaleiros e alavancar a Reputação.
  - *Doar Dízimo Vultoso à Catedral:* Oferenda de ouro ao alto clero em troca de redenção espiritual e prestígio eclesiástico.
  - *Usar Dados Viciados na Taverna:* Trapaça audaciosa nos jogos de taberna para obter ouro fácil, com grave risco de estigma social.
- **Consequências Profundas e Ramificações:**
  - Desfechos de sucesso e fracasso com espancamento físico, multas feudais, escândalos e oscilações substanciais de renome social.

#### 3. Sistema Orgânico de Perda de Honra e Reputação
- **Patamares e Rótulos Autênticos de Reputação Negativa:**
  - `Malvisto (-1 a -3):` O herói passa a ser visto com reservas e desconfiança pelos aldeões e comerciantes.
  - `Desprezado (-4 a -7):` Rejeição aberta na comunidade, portas fechadas e desdém social.
  - `Infame / Pária (-8 a -10):` Ostracismo total, considerado escória ou criminoso notório perante todo o feudo.
- **Consequências Anuais de Calotes e Endividamento:**
  - Protagonistas com dívidas não quitadas (`STATE.debt > 40`) sofrem cobrança e escárnio público anual (**-1 Reputação** e **-4 Honra** a cada passagem de ano).
- **Ociosidade e Vadiagem:**
  - Adultos aptos sem ofício formal ou terras sofrem declínio social contínuo perante a comunidade por vadiagem.
- **Marca de Trapaceiro:**
  - O flagrante de trapaça em jogos de azar impõe estigma social contínuo perante a comunidade.

#### 4. Leva Expandida de Eventos Narrativos de Dilemas Morais
- **Dilemas Éticos e Conflitos Feudais:**
  - Novos eventos com disputas de herança fraterna, calúnias públicas difamatórias, dívidas de sangue feudais, hereges portando relíquias roubadas e motins civis.
  - Escolhas de covardia, perjúrio ou corrupção acarretam rebaixamento severo e permanente de Honra e Reputação, testando a integridade moral do herói.

---

## [3.4.1] — 2026-10-16
### Patch de Balanceamento de Atributos, Economia e Refinamento de UI

> **Destaque:** Este patch aprofunda o realismo da simulação medieval com retorno decrescente em treinos, desgaste vital por envelhecimento e falhas reais, fim da geração gratuita de ouro em atividades comuns, trava anual médica e ergonômica reformulada tanto em mobile quanto desktop.

#### 1. Balanceamento de Atributos & Retornos Decrescentes (*Diminishing Returns*)
- **Progressão Escalonada por Patamar:** Ganhos de atributos físicos, mentais e sociais agora respeitam a maestria acumulada do herói:
  - `< 40 (Iniciante):` progressão veloz (+2 a +3 pontos por atividade bem-sucedida).
  - `40–69 (Praticante):` ganhos moderados e consistentes (+1 a +2 pontos).
  - `70–84 (Veterano):` progresso árduo (+1 ponto em treinos focados).
  - `85+ (Mestre):` ganhos raros e excepcionais (+1 ponto esporádico sob grande dedicação).
  - **Teto Rígido:** Limite máximo absoluto calibrado em 100 pontos para todos os atributos.
- **Fadiga por Repetição Anual:** Repetir o mesmo treino ou atividade no mesmo ano acumula cansaço específico, reduzindo progressivamente a probabilidade de bônus consecutivos no mesmo turno.

#### 2. Mecânicas Reais de Perda de Atributos e Desgaste Vital
- **Consequências em Falhas Ativas:**
  - *Atividades Marciais/Físicas:* Fracassos podem resultar em distensões, entorses ou lesões graves (**-1 Força** ou **-1 Destreza**).
  - *Atividades Sociais e Boemia:* Vexame público ou brigas de taberna geram humilhação (**-1 Carisma**).
  - *Atividades Religiosas:* Dúvidas dogmáticas e crises espirituais sob provação (**-1 Fé**).
- **Desgaste Biológico por Envelhecimento:**
  - *48 a 59 anos:* Início do declínio físico gradual e natural com o peso dos anos.
  - *60 a 71 anos:* Aceleração do desgaste físico e aumento do risco de perda de vitalidade.
  - *72+ anos:* Declínio pronunciado em múltiplos atributos vitais e maior vulnerabilidade biológica.
- **Penúria e Dívidas Severas:**
  - Sobreviver na miséria extrema e carregar débitos pesados agora gera definhamento e estresse contínuo (**-1 Saúde** ou **-1 Carisma** por turno).

#### 3. Eliminação da Fábrica de Ouro Gratuito e Ajuste Econômico
- **Atividades de Treino Sem Recompensa Monetária:** Treinos de armas, leitura de manuscritos e orações paroquiais deixaram de conceder ouro aleatório.
- **Premiação de Disciplina:** O esforço dedicado em atividades de autodesenvolvimento passa a recompensar a honra do personagem (**+1 Honra**).
- **Calibragem de Risco e Custo:** Atividades de esforço dobrado e jogos de azar de taberna tiveram custos em vigor e margens de risco rebalanceadas.

#### 4. Reformulação de "Repouso e Ervas Medicinais"
- **Trava Anual Rígida:** Tratamento com curandeiro e ervanárias limitado a **exatamente 1 vez por ano** (`STATE.healthCareUsedThisYear`), eliminando definitivamente o exploit de regeneração infinita de vigor no mesmo turno.
- **Custos e Benefícios Realistas:** Custo fixado em **12 moedas de ouro**; restauração equilibrada para **+16 a +20 Saúde** e alívio moderado de **+10 Vigor**.
- **Feedback Visual na UI:** Cartões de atividade exibem badge indicativo `(1x/ano)` e desativação visual imediata após a realização no ano corrente.

#### 5. Refinamento Ergonômico de Interface (Mobile & Desktop)
- **Modal de Viagens:** Reorganização interna com container de rolagem independente (`.travel-grid`) para opções de vilas, cidades e reinos estrangeiros, garantindo que botões fixos de confirmação e fechamento permaneçam sempre visíveis e acessíveis sem sobreposição.
- **Mobile (360px a 400px):** HUD superior recompactado para maximizar a área de leitura da Crônica Anual; dock inferior, navbar e selo central calibrados sem estourar as margens nem esconder dados essenciais.
- **Desktop (>= 1200px):** Eliminação de áreas vazias laterais quando não há painéis deslizantes abertos; modal de viagem estruturado em duas colunas funcionais.

---

## [3.4.0] — Edição Explorador, Viagens & Carreiras Itinerantes
- **Maioridade Plena para Viagens (16+ anos):** Bloqueio estrito de travessias e migrações para menores de 16 anos com aviso no HUD e na ficha; marco narrativo especial ao completar a maioridade.
- **Custos de Viagem Realistas e Escalonamento Estamental:** Gastos de vigor e ouro balanceados pela distância e pelo estamento social (comitiva plebeia modesta, classe intermediária e corte aparatosa para nobres), com sobretaxa por dependentes acompanhantes.
- **Modos de Viagem Estratégicos:**
  - *Marcha Econômica:* Barato em ouro, consome mais vigor e eleva chance de emboscadas.
  - *Caravana Regular:* Padrão equilibrado de segurança e despesas.
  - *Escolta Armorial:* Alta segurança, menor consumo de vigor e ganho de honra à chegada.
- **Diário de Exploração:** Registro dinâmico de até 50 comarcas e 10 reinos visitados com bônus inéditos em ouro, intelecto, reputação e honra na primeira descoberta.
- **Especialidades Regionais:** Acesso a feiras, forjas e entrepostos exclusivos de cada reino no próprio modal de viagens.
- **Encontros Interativos na Estrada:** Desafios e testes dinâmicos de perícia durante travessias (pedágios forçados, emboscadas, ruínas antigas e tempestades).
- **13 Carreiras Itinerantes:** Funções universais de reconhecimento de rotas, contratos móveis da comarca e habilidades exclusivas para cada profissão nômade.

---

## [3.3.0] — Novo HUD Estilo BitLife & Design System
- **HUD Compacto Superior:** Indicadores essenciais (ano, idade, assentamento, ocupação, ouro e retrato com toque direto na ficha) sempre ao alcance dos olhos.
- **Crônica Anual com Feed Contínuo:** Agrupamento por anos (`.log-year-head`), destaques narrativos em negrito e rolagem limpa.
- **Barras de Status e Dock:** Barras de Saúde, Vigor, Honra e Reputação adaptadas sem sobreposições em telas de 360px a 390px.
- **Selo Central "Avançar Ano":** Selo heráldico proeminente e centralizado no dock.
- **Navbar com 5 Ícones:** Acesso rápido a Ofícios, Relações, Atividades, Bens e Crônica.
- **Bottom-Sheets e Docking:** Menus deslizantes do rodapé no mobile e docados na lateral direita no desktop.
- **Grid Desktop em 3 Colunas:** Suporte a telas ultrawide e desktop com coluna esquerda fixa de ficha, centro narrativo e direita docada para painéis ativos.

---

## [3.2.1] — Edição Explorador Refinada & Antroponímia Regional
- **Antroponímia Cultural por Reino:** Banco dinâmico de prenomes e sobrenomes representativos das matrizes culturais dos 10 reinos (Álbion, Al-Zahra, Castela, Tianxia, Yamato, Rus, Califado, etc.).
- **Modularização de Código:** Extração de `05c_dados_cultura_oficios.js` e divisão de motores em arquivos compactos abaixo de 250 linhas.
- **Vínculo Geográfico de NPCs:** Cônjuge e filhos menores acompanham mudanças; demais habitantes permanecem em suas cidades natais com badges informativos de residência.
- **Provação Tática de Expedição:** Provação em 3 etapas para carreiras de exploração ("Fronteiras do Desconhecido").
- **Economia Imobiliária:** Liquidação de escrituras a 75% do valor original e taxa de administração de 35% sobre rendimentos no exterior.

---

## [3.2.0] — Edição Explorador Completa & Mobilidade Geográfica
- **Hierarquia Geográfica de Ofícios:** Ofícios rurais restritos a vilas; guildas e manufaturas em cidades e capitais; chancelaria e corte restritas à capital.
- **Regras de Desligamento Profissional:** Demissão e dispensa de aprendizados ao mudar para comarcas incompatíveis.
- **Sistema de Migração Internacional:** Deslocamento entre os 10 reinos para aventureiros adultos com adaptação de títulos de nobreza.
- **Garantia de Soberano Único:** Unicidade garantida do monarca de cada reino sem duplicidade de regentes.
- **Especialização Econômica Regional:** Modificadores econômicos locais de renda e custo de vida por tipologia de assentamento.

---

## [3.1.2] — Soberano Único, Títulos Culturais & Consistência
- **Hierarquia da Alta Corte:** Correção que assegura sempre exatamente um Soberano vivo por Coroa.
- **Interpolação no Log:** Formatação segura de títulos e narrativas de eventos com resolução de placeholders `{city}`, `{kingdom}` e `{lord}`.
- **Títulos Nobiliárquicos Culturais:** Exibição dinâmica dos títulos de acordo com o reino (ex.: Jarl, Conde, Emir, Daimyô).
- **Otimizações do Motor Feudal:** Eliminação de saves redundantes em ordens de ofício remoto.

---

## [3.1.1] — Hotfix de Provações, Placeholders & Mortalidade
- **Correções de Escopo:** Correção de `ReferenceError` em eventos de provação e restauração do renderizador `matchJob`.
- **Fim Imediato de Turno na Morte:** O óbito interrompe imediatamente o ciclo anual, evitando autosaves corrompidos de personagens falecidos.
- **Limpeza de Ofícios Obsoletos:** Extinção de resíduos manuais de "Rei" e "Barão" em favor dos 5 tiers dinâmicos de nobreza.
- **Ajustes Narrativos:** Correção de gênero para parto feminino e bastardos.

---

## [3.1.0] — Títulos Nobiliárquicos Dinâmicos & Cortes Feudais
- **Sistema de Nobreza em 5 Graus:** Nobre Titular (Grau 1), Senhor de Feudo (Grau 2), Grão-Senhor (Grau 3), Duque/Par do Reino (Grau 4) e Soberano (Grau 5).
- **Painel de Administração Senhorial:** Arrecadação de tributos, manutenção de guarnição, festejos e audiências de corte.
- **Dinastia e Sucessão:** Transição para o herdeiro com transferência de títulos, propriedades e ouro acumulado.

---

## [3.0.0] — O Grande Salto Modular & Retratos Procedurais
- **Arquitetura Modular:** Reestruturação completa do monolito clássico em dezenas de submódulos JavaScript e folhas de estilo CSS carregados com escopo global limpo (`DATA`, `Engine`, `UI`).
- **Gerador Procedural de Retratos SVG:** Camadas combinatórias de traços faciais, cabelos, elmos, coroas, cicatrizes e vestimentas de acordo com classe, ofício e saúde.
- **Áudio Sintetizado Web Audio API:** Efeitos sonoros procedurais para avançar anos, moedas, fanfarras reais e sons de batalha sem arquivos de áudio pesados.

---

## [2.0.0] — Reinos Históricos & Dinastias
- **Os 10 Reinos Medievais:** Criação do mapa geopolítico de Cinza e Ferro.
- **Sistema de Relações:** Cortejo, casamento, filhos, rivais e mentores com interações sociais completas.

---

## [1.0.0] — Fundação de Cinza e Ferro
- **Lançamento Inicial:** Simulador de vida textual medieval em JavaScript vanilla, contendo ciclo anual, atributos basilares (Força, Destreza, Intelecto, Carisma, Beleza, Saúde, Fé, Sorte), sistema de ofícios, bens patrimoniais e mortalidade medieval.
