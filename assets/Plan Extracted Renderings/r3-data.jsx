/* global React */
const { useState } = React;

const KIDS = [
  { id: "jack", name: "Jack", short: "Jk", age: 4,  stage: "Wonderer"   },
  { id: "jane", name: "Jane", short: "Jn", age: 6,  stage: "Apprentice" },
  { id: "leo",  name: "Leo",  short: "Le", age: 8,  stage: "Artisan"    },
  { id: "max",  name: "Max",  short: "Mx", age: 11, stage: "Scholar"    },
];
const ALL = ["jack","jane","leo","max"];

const SUBJECT = {
  la:   { key: "la",   name: "Language Arts",       short: "LA",   deep: "var(--la-deep)",   bright: "var(--la-bright)" },
  math: { key: "math", name: "Math",                short: "Math", deep: "var(--math-deep)", bright: "var(--math-bright)" },
  sci:  { key: "sci",  name: "Science",             short: "Sci",  deep: "var(--sci-deep)",  bright: "var(--sci-bright)" },
  gh:   { key: "gh",   name: "Geography & History", short: "G&H",  deep: "var(--gh-deep)",   bright: "var(--gh-bright)" },
  ca:   { key: "ca",   name: "Creative Arts",       short: "Arts", deep: "var(--ca-deep)",   bright: "var(--ca-bright)" },
};

// Subject pictograms — simple, geometric, road-sign clarity. Each ~18x18.
function SubjectGlyph({ subject, size = 18, color = "currentColor" }) {
  const s = size;
  const c = color;
  switch (subject) {
    case "math":
      // plus sign
      return (
        <svg width={s} height={s} viewBox="0 0 18 18">
          <rect x="2" y="8" width="14" height="2" fill={c} />
          <rect x="8" y="2" width="2" height="14" fill={c} />
        </svg>
      );
    case "la":
      // open book — two leaves
      return (
        <svg width={s} height={s} viewBox="0 0 18 18">
          <path d="M2 4 L9 5 L9 15 L2 14 Z" fill={c} />
          <path d="M16 4 L9 5 L9 15 L16 14 Z" fill={c} opacity="0.55" />
        </svg>
      );
    case "sci":
      // flask
      return (
        <svg width={s} height={s} viewBox="0 0 18 18">
          <path d="M7 2 H11 V7 L15 14 Q15.5 16 13.5 16 H4.5 Q2.5 16 3 14 L7 7 Z" fill={c} />
        </svg>
      );
    case "gh":
      // globe — circle with meridian
      return (
        <svg width={s} height={s} viewBox="0 0 18 18">
          <circle cx="9" cy="9" r="7" fill={c} />
          <ellipse cx="9" cy="9" rx="3" ry="7" fill="var(--chalk)" opacity="0.35" />
          <line x1="2" y1="9" x2="16" y2="9" stroke="var(--chalk)" strokeWidth="0.8" opacity="0.8" />
        </svg>
      );
    case "ca":
      // palette — triangle
      return (
        <svg width={s} height={s} viewBox="0 0 18 18">
          <polygon points="9,2 16,15 2,15" fill={c} />
        </svg>
      );
    default:
      return null;
  }
}

const DAY = {
  date: "Tuesday", dateShort: "Tue",
  theme: "Bridges and Engineering", week: 16,
  pace: { hoursDone: 847, hoursTotal: 900, weeksLeft: 28, status: "on pace" },
};

const DAYS = [
  { letter: "M",  short: "M",  full: "Mon", state: "done" },
  { letter: "T",  short: "T",  full: "Tue", state: "today" },
  { letter: "W",  short: "W",  full: "Wed", state: "ahead" },
  { letter: "Th", short: "Th", full: "Thu", state: "ahead" },
  { letter: "F",  short: "F",  full: "Fri", state: "ahead" },
];

const CLUSTERS = [
  { id: "lab",   name: "Bridge Architecture Lab", subject: "math", minutes: 40, action: "Start",
    blocks: [
      { id: "b1", title: "Bridge Shape Engineering Station", subject: "math", minutes: 20, kids: ALL, mode: "same-room" },
      { id: "b2", title: "Bridge Span Rice Measurement",     subject: "math", minutes: 20, kids: ALL, mode: "same-room" },
    ], summary: { kids: ALL, mode: "same-room" },
  },
  { id: "read",  name: "Reading the Builders", subject: "la", minutes: 20, action: "Start",
    blocks: [
      { id: "b3", title: "Read-Aloud · The Bridge Engineers", subject: "la", minutes: 20, kids: ALL, mode: "same-room" },
    ], summary: { kids: ALL, mode: "same-room" },
  },
  { id: "eps",   name: "Engineering Problem Solving", subject: "sci", minutes: 60, action: "Start",
    blocks: [
      { id: "b4", title: "Bridge Load Testing Documentation Lab",      subject: "sci", minutes: 20, kids: ["leo","max"],  mode: "same-room" },
      { id: "b5", title: "Bridge Construction Supply Problems",        subject: "sci", minutes: 20, kids: ["leo","max"],  mode: "same-room" },
      { id: "b6", title: "Pressure-Resistant Habitat Design Challenge", subject: "sci", minutes: 20, kids: ["jack","jane"], mode: "same-room" },
    ], summary: { kids: ALL, mode: "split" },
  },
  { id: "world", name: "Bridges Around the World", subject: "gh", minutes: 20, action: "Start",
    blocks: [
      { id: "b7", title: "Famous Bridges · Atlas Walk", subject: "gh", minutes: 20, kids: ALL, mode: "same-room" },
    ], summary: { kids: ALL, mode: "same-room" },
  },
  { id: "build", name: "Build Your Bridge", subject: "ca", minutes: 40, action: "Start",
    blocks: [
      { id: "b8", title: "Studio · Sketch the Span", subject: "ca", minutes: 20, kids: ALL, mode: "parallel" },
      { id: "b9", title: "Studio · Build the Model", subject: "ca", minutes: 20, kids: ALL, mode: "parallel" },
    ], summary: { kids: ALL, mode: "parallel" },
  },
];

function useExpand(initial = null) {
  const [open, setOpen] = useState(initial);
  return [open, (id) => setOpen(prev => prev === id ? null : id)];
}

// Brand-band header — used by all four directions. Thin planetarium register
// at top, then cream working surface below. The band carries date + week +
// pace; the surface carries the day.
function BrandBand({ children }) {
  return (
    <div style={{
      background: "linear-gradient(180deg, #0C1020 0%, #141a3c 100%)",
      color: "#F8F4E9", padding: "12px 22px 14px",
      position: "relative", overflow: "hidden",
    }}>
      {/* a few subtle stars */}
      <span style={{ position: "absolute", top: 8, left: 60, width: 2, height: 2, background: "rgba(248,244,233,0.6)", borderRadius: 4 }} />
      <span style={{ position: "absolute", top: 28, left: 220, width: 2, height: 2, background: "rgba(248,244,233,0.5)", borderRadius: 4 }} />
      <span style={{ position: "absolute", top: 14, right: 50, width: 1.5, height: 1.5, background: "rgba(248,244,233,0.5)", borderRadius: 4 }} />
      <span style={{ position: "absolute", top: 40, right: 110, width: 2, height: 2, background: "rgba(248,244,233,0.55)", borderRadius: 4 }} />
      {children}
    </div>
  );
}

function PhoneStatus({ tone = "ink" }) {
  const c = tone === "chalk" ? "rgba(248,244,233,0.85)" : "var(--ink)";
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "12px 22px 0", fontFamily: "Plus Jakarta Sans", fontWeight: 600, fontSize: 13,
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

// Day strip — horizontal letters, the lesson from rounds 1+2: don't abstract.
function DayStrip({ tone = "ink" }) {
  const fg = tone === "chalk" ? "#F8F4E9" : "var(--ink)";
  const fade = tone === "chalk" ? "rgba(248,244,233,0.4)" : "var(--faint)";
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 0, marginTop: 10 }}>
      {DAYS.map((d, i) => {
        const isToday = d.state === "today";
        const isDone = d.state === "done";
        return (
          <button key={i} className="mono" style={{
            background: "transparent", border: "none", cursor: "pointer", padding: "6px 0",
            fontSize: 12, fontWeight: isToday ? 700 : 400,
            color: isToday ? "var(--saffron)" : isDone ? fg : fade,
            position: "relative",
            letterSpacing: "0.16em",
          }}>
            {d.short}
            {isToday && <span style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", bottom: 0, width: 14, height: 2, background: "var(--saffron)" }} />}
            {isDone && <span style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", bottom: 2, width: 3, height: 3, background: fg, borderRadius: 3 }} />}
          </button>
        );
      })}
    </div>
  );
}

Object.assign(window, {
  KIDS, ALL, SUBJECT, DAY, DAYS, CLUSTERS, useExpand,
  SubjectGlyph, BrandBand, PhoneStatus, DayStrip,
});
