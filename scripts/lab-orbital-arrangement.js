/**
 * ARRANGEMENT — the diagnosis, and the trade stated as arithmetic.
 *
 *   node scripts/lab-orbital-arrangement.js
 *
 * The finding: the lab's three rings read as near-parallel diagonals. Round 5
 * varied their flatness and the variation is invisible. This works out why, on
 * the same measures for the lab, the shipped homepage section, and the logo's
 * proportions, and then states the constraint that governs every candidate.
 *
 * THE ONE INEQUALITY THAT DECIDES THIS ROUND
 *
 *   An orbit reads as a PLANE rather than a line in proportion to its openness
 *   O = ry/rx: at O near zero it is a stroke, at O near one it is a circle seen
 *   flat on. And the occlusion cue needs the arc to come inside the body, which
 *   for an orbit centred on the nucleus means ry < R.
 *
 *   Write E = rx/R for how far the orbits reach relative to the nucleus. Then
 *
 *       ry < R    <=>    O * rx < R    <=>    O * E < 1
 *
 *   Openness and envelope are the same budget. You may spend it on rings that
 *   read as planes, or on a small nucleus inside a wide cage, and not on both.
 *   That is the whole of the tension, and every lever below is a way of moving
 *   inside it — except the last one, which changes the inequality itself.
 */

const D2R = Math.PI / 180;

function measure(name, R, orbits) {
  console.log('\n' + name);
  console.log('  nucleus radius ' + R);
  console.log('  orbit    rx    ry   rot     O=ry/rx   E=rx/R   O*E    nearest   farthest   crosses');
  let angs = [];
  for (const o of orbits) {
    const O = o.ry / o.rx, E = o.rx / R;
    /* nearest and farthest approach of the arc to the nucleus centre; with an
       offset centre these are no longer just ry and rx, so they are found by
       walking the ellipse rather than assumed */
    let near = 1e9, far = -1;
    for (let t = 0; t < 360; t += 0.25) {
      const r = o.rot * D2R, th = t * D2R;
      const u = [Math.cos(r), Math.sin(r)], v = [-Math.sin(r), Math.cos(r)];
      const m = o.rx * Math.cos(th), q = o.ry * Math.sin(th);
      const dx = (o.ox || 0) + m * u[0] + q * v[0];
      const dy = (o.oy || 0) + m * u[1] + q * v[1];
      const d = Math.hypot(dx, dy);
      if (d < near) near = d;
      if (d > far) far = d;
    }
    const crosses = near < R;
    /* the screen angle of the arc where it crosses the face: the tangent at the
       point of closest approach, which for a centred ellipse is the major axis */
    let ang = ((o.rot % 180) + 180) % 180;
    angs.push(ang);
    console.log('    ' + o.id + '   ' + String(o.rx).padStart(5) + ' ' + String(o.ry).padStart(5) +
      ' ' + String(o.rot).padStart(5) + '    ' + O.toFixed(3) + '    ' + E.toFixed(2) +
      '    ' + (O * E).toFixed(2) + '   ' + near.toFixed(0).padStart(6) + '   ' +
      far.toFixed(0).padStart(7) + '    ' + (crosses ? 'yes' : 'NO'));
  }
  angs.sort((a, b) => a - b);
  const gaps = [angs[1] - angs[0], angs[2] - angs[1], 180 - (angs[2] - angs[0])];
  console.log('  crossing angles  ' + angs.map(a => a.toFixed(0) + ' deg').join(', ') +
    '   gaps ' + gaps.map(g => g.toFixed(0)).join(' / ') +
    '   spread ' + (Math.max(...gaps) - Math.min(...gaps)).toFixed(0) + ' deg of irregularity');
  const envelope = Math.max(...orbits.map(o => o.rx));
  console.log('  nucleus / envelope  ' + (R / envelope).toFixed(3) +
    '   (R ' + R + ' against rx ' + envelope + ')');
  console.log('  openness spread     ' +
    Math.min(...orbits.map(o => o.ry / o.rx)).toFixed(3) + ' to ' +
    Math.max(...orbits.map(o => o.ry / o.rx)).toFixed(3));
  return { angs, gaps };
}

console.log('═══ DIAGNOSIS ═══');

measure('LAB AS RENDERED — round 5', 125, [
  { id: 'c', rx: 356, ry: 112, rot: 88 },
  { id: 'a', rx: 480, ry: 56, rot: -28 },
  { id: 'b', rx: 446, ry: 84, rot: 32 }
]);

/* index.html, the "Granddad broke his foot" section, at its own viewBox scale */
measure('SHIPPED HOMEPAGE SECTION — index.html, as it ships today', 42, [
  { id: 'C', rx: 310, ry: 178, rot: -32 },
  { id: 'A', rx: 280, ry: 160, rot: -8 },
  { id: 'B', rx: 240, ry: 135, rot: 25 }
]);

console.log('\n═══ WHAT THE NUMBERS SAY ═══');
console.log(`
  The lab's crossing angles are 32 / 88 / 152 degrees — gaps of 56, 64 and 60.
  That is very nearly even, and evenly spaced is the one arrangement that reads
  as a set rather than as three individuals. But the defect is not the spread.

  The defect is OPENNESS. The lab's three run 0.117 / 0.188 / 0.315. An ellipse
  at 0.117 is a stroke; nothing about it says "circle seen at an angle", so its
  rotation reads as the direction of a line rather than as the tilt of a plane.
  Three lines at three angles are three lines. The shipped section's three run
  0.562 / 0.571 / 0.574 — all but identical, and its rotations are far MORE
  clustered than the lab's (gaps of 24, 33, 123). It reads as a cage anyway,
  because at 0.57 every one of them reads as a circle.

  So round 5 varied the wrong quantity. Flatness variation is invisible while
  every ring is too flat to read as a plane at all.

  And openness is exactly what the occlusion cue is paid for in. O * E < 1:

    shipped section   O 0.57  E 7.38   O*E = 4.2    no orbit comes near the body
    lab, round 5      O 0.31  E 2.85   O*E = 0.90   all three cross
`);


/* ── Render the candidates and state each one's occlusion result ───────── */
if (process.argv[2]) {
  const { chromium } = require('@playwright/test');
  const path = require('path');
  const fs = require('fs');
  const BASE = process.argv[2];
  const OUT = process.argv[3] || path.join(__dirname, '..', 'screenshots', 'orbital-lab');
  fs.mkdirSync(OUT, { recursive: true });
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const GPU = ['--use-angle=default', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-gpu-rasterization'];

  (async () => {
    const b = await chromium.launch({ headless: true, args: GPU });
    console.log('\n═══ CANDIDATES ═══');
    for (const k of ['5', 'A', 'B', 'C', 'D']) {
      const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
      const page = await ctx.newPage();
      const errs = [];
      page.on('pageerror', e => errs.push(e.message));
      await page.goto(BASE.replace(/\/$/, '') + '/lab/orbital?arr=' + k, { waitUntil: 'networkidle' });
      await page.click('button[data-group="collapse"]');
      await page.evaluate(() => document.getElementById('orbital').scrollIntoView({ block: 'start' }));
      await sleep(6500);
      const info = await page.evaluate(() => {
        const A = window.WizkooLabOrbital;
        const scan = (o) => {
          let near = 1e9, far = -1;
          for (let t = 0; t < 360; t += 0.2) {
            const q = A.pointAt(o, t);
            const d = Math.hypot(q.x - A.FRAME.cx, q.y - A.FRAME.cy);
            if (d < near) near = d; if (d > far) far = d;
          }
          return { near, far };
        };
        const rows = A.ORBITS.map(o => {
          const s2 = scan(o);
          return { id: o.id, rx: o.rx, ry: o.ry, rot: o.rot, off: o.off || 0,
                   O: o.ry / o.rx, ryR: o.ry / A.NUC_R, near: s2.near, far: s2.far,
                   cross: s2.near < A.NUC_R,
                   ang: ((o.rot % 180) + 180) % 180 };
        });
        const limb = A.sys.nodes.filter(n => n.def.id === 'science' || n.def.id === 'art').map(n => {
          const q = A.pointAt(n.orbit, n.t);
          return { id: n.def.id, d: Math.hypot(q.x - A.FRAME.cx, q.y - A.FRAME.cy), near: q.near };
        });
        return { key: A.ARR_KEY, label: A.ARR.label, R: A.NUC_R, rows, limb,
                 sil: document.querySelectorAll('.lo-layer--silhouette .lo-path').length };
      });
      await page.screenshot({ path: path.join(OUT, 'arr-' + k + '.png') });
      await page.screenshot({ path: path.join(OUT, 'arr-' + k + '-detail.png'),
        clip: { x: 340, y: 130, width: 760, height: 700 } });
      await ctx.close();

      console.log('\n  ' + info.key + ' — ' + info.label);
      console.log('    nucleus radius ' + info.R);
      console.log('    orbit    rx    ry   rot   off    O      ry/R    nearest  farthest   crosses');
      info.rows.forEach(r => console.log('      ' + r.id + '   ' + String(r.rx).padStart(5) +
        ' ' + String(r.ry).padStart(5) + ' ' + String(r.rot).padStart(5) + ' ' + String(r.off).padStart(5) +
        '  ' + r.O.toFixed(3) + '  ' + r.ryR.toFixed(3) + '   ' + r.near.toFixed(0).padStart(6) +
        '   ' + r.far.toFixed(0).padStart(7) + '     ' + (r.cross ? 'yes' : 'NO')));
      const angs = info.rows.map(r => r.ang).sort((a, c) => a - c);
      const gaps = [angs[1] - angs[0], angs[2] - angs[1], 180 - (angs[2] - angs[0])];
      console.log('    crossing angles ' + angs.map(a => a.toFixed(0)).join(' / ') +
        '   gaps ' + gaps.map(g => g.toFixed(0)).join(' / '));
      console.log('    openness ' + Math.min(...info.rows.map(r => r.O)).toFixed(3) + ' to ' +
        Math.max(...info.rows.map(r => r.O)).toFixed(3) +
        '   nucleus/envelope ' + (info.R / Math.max(...info.rows.map(r => r.rx))).toFixed(3));
      const allCross = info.rows.every(r => r.cross);
      const straddle = info.limb.length === 2 &&
        info.limb.every(l => Math.abs(l.d - info.R) < 26) &&
        info.limb.some(l => l.near) && info.limb.some(l => !l.near);
      console.log('    OCCLUSION ASSERTION: ' +
        (allCross && straddle && info.sil === 3 ? 'PASS' : 'FAIL') +
        '   (every orbit crosses: ' + allCross +
        ', limb straddled front and behind: ' + straddle + ')');
      info.limb.forEach(l => console.log('      ' + l.id.padEnd(8) + '|P-C| ' + l.d.toFixed(0) +
        ' against R ' + info.R + '   ' + (l.near ? 'in front' : 'behind')));
      /* Geometry moves labels, so the round-2 exhaustion has to be re-run for
         any candidate that changes it. Same method: every node walked to the
         corners of its own libration amplitude, independently. */
      const ctx2 = await b.newContext({ viewport: { width: 1440, height: 900 } });
      const pg2 = await ctx2.newPage();
      await pg2.goto(BASE.replace(/\/$/, '') + '/lab/orbital?arr=' + k, { waitUntil: 'networkidle' });
      await pg2.evaluate(() => document.getElementById('orbital').scrollIntoView({ block: 'start' }));
      await sleep(5500);
      const lab = await pg2.evaluate(() => {
        const A = window.WizkooLabOrbital;
        const G = 3, ids = A.sys.nodes.map(n => n.def.id);
        const steps = A.sys.nodes.map(n => [-n.amp, 0, n.amp]);
        const rects = () => A.sys.nodes.map(n => {
          let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
          n.label.querySelectorAll('text').forEach(t => {
            const r = t.getBoundingClientRect();
            x0 = Math.min(x0, r.left); y0 = Math.min(y0, r.top);
            x1 = Math.max(x1, r.right); y1 = Math.max(y1, r.bottom);
          });
          return { id: n.def.id, x0, y0, x1, y1, op: +n.label.getAttribute('opacity') };
        });
        let worst = null, tested = 0;
        const total = Math.pow(G, ids.length);
        for (let c = 0; c < total; c++) {
          let v = c; const map = {};
          for (let i = 0; i < ids.length; i++) { map[ids[i]] = A.sys.nodes[i].def.t + steps[i][v % G]; v = (v / G) | 0; }
          A.setT(map); tested++;
          const R2 = rects();
          for (let i = 0; i < R2.length; i++) for (let j = i + 1; j < R2.length; j++) {
            const ox = Math.min(R2[i].x1, R2[j].x1) - Math.max(R2[i].x0, R2[j].x0);
            const oy = Math.min(R2[i].y1, R2[j].y1) - Math.max(R2[i].y0, R2[j].y0);
            if (ox <= 0 || oy <= 0) continue;
            const sev = ox * oy;
            if (!worst || sev > worst.sev) worst = { sev, area: Math.round(ox * oy),
              pair: [R2[i].id, R2[j].id], dim: +Math.min(R2[i].op, R2[j].op).toFixed(2) };
          }
        }
        const home = {}; A.sys.nodes.forEach(n => home[n.def.id] = n.def.t);
        A.setT(home);
        return { worst, tested };
      });
      await ctx2.close();
      /* The ruled bar is that wherever two labels touch, the dimmer has already
         receded to background — 0.45 or under on the 0.35-to-1.0 presence
         range. "No overlap at all" is better but was never the requirement. */
      console.log('    LABEL EXHAUSTION (' + lab.tested.toLocaleString() + ' configurations): ' +
        (lab.worst
          ? (lab.worst.dim <= 0.45 ? 'PASS' : 'FAIL') + ' — crossings up to ' + lab.worst.area +
            'px2 (' + lab.worst.pair.join(' x ') + '), dimmer label at ' + lab.worst.dim +
            (lab.worst.dim <= 0.45 ? ' (receded)' : ' (STILL PRESENT)')
          : 'PASS — no two labels overlap anywhere'));
      if (errs.length) console.log('    ERRORS: ' + errs.join(' | '));
    }
    await b.close();
  })();
}
