/* global React, KIDS, ALL, SUBJECT, DAY, DAYS, CLUSTERS, PhoneStatus, DayStrip */

// =============================================================
// Direction 3 — ROSTER
// Central choice: a horizontal swim lane per child, stacked vertically
// young → old. Each lane is that child's morning, blocks rendered as
// solid color tokens in execution order. The same block worked by all
// four kids appears as four aligned tokens of identical color and
// width — the family's "togetherness" reads as visual rhyme across
// rows. Disciplined: no chrome, no boxes, just lanes, color, and type.
// =============================================================

function Roster({ openId, setOpen }) {
  // For Roster, "expanded" means: in the cluster section, show blocks
  // as full token rows with titles instead of compact pills.
  return (
    <div className="frame" style={{ background: "var(--chalk)", paddingBottom: 80 }}>
      <PhoneStatus />

      <div style={{ padding: "10px 22px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="mono" style={{ fontSize: 10, color: "var(--meta)" }}>WEEK 16 · TUE 7:45</span>
        <span className="mono" style={{ fontSize: 10, color: "var(--meta)", display: "flex", gap: 6, alignItems: "center" }}>
          847/900 · ON PACE
          <span style={{ width: 6, height: 6, background: "var(--saffron)", borderRadius: 6 }} />
        </span>
      </div>

      <DayStrip />

      <div style={{ padding: "22px 22px 0" }}>
        <div className="mono" style={{ fontSize: 10, color: "var(--meta)" }}>TUESDAY · TODAY</div>
        <h1 className="serif" style={{ margin: "6px 0 0", fontSize: 30, lineHeight: 1.05, fontWeight: 600, letterSpacing: "-0.02em" }}>
          Bridges <span style={{ fontStyle: "italic", fontWeight: 500 }}>and</span> Engineering
        </h1>
      </div>

      {/* Roster — the family's morning, child by child */}
      <div style={{ padding: "26px 22px 0" }}>
        <div className="mono" style={{ fontSize: 10, color: "var(--meta)", marginBottom: 12 }}>
          THE FAMILY · 5 BLOCKS · 100 MIN
        </div>
        {KIDS.map((k, ki) => (
          <Lane key={k.id} kid={k}
            openId={openId} setOpen={setOpen}
            isLast={ki === KIDS.length - 1} />
        ))}
      </div>

      {/* Cluster summary — typographic, beneath the lanes */}
      <div style={{ padding: "26px 22px 0", borderTop: "1.5px solid var(--ink)", marginTop: 22 }}>
        {CLUSTERS.map((c, ci) => (
          <ClusterRow key={c.id} c={c} index={ci}
            isOpen={openId === c.id}
            onToggle={() => setOpen(c.id)}
            isLast={ci === CLUSTERS.length - 1} />
        ))}
      </div>
    </div>
  );
}

// Build the per-kid block sequence by walking clusters in order
function buildKidTimeline(kid) {
  const seq = [];
  CLUSTERS.forEach(c => {
    c.blocks.forEach(b => {
      if (b.kids.includes(kid.id)) {
        seq.push({ ...b, clusterId: c.id });
      } else {
        // gap marker so lanes stay synchronized in time
        seq.push({ id: `gap-${c.id}-${b.id}-${kid.id}`, gap: true, clusterId: c.id });
      }
    });
  });
  return seq;
}

function Lane({ kid, openId, setOpen, isLast }) {
  const seq = buildKidTimeline(kid);
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "44px 1fr",
      gap: 12,
      alignItems: "center",
      padding: "10px 0",
      borderBottom: isLast ? "none" : "1px solid var(--rule)",
    }}>
      <div>
        <div style={{
          width: 30, height: 30, borderRadius: 30,
          border: "1.5px solid var(--ink)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 13,
          background: "var(--paper)",
        }}>{kid.initial}</div>
        <div className="mono" style={{ fontSize: 9, color: "var(--meta)", marginTop: 4, paddingLeft: 2 }}>{kid.age}</div>
      </div>
      <div style={{ display: "flex", gap: 4, alignItems: "stretch" }}>
        {seq.map((b, bi) => {
          if (b.gap) {
            return (
              <span key={b.id} style={{
                flex: 1, height: 28,
                background: "transparent",
                borderTop: "1px dotted var(--rule)",
                borderBottom: "1px dotted var(--rule)",
                opacity: 0.6,
              }} />
            );
          }
          const sub = SUBJECT[b.subject];
          return (
            <span key={b.id} style={{
              flex: 1, height: 28,
              background: sub.bright, borderRadius: 2,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "Space Mono", fontSize: 9, fontWeight: 700,
              color: "rgba(0,0,0,0.65)",
              letterSpacing: "0.1em",
            }}>20M</span>
          );
        })}
      </div>
    </div>
  );
}

function ClusterRow({ c, index, isOpen, onToggle, isLast }) {
  const sub = SUBJECT[c.subject];
  return (
    <div style={{
      borderBottom: isLast ? "none" : "1px solid var(--rule)",
      paddingBottom: isOpen ? 18 : 0,
    }}>
      <button onClick={onToggle} style={{
        background: "transparent", border: "none", padding: "16px 0 14px",
        cursor: "pointer", textAlign: "left", width: "100%",
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "32px 1fr auto", columnGap: 10, alignItems: "baseline" }}>
          <div className="mono" style={{ fontSize: 10, color: "var(--meta)" }}>
            {String(index + 1).padStart(2, "0")}
          </div>
          <div>
            <div style={{ fontFamily: "Fraunces", fontWeight: 600, fontSize: 19, color: "var(--ink)", lineHeight: 1.15, letterSpacing: "-0.01em" }}>
              {c.name}
            </div>
            <div className="mono" style={{ fontSize: 10, color: "var(--meta)", marginTop: 6 }}>
              {c.minutes}M · {c.blocks.length}×20 ·{" "}
              <span style={{ color: "var(--ink)" }}>
                {c.summary.mode === "same-room" ? "ALL FOUR · TOGETHER" : "ALL FOUR · SPLIT"}
              </span>
            </div>
          </div>
          <span className="mono" style={{
            fontSize: 11, color: "var(--ink)",
            borderBottom: "1.5px solid var(--saffron)", paddingBottom: 1,
          }}>
            {c.action}
          </span>
        </div>
      </button>

      {isOpen && (
        <div>
          {c.blocks.map((b, bi) => {
            const sub = SUBJECT[b.subject];
            return (
              <div key={b.id} style={{
                display: "grid",
                gridTemplateColumns: "32px 1fr",
                columnGap: 10,
                padding: "10px 0",
                borderTop: "1px dotted var(--rule)",
              }}>
                <div className="mono" style={{ fontSize: 10, color: "var(--meta)" }}>
                  .{bi + 1}
                </div>
                <div>
                  {/* color rail showing which kids do it */}
                  <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
                    {ALL.map((k, ki) => {
                      const has = b.kids.includes(k);
                      return (
                        <span key={k} style={{
                          flex: 1, height: 8,
                          background: has ? sub.bright : "transparent",
                          borderTop: has ? "none" : "1px dotted var(--rule)",
                          borderBottom: has ? "none" : "1px dotted var(--rule)",
                        }} />
                      );
                    })}
                  </div>
                  <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
                    {ALL.map((k, ki) => {
                      const has = b.kids.includes(k);
                      return (
                        <span key={k} className="mono" style={{
                          flex: 1, fontSize: 9, textAlign: "center",
                          color: has ? "var(--ink)" : "var(--faint)",
                          fontWeight: has ? 700 : 400,
                        }}>
                          {KIDS[ki].initial}
                        </span>
                      );
                    })}
                  </div>
                  <div style={{ fontFamily: "Fraunces", fontWeight: 600, fontSize: 15, color: "var(--ink)", lineHeight: 1.2 }}>
                    {b.title}
                  </div>
                  <div className="mono" style={{ fontSize: 9, color: sub.deep, marginTop: 3 }}>
                    {sub.name.toUpperCase()} · {b.mode.toUpperCase().replace("-", " ")} · 20M
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { Roster });
