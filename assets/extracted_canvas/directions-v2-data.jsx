/* global React */
const { useState } = React;

// =============================================================
// Family of four — ordered young → old
// Each child gets a single ink-on-chalk initial, no color of their own;
// the SUBJECT is the color, always. Children are typographic, subjects are chromatic.
// =============================================================
const KIDS = [
  { id: "jack", initial: "J", name: "Jack", age: 4,  stage: "Wonderer"  },
  { id: "amy",  initial: "A", name: "Amy",  age: 6,  stage: "Apprentice" },
  { id: "leo",  initial: "L", name: "Leo",  age: 8,  stage: "Artisan"   },
  { id: "max",  initial: "M", name: "Max",  age: 11, stage: "Scholar"   },
];
const ALL = ["jack","amy","leo","max"];

const SUBJECT = {
  la:   { key: "la",   name: "Language Arts",      short: "LA",   deep: "var(--la-deep)",   bright: "var(--la-bright)" },
  math: { key: "math", name: "Math",                short: "Math", deep: "var(--math-deep)", bright: "var(--math-bright)" },
  sci:  { key: "sci",  name: "Science",             short: "Sci",  deep: "var(--sci-deep)",  bright: "var(--sci-bright)" },
  gh:   { key: "gh",   name: "Geography & History", short: "G&H",  deep: "var(--gh-deep)",   bright: "var(--gh-bright)" },
  ca:   { key: "ca",   name: "Creative Arts",       short: "Arts", deep: "var(--ca-deep)",   bright: "var(--ca-bright)" },
};

// modes: same-room (one block, all listed kids together)
//        parallel (one cluster slot, kids doing different blocks side-by-side)
//        independent (one block, one kid)
//
// Today (Tuesday, Week 16, "Bridges and Engineering"):
// Cluster 1 — Bridge Architecture Lab — MATH, 2×20m, all four together (same-room across both blocks)
// Cluster 2 — Engineering Problem Solving — mixed subjects, 3×20m, split into pairs

const DAY = {
  date: "Tuesday",
  dateShort: "Tue",
  theme: "Bridges and Engineering",
  week: 16,
  pace: { hoursDone: 847, hoursTotal: 900, weeksLeft: 28, status: "on pace" },
};

const DAYS = [
  { letter: "M", short: "M",  full: "Mon", state: "done" },
  { letter: "T", short: "T",  full: "Tue", state: "today" },
  { letter: "W", short: "W",  full: "Wed", state: "ahead" },
  { letter: "T", short: "Th", full: "Thu", state: "ahead" },
  { letter: "F", short: "F",  full: "Fri", state: "ahead" },
];

const CLUSTERS = [
  {
    id: "lab",
    name: "Bridge Architecture Lab",
    subject: "math",
    minutes: 40,
    completed: 0,
    action: "Start",
    blocks: [
      { id: "b1", title: "Bridge Shape Engineering Station", subject: "math", minutes: 20, kids: ALL, mode: "same-room",
        note: "All four together · differentiated by stage" },
      { id: "b2", title: "Bridge Span Rice Measurement",     subject: "math", minutes: 20, kids: ALL, mode: "same-room",
        note: "All four together · same materials" },
    ],
    summary: { kids: ALL, mode: "same-room" },
  },
  {
    id: "eps",
    name: "Engineering Problem Solving",
    subject: "sci", // primary; mixed below
    minutes: 60,
    completed: 0,
    action: "Continue",
    blocks: [
      { id: "b3", title: "Bridge Load Testing Documentation Lab", subject: "sci",  minutes: 20, kids: ALL,           mode: "parallel",
        note: "All four · documentation differs by stage" },
      { id: "b4", title: "Bridge Construction Supply Problems",   subject: "math", minutes: 20, kids: ["leo","max"], mode: "same-room",
        note: "Leo and Max · independent of younger kids" },
      { id: "b5", title: "Pressure-Resistant Habitat Design Challenge", subject: "sci", minutes: 20, kids: ["jack","amy"], mode: "same-room",
        note: "Jack and Amy · in parallel with Leo and Max" },
    ],
    summary: { kids: ALL, mode: "split" },
  },
];

// Hook
function useExpand(initial = null) {
  const [open, setOpen] = useState(initial);
  return [open, (id) => setOpen(prev => prev === id ? null : id)];
}

// Helper for child glyph (initial in a small ink ring/dot — no per-child color)
function KidInitial({ kid, size = 22, tone = "ink", muted = false, ring = false }) {
  const fg = tone === "chalk" ? "#F8F4E9" : "var(--ink)";
  const opacity = muted ? 0.32 : 1;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: size, height: size, borderRadius: size,
      border: ring ? `1.5px solid ${fg}` : "none",
      fontFamily: "Plus Jakarta Sans", fontWeight: 600, fontSize: size * 0.55,
      color: fg, opacity, lineHeight: 1, letterSpacing: 0,
    }}>
      {kid.initial}
    </span>
  );
}

Object.assign(window, {
  KIDS, ALL, SUBJECT, DAY, DAYS, CLUSTERS, useExpand, KidInitial,
});
