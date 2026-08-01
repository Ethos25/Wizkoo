/**
 * DIAGNOSTIC ONLY — changes nothing.
 * Scores the 7A/7B call at a given viewport and shows the arithmetic, then
 * sweeps viewport height to find where 7A actually starts winning.
 */
const { chromium } = require('@playwright/test');

const URL = process.argv[2] || 'https://excellence-round-1--wizkoo.netlify.app';
const REF = { desktop: [532, 178], mobile: [299, 64] };
const BIAS = 0.10, HYST = 0.05;

const probe = async (p, w, h) => {
  await p.setViewportSize({ width: w, height: h });
  await p.goto(URL, { waitUntil: 'networkidle' });
  await p.waitForTimeout(2600);
  return p.evaluate(() => {
    const q = (s) => document.querySelector(s);
    const W = q('.lw').getBoundingClientRect();
    const band = q('.lw-band').getBoundingClientRect();
    const fig = q('.lw-figure').getBoundingClientRect();
    const F = q('.lw-foot').getBoundingClientRect();
    const hh = q('.hh');
    // resolve --u by measuring a known 553u box
    const u = W.width / 553;
    return {
      u: +u.toFixed(5),
      uTerms: {
        vw: +(window.innerWidth / 1440).toFixed(5),
        vh: +((hh.getBoundingClientRect().height) / 718).toFixed(5),
        heroH: +hh.getBoundingClientRect().height.toFixed(1),
      },
      win: [+W.width.toFixed(2), +W.height.toFixed(2)],
      bandBox: [+band.width.toFixed(2), +band.height.toFixed(2)],
      figure: [+fig.width.toFixed(2), +fig.height.toFixed(2)],
      size: q('.lw-band').getAttribute('data-size'),
      bandTop: +(band.top - W.top).toFixed(2),
      footTop: +(F.top - W.top).toFixed(2),
    };
  });
};

const score = (availW, availH) => {
  const out = {};
  for (const k of ['desktop', 'mobile']) {
    const ar = REF[k][0] / REF[k][1];
    const w = Math.min(availW, availH * ar);
    out[k] = { contained: [+w.toFixed(2), +(w / ar).toFixed(2)],
               raw: +Math.abs(Math.log(w / REF[k][0])).toFixed(5) };
  }
  out.desktop.biased = +(out.desktop.raw + BIAS).toFixed(5);
  out.mobile.biased = out.mobile.raw;
  out.winner = out.desktop.biased <= out.mobile.biased ? 'desktop (7A)' : 'mobile (7B)';
  out.margin = +Math.abs(out.desktop.biased - out.mobile.biased).toFixed(5);
  return out;
};

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();

  // ── 1. Amy's exact viewport ──
  const m = await probe(p, 1966, 594);
  const availW = m.bandBox[0], availH = m.bandBox[1];
  const s = score(availW, availH);
  console.log('══ 1966 x 594 — the call, with the arithmetic ══\n');
  console.log(`  --u candidates:  1px  |  100vw/1440 = ${m.uTerms.vw}  |  (100svh-82)/718 = ${m.uTerms.vh}`);
  console.log(`  --u = min(...)   = ${m.u}          <- ${m.u < 0.999 ? 'CLAMPED BY VIEWPORT HEIGHT' : 'not clamped'}`);
  console.log(`  window           = ${m.win[0]} x ${m.win[1]}   (553u x 335u at u=${m.u})`);
  console.log(`  reserved band    = ${availW} x ${availH}   (band top ${m.bandTop}, foot top ${m.footTop})`);
  console.log(`\n  contained sizes (largest box of that ratio fitting ${availW} x ${availH}):`);
  console.log(`    7A (532x178, ar 2.98876)  -> ${s.desktop.contained[0]} x ${s.desktop.contained[1]}`);
  console.log(`    7B (299x64,  ar 4.67188)  -> ${s.mobile.contained[0]} x ${s.mobile.contained[1]}`);
  console.log(`\n  scores  |ln(contained / own reference)|`);
  console.log(`    7A: |ln(${s.desktop.contained[0]}/532)| = |ln(${(s.desktop.contained[0]/532).toFixed(5)})| = ${s.desktop.raw}`);
  console.log(`        + BIAS 0.10                                    = ${s.desktop.biased}`);
  console.log(`    7B: |ln(${s.mobile.contained[0]}/299)| = |ln(${(s.mobile.contained[0]/299).toFixed(5)})| = ${s.mobile.raw}`);
  console.log(`        (no bias)                                      = ${s.mobile.biased}`);
  console.log(`\n  WINNER: ${s.winner}, by ${s.margin} in log space.`);
  console.log(`  Rendered: ${m.size === 'desktop' ? '7A' : '7B'} at ${m.figure[0]} x ${m.figure[1]}`);
  console.log(`  Bias effect: without it 7A scores ${s.desktop.raw} vs 7B ${s.mobile.raw} -> ` +
              `${s.desktop.raw <= s.mobile.raw ? '7A' : '7B'} still wins. ` +
              `The bias is NOT what decided this.`);
  console.log(`  Hysteresis: fresh load has no prior state, so HYST=${HYST} does not apply here.`);

  // ── 2. sweep viewport height at a wide viewport ──
  console.log('\n══ 2. Where does 7A actually win? (viewport width fixed at 1966) ══\n');
  console.log('  vpH    --u     window        band box      7A cont.  7B cont.  7A+bias   7B      winner');
  for (const vh of [560, 594, 640, 680, 700, 720, 735, 740, 760, 800, 900, 1080, 1200]) {
    const r = await probe(p, 1966, vh);
    const sc = score(r.bandBox[0], r.bandBox[1]);
    console.log(
      `  ${String(vh).padEnd(6)} ${r.u.toFixed(3)}   ${(r.win[0] + 'x' + r.win[1]).padEnd(13)} ` +
      `${(r.bandBox[0] + 'x' + r.bandBox[1]).padEnd(13)} ` +
      `${String(sc.desktop.contained[0]).padStart(7)}   ${String(sc.mobile.contained[0]).padStart(7)}   ` +
      `${sc.desktop.biased.toFixed(4)}   ${sc.mobile.biased.toFixed(4)}  ` +
      `${r.size === 'desktop' ? '7A' : '7B'}`
    );
  }
  await b.close();
})();
