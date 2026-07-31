/**
 * SKY PORT FIDELITY GATE
 *
 * Proves js/hero-sky.js is a faithful port, not an approximation. It takes the
 * ORIGINAL TypeScript primitive straight out of the wizkoo-app git objects,
 * transpiles it, runs both generators at the same seed, and deep-compares every
 * number of the resulting geometry.
 *
 *   node scripts/verify-sky-port.js
 *
 * Source pinned to a62dc1d = e1a90b2 (certified sky) + the authorized filigree
 * q3 amendment, which is the state /start renders.
 *
 * Exits non-zero on any divergence. If wizkoo-app is not on this machine the
 * gate reports SKIPPED rather than passing vacuously.
 */
const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const APP_REPO = process.env.WIZKOO_APP || path.join(process.env.USERPROFILE || process.env.HOME, 'Desktop', 'wizkoo-app');
const PIN = 'a62dc1d';
const SEED = 20260728;
const CERTIFIED_CENSUS = 829;   // stated in the a62dc1d commit message

function git(args) {
  return execFileSync('git', ['-C', APP_REPO].concat(args), { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
}

if (!fs.existsSync(path.join(APP_REPO, '.git'))) {
  console.log('SKIPPED: wizkoo-app not found at ' + APP_REPO);
  console.log('Set WIZKOO_APP to its path to run the fidelity gate.');
  process.exit(0);
}

let ts;
try {
  ts = require(path.join(APP_REPO, 'node_modules', 'typescript'));
} catch (e) {
  console.log('SKIPPED: typescript not resolvable from ' + APP_REPO + '/node_modules');
  process.exit(0);
}

/* ── 1. the original primitive, from the pinned commit ── */
const genTs = git(['show', PIN + ':packages/ui/src/TwoLayerSky/skyGeneration.ts']);
const tokensTs = git(['show', PIN + ':packages/design-tokens/src/tokens.ts']);

// ambientSky is a self-contained literal; lift it rather than resolving the
// whole token package graph.
const m = tokensTs.match(/export const ambientSky = (\{[\s\S]*?\n\}) as const/);
if (!m) { console.error('FAIL: could not lift ambientSky from tokens.ts'); process.exit(1); }
const ambientLiteral = m[1];

const patched = genTs.replace(
  /import \{ ambientSky \} from '@wizkoo\/design-tokens'/,
  'const ambientSky = ' + ambientLiteral
);
if (patched === genTs) { console.error('FAIL: token import not found/replaced'); process.exit(1); }

const js = ts.transpileModule(patched, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
}).outputText;

const origModule = { exports: {} };
new Function('module', 'exports', 'require', js)(origModule, origModule.exports, require);
const orig = origModule.exports;

/* ── 2. the port ── */
const port = require(path.join(__dirname, '..', 'js', 'hero-sky.js'));

/* ── 3. deep compare ── */
const a = orig.buildSkyGeometry('spectacle', SEED);
const b = port.buildSkyGeometry('spectacle', SEED);

const diffs = [];
function cmp(pathStr, x, y) {
  if (Array.isArray(x) || Array.isArray(y)) {
    if (!Array.isArray(x) || !Array.isArray(y)) return diffs.push(pathStr + ': array/non-array');
    if (x.length !== y.length) return diffs.push(pathStr + ': length ' + x.length + ' vs ' + y.length);
    for (let i = 0; i < x.length; i++) cmp(pathStr + '[' + i + ']', x[i], y[i]);
    return;
  }
  if (x && typeof x === 'object') {
    if (!y || typeof y !== 'object') return diffs.push(pathStr + ': object/non-object');
    const keys = new Set([...Object.keys(x), ...Object.keys(y)]);
    for (const k of keys) cmp(pathStr + '.' + k, x[k], y[k]);
    return;
  }
  if (typeof x === 'number' && typeof y === 'number') {
    // bit-exact required: the port must reproduce the PRNG stream
    if (!Object.is(x, y)) diffs.push(pathStr + ': ' + x + ' vs ' + y);
    return;
  }
  if (x !== y) diffs.push(pathStr + ': ' + JSON.stringify(x) + ' vs ' + JSON.stringify(y));
}
cmp('geometry', a, b);

const censusOrig = orig.countGeometryElements(a);
const censusPort = port.countGeometryElements(b);

console.log('source            wizkoo-app @ ' + PIN + '  (e1a90b2 + authorized q3 amendment)');
console.log('volume/seed       spectacle / ' + SEED);
console.log('');
console.log('census original   ' + censusOrig);
console.log('census port       ' + censusPort);
console.log('census certified  ' + CERTIFIED_CENSUS + '  (per a62dc1d commit message)');
console.log('');
const counts = g => ({
  far: g.far.length, near: g.near.length,
  filigreeStars: g.filigree.reduce((n, c) => n + c.stars.length, 0),
  filigreeStrokes: g.filigree.reduce((n, c) => n + c.strokes.length, 0),
  nebulae: g.nebulae.length, shooters: g.shooters.length,
  drift: g.atmosphere.drift.length, lobes: g.atmosphere.lobes.length,
  milkyDust: g.atmosphere.milky ? g.atmosphere.milky.dust.length : 0,
  wisps: g.atmosphere.wisps.length
});
console.log('layer census      ' + JSON.stringify(counts(a)));
console.log('port census       ' + JSON.stringify(counts(b)));
console.log('');

let bad = false;
if (diffs.length) {
  bad = true;
  console.log('GEOMETRY DIVERGENCE: ' + diffs.length + ' field(s)');
  diffs.slice(0, 25).forEach(d => console.log('  ' + d));
  if (diffs.length > 25) console.log('  ... and ' + (diffs.length - 25) + ' more');
} else {
  console.log('GEOMETRY: bit-exact identical across every field. VERBATIM.');
}
if (censusOrig !== censusPort) { bad = true; console.log('CENSUS MISMATCH port vs original'); }
if (censusOrig !== CERTIFIED_CENSUS) {
  console.log('NOTE: original census ' + censusOrig + ' != documented ' + CERTIFIED_CENSUS +
              ' (documented figure may count differently; port still matches original)');
}
process.exit(bad ? 1 : 0);
