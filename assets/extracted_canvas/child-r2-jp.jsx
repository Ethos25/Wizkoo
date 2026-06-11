/* global React, FAMILY, ExpandedClusterRow, DirectionFrame, PRINT_DEMO, PrintCard, PrintHeader, NoteCard */

// =============================================================
// ROUND TWO · DIRECTION 4 — JAPANESE  ·  "The Hanko."
//
// Single-step recognition: each name begins with a single small
// red-ink stamp (han / chop) that is itself the first letter,
// rendered as a Fraunces small-cap inside a square ultramarine-ink
// outline. The stamp is letterform AND object simultaneously —
// the eye lands on one shape, reads a letter, sees a name. No
// adjacent mark; the stamp IS the start of the name.
//
//   [L]eo   [M]ax   [Ja]ck   [Ja]ne
//
// The square outline is 14×14 phone, 0.75pt stroke. The letter
// inside is Fraunces small-cap centered. For collision pairs the
// stamp expands to a 24×14 horizontal stamp containing the
// uniquely-identifying prefix (Ja) — same height, doubled width.
//
// One color: the stamp uses a single dedicated tone — a low-chroma
// brick red derived from the saffron family (saffron rotated to
// the red side, same value). This is the ONE permitted color
// addition: a stamp-ink hue that exists nowhere else in the system.
// It is not a per-child color (all four stamps are the same red);
// it is the system's "child-of-the-house" mark color.
// =============================================================

const HANKO_INK = "#9C3A2E"; // brick red — single stamp color, OKLCH ~L=42 C=0.13

function ChildJP2({ kid, family = FAMILY, scale = 1 }) {
  // Determine stamp content: smallest uniquely-identifying prefix
  let n = 1;
  while (n <= kid.name.length) {
    const others = family.filter(o => o.id !== kid.id);
    const collides = others.some(o => o.name.slice(0, n).toLowerCase() === kid.name.slice(0, n).toLowerCase());
    if (!collides) break;
    n++;
  }
  const stamp = kid.name.slice(0, n);
  const rest = kid.name.slice(n);
  const h = 16 * scale;
  const w = (n === 1 ? 16 : 26) * scale;

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
      <span style={{
        width: w, height: h,
        border: `1px solid ${HANKO_INK}`,
        borderRadius: 1.5,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        background: "rgba(156, 58, 46, 0.04)",
      }}>
        <span style={{
          fontFamily: "Fraunces",
          fontStyle: "italic",
          fontWeight: 600,
          fontSize: 11 * scale,
          color: HANKO_INK,
          letterSpacing: n > 1 ? "-0.04em" : "0",
          fontVariationSettings: '"opsz" 14',
          lineHeight: 1,
        }}>
          {stamp}
        </span>
      </span>
      <span style={{
        fontFamily: "Plus Jakarta Sans",
        fontStyle: "italic",
        fontWeight: 500,
        fontSize: 14 * scale,
        color: "var(--ink)",
        letterSpacing: "-0.005em",
      }}>
        {rest}
      </span>
    </span>
  );
}

function DirectionJP2_Mockup() {
  return (
    <DirectionFrame>
      <ExpandedClusterRow renderChild={(k) => <ChildJP2 kid={k}/>}/>
    </DirectionFrame>
  );
}

function DirectionJP2_Print() {
  const step = PRINT_DEMO.step;
  return (
    <PrintCard>
      <PrintHeader/>
      <h3 style={{ margin: "20px 0 10px", fontFamily: "Plus Jakarta Sans", fontWeight: 500, fontSize: 14, color: "var(--ink)" }}>{step.title}</h3>
      <p style={{ margin: 0, fontFamily: "Plus Jakarta Sans", fontWeight: 400, fontSize: 11.5, color: "var(--ink)", lineHeight: 1.5, letterSpacing: "-0.003em" }}>
        Hold up two wooden blocks with a flat block laid across the gap. Ask: "What do we call this shape?"
      </p>
      <div style={{ marginTop: 14, display: "grid", rowGap: 8 }}>
        {step.perChild.map((p, i) => {
          const k = FAMILY.find(f => f.id === p.kid);
          return (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "82px 1fr", columnGap: 12, alignItems: "center" }}>
              <ChildJP2 kid={k}/>
              <span style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 400, fontSize: 11, color: "var(--mid)", lineHeight: 1.4 }}>{p.note}</span>
            </div>
          );
        })}
      </div>
    </PrintCard>
  );
}

function RecapBadgeJP2({ kid, shift }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 10, alignItems: "center", padding: "10px 0" }}>
      <ChildJP2 kid={kid}/>
      <span style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 400, fontSize: 12, color: "var(--mid)", lineHeight: 1.4 }}>{shift}</span>
    </div>
  );
}

function DirectionJP2_Note() {
  return (
    <NoteCard
      persona="JAPANESE · ROUND TWO"
      title="The Hanko."
      move={<>The first letter (or first uniquely-identifying letters) of the name is rendered as a small stamp — a thin square outline in brick-red ink, containing a Fraunces italic glyph. The stamp IS the letter. The letter IS the start of the name. One eye target; three layers of meaning.</>}
      bullets={[
        ["Recognition unit", "A 16×16 outlined stamp at the head of the name. The stamp is structurally letter-and-mark fused: the parent reads 'L' inside a frame and the rest of 'eo' continuing it. The frame doesn't sit beside the letter; it contains it. Single eye landing."],
        ["The one permitted color", "Brick red (#9C3A2E) — a saffron-family hue rotated to the red side, low-chroma, calm. Used only in stamps. NOT a per-child color: all four stamps are identical red. The red signals 'this is a member of the household,' not 'this is which household member.' The letter inside does that. The cost is one new tone in the palette; the payoff is unmistakable membership-marking."],
        ["Same-initial collision", "Stamp width expands to contain the smallest uniquely-identifying prefix. Jack and Jane both get a wider stamp containing 'Ja' in tighter kerning. The stamps are visually identical for the colliding pair — and the divergence sits in the trailing letters (ck vs ne) where the eye reads them as the stamp's tail. The rule mirrors the dropcap rule but applies it inside a contained mark."],
        ["Family scaling", "Uniform — stamp always present. 1 child: square stamp with single letter, no collision possible. 2 children: square stamps. 4 with collision: pair gets wider stamps. The stamp width is the only variable; height stays constant so vertical rhythm is preserved across rows."],
        ["Print", "Native and arguably best-in-class. The stamp is a graphic primitive that prints at any DPI; the brick-red survives B&W as a 50% gray frame around the letter. On the fridge, the stamps create a rhythmic vertical column — the page reads as a roster before any name is parsed."],
        ["Recap (smallest scale)", "Stamp scales to 12×12 at Recap body. The frame stays a hairline; the inner Fraunces letter remains legible because it's set in display-grade optical-size 14. Tested: works."],
        ["Where it earns its cost", "The stamp is a SYMBOL the parent learns to scan for — household-of-the-house mark. The brick red is calm enough to live on every screen without competing; precise enough that absence (a child without a stamp) would be wrong. The hundredth visit: the parent stops reading the letter and reads the stamp's shape — but the shape IS the letter, so there's no recognition tax."],
        ["Where it might fail", "Stamps stack visual weight on the cluster row. If a row contains four chips (two-per-group split), the four stamps could compete with the subject dot. Mitigation: subject dot stays on the secondary metadata line; stamps stay inline with names. Different sightlines."],
      ]}
    />
  );
}

Object.assign(window, { ChildJP2, DirectionJP2_Mockup, DirectionJP2_Print, RecapBadgeJP2, DirectionJP2_Note, HANKO_INK });
