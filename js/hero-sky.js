/**
 * THE CERTIFIED SKY: ported from wizkoo-app for the marketing hero window.
 *
 * SOURCE OF TRUTH
 *   packages/ui/src/TwoLayerSky/skyGeneration.ts  @ e1a90b2 (wp-14-spectacle)
 *   packages/ui/src/TwoLayerSky/TwoLayerSky.tsx   @ e1a90b2
 *   packages/design-tokens/src/tokens.ts          @ e1a90b2  (ambientSky)
 *   plus the authorized primitive amendment a62dc1d (filigree q3 quantize)
 *   Volume: 'spectacle', the rung /start renders (SentenceCanvas.tsx:422).
 *
 * WHAT IS VERBATIM
 *   The PRNG, every builder function, the rand() call order, the sub-seed
 *   layout (+0 far, +1 near, +2 filigree, +3 nebula, +4 shooters, +11..+14
 *   atmosphere), the ambientSky token values, and the emitted DOM (same
 *   classes, same inline style properties, same child order as the React
 *   component). TwoLayerSky.css is copied byte-for-byte into
 *   css/hero-sky.css. Same seed in, same sky out, element for element.
 *
 * WHAT IS NOT REACT
 *   Only the transport. React's createElement is replaced with
 *   document.createElement; the type annotations are stripped. No behaviour
 *   is re-expressed. scripts/verify-sky-port.js gates the census against the
 *   certified count (829 at seed 20260728).
 *
 * FRAMING
 *   The primitive lays everything out in percentages, so squashing a full sky
 *   into a 560x340 window would multiply its per-area star density by ~2.7x
 *   and stop looking like the product. Instead the sky element is rendered at
 *   the certified reference frame size (1232x420, per the ambientSky comment)
 *   and centred inside the window, which clips it. The window therefore shows
 *   a literal small piece of the product's own sky: certified star sizes in
 *   px, certified density per area, certified drift.
 */
(function () {
  'use strict';

  /* ── ambientSky, verbatim from packages/design-tokens @ e1a90b2 ────── */
  var A = {
    far: { faints: 170, dust: 150, twinkleScale: 0.55, clusterCount: 5, clusterShare: 0.6 },
    near: { anchors: 9, brights: 30, mids: 130, faints: 55, twinkleScale: 1, clusterCount: 4, clusterShare: 0.5, wave: true },
    colors: {
      cool: ['#EAF2FF', '#DDE8FF', '#F0F2F8', '#C8D8F0'],
      warm: ['#FFF6E4', '#F5EFD9'],
      warmShare: 0.22,
      faint: '#C8D8F0',
      dust: '#F0F2F8'
    },
    filigree: {
      clusters: 2, starsMin: 12, starsMax: 16, maxDegree: 3, dropShare: 0.3, spread: 3.4,
      webColor: '#7288B4', webOpacity: 0.055, strokeWidth: 0.6, blurPx: 0.4, starColor: '#97ABD0'
    },
    nebula: { count: 1, colors: ['#1E3060', '#24406F', '#182F58'], opacityMin: 0.09, opacityMax: 0.16 },
    shooters: { count: 2, periodMinS: 50, periodMaxS: 70 },
    hole: { semiAxis: 18.7, exponent: 6, featherBand: 0.8 },
    atmosphere: { colorDrift: 35, nebulosity: 45, airglow: 56, milkyWay: 21, wisps: 32 }
  };

  /* ── generation, verbatim ──────────────────────────────────────────── */

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

  function holeMetric(x, y) {
    var dx = Math.abs(x - 50) / A.hole.semiAxis;
    var dy = Math.abs(y - 50) / A.hole.semiAxis;
    return Math.pow(dx, A.hole.exponent) + Math.pow(dy, A.hole.exponent);
  }
  function inCenterHole(x, y) { return holeMetric(x, y) < 1; }

  function sampleUniform(rand) {
    for (;;) {
      var x = rand() * 100;
      var y = rand() * 100;
      var u = holeMetric(x, y);
      if (u < 1) continue;
      if (u < 1 + A.hole.featherBand) {
        var t = (u - 1) / A.hole.featherBand;
        if (rand() > t) continue;
      }
      return { x: x, y: y };
    }
  }

  function makeClusterSampler(rand, clusterCount, clusterShare) {
    var knots = [];
    for (var i = 0; i < clusterCount; i++) {
      var p = sampleUniform(rand);
      knots.push({ x: p.x, y: p.y, spread: 7 + rand() * 9 });
    }
    var gauss = function () {
      var u = Math.max(rand(), 1e-9);
      var v = rand();
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    };
    return function () {
      if (rand() > clusterShare) return sampleUniform(rand);
      for (var tries = 0; tries < 8; tries++) {
        var k = knots[Math.floor(rand() * knots.length)];
        var x = k.x + gauss() * k.spread;
        var y = k.y + gauss() * k.spread;
        if (x >= 0 && x <= 100 && y >= 0 && y <= 100 && !inCenterHole(x, y)) return { x: x, y: y };
      }
      return sampleUniform(rand);
    };
  }

  function starColor(rand, cls) {
    var c = A.colors;
    if (cls === 'dust') return c.dust;
    if (cls === 'faint') return rand() < 0.85 ? c.faint : c.dust;
    var warm = rand() < c.warmShare;
    var pool = warm ? c.warm : c.cool;
    return pool[Math.floor(rand() * pool.length)];
  }

  function buildPopulation(seed, cfg) {
    var rand = mulberry32(seed);
    var clustered = makeClusterSampler(rand, cfg.clusterCount, cfg.clusterShare);
    var stars = [];

    function push(cls, n, size, lo, hi, dur, sampler, spike, halo) {
      spike = spike || false; halo = halo || 0;
      for (var i = 0; i < n; i++) {
        var p = sampler();
        var d = dur() / cfg.twinkleScale;
        stars.push({
          x: p.x, y: p.y,
          size: size(),
          cls: cls,
          color: starColor(rand, cls),
          lo: lo(), hi: hi(),
          dur: d,
          del: cfg.waveDelays ? ((p.x + p.y) / 200) * d : rand() * d,
          spike: spike && rand() < 0.6,
          halo: halo
        });
      }
    }

    push('anchor', cfg.anchors,
      function () { return 2.5 + rand() * 1.2; },
      function () { return 0.55 + rand() * 0.1; }, function () { return 0.92 + rand() * 0.08; },
      function () { return 4 + rand() * 3; },
      function () { return sampleUniform(rand); },
      true, 8);

    push('bright', cfg.brights,
      function () { return 1.8 + rand() * 0.6; },
      function () { return 0.42 + rand() * 0.12; }, function () { return 0.75 + rand() * 0.18; },
      function () { return 2.5 + rand() * 3; },
      function () { return sampleUniform(rand); },
      false, 4);

    push('mid', cfg.mids,
      function () { return 1 + (rand() < 0.6 ? 0 : 0.5); },
      function () { return 0.2 + rand() * 0.15; }, function () { return 0.5 + rand() * 0.22; },
      function () { return 2 + rand() * 4; },
      clustered);

    push('faint', cfg.faints,
      function () { return 1; },
      function () { return 0.08 + rand() * 0.1; }, function () { return 0.24 + rand() * 0.16; },
      function () { return 3 + rand() * 5; },
      clustered);

    push('dust', cfg.dust,
      function () { return 1; },
      function () { return 0.03 + rand() * 0.05; }, function () { return 0.1 + rand() * 0.1; },
      function () { return 5 + rand() * 5; },
      function () { return sampleUniform(rand); });

    return stars;
  }

  /** Quantize to 3 decimals (amendment a62dc1d): floats 1 ulp apart collapse. */
  function q3(v) { return Number(v.toFixed(3)); }

  var FILIGREE_ZONES = [
    { x: 6, y: 8 },
    { x: 78, y: 62 },
    { x: 76, y: 8 },
    { x: 8, y: 64 }
  ];

  function buildFiligree(seed, clusterCount, cfg) {
    var rand = mulberry32(seed);
    var gauss = function () {
      var u = Math.max(rand(), 1e-9);
      var v = rand();
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    };
    var zones = FILIGREE_ZONES.slice();
    for (var i = zones.length - 1; i > 0; i--) {
      var j = Math.floor(rand() * (i + 1));
      var tmp = zones[i]; zones[i] = zones[j]; zones[j] = tmp;
    }

    var count = Math.min(clusterCount, zones.length);
    var clusters = [];
    for (var c = 0; c < count; c++) {
      var zone = zones[c];
      var n = cfg.starsMin + Math.floor(rand() * (cfg.starsMax - cfg.starsMin + 1));
      var axis = rand() * Math.PI;
      var cosA = Math.cos(axis);
      var sinA = Math.sin(axis);
      var stretch = 1.5 + rand() * 0.9;

      var stars = [];
      while (stars.length < n) {
        var u2 = gauss() * cfg.spread * stretch;
        var v2 = gauss() * cfg.spread * 0.7;
        var x = zone.x + 7 + (u2 * cosA - v2 * sinA);
        var y = zone.y + 6 + (u2 * sinA + v2 * cosA);
        if (x < 1 || x > 99 || y < 1 || y > 99 || inCenterHole(x, y)) continue;
        stars.push({
          x: x, y: y,
          size: 0.8 + rand() * 0.8,
          lo: 0.08 + rand() * 0.12,
          hi: 0.22 + rand() * 0.18,
          dur: 4 + rand() * 4,
          del: rand() * 5
        });
      }

      var candidates = [];
      for (var i2 = 0; i2 < stars.length; i2++) {
        var dists = stars
          .map(function (s, jj) { return { j: jj, d: Math.hypot(s.x - stars[i2].x, s.y - stars[i2].y) }; })
          .filter(function (e) { return e.j !== i2; })
          .sort(function (p, q) { return p.d - q.d; })
          .slice(0, 3);
        for (var di = 0; di < dists.length; di++) {
          var e0 = dists[di];
          var a0 = Math.min(i2, e0.j);
          var b0 = Math.max(i2, e0.j);
          var seen = candidates.some(function (x2) { return x2.a === a0 && x2.b === b0; });
          if (!seen) candidates.push({ a: a0, b: b0, d: e0.d });
        }
      }
      var degree = new Array(stars.length).fill(0);
      var strokes = [];
      var sorted = candidates.sort(function (p, q) { return p.d - q.d; });
      for (var si = 0; si < sorted.length; si++) {
        var e = sorted[si];
        if (rand() < cfg.dropShare) continue;
        if (degree[e.a] >= cfg.maxDegree || degree[e.b] >= cfg.maxDegree) continue;
        degree[e.a]++;
        degree[e.b]++;
        strokes.push({
          x1: q3(stars[e.a].x), y1: q3(stars[e.a].y),
          x2: q3(stars[e.b].x), y2: q3(stars[e.b].y)
        });
      }
      clusters.push({ stars: stars, strokes: strokes, danglers: degree.filter(function (d) { return d === 0; }).length });
    }
    return clusters;
  }

  function buildNebulae(seed, count) {
    var rand = mulberry32(seed);
    var palette = A.nebula.colors;
    var oMin = A.nebula.opacityMin;
    var oMax = A.nebula.opacityMax;
    var out = [];
    for (var i = 0; i < count; i++) {
      var edge = rand();
      var x = edge < 0.5 ? 2 + rand() * 20 : 62 + rand() * 24;
      var y = 4 + rand() * 80;
      out.push({
        x: x, y: y,
        w: 30 + rand() * 24,
        h: 14 + rand() * 12,
        color: palette[Math.floor(rand() * palette.length)],
        opacity: oMin + rand() * (oMax - oMin),
        dur: 18 + rand() * 14,
        del: rand() * 10,
        rot: (rand() - 0.5) * 40
      });
    }
    return out;
  }

  function buildShootingStars(seed, count, periodMinS, periodMaxS) {
    var rand = mulberry32(seed);
    var out = [];
    for (var i = 0; i < count; i++) {
      out.push({
        x: 5 + rand() * 45,
        y: 2 + rand() * 8,
        angleDeg: 8 + rand() * 6,
        travel: 200 + rand() * 100,
        period: periodMinS + rand() * (periodMaxS - periodMinS),
        del: 3 + i * 9 + rand() * 6,
        streak: 60 + rand() * 40
      });
    }
    return out;
  }

  function buildColorDrift(seed) {
    var rand = mulberry32(seed);
    return [
      {
        x: -8 + rand() * 6, y: 10 + rand() * 30,
        w: 44, h: 78,
        color: '#52304A',
        maxOpacity: 0.34,
        durS: 110 + rand() * 30,
        del: rand() * 20,
        driftX: 3 + rand() * 2
      },
      {
        x: 66 + rand() * 6, y: 4 + rand() * 26,
        w: 44, h: 82,
        color: '#1E4A55',
        maxOpacity: 0.30,
        durS: 110 + rand() * 30,
        del: 30 + rand() * 25,
        driftX: 3 + rand() * 2
      }
    ];
  }

  var NEBULOSITY_COLORS = ['#4A2A4E', '#3A2E5E', '#1E4A55'];

  function buildNebulosity(seed) {
    var rand = mulberry32(seed);
    var lobes = [];
    for (var patch = 0; patch < 3; patch++) {
      var left = rand() < 0.5;
      var ax = left ? 2 + rand() * 16 : 60 + rand() * 24;
      var ay = 6 + rand() * 74;
      var base = NEBULOSITY_COLORS[patch % NEBULOSITY_COLORS.length];
      var second = NEBULOSITY_COLORS[(patch + 1 + Math.floor(rand() * 2)) % NEBULOSITY_COLORS.length];
      lobes.push({
        x: ax, y: ay,
        w: 22 + rand() * 14, h: 10 + rand() * 8,
        color: base,
        maxOpacity: 0.30 + rand() * 0.1,
        rot: (rand() - 0.5) * 50,
        durS: 24 + rand() * 16,
        del: rand() * 12
      });
      lobes.push({
        x: ax + (rand() - 0.5) * 8, y: ay + (rand() - 0.5) * 8,
        w: 14 + rand() * 10, h: 7 + rand() * 6,
        color: second,
        maxOpacity: 0.26 + rand() * 0.1,
        rot: (rand() - 0.5) * 60,
        durS: 24 + rand() * 16,
        del: rand() * 12
      });
    }
    return lobes;
  }

  function buildMilkyWay(seed) {
    var rand = mulberry32(seed);
    var gauss = function () {
      var u = Math.max(rand(), 1e-9);
      var v = rand();
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    };
    var angleDeg = 24 + rand() * 10;
    var slope = Math.tan((angleDeg * Math.PI) / 180);
    var intercept = 18 + rand() * 10;
    var dust = [];
    while (dust.length < 240) {
      var x = rand() * 100;
      var y = x * slope + intercept + gauss() * 7;
      if (y < 1 || y > 99 || inCenterHole(x, y)) continue;
      dust.push({ x: x, y: y, opacity: 0.02 + rand() * 0.06 });
    }
    var washes = [
      { x: 4, y: intercept - 4, w: 34, h: 13, rot: angleDeg, maxOpacity: 0.20 },
      { x: 66, y: 66 * slope + intercept - 4, w: 34, h: 13, rot: angleDeg, maxOpacity: 0.18 }
    ];
    return { dust: dust, washes: washes, angleDeg: angleDeg };
  }

  function buildWisps(seed) {
    var rand = mulberry32(seed);
    var zones = [
      { x: 6 + rand() * 14, y: 8 + rand() * 12 },
      { x: 56 + rand() * 20, y: 70 + rand() * 14 },
      { x: 4 + rand() * 12, y: 64 + rand() * 16 }
    ];
    return zones.map(function (z) {
      return {
        x: z.x, y: z.y,
        w: 28 + rand() * 12, h: 3.5 + rand() * 2,
        rot: (rand() - 0.5) * 24,
        maxOpacity: 0.16 + rand() * 0.08,
        durS: 130 + rand() * 50,
        del: rand() * 40,
        driftX: 4 + rand() * 3
      };
    });
  }

  /* The volume ladder. Only 'spectacle' is ported: it is the rung /start
     renders, and the marketing window must match /start. */
  var VOLUMES = {
    spectacle: {
      far: {
        anchors: 0, brights: 0, mids: 0,
        faints: A.far.faints, dust: A.far.dust,
        clusterCount: A.far.clusterCount, clusterShare: A.far.clusterShare,
        twinkleScale: A.far.twinkleScale
      },
      near: {
        anchors: A.near.anchors, brights: A.near.brights,
        mids: A.near.mids, faints: A.near.faints, dust: 0,
        clusterCount: A.near.clusterCount, clusterShare: A.near.clusterShare,
        twinkleScale: A.near.twinkleScale,
        waveDelays: A.near.wave
      },
      filigreeClusters: A.filigree.clusters,
      filigreeWebOpacity: A.filigree.webOpacity,
      nebulaCount: A.nebula.count,
      shooterCount: A.shooters.count,
      shooterPeriod: [A.shooters.periodMinS, A.shooters.periodMaxS],
      atmosphere: {
        colorDrift: A.atmosphere.colorDrift,
        nebulosity: A.atmosphere.nebulosity,
        airglow: A.atmosphere.airglow,
        milkyWay: A.atmosphere.milkyWay,
        wisps: A.atmosphere.wisps
      }
    }
  };

  /** Sub-seed layout is the lab's: +0 far, +1 near, +2 filigree, +3 nebula, +4 shooters. */
  function buildSkyGeometry(volume, seed) {
    var v = VOLUMES[volume];
    return {
      far: buildPopulation(seed, v.far),
      near: buildPopulation(seed + 1, v.near),
      filigree: buildFiligree(seed + 2, v.filigreeClusters, {
        starsMin: A.filigree.starsMin,
        starsMax: A.filigree.starsMax,
        maxDegree: A.filigree.maxDegree,
        dropShare: A.filigree.dropShare,
        spread: A.filigree.spread
      }),
      nebulae: buildNebulae(seed + 3, v.nebulaCount),
      shooters: buildShootingStars(seed + 4, v.shooterCount, v.shooterPeriod[0], v.shooterPeriod[1]),
      filigreeWebOpacity: v.filigreeWebOpacity,
      atmosphere: {
        drift: v.atmosphere.colorDrift > 0 ? buildColorDrift(seed + 11) : [],
        lobes: v.atmosphere.nebulosity > 0 ? buildNebulosity(seed + 12) : [],
        milky: v.atmosphere.milkyWay > 0 ? buildMilkyWay(seed + 13) : null,
        wisps: v.atmosphere.wisps > 0 ? buildWisps(seed + 14) : [],
        intensities: v.atmosphere
      }
    };
  }

  function countGeometryElements(g) {
    return (
      g.far.length +
      g.near.length +
      g.filigree.reduce(function (n, c) { return n + c.stars.length; }, 0) +
      g.nebulae.length +
      g.shooters.length +
      g.atmosphere.drift.length +
      g.atmosphere.lobes.length +
      (g.atmosphere.milky ? g.atmosphere.milky.dust.length + g.atmosphere.milky.washes.length : 0) +
      g.atmosphere.wisps.length +
      (g.atmosphere.intensities.airglow > 0 ? 2 : 0)
    );
  }

  /* ── render: the DOM TwoLayerSky.tsx emits, same order, same styles ── */

  var SVG_NS = 'http://www.w3.org/2000/svg';

  function el(cls, styles) {
    var s = document.createElement('span');
    s.className = cls;
    for (var k in styles) if (styles[k] !== undefined && styles[k] !== null) s.style.setProperty(k, String(styles[k]));
    return s;
  }

  function renderSky(host, volume, seed) {
    var g = buildSkyGeometry(volume, seed);
    var root = document.createElement('div');
    root.className = 'wk-sky';
    root.setAttribute('aria-hidden', 'true');
    root.setAttribute('data-volume', volume);
    var I = g.atmosphere.intensities;

    /* Atmosphere UNDER the stars: drift, nebulosity, airglow, milky way */
    g.atmosphere.drift.forEach(function (w) {
      var o = (w.maxOpacity * I.colorDrift) / 100;
      root.appendChild(el('wk-sky__atmo-wash', {
        left: w.x.toFixed(2) + '%', top: w.y.toFixed(2) + '%',
        width: w.w + '%', height: w.h + '%',
        background: 'radial-gradient(ellipse at center, ' + w.color + ' 0%, transparent 70%)',
        opacity: o,
        '--wk-sky-atmo-o': o.toFixed(3),
        '--wk-sky-atmo-drift': w.driftX.toFixed(2) + '%',
        'animation-duration': w.durS.toFixed(0) + 's',
        'animation-delay': w.del.toFixed(0) + 's'
      }));
    });
    g.atmosphere.lobes.forEach(function (n) {
      var o = (n.maxOpacity * I.nebulosity) / 100;
      root.appendChild(el('wk-sky__atmo-lobe', {
        left: n.x.toFixed(2) + '%', top: n.y.toFixed(2) + '%',
        width: n.w + '%', height: n.h + '%',
        background: 'radial-gradient(ellipse at center, ' + n.color + ' 0%, transparent 70%)',
        transform: 'rotate(' + n.rot.toFixed(2) + 'deg)',
        opacity: o,
        '--wk-sky-atmo-o': o.toFixed(3),
        'animation-duration': n.durS.toFixed(0) + 's',
        'animation-delay': n.del.toFixed(0) + 's'
      }));
    });
    if (I.airglow > 0) {
      var ao = (0.5 * I.airglow) / 100;
      root.appendChild(el('wk-sky__airglow', { opacity: ao, '--wk-sky-atmo-o': ao.toFixed(3) }));
      root.appendChild(el('wk-sky__airglow-line', { opacity: (0.7 * I.airglow) / 100 }));
    }
    if (g.atmosphere.milky) {
      g.atmosphere.milky.washes.forEach(function (w) {
        root.appendChild(el('wk-sky__bandwash', {
          left: w.x.toFixed(2) + '%', top: w.y.toFixed(2) + '%',
          width: w.w + '%', height: w.h + '%',
          transform: 'rotate(' + w.rot.toFixed(2) + 'deg)',
          opacity: (w.maxOpacity * I.milkyWay) / 100
        }));
      });
      g.atmosphere.milky.dust.forEach(function (d) {
        root.appendChild(el('wk-sky__banddust', {
          left: d.x.toFixed(2) + '%', top: d.y.toFixed(2) + '%',
          opacity: (d.opacity * I.milkyWay) / 33
        }));
      });
    }

    g.nebulae.forEach(function (n) {
      root.appendChild(el('wk-sky__nebula', {
        left: n.x + '%', top: n.y + '%',
        width: n.w + '%', height: n.h + '%',
        background: 'radial-gradient(ellipse at center, ' + n.color + ' 0%, transparent 70%)',
        opacity: n.opacity,
        transform: 'rotate(' + n.rot + 'deg)',
        '--wk-sky-nebula-o': n.opacity.toFixed(3),
        'animation-duration': n.dur + 's',
        'animation-delay': n.del + 's'
      }));
    });

    function star(s) {
      var cls = 'wk-sky__star wk-sky__star--' + s.cls + (s.spike ? ' wk-sky__star--spike' : '');
      return el(cls, {
        left: s.x.toFixed(2) + '%', top: s.y.toFixed(2) + '%',
        width: s.size + 'px', height: s.size + 'px',
        'background-color': s.color,
        opacity: (s.lo + s.hi) / 2,
        'box-shadow': s.halo ? '0 0 ' + s.halo + 'px ' + Math.ceil(s.halo / 3) + 'px ' + s.color + '44' : null,
        '--wk-sky-lo': s.lo.toFixed(2),
        '--wk-sky-hi': s.hi.toFixed(2),
        'animation-duration': s.dur.toFixed(2) + 's',
        'animation-delay': s.del.toFixed(2) + 's'
      });
    }

    var farLayer = document.createElement('div');
    farLayer.className = 'wk-sky__layer wk-sky__layer--far';
    g.far.forEach(function (s) { farLayer.appendChild(star(s)); });
    root.appendChild(farLayer);

    var nearLayer = document.createElement('div');
    nearLayer.className = 'wk-sky__layer wk-sky__layer--near';
    g.near.forEach(function (s) { nearLayer.appendChild(star(s)); });
    root.appendChild(nearLayer);

    /* Filigree constellations (comment as in TwoLayerSky.tsx): tone-on-tone
       star-chart regions */
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
          width: p.size + 'px', height: p.size + 'px',
          opacity: (p.lo + p.hi) / 2,
          '--wk-sky-lo': p.lo.toFixed(2),
          '--wk-sky-hi': p.hi.toFixed(2),
          'animation-duration': p.dur.toFixed(2) + 's',
          'animation-delay': p.del.toFixed(2) + 's'
        }));
      });
    });

    g.shooters.forEach(function (sh) {
      root.appendChild(el('wk-sky__shooter', {
        left: sh.x + '%', top: sh.y + '%',
        width: sh.streak + 'px',
        transform: 'rotate(' + sh.angleDeg + 'deg)',
        '--wk-sky-tx': (Math.cos(sh.angleDeg * Math.PI / 180) * sh.travel).toFixed(0) + 'px',
        '--wk-sky-ty': (Math.sin(sh.angleDeg * Math.PI / 180) * sh.travel).toFixed(0) + 'px',
        'animation-duration': sh.period.toFixed(1) + 's',
        'animation-delay': sh.del.toFixed(1) + 's'
      }));
    });

    /* Atmosphere OVER everything: the wisps, stars shining through */
    g.atmosphere.wisps.forEach(function (w) {
      var o = (w.maxOpacity * I.wisps) / 100;
      root.appendChild(el('wk-sky__wisp', {
        left: w.x.toFixed(2) + '%', top: w.y.toFixed(2) + '%',
        width: w.w + '%', height: w.h + '%',
        transform: 'rotate(' + w.rot.toFixed(2) + 'deg)',
        opacity: o,
        '--wk-sky-atmo-o': o.toFixed(3),
        '--wk-sky-atmo-drift': w.driftX.toFixed(2) + '%',
        'animation-duration': w.durS.toFixed(0) + 's',
        'animation-delay': w.del.toFixed(0) + 's'
      }));
    });

    host.appendChild(root);
    return { root: root, census: countGeometryElements(g) };
  }

  /* ── mount ─────────────────────────────────────────────────────────── */

  var api = {
    buildSkyGeometry: buildSkyGeometry,
    countGeometryElements: countGeometryElements,
    renderSky: renderSky,
    CERTIFIED_SEED: 20260728
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') {
    window.WizkooSky = api;
    var mount = function () {
      var host = document.querySelector('[data-wk-sky]');
      if (!host || host.dataset.wkSkyMounted) return;
      host.dataset.wkSkyMounted = '1';
      var r = renderSky(host, 'spectacle', Number(host.dataset.wkSkySeed) || 20260728);
      host.dataset.wkSkyCensus = String(r.census);
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
    else mount();
  }
})();
