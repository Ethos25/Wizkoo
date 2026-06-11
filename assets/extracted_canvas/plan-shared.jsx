/* global React */

// =============================================================
// LOCKED TOKENS — The Plan
// Atelier Jewels children · Eight-subject palette · Form B initials
// =============================================================

const SUBJECTS = {
  la:   { hue: "#3848D0", abbr: "LANG", name: "Ink",       full: "Language Arts" },
  math: { hue: "#18A0B8", abbr: "MATH", name: "Polar",     full: "Mathematics" },
  sci:  { hue: "#38B060", abbr: "SCI",  name: "Malachite", full: "Science" },
  gh:   { hue: "#C83030", abbr: "GEO",  name: "Vermilion", full: "Geography & History" },
  ca:   { hue: "#8848E0", abbr: "ARTS", name: "Amethyst",  full: "Creative Arts" },
  pe:   { hue: "#F08A20", abbr: "PE",   name: "Ember",     full: "PE & Health" },
  wl:   { hue: "#B8B0A8", abbr: "WL?",  name: "—",         full: "World Languages",  tbd: true },
  ls:   { hue: "#B8B0A8", abbr: "LS?",  name: "—",         full: "Life Skills",      tbd: true },
};

// ATELIER JEWELS — locked
const COLORS = {
  leo:  { fill: "#5A2030", name: "Garnet"         },
  max:  { fill: "#1F4E3D", name: "Forest Emerald" },
  jack: { fill: "#1F3858", name: "Lapis"          },
  jane: { fill: "#C09444", name: "Citrine"        },
};

const KIDS = [
  { id: "leo",  initial: "L", rest: "eo",  name: "Leo"  },
  { id: "max",  initial: "M", rest: "ax",  name: "Max"  },
  { id: "jack", initial: "J", rest: "ack", name: "Jack" },
  { id: "jane", initial: "J", rest: "ane", name: "Jane" },
];

// =============================================================
// FORM B — colored Fraunces serif italic initial + Jakarta italic body
// Locked: 1.88× multiplier, weight 500, opsz 144, baseline aligned
// =============================================================
function NameB({ kid, scale = 1, hideRest = false }) {
  const c = COLORS[kid.id];
  const initSize = 32 * scale;
  const restSize = 17 * scale;
  return (
    <span style={{ display: "inline-flex", alignItems: "baseline", lineHeight: 1 }}>
      <span style={{
        fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 500,
        fontSize: initSize, color: c.fill, letterSpacing: "-0.02em",
        fontVariationSettings: '"opsz" 144', lineHeight: 0.85
      }}>{kid.initial}</span>
      {!hideRest && (
        <span style={{
          fontFamily: "Plus Jakarta Sans", fontStyle: "italic", fontWeight: 500,
          fontSize: restSize, color: "var(--ink)", letterSpacing: "-0.005em",
          marginLeft: 1
        }}>{kid.rest}</span>
      )}
    </span>
  );
}

// 20px chip register — single-glyph Fraunces, body suppressed
function ChipB({ kid, weight = 500 }) {
  const c = COLORS[kid.id];
  return (
    <span style={{
      width: 20, height: 20, display: "inline-flex",
      alignItems: "center", justifyContent: "center",
      fontFamily: "Fraunces", fontStyle: "italic", fontWeight: weight,
      fontSize: 19, color: c.fill, lineHeight: 1, letterSpacing: "-0.02em",
      fontVariationSettings: '"opsz" 144'
    }}>{kid.initial}</span>
  );
}

// =============================================================
// SUBJECT MARK — Space Mono uppercase label + 1.5px colored underline
// Label is ALWAYS in ultramarine ink. The underline carries the hue.
// =============================================================
function SubjectMark({ subject, width = 92, dense = false }) {
  const s = SUBJECTS[subject];
  return (
    <span style={{
      display: "inline-flex", flexDirection: "column",
      alignItems: "flex-start", lineHeight: 1, width
    }}>
      <span className="mono" style={{
        fontSize: dense ? 8.5 : 9,
        color: "var(--ink)",
        letterSpacing: "0.22em",
        opacity: s.tbd ? 0.5 : 1
      }}>{s.abbr}</span>
      <span style={{
        width: "100%", height: 1.5,
        background: s.hue, marginTop: 3,
        opacity: s.tbd ? 0.4 : 1
      }}/>
    </span>
  );
}

Object.assign(window, { SUBJECTS, COLORS, KIDS, NameB, ChipB, SubjectMark });
