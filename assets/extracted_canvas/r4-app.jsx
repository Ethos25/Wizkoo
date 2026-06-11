/* global React, ReactDOM, DesignCanvas, DCSection, DCArtboard,
   Ledger, Tick, IndexView, Inlay, useExpand */

function DirectionSection({ id, title, subtitle, Component, label, h1 = 1100, h2 = 1400 }) {
  const [openA, setOpenA] = useExpand(null);
  const [openB, setOpenB] = useExpand("eps");
  return (
    <DCSection id={id} title={title} subtitle={subtitle}>
      <DCArtboard id={`${label}-default`} label={`${label} — Default`} width={390} height={h1}>
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
    <DesignCanvas title="The Plan · Today View — Round 4"
      subtitle="Refinement, not adventure. Plus Jakarta Sans dominant; Fraunces reserved; color small and exact; planetarium band locked.">

      <DirectionSection id="d1" Component={Ledger} label="Ledger" h1={1100} h2={1500}
        title="01 — Ledger"
        subtitle="Central choice: a typographic ledger with a left-rail mono time column and a 6px subject-color dot before the subject mono label. No cards, no fills — only rules between rows. Trade-off: visually quiet to the point of austere; first-time users must read rather than glance. The hundredth-time test passes because the rail and dots become known landmarks; the page is a place the eye returns to without thinking, like a familiar table of contents." />

      <DirectionSection id="d2" Component={Tick} label="Tick" h1={1200} h2={1600}
        title="02 — Tick"
        subtitle="Central choice: a single 1px hairline rail down the page; each cluster's subject is rendered as one 8px filled square — a tick — sitting on the rail. The tick is the only color element. Trade-off: the rail metaphor must read on first encounter; the colored ticks are small enough that they require the rail to anchor them. The hundredth-time test passes because the tick pattern down the rail becomes a fingerprint of the day's shape — the parent reads tomorrow's day at a glance because she knows the tick rhythm of every common arrangement." />

      <DirectionSection id="d3" Component={IndexView} label="Index" h1={1100} h2={1500}
        title="03 — Index"
        subtitle="Central choice: a numbered typographic index — 01, 02, 03 — with subject named in subject-color mono letters at the foot of each entry. Color lives inside the typography itself; there is no other color element. Trade-off: the surface reads almost as a black-and-white book and may want for visual punctuation on first encounter. The hundredth-time test passes because the page has the cadence of a well-set book; the eye finds its place by rhythm and number, not by chrome, and that rhythm is unfatiguing across years." />

      <DirectionSection id="d4" Component={Inlay} label="Inlay" h1={1100} h2={1500}
        title="04 — Inlay"
        subtitle="Central choice: a 16px outline square with a 6px filled subject-color square inlaid in the center; one inlay per cluster, set in a left column. The inlay reads as a brand-grade glyph rather than a UI sticker. Trade-off: the inlay's color is small enough to sit on the edge of peripheral perception; readers learn the palette by accumulation. The hundredth-time test passes because the inlay column is consistent and gentle — a small, made object the parent grows fond of, not a louder element competing for attention each morning." />

    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
