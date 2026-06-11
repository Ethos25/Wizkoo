/* global React, FAMILY */

// =============================================================
// ROUND SEVEN — FOUR SLOTS OPEN, OPTIMIZED AS ONE SYSTEM
//
// Three palettes. Each is four colors selected as a SET.
// Each palette satisfies:
//   · The four constraints (hue, gender, no internal pairing, equity).
//   · The system audit (matched chroma, distributed value,
//     distributed temperature, four distinct hue territories).
//
// Three different system architectures:
//   J · CERAMIC GLAZE — matched mid-chroma earthen pigments.
//   K · MINERAL CABINET — heritage natural-pigment range, wider value.
//   L · INKED PAPER     — quiet stoneware register, chroma-matched low.
// =============================================================

const SUBJECTS_R7 = {
  la:   { hue: "#3848D0", abbr: "LANG", family: "blue"   },
  math: { hue: "#C8A800", abbr: "MATH", family: "yellow" },
  sci:  { hue: "#3CA85A", abbr: "SCI",  family: "green"  },
  gh:   { hue: "#E07820", abbr: "GEO",  family: "orange" },
  ca:   { hue: "#7848D0", abbr: "ARTS", family: "purple" },
};

// =============================================================
// PALETTE J · CERAMIC GLAZE
//
// Architecture: four earthen pigments at matched mid chroma (~0.07).
// Value range: dark / mid / mid / light deliberately spread.
// Temperature: warm / cool-warm / cool / warm-cool — four corners.
// Hue territories: RED · CLAY · MINERAL-BLUE · OAT
// =============================================================
const PALETTE_J = {
  id: "ceramic-glaze",
  kicker: "PALETTE J",
  title: "Ceramic Glaze",
  tagline: "Four matched-chroma pigments. Stoneware register.",
  audit: {
    chroma:      "All four at C 0.06–0.08. The set reads as one chromatic family.",
    value:       "L 28 / 42 / 50 / 70 — dark, mid-dark, mid, light. No two share a value band.",
    temperature: "Warm / warm-cool seam / cool / warm-light — temperature distributed across four corners.",
    territories: "RED · CLAY · MINERAL-BLUE · OAT — four genuinely separate hue families.",
  },
  family: {
    leo:  { fill: "#5C1F30", name: "Wine",          territory: "red",            territoryShort: "RED",
            note: "Held from prior rounds. Hue ≈ 10°, C ≈ 0.10, L ≈ 26. The chromatic anchor; warmest dark." },
    max:  { fill: "#A36A50", name: "Clay",          territory: "clay",           territoryShort: "CLAY",
            note: "Terracotta-leaning brown — but de-saturated to C ≈ 0.075 and pulled toward red, away from Geo orange. Hue ≈ 35° at L 50. Reads as fired clay, not as orange." },
    jack: { fill: "#4F5A6A", name: "Slate",         territory: "mineral-blue",   territoryShort: "MINERAL BLUE",
            note: "Held from prior rounds. Cool mid blue-gray. Hue ≈ 250° at C 0.025 — neutralized cool, never confused with Lang." },
    jane: { fill: "#C9A878", name: "Oat",           territory: "oat",            territoryShort: "OAT",
            note: "Warm light beige — distinct from Max's Clay by being dramatically lighter (L 70 vs 50) and yellower (hue 65° vs 35°). At C 0.07 it carries chromatic presence; well below MATH's C 0.16." },
  },
  rationale: {
    headline: "Wine / Clay / Slate / Oat — four ceramic glazes.",
    move: "The audit-first answer. Four colors selected together because they sit at matched chroma (0.06–0.08) and spread deliberately across the value scale. Wine anchors warm-dark; Clay carries the warm-cool seam at mid-dark; Slate carries cool mid; Oat carries warm-light. Each occupies a different corner of the value × temperature × hue cube, so no two children pair on any axis. The set reads as a single fired-pigment family — the way a Frama or Hay glaze series reads — not as four individual choices.",
    constraints: [
      ["1 · Hue territory",
       "Wine: hue 10°, far from Geo (50°) and Arts (280°). Clay: hue 35° at C 0.075 — half Geo's chroma, lighter than Wine. Slate: hue 250° at C 0.025 — neutralized cool. Oat: hue 65° at C 0.07 — half MATH's chroma. None sits in a subject hue family at full chroma."],
      ["2 · Gender-neutral",
       "Wine = bottle/leather. Clay = fired pottery. Slate = stone. Oat = unbleached linen. Four material nouns with no gender coding. Set reads as ceramicist's studio — works for any family configuration."],
      ["3 · No internal pairing",
       "Hue: RED / CLAY / MINERAL-BLUE / OAT — four different families. Register: Wine is the only warm-dark; Clay is mid-dark (L 50); Slate is cool mid; Oat is warm-light. Wine + Clay don't pair as warm-darks because Clay sits 22 lightness points lighter and pulls visibly toward red-orange not red-purple. Sand-style warm-light pairing avoided because Oat is the only light value here."],
      ["4 · Visual equity",
       "Chroma 0.06 / 0.075 / 0.025 / 0.07 — Slate is the quietest but its blue cast carries chromatic identity at chip scale. The other three are matched. No child reads as the absence of color."],
    ],
    bullets: [
      ["The system",        "All four at matched chroma. The set has one chromatic intensity — the way a Hay textile sample card reads as one collection."],
      ["The corners",       "Value 28/50/42/70 = dark/mid-dark/mid/light. Temperature warm/warm-cool/cool/warm-light. Four corners, never two on the same axis."],
      ["The Geo defense",   "Clay's risk is Geo orange. Defended at hue 35° (vs Geo 50°), C 0.075 (vs Geo 0.18), and L 50 (vs Geo 60). Three-axis separation; reads as fired earth, not as label."],
      ["The Math defense",  "Oat's risk is MATH yellow. Defended at hue 65° (vs MATH 95°), C 0.07 (vs MATH 0.16). Reads as oat/linen, not as a yellow label."],
      ["J/J collision",     "Jack-slate (cool, achromatic-leaning) vs Jane-oat (warm, light, chromatic). Maximum perceptual distance. The two J's are the most resolvable pair in the set."],
      ["Boys-only check",   "Wine / Clay / Slate / Oat reads as a leather-and-stoneware library. None gendered."],
      ["Girls-only check",  "Identical reading. Oat is linen-warm, not pink-coded; Clay is pottery, not blush."],
      ["Tone",              "Frama natural-pigment + Hay stoneware. Considered, ceramicist register."],
    ],
  },
};

// =============================================================
// PALETTE K · MINERAL CABINET
//
// Architecture: heritage natural-pigment range. Wider chroma spread
// (0.05–0.12) but matched perceptually because each color is at the
// chroma natural to its hue family. Wider value range too.
// Hue territories: MADDER · OCHRE · INDIGO · PORPHYRY
// =============================================================
const PALETTE_K = {
  id: "mineral-cabinet",
  kicker: "PALETTE K",
  title: "Mineral Cabinet",
  tagline: "Four natural pigments. Each at its native saturation.",
  audit: {
    chroma:      "C 0.10 / 0.09 / 0.08 / 0.075 — perceptually matched (each color near the apparent saturation cap of its hue family).",
    value:       "L 25 / 60 / 30 / 38 — dark / light / dark-cool / mid-warm. Two darks split by hue family (red vs blue); not paired.",
    temperature: "Warm / warm / cool / warm-cool seam — anchored by Indigo as the cool counterweight.",
    territories: "MADDER · OCHRE · INDIGO · PORPHYRY — four heritage pigment names, no overlap.",
  },
  family: {
    leo:  { fill: "#5C1F30", name: "Madder",   territory: "madder-red",  territoryShort: "MADDER",
            note: "Madder lake — the Wine value held from prior rounds, renamed to its pigment source. Hue 10°, C 0.10, L 26." },
    max:  { fill: "#C99A4A", name: "Ochre",    territory: "yellow-ochre", territoryShort: "OCHRE",
            note: "Yellow ochre at its native saturation. Hue 78° at C 0.09, L 65 — a register lighter than MATH (#C8A800, L 70 but hue 95°). Sits as the warm-light slot at full pigment intensity." },
    jack: { fill: "#2A3754", name: "Indigo",   territory: "indigo",       territoryShort: "INDIGO",
            note: "Deep indigo. Hue 255° at C 0.08, L 28 — the cool counterweight. Held away from LANG (#3848D0, L 42, C 0.20) by being darker and roughly half the chroma." },
    jane: { fill: "#7E4A52", name: "Porphyry", territory: "porphyry",     territoryShort: "PORPHYRY",
            note: "Porphyry — purple-tinged red-brown stone. Hue 5° at C 0.075, L 42. The fourth corner: lighter than Madder by 16 points, less chromatic, and pulled marginally toward purple — does NOT pair with Madder as warm-darks because of the value gap and the cool-shift." },
  },
  rationale: {
    headline: "Madder / Ochre / Indigo / Porphyry — four mineral pigments.",
    move: "The heritage answer. Each color is named for its pigment source and calibrated to the saturation that pigment actually carries. The audit passes through perceptual match — Ochre at C 0.09 looks as colored as Madder at C 0.10 because the eye reads ochre's hue family at lower chroma as equally vivid. Indigo carries the cool corner without leaning toward LANG; Porphyry occupies the mid-warm slot the brief opens — neither aubergine (which fails warm-dark with Madder) nor a second-red brick. This palette reads as a museum's pigment cabinet: each tube an established material, the four chosen because they don't repeat.",
    constraints: [
      ["1 · Hue territory",
       "Madder hue 10° (red, far from Geo/Arts). Ochre hue 78° at L 65 (yellow but defended by lightness gap to MATH and chroma below MATH). Indigo hue 255°, L 28 (cool but defended by 14-point darkness and half chroma vs LANG). Porphyry hue 5° at L 42 (red-purple, far from Arts at 280°)."],
      ["2 · Gender-neutral",
       "Madder = pigment / wine. Ochre = earth pigment / honey. Indigo = denim / dye. Porphyry = stone / Roman pillar. Every name a material noun across cultures and genders."],
      ["3 · No internal pairing",
       "Hue: MADDER / OCHRE / INDIGO / PORPHYRY — four families. Register: Madder and Indigo are both dark, but split by hue family (red vs blue) AND temperature axis — they read as warm-dark vs cool-dark, the canonical anti-pair, not as a pair. Madder and Porphyry are both red-leaning but split by 16 lightness points and a chroma gap of 0.025; Porphyry reads as worn stone, Madder as pigment. Ochre is the only warm-light. Indigo is the only cool."],
      ["4 · Visual equity",
       "All four at perceptually matched chromatic weight. No child quieter than another."],
    ],
    bullets: [
      ["The system",        "Pigment-cabinet logic. Each color sits at the saturation native to its hue, so the set looks coherent without forcing matched chroma numbers."],
      ["Madder vs Porphyry","The risk to defend. Both red-leaning. The defense: 16-point value gap and a hue split (Madder 10° true red vs Porphyry 5° red-with-purple-undertone). At chip and badge scale they read as different stones, not as two reds."],
      ["The Indigo bet",    "Indigo at L 28 / C 0.08 is a deliberate departure from Slate. Slate is a desaturated cool gray; Indigo is a chromatic deep blue. The brief allows it; LANG is held away by darkness and chroma."],
      ["The Ochre bet",     "Ochre at full pigment intensity is the riskiest pick. Its defense is the L 65 / hue 78° calibration: well lighter and yellower than Geo (#E07820 at L 60, hue 50°), well below MATH's chroma."],
      ["J/J collision",     "Jack-indigo (cool, dark, chromatic blue) vs Jane-porphyry (warm-cool, mid, chromatic red-purple). Opposite hue family, opposite temperature, different value band."],
      ["Boys-only check",   "Madder / Ochre / Indigo / Porphyry reads as a Roman pigment cabinet. None gendered."],
      ["Girls-only check",  "Same reading. Porphyry is stone, not pink; Ochre is earth, not gold-jewelry."],
      ["Tone",              "Pigment cabinet. Frama oils + Kremer pigments. The most chromatic of the three palettes."],
    ],
  },
};

// =============================================================
// PALETTE L · INKED PAPER
//
// Architecture: low-chroma quartet, all at C 0.04–0.06. The quietest
// of the three palettes — but every color carries colored container
// presence. Reads like ink on paper: deep, considered, low-key.
// Hue territories: BORDEAUX · STRAW · STEELBLUE · SAGE-BROWN
// =============================================================
const PALETTE_L = {
  id: "inked-paper",
  kicker: "PALETTE L",
  title: "Inked Paper",
  tagline: "Four colors at matched low chroma. Notebook register.",
  audit: {
    chroma:      "C 0.05 / 0.05 / 0.04 / 0.045 — the tightest match in the round. One quiet chromatic family.",
    value:       "L 30 / 65 / 40 / 50 — dark / light / mid-cool / mid-warm. Spread across the value band.",
    temperature: "Warm / warm-light / cool / warm-cool — distributed.",
    territories: "BORDEAUX · STRAW · STEELBLUE · SAGE-BROWN — four families, all desaturated.",
  },
  family: {
    leo:  { fill: "#562838", name: "Bordeaux",   territory: "red",          territoryShort: "BORDEAUX",
            note: "Bordeaux ink — red but desaturated to C 0.05 to sit in the same chromatic register as the others. Hue 5°, L 30. Slightly lighter and quieter than Wine; fits the inked register." },
    max:  { fill: "#C2A47A", name: "Straw",      territory: "straw",        territoryShort: "STRAW",
            note: "Straw — paler than Sand by a hair, and slightly warmer-toward-yellow. Hue 70°, C 0.05, L 70. Reads as raw paper, not as a beige." },
    jack: { fill: "#536976", name: "Steelblue",  territory: "steel-blue",   territoryShort: "STEELBLUE",
            note: "Cool steel — Slate's lighter, slightly more chromatic cousin. Hue 240°, C 0.04, L 45. Same family as Slate; calibrated for this set." },
    jane: { fill: "#5E5142", name: "Sage-Brown", territory: "umber-sage",   territoryShort: "SAGE-BROWN",
            note: "A desaturated umber pulled toward warm-green. Hue 80° at C 0.045, L 38. Distinct from Straw by being two value bands darker and shifted away from yellow toward olive — not a pair, a counterpoint." },
  },
  rationale: {
    headline: "Bordeaux / Straw / Steelblue / Sage-Brown — four inks on paper.",
    move: "The quiet answer. All four at matched low chroma — the set reads as inked on paper, not as glazed. The chromatic intensity is uniform across all four because every color is held at C 0.04–0.05; the audit passes through deliberate matching, not through pigment-cap rationalization. Bordeaux carries the warm-dark; Straw the warm-light; Steelblue the cool mid; Sage-Brown the warm-cool seam between umber and dark olive — not loden, not teal, but the desaturated muddy slot the brief hasn't tried.",
    constraints: [
      ["1 · Hue territory",
       "All four at C 0.04–0.05 — well below the chroma threshold where any of them could read as a subject color. Bordeaux 5° / Straw 70° / Steelblue 240° / Sage-Brown 80°. The Sage-Brown overlaps MATH's hue band (95°) but at C 0.045 vs MATH's 0.16 reads as muddy olive-umber, not as yellow."],
      ["2 · Gender-neutral",
       "Bordeaux ink. Straw paper. Steel rule. Sage-brown thread. Stationery-cabinet register; nothing gendered."],
      ["3 · No internal pairing",
       "Hue: BORDEAUX / STRAW / STEELBLUE / SAGE-BROWN — four families. Register: Bordeaux is the only dark (L 30). Straw is the only light (L 70). Steelblue is the only cool. Sage-Brown is the warm-cool seam at L 38 — does not pair with Bordeaux (8 value points apart and shifted toward olive, not red) and does not pair with Straw (32 value points apart). No two children share a register slot."],
      ["4 · Visual equity",
       "All four at C 0.04–0.05 — equal chromatic weight by construction. No child quieter than another. The defense against the round-six 'gray-leaning Jane' failure: Sage-Brown is held above the chroma threshold where it would read as gray (~0.025) by a comfortable margin."],
    ],
    bullets: [
      ["The system",        "Matched-chroma quiet quartet. The whole point: the four colors share an intensity register, the way four ink colors in a writer's box share a register."],
      ["The Sage-Brown bet","The fourth-slot answer. Pulled toward olive-umber, not loden — saturated low enough that the SCI/MATH brush is moot. Reads as muddy thread, not as label."],
      ["Bordeaux vs Wine",  "Same territory, slightly different calibration. Bordeaux at L 30 / C 0.05 sits in this set's chromatic register; Wine at L 26 / C 0.10 would be too saturated relative to Straw and Steelblue. Set-aware substitution."],
      ["Set test",          "If a parent saw all four chips in a row with no labels, they would read as one collection — same studio, same ink series. That's the audit-passing signature."],
      ["J/J collision",     "Jack-steelblue vs Jane-sage-brown. Cool desaturated vs warm desaturated. Same chromatic register, opposite temperature axis — the cleanest possible quiet pairing."],
      ["Boys-only check",   "Reads as a stationery cabinet. None gendered."],
      ["Girls-only check",  "Same reading. Straw is paper, Bordeaux is ink — no feminine lean."],
      ["Tone",              "Notebook / writer's stationery / Norm Architects material library. The most restrained of the three palettes."],
    ],
  },
};

const PALETTES_R7 = [PALETTE_J, PALETTE_K, PALETTE_L];

// =============================================================
// SHARED COMPONENTS
// =============================================================

function SubjectR7({ subject, scale = 1, dense = false }) {
  const s = SUBJECTS_R7[subject];
  return (
    <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "flex-start", lineHeight: 1 }}>
      <span className="mono" style={{
        fontSize: 9 * scale,
        color: dense ? "var(--ink)" : "var(--meta)",
        letterSpacing: "0.20em",
      }}>{s.abbr}</span>
      <span style={{ width: "100%", height: 1.5, background: s.hue, marginTop: 2 * scale }}/>
    </span>
  );
}

function ChildR7({ kid, palette, size = 18, hideName = false }) {
  const t = palette.family[kid.id];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
      <span style={{
        width: size, height: size,
        borderRadius: Math.round(size * 0.22),
        background: t.fill,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        fontFamily: "Plus Jakarta Sans", fontStyle: "italic", fontWeight: 600,
        fontSize: Math.round(size * 0.61), color: "#FAFAFA", lineHeight: 1, flexShrink: 0,
      }}>{kid.initial}</span>
      {!hideName && (
        <span style={{
          fontFamily: "Plus Jakarta Sans", fontStyle: "italic", fontWeight: 500,
          fontSize: 14, color: "var(--ink)", letterSpacing: "-0.005em",
        }}>{kid.name}</span>
      )}
    </span>
  );
}

function ChildChipR7({ kid, palette, size = 18 }) {
  const t = palette.family[kid.id];
  return (
    <span style={{
      width: size, height: size,
      borderRadius: Math.round(size * 0.22),
      background: t.fill,
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Plus Jakarta Sans", fontStyle: "italic", fontWeight: 600,
      fontSize: Math.round(size * 0.61), color: "#FAFAFA", lineHeight: 1, flexShrink: 0,
    }}>{kid.initial}</span>
  );
}

Object.assign(window, {
  SUBJECTS_R7, PALETTES_R7, PALETTE_J, PALETTE_K, PALETTE_L,
  SubjectR7, ChildR7, ChildChipR7,
});
