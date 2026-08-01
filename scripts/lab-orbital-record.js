/**
 * ORBITAL LAB — the 60-second walk, recorded.
 *
 *   node scripts/lab-orbital-record.js <baseUrl> [outDir]
 *
 * One take, no cuts: load, scroll the section into view so the arrival beat
 * fires on the IntersectionObserver the way it will in production, then sit
 * still for a minute so the ambient layer can be judged — the nucleus breath,
 * the per-star twinkle, and the one shooting star, which this seed puts at
 * 20.4s on a 69.5s period.
 *
 * Recorded on a GPU-rasterising Chromium so the frame rate in the file is the
 * frame rate of the object, not of a software rasteriser.
 */
const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const BASE = process.argv[2] || 'http://localhost:3000';
const OUT = process.argv[3] || path.join(__dirname, '..', 'screenshots', 'orbital-lab');
const URL = BASE.replace(/\/$/, '') + '/lab/orbital.html';
const VP = { width: 1440, height: 900 };
const SECONDS = Number(process.env.SECONDS || 62);

fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await chromium.launch({
    headless: true,
    args: ['--use-angle=default', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-gpu-rasterization']
  });
  const ctx = await browser.newContext({
    viewport: VP,
    recordVideo: { dir: OUT, size: VP }
  });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });
  /* the panel is lab chrome; the recording is of the object */
  await page.click('button[data-group="collapse"]');
  await sleep(900);
  await page.evaluate(() => document.getElementById('orbital').scrollIntoView({ block: 'start' }));
  await sleep(SECONDS * 1000);

  const video = page.video();
  await ctx.close();
  const src = await video.path();
  const dest = path.join(OUT, 'orbital-lab-60s.webm');
  fs.renameSync(src, dest);
  console.log('recorded ' + SECONDS + 's -> ' + path.relative(process.cwd(), dest));
  console.log('  0.0s   scroll in, arrival beat fires on the observer at 0.4');
  console.log('  ~4.0s  beat complete and latched; ambient only from here');
  console.log('  20.4s  the shooting star (upper left, 13 degrees, one pass)');
  console.log('  throughout  nucleus breath on 3.7 / 5.3 / 8.9s layers, per-star twinkle');
  await browser.close();
})();
