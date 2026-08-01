/**
 * SKY TUNING REPORT
 *
 * The hero sky is no longer a verbatim port; by ruling it is a deep-field crop
 * re-tuned for the aperture. What has to hold is not bit-exactness but PERCEIVED
 * DENSITY: the window must read as rich as /start's field reads at full size.
 *
 * This reports both sides of that comparison and fails if they drift apart.
 *
 *   node scripts/sky-tuning-report.js
 *
 * /start's field is measured out of the certified primitive in the wizkoo-app git
 * objects, so the target is read from the product rather than remembered here.
 * A parse failure or a non-finite density is a hard failure, never a silent pass.
 */
const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const APP = process.env.WIZKOO_APP || path.join(process.env.USERPROFILE || process.env.HOME, 'Desktop', 'wizkoo-app');
const PIN = 'a62dc1d';
const WINDOW = { w: 620, h: 376 };      /* the ruled window, reference px */
const TOLERANCE = 0.12;                 /* 12% of perceived density */

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
const g = sky.buildSky(sky.SEED);
const stars = sky.starCount(g);
const winDensity = stars / (WINDOW.w * WINDOW.h) * 1000;
const anchors = g.near.filter(s => s.cls === 'anchor').length;
const drift = Math.abs(winDensity - refDensity) / refDensity;

console.log('reference field   wizkoo-app @ ' + PIN);
console.log('  /start          ' + ref.w + 'x' + ref.h + ', ' + ref.stars + ' stars');
console.log('  content hole    ' + Math.round(holeArea).toLocaleString() + 'px2 excluded (superellipse, exponent ' + ref.holeExponent + ')');
console.log('  density         ' + refDensity.toFixed(3) + ' stars per 1000px2 of starred field');
console.log('');
console.log('hero window       ' + WINDOW.w + 'x' + WINDOW.h + ', ' + stars + ' stars, no content hole');
console.log('  density         ' + winDensity.toFixed(3) + ' stars per 1000px2');
console.log('  anchors         ' + anchors + '  (ruled 2 to 4)');
console.log('  shooters        ' + g.shooters.length + ' at ' + g.shooters.map(s => Math.round(s.period) + 's').join(', ') + '  (ruled one, 60-120s)');
console.log('');
console.log('perceived density drift  ' + (drift * 100).toFixed(1) + '%  (tolerance ' + (TOLERANCE * 100) + '%)');

if (![refDensity, winDensity, drift].every(Number.isFinite)) {
  console.log('FAIL: density could not be computed');
  process.exit(1);
}
let bad = false;
if (drift > TOLERANCE) { bad = true; console.log('FAIL: density drifted from the reference field'); }
if (anchors < 2 || anchors > 4) { bad = true; console.log('FAIL: anchors outside the ruled 2 to 4'); }
if (g.shooters.length !== 1) { bad = true; console.log('FAIL: expected exactly one shooting star'); }
g.shooters.forEach(s => {
  if (s.period < 60 || s.period > 120) { bad = true; console.log('FAIL: shooter period ' + s.period.toFixed(1) + 's outside 60-120s'); }
});
if (!bad) console.log('PASS: the window reads at the reference field density.');
process.exit(bad ? 1 : 0);
