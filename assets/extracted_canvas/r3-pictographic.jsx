/* global React, KIDS, ALL, SUBJECT, DAY, DAYS, CLUSTERS, SubjectGlyph, BrandBand, PhoneStatus, DayStrip */

// =============================================================
// Direction 1 — PICTOGRAPHIC
// Anchored on: signage. Each subject is a glyph (plus, book, flask,
// globe, palette). Each child is a NAME, written out — abandoning
// initials makes Jack/Jane unambiguous by construction. The day reads
// as a sequence of stamped subject signs with names underneath. The
// parent recognizes subjects the way she recognizes road signs.
// Three-second test: every glyph is a recognizable real-world object,
// every child is spelled out, every cluster says its minutes in words.
// =============================================================

function Pictographic({ openId, setOpen }) {
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

      {/* Day header */}
      <div style={{ padding: "22px 22px 0" }}>
        <div className="mono" style={{ fontSize: 10, color: "var(--meta)" }}>TUESDAY · 5 SUBJECTS · 9 BLOCKS · 3 HRS</div>
        <h1 className="serif" style={{ margin: "6px 0 0", fontSize: 30, lineHeight: 1.05, fontWeight: 600, letterSpacing: "-0.02em" }}>
          Bridges <span style={{ fontStyle: "italic", fontWeight: 500 }}>and</span> Engineering
        </h1>
      </div>

      {/* Family legend */}
      <FamilyLegend />

      {/* Cluster signs */}
      <div style={{ padding: "8px 22px 0", display: "flex", flexDirection: "column", gap: 12 }}>
        {CLUSTERS.map((c, ci) => (
          <PicCluster key={c.id} c={c} index={ci}
            isOpen={openId === c.id}
            onToggle={() => setOpen(c.id)} />
        ))}
      </div>
    </div>
  );
}

function FamilyLegend() {
  return (
    <div style={{ padding: "16px 22px 14px", display: "flex", gap: 16, alignItems: "center" }}>
      <span className="mono" style={{ fontSize: 9, color: "var(--meta)" }}>FAMILY</span>
      <div style={{ display: "flex", gap: 14 }}>
        {KIDS.map(k => (
          <span key={k.id} style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 13, color: "var(--ink)" }}>{k.name}</span>
            <span className="mono" style={{ fontSize: 9, color: "var(--meta)" }}>{k.age}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function PicCluster({ c, index, isOpen, onToggle }) {
  const sub = SUBJECT[c.subject];
  return (
    <div style={{
      background: "var(--paper)",
      border: "1.5px solid var(--ink)",
      borderRadius: 6,
    }}>
      <button onClick={onToggle} style={{
        background: "transparent", border: "none", padding: "14px 14px 12px", cursor: "pointer", textAlign: "left",
        width: "100%", display: "block",
      }}>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          {/* Subject sign — large pictogram in subject color */}
          <div style={{
            width: 52, height: 52, borderRadius: 4, flexShrink: 0,
            background: sub.bright,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <SubjectGlyph subject={c.subject} size={30} color="rgba(0,0,0,0.85)" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="mono" style={{ fontSize: 9, color: sub.deep }}>{sub.name.toUpperCase()}</div>
            <div style={{ fontFamily: "Fraunces", fontWeight: 600, fontSize: 18, color: "var(--ink)", lineHeight: 1.15, letterSpacing: "-0.01em", marginTop: 2 }}>
              {c.name}
            </div>
            <div className="mono" style={{ fontSize: 9, color: "var(--meta)", marginTop: 6 }}>
              {c.minutes} MIN · {c.blocks.length} × 20M
            </div>
          </div>
          <span className="mono" style={{
            fontSize: 11, color: "var(--ink)",
            borderBottom: "1.5px solid var(--saffron)", paddingBottom: 1,
            alignSelf: "flex-start", marginTop: 4,
          }}>
            {c.action}
          </span>
        </div>

        {/* Family row — names with included/excluded state */}
        <FamilyRow kidsIn={c.summary.kids} mode={c.summary.mode} />
      </button>

      {isOpen && (
        <div style={{ padding: "0 14px 14px", borderTop: "1px dashed var(--rule)" }}>
          {c.blocks.map((b, bi) => (
            <PicBlockRow key={b.id} b={b} index={bi} last={bi === c.blocks.length - 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function FamilyRow({ kidsIn, mode }) {
  return (
    <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
      <span className="mono" style={{ fontSize: 9, color: "var(--meta)" }}>
        {mode === "same-room" ? "TOGETHER" : mode === "parallel" ? "PARALLEL" : "SPLIT"}
      </span>
      <div style={{ flex: 1, display: "flex", gap: 6 }}>
        {KIDS.map(k => {
          const inn = kidsIn.includes(k.id);
          return (
            <span key={k.id} style={{
              flex: 1,
              padding: "4px 0",
              textAlign: "center",
              fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 11,
              color: inn ? "var(--ink)" : "var(--faint)",
              borderTop: `1.5px solid ${inn ? "var(--ink)" : "var(--rule)"}`,
              opacity: inn ? 1 : 0.45,
            }}>
              {k.name}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function PicBlockRow({ b, index, last }) {
  const sub = SUBJECT[b.subject];
  return (
    <div style={{ paddingTop: 12, paddingBottom: last ? 0 : 12, borderBottom: last ? "none" : "1px dotted var(--rule)" }}>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div style={{
          width: 28, height: 28, borderRadius: 3, flexShrink: 0,
          background: sub.bright, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <SubjectGlyph subject={b.subject} size={16} color="rgba(0,0,0,0.85)" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="mono" style={{ fontSize: 9, color: sub.deep }}>
            BLOCK {index + 1} · 20 MIN · {b.mode.toUpperCase().replace("-", " ")}
          </div>
          <div style={{ fontFamily: "Fraunces", fontWeight: 600, fontSize: 14, color: "var(--ink)", lineHeight: 1.2, marginTop: 2 }}>
            {b.title}
          </div>
          <div style={{ marginTop: 6, display: "flex", gap: 6 }}>
            {KIDS.map(k => {
              const inn = b.kids.includes(k.id);
              if (!inn) return null;
              return (
                <span key={k.id} style={{
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
      </div>
    </div>
  );
}

Object.assign(window, { Pictographic });
