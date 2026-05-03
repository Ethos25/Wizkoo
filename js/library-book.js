/**
 * Wizkoo Library — /library/[slug] book detail page  Round 6.2
 * Direction 3: Pull-Quote Spread. Unified cream card surface.
 * TALK ABOUT is the editorial centerpiece with Nº-numbered containers.
 * Uses display_title for display; second-to-last word italic heuristic;
 * canonical curriculum domains from subjects; format-aware read-aloud calc.
 */
(function () {
  'use strict';

  /* ── Label maps ──────────────────────────────────────────────────────────── */
  var BAND_NAME = {
    '3-4':   'Wonderer',
    '5-6':   'Apprentice',
    '7-9':   'Artisan',
    '10-12': 'Scholar',
  };

  var PARENT_ROLE_LABEL = {
    'read-together':     { value: 'Read Together',  sub: 'best first read'  },
    'read-side-by-side': { value: 'Side by Side',   sub: 'then independent' },
    'read-and-discuss':  { value: 'Read & Discuss', sub: ''                 },
    'read-and-explore':  { value: 'Read & Explore', sub: ''                 },
    'independent':       { value: 'Independent',    sub: ''                 },
  };

  var FORMAT_LABEL = {
    'board-book':    'Board Book',
    'picture-book':  'Picture Book',
    'early-reader':  'Early Reader',
    'chapter-book':  'Chapter Book',
    'nonfiction':    'Nonfiction',
    'graphic-novel': 'Graphic Novel',
    'poetry':        'Poetry',
  };

  /* Curated-by slug → display name */
  var CURATED_BY_NAME = {
    'beth-holloway': 'Beth Holloway, Lead Curator',
  };

  /* ── Reading level display labels ───────────────────────────────────────── */
  var READING_LEVEL_LABEL = {
    'pre-reader':  'Pre-Reader',
    'early-reader': 'Early Reader',
    'independent': 'Independent Reader',
    'advanced':    'Advanced Reader',
  };

  /* ── Canonical curriculum domain map ────────────────────────────────────── */
  /* Maps DB subject slugs → one of the 8 canonical curriculum domains.       */
  /* Multiple slugs can map to the same domain (deduped in domainsFromSubjects). */
  var DOMAIN_MAP = {
    'language-arts':    'Language Arts',
    'math':             'Mathematics',
    'science':          'Science',
    'geography':        'Social Studies',
    'history':          'Social Studies',
    'social-emotional': 'Life Skills',
    'art':              'Creative Arts',
    'pe':               'PE & Health',
    'health':           'PE & Health',
    'world-languages':  'World Languages',
    'life-skills':      'Life Skills',
  };

  /* ── Boot ────────────────────────────────────────────────────────────────── */
  var supabaseUrl = window.WIZKOO_SUPABASE_URL || '';
  var supabaseKey = window.WIZKOO_SUPABASE_ANON_KEY || '';
  var isConfigured = supabaseUrl && !supabaseUrl.includes('YOUR_PROJECT');
  var client = null;

  var slug = window.location.pathname
    .replace(/\/+$/, '')
    .split('/')
    .pop();

  document.addEventListener('DOMContentLoaded', function () {
    if (!slug) { showError('No book specified.'); return; }
    if (!isConfigured) { showUnconfigured(); return; }
    client = supabase.createClient(supabaseUrl, supabaseKey);
    fetchBook(slug);
  });

  /* ── Fetch ───────────────────────────────────────────────────────────────── */
  function fetchBook(s) {
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
      .eq('slug', s)
      .eq('status', 'active')
      .single()
      .then(function (result) {
        if (result.error || !result.data) { showNotFound(); return; }
        var book = normalizeBook(result.data);
        renderBook(book);
        injectMeta(book);
        injectSchema(book);
        fetchRelated(book);
      });
  }

  /* ── Related books — same-theme fallback to same-band ───────────────────── */
  function fetchRelated(book) {
    if (!book.themes.length && !book.age_bands.length) return;
    var themeQuery = book.themes.length > 0
      ? client.from('library_themes').select('book_id').in('theme', book.themes)
      : null;
    if (!themeQuery) { fetchRelatedByBand(book); return; }
    themeQuery.then(function (result) {
      if (result.error || !result.data || result.data.length === 0) {
        fetchRelatedByBand(book); return;
      }
      var ids = result.data
        .map(function (r) { return r.book_id; })
        .filter(function (id) { return id !== book.id; });
      if (ids.length === 0) { fetchRelatedByBand(book); return; }
      client
        .from('library_books')
        .select('id, slug, title, display_title, author, cover_image_url, library_age_bands(age_band), library_subjects(subject)')
        .in('id', ids.slice(0, 20))
        .eq('status', 'active')
        .order('orbital_score', { ascending: false })
        .limit(3)
        .then(function (r2) {
          if (r2.error || !r2.data || r2.data.length === 0) return;
          renderRelated(r2.data, book.themes[0], book.title);
        });
    });
  }

  function fetchRelatedByBand(book) {
    if (!book.age_bands.length) return;
    client
      .from('library_books')
      .select('id, slug, title, display_title, author, cover_image_url, library_age_bands(age_band), library_subjects(subject)')
      .neq('id', book.id)
      .eq('status', 'active')
      .order('orbital_score', { ascending: false })
      .limit(8)
      .then(function (r) {
        if (r.error || !r.data || r.data.length === 0) return;
        var filtered = r.data.filter(function (b) {
          var bands = (b.library_age_bands || []).map(function (x) { return x.age_band; });
          return book.age_bands.some(function (ab) { return bands.indexOf(ab) !== -1; });
        }).slice(0, 3);
        if (filtered.length > 0) renderRelated(filtered, null, book.title);
      });
  }

  /* ── Creator linking — async upgrade plain names to filtered Library links ── */
  /* Renders plain <strong> first; upgrades to <a> only when other books       */
  /* by that creator exist in the Library.                                      */
  function checkAndLinkCreators(book) {
    var creditEl = document.getElementById('bk-credit');
    if (!creditEl || !client) return;

    var creatorsToCheck = [{ name: book.author, field: 'author' }];
    if (book.illustrator && book.illustrator !== book.author) {
      creatorsToCheck.push({ name: book.illustrator, field: 'illustrator' });
    }

    creatorsToCheck.forEach(function (creator) {
      client
        .from('library_books')
        .select('id')
        .eq(creator.field, creator.name)
        .neq('id', book.id)
        .eq('status', 'active')
        .limit(1)
        .then(function (result) {
          if (result.error || !result.data || result.data.length === 0) return;
          /* Other books exist — upgrade matching <strong> to <a> */
          var attr = creator.field === 'author' ? 'data-author-link' : 'data-illus-link';
          var spans = creditEl.querySelectorAll('[' + attr + ']');
          spans.forEach(function (span) {
            var a = document.createElement('a');
            a.href = '/library?' + creator.field + '=' + encodeURIComponent(creator.name);
            a.className = 'bk-credit-name-link';
            a.textContent = span.textContent;
            span.parentNode.replaceChild(a, span);
          });
        });
    });
  }

  function normalizeBook(b) {
    b.age_bands = (b.library_age_bands || []).map(function (r) { return r.age_band; });
    b.themes    = (b.library_themes    || []).map(function (r) { return r.theme; });
    b.subjects  = (b.library_subjects  || []).map(function (r) { return r.subject; });
    b.standards = (b.library_standards || []);
    b.diversity = (b.library_diversity || []).map(function (r) { return r.tag; });
    return b;
  }

  /* ── Domain helpers ──────────────────────────────────────────────────────── */
  /* Returns deduplicated list of canonical domain labels from subject slugs.  */
  function domainsFromSubjects(subjects) {
    var seen = {};
    var out  = [];
    (subjects || []).forEach(function (s) {
      var domain = DOMAIN_MAP[s.trim().toLowerCase()];
      if (domain && !seen[domain]) {
        seen[domain] = true;
        out.push(domain);
      }
    });
    return out;
  }

  /* Returns the display name for the first age band (e.g. "Wonderer"). */
  function getBandName(ageBands) {
    if (!ageBands || ageBands.length === 0) return '';
    return BAND_NAME[ageBands[0]] || '';
  }

  /* ── Title HTML — second-to-last word italic ─────────────────────────────── */
  /* Uses display_title when present (shorter, cleaner), falls back to title.  */
  /* Wraps the second-to-last word in <em> for Fraunces italic contrast.       */
  function buildTitleHtml(book) {
    var raw = ((book.display_title || book.title) || '').trim();
    if (!raw) return '<span class="bk-title-dot">.</span>';
    var words = raw.split(/\s+/);
    if (words.length < 2) {
      return esc(raw) + '<span class="bk-title-dot">.</span>';
    }
    var italicIdx = words.length - 2;
    var parts = words.map(function (w, i) {
      return i === italicIdx ? '<em>' + esc(w) + '</em>' : esc(w);
    });
    return parts.join(' ') + '<span class="bk-title-dot">.</span>';
  }

  /* ── Read-aloud calculation — format-aware, 20-min threshold ────────────── */
  /* Seconds per page by format tier:                                          */
  /*   Picture book / board book  : 10 sec/page  (~25 words × 150 wpm)        */
  /*   Graphic novel / poetry     : 50 sec/page  (mixed visual + text)        */
  /*   Chapter book / nonfiction  : 100 sec/page (~250 words × 150 wpm)       */
  /*                                                                           */
  /* ≤ 20 min  → "~N min read-aloud"         (single-session picture book)    */
  /* > 20 min  → "About N weeks at 30 min/day"  (bedtime cadence anchor)      */
  /*   weeks = totalMins ÷ (5 sessions/week × 30 min/session), min 1 week.    */
  function calcReadAloud(pageCount, bookFormat) {
    if (!pageCount || pageCount <= 0) return null;

    var secsPerPage;
    if (bookFormat === 'picture-book' || bookFormat === 'board-book') {
      secsPerPage = 10;
    } else if (bookFormat === 'graphic-novel' || bookFormat === 'poetry') {
      secsPerPage = 50;
    } else {
      secsPerPage = 100; /* chapter-book, early-reader, nonfiction, middle-grade */
    }

    var totalMins = Math.round(pageCount * secsPerPage / 60);
    if (totalMins < 1) totalMins = 1;

    if (totalMins <= 20) {
      return '~' + totalMins + ' min read-aloud';
    }

    /* Over 20 min — display as bedtime cadence, not raw clock time */
    var weeks = Math.round(totalMins / 150); /* 5 days × 30 min = 150 min/week */
    if (weeks < 1) weeks = 1;
    return 'About ' + weeks + ' ' + (weeks === 1 ? 'week' : 'weeks') + ' at 30 min/day';
  }

  /* ── Best For line — generated from data fields ─────────────────────────── */
  /* Produces "Ages 7–9, Independent Reader. ~272 pages." from structured data. */
  /* Falls back to book.best_for if structured fields are unavailable.          */
  function buildBestForLine(book) {
    var parts = [];
    if (book.age_bands && book.age_bands.length > 0) {
      var ages = formatAgeRange(book.age_bands);
      parts.push('Ages ' + ages.range);
    }
    if (book.reading_level && READING_LEVEL_LABEL[book.reading_level]) {
      parts.push(READING_LEVEL_LABEL[book.reading_level]);
    }
    var line = parts.join(', ');
    if (book.page_count) {
      var suffix = '~' + book.page_count + ' pages.';
      line = line ? line + '. ' + suffix : suffix;
    } else if (line) {
      line += '.';
    }
    /* Fall back to the DB best_for field if structured data is insufficient */
    return line || book.best_for || '';
  }

  /* ── Render ──────────────────────────────────────────────────────────────── */
  function renderBook(book) {

    /* ── Breadcrumb — LIBRARY · [BAND] · [BOOK TITLE] ── */
    var bcNavEl = document.getElementById('bk-breadcrumb');
    if (bcNavEl) {
      var dispTitle = book.display_title || book.title;
      var bandSlug  = book.age_bands.length > 0 ? book.age_bands[0] : '';
      var bandLabel = getBandName(book.age_bands);
      var bandSeg   = bandLabel
        ? '<span class="bk-breadcrumb-sep" aria-hidden="true">·</span>' +
          '<a href="/library?band=' + esc(bandSlug) + '">' + esc(bandLabel) + '</a>'
        : '';
      bcNavEl.innerHTML =
        '<a href="/library">Library</a>' +
        bandSeg +
        '<span class="bk-breadcrumb-sep" aria-hidden="true">·</span>' +
        '<span class="bk-breadcrumb-current">' + esc(dispTitle) + '</span>';
    }

    /* ── Cover — object-fit: contain, Night Sky letterbox ── */
    var coverFrame = document.getElementById('bk-cover-frame');
    if (coverFrame) {
      if (book.cover_image_url) {
        coverFrame.innerHTML =
          '<img src="' + esc(book.cover_image_url) +
          '" alt="Cover of ' + esc(book.title) + '" loading="eager">';
      } else {
        coverFrame.innerHTML =
          '<div class="bk-cover-ph" aria-label="Cover placeholder for ' + esc(book.title) + '">' +
            '<div class="bk-cover-ph-title">' + esc(book.display_title || book.title) + '</div>' +
            '<div class="bk-cover-ph-author">' + esc(book.author) + '</div>' +
          '</div>';
      }
    }

    /* ── Cover credit — quiet italic caption below cover ── */
    var creditEl = document.getElementById('bk-credit');
    if (creditEl) {
      var creditLine;
      if (book.illustrator && book.illustrator !== book.author) {
        creditLine =
          '<span class="bk-credit-line">Written by ' +
          '<strong class="bk-credit-name" data-author-link>' + esc(book.author) + '</strong>' +
          ', illustrated by ' +
          '<strong class="bk-credit-name" data-illus-link>' + esc(book.illustrator) + '</strong>' +
          '</span>';
      } else {
        creditLine =
          '<span class="bk-credit-line">Written and illustrated by ' +
          '<strong class="bk-credit-name" data-author-link>' + esc(book.author) + '</strong>' +
          '</span>';
      }
      var yearLine = book.year_published
        ? '<div class="bk-credit-year">' + esc(String(book.year_published)) + '</div>'
        : '';
      creditEl.innerHTML = creditLine + yearLine;
      /* Async: upgrade plain names to links once DB confirms other books exist */
      checkAndLinkCreators(book);
    }

    /* ── Title — Fraunces display, second-to-last word italic ── */
    var titleEl = document.getElementById('bk-title');
    if (titleEl) {
      titleEl.innerHTML = buildTitleHtml(book);
    }

    /* ── Hook — single-sentence Fraunces italic ── */
    var hookEl = document.getElementById('bk-hook');
    if (hookEl && book.hook) {
      hookEl.textContent = book.hook;
    }

    /* ── Curator's note — hidden until curator_note field is populated in DB ── */
    var curatorWrap  = document.getElementById('bk-curator');
    var curatorQuote = document.getElementById('bk-curator-quote');
    var curatorAttr  = document.getElementById('bk-curator-attr');
    if (curatorWrap && curatorQuote && book.curator_note) {
      curatorQuote.textContent = book.curator_note;
      if (curatorAttr && book.curated_by && CURATED_BY_NAME[book.curated_by]) {
        curatorAttr.textContent = '— ' + CURATED_BY_NAME[book.curated_by];
      }
      curatorWrap.style.display = '';
    }

    /* ── Theme pills — canonical domains, with sub-theme fallback ── */
    /* Priority 1: canonical curriculum domains from subject slugs via DOMAIN_MAP */
    /* Priority 2: raw theme slugs from library_themes (until subjects are populated) */
    var pillsEl = document.getElementById('bk-theme-pills');
    if (pillsEl) {
      var domains = domainsFromSubjects(book.subjects);
      var pillTags;
      if (domains.length > 0) {
        /* Canonical domain labels are already display-ready */
        pillTags = domains;
      } else if (book.themes && book.themes.length > 0) {
        /* Format sub-theme slugs for display: "space-exploration" → "Space Exploration" */
        pillTags = book.themes.map(function (t) {
          return t.replace(/-/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
        });
      } else {
        pillTags = [];
      }
      if (pillTags.length > 0) {
        pillsEl.innerHTML = pillTags.map(function (d) {
          return '<span class="bk-theme-pill">' + esc(d) + '</span>';
        }).join('');
      }
    }

    /* ── Decision card: Ages ── */
    var agesVal = document.getElementById('bk-ages-value');
    var agesSub = document.getElementById('bk-ages-sub');
    if (agesVal && book.age_bands.length) {
      var ages = formatAgeRange(book.age_bands);
      agesVal.textContent = ages.range;
      var bandName = getBandName(book.age_bands);
      if (agesSub && bandName) agesSub.textContent = bandName;
    }

    /* ── Decision card: Format ── */
    var fmtVal = document.getElementById('bk-format-value');
    if (fmtVal && book.book_format) {
      fmtVal.textContent = FORMAT_LABEL[book.book_format] || capitalize(book.book_format);
    }

    /* ── Decision card: Length — format-aware read-aloud calc ── */
    var lenVal = document.getElementById('bk-length-value');
    var lenSub = document.getElementById('bk-length-sub');
    if (lenVal && book.page_count) {
      lenVal.textContent = book.page_count + ' pages';
      var readAloud = calcReadAloud(book.page_count, book.book_format);
      if (lenSub && readAloud) {
        lenSub.textContent = readAloud;
      }
    }

    /* ── Decision card: Reader ── */
    var rdrVal = document.getElementById('bk-reader-value');
    var rdrSub = document.getElementById('bk-reader-sub');
    if (rdrVal && book.parent_role) {
      var roleMap = PARENT_ROLE_LABEL[book.parent_role];
      if (roleMap) {
        rdrVal.textContent = roleMap.value;
        if (rdrSub && roleMap.sub) rdrSub.textContent = roleMap.sub;
      } else {
        rdrVal.textContent = capitalize(book.parent_role);
      }
    }

    /* ── Standards colophon ── */
    var stdEl = document.getElementById('bk-standards');
    if (stdEl) {
      if (book.standards.length > 0) {
        var stdCodes = book.standards.map(function (s) { return s.standard_code; }).join(' · ');
        stdEl.textContent = 'Aligned to · ' + stdCodes;
        stdEl.style.display = '';
      } else {
        stdEl.style.display = 'none';
      }
    }

    /* ── Tertiary links ── */
    var tertiaryEl = document.getElementById('bk-tertiary-links');
    if (tertiaryEl) {
      var links = '';
      var libraryUrl  = book.library_link  || book.library_url;
      var purchaseUrl = book.purchase_link || book.bookstore_url;
      if (libraryUrl) {
        links +=
          '<a href="' + esc(libraryUrl) + '" class="bk-tertiary-link" target="_blank" rel="noopener">' +
            '<svg class="bk-tertiary-link-icon" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
              '<rect x="1" y="2" width="12" height="10" rx="1" stroke="currentColor" stroke-width="1.2"/>' +
              '<line x1="7" y1="2" x2="7" y2="12" stroke="currentColor" stroke-width="1.2"/>' +
              '<line x1="1" y1="5" x2="13" y2="5" stroke="currentColor" stroke-width="0.8"/>' +
            '</svg>' +
            'Find at Your Library' +
          '</a>';
      }
      if (purchaseUrl) {
        links +=
          '<a href="' + esc(purchaseUrl) + '" class="bk-tertiary-link" target="_blank" rel="noopener">' +
            '<svg class="bk-tertiary-link-icon" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
              '<path d="M2 3h10l-1 7H3L2 3Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>' +
              '<path d="M5 3V2a2 2 0 0 1 4 0v1" stroke="currentColor" stroke-width="1.2"/>' +
            '</svg>' +
            'Buy from an Independent Bookstore' +
          '</a>';
      }
      if (links) {
        tertiaryEl.innerHTML = links;
      } else {
        tertiaryEl.style.display = 'none';
      }
    }

    /* ══ DEPTH ZONE ══════════════════════════════════════════════════════════ */

    /* ── Heads-Up ── */
    if (book.heads_up) {
      var huEl   = document.getElementById('bk-headsup');
      var huBody = document.getElementById('bk-headsup-body');
      var huSub  = document.getElementById('bk-headsup-sub');
      if (huEl && huBody) {
        huBody.textContent = book.heads_up;
        if (huSub) {
          huSub.textContent = (book.parent_role === 'read-together' || book.parent_role === 'read-side-by-side')
            ? 'Read together first.' : 'For parents.';
        }
        huEl.style.display = '';
      }
    }

    /* ── What Makes It Orbital ── */
    var whatEl   = document.getElementById('bk-what-orbital');
    var whatBody = document.getElementById('bk-what-orbital-body');
    if (whatEl && whatBody && book.what_makes_it_orbital) {
      whatBody.textContent = book.what_makes_it_orbital;
      whatEl.style.display = '';
    }

    /* ── Orbital description ── */
    var orbBodyEl = document.getElementById('bk-orbital-body');
    if (orbBodyEl && book.orbital_description) {
      orbBodyEl.innerHTML = '<p class="bk-orbital-body">' + esc(book.orbital_description) + '</p>';
    }

    /* ── On Reading ── */
    var onReadingEl   = document.getElementById('bk-on-reading-card');
    var onReadingText = document.getElementById('bk-on-reading-text');
    if (onReadingEl && onReadingText && book.on_reading) {
      onReadingText.textContent = book.on_reading;
      onReadingEl.style.display = '';
    }

    /* ── Best For — formatted line from data fields ── */
    var bestForWrap = document.getElementById('bk-best-for-wrap');
    var bestForText = document.getElementById('bk-best-for-text');
    if (bestForWrap && bestForText) {
      var bfl = buildBestForLine(book);
      if (bfl) {
        bestForText.textContent = bfl;
        bestForWrap.style.display = '';
      }
    }

    /* ── Hide orbital description section if empty ── */
    var depthEl = document.getElementById('bk-depth');
    if (depthEl && !book.orbital_description) {
      depthEl.style.display = 'none';
    }

    /* ── Talk About ── */
    var talkEl    = document.getElementById('bk-talk-about');
    var talkCards = document.getElementById('bk-talk-about-cards');
    var questions = book.talk_about;
    if (talkEl && talkCards && questions && questions.length > 0) {
      var qs = Array.isArray(questions) ? questions : [questions];
      talkCards.innerHTML = qs.map(function (q, i) {
        var numStr = (i + 1) < 10 ? '0' + (i + 1) : String(i + 1);
        /* Theme label — from talk_about_themes[] if field exists              */
        /* Open Item: talk_about_themes TEXT[] field not yet in schema.        */
        /* Hide gracefully until data layer is ready.                          */
        var themeHtml = '';
        if (Array.isArray(book.talk_about_themes) && book.talk_about_themes[i]) {
          themeHtml = '<span class="bk-talk-theme">' + esc(book.talk_about_themes[i]) + '</span>';
        }
        /* Companion prompt — from talk_about_prompts[] if field exists        */
        /* Open Item: talk_about_prompts TEXT[] field not yet in schema.       */
        var promptHtml = '';
        if (Array.isArray(book.talk_about_prompts) && book.talk_about_prompts[i]) {
          promptHtml = '<p class="bk-talk-prompt">' + esc(book.talk_about_prompts[i]) + '</p>';
        }
        return '<div class="bk-talk-row">' +
          '<div class="bk-talk-col-num">' +
            '<span class="bk-talk-big-num">' + numStr + '</span>' +
          '</div>' +
          '<div class="bk-talk-col-content">' +
            '<p class="bk-talk-q">' +
              '<span class="bk-talk-quote">“</span>' +
              esc(q) +
              '<span class="bk-talk-quote">”</span>' +
            '</p>' +
            themeHtml +
            promptHtml +
          '</div>' +
        '</div>';
      }).join('');
      talkEl.style.display = '';
    }

    /* ── Pairs With ── */
    var pairsEl   = document.getElementById('bk-pairs-with');
    var pairsBody = document.getElementById('bk-pairs-with-body');
    if (pairsEl && pairsBody && book.pairs_with) {
      pairsBody.textContent = book.pairs_with;
      pairsEl.style.display = '';
    }

    /* ── Reveal content, remove shimmer ── */
    var loading = document.getElementById('bk-loading');
    var content = document.getElementById('bk-content');
    if (loading) loading.remove();
    if (content) content.removeAttribute('hidden');
  }

  /* ── Related books — depth zone constellation row ───────────────────────── */
  function renderRelated(books, theme, currentTitle) {
    var container = document.getElementById('bk-network-container');
    if (!container || !books || books.length === 0) return;

    var headline = theme
      ? 'More books in <em>' + esc(capitalize(theme)) + '</em>.'
      : 'More from The Library.';

    var framingLine = theme
      ? 'More books we\'ve curated for this theme.'
      : 'More from The Library.';

    var cardsHtml = books.slice(0, 3).map(function (b) {
      var coverContent = b.cover_image_url
        ? '<img src="' + esc(b.cover_image_url) + '" alt="Cover of ' + esc(b.title) + '" loading="lazy">'
        : '<div class="bk-rc-cover-art" style="background:#C8852A;">' +
            '<div class="bk-rc-cover-title" style="color:#E8AF38;">' + esc(b.display_title || b.title) + '</div>' +
          '</div>';

      return '<a href="/library/' + esc(b.slug) + '" class="bk-row-card">' +
        '<div class="bk-rc-cover">' + coverContent + '</div>' +
        '<div class="bk-rc-title">'  + esc(b.display_title || b.title) + '</div>' +
        '<div class="bk-rc-author">' + esc(b.author) + '</div>' +
      '</a>';
    }).join('');

    container.innerHTML =
      '<section class="bk-network" aria-labelledby="bk-connection-heading">' +
        '<div class="bk-network-header">' +
          '<div class="bk-eyebrow">The Constellation</div>' +
          '<h2 class="bk-network-headline" id="bk-connection-heading">' + headline + '</h2>' +
          '<p class="bk-constellation-frame">' + esc(framingLine) + '</p>' +
        '</div>' +
        '<div class="bk-row-cards">' + cardsHtml + '</div>' +
      '</section>';
  }

  /* ── Meta injection ──────────────────────────────────────────────────────── */
  function injectMeta(book) {
    var dt = book.display_title || book.title;
    document.title = dt + ' by ' + book.author + ' | Wizkoo Library';
    setMeta('description',          book.hook);
    setMeta('og:title',             dt + ' | Wizkoo Library', true);
    setMeta('og:description',       book.hook, true);
    setMeta('twitter:title',        dt + ' | Wizkoo Library', true);
    setMeta('twitter:description',  book.hook, true);
    var canonicalEl = document.getElementById('bk-canonical');
    if (canonicalEl) canonicalEl.setAttribute('href', 'https://wizkoo.com/library/' + book.slug);
    if (book.cover_image_url) {
      setMeta('og:image',      book.cover_image_url, true);
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

  /* ── Schema.org ──────────────────────────────────────────────────────────── */
  var BOOK_FORMAT_SCHEMA = {
    'board-book':    'https://schema.org/Hardcover',
    'picture-book':  'https://schema.org/Hardcover',
    'early-reader':  'https://schema.org/Paperback',
    'chapter-book':  'https://schema.org/Paperback',
    'nonfiction':    'https://schema.org/Hardcover',
    'graphic-novel': 'https://schema.org/GraphicNovel',
    'poetry':        'https://schema.org/Paperback',
  };

  function injectSchema(book) {
    var domains = domainsFromSubjects(book.subjects);

    var schema = {
      '@context':      'https://schema.org',
      '@type':         'Book',
      'name':          book.title,
      'author':        { '@type': 'Person', 'name': book.author },
      'isbn':          book.isbn || undefined,
      'publisher':     book.publisher ? { '@type': 'Organization', 'name': book.publisher } : undefined,
      'datePublished': book.year_published ? String(book.year_published) : undefined,
      'image':         book.cover_image_url || undefined,
      'numberOfPages': book.page_count ? String(book.page_count) : undefined,
      'bookFormat':    book.book_format ? (BOOK_FORMAT_SCHEMA[book.book_format] || undefined) : undefined,
      'audience':      { '@type': 'EducationalAudience', 'educationalRole': 'student' },
      'typicalAgeRange': book.age_bands.length > 0 ? book.age_bands.join(', ') : undefined,
      'description':   book.hook || book.orbital_description || undefined,
      'url':           'https://wizkoo.com/library/' + book.slug,
      'isPartOf':      { '@type': 'ItemList', 'name': 'Wizkoo Library', 'url': 'https://wizkoo.com/library' },
      /* Wizkoo custom properties */
      'wizkoo:orbitalScore':   book.orbital_score  || undefined,
      'wizkoo:band':           book.age_bands.length > 0 ? book.age_bands[0] : undefined,
      'wizkoo:domains':        domains.length > 0  ? domains : undefined,
      'wizkoo:standardsCodes': book.standards.length > 0
        ? book.standards.map(function (s) { return s.standard_code; })
        : undefined,
    };

    if (book.standards && book.standards.length > 0) {
      schema.educationalAlignment = book.standards.map(function (s) {
        return {
          '@type':              'AlignmentObject',
          'alignmentType':      'teaches',
          'targetName':         s.standard_code,
          'educationalFramework': s.standard_type === 'NGSS'
            ? 'Next Generation Science Standards'
            : 'Common Core State Standards',
        };
      });
    }
    if (book.subjects   && book.subjects.length > 0)   schema.about       = book.subjects;
    if (book.illustrator)                               schema.illustrator = { '@type': 'Person', 'name': book.illustrator };

    Object.keys(schema).forEach(function (k) { if (schema[k] === undefined) delete schema[k]; });

    var schemaEl = document.getElementById('bk-schema');
    if (schemaEl) schemaEl.textContent = JSON.stringify(schema, null, 2);

    /* ── BreadcrumbList ── */
    var breadcrumb = {
      '@context': 'https://schema.org',
      '@type':    'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home',        'item': 'https://wizkoo.com' },
        { '@type': 'ListItem', 'position': 2, 'name': 'The Library', 'item': 'https://wizkoo.com/library' },
        { '@type': 'ListItem', 'position': 3, 'name': book.title,    'item': 'https://wizkoo.com/library/' + book.slug },
      ],
    };
    var bcSchemaEl = document.getElementById('bk-breadcrumb-schema');
    if (bcSchemaEl) bcSchemaEl.textContent = JSON.stringify(breadcrumb, null, 2);
  }

  /* ── Error states ────────────────────────────────────────────────────────── */
  function showNotFound() {
    replaceLoading(
      '<div class="bk-error-state">' +
        '<div class="bk-error-label">404</div>' +
        '<p class="bk-error-msg">This book wasn\'t found in The Library.</p>' +
        '<p class="bk-error-sub"><a href="/library">Browse all books →</a></p>' +
      '</div>'
    );
  }

  function showError(msg) {
    replaceLoading(
      '<div class="bk-error-state">' +
        '<div class="bk-error-label">Error</div>' +
        '<p class="bk-error-msg">Could not load this book.</p>' +
        '<p class="bk-error-sub">' + esc(msg) + '</p>' +
      '</div>'
    );
  }

  function showUnconfigured() {
    replaceLoading(
      '<div class="bk-error-state">' +
        '<div class="bk-error-label">Setup Required</div>' +
        '<p class="bk-error-msg">Supabase is not yet connected.</p>' +
        '<p class="bk-error-sub">Add credentials to <code>js/supabase-config.js</code></p>' +
      '</div>'
    );
  }

  function replaceLoading(html) {
    var el = document.getElementById('bk-loading');
    if (el) el.outerHTML = html;
  }

  /* ── Helpers ─────────────────────────────────────────────────────────────── */
  function esc(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g,  '&amp;')
      .replace(/</g,  '&lt;')
      .replace(/>/g,  '&gt;')
      .replace(/"/g,  '&quot;')
      .replace(/'/g,  '&#39;');
  }

  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function formatAgeRange(bands) {
    if (!bands || bands.length === 0) return { range: '—', sub: '' };
    var nums = [];
    bands.forEach(function (b) {
      var parts = b.replace(/\s/g, '').split('-');
      parts.forEach(function (p) {
        var n = parseInt(p, 10);
        if (!isNaN(n)) nums.push(n);
      });
    });
    if (nums.length === 0) return { range: bands.join(', '), sub: '' };
    var min = Math.min.apply(null, nums);
    var max = Math.max.apply(null, nums);
    return { range: min === max ? String(min) : min + '–' + max, sub: '' };
  }

})();
