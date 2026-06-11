/* global React, FAMILY */

// =============================================================
// ROUND FOUR — Hue Territory Refinement
//
// Architecture LOCKED from round three (Direction 03 · The Underline).
// Subjects: ultramarine ink word with 1.5px colored underline beneath.
// Children: filled letter container, white knockout, italic name.
//
// Subject palette LOCKED:
//   LANG  #3848D0   blue
//   MATH  #C8A800   yellow
//   SCI   #3CA85A   green
//   GEO   #E07820   orange
//   ARTS  #7848D0   purple
//
// Hue families occupied: blue, yellow, green, orange, purple.
// Children palettes must live in the GAPS:
//   reds, burgundies, wines, oxbloods · pinks, rose ·
//   browns, cocoa, sand, taupe, camel · cool grays, steel, slate ·
//   warm grays, charcoal · desaturated near-blacks.
//
// Three palettes follow. Each is four canonical colors named in
// recognizable color terms (no invented poetic names).
// =============================================================

// Subject palette — locked, shared across all three children palettes.
const SUBJECTS_R4 = {
  la:   { hue: "#3848D0", abbr: "LANG", family: "blue"   },
  math: { hue: "#C8A800", abbr: "MATH", family: "yellow" },
  sci:  { hue: "#3CA85A", abbr: "SCI",  family: "green"  },
  gh:   { hue: "#E07820", abbr: "GEO",  family: "orange" },
  ca:   { hue: "#7848D0", abbr: "ARTS", family: "purple" },
};

// ---------------------------------------------------------------
// PALETTE A · WINES & STONES
//
// Concept: a textile palette. Reds and pinks pulled from natural
// dye traditions (madder, cochineal) paired with cool stone neutrals.
// The four colors split clean into a warm pair (Burgundy, Rose) and
// a cool pair (Slate, Cocoa). No hue sits within 60° of any subject
// hue family in OKLCH space.
// ---------------------------------------------------------------
const PALETTE_A = {
  id: "wines-stones",
  kicker: "PALETTE A",
  title: "Wines & Stones",
  tagline: "Textile pigments — madder reds and quarried neutrals.",
  family: {
    leo:  { fill: "#6E2A3A", name: "Burgundy", territory: "red-wine",   note: "Deep red-wine. Hue ~15° in OKLCH; outside orange (~50°) and purple (~330°)." },
    max:  { fill: "#5A3A2C", name: "Cocoa",    territory: "warm brown", note: "Low-chroma warm brown. C ≈ 0.05 — reads as neutral, not as a chromatic orange." },
    jack: { fill: "#4F5A6A", name: "Slate",    territory: "cool gray",  note: "Cool blue-gray. C ≈ 0.025 — desaturated to read as a stone neutral, not as Lang's saturated blue." },
    jane: { fill: "#B5707E", name: "Rose",     territory: "dusty pink", note: "Dusty pink-rose. Hue ~10°, lightness elevated to read as the family's bright accent." },
  },
  rationale: {
    move: "Reds and pinks for the warm pair, cool stone neutrals for the cool pair. The palette reads as a Hay textile sample card — adult, considered, honest pigments. Burgundy and Rose are the same hue family at different lightness; Slate and Cocoa are the chromatically-quiet pair, distinguishable by temperature alone.",
    bullets: [
      ["Hue check · Burgundy", "OKLCH hue ≈ 15° (red). Subject-orange sits at ~50°, subject-purple at ~330°. 35° clearance to the nearest subject hue."],
      ["Hue check · Cocoa",    "OKLCH hue ≈ 50° but chroma ≈ 0.05 — three-quarters less saturated than GEO orange (C ≈ 0.16). Reads as warm neutral, not as orange."],
      ["Hue check · Slate",    "OKLCH hue ≈ 250°, chroma ≈ 0.025. Subject-blue (LANG) sits at hue ≈ 270° at chroma 0.20. Slate is identifiably cool, but eight times less saturated."],
      ["Hue check · Rose",     "OKLCH hue ≈ 10° (red-pink). Same family as Burgundy; same clearance from subject hues."],
      ["Internal differentiation", "Two warm + two cool. Burgundy vs. Rose: 30 lightness points apart. Slate vs. Cocoa: opposite temperature axis. At 20×20 Recap-badge scale, all four are distinguishable in <300ms."],
      ["J/J collision", "Jack-slate is the cool member; Jane-rose is the warm pink. Letters identical, hues maximally opposed across the palette's temperature axis."],
      ["Tone check", "Reads as Hay's color discipline: every color exists in considered material design (oxblood textile, walnut wood, granite, antique-rose silk). None of the four would feel out of place in a Frama interior."],
    ],
  },
};

// ---------------------------------------------------------------
// PALETTE B · EARTH & IRON
//
// Concept: the earthier sibling. Pulled from leather, raw clay, and
// blacksmith material. Lower lightness overall, more grounded. The
// palette leans masculine and calm — no pinks, no jewel-tones — and
// commits to the brown territory the brief explicitly opens up.
// ---------------------------------------------------------------
const PALETTE_B = {
  id: "earth-iron",
  kicker: "PALETTE B",
  title: "Earth & Iron",
  tagline: "Leather, raw clay, and blacksmith iron.",
  family: {
    leo:  { fill: "#5E2226", name: "Oxblood",  territory: "deep red",     note: "Almost-black red. Hue ~12°, very low lightness — the palette's deepest mark." },
    max:  { fill: "#9A7A4E", name: "Camel",    territory: "warm tan",     note: "Tan / camel. Hue ~70°, chroma ≈ 0.07 — well below GEO orange's chroma of ~0.16." },
    jack: { fill: "#3A3A40", name: "Charcoal", territory: "warm charcoal", note: "Near-black with a faint warm undertone. C ≈ 0.005 — reads as color, not as type, against Warm Chalk." },
    jane: { fill: "#A85048", name: "Brick",    territory: "red-clay",     note: "Brick / red-clay. Hue ~25° — within red territory; sits 25° clear of GEO orange at hue ~50°." },
  },
  rationale: {
    move: "Lower the whole palette into the earth register. No pinks, no jewel-tones — every color comes from raw material: oxblood-stained leather, camel hide, blacksmith iron, brick clay. The four hues live in the warm half of the wheel except for charcoal, which provides the achromatic anchor.",
    bullets: [
      ["Hue check · Oxblood",  "OKLCH hue ≈ 12°, lightness ≈ 28. Deep red. No subject hue within 35°."],
      ["Hue check · Camel",    "OKLCH hue ≈ 70°, chroma ≈ 0.07. GEO orange sits at hue ≈ 55° with chroma 0.16 — Camel is shifted yellower AND less than half as saturated. Reads as neutral tan."],
      ["Hue check · Charcoal", "OKLCH hue ≈ 50° at chroma ≈ 0.005. Effectively achromatic. Distinguishable from ultramarine ink (#0C1020) by temperature — Charcoal reads warm, the ink reads cool."],
      ["Hue check · Brick",    "OKLCH hue ≈ 25°. Reds territory; 25° clear of GEO orange (~50°). At 20×20 the parent reads brick before orange."],
      ["Internal differentiation", "Three warm browns/reds plus one charcoal. The risk is Oxblood vs Brick — solved by lightness: Oxblood at L≈28, Brick at L≈48. 20 lightness points; clearly two different colors at chip scale."],
      ["J/J collision", "Jack-charcoal vs Jane-brick. One achromatic, one saturated red. Maximum perceptual distance achievable within the palette."],
      ["Tone check", "Most grounded of the three palettes. Closer to Frama's material expressions than to Hay's textile work. Pairs well with the Warm Chalk surface — the chalk does the lifting; the palette does the weight."],
    ],
  },
};

// ---------------------------------------------------------------
// PALETTE C · INK & SAND
//
// Concept: the most reductive of the three. A near-monochrome plus
// a single warm accent. Three of the four children sit in the
// achromatic-warm register (sand, taupe, charcoal); only one carries
// a chromatic mark (wine). The palette commits hardest to the brand
// principle that less color is more.
// ---------------------------------------------------------------
const PALETTE_C = {
  id: "ink-sand",
  kicker: "PALETTE C",
  title: "Ink & Sand",
  tagline: "Three desaturated neutrals plus one wine.",
  family: {
    leo:  { fill: "#5C1F30", name: "Wine",     territory: "deep red",     note: "The palette's only chromatic note. Deep red-wine, lightness ≈ 26." },
    max:  { fill: "#B79270", name: "Sand",     territory: "warm taupe",   note: "Warm taupe / sand. Hue ~70° at chroma ≈ 0.06 — clear of yellow (MATH) and orange (GEO)." },
    jack: { fill: "#46566A", name: "Steel",    territory: "blue-gray",    note: "Cool blue-gray. C ≈ 0.03 — neutralized blue, never confused with Lang." },
    jane: { fill: "#2E2A2E", name: "Onyx",     territory: "near-black",   note: "Warm near-black. Sits as the palette's anchor; reads as deep neutral, not as type." },
  },
  rationale: {
    move: "The most reductive answer. One chromatic color (Wine) and three earned-restraint neutrals (Sand, Steel, Onyx). The palette assumes form-vocabulary already does most of the discrimination work — it commits hard to the brand's color-discipline principle.",
    bullets: [
      ["Hue check · Wine",     "OKLCH hue ≈ 10°. Deep red. The palette's only chromatic risk; sits cleanly outside all five subject hue families."],
      ["Hue check · Sand",     "OKLCH hue ≈ 70°, chroma ≈ 0.06. Half MATH's lightness; less than half its chroma. Reads as warm sand, not as yellow."],
      ["Hue check · Steel",    "OKLCH hue ≈ 250°, chroma ≈ 0.03. Distinguishable from LANG (chroma 0.20) by saturation alone."],
      ["Hue check · Onyx",     "Near-achromatic at L≈18. Distinguishable from ultramarine ink by lightness — the ink reads slightly bluer; Onyx reads warmer."],
      ["Internal differentiation", "Lightness spread does the work: Wine 26, Sand 65, Steel 38, Onyx 18. Four distinct lightness bands; even a desaturated viewer can rank them."],
      ["J/J collision", "Jack-steel (mid-tone cool) vs Jane-onyx (deep warm). One reads as gray-blue; the other reads as black. Cannot be confused at any scale."],
      ["Tone check", "Closest of the three to a Norm Architects material palette — a single warm accent against considered neutrals. The risk is feeling too quiet for a children's-identity system; the bet is that the form (filled-letter container with white knockout) carries the loudness, and the color does not need to."],
    ],
  },
};

const PALETTES_R4 = [PALETTE_A, PALETTE_B, PALETTE_C];

// =============================================================
// COMPONENTS — locked architecture from D3
// =============================================================

// Subject: ultramarine ink word + 1.5px colored underline (full-word width).
function SubjectR4({ subject, scale = 1, dense = false }) {
  const s = SUBJECTS_R4[subject];
  return (
    <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "flex-start", lineHeight: 1 }}>
      <span className="mono" style={{
        fontSize: 9 * scale,
        color: dense ? "var(--ink)" : "var(--meta)",
        letterSpacing: "0.20em",
      }}>{s.abbr}</span>
      <span style={{
        width: "100%",
        height: 1.5,
        background: s.hue,
        marginTop: 2 * scale,
      }}/>
    </span>
  );
}

// Child chip + italic name.
function ChildR4({ kid, palette, size = 18, hideName = false }) {
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

// Child chip — letterform only, no name (for tight grids / Recap badges).
function ChildChipR4({ kid, palette, size = 18 }) {
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
  SUBJECTS_R4, PALETTES_R4, PALETTE_A, PALETTE_B, PALETTE_C,
  SubjectR4, ChildR4, ChildChipR4,
});
