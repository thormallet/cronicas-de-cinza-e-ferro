# Registro de Mudanças — Crônicas de Cinza e Ferro

Todas as alterações notáveis no projeto **Crônicas de Cinza e Ferro** estão documentadas neste arquivo.

O formato baseia-se nas diretrizes do [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/) e adere ao versionamento semântico.

---

## Sumário
- [3.4.1 — 2026-10-16](#341--2026-10-16) *(Destaque / Atual)*
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
