/**
 * THE CONSTELLATION IN THE HERO WINDOW
 *
 * Wires js/constellation.js into the shipped window's reserved band. The
 * figure itself is untouched here — this file only decides which of the two
 * spec configurations applies, where the tether launches from, and when the
 * beat is allowed to fire.
 *
 * THE TETHER CONNECTS THE WORD TO THE STAR (ruled, superseding variant D).
 *   Both ends are measured, neither is the spec's constant. The launch is the
 *   centre of .lw-theme, just under the word "space"; the terminus is the theme
 *   star itself, trimmed back by the arms' own formula (r * trim0 + trim1) so
 *   the line dissolves into the star's glow exactly the way an arm does. The
 *   treatment between the ends is the spec's — 0.5 stroke, the 0.8/4.6 dash,
 *   a gradient fading to nothing at both ends. The tether is load-bearing:
 *   it must exist and stay connected at every figure position.
 *
 * LAYOUT DEPENDENCE
 *   The measurement is only valid once the sentence has set, so the build waits
 *   on document.fonts.ready. A breakpoint change rebuilds (the two configs are
 *   different figures, not one scaled); a resize within a breakpoint re-reads
 *   the launch x, because the word moves with the frame. Neither can replay the
 *   beat: once played, every rebuild comes back settled.
 */
(function () {
  'use strict';

  var C = window.WizkooConstellation;
  var win = document.querySelector('.lw');
  var band = document.querySelector('.lw-band');
  var fig = document.querySelector('.lw-figure');
  var theme = document.querySelector('.lw-theme');
  if (!C || !win || !band || !fig || !theme) return;

  /* ── WHICH FIGURE (ruled) ────────────────────────────────────────────────
     Not a viewport-width breakpoint. 1440x396 is a WIDE viewport with a short
     window: --u is clamped by the height, the window comes out 342.86px wide,
     and a width query hands it 7A — exactly the case that failed.
     Not the band's width alone either. At a 600px viewport the band is 478
     wide but the gap is only 82 tall, and a width-only rule picks 7A and
     overflows the window.

     So: size BOTH figures into the reserved box the way they will actually be
     drawn — contained, largest box of that ratio that fits — and choose the
     one whose contained width lands nearer its OWN reference band. "Nearer" is
     measured in log space, because this is a question about scale: a band at
     1.3x of 7B and one at 0.77x of 7B are equally far from it.

         7A reference band 532 x 178      7B reference band 299 x 64

     That is the spec's own answer to small scales (§ 7a: at phone scale 7A's
     faint stars disappear), applied by scale rather than by device.

     BIAS favours 7B on a tie. The two figures do not degrade alike: 7B was
     drawn for a band it can outgrow gracefully, 7A for one it cannot shrink
     into — 7A's labels are absolute px and start colliding with the sentence
     above and the rule below once its band drops under about 0.8x. When the
     call is close, the figure that fails softly should win it.

     HYST guards the boundary so a drag-resize across it cannot flicker. */
  var REF = { desktop: [532, 178], mobile: [299, 64] };
  var BIAS = 0.15;                 /* log-space handicap applied to 7A. Raised from
                                      0.10 when the figure became height-driven:
                                      that enlarged both candidates and moved the
                                      crossover, flipping 1280x720 to 7A at 0.78x
                                      where its labels start touching. */
  var HYST = 0.05;                 /* extra handicap to leave a state */

  var mq = window.matchMedia('(max-width:767px)');   /* chrome branch only */
  var handle = null, played = false, sizeKey = null, raf = 0;

  /* ── THE FIGURE IS SIZED BY THE BAND'S HEIGHT, NOT ITS WIDTH (ruled) ─────
     It used to be contained inside the type's own column, which capped it at
     the width the sentence happens to occupy. That left the band's height
     unused at every desktop size and held the figure ~8% under its reference.

     It now fills the height and takes whatever width its ratio needs, growing
     PAST the type's inset and centring on the window. MIN_INSET is the floor:
     the figure may reach 5.5% of the window's width from either edge and no
     further, which is what keeps it inside the window's own border and stops
     a short-and-wide band from producing an absurd figure. Below that floor
     width binds again and the old behaviour resumes. */
  var MIN_INSET = 0.055;

  /* ── THE FIGURE IS DROPPED TO OPTICAL CENTRE (ruled) ─────────────────────
     Anchored to the band's top, the figure's bright mass — the theme star and
     the hop-1 stars all sit in the figure's upper half — crowded up under the
     sentence while the faint lower labels left a band of empty sky above the
     handle rule. The figure now gives up SHIFT_Q of the reserved gap as air
     above itself and refits into the remainder, so the luminous mass sits in
     the middle of the space between the sentence and the rule and nothing is
     pushed into the rule below. A fraction, not a px, so it is one position at
     every window size. __wkcFigShift is the render harness's override. */
  var SHIFT_Q = (typeof window.__wkcFigShift === 'number') ? window.__wkcFigShift : 0.12;

  function fit(availH, winW, ar) {
    var w = Math.min(availH * ar, winW * (1 - 2 * MIN_INSET));
    return [w, w / ar];
  }

  function pickSize(winW, availH) {
    if (!winW || !availH) return mq.matches ? 'mobile' : 'desktop';
    var score = {};
    ['desktop', 'mobile'].forEach(function (k) {
      var ref = REF[k];
      var box = fit(availH, winW, ref[0] / ref[1]);
      score[k] = Math.abs(Math.log(box[0] / ref[0]));
    });
    score.desktop += BIAS;
    if (sizeKey === 'mobile') score.desktop += HYST;
    if (sizeKey === 'desktop') score.mobile += HYST;
    return score.desktop <= score.mobile ? 'desktop' : 'mobile';
  }

  /* The reserved box: from the band's top down to the handle rule, less a
     margin. Measured rather than declared, because the foot's height mixes
     percentages with --u and no single percentage survives every window shape.

     The margin is 0.8% of the window, not 1.77%. It guards ONE thing — Writing's
     label, the only element that reaches the bottom of the figure's coordinate
     space (it is anchored `b` and hangs below the spec's stated y159). The old
     value was set before that was understood and was reserving room the figure
     had no way to use; every pixel of it was height the figure could have been.
     Verified across the matrix: Writing clears the rule at every viewport. */
  function reserve() {
    var W = win.getBoundingClientRect();
    var F = document.querySelector('.lw-foot').getBoundingClientRect();
    band.style.height = '';
    var top = band.getBoundingClientRect().top;
    var h = Math.max(0, F.top - top - W.height * 0.008);
    band.style.height = h + 'px';
    return [W.width, h];
  }

  /* Both tether endpoints, in the FIGURE's own user-space units. Measured
     against the figure, not the band: the two differ whenever height binds and
     the figure is narrower than the space it sits in. The launch sits 2 units
     under the word; negative y is fine, the svg overflows upward by design.
     The terminus is the theme star trimmed by the arms' own gap formula. */
  function tetherEnds(cfg) {
    var B = fig.getBoundingClientRect();
    var T = theme.getBoundingClientRect();
    if (!B.width) return null;
    var s = B.width / cfg.band.w;                    /* px per band unit */
    var x1 = (T.left + T.width / 2 - B.left) / s;
    var y1 = (T.bottom - B.top) / s + 2;
    var sp = cfg.stars.space;
    var gap = sp[2] * cfg.trim[0] + cfg.trim[1];     /* dissolve into the glow */
    var dx = sp[0] - x1, dy = sp[1] - y1;
    var len = Math.hypot(dx, dy) || 1;
    return [x1, y1, sp[0] - dx / len * gap, sp[1] - dy / len * gap];
  }

  function build() {
    var avail = reserve();                       /* [window width, band height] */
    /* The variant is chosen from the FULL gap, before the drop is taken out,
       so a placement decision can never flip which figure ships. */
    var key = pickSize(avail[0], avail[1]);
    var cfg = C.SPEC[key];
    var shift = avail[1] * SHIFT_Q;
    var box = fit(avail[1] - shift, avail[0], cfg.band.w / cfg.band.h);

    fig.textContent = '';
    fig.className = 'lw-figure';
    fig.style.width = box[0] + 'px';
    fig.style.height = box[1] + 'px';
    fig.style.marginTop = shift + 'px';
    band.setAttribute('data-size', key);
    sizeKey = key;
    handle = C.build(fig, cfg, { uid: 'h', tether: tetherEnds(cfg), settled: played });
    if (!played && !handle.reduced) {
      C.observe(win, {
        reduced: handle.reduced,
        play: function () { played = true; handle.play(); }
      }, 0.5);
    }
    window.__wkcHero = handle;                        /* verification harness */
  }

  function onResize() {
    if (raf) return;
    raf = requestAnimationFrame(function () {
      raf = 0;
      /* A breakpoint change is a different figure. Anything else only moves
         the word, so rebuilding is the cheap, correct way to re-aim the
         tether — the figure is seven divs and one svg. */
      if (handle && !handle.reduced && fig.classList.contains("wkc-running")) return;
      build();
    });
  }

  function start() {
    build();
    window.addEventListener('resize', onResize);
    if (mq.addEventListener) mq.addEventListener('change', onResize);
    else if (mq.addListener) mq.addListener(onResize);
  }

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(start);
  else window.addEventListener('load', start);
})();
