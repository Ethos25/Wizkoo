const { chromium } = require('@playwright/test');
const { capture, diff, PROBE, ELEMENTS, STARS } = require('../tests/hero-geometry');
const URL = process.argv[2] || 'https://excellence-round-1--wizkoo.netlify.app';

/* Rule moved down: foot padding-top 1.718%->1.10% of width, bottom 3.580%->2.20%
   of height. Both reclaim band height (the foot is bottom-positioned, so a
   shorter foot AND a smaller bottom offset each push the rule down). */
const RULE_DOWN = '.lw-foot{padding-top:1.10% !important;bottom:2.20% !important}';

/* A: shift the figure down into the reclaimed space. */
const SHIFT_FN = (u) => {
  const fig = document.querySelector('.lw-figure');
  fig.style.transform = `translateY(calc(var(--u) * ${u}))`;
  const svg = fig.querySelector('svg');
  const vb = svg.getAttribute('viewBox').split(' ').map(Number);
  const figH = fig.getBoundingClientRect().height;
  const uPx = document.querySelector('.lw').getBoundingClientRect().width / 553;
  const drop = u * (vb[3] / (figH / uPx));
  const path = fig.querySelector('.wkc-tether path');
  const m = path.getAttribute('d').match(/M([\d.-]+) ([\d.-]+) L([\d.-]+) ([\d.-]+)/);
  const y1 = +m[2] - drop;
  path.setAttribute('d', `M${m[1]} ${y1} L${m[3]} ${m[4]}`);
  fig.querySelector('linearGradient[id^="wkct"]').setAttribute('y1', y1);
  const c = fig.querySelector('.wkc-tether-clip');
  c.setAttribute('y', Math.min(y1, +m[4])); c.setAttribute('height', Math.abs(+m[4] - y1));
};

/* B: widen the band so the taller box is filled by a LARGER figure, not slack. */
const GROW_FN = () => {
  const band = document.querySelector('.lw-band');
  const win = document.querySelector('.lw').getBoundingClientRect();
  const h = band.getBoundingClientRect().height;
  const need = h * (532 / 178);
  const inset = Math.max(0, (win.width - need) / 2 / win.width * 100);
  band.style.left = inset + '%'; band.style.right = inset + '%';
  window.dispatchEvent(new Event('resize'));
};

const MEASURE = () => {
  const q = (s) => document.querySelector(s), R = (s) => q(s).getBoundingClientRect();
  const W = R('.lw'), F = R('.lw-foot'), B = R('.lw-band'), G = R('.lw-figure');
  const ink = (el) => { const r = document.createRange(); r.selectNodeContents(el); return r.getBoundingClientRect(); };
  const cta = ink(q('.lw-cta'));
  const n = (v) => +Number(v).toFixed(1);
  const rule = F.top;
  const gaps = {}; let cross = [];
  q('.lw-figure').querySelectorAll('.wkc-label').forEach((e) => {
    const b = e.getBoundingClientRect(); gaps[e.dataset.label] = n(rule - b.bottom);
    if (b.bottom > rule) cross.push(e.dataset.label + ' +' + (b.bottom - rule).toFixed(1)); });
  q('.lw-figure').querySelectorAll('[data-star]').forEach((e) => {
    const b = e.getBoundingClientRect();
    if (b.bottom > rule) cross.push(e.dataset.star + '* +' + (b.bottom - rule).toFixed(1)); });
  return { ruleY: n(rule - W.top), bottomOptical: n(W.bottom - cta.bottom),
    band: [n(B.width), n(B.height)], fig: [n(G.width), n(G.height)],
    figTop: n(G.top - W.top), gapAbove: n(G.top - R('.lw-sentence').bottom),
    geo: gaps.Geography, wri: gaps.Writing, cross };
};

(async () => {
  const browser = await chromium.launch();
  const bctx = await browser.newContext(); const bp = await bctx.newPage();
  const shipped = await capture(bp, URL, 1440, 800); await bctx.close();

  const VARIANTS = [
    ['shipped', null, null],
    ['A-rule+shift', RULE_DOWN, { shift: 14 }],
    ['B-rule+grow', RULE_DOWN, { grow: true }],
  ];

  for (const [vw, vh, tag] of [[1966, 594, 'amy'], [1440, 800, 'ref']]) {
    console.log(`\n═══ ${vw} x ${vh} ═══`);
    for (const [name, css, act] of VARIANTS) {
      const ctx = await browser.newContext();
      if (css) await ctx.addInitScript((c) => { document.addEventListener('DOMContentLoaded', () => {
        const s = document.createElement('style'); s.textContent = c; document.head.appendChild(s); }); }, css);
      await ctx.addInitScript((a) => { window.__a = a; }, { act, sf: SHIFT_FN.toString(), gf: GROW_FN.toString() });
      const p = await ctx.newPage();
      await p.setViewportSize({ width: vw, height: vh });
      await p.goto(URL, { waitUntil: 'networkidle' });
      await p.waitForTimeout(4200);
      if (act) await p.evaluate(() => {
        const a = window.__a;
        if (a.act.grow) eval('(' + a.gf + ')')();
        if (a.act.shift) eval('(' + a.sf + ')')(a.act.shift);
      });
      if (act && act.grow) { await p.waitForTimeout(3000); }
      await p.waitForTimeout(400);
      const m = await p.evaluate(MEASURE);
      await p.locator('.lw').screenshot({ path: `screenshots/constellation/V-${tag}-${name}.png` });
      console.log(`  ${name.padEnd(13)} rule ${String(m.ruleY).padStart(6)}  below-CTA ${String(m.bottomOptical).padStart(5)}` +
        `  band ${(m.band[0] + 'x' + m.band[1]).padEnd(13)} figure ${(m.fig[0] + 'x' + m.fig[1]).padEnd(13)}` +
        ` gapAbove ${String(m.gapAbove).padStart(5)}  Geo->rule ${String(m.geo).padStart(6)}  Wri->rule ${String(m.wri).padStart(6)}` +
        `  ${m.cross.length ? '✗ ' + m.cross.join(',') : 'ok'}`);
      await ctx.close();
    }
  }

  console.log('\n═══ 1440x800 lock ═══');
  for (const [name, css, act] of VARIANTS) {
    const ctx = await browser.newContext();
    if (css) await ctx.addInitScript((c) => { document.addEventListener('DOMContentLoaded', () => {
      const s = document.createElement('style'); s.textContent = c; document.head.appendChild(s); }); }, css);
    await ctx.addInitScript((a) => { window.__a = a; }, { act, sf: SHIFT_FN.toString(), gf: GROW_FN.toString() });
    const p = await ctx.newPage();
    await p.setViewportSize({ width: 1440, height: 800 });
    await p.goto(URL, { waitUntil: 'networkidle' });
    await p.waitForTimeout(4200);
    if (act) await p.evaluate(() => { const a = window.__a;
      if (a.act.grow) eval('(' + a.gf + ')')(); if (a.act.shift) eval('(' + a.sf + ')')(a.act.shift); });
    if (act && act.grow) await p.waitForTimeout(3000);
    await p.waitForTimeout(400);
    const g = await p.evaluate(PROBE, { ELEMENTS, STARS });
    const moved = diff(shipped, g);
    console.log(`\n  ${name}: ${moved.length ? moved.length + ' moved' : 'PASSES'}`);
    moved.slice(0, 10).forEach((x) => console.log('      · ' + x));
    if (moved.length > 10) console.log(`      · … ${moved.length - 10} more`);
    await ctx.close();
  }
  await browser.close();
})();
