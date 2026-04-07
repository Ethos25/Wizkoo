// Fix ALL nav wordmarks to match index.html canonical nav-wm
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');

const CANONICAL_WM = '<a href="/" class="nav-wm" aria-label="Home">w<span class="i-fix">i</span>z<span class="k">k</span>o<span class="wm-dot">o</span></a>';

// Matches any wordmark anchor in the nav/header section (before <footer>)
const WM_RE = /<a [^>]*class="(?:wm|nav-wm)"[^>]*>w<span class="i-fix">i<\/span>z<span class="k">k<\/span>o(?:<span class="wm-dot">o<\/span>|o)<\/a>/;

const files = [
  'about.html',
  'games.html',
  'account.html',
  '404.html',
  'games/atlas.html',
  'games/elementum.html',
];

for (const rel of files) {
  const fpath = path.join(root, rel);
  let html = fs.readFileSync(fpath, 'utf8');

  // Split on <footer> — only fix the nav/header portion
  const footerIdx = html.indexOf('<footer>');
  const before = footerIdx !== -1 ? html.slice(0, footerIdx) : html;
  const after  = footerIdx !== -1 ? html.slice(footerIdx) : '';

  if (!WM_RE.test(before)) {
    console.log(`SKIP ${rel}: no nav wordmark found before <footer>`);
    continue;
  }

  const oldMatch = before.match(WM_RE)[0];
  const fixed = before.replace(WM_RE, CANONICAL_WM) + after;
  fs.writeFileSync(fpath, fixed, 'utf8');
  console.log(`FIXED nav wm in ${rel}`);
  console.log(`  OLD: ${oldMatch}`);
  console.log(`  NEW: ${CANONICAL_WM}`);
}

// ─── Special: methodology.html ───
// 1. Fix nav wordmark (already has nav-wm class, just needs href + aria-label)
// 2. Remove inline .nav-wm CSS block (lines 76–88) — replaced by nav.css
const methPath = path.join(root, 'methodology.html');
let meth = fs.readFileSync(methPath, 'utf8');

// Fix nav wordmark href + aria-label
const OLD_METH_NAV = '<a href="index.html" class="nav-wm">w<span class="i-fix">i</span>z<span class="k">k</span>o<span class="wm-dot">o</span></a>';
if (meth.includes(OLD_METH_NAV)) {
  meth = meth.replace(OLD_METH_NAV, CANONICAL_WM);
  console.log('\nFIXED nav wm href+aria in methodology.html');
}

// Remove the conflicting inline .nav-wm CSS block
const CSS_BLOCK_RE = /\.nav-wm \{[\s\S]*?@keyframes mWmDotReact \{[^}]*\}\n/;
if (CSS_BLOCK_RE.test(meth)) {
  meth = meth.replace(CSS_BLOCK_RE, '');
  console.log('REMOVED conflicting inline .nav-wm CSS from methodology.html');
} else {
  console.log('methodology.html: conflicting CSS not found (may already be clean)');
}

fs.writeFileSync(methPath, meth, 'utf8');
