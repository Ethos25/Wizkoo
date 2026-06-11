/* global React, KIDS, SUBJECT, CLUSTERS, PlanetariumBand, ModeLabel, BlockKids */

// =============================================================
// Direction 1 — LEDGER
// Central choice: a typographic ledger. Time runs as a left-rail mono
// column (·40m, ·20m, ·60m, ·20m, ·40m); cluster names sit in Plus
// Jakarta 500 to the right; subject color appears only as a 4×4 dot
// after the subject mono label. No cards, no fills — just rules.
// Trade-off: visually quiet to the point of austere; requires reading
// rather than glancing for first-time users. Rewards repetition
// because the eye learns the rail and the dots; the page becomes a
// known place that improves with familiarity.
// =============================================================

function Ledger({ openId, setOpen }) {
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
      </div>

      {/* Summary line */}
      <div style={{ padding: "18px 22px 0", display: "flex", justifyContent: "space-between" }}>
        <span className="mono" style={{ fontSize: 10, color: "var(--meta)" }}>9 BLOCKS · 3 HRS · 5 SUBJECTS</span>
        <span className="mono" style={{ fontSize: 10, color: "var(--meta)" }}>5 CLUSTERS</span>
      </div>

      <div style={{ padding: "12px 22px 0", borderTop: "1px solid var(--rule)", marginTop: 10 }}>
        {CLUSTERS.map((c, i) => (
          <LedgerRow key={c.id} c={c} index={i}
            isOpen={openId === c.id}
            onToggle={() => setOpen(c.id)}
            isLast={i === CLUSTERS.length - 1} />
        ))}
      </div>
    </div>
  );
}

function LedgerRow({ c, index, isOpen, onToggle, isLast }) {
  const sub = SUBJECT[c.subject];
  return (
    <div style={{ borderBottom: isLast ? "none" : "1px solid var(--rule)" }}>
      <button onClick={onToggle} style={{
        background: "transparent", border: "none", padding: "16px 0", textAlign: "left",
        width: "100%", cursor: "pointer", display: "block",
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "44px 1fr auto", gap: 14, alignItems: "baseline" }}>
          {/* left rail — minutes in mono */}
          <span className="mono" style={{ fontSize: 11, color: "var(--ink)" }}>
            {c.minutes}M
          </span>

          {/* middle — name + meta */}
          <div>
            <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 500, fontSize: 16, color: "var(--ink)", letterSpacing: "-0.005em", lineHeight: 1.25 }}>
              {c.name}
            </div>
            <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: 6, background: sub.bright, display: "inline-block" }} />
                <span className="mono" style={{ fontSize: 10, color: "var(--meta)" }}>
                  {sub.abbr}
                </span>
              </span>
              <span style={{ width: 1, height: 10, background: "var(--rule)" }} />
              <span style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 400, fontSize: 12, color: "var(--mid)" }}>
                {c.blocks.length} × 20-min · {modeWord(c.mode)}
              </span>
            </div>
          </div>

          {/* right — number + chevron */}
          <span className="mono" style={{ fontSize: 10, color: "var(--meta)", alignSelf: "center" }}>
            {String(index + 1).padStart(2, "0")} {isOpen ? "▾" : "▸"}
          </span>
        </div>
      </button>

      {isOpen && (
        <div style={{ paddingLeft: 58, paddingBottom: 16 }}>
          <ExpandedBlocks c={c} />
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

function ExpandedBlocks({ c }) {
  const sub = SUBJECT[c.subject];
  // Group blocks by who's doing them so the split structure is visible.
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
            <div style={{ marginBottom: 6, display: "flex", gap: 8, alignItems: "baseline" }}>
              <span className="mono" style={{ fontSize: 9, color: "var(--meta)" }}>GROUP {gi + 1}</span>
              <span style={{ flex: 1, display: "flex", gap: 5 }}>
                {g.kids.map(id => {
                  const k = KIDS.find(x => x.id === id);
                  return (
                    <span key={id} style={{
                      fontFamily: "Plus Jakarta Sans", fontWeight: 500, fontSize: 11,
                      color: "var(--ink)", padding: "1px 7px",
                      border: "1px solid var(--ink)", borderRadius: 999, background: "var(--chalk)",
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
              padding: "10px 0",
              borderTop: bi === 0 ? "1px dotted var(--rule)" : "1px dotted var(--rule)",
            }}>
              <div style={{ display: "grid", gridTemplateColumns: "44px 1fr", gap: 14, alignItems: "baseline" }}>
                <span className="mono" style={{ fontSize: 10, color: "var(--meta)" }}>20M</span>
                <div>
                  <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 500, fontSize: 13, color: "var(--ink)", lineHeight: 1.25 }}>
                    {b.title}
                  </div>
                  {groups.length === 1 && (
                    <div style={{ marginTop: 6 }}>
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
