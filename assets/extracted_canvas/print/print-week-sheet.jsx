/* global React, PRINT, Masthead, Footer, TrimCorners */

// =============================================================
// THE WEEK SHEET — landscape US Letter
// Five columns, one per day. Compressed Ledger Quieter cluster
// rows inside each column. Per-block checkboxes (one box per
// 20-min block — "2 × 20-MIN" gives two boxes; "3 × 20-MIN"
// gives three). The footer carries the pace line.
//
// Density math: live area is 960 × 720 (1056×816 minus 48px
// margins). Five columns means each column is ~187 wide. The
// header eats ~96px, the footer ~36px; that leaves ~588px for
// the column body. With ~16px per cluster row (time/name/labels/
// boxes vertical group), each column comfortably fits 3-5
// clusters. Tuesday's five rows are the worst case.
// =============================================================

function WeekSheet() {
  const w = PRINT.week;
  return (
    <div className="sheet landscape">
      <TrimCorners />
      <div className="live">
        <Masthead
          artifactLabel="THE WEEK SHEET"
          fraunces={`Bridges and Engineering · Week ${w.number}`}
          below={
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              gap: 24,
            }}>
              <span style={{
                fontFamily: "var(--pjs)",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: 13,
                color: "var(--mid)",
                letterSpacing: "-0.005em",
              }}>
                {w.subtitle}
              </span>
              <span className="mono-print">
                {w.days.length} DAYS · {totalClustersPrint(w)} CLUSTERS · {totalHoursPrint(w)}
              </span>
            </div>
          }
          family={PRINT.family}
          generated={PRINT.generated}
          marker="THE PLAN · TAPE TO FRIDGE"
        />

        {/* Column grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          columnGap: 18,
          marginTop: 22,
          flexGrow: 1,
        }}>
          {w.days.map((d, i) => (
            <DayColumn key={i} day={d} isLast={i === w.days.length - 1} />
          ))}
        </div>

        <Footer pace={w.pace} />
      </div>
    </div>
  );
}

function DayColumn({ day, isLast }) {
  return (
    <div style={{
      borderRight: isLast ? "none" : "1px solid var(--rule-faint)",
      paddingRight: isLast ? 0 : 14,
    }}>
      {/* day header */}
      <div style={{ marginBottom: 4 }}>
        <span style={{
          fontFamily: "var(--pjs)",
          fontWeight: 500,
          fontSize: 16,
          color: "var(--ink)",
          letterSpacing: "-0.008em",
        }}>
          {day.label}
        </span>
      </div>
      <div className="mono-print" style={{ marginBottom: 14 }}>
        {day.summary.toUpperCase()}
      </div>

      <hr className="rule" />

      {/* clusters */}
      <div>
        {day.clusters.map((c, i) => (
          <ClusterPrintRow key={i} c={c} index={i} isLast={i === day.clusters.length - 1} />
        ))}
      </div>
    </div>
  );
}

function ClusterPrintRow({ c, index, isLast }) {
  return (
    <div style={{
      padding: "11px 0",
      borderBottom: isLast ? "none" : "1px solid var(--rule-faint)",
    }}>
      {/* time-in-margin row + name */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "30px 1fr",
        columnGap: 8,
        alignItems: "baseline",
      }}>
        <span style={{
          fontFamily: "var(--mono)",
          fontSize: 9,
          color: "var(--ink)",
          letterSpacing: "0.18em",
        }}>
          {c.time}M
        </span>
        <div style={{
          fontFamily: "var(--pjs)",
          fontWeight: 500,
          fontSize: 11.5,
          color: "var(--ink)",
          letterSpacing: "-0.005em",
          lineHeight: 1.3,
          textWrap: "pretty",
        }}>
          {c.name}
        </div>
      </div>

      {/* subject + count + boxes */}
      <div style={{
        marginTop: 6,
        display: "grid",
        gridTemplateColumns: "30px 1fr auto",
        columnGap: 8,
        alignItems: "center",
      }}>
        <span /> {/* spacer to align under the name column */}
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span className={`dot dot-${c.subject}`} />
          <span className="mono-print" style={{ fontSize: 8.5 }}>
            {labelFor(c.subject)} · {c.count}×20
          </span>
        </span>
        <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
          {Array.from({ length: c.count }).map((_, bi) => (
            <span key={bi} className="box" />
          ))}
        </span>
      </div>
    </div>
  );
}

function labelFor(s) {
  return ({ la: "LANG", math: "MATH", sci: "SCI", gh: "GEO", ca: "ARTS" })[s] || s;
}

function totalClustersPrint(w) {
  return w.days.reduce((n, d) => n + d.clusters.length, 0);
}

function totalHoursPrint(w) {
  const minutes = w.days.reduce(
    (n, d) => n + d.clusters.reduce((m, c) => m + c.time, 0), 0
  );
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} HRS` : `${h}H ${m}M`;
}

Object.assign(window, { WeekSheet });
