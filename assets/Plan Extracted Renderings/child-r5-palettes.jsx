/* global React, FAMILY */

// =============================================================
// ROUND FIVE — FOUR CONSTRAINTS, ONE PALETTE
//
// Architecture, form pairing, subject palette, and surface tokens
// are all locked. This round produces the final children palette.
//
// THE FOUR CONSTRAINTS (each color must hold all four):
//   1. Hue territory — outside blue / yellow / green / orange / purple.
//   2. Gender-neutral — no rose/pink/fuchsia; not all-dark/military.
//   3. No internal hue-family pairing — each child a DIFFERENT territory.
//   4. Visual equity — every child gets a colored container; no near-black.
//
// AVAILABLE TERRITORIES (one slot each):
//   · Reds, burgundies, wines, oxbloods
//   · Browns, cocoa, espresso, taupe, camel, sand
//   · Cool grays, slate, steel, blue-gray
//   · Warm grays, charcoal, pewter (must read colored, not black)
//   · Bronzes, ambers (desaturated, clear of Math/Geo)
// =============================================================

const SUBJECTS_R5 = {
  la:   { hue: "#3848D0", abbr: "LANG", family: "blue"   },
  math: { hue: "#C8A800", abbr: "MATH", family: "yellow" },
  sci:  { hue: "#3CA85A", abbr: "SCI",  family: "green"  },
  gh:   { hue: "#E07820", abbr: "GEO",  family: "orange" },
  ca:   { hue: "#7848D0", abbr: "ARTS", family: "purple" },
};

// ---------------------------------------------------------------
// PALETTE D · THE QUARTET
//
// Four hue territories: red · brown · cool-gray · bronze.
// The "classic" answer — each child a recognized considered color.
// Tonally: two warm darks (Burgundy, Cocoa), one cool mid (Slate),
// one warm mid (Bronze). Reads as a Hay sample card or a Frama
// material library — adult, intentional, considered.
// ---------------------------------------------------------------
const PALETTE_D = {
  id: "quartet-classic",
  kicker: "PALETTE D",
  title: "The Quartet",
  tagline: "Four hue territories, one considered set.",
  family: {
    leo:  { fill: "#6E2A3A", name: "Burgundy", territory: "red",        territoryShort: "RED",        note: "Red-wine territory. OKLCH hue ≈ 15°, chroma ≈ 0.10. Sits 35° clear of orange (50°), 45° clear of purple (330°)." },
    max:  { fill: "#5A3A2C", name: "Cocoa",    territory: "brown",      territoryShort: "BROWN",      note: "Warm dark brown. Hue ~50° at chroma ≈ 0.05 — three-quarters less saturated than GEO orange. Reads as material brown, not as orange." },
    jack: { fill: "#4F5A6A", name: "Slate",    territory: "cool-gray",  territoryShort: "COOL GRAY",  note: "Cool blue-gray stone. Hue ~250° at chroma ≈ 0.025 — eight times less saturated than LANG. Distinguishably cool, but neutral, not chromatic." },
    jane: { fill: "#956B3A", name: "Bronze",   territory: "bronze",     territoryShort: "BRONZE",     note: "Antique bronze. Hue ~65° at chroma ≈ 0.075. Sits between MATH yellow (95°) and GEO orange (50°), at half their chroma — reads as aged metal, not as a saturated hue." },
  },
  rationale: {
    headline: "Burgundy / Cocoa / Slate / Bronze.",
    move: "Four different hue territories, each occupying one of the brief's available slots. Two warm darks anchor the family (Burgundy and Cocoa), one cool mid carries the achromatic axis (Slate), and Bronze adds a warm mid that breaks the dark pairing without reaching into pink, rose, or any gender-coded register. Each color is a noun a parent already owns — not a poetic invention.",
    constraints: [
      ["1 · Hue territory",        "All four sit outside subject hue families. Burgundy in red (35° from orange), Cocoa at hue 50° but desaturated by ¾ vs GEO, Slate is essentially achromatic-cool, Bronze sits between MATH and GEO at half their chroma."],
      ["2 · Gender-neutral",       "Burgundy reads as wine/leather. Cocoa as wood/coffee. Slate as stone. Bronze as metal/amber. Every color is a material noun used across cultures and genders. No rose, no pink, no military combo."],
      ["3 · No hue pairing",       "Four distinct territories: RED, BROWN, COOL-GRAY, BRONZE. No two children share a family. Burgundy is the only red; Bronze is yellow-shifted enough not to read as red-cousin."],
      ["4 · Visual equity",        "Lightnesses: Burgundy 30, Cocoa 30, Slate 42, Bronze 50. All chromatic, all colored containers. No child is the dark/colorless one — Bronze is the lightest but Slate balances cool, and Cocoa carries weight equal to Burgundy."],
    ],
    bullets: [
      ["The trap avoided",        "Round-four Onyx (near-black) made Jane visually unequal. Round-five Bronze gives Jane a warm metallic that reads as confidently as Burgundy reads warm-red — equal weight, different temperature."],
      ["Internal differentiation", "Two darks + two mids, with the darks split by hue (red vs brown) and the mids split by temperature (cool slate vs warm bronze). At Recap-badge scale (20×20) all four resolve in <300ms — temperature and lightness do most of the work, hue confirms."],
      ["J/J collision",            "Jack-slate vs Jane-bronze. Cool achromatic vs warm chromatic. Maximum perceptual distance achievable inside the four-territory system."],
      ["Boys-only family check",   "Four-boys configuration: Burgundy / Cocoa / Slate / Bronze. Reads as four different leather-and-metal swatches. None gendered."],
      ["Girls-only family check",  "Four-girls configuration: identical palette. None of the colors lean masculine; none lean feminine. Every color is material-coded, not gender-coded."],
      ["Single-child check",       "Any one of the four works as a solo identity. Bronze is the most distinctive on its own; Slate is the quietest. All hold."],
      ["Tone",                    "Hay textile + Frama material. The palette feels considered, not generated. Each color earned its slot by occupying a territory the others don't."],
    ],
  },
};

// ---------------------------------------------------------------
// PALETTE E · THE QUARTET (warm-gray variant)
//
// Four hue territories: red · sand (brown light end) ·
// cool-gray · warm-gray. The lighter, airier sibling to D.
// Two mid-tones, one dark, one light — a wider lightness spread.
// Tonally calmer; reads as Norm Architects' material expressions.
// ---------------------------------------------------------------
const PALETTE_E = {
  id: "quartet-airy",
  kicker: "PALETTE E",
  title: "The Quartet · Light",
  tagline: "Wider lightness range — same four territories, different mood.",
  family: {
    leo:  { fill: "#5C1F30", name: "Wine",     territory: "red",        territoryShort: "RED",        note: "Deep red-wine. OKLCH hue ≈ 10°, lightness ≈ 26 — the palette's chromatic anchor. Outside orange (50°) and purple (330°) by 40° in either direction." },
    max:  { fill: "#B79270", name: "Sand",     territory: "brown",      territoryShort: "BROWN",      note: "Warm taupe / sand — the light end of brown territory. Hue ~70° at chroma ≈ 0.06. Half MATH's chroma, well clear of GEO." },
    jack: { fill: "#46566A", name: "Steel",    territory: "cool-gray",  territoryShort: "COOL GRAY",  note: "Cool steel-blue gray. Hue ~250° at chroma ≈ 0.03 — neutralized blue, never confused with LANG's chroma 0.20." },
    jane: { fill: "#6A655E", name: "Pewter",   territory: "warm-gray",  territoryShort: "WARM GRAY",  note: "Pewter — warm gray with a faint olive-brown undertone. Hue ~70° at chroma ≈ 0.012 — reads as a colored gray, not as black or as a cousin of Sand." },
  },
  rationale: {
    headline: "Wine / Sand / Steel / Pewter.",
    move: "Same four-territory logic as Palette D, calibrated for a wider lightness range and a quieter overall register. Wine is the chromatic anchor; Sand the warm light; Steel the cool mid; Pewter the warm mid that splits brown from cool-gray without overlapping either. The palette breathes more — it sits closer to Norm Architects' material work than to Hay's textile saturations.",
    constraints: [
      ["1 · Hue territory",        "All four outside subject hue families. Wine in deep red, Sand at hue 70° but C 0.06 vs MATH C 0.16, Steel achromatic-cool, Pewter at C 0.012 — effectively a colored neutral."],
      ["2 · Gender-neutral",       "Wine reads as bottle/leather. Sand reads as natural stone or unbleached linen. Steel as oxidized metal. Pewter as the same metal aged. No feminine-coded hues, no military monochrome."],
      ["3 · No hue pairing",       "Four distinct territories: RED, BROWN, COOL-GRAY, WARM-GRAY. Sand and Pewter share neither — Sand is chromatic warm at L 65, Pewter is desaturated warm at L 45 with an olive cast that reads as gray, not as a brown sibling."],
      ["4 · Visual equity",        "Lightnesses: Wine 26, Pewter 45, Steel 38, Sand 65. Wine is darkest but unmistakably colored (chroma ≈ 0.10 — the palette's saturation peak). Pewter is intentionally lifted off black — it is the colored gray, not the dark one."],
    ],
    bullets: [
      ["Why two palettes",         "D and E hit the same four-territory target with different temperaments. D leans saturated and warm; E leans desaturated and airy. The choice is mood, not correctness."],
      ["The Pewter judgment",      "Pewter at L 45 is the deliberate fix for round-four Onyx. It carries enough warm undertone to feel chromatic at chip scale, but lives in the warm-gray slot the brief opens — not the near-black one the brief rules out."],
      ["Internal differentiation", "Lightness does the heavy lifting: 26 / 38 / 45 / 65, four distinct bands. Even desaturated viewers can rank the four. Hue (Wine red vs Sand warm vs Steel cool) confirms once lightness has placed."],
      ["J/J collision",            "Jack-steel vs Jane-pewter. Cool gray vs warm gray. Same desaturation register, opposite temperature axis — the cleanest possible same-letter resolution inside a quiet palette."],
      ["Boys-only family check",   "Four-boys configuration: Wine / Sand / Steel / Pewter. Reads as four geological samples. None gendered."],
      ["Girls-only family check",  "Same palette holds. Sand and Pewter are linen/stone neutrals; Wine is bottle-deep; Steel is gunmetal. None coded feminine, none coded masculine."],
      ["Single-child check",       "Wine works as a solo chromatic identity. Pewter and Steel are the quietest — fine for siblings inside a four-color set, but in a single-child family the parent might prefer Wine or Sand. Worth surfacing at onboarding."],
      ["Tone",                    "Norm Architects material library. Frama natural-pigment expressions. The palette is restrained without being washed out — the chromatic energy lives in Wine; the others carry the weight quietly."],
    ],
  },
};

const PALETTES_R5 = [PALETTE_D, PALETTE_E];

// =============================================================
// COMPONENTS — locked architecture (D3 form pairing)
// =============================================================

function SubjectR5({ subject, scale = 1, dense = false }) {
  const s = SUBJECTS_R5[subject];
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

function ChildR5({ kid, palette, size = 18, hideName = false }) {
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

function ChildChipR5({ kid, palette, size = 18 }) {
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
  SUBJECTS_R5, PALETTES_R5, PALETTE_D, PALETTE_E,
  SubjectR5, ChildR5, ChildChipR5,
});
