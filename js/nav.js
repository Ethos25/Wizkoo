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
