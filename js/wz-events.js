/**
 * Wizkoo — first-party event layer
 * Excellence Round 1 (2026-07-31)
 *
 * STATUS: INSTRUMENTED, TRANSPORT DISABLED.
 * ENDPOINT is null. While null, nothing leaves the browser: events are queued
 * in memory on window.wzEvents and are readable from the console. No network
 * request is made. This is deliberate and awaits a ruling before anything is
 * wired. Setting ENDPOINT is the single switch that turns transport on.
 *
 * DESIGN CONSTRAINTS (why it is shaped this way)
 *   - First-party only. No third-party script, pixel, or SDK is loaded.
 *   - No cookies. No localStorage. No sessionStorage.
 *   - No persistent or probabilistic identifier. No user id, no device id,
 *     no fingerprint. Events are not joinable into a session or a person.
 *   - No IP handling in client code. If transport is ever enabled, the
 *     receiving function must not log or store IP.
 *   - No child data. These events fire on marketing pages only, which collect
 *     nothing about a child.
 *
 * PRIVACY-POLICY INTERACTION — READ BEFORE ENABLING
 *   privacy.html:130 currently states that Wizkoo does not collect device
 *   identifiers, IP addresses for tracking purposes, or browsing history.
 *   Enabling transport sends pathname + event name, which is browsing history
 *   at page granularity. privacy.html must be updated in the same change that
 *   sets ENDPOINT, or the policy becomes false. Flagged for ruling.
 *
 * EVENT NAMES (the contract)
 *   home_view    fired once on homepage load.
 *                props: {}
 *   cta_click    fired on click of any element carrying [data-wz-cta].
 *                props: { cta: <the data-wz-cta value> }
 *                Currently one emitter: cta="hero-sample-week".
 *
 * RESERVED FOR THE /start SIDE (not emitted here; documented so both sides
 * agree on the name before the funnel is joined)
 *   start_arrive   fired on /start page load, once /start exists.
 *                  props: { from: <referring path>, prefilled: <bool> }
 *                  Pairs with cta_click to give hero -> start arrival rate.
 */
(function () {
  'use strict';

  /* Transport off pending privacy policy update — do not enable without
     command clearance.
     null = queue only, nothing leaves the browser. */
  var ENDPOINT = null;

  var queue = (window.wzEvents = window.wzEvents || []);

  function emit(name, props) {
    var e = {
      event: name,
      path: window.location.pathname,
      ts: new Date().toISOString(),
      props: props || {}
    };
    queue.push(e);

    if (!ENDPOINT) return; /* queued only */
    try {
      var body = JSON.stringify(e);
      if (navigator.sendBeacon) {
        navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'application/json' }));
      }
    } catch (_) { /* instrumentation must never break the page */ }
  }

  window.wz = { emit: emit, events: queue };

  function ready(fn) {
    if (document.readyState !== 'loading') { fn(); }
    else { document.addEventListener('DOMContentLoaded', fn); }
  }

  ready(function () {
    emit('home_view');

    var ctas = document.querySelectorAll('[data-wz-cta]');
    for (var i = 0; i < ctas.length; i++) {
      (function (el) {
        el.addEventListener('click', function () {
          emit('cta_click', { cta: el.getAttribute('data-wz-cta') });
        });
      })(ctas[i]);
    }
  });
})();
