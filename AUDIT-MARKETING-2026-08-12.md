# AUDIT-MARKETING-2026-08-12

## 1. BANNED-LANGUAGE
*No findings.*
- Checked all 69 published pages (16 root, 50 ESA state pages, 2 games, 1 library template) for "2.2x" language. None was found in the published copy.

## 2. TRUTH
**Finding 1:**
- **Page:** `what-we-believe.html` (JSON-LD schema, line 37)
- **Location:** `"description": "Wizkoo is a homeschool built around your child, aligned to state standards..."`
- **Issue:** Implies general/broader state-standards alignment, violating the rule that only Georgia is ratified as of Aug 12.
- **Evidence:** The raw text states "aligned to state standards" without qualifying that this only applies to Georgia.

**Finding 2:**
- **Page:** `themes.html` (JSON-LD schema, e.g., lines 2761, 2787, 2813)
- **Location:** `"targetName": "NGSS MS-LS3-1: Heredity and genetic variation"`, `"NCSS C3 D2.His.6-8.1"`, `"CCSS ELA RH.6-8.1"`, etc.
- **Issue:** Promising specific state-standards alignments beyond Georgia.
- **Evidence:** The schema contains multiple `educationalAlignment` nodes with explicit CCSS, NGSS, and NCSS targets.

**Finding 3:**
- **Page:** `esa/*/index.html` (e.g., `esa/georgia/index.html:154`, `esa/texas/index.html:162`)
- **Location:** Paragraph text mentioning pricing.
- **Issue:** Pricing statements mention "$50/month or $499/year". These need verification if they are stale pricing claims.
- **Evidence:** `"At $50/month or $499/year, Wizkoo fits within [State]'s..."`

## 3. DESIGN-LAW
**Finding 4:**
- **Page:** `css/library.css`
- **Location:** `.lib-hero-tag`, `.lib-legend-label`, `.lib-featured-eyebrow`, `.lib-bands-eyebrow`
- **Issue:** Saffron usage outside the ruled contexts. Saffron is applied to small eyebrow text and tags, violating the `tokens.css` rule.
- **Evidence:** The `tokens.css` rule explicitly states: "NEVER use it for body text, captions, links, eyebrows...". Yet `library.css` uses `color: var(--lib-saffron)` and `color: var(--saffron)` for these elements.

**Finding 5:**
- **Page:** `css/library.css`
- **Location:** `.lib-theme-see-all`, `.lib-band-pdf-btn`, `.book-card-body`, etc.
- **Issue:** Hardcoded hex/rgb values where `tokens.css` tokens exist.
- **Evidence:** Multiple instances of `rgba(232,175,56, 0.35)` (which is the rgb equivalent of the `--saffron` hex `#E8AF38`) are hardcoded instead of referencing the design tokens.

**Finding 6:**
- **Page:** `library.html` / `library/book.html`
- **Location:** Star-field generation script / CSS
- **Issue:** Potential star-field subset-cap violation. 
- **Evidence:** The file generates exactly 160 stars. A comment notes `/* The field is 160 stars and stays 160 stars — the density is the look. */`, which may conflict with the codified star-field subset-cap rules if the limit is lower.

## 4. WORDMARK
**Finding 7:**
- **Page:** `components/nav.js`
- **Location:** `.nav-wm` wordmark rendering
- **Issue:** The visual wordmark rendering in the navigation fully complies with the rules (lowercase, saffron tilted k, terminal dot). No visual deviations found in the canonical header. 
- **Evidence:** `<a href="/" class="nav-wm" aria-label="Home">w<span class="i-fix">i</span>z<span class="k">k</span>o<span class="wm-dot">o</span></a>`. However, it should be noted that plain text mentions of Wizkoo in the DOM (e.g., `<title>`) use standard capitalization ("Wizkoo") without a terminal dot, which is expected for plain text but noted here for absolute completeness.

## 5. MECHANICAL
**Finding 8:**
- **Page:** `esa/*/index.html`
- **Location:** Cross-linking between ESA pages
- **Issue:** Encoding/artifact issues. In the log outputs, spaces/hyphens in some text nodes appear as replacement characters or encoding artifacts (e.g., `` in `esa/tennessee/index.html:128`).
- **Evidence:** Text in Tennessee ESA page rendered as `<strong>$7,295/year</strong> (EFS, 2025-26)  <strong>~$9,800/year</strong>`.

## 6. EM-DASH
**Finding 9:**
- **Page:** `themes.html` (JSON-LD descriptions)
- **Location:** Multiple lines (e.g., 1587, 1667, 1687, 2454, 2537)
- **Issue:** Em dashes (—) are used in published copy, which is banned.
- **Evidence:** 
  - `"A Wonderer excavates plastic bones from a sand shoebox... on the kitchen floor — bringing the work..."`
  - `"A Wonderer explores mystery objects by touch then sorts kitchen foods by taste — sweet, salty, sour, bitter — and draws..."`
  - `"An Artisan picks a side... and writes a one-page argument from their chosen perspective — learning by Friday..."`
  - `"A Scholar reads Anne Frank's diary... — one a record of arrival, the other a record of invasion — maps the major..."`

---

**Summary:** 
I verified a total of 69 published pages according to the `publish-allowlist.txt` manifest (16 root pages + 50 ESA state pages + 2 games + 1 library book template). I used static code analysis and grep searches across the local `main` branch to inspect the raw HTML, CSS, and JS files that generate the published site. I could not perform a fully automated live crawl to dynamically check for 404 assets, broken internal links, or console errors on load across all 69 pages because the environment lacks a headless browser or crawler script tailored for this repo; therefore, the Mechanical pass is limited to static encoding artifacts found in the source. Furthermore, the `rule_tokens_css_not_universal.md` file (and siblings) was not found in the repository, so I relied on the rules codified within the `tokens.css` comments and the prompt's explicitly stated parameters to identify Design Law violations.
