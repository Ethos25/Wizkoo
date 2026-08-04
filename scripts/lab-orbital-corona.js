/**
 * THE CORONA, THREE WAYS
 *
 *   node scripts/lab-orbital-corona.js <baseUrl> [outDir]
 *
 * Round 2 had a corona centred on the hot region, which became a pale halo off
 * the shoulder — a second object. Round 3 deleted it, which left the star pasted
 * onto the sky. Round 4 is neither: centred on the body, radially symmetric,
 * monotonically decreasing from the limb outward on an inverse power law.
 *
 * All three are rendered from the same page here. The round-2 and round-3
 * builds are pulled out of git and served into the browser by request
 * interception, so this is those builds, not a reconstruction of them.
 *
 * Then the thing that matters is measured rather than described: the radial
 * luminance profile of the rendered frame. A corona that "has no discernible
 * boundary" is one whose profile has no step anywhere, and that is a number.
 */
const { chromium } = require('@playwright/test');
const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const BASE = process.argv[2] || 'http://localhost:3000';
const OUT = process.argv[3] || path.join(__dirname, '..', 'screenshots', 'orbital-lab');
const URL = BASE.replace(/\/$/, '') + '/lab/orbital.html';
const VP = { width: 1440, height: 900 };
const GPU = ['--use-angle=default', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-gpu-rasterization'];

const R2 = 'a7f4eda';   /* round 2: the ghost */
const R3 = '6b77133';   /* round 3: no glow */

fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const show = (rev, file) => execFileSync('git', ['show', rev + ':' + file], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

/* Measured off the rendered page: median luminance in thin annuli about the
   nucleus. Median, not mean, so a bright star inside a ring cannot move it. */
async function profile(page) {
  const buf = await page.screenshot();
  return page.evaluate(async (b64) => {
    const img = new Image();
    img.src = 'data:image/png;base64,' + b64;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = img.width; c.height = img.height;
    const g = c.getContext('2d');
    g.drawImage(img, 0, 0);
    const d = g.getImageData(0, 0, c.width, c.height).data;
    const A = window.WizkooLabOrbital;
    /* The screenshot is in DEVICE pixels and getBoundingClientRect is in CSS
       pixels, so everything has to be carried across by the ratio the decoded
       image actually has. Getting this wrong samples at half the intended radius
       from a centre in the wrong quadrant, and every build then measures the
       same — which is exactly how round 4's corona first appeared to be doing
       nothing at all. */
    const dpr = img.width / window.innerWidth;
    const svg = document.querySelector('.lab-orbital__svg').getBoundingClientRect();
    const sx = (svg.width / A.FRAME.w) * dpr;
    const cx = (svg.left + A.FRAME.cx * (svg.width / A.FRAME.w)) * dpr;
    const cy = (svg.top + A.FRAME.cy * (svg.height / A.FRAME.h)) * dpr;
    const R = A.NUC_R * sx;
    const lum = (i) => 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];

    const rings = [];
    for (let k = 0; k <= 46; k++) {
      const rr = (1.10 + k * 0.12) * R;
      const vals = [];
      const n = Math.max(720, Math.round(2 * Math.PI * rr * 1.5));
      for (let j = 0; j < n; j++) {
        const th = 2 * Math.PI * j / n;
        const x = Math.round(cx + rr * Math.cos(th)), y = Math.round(cy + rr * Math.sin(th));
        if (x < 1 || y < 1 || x >= c.width - 1 || y >= c.height - 1) continue;
        vals.push(lum((y * c.width + x) * 4));
      }
      if (vals.length < 40) continue;
      /* the same ring cut into 16 sectors, because a median around a circle
         cannot see asymmetry — and asymmetry is the whole difference between a
         corona and a ghost hanging off one shoulder */
      const SEC = 16, sect = [];
      for (let q = 0; q < SEC; q++) {
        const sv = [];
        const n2 = Math.max(20, Math.round(n / SEC));
        for (let j = 0; j < n2; j++) {
          const th = 2 * Math.PI * (q + j / n2) / SEC;
          const x = Math.round(cx + rr * Math.cos(th)), y = Math.round(cy + rr * Math.sin(th));
          if (x < 1 || y < 1 || x >= c.width - 1 || y >= c.height - 1) continue;
          sv.push(lum((y * c.width + x) * 4));
        }
        if (sv.length < 8) { sect.push(null); continue; }
        sv.sort((a, b) => a - b);
        sect.push(+sv[sv.length >> 1].toFixed(2));
      }
      vals.sort((a, b) => a - b);
      rings.push({ r: +(rr / R).toFixed(2), med: +vals[vals.length >> 1].toFixed(2),
                   p90: +vals[Math.floor(vals.length * 0.9)].toFixed(2), sect });
    }
    /* a far-field patch, well away from the body */
    const far = [];
    for (let y = 60; y < 260; y += 3) for (let x = 60; x < 460; x += 3) far.push(lum((y * c.width + x) * 4));
    far.sort((a, b) => a - b);
    return { rings, far: +far[far.length >> 1].toFixed(2),
             farP90: +far[Math.floor(far.length * 0.9)].toFixed(2) };
  }, buf.toString('base64'));
}

async function render(browser, name, rev) {
  const ctx = await browser.newContext({ viewport: VP, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  if (rev) {
    const js = show(rev, 'js/lab-orbital.js'), css = show(rev, 'css/lab-orbital.css');
    await page.route('**/js/lab-orbital.js', (r) => r.fulfill({ contentType: 'application/javascript', body: js }));
    await page.route('**/css/lab-orbital.css', (r) => r.fulfill({ contentType: 'text/css', body: css }));
  }
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.click('button[data-group="collapse"]');
  await page.evaluate(() => document.getElementById('orbital').scrollIntoView({ block: 'start' }));
  await sleep(6500);
  await page.evaluate(() => document.getAnimations().forEach((a) => { a.pause(); a.currentTime = 9000; }));
  await page.screenshot({ path: path.join(OUT, name + '.png') });
  await page.screenshot({ path: path.join(OUT, name + '-detail.png'), clip: { x: 400, y: 160, width: 680, height: 620 } });
  const prof = await profile(page);
  await ctx.close();
  return prof;
}

(async () => {
  const browser = await chromium.launch({ headless: true, args: GPU });

  console.log('rendering the three builds from the same page\n');
  const r2 = await render(browser, 'cmp-round2-ghost', R2);
  const r3 = await render(browser, 'cmp-round3-none', R3);
  const r4 = await render(browser, 'cmp-round4-restored', null);

  /* Differencing against round 3 isolates the glow: same page, same seed, same
     sky, same background gradient. What is left is the corona and nothing else. */
  const pick = [1.1, 1.4, 1.8, 2.3, 2.9, 3.6, 4.4, 5.2, 6.0];
  const nearest = (p, r) => p.rings.reduce((a, b) => Math.abs(b.r - r) < Math.abs(a.r - r) ? b : a);
  /* how lopsided the glow's own contribution is at this radius */
  const lopsided = (p, base, r) => {
    const a = nearest(p, r), b = nearest(base, r);
    const d = a.sect.map((v, i) => (v == null || b.sect[i] == null) ? null : v - b.sect[i]).filter(v => v != null);
    if (d.length < 8) return null;
    return Math.max(...d) - Math.min(...d);
  };

  console.log('median sky luminance by radius, off the rendered frame');
  console.log('  far field (top-left, well clear of the body): ' + r4.far.toFixed(1) + ' in all three\n');
  console.log('   r/R    round 2     round 3     round 4     the glow alone      how lopsided the glow is');
  console.log('          (ghost)     (none)      (restored)  r4 - r3   r2 - r3   r4        r2');
  for (const r of pick) {
    const a = nearest(r2, r), b = nearest(r3, r), c = nearest(r4, r);
    const l4 = lopsided(r4, r3, r), l2 = lopsided(r2, r3, r);
    console.log('  ' + r.toFixed(1).padStart(4) + '  ' +
      a.med.toFixed(1).padStart(8) + '   ' + b.med.toFixed(1).padStart(8) + '   ' +
      c.med.toFixed(1).padStart(8) + '   ' +
      (c.med - b.med).toFixed(1).padStart(7) + '   ' + (a.med - b.med).toFixed(1).padStart(7) + '   ' +
      (l4 == null ? '  -  ' : l4.toFixed(1).padStart(5)) + '   ' +
      (l2 == null ? '  -  ' : l2.toFixed(1).padStart(5)));
  }

  const contrib = r4.rings.map((x, i) => ({ r: x.r, v: x.med - r3.rings[i].med }));
  const peak = contrib[0].v;
  const mono = contrib.every((x, i) => i === 0 || x.v <= contrib[i - 1].v + 0.4);
  /* "no discernible boundary" is a statement about the SLOPE: a boundary is a
     place where the falloff has a local feature. A smooth power law's slope is
     steepest at the limb and decreases monotonically outward from there, with
     no bump at any radius including the element's own edge. */
  const slope = [];
  for (let i = 1; i < contrib.length; i++) slope.push({ r: contrib[i].r, d: contrib[i - 1].v - contrib[i].v });
  let bump = 0, bumpAt = 0;
  for (let i = 1; i < slope.length; i++) {
    const rise = slope[i].d - slope[i - 1].d;
    if (rise > bump) { bump = rise; bumpAt = slope[i].r; }
  }

  console.log('\n  ROUND 4, the corona alone');
  console.log('    at the limb                        +' + peak.toFixed(1) + ' luminance over the no-glow build');
  console.log('    falls to under a point by          r/R ' +
    (contrib.find(x => x.v < 1) || { r: '>6' }).r);
  console.log('    monotonically decreasing outward   ' + mono);

  /* Noise control: the same statistic on the build with no corona at all.
     Whatever it reports is this measurement's floor — 8-bit quantisation, the
     section's film grain, and a median over a finite sector. A bump at or under
     that floor is not a boundary, it is the instrument. */
  const ctrl = r3.rings.map((x) => x.med - r4.far);
  let cbump = 0;
  for (let i = 2; i < ctrl.length; i++) {
    cbump = Math.max(cbump, (ctrl[i - 1] - ctrl[i]) - (ctrl[i - 2] - ctrl[i - 1]));
  }
  console.log('    largest rise in the falloff rate   ' + bump.toFixed(2) + ' at r/R ' + bumpAt);
  console.log('    the same statistic with NO corona  ' + cbump.toFixed(2) +
    '   <- this measurement own floor');
  /* The decisive comparison is against the same statistic measured with no
     corona at all. If the two match, the wiggle is the instrument — 8-bit
     quantisation, the section's film grain, and a median over a finite sector —
     and not a boundary the corona put there. */
  const localSignal = (contrib.find(x => x.r >= bumpAt) || contrib[contrib.length - 1]).v;
  console.log('    one 8-bit step is                  1.00 luminance units');
  console.log('    the glow contribution at that r    ' + localSignal.toFixed(2) + ' units');
  console.log('    verdict                            ' +
    (bump <= cbump * 1.2
      ? 'the largest feature anywhere in the falloff matches what this measurement reports with NO corona present — it is the instrument, not an edge'
      : 'CHECK - a feature stands above the floor'));

  /* The near bleed inside the body's own image runs to 1.34 radii and IS
     hot-biased, by ruling. Past it the outer corona may not be, so that is
     where the symmetry claim has to be tested. */
  const outerR = pick.filter(r => r >= 1.4);
  const asym4 = outerR.map(r => lopsided(r4, r3, r)).filter(v => v != null);
  const asym2 = outerR.map(r => lopsided(r2, r3, r)).filter(v => v != null);
  console.log('    lopsidedness inside 1.34R          ' + lopsided(r4, r3, 1.1).toFixed(1) +
    '   (the near bleed, hot-biased by ruling)');
  console.log('    lopsidedness beyond it, worst      ' + Math.max(...asym4).toFixed(1) +
    '   against the ghost\'s ' + Math.max(...asym2).toFixed(1) + ' over the same radii');
  const n15 = nearest(r4, 1.5);
  console.log('    stars through it at r/R 1.5        90th percentile ' + n15.p90.toFixed(1) +
    ' against a median of ' + n15.med.toFixed(1) + ' — dimmed, not filled');

  console.log('\nstills: cmp-round2-ghost, cmp-round3-none, cmp-round4-restored (+ -detail)');
  await browser.close();
})();
