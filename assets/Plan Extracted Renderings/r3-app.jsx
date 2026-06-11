/* global React, ReactDOM, DesignCanvas, DCSection, DCArtboard,
   Pictographic, Material, Diagrammatic, Cartographic, useExpand */

function DirectionSection({ id, title, subtitle, Component, label, h1 = 1100, h2 = 1400 }) {
  const [openA, setOpenA] = useExpand(null);
  const [openB, setOpenB] = useExpand("eps");
  return (
    <DCSection id={id} title={title} subtitle={subtitle}>
      <DCArtboard id={`${label}-collapsed`} label={`${label} — Default`} width={390} height={h1}>
        <Component openId={openA} setOpen={setOpenA} />
      </DCArtboard>
      <DCArtboard id={`${label}-expanded`} label={`${label} — Cluster 3 expanded`} width={390} height={h2}>
        <Component openId={openB} setOpen={setOpenB} />
      </DCArtboard>
    </DCSection>
  );
}

function App() {
  return (
    <DesignCanvas title="The Plan · Today View — Round 3"
      subtitle="Four design languages · brand band over cream · names always written · 390px">

      <DirectionSection id="d1" Component={Pictographic} label="Pictographic" h1={1300} h2={1600}
        title="01 — Pictographic"
        subtitle="Anchored on signage. Each subject is a road-sign-clear pictogram (plus, book, flask, globe, palette) stamped into a saffron-bordered tile in subject color. Children are named in full — Jack and Jane are unambiguous because the design abandons initials. The day reads as a stack of stamped subject signs with name strips underneath. Trade-off: more verbose than abstract directions; pictograms must be learned once. Elite because every glyph names a thing in the world the parent already recognizes, and every name is spelled — three-second test passes by being literal." />

      <DirectionSection id="d2" Component={Material} label="Material" h1={1700} h2={2000}
        title="02 — Material"
        subtitle="Anchored on paper. Each cluster is a real card on chalk: 1.5px ink keyline, 8/8 saffron drop, a tabbed file-folder edge in subject color naming the subject. Children are full-name ribbons in a row across the lower edge — present kids fill with subject color, absent kids are empty. Trade-off: louder than typographic directions; the cards take up vertical space. Elite because the card vocabulary is universally readable, the tabs name subjects in words, and the brand’s saffron-shadow signature is doing real wayfinding work, not decoration." />

      <DirectionSection id="d3" Component={Diagrammatic} label="Diagrammatic" h1={1500} h2={1800}
        title="03 — Diagrammatic"
        subtitle="Anchored on transit maps. Time descends as a single thick line that changes color at every station — five stops, five subjects. Each station shows the cluster name spelled out, the subject named, and four name-tags pinned to the platform. The split cluster forks into two named tracks (Jack/Jane on one, Leo/Max on the other). Trade-off: borrows a metaphor; works only if the parent has ridden a subway. Elite because color-coded lines and labeled stops is one of the most pre-installed wayfinding vocabularies in adult life, and the lesson from prior rounds — always spell names out — is preserved at every node." />

      <DirectionSection id="d4" Component={Cartographic} label="Cartographic" h1={1500} h2={1800}
        title="04 — Cartographic"
        subtitle="Anchored on maps. The day is a tall printed map: five stacked regions, one per cluster, each filled with subject color and gently hatched as territory. Region height is proportional to minutes — 20m is a small province, 60m is a large one. Children are name-flags planted in their region; split clusters show two labeled groups. A scale bar in the corner stands in for pace; a small north-arrow line names time. Trade-off: print-feeling, deliberately old-school; some will read it as quaint. Elite because the map vocabulary — region, scale, key, flag — is universal; a parent who has never seen Wizkoo reads territory and labels in a glance." />

    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
