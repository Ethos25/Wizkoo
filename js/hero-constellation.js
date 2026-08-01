/**
 * THE CONSTELLATION IN THE HERO WINDOW
 *
 * Wires js/constellation.js into the shipped window's reserved band. The
 * figure itself is untouched here — this file only decides which of the two
 * spec configurations applies, where the tether launches from, and when the
 * beat is allowed to fire.
 *
 * THE TETHER'S LAUNCH POINT IS MEASURED, NOT SPECIFIED (ruled).
 *   Spec § 4 puts 7A's tether at band x=216, which is 41.94% of the window
 *   width. That coordinate was drawn against a sentence that wraps differently:
 *   the shipped sentence carries a hard <br> after "in", so "space" is the last
 *   word of line 2 and sits at 65.14%. The spec's INTENT is that the tether
 *   descends out of the word; the constant is just that intent expressed in a
 *   frame that no longer applies. So the launch x is read off .lw-theme at run
 *   time and the rest of the tether — the dash, the width, the four-stop
 *   gradient fading to nothing at BOTH ends — is the spec's, unchanged.
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
  var BIAS = 0.10;                 /* log-space handicap applied to 7A */
  var HYST = 0.05;                 /* extra handicap to leave a state */

  var mq = window.matchMedia('(max-width:767px)');   /* chrome branch only */
  var handle = null, played = false, sizeKey = null, raf = 0;

  /* The largest box of ratio `ar` that fits in avail. Contain, never cover. */
  function contain(availW, availH, ar) {
    var w = Math.min(availW, availH * ar);
    return [w, w / ar];
  }

  function pickSize(availW, availH) {
    if (!availW || !availH) return mq.matches ? 'mobile' : 'desktop';
    var score = {};
    ['desktop', 'mobile'].forEach(function (k) {
      var ref = REF[k];
      var box = contain(availW, availH, ref[0] / ref[1]);
      score[k] = Math.abs(Math.log(box[0] / ref[0]));
    });
    score.desktop += BIAS;
    if (sizeKey === 'mobile') score.desktop += HYST;
    if (sizeKey === 'desktop') score.mobile += HYST;
    return score.desktop <= score.mobile ? 'desktop' : 'mobile';
  }

  /* The reserved box: from the band's top down to the handle rule, less a
     margin. Measured rather than declared, because the foot's height mixes
     percentages with --u and no single percentage survives every window
     shape. */
  function reserve() {
    var W = win.getBoundingClientRect();
    var F = document.querySelector('.lw-foot').getBoundingClientRect();
    band.style.height = '';
    var top = band.getBoundingClientRect().top;
    var h = Math.max(0, F.top - top - W.height * 0.0177);
    band.style.height = h + 'px';
    return [band.clientWidth, h];
  }

  /* The launch x, in the FIGURE's own user-space units. Measured against the
     figure, not the band: the two differ whenever height binds and the figure
     is narrower than the space it sits in. */
  function tetherX(cfg) {
    var B = fig.getBoundingClientRect();
    var T = theme.getBoundingClientRect();
    if (!B.width) return cfg.tether[0];
    var centre = T.left + T.width / 2 - B.left;      /* px from the figure's left */
    return centre / B.width * cfg.band.w;            /* -> band user units */
  }

  function build() {
    var avail = reserve();
    var key = pickSize(avail[0], avail[1]);
    var cfg = C.SPEC[key];
    var box = contain(avail[0], avail[1], cfg.band.w / cfg.band.h);

    fig.textContent = '';
    fig.className = 'lw-figure';
    fig.style.width = box[0] + 'px';
    fig.style.height = box[1] + 'px';
    band.setAttribute('data-size', key);
    sizeKey = key;
    handle = C.build(fig, cfg, { uid: 'h', tetherX: tetherX(cfg), settled: played });
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
