/* ============================================================================
   [EVENTOS · MONTAGEM] — junta o catálogo manual aos eventos gerados e publica em DATA.events
   ============================================================================ */
function buildEventsCatalog() {
  const catalog = [...buildEventsBaseA(), ...buildEventsBaseB(), ...buildEventsBaseC()];

  /* GERADOR DE EVENTOS ESPECÍFICOS PARA CADA OFÍCIO */
  const jobEventThemes = buildJobEventThemes();

  Object.entries(jobEventThemes).forEach(([jobId, data]) => {
    const [title, desc, a1, a2, a3] = data;
    catalog.push({
      id: `ev_job_${jobId}`,
      phase: ["Juventude", "Adulto", "Velhice"],
      classes: ["any"],
      jobReq: jobId,
      title: `[Ofício] ${title}`,
      desc: desc,
      choices: [
        {
          label: "Agir com maestria técnica e determinação exemplar para elevar seu renome no ofício",
          attr: a1, diff: 54,
          ok: { gold: 24, rep: 1, perf: 12, attr: [a1, 4], msg: `Sua atuação magistral em "${title}" elevou seu desempenho (+12 Desempenho) e rendeu +24 Ouro!` },
          fail: { hp: -8, perf: -8, msg: `O contratempo no ofício prejudicou sua reputação profissional (-8 Desempenho).` }
        },
        {
          label: "Conduzir a situação com astúcia e cautela para proteger sua posição hierárquica",
          attr: a2, diff: 52,
          ok: { honor: 6, gold: 16, perf: 8, msg: `Você contornou o desafio com sabedoria (+8 Desempenho, +16 Ouro, +6 Honra).` },
          fail: { honor: -4, perf: -5, msg: `Sua hesitação custou prestígio diante dos pares (-5 Desempenho).` }
        },
        {
          label: "Arriscar uma manobra ousada para extrair o máximo proveito pessoal do episódio",
          attr: a3, diff: 58,
          ok: { gold: 38, perf: 6, msg: `A ousadia compensou! Você embolsou +38 Moedas de Ouro e fortaleceu sua posição.` },
          fail: { gold: -15, hp: -6, perf: -6, msg: `A manobra falhou e trouxe prejuízo ao seu bolso e ofício.` }
        }
      ]
    });
  });

  const contexts = buildEventContexts();
  const narrativeStyle = buildEventNarrativeStyle();

  contexts.forEach(group => {
    const isInf = group.prefix === "inf";
    group.themes.forEach((t, idx) => {
      const [title, desc, a1, a2, a3] = t;
      const p1 = narrativeStyle[a1][idx % 3];
      const p2 = narrativeStyle[a2][(idx + 1) % 3];
      const p3 = narrativeStyle[a3][(idx + 2) % 3];
      catalog.push({
        id: `ev_${group.prefix}_${idx}`,
        phase: group.phases,
        classes: group.classes,
        title: title,
        desc: desc,
        choices: [
          {
            label: p1,
            attr: a1, diff: isInf ? 42 : 55,
            ok: { gold: isInf ? 2 : 16, rep: 1, attr: [a1, 5], msg: `Sua decisão firme em "${title}" coroou-se de êxito e trouxe respeito ao seu nome.` },
            fail: { hp: isInf ? -3 : -10, gold: isInf ? 0 : -8, msg: `O desfecho foi adverso e cobrou um preço amargo do seu corpo e bolsa.` }
          },
          {
            label: p2,
            attr: a2, diff: isInf ? 40 : 55,
            ok: { honor: 5, gold: isInf ? 0 : 12, attr: [a2, 4], msg: `Sua conduta diante do imprevisto provou-se acertada e elevou sua honra.` },
            fail: { honor: -3, hp: isInf ? -2 : -6, msg: `Sua manobra malogrou diante das testemunhas e deixou sequelas.` }
          },
          {
            label: p3,
            attr: a3, diff: isInf ? 38 : 50,
            ok: { hp: 6, gold: isInf ? 0 : 10, msg: `Os ventos sopraram a seu favor e você superou o contratempo ileso.` },
            fail: { hp: isInf ? -2 : -6, rep: -1, msg: `As circunstâncias conspiraram contra sua escolha neste episódio.` }
          }
        ]
      });
    });
  });

  if (typeof buildExplorerExclusiveEvents === "function") {
    catalog.push(...buildExplorerExclusiveEvents(), ...buildExplorerSharedEvents());
  }
  if (typeof buildEventsExpansao35 === "function") {
    catalog.push(...buildEventsExpansao35());
  }
  return (typeof adaptCatalogForExplorer === "function") ? adaptCatalogForExplorer(catalog) : catalog;
}

DATA.events = buildEventsCatalog();

DATA.events.push(
  {
    id: "guerra_continental_incursao",
    title: "⚔️ O Estandarte da Guerra Continental",
    text: "Trombetas ecoam nas colinas! O Soberano declarou guerra contra o reino vizinho. Os preços de mantimentos e ferro dispararam, e mensageiros reais requisitam homens e cavalos para a campanha.",
    tags: ["guerra", "militar"],
    minAge: 16,
    choices: [
      { text: "Alistar-se como Soldado de Vanguarda", effect: (s) => { s.honor = Math.min(100, s.honor + 15); s.reputation = Math.min(10, s.reputation + 2); s.vigor = Math.max(0, s.vigor - 20); return "Você marchou com a vanguarda e conquistou renome (+15 Honra, +2 Reputação)!"; } },
      { text: "Fornecer Provisões e Armas (Lucro de Guerra)", effect: (s) => { s.gold += 80; s.honor = Math.max(0, s.honor - 5); return "Você lucrou abastecendo as tropas da Coroa (+80 Ouro, -5 Honra)."; } },
      { text: "Buscar Abrigo nos Muros Fortificados", effect: (s) => { s.gold = Math.max(0, s.gold - 25); return "Você pagou tributo de proteção para manter sua família a salvo nos burgos (-25 Ouro)."; } }
    ]
  },
  {
    id: "easteregg_lamina_pedra",
    title: "✨ A Lâmina das Cinzas na Floresta Antiga",
    text: "Durante uma patrulha nas florestas esquecidas, você encontra um altar de pedra cinzenta cravado com uma lâmina envolta em runas douradas. Diz a lenda que apenas um guerreiro de honra inabalável pode desembainhá-la.",
    tags: ["easteregg", "reliquia"],
    minAge: 18,
    cond: (s) => s.honor >= 65 && s.attrs && s.attrs.forca >= 60,
    choices: [
      {
        text: "Empunhar o Punho e Erguer a Lâmina Ancestral",
        effect: (s) => {
          if (!s.itemInstances) s.itemInstances = [];
          s.itemInstances.push({ id: "lamina_ancestral_valenca", uid: "item_" + Date.now(), state: "novo" });
          s.flags = s.flags || [];
          s.flags.push("Portador da Lâmina Ancestral");
          s.honor = Math.min(100, s.honor + 25);
          s.reputation = 10;
          return "O metal ressoa como um sino divino! Você empunha a Lâmina Ancestral de Valença! Sua Casa é abençoada para sempre (+25 Honra, Reputação Máxima)!";
        }
      },
      { text: "Ajoelhar e Rezar diante do Santuário", effect: (s) => { s.attrs.fe = Math.min(100, (s.attrs.fe || 50) + 15); return "Você prestou reverência às lendas antigas (+15 Fé)."; } }
    ]
  }
);
