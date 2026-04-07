/**
 * Wizkoo Site Footer — single source of truth
 * Injects the canonical footer into #site-footer on every marketing page.
 * Runs synchronously (no DOMContentLoaded wrapper) so the footer is in
 * the DOM before any deferred scripts (e.g. nav.js sound attachment) fire.
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
      '  background-color:#0C1428;',
      '  padding:56px 48px 0;',
      '  color:#F0F2F8;',
      '  border-top:1px solid rgba(255,255,255,0.04);',
      '}',

      /* Top grid — 4 columns */
      '#wizkoo-footer .wf-inner{',
      '  max-width:1200px;',
      '  margin:0 auto;',
      '  display:grid;',
      '  grid-template-columns:1fr 1fr 1fr auto;',
      '  gap:48px;',
      '  align-items:start;',
      '}',

      /* Col 1 — Brand */
      '#wizkoo-footer .wf-tagline{',
      '  font-family:Inter,sans-serif;',
      '  font-size:0.82rem;',
      '  color:#8C91A5;',
      '  line-height:1.6;',
      '  margin-top:12px;',
      '}',
      '#wizkoo-footer .wf-email{margin-top:8px;}',
      '#wizkoo-footer .wf-email a{',
      '  font-family:Inter,sans-serif;',
      '  font-size:0.72rem;',
      '  color:#8C91A5;',
      '  text-decoration:none;',
      '  transition:color 200ms ease;',
      '}',
      '#wizkoo-footer .wf-email a:hover{color:#F0F2F8;}',

      /* Col 2 — Nav */
      '#wizkoo-footer .wf-nav{',
      '  position:static!important;',
      '  height:auto!important;',
      '  background:transparent!important;',
      '  backdrop-filter:none!important;',
      '  -webkit-backdrop-filter:none!important;',
      '  padding:0!important;',
      '  box-shadow:none!important;',
      '  display:flex!important;',
      '  flex-direction:column!important;',
      '  gap:14px;',
      '  justify-content:flex-start!important;',
      '  border:none!important;',
      '}',
      '#wizkoo-footer .wf-nav a{',
      '  font-family:Inter,sans-serif;',
      '  font-size:0.88rem;',
      '  color:#F0F2F8;',
      '  text-decoration:none;',
      '  transition:color 200ms ease;',
      '}',
      '#wizkoo-footer .wf-nav a:hover{color:#C8CDDA;}',

      /* Col 3 — Social */
      '#wizkoo-footer .wf-social{',
      '  display:flex;',
      '  flex-direction:column;',
      '  gap:14px;',
      '}',
      '#wizkoo-footer .wf-social a{',
      '  font-family:Inter,sans-serif;',
      '  font-size:0.88rem;',
      '  color:#F0F2F8;',
      '  text-decoration:none;',
      '  transition:color 200ms ease;',
      '}',
      '#wizkoo-footer .wf-social a:hover{color:#C8CDDA;}',

      /* Col 4 — Legal */
      '#wizkoo-footer .wf-legal{',
      '  display:flex;',
      '  flex-direction:column;',
      '  align-items:flex-end;',
      '}',
      '#wizkoo-footer .wf-privacy{',
      '  font-family:"Space Mono",monospace;',
      '  font-size:0.5rem;',
      '  text-transform:uppercase;',
      '  letter-spacing:0.1em;',
      '  color:#8C91A5;',
      '  text-decoration:underline;',
      '  text-underline-offset:3px;',
      '  transition:color 200ms ease;',
      '}',
      '#wizkoo-footer .wf-privacy:hover{color:#F0F2F8;}',

      /* Bottom bar */
      '#wizkoo-footer .wf-bottom{',
      '  max-width:1200px;',
      '  margin:32px auto 0;',
      '  padding:24px 0 32px;',
      '  border-top:1px solid rgba(255,255,255,0.06);',
      '  display:flex;',
      '  justify-content:space-between;',
      '  align-items:center;',
      '  flex-wrap:wrap;',
      '  gap:8px;',
      '}',
      '#wizkoo-footer .wf-copy{',
      '  font-family:"Space Mono",monospace;',
      '  font-size:0.45rem;',
      '  text-transform:uppercase;',
      '  letter-spacing:0.1em;',
      '  color:#50556E;',
      '}',
      '#wizkoo-footer .wf-edu{',
      '  font-family:"Space Mono",monospace;',
      '  font-size:0.45rem;',
      '  text-transform:uppercase;',
      '  letter-spacing:0.1em;',
      '  color:#50556E;',
      '}',
      '#wizkoo-footer .wf-edu a{',
      '  color:#8C91A5;',
      '  text-decoration:underline;',
      '  text-underline-offset:3px;',
      '  transition:color 200ms ease;',
      '}',
      '#wizkoo-footer .wf-edu a:hover{color:#F0F2F8;}',

      /* Responsive — 768px: 2-col */
      '@media(max-width:768px){',
      '  #wizkoo-footer{padding:48px 20px 0;}',
      '  #wizkoo-footer .wf-inner{',
      '    grid-template-columns:1fr 1fr;',
      '    gap:32px;',
      '  }',
      '  #wizkoo-footer .wf-legal{align-items:flex-start;}',
      '  #wizkoo-footer .wf-bottom{padding:20px 0 28px;}',
      '}',

      /* Responsive — 480px: 1-col */
      '@media(max-width:480px){',
      '  #wizkoo-footer .wf-inner{',
      '    grid-template-columns:1fr;',
      '    gap:28px;',
      '  }',
      '  #wizkoo-footer .wf-bottom{',
      '    flex-direction:column;',
      '    align-items:flex-start;',
      '    gap:6px;',
      '  }',
      '}'
    ].join('\n');
    document.head.appendChild(style);
  }

  /* ── Footer HTML ────────────────────────────────────────────────────── */
  el.innerHTML = [
    '<footer id="wizkoo-footer">',
    '  <div class="wf-inner">',

    '    <!-- Brand -->',
    '    <div class="wf-brand">',
    '      <a href="/" class="nav-wm" aria-label="Home">w<span class="i-fix">i</span>z<span class="k">k</span>o<span class="wm-dot">o</span></a>',
    '      <div class="wf-tagline">Weekly learning plans for families, ages 2&ndash;12.</div>',
    '      <div class="wf-email"><a href="mailto:hello@wizkoo.com">hello@wizkoo.com</a></div>',
    '    </div>',

    '    <!-- Nav -->',
    '    <nav class="wf-nav" aria-label="Site">',
    '      <a href="/plan">The Plan</a>',
    '      <a href="/games">The Games</a>',
    '      <a href="/methodology">The Science</a>',
    '    </nav>',

    '    <!-- Social -->',
    '    <div class="wf-social">',
    '      <a href="https://instagram.com/heywizkoo" target="_blank" rel="noopener noreferrer">Instagram</a>',
    '      <a href="https://tiktok.com/@heywizkoo" target="_blank" rel="noopener noreferrer">TikTok</a>',
    '    </div>',

    '    <!-- Legal -->',
    '    <div class="wf-legal">',
    '      <a href="/privacy" class="wf-privacy">Privacy</a>',
    '    </div>',

    '  </div>',

    '  <!-- Bottom bar -->',
    '  <div class="wf-bottom">',
    '    <span class="wf-copy">&copy; 2026 Wizkoo</span>',
    '    <span class="wf-edu">Educator or co-op leader? <a href="mailto:hello@wizkoo.com">Get in touch.</a></span>',
    '  </div>',
    '</footer>'
  ].join('\n');
})();
