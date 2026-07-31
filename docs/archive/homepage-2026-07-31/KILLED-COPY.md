# KILLED COPY — Excellence Round 1 (2026-07-31)

Every string removed from the shipped site this round, verbatim, with its original location.
Strings here are **retired**, not protected. Nothing in this file may be reintroduced without a ruling.
Strings preserved for future placement live in `KEPT-COPY.md` and are **not** listed here.

Source of record: `index.html` @ commit `261792a` (branch `main`), archived in this folder as
`intake-form-hero.html` / `.css` / `.js`.

---

## 1. Hero headline stack — superseded by the ruled hero line (Task 2)

| # | Verbatim string | Original location |
|---|---|---|
| 1 | `Personalized weekly` | index.html:1425 — `<span class="l1">` |
| 2 | `homeschool plans.` | index.html:1426 — `<span class="l2">` |
| 3 | `And tracking.` | index.html:1427 — `<span class="l3"><em>` |
| 4 | `so you never wonder what's missing.` | index.html:1429 — `<p class="left-and-sub">` (rendered with a leading `…` via `::before`) |

Retired because the ruled hero line replaces the stack. Archived, not lost.

---

## 2. Founder slot — superseded by the ruled founder beat (Task 3)

| # | Verbatim string | Original location |
|---|---|---|
| 5 | `Built by a mother of four who tested every plan on her own children.` | index.html:1908 — `<div class="founder-line">` (markup: `Built by <strong>a mother of four</strong> who tested…`) |
| 6 | `Four children. Different ages. Different reading levels. Same table every morning.` | index.html:1909 — `<p class="founder-detail">` |

Both killed per Task 3. The slot's CTA and `No credit card for first plan.` were untouched.

---

## 3. Intake form — all labels and microcopy (Task 1)

The form (`<form id="nh-form">`, index.html:1452–1544) was removed with its right rail.

### Form head
| # | Verbatim string | Original location |
|---|---|---|
| 7 | `Build your week.` | index.html:1455 — `<h2>` |
| 8 | `Two minutes · One theme · Up to 4 kids` | index.html:1456 — `<div class="count">` |

### Field 01 — theme
| # | Verbatim string | Original location |
|---|---|---|
| 9 | `01` | index.html:1463 |
| 10 | `Build a week around` | index.html:1466 — `<div class="field-label">` |
| 11 | `The thing they said in the car.` | index.html:1467 — `<span class="aux">` |
| 12 | `Superheroes` | index.html:1469 — `placeholder` |
| 13 | `or try` | index.html:1471 — `<span class="lbl">` |
| 14 | `Dragons` | index.html:1472 — theme chip |
| 15 | `Tornadoes` | index.html:1473 — theme chip |
| 16 | `Volcanoes` | index.html:1474 — theme chip |
| 17 | `The ocean` | index.html:1475 — theme chip |
| 18 | `Trains` | index.html:1476 — theme chip |
| 19 | `Let's try a different theme.` | index.html:1478 — `#theme-error` |
| 20 | `Something went wrong. Try again.` | index.html:1479 — `#theme-network-error` |

### Field 02 — name and age
| # | Verbatim string | Original location |
|---|---|---|
| 21 | `02` | index.html:1485 |
| 22 | `For` | index.html:1488 — `<div class="field-label">` |
| 23 | `Name` | index.html:1491 — `placeholder` |
| 24 | `age` | index.html:1493 — `<span class="lbl">` |
| 25 | `yrs · 3–12` | index.html:1501 — `<span class="age-hint">` |
| 26 | `increase age` | index.html:1497 — `aria-label` |
| 27 | `decrease age` | index.html:1498 — `aria-label` |

### Field 03 — wiggly toggle (option labels only)
| # | Verbatim string | Original location |
|---|---|---|
| 28 | `Yes` | index.html:1521 — `<span class="toggle-opt-label">` |
| 29 | `No` | index.html:1525 — `<span class="toggle-opt-label">` |

> The field's question and its movement-promise sentence are **KEPT**, not killed. See `KEPT-COPY.md`.

### Runtime strings (JS)
| # | Verbatim string | Original location |
|---|---|---|
| 30 | `Checking…` | index.html:2890 — submit button in-flight label |

---

## 4. Not killed — recorded here to prevent confusion

| String | Status |
|---|---|
| `See a sample week` (+ `→`) | **SURVIVES** — rehomed as a link inside the recomposed hero, routed to the Rivera sample-week section (Task 1). |
| `Wiggly kid?` | **KEPT** — see `KEPT-COPY.md`. |
| `We weave themed movement in — dance breaks, obstacle play, outdoor missions.` | **KEPT** — see `KEPT-COPY.md`. |
| `MORE KIDS? ADD THEM NEXT` | **KEPT** — see `KEPT-COPY.md`. |
| `EVERY US STANDARD · AUTOMATICALLY` | ~~PROTECTED~~ → **RETIRED in the Hero Round.** See section 5. |
| `What we ask first.` and the full desk-card body | **PROTECTED** — untouched; live anonymity-architecture motif. Demoted below the fold in the Hero Round; copy unchanged. |
| `No credit card for first plan.` | **PROTECTED** — untouched in the founder slot. |

---

## 5. Hero Round — the Living Window (2026-07-31)

Retired by ruling when the hero was rebuilt around the living window.
Both entries were previously protected. **Protected status was protection from
*unruled* edits; these are ruled supersessions**, and are recorded as such.

| # | Verbatim string | Original location | Ruling |
|---|---|---|---|
| 31 | `Everyone keeps asking how you'll know they're learning. Some nights you lie there asking the same thing.` | index.html — `<h1 class="hero-line">`, shipped in Excellence Round 1 | **RETIRED, not moved.** `SUPERSEDED-BY-DISPLAY-SCALE-LAW`: hero copy is ruled at poster scale, and 18 words cannot occupy an 8-word arrest slot. **May return in body contexts by future ruling. It ships nowhere in the hero.** |
| 32 | `Every US standard · Automatically` (rendered `EVERY US STANDARD · AUTOMATICALLY`) | index.html — `<div class="left-header">` eyebrow, above the hero line | **RETIRED from the hero.** The support slot carries the same claim in the truer form. The 2026-07-30 audit flagged "Every US standard" as an unsupported absolute (T4); "your state's standards" is exact-strength. One "automatically" per viewport. |

### Note on string 31's line-break markup
The retired line shipped with composed breaks. Recorded so the composition is
recoverable, not just the words:

- 1440, four lines: `Everyone keeps asking` / `how you'll know they're learning.` / `Some nights you lie there` / `asking the same thing.`
- 375, five lines: an additional break after `how you'll know`.
- The terminal period carried the hero's single saffron moment (`<span class="hl-dot">.</span>`).

---

**Count: 32 strings retired.**
