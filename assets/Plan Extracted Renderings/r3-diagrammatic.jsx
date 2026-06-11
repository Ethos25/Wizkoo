/* global React, KIDS, ALL, SUBJECT, DAY, DAYS, CLUSTERS, BrandBand, PhoneStatus, DayStrip */

// =============================================================
// Direction 3 — DIAGRAMMATIC
// Anchored on: transit map. Time descends as a single line down the
// page. Each cluster is a station — a labeled stop with its subject
// color and a fully-spelled cluster name. The four children appear at
// each station as small name-tags pinned to the platform. A split
// cluster shows the line forking into two tracks (Jack/Jane on one,
// Leo/Max on the other) and merging again. Names are always written.
// Three-second test: stations and lines is a vocabulary every adult
// already has.
// =============================================================

function Diagrammatic({ openId, setOpen }) {
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

      <div style={{ padding: "22px 22px 0" }}>
        <div className="mono" style={{ fontSize: 10, color: "var(--meta)" }}>TUESDAY · MORNING LINE · 9 STOPS</div>
        <h1 className="serif" style={{ margin: "6px 0 0", fontSize: 30, lineHeight: 1.05, fontWeight: 600, letterSpacing: "-0.02em" }}>
          Bridges <span style={{ fontStyle: "italic", fontWeight: 500 }}>and</span> Engineering
        </h1>
        <div className="mono" style={{ marginTop: 10, fontSize: 9, color: "var(--meta)" }}>FAMILY · {KIDS.map(k => k.name).join(" · ")}</div>
      </div>

      <div style={{ padding: "26px 22px 0" }}>
        <TransitMap openId={openId} setOpen={setOpen} />
      </div>
    </div>
  );
}

function TransitMap({ openId, setOpen }) {
  return (
    <div style={{ position: "relative", paddingLeft: 8 }}>
      {CLUSTERS.map((c, ci) => (
        <Station key={c.id} c={c} index={ci}
          isOpen={openId === c.id}
          onToggle={() => setOpen(c.id)}
          isLast={ci === CLUSTERS.length - 1}
          nextSubject={CLUSTERS[ci + 1]?.subject} />
      ))}
    </div>
  );
}

function Station({ c, index, isOpen, onToggle, isLast, nextSubject }) {
  const sub = SUBJECT[c.subject];
  const nextSub = nextSubject ? SUBJECT[nextSubject] : null;
  const split = c.summary.mode === "split";

  return (
    <div style={{ position: "relative", paddingLeft: 32 }}>
      {/* line going down to the next station */}
      {!isLast && (
        <>
          {/* segment from this station downward in this color */}
          <span style={{
            position: "absolute", left: 11, top: 28,
            width: 5, bottom: 0,
            background: sub.bright,
          }} />
          {/* color-blend at the bottom transitions to next subject */}
          {nextSub && (
            <span style={{
              position: "absolute", left: 11, bottom: 0,
              width: 5, height: 32,
              background: `linear-gradient(to bottom, ${sub.bright}, ${nextSub.bright})`,
            }} />
          )}
        </>
      )}

      {/* station node */}
      <span style={{
        position: "absolute", left: 5, top: 18,
        width: 17, height: 17, borderRadius: 17,
        background: "var(--chalk)",
        border: `4px solid ${sub.bright}`,
        boxSizing: "border-box",
      }} />

      {/* time tick — small mono label to the LEFT of the line for this stop */}
      <span className="mono" style={{
        position: "absolute", left: -34, top: 22,
        fontSize: 9, color: "var(--meta)", textAlign: "right", width: 28,
      }}>
        {c.minutes}M
      </span>

      <div style={{ paddingBottom: isLast ? 0 : 20 }}>
        <button onClick={onToggle} style={{
          background: "transparent", border: "none", padding: "10px 0 0", cursor: "pointer", textAlign: "left",
          width: "100%", display: "block",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div className="mono" style={{ fontSize: 9, color: sub.deep }}>
              STOP {String(index + 1).padStart(2, "0")} · {sub.name.toUpperCase()} · {c.blocks.length}×20M
            </div>
            <span className="mono" style={{
              fontSize: 11, color: "var(--ink)",
              borderBottom: "1.5px solid var(--saffron)", paddingBottom: 1,
            }}>
              {c.action}
            </span>
          </div>
          <div style={{ fontFamily: "Fraunces", fontWeight: 600, fontSize: 19, color: "var(--ink)", lineHeight: 1.1, letterSpacing: "-0.01em", marginTop: 4 }}>
            {c.name}
          </div>

          {/* platform — names */}
          <div style={{ marginTop: 10, display: "flex", gap: 6 }}>
            {!split && KIDS.map(k => {
              const inn = c.summary.kids.includes(k.id);
              return (
                <span key={k.id} style={{
                  flex: 1, padding: "5px 0", textAlign: "center",
                  background: inn ? "var(--paper)" : "transparent",
                  border: `1px solid ${inn ? "var(--ink)" : "var(--rule)"}`,
                  fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 11,
                  color: inn ? "var(--ink)" : "var(--faint)",
                  borderRadius: 2, opacity: inn ? 1 : 0.5,
                }}>
                  {k.name}
                </span>
              );
            })}
            {split && (
              <SplitPlatforms c={c} />
            )}
          </div>
        </button>

        {isOpen && (
          <div style={{ marginTop: 12, padding: "8px 12px 12px", borderLeft: `3px solid ${sub.bright}`, marginLeft: 0 }}>
            {c.blocks.map((b, bi) => (
              <DiagBlock key={b.id} b={b} index={bi} last={bi === c.blocks.length - 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SplitPlatforms({ c }) {
  // group kids into pairs based on which block they appear in
  // pull from the blocks: take the kids of block 0 vs others
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
    <div style={{ flex: 1, display: "flex", gap: 10 }}>
      {groups.map((g, gi) => (
        <div key={gi} style={{ flex: 1, position: "relative" }}>
          <div className="mono" style={{ fontSize: 8, color: "var(--meta)", marginBottom: 3 }}>
            TRACK {gi + 1}
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {g.kids.map(kid => {
              const k = KIDS.find(x => x.id === kid);
              return (
                <span key={kid} style={{
                  flex: 1, padding: "5px 0", textAlign: "center",
                  background: "var(--paper)",
                  border: "1px solid var(--ink)",
                  fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 11,
                  color: "var(--ink)", borderRadius: 2,
                }}>
                  {k.name}
                </span>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function DiagBlock({ b, index, last }) {
  const sub = SUBJECT[b.subject];
  return (
    <div style={{ paddingTop: index === 0 ? 0 : 10, paddingBottom: last ? 0 : 10, borderBottom: last ? "none" : "1px dotted var(--rule)" }}>
      <div className="mono" style={{ fontSize: 9, color: sub.deep }}>
        BLOCK {index + 1} · 20 MIN · {b.mode.toUpperCase().replace("-", " ")}
      </div>
      <div style={{ fontFamily: "Fraunces", fontWeight: 600, fontSize: 14, color: "var(--ink)", lineHeight: 1.2, marginTop: 2 }}>
        {b.title}
      </div>
      <div style={{ marginTop: 6, display: "flex", gap: 6 }}>
        {b.kids.map(kid => {
          const k = KIDS.find(x => x.id === kid);
          return (
            <span key={kid} style={{
              fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 11,
              color: "var(--ink)",
              padding: "2px 8px",
              background: "var(--chalk)",
              border: "1px solid var(--ink)",
              borderRadius: 2,
            }}>
              {k.name}
            </span>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { Diagrammatic });
