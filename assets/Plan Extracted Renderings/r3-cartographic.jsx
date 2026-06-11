/* global React, KIDS, ALL, SUBJECT, DAY, DAYS, CLUSTERS, BrandBand, PhoneStatus, DayStrip */

// =============================================================
// Direction 4 — CARTOGRAPHIC
// Anchored on: a small map of the morning. The five clusters are five
// labeled "regions" stacked top-to-bottom — time is latitude. Each
// region is filled with its subject color and labeled with cluster
// name + minutes. Children appear as small named flags placed inside
// each region according to who's there. A scale bar in the corner
// stands in for pace. Names are always written. The whole thing is a
// printable place: paper-on-paper, with cartouche, scale, and key.
// =============================================================

function Cartographic({ openId, setOpen }) {
  return (
    <div className="frame" style={{ background: "var(--chalk)", paddingBottom: 80 }}>
      <BrandBand>
        <PhoneStatus tone="chalk" />
        <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="mono" style={{ fontSize: 10, color: "rgba(248,244,233,0.65)" }}>WIZKOO · WEEK 16</span>
          <span className="mono" style={{ fontSize: 10, color: "var(--saffron)" }}>847 / 900 · ON PACE</span>
        </div>
        <DayStrip tone="chalk" />
      </BrandBand>

      {/* Cartouche — the day header as a map title block */}
      <div style={{ padding: "22px 22px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div className="mono" style={{ fontSize: 10, color: "var(--meta)" }}>A MAP OF · TUESDAY MORNING</div>
          <h1 className="serif" style={{ margin: "6px 0 0", fontSize: 28, lineHeight: 1.05, fontWeight: 600, letterSpacing: "-0.02em" }}>
            Bridges <span style={{ fontStyle: "italic", fontWeight: 500 }}>and</span> Engineering
          </h1>
        </div>
        {/* Scale bar */}
        <div style={{ paddingTop: 4 }}>
          <div className="mono" style={{ fontSize: 8, color: "var(--meta)", textAlign: "right" }}>SCALE</div>
          <div style={{ display: "flex", alignItems: "center", gap: 0, marginTop: 4 }}>
            {[0,1,2,3].map(i => (
              <span key={i} style={{
                width: 12, height: 6,
                background: i % 2 === 0 ? "var(--ink)" : "var(--chalk)",
                border: "1px solid var(--ink)",
                borderRight: i === 3 ? "1px solid var(--ink)" : "none",
              }} />
            ))}
          </div>
          <div className="mono" style={{ fontSize: 8, color: "var(--meta)", textAlign: "right", marginTop: 3 }}>20M PER UNIT</div>
        </div>
      </div>

      {/* Family key */}
      <div style={{ padding: "16px 22px 0" }}>
        <div className="mono" style={{ fontSize: 9, color: "var(--meta)", marginBottom: 6 }}>FAMILY · KEY</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {KIDS.map(k => (
            <span key={k.id} style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
              <span style={{ width: 6, height: 6, background: "var(--ink)", borderRadius: 6 }} />
              <span style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 11 }}>{k.name}</span>
              <span className="mono" style={{ fontSize: 8, color: "var(--meta)" }}>·{k.age}</span>
            </span>
          ))}
        </div>
      </div>

      {/* The map */}
      <div style={{ padding: "22px 22px 0" }}>
        <div style={{
          border: "1.5px solid var(--ink)",
          padding: 6,
          background: "var(--paper)",
        }}>
          {CLUSTERS.map((c, ci) => (
            <Region key={c.id} c={c} index={ci}
              isOpen={openId === c.id}
              onToggle={() => setOpen(c.id)}
              isLast={ci === CLUSTERS.length - 1} />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          <span className="mono" style={{ fontSize: 8, color: "var(--meta)" }}>NORTH ↑ EARLIER</span>
          <span className="mono" style={{ fontSize: 8, color: "var(--meta)" }}>SOUTH ↓ LATER</span>
        </div>
      </div>
    </div>
  );
}

function Region({ c, index, isOpen, onToggle, isLast }) {
  const sub = SUBJECT[c.subject];
  // size of region scaled to minutes — 20m=72px, 40m=120px, 60m=170px
  const baseH = 60 + (c.minutes - 20) * 2.4;
  const split = c.summary.mode === "split";

  return (
    <div>
      <div onClick={onToggle} style={{
        background: `${sub.bright}`,
        position: "relative",
        cursor: "pointer",
        borderBottom: isLast ? "none" : "1.5px solid var(--ink)",
        minHeight: baseH,
        padding: "10px 12px 12px",
        overflow: "hidden",
      }}>
        {/* subtle hatching to read as 'territory' */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "repeating-linear-gradient(45deg, rgba(0,0,0,0.06) 0 1px, transparent 1px 8px)",
          pointerEvents: "none",
        }} />
        {/* index */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", position: "relative" }}>
          <div className="mono" style={{ fontSize: 9, color: "rgba(0,0,0,0.65)" }}>
            REGION {String(index + 1).padStart(2, "0")} · {c.minutes} MIN
          </div>
          <span className="mono" style={{
            fontSize: 10, color: "rgba(0,0,0,0.85)",
            borderBottom: "1.5px solid rgba(0,0,0,0.85)", paddingBottom: 1,
          }}>
            {c.action}
          </span>
        </div>
        <div style={{
          fontFamily: "Fraunces", fontWeight: 600, fontSize: 18, lineHeight: 1.1, letterSpacing: "-0.01em",
          color: "rgba(0,0,0,0.9)", marginTop: 6, position: "relative",
        }}>
          {c.name}
        </div>
        <div className="mono" style={{ fontSize: 9, color: "rgba(0,0,0,0.6)", marginTop: 4, position: "relative" }}>
          {sub.name.toUpperCase()} · {c.summary.mode.toUpperCase().replace("-"," ")}
        </div>

        {/* flags */}
        <div style={{ marginTop: 10, position: "relative" }}>
          {!split ? (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {c.summary.kids.map(kid => {
                const k = KIDS.find(x => x.id === kid);
                return <Flag key={kid} name={k.name} />;
              })}
            </div>
          ) : (
            <SplitFlags c={c} />
          )}
        </div>
      </div>

      {isOpen && (
        <div style={{
          background: "var(--chalk)",
          padding: "12px 14px",
          borderBottom: isLast ? "none" : "1.5px solid var(--ink)",
        }}>
          {c.blocks.map((b, bi) => (
            <CartoBlock key={b.id} b={b} index={bi} last={bi === c.blocks.length - 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function Flag({ name }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "3px 8px 3px 5px",
      background: "var(--chalk)",
      border: "1px solid var(--ink)",
      borderRadius: 2,
      fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 11,
      color: "var(--ink)",
    }}>
      <span style={{ width: 4, height: 4, background: "var(--ink)", borderRadius: 4 }} />
      {name}
    </span>
  );
}

function SplitFlags({ c }) {
  const groups = [];
  const seen = new Set();
  c.blocks.forEach(b => {
    const key = b.kids.slice().sort().join(",");
    if (!seen.has(key)) {
      seen.add(key);
      groups.push({ key, kids: b.kids });
    }
  });
  return (
    <div style={{ display: "flex", gap: 14 }}>
      {groups.map((g, gi) => (
        <div key={gi} style={{ flex: 1 }}>
          <div className="mono" style={{ fontSize: 8, color: "rgba(0,0,0,0.55)", marginBottom: 4 }}>
            GROUP {gi + 1}
          </div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {g.kids.map(kid => {
              const k = KIDS.find(x => x.id === kid);
              return <Flag key={kid} name={k.name} />;
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function CartoBlock({ b, index, last }) {
  const sub = SUBJECT[b.subject];
  return (
    <div style={{ paddingTop: index === 0 ? 0 : 10, paddingBottom: last ? 0 : 10, borderBottom: last ? "none" : "1px dotted var(--rule)" }}>
      <div className="mono" style={{ fontSize: 9, color: sub.deep }}>
        SITE {index + 1} · 20 MIN · {b.mode.toUpperCase().replace("-", " ")}
      </div>
      <div style={{ fontFamily: "Fraunces", fontWeight: 600, fontSize: 14, color: "var(--ink)", lineHeight: 1.2, marginTop: 2 }}>
        {b.title}
      </div>
      <div style={{ marginTop: 6, display: "flex", gap: 6, flexWrap: "wrap" }}>
        {b.kids.map(kid => {
          const k = KIDS.find(x => x.id === kid);
          return <Flag key={kid} name={k.name} />;
        })}
      </div>
    </div>
  );
}

Object.assign(window, { Cartographic });
