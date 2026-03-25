/**
 * Playwright screenshot helper.
 * Usage: node scripts/screenshot.js [url] [output] [--width=1280] [--height=800]
 * Defaults: url=http://localhost:3000, output=screenshots/screenshot.png
 */

const { chromium } = require('@playwright/test');
const path = require('path');

async function screenshot() {
  const args = process.argv.slice(2);
  const url = args.find(a => a.startsWith('http')) || 'http://localhost:3000';
  const output = args.find(a => a.endsWith('.png') && !a.startsWith('http')) ||
    `screenshots/screenshot-${Date.now()}.png`;
  const width = parseInt((args.find(a => a.startsWith('--width=')) || '--width=1280').split('=')[1]);
  const height = parseInt((args.find(a => a.startsWith('--height=')) || '--height=800').split('=')[1]);

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width, height });

  console.log(`Navigating to ${url}...`);
  await page.goto(url, { waitUntil: 'networkidle' });

  const outPath = path.resolve(output);
  await page.screenshot({ path: outPath, fullPage: false });
  console.log(`Screenshot saved: ${outPath}`);

  await browser.close();
}

screenshot().catch(err => {
  console.error(err);
  process.exit(1);
});
