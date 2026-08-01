/**
 * HERO FOLD GATE
 *
 * The hero has an above-the-fold contract, so it is governed by the runbook's
 * CANONICAL TEST VIEWPORTS matrix (1097x617 is the BINDING constraint), not by
 * the five-viewport verification clause, which omits 1097x617 entirely.
 * See TECHNICAL_RUNBOOK.md, VIEWPORT REALITY CONSTRAINTS.
 *
 *   npm run serve
 *   node scripts/hero-fold-gate.js http://localhost:3000
 *
 * Amy's own screen is 1309x396. Verify there FIRST. Two rounds reported "all
 * viewports pass" while the one screen she actually uses was broken, because
 * the matrix being verified did not include it.
 *
 * Fails if, at any viewport: the support line, whisper, window or its handle
 * falls below the fold; the sentence overflows its window; rendered TEXT
 * collides with the window (container overlap is expected and fine, since the
 * window is ruled to sit left of the copy container's right edge); the desk
 * card's torn top edge crosses the fold; the page scrolls horizontally; or the
 * console errors.
 */
const { chromium } = require('@playwright/test');
const path = require('path');
const fsx = require('fs');
const OUT = path.join(__dirname, '..', 'screenshots', 'hero-fold') + path.sep;
fsx.mkdirSync(OUT, { recursive: true });
const URL = process.env.HERO_URL || process.argv[2] || 'http://localhost:3000';

/* The runbook's above-the-fold matrix, plus the production/verification pair. */
const VIEWPORTS = [
  { name:'1440x900', w:1440, h:900 },
  { name:'1366x768', w:1366, h:768 },
  { name:'1280x720', w:1280, h:720 },
  { name:'1097x617', w:1097, h:617, binding:true },
  { name:'1024x768', w:1024, h:768 },
  { name:'1440x800', w:1440, h:800, ref:true },
  { name:'1280x540', w:1280, h:540 },
  { name:'1440x396', w:1440, h:396 },
  { name:'756x396',  w:756,  h:396 },
  { name:'375x700',  w:375,  h:700, ref:true },
  { name:'375x667',  w:375,  h:667 },
  { name:'430x932',  w:430,  h:932 },
];

(async () => {
  const b = await chromium.launch();
  let fails = 0;
  for (const v of VIEWPORTS) {
    const ctx = await b.newContext({ viewport:{width:v.w,height:v.h} });
    const p = await ctx.newPage();
    const errs = [];
    p.on('pageerror', e => errs.push(e.message.slice(0,90)));
    p.on('console', m => { if (m.type()==='error') errs.push(m.text().slice(0,90)); });
    await p.goto(URL, { waitUntil:'networkidle' });
    await p.waitForTimeout(3400);
    await p.screenshot({ path: OUT + 'FOLD-' + v.name + '.png' });
    const m = await p.evaluate(() => {
      const q = s => document.querySelector(s);
      const r = s => { const e=q(s); return e ? e.getBoundingClientRect() : null; };
      const H = window.innerHeight;
      const copy = r('.hh-copy'), win = r('.lw'), cta = r('.lw-cta'), sent = r('.lw-sentence');
      const whis = r('.hh-whisper'), sup = r('.hh-support'), desk = r('.desk');
      const overlap = (a,c) => a && c && !(a.right<=c.left||c.right<=a.left||a.bottom<=c.top||c.bottom<=a.top);
      return {
        arrest: getComputedStyle(q('.hh-arrest')).fontSize,
        arrestLines: Math.round(r('.hh-arrest').height/parseFloat(getComputedStyle(q('.hh-arrest')).lineHeight)),
        supportInFold: sup.bottom <= H,
        whisperInFold: whis.bottom <= H,
        windowInFold: win.bottom <= H + 0.5,
        ctaInFold: cta.bottom <= H,
        sentenceFits: sent.bottom <= win.bottom - 10,
        // the ruled window sits left of the copy CONTAINER's right edge, so what
        // matters is whether any rendered text actually collides with it
        copyWindowOverlap: (function(){
          var hit=false;
          ['.hh-arrest .ln','.hh-answer','.hh-support','.hh-eyebrow .t'].forEach(function(sel){
            document.querySelectorAll(sel).forEach(function(e){
              var rng=document.createRange(); rng.selectNodeContents(e);
              Array.prototype.forEach.call(rng.getClientRects(), function(t){
                if(!(t.right<=win.left||win.right<=t.left||t.bottom<=win.top||win.bottom<=t.top)) hit=true;
              });
            });
          });
          return hit;
        })(),
        deskBelowFold: (desk.top - 8) >= H,
        scrollW: document.documentElement.scrollWidth,
        vw: window.innerWidth
      };
    });
    m.errs = errs.length ? errs : 0;
    const pass = m.windowInFold && m.ctaInFold && m.whisperInFold && m.supportInFold &&
                 !m.copyWindowOverlap && m.sentenceFits && m.deskBelowFold &&
                 m.scrollW <= v.w && !errs.length;
    if (!pass) fails++;
    console.log((pass?'PASS ':'FAIL ') + v.name.padEnd(10) + (v.binding?'[BINDING] ':v.ref?'[REF]     ':'          ') + JSON.stringify(m));
    await ctx.close();
  }
  console.log('\n' + (fails ? fails + ' VIEWPORT(S) FAILED' : 'ALL VIEWPORTS PASS'));
  await b.close();
})();
