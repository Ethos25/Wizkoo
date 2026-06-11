/* global React */

// =============================================================
// ROUND TWELVE — FIVE PALETTES
// Three suggested directions + two carte blanche.
// One ships.
// =============================================================

const SUBJECTS_R12 = {
  la:    { hue: "#3848D0", abbr: "LANG",   name: "Ink"      },
  math:  { hue: "#18A0B8", abbr: "MATH",   name: "Polar"    },
  sci:   { hue: "#38B060", abbr: "SCI",    name: "Malachite"},
  gh:    { hue: "#C83030", abbr: "GEO",    name: "Vermilion"},
  ca:    { hue: "#8848E0", abbr: "ARTS",   name: "Amethyst" },
  pe:    { hue: "#F08A20", abbr: "PE",     name: "Ember"    },
  wl:    { hue: "#B8B0A8", abbr: "WL?",    name: "TBD",  tbd: true },
  ls:    { hue: "#B8B0A8", abbr: "LS?",    name: "TBD",  tbd: true },
};

const KIDS = [
  { id: "leo",  initial: "L", name: "Leo",  rest: "eo"  },
  { id: "max",  initial: "M", name: "Max",  rest: "ax"  },
  { id: "jack", initial: "J", name: "Jack", rest: "ack" },
  { id: "jane", initial: "J", name: "Jane", rest: "ane" },
];

const RECAP = [
  { id: "leo",  shift: "fractions of a whole — solid → fluent" },
  { id: "max",  shift: "Roman trade routes — new mastery" },
  { id: "jack", shift: "decoding multisyllabics — emerging" },
  { id: "jane", shift: "place value to thousands — solid" },
];

// =============================================================
// FIVE PALETTES
// All four colors per palette must clear: subject collision,
// gender-neutral, no internal pairing, visual equity.
// =============================================================

const PALETTES_R12 = [
  // -----------------------------------------------------------
  // 1 — JEWEL TONES (suggested direction: editorial)
  // Saturated but darkened. Each color a stone, not a marker.
  // -----------------------------------------------------------
  {
    id: "jewel",
    badge: "DIRECTION 1",
    title: "Atelier Jewels",
    tagline: "Garnet · Emerald · Lapis · Citrine — saturated stones, darkened to read as jewelry, not as label.",
    semantic: "EDITORIAL · the Goldsmiths' Hall display case · saturated but adult",
    family: {
      leo:  { fill: "#5A2030", name: "Garnet",  note: "Hue 5°, C 0.13, L 28. Defended from Vermilion red (15° at L 50) by 22 L points and lower chroma — Garnet reads as faceted stone in shadow, not as alarm-red." },
      max:  { fill: "#1F4E3D", name: "Forest Emerald", note: "Hue 155°, C 0.08, L 30. Pulled cool from Malachite (140° at L 65) by 25 L points and shifted into pine territory — reads as bottle-green, not subject-green." },
      jack: { fill: "#1F3858", name: "Lapis",   note: "Hue 250°, C 0.10, L 28. Defended from Ink blue (250° at L 45) by 17 L darker — reads as deep stone, not as label-blue." },
      jane: { fill: "#C09444", name: "Citrine", note: "Hue 75°, C 0.12, L 65. Defended from Ember orange (50° at C 0.18) by 25° hue + lower chroma — reads as honey gold, not as warning. The lightest slot, fully chromatic." },
    },
    rationale: "The editorial answer. Four jewel-stones with saturation high enough to distinguish at 20px, value compressed into the dark-and-warm-light range (no jelly bean, no candy). All four read as the same kind of object — *stones in a case*. Brand register: Phaidon Pierres précieuses, V&A jewelry vault. The risk: at small scale, Garnet drifts toward Vermilion territory. Defended by 22 L points and chroma differential.",
    risk: "Garnet sits closest to Vermilion. Defense holds at 20px in tests, but pressure exists.",
  },

  // -----------------------------------------------------------
  // 2 — ATMOSPHERIC / COSMIC (suggested direction: brand-coherent)
  // Twilight, dawn, deep water. The brand's reverence register.
  // -----------------------------------------------------------
  {
    id: "atmos",
    badge: "DIRECTION 2",
    title: "Twilight Hours",
    tagline: "Indigo · Storm · Ash · Saffron — the sky between sundown and night, the saffron lamp in the window.",
    semantic: "ATMOSPHERIC · the brand's reverence register · sky and lit window",
    family: {
      leo:  { fill: "#1E2440", name: "Indigo Hour",  note: "Hue 245°, C 0.06, L 18. Deep twilight. Defended from Ink blue by L 27 darker; reads as sky after sunset, not as label-blue." },
      max:  { fill: "#3A5060", name: "Storm",        note: "Hue 220°, C 0.05, L 38. Cool slate. Sits between Indigo and the warm-lights as the cool-mid; reads as approaching weather. Far from Polar teal (190° at C 0.10) by chroma." },
      jack: { fill: "#9C9080", name: "Ash",          note: "Hue 75°, C 0.03, L 60. Warm grey. Connector between the cool-darks and the saffron. Neutral territory; far from all chromatic subjects." },
      jane: { fill: "#D4A044", name: "Saffron",      note: "Hue 65°, C 0.13, L 70. Warm chromatic peak. The lit lamp in the window. Defended from Ember orange (50°) by 15° hue and from Citrine yellow (75° gold) by darker value." },
    },
    rationale: "The brand-coherent answer. Atmospheric register: a single moment of evening, three shades of sky and one warm interior light. The semantic is ABOUT THE FAMILY — at the end of the day, four lights (the children) inside a household. Saffron at C 0.13 is the warm chromatic anchor, replacing what Wine/Plum did in earlier rounds. Two cool darks split by 20 L points; warm-mid Ash; warm-light Saffron. The four-color set carries the brand's reverence-and-care voice.",
    risk: "Saffron at C 0.13 is the most saturated child color across all five palettes — pressures Citrine (jewel), Ember subject. Defense is hue distance to Ember (15°) and the deliberate 'lamp in window' semantic.",
  },

  // -----------------------------------------------------------
  // 3 — CONSIDERED PRIMARIES (suggested direction: max distinction)
  // Red-blue-yellow-green pulled away from primary into adult territory.
  // -----------------------------------------------------------
  {
    id: "primaries",
    badge: "DIRECTION 3",
    title: "Considered Primaries",
    tagline: "Bordeaux · Pacific · Olive · Brick — four primaries pulled into adult territory by darkening and chroma shift.",
    semantic: "MAXIMUM DISTINCTION · four corners of the color wheel · de-saturated for adult register",
    family: {
      leo:  { fill: "#5C2828", name: "Bordeaux",  note: "Hue 10°, C 0.10, L 28. Wine-shifted red. Defended from Vermilion (15° at L 50) by 22 L points and lower chroma — reads as wine, not as alarm." },
      max:  { fill: "#1F4858", name: "Pacific",   note: "Hue 215°, C 0.06, L 30. Dark teal-blue. Far from Polar teal (190° at L 65) by 35 L darker; far from Ink blue (250°) by 35° hue + L 15. The cool primary slot." },
      jack: { fill: "#7A7536", name: "Olive",     note: "Hue 95°, C 0.08, L 48. Dark yellow-green. Pulled from Malachite green (140°) by 45° hue toward yellow; pulled from Ember orange (50°) by 45° hue toward green. The warm-neutral primary." },
      jane: { fill: "#B86838", name: "Brick",     note: "Hue 40°, C 0.13, L 55. Burnt orange. Defended from Ember (50° at L 65) by 10 L darker and pulled toward red; reads as terracotta, not as label-orange." },
    },
    rationale: "Maximum hue distinction within an adult register. Each color sits at a primary cardinal point of the wheel, pulled into chromatically restrained territory by darkening and chroma shift. The set covers the broadest hue range of the five palettes (10°–215°). Trade-off: Bordeaux walks closest to Vermilion of any palette here, and Brick walks closest to Ember. Both defended by L points; both pressures exist.",
    risk: "Two simultaneous subject pressures (Bordeaux↔Vermilion, Brick↔Ember). Defense holds but is the most stressed of the five.",
  },

  // -----------------------------------------------------------
  // 4 — CARTE BLANCHE: THE TEXTILE (linen, dye-vat, ground pigment)
  // What I would design: a palette named after the textile registers
  // that the brand voice already implies. Considered, slightly low,
  // chromatic where it counts. Each color a SPECIFIC dye, not a stone.
  // -----------------------------------------------------------
  {
    id: "textile",
    badge: "CARTE BLANCHE · I",
    title: "The Dye Studio",
    tagline: "Madder · Woad · Walnut · Weld — four natural dyes, each at the value the dye-vat actually produces.",
    semantic: "TEXTILE · four bolts of dyed wool from the same workshop · accurate to historical dye chemistry",
    family: {
      leo:  { fill: "#7A2A2E", name: "Madder",  note: "Hue 8°, C 0.13, L 35. The historical madder root dye — slightly browner than Vermilion, slightly redder than Bordeaux. Reads as carpet-red, not label-red." },
      max:  { fill: "#1E3858", name: "Woad",    note: "Hue 245°, C 0.08, L 28. The historical woad/indigo dye — deep cool blue. Defended from Ink (250°) by 17 L darker; reads as denim and cyanotype, not as button." },
      jack: { fill: "#5C4128", name: "Walnut",  note: "Hue 50°, C 0.07, L 35. Walnut hull dye — warm dark brown. The lowest-chroma slot; reads as antique wood, dyed leather. Far from all subjects." },
      jane: { fill: "#C8A848", name: "Weld",    note: "Hue 80°, C 0.13, L 70. Weld — the historical yellow dye. Warm chromatic light. Defended from Ember (50°) by 30° hue toward yellow-green; from Citrine register by darker, less green." },
    },
    rationale: "The carte blanche move I'd make. Five rounds of brief have been adjacent to *textile* without naming it. The dye studio is where the brand voice actually lives — Frama, Toast, MUJI's textile catalog. Four colors specified by the actual chemistry of natural dyes: madder root, woad leaf, walnut hull, weld plant. Names that sound *real* in a way 'Ash' and 'Cocoa' don't quite — these were professions. Inclusion semantic via the dyer's register: every culture has indigo, every culture has madder. The widest hue range of any palette here that still reads as one workshop because the chromas are matched (0.07–0.13). The two L 35 slots (Madder, Walnut) are split by 40° hue and chroma differential — they don't pair.",
    risk: "Madder is the highest-saturation red across all five palettes (C 0.13). Defense is 22 L darker than Vermilion and 0.05 lower chroma — but this is the riskiest red proposed in any round. Worth it for the semantic.",
  },

  // -----------------------------------------------------------
  // 5 — CARTE BLANCHE: PIGMENT (the artist's box)
  // Four single-pigment paints. Each named after the actual pigment
  // (not a stone, not a dye). Names that exist in the cabinet at
  // Kremer Pigmente. The most considered move in the deck.
  // -----------------------------------------------------------
  {
    id: "pigment",
    badge: "CARTE BLANCHE · II",
    title: "The Pigment Cabinet",
    tagline: "Cinnabar · Verdigris · Ochre · Bone — four single-pigment paints from the Kremer cabinet.",
    semantic: "PIGMENT · the artist's box · four named pigments with provenance",
    family: {
      leo:  { fill: "#7A3528", name: "Cinnabar", note: "Hue 18°, C 0.13, L 35. Mercury sulfide red, the historical pigment for vermillion and Pompeian wall painting. Browner than the modern Vermilion subject color (15° at L 50) — defended by 15 L darker and warmer hue." },
      max:  { fill: "#3A5848", name: "Verdigris",note: "Hue 155°, C 0.06, L 38. Copper-acetate green, the bronze-patina pigment from Renaissance illumination. Defended from Malachite (140° at C 0.18) by C differential and L 27 darker." },
      jack: { fill: "#A87838", name: "Ochre",    note: "Hue 50°, C 0.11, L 55. Yellow ochre — the oldest pigment in the human archive (Lascaux, Altamira). Defended from Ember (50° at C 0.18, L 65) by chroma reduction and L 10 darker — reads as cave wall, not as button." },
      jane: { fill: "#D4C8B0", name: "Bone",     note: "Hue 75°, C 0.04, L 80. Bone white / Naples white — the historical pigment for highlight in oil painting. The light, near-neutral slot — defends against #F8F4E9 chalk by warmer hue and chroma differential. Reads as ground bone, not as paper." },
    },
    rationale: "The other carte blanche move. Four pigments named for what they ARE chemically — Cinnabar (HgS), Verdigris (Cu(C₂H₃O₂)₂), Ochre (Fe₂O₃), Bone (calcium phosphate). Each has a provenance: Pompeii, the workshop of Cennino Cennini, Lascaux, the Dutch oil painters. The brand voice CAN do this — Phaidon's *Pigments through the Ages*, Kassia St Clair's *The Secret Lives of Color*. Inclusion semantic via art-historical pluralism: every culture used ochre. The trade-off vs. The Dye Studio: this set has lower mean chroma (0.085 vs 0.103), more compressed range, reads quieter on surface — but Ochre at C 0.11 is the warm chromatic anchor, and Bone is the riskiest light slot of the five (C 0.04). Worth proposing because it's the only set named for *substances*, not for *colors*. That register is what *elite* looks like at this altitude.",
    risk: "Bone at C 0.04, L 80 walks closest to absence-of-color of any light slot in the five palettes. Defense is hue (warm) and chroma differential against #F8F4E9 chalk (L 95, near-neutral). Real but defensible.",
  },
];

// =============================================================
// UTILITIES
// =============================================================
function letterColorR12(fill) {
  const lights = ["#C09444","#D4A044","#9C9080","#C8A848","#D4C8B0"];
  return lights.includes(fill) ? "#0C1020" : "#FAFAFA";
}

function FormB({ kid, palette, scale = 1, hideRest = false }) {
  const c = palette.family[kid.id];
  const initSize = 32 * scale;
  const restSize = 17 * scale;
  return (
    <span style={{ display: "inline-flex", alignItems: "baseline", lineHeight: 1 }}>
      <span style={{ fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 500, fontSize: initSize, color: c.fill, letterSpacing: "-0.02em", fontVariationSettings: '"opsz" 144', lineHeight: 0.85 }}>{kid.initial}</span>
      {!hideRest && <span style={{ fontFamily: "Plus Jakarta Sans", fontStyle: "italic", fontWeight: 500, fontSize: restSize, color: "var(--ink)", letterSpacing: "-0.005em", marginLeft: 1 }}>{kid.rest}</span>}
    </span>
  );
}

function ChipB({ kid, palette }) { const c = palette.family[kid.id];
  return <span style={{ width: 20, height: 20, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 600, fontSize: 19, color: c.fill, lineHeight: 1, letterSpacing: "-0.02em", fontVariationSettings: '"opsz" 144' }}>{kid.initial}</span>;
}

function SubjectUnderline({ subject, dense = false }) {
  const s = SUBJECTS_R12[subject];
  return (
    <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "flex-start", lineHeight: 1 }}>
      <span className="mono" style={{ fontSize: 9, color: dense ? "var(--ink)" : "var(--meta)", letterSpacing: "0.20em" }}>{s.abbr}</span>
      <span style={{ width: "100%", height: 1.5, background: s.hue, marginTop: 2, opacity: s.tbd ? 0.4 : 1 }}/>
    </span>
  );
}

Object.assign(window, { SUBJECTS_R12, KIDS, RECAP, PALETTES_R12, FormB, ChipB, SubjectUnderline, letterColorR12 });
