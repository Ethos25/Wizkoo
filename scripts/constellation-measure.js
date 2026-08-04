/**
 * Measure the live hero window's reserved band: the gap between the bottom of
 * the sentence and the top of the handle rule, at every target viewport.
 * Reports the band as a fraction of the window box, which is the only form
 * the constellation's percent-positioned geometry cares about.
 */
const { chromium } = require('@playwright/test');

const URL = process.argv[2] || 'http://localhost:3000';
const VIEWPORTS = [
  [1440, 900], [1440, 800], [1440, 396], [1024, 768], [768, 1024], [390, 844], [375, 667],
];

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  for (const [w, h] of VIEWPORTS) {
    await p.setViewportSize({ width: w, height: h });
    await p.goto(URL, { waitUntil: 'networkidle' });
    const m = await p.evaluate(() => {
      const win = document.querySelector('.lw');
      const sent = document.querySelector('.lw-sentence');
      const foot = document.querySelector('.lw-foot');
      const body = document.querySelector('.lw-body');
      if (!win) return null;
      const W = win.getBoundingClientRect(), S = sent.getBoundingClientRect(),
            F = foot.getBoundingClientRect(), B = body.getBoundingClientRect();
      const u = parseFloat(getComputedStyle(document.querySelector('.hh')).getPropertyValue('--u'));
      const themeEl = document.querySelector('.lw-theme');
      const T = themeEl.getBoundingClientRect();
      return {
        u,
        win: [+W.width.toFixed(2), +W.height.toFixed(2)],
        aspect: +(W.width / W.height).toFixed(4),
        sideInset: +(B.left - W.left).toFixed(2),
        sentBottom: +(S.bottom - W.top).toFixed(2),
        footTop: +(F.top - W.top).toFixed(2),
        gapPx: +(F.top - S.bottom).toFixed(2),
        sentLines: Math.round(S.height / parseFloat(getComputedStyle(sent).lineHeight)),
        themeCentreX: +(T.left + T.width / 2 - W.left).toFixed(2),
        themeBottom: +(T.bottom - W.top).toFixed(2),
      };
    });
    if (!m) { console.log(`${w}x${h}: no window`); continue; }
    const [WW, WH] = m.win;
    console.log(
      `${String(w).padStart(4)}x${String(h).padEnd(4)} u=${m.u.toFixed(3)} ` +
      `win=${WW}x${WH} (${m.aspect}) inset=${m.sideInset} ` +
      `sentBottom=${m.sentBottom} (${(m.sentBottom / WH * 100).toFixed(2)}%) ` +
      `footTop=${m.footTop} (${(m.footTop / WH * 100).toFixed(2)}%) ` +
      `gap=${m.gapPx} (${(m.gapPx / WH * 100).toFixed(2)}%) lines=${m.sentLines} ` +
      `themeX=${m.themeCentreX} (${(m.themeCentreX / WW * 100).toFixed(2)}%) ` +
      `themeBottom=${m.themeBottom} (${(m.themeBottom / WH * 100).toFixed(2)}%)`
    );
  }
  await b.close();
})();
