/* The amplitude ceiling against the label guarantee, re-solved at the ported
   geometry — the same question scripts/lab-orbital-drift-solve.js answered at
   the lab's, walked in-browser against real rendered text.

   Bar (the lab's, verbatim in spirit): wherever two labels touch, the dimmer
   has receded to background — 0.45 or under. Clean = no corner of the box
   violates it. Binary-searches the largest amplitude scale s on [0,1], then
   reports K = 3000*s. */
const { chromium } = require('@playwright/test');
const BASE = (process.argv[2] || '').replace(/\/$/, '');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(BASE + '/', { waitUntil: 'networkidle' });
  await p.evaluate(() => document.querySelector('#linen-hero').scrollIntoView());
  await p.waitForTimeout(3000);
  const r = await p.evaluate(() => {
    const A = window.WizkooOrbital;
    const ids = A.sys.nodes.map((n) => n.def.id);
    const amps = A.sys.nodes.map((n) => n.amp);
    function boxes() {
      return A.sys.nodes.map((n) => {
        let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
        n.label.querySelectorAll('text').forEach((t) => {
          const bb = t.getBoundingClientRect();
          x0 = Math.min(x0, bb.left); y0 = Math.min(y0, bb.top);
          x1 = Math.max(x1, bb.right); y1 = Math.max(y1, bb.bottom);
        });
        return { id: n.def.id, x: x0, y: y0, w: x1 - x0, h: y1 - y0,
                 op: Number(n.label.getAttribute('opacity')) };
      });
    }
    function worst() {
      const bs = boxes(); let w = null;
      for (let i = 0; i < bs.length; i++) for (let j = i + 1; j < bs.length; j++) {
        const a = bs[i], c = bs[j];
        const ox = Math.min(a.x + a.w, c.x + c.w) - Math.max(a.x, c.x);
        const oy = Math.min(a.y + a.h, c.y + c.h) - Math.max(a.y, c.y);
        if (ox > 0 && oy > 0) {
          const dim = Math.min(a.op, c.op);
          if (dim > 0.45 && (!w || ox * oy > w.area)) w = { pair: a.id + ' x ' + c.id, area: ox * oy, dim };
        }
      }
      return w;
    }
    function clean(s) {
      let bad = null, corner = [];
      const rec = (k, map) => {
        if (bad) return;
        if (k === ids.length) { A.setT(map); const w = worst(); if (w) bad = w; return; }
        [-1, 0, 1].forEach((sg) => {
          if (bad) return;
          const m2 = Object.assign({}, map);
          m2[ids[k]] = A.sys.nodes[k].def.t + sg * amps[k] * s;
          rec(k + 1, m2);
        });
      };
      rec(0, {});
      return bad;
    }
    let lo = 0.3, hi = 1.0, log = [];
    if (!clean(1.0)) { lo = 1.0; log.push('s=1.000 clean'); }
    else {
      for (let it = 0; it < 8; it++) {
        const mid = (lo + hi) / 2, bad = clean(mid);
        log.push('s=' + mid.toFixed(3) + (bad ? '  VIOLATES  ' + bad.pair + ' ' + bad.area.toFixed(0) + 'px2 dim ' + bad.dim.toFixed(3) : '  clean'));
        if (bad) hi = mid; else lo = mid;
      }
    }
    A.sys.nodes.forEach((n) => { n.t = n.def.t; }); A.setT({});
    return { lo, hi, log, K: A.LIBRATION.K };
  });
  console.log(r.log.join('\n'));
  console.log('\nceiling: s = ' + r.lo.toFixed(3) + '  ->  K_max = ' + Math.floor(r.K * r.lo));
  await b.close();
})();
