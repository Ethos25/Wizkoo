/**
 * Probe for the figure-centering task: measures the air above and below the
 * figure's INK (stars + labels, not the reserved band box) between the
 * sentence's bottom edge and the handle rule, and reports the tether's
 * rendered endpoints. Screenshot of the window alongside.
 *
 *   node scripts/fig-center-probe.js http://localhost:3000 1966 594 out.png
 */
const { chromium } = require('@playwright/test');

(async () => {
  const [url = 'http://localhost:3000', w = '1966', h = '594', out] = process.argv.slice(2);
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.setViewportSize({ width: +w, height: +h });
  await p.goto(url, { waitUntil: 'networkidle' });
  await p.evaluate(() => (document.fonts ? document.fonts.ready : null));
  await p.waitForTimeout(4200);

  const m = await p.evaluate(() => {
    const r = (s) => document.querySelector(s).getBoundingClientRect();
    const round = (v) => +v.toFixed(2);
    const lw = r('.lw'), sent = r('.lw-sentence'), foot = r('.lw-foot');
    const fig = r('.lw-figure'), band = r('.lw-band');
    const ruleTop = foot.top - 1; /* ::before sits at top:-1px */

    let inkTop = Infinity, inkBot = -Infinity;
    document.querySelectorAll('.lw-figure .wkc-star, .lw-figure .wkc-label').forEach((el) => {
      const q = el.getBoundingClientRect();
      inkTop = Math.min(inkTop, q.top);
      inkBot = Math.max(inkBot, q.bottom);
    });

    const tether = document.querySelector('.lw-figure .wkc-tether path');
    let tetherD = null;
    if (tether) {
      const d = tether.getAttribute('d');
      const box = tether.getBoundingClientRect();
      tetherD = { d, top: round(box.top - lw.top), bottom: round(box.bottom - lw.top),
                  left: round(box.left - lw.left), right: round(box.right - lw.left) };
    }
    const theme = r('.lw-theme');
    const star = document.querySelector('[data-star="space"]').getBoundingClientRect();

    return {
      variant: document.querySelector('.lw-band').getAttribute('data-size'),
      window: { w: round(lw.width), h: round(lw.height) },
      sentenceBottom: round(sent.bottom - lw.top),
      ruleTop: round(ruleTop - lw.top),
      gap: round(ruleTop - sent.bottom),
      band: { top: round(band.top - lw.top), h: round(band.height) },
      figure: { top: round(fig.top - lw.top), h: round(fig.height), w: round(fig.width) },
      inkTop: round(inkTop - lw.top), inkBottom: round(inkBot - lw.top),
      airAbove: round(inkTop - sent.bottom),
      airBelow: round(ruleTop - inkBot),
      theme: { cx: round(theme.left + theme.width / 2 - lw.left), bottom: round(theme.bottom - lw.top) },
      spaceStar: { cx: round(star.left + star.width / 2 - lw.left), cy: round(star.top + star.height / 2 - lw.top) },
      tether: tetherD,
    };
  });
  console.log(JSON.stringify(m, null, 2));

  if (out) {
    const lw = await p.$('.lw-mount');
    await lw.screenshot({ path: out });
  }
  await b.close();
})();
