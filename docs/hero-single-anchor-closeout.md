# Hero single anchor + column gap — close-out handoff

Branch `excellence-round-1`. Live: https://excellence-round-1--wizkoo.netlify.app

Composition commit: **`13828cd`** (candidate B). Baseline re-capture and this
handoff follow it.

**Ruled by Amy from renders, 2026-08-01:** candidate **B, column gap 68u**,
certified on her walk. The 1440×800 geometry lock was re-captured to it — the
new positions are the ruling now.

**Closed in this round:** the two conflicting vertical anchors, the optical
correction, the column gap and the frame that follows from it, the geometry
lock's new baseline.

**Deliberately left open:** § 6. Read it before opening the hero again.

---

## 1. THE SINGLE ANCHOR — `index.html`, `.hh-copy` / `.hh-group`

The defect was two anchors. `.hh-copy` was pinned to the band's TOP at 68u and
`.hh-group` to its BOTTOM at 72u, so the two halves met at exactly one band
height and separated at every other. Measured on the deployed hero before the
change:

```
1966×594   copy centre 363.00   card centre 341.10   apart by  21.90px
1440×900   copy centre 348.21   card centre 660.53   apart by 312.32px
```

At 1440×900 the copy's bottom edge fell **53.35px below the card's top edge**.
Two panels sharing a viewport, not one composition.

Both columns now centre in the `.hh` band:

```css
@media(min-width:768px){
  .hh-copy,.hh-group{ top:0; bottom:0; margin-block:auto; height:fit-content }
}
```

**Auto block margins, not `translateY(-50%)`.** Auto margins resolve in layout,
so poster-scale type paints on the pixel grid. A −50% transform of a fractional
height lands the display face on half-pixels and softens it.

**THE SCOPING IS LOAD-BEARING, NOT TIDINESS.** Unscoped, this leaks into the
phone frame. The mobile block overrides `top` only, so an unscoped `bottom:0`
plus auto margins survives into it and slides both columns **~152px** down the
375 frame. That was measured on a deploy, not predicted. If you ever move these
declarations out of the media query, re-measure 375 before you push.

## 2. THE OPTICAL CORRECTION — `--hh-group-optical`

```css
--hh-group-optical: calc(var(--u) * -16);   /* on .hh-group, as translate */
```

Geometric centring is not the answer, because `.hh-group` centres the whisper +
window **stack** while the composition's mass is the window. The whisper is one
italic line reading in as a lead. Centring the stack therefore drops the
window's own centre below the band's by half the whisper stack:

```
whisper   font-size 20u × line-height 1.45   =  29u
gap       .hh-whisper margin-bottom          =   3u
                                                ---
stack sitting above the window                  32u   ->  half = 16u
```

Measured after geometric centring, window centre minus band centre: **16.87px**
at 1966×594 (u 1.05566 = 15.98u) and **16.00px** at 1440×900 (u 1.000 =
16.00u). Derivation and measurement agree.

**16 is not a new interval.** It is half of 32, and both already belong to the
hero's vocabulary. Nothing was introduced to make this work.

**RE-DERIVE IF THE WHISPER WRAPS.** This is half a ONE-LINE stack. At two lines
the stack is 61u and the token is wrong by 14.5u. The whisper is 470u wide and
sets one line at every desktop width the law produces, so a **copy edit** is
what would break it, not a viewport.

### What the pixel scan says, and how to repeat it

Ink extents were read from a real alpha channel, not from a colour diff:
`body,body *{visibility:hidden}` plus `visibility:visible` on the target
subtree, screenshot with `omitBackground:true`, PNG round-tripped through a
canvas so `getImageData` exposes per-pixel alpha.

**Isolate by visibility. Do not enumerate background layers.** The first
attempt hid photo/veil/seam/grain by name and still returned the whole band as
lit, because `body::after` and the scroll-driven cream layer were still
painting.

**Alpha threshold: α ≥ 64.** The faintest intended ink in the copy block is the
eyebrow at 0.50 alpha (127.5/255), so the threshold must sit below it; 64 is
half that and clear of antialias fringe. The copy's extents are identical at
α ∈ {8, 16, 32, 64, 128} at every viewport and only move at 192, where the
0.64-alpha support line drops out. The measurement sits in a plateau.

**The card is scanned at α ≥ 192, and its extents are not otherwise usable.**
It carries several external glows (`.lw-bleed` at inset −70u, a 150u
box-shadow, a warm spill), so at low thresholds the scan returns glow, not
card. At 192 it recovers the hard rectangle to within 0.6px of its box.

Result after the correction:

| Viewport | u | Band mid | Copy **ink** mid | Card mid | Disagreement |
|---|---|---|---|---|---|
| 1966×594 | 1.05566 | 338.00 | 337.50 | 337.98 | 0.48px = **0.45u** |
| 1440×900 | 1.00000 | 491.00 | 490.50 | 491.00 | 0.50px = **0.50u** |
| 1440×396 | 0.64742 | 239.00 | 237.50 | 239.00 | 1.50px = 2.32u |

Both desktop viewports land under the 1u bar and under one device pixel. Not
corrected further: **a correction below the measurement's own resolution is a
nudge wearing a token's name.** At 1440×396 the residual exceeds 1u only
because u is 0.647 there and one device pixel *is* 1.545u.

## 3. THE COLUMN GAP — `--hh-gap`, `--hh-win`, `--hh-frame`, `--hh-inset`

Two things pushed the columns apart above the approved frame, and only the
second is visible in markup.

**The window COLUMN inflates but the window does not.** `--hh-span5` is five
twelfths of the viewport; the card is capped at 553u and sits right-aligned
inside it. At 1966×594 that was a 771.83px column holding a 583.78px card —
**188.05px of dead column**, sitting exactly where the composition needed air
taken out.

```css
--hh-win: min(var(--hh-span5), calc(var(--u) * 553));
```

`min()` can only ever narrow the column, never widen it. At 1440 it resolves to
552.66px, the span it already was, which is what leaves the card width, the
band handed to the constellation and SHIFT_Q untouched at the approved frame.

**The gap itself was never a decision.** It was grid column 7 plus its two
gutters, so it grew with the viewport: 139.34px at 1440, 183.17px at 1966, and
it would have kept going.

```css
--hh-gap:   calc(var(--u) * 68);
--hh-frame: calc(var(--hh-span6) + var(--hh-gap) + var(--hh-win));
--hh-inset: max(var(--hh-margin), calc((100% - var(--hh-frame)) / 2));
```

**THE GAP IS THE DESIGNED QUANTITY; THE FRAME IS ARITHMETIC.** Do not reach for
a container width here and let the gap fall out of it — that is how the
composition ended up keyed to the viewport in the first place. Set the gap; the
frame follows. `max()` holds `--hh-margin` as the floor so any viewport too
narrow to seat the frame behaves exactly as it did.

**68u reuses the interval that governed the vertical.** It is the top pin
Change 1 removed; 72u, rendered as candidate A, is the bottom pin. Neither is a
new number. The interval that ruled the vertical now rules the horizontal.

Shipped geometry:

| Viewport | u | Gap px | Gap u | Frame px | Inset L/R | Left col |
|---|---|---|---|---|---|---|
| 1966×594 | 1.05566 | 71.82 | 68.03 | 1586.60 | 189.70 | 931 |
| 1440×900 | 1.00000 | 68.03 | 68.03 | 1288.68 | 75.66 | 668 |
| 1440×396 | 0.64742 | 44.05 | 68.04 | 1070.06 | 184.97 | 668 |
| 375×812 | 1.00000 | — | — | 335.00 | 20.00 | 335 |

**Column widths are untouched at every viewport** (931 / 668 / 335, identical
to the control), so the arrest's composed two-line break cannot reflow. Its
rendered height is unchanged at 225.88 / 214 / 147.66 / 138.56.

### What this costs at 1440, stated exactly

**This change is NOT inert at 1440, and cannot be made inert at any candidate
value.** That is arithmetic, not tuning. At the approved frame the content
width is 1360px and the two columns measure 668 + 552.66 = 1220.66px, so the
gap that leaves the margins on 40px is **139.34px and no other value does**.
Any gap below it pulls each side inward by exactly (139.34 − gap) / 2:

```
candidate A, 72u   inset 40 -> 73.66   delta 33.66px per side   gap -67.31px
candidate B, 68u   inset 40 -> 75.66   delta 35.66px per side   gap -71.31px
```

The only inert gap is 139u, which is not in the hero's vocabulary. It was not
introduced. Amy ruled B on the render with this cost stated.

## 4. THE GEOMETRY LOCK — re-captured to the new ruling

`tests/hero-1440x800.baseline.json` was re-captured from the **deployed**
candidate B, not from localhost:

```bash
node scripts/hero-geometry-capture.js https://excellence-round-1--wizkoo.netlify.app
```

38 values differ from the previous baseline. **All 38 are `x` and `y`.** There
is no `w`, `h`, `font-size`, figure-variant or tether-length delta — the
correct signature for a change that moves a composition without resizing or
retyping it. `--u` is still exactly 1 at the frame and the figure is still 7A.

```
3 passed — composition has not moved · --u is exactly 1 · figure is 7A
```

The rule in `tests/hero-1440x800.spec.js` still stands and this round did not
weaken it: **do not re-capture to make a failing test pass.** It was re-captured
here because Amy ruled a new composition, which is the one condition the header
allows.

## 5. CONSTELLATION — unchanged, measured not asserted

SHIFT_Q was recovered from the DOM as `.lw-figure` inline `marginTop` ÷
`.lw-band` inline `height` — exactly the two quantities
`js/hero-constellation.js` writes from `avail[1] * SHIFT_Q`.

| Viewport | SHIFT_Q | Figure | Band | Variant | Nodes |
|---|---|---|---|---|---|
| 1966×594 | 0.12 | 437.406 × 146.344 | 166.310 | desktop | 123 |
| 1440×900 | 0.12 | 413.922 × 138.484 | 157.383 | desktop | 123 |
| 375×812 | 0.12 | 298.141 × 63.813 | 87.114 | mobile | 123 |
| 1440×396 | 0.12 | 318.625 × 68.188 | 101.608 | mobile | 123 |

`window.__wkcFigShift` is `undefined`, so 0.12 is the shipped default and not a
harness override. Identical across all three candidates and identical to the
pre-change audit. Position B (Decision Registry `3b0335a8d33281499f0ccca7bc180a82`)
is intact.

### The handle rule's dissolve, verified live

Ruled: full strength to 60% of the window, gone by 86%. Verified on the
deployed page from **rendered alpha**, not from the declared stops:

| Viewport | Full strength through | Half strength at | Gone by | Peak alpha |
|---|---|---|---|---|
| 1966×594 | 60.62% | 73.12% | 85.96% | 59 |
| 1440×900 | 60.40% | 72.88% | 85.90% | 66 |
| 1440×800 | 60.40% | 72.88% | 85.90% | 66 |

Ruled 60 / 73 / 86. All three within half a percent, and the foot measures
8.316%..91.684% of the window against the 8.318%..91.682% the stops were
derived from.

**The peak alpha of 59 at 1966×594 is rasterisation, not a colour change.** The
declared `background-image` is byte-identical at all three viewports
(`rgba(232,175,56,0.26) 0% → 62%`, `rgba(232,175,56,0) 93.18%`). The rule is
`height:1px` at `top:-1px` on a foot whose y is fractional there, so the hairline
straddles two device rows and its alpha is split between them. 0.26 × 255 =
66.3 is recovered exactly wherever the row lands on grid.

## 6. DELIBERATELY OPEN — read before reopening the hero

1. **The copy column's box is much wider than its ink.** At 1966 the box is
   931px while the longest line of type is 665.53px. The perceived type-to-window
   distance in B is therefore **337.29px**, not the 71.82px gap. B halves it (the
   control was 636.69px), but what remains is the empty right quarter of the type
   column, not the gap. **If the composition still reads apart, this is the next
   quantity — and it is a different decision, because narrowing the column risks
   the arrest's two-line break.** Amy has not ruled a reflow.

2. **Mobile (375) is a separately hand-authored spacing set**, with three
   relationships inverted against desktop and 112px of dead band below the
   stage. Out of this round by direction. Change 1's anchor does not reach it by
   design, and it was verified byte-identical after the scoping fix: copy
   midpoint 249.52 against 249.53 pre-change, card 452→678 unchanged.

3. **The hero renders at a 40px gutter while `--content-pad` declares 48px.**
   Known, filed, untouched. `--hh-margin` and `--hh-gutter` are still hardcoded
   px (40/24/20 and 24/16) and were deliberately not converted this round.

4. **`TECHNICAL_RUNBOOK.md:2234` documents an 8pt spacing scale that does not
   exist** in any shipped `.css`, `.js` or `.html`. Filed, not written to.

## 7. WHAT MOVED, IN ONE LIST

Converted to a stated `u` interval this round:

```
--hh-gap            68u    was grid column 7 + 2 gutters (viewport-derived, never stated)
--hh-win            553u   was --hh-span5 (viewport-derived), now capped by the card's own width
--hh-group-optical -16u    new named token, = half of 32u, derived in § 2
--hh-frame                 arithmetic: span6 + gap + win
--hh-inset                 arithmetic: max(margin, (100% - frame) / 2)
```

Removed: `.hh-copy { top: 68u }` and `.hh-group { bottom: 72u }`.

Not converted, on purpose: `--hh-margin`, `--hh-gutter`. See § 6.3.
