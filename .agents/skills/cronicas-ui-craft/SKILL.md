---
name: cronicas-ui-craft
description: Playbook e diretrizes híbridas de Design Engineering (UI-Skills + Dark Medieval BitLife) para Crônicas de Cinza e Ferro. Unifica baseline-ui, motion performance, acessibilidade e as 50+ regras do UI Playbook adaptadas para CSS Vanilla e JS Global.
---

# Crônicas UI Craft (Híbrido UI-Skills + Dark Medieval BitLife)

Esta skill traduz a engenharia de interface do **UI Skills Playbook** (`baseline-ui`, `fixing-motion-performance`, `fixing-accessibility`) para a arquitetura clássica em **Vanilla CSS/JS** e a estética **Dark Medieval BitLife Premium** de *Crônicas de Cinza e Ferro*.

---

## 1. Preservação da Alma Visual vs. Anti-Slop

1. **Identidade Sagrada (Dark Medieval BitLife Premium):**
   - A paleta de Obsidiana (`--bg-deep`, `--bg`), Couro Envelhecido (`--leather`, `--panel`), Pergaminho (`--pergaminho-escuro`, `--text`), Ouro Real (`--gold`, `--gold-bright`, `--border-gold`) e Carmesim (`--accent`) é **lei**.
   - As fontes `'Cinzel'` (`--font-serif`) e `'Eczar'` (`--font-body`) governam toda a hierarquia tipográfica.
   - **Exceção Canônica ao Baseline-UI:** Texturas sutis de couro/metal/pergaminho (`linear-gradient` e `radial-gradient` com tokens do `:root`) e molduras douradas com chanfro interno (`inset 0 1px 0`) **são obrigatórias** na fachada medieval.
2. **O Que É Proibido (AI Slop Visual):**
   - Proibido usar cores fora dos tokens de `css/01_base.css` (ex.: azuis/roxos neon modernos, cinzas neutros frios `#ccc`/`#eee`).
   - Proibido usar `box-shadow` luminoso forte (*glow*) em botões secundários ou cards comuns — reserve o brilho dourado/carmesim apenas para o CTA primário (`.primary`, Selo de Avançar Ano) ou estados de foco/alerta real.
   - Proibido empilhar múltiplos acentos vibrantes concorrentes na mesma visão: mantenha **1 CTA dominante por tela/modal** e ações secundárias em couro escuro (`--panel-inner` / `--leather-light`).

---

## 2. Tipografia de Dados & Leitura (`tabular-nums` & `balance`)

1. **Números Estáveis (`tabular-nums`):**
   - Todo contador dinâmico — Ouro, Idade, Ano, HP, Vigor, Atributos (`0–100`), preços de mercado, anos de viagem e porcentagens — **DEVE** declarar `font-variant-numeric: tabular-nums;` para que os dígitos tenham largura fixa e a interface nunca "pule" lateralmente ao atualizar valores.
2. **Balanço e Medida de Texto:**
   - Títulos (`h1`, `h2`, `h3`, `.ev-head h3`, `.sheet-head h3`): usar `text-wrap: balance;` e `line-height: 1.15`.
   - Narrativas de eventos, crônicas anuais e descrições (`#ev-desc`, `.log-entry`, `.custom-dialog p`): usar `text-wrap: pretty;`, `line-height: 1.55–1.6` e largura máxima de leitura entre `60ch` e `75ch`.
3. **Truncamento Suave e Limite de Linhas:**
   - Em chips, badges e cabeçalhos compactos do HUD (`.hud-name`, `.person-name`), proteger contra quebra de layout usando `min-width: 0` no container flex e `overflow: hidden; text-overflow: ellipsis;` ou `-webkit-line-clamp` (ou fade com `mask-image: linear-gradient(90deg, #000 85%, transparent)`).

---

## 3. Geometria, Espaçamento & Profundidade

1. **Raios de Borda Concêntricos (`inner = outer - padding`):**
   - Quando um elemento com borda/fundo (ex.: `.dialog-art`, banner interno, slot de item ou barra interna) estiver aninhado dentro de um `.card` (`border-radius: 14px`) ou `.custom-dialog` (`border-radius: 20px`), calcule o raio interno subtraindo o padding (`inner_radius = outer_radius - padding`) para harmonia óptica perfeita.
2. **Agrupamento por Espaço antes de Linhas:**
   - Priorize agrupar blocos relacionados usando `gap` e `margin`/`padding` antes de adicionar `border-bottom` em tudo. Linhas divisórias (`1px solid var(--border)` ou `var(--border-gold)`) devem separar apenas seções estruturais distintas.
3. **Respiro entre Controles Táteis:**
   - Mantenha pelo menos `8px` a `12px` (`gap: 0.5rem` a `0.75rem`) entre botões ou cards clicáveis adjacentes para evitar toques acidentais.
   - Botões de largura total (`width: 100%`) devem sempre respeitar o padding interno do container/card, nunca colando nas bordas da tela.
4. **Reserva de Espaço Sem Saltos (`aspect-ratio`):**
   - Retratos SVG procedurais (`.avatar-portrait`), brasões (`.brand-crest`) e insígnias devem ter `width`, `height` ou `aspect-ratio: 1 / 1` e `flex-shrink: 0` explícitos para impedir *layout shifts*.

---

## 4. Movimento 60fps & Microinterações (`fixing-motion-performance`)

1. **Apenas Propriedades de Compositor GPU:**
   - Anime exclusivamente `transform` e `opacity`.
   - **PROIBIDO** animar `width`, `height`, `top`, `left`, `margin`, `padding` ou `border-width` (exceto `width` de barras de progresso internas onde `transform: scaleX()` não for viável, preferindo `transform: scaleX()` com `transform-origin: left` sempre que possível).
2. **Curvas e Tempos Naturais:**
   - **Entradas (Modais, Popups, Sheets):** Curva `cubic-bezier(0.22, 1, 0.36, 1)` (`ease-out`), duração `200ms–280ms`. Iniciar scale em `0.92–0.95` (nunca `scale(0)`).
   - **Saídas e Fechamentos:** Curtas e sutis (`120ms–180ms`), com leve `opacity: 0` e pequeno deslocamento (`translateY(6px)`).
   - **Feedback de Pressão (`:active`):** Todo botão e card clicável deve responder em `<= 150ms` com `transform: translateY(1px) scale(0.975)`.
   - **Contenção de Movimento:** Trocas de abas frequentes (Crônica, Família, Ofício, Viagens) devem ser rápidas e diretas, sem animações longas repetitivas.
3. **Backdrops e Scrims Performáticos:**
   - Em modais e bottom sheets, priorize scrims escuros sólidos/translúcidos (`rgba(5, 4, 3, 0.86)`). Nunca anime o valor de `backdrop-filter: blur()` frame a frame e evite empilhar múltiplos `backdrop-filter` simultâneos.
4. **Respeito a Movimento Reduzido:**
   - Sempre incluir suporte a `@media (prefers-reduced-motion: reduce)` reduzindo durações de animação para `0.01ms` e desativando loops decorativos infinitos.

---

## 5. Acessibilidade, Foco & Ergonomia (`fixing-accessibility`)

1. **Alvos de Toque de 44px:**
   - Todo `<button>`, `<select>`, `<input>`, `.icon-btn` e `.chip-btn` DEVE manter `min-height: 44px` e `min-width: 44px`.
2. **Nomes Acessíveis (`aria-label`) e Ícones:**
   - Botões que exibem apenas ícone ou emoji (ex.: fechar modal `✕`, configurações `⚙️`, som `🔊`, selo de avançar ano) **DEVEM** possuir `aria-label="..."` claro em português.
   - Emojis e SVGs puramente decorativos ao lado de textos devem ter `aria-hidden="true"`.
3. **Semântica Nunca Apenas por Cor:**
   - Ganhos (`--good`), perdas (`--bad`), alertas (`--gold`) e estados de saúde/honra nunca devem depender exclusivamente da cor: acompanhe sempre com sinal (`+` / `-`), ícone semântico ou rótulo textual.
4. **Anel de Foco Visível (`:focus-visible`):**
   - Controles focados via teclado (`:focus-visible`) devem exibir anel nítido em ouro brilhante (`outline: 2px solid var(--gold-bright); outline-offset: 2px;`).
5. **Diálogos e Ações Destrutivas:**
   - Modais devem manter `role="dialog"` e `aria-modal="true"`.
   - Ações irreversíveis (ex.: apagar save, abdicar, suicídio/rendição fatal) exigem confirmação explícita em modal antes da execução.
