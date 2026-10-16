/* ============================================================================
   [INICIALIZAÇÃO] — exporta os módulos no objeto window e desenha o menu inicial
   ============================================================================ */
window.SoundFX = SoundFX;
window.DATA = DATA;
window.CONFIG = CONFIG;
window.Storage = Storage;
window.Utils = Utils;
window.Creator = Creator;
window.Engine = Engine;
window.UI = UI;
window.renderRetrato = renderRetrato;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.UI.renderMenuSlots();
  });
} else {
  window.UI.renderMenuSlots();
}
