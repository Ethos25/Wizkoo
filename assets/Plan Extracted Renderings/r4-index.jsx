/* global React, KIDS, SUBJECT, CLUSTERS, PlanetariumBand, ModeLabel, BlockKids */

// =============================================================
// Direction 3 — INDEX
// Central choice: a typographic index. Each cluster is a numbered
// entry — 01, 02, 03 — with the subject named in subject-color mono
// letters at the foot of the entry. No dot, no tile, no fill: the
// color lives inside the typography itself, on a four-character mono
// label like "MATH" or "ARTS". Cluster names are large Plus Jakarta
// 500. Generous vertical rhythm; no rules between entries — only
// space.
// Trade-off: the colored type is the only color signal, so the
// surface reads almost as a black-and-white book; first-time users
// may want more visual punctuation. Rewards repetition because the
// page has the cadence of a well-set book; the eye finds its place
// without any chrome.
// =============================================================

function IndexView({ openId, setOpen }) {
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

      <div style={{ padding: "26px 22px 0" }}>
        {CLUSTERS.map((c, i) => (
          <IndexEntry key={c.id} c={c} index={i}
            isOpen={openId === c.id}
            onToggle={() => setOpen(c.id)} />
        ))}
      </div>
    </div>
  );
}

function IndexEntry({ c, index, isOpen, onToggle }) {
  const sub = SUBJECT[c.subject];
  return (
    <div style={{ paddingBottom: 26 }}>
      <button onClick={onToggle} style={{
        background: "transparent", border: "none", padding: 0, textAlign: "left",
        width: "100%", cursor: "pointer", display: "block",
      }}>
        {/* top line: number · minutes */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span className="mono" style={{ fontSize: 10, color: "var(--meta)" }}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="mono" style={{ fontSize: 10, color: "var(--meta)" }}>
            {c.minutes}M · {c.blocks.length}×20
          </span>
        </div>
        {/* cluster name */}
        <div style={{
          fontFamily: "Plus Jakarta Sans", fontWeight: 500, fontSize: 19,
          color: "var(--ink)", letterSpacing: "-0.01em", lineHeight: 1.2,
          marginTop: 4,
        }}>
          {c.name}
        </div>
        {/* foot — subject in subject color, then mode */}
        <div style={{ marginTop: 8, display: "flex", gap: 14, alignItems: "baseline" }}>
          <span className="mono" style={{ fontSize: 11, color: sub.deep, fontWeight: 700 }}>
            {sub.abbr}
          </span>
          <span style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 400, fontSize: 12, color: "var(--mid)" }}>
            {modeText(c.mode)}
          </span>
        </div>
      </button>

      {isOpen && (
        <div style={{ marginTop: 16, paddingLeft: 0 }}>
          <IndexExpanded c={c} />
        </div>
      )}
    </div>
  );
}

function modeText(mode) {
  return mode === "together" ? "All four · together"
       : mode === "parallel" ? "All four · parallel"
       : "Split · two groups";
}

function IndexExpanded({ c }) {
  const sub = SUBJECT[c.subject];
  const groups = [];
  c.blocks.forEach(b => {
    const key = b.kids.slice().sort().join(",");
    let g = groups.find(x => x.key === key);
    if (!g) { g = { key, kids: b.kids, blocks: [] }; groups.push(g); }
    g.blocks.push(b);
  });

  return (
    <div style={{ borderTop: "1px solid var(--rule)", paddingTop: 14 }}>
      {groups.map((g, gi) => (
        <div key={gi} style={{ marginTop: gi === 0 ? 0 : 18 }}>
          {groups.length > 1 && (
            <div style={{ marginBottom: 10, display: "flex", gap: 8, alignItems: "center" }}>
              <span className="mono" style={{ fontSize: 9, color: "var(--meta)", flexShrink: 0 }}>
                GROUP {gi + 1}
              </span>
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
          {g.blocks.map((b, bi) => (
            <div key={b.id} style={{ padding: "10px 0", borderTop: bi === 0 ? "none" : "1px dotted var(--rule)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span className="mono" style={{ fontSize: 9, color: sub.deep, fontWeight: 700 }}>
                  {sub.abbr}
                </span>
                <span className="mono" style={{ fontSize: 9, color: "var(--meta)" }}>20M</span>
              </div>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 500, fontSize: 14, color: "var(--ink)", lineHeight: 1.3, marginTop: 3 }}>
                {b.title}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { IndexView });
