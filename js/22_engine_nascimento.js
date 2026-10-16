/* ============================================================================
   [ENGINE · NASCIMENTO] — parto, escolha do nome e batismo do herdeiro
   ============================================================================ */
Object.assign(Engine, {
  resolveChildbirth() {
    const preg = STATE.pregnancy;
    STATE.pregnancy = null;
    const partner = STATE.npcs.find(n => n.id === preg.partnerId);
    const partnerName = partner ? partner.name : preg.partnerName;

    if (Math.random() < 0.11) {
      if (STATE.sex === "F") {
        STATE.hp = Math.max(5, STATE.hp - 12);
      }
      const partnerDesc = (partnerName === "um romance furtivo")
        ? (STATE.sex === "F" ? "fruto de um romance furtivo" : "da sua amante secreta")
        : `com ${partnerName}`;
      const lossMsg = STATE.sex === "F"
        ? `Uma tristeza profunda abateu-se sobre a casa: sua gestação ${partnerDesc} interrompeu-se prematuramente numa noite fria e a criança não resistiu antes de ver a luz do mundo.`
        : `Uma tristeza profunda abateu-se sobre a casa: a gestação de ${partnerName || "sua companheira"} interrompeu-se prematuramente numa noite fria e a criança não resistiu antes de ver a luz do mundo.`;
      this.addLog(`🕯️ PERDA GESTACIONAL: ${lossMsg}`, "bad");
      UI.notify("🕯️ Luto na Gestação", lossMsg, "death");
      return;
    }

    if ((STATE.sex === "F" || (partner && partner.sex === "F")) && Math.random() < 0.08) {
      if (STATE.sex === "F") {
        STATE.hp = Math.max(5, STATE.hp - 16);
        this.addLog("As dores do parto prolongaram-se por uma noite inteira de agonia e perda de sangue (-16 Saúde)!", "bad");
      } else if (partner && partner.alive) {
        this.addLog(`O trabalho de parto de ${partnerName} foi dramático e exauriu as forças dela, mas as parteiras conseguiram salvá-la.`, "bad");
      }
    }

    const childSex = Math.random() < 0.5 ? "M" : "F";
    const child = Utils.genNPC("Filho", 0, childSex, STATE.surname, STATE.socialClass);
    child.appearance = inheritChildAppearance(STATE, partner || STATE, childSex, child.id);
    if (partner && partner.attrs) {
      Object.keys(child.attrs).forEach(k => {
        const avg = Math.round(((STATE.attrs[k] || 50) + (partner.attrs[k] || 50)) / 2);
        child.attrs[k] = Utils.clamp(avg + Utils.rand(-8, 14), 20, 95);
      });
    }

    const fatherSurname = STATE.sex === "M" ? STATE.surname : (partner && partner.surname ? partner.surname : STATE.surname);
    const motherSurname = STATE.sex === "F" ? STATE.surname : (partner && partner.surname ? partner.surname : STATE.surname);

    STATE.pendingChild = {
      child,
      partnerName,
      fatherSurname,
      motherSurname,
      isBastard: preg.isBastard
    };

    SoundFX.play("bells");
    UI.openChildNameModal();
  },

  randomChildModalName() {
    if (!STATE || !STATE.pendingChild) return;
    const s = STATE.pendingChild.child.sex;
    const pools = Utils.getCulturalNamePools(STATE.kingdom);
    const first = s === "M" ? Utils.pick(pools.namesM) : Utils.pick(pools.namesF);
    document.getElementById("child-custom-name").value = first;
  },

  confirmChildName() {
    if (!STATE || !STATE.pendingChild) return;
    const rawFirst = document.getElementById("child-custom-name").value.trim();
    const surnameSelect = document.getElementById("child-custom-surname");
    const { child, partnerName, isBastard } = STATE.pendingChild;
    const pools = Utils.getCulturalNamePools(STATE.kingdom);
    const defaultFirst = child.sex === "M" ? Utils.pick(pools.namesM) : Utils.pick(pools.namesF);
    const chosenFirst = rawFirst || defaultFirst;
    const chosenSurname = (surnameSelect && surnameSelect.value) ? surnameSelect.value : STATE.surname;

    child.name = `${chosenFirst} ${chosenSurname}`;
    child.surname = chosenSurname;
    child.maritalStatus = "Solteiro(a)";
    const partnerDesc = (partnerName === "um romance furtivo")
      ? (STATE.sex === "F" ? "de uma paixão furtiva" : "com sua amante secreta")
      : `com ${partnerName}`;
    child.memory = isBastard
      ? `Fruto ${partnerDesc}, batizado sob o sobrenome ${chosenSurname}.`
      : `Nascido do leito legítimo com ${partnerName}, batizado na Casa ${chosenSurname} no ano ${STATE.year}.`;

    STATE.npcs.push(child);
    this.syncFamilyNobleTitles();
    STATE.pendingChild = null;
    document.getElementById("child-name-backdrop").classList.remove("active");

    SoundFX.play("bells");
    if (window.UI && window.UI.triggerStageFX) window.UI.triggerStageFX("👶");
    const heirBadge = child.nobleTitle ? ` como **${child.nobleTitle}**` : "";
    const birthActor = STATE.sex === "F" ? "você deu à luz" : (partnerName === "um romance furtivo" ? "sua amante deu à luz" : `${partnerName} deu à luz`);
    this.addLog(`👶 NASCIMENTO E BATISMO: Após nove luas de gestação, ${birthActor} um(a) ${child.sex === "M" ? "menino" : "menina"} saudável! Na pia batismal, recebeu o nome de **${child.name}**${heirBadge}.`, "epoch");

    Storage.saveToSlot(CONFIG.activeSlot);
    UI.renderAll();
  }
});
