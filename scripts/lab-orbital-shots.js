/**
 * ORBITAL LAB — evidence capture.
 *
 *   node scripts/lab-orbital-shots.js <baseUrl> [outDir]
 *
 * Drives the lab the way Amy will: scroll the section into view, let the arrival
 * beat run, then capture.
 *
 * WHY THE ARRIVAL FRAMES ARE SCRUBBED, NOT SLEPT
 *   The first pass of this script slept between screenshots. With 1,834 animated
 *   stars on the page a 2x screenshot takes seconds, so the sleeps drifted and
 *   every "sample" came back showing the finished state. The beat is now sampled
 *   by pausing every running animation and setting currentTime, which is exact
 *   regardless of how long the capture itself takes.
 */
const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const BASE = process.argv[2] || 'http://localhost:3000';
const OUT = process.argv[3] || path.join(__dirname, '..', 'screenshots', 'orbital-lab');
const URL = BASE.replace(/\/$/, '') + '/lab/orbital.html';
const VP = { width: 1440, height: 900 };

fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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

/* Restart the beat and freeze the whole document's animation clock at t ms. */
async function scrub(page, t) {
  await page.evaluate((ms) => {
    document.getAnimations().forEach((a) => { a.pause(); a.currentTime = ms; });
  }, t);
}
async function replayAndScrub(page, t) {
  await page.evaluate(() => {
    document.getAnimations().forEach((a) => { try { a.play(); } catch (e) {} });
  });
  /* clicked through the DOM: the panel is collapsed for the stills, so the
     button is not hittable, and the point here is the beat, not the chrome */
  await page.evaluate(() => document.querySelector('button[data-group="replay"]').click());
  await sleep(160);                     /* let the reflow land and the beat start */
  await scrub(page, t);
}

(async () => {
  const browser = await chromium.launch();

  /* ── 1. the arrival, scrubbed ──────────────────────────────────────── */
  console.log('arrival beat, slow (4.0s) — exact frames');
  {
    const page = await openPage(browser);
    await toSection(page);
    await sleep(6000);                                    /* let it latch first */
    for (const m of [0, 300, 700, 1100, 1600, 2100, 2600, 3200, 3900]) {
      await replayAndScrub(page, m);
      await shot(page, 'arrival-slow-' + String(m).padStart(4, '0') + 'ms');
    }
    console.log('  errors: ' + (page.__errors.length ? page.__errors.join(' | ') : 'none'));
    await page.context().close();
  }

  console.log('arrival beat, brisk (2.5s) — exact frames');
  {
    const page = await openPage(browser);
    await toSection(page);
    await sleep(6000);
    await page.evaluate(() => document.querySelector('button[data-group="arrival"][data-value="brisk"]').click());
    await sleep(3200);
    for (const m of [0, 300, 700, 1100, 1500, 2000, 2500]) {
      await replayAndScrub(page, m);
      await shot(page, 'arrival-brisk-' + String(m).padStart(4, '0') + 'ms');
    }
    await page.context().close();
  }

  /* ── 2. nucleus variants, settled ──────────────────────────────────── */
  console.log('nucleus variants');
  for (const v of ['a', 'b', 'c']) {
    const page = await openPage(browser);
    await toSection(page, { keepPanel: true });
    await page.click(`button[data-group="nucleus"][data-value="${v}"]`);
    await page.click('button[data-group="collapse"]');
    await sleep(7000);                       /* past the arrival, into ambient */
    await scrub(page, 9000);                 /* same instant of the breath for all three */
    await shot(page, 'nucleus-' + v);
    await shot(page, 'nucleus-' + v + '-detail', { x: 496, y: 214, width: 448, height: 448 });
    await page.context().close();
  }

  /* the breath, sampled across one 3-5s window at the default variant */
  console.log('nucleus breath amplitude (variant b)');
  {
    const page = await openPage(browser);
    await toSection(page);
    await sleep(7000);
    for (const t of [0, 1200, 2400, 3600, 4800]) {
      await scrub(page, 9000 + t);
      await shot(page, 'breath-b-t' + String(t).padStart(4, '0'), { x: 496, y: 214, width: 448, height: 448 });
    }
    await page.context().close();
  }

  /* ── 3. the occlusion proof ────────────────────────────────────────── */
  console.log('occlusion');
  {
    const page = await openPage(browser);
    await toSection(page);
    await sleep(7000);
    await shot(page, 'occlusion-detail', { x: 440, y: 170, width: 600, height: 520 });
    const facts = await page.evaluate(() => {
      const L = window.WizkooLabOrbital;
      const back = [...document.querySelectorAll('.lo-layer--back .lo-node')].map(n => n.dataset.node);
      const front = [...document.querySelectorAll('.lo-layer--front .lo-node')].map(n => n.dataset.node);
      const rows = L.NODES.map(n => {
        const o = L.ORBITS.find(o => o.id === n.orbit);
        const p = L.pointAt(o, n.t);
        return { id: n.id, orbit: n.orbit, near: p.near,
                 dist: Math.round(Math.hypot(p.x - L.FRAME.cx, p.y - L.FRAME.cy)) };
      });
      return { back, front, rows, R: L.NUC_R,
               sil: document.querySelectorAll('.lo-layer--silhouette .lo-path').length,
               orbits: L.ORBITS.map(o => ({ id: o.id, rx: o.rx, ry: o.ry, rot: o.rot })) };
    });
    console.log('  nucleus radius ' + facts.R);
    facts.orbits.forEach(o => console.log('  orbit ' + o.id + '  rx ' + String(o.rx).padEnd(4) +
      ' ry ' + String(o.ry).padEnd(4) + ' rot ' + String(o.rot).padStart(3) +
      '   ry < R (crosses the body): ' + (o.ry < facts.R)));
    facts.rows.forEach(r => console.log('  ' + r.id.padEnd(9) + ' orbit ' + r.orbit +
      '  ' + (r.near ? 'FRONT ' : 'BEHIND') + '  |P-C| ' + String(r.dist).padStart(3) +
      (Math.abs(r.dist - facts.R) < 24 ? '   <- straddles the limb' : '')));
    console.log('  back layer:  ' + facts.back.join(', '));
    console.log('  front layer: ' + facts.front.join(', '));
    console.log('  silhouette paths clipped to the disc: ' + facts.sil);
    await page.context().close();
  }

  /* ── 4. reduced motion ─────────────────────────────────────────────── */
  console.log('reduced motion');
  {
    const page = await openPage(browser, { reducedMotion: 'reduce' });
    await toSection(page);
    await sleep(800);
    await shot(page, 'reduced-motion-01');
    const running = await page.evaluate(() =>
      document.getAnimations().filter(a => a.playState === 'running').length);
    await sleep(5000);
    await shot(page, 'reduced-motion-02');       /* must be pixel-identical to 01 */
    const a = fs.readFileSync(path.join(OUT, 'reduced-motion-01.png'));
    const b = fs.readFileSync(path.join(OUT, 'reduced-motion-02.png'));
    console.log('  running animations: ' + running);
    console.log('  frame at +0.8s and +5.8s identical: ' + a.equals(b));
    console.log('  arrival state: ' + await page.evaluate(() =>
      document.getElementById('orbital').getAttribute('data-arrival')));
    await page.context().close();
  }

  /* ── 5. the beat fires once and latches ────────────────────────────── */
  console.log('latch');
  {
    const page = await openPage(browser);
    await toSection(page);
    await sleep(6000);
    const before = await page.evaluate(() => document.getElementById('orbital').getAttribute('data-arrival'));
    /* scroll away and back: the observer is disconnected, so nothing re-runs */
    await page.evaluate(() => window.scrollTo(0, 0));
    await sleep(600);
    await page.evaluate(() => document.getElementById('orbital').scrollIntoView({ block: 'start' }));
    await sleep(1200);
    const after = await page.evaluate(() => ({
      state: document.getElementById('orbital').getAttribute('data-arrival'),
      observers: 0,
      /* if the beat re-ran, node opacity would be mid-animation somewhere */
      opacities: [...document.querySelectorAll('.lo-node')]
        .map(n => Number(getComputedStyle(n).opacity))
    }));
    console.log('  state before scrolling away: ' + before);
    console.log('  state after returning:       ' + after.state);
    console.log('  all six nodes still at full opacity: ' +
      after.opacities.every(o => o === 1) + '  [' + after.opacities.join(', ') + ']');
    await page.context().close();
  }

  /* ── 6. sky, weight, and honest frame timing ───────────────────────── */
  console.log('sky and cost');
  {
    const page = await openPage(browser);
    await toSection(page);
    const n = await page.evaluate(() => {
      const h = document.querySelector('[data-lab-sky]');
      return { reported: h.dataset.labSkyStars,
               dom: h.querySelectorAll('.wk-sky__star').length,
               sky: h.querySelectorAll('*').length,
               total: document.querySelectorAll('*').length,
               anims: document.getAnimations().length };
    });
    console.log('  stars reported ' + n.reported + ', in DOM ' + n.dom);
    console.log('  sky elements ' + n.sky + ', page elements ' + n.total);
    console.log('  running CSS animations: ' + n.anims);

    /* Measured, not asserted: rAF deltas over four seconds of the settled,
       ambient state in this headless Chromium. Headless software compositing
       is not the user's GPU, so this is a floor, not a promise. */
    await sleep(6500);
    const fps = await page.evaluate(() => new Promise((res) => {
      const d = []; let last = performance.now(); let n = 0;
      (function tick(t) {
        d.push(t - last); last = t;
        if (++n < 240) requestAnimationFrame(tick); else {
          const s = d.slice(1).sort((a, b) => a - b);
          res({ frames: s.length, median: +s[s.length >> 1].toFixed(2),
                p95: +s[Math.floor(s.length * 0.95)].toFixed(2),
                worst: +s[s.length - 1].toFixed(2) });
        }
      })(performance.now());
    }));
    console.log('  frame interval (ambient): median ' + fps.median + 'ms, p95 ' +
      fps.p95 + 'ms, worst ' + fps.worst + 'ms  over ' + fps.frames + ' frames');
    await page.context().close();
  }

  await browser.close();
})();
