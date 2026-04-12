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

  var BANDS = [
    { id: '2-4',   label: 'Ages 2–4',   role: 'Read Together' },
    { id: '5-7',   label: 'Ages 5–7',   role: 'Read Side by Side' },
    { id: '8-10',  label: 'Ages 8–10',  role: 'Read and Discuss' },
    { id: '10-12', label: 'Ages 10–12', role: 'Read and Explore' },
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

      // 2. All active books with junction data needed for grouping + PDF
      client
        .from('library_books')
        .select([
          'id, slug, title, author, hook, orbital_score',
          'cover_image_url, book_format, reading_level',
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
      state.allBooks   = (booksResult.data || []).map(normalizeBook);

      updateBandCounts();
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
    html += '<h2 class="lib-band-view-title">' + esc(bandConfig.label) + '</h2>';
    html += '<span class="lib-band-view-role">' + esc(bandConfig.role) + '</span>';
    html += '</div>';
    html += '<button class="lib-band-pdf-btn" data-band="' + bandId + '">' +
      'Print this list for your library visit.</button>';
    html += '</div>'; // .lib-band-view-header

    if (topThemes.length === 0) {
      // No meta-theme overlap for this band — fallback: show books ungrouped
      html += renderThemeCluster('Books', null, bandBooks, bandId, null);
    } else {
      topThemes.forEach(function (te) {
        html += renderThemeCluster(te.label, te.slug, te.books, bandId, te.books.length);
      });

      if (otherBooks.length > 0 && topThemes.length < THEMES_PER_BAND) {
        html += renderThemeCluster('More Books', null, otherBooks, bandId, null);
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

  /* Renders a single theme cluster with up to BOOKS_PER_THEME cards */
  function renderThemeCluster(label, slug, books, bandId, totalCount) {
    var toShow  = books.slice(0, BOOKS_PER_THEME);
    var hasMore = totalCount !== null && totalCount > BOOKS_PER_THEME;

    var html = '<div class="lib-theme-cluster">';
    html += '<div class="lib-theme-header">';
    html += '<span class="lib-theme-label">' + esc(label) + '</span>';
    if (hasMore && slug) {
      html += '<a href="/library?band=' + esc(bandId) + '&theme=' + esc(slug) +
        '" class="lib-theme-see-all">See all ' + totalCount + ' →</a>';
    }
    html += '</div>';
    html += '<div class="book-grid">';
    toShow.forEach(function (book) { html += renderBookCard(book); });
    html += '</div>';
    html += '</div>';
    return html;
  }

  /* ── Book card ───────────────────────────────────────────────────────────── */
  function renderBookCard(book) {
    var href = '/library/' + esc(book.slug);

    var coverHtml = book.cover_image_url
      ? '<img data-src="' + esc(book.cover_image_url) + '" alt="Cover of ' + esc(book.title) + '" loading="lazy">'
      : '<div class="book-card-cover-placeholder">' + COVER_PLACEHOLDER_SVG +
        '<span class="book-card-cover-placeholder-text">No cover</span></div>';

    var orbitalDots = '';
    for (var i = 1; i <= 5; i++) {
      orbitalDots += '<span class="orbital-dot' + (i > book.orbital_score ? ' empty' : '') +
        '" aria-hidden="true"></span>';
    }

    var bandBadges = book.age_bands.map(function (ab) {
      return '<span class="book-badge band">Ages ' + esc(ab.replace('-', '–')) + '</span>';
    }).join('');

    var formatBadge = book.book_format
      ? '<span class="book-badge">' + esc(formatLabel(book.book_format)) + '</span>'
      : '';

    return '<a href="' + href + '" class="book-card" ' +
      'aria-label="' + esc(book.title) + ' by ' + esc(book.author) + '">' +
      '<div class="book-card-cover">' + coverHtml + '</div>' +
      '<div class="book-card-body">' +
        '<div class="book-card-orbital" aria-label="Orbital score: ' + book.orbital_score + ' out of 5">' +
          orbitalDots +
        '</div>' +
        '<p class="book-card-title">' + esc(book.title) + '</p>' +
        '<p class="book-card-author">by ' + esc(book.author) + '</p>' +
        '<p class="book-card-hook">' + esc(book.hook) + '</p>' +
        '<div class="book-card-badges">' + bandBadges + formatBadge + '</div>' +
      '</div>' +
    '</a>';
  }

  /* ── Lazy image setup ────────────────────────────────────────────────────── */
  function setupLazyImages(container) {
    function applyFallback(img) {
      var cover = img.parentNode;
      if (cover) {
        cover.innerHTML = '<div class="book-card-cover-placeholder">' + COVER_PLACEHOLDER_SVG +
          '<span class="book-card-cover-placeholder-text">No cover</span></div>';
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
    var bandLabel  = bandConfig ? bandConfig.label + ' — ' + bandConfig.role : 'Full Collection';

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
