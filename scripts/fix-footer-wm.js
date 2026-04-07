// Fix footer wordmark: replace the wordmark anchor inside <footer> with the
// canonical version from index.html across all target pages.
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

const canonical = '<a href="/" class="nav-wm" aria-label="Home">w<span class="i-fix">i</span>z<span class="k">k</span>o<span class="wm-dot">o</span></a>';

// Matches any <a> tag that is the wordmark inside the footer section.
// We handle this by splitting on <footer> and operating only on the footer portion.
const WM_RE = /<a [^>]*class="(?:wm|nav-wm)"[^>]*>w<span class="i-fix">i<\/span>z<span class="k">k<\/span>o(?:<span class="wm-dot">o<\/span>|o)<\/a>/;

const files = [
  'about.html',
  'games.html',
  'methodology.html',
  'account.html',
  '404.html',
  'games/atlas.html',
  'games/elementum.html',
];

for (const rel of files) {
  const fpath = path.join(root, rel);
  const original = fs.readFileSync(fpath, 'utf8');

  const footerIdx = original.indexOf('<footer>');
  if (footerIdx === -1) {
    console.log(`SKIP ${rel}: no <footer> tag found`);
    continue;
  }

  const before = original.slice(0, footerIdx);
  const footerSection = original.slice(footerIdx);

  if (!WM_RE.test(footerSection)) {
    console.log(`SKIP ${rel}: no wordmark found in footer`);
    continue;
  }

  const oldMatch = footerSection.match(WM_RE)[0];
  const updated = before + footerSection.replace(WM_RE, canonical);
  fs.writeFileSync(fpath, updated, 'utf8');
  console.log(`FIXED ${rel}`);
  console.log(`  OLD: ${oldMatch}`);
  console.log(`  NEW: ${canonical}`);
}
