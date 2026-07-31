/**
 * HERO PHOTOGRAPH PIPELINE
 *
 * Re-encodes the hero photograph into the responsive ladder the hero markup
 * expects. Runs through Chromium's canvas, so every output is a clean re-encode:
 * all EXIF, ICC and vendor metadata is dropped by construction.
 *
 *   node scripts/optimize-hero-image.js [sourcePath]
 *
 * Default source: assets/Homepage Image 2 - Science.jpg
 * Outputs:        images/hero-child-science-{w}.jpg  and  .webp
 *
 * Widths in the ladder that exceed the source width are SKIPPED, never
 * upscaled, and reported. Re-run this script after dropping in the licensed
 * full resolution original and the 2400w and 1600w rungs appear automatically.
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('@playwright/test');

const LADDER = [2400, 1600, 1200, 1000, 600];
const JPEG_Q = 0.82;
const WEBP_Q = 0.80;
const OUT_DIR = path.join(__dirname, '..', 'images');
const OUT_STEM = 'hero-child-science';

const src = process.argv[2] || path.join(__dirname, '..', 'assets', 'Homepage Image 2 - Science.jpg');

(async () => {
  if (!fs.existsSync(src)) {
    console.error('Source not found: ' + src);
    process.exit(1);
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const dataUrl = 'data:image/jpeg;base64,' + fs.readFileSync(src).toString('base64');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('about:blank');

  const results = await page.evaluate(async (args) => {
    const { dataUrl, ladder, jpegQ, webpQ } = args;

    const img = new Image();
    img.src = dataUrl;
    await img.decode();

    /* Stepped halving keeps detail honest on large reductions. Chromium's
       one shot downscale softens edges past a 2x ratio. */
    function scaleTo(source, sw, sh, tw, th) {
      let cur = source, cw = sw, ch = sh;
      while (cw / 2 >= tw && ch / 2 >= th) {
        const half = document.createElement('canvas');
        half.width = Math.round(cw / 2);
        half.height = Math.round(ch / 2);
        const hx = half.getContext('2d');
        hx.imageSmoothingEnabled = true;
        hx.imageSmoothingQuality = 'high';
        hx.drawImage(cur, 0, 0, half.width, half.height);
        cur = half; cw = half.width; ch = half.height;
      }
      const out = document.createElement('canvas');
      out.width = tw; out.height = th;
      const ox = out.getContext('2d');
      ox.imageSmoothingEnabled = true;
      ox.imageSmoothingQuality = 'high';
      ox.drawImage(cur, 0, 0, tw, th);
      return out;
    }

    const made = [];
    for (const w of ladder) {
      if (w > img.naturalWidth) { made.push({ width: w, skipped: true }); continue; }
      const h = Math.round(img.naturalHeight * (w / img.naturalWidth));
      const canvas = scaleTo(img, img.naturalWidth, img.naturalHeight, w, h);
      made.push({
        width: w,
        height: h,
        jpeg: canvas.toDataURL('image/jpeg', jpegQ),
        webp: canvas.toDataURL('image/webp', webpQ)
      });
    }
    return { natural: [img.naturalWidth, img.naturalHeight], made };
  }, { dataUrl, ladder: LADDER, jpegQ: JPEG_Q, webpQ: WEBP_Q });

  await browser.close();

  console.log('source      ' + path.basename(src) +
              '  ' + results.natural.join('x') +
              '  ' + Math.round(fs.statSync(src).size / 1024) + 'KB');
  console.log('');

  let largest = 0;
  for (const item of results.made) {
    if (item.skipped) {
      console.log(String(item.width).padStart(5) + 'w  SKIPPED, exceeds source width (no upscaling)');
      continue;
    }
    for (const [kind, url] of [['jpg', item.jpeg], ['webp', item.webp]]) {
      const buf = Buffer.from(url.split(',')[1], 'base64');
      const file = path.join(OUT_DIR, OUT_STEM + '-' + item.width + '.' + kind);
      fs.writeFileSync(file, buf);
      largest = Math.max(largest, buf.length);
      console.log(String(item.width).padStart(5) + 'w  ' + kind.padEnd(4) + '  ' +
                  String(Math.round(buf.length / 1024)).padStart(4) + 'KB  ' +
                  item.width + 'x' + item.height + '  images/' + path.basename(file));
    }
  }
  console.log('');
  console.log('largest web variant: ' + Math.round(largest / 1024) + 'KB  (budget 250KB) ' +
              (largest <= 250 * 1024 ? 'PASS' : 'FAIL'));
})();
