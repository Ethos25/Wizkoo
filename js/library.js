/**
 * Wizkoo Library — /library page
 *
 * Architecture:
 *   1. Fetch all books + 35 meta themes in parallel on load.
 *   2. Landing state: 4 age-band cards with live book counts.
 *   3. On band click: show top 6 meta themes for that band,
 *      up to 4 books per theme, "See all N →" per theme if more exist.
 *   4. Books that don't match any of the 35 meta themes are collected
 *      into an "Other" bucket shown last.
 */
(function () {
  'use strict';

  /* ── Constants ───────────────────────────────────────────────────────────── */
  var COVER_PLACEHOLDER_SVG = '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="4" width="32" height="40" rx="2" stroke="white" stroke-width="1.5" stroke-opacity="0.3"/><line x1="13" y1="18" x2="35" y2="18" stroke="white" stroke-width="1.5" stroke-opacity="0.2"/><line x1="13" y1="24" x2="35" y2="24" stroke="white" stroke-width="1.5" stroke-opacity="0.2"/><line x1="13" y1="30" x2="28" y2="30" stroke="white" stroke-width="1.5" stroke-opacity="0.2"/><circle cx="24" cy="10" r="2" fill="#E8AF38" fill-opacity="0.4"/></svg>';

  // Locked Age Architecture — Phase 6. band IDs must match library_age_bands values in Supabase.
  var BANDS = [
    { id: '3-4',   name: 'Wonderer',   label: 'Ages 3-4',   role: 'Read Side by Side' },
    { id: '5-6',   name: 'Apprentice', label: 'Ages 5-6',   role: 'Read and Wonder' },
    { id: '7-9',   name: 'Artisan',    label: 'Ages 7-9',   role: 'Read and Discuss' },
    { id: '10-12', name: 'Scholar',    label: 'Ages 10-12', role: 'Read and Explore' },
  ];

  var THEMES_PER_BAND  = 6;   // max theme clusters shown per band
  var BOOKS_PER_THEME  = 4;   // max cards shown inside each cluster

  /* ── State ───────────────────────────────────────────────────────────────── */
  var state = {
    allBooks:     [],   // all active library_books, normalised
    metaThemes:   [],   // [{theme, theme_label}] — the 35 canonical themes
    selectedBand: null, // currently expanded band id, or null
    pdfBand:      null,
  };

  /* ── Boot ────────────────────────────────────────────────────────────────── */
  var supabaseUrl = window.WIZKOO_SUPABASE_URL     || '';
  var supabaseKey = window.WIZKOO_SUPABASE_ANON_KEY || '';
  var client      = null;
  var isConfigured = supabaseUrl && !supabaseUrl.includes('YOUR_PROJECT');

  document.addEventListener('DOMContentLoaded', function () {
    bindAgeCards();
    bindModal();

    if (isConfigured) {
      client = supabase.createClient(supabaseUrl, supabaseKey);
      loadData();
    } else {
      showUnconfigured();
    }
  });

  /* ── Data loading ────────────────────────────────────────────────────────── */
  function loadData() {
    Promise.all([
      // 1. The 35 canonical meta themes
      client
        .from('library_theme_meta')
        .select('theme, theme_label')
        .order('theme_label'),

      // 2. All active, browse-visible books with junction data needed for grouping + PDF.
      //    browse_visible=false books are filtered here — they remain queryable by the
      //    plan-generator backend but do not appear in /library browse.
      client
        .from('library_books')
        .select([
          'id, slug, title, author, hook, orbital_score, heads_up',
          'cover_image_url, cover_quality, book_format, reading_level',
          'library_age_bands(age_band)',
          'library_themes(theme)',
          'library_standards(standard_code, standard_type)',
        ].join(', '))
        .eq('status', 'active')
        .eq('browse_visible', true)
        .order('orbital_score', { ascending: false }),
    ]).then(function (results) {
      var themesResult = results[0];
      var booksResult  = results[1];

      if (themesResult.error) {
        console.warn('library_theme_meta fetch error:', themesResult.error.message);
      }
      if (booksResult.error) {
        showError(booksResult.error.message);
        return;
      }

      state.metaThemes = themesResult.data || [];
      // Path A (Phase 6B defect fix): books with no cover_image_url are excluded from /library
      // browse at the JS layer. They remain active in the database and are queryable by the
      // plan-generator. Restore to browse once cover art is sourced and the field is populated.
      state.allBooks   = (booksResult.data || []).map(normalizeBook)
        .filter(function (b) { return !!b.cover_image_url; });

      updateBandCounts();
      renderFeaturedCluster();
    });
  }

  function normalizeBook(b) {
    b.age_bands = (b.library_age_bands  || []).map(function (r) { return r.age_band; });
    b.themes    = (b.library_themes     || []).map(function (r) { return r.theme; });
    b.standards = (b.library_standards  || []);
    return b;
  }

  /* ── Band count badges ───────────────────────────────────────────────────── */
  function updateBandCounts() {
    BANDS.forEach(function (band) {
      var n = state.allBooks.filter(function (b) {
        return b.age_bands.indexOf(band.id) !== -1;
      }).length;
      var el = document.querySelector('[data-band-count="' + band.id + '"]');
      if (el) el.textContent = n + (n === 1 ? ' book' : ' books');
    });
  }

  /* ── Age card bindings ───────────────────────────────────────────────────── */
  function bindAgeCards() {
    document.querySelectorAll('.age-band-card').forEach(function (card) {
      card.addEventListener('click', function () {
        var band = card.dataset.band;

        // Deactivate all cards first
        document.querySelectorAll('.age-band-card').forEach(function (c) {
          c.classList.remove('active');
          c.setAttribute('aria-pressed', 'false');
        });

        if (state.selectedBand === band) {
          // Second click on same band → collapse back to initial state
          state.selectedBand = null;
          showInitialState();
        } else {
          state.selectedBand = band;
          card.classList.add('active');
          card.setAttribute('aria-pressed', 'true');

          if (!isConfigured) {
            showUnconfigured();
          } else if (state.allBooks.length > 0) {
            renderBandView(band);
          } else {
            showLoading();
            // Books might still be loading; retry once they arrive
            var waitInterval = setInterval(function () {
              if (state.allBooks.length > 0) {
                clearInterval(waitInterval);
                if (state.selectedBand === band) renderBandView(band);
              }
            }, 200);
          }
        }
      });
    });
  }

  /* ── Band view renderer ──────────────────────────────────────────────────── */
  function renderBandView(bandId) {
    var container = document.getElementById('lib-books-container');
    if (!container) return;

    var bandConfig = BANDS.find(function (b) { return b.id === bandId; });

    // All books for this band, already sorted by orbital_score desc
    var bandBooks = state.allBooks.filter(function (b) {
      return b.age_bands.indexOf(bandId) !== -1;
    });

    if (bandBooks.length === 0) {
      container.innerHTML = '<div class="lib-state">' +
        '<div class="lib-state-label">No books yet</div>' +
        '<p class="lib-state-msg">No books found for this age band.</p></div>';
      return;
    }

    // Build lookup: meta theme slug → display label
    var metaLabelBySlug = {};
    state.metaThemes.forEach(function (mt) {
      metaLabelBySlug[mt.theme] = mt.theme_label;
    });

    // Group books by meta theme (a book can appear in multiple theme buckets)
    var byTheme = {};
    bandBooks.forEach(function (book) {
      book.themes.forEach(function (t) {
        if (!metaLabelBySlug[t]) return;  // skip non-meta tags
        if (!byTheme[t]) byTheme[t] = [];
        if (!byTheme[t].find(function (b) { return b.id === book.id; })) {
          byTheme[t].push(book);
        }
      });
    });

    // Sort themes by book count desc
    var themeEntries = Object.keys(byTheme).map(function (slug) {
      return {
        slug:  slug,
        label: metaLabelBySlug[slug],
        books: byTheme[slug],
      };
    }).sort(function (a, b) {
      return b.books.length - a.books.length;
    });

    // Deduplicate: each book appears in at most one theme cluster (its highest-count theme)
    var placedIds = {};
    themeEntries.forEach(function (te) {
      te.books = te.books.filter(function (b) {
        if (placedIds[b.id]) return false;
        placedIds[b.id] = true;
        return true;
      });
    });
    // Drop clusters emptied by deduplication
    themeEntries = themeEntries.filter(function (te) { return te.books.length > 0; });

    var topThemes = themeEntries.slice(0, THEMES_PER_BAND);

    // Collect books not placed in any theme cluster → "Other" bucket
    var otherBooks = bandBooks.filter(function (b) { return !placedIds[b.id]; });

    // ── Build HTML ───────────────────────────────────────────────────────────
    var html = '<div class="lib-band-view">';

    // Band heading + PDF trigger
    html += '<div class="lib-band-view-header">';
    html += '<div class="lib-band-view-title-row">';
    html += '<h2 class="lib-band-view-title">' + esc(bandConfig.name) +
      ' <span class="lib-band-view-age">(' + esc(bandConfig.label) + ')</span></h2>';
    html += '<span class="lib-band-view-role">' + esc(bandConfig.role) + '</span>';
    html += '</div>';
    html += '<button class="lib-band-pdf-btn" data-band="' + bandId + '">' +
      'Print this list for your library visit.</button>';
    html += '</div>'; // .lib-band-view-header

    // Artisan transitional copy — locked verbatim, Phase 6 P4.
    // Addresses parents of 7-year-olds mid-transition between side-by-side and independent reading.
    if (bandId === '7-9') {
      html += '<p class="lib-artisan-note">Some kids at this age pick up a chapter book and ' +
        'disappear into it; others want you on the couch beside them. Both are reading.</p>';
    }

    var orbDiv = '<div class="lib-orbital-div" aria-hidden="true">' +
      '<div class="lib-orb-line"></div>' +
      '<div class="lib-orb-dot"></div>' +
      '<div class="lib-orb-line"></div>' +
      '</div>';

    if (topThemes.length === 0) {
      // No meta-theme overlap for this band — fallback: show books ungrouped
      html += renderThemeCluster('Books', null, bandBooks, bandId, null, bandConfig.label);
    } else {
      topThemes.forEach(function (te, i) {
        if (i > 0) html += orbDiv;
        html += renderThemeCluster(te.label, te.slug, te.books, bandId, te.books.length, bandConfig.label);
      });

      if (otherBooks.length > 0 && topThemes.length < THEMES_PER_BAND) {
        html += orbDiv;
        html += renderThemeCluster('More Books', null, otherBooks, bandId, null, bandConfig.label);
      }
    }

    html += '</div>'; // .lib-band-view

    container.innerHTML = html;

    // Bind PDF buttons
    container.querySelectorAll('.lib-band-pdf-btn').forEach(function (btn) {
      btn.addEventListener('click', function () { openModal(btn.dataset.band); });
    });

    setupLazyImages(container);
  }

  /* ── Featured cluster (placeholder) ─────────────────────────────────────── */
  // TODO: P3 featured cluster JSON config gates on re-scoring sweep.
  // Replace with editorial selection post-sweep.
  // Current behavior: picks the highest orbital_score book from each of
  // Apprentice (5-6), Artisan (7-9), Scholar (10-12).
  //
  // Constraint: Featured cluster must show three distinct books across Apprentice, Artisan,
  // and Scholar slots. Books carrying multiple band tags are picked in only one slot based
  // on the order: Apprentice → Artisan → Scholar. Each subsequent slot skips any book
  // already picked by a higher-priority slot.
  function renderFeaturedCluster() {
    var container = document.getElementById('lib-featured-cluster');
    if (!container || !state.allBooks.length) return;

    // Band-Name Pairing Rule (locked April 29, 2026): band name must always appear with age range
    // on public-facing surfaces. lib-featured-group-name is a public surface; pair format required.
    var featureBands = [
      { id: '5-6',   name: 'Apprentice', label: 'Ages 5-6' },
      { id: '7-9',   name: 'Artisan',    label: 'Ages 7-9' },
      { id: '10-12', name: 'Scholar',    label: 'Ages 10-12' },
    ];

    // Track picked book IDs so multi-band books only appear in one slot.
    // Apprentice picks first, then Artisan, then Scholar — each falls through
    // to its next-highest candidate if its top pick is already taken.
    //
    // cover_quality gate: only books marked cover_quality='featured' are eligible.
    // If a band has no featured-quality books, that slot is omitted entirely —
    // better to render two high-quality cards than three with one degraded cover.
    var pickedIds = {};
    var picks = [];
    featureBands.forEach(function (fb) {
      // allBooks already sorted desc by orbital_score — first unpicked featured match is the best
      var match = state.allBooks.find(function (b) {
        return b.age_bands.indexOf(fb.id) !== -1 &&
               b.cover_quality === 'featured' &&
               !pickedIds[b.id];
      });
      if (match) {
        pickedIds[match.id] = true;
        picks.push({ book: match, bandName: fb.name, bandLabel: fb.label });
      }
    });

    if (picks.length === 0) {
      // Empty featured state — curator quote + notification CTA
      container.innerHTML =
        '<div class="lib-featured-empty">' +
          '<p class="lib-featured-empty-eyebrow">From the Curator</p>' +
          '<p class="lib-featured-empty-quote">"I&rsquo;m rereading the next three picks this week. New featured books up Friday."</p>' +
          '<p class="lib-featured-empty-sig">— Amy, founder &amp; reader-in-chief</p>' +
          '<div class="lib-mcta lib-featured-mcta">' +
            '<div class="lib-mcta-primary-wrap">' +
              '<a href="/notify" class="lib-mcta-primary">GET NOTIFIED</a>' +
            '</div>' +
            '<a href="/how-it-works" class="lib-mcta-secondary">WHAT GETS PICKED</a>' +
          '</div>' +
        '</div>';
      return;
    }

    var html = '<div class="lib-featured-inner">' +
      '<div class="lib-featured-header">' +
        '<p class="lib-featured-eyebrow">This Week&rsquo;s Picks</p>' +
        '<p class="lib-featured-subtitle">Three books I keep handing to parents.</p>' +
      '</div>' +
      '<div class="lib-featured-grid">';

    picks.forEach(function (p) {
      var b = p.book;
      var coverHtml = b.cover_image_url
        ? '<img data-src="' + esc(b.cover_image_url) + '" alt="Cover of ' + esc(b.title) + '" loading="lazy">'
        : '<div class="book-card-cover-placeholder">' + COVER_PLACEHOLDER_SVG +
          '<span class="book-card-cover-placeholder-text">No cover</span></div>';
      var osSuffix = b.orbital_score ? ' · OS·' + b.orbital_score : '';

      html += '<div class="lib-featured-group">' +
        '<a href="/library/' + esc(b.slug) + '" class="lib-featured-card">' +
          '<div class="lib-featured-cover">' +
            coverHtml +
          '</div>' +
          '<div class="lib-featured-card-body">' +
            '<div class="lib-featured-pill">' + esc(p.bandName) + ' · ' + esc(p.bandLabel) + osSuffix + '</div>' +
            '<p class="lib-featured-title">' + esc(b.title) + '</p>' +
            '<p class="lib-featured-author">by ' + esc(b.author) + '</p>' +
            (b.hook ? '<p class="lib-featured-hook">&ldquo;' + esc(b.hook) + '&rdquo;</p>' : '') +
          '</div>' +
        '</a>' +
        '</div>';
    });

    html += '</div></div>';
    container.innerHTML = html;
    setupLazyImages(container);
  }

  /* Renders a single theme cluster with up to BOOKS_PER_THEME cards */
  function renderThemeCluster(label, slug, books, bandId, totalCount, bandLabel) {
    var toShow  = books.slice(0, BOOKS_PER_THEME);
    var hasMore = totalCount !== null && totalCount > BOOKS_PER_THEME;

    var html = '<div class="lib-theme-cluster">';
    html += '<div class="lib-theme-header">';
    if (bandLabel) {
      html += '<span class="lib-theme-eyebrow">' + esc(bandLabel) + '</span>';
    }
    html += '<div class="lib-theme-header-row">';
    html += '<h3 class="lib-theme-title">' + esc(label) + '</h3>';
    if (hasMore && slug) {
      html += '<a href="/library?band=' + esc(bandId) + '&theme=' + esc(slug) +
        '" class="lib-theme-see-all">See all ' + totalCount + ' →</a>';
    }
    html += '</div>';
    html += '<div class="lib-theme-rule"></div>';
    html += '</div>'; // .lib-theme-header
    html += '<div class="book-grid">';
    toShow.forEach(function (book) { html += renderBookCard(book); });
    html += '</div>';
    html += '</div>'; // .lib-theme-cluster
    return html;
  }

  /* ── Orbital Score primitive ─────────────────────────────────────────────── */
  /* ≤32px → numeric badge (square, saffron border, navy fill)                 */
  /* >32px → concentric rings (title-scale expression)                         */
  function renderOSSvg(score, size) {
    size = size || 16;
    return size <= 32 ? renderOSBadge(score, size) : renderOSRings(score, size);
  }

  function renderOSBadge(score, size) {
    var fs = size <= 20 ? 9 : 11;
    var half = size / 2;
    return '<svg width="' + size + '" height="' + size +
      '" viewBox="0 0 ' + size + ' ' + size + '" aria-hidden="true">' +
      '<rect x="1" y="1" width="' + (size - 2) + '" height="' + (size - 2) +
        '" fill="#0c1430" stroke="#e6a82e" stroke-width="2"/>' +
      '<text x="' + half + '" y="' + half + '" text-anchor="middle"' +
        ' dominant-baseline="central"' +
        ' font-family="\'Space Mono\', monospace" font-size="' + fs + '"' +
        ' fill="#e6a82e">' + score + '</text>' +
      '</svg>';
  }

  function renderOSRings(score, size) {
    var rings = [];
    var spacing = size * 0.22;
    var outerR  = (size / 2) - 1;
    for (var i = 0; i < score; i++) {
      var r = outerR - i * spacing;
      if (r <= 1) break;
      var stroke = i === 0 ? '#e6a82e' : 'rgba(236,229,211,0.55)';
      rings.push('<circle cx="' + (size / 2) + '" cy="' + (size / 2) + '" r="' + r.toFixed(1) +
        '" fill="none" stroke="' + stroke + '" stroke-width="1.5"/>');
    }
    return '<svg width="' + size + '" height="' + size +
      '" viewBox="0 0 ' + size + ' ' + size +
      '" aria-hidden="true">' + rings.join('') + '</svg>';
  }

  /* ── Book card ───────────────────────────────────────────────────────────── */
  function renderBookCard(book) {
    var href = '/library/' + esc(book.slug);

    var coverHtml = book.cover_image_url
      ? '<img data-src="' + esc(book.cover_image_url) + '" alt="Cover of ' + esc(book.title) + '" loading="lazy">'
      : '<div class="book-card-cover-placeholder">' + COVER_PLACEHOLDER_SVG +
        '<span class="book-card-cover-placeholder-text">No cover</span></div>';

    var bandBadges = book.age_bands.map(function (ab) {
      return '<span class="book-badge band">Ages ' + esc(ab.replace('-', '–')) + '</span>';
    }).join('');

    var formatBadge = book.book_format
      ? '<span class="book-badge">' + esc(formatLabel(book.book_format)) + '</span>'
      : '';

    var osText = book.orbital_score
      ? '<span class="book-card-os-text">OS·' + book.orbital_score + '</span>'
      : '';

    return '<a href="' + href + '" class="book-card" ' +
      'aria-label="' + esc(book.title) + ' by ' + esc(book.author) + '">' +
      '<div class="book-card-cover">' + coverHtml + '</div>' +
      '<div class="book-card-body">' +
        '<div class="book-card-badges">' + bandBadges + formatBadge + osText + '</div>' +
        '<p class="book-card-title">' + esc(book.title) + '</p>' +
        '<p class="book-card-author">by ' + esc(book.author) + '</p>' +
      '</div>' +
    '</a>';
  }

  /* ── Lazy image setup ────────────────────────────────────────────────────── */
  function setupLazyImages(container) {
    function applyFallback(img) {
      // Path A (Phase 6B defect fix): if a cover URL is present but the image fails to load
      // (broken URL, 1×1 GIF from OpenLibrary, network error), hide the card from browse
      // rather than rendering a "No cover" placeholder. Consistent with the null-cover filter
      // applied at load time. Card is hidden — not removed — so DOM structure stays intact.
      var card = img.closest ? img.closest('.book-card') : null;
      if (card) {
        card.style.display = 'none';
      } else {
        var cover = img.parentNode;
        if (cover) {
          cover.innerHTML = '<div class="book-card-cover-placeholder">' + COVER_PLACEHOLDER_SVG +
            '<span class="book-card-cover-placeholder-text">No cover</span></div>';
        }
      }
    }

    function loadImage(img) {
      img.addEventListener('error', function () { applyFallback(img); });
      img.addEventListener('load', function () {
        // OpenLibrary returns a 1×1 transparent GIF when no cover exists
        if (img.naturalWidth <= 1 || img.naturalHeight <= 1) {
          applyFallback(img);
        }
      });
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            loadImage(e.target);
            io.unobserve(e.target);
          }
        });
      }, { rootMargin: '200px' });
      container.querySelectorAll('img[data-src]').forEach(function (img) { io.observe(img); });
    } else {
      container.querySelectorAll('img[data-src]').forEach(loadImage);
    }
  }

  /* ── PDF modal ───────────────────────────────────────────────────────────── */
  function bindModal() {
    var overlay  = document.getElementById('pdf-modal');
    var closeBtn = document.getElementById('modal-close');
    var form     = document.getElementById('pdf-form');
    if (!overlay) return;

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
    });

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var emailInput = document.getElementById('pdf-email');
        var email = emailInput ? emailInput.value.trim() : '';
        if (!email || !email.includes('@')) {
          if (emailInput) emailInput.focus();
          return;
        }
        handlePdfDownload(email);
      });
    }
  }

  function openModal(band) {
    state.pdfBand = band || null;
    var overlay     = document.getElementById('pdf-modal');
    var formView    = document.getElementById('modal-form-view');
    var successView = document.getElementById('modal-success-view');
    if (!overlay) return;
    if (formView)    formView.style.display = '';
    if (successView) successView.classList.remove('visible');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    var input = document.getElementById('pdf-email');
    if (input) setTimeout(function () { input.focus(); }, 50);
  }

  function closeModal() {
    var overlay = document.getElementById('pdf-modal');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
    state.pdfBand = null;
  }

  function handlePdfDownload(email) {
    var booksForPdf = state.allBooks.filter(function (b) {
      if (!state.pdfBand) return true;
      return b.age_bands.indexOf(state.pdfBand) !== -1;
    });

    generatePDF(booksForPdf, state.pdfBand);
    captureEmail(email, state.pdfBand);

    var formView    = document.getElementById('modal-form-view');
    var successView = document.getElementById('modal-success-view');
    if (formView)    formView.style.display = 'none';
    if (successView) successView.classList.add('visible');
    setTimeout(closeModal, 4000);
  }

  /* ── PDF generation ──────────────────────────────────────────────────────── */
  function generatePDF(books, band) {
    var jsPDF = window.jspdf ? window.jspdf.jsPDF : (window.jsPDF || null);
    if (!jsPDF) { window.print(); return; }

    var bandConfig = BANDS.find(function (b) { return b.id === band; });
    var bandLabel  = bandConfig
      ? bandConfig.name + ' (' + bandConfig.label + ') · ' + bandConfig.role
      : 'Full Collection';

    var doc      = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });
    var pageW    = doc.internal.pageSize.getWidth();
    var pageH    = doc.internal.pageSize.getHeight();
    var margin   = 20;
    var contentW = pageW - margin * 2;
    var y        = margin;

    // Header
    doc.setFillColor(12, 16, 32);
    doc.rect(0, 0, pageW, 28, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(240, 242, 248);
    doc.text('wizkoo', margin, 17);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(232, 175, 56);
    doc.text('BOOKS THAT ORBIT', pageW - margin, 17, { align: 'right' });

    y = 38;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(12, 16, 32);
    doc.text('The Library — ' + bandLabel, margin, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 110);
    doc.text('wizkoo.com/library  ·  Standards codes serve as ESA documentation.', margin, y);
    y += 10;
    doc.setDrawColor(224, 222, 214);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageW - margin, y);
    y += 8;

    books.forEach(function (book) {
      if (y > pageH - 40) { doc.addPage(); y = margin; }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(12, 16, 32);
      var titleLines = doc.splitTextToSize(book.title + '  ·  ' + book.author, contentW - 60);
      doc.text(titleLines, margin, y);

      if (book.standards && book.standards.length > 0) {
        var stdText = book.standards.slice(0, 3).map(function (s) { return s.standard_code; }).join('  ');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(160, 155, 165);
        doc.text(stdText, pageW - margin, y, { align: 'right' });
      }
      y += titleLines.length * 4.5;

      var meta = book.age_bands.map(function (ab) {
        return 'Ages ' + ab.replace('-', '–');
      }).join(', ') + '  ·  ' + capitalize((book.reading_level || '').replace('-', ' '));
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(100, 100, 110);
      doc.text(meta, margin, y);
      y += 5;

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.5);
      doc.setTextColor(80, 80, 90);
      var hookLines = doc.splitTextToSize(book.hook || '', contentW);
      doc.text(hookLines, margin, y);
      y += hookLines.length * 4 + 2;

      doc.setDrawColor(235, 233, 228);
      doc.setLineWidth(0.2);
      doc.line(margin, y, pageW - margin, y);
      y += 6;
    });

    var totalPages = doc.internal.getNumberOfPages();
    for (var p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(180, 175, 185);
      doc.text('wizkoo.com/library  ·  Generated ' + new Date().toLocaleDateString(), margin, pageH - 8);
      doc.text('Page ' + p + ' of ' + totalPages, pageW - margin, pageH - 8, { align: 'right' });
    }

    doc.save('wizkoo-library' + (band ? '-ages-' + band : '') + '.pdf');
  }

  /* ── Email capture ───────────────────────────────────────────────────────── */
  function captureEmail(email, band) {
    var formData = new FormData();
    formData.append('form-name', 'library-pdf-download');
    formData.append('email', email);
    formData.append('age_band', band || 'all');
    fetch('/', { method: 'POST', body: formData }).catch(function () {});
  }

  /* ── UI states ───────────────────────────────────────────────────────────── */
  function showInitialState() {
    var container = document.getElementById('lib-books-container');
    if (!container) return;
    container.innerHTML =
      '<div class="lib-state" id="lib-initial-state">' +
        '<div class="lib-state-label">The Library</div>' +
        '<p class="lib-state-msg">Books organized by the themes your family explores.</p>' +
        '<p class="lib-state-sub">Select an age band above to browse the collection.</p>' +
      '</div>';
  }

  function showLoading() {
    var container = document.getElementById('lib-books-container');
    if (!container) return;
    var html = '<div class="lib-skeleton-grid">';
    for (var i = 0; i < 6; i++) {
      html += '<div class="lib-skeleton-card">' +
        '<div class="lib-skeleton-cover"></div>' +
        '<div class="lib-skeleton-body">' +
          '<div class="lib-skeleton-line short"></div>' +
          '<div class="lib-skeleton-line med"></div>' +
          '<div class="lib-skeleton-line"></div>' +
          '<div class="lib-skeleton-line short"></div>' +
        '</div></div>';
    }
    container.innerHTML = html + '</div>';
  }

  function showUnconfigured() {
    var container = document.getElementById('lib-books-container');
    if (!container) return;
    container.innerHTML =
      '<div class="lib-state">' +
        '<div class="lib-state-label">Setup Required</div>' +
        '<p class="lib-state-msg">Connect Supabase to load The Library.</p>' +
        '<p class="lib-state-sub">Add your Supabase URL and anon key to ' +
        '<code>js/supabase-config.js</code>.</p>' +
      '</div>';
  }

  function showError(msg) {
    var container = document.getElementById('lib-books-container');
    if (!container) return;
    container.innerHTML =
      '<div class="lib-state">' +
        '<div class="lib-state-label">Error</div>' +
        '<p class="lib-state-msg">Could not load The Library.</p>' +
        '<p class="lib-state-sub">' + esc(msg) + '</p>' +
      '</div>';
  }

  /* ── Helpers ─────────────────────────────────────────────────────────────── */
  function esc(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function formatLabel(fmt) {
    var map = {
      'board-book':    'Board Book',
      'picture-book':  'Picture Book',
      'early-reader':  'Early Reader',
      'chapter-book':  'Chapter Book',
      'nonfiction':    'Nonfiction',
      'graphic-novel': 'Graphic Novel',
      'poetry':        'Poetry',
    };
    return map[fmt] || fmt;
  }

})();
