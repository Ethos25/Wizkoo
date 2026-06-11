/* global React, ReactDOM, DesignCanvas, DCSection, DCArtboard, FAMILY,
   PhoneFrame, PrintExcerpt, PaletteCard, RecapStrip,
   DIRECTION_1, DIRECTION_2, DIRECTION_3, Note1, Note2, Note3,
   ChildD1, SubjectD1, ChildD2, SubjectD2, ChildD3, SubjectD3, D1, D2, D3 */

// =============================================================
// PER-CHILD VISUAL IDENTITY · ROUND THREE
// Color landscape + signal-form pairing
// =============================================================

function App() {
  return (
    <DesignCanvas>

      <DCSection id="overview" title="Overview" subtitle="Round-three frame · the two-axis problem · three directions compared at the screen scale">
        <DCArtboard id="frame" label="What round three is solving" width={620} height={560}>
          <FrameCard/>
        </DCArtboard>
        <DCArtboard id="compare-strip" label="One row · three pairings · same screen" width={760} height={560}>
          <CompareStrip/>
        </DCArtboard>
      </DCSection>

      <DCSection id="d1" title="01 · Two Worlds" subtitle="Hue & chroma separation · subject dot stays, child chip joins · form contrast by scale">
        <DCArtboard id="d1-palette" label="Nine-color landscape" width={620} height={560}>
          <PaletteCard direction={DIRECTION_1} kicker="DIRECTION 01 · TWO WORLDS" title="Bright primaries for subjects · warm earth-tones for children"/>
        </DCArtboard>
        <DCArtboard id="d1-cluster" label="Expanded cluster · phone" width={440} height={1060}>
          <PhoneFrame direction={DIRECTION_1}/>
        </DCArtboard>
        <DCArtboard id="d1-print" label="Block Sheet · per-child" width={520} height={520}>
          <PrintExcerpt ChildComponent={ChildD1}/>
        </DCArtboard>
        <DCArtboard id="d1-recap" label="Recap badge · smallest scale" width={440} height={420}>
          <RecapStrip ChildComponent={ChildD1}/>
        </DCArtboard>
        <DCArtboard id="d1-note" label="Rationale" width={580} height={1060}>
          <Note1/>
        </DCArtboard>
      </DCSection>

      <DCSection id="d2" title="02 · Mono Subjects" subtitle="Subjects shed all color · children own the only color axis · maximum subtraction">
        <DCArtboard id="d2-palette" label="Nine-color landscape" width={620} height={560}>
          <PaletteCard direction={DIRECTION_2} kicker="DIRECTION 02 · MONO SUBJECTS" title="Five ink form-marks for subjects · saturated chips for children"/>
        </DCArtboard>
        <DCArtboard id="d2-cluster" label="Expanded cluster · phone" width={440} height={1060}>
          <PhoneFrame direction={DIRECTION_2}/>
        </DCArtboard>
        <DCArtboard id="d2-print" label="Block Sheet · per-child" width={520} height={520}>
          <PrintExcerpt ChildComponent={ChildD2}/>
        </DCArtboard>
        <DCArtboard id="d2-recap" label="Recap badge · smallest scale" width={440} height={420}>
          <RecapStrip ChildComponent={ChildD2}/>
        </DCArtboard>
        <DCArtboard id="d2-note" label="Rationale" width={580} height={1060}>
          <Note2/>
        </DCArtboard>
      </DCSection>

      <DCSection id="d3" title="03 · The Underline" subtitle="Subject color retreats beneath its label · children carry the active mark · two color forms, two roles">
        <DCArtboard id="d3-palette" label="Nine-color landscape" width={620} height={560}>
          <PaletteCard direction={DIRECTION_3} kicker="DIRECTION 03 · THE UNDERLINE" title="Subject color as 1.5px underline · child color as filled chip"/>
        </DCArtboard>
        <DCArtboard id="d3-cluster" label="Expanded cluster · phone" width={440} height={1060}>
          <PhoneFrame direction={DIRECTION_3}/>
        </DCArtboard>
        <DCArtboard id="d3-print" label="Block Sheet · per-child" width={520} height={520}>
          <PrintExcerpt ChildComponent={ChildD3}/>
        </DCArtboard>
        <DCArtboard id="d3-recap" label="Recap badge · smallest scale" width={440} height={420}>
          <RecapStrip ChildComponent={ChildD3}/>
        </DCArtboard>
        <DCArtboard id="d3-note" label="Rationale" width={580} height={1060}>
          <Note3/>
        </DCArtboard>
      </DCSection>

    </DesignCanvas>
  );
}

// ---------- Frame card ----------
function FrameCard() {
  return (
    <div style={{
      width: 620, height: 560, background: "var(--chalk)",
      padding: "32px 36px", boxSizing: "border-box",
      fontFamily: "Plus Jakarta Sans", color: "var(--ink)",
    }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#8C91A5", textTransform: "uppercase" }}>
        ROUND THREE · FRAME
      </div>
      <h2 style={{ margin: "10px 0 0", fontFamily: "Fraunces", fontWeight: 600, fontSize: 30, lineHeight: 1.05, letterSpacing: "-0.018em" }}>
        Two color axes — and the parent must <em style={{ fontWeight: 500 }}>never</em> confuse which one she is reading.
      </h2>
      <p style={{ marginTop: 16, fontSize: 13.5, lineHeight: 1.55, color: "var(--mid)", letterSpacing: "-0.003em", textWrap: "pretty" }}>
        Round two locked color as the children-mark. Round three solves the rest of the system: the
        full nine-color landscape (5 subjects + 4 children) and the form-pairing that keeps the two
        axes mutually unambiguous on every screen they share.
      </p>

      <div style={{ marginTop: 22, padding: "14px 16px", background: "#FAFAFA", border: "1px solid #ECE7DA" }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>THE THREE PRINCIPLES</div>
        <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "auto 1fr", rowGap: 8, columnGap: 14, alignItems: "baseline" }}>
          <span className="mono" style={{ fontSize: 9, letterSpacing: "0.18em", color: "var(--ink)" }}>01</span>
          <span style={{ fontSize: 12.5, color: "var(--ink)", letterSpacing: "-0.003em" }}>Most understood — canonical hues, not trendy ones.</span>
          <span className="mono" style={{ fontSize: 9, letterSpacing: "0.18em", color: "var(--ink)" }}>02</span>
          <span style={{ fontSize: 12.5, color: "var(--ink)", letterSpacing: "-0.003em" }}>Maximally distinct — far apart in CIE-LAB perceptual space, not just nominally different.</span>
          <span className="mono" style={{ fontSize: 9, letterSpacing: "0.18em", color: "var(--ink)" }}>03</span>
          <span style={{ fontSize: 12.5, color: "var(--ink)", letterSpacing: "-0.003em" }}>Never conflated — child and subject occupy different hue families <em style={{ fontFamily: "Fraunces", fontStyle: "italic" }}>and</em> different signal forms.</span>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#8C91A5", textTransform: "uppercase" }}>THREE PAIRINGS</div>
        <div style={{ marginTop: 12, borderTop: "1px solid #E0DED6" }}>
          {[
            ["01 · Two Worlds",      "Subject = 5px dot · child = 18px chip — separated by hue family AND by mark scale."],
            ["02 · Mono Subjects",   "Subject = ink form-mark, no color · child = saturated chip — only one color axis remains."],
            ["03 · The Underline",   "Subject = 1.5px underline beneath label · child = filled chip — passive vs active form."],
          ].map(([k, v]) => (
            <div key={k} style={{
              padding: "10px 0", borderBottom: "1px solid #ECE7DA",
              display: "grid", gridTemplateColumns: "165px 1fr", gap: 14, alignItems: "baseline",
            }}>
              <span className="mono" style={{ fontSize: 9.5, letterSpacing: "0.18em", color: "var(--ink)" }}>{k}</span>
              <span style={{ fontSize: 12.5, color: "var(--ink)", letterSpacing: "-0.003em" }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- Compare strip — same row, three subject/child treatments ----------
function CompareStrip() {
  const rows = [
    { label: "01 · TWO WORLDS",     SubjectComp: SubjectD1, ChildComp: ChildD1 },
    { label: "02 · MONO SUBJECTS",  SubjectComp: SubjectD2, ChildComp: ChildD2 },
    { label: "03 · THE UNDERLINE",  SubjectComp: SubjectD3, ChildComp: ChildD3 },
  ];
  return (
    <div style={{
      width: 760, height: 560, background: "#FAFAFA",
      padding: "32px 36px", boxSizing: "border-box",
      fontFamily: "Plus Jakarta Sans", color: "var(--ink)",
    }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#8C91A5", textTransform: "uppercase" }}>
        SAME ROW · THREE PAIRINGS
      </div>
      <h2 style={{ margin: "8px 0 0", fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 500, fontSize: 28, letterSpacing: "-0.018em" }}>
        the screen the parent actually sees
      </h2>
      <p style={{ marginTop: 8, fontSize: 12, color: "var(--mid)", lineHeight: 1.5, letterSpacing: "-0.003em" }}>
        One block, one subject, one group of children — rendered three ways. The form-pairing is read at a glance.
      </p>

      <div style={{ marginTop: 22, borderTop: "1px solid #E0DED6" }}>
        {rows.map((r, i) => (
          <div key={i} style={{
            padding: "26px 0",
            borderBottom: i === rows.length - 1 ? "none" : "1px solid #ECE7DA",
          }}>
            <div className="mono" style={{ fontSize: 9, letterSpacing: "0.20em", color: "#8C91A5" }}>{r.label}</div>
            <div style={{
              marginTop: 12,
              padding: "16px 18px",
              background: "var(--chalk)",
              display: "grid", gridTemplateColumns: "36px 1fr",
              gap: 12, alignItems: "baseline",
            }}>
              <span className="mono" style={{ fontSize: 10, color: "var(--ink)", letterSpacing: "0.18em", alignSelf: "center" }}>60M</span>
              <div>
                <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 500, fontSize: 16, letterSpacing: "-0.008em" }}>
                  Engineering Problem Solving
                </div>
                <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 9 }}>
                  <r.SubjectComp subject="sci"/>
                  <span style={{ width: 1, height: 9, background: "#DCD6C5" }}/>
                  <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>3 × 20-min · split</span>
                </div>
                <div style={{ marginTop: 14, display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.22em", alignSelf: "center" }}>GROUP 1</span>
                  {["leo","max"].map(id => {
                    const k = FAMILY.find(f => f.id === id);
                    return <r.ChildComp key={id} kid={k}/>;
                  })}
                  <span style={{ width: 1, height: 14, background: "#E0DED6", alignSelf: "center" }}/>
                  <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.22em", alignSelf: "center" }}>GROUP 2</span>
                  {["jack","jane"].map(id => {
                    const k = FAMILY.find(f => f.id === id);
                    return <r.ChildComp key={id} kid={k}/>;
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
