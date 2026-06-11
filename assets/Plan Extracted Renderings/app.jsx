/* global React, ReactDOM, DesignCanvas, DCSection, DCArtboard,
   Editorial, PaperLight, Index, Planetarium,
   CLUSTERS_DEFAULT, useExpand */

function DirectionSection({ id, title, subtitle, Component, label }) {
  const [openA, setOpenA] = useExpand(null);
  const [openB, setOpenB] = useExpand("lab");
  return (
    <DCSection id={id} title={title} subtitle={subtitle}>
      <DCArtboard id={`${label}-collapsed`} label={`${label} — Default`} width={390} height={844}>
        <Component clusters={CLUSTERS_DEFAULT} openId={openA} setOpen={setOpenA} />
      </DCArtboard>
      <DCArtboard id={`${label}-expanded`} label={`${label} — Cluster expanded`} width={390} height={900}>
        <Component clusters={CLUSTERS_DEFAULT} openId={openB} setOpen={setOpenB} />
      </DCArtboard>
    </DCSection>
  );
}

function App() {
  return (
    <DesignCanvas title="The Plan · Today View" subtitle="Four directions · 390px · Tap a cluster to expand">

      <DirectionSection id="d1" Component={Editorial} label="Editorial"
        title="01 — Editorial"
        subtitle="The day reads like the front page of a small newspaper. Massive Fraunces theme name dominates; clusters are numbered stories with hairline rules between them. Saffron is a single dateline mark and the underline beneath each Start. Trade-off: the parent has to read down the page rather than scan tiles — answers “what are we doing today” with prose, not chrome." />

      <DirectionSection id="d2" Component={PaperLight} label="Paper & Light"
        title="02 — Paper & Light"
        subtitle="The brand’s saffron-offset shadow becomes the visual signature. Cluster cards are physical paper objects on warm chalk: 1.5px ink keyline, 8/8 saffron drop. The screen feels pinned, tactile, considered. Trade-off: louder than the other directions; the cards demand attention before the day header does." />

      <DirectionSection id="d3" Component={Index} label="Index"
        title="03 — Index"
        subtitle="A watchmaker’s plate. No card chrome at all — the day is a labeled register, the day strip is a row of register marks, the pace line is a barometer with a single saffron pip. Type does the work. Trade-off: the most reserved direction; rewards repeat use, asks the parent to learn it once." />

      <DirectionSection id="d4" Component={Planetarium} label="Planetarium"
        title="04 — Planetarium"
        subtitle="The marketing site’s night-sky footer becomes the ambient surface of the day. The header lives in deep ink with stars; chalk takes over for clusters. Saffron is the sun coming up over the fold. Trade-off: most expressive, most atmospheric — could feel ceremonial on a routine Tuesday for some families." />

    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
