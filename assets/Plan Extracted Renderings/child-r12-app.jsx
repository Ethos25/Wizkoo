/* global React, ReactDOM, DesignCanvas, DCSection, DCArtboard,
   PALETTES_R12, FrameCard, ComparisonRow, PaletteHero, PaletteRationale, RecapBadge */

function App() {
  return (
    <DesignCanvas>
      <DCSection id="frame" title="Five palettes · one ships" subtitle="Round twelve · three suggested directions plus two carte blanche">
        <DCArtboard id="frame-card" label="What round twelve is" width={760} height={540}><FrameCard/></DCArtboard>
        <DCArtboard id="row" label="All five at glance · same screen" width={1240} height={280}><ComparisonRow/></DCArtboard>
      </DCSection>
      {PALETTES_R12.map(p => (
        <DCSection key={p.id} id={p.id} title={p.badge + " · " + p.title} subtitle={p.tagline}>
          <DCArtboard id={p.id + "-hero"}      label="Hero · four children · 20px chips · subjects" width={760} height={580}><PaletteHero palette={p}/></DCArtboard>
          <DCArtboard id={p.id + "-rationale"} label="Rationale · risk · per-color notes"            width={580} height={540}><PaletteRationale palette={p}/></DCArtboard>
          <DCArtboard id={p.id + "-recap"}     label="Recap mastery shifts · reading scale"          width={460} height={480}><RecapBadge palette={p}/></DCArtboard>
        </DCSection>))}
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
