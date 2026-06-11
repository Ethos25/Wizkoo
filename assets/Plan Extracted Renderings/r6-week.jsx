/* global React, SUBJECT, WEEK, PlanetariumBandV2 */

// =============================================================
// WEEK VIEW
// Extension of Ledger Quieter to four days of clusters. Compression
// decisions:
//   – Cluster row vertical padding: 22 → 14 (reads at ~60% of Today's
//     density without becoming list-cramped)
//   – Cluster name: 17/500 → 14/500 (one notch down from Today)
//   – Day section header: PJS 18/500 (one notch UP from cluster name,
//     so the day reads as the level above clusters)
//   – Chevron: removed. The whole row is a tap target into Today View.
//   – No "together / parallel / split" — Week View is shape, not mode.
//   – Completion ring sits LEFT of the time. 6px ring, hairline #B7B4A8
//     when incomplete, filled saffron when complete.
//   – Time-in-margin: 10/mono, same as Today
//   – Subject dot: 5px, same color tokens
//   – Position number per day (01..05), faint warm-gray, no chevron
// =============================================================

function WeekView() {
  return (
    <div className="frame" style={{ background: "var(--chalk)", paddingBottom: 110 }}>
      <PlanetariumBandV2
        variant="week"
        kicker="WEEK 16 · TUE TODAY"
        paceText={`${WEEK.pace.hours} / ${WEEK.pace.target} · ON PACE`}
        fraunces={`Bridges and Engineering`}
        subtitle={WEEK.subtitle}
      />

      <div style={{ padding: "26px 22px 0" }}>
        <div className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>
          {WEEK.days.length} DAYS · {totalClusters(WEEK)} CLUSTERS · {totalHours(WEEK).toUpperCase()}
        </div>
      </div>

      <div style={{ padding: "0 22px", marginTop: 14 }}>
        {WEEK.days.map((d, i) => (
          <DaySection key={d.id} day={d} isLast={i === WEEK.days.length - 1} />
        ))}
      </div>

      <div style={{ marginTop: 28, padding: "0 22px" }}>
        <PrimaryCTA label="Continue Tuesday" />
      </div>
    </div>
  );
}

function DaySection({ day, isLast }) {
  return (
    <div style={{
      paddingTop: 24, paddingBottom: 18,
      borderTop: "1px solid #ECE7DA",
    }}>
      {/* Day header */}
      <div style={{
        display: "flex", alignItems: "baseline", justifyContent: "space-between",
        marginBottom: 4,
      }}>
        <span style={{
          fontFamily: "Plus Jakarta Sans", fontWeight: 500, fontSize: 18,
          color: "var(--ink)", letterSpacing: "-0.008em",
        }}>
          {day.label}
          {day.clusters[0]?.today && (
            <span className="mono" style={{
              marginLeft: 10, fontSize: 9, color: "var(--saffron)", letterSpacing: "0.20em",
            }}>
              TODAY
            </span>
          )}
        </span>
        <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>
          {day.summary.toUpperCase()}
        </span>
      </div>

      {/* Cluster rows */}
      <div style={{ marginTop: 8 }}>
        {day.clusters.map((c, i) => (
          <ClusterRow key={c.id} c={c} index={i} />
        ))}
      </div>
    </div>
  );
}

function ClusterRow({ c, index }) {
  const sub = SUBJECT[c.subject];
  return (
    <button style={{
      background: "transparent", border: "none", padding: "14px 0", textAlign: "left",
      width: "100%", cursor: "pointer", display: "block",
    }}>
      <div style={{
        display: "grid", gridTemplateColumns: "16px 36px 1fr auto", gap: 12,
        alignItems: "baseline",
      }}>
        {/* completion ring */}
        <span style={{ alignSelf: "center", justifySelf: "start" }}>
          <CompletionRing complete={c.complete} />
        </span>

        {/* time */}
        <span className="mono" style={{ fontSize: 10, color: "var(--ink)", letterSpacing: "0.18em", alignSelf: "center" }}>
          {c.time}M
        </span>

        {/* name + subject line */}
        <div>
          <div style={{
            fontFamily: "Plus Jakarta Sans", fontWeight: 500, fontSize: 14,
            color: c.complete ? "var(--mid)" : "var(--ink)",
            letterSpacing: "-0.005em", lineHeight: 1.25,
          }}>
            {c.name}
          </div>
          <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 9 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 5, height: 5, borderRadius: 5, background: sub.bright, display: "inline-block" }} />
              <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>
                {sub.abbr}{c.secondarySubject ? ` · ${SUBJECT[c.secondarySubject].abbr}` : ""}
              </span>
            </span>
            <span style={{ width: 1, height: 8, background: "#DCD6C5" }} />
            <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>
              {c.count} × 20-MIN
            </span>
          </div>
        </div>

        {/* index */}
        <span className="mono" style={{
          fontSize: 9, color: "#B7B4A8", letterSpacing: "0.18em", alignSelf: "center",
        }}>
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
    </button>
  );
}

function CompletionRing({ complete }) {
  if (complete) {
    return (
      <span style={{
        width: 8, height: 8, borderRadius: 8,
        background: "var(--saffron)", display: "inline-block",
      }} />
    );
  }
  return (
    <span style={{
      width: 8, height: 8, borderRadius: 8,
      border: "1px solid #B7B4A8", display: "inline-block", boxSizing: "border-box",
    }} />
  );
}

function PrimaryCTA({ label }) {
  return (
    <button style={{
      background: "transparent", border: "none", cursor: "pointer",
      fontFamily: "Plus Jakarta Sans", fontWeight: 500, fontSize: 16,
      color: "var(--ink)", letterSpacing: "-0.008em",
      padding: "8px 0", borderBottom: "2px solid var(--saffron)",
    }}>
      {label} →
    </button>
  );
}

function totalClusters(week) {
  return week.days.reduce((n, d) => n + d.clusters.length, 0);
}

function totalHours(week) {
  const minutes = week.days.reduce(
    (n, d) => n + d.clusters.reduce((m, c) => m + c.time, 0), 0
  );
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}` : `${h}h ${m}m`;
}

Object.assign(window, { WeekView });
