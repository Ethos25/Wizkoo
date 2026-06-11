/* global React, FAMILY, CLUSTER_DEMO, ExpandedClusterRow, DirectionFrame, PRINT_DEMO */

// =============================================================
// DIRECTION 2 — DANISH  ·  "The Tonal Quartet."
//
// Central move: Subtraction. No new ink, no new color, no new
// container. Each child renders at one of four tonal values of
// the existing ultramarine ink — committed values, not arbitrary.
//
//   100% ink  — #0C1020 (Leo)
//    78% ink  — #3A3D4F (Max)
//    58% ink  — #6E6F7B (Jack)
//    40% ink  — #999AA2 (Jane)
//
// The order is set by household birth order, not alphabet — a
// rule the parent already knows. The system gains no new axis;
// it commits to four values along an axis it already has.
//
// Surface recedes. Reads as one ink at glance, four shades at
// reading speed. Print survives at any toner density.
// =============================================================

const TONE = {
  // Mapped by birth order: oldest → darkest
  max:  "#0C1020",   // 10 — oldest
  leo:  "#3A3D4F",   // 8
  jack: "#6E6F7B",   // 6
  jane: "#999AA2",   // 5 — youngest
};

function ChildDK({ kid }) {
  return (
    <span style={{
      fontFamily: "Plus Jakarta Sans",
      fontStyle: "italic",
      fontWeight: 500,
      fontSize: 14,
      color: TONE[kid.id],
      letterSpacing: "-0.005em",
    }}>
      {kid.name}
    </span>
  );
}

function DirectionDK_Mockup() {
  return (
    <DirectionFrame>
      <ExpandedClusterRow
        renderChild={(k) => <ChildDK kid={k}/>}
      />
    </DirectionFrame>
  );
}

// ---------- Print ----------
function DirectionDK_Print() {
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
              gridTemplateColumns: "60px 1fr",
              columnGap: 10,
              alignItems: "baseline",
            }}>
              <ChildDK kid={k}/>
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

function DirectionDK_Note() {
  return (
    <NoteCard
      persona="DANISH"
      title="The Tonal Quartet."
      move={<>Subtraction. Four committed tonal values of the existing ultramarine ink, ordered by household birth order (oldest = darkest). No new color, no new container, no new shape — the system gains nothing it didn't already have.</>}
      bullets={[
        ["Rationale", "The argument is that the system already has ink, and the system already has alpha. We just commit. The cost is zero — no second axis is introduced; an existing axis is given four committed values. Surface recedes."],
        ["Same-initial collision", "Jack at 58% and Jane at 40% are visibly distinct as a pair, even though the letterforms collide. The eye reads value before letterform at glance."],
        ["Family scaling", "1 child: 100% ink only. 2 children: 100% / 58%. 3 children: 100% / 78% / 40%. 4 children: full quartet. Rule is uniform — drop from the lightest end as family shrinks. The sequence stays anchored at full ink so a single child never feels diminished."],
        ["Print", "Survives toner-density variation because the values are >18% apart. On a fridge at glance, the parent reads 'two darks together / two lights together' before reading any letter."],
        ["Where it earns its cost", "On the Recap mastery shifts: a row of four names at four values reads as a family at a glance. The badge becomes redundant; the type IS the badge."],
        ["Where it fails", "Oldest-darkest may feel hierarchical. Risk: youngest reads as 'less important.' Mitigation: order is by birth, not status — same logic the parent uses to remember whose turn it is. To pressure-test: would a parent of two kids born minutes apart find this rule arbitrary?"],
      ]}
    />
  );
}

Object.assign(window, { ChildDK, DirectionDK_Mockup, DirectionDK_Print, DirectionDK_Note, TONE });
