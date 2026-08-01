/**
 * Render the constellation at candidate vertical positions for Amy to pick by
 * eye. Each position is a fraction of the sentence→rule gap given up as air
 * above the figure (window.__wkcFigShift, read by js/hero-constellation.js).
 *
 *   node scripts/fig-center-render.js http://localhost:3000
 *
 * Writes screenshots/figpos/pos-<q>-<WxH>.png and prints the measured air.
 */
const { chromium } = require('@playwright/test');

const URL = process.argv[2] || 'http://localhost:3000';
const VIEWPORTS = [[1966, 594], [1440, 800]];
const POSITIONS = (process.argv[3] ? process.argv[3].split(',').map(Number) : [0.06, 0.12, 0.18]);

(async () => {
  const b = await chromium.launch();
  for (const [w, h] of VIEWPORTS) {
    for (const q of POSITIONS) {
      const p = await b.newPage({ deviceScaleFactor: 2 });
      await p.addInitScript((v) => { window.__wkcFigShift = v; }, q);
      await p.setViewportSize({ width: w, height: h });
      await p.goto(URL, { waitUntil: 'networkidle' });
      await p.evaluate(() => (document.fonts ? document.fonts.ready : null));
      await p.waitForTimeout(4200);

      const m = await p.evaluate(() => {
        const r = (s) => document.querySelector(s).getBoundingClientRect();
        const round = (v) => +v.toFixed(1);
        const lw = r('.lw'), sent = r('.lw-sentence'), foot = r('.lw-foot');
        const fig = r('.lw-figure');
        const ruleTop = foot.top - 1;
        let inkTop = Infinity, inkBot = -Infinity;
        document.querySelectorAll('.lw-figure .wkc-star, .lw-figure .wkc-label').forEach((el) => {
          const q2 = el.getBoundingClientRect();
          inkTop = Math.min(inkTop, q2.top);
          inkBot = Math.max(inkBot, q2.bottom);
        });
        const star = document.querySelector('[data-star="space"]').getBoundingClientRect();
        const tp = document.querySelector('.wkc-tether path');
        return {
          variant: document.querySelector('.lw-band').getAttribute('data-size'),
          figure: `${round(fig.width)}x${round(fig.height)}`,
          starDepth: round(star.top + star.height / 2 - sent.bottom),
          airAbove: round(inkTop - sent.bottom),
          airBelow: round(ruleTop - inkBot),
          tether: tp ? tp.getAttribute('d') : 'MISSING',
        };
      });
      console.log(`${w}x${h}  q=${q}  ${m.variant}  fig ${m.figure}  ` +
        `star ${m.starDepth}px below sentence  ink air ${m.airAbove}/${m.airBelow}  tether ${m.tether}`);

      const mount = await p.$('.lw-mount');
      await mount.screenshot({ path: `screenshots/figpos/pos-${q}-${w}x${h}.png` });
      await p.close();
    }
  }
  await b.close();
})();
