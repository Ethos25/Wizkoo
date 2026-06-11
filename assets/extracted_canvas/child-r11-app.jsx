/* global React, ReactDOM, DesignCanvas, DCSection, DCArtboard,
   APPROACHES, FormContainer, ChipContainer, RecapStack, TodayCluster, ApproachCard, KIDS, COLORS_R11 */

function FrameCardR11() {
  return (
    <div style={{ width: 720, height: 580, background: "var(--chalk)", padding: "32px 38px", boxSizing: "border-box", fontFamily: "Plus Jakarta Sans", color: "var(--ink)" }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#8C91A5" }}>ROUND ELEVEN · TYPOGRAPHIC INITIAL TEST</div>
      <h2 style={{ margin: "10px 0 0", fontFamily: "Fraunces", fontWeight: 600, fontSize: 30, lineHeight: 1.05, letterSpacing: "-0.018em" }}>The container vs. the letter.</h2>
      <p style={{ marginTop: 12, fontSize: 13, color: "var(--mid)", lineHeight: 1.55, textWrap: "pretty" }}>
        The container works. The container is also borrowed visual vocabulary — Stripe, Linear, every dashboard. This brief tests three typographic-initial alternatives that might carry recognition in Wizkoo's editorial register: Phaidon, Penguin, considered book stock — not SaaS.
      </p>
      <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {[["A · SANS INITIAL", "Plus Jakarta Sans italic, 1.8× body, colored. Single typeface."],
          ["B · SERIF INITIAL", "Fraunces italic initial + Jakarta italic body. The Penguin move."],
          ["C · DROPCAP",       "Fraunces upright, 2.2× body, elevated. The literary register."],
          ["BASELINE", "Filled letter container. Locked v10. Competent."]].map(([n, v]) => (
          <div key={n} style={{ padding: "12px 12px", background: "#FAFAFA", border: "1px solid #ECE7DA" }}>
            <div className="mono" style={{ fontSize: 9, letterSpacing: "0.18em", color: "var(--ink)" }}>{n}</div>
            <p style={{ margin: "6px 0 0", fontSize: 11, color: "var(--mid)", lineHeight: 1.45 }}>{v}</p>
          </div>))}
      </div>
      <div style={{ marginTop: 14, padding: "12px 14px", background: "var(--paper)", border: "1px solid #ECE7DA" }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>VERDICT — RECOMMENDED</div>
        <p style={{ margin: "8px 0 0", fontSize: 12, color: "var(--ink)", lineHeight: 1.5 }}>
          <strong>Form B clears all four criteria.</strong> Serif initial + sans body carries the recognition load by triple cue (form, color, weight), holds at 20px, belongs to the brand's editorial register, and reads <em>elite</em>. The Fraunces violation is defended by personal-moment exception. Container retires.
        </p>
      </div>
    </div>
  );
}

function VerdictMatrix() {
  const rows = [
    ["A · SANS INITIAL",       "PASS", "PASS",  "PASS",  "MIXED", "Quietly elite. Could read as emphasis treatment, not per-child mark."],
    ["B · SERIF INITIAL",      "PASS", "PASS",  "PASS",  "PASS",  "Triple recognition cue. Brand-coherent. Earns Fraunces violation."],
    ["C · DROPCAP",            "PASS", "MIXED", "PASS",  "PASS",  "Strongest at display, weakest at 20px. Best in quiet surfaces."],
    ["BASELINE · CONTAINER",   "PASS", "PASS",  "FAIL",  "MIXED", "Borrowed SaaS vocabulary. Competent, not elite."],
  ];
  const headers = ["", "RECOGNITION", "20px", "BRAND", "ELITE", ""];
  const cellColor = (v) => v === "PASS" ? "#3CA85A" : v === "FAIL" ? "#C83030" : "#E8AF38";
  return (
    <div style={{ width: 800, height: 460, background: "var(--chalk)", padding: "30px 36px", boxSizing: "border-box", fontFamily: "Plus Jakarta Sans", color: "var(--ink)" }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#8C91A5" }}>FOUR APPROACHES · FOUR CRITERIA</div>
      <h2 style={{ margin: "8px 0 0", fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 500, fontSize: 24, letterSpacing: "-0.018em" }}>The decision matrix.</h2>
      <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "200px 90px 90px 90px 90px 1fr", rowGap: 0, columnGap: 12, alignItems: "center", borderTop: "1px solid #0C1020" }}>
        {headers.map((h, i) => <span key={i} className="mono" style={{ fontSize: 9, letterSpacing: "0.20em", color: "#8C91A5", padding: "10px 0 8px", borderBottom: "1px solid #E0DED6" }}>{h}</span>)}
        {rows.map((r, ri) => r.map((cell, ci) => (
          <span key={ri + "-" + ci} style={{ padding: "12px 0", borderBottom: ri === rows.length - 1 ? "none" : "1px solid #ECE7DA", fontSize: ci === 0 ? 11 : ci === 5 ? 11 : 10, color: ci === 0 ? "var(--ink)" : ci === 5 ? "var(--mid)" : cellColor(cell), fontFamily: ci === 0 ? "Space Mono" : "Plus Jakarta Sans", letterSpacing: ci === 0 ? "0.18em" : ci === 5 ? "-0.003em" : "0.18em", fontWeight: ci > 0 && ci < 5 ? 600 : 400, lineHeight: 1.4 }}>{cell}</span>
        )))}
      </div>
    </div>
  );
}

function ContainerBaselineCard() {
  return (
    <ApproachCard
      kicker="BASELINE · CONTAINER (LOCKED v10)"
      title="The container the typographic forms must beat."
      move="Filled letter container, white knockout (or ink for Oat), italic name following. The locked v10 architecture, included for direct comparison."
      FormComp={FormContainer}
      ChipComp={ChipContainer}
      verdict="PASS"
      recognition="Strong at every scale — the chip has fixed shape and color; recognition is one step. Highest baseline performance in pure recognition."
      brand="Borrowed visual vocabulary. Stripe, Linear, every SaaS dashboard. Works, but doesn't carry the brand's editorial voice."/>
  );
}

function App() {
  return (
    <DesignCanvas>
      <DCSection id="overview" title="Overview" subtitle="Round eleven · typographic initial vs. container · the architectural test">
        <DCArtboard id="frame" label="Why this brief exists · the verdict" width={720} height={580}><FrameCardR11/></DCArtboard>
        <DCArtboard id="matrix" label="Decision matrix · four approaches · four criteria" width={800} height={460}><VerdictMatrix/></DCArtboard>
      </DCSection>

      {APPROACHES.map(a => (
        <DCSection key={a.id} id={a.id.toLowerCase()} title={a.kicker} subtitle={a.title}>
          <DCArtboard id={a.id + "-card"} label="The treatment · four children · 20px chip" width={700} height={700}>
            <ApproachCard {...a}/>
          </DCArtboard>
          <DCArtboard id={a.id + "-recap"} label="Recap mastery shifts · reading scale" width={520} height={580}>
            <RecapStack FormComp={a.FormComp} ChipComp={a.ChipComp} label={a.kicker.split(" · ")[0]}/>
          </DCArtboard>
          <DCArtboard id={a.id + "-today"} label="Today View cluster · glance scale" width={520} height={360}>
            <TodayCluster FormComp={a.FormComp} label={a.kicker.split(" · ")[0]}/>
          </DCArtboard>
        </DCSection>
      ))}

      <DCSection id="baseline" title="Baseline · Container (Locked v10)" subtitle="The architecture the typographic forms must beat">
        <DCArtboard id="bc-card"  label="Container · four children · 20px chip" width={700} height={700}><ContainerBaselineCard/></DCArtboard>
        <DCArtboard id="bc-recap" label="Recap mastery shifts · container baseline" width={520} height={580}><RecapStack FormComp={FormContainer} ChipComp={ChipContainer} label="CONTAINER"/></DCArtboard>
        <DCArtboard id="bc-today" label="Today View cluster · container baseline" width={520} height={360}><TodayCluster FormComp={FormContainer} label="CONTAINER"/></DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
