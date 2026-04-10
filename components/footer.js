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

      /* Base */
      '#wizkoo-footer{',
      '  background-color:#0C1020;',
      '  color:#F0F2F8;',
      '  border-top:1px solid rgba(255,255,255,0.04);',
      '}',

      /* ── Top grid: brand | nav | social | legal ── */
      '#wizkoo-footer .wf-top{',
      '  padding:56px 48px 48px;',
      '  max-width:1200px;',
      '  margin:0 auto;',
      '  display:grid;',
      '  grid-template-columns:1.6fr 1fr 0.7fr 0.7fr;',
      '  gap:48px;',
      '  align-items:start;',
      '}',

      /* Col 1 — Brand */
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
      '#wizkoo-footer .wf-brand .footer-wm .wm-dot{',
      '  display:inline-block;',
      '  position:relative;',
      '  margin-left:-0.08em;',
      '}',
      '#wizkoo-footer .wf-brand .footer-wm .wm-dot::after{',
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
      '  transition:color 200ms ease;',
      '}',
      '#wizkoo-footer .wf-email a:hover{color:rgba(240,242,248,0.65);}',

      /* Cols 2, 3, 4 — shared link style */
      '#wizkoo-footer .wf-nav,',
      '#wizkoo-footer .wf-social,',
      '#wizkoo-footer .wf-legal{',
      '  display:flex;',
      '  flex-direction:column;',
      '  gap:13px;',
      /* Reset any site-nav bleeding in from base/nav styles */
      '  position:static!important;',
      '  height:auto!important;',
      '  background:transparent!important;',
      '  backdrop-filter:none!important;',
      '  -webkit-backdrop-filter:none!important;',
      '  padding:0!important;',
      '  box-shadow:none!important;',
      '  border:none!important;',
      '}',
      '#wizkoo-footer .wf-nav a,',
      '#wizkoo-footer .wf-social a,',
      '#wizkoo-footer .wf-legal a{',
      '  font-family:\'Inter\',sans-serif;',
      '  font-size:0.875rem;',
      '  color:rgba(240,242,248,0.55);',
      '  text-decoration:none;',
      '  transition:color 200ms ease;',
      '  line-height:1;',
      '}',
      '#wizkoo-footer .wf-nav a:hover,',
      '#wizkoo-footer .wf-social a:hover,',
      '#wizkoo-footer .wf-legal a:hover{',
      '  color:rgba(240,242,248,0.85);',
      '}',

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
      '  transition:color 200ms ease;',
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

  /* ── Footer HTML ────────────────────────────────────────────────────── */
  el.innerHTML = [
    '<footer id="wizkoo-footer" role="contentinfo">',

    '  <div class="wf-top">',

    '    <!-- Col 1: Brand -->',
    '    <div class="wf-brand">',
    '      <a href="/" class="footer-wm" aria-label="Wizkoo home">',
    '        w<span class="i-fix">i</span>z<span class="k">k</span>o<span class="wm-dot">o</span>',
    '      </a>',
    '      <p class="wf-tagline">Weekly learning plans<br>for families, ages 2 to 12.</p>',
    '      <div class="wf-email"><a href="mailto:hello@wizkoo.com">hello@wizkoo.com</a></div>',
    '    </div>',

    '    <!-- Col 2: Nav -->',
    '    <nav class="wf-nav" aria-label="Site navigation">',
    '      <a href="/plan">The Plan</a>',
    '      <a href="/games">The Games</a>',
    '      <a href="/library">The Library</a>',
    '      <a href="/methodology">The Science</a>',
    '      <a href="/ages">The Ages</a>',
    '      <a href="/the-open-seat">The Open Seat</a>',
    '      <a href="/pricing">The Price</a>',
    '      <a href="/#faq">FAQ</a>',
    '    </nav>',

    '    <!-- Col 3: Social -->',
    '    <div class="wf-social">',
    '      <a href="https://instagram.com/heywizkoo" target="_blank" rel="noopener noreferrer">Instagram</a>',
    '      <a href="https://tiktok.com/@heywizkoo" target="_blank" rel="noopener noreferrer">TikTok</a>',
    '      <a href="https://pinterest.com/heywizkoo" target="_blank" rel="noopener noreferrer">Pinterest</a>',
    '    </div>',

    '    <!-- Col 4: Legal -->',
    '    <div class="wf-legal">',
    '      <a href="/privacy">Privacy Policy</a>',
    '      <a href="/terms">Terms of Service</a>',
    '    </div>',

    '  </div>',

    '  <div class="wf-divider" aria-hidden="true"></div>',

    '  <div class="wf-bottom">',
    '    <span class="wf-copy">&copy; 2026 Wizkoo LLC</span>',
    '    <span class="wf-edu">Educator or co-op leader? <a href="mailto:hello@wizkoo.com">Get in touch.</a></span>',
    '  </div>',

    '</footer>'
  ].join('\n');

})();
