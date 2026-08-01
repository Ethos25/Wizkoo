/**
 * ═══════════════════════════════════════════════════════════════════════════
 * THE CONSTELLATION — the figure, its scintillation, and its arrival beat
 *
 * Every geometric and chromatic value in this file is transcribed from
 * docs/constellation-geometry.html (approved 7A desktop / 7B mobile). Nothing
 * here is derived by eye. The tables in SPEC, the trim formula, the gradient
 * stop profile, the halo formulas, the scintillation periods and the label
 * formulas are the spec's, verbatim.
 *
 * WHAT IS *NOT* IN THE SPEC, and is therefore authored here: the arrival beat
 * (§ BEAT below). The spec covers the figure at rest; the beat is how it
 * arrives. Its reasoning is recorded inline.
 *
 * STRUCTURE PER STAR — three nested elements, so that three independent
 * things can act on one point without any of them repainting:
 *
 *   .wkc-star   the spec's [data-star] box. Carries SCINTILLATION (opacity,
 *               spec period/delay/--dim). Runs from load, forever.
 *     .wkc-ign  carries IGNITION (opacity + transform). Runs once, in the beat.
 *       .wkc-halo   the wide halo shadow. Overshoots on ignition and settles.
 *       .wkc-core   the fill circle and its tight inner glow.
 *
 * Opacity multiplies down the tree, so scintillation and ignition compose
 * without either needing to know about the other. At rest both are 1 and the
 * composite is bit-identical to the spec's single-element rendering: the
 * spec's two box-shadow layers are split across .wkc-halo and .wkc-core, and
 * because a box-shadow list paints first-listed on top and .wkc-core is later
 * in the DOM, the paint order is unchanged.
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function (global) {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';

  /* ───────────────────────── SPEC § 2, 3, 7 — the tables ───────────────── */

  var CHALK = [250, 247, 240];      /* spec § 8: NOT the surface token #F8F4E9 */
  var SAFFRON = [243, 199, 101];    /* spec § 8: NOT the accent token #E8AF38  */

  var HUE = {
    Reading:   [56, 72, 208],       /* #3848D0  Language Arts */
    Writing:   [56, 72, 208],       /* #3848D0  shares the LA hue by design    */
    Math:      [232, 216, 0],       /* #E8D800 */
    Science:   [56, 176, 96],       /* #38B060 */
    Art:       [136, 72, 224],      /* #8848E0 */
    Geography: [200, 48, 48]        /* #C83030 */
  };
  var TINT = 0.28;                  /* spec § 2: the ceiling. Above it the
                                       figure reads as colour coding.         */

  /* [x, y, r, b, labelDx, labelDy, anchor] */
  var SPEC = {
    desktop: {
      win: [620, 376], band: { x: 44, y: 140, w: 532, h: 178 },
      pad: [30, 44], gap: 18,
      type: { eyebrow: 9.5, sentence: 30, handle: 12, handlePad: [14, 18],
              labelA: 8.8, labelB: 1.4, alphaA: 0.17, alphaB: 0.29 },
      trim: [3.1, 3.5], core: 0.55,
      stars: {
        space:     [200,  30, 5.6, 1.00,   0,   0, 'o'],
        Reading:   [ 96,  88, 3.6, 0.98, -13,   0, 'l'],
        Math:      [146, 152, 2.7, 0.66,  12,   0, 'r'],
        Science:   [312,  66, 3.3, 0.90,  13,   0, 'r'],
        Writing:   [262, 146, 2.2, 0.50,   0,  13, 'b'],
        Art:       [416, 124, 1.7, 0.30,  11,   0, 'r'],
        Geography: [452,  36, 1.5, 0.26,   0, -19, 't']
      },
      tether: [216, -12, 200, 30]
    },
    mobile: {
      win: [335, 203], band: { x: 18, y: 86, w: 299, h: 64 },
      pad: [16, 18], gap: 10,
      type: { eyebrow: 7.5, sentence: 15, handle: 8.5, handlePad: [10, 12],
              labelA: 8.3, labelB: 1.0, alphaA: 0.24, alphaB: 0.29 },
      trim: [2.6, 2.0], core: 0.50,
      stars: {
        space:     [132,  8, 3.9, 1.00,  0, 0, 'o'],
        Reading:   [ 62, 30, 2.6, 0.95, -8, 0, 'l'],
        Math:      [ 96, 56, 2.0, 0.62,  8, 0, 'r'],
        Science:   [196, 28, 2.4, 0.88,  8, 0, 'r'],
        Writing:   [166, 54, 1.7, 0.48,  8, 0, 'r'],
        Art:       [262, 50, 1.4, 0.30,  7, 0, 'r'],
        Geography: [246, 12, 1.3, 0.26, -7, 0, 'l']
      },
      tether: [110, -10, 132, 8]
    }
  };

  /* Art is connected TWICE, from Science and from Writing (spec § 8). It is
     not a stray; removing either arm re-orphans it. */
  var EDGES = [
    ['space', 'Reading'], ['space', 'Science'], ['space', 'Writing'],
    ['Reading', 'Math'], ['Science', 'Geography'], ['Science', 'Art'],
    ['Writing', 'Art']
  ];
  var HOP = { space: 0, Reading: 1, Science: 1, Writing: 1,
              Math: 2, Geography: 2, Art: 2 };
  /* Order is also the scintillation stagger order (spec § 2, § 6). */
  var ORDER = ['space', 'Reading', 'Math', 'Science', 'Writing', 'Art', 'Geography'];

  var ANCHOR = { o: 'translate(0,0)', r: 'translate(0,-50%)',
                 l: 'translate(-100%,-50%)', b: 'translate(-50%,0)',
                 t: 'translate(-50%,-100%)' };

  function mix(a, b, t) { return a.map(function (v, i) { return Math.round(v + (b[i] - v) * t); }); }
  function rgba(c, a) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + (+a.toFixed(3)) + ')'; }
  function tierOf(n) { return n <= 1 ? 1 : n === 2 ? 0.72 : 0.5; }
  function hueOf(k) { return k === 'space' ? SAFFRON : mix(CHALK, HUE[k], TINT); }

  /* ═══════════════════════════ § BEAT — authored ═════════════════════════
   * The spec stops at the figure. Everything in this block is this session's,
   * crafted against the brief: light accelerating away from a source and
   * settling, never linear; each star lit BY the light that reaches it.
   *
   * ORIGIN         theme star ignites alone for 380ms before any light leaves
   *                it. It is the cause; the pause is what makes it read as one.
   * TRAVEL         an arm's duration scales with its DRAWN length (trimmed,
   *                not centre-to-centre) as len^0.62, not len^1. A linear map
   *                makes the 55-unit Reading->Math arm feel snapped and the
   *                137-unit Writing->Art arm feel dragged; the sub-linear
   *                exponent lets long arms cover ground faster, which is what
   *                light does and what the eye expects.
   * ONE RHYTHM     length is measured against THAT SIZE'S OWN median arm, not
   *                an absolute constant. 7B's arms are physically about half
   *                7A's, so a shared constant ran the phone's whole beat in
   *                2.38s — under the floor, and a different piece of music.
   *                Normalising per size makes the two beats the same shape at
   *                two scales, which is what they are.
   * DEPARTURE      light leaves a star that is still BECOMING bright, at 55%
   *                of its ignition, not after it. Waiting for full magnitude
   *                puts a stall at every hop and turns one event into six.
   * ARRIVAL        a star's ignition begins on the frame its arm completes.
   *                Art's two arms land 145ms apart; the first lights it, the
   *                second reinforces — which is the right reading for the only
   *                doubly-connected point in the figure.
   * LABELS         260ms behind their own star's ignition, never behind a
   *                global clock, so the offset reads as caused by that star.
   * TETHER         last, closing the loop between the sentence and the figure.
   * ══════════════════════════════════════════════════════════════════════ */
  var BEAT = {
    originIgnite: 520,     /* theme star rise, with the bloom overshoot        */
    originLead:   380,     /* origin alone before the first light leaves it    */
    travelBase:   420,     /* ms for an arm of that size's median drawn length */
    travelExp:    0.62,
    ignite:       340,     /* subject star rise                               */
    departAt:     0.55,    /* fraction of source ignition before light leaves  */
    labelLag:     260,     /* behind that star's own ignition start            */
    labelIn:      420,
    tetherLag:    380,     /* after the last label starts                      */
    tetherIn:     620
  };

  /* ────────────────────────────── build ──────────────────────────────────
     Builds the figure into `band` (a positioned element). Returns a handle
     carrying the computed beat schedule and a play() that latches. */
  function build(band, cfg, opts) {
    opts = opts || {};
    var W = cfg.band.w, H = cfg.band.h, S = cfg.stars, T = cfg.type;
    var uid = (opts.uid || 'c') + Math.random().toString(36).slice(2, 7);
    var reduced = global.matchMedia &&
                  global.matchMedia('(prefers-reduced-motion:reduce)').matches;

    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('class', 'wkc-svg');
    var defs = document.createElementNS(NS, 'defs');
    svg.appendChild(defs);

    var arms = [];

    /* ── SPEC § 3 — the seven arms ──────────────────────────────────────
       Every arm is trimmed at BOTH ends by gap = r * trim[0] + trim[1], and
       the gradient runs to zero at both trimmed ends, so no line ever touches
       a star: it dissolves into the glow. */
    EDGES.forEach(function (pair, i) {
      var A = S[pair[0]], B = S[pair[1]];
      var dx = B[0] - A[0], dy = B[1] - A[1];
      var len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len;
      var gA = A[2] * cfg.trim[0] + cfg.trim[1];
      var gB = B[2] * cfg.trim[0] + cfg.trim[1];
      var x1 = A[0] + ux * gA, y1 = A[1] + uy * gA;
      var x2 = B[0] - ux * gB, y2 = B[1] - uy * gB;
      var cA = hueOf(pair[0]), cB = hueOf(pair[1]);
      var t = tierOf(Math.max(HOP[pair[0]], HOP[pair[1]]));
      var pA = 0.5 * A[3] * t, pB = 0.5 * B[3] * t;

      var id = 'wkc' + uid + '_' + i;
      var lg = document.createElementNS(NS, 'linearGradient');
      lg.setAttribute('id', id);
      lg.setAttribute('gradientUnits', 'userSpaceOnUse');
      lg.setAttribute('x1', x1); lg.setAttribute('y1', y1);
      lg.setAttribute('x2', x2); lg.setAttribute('y2', y2);
      [['0%', rgba(cA, 0)],
       ['11%', rgba(cA, pA)],
       ['32%', rgba(cA, pA * 0.18)],
       ['50%', rgba(mix(cA, cB, 0.5), 0.022 * t)],
       ['68%', rgba(cB, pB * 0.18)],
       ['89%', rgba(cB, pB)],
       ['100%', rgba(cB, 0)]].forEach(function (st) {
        var s = document.createElementNS(NS, 'stop');
        s.setAttribute('offset', st[0]);
        s.setAttribute('stop-color', st[1]);
        lg.appendChild(s);
      });
      defs.appendChild(lg);

      /* Painted twice: glow 3.4 @ 0.24, core cfg.core. Both live in one <g>
         so the beat draws them as a single travelling filament. */
      var g = document.createElementNS(NS, 'g');
      g.setAttribute('class', 'wkc-arm');
      var d = 'M' + x1.toFixed(2) + ' ' + y1.toFixed(2) +
              ' L' + x2.toFixed(2) + ' ' + y2.toFixed(2);
      [[3.4, 0.24], [cfg.core, 1]].forEach(function (w) {
        var p = document.createElementNS(NS, 'path');
        p.setAttribute('d', d);
        p.setAttribute('fill', 'none');
        p.setAttribute('stroke', 'url(#' + id + ')');
        p.setAttribute('stroke-width', w[0]);
        p.setAttribute('stroke-linecap', 'round');
        p.setAttribute('pathLength', '1');
        if (w[1] !== 1) p.setAttribute('opacity', w[1]);
        g.appendChild(p);
      });
      svg.appendChild(g);

      arms.push({
        el: g, from: pair[0], to: pair[1],
        drawn: len - gA - gB,
        endpoints: [+x1.toFixed(2), +y1.toFixed(2), +x2.toFixed(2), +y2.toFixed(2)],
        len: +len.toFixed(2), trim: [+gA.toFixed(2), +gB.toFixed(2)],
        tier: t, peakA: +pA.toFixed(3), peakB: +pB.toFixed(3)
      });
    });

    /* ── SPEC § 4 — the tether ───────────────────────────────────────────
       Negative y is intentional: it starts ABOVE the band, under the word
       "space" in the sentence, and the svg is overflow:visible. It fades to
       nothing at BOTH ends — a whisper, not a pointer. */
    /* THE WHISPER, RE-AIMED (ruled).
       opts.tetherX re-anchors the launch to where the word "space" actually
       renders. The spec's constant assumed the theme star sits directly under
       that word (§ 2); in the shipped hero the star is at 39.7% of the window
       and the word at 65.1%, so honouring the launch AND the spec's endpoint
       would stretch this from a 16-unit breath into a 162-unit leader — a
       pointer, which § 4 says it must never be.
       So the launch moves and the SCALE is the spec's: the tether travels the
       spec's own horizontal run, leaning toward the figure, and fades out.
       It never reached the star visually anyway — it fades to nothing at both
       ends. The lab passes no tetherX and still renders the spec verbatim. */
    var th = cfg.tether;
    if (opts.tetherX != null) {
      var run = Math.abs(cfg.tether[0] - cfg.tether[2]);
      var dir = cfg.stars.space[0] >= opts.tetherX ? 1 : -1;   /* lean inward */
      th = [opts.tetherX, th[1], opts.tetherX + dir * run, th[3]];
    }
    var tid = 'wkct' + uid;
    var tg = document.createElementNS(NS, 'linearGradient');
    tg.setAttribute('id', tid);
    tg.setAttribute('gradientUnits', 'userSpaceOnUse');
    tg.setAttribute('x1', th[0]); tg.setAttribute('y1', th[1]);
    tg.setAttribute('x2', th[2]); tg.setAttribute('y2', th[3]);
    [['0%', 'rgba(232,175,56,0)'], ['44%', 'rgba(232,175,56,0.28)'],
     ['82%', 'rgba(232,175,56,0.12)'], ['100%', 'rgba(232,175,56,0)']
    ].forEach(function (st) {
      var s = document.createElementNS(NS, 'stop');
      s.setAttribute('offset', st[0]);
      s.setAttribute('stop-color', st[1]);
      tg.appendChild(s);
    });
    defs.appendChild(tg);

    /* The tether is already dashed ("0.8 4.6"), so its dasharray is spoken
       for and cannot also carry the draw. It is revealed instead by a clip
       rect scaling on Y from the sentence end down — a transform, and it
       draws in the one direction that means anything here: downward, out of
       the word and into the band. */
    var clipId = 'wkcc' + uid;
    var clip = document.createElementNS(NS, 'clipPath');
    clip.setAttribute('id', clipId);
    clip.setAttribute('clipPathUnits', 'userSpaceOnUse');
    var crect = document.createElementNS(NS, 'rect');
    var ty0 = Math.min(th[1], th[3]), ty1 = Math.max(th[1], th[3]);
    crect.setAttribute('x', Math.min(th[0], th[2]) - 4);
    crect.setAttribute('y', ty0);
    crect.setAttribute('width', Math.abs(th[2] - th[0]) + 8);
    crect.setAttribute('height', ty1 - ty0);
    crect.setAttribute('class', 'wkc-tether-clip');
    crect.style.transformOrigin = Math.min(th[0], th[2]) + 'px ' + ty0 + 'px';
    clip.appendChild(crect);
    defs.appendChild(clip);

    var tp = document.createElementNS(NS, 'path');
    tp.setAttribute('d', 'M' + th[0] + ' ' + th[1] + ' L' + th[2] + ' ' + th[3]);
    tp.setAttribute('fill', 'none');
    tp.setAttribute('stroke', 'url(#' + tid + ')');
    tp.setAttribute('stroke-width', '0.5');
    tp.setAttribute('stroke-dasharray', '0.8 4.6');
    tp.setAttribute('stroke-linecap', 'round');
    var tgrp = document.createElementNS(NS, 'g');
    tgrp.setAttribute('class', 'wkc-tether');
    tgrp.setAttribute('clip-path', 'url(#' + clipId + ')');
    tgrp.appendChild(tp);
    svg.appendChild(tgrp);
    band.appendChild(svg);

    /* ── SPEC § 2 — the seven points ─────────────────────────────────────
       Stars are DOM, positioned in PERCENT of the band, painted ON TOP of
       the svg. Faint stars get a proportionally WIDER, softer halo — that is
       what pushes them back in depth. Do not equalise it. */
    var starEls = {};
    ORDER.forEach(function (k, i) {
      var s = S[k], x = s[0], y = s[1], r = s[2], b = s[3];
      var origin = (k === 'space');
      var c = hueOf(k);
      var halo = origin ? SAFFRON : mix(SAFFRON, HUE[k], 0.55);
      var amp = origin ? 0.35 : Math.min(1, 0.4 + (1 - b) * 0.9);
      var dim = (1 - 0.22 * amp).toFixed(3);

      var star = document.createElement('i');
      star.className = 'wkc-star';
      star.setAttribute('data-star', k);
      star.style.left = (x / W * 100).toFixed(3) + '%';
      star.style.top = (y / H * 100).toFixed(3) + '%';
      star.style.width = (r * 2) + 'px';
      star.style.height = (r * 2) + 'px';
      star.style.marginLeft = (-r) + 'px';
      star.style.marginTop = (-r) + 'px';
      star.style.setProperty('--dim', dim);
      /* spec § 6: period = 5.4 + i * 1.37, delay = i * 0.83 */
      star.style.setProperty('--period', (5.4 + i * 1.37).toFixed(2) + 's');
      star.style.setProperty('--delay', (i * 0.83).toFixed(2) + 's');

      var ign = document.createElement('i');
      ign.className = 'wkc-ign';

      var haloEl = document.createElement('i');
      haloEl.className = 'wkc-halo';
      var coreEl = document.createElement('i');
      coreEl.className = 'wkc-core';

      if (origin) {
        /* THEME STAR — the only saffron point and the only 4-layer bloom. */
        coreEl.style.background = rgba(mix(CHALK, SAFFRON, 0.85), 1);   /* #F4CE7A */
        coreEl.style.boxShadow = '0 0 ' + (r * 2.2).toFixed(1) + 'px ' +
          rgba(mix(CHALK, SAFFRON, 0.5), 0.95);                          /* #F7DFAB */
        haloEl.style.boxShadow =
          '0 0 ' + (r * 5.5).toFixed(1) + 'px rgba(232,175,56,0.7), ' +
          '0 0 ' + (r * 13).toFixed(1) + 'px rgba(232,175,56,0.32), ' +
          '0 0 ' + (r * 26).toFixed(1) + 'px rgba(232,175,56,0.14)';
      } else {
        coreEl.style.background = rgba(c, 0.44 + 0.56 * b);
        coreEl.style.boxShadow = '0 0 ' + (r * (1.5 + (1 - b) * 2.2)).toFixed(1) +
          'px ' + rgba(c, 0.18 + 0.52 * b);
        haloEl.style.boxShadow = '0 0 ' + (r * (5 + (1 - b) * 4)).toFixed(1) +
          'px ' + rgba(halo, 0.05 + 0.2 * b);
      }

      ign.appendChild(haloEl);
      ign.appendChild(coreEl);
      star.appendChild(ign);
      band.appendChild(star);
      starEls[k] = star;
    });

    /* ── SPEC § 5 — the labels ───────────────────────────────────────────
       Quieter than the stars they name. The theme star has NO label; the
       word "space" in the sentence is its label. */
    var labelEls = {};
    ORDER.forEach(function (k) {
      if (k === 'space') return;
      var s = S[k], b = s[3];
      var lab = document.createElement('i');
      lab.className = 'wkc-label';
      lab.setAttribute('data-label', k);
      lab.textContent = k;
      lab.style.left = ((s[0] + s[4]) / W * 100).toFixed(3) + '%';
      lab.style.top = ((s[1] + s[5]) / H * 100).toFixed(3) + '%';
      lab.style.setProperty('--anchor', ANCHOR[s[6]]);
      lab.style.fontSize = (T.labelA + T.labelB * b).toFixed(2) + 'px';
      lab.style.color = rgba(mix(CHALK, HUE[k], 0.16), T.alphaA + T.alphaB * b);
      band.appendChild(lab);
      labelEls[k] = lab;
    });

    /* ─────────────────────── the beat's schedule ────────────────────── */
    var armByKey = {};
    arms.forEach(function (a) { armByKey[a.from + '>' + a.to] = a; });

    var sorted = arms.map(function (a) { return a.drawn; }).sort(function (x, y) { return x - y; });
    var travelRef = sorted[(sorted.length - 1) >> 1];        /* median drawn arm */
    var travel = function (a) {
      return BEAT.travelBase * Math.pow(a.drawn / travelRef, BEAT.travelExp);
    };

    var igniteAt = { space: 0 };
    var schedule = { origin: { at: 0, dur: BEAT.originIgnite }, arms: [], labels: [] };

    /* Two passes over EDGES: hop 1 first, then hop 2, so a hop-2 arm always
       sees its source star's ignition time already resolved. */
    [1, 2].forEach(function (hop) {
      EDGES.forEach(function (pair) {
        if (HOP[pair[1]] !== hop) return;
        var a = armByKey[pair[0] + '>' + pair[1]];
        var srcIgn = igniteAt[pair[0]];
        var srcDur = pair[0] === 'space' ? BEAT.originIgnite : BEAT.ignite;
        var start = pair[0] === 'space'
          ? BEAT.originLead
          : srcIgn + srcDur * BEAT.departAt;
        var dur = travel(a);
        var land = start + dur;
        a.startAt = start; a.dur = dur;
        schedule.arms.push({ arm: pair[0] + ' → ' + pair[1], drawn: +a.drawn.toFixed(1),
                             start: Math.round(start), dur: Math.round(dur),
                             land: Math.round(land) });
        /* First light to arrive lights the star; a second arm reinforces. */
        if (igniteAt[pair[1]] == null || land < igniteAt[pair[1]]) {
          igniteAt[pair[1]] = land;
        }
      });
    });

    var lastLabel = 0;
    ORDER.forEach(function (k) {
      if (k === 'space') return;
      var at = igniteAt[k] + BEAT.labelLag;
      labelEls[k].style.setProperty('--at', at + 'ms');
      lastLabel = Math.max(lastLabel, at);
      schedule.labels.push({ label: k, start: Math.round(at), dur: BEAT.labelIn });
    });

    ORDER.forEach(function (k) {
      var st = starEls[k];
      st.style.setProperty('--at', Math.round(igniteAt[k]) + 'ms');
      st.style.setProperty('--dur',
        (k === 'space' ? BEAT.originIgnite : BEAT.ignite) + 'ms');
    });
    arms.forEach(function (a) {
      a.el.style.setProperty('--at', Math.round(a.startAt) + 'ms');
      a.el.style.setProperty('--dur', Math.round(a.dur) + 'ms');
    });

    var tetherAt = lastLabel + BEAT.tetherLag;
    [tgrp, crect].forEach(function (el) {
      el.style.setProperty('--at', Math.round(tetherAt) + 'ms');
      el.style.setProperty('--dur', BEAT.tetherIn + 'ms');
    });
    schedule.tether = { start: Math.round(tetherAt), dur: BEAT.tetherIn };
    schedule.total = Math.round(tetherAt + BEAT.tetherIn);
    schedule.ignite = igniteAt;
    schedule.armGeometry = arms.map(function (a) {
      return { arm: a.from + ' → ' + a.to, len: a.len, trim: a.trim,
               tier: a.tier, peakA: a.peakA, peakB: a.peakB,
               endpoints: a.endpoints };
    });

    /* Reduced motion: the completed figure, statically, at full magnitude.
       No arrival, no scintillation, no timers.
       opts.settled: no class at all, so every element falls to its base rule —
       the finished figure, scintillating. Used when the figure is rebuilt
       after the beat has already played (a breakpoint change), so a rebuild
       can never resurrect a latched beat. */
    if (reduced) band.classList.add('wkc-static');
    else if (!opts.settled) band.classList.add('wkc-armed');

    var latched = !!opts.settled, settleTimer = null;
    function play() {
      if (latched || reduced) return;
      latched = true;                      /* latch before the first frame */
      band.classList.remove('wkc-armed');
      band.classList.add('wkc-running');
      /* STILLNESS. On settle the beat's class comes off and every element
         falls to its base rule, which IS the finished figure — so nothing is
         left holding a fill-mode, a will-change layer, or a timer. Only
         scintillation continues, because it lives on a different element. */
      settleTimer = setTimeout(function () {
        settleTimer = null;
        band.classList.remove('wkc-running');
      }, schedule.total + 80);
    }
    function reset() {                     /* lab only; never called in prod */
      if (settleTimer) { clearTimeout(settleTimer); settleTimer = null; }
      latched = false;
      band.classList.remove('wkc-running');
      band.classList.add('wkc-armed');
      void band.offsetWidth;               /* reflow, so the beat can replay */
    }

    return { band: band, schedule: schedule, play: play, reset: reset,
             reduced: reduced };
  }

  /* Latched IntersectionObserver at 0.5, matching the hero's existing beat
     pattern (js/hero-window.js). Never re-runs: not on hover, not on focus,
     not on idle, not on re-entry. */
  function observe(target, handle, threshold) {
    if (handle.reduced) return;
    if (!('IntersectionObserver' in global)) { handle.play(); return; }
    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) { io.disconnect(); handle.play(); return; }
      }
    }, { threshold: threshold == null ? 0.5 : threshold });
    io.observe(target);
  }

  global.WizkooConstellation = {
    SPEC: SPEC, EDGES: EDGES, HOP: HOP, ORDER: ORDER, BEAT: BEAT,
    build: build, observe: observe,
    _internal: { mix: mix, rgba: rgba, hueOf: hueOf, tierOf: tierOf,
                 CHALK: CHALK, SAFFRON: SAFFRON, HUE: HUE }
  };
})(window);
