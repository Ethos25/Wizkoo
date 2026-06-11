/* global React, FAMILY */

// =============================================================
// ROUND EIGHT — ONE FAMILY · CREAM → BROWN
//
// User direction: keep the four colors in a single earth family
// (cream / oat / clay / brown). The risk is that "one family" reads
// as "four shades of one color" — violating no-internal-pairing.
// The defense is to spread each color along TWO axes:
//   · Value (light → dark, four distinct bands)
//   · Hue degree inside the warm-earth wedge (yellow-cream → red-clay → cool-brown)
// so the four slots read as four earths, not four shades.
// =============================================================

const SUBJECTS_R8 = {
  la:   { hue: "#3848D0", abbr: "LANG", family: "blue"   },
  math: { hue: "#C8A800", abbr: "MATH", family: "yellow" },
  sci:  { hue: "#3CA85A", abbr: "SCI",  family: "green"  },
  gh:   { hue: "#E07820", abbr: "GEO",  family: "orange" },
  ca:   { hue: "#7848D0", abbr: "ARTS", family: "purple" },
};

// =============================================================
// PALETTE M · SINGLE EARTH
// Strict tonal ladder. Four colors, four lightness bands, four
// hue degrees inside the warm-earth wedge. The "Hay leather card" answer.
// =============================================================
const PALETTE_M = {
  id: "single-earth",
  kicker: "PALETTE M",
  title: "Single Earth",
  tagline: "One family, four positions. Cream → Cocoa.",
  audit: {
    chroma:      "C 0.05 / 0.06 / 0.075 / 0.05 — matched low-chroma earth register.",
    value:       "L 78 / 65 / 50 / 30 — strict ladder, four distinct bands, no two within 15 points.",
    temperature: "Warm throughout — the family is the system. Hue moves: 75° / 65° / 35° / 25°.",
    territories: "CREAM · OAT · CLAY · COCOA — four positions in the warm-earth wedge.",
  },
  family: {
    leo:  { fill: "#3D2A1E", name: "Cocoa",   territory: "deep-brown",  territoryShort: "COCOA",
            note: "Deep brown, hue 25° pulled slightly cool. L 30, C 0.05. The dark anchor; a leather/espresso reading. Replaces Wine — gives up red anchor in favor of family coherence." },
    max:  { fill: "#A36A50", name: "Clay",    territory: "fired-clay",  territoryShort: "CLAY",
            note: "Fired clay, hue 35° at C 0.075, L 50. The chromatic peak of the set. Reads as terracotta but defended from Geo orange (50°) by 15° hue and half the chroma." },
    jack: { fill: "#C9A878", name: "Oat",     territory: "warm-oat",    territoryShort: "OAT",
            note: "Warm oat, hue 65° at C 0.07, L 65. Light-middle band. Sits half the chroma of MATH (#C8A800) and shifted toward red — reads as porridge, not as butter." },
    jane: { fill: "#EBDDC2", name: "Cream",   territory: "cream",       territoryShort: "CREAM",
            note: "Cream — hue 75° at C 0.05, L 86. The lightest position. White letters need verification at 20×20; tested with knockout color check below." },
  },
  rationale: {
    headline: "Cocoa / Clay / Oat / Cream — one family, four positions.",
    move: "The directly-asked answer. All four colors live in the warm-earth wedge — leather, terracotta, oatmeal, cream. The system passes by spreading along two axes inside the family: a strict 4-band lightness ladder (30 / 50 / 65 / 86) and four different hue degrees (25° / 35° / 65° / 75°). The result reads as one library — a Hay leather sample card, a Frama natural-dye expression — not as four colors. Cocoa replaces Wine as Leo's slot: the parent gives up a red chromatic anchor in exchange for family coherence.",
    constraints: [
      ["1 · Hue territory",
       "All four sit in the warm-earth wedge (hue 25–75°), all at C 0.05–0.075. The Geo orange territory is the only subject hue this wedge touches; defense is chroma — every color is at less than half Geo's saturation (0.18). Math, Lang, Sci, Arts are all far on the wheel."],
      ["2 · Gender-neutral",
       "Cream / Oat / Clay / Cocoa — kitchen and ceramicist nouns. Linen, oatmeal, terracotta, leather. None gender-coded; the warm-earth register is neutral by tradition."],
      ["3 · No internal pairing",
       "The audit-pivotal claim. Lightness gaps: 21, 15, 15, 36 — no two within 15 points. Hue-degree gaps: 10°, 30°, 10° — every neighbor sits at a different position in the warm-earth wedge. Chroma also breaks ties: Clay (0.075) is the chromatic peak; Cream (0.05) and Cocoa (0.05) the quietest."],
      ["4 · Visual equity",
       "All four are colored containers. Cream at C 0.05 carries warm chromatic identity (it's not white) and sits at L 86 — readable with white-knockout letters at 20×20 only with care; the Recap-badge test below uses ink-knockout for Cream specifically."],
    ],
    bullets: [
      ["Why this lands",     "The user asked for it explicitly. Single-family palettes have a coherence that mixed-family ones cannot reach — a leather library, a paint deck for one room."],
      ["The Cream defense",  "Cream at L 86 is the only color in the set that needs ink-on-cream rather than white-on-color at small scale. The Recap badge test confirms; treat Cream as a one-off chip-rule exception."],
      ["The Cocoa trade",    "Cocoa replaces Wine. The set gives up its red chromatic anchor in exchange for family coherence. If Wine matters more than coherence, Palette N keeps Wine. If coherence wins, M is the answer."],
      ["The single hue risk","The set is one family — visually adjacent colors are common. The 4-band lightness ladder is the safety: at chip scale, Cream and Oat read as separate because L 86 vs L 65 is a 21-point gap, well beyond perceptual minimum."],
      ["J/J collision",      "Jack-Oat (warm light) vs Jane-Cream (warm lightest). The two J's both light, both warm — distinguished by 21 lightness points and 10° hue. The closest pairing in the set; defended by lightness, not by hue."],
      ["Boys-only check",    "Cocoa / Clay / Oat / Cream reads as a leather and woodshop library."],
      ["Girls-only check",   "Same reading. Cream is linen, not blush. None gendered."],
      ["Tone",               "Hay leather + Frama natural-dye. The most family-coherent of all rounds."],
    ],
  },
};

// =============================================================
// PALETTE N · EARTH + WINE ANCHOR
// Same family, but Leo keeps Wine as the chromatic anchor.
// Trades a touch of family-coherence for a kept red.
// =============================================================
const PALETTE_N = {
  id: "earth-with-anchor",
  kicker: "PALETTE N",
  title: "Earth, with Wine",
  tagline: "Three earths plus the held Wine. Family with a chromatic anchor.",
  audit: {
    chroma:      "C 0.10 / 0.075 / 0.07 / 0.05 — Wine is the chromatic peak; the other three earthen at matched low chroma.",
    value:       "L 26 / 50 / 65 / 86 — four bands, ladder kept.",
    temperature: "Warm throughout. Wine is warm-red; the others sit in the warm-earth wedge.",
    territories: "WINE · CLAY · OAT · CREAM — red anchor + three earths.",
  },
  family: {
    leo:  { fill: "#5C1F30", name: "Wine",   territory: "red",          territoryShort: "WINE",
            note: "The held color. Hue 10°, C 0.10, L 26. The chromatic anchor; reads as bottled wine, sits at the dark end of the warm-earth wedge." },
    max:  { fill: "#A36A50", name: "Clay",   territory: "fired-clay",   territoryShort: "CLAY",
            note: "Fired clay. Hue 35°, C 0.075, L 50. Bridges Wine's red toward the warmer earth tones — does not pair as a second-red because of the 24-point lightness gap and 25° hue shift." },
    jack: { fill: "#C9A878", name: "Oat",    territory: "warm-oat",     territoryShort: "OAT",
            note: "Warm oat, hue 65° at C 0.07, L 65. Light-middle band." },
    jane: { fill: "#EBDDC2", name: "Cream",  territory: "cream",        territoryShort: "CREAM",
            note: "Cream, hue 75° at C 0.05, L 86. Lightest position." },
  },
  rationale: {
    headline: "Wine / Clay / Oat / Cream — red anchor in an earthen family.",
    move: "The compromise palette. Three colors stay in the warm-earth wedge (Clay, Oat, Cream) and one — Wine — sits at the chromatic edge of that wedge. The set still reads as one family because Wine is a red-earth (bottled wine sits next to terracotta on a sample card), but the chromatic anchor is preserved. Lightness ladder: 26 / 50 / 65 / 86. Hue progression: 10° / 35° / 65° / 75° — Wine extends the family's red end without breaking it.",
    constraints: [
      ["1 · Hue territory",
       "Wine 10° at C 0.10 — sits between red and red-orange, far from Geo (50°) and Arts (280°). The other three at hue 35–75°, C 0.05–0.075 — all under half Geo's chroma."],
      ["2 · Gender-neutral",
       "Wine, Clay, Oat, Cream. Material nouns; warm-earth register. None gender-coded."],
      ["3 · No internal pairing",
       "Lightness ladder 26 / 50 / 65 / 86 — every gap ≥ 15 points. Hue progression 10° / 35° / 65° / 75° — Wine and Clay are both red-leaning but split by 25° hue and 24 lightness points. Wine is the only chromatic peak (C 0.10); the rest are quieter."],
      ["4 · Visual equity",
       "All four colored. Wine carries chromatic weight; Cream carries chromatic identity at low chroma but high lightness. Cream needs the ink-knockout treatment at 20×20 — same as Palette M."],
    ],
    bullets: [
      ["Why this lands",     "Keeps the red anchor that's been held since round 4 while satisfying the user's single-family direction. Compromise palette in the best sense — both halves preserved."],
      ["Wine inside an earth family", "Wine reads as a red-earth (bottle, leather, oxblood) more than as a chromatic red. In the warm-earth wedge it sits at the red end; with Clay next to it the family reads coherent."],
      ["The Cream trade",    "Same as Palette M — Cream needs ink-on-cream knockout at small scale. Worth the pose to keep the lightness ladder."],
      ["J/J collision",      "Same as M — Jack-Oat vs Jane-Cream, defended by 21 lightness points."],
      ["Boys-only check",    "Reads as a wine cellar / leather workshop. None gendered."],
      ["Girls-only check",   "Same reading."],
      ["Tone",               "Hay leather with a single bottled-pigment accent. The bridge between rounds 5 and 8."],
    ],
  },
};

// =============================================================
// PALETTE O · EARTH WIDE
// Single family but stretched chromatically — a wider "leather sample
// card" with one bone-light, one camel, one terracotta, one walnut.
// More chromatic confidence than M, but still all earth.
// =============================================================
const PALETTE_O = {
  id: "earth-wide",
  kicker: "PALETTE O",
  title: "Earth · Wide",
  tagline: "Same family, more chroma. Bone / Camel / Terracotta / Walnut.",
  audit: {
    chroma:      "C 0.04 / 0.09 / 0.11 / 0.08 — wider chromatic range, terracotta the peak.",
    value:       "L 82 / 70 / 52 / 32 — strict ladder.",
    temperature: "Warm throughout, with Walnut pulled cooler at the dark end.",
    territories: "BONE · CAMEL · TERRACOTTA · WALNUT — four leather grades.",
  },
  family: {
    leo:  { fill: "#3E2D1F", name: "Walnut",     territory: "walnut",     territoryShort: "WALNUT",
            note: "Walnut wood, hue 30°, C 0.08, L 32. Dark-cool brown — anchors the family at the dark end. The grain-rich leather color." },
    max:  { fill: "#B45A3C", name: "Terracotta", territory: "terracotta", territoryShort: "TERRACOTTA",
            note: "Terracotta, hue 30°, C 0.11, L 52. The chromatic peak of the palette. Risk: Geo orange. Defense: 20° hue separation (Geo 50°) and 60% the chroma. Reads as fired tile, not as label." },
    jack: { fill: "#C99A66", name: "Camel",      territory: "camel",      territoryShort: "CAMEL",
            note: "Camel leather, hue 60°, C 0.09, L 70. Warm-light with confidence — more chromatic than Oat, less than Terracotta." },
    jane: { fill: "#E8D9BE", name: "Bone",       territory: "bone",       territoryShort: "BONE",
            note: "Bone, hue 70°, C 0.04, L 82. Lightest position. Quieter than Camel; reads as ivory, parchment, raw paper." },
  },
  rationale: {
    headline: "Walnut / Terracotta / Camel / Bone — wider earth, more chroma.",
    move: "The leather-sample-card answer. Same single family direction, but the chromatic range opens up — Terracotta at C 0.11 is the peak, Bone at C 0.04 the quietest. The set reads as four grades of leather or four glazed tiles: same studio, different fabrics. Lightness ladder 32 / 52 / 70 / 82. The two J's split: Jack-Camel (warm chromatic mid-light) vs Jane-Bone (warm quiet light) — distinguished by both chroma (0.09 vs 0.04) and lightness (70 vs 82).",
    constraints: [
      ["1 · Hue territory",
       "All four warm-earth, hue 30–70°. Terracotta is the riskiest at C 0.11 vs Geo's C 0.18 — defended by 60% the chroma and 20° hue separation."],
      ["2 · Gender-neutral",
       "Bone / Camel / Terracotta / Walnut. Leather grades. None gender-coded."],
      ["3 · No internal pairing",
       "Walnut and Terracotta share hue 30° but split by 20 lightness points. Camel and Bone share warm-light but split by 12 lightness AND 5 chroma points. The set is four-way separated by the lightness × chroma pair."],
      ["4 · Visual equity",
       "Terracotta is the chromatic peak; Bone the quietest. Both colored. Bone at L 82 needs ink-knockout at 20×20 — same trade as M and N. Walnut at L 32 holds white-knockout."],
    ],
    bullets: [
      ["Why this lands",     "More chromatic confidence than M while staying in family. The leather card is a recognised reference; the parent reads the set immediately."],
      ["Terracotta as anchor","Replaces Wine as the chromatic peak — orange-red rather than blue-red. Trades anchor color but keeps anchor function."],
      ["The wide chroma bet","C 0.04–0.11 spans nearly 3× — wider than M (1.5×) or N (2×). Bone vs Terracotta side by side has clear chromatic differentiation."],
      ["J/J collision",      "Jack-Camel vs Jane-Bone — both warm-light, distinguished by chroma differential (0.09 vs 0.04). The chip-scale test holds because Camel reads chromatic and Bone reads near-neutral."],
      ["Boys-only check",    "Reads as a tannery sample. None gendered."],
      ["Girls-only check",   "Same. Bone is parchment, not blush."],
      ["Tone",               "Hay leather card, expanded. The most chromatically confident single-family palette."],
    ],
  },
};

const PALETTES_R8 = [PALETTE_M, PALETTE_N, PALETTE_O];

// =============================================================
// SHARED COMPONENTS
// =============================================================

// Cream and Bone need ink-knockout at small scale; the other colors
// take white-knockout. This util chooses per-token.
function letterColorR8(token) {
  // Lightness threshold: any color above L≈75 needs ink letters.
  const HEX_TO_L = {
    "#EBDDC2": 86, "#E8D9BE": 82, "#C9A878": 65, "#C99A66": 70,
    "#A36A50": 50, "#B45A3C": 52, "#3D2A1E": 30, "#3E2D1F": 32,
    "#5C1F30": 26,
  };
  const L = HEX_TO_L[token.fill] ?? 50;
  return L > 72 ? "#0C1020" : "#FAFAFA";
}

function SubjectR8({ subject, scale = 1, dense = false }) {
  const s = SUBJECTS_R8[subject];
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

function ChildR8({ kid, palette, size = 18, hideName = false }) {
  const t = palette.family[kid.id];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
      <span style={{
        width: size, height: size,
        borderRadius: Math.round(size * 0.22),
        background: t.fill,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        fontFamily: "Plus Jakarta Sans", fontStyle: "italic", fontWeight: 600,
        fontSize: Math.round(size * 0.61), color: letterColorR8(t), lineHeight: 1, flexShrink: 0,
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

function ChildChipR8({ kid, palette, size = 18 }) {
  const t = palette.family[kid.id];
  return (
    <span style={{
      width: size, height: size,
      borderRadius: Math.round(size * 0.22),
      background: t.fill,
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Plus Jakarta Sans", fontStyle: "italic", fontWeight: 600,
      fontSize: Math.round(size * 0.61), color: letterColorR8(t), lineHeight: 1, flexShrink: 0,
    }}>{kid.initial}</span>
  );
}

Object.assign(window, {
  SUBJECTS_R8, PALETTES_R8, PALETTE_M, PALETTE_N, PALETTE_O,
  SubjectR8, ChildR8, ChildChipR8, letterColorR8,
});
