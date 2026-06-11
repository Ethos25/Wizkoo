/* global React, KIDS, ALL, SUBJECT, DAY, DAYS, CLUSTERS, PhoneStatus, DayStrip */

// =============================================================
// Direction 4 — SCORE
// Central choice: a musical score. Four staff lines, one per child.
// The day reads left → right as time. Each block is a "measure" — a
// color-filled bar on the staves of every child involved. Clusters are
// barlines that group measures. A same-room block is a vertical column
// of bars across all four staves; parallel is a row of separate bars
// at the same time-position; independent is a single bar on one staff.
// Time signature lives in the upper left as the day header. Pace as
// tempo mark. The day is composed.
// =============================================================

function Score({ openId, setOpen }) {
  return (
    <div className="frame" style={{ background: "var(--chalk)", paddingBottom: 80 }}>
      <PhoneStatus />

      <div style={{ padding: "10px 22px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="mono" style={{ fontSize: 10, color: "var(--meta)" }}>WEEK 16 · TUE 7:45</span>
        <span className="mono" style={{ fontSize: 10, color: "var(--meta)", display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ width: 6, height: 6, background: "var(--saffron)", borderRadius: 6 }} />
          ON PACE
        </span>
      </div>

      <DayStrip />

      {/* Title block — like a piece-header */}
      <div style={{ padding: "22px 22px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div className="mono" style={{ fontSize: 10, color: "var(--meta)" }}>OPUS 16 · MOVEMENT II</div>
          <h1 className="serif" style={{ margin: "4px 0 0", fontSize: 26, lineHeight: 1.05, fontWeight: 600, letterSpacing: "-0.02em" }}>
            Bridges <span style={{ fontStyle: "italic", fontWeight: 500 }}>and</span> Engineering
          </h1>
        </div>
        <div style={{ textAlign: "right", paddingBottom: 4 }}>
          <div className="mono" style={{ fontSize: 9, color: "var(--meta)" }}>TEMPO</div>
          <div style={{ fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 500, fontSize: 13, color: "var(--ink)" }}>
            on pace
          </div>
          <div className="mono" style={{ fontSize: 9, color: "var(--meta)", marginTop: 2 }}>847/900</div>
        </div>
      </div>

      {/* The score */}
      <div style={{ padding: "26px 0 0" }}>
        <Stave openId={openId} setOpen={setOpen} />
      </div>
    </div>
  );
}

function Stave({ openId, setOpen }) {
  // Layout
  const padL = 50;
  const padR = 22;
  const innerW = 390 - padL - padR;
  const staffGap = 30;
  const staffH = 4 * staffGap; // 4 spaces between 4 lines? we'll do 4 staves, equally spaced
  const measureGap = 4;
  const totalBlocks = CLUSTERS.reduce((acc, c) => acc + c.blocks.length, 0); // 5
  const measureW = (innerW - (CLUSTERS.length - 1) * 14 - (totalBlocks - CLUSTERS.length) * measureGap) / totalBlocks;

  // build sequential measure positions
  let x = padL;
  const measures = [];
  CLUSTERS.forEach((c, ci) => {
    const cluster = { c, ci, startX: x, blocks: [] };
    c.blocks.forEach((b, bi) => {
      cluster.blocks.push({ b, x, w: measureW });
      x += measureW;
      if (bi < c.blocks.length - 1) x += measureGap;
    });
    cluster.endX = x;
    measures.push(cluster);
    if (ci < CLUSTERS.length - 1) x += 14; // cluster spacing
  });

  const totalH = staffGap * 4 + 30; // padding top + 4 staff lines spaced

  // any expanded cluster pushes a detail strip below the score
  const expanded = CLUSTERS.find(c => c.id === openId);

  return (
    <div>
      {/* clef + stave */}
      <div style={{ position: "relative", height: totalH, marginBottom: 10 }}>
        {/* kid labels (clef position) */}
        <div style={{ position: "absolute", left: 0, top: 0, width: padL, height: totalH }}>
          {KIDS.map((k, ki) => (
            <div key={k.id} style={{
              position: "absolute",
              left: 14, top: 14 + ki * staffGap, transform: "translateY(-50%)",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <span style={{
                width: 22, height: 22, borderRadius: 22,
                border: "1.5px solid var(--ink)", background: "var(--chalk)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 11,
              }}>{k.initial}</span>
            </div>
          ))}
        </div>

        {/* horizontal staff lines */}
        {KIDS.map((k, ki) => (
          <div key={k.id} style={{
            position: "absolute",
            left: padL, right: padR,
            top: 14 + ki * staffGap,
            height: 1,
            background: "var(--rule)",
          }} />
        ))}

        {/* opening barline */}
        <div style={{
          position: "absolute",
          left: padL - 2, top: 14, height: staffGap * 3,
          width: 1.5, background: "var(--ink)",
        }} />
        {/* closing barline */}
        <div style={{
          position: "absolute",
          right: padR - 2, top: 14, height: staffGap * 3,
          width: 1.5, background: "var(--ink)",
        }} />

        {/* cluster barlines & label brackets */}
        {measures.map((cluster, ci) => {
          if (ci === 0) return null;
          return (
            <div key={ci} style={{
              position: "absolute",
              left: cluster.startX - 8, top: 14, height: staffGap * 3,
              width: 1.5, background: "var(--ink)",
            }} />
          );
        })}

        {/* measures (blocks) */}
        {measures.map((cluster) => (
          cluster.blocks.map(({ b, x, w }, bi) => {
            const sub = SUBJECT[b.subject];
            return ALL.map((kidId, ki) => {
              const has = b.kids.includes(kidId);
              if (!has) return null;
              return (
                <div key={`${b.id}-${kidId}`} style={{
                  position: "absolute",
                  left: x, top: 14 + ki * staffGap - 6,
                  width: w, height: 12,
                  background: sub.bright,
                  borderRadius: 1,
                }} />
              );
            });
          })
        ))}

        {/* cluster bracket labels — bottom of stave */}
        {measures.map((cluster, ci) => {
          const c = cluster.c;
          const sub = SUBJECT[c.subject];
          return (
            <button key={c.id} onClick={() => setOpen(c.id)} style={{
              position: "absolute",
              left: cluster.startX,
              top: 14 + staffGap * 3 + 8,
              width: cluster.endX - cluster.startX,
              border: "none", background: "transparent",
              cursor: "pointer", padding: 0, textAlign: "center",
            }}>
              <div style={{
                width: "100%", height: 1.5, background: c.id === openId ? "var(--saffron)" : "var(--ink)",
              }} />
              <div className="mono" style={{
                marginTop: 5, fontSize: 9,
                color: c.id === openId ? "var(--ink)" : "var(--meta)",
                fontWeight: c.id === openId ? 700 : 400,
              }}>
                {c.minutes}M · {c.blocks.length}×20
              </div>
            </button>
          );
        })}
      </div>

      {/* cluster titles below the score, in execution order */}
      <div style={{ padding: "10px 22px 0", display: "flex", flexDirection: "column", gap: 2 }}>
        {CLUSTERS.map((c, ci) => (
          <ClusterLine key={c.id} c={c} index={ci}
            isOpen={openId === c.id}
            onToggle={() => setOpen(c.id)} />
        ))}
      </div>
    </div>
  );
}

function ClusterLine({ c, index, isOpen, onToggle }) {
  const sub = SUBJECT[c.subject];
  return (
    <div style={{
      borderTop: index === 0 ? "1.5px solid var(--ink)" : "1px solid var(--rule)",
    }}>
      <button onClick={onToggle} style={{
        background: "transparent", border: "none", padding: "14px 0",
        cursor: "pointer", textAlign: "left", width: "100%",
        display: "grid", gridTemplateColumns: "28px 1fr auto", columnGap: 10, alignItems: "baseline",
      }}>
        <div className="mono" style={{ fontSize: 10, color: "var(--meta)" }}>
          {String(index + 1).padStart(2, "0")}
        </div>
        <div>
          <div style={{ fontFamily: "Fraunces", fontWeight: 600, fontSize: 18, color: "var(--ink)", lineHeight: 1.15, letterSpacing: "-0.01em" }}>
            {c.name}
          </div>
          <div className="mono" style={{ fontSize: 10, color: "var(--meta)", marginTop: 5 }}>
            {c.summary.mode === "same-room" ? "TUTTI · ALL FOUR" : "DIVISI · SPLIT"}
          </div>
        </div>
        <span className="mono" style={{
          fontSize: 11, color: "var(--ink)",
          borderBottom: "1.5px solid var(--saffron)", paddingBottom: 1,
        }}>
          {c.action}
        </span>
      </button>

      {isOpen && (
        <div style={{ paddingBottom: 14 }}>
          {c.blocks.map((b, bi) => {
            const sub = SUBJECT[b.subject];
            return (
              <div key={b.id} style={{
                padding: "10px 0",
                borderTop: "1px dotted var(--rule)",
                display: "grid",
                gridTemplateColumns: "28px 1fr auto",
                columnGap: 10,
              }}>
                <div className="mono" style={{ fontSize: 10, color: "var(--meta)" }}>
                  .{bi + 1}
                </div>
                <div>
                  {/* mini score showing this block's voicing */}
                  <div style={{ display: "flex", gap: 3, marginBottom: 8 }}>
                    {ALL.map((k, ki) => {
                      const has = b.kids.includes(k);
                      return (
                        <span key={k} style={{
                          flex: 1, height: 14,
                          background: has ? sub.bright : "transparent",
                          borderTop: has ? "none" : "1px solid var(--rule)",
                          borderBottom: has ? "none" : "1px solid var(--rule)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 9,
                          color: has ? "rgba(0,0,0,0.7)" : "var(--faint)",
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
                <div className="mono" style={{ fontSize: 10, color: "var(--meta)" }}>
                  m.{bi + 1}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { Score });
