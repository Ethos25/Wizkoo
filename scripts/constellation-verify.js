/**
 * Verify the built figure against the geometry spec's OWN render.
 *
 *  1. Screenshots the spec's reference render (docs/constellation-geometry.html)
 *     and the lab's render (lab/constellation.html) at both sizes, cropped to
 *     the window, and stacks them for a side-by-side.
 *  2. Diffs the two DOM trees value-for-value: every star's position, radius,
 *     fill, box-shadow, scintillation period/delay/--dim; every arm's trimmed
 *     endpoints and gradient stops; the tether; every label's size, colour and
 *     anchor. Reports any disagreement.
 */
const { chromium } = require('@playwright/test');
const fs = require('fs');

const BASE = process.argv[2] || 'http://localhost:3000';
const OUT = 'screenshots/constellation';

/* Read the figure out of whichever page is loaded, in a form both can produce. */
const PROBE = () => {
  const round = (v, n = 3) => +Number(v).toFixed(n);
  const norm = (s) => String(s || '').replace(/\s+/g, ' ').trim();

  const readWindow = (win, band, svg) => {
    const B = band.getBoundingClientRect();
    const stars = {}, labels = {};
    band.querySelectorAll('[data-star]').forEach((el) => {
      const k = el.dataset.star;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      // The reference paints one element; the lab splits the shadow across two.
      const core = el.querySelector('.wkc-core') || el;
      const halo = el.querySelector('.wkc-halo');
      const ccs = getComputedStyle(core);
      stars[k] = {
        x: round((r.left + r.width / 2 - B.left) / B.width * 100, 3),
        y: round((r.top + r.height / 2 - B.top) / B.height * 100, 3),
        d: round(r.width, 2),
        bg: norm(ccs.backgroundColor),
        shadow: norm(ccs.boxShadow) + (halo ? ' | ' + norm(getComputedStyle(halo).boxShadow) : ''),
        dim: norm(cs.getPropertyValue('--dim')),
        anim: norm(cs.animationDuration) + ' / ' + norm(cs.animationDelay),
      };
    });
    // Lab labels carry data-label; the spec's are plain divs holding the name.
    const NAMES = ['Reading', 'Math', 'Science', 'Writing', 'Art', 'Geography'];
    band.querySelectorAll(':scope > *').forEach((el) => {
      if (el.hasAttribute('data-star') || el.tagName.toLowerCase() === 'svg') return;
      const k = el.dataset.label || el.textContent.trim();
      if (!NAMES.includes(k)) return;
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      labels[k] = {
        x: round((r.left - B.left) / B.width * 100, 3),
        y: round((r.top - B.top) / B.height * 100, 3),
        size: norm(cs.fontSize), color: norm(cs.color),
        tracking: norm(cs.letterSpacing),
      };
    });
    const arms = [];
    svg.querySelectorAll('path').forEach((p) => {
      const grad = p.getAttribute('stroke') || '';
      const id = (grad.match(/#(.+)\)/) || [])[1];
      const g = id && svg.querySelector('#' + CSS.escape(id));
      arms.push({
        d: norm(p.getAttribute('d')),
        w: norm(p.getAttribute('stroke-width')),
        op: p.getAttribute('opacity') || '1',
        dash: norm(p.getAttribute('stroke-dasharray')),
        stops: g ? [...g.querySelectorAll('stop')].map(
          (s) => s.getAttribute('offset') + ' ' + norm(s.getAttribute('stop-color'))).join(' · ') : '',
        gx: g ? [g.getAttribute('x1'), g.getAttribute('y1'), g.getAttribute('x2'), g.getAttribute('y2')]
              .map((v) => round(v, 2)).join(',') : '',
      });
    });
    return { band: [round(B.width, 2), round(B.height, 2)], stars, labels, arms };
  };

  // Lab page
  if (document.querySelector('.wkc-band')) {
    return [...document.querySelectorAll('.lc-win')].map((w) => {
      const band = w.querySelector('.wkc-band');
      return readWindow(w, band, band.querySelector('svg'));
    });
  }
  // Spec reference render: the band is the div that directly holds the svg.
  const bands = [...document.querySelectorAll('#stage > div')].map((w) => {
    const svg = w.querySelector('svg');
    return readWindow(w, svg.parentElement, svg);
  });
  return bands;
};

const KEYS = ['space', 'Reading', 'Math', 'Science', 'Writing', 'Art', 'Geography'];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  const page = await b.newPage();
  await page.setViewportSize({ width: 1100, height: 900 });

  // ── spec's own render ──
  await page.goto(`${BASE}/docs/constellation-geometry.html`, { waitUntil: 'networkidle' });
  await page.waitForSelector('#stage > div svg', { timeout: 20000 });
  await page.waitForTimeout(1200);
  const specData = await page.evaluate(PROBE);
  const specWins = await page.$$('#stage > div');
  for (let i = 0; i < specWins.length; i++) {
    await specWins[i].screenshot({ path: `${OUT}/spec-${i ? 'mobile' : 'desktop'}.png` });
  }

  // ── the lab's render (settled: let the beat finish) ──
  await page.goto(`${BASE}/lab/constellation.html`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.getElementById('stage').scrollIntoView());
  await page.waitForTimeout(4200);
  const labData = await page.evaluate(PROBE);
  const labWins = await page.$$('.lc-win');
  for (let i = 0; i < labWins.length; i++) {
    await labWins[i].screenshot({ path: `${OUT}/lab-${i ? 'mobile' : 'desktop'}.png` });
  }
  const schedule = await page.evaluate(() => window.__lcSchedule);
  fs.writeFileSync(`${OUT}/beat-schedule.json`, JSON.stringify(schedule, null, 2));

  // ── diff ──
  let issues = 0;
  ['desktop', 'mobile'].forEach((size, i) => {
    const S = specData[i], L = labData[i];
    console.log(`\n══ ${size.toUpperCase()} — band spec ${S.band} vs lab ${L.band}`);
    if (String(S.band) !== String(L.band)) { console.log('  ✗ BAND SIZE'); issues++; }

    KEYS.forEach((k) => {
      const a = S.stars[k], c = L.stars[k];
      if (!a || !c) { console.log(`  ✗ ${k}: missing`); issues++; return; }
      const bad = [];
      if (Math.abs(a.x - c.x) > 0.02) bad.push(`x ${a.x} vs ${c.x}`);
      if (Math.abs(a.y - c.y) > 0.02) bad.push(`y ${a.y} vs ${c.y}`);
      if (Math.abs(a.d - c.d) > 0.02) bad.push(`d ${a.d} vs ${c.d}`);
      if (a.bg !== c.bg) bad.push(`fill ${a.bg} vs ${c.bg}`);
      if (a.dim !== c.dim) bad.push(`--dim ${a.dim} vs ${c.dim}`);
      if (a.anim !== c.anim) bad.push(`anim ${a.anim} vs ${c.anim}`);
      // shadow: compare the set of layers, order-independent across the split
      const layers = (s) => s.split(/\||,(?![^(]*\))/).map((x) => x.trim()).filter(Boolean).sort().join(' ; ');
      if (layers(a.shadow) !== layers(c.shadow)) bad.push(`shadow\n        spec ${layers(a.shadow)}\n        lab  ${layers(c.shadow)}`);
      if (bad.length) { console.log(`  ✗ ${k}: ${bad.join('; ')}`); issues += bad.length; }
      else console.log(`  ✓ ${k}`);
    });

    KEYS.slice(1).forEach((k) => {
      const a = S.labels[k], c = L.labels[k];
      if (!a || !c) { console.log(`  ✗ label ${k}: missing`); issues++; return; }
      const bad = [];
      if (Math.abs(a.x - c.x) > 0.05) bad.push(`x ${a.x} vs ${c.x}`);
      if (Math.abs(a.y - c.y) > 0.05) bad.push(`y ${a.y} vs ${c.y}`);
      if (a.size !== c.size) bad.push(`size ${a.size} vs ${c.size}`);
      if (a.color !== c.color) bad.push(`color ${a.color} vs ${c.color}`);
      if (a.tracking !== c.tracking) bad.push(`tracking ${a.tracking} vs ${c.tracking}`);
      if (bad.length) { console.log(`  ✗ label ${k}: ${bad.join('; ')}`); issues += bad.length; }
      else console.log(`  ✓ label ${k}`);
    });

    // arms: spec has 14 arm paths + 1 tether; lab the same
    const sa = S.arms, la = L.arms;
    if (sa.length !== la.length) { console.log(`  ✗ path count ${sa.length} vs ${la.length}`); issues++; }
    sa.forEach((p, j) => {
      const q = la[j]; if (!q) return;
      const bad = [];
      if (p.d !== q.d) bad.push(`d "${p.d}" vs "${q.d}"`);
      if (p.w !== q.w) bad.push(`w ${p.w} vs ${q.w}`);
      if (p.op !== q.op) bad.push(`opacity ${p.op} vs ${q.op}`);
      if (p.dash !== q.dash) bad.push(`dash "${p.dash}" vs "${q.dash}"`);
      if (p.gx !== q.gx) bad.push(`grad xy ${p.gx} vs ${q.gx}`);
      if (p.stops !== q.stops) bad.push(`stops\n        spec ${p.stops}\n        lab  ${q.stops}`);
      if (bad.length) { console.log(`  ✗ path ${j}: ${bad.join('; ')}`); issues += bad.length; }
    });
    if (!sa.some((p, j) => la[j] && (p.d !== la[j].d || p.stops !== la[j].stops))) {
      console.log(`  ✓ all ${sa.length} paths (geometry, widths, dashes, gradients)`);
    }
  });

  console.log(`\n${issues === 0 ? '✓ NO DISAGREEMENT' : '✗ ' + issues + ' disagreement(s)'}`);
  await b.close();
  process.exit(issues === 0 ? 0 : 1);
})();
