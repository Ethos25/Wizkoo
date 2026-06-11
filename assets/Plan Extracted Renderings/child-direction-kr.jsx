/* global React, FAMILY, CLUSTER_DEMO, ExpandedClusterRow, DirectionFrame, PRINT_DEMO */

// =============================================================
// DIRECTION 1 — KOREAN  ·  "The Italic, Resolved."
//
// Central move: One typographic gesture. The italic name, set in
// Plus Jakarta Sans 500, ultramarine ink — but rendered with a
// hairline mono "tag" appended directly after as a subscript:
//   Jack ‹6›   Jane ‹5›   Leo ‹8›   Max ‹10›
// Age, in mono, in chevron brackets. Solves the J/J collision
// without introducing any new ink, color, or container.
//
// Tags are subordinate (10px Space Mono, faint), so the name is
// what reads at glance speed. The tag is what reads at reading
// speed when names are ambiguous.
//
// At 1 child: tag suppressed (no problem to solve).
// At 2+ children: tag appears uniformly.
//
// Defends italic-only by making italic decisive: a typographic
// pair, not just a slant.
// =============================================================

function ChildKR({ kid, withTag = true }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "baseline", gap: 5 }}>
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
      {withTag && (
        <span style={{
          fontFamily: "Space Mono",
          fontSize: 9,
          color: "var(--faint)",
          letterSpacing: "0.04em",
          position: "relative",
          top: -1,
        }}>
          ‹{kid.age}›
        </span>
      )}
    </span>
  );
}

function DirectionKR_Mockup() {
  return (
    <DirectionFrame>
      <ExpandedClusterRow
        renderChild={(k) => (
          <span style={{
            display: "inline-flex",
            alignItems: "baseline",
            gap: 5,
            padding: "2px 0",
          }}>
            <ChildKR kid={k} />
          </span>
        )}
      />
    </DirectionFrame>
  );
}

// ---------- Print translation ----------
function DirectionKR_Print() {
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
              <ChildKR kid={k}/>
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

// ---------- Direction note card ----------
function DirectionKR_Note() {
  return (
    <NoteCard
      persona="KOREAN"
      title="The Italic, Resolved."
      move={<>One typographic gesture. The italic name carries identity; a hairline mono tag in chevron brackets carries the disambiguator (age). No new ink, no color, no container — just a typographic <em style={{fontFamily:"Fraunces",fontStyle:"italic"}}>pair</em>.</>}
      bullets={[
        ["Rationale", "Italic alone fails Jack / Jane at glance. Italic + age-tag survives the kitchen-counter 1.5-second read because the eye lands on the name and the tag clarifies only when needed. Tag is suppressed at 1 child — system doesn't announce a problem that doesn't exist."],
        ["Same-initial collision", "Solved by the tag: Jack ‹6› vs Jane ‹5›. Numbers are the cleanest tiebreaker — distinct shapes, no semantic noise."],
        ["Family scaling", "1 child: italic only, no tag. 2+ children: tag uniform. The rule is conditional but the tag is uniform — no per-child variation in tag itself."],
        ["Print", "Tag prints. Same vocabulary, same restraint. 78px name column on Block Sheet absorbs ‹age› without reflow."],
        ["Where it earns its cost", "Zero new color, zero new chrome. Survives black-and-white print, photocopy, low-light kitchen."],
        ["Where it fails", "If the parent has scanned the family list ten thousand times, age becomes invisible. The tag stops paying rent. Open question: does the recap need a stronger mark?"],
      ]}
    />
  );
}

Object.assign(window, { ChildKR, DirectionKR_Mockup, DirectionKR_Print, DirectionKR_Note });
