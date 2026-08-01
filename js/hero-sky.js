/**
 * THE HERO SKY: a deep-field crop, re-tuned for this aperture.
 *
 * WHAT THIS IS
 *   Not the certified sky scaled down. It is the certified sky's VISUAL
 *   LANGUAGE re-tuned so a 620x376 window reads as the same weather /start's
 *   1232x420 field reads as at full size.
 *
 *   The stylesheet stays the product's: css/hero-sky.css is still a byte-for-byte
 *   copy of packages/ui/src/TwoLayerSky/TwoLayerSky.css @ e1a90b2, so the star
 *   rendering, twinkle curve, nebula breath, shooter, atmosphere classes and the
 *   reduced-motion frozen frame are all the product's own. Only GENERATION is
 *   re-tuned here.
 *
 * WHAT WAS RE-TUNED, AND WHY
 *   DENSITY   Matched per unit area, not by count. /start carries 571 stars in
 *             1232x420, but its centre third is a deliberate star-free content
 *             hole, so its effective field density is 1.275 stars per 1000px2.
 *             This window is 233,120px2, so it carries ~297 stars to read at the
 *             same richness. Cropped verbatim it carried 12.
 *   THE HOLE  Removed. Stars surround and sit behind the sentence; legibility is
 *             carried by an atmospheric wash behind the type (.lw-typewash),
 *             not by absence of stars.
 *   ANCHORS   4 in frame, with halos and cross-glow, so the window always holds
 *             bright stars that read AS stars. Cropped verbatim it had none.
 *   SIZES     Emitted against --u so a star keeps its share of the window at any
 *             viewport, with a 1px floor so nothing falls sub-pixel.
 *   TWINKLE   Per-star duration and RANDOM delay. The product's near layer uses
 *             a positional wave; at this size a wave reads as synchronized.
 *   SHOOTER   One, on a 60-120s period, so it never reads as a loop.
 *   MILKY WAY Kept as texture at reduced count; it is part of the weather.
 *
 * Deterministic from the seed: same seed, same sky, forever.
 */
(function () {
  'use strict';

  /* Star colours and classes are the product's ambientSky palette. */
  var COLORS = {
    cool: ['#EAF2FF', '#DDE8FF', '#F0F2F8', '#C8D8F0'],
    warm: ['#FFF6E4', '#F5EFD9'],
    warmShare: 0.22,
    faint: '#C8D8F0',
    dust: '#F0F2F8'
  };

  /* Tuned for a 620x376 aperture at /start's effective field density. */
  var FIELD = {
    far:  { faints: 88, dust: 78, clusterCount: 4, clusterShare: 0.55, twinkleScale: 0.55 },
    near: { anchors: 4, brights: 16, mids: 68, faints: 29, clusterCount: 3, clusterShare: 0.5, twinkleScale: 1 },
    filigree: { clusters: 1, starsMin: 11, starsMax: 14, maxDegree: 3, dropShare: 0.3, spread: 6.5, webOpacity: 0.05 },
    nebulaCount: 1,
    shooter: { count: 1, periodMinS: 60, periodMaxS: 120 },
    milkyDust: 80,
    atmosphere: { colorDrift: 60, nebulosity: 64, airglow: 56, milkyWay: 21, wisps: 32 }
  };

  function mulberry32(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* No content hole: this aperture is small enough that a hole would empty it. */
  function sampleUniform(rand) { return { x: rand() * 100, y: rand() * 100 }; }

  function makeClusterSampler(rand, clusterCount, clusterShare) {
    var knots = [];
    for (var i = 0; i < clusterCount; i++) {
      var p = sampleUniform(rand);
      knots.push({ x: p.x, y: p.y, spread: 9 + rand() * 11 });
    }
    var gauss = function () {
      var u = Math.max(rand(), 1e-9);
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rand());
    };
    return function () {
      if (rand() > clusterShare) return sampleUniform(rand);
      for (var t = 0; t < 8; t++) {
        var k = knots[Math.floor(rand() * knots.length)];
        var x = k.x + gauss() * k.spread;
        var y = k.y + gauss() * k.spread;
        if (x >= 0 && x <= 100 && y >= 0 && y <= 100) return { x: x, y: y };
      }
      return sampleUniform(rand);
    };
  }

  function starColor(rand, cls) {
    if (cls === 'dust') return COLORS.dust;
    if (cls === 'faint') return rand() < 0.85 ? COLORS.faint : COLORS.dust;
    var pool = rand() < COLORS.warmShare ? COLORS.warm : COLORS.cool;
    return pool[Math.floor(rand() * pool.length)];
  }

  function buildPopulation(seed, cfg) {
    var rand = mulberry32(seed);
    var clustered = makeClusterSampler(rand, cfg.clusterCount, cfg.clusterShare);
    var stars = [];
    function push(cls, n, size, lo, hi, dur, sampler, spike, halo) {
      for (var i = 0; i < n; i++) {
        var p = sampler();
        var d = dur() / cfg.twinkleScale;
        stars.push({
          x: p.x, y: p.y, size: size(), cls: cls, color: starColor(rand, cls),
          lo: lo(), hi: hi(), dur: d,
          del: rand() * d,                    /* random, never a positional wave */
          spike: spike ? rand() < 0.7 : false,
          halo: halo || 0
        });
      }
    }
    push('anchor', cfg.anchors || 0,
      function () { return 2.6 + rand() * 1.2; },
      function () { return 0.55 + rand() * 0.1; }, function () { return 0.92 + rand() * 0.08; },
      function () { return 4 + rand() * 3; }, function () { return sampleUniform(rand); }, true, 9);
    push('bright', cfg.brights || 0,
      function () { return 1.8 + rand() * 0.6; },
      function () { return 0.42 + rand() * 0.12; }, function () { return 0.75 + rand() * 0.18; },
      function () { return 2.5 + rand() * 3; }, function () { return sampleUniform(rand); }, false, 4);
    push('mid', cfg.mids || 0,
      function () { return 1 + (rand() < 0.6 ? 0 : 0.5); },
      function () { return 0.2 + rand() * 0.15; }, function () { return 0.5 + rand() * 0.22; },
      function () { return 2 + rand() * 4; }, clustered);
    push('faint', cfg.faints || 0,
      function () { return 1; },
      function () { return 0.08 + rand() * 0.1; }, function () { return 0.24 + rand() * 0.16; },
      function () { return 3 + rand() * 5; }, clustered);
    push('dust', cfg.dust || 0,
      function () { return 1; },
      function () { return 0.03 + rand() * 0.05; }, function () { return 0.1 + rand() * 0.1; },
      function () { return 5 + rand() * 5; }, function () { return sampleUniform(rand); });
    return stars;
  }

  function q3(v) { return Number(v.toFixed(3)); }

  function buildFiligree(seed, cfg) {
    var rand = mulberry32(seed);
    var gauss = function () {
      var u = Math.max(rand(), 1e-9);
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rand());
    };
    var zone = { x: 16 + rand() * 12, y: 58 + rand() * 16 };   /* lower left, clear of the sentence */
    var n = cfg.starsMin + Math.floor(rand() * (cfg.starsMax - cfg.starsMin + 1));
    var axis = rand() * Math.PI, cosA = Math.cos(axis), sinA = Math.sin(axis);
    var stretch = 1.5 + rand() * 0.9;
    var stars = [], guard = 0;
    while (stars.length < n && guard++ < 400) {
      var u2 = gauss() * cfg.spread * stretch;
      var v2 = gauss() * cfg.spread * 0.7;
      var x = zone.x + (u2 * cosA - v2 * sinA);
      var y = zone.y + (u2 * sinA + v2 * cosA);
      if (x < 2 || x > 98 || y < 2 || y > 98) continue;
      stars.push({ x: x, y: y, size: 0.9 + rand() * 0.8,
        lo: 0.08 + rand() * 0.12, hi: 0.22 + rand() * 0.18,
        dur: 4 + rand() * 4, del: rand() * 5 });
    }
    var cand = [];
    for (var i = 0; i < stars.length; i++) {
      var near = stars.map(function (s, j) { return { j: j, d: Math.hypot(s.x - stars[i].x, s.y - stars[i].y) }; })
        .filter(function (e) { return e.j !== i; }).sort(function (a, b) { return a.d - b.d; }).slice(0, 3);
      for (var k = 0; k < near.length; k++) {
        var a0 = Math.min(i, near[k].j), b0 = Math.max(i, near[k].j);
        if (!cand.some(function (c) { return c.a === a0 && c.b === b0; })) cand.push({ a: a0, b: b0, d: near[k].d });
      }
    }
    var degree = new Array(stars.length).fill(0), strokes = [];
    cand.sort(function (a, b) { return a.d - b.d; }).forEach(function (e) {
      if (rand() < cfg.dropShare) return;
      if (degree[e.a] >= cfg.maxDegree || degree[e.b] >= cfg.maxDegree) return;
      degree[e.a]++; degree[e.b]++;
      strokes.push({ x1: q3(stars[e.a].x), y1: q3(stars[e.a].y), x2: q3(stars[e.b].x), y2: q3(stars[e.b].y) });
    });
    return [{ stars: stars, strokes: strokes }];
  }

  /* Weather: non-uniform ink, lighter toward one region, deeper at the edges. */
  function buildAtmosphere(seed) {
    var rand = mulberry32(seed);
    var drift = [
      { x: -14 + rand() * 8, y: 4 + rand() * 18, w: 62, h: 96, color: '#52304A',
        maxOpacity: 0.36, durS: 110 + rand() * 30, del: rand() * 20, driftX: 3 + rand() * 2 },
      { x: 58 + rand() * 10, y: -6 + rand() * 20, w: 58, h: 100, color: '#1E4A55',
        maxOpacity: 0.30, durS: 110 + rand() * 30, del: 30 + rand() * 25, driftX: 3 + rand() * 2 }
    ];
    var NEB = ['#4A2A4E', '#3A2E5E', '#1E4A55'];
    var lobes = [];
    for (var i = 0; i < 4; i++) {
      var left = i % 2 === 0;
      lobes.push({ x: left ? -6 + rand() * 26 : 56 + rand() * 34, y: 2 + rand() * 80,
        w: 34 + rand() * 22, h: 20 + rand() * 16,
        color: NEB[i % NEB.length], maxOpacity: 0.32 + rand() * 0.1,
        rot: (rand() - 0.5) * 50, durS: 24 + rand() * 16, del: rand() * 12 });
    }
    var wisps = [];
    for (var w = 0; w < 2; w++) {
      wisps.push({ x: w === 0 ? 4 + rand() * 16 : 48 + rand() * 24,
        y: w === 0 ? 12 + rand() * 16 : 66 + rand() * 20,
        w: 40 + rand() * 18, h: 6 + rand() * 4, rot: (rand() - 0.5) * 22,
        maxOpacity: 0.17 + rand() * 0.08, durS: 130 + rand() * 50,
        del: rand() * 40, driftX: 4 + rand() * 3 });
    }
    var gauss = function () {
      var u = Math.max(rand(), 1e-9);
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rand());
    };
    var angle = 22 + rand() * 12, slope = Math.tan(angle * Math.PI / 180), intercept = 14 + rand() * 12;
    var dust = [], g2 = 0;
    while (dust.length < FIELD.milkyDust && g2++ < 3000) {
      var dx = rand() * 100, dy = dx * slope + intercept + gauss() * 9;
      if (dy < 1 || dy > 99) continue;
      dust.push({ x: dx, y: dy, opacity: 0.02 + rand() * 0.06 });
    }
    var washes = [
      { x: 2, y: intercept - 6, w: 40, h: 17, rot: angle, maxOpacity: 0.20 },
      { x: 60, y: 60 * slope + intercept - 6, w: 40, h: 17, rot: angle, maxOpacity: 0.18 }
    ];
    return { drift: drift, lobes: lobes, wisps: wisps, milky: { dust: dust, washes: washes },
             intensities: FIELD.atmosphere };
  }

  function buildNebulae(seed, count) {
    var rand = mulberry32(seed);
    var palette = ['#1E3060', '#24406F', '#182F58'];
    var out = [];
    for (var i = 0; i < count; i++) {
      out.push({ x: rand() < 0.5 ? -4 + rand() * 22 : 58 + rand() * 30, y: 2 + rand() * 76,
        w: 40 + rand() * 26, h: 22 + rand() * 16,
        color: palette[Math.floor(rand() * palette.length)],
        opacity: 0.09 + rand() * 0.07, dur: 18 + rand() * 14, del: rand() * 10,
        rot: (rand() - 0.5) * 40 });
    }
    return out;
  }

  function buildShooters(seed, cfg) {
    var rand = mulberry32(seed);
    var out = [];
    for (var i = 0; i < cfg.count; i++) {
      out.push({ x: 4 + rand() * 42, y: 2 + rand() * 10, angleDeg: 8 + rand() * 6,
        travel: 150 + rand() * 90,
        period: cfg.periodMinS + rand() * (cfg.periodMaxS - cfg.periodMinS),
        del: 8 + rand() * 20, streak: 46 + rand() * 30 });
    }
    return out;
  }

  function buildSky(seed) {
    return {
      far: buildPopulation(seed, FIELD.far),
      near: buildPopulation(seed + 1, FIELD.near),
      filigree: buildFiligree(seed + 2, FIELD.filigree),
      nebulae: buildNebulae(seed + 3, FIELD.nebulaCount),
      shooters: buildShooters(seed + 4, FIELD.shooter),
      filigreeWebOpacity: FIELD.filigree.webOpacity,
      atmosphere: buildAtmosphere(seed + 11)
    };
  }

  function starCount(g) {
    return g.far.length + g.near.length + g.filigree.reduce(function (n, c) { return n + c.stars.length; }, 0);
  }

  /* ── render: the product's DOM and classes, so its stylesheet drives it ── */

  var SVG_NS = 'http://www.w3.org/2000/svg';
  /* Sizes ride --u so a star keeps its share of the window at any viewport. */
  function usz(n) { return 'max(1px, calc(var(--u) * ' + (+n.toFixed(2)) + '))'; }

  function el(cls, styles) {
    var s = document.createElement('span');
    s.className = cls;
    for (var k in styles) if (styles[k] != null) s.style.setProperty(k, String(styles[k]));
    return s;
  }

  function renderSky(host, seed) {
    var g = buildSky(seed);
    var I = g.atmosphere.intensities;
    var root = document.createElement('div');
    root.className = 'wk-sky';
    root.setAttribute('aria-hidden', 'true');

    g.atmosphere.drift.forEach(function (w) {
      var o = (w.maxOpacity * I.colorDrift) / 100;
      root.appendChild(el('wk-sky__atmo-wash', {
        left: w.x.toFixed(2) + '%', top: w.y.toFixed(2) + '%', width: w.w + '%', height: w.h + '%',
        background: 'radial-gradient(ellipse at center, ' + w.color + ' 0%, transparent 70%)',
        opacity: o, '--wk-sky-atmo-o': o.toFixed(3), '--wk-sky-atmo-drift': w.driftX.toFixed(2) + '%',
        'animation-duration': w.durS.toFixed(0) + 's', 'animation-delay': w.del.toFixed(0) + 's' }));
    });
    g.atmosphere.lobes.forEach(function (n) {
      var o = (n.maxOpacity * I.nebulosity) / 100;
      root.appendChild(el('wk-sky__atmo-lobe', {
        left: n.x.toFixed(2) + '%', top: n.y.toFixed(2) + '%', width: n.w + '%', height: n.h + '%',
        background: 'radial-gradient(ellipse at center, ' + n.color + ' 0%, transparent 70%)',
        transform: 'rotate(' + n.rot.toFixed(2) + 'deg)',
        opacity: o, '--wk-sky-atmo-o': o.toFixed(3),
        'animation-duration': n.durS.toFixed(0) + 's', 'animation-delay': n.del.toFixed(0) + 's' }));
    });
    if (I.airglow > 0) {
      var ao = (0.5 * I.airglow) / 100;
      root.appendChild(el('wk-sky__airglow', { opacity: ao, '--wk-sky-atmo-o': ao.toFixed(3) }));
      root.appendChild(el('wk-sky__airglow-line', { opacity: (0.7 * I.airglow) / 100 }));
    }
    g.atmosphere.milky.washes.forEach(function (w) {
      root.appendChild(el('wk-sky__bandwash', {
        left: w.x.toFixed(2) + '%', top: w.y.toFixed(2) + '%', width: w.w + '%', height: w.h + '%',
        transform: 'rotate(' + w.rot.toFixed(2) + 'deg)', opacity: (w.maxOpacity * I.milkyWay) / 100 }));
    });
    g.atmosphere.milky.dust.forEach(function (d) {
      root.appendChild(el('wk-sky__banddust', {
        left: d.x.toFixed(2) + '%', top: d.y.toFixed(2) + '%',
        width: usz(1), height: usz(1),
        opacity: (d.opacity * I.milkyWay) / 33 }));
    });
    g.nebulae.forEach(function (n) {
      root.appendChild(el('wk-sky__nebula', {
        left: n.x + '%', top: n.y + '%', width: n.w + '%', height: n.h + '%',
        background: 'radial-gradient(ellipse at center, ' + n.color + ' 0%, transparent 70%)',
        opacity: n.opacity, transform: 'rotate(' + n.rot + 'deg)',
        '--wk-sky-nebula-o': n.opacity.toFixed(3),
        'animation-duration': n.dur + 's', 'animation-delay': n.del + 's' }));
    });

    function star(s) {
      return el('wk-sky__star wk-sky__star--' + s.cls + (s.spike ? ' wk-sky__star--spike' : ''), {
        left: s.x.toFixed(2) + '%', top: s.y.toFixed(2) + '%',
        width: usz(s.size), height: usz(s.size),
        'background-color': s.color, opacity: (s.lo + s.hi) / 2,
        'box-shadow': s.halo
          ? '0 0 ' + usz(s.halo) + ' ' + usz(Math.ceil(s.halo / 3)) + ' ' + s.color + '44' : null,
        '--wk-sky-lo': s.lo.toFixed(2), '--wk-sky-hi': s.hi.toFixed(2),
        'animation-duration': s.dur.toFixed(2) + 's', 'animation-delay': s.del.toFixed(2) + 's' });
    }
    var far = document.createElement('div'); far.className = 'wk-sky__layer wk-sky__layer--far';
    g.far.forEach(function (s) { far.appendChild(star(s)); });
    root.appendChild(far);
    var near = document.createElement('div'); near.className = 'wk-sky__layer wk-sky__layer--near';
    g.near.forEach(function (s) { near.appendChild(star(s)); });
    root.appendChild(near);

    var svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', 'wk-sky__filigree-strokes');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.style.setProperty('--wk-sky-web', String(g.filigreeWebOpacity));
    g.filigree.forEach(function (c) {
      c.strokes.forEach(function (st) {
        var line = document.createElementNS(SVG_NS, 'line');
        line.setAttribute('x1', st.x1); line.setAttribute('y1', st.y1);
        line.setAttribute('x2', st.x2); line.setAttribute('y2', st.y2);
        line.setAttribute('class', 'wk-sky__web');
        line.setAttribute('vector-effect', 'non-scaling-stroke');
        svg.appendChild(line);
      });
    });
    root.appendChild(svg);
    g.filigree.forEach(function (c) {
      c.stars.forEach(function (p) {
        root.appendChild(el('wk-sky__star wk-sky__star--filigree', {
          left: p.x.toFixed(2) + '%', top: p.y.toFixed(2) + '%',
          width: usz(p.size), height: usz(p.size), opacity: (p.lo + p.hi) / 2,
          '--wk-sky-lo': p.lo.toFixed(2), '--wk-sky-hi': p.hi.toFixed(2),
          'animation-duration': p.dur.toFixed(2) + 's', 'animation-delay': p.del.toFixed(2) + 's' }));
      });
    });

    g.shooters.forEach(function (sh) {
      root.appendChild(el('wk-sky__shooter', {
        left: sh.x + '%', top: sh.y + '%', width: usz(sh.streak),
        transform: 'rotate(' + sh.angleDeg + 'deg)',
        '--wk-sky-tx': (Math.cos(sh.angleDeg * Math.PI / 180) * sh.travel).toFixed(0) + 'px',
        '--wk-sky-ty': (Math.sin(sh.angleDeg * Math.PI / 180) * sh.travel).toFixed(0) + 'px',
        'animation-duration': sh.period.toFixed(1) + 's',
        'animation-delay': sh.del.toFixed(1) + 's' }));
    });

    g.atmosphere.wisps.forEach(function (w) {
      var o = (w.maxOpacity * I.wisps) / 100;
      root.appendChild(el('wk-sky__wisp', {
        left: w.x.toFixed(2) + '%', top: w.y.toFixed(2) + '%', width: w.w + '%', height: w.h + '%',
        transform: 'rotate(' + w.rot.toFixed(2) + 'deg)',
        opacity: o, '--wk-sky-atmo-o': o.toFixed(3), '--wk-sky-atmo-drift': w.driftX.toFixed(2) + '%',
        'animation-duration': w.durS.toFixed(0) + 's', 'animation-delay': w.del.toFixed(0) + 's' }));
    });

    host.appendChild(root);
    return { root: root, stars: starCount(g), geometry: g };
  }

  var api = { buildSky: buildSky, starCount: starCount, renderSky: renderSky, FIELD: FIELD, SEED: 20260728 };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') {
    window.WizkooSky = api;
    var mount = function () {
      var host = document.querySelector('[data-wk-sky]');
      if (!host || host.dataset.wkSkyMounted) return;
      host.dataset.wkSkyMounted = '1';
      var r = renderSky(host, Number(host.dataset.wkSkySeed) || 20260728);
      host.dataset.wkSkyStars = String(r.stars);
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
    else mount();
  }
})();
