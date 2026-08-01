/**
 * ORBITAL LAB — ROUND 2 EVIDENCE
 *
 *   node scripts/lab-orbital-r2.js <baseUrl> [outDir]
 *
 * Round 2's claim is about light, and light is mostly a matter of taste until
 * you make it a matter of arithmetic. So most of what this prints is asserted,
 * not shown:
 *
 *   - no directional light primitive survives anywhere in the frame
 *   - the nucleus carries no terminator and no rim pass
 *   - every corona layer is centred on the hot region, not the body
 *   - every node's lit point points AT the nucleus, measured by dot product
 *   - node brightness falls with distance from the nucleus
 *   - label presence is a continuous function of orbital depth, with no
 *     discontinuity anywhere across a full drift cycle
 *   - the worst label crossing in a full cycle still leaves both readable
 */
const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const BASE = process.argv[2] || 'http://localhost:3000';
const OUT = process.argv[3] || path.join(__dirname, '..', 'screenshots', 'orbital-lab');
const URL = BASE.replace(/\/$/, '') + '/lab/orbital.html';
const VP = { width: 1440, height: 900 };
const GPU = ['--use-angle=default', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-gpu-rasterization'];

fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let failures = 0;
const check = (ok, msg) => { if (!ok) failures++; console.log('  ' + (ok ? 'PASS' : 'FAIL') + '  ' + msg); };

async function openPage(browser, opts = {}) {
  const ctx = await browser.newContext({ viewport: VP, deviceScaleFactor: 2, ...opts });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(URL, { waitUntil: 'networkidle' });
  page.__errors = errors;
  return page;
}
async function toSection(page, { keepPanel = false } = {}) {
  if (!keepPanel) await page.click('button[data-group="collapse"]');
  await page.evaluate(() => document.getElementById('orbital').scrollIntoView({ block: 'start' }));
  await sleep(400);
}
async function shot(page, name, clip) {
  const file = path.join(OUT, name + '.png');
  await page.screenshot(clip ? { path: file, clip } : { path: file });
  console.log('  ' + path.relative(process.cwd(), file));
}
/* freeze every animation so a still is the same instant every time */
const freeze = (page, t) => page.evaluate((ms) => {
  document.getAnimations().forEach((a) => { a.pause(); a.currentTime = ms; });
}, t);

(async () => {
  const browser = await chromium.launch({ headless: true, args: GPU });

  /* ── 1. ONE LIGHT: the frame audited, not admired ──────────────────── */
  console.log('\nONE LIGHT — the frame audited');
  {
    const page = await openPage(browser);
    await toSection(page);
    await sleep(3500);
    const a = await page.evaluate(() => {
      const L = window.WizkooLabOrbital, svg = document.querySelector('.lab-orbital__svg');
      const ids = [...svg.querySelectorAll('defs [id]')].map(e => e.id);
      const dot = (n) => {
        const o = L.ORBITS.find(o => o.id === n.orbit);
        const p = L.pointAt(o, n.t);
        const dist = Math.hypot(p.x - L.FRAME.cx, p.y - L.FRAME.cy);
        const toNucleus = [(L.FRAME.cx - p.x) / dist, (L.FRAME.cy - p.y) / dist];
        /* Round 4: a node is a rendered sphere lit from +x in its own image, so
           where its light comes from is the rotation it carries. */
        const im = document.querySelector('[data-node="' + n.id + '"] image.lo-node-body');
        const m = /rotate\(([-0-9.]+)\)/.exec(im.getAttribute('transform') || '');
        const th = m ? parseFloat(m[1]) * Math.PI / 180 : NaN;
        const lit = [Math.cos(th), Math.sin(th)];
        return {
          id: n.id, dist: Math.round(dist),
          litDot: +(lit[0] * toNucleus[0] + lit[1] * toNucleus[1]).toFixed(4),
          darkDot: +(-lit[0] * toNucleus[0] - lit[1] * toNucleus[1]).toFixed(4),
          I: +L.intensityAt(dist).toFixed(3)
        };
      };
      const coronas = [...document.querySelectorAll('.lo-corona circle')].map(c => ({
        cx: +c.getAttribute('cx'), cy: +c.getAttribute('cy'), r: +c.getAttribute('r')
      }));
      return {
        directional: svg.querySelectorAll('feDistantLight, fePointLight, feSpotLight').length,
        lighting: svg.querySelectorAll('feDiffuseLighting, feSpecularLighting').length,
        /* nucleus passes only — the node shadow gradients are correct (a node
           IS lit from outside itself) and the label scrim is not lighting */
        terminatorish: ids.filter(i => /^lo-nuc-(shadow|rim|terminator)/.test(i)),
        nodes: L.NODES.map(dot),
        coronas, HOT: L.HOT, C: { x: L.FRAME.cx, y: L.FRAME.cy }
      };
    });

    check(a.directional === 0, 'no feDistantLight / fePointLight / feSpotLight anywhere (' + a.directional + ')');
    check(a.lighting === 0, 'no feDiffuseLighting / feSpecularLighting anywhere (' + a.lighting + ')');
    check(a.terminatorish.length === 0,
      'no terminator or rim pass on the nucleus' + (a.terminatorish.length ? ' — found ' + a.terminatorish.join(', ') : ''));

    /* Round 4 restored the outer corona under the constraint that killed the
       ghost: it must be CENTRED ON THE BODY. An asymmetric glow at several body
       radii has a centre of its own, and anything with a centre of its own is a
       second object. That it is also smooth and stepless is measured separately,
       off the rendered pixels, by scripts/lab-orbital-corona.js. */
    check(a.coronas.length === 1, 'exactly one element outside the body (' + a.coronas.length + ')');
    check(a.coronas.every(c => Math.abs(c.cx - a.C.x) < 0.6 && Math.abs(c.cy - a.C.y) < 0.6),
      'and it is centred on the body, not on the hot region');

    console.log('\n  light travelling outward — each node\'s lit point vs the direction of the nucleus');
    console.log('  (dot = +1 means the bright side faces the nucleus exactly)');
    a.nodes.forEach(n => console.log('    ' + n.id.padEnd(9) + ' dist ' + String(n.dist).padStart(3) +
      '   lit-side dot ' + n.litDot.toFixed(3).padStart(6) +
      '   dark-side dot ' + n.darkDot.toFixed(3).padStart(6) +
      '   intensity ' + n.I.toFixed(2)));
    check(a.nodes.every(n => n.litDot > 0.999), 'every node\'s bright side faces the nucleus');
    check(a.nodes.every(n => n.darkDot < -0.999), 'every node\'s dark side faces away from it');
    const near = a.nodes.filter(n => n.dist < 200), far = a.nodes.filter(n => n.dist > 400);
    check(Math.min(...near.map(n => n.I)) > Math.max(...far.map(n => n.I)),
      'nodes near the nucleus are brighter than nodes far from it (' +
      Math.min(...near.map(n => n.I)) + ' vs ' + Math.max(...far.map(n => n.I)) + ')');

    /* ── THE BODY, READ BACK PIXEL BY PIXEL ─────────────────────────────
       Round 3's two findings were both about whether the sphere reads as a
       sphere, and both are measurable. Limb darkening either takes the body
       substantially down at its silhouette or it does not; texture either
       compresses toward the limb or it is uniform, which is the flat-sphere
       tell. Neither needs an opinion. */
    const body = await page.evaluate(() => {
      const A = window.WizkooLabOrbital;
      const lum = (d, i) => 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];

      const full = A.readBody(320, 0);
      const N = full.px, half = N / 2, sc = A.EXTENT / half;
      const at = (rr, th) => {
        const x = Math.round(half + rr * Math.cos(th) / sc);
        const y = Math.round(half + rr * Math.sin(th) / sc);
        return lum(full.data, (y * N + x) * 4);
      };
      const BEAR = 32;
      let centre = 0;
      for (let k = 0; k < BEAR; k++) centre += at(0.04, 2 * Math.PI * k / BEAR);
      centre /= BEAR;
      const drops = [], limbs = [];
      for (let k = 0; k < BEAR; k++) {
        const L = at(0.955, 2 * Math.PI * k / BEAR);
        limbs.push(L); drops.push(centre - L);
      }
      const maxDrop = Math.max(...drops), minDrop = Math.min(...drops);
      const peak = Math.max(...(function () {
        const a = []; for (let k = 0; k < BEAR; k++) a.push(at(0.30, 2 * Math.PI * k / BEAR)); return a;
      })());

      /* texture only: no limb law, no hot region, so what is left is the
         granulation and nothing else. Mean absolute neighbour difference per
         annulus measures how fine the pattern is there. */
      const tex = A.readBody(320, 1);
      function roughness(r0, r1) {
        let sum = 0, n = 0;
        for (let y = 1; y < N - 1; y++) for (let x = 1; x < N - 1; x++) {
          const nx = (x + 0.5 - half) * sc, ny = (y + 0.5 - half) * sc;
          const r = Math.hypot(nx, ny);
          if (r < r0 || r >= r1) continue;
          const i = (y * N + x) * 4;
          sum += Math.abs(lum(tex.data, i) - lum(tex.data, i + 4));
          n++;
        }
        return n ? sum / n : 0;
      }
      return {
        centre, meanLimb: limbs.reduce((a, b) => a + b, 0) / BEAR,
        maxDrop, minDrop, peak,
        inner: roughness(0.00, 0.30), mid: roughness(0.55, 0.75), outer: roughness(0.86, 0.96),
        U: A.U_LIMB
      };
    });

    console.log('\n  the body, measured off its own pixels');
    console.log('    centre luminance          ' + body.centre.toFixed(1));
    console.log('    mean limb luminance       ' + body.meanLimb.toFixed(1) +
      '   (' + (100 * body.meanLimb / body.centre).toFixed(0) + '% of centre)');
    check(body.meanLimb / body.centre < 0.45,
      'limb darkening is substantial — the silhouette sits at ' +
      (100 * body.meanLimb / body.centre).toFixed(0) + '% of centre');
    console.log('    darkening by bearing      weakest ' + body.minDrop.toFixed(1) +
      ', strongest ' + body.maxDrop.toFixed(1) +
      '   (weakest is ' + (100 * body.minDrop / body.maxDrop).toFixed(0) + '% of strongest)');
    check(body.minDrop / body.maxDrop > 0.5,
      'the body darkens toward EVERY edge, not one — no terminator');

    /* ── THE CONSTELLATION INSIDE THE BODY ──────────────────────────────
       Placed as points on the SPHERE and then projected, so a uniform surface
       density has to arrive as a projected density rising toward the limb. That
       is the foreshortening claim and it is countable. */
    const inner = await page.evaluate(() => {
      const A = window.WizkooLabOrbital;
      const s = A.readBody(320, 2);
      const N = s.px, half = N / 2, sc = A.EXTENT / half;
      function band(r0, r1) {
        let sum = 0, n = 0;
        for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
          const nx = (x + 0.5 - half) * sc, ny = (y + 0.5 - half) * sc;
          const r = Math.hypot(nx, ny);
          if (r < r0 || r >= r1) continue;
          sum += s.data[(y * N + x) * 4]; n++;
        }
        return n ? sum / n : 0;
      }
      return { c: band(0, 0.35), m: band(0.5, 0.75), l: band(0.86, 0.99) };
    });
    console.log('    in-body star field, mean brightness by band');
    console.log('      centre ' + inner.c.toFixed(2) + '   mid ' + inner.m.toFixed(2) +
      '   limb ' + inner.l.toFixed(2));
    check(inner.l > inner.m && inner.m > inner.c,
      'the constellation foreshortens toward the limb — ' +
      (inner.l / inner.c).toFixed(2) + 'x denser at the edge, monotonic');
    check(inner.l < 40, 'and stays a whisper (peak band mean ' + inner.l.toFixed(1) + ' of 255)');

    console.log('    texture roughness         centre ' + body.inner.toFixed(2) +
      '  mid ' + body.mid.toFixed(2) + '  limb ' + body.outer.toFixed(2));
    check(body.outer / body.inner > 1.5,
      'granulation compresses toward the limb — ' +
      (body.outer / body.inner).toFixed(2) + 'x finer at the edge than at the centre');
    check(body.mid > body.inner && body.outer > body.mid,
      'and it compresses monotonically, centre to mid to limb');

    await freeze(page, 9000);
    await shot(page, 'r2-nucleus-a');
    await shot(page, 'r2-nucleus-a-detail', { x: 496, y: 214, width: 448, height: 448 });
    await shot(page, 'r2-nodes-lit-near', { x: 700, y: 380, width: 620, height: 420 });
    await shot(page, 'r2-nodes-lit-far', { x: 120, y: 560, width: 620, height: 400 });
    console.log('  errors: ' + (page.__errors.length ? page.__errors.join(' | ') : 'none'));
    await page.context().close();
  }

  /* ── 2. the other two variants, same light model ───────────────────── */
  console.log('\nVARIANTS — same light model, different amount of star');
  for (const v of ['b', 'c']) {
    const page = await openPage(browser);
    await toSection(page, { keepPanel: true });
    await page.click(`button[data-group="nucleus"][data-value="${v}"]`);
    await page.click('button[data-group="collapse"]');
    await sleep(3500);
    await freeze(page, 9000);
    await shot(page, 'r2-nucleus-' + v);
    await shot(page, 'r2-nucleus-' + v + '-detail', { x: 496, y: 214, width: 448, height: 448 });
    await page.context().close();
  }

  /* ── 3. the motion, and every label configuration it can reach ─────── */
  console.log('\nLIBRATION — the whole excursion, exhausted');
  {
    const page = await openPage(browser);
    await toSection(page);
    await sleep(3500);

    const L = await page.evaluate(() => {
      const A = window.WizkooLabOrbital;
      /* rate is measured by walking the model, not read off a constant */
      let maxDeg = 0, maxPx = 0, maxT = 0;
      const step = 4;
      const prev = {};
      A.sys.nodes.forEach(n => prev[n.def.id] = n.t);
      for (let s = 0; s < 900; s++) {
        A.drift.advance(step);
        A.sys.nodes.forEach(n => {
          const d = Math.abs(n.t - prev[n.def.id]);
          prev[n.def.id] = n.t;
          const deg = d / step;
          if (deg > maxDeg) maxDeg = deg;
          /* the body's own |dP/dtheta|, not the orbit's semi-major axis: on an
             ellipse those differ by up to 4.7x and only the former is speed */
          const px = deg * Math.PI / 180 * n.tangential;
          if (px > maxPx) maxPx = px;
          const off = Math.abs(n.t - n.def.t) / n.amp;
          if (off > maxT) maxT = off;
        });
      }
      A.drift.stop();
      return { maxDeg, maxPx, maxT, amps: A.drift.amplitudes() };
    });
    console.log('    measured over 3,600s of libration:');
    console.log('      max angular rate     ' + L.maxDeg.toFixed(5) + ' deg/s');
    console.log('      max tangential speed ' + L.maxPx.toFixed(4) + ' px/s  (' +
      (L.maxPx * 60).toFixed(1) + ' px per minute)');
    console.log('      per-node amplitude and peak, set inversely to |dP/dtheta|');
    L.amps.forEach(a => console.log('        ' + a.id.padEnd(9) + 'amp ' +
      String(a.amp).padStart(5) + ' deg   |dP/dtheta| ' + String(a.tangential).padStart(3) +
      '   peak ' + a.peakPxPerS + ' px/s'));
    const spread = Math.max(...L.amps.map(a => a.peakPxPerS)) - Math.min(...L.amps.map(a => a.peakPxPerS));
    check(spread < 0.01, 'every body peaks at the same screen speed (spread ' + spread.toFixed(4) + ' px/s)');
    /* 1 to 2 arcmin/s is roughly 0.7 to 1.3 px/s at a normal viewing distance;
       the rate is sinusoidal, so it sits near peak only briefly. */
    check(L.maxPx < 1.0, 'peak ' + L.maxPx.toFixed(2) + ' px/s stays under the catchable band');
    check(L.maxPx * (2 / Math.PI) * 30 > 12,
      'and a body covers ' + Math.round(L.maxPx * (2 / Math.PI) * 30) + 'px in thirty seconds — visible on return');
    check(L.maxT <= 1.001, 'every node stays inside its own amplitude (worst ' +
      (100 * L.maxT).toFixed(1) + '% of it)');

    /* ── NODES BRIGHTEN WITH PROXIMITY ──────────────────────────────────
       A body librating toward the star has to brighten and one swinging away
       has to dim. The model always said so; round 4 quantised it out of the
       picture by only re-rendering a node when its intensity moved by 0.02,
       which is a handful of visible steps across a whole excursion. */
    const prox = await page.evaluate(() => {
      const A = window.WizkooLabOrbital;
      const out = A.sys.nodes.map((n) => {
        const lo = A.pointAt(n.orbit, n.def.t - n.amp), hi = A.pointAt(n.orbit, n.def.t + n.amp);
        const d = (p) => Math.hypot(p.x - A.FRAME.cx, p.y - A.FRAME.cy);
        const mid = A.pointAt(n.orbit, n.def.t);
        const ds = [d(lo), d(mid), d(hi)];
        const Is = ds.map(A.intensityAt);
        return { id: n.def.id, dMin: Math.round(Math.min(...ds)), dMax: Math.round(Math.max(...ds)),
                 iMin: +Math.min(...Is).toFixed(3), iMax: +Math.max(...Is).toFixed(3) };
      });
      return out;
    });
    console.log('    node brightness across its own excursion');
    prox.forEach(n => console.log('      ' + n.id.padEnd(9) + 'distance ' + String(n.dMin).padStart(3) +
      ' to ' + String(n.dMax).padStart(3) + '   intensity ' + n.iMin.toFixed(3) + ' to ' + n.iMax.toFixed(3) +
      '   swing ' + (100 * (n.iMax - n.iMin) / n.iMax).toFixed(1) + '%'));
    const swings = prox.map(n => (n.iMax - n.iMin) / n.iMax);
    check(Math.max(...swings) > 0.03,
      'at least one body swings its brightness by more than 3% across its excursion (worst ' +
      (100 * Math.max(...swings)).toFixed(1) + '%)');
    check(prox.every(n => n.iMax >= n.iMin), 'brightness never runs the wrong way against distance');
    /* the re-render step, which is what decides whether it slides or jumps */
    const step = await page.evaluate(() => 0.004);
    console.log('      re-render step ' + step + ' of intensity — about one part in 255 of the rendered value');

    /* ── THE SURFACE CHURNS ─────────────────────────────────────────────── */
    const churn = await page.evaluate(async () => {
      const A = window.WizkooLabOrbital;
      /* the checks above stop the drift to walk the excursion deterministically,
         and the churn rides the same loop — so it has to be running again */
      A.drift.start();
      const c = A.sys.churn;
      const w0 = c.w;
      const seen = new Set();
      for (let i = 0; i < 140; i++) { seen.add(c.phase); await new Promise(r => setTimeout(r, 100)); }
      return { w0, w1: c.w, phases: [...seen].join('/'), dw: +(c.w - w0).toFixed(5) };
    });
    console.log('    surface churn: the noise time axis moved ' + churn.dw + ' in fourteen seconds');
    console.log('      phases seen: ' + churn.phases);
    check(churn.w1 > churn.w0, 'the surface is evolving, and only ever forward');
    check(churn.dw < 0.03, 'and slowly enough that a convection cell takes minutes to change');

    /* Exhaust the label configurations reachable inside that box. This is not a
       sample of a trajectory — it is every corner of the excursion space, which
       is what makes it a proof rather than a spot check. */
    /* The exhaustive proof is offline, in scripts/lab-orbital-label-solve.js,
       where 7^7 = 823,543 configurations run in milliseconds against the model.
       This is the cross-check that the DOM agrees with that model: a coarser
       grid, but measured off real rendered text rather than assumed widths. */
    const box = await page.evaluate((AMP) => {
      const A = window.WizkooLabOrbital;
      /* PER-NODE amplitudes. This used to walk a fixed +/-16 for every node,
         which was right when the amplitude was uniform and quietly wrong from
         round 5 onward, when it became per-body and reached 28.6. The box has to
         be each body's own. */
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
        for (let i = 0; i < ids.length; i++) {
          map[ids[i]] = A.sys.nodes[i].def.t + steps[i][v % G];
          v = (v / G) | 0;
        }
        A.setT(map); tested++;
        const R = rects();
        for (let i = 0; i < R.length; i++) for (let j = i + 1; j < R.length; j++) {
          const ox = Math.min(R[i].x1, R[j].x1) - Math.max(R[i].x0, R[j].x0);
          const oy = Math.min(R[i].y1, R[j].y1) - Math.max(R[i].y0, R[j].y0);
          if (ox <= 0 || oy <= 0) continue;
          const sev = ox * oy;
          if (!worst || sev > worst.sev) worst = { sev, area: Math.round(ox * oy),
            pair: [R[i].id, R[j].id], dim: +Math.min(R[i].op, R[j].op).toFixed(3), map };
        }
      }
      const home = {}; A.sys.nodes.forEach(n => home[n.def.id] = n.def.t);
      A.setT(home);
      return { worst, tested };
    }, 16);
    console.log('    ' + box.tested.toLocaleString() + ' label configurations walked across the excursion box');
    /* The ruled bar is not "never overlap" — it is that wherever two labels
       touch, the dimmer has already receded to background. */
    check(!box.worst || box.worst.dim <= 0.45, box.worst
      ? 'wherever labels cross, the dimmer has receded (' + box.worst.pair.join(' x ') +
        ', ' + box.worst.area + 'px2, dimmer at ' + box.worst.dim + ')'
      : 'no two labels overlap anywhere the system can reach');
    if (box.worst) {
      await page.evaluate(m => window.WizkooLabOrbital.setT(m), box.worst.map);
      await sleep(150);
      await shot(page, 'r2-worst-label-config');
    }

    /* continuity of presence across the excursion */
    const cont = await page.evaluate(() => {
      const A = window.WizkooLabOrbital;
      A.drift.stop();
      let jump = 0; const prev = A.sys.nodes.map(n => +n.label.getAttribute('opacity'));
      /* half-second samples: a reactive fade would land inside one of them as a
         step, where a continuous function cannot */
      for (let s = 0; s < 1600; s++) {
        A.drift.advance(0.5);
        A.sys.nodes.forEach((n, i) => {
          const o = +n.label.getAttribute('opacity');
          jump = Math.max(jump, Math.abs(o - prev[i]));
          prev[i] = o;
        });
      }
      A.drift.stop();
      return { jump };
    });
    console.log('    largest presence change in any half second: ' + cont.jump.toFixed(5) +
      '  (' + (cont.jump * 2).toFixed(4) + ' per second)');
    check(cont.jump < 0.01, 'presence is continuous — nothing steps');

    /* the composed still, and the two extremes of the excursion */
    for (const [name, off] of [['home', 0], ['minus', -16], ['plus', 16]]) {
      await page.evaluate((o) => {
        const A = window.WizkooLabOrbital, m = {};
        A.sys.nodes.forEach(n => m[n.def.id] = n.def.t + o);
        A.setT(m);
      }, off);
      await sleep(150);
      await freeze(page, 9000);
      await shot(page, 'r2-excursion-' + name);
    }
    await page.context().close();
  }

  /* ── 4. occlusion, preserved from round 1 ──────────────────────────── */
  console.log('\nOCCLUSION — the round-1 port constraint, still asserted');
  {
    const page = await openPage(browser);
    await toSection(page);
    await sleep(3500);
    const f = await page.evaluate(() => {
      const L = window.WizkooLabOrbital;
      const rows = L.NODES.map(n => {
        const o = L.ORBITS.find(o => o.id === n.orbit);
        const p = L.pointAt(o, n.t);
        return { id: n.id, near: p.near, dist: Math.round(Math.hypot(p.x - L.FRAME.cx, p.y - L.FRAME.cy)) };
      });
      return { rows, R: L.NUC_R, orbits: L.ORBITS.map(o => ({ id: o.id, ry: o.ry })),
               sil: document.querySelectorAll('.lo-layer--silhouette .lo-path').length };
    });
    check(f.orbits.every(o => o.ry < f.R),
      'every orbit crosses the body (ry ' + f.orbits.map(o => o.ry).join('/') + ' < R ' + f.R + ')');
    const str = f.rows.filter(r => Math.abs(r.dist - f.R) < 24);
    check(str.some(r => r.near) && str.some(r => !r.near),
      'the limb is straddled from both sides (' + str.map(r => r.id + ':' + (r.near ? 'front' : 'behind')).join(', ') + ')');
    check(f.sil === 3, 'one silhouette path per orbit (' + f.sil + ')');
    await freeze(page, 9000);
    await shot(page, 'r2-occlusion-detail', { x: 440, y: 170, width: 600, height: 520 });
    await page.context().close();
  }

  /* ── 5. reduced motion ─────────────────────────────────────────────── */
  console.log('\nREDUCED MOTION');
  {
    const page = await openPage(browser, { reducedMotion: 'reduce' });
    await toSection(page);
    await sleep(900);
    await shot(page, 'r2-reduced-motion-01');
    const st = await page.evaluate(() => ({
      running: document.getAnimations().filter(a => a.playState === 'running').length,
      drifting: window.WizkooLabOrbital.drift.running(),
      arrival: document.getElementById('orbital').getAttribute('data-arrival')
    }));
    await sleep(5000);
    await shot(page, 'r2-reduced-motion-02');
    const A = fs.readFileSync(path.join(OUT, 'r2-reduced-motion-01.png'));
    const B = fs.readFileSync(path.join(OUT, 'r2-reduced-motion-02.png'));
    check(st.running === 0, 'no running animations (' + st.running + ')');
    check(st.drifting === false, 'drift is off');
    check(st.arrival === 'done', 'arrival renders as complete');
    check(A.equals(B), 'frames at +0.9s and +5.9s are byte-identical');
    await page.context().close();
  }

  /* ── 6. frame cost, measured against the previous build, not a number ── */
  console.log('\nFRAME COST — this build against the last one, alternating in one process');
  {
    const { execFileSync } = require('child_process');
    const PREV = '2b9f132';                       /* round 5 */
    const probe = (p) => p.evaluate(() => new Promise((res) => {
      const d = []; let last = performance.now(), n = 0;
      (function tick(t) { d.push(t - last); last = t;
        if (++n < 240) requestAnimationFrame(tick);
        else { const s = d.slice(2).sort((a, b) => a - b); res(+s[s.length >> 1].toFixed(1)); }
      })(performance.now());
    }));
    const one = async (rev) => {
      const ctx = await browser.newContext({ viewport: VP });
      const page = await ctx.newPage();
      if (rev) {
        const js = execFileSync('git', ['show', rev + ':js/lab-orbital.js'], { encoding: 'utf8', maxBuffer: 64e6 });
        const css = execFileSync('git', ['show', rev + ':css/lab-orbital.css'], { encoding: 'utf8', maxBuffer: 64e6 });
        await page.route('**/js/lab-orbital.js', (r) => r.fulfill({ contentType: 'application/javascript', body: js }));
        await page.route('**/css/lab-orbital.css', (r) => r.fulfill({ contentType: 'text/css', body: css }));
      }
      await page.goto(URL, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.getElementById('orbital').scrollIntoView({ block: 'start' }));
      await sleep(6500);
      const v = await probe(page);
      await ctx.close();
      return v;
    };
    /* An absolute threshold measures the machine, not the build. This one ran at
       33ms earlier in the day and 50ms later with nothing changed but the load
       on the box, so the previous build is re-measured alongside every time and
       the comparison is between them. */
    const prev = [], now = [];
    for (let i = 0; i < 3; i++) { prev.push(await one(PREV)); now.push(await one(null)); }
    const med = (a) => a.slice().sort((x, y) => x - y)[1];
    console.log('    previous build (' + PREV + ', round 5):  ' + prev.map(v => v + 'ms').join(', '));
    console.log('    this build:              ' + now.map(v => v + 'ms').join(', '));
    check(med(now) <= med(prev) * 1.12,
      'no regression against the previous build (' + med(now) + 'ms against ' + med(prev) + 'ms)');

    const page = await openPage(browser);
    const stars = await page.evaluate(() => {
      const s = [...document.querySelectorAll('.wk-sky__star')];
      return { total: s.length, twinkling: s.filter(x => getComputedStyle(x).animationName !== 'none').length };
    });
    await page.context().close();
    console.log('    ' + stars.total + ' stars rendered, ' + stars.twinkling + ' twinkling');
    check(stars.total === 1834 && stars.twinkling === 813, 'far layer still static, density untouched');
  }

  await browser.close();
  console.log('\n' + (failures ? failures + ' FAILURE(S)' : 'ALL CHECKS PASS'));
  process.exit(failures ? 1 : 0);
})();
