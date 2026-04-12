/**
 * Wizkoo Library — /library/[slug] book detail page
 * Reads slug from window.location.pathname, fetches the book + related books
 * from Supabase, renders the full detail view, and injects Schema.org markup.
 */
(function () {
  'use strict';

  var COVER_PLACEHOLDER_SVG = '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="4" width="32" height="40" rx="2" stroke="white" stroke-width="1.5" stroke-opacity="0.3"/><line x1="13" y1="18" x2="35" y2="18" stroke="white" stroke-width="1.5" stroke-opacity="0.2"/><line x1="13" y1="24" x2="35" y2="24" stroke="white" stroke-width="1.5" stroke-opacity="0.2"/><line x1="13" y1="30" x2="28" y2="30" stroke="white" stroke-width="1.5" stroke-opacity="0.2"/><circle cx="24" cy="10" r="2" fill="#E8AF38" fill-opacity="0.4"/></svg>';

  var PARENT_ROLE_LABEL = {
    'read-together':    'Read Together',
    'read-side-by-side':'Read Side by Side',
    'read-and-discuss': 'Read and Discuss',
    'read-and-explore': 'Read and Explore',
  };

  var READING_LEVEL_LABEL = {
    'pre-reader':   'Pre-Reader',
    'early-reader': 'Early Reader',
    'independent':  'Independent Reader',
    'advanced':     'Advanced Reader',
  };

  var FORMAT_LABEL = {
    'board-book':   'Board Book',
    'picture-book': 'Picture Book',
    'early-reader': 'Early Reader Book',
    'chapter-book': 'Chapter Book',
    'nonfiction':   'Nonfiction',
    'graphic-novel':'Graphic Novel',
    'poetry':       'Poetry',
  };

  /* ── Boot ────────────────────────────────────────────────────────────────── */
  var supabaseUrl = window.WIZKOO_SUPABASE_URL || '';
  var supabaseKey = window.WIZKOO_SUPABASE_ANON_KEY || '';
  var isConfigured = supabaseUrl && !supabaseUrl.includes('YOUR_PROJECT');
  var client = null;

  // Extract slug from path: /library/the-very-hungry-caterpillar → the-very-hungry-caterpillar
  var slug = window.location.pathname
    .replace(/\/+$/, '')
    .split('/')
    .pop();

  document.addEventListener('DOMContentLoaded', function () {
    if (!slug) {
      showError('No book specified.');
      return;
    }
    if (!isConfigured) {
      showUnconfigured();
      return;
    }
    client = supabase.createClient(supabaseUrl, supabaseKey);
    fetchBook(slug);
  });

  /* ── Fetch ───────────────────────────────────────────────────────────────── */
  function fetchBook(slug) {
    client
      .from('library_books')
      .select([
        '*',
        'library_age_bands(age_band)',
        'library_themes(theme)',
        'library_subjects(subject)',
        'library_standards(standard_code, standard_type)',
        'library_diversity(tag)',
      ].join(', '))
      .eq('slug', slug)
      .eq('status', 'active')
      .single()
      .then(function (result) {
        if (result.error || !result.data) {
          showNotFound();
          return;
        }
        var book = normalizeBook(result.data);
        renderBook(book);
        injectMeta(book);
        injectSchema(book);
        fetchRelated(book);
      });
  }

  function fetchRelated(book) {
    if (!book.themes.length && !book.age_bands.length) return;

    // Find books sharing at least one theme AND one age band, excluding this book
    var themeQuery = book.themes.length > 0
      ? client.from('library_themes').select('book_id').in('theme', book.themes)
      : null;

    if (!themeQuery) {
      fetchRelatedByBand(book);
      return;
    }

    themeQuery.then(function (result) {
      if (result.error || !result.data || result.data.length === 0) {
        fetchRelatedByBand(book);
        return;
      }

      var ids = result.data
        .map(function (r) { return r.book_id; })
        .filter(function (id) { return id !== book.id; });

      if (ids.length === 0) {
        fetchRelatedByBand(book);
        return;
      }

      client
        .from('library_books')
        .select('id, slug, title, author, cover_image_url, library_age_bands(age_band)')
        .in('id', ids.slice(0, 20))
        .eq('status', 'active')
        .order('orbital_score', { ascending: false })
        .limit(6)
        .then(function (r2) {
          if (r2.error || !r2.data || r2.data.length === 0) return;
          renderRelated(r2.data, book.themes[0]);
        });
    });
  }

  function fetchRelatedByBand(book) {
    if (!book.age_bands.length) return;
    client
      .from('library_books')
      .select('id, slug, title, author, cover_image_url, library_age_bands(age_band)')
      .neq('id', book.id)
      .eq('status', 'active')
      .order('orbital_score', { ascending: false })
      .limit(6)
      .then(function (r) {
        if (r.error || !r.data || r.data.length === 0) return;
        var filtered = r.data.filter(function (b) {
          var bands = (b.library_age_bands || []).map(function (x) { return x.age_band; });
          return book.age_bands.some(function (ab) { return bands.indexOf(ab) !== -1; });
        });
        if (filtered.length > 0) renderRelated(filtered.slice(0, 6), null);
      });
  }

  function normalizeBook(b) {
    b.age_bands = (b.library_age_bands  || []).map(function (r) { return r.age_band; });
    b.themes    = (b.library_themes     || []).map(function (r) { return r.theme; });
    b.subjects  = (b.library_subjects   || []).map(function (r) { return r.subject; });
    b.standards = (b.library_standards  || []);
    b.diversity = (b.library_diversity  || []).map(function (r) { return r.tag; });
    return b;
  }

  /* ── Render ──────────────────────────────────────────────────────────────── */
  function renderBook(book) {
    var loading = document.getElementById('bk-loading');
    var container = document.getElementById('bk-content');
    if (!container) return;

    // Breadcrumb
    var bc = document.getElementById('bk-breadcrumb-title');
    if (bc) bc.textContent = book.title;

    // Cover
    var coverHtml = book.cover_image_url
      ? '<img src="' + esc(book.cover_image_url) + '" alt="Cover of ' + esc(book.title) + '">'
      : '<div class="bk-cover-placeholder">' + COVER_PLACEHOLDER_SVG + '</div>';

    // Links
    var linkHtml = '';
    if (book.library_link) {
      linkHtml += '<a href="' + esc(book.library_link) + '" class="bk-cover-link primary" ' +
        'target="_blank" rel="noopener noreferrer">' +
        '<span class="bk-cover-link-icon">📚</span>Find at your library</a>';
    }
    if (book.purchase_link) {
      linkHtml += '<a href="' + esc(book.purchase_link) + '" class="bk-cover-link" ' +
        'target="_blank" rel="noopener noreferrer">' +
        '<span class="bk-cover-link-icon">🛒</span>Buy from an independent bookstore</a>';
    }

    // Orbital score dots (with hover/tap tooltip)
    var orbitalDots = '<div class="bk-orbital-dots-wrap" role="button" tabindex="0" aria-label="Orbital score info">' +
      '<div class="bk-orbital-dots">';
    for (var i = 1; i <= 5; i++) {
      orbitalDots += '<span class="bk-orbital-dot' + (i > book.orbital_score ? ' empty' : '') + '"></span>';
    }
    orbitalDots += '</div>' +
      '<span class="bk-orbital-tooltip" role="tooltip">How many subjects this book connects in one read. Higher means more doors opened.</span>' +
      '</div>';

    // Age band + reading level badges (clickable, link back to filtered library)
    var metaBadges = book.age_bands.map(function (ab) {
      return '<a href="/library?band=' + esc(ab) + '" class="bk-badge saffron">Ages ' +
        esc(ab.replace('-', '–')) + '</a>';
    }).join('');

    if (book.reading_level) {
      metaBadges += '<span class="bk-badge">' +
        esc(READING_LEVEL_LABEL[book.reading_level] || book.reading_level) + '</span>';
    }
    if (book.book_format) {
      metaBadges += '<span class="bk-badge">' +
        esc(FORMAT_LABEL[book.book_format] || book.book_format) + '</span>';
    }
    if (book.parent_role) {
      metaBadges += '<span class="bk-badge">' +
        esc(PARENT_ROLE_LABEL[book.parent_role] || book.parent_role) + '</span>';
    }

    // Standards
    var stdHtml = '';
    if (book.standards.length > 0) {
      stdHtml = '<div class="bk-section">' +
        '<p class="bk-section-label">Standards</p>' +
        '<div class="bk-standards">' +
        book.standards.map(function (s) {
          return '<span class="bk-standard-pill" title="' + esc(s.standard_type) + '">' +
            esc(s.standard_code) + '</span>';
        }).join('') +
        '</div></div>';
    }

    // Talk about
    var talkHtml = '';
    if (book.talk_about && book.talk_about.length > 0) {
      talkHtml = '<div class="bk-section">' +
        '<p class="bk-section-label">Talk About</p>' +
        '<div class="bk-talk-about">' +
        book.talk_about.map(function (q) {
          return '<p class="bk-question">' + esc(q) + '</p>';
        }).join('') +
        '</div></div>';
    }

    // Heads up
    var headsUpHtml = '';
    if (book.heads_up) {
      headsUpHtml = '<div class="bk-heads-up">' +
        '<p class="bk-heads-up-label">Heads Up</p>' +
        '<p class="bk-heads-up-body">' + esc(book.heads_up) + '</p>' +
        '</div>';
    }

    // Theme tags
    var themeTagsHtml = '';
    if (book.themes.length > 0) {
      themeTagsHtml = '<div class="bk-section">' +
        '<p class="bk-section-label">Themes</p>' +
        '<div style="display:flex;flex-wrap:wrap;gap:6px;">' +
        book.themes.map(function (t) {
          return '<a href="/library?theme=' + esc(t) + '" class="bk-badge">' +
            esc(capitalize(t)) + '</a>';
        }).join('') +
        '</div></div>';
    }

    // Read aloud / page count
    var physicalMeta = '';
    var physParts = [];
    if (book.page_count) physParts.push(book.page_count + ' pages');
    if (book.read_aloud_minutes) physParts.push('~' + book.read_aloud_minutes + ' min read-aloud');
    if (physParts.length) {
      physicalMeta = '<p class="bk-section-label" style="margin-bottom:8px;">' +
        esc(physParts.join('  ·  ')) + '</p>';
    }

    var html = '<div class="bk-hero">' +
      '<div class="bk-hero-grid">' +
        // Left col
        '<div class="bk-cover-col">' +
          '<div class="bk-cover">' + coverHtml + '</div>' +
          (linkHtml ? '<div class="bk-cover-links">' + linkHtml + '</div>' : '') +
        '</div>' +
        // Right col
        '<div class="bk-content-col">' +
          '<div class="bk-meta-row">' + metaBadges + '</div>' +
          '<h1 class="bk-title">' + esc(book.title) + '</h1>' +
          '<p class="bk-author">by ' + esc(book.author) +
            (book.illustrator ? ' <span class="bk-illustrator">· Illustrated by ' + esc(book.illustrator) + '</span>' : '') +
          '</p>' +

          '<div class="bk-orbital-row">' +
            orbitalDots +
            '<span class="bk-orbital-label">Orbital score ' + book.orbital_score + '/5</span>' +
          '</div>' +

          '<p class="bk-hook">' + esc(book.hook) + '</p>' +

          '<div class="bk-section">' +
            '<p class="bk-section-label">What makes it orbital</p>' +
            '<p class="bk-section-body">' + esc(book.orbital_description) + '</p>' +
          '</div>' +

          '<div class="bk-section">' +
            '<p class="bk-section-label">Best For</p>' +
            '<p class="bk-section-body">' + esc(book.best_for) + '</p>' +
          '</div>' +

          physicalMeta +
          stdHtml +

          '<div class="bk-section">' +
            '<p class="bk-section-label">Pairs With</p>' +
            '<p class="bk-section-body">' + esc(book.pairs_with) + '</p>' +
          '</div>' +

          talkHtml +
          headsUpHtml +
          themeTagsHtml +
        '</div>' +
      '</div>' +
    '</div>';

    if (loading) loading.outerHTML = html;
    else container.innerHTML = html;

    // Mobile tap handler for orbital tooltip
    var orbitalWrap = document.querySelector('.bk-orbital-dots-wrap');
    if (orbitalWrap) {
      orbitalWrap.addEventListener('click', function (e) {
        orbitalWrap.classList.toggle('tooltip-open');
        e.stopPropagation();
      });
      orbitalWrap.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          orbitalWrap.classList.toggle('tooltip-open');
          e.preventDefault();
        }
      });
      document.addEventListener('click', function () {
        orbitalWrap.classList.remove('tooltip-open');
      });
    }
  }

  /* ── Related books carousel ──────────────────────────────────────────────── */
  function renderRelated(books, theme) {
    var container = document.getElementById('bk-more-container');
    if (!container || !books || books.length === 0) return;

    var label = theme ? 'More in ' + capitalize(theme) : 'More from The Library';

    var cardsHtml = books.map(function (b) {
      var bands = (b.library_age_bands || []).map(function (x) { return x.age_band; });
      var coverHtml = b.cover_image_url
        ? '<img src="' + esc(b.cover_image_url) + '" alt="Cover of ' + esc(b.title) + '" loading="lazy">'
        : COVER_PLACEHOLDER_SVG;

      return '<a href="/library/' + esc(b.slug) + '" class="bk-more-card">' +
        '<div class="bk-more-cover">' + coverHtml + '</div>' +
        '<div class="bk-more-body">' +
          '<p class="bk-more-title-text">' + esc(b.title) + '</p>' +
          '<p class="bk-more-author-text">by ' + esc(b.author) + '</p>' +
        '</div>' +
      '</a>';
    }).join('');

    container.innerHTML = '<section class="bk-more-section" aria-label="' + esc(label) + '">' +
      '<div class="bk-more-inner">' +
        '<p class="bk-more-label">Keep Reading</p>' +
        '<h2 class="bk-more-title">' + esc(label) + '</h2>' +
        '<div class="bk-more-grid">' + cardsHtml + '</div>' +
      '</div>' +
    '</section>';
  }

  /* ── Meta injection ──────────────────────────────────────────────────────── */
  function injectMeta(book) {
    document.title = book.title + ' by ' + book.author + ' | Wizkoo Library';

    setMeta('description', book.hook);
    setMeta('og:title',       book.title + ' | Wizkoo Library', true);
    setMeta('og:description', book.hook, true);
    setMeta('twitter:title',  book.title + ' | Wizkoo Library', true);
    setMeta('twitter:description', book.hook, true);

    var canonicalEl = document.getElementById('bk-canonical');
    if (canonicalEl) canonicalEl.setAttribute('href', 'https://wizkoo.com/library/' + book.slug);

    if (book.cover_image_url) {
      setMeta('og:image', book.cover_image_url, true);
      setMeta('twitter:image', book.cover_image_url, true);
    }
  }

  function setMeta(name, content, isProperty) {
    if (!content) return;
    var el = document.querySelector(
      isProperty ? '[property="' + name + '"]' : '[name="' + name + '"]'
    );
    if (el) el.setAttribute('content', content);
  }

  /* ── Schema.org Book markup ──────────────────────────────────────────────── */
  function injectSchema(book) {
    var schema = {
      '@context': 'https://schema.org',
      '@type': 'Book',
      'name': book.title,
      'author': { '@type': 'Person', 'name': book.author },
      'isbn': book.isbn || undefined,
      'publisher': book.publisher ? { '@type': 'Organization', 'name': book.publisher } : undefined,
      'datePublished': book.year_published ? String(book.year_published) : undefined,
      'image': book.cover_image_url || undefined,
      'audience': {
        '@type': 'EducationalAudience',
        'educationalRole': 'student'
      },
      'typicalAgeRange': book.age_bands.join(', ') || undefined,
      'description': book.orbital_description,
      'url': 'https://wizkoo.com/library/' + book.slug,
      'isPartOf': {
        '@type': 'ItemList',
        'name': 'Wizkoo Library',
        'url': 'https://wizkoo.com/library'
      }
    };

    if (book.standards && book.standards.length > 0) {
      schema.educationalAlignment = book.standards.map(function (s) {
        return {
          '@type': 'AlignmentObject',
          'alignmentType': 'teaches',
          'targetName': s.standard_code,
          'educationalFramework': s.standard_type === 'NGSS'
            ? 'Next Generation Science Standards'
            : 'Common Core State Standards'
        };
      });
    }

    if (book.subjects && book.subjects.length > 0) {
      schema.about = book.subjects;
    }

    if (book.illustrator) {
      schema.illustrator = { '@type': 'Person', 'name': book.illustrator };
    }

    // Remove undefined keys
    Object.keys(schema).forEach(function (k) {
      if (schema[k] === undefined) delete schema[k];
    });

    var el = document.getElementById('bk-schema');
    if (el) el.textContent = JSON.stringify(schema, null, 2);
  }

  /* ── Error states ────────────────────────────────────────────────────────── */
  function showNotFound() {
    var loading = document.getElementById('bk-loading');
    var html = '<div class="bk-hero">' +
      '<div style="padding: 80px 0; text-align:center;">' +
        '<div class="lib-state-label">404</div>' +
        '<p class="lib-state-msg">This book wasn\'t found in The Library.</p>' +
        '<p class="lib-state-sub"><a href="/library" style="color:var(--saffron)">Browse all books →</a></p>' +
      '</div></div>';
    if (loading) loading.outerHTML = html;
  }

  function showError(msg) {
    var loading = document.getElementById('bk-loading');
    var html = '<div class="bk-hero">' +
      '<div style="padding: 80px 0; text-align:center;">' +
        '<div class="lib-state-label">Error</div>' +
        '<p class="lib-state-msg">Could not load this book.</p>' +
        '<p class="lib-state-sub">' + esc(msg) + '</p>' +
      '</div></div>';
    if (loading) loading.outerHTML = html;
  }

  function showUnconfigured() {
    var loading = document.getElementById('bk-loading');
    var html = '<div class="bk-hero">' +
      '<div style="padding: 80px 0; text-align:center;">' +
        '<div class="lib-state-label">Setup Required</div>' +
        '<p class="lib-state-msg">Supabase is not yet connected.</p>' +
        '<p class="lib-state-sub">Add your credentials to <code>js/supabase-config.js</code></p>' +
      '</div></div>';
    if (loading) loading.outerHTML = html;
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

})();
