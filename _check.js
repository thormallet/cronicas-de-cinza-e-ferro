// _check.js — Validação automatizada para CCF_W (Etapas 1 e 2)
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

console.log('--- Iniciando checagem de CCF_W ---');

// 1. Checagem de Sintaxe de todos os arquivos JS
const jsDir = path.join(__dirname, 'js');
const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));
for (const file of jsFiles) {
  const code = fs.readFileSync(path.join(jsDir, file), 'utf8');
  try {
    new vm.Script(code, { filename: file });
  } catch (err) {
    console.error(`Erro de sintaxe em ${file}:`, err.message);
    process.exit(1);
  }
}
console.log(`[PASS] Sintaxe de ${jsFiles.length} arquivos JS verificada com sucesso.`);

// 2. Checagem de UI.fmtLog e appendLogEntry em js/33_ui_nucleo.js
const uiCode = fs.readFileSync(path.join(jsDir, '33_ui_nucleo.js'), 'utf8');
const sandbox = {
  document: {
    getElementById: () => null,
    querySelectorAll: () => [],
    createElement: () => ({ classList: { add() {}, remove() {} }, appendChild() {} })
  },
  SoundFX: { play() {} },
  CONFIG: { typewriter: false, theme: 'light' },
  STATE: null,
  window: {}
};
vm.createContext(sandbox);
vm.runInContext(uiCode + '\nwindow.UI = UI;', sandbox);
const UI = sandbox.window.UI;

assert.strictEqual(typeof UI.fmtLog, 'function', 'UI.fmtLog deve ser uma função');
assert.strictEqual(UI.fmtLog('Em **Capital** [Capital]'), 'Em <strong>Capital</strong> [Capital]');
assert.strictEqual(UI.fmtLog('Teste <script>alert(1)</script> e **Negrito**'), 'Teste &lt;script&gt;alert(1)&lt;/script&gt; e <strong>Negrito</strong>');
assert.strictEqual(UI.fmtLog('**Um** e **Dois**'), '<strong>Um</strong> e <strong>Dois</strong>');
assert.strictEqual(UI.fmtLog('Texto normal sem tags'), 'Texto normal sem tags');
assert.strictEqual(UI.fmtLog(null), '');
assert.strictEqual(UI.fmtLog(undefined), '');

// Verificação do texto da Crônica Inaugural
const inauguralText = 'Ano 1140 - Crônica Inaugural: Em **Valória** [Capital], nas terras de Val';
const formattedInaugural = UI.fmtLog(inauguralText);
assert(formattedInaugural.includes('<strong>Valória</strong>'), 'Nome da cidade deve estar em <strong>');
assert(!formattedInaugural.includes('**Valória**'), 'Não deve conter asteriscos crus');
console.log('[PASS] UI.fmtLog formata negrito markdown e escapa HTML corretamente.');

// 3. Checagem de css/05_hud_bitlife.css
const css05Path = path.join(__dirname, 'css', '05_hud_bitlife.css');
const css05Content = fs.readFileSync(css05Path, 'utf8');

assert(css05Content.includes('.feed-folio'), 'Deve conter regra .feed-folio');
assert(css05Content.includes('text-overflow: ellipsis'), 'Deve truncar com ellipsis');
assert(css05Content.includes('white-space: nowrap'), 'Deve manter em uma linha com white-space: nowrap');
assert(/#book-folio-label/.test(css05Content), 'Deve estilizar #book-folio-label');

assert(css05Content.includes('.dock'), 'Deve conter regra .dock');
assert(css05Content.includes('.status-bars'), 'Deve conter regra .status-bars');
assert(css05Content.includes('.navbar'), 'Deve conter regra .navbar');
assert(css05Content.includes('.seal-btn'), 'Deve conter regra .seal-btn');
assert(!/\.seal-btn\s*\{[^}]*margin:\s*-30px/.test(css05Content), '.seal-btn não deve possuir margin: -30px sobrepondo as barras');

const navBtnMatch = css05Content.match(/\.nav-btn\s*\{([^}]+)\}/);
assert(navBtnMatch, 'Deve existir bloco .nav-btn');
assert(/min-width:\s*(4[4-9]|[5-9]\d)px/.test(navBtnMatch[1]), '.nav-btn deve ter min-width >= 44px');
assert(/min-height:\s*(4[4-9]|[5-9]\d)px/.test(navBtnMatch[1]), '.nav-btn deve ter min-height >= 44px');

const sealBtnMatch = css05Content.match(/\.seal-btn\s*\{([^}]+)\}/);
assert(sealBtnMatch, 'Deve existir bloco .seal-btn');
assert(/width:\s*(7[0-9]|80)px/.test(sealBtnMatch[1]), '.seal-btn deve ter largura ~78px');
assert(/height:\s*(7[0-9]|80)px/.test(sealBtnMatch[1]), '.seal-btn deve ter altura ~78px');
console.log('[PASS] CSS do HUD Mobile (feed-folio, dock, status-bars, navbar, seal-btn) validado.');

// 4. Checagem de css/02_layout.css (Etapa 2)
const css02Path = path.join(__dirname, 'css', '02_layout.css');
const css02Content = fs.readFileSync(css02Path, 'utf8');

// Botões e selects com altura >= 44px
assert(/button,\s*select\s*\{[^}]*min-height:\s*(4[4-9]|[5-9]\d)px/.test(css02Content), 'button, select devem ter min-height >= 44px');

// Criação: campos em coluna única e rodapé sticky
assert(css02Content.includes('.create-actions-sticky'), 'Deve conter .create-actions-sticky');
assert(/\.create-actions-sticky\s*\{[^}]*position:\s*sticky/.test(css02Content), '.create-actions-sticky deve ter position: sticky');
assert(/\.create-actions-sticky\s*\{[^}]*bottom:\s*0/.test(css02Content), '.create-actions-sticky deve ter bottom: 0');
assert(/\.grid-2\s*\{[^}]*flex-direction:\s*column/.test(css02Content) || /\.grid-2\s*\{[^}]*grid-template-columns:\s*1fr/.test(css02Content), '.grid-2 deve ser em coluna única');

// Menu: slots de save em cartões grandes com botões em largura total
assert(/\.slot-item button\s*\{[^}]*width:\s*100%/.test(css02Content) || /\.slot-item\s*\{[^}]*flex-direction:\s*column/.test(css02Content), '.slot-item deve ter botões em largura total e layout vertical');

// Morte: herdeiros empilhados e botões largura total
assert(css02Content.includes('#heirs-list'), 'Deve estilizar #heirs-list');
assert(/#heirs-list\s*\.slot-item button\s*\{[^}]*width:\s*100%/.test(css02Content), '#heirs-list botões devem ter width: 100%');
assert(css02Content.includes('.death-actions'), 'Deve conter .death-actions');
console.log('[PASS] CSS de Layout Mobile (Menu, Criação sticky, Morte e 44px) validado.');

// 5. Checagem de css/04_cards_modais.css (Etapa 2)
const css04Path = path.join(__dirname, 'css', '04_cards_modais.css');
const css04Content = fs.readFileSync(css04Path, 'utf8');

// Modais: altura máxima 90dvh com rolagem interna e botões de ação sempre visíveis
assert(/max-height:\s*90dvh/.test(css04Content), '.custom-dialog deve ter max-height: 90dvh');
assert(/overflow-y:\s*auto/.test(css04Content), '.custom-dialog deve ter overflow-y: auto');
assert(/\.custom-dialog-buttons\s*\{[^}]*position:\s*sticky/.test(css04Content), '.custom-dialog-buttons deve ser sticky');
assert(/\.custom-dialog-buttons\s*\{[^}]*bottom:\s*0/.test(css04Content), '.custom-dialog-buttons deve ter bottom: 0');

// NPC: ações em coluna única
assert(/\.interaction-grid\s*\{[^}]*flex-direction:\s*column/.test(css04Content), '.interaction-grid deve ter flex-direction: column');
assert(/\.interaction-grid\s*\.action-btn\s*\{[^}]*width:\s*100%/.test(css04Content), '.action-btn em .interaction-grid deve ter width: 100%');
console.log('[PASS] CSS de Modais (90dvh, sticky buttons, NPC coluna única) validado.');

// 6. Checagem de Layout Desktop (Etapa 3)
const htmlPath = path.join(__dirname, 'index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');
assert(htmlContent.includes('<link rel="stylesheet" href="css/07_desktop.css">'), 'index.html deve conter link para css/07_desktop.css');
const pos06 = htmlContent.indexOf('css/06_sheets.css');
const pos07 = htmlContent.indexOf('css/07_desktop.css');
assert(pos06 !== -1 && pos07 > pos06, 'css/07_desktop.css deve vir depois de css/06_sheets.css');

const css07Path = path.join(__dirname, 'css', '07_desktop.css');
assert(fs.existsSync(css07Path), 'Arquivo css/07_desktop.css deve existir');
const css07Content = fs.readFileSync(css07Path, 'utf8');
const css07Lines = css07Content.split('\n').length;
assert(css07Lines <= 250, `css/07_desktop.css deve ter <= 250 linhas (atual: ${css07Lines})`);

assert(css07Content.includes('@media (min-width: 1200px)') || css07Content.includes('@media (min-width:1200px)'), 'Deve conter @media (min-width: 1200px)');
assert(css07Content.includes('body.in-game #app-shell'), 'Deve conter regra body.in-game #app-shell');
assert(/max-width:\s*1360px/.test(css07Content), 'body.in-game #app-shell deve ter max-width: 1360px');

// Coluna esquerda: #sheet-ficha 300px
assert(/#sheet-ficha\s*\{[^}]*width:\s*300px/.test(css07Content), '#sheet-ficha deve ter width: 300px');
assert(/#sheet-ficha\s*\{[^}]*border-right:\s*3px\s+solid/.test(css07Content), '#sheet-ficha deve ter border-right 3px');

// Coluna direita: sheets docados 440px
assert(/width:\s*440px/.test(css07Content), 'sheets docados devem ter width: 440px');
assert(/border-left:\s*3px\s+solid/.test(css07Content), 'sheets docados devem ter border-left 3px');

// Centro: margens 300px e 440px
assert(/margin-left:\s*300px/.test(css07Content), 'Centro deve ter margin-left: 300px');
assert(/margin-right:\s*440px/.test(css07Content), 'Centro deve ter margin-right: 440px');

// Modal central config 440px com translate e backdrop
assert(/#sheet-config\s*\{[^}]*width:\s*440px/.test(css07Content), '#sheet-config deve ter width: 440px');
assert(/#sheet-config\s*\{[^}]*transform:\s*translate\(-50%,\s*-50%\)/.test(css07Content), '#sheet-config deve estar centralizado com translate');
assert(css07Content.includes('config-open'), 'Deve utilizar body.config-open para backdrop/modal');
console.log('[PASS] CSS Desktop (07_desktop.css, 1360px, 3 colunas, 300px/440px e modal config) validado.');

// 7. Checagem de Acabamento Desktop (Etapa 4)
// Telas menu, criação e morte max-width 920px centralizado
assert(/max-width:\s*920px/.test(css07Content), 'Telas fora do jogo devem ter max-width: 920px');
assert(/#screen-create\s+\.grid-2\s*\{[^}]*grid-template-columns:\s*1fr\s+1fr/.test(css07Content), 'Criação deve ter .grid-2 com 2 colunas');
assert(/#menu-slots[^}]*grid-template-columns:\s*1fr\s+1fr/.test(css07Content), 'Slots de save devem estar em 2 colunas');
assert(/#dynasty-gallery[^}]*grid-template-columns:\s*1fr\s+1fr/.test(css07Content), 'Galeria de dinastias deve estar em 2 colunas');

// Feed central: 1.02rem, line-height 1.6
assert(/font-size:\s*1\.02rem/.test(css07Content), 'Feed central deve ter font-size: 1.02rem');
assert(/line-height:\s*1\.6/.test(css07Content), 'Feed central deve ter line-height: 1.6');

// Painel direito: .people-grid em 1 coluna
assert(/\.people-grid\s*\{[^}]*grid-template-columns:\s*1fr/.test(css07Content), '.people-grid deve ser em 1 coluna');

// Modais 560px
assert(/\.custom-dialog\s*\{[^}]*width:\s*560px/.test(css07Content) || /\.custom-dialog\s*\{[^}]*max-width:\s*560px/.test(css07Content), 'Modais devem ter largura 560px');

// Tooltips e hover
assert(/\.nav-btn\[title\]|\.nav-btn/.test(css07Content), 'Navbar deve ter estilos de hover/cursor');
assert(/title="Ofícios/.test(htmlContent), 'Botão de Ofícios deve ter atributo title');
assert(/title="Relações/.test(htmlContent), 'Botão de Relações deve ter atributo title');
assert(/title="Atividades/.test(htmlContent), 'Botão de Atividades deve ter atributo title');
assert(/title="Bens/.test(htmlContent), 'Botão de Bens deve ter atributo title');
assert(/title="Anais/.test(htmlContent), 'Botão de Anais deve ter atributo title');
console.log('[PASS] Acabamento Desktop (920px telas, feed 1.02rem, modais 560px, tooltips e hover) validado.');

console.log('OK');
