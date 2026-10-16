/* ============================================================================
   [RETRATOS · DADOS] — paleta, DNA de aparência e herança genética dos retratos procedurais
   ============================================================================ */
const PORTRAIT_DATA = {
  skins: ["#f7dec8", "#f2ccb0", "#e6b897", "#d9a17c", "#c88c64", "#ab7049", "#8c5635", "#fbe8d8"],
  SickSkins: ["#d7dec9", "#cdd6be", "#bfc9b0", "#b2bda3"],
  DeadSkins: ["#b5b8b3", "#a3a6a1", "#929690"],
  eyes: ["#2b4c6f", "#3b5e2b", "#54361d", "#24170d", "#634e20", "#425e66", "#704214", "#1f2e1f"],
  hairs: ["#181310", "#2c1d12", "#4a2e18", "#6e421f", "#8f5929", "#b88639", "#d6ad54", "#782818", "#9e3820", "#382a22", "#594537", "#121216"],
  facePaths: [
    "M24,25 C24,14 56,14 56,25 C57,38 51,51 40,52 C29,51 23,38 24,25 Z", // Oval clássico
    "M23,24 C23,14 57,14 57,24 C57,39 53,50 40,51 C27,50 23,39 23,24 Z", // Mandíbula quadrada
    "M22,26 C22,14 58,14 58,26 C59,40 52,52 40,52 C28,52 21,40 22,26 Z", // Rosto redondo
    "M25,24 C25,13 55,13 55,24 C55,37 49,53 40,54 C31,53 25,37 25,24 Z", // Longo aristocrático
    "M24,25 C24,14 56,14 56,25 C56,36 48,50 40,53 C32,50 24,36 24,25 Z", // Queixo fino / coração
    "M24,25 C24,15 56,15 56,25 L55,42 L47,52 L33,52 L25,42 Z"            // Talhado / guerreiro
  ]
};

function hashSeedString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function getOrCreateAppearanceDNA(person) {
  if (person && person.appearance && typeof person.appearance === "object") {
    return person.appearance;
  }
  const kId = (person && person.birthKingdom) || (typeof STATE !== "undefined" && STATE ? STATE.kingdom : null);
  const pheno = (typeof DATA !== "undefined" && DATA.kingdomPhenotypes && kId) ? DATA.kingdomPhenotypes[kId] : null;
  const seedKey = (person.id || person.name || "hero") + "_" + (person.surname || "") + "_" + (kId || "");
  const h = hashSeedString(seedKey);
  const pickFrom = (pool, shift, mod) => (pool && pool.length) ? pool[(h >> shift) % pool.length] : ((h >> shift) % mod);
  const dna = {
    seed: h,
    faceShape: h % 6,
    skinIdx: pickFrom(pheno && pheno.skins, 3, 8),
    eyeShape: pickFrom(pheno && pheno.eyeShapes, 6, 8),
    eyeColorIdx: pickFrom(pheno && pheno.eyes, 9, 8),
    browShape: (h >> 12) % 6,
    noseShape: (h >> 15) % 6,
    mouthShape: (h >> 18) % 6,
    hairStyle: (h >> 21) % 12,
    hairColorIdx: pickFrom(pheno && pheno.hairs, 4, 12),
    beardStyle: pickFrom(pheno && pheno.beards, 7, 8),
    earSize: (h >> 11) % 3,
    scars: (person.scars && person.scars.length) ? person.scars : (((h >> 14) % 19 === 0) ? [1] : []),
    eyepatch: person.eyepatch || (((h >> 16) % 37 === 0) ? "L" : null)
  };
  if (person && typeof person === "object") {
    person.appearance = dna;
  }
  return dna;
}

function inheritChildAppearance(parentA, parentB, childSex, childId) {
  const dnaA = getOrCreateAppearanceDNA(parentA || { name: "Pai" });
  const dnaB = getOrCreateAppearanceDNA(parentB || parentA || { name: "Mae" });
  const h = hashSeedString((childId || "child") + "_" + Date.now());
  const pickTrait = (valA, valB, maxMod, mutChance = 0.18) => {
    if ((h % 100) / 100 < mutChance) return (valA + 1) % maxMod;
    return (h & 1) ? valA : valB;
  };
  return {
    seed: h,
    faceShape: pickTrait(dnaA.faceShape, dnaB.faceShape, 6),
    skinIdx: pickTrait(dnaA.skinIdx, dnaB.skinIdx, 8, 0.08),
    eyeShape: pickTrait(dnaA.eyeShape, dnaB.eyeShape, 8),
    eyeColorIdx: pickTrait(dnaA.eyeColorIdx, dnaB.eyeColorIdx, 8),
    browShape: pickTrait(dnaA.browShape, dnaB.browShape, 6),
    noseShape: pickTrait(dnaA.noseShape, dnaB.noseShape, 6),
    mouthShape: pickTrait(dnaA.mouthShape, dnaB.mouthShape, 6),
    hairStyle: (h >> 5) % 12,
    hairColorIdx: pickTrait(dnaA.hairColorIdx, dnaB.hairColorIdx, 12, 0.10),
    beardStyle: (h >> 8) % 8,
    earSize: pickTrait(dnaA.earSize, dnaB.earSize, 3),
    scars: [],
    eyepatch: null
  };
}
