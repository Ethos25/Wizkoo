/**
 * Wizkoo Site Footer — single source of truth
 * Treatment A: Sunset-to-Night (homepage, plan, price, ages, methodology, library)
 * Treatment B: Continuous-Night (games, science, open seat)
 * Surface is determined by data-footer-treatment attribute on <body> (defaults to 'a').
 */
(function () {
  var el = document.getElementById('site-footer');
  if (!el) return;

  var treatment = (document.body.getAttribute('data-footer-treatment') || 'a').toLowerCase();

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

      /* ═══ ATMOSPHERE ═══════════════════════════════════════════════════
         The medium between the objects. Twelve blurred ellipses — 2 washes,
         4 lobes, 4 nebulae, 2 wisps — behind the stars, at 0.45x the opacity
         the homepage hero emits them at. Same gradients and same blur radii
         as the hero primitive (css/hero-sky.css .wk-sky__atmo-wash /
         __atmo-lobe / __nebula / __wisp); footer-scoped class names because
         hero-sky.css is not loaded on these pages.

         The hero's two breathe keyframes (wk-sky-atmo-breathe and
         wk-sky-nebula-breathe) are identical in shape and differ only in
         which custom property they read, so lobes and nebulae share one
         keyframe here reading one property.

         NOT mounted on the homepage: see the [data-orb-sky] gate in the
         atmosphere builder below, and the measurement that justifies it. */
      '#wizkoo-footer .wf-atmo{',
      '  position:absolute;',
      '  inset:0;',
      '  overflow:hidden;',
      '  pointer-events:none;',
      '  z-index:0;',
      '}',
      /* DELIBERATE DEVIATION FROM THE HERO: no will-change.
         hero-sky.css declares will-change:transform,opacity on these layers.
         Measured here on the built esa/georgia at 1280x800, 7 interleaved
         reps against a null control that came in at +0.12ms:
             with will-change      55.17 ms/frame   (18.1 fps)
             will-change:auto      27.89 ms/frame   (35.9 fps)
         The hint costs 27.3 ms/frame and changes nothing visually, so it is
         not taken. The hero can afford it on one page; this runs on 68. */
      '#wizkoo-footer .wf-atmo-wash,',
      '#wizkoo-footer .wf-atmo-lobe,',
      '#wizkoo-footer .wf-atmo-nebula,',
      '#wizkoo-footer .wf-atmo-wisp{',
      '  position:absolute;',
      '  animation-timing-function:ease-in-out;',
      '  animation-iteration-count:infinite;',
      '  animation-direction:alternate;',
      '}',
      '#wizkoo-footer .wf-atmo-wash{filter:blur(26px);animation-name:wfAtmoDrift;}',
      '#wizkoo-footer .wf-atmo-lobe{filter:blur(16px);animation-name:wfAtmoBreathe;}',
      '#wizkoo-footer .wf-atmo-nebula{filter:blur(18px);animation-name:wfAtmoBreathe;}',
      /* The wisp's own gradient, which the hero takes from hero-sky.css's
         .wk-sky__wisp rule. Restated here because that stylesheet is loaded
         on the homepage only. */
      '#wizkoo-footer .wf-atmo-wisp{',
      '  filter:blur(11px);',
      '  border-radius:50%;',
      '  background:linear-gradient(90deg, transparent 0%, rgba(150,168,200,0.45) 30%, rgba(160,178,210,0.55) 55%, rgba(150,168,200,0.32) 75%, transparent 100%);',
      '  animation-name:wfWispDrift;',
      '}',
      '@keyframes wfAtmoDrift{',
      '  from{opacity:calc(var(--o,0.1) * 0.55);translate:0 0;}',
      '  to{opacity:var(--o,0.1);translate:var(--dx,3%) -1.5%;}',
      '}',
      '@keyframes wfAtmoBreathe{',
      '  from{opacity:calc(var(--o,0.1) * 0.6);}',
      '  to{opacity:var(--o,0.1);}',
      '}',
      '@keyframes wfWispDrift{',
      '  from{opacity:calc(var(--o,0.1) * 0.7);translate:0 0;}',
      '  to{opacity:var(--o,0.1);translate:var(--dx,4%) 0.6%;}',
      '}',

      /* ═══ REDUCED MOTION: THE DESIGNED FROZEN FRAME ═══════════════════
         Matches the hero primitive's approach (css/hero-sky.css, "Reduced
         motion: the designed frozen frame"). Every star carries an inline
         mid-brightness opacity emitted by the generator below, and every
         atmosphere element carries its inline max opacity, so stopping the
         animations lands on a composed frame rather than wherever a
         keyframe happened to be. !important out-cascades the inline
         animation shorthand on each star div.

         Honors the media query and the [data-wk-motion='reduced'] harness
         attribute, the same two switches the hero honors. */
      '@media (prefers-reduced-motion: reduce){',
      '  #wizkoo-footer .wf-stars > div,',
      '  #wizkoo-footer .wf-atmo > span{animation:none!important;}',
      '}',
      '[data-wk-motion=\'reduced\'] #wizkoo-footer .wf-stars > div,',
      '[data-wk-motion=\'reduced\'] #wizkoo-footer .wf-atmo > span{animation:none!important;}',

      /* ── Treatment A: Sunset-to-Night ── */
      '#wizkoo-footer[data-treatment="a"]{',
      '  background:linear-gradient(180deg,',
      '    #FFB060 0%,',
      '    #F08838 7%,',
      '    #D85838 15%,',
      '    #B04848 25%,',
      '    #8A4056 38%,',
      '    #5A3858 52%,',
      '    #352848 66%,',
      '    #1A1838 80%,',
      '    #0C1020 92%,',
      '    #0C1020 100%);',
      '  color:#F0F2F8;',
      '  position:relative;',
      '  overflow:hidden;',
      '  min-height:520px;',
      '}',

      /* Sun disc — glowing circle in upper zone */
      '#wizkoo-footer[data-treatment="a"] .wf-sky{',
      '  position:absolute;',
      '  top:-35px;',
      '  right:8%;',
      '  width:70px;',
      '  height:70px;',
      '  border-radius:50%;',
      '  background:radial-gradient(circle,#FFFAE8 0%,#FFE899 22%,#FFBC50 52%,#FF8F30 78%,rgba(255,100,20,0) 100%);',
      '  box-shadow:0 0 20px 10px rgba(255,210,80,0.55),0 0 48px 22px rgba(255,160,50,0.28),0 0 90px 40px rgba(255,120,30,0.12);',
      '  pointer-events:none;',
      '  z-index:2;',
      '  will-change:transform;',
      '}',

      /* Star field: lower 45% only (gradient night phase begins at ~66%) */
      '#wizkoo-footer[data-treatment="a"] .wf-stars{',
      '  position:absolute;',
      '  top:55%;',
      '  left:0;right:0;bottom:0;',
      '  pointer-events:none;',
      '  z-index:0;',
      '}',

      /* "The day is made." — Fraunces italic, orange zone */
      '#wizkoo-footer[data-treatment="a"] .wf-closing{',
      '  position:absolute;',
      '  top:18%;',
      '  left:0;right:0;',
      '  text-align:center;',
      '  font-family:"Fraunces",serif;',
      '  font-style:italic;',
      '  font-weight:500;',
      '  font-size:26px;',
      '  letter-spacing:0.005em;',
      '  color:rgba(248,236,215,0.92);',
      '  line-height:1.3;',
      '  pointer-events:none;',
      '  z-index:1;',
      '  user-select:none;',
      '}',

      /* ── Treatment B: Continuous-Night ── */
      '#wizkoo-footer[data-treatment="b"]{',
      '  background:',
      '    radial-gradient(ellipse at 50% 45%,rgba(24,40,72,0.60) 0%,rgba(16,24,48,0.30) 70%),',
      '    #0C1020;',
      '  color:#F0F2F8;',
      '  position:relative;',
      '  overflow:hidden;',
      '}',

      /* Treatment B: stars fill full footer at higher density */
      '#wizkoo-footer[data-treatment="b"] .wf-stars{',
      '  position:absolute;',
      '  inset:0;',
      '  pointer-events:none;',
      '  z-index:0;',
      '}',

      /* Treatment B: closing line in upper star field */
      '#wizkoo-footer[data-treatment="b"] .wf-closing{',
      '  position:absolute;',
      '  top:22%;',
      '  left:0;right:0;',
      '  text-align:center;',
      '  font-family:"Fraunces",serif;',
      '  font-style:italic;',
      '  font-weight:500;',
      '  font-size:26px;',
      '  letter-spacing:0.005em;',
      '  color:rgba(248,236,215,0.92);',
      '  line-height:1.3;',
      '  pointer-events:none;',
      '  z-index:1;',
      '  user-select:none;',
      '}',

      /* Sun disc hidden in treatment B */
      '#wizkoo-footer[data-treatment="b"] .wf-sky{display:none}',

      /* All content sections float above background layers */
      '#wizkoo-footer .wf-top,',
      '#wizkoo-footer .wf-divider,',
      '#wizkoo-footer .wf-bottom{',
      '  position:relative;',
      '  z-index:1;',
      '}',

      /* ── Top grid: brand | learn | join | wizkoo ── */
      '#wizkoo-footer .wf-top{',
      '  padding:260px 48px 36px;',
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
      '  font-weight:800;',
      '  font-size:20px;',
      '  letter-spacing:-0.04em;',
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
      '  font-family:\'Plus Jakarta Sans\',sans-serif;',
      '  font-weight:400;',
      '  font-size:13px;',
      '  color:rgba(240,242,248,0.65);',
      '  line-height:1.65;',
      '  margin-top:14px;',
      '}',
      '#wizkoo-footer .wf-email{margin-top:10px;}',
      '#wizkoo-footer .wf-email a{',
      '  font-family:\'Plus Jakarta Sans\',sans-serif;',
      '  font-weight:400;',
      '  font-size:13px;',
      '  color:rgba(240,242,248,0.65);',
      '  text-decoration:none;',
      '  transition:color 0.25s ease;',
      '}',
      '#wizkoo-footer .wf-email a:hover{color:rgba(240,242,248,0.72);}',

      /* ── Column headers: Space Mono uppercase ── */
      '#wizkoo-footer .wf-col-header{',
      '  font-family:"Space Mono",monospace;',
      '  font-weight:400;',
      '  font-size:11px;',
      '  letter-spacing:0.18em;',
      '  text-transform:uppercase;',
      '  color:rgba(255,255,255,0.45);',
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

      /* ── Shared link style: Plus Jakarta Sans 400 ── */
      '#wizkoo-footer .wf-nav a,',
      '#wizkoo-footer .wf-learn a,',
      '#wizkoo-footer .wf-social a{',
      '  font-family:\'Plus Jakarta Sans\',sans-serif;',
      '  font-weight:400!important;',
      '  font-size:14px;',
      '  color:rgba(240,242,248,0.85);',
      '  text-decoration:none;',
      /* Easing matched to the cursor widen (.cursor, 250ms) and the nav's
         saffron underline wipe (.nav-link::after, 250ms) so the three read as
         one gesture. Duration and the colour-only treatment are unchanged. */
      '  transition:color 0.25s cubic-bezier(0.16, 1, 0.3, 1);',
      '  line-height:1;',
      '}',
      '#wizkoo-footer .wf-nav a:hover,',
      '#wizkoo-footer .wf-learn a:hover,',
      '#wizkoo-footer .wf-social a:hover{',
      '  color:rgba(240,242,248,1);',
      '}',

      /* ── Focus: the mark a mouse user gets from the cursor ──────────────
         Every footer anchor, not just the three link columns. The nav marks
         hover with a 1px saffron underline; keyboard focus here uses the same
         mark plus the hover colour lift. :focus-visible only, so a mouse
         click never draws it.

         The mark is text-decoration, not a positioned ::after. The nav's
         underline matches its text because a .nav-link box is its text; a
         footer link in .wf-nav / .wf-learn is a stretch item in a column
         flex container, so an inset-anchored bar would run the full column
         width and read as a rule rather than an underline. text-decoration
         tracks the glyphs at any box width and leaves the existing
         full-column hit area alone.

         !important because four anchors sit under later, heavier rules that
         set text-decoration:none and their own colour — the brand wordmark
         (#wizkoo-footer .wf-brand .footer-wm, 1-2-0), .wf-copy-legal a and
         .wf-edu a (both 1-1-1 and declared after this block). Without it,
         Privacy, Terms, Get in touch and the wordmark take focus with no
         mark at all; measured, that was 4 of 20 anchors unmarked. */
      '#wizkoo-footer a:focus-visible{',
      '  outline:none;',
      '  color:rgba(240,242,248,1)!important;',
      '  text-decoration:underline!important;',
      '  text-decoration-color:#E8AF38!important;',
      '  text-decoration-thickness:1px!important;',
      '  text-underline-offset:3px;',
      '}',
      '#wizkoo-footer .wf-edu a:focus-visible{color:#F0C45A!important;}',

      /* ── Social links: icon + text inline ── */
      '#wizkoo-footer .wf-social a.wf-social-link{',
      '  display:inline-flex;',
      '  align-items:center;',
      '  gap:9px;',
      '}',
      '#wizkoo-footer .wf-social a.wf-social-link svg{flex-shrink:0;}',

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
      '  color:rgba(240,242,248,0.25);',
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
      '  padding:20px 48px 32px;',
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
      '    padding:220px 24px 32px;',
      '    grid-template-columns:1fr;',
      '    gap:32px;',
      '  }',
      '  #wizkoo-footer[data-treatment="a"] .wf-closing{font-size:20px;top:16%}',
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
  /* scripts/render-components.js inlines this same markup into the served HTML
     at build time, so a crawler sees the links without running JavaScript. When
     it is already there, DO NOT write it again — re-injecting would duplicate
     every footer link in the DOM. The star field and sun parallax below still
     run: both are decorative, and the stars are random, so they must stay out
     of the built HTML or no two builds would match. */
  var prerendered = !!el.querySelector('#wizkoo-footer');

  if (!prerendered) el.innerHTML = [
    '<footer id="wizkoo-footer" data-treatment="' + treatment + '" role="contentinfo">',

    '  <!-- Sun disc layer (Treatment A only) -->',
    '  <div class="wf-sky" aria-hidden="true"></div>',

    '  <!-- Star field -->',
    '  <div class="wf-stars" aria-hidden="true"></div>',

    '  <!-- Closing line -->',
    '  <div class="wf-closing" aria-hidden="true">The day is made.</div>',

    '  <div class="wf-top">',

    '    <!-- Col 1: Brand -->',
    '    <div class="wf-brand">',
    '      <a href="/" class="footer-wm" aria-label="Wizkoo home">',
    '        w<span class="i-fix">i</span>z<span class="k">k</span>o<span class="wf-o-dot">o</span>',
    '      </a>',
    '      <p class="wf-tagline">Weekly learning plans<br>for families, ages 3 to 12.</p>',
    '      <div class="wf-email"><a href="mailto:hello@wizkoo.com">hello@wizkoo.com</a></div>',
    '    </div>',

    '    <!-- Col 2: The whole house -->',
    '    <nav class="wf-nav" aria-label="The whole house">',
    '      <div class="wf-col-header" aria-hidden="true">The whole house</div>',
    '      <a href="https://app.wizkoo.com/start">The Plan</a>',
    '      <a href="/library">The Library</a>',
    '      <a href="/methodology">The Science</a>',
    '      <a href="/ages">The Ages</a>',
    '      <a href="/pricing">The Price</a>',
    '    </nav>',

    '    <!-- Col 3: Behind Wizkoo -->',
    '    <nav class="wf-learn" aria-label="Behind Wizkoo">',
    '      <div class="wf-col-header" aria-hidden="true">Behind Wizkoo</div>',
    '      <a href="/themes">Themes to Explore</a>',
    '      <a href="/the-open-seat">The Open Seat</a>',
    '      <a href="/what-we-believe">What We Believe</a>',
    '      <a href="/esa">ESA</a>',
    '      <a href="/about">About</a>',
    '      <a href="/#faq">FAQ</a>',
    '    </nav>',

    '    <!-- Col 4: Say hello -->',
    '    <div class="wf-social">',
    '      <div class="wf-col-header" aria-hidden="true">Say hello</div>',
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
    var isTreatmentA = treatment === 'a';
    /* Treatment A: stars in lower 45% of footer (container already starts at top:55%)
       Treatment B: stars throughout, higher density */
    var starHtml = '';

    /* Every star carries its own mid-brightness as an inline opacity. While the
       twinkle runs, the animation's opacity out-cascades this and nothing about
       the shipped look changes; when reduced motion stops the animation, this is
       the frame it holds. The hero primitive composes its frozen frame the same
       way (js/hero-sky.js emits opacity:(lo+hi)/2 per star). */
    var mid = function (lo, hi) { return ((+lo + +hi) / 2).toFixed(3); };

    /* Anchor stars (bright, 2-3px) */
    for (var i = 0; i < (isTreatmentA ? 6 : 24); i++) {
      var x = (Math.random() * 100).toFixed(2);
      var y = (Math.random() * 100).toFixed(2);
      var dur = (2 + Math.random() * 3).toFixed(1);
      var del = (Math.random() * 4).toFixed(1);
      starHtml += '<div style="position:absolute;border-radius:50%;background:rgba(245,245,220,0.95);'
               + 'left:' + x + '%;top:' + y + '%;'
               + 'width:' + (2 + Math.random()).toFixed(1) + 'px;height:' + (2 + Math.random()).toFixed(1) + 'px;'
               + 'animation:wfTwinkle ' + dur + 's ease-in-out infinite ' + del + 's;'
               + 'opacity:' + mid(0.55, 0.95) + ';'
               + '--lo:0.55;--hi:0.95;"></div>';
    }

    /* Saffron signature star */
    starHtml += '<div style="position:absolute;border-radius:50%;background:rgba(232,175,56,0.80);'
             + 'left:38%;top:' + (isTreatmentA ? '30' : '20') + '%;'
             + 'width:2.5px;height:2.5px;'
             + 'animation:wfTwinkle 3.5s ease-in-out infinite 1.2s;'
             + 'opacity:' + mid(0.45, 0.85) + ';'
             + '--lo:0.45;--hi:0.85;"></div>';

    /* Medium stars */
    for (var j = 0; j < (isTreatmentA ? 15 : 65); j++) {
      var x2 = (Math.random() * 100).toFixed(2);
      var y2 = (Math.random() * 100).toFixed(2);
      var dur2 = (2.5 + Math.random() * 3.5).toFixed(1);
      var del2 = (Math.random() * 5).toFixed(1);
      var lo2 = (0.40 + Math.random() * 0.15).toFixed(2);
      var hi2 = (0.70 + Math.random() * 0.20).toFixed(2);
      starHtml += '<div style="position:absolute;border-radius:50%;background:rgba(245,245,220,0.70);'
               + 'left:' + x2 + '%;top:' + y2 + '%;'
               + 'width:1.5px;height:1.5px;'
               + 'animation:wfTwinkle ' + dur2 + 's ease-in-out infinite ' + del2 + 's;'
               + 'opacity:' + mid(lo2, hi2) + ';'
               + '--lo:' + lo2 + ';--hi:' + hi2 + ';"></div>';
    }

    /* Soft stars */
    for (var k = 0; k < (isTreatmentA ? 30 : 200); k++) {
      var x3 = (Math.random() * 100).toFixed(2);
      var y3 = (Math.random() * 100).toFixed(2);
      var dur3 = (3 + Math.random() * 4).toFixed(1);
      var del3 = (Math.random() * 5).toFixed(1);
      var lo3 = (0.22 + Math.random() * 0.12).toFixed(2);
      var hi3 = (0.50 + Math.random() * 0.20).toFixed(2);
      starHtml += '<div style="position:absolute;border-radius:50%;background:rgba(245,245,220,0.65);'
               + 'left:' + x3 + '%;top:' + y3 + '%;'
               + 'width:1px;height:1px;'
               + 'animation:wfTwinkle ' + dur3 + 's ease-in-out infinite ' + del3 + 's;'
               + 'opacity:' + mid(lo3, hi3) + ';'
               + '--lo:' + lo3 + ';--hi:' + hi3 + ';"></div>';
    }

    starContainer.innerHTML = starHtml;
  }

  /* ── Atmosphere ─────────────────────────────────────────────────────────
     The twelve blurred ellipses the hero sky has and this footer did not:
     2 colour-drift washes, 4 nebular lobes, 4 nebulae, 2 wisps. Geometry and
     opacity are the set that was measured in the SKY/FOOTER recon, at 0.45x
     the hero's emitted opacity. Inserted as the footer's first child so it
     paints beneath .wf-stars, which sits at the same z-index:0.

     NOT ON THE HOMEPAGE. Measured: the homepage already carries 153 elements
     with a computed CSS filter (the orbital illustration's 124 glow filters
     plus the hero and window skies' own atmospheres); every other page
     carries zero. The marginal blur is the cost, so the same twelve elements
     that are free elsewhere cost the homepage tens of ms per frame. The gate
     is [data-orb-sky], which index.html is the only page to mount, and which
     is parsed well before this script runs (index.html:2353 against :2763).

     Kept out of the built HTML the same way the star field is: the build's
     DOM stub (scripts/render-components.js) returns null from querySelector,
     so this block does not run at build time. It is decorative and
     aria-hidden, so nothing a crawler needs is in here. */
  var footerEl = el.querySelector('#wizkoo-footer');
  var isHomepage = !!document.querySelector('[data-orb-sky]');
  if (footerEl && !isHomepage) {
    var A = 0.45;                                  /* ratified reduction */
    var I = { colorDrift: 60, nebulosity: 64, wisps: 32 };   /* hero FIELD.atmosphere */
    var atmo = document.createElement('div');
    atmo.className = 'wf-atmo';
    atmo.setAttribute('aria-hidden', 'true');

    var puff = function (cls, css, o, durS, delS, driftX) {
      var s = document.createElement('span');
      s.className = cls;
      s.setAttribute('style', css
        + 'opacity:' + o.toFixed(4) + ';'
        + '--o:' + o.toFixed(4) + ';'
        + (driftX ? '--dx:' + driftX + '%;' : '')
        + 'animation-duration:' + durS + 's;animation-delay:' + delS + 's;');
      atmo.appendChild(s);
    };
    var box = function (l, t, w, h, rot) {
      return 'left:' + l + '%;top:' + t + '%;width:' + w + '%;height:' + h + '%;'
           + (rot === null ? '' : 'transform:rotate(' + rot + 'deg);');
    };
    var ell = function (color) {
      return 'background:radial-gradient(ellipse at center, ' + color + ' 0%, transparent 70%);';
    };

    /* 2 colour-drift washes */
    [[-10, 8, 62, 96, '#52304A', 0.36, 120, 0],
     [ 62, 2, 58, 100, '#1E4A55', 0.30, 130, 30]].forEach(function (w) {
      puff('wf-atmo-wash', box(w[0], w[1], w[2], w[3], null) + ell(w[4]),
           (w[5] * I.colorDrift / 100) * A, w[6], w[7], 4);
    });

    /* 4 nebular lobes */
    var LOBE = ['#4A2A4E', '#3A2E5E', '#1E4A55'];
    for (var n = 0; n < 4; n++) {
      puff('wf-atmo-lobe',
           box(n % 2 ? 60 + n * 6 : 4 + n * 5, 6 + n * 20, 38 + n * 4, 24 + n * 3, (n - 2) * 12)
             + ell(LOBE[n % 3]),
           (0.34 * I.nebulosity / 100) * A, 26 + n * 4, n * 3, 0);
    }

    /* 4 nebulae */
    var NEB = ['#1E3060', '#24406F', '#182F58'];
    for (var b = 0; b < 4; b++) {
      puff('wf-atmo-nebula',
           box(b % 2 ? 60 : 2, 4 + b * 18, 46, 30, (b - 2) * 10) + ell(NEB[b % 3]),
           0.12 * A, 20 + b * 4, b * 2, 0);
    }

    /* 2 wisps — background comes from the .wf-atmo-wisp rule */
    for (var p = 0; p < 2; p++) {
      puff('wf-atmo-wisp', box(p ? 50 : 6, p ? 70 : 16, 48, 8, p ? 8 : -8),
           (0.21 * I.wisps / 100) * A, 140 + p * 20, p * 20, 4);
    }

    footerEl.insertBefore(atmo, footerEl.firstChild);
  }

  /* ── Sun parallax (Treatment A only) ───────────────────────────────── */
  if (treatment === 'a') {
    var sunEl = el.querySelector('.wf-sky');
    var footer = el.querySelector('#wizkoo-footer') || el.firstElementChild;
    if (sunEl && footer) {
      function updateSun() {
        var rect = footer.getBoundingClientRect();
        var vh = window.innerHeight;
        /* progress: 0 = footer top at bottom of viewport, 1 = footer top at top of viewport */
        var progress = Math.max(0, Math.min(1, (vh - rect.top) / vh));
        /* Sun travels 120px downward as footer scrolls into view */
        sunEl.style.transform = 'translateY(' + (progress * 120).toFixed(1) + 'px)';
      }
      window.addEventListener('scroll', updateSun, { passive: true });
      updateSun();
    }
  }

})();
