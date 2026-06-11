/* global React, ReactDOM, DesignCanvas, DCSection, DCArtboard,
   Loom, Constellation, Roster, Score, useExpand */

function DirectionSection({ id, title, subtitle, Component, label, expandedId = "eps", h1 = 900, h2 = 1100 }) {
  const [openA, setOpenA] = useExpand(null);
  const [openB, setOpenB] = useExpand(expandedId);
  return (
    <DCSection id={id} title={title} subtitle={subtitle}>
      <DCArtboard id={`${label}-collapsed`} label={`${label} — Default`} width={390} height={h1}>
        <Component openId={openA} setOpen={setOpenA} />
      </DCArtboard>
      <DCArtboard id={`${label}-expanded`} label={`${label} — Cluster 2 expanded`} width={390} height={h2}>
        <Component openId={openB} setOpen={setOpenB} />
      </DCArtboard>
    </DCSection>
  );
}

function App() {
  return (
    <DesignCanvas title="The Plan · Today View — Round 2"
      subtitle="Family of four · color is wayfinding · 20-minute atomic block · 390px">

      <DirectionSection id="d1" Component={Loom} label="Loom" h1={900} h2={1200}
        title="01 — Loom"
        subtitle="The morning is woven. Four narrow columns, one per child, time runs top → bottom. Blocks are colored bars threaded across the columns of the kids in them — a same-room block is one unbroken bar across all four, a parallel block splits into per-child segments at the same row, an independent block is a single bar in one column. Color = subject. Position = child. Span = together-or-apart. Trade-off: asks the parent to read a textile diagram instead of words; rewards her with a layout that no other planning app produces. Elite because it answers “who is doing what together” with geometry alone." />

      <DirectionSection id="d2" Component={Constellation} label="Constellation" h1={1000} h2={1200}
        title="02 — Constellation"
        subtitle="Extends Wizkoo’s planetarium ambient into a celestial chart. The day descends as constellations of children-as-stars on a deep-ink sky. Star color is the subject. Lines drawn between stars in the same block say “together”; disjoint stars say “in parallel.” Star size is age. Saffron is the literal lodestar — pace, today, and the start affordance. Trade-off: the most expressive direction, ceremonial in feel; could read as theater on a routine Tuesday. Elite because the wayfinding system IS the brand voice — material and metaphor are one thing." />

      <DirectionSection id="d3" Component={Roster} label="Roster" h1={1100} h2={1400}
        title="03 — Roster"
        subtitle="A horizontal lane per child, stacked young → old. Each lane is that child’s morning as a row of color tokens — same width, same height, only color and presence varying. The family’s togetherness reads as visual rhyme: aligned colors across rows = same-room; staggered = split. Cluster details live below the lanes as a typographic register. Trade-off: the most reserved direction; subtle until learned. Elite because color does ALL the wayfinding — there is nothing else to interpret, and the lanes can extend horizontally to show a full week with no design changes." />

      <DirectionSection id="d4" Component={Score} label="Score" h1={1000} h2={1300}
        title="04 — Score"
        subtitle="A musical score. Four staves, one per child. Time runs left → right. Each block is a colored measure on the staves of every child involved — a same-room block stacks vertically across all four staves; a split cluster reads as divisi. Clusters are barlines that group measures. Pace is a tempo mark, the day header is the title block of a piece. Trade-off: borrows a metaphor the parent has to recognize; the score idiom is foreign to some. Elite because it makes the family’s morning feel composed — a thing arranged with care, played in order, with named voices." />

    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
