/* global React, KIDS, SUBJECT, CLUSTERS, PlanetariumBand, ModeLabel, BlockKids */

// =============================================================
// Direction 4 — INLAY
// Central choice: a single mark — a 16px outline square with a 6px
// filled subject-color square inlaid in its center — anchors every
// cluster. The mark is the only color element on the surface; it
// reads as a brand-grade glyph rather than a UI sticker. Cluster
// names sit in Plus Jakarta 500 to the right; minutes and counts in
// Space Mono. A 1px ink rule separates entries; nothing else.
// Trade-off: the mark is small enough that color sits on the edge of
// peripheral perception — readers must learn the palette across
// returns. Rewards repetition because the consistent inlay teaches
// itself; over weeks the parent reads the inlay column as a
// fingerprint of the day's shape.
// =============================================================

function Inlay({ openId, setOpen }) {
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

      <div style={{ marginTop: 22, borderTop: "1px solid var(--ink)" }}>
        {CLUSTERS.map((c, i) => (
          <InlayRow key={c.id} c={c} index={i}
            isOpen={openId === c.id}
            onToggle={() => setOpen(c.id)}
            isLast={i === CLUSTERS.length - 1} />
        ))}
      </div>
    </div>
  );
}

function InlayMark({ color, size = 16 }) {
  const inner = Math.round(size * 6 / 16);
  return (
    <span style={{
      display: "inline-block", width: size, height: size,
      border: "1px solid var(--ink)", position: "relative",
      flexShrink: 0,
    }}>
      <span style={{
        position: "absolute",
        left: (size - inner) / 2, top: (size - inner) / 2,
        width: inner, height: inner,
        background: color,
      }} />
    </span>
  );
}

function InlayRow({ c, index, isOpen, onToggle, isLast }) {
  const sub = SUBJECT[c.subject];
  return (
    <div style={{ borderBottom: isLast ? "1px solid var(--ink)" : "1px solid var(--rule)" }}>
      <button onClick={onToggle} style={{
        background: "transparent", border: "none", padding: "18px 22px", textAlign: "left",
        width: "100%", cursor: "pointer", display: "block",
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "16px 1fr auto", gap: 16, alignItems: "flex-start" }}>
          <span style={{ paddingTop: 4 }}>
            <InlayMark color={sub.bright} />
          </span>

          <div>
            <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 500, fontSize: 16, color: "var(--ink)", letterSpacing: "-0.005em", lineHeight: 1.25 }}>
              {c.name}
            </div>
            <div style={{ marginTop: 6 }}>
              <span className="mono" style={{ fontSize: 10, color: "var(--meta)" }}>
                {sub.abbr} · {c.minutes}M · {c.blocks.length}×20 · {modeWord(c.mode).toUpperCase()}
              </span>
            </div>
          </div>

          <span className="mono" style={{ fontSize: 10, color: "var(--meta)", paddingTop: 4 }}>
            {String(index + 1).padStart(2, "0")} {isOpen ? "▾" : "▸"}
          </span>
        </div>
      </button>

      {isOpen && (
        <div style={{ padding: "0 22px 18px 54px" }}>
          <InlayExpanded c={c} />
        </div>
      )}
    </div>
  );
}

function modeWord(mode) {
  return mode === "together" ? "together" : mode === "parallel" ? "parallel" : "split";
}

function InlayExpanded({ c }) {
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
        <div key={gi} style={{ marginTop: gi === 0 ? 0 : 16 }}>
          {groups.length > 1 && (
            <div style={{ marginBottom: 8, display: "flex", gap: 8, alignItems: "center" }}>
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
            <div key={b.id} style={{ padding: "10px 0", borderTop: bi === 0 ? "1px dotted var(--rule)" : "1px dotted var(--rule)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "12px 1fr auto", gap: 12, alignItems: "flex-start" }}>
                <span style={{ paddingTop: 4 }}>
                  <InlayMark color={sub.bright} size={10} />
                </span>
                <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 500, fontSize: 13, color: "var(--ink)", lineHeight: 1.3 }}>
                  {b.title}
                </div>
                <span className="mono" style={{ fontSize: 9, color: "var(--meta)", paddingTop: 4 }}>20M</span>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { Inlay });
