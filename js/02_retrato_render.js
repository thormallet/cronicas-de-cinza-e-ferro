/* ============================================================================
   [RETRATOS · RENDER] — motor SVG de retratos procedurais (renderRetrato)
   ============================================================================ */
function renderRetrato(person, sizeClass = "") {
  if (!person) return "";
  const dna = getOrCreateAppearanceDNA(person);
  const surname = person.surname || (window.Utils ? window.Utils.extractSurname(person.name) : "de Valença");
  const crest = (window.Utils && window.Utils.getCrestData) ? window.Utils.getCrestData(surname) : { symbol: "⚜️", bg: "#5a1818", fg: "#f4d068", motto: "" };

  const isFemale = person.sex === "F";
  const age = person.age !== undefined ? person.age : 20;
  const isDead = person.alive === false;
  const isBaby = age <= 3;
  const isChild = age > 3 && age <= 11;
  const isYouth = age > 11 && age <= 18;
  const isOld = age >= 55;

  const hpRatio = (person.hp !== undefined && person.maxHp) ? (person.hp / person.maxHp) : 1;
  const isSick = !isDead && (hpRatio < 0.42 || (person.traits && person.traits.includes("doentio")));

  // Determinação de Humor / Expressão
  let mood = "neutral";
  if (isDead) mood = "dead";
  else if (isSick) mood = "sick";
  else if (person.role === "Cônjuge" || person.role === "Amor" || (person.role === "Pretendente" && (person.affinity || 0) >= 60)) mood = "love";
  else if (person.role === "Rival" || (person.affinity !== undefined && person.affinity <= -30)) mood = "angry";
  else if ((person.affinity !== undefined && person.affinity < 0) || (person.honor !== undefined && person.honor < 30)) mood = "sad";
  else if ((person.affinity !== undefined && person.affinity >= 55) || (person.gold !== undefined && person.gold >= 150)) mood = "happy";

  // Moldura conforme Estamento / Riqueza / Título
  const sClass = person.socialClass || "plebeu";
  const jobCode = person.job || (person.jobTitle ? person.jobTitle.toLowerCase() : "crianca");
  const isNoble = sClass === "nobre" || !!person.nobleTitle;
  let frameClass = "frame-wood";
  if (isNoble || (person.gold && person.gold >= 500)) frameClass = "frame-gold";
  else if (sClass === "media" && ((person.gold && person.gold >= 140) || (person.jobRank && person.jobRank >= 1))) frameClass = "frame-silver";
  else if (sClass === "media") frameClass = "frame-bronze";

  // Paleta de Pele e Cabelo com envelhecimento e estado
  let skinColor = PORTRAIT_DATA.skins[dna.skinIdx % PORTRAIT_DATA.skins.length];
  if (isSick) skinColor = PORTRAIT_DATA.SickSkins[dna.skinIdx % PORTRAIT_DATA.SickSkins.length];
  if (isDead) skinColor = PORTRAIT_DATA.DeadSkins[dna.skinIdx % PORTRAIT_DATA.DeadSkins.length];

  let hairColor = PORTRAIT_DATA.hairs[dna.hairColorIdx % PORTRAIT_DATA.hairs.length];
  if (isOld) hairColor = (dna.seed % 2 === 0) ? "#d8dad9" : "#9ea3a8";
  else if (age >= 44) hairColor = "#7c7872";

  const eyeColor = PORTRAIT_DATA.eyes[dna.eyeColorIdx % PORTRAIT_DATA.eyes.length];

  // Escala e Postura por Idade
  const scaleTransform = isBaby
    ? "translate(0, 8) scale(0.78)"
    : (isChild ? "translate(0, 5) scale(0.86)" : (isYouth ? "translate(0, 2) scale(0.94)" : (isOld ? "translate(0, 2.5) scale(0.97)" : "")));

  // Camada de Roupa & Acessórios por Ofício/Classe (>= 25 variações)
  const wealthRich = isNoble || (person.gold && person.gold >= 180) || (person.jobRank && person.jobRank >= 2);
  const trimColor = wealthRich ? "#f5c842" : (sClass === "media" ? "#d4a359" : "#785a3c");
  let primaryGarb = crest.bg;
  let secondaryGarb = "#2b1d12";
  let accessorySVG = "";
  let headgearUse = "";

  const matchJob = (str) => String(jobCode).includes(str) || String(person.jobTitle || "").toLowerCase().includes(str);
  const royalKeywords = ["Rei", "Rainha", "Imperador", "Imperatriz", "Xogum", "Marajá", "Maharani", "Xá", "Califa", "Sultana", "Kaiser", "Knyaz", "Doge"];
  const isRoyal = royalKeywords.some(k => String(person.nobleTitle || "").includes(k));

  if (isRoyal) {
    primaryGarb = "#5e0e18"; secondaryGarb = "#3b1131";
    headgearUse = `<use href="#pt-crown-king"/>`;
    accessorySVG = `<path d="M12,78 C15,54 27,52 30,78 Z M68,78 C65,54 53,52 50,78 Z" fill="#f7f4ed"/><circle cx="22" cy="66" r="1.3" fill="#111"/><circle cx="25" cy="72" r="1.3" fill="#111"/><circle cx="58" cy="66" r="1.3" fill="#111"/><circle cx="55" cy="72" r="1.3" fill="#111"/><circle cx="40" cy="61" r="3.5" fill="#ffd24c" stroke="#7d1515" stroke-width="1.2"/>`;
  } else if (matchJob("bispo") || matchJob("abadessa")) {
    primaryGarb = "#691422"; secondaryGarb = "#f5efe2";
    headgearUse = matchJob("bispo") ? `<use href="#pt-mitre-bishop"/>` : `<use href="#pt-veil-nun"/>`;
    accessorySVG = `<path d="M36,53 L40,76 L44,53 Z" fill="#f5c842"/><path d="M40,59 L40,69 M36,63 L44,63" stroke="#7d1515" stroke-width="1.8"/>`;
  } else if (matchJob("inquisidor") || matchJob("clerigo")) {
    primaryGarb = "#1d1a22"; secondaryGarb = "#3b1418";
    accessorySVG = `<path d="M32,54 L40,66 L48,54" fill="none" stroke="#e8e2d5" stroke-width="2.5"/><path d="M40,58 L40,69 M36,62 L44,62" stroke="#d4af37" stroke-width="1.8"/>`;
  } else if (matchJob("monge")) {
    primaryGarb = "#4a3321"; secondaryGarb = "#2e1e12";
    headgearUse = `<use href="#pt-hood-monk"/>`;
  } else if (matchJob("freira")) {
    primaryGarb = "#222228"; secondaryGarb = "#f0ede6";
    headgearUse = `<use href="#pt-veil-nun"/>`;
  } else if (matchJob("cavaleiro") || matchJob("soldado") || matchJob("mercenario") || matchJob("escudeiro")) {
    primaryGarb = "#6e7780"; secondaryGarb = crest.bg;
    if (matchJob("cavaleiro")) headgearUse = `<use href="#pt-helm-knight"/>`;
    accessorySVG = `<path d="M15,78 C17,56 63,56 65,78 Z" fill="#858e96" stroke="#2c3236" stroke-width="1.6"/><ellipse cx="20" cy="61" rx="7.5" ry="4.5" fill="#9ea7b0" stroke="#2c3236" stroke-width="1.3"/><ellipse cx="60" cy="61" rx="7.5" ry="4.5" fill="#9ea7b0" stroke="#2c3236" stroke-width="1.3"/><path d="M33,56 L40,75 L47,56 Z" fill="${crest.bg}" stroke="${trimColor}" stroke-width="1"/>`;
  } else if (matchJob("ferreiro") || matchJob("mineiro") || matchJob("pedreiro")) {
    primaryGarb = "#4a382b"; secondaryGarb = "#261c15";
    accessorySVG = `<path d="M24,56 L56,56 L59,78 L21,78 Z" fill="#2e1d12" stroke="#140c07" stroke-width="1.3"/>`;
  } else if (matchJob("mercador") || matchJob("ourives") || matchJob("chanceler") || matchJob("juiz") || matchJob("diplomata")) {
    primaryGarb = "#4a192c"; secondaryGarb = "#1e324a";
    if (!isFemale) headgearUse = `<use href="#pt-hat-merchant"/>`;
    accessorySVG = `<path d="M23,54 Q40,68 57,54" fill="none" stroke="#f5c842" stroke-width="2.6" stroke-dasharray="3,2"/><circle cx="40" cy="62" r="3" fill="#216869" stroke="#f5c842" stroke-width="1.2"/>`;
  } else if (matchJob("bardo") || matchJob("dancarina")) {
    primaryGarb = "#1e4d38"; secondaryGarb = "#7a1c38";
    headgearUse = !isFemale ? `<use href="#pt-hat-bard"/>` : `<use href="#pt-coronet-noble"/>`;
    accessorySVG = `<path d="M24,54 L32,63 L40,55 L48,63 L56,54" fill="none" stroke="#f5c842" stroke-width="1.8"/>`;
  } else if (matchJob("pirata") || matchJob("ladrao") || matchJob("bandido") || matchJob("espiao")) {
    primaryGarb = "#232026"; secondaryGarb = "#521419";
    headgearUse = matchJob("pirata") ? `<use href="#pt-bandana-pirate"/>` : `<use href="#pt-hood-monk"/>`;
  } else if (matchJob("medico") || matchJob("alquimista") || matchJob("erudito") || matchJob("curandeiro") || matchJob("parteira")) {
    primaryGarb = "#203a43"; secondaryGarb = "#3d291a";
    accessorySVG = `<path d="M28,53 L40,72 L52,53" fill="none" stroke="#d4af37" stroke-width="1.8"/>`;
  } else if (isNoble) {
    headgearUse = `<use href="#pt-coronet-noble"/>`;
    accessorySVG = `<path d="M25,54 Q40,63 55,54" fill="none" stroke="#f5c842" stroke-width="2.5" stroke-dasharray="3,2"/><circle cx="40" cy="60" r="2.8" fill="#b81d2a" stroke="#f5c842" stroke-width="1"/>`;
  }

  // Cabelos (12 estilos) e Calvície para idosos
  const hStyle = dna.hairStyle % 12;
  let hairBackSVG = "";
  let hairFrontSVG = "";
  if (!isBaby) {
    if (isFemale) {
      hairBackSVG = `<path d="M20,30 C16,13 64,13 60,30 L64,58 C55,61 50,55 51,42 L29,42 C30,55 25,61 16,58 Z" fill="${hairColor}"/>`;
      if (hStyle % 4 === 0) {
        hairFrontSVG = `<path d="M23,28 Q40,14 57,28 Q48,20 40,22 Q32,20 23,28 Z" fill="${hairColor}"/>`;
      } else if (hStyle % 4 === 1) {
        hairFrontSVG = `<path d="M22,29 C25,13 55,13 58,29 Q40,19 22,29 Z" fill="${hairColor}"/><circle cx="40" cy="14" r="5.5" fill="${hairColor}"/>`;
      } else if (hStyle % 4 === 2) {
        hairFrontSVG = `<path d="M23,27 Q40,15 57,27 L55,21 Q40,17 25,21 Z" fill="${hairColor}"/><path d="M21,36 L20,56 M59,36 L60,56" stroke="${hairColor}" stroke-width="4" stroke-linecap="round"/>`;
      } else {
        hairFrontSVG = `<path d="M23,29 C23,14 57,14 57,29 C50,21 30,21 23,29 Z" fill="${hairColor}"/>`;
      }
    } else {
      if (isOld && hStyle % 3 === 0) {
        hairFrontSVG = `<path d="M21,31 C20,24 25,21 27,27 Z M59,31 C60,24 55,21 53,27 Z" fill="${hairColor}"/>`;
      } else if (hStyle % 6 === 0) {
        hairFrontSVG = `<path d="M23,29 C22,13 58,13 57,29 Q48,19 40,20 Q32,19 23,29 Z" fill="${hairColor}"/>`;
      } else if (hStyle % 6 === 1) {
        hairBackSVG = `<path d="M20,30 C19,14 61,14 60,30 L62,50 L18,50 Z" fill="${hairColor}"/>`;
        hairFrontSVG = `<path d="M22,27 Q40,13 58,27 Q40,20 22,27 Z" fill="${hairColor}"/>`;
      } else if (hStyle % 6 === 2) {
        hairFrontSVG = `<path d="M24,26 C26,14 54,14 56,26 L55,29 Q40,22 25,29 Z" fill="${hairColor}"/>`;
      } else if (hStyle % 6 === 3) {
        hairFrontSVG = `<path d="M23,27 C25,18 55,18 57,27 L56,24 C50,20 30,20 24,24 Z" fill="${hairColor}"/>`;
      } else if (hStyle % 6 === 4) {
        hairBackSVG = `<path d="M19,32 L17,52 L63,52 L61,32 Z" fill="${hairColor}"/>`;
        hairFrontSVG = `<path d="M22,28 C22,12 58,12 58,28 Q47,21 40,24 Q33,21 22,28 Z" fill="${hairColor}"/>`;
      } else {
        hairFrontSVG = `<path d="M23,28 Q40,11 57,28 Q40,19 23,28 Z" fill="${hairColor}"/>`;
      }
    }
  }

  // Sobrancelhas (6 estilos + modulação de humor)
  let browL = "M28,31 Q33,29 36,31";
  let browR = "M44,31 Q47,29 52,31";
  if (mood === "angry") {
    browL = "M28,29 L36,32.5";
    browR = "M44,32.5 L52,29";
  } else if (mood === "sad" || mood === "sick") {
    browL = "M28,32.5 Q32,29.5 36,30.5";
    browR = "M44,30.5 Q48,29.5 52,32.5";
  } else if (dna.browShape % 3 === 1) {
    browL = "M28,30.5 L36,30.5";
    browR = "M44,30.5 L52,30.5";
  }

  // Olhos (8 estilos + olheiras de doença + X de morte)
  const eyeRx = (dna.eyeShape % 2 === 0) ? 2.4 : 2.1;
  const eyeRy = (dna.eyeShape % 3 === 0) ? 1.9 : 1.55;
  let eyesSVG = "";
  if (isDead) {
    eyesSVG = `
      <path d="M30,33.5 L35,37.5 M35,33.5 L30,37.5 M45,33.5 L50,37.5 M50,33.5 L45,37.5" stroke="#2b1d12" stroke-width="1.6" stroke-linecap="round"/>
    `;
  } else {
    const darkCircles = isSick
      ? `<path d="M29,37.5 Q33,39.8 36.5,37.5 M43.5,37.5 Q47,39.8 51,37.5" fill="none" stroke="#5e4955" stroke-width="1.2" opacity="0.65"/>`
      : "";
    eyesSVG = `
      ${darkCircles}
      <g class="portrait-eyes-blink">
        <ellipse cx="33" cy="35.2" rx="${eyeRx}" ry="${eyeRy}" fill="#ffffff" stroke="#2b1d12" stroke-width="0.7"/>
        <ellipse cx="47" cy="35.2" rx="${eyeRx}" ry="${eyeRy}" fill="#ffffff" stroke="#2b1d12" stroke-width="0.7"/>
        <circle cx="33" cy="35.2" r="1.4" fill="${eyeColor}"/>
        <circle cx="47" cy="35.2" r="1.4" fill="${eyeColor}"/>
        <circle cx="32.4" cy="34.6" r="0.55" fill="#ffffff"/>
        <circle cx="46.4" cy="34.6" r="0.55" fill="#ffffff"/>
      </g>
    `;
  }

  // Nariz (6 formatos)
  const nosePaths = [
    "M40,34.5 L38.6,40.5 L41.5,41",
    "M40,34 L41.4,40.2 L38.8,41",
    "M39.5,35 Q38,40.5 40,41.2 Q42,40.5 40.5,35",
    "M40,34.5 L40,41.2 M38.5,41 L41.5,41",
    "M40,34.8 Q37.8,39.5 41.2,41",
    "M39,35 L38.2,40.8 L41.8,40.8"
  ];
  const noseSVG = `<path d="${nosePaths[dna.noseShape % 6]}" fill="none" stroke="#633e24" stroke-width="1.15" stroke-linecap="round"/>`;

  // Boca (6 formatos + expressão por humor)
  let mouthPath = "M35.5,45.5 Q40,46.8 44.5,45.5";
  if (mood === "happy" || mood === "love") {
    mouthPath = "M34.5,44.8 Q40,48.8 45.5,44.8";
  } else if (mood === "sad" || mood === "sick" || mood === "dead") {
    mouthPath = "M35,47 Q40,44.2 45,47";
  } else if (mood === "angry") {
    mouthPath = "M35,46.5 L40,45.2 L45,46.8";
  } else if (dna.mouthShape % 3 === 1) {
    mouthPath = "M36,45.8 L44,45.8";
  }
  const lipColor = isFemale && !isDead && !isSick ? "#9e2b3b" : "#593520";

  // Barba / Bigode (8 estilos para homens adultos)
  let beardSVG = "";
  if (!isFemale && age >= 19) {
    const bStyle = isOld ? (dna.beardStyle % 3) : (dna.beardStyle % 8);
    if (bStyle === 0) {
      beardSVG = `<path d="M24.5,39 Q40,60 55.5,39 Q53.5,54 40,56 Q26.5,54 24.5,39 Z" fill="${hairColor}" opacity="0.95"/>`;
    } else if (bStyle === 1) {
      beardSVG = `<path d="M33,44 Q40,41.5 47,44 M35,47 Q40,54.5 45,47 Z" fill="${hairColor}" stroke="${hairColor}" stroke-width="1.6" stroke-linecap="round"/>`;
    } else if (bStyle === 2) {
      beardSVG = `<path d="M25,40 Q40,65 55,40 Q52,59 40,63 Q28,59 25,40 Z" fill="${hairColor}"/>`;
    } else if (bStyle === 3) {
      beardSVG = `<path d="M31,44.2 Q36,42 40,44.2 Q44,42 49,44.2" fill="none" stroke="${hairColor}" stroke-width="2.3" stroke-linecap="round"/>`;
    } else if (bStyle === 4) {
      beardSVG = `<path d="M25.5,41 C27,51 53,51 54.5,41 C51,48 29,48 25.5,41 Z" fill="${hairColor}" opacity="0.82"/>`;
    } else if (bStyle === 5) {
      beardSVG = `<path d="M24.5,36 L27,47 M55.5,36 L53,47 M36,49 Q40,53 44,49" stroke="${hairColor}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
    }
  }

  // Rugas de Idade
  const wrinklesSVG = isOld
    ? `<path d="M31,26.5 Q40,24.8 49,26.5 M30,29 Q40,27.5 50,29 M27,36 L25,38 M53,36 L55,38 M32,42 L30,45 M48,42 L50,45" stroke="#6e4f35" stroke-width="0.85" fill="none" opacity="0.68"/>`
    : (age >= 40 ? `<path d="M32,27.5 Q40,26.5 48,27.5" stroke="#6e4f35" stroke-width="0.7" fill="none" opacity="0.45"/>` : "");

  // Cicatrizes e Tapa-olho persistentes
  const scarsSVG = (dna.scars || []).map(sIdx => `<use href="#pt-scar-${((sIdx - 1) % 3) + 1}"/>`).join("");
  const patchSVG = dna.eyepatch === "L" ? `<use href="#pt-eyepatch-L"/>` : (dna.eyepatch === "R" ? `<use href="#pt-eyepatch-R"/>` : "");

  // Halo de paixão ou doença
  const moodOverlay = mood === "love"
    ? `<circle cx="30" cy="39.5" r="3" fill="#e05276" opacity="0.35"/><circle cx="50" cy="39.5" r="3" fill="#e05276" opacity="0.35"/>`
    : "";

  const earR = 2.4 + (dna.earSize % 3) * 0.45;
  const faceShapePath = PORTRAIT_DATA.facePaths[dna.faceShape % PORTRAIT_DATA.facePaths.length];

  return `
    <div class="avatar-portrait ${frameClass} ${sizeClass}" style="background:radial-gradient(circle at 50% 28%, ${trimColor}44, ${secondaryGarb} 88%)">
      <svg class="portrait-svg" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
        <g transform="${scaleTransform}" style="transform-origin: 40px 45px">
          ${hairBackSVG}
          <!-- Ombros e Vestimenta -->
          <path d="M12,78 C12,53 68,53 68,78 Z" fill="${primaryGarb}" stroke="#1a110a" stroke-width="2"/>
          <path d="M28,54 L40,70 L52,54" fill="none" stroke="${trimColor}" stroke-width="2.2"/>
          ${accessorySVG}
          <!-- Pescoço -->
          <rect x="34.5" y="47" width="11" height="10" rx="3" fill="${skinColor}" stroke="#3b2616" stroke-width="1.1"/>
          <!-- Orelhas -->
          <circle cx="23.5" cy="36" r="${earR}" fill="${skinColor}" stroke="#3b2616" stroke-width="1.1"/>
          <circle cx="56.5" cy="36" r="${earR}" fill="${skinColor}" stroke="#3b2616" stroke-width="1.1"/>
          <!-- Rosto -->
          <path d="${faceShapePath}" fill="${skinColor}" stroke="#3b2616" stroke-width="1.4"/>
          ${moodOverlay}
          ${wrinklesSVG}
          ${scarsSVG}
          <!-- Sobrancelhas e Olhos -->
          <path d="${browL}" fill="none" stroke="${hairColor}" stroke-width="1.4" stroke-linecap="round"/>
          <path d="${browR}" fill="none" stroke="${hairColor}" stroke-width="1.4" stroke-linecap="round"/>
          ${eyesSVG}
          <!-- Nariz e Boca -->
          ${noseSVG}
          <path d="${mouthPath}" fill="none" stroke="${lipColor}" stroke-width="1.55" stroke-linecap="round"/>
          ${beardSVG}
          ${patchSVG}
          ${hairFrontSVG}
          ${headgearUse}
        </g>
      </svg>
      <span class="avatar-crest-Pip" style="background:${crest.bg};color:${crest.fg}" title="Casa ${surname}: ${crest.motto}">${crest.symbol}</span>
    </div>
  `;
}
