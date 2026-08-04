/**
 * LAB ORBITAL SKY — DENSITY DRIFT REPORT
 *
 * Same methodology as scripts/sky-tuning-report.js, pointed at the orbital
 * aperture instead of the hero window. The target is measured out of the
 * product's own ambientSky tokens in the wizkoo-app git objects, so it is read
 * rather than remembered. A parse failure or a non-finite density is a hard
 * failure, never a silent pass.
 *
 *   node scripts/lab-orbital-sky-report.js
 */
const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const APP = process.env.WIZKOO_APP || path.join(process.env.USERPROFILE || process.env.HOME, 'Desktop', 'wizkoo-app');
const PIN = 'a62dc1d';
const TOLERANCE = 0.12;                 /* 12% of perceived density, as ruled for the hero */

if (!fs.existsSync(path.join(APP, '.git'))) {
  console.log('SKIPPED: wizkoo-app not found at ' + APP);
  console.log('Set WIZKOO_APP to its path to measure the reference field.');
  process.exit(0);
}

const tokens = execFileSync('git', ['-C', APP, 'show', PIN + ':packages/design-tokens/src/tokens.ts'], { encoding: 'utf8' });
const block = (name) => {
  const m = tokens.match(new RegExp(name + ':\\s*\\{([^}]*)\\}'));
  return m ? m[1] : '';
};
const num = (src, k) => {
  const m = src.match(new RegExp('\\b' + k + ':\\s*([0-9.]+)'));
  return m ? Number(m[1]) : NaN;
};
const farB = block('far'), nearB = block('near'), filB = block('filigree'), holeB = block('hole');
const far = num(farB, 'faints') + num(farB, 'dust');
const near = num(nearB, 'anchors') + num(nearB, 'brights') + num(nearB, 'mids') + num(nearB, 'faints');
const fil = ((num(filB, 'starsMin') + num(filB, 'starsMax')) / 2) * num(filB, 'clusters');
const semi = num(holeB, 'semiAxis'), expo = num(holeB, 'exponent');
if (![far, near, fil, semi, expo].every(Number.isFinite)) {
  console.error('FAIL: could not parse ambientSky out of the product tokens');
  process.exit(1);
}
const ref = { w: 1232, h: 420, stars: Math.round(far + near + fil), holeSemiAxis: semi, holeExponent: expo };

function lgamma(z) {
  const c = [76.18009172947146, -86.50532032941677, 24.01409824083091,
             -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
  let x = z, y = z, tmp = x + 5.5;
  tmp -= (x + 0.5) * Math.log(tmp);
  let ser = 1.000000000190015;
  for (let j = 0; j < 6; j++) ser += c[j] / ++y;
  return -tmp + Math.log(2.5066282746310005 * ser / x);
}
/* superellipse |x/a|^n + |y/b|^n = 1 */
function superellipseArea(a, b, n) {
  const g = (z) => Math.exp(lgamma(z));
  return 4 * a * b * Math.pow(g(1 + 1 / n), 2) / g(1 + 2 / n);
}

const holeArea = superellipseArea((ref.holeSemiAxis / 100) * ref.w, (ref.holeSemiAxis / 100) * ref.h, ref.holeExponent);
const refDensity = ref.stars / (ref.w * ref.h - holeArea) * 1000;

const sky = require(path.join(__dirname, '..', 'js', 'hero-sky.js'));
const lab = require(path.join(__dirname, '..', 'js', 'lab-orbital-sky.js'));

/* The hero window, unchanged, reported alongside so a regression in either is
   visible from one command. */
const heroG = sky.buildSky(sky.SEED);
const heroDensity = sky.starCount(heroG) / (620 * 376) * 1000;

const A = lab.APERTURE;
const g = lab.buildLabSky(sky, lab.SEED);
const stars = sky.starCount(g);
const labDensity = stars / (A.w * A.h) * 1000;
const anchors = g.near.filter(s => s.cls === 'anchor').length;
const drift = Math.abs(labDensity - refDensity) / refDensity;
const areaRatio = (A.w * A.h) / (620 * 376);

console.log('reference field   wizkoo-app @ ' + PIN);
console.log('  /start          ' + ref.w + 'x' + ref.h + ', ' + ref.stars + ' stars');
console.log('  content hole    ' + Math.round(holeArea).toLocaleString() + 'px2 excluded (superellipse, exponent ' + ref.holeExponent + ')');
console.log('  density         ' + refDensity.toFixed(3) + ' stars per 1000px2 of starred field');
console.log('');
console.log('hero window       620x376, ' + sky.starCount(heroG) + ' stars');
console.log('  density         ' + heroDensity.toFixed(3) + ' stars per 1000px2');
console.log('');
console.log('orbital aperture  ' + A.w + 'x' + A.h + ', ' + stars + ' stars, no content hole');
console.log('  area            ' + (A.w * A.h).toLocaleString() + 'px2  (' + areaRatio.toFixed(2) + 'x the hero window)');
console.log('  density         ' + labDensity.toFixed(3) + ' stars per 1000px2');
console.log('  anchors         ' + anchors + '  (ruled 12: scaled by eye, not by area)');
console.log('  milky-way dust  ' + g.atmosphere.milky.dust.length + '  (atmosphere, not counted as stars)');
console.log('  nebulae         ' + g.nebulae.length);
console.log('  shooters        ' + g.shooters.length + ' at ' + g.shooters.map(s => Math.round(s.period) + 's').join(', ') + '  (ruled one, 60-120s)');
console.log('  animated nodes  ' + (stars + g.atmosphere.milky.dust.length + g.nebulae.length) + ' total sky elements');
console.log('');
console.log('perceived density drift  ' + (drift * 100).toFixed(1) + '%  (tolerance ' + (TOLERANCE * 100) + '%)');

if (![refDensity, labDensity, drift].every(Number.isFinite)) {
  console.log('FAIL: density could not be computed');
  process.exit(1);
}
let bad = false;
if (drift > TOLERANCE) { bad = true; console.log('FAIL: density drifted from the reference field'); }
if (anchors !== 12) { bad = true; console.log('FAIL: anchors moved off the ruled 12'); }
if (g.shooters.length !== 1) { bad = true; console.log('FAIL: expected exactly one shooting star'); }
g.shooters.forEach(s => {
  if (s.period < 60 || s.period > 120) { bad = true; console.log('FAIL: shooter period ' + s.period.toFixed(1) + 's outside 60-120s'); }
});
/* The swap must not leak: the hero window has to read exactly as it did. */
const heroAfter = sky.starCount(sky.buildSky(sky.SEED));
if (heroAfter !== sky.starCount(heroG)) {
  bad = true;
  console.log('FAIL: the lab FIELD leaked into the hero sky (' + sky.starCount(heroG) + ' -> ' + heroAfter + ')');
}
if (!bad) console.log('PASS: the orbital aperture reads at the reference field density, and the hero sky is untouched.');
process.exit(bad ? 1 : 0);
