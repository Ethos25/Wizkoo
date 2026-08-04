# Hero `--u` — the new scaling law, proposed

**Proposal only. Nothing implemented. `index.html` is untouched; the law below
was prototyped by overriding `--u` in the page at measurement time.**

---

## 1. A CORRECTION TO MY OWN DIAGNOSIS

The short-viewport diagnosis said roughly 30% of the reference frame is
whitespace, inferred from "content bottom" measurements. **That measurement was
wrong** — `.hh` is `display:flex; align-items:stretch`, so what I was reading
tracked the hero box, not the content.

The layout is not a stack. Two columns are anchored to opposite edges:

```
.hh-copy   position:absolute  top:    calc(var(--u) * 68)   width: grid span-6
.hh-group  position:absolute  bottom: calc(var(--u) * 72)   width: grid span-5
```

The real constraint is whichever column is taller. Measured at `--u = 1`:

| | height | + its offset | needs |
|---|---|---|---|
| copy column (2-line headline) | 396.4u | + 68u | **464.4u** |
| window group (whisper + window) | 367.1u | + 72u | 439.1u |

**The composition needs 464.4u. The law reserves 718u. It over-reserves by
54.6%** — and the shipped matrix confirms this holds at *every* viewport:
`copyBot/hero` is 464.4/718 at 1440×800 and 331.1/512 at 1966×594, the same
64.7% ratio throughout.

The conclusion in the diagnosis was right and the number was low. The mechanism
is simpler than I described: **718 is the reference frame's height, and the
content only ever uses 464.4 of it.**

## 2. THE PROPOSED LAW

```css
/* now */
--u: min(1px,      calc(100vw / 1440), max(0.62px, calc((100svh - 82px) / 718)));

/* proposed */
--u: min(1.10px,   calc(100vw / 1440), max(0.62px, calc((100svh - 82px) / 485)));
         ~~~~~~                                                            ~~~
```

Two numbers change, and only in the desktop declaration.

**The divisor, 718 → 485.** This is the whole fix. The height term now asks
"how much room does the composition actually need" (464.4u) rather than "how
tall was the reference frame" (718u). 485 is 464.4 plus **4.4% of margin**, so
the composition never sits flush against the hero's bottom edge.

**The cap, 1px → 1.10px.** Required, not incidental: your target of `--u` 1.100
is *above* the current ceiling, so with the 1px cap in place no divisor can ever
reach it. The cap now sets how far the composition may grow beyond the approved
frame, and 1.10 keeps that to 10%.

**The `max-width:767px` branch is not touched.** It re-declares `--u` with its
own divisor (618, against the 375×700 frame) and wins below 768, so every phone
size is bit-identical to what ships today. Confirmed in the matrix.

### Why the width term does the rest

Nothing needed to change there. At 1440 and below the width term
(`100vw/1440`) already binds and the height term is irrelevant — which is why
1366×768, 1280, 1024, 900, 820 and 768 are all unchanged. The fix only reaches
the viewports where height was binding, which is exactly the reported problem.

## 3. `1440 × 800` — CONFIRMED UNMOVED

**Yes, this same law governs 1440×800, and nothing changes there.** The width
term is 1440/1440 = 1 and the height term becomes 718/485 = 1.480, so the
minimum is still 1 — exactly as today. The divisor change cannot reach it.

Verified rather than argued. A geometry fingerprint of every box position,
size and font-size in the hero, plus every star position in the figure:

```
shipped law   run 1 : geometry 044d8ddcfad7
shipped law   run 2 : geometry 044d8ddcfad7
proposed law        : geometry 044d8ddcfad7      IDENTICAL
```

(Pixel hashes differ between two runs of the *same* law — the sky animates — so
pixel comparison is not a valid test here. Geometry is.)

## 4. THE MATRIX

`--u` · window · figure + variant · headline lines · copy-column bottom against
the hero box · window-group top · clipping.

| viewport | --u | window | figure | | ln | copyBot/hero | winTop | clip |
|---|---|---|---|---|---|---|---|---|
| 2560×1440 | 1.100 | 608×369 | 507×170 | 7A | 2 | 510.8/1358 | 875 | ok |
| **1966×594 (yours)** | **1.056** | **584×354** | **487×163** | **7A** | 2 | 490.2/512 | 48.5 | ok |
| 1920×1080 | 1.100 | 608×369 | 507×170 | 7A | 2 | 510.8/998 | 515 | ok |
| 1600×900 | 1.100 | 608×369 | 507×170 | 7A | 2 | 510.8/818 | 335 | ok |
| 1536×864 | 1.067 | 590×357 | 492×165 | 7A | 2 | 495.3/782 | 313.6 | ok |
| **1440×800 (ruled)** | **0.999** | **553×335** | **461×154** | **7A** | 2 | 464.4/718 | 279.1 | **unchanged** |
| 1440×396 | 0.647 | 358×217 | 298×64 | 7B | 2 | 300.6/314 | 29.7 | ok |
| 1366×768 | 0.944 | 522×316 | 435×145 | 7A | 2 | 440.5/686 | 271.1 | unchanged |
| 1280×650 | 0.879 | 486×295 | 405×87 | 7B | 2 | 412.8/568 | 181 | ok |
| 1280×800 | 0.879 | 486×295 | 405×87 | 7B | 2 | 412.8/718 | 331 | unchanged |
| 1024×768 | 0.710 | 393×238 | 327×70 | 7B | 2 | 330.2/686 | 374.1 | unchanged |
| 900×700 | 0.617 | 341×207 | 284×61 | 7B | 2 | 290.3/618 | 346.3 | unchanged |
| 820×1180 | 0.556 | 308×186 | 257×55 | 7B | 2 | 264.4/1098 | 852.3 | unchanged |
| 768×1024 | 0.517 | 286×173 | 238×51 | 7B | 2 | 247.6/942 | 713.2 | unchanged |
| 768×420 *stress* | 0.517 | 286×173 | 238×51 | 7B | 2 | 247.6/338 | 109.2 | unchanged |
| 600×900 | 1.000 | 553×226 | 365×78 | 7B | 3 | 313/818 | 319.6 | unchanged |
| 430×932 phone | 0.705 | 390×226 | 337×72 | 7B | 3 | 313/850 | 319.6 | unchanged |
| 390×844 phone | 0.633 | 350×226 | 303×65 | 7B | 3 | 313/762 | 319.6 | unchanged |
| 375×667 phone | 0.606 | 335×214 | 290×62 | 7B | 3 | 296.3/585 | 302.6 | unchanged |
| 360×640 phone | 0.579 | 320×204 | 277×59 | 7B | 3 | 282.6/558 | 288.6 | unchanged |

**✓ Nothing clips at any viewport.** Nine of twenty are bit-identical to today;
the rest grow. Nothing shrinks anywhere.

The headline stays at **2 lines** across every desktop viewport — worth stating,
because a larger `--u` against a fixed-px column is the one way this could have
regressed, and it does not.

**The routing rule, the bias, the hysteresis, the figure geometry, the chrome
and the composition are all untouched.** 7A now appears at 1966×594, 1536×864,
1600×900 and 2560×1440 because the window finally earns it — the rule itself is
unchanged and simply gets a bigger band to judge.

## 5. THE DIVISOR IS A DIAL — THREE SETTINGS, AT 1966 × 594

| divisor | --u | window | figure | vs 7A ref | air below the copy |
|---|---|---|---|---|---|
| 718 *(today)* | 0.713 | 394×239 | 329×70 · **7B** | 62% | 180.9px |
| 500 | 1.024 | 566×343 | 472×158 · 7A | 89% | 36.5px |
| **485 (proposed)** | **1.056** | **584×354** | **487×163 · 7A** | **92%** | **21.8px** |
| 465 *(your exact target)* | 1.100 | 608×369 | 507×170 · 7A | 95% | **1.2px** |

**I am proposing 485 rather than the 465 you named, and the reason is the last
column.** 465 is the exact-fit point: it puts the copy column's bottom 1.2px
from the hero's edge, so *"Automatically."* sits flush against it with no air at
all. Nothing clips today, but there is no tolerance left for a font fallback, a
copy edit, or a browser that rounds line-height differently.

485 gives up 3 percentage points of figure scale (92% instead of 95%, a 24px
narrower window) and buys 21.8px of breathing room. Renders for both are
attached — `U-AMY-d465.png` and `U-AMY-d485.png`. **If you look at them and
prefer 465, say so and it ships; the matrix for 465 is clean too** (identical to
the table above except your viewport reads 1.100 / 608×369 / 507×170 / 95%,
and 1440×396 reads 0.675 / 373×226).

## 6. THE ONE THING TO RULE ON BEYOND THE DIVISOR

The cap at 1.10 means **1920×1080, 1600×900 and 2560×1440 all grow 10%**
(window 553 → 608). That is a real change to compositions you have not
explicitly ruled on, and it is the proposal's whole blast radius outside short
viewports.

It is defensible — those viewports have the room, and today they render the
same size as a 1440 frame despite being much larger — but it is not what you
asked for, and a cap of `1px` would hold them exactly as they are while still
fixing everything below 800px of height. The cost of `1px`: your own 1966×594
would be capped at 1.000 rather than 1.056, giving a 553×335 window and 7A at
87% instead of 92%.

| cap | your viewport | 1920×1080 |
|---|---|---|
| 1.10 *(proposed)* | 584×354, 7A at 92% | 608×369 (grows 10%) |
| 1.00 | 553×335, 7A at 87% | 553×335 (unchanged) |

Either is a one-character change. **My recommendation is 1.10** — the whole
finding is that the composition renders smaller than it should on large
displays, and a 1080p monitor is exactly that case.

---

Reproduce: `node scripts/hero-u-proposal.js <url> <divisor> <cap>`, or
`... <url> current` for the shipped baseline.
