# Hero constellation — close-out handoff

Branch `excellence-round-1`. Live: https://excellence-round-1--wizkoo.netlify.app

**Closed in this round:** the scaling law, the 7A/7B routing rule, the figure's
sizing and horizontal placement, the handle rule, the geometry lock.

**Handed to a fresh session, deliberately unresolved:** the figure's **vertical
placement** and the **tether**. § 6 carries the measurements so that work starts
from data.

---

## 1. THE SCALING LAW — `index.html`, `.hh`

```css
--u: min(1.10px, calc(100vw / 1440), max(0.62px, calc((100svh - 82px) / 485)));
```

> **SUPERSEDED IN PART, 2026-08-01.** The two pins described below are gone.
> Amy ruled a single centred anchor; both columns now centre in the `.hh` band
> and the +68u / +72u offsets no longer apply. **485 itself is unchanged and
> still ruled** — see `docs/hero-single-anchor-closeout.md` § 1 for the new
> anchor and the reason 485 was retained rather than re-derived. The derivation
> below is kept because the 718 trap it documents is still live.

**485 is the composition's measured need, not the reference frame's height.**
This layout is not a stack: `.hh-copy` was anchored to the TOP at 68u and
`.hh-group` to the BOTTOM at 72u, so what it needed was whichever COLUMN is
taller. At `--u = 1`: copy 396.4u + 68u = **464.4u** (binding), window group
367.1u + 72u = 439.1u. 485 = 464.4 + 4.4% margin.

The old divisor was 718 — the approved frame's hero height (800 − 82). It looks
right and is not; it over-reserved by 54.6% at every viewport. **A future
session that "corrects" 485 back to 718 re-breaks every short viewport.**

At 465, the exact-fit divisor, the copy column lands 1.2px off the hero's bottom
edge — ruled not shippable. If the copy block changes, re-measure both column
heights and re-derive. Do not scale 485 by eye.

**The cap is 1.10, not 1.** It has to exceed 1 or the height term can never
lift a short viewport above frame size, whatever the divisor. 1440×800 is
unaffected: the width term is 1 and the height term is 718/485 = 1.480.

## 2. THE ROUTING RULE — `js/hero-constellation.js`

Not a viewport breakpoint. Both figures are sized the way they will actually be
drawn, and the one whose width lands nearer its **own** reference band wins,
scored in log space:

```
score(fig) = |ln( fitted_width / reference_width )|
             7A reference 532 × 178      7B reference 299 × 64
score(7A) += BIAS 0.15
score(...) += HYST 0.05     to leave a state (no flicker on drag-resize)
```

**BIAS is 0.15, raised from 0.10 in the final change.** Height-driven sizing
enlarged both candidates and moved the crossover: at 0.10 it flipped 1280×720
to 7A at 0.78×, where labels sat 3.11px off the rule and 0.77px into the
sentence. 0.15 returns it to 7B with 52.98px of clearance. **Re-tune BIAS if
the fitting maths changes again — it is calibrated against the current `fit()`,
not a free preference.**

The bias favours 7B on a close call because the two do not degrade alike: 7B
outgrows its band gracefully; 7A's labels are absolute px and start colliding
above and below once its band drops under about 0.8×.

### Figure sizing

The figure is sized by the band's **height**, not the type's width, and grows
past the type's inset, centring on the window. `MIN_INSET = 0.055` is the floor.
The reserve margin is 0.8% of the window (was 1.77%) and guards exactly one
thing: **Writing's label**, the only element reaching the bottom of the figure's
coordinate space — it is anchored `b` and hangs below the spec's stated y159.

## 3. GEOMETRY SOURCE OF TRUTH

`docs/constellation-geometry.html`, committed verbatim (`f63033f`). Star table,
trims, gradient stop profiles, halo formulas, scintillation periods, label
formulas. **Nothing in it is to be re-derived by eye.**

`js/constellation.js` transcribes it and is verified against the spec's own
render, value for value:

```
node scripts/constellation-verify.js <url>
  ✓ 7 stars · 6 labels · 15 paths — NO DISAGREEMENT, both sizes
```

Standing values a session would otherwise guess: chalk `#FAF7F0` (**not** the
surface token `#F8F4E9`), saffron star `#F3C765` (**not** the accent `#E8AF38`),
subject tint ceiling 28%, Art connected twice.

## 4. THE TWO GATES

| | command | asserts |
|---|---|---|
| **geometry lock** | `npm test` | the ruled 1440×800 composition has not moved |
| **fold gate** | `node scripts/hero-fold-gate.js <url>` | above-the-fold contract; **1097×617 is binding** |

Also useful: `scripts/constellation-matrix.js` (17 viewports, routing + clearances).

### Re-capture procedure

The lock fingerprints every box position, size and font-size in the hero plus
every star position in the figure. **It is geometry, not pixels — the sky
animates and the figure scintillates, so pixel hashing this hero flakes by
design.**

```bash
npm run serve
node scripts/hero-geometry-capture.js http://localhost:3000
```

The capture refuses to write if two consecutive captures disagree, and prints a
diff against the previous baseline.

**Do not re-capture to make a failing test pass.** The baseline is a ruling, not
a cache. If the lock fails, something moved the approved composition and that is
the finding. Re-capture only after Amy has ruled on a new one, and say in the
commit what she ruled.

Last re-capture was this round, for the figure's growth. It reported exactly
four values and nothing else:
`band h 154.13→157.38 · figure x 893.34→888.48 · w 460.66→470.38 · h 154.13→157.38`.

## 5. OPEN — THE COPY SWAP

**Naming caveat: "Composition B" does not appear anywhere in this repo.** I am
recording what is actually marked pending rather than guessing at the label.
Five slots in `index.html` carry `HERO_COPY_PENDING` with their slot laws:

| line | slot | law |
|---|---|---|
| 1675 | ARREST | ≤ 8 words, poster scale |
| 1677 | ANSWER | ≤ 3 words, saffron confidence |
| 1679 | SUPPORT | one breath |
| 1684 | WHISPER | the window's caption |
| 1702 | HANDLE | a personal invitation, distinct from the nav CTA |

**Two of these are load-bearing on geometry, and the swapper must know it:**

- **ARREST** drives the copy column's height, which is what the 485 divisor is
  derived from (§ 1). A string that wraps to a different line count changes the
  composition's need. Re-measure and re-derive.
- **The window's sentence** (`.lw-sentence`, line 1683 — not itself marked
  pending) sets where the band's top lands and where the tether launches. The
  hard `<br class="lw-br">` after "in" is what puts "space" at 65% of the window
  rather than the spec's 42%.

## 6. HANDED OVER — VERTICAL PLACEMENT AND THE TETHER

Three levers were tried against the perceived void below the figure. **Only the
handle rule worked, and it worked by changing the reading, not the geometry.**
The full record is in `docs/hero-band-placement-diagnosis.md`,
`hero-figure-shift-findings.md` and `hero-window-variants-findings.md`. The
short version, so the next session does not re-run it:

- The figure **fills its band exactly**; slack is 0.00. The band's top sits on
  the sentence's box bottom. Neither is misplaced.
- The void is **inside the figure** and **diagonal**: 7A's right-hand stars sit
  high, so only one of seven labels reaches the bottom of the coordinate space.
- **Shifting is capped at ~6u** by Writing's label and buys 4%.
- **Growing the figure grows the void** — it is a fixed fraction (43.4% of
  window height under Geography, identical at 1440×800 and 1966×594).

### Current measurements — live, this build

| | 1966 × 594 (Amy) | 1440 × 800 (reference) |
|---|---|---|
| window | 583.78 × 353.80 | 552.66 × 334.94 |
| `--u` | 1.06 | 1.00 |
| **band box** (x, y, w, h) | 48.55, 142.50, 486.69, 166.30 | 45.97, 134.91, 460.72, 157.38 |
| **figure box** (x, y, w, h) | 43.38, 142.50, **497.05 × 166.30** | 41.14, 134.91, **470.38 × 157.38** |
| figure inset / vs 7A ref | 7.43% / **93.43%** | 7.44% / **88.42%** |
| **handle rule** y | 311.64 | 294.97 |
| foot height / box gap below | 29.50 / 12.66 | 27.98 / 11.98 |
| **sentence box** (top, bottom) | 49.08, 142.45 | 46.47, 134.91 |
| sentence font / line-height | 34.84 / 46.68 | 33.00 / 44.22 |
| **sentence baseline** ≈ | **136.53** | **129.30** |
| eyebrow ink top | 20.11 | 18.98 |
| CTA ink (top, bottom) | 321.66, 341.66 | 304.45, 323.45 |
| **tether path** | `M359.49 -12 L343.49 30` | same form, 16/42 |

**Label → rule, left to right** (the void's real shape):

| | Reading | Math | Writing | Science | Art | Geography |
|---|---|---|---|---|---|---|
| 1966 × 594 | 79.44 | 19.64 | **6.61** | 99.98 | 46.80 | **153.27** |
| 1440 × 800 | 74.77 | 18.19 | **5.50** | 94.22 | 43.94 | **145.05** |

**Star positions as % of the figure box** (1966 × 594; scale-invariant):
space 37.59 / 16.85 · Reading 18.04 / 49.43 · Math 27.44 / 85.39 ·
Science 58.65 / 37.08 · Writing 49.25 / 82.02 · Art 78.19 / 69.67 ·
Geography 84.96 / 20.22

### The tether, as it stands

Variant D. Launch x is read off `.lw-theme` at run time; it then travels the
spec's **own** horizontal run — 16 units at 7A, 22 at 7B — leaning toward the
figure, and fades out. It does not reach the theme star, and the spec's own
tether does not either (§ 4, "fades to nothing at BOTH ends").

**The unresolved thing underneath it:** spec § 2 assumes the theme star sits
directly under the word "space". In this hero it does not — the star is at
**37.59%** of the figure and the word at **65.13%** of the window. Every tether
question traces back to that gap. A session that wants the tether to *connect*
has to resolve the gap first, not lengthen the line.

## 7. THE HANDLE RULE — SHIPPED THIS ROUND

Full strength to 60% of the window, gone by 86%, drawn as a gradient on
`.lw-foot::before`. `border-top` keeps its 1px and is transparent, so the box
model is untouched — a pseudo-element's width is not layout, and the foot's top
is identical at every viewport (311.64 / 294.97).

It dissolves rather than stops because a hard cut would be the only edge in the
window that simply ends: the arms never touch their stars, the tether fades at
both ends.

---

## Reproduce anything here

```bash
npm run serve
npm test                                              # the 1440x800 lock
node scripts/hero-fold-gate.js        http://localhost:3000
node scripts/constellation-matrix.js  http://localhost:3000
node scripts/constellation-verify.js  http://localhost:3000
node scripts/hero-band-diagnose.js    http://localhost:3000   # the § 6 numbers
```
