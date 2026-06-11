/* global React, KIDS, ALL, SUBJECT, DAY, DAYS, CLUSTERS */

// =============================================================
// Direction 1 — LOOM
// Central choice: the family's morning is woven. Four narrow columns
// (one per child, young → old, left → right). Time runs top → bottom.
// Each block is a colored bar threaded across the columns the children
// in that block are part of. Same-room blocks are unbroken bars across
// every participating column; parallel blocks split the row into
// segments. Color = subject. Position = child. Span = together-or-apart.
// "Who is doing what together" reads in zero seconds.
// =============================================================

const COL_W = 64;
const GAP = 14;
const BAR_H_COLLAPSED = 24;
const BAR_H_EXPANDED = 44;

function Loom({ openId, setOpen }) {
  return (
    <div className="frame" style={{ background: "var(--chalk)", paddingBottom: 80 }}>
      <PhoneStatus />

      <div style={{ padding: "10px 22px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="mono" style={{ fontSize: 10, color: "var(--meta)" }}>WEEK 16 · TUE 7:45</span>
        <button className="mono" style={{
          fontSize: 10, color: "var(--meta)", background: "transparent", border: "none",
          letterSpacing: "0.14em", display: "flex", alignItems: "center", gap: 6, cursor: "pointer",
        }}>
          <span style={{ width: 6, height: 6, background: "var(--saffron)", borderRadius: 6 }} />
          847/900 · ON PACE
        </button>
      </div>

      <DayStrip />

      <div style={{ padding: "22px 22px 0" }}>
        <div className="mono" style={{ fontSize: 10, color: "var(--meta)" }}>TUESDAY · TODAY</div>
        <h1 className="serif" style={{ margin: "6px 0 0", fontSize: 30, lineHeight: 1.05, fontWeight: 600, letterSpacing: "-0.02em" }}>
          Bridges <span style={{ fontStyle: "italic", fontWeight: 500 }}>and</span> Engineering
        </h1>
      </div>

      {/* The loom */}
      <div style={{ padding: "24px 22px 0" }}>
        <ColumnHeads />
        <div style={{ position: "relative", marginTop: 12 }}>
          {/* warp threads */}
          <WarpThreads />
          {CLUSTERS.map((c) => (
            <ClusterWeave key={c.id} c={c}
              isOpen={openId === c.id}
              onToggle={() => setOpen(c.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ColumnHeads() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(4, ${COL_W}px)`, columnGap: GAP }}>
      {KIDS.map((k) => (
        <div key={k.id} style={{ textAlign: "center" }}>
          <div style={{
            width: 30, height: 30, borderRadius: 30, margin: "0 auto",
            border: "1.5px solid var(--ink)", display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 13, color: "var(--ink)",
            background: "var(--chalk)",
          }}>{k.initial}</div>
          <div className="mono" style={{ fontSize: 9, color: "var(--meta)", marginTop: 5 }}>AGE {k.age}</div>
        </div>
      ))}
    </div>
  );
}

function WarpThreads() {
  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "grid",
      gridTemplateColumns: `repeat(4, ${COL_W}px)`, columnGap: GAP,
      pointerEvents: "none",
    }}>
      {KIDS.map((k) => (
        <div key={k.id} style={{
          background: "repeating-linear-gradient(to bottom, var(--rule) 0 1px, transparent 1px 4px)",
          backgroundSize: "1px 100%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }} />
      ))}
    </div>
  );
}

function ClusterWeave({ c, isOpen, onToggle }) {
  const barH = isOpen ? BAR_H_EXPANDED : BAR_H_COLLAPSED;
  const blockGap = isOpen ? 64 : 6;

  // total height computed for the row group
  const groupH = c.blocks.length * barH + (c.blocks.length - 1) * blockGap;

  return (
    <div style={{ marginBottom: 22, position: "relative" }}>
      {/* cluster heading */}
      <button onClick={onToggle} style={{
        background: "transparent", border: "none", padding: 0, cursor: "pointer", textAlign: "left",
        width: "100%", marginBottom: 10,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div className="mono" style={{ fontSize: 10, color: "var(--meta)" }}>
            {c.minutes} MIN · {c.blocks.length}×20M · {c.summary.mode === "same-room" ? "TOGETHER" : "SPLIT"}
          </div>
          <span className="mono" style={{
            fontSize: 11, color: "var(--ink)",
            borderBottom: "1.5px solid var(--saffron)", paddingBottom: 1,
          }}>
            {c.action}
          </span>
        </div>
        <h2 className="serif" style={{ margin: "4px 0 0", fontSize: 19, fontWeight: 600, letterSpacing: "-0.01em" }}>
          {c.name}
        </h2>
      </button>

      {/* the weft — block bars laid one per row */}
      <div style={{ position: "relative", height: groupH }}>
        {c.blocks.map((b, bi) => (
          <BlockBar key={b.id} b={b} barH={barH} expanded={isOpen}
            top={bi * (barH + blockGap)} />
        ))}
      </div>
    </div>
  );
}

function BlockBar({ b, barH, expanded, top }) {
  const idxs = b.kids.map(k => ALL.indexOf(k)).sort((a, z) => a - z);

  // Build segments: same-room => merge consecutive; parallel => each kid own segment
  const segments = [];
  if (b.mode === "parallel") {
    idxs.forEach(i => segments.push([i]));
  } else {
    let cur = [idxs[0]];
    for (let i = 1; i < idxs.length; i++) {
      if (idxs[i] === cur[cur.length - 1] + 1) cur.push(idxs[i]);
      else { segments.push(cur); cur = [idxs[i]]; }
    }
    segments.push(cur);
  }

  const sub = SUBJECT[b.subject];

  return (
    <div style={{ position: "absolute", left: 0, right: 0, top }}>
      <div style={{ position: "relative", height: barH }}>
        {segments.map((seg, si) => {
          const left = seg[0] * (COL_W + GAP);
          const width = seg.length * COL_W + (seg.length - 1) * GAP;
          return (
            <div key={si} style={{
              position: "absolute", left, top: 0, width, height: barH,
              background: sub.bright, borderRadius: 2,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
              fontFamily: "Plus Jakarta Sans", fontSize: 10, fontWeight: 700,
              color: "rgba(0,0,0,0.85)",
            }}>
              {seg.map((idx) => (
                <span key={idx} style={{
                  width: expanded ? 22 : 16, height: expanded ? 22 : 16, borderRadius: 22,
                  background: "rgba(0,0,0,0.16)",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontSize: expanded ? 11 : 10, fontWeight: 700,
                }}>{KIDS[idx].initial}</span>
              ))}
            </div>
          );
        })}
      </div>

      {/* expanded — title and meta drop below the bar */}
      {expanded && (
        <div style={{ marginTop: 8, paddingLeft: 0 }}>
          <div className="mono" style={{ fontSize: 9, color: sub.deep, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 6, height: 6, background: sub.bright }} />
            {sub.name.toUpperCase()} · {b.mode.toUpperCase().replace("-", " ")} · 20M
          </div>
          <div style={{ fontFamily: "Fraunces", fontWeight: 600, fontSize: 15, color: "var(--ink)", marginTop: 3, lineHeight: 1.2 }}>
            {b.title}
          </div>
        </div>
      )}
    </div>
  );
}

function DayStrip() {
  return (
    <div style={{ padding: "16px 22px 0" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 6 }}>
        {DAYS.map((d, i) => {
          const isToday = d.state === "today";
          const isDone = d.state === "done";
          return (
            <button key={i} style={{
              background: "transparent", border: "none", cursor: "pointer", padding: 0,
              display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
            }}>
              <span style={{
                width: 1.5,
                height: isToday ? 22 : 14,
                background: isToday ? "var(--saffron)" : isDone ? "var(--ink)" : "var(--rule)",
              }} />
              <span className="mono" style={{
                fontSize: 10,
                color: isToday ? "var(--ink)" : "var(--faint)",
                fontWeight: isToday ? 700 : 400,
              }}>
                {d.short}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PhoneStatus({ tone = "ink" }) {
  const c = tone === "chalk" ? "rgba(248,244,233,0.85)" : "var(--ink)";
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "14px 22px 0", fontFamily: "Plus Jakarta Sans", fontWeight: 600, fontSize: 13,
      color: c,
    }}>
      <span>9:41</span>
      <span style={{ display: "flex", gap: 5, alignItems: "center" }}>
        <span style={{ width: 16, height: 8, border: `1.2px solid ${c}`, borderRadius: 2, position: "relative" }}>
          <span style={{ position: "absolute", left: 1.5, top: 1.5, bottom: 1.5, background: c, width: "62%", display: "block" }} />
        </span>
      </span>
    </div>
  );
}

Object.assign(window, { Loom, PhoneStatus, DayStrip });
