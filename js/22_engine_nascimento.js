/* ============================================================================
   [ENGINE · NASCIMENTO] — concepção, gestações múltiplas, parto e legitimidade
   ============================================================================ */
Object.assign(Engine, {
  canPairConceive(personA, personB) {
    if (!personA || !personB) return { canConceive: false };
    const isOpposite = (personA.sex === "M" && personB.sex === "F") || (personA.sex === "F" && personB.sex === "M");
    if (!isOpposite) return { canConceive: false };
    const male = personA.sex === "M" ? personA : personB;
    const female = personA.sex === "F" ? personA : personB;
    if (female.age < 16 || female.age > 45 || male.age < 16) return { canConceive: false };

    const femaleId = female.id || (female === STATE ? "player" : null);
    const pregs = Array.isArray(STATE.pregnancies) ? STATE.pregnancies : [];
    if (pregs.some(p => p.motherId === femaleId || (female === STATE && p.isPlayerMother))) {
      return { canConceive: false };
    }
    return { canConceive: true, male, female };
  },

  tryConceiveWithPartner(npc, forcedBastard = null) {
    if (!STATE || !npc || !npc.alive) return null;
    const check = this.canPairConceive(STATE, npc);
    if (!check.canConceive) return null;

    const isSpouse = (npc.role === "Esposa" || npc.role === "Marido" || npc.role === "Cônjuge");
    const isBastard = forcedBastard !== null ? forcedBastard : !isSpouse;
    const isPlayerMother = STATE.sex === "F";

    const preg = {
      id: "preg_" + Math.random().toString(36).slice(2, 9),
      motherId: isPlayerMother ? "player" : npc.id,
      motherName: isPlayerMother ? STATE.name : npc.name,
      motherRole: isPlayerMother ? "player" : npc.role,
      motherSurname: isPlayerMother ? STATE.surname : (npc.surname || STATE.surname),
      fatherId: isPlayerMother ? npc.id : "player",
      fatherName: isPlayerMother ? npc.name : STATE.name,
      fatherSurname: isPlayerMother ? (npc.surname || STATE.surname) : STATE.surname,
      isPlayerMother, isBastard,
      isTwins: Math.random() < 0.02,
      partnerId: npc.id,
      partnerName: npc.name
    };

    if (!Array.isArray(STATE.pregnancies)) STATE.pregnancies = [];
    STATE.pregnancies.push(preg);
    STATE.pregnancy = STATE.pregnancies[0] || null;
    return preg;
  },

  ensureLegitimacyUI() {
    if (!STATE || !STATE.pendingChild) return;
    const modal = document.querySelector("#child-name-backdrop .custom-dialog");
    if (!modal) return;
    let grp = document.getElementById("child-legitimacy-group");
    const isBastardPlayerM = STATE.pendingChild.isBastard && STATE.sex === "M";
    if (isBastardPlayerM) {
      if (!grp) {
        grp = document.createElement("div");
        grp.id = "child-legitimacy-group";
        grp.className = "form-group";
        grp.innerHTML = `<label><strong>Decisão Paterna de Legitimidade</strong></label><select id="child-legitimacy-choice"><option value="bastardo_reconhecido">Reconhecer como Bastardo da Casa (-3 Honra)</option><option value="legitimo">Legitimar como Herdeiro Pleno (-50 Ouro, -6 Honra)</option><option value="abandonado">Negar / Entregar à Roda dos Expostos (-10 Honra)</option></select>`;
        const btnBox = modal.querySelector(".custom-dialog-buttons");
        if (btnBox) modal.insertBefore(grp, btnBox);
        else modal.appendChild(grp);
      } else { grp.style.display = "block"; }
    } else if (grp) { grp.style.display = "none"; }
  },

  resolveChildbirth() {
    if (!Array.isArray(STATE.pregnancies) || STATE.pregnancies.length === 0) {
      if (STATE.pregnancy) {
        STATE.pregnancies = [{
          id: "preg_leg",
          motherId: STATE.sex === "F" ? "player" : (STATE.pregnancy.partnerId || "npc"),
          motherName: STATE.sex === "F" ? STATE.name : (STATE.pregnancy.partnerName || "Companheira"),
          motherRole: STATE.sex === "F" ? "player" : "Cônjuge",
          motherSurname: STATE.surname,
          fatherId: STATE.sex === "M" ? "player" : (STATE.pregnancy.partnerId || "npc"),
          fatherName: STATE.sex === "M" ? STATE.name : (STATE.pregnancy.partnerName || "Companheiro"),
          fatherSurname: STATE.surname,
          isPlayerMother: STATE.sex === "F",
          isBastard: !!STATE.pregnancy.isBastard,
          isTwins: false,
          partnerId: STATE.pregnancy.partnerId,
          partnerName: STATE.pregnancy.partnerName
        }];
        STATE.pregnancy = null;
      } else { return; }
    }

    const pregs = [...STATE.pregnancies];
    STATE.pregnancies = [];
    STATE.pregnancy = null;
    if (!Array.isArray(STATE.pendingBirthQueue)) STATE.pendingBirthQueue = [];

    pregs.forEach(preg => {
      if (Math.random() < 0.11) {
        if (preg.isPlayerMother) STATE.hp = Math.max(5, STATE.hp - 12);
        const pDesc = (preg.partnerName === "um romance furtivo") ? (preg.isPlayerMother ? "fruto de romance furtivo" : "da sua amante secreta") : `com ${preg.partnerName}`;
        const lossMsg = preg.isPlayerMother ? `Uma tristeza abateu-se sobre o lar: sua gestação ${pDesc} interrompeu-se antes do tempo.` : `A gestação de ${preg.partnerName || "sua companheira"} interrompeu-se numa noite fria.`;
        this.addLog(`🕯️ PERDA GESTACIONAL: ${lossMsg}`, "bad");
        UI.notify("🕯️ Luto na Gestação", lossMsg, "death");
        return;
      }

      if (preg.isPlayerMother && Math.random() < 0.08) {
        STATE.hp = Math.max(5, STATE.hp - 16);
        this.addLog("As dores do parto prolongaram-se por horas de agonia (-16 Saúde)!", "bad");
      } else if (!preg.isPlayerMother && Math.random() < 0.08) {
        this.addLog(`O trabalho de parto de ${preg.partnerName} foi dramático, mas as parteiras conseguiram salvá-la.`, "bad");
      }

      const babyCount = preg.isTwins ? 2 : 1;
      if (preg.isTwins) {
        Storage.unlockAchievement("ach_gemeos");
        this.addLog(`✨ MILAGRE DO PARTO: O ventre gerou duas vidas — gêmeos nasceram de ${preg.motherName}!`, "epoch");
      }

      const partner = STATE.npcs.find(n => n.id === preg.partnerId);
      for (let i = 0; i < babyCount; i++) {
        const childSex = Math.random() < 0.5 ? "M" : "F";
        const childRole = childSex === "F" ? "Filha" : "Filho";
        const child = Utils.genNPC(childRole, 0, childSex, STATE.surname, STATE.socialClass);
        child.nobleTitleLevel = 0;
        child.nobleTitle = "";
        child.appearance = inheritChildAppearance(STATE, partner || STATE, childSex, child.id);

        if (partner && partner.attrs) {
          Object.keys(child.attrs).forEach(k => {
            const avg = Math.round(((STATE.attrs[k] || 50) + (partner.attrs[k] || 50)) / 2);
            child.attrs[k] = Utils.clamp(avg + Utils.rand(-8, 14), 20, 95);
          });
        }

        if (!preg.isBastard) {
          child.legitimacy = "legitimo";
          child.isBastard = false;
        } else if (STATE.sex === "F") {
          if (partner && (partner.affinity || 0) >= 70) {
            child.legitimacy = "legitimo"; child.isBastard = false; child.surname = partner.surname || STATE.surname;
            STATE.gold += 35;
            this.addLog(`📜 PATERNIDADE RECONHECIDA: ${partner.name} reconheceu publicamente seu filho como herdeiro legítimo e proveu uma pensão de 35 Ouro para a Casa ${child.surname}!`, "good");
          } else if (partner && (partner.affinity || 0) >= 30) {
            child.legitimacy = "bastardo_reconhecido"; child.isBastard = true;
            this.addLog(`🕯️ BASTARDO RECONHECIDO: ${partner.name} reconheceu a paternidade de seu filho como bastardo de sua linhagem.`, "normal");
          } else {
            child.legitimacy = "bastardo_reconhecido"; child.isBastard = true;
            this.addLog(`⚠️ PATERNIDADE NEGADA: ${preg.fatherName} recusou vínculo com a criança.`, "bad");
          }
        } else {
          child.legitimacy = "bastardo_reconhecido";
          child.isBastard = true;
        }

        STATE.pendingBirthQueue.push({
          child, partnerName: preg.partnerName,
          fatherSurname: preg.fatherSurname || STATE.surname,
          motherSurname: preg.motherSurname || STATE.surname,
          isBastard: preg.isBastard, isTwins: preg.isTwins,
          isPlayerMother: preg.isPlayerMother, partnerId: preg.partnerId
        });
      }
    });

    if (STATE.pendingBirthQueue.length > 0) {
      STATE.pendingChild = STATE.pendingBirthQueue.shift();
      SoundFX.play(STATE.socialClass === "nobre" ? "cathedral_bells" : "bells");
      this.ensureLegitimacyUI();
      UI.openChildNameModal();
    }
  },

  randomChildModalName() {
    if (!STATE || !STATE.pendingChild) return;
    const pools = Utils.getCulturalNamePools(STATE.kingdom);
    const first = STATE.pendingChild.child.sex === "M" ? Utils.pick(pools.namesM) : Utils.pick(pools.namesF);
    const nameInput = document.getElementById("child-custom-name");
    if (nameInput) nameInput.value = first;
  },

  confirmChildName() {
    if (!STATE || !STATE.pendingChild) return;
    const rawInput = document.getElementById("child-custom-name");
    const rawFirst = rawInput ? rawInput.value.trim() : "";
    const surnameSelect = document.getElementById("child-custom-surname");
    const legSelect = document.getElementById("child-legitimacy-choice");
    const { child, partnerName, isBastard } = STATE.pendingChild;
    const pools = Utils.getCulturalNamePools(STATE.kingdom);
    const defaultFirst = child.sex === "M" ? Utils.pick(pools.namesM) : Utils.pick(pools.namesF);
    const chosenFirst = rawFirst || defaultFirst;
    const chosenSurname = (surnameSelect && surnameSelect.value) ? surnameSelect.value : STATE.surname;

    child.name = `${chosenFirst} ${chosenSurname}`;
    child.surname = chosenSurname;
    child.maritalStatus = "Solteiro(a)";

    if (isBastard && STATE.sex === "M" && legSelect) {
      const choice = legSelect.value;
      if (choice === "legitimo") {
        STATE.gold = Math.max(0, STATE.gold - 50);
        STATE.honor = Math.max(0, STATE.honor - 6);
        child.legitimacy = "legitimo"; child.isBastard = false;
        child.surname = STATE.surname; child.name = `${chosenFirst} ${STATE.surname}`;
        const spouse = STATE.npcs.find(n => n.role === "Cônjuge" && n.alive);
        if (spouse) {
          spouse.affinity = Utils.clamp(spouse.affinity - 30, -100, 100);
          this.addLog(`💔 FÚRIA CONJUGAL: Sua esposa ${spouse.name} sentiu-se ultrajada com a legitimação pública do bastardo (-30 Afinidade)!`, "bad");
        }
        this.addLog(`📜 RECONHECIMENTO PLENO: Você legitimou ${chosenFirst} como herdeiro pleno da Casa ${STATE.surname} (-50 Ouro, -6 Honra).`, "good");
      } else if (choice === "abandonado") {
        STATE.honor = Math.max(0, STATE.honor - 10);
        STATE.abandonedChildrenCount = (STATE.abandonedChildrenCount || 0) + 1;
        child.role = "Abandonado"; child.abandoned = true;
        this.addLog(`🚪 RODA DOS EXPOSTOS: Você negou a paternidade e entregou a criança aos cuidados de um mosteiro (-10 Honra).`, "bad");
      } else {
        STATE.honor = Math.max(0, STATE.honor - 3);
        child.legitimacy = "bastardo_reconhecido"; child.isBastard = true;
        this.addLog(`⚜️ BASTARDO RECONHECIDO: ${chosenFirst} foi acolhido como bastardo de sangue da Casa ${STATE.surname} (-3 Honra).`, "normal");
      }
    }

    const partnerDesc = (partnerName === "um romance furtivo") ? (STATE.sex === "F" ? "de uma paixão furtiva" : "com sua amante secreta") : `com ${partnerName}`;
    child.memory = child.isBastard ? `Fruto ${partnerDesc}, registrado sob o sobrenome ${child.surname}.` : `Nascido do leito legítimo com ${partnerName}, batizado na Casa ${child.surname} no ano ${STATE.year}.`;

    if (!child.abandoned) {
      STATE.npcs.push(child);
      this.syncFamilyNobleTitles();
    }

    const bdrop = document.getElementById("child-name-backdrop");
    if (bdrop) bdrop.classList.remove("active");
    SoundFX.play(STATE.socialClass === "nobre" ? "cathedral_bells" : "bells");
    if (window.UI && window.UI.triggerStageFX) window.UI.triggerStageFX("👶");
    const heirBadge = child.nobleTitle ? ` como **${child.nobleTitle}**` : "";
    const birthActor = STATE.sex === "F" ? "você deu à luz" : (partnerName === "um romance furtivo" ? "sua amante deu à luz" : `${partnerName} deu à luz`);

    if (!child.abandoned) {
      this.addLog(`👶 NASCIMENTO: Após os rigores da gestação, ${birthActor} um(a) ${child.sex === "M" ? "menino" : "menina"} saudável! Recebeu o nome de **${child.name}**${heirBadge}.`, "epoch");
    }

    if (Array.isArray(STATE.pendingBirthQueue) && STATE.pendingBirthQueue.length > 0) {
      STATE.pendingChild = STATE.pendingBirthQueue.shift();
      this.ensureLegitimacyUI();
      UI.openChildNameModal();
    } else {
      STATE.pendingChild = null;
      Storage.saveToSlot(CONFIG.activeSlot);
      UI.renderAll();
    }
  }
});
