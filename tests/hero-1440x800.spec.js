/**
 * ═══════════════════════════════════════════════════════════════════════════
 * THE 1440x800 LOCK
 *
 * 1440x800 is the approved hero frame and Amy ruled that composition good.
 * This test exists so a future change to the --u scaling law (index.html, .hh)
 * cannot silently move it.
 *
 * IF THIS FAILS, you moved something ruled. The failure names the element and
 * the exact delta. Do not re-capture the baseline to make it pass — that
 * deletes the ruling. Re-capture ONLY when Amy has approved a new composition:
 *
 *     npm run serve
 *     node scripts/hero-geometry-capture.js http://localhost:3000
 *
 * The specific trap this guards: --u's divisor is 485, which is the
 * composition's own measured need (464.4u) plus margin. It is NOT the frame's
 * height (800-82 = 718). A session that "corrects" 485 back to 718 re-breaks
 * short viewports; one that lowers it too far drags 1440x800 off its ruling.
 * At 1440x800 the width term binds at 1, so a correct divisor never shows here
 * — which is exactly why the wrong one has to be caught by a test.
 * ═══════════════════════════════════════════════════════════════════════════
 */
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { capture, diff } = require('./hero-geometry');

const BASELINE = path.join(__dirname, 'hero-1440x800.baseline.json');

test.describe('hero geometry lock', () => {
  test('1440x800 composition has not moved', async ({ page, baseURL }) => {
    expect(fs.existsSync(BASELINE),
      'baseline missing — run: node scripts/hero-geometry-capture.js <url>').toBeTruthy();
    const expected = JSON.parse(fs.readFileSync(BASELINE, 'utf8'));

    const actual = await capture(page, baseURL + '/', 1440, 800);
    const moved = diff(expected.geometry, actual);

    expect(moved, `\n  The ruled 1440x800 composition moved:\n` +
      moved.map((m) => '    · ' + m).join('\n') +
      `\n\n  Baseline captured ${expected.capturedAt} at --u ${expected.geometry.u}.` +
      `\n  If this was intended, Amy must rule on it first. See the header of ` +
      `tests/hero-1440x800.spec.js.\n`).toEqual([]);
  });

  test('--u is exactly 1 at the approved frame', async ({ page, baseURL }) => {
    /* Stated separately because it is the law's own contract, not a layout
       detail: at 1440x800 the width term must bind, so whatever the divisor
       is, --u lands on 1. If this fails the divisor has gone below ~718/1. */
    const actual = await capture(page, baseURL + '/', 1440, 800);
    expect(actual.u).toBeGreaterThan(0.995);
    expect(actual.u).toBeLessThanOrEqual(1.005);
  });

  test('the figure at the approved frame is 7A', async ({ page, baseURL }) => {
    const actual = await capture(page, baseURL + '/', 1440, 800);
    expect(actual.figure.size).toBe('desktop');
  });
});
