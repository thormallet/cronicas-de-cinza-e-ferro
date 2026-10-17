---
name: cronicas-arquitetura
description: Mapa de arquitetura, regras de escopo global, contrato estético DESIGN.md e convenções híbridas (UI-Skills + Vanilla) de Crônicas de Cinza e Ferro. Obrigatório antes de editar qualquer arquivo JS, CSS ou HTML.
---
# Arquitetura Crônicas de Cinza e Ferro

## Regras Inegociáveis para Edição Direta de Arquivos (Motor & Estado)
1. **PROIBIDO APAGAR LÓGICA EXISTENTE:** Ao editar um arquivo diretamente, use ferramentas de substituição cirúrgica (diff/replace). NUNCA reescreva um arquivo inteiro omitindo funções antigas ou deixando comentários `// ... resto do código`.
2. **ESCOPO GLOBAL CLÁSSICO (ZERO-BUILD):** Sem `import` ou `export`, sem JSX/React e sem classes utilitárias de Tailwind. Tudo usa `Object.assign(Alvo, { ... })` e roda direto no navegador via `index.html`.
3. **LIMITE DE 250 LINHAS:** Nenhum arquivo JS novo pode passar de ~250 linhas. Se crescer além disso, divida em submódulos registrados no `index.html` antes de `js/36_inicializacao.js`.
4. **RETROCOMPATIBILIDADE DE SAVE:** Todo campo novo em `STATE` exige inicialização em `Creator.startGame()` (`js/16_criador.js`) E função `Engine.ensure...()` para não quebrar saves antigos.

## Regras Inegociáveis de Engenharia de Interface (Compatibilização UI-Skills)
5. **CONTRATO ESTÉTICO & FACHADA SAGRADA (`DESIGN.md` & `css/01_base.css`):**
   - A essência visual do jogo é **Dark Medieval BitLife Premium** (Obsidiana, Couro Envelhecido, Pergaminho Nobre, Ouro Real & Carmesim, fontes `'Cinzel'` e `'Eczar'`).
   - Use exclusivamente as variáveis CSS (`var(--...)`) declaradas em `css/01_base.css` e documentadas em `DESIGN.md`.
   - **Exceção Canônica ao `baseline-ui`:** Texturas e gradientes medievais de couro, madeira, ouro forjado e carmesim (`linear-gradient`/`radial-gradient` do tema) e sombras multicamadas (`--shadow-sm/md/lg/gold`) são parte da identidade oficial do jogo. Em contrapartida, é estritamente proibido o "AI Slop" moderno (gradientes neon/roxos sci-fi, cores fora dos tokens ou brilhos excessivos em ações secundárias).
6. **PERFORMANCE DE MOVIMENTO 60FPS (`fixing-motion-performance`):**
   - **Proibido animar propriedades de layout** (`width`, `height`, `top`, `left`, `margin`, `padding`) que causem *layout thrashing*.
   - Anime exclusivamente propriedades de compositor GPU (`transform`, `opacity`).
   - Use curvas `ease-out` / `cubic-bezier(0.22, 1, 0.36, 1)` nas entradas (partindo de `scale(0.92~0.96)`, nunca `scale(0)`), saídas sutis (`120ms–180ms`), e feedback tátil `:active` (`transform: translateY(1px) scale(0.975)` em `<= 180ms`).
   - Evite animar `backdrop-filter: blur()` frame a frame e respeite `@media (prefers-reduced-motion: reduce)`.
   - Mantenha trocas de abas frequentes instantâneas ou ultra-rápidas.
7. **TIPOGRAFIA DE DADOS & GEOMETRIA (`cronicas-ui-craft`):**
   - **Alinhamento Numérico:** Todo número dinâmico (ouro, idade, ano, atributos, HP, vigor, preços, porcentagens) DEVE usar `font-variant-numeric: tabular-nums` para evitar saltos horizontais.
   - **Balanço e Leitura:** Títulos (`h1`–`h4`) usam `text-wrap: balance` e `line-height: 1.15`; textos narrativos e crônicas usam `text-wrap: pretty` e medida entre `60ch` e `75ch`.
   - **Raios Concêntricos:** Elementos aninhados com borda/fundo obedecem à fórmula `inner_radius = outer_radius - padding`.
8. **ACESSIBILIDADE & ERGONOMIA TÁTIL (`fixing-accessibility`):**
   - **Alvos de 44px:** Todo botão, `.icon-btn`, `.chip-btn`, `select` ou `input` deve ter área mínima de toque de `44x44px` (`min-height: 44px`) e respiro de `8px–12px` entre controles adjacentes.
   - **Semântica e Foco:** Botões apenas com ícone/emoji exigem `aria-label` descritivo; SVGs decorativos exigem `aria-hidden="true"`; estados de foco `:focus-visible` exibem anel dourado (`var(--gold-bright)`).
   - **Status Nunca Só por Cor:** Sempre parear cores de estado (`--good`, `--bad`, `--gold`) com ícone, sinal (`+`/`-`) ou texto.
   - **Viewport & Safe Areas:** Usar `100dvh` (com fallback `100vh`) e `env(safe-area-inset-*)` em barras fixas, modais e bottom sheets.

## Mapa de Arquivos Atualizado
- **Design System & Regras:**
  - `DESIGN.md` (Contrato visual, tokens, tipografia e exceções canônicas medievais)
  - `AGENTS.md` / `GEMINI.md` (Diretrizes de orquestração do Mestre de Obras)
- **CSS:**
  - `css/01_base.css` (variáveis `:root`, resets, tipografia `tabular-nums`/`balance`, botões, `@keyframes` GPU)
  - `css/02_layout.css` (estrutura base, `.screen`, `.card`, ergonomia 44px)
  - `css/03_abas_cronica.css` (log narrativo e abas)
  - `css/04_cards_modais.css` (modais, `.person-card`, `.npc-card`, `.badge`)
  - `css/05_hud_bitlife.css` (HUD estilo BitLife, `#app-shell` `100dvh`, barras e dock)
  - `css/06_sheets.css` (bottom sheets / gavetas deslizantes via `transform`)
  - `css/07_desktop.css` (responsividade telas grandes)
- **Dados e Eventos (`DATA`):**
  - `js/01_retrato_dados.js` e `js/02_retrato_render.js` (SVG procedural)
  - `js/03_som.js` (`SoundFX`)
  - `js/04_dados_nomes.js`, `js/05_dados_reinos.js`, `js/05b_dados_explorador.js`, `js/05c_dados_cultura_oficios.js`, `js/06_dados_oficios.js`, `js/07_dados_atividades.js`
  - `js/08` a `js/10_eventos_base_a/b/c.js`, `js/11_eventos_temas_oficio.js`, `js/12_eventos_contextos.js`, `js/12b_eventos_explorador.js`, `js/13_eventos_catalogo.js`
- **Estado e Utilitários:**
  - `js/14_estado_storage.js` (`STATE`, `CONFIG`, `Storage`)
  - `js/15_utils.js` (`Utils`), `js/16_criador.js` (`Creator`)
- **Motor do Jogo (`Engine`):**
  - `js/17_engine_base.js`, `js/18_engine_nobreza.js`, `js/19_engine_oficios_consulta.js`, `js/20_engine_ciclo_anual.js`, `js/21_engine_eventos.js`, `js/22_engine_nascimento.js`
  - `js/23_engine_provacao_inicio.js`, `js/24_engine_provacao_acoes.js`, `js/25_engine_atividades.js`, `js/26_engine_mudar_oficio.js`
  - `js/27_engine_realeza.js`, `js/27b_engine_explorador.js`, `js/27c_engine_viagens.js`, `js/28_engine_economia_morte.js`
  - `js/29_rel_npcs.js`, `js/30_rel_apresentacoes.js`, `js/31_rel_interacao.js`, `js/32_rel_sucessao.js`
- **Interface (`UI`) e Boot:**
  - `js/33_ui_nucleo.js`, `js/34_ui_modais.js`, `js/35_ui_render_all.js`, `js/35b_ui_hud.js`
  - `js/36_inicializacao.js` (Exporta módulos para `window` e inicia menu)
