/**
 * Replace every inline <footer>…</footer> block with the shared footer
 * component placeholder. Also removes old footer-related inline CSS
 * from pages that had it baked in.
 *
 * Run from the repo root: node scripts/inject-footer.js
 */
const fs   = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');

/* ── Placeholder that replaces each page's old footer ── */
const PLACEHOLDER = [
  '<div id="site-footer"></div>',
  '<script src="/components/footer.js"></script>'
].join('\n');

/* ── Pages to update ── */
const pages = [
  'index.html',
  'about.html',
  'account.html',
  'games.html',
  'methodology.html',
  '404.html',
  'privacy.html',
  'games/atlas.html',
  'games/elementum.html',
];

/* ── CSS class/rule patterns to strip from inline <style> blocks ── */
// These are footer-specific rules that are now owned by footer.js.
const CSS_STRIP_PATTERNS = [
  /footer\{[^}]+\}/g,
  /footer\s*\{[^}]+\}/g,
  /\.footer-inner\{[^}]+\}/g,
  /\.footer-inner\s*\{[^}]+\}/g,
  /\.footer-brand[^{]*\{[^}]+\}/g,
  /\.footer-tagline[^{]*\{[^}]+\}/g,
  /\.footer-email[^{]*\{[^}]+\}/g,
  /\.footer-wm[^{]*\{[^}]+\}/g,
  /\.footer-right[^{]*\{[^}]+\}/g,
  /\.footer-nav[^{]*\{[^}]+\}/g,
  /\.footer-social[^{]*\{[^}]+\}/g,
  /\.footer-social-label[^{]*\{[^}]+\}/g,
  /\.footer-privacy[^{]*\{[^}]+\}/g,
  /\.ft-r[^{]*\{[^}]+\}/g,
  /\.ft-location[^{]*\{[^}]+\}/g,
  /\.ft-educator[^{]*\{[^}]+\}/g,
  /\.ft-educator-idx[^{]*\{[^}]+\}/g,
];

let changed = 0;

for (const rel of pages) {
  const fpath = path.join(root, rel);
  let html = fs.readFileSync(fpath, 'utf8');
  const original = html;

  /* 1. Remove the old <footer>…</footer> block */
  const footerStart = html.indexOf('<footer');
  const footerEnd   = html.lastIndexOf('</footer>') + '</footer>'.length;
  if (footerStart === -1 || footerEnd < '</footer>'.length) {
    console.log(`SKIP ${rel}: no <footer> found`);
    continue;
  }
  html = html.slice(0, footerStart) + PLACEHOLDER + html.slice(footerEnd);

  /* 2. Strip inline footer CSS from pages that had it baked in.
        Only touch content inside <style> tags — leave everything else. */
  html = html.replace(/(<style[^>]*>)([\s\S]*?)(<\/style>)/g, function (match, open, css, close) {
    let cleaned = css;
    for (const pattern of CSS_STRIP_PATTERNS) {
      cleaned = cleaned.replace(pattern, '');
    }
    // Also strip responsive footer media query blocks
    cleaned = cleaned.replace(/@media[^{]*\{([^{}]|\{[^{}]*\})*\}/g, function (mq) {
      // Remove footer rules inside media queries; keep the block if anything else remains
      let inner = mq;
      for (const pattern of CSS_STRIP_PATTERNS) {
        inner = inner.replace(pattern, '');
      }
      // If the media query body is now empty (only whitespace), drop it entirely
      const body = inner.replace(/@media[^{]*\{/, '').replace(/\}\s*$/, '').trim();
      return body.length > 0 ? inner : '';
    });
    return open + cleaned + close;
  });

  fs.writeFileSync(fpath, html, 'utf8');
  console.log(`✓  ${rel}`);
  changed++;
}

console.log(`\nDone — ${changed} files updated.`);
