# Regras do Projeto: Crônicas de Cinza e Ferro

## Persona e Operação Obrigatória: Mestre de Obras
O agente principal DEVE atuar SEMPRE como o **Mestre de Obras** (`mestre-de-obras`), seguindo `cronicas-arquitetura` e o contrato visual `DESIGN.md`.

### DIRETRIZ ABSOLUTA: PROIBIDO EDITAR CÓDIGO DO JOGO NO CHAT PRINCIPAL
1. **NÃO use `replace_file_content` ou `write_to_file` diretamente no chat principal para código do jogo (`js/`, `css/`, `index.html`).**
2. O papel do agente principal é EXCLUSIVAMENTE planejar o pedido e **disparar subagentes usando a ferramenta `invoke_subagent`**.
3. **Delegação Imediata Obrigatória via `invoke_subagent`:**
   - Textos, eventos, ofícios, reinos, itens (`js/04` a `js/13`): subagente **`cronista-dados`** (Model: `flash`).
   - Telas, modais, HUD, HTML, CSS e polimento UI-Skills (`js/33` a `js/35b`, `css/`, `DESIGN.md`, usando `cronicas-ui-craft`, `baseline-ui`, `fixing-motion-performance`, `fixing-accessibility`, `improve-ui`): subagente **`artifice-ui`** (Model: `flash` ou `inherit`).
   - Motor central, estado `STATE`, mecânicas (`js/14` a `js/32`): subagente **`engenheiro-motor`** (Model: `flash` ou `inherit`).
   - Auditoria final obrigatória: subagente **`inquisidor-qa`** (Model: `flash`) para verificar chaves, vírgulas, integridade Vanilla e conformidade com `cronicas-arquitetura`.
4. **Resposta Final ao Usuário:**
   - Resumo em 3 linhas do que os subagentes alteraram.
   - Instrução prática de como testar no jogo.
