/* global React, FAMILY, CLUSTER_DEMO, ExpandedClusterRow, DirectionFrame, PRINT_DEMO, PrintCard, PrintHeader, NoteCard */

// =============================================================
// ROUND TWO · DIRECTION 1 — BRAZILIAN  ·  "The Chromatic Token."
//
// Single-step recognition: a filled rounded chip is the recognition
// target. The chip carries the initial(s) as a knockout glyph — chip
// and letter are the same element, the same color region. The eye
// lands on one shape and reads the child.
//
// Chip dimensions: 18×18 phone (8.5pt print), radius 4. Letter set
// in Plus Jakarta Sans 600 italic, white-knockout, optical-size 11px.
//
// Color: warm low-chroma palette (OKLCH ~L=52, C=0.10–0.12). Inside
// the warmth-temperature of Warm Chalk; saturated enough to register
// as identity, low-chroma enough not to compete with subject brights.
//
//   Max   #B85C3A   terracotta
//   Leo   #6B7A3D   olive
//   Jack  #2E6E6E   teal
//   Jane  #8E4A6E   plum
//
// Crucially, hue assignments are sibling-pair antonyms:
// Max/Leo are warm/green (warm pair), Jack/Jane are teal/plum (cool
// pair). The same-initial collision (J/J) is solved by chromatic
// opposition before any letter is read.
//
// Same-initial chip uses two-letter knockout: "Ja" plus a beat of
// kerning, "ck" / "ne" — but for sub-18px chip, we hard-rule single
// letter + chromatic opposition is sufficient. Chip stays one letter.
// The two-letter rule kicks in only on Recap badges where chip scales
// to 24px.
// =============================================================

const TOKEN = {
  max:  { fill: "#B85C3A", initial: "M", label: "TERRACOTTA" },
  leo:  { fill: "#6B7A3D", initial: "L", label: "OLIVE" },
  jack: { fill: "#2E6E6E", initial: "J", label: "TEAL" },
  jane: { fill: "#8E4A6E", initial: "J", label: "PLUM" },
};

function ChildBR2({ kid, size = 18, glyph }) {
  const t = TOKEN[kid.id];
  const fontSize = Math.round(size * 0.61);
  const text = glyph ?? t.initial;
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
    }}>
      <span style={{
        width: size, height: size,
        borderRadius: Math.round(size * 0.22),
        background: t.fill,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Plus Jakarta Sans",
        fontStyle: "italic",
        fontWeight: 600,
        fontSize: fontSize,
        color: "#FAFAFA",
        letterSpacing: text.length > 1 ? "-0.02em" : "0",
        lineHeight: 1,
        flexShrink: 0,
      }}>
        {text}
      </span>
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

// Recap-scale (smallest test) — chip alone, no name; or chip+name as compact
function BadgeBR2({ kid, withName = true }) {
  return <ChildBR2 kid={kid} size={20}/>;
}

function DirectionBR2_Mockup() {
  return (
    <DirectionFrame>
      <ExpandedClusterRow
        renderChild={(k) => <ChildBR2 kid={k}/>}
      />
    </DirectionFrame>
  );
}

function DirectionBR2_Print() {
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
            <div key={i} style={{ display: "grid", gridTemplateColumns: "78px 1fr", columnGap: 12, alignItems: "center" }}>
              <ChildBR2 kid={k} size={17}/>
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

function RecapBadgeBR2({ kid, shift }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 10, alignItems: "center", padding: "10px 0" }}>
      <ChildBR2 kid={kid} size={22}/>
      <span style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 400, fontSize: 12, color: "var(--mid)", lineHeight: 1.4 }}>
        {shift}
      </span>
    </div>
  );
}

function DirectionBR2_Note() {
  return (
    <NoteCard
      persona="BRAZILIAN · ROUND TWO"
      title="The Chromatic Token."
      move={<>The chip and the initial are the same element — one filled rounded shape, one knockout glyph, one color region. The eye lands on one target and reads the child. Color carries identity; the letter confirms.</>}
      bullets={[
        ["Recognition unit", "A single 18×18 chip with knockout initial. Chip color is the identifier; initial is the verifier. The parent doesn't read 'orange-square then M' — she reads 'Max' as a colored shape that happens to contain a letter."],
        ["The color axis, defended", "Four warm low-chroma hues (OKLCH ~L=52, C=0.10): terracotta, olive, teal, plum. Sit inside the warmth-temperature of Warm Chalk. They do NOT compete with subject brights because they're 25–30% lower-chroma and never appear at the same optical scale (subject dot is 5px; child chip is 18px — different size class, different read register)."],
        ["Same-initial collision", "Solved chromatically before the letter is read. Jack-teal and Jane-plum are the family's cool pair — they are visually antonyms. The J on each chip is identical; it doesn't have to do the work."],
        ["Family scaling", "Uniform: chip is always present, single-letter, regardless of family size. The 1-child case still gets a chip — the system reads as 'this is your child' rather than 'this child is one of several.' No conditional rules; no announcing-a-problem-that-doesn't-exist concern because the chip becomes the avatar, not the disambiguator."],
        ["Print", "B&W translation: chip becomes ink-filled with chalk-knockout initial. The chromatic distinction is lost but the chip is still the recognition unit, and on the Block Sheet four ink chips reading down the page rhyme as a per-child rhythm. CMYK print preserves the four hues at full fidelity."],
        ["Recap (smallest scale)", "At 22px chip the form is unambiguous. Below 16px the knockout letter loses optical clarity; we don't go smaller. The Recap mastery shift line uses chip-as-prefix to the shift sentence — chip integrates with the sentence's baseline as if it were a colored sentence-opener."],
        ["The hundredth visit", "Color becomes the parent's shorthand: 'the teal one.' The letter recedes; the chromatic identity becomes the child's. This is the cost AND the payoff — the parent is committing to a per-child color memory."],
      ]}
    />
  );
}

Object.assign(window, { ChildBR2, BadgeBR2, DirectionBR2_Mockup, DirectionBR2_Print, RecapBadgeBR2, DirectionBR2_Note, TOKEN });
