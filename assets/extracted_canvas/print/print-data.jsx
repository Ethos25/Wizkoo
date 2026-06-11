/* global window */
// =============================================================
// Print sample data — Week 16, Bridges and Engineering, Walker family
// =============================================================

const PRINT = {
  family: "the Walker family",
  generated: "11 · 04 · 2026",
  week: {
    number: 16,
    theme: "Bridges and Engineering",
    subtitle: "How structures hold weight, span distance, and stand against pressure.",
    pace: "847 / 900 hours · 28 weeks remaining · on pace",
    days: [
      {
        label: "Monday",     summary: "3 clusters · 2H",
        clusters: [
          { time: 40, name: "Bridge Architecture Lab",     subject: "math", count: 2, modifier: "TOGETHER" },
          { time: 20, name: "Reading the Builders",        subject: "la",   count: 1, modifier: "TOGETHER" },
          { time: 60, name: "Engineering Problem Solving", subject: "sci",  count: 3, modifier: "SPLIT" },
        ],
      },
      {
        label: "Tuesday",    summary: "5 clusters · 3H",
        clusters: [
          { time: 40, name: "Bridge Architecture Lab",     subject: "math", count: 2, modifier: "TOGETHER" },
          { time: 20, name: "Reading the Builders",        subject: "la",   count: 1, modifier: "TOGETHER" },
          { time: 60, name: "Engineering Problem Solving", subject: "sci",  count: 3, modifier: "SPLIT" },
          { time: 20, name: "Bridges Around the World",    subject: "gh",   count: 1, modifier: "TOGETHER" },
          { time: 40, name: "Build Your Bridge",           subject: "ca",   count: 2, modifier: "PARALLEL" },
        ],
      },
      {
        label: "Wednesday",  summary: "3 clusters · 1H 40M",
        clusters: [
          { time: 40, name: "Load Testing Documentation",  subject: "sci",  count: 2, modifier: "TOGETHER" },
          { time: 20, name: "Bridge Stories from History", subject: "la",   count: 1, modifier: "TOGETHER" },
          { time: 40, name: "Bridge Math Workshop",        subject: "math", count: 2, modifier: "TOGETHER" },
        ],
      },
      {
        label: "Thursday",   summary: "2 clusters · 1H 20M",
        clusters: [
          { time: 60, name: "Final Bridge Construction",   subject: "ca",   count: 3, modifier: "TOGETHER" },
          { time: 20, name: "Bridge Showcase Reflection",  subject: "la",   count: 1, modifier: "TOGETHER" },
        ],
      },
      {
        label: "Friday",     summary: "3 clusters · 1H 40M",
        clusters: [
          { time: 40, name: "Bridge Engineer Interview",   subject: "la",   count: 2, modifier: "TOGETHER" },
          { time: 40, name: "Famous Bridges of the World", subject: "gh",   count: 2, modifier: "TOGETHER" },
          { time: 20, name: "Bridge Week in Review",       subject: "math", count: 1, modifier: "TOGETHER" },
        ],
      },
    ],
  },
  // Materials Master sections, organized by where they live in the parent's house.
  materials: [
    {
      location: "KITCHEN",
      items: [
        "1 cup uncooked rice",
        "small mixing bowl",
        "measuring cups",
        "kitchen towel",
      ],
    },
    {
      location: "CRAFT DRAWER",
      items: [
        "20 wooden blocks",
        "30 craft sticks",
        "2 rolls masking tape",
        "3 toy cars",
        "measuring tape",
        "notebook",
        "pencils",
        "string · 12 ft",
        "scissors",
        "watercolor set",
        "cardstock · 8.5 × 11",
        "1 yard butcher paper",
      ],
    },
    {
      location: "LIBRARY",
      items: [
        "*Iggy Peck, Architect* — Andrea Beaty",
        "*Bridges* — Carol A. Johmann",
        "*The Story of Bridges* (DK Readers)",
      ],
      notes: ["request 3 days ahead"],
    },
    {
      location: "OUTDOORS",
      items: [
        "10 small stones (load testing)",
        "stick · ~12 in (span measurement)",
      ],
    },
    {
      location: "TO ACQUIRE",
      items: [
        { text: "balsa wood strips · 1/8 in",       where: "craft store" },
        { text: "wood glue (small bottle)",         where: "craft store" },
        { text: "atlas or world-map printout",      where: "library or print at home" },
      ],
    },
  ],
  // Notes pulled from each cluster's logistics — surfaced flat on the Materials Master.
  notes: [
    { cluster: "BRIDGE ARCHITECTURE LAB",     text: "Gather wooden blocks Sunday evening. Activity works best on a hard surface. Expect Max and Leo to want longer spans; have extra craft sticks ready." },
    { cluster: "ENGINEERING PROBLEM SOLVING", text: "Group split: Leo and Max in the dining room, Jack and Jane at the kitchen table. Set up both before starting." },
    { cluster: "BUILD YOUR BRIDGE",           text: "Cover the work surface with butcher paper. Wood glue dries in ~30 min — plan the parallel session so glue can set during cleanup." },
    { cluster: "FINAL BRIDGE CONSTRUCTION",   text: "All four kids working at one table. Print the showcase reflection sheet ahead so Friday morning is ready." },
  ],
  // The Block Sheet — Block 1 of 14 from Monday's Bridge Architecture Lab cluster.
  block: {
    indexLabel: "BLOCK 1 OF 14",
    day: "MONDAY",
    name: "Bridge Shape Engineering Station",
    cluster: "Bridge Architecture Lab",
    duration: 20,
    subject: "math",
    subjectLabel: "MATH",
    modifier: "All four kids · same room",
    materials: [
      "20 wooden blocks",
      "10 small stones",
      "measuring tape",
      "notebook",
      "pencils",
    ],
    setup:
      "Clear the dining table. Lay out the wooden blocks in the center, the stones at one end, and the measuring tape and notebook at the other. Sit the kids around the table — Jack and Jane on one side, Leo and Max on the other.",
    steps: [
      {
        n: 1,
        title: "What makes a bridge stand up?",
        body: "Hold up two wooden blocks with a flat block laid across the gap. Ask: \"What do we call this shape?\" Wait for *bridge*, then ask what would happen if you took one of the supports away.",
        perChild: [
          { kid: "Jack",  note: "Encourage him to push the bridge gently and notice what falls. The body comes first." },
          { kid: "Jane",  note: "Ask her to name the parts: support, span, deck. She loves vocabulary." },
          { kid: "Leo",   note: "Ask him why a longer span is harder to support. Let him reason." },
          { kid: "Max",   note: "Ask which historical bridge this looks like (he'll say beam). Push to *truss* by step 3." },
        ],
      },
      {
        n: 2,
        title: "Build the longest span",
        body: "Each kid builds a single-span bridge from supports to supports. They measure their span with the tape and write it in the notebook. The longest unsupported span wins (no prize — just notice).",
        perChild: [
          { kid: "Jack",  note: "Help him stack supports steady before laying the deck. The motor task carries the lesson." },
          { kid: "Jane",  note: "Ask her to write *span* and the inches in her own row." },
          { kid: "Leo",   note: "Challenge him to predict before he measures." },
          { kid: "Max",   note: "Push him to two-deck (stacked) configurations. He'll discover bracing on his own." },
        ],
      },
      {
        n: 3,
        title: "Load test",
        body: "Place stones one at a time on each bridge. Count how many stones each holds before it collapses. Record the number next to each child's span in the notebook.",
        perChild: [
          { kid: "Jack",  note: "Place the stones for him. Ask him to predict *will it fall?* before each one." },
          { kid: "Jane",  note: "Have her count out loud and write the final number." },
          { kid: "Leo",   note: "Ask why a shorter span held more weight. Connect to *engineering trade-offs*." },
          { kid: "Max",   note: "Introduce the words *truss*, *arch*, *suspension*. Ask which his structure is closest to." },
        ],
      },
    ],
    earlyFinishers: [
      { kid: "Jack",  note: "Stack the blocks into the tallest tower he can without it falling." },
      { kid: "Jane",  note: "Draw her bridge in the notebook. Label the parts she used." },
      { kid: "Leo",   note: "Design a two-span bridge with a center support. Build it." },
      { kid: "Max",   note: "Sketch a truss bridge in the notebook. Build it after Block 2." },
    ],
  },
};

Object.assign(window, { PRINT });
