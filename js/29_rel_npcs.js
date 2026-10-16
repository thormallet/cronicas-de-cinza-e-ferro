/* ============================================================================
   [RELAÇÕES · NPCS] — causa de morte, colegas, corte e atualização anual dos NPCs
   ============================================================================ */
Object.assign(Engine, {
  getNpcDeathCause(npc) {
    const childCauses = [
      "vitimado por uma febre escarlate repentina nas noites frias de inverno",
      "após definhar por uma tosse convulsiva que os emplastros não puderam curar",
      "levado por um surto de disenteria aguda que varreu a comarca"
    ];
    const adultCauses = [
      "acometido por uma pneumonia fulminante após viajar sob tempestade",
      "vítima de uma infecção sanguínea causada por uma ferida mal cicatrizada",
      "derrubado por uma febre terçã implacável que resistiu às sangrias do físico",
      "em decorrência de uma queda grave de cavalo na estrada pedregosa",
      "após beber água contaminada durante o estio escaldante"
    ];
    const rivalCauses = [
      "encontrado sem vida num beco escuro com a bolsa cortada e um punhal cravado nas costas",
      "abatido numa rixa sangrenta de taverna após insultar mercenários",
      "fulminado por um mal súbito suspeito logo após um banquete político"
    ];
    const oldCauses = [
      "entregando serenamente a alma enquanto dormia, vencido pelo peso dos muitos invernos",
      "após o coração cansado falhar junto à lareira numa noite de geada",
      "debilitado pela gota e pela fraqueza natural da idade avançada"
    ];
    if (npc.age <= 12) return Utils.pick(childCauses);
    if (npc.role === "Rival" && Math.random() < 0.5) return Utils.pick(rivalCauses);
    if (npc.age >= 58) return Utils.pick(oldCauses);
    return Utils.pick(adultCauses);
  },

  ensureColleagues(forceNew = false) {
    if (!STATE || !this.hasActiveOccupation()) return;
    const isGuild = !!STATE.guildTraining;
    const occLabel = isGuild ? STATE.guildTraining.guildName : this.getJob().name;
    const currentColleagues = STATE.npcs.filter(n => n.role === "Colega de Ofício" && n.alive);

    if (forceNew) {
      currentColleagues.forEach((c, idx) => {
        if (isGuild) {
          c.jobTitle = idx === 0 ? `Mestre Instrutor (${occLabel})` : `Aprendiz (${occLabel})`;
        } else {
          const ranks = this.getJob().ranks || [occLabel];
          const rTitle = ranks[Math.min(idx, ranks.length - 1)];
          c.jobTitle = `${rTitle} (${occLabel})`;
        }
      });
    }

    while (STATE.npcs.filter(n => n.role === "Colega de Ofício" && n.alive).length < 3) {
      const count = STATE.npcs.filter(n => n.role === "Colega de Ofício" && n.alive).length;
      let colTitle = occLabel;
      let colAge = Utils.rand(16, 48);
      if (isGuild) {
        if (count === 0) {
          colTitle = `Mestre da Guilda (${occLabel})`;
          colAge = Utils.rand(38, 62);
        } else {
          colTitle = `Aprendiz de Guilda (${occLabel})`;
          colAge = Utils.rand(14, 24);
        }
      } else {
        const ranks = this.getJob().ranks || [occLabel];
        const rTitle = ranks[Math.min(count, ranks.length - 1)];
        colTitle = `${rTitle} (${occLabel})`;
      }
      const col = Utils.genNPC("Colega de Ofício", colAge, null, null, STATE.socialClass, colTitle);
      STATE.npcs.push(col);
    }
  },

  ensureCourtMembers() {
    if (!STATE || !STATE.nobleTitleLevel || STATE.nobleTitleLevel < 1) return;
    const pools = this.getRoyalCourtPools ? this.getRoyalCourtPools(STATE.kingdom) : null;
    const rulerM = pools ? pools.rulerM : "Rei Soberano";
    const rulerF = pools ? pools.rulerF : "Rainha Soberana";
    const courtLiving = STATE.npcs.filter(n => n.role === "Corte" && n.alive);
    const hasSovereign = courtLiving.some(n => n.isSovereign || n.nobleTitle === rulerM || n.nobleTitle === rulerF);

    if (!hasSovereign) {
      const sovSex = Math.random() < 0.7 ? "M" : "F";
      const sovTitle = sovSex === "F" ? rulerF : rulerM;
      const sovNpc = Utils.genNPC("Corte", Utils.rand(28, 58), sovSex, null, "nobre", `Soberano(a) de ${this.getKingdom().name}`, sovTitle, STATE.kingdom);
      sovNpc.isSovereign = true;
      const capCity = this.getCapitalCity ? this.getCapitalCity(STATE.kingdom) : null;
      if (capCity) sovNpc.cityId = capCity.id;
      STATE.npcs.push(sovNpc);
    }
    if (STATE.npcs.filter(n => n.role === "Corte" && n.alive).length >= 5) return;

    const t5M = pools ? pools.poolM[1] : "Duque de Sangue Real";
    const t4F = pools ? pools.poolF[2] : "Condessa Palatina";
    const t3M = pools ? pools.poolM[3] : "Visconde da Comarca";
    const t2F = pools ? pools.poolF[4] : "Baronesa Feudal";
    const presets = [
      { sex: Math.random() < 0.5 ? "M" : "F", minAge: 17, maxAge: 28, nTitle: "PRINCE_SLOT", jTitle: "Herdeiro(a) do Trono" },
      { sex: "M", minAge: 28, maxAge: 60, nTitle: t5M, jTitle: "Alto Par do Reino" },
      { sex: "F", minAge: 22, maxAge: 52, nTitle: t4F, jTitle: "Senhora de Domínio" },
      { sex: "M", minAge: 24, maxAge: 55, nTitle: t3M, jTitle: "Par da Corte" },
      { sex: "F", minAge: 19, maxAge: 45, nTitle: t2F, jTitle: "Dama da Corte" }
    ];

    presets.forEach(p => {
      if (STATE.npcs.filter(n => n.role === "Corte" && n.alive).length < 6) {
        const finalTitle = p.nTitle === "PRINCE_SLOT"
          ? (p.sex === "F" ? (pools ? pools.princeF : "Princesa Real") : (pools ? pools.princeM : "Príncipe Real"))
          : p.nTitle;
        const cNpc = Utils.genNPC("Corte", Utils.rand(p.minAge, p.maxAge), p.sex, null, "nobre", p.jTitle, finalTitle, STATE.kingdom);
        const capCity = this.getCapitalCity ? this.getCapitalCity(STATE.kingdom) : null;
        if (capCity) cNpc.cityId = capCity.id;
        STATE.npcs.push(cNpc);
      }
    });
  },

  updateNPCs() {
    STATE.npcs.forEach(npc => {
      if (!npc.alive) return;
      npc.age++;
      if (npc.age === 14 && (!npc.jobTitle || npc.jobTitle.includes("Criança") || npc.jobTitle === "Sem Ofício")) {
        const cJobs = DATA.jobs.filter(j =>
          j.id !== "crianca" &&
          !j.titular &&
          (j.tiers || []).includes(npc.socialClass || STATE.socialClass) &&
          (!j.gender || j.gender === "any" || j.gender === npc.sex)
        );
        const pj = cJobs.length ? Utils.pick(cJobs) : DATA.jobs[1];
        npc.jobTitle = `${(pj.ranks || [pj.name])[0]} (${pj.name})`;
      }
      const deathChance = npc.age > 60 ? 0.14 : (npc.age <= 12 ? 0.003 : 0.014);
      if (Math.random() < deathChance) {
        npc.alive = false;
        const detailedCause = this.getNpcDeathCause(npc);
        this.addLog(`🕯️ Luto nos Anais: **${npc.name}** (${npc.role}, Casa ${npc.surname}) faleceu aos ${npc.age} anos, ${detailedCause}.`, "bad");
        if (npc.isSovereign && STATE.nobleTitleLevel >= 1) {
          this.ensureCourtMembers();
        }
      } else if (npc.role === "Rival" && npc.affinity <= -65 && (!npc.kingdom || npc.kingdom === STATE.kingdom) && (!npc.cityId || npc.cityId === STATE.currentCityId) && Math.random() < 0.22) {
        if (Math.random() < 0.5) {
          const loss = Math.min(STATE.gold, Utils.rand(8, 22));
          STATE.gold -= loss;
          this.addLog(`🐍 Sabotagem de Inimigo: Capangas a mando do seu rival **${npc.name}** sabotaram seus negócios e furtaram ${loss} Ouro!`, "bad");
        } else {
          STATE.reputation = Utils.clamp(STATE.reputation - 1, -10, 10);
          this.addLog(`🐍 Intriga de Inimigo: **${npc.name}** espalhou calúnias venenosas contra sua honra na comarca (-1 Reputação).`, "bad");
        }
      }
    });

    if (STATE.npcs.filter(n => n.alive).length < 13 && Math.random() < 0.30) {
      const roles = STATE.age >= 16 ? ["Amigo", "Rival", "Mentor", "Pretendente"] : ["Amigo", "Mentor"];
      const r = Utils.pick(roles);
      const oppSex = STATE.sex === "M" ? "F" : "M";
      const novo = Utils.genNPC(r, Utils.rand(Math.max(14, STATE.age - 4), STATE.age + 8), r === "Pretendente" ? oppSex : null);
      STATE.npcs.push(novo);
      this.addLog(`Nos caminhos de ${this.getKingdom().name}, você travou conhecimento com **${novo.name}** (Casa ${novo.surname}), que passou a fazer parte do seu círculo como ${r}.`);
    }
  }
});
