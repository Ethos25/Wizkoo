/* global React, KIDS, ALL, SUBJECT, DAY, DAYS, CLUSTERS, BrandBand, PhoneStatus, DayStrip */

// =============================================================
// Direction 2 — MATERIAL
// Anchored on: paper. Each cluster is a real card pinned to chalk —
// 1.5px ink keyline, 8/8 saffron drop, a small color tab in the upper
// edge that names the subject. Children are spelled-out names on
// horizontal "ribbons" along the lower edge of each card. Pace is a
// little ink-stamped corner mark. The brand-band header sits above as
// the planetarium register; cream is the working surface. Three-second
// test: the parent recognizes paper objects and reads the ink.
// =============================================================

function Material({ openId, setOpen }) {
  return (
    <div className="frame" style={{ background: "var(--chalk)", paddingBottom: 90 }}>
      <BrandBand>
        <PhoneStatus tone="chalk" />
        <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="mono" style={{ fontSize: 10, color: "rgba(248,244,233,0.65)" }}>WIZKOO · WEEK 16</span>
          <span className="mono" style={{ fontSize: 10, color: "var(--saffron)" }}>847 / 900 · ON PACE</span>
        </div>
        <DayStrip tone="chalk" />
      </BrandBand>

      <div style={{ padding: "22px 22px 0" }}>
        <div className="mono" style={{ fontSize: 10, color: "var(--meta)" }}>TUESDAY · 9 BLOCKS · 3 HRS</div>
        <h1 className="serif" style={{ margin: "6px 0 0", fontSize: 30, lineHeight: 1.05, fontWeight: 600, letterSpacing: "-0.02em" }}>
          Bridges <span style={{ fontStyle: "italic", fontWeight: 500 }}>and</span> Engineering
        </h1>
        <div className="mono" style={{ marginTop: 10, fontSize: 9, color: "var(--meta)" }}>FAMILY · {KIDS.map(k => k.name).join(" · ")}</div>
      </div>

      <div style={{ padding: "22px 22px 0", display: "flex", flexDirection: "column", gap: 22 }}>
        {CLUSTERS.map((c, ci) => (
          <PaperCard key={c.id} c={c} index={ci}
            isOpen={openId === c.id}
            onToggle={() => setOpen(c.id)} />
        ))}
      </div>
    </div>
  );
}

function PaperCard({ c, index, isOpen, onToggle }) {
  const sub = SUBJECT[c.subject];
  return (
    <div>
      <div onClick={onToggle} style={{
        background: "var(--paper)", borderRadius: 4,
        border: "1.5px solid var(--ink)",
        boxShadow: "8px 8px 0 0 var(--saffron)",
        cursor: "pointer", position: "relative",
      }}>
        {/* subject tab — like a tabbed file folder */}
        <div style={{
          position: "absolute", top: -1, left: 14,
          background: sub.bright, color: "rgba(0,0,0,0.85)",
          padding: "4px 10px 5px",
          fontFamily: "Space Mono", fontSize: 9, fontWeight: 700,
          letterSpacing: "0.14em", textTransform: "uppercase",
          borderTopLeftRadius: 2, borderTopRightRadius: 2,
          transform: "translateY(-100%)",
          border: "1.5px solid var(--ink)",
          borderBottom: "none",
        }}>
          {sub.name}
        </div>
        {/* index stamp */}
        <div className="mono" style={{
          position: "absolute", top: 12, right: 14,
          fontSize: 9, color: "var(--meta)",
        }}>
          № {String(index + 1).padStart(2, "0")} / 05
        </div>

        <div style={{ padding: "20px 16px 0" }}>
          <div style={{ fontFamily: "Fraunces", fontWeight: 600, fontSize: 21, lineHeight: 1.1, letterSpacing: "-0.01em", color: "var(--ink)" }}>
            {c.name}
          </div>
          <div style={{ fontFamily: "Fraunces", fontStyle: "italic", fontSize: 13, color: "var(--mid)", marginTop: 4 }}>
            about {c.minutes} minutes · {c.blocks.length} × 20-min block{c.blocks.length > 1 ? "s" : ""}
          </div>
        </div>

        {/* family ribbon */}
        <div style={{ padding: "14px 16px 0" }}>
          <div className="mono" style={{ fontSize: 9, color: "var(--meta)", marginBottom: 6 }}>
            {c.summary.mode === "same-room" ? "TOGETHER" : c.summary.mode === "parallel" ? "EACH ON THEIR OWN" : "SPLIT"}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {KIDS.map(k => {
              const inn = c.summary.kids.includes(k.id);
              return (
                <span key={k.id} style={{
                  flex: 1, padding: "6px 0", textAlign: "center",
                  background: inn ? sub.bright : "transparent",
                  color: inn ? "rgba(0,0,0,0.85)" : "var(--faint)",
                  fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 11,
                  border: `1px solid ${inn ? "var(--ink)" : "var(--rule)"}`,
                  borderRadius: 2,
                }}>
                  {k.name}
                </span>
              );
            })}
          </div>
        </div>

        <div style={{
          padding: "14px 16px", marginTop: 14,
          borderTop: "1px solid var(--rule)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span className="mono" style={{ fontSize: 10, color: "var(--meta)" }}>
            {isOpen ? "TAP TO COLLAPSE" : "TAP FOR BLOCKS"}
          </span>
          <button onClick={(e) => e.stopPropagation()} style={{
            background: "var(--ink)", color: "var(--chalk)",
            border: "none", padding: "9px 18px", borderRadius: 999,
            fontFamily: "Plus Jakarta Sans", fontWeight: 600, fontSize: 13, cursor: "pointer",
          }}>
            {c.action} →
          </button>
        </div>
      </div>

      {isOpen && (
        <div style={{ marginTop: 14, paddingLeft: 12, display: "flex", flexDirection: "column", gap: 10 }}>
          {c.blocks.map((b, bi) => (
            <PaperBlock key={b.id} b={b} index={bi} />
          ))}
        </div>
      )}
    </div>
  );
}

function PaperBlock({ b, index }) {
  const sub = SUBJECT[b.subject];
  return (
    <div style={{
      background: "var(--chalk)",
      border: "1px solid var(--rule)",
      borderLeft: `4px solid ${sub.bright}`,
      borderRadius: 2,
      padding: "12px 14px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div className="mono" style={{ fontSize: 9, color: sub.deep }}>
          {sub.name.toUpperCase()} · 20 MIN · {b.mode.toUpperCase().replace("-", " ")}
        </div>
        <div className="mono" style={{ fontSize: 9, color: "var(--meta)" }}>
          BLOCK {index + 1}
        </div>
      </div>
      <div style={{ fontFamily: "Fraunces", fontWeight: 600, fontSize: 15, color: "var(--ink)", lineHeight: 1.2, marginTop: 4 }}>
        {b.title}
      </div>
      <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
        {b.kids.map(kid => {
          const k = KIDS.find(x => x.id === kid);
          return (
            <span key={kid} style={{
              fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 11,
              color: "var(--ink)",
              padding: "2px 8px",
              background: "var(--paper)",
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

Object.assign(window, { Material });
