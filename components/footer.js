/**
 * Wizkoo Site Footer — single source of truth
 * Injects the canonical footer into #site-footer on every marketing page.
 * Runs synchronously so the footer is in the DOM immediately.
 */
(function () {
  var el = document.getElementById('site-footer');
  if (!el) return;

  /* ── Scoped styles ──────────────────────────────────────────────────── */
  if (!document.getElementById('wf-styles')) {
    var style = document.createElement('style');
    style.id = 'wf-styles';
    style.textContent = [

      /* Twinkling star animation */
      '@keyframes wfTwinkle{',
      '  0%,100%{opacity:var(--lo,0.12);}',
      '  50%{opacity:var(--hi,0.55);}',
      '}',

      /* Base — dark planetarium background + pinstripe overlay */
      '#wizkoo-footer{',
      '  background:',
      '    radial-gradient(ellipse 100% 20% at 50% 0%,',
      '      rgba(232, 175, 56, 0.06) 0%,',
      '      transparent 100%),',
      '    radial-gradient(ellipse at 50% 45%,',
      '      rgba(24, 40, 72, 0.60) 0%,',
      '      rgba(16, 24, 48, 0.30) 70%),',
      '    repeating-linear-gradient(',
      '      90deg,',
      '      transparent, transparent 59px,',
      '      rgba(255,255,255,0.012) 59px,',
      '      rgba(255,255,255,0.012) 60px',
      '    ),',
      '    #0C1020;',
      '  color:#F0F2F8;',
      '  position:relative;',
      '  overflow:hidden;',
      '}',

      /* Star field layer — absolute, fills footer, behind all content */
      '#wizkoo-footer .wf-stars{',
      '  position:absolute;',
      '  inset:0;',
      '  pointer-events:none;',
      '  z-index:0;',
      '}',

      /* All content sections float above the star field */
      '#wizkoo-footer .wf-top,',
      '#wizkoo-footer .wf-divider,',
      '#wizkoo-footer .wf-bottom{',
      '  position:relative;',
      '  z-index:1;',
      '}',

      /* ── Top grid: brand | product | learn more | connect ── */
      '#wizkoo-footer .wf-top{',
      '  padding:56px 48px 48px;',
      '  max-width:1200px;',
      '  margin:0 auto;',
      '  display:grid;',
      '  grid-template-columns:1.4fr 1fr 1fr 0.8fr;',
      '  gap:48px;',
      '  align-items:start;',
      '}',

      /* ── Col 1: Brand ── */
      '#wizkoo-footer .wf-brand .footer-wm{',
      '  font-family:\'Sora\',sans-serif;',
      '  font-weight:700;',
      '  font-size:20px;',
      '  letter-spacing:-0.02em;',
      '  color:#F0F2F8;',
      '  text-decoration:none;',
      '  display:inline-flex;',
      '  align-items:baseline;',
      '  line-height:1;',
      '}',
      '#wizkoo-footer .wf-brand .footer-wm .k{',
      '  display:inline-block;',
      '  transform:rotate(8deg);',
      '  transform-origin:bottom center;',
      '  color:#E8AF38;',
      '}',
      '#wizkoo-footer .wf-brand .footer-wm:hover .k{',
      '  animation:kGiggle 0.8s ease-in-out;',
      '}',
      /* Footer-specific dot class — isolated from nav.js global .wm-dot styles */
      '#wizkoo-footer .wf-brand .footer-wm .wf-o-dot{',
      '  display:inline-block;',
      '  position:relative;',
      '  margin-left:-0.08em;',
      '}',
      '#wizkoo-footer .wf-brand .footer-wm .wf-o-dot::after{',
      '  content:\'\';',
      '  position:absolute;',
      '  top:.1em;right:-.2em;',
      '  width:.22em;height:.22em;',
      '  border-radius:50%;',
      '  background:#E8AF38;',
      '}',
      '#wizkoo-footer .wf-tagline{',
      '  font-family:\'Inter\',sans-serif;',
      '  font-size:0.81rem;',
      '  color:rgba(240,242,248,0.4);',
      '  line-height:1.6;',
      '  margin-top:14px;',
      '}',
      '#wizkoo-footer .wf-email{margin-top:8px;}',
      '#wizkoo-footer .wf-email a{',
      '  font-family:\'Inter\',sans-serif;',
      '  font-size:0.81rem;',
      '  color:rgba(240,242,248,0.3);',
      '  text-decoration:none;',
      '  transition:color 0.25s ease;',
      '}',
      '#wizkoo-footer .wf-email a:hover{color:rgba(240,242,248,0.65);}',

      /* ── Column headers ── */
      '#wizkoo-footer .wf-col-header{',
      '  font-family:"Space Mono",monospace;',
      '  font-weight:400;',
      '  font-size:0.625rem;',
      '  letter-spacing:0.14em;',
      '  text-transform:uppercase;',
      '  color:rgba(240,242,248,0.3);',
      '  margin-bottom:18px;',
      '}',

      /* ── Cols 2, 3, 4 — shared column wrapper ── */
      '#wizkoo-footer .wf-nav,',
      '#wizkoo-footer .wf-social,',
      '#wizkoo-footer .wf-learn{',
      '  display:flex;',
      '  flex-direction:column;',
      '  gap:13px;',
      '  position:static!important;',
      '  height:auto!important;',
      '  background:transparent!important;',
      '  backdrop-filter:none!important;',
      '  -webkit-backdrop-filter:none!important;',
      '  padding:0!important;',
      '  box-shadow:none!important;',
      '  border:none!important;',
      '}',

      /* ── Shared link style: Inter 400 ── */
      '#wizkoo-footer .wf-nav a,',
      '#wizkoo-footer .wf-learn a,',
      '#wizkoo-footer .wf-social a{',
      '  font-family:\'Inter\',system-ui,sans-serif;',
      '  font-weight:400!important;',
      '  font-size:0.875rem;',
      '  color:rgba(240,242,248,0.55);',
      '  text-decoration:none;',
      '  transition:color 0.25s ease;',
      '  line-height:1;',
      '}',
      '#wizkoo-footer .wf-nav a:hover,',
      '#wizkoo-footer .wf-learn a:hover,',
      '#wizkoo-footer .wf-social a:hover{',
      '  color:rgba(240,242,248,0.85);',
      '}',

      /* ── Social links: icon + text inline ── */
      '#wizkoo-footer .wf-social a.wf-social-link{',
      '  display:inline-flex;',
      '  align-items:center;',
      '  gap:9px;',
      '}',
      '#wizkoo-footer .wf-social a.wf-social-link svg{',
      '  flex-shrink:0;',
      '}',

      /* ── Bottom bar legal links ── */
      '#wizkoo-footer .wf-copy-legal{',
      '  display:inline-flex;',
      '  align-items:center;',
      '  gap:0;',
      '}',
      '#wizkoo-footer .wf-copy-legal a{',
      '  font-family:"Space Mono",monospace;',
      '  font-size:0.6rem;',
      '  text-transform:uppercase;',
      '  letter-spacing:0.1em;',
      '  color:rgba(240,242,248,0.28);',
      '  text-decoration:none;',
      '  transition:color 0.25s ease;',
      '}',
      '#wizkoo-footer .wf-copy-legal a:hover{color:rgba(240,242,248,0.5);}',

      /* ── Divider ── */
      '#wizkoo-footer .wf-divider{',
      '  max-width:1200px;',
      '  margin:0 auto;',
      '  height:1px;',
      '  background:rgba(255,255,255,0.07);',
      '}',

      /* ── Bottom bar ── */
      '#wizkoo-footer .wf-bottom{',
      '  max-width:1200px;',
      '  margin:0 auto;',
      '  padding:24px 48px 40px;',
      '  display:flex;',
      '  justify-content:space-between;',
      '  align-items:center;',
      '  flex-wrap:wrap;',
      '  gap:8px;',
      '}',
      '#wizkoo-footer .wf-copy{',
      '  font-family:"Space Mono",monospace;',
      '  font-size:0.6rem;',
      '  text-transform:uppercase;',
      '  letter-spacing:0.1em;',
      '  color:rgba(240,242,248,0.18);',
      '}',
      '#wizkoo-footer .wf-edu{',
      '  font-family:"Space Mono",monospace;',
      '  font-size:0.6rem;',
      '  text-transform:uppercase;',
      '  letter-spacing:0.1em;',
      '  color:rgba(240,242,248,0.25);',
      '}',
      '#wizkoo-footer .wf-edu a{',
      '  color:#E8AF38;',
      '  text-decoration:none;',
      '  transition:color 0.25s ease;',
      '}',
      '#wizkoo-footer .wf-edu a:hover{color:#F0C45A;}',

      /* ── Responsive — 768px ── */
      '@media(max-width:768px){',
      '  #wizkoo-footer .wf-top{',
      '    padding:44px 24px 40px;',
      '    grid-template-columns:1fr;',
      '    gap:32px;',
      '  }',
      '  #wizkoo-footer .wf-divider{margin:0 24px;}',
      '  #wizkoo-footer .wf-bottom{',
      '    padding:20px 24px 36px;',
      '    flex-direction:column;',
      '    align-items:center;',
      '    text-align:center;',
      '    gap:8px;',
      '  }',
      '}'

    ].join('\n');
    document.head.appendChild(style);
  }

  /* ── SVG icon paths ─────────────────────────────────────────────────── */
  var icons = {
    instagram: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>',
    tiktok:    '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>',
    pinterest: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/></svg>'
  };

  /* ── Footer HTML ────────────────────────────────────────────────────── */
  el.innerHTML = [
    '<footer id="wizkoo-footer" role="contentinfo">',

    '  <!-- Star field — generated by JS below -->',
    '  <div class="wf-stars" aria-hidden="true"></div>',

    '  <div class="wf-top">',

    '    <!-- Col 1: Brand (no header) -->',
    '    <div class="wf-brand">',
    '      <a href="/" class="footer-wm" aria-label="Wizkoo home">',
    '        w<span class="i-fix">i</span>z<span class="k">k</span>o<span class="wf-o-dot">o</span>',
    '      </a>',
    '      <p class="wf-tagline">Weekly learning plans<br>for families, ages 2 to 12.</p>',
    '      <div class="wf-email"><a href="mailto:hello@wizkoo.com">hello@wizkoo.com</a></div>',
    '    </div>',

    '    <!-- Col 2: Product -->',
    '    <nav class="wf-nav" aria-label="Product">',
    '      <div class="wf-col-header" aria-hidden="true">Product</div>',
    '      <a href="/plan">The Plan</a>',
    '      <a href="/games">The Games</a>',
    '      <a href="/library">The Library</a>',
    '      <a href="/methodology">The Science</a>',
    '      <a href="/ages">The Ages</a>',
    '      <a href="/pricing">The Price</a>',
    '    </nav>',

    '    <!-- Col 3: Learn More -->',
    '    <nav class="wf-learn" aria-label="Learn more">',
    '      <div class="wf-col-header" aria-hidden="true">Learn More</div>',
    '      <a href="/the-open-seat">The Open Seat</a>',
    '      <a href="/what-we-believe">What We Believe</a>',
    '      <a href="/esa">ESA</a>',
    '      <a href="/about">About</a>',
    '      <a href="/#faq">FAQ</a>',
    '    </nav>',

    '    <!-- Col 4: Connect -->',
    '    <div class="wf-social">',
    '      <div class="wf-col-header" aria-hidden="true">Connect</div>',
    '      <a href="https://instagram.com/heywizkoo" class="wf-social-link" target="_blank" rel="noopener noreferrer">' + icons.instagram + 'Instagram</a>',
    '      <a href="https://tiktok.com/@heywizkoo" class="wf-social-link" target="_blank" rel="noopener noreferrer">' + icons.tiktok + 'TikTok</a>',
    '      <a href="https://pinterest.com/heywizkoo" class="wf-social-link" target="_blank" rel="noopener noreferrer">' + icons.pinterest + 'Pinterest</a>',
    '    </div>',

    '  </div>',

    '  <div class="wf-divider" aria-hidden="true"></div>',

    '  <div class="wf-bottom">',
    '    <span class="wf-copy wf-copy-legal">&copy; 2026 Wizkoo LLC&nbsp;&middot;&nbsp;<a href="/privacy">Privacy</a>&nbsp;&middot;&nbsp;<a href="/terms">Terms</a></span>',
    '    <span class="wf-edu">Educator or co-op leader? <a href="mailto:hello@wizkoo.com">Get in touch.</a></span>',
    '  </div>',

    '</footer>'
  ].join('\n');

  /* ── Star field generator ───────────────────────────────────────────── */
  var starContainer = el.querySelector('.wf-stars');
  if (starContainer) {
    var starHtml = '';
    for (var i = 0; i < 120; i++) {
      var x   = (Math.random() * 100).toFixed(2);
      var y   = (Math.random() * 100).toFixed(2);
      var r   = Math.random();
      var sz  = r < 0.7 ? 1 : r < 0.9 ? 1.5 : 2;
      var lo  = (0.05 + Math.random() * 0.12).toFixed(2);
      var hi  = (0.28 + Math.random() * 0.45).toFixed(2);
      var dur = (2    + Math.random() * 4).toFixed(1);
      var del = (Math.random() * 5).toFixed(1);
      starHtml += '<div style="position:absolute;border-radius:50%;'
               + 'background:#F0F2F8;'
               + 'left:' + x + '%;top:' + y + '%;'
               + 'width:' + sz + 'px;height:' + sz + 'px;'
               + 'animation:wfTwinkle ' + dur + 's ease-in-out '
               + 'infinite ' + del + 's;'
               + '--lo:' + lo + ';--hi:' + hi + ';"></div>';
    }
    starContainer.innerHTML = starHtml;
  }

})();
