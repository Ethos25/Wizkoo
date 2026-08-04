/**
 * The hero's geometry fingerprint, captured once and shared by the lock test
 * and the capture script so the two can never drift apart.
 *
 * WHY GEOMETRY AND NOT PIXELS: the sky animates (twinkle, shooting star) and
 * the constellation scintillates forever, so two screenshots of the SAME build
 * never match. Pixel hashing this hero produces a test that fails at random.
 * Positions, sizes and type scale do not move once the layout settles, so they
 * are what gets locked.
 */

/* Everything whose position is part of the ruled composition. */
const ELEMENTS = [
  '.hh', '.hh-stage',
  '.hh-copy', '.hh-eyebrow', '.hh-arrest', '.hh-answer', '.hh-support',
  '.hh-group', '.hh-whisper',
  '.lw-mount', '.lw', '.lw-body', '.lw-label', '.lw-sentence', '.lw-theme',
  '.lw-foot', '.lw-cta', '.lw-band', '.lw-figure',
];

const STARS = ['space', 'Reading', 'Math', 'Science', 'Writing', 'Art', 'Geography'];

/** Runs in the page. Coordinates are relative to .hh, so scroll cannot shift them. */
const PROBE = (args) => {
  const { ELEMENTS, STARS } = args;
  const hh = document.querySelector('.hh').getBoundingClientRect();
  const round = (v) => +Number(v).toFixed(2);
  const out = { u: null, elements: {}, stars: {}, figure: null };

  const lw = document.querySelector('.lw');
  out.u = round(lw.getBoundingClientRect().width / 553);

  ELEMENTS.forEach((sel) => {
    const el = document.querySelector(sel);
    if (!el) { out.elements[sel] = null; return; }
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    out.elements[sel] = {
      x: round(r.left - hh.left), y: round(r.top - hh.top),
      w: round(r.width), h: round(r.height),
      fontSize: cs.fontSize,
    };
  });

  const fig = document.querySelector('.lw-figure');
  if (fig) {
    const f = fig.getBoundingClientRect();
    out.figure = { size: document.querySelector('.lw-band').getAttribute('data-size') };

    /* The tether is load-bearing (ruled): it must launch under the word
       "space" and terminate at the theme star's glow edge. Its endpoints are
       part of the fingerprint — mapped from the svg's user units to page px so
       they are compared in the same frame as everything else. */
    const svg = fig.querySelector('.wkc-svg');
    const tp = fig.querySelector('.wkc-tether path');
    if (svg && tp) {
      const vb = svg.getAttribute('viewBox').split(/\s+/).map(Number);
      const m = tp.getAttribute('d')
        .match(/M\s*(-?[\d.]+)[ ,]\s*(-?[\d.]+)\s*L\s*(-?[\d.]+)[ ,]\s*(-?[\d.]+)/);
      if (m) {
        const sx = f.width / vb[2], sy = f.height / vb[3];
        out.tether = {
          x1: round(f.left + m[1] * sx - hh.left), y1: round(f.top + m[2] * sy - hh.top),
          x2: round(f.left + m[3] * sx - hh.left), y2: round(f.top + m[4] * sy - hh.top),
        };
      }
    }
    STARS.forEach((k) => {
      const el = fig.querySelector(`[data-star="${k}"]`);
      if (!el) { out.stars[k] = null; return; }
      const r = el.getBoundingClientRect();
      /* Relative to the figure, in percent — the form the spec states them in. */
      out.stars[k] = {
        xPct: round((r.left + r.width / 2 - f.left) / f.width * 100),
        yPct: round((r.top + r.height / 2 - f.top) / f.height * 100),
        d: round(r.width),
      };
    });
  }
  return out;
};

/** Load, settle fonts and the arrival beat, and fingerprint. */
async function capture(page, url, width, height) {
  await page.setViewportSize({ width, height });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => (document.fonts ? document.fonts.ready : null));
  /* The figure is built on fonts.ready and the beat runs ~2.7s; settle past it
     so the fingerprint is of the finished composition, never a frame of it. */
  await page.waitForTimeout(4200);
  return page.evaluate(PROBE, { ELEMENTS, STARS });
}

/** Field-by-field diff. Returns [] when nothing moved. */
function diff(expected, actual, tol = 0.5) {
  const out = [];
  const near = (a, b) => Math.abs(a - b) <= tol;

  if (!near(expected.u, actual.u)) out.push(`--u: ${expected.u} -> ${actual.u}`);

  for (const sel of Object.keys(expected.elements)) {
    const e = expected.elements[sel], a = actual.elements[sel];
    if (e === null && a === null) continue;
    if (!e || !a) { out.push(`${sel}: ${e ? 'disappeared' : 'appeared'}`); continue; }
    for (const k of ['x', 'y', 'w', 'h']) {
      if (!near(e[k], a[k])) out.push(`${sel} ${k}: ${e[k]} -> ${a[k]}`);
    }
    if (e.fontSize !== a.fontSize) out.push(`${sel} font-size: ${e.fontSize} -> ${a.fontSize}`);
  }

  if (expected.figure && actual.figure && expected.figure.size !== actual.figure.size) {
    out.push(`figure variant: ${expected.figure.size} -> ${actual.figure.size}`);
  }
  if (expected.tether || actual.tether) {
    const e = expected.tether, a = actual.tether;
    if (!e || !a) out.push(`tether: ${e ? 'disappeared' : 'appeared'}`);
    else for (const k of ['x1', 'y1', 'x2', 'y2']) {
      if (!near(e[k], a[k])) out.push(`tether ${k}: ${e[k]} -> ${a[k]}`);
    }
  }
  for (const k of Object.keys(expected.stars || {})) {
    const e = expected.stars[k], a = (actual.stars || {})[k];
    if (!e || !a) { out.push(`star ${k}: ${e ? 'missing' : 'unexpected'}`); continue; }
    for (const f of ['xPct', 'yPct', 'd']) {
      /* Percent positions need a tighter tolerance than pixels. */
      const t = f === 'd' ? tol : 0.15;
      if (Math.abs(e[f] - a[f]) > t) out.push(`star ${k} ${f}: ${e[f]} -> ${a[f]}`);
    }
  }
  return out;
}

module.exports = { ELEMENTS, STARS, PROBE, capture, diff };
