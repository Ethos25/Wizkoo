# Figure shift — findings

**Prototype and renders only. Nothing shipped; the deployed build is unchanged
and the lock still passes on it.**

Ruling was: shift the whole constellation down, lengthen the tether, render at
15u / 25u / 35u. All three were built and measured. **All three put the
constellation through the handle rule.** The maximum defect-free shift is
about **6u**, and 6u reduces the dominant void by 4%.

---

## 1. WHAT EACH OFFSET DOES — 1966 × 594

| shift | gap above the figure | Geography → rule | Writing → rule | |
|---|---|---|---|---|
| 0u *(shipped)* | 0 | 153.6 | **9.7** | ok |
| 4u | 4.3 | 149.4 | 5.4 | ok |
| **6u** | **6.4** | **147.3** | **3.3** | **ok — the ceiling** |
| 8u | 8.5 | 145.1 | 1.2 | ✗ touching |
| 10u | 10.6 | 143.0 | −0.9 | ✗ through |
| **15u** | 15.9 | 137.8 | **−6.2** | ✗ Writing label through the rule |
| **25u** | 26.4 | 127.2 | **−16.7** | ✗ Math +3.8, Writing +16.7 |
| **35u** | 37.0 | 116.6 | **−27.3** | ✗ Math +14.4, Writing +27.3, **and both stars** |

1440 × 800 behaves identically: 15u → Writing −6.6, 25u → Math +4.0 / Writing
+16.6, 35u → Math +14.0 / Writing +26.6 / both stars through.

Renders: `SHIFT-{amy,ref}-{00,15,25,35}u.png`, plus `SHIFT-fine-{4,6,8}u.png`.
At 15u the rule cuts through the word WRITING. At 25u and 35u both MATH and
WRITING sit in the handle row beside "BUILD YOUR OWN".

## 2. WHY IT CANNOT WORK — THE VOID IS DIAGONAL, THE SHIFT IS UNIFORM

The constraint and the target are the same distance measured in two places, and
they differ by **16×**:

```
Writing's label     9.7px of headroom   <- caps the shift
Geography's void  153.6px               <- what the shift is meant to fix
```

A uniform translation is capped by the tightest point on the figure and judged
at the loosest. Spending the entire 9.7px budget buys a 6% reduction in the
Geography void. To halve that void the figure would have to move ~77px, which
is eight times more than the bottom edge has.

**And the shift does not remove emptiness — it relocates it.** At 35u you gain
37px of new empty space between the sentence and the figure to take the
Geography void from 153.6 to 116.6. The dominant void survives at 116.6px and
a second one opens at the top. That is a worse composition than the one that
prompted this, and it is why the tether has to stretch to 75px to keep up.

## 3. WHAT THE 1440 × 800 LOCK REPORTS

Clean and legible — exactly one value at every offset, which is the shift
itself. No star moves relative to the figure; no chrome moves.

| offset | lock |
|---|---|
| 0u | **PASSES, nothing moved** |
| 15u | 1 value: `.lw-figure y: 445.97 -> 460.97` |
| 25u | 1 value: `.lw-figure y: 445.97 -> 470.97` |
| 35u | 1 value: `.lw-figure y: 445.97 -> 480.97` |

So if a shift is ever ruled in, accepting it costs one baseline re-capture and
the diff states the offset in plain px. Scoping it to large windows only is
also available — the lock would stay green at 1440×800 untouched — but on the
numbers above there is no offset worth scoping.

## 4. THE TETHER

It behaved exactly as ruled: pinned in window space under the word, its end
riding down with the theme star, lengthening 38.4 → 54.3 → 64.8 → 75.4px. It
was the only element that changed shape and it held at every offset. The
mechanism works; it is the destination that does not.

## 5. WHERE THIS LEAVES IT

Three levers have now been tried against this void:

| lever | result |
|---|---|
| band placement / sizing | figure fills its band exactly, slack 0.00 — nothing to reclaim |
| shorten the handle rule | **shipped** — removes the underline that made a diagonal void read as a horizontal band |
| shift the figure down | capped at 6u by Writing's label; buys 4% |

The rule change is the one that worked, because it addressed the reading rather
than the geometry. The void itself is 7A's own silhouette — Geography y36,
Science y66, Art y124 of 178 — and it is present at 1440×800 in identical
proportion, in the frame that was ruled good.

**Recommendation: stop here and leave the figure alone**, which was the standing
instruction if the rule did not resolve it. If the void still reads after
walking the shortened rule, the honest next move is not another displacement of
the whole figure but a decision about the three right-hand stars — and that
trades the depth spread, which was already ruled to be worth more.

---

Reproduce: `node scripts/hero-figure-shift.js <url>`.
