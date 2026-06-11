/* global React, FAMILY, CLUSTER_DEMO, ExpandedClusterRow, DirectionFrame, PRINT_DEMO */

// =============================================================
// DIRECTION 3 — BRAZILIAN  ·  "The Signature Mark."
//
// Central move: defends the second color axis with rigor by making
// it almost-not-color. Each child gets one warm low-chroma hue from
// a saffron-derived family — clay, olive, sage, rust — that sits
// inside the warmth-temperature of #F8F4E9 chalk and never competes
// with subject hues. The hue appears as a 3px vertical mark to the
// LEFT of the name, like the binding signature on a hand-bound book.
// Never as a fill, never as a badge. The mark is 14px tall, lighter
// than the descender depth, sitting on the baseline.
//
// Tertiary palette (deliberately desaturated, OKLCH-tuned to live
// in the same warmth as Warm Chalk):
//   Leo  — clay   #B5704C
//   Max  — olive  #8C8A4E
//   Jack — sage   #6E8C6E
//   Jane — rust   #A05A4E
//
// All four sit at ~L=58, C=0.06–0.08. They are warm, low-chroma,
// and visually a quartet. They do NOT compete with subject hues
// because they are tertiary (mixed) where subject hues are pure.
// =============================================================

const HUE = {
  leo:  "#B5704C", // clay
  max:  "#8C8A4E", // olive
  jack: "#6E8C6E", // sage
  jane: "#A05A4E", // rust
};

const HUE_LABEL = {
  leo: "CLAY", max: "OLIVE", jack: "SAGE", jane: "RUST",
};

function ChildBR({ kid }) {
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      paddingLeft: 0,
    }}>
      <span style={{
        width: 3,
        height: 14,
        background: HUE[kid.id],
        borderRadius: 0.5,
        display: "inline-block",
      }} />
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

function DirectionBR_Mockup() {
  return (
    <DirectionFrame>
      <ExpandedClusterRow
        renderChild={(k) => <ChildBR kid={k}/>}
      />
    </DirectionFrame>
  );
}

// ---------- Print translation ----------
function DirectionBR_Print() {
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
              gridTemplateColumns: "70px 1fr",
              columnGap: 10,
              alignItems: "baseline",
            }}>
              <ChildBR kid={k}/>
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

function DirectionBR_Note() {
  return (
    <NoteCard
      persona="BRAZILIAN"
      title="The Signature Mark."
      move={<>One 3px vertical mark to the left of each name, in a warm low-chroma hue from a tertiary family (clay, olive, sage, rust). Never a fill. Never a badge. The mark is the binding-signature of a hand-bound book.</>}
      bullets={[
        ["Rationale", "The cost of a second color axis is real but bounded: tertiary hues (~L=58, C=0.07) sit inside the warmth of Warm Chalk and never compete with subject brights. The mark is 3×14px — smaller than a subject dot's optical weight. At reading speed, the parent learns clay-is-Leo within a week; at glance, the eye reads four warm tones as 'four kids' without needing to decode."],
        ["Same-initial collision", "Jack-sage / Jane-rust resolve the J/J collision instantly. Two greenish names, two reddish names, paired by warmth not initial."],
        ["Family scaling", "1 child: mark suppressed entirely (italic-only, no second axis). 2 children: clay + sage (one warm, one cool). 3 children: clay + olive + sage. 4: full quartet. Rule scales by family size — system only earns the color axis when the payload demands it."],
        ["Print", "Tertiary hues print well in CMYK and survive grayscale conversion as differentiable tones (the mark stays visible even in B&W). On the fridge, the mark is what the eye finds first."],
        ["Where it earns its cost", "Block Sheet per-child notes: a column of four colored marks down the page reads as a per-child rhythm without the parent having to parse names. On Recap mastery shifts the mark becomes the badge."],
        ["Where it fails", "Color-keyed names mean every screen with children gets a second hue. Risk: clutter at the cluster level when both subject dots and child marks compete for attention. Mitigation: child mark is left of name; subject dot is below name; they don't share a sightline."],
      ]}
    />
  );
}

Object.assign(window, { ChildBR, DirectionBR_Mockup, DirectionBR_Print, DirectionBR_Note, HUE });
