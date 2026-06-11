/* global React, ReactDOM, DesignCanvas, DCSection, DCArtboard,
   TodayView, WeekView, ClusterView, BlockView,
   PlanGeneratorPair,
   WeekSheet, MaterialsMaster, BlockSheet, BLOCK_DATA_GH,
   KIDS, COLORS, SUBJECTS, NameB, ChipB, SubjectMark */

function FrameCard() {
  return (
    <div style={{ width: 760, height: 540, background: "var(--chalk)", padding: "32px 38px", boxSizing: "border-box", fontFamily: "Plus Jakarta Sans", color: "var(--ink)" }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "var(--meta)" }}>THE PLAN · FULL RE-RENDERING PASS</div>
      <h2 style={{ margin: "10px 0 0", fontFamily: "Fraunces", fontWeight: 500, fontStyle: "italic", fontSize: 36, letterSpacing: "-0.02em", lineHeight: 1.05 }}>Locked treatments, every surface.</h2>
      <p style={{ marginTop: 14, fontSize: 13, color: "var(--mid)", lineHeight: 1.6, textWrap: "pretty", maxWidth: 620 }}>
        Atelier Jewels children · eight-subject palette · Form B serif initial + Jakarta italic body · subject label in ink with 1.5px colored underline. Applied across four digital views and three print artifacts. No design exploration; rendering only.
      </p>
      <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {KIDS.map(k => { const c = COLORS[k.id]; return (
          <div key={k.id} style={{ background: "var(--paper)", border: "1px solid #ECE7DA", padding: "10px 12px" }}>
            <NameB kid={k} scale={0.85}/>
            <div className="mono" style={{ marginTop: 6, fontSize: 8.5, color: "var(--faint)", letterSpacing: "0.18em" }}>{c.name.toUpperCase()} · {c.fill}</div>
          </div>); })}
      </div>
      <div style={{ marginTop: 12, padding: "12px 14px", background: "var(--paper)", border: "1px solid #ECE7DA", display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
        {Object.keys(SUBJECTS).map(s => <SubjectMark key={s} subject={s} width={72} dense/>)}
      </div>
      <div style={{ marginTop: 14, padding: "10px 14px", background: "var(--paper)", border: "1px solid #ECE7DA" }}>
        <div className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.22em" }}>WATCH-LIST · 20PX CHIPS</div>
        <div style={{ marginTop: 8, display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
          {KIDS.map(k => <ChipB key={k.id} kid={k}/>)}
          <span style={{ width: 1, height: 16, background: "#E0DED6", margin: "0 6px" }}/>
          {Object.keys(SUBJECTS).map(s => <SubjectMark key={s} subject={s} width={56} dense/>)}
        </div>
        <p style={{ margin: "8px 0 0", fontSize: 11, color: "var(--mid)", lineHeight: 1.5 }}>Lapis ↔ Ink: same hue, defended by 17 L. Forest Emerald ↔ Malachite: 35 L gap. Citrine ↔ Ember: hue + chroma only. Garnet ↔ Vermilion: clean.</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <DesignCanvas>
      <DCSection id="frame" title="What this round is" subtitle="Seven surfaces · re-rendered with locked Atelier Jewels + eight-subject + Form B">
        <DCArtboard id="frame-card" label="Brief + system" width={760} height={540}><FrameCard/></DCArtboard>
      </DCSection>

      <DCSection id="generator" title="Plan Generator · phone surface" subtitle="Planetarium header · day strip · theme · five-cluster ledger · default + expanded">
        <DCArtboard id="generator-pair" label="Plan Generator · default + cluster 3 expanded" width={920} height={1060}><PlanGeneratorPair/></DCArtboard>
      </DCSection>

      <DCSection id="digital" title="Digital views" subtitle="Today · Week · Cluster · Block">
        <DCArtboard id="today"   label="View 1 · Today (re-rendered)"           width={1080} height={920}><TodayView/></DCArtboard>
        <DCArtboard id="week"    label="View 2 · Week (re-rendered)"            width={1240} height={870}><WeekView/></DCArtboard>
        <DCArtboard id="cluster" label="View 3 · Cluster (re-rendered)"         width={1080} height={1000}><ClusterView/></DCArtboard>
        <DCArtboard id="block"   label="View 4 · Block (new visual direction)"  width={1080} height={1180}><BlockView/></DCArtboard>
      </DCSection>

      <DCSection id="print" title="Print artifacts" subtitle="Same vocabulary · paper register · no saffron">
        <DCArtboard id="weeksheet"  label="Print 1 · Week Sheet (landscape · fridge)"      width={1300} height={920}><WeekSheet/></DCArtboard>
        <DCArtboard id="master"     label="Print 2 · Materials Master (portrait · counter)" width={800} height={1140}><MaterialsMaster/></DCArtboard>
        <DCArtboard id="blocksheet" label="Print 3 · Block Sheet · Roman trade routes"     width={800} height={1140}><BlockSheet data={BLOCK_DATA_GH}/></DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
