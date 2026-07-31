/**
 * THE DEMONSTRATION BEAT: the theme word's arrival
 *
 * WHAT IT DOES
 *   Once, on first sight, the theme word performs its ghost-to-gold arrival
 *   into "space": it yields from the certified ghost register and rises back in
 *   at full saffron. Then it is still forever.
 *
 * TIMING AND EASING
 *   Verbatim from the product's sentence canvas (start.css @ HEAD):
 *     yield   240ms  .cl-ghost--leaving  (opacity, -0.18em, blur 2px)
 *     hold    620ms  the timing family's beat between the two halves
 *     arrival 280ms  .cl-demo-in         (opacity, +0.22em -> 0, blur 2px -> 0)
 *   Easing is --ease-editorial: cubic-bezier(0.16, 1, 0.3, 1).
 *
 * THE LAWS THIS FILE ENFORCES
 *   1. ONCE PER SIGHT. IntersectionObserver at threshold 0.5, so the beat plays
 *      when the window arrives before her eyes, not on mount.
 *   2. LATCHED. A boolean set before the first frame; the observer disconnects
 *      on play. Nothing re-triggers it: not hover, not focus, not resize, not
 *      scrolling back.
 *   3. SETTLED, NOT LOOPING. It ends on full saffron and stops. No interval, no
 *      rAF loop, no timer left running.
 *   4. REDUCED MOTION. The settled state, no beat, no timers created.
 *
 * The settled state is what ships in the markup, so with JS disabled or motion
 * reduced the sentence reads correctly and the window is still a working door.
 */
(function () {
  'use strict';

  var win = document.querySelector('.lw');
  var theme = document.querySelector('.lw-theme');
  if (!win || !theme) return;

  var YIELD = 240, HOLD = 620, ARRIVE = 280;

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  if (reduced) return;                       /* markup is already the settled state */

  var latched = false;

  function run() {
    /* Start from the ghost register, the state the arrival resolves. */
    theme.classList.add('lw-ghosted');
    setTimeout(function () {
      theme.classList.add('lw-leaving');
      setTimeout(function () {
        theme.classList.remove('lw-ghosted', 'lw-leaving');
        theme.classList.add('lw-arriving');
        setTimeout(function () {
          theme.classList.remove('lw-arriving');   /* settled. no classes, no timers. */
        }, ARRIVE);
      }, YIELD);
    }, HOLD);
  }

  function play() {
    if (latched) return;
    latched = true;                          /* latch before the first frame */
    run();
  }

  if (!('IntersectionObserver' in window)) { play(); return; }

  var io = new IntersectionObserver(function (entries) {
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].isIntersecting) { io.disconnect(); play(); return; }
    }
  }, { threshold: 0.5 });

  io.observe(win);
})();
