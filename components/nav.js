/**
 * Wizkoo Site Nav — single source of truth
 * Injects the canonical nav into #wizkoo-nav on every marketing page.
 * Runs synchronously (no DOMContentLoaded wrapper) so the nav is in the
 * DOM immediately, matching footer.js behaviour.
 *
 * Active link is detected automatically from window.location.pathname.
 * Hamburger / mobile-menu behaviour is attached after HTML injection.
 */
(function () {
  var el = document.getElementById('wizkoo-nav');
  if (!el) return;

  /* ── Scoped styles ──────────────────────────────────────────────────── */
  if (!document.getElementById('wn-styles')) {
    var style = document.createElement('style');
    style.id = 'wn-styles';
    style.textContent = [
      /* Ensure --expo and --saffron are available if not set by the page */
      ':root{',
      '  --expo:cubic-bezier(0.16,1,0.3,1);',
      '  --saffron:#E8AF38;',
      '  --ink:#0C1020;',
      '}',

      /* Wordmark dot + animations (shared with .nav-wm) */
      '.wm-dot{display:inline-block;position:relative;margin-left:-0.08em}',
      '.wm-dot::after{content:\'\';position:absolute;top:.1em;right:-.2em;width:.22em;height:.22em;border-radius:50%;background:var(--saffron);transition:transform .3s var(--expo)}',
      '.nav-wm:hover .wm-dot::after{animation:dotReact .4s var(--expo)}',
      '@keyframes dotReact{0%{transform:scale(1)}40%{transform:scale(1.4)}100%{transform:scale(1)}}',
      '@keyframes kGiggle{',
      '  0%{transform:rotate(8deg)}',
      '  6%{transform:rotate(12deg) translateY(-1px)}',
      '  12%{transform:rotate(5deg)}',
      '  18%{transform:rotate(13deg) translateY(-1.5px)}',
      '  24%{transform:rotate(6deg) translateY(0.5px)}',
      '  30%{transform:rotate(11deg) translateY(-1px)}',
      '  36%{transform:rotate(7deg)}',
      '  42%{transform:rotate(10deg) translateY(-0.5px)}',
      '  50%{transform:rotate(8deg)}',
      '  58%{transform:rotate(10deg) translateY(-1px)}',
      '  66%{transform:rotate(7deg)}',
      '  75%{transform:rotate(9deg) translateY(-0.5px)}',
      '  85%{transform:rotate(8deg)}',
      '  100%{transform:rotate(8deg)}',
      '}',

      /* Site nav bar */
      '.site-nav{position:fixed;top:0;left:0;right:0;z-index:1000;height:72px;background:rgba(12,16,32,0.95);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);display:flex;flex-direction:row;flex-wrap:nowrap;align-items:center;justify-content:center;transform:translateY(0);pointer-events:auto}',
      '.site-nav::after{content:\'\';position:absolute;bottom:0;left:0;right:0;height:1px;filter:none;background:linear-gradient(90deg,transparent,var(--saffron),transparent);opacity:0.4}',
      '.site-nav a:not(.nav-cta-sm):not(.nav-launch),.nav-bar a:not(.nav-cta-sm):not(.nav-launch){background:transparent!important;border:none!important;box-shadow:none!important;outline:none!important}',

      /* Nav bar inner */
      '.nav-bar{width:100%;max-width:1200px;height:100%;padding:0 48px;display:flex;flex-direction:row;flex-wrap:nowrap;align-items:center;gap:40px}',

      /* Wordmark */
      '.nav-wm{font-family:\'Sora\',sans-serif;font-weight:700;font-size:24px;letter-spacing:-0.02em;color:#F0F2F8;text-decoration:none;white-space:nowrap;flex-shrink:0;display:inline-flex;align-items:baseline;line-height:1;margin-right:auto;background:transparent!important;border:none!important;box-shadow:none!important;outline:none!important}',
      '.nav-wm .k{display:inline-block;transform:rotate(8deg);transform-origin:bottom center;color:var(--saffron)}',
      '.nav-wm:hover .k{animation:kGiggle 0.8s ease-in-out}',
      '.nav-wm .i-fix{position:relative;display:inline-block}',

      /* Center links */
      '.nav-center{display:flex;flex-direction:row;flex-wrap:nowrap;align-items:center;gap:28px;flex:1;justify-content:center}',

      /* Nav links */
      '.nav-science{font-family:\'Space Mono\',monospace;font-weight:400;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(240,242,248,0.7);text-decoration:none;white-space:nowrap;position:relative;padding-bottom:2px;transition:color .25s}',
      '.nav-science::after{content:\'\';position:absolute;bottom:0;left:0;width:0;height:1px;background:var(--saffron);transition:width .3s var(--expo)}',
      '.nav-science:hover{color:rgba(240,242,248,1)}',
      '.nav-science:hover::after{width:100%}',
      '.nav-science.active{color:rgba(240,242,248,1)}',
      '.nav-science.active::after{width:100%}',

      /* CTA variants */
      '.nav-cta-sm{font-family:\'Space Mono\',monospace;font-weight:400;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;padding:8px 18px;background:var(--saffron)!important;color:var(--ink)!important;text-decoration:none!important;transition:background .3s,transform .2s;white-space:nowrap;flex-shrink:0;border-radius:2px;border:none!important;box-shadow:none!important;outline:none!important}',
      '.nav-cta-sm:hover{background:#D4A030!important;transform:translateY(-1px)}',
      '.nav-launch{font-family:\'Space Mono\',monospace;font-weight:700;font-size:9px;letter-spacing:0.14em;text-transform:uppercase;padding:7px 16px;background:var(--saffron);color:var(--ink);text-decoration:none;white-space:nowrap;flex-shrink:0;border-radius:2px;border:none;outline:none;transition:background .2s,transform .2s;display:inline-block}',
      '.nav-launch:hover{background:#D4A030;transform:translateY(-1px)}',

      /* Hamburger (mobile only) */
      '.nav-hamburger{display:none;flex-direction:column;justify-content:center;align-items:center;gap:5px;width:44px;height:44px;padding:0;background:transparent;border:none;cursor:pointer;flex-shrink:0;-webkit-tap-highlight-color:transparent}',
      '.nav-hamburger-line{display:block;width:20px;height:2px;background:rgba(240,242,248,0.8);border-radius:1px}',

      /* Mobile menu panel */
      '.nav-mobile-menu{display:none;position:fixed;top:72px;left:0;right:0;z-index:998;overflow:hidden;pointer-events:none}',
      '.nav-mobile-menu-inner{background:#F2F0EA;border-bottom:1px solid #E0DED6;transform:translateY(-100%);transition:transform 150ms ease-in;padding:8px 0;box-shadow:0 4px 12px rgba(12,16,32,0.06)}',
      '.nav-mobile-menu.open{pointer-events:auto}',
      '.nav-mobile-menu.open .nav-mobile-menu-inner{transform:translateY(0);transition:transform 200ms cubic-bezier(0.16,1,0.3,1)}',
      '.nav-mobile-menu a{display:block;font-family:\'Space Mono\',monospace;font-weight:400;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#0C1020;text-decoration:none;padding:16px 24px;background:transparent;border:none;-webkit-tap-highlight-color:transparent;outline:none}',
      '.nav-mobile-menu a:hover{color:rgba(12,16,32,0.55)}',
      '.nav-mobile-menu a:focus-visible{outline:2px solid var(--saffron);outline-offset:-2px}',

      /* Tagline strip (HTML stays per-page; CSS lives here) */
      '.nav-tagline-strip{position:fixed;top:72px;left:0;right:0;z-index:999;height:24px;background:rgba(12,16,32,0.88);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;font-family:\'Space Mono\',monospace;font-size:8px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(232,175,56,0.55)}',
      '.nav-tagline-strip::after{content:\'\';position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(232,175,56,0.12),transparent)}',

      /* Responsive */
      '@media(max-width:768px){',
      '  .nav-hamburger{display:flex}',
      '  .nav-mobile-menu{display:block}',
      '  .nav-center{display:none}',
      '  .nav-science{display:none}',
      '  .nav-launch{font-size:8px;padding:6px 12px}',
      '  .nav-tagline-strip{display:none}',
      '  .nav-bar{padding:0 16px;gap:16px;justify-content:space-between}',
      '}'
    ].join('\n');
    document.head.appendChild(style);
  }

  /* ── Nav HTML ───────────────────────────────────────────────────────── */
  el.innerHTML = [
    '<div class="site-nav" id="site-nav" role="navigation" aria-label="Main navigation">',
    '  <div class="nav-bar">',
    '    <a href="/" class="nav-wm" aria-label="Home">w<span class="i-fix">i</span>z<span class="k">k</span>o<span class="wm-dot">o</span></a>',
    '    <div class="nav-center">',
    '      <a href="/plan" class="nav-science">The Plan</a>',
    '      <a href="/games" class="nav-science">The Games</a>',
    '      <a href="/library" class="nav-science">The Library</a>',
    '      <a href="/methodology" class="nav-science">The Science</a>',
    '      <a href="/ages" class="nav-science">The Ages</a>',
    '      <a href="/the-open-seat" class="nav-science">The Open Seat</a>',
    '      <a href="/pricing" class="nav-science">The Price</a>',
    '    </div>',
    '    <button class="nav-hamburger" id="nav-hamburger" aria-label="Menu" aria-expanded="false">',
    '      <span class="nav-hamburger-line"></span>',
    '      <span class="nav-hamburger-line"></span>',
    '      <span class="nav-hamburger-line"></span>',
    '    </button>',
    '    <a href="/plan" class="nav-launch">Build Your Plan</a>',
    '  </div>',
    '</div>',
    '<nav class="nav-mobile-menu" id="nav-mobile-menu" aria-label="Main menu" aria-hidden="true">',
    '  <div class="nav-mobile-menu-inner">',
    '    <a href="/plan">The Plan</a>',
    '    <a href="/games">The Games</a>',
    '    <a href="/library">The Library</a>',
    '    <a href="/methodology">The Science</a>',
    '    <a href="/ages">The Ages</a>',
    '    <a href="/the-open-seat">The Open Seat</a>',
    '    <a href="/pricing">The Price</a>',
    '  </div>',
    '</nav>'
  ].join('\n');

  /* ── Active link ────────────────────────────────────────────────────── */
  var path = window.location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
  el.querySelectorAll('.nav-science').forEach(function (link) {
    var href = link.getAttribute('href').replace(/\.html$/, '').replace(/\/$/, '') || '/';
    if (href === path || (href !== '/' && path.startsWith(href))) {
      link.classList.add('active');
    }
  });

  /* ── Hamburger behaviour ────────────────────────────────────────────── */
  var btn  = document.getElementById('nav-hamburger');
  var menu = document.getElementById('nav-mobile-menu');
  if (!btn || !menu) return;
  var links = menu.querySelectorAll('a');

  function isOpen()  { return menu.classList.contains('open'); }

  function openMenu() {
    menu.classList.add('open');
    menu.setAttribute('aria-hidden', 'false');
    btn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (links[0]) links[0].focus();
  }

  function closeMenu() {
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    btn.focus();
  }

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    isOpen() ? closeMenu() : openMenu();
  });

  links.forEach(function (a) {
    a.addEventListener('click', function () { closeMenu(); });
  });

  document.addEventListener('click', function (e) {
    if (!isOpen()) return;
    if (!menu.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen()) { closeMenu(); }
  });

  /* Focus trap */
  document.addEventListener('keydown', function (e) {
    if (!isOpen() || e.key !== 'Tab') return;
    var focusable = Array.from(menu.querySelectorAll('a'));
    if (!focusable.length) return;
    var first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 768 && isOpen()) closeMenu();
  }, { passive: true });

})();
