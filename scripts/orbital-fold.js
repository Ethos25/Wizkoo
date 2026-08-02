/* Where the figure sits against the fold, at a stated viewport.
   "Fold" = the viewport's bottom edge with the SECTION's top at the viewport
   top, which is what she lands on scrolling into it. */
const { chromium } = require('@playwright/test');
const BASE = (process.argv[2] || '').replace(/\/$/, '');
const W = Number(process.argv[3] || 1966), H = Number(process.argv[4] || 594);
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: W, height: H } });
  await p.addStyleTag({ content: '*{scroll-behavior:auto!important}' }).catch(() => {});
  await p.goto(BASE + '/', { waitUntil: 'networkidle' });
  await p.evaluate(() => {
    const s = document.querySelector('#linen-hero');
    window.scrollTo(0, s.getBoundingClientRect().top + window.scrollY);
  });
  await p.waitForTimeout(4000);
  const r = await p.evaluate(() => {
    const sec = document.querySelector('#linen-hero');
    const sr = sec.getBoundingClientRect();
    let top = Infinity, bot = -Infinity, left = Infinity, right = -Infinity;
    const parts = [];
    sec.querySelectorAll('.lo-label-depth,.lo-node,.lo-nucleus,path.lo-path').forEach((e) => {
      const b = e.getBoundingClientRect();
      if (!b.width && !b.height) return;
      top = Math.min(top, b.top); bot = Math.max(bot, b.bottom);
      left = Math.min(left, b.left); right = Math.max(right, b.right);
    });
    sec.querySelectorAll('.lo-label-depth').forEach((l) => {
      const b = l.getBoundingClientRect();
      parts.push({ id: l.dataset.label, top: Math.round(b.top), bottom: Math.round(b.bottom) });
    });
    const nuc = sec.querySelector('.lo-nucleus').getBoundingClientRect();
    const svg = sec.querySelector('.orb-svg'), vb = svg.viewBox.baseVal, br = svg.getBoundingClientRect();
    return { sectionTop: sr.top, sectionH: sr.height, fold: window.innerHeight,
      figure: { top, bottom: bot, left, right, h: bot - top, w: right - left },
      nucleus: { top: nuc.top, bottom: nuc.bottom, d: nuc.height },
      scale: Math.min(br.width / vb.width, br.height / vb.height),
      vb: [vb.x, vb.y, vb.width, vb.height], parts };
  });
  const below = r.figure.bottom - r.fold;
  console.log(`viewport ${W}x${H}   section top ${r.figure.top >= 0 ? '' : ''}${r.sectionTop.toFixed(0)}  section height ${r.sectionH.toFixed(0)}  fold ${r.fold}`);
  console.log(`figure  top ${r.figure.top.toFixed(0)}   bottom ${r.figure.bottom.toFixed(0)}   height ${r.figure.h.toFixed(0)}   width ${r.figure.w.toFixed(0)}   scale ${r.scale.toFixed(3)}`);
  console.log(`nucleus top ${r.nucleus.top.toFixed(0)}   bottom ${r.nucleus.bottom.toFixed(0)}   diameter ${r.nucleus.d.toFixed(0)}`);
  console.log(`BELOW THE FOLD: ${below > 0 ? below.toFixed(0) + 'px of the figure (' + (below / r.figure.h * 100).toFixed(1) + '% of its height)' : 'none, clears by ' + (-below).toFixed(0) + 'px'}`);
  r.parts.filter((x) => x.bottom > r.fold).forEach((x) => console.log(`  cut: ${x.id}  bottom ${x.bottom} vs fold ${r.fold}`));
  await b.close();
})();
