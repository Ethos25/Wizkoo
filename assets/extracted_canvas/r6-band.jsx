/* global React, DAYS, TODAY_DAY_ID */

// =============================================================
// PlanetariumBandV2 — same locked vocabulary as the Today View
// band, but parameterized so Week and Cluster can use it.
//
// Slots:
//   kicker      — small mono in top-left (e.g. "WEEK 16 · BRIDGES & ENGINEERING")
//   pace        — small mono in top-right ("847 / 900 · ON PACE"), saffron
//   fraunces    — the brand-voice line (Fraunces italic). REQUIRED — every
//                 surface gets exactly one of these.
//   subtitle    — optional line below the Fraunces moment, PJS regular,
//                 chalk @ 0.7. Used by Week to name the theme; used by
//                 Cluster for the "MATH · TOGETHER · ALL FOUR" trio.
//   variant     — "today" renders the day strip at the bottom; "week" shows
//                 it with Tuesday underlined; "cluster" omits the day strip
//                 entirely (depth changes; we are inside a single moment).
// =============================================================

function StarField() {
  return (
    <>
      {[
        [40, 8, 1.5, 0.55], [88, 22, 2, 0.7], [160, 12, 1, 0.5],
        [220, 30, 1.5, 0.6], [280, 14, 2, 0.65], [320, 36, 1, 0.45],
        [60, 44, 1, 0.4], [200, 56, 1.5, 0.55], [120, 64, 1, 0.4],
        [340, 60, 1.5, 0.55],
      ].map(([x, y, r, a], i) => (
        <span key={i} style={{
          position: "absolute", left: x, top: y, width: r * 2, height: r * 2,
          background: `rgba(248,244,233,${a})`, borderRadius: 999,
        }} />
      ))}
    </>
  );
}

function PhoneStatusChalk() {
  const c = "rgba(248,244,233,0.9)";
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      fontFamily: "Plus Jakarta Sans", fontWeight: 600, fontSize: 13, color: c,
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

// Day strip variant for Week View: each cell is a section anchor and
// today is underlined in saffron, exactly like the Today View.
function WeekDayStrip() {
  // 5-col grid, identical to Today View's rhythm.
  return (
    <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(5,1fr)", position: "relative" }}>
      {DAYS.map((d, i) => {
        const isToday = d.state === "today";
        const isDone = d.state === "done";
        return (
          <div key={i} className="mono" style={{
            fontSize: 11, padding: "6px 0", textAlign: "center",
            fontWeight: isToday ? 700 : 400,
            color: isToday ? "var(--saffron)" : isDone ? "rgba(248,244,233,0.85)" : "rgba(248,244,233,0.55)",
            position: "relative",
            letterSpacing: "0.18em",
          }}>
            {d.short}
            {isToday && <span style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", bottom: -2, width: 14, height: 2, background: "var(--saffron)" }} />}
            {isDone && <span style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", bottom: 0, width: 3, height: 3, background: "rgba(248,244,233,0.85)", borderRadius: 3 }} />}
          </div>
        );
      })}
    </div>
  );
}

function PlanetariumBandV2({ kicker, paceText = "847 / 900 · ON PACE", fraunces, subtitle, variant = "today" }) {
  return (
    <div style={{
      background: "radial-gradient(ellipse at 75% 30%, #1a2257 0%, #0C1020 65%)",
      color: "#F8F4E9", padding: "12px 22px 18px",
      position: "relative", overflow: "hidden",
    }}>
      <StarField />

      <PhoneStatusChalk />

      <div style={{ marginTop: 18, display: "flex", justifyContent: "space-between", alignItems: "baseline", position: "relative" }}>
        <span className="mono" style={{ fontSize: 10, color: "rgba(248,244,233,0.6)", letterSpacing: "0.18em" }}>{kicker}</span>
        <span className="mono" style={{ fontSize: 10, color: "var(--saffron)", letterSpacing: "0.18em" }}>{paceText}</span>
      </div>

      <div style={{ marginTop: 10, position: "relative" }}>
        <span style={{
          fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 400, fontSize: 18,
          color: "rgba(248,244,233,0.92)", letterSpacing: "-0.01em",
        }}>
          {fraunces}
        </span>
      </div>

      {subtitle && (
        <div style={{ marginTop: 6, position: "relative" }}>
          <span style={{
            fontFamily: "Plus Jakarta Sans", fontWeight: 400, fontSize: 12,
            color: "rgba(248,244,233,0.62)", lineHeight: 1.5, letterSpacing: 0,
            display: "block", maxWidth: 320,
          }}>
            {subtitle}
          </span>
        </div>
      )}

      {variant === "week" && <WeekDayStrip />}
    </div>
  );
}

Object.assign(window, { PlanetariumBandV2 });
