# Constellation — handoff

**Status: the figure is built and verified. The hero integration is HELD.**
Two spec values conflict with the shipped hero, and both are in the coordinate
system, so nothing downstream of them is safe to reconcile by eye. The brief's
own rule applies: *"If any spec value appears to conflict with a codebase
convention, STOP and report rather than reconciling."*

Spec: `docs/constellation-geometry.html` (committed verbatim, `f63033f`).
Lab: `/lab/constellation.html` — both frames at the spec's own reference sizes.

---

## 1. THE BLOCKER — the band does not fit

The spec's band is roughly **twice the height** of the gap the hero actually
reserves. Measured, not computed, at every target viewport:

| | spec 7A | shipped desktop | spec 7B | shipped mobile |
|---|---|---|---|---|
| window | 620 × 376 | 552.66 × 334.94 | 335 × 203 | 335 × 213.92 |
| band top | 37.23% | **51.04%** | 42.36% | **53.98%** |
| band bottom | 84.57% | **78.95%** | 73.89% | **70.03%** |
| band height | 47.34% | **27.92%** | 31.53% | **16.04%** |
| band px | 532 × 178 | 460.66 × 93.50 | 299 × 64 | 289.59 × 34.31 |
| band aspect | 2.99 : 1 | **4.93 : 1** | 4.67 : 1 | **8.44 : 1** |

The spec band is **1.70×** the reserved gap on desktop and **1.97×** on mobile.

**Proof:** `screenshots/constellation/band-conflict-desktop.png` and
`-mobile.png`. Saffron = the spec's band mapped proportionally into the shipped
window. Cyan = the gap actually reserved. The saffron rectangle's top edge cuts
straight through the second line of the sentence.

**Root cause.** Both frames are 1.65, but the spec's is 620 wide where the
shipped one is 553 — 11% larger — while the chrome is specified in the *same
absolute pixels* in both. Proportionally the shipped chrome is 17–23% heavier
and it eats the band:

| | spec 7A | shipped | Δ |
|---|---|---|---|
| side inset | 44 / 620 = 7.10% | 46 / 552.66 = 8.32% | +17% |
| eyebrow | 9.5 / 376 = 2.53% | 10 / 334.94 = 2.99% | +18% |
| sentence | 30 / 376 = 7.98% | 33 / 334.94 = 9.85% | +23% |

Mobile is worse: the shipped frame is *taller* than the spec's (213.92 vs 203)
and its band is still less than half the spec's.

### Why I did not reconcile it

| option | what it costs |
|---|---|
| **A. Stretch into the gap** (`preserveAspectRatio="none"`, which the spec's own percent-positioning permits) | Squashes the figure 1.70× / 1.97× vertically. Stars stay circular (DOM, fixed px) and arms still terminate correctly, but the trim gap goes anisotropic — a 20.86-unit trim on the near-vertical `space → Writing` arm renders at 12.3px against an unchanged 5.6px star radius, so the gap that should read as *light dissolving* closes up on vertical arms and holds on horizontal ones. Stroke weights render elliptically. Worst, the vertical depth spread flattens into a horizontal smear, and spec §8 says that reading "is what the whole figure rests on." |
| **B. Fit uniformly, don't stretch** | Scale 0.525 to fit 460.66 × 93.5. The figure renders 279px wide in a 461px band — 40% dead space — and star radii fall to 2.9px on **desktop**, below the spec's own *phone* floor. Spec §7a warns explicitly that at that scale the faint stars disappear. |
| **C. Give the band its spec height** | Requires moving the sentence, the handle, or the window. All three are excluded: *"The sentence, the eyebrow, the handle, the window's material, the sky … are UNCHANGED."* |
| **D. Re-solve the star table for the shipped band** | Re-deriving by eye. Excluded by the spec's own header and by the brief. |

**This is Amy's ruling to make.** My read, for what it's worth: **C**, narrowed
— the spec was drawn against a 620-wide window and the hero ships a 553-wide
one, so the cheapest true fix is to reconcile *the frame*, not the figure.
Whether that is in scope is exactly the question I can't answer.

---

## 2. SECOND CONFLICT — the tether does not land on "space"

Independent of the band, and it survives every option above.

Spec §4 launches the tether at band `x=216` (of 532), which maps to **41.94%**
of the window width. In the shipped sentence the word "space" sits at
**65.14%** (desktop) / **61.38%** (mobile). The tether would descend out of the
middle of *"Georgia"*.

**Cause:** the shipped sentence carries a hard `<br class="lw-br">` after "in"
(`index.html:1653`), so "space" is the last word of line 2. The spec's render
has no such break and wraps elsewhere.

**Clean fix, not taken:** bind the launch x to the measured centre of
`.lw-theme` at runtime instead of the constant. That honours what §4 actually
says the tether is *for* ("under the word 'space' in the sentence") while
replacing a stated spec number, so it needs a ruling too. The hook already
exists — `build()` accepts `opts.tetherX`, unused today.

---

## 3. WHAT IS BUILT AND VERIFIED

`css/constellation.css` + `js/constellation.js`. Portable: `build(band, cfg)`
draws into any positioned element, so hero integration is adding a band element
and one call.

### Static figure — no disagreement with the spec, at both sizes

`node scripts/constellation-verify.js` diffs the built figure against the
spec's *own render*, value for value:

```
✓ 7 stars   × position (% of band), diameter, fill, box-shadow layer set,
              --dim, scintillation period + delay
✓ 6 labels  × position, size, colour, tracking
✓ 15 paths  × d-geometry, stroke-width, opacity, dasharray,
              gradient endpoints, all 7 gradient stops
✓ NO DISAGREEMENT          (desktop and mobile)
```

Side-by-side: `screenshots/constellation/spec-{desktop,mobile}.png` against
`lab-{desktop,mobile}.png`.

**One value I had to state that the spec leaves implicit:** `line-height` on
the labels. The spec's render inherits `normal`; the anchors translate by
-50%/-100% of the label's own box, so line-height *is* geometry. I set
`line-height:normal` explicitly, which reproduces the spec exactly and also
makes the labels immune to whatever the hero's type stack would otherwise pass
down. Nothing else in the figure is mine.

### Scintillation — 60s sampled at 20Hz, settled state

Measured floors match spec §6 exactly: **0.780** (Art, Geography) through
**0.923** (space). Means run 0.896 at the faintest to 0.964 at the theme star,
so faint stars flicker most and the origin is nearly steady.

**No two stars ever pulse together.** Highest correlation across all 21 pairs
is **0.215**; same-direction agreement runs 39–60%, i.e. coin-flip. Nothing
approaches synchrony.

### The arrival beat — authored here; the spec does not cover it

**Desktop 2693ms · mobile 2716ms.** Both inside 2.5–3.5s.

| | drawn | start | dur | lands |
|---|---|---|---|---|
| *origin ignites alone* | | 0 | 520 | |
| space → Reading | 83.6 | 380 | 384 | 764 |
| space → Science | 83.1 | 380 | 382 | 762 |
| space → Writing | 100.3 | 380 | 430 | 810 |
| Reading → Math | 54.7 | 951 | 295 | 1246 |
| Science → Art | 96.6 | 949 | 420 | **1369** |
| Science → Geography | 121.3 | 949 | 484 | 1433 |
| Writing → Art | 136.5 | 997 | 520 | *1518 (reinforces)* |
| labels | | +260 behind own star | 420 | |
| tether | | 2073 | 620 | 2693 |

Reasoning, in the order it matters:

- **The origin gets 380ms alone** before any light leaves it. It is the cause;
  the pause is what makes the eye read it as one.
- **Travel is sub-linear in length** (`len^0.62`, on the *trimmed* length, not
  centre-to-centre). Linear made the 55-unit `Reading → Math` feel snapped and
  the 137-unit `Writing → Art` feel dragged. Long arms should cover ground
  faster — that is what light does.
- **Length is measured against each size's own median arm,** not a shared
  constant. 7B's arms are about half 7A's; a shared constant ran the phone's
  whole beat in 2.38s, under the floor and a different piece of music. The two
  beats are now the same shape at two scales.
- **Light leaves a star that is still becoming bright** (55% of its ignition),
  not after it. Waiting for full magnitude puts a stall at every hop and turns
  one event into six.
- **A star ignites on the frame its arm completes.** Art's two arms land 149ms
  apart: the first lights it, the second reinforces. That is the right reading
  for the only doubly-connected point in the figure.
- **Labels trail their own star by 260ms,** never a global clock, so the offset
  reads as caused by that star.
- **Easing** `cubic-bezier(.12,.62,.24,1)` on travel — leaves the source fast,
  settles into the arrival. Linear reads as a stroke being painted, which is
  the one thing this must not look like.

Frames: `screenshots/constellation/beat-{desktop,mobile}-*.png` (10 marks each,
armed → origin alone → hop 1 travelling → hop 1 lit → hop 2 → all lit →
tether → settled).

### Latch

Fires **once**, on `IntersectionObserver` at 0.5, matching `js/hero-window.js`.
Verified unchanged through scroll-away, return, hover, focus, resize and
re-entry: **1 run, still 1**. On settle the beat's class is removed and every
element falls to its base rule, so nothing is left holding a fill-mode, a
`will-change` layer, or a timer. Band class at rest is `wkc-band` — no state.

### Reduced motion

Completed figure, full magnitude, no arrival, no scintillation, no timers.
`starAnimation: none`, `ignOpacity: 1`, `armDashoffset: 0px`.
`screenshots/constellation/reduced-{desktop,mobile}.png`.

---

## 4. DEVIATION I HAVE TO REPORT

**The brief asks for compositor-friendly properties only (opacity, transform)
AND for SVG arms. Those two cannot both hold.** Drawing a line from one end in
SVG requires `stroke-dashoffset`, `stroke-dasharray` or a mask — all paint-level.
A pure-transform draw needs DOM arms with a counter-scaled inner gradient,
which the brief excludes ("SVG for the arms and tether").

I chose SVG + `stroke-dashoffset`, and confined the damage:

- Only the 14 arm paths animate it, only during the beat, only inside the band.
- Everything else in the beat *is* opacity/transform: ignition, the bloom
  overshoot, the labels, and the tether (revealed by a clip rect scaling on Y,
  because its dasharray is already spoken for by its dots).
- No animated property triggers layout, so there is no thrash.
- The sky is a sibling element and no rule in `css/constellation.css` touches it.

If the ruling is that paint is unacceptable here, the alternative is DOM arms,
and that contradicts the spec's stated z-order. Flagging rather than choosing.

---

## 5. WEIGHT

| | raw | gzip |
|---|---|---|
| `css/constellation.css` | 6,433 B | 2,307 B |
| `js/constellation.js` | 24,534 B | 8,072 B |
| **total added to ship** | **30,967 B** | **10,379 B** |

Roughly 40% of the JS is the comment block carrying spec provenance; a stripped
build is materially smaller. Nothing else is added — no frameworks, no fonts
(labels use Space Mono, already loaded).

Lab-only and never shipped: `lab/constellation.html`,
`css/lab-constellation*.css`, `scripts/constellation-*.js`.

---

## 6. LAYOUT DIFF / CONTRAST

Both trivially clean, because **the hero was not touched**. `index.html`,
`css/hero-window.css`, `css/hero-sky.css`, `js/hero-window.js`, `js/hero-sky.js`
are byte-identical to `HEAD` — `git status` reports nothing for any of them.
No sentence, eyebrow, handle, window-material or sky value moved, so there is
no contrast regression to measure. These checks become live the moment the band
is ruled and the integration lands.

---

## 7. WHAT UNBLOCKS THIS

1. **The band.** Which of A/B/C/D above, or a fifth thing.
2. **The tether origin.** Bind to `.lw-theme` at runtime, or restate the
   constant, or change the sentence's break.

Everything else is done and verified. Integration after the ruling is a band
element plus one `build()` call.
