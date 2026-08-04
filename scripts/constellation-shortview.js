/**
 * DIAGNOSTIC ONLY — changes nothing on disk or on the deployed site.
 * Renders the whole first viewport across the real desktop range, and reports
 * what the short-viewport scaling costs: which hero elements shrink, and what
 * sits below the fold.
 * The "7A forced" render overrides --u IN THE PAGE ONLY, at screenshot time.
 */
const { chromium } = require('@playwright/test');

const URL = process.argv[2] || 'https://excellence-round-1--wizkoo.netlify.app';
const OUT = 'screenshots/constellation';

const VIEWS = [
  [1920, 1080, 'A-1920x1080'],
  [1966,  594, 'B-1966x594-AMY'],
  [1512,  700, 'C-1512x700'],
  [1440,  800, 'D-1440x800'],
  [1280,  650, 'E-1280x650'],
];

const REPORT = () => {
  const q = (s) => document.querySelector(s);
  const r = (s) => { const e = q(s); return e ? e.getBoundingClientRect() : null; };
  const px = (s) => { const e = q(s); return e ? +parseFloat(getComputedStyle(e).fontSize).toFixed(1) : null; };
  const W = r('.lw'), hh = r('.hh');
  const vh = window.innerHeight;
  const below = [];
  [['eyebrow', '.hh-eyebrow'], ['arrest', '.hh-arrest'], ['answer', '.hh-answer'],
   ['support', '.hh-support'], ['whisper', '.hh-whisper'], ['window', '.lw'],
   ['handle', '.lw-cta']].forEach(([n, sel]) => {
    const bb = r(sel); if (!bb) return;
    if (bb.bottom > vh + 0.5) below.push(n + ' +' + Math.round(bb.bottom - vh));
  });
  const fig = r('.lw-figure');
  return {
    u: +(W.width / 553).toFixed(4),
    heroH: +hh.height.toFixed(1), vh,
    win: [+W.width.toFixed(1), +W.height.toFixed(1)],
    winPctW: +(W.width / window.innerWidth * 100).toFixed(1),
    figure: fig ? [+fig.width.toFixed(1), +fig.height.toFixed(1)] : null,
    size: q('.lw-band') ? q('.lw-band').getAttribute('data-size') : null,
    type: { arrest: px('.hh-arrest'), support: px('.hh-support'),
            sentence: px('.lw-sentence'), cta: px('.lw-cta') },
    belowFold: below,
  };
};

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();

  console.log('vp            --u    window        win%vpW  figure        fig  arrest support sent  cta   below fold');
  console.log('─'.repeat(118));
  for (const [w, h, name] of VIEWS) {
    await p.setViewportSize({ width: w, height: h });
    await p.goto(URL, { waitUntil: 'networkidle' });
    await p.waitForTimeout(3600);
    const m = await p.evaluate(REPORT);
    await p.screenshot({ path: `${OUT}/SV-${name}.png` });
    console.log(
      `${(w + 'x' + h).padEnd(13)} ${m.u.toFixed(3)}  ${(m.win[0] + 'x' + m.win[1]).padEnd(13)} ` +
      `${String(m.winPctW).padStart(5)}%  ${(m.figure ? m.figure[0] + 'x' + m.figure[1] : '-').padEnd(13)} ` +
      `${(m.size === 'desktop' ? '7A' : '7B').padEnd(4)} ` +
      `${String(m.type.arrest).padStart(5)} ${String(m.type.support).padStart(6)} ` +
      `${String(m.type.sentence).padStart(5)} ${String(m.type.cta).padStart(5)}  ` +
      `${m.belowFold.length ? m.belowFold.join(', ') : '(nothing)'}`
    );
  }

  // ── item 4: what 7A at its own reference would require ──
  // band 532 wide -> window 532/0.83364 = 638.15 -> u = 638.15/553 = 1.1540
  const U7A = 638.15 / 553;
  console.log(`\n7A at its own 532x178 reference needs window ${638.15.toFixed(1)} x ${(638.15/1.65).toFixed(1)}` +
              `  (--u = ${U7A.toFixed(4)}, i.e. viewport height ${(82 + U7A*718).toFixed(0)}px)`);

  for (const [label, u] of [['FORCED-7A-ref', U7A], ['FORCED-7A-min', 0.9161]]) {
    await p.setViewportSize({ width: 1966, height: 594 });
    await p.goto(URL, { waitUntil: 'networkidle' });
    await p.addStyleTag({ content: `.hh{--u:${u}px !important}` });
    await p.waitForTimeout(3600);
    const m = await p.evaluate(REPORT);
    await p.screenshot({ path: `${OUT}/SV-F-${label}.png` });
    console.log(
      `${('1966x594 ' + label).padEnd(28)} u=${m.u.toFixed(3)}  win ${m.win[0]}x${m.win[1]}  ` +
      `fig ${m.figure ? m.figure[0] + 'x' + m.figure[1] : '-'} ${m.size === 'desktop' ? '7A' : '7B'}  ` +
      `hero ${m.heroH} vs vh ${m.vh}  below fold: ${m.belowFold.length ? m.belowFold.join(', ') : '(nothing)'}`
    );
  }
  await b.close();
})();
