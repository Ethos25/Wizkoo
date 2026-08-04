# Hero band — placement diagnosis

**Diagnosis only. Nothing moved.**

**Answer up front: it is neither. The band is not high in the window, and the
figure is not high inside the band. The figure fills its band exactly — slack
is 0.00px — and the band's bottom edge sits 6.3px above the handle rule. The
empty space you are seeing is *inside the figure*, and it is the spec's own
composition.**

The strongest evidence is the last section: the emptiness is present in
**identical proportion at 1440 × 800**, the composition you ruled good.

---

## 1. THE MEASUREMENTS YOU ASKED FOR

At **1966 × 594** (window 583.78 × 353.80, 7A):

| | value |
|---|---|
| sentence box bottom | 142.45 |
| **band** top / height / bottom | **142.50 / 162.88 / 305.38** |
| **figure** top / height / bottom | **142.50 / 162.88 / 305.38** |
| **slack under the figure** | **0.00** |
| handle rule at | 311.64 |
| band → rule | 6.27 |
| lowest **star** (Math) → rule | 27.36 |
| lowest **label** (Writing) → rule | 9.66 |

Band top (142.50) sits on the sentence's box bottom (142.45) — a 0.05px
difference. The band is placed exactly where it should be, and the figure fills
it with nothing left over.

## 2. WHERE THE EMPTY SPACE ACTUALLY IS

It is not a band under the figure. It is the figure's own silhouette: only one
of seven labels reaches the bottom of its coordinate space, so the gap to the
rule varies by a factor of **sixteen** across the width.

| label | x across the figure | → rule (1966×594) | as % of window |
|---|---|---|---|
| Writing | 49% | **9.7** | 2.7% |
| Math | 33% | 22.6 | 6.4% |
| Art | 83% | 49.2 | 13.9% |
| Reading | 10% | 81.1 | 22.9% |
| Science | 67% | 101.3 | 28.6% |
| Geography | 85% | **153.6** | **43.4%** |

The right-hand side is the dead area. Reading the spec's own table, everything
right of x≈300 of 532 sits high — Geography y36, Science y66, Art y124 of 178 —
so **the bottom 30% of the band's right half holds nothing at all**. The rule
underlines the full width, which is what makes a diagonal void read as a
horizontal band.

## 3. BOTH AVAILABLE LEVERS TESTED — BOTH FAIL

Prototyped in-page, measured, discarded:

| lever | figure | lowest label → rule | verdict |
|---|---|---|---|
| current | 486.8 × 162.9 | 9.7 (max 153.6) | — |
| **band shifted down 12px** | **450.9 × 150.9** | 8.4 (max 142.7) | **strictly worse** |
| **band widened to 4% inset** | 486.8 × 162.9 | 9.7 (max 153.6) | **no effect** |

**Shifting the band down shrinks the figure.** The reserved box's bottom is
pinned just above the rule, so moving its top down shortens the box, and the
figure — contained inside — gets smaller with it. It loses 36px of width to
recover 1.3px of gap.

**Widening the band does nothing** because the figure is bound by *height*, not
width. It already fills the band's height, so extra width has nothing to spend.

And the band cannot move down even in principle: Writing's label already sits
**9.7px** off the rule, so any downward shift past ~4px puts it through the rule.
The spec's stated content range (y30..y159) is not the real bottom — Writing's
label is anchored `b` and hangs below y159.

## 4. THE SAME EMPTINESS IS IN THE 1440 × 800 YOU RULED GOOD

Gap from each label to the rule, as a percentage of the window's height:

| | Writing | Math | Art | Reading | Science | Geography |
|---|---|---|---|---|---|---|
| **1440 × 800** (ruled) | 2.5% | 6.3% | 13.8% | 22.8% | 28.5% | **43.4%** |
| **1966 × 594** (yours) | 2.7% | 6.4% | 13.9% | 22.9% | 28.6% | **43.4%** |

Identical to a tenth of a percent. Slack is 0.00 at both. The figure is
height-bound at 1440×800 and exactly at the width/height crossover at 1966×594,
which is why the two agree so closely.

**This is scale-invariant, so it cannot be caused by the band's placement, the
reserved box, or the new scaling law.** It is the shape of 7A. What changed at
your viewport is only that the figure is now 58% larger, so the same
proportional void is 60px of screen instead of 38px — the composition did not
get emptier, it got bigger, and the void grew with it.

## 5. NO BEFORE/AFTER RENDER — BECAUSE THERE IS NO CORRECTION TO SHOW

You asked for a proposed correction rendered before/after. **Within the three
constraints you set — no change to the figure's internal geometry, the tether,
or the non-centred rule — there is no correction available.** Every lever that
exists moves the band or the box, and the void is in neither. I am not going to
render a placebo.

**What would actually change it is the figure's own geometry**, which you ruled
untouchable, so it is yours to unlock or leave. Named precisely, so the decision
is concrete: the void is owned by the three right-hand stars — **Geography
(y36), Science (y66) and Art (y124) of 178.** Nothing on the right half of the
figure sits below 70% of the band's height. Lowering any of them fills the void
and costs the depth reading the spec says the whole figure rests on
(§8: Reading and Science near, Math/Writing mid, Art/Geography distant).

My read: **leave it.** It is in the frame you approved, at the same proportion,
and it reads as sky rather than as a layout error — the label test still passes.
But you are looking at it at a size you have not seen before, and if it does not
hold at that size, the figure is the thing to reopen, not the band.

---

Reproduce: `node scripts/hero-band-diagnose.js <url>`.
