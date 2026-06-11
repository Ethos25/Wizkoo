/* global React, FAMILY, ExpandedClusterRow, DirectionFrame, PRINT_DEMO, PrintCard, PrintHeader, NoteCard */

// =============================================================
// ROUND TWO · DIRECTION 3 — DANISH  ·  "The Anchor Letter."
//
// Single-step recognition: the disambiguating letter inside each
// name is set in Plus Jakarta Sans 700 italic against the rest of
// the name at 400 italic. The eye reads the name's silhouette as
// a single shape with a load-bearing letter inside it.
//
//   *L*eo   *M*ax   J*a*ck   Ja*n*e
//
// For non-colliding names the anchor is the first letter (the
// distinctive head). For collision pairs (Jack/Jane) the anchor
// shifts to the FIRST DIVERGING letter — Jack's 'c' would be the
// shift point but a single c-anchor is harder to read; rule:
// anchor = first letter that disambiguates from collisions.
// For Jack: 'c' (Ja-c-k); for Jane: 'n' (Ja-n-e).
//
// No new color. No new ink. No new container. Pure use of the
// existing weight axis the system already has (400 / 500 / 700).
// =============================================================

function anchorIndex(name, family) {
  // First letter that uniquely identifies this name within family.
  const others = family.filter(o => o.name !== name);
  for (let i = 0; i < name.length; i++) {
    const ch = name[i].toLowerCase();
    const collides = others.some(o => i < o.name.length && o.name[i].toLowerCase() === ch
      && name.slice(0, i).toLowerCase() === o.name.slice(0, i).toLowerCase());
    if (!collides) return i;
  }
  return 0;
}

function ChildDK2({ kid, family = FAMILY }) {
  const idx = anchorIndex(kid.name, family);
  const before = kid.name.slice(0, idx);
  const anchor = kid.name[idx];
  const after = kid.name.slice(idx + 1);
  const baseStyle = {
    fontFamily: "Plus Jakarta Sans",
    fontStyle: "italic",
    fontSize: 14,
    color: "var(--ink)",
    letterSpacing: "-0.005em",
  };
  return (
    <span style={{ ...baseStyle, display: "inline-flex", alignItems: "baseline" }}>
      {before && <span style={{ ...baseStyle, fontWeight: 400 }}>{before}</span>}
      <span style={{
        ...baseStyle,
        fontWeight: 700,
        // a hairline ink underline below the anchor letter, half-stroke,
        // so the anchor is also marked by ink density at the baseline
        borderBottom: "1.5px solid var(--ink)",
        paddingBottom: 1,
        marginBottom: -1,
      }}>
        {anchor}
      </span>
      {after && <span style={{ ...baseStyle, fontWeight: 400 }}>{after}</span>}
    </span>
  );
}

function DirectionDK2_Mockup() {
  return (
    <DirectionFrame>
      <ExpandedClusterRow renderChild={(k) => <ChildDK2 kid={k}/>}/>
    </DirectionFrame>
  );
}

function DirectionDK2_Print() {
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
            <div key={i} style={{ display: "grid", gridTemplateColumns: "70px 1fr", columnGap: 12, alignItems: "baseline" }}>
              <ChildDK2 kid={k}/>
              <span style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 400, fontSize: 11, color: "var(--mid)", lineHeight: 1.4 }}>{p.note}</span>
            </div>
          );
        })}
      </div>
    </PrintCard>
  );
}

function RecapBadgeDK2({ kid, shift }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 10, alignItems: "baseline", padding: "10px 0" }}>
      <ChildDK2 kid={kid}/>
      <span style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 400, fontSize: 12, color: "var(--mid)", lineHeight: 1.4 }}>{shift}</span>
    </div>
  );
}

function DirectionDK2_Note() {
  return (
    <NoteCard
      persona="DANISH · ROUND TWO"
      title="The Anchor Letter."
      move={<>One letter inside each name is set in 700 weight with a hairline ink underline; the rest of the name is 400. The disambiguator lives <em style={{fontFamily:"Fraunces",fontStyle:"italic"}}>inside</em> the name. The name reads as a silhouette with a weighted center of gravity.</>}
      bullets={[
        ["Recognition unit", "One italic word with one weighted letter. The eye reads the silhouette before it parses any glyph; the heavy letter is the silhouette's load-bearing point. No second element to connect."],
        ["Anchor rule", "The anchor is the first letter that uniquely identifies the name within the family. Non-colliding names: anchor = first letter (Leo → 𝐋eo, Max → 𝐌ax). Colliding pairs: anchor shifts to the first diverging letter (Jack → Ja𝐜k, Jane → Ja𝐧e). The rule is computed once per family."],
        ["Same-initial collision", "Resolved at the disambiguating letter itself. The anchor IS the divergence — Jack's bold 'c' and Jane's bold 'n' are the visual difference between the two names. The eye doesn't have to compare; the anchor declares the difference."],
        ["Family scaling", "Uniform: every name has an anchor regardless of family size. 1 child: anchor = first letter (no collision). 2 children non-colliding: first letters. 4 children with collision: rule auto-resolves. No conditional architecture; just one rule that handles every case."],
        ["Print", "Survives B&W at any toner density because weight contrast prints cleanly. The hairline underline doubles the signal at small sizes — when weight starts losing optical legibility below 9pt, the underline still reads."],
        ["Recap (smallest scale)", "Tested at 12px Recap body. The 700/400 contrast survives down to 11px; below that the underline carries. The mastery shift sentence reads as one continuous line with one heavy letter — the parent reads 'the J-a-N-e shift' as one shape, not two."],
        ["Where it earns its cost", "Zero new system primitives. Uses Plus Jakarta's existing weight axis. Subtraction in the right place: round one's failure was a separate mark; this direction puts the mark inside the type."],
        ["The hundredth visit", "The bold letter becomes the child's signature within the word. Parents start to remember not 'Jack' but 'Ja-c-k with the heavy c.' The name never stops being a name; it gains a permanent typographic fingerprint."],
      ]}
    />
  );
}

Object.assign(window, { ChildDK2, DirectionDK2_Mockup, DirectionDK2_Print, RecapBadgeDK2, DirectionDK2_Note, anchorIndex });
