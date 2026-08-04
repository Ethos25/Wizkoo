/**
 * Re-capture the 1440x800 geometry baseline that tests/hero-1440x800.spec.js
 * locks.
 *
 *     npm run serve
 *     node scripts/hero-geometry-capture.js http://localhost:3000
 *
 * DO NOT RUN THIS TO MAKE A FAILING TEST PASS. The baseline is a ruling, not a
 * cache. If the lock fails, something moved the approved composition and that
 * is the finding. Re-capture only after Amy has ruled on a new one — and say
 * in the commit what she ruled and why.
 */
const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { capture, diff } = require('../tests/hero-geometry');

const URL = process.argv[2] || 'http://localhost:3000';
const OUT = path.join(__dirname, '..', 'tests', 'hero-1440x800.baseline.json');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  const geometry = await capture(page, URL, 1440, 800);

  /* Capture twice and require agreement, so a baseline can never be minted
     from a frame the layout had not finished settling into. */
  const again = await capture(page, URL, 1440, 800);
  const unstable = diff(geometry, again);
  if (unstable.length) {
    console.error('✗ geometry is not stable between two captures — not writing a baseline:');
    unstable.forEach((u) => console.error('    · ' + u));
    await browser.close();
    process.exit(1);
  }

  let previous = null;
  if (fs.existsSync(OUT)) previous = JSON.parse(fs.readFileSync(OUT, 'utf8'));

  fs.writeFileSync(OUT, JSON.stringify({
    note: 'Ruled composition. See tests/hero-1440x800.spec.js before changing.',
    viewport: '1440x800',
    source: URL,
    capturedAt: new Date().toISOString().slice(0, 10),
    geometry,
  }, null, 2) + '\n');

  console.log(`✓ baseline written: ${path.relative(process.cwd(), OUT)}`);
  console.log(`  --u ${geometry.u}  ·  figure ${geometry.figure.size === 'desktop' ? '7A' : '7B'}` +
              `  ·  window ${geometry.elements['.lw'].w}x${geometry.elements['.lw'].h}`);
  if (previous) {
    const moved = diff(previous.geometry, geometry);
    console.log(moved.length
      ? `  ⚠ ${moved.length} value(s) differ from the previous baseline:\n` +
        moved.map((m) => '      · ' + m).join('\n')
      : '  (identical to the previous baseline)');
  }
  await browser.close();
})();
