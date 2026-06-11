/* global React, ReactDOM, DesignCanvas, DCSection, DCArtboard, FAMILY, RECAP_DEMO,
   ChildBR2, DirectionBR2_Mockup, DirectionBR2_Print, RecapBadgeBR2, DirectionBR2_Note,
   ChildKR2, DirectionKR2_Mockup, DirectionKR2_Print, RecapBadgeKR2, DirectionKR2_Note,
   ChildDK2, DirectionDK2_Mockup, DirectionDK2_Print, RecapBadgeDK2, DirectionDK2_Note,
   ChildJP2, DirectionJP2_Mockup, DirectionJP2_Print, RecapBadgeJP2, DirectionJP2_Note */

// =============================================================
// PER-CHILD VISUAL IDENTITY — ROUND TWO
// Architectural correction: mark+name fuse into ONE recognition unit.
// =============================================================

function App() {
  return (
    <DesignCanvas>

      <DCSection id="overview" title="Overview" subtitle="Round-one diagnosis · the four round-two fusion mechanisms compared">
        <DCArtboard id="diagnosis" label="What round one got wrong" width={620} height={560}>
          <DiagnosisCard/>
        </DCArtboard>
        <DCArtboard id="compare" label="Four fusion mechanisms · same family" width={620} height={560}>
          <CompareCard/>
        </DCArtboard>
        <DCArtboard id="recap-strip" label="Recap mastery shifts · smallest-scale test" width={620} height={560}>
          <RecapStrip/>
        </DCArtboard>
      </DCSection>

      <DCSection id="br2" title="01 · Brazilian — The Chromatic Token" subtitle="Defended on merits · color axis IS the answer · the obvious answer done with rigor">
        <DCArtboard id="br2-cluster" label="Expanded cluster · phone" width={420} height={780}>
          <DirectionBR2_Mockup/>
        </DCArtboard>
        <DCArtboard id="br2-print" label="Block Sheet · per-child" width={520} height={520}>
          <DirectionBR2_Print/>
        </DCArtboard>
        <DCArtboard id="br2-recap" label="Recap badge · smallest scale" width={420} height={420}>
          <RecapCard render={(k, s) => <RecapBadgeBR2 kid={k} shift={s}/>}/>
        </DCArtboard>
        <DCArtboard id="br2-note" label="Rationale" width={580} height={780}>
          <DirectionBR2_Note/>
        </DCArtboard>
      </DCSection>

      <DCSection id="kr2" title="02 · Korean — The Dropcap" subtitle="The first letter is the recognition target · serif-against-sans inside one word">
        <DCArtboard id="kr2-cluster" label="Expanded cluster · phone" width={420} height={780}>
          <DirectionKR2_Mockup/>
        </DCArtboard>
        <DCArtboard id="kr2-print" label="Block Sheet · per-child" width={520} height={520}>
          <DirectionKR2_Print/>
        </DCArtboard>
        <DCArtboard id="kr2-recap" label="Recap badge · smallest scale" width={420} height={420}>
          <RecapCard render={(k, s) => <RecapBadgeKR2 kid={k} shift={s}/>}/>
        </DCArtboard>
        <DCArtboard id="kr2-note" label="Rationale" width={580} height={780}>
          <DirectionKR2_Note/>
        </DCArtboard>
      </DCSection>

      <DCSection id="dk2" title="03 · Danish — The Anchor Letter" subtitle="One letter inside each name carries weight · disambiguator lives inside the word">
        <DCArtboard id="dk2-cluster" label="Expanded cluster · phone" width={420} height={780}>
          <DirectionDK2_Mockup/>
        </DCArtboard>
        <DCArtboard id="dk2-print" label="Block Sheet · per-child" width={520} height={520}>
          <DirectionDK2_Print/>
        </DCArtboard>
        <DCArtboard id="dk2-recap" label="Recap badge · smallest scale" width={420} height={420}>
          <RecapCard render={(k, s) => <RecapBadgeDK2 kid={k} shift={s}/>}/>
        </DCArtboard>
        <DCArtboard id="dk2-note" label="Rationale" width={580} height={780}>
          <DirectionDK2_Note/>
        </DCArtboard>
      </DCSection>

      <DCSection id="jp2" title="04 · Japanese — The Hanko" subtitle="The letter inside a stamp · letterform and mark are the same shape">
        <DCArtboard id="jp2-cluster" label="Expanded cluster · phone" width={420} height={780}>
          <DirectionJP2_Mockup/>
        </DCArtboard>
        <DCArtboard id="jp2-print" label="Block Sheet · per-child" width={520} height={520}>
          <DirectionJP2_Print/>
        </DCArtboard>
        <DCArtboard id="jp2-recap" label="Recap badge · smallest scale" width={420} height={420}>
          <RecapCard render={(k, s) => <RecapBadgeJP2 kid={k} shift={s}/>}/>
        </DCArtboard>
        <DCArtboard id="jp2-note" label="Rationale" width={580} height={780}>
          <DirectionJP2_Note/>
        </DCArtboard>
      </DCSection>

    </DesignCanvas>
  );
}

// ---------- Diagnosis card ----------
function DiagnosisCard() {
  return (
    <div style={{
      width: 620, height: 560, background: "#F8F4E9",
      padding: "32px 36px", boxSizing: "border-box",
      fontFamily: "Plus Jakarta Sans", color: "var(--ink)",
    }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#8C91A5", textTransform: "uppercase" }}>
        ROUND TWO · DIAGNOSIS
      </div>
      <h2 style={{
        margin: "10px 0 0",
        fontFamily: "Fraunces", fontWeight: 600, fontSize: 30, lineHeight: 1.05, letterSpacing: "-0.018em",
      }}>
        The architecture <em style={{ fontWeight: 500 }}>was</em> the failure.
      </h2>
      <p style={{ marginTop: 16, fontSize: 13.5, lineHeight: 1.55, color: "var(--mid)", letterSpacing: "-0.003em", textWrap: "pretty" }}>
        Round one varied <em style={{ fontFamily: "Fraunces", fontStyle: "italic" }}>what</em> the mark was.
        It did not vary <em style={{ fontFamily: "Fraunces", fontStyle: "italic" }}>where</em> the mark was. All four directions placed a small mark to the
        left of the name. The parent's eye performed two-step recognition: read mark, read name, connect.
        At 1.5 seconds, kitchen counter, that's one step too many.
      </p>
      <div style={{ marginTop: 22, padding: "14px 16px", background: "#FAFAFA", border: "1px solid #ECE7DA" }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5", textTransform: "uppercase" }}>
          THE NEW CONSTRAINT
        </div>
        <div style={{ marginTop: 8, fontSize: 14, lineHeight: 1.45, color: "var(--ink)", letterSpacing: "-0.003em" }}>
          Mark and name must be a <strong style={{ fontWeight: 600 }}>single recognition unit</strong>.
          One eye target. Identification fused into the name itself, not adjacent to it.
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#8C91A5", textTransform: "uppercase" }}>
          FOUR FUSION MECHANISMS
        </div>
        <div style={{ marginTop: 12, borderTop: "1px solid #E0DED6" }}>
          {[
            ["BR · Chip + knockout letter", "Chip and initial = one colored shape"],
            ["KR · Serif dropcap",          "First letter is the typographic anchor"],
            ["DK · Anchor weight",          "Disambiguating letter weighted up"],
            ["JP · Hanko (the stamp)",      "Letter contained in a stamp outline"],
          ].map(([k, v]) => (
            <div key={k} style={{
              padding: "10px 0", borderBottom: "1px solid #ECE7DA",
              display: "grid", gridTemplateColumns: "180px 1fr", gap: 14, alignItems: "baseline",
            }}>
              <span className="mono" style={{ fontSize: 9.5, letterSpacing: "0.18em", color: "var(--ink)", textTransform: "uppercase" }}>{k}</span>
              <span style={{ fontSize: 12.5, color: "var(--ink)", letterSpacing: "-0.003em" }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- Compare card ----------
function CompareCard() {
  const rows = [
    { label: "01 · BR · chromatic token",  render: (k) => <ChildBR2 kid={k}/> },
    { label: "02 · KR · serif dropcap",    render: (k) => <ChildKR2 kid={k}/> },
    { label: "03 · DK · anchor letter",    render: (k) => <ChildDK2 kid={k}/> },
    { label: "04 · JP · hanko",            render: (k) => <ChildJP2 kid={k}/> },
  ];
  return (
    <div style={{
      width: 620, height: 560, background: "#FAFAFA",
      padding: "32px 36px", boxSizing: "border-box",
      fontFamily: "Plus Jakarta Sans", color: "var(--ink)",
    }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#8C91A5", textTransform: "uppercase" }}>
        FOUR DIRECTIONS · ONE ROSTER
      </div>
      <h2 style={{
        margin: "8px 0 0",
        fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 500, fontSize: 28, letterSpacing: "-0.018em",
      }}>
        leo · max · jack · jane — fused
      </h2>

      <div style={{ marginTop: 22, borderTop: "1px solid #E0DED6" }}>
        {rows.map((r, i) => (
          <div key={i} style={{
            padding: "20px 0",
            borderBottom: i === rows.length - 1 ? "none" : "1px solid #ECE7DA",
          }}>
            <div className="mono" style={{ fontSize: 9, letterSpacing: "0.20em", color: "#8C91A5", textTransform: "uppercase" }}>
              {r.label}
            </div>
            <div style={{ marginTop: 12, display: "flex", gap: 22, alignItems: "center", flexWrap: "wrap" }}>
              {FAMILY.map(k => (
                <span key={k.id}>{r.render(k)}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Recap strip — same family across all 4 directions, smallest scale ----------
function RecapStrip() {
  const treatments = [
    { label: "BR", render: (k, s) => <RecapBadgeBR2 kid={k} shift={s}/> },
    { label: "KR", render: (k, s) => <RecapBadgeKR2 kid={k} shift={s}/> },
    { label: "DK", render: (k, s) => <RecapBadgeDK2 kid={k} shift={s}/> },
    { label: "JP", render: (k, s) => <RecapBadgeJP2 kid={k} shift={s}/> },
  ];
  return (
    <div style={{
      width: 620, height: 560, background: "#F8F4E9",
      padding: "28px 32px", boxSizing: "border-box",
      fontFamily: "Plus Jakarta Sans", color: "var(--ink)",
    }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#8C91A5", textTransform: "uppercase" }}>
        RECAP · SECTION 3 · MASTERY SHIFTS
      </div>
      <h2 style={{
        margin: "8px 0 0",
        fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 500, fontSize: 22, letterSpacing: "-0.015em",
      }}>
        the smallest scale the mark must work at
      </h2>

      <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {treatments.map(t => (
          <div key={t.label} style={{
            padding: "12px 14px",
            background: "#FAFAFA",
            border: "1px solid #ECE7DA",
          }}>
            <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5", textTransform: "uppercase" }}>
              {t.label}
            </div>
            <div style={{ marginTop: 4 }}>
              {RECAP_DEMO.map(s => {
                const k = FAMILY.find(f => f.id === s.kid);
                return (
                  <div key={s.kid}>{t.render(k, s.shift)}</div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecapCard({ render }) {
  return (
    <div style={{
      width: 420, height: 420, background: "#FAFAFA",
      padding: "24px 28px", boxSizing: "border-box",
      fontFamily: "Plus Jakarta Sans", color: "var(--ink)",
    }}>
      <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5", textTransform: "uppercase" }}>
        RECAP · MASTERY SHIFTS · WK 16
      </div>
      <hr style={{ marginTop: 10, border: "none", borderTop: "1px solid #0C1020" }}/>
      <div style={{ marginTop: 4 }}>
        {RECAP_DEMO.map(s => {
          const k = FAMILY.find(f => f.id === s.kid);
          return <div key={s.kid}>{render(k, s.shift)}</div>;
        })}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
