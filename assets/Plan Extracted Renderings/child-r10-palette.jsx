/* global React */

// =============================================================
// ROUND TEN — CALIBRATION LOCK
// Aubergine #3A2A38 · Plum #5E2E48 · Stone #A89888 · Oat #CDB68C
// =============================================================

const SUBJECTS_R10 = {
  la:    { hue: "#3848D0", abbr: "LANG",   family: "blue",     name: "Ink"      },
  math:  { hue: "#18A0B8", abbr: "MATH",   family: "teal",     name: "Polar"    },
  sci:   { hue: "#38B060", abbr: "SCI",    family: "green",    name: "Malachite"},
  gh:    { hue: "#C83030", abbr: "GEO",    family: "red",      name: "Vermilion"},
  ca:    { hue: "#8848E0", abbr: "ARTS",   family: "purple",   name: "Amethyst" },
  pe:    { hue: "#F08A20", abbr: "PE",     family: "orange",   name: "Ember"    },
  wl:    { hue: "#B8B0A8", abbr: "WL?",    family: "tbd",      name: "TBD"      },
  ls:    { hue: "#B8B0A8", abbr: "LS?",    family: "tbd",      name: "TBD"      },
};

const PALETTE_LOCK = {
  id: "calibration-lock",
  kicker: "PALETTE · LOCK",
  title: "Aubergine · Plum · Stone · Oat",
  tagline: "Calibrated. Plum pulled toward true purple. Oat pulled toward chromatic grain.",
  semantic: "CONSIDERED BEAUTY · the kitchen garden, the dye-vat, the linen cupboard",
  audit: {
    chroma:      "C 0.06 / 0.08 / 0.04 / 0.075 — restrained but each color chromatic at glance.",
    value:       "L 28 / 28 / 65 / 73 — two darks (split by hue/temperature), two warm-lights (split by L 8 + chroma).",
    temperature: "Cool-darks (Aubergine, Plum) plus warm-lights (Stone, Oat). Held by the brown-purple-grain register.",
    territories: "AUBERGINE · PLUM · STONE · OAT — purple-brown · true plum · greige · warm grain.",
  },
  family: {
    leo:  { fill: "#3A2A38", name: "Aubergine", territory: "purple-brown",    territoryShort: "AUBERGINE",
            note: "LOCKED. Hue ~320°, C 0.06, L 28. Brown-shifted purple — eggplant skin. Far from Amethyst (270° at C 0.16) by 50° hue, 22 L points, 60% lower chroma." },
    max:  { fill: "#5E2E48", name: "Plum",      territory: "true-plum",       territoryShort: "PLUM",
            note: "CALIBRATED. Hue ~315°, C 0.08, L 28. Pulled from Mulberry's 350° (red-leaning) to 315° (purple-leaning) — clearly purple. Far from Vermilion (15° at C 0.18) by 60° hue, half chroma. Reads as bottled plum, dye-vat, not as label-red." },
    jack: { fill: "#A89888", name: "Stone",     territory: "warm-greige",     territoryShort: "STONE",
            note: "LOCKED. Hue ~60°, C 0.04, L 65. Connector. Sits between cool-darks and warm-light. Far from all subjects — neutral warm-grey territory." },
    jane: { fill: "#CDB68C", name: "Oat",       territory: "warm-grain",      territoryShort: "OAT",
            note: "CALIBRATED. Hue ~70°, C 0.075, L 73. Pulled from Greige (#D8CCB8 at C 0.03, L 80) to a chromatic warm grain. 2.5× the chroma, 7 L points darker — holds against Warm Chalk surface (#F8F4E9) at glance and at 20px." },
  },
  rationale: {
    headline: "Calibrated. Plum is plum. Oat is grain. The palette ships.",
    move: "Two calibrations close the lock. Plum (#5E2E48) shifts from Mulberry's red-leaning hue (350°) to true plum (315°), with chroma raised from 0.07 to 0.08 — the color is unambiguously purple at glance, sits 60° hue away from Vermilion red, and reads as bottled plum or dye-vat dark. Oat (#CDB68C) shifts from Greige's near-neutral (C 0.03, L 80) to a chromatic warm grain (C 0.075, L 73) — 2.5× the chroma, 7 lightness points darker, holds against the #F8F4E9 chalk surface as a colored container, not as outline + letter. All four containers now hold equal chromatic weight at glance and at the smallest Recap badge scale.",
    constraints: [
      ["1 · HUE TERRITORY · 8 SUBJECTS",
       "Aubergine 320° / Plum 315° both well purple-side, defended from Amethyst (270°) by 45–50° hue and severe chroma differential. Plum at 315° sits 60° from Vermilion red (15°) at less than half its chroma. Stone 60° at C 0.04 — far from all chromatic subjects. Oat 70° at C 0.075 — closest collision is Ember orange (50° at C 0.18), defended by 20° hue and 40% the chroma; reads as grain, not as orange-label."],
      ["2 · GENDER-NEUTRAL",
       "Aubergine, Plum, Stone, Oat — culinary and material nouns. Plum is a fruit, dye-vat color; gender-neutral in European register. Oat is breakfast/grain; gender-neutral. None gender-coded."],
      ["3 · NO INTERNAL PAIRING",
       "Aubergine and Plum share dark cool-purple register but split by 5° hue + chroma differential (0.06 vs 0.08, Plum the chromatic peak). Stone and Oat share warm-light register but split by 8 L points + chroma differential (0.04 vs 0.075 — Stone reads quieter neutral, Oat reads warm grain)."],
      ["4 · VISUAL EQUITY · LOCK",
       "Aubergine and Plum hold full chromatic identity at L 28. Stone at C 0.04 holds against the surface. Oat at C 0.075, L 73 reads as a colored container against #F8F4E9 chalk — not as outline. Recap-badge test below confirms at 20×20px."],
    ],
    plumCalibration: "Hue shift 350° → 315° (35° toward purple). Chroma raised 0.07 → 0.08. Lightness held at 28. Result: clearly purple, not red. The Mulberry trap avoided.",
    oatCalibration: "Chroma raised 0.03 → 0.075 (2.5×). Lightness lowered 80 → 73 (7 points). Hue held in warm-grain territory (~70°). Result: chromatic grain that holds against the chalk surface. The Greige trap avoided.",
  },
};

function letterColorR10(token) {
  const HEX_TO_L = { "#3A2A38": 28, "#5E2E48": 28, "#A89888": 65, "#CDB68C": 73 };
  const L = HEX_TO_L[token.fill] ?? 50;
  return L > 72 ? "#0C1020" : "#FAFAFA";
}

function SubjectR10({ subject, scale = 1, dense = false }) {
  const s = SUBJECTS_R10[subject];
  if (!s) return null;
  return (
    <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "flex-start", lineHeight: 1 }}>
      <span className="mono" style={{ fontSize: 9 * scale, color: dense ? "var(--ink)" : "var(--meta)", letterSpacing: "0.20em" }}>{s.abbr}</span>
      <span style={{ width: "100%", height: 1.5, background: s.hue, marginTop: 2 * scale, opacity: s.family === "tbd" ? 0.4 : 1 }}/>
    </span>
  );
}

function ChildR10({ kid, palette, size = 18, hideName = false }) {
  const t = palette.family[kid.id];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
      <span style={{ width: size, height: size, borderRadius: Math.round(size * 0.22), background: t.fill,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        fontFamily: "Plus Jakarta Sans", fontStyle: "italic", fontWeight: 600,
        fontSize: Math.round(size * 0.61), color: letterColorR10(t), lineHeight: 1, flexShrink: 0,
      }}>{kid.initial}</span>
      {!hideName && (
        <span style={{ fontFamily: "Plus Jakarta Sans", fontStyle: "italic", fontWeight: 500, fontSize: 14, color: "var(--ink)", letterSpacing: "-0.005em" }}>{kid.name}</span>
      )}
    </span>
  );
}

function ChildChipR10({ kid, palette, size = 18 }) {
  const t = palette.family[kid.id];
  return (
    <span style={{ width: size, height: size, borderRadius: Math.round(size * 0.22), background: t.fill,
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Plus Jakarta Sans", fontStyle: "italic", fontWeight: 600,
      fontSize: Math.round(size * 0.61), color: letterColorR10(t), lineHeight: 1, flexShrink: 0,
    }}>{kid.initial}</span>
  );
}

Object.assign(window, { SUBJECTS_R10, PALETTE_LOCK, SubjectR10, ChildR10, ChildChipR10, letterColorR10 });
