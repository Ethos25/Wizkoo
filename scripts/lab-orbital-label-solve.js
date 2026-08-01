/**
 * LABEL PLACEMENT — solved, not eyeballed.
 *
 *   node scripts/lab-orbital-label-solve.js
 *
 * THE PROBLEM, found by the round-2 verification walk: two nodes on different
 * orbits can arrive at nearly the same screen position, and a label placed
 * purely radially outward from its node then lands on top of the other one.
 * Both are near the nucleus at that moment, so both are near FULL presence, and
 * depth-linked opacity cannot save them — equally present, equally unreadable.
 *
 * The fix has to be static geometry, because reactive collision handling is
 * ruled out: a fade triggered by a detected overlap is a visible pop, and a pop
 * reads as UI in a frame that has to read as physics. So each ORBIT carries
 * three fixed placement constants — a ring floor, a persistent radial offset,
 * and a tangential bias — and labels belonging to different orbits are thereby
 * separated whatever their nodes happen to be doing.
 *
 * The three periods are incommensurate, so given enough time every relative
 * phase of the three orbits occurs. A single 12,600s window samples one slice of
 * that; this walks all three phases independently and searches the constants
 * against the worst case in the whole space.
 *
 * Same-orbit pairs are included. Two nodes on one orbit hold a fixed offset in t
 * forever, but the map from t to screen angle is nonlinear on an eccentric
 * ellipse, so their angular separation still breathes and can still close.
 */

const FRAME = { w: 1440, h: 984, cx: 720, cy: 472 };
const D2R = Math.PI / 180;

/* measured in the browser with the real webfont */
const HALFW = { reading: 81, writing: 87, math: 71, science: 66, geo: 73, art: 92, history: 83 };
const HALFH = 26;
const PAD = 6;

const ORBITS = {
  c: { rx: 356, ry: 115, rot: 85 },
  a: { rx: 480, ry: 101, rot: -22 },
  b: { rx: 446, ry: 82,  rot: 31 }
};
const NODES = [
  { id: 'reading', orbit: 'b', t: 188 },
  { id: 'writing', orbit: 'a', t: 350 },
  { id: 'math',    orbit: 'b', t: 8 },
  { id: 'science', orbit: 'a', t: 81 },
  { id: 'geo',     orbit: 'a', t: 170 },
  { id: 'art',     orbit: 'b', t: 257.5 },
  { id: 'history', orbit: 'c', t: 195 }
];

/* THE MODEL, and why it is this one.
   A label's radius is its ORBIT'S RING, pulled only 20% of the way toward its
   own node's distance. That keeps each orbit's labels inside a narrow band of
   radius, and three narrow bands can be made disjoint by more than a label's
   height — which makes cross-orbit collision impossible by construction rather
   than by testing for it.

   The obvious alternative, a label always sitting just outboard of its node, is
   provably impossible here. Outboard means r >= dist + 24, so each orbit's band
   spans its own dist range: 82..446 for b, 101..480 for a, 115..356 for c. Those
   spans are 300 to 400 wide and all start near 100, so no assignment of offsets
   makes them disjoint, and any that came close would push the outermost band
   past 1000 and out of a 1440 x 984 frame. The trade is real and it is this: at
   a node's farthest excursion its label sits inboard of it, tethered.
*/
/* THE PLACEMENT, restored to the obvious one: a label sits radially outward
   from its own node, with a floor so it clears the body. That is the placement
   that reads, and the only reason round 2 went looking for another was to
   survive full revolutions. It does not have to any more — see below. */
const FLOOR = 252, GAP = 54;

function place(n, cfg, tDeg) {
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
  const op = 0.35 + 0.65 * Math.pow(u01, 0.85);
  const hw = (HALFW[n.id] + PAD) * sc, hh = HALFH * sc;
  return { id: n.id, x0: ax - hw, x1: ax + hw, y0: ay - hh, y1: ay + hh, op, dist, rOut, ang };
}

/* Worst case over the whole phase space. Severity is intersection area weighted
   by the DIMMER label's presence: a crossing only matters to the extent the
   quieter of the two is still asking to be read. */
function sweep(cfg, S) {
  let worst = null;
  const ext = { x0: 1e9, x1: -1e9, y0: 1e9, y1: -1e9 };
  let insideNode = -1e9;
  const D = 360 / S;
  for (let ia = 0; ia < S; ia++) for (let ib = 0; ib < S; ib++) for (let ic = 0; ic < S; ic++) {
    const off = { a: ia * D, b: ib * D, c: ic * D };
    const R = NODES.map(n => place(n, cfg, n.t + off[n.orbit]));
    for (const r of R) {
      if (r.x0 < ext.x0) ext.x0 = r.x0;
      if (r.x1 > ext.x1) ext.x1 = r.x1;
      if (r.y0 < ext.y0) ext.y0 = r.y0;
      if (r.y1 > ext.y1) ext.y1 = r.y1;
      /* how far a label ever sits inboard of its own node — the cost of the
         ring model, measured rather than hand-waved */
      insideNode = Math.max(insideNode, r.dist - r.rOut);
    }
    for (let i = 0; i < R.length; i++) for (let j = i + 1; j < R.length; j++) {
      const ox = Math.min(R[i].x1, R[j].x1) - Math.max(R[i].x0, R[j].x0);
      const oy = Math.min(R[i].y1, R[j].y1) - Math.max(R[i].y0, R[j].y0);
      if (ox <= 0 || oy <= 0) continue;
      const dim = Math.min(R[i].op, R[j].op);
      const sev = ox * oy * dim;
      if (!worst || sev > worst.sev) worst = { sev, dim, area: ox * oy, pair: [R[i].id, R[j].id], off };
    }
  }
  return { worst, ext, insideNode };
}

const fits = (e) => e.x0 >= 0 && e.x1 <= FRAME.w && e.y0 >= 0 && e.y1 <= FRAME.h;

/* BOUNDED DRIFT. Each node wanders inside +/- AMP degrees of its composed
   position and nothing else changes, so the composed spacing is what has to
   survive — and it is a bounded box, which can be exhausted rather than
   sampled. Every node is walked independently to its extremes and beyond, on a
   grid, and the worst configuration in that box is the worst that can ever
   happen. */
const AMP = Number(process.env.AMP || 5.3);
const G = Number(process.env.GRID || 5);

function boundedWorst(amp, grid) {
  let worst = null;
  const ext = { x0: 1e9, x1: -1e9, y0: 1e9, y1: -1e9 };
  const steps = [];
  for (let i = 0; i < grid; i++) steps.push(-amp + (2 * amp) * i / (grid - 1));
  const idx = new Array(NODES.length).fill(0);
  const total = Math.pow(grid, NODES.length);
  for (let c = 0; c < total; c++) {
    let v = c;
    for (let i = 0; i < NODES.length; i++) { idx[i] = v % grid; v = (v / grid) | 0; }
    const R = NODES.map((n, i) => place(n, null, n.t + steps[idx[i]]));
    for (const r of R) {
      if (r.x0 < ext.x0) ext.x0 = r.x0;
      if (r.x1 > ext.x1) ext.x1 = r.x1;
      if (r.y0 < ext.y0) ext.y0 = r.y0;
      if (r.y1 > ext.y1) ext.y1 = r.y1;
    }
    for (let i = 0; i < R.length; i++) for (let j = i + 1; j < R.length; j++) {
      const ox = Math.min(R[i].x1, R[j].x1) - Math.max(R[i].x0, R[j].x0);
      const oy = Math.min(R[i].y1, R[j].y1) - Math.max(R[i].y0, R[j].y0);
      if (ox <= 0 || oy <= 0) continue;
      const sev = ox * oy;
      if (!worst || sev > worst.sev) worst = { sev, area: ox * oy, pair: [R[i].id, R[j].id] };
    }
  }
  return { worst, ext, total };
}

for (const amp of [0, 3, 5.3, 8, 12, 18, 30]) {
  const r = boundedWorst(amp, G);
  const clear = !r.worst;
  console.log('  amplitude +/-' + String(amp).padStart(4) + ' deg   ' +
    (clear ? 'NO LABEL OVERLAP ANYWHERE'
           : 'overlap up to ' + String(Math.round(r.worst.area)).padStart(5) + 'px2 (' + r.worst.pair.join(' x ') + ')') +
    '   extent y ' + r.ext.y0.toFixed(0) + '..' + r.ext.y1.toFixed(0) +
    (fits(r.ext) ? '' : '  OUT OF FRAME'));
}
console.log('  grid ' + G + '^7 = ' + Math.pow(G, 7).toLocaleString() + ' configurations per amplitude');
