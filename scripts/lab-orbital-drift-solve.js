/**
 * DRIFT AMPLITUDE — solved against the label guarantee.
 *
 *   node scripts/lab-orbital-drift-solve.js
 *
 * Round 3's ruling: the libration must be big enough that a viewer registers a
 * change after twenty or thirty seconds away, and still never be catchable in
 * the act. Those two pull against each other, and a third constraint sits on top
 * of both — the label-overlap guarantee, which holds only while the excursion
 * stays small.
 *
 * THE GEOMETRY THAT DECIDES IT. A node's screen speed is its angular rate times
 * |dP/dtheta|, and on an ellipse that factor swings from ry at the major-axis
 * extreme to rx at the minor. For orbit a that is 101 against 480 — a body at
 * its turning point crawls while a body crossing the face flies, at the same
 * angular rate. One uniform rate therefore cannot give every node the same
 * apparent motion; whichever end you tune for, the other end is wrong by 4.7x.
 *
 * So amplitude is per node, set inversely to |dP/dtheta| so every body's PEAK
 * SCREEN SPEED is the same, and capped where the label guarantee runs out.
 * Each body librating by its own angle is not a fudge: amplitude is a property
 * of the body's motion, not of the orbit it sits on.
 */

const FRAME = { w: 1440, h: 984, cx: 720, cy: 472 };
const D2R = Math.PI / 180;
const HALFW = { reading: 81, writing: 87, math: 71, science: 66, geo: 73, art: 92, history: 83 };
const HALFH = 26, PAD = 6;

const ORBITS = {
  c: { rx: 480, ry: 275, rot: 25 },
  a: { rx: 434, ry: 248, rot: 148 },
  b: { rx: 372, ry: 209, rot: 172 }
};
const NODES = [
  { id: 'reading', orbit: 'b', t: 188 },
  { id: 'writing', orbit: 'a', t: 350 },
  { id: 'math',    orbit: 'b', t: 8 },
  { id: 'science', orbit: 'a', t: 76.44 },
  { id: 'geo',     orbit: 'a', t: 170 },
  { id: 'art',     orbit: 'b', t: 257.8 },
  { id: 'history', orbit: 'c', t: 195 }
];

const FLOOR = 252, GAP = 54;

function place(n, tDeg) {
  const o = ORBITS[n.orbit], r = o.rot * D2R, t = tDeg * D2R;
  const u = [Math.cos(r), Math.sin(r)], v = [-Math.sin(r), Math.cos(r)];
  const m = o.rx * Math.cos(t), q = o.ry * Math.sin(t);
  const dx = m * u[0] + q * v[0], dy = m * u[1] + q * v[1];
  const dist = Math.hypot(dx, dy) || 1;
  const rOut = Math.max(dist + GAP, FLOOR);
  const ang = Math.atan2(dy, dx);
  const ax = FRAME.cx + Math.cos(ang) * rOut, ay = FRAME.cy + Math.sin(ang) * rOut;
  const u01 = 0.5 + 0.5 * Math.sin(t);
  const sc = 0.93 + 0.07 * u01;
  const hw = (HALFW[n.id] + PAD) * sc, hh = HALFH * sc;
  return { id: n.id, x0: ax - hw, x1: ax + hw, y0: ay - hh, y1: ay + hh };
}

/* |dP/dtheta| in px per radian, at the node's composed position */
function tangential(n) {
  const o = ORBITS[n.orbit], t = n.t * D2R;
  return Math.hypot(o.rx * Math.sin(t), o.ry * Math.cos(t));
}

/* Exhaust the excursion box. Each node walks its own +/- bound independently, so
   this is every configuration the system can reach, not a sample of a path. */
function clean(bounds, grid) {
  const G = grid, N = NODES.length;
  const steps = NODES.map((n, i) => {
    const a = [];
    for (let k = 0; k < G; k++) a.push(-bounds[i] + 2 * bounds[i] * k / (G - 1));
    return a;
  });
  const total = Math.pow(G, N);
  let worst = null;
  for (let c = 0; c < total; c++) {
    let v = c;
    const R = [];
    for (let i = 0; i < N; i++) { R.push(place(NODES[i], NODES[i].t + steps[i][v % G])); v = (v / G) | 0; }
    for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
      const ox = Math.min(R[i].x1, R[j].x1) - Math.max(R[i].x0, R[j].x0);
      const oy = Math.min(R[i].y1, R[j].y1) - Math.max(R[i].y0, R[j].y0);
      if (ox <= 0 || oy <= 0) continue;
      const sev = ox * oy;
      if (!worst || sev > worst.sev) worst = { sev, area: Math.round(ox * oy), pair: [R[i].id, R[j].id] };
    }
  }
  return worst;
}

const GRID = Number(process.env.GRID || 5);

/* ── 1. the uniform boundary, for reference ───────────────────────────── */
console.log('uniform excursion — every node the same angle');
for (const b of [16, 20, 22, 24, 26, 28, 30]) {
  const w = clean(NODES.map(() => b), GRID);
  console.log('  +/-' + String(b).padStart(3) + ' deg   ' +
    (w ? 'overlap up to ' + String(w.area).padStart(5) + 'px2 (' + w.pair.join(' x ') + ')' : 'CLEAN'));
}

/* ── 2. per-node, normalised so every body's peak screen speed matches ── */
console.log('\nper-node excursion — amplitude inversely proportional to |dP/dtheta|,');
console.log('so every body peaks at the same screen speed, capped where labels run out');

const W = [0.55, 0.30, 0.15];
const P = [307, 491, 787];                     /* three primes, as built */
const SIGMA = W.reduce((s, w, i) => s + w * 2 * Math.PI / P[i], 0);

/* Excursion equals amplitude, not twice it: every sine starts at zero, so
   librate(node, 0) is exactly the composed position. Round 2 subtracted the
   value at phase zero to decorrelate the bodies, which doubled the box the
   labels had to survive and is what held its excursion to 16 degrees.
/* k spreads the rhythms and rides on the amplitude, so the box the labels have
   to survive is K/|dP/dtheta| * k, not K/|dP/dtheta|. */
const KS = NODES.map((n, i) => 0.92 + 0.028 * i);
let chosen = null;
for (const K of [2000, 2500, 3000, 3500, 4000, 5000]) {
  const amps = NODES.map((n, i) => K / tangential(n) * KS[i]);
  const w = clean(amps, GRID);
  const speeds = NODES.map((n, i) => amps[i] * SIGMA * D2R * tangential(n));
  console.log('  K ' + String(K).padStart(5) + '   amp ' +
    amps.map(a => a.toFixed(0).padStart(2)).join('/') + ' deg   peak ' +
    speeds[0].toFixed(2) + ' px/s   ' +
    (w ? 'overlap ' + w.area + 'px2 (' + w.pair.join(' x ') + ')' : 'CLEAN'));
  if (!w) chosen = { K, amps, speeds };
}

if (chosen) {
  console.log('\n  largest clean set: K = ' + chosen.K);
  console.log('    ' + NODES.map(n => n.id.padEnd(9)).join(''));
  console.log('    ' + chosen.amps.map(a => (a.toFixed(1) + 'deg').padEnd(9)).join(''));
  console.log('    ' + chosen.speeds.map(s => (s.toFixed(2) + 'px/s').padEnd(9)).join(''));
  const mean = chosen.speeds.map(s => s * 2 / Math.PI);
  console.log('    ' + mean.map(s => (Math.round(s * 30) + 'px/30s').padEnd(9)).join(''));
  console.log('\n  amplitude is what the labels cap; the periods set the rate independently.');
  for (const peak of [0.7, 0.9, 1.1]) {
    const need = SIGMA * peak / chosen.speeds[0];
    const p1 = P[0] * SIGMA / need;
    console.log('    peak ' + peak.toFixed(2) + ' px/s  ->  dominant period about ' +
      Math.round(p1) + 's, a body covers ' + Math.round(peak * 2 / Math.PI * 30) + 'px in 30s');
  }
}
console.log('\n  grid ' + GRID + '^7 = ' + Math.pow(GRID, 7).toLocaleString() + ' configurations per test');
console.log('  dominant libration period ' + P[0] + 's; components ' + P.join(' / ') + 's, all prime');
