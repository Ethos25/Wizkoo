/**
 * THE LIVING WINDOW — the demonstration
 * Hero fragment component. One component, one stylesheet (css/hero-window.css).
 *
 * WHAT IT DOES
 *   The theme ghost in the chalk sentence cycles once, on first sight:
 *     dinosaurs -> volcanoes -> doughnuts -> settles on "their thing"
 *   and is then still forever.
 *
 * TIMING FAMILY (per word)
 *   rise-in 280ms / hold 620ms / yield 240ms
 *
 * THE LAWS THIS FILE ENFORCES
 *   1. ONCE PER SIGHT. IntersectionObserver-gated, so it plays on arrival
 *      before her eyes, not on mount. A page loaded scrolled past the hero
 *      does not burn the demonstration.
 *   2. LATCHED. A single boolean, set before the first frame runs. The
 *      observer disconnects on play. Nothing re-triggers it: not hover,
 *      not focus, not idle, not resize, not scrolling back.
 *   3. SETTLED, NOT LOOPING. The sequence ends on "their thing" and stops.
 *      There is no interval, no requestAnimationFrame loop, no timer left
 *      running. Casino test: nothing here begs for attention twice.
 *   4. REDUCED MOTION. Static settled state, no cycle, no timers created.
 *
 * The settled word is also what ships in the markup, so with JS disabled
 * the sentence reads correctly and the window is still a working door.
 */
(function () {
  'use strict';

  var win   = document.querySelector('.lw');
  var theme = document.querySelector('.lw-theme');
  if (!win || !theme) return;

  var CHIPS  = ['dinosaurs', 'volcanoes', 'doughnuts'];
  var SETTLE = 'their thing';
  var RISE = 280, HOLD = 620, YIELD = 240;

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  if (reduced) { theme.textContent = SETTLE; return; }

  var latched = false;

  function yieldOut(done) {
    theme.classList.remove('lw-in');
    theme.classList.add('lw-out');
    setTimeout(done, YIELD);
  }

  function riseIn(word, done) {
    theme.textContent = word;
    theme.classList.remove('lw-out', 'lw-in');
    theme.classList.add('lw-pre');
    void theme.offsetWidth;                 /* commit the pre-state before transitioning */
    theme.classList.remove('lw-pre');
    theme.classList.add('lw-in');
    setTimeout(done, RISE);
  }

  function run() {
    var i = 0;
    (function next() {
      if (i === CHIPS.length) {
        yieldOut(function () {
          riseIn(SETTLE, function () {
            theme.classList.remove('lw-in');  /* settled. no classes, no timers, still. */
          });
        });
        return;
      }
      var word = CHIPS[i++];
      yieldOut(function () {
        riseIn(word, function () { setTimeout(next, HOLD); });
      });
    })();
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
  }, { threshold: 0.55 });

  io.observe(win);
})();
