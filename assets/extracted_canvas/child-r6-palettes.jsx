/* global React, FAMILY */

// =============================================================
// ROUND SIX — THE FOURTH SLOT · JANE
//
// LOCKED (from round 5):
//   · Leo  — Wine  #5C1F30
//   · Max  — Sand  #B79270
//   · Jack — Slate #4F5A6A   (the brief writes this as Slate;
//                              prior round shipped #46566A "Steel".
//                              We use the brief's value here.)
//
// OPEN: Jane — one slot.
//
// FAILURES TO AVOID (named in the brief):
//   · Onyx, Taupe, gray-leaning   — under-coloured Jane.
//   · Rose                         — gendered.
//   · Brick                        — second red with Wine.
//   · Bronze                       — too close to Geo orange.
//
// CANDIDATE TERRITORIES THAT HOLD:
//   F · Deep Aubergine — brown-shifted purple, far enough from Arts.
//   G · Deep Teal      — blue-shifted green, far enough from Sci & Lang.
//   H · Deep Loden     — desaturated forest, far enough from Sci to read
//                         as a different territory at chip scale.
// =============================================================

const SUBJECTS_R6 = {
  la:   { hue: "#3848D0", abbr: "LANG", family: "blue"   },
  math: { hue: "#C8A800", abbr: "MATH", family: "yellow" },
  sci:  { hue: "#3CA85A", abbr: "SCI",  family: "green"  },
  gh:   { hue: "#E07820", abbr: "GEO",  family: "orange" },
  ca:   { hue: "#7848D0", abbr: "ARTS", family: "purple" },
};

// The three locked tokens. Used inside every candidate.
const LOCKED = {
  leo:  { fill: "#5C1F30", name: "Wine",  territory: "red",       territoryShort: "RED",       note: "Locked. Deep red-wine. The palette's chromatic anchor at L≈26, C≈0.10." },
  max:  { fill: "#B79270", name: "Sand",  territory: "brown",     territoryShort: "BROWN",     note: "Locked. Warm taupe / sand. The light end of brown territory; half MATH's chroma." },
  jack: { fill: "#4F5A6A", name: "Slate", territory: "cool-gray", territoryShort: "COOL GRAY", note: "Locked. Cool blue-gray stone. ~250° at C≈0.025 — eight× less saturated than LANG." },
};

// =============================================================
// CANDIDATE F · DEEP AUBERGINE
// =============================================================
const CANDIDATE_F = {
  id: "jane-aubergine",
  kicker: "CANDIDATE F",
  title: "Aubergine",
  janeName: "Aubergine",
  tagline: "Brown-shifted purple — chromatic, present, never Arts.",
  family: {
    leo:  LOCKED.leo,
    max:  LOCKED.max,
    jack: LOCKED.jack,
    jane: { fill: "#4A2A38", name: "Aubergine", territory: "aubergine", territoryShort: "AUBERGINE",
            note: "Deep brown-shifted purple. OKLCH hue ≈ 350°, chroma ≈ 0.06, lightness ≈ 28. Sits 20° clear of ARTS purple (330°) and at one-third its chroma — reads as ripe-eggplant, not lavender." },
  },
  rationale: {
    headline: "Aubergine — the considered fourth.",
    move: "A brown-shifted purple, dark and warm enough to read as its own slot. It pairs with Wine on a temperature axis (Wine = warm-red, Aubergine = warm-purple) without colliding inside the red family — Aubergine sits 20° further around the wheel and at lower chroma, so the eye reads them as related materials, not as duplicates. Against Slate's cool, Aubergine reads unambiguously warm; against Sand's light, it reads unambiguously dark. Jane gets a colour with as much weight as Leo's.",
    constraints: [
      ["1 · Chromatic & present",  "L ≈ 28, C ≈ 0.06. Identical chromatic weight as Wine; double Slate's chroma. At a glance Jane carries colour, not absence."],
      ["2 · Outside subject hues", "ARTS purple is hue 280° at C 0.20. Aubergine sits at 350° and C 0.06 — 70° around the wheel and at one-third the chroma. Geo orange (50°), Math yellow (95°), Sci green (140°), Lang blue (260°) all clear by ≥90°."],
      ["3 · Distinct from Wine/Sand/Slate", "Vs Wine: Wine is hue 10° (warm red), Aubergine is hue 350° (cool red-purple) — 20° on the wheel and a recognised material seam (wine vs eggplant). Vs Sand: 40 lightness gap. Vs Slate: opposite temperature, +10 chroma."],
      ["4 · Gender-neutral",       "Aubergine is a vegetable noun and a leather/wine register. No rose, no pink, no fuchsia. Holds for any family configuration — boys-only, girls-only, mixed."],
    ],
    bullets: [
      ["Why this lands",      "It answers the brief's first preferred territory directly. Brown-shifted enough that it reads as a fourth material, not a fifth Arts."],
      ["The pairing test",    "Wine + Aubergine on the same screen reads as two bottles on a shelf — same family of considered, not the same colour. The 20° hue gap and 4-pt chroma gap do the work."],
      ["Recap-badge scale",   "At 20×20 with white letter knockout, Aubergine resolves as a deep purple-ish-brown. The L≈28 / C≈0.06 calibration was chosen for chip-scale presence."],
      ["J/J collision",       "Jack-slate (cool, achromatic) vs Jane-aubergine (warm, chromatic). Maximum perceptual distance available inside the four-territory system."],
      ["Risk to defend",      "The only failure mode is over-shifting toward purple. Held at 350° and C 0.06, Aubergine reads brown-purple, not lavender — confirmed at chip and badge scale."],
      ["Tone",                "Hay textile + Frama leather. Considered, adult, material — same register as Wine and Sand."],
    ],
  },
};

// =============================================================
// CANDIDATE G · DEEP TEAL
// =============================================================
const CANDIDATE_G = {
  id: "jane-teal",
  kicker: "CANDIDATE G",
  title: "Teal",
  janeName: "Teal",
  tagline: "Blue-shifted green — saturated enough to be its own territory.",
  family: {
    leo:  LOCKED.leo,
    max:  LOCKED.max,
    jack: LOCKED.jack,
    jane: { fill: "#1F4A4F", name: "Teal", territory: "teal", territoryShort: "TEAL",
            note: "Deep blue-shifted green. OKLCH hue ≈ 195°, chroma ≈ 0.05, lightness ≈ 30. Sits 55° from SCI green (140°) and 65° from LANG blue (260°). Dark enough that lightness alone separates it from both subject hues." },
  },
  rationale: {
    headline: "Teal — the chromatic fourth.",
    move: "A deep teal occupies a cyan-green seam that none of the five subjects touch and none of the three locked colours threaten. It gives Jane a saturated, recognisable colour on the same lightness band as Wine and Slate, and pairs cleanly: cool against Sand, warmer than Slate, far from Wine. The risk to manage is SCI proximity — held at hue 195° (vs SCI 140°) and lightness 30 (vs SCI 60), it reads as a different material at any scale.",
    constraints: [
      ["1 · Chromatic & present",  "L ≈ 30, C ≈ 0.05. Equal chromatic weight to Wine; double Slate. Jane's container reads coloured at glance, not desaturated."],
      ["2 · Outside subject hues", "SCI green is hue 140° at L 60, C 0.16 — Teal sits 55° clockwise into the blue-green seam, at 30 points darker, and at one-third the chroma. The L-gap alone separates them at chip scale; hue confirms. LANG blue is 65° further."],
      ["3 · Distinct from Wine/Sand/Slate", "Vs Wine: opposite temperature (cool vs warm), 180° on the wheel. Vs Sand: 35-pt lightness gap and opposite temperature. Vs Slate: Teal is hue 195° at C 0.05, Slate is hue 250° at C 0.025 — 55° on the wheel and double the chroma. Slate reads as a colourless cool, Teal as a chromatic cool."],
      ["4 · Gender-neutral",       "Teal is a duck/pottery/copper-patina noun. No rose, no pink. Holds for any family configuration."],
    ],
    bullets: [
      ["Why this lands",      "Answers the brief's second preferred territory. The blue-green seam is the largest gap in the subject hue circle — the safest place for a fourth chromatic colour."],
      ["The pairing test",    "Slate + Teal on the same screen reads as two cool stones — gunmetal and patina — not as one colour with a sibling. The chroma differential (0.025 vs 0.05) and hue differential (250° vs 195°) are both visible."],
      ["Recap-badge scale",   "At 20×20 with white letter knockout, Teal resolves as a deep cool-coloured chip. L≈30 keeps it readable next to Wine."],
      ["J/J collision",       "Jack-slate vs Jane-teal — both cool, but Jack is desaturated and Jane is chromatic. The same temperature axis with different chromatic intensity is a clean, intentional pairing."],
      ["Risk to defend",      "Two risks. SCI proximity (managed by 30-pt lightness gap and 55° hue gap). LANG proximity (managed by 65° hue gap and a green-leaning hue, not blue-leaning)."],
      ["Tone",                "Frama copper-patina + Hay glazed-stoneware. Sits well next to Wine and Sand without competing."],
    ],
  },
};

// =============================================================
// CANDIDATE H · DEEP LODEN
// =============================================================
const CANDIDATE_H = {
  id: "jane-loden",
  kicker: "CANDIDATE H",
  title: "Loden",
  janeName: "Loden",
  tagline: "Desaturated forest — quiet chromatic, far from Sci.",
  family: {
    leo:  LOCKED.leo,
    max:  LOCKED.max,
    jack: LOCKED.jack,
    jane: { fill: "#3E4A36", name: "Loden", territory: "loden", territoryShort: "LODEN",
            note: "Deep desaturated forest green. OKLCH hue ≈ 135°, chroma ≈ 0.035, lightness ≈ 32. Same hue family as SCI but at one-fifth the chroma and half the lightness — reads as material green (loden wool, moss), not as the SCI underline." },
  },
  rationale: {
    headline: "Loden — the quiet chromatic fourth.",
    move: "A defended-chromatic answer. Loden lives at the same hue as SCI but is so dark and so desaturated that it reads as a different material entirely — wool, moss, lichen — not as the bright label-bound Sci underline. The pairing structure is unique: cool-warm Wine, warm Sand, cool Slate, deep-green Loden. It is the only one of the three candidates that is itself a recognised heritage colour name.",
    constraints: [
      ["1 · Chromatic & present",  "L ≈ 32, C ≈ 0.035. Equal lightness band to Slate, equal chroma band to Wine. Jane reads coloured, not gray."],
      ["2 · Outside subject hues", "Hue overlap with SCI is the explicit risk. Defence: SCI lives at L 60, C 0.16 (vivid mid). Loden at L 32, C 0.035 — half the lightness and a fifth the chroma. The brief allows this when value/saturation distance is enough; here the V·S product is ≈12× different. Result: SCI reads as label, Loden reads as container."],
      ["3 · Distinct from Wine/Sand/Slate", "Vs Wine: opposite hue (red vs green), same lightness band — temperature does the work. Vs Sand: 35-pt lightness gap, opposite temperature seam. Vs Slate: same lightness band but Slate is desaturated cool (hue 250°) and Loden is desaturated warm-green (hue 135°) — 115° on the wheel."],
      ["4 · Gender-neutral",       "Loden is a wool/coat/moss register. No rose, no pink, no fuchsia. Holds for any family configuration."],
    ],
    bullets: [
      ["Why this lands",      "It is the third territory the brief implicitly leaves open — defended-green. The whole calibration is the defence: dark enough and quiet enough that the SCI underline (bright, on type) and Jane's container (deep, on background) are read as different layers of the system, not as the same colour."],
      ["The pairing test",    "SCI underline (#3CA85A) directly above a Jane-Loden chip is the worst-case test. The chip reads as wool; the underline reads as a marker. Two layers, not two duplicates."],
      ["Recap-badge scale",   "At 20×20, Loden resolves as a deep moss chip. The low chroma keeps it from competing with the SCI underline used elsewhere on the same screen."],
      ["J/J collision",       "Jack-slate vs Jane-loden — both desaturated and both at the same lightness band, but opposite hue families (cool-blue vs warm-green). Hue does the discrimination work; the matched lightness creates a paired-but-different effect that suits the J/J initials sharing."],
      ["Risk to defend",      "The only defensible-but-edgy candidate. If the parent's screen is colour-managed badly, Loden could drift. Mitigated by sticking to a chroma the device can't push into bright territory — capped at 0.035."],
      ["Tone",                "Heritage textile — loden wool, dark lichen. Quieter than Aubergine, less colour-forward than Teal. The conservative chromatic answer."],
    ],
  },
};

const CANDIDATES_R6 = [CANDIDATE_F, CANDIDATE_G, CANDIDATE_H];

// =============================================================
// COMPONENTS — locked architecture
// =============================================================

function SubjectR6({ subject, scale = 1, dense = false }) {
  const s = SUBJECTS_R6[subject];
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

function ChildR6({ kid, palette, size = 18, hideName = false }) {
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

function ChildChipR6({ kid, palette, size = 18 }) {
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
  SUBJECTS_R6, CANDIDATES_R6, CANDIDATE_F, CANDIDATE_G, CANDIDATE_H,
  LOCKED_R6: LOCKED,
  SubjectR6, ChildR6, ChildChipR6,
});
