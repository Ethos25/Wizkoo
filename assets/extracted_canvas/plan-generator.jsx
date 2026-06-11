/* global React, KIDS, COLORS, SUBJECTS, NameB, ChipB, SubjectMark */

// =============================================================
// VIEW 5 — PLAN GENERATOR (phone frame · planetarium header)
// Ports the locked Today View v6 phone surface into the canvas.
// Locked treatments applied:
//   – subject underlines replace subject dots
//   – Form B + Atelier Jewels replace pill capsules in expanded state
//   – planetarium band, day strip, theme block, cluster row grammar
//     all preserved verbatim from the locked source.
// =============================================================

const PG_DAYS = [
  { short: "M",  state: "done"  },
  { short: "T",  state: "today" },
  { short: "W",  state: "ahead" },
  { short: "Th", state: "ahead" },
  { short: "F",  state: "ahead" },
];

const PG_CLUSTERS = [
  { id: "lab",   name: "Bridge Architecture Lab",     subject: "math", minutes: 40, mode: "together",
    blocks: [{ id: "b1", title: "Bridge Shape Engineering Station", kids: ["leo","max","jack","jane"] },
             { id: "b2", title: "Bridge Span Rice Measurement",     kids: ["leo","max","jack","jane"] }] },
  { id: "read",  name: "Reading the Builders",        subject: "la",   minutes: 20, mode: "together",
    blocks: [{ id: "b3", title: "Read-Aloud · The Bridge Engineers", kids: ["leo","max","jack","jane"] }] },
  { id: "eps",   name: "Engineering Problem Solving", subject: "sci",  minutes: 60, mode: "split",
    blocks: [{ id: "b4", title: "Bridge Load Testing Documentation Lab",      kids: ["leo","max"] },
             { id: "b5", title: "Bridge Construction Supply Problems",        kids: ["leo","max"] },
             { id: "b6", title: "Pressure-Resistant Habitat Design Challenge", kids: ["jack","jane"] }] },
  { id: "world", name: "Bridges Around the World",    subject: "gh",   minutes: 20, mode: "together",
    blocks: [{ id: "b7", title: "Famous Bridges · Atlas Walk", kids: ["leo","max","jack","jane"] }] },
  { id: "build", name: "Build Your Bridge",           subject: "ca",   minutes: 40, mode: "parallel",
    blocks: [{ id: "b8", title: "Studio · Sketch the Span", kids: ["leo","max","jack","jane"] },
             { id: "b9", title: "Studio · Build the Model", kids: ["leo","max","jack","jane"] }] },
];

function modeWord(m) { return m === "together" ? "together" : m === "parallel" ? "parallel" : "split"; }

// ---------- planetarium band ----------
function PhoneStatus({ tone = "chalk" }) {
  const c = tone === "chalk" ? "rgba(248,244,233,0.9)" : "var(--ink)";
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 22px 0", fontFamily: "Plus Jakarta Sans", fontWeight: 600, fontSize: 13, color: c }}>
      <span>9:41</span>
      <span style={{ display: "flex", gap: 5, alignItems: "center" }}>
        <span style={{ width: 16, height: 8, border: `1.2px solid ${c}`, borderRadius: 2, position: "relative", display: "inline-block" }}>
          <span style={{ position: "absolute", left: 1.5, top: 1.5, bottom: 1.5, background: c, width: "62%", display: "block" }} />
        </span>
      </span>
    </div>
  );
}

function PlanetariumBand({ kicker = "TUESDAY · WEEK 16" }) {
  const stars = [
    [40, 8, 1.5, 0.55], [88, 22, 2, 0.7], [160, 12, 1, 0.5],
    [220, 30, 1.5, 0.6], [280, 14, 2, 0.65], [320, 36, 1, 0.45],
    [60, 44, 1, 0.4], [200, 56, 1.5, 0.55], [120, 64, 1, 0.4],
    [340, 60, 1.5, 0.55],
  ];
  return (
    <div style={{ background: "radial-gradient(ellipse at 75% 30%, #1a2257 0%, #0C1020 65%)", color: "#F8F4E9", padding: "12px 22px 18px", position: "relative", overflow: "hidden" }}>
      {stars.map(([x, y, r, a], i) => (
        <span key={i} style={{ position: "absolute", left: x, top: y, width: r * 2, height: r * 2, background: `rgba(248,244,233,${a})`, borderRadius: 999 }}/>
      ))}
      <PhoneStatus tone="chalk"/>
      <div style={{ marginTop: 18, display: "flex", justifyContent: "space-between", alignItems: "baseline", position: "relative" }}>
        <span className="mono" style={{ fontSize: 10, color: "rgba(248,244,233,0.6)", letterSpacing: "0.18em" }}>{kicker}</span>
        <span className="mono" style={{ fontSize: 10, color: "var(--saffron)", letterSpacing: "0.18em" }}>847 / 900 · ON PACE</span>
      </div>
      <div style={{ marginTop: 10, position: "relative" }}>
        <span style={{ fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 400, fontSize: 16, color: "rgba(248,244,233,0.85)", letterSpacing: "-0.01em" }}>the day is made</span>
      </div>
      <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(5,1fr)", position: "relative" }}>
        {PG_DAYS.map((d, i) => {
          const isToday = d.state === "today"; const isDone = d.state === "done";
          return (
            <div key={i} className="mono" style={{ fontSize: 11, padding: "6px 0", textAlign: "center", fontWeight: isToday ? 700 : 400, color: isToday ? "var(--saffron)" : isDone ? "rgba(248,244,233,0.85)" : "rgba(248,244,233,0.4)", position: "relative", letterSpacing: "0.18em" }}>
              {d.short}
              {isToday && <span style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", bottom: -2, width: 14, height: 2, background: "var(--saffron)" }}/>}
              {isDone  && <span style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", bottom: 0,  width: 3,  height: 3, background: "rgba(248,244,233,0.85)", borderRadius: 3 }}/>}
            </div>);
        })}
      </div>
    </div>
  );
}

// ---------- chevron ----------
function Chevron({ open }) {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" style={{ display: "block" }}>
      {open
        ? <path d="M1 2 L4 6 L7 2" fill="none" stroke="#B7B4A8" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
        : <path d="M2 1 L6 4 L2 7"  fill="none" stroke="#B7B4A8" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>}
    </svg>
  );
}

// ---------- expanded body — locked treatment applied ----------
function ExpandedBody({ c }) {
  // Group blocks by identical roster
  const groups = [];
  c.blocks.forEach(b => {
    const key = b.kids.slice().sort().join(",");
    let g = groups.find(x => x.key === key);
    if (!g) { g = { key, kids: b.kids, blocks: [] }; groups.push(g); }
    g.blocks.push(b);
  });

  return (
    <div>
      {groups.map((g, gi) => (
        <div key={gi} style={{ marginTop: gi === 0 ? 0 : 18 }}>
          {groups.length > 1 && (
            <div style={{ marginBottom: 10, display: "flex", gap: 12, alignItems: "center" }}>
              <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>GROUP {gi + 1}</span>
              <span style={{ height: 1, flex: 1, background: "#ECE7DA" }}/>
              {/* FORM B + ATELIER JEWELS — replaces pill capsules */}
              <span style={{ display: "flex", gap: 12, alignItems: "baseline" }}>
                {g.kids.map(id => { const k = KIDS.find(x => x.id === id); return <NameB key={id} kid={k} scale={0.62}/>; })}
              </span>
            </div>
          )}
          {g.blocks.map((b, bi) => (
            <div key={b.id} style={{ padding: "12px 0", borderTop: "1px dotted #DCD6C5" }}>
              <div style={{ display: "grid", gridTemplateColumns: "44px 1fr", gap: 14, alignItems: "baseline" }}>
                <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.18em" }}>20M</span>
                <div>
                  <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 500, fontSize: 13, color: "var(--ink)", lineHeight: 1.3, letterSpacing: "-0.005em" }}>{b.title}</div>
                  {/* Single-roster cluster: show the four children inline in Form B */}
                  {groups.length === 1 && (
                    <div style={{ marginTop: 8, display: "flex", gap: 12, alignItems: "baseline" }}>
                      {b.kids.map(id => { const k = KIDS.find(x => x.id === id); return <NameB key={id} kid={k} scale={0.6}/>; })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ---------- cluster row — locked treatment applied ----------
function ClusterRow({ c, index, isOpen, isLast }) {
  const subj = SUBJECTS[c.subject];
  return (
    <div style={{ borderBottom: isLast ? "none" : "1px solid #ECE7DA" }}>
      <div style={{ padding: "22px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "44px 1fr auto", gap: 14, alignItems: "baseline" }}>
          <span className="mono" style={{ fontSize: 10, color: "var(--ink)", letterSpacing: "0.18em" }}>{c.minutes}M</span>
          <div>
            <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 500, fontSize: 17, color: "var(--ink)", letterSpacing: "-0.008em", lineHeight: 1.2 }}>{c.name}</div>
            <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 10 }}>
              {/* SUBJECT UNDERLINE — replaces dot+abbr couple */}
              <SubjectMark subject={c.subject} width={56} dense/>
              <span style={{ width: 1, height: 9, background: "#DCD6C5" }}/>
              <span style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 400, fontSize: 12, color: "var(--mid)" }}>{c.blocks.length} × 20-min · {modeWord(c.mode)}</span>
            </div>
          </div>
          <span className="mono" style={{ fontSize: 9, color: "#B7B4A8", letterSpacing: "0.18em", alignSelf: "center", display: "inline-flex", alignItems: "center", gap: 6 }}>
            {String(index + 1).padStart(2, "0")}
            <Chevron open={isOpen}/>
          </span>
        </div>
      </div>
      {isOpen && (
        <div style={{ paddingLeft: 58, paddingBottom: 22 }}>
          <ExpandedBody c={c}/>
        </div>
      )}
    </div>
  );
}

// ---------- the phone surface ----------
function PlanGeneratorPhone({ openId = null }) {
  return (
    <div style={{ width: 390, minHeight: 844, background: "var(--chalk)", color: "var(--ink)", fontFamily: "Plus Jakarta Sans", paddingBottom: 96, position: "relative", overflow: "hidden" }}>
      <PlanetariumBand/>
      <div style={{ padding: "30px 22px 0" }}>
        <div className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.18em" }}>THEME</div>
        <h1 style={{ margin: "8px 0 0", fontFamily: "Fraunces", fontWeight: 500, fontSize: 26, lineHeight: 1.1, letterSpacing: "-0.015em", color: "var(--ink)" }}>
          Bridges <span style={{ fontStyle: "italic" }}>and</span> Engineering
        </h1>
      </div>
      <div style={{ padding: "22px 22px 0", display: "flex", justifyContent: "space-between" }}>
        <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.18em" }}>9 BLOCKS · 3 HRS · 5 SUBJECTS</span>
        <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.18em" }}>5 CLUSTERS</span>
      </div>
      <div style={{ padding: "0 22px", marginTop: 14, borderTop: "1px solid #ECE7DA" }}>
        {PG_CLUSTERS.map((c, i) => (
          <ClusterRow key={c.id} c={c} index={i}
            isOpen={openId === c.id}
            isLast={i === PG_CLUSTERS.length - 1}/>
        ))}
      </div>
    </div>
  );
}

// Phone bezel wrapper for canvas display
function PhoneBezel({ children, label }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" }}>
      {label && <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.22em", paddingLeft: 4 }}>{label}</span>}
      <div style={{ width: 390, borderRadius: 36, overflow: "hidden", boxShadow: "0 1px 0 rgba(0,0,0,0.04), 0 30px 60px -20px rgba(20,18,14,0.18)", border: "1px solid #E7E1D2", background: "var(--chalk)" }}>
        {children}
      </div>
    </div>
  );
}

// Two-up: Default + Cluster 3 expanded — matches the source composition
function PlanGeneratorPair() {
  return (
    <div style={{ width: 920, minHeight: 1040, background: "#1c1b18", padding: "40px 32px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 18 }}>
      <div className="mono" style={{ fontSize: 10, color: "rgba(231,225,210,0.55)", letterSpacing: "0.24em", paddingLeft: 4 }}>PLAN GENERATOR · DEFAULT + CLUSTER 3 EXPANDED</div>
      <p style={{ margin: 0, color: "rgba(231,225,210,0.7)", fontSize: 12, lineHeight: 1.55, fontFamily: "Plus Jakarta Sans", maxWidth: 720 }}>
        The phone surface for the day, with planetarium header, day strip, theme, and the five-cluster ledger. Subject underlines replace the dot couple; Form B + Atelier Jewels replace the pill capsules in the expanded group state.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "390px 390px", gap: 56, marginTop: 12 }}>
        <PhoneBezel label="DEFAULT"><PlanGeneratorPhone openId={null}/></PhoneBezel>
        <PhoneBezel label="CLUSTER 3 EXPANDED"><PlanGeneratorPhone openId="eps"/></PhoneBezel>
      </div>
    </div>
  );
}

Object.assign(window, { PlanGeneratorPhone, PlanGeneratorPair });
