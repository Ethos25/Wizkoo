/* global React */

const SUBJECTS_R11 = {
  la:    { hue: "#3848D0", abbr: "LANG",   name: "Ink"      },
  math:  { hue: "#18A0B8", abbr: "MATH",   name: "Polar"    },
  sci:   { hue: "#38B060", abbr: "SCI",    name: "Malachite"},
  gh:    { hue: "#C83030", abbr: "GEO",    name: "Vermilion"},
  ca:    { hue: "#8848E0", abbr: "ARTS",   name: "Amethyst" },
  pe:    { hue: "#F08A20", abbr: "PE",     name: "Ember"    },
};

const COLORS_R11 = {
  leo:  { fill: "#3A2A38", name: "Aubergine" },
  max:  { fill: "#5E2E48", name: "Plum"      },
  jack: { fill: "#A89888", name: "Stone"     },
  jane: { fill: "#CDB68C", name: "Oat"       },
};

const KIDS = [
  { id: "leo",  initial: "L", name: "Leo",  rest: "eo"  },
  { id: "max",  initial: "M", name: "Max",  rest: "ax"  },
  { id: "jack", initial: "J", name: "Jack", rest: "ack" },
  { id: "jane", initial: "J", name: "Jane", rest: "ane" },
];

const RECAP = [
  { id: "leo",  shift: "fractions of a whole — solid → fluent" },
  { id: "max",  shift: "Roman trade routes — new mastery" },
  { id: "jack", shift: "decoding multisyllabics — emerging" },
  { id: "jane", shift: "place value to thousands — solid" },
];

// =============================================================
// FORM A — OVERSIZED COLORED INITIAL (sans-serif italic)
// =============================================================
function FormA({ kid, scale = 1, hideRest = false }) {
  const c = COLORS_R11[kid.id];
  const initSize = 30 * scale;
  const restSize = 17 * scale;
  return (
    <span style={{ display: "inline-flex", alignItems: "baseline", lineHeight: 1, fontFamily: "Plus Jakarta Sans", fontStyle: "italic", fontWeight: 500 }}>
      <span style={{ fontSize: initSize, color: c.fill, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 0.85 }}>{kid.initial}</span>
      {!hideRest && <span style={{ fontSize: restSize, color: "var(--ink)", letterSpacing: "-0.005em", marginLeft: 0 }}>{kid.rest}</span>}
    </span>
  );
}

// =============================================================
// FORM B — FRAUNCES SERIF INITIAL + sans-serif italic body
// =============================================================
function FormB({ kid, scale = 1, hideRest = false }) {
  const c = COLORS_R11[kid.id];
  const initSize = 32 * scale;
  const restSize = 17 * scale;
  return (
    <span style={{ display: "inline-flex", alignItems: "baseline", lineHeight: 1 }}>
      <span style={{ fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 500, fontSize: initSize, color: c.fill, letterSpacing: "-0.02em", fontVariationSettings: '"opsz" 144', lineHeight: 0.85 }}>{kid.initial}</span>
      {!hideRest && <span style={{ fontFamily: "Plus Jakarta Sans", fontStyle: "italic", fontWeight: 500, fontSize: restSize, color: "var(--ink)", letterSpacing: "-0.005em", marginLeft: 1 }}>{kid.rest}</span>}
    </span>
  );
}

// =============================================================
// FORM C — TRUE EDITORIAL DROPCAP (Fraunces, slight elevation)
// =============================================================
function FormC({ kid, scale = 1, hideRest = false }) {
  const c = COLORS_R11[kid.id];
  const initSize = 38 * scale;
  const restSize = 17 * scale;
  return (
    <span style={{ display: "inline-flex", alignItems: "flex-start", lineHeight: 1 }}>
      <span style={{ fontFamily: "Fraunces", fontWeight: 600, fontSize: initSize, color: c.fill, letterSpacing: "-0.025em", fontVariationSettings: '"opsz" 144', lineHeight: 0.78, marginTop: -2 * scale }}>{kid.initial}</span>
      {!hideRest && <span style={{ fontFamily: "Plus Jakarta Sans", fontStyle: "italic", fontWeight: 500, fontSize: restSize, color: "var(--ink)", letterSpacing: "-0.005em", marginLeft: 2 * scale, alignSelf: "flex-end", lineHeight: 1 }}>{kid.rest}</span>}
    </span>
  );
}

// =============================================================
// CONTAINER (baseline) — locked v10 architecture
// =============================================================
function FormContainer({ kid, scale = 1, hideRest = false }) {
  const c = COLORS_R11[kid.id];
  const size = 24 * scale;
  const restSize = 16 * scale;
  const isLight = c.fill === "#CDB68C";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 7 * scale, lineHeight: 1 }}>
      <span style={{ width: size, height: size, borderRadius: Math.round(size * 0.22), background: c.fill, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "Plus Jakarta Sans", fontStyle: "italic", fontWeight: 600, fontSize: Math.round(size * 0.61), color: isLight ? "#0C1020" : "#FAFAFA", lineHeight: 1, flexShrink: 0 }}>{kid.initial}</span>
      {!hideRest && <span style={{ fontFamily: "Plus Jakarta Sans", fontStyle: "italic", fontWeight: 500, fontSize: restSize, color: "var(--ink)", letterSpacing: "-0.005em" }}>{kid.name}</span>}
    </span>
  );
}

// =============================================================
// CHIP / 20px versions for Recap badge test
// =============================================================
function ChipA({ kid }) { const c = COLORS_R11[kid.id];
  return <span style={{ width: 20, height: 20, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "Plus Jakarta Sans", fontStyle: "italic", fontWeight: 700, fontSize: 18, color: c.fill, lineHeight: 1, letterSpacing: "-0.02em" }}>{kid.initial}</span>;
}
function ChipB({ kid }) { const c = COLORS_R11[kid.id];
  return <span style={{ width: 20, height: 20, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 600, fontSize: 19, color: c.fill, lineHeight: 1, letterSpacing: "-0.02em", fontVariationSettings: '"opsz" 144' }}>{kid.initial}</span>;
}
function ChipC({ kid }) { const c = COLORS_R11[kid.id];
  return <span style={{ width: 20, height: 20, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "Fraunces", fontWeight: 700, fontSize: 20, color: c.fill, lineHeight: 0.9, letterSpacing: "-0.025em", fontVariationSettings: '"opsz" 144' }}>{kid.initial}</span>;
}
function ChipContainer({ kid }) { const c = COLORS_R11[kid.id]; const isLight = c.fill === "#CDB68C";
  return <span style={{ width: 20, height: 20, borderRadius: 4, background: c.fill, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "Plus Jakarta Sans", fontStyle: "italic", fontWeight: 600, fontSize: 12, color: isLight ? "#0C1020" : "#FAFAFA", lineHeight: 1 }}>{kid.initial}</span>;
}

// =============================================================
// COMMON BUILDING BLOCKS
// =============================================================
function SubjectUnderline({ subject, dense = false }) {
  const s = SUBJECTS_R11[subject];
  return (
    <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "flex-start", lineHeight: 1 }}>
      <span className="mono" style={{ fontSize: 9, color: dense ? "var(--ink)" : "var(--meta)", letterSpacing: "0.20em" }}>{s.abbr}</span>
      <span style={{ width: "100%", height: 1.5, background: s.hue, marginTop: 2 }}/>
    </span>
  );
}

function RecapStack({ FormComp, ChipComp, label }) {
  return (
    <div style={{ width: 480, height: 540, background: "#FAFAFA", padding: "28px 32px", boxSizing: "border-box", fontFamily: "Plus Jakarta Sans", color: "var(--ink)" }}>
      <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>RECAP · MASTERY SHIFTS · WK 16 — {label}</div>
      <hr style={{ marginTop: 10, border: "none", borderTop: "1px solid #0C1020" }}/>
      <div style={{ marginTop: 12 }}>
        {RECAP.map(r => { const k = KIDS.find(x => x.id === r.id);
          return (<div key={r.id} style={{ display: "grid", gridTemplateColumns: "150px 1fr", columnGap: 16, alignItems: "center", padding: "12px 0", borderBottom: "1px solid #ECE7DA" }}>
            <FormComp kid={k} scale={1.1}/>
            <span style={{ fontSize: 12, color: "var(--mid)", lineHeight: 1.4 }}>{r.shift}</span>
          </div>);
        })}
      </div>
      <div style={{ marginTop: 16, padding: "12px 14px", background: "var(--chalk)" }}>
        <div className="mono" style={{ fontSize: 8.5, letterSpacing: "0.22em", color: "#8C91A5" }}>20px BADGE TEST</div>
        <div style={{ marginTop: 8, display: "flex", gap: 12, alignItems: "center" }}>
          {KIDS.map(k => <ChipComp key={k.id} kid={k}/>)}
          <span style={{ width: 1, height: 16, background: "#E0DED6", margin: "0 6px" }}/>
          {Object.keys(SUBJECTS_R11).map(s => <SubjectUnderline key={s} subject={s} dense/>)}
        </div>
      </div>
    </div>
  );
}

function TodayCluster({ FormComp, label }) {
  return (
    <div style={{ width: 480, height: 320, background: "var(--chalk)", padding: "22px 28px", boxSizing: "border-box", fontFamily: "Plus Jakarta Sans", color: "var(--ink)", borderRadius: 18 }}>
      <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>TODAY · EXPANDED CLUSTER — {label}</div>
      <div style={{ marginTop: 10, display: "flex", alignItems: "flex-end", gap: 10 }}>
        <SubjectUnderline subject="gh"/>
        <span style={{ width: 1, height: 9, background: "#DCD6C5" }}/>
        <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>3 × 20-min · split</span>
      </div>
      <div style={{ marginTop: 18 }}>
        <div className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.22em" }}>GROUP 1</div>
        <div style={{ marginTop: 10, display: "flex", gap: 22 }}>
          {["leo","max"].map(id => { const k = KIDS.find(x => x.id === id); return <FormComp key={id} kid={k} scale={1}/>; })}
        </div>
      </div>
      <div style={{ marginTop: 22 }}>
        <div className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.22em" }}>GROUP 2</div>
        <div style={{ marginTop: 10, display: "flex", gap: 22 }}>
          {["jack","jane"].map(id => { const k = KIDS.find(x => x.id === id); return <FormComp key={id} kid={k} scale={1}/>; })}
        </div>
      </div>
    </div>
  );
}

function ApproachCard({ kicker, title, move, FormComp, ChipComp, recognition, brand, verdict }) {
  return (
    <div style={{ width: 700, height: 700, background: "var(--chalk)", padding: "30px 36px", boxSizing: "border-box", fontFamily: "Plus Jakarta Sans", color: "var(--ink)" }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#8C91A5" }}>{kicker}</div>
      <h2 style={{ margin: "8px 0 0", fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 500, fontSize: 28, letterSpacing: "-0.018em" }}>{title}</h2>
      <p style={{ marginTop: 6, fontSize: 12.5, color: "var(--mid)", lineHeight: 1.5, letterSpacing: "-0.003em" }}>{move}</p>
      <div style={{ marginTop: 18, padding: "22px 24px", background: "#FAFAFA", border: "1px solid #ECE7DA" }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>FOUR CHILDREN · DISPLAY SCALE</div>
        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, alignItems: "baseline" }}>
          {KIDS.map(k => <FormComp key={k.id} kid={k} scale={1.4}/>)}
        </div>
      </div>
      <div style={{ marginTop: 14, padding: "12px 14px", background: "var(--paper)", border: "1px solid #ECE7DA" }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>20px CHIPS</div>
        <div style={{ marginTop: 10, display: "flex", gap: 14, alignItems: "center" }}>
          {KIDS.map(k => <ChipComp key={k.id} kid={k}/>)}
          <span style={{ flex: 1 }}/>
          <span className="mono" style={{ fontSize: 8.5, letterSpacing: "0.18em", color: verdict === "FAIL" ? "#C83030" : verdict === "MIXED" ? "#E8AF38" : "#3CA85A" }}>{verdict === "FAIL" ? "✕ " : "✓ "}{verdict}</span>
        </div>
      </div>
      <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ padding: "12px 14px", background: "var(--paper)", border: "1px solid #ECE7DA" }}>
          <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>RECOGNITION SPEED</div>
          <p style={{ margin: "8px 0 0", fontSize: 11, color: "var(--mid)", lineHeight: 1.5 }}>{recognition}</p>
        </div>
        <div style={{ padding: "12px 14px", background: "var(--paper)", border: "1px solid #ECE7DA" }}>
          <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>BRAND COHERENCE</div>
          <p style={{ margin: "8px 0 0", fontSize: 11, color: "var(--mid)", lineHeight: 1.5 }}>{brand}</p>
        </div>
      </div>
    </div>
  );
}

const APPROACHES = [
  { id: "A", kicker: "FORM A · OVERSIZED COLORED INITIAL", title: "Sans-serif initial. 1.8× the body.",
    move: "First letter at 1.8× body size, Plus Jakarta Sans italic weight 600, filled with the child's color. Rest of name continues at body size in ink italic. Single typeface — colored letter does the recognition work.",
    FormComp: FormA, ChipComp: ChipA, verdict: "PASS",
    recognition: "Strong at display scale — colored initial is unambiguous. At 20px the initial is 18px tall — chromatic but compromised vs. container's full chip area. The letter must do all the work; survives but doesn't beat container at smallest scale.",
    brand: "Honors single-typeface restraint. Doesn't borrow from SaaS. Reads as considered without theatrical. The most quietly elite of the three — but possibly *under-designed*; could be mistaken for an emphasis treatment, not a per-child mark." },
  { id: "B", kicker: "FORM B · FRAUNCES INITIAL + JAKARTA BODY", title: "Serif initial. The Penguin Classics move.",
    move: "First letter set in Fraunces italic (the brand's reserved serif), filled with the child's color. Rest of name in Plus Jakarta Sans italic ink. Typographic contrast carries the per-child differentiator alongside color.",
    FormComp: FormB, ChipComp: ChipB, verdict: "PASS",
    recognition: "Strongest at display scale of the three — the serif/sans contrast plus color creates a triple recognition cue. At 20px the Fraunces letter retains its glyph identity; reads as editorial badge. The recognition load is double-carried by form and color.",
    brand: "Deliberate violation of *Fraunces reserved register*, defended on grounds that naming a child is the most personal moment on the surface. This is the brand-coherent answer — Phaidon children's titles, Penguin spines, considered book stock. Earns its violation." },
  { id: "C", kicker: "FORM C · EDITORIAL DROPCAP", title: "Fraunces upright dropcap. Elevated.",
    move: "First letter set in Fraunces (upright, weight 600) at 2.2× body size, slight baseline elevation. Rest of name in Plus Jakarta Sans italic at body size, baseline-aligned to bottom of dropcap. The literary register — Phaidon, *The New Yorker* opener, illuminated manuscript.",
    FormComp: FormC, ChipComp: ChipC, verdict: "MIXED",
    recognition: "Excellent at display scale — most distinctive of the three. At 20px the letter weight thins; serif details degrade. The dropcap's elevation requires baseline math the container doesn't.",
    brand: "Closest to the brand's editorial reference points. Risk: precious if surface gets busy. Best when the surface is quiet (Recap, mastery breakdown). Less easy to deploy in dense Today View clusters where all four sit side-by-side." },
];

Object.assign(window, { SUBJECTS_R11, COLORS_R11, KIDS, RECAP, APPROACHES, FormA, FormB, FormC, FormContainer, ChipA, ChipB, ChipC, ChipContainer, SubjectUnderline, RecapStack, TodayCluster, ApproachCard });
