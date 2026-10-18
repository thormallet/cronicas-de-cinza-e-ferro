/* ============================================================================
   [ENGINE · EVENTOS NARRATIVOS] — sorteio e resolução dos eventos anuais
   ============================================================================ */
Object.assign(Engine, {
  qteTimeoutId: null,

  cancelQTETimer() {
    if (this.qteTimeoutId) {
      clearTimeout(this.qteTimeoutId);
      this.qteTimeoutId = null;
    }
  },

  resolveQTETimeout() {
    this.cancelQTETimer();
    SoundFX.play("fail");
    STATE.honor = Utils.clamp(STATE.honor - 6, 0, 100);
    STATE.reputation = Utils.clamp(STATE.reputation - 1, -10, 10);
    const dmg = STATE.age < 12 ? 6 : 18;
    STATE.hp = Math.max(1, STATE.hp - dmg);
    this.addLog(`⚡ [Reação Lenta] Você hesitou diante do perigo iminente! O pânico paralisou seus reflexos (-6 Honra, -1 Reputação, -${dmg} Saúde).`, "bad");
    UI.notify("⚡ Tempo Esgotado!", "A hesitação custou caro: você foi atingido e perdeu Honra e Reputação!", "fail");
    STATE.activeEvent = null;
    Storage.saveToSlot(CONFIG.activeSlot);
    UI.renderAll();
  },

  triggerYearlyEvent() {
    const phase = this.getPhase();
    const activeJobId = STATE.guildTraining ? STATE.guildTraining.jobId : STATE.job;

    if (activeJobId && activeJobId !== "crianca" && STATE.age >= 15 && Math.random() < 0.18) {
      this.startSpecialJobTrial();
      return;
    }

    if (activeJobId && activeJobId !== "crianca" && Math.random() < 0.35) {
      const jobPool = DATA.events.filter(ev => ev.jobReq === activeJobId && !STATE.usedEvents.includes(ev.id));
      if (jobPool.length > 0) {
        const chosenJobEv = Utils.pick(jobPool);
        STATE.usedEvents.push(chosenJobEv.id);
        STATE.activeEvent = chosenJobEv;
        UI.renderEventModal();
        return;
      }
    }

    const curCity = this.getCityObj ? this.getCityObj(STATE.currentCityId, STATE.kingdom) : { tier: "capital" };
    const matchesLocality = (ev) => {
      const kOk = !ev.kingdoms || ev.kingdoms.includes(STATE.kingdom);
      const tiers = Array.isArray(ev.cityTiers) ? ev.cityTiers : (ev.cityTier ? [ev.cityTier] : null);
      const tOk = !tiers || tiers.includes(curCity.tier);
      return kOk && tOk;
    };

    let pool = DATA.events.filter(ev => {
      if (ev.jobReq && ev.jobReq !== activeJobId) return false;
      const phaseOk = ev.phase.includes(phase);
      const classOk = ev.classes.includes("any") || ev.classes.includes(STATE.socialClass);
      const notUsed = !STATE.usedEvents.includes(ev.id);
      return phaseOk && classOk && matchesLocality(ev) && notUsed;
    });

    if (pool.length === 0) {
      STATE.usedEvents = [];
      pool = DATA.events.filter(ev =>
        (!ev.jobReq || ev.jobReq === activeJobId) &&
        ev.phase.includes(phase) &&
        (ev.classes.includes("any") || ev.classes.includes(STATE.socialClass)) &&
        matchesLocality(ev)
      );
    }

    const regionalPool = pool.filter(ev => ev.scope === "exclusivo" || ev.scope === "compartilhado");
    const chosen = (regionalPool.length > 0 && Math.random() < 0.45) ? Utils.pick(regionalPool) : Utils.pick(pool);
    if (!chosen) return;

    STATE.usedEvents.push(chosen.id);
    STATE.activeEvent = chosen;
    UI.renderEventModal();
  },

  generateInheritedAppearance(partner = null, childSex = null, childId = null) {
    const sex = childSex || (Math.random() < 0.5 ? "M" : "F");
    if (typeof inheritChildAppearance === "function") {
      return inheritChildAppearance(STATE, partner || STATE, sex, childId || ("npc_" + Math.random().toString(36).slice(2, 8)));
    }
    return null;
  },

  resolveEventChoice(choiceIdx) {
    this.cancelQTETimer();
    if (UI.cancelQTETimer) UI.cancelQTETimer();
    const ev = STATE.activeEvent;
    if (!ev) return;
    const ch = ev.choices[choiceIdx];
    const check = this.rollCheck(ch.attr, ch.diff);
    const outcome = check.success ? ch.ok : ch.fail;

    SoundFX.play(check.success ? "success" : "fail");
    const msg = this.formatText(outcome.msg);
    const cleanTitle = this.formatText(ev.title);
    this.addLog(`${cleanTitle} — ${msg}`, check.success ? "good" : "bad");

    if (outcome.gold) STATE.gold = Math.max(0, STATE.gold + outcome.gold);
    if (outcome.hp) {
      let hpDelta = outcome.hp;
      if (STATE.age < 12 && hpDelta < 0) hpDelta = Math.max(-4, Math.ceil(hpDelta * 0.4));
      STATE.hp = Utils.clamp(STATE.hp + hpDelta, 0, STATE.maxHp);
    }
    if (outcome.rep) STATE.reputation = Utils.clamp(STATE.reputation + outcome.rep, -10, 10);
    if (outcome.honor) STATE.honor = Utils.clamp(STATE.honor + outcome.honor, 0, 100);
    if (outcome.attr) {
      const [aKey, aDelta] = outcome.attr;
      STATE.attrs[aKey] = Utils.clamp((STATE.attrs[aKey] || 0) + aDelta, 0, 100);
      STATE.maxHp = Math.max(10, this.getEffectiveAttr("saude"));
    }
    if (outcome.attr2) {
      const [aKey2, aDelta2] = outcome.attr2;
      STATE.attrs[aKey2] = Utils.clamp((STATE.attrs[aKey2] || 0) + aDelta2, 0, 100);
      STATE.maxHp = Math.max(10, this.getEffectiveAttr("saude"));
    }
    if (outcome.perf && this.hasActiveOccupation()) {
      STATE.jobPerformance = Utils.clamp((STATE.jobPerformance || 50) + outcome.perf, 0, 100);
    }
    if (outcome.flag && !STATE.flags.includes(outcome.flag)) {
      STATE.flags.push(outcome.flag);
    }
    if (outcome.addChild) {
      const childSex = Math.random() < 0.5 ? "M" : "F";
      const child = Utils.genNPC("Filho", 0, childSex, STATE.surname, STATE.socialClass);
      child.legitimacy = "bastardo_reconhecido";
      child.isBastard = true;
      child.appearance = this.generateInheritedAppearance(null, childSex, child.id) || child.appearance;
      const namePools = Utils.getCulturalNamePools(STATE.kingdom);
      const otherSurname = Utils.pick(namePools.surnames);
      STATE.pendingChild = {
        child,
        partnerName: "um romance furtivo",
        fatherSurname: STATE.sex === "M" ? STATE.surname : otherSurname,
        motherSurname: STATE.sex === "F" ? STATE.surname : otherSurname,
        isBastard: true,
        legitimacy: "bastardo_reconhecido",
        appearance: child.appearance
      };
      if (this.ensureLegitimacyUI) this.ensureLegitimacyUI();
      UI.openChildNameModal();
    }
    if (outcome.boostHeirs) {
      STATE.npcs.filter(n => n.role === "Filho" && n.alive).forEach(c => {
        c.attrs.intelecto = Math.min(100, c.attrs.intelecto + 8);
        c.attrs.carisma = Math.min(100, c.attrs.carisma + 8);
      });
    }

    STATE.activeEvent = null;
    if (STATE.hp <= 0) {
      if (STATE.age < 12) {
        STATE.hp = 10;
        this.addLog("Apesar da gravidade, sua família cuidou de você dia e noite até salvar sua vida.", "good");
      } else {
        this.die("Sucumbiu aos ferimentos e provações de um evento fatídico.");
        return;
      }
    }
    Storage.saveToSlot(CONFIG.activeSlot);
    UI.renderAll();
  }
});
