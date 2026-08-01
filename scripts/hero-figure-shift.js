/**
 * PROTOTYPE — renders only, writes nothing to the site.
 * Shifts the whole constellation down within the window by N --u, lengthening
 * the tether so it still reaches from the word "space" to the theme star.
 *
 * The tether is the only thing that changes shape. Its start is pinned in
 * WINDOW space (under the word), its end rides down with the theme star, so
 * its y1 in figure user-units becomes  -12 - shift_u * (178 / figureHeight_u).
 *
 * Also reports, per offset: what crosses the handle rule, and exactly what the
 * 1440x800 geometry lock would say.
 */
const { chromium } = require('@playwright/test');
const { capture, diff } = require('../tests/hero-geometry');

const URL = process.argv[2] || 'https://excellence-round-1--wizkoo.netlify.app';
const OFFSETS = [0, 15, 25, 35];
const OUT = 'screenshots/constellation';

/* Applied after the figure is built. Translates the figure and re-cuts the
   tether so it spans the new distance. */
const SHIFT = (u) => {
  const fig = document.querySelector('.lw-figure');
  if (!fig || !u) return;
  fig.style.transform = `translateY(calc(var(--u) * ${u}))`;

  const svg = fig.querySelector('svg');
  const vb = svg.getAttribute('viewBox').split(' ').map(Number);   /* 0 0 W H */
  const figH = fig.getBoundingClientRect().height;
  const uPx = document.querySelector('.lw').getBoundingClientRect().width / 553;
  /* how many figure user-units one --u is worth */
  const perU = vb[3] / (figH / uPx);
  const drop = u * perU;

  const path = fig.querySelector('.wkc-tether path');
  const m = path.getAttribute('d').match(/M([\d.-]+) ([\d.-]+) L([\d.-]+) ([\d.-]+)/);
  const x1 = +m[1], y1 = +m[2] - drop, x2 = +m[3], y2 = +m[4];
  path.setAttribute('d', `M${x1} ${y1} L${x2} ${y2}`);

  const g = fig.querySelector('linearGradient[id^="wkct"]');
  g.setAttribute('y1', y1);
  const clip = fig.querySelector('.wkc-tether-clip');
  clip.setAttribute('y', Math.min(y1, y2));
  clip.setAttribute('height', Math.abs(y2 - y1));
  clip.style.transformOrigin = clip.getAttribute('x') + 'px ' + Math.min(y1, y2) + 'px';
};

const MEASURE = () => {
  const q = (s) => document.querySelector(s);
  const W = q('.lw').getBoundingClientRect();
  const F = q('.lw-figure').getBoundingClientRect();
  const rule = q('.lw-foot').getBoundingClientRect().top;
  const sent = q('.lw-sentence').getBoundingClientRect();
  const r2 = (v) => +Number(v).toFixed(1);

  const crossing = [];
  let lowest = null;
  q('.lw-figure').querySelectorAll('.wkc-label').forEach((e) => {
    const b = e.getBoundingClientRect();
    if (!lowest || b.bottom > lowest.b) lowest = { k: e.dataset.label, b: b.bottom };
    if (b.bottom > rule) crossing.push(`${e.dataset.label} label +${(b.bottom - rule).toFixed(1)}`);
  });
  q('.lw-figure').querySelectorAll('[data-star]').forEach((e) => {
    const b = e.getBoundingClientRect();
    if (b.bottom > rule) crossing.push(`${e.dataset.star} star +${(b.bottom - rule).toFixed(1)}`);
  });

  const tp = q('.lw-figure .wkc-tether path');
  const tb = tp ? tp.getBoundingClientRect() : null;

  return {
    figTop: r2(F.top - W.top), figBottom: r2(F.bottom - W.top),
    ruleY: r2(rule - W.top),
    sentBottom: r2(sent.bottom - W.top),
    gapAboveFigure: r2(F.top - sent.bottom),
    lowestLabel: lowest.k, lowestToRule: r2(rule - lowest.b),
    crossing,
    tetherTop: tb ? r2(tb.top - W.top) : null,
    tetherLen: tb ? r2(tb.height) : null,
    tetherAboveSentence: tb ? tb.top < sent.bottom - 2 : null,
  };
};

(async () => {
  const browser = await chromium.launch();

  /* the shipped baseline the lock compares against */
  const baseCtx = await browser.newContext();
  const basePage = await baseCtx.newPage();
  const shippedGeom = await capture(basePage, URL, 1440, 800);
  await baseCtx.close();

  for (const [vw, vh, tag] of [[1966, 594, 'amy'], [1440, 800, 'ref']]) {
    console.log(`\n═══ ${vw} x ${vh} ═══`);
    for (const off of OFFSETS) {
      const ctx = await browser.newContext();
      await ctx.addInitScript((args) => {
        window.__shift = args.u;
        window.__shiftFn = args.fn;
      }, { u: off, fn: SHIFT.toString() });
      const p = await ctx.newPage();
      await p.setViewportSize({ width: vw, height: vh });
      await p.goto(URL, { waitUntil: 'networkidle' });
      await p.waitForTimeout(4200);
      await p.evaluate(() => {
        // eslint-disable-next-line no-eval
        const fn = eval('(' + window.__shiftFn + ')');
        fn(window.__shift);
      });
      await p.waitForTimeout(300);
      const m = await p.evaluate(MEASURE);
      await p.locator('.lw').screenshot({ path: `${OUT}/SHIFT-${tag}-${String(off).padStart(2, '0')}u.png` });
      console.log(
        `  ${String(off).padStart(2)}u  figure ${String(m.figTop).padStart(5)}..${String(m.figBottom).padStart(5)}` +
        `  gap above ${String(m.gapAboveFigure).padStart(5)}` +
        `  ${m.lowestLabel}->rule ${String(m.lowestToRule).padStart(6)}` +
        `  tether len ${String(m.tetherLen).padStart(5)}` +
        `  ${m.crossing.length ? '✗ CROSSES RULE: ' + m.crossing.join(', ') : 'ok'}`
      );
      await ctx.close();
    }
  }

  console.log('\n═══ what the 1440x800 lock reports at each offset ═══');
  for (const off of OFFSETS) {
    const ctx = await browser.newContext();
    await ctx.addInitScript((args) => {
      window.__shift = args.u; window.__shiftFn = args.fn;
    }, { u: off, fn: SHIFT.toString() });
    const p = await ctx.newPage();
    await p.setViewportSize({ width: 1440, height: 800 });
    await p.goto(URL, { waitUntil: 'networkidle' });
    await p.waitForTimeout(4200);
    await p.evaluate(() => { const fn = eval('(' + window.__shiftFn + ')'); fn(window.__shift); });
    await p.waitForTimeout(300);
    const geom = await p.evaluate(require('../tests/hero-geometry').PROBE, {
      ELEMENTS: require('../tests/hero-geometry').ELEMENTS,
      STARS: require('../tests/hero-geometry').STARS,
    });
    const moved = diff(shippedGeom, geom);
    console.log(`\n  ${off}u  ->  ${moved.length ? moved.length + ' value(s) moved' : 'PASSES, nothing moved'}`);
    moved.slice(0, 8).forEach((x) => console.log('        · ' + x));
    if (moved.length > 8) console.log(`        · … and ${moved.length - 8} more`);
    await ctx.close();
  }
  await browser.close();
})();
