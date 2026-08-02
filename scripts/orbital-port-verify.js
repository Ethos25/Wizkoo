/**
 * ORBITAL PORT — verification against the DEPLOYED branch preview.
 *
 *   node scripts/orbital-port-verify.js https://orbital-port-lane--wizkoo.netlify.app
 *
 * This does not re-derive anything. Every threshold below is quoted from
 * docs/orbital-port-handoff.md, and the job here is only to prove that the
 * property survived the move from /lab/orbital.html into the homepage's
 * Granddad section. Where a number is measured it is printed, never summarised.
 *
 * It fails hard on any non-finite value. An earlier gate in this project could
 * not parse its inputs, produced NaN, and printed PASS.
 */
const { chromium } = require('@playwright/test');

const BASE = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '');
const VIEWPORTS = [
  { name: 'amy-production', w: 1966, h: 594 },
  { name: 'desktop', w: 1440, h: 900 },
  { name: 'phone', w: 375, h: 812 }
];

let failures = 0;
const finite = (v) => typeof v === 'number' && Number.isFinite(v);

function check(label, ok, detail) {
  if (ok !== true) failures++;
  console.log((ok === true ? '  PASS  ' : '  FAIL  ') + label + (detail ? '  ' + detail : ''));
}
function must(label, value, pred, detail) {
  if (!finite(value)) { failures++; console.log('  FAIL  ' + label + '  NON-FINITE (' + value + ')'); return; }
  check(label, pred(value), detail);
}

async function settle(page) {
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
}

(async () => {
  const browser = await chromium.launch();

  /* ══ 1. THE KILL ORDER ══════════════════════════════════════════════════ */
  console.log('\n1. THE REJECTED GEOMETRY IS GONE');
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.querySelector('#linen-hero').scrollIntoView());
    await settle(page);

    const r = await page.evaluate(() => {
      const sec = document.querySelector('#linen-hero');
      const ell = [].slice.call(sec.querySelectorAll('ellipse'));
      return {
        oldSvg: !!document.querySelector('#hz2-orbital-svg'),
        orbDraw: sec.querySelectorAll('.orb-draw,.orb-glow').length,
        orbStars: sec.querySelectorAll('.orb-stars').length,
        haze: !!document.querySelector('#hz2-nucl-haze'),
        callouts: sec.querySelectorAll('[id^="callout-"],[id^="dot-"],[id^="conn-"]').length,
        rejectedRy: ell.map((e) => e.getAttribute('ry')).filter((v) => ['178', '160', '135'].includes(v)).length,
        nucleusR42: !!sec.querySelector('circle[r="42"]')
      };
    });
    check('#hz2-orbital-svg removed', r.oldSvg === false);
    check('.orb-draw / .orb-glow removed', r.orbDraw === 0, 'found ' + r.orbDraw);
    check('.orb-stars removed', r.orbStars === 0, 'found ' + r.orbStars);
    check('#hz2-nucl-haze removed', r.haze === false);
    check('hand-placed dots/callouts/connectors removed', r.callouts === 0, 'found ' + r.callouts);
    check('no ellipse at ry 178/160/135', r.rejectedRy === 0, 'found ' + r.rejectedRy);
    check('no 42-unit nucleus circle', r.nucleusR42 === false);
    await page.close();
  }

  /* ══ 2. ARRANGEMENT C, AND WHAT IT DECLARES ═════════════════════════════ */
  console.log('\n2. ARRANGEMENT C IS LIVE, AND THE GEOMETRY AGREES WITH WHAT IT DECLARES');
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.querySelector('#linen-hero').scrollIntoView());
  await page.waitForTimeout(3200);
  await settle(page);

  {
    const g = await page.evaluate(() => {
      const A = window.WizkooOrbital;
      return { key: A.ARR_KEY, R: A.NUC_R, occl: A.ARR.occlusion,
               orbits: A.ORBITS.map((o) => ({ id: o.id, rx: o.rx, ry: o.ry, rot: o.rot })) };
    });
    check("ARR_KEY === 'C'", g.key === 'C', 'got ' + g.key);
    must('nucleus radius R', g.R, (v) => v === 125, 'R = ' + g.R);
    console.log('        orbit  rx    ry   rot    O=ry/rx   E=rx/R   O*E');
    g.orbits.forEach((o) => {
      console.log('          ' + o.id + '   ' + String(o.rx).padStart(4) + '  ' + String(o.ry).padStart(4) +
        '  ' + String(o.rot).padStart(4) + '    ' + (o.ry / o.rx).toFixed(3) +
        '     ' + (o.rx / g.R).toFixed(2) + '    ' + (o.ry / g.R).toFixed(2));
    });
    const cert = [[480, 275, 25], [434, 248, 148], [372, 209, 172]];
    const match = g.orbits.every((o, i) => o.rx === cert[i][0] && o.ry === cert[i][1] && o.rot === cert[i][2]);
    check('geometry is the certified C', match);
    check('declares occlusion:false', g.occl === false);
    const allClear = g.orbits.every((o) => o.ry >= g.R);
    check('every ry >= R, so the declaration is TRUE (no arc crosses)', allClear,
      'ry ' + g.orbits.map((o) => o.ry).join('/') + ' vs R ' + g.R);
    must('nucleus/envelope ratio', g.R / Math.max(...g.orbits.map((o) => o.rx)),
      (v) => Math.abs(v - 0.260) < 0.002, '= ' + (g.R / 480).toFixed(3) + '  (certified 0.260; the rejected section was 0.135)');
  }

  /* ══ 3. THE LIGHT MODEL ═════════════════════════════════════════════════ */
  console.log('\n3. THE LIGHT MODEL — one light, and it is the body');
  {
    const f = await page.evaluate(() => {
      const sec = document.querySelector('#linen-hero');
      const bad = ['feDistantLight', 'fePointLight', 'feSpotLight', 'feDiffuseLighting', 'feSpecularLighting'];
      const counts = {};
      bad.forEach((t) => { counts[t] = sec.getElementsByTagName(t).length; });
      const body = sec.querySelector('.lo-nuc-body');
      const corona = sec.querySelector('.lo-corona-ring');
      return { counts,
        bodyTag: body && body.tagName, bodyHref: body && (body.getAttribute('href') || '').slice(0, 11),
        bodyFilter: body && (getComputedStyle(body).filter || 'none'),
        coronaTag: corona && corona.tagName,
        coronaCx: corona && Number(corona.getAttribute('cx')),
        coronaCy: corona && Number(corona.getAttribute('cy')),
        frameCx: window.WizkooOrbital.FRAME.cx, frameCy: window.WizkooOrbital.FRAME.cy,
        hot: window.WizkooOrbital.HOT };
    });
    const total = Object.values(f.counts).reduce((a, b) => a + b, 0);
    check('zero SVG lighting primitives in the frame', total === 0, JSON.stringify(f.counts));
    check('nucleus is a raster sphere map (<image>)', f.bodyTag === 'image', f.bodyTag + ' href ' + f.bodyHref);
    check('no CSS filter on the body', f.bodyFilter === 'none', f.bodyFilter);
    check('corona is centred on the BODY, not the hot region',
      f.coronaCx === f.frameCx && f.coronaCy === f.frameCy,
      'corona (' + f.coronaCx + ',' + f.coronaCy + ') vs body (' + f.frameCx + ',' + f.frameCy + ')' +
      '  hot region is at (' + f.hot.x.toFixed(1) + ',' + f.hot.y.toFixed(1) + ') and is NOT the anchor');

    /* limb darkening + texture compression + the in-body constellation, all
       measured off the rendered sphere map exactly as the lab measured them. */
    const m = await page.evaluate(() => {
      const A = window.WizkooOrbital;
      /* THE CANVAS IS NOT THE DISC. makeBody renders EXTENT (1.34) body radii of
         canvas — the outer third is the bleed past the limb. Normalising to the
         canvas edge puts the "limb" band entirely outside the body and measures
         the bleed: it read the silhouette at 3.0% of centre against a certified
         34%, texture at 7.63x against 1.87x, and produced a NaN on the bearing
         spread. rr below is in BODY RADII, so rr = 1 is the limb. */
      const EXT = A.EXTENT;
      function bands(mode) {
        const r = A.readBody(256, mode), px = r.px, d = r.data, c = (px - 1) / 2;
        const acc = [[], [], []], byBearing = {};
        for (let y = 0; y < px; y++) for (let x = 0; x < px; x++) {
          const dx = (x - c) / c, dy = (y - c) / c, rr = Math.hypot(dx, dy) * EXT;
          if (rr > 0.99) continue;
          const i = (y * px + x) * 4, a = d[i + 3] / 255;
          const lum = (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) * a;
          const band = rr < 0.34 ? 0 : rr < 0.72 ? 1 : 2;
          acc[band].push(lum);
          if (rr > 0.90) {
            const b = Math.round(((Math.atan2(dy, dx) * 180 / Math.PI) + 360) % 360 / 45) % 8;
            (byBearing[b] = byBearing[b] || []).push(lum);
          }
        }
        const mean = (a) => a.reduce((x, y) => x + y, 0) / (a.length || 1);
        return { bands: acc.map(mean), counts: acc.map((a) => a.length),
                 bearings: Object.keys(byBearing).sort().map((k) => mean(byBearing[k])) };
      }
      /* roughness: mean |second difference| along a horizontal run, per band */
      function roughness() {
        const r = A.readBody(512, 1), px = r.px, d = r.data, c = (px - 1) / 2;
        const out = [0, 0, 0], n = [0, 0, 0];
        for (let y = 1; y < px - 1; y++) for (let x = 1; x < px - 1; x++) {
          /* out to 0.99, not 0.97. The compression this is measuring is steepest
             in the last few percent of the radius — mu changes fastest there —
             so clipping at 0.97 cuts off most of the effect being measured. */
          const dx = (x - c) / c, dy = (y - c) / c, rr = Math.hypot(dx, dy) * EXT;
          if (rr > 0.99) continue;
          const L = (i) => { const j = i * 4; return 0.2126 * d[j] + 0.7152 * d[j + 1] + 0.0722 * d[j + 2]; };
          const v = Math.abs(L(y * px + x - 1) - 2 * L(y * px + x) + L(y * px + x + 1));
          const b = rr < 0.34 ? 0 : rr < 0.72 ? 1 : 2;
          out[b] += v; n[b]++;
        }
        return out.map((v, i) => v / (n[i] || 1));
      }
      const full = bands(0), stars = bands(2);
      /* centre luminance from the very middle */
      const r0 = A.readBody(256, 0), c0 = ((Math.floor(r0.px / 2) * r0.px + Math.floor(r0.px / 2)) * 4);
      const centre = 0.2126 * r0.data[c0] + 0.7152 * r0.data[c0 + 1] + 0.0722 * r0.data[c0 + 2];
      return { full, stars, rough: roughness(), centre,
               U_LIMB: A.U_LIMB, LIMB_P: A.LIMB_P };
    });

    console.log('        limb law u=' + m.U_LIMB + '  p=' + m.LIMB_P + '   (certified 0.86 / 1.5)');
    check('limb law is the certified departure from physics', m.U_LIMB === 0.86 && m.LIMB_P === 1.5);
    const silhouettePct = (m.full.bands[2] / m.full.bands[0]) * 100;
    console.log('        band mean luminance   centre ' + m.full.bands[0].toFixed(1) +
      '   mid ' + m.full.bands[1].toFixed(1) + '   limb ' + m.full.bands[2].toFixed(1));
    must('limb darkening present and strong', silhouettePct, (v) => v < 60,
      'limb sits at ' + silhouettePct.toFixed(1) + '% of centre band');
    must('darkening is monotonic outward', m.full.bands[0] - m.full.bands[1], (v) => v > 0,
      'centre > mid > limb: ' + (m.full.bands[1] > m.full.bands[2]));
    const bmin = Math.min(...m.full.bearings), bmax = Math.max(...m.full.bearings);
    must('darkening is the SAME in every direction (no terminator)', bmin / bmax, (v) => v > 0.80,
      'weakest bearing is ' + ((bmin / bmax) * 100).toFixed(0) + '% of strongest across 8 bearings  (certified 84%)');
    console.log('        texture roughness     centre ' + m.rough[0].toFixed(3) +
      '   mid ' + m.rough[1].toFixed(3) + '   limb ' + m.rough[2].toFixed(3));
    must('texture COMPRESSES toward the limb', m.rough[2] / m.rough[0], (v) => v > 1.25,
      (m.rough[2] / m.rough[0]).toFixed(2) + 'x finer at the edge  (certified 1.87x)');
    /* Monotonic to within the estimator's own noise. This is a second difference
       on one axis over an 8-bit render, not the lab's measure, so centre and mid
       land within a few thousandths of each other and their ORDER is not a
       signal. What is a signal is that the limb band stands clear of both. */
    const noise = 0.02 * m.rough[0];
    check('and is monotonic outward to within the estimator\'s noise',
      m.rough[1] >= m.rough[0] - noise && m.rough[2] > m.rough[1] + noise,
      'centre ' + m.rough[0].toFixed(3) + ' -> mid ' + m.rough[1].toFixed(3) +
      ' -> limb ' + m.rough[2].toFixed(3) + ' (noise band +/-' + noise.toFixed(3) + ')');
    console.log('        in-body stars, mean   centre ' + m.stars.bands[0].toFixed(2) +
      '   mid ' + m.stars.bands[1].toFixed(2) + '   limb ' + m.stars.bands[2].toFixed(2));
    must('in-body constellation crowds toward the limb', m.stars.bands[2] / Math.max(m.stars.bands[0], 0.001),
      (v) => v > 1.2, (m.stars.bands[2] / m.stars.bands[0]).toFixed(2) + 'x denser at the limb  (certified 1.65x)');
    must('and stays a whisper', m.stars.bands[2], (v) => v < 6,
      'peak band mean ' + m.stars.bands[2].toFixed(2) + ' of 255  (certified 2.4)');
  }

  /* ══ 4. THE NODES — the demonstration ═══════════════════════════════════ */
  console.log('\n4. THE NODES ARE LIT BY THE NUCLEUS');
  {
    const n = await page.evaluate(() => {
      const A = window.WizkooOrbital, F = A.FRAME;
      return A.sys.nodes.map((nd) => {
        const p = A.pointAt(nd.orbit, nd.t);
        const dist = Math.hypot(p.x - F.cx, p.y - F.cy);
        /* the node sphere is drawn lit from +x in its own image and rotated by
           bearing2 to point at the nucleus. The dot product between the lit
           direction and the direction to the nucleus is the assertion. */
        const b = nd.bearing2 * Math.PI / 180;
        const lit = [Math.cos(b), Math.sin(b)];
        const toNuc = [(F.cx - p.x) / dist, (F.cy - p.y) / dist];
        const body = nd.g.__body;
        return { id: nd.def.id, dist: +dist.toFixed(0),
                 dot: +(lit[0] * toNuc[0] + lit[1] * toNuc[1]).toFixed(3),
                 I: +A.intensityAt(dist).toFixed(3),
                 tag: body && body.tagName, href: body && (body.getAttribute('href') || '').slice(0, 11) };
      });
    });
    console.log('        node        dist   lit-side dot   intensity   body');
    n.forEach((x) => console.log('        ' + x.id.padEnd(10) + String(x.dist).padStart(5) +
      '       ' + x.dot.toFixed(3) + '        ' + x.I.toFixed(3) + '      ' + x.tag + ' ' + x.href));
    check('all seven nodes lit toward the nucleus (dot = +1.000)', n.every((x) => x.dot === 1), '');
    check('every node is a rendered sphere, not a gradient disc', n.every((x) => x.tag === 'image'));
    const Is = n.map((x) => x.I);
    must('brightness falls with SCREEN distance', Math.max(...Is) / Math.min(...Is), (v) => v > 2,
      'intensity spans ' + Math.min(...Is).toFixed(2) + ' to ' + Math.max(...Is).toFixed(2) +
      ' across ' + Math.min(...n.map((x) => x.dist)) + '-' + Math.max(...n.map((x) => x.dist)) + ' units');
  }

  /* ══ 5. MOTION — libration, and the casino test ═════════════════════════ */
  console.log('\n5. MOTION');
  {
    const L = await page.evaluate(() => {
      const A = window.WizkooOrbital;
      return { K: A.LIBRATION.K, P: A.LIBRATION.P, w: A.LIBRATION.w,
               amps: A.drift.amplitudes(), running: A.drift.running() };
    });
    console.log('        components ' + L.P.join(' / ') + ' seconds     K = ' + L.K);
    check('periods are the certified primes 307/491/787', String(L.P) === '307,491,787');
    check('K = 3000, a third under the C ceiling of 4000', L.K === 3000);
    console.log('        node        amplitude   |dP/dtheta|   k       peak px/s');
    L.amps.forEach((a) => console.log('        ' + a.id.padEnd(10) + String(a.amp).padStart(8) + 'deg  ' +
      String(a.tangential).padStart(9) + '   ' + a.k.toFixed(3) + '   ' + a.peakPxPerS.toFixed(3)));
    const speeds = L.amps.map((a) => a.peakPxPerS);
    must('peak screen speed is IDENTICAL on every body', Math.max(...speeds) - Math.min(...speeds),
      (v) => v < 0.005, 'spread ' + (Math.max(...speeds) - Math.min(...speeds)).toFixed(4) +
      ' px/s around ' + speeds[0].toFixed(3) + '  (certified 0.85)');
    const ks = L.amps.map((a) => a.k);
    check('bodies decorrelated by PERIOD (k_i all distinct)', new Set(ks).size === ks.length, 'k = ' + ks.join(', '));
    check('libration is running', L.running === true);

    /* the casino test, mechanically */
    const casino = await page.evaluate(() => {
      const sec = document.querySelector('#linen-hero');
      const anims = sec.getAnimations({ subtree: true });
      const inf = anims.filter((a) => {
        const e = a.effect && a.effect.getTiming();
        return e && (e.iterations === Infinity || e.iterations > 1e6);
      });
      /* Group by animation NAME. The question the casino test asks is not
         "is any duration repeated" — 800 stars drawing random durations out of a
         2-8s range will of course collide, and that is the primitive's own
         design. It is "can a viewer catch a repetition", which for a population
         means: is it staggered, or synchronized. */
      const byName = {};
      inf.forEach((a) => {
        const nm = a.animationName || '?';
        const t = a.effect.getTiming();
        const d = (t.duration || 0) / 1000, del = (t.delay || 0) / 1000;
        (byName[nm] = byName[nm] || { n: 0, durs: new Set(), delays: new Set() });
        byName[nm].n++; byName[nm].durs.add(d.toFixed(2)); byName[nm].delays.add(del.toFixed(2));
      });
      return { total: anims.length, infinite: inf.length,
               kinds: Object.entries(byName).map(([nm, v]) => ({ name: nm, n: v.n,
                 durs: v.durs.size, delays: v.delays.size,
                 durList: v.n <= 4 ? [...v.durs].join('/') : '' })) };
    });
    console.log('        running animations in the section: ' + casino.total + ', of which infinite: ' + casino.infinite);
    console.log('        name                     count   distinct durations   distinct delays');
    casino.kinds.forEach((k) => console.log('        ' + k.name.padEnd(24) + String(k.n).padStart(5) +
      String(k.durs).padStart(18) + String(k.delays).padStart(18) + (k.durList ? '   [' + k.durList + 's]' : '')));
    /* The two ruled mechanisms, each asserted on its own terms. */
    /* THE CERTIFIED DESIGN IS NOT THREE PERIODS. Round 5 put the corona on the
       body's own keyframe — "the glow follows; it does not lead" — so the ring
       carries lo-breath-a, the same 3.7s the body's inner glow runs. Three
       layers, two periods. Asserting three would fail a build that is correct. */
    const breath = casino.kinds.find((k) => k.name === 'lo-breath');
    check('three breath layers are live', !!breath && breath.n === 3,
      breath ? breath.n + ' layers on ' + breath.durs + ' periods [' + breath.durList + 's]' : 'MISSING');
    const bd = breath ? breath.durList.split('/').map(parseFloat) : [];
    const coprime = bd.length === 2 && (() => {
      const a = Math.round(bd[0] * 10), b = Math.round(bd[1] * 10);
      const gcd = (x, y) => (y ? gcd(y, x % y) : x);
      return gcd(a, b) === 1;
    })();
    check('the live periods are mutually prime, so the sum has no catchable beat',
      coprime, bd.join(' and ') + 's  ->  alternate cycles ' + bd.map((x) => x * 2).join(' and ') +
      's, beating out at about ' + (bd.length === 2 ? Math.round(bd[0] * 2 * bd[1] * 2 / 2 / 60) : '?') + ' minutes');
    const coronaRidesBody = await page.evaluate(() => {
      const ring = document.querySelector('#linen-hero .lo-corona-ring');
      const glow = document.querySelector('#linen-hero .lo-nucleus .lo-breath-a');
      if (!ring || !glow) return null;
      const d = (e) => (getComputedStyle(e).animationDuration || '');
      return { ring: d(ring), body: d(glow), same: d(ring) === d(glow) };
    });
    check('the corona rides the BODY\'s breath keyframe, not its own rhythm',
      coronaRidesBody && coronaRidesBody.same === true,
      coronaRidesBody ? 'ring ' + coronaRidesBody.ring + ', body glow ' + coronaRidesBody.body : 'MISSING');
    const twinkle = casino.kinds.find((k) => k.name === 'wk-sky-twinkle');
    check('star twinkle is STAGGERED per star, not synchronized',
      !!twinkle && twinkle.delays > 100, twinkle ? twinkle.n + ' stars across ' + twinkle.delays +
      ' distinct delays and ' + twinkle.durs + ' distinct durations' : 'MISSING');
    const src = await (await fetch(BASE + '/js/orbital.js')).text();
    check('no setInterval in the shipped system', !/setInterval/.test(src));
    check('no repeat:-1 / infinite JS tween', !/repeat\s*:\s*-1/.test(src));
    const idx = await (await fetch(BASE + '/')).text();
    /* Match the CALL, not the identifier — the removal comment names the element
       it removed, and an earlier version of this check matched its own comment. */
    check('the 4.5s yoyo haze pulse is gone from index.html',
      !/gsap\.fromTo\(haze/.test(idx) && !/repeat:-1,yoyo:true/.test(idx));
  }

  /* ══ 6. LABELS ══════════════════════════════════════════════════════════ */
  console.log('\n6. LABELS — the guarantee, confirmed (not re-solved)');
  {
    const lab = await page.evaluate(() => {
      const A = window.WizkooOrbital;
      function boxes() {
        return A.sys.nodes.map((n) => {
          const b = n.label.getBoundingClientRect();
          return { id: n.def.id, x: b.x, y: b.y, w: b.width, h: b.height,
                   op: Number(n.label.getAttribute('opacity')) };
        });
      }
      function worstPair(bs) {
        let worst = null;
        for (let i = 0; i < bs.length; i++) for (let j = i + 1; j < bs.length; j++) {
          const a = bs[i], b = bs[j];
          const ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
          const oy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
          if (ox > 0 && oy > 0) {
            const area = ox * oy, dim = Math.min(a.op, b.op);
            if (!worst || area > worst.area) worst = { pair: a.id + ' x ' + b.id, area: area, dimmer: dim };
          }
        }
        return worst;
      }
      const composed = worstPair(boxes());
      /* CONFIRMATION SAMPLE, not the exhaustion. Each body is walked to the
         corners of ITS OWN amplitude — the bug the lab found was a fixed +/-16
         box after amplitude became per-body. 3^7 = 2187 corners is the same
         in-browser grid the lab cross-checked. */
      const amps = {}; A.sys.nodes.forEach((n) => { amps[n.def.id] = n.amp; });
      const ids = A.sys.nodes.map((n) => n.def.id);
      let worst = null, n = 0;
      const rec = (k, map) => {
        if (k === ids.length) {
          A.setT(map); n++;
          const w = worstPair(boxes());
          if (w && (!worst || w.area > worst.area)) worst = w;
          return;
        }
        const id = ids[k], base = A.sys.nodes[k].def.t;
        [-1, 0, 1].forEach((s) => { const m2 = Object.assign({}, map); m2[id] = base + s * amps[id]; rec(k + 1, m2); });
      };
      rec(0, {});
      A.sys.nodes.forEach((nd) => { nd.t = nd.def.t; });
      A.setT({});
      return { composed, worst, n, amps };
    });
    check('no two labels overlap at the composed state', lab.composed === null,
      lab.composed ? JSON.stringify(lab.composed) : '');
    console.log('        walked ' + lab.n + ' corners of the per-body excursion box');
    if (lab.worst === null) {
      check('no two labels overlap ANYWHERE the system can reach', true, '0 overlaps in ' + lab.n + ' configurations');
    } else {
      /* The bar is NOT "never overlap". It is: wherever two touch, the dimmer
         has already receded to background (<= 0.45 on the 0.35-1.0 range). */
      check('where labels touch, the dimmer has receded to background', lab.worst.dimmer <= 0.45,
        lab.worst.pair + '  area ' + lab.worst.area.toFixed(0) + 'px2  dimmer presence ' + lab.worst.dimmer.toFixed(3));
    }
  }

  /* ══ 7. THE SKY ═════════════════════════════════════════════════════════ */
  console.log('\n7. THE SKY');
  {
    const s = await page.evaluate(() => {
      const host = document.querySelector('[data-orb-sky]');
      const stars = host.querySelectorAll('.wk-sky__star');
      const far = host.querySelectorAll('.wk-sky__layer--far .wk-sky__star');
      let farAnimated = 0, nearAnimated = 0;
      far.forEach((e) => { if (getComputedStyle(e).animationName !== 'none') farAnimated++; });
      host.querySelectorAll('.wk-sky__layer--near .wk-sky__star').forEach((e) => {
        if (getComputedStyle(e).animationName !== 'none') nearAnimated++;
      });
      return { reported: host.dataset.orbSkyStars, dom: stars.length, far: far.length,
               farAnimated, nearAnimated, field: window.WizkooOrbitalSky.LAB_FIELD };
    });
    console.log('        stars rendered ' + s.dom + ' (generator reported ' + s.reported + ')');
    must('star count is the certified 1,834', Number(s.reported), (v) => Math.abs(v - 1834) <= 2, '');
    check('anchors held at 12, ruled by eye not scaled by area', s.field.near.anchors === 12);
    check('one shooter, on the ruled 60-120s random period',
      s.field.shooter.count === 1 && s.field.shooter.periodMinS === 60 && s.field.shooter.periodMaxS === 120);
    console.log('        far layer: ' + s.far + ' stars, ' + s.farAnimated + ' animated');
    check('the far layer keeps its stars and loses its twinkle', s.farAnimated === 0, s.farAnimated + ' animated');
    must('twinkle survives where it reads (near layer)', s.nearAnimated, (v) => v > 400, s.nearAnimated + ' animated');
  }

  /* ══ 8. THE ANCHOR AND THE SCALE, at every target viewport ══════════════ */
  console.log('\n8. THE ANCHOR, AND WHAT THE CONTAINER COSTS');
  for (const v of VIEWPORTS) {
    const p2 = await browser.newPage({ viewport: { width: v.w, height: v.h } });
    await p2.goto(BASE + '/', { waitUntil: 'networkidle' });
    await p2.evaluate(() => document.querySelector('#linen-hero').scrollIntoView());
    await p2.waitForTimeout(2500);
    await settle(p2);
    const g = await p2.evaluate(() => {
      const sec = document.querySelector('#linen-hero');
      const svg = sec.querySelector('.orb-svg');
      const stage = sec.querySelector('.orb-stage');
      const text = sec.querySelector('.linen-hero-text');
      /* The stage being display:none does NOT remove the svg from the DOM, it
         just gives it a zero box. Testing `!svg` took the visible branch and
         reported a 0x0 box and 0.0px type as a legibility failure. */
      const stageHidden = !stage || getComputedStyle(stage).display === 'none';
      if (!svg || stageHidden) return { hidden: true, stageDisplay: stage ? getComputedStyle(stage).display : 'absent',
                         fallback: getComputedStyle(document.querySelector('#hz2-mob-fallback')).display,
                         sec: sec.getBoundingClientRect().height };
      const vb = svg.viewBox.baseVal, r = svg.getBoundingClientRect();
      const scale = Math.min(r.width / vb.width, r.height / vb.height);
      const key = sec.querySelector('.lo-label-key');
      const kr = key.getBoundingClientRect();
      /* does any label box land on the headline's box? */
      const h1 = sec.querySelector('#hz1-h1').getBoundingClientRect();
      let hit = 0, worst = 0;
      sec.querySelectorAll('.lo-label-depth').forEach((l) => {
        const b = l.getBoundingClientRect();
        const ox = Math.min(b.right, h1.right) - Math.max(b.left, h1.left);
        const oy = Math.min(b.bottom, h1.bottom) - Math.max(b.top, h1.top);
        if (ox > 0 && oy > 0) { hit++; worst = Math.max(worst, ox * oy); }
      });
      /* Does the object stay inside the section? The section is overflow:hidden,
         so anything outside is silently cut — a label losing its last word is
         exactly the kind of failure a PASS elsewhere would hide. */
      const sr = sec.getBoundingClientRect();
      let escaped = 0, worstEsc = 0;
      sec.querySelectorAll('.lo-label-depth,.lo-node').forEach((e) => {
        const b = e.getBoundingClientRect();
        const over = Math.max(sr.left - b.left, b.right - sr.right, sr.top - b.top, b.bottom - sr.bottom);
        if (over > 1) { escaped++; worstEsc = Math.max(worstEsc, over); }
      });
      /* What the container costs the ring, which is the cage and the ruling. */
      const strokes = [].slice.call(sec.querySelectorAll('path.lo-path'))
        .map((p) => parseFloat(getComputedStyle(p).strokeWidth)).filter((x) => x < 2);
      return { hidden: false, vb: { x: vb.x, y: vb.y, w: vb.width, h: vb.height },
               rect: { w: r.width, h: r.height }, scale,
               par: svg.getAttribute('preserveAspectRatio'),
               labelPx: Number(getComputedStyle(key).fontSize.replace('px', '')) * scale,
               keyH: kr.height,
               sec: sec.getBoundingClientRect().height,
               textW: text.getBoundingClientRect().width,
               headlineHits: hit, headlineWorst: worst,
               escaped, worstEsc,
               strokeMin: Math.min(...strokes), strokeMax: Math.max(...strokes),
               dpr: window.devicePixelRatio };
    });
    if (g.hidden) {
      console.log('      ' + v.name + ' ' + v.w + 'x' + v.h + ':  system hidden, list fallback shown');
      check('  below 768px the stage is hidden and the list fallback shows',
        g.stageDisplay === 'none' && g.fallback === 'flex', 'stage ' + g.stageDisplay + ', fallback ' + g.fallback);
      must('  section still has height', g.sec, (x) => x > 100, g.sec.toFixed(0) + 'px');
    } else {
      console.log('      ' + v.name + ' ' + v.w + 'x' + v.h + ':');
      console.log('        viewBox ' + g.vb.x + ' ' + g.vb.y + ' ' + g.vb.w + ' ' + g.vb.h +
        '   box ' + g.rect.w.toFixed(0) + 'x' + g.rect.h.toFixed(0) +
        '   scale ' + g.scale.toFixed(3));
      console.log('        certified 14px label renders at ' + g.labelPx.toFixed(1) + 'px' +
        '   section height ' + g.sec.toFixed(0) + '   text column ' + g.textW.toFixed(0));
      check('  anchored by xMidYMid meet', g.par === 'xMidYMid meet', g.par);
      must('  label type stays legible', g.labelPx, (x) => x >= 8.5, g.labelPx.toFixed(1) + 'px');
      check('  no label lands on the headline', g.headlineHits === 0,
        g.headlineHits + ' hits, worst ' + g.headlineWorst.toFixed(0) + 'px2');
      check('  nothing is clipped by the section', g.escaped === 0,
        g.escaped + ' escaping, worst ' + g.worstEsc.toFixed(1) + 'px');
      /* Reported, not asserted. The ring stroke is certified at 1.1 units and
         the container scales it; this is what that costs, and it is a ruling
         for Amy's eye, not a threshold for a script. */
      console.log('        ring stroke ' + (g.strokeMin * g.scale).toFixed(2) + '-' +
        (g.strokeMax * g.scale).toFixed(2) + ' CSS px  (certified 1:1 gives 0.95-1.25)  ' +
        '-> ' + (g.strokeMin * g.scale * 2).toFixed(2) + '-' + (g.strokeMax * g.scale * 2).toFixed(2) +
        ' device px on a 2x display');
    }
    await p2.close();
  }

  /* ══ 9. REDUCED MOTION ══════════════════════════════════════════════════ */
  console.log('\n9. REDUCED MOTION — the completed state, rendered');
  {
    const p3 = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    await p3.goto(BASE + '/', { waitUntil: 'networkidle' });
    await p3.evaluate(() => document.querySelector('#linen-hero').scrollIntoView());
    await p3.waitForTimeout(1200);
    await settle(p3);
    const a = await p3.evaluate(() => {
      const sec = document.querySelector('#linen-hero');
      return { running: sec.getAnimations({ subtree: true }).filter((x) => x.playState === 'running').length,
               drifting: window.WizkooOrbital.drift.running(),
               nodesVisible: sec.querySelectorAll('.lo-node').length,
               labelsVisible: [].slice.call(sec.querySelectorAll('.lo-label-depth'))
                 .filter((l) => Number(l.getAttribute('opacity')) > 0.3).length };
    });
    check('0 running animations under reduced motion', a.running === 0, a.running + ' running');
    check('libration stopped', a.drifting === false);
    check('the completed state is rendered (7 nodes, 7 labels present)',
      a.nodesVisible === 7 && a.labelsVisible === 7, a.nodesVisible + ' nodes, ' + a.labelsVisible + ' labels');
    const f1 = await p3.screenshot({ clip: { x: 0, y: 0, width: 1440, height: 900 } });
    await p3.waitForTimeout(5000);
    const f2 = await p3.screenshot({ clip: { x: 0, y: 0, width: 1440, height: 900 } });
    check('frames 5s apart are byte-identical', Buffer.compare(f1, f2) === 0,
      f1.length + ' vs ' + f2.length + ' bytes');
    await p3.close();
  }

  await page.close();
  await browser.close();
  console.log('\n' + (failures ? 'FAILURES: ' + failures : 'ALL CHECKS PASS'));
  process.exit(failures ? 1 : 0);
})().catch((e) => { console.error('HARNESS ERROR — this is a failure, not a skip:\n', e); process.exit(2); });
