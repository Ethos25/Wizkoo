/**
 * Draw two rectangles on the live hero window and photograph the result:
 *   SAFFRON  = the band the geometry spec specifies, mapped proportionally
 *              into the shipped window (7A 44/140/532x178 of 620x376;
 *              7B 18/86/299x64 of 335x203).
 *   CYAN     = the band actually reserved in the shipped window: the gap
 *              between the bottom of the sentence and the top of the handle.
 * Also marks the x the spec's tether launches from against the x the word
 * "space" actually occupies.
 */
const { chromium } = require('@playwright/test');

const URL = process.argv[2] || 'http://localhost:3000';
const OUT = 'screenshots/constellation';

const SPEC = {
  desktop: { win: [620, 376], band: [44, 140, 532, 178], tetherX: 216, bandW: 532 },
  mobile:  { win: [335, 203], band: [18,  86, 299,  64], tetherX: 110, bandW: 299 },
};

(async () => {
  const b = await chromium.launch();
  for (const [key, vp] of [['desktop', [1440, 900]], ['mobile', [375, 667]]]) {
    const p = await b.newPage();
    await p.setViewportSize({ width: vp[0], height: vp[1] });
    await p.goto(URL, { waitUntil: 'networkidle' });
    const report = await p.evaluate((S) => {
      const win = document.querySelector('.lw');
      const sent = document.querySelector('.lw-sentence');
      const foot = document.querySelector('.lw-foot');
      const theme = document.querySelector('.lw-theme');
      const W = win.getBoundingClientRect();
      const S_ = sent.getBoundingClientRect();
      const F = foot.getBoundingClientRect();
      const T = theme.getBoundingClientRect();

      const add = (css) => {
        const d = document.createElement('div');
        d.style.cssText = 'position:absolute;pointer-events:none;z-index:99;' + css;
        win.appendChild(d);
        return d;
      };
      // spec band, proportionally mapped
      const fx = (v) => (v / S.win[0] * 100).toFixed(3) + '%';
      const fy = (v) => (v / S.win[1] * 100).toFixed(3) + '%';
      add(`left:${fx(S.band[0])};top:${fy(S.band[1])};width:${fx(S.band[2])};height:${fy(S.band[3])};`
        + 'outline:1.5px solid #E8AF38;background:rgba(232,175,56,0.10)');
      // actual reserved gap
      const gx = (S_.left - W.left), gw = S_.width;
      add(`left:${(gx / W.width * 100).toFixed(3)}%;top:${((S_.bottom - W.top) / W.height * 100).toFixed(3)}%;`
        + `width:${(gw / W.width * 100).toFixed(3)}%;height:${((F.top - S_.bottom) / W.height * 100).toFixed(3)}%;`
        + 'outline:1.5px solid #4DD0E1;background:rgba(77,208,225,0.12)');
      // spec tether launch x (vertical tick) vs actual "space" centre x
      const specTetherWinX = (S.band[0] + S.tetherX / S.bandW * S.band[2]) / S.win[0] * 100;
      add(`left:${specTetherWinX.toFixed(3)}%;top:0;width:1.5px;height:100%;background:#E8AF38`);
      const themeX = (T.left + T.width / 2 - W.left) / W.width * 100;
      add(`left:${themeX.toFixed(3)}%;top:0;width:1.5px;height:100%;background:#4DD0E1`);

      return {
        winPx: [+W.width.toFixed(2), +W.height.toFixed(2)],
        specBandPx: [+(S.band[2] / S.win[0] * W.width).toFixed(2), +(S.band[3] / S.win[1] * W.height).toFixed(2)],
        actualBandPx: [+gw.toFixed(2), +(F.top - S_.bottom).toFixed(2)],
        specTetherXpct: +specTetherWinX.toFixed(2),
        themeXpct: +themeX.toFixed(2),
      };
    }, SPEC[key]);

    console.log(key, JSON.stringify(report));
    await p.locator('.lw-mount').screenshot({ path: `${OUT}/band-conflict-${key}.png` });
    await p.close();
  }
  await b.close();
})();
