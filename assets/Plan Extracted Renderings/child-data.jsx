/* global window */
// =============================================================
// Per-child identity exploration — shared sample data
// Family: Leo (8), Max (10), Jack (6), Jane (5)
// Same-initial collision: Jack / Jane
// =============================================================

const FAMILY = [
  { id: "leo",  name: "Leo",  initial: "L", age: 8,  short: "Leo" },
  { id: "max",  name: "Max",  initial: "M", age: 10, short: "Max" },
  { id: "jack", name: "Jack", initial: "J", age: 6,  short: "Jack" },
  { id: "jane", name: "Jane", initial: "J", age: 5,  short: "Jane" },
];

// Cluster 03 — Engineering Problem Solving (split: Group 1 Leo+Max, Group 2 Jack+Jane)
const CLUSTER_DEMO = {
  id: "tue-3",
  position: "03",
  name: "Engineering Problem Solving",
  subject: "sci",
  duration: 60,
  blockSize: 20,
  modifier: "SPLIT",
  groups: [
    {
      label: "GROUP 1",
      kids: ["leo", "max"],
      blocks: [
        { id: "g1-1", time: 20, name: "Bridge Load Testing Documentation Lab" },
        { id: "g1-2", time: 20, name: "Bridge Construction Supply Problems" },
      ],
    },
    {
      label: "GROUP 2",
      kids: ["jack", "jane"],
      blocks: [
        { id: "g2-1", time: 20, name: "Pressure-Resistant Habitat Design Challenge" },
      ],
    },
  ],
};

// Sample step for the print Block Sheet translation
const PRINT_DEMO = {
  step: {
    n: 1,
    title: "What makes a bridge stand up?",
    body: "Hold up two wooden blocks with a flat block laid across the gap. Ask: \"What do we call this shape?\" Wait for *bridge*, then ask what would happen if you took one of the supports away.",
    perChild: [
      { kid: "jack", note: "Encourage him to push the bridge gently and notice what falls. The body comes first." },
      { kid: "jane", note: "Ask her to name the parts: support, span, deck. She loves vocabulary." },
      { kid: "leo",  note: "Ask him why a longer span is harder to support. Let him reason." },
      { kid: "max",  note: "Ask which historical bridge this looks like (he'll say beam). Push to *truss* by step 3." },
    ],
  },
};

// Mastery-shift recap badges (per-child)
const RECAP_DEMO = [
  { kid: "leo",  shift: "from comparing to predicting", concept: "load distribution" },
  { kid: "max",  shift: "from naming to classifying",   concept: "bridge typology" },
  { kid: "jack", shift: "from watching to building",    concept: "supports & spans" },
  { kid: "jane", shift: "from labeling to defining",    concept: "structural vocabulary" },
];

Object.assign(window, { FAMILY, CLUSTER_DEMO, PRINT_DEMO, RECAP_DEMO });
