/**
 * DIAGNOSTIC ONLY — changes nothing.
 * Is the FIGURE sitting high inside its band, or is the BAND itself high in
 * the window with unused space beneath it?
 *
 * Reports, per viewport, relative to the window's own top edge:
 *   band top / height / bottom      the reserved box
 *   figure top / height / bottom    the contained figure inside it
 *   slack under the figure          band bottom - figure bottom
 *   lowest star, lowest label       and their gaps to the handle rule
 *   the spec's own empty margins    figure y30..y159 of 178
 */
const { chromium } = require('@playwright/test');

const URL = process.argv[2] || 'https://excellence-round-1--wizkoo.netlify.app';
const VIEWS = [[1966, 594, 'AMY 1966x594'], [1440, 800, '1440x800 RULED'],
               [1920, 1080, '1920x1080'], [1536, 864, '1536x864'], [375, 667, '375x667 phone']];

const PROBE = () => {
  const q = (s) => document.querySelector(s);
  const W = q('.lw').getBoundingClientRect();
  const band = q('.lw-band').getBoundingClientRect();
  const fig = q('.lw-figure').getBoundingClientRect();
  const foot = q('.lw-foot').getBoundingClientRect();
  const sent = q('.lw-sentence').getBoundingClientRect();
  const r = (v) => +Number(v).toFixed(2);

  let loStar = null, loLabel = null;
  q('.lw-figure').querySelectorAll('[data-star]').forEach((el) => {
    const b = el.getBoundingClientRect();
    if (!loStar || b.bottom > loStar.bottom) loStar = { k: el.dataset.star, bottom: b.bottom };
  });
  q('.lw-figure').querySelectorAll('.wkc-label').forEach((el) => {
    const b = el.getBoundingClientRect();
    if (!loLabel || b.bottom > loLabel.bottom) loLabel = { k: el.dataset.label, bottom: b.bottom };
  });

  const size = q('.lw-band').getAttribute('data-size');
  /* Spec: 7A fills its band y30..y159 of 178. 7B: theme star y8, lowest y56 of 64. */
  const specTop = size === 'desktop' ? 30 / 178 : 8 / 64;
  const specBot = size === 'desktop' ? 159 / 178 : 56 / 64;

  return {
    size,
    win: [r(W.width), r(W.height)],
    sentBottom: r(sent.bottom - W.top),
    band: { top: r(band.top - W.top), h: r(band.height), bottom: r(band.bottom - W.top) },
    fig: { top: r(fig.top - W.top), h: r(fig.height), bottom: r(fig.bottom - W.top), w: r(fig.width) },
    slackUnderFigure: r(band.bottom - fig.bottom),
    ruleTop: r(foot.top - W.top),
    bandToRule: r(foot.top - band.bottom),
    figToRule: r(foot.top - fig.bottom),
    loStar: { k: loStar.k, bottom: r(loStar.bottom - W.top), toRule: r(foot.top - loStar.bottom) },
    loLabel: { k: loLabel.k, bottom: r(loLabel.bottom - W.top), toRule: r(foot.top - loLabel.bottom) },
    /* the figure box's own designed empty margins, in px at this size */
    specEmptyTop: r(fig.height * specTop),
    specEmptyBottom: r(fig.height * (1 - specBot)),
    windowBottomGap: r(W.height - foot.bottom),
  };
};

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  for (const [w, h, name] of VIEWS) {
    await p.setViewportSize({ width: w, height: h });
    await p.goto(URL, { waitUntil: 'networkidle' });
    await p.waitForTimeout(4000);
    const m = await p.evaluate(PROBE);
    const pct = (v) => (v / m.win[1] * 100).toFixed(1) + '%';
    console.log(`\n══ ${name}  —  window ${m.win[0]} x ${m.win[1]}  ·  ${m.size === 'desktop' ? '7A' : '7B'}`);
    console.log(`   sentence bottom      ${String(m.sentBottom).padStart(7)}`);
    console.log(`   BAND   top           ${String(m.band.top).padStart(7)}   height ${String(m.band.h).padStart(7)}   bottom ${String(m.band.bottom).padStart(7)}  (${pct(m.band.h)} of window)`);
    console.log(`   FIGURE top           ${String(m.fig.top).padStart(7)}   height ${String(m.fig.h).padStart(7)}   bottom ${String(m.fig.bottom).padStart(7)}   width ${m.fig.w}`);
    console.log(`   slack under figure   ${String(m.slackUnderFigure).padStart(7)}   <- band bottom minus figure bottom`);
    console.log(`   handle rule at       ${String(m.ruleTop).padStart(7)}   band->rule ${String(m.bandToRule).padStart(6)}   figure->rule ${String(m.figToRule).padStart(6)}`);
    console.log(`   lowest star  ${m.loStar.k.padEnd(10)} bottom ${String(m.loStar.bottom).padStart(7)}   -> rule ${String(m.loStar.toRule).padStart(6)}`);
    console.log(`   lowest label ${m.loLabel.k.padEnd(10)} bottom ${String(m.loLabel.bottom).padStart(7)}   -> rule ${String(m.loLabel.toRule).padStart(6)}  (${pct(m.loLabel.toRule)} of window)`);
    console.log(`   spec's own empty margins inside the figure: top ${m.specEmptyTop}  bottom ${m.specEmptyBottom}`);
  }
  await b.close();
})();
