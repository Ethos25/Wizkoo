/* global React, FAMILY, CLUSTER_DEMO, ExpandedClusterRow, DirectionFrame, PRINT_DEMO */

// =============================================================
// DIRECTION 4 — JAPANESE  ·  "The Mark and the Space."
//
// Central move: each child IS a small geometric mark — an object,
// not a letter. The mark is placed BEFORE the name with deliberate
// negative space between mark and word. The shape carries the
// recognition; the name confirms it.
//
// The four objects, in birth order:
//   Max   ●   filled circle   (oldest, 10)
//   Leo   ▬   horizontal bar  (8)
//   Jack  ◆   filled diamond  (6)
//   Jane  ○   hollow circle   (5)
//
// Selected so that the four shapes form a complete geometric set:
// fill / line / corner / hollow. None of them resemble each other
// at any size. None of them are letters. None of them are decorative.
//
// The mark is ultramarine ink — same value as the name. It does NOT
// introduce a second color axis. It introduces a small object
// vocabulary, which the locked system already permits via the
// subject dot.
//
// The mark sits at 5px on phone, 7pt in print. It is closer to a
// punctuation mark than to a glyph. Space around the mark is 8px —
// generous, deliberate. The space is the design.
// =============================================================

function MarkJP({ kidId, size = 6 }) {
  const stroke = 1.1;
  const ink = "#0C1020";
  if (kidId === "max") {
    // filled circle
    return (
      <svg width={size} height={size} viewBox="0 0 10 10" style={{ display: "block" }}>
        <circle cx="5" cy="5" r="4" fill={ink}/>
      </svg>
    );
  }
  if (kidId === "leo") {
    // horizontal bar
    return (
      <svg width={size + 2} height={size} viewBox="0 0 12 10" style={{ display: "block" }}>
        <rect x="1" y="4" width="10" height="2" fill={ink}/>
      </svg>
    );
  }
  if (kidId === "jack") {
    // filled diamond
    return (
      <svg width={size} height={size} viewBox="0 0 10 10" style={{ display: "block" }}>
        <path d="M 5 1 L 9 5 L 5 9 L 1 5 Z" fill={ink}/>
      </svg>
    );
  }
  if (kidId === "jane") {
    // hollow circle
    return (
      <svg width={size} height={size} viewBox="0 0 10 10" style={{ display: "block" }}>
        <circle cx="5" cy="5" r="3.5" fill="none" stroke={ink} strokeWidth={stroke + 0.2}/>
      </svg>
    );
  }
  return null;
}

function ChildJP({ kid, size = 6 }) {
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
    }}>
      <MarkJP kidId={kid.id} size={size}/>
      <span style={{
        fontFamily: "Plus Jakarta Sans",
        fontStyle: "italic",
        fontWeight: 500,
        fontSize: 14,
        color: "var(--ink)",
        letterSpacing: "-0.005em",
      }}>
        {kid.name}
      </span>
    </span>
  );
}

function DirectionJP_Mockup() {
  return (
    <DirectionFrame>
      <ExpandedClusterRow
        renderChild={(k) => <ChildJP kid={k}/>}
      />
    </DirectionFrame>
  );
}

// ---------- Print translation ----------
function DirectionJP_Print() {
  const step = PRINT_DEMO.step;
  return (
    <PrintCard>
      <PrintHeader/>
      <h3 style={{
        margin: "20px 0 10px",
        fontFamily: "Plus Jakarta Sans",
        fontWeight: 500,
        fontSize: 14,
        color: "var(--ink)",
      }}>
        {step.title}
      </h3>
      <p style={{
        margin: 0,
        fontFamily: "Plus Jakarta Sans",
        fontWeight: 400,
        fontSize: 11.5,
        color: "var(--ink)",
        lineHeight: 1.5,
        letterSpacing: "-0.003em",
      }}>
        Hold up two wooden blocks with a flat block laid across the gap. Ask: "What do we call this shape?"
      </p>
      <div style={{ marginTop: 14, display: "grid", rowGap: 6 }}>
        {step.perChild.map((p, i) => {
          const k = FAMILY.find(f => f.id === p.kid);
          return (
            <div key={i} style={{
              display: "grid",
              gridTemplateColumns: "78px 1fr",
              columnGap: 10,
              alignItems: "baseline",
            }}>
              <ChildJP kid={k} size={7}/>
              <span style={{
                fontFamily: "Plus Jakarta Sans",
                fontWeight: 400,
                fontSize: 11,
                color: "var(--mid)",
                lineHeight: 1.4,
              }}>
                {p.note}
              </span>
            </div>
          );
        })}
      </div>
    </PrintCard>
  );
}

function DirectionJP_Note() {
  return (
    <NoteCard
      persona="JAPANESE"
      title="The Mark and the Space."
      move={<>Each child is a small geometric mark — filled circle, horizontal bar, filled diamond, hollow circle — placed before the name with deliberate space. The mark is the object; the name confirms. Recognition lives in form, not letter.</>}
      bullets={[
        ["Rationale", "The four shapes form a complete geometric set: fill / line / corner / hollow. They are non-confusable at any size, in any rotation. The mark is closer to punctuation than to glyph; it occupies the same optical weight as the existing subject dot. No new color axis. The system gains an object vocabulary that the parent learns once and never re-learns."],
        ["Same-initial collision", "Solved at the deepest level — Jack and Jane have nothing in common visually. Jack is a filled diamond; Jane is a hollow circle. The shapes are antonyms (filled-cornered vs hollow-curved). The collision dissolves before the eye reaches the name."],
        ["Family scaling", "1 child: mark suppressed (the system isn't announcing a problem that doesn't exist). 2 children: any two of the four shapes — typically the most visually-opposed pair (filled circle vs horizontal bar). 3+ children: shapes assigned by birth order from the canonical set. The set is closed at four — Wizkoo's family ceiling."],
        ["Print", "Marks are SVG primitives — they print perfectly at any toner density and any reduction. On the Block Sheet name column, the mark sits 8px before the name and is the first thing the eye finds."],
        ["Where it earns its cost", "Repetition. The hundredth visit. The mark is so small it disappears on first read; by week three the parent reads ● before reading 'Max.' This is the Lovevery-toy-as-artifact instinct: an object that becomes more itself with use."],
        ["Where it fails", "First-encounter cost. A new parent has to learn four shape-to-name mappings before the system pays back. Mitigation: a one-line legend in onboarding. Open question: should the mark replace the name on highly compressed surfaces (Block View tags), or always coexist?"],
      ]}
    />
  );
}

Object.assign(window, { ChildJP, MarkJP, DirectionJP_Mockup, DirectionJP_Print, DirectionJP_Note });
