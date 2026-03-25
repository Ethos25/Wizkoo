# Wizkoo — Claude Code Notes

## Project

Static HTML/CSS/JS site. No build step. Files are served directly.

## Dev Server

```bash
npm run serve        # serves at http://localhost:3000
```

Or directly:

```bash
npx serve . -p 3000
```

## Visual Verification with Playwright

Playwright is installed (`@playwright/test`) with Chromium for taking screenshots and visually verifying changes.

**Quick screenshot:**

```bash
node scripts/screenshot.js                                  # homepage, timestamped filename
node scripts/screenshot.js http://localhost:3000 screenshots/homepage.png
node scripts/screenshot.js http://localhost:3000/games.html screenshots/games.png
```

Options: `--width=1440 --height=900`

Screenshots are saved to `screenshots/`.

**Full-page screenshot (inline):**

```bash
node -e "
const { chromium } = require('@playwright/test');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.setViewportSize({ width: 1280, height: 900 });
  await p.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await p.screenshot({ path: 'screenshots/check.png', fullPage: true });
  await b.close();
})();
"
```

**Workflow:** start server → make changes → take screenshot → read the PNG file to visually inspect.
