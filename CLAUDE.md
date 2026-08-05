# Wizkoo — Claude Code Notes

## Project

Static HTML/CSS/JS site. No bundler, no transpiler — the source files are the
site. But the repository is **not** the site: wizkoo.com publishes `_site/`,
which `npm run build` assembles from the paths named in `publish-allowlist.txt`.

**`publish-allowlist.txt` decides what ships.** A file reaches the website by
being named in it and by no other route. To add a page, add one line to the
manifest. That is the whole edit.

The build **hard-fails** (exit 1, and Netlify deploys nothing) if a root-level
`.html` file in the repo appears in neither section of the manifest — so a page
added and forgotten stops the deploy rather than silently going missing. The
failure message names the file and the one-line fix. Do not disable it.

## Build

```bash
npm run build        # assembles _site/ from publish-allowlist.txt, runs the guard
```

`_site/` is gitignored and rebuilt from empty on every run. Netlify runs this
same command on every deploy.

## Dev Server

```bash
npm run serve        # serves at http://localhost:3000
```

Or directly:

```bash
npx serve . -p 3000
```

**The dev server serves the repository root, not `_site/`.** So it shows you
files that are not on the website — runbooks, reports, everything under
`assets/`. It is a preview of your working tree, not of production. To see what
actually ships, run `npm run build` and serve the built output:

```bash
npm run build && npx serve _site -p 3000
```

Note that `serve.json` (the rewrite rules that make `/library/:slug` work
locally) sits at the repo root and is not copied into `_site/`, so local
`/library/<slug>` URLs only resolve when serving the root. On Netlify that
routing comes from `_redirects` and `netlify.toml` instead.

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
