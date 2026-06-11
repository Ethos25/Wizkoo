# RESPONSIVE_AUDIT_REPORT.md
**Wizkoo Marketing Site — Layer 3 Responsive Strategy Audit**
Generated: 2026-04-21 | Scope: all CSS files, all inline `<style>` blocks, JS viewport logic | Excludes: /games/ subdirectory, plan-generator repo

---

## SECTION 1 — COMPLETE BREAKPOINT INVENTORY

### 1A. Width Breakpoints — Exact Values Found

| Value | Files / Lines | Type |
|-------|--------------|------|
| `375px` | index.html:735 | max-width |
| `480px` | index.html:537, 704; css/library.css:1140; css/games.css:340; privacy.html:84; terms.html:79 | max-width |
| `767px` | index.html:696, 893 | max-width |
| `768px` | index.html:461, 537, 571, 638, 654, 658, 695 (adjacent), 756, 777, 779, 807, 834, 894, 1079; about.html:133; pricing.html:90; what-we-believe.html:80; the-open-seat.html:315; ages.html:61; contact.html:46; 404.html:65; esa.html:128; privacy.html:78; terms.html:73; scope.html:31; account.html:239; css/library.css:1117; css/games.css:326; components/nav.js:265 (injected) | max-width |
| `1023px` | index.html:892 | max-width |
| `1024px` | index.html:441, 654, 695; about.html:132; the-open-seat.html:314; ages.html:60; account.html:235; css/library.css:1111; css/games.css:316 | max-width |
| `1100px` | components/nav.js:259 (injected) | max-width |
| `1280px` | css/library.css:1106 | max-width |
| `1439px` | index.html:891 | max-width |

**Orientation:** All width queries are `max-width` (desktop-last). No `min-width` queries exist anywhere in the codebase.

---

### 1B. Height Breakpoints

| Value | File / Line | What It Does |
|-------|------------|--------------|
| `max-height: 899px` | index.html:1005 | Short viewport: reduces hero padding, adjusts `.nh-section`, `.desk`, `.form-prose`, font sizes |
| `max-height: 700px` | index.html:1025 | Very short viewport: further compression, clips `.desk-body` with `-webkit-line-clamp:3` |
| `max-height: 500px` | index.html:1044 | Extreme short: minimum viable hero, ultra-small type |

**Isolation:** All three height breakpoints appear only in index.html. No other page uses height-based queries.

---

### 1C. Capability Queries

| Query | Files |
|-------|-------|
| `(hover: hover) and (pointer: fine)` | css/base.css:2; the-open-seat.html:15; privacy.html:27; terms.html:27 |
| `(hover: hover)` | index.html:170, 366; about.html:34, 107, 125; pricing.html:19, 38; what-we-believe.html:47, 67; ages.html:18, 41; contact.html:24; esa.html:20, 42, 77, 99, 111; the-open-seat.html:250, 264 |
| `(hover: none), (pointer: coarse)` | css/base.css:29; the-open-seat.html:21; privacy.html:31; terms.html:31 |
| `(hover: none) and (pointer: coarse)` | index.html:543, 569, 849; about.html:134; pricing.html:91; what-we-believe.html:81; ages.html:62; esa.html:129 |

**Note:** Two forms of hover-none query coexist: `(hover:none),(pointer:coarse)` (comma-separated OR) and `(hover:none)and(pointer:coarse)` (AND). These have different semantics — see Conflict 3 below.

---

### 1D. Motion Queries

| Query | Files |
|-------|-------|
| `(prefers-reduced-motion: reduce)` | css/components.css:61; index.html:570, 597, 705, 783, 888, 1080; about.html:135; pricing.html:92; what-we-believe.html:82; ages.html:63; the-open-seat.html:333; methodology.html:98, 179, 212, 282, 432 |
| `(prefers-reduced-motion: no-preference)` | index.html:882 |

Motion queries are consistent and architecturally sound. No conflicts found in this category.

---

### 1E. JavaScript Viewport Logic

| File | Line(s) | Mechanism | Threshold | Purpose |
|------|---------|-----------|-----------|---------|
| components/nav.js | 259 | Injected CSS `@media` | 1100px | Compact desktop: tighter nav padding and gap |
| components/nav.js | 265 | Injected CSS `@media` | 768px | Mobile: show hamburger, hide center nav links |
| components/nav.js | 405–406 | `window.addEventListener('resize')` + `innerWidth > 768` | 768px | Close mobile menu when viewport expands past 768px |
| index.html | 1945, 2143, 2336, 2386, 2457 | `window.matchMedia('(prefers-reduced-motion:reduce)')` | n/a | Firefly and animation kill switches |
| index.html | 2142 | `window.innerWidth <= 768` | 768px | Skip firefly initialization on mobile |
| index.html | 2251–2252 | `resize` listener + `innerWidth <= 768` | 768px | Kill firefly animation if viewport shrinks to mobile |
| index.html | 2405 | `window.innerWidth <= 768` | 768px | Reduce firefly particle count on mobile |
| index.html | 2458 | `window.innerWidth < 768` | 768px | Skip animation initialization (strict less-than) |
| index.html | 1378 | `window.addEventListener('resize', onScroll)` | n/a | Re-runs scroll handler on resize (layout recalc) |
| index.html | 2452 | `window.addEventListener('resize', resize)` | n/a | Canvas resize handler (no conditional) |

---

## SECTION 2 — CONFLICT ANALYSIS

### Conflict 1 — 767px vs 768px (HOMEPAGE ONLY) ⚠️

**What:** index.html uses both `max-width:767px` and `max-width:768px` as separate breakpoints.

**Files and lines:**
- `max-width:767px` at index.html:696 — `.hz2-inner` padding (horizontal zone 2)
- `max-width:767px` at index.html:893 — hero headline font sizes (`.nh-h1-line1/2/3`)
- `max-width:768px` at index.html:461, 638, 658, 756, 777, 779, 807, 834, 894, 1079 — general mobile layout, sections, form

**Behavior at exactly 768px viewport:**
- The `max-width:768px` queries fire → mobile layout active
- The `max-width:767px` queries do NOT fire → hero headlines still at the 1023px-tier sizes (intermediate size, not mobile size)
- `.hz2-inner` still at its desktop padding
- Result: layout is in mobile state but hero typographic scale is not

**Severity:** Medium. The 1px gap (768px exactly) is narrow, but it reveals an inconsistency in the intent: mobile layout triggers before mobile typography triggers.

**Recommendation:** Consolidate to 768px. Change lines 696 and 893 from `max-width:767px` to `max-width:768px`. The 1px is not an intentional split — this is drift from multiple separate edits.

---

### Conflict 2 — 1023px vs 1024px (HOMEPAGE ONLY) ⚠️

**What:** index.html uses both `max-width:1023px` and `max-width:1024px` as separate breakpoints.

**Files and lines:**
- `max-width:1023px` at index.html:892 — hero headline font sizes (`.nh-h1-line1/2/3`)
- `max-width:1024px` at index.html:441, 654, 695 — general hero layout, sections, inner padding

**Behavior at exactly 1024px viewport:**
- The `max-width:1024px` queries fire → tablet layout active
- The `max-width:1023px` query does NOT fire → hero headlines still at 1439px-tier sizes
- Result: layout is in tablet state but hero typographic scale is not

**Severity:** Medium. Same pattern as Conflict 1 — the typographic tier and the layout tier are offset by 1px.

**Recommendation:** Consolidate to 1024px. Change line 892 from `max-width:1023px` to `max-width:1024px`. Same cause as Conflict 1 (accumulated edits, not intentional split).

---

### Conflict 3 — JS `< 768` vs CSS `max-width:768px` (HOMEPAGE) ⚠️

**What:** index.html:2458 uses `window.innerWidth < 768` (strict less-than) to skip animation initialization. The CSS at multiple lines uses `max-width:768px` (applies at 768px and below).

**Behavior at exactly 768px:**
- CSS `max-width:768px` fires → firefly CSS rule `display:none!important` applies (index.html:571)
- JS `innerWidth < 768` does NOT trigger → animation initialization continues
- Result: animation runs in JS but firefly is hidden by CSS. The animation is wasteful (computing particle positions, attaching listeners) even though nothing is visible.

**Severity:** Low (no visual bug, minor performance waste). The CSS guard catches the visible output; the JS guard has an off-by-one.

**Recommendation:** Change index.html:2458 from `window.innerWidth < 768` to `window.innerWidth <= 768` to match the CSS threshold. One character fix.

---

### Conflict 4 — Hover Query Inconsistency (CAPABILITY DETECTION) ⚠️

**What:** Two different syntaxes are used across files for "no hover" detection:
- **OR syntax:** `(hover:none),(pointer:coarse)` — fires if EITHER condition is true (css/base.css:29; the-open-seat.html:21; privacy.html:31; terms.html:31)
- **AND syntax:** `(hover:none)and(pointer:coarse)` — fires only if BOTH conditions are true (index.html:543, 569, 849; about.html:134; pricing.html:91; what-we-believe.html:81; ages.html:62; esa.html:129)

**Behavioral difference:** A device with `hover:none` but `pointer:fine` (some pen tablets, hybrid devices) triggers the OR version but not the AND version. These devices would get cursor-hide behavior on pages using OR syntax, but not on pages using AND syntax.

**Severity:** Low in practice (fringe device category). High in principle (inconsistent capability model across pages).

**Recommendation:** Formalize one rule. The OR syntax `(hover:none),(pointer:coarse)` is broader and safer — it catches any device that can't hover OR has a coarse pointer, which is the intent. Standardize all files to OR syntax and consider centralizing in css/base.css (which already uses OR syntax) so all pages inherit it rather than declaring per-page.

---

### Conflict 5 — 1100px Nav Breakpoint Not in CSS System ⚠️

**What:** components/nav.js:259 injects `@media(max-width:1100px)` into the document head at runtime. This breakpoint appears nowhere in any CSS file. It exists only in JS-generated styles.

**Impact:** If any developer searches CSS files for all breakpoints, 1100px is invisible. If any CSS file needs to coordinate behavior at 1100px (e.g., adjust adjacent layout to the nav), they must know to look in nav.js. The breakpoint is architecturally orphaned from the documented system.

**Recommendation:** Document intentional split. The 1100px breakpoint is specifically for the navigation component (compact desktop at 200% DPI scale) and is self-contained within nav.js. Add a comment to nav.js at line 257 identifying this as a nav-internal breakpoint and noting it does not need coordination with the CSS layer. This formalizes the split rather than pretending it doesn't exist.

---

## SECTION 3 — COVERAGE GAPS

### Gap 1 — Height Queries Isolated to Homepage

**Finding:** The three height breakpoints (899px, 700px, 500px) exist only in index.html. No other page accommodates short viewports.

**Pages affected by short viewports that have no height handling:** about.html, pricing.html, what-we-believe.html, methodology.html, esa.html, ages.html, the-open-seat.html.

**Context for the homepage gap:** The height queries were added for a specific scenario — high-DPI laptops (200% scaling) where a 1080px physical display renders a 540px logical viewport height. The hero section on index.html is viewport-height-based (`min-height:100dvh`), making it highly sensitive to short viewports. Other pages are not height-constrained in the same way.

**Recommendation:** No immediate action required. The gap is asymmetric by design: the homepage has a full-viewport hero that demands height adaptation; other pages scroll normally and recover naturally. If a future page introduces a viewport-height-locked section, add height queries at that time.

---

### Gap 2 — Most Pages Use a Single Width Breakpoint

**Finding:** The majority of pages rely on 768px as their only width breakpoint:

- Single-breakpoint pages (768px only): 404.html, contact.html, pricing.html, privacy.html, scope.html, terms.html, what-we-believe.html, esa.html, methodology.html
- Two-breakpoint pages (768px + 1024px): about.html, the-open-seat.html, ages.html, account.html
- Richest breakpoint coverage: index.html (375px, 480px, 767px/768px, 1023px/1024px, 1439px + height tiers), css/library.css (480px, 768px, 1024px, 1280px)

**Assessment:** This is not a bug. Marketing pages with simple stacked layouts need only one breakpoint. The single-breakpoint pattern is appropriate for the content density on those pages. The homepage's richer coverage reflects its structural complexity (two-column hero, inline form, multiple animated sections).

**Recommendation:** Document intentional asymmetry. Single-breakpoint is the standard for simpler pages; richer coverage is added as component complexity requires it. This should be stated explicitly rather than appearing as an oversight.

---

### Gap 3 — No min-width Queries Anywhere

**Finding:** The entire codebase is desktop-last. All width-based media queries are `max-width`. There are zero `min-width` queries.

**Assessment:** This is an architectural choice, not a gap per se. Desktop-last works consistently here because the base styles are desktop styles and all narrower adjustments override downward. The risk is that mobile base styles accumulate overrides rather than being native — but this is endemic to desktop-last approaches, not a specific bug.

**Recommendation:** Document as the site's established pattern. Do not introduce min-width queries in isolation — mixing `max-width` and `min-width` in the same codebase without a clear rule produces breakpoint arithmetic errors. If a mobile-first section is ever built, document the convention shift explicitly.

---

### Gap 4 — 1280px Breakpoint Isolated to library.css

**Finding:** css/library.css:1106 uses `max-width:1280px` to reduce the book grid from 6 columns to 4 on large desktops. This breakpoint is unused on all other pages.

**Assessment:** The library page has a 6-column book grid that warrants an intermediate large-desktop tier. No other current page has a grid dense enough to need it. This is appropriate isolation.

**Recommendation:** No action. Document as library-specific. If a future page introduces a dense grid at a similar scale, use 1280px for consistency.

---

## SECTION 4 — BREAKPOINT SYSTEM SUMMARY

### De Facto Breakpoint Tiers

| Tier | Value | Role | Status |
|------|-------|------|--------|
| Micro | 375px | Index hero sphere only | Isolated; intentional micro-fix |
| Small mobile | 480px | Homepage + library + games + legal pages | Consistent where used |
| Mobile | 768px | Universal mobile threshold — used by all pages + nav JS | **System-wide primary** |
| Tablet | 1024px | Intermediate layout — homepage + several pages | Secondary; not universal |
| Compact desktop | 1100px | Nav only (JS-injected) | Nav-internal; undocumented in CSS system |
| Large desktop | 1280px | Library only | Library-specific |
| XL desktop | 1439px | Homepage hero typography only | Isolated; intentional |

### Height Tiers (Homepage Only)

| Tier | Value | Role |
|------|-------|------|
| Short viewport | 899px | Laptops at 200% DPI / ~900px display height |
| Very short | 700px | 200% DPI with ~700px height or smaller laptops |
| Extreme short | 500px | Landscape phones, very small laptops |

---

## SECTION 5 — CONFLICT RESOLUTION TABLE

| # | Conflict | Severity | Recommendation | Action |
|---|----------|----------|----------------|--------|
| 1 | 767px vs 768px in index.html (layout/type mismatch) | Medium | Consolidate to 768px — change lines 696 and 893 | Consolidate |
| 2 | 1023px vs 1024px in index.html (layout/type mismatch) | Medium | Consolidate to 1024px — change line 892 | Consolidate |
| 3 | JS `< 768` vs CSS `max-width:768px` (off-by-one) | Low | Change index.html:2458 to `<= 768` | Consolidate |
| 4 | OR vs AND hover query syntax across pages | Low | Standardize to OR syntax; centralize in base.css | Consolidate or document |
| 5 | 1100px nav breakpoint undocumented in CSS system | Low | Add comment in nav.js; formalize as nav-internal | Document intentional split |

---

## SECTION 6 — ITEMS NOT EXECUTED

Per PROMPT 4 specification: no files were modified. This is a report-only audit.

All five conflicts and four coverage gaps above are candidates for a Layer 3 Execution pass. Items 1, 2, and 3 are mechanical (low risk, deterministic). Items 4 and 5 require a judgment call from Amy before execution. Gap recommendations are documentation tasks, not code changes.

---

*RESPONSIVE_AUDIT_REPORT.md produced at repo root. No other file was modified.*
