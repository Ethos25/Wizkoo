/* global React, KIDS, ALL, SUBJECT, DAY, DAYS, CLUSTERS, PhoneStatus */

// =============================================================
// Direction 2 — CONSTELLATION
// Central choice: extends the brand's planetarium ambient. The day is a
// vertical celestial chart in the night-sky surface. Each cluster is a
// constellation: stars are kids (initial inside), star color is the
// SUBJECT they're doing, lines drawn between stars in the same block
// show "doing this together." A same-room block is a fully-connected
// star group; parallel is two disjoint pairs at the same altitude;
// independent is a lone star. Time descends along the chart.
// =============================================================

const STAR_BASE = 22; // diameter for the youngest
const AGE_TO_R = (age) => STAR_BASE/2 + (age - 4) * 1.4; // older = larger, gently

function Constellation({ openId, setOpen }) {
  return (
    <div className="frame" style={{
      background: "radial-gradient(140% 80% at 70% -10%, #1d2350 0%, #0C1020 55%, #050714 100%)",
      color: "#F2EFE1", paddingBottom: 80, position: "relative", overflow: "hidden",
    }}>
      {/* deep stars */}
      <DeepStars />

      <PhoneStatus tone="chalk" />

      {/* Top: week + pace */}
      <div style={{ padding: "10px 22px 0", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 2 }}>
        <span className="mono" style={{ fontSize: 10, color: "rgba(248,244,233,0.55)" }}>WEEK 16 · TUE 7:45</span>
        <span className="mono" style={{ fontSize: 10, color: "var(--saffron)", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 6, height: 6, background: "var(--saffron)", borderRadius: 6, boxShadow: "0 0 8px var(--saffron)" }} />
          847/900 · ON PACE
        </span>
      </div>

      {/* Day strip — five small stars */}
      <div style={{ padding: "20px 22px 0", position: "relative", zIndex: 2 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 4 }}>
          {DAYS.map((d, i) => {
            const isToday = d.state === "today";
            const isDone = d.state === "done";
            return (
              <button key={i} style={{
                background: "transparent", border: "none", cursor: "pointer", padding: 0,
                display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
              }}>
                <span style={{
                  width: isToday ? 10 : isDone ? 5 : 3,
                  height: isToday ? 10 : isDone ? 5 : 3,
                  borderRadius: 10,
                  background: isToday ? "var(--saffron)" : isDone ? "rgba(248,244,233,0.7)" : "rgba(248,244,233,0.25)",
                  boxShadow: isToday ? "0 0 14px rgba(232,175,56,0.85)" : "none",
                }} />
                <span className="mono" style={{
                  fontSize: 10,
                  color: isToday ? "var(--saffron)" : isDone ? "rgba(248,244,233,0.7)" : "rgba(248,244,233,0.35)",
                  fontWeight: isToday ? 700 : 400,
                }}>{d.short}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Day header */}
      <div style={{ padding: "30px 22px 4px", position: "relative", zIndex: 2 }}>
        <div className="mono" style={{ fontSize: 10, color: "rgba(232,175,56,0.85)" }}>TUESDAY · TODAY</div>
        <h1 className="serif" style={{
          fontSize: 32, lineHeight: 1.05, fontWeight: 600, letterSpacing: "-0.02em",
          margin: "8px 0 0", color: "#F8F4E9", textWrap: "balance",
        }}>
          Bridges <span style={{ fontStyle: "italic", fontWeight: 500, color: "var(--saffron)" }}>and</span> Engineering.
        </h1>
      </div>

      {/* Family legend — small row */}
      <div style={{ padding: "20px 22px 0", display: "flex", gap: 14, position: "relative", zIndex: 2 }}>
        {KIDS.map((k) => (
          <div key={k.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{
              width: 18, height: 18, borderRadius: 18,
              background: "rgba(248,244,233,0.08)", border: "1px solid rgba(248,244,233,0.5)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 10, color: "#F8F4E9",
            }}>{k.initial}</span>
            <span className="mono" style={{ fontSize: 9, color: "rgba(248,244,233,0.6)" }}>{k.age}</span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{ padding: "26px 22px 0", position: "relative", zIndex: 2 }}>
        {CLUSTERS.map((c, i) => (
          <ClusterChart key={c.id} c={c} index={i}
            isOpen={openId === c.id}
            onToggle={() => setOpen(c.id)} />
        ))}
      </div>
    </div>
  );
}

function DeepStars() {
  const seeds = [
    [12, 22, 1], [40, 60, 1.4], [70, 30, 1], [120, 18, 1.2], [180, 80, 1],
    [220, 36, 1.3], [260, 14, 1], [300, 70, 1], [340, 28, 1.2],
    [50, 110, 1], [110, 130, 1.1], [200, 120, 1], [280, 145, 1.2], [350, 100, 1],
    [80, 170, 1], [160, 60, 0.8], [240, 95, 1], [20, 80, 0.8], [330, 160, 1.1], [150, 175, 0.8],
    [40, 230, 1], [200, 220, 1], [320, 240, 0.9], [60, 280, 0.8], [240, 290, 1],
    [120, 320, 1], [300, 340, 0.9], [380, 380, 1], [10, 360, 0.8], [180, 380, 0.8],
    [100, 460, 0.7], [260, 480, 0.9], [340, 520, 0.7], [40, 540, 0.8], [200, 560, 0.7],
    [80, 620, 0.7], [320, 640, 0.7], [160, 680, 0.6], [240, 720, 0.7], [60, 760, 0.6],
  ];
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none" }}>
      {seeds.map(([x, y, r], i) => (
        <span key={i} style={{
          position: "absolute", left: x, top: y,
          width: r * 1.6, height: r * 1.6,
          background: "rgba(248,244,233,0.6)", borderRadius: 4,
          boxShadow: "0 0 4px rgba(248,244,233,0.3)",
        }} />
      ))}
    </div>
  );
}

function ClusterChart({ c, index, isOpen, onToggle }) {
  const sub = SUBJECT[c.subject];

  return (
    <div style={{ marginBottom: 28 }}>
      {/* heading */}
      <button onClick={onToggle} style={{
        background: "transparent", border: "none", padding: 0, cursor: "pointer", textAlign: "left",
        width: "100%", marginBottom: 14, display: "block",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div className="mono" style={{ fontSize: 10, color: "rgba(248,244,233,0.55)" }}>
            № {String(index + 1).padStart(2, "0")} · {c.minutes}M · {c.blocks.length}×20
          </div>
          <span className="mono" style={{
            fontSize: 11, color: "var(--saffron)",
            borderBottom: "1.5px solid var(--saffron)", paddingBottom: 1,
          }}>
            {c.action}
          </span>
        </div>
        <h2 className="serif" style={{
          margin: "6px 0 0", fontSize: 22, lineHeight: 1.15, fontWeight: 600, letterSpacing: "-0.01em",
          color: "#F8F4E9",
        }}>
          {c.name}
        </h2>
      </button>

      {/* the constellation chart — one row per block */}
      <div style={{
        background: "rgba(248,244,233,0.03)",
        border: "1px solid rgba(248,244,233,0.1)",
        borderRadius: 12,
        padding: "16px 14px",
        position: "relative",
      }}>
        {c.blocks.map((b, bi) => (
          <BlockConstellation key={b.id} b={b} expanded={isOpen} index={bi} last={bi === c.blocks.length - 1} />
        ))}
      </div>
    </div>
  );
}

function BlockConstellation({ b, expanded, index, last }) {
  const sub = SUBJECT[b.subject];
  const idxs = b.kids.map(k => ALL.indexOf(k)).sort((a, z) => a - z);

  // Lay stars across the row at fixed positions per child slot
  // 4 slots, slot width derived from container 346 - 28 padding = ~318
  const containerW = 318;
  const slotW = containerW / 4;
  const xFor = (slotIdx) => slotW * slotIdx + slotW / 2;

  // Group: same-room=connected line(s); parallel=split into pairs by mode
  // Specifically: for the parallel block (load-testing), all four are doing
  // their OWN documentation — we draw four solo stars w/ no connections.
  const groups = [];
  if (b.mode === "parallel") {
    idxs.forEach(i => groups.push([i]));
  } else {
    // same-room: one group containing all
    groups.push([...idxs]);
  }

  const rowH = expanded ? 64 : 38;

  return (
    <div style={{
      position: "relative",
      height: rowH,
      borderBottom: last ? "none" : "1px dashed rgba(248,244,233,0.1)",
      paddingTop: 10,
      marginBottom: last ? 0 : 8,
    }}>
      {/* connection lines */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: rowH, pointerEvents: "none" }}>
        {groups.map((g, gi) => {
          if (g.length < 2) return null;
          const xs = g.map(xFor);
          return (
            <line key={gi}
              x1={xs[0]} y1={20}
              x2={xs[xs.length - 1]} y2={20}
              stroke={sub.bright}
              strokeWidth="1.5"
              strokeOpacity="0.6" />
          );
        })}
      </svg>

      {/* stars */}
      {ALL.map((kid, slotIdx) => {
        const isIn = idxs.includes(slotIdx);
        const k = KIDS[slotIdx];
        const r = AGE_TO_R(k.age);
        if (!isIn) {
          // ghosted star to keep alignment readable
          return (
            <span key={kid} style={{
              position: "absolute",
              left: xFor(slotIdx) - 3,
              top: 18, width: 6, height: 6, borderRadius: 6,
              background: "rgba(248,244,233,0.1)",
            }} />
          );
        }
        return (
          <span key={kid} style={{
            position: "absolute",
            left: xFor(slotIdx) - r,
            top: 20 - r,
            width: r * 2, height: r * 2, borderRadius: r * 2,
            background: sub.bright,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "Plus Jakarta Sans", fontWeight: 700,
            fontSize: r * 0.95, color: "rgba(0,0,0,0.85)",
            boxShadow: `0 0 ${r * 0.8}px ${sub.bright}66`,
          }}>{k.initial}</span>
        );
      })}

      {/* expanded info */}
      {expanded && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 44, padding: "0 2px" }}>
          <div className="mono" style={{ fontSize: 9, color: sub.bright, opacity: 0.95 }}>
            {sub.name.toUpperCase()} · {b.mode.toUpperCase().replace("-", " ")} · 20M
          </div>
          <div style={{ fontFamily: "Fraunces", fontWeight: 600, fontSize: 14, color: "#F8F4E9", marginTop: 2, lineHeight: 1.2 }}>
            {b.title}
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { Constellation });
