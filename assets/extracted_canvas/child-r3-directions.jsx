/* global React, FAMILY, ExpandedClusterRow, DirectionFrame, PRINT_DEMO, PrintCard, PrintHeader, NoteCard, RECAP_DEMO, SUBJ_COLORS, SUBJ_ABBR, Sep, Caret */

// =============================================================
// ROUND THREE — Color Landscape + Signal-Form Pairing
// THREE DIRECTIONS, each defining the full 9-color landscape.
// =============================================================

// ---------------------------------------------------------------
// DIRECTION 1 — TWO WORLDS  ·  hue & chroma separation, form by scale
//
// Subjects: small 5px dot (existing form), refined hex values for
// internal chromatic harmony — slight value & chroma equalisation.
// Children: 18px filled chip with knockout initial.
//
// Hue separation: subject palette holds the saturated primary &
// secondary hues; children palette occupies a parallel ring of
// warm low-chroma earth tones. Subjects ride at OKLCH ~L=58 C=0.18;
// children ride at OKLCH ~L=52 C=0.09. Subjects "ring" bright;
// children "ring" warm. The eye distinguishes register before hue.
//
// Form separation: subject = 5px dot, child = 18×18 chip with letter.
// Area ratio ~13×. Subject signal lives on the metadata line;
// child signal lives on the names line. Different sightlines, different
// optical weights.
// ---------------------------------------------------------------

const D1 = {
  subjects: {
    la:   { deep: "#1F2E9C", bright: "#3B4BD0", abbr: "LANG" },
    math: { deep: "#9C7A00", bright: "#E0C420", abbr: "MATH" },
    sci:  { deep: "#236E3C", bright: "#3CA85A", abbr: "SCI"  },
    gh:   { deep: "#C45A14", bright: "#E88128", abbr: "GEO"  },
    ca:   { deep: "#5C2EA8", bright: "#8848D8", abbr: "ARTS" },
  },
  children: {
    max:  { fill: "#A85234", name: "TERRACOTTA" }, // warm clay
    leo:  { fill: "#6E7438", name: "OLIVE"      }, // warm green
    jack: { fill: "#2D6878", name: "TEAL"       }, // cool blue-green
    jane: { fill: "#8C4860", name: "PLUM"       }, // cool warm-red
  },
  revised: true,
  revisionNote: "Subject palette equalised to OKLCH L≈58 C≈0.18 — hues unchanged in identity but slightly brighter & more chromatically uniform so the four children earth-tones never sit in the same value register as a subject hue.",
};

function ChildD1({ kid, size = 18 }) {
  const t = D1.children[kid.id];
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
      <span style={{
        fontFamily: "Plus Jakarta Sans", fontStyle: "italic", fontWeight: 500,
        fontSize: 14, color: "var(--ink)", letterSpacing: "-0.005em",
      }}>{kid.name}</span>
    </span>
  );
}

function SubjectD1({ subject, scale = 1 }) {
  const s = D1.subjects[subject];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span style={{ width: 5*scale, height: 5*scale, borderRadius: 5, background: s.bright }}/>
      <span className="mono" style={{ fontSize: 9*scale, color: "var(--meta)", letterSpacing: "0.20em" }}>{s.abbr}</span>
    </span>
  );
}

// ---------------------------------------------------------------
// DIRECTION 2 — MONO SUBJECTS  ·  children own all color
//
// Boldest move. Subjects shed color entirely. The five subjects are
// identified by their existing mono labels (MATH, LANG, SCI, GEO,
// ARTS) plus a small ink-only geometric form-mark. Five marks,
// five subjects, all in ultramarine ink.
//
// Subject form vocabulary (ink hairline, 1px stroke, ~7px):
//   MATH  ◇  hollow diamond
//   LANG  ─  short horizontal bar
//   SCI   △  hollow triangle
//   GEO   ○  hollow circle
//   ARTS  □  hollow square
//
// Children own the entire color landscape. With no other color in
// the system the four chips can occupy a richer, more saturated
// register without risk of subject-conflation. Confusion is
// architecturally impossible: only one axis carries hue.
//
// This is the maximum-subtraction answer.
// ---------------------------------------------------------------

const D2 = {
  subjects: {
    // No color. Each is a hairline ink form-mark + mono label.
    la:   { abbr: "LANG", mark: "bar"      },
    math: { abbr: "MATH", mark: "diamond"  },
    sci:  { abbr: "SCI",  mark: "triangle" },
    gh:   { abbr: "GEO",  mark: "circle"   },
    ca:   { abbr: "ARTS", mark: "square"   },
  },
  children: {
    // Free to be saturated — no conflation possible.
    max:  { fill: "#C24A2E", name: "VERMILION"  }, // warm red
    leo:  { fill: "#3E7A2C", name: "FOREST"     }, // green
    jack: { fill: "#1F4E8C", name: "INDIGO"     }, // blue
    jane: { fill: "#A06820", name: "AMBER"      }, // mustard-amber
  },
  revised: true,
  revisionNote: "Subject palette removed. All five subjects now identified by ink-only form-mark + mono label. The system carries one color axis: children. Conflation impossible by construction.",
};

function SubjectMark({ kind, size = 8 }) {
  const stroke = "var(--ink)";
  if (kind === "diamond") return (
    <svg width={size} height={size} viewBox="0 0 10 10"><path d="M 5 1.2 L 8.8 5 L 5 8.8 L 1.2 5 Z" fill="none" stroke={stroke} strokeWidth="1.2"/></svg>
  );
  if (kind === "bar") return (
    <svg width={size+1} height={size} viewBox="0 0 12 10"><rect x="1.5" y="4.2" width="9" height="1.6" fill={stroke}/></svg>
  );
  if (kind === "triangle") return (
    <svg width={size} height={size} viewBox="0 0 10 10"><path d="M 5 1.5 L 9 8.5 L 1 8.5 Z" fill="none" stroke={stroke} strokeWidth="1.2"/></svg>
  );
  if (kind === "circle") return (
    <svg width={size} height={size} viewBox="0 0 10 10"><circle cx="5" cy="5" r="3.6" fill="none" stroke={stroke} strokeWidth="1.2"/></svg>
  );
  if (kind === "square") return (
    <svg width={size} height={size} viewBox="0 0 10 10"><rect x="1.6" y="1.6" width="6.8" height="6.8" fill="none" stroke={stroke} strokeWidth="1.2"/></svg>
  );
  return null;
}

function ChildD2({ kid, size = 18 }) {
  const t = D2.children[kid.id];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
      <span style={{
        width: size, height: size, borderRadius: Math.round(size * 0.22),
        background: t.fill, display: "inline-flex", alignItems: "center", justifyContent: "center",
        fontFamily: "Plus Jakarta Sans", fontStyle: "italic", fontWeight: 600,
        fontSize: Math.round(size * 0.61), color: "#FAFAFA", lineHeight: 1, flexShrink: 0,
      }}>{kid.initial}</span>
      <span style={{
        fontFamily: "Plus Jakarta Sans", fontStyle: "italic", fontWeight: 500,
        fontSize: 14, color: "var(--ink)", letterSpacing: "-0.005em",
      }}>{kid.name}</span>
    </span>
  );
}

function SubjectD2({ subject }) {
  const s = D2.subjects[subject];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <SubjectMark kind={s.mark} size={8}/>
      <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>{s.abbr}</span>
    </span>
  );
}

// ---------------------------------------------------------------
// DIRECTION 3 — THE UNDERLINE  ·  subject color retreats to a label
//
// Subjects keep their hues but shed the dot — color migrates to a
// 1px underline beneath the mono subject label. The label is the
// recognition unit; the underline is its color.
//
// Children stay as chip + knockout. The two color forms are now
// architecturally opposite:
//   subject  ▔  passive, beneath, label-bound, hairline
//   child    ▣  active, contained, letter-bound, filled
//
// One is a wayfinder under text; the other is a mark beside text.
// They never sit in the same sightline; they never share the same
// optical weight; they cannot be confused by form even if a parent
// briefly lost color memory.
// ---------------------------------------------------------------

const D3 = {
  subjects: {
    la:   { hue: "#3848D0", abbr: "LANG" },
    math: { hue: "#C8A800", abbr: "MATH" },
    sci:  { hue: "#3CA85A", abbr: "SCI"  },
    gh:   { hue: "#E07820", abbr: "GEO"  },
    ca:   { hue: "#7848D0", abbr: "ARTS" },
  },
  children: {
    max:  { fill: "#B85C3A", name: "TERRACOTTA" },
    leo:  { fill: "#5C7A2E", name: "MOSS"       },
    jack: { fill: "#2A5E78", name: "STEEL"      },
    jane: { fill: "#8E4A6E", name: "PLUM"       },
  },
  revised: false,
  revisionNote: "Subject hues kept (slight value adjustment to live as 1px underlines). Children palette tuned warmer than subjects so even if a parent saw a subject color region floating she'd register the temperature mismatch.",
};

function ChildD3({ kid, size = 18 }) {
  const t = D3.children[kid.id];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
      <span style={{
        width: size, height: size, borderRadius: Math.round(size * 0.22),
        background: t.fill, display: "inline-flex", alignItems: "center", justifyContent: "center",
        fontFamily: "Plus Jakarta Sans", fontStyle: "italic", fontWeight: 600,
        fontSize: Math.round(size * 0.61), color: "#FAFAFA", lineHeight: 1, flexShrink: 0,
      }}>{kid.initial}</span>
      <span style={{
        fontFamily: "Plus Jakarta Sans", fontStyle: "italic", fontWeight: 500,
        fontSize: 14, color: "var(--ink)", letterSpacing: "-0.005em",
      }}>{kid.name}</span>
    </span>
  );
}

function SubjectD3({ subject }) {
  const s = D3.subjects[subject];
  return (
    <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "flex-start" }}>
      <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em", lineHeight: 1.1 }}>
        {s.abbr}
      </span>
      <span style={{ width: "100%", height: 1.5, background: s.hue, marginTop: 2 }}/>
    </span>
  );
}

Object.assign(window, {
  D1, D2, D3,
  ChildD1, SubjectD1,
  ChildD2, SubjectD2, SubjectMark,
  ChildD3, SubjectD3,
});
