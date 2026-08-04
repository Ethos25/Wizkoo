/**
 * PROPOSAL PROTOTYPE — writes nothing, commits nothing.
 * Overrides --u in the page only, to measure a candidate scaling law across
 * the viewport range before anything is implemented.
 *
 *   node scripts/hero-u-proposal.js <url> <divisor> <cap>
 *   node scripts/hero-u-proposal.js <url> current      # the shipped law
 *
 * Reports per viewport: --u, window, figure + variant, both columns' fit,
 * and whether anything clips. The desktop rule only — the mobile branch
 * (max-width:767px) re-declares --u and is left exactly as it ships.
 */
const { chromium } = require('@playwright/test');

const URL = process.argv[2] || 'https://excellence-round-1--wizkoo.netlify.app';
const MODE = process.argv[3] || '465';
const CAP = process.argv[4] || '1.10';

const VIEWS = [
  ['2560x1440', 2560, 1440], ['1966x594 AMY', 1966, 594], ['1920x1080', 1920, 1080],
  ['1600x900', 1600, 900], ['1536x864', 1536, 864], ['1440x800 RULED', 1440, 800],
  ['1440x396', 1440, 396], ['1366x768', 1366, 768], ['1280x650', 1280, 650],
  ['1280x800', 1280, 800], ['1024x768', 1024, 768], ['900x700', 900, 700],
  ['820x1180', 820, 1180], ['768x1024', 768, 1024], ['768x420 stress', 768, 420],
  ['600x900', 600, 900],
  ['430x932 phone', 430, 932], ['390x844 phone', 390, 844],
  ['375x667 phone', 375, 667], ['360x640 phone', 360, 640],
];

const PROBE = () => {
  const q = (s) => document.querySelector(s);
  const R = (s) => { const e = q(s); return e ? e.getBoundingClientRect() : null; };
  const hh = R('.hh'), W = R('.lw'), copy = R('.hh-copy'), grp = R('.hh-group');
  const fig = R('.lw-figure');
  const u = W.width / 553;
  const copyBottom = copy.bottom - hh.top;
  const grpTop = grp.top - hh.top;
  const clip = [];
  if (copyBottom > hh.height + 0.5) clip.push('copy +' + Math.round(copyBottom - hh.height));
  if (grpTop < -0.5) clip.push('window ' + Math.round(grpTop));
  // and anything actually painted outside the hero box
  ['.hh-eyebrow', '.hh-arrest', '.hh-answer', '.hh-support', '.hh-whisper', '.lw-mount']
    .forEach((s) => { const r = R(s); if (!r) return;
      if (r.bottom > hh.bottom + 0.5) clip.push(s.slice(1) + ' +' + Math.round(r.bottom - hh.bottom));
      if (r.top < hh.top - 0.5) clip.push(s.slice(1) + ' ' + Math.round(r.top - hh.top)); });
  const a = q('.hh-arrest'); const lh = parseFloat(getComputedStyle(a).lineHeight) || 1;
  return {
    u: +u.toFixed(4),
    heroH: +hh.height.toFixed(1),
    win: [+W.width.toFixed(0), +W.height.toFixed(0)],
    fig: fig ? [+fig.width.toFixed(0), +fig.height.toFixed(0)] : null,
    size: q('.lw-band') ? q('.lw-band').getAttribute('data-size') : null,
    copyBottom: +copyBottom.toFixed(1),
    grpTop: +grpTop.toFixed(1),
    lines: Math.round(R('.hh-arrest').height / lh),
    clip: [...new Set(clip)],
  };
};

(async () => {
  const b = await chromium.launch();
  const law = MODE === 'current'
    ? null
    : `min(${CAP}px, calc(100vw / 1440), max(0.62px, calc((100svh - 82px) / ${MODE})))`;
  console.log(MODE === 'current'
    ? 'LAW: as shipped —  min(1px, 100vw/1440, max(0.62px, (100svh-82)/718))'
    : `LAW: --u = ${law}\n     (desktop rule only; the max-width:767px branch is untouched)`);
  console.log('');
  console.log('viewport         --u     window     figure       fig  ln  copyBot/hero   winTop  clip');
  console.log('─'.repeat(100));
  let clips = 0;
  for (const [name, w, h] of VIEWS) {
    const ctx = await b.newContext();
    if (law) {
      await ctx.addInitScript((l) => {
        document.addEventListener('DOMContentLoaded', () => {
          const s = document.createElement('style');
          // Desktop rule only: the media query below 768 re-declares --u and wins.
          s.textContent = `@media(min-width:768px){.hh{--u:${l} !important}}`;
          document.head.appendChild(s);
        });
      }, law);
    }
    const p = await ctx.newPage();
    await p.setViewportSize({ width: w, height: h });
    await p.goto(URL, { waitUntil: 'networkidle' });
    await p.waitForTimeout(3400);
    const m = await p.evaluate(PROBE);
    if (m.clip.length) clips++;
    console.log(
      `${name.padEnd(16)} ${m.u.toFixed(3).padStart(6)}  ${(m.win[0] + 'x' + m.win[1]).padEnd(10)} ` +
      `${(m.fig ? m.fig[0] + 'x' + m.fig[1] : '-').padEnd(12)} ` +
      `${(m.size === 'desktop' ? '7A' : '7B').padEnd(4)} ${String(m.lines).padStart(2)}  ` +
      `${(m.copyBottom + '/' + m.heroH).padEnd(13)} ${String(m.grpTop).padStart(6)}  ` +
      `${m.clip.length ? '✗ ' + m.clip.join(', ') : 'ok'}`
    );
    await ctx.close();
  }
  console.log('─'.repeat(100));
  console.log(clips === 0 ? '✓ nothing clips at any viewport' : `✗ ${clips} viewport(s) clip`);
  await b.close();
})();
