# AUDIT — Homepage Design Cohesion + Performance

**Session** WP-AUX-01 · **Date** 2026-08-09 · **Model** Opus 5 standard
**Repo** `Wizkoo` @ `main` `4ba257e` · **Live target** https://wizkoo.com
**Status** Audit only. No fixes applied. Not committed.

---

## 0. Scope, method, and three premise corrections

### 0.1 Corrections to the order

The order named a repo and stack that do not match what is on disk. Recording this because it changes what the audit could measure.

| Order said | Actual | Consequence |
|---|---|---|
| Repo `wizkoo-app`, branch `master` | Repo `Wizkoo`, branch `main`, remote `github.com/Ethos25/Wizkoo.git` | None beyond naming. |
| "route + imported components + global styles/**Tailwind config**" | Static HTML. No bundler, no Tailwind, no config file. | **Part 1 category (a) "incl. Tailwind `rounded-*` classes" returns empty.** There are no utility classes to tabulate. Radius is audited from CSS declarations only. |
| Implied component render tree | `index.html` is a single 3,299-line file with 4 inline `<style>` blocks totalling ~1,900 lines, plus 6 linked stylesheets and 2 JS-injected components | The "render tree" is a file list, not a component graph. Enumerated in 0.2. |

### 0.2 The homepage render tree (established, not assumed)

Derived from `index.html`'s own `<link>` and `<script>` tags.

| # | Source | Role | Evidence |
|---|---|---|---|
| 1 | `index.html:159-1959` | Main inline `<style>`, ~1,800 lines | `index.html:159`, `:1959` |
| 2 | `index.html:1961-1986` | `<style id="hp-sky-system">` | `index.html:1961` |
| 3 | `index.html:1988-2059` | `<style id="hp-v5-design">` | `index.html:1988` |
| 4 | `index.html:2102-2167` | `<style id="hp-nav-overrides">` | `index.html:2102` |
| 5 | `css/footer.css` | linked | `index.html:2075` |
| 6 | `css/components.css` | linked | `index.html:2076` |
| 7 | `css/hero-sky.css` | linked | `index.html:2077` |
| 8 | `css/hero-window.css` | linked | `index.html:2078` |
| 9 | `css/constellation.css` | linked | `index.html:2079` |
| 10 | `css/orbital.css` | linked | `index.html:2080` |
| 11 | `components/nav.js` | injects nav markup + inline styles | `index.html:2090` |
| 12 | `components/footer.js` | injects footer markup + a `<style id="wf-styles">` block | `index.html:2762`, `components/footer.js:16` |

**Not in the tree, and this is the headline finding:** `css/tokens.css` and `css/base.css` exist in the repo and are **not linked from `index.html`**. Verified by exhaustive search of the file.

### 0.3 Method

- **Part 1** by scripted extraction over the 12 sources above, restricted to the four inline line-ranges so unrelated markup is excluded. Every count is a real occurrence with a `file:line` citation. Comment text stripped before matching.
- **Part 2** by Lighthouse **12.8.2** run locally against the live site, both form factors. The PageSpeed Insights API fallback named in the order was attempted first and returned **HTTP 429** (`"quota_limit_value": "0"` for keyless projects), so it was not usable. Local Chrome was present, so the primary path in the order was used instead.
- **Live DOM measurements** taken by executing JS against `https://wizkoo.com` in-browser. These are measurements, not estimates, and are labelled as such.
- Everything below distinguishes **measured** from **Lighthouse-estimated**. Lighthouse "Est savings" figures are its projections and are labelled `est.`

### 0.4 Build health check (not requested, but it gates everything)

`npm run build` **fails in the working tree** on 27 unaccounted root-level `.html` files (`sandbox*.html`, `founder-arrest-*.html`, `cta-*.html`, `granddad-playground.html`, `webgl-playground.html`, `index-villain.html`, `index-good-css.html`).

**This is not a production problem.** All 27 are untracked (`git status` shows `??`), so they never reach GitHub. Netlify builds from `HEAD`. Verified by extracting `HEAD` to a clean tree and building there:

```
Guard: 17 root-level .html files, 16 published, 1 declined, 0 unaccounted.
114 files published (694 of 808 stay out)
```

Production deploys are healthy. The local failure is working-tree noise only. Flagged because it will block any future local `npm run build` until those files are either added to `declined:` or removed.

---

## 1. Executive summary — top 5 fixes by impact

Ranked by user-visible harm, worst first.

### FIX 1 — 751 concurrent infinite CSS animations collapse the mobile main thread
**Impact: Performance 29/100 on mobile. Total Blocking Time 65,590 ms. Time to Interactive 98.0 s.**

Measured live on `https://wizkoo.com`: **4,222 DOM nodes, of which 751 are running infinite CSS animations simultaneously**, across **2,139 star elements**.

| Animation | Count | Source |
|---|---|---|
| `wk-sky-twinkle` | 420 | `css/hero-sky.css:40-49` |
| `wfTwinkle` | 290 | `components/footer.js:20-23`, applied at `:421`, `:429`, `:443`, `:458` |
| `wk-sky-atmo-breathe` | 10 | `css/hero-sky.css` |
| `wkc-scintillate` | 7 | `css/constellation.css` |
| `wk-sky-nebula-breathe`, `lo-breath` | 5 each | sky/orbital |
| `wk-sky-atmo-drift`, `wk-sky-wisp-drift` | 4 each | sky |
| `wk-sky-shoot` | 3 | sky |
| `kb-zoom` | 2 | `index.html:635`, `:1421` region |
| `breathe-and-shift` | 1 | inline |

Lighthouse mobile main-thread breakdown confirms where the time goes:

| Bucket | Time |
|---|---|
| Other | 55,520 ms |
| **Style & Layout** | **39,531 ms** |
| Rendering | 8,003 ms |
| Script Evaluation | 4,105 ms |
| Parse HTML & CSS | 209 ms |
| Garbage Collection | 182 ms |
| Script Parse & Compile | 128 ms |
| **Total** | **107.7 s** |

Script evaluation is only 4.1 s of 107.7 s. **This is not a JavaScript cost — it is style recalculation on 751 animated elements every frame.**

Both twinkle keyframes animate `opacity` only, which is normally compositor-friendly. Two things defeat that:

1. `css/hero-sky.css:43` sets `will-change: opacity` on **every** `.wk-sky__star`, forcing 420 separate compositor layers.
2. The 290 footer stars (`components/footer.js`) carry no `will-change`, so they repaint rather than composite.

Either way, 710 elements still require per-frame style recalc, which is the 39.5 s.

**Site-wide, not homepage-only.** `components/footer.js` is injected into every page (`publish-allowlist.txt`: "nav.js, footer.js — injected into every page"). The 290-star footer cost applies to all 16 published pages.

There is **no star-tier freeze in effect on `main`**. The live measurement confirms all 710 twinkle animations are active with `animation-iteration-count: infinite`.

---

### FIX 2 — Two JPEGs are 77% of page weight
**Impact: 1,487 KB of a 1,939 KiB page. Lighthouse est. savings 1,521 KiB.**

| Asset | Bytes on disk | Transferred | Rendered by |
|---|---|---|---|
| `assets/volcano_discovery.jpg` | 763,025 | 746 KB | `index.html:635` `.sr-bg-img` CSS background |
| `assets/turtle_discovery.jpg` | 758,466 | 741 KB | `index.html:2416` `<img class="ec-photo-img">` |

Both are baseline JPEG. Neither has a WebP or AVIF sibling, and neither uses `<picture>`/`srcset`. This is inconsistent with the hero, which is already done correctly: `images/hero-child-science-{600,1000,1200}.{jpg,webp}` served via `<picture>` at `index.html:2262-2264`, and which Lighthouse confirms as a well-behaved LCP element.

Additional per-audit detail:
- `modern-image-formats`: est. 642 KB + 637 KB savings.
- `uses-optimized-images`: est. 508 KB + 510 KB savings (i.e. they are oversized *even as JPEG*).
- `uses-responsive-images` (mobile): `turtle_discovery.jpg` alone wastes est. 497 KB at mobile viewport, because a single full-size file is served to every screen.

**Neither image is the LCP element**, so this does not currently move LCP much. It is pure bandwidth cost, and it is the entire reason the page is ~1.9 MB.

---

### FIX 3 — Two competing token systems, and the real one is not loaded
**Impact: root cause of most of Part 1. Every value below is a downstream symptom.**

`css/tokens.css` is a complete, well-organised design system: colour ramp, spacing scale, type scale, a four-step shadow scale, easing, and subject palettes. **`index.html` never links it.**

Instead `index.html:160-167` declares its own `:root` with a **subset** of the names and **different values**:

| Token | `css/tokens.css` | `index.html:162-163` | Delta |
|---|---|---|---|
| `--body-size` | `1.05rem` | `0.85rem` | −0.20rem |
| `--small-size` | `0.95rem` | `0.82rem` | −0.13rem |
| `--tag-size` | `0.6rem` | `0.58rem` | −0.02rem |
| `--button-size` | `0.78rem` | `0.68rem` | −0.10rem |

It also introduces `--expo` and `--snap` (`index.html:164`) which duplicate `--ease` / `--ease-out-expo` already defined in `tokens.css:69-71`.

And it **omits** the entire spacing scale, the four shadow tokens, and `--saffron-deep` / `--saffron-pale`. That omission is precisely why the homepage has 48 distinct hand-written `box-shadow` values (§2.6) and no consistent section rhythm (§2.3): the tokens that would have prevented it exist but are out of scope on this page.

Lighthouse also flags the inline `:root` block: `unused-css-rules` reports **11 KiB unused** out of a 23 KB inline block (desktop), 10 KiB (mobile).

---

### FIX 4 — One section is authored entirely outside the design system
**Impact: both accessibility failures, and the only off-brand font on the site.**

`index.html:398-571` (the `.plan-founder` block) uses **`Inter`** in 4 declarations:

`index.html:404`, `:454`, `:538`, `:569` — all `font-family: 'Inter', sans-serif;`

**Inter is not in the canonical set** (Sora / Fraunces / Plus Jakarta Sans / Space Mono) and **is not in the Google Fonts request** at `index.html:14`. It therefore renders in whatever generic sans-serif the OS supplies, differing per platform.

The same block owns **both** of the site's accessibility failures:

| Element | Measured contrast | Colour | Source |
|---|---|---|---|
| `.pf-villain-vertical` | **2.58:1** | `rgba(12,16,32,0.4)` on linen, 9px | `index.html:398-410` |
| `.pf-founder-note` | **2.26:1** | `rgba(12,16,32,0.35)` on linen, 10px | `index.html:453-462` |

Both alphas (`0.4`, `0.35`) match no token. `tokens.css` defines `--ink-45` (0.45) and `--ink-28` (0.28); these sit between them.

---

### FIX 5 — Render-blocking GSAP and the font request
**Impact: est. 1,240 ms mobile, 720 ms desktop, on First Contentful Paint.**

| Resource | Mobile est. | Desktop est. | Source |
|---|---|---|---|
| `cdnjs.cloudflare.com/.../gsap.min.js` (26 KB) | 1,108 ms | 425 ms | `index.html:15` |
| `fonts.googleapis.com/css2?...` (1 KB) | 902 ms | 322 ms | `index.html:14` |

GSAP is loaded **synchronously in `<head>`** with no `defer`, unlike all 8 first-party scripts, which are correctly deferred (`index.html:2763-2771`). It is also a third-party origin with no `preconnect`, and it produces 3 of the 20 mobile long tasks (2,293 ms + 826 ms + 530 ms).

---

## 2. PART 1 — Design token audit

### 2.1 Category (a) — `border-radius`

**8 distinct values, 48 occurrences.** No Tailwind `rounded-*` classes exist (see §0.1).

| Count | Value | Locations (first 8) |
|---:|---|---|
| 37 | `50%` | `index.html:174, 181, 209, 219, 231, 237, 249, 260` (+29) |
| 3 | `2px` | `css/hero-window.css:72, 94, 140` |
| 2 | `4px` | `index.html:518, 1238` |
| 2 | `1px` | `css/hero-sky.css:118`, `components/nav.js:226` |
| 1 | `40%` | `index.html:259` |
| 1 | `12px` | `index.html:316` |
| 1 | `16px` | `index.html:667` |
| 1 | `6px` | `index.html:673` |

**Outliers (≤2 uses):** all six non-`50%` values. This is the *healthiest* category: one dominant value carrying 77% of usage.

**Near-duplicates:** `40%` vs `50%` (`index.html:259` — a 200×200px orb, so 40% and 50% are visually near-identical); `6px` vs `4px`; `16px` vs `12px`.

### 2.2 Category (b) — spacing on section-level containers

Extracted for container-level selectors only (`.hz1`, `.hz2`, `.ec-section`, `.nap-section`, `.faq-section`, `.same-room`, `.cta-dark`, `.pricing-editorial-v2`, `.hh`).

**Desktop vertical rhythm — no shared value:**

| Section | Padding | Source |
|---|---|---|
| `.cta-dark` | `120px 48px` | `index.html:739` |
| `.pricing-editorial-v2` | `96px 120px 88px` | `index.html:1907` |
| `.hz2` | `96px 0 16px` | `index.html:1027` |
| `.same-room` | `padding-top: 80px` | `index.html:637` |
| `.nap-section` | `clamp(60px, 8vh, 100px) 48px` | `index.html:1167` |
| `.ec-section` | `0` | `index.html:877` |
| `.hz1` | `0` | `index.html:1016` |

Five different vertical paddings: **120 / 96 / 88 / 80 / clamp(60–100)**, plus two zeroes.

**Desktop horizontal gutter — four values:** `48px` (`:739`, `:1167`, `:1017`), `120px` (`:1907`), `32px` (`:1030`), `0` (`:1027`).

**Mobile — six different values:**

| Section | Mobile padding | Source |
|---|---|---|
| `.pricing-editorial-v2` | `80px 24px` | `index.html:1943` |
| `.cta-dark` | `64px 20px` | `index.html:808` |
| `.nap-section` | `60px 24px` | `index.html:1311` |
| `.faq-section` | `48px 20px` | `index.html:803` |
| `.hz2` | `28px 0 48px` | `index.html:1044` |
| `.same-room` | `28px 16px` | `index.html:788` |
| `.same-room-wrap` | `24px 16px` | `index.html:787` |

`tokens.css:23-27` already defines `--section-pad: 80px`, `--section-pad-mobile: 48px`, `--content-pad: 48px`, `--content-pad-mobile: 24px`. **None is used**, because `tokens.css` is not loaded.

**`gap` — 25 distinct values, 56 occurrences.** Top: `8px`(7), `24px`(6), `16px`(5), `12px`(4), `14px`(3), `48px`(3). Outliers (≤2): `5px`, `9px`, `13px`, `18px`, `22px`, `26px`, `110px`, `6px`, `10px`, `60px`, `4px`, `32px`, `40px`, `64px`, `80px`, `clamp(24px,3vh,34px)`, `clamp(40px,5vw,80px)`, `calc(var(--u) * 12)`.

Note `9px`, `13px`, `14px`, `18px`, `22px`, `26px` — off any 4px or 8px grid.

**`padding` overall: 88 distinct values across 110 occurrences.** Nearly every padding declaration is unique.

### 2.3 Category (c) — type

**Families — 12 distinct declaration strings for 5 actual families:**

| Count | Declared value |
|---:|---|
| 39 | `Space Mono,monospace` |
| 20 | `Sora,sans-serif` |
| 16 | `Fraunces,serif` |
| 12 | `Space Mono, monospace` |
| 11 | `Fraunces, serif` |
| 8 | `Plus Jakarta Sans,sans-serif` |
| 7 | `Sora, sans-serif` |
| 7 | `Plus Jakarta Sans, sans-serif` |
| 6 | `Plus Jakarta Sans,system-ui,-apple-system,sans-serif` |
| **4** | **`Inter, sans-serif`** — off-palette, see FIX 4 |
| 2 | `Plus Jakarta Sans, system-ui, sans-serif` |
| 1 | `Space Mono,monospace!important` |

Whitespace differences are cosmetic. **Fallback-stack differences are not.** Plus Jakarta Sans has **four different fallback chains** (`:697` vs `:711` vs `:899` vs `css/orbital.css:328`), which render differently when the webfont fails.

**Weights not delivered by the font request.** `index.html:14` loads Sora 200/600/700/800, Fraunces upright 400/600/700 (italic 300/500/600), Plus Jakarta Sans 400/500, Space Mono 400/700. These declarations ask for weights that are not loaded, so the browser synthesises or substitutes:

| Declared | Count | Locations |
|---|---:|---|
| `Fraunces @ 300` | 3 | `index.html:640, 709, 1335` |
| `Fraunces @ 800` | 3 | `index.html:1605, 1912, 1935` |
| `Plus Jakarta Sans @ 300` | 3 | `index.html:1022, 1154, 1916` |

`Fraunces @ 300` at `index.html:640` and `:709` is on `.same-room h2` and `.faq-left h2` — two of the largest headings on the page.

**Sizes — 96 distinct values, 193 occurrences, resolving to 53 distinct computed pixel sizes.**

Top: `10px`(17), `0.72rem`(7), `9px`(7), `0.82rem`(5), `16px`(5), `18px`(5), `11px`(5), `28px`(5), `15px`(5), `13px`(5).

**Unit collisions — the same computed size written two ways:**

| Computed | Notations | Locations |
|---|---|---|
| 8px | `0.5rem`(×3) + `8px`(×3) | `index.html:322,353,365` / `index.html:676,940`, `components/nav.js:276` |
| 16px | `16px`(×5) + `1rem`(×3) | `index.html:611,714,1215,1916,1928` / `:300,703,777` |
| 24px | `1.5rem`(×1) + `24px`(×1) | `index.html:800` / `:1224` |
| 32px | `32px`(×3) + `2rem`(×2) | `index.html:600,646,687` / `:768,978` |
| 36px | `36px`(×2) + `2.25rem`(×1) | `index.html:720,775` / `:841` |
| 72px | `4.5rem`(×1) + `72px`(×1) | `index.html:640` / `:1935` |

**The micro-type ramp.** From 6px through 16px there are **31 distinct computed sizes**, with gaps as small as **0.02px**:

```
6 · 6.5 · 6.72 · 7 · 7.2 · 7.5 · 7.68 · 8 · 8.5 · 9 · 9.12 · 9.6 · 9.92 · 10
· 10.24 · 10.88 · 11 · 11.2 · 11.52 · 12 · 12.16 · 12.48 · 12.5 · 12.8 · 13 · 13.12 …
```

`12.48px` (`0.78rem`) and `12.5px` are **0.02px apart**. `9.92px` (`0.62rem`) and `10px` are 0.08px apart. These differences are not perceptible; they are accumulated drift, not design intent.

**Weights — 9 distinct values, 95 occurrences:** `400`(24), `600`(17), `500`(17), `700`(15), `300`(8), `800`(7), `200`(5), `500!important`(1, `index.html:2018`), `400!important`(1, `components/footer.js:230`).

### 2.4 Category (d) — colour, diffed against canonical

**50 distinct hex values + 140 distinct rgba values = 190 distinct colour literals in the render tree.**

Canonical set taken from `css/tokens.css` and the documented subject palette at `js/constellation.js:45-50`.

**On-palette (13 hex values, 94 occurrences):**

| Count | Hex | Token |
|---:|---|---|
| 39 | `#E8AF38` | `--saffron` |
| 25 | `#0C1020` | `--ink` |
| 8 | `#F8F4E9` | `--linen` / `--cream` / `--warm-bg` |
| 6 | `#FAFAFA` | `--paper` |
| 2 | `#4A4850` | `--mid` |
| 2 | `#A8A6B0` | `--faint` |
| 2 ea. | `#3848D0` `#E8D800` `#38B060` `#C83030` `#8848E0` | subject palette, `js/constellation.js:45-50` |
| 1 | `#E0DED6` | `--rule` |
| 1 | `#2868CC` | `--day-sky` |

The subject palette is used **correctly and consistently** at `index.html:900-911`. This is the one part of the colour system that holds.

**One subject-palette extension is undocumented:** `#F08A20` (Health) at `index.html:905`, `:911`. The canonical source at `js/constellation.js:45-50` defines Reading, Writing, Math, Science, Art, Geography. **Health has no entry there.** Either the canonical list is stale or this colour was added ad hoc.

**Off-palette (37 hex values).** The most consequential cluster:

**Eight near-identical warm off-whites where the system defines one linen:**

| Hex | Count | Source |
|---|---:|---|
| `#F8F4E9` | 8 | canonical `--linen` |
| `#FBF7EB` | 6 | `index.html:1234, 1330, 1331` |
| `#F4EEDF` | 1 | `index.html:667` |
| `#FFFDF8` | 1 | `index.html:673` |
| `#EAE6D8` | 1 | `index.html:677` |
| `#F2F0EA` | 1 | `index.html:892` |
| `#FFF8E7` | 1 | `index.html:1168` |
| `#FFFAE8` | 1 | `components/footer.js:52` |

`tokens.css` defines exactly two warm neutrals for this job: `--linen: #F8F4E9` and `--saffron-pale: #FFF9EE`. Seven of the eight above are neither.

**Untokenised UI greys/blues used repeatedly** (these are legitimate colours that simply have no token):

| Hex | Count | Source |
|---|---:|---|
| `#F0F2F8` | 8 | `index.html:750, 1020, 2128, 2131, 2147`, `components/footer.js:38, 91, 150` |
| `#8C91A5` | 7 | `index.html:211, 302, 322, 332, 748, 1018, 1078` |
| `#C8CDDA` | 3 | `index.html:749, 1038`, `css/orbital.css:338` |
| `#101830` | 2 | `index.html:1027` region |

**Shorthand/absolute inconsistency:** `#000`(4, `css/hero-window.css:145,147`), `#FFFFFF`(2, `index.html:1168,1172`), `#FFF`(1, `index.html:316`), `#AAA`(1, `index.html:349`). Three notations for white in one render tree.

**Remaining single-use off-palette (one occurrence each):** `#FDE9A0` `#F0C050` `#C89030` `#A07020` `#7A7F93` `#9B8AF4` `#E06C53` `#4A9E78` `#7CB4B8` `#E294A5` `#141310` `#2A2F45` `#6BBF6B` `#182848` `#7288B4` `#97ABD0` `#E8EEF8` `#FFE899` `#FFBC50` `#FF8F30` `#F0C45A`.

Many are gradient stops in the sky/hero-window subsystem, which is a defensible sub-palette. It is nonetheless undocumented and untokenised.

### 2.5 Category (e) — `box-shadow`

**48 distinct values, 63 occurrences.** After removing 12 `none` / `none!important` resets, that is roughly **36 distinct shadows for 51 real uses** — almost every shadow on the page is unique.

Repeated values (the only ones used more than once):

| Count | Value | Source |
|---:|---|---|
| 9 | `none!important` | `index.html:2026, 2035, 2048, 2119, 2144`, `components/nav.js:128, 145, 180` (+1) |
| 3 | `none` | `index.html:169`, `css/hero-sky.css:92`, `components/nav.js:209` |
| 2 | `8px 8px 0 var(--saffron)` | `index.html:214`, `css/components.css:15` |
| 2 | `10px 10px 0 var(--saffron)` | `css/components.css:31, 58` |
| 2 | `0 8px 40px rgba(232,175,56,0.45),0 0 60px rgba(232,175,56,0.2)` | `index.html:227, 230` |
| 2 | `0 0 6px 3px rgba(255,248,224,0.35)` | `index.html:851, 872` |

**The hard-offset saffron shadow exists at three sizes for one idea:** `6px 6px 0` (`index.html:213`), `8px 8px 0` (`index.html:214`, `css/components.css:15`), `10px 10px 0` (`css/components.css:31, 58`).

**The saffron glow exists at six variants:**
`0 4px 24px …0.3` + `0 0 40px …0.12` (`:224`) · `0 8px 40px …0.45` + `0 0 60px …0.2` (`:227`) · `0 4px 24px …0.35` (`:242`) · `0 10px 44px …0.5` (`:246`) · `0 10px 44px …0.5` + `0 0 60px …0.25` (`:248`) · `0 4px 20px …0.3` / `0 8px 30px …0.4` (`:743`).

`tokens.css:44-48` already defines `--shadow-soft`, `--shadow-card`, `--shadow-elevated`, `--shadow-saffron-glow`. **Zero of the four are used on the homepage.**

The nine `none!important` resets are a symptom: shadows are being applied broadly and then unset, rather than applied deliberately.

### 2.6 Category (f) — `max-width` / container widths

**26 distinct values, 47 occurrences.**

| Count | Value | Locations |
|---:|---|---|
| 7 | `1200px` | `index.html:707, 1017, 1360, 1908`, `components/footer.js:136, 270, 278` |
| 6 | `100%` | `index.html:774, 899, 924, 925, 928, 1108` |
| 4 | `none` | `index.html:878, 1071, 1145, 1898` |
| 3 | `640px` | `index.html:289, 714, 1775` |
| 2 ea. | `680px` `600px` `1100px` `960px` `440px` | see appendix |
| 1 ea. | `var(--max-width)` `720px` `1400px` `800px` `550px` `900px` `1000px` `820px` `280px` `700px` `480px` `320px` `380px` `200px` `340px` `45%` `560px` | see appendix |

**Two problems:**

1. **`1200px` is written literally 7 times** while `--max-width: 1200px` is declared at `index.html:163` and used **once**, at `index.html:267`. The token exists and is bypassed.
2. **A seven-value reading-measure cluster:** `550px` `560px` `600px` `640px` `680px` `700px` `720px`. These are all "a column of body text", differing by up to 170px with no rule governing which applies where.

Container widths similarly cluster: `900px` `960px` `1000px` `1100px` `1200px` `1400px`.

### 2.7 Heading hierarchy consistency

**Requested check: same semantic level = same size/weight/family across sections. It does not hold.**

**`h2` — four incompatible treatments:**

| Selector | Family | Size | Weight | Source |
|---|---|---|---|---|
| `.same-room h2` | Fraunces | `4.5rem` (72px) | **300** (not loaded) | `index.html:640` |
| `.faq-left h2` | Fraunces | `48px` | **300** (not loaded) | `index.html:709` |
| `.c1-h2` | Fraunces | `38px` | **600** | `index.html:664` |
| `.cta-dark h2` | **Sora** | `3.8rem` (60.8px) | **200** | `index.html:741` |

Sizes span **38px to 72px** — a 1.9× range at the same semantic level. Weight spans 200 to 600. One of the four switches family entirely.

**`h1` — two treatments in different families:**

| Selector | Family | Size | Weight | Source |
|---|---|---|---|---|
| `.hero-sticky h1` | Sora | (inherited) | (inherited) | `index.html:274` |
| `.hz1-h1` | **Plus Jakarta Sans** | `clamp(2.2rem, 3.4vw, 3.2rem)` | **700** | `index.html:1020` |

**`h3` — single treatment**, `.faq-q-block h3`: Sora, 18px, 600 (`index.html:713`). Consistent, but it is the only one.

**Mobile overrides add a fifth and sixth h2 size:** `.same-room h2` → `1.6rem` (`:631`), `.faq-section h2` → `1.4rem` (`:646`), `.cta-dark h2` → `1.8rem` (`:651`) and `2.6rem` (`:609`), `.c1-h2` → `32px` (`:529`), `.faq-left h2` → `36px` (`:562`).

### 2.8 Proposed token scales

Per the order, **every proposed value is drawn from a dominant existing value**. Nothing invented.

**Radius**
```css
--r-sm:   2px;   /* 3 uses — hero-window hairlines           */
--r-md:   4px;   /* 2 uses                                   */
--r-lg:  12px;   /* 1 use — card scale                       */
--r-full: 50%;   /* 37 uses — dominant                       */
```

**Type scale** (px, from the dominant observed values)
```css
--fs-eyebrow: 10px;  /* 17 uses — dominant micro size        */
--fs-caption: 13px;  /* 5 uses                               */
--fs-body:    16px;  /* 8 uses (16px ×5 + 1rem ×3)           */
--fs-body-lg: 18px;  /* 5 uses                               */
--fs-h3:      20px;  /* 4 uses                               */
--fs-h2-sm:   26px;  /* 4 uses                               */
--fs-h2:      32px;  /* 5 uses (32px ×3 + 2rem ×2)           */
--fs-h1-sm:   48px;  /* 4 uses                               */
--fs-h1:      72px;  /* 2 uses (4.5rem + 72px)               */
```
This collapses 53 computed sizes to 9. The 26-value micro-ramp below 16px collapses into `--fs-eyebrow` and `--fs-caption`.

**Spacing** (existing dominant values; `tokens.css:23-27` already holds these)
```css
--gutter:         48px;  /* dominant desktop horizontal      */
--gutter-mobile:  24px;
--section-pad:    96px;  /* dominant desktop vertical        */
--section-pad-mob:48px;
--gap-xs: 8px; --gap-sm: 12px; --gap-md: 16px; --gap-lg: 24px; --gap-xl: 48px;
```

**Shadow** — adopt the four already in `tokens.css:44-48` rather than defining new ones, plus the hard-offset family collapsed to its middle value:
```css
--shadow-hard: 8px 8px 0 var(--saffron);   /* collapses 6/8/10px */
/* + --shadow-soft, --shadow-card, --shadow-elevated, --shadow-saffron-glow
     already defined in tokens.css:44-48 and currently unused */
```

**Widths**
```css
--container:        1200px;  /* 7 uses — dominant            */
--container-narrow:  960px;  /* 2 uses                       */
--measure:           640px;  /* 3 uses — dominant text column*/
```

### 2.9 Remediation map

Ordered by category. `→` reads "replace with".

**Prerequisite (blocks everything else):** add `<link rel="stylesheet" href="css/tokens.css">` to `index.html` **before** line 159, then delete the duplicate declarations at `index.html:160-167`, reconciling the four differing values in FIX 3 as a deliberate decision.

**Radius**

| Outlier | File:line | → |
|---|---|---|
| `40%` | `index.html:259` | `var(--r-full)` |
| `6px` | `index.html:673` | `var(--r-md)` |
| `16px` | `index.html:667` | `var(--r-lg)` |
| `12px` | `index.html:316` | `var(--r-lg)` |
| `4px` | `index.html:518, 1238` | `var(--r-md)` |
| `1px` | `css/hero-sky.css:118`, `components/nav.js:226` | `var(--r-sm)` |
| `2px` | `css/hero-window.css:72, 94, 140` | `var(--r-sm)` |
| `50%` ×37 | throughout | `var(--r-full)` |

**Typography**

| Outlier | File:line | → |
|---|---|---|
| `'Inter', sans-serif` | `index.html:404, 454, 538, 569` | `var(--font-body)` = Plus Jakarta Sans stack |
| `Fraunces @ 300` | `index.html:640, 709, 1335` | weight `400`, or add 300 to `index.html:14` |
| `Fraunces @ 800` | `index.html:1605, 1912, 1935` | weight `700`, or add 800 to `index.html:14` |
| `Plus Jakarta Sans @ 300` | `index.html:1022, 1154, 1916` | weight `400`, or add 300 to `index.html:14` |
| 4 PJS fallback stacks | `index.html:697, 711, 899`, `css/orbital.css:328` | one canonical stack |
| `0.5rem` | `index.html:322, 353, 365` | `var(--fs-eyebrow)` |
| `1rem` | `index.html:300, 703, 777` | `var(--fs-body)` |
| `2rem` | `index.html:768, 978` | `var(--fs-h2)` |
| `2.25rem` | `index.html:841` | `var(--fs-h2)` |
| `1.5rem` | `index.html:800` | `var(--fs-h2-sm)` |
| `4.5rem` | `index.html:640` | `var(--fs-h1)` |
| micro-ramp `0.42/0.45/0.48/0.57/0.6/0.62rem`, `6/6.5/7/7.5/8.5px` | see appendix A3 | `var(--fs-eyebrow)` |
| `500!important` | `index.html:2018` | remove `!important` |
| `400!important` | `components/footer.js:230` | remove `!important` |

**Heading hierarchy**

| Divergence | File:line | → |
|---|---|---|
| `.same-room h2` 72px/300 | `index.html:640` | `var(--fs-h1)` / weight 400 |
| `.faq-left h2` 48px/300 | `index.html:709` | `var(--fs-h1-sm)` / weight 400 |
| `.c1-h2` 38px/600 | `index.html:664` | `var(--fs-h1-sm)` / weight 600 |
| `.cta-dark h2` Sora 60.8px/200 | `index.html:741` | decide: Fraunces (matching the other three) or document Sora as the dark-section exception |
| `.hz1-h1` Plus Jakarta Sans/700 | `index.html:1020` | Sora, matching `.hero-sticky h1` at `:274` |

**Colour**

| Outlier | File:line | → |
|---|---|---|
| `#FBF7EB` | `index.html:1234, 1330, 1331` | `var(--linen)` |
| `#F4EEDF` | `index.html:667` | `var(--linen)` |
| `#FFFDF8` | `index.html:673` | `var(--saffron-pale)` |
| `#EAE6D8` | `index.html:677` | `var(--rule)` or `var(--linen)` |
| `#F2F0EA` | `index.html:892` | `var(--linen)` |
| `#FFF8E7` | `index.html:1168` | `var(--saffron-pale)` |
| `#FFFAE8` | `components/footer.js:52` | `var(--saffron-pale)` |
| `#F0F2F8` ×8 | `index.html:750, 1020, 2128, 2131, 2147`, `components/footer.js:38, 91, 150` | promote to `--sky-fg` in `tokens.css` |
| `#8C91A5` ×7 | `index.html:211, 302, 322, 332, 748, 1018, 1078` | promote to `--sky-dim` in `tokens.css` |
| `#C8CDDA` ×3 | `index.html:749, 1038`, `css/orbital.css:338` | promote to `--sky-mid` in `tokens.css` |
| `#000` | `css/hero-window.css:145, 147` | `#000000`, or `var(--ink)` |
| `#FFF` / `#FFFFFF` / `#AAA` | `index.html:316, 349, 1168, 1172` | one notation |
| `#F08A20` (Health) | `index.html:905, 911` | add to `js/constellation.js:45-50` or remove the subject |
| `rgba(12,16,32,0.4)` | `index.html:408` | `var(--ink-45)` **and** raise for contrast (see below) |
| `rgba(12,16,32,0.35)` | `index.html:458` | `var(--ink-45)` **and** raise for contrast |

**Accessibility (contrast) — these are behaviour changes, not renames:**

| Element | Now | Needs | File:line |
|---|---|---|---|
| `.pf-villain-vertical` | 2.58:1 @ 9px | ≥4.5:1 | `index.html:408` |
| `.pf-founder-note` | 2.26:1 @ 10px | ≥4.5:1 | `index.html:458` |
| `.plan-eyebrow-text` | 1.79:1 @ 7.68px | ≥4.5:1 | `index.html:314` |

`.plan-eyebrow-text` is the important one: it is **`var(--saffron)` on `var(--linen)`**, both canonical. **The brand's own saffron-on-linen pairing measures 1.79:1 and cannot carry small text.** That is a design-system decision, not a bug to patch locally. Every other saffron-on-linen text instance on the site has the same problem.

**Shadow**

| Outlier | File:line | → |
|---|---|---|
| `6px 6px 0 var(--saffron)` | `index.html:213` | `var(--shadow-hard)` |
| `10px 10px 0 var(--saffron)` | `css/components.css:31, 58` | `var(--shadow-hard)` |
| 6 saffron-glow variants | `index.html:224, 227, 242, 246, 248, 743` | `var(--shadow-saffron-glow)` (`tokens.css:47`) |
| ~30 single-use shadows | see appendix A5 | map to `--shadow-soft` / `--shadow-card` / `--shadow-elevated` |
| 9 × `none!important` | `index.html:2026, 2035, 2048, 2119, 2144`, `components/nav.js:128, 145, 180` (+1) | remove once the source rules stop over-applying |

**Widths**

| Outlier | File:line | → |
|---|---|---|
| `1200px` literal ×7 | `index.html:707, 1017, 1360, 1908`, `components/footer.js:136, 270, 278` | `var(--container)` |
| `1400px` | `index.html:637` | `var(--container)` |
| `1100px` | `index.html:373, 999` | `var(--container)` |
| `1000px`, `900px` | `index.html:666, 662` | `var(--container-narrow)` |
| `550px` `560px` `600px` `680px` `700px` `720px` | `index.html:642, 1810, 311, 594, 299, 1000, 741, 274` | `var(--measure)` |

**Spacing** — replace the 7 desktop and 7 mobile section paddings (§2.3) with `var(--section-pad)` / `var(--section-pad-mobile)` and `var(--gutter)` / `var(--gutter-mobile)`; map the 25 `gap` values onto the 5-step gap scale.

---

## 3. PART 2 — Performance

### 3.1 Scores

Lighthouse **12.8.2**, run locally against `https://wizkoo.com` (redirects to `https://www.wizkoo.com/`).
Desktop fetched `2026-08-09T19:29:14Z`; mobile `2026-08-09T19:30:33Z`.

| | Desktop | Mobile |
|---|---:|---:|
| **Performance** | **85** | **29** |
| **Accessibility** | **95** | **96** |
| **Best Practices** | **100** | **100** |
| **SEO** | **100** | **100** |

| Metric | Desktop | Mobile |
|---|---:|---:|
| First Contentful Paint | 1.5 s | 3.6 s |
| **Largest Contentful Paint** | **2.0 s** | **8.2 s** |
| **Cumulative Layout Shift** | **0.013** | **0.007** |
| **Total Blocking Time** | **70 ms** | **65,590 ms** |
| Speed Index | 1.5 s | 12.3 s |
| Time to Interactive | 2.1 s | 98.0 s |
| Max Potential FID | 190 ms | 2,550 ms |
| **Total page weight** | **1,939 KiB** | **1,923 KiB** |

Throttling: desktop `rttMs 40 / 10,240 Kbps / cpuSlowdown 1`; mobile `rttMs 150 / 1,638 Kbps / cpuSlowdown 4`.

**CLS is excellent on both.** 0.013 and 0.007 against a 0.1 threshold. Two shifts on desktop (`.hh-copy`, `.announce-text`), both harmless.

**The desktop/mobile gap is the story.** 85 → 29 is not a bandwidth difference; page weight is effectively identical (1,939 vs 1,923 KiB). It is the 4× CPU slowdown meeting 751 concurrent animations. See FIX 1.

### 3.2 Largest assets by bytes (identical set both runs)

| Bytes | Asset | Repo source |
|---:|---|---|
| 746 KB | `assets/volcano_discovery.jpg` | rendered by `index.html:635` |
| 741 KB | `assets/turtle_discovery.jpg` | rendered by `index.html:2416` |
| 80 KB | Fraunces woff2 | `index.html:14` |
| 66 KB | Fraunces woff2 (2nd cut) | `index.html:14` |
| 63 KB | `images/hero-child-science-1200.webp` (desktop) | `index.html:2262-2264` |
| 47 KB | `images/hero-child-science-1000.webp` (mobile) | `index.html:2262-2264` |
| 44 KB | the HTML document | `index.html` |
| 39 KB | `js/orbital.js` | `index.html:2768` |
| 33 KB | Sora woff2 | `index.html:14` |
| 27 KB | Plus Jakarta Sans woff2 | `index.html:14` |
| 26 KB | `gsap.min.js` (cdnjs) | `index.html:15` |

**Two Fraunces cuts total 146 KB** — the second is the italic axis requested at `index.html:14` (`ital,opsz,wght@1,9..144,300;500;600`). Worth confirming all three italic weights are used.

### 3.3 Render-blocking resources

| Resource | Mobile est. | Desktop est. | Source |
|---|---:|---:|---|
| Google Fonts CSS | 902 ms | 322 ms | `index.html:14` |
| `gsap.min.js` | 1,108 ms | 425 ms | `index.html:15` |
| **Total est. savings** | **1,240 ms** | **720 ms** | |

`index.html:15` has no `defer`/`async`, no `preconnect` to `cdnjs.cloudflare.com`. All 8 first-party scripts *are* deferred (`index.html:2763-2771`), so this is a single inconsistent line.

### 3.4 Images

| Audit | Desktop est. | Mobile est. |
|---|---:|---:|
| `modern-image-formats` | 1,521 KiB | 1,521 KiB |
| `uses-optimized-images` | 1,018 KiB | 1,018 KiB |
| `uses-responsive-images` | 37 KiB | 497 KiB |

**Important correction to Lighthouse's own list.** `modern-image-formats` also flags 8 base64 PNG data URIs (195 KB + 11 + 11 + 10 ×5). **These are not shipped assets and there is no file to optimise.** They are generated at runtime by `js/orbital.js` via `toDataURL('image/png')` at `js/orbital.js:1380` and `js/orbital.js:1808` — procedural sphere textures for the orbital diagram. The 195 KB one is a 512×512 texture; the 10-11 KB ones are 96×96.

They still cost decode time and memory, and `js/orbital.js:1918` already carries a comment contemplating `toBlob` instead. But **they must not be added to an image-conversion task list**; the fix, if any, is texture size or encoding path.

### 3.5 JavaScript

| Audit | Desktop | Mobile |
|---|---|---|
| `unused-javascript` | **pass (score 1)** | **pass (score 1)** |
| `legacy-javascript` | pass | pass |
| `uses-text-compression` | pass | pass |
| `unminified-javascript` | fail — est. 25 KiB (`js/orbital.js`) | fail |
| `unminified-css` | fail — est. 19 KiB total | fail |
| `bootup-time` | 0.3 s | **4.0 s** |
| `mainthread-work-breakdown` | 2.0 s | **107.7 s** |
| `long-tasks` | 3 | **20** |

**There is no unused-JavaScript problem.** Both runs score 1. The order asked for unused JS specifically; the answer is that it is clean, and the JS problem is entirely execution and animation cost, not dead code.

Mobile bootup by source:

| Source | Total | Scripting |
|---|---:|---:|
| the document itself | 97,723 ms | 674 ms |
| `gsap.min.js` | 3,777 ms | 126 ms |
| Unattributable | 2,744 ms | 198 ms |
| `js/orbital.js` | 2,549 ms | 2,425 ms |
| `js/orbital-sky.js` | 336 ms | 333 ms |
| `js/hero-sky.js` | 150 ms | 139 ms |
| `components/footer.js` | 97 ms | 21 ms |

The document's 97.7 s total against only 674 ms of scripting is the signature of **CSS animation driving the main thread**, not script.

Unminified detail: `js/orbital.js` est. 25 KiB; `css/orbital.css` est. 8 KiB; inline `:root` block est. 7 KiB; `css/hero-window.css` est. 5 KiB. There is no build step for CSS/JS (the allowlist copies files verbatim), so minification would require adding one.

### 3.6 Accessibility failures

Two failing audits, identical on both runs (desktop 95, mobile 96; the 1-point difference is `pf-villain-vertical` not being rendered at mobile width).

**`color-contrast`** — detailed in §2.9. Measured ratios 1.79:1, 2.26:1, 2.58:1 against a 4.5:1 requirement.

**`label-content-name-mismatch`** — visible text is not contained in the accessible name:

| Element | Visible text | `aria-label` | Source |
|---|---|---|---|
| `a.nav-wm` | "wizkoo" | `"Home"` | `components/nav.js` (rendered `index.html:2090`) |
| `a.lw` | "THIS WEEK'S WINDOW / Build a week for Maya, 6, in Georgia exploring space…" | `"Build our week"` | `index.html` hero living-window |

This breaks voice control: a user saying "click wizkoo" or "click this week's window" will not match. Fix by making the `aria-label` contain the visible string.

### 3.7 Cross-reference — every performance flag to its repo source

| Flag | Measured / est. | Responsible source |
|---|---|---|
| TBT 65,590 ms, TTI 98 s, Style&Layout 39.5 s | measured | `css/hero-sky.css:40-49` (420 stars, `will-change:opacity` at `:43`); `components/footer.js:20-23, 421, 429, 443, 458` (290 stars) |
| 746 KB unoptimised JPEG | measured | `assets/volcano_discovery.jpg` via `index.html:635` |
| 741 KB unoptimised JPEG | measured | `assets/turtle_discovery.jpg` via `index.html:2416` |
| Render-blocking 1,108 ms | est. | `index.html:15` (GSAP, no `defer`, no `preconnect`) |
| Render-blocking 902 ms | est. | `index.html:14` (Google Fonts) |
| Unminified JS 25 KiB | est. | `js/orbital.js` via `index.html:2768` |
| Unminified CSS 19 KiB | est. | `css/orbital.css`, `css/hero-window.css`, inline block at `index.html:159` |
| Unused CSS 11 KiB | est. | inline `:root` + rules at `index.html:159-1959` |
| 195 KB base64 PNG | measured | runtime-generated, `js/orbital.js:1380`, `:1808` — **no file to fix** |
| contrast 1.79:1 | measured | `index.html:314` (`--saffron` on `--linen`) |
| contrast 2.58:1 | measured | `index.html:408` |
| contrast 2.26:1 | measured | `index.html:458` |
| label mismatch ×2 | measured | `components/nav.js`, hero living-window in `index.html` |
| 3 long tasks (desktop) | measured | `js/orbital.js`, `gsap.min.js` ×2 |

---

## 4. Appendix

### A1 — Reproduction

```bash
# Part 2, both form factors (Lighthouse 12.8.2, local Chrome)
export CHROME_PATH="/c/Program Files/Google/Chrome/Application/chrome.exe"
npx lighthouse https://wizkoo.com --chrome-flags="--headless=new --no-sandbox --disable-gpu" \
  --preset=desktop --output=json --output=html --output-path=lh-desktop
npx lighthouse https://wizkoo.com --chrome-flags="--headless=new --no-sandbox --disable-gpu" \
  --output=json --output=html --output-path=lh-mobile
```

The PSI API fallback returns HTTP 429 for keyless requests (`quota_limit_value: 0`); it is not a usable fallback without an API key.

Live animation census, run in-page against `https://wizkoo.com`:

```js
let n = 0; const tally = {};
for (const el of document.querySelectorAll('*')) {
  const cs = getComputedStyle(el);
  if (cs.animationName !== 'none') {
    n++;
    const k = cs.animationName + '|' + cs.animationIterationCount;
    tally[k] = (tally[k] || 0) + 1;
  }
}
console.log(document.querySelectorAll('*').length, n, tally);
```

### A2 — Extraction scope

Scripted over the 12 sources in §0.2, restricted to `index.html` lines 159-1959, 1961-1986, 1988-2059, 2102-2167. `/* */` comments stripped per line before matching. Declaration regex handles minified multi-declaration lines; line numbers remain accurate. `font-family` required a separate pass because the general value pattern terminates on quote characters.

Totals: radius 8/48 · padding 88/110 · gap 25/56 · font-size 96/193 · font-weight 9/95 · font-family 12/133 · colour literals 190/399 · box-shadow 48/63 · max-width 26/47. (Format: distinct / occurrences.)

### A3 — Micro-type ramp, full citations

`0.42rem`(3) `index.html:364, 832, 988` · `0.45rem`(3) `index.html:358, 362, 650` · `0.48rem`(3) `index.html:314, 349, 649` · `0.5rem`(3) `index.html:322, 353, 365` · `0.57rem`(2) · `0.6rem`(3) · `0.62rem`(1) · `0.64rem`(1) · `0.68rem`(2) · `0.7rem`(1) · `0.72rem`(7) · `0.76rem`(1) · `0.78rem`(2) · `0.8rem`(1) · `0.82rem`(5) · `0.85rem`(1) · `0.88rem`(1) · plus `6px`(1) `6.5px`(1) `7px`(2) `7.5px`(1) `8px`(3) `8.5px`(1) `9px`(7) `10px`(17) `11px`(5) `12px`(3) `12.5px`(1) `13px`(5) `14px`(2) `15px`(5).

### A4 — Off-palette single-use colours

`#FDE9A0` `#F0C050` `#C89030` `#A07020` `#7A7F93` `#9B8AF4` `#E06C53` `#4A9E78` `#7CB4B8` `#E294A5` `#141310` `#2A2F45` `#6BBF6B` `#182848` `#7288B4` `#97ABD0` `#E8EEF8` `#FFE899` `#FFBC50` `#FF8F30` `#F0C45A`. Predominantly sky/hero-window gradient stops. Undocumented as a sub-palette.

### A5 — Single-use box-shadows

`index.html:224, 242, 246, 248, 304, 316, 317, 533, 667, 673, 674, 678, 681, 743`(×2)`, 864`(×2)`, 213` plus further values in `css/hero-window.css` and `css/orbital.css`. 36 distinct non-`none` shadows for 51 uses.

### A6 — Not audited

- `css/library.css` (41 KB), `css/games.css`, `css/base.css`, `css/tokens.css`, `css/lab-*.css` — shipped via the `css/*.css` glob but **not loaded by `index.html`**, therefore outside the homepage render tree.
- `js/library*.js`, `js/lab-*.js`, `js/reveal.js`, `js/supabase-config.js` — same.
- Other 15 published pages. They share `components/footer.js` and several stylesheets, so findings propagate (see §5).
- Real-user (field) data. All Part 2 numbers are lab measurements from a single local run per form factor. CrUX field data was not retrieved.

---

## 5. Downstream Impact Trace

**What a fix order derived from this audit would touch.**

| Change | Files | Blast radius |
|---|---|---|
| Load `css/tokens.css` on the homepage | `index.html:2075` region | Homepage only. **Risk: the 4 differing token values (FIX 3) will change rendered type sizes across the whole page** unless reconciled first. Re-baseline screenshots at all five target viewports before and after. |
| Delete duplicate `:root` | `index.html:160-167` | Homepage. Same risk as above; do in the same commit. |
| Fix 290 footer stars | `components/footer.js:20-23, 421-458` | **All 16 published pages.** Highest-leverage single change in the audit; also the widest blast radius. Needs verification on `about`, `pricing`, `library`, `esa/*`. |
| Fix 420 hero-sky stars | `css/hero-sky.css:40-49` | Any page linking `hero-sky.css`. Confirm the set before editing. |
| Convert 2 JPEGs to WebP/AVIF | `assets/turtle_discovery.jpg`, `assets/volcano_discovery.jpg`, `index.html:635`, `:2416` | **`publish-allowlist.txt` names these two files by exact path** (`assets/turtle_discovery.jpg`, `assets/volcano_discovery.jpg`). New `.webp` siblings will **not** ship until added to the manifest. `assets/` is explicitly never globbed. Missing this = broken images in production. |
| `defer` GSAP | `index.html:15` | Homepage. Verify no inline script depends on `gsap` at parse time; `index.html` has 4 inline `<script>` regions to check. |
| Remove `Inter` | `index.html:404, 454, 538, 569` | Homepage. Visual reflow of the `.plan-founder` block; re-baseline. |
| Raise contrast on saffron-on-linen | `index.html:314` and every other saffron-text-on-linen instance site-wide | **Design-system decision, not a local patch.** 1.79:1 is a property of the canonical palette pairing. Escalate before implementing. |
| Fix `aria-label` mismatches | `components/nav.js` | **All 16 pages** (nav is global). |
| Adopt token scales | `index.html` + 6 stylesheets | Large mechanical diff. Recommend one category per commit, screenshot-verified, not one sweeping change. |

**Two hard gates before any fix order runs:**

1. **The build guard.** 27 untracked root `.html` files currently fail `npm run build` locally (§0.4). Any fix session must resolve these first (add to `declined:` or remove) or it cannot verify its own work locally.
2. **The allowlist.** Every new asset file (WebP siblings, split stylesheets) needs a `publish-allowlist.txt` line. `assets/` is never globbed; `css/`, `js/`, `images/` are. A new `assets/*.webp` that ships nothing will read as "image broken in production" and is easy to misdiagnose.

**Adjacent issue noticed, not in scope:** `images/*` is globbed in `publish-allowlist.txt`, so four untracked working-tree files — `elite_table_v4.jpg` (844 KB), `immersive_table.jpg` (817 KB), `immersive_table_ind.jpg` (816 KB), `same_table_volcano_concept.jpg` (942 KB), 3.4 MB total — **would publish the moment they are committed**, whether or not any page references them. They are not on the live site today because they are untracked. Worth a decision before the next commit that touches `images/`.

---

## 6. Flight log

| | |
|---|---|
| **Session** | WP-AUX-01 — Homepage Design Cohesion + Performance Audit |
| **Date** | 2026-08-09 |
| **Model** | Opus 5 standard |
| **Repo state** | `Wizkoo` @ `main` `4ba257e`, working tree dirty (1 modified, 48 untracked) |
| **Deliverable** | `AUDIT-HOMEPAGE-2026-08-09.md` (this file), repo root, **uncommitted** as ordered |
| **Fixes applied** | **None.** Audit only, per order. |
| **Order corrections** | 3 — repo/branch name; no Tailwind (category (a) partially void); no component render tree |
| **Tooling deviation** | PSI API returned HTTP 429 (keyless quota 0). Used local Lighthouse 12.8.2 + local Chrome, which was the order's primary path. |
| **Measured vs estimated** | Live DOM census, Lighthouse metric values, contrast ratios, byte counts, and all Part 1 frequency counts are **measured**. Items marked `est.` are Lighthouse projections. No estimate is presented as a measurement. |
| **Coverage gap declared** | No CrUX field data. Single lab run per form factor. 15 sibling pages not audited. Non-homepage CSS/JS excluded (§A6). |
| **Verification** | Every `file:line` in this report was read back from source. Build health verified by building a clean `HEAD` extract, not the dirty working tree. |

**Top 5, restated for the fix order:**

1. 751 concurrent infinite animations → mobile Perf 29, TBT 65.6 s (`css/hero-sky.css:40-49`, `components/footer.js:20-23`)
2. 1,487 KB in two JPEGs = 77% of page weight (`assets/turtle_discovery.jpg`, `assets/volcano_discovery.jpg`)
3. `css/tokens.css` not loaded; `index.html:160-167` shadows it with 4 differing values
4. `index.html:398-571` authored off-system: `Inter` ×4 + both a11y contrast failures
5. Render-blocking GSAP, est. 1,108 ms mobile (`index.html:15`)
