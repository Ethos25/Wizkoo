/**
 * Wizkoo Site Nav — single source of truth
 * Injects the canonical nav into #wizkoo-nav on every marketing page.
 * Runs synchronously so nav + announcement bar are in the DOM immediately.
 *
 * Structure (top to bottom inside #wizkoo-nav):
 *   1. .announce  — position:sticky top:0   z-index:21  (scrolls away on mobile)
 *   2. .nav        — position:sticky top:30px z-index:20  (always present, sticks below bar)
 *   3. #nav-mobile-menu — position:fixed, opens below nav
 *
 * Active link is detected automatically from window.location.pathname.
 */
(function () {
  var el = document.getElementById('wizkoo-nav');
  if (!el) return;

  /* ── Noise SVG data URL (shared by both bars) ─────────────────────── */
  var NOISE = 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3CfeColorMatrix type=\'saturate\' values=\'0\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")';

  /* ── Scoped styles ──────────────────────────────────────────────────── */
  if (!document.getElementById('wn-styles')) {
    var style = document.createElement('style');
    style.id = 'wn-styles';
    style.textContent = [

      /* Ensure tokens are available if not set by the page */
      ':root{',
      '  --expo:cubic-bezier(0.16,1,0.3,1);',
      '  --saffron:#E8AF38;',
      '  --ink:#0C1020;',
      '}',

      /* ── kGiggle + dot animations ── */
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
      '@keyframes dotReact{0%{transform:scale(1)}40%{transform:scale(1.4)}100%{transform:scale(1)}}',

      /* ── Wordmark dot ── */
      '.wm-dot{display:inline-block;position:relative;margin-left:-0.08em}',
      '.wm-dot::after{content:\'\';position:absolute;top:.1em;right:-.2em;width:.22em;height:.22em;border-radius:50%;background:var(--saffron);transition:transform .3s var(--expo)}',
      '.nav-wm:hover .wm-dot::after{animation:dotReact .4s var(--expo)}',

      /* ═══ ANNOUNCEMENT BAR ═══ */
      '.announce{',
      '  height:30px;',
      '  margin:0;',
      '  background:rgba(12,16,32,0.96);',
      '  backdrop-filter:none;',
      '  -webkit-backdrop-filter:none;',
      '  border-bottom:1px solid rgba(255,255,255,0.06);',
      '  display:flex;',
      '  align-items:center;',
      '  justify-content:center;',
      '  position:relative;',
      '}',
      '.announce::before{',
      '  content:\'\';',
      '  position:absolute;',
      '  inset:0;',
      '  background-image:' + NOISE + ';',
      '  background-size:256px 256px;',
      '  opacity:0.028;',
      '  pointer-events:none;',
      '}',
      '.announce-text{',
      '  font-family:\'Space Mono\',monospace;',
      '  font-size:7px;',
      '  letter-spacing:0.28em;',
      '  text-transform:uppercase;',
      '  color:rgba(12,16,32,0.75);',
      '  position:relative;',
      '  z-index:1;',
      '}',

      /* ═══ NAV BAR ═══ */
      '.nav{',
      '  height:52px;',
      '  margin:0;',
      '  padding:0 40px;',
      '  position:relative;',
      '  display:flex;',
      '  align-items:center;',
      '  justify-content:space-between;',
      '  background:rgba(12,16,32,0.96);',
      '  backdrop-filter:none;',
      '  -webkit-backdrop-filter:none;',
      '  border-bottom:1px solid rgba(255,255,255,0.05);',
      '  box-shadow:0 1px 0 rgba(255,255,255,0.08),0 4px 24px rgba(12,16,32,0.08);',
      '  isolation:isolate;',
      '  pointer-events:auto;',
      '}',

      /* Noise texture — physical depth layer */
      '.nav::before{',
      '  content:\'\';',
      '  position:absolute;',
      '  inset:0;',
      '  background-image:' + NOISE + ';',
      '  background-size:256px 256px;',
      '  opacity:0.030;',
      '  pointer-events:none;',
      '  z-index:-1;',
      '}',


      /* ── Linen-page nav modifier ── */
      '.nav--on-linen{',
      '  background:rgba(12,16,32,0.96);',
      '  backdrop-filter:none;',
      '  -webkit-backdrop-filter:none;',
      '}',

      /* Prevent links inside nav from picking up page-level overrides */
      '.nav a:not(.nav-cta){background:transparent!important;border:none!important;box-shadow:none!important;outline:none!important}',

      /* ── Left: Wordmark ── */
      '.nav-wm{',
      '  font-family:\'Sora\',sans-serif;',
      '  font-weight:800;',
      '  font-size:17px;',
      '  letter-spacing:-0.04em;',
      '  color:#FAFAFA;',
      '  text-decoration:none;',
      '  white-space:nowrap;',
      '  flex-shrink:0;',
      '  display:inline-flex;',
      '  align-items:baseline;',
      '  line-height:1;',
      '  background:transparent!important;',
      '  border:none!important;',
      '  box-shadow:none!important;',
      '  outline:none!important;',
      '}',
      '.nav-wm .k{display:inline-block;transform:rotate(8deg);transform-origin:bottom center;color:var(--saffron)}',
      '.nav-wm:hover .k{animation:kGiggle 0.8s ease-in-out}',
      '.nav-wm .i-fix{position:relative;display:inline-block}',

      /* ── Center: Nav links — absolute-centered ── */
      '.nav-center{',
      '  position:absolute;',
      '  left:50%;',
      '  top:0;',
      '  height:100%;',
      '  transform:translateX(-50%);',
      '  display:flex;',
      '  align-items:center;',
      '  flex-direction:row;',
      '  flex-wrap:nowrap;',
      '  gap:26px;',
      '}',

      /* ── Nav links ── */
      '.nav-link{',
      '  font-family:\'Space Mono\',monospace;',
      '  font-weight:400;',
      '  font-size:7.5px;',
      '  letter-spacing:0.15em;',
      '  text-transform:uppercase;',
      '  color:rgba(255,255,255,0.65);',
      '  text-decoration:none;',
      '  white-space:nowrap;',
      '  position:relative;',
      '  transition:color 0.2s;',
      '  background:transparent!important;',
      '  border:none!important;',
      '  box-shadow:none!important;',
      '  outline:none!important;',
      '}',
      '.nav-link::after{',
      '  content:\'\';',
      '  position:absolute;',
      '  bottom:-2px;',
      '  left:0;',
      '  width:0;',
      '  height:1px;',
      '  background:#E8AF38;',
      '  transition:width 0.25s cubic-bezier(0.16,1,0.3,1);',
      '}',
      '.nav-link:hover{color:rgba(255,255,255,0.90)}',
      '.nav-link:hover::after{width:100%}',
      '.nav-link.active{color:#FAFAFA}',
      '.nav-link.active::after{width:100%}',

      /* ═══ NAV CTA ═══ */
      '.nav-cta{',
      '  font-family:\'Sora\',sans-serif;',
      '  font-weight:700;',
      '  font-size:9px;',
      '  letter-spacing:0.07em;',
      '  text-transform:uppercase;',
      '  padding:8px 18px;',
      '  background:transparent;',
      '  color:#E8AF38;',
      '  border:1px solid rgba(232,175,56,0.65);',
      '  box-shadow:none;',
      '  text-decoration:none;',
      '  display:inline-block;',
      '  white-space:nowrap;',
      '  flex-shrink:0;',
      '  transition:border-color 0.22s cubic-bezier(0.16,1,0.3,1),box-shadow 0.22s cubic-bezier(0.16,1,0.3,1);',
      '}',
      '.nav-cta:hover{',
      '  border-color:rgba(232,175,56,1.0);',
      '  box-shadow:0 0 0 1px rgba(232,175,56,0.20),0 2px 12px rgba(232,175,56,0.18);',
      '}',

      /* ── Hamburger (mobile only) ── */
      '.nav-hamburger{display:none;flex-direction:column;justify-content:center;align-items:center;gap:5px;width:44px;height:44px;padding:0;background:transparent;border:none;cursor:pointer;flex-shrink:0;-webkit-tap-highlight-color:transparent}',
      '.nav-hamburger-line{display:block;width:20px;height:2px;background:rgba(250,250,250,0.7);border-radius:1px}',

      /* ── Mobile menu panel (position:fixed, below sticky nav) ── */
      '.nav-mobile-menu{display:none;position:fixed;top:52px;left:0;right:0;z-index:19;overflow:hidden;pointer-events:none}',
      '.nav-mobile-menu-inner{',
      '  background:rgba(12,16,32,0.96);',
      '  -webkit-backdrop-filter:blur(20px);',
      '  backdrop-filter:blur(20px);',
      '  border-bottom:1px solid rgba(255,255,255,0.08);',
      '  transform:translateY(-100%);',
      '  transition:transform 150ms ease-in;',
      '  padding:8px 0;',
      '}',
      '.nav-mobile-menu.open{pointer-events:auto}',
      '.nav-mobile-menu.open .nav-mobile-menu-inner{transform:translateY(0);transition:transform 300ms cubic-bezier(0.16,1,0.3,1)}',
      '.nav-mobile-menu a{',
      '  display:block;',
      '  font-family:\'Space Mono\',monospace;',
      '  font-weight:400;',
      '  font-size:9px;',
      '  letter-spacing:0.15em;',
      '  text-transform:uppercase;',
      '  line-height:32px;',
      '  color:rgba(255,255,255,0.6);',
      '  text-decoration:none;',
      '  padding:10px 40px;',
      '  background:transparent;',
      '  border:none;',
      '  -webkit-tap-highlight-color:transparent;',
      '  outline:none;',
      '  transition:color 0.2s;',
      '}',
      '.nav-mobile-menu a:hover{color:rgba(255,255,255,0.9)}',
      '.nav-mobile-menu a:focus-visible{outline:2px solid var(--saffron);outline-offset:-2px}',

      /* ═══ MOBILE ═══ */
      '@media(max-width:768px){',
      '  .nav{padding:0 20px}',
      '  .nav-hamburger{display:flex}',
      '  .nav-mobile-menu{display:block}',
      '  .nav-center{display:none}',
      '  .nav-cta{font-size:8px;padding:6px 12px}',
      '}'

    ].join('\n');
    document.head.appendChild(style);
  }

  /* ── Container is the sticky element ──────────────────────────────── */
  /* top:-30px = negative of announce bar height.                         */
  /* As page scrolls 30px, bar clips above viewport, nav locks at top.   */
  el.style.position = 'sticky';
  el.style.top      = '-30px';
  el.style.zIndex   = '20';

  /* ── Path (needed for both HTML and active-link logic below) ─────── */
  var path = window.location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
  var _hp  = (path === '/');

  /* ── Nav HTML ───────────────────────────────────────────────────────── */
  el.innerHTML = [

    /* 1. Announcement bar — sticky top:0, scrolls away on mobile */
    '<div class="announce" role="banner" aria-label="Site announcement"' +
      (_hp ? ' style="background:#0C1020;backdrop-filter:none;-webkit-backdrop-filter:none"' : '') + '>',
    '  <span class="announce-text"' +
      (_hp ? ' style="color:rgba(232,175,56,0.75)"' : '') + '>Personalized homeschool learning plans, ages 2 to 12. Books. Games. Connected by one theme.</span>',
    '</div>',

    /* 2. Frosted glass nav — sticky top:30px, always present on desktop */
    '<div class="nav" id="site-nav" role="navigation" aria-label="Main navigation">',
    '  <a href="/" class="nav-wm" aria-label="Home">w<span class="i-fix">i</span>z<span class="k">k</span>o<span class="wm-dot">o</span></a>',
    '  <div class="nav-center">',
    '    <a href="/plan"          class="nav-link">The Plan</a>',
    '    <a href="/games"         class="nav-link">The Games</a>',
    '    <a href="/library"       class="nav-link">The Library</a>',
    '    <a href="/methodology"   class="nav-link">The Science</a>',
    '    <a href="/ages"          class="nav-link">The Ages</a>',
    '    <a href="/the-open-seat" class="nav-link">The Open Seat</a>',
    '    <a href="/pricing"       class="nav-link">The Price</a>',
    '  </div>',
    '  <button class="nav-hamburger" id="nav-hamburger" aria-label="Menu" aria-expanded="false">',
    '    <span class="nav-hamburger-line"></span>',
    '    <span class="nav-hamburger-line"></span>',
    '    <span class="nav-hamburger-line"></span>',
    '  </button>',
    '  <a href="/plan" class="nav-cta">Build Your Plan</a>',
    '</div>',

    /* 3. Mobile menu — position:fixed, opens below sticky nav */
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
  /* path already computed above */
  el.querySelectorAll('.nav-link').forEach(function (link) {
    var href = link.getAttribute('href').replace(/\.html$/, '').replace(/\/$/, '') || '/';
    if (href === path || (href !== '/' && path.startsWith(href))) {
      link.classList.add('active');
    }
  });

  /* ── Linen-page modifier — homepage only ───────────────────────────── */
  if (path === '/') {
    var siteNav = document.getElementById('site-nav');
    if (siteNav) siteNav.classList.add('nav--on-linen');
  }

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
