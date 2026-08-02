/**
 * THE ORBITAL SKY: the certified field re-derived for the orbital aperture.
 *
 * PORTED from js/lab-orbital-sky.js at the close of the orbital lab. The FIELD
 * below is the certified one, unchanged — only the host selector moved, from the
 * lab's [data-lab-sky] to the homepage section's [data-orb-sky]. The aperture it
 * was derived for IS the linen-hero band, so nothing about the derivation needed
 * to move with it.
 *
 * WHAT THIS IS
 *   Not a second sky. It is js/hero-sky.js — the certified generation code —
 *   driven at a different FIELD, exactly the way the hero window re-tuned the
 *   primitive for its own aperture. css/hero-sky.css is untouched, so star
 *   rendering, the twinkle curve, nebula breath, the shooter and the designed
 *   reduced-motion frozen frame are all still the product's own.
 *
 *   Only the COUNTS move, and they move because the area moved.
 *
 * THE APERTURE
 *   The orbital section is the full-bleed linen-hero band: 1440 wide by
 *   (100dvh + 96px) tall. Ruled reference frame 1440x996 (a 900px viewport),
 *   1,434,240px2 — 6.15x the hero window's 233,120px2.
 *
 * THE DERIVATION
 *   /start carries 1.278 stars per 1000px2 of starred field (measured out of the
 *   product at a62dc1d by scripts/sky-tuning-report.js, not remembered here).
 *   1,434,240px2 at that density is 1,833 stars. Every population is scaled by
 *   the 6.152 area ratio EXCEPT anchors, which are ruled by eye rather than by
 *   area — see below — with the shortfall absorbed into mids so the perceived
 *   density still lands on the product's number.
 *
 * WHAT WAS RULED RATHER THAN SCALED
 *   ANCHORS   4 in the hero window scales to 25. Twenty-five haloed, cross-glowed
 *             stars would compete with six gold nodes for the same reading, and
 *             the section's subject is the nucleus, not the field. Ruled at 12:
 *             enough that bright stars read AS stars across a canvas this wide,
 *             few enough that nothing in the sky out-argues the system on it.
 *             The 13 stars that cut leaves go back into mids, so density holds.
 *   FILIGREE  buildFiligree returns one cluster regardless of cfg.clusters, and
 *             its zone is fixed lower-left. Left at one. It is texture, not
 *             structure, and one is what the primitive gives.
 *   MILKY WAY Dust scaled with area (80 -> 480). It is weather; weather scales.
 *   NEBULAE   1 -> 4. Percentage-sized, so they hold their share of the frame.
 *
 * WHAT DID NOT MOVE
 *   The shooter stays one, on the ruled 60-120s random period. A second shooter
 *   on a canvas this size would start to read as a rate.
 */
(function () {
  'use strict';

  var APERTURE = { w: 1440, h: 996 };          /* the ruled lab frame, reference px */

  var LAB_FIELD = {
    far:  { faints: 541, dust: 480, clusterCount: 10, clusterShare: 0.55, twinkleScale: 0.55 },
    near: { anchors: 12, brights: 98, mids: 490, faints: 200, clusterCount: 8, clusterShare: 0.5, twinkleScale: 1 },
    filigree: { clusters: 1, starsMin: 11, starsMax: 14, maxDegree: 3, dropShare: 0.3, spread: 6.5, webOpacity: 0.05 },
    nebulaCount: 4,
    shooter: { count: 1, periodMinS: 60, periodMaxS: 120 },
    milkyDust: 480,
    atmosphere: { colorDrift: 60, nebulosity: 64, airglow: 56, milkyWay: 21, wisps: 32 }
  };

  var SEED = 20260801;

  /* Drive the certified generator at the lab FIELD, then hand it back exactly as
     it was. Nothing else on a page ever sees the swap. */
  function withLabField(sky, fn) {
    var saved = JSON.parse(JSON.stringify(sky.FIELD));
    var k;
    for (k in LAB_FIELD) sky.FIELD[k] = LAB_FIELD[k];
    try { return fn(); }
    finally { for (k in saved) sky.FIELD[k] = saved[k]; }
  }

  function buildLabSky(sky, seed) {
    return withLabField(sky, function () { return sky.buildSky(seed == null ? SEED : seed); });
  }

  function renderLabSky(sky, host, seed) {
    return withLabField(sky, function () { return sky.renderSky(host, seed == null ? SEED : seed); });
  }

  var api = {
    APERTURE: APERTURE,
    LAB_FIELD: LAB_FIELD,
    SEED: SEED,
    buildLabSky: buildLabSky,
    renderLabSky: renderLabSky
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') {
    /* WizkooLabSky is kept as an alias so the lab's own report scripts keep
       running against the ported page without being rewritten. */
    window.WizkooOrbitalSky = api;
    window.WizkooLabSky = api;
    var mount = function () {
      var host = document.querySelector('[data-orb-sky]');
      if (!host || host.dataset.orbSkyMounted || !window.WizkooSky) return;
      host.dataset.orbSkyMounted = '1';
      var r = renderLabSky(window.WizkooSky, host, Number(host.dataset.orbSkySeed) || SEED);
      host.dataset.orbSkyStars = String(r.stars);
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
    else mount();
  }
})();
