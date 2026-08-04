# Hero — short-viewport diagnosis

**Diagnosis only. Nothing in the composition, the routing rule, the figure, the
window or the chrome was changed. This file is the only thing committed.**

Trigger: Amy walking `excellence-round-1--wizkoo.netlify.app` at **1966 × 594**
— a wide monitor with a short working viewport — and getting 7B.

**Her read is right, and the cause is not the routing rule.** The rule is
correctly serving a small window. The window is small because `--u` is pinned
to a reference height the composition does not use. § 5 is the finding that
matters most.

---

## 1. THE CALL AT 1966 × 594, WITH THE ARITHMETIC

```
--u = min( 1px , 100vw/1440 , max(0.62px, (100svh − 82)/718) )
        =  min( 1 , 1966/1440 = 1.36528 , (594−82)/718 = 0.71309 )
        =  0.71307                          ← CLAMPED BY VIEWPORT HEIGHT

window          553u × 335u   =  394.33 × 238.98      (20.1% of viewport width)
reserved band   328.73 × 109.72                       (top 96.25, foot top 210.2)
```

Contained sizes — largest box of each ratio fitting 328.73 × 109.72:

| | ratio | contained | vs own reference |
|---|---|---|---|
| 7A (532 × 178) | 2.98876 | **327.93 × 109.72** | 0.616× |
| 7B (299 × 64) | 4.67188 | **328.73 × 70.36** | 1.099× |

Scores — `|ln(contained ÷ own reference)|`:

```
7A   |ln(327.93/532)|  = |ln(0.61641)|  = 0.48385
     + BIAS 0.10                        = 0.58385
7B   |ln(328.73/299)|  = |ln(1.09943)|  = 0.09479
     (no bias)                          = 0.09479

WINNER: 7B, by 0.48906 in log space.   Rendered 7B at 329 × 70.4.
```

**The bias did not decide this, and neither did the hysteresis.** Strip the
0.10 bias and 7B still wins 0.09479 to 0.48385 — by 0.389, four times the bias.
Hysteresis never applied: a fresh load has no prior state. At this viewport 7A
would be at **0.616× of its own reference**, and the rule is right to refuse it.

## 2. IS 7A REACHABLE? — PLAINLY, YES, BUT NOT BELOW ~740px OF VIEWPORT HEIGHT

`--u` is clamped by viewport height here: the width term allows 1.365, the
height term allows 0.713, and the minimum wins.

- **The window reaches its full 553u width at viewport height ≥ 800px**
  (`(svh − 82)/718 ≥ 1`), at any viewport width ≥ 1440.
- **7A starts winning the routing at viewport height ≈ 736–740px.** Measured
  sweep at width 1966: 735 → 7B, 740 → 7A. Hysteresis moves this to ~720
  coming down from 7A and ~750 coming up from 7B.

| vp height | --u | window | 7A cont. | 7A+bias | 7B | wins |
|---|---|---|---|---|---|---|
| 594 (Amy) | 0.713 | 394 × 239 | 327.9 | 0.5838 | 0.0948 | 7B |
| 680 | 0.833 | 461 × 279 | 383.5 | 0.4274 | 0.2501 | 7B |
| 720 | 0.889 | 491 × 298 | 409.3 | 0.3622 | 0.3149 | 7B |
| 735 | 0.909 | 503 × 305 | 418.9 | 0.3389 | 0.3381 | 7B *(by 0.0008)* |
| **740** | 0.916 | 507 × 307 | 422.2 | 0.3311 | 0.3458 | **7A** |
| 800+ | 1.000 | 553 × 335 | 461.0 | 0.2433 | 0.4330 | 7A |

**Does any realistic desktop viewport reach it? Yes — most 1080p and above.** A
maximized Chrome on a 1920 × 1080 display leaves roughly 900px of viewport, well
clear. So 7A is *not* effectively dead.

**But the honest version of the answer is the one Amy asked for:** the routing
rule *is* masking a window-size problem. It is doing its job — a 394 × 239
window genuinely cannot hold 7A — but the reason the window is 394 wide on a
1966px monitor is `--u`, not the constellation. See § 5.

## 3. THE DEGRADATION CURVE

Full first viewport at each size: `screenshots/constellation/SV-*.png`.

| viewport | --u | window | % of vp width | figure | | arrest | sentence | below fold |
|---|---|---|---|---|---|---|---|---|
| 1920 × 1080 | 1.000 | 553 × 335 | 28.8% | 461 × 154 | 7A | 100px | 33px | nothing |
| **1966 × 594** | **0.713** | **394 × 239** | **20.1%** | **329 × 70** | **7B** | **71.3px** | **23.5px** | nothing |
| 1512 × 700 | 0.861 | 476 × 288 | 31.5% | 397 × 85 | 7B | 86.1px | 28.4px | nothing |
| 1440 × 800 | 0.999 | 553 × 335 | 38.4% | 461 × 154 | 7A | 100px | 33px | nothing |
| 1280 × 650 | 0.791 | 438 × 265 | 34.2% | 365 × 78 | 7B | 79.1px | 26.1px | nothing |

**Nothing falls below the fold, ever.** `.hh` is `height:calc(100svh − 82px)`
with `overflow:hidden`, so the hero cannot overflow — it can only shrink.
That is the whole mechanism: **at short heights nothing is lost to the fold;
everything is lost to scale.**

What 1966 × 594 sacrifices against 1440 × 800:

- **The headline drops from 100px to 71.3px** — a 29% cut in the one element
  carrying the arrest.
- **The window drops from 553 to 394 wide** and, because the viewport is wider,
  from 38.4% of the screen's width to **20.1%**. It stops reading as the hero's
  proof and starts reading as a badge parked in the corner.
- **The figure loses its vertical dimension entirely** — 7B is 4.67:1 against
  7A's 2.99:1. The depth spread that spec §8 says "the whole figure rests on"
  is not compressed, it is a different figure.
- **The photograph takes the space the composition gives up.** At 594 it fills
  the full width with a large empty light region across the bottom, and the copy
  and window are pushed into a narrow horizontal strip.

1512 × 700 and 1280 × 650 are the same story at 86% and 79%. **The curve is
smooth; there is no cliff.** 1966 × 594 is simply the far end of it.

## 4. WHAT 7A WOULD TAKE — AND A MIDDLE OPTION THAT COSTS NOTHING

7A at its **own 532 × 178 reference** needs:

```
band 532 wide  ->  window 532 / 0.83364 = 638.1 × 386.8
                ->  --u = 1.1540  ->  viewport height 911px
```

Three renders at 1966 × 594, side by side:

| render | --u | window | figure | cost |
|---|---|---|---|---|
| `SV-F-CURRENT.png` | 0.713 | 394 × 239 | 329 × 70 · 7B | — |
| `SV-F-FORCED-7A-min.png` | 0.916 | 507 × 307 | **422 × 141 · 7A** (0.79×) | **nothing** |
| `SV-F-FORCED-7A-ref.png` | 1.154 | 638 × 387 | **532 × 178 · 7A** (1.00×) | *"Automatically."* cut, 24px past the fold |

**Forcing 7A at its reference costs the second line of the support copy** and
pushes the headline to 115px, which crowds the frame. That is a real cost.

**Forcing 7A at 0.916 costs nothing at all.** Everything fits, no copy is lost,
and the figure recovers its vertical depth. Which raises the question in § 5.

## 5. THE FINDING THAT MATTERS — `--u` IS OVER-RESERVING BY ABOUT 30%

Sweeping forced `--u` at 1966 × 594 (hero box = 594 − 82 = **512px**) and
measuring where the hero's own content actually bottoms out:

| --u | window | figure | | content bottom | hero box | fits |
|---|---|---|---|---|---|---|
| **0.713 (current)** | 394 × 239 | 329 × 70 | 7B | **460.7** | 512 | yes — **51px unused** |
| 0.860 | 476 × 288 | 396 × 85 | 7B | 450.1 | 512 | yes |
| 0.916 | 507 × 307 | 422 × 141 | 7A | 446.1 | 512 | yes |
| 1.000 | 553 × 335 | 461 × 154 | 7A | 464.4 | 512 | yes |
| **1.100** | **608 × 369** | **507 × 170 (0.95×)** | **7A** | **510.8** | 512 | **yes** |
| 1.154 | 638 × 387 | 532 × 178 | 7A | 535.9 | 512 | no, +23.9 |

**At Amy's viewport the hero renders at `--u` 0.713 while 1.100 would fit** — a
54% larger composition, with 7A at 95% of its own reference, and 51px of the
hero box currently sitting empty.

The cause is the divisor. `--u = (100svh − 82)/718` takes 718 from the approved
**1440 × 800** frame (800 − 82), so `--u = 1` exactly there. But 718 is the
reference frame's *height*, not the height its content needs — at `--u = 1` the
desktop content bottoms out around **465px of a 718px box**. Roughly 30% of the
reference frame is deliberate whitespace.

**Short viewports pay for that whitespace twice:** once by scaling the entire
composition down as though all 718px were required, and again by leaving the
resulting slack unused. That is what produces a 394px window on a 1966px
monitor, and 7B is the honest downstream consequence.

## 6. HOW COMMON ARE SHORT VIEWPORTS — ESTIMATE, FLAGGED AS ONE

**No Wizkoo analytics were consulted; this is inference from public resolution
data plus chrome-overhead assumptions, and it should be replaced with the
site's own numbers before anyone rules on it.**

Public trackers publish screen *resolutions*, not viewport heights. Browser
chrome on Windows Chrome costs roughly 110–140px (tab strip, address bar,
bookmarks bar), plus a ~40–48px taskbar when not fullscreen. Applying that:

| display | ≈ viewport height | vs the ~740 line |
|---|---|---|
| 2560 × 1440 | ~1250 | clear |
| 1920 × 1080 | ~900 | clear |
| 1440 × 900 | ~750 | marginal |
| **1536 × 864** (1920 at 125% scaling) | **~715** | **below** |
| **1366 × 768** | **~618** | **below** |

1366 × 768 and 1536 × 864 are consistently among the top desktop resolutions,
and Windows display scaling is pushing more machines into the 1536 × 864 bucket
rather than fewer. **My estimate: roughly 25–40% of desktop sessions sit below
~740px of viewport height**, before counting anyone who does not maximise.
Amy's own 594 is well inside that group.

### My read

**Do not redesign the hero for a short viewport as the primary target. Fix the
scaling law instead.**

The composition is not too big for 594px — § 5 shows it fitting at `--u` 1.10,
54% larger than it currently renders, with 51px still spare. Treating short
viewports as the primary target would mean redesigning around a constraint that
is largely self-imposed by the divisor.

What I would put in front of Amy, in order:

1. **Decouple `--u` from the reference frame's total height.** Divide by what
   the content actually needs (~510u at desktop) rather than 718, or let the
   width term contribute on wide-and-short viewports instead of being ignored
   entirely. Either gives 1966 × 594 a ~600px window and 7A near reference,
   with nothing lost and no change to the composition, the figure, or the
   routing rule.
2. **Only then** revisit whether 7A's own scale still needs work.

Degrading to 7B is not the bug. It is the rule reporting, accurately, that the
window it was handed is phone-sized — on a nearly 2000px monitor. Fixing the
window makes the routing rule agree with Amy without anyone touching it.

---

Regenerate: `node scripts/constellation-diagnose.js <url>` (the scoring and the
height sweep) and `node scripts/constellation-shortview.js <url>` (the renders).
