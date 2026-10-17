// _qa_audit_40.js — Auditoria de QA Completa para Versão 4.0 Edição Mercador
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

console.log('================================================================');
console.log('  AUDITORIA RIGOROSA DE QA — CRÔNICAS DE CINZA E FERRO v4.0');
console.log('================================================================\n');

// 1. Extração dos scripts do index.html
const htmlPath = path.join(__dirname, 'index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

const scriptRegex = /<script\s+src="([^"]+)"><\/script>/g;
const scriptFiles = [];
let match;
while ((match = scriptRegex.exec(htmlContent)) !== null) {
  scriptFiles.push(match[1]);
}

console.log(`[PASS 1.1] ${scriptFiles.length} scripts encontrados no index.html.`);

// Verificar se os 4 novos arquivos 4.0 estão presentes e antes de js/36_inicializacao.js
const req40Files = [
  'js/07b_dados_mercado_40.js',
  'js/07c_dados_conquistas_legado.js',
  'js/28b_engine_banco_40.js',
  'js/35c_ui_mercado_conquistas.js'
];
const initIdx = scriptFiles.indexOf('js/36_inicializacao.js');
assert(initIdx !== -1, 'js/36_inicializacao.js deve estar presente');

for (const file of req40Files) {
  const fIdx = scriptFiles.indexOf(file);
  assert(fIdx !== -1, `Arquivo ${file} deve estar incluído em index.html`);
  assert(fIdx < initIdx, `Arquivo ${file} (idx ${fIdx}) deve estar antes de js/36_inicializacao.js (idx ${initIdx})`);
}
console.log('[PASS 1.2] Todos os 4 novos arquivos 4.0 estão ordenados corretamente antes de 36_inicializacao.js.');

// 2. Ambiente mock para execução no Node VM
const localStorageData = {};
const mockLocalStorage = {
  getItem: (key) => localStorageData[key] || null,
  setItem: (key, val) => { localStorageData[key] = String(val); },
  removeItem: (key) => { delete localStorageData[key]; },
  clear: () => { Object.keys(localStorageData).forEach(k => delete localStorageData[k]); }
};

const domElements = {};
function getOrCreateEl(id) {
  if (!domElements[id]) {
    let _textContent = '';
    const el = {
      id,
      innerHTML: '',
      get textContent() { return _textContent; },
      set textContent(v) { _textContent = v === null || v === undefined ? '' : String(v); },
      value: '',
      style: {},
      classList: {
        add: () => {},
        remove: () => {},
        contains: () => false,
        toggle: () => {}
      },
      appendChild: () => {},
      insertBefore: () => {},
      contains: () => true,
      children: [],
      querySelector: () => null,
      querySelectorAll: () => []
    };
    domElements[id] = el;
  }
  return domElements[id];
}

const mockDoc = {
  body: getOrCreateEl('body'),
  getElementById: (id) => getOrCreateEl(id),
  querySelector: (sel) => {
    if (sel.startsWith('#')) return getOrCreateEl(sel.slice(1));
    return getOrCreateEl(sel);
  },
  querySelectorAll: () => [],
  createElement: (tag) => ({
    tagName: tag.toUpperCase(),
    innerHTML: '',
    textContent: '',
    style: {},
    classList: { add() {}, remove() {}, contains() { return false; } },
    appendChild() {},
    insertBefore() {},
    contains: () => true,
    children: []
  }),
  addEventListener: () => {}
};

const sandbox = {
  console,
  setTimeout: (fn) => fn(),
  clearTimeout: () => {},
  setInterval: () => 1,
  clearInterval: () => {},
  document: mockDoc,
  window: {},
  navigator: { userAgent: 'Node-QA-Agent' }
};
sandbox.window = sandbox;
sandbox.window.localStorage = mockLocalStorage;
sandbox.window.document = mockDoc;
sandbox.localStorage = mockLocalStorage;

vm.createContext(sandbox);

// 3. Carregar scripts na ordem do index.html (exceto 36_inicializacao.js para testarmos as funções antes do init)
for (const file of scriptFiles) {
  if (file === 'js/36_inicializacao.js') continue;
  const filePath = path.join(__dirname, file);
  assert(fs.existsSync(filePath), `Arquivo ${filePath} deve existir no disco`);
  const code = fs.readFileSync(filePath, 'utf8');
  try {
    vm.runInContext(code, sandbox, { filename: file });
  } catch (err) {
    console.error(`ERRO AO EXECUTAR ${file}:`, err);
    process.exit(1);
  }
}

// Vincular referências do escopo global
vm.runInContext(`
  if (typeof DATA !== 'undefined') window.DATA = DATA;
  if (typeof Engine !== 'undefined') window.Engine = Engine;
  if (typeof UI !== 'undefined') window.UI = UI;
  if (typeof Creator !== 'undefined') window.Creator = Creator;
  if (typeof Storage !== 'undefined') window.Storage = Storage;
  if (typeof CONFIG !== 'undefined') window.CONFIG = CONFIG;
  if (typeof Utils !== 'undefined') window.Utils = Utils;
  if (typeof SoundFX !== 'undefined') window.SoundFX = SoundFX;
`, sandbox);

console.log('[PASS 1.3] Todos os scripts foram executados no VM na ordem do index.html sem erros!');

const { DATA, Engine, UI, Creator, Storage, CONFIG, Utils } = sandbox.window;

let { STATE } = sandbox;

// 4. Auditoria das Regras da 4.0

// A) Mercado novo "from scratch" com bens gerando/não gerando renda, custos, flutuação regional, estado e barganha
console.log('\n--- Testando 4.A: Mercado 4.0, Bens, Custos, Renda, Flutuação e Barganha ---');
assert(Array.isArray(DATA.items) && DATA.items.length >= 30, `DATA.items deve ter >= 30 itens (atual: ${DATA.items.length})`);

const itemsWithIncome = DATA.items.filter(i => (i.income || 0) > 0);
const itemsWithoutIncome = DATA.items.filter(i => !i.income || i.income === 0);
const itemsWithUpkeep = DATA.items.filter(i => (i.upkeep || 0) > 0);
const itemsWithoutUpkeep = DATA.items.filter(i => !i.upkeep || i.upkeep === 0);

assert(itemsWithIncome.length > 5, 'Devem existir múltiplos bens gerando renda');
assert(itemsWithoutIncome.length > 5, 'Devem existir múltiplos bens que não geram renda');
assert(itemsWithUpkeep.length > 5, 'Devem existir múltiplos bens gerando custos de manutenção');
assert(itemsWithoutUpkeep.length >= 3, 'Devem existir bens sem custos de manutenção');

console.log(`  Bens com renda: ${itemsWithIncome.length}, sem renda: ${itemsWithoutIncome.length}`);
console.log(`  Bens com custos: ${itemsWithUpkeep.length}, sem custos: ${itemsWithoutUpkeep.length}`);

// Teste de flutuação regional
const baseCasebrePrice = DATA.items.find(i => i.id === 'casebre_madeira').price;
const sevCasebrePrice = Engine.getItemRegionalPrice('casebre_madeira', 'severnaya', 'novo');
const valCasebrePrice = Engine.getItemRegionalPrice('casebre_madeira', 'valois', 'novo');
assert(sevCasebrePrice < valCasebrePrice, 'Casebre deve ser mais barato em Severnaya devido ao modificador regional 0.8');

// Teste de estados de conservação
const novoPrice = Engine.getItemRegionalPrice('solar_nobre', 'valois', 'novo');
const desgastadoPrice = Engine.getItemRegionalPrice('solar_nobre', 'valois', 'desgastado');
const arruinadoPrice = Engine.getItemRegionalPrice('solar_nobre', 'valois', 'arruinado');
assert(novoPrice > desgastadoPrice && desgastadoPrice > arruinadoPrice, 'Preço deve reduzir progressivamente com desgaste');

console.log('[PASS 4.A] Mercado 4.0 validado: bens, renda, custos, flutuação e estados.');

// B) Classe social recalculada automaticamente por patrimônio líquido anual
console.log('\n--- Testando 4.B: Recálculo Automático de Classe Social por Patrimônio Líquido ---');
// Inicializar um STATE sintético dentro do sandbox
vm.runInContext(`
STATE = {
  name: 'Aldo de Val',
  surname: 'Val',
  sex: 'M',
  age: 25,
  year: 1200,
  kingdom: 'valois',
  socialClass: 'plebeu',
  wealthTier: 'plebeu',
  gold: 20,
  debt: 0,
  reputation: 0,
  honor: 50,
  hp: 70,
  maxHp: 70,
  vigor: 100,
  maxVigor: 100,
  attrs: { forca: 50, destreza: 50, intelecto: 50, carisma: 50, beleza: 50, saude: 70, fe: 50, sorte: 50 },
  traits: [],
  inventory: [],
  itemInstances: [],
  activeLoans: [],
  bankerLoans: [],
  npcs: [],
  flags: [],
  history: [],
  log: [],
  nobleTitleLevel: 0,
  successionLaw: 'primogenitura',
  scars: []
};
window.STATE = STATE;
`, sandbox);

const testState = sandbox.window.STATE;

assert.strictEqual(Engine.getNetWorth(), 20);
Engine.recalculateSocialClassByWealth();
assert.strictEqual(testState.socialClass, 'plebeu');

// Elevar para classe média via ouro (>= 350 burguês -> classe média)
testState.gold = 500;
Engine.recalculateSocialClassByWealth();
assert.strictEqual(testState.socialClass, 'media', 'Patrimônio de 500 deve elevar para classe média');
assert.strictEqual(testState.wealthTier, 'burgues');

// Adicionar um imóvel e atingir patrimônio nobre (>= 3000)
testState.gold = 3500;
testState.itemInstances.push({
  uid: 'inst_solar_test',
  id: 'solar_nobre',
  state: 'novo',
  kingdom: 'valois',
  mortgaged: false
});
testState.inventory.push('solar_nobre');
Engine.recalculateSocialClassByWealth();
assert.strictEqual(testState.socialClass, 'nobre', 'Patrimônio >= 3000 deve elevar para nobre');
assert.strictEqual(testState.wealthTier, 'nobre');

// Reduzir patrimônio a miséria (< 60)
testState.gold = 10;
testState.itemInstances = [];
testState.inventory = [];
Engine.recalculateSocialClassByWealth();
assert.strictEqual(testState.socialClass, 'plebeu', 'Perda total de patrimônio deve rebaixar da nobreza para plebeu');
assert.strictEqual(testState.wealthTier, 'miseravel');

console.log('[PASS 4.B] Recálculo automático de classe social por patrimônio líquido validado.');

// C) Nobreza titular com critérios de posses físicas e variação regional
console.log('\n--- Testando 4.C: Nobreza Titular e Critérios de Posses Físicas ---');
testState.socialClass = 'nobre';
testState.nobleTitleLevel = 1;
testState.gold = 100;
testState.itemInstances = [];

// Sem propriedades físicas, hasRequiredNoblePossessions deve ser falso
assert.strictEqual(Engine.hasRequiredNoblePossessions(1), false, 'Nobreza sem posses mínimas de 600 deve falhar');

// Com terra arável e patrimônio
testState.gold = 350;
testState.itemInstances.push({
  uid: 'inst_terra_test',
  id: 'terra_aravel',
  state: 'novo',
  kingdom: 'valois',
  mortgaged: false
});
// 350 + ~378 >= 600 de patrimônio
assert.strictEqual(Engine.hasRequiredNoblePossessions(1), true, 'Deve ter posses para nível 1');

// Em reino marítimo como serenissima, navio_mercante conta como propriedade nobiliárquica
testState.kingdom = 'serenissima';
testState.itemInstances = [{
  uid: 'inst_navio_test',
  id: 'navio_mercante',
  state: 'novo',
  kingdom: 'serenissima',
  mortgaged: false
}];
testState.gold = 500;
assert.strictEqual(Engine.hasRequiredNoblePossessions(1), true, 'Navio mercante deve ser aceito como posse em reino marítimo');

console.log('[PASS 4.C] Nobreza titular com posses territoriais e regras marítimas validada.');

// D) Empréstimos históricos em modelo duplo (tomador com penhora e banqueiro/usurário)
console.log('\n--- Testando 4.D: Sistema Bancário Duplo (Tomador com Penhora & Concessão de Usura) ---');
testState.gold = 50;
testState.debt = 0;
testState.activeLoans = [];
testState.bankerLoans = [];
testState.itemInstances = [];

// 1. Tomador com penhora (Casa Bancária exige hipoteca)
assert.strictEqual(DATA.loanCreditors.casa_bancaria !== undefined, true);
// Tentar sem garantia hipotecária
Engine.takeHistoricalLoan('casa_bancaria');
assert.strictEqual(testState.activeLoans.length, 0, 'Casa bancária não deve emprestar sem hipoteca');

// Adicionar um imóvel para hipoteca
testState.itemInstances = [{
  uid: 'inst_casa_hipoteca',
  id: 'casa_urbana',
  state: 'bom',
  kingdom: 'valois',
  mortgaged: false
}];
Engine.takeHistoricalLoan('casa_bancaria');
assert.strictEqual(testState.activeLoans.length, 1, 'Empréstimo bancário deve ser concedido com hipoteca');
assert.strictEqual(testState.itemInstances[0].mortgaged, true, 'Imóvel deve ficar hipotecado');
assert(testState.gold > 50, 'Ouro deve ter aumentado com o empréstimo');

// Quitar empréstimo e liberar hipoteca
const loanUid = testState.activeLoans[0].uid;
testState.gold = 5000;
Engine.payHistoricalLoan(loanUid);
assert.strictEqual(testState.activeLoans.length, 0, 'Empréstimo deve ter sido liquidado');
assert.strictEqual(testState.itemInstances[0].mortgaged, false, 'Hipoteca deve ter sido cancelada');

// 2. Concessão de crédito como Banqueiro
assert.strictEqual(DATA.bankerClients.mercador_aventureiro !== undefined, true);
testState.gold = 1000;
Engine.issueBankerLoan('mercador_aventureiro');
assert.strictEqual(testState.bankerLoans.length, 1, 'Investimento de banqueiro deve ser registrado');
assert.strictEqual(testState.gold, 1000 - 150, 'Ouro deve ter sido deduzido para a concessão');

console.log('[PASS 4.D] Modelo duplo de empréstimos (tomador com garantia e banqueiro investidor) validado.');

// E) Gravidez: mulheres engravidam, homens sem limite de idade e múltiplas parceiras, gêmeos, legitimidade
console.log('\n--- Testando 4.E: Gravidez Biológica, Homens Sem Teto de Idade, Multiparcerias, Gêmeos e Decisões ---');
const oldMale = { id: 'old_man', sex: 'M', age: 75, alive: true };
const youngFemale = { id: 'young_woman', sex: 'F', age: 22, alive: true };
const oldFemale = { id: 'old_woman', sex: 'F', age: 48, alive: true };

// Homem de 75 anos pode engravidar mulher de 22
assert.strictEqual(Engine.canPairConceive(oldMale, youngFemale).canConceive, true, 'Homem de 75 anos pode engravidar');
// Mulher de 48 anos não pode engravidar (limite 45)
assert.strictEqual(Engine.canPairConceive(oldMale, oldFemale).canConceive, false, 'Mulher acima de 45 anos não pode engravidar');

// Homem jogador engravidando múltiplas parceiras no mesmo ano
testState.sex = 'M';
testState.age = 50;
testState.pregnancies = [];
testState.pregnancy = null;

const npcLover1 = { id: 'npc_l1', name: 'Amante 1', sex: 'F', age: 20, role: 'Amor', alive: true };
const npcLover2 = { id: 'npc_l2', name: 'Amante 2', sex: 'F', age: 24, role: 'Amor', alive: true };

const preg1 = Engine.tryConceiveWithPartner(npcLover1);
assert(preg1 !== null, 'Primeira concepção deve ter sucesso');
const preg2 = Engine.tryConceiveWithPartner(npcLover2);
assert(preg2 !== null, 'Segunda concepção no mesmo ano deve ter sucesso para homem');
assert.strictEqual(testState.pregnancies.length, 2, 'Homem deve poder acumular múltiplas gestações de parceiras no ano');

// Tentativa da mesma mulher engravidar de novo no mesmo ano deve ser bloqueada
const pregDuplicate = Engine.tryConceiveWithPartner(npcLover1);
assert.strictEqual(pregDuplicate, null, 'Mesma mulher não pode ter duas gestações simultâneas no mesmo ano');

console.log('[PASS 4.E] Regras de gravidez e fertilidade masculina/feminina validadas.');

// F) Conquistas persistentes em localStorage e Tags de Legado puramente visuais
console.log('\n--- Testando 4.F: Conquistas em localStorage e Tags de Legado Visuais ---');
Storage.unlockAchievement('ach_primeira_moeda');
const achList = Storage.getAchievements();
assert(achList.includes('ach_primeira_moeda'), 'Conquista deve estar salva no localStorage');

// Teste de computeLegacyTags
testState.gold = 600;
testState.attrs.forca = 70;
testState.attrs.intelecto = 75;
const tags = Engine.computeLegacyTags();
assert(Array.isArray(tags) && tags.length > 0, 'Tags de legado devem ser geradas');
assert(tags.some(t => t.id === 'sangue_guerreiro'), 'Deve gerar tag Sangue Guerreiro por Força >= 65');
assert(tags.some(t => t.id === 'cofre_hereditario'), 'Deve gerar tag Cofre Hereditário por Ouro >= 500');

console.log(`  Tags geradas: ${tags.map(t => t.name).join(', ')}`);
console.log('[PASS 4.F] Conquistas e tags de legado validadas com sucesso.');

// G) 10 profissões e 10 atividades exclusivas por região
console.log('\n--- Testando 4.G: 10 Profissões e 10 Atividades Exclusivas por Região ---');
const exclusiveJobs = DATA.jobs.filter(j => j.exclusiveKingdom);
const exclusiveActivities = DATA.activities.filter(a => a.exclusiveKingdom);

assert.strictEqual(exclusiveJobs.length, 10, `Devem existir exatamente 10 profissões exclusivas (atual: ${exclusiveJobs.length})`);
assert.strictEqual(exclusiveActivities.length, 10, `Devem existir exatamente 10 atividades exclusivas (atual: ${exclusiveActivities.length})`);

const kingdomsWithJobs = new Set(exclusiveJobs.map(j => j.exclusiveKingdom));
const kingdomsWithActs = new Set(exclusiveActivities.map(a => a.exclusiveKingdom));

assert.strictEqual(kingdomsWithJobs.size, 10, 'Cada uma das 10 profissões deve pertencer a um reino único');
assert.strictEqual(kingdomsWithActs.size, 10, 'Cada uma das 10 atividades deve pertencer a um reino único');

console.log(`  10 reinos cobertos: ${[...kingdomsWithJobs].join(', ')}`);
console.log('[PASS 4.G] 10 profissões e 10 atividades exclusivas por região validadas.');

// H) Sucessão familiar com leis claras (Primogenitura, Partilha, Designada)
console.log('\n--- Testando 4.H: Leis de Sucessão Familiar (Primogenitura, Partilha, Designada) ---');
assert(DATA.successionLaws.primogenitura !== undefined, 'Lei da primogenitura deve existir');
assert(DATA.successionLaws.partilha !== undefined, 'Lei da partilha deve existir');
assert(DATA.successionLaws.designada !== undefined, 'Lei da sucessão designada deve existir');

testState.npcs = [
  { id: 'f1', name: 'Primogênito', role: 'Filho', age: 20, alive: true, legitimacy: 'legitimo', attrs: { saude: 60 } },
  { id: 'f2', name: 'Segundo Filho', role: 'Filho', age: 16, alive: true, legitimacy: 'legitimo', attrs: { saude: 55 } },
  { id: 'f3', name: 'Filho Designado', role: 'Filho', age: 12, alive: true, legitimacy: 'legitimo', attrs: { saude: 50 } }
];

// Primogenitura: primeiro da lista deve ser f1 (mais velho)
testState.successionLaw = 'primogenitura';
let heirs = Engine.getEligibleHeirs();
assert.strictEqual(heirs[0].id, 'f1', 'Primogenitura deve eleger o filho mais velho');

// Designada: se f3 for o designado, ele vem primeiro
testState.successionLaw = 'designada';
testState.designatedHeirId = 'f3';
heirs = Engine.getEligibleHeirs();
assert.strictEqual(heirs[0].id, 'f3', 'Sucessão designada deve priorizar o herdeiro selecionado');

// Partilha: divisão de ouro entre os herdeiros legítimos
testState.successionLaw = 'partilha';
testState.gold = 300;
testState.generation = 1;
Engine.succeedWithHeir('f2');
const newState = vm.runInContext('STATE', sandbox);
assert.strictEqual(newState.gold, 100, 'Partilha entre 3 filhos deve dividir 300 ouro em 100 para o herdeiro assumido');
assert.strictEqual(newState.name, 'Segundo Filho');
assert.strictEqual(newState.generation, 2);

console.log('[PASS 4.H] Leis de sucessão dinástica validadas com sucesso.');

console.log('\n================================================================');
console.log('  TODOS OS TESTES DE QA DA VERSÃO 4.0 FORAM APROVADOS (100% OK)');
console.log('================================================================\n');

