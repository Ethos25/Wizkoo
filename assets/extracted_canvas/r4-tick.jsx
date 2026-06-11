/* global React, KIDS, SUBJECT, CLUSTERS, PlanetariumBand, ModeLabel, BlockKids */

// =============================================================
// Direction 2 — TICK
// Central choice: a single hairline vertical rail down the page; each
// cluster is a small saffron-or-subject-colored TICK on that rail at
// the cluster's position. The tick is the only color element. Cluster
// names sit to the right in Plus Jakarta 500; minutes sit to the
// left in Space Mono. The whole surface is one ruled column.
// Trade-off: relies on the rail metaphor to read; the colored tick is
// small and refined but disappears at thumbnail size. Rewards
// repetition because the rail teaches itself; over weeks the parent
// reads the tick pattern as the shape of her morning.
// =============================================================

function Tick({ openId, setOpen }) {
  return (
    <div className="frame" style={{ background: "var(--chalk)", paddingBottom: 90 }}>
      <PlanetariumBand />

      <div style={{ padding: "26px 22px 0" }}>
        <div className="mono" style={{ fontSize: 10, color: "var(--meta)" }}>THEME</div>
        <h1 style={{
          margin: "6px 0 0", fontFamily: "Fraunces", fontWeight: 500, fontSize: 26,
          lineHeight: 1.1, letterSpacing: "-0.015em", color: "var(--ink)",
        }}>
          Bridges <span style={{ fontStyle: "italic" }}>and</span> Engineering
        </h1>
        <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between" }}>
          <span className="mono" style={{ fontSize: 10, color: "var(--meta)" }}>9 BLOCKS · 3 HRS</span>
          <span className="mono" style={{ fontSize: 10, color: "var(--meta)" }}>5 SUBJECTS</span>
        </div>
      </div>

      {/* Rail + ticks */}
      <div style={{ position: "relative", padding: "26px 22px 0" }}>
        {/* the rail */}
        <span style={{
          position: "absolute", left: 64, top: 26, bottom: 0,
          width: 1, background: "var(--rule)",
        }} />

        {CLUSTERS.map((c, i) => (
          <TickRow key={c.id} c={c} index={i}
            isOpen={openId === c.id}
            onToggle={() => setOpen(c.id)} />
        ))}
      </div>
    </div>
  );
}

function TickRow({ c, index, isOpen, onToggle }) {
  const sub = SUBJECT[c.subject];
  return (
    <div style={{ position: "relative", paddingBottom: 26 }}>
      <button onClick={onToggle} style={{
        background: "transparent", border: "none", padding: 0, textAlign: "left",
        width: "100%", cursor: "pointer", display: "block",
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "42px 22px 1fr auto", gap: 0, alignItems: "flex-start" }}>
          {/* left — minutes */}
          <span className="mono" style={{ fontSize: 11, color: "var(--ink)", paddingTop: 2, textAlign: "right", paddingRight: 8 }}>
            {c.minutes}M
          </span>
          {/* tick — 8px filled square sitting ON the rail */}
          <span style={{
            display: "inline-block", width: 8, height: 8,
            background: sub.bright,
            marginTop: 6, marginLeft: 4,
            position: "relative", zIndex: 1,
          }} />
          {/* name + meta */}
          <div style={{ paddingLeft: 14 }}>
            <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 500, fontSize: 16, color: "var(--ink)", letterSpacing: "-0.005em", lineHeight: 1.25 }}>
              {c.name}
            </div>
            <div style={{ marginTop: 4 }}>
              <span className="mono" style={{ fontSize: 10, color: "var(--meta)" }}>
                {sub.abbr} · {c.blocks.length}×20M · {modeWord(c.mode).toUpperCase()}
              </span>
            </div>
          </div>
          {/* index */}
          <span className="mono" style={{ fontSize: 10, color: "var(--meta)", paddingTop: 4 }}>
            {String(index + 1).padStart(2, "0")} {isOpen ? "▾" : "▸"}
          </span>
        </div>
      </button>

      {isOpen && (
        <div style={{ marginTop: 14, paddingLeft: 78 }}>
          <TickExpanded c={c} />
        </div>
      )}
    </div>
  );
}

function modeWord(mode) {
  return mode === "together" ? "together"
       : mode === "parallel" ? "parallel"
       : "split";
}

function TickExpanded({ c }) {
  const sub = SUBJECT[c.subject];
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
        <div key={gi} style={{ marginTop: gi === 0 ? 0 : 14 }}>
          {groups.length > 1 && (
            <div style={{ marginBottom: 8, display: "flex", gap: 8, alignItems: "center" }}>
              <span className="mono" style={{ fontSize: 9, color: "var(--meta)" }}>GROUP {gi + 1}</span>
              <span style={{ height: 1, flex: 1, background: "var(--rule)" }} />
              <span style={{ display: "flex", gap: 5 }}>
                {g.kids.map(id => {
                  const k = KIDS.find(x => x.id === id);
                  return (
                    <span key={id} style={{
                      fontFamily: "Plus Jakarta Sans", fontWeight: 500, fontSize: 11,
                      color: "var(--ink)", padding: "1px 7px",
                      border: "1px solid var(--ink)", borderRadius: 999,
                    }}>
                      {k.name}
                    </span>
                  );
                })}
              </span>
            </div>
          )}
          {g.blocks.map(b => (
            <div key={b.id} style={{ padding: "8px 0", borderTop: "1px dotted var(--rule)" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{
                  width: 4, height: 4, background: sub.bright, marginTop: 8,
                  flexShrink: 0,
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 500, fontSize: 13, color: "var(--ink)", lineHeight: 1.3 }}>
                    {b.title}
                  </div>
                  <div className="mono" style={{ fontSize: 9, color: "var(--meta)", marginTop: 3 }}>20M</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { Tick });
