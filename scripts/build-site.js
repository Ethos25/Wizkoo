#!/usr/bin/env node
'use strict';

/**
 * build-site.js — assembles the published website into _site/ from the
 * allowlist in publish-allowlist.txt, and refuses to finish if that allowlist
 * does not account for every root-level .html file in the repository.
 *
 * WHY THIS EXISTS. wizkoo.com used to set `publish = "."` in netlify.toml,
 * which made the repository and the website the same set of files. Runbooks,
 * audit reports, migration scripts and 68 internal design comps under assets/
 * were all fetchable on the live site. This script inverts the default: the
 * website is what the allowlist names, and nothing else.
 *
 * The direction of failure is the point. A path missing from the allowlist
 * produces a missing page — loud, and visible in seconds. The arrangement it
 * replaces produced a published internal record — silent, and visible to
 * anyone who guessed the URL.
 *
 * Usage:  node scripts/build-site.js       (npm run build)
 * Exit:   0 on success, 1 on any guard failure. Netlify treats 1 as a failed
 *         build and does not deploy.
 */

const fs = require('fs');
const path = require('path');

const REPO = path.resolve(__dirname, '..');
const MANIFEST = 'publish-allowlist.txt';
const OUT = '_site';

/**
 * Directories the inventory walk does not descend into.
 *
 * This is NOT an exclusion rule. Exclusion is "absent from publish-allowlist.txt",
 * and it applies to everything. This list only keeps the walk from spending
 * time inside directories that cannot contain a published file: .git and
 * node_modules are enormous, _site is this script's own output, and .claude
 * holds editor state and sibling worktrees.
 */
const SKIP_WALK = new Set(['.git', 'node_modules', OUT, '.claude']);

// ── Manifest ────────────────────────────────────────────────────────────────

/**
 * Reads publish-allowlist.txt into { publish: [...], declined: [...] }.
 * Entries keep their source line number so failure messages can cite it.
 */
function readManifest(file) {
  const text = fs.readFileSync(path.join(REPO, file), 'utf8');
  const sections = { publish: [], declined: [] };
  let current = null;

  text.split(/\r?\n/).forEach((raw, i) => {
    const line = raw.trim();
    if (line === '' || line.startsWith('#')) return;

    const header = line.match(/^(publish|declined):$/);
    if (header && /^\S/.test(raw)) {
      current = header[1];
      return;
    }

    if (!current) {
      fail([
        `${file} line ${i + 1}: an entry appears before any section header.`,
        '',
        `    ${raw}`,
        '',
        'Every entry must sit under `publish:` or `declined:`.',
      ]);
    }

    // Strip the trailing reason comment. Paths in this repo contain no '#'.
    const entry = line.split('#')[0].trim();
    if (entry) sections[current].push({ path: entry, line: i + 1 });
  });

  return sections;
}

// ── Inventory ───────────────────────────────────────────────────────────────

/** Every file in the working tree, as repo-relative posix paths. */
function inventory(dir = REPO, prefix = '') {
  const out = [];
  for (const dirent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (dirent.isDirectory()) {
      if (SKIP_WALK.has(dirent.name)) continue;
      out.push(...inventory(path.join(dir, dirent.name), prefix + dirent.name + '/'));
    } else if (dirent.isFile()) {
      out.push(prefix + dirent.name);
    }
  }
  return out;
}

/**
 * Glob to RegExp. `**` crosses path separators, `*` and `?` do not.
 * Everything else is matched literally.
 */
function globToRegExp(glob) {
  let re = '';
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === '*') {
      if (glob[i + 1] === '*') { re += '.*'; i++; }
      else re += '[^/]*';
    } else if (c === '?') {
      re += '[^/]';
    } else {
      re += c.replace(/[.+^${}()|[\]\\]/g, '\\$&');
    }
  }
  return new RegExp('^' + re + '$');
}

/** Resolves one manifest entry against the inventory. */
function resolve(entry, files) {
  if (/[*?]/.test(entry.path)) {
    const re = globToRegExp(entry.path);
    return files.filter((f) => re.test(f));
  }
  return files.includes(entry.path) ? [entry.path] : [];
}

// ── Failure ─────────────────────────────────────────────────────────────────

/** Prints a bordered message to stderr and exits 1. */
function fail(lines) {
  const rule = '─'.repeat(76);
  process.stderr.write(
    '\n' + rule + '\n' +
    'BUILD FAILED — ' + lines[0] + '\n' +
    rule + '\n' +
    lines.slice(1).join('\n') + '\n\n'
  );
  process.exit(1);
}

// ── Build ───────────────────────────────────────────────────────────────────

const manifest = readManifest(MANIFEST);
const files = inventory();

// GUARD. Every root-level .html file must be accounted for in exactly one
// section. This runs before anything is copied, so a failed build leaves no
// half-written _site behind.
const rootHtml = files.filter((f) => !f.includes('/') && f.endsWith('.html')).sort();
const published = new Set(manifest.publish.map((e) => e.path));
const declined = new Set(manifest.declined.map((e) => e.path));

const contradictory = rootHtml.filter((f) => published.has(f) && declined.has(f));
if (contradictory.length) {
  fail([
    `${MANIFEST} contradicts itself`,
    '',
    'These files are listed under BOTH `publish:` and `declined:`, so the',
    'manifest states both that they ship and that they do not:',
    '',
    ...contradictory.map((f) => '    ' + f),
    '',
    `TO FIX — open ${MANIFEST} and delete ONE of the two lines for each file.`,
    'There is no precedence rule and there will not be one. A manifest that',
    'has to be interpreted is a manifest nobody can trust.',
  ]);
}

const unaccounted = rootHtml.filter((f) => !published.has(f) && !declined.has(f));
if (unaccounted.length) {
  fail([
    `${MANIFEST} does not account for every page`,
    '',
    'These root-level .html files exist in the repository but appear in',
    `neither section of ${MANIFEST}:`,
    '',
    ...unaccounted.map((f) => '    ' + f),
    '',
    'wizkoo.com serves only what that file names, so as things stand these',
    'are NOT on the website.',
    '',
    `TO FIX — open ${MANIFEST} and add ONE line for each file:`,
    '',
    '  A page that should ship goes under `publish:`',
    `      ${unaccounted[0]}`,
    '',
    '  Anything that is not a page goes under `declined:`, with a reason',
    `      ${unaccounted[0]}    # what it actually is`,
    '',
    'Do not delete this check and do not remove the build command to get',
    'past it. It is the only thing standing between an internal file and',
    'www.wizkoo.com. The fix above is one line.',
  ]);
}

// Resolve the allowlist.
const selected = new Map(); // published path -> source path
const empty = [];
for (const entry of manifest.publish) {
  const matches = resolve(entry, files);
  if (matches.length === 0) empty.push(entry);
  for (const m of matches) selected.set(m, m);
}

// A `declined:` entry naming a file that is not there, or a `publish:` entry
// that matches nothing, is stale rather than dangerous — it can only ever
// cause a missing page, never a published internal file. Say so and continue.
for (const entry of empty) {
  process.stdout.write(
    `  WARNING  ${MANIFEST} line ${entry.line}: "${entry.path}" matches no file. ` +
    'Nothing will be published for it.\n'
  );
}
for (const entry of manifest.declined) {
  if (!files.includes(entry.path)) {
    process.stdout.write(
      `  WARNING  ${MANIFEST} line ${entry.line}: "${entry.path}" is declined but ` +
      'no longer exists. The entry can be deleted.\n'
    );
  }
}

// Copy. _site is rebuilt from empty every time so a path removed from the
// allowlist cannot survive in a stale output directory.
const outDir = path.join(REPO, OUT);
fs.rmSync(outDir, { recursive: true, force: true });
for (const rel of [...selected.keys()].sort()) {
  const dest = path.join(outDir, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(path.join(REPO, rel), dest);
}

// ── Report ──────────────────────────────────────────────────────────────────

const groups = [
  ['pages (root)',      (f) => !f.includes('/') && f.endsWith('.html')],
  ['esa state pages',   (f) => f.startsWith('esa/')],
  ['game pages',        (f) => f.startsWith('games/')],
  ['library',           (f) => f.startsWith('library/')],
  ['css',               (f) => f.startsWith('css/')],
  ['js',                (f) => f.startsWith('js/')],
  ['components',        (f) => f.startsWith('components/')],
  ['images',            (f) => f.startsWith('images/')],
  ['assets (named)',    (f) => f.startsWith('assets/')],
  ['root static',       (f) => !f.includes('/')],
];

const built = [...selected.keys()];
const counted = new Set();
process.stdout.write(`\n  Built ${OUT}/ from ${MANIFEST}\n\n`);
for (const [label, test] of groups) {
  const n = built.filter((f) => !counted.has(f) && test(f)).length;
  built.filter(test).forEach((f) => counted.add(f));
  if (n) process.stdout.write(`    ${String(n).padStart(3)}  ${label}\n`);
}
process.stdout.write(
  `    ───\n    ${String(built.length).padStart(3)}  files published` +
  `   (${files.length - built.length} of ${files.length} stay out)\n\n` +
  `    ${rootHtmlSummary()}\n\n`
);

function rootHtmlSummary() {
  return `Guard: ${rootHtml.length} root-level .html files, ` +
    `${rootHtml.filter((f) => published.has(f)).length} published, ` +
    `${rootHtml.filter((f) => declined.has(f)).length} declined, 0 unaccounted.`;
}
