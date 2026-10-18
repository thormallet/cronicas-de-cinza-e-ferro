/* ============================================================================
   [ESTADO E ARMAZENAMENTO] — STATE, CONFIG, SafeStorage e Storage (slots, panteão, exportar/importar)
   ============================================================================ */
let STATE = null;
let CONFIG = { typewriter: false, theme: "light", activeSlot: 0, selectedNpcId: null };
const MEMORY_STORE = {};

const SafeStorage = {
  getItem(key) {
    try { return window.localStorage.getItem(key); }
    catch (e) { return MEMORY_STORE[key] || null; }
  },
  setItem(key, val) {
    try { window.localStorage.setItem(key, val); }
    catch (e) { MEMORY_STORE[key] = val; }
  }
};

const Storage = {
  KEY_SLOTS: "ccf_save_slots_v4",
  KEY_DYNASTY: "ccf_dynasty_v4",
  KEY_ACHIEVEMENTS: "ccf_achievements_v4",

  getSlots() {
    try {
      const raw = SafeStorage.getItem(this.KEY_SLOTS);
      return raw ? JSON.parse(raw) : [null, null, null];
    } catch (e) { return [null, null, null]; }
  },

  getAchievements() {
    try {
      const raw = SafeStorage.getItem(this.KEY_ACHIEVEMENTS);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  },

  unlockAchievement(achId) {
    if (!achId) return false;
    const list = this.getAchievements();
    if (list.includes(achId)) return false;
    list.push(achId);
    SafeStorage.setItem(this.KEY_ACHIEVEMENTS, JSON.stringify(list));
    return true;
  },

  saveToSlot(slotIdx = CONFIG.activeSlot) {
    if (!STATE) return;
    const slots = this.getSlots();
    slots[slotIdx] = JSON.parse(JSON.stringify(STATE));
    SafeStorage.setItem(this.KEY_SLOTS, JSON.stringify(slots));
    UI.renderMenuSlots();
  },

  loadSlot(slotIdx) {
    const slots = this.getSlots();
    if (!slots[slotIdx]) return;
    SoundFX.play("click");
    CONFIG.activeSlot = slotIdx;
    STATE = slots[slotIdx];
    if (window.Engine && Engine.ensureStateIntegrity) Engine.ensureStateIntegrity(STATE);
    UI.showScreen("screen-game");
    document.getElementById("log-container").innerHTML = "";
    UI.renderAll();
  },

  deleteSlot(slotIdx) {
    SoundFX.play("click");
    const slots = this.getSlots();
    slots[slotIdx] = null;
    SafeStorage.setItem(this.KEY_SLOTS, JSON.stringify(slots));
    UI.renderMenuSlots();
  },

  getDynasty() {
    try {
      const raw = SafeStorage.getItem(this.KEY_DYNASTY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  },

  recordPastLife(record) {
    const list = this.getDynasty();
    list.unshift(record);
    SafeStorage.setItem(this.KEY_DYNASTY, JSON.stringify(list.slice(0, 50)));
    UI.renderMenuSlots();
  },

  exportSave() {
    SoundFX.play("click");
    const payload = {
      state: STATE,
      slots: this.getSlots(),
      dynasty: this.getDynasty(),
      achievements: this.getAchievements()
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `cronicas_save_${STATE ? STATE.name.replace(/\s+/g, "_") : "geral"}.json`;
    a.click();
  },

  importSave(ev) {
    const file = ev.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.slots) SafeStorage.setItem(this.KEY_SLOTS, JSON.stringify(data.slots));
        if (data.dynasty) SafeStorage.setItem(this.KEY_DYNASTY, JSON.stringify(data.dynasty));
        if (data.achievements) SafeStorage.setItem(this.KEY_ACHIEVEMENTS, JSON.stringify(data.achievements));
        if (data.state) {
          STATE = data.state;
          if (window.Engine && Engine.ensureStateIntegrity) Engine.ensureStateIntegrity(STATE);
          UI.showScreen("screen-game");
          document.getElementById("log-container").innerHTML = "";
          UI.renderAll();
        } else {
          UI.renderMenuSlots();
        }
        UI.notify("Crônica Importada", "Os pergaminhos foram restaurados com sucesso.");
      } catch (err) {
        UI.notify("Erro de Leitura", "O arquivo JSON selecionado é inválido.");
      }
    };
    reader.readAsText(file);
  }
};
