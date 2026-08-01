# Handle row down · band grown — findings

**Prototypes and renders only. Nothing shipped; the deploy is unchanged and its
lock still passes on it.**

You were right that my last framing was too narrow — I answered "can the figure
move with everything else frozen" when nothing was frozen. Both instructions
are built and measured below. **One of them makes the void worse, and the
reason is the useful finding of this round.**

---

## 1. HOW MUCH THE HANDLE ROW RECLAIMS — AND A CORRECTION TO THE PREMISE

**Measured before moving anything, ink to window edge:**

| | 1966 × 594 | 1440 × 800 |
|---|---|---|
| top — window edge → eyebrow ink | **20.11px (5.68%)** | 18.98px (5.67%) |
| bottom — CTA ink → window edge | **12.14px (3.43%)** | 11.48px (3.43%) |

**The bottom padding was already 40% tighter than the top, not looser.** Taken
literally, "match the sentence's top padding for symmetry" would move the
handle row *up* by ~8px and shrink the band. I did the opposite, because
moving it down is plainly what you're after — but the symmetry argument points
the other way, and you should have that before ruling.

**Moving it down anyway** — `padding-top` 1.718% → 1.10% of width, `bottom`
3.580% → 2.20% of height (both reclaim, since the foot is bottom-positioned so
a shorter foot *and* a smaller offset each push the rule down):

| | rule | reclaimed | below-CTA optical |
|---|---|---|---|
| 1966 × 594 | 311.6 → **320.1** | **+8.5px** (2.4% of the window) | 12.1 → **7.3px** |
| 1440 × 800 | 295.0 → **303.0** | **+8.0px** | 11.5 → **6.9px** |

That takes the bottom from 40% tighter than the top to **64% tighter**. It is
the whole of what is available down there.

## 2. THE THREE VARIANTS

| | rule | band | figure | gap above | **Geography → rule** | Writing → rule |
|---|---|---|---|---|---|---|
| **shipped** | 311.6 | 486.7 × 162.9 | 486.8 × 162.9 | 0 | **153.6** | 9.7 |
| **A · rule + shift 14u** | 320.1 | 486.7 × 171.4 | 487 × 162.9 | 14.8 | **147.3** *(−4%)* | 3.3 |
| **B · rule + band grown** | 320.1 | 512.2 × 171.4 | **512 × 171.3** | 0 | **161.3** *(+5%)* | 10.6 |

1440 × 800 behaves the same: A → Geography 145.3 → 139.4, Writing 2.3.
B → figure 484.7 × 162.2, Geography 145.3 → **152.6**.

Renders: `V-{amy,ref}-{shipped,A-rule+shift,B-rule+grow}.png`.

### The finding: growing the figure grows the void

**B makes the void bigger.** The figure gets 5% larger — 512 × 171 is **96% of
7A's own 532 × 178 reference**, the closest this composition has ever come to
it — and the gap under Geography goes *up*, 153.6 → 161.3.

That is not a bug in the variant. **The void is a fixed fraction of the
figure**, not an absolute quantity: 43.4% of the window's height under
Geography, measured identically at 1440 × 800 and at 1966 × 594 across every
round of this. Scale the figure and the void scales with it.

So the two levers pull against each other:

- **shift** — capped by Writing's label, which has 9.7px of headroom against
  Geography's 153.6px void. Reclaiming 8.5px roughly doubles the budget and
  buys 4%.
- **grow** — uncapped, and actively counter-productive for this problem, though
  it is the best answer if the goal is a figure nearer its reference size.

**No amount of reclaimed window space removes the void, because the void is
proportional.** That is what B proves, and it is worth more than the 8.5px.

## 3. WHAT THE 1440 × 800 LOCK SAYS

Shipped: **PASSES.**

**A · rule + shift — 5 values:**
```
.lw-foot   y  606.03 -> 614.06     (+8.03, the rule down)
.lw-foot   h   27.98 ->  24.58     (-3.40, shorter foot)
.lw-cta    y  616.52 -> 621.14     (+4.62)
.lw-band   h  154.13 -> 162.16     (+8.03, the reclaimed height)
.lw-figure y  445.97 -> 459.97     (+14.00, the shift)
```

**B · rule + band grown — 9 values:** the five above, plus
```
.lw-band   x  893.31 -> 881.34     (-11.97, wider band)
.lw-band   w  460.72 -> 484.66     (+23.94)
.lw-figure x  893.34 -> 881.34     (-12.00)
.lw-figure w  460.66 -> 484.67     (+24.01)
.lw-figure h  154.13 -> 162.16     (+8.03)
```

Both move the approved frame; neither touches a star's position *within* the
figure, the type, or the sentence. Accepting either costs one baseline
re-capture. Scoping to large windows only would keep 1440 × 800 green, and for
A that is worth considering; for B it is not, because B's value is the larger
figure and that is wanted everywhere or nowhere.

## 4. MY READ

**If the goal is the void: none of this reaches it.** A buys 4% for a bottom
padding 64% tighter than the top and Writing's label 3.3px off the rule. That
is a real cost for an invisible gain.

**If the goal is a figure that finally sits near its own reference size: B is
the best thing built in this whole round** — 96% of 532 × 178, against 92%
today and 62% before the scaling law. It happens to make the void 5% larger,
which the shortened rule already stopped underlining.

Those are two different objectives and B is the answer to the second one. If
you want it, the honest framing is "the figure reaches its reference scale",
not "the void closes" — and it costs 9 values on the lock.

---

Reproduce: `node scripts/hero-window-variants.js <url>`.
