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
  var theme = document.querySelector('.lw-theme');
  if (!C || !win || !band || !theme) return;

  var MOBILE = '(max-width:767px)';
  var mq = window.matchMedia(MOBILE);
  var handle = null, played = false, sizeKey = null, raf = 0;

  /* The launch x, in the band's own user-space units. */
  function tetherX(cfg) {
    var W = win.getBoundingClientRect();
    var B = band.getBoundingClientRect();
    var T = theme.getBoundingClientRect();
    if (!B.width) return cfg.tether[0];
    var centre = T.left + T.width / 2 - B.left;      /* px from the band's left */
    return centre / B.width * cfg.band.w;            /* -> band user units */
  }

  function build() {
    var key = mq.matches ? 'mobile' : 'desktop';
    var cfg = C.SPEC[key];
    band.textContent = '';
    band.className = 'lw-band';
    handle = C.build(band, cfg, { uid: 'h', tetherX: tetherX(cfg), settled: played });
    sizeKey = key;
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
      if (handle && !handle.reduced && band.classList.contains('wkc-running')) return;
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
