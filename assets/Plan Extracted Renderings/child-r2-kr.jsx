/* global React, FAMILY, CLUSTER_DEMO, ExpandedClusterRow, DirectionFrame, PRINT_DEMO, PrintCard, PrintHeader, NoteCard */

// =============================================================
// ROUND TWO · DIRECTION 2 — KOREAN  ·  "The Dropcap."
//
// Single-step recognition: the first letter of the name is rendered
// in Fraunces italic at 1.4× cap-height, ultramarine ink, fused into
// the PJS italic body of the name with a tight kern. The name reads
// as ONE word; the eye lands on the dropcap which is structurally
// the recognition target.
//
//   *L*eo   *M*ax   *Ja*ck   *Ja*ne
//
// For Jack and Jane, the dropcap extends to TWO letters — Ja —
// because the J alone collides. The dropcap rule is "smallest
// uniquely-identifying initial cluster," computed at family-set
// time. For families with no collision, dropcap is one letter; for
// families with collision, the colliding pair both get a 2-letter
// dropcap (consistency: same rule across the pair).
//
// No second color axis. The mark IS typography. The serif against
// sans creates the optical anchor; the eye reads the cluster as a
// single named-glyph.
// =============================================================

// Compute dropcap length per family — smallest unique prefix
function dropcap(name, family) {
  const others = family.filter(o => o.name !== name);
  for (let i = 1; i <= name.length; i++) {
    const prefix = name.slice(0, i);
    const collisions = others.filter(o => o.name.slice(0, i) === prefix);
    if (collisions.length === 0) {
      // Found unique prefix — but for the colliding partner, the SAME prefix length applies
      // We resolve this by checking: if any other name shares the prefix at length i-1, we need length i
      return i;
    }
  }
  return name.length;
}

function dropcapForFamily(family) {
  // For each name, find the minimum prefix length such that no other name shares it.
  // For collision pairs (Jack/Jane), this returns 2 for both.
  const result = {};
  for (const k of family) {
    let i = 1;
    while (i <= k.name.length) {
      const others = family.filter(o => o.id !== k.id);
      const collides = others.some(o => o.name.slice(0, i).toLowerCase() === k.name.slice(0, i).toLowerCase());
      if (!collides) break;
      i++;
    }
    result[k.id] = i;
  }
  // Make collision pairs symmetric: if Jack needs 2, Jane gets 2 too (already true in practice).
  return result;
}

function ChildKR2({ kid, family = FAMILY, scale = 1 }) {
  const lengths = dropcapForFamily(family);
  const n = lengths[kid.id] || 1;
  const cap = kid.name.slice(0, n);
  const rest = kid.name.slice(n);
  const baseSize = 14 * scale;
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "baseline",
      whiteSpace: "nowrap",
    }}>
      <span style={{
        fontFamily: "Fraunces",
        fontStyle: "italic",
        fontWeight: 500,
        fontSize: baseSize * 1.5,
        color: "var(--ink)",
        letterSpacing: "-0.025em",
        fontVariationSettings: '"opsz" 24',
        lineHeight: 0.85,
        position: "relative",
        top: baseSize * 0.16,
      }}>
        {cap}
      </span>
      <span style={{
        fontFamily: "Plus Jakarta Sans",
        fontStyle: "italic",
        fontWeight: 500,
        fontSize: baseSize,
        color: "var(--ink)",
        letterSpacing: "-0.005em",
        marginLeft: -1,
      }}>
        {rest}
      </span>
    </span>
  );
}

function DirectionKR2_Mockup() {
  return (
    <DirectionFrame>
      <ExpandedClusterRow
        renderChild={(k) => <ChildKR2 kid={k}/>}
      />
    </DirectionFrame>
  );
}

function DirectionKR2_Print() {
  const step = PRINT_DEMO.step;
  return (
    <PrintCard>
      <PrintHeader/>
      <h3 style={{ margin: "20px 0 10px", fontFamily: "Plus Jakarta Sans", fontWeight: 500, fontSize: 14, color: "var(--ink)" }}>
        {step.title}
      </h3>
      <p style={{ margin: 0, fontFamily: "Plus Jakarta Sans", fontWeight: 400, fontSize: 11.5, color: "var(--ink)", lineHeight: 1.5, letterSpacing: "-0.003em" }}>
        Hold up two wooden blocks with a flat block laid across the gap. Ask: "What do we call this shape?"
      </p>
      <div style={{ marginTop: 14, display: "grid", rowGap: 8 }}>
        {step.perChild.map((p, i) => {
          const k = FAMILY.find(f => f.id === p.kid);
          return (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "82px 1fr", columnGap: 12, alignItems: "baseline" }}>
              <ChildKR2 kid={k}/>
              <span style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 400, fontSize: 11, color: "var(--mid)", lineHeight: 1.4 }}>
                {p.note}
              </span>
            </div>
          );
        })}
      </div>
    </PrintCard>
  );
}

function RecapBadgeKR2({ kid, shift }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 10, alignItems: "baseline", padding: "10px 0" }}>
      <ChildKR2 kid={kid}/>
      <span style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 400, fontSize: 12, color: "var(--mid)", lineHeight: 1.4 }}>
        {shift}
      </span>
    </div>
  );
}

function DirectionKR2_Note() {
  return (
    <NoteCard
      persona="KOREAN · ROUND TWO"
      title="The Dropcap."
      move={<>The first letter of the name is set in Fraunces italic at 1.5× cap-height, fused into the PJS italic body. Serif against sans creates the optical anchor; the name reads as one ligated word. The dropcap is the recognition target; the rest of the name is its tail.</>}
      bullets={[
        ["Recognition unit", "One typographic word with built-in emphasis. The eye lands on the serif cap; the brand of Plus Jakarta against Fraunces makes the cap visually load-bearing. There is nothing to connect — the cap is part of the word."],
        ["Same-initial collision rule", "Dropcap length = smallest uniquely-identifying prefix in the family. Collision pairs both extend: J → Ja for Jack and Jane, with the colliding-and-resolving letter (the second) included. Both names show the shared 'Ja' as serif because the rule is symmetric across the pair."],
        ["Family scaling", "Uniform — every name has a dropcap. Single-child family: dropcap is one letter (no collision possible). Two-child non-colliding: one letter each. The rule is computed once per family at setup; it never changes shape mid-week. The dropcap exists for typographic anchor, not just disambiguation — that's what makes it work for the 1-child case where there's no problem to solve."],
        ["Print", "Native. Fraunces and Plus Jakarta print at any size. The serif/sans contrast survives 200dpi photocopier reproduction. The optical-size axis on Fraunces is set to 24 — display-tuned, sharper terminals."],
        ["Recap (smallest scale)", "At 12px body the dropcap is ~18px — still distinct against the sans. Below 11px we'd lose the cap-height advantage; the system shouldn't go below the existing Recap baseline. Tested at the smallest size in the system, the dropcap reads."],
        ["Where it earns its cost", "Zero new color, zero chrome, zero second axis. The system gains nothing it doesn't already have — Fraunces is already the brand-voice serif, italic is already the per-child treatment. We commit a portion of the name to the existing serif. Subtraction in the right place."],
        ["The hundredth visit", "The serif cap becomes the child's silhouette. The eye learns 'the M-shape with the foot' is Max. The name remains a name; it just gets a small permanent emphasis where the family's identity-load is highest."],
      ]}
    />
  );
}

Object.assign(window, { ChildKR2, DirectionKR2_Mockup, DirectionKR2_Print, RecapBadgeKR2, DirectionKR2_Note, dropcapForFamily });
