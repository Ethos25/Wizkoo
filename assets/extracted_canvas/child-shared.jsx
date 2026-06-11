/* global React, FAMILY, CLUSTER_DEMO */

// =============================================================
// Shared building blocks for the four direction mockups.
// Every direction renders into <ClusterMock /> at phone scale (390 wide).
// What the directions vary is purely the per-child treatment.
// =============================================================

// ---------- Phone band ----------
function PhoneBand() {
  return (
    <div style={{
      background: "#0C1020",
      color: "#F8F4E9",
      padding: "14px 22px 16px",
      fontFamily: "Plus Jakarta Sans",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Space Mono", fontSize: 11, fontWeight: 700, letterSpacing: "0" }}>
        <span>9:41</span>
        <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
          <svg width="16" height="10" viewBox="0 0 16 10"><rect x="0.5" y="0.5" width="13" height="9" rx="1.5" fill="none" stroke="#F8F4E9" strokeOpacity="0.6"/><rect x="2" y="2" width="9" height="6" fill="#F8F4E9"/><rect x="14" y="3" width="1.5" height="4" fill="#F8F4E9" fillOpacity="0.6"/></svg>
        </span>
      </div>
      <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "baseline", fontFamily: "Space Mono", fontSize: 9, letterSpacing: "0.20em", color: "rgba(248,244,233,0.62)" }}>
        <span>TUESDAY · WEEK 16</span>
        <span style={{ display: "inline-flex", gap: 6, alignItems: "center", color: "rgba(248,244,233,0.85)" }}>
          847 / 900 · ON&nbsp;PACE
        </span>
      </div>
      <div style={{
        marginTop: 14,
        fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 400, fontSize: 17,
        color: "rgba(248,244,233,0.78)",
        letterSpacing: "-0.01em",
      }}>
        the day is made
      </div>
    </div>
  );
}

// ---------- Theme header ----------
function ThemeHeader() {
  return (
    <div style={{ padding: "20px 22px 0" }}>
      <div className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>
        THEME
      </div>
      <div className="serif" style={{
        marginTop: 6,
        fontFamily: "Fraunces",
        fontWeight: 600,
        fontSize: 28,
        lineHeight: 1.05,
        letterSpacing: "-0.018em",
        color: "var(--ink)",
      }}>
        Bridges <em style={{ fontWeight: 500 }}>and</em> Engineering
      </div>
      <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10 }}>
        <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>9 BLOCKS</span>
        <Sep/>
        <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>3 HRS</span>
        <Sep/>
        <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>5 SUBJECTS</span>
        <span style={{ flex: 1 }} />
        <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>5 CLUSTERS</span>
      </div>
    </div>
  );
}

function Sep() {
  return <span style={{ width: 1, height: 9, background: "#DCD6C5" }} />;
}

// ---------- Subject dot ----------
const SUBJ_COLORS = {
  math: { deep: "#9A8600", bright: "#E8D800" },
  la:   { deep: "#2030A0", bright: "#3848D0" },
  sci:  { deep: "#247840", bright: "#38B060" },
  gh:   { deep: "#CC6000", bright: "#F08A20" },
  ca:   { deep: "#6030B0", bright: "#8848E0" },
};
const SUBJ_ABBR = { math: "MATH", la: "LANG", sci: "SCI", gh: "GEO", ca: "ARTS" };

// ---------- Sibling cluster rows (collapsed) ----------
function SiblingRows() {
  const rows = [
    { time: 40, name: "Bridge Architecture Lab", subject: "math", modifier: "2 × 20-min · together", pos: "01" },
    { time: 20, name: "Reading the Builders",     subject: "la",  modifier: "1 × 20-min · together", pos: "02" },
  ];
  return (
    <div style={{ marginTop: 18, padding: "0 22px" }}>
      <div style={{ borderTop: "1px solid #ECE7DA" }} />
      {rows.map((r, i) => (
        <CollapsedRow key={i} {...r} />
      ))}
    </div>
  );
}

function CollapsedRow({ time, name, subject, modifier, pos }) {
  const sub = SUBJ_COLORS[subject];
  return (
    <div style={{
      padding: "20px 0",
      borderBottom: "1px solid #ECE7DA",
      display: "grid",
      gridTemplateColumns: "36px 1fr auto",
      gap: 12, alignItems: "baseline",
    }}>
      <span className="mono" style={{ fontSize: 10, color: "var(--ink)", letterSpacing: "0.18em", alignSelf: "center" }}>
        {time}M
      </span>
      <div>
        <div style={{
          fontFamily: "Plus Jakarta Sans", fontWeight: 500, fontSize: 16,
          color: "var(--ink)", letterSpacing: "-0.008em", lineHeight: 1.25,
        }}>
          {name}
        </div>
        <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 9 }}>
          <span style={{ width: 5, height: 5, borderRadius: 5, background: sub.bright }} />
          <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>
            {SUBJ_ABBR[subject]}
          </span>
          <Sep/>
          <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>
            {modifier}
          </span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, alignItems: "center", alignSelf: "center" }}>
        <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>{pos}</span>
        <Caret/>
      </div>
    </div>
  );
}

function Caret({ open=false }) {
  return (
    <svg width="9" height="9" viewBox="0 0 9 9" style={{ display: "block" }}>
      {open
        ? <path d="M1 3 L4.5 6.5 L8 3" fill="none" stroke="#B7B4A8" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        : <path d="M3 1 L6.5 4.5 L3 8"  fill="none" stroke="#B7B4A8" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  );
}

function CaretOpen() { return <Caret open={true} />; }

// ---------- The expanded cluster (cluster 03 — split groups) ----------
// `renderChild(kid)` is the per-direction hook.
function ExpandedClusterRow({ renderChild, blockNameOverride, extraBlockTreatment }) {
  const sub = SUBJ_COLORS[CLUSTER_DEMO.subject];
  return (
    <div style={{
      padding: "20px 0 22px",
      borderBottom: "1px solid #ECE7DA",
    }}>
      {/* Header — same as collapsed but caret-open */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "36px 1fr auto",
        gap: 12, alignItems: "baseline",
        padding: "0 22px",
      }}>
        <span className="mono" style={{ fontSize: 10, color: "var(--ink)", letterSpacing: "0.18em", alignSelf: "center" }}>
          {CLUSTER_DEMO.duration}M
        </span>
        <div>
          <div style={{
            fontFamily: "Plus Jakarta Sans", fontWeight: 500, fontSize: 16,
            color: "var(--ink)", letterSpacing: "-0.008em", lineHeight: 1.25,
          }}>
            {CLUSTER_DEMO.name}
          </div>
          <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 9 }}>
            <span style={{ width: 5, height: 5, borderRadius: 5, background: sub.bright }} />
            <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>SCI</span>
            <Sep/>
            <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>
              3 × 20-min · split
            </span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center", alignSelf: "center" }}>
          <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>{CLUSTER_DEMO.position}</span>
          <CaretOpen/>
        </div>
      </div>

      {/* Groups */}
      {CLUSTER_DEMO.groups.map((g, gi) => (
        <Group key={gi} group={g} renderChild={renderChild} extraBlockTreatment={extraBlockTreatment} />
      ))}
    </div>
  );
}

function Group({ group, renderChild, extraBlockTreatment }) {
  return (
    <div style={{ marginTop: 22, padding: "0 22px 0 58px" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        alignItems: "center",
        gap: 12,
        marginBottom: 10,
      }}>
        <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.22em" }}>
          {group.label}
        </span>
        <div style={{ display: "flex", gap: 6 }}>
          {group.kids.map(kid => {
            const k = FAMILY.find(f => f.id === kid);
            return <React.Fragment key={kid}>{renderChild(k)}</React.Fragment>;
          })}
        </div>
      </div>

      {group.blocks.map((b, bi) => (
        <div key={b.id} style={{
          display: "grid",
          gridTemplateColumns: "36px 1fr",
          gap: 12, alignItems: "baseline",
          padding: "8px 0",
        }}>
          <span className="mono" style={{ fontSize: 10, color: "var(--ink)", letterSpacing: "0.18em", alignSelf: "center" }}>
            {b.time}M
          </span>
          <div>
            <div style={{
              fontFamily: "Plus Jakarta Sans", fontWeight: 500, fontSize: 14,
              color: "var(--ink)", letterSpacing: "-0.005em", lineHeight: 1.3,
              textWrap: "balance",
            }}>
              {b.name}
            </div>
            {extraBlockTreatment && extraBlockTreatment(group)}
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------- Direction frame wrapper ----------
function DirectionFrame({ children }) {
  return (
    <div style={{
      width: 390,
      background: "var(--chalk)",
      borderRadius: 28,
      overflow: "hidden",
      boxShadow: "0 1px 0 rgba(0,0,0,0.06), 0 18px 40px -20px rgba(0,0,0,0.45)",
      fontFamily: "Plus Jakarta Sans",
    }}>
      <PhoneBand/>
      <ThemeHeader/>
      <SiblingRows/>
      {children}
    </div>
  );
}

Object.assign(window, {
  PhoneBand, ThemeHeader, SiblingRows, ExpandedClusterRow,
  DirectionFrame, SUBJ_COLORS, SUBJ_ABBR, Sep, Caret,
});
