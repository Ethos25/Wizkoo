/* ── Wizkoo Navigation ── */
(function () {
  'use strict';

  const hamburger = document.querySelector('.hamburger');
  const overlay   = document.querySelector('.mobile-overlay');
  const closeBtn  = document.querySelector('.mobile-close');

  if (!hamburger || !overlay) return;

  function openMenu() {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  // Close on overlay link click
  overlay.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  // Mark active nav link
  var path = window.location.pathname;
  document.querySelectorAll('.nav-link').forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href) return;
    var linkPath = href.split('#')[0].replace(/\/$/, '') || '/';
    var currentPath = path.replace(/\/$/, '') || '/';
    if (linkPath === currentPath || (linkPath !== '/' && currentPath.startsWith(linkPath))) {
      link.classList.add('active');
    }
  });
})();

// Nav scroll shadow
(function () {
  const nav = document.querySelector('nav');
  if (!nav) return;
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
})();

// ═══ WORDMARK SOUND + GIGGLE ═══
(function () {
  var audioCtx;
  document.addEventListener('click', function () {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
  });

  function playGiggle() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    var now = audioCtx.currentTime;
    var o1 = audioCtx.createOscillator(), g1 = audioCtx.createGain();
    o1.type = 'sine'; o1.connect(g1); g1.connect(audioCtx.destination);
    o1.frequency.setValueAtTime(880, now);
    o1.frequency.exponentialRampToValueAtTime(1100, now + 0.04);
    o1.frequency.exponentialRampToValueAtTime(660, now + 0.08);
    g1.gain.setValueAtTime(0.04, now);
    g1.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    o1.start(now); o1.stop(now + 0.1);
    var o2 = audioCtx.createOscillator(), g2 = audioCtx.createGain();
    o2.type = 'sine'; o2.connect(g2); g2.connect(audioCtx.destination);
    o2.frequency.setValueAtTime(990, now + 0.1);
    o2.frequency.exponentialRampToValueAtTime(1200, now + 0.14);
    o2.frequency.exponentialRampToValueAtTime(750, now + 0.18);
    g2.gain.setValueAtTime(0.03, now + 0.1);
    g2.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    o2.start(now + 0.1); o2.stop(now + 0.2);
  }

  document.querySelectorAll('.nav-wm, .wm').forEach(function (w) {
    w.addEventListener('mouseenter', function () { setTimeout(playGiggle, 350); });
  });
})();

// ═══ CUSTOM CURSOR ═══
(function () {
  var c = document.getElementById('cursor');
  if (!c) return;
  var cx = 0, cy = 0;
  window.mx = window.mx || 0;
  window.my = window.my || 0;
  document.addEventListener('mousemove', function (e) { window.mx = e.clientX; window.my = e.clientY; c.classList.add('visible'); });
  document.addEventListener('mouseleave', function () { c.classList.remove('visible'); });
  var hoverEls = 'a,button,.ech,.ach,.pc-more,.btn-main,.btn-circle,.btn-circle-dark,.nav-cta-sm,.panel-link,.week-card,.plan-card,.sr-track,.planned-dot,.wm,.nav-wm';
  document.addEventListener('mouseover', function (e) { if (e.target.closest(hoverEls)) c.classList.add('hover'); });
  document.addEventListener('mouseout',  function (e) { if (e.target.closest(hoverEls)) c.classList.remove('hover'); });
  (function tick() { cx += (window.mx - cx) * 0.15; cy += (window.my - cy) * 0.15; c.style.left = cx + 'px'; c.style.top = cy + 'px'; requestAnimationFrame(tick); })();
})();
