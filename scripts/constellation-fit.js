/**
 * Does the spec's band now fit at its own proportions, and is the chrome that
 * paid for it cramped? Reports, per viewport:
 *   · the band's actual aspect against the spec's (2.9888 / 4.6719)
 *   · the clearance above (sentence -> band) and below (band -> handle rule)
 *   · every piece of remaining air, against the spec's own value for the same
 *     gap scaled into this window — the number that says "tight" or "cramped"
 *   · where the tether launches vs where "space" actually is
 */
const { chromium } = require('@playwright/test');

const URL = process.argv[2] || 'http://localhost:3000';
const VIEWPORTS = [[1440, 900], [1440, 800], [1440, 396], [1024, 768], [768, 1024], [390, 844], [375, 667]];

/* The spec's own air, in its own frame units, for the same five gaps. */
const SPEC = {
  desktop: { win: [620, 376], bandAspect: 532 / 178,
             air: { bodyTop: 30, sentGap: 18, bandToRule: 9.2, footPadTop: 14, footBottom: 18 } },
  mobile:  { win: [335, 203], bandAspect: 299 / 64,
             air: { bodyTop: 16, sentGap: 10, bandToRule: 18.1, footPadTop: 10, footBottom: 12 } },
};

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  for (const [vw, vh] of VIEWPORTS) {
    await p.setViewportSize({ width: vw, height: vh });
    await p.goto(URL, { waitUntil: 'networkidle' });
    await p.waitForTimeout(1500);
    const m = await p.evaluate(() => {
      const q = (s) => document.querySelector(s);
      const r = (s) => q(s).getBoundingClientRect();
      const W = r('.lw'), Bd = r('.lw-band'), S = r('.lw-sentence'),
            F = r('.lw-foot'), L = r('.lw-label'), T = r('.lw-theme'), Bo = r('.lw-body');
      const cs = getComputedStyle(q('.lw-foot'));
      const star = q('.lw-band [data-star="space"]');
      const sr = star ? star.getBoundingClientRect() : null;
      const tp = q('.lw-band .wkc-tether path');
      return {
        win: [+W.width.toFixed(2), +W.height.toFixed(2)],
        band: [+Bd.width.toFixed(2), +Bd.height.toFixed(2)],
        bandTop: +(Bd.top - W.top).toFixed(2), bandBottom: +(Bd.bottom - W.top).toFixed(2),
        sideInset: +(Bo.left - W.left).toFixed(2), bandInset: +(Bd.left - W.left).toFixed(2),
        air: {
          bodyTop: +(L.top - W.top).toFixed(2),
          sentGap: +(S.top - L.bottom).toFixed(2),
          bandToRule: +(F.top - Bd.bottom).toFixed(2),
          footPadTop: parseFloat(cs.paddingTop),
          footBottom: +(W.bottom - F.bottom).toFixed(2),
        },
        sentToBand: +(Bd.top - S.bottom).toFixed(2),
        themeXpct: +((T.left + T.width / 2 - W.left) / W.width * 100).toFixed(2),
        starXpct: sr ? +((sr.left + sr.width / 2 - W.left) / W.width * 100).toFixed(2) : null,
        tetherD: tp ? tp.getAttribute('d') : null,
        stars: q('.lw-band') ? q('.lw-band').querySelectorAll('[data-star]').length : 0,
        arms: q('.lw-band') ? q('.lw-band').querySelectorAll('.wkc-arm').length : 0,
      };
    });
    const key = vw <= 767 ? 'mobile' : 'desktop';
    const S = SPEC[key];
    const scale = m.win[1] / S.win[1];          /* this window vs the spec's */
    const aspect = m.band[0] / m.band[1];
    const dev = ((aspect / S.bandAspect - 1) * 100).toFixed(2);
    console.log(`\n${vw}x${vh}  win ${m.win[0]}x${m.win[1]}  band ${m.band[0]}x${m.band[1]}` +
                `  aspect ${aspect.toFixed(4)} vs spec ${S.bandAspect.toFixed(4)} (${dev >= 0 ? '+' : ''}${dev}%)`);
    console.log(`  band top ${m.bandTop} · bottom ${m.bandBottom} · inset ${m.bandInset} (type ${m.sideInset})` +
                `  · sentence->band ${m.sentToBand}`);
    console.log(`  stars ${m.stars}/7  arms ${m.arms}/7  theme word @${m.themeXpct}%  theme star @${m.starXpct}%`);
    console.log('  air            now   spec-equiv   ratio');
    let min = 1e9, minName = '';
    for (const k of Object.keys(S.air)) {
      const want = S.air[k] * scale, got = m.air[k], ratio = got / want;
      if (ratio < min) { min = ratio; minName = k; }
      console.log(`  ${k.padEnd(13)} ${got.toFixed(2).padStart(6)} ${want.toFixed(2).padStart(10)}` +
                  `   ${(ratio * 100).toFixed(0)}%${ratio < 0.6 ? '  ← CRAMPED' : ''}`);
    }
    console.log(`  tightest: ${minName} at ${(min * 100).toFixed(0)}% of the spec's own air`);
  }
  await b.close();
})();
