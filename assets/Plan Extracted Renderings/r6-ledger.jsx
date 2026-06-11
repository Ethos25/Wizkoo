/* global React, KIDS, SUBJECT, CLUSTERS, PlanetariumBand, BlockKids */

// =============================================================
// LEDGER — locked Today View
// Same structural logic as the R4 baseline ledger, every element
// pushed to its lightest defensible weight without dropping any
// content. Decisions:
//   – row vertical padding 22 (more air per row than 16)
//   – cluster name 17 / PJS 500 (slightly larger, more breathing)
//   – subject dot 5px (down from 6)
//   – position number 9 mono in #B7B4A8 (faint warm-gray)
//   – chevron is an 8px hairline arrow in the same warm-gray
//   – row rule: 1px solid #ECE7DA (chalk-on-rule, not ink)
//   – inline divider between subject + meta: 1×9 #DCD6C5
//   – mono kicker letterspacing 0.18em (more air in the type)
// =============================================================

function Ledger({ openId, setOpen }) {
  return (
    <div className="frame" style={{ background: "var(--chalk)", paddingBottom: 96 }}>
      <PlanetariumBand />

      <div style={{ padding: "30px 22px 0" }}>
        <div className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.18em" }}>THEME</div>
        <h1 style={{
          margin: "8px 0 0", fontFamily: "Fraunces", fontWeight: 500, fontSize: 26,
          lineHeight: 1.1, letterSpacing: "-0.015em", color: "var(--ink)",
        }}>
          Bridges <span style={{ fontStyle: "italic" }}>and</span> Engineering
        </h1>
      </div>

      <div style={{ padding: "22px 22px 0", display: "flex", justifyContent: "space-between" }}>
        <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.18em" }}>9 BLOCKS · 3 HRS · 5 SUBJECTS</span>
        <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.18em" }}>5 CLUSTERS</span>
      </div>

      <div style={{ padding: "0 22px", marginTop: 14, borderTop: "1px solid #ECE7DA" }}>
        {CLUSTERS.map((c, i) => (
          <Row key={c.id} c={c} index={i}
            isOpen={openId === c.id}
            onToggle={() => setOpen(c.id)}
            isLast={i === CLUSTERS.length - 1} />
        ))}
      </div>
    </div>
  );
}

function Row({ c, index, isOpen, onToggle, isLast }) {
  const sub = SUBJECT[c.subject];
  return (
    <div style={{ borderBottom: isLast ? "none" : "1px solid #ECE7DA" }}>
      <button onClick={onToggle} style={{
        background: "transparent", border: "none", padding: "22px 0", textAlign: "left",
        width: "100%", cursor: "pointer", display: "block",
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "44px 1fr auto", gap: 14, alignItems: "baseline" }}>
          {/* time */}
          <span className="mono" style={{ fontSize: 10, color: "var(--ink)", letterSpacing: "0.18em" }}>
            {c.minutes}M
          </span>

          {/* name + meta */}
          <div>
            <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 500, fontSize: 17, color: "var(--ink)", letterSpacing: "-0.008em", lineHeight: 1.2 }}>
              {c.name}
            </div>
            <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
                <span style={{ width: 5, height: 5, borderRadius: 5, background: sub.bright, display: "inline-block" }} />
                <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>
                  {sub.abbr}
                </span>
              </span>
              <span style={{ width: 1, height: 9, background: "#DCD6C5" }} />
              <span style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 400, fontSize: 12, color: "var(--mid)" }}>
                {c.blocks.length} × 20-min · {modeWord(c.mode)}
              </span>
            </div>
          </div>

          {/* index */}
          <span className="mono" style={{ fontSize: 9, color: "#B7B4A8", letterSpacing: "0.18em", alignSelf: "center", display: "inline-flex", alignItems: "center", gap: 6 }}>
            {String(index + 1).padStart(2, "0")}
            <Chevron open={isOpen} />
          </span>
        </div>
      </button>

      {isOpen && (
        <div style={{ paddingLeft: 58, paddingBottom: 22 }}>
          <Expanded c={c} />
        </div>
      )}
    </div>
  );
}

function Chevron({ open }) {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" style={{ display: "block" }}>
      {open
        ? <path d="M1 2 L4 6 L7 2" fill="none" stroke="#B7B4A8" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        : <path d="M2 1 L6 4 L2 7"  fill="none" stroke="#B7B4A8" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  );
}

function modeWord(mode) {
  return mode === "together" ? "together" : mode === "parallel" ? "parallel" : "split";
}

function Expanded({ c }) {
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
            <div style={{ marginBottom: 8, display: "flex", gap: 10, alignItems: "center" }}>
              <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.18em" }}>GROUP {gi + 1}</span>
              <span style={{ height: 1, flex: 1, background: "#ECE7DA" }} />
              <span style={{ display: "flex", gap: 5 }}>
                {g.kids.map(id => {
                  const k = KIDS.find(x => x.id === id);
                  return (
                    <span key={id} style={{
                      fontFamily: "Plus Jakarta Sans", fontWeight: 500, fontSize: 11,
                      color: "var(--ink)", padding: "1px 8px",
                      border: "1px solid var(--ink)", borderRadius: 999,
                    }}>
                      {k.name}
                    </span>
                  );
                })}
              </span>
            </div>
          )}
          {g.blocks.map((b, bi) => (
            <div key={b.id} style={{
              padding: "12px 0",
              borderTop: bi === 0 ? "1px dotted #DCD6C5" : "1px dotted #DCD6C5",
            }}>
              <div style={{ display: "grid", gridTemplateColumns: "44px 1fr", gap: 14, alignItems: "baseline" }}>
                <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.18em" }}>20M</span>
                <div>
                  <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 500, fontSize: 13, color: "var(--ink)", lineHeight: 1.3, letterSpacing: "-0.005em" }}>
                    {b.title}
                  </div>
                  {groups.length === 1 && (
                    <div style={{ marginTop: 7 }}>
                      <BlockKids kids={b.kids} />
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

Object.assign(window, { Ledger });
