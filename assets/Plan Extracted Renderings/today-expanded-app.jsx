/* global React, ReactDOM */

const SUBJECTS = {
  la:   { hue: "#3848D0", abbr: "LANG",  name: "Ink" },
  math: { hue: "#18A0B8", abbr: "MATH",  name: "Polar" },
  sci:  { hue: "#38B060", abbr: "SCI",   name: "Malachite" },
  gh:   { hue: "#C83030", abbr: "GEO",   name: "Vermilion" },
  ca:   { hue: "#8848E0", abbr: "ARTS",  name: "Amethyst" },
  pe:   { hue: "#F08A20", abbr: "PE",    name: "Ember" },
};

const COLORS = {
  leo:  { fill: "#3A2A38", name: "Aubergine" },
  max:  { fill: "#5E2E48", name: "Plum"      },
  jack: { fill: "#A89888", name: "Stone"     },
  jane: { fill: "#CDB68C", name: "Oat"       },
};

const KIDS = [
  { id: "leo",  initial: "L", rest: "eo",  name: "Leo"  },
  { id: "max",  initial: "M", rest: "ax",  name: "Max"  },
  { id: "jack", initial: "J", rest: "ack", name: "Jack" },
  { id: "jane", initial: "J", rest: "ane", name: "Jane" },
];

// FORM B — Fraunces serif italic initial + Jakarta italic body
function NameB({ kid, scale = 1 }) {
  const c = COLORS[kid.id];
  const initSize = 30 * scale;
  const restSize = 17 * scale;
  return (
    <span style={{ display: "inline-flex", alignItems: "baseline", lineHeight: 1 }}>
      <span style={{ fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 500, fontSize: initSize, color: c.fill, letterSpacing: "-0.02em", fontVariationSettings: '"opsz" 144', lineHeight: 0.85 }}>{kid.initial}</span>
      <span style={{ fontFamily: "Plus Jakarta Sans", fontStyle: "italic", fontWeight: 500, fontSize: restSize, color: "var(--ink)", letterSpacing: "-0.005em", marginLeft: 1 }}>{kid.rest}</span>
    </span>
  );
}

function SubjectMark({ subject, width = 92 }) {
  const s = SUBJECTS[subject];
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "flex-start", lineHeight: 1, width }}>
      <span className="mono" style={{ fontSize: 9, color: "var(--ink)", letterSpacing: "0.22em" }}>{s.abbr}</span>
      <span style={{ width: "100%", height: 1.5, background: s.hue, marginTop: 3 }}/>
    </div>
  );
}

// === COLLAPSED CLUSTER ROW (the rows ABOVE & BELOW the expanded one) ===
function CollapsedRow({ time, subject, kidsIds, status }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "70px 110px 1fr 100px", alignItems: "center", padding: "16px 24px", borderBottom: "1px solid #ECE7DA" }}>
      <div className="mono" style={{ fontSize: 10, color: "var(--meta)", letterSpacing: "0.2em" }}>{time}</div>
      <SubjectMark subject={subject} width={84}/>
      <div style={{ display: "flex", gap: 18, alignItems: "baseline" }}>
        {kidsIds.map(id => { const k = KIDS.find(x => x.id === id); return <NameB key={id} kid={k} scale={0.85}/>; })}
      </div>
      <div className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.2em", textAlign: "right" }}>{status}</div>
    </div>
  );
}

// === EXPANDED CLUSTER — the centerpiece ===
function ExpandedCluster() {
  return (
    <div style={{ background: "#FAFAFA", padding: "26px 30px 28px", borderTop: "2px solid var(--ink)", borderBottom: "2px solid var(--ink)", margin: "0" }}>
      {/* HEADER ROW */}
      <div style={{ display: "grid", gridTemplateColumns: "70px 1fr 110px", alignItems: "flex-start", gap: 16 }}>
        <div className="mono" style={{ fontSize: 10, color: "var(--ink)", letterSpacing: "0.2em", paddingTop: 4 }}>10:00</div>
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 500, fontSize: 22, letterSpacing: "-0.018em", color: "var(--ink)", lineHeight: 1 }}>Roman trade routes.</span>
            <SubjectMark subject="gh" width={84}/>
            <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>3 × 20-MIN · SPLIT</span>
          </div>
          <p style={{ margin: "10px 0 0", fontSize: 12, color: "var(--mid)", lineHeight: 1.5, maxWidth: 540, textWrap: "pretty" }}>
            The map opens with the Mediterranean. Group 1 traces routes by hand on the wall map. Group 2 reads the Carthage primary source aloud, then they swap.
          </p>
        </div>
        <div className="mono" style={{ fontSize: 9, color: "var(--saffron)", letterSpacing: "0.20em", textAlign: "right", paddingTop: 6 }}>NOW</div>
      </div>

      {/* GROUP STRIPS */}
      <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "70px 1fr", gap: 16 }}>
        <div/>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>

          {/* GROUP 1 */}
          <div style={{ background: "var(--chalk)", padding: "18px 18px 20px", border: "1px solid #ECE7DA" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.22em" }}>GROUP ONE · MAP TABLE</span>
              <span className="mono" style={{ fontSize: 9, color: "var(--ink)", letterSpacing: "0.20em" }}>0:08 / 0:20</span>
            </div>
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
              {["leo","max"].map(id => { const k = KIDS.find(x => x.id === id);
                return (
                  <div key={id} style={{ display: "grid", gridTemplateColumns: "100px 1fr", alignItems: "center", columnGap: 12 }}>
                    <NameB kid={k} scale={1}/>
                    <span style={{ fontSize: 11, color: "var(--mid)", lineHeight: 1.4 }}>
                      {id === "leo" ? "tracing routes · pencil only" : "naming ports · checking against legend"}
                    </span>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid #E0DED6", display: "flex", gap: 14 }}>
              <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>MATERIALS</span>
              <span style={{ fontSize: 11, color: "var(--ink)", fontStyle: "italic" }}>wall map · graphite · trade-route key</span>
            </div>
          </div>

          {/* GROUP 2 */}
          <div style={{ background: "var(--chalk)", padding: "18px 18px 20px", border: "1px solid #ECE7DA" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.22em" }}>GROUP TWO · READING NOOK</span>
              <span className="mono" style={{ fontSize: 9, color: "var(--ink)", letterSpacing: "0.20em" }}>0:08 / 0:20</span>
            </div>
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
              {["jack","jane"].map(id => { const k = KIDS.find(x => x.id === id);
                return (
                  <div key={id} style={{ display: "grid", gridTemplateColumns: "100px 1fr", alignItems: "center", columnGap: 12 }}>
                    <NameB kid={k} scale={1}/>
                    <span style={{ fontSize: 11, color: "var(--mid)", lineHeight: 1.4 }}>
                      {id === "jack" ? "Carthage source · read aloud" : "annotating · margin notes"}
                    </span>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid #E0DED6", display: "flex", gap: 14 }}>
              <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>MATERIALS</span>
              <span style={{ fontSize: 11, color: "var(--ink)", fontStyle: "italic" }}>printed primary · pencil · margin sheet</span>
            </div>
          </div>

        </div>
      </div>

      {/* SWAP RHYTHM */}
      <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "70px 1fr", gap: 16 }}>
        <div/>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "var(--paper)", border: "1px solid #ECE7DA" }}>
          <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.22em" }}>SWAP AT</span>
          <span className="mono" style={{ fontSize: 10, color: "var(--ink)", letterSpacing: "0.18em" }}>0:20 → 0:40 → 0:60</span>
          <span style={{ flex: 1 }}/>
          <span style={{ fontSize: 11, color: "var(--mid)", fontStyle: "italic" }}>Two short bell tones at the swap. Materials stay on the table.</span>
        </div>
      </div>
    </div>
  );
}

// === FULL TODAY VIEW SURFACE ===
function TodayView() {
  return (
    <div style={{ width: 1080, minHeight: 820, background: "var(--chalk)", fontFamily: "Plus Jakarta Sans", color: "var(--ink)", padding: "0 0 40px" }}>

      {/* HEADER */}
      <div style={{ padding: "32px 40px 22px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "1px solid #E0DED6" }}>
        <div>
          <div className="mono" style={{ fontSize: 10, color: "var(--meta)", letterSpacing: "0.24em" }}>TUESDAY · WEEK 16 · OCT 22</div>
          <h1 style={{ margin: "8px 0 0", fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 400, fontSize: 44, letterSpacing: "-0.02em", lineHeight: 1 }}>Today.</h1>
        </div>
        <div style={{ display: "flex", gap: 26, alignItems: "baseline" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.22em" }}>WITH YOU</span>
            <div style={{ display: "flex", gap: 14, alignItems: "baseline" }}>
              {KIDS.map(k => <NameB key={k.id} kid={k} scale={0.78}/>)}
            </div>
          </div>
          <div style={{ width: 1, height: 28, background: "#DCD6C5" }}/>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.22em" }}>WEATHER</span>
            <span style={{ fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 400, fontSize: 16, color: "var(--ink)" }}>cool · clear · 14°</span>
          </div>
        </div>
      </div>

      {/* BLOCK ROWS */}
      <div style={{ padding: "0", background: "var(--paper)" }}>
        <CollapsedRow time="08:30" subject="la"  kidsIds={["leo","max","jack","jane"]} status="DONE"/>
        <CollapsedRow time="09:15" subject="math" kidsIds={["leo","max","jack","jane"]} status="DONE"/>

        {/* THE EXPANDED ONE */}
        <ExpandedCluster/>

        <CollapsedRow time="11:30" subject="sci" kidsIds={["leo","max","jack","jane"]} status="UPCOMING"/>
        <CollapsedRow time="14:00" subject="ca"  kidsIds={["leo","max","jack","jane"]} status="UPCOMING"/>
        <CollapsedRow time="15:30" subject="pe"  kidsIds={["leo","max"]}                status="UPCOMING"/>
      </div>

      {/* FOOTER LEDGER */}
      <div style={{ padding: "20px 40px 0", display: "flex", gap: 28, alignItems: "center", color: "var(--meta)" }}>
        <span className="mono" style={{ fontSize: 9, letterSpacing: "0.22em" }}>NEXT HANDOFF</span>
        <span style={{ fontSize: 12, fontStyle: "italic", fontFamily: "Fraunces", color: "var(--ink)" }}>Sam picks up Leo & Max at 15:15 for swim.</span>
        <span style={{ flex: 1 }}/>
        <span className="mono" style={{ fontSize: 9, letterSpacing: "0.22em" }}>RECAP UNLOCKS</span>
        <span style={{ fontSize: 12, fontStyle: "italic", fontFamily: "Fraunces", color: "var(--ink)" }}>17:30</span>
      </div>
    </div>
  );
}

function App() {
  return (
    <div style={{ minHeight: "100vh", background: "#EDEAE0", padding: "40px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
      <div style={{ width: 1080, color: "var(--meta)" }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.24em" }}>TODAY VIEW · EXPANDED CLUSTER · FORM B (FRAUNCES INITIAL)</div>
        <p style={{ margin: "6px 0 0", fontSize: 12, color: "var(--mid)", lineHeight: 1.5, maxWidth: 720, textWrap: "pretty" }}>
          The 10:00 geography block is open. The other blocks stay collapsed — one row each — so the surface keeps its rhythm. The expanded cluster is the morning's working state: who's where, what they're doing, when the swap lands.
        </p>
      </div>
      <div style={{ boxShadow: "0 30px 80px -40px rgba(12,16,32,0.45), 0 1px 0 rgba(12,16,32,0.04)" }}>
        <TodayView/>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
