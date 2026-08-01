# Constellation — handoff

**Round 3 status: complete. Every viewport in the matrix clears.**
The two round-2 failures are resolved by routing to 7B on scale, as ruled;
the tether ships as variant D, as ruled; the proportional chrome is ratified.
See § 13. Sections 0–12 below are the round-1 and round-2 record.

| viewport | window | band | lowest label → handle rule | verdict |
|---|---|---|---|---|
| 1440 × 900 / 800 | 552.66 × 334.94 | 460.72 × 154.14 | **+8.38px** | ✅ works |
| 1024 × 768 | 392.66 × 237.97 | 327.34 × 109.52 | +1.63px | ⚠️ marginal |
| **1440 × 396** (production) | 342.86 × 207.78 | 285.83 × 95.63 | **−0.47px** | ❌ touches |
| **768 × 1024** | 286 × 173.33 | 238.44 × 79.77 | **−3.17px** | ❌ overlaps |
| 390 × 844 | 350 × 226 | 302.53 × 64.75 | +25.30px | ✅ works |
| 375 × 667 | 335 × 213.92 | 289.56 × 61.97 | +22.83px | ✅ works |

## § 0 — WHY THE TWO FAILURES ARE NOT A CHROME PROBLEM

The chrome ruling worked. After it, the remaining air is **uniformly 75% of the
spec's own air** at *every* desktop viewport — bodyTop 75%, sentGap 75%,
footPadTop 76%, footBottom 75%. Tight, even, never cramped in one place and
loose in another. Mobile ends up at **98–118%**, i.e. more air than the spec's
own frame. Band aspect is the spec's to within **0.02%** everywhere.

What fails is a different thing. **The band scales with the window, but the
spec fixes the labels and star radii in absolute px.** At 1440×900 the band is
0.866× the spec's 532×178 and everything still clears. Below roughly 0.75× the
fixed-px labels outgrow the shrinking band: Writing's label anchors at band
y159/178 (89.3% down) and is ~14px tall regardless of band height, so once the
band drops under ~99px tall the label runs past the band's bottom edge and into
the handle rule.

The threshold is a window **≥ ~355px wide**. Two targets deliver less:
1440×396 gives 342.86 (because `--u` is clamped by the 396px height), and
768×1024 gives 286.

So this is not "reduce more chrome" — there is no chrome left to reduce that
would help, because the deficit is in the band's *width*, which sets its height
through the spec's aspect. It is your fallback condition:

> *the fallback is enlarging the window itself in the hero composition, which
> is my ruling to make, not yours.*

**Two paths, both yours.** (a) Enlarge the window so it never falls below
~355px. (b) Apply **7B** in the windows that are too small for 7A — which is
what the spec itself does about small scales (§7a: *"at phone scale a 1.5px
star with 7A's brightness falloff disappears"*). At 768×1024 the band is
238×80 against 7B's 299×64, so 7B is already the closer figure there. Note (b)
needs more than a width breakpoint: 1440×396 is a *wide* viewport with a short
height, so it would need a container-size or aspect rule.

---

## Round 1 (superseded, kept for the record)

The two conflicts below are what the rulings resolved.

Spec: `docs/constellation-geometry.html` (committed verbatim, `f63033f`).
Lab: `/lab/constellation.html` — both frames at the spec's own reference sizes.

Every `screenshots/constellation/*` path below is local: `screenshots/` is
gitignored. Regenerate the whole set with the dev server running:

```
node scripts/constellation-band-overlay.js http://localhost:3000   # the conflict
node scripts/constellation-verify.js       http://localhost:3000   # spec diff
node scripts/constellation-record.js record  http://localhost:3000 # the beat
node scripts/constellation-record.js ambient http://localhost:3000 # 60s
node scripts/constellation-record.js reduced http://localhost:3000
```

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

---

# ROUND 2 — the rulings, applied

## 8. CHROME GIVEN BACK

No type size changed. No element changed order. Four numbers of pure air shrank.

**Desktop** (reference window 553 × 335.15u):

| | was | now | given back |
|---|---|---|---|
| `.lw-body` top | 40u | 20u | 20 |
| `.lw-sentence` margin-top | 28u | 12u | 16 |
| `.lw-foot` padding-top | 26u | 9.5u | 16.5 |
| `.lw-foot` bottom | 26u | 12u | 14 |
| | **120u** | **53.5u** | **66.5u = 19.8% of the window's height** |

**Mobile** (reference 353.9 × 226u): 40→19, 16→11, 26→11, 26→14.
**108u → 55u = 53u given back, 23.5% of the height.**

The remainder is distributed in the spec's own ratios (30 : 18 : 14 : 18), so
the window is tighter than the reference by one factor everywhere rather than
tight in one place and loose in another.

**And the air is now proportional, not in `--u`.** This is the load-bearing
half. The band's height cannot be a number — it has to be the spec's *ratio*,
or the figure is stretched — so it derives from the band's width. The air
around it was in `--u`. Those scale differently the moment `min(100%, 553u)`
picks 100%: at 768 the window is 536.6u wide, the band grows from that width,
the `--u` chrome does not shrink with it, and the band's bottom edge landed
**0.28px** off the handle rule. Every chrome value is now a percentage of the
window, so the composition scales as one object. At 1440 and 1440×396 the
window is exactly 553u × 335u, so the percentages **are** the `--u` values they
replace — nothing moved where it was already right, and 768 went from 0.28px to
2.31px. (It still fails, for the § 0 reason, which is not this.)

Before / after: `screenshots/constellation/BEFORE-*.png`, `AFTER-*.png`.

## 9. THE TETHER — ruled, built, and it contradicts its own treatment

Launch x is now read off `.lw-theme` at run time (`js/hero-constellation.js`),
as ruled. Everything else is the spec's, untouched: 0.5 stroke, `0.8 4.6` dash,
the four-stop gradient fading to nothing at both ends.

**The result is a pointer, not a whisper.** The spec's 7A tether runs 16 units
across and 42 down — a near-vertical breath out of the word into the star's
glow. Re-anchored, it runs **162 across and 42 down**: a shallow dotted leader
crossing a third of the window, and now the most graphic thing in the figure —
the one element that looks drawn rather than lit. See
`screenshots/constellation/tether-hero.png`.

The cause is under the tether, not in it. **The spec's premise is that the
theme star sits directly under the word** (§2: *"It sits directly under the
word 'space' in the sentence above"*). In the shipped hero it does not: the
star is at **39.7%** of the window width, the word at **65.1%**. Re-anchoring
the launch point exposes that 25-point gap rather than closing it.

The two halves of the ruling — *"re-anchor to the actual position of 'space'"*
and *"keep its treatment exactly, the whisper"* — cannot both hold while the
word and the star are 25 points apart.

**Variant D**, rendered for comparison in
`screenshots/constellation/tether-variantD.png`: launch under the word, descend
at the spec's *own* 16-across/42-down, and fade out. It is a genuine whisper —
a few dots under "sp" — and it satisfies both halves of the ruling. What it
gives up is the literal link to the star, though the spec's own tether never
visually connects either (*"fades to nothing at BOTH ends"*).

**What ships right now is the literal ruling (a), not (d).** Yours to call.

## 10. ROUND 2 VERIFICATION

- **Figure still matches the spec.** `constellation-verify.js`: 7 stars, 6
  labels, 15 paths, **no disagreement**, both sizes. The integration changed
  nothing inside the figure.
- **Beat fires once and latches in the hero.** 1 run on first sight, still 1
  after scroll-away, return, hover, focus and two resizes (which rebuild the
  figure — a rebuild after the beat comes back settled and can never replay
  it). Band class at rest is `lw-band`: no state, no fill-mode, no timer.
- **No contrast regression.** Sampling rendered pixels behind the type with the
  figure and with it hidden: sentence Δluminance **−0.00003**, eyebrow
  **−0.00001**, handle **+0.00005**. Ratios identical to two decimals —
  sentence 6.44:1, eyebrow 7.29:1, handle 7.61:1.
- **Type sizes unchanged** at 1440×900: sentence 33px, eyebrow 10px, cta 12.5px.
- **Sky and the existing theme-word beat untouched** — `hero-sky.css/js` and
  `hero-window.js` are byte-identical to `HEAD`.

## 11. ROUND 2 WEIGHT

| | raw | gzip |
|---|---|---|
| `css/constellation.css` | 6,433 B | 2,307 B |
| `js/constellation.js` | 24,870 B | 8,179 B |
| `js/hero-constellation.js` | 3,519 B | 1,664 B |
| `css/hero-window.css` (delta) | +3,581 B | +1,458 B |
| `index.html` (delta) | +7 lines | — |
| **total added to ship** | **≈38.4 KB** | **≈13.6 KB** |

Most of the `hero-window.css` growth is the comment block explaining the chrome
trade; the rule changes themselves are ten lines.

## 12. WHAT UNBLOCKS THIS

1. **The two failing viewports** (§ 0): enlarge the window, or route them to 7B.
2. **The tether** (§ 9): keep the literal ruling, or take variant D.

---

# ROUND 3 — routing, the whisper, and the close

## 13. THE THRESHOLD, AND WHY IT IS NOT A NUMBER ON THE VIEWPORT

Two things were wrong with the obvious rules, and the matrix found both.

**A viewport-width breakpoint misses 1440×396.** `--u` is clamped by the 396px
height, so that wide viewport renders a 342.86px window — and a width query
hands it 7A, which is the case that failed.

**A band-width threshold misses 600×900.** There `.lw-mount` is 553 × 226, a
2.45 box. The band is 478 wide, comfortably over any width threshold, but the
gap between sentence and rule is only 82px tall. A width-only rule picked 7A
and produced a 159.9px band inside an 82px gap — 31px past the window's own
bottom edge. **Height has to bind too.**

So the switch is neither. **Both figures are sized into the reserved box the
way they will actually be drawn — contained, largest box of that ratio that
fits — and the one whose contained width lands nearer its own reference band
wins.** Nearness is measured in log space, because this is a question about
scale: 1.3× and 0.77× are equally far from reference.

```
score(fig) = |ln( contained_width(fig) / reference_width(fig) )|
             7A reference 532 × 178      7B reference 299 × 64
score(7A) += 0.10        ← BIAS toward 7B on a close call
score(...) += 0.05       ← HYST, to leave a state (no flicker on drag-resize)
```

**BIAS = 0.10 is deliberate and it is the judgement in this rule.** The two
figures do not degrade alike. 7B was drawn for a band it can outgrow
gracefully; 7A cannot shrink into one, because its labels are absolute px and
begin colliding with the sentence above and the rule below once its band drops
below about 0.8×. When the call is close, the figure that fails softly should
win it. At 1280×720 the unbiased scores are 7A 0.273 / 7B 0.304 — 7A by a
hair, and with 7A that viewport measured −1.02px into the sentence. The bias
hands it to 7B, which measures +5.98.

**Consequence, stated plainly: 7A now runs only where the window reaches its
full 553u width** — roughly viewport ≥ 1440 with adequate height. Everything
narrower gets 7B. That is not a demotion of 7A; it is the honest reading that
the largest band this composition ever produces is 461px against 7A's 532
reference, and everything else is nearer 7B's 299.

### Structural change this required

The band used to *be* the figure — insets plus `aspect-ratio`, height derived
from width. That is what overflowed at 600×900. It is now two things:

- `.lw-band` — the reserved box only. Insets and top in CSS; **height measured
  and set in JS** from the foot's actual position, because the foot's height
  mixes percentages with `--u` and no single percentage survives every window
  shape.
- `.lw-figure` — a contained child, sized to the largest box of the chosen
  figure's ratio that fits. Never stretched, never refit, and it cannot
  overflow. Centred horizontally, anchored to the top, per spec §8.

### The matrix

Figure size is the contained figure, not the reserved box; `×ref` is against
that figure's own reference band.

```
viewport      window        figure       fig  ×ref   label→rule  fig→sentence
1920x1080     553x335.1     461x154.2    7A   0.867       8.41         1.78
1600x900      553x335.1     461x154.2    7A   0.867       8.41         1.78
1440x900      552.7x334.9   460.7x154.1  7A   0.866       8.39         1.72
1440x800      552.7x334.9   460.7x154.1  7A   0.866       8.39         1.72
1440x396      342.9x207.8   286x61.2     7B   0.957      38.89         3.81
1280x720      486x294.5     405x86.7     7B   1.355      58.14         5.98
1200x900      452.7x274.3   377x80.7     7B   1.261      53.59         4.75
1024x768      392.7x238     327x70       7B   1.094      45.70         4.81
900x700       341x206.7     284x60.8     7B   0.950      38.58         2.91
820x1180      307.7x186.5   257x55       7B   0.860      33.81         1.67
768x1024      286x173.3     238x50.9     7B   0.796      31.02         0.91
600x900       553x226       365.1x78.1   7B   1.221       7.30         0.72
430x932       390x226       337x72.1     7B   1.127      17.61         5.05
414x896       374x226       323x69.1     7B   1.080      20.73         5.16
390x844       350x226       303x64.8     7B   1.013      25.22         5.36
375x667       335x213.9     290x62.1     7B   0.970      22.75         4.80
360x640       320x204       277x59.3     7B   0.926      21.28         4.42
✓ every viewport clears
```

`1024×768`, previously marginal at +1.63, is now **+45.70**. Figure scale
across the whole matrix runs 0.796×–1.355× of its own reference.
Re-run with `node scripts/constellation-matrix.js http://localhost:3000`.

## 14. THE TETHER — VARIANT D SHIPPED

Launch x is read off `.lw-theme` at run time. The tether then travels the
**spec's own horizontal run** — 16 units at 7A, 22 at 7B — leaning toward the
figure, and fades out. Measured across the matrix: `16/42` wherever 7A runs,
`22/18` wherever 7B runs. Exactly the spec's own scale at both.

It never reached the star visually in the spec either; it fades to nothing at
both ends. `screenshots/constellation/R3-tether-desktop.png`.

## 15. ROUND 3 VERIFICATION

- **Figure still matches the spec** — 7 stars, 6 labels, 15 paths, no
  disagreement, both sizes. The routing changed nothing inside either figure.
- **Beat fires once and latches** — 1 run, still 1 after scroll-away, return,
  hover, focus, and a **7A → 7B → 7A** round trip. Each rebuild comes back
  settled. Figure class at rest is `lw-figure`: no state, no fill-mode, no timer.
- **Reduced motion** — `wkc-static`, `animationName: none`, ignition opacity 1,
  dashoffset 0, labels 1. The completed figure, no arrival, no scintillation.
- **No contrast regression** — sentence Δluminance −0.00003, eyebrow −0.00002,
  handle +0.00003. Ratios 6.44:1 / 7.29:1 / 7.61:1, unchanged.
- **Type sizes unchanged** at 1440×900: sentence 33px, cta 12.5px.
- **`hero-sky.css`, `hero-sky.js`, `hero-window.js` byte-identical to HEAD** —
  the sky's twinkle and the theme word's own beat are untouched.

## 16. FINAL WEIGHT

| | gzip |
|---|---|
| `css/constellation.css` | 2,307 B |
| `js/constellation.js` | 8,573 B |
| `js/hero-constellation.js` | 3,036 B |
| `css/hero-window.css` (delta) | +388 B |
| **total added to ship** | **≈14.0 KB** |
