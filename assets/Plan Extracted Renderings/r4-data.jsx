/* global React */
const { useState } = React;

const KIDS = [
  { id: "jack", name: "Jack", age: 4 },
  { id: "jane", name: "Jane", age: 6 },
  { id: "leo",  name: "Leo",  age: 8 },
  { id: "max",  name: "Max",  age: 11 },
];
const ALL = ["jack","jane","leo","max"];

const SUBJECT = {
  la:   { key: "la",   name: "Language Arts",       short: "LA",   abbr: "LANG",   deep: "var(--la-deep)",   bright: "var(--la-bright)" },
  math: { key: "math", name: "Math",                short: "Math", abbr: "MATH",   deep: "var(--math-deep)", bright: "var(--math-bright)" },
  sci:  { key: "sci",  name: "Science",             short: "Sci",  abbr: "SCI",    deep: "var(--sci-deep)",  bright: "var(--sci-bright)" },
  gh:   { key: "gh",   name: "Geography & History", short: "G&H",  abbr: "GEO",    deep: "var(--gh-deep)",   bright: "var(--gh-bright)" },
  ca:   { key: "ca",   name: "Creative Arts",       short: "Arts", abbr: "ARTS",   deep: "var(--ca-deep)",   bright: "var(--ca-bright)" },
};

const CLUSTERS = [
  { id: "lab",   name: "Bridge Architecture Lab",   subject: "math", minutes: 40, action: "Start", mode: "together",
    blocks: [
      { id: "b1", title: "Bridge Shape Engineering Station", subject: "math", minutes: 20, kids: ALL, mode: "same-room" },
      { id: "b2", title: "Bridge Span Rice Measurement",     subject: "math", minutes: 20, kids: ALL, mode: "same-room" },
    ] },
  { id: "read",  name: "Reading the Builders",      subject: "la",   minutes: 20, action: "Start", mode: "together",
    blocks: [
      { id: "b3", title: "Read-Aloud · The Bridge Engineers", subject: "la", minutes: 20, kids: ALL, mode: "same-room" },
    ] },
  { id: "eps",   name: "Engineering Problem Solving", subject: "sci", minutes: 60, action: "Start", mode: "split",
    blocks: [
      { id: "b4", title: "Bridge Load Testing Documentation Lab",      subject: "sci", minutes: 20, kids: ["leo","max"],  mode: "same-room" },
      { id: "b5", title: "Bridge Construction Supply Problems",        subject: "sci", minutes: 20, kids: ["leo","max"],  mode: "same-room" },
      { id: "b6", title: "Pressure-Resistant Habitat Design Challenge", subject: "sci", minutes: 20, kids: ["jack","jane"], mode: "same-room" },
    ] },
  { id: "world", name: "Bridges Around the World",  subject: "gh",   minutes: 20, action: "Start", mode: "together",
    blocks: [
      { id: "b7", title: "Famous Bridges · Atlas Walk", subject: "gh", minutes: 20, kids: ALL, mode: "same-room" },
    ] },
  { id: "build", name: "Build Your Bridge",         subject: "ca",   minutes: 40, action: "Start", mode: "parallel",
    blocks: [
      { id: "b8", title: "Studio · Sketch the Span", subject: "ca", minutes: 20, kids: ALL, mode: "parallel" },
      { id: "b9", title: "Studio · Build the Model", subject: "ca", minutes: 20, kids: ALL, mode: "parallel" },
    ] },
];

const DAYS = [
  { short: "M",  state: "done"  },
  { short: "T",  state: "today" },
  { short: "W",  state: "ahead" },
  { short: "Th", state: "ahead" },
  { short: "F",  state: "ahead" },
];

function useExpand(initial = null) {
  const [open, setOpen] = useState(initial);
  return [open, (id) => setOpen(prev => prev === id ? null : id)];
}

// ----- Shared chrome ---------------------------------------------------

function PhoneStatus({ tone = "ink" }) {
  const c = tone === "chalk" ? "rgba(248,244,233,0.9)" : "var(--ink)";
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

// Locked planetarium header band: ultramarine, star field,
// "the day is made" in Fraunces italic, day strip + pace line inside.
function PlanetariumBand({ kicker = "TUESDAY · WEEK 16" }) {
  return (
    <div style={{
      background: "radial-gradient(ellipse at 75% 30%, #1a2257 0%, #0C1020 65%)",
      color: "#F8F4E9", padding: "12px 22px 18px",
      position: "relative", overflow: "hidden",
    }}>
      {/* star field */}
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
      <PhoneStatus tone="chalk" />
      <div style={{ marginTop: 18, display: "flex", justifyContent: "space-between", alignItems: "baseline", position: "relative" }}>
        <span className="mono" style={{ fontSize: 10, color: "rgba(248,244,233,0.6)" }}>{kicker}</span>
        <span className="mono" style={{ fontSize: 10, color: "var(--saffron)" }}>847 / 900 · ON PACE</span>
      </div>
      {/* "the day is made" line — Fraunces italic, the brand voice moment */}
      <div style={{ marginTop: 10, position: "relative" }}>
        <span style={{
          fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 400, fontSize: 16,
          color: "rgba(248,244,233,0.85)", letterSpacing: "-0.01em",
        }}>
          the day is made
        </span>
      </div>
      {/* day strip */}
      <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(5,1fr)", position: "relative" }}>
        {DAYS.map((d, i) => {
          const isToday = d.state === "today";
          const isDone = d.state === "done";
          return (
            <div key={i} className="mono" style={{
              fontSize: 11, padding: "6px 0", textAlign: "center",
              fontWeight: isToday ? 700 : 400,
              color: isToday ? "var(--saffron)" : isDone ? "rgba(248,244,233,0.85)" : "rgba(248,244,233,0.4)",
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
    </div>
  );
}

function ModeLabel({ mode }) {
  // "together" | "split" | "parallel"
  const text = mode === "together" ? "All four · together"
             : mode === "parallel" ? "All four · parallel"
             : "Split · two groups";
  return (
    <span style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 500, fontSize: 12, color: "var(--mid)" }}>
      {text}
    </span>
  );
}

// Per-block kids list, used inside expanded clusters.
function BlockKids({ kids }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {kids.map(id => {
        const k = KIDS.find(x => x.id === id);
        return (
          <span key={id} style={{
            fontFamily: "Plus Jakarta Sans", fontWeight: 500, fontSize: 11,
            color: "var(--ink)", padding: "1px 7px",
            border: "1px solid var(--rule)", borderRadius: 999, background: "var(--paper)",
          }}>
            {k.name}
          </span>
        );
      })}
    </div>
  );
}

Object.assign(window, {
  KIDS, ALL, SUBJECT, CLUSTERS, DAYS,
  useExpand, PhoneStatus, PlanetariumBand, ModeLabel, BlockKids,
});
