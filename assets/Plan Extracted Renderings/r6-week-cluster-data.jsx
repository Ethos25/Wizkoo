/* global window */
// =============================================================
// Week 16 + Bridge Architecture Lab cluster — sample data
// Subject ids match r4-data.jsx (la, math, sci, gh, ca)
// =============================================================

const WEEK = {
  number: 16,
  theme: "Bridges and Engineering",
  subtitle: "How structures hold weight, span distance, and stand against pressure.",
  pace: { hours: 847, target: 900, weeksRemaining: 28, status: "on pace" },
  days: [
    {
      id: "mon", label: "Monday", short: "Mon",
      summary: "3 clusters · 2h",
      // All complete (Monday is in the past)
      clusters: [
        { id: "mon-1", time: 40, name: "Bridge Architecture Lab",   subject: "math", count: 2, complete: true },
        { id: "mon-2", time: 20, name: "Reading the Builders",      subject: "la",   count: 1, complete: true },
        { id: "mon-3", time: 60, name: "Engineering Problem Solving", subject: "sci", count: 3, complete: true },
      ],
    },
    {
      id: "tue", label: "Tuesday", short: "Tue",
      summary: "5 clusters · 3h",
      // Today — first cluster done, rest pending
      clusters: [
        { id: "tue-1", time: 40, name: "Bridge Architecture Lab",     subject: "math", count: 2, complete: true,  today: true },
        { id: "tue-2", time: 20, name: "Reading the Builders",        subject: "la",   count: 1, complete: false, today: true },
        { id: "tue-3", time: 60, name: "Engineering Problem Solving", subject: "sci",  count: 3, complete: false, today: true },
        { id: "tue-4", time: 20, name: "Bridges Around the World",    subject: "gh",   count: 1, complete: false, today: true },
        { id: "tue-5", time: 40, name: "Build Your Bridge",           subject: "ca",   count: 2, complete: false, today: true },
      ],
    },
    {
      id: "wed", label: "Wednesday", short: "Wed",
      summary: "3 clusters · 1h 40m",
      clusters: [
        { id: "wed-1", time: 40, name: "Load Testing Documentation", subject: "sci",  count: 2, complete: false },
        { id: "wed-2", time: 20, name: "Bridge Stories from History", subject: "la",  count: 1, complete: false },
        { id: "wed-3", time: 40, name: "Bridge Math Workshop",       subject: "math", count: 2, complete: false },
      ],
    },
    {
      id: "thu", label: "Thursday", short: "Thu",
      summary: "2 clusters · 1h 20m",
      clusters: [
        // Cross-subject — show as primary subject (creative arts) per brief
        { id: "thu-1", time: 60, name: "Final Bridge Construction",  subject: "ca",  count: 3, complete: false, secondarySubject: "math" },
        { id: "thu-2", time: 20, name: "Bridge Showcase Reflection", subject: "la",  count: 1, complete: false },
      ],
    },
    {
      id: "fri", label: "Friday", short: "Fri",
      summary: "3 clusters · 1h 40m",
      clusters: [
        { id: "fri-1", time: 40, name: "Bridge Engineer Interview",   subject: "la",   count: 2, complete: false },
        { id: "fri-2", time: 40, name: "Famous Bridges of the World", subject: "gh",   count: 2, complete: false },
        { id: "fri-3", time: 20, name: "Bridge Week in Review",       subject: "math", count: 1, complete: false },
      ],
    },
  ],
};

// Today is Tuesday; "today" indicator surfaces in the day strip.
const TODAY_DAY_ID = "tue";

const CLUSTER = {
  id: "tue-1",
  name: "Bridge Architecture Lab",
  duration: "about 40 min",
  blockCount: 2,
  subject: "math",
  modifier: "TOGETHER",
  who: "ALL FOUR",
  pace: { hours: 847, target: 900, weeksRemaining: 28, status: "on pace" },
  materials: [
    "20 wooden blocks",
    "30 craft sticks",
    "2 rolls masking tape",
    "3 toy cars",
    "measuring tape",
    "notebook",
    "pencils",
  ],
  // 0 = unchecked, 1 = checked. Sunday-prep parent has gathered the first three.
  materialsChecked: [true, true, true, false, false, false, false],
  logistics: [
    "Gather wooden blocks Sunday evening.",
    "The activity works best on a hard surface.",
    "Expect Max and Leo to want longer spans; have extra craft sticks ready.",
  ],
  blocks: [
    {
      id: "b1", time: 20,
      name: "Bridge Shape Engineering Station",
      subject: "math",
      tags: ["MATH", "HANDS-ON", "PER-CHILD"],
      complete: false,
    },
    {
      id: "b2", time: 20,
      name: "Bridge Span Rice Measurement",
      subject: "math",
      tags: ["MATH", "HANDS-ON", "TOGETHER"],
      complete: false,
    },
  ],
};

Object.assign(window, { WEEK, TODAY_DAY_ID, CLUSTER });
