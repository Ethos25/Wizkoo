/**
 * Wizkoo Library — /library/[slug] book detail page  D5
 * Reads slug from window.location.pathname, fetches from Supabase,
 * populates the D5 HTML skeleton in book.html, renders orbital diagram.
 */
(function () {
  'use strict';

  /* ── Label maps ──────────────────────────────────────────────────────────── */
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
        if (result.error || !result.data) { showNotFound(); return; }
        var book = normalizeBook(result.data);
        renderBook(book);
        injectMeta(book);
        injectSchema(book);
        fetchRelated(book);
      });
  }

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
        .select('id, slug, title, author, cover_image_url, library_age_bands(age_band), library_subjects(subject)')
        .in('id', ids.slice(0, 20))
        .eq('status', 'active')
        .order('orbital_score', { ascending: false })
        .limit(4)
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
      .select('id, slug, title, author, cover_image_url, library_age_bands(age_band), library_subjects(subject)')
      .neq('id', book.id)
      .eq('status', 'active')
      .order('orbital_score', { ascending: false })
      .limit(8)
      .then(function (r) {
        if (r.error || !r.data || r.data.length === 0) return;
        var filtered = r.data.filter(function (b) {
          var bands = (b.library_age_bands || []).map(function (x) { return x.age_band; });
          return book.age_bands.some(function (ab) { return bands.indexOf(ab) !== -1; });
        }).slice(0, 4);
        if (filtered.length > 0) renderRelated(filtered, null, book.title);
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

  /* ── Render ──────────────────────────────────────────────────────────────── */
  function renderBook(book) {

    /* ── Cover ── */
    var coverEl = document.getElementById('bk-cover-img');
    if (coverEl) {
      if (book.cover_image_url) {
        coverEl.innerHTML = '<img src="' + esc(book.cover_image_url) +
          '" alt="Cover of ' + esc(book.title) + '">';
      } else {
        coverEl.innerHTML =
          '<div class="bk-cover-ph" aria-label="Book cover placeholder for ' + esc(book.title) + '">' +
            '<div class="bk-cover-ph-title">' + esc(book.title) + '</div>' +
            '<div class="bk-cover-ph-author">' + esc(book.author) + '</div>' +
          '</div>';
      }
    }

    /* ── Cover caption ── */
    var captionRow = document.getElementById('bk-cover-caption-row');
    var captionText = document.getElementById('bk-cover-caption-text');
    if (captionText) {
      var caption = '';
      if (book.illustrator && book.year_published) {
        caption = 'Illustrated by ' + book.illustrator + ', ' + book.year_published + '.';
      } else if (book.illustrator) {
        caption = 'Illustrated by ' + book.illustrator + '.';
      } else if (book.year_published) {
        caption = book.year_published + '.';
      }
      if (caption) {
        captionText.textContent = caption;
      } else if (captionRow) {
        captionRow.style.display = 'none';
      }
    }

    /* ── Title ── */
    var titleEl = document.getElementById('bk-title');
    if (titleEl) {
      titleEl.innerHTML = esc(book.title) + '<span class="bk-title-dot">.</span>';
    }

    /* ── Standfirst (hook) ── */
    var standfirstEl = document.getElementById('bk-standfirst');
    if (standfirstEl && book.hook) {
      standfirstEl.textContent = book.hook;
    }

    /* ── Byline ── */
    var bylineEl = document.getElementById('bk-byline');
    if (bylineEl) {
      var byline = (book.illustrator && book.illustrator !== book.author)
        ? 'Written by ' + book.author + '. Illustrated by ' + book.illustrator + '.'
        : 'Written and illustrated by ' + book.author + '.';
      bylineEl.textContent = byline;
    }

    /* ── Decision card: Ages ── */
    var agesVal = document.getElementById('bk-ages-value');
    var agesSub = document.getElementById('bk-ages-sub');
    if (agesVal && book.age_bands.length) {
      var ages = formatAgeRange(book.age_bands);
      agesVal.textContent = ages.range;
      if (agesSub && ages.sub) agesSub.textContent = ages.sub;
    }

    /* ── Decision card: Format ── */
    var fmtVal = document.getElementById('bk-format-value');
    if (fmtVal && book.book_format) {
      fmtVal.textContent = FORMAT_LABEL[book.book_format] || capitalize(book.book_format);
    }

    /* ── Decision card: Length ── */
    var lenVal = document.getElementById('bk-length-value');
    var lenSub = document.getElementById('bk-length-sub');
    if (lenVal && book.page_count) {
      lenVal.textContent = book.page_count + ' pages';
      if (lenSub && book.read_aloud_minutes) {
        lenSub.textContent = '~' + book.read_aloud_minutes + ' min read-aloud';
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
    var stdEl = document.getElementById('bk-score-standards');
    if (stdEl && book.standards.length > 0) {
      var stdCodes = book.standards.map(function (s) { return s.standard_code; }).join(' · ');
      stdEl.textContent = 'Aligned to · ' + stdCodes;
    } else if (stdEl) {
      stdEl.style.display = 'none';
    }

    /* ── Tertiary links ── */
    var tertiaryEl = document.getElementById('bk-tertiary-links');
    if (tertiaryEl) {
      var links = '';
      var libraryUrl = book.library_link || book.library_url;
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

    /* ── Heads-Up ── */
    if (book.heads_up) {
      var huEl = document.getElementById('bk-headsup');
      var huBody = document.getElementById('bk-headsup-body');
      var huSub = document.getElementById('bk-headsup-sub');
      if (huEl && huBody) {
        huBody.textContent = book.heads_up;
        if (huSub) {
          var subText = (book.parent_role === 'read-together' || book.parent_role === 'read-side-by-side')
            ? 'Read together first.' : 'For parents.';
          huSub.textContent = subText;
        }
        huEl.style.display = '';
      }
    }

    /* ── What Makes It Orbital ── */
    var whatEl = document.getElementById('bk-what-orbital');
    var whatBody = document.getElementById('bk-what-orbital-body');
    if (whatEl && whatBody && book.what_makes_it_orbital) {
      whatBody.textContent = book.what_makes_it_orbital;
      whatEl.style.display = '';
    }

    /* ── Depth zone: Orbital description ── */
    var orbBodyEl = document.getElementById('bk-orbital-body');
    if (orbBodyEl && book.orbital_description) {
      orbBodyEl.innerHTML = '<p class="bk-orbital-body">' + esc(book.orbital_description) + '</p>';
    }

    /* ── Depth zone: On Reading card ── */
    var onReadingEl = document.getElementById('bk-on-reading-card');
    var onReadingText = document.getElementById('bk-on-reading-text');
    if (onReadingEl && onReadingText && book.on_reading) {
      onReadingText.textContent = book.on_reading;
      onReadingEl.style.display = '';
    }

    /* ── Depth zone: Best For ── */
    var bestForWrap = document.getElementById('bk-best-for-wrap');
    var bestForText = document.getElementById('bk-best-for-text');
    if (bestForWrap && bestForText && book.best_for) {
      bestForText.textContent = book.best_for;
      bestForWrap.style.display = '';
    }

    /* ── Hide depth zone entirely if no content ── */
    var depthEl = document.getElementById('bk-depth');
    if (depthEl && !book.orbital_description && !book.best_for) {
      depthEl.style.display = 'none';
    }

    /* ── Talk About ── */
    var talkEl = document.getElementById('bk-talk-about');
    var talkCards = document.getElementById('bk-talk-about-cards');
    var questions = book.talk_about;
    if (talkEl && talkCards && questions && questions.length > 0) {
      var qs = Array.isArray(questions) ? questions : [questions];
      talkCards.innerHTML = qs.map(function (q) {
        return '<div class="bk-talk-about-card">' + esc(q) + '</div>';
      }).join('');
      talkEl.style.display = '';
    }

    /* ── Pairs With ── */
    var pairsEl = document.getElementById('bk-pairs-with');
    var pairsBody = document.getElementById('bk-pairs-with-body');
    if (pairsEl && pairsBody && book.pairs_with) {
      pairsBody.textContent = book.pairs_with;
      pairsEl.style.display = '';
    }

    /* ── Orbital diagram ── */
    renderOrbitalDiagram(book.subjects, book.orbital_score);

    /* ── Reveal content, remove shimmer ── */
    var loading = document.getElementById('bk-loading');
    var content = document.getElementById('bk-content');
    if (loading) loading.remove();
    if (content) content.removeAttribute('hidden');
  }

  /* ── Related books — D5 constellation row ──────────────────────────────── */
  function renderRelated(books, theme, currentTitle) {
    var container = document.getElementById('bk-network-container');
    if (!container || !books || books.length === 0) return;

    var headline = theme
      ? 'More books in <em>' + esc(capitalize(theme)) + '</em>.'
      : 'More from The Library.';

    var cardsHtml = books.slice(0, 4).map(function (b) {
      var subjects = (b.library_subjects || []).map(function (s) { return s.subject; });
      var coverContent = b.cover_image_url
        ? '<img src="' + esc(b.cover_image_url) + '" alt="Cover of ' + esc(b.title) + '" loading="lazy">'
        : '<div class="bk-rc-cover-art" style="background:#C8852A;">' +
            '<div class="bk-rc-cover-title" style="color:#E8AF38;">' + esc(b.title) + '</div>' +
          '</div>';

      return '<a href="/library/' + esc(b.slug) + '" class="bk-row-card">' +
        '<div class="bk-rc-cover">' + coverContent + '</div>' +
        '<div class="bk-rc-title">' + esc(b.title) + '</div>' +
        '<div class="bk-rc-author">' + esc(b.author) + '</div>' +
      '</a>';
    }).join('');

    container.innerHTML =
      '<section class="bk-network" aria-labelledby="bk-connection-heading">' +
        '<div class="bk-network-header">' +
          '<div class="bk-eyebrow">The Constellation</div>' +
          '<h2 class="bk-network-headline" id="bk-connection-heading">' + headline + '</h2>' +
        '</div>' +
        '<div class="bk-row-cards">' + cardsHtml + '</div>' +
      '</section>';
  }

  /* ── Orbital diagram ─────────────────────────────────────────────────────── */
  /* Maps DB subject slugs to display names for the orbital diagram.
     geography + history both fold into Social Studies (deduped below). */
  var SUBJECT_DISPLAY = {
    'science':          'Science',
    'math':             'Mathematics',
    'language-arts':    'Language Arts',
    'art':              'Creative Arts',
    'geography':        'Social Studies',
    'history':          'Social Studies',
    'social-emotional': 'Life Skills'
  };

  function validateSubjects(subjects) {
    var seen = {};
    return subjects.reduce(function (acc, s) {
      var slug    = s.trim().toLowerCase();
      var display = SUBJECT_DISPLAY[slug];
      if (!display) { console.warn('[Wizkoo] Unmapped subject slug: "' + slug + '"'); return acc; }
      if (!seen[display]) { seen[display] = true; acc.push(display); }
      return acc;
    }, []);
  }

  var ORBITS = {
    C: { cx: 450, cy: 250, rx: 310, ry: 178, rotDeg: -32 },
    A: { cx: 450, cy: 250, rx: 280, ry: 160, rotDeg: -8  },
    B: { cx: 450, cy: 250, rx: 240, ry: 135, rotDeg:  25 }
  };

  /* Planets constrained to left half (t = 90°–270°); labels extend leftward
     via text-anchor='end' — stays clear of nucleus and decision card. */
  var DISTRIBUTIONS = {
    1: [{ o:'C', t:180 }],
    2: [{ o:'C', t:130 }, { o:'B', t:230 }],
    3: [{ o:'C', t:110 }, { o:'A', t:180 }, { o:'B', t:250 }],
    4: [{ o:'C', t:110 }, { o:'C', t:250 }, { o:'A', t:180 }, { o:'B', t:145 }],
    5: [{ o:'C', t:110 }, { o:'C', t:250 }, { o:'A', t:180 }, { o:'B', t:130 }, { o:'B', t:230 }]
  };

  var NUCLEUS_CENTER = { x: 450, y: 250 };
  var NUCLEUS_EXCLUSION = 160;
  var COUNT_WORDS = ['', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE'];

  function ptOnOrbit(key, tDeg) {
    var o = ORBITS[key], t = tDeg * Math.PI / 180, th = o.rotDeg * Math.PI / 180;
    return {
      x: o.cx + o.rx * Math.cos(t) * Math.cos(th) - o.ry * Math.sin(t) * Math.sin(th),
      y: o.cy + o.rx * Math.cos(t) * Math.sin(th) + o.ry * Math.sin(t) * Math.cos(th)
    };
  }

  function distFromNucleus(x, y) {
    var dx = x - NUCLEUS_CENTER.x, dy = y - NUCLEUS_CENTER.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function labelAttrs(x, y) {
    var dy = y - 250, GAP = 12;
    var ly = Math.abs(dy) > 90 ? (dy < 0 ? y - GAP : y + GAP + 8) : y + 5;
    return { lx: x - GAP, ly: ly, anchor: 'end' };
  }

  function renderOrbitalDiagram(rawSubjects, orbitalScore) {
    var wrap    = document.getElementById('bk-score-wrap');
    var svg     = document.getElementById('bk-score-svg');
    var planetsG = document.getElementById('bk-planets');
    var figEl   = document.getElementById('bk-score-fig');
    if (!wrap || !svg || !planetsG || !figEl) return;

    var subjects = validateSubjects(rawSubjects || []).sort();
    var extra    = subjects.length > 5 ? subjects.slice(5) : [];
    subjects     = subjects.slice(0, 5);
    var count    = subjects.length;

    if (count === 0) { wrap.style.display = 'none'; return; }

    var slots = DISTRIBUTIONS[count];
    var svgNS = 'http://www.w3.org/2000/svg';
    var frag  = document.createDocumentFragment();

    subjects.forEach(function (subject, i) {
      var slot = slots[i];
      var pt   = ptOnOrbit(slot.o, slot.t);

      if (distFromNucleus(pt.x, pt.y) < NUCLEUS_EXCLUSION) {
        for (var delta = 5; delta <= 60; delta += 5) {
          var ptA = ptOnOrbit(slot.o, slot.t + delta);
          if (distFromNucleus(ptA.x, ptA.y) >= NUCLEUS_EXCLUSION) { pt = ptA; break; }
          var ptB = ptOnOrbit(slot.o, slot.t - delta);
          if (distFromNucleus(ptB.x, ptB.y) >= NUCLEUS_EXCLUSION) { pt = ptB; break; }
        }
      }

      var lbl = labelAttrs(pt.x, pt.y);

      var g = document.createElementNS(svgNS, 'g');
      g.setAttribute('transform', 'translate(' + pt.x.toFixed(1) + ',' + pt.y.toFixed(1) + ')');
      var halo = document.createElementNS(svgNS, 'circle');
      halo.setAttribute('r', '18'); halo.setAttribute('fill', 'url(#hz-dot-halo)');
      var core = document.createElementNS(svgNS, 'circle');
      core.setAttribute('r', '8');  core.setAttribute('fill', 'url(#hz-dot-core)');
      g.appendChild(halo); g.appendChild(core);
      frag.appendChild(g);

      var txt = document.createElementNS(svgNS, 'text');
      txt.setAttribute('x', lbl.lx.toFixed(1));
      txt.setAttribute('y', lbl.ly.toFixed(1));
      txt.setAttribute('font-family', "'Space Mono', monospace");
      txt.setAttribute('font-weight', '700');
      txt.setAttribute('font-size', '30');
      txt.setAttribute('fill', '#E8AF38');
      txt.setAttribute('letter-spacing', '0.04em');
      txt.setAttribute('text-anchor', lbl.anchor);
      txt.textContent = subject.toUpperCase();
      frag.appendChild(txt);
    });

    planetsG.appendChild(frag);

    svg.setAttribute('aria-label',
      'Orbital diagram — ' + count + ' connected subject' + (count === 1 ? '' : 's') +
      ': ' + subjects.join(', '));

    figEl.textContent = (COUNT_WORDS[count] || count) + ' CONNECTED SUBJECTS';

    if (orbitalScore) {
      var defEl = document.createElement('p');
      defEl.className = 'bk-score-def';
      defEl.textContent = 'Orbital Score: ' + orbitalScore + ' — connects ' + orbitalScore + ' subject' + (orbitalScore === 1 ? '' : 's') + '.';
      figEl.insertAdjacentElement('afterend', defEl);
    }

    if (extra.length > 0) {
      var extraEl = document.createElement('p');
      extraEl.className = 'bk-score-extra';
      extraEl.textContent = 'Also touches: ' + extra.map(function (s) { return s.toLowerCase(); }).join(', ');
      figEl.insertAdjacentElement('afterend', extraEl);
    }
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

  /* ── Schema.org ──────────────────────────────────────────────────────────── */
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
      'audience': { '@type': 'EducationalAudience', 'educationalRole': 'student' },
      'typicalAgeRange': book.age_bands.join(', ') || undefined,
      'description': book.orbital_description,
      'url': 'https://wizkoo.com/library/' + book.slug,
      'isPartOf': { '@type': 'ItemList', 'name': 'Wizkoo Library', 'url': 'https://wizkoo.com/library' }
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
    if (book.subjects && book.subjects.length > 0) schema.about = book.subjects;
    if (book.illustrator) schema.illustrator = { '@type': 'Person', 'name': book.illustrator };
    Object.keys(schema).forEach(function (k) { if (schema[k] === undefined) delete schema[k]; });
    var el = document.getElementById('bk-schema');
    if (el) el.textContent = JSON.stringify(schema, null, 2);
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
