/**
 * The full viewport matrix, after the 7B routing.
 * For each: which figure was chosen and why, the band against that figure's own
 * reference, and the two clearances that actually decide it —
 *   · lowest LABEL bottom  -> the handle rule
 *   · highest label/star top -> the sentence's baseline box
 * plus the tether's rendered run, so the whisper can be checked at every size.
 */
const { chromium } = require('@playwright/test');

const URL = process.argv[2] || 'http://localhost:3000';
const THRESHOLD = Math.sqrt(532 * 299);
const REF = { desktop: [532, 178], mobile: [299, 64] };

const VIEWPORTS = [
  [1920, 1080], [1600, 900], [1440, 900], [1440, 800], [1440, 396],
  [1280, 720], [1200, 900], [1024, 768], [900, 700], [820, 1180],
  [768, 1024], [600, 900], [430, 932], [414, 896], [390, 844], [375, 667], [360, 640],
];

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  let bad = 0;
  console.log(`threshold: band width >= ${THRESHOLD.toFixed(2)}px -> 7A, else 7B\n`);
  console.log('viewport      window        band            fig  ×ref   label→rule  fig→sentence  tether  ');
  console.log('─'.repeat(104));
  for (const [vw, vh] of VIEWPORTS) {
    await p.setViewportSize({ width: vw, height: vh });
    await p.goto(URL, { waitUntil: 'networkidle' });
    await p.waitForTimeout(3400);
    const m = await p.evaluate(() => {
      const q = (s) => document.querySelector(s);
      const W = q('.lw').getBoundingClientRect();
      const band = q('.lw-band');
      const Bd = q('.lw-figure').getBoundingClientRect();   /* the figure, not the box */
      const S = q('.lw-sentence').getBoundingClientRect();
      const F = q('.lw-foot').getBoundingClientRect();
      let labBot = -1e9, labTop = 1e9, starTop = 1e9;
      band.querySelectorAll('.wkc-label').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom > labBot) labBot = r.bottom;
        if (r.top < labTop) labTop = r.top;
      });
      band.querySelectorAll('[data-star]').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < starTop) starTop = r.top;
      });
      const tp = band.querySelector('.wkc-tether path');
      let run = null, drop = null;
      if (tp) {
        const d = tp.getAttribute('d').match(/M([\d.-]+) ([\d.-]+) L([\d.-]+) ([\d.-]+)/);
        run = Math.abs(+d[3] - +d[1]); drop = Math.abs(+d[4] - +d[2]);
      }
      return {
        win: [+W.width.toFixed(1), +W.height.toFixed(1)],
        band: [+Bd.width.toFixed(1), +Bd.height.toFixed(1)],
        size: band.getAttribute('data-size'),
        stars: band.querySelectorAll('[data-star]').length,
        arms: band.querySelectorAll('.wkc-arm').length,
        labelToRule: +(F.top - labBot).toFixed(2),
        figToSentence: +(Math.min(labTop, starTop) - S.bottom).toFixed(2),
        run: run == null ? null : +run.toFixed(1),
        drop: drop == null ? null : +drop.toFixed(1),
      };
    });
    const ref = REF[m.size];
    const ratio = (m.band[0] / ref[0]).toFixed(3);
    const ok = m.labelToRule >= 2 && m.figToSentence >= -1 && m.stars === 7 && m.arms === 7;
    if (!ok) bad++;
    console.log(
      `${(vw + 'x' + vh).padEnd(13)}${(m.win[0] + 'x' + m.win[1]).padEnd(14)}` +
      `${(m.band[0] + 'x' + m.band[1]).padEnd(16)}${(m.size === 'desktop' ? '7A' : '7B').padEnd(5)}` +
      `${ratio.padStart(5)}  ${String(m.labelToRule).padStart(9)}  ${String(m.figToSentence).padStart(11)}` +
      `   ${String(m.run).padStart(5)}/${m.drop}${ok ? '' : '   ← FAIL'}`
    );
  }
  console.log('─'.repeat(104));
  console.log(bad === 0 ? '✓ every viewport clears' : `✗ ${bad} viewport(s) fail`);
  await b.close();
  process.exit(bad === 0 ? 0 : 1);
})();
