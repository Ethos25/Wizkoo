/* global React */

// =============================================================
// ROUND NINE — EIGHT-SUBJECT REALITY
//
// Three substantive corrections from prior rounds:
//   · Math is teal (#18A0B8 Polar), not yellow.
//   · Geo & History is red (#C83030 Vermilion), not orange.
//   · Eight subjects total, two TBD.
//
// All prior reds collided with Vermilion.
// All prior teals would collide with Polar.
// Single Earth (v8 Palette M) survives — it's the floor, refined here.
// Two other palettes push into different gradient families.
// =============================================================

const SUBJECTS_R9 = {
  la:    { hue: "#3848D0", abbr: "LANG",   family: "blue",     name: "Ink"      },
  math:  { hue: "#18A0B8", abbr: "MATH",   family: "teal",     name: "Polar"    },
  sci:   { hue: "#38B060", abbr: "SCI",    family: "green",    name: "Malachite"},
  gh:    { hue: "#C83030", abbr: "GEO",    family: "red",      name: "Vermilion"},
  ca:    { hue: "#8848E0", abbr: "ARTS",   family: "purple",   name: "Amethyst" },
  pe:    { hue: "#F08A20", abbr: "PE",     family: "orange",   name: "Ember"    },
  wl:    { hue: "#B8B0A8", abbr: "WL?",    family: "tbd",      name: "TBD"      },
  ls:    { hue: "#B8B0A8", abbr: "LS?",    family: "tbd",      name: "TBD"      },
};

// =============================================================
// PALETTE P · SINGLE EARTH REFINED — THE FLOOR
// v8 Palette M with the cream-slot fix. Cream had no chromatic
// presence against Warm Chalk; replaced with Fawn — warm light
// at higher chroma so all four containers hold equal weight.
// =============================================================
const PALETTE_P = {
  id: "single-earth-refined",
  kicker: "PALETTE P",
  title: "Single Earth · Refined",
  tagline: "Cocoa · Clay · Camel · Fawn. The floor, with chromatic equity at every position.",
  semantic: "INCLUSION · skin-tone-evocative gradient, deep to light, chromatic at every position",
  audit: {
    chroma:      "C 0.06 / 0.09 / 0.085 / 0.07 — matched mid-low; no near-neutral.",
    value:       "L 30 / 50 / 66 / 80 — strict ladder, four bands, ≥ 14 L gap.",
    temperature: "Warm throughout. Hue progression 25° → 35° → 60° → 65° in the warm-earth wedge.",
    territories: "COCOA · CLAY · CAMEL · FAWN — four leather grades.",
  },
  family: {
    leo:  { fill: "#3D2A1E", name: "Cocoa", territory: "deep-brown",  territoryShort: "COCOA",
            note: "Deep brown, hue 25°, C 0.06, L 30. Anchor. Reads as leather/espresso. Far from Vermilion (red, C 0.18) and Ember (orange, C 0.18) by chroma." },
    max:  { fill: "#A36A50", name: "Clay",  territory: "fired-clay",  territoryShort: "CLAY",
            note: "Fired clay, hue 35°, C 0.09, L 50. The mid chromatic peak. Defended from Ember orange (50°, C 0.18) by 15° hue and half the chroma. Defended from Vermilion red (15°, C 0.18) by 20° hue and half the chroma." },
    jack: { fill: "#C99A66", name: "Camel", territory: "camel",       territoryShort: "CAMEL",
            note: "Camel leather, hue 60°, C 0.085, L 66. Warm-light with confidence. Replaces v8's quieter Oat — more chromatic identity, holds equity against the others." },
    jane: { fill: "#E0C390", name: "Fawn",  territory: "warm-fawn",   territoryShort: "FAWN",
            note: "Fawn — hue 65°, C 0.07, L 80. The cream-slot fix. v8's Cream (C 0.05, L 86) read as absence against #F8F4E9 chalk; Fawn (C 0.07, L 80) holds chromatic presence. White-knockout letters work cleanly." },
  },
  rationale: {
    headline: "The floor, refined. Equal chromatic weight at every position.",
    move: "v8 Palette M was the strongest single direction across all rounds — but Cream at L 86 read as absence of color against the Warm Chalk surface, breaking visual equity. Round nine fixes that: Cream becomes Fawn (#E0C390, L 80, C 0.07). All four containers now carry chromatic identity at glance speed. The lightness ladder remains strict (30 / 50 / 66 / 80), the warm-earth hue wedge remains the system. The set still reads as a Hay leather card; now it also passes constraint 4 cleanly. Inclusion semantic preserved — the deep-to-light gradient still maps to skin-tone range, with chromatic presence at every position.",
    constraints: [
      ["1 · Hue territory · 8 subjects",
       "All four sit at hue 25–65° in warm-earth, C 0.06–0.09. Closest collisions: Ember orange (50° at C 0.18) and Vermilion red (15° at C 0.18). Defense is chroma — every children color is at less than half each subject's saturation. Far from Polar teal (190°), Malachite green (140°), Ink blue (250°), Amethyst purple (270°)."],
      ["2 · Gender-neutral",
       "Cocoa / Clay / Camel / Fawn — leather and material nouns. None gender-coded; warm-earth register is neutral by tradition."],
      ["3 · No internal pairing",
       "Lightness ladder: 30 / 50 / 66 / 80 — every gap ≥ 14 L points. Hue progression: 25° / 35° / 60° / 65° — each color sits at a different position in the warm-earth wedge. Closest pairing: Camel-Fawn (5° hue gap) — defended by 14 L points and chroma differential (0.085 vs 0.07). Camel reads chromatic, Fawn reads softer."],
      ["4 · Visual equity",
       "The fix. Fawn at C 0.07 carries chromatic presence; not an absent-of-color cream. All four containers hold equal weight at glance. White-knockout letters work on all four (lightness check below)."],
    ],
    tbdReasoning: "If World Languages or Life Skills claim true yellow (60°), gold, pink, or coral, defense holds because the children palette sits at low chroma (≤ 0.09) — any saturated subject color reads brighter and more label-like. Risk: a low-chroma neutral subject (taupe, sand, oat) — unlikely as a subject color since subjects need bright hue identity.",
    inclusion: "Skin-tone gradient: Cocoa (deep), Clay (medium-warm), Camel (light-warm), Fawn (palest). Each position has chromatic presence — none reads as 'white' or 'absence of color.' The semantic is intact and preserved against v8.",
    bullets: [
      ["Why this lands",     "The strongest direction across nine rounds, with the equity fix. Single-family palettes have a coherence mixed-family ones cannot reach."],
      ["The Fawn move",      "v8's Cream (#EBDDC2, L 86) read as paper, not as a color. Fawn (#E0C390, L 80) reads as a color — pale leather, warm parchment with pigment."],
      ["Inclusion held",     "The four-position gradient still maps to skin-tone range. The semantic is preserved."],
      ["Eight-subject defense", "All four colors at hue 25–65°, C 0.06–0.09. Far from every current subject hue family."],
      ["Boys-only check",    "Reads as a leather workshop, woodshop, ceramic studio. None gendered."],
      ["Girls-only check",   "Same. No pinks, no blush; warm earth is gender-traditional-neutral."],
      ["Tone",               "Hay leather card. The most family-coherent palette; now with full chromatic equity."],
    ],
  },
};

// =============================================================
// PALETTE Q · AUBERGINE GARDEN
// Brown-purple to greige: rooted in earth but pulled into the
// aubergine/mushroom register. Different gradient family;
// inclusion semantic still holds (deep brown-purple → light greige
// reads as one earth).
// Defended against Amethyst purple (#8848E0) by brown-shift and
// value-darkening; Aubergine reads as eggplant, not as label-purple.
// =============================================================
const PALETTE_Q = {
  id: "aubergine-garden",
  kicker: "PALETTE Q",
  title: "Aubergine Garden",
  tagline: "Aubergine · Mulberry · Mushroom · Greige. Considered beauty in a brown-purple register.",
  semantic: "CONSIDERED BEAUTY · the kitchen garden at dusk; a registers of dyed wools and dried herbs",
  audit: {
    chroma:      "C 0.06 / 0.07 / 0.04 / 0.03 — restrained throughout; greige nearly neutral.",
    value:       "L 28 / 48 / 65 / 80 — strict ladder, ≥ 15 L gap.",
    temperature: "Warm-cool axis. Aubergine and Mulberry pull cool; Mushroom and Greige pull neutral. Held together by low chroma.",
    territories: "AUBERGINE · MULBERRY · MUSHROOM · GREIGE — four positions in the brown-purple wedge.",
  },
  family: {
    leo:  { fill: "#3A2A38", name: "Aubergine", territory: "brown-purple", territoryShort: "AUBERGINE",
            note: "Brown-purple, hue 320°, C 0.06, L 28. Far darker than Amethyst (L 50, C 0.16) — defended by 22 L points and 60% lower chroma. Reads as eggplant skin, not as purple label." },
    max:  { fill: "#7E4858", name: "Mulberry",  territory: "warm-plum",    territoryShort: "MULBERRY",
            note: "Warm plum, hue 350°, C 0.07, L 48. Risk: Vermilion red (15° at C 0.18). Defense: 25° hue (toward purple), 60% lower chroma; Mulberry reads as dried-flower, not as label-red." },
    jack: { fill: "#A89888", name: "Mushroom",  territory: "warm-greige",  territoryShort: "MUSHROOM",
            note: "Warm greige, hue 60°, C 0.04, L 65. Connector — sits between the cool-darks and the warm-light. The 'mushroom' reading; warm enough to defend from Polar teal (190° at C 0.10)." },
    jane: { fill: "#D8CCB8", name: "Greige",    territory: "light-greige", territoryShort: "GREIGE",
            note: "Light greige, hue 65°, C 0.03, L 80. Quiet. Risk: low chroma may read as absence — but warmer than #F8F4E9 chalk by enough to register as a color. Tested in Recap badge below." },
  },
  rationale: {
    headline: "A garden at dusk. Aubergine to greige; brown-purple to warm-grey.",
    move: "A genuinely different gradient family from Earth — Aubergine sits in brown-purple territory (320° hue) and the palette walks across to greige. The semantic is *considered beauty*: a French country palette of dried herbs, eggplant skin, dyed wools. Inclusion isn't the foreground semantic but isn't excluded — the deep-to-light range still maps gently to skin-tone latitudes. The defense against Amethyst purple is hue-shift (Aubergine is brown-leaning at 320°, Amethyst is true purple at 280°) and severe chroma differential (0.06 vs 0.16). The defense against Vermilion red is similar — Mulberry sits at 350° (purple-leaning), C 0.07 vs Vermilion's C 0.18.",
    constraints: [
      ["1 · Hue territory · 8 subjects",
       "Aubergine 320° + Mulberry 350° vs Amethyst 280° (40° gap) and Vermilion 15° (25° gap). Both children are at less than half subject chroma. Mushroom and Greige sit in the warm-neutral zone — far from all subjects. Open question: a TBD subject claiming pink (340°) would create pressure on Mulberry — but pink at high chroma reads label-pink, not Mulberry's dried-flower register."],
      ["2 · Gender-neutral",
       "Aubergine, Mulberry, Mushroom, Greige — material and culinary nouns. Aubergine is gender-neutral in European register; the worry would be Mulberry tipping feminine, but at L 48 and dried-flower chroma it reads as dye-vat, not as blush."],
      ["3 · No internal pairing",
       "Lightness ladder: 28 / 48 / 65 / 80 — every gap ≥ 15 L. Hue progression: 320° / 350° / 60° / 65°. Aubergine and Mulberry share the cool-dark register but split by 20 L points; Mushroom and Greige share warm-light but split by 15 L AND chroma differential (0.04 vs 0.03 — Mushroom reads as a color, Greige reads near-neutral)."],
      ["4 · Visual equity",
       "Aubergine and Mulberry hold full chromatic identity. Mushroom holds at C 0.04. Greige at C 0.03 is the riskiest — defended at the Recap-badge scale by warmth differential against #F8F4E9 chalk."],
    ],
    tbdReasoning: "Most exposed to: a TBD subject claiming pink/rose (340°) — would pressure Mulberry. Defense is chroma differential; subject pinks would be at C 0.15+ for label-recognition, Mulberry stays at C 0.07. Less exposed to: yellow, gold, coral subjects (all far from the brown-purple wedge).",
    inclusion: "Inclusion isn't the primary semantic but isn't excluded. The dark-to-light gradient maps loosely to skin-tone latitude with brown-purple bias. *Considered beauty* — a garden at dusk — is the named semantic; multiracial inclusion is preserved as quiet undertone, not as foreground.",
    bullets: [
      ["Why this is different", "Genuinely outside Earth's wedge — the brown-purple register is its own territory. Not a refinement of Single Earth; a different answer."],
      ["The Mulberry bet",   "Mulberry at hue 350° is the riskiest move in the palette — closest to Vermilion. The bet is that 25° hue + half chroma is enough."],
      ["The Greige risk",    "Greige at C 0.03 walks close to absence-of-color. Recap-badge test will determine if it reads as a chip or as the chalk surface."],
      ["Boys-only check",    "Reads as kitchen-garden / dried herbs. None gendered; Mulberry is dye-vat, not blush."],
      ["Girls-only check",   "Same reading. Aubergine is firmly culinary."],
      ["Tone",               "Toast Living + Frama, the muted cool side. *Quiet adult palette* — the founder's brand voice."],
    ],
  },
};

// =============================================================
// PALETTE R · STONE & METAL
// Cool-warm gradient inspired by mineral cabinet stones —
// graphite, slate, sandstone, alabaster. A four-territory set
// (no single family). Carries a *children as material specimens*
// semantic — quiet, considered, adult.
// =============================================================
const PALETTE_R = {
  id: "stone-and-metal",
  kicker: "PALETTE R",
  title: "Stone & Metal",
  tagline: "Graphite · Brass · Sandstone · Alabaster. Mineral cabinet across cool/warm.",
  semantic: "CHILDREN AS SPECIMENS · a Wunderkammer drawer; quiet adult palette of natural materials",
  audit: {
    chroma:      "C 0.02 / 0.08 / 0.06 / 0.03 — Brass is the chromatic peak; the others restrained.",
    value:       "L 28 / 55 / 70 / 86 — strict ladder, ≥ 15 L gap.",
    temperature: "Cool-warm axis: Graphite cool, Brass warm-bright, Sandstone warm, Alabaster cool-neutral.",
    territories: "GRAPHITE · BRASS · SANDSTONE · ALABASTER — four mineral grades.",
  },
  family: {
    leo:  { fill: "#3A3D42", name: "Graphite",  territory: "cool-graphite", territoryShort: "GRAPHITE",
            note: "Graphite, hue 240°, C 0.02, L 28. Cool-dark anchor. Risk: pure black/near-black (constraint 4). Defense: hue 240° gives a perceptible cool tint; reads as pencil lead, not as void. Far from Ink blue (250° at C 0.18) by chroma." },
    max:  { fill: "#A88040", name: "Brass",     territory: "warm-brass",    territoryShort: "BRASS",
            note: "Warm brass, hue 65°, C 0.08, L 55. The chromatic peak — fills the visual-equity slot. Risk: Ember orange (50° at C 0.18). Defense: 15° hue (yellow-warm) and half chroma; Brass reads as metal, not as label-orange." },
    jack: { fill: "#D6B488", name: "Sandstone", territory: "warm-stone",    territoryShort: "SANDSTONE",
            note: "Warm sandstone, hue 60°, C 0.06, L 70. Light-warm. Mid-chroma; reads as eroded stone, dune. Holds against Polar teal (190°) by hue/temperature." },
    jane: { fill: "#E8E0D4", name: "Alabaster", territory: "cool-alabaster",territoryShort: "ALABASTER",
            note: "Cool alabaster, hue 75°, C 0.03, L 86. Lightest. Risk: absence-of-color. Defense: cool-warm contrast against the warm Sandstone above it gives a perceptible tint differential; tested at Recap-badge scale below." },
  },
  rationale: {
    headline: "A mineral cabinet. Four stones, two temperatures.",
    move: "Not a single family — a four-territory set held together by *material register*. Graphite (cool dark), Brass (warm chromatic peak), Sandstone (warm light), Alabaster (cool light). The semantic is *children as specimens* — a Wunderkammer drawer where each child is a stone or metal. Each color sits in a distinct hue/temperature/chroma slot. Brass at C 0.08 is the chromatic anchor — replaces what Wine/Bordeaux did in earlier rounds, but firmly outside both Vermilion (red) and Ember (orange) by hue and chroma. Inclusion semantic isn't the foreground (it's not a tonal-skin gradient), but the cool-warm balance preserves multiracial inclusion as material-pluralism rather than tone-pluralism.",
    constraints: [
      ["1 · Hue territory · 8 subjects",
       "Graphite 240° at C 0.02 — far from Ink (250° at C 0.18) by chroma. Brass 65° at C 0.08 — far from Ember (50° at C 0.18) by 15° hue + half chroma. Sandstone 60° at C 0.06 and Alabaster 75° at C 0.03 — both well outside subject chroma. Far from Polar teal, Malachite green, Vermilion red, Amethyst purple."],
      ["2 · Gender-neutral",
       "Graphite, Brass, Sandstone, Alabaster — mineral and material nouns. None gender-coded; the mineral-cabinet register is neutral by tradition."],
      ["3 · No internal pairing",
       "Lightness ladder: 28 / 55 / 70 / 86 — every gap ≥ 15 L. Hue+temperature: cool / warm / warm / cool. The cool-warm alternation breaks the warm-darks/cool-lights pairing risk; no two children share a temperature register at the same lightness band."],
      ["4 · Visual equity",
       "Brass at C 0.08 is the chromatic anchor. Graphite carries cool tint at C 0.02 — defended from pure-black by perceptible hue. Alabaster at C 0.03 is the riskiest — defended by cool-warm contrast against Sandstone."],
    ],
    tbdReasoning: "Open exposure: a TBD subject claiming gold or yellow (60°) would pressure Brass and Sandstone. Defense is chroma — Brass at 0.08 vs likely subject gold at 0.16+; Sandstone at 0.06. Less exposed: a TBD subject claiming pink, coral, or near-black — none of these collide with the mineral set.",
    inclusion: "Not a tone-gradient palette — children-as-stones rather than children-as-skin-tones. Inclusion preserved as *material pluralism*: cool and warm specimens together, no register privileged. Brand should know this is the trade — Earth-family inclusion semantic is given up in exchange for a different one.",
    bullets: [
      ["Why this is different", "Four-territory set, not single family. Stretches the constraints in a different direction — more chromatic confidence, no tonal-ladder dependency."],
      ["The Brass move",     "Brass replaces Wine as the chromatic anchor — yellow-warm rather than red. Avoids the Vermilion collision entirely."],
      ["The Graphite risk",  "Graphite at L 28 with C 0.02 walks toward near-black. The cool tint (240° hue) is the defense; tested in Today View clusters."],
      ["The Alabaster risk", "Alabaster at L 86 walks toward chalk-surface absence. The cool-warm contrast with Sandstone is the defense."],
      ["Boys-only check",    "Reads as a metallurgist's drawer. None gendered."],
      ["Girls-only check",   "Same. No pinks, no blush."],
      ["Tone",               "Wunderkammer / Hay metal collection. *Quiet adult palette*; specimen semantic; less skin-tone-evocative but maximally gender-neutral."],
    ],
  },
};

const PALETTES_R9 = [PALETTE_P, PALETTE_Q, PALETTE_R];

// =============================================================
// SHARED COMPONENTS
// =============================================================

function letterColorR9(token) {
  const HEX_TO_L = {
    "#3D2A1E": 30, "#A36A50": 50, "#C99A66": 66, "#E0C390": 80,
    "#3A2A38": 28, "#7E4858": 48, "#A89888": 65, "#D8CCB8": 80,
    "#3A3D42": 28, "#A88040": 55, "#D6B488": 70, "#E8E0D4": 86,
  };
  const L = HEX_TO_L[token.fill] ?? 50;
  return L > 72 ? "#0C1020" : "#FAFAFA";
}

function SubjectR9({ subject, scale = 1, dense = false, showTbd = true }) {
  const s = SUBJECTS_R9[subject];
  if (!s) return null;
  if ((subject === "wl" || subject === "ls") && !showTbd) return null;
  return (
    <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "flex-start", lineHeight: 1 }}>
      <span className="mono" style={{
        fontSize: 9 * scale,
        color: dense ? "var(--ink)" : "var(--meta)",
        letterSpacing: "0.20em",
      }}>{s.abbr}</span>
      <span style={{ width: "100%", height: 1.5, background: s.hue, marginTop: 2 * scale,
        opacity: s.family === "tbd" ? 0.4 : 1,
        borderTop: s.family === "tbd" ? "1px dashed " + s.hue : "none" }}/>
    </span>
  );
}

function ChildR9({ kid, palette, size = 18, hideName = false }) {
  const t = palette.family[kid.id];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
      <span style={{
        width: size, height: size,
        borderRadius: Math.round(size * 0.22),
        background: t.fill,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        fontFamily: "Plus Jakarta Sans", fontStyle: "italic", fontWeight: 600,
        fontSize: Math.round(size * 0.61), color: letterColorR9(t), lineHeight: 1, flexShrink: 0,
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

function ChildChipR9({ kid, palette, size = 18 }) {
  const t = palette.family[kid.id];
  return (
    <span style={{
      width: size, height: size,
      borderRadius: Math.round(size * 0.22),
      background: t.fill,
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Plus Jakarta Sans", fontStyle: "italic", fontWeight: 600,
      fontSize: Math.round(size * 0.61), color: letterColorR9(t), lineHeight: 1, flexShrink: 0,
    }}>{kid.initial}</span>
  );
}

Object.assign(window, {
  SUBJECTS_R9, PALETTES_R9, PALETTE_P, PALETTE_Q, PALETTE_R,
  SubjectR9, ChildR9, ChildChipR9, letterColorR9,
});
