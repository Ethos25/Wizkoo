/**
 * Record the arrival beat and the ambient state.
 *
 *   record  — frames through the beat at both sizes, plus a filmstrip of the
 *             causal moments (origin alone / hop 1 travelling / hop 1 lit /
 *             hop 2 travelling / all lit / labels / tether / settled).
 *   ambient — samples every star's composited opacity over 60s of settled
 *             state and reports whether any two ever pulse together.
 *   reduced — the prefers-reduced-motion render.
 */
const { chromium } = require('@playwright/test');
const fs = require('fs');

const BASE = process.argv[3] || 'http://localhost:3000';
const MODE = process.argv[2] || 'record';
const OUT = 'screenshots/constellation';
const URL = `${BASE}/lab/constellation.html`;

const openLab = async (b, opts = {}) => {
  const ctx = await b.newContext(opts);
  const p = await ctx.newPage();
  await p.setViewportSize({ width: 1100, height: 900 });
  await p.goto(URL, { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: '.lc-panel{display:none!important}' });
  return p;
};

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();

  if (MODE === 'reduced') {
    const p = await openLab(b, { reducedMotion: 'reduce' });
    await p.evaluate(() => document.getElementById('stage').scrollIntoView());
    await p.waitForTimeout(900);
    for (const [i, el] of (await p.$$('.lc-win')).entries()) {
      await el.screenshot({ path: `${OUT}/reduced-${i ? 'mobile' : 'desktop'}.png` });
    }
    const state = await p.evaluate(() => {
      const out = {};
      document.querySelectorAll('.lc-win').forEach((w, i) => {
        const band = w.querySelector('.wkc-band');
        const star = band.querySelector('[data-star="Geography"]');
        const arm = band.querySelector('.wkc-arm path');
        out[i ? 'mobile' : 'desktop'] = {
          bandClass: band.className,
          starAnimation: getComputedStyle(star).animationName,
          ignOpacity: getComputedStyle(star.querySelector('.wkc-ign')).opacity,
          starOpacity: getComputedStyle(star).opacity,
          armDashoffset: getComputedStyle(arm).strokeDashoffset,
          labelOpacity: getComputedStyle(band.querySelector('[data-label]')).opacity,
        };
      });
      return out;
    });
    console.log(JSON.stringify(state, null, 2));
    await b.close(); return;
  }

  if (MODE === 'ambient') {
    const p = await openLab(b);
    await p.evaluate(() => document.getElementById('stage').scrollIntoView());
    await p.waitForTimeout(3200);                       /* let the beat settle */
    console.log('sampling 60s of settled state at 20Hz…');
    const series = await p.evaluate(async () => {
      const band = document.querySelector('.lc-win--a .wkc-band');
      const stars = [...band.querySelectorAll('[data-star]')];
      const names = stars.map((s) => s.dataset.star);
      const rows = [];
      const t0 = performance.now();
      while (performance.now() - t0 < 60000) {
        rows.push(stars.map((s) => +Number(getComputedStyle(s).opacity).toFixed(4)));
        await new Promise((r) => setTimeout(r, 50));
      }
      return { names, rows, running: band.className };
    });
    const { names, rows } = series;
    console.log('band class at sample time:', series.running || '(none — settled)');
    const n = names.length;
    // range per star
    console.log('\nstar          min    max    mean');
    for (let i = 0; i < n; i++) {
      const col = rows.map((r) => r[i]);
      const mn = Math.min(...col), mx = Math.max(...col);
      const mu = col.reduce((a, c) => a + c, 0) / col.length;
      console.log(`${names[i].padEnd(12)} ${mn.toFixed(3)}  ${mx.toFixed(3)}  ${mu.toFixed(3)}`);
    }
    // pairwise: correlation, and the closest the pair ever gets to moving together
    console.log('\npair                          corr   max |Δopacity| over run');
    let worst = { c: -1 };
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      const a = rows.map((r) => r[i]), c = rows.map((r) => r[j]);
      const ma = a.reduce((x, y) => x + y) / a.length, mc = c.reduce((x, y) => x + y) / c.length;
      let num = 0, da = 0, dc = 0, sameDir = 0;
      for (let k = 1; k < a.length; k++) {
        num += (a[k] - ma) * (c[k] - mc); da += (a[k] - ma) ** 2; dc += (c[k] - mc) ** 2;
        if (Math.sign(a[k] - a[k - 1]) === Math.sign(c[k] - c[k - 1])) sameDir++;
      }
      const corr = num / Math.sqrt(da * dc);
      const spread = Math.max(...a.map((v, k) => Math.abs(v - c[k])));
      console.log(`${(names[i] + ' / ' + names[j]).padEnd(28)} ${corr.toFixed(3).padStart(6)}   ${spread.toFixed(3)}  (same-direction ${(sameDir / (a.length - 1) * 100).toFixed(0)}%)`);
      if (corr > worst.c) worst = { c: corr, pair: names[i] + ' / ' + names[j] };
    }
    console.log(`\nhighest correlation anywhere: ${worst.pair} at ${worst.c.toFixed(3)}`);
    await b.close(); return;
  }

  /* ── record: frames through the beat ── */
  const MARKS = [
    [0,    'a-t0000-armed'],
    [260,  'b-t0260-origin-igniting-alone'],
    [560,  'c-t0560-origin-lit-arms-travelling'],
    [790,  'd-t0790-hop1-arriving'],
    [1050, 'e-t1050-hop1-lit-labels-following'],
    [1300, 'f-t1300-hop2-travelling'],
    [1480, 'g-t1480-hop2-arriving'],
    [1760, 'h-t1760-all-lit-labels-resolving'],
    [2200, 'i-t2200-tether-drawing'],
    [2760, 'j-t2760-settled'],
  ];
  const p = await openLab(b);
  // Freeze the beat at each mark by driving it from a known start.
  for (const [t, name] of MARKS) {
    await p.evaluate(() => {
      window.__lcHandles.forEach((h) => h.reset());
    });
    await p.waitForTimeout(80);
    await p.evaluate(() => { window.__lcHandles.forEach((h) => h.play()); });
    await p.waitForTimeout(t);
    for (const [i, el] of (await p.$$('.lc-win')).entries()) {
      await el.screenshot({ path: `${OUT}/beat-${i ? 'mobile' : 'desktop'}-${name}.png` });
    }
  }
  console.log(`wrote ${MARKS.length * 2} frames to ${OUT}/`);
  await b.close();
})();
