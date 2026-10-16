---
name: cronicas-arquitetura
description: Mapa de arquitetura, regras de escopo global e convenções de Crônicas de Cinza e Ferro. Obrigatório antes de editar qualquer arquivo JS, CSS ou HTML.
---
# Arquitetura Crônicas de Cinza e Ferro

## Regras Inegociáveis para Edição Direta de Arquivos
1. **PROIBIDO APAGAR LÓGICA EXISTENTE:** Ao editar um arquivo diretamente, use ferramentas de substituição cirúrgica (diff/replace). NUNCA reescreva um arquivo inteiro omitindo funções antigas.
2. **ESCOPO GLOBAL CLÁSSICO:** Sem `import` ou `export`. Tudo usa `Object.assign(Alvo, { ... })`.
3. **LIMITE DE 250 LINHAS:** Nenhum arquivo JS novo pode passar de ~250 linhas.
4. **RETROCOMPATIBILIDADE DE SAVE:** Todo campo novo em `STATE` exige inicialização em `Creator.startGame()` (`js/16_criador.js`) E função `Engine.ensure...()` para não quebrar saves antigos.

## Mapa de Arquivos Atualizado
- **CSS:**
  - `css/01_base.css` (variáveis, resets, botões)
  - `css/02_layout.css` (estrutura base)
  - `css/03_abas_cronica.css` (log narrativo e abas)
  - `css/04_cards_modais.css` (modais e cards)
  - `css/05_hud_bitlife.css` (HUD estilo BitLife e barras)
  - `css/06_sheets.css` (bottom sheets / gavetas)
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
