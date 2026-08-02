# ORBITAL PORT — CLOSE-OUT HANDOFF

**Written 2026-08-02 at lane close. Branch `orbital-port-lane`. Everything the
lane carries stands as walked EXCEPT the nucleus, which Amy rejected on the
final walk (her eye, final: "reads flat, removed from the scene") and which is
being rebuilt ground-up in a fresh session, worktree `nucleus-rebuild`, cut
from this lane's tip. Section 9 is that rebuild's inheritance: the full
failure record, so it does not repeat six rounds of what did not work.**

Every number here was read back out of the files or measured on the deployed
branch preview (`https://orbital-port-lane--wizkoo.netlify.app`), never
remembered. The verification instrument is `scripts/orbital-port-verify.js`;
its final run: ALL CHECKS PASS on the tip.

---

## 0. PROVENANCE CHANNELS, SO THE RULINGS SECTION CAN BE TRUSTED

Two channels carried instructions into this lane:

- **Amy in chat, verbatim** — quoted below with her words. Strongest evidence.
- **Directive channel** — bracketed `[→ Code: ...]` briefs relaying her walks
  (the port brief, the three-defect round, the nucleus round, this close-out).
  Marked "(directive)" below. Where a directive contradicted her later in-chat
  words, her words governed and the contradiction is recorded where it
  happened (e.g. the nucleus-round directive said "scale ruling still open /
  build on render-A" after she had already ruled B in chat; the variants were
  built on the ruled lane instead, stated to her at the time).

---

## 1. THE TIP

```
branch   orbital-port-lane
tip      (the commit carrying this document — stated in the close-out report
          and by `git rev-parse orbital-port-lane`; pushed to origin)
base     57ece32 (excellence-round-1 at branch time, 2026-08-01)
```

The `nucleus-rebuild` worktree cuts from this tip. Nothing from this lane has
merged anywhere. The homepage reaches production through the merge-order law
after the nucleus rebuild lands on top.

One flagged cross-lane fact: this lane carries a ONE-PROPERTY diff to
`css/hero-window.css` (section 7), a file otherwise owned by the hero lanes.
They must know before any merge.

---

## 2. THE RULED STATE — WHO DECIDED WHAT

### Amy's rulings (verbatim where in chat, all 2026-08-02 unless noted)

| # | Ruling | Her words / channel | Where it landed |
|---|---|---|---|
| A1 | Scale + nucleus size: render B | "I like the smaller nucleus I think that's b" (chat) | `FIGURE = 0.5`, `NUC_RATIO = 0.200`, js/orbital.js |
| A2 | HISTORY label away from SCIENCE | "history is still too close to science... move it a little bit up and to the left" (chat, with screenshot) | LABEL_PUSH history (later retired with F; see A5) |
| A3 | Review verdict adopted | "let's adopt everything you said let's reject everything you said" (chat) | hover round shipped; glass spheres / ring particle / parallax stay rejected |
| A4 | Motion re-ruled: alive, not invisible | "I want the movement to be so subtle that it feels alive... I want some stars to twinkle in the background and I definitely want a shooting star... and I definitely want the subjects to move" (chat) | drift on, far-layer subset twinkle, two shooters, §5 |
| A5 | Arrangement F: the old composition | "that inspiration photo is exactly what I want... that is the old diagram's composition and the positioning... and the arcs" (chat, with the picture) | ARRANGEMENTS.F, ARR_KEY='F' |
| A6 | Hero window ink match | "the box in the home page hero is rendering a lot darker than the background of this night sky can you make them match? I don't want you to really mess around with anything else" (chat) | css/hero-window.css, one property, §7 |
| A7 | Hover softened, option 1 | "OK do option 1 soften it" (chat) | dim values 0.75/0.85/0.85/0.6, §6 |
| A8 | Nucleus falloff neighborhood: N2 | "N2 is the one, fold it into the lane" (chat) | u 0.96 p 3.2 — then superseded by A9 |
| A9 | **Nucleus REJECTED entirely** | close-out directive: "Amy's eye, final: reads flat, removed from the scene" | §9. Ground-up rebuild inherits |
| A10 | Round-2 walk defects | chat, 2026-08-02: labels "on top of each other"; nucleus "too much light... feels like a flat object still but with a lot of light in it" | label floor scaling; first nucleus re-tune (both since superseded by F / A9) |
| A11 | Port brief, defect round | directives, 2026-08-01/02: kill order on the old geometry's *material*; sky missing; below fold; scale renders | the port itself; §3-§5 |

**Corrections to my own earlier record, per the close-out instruction.** Two
entries I had leaned on as "certified/ruled" were not Amy's:

- The **kill order's geometry clause** (old arcs rejected) was the LAB's
  ruling, which Amy reversed in A5. Recorded correctly at the F commit; noted
  here so the rebuild does not treat the lab's kill as hers.
- **"Two shooters at 50-90s"** and every other specific number in A4's
  implementation are BUILDER numbers serving her ruling, not her numbers. She
  ruled the outcomes (visible shooter, some background twinkle, subjects
  moving subtly). The counts, periods, and subsets are mine and are open to
  re-tuning without touching her ruling.

### Builder decisions (mine; presented to Amy but never individually ruled)

| Decision | Value | Basis |
|---|---|---|
| viewBox WINDOW crop | `187 134 1060 676` | the composed object uses 1028x644 of the 1440x984 frame; crop the unused margin, coordinates untouched, overlap scale-invariant |
| Type and ring stroke do NOT scale with FIGURE | labels stay 14px/12px; ORBIT_WIDTH 1.1 units | scaling them with the half-size geometry lands type at ~6px and stroke under the visibility floor; implicitly accepted when Amy ruled B from renders built this way |
| Label floor scales with FIGURE | `252 * FIGURE` | at FIGURE 1 the floor binds nobody (min want = 272); unscaled at 0.5 it pinned 4 of 7 labels onto one circle — the A10 collision's mechanism |
| LABEL_PUSH values | history 55, writing 20 (F); the retired history 68, math 30 | magnitudes mine; A2 set history's direction |
| K = 1600, periods 163/263/421 | see §4 | K from the measured ceiling; periods restore the lab's 0.85 px/s design point; primes preserved |
| Shooters 2 @ 50-90s; far twinkle every 8th (127/1,021); near twinkleScale 1.3 | js/orbital-sky.js, css/orbital.css | serving A4 |
| Scrim strengthened | 0.58/0.38/0.13 → 0.72/0.50/0.18 | the A3-adopted "mask the ring behind words", tuned at half FIGURE |
| Hover dim values + timing | §6 | option-1 softening ruled (A7); numbers mine |
| Hero window: vignette untouched | inset shadow stack unchanged | A6 said background only; the residual ~6-point edge difference is the window's certified interior shading |
| All nucleus tuning numbers across all rounds | §9 | chasing her verbal register; every one now rejected with the nucleus |

Arrangements C (lab-certified), E (Gemini-skeleton braid, explored ~1 hour),
and D ('5') remain in the ARRANGEMENTS table as the record. F ships.

---

## 3. GEOMETRY — ARRANGEMENT F (RULED, A5)

The pre-port section's three ellipses (310/178 @ -32, 280/160 @ -8, 240/135
@ 25 in its 1011-frame) scaled by 480/310 so the envelope Amy ruled at B holds.
Full-frame units; FIGURE 0.5 halves them at build:

```
        rx    ry    rot     O=ry/rx    on screen (x0.5)
  c    480   275    -32      0.573      240 / 137.5
  a    434   248     -8      0.571      217 / 124
  b    372   209     25      0.562      186 / 104.5

nucleus R = NUC_RATIO * max rx * FIGURE = 0.200 * 480 * 0.5 = 48
```

**Node seats are solved, not copied.** Each old dot was fit against all three
old ellipses; with the right assignment every residual is <= 0.56 units:

```
  reading  c t265    writing  c t300    math  a t5      science  b t30
  history  a t100    geo      a t130    art   a t180
```

Four subjects ride the middle ring, two the outer, one the inner — the
photo's own structure. The verifier asserts every seat error < 1.5 units
against the photo's positions (0.774 x the old offsets from its centre).

**Occlusion is declined** (min approach 104.5 vs R 48): the picture Amy chose
declines it, as C did. The paint-order machinery and silhouette layer stay in
the code, dormant, for any arrangement that crosses again.

Anchor: `preserveAspectRatio="xMidYMid meet"` in a box filling the orbital
zone; the section's height rules untouched; no hero anchoring pattern
imported. Below 768px the stage hides and the existing list fallback shows
(mobile was never composed — inherited from the lab, still true).

Fold at 1966x594 (Amy's viewport): figure bottom 578 vs fold 594 — 16px clear.

---

## 4. LABELS AND DRIFT — WHAT MOVED, AND THE MATH THAT MAKES FULL AMPLITUDE SAFE

### The mechanism history (why the floor scales)

The certified floor was `max(dist + NODE_R + 34, NUC_R + 80, 252)`. Under C at
FIGURE 1 the 252 binds nobody (nearest label wants 272), so the lab's 823,543-
configuration exhaustion never rode on it. At FIGURE 0.5 it pinned four of
seven labels onto one 252-unit circle → the SCIENCE-on-HISTORY pile-up Amy
rejected (A10). Fix: `252 * FIGURE` — the floor is geometry; the +34 and +80
are label-size terms and type does not scale, so they hold. At FIGURE 1 the
line is identical to the certified one.

### What moved under F

- GEOGRAPHY's node went with F's re-seat (t 130 on ring a; all seats §3).
- LABEL_PUSH: history +55 (radially, its label otherwise lands 27 units into
  GEOGRAPHY's — the old layout hand-tucked it under its dot and the radial law
  does not), writing +20 (opens READING from 14 to ~34 units).

### The collision math

Composed state, measured on the deploy (text-union boxes, not scrim boxes —
the scrim is a soft gradient whose overlap is invisible; the ink is the
label): **0 overlaps**, worst gaps all >= ~34 units.

Amplitude safety: the reachable set is the excursion box — each node walked
independently to the corners of ITS OWN amplitude (the lab's fixed-±16° box
was a recorded bug; amplitude is per-body). 3^7 = 2,187 corners walked
in-browser against real rendered text on every verify run:

```
under F at K = 1600:  0 overlaps in 2,187 configurations
```

The bar ("wherever two labels touch, the dimmer has receded to 0.45") is
never even invoked — no contact exists anywhere the system can reach. The
ceiling search (`scripts/orbital-k-solve.js`, binary search on the amplitude
scale with the same box walk) found s = 1.0 clean at K = 1600. For the
record, the same instrument under the abandoned FIGURE-0.5-C geometry found
NO clean amplitude (science x history composed gap was 1.6px; violation
persisted to s = 0.05) — that is what forced the E/F re-composition rather
than an amplitude cap.

### Drift settings (A4 serving; numbers builder)

```
K = 1600            capped by the measured ceiling under the PRE-F geometry
                    (1662); under F the box is clean at this K with margin
P = 163 / 263 / 421 all prime (were 307/491/787); shortened so the smaller
                    amplitude keeps the lab's 0.85 px/s peak screen speed
peak speed          0.853-0.855 px/s measured, identical on all seven bodies
k_i spread          0.920..1.088, distinct per body (decorrelated by period)
```

Every sine starts at zero: `librate(n, 0)` is exactly the composed state, so
the arrival lands on what "static" shows. Measured travel: HISTORY 15.6 CSS px
in 45s. Under F, full amplitude could likely go above 1600 (ceiling not probed
upward); nothing asked for it.

### Owed on labels

The lab-style OFFLINE exhaustion (hundreds of thousands of model configs) was
never re-run for F. Coverage is the in-browser 2,187-corner walk with real
text on every verify. If someone wants the offline proof, adapt
`scripts/lab-orbital-label-solve.js` to F's table.

---

## 5. SKY AND MOTION — WHAT RUNS, AND WHY IT PASSES THE CASINO TEST

- **1,834 stars** at the certified density (0.1% drift from the product's own
  number), 12 anchors (ruled by eye in the lab, not scaled), generator
  untouched — `js/orbital-sky.js` only re-hosts the FIELD.
- **`--u` scope**: the certified generator sizes stars as
  `max(1px, calc(var(--u) * n))`; `--u` lives on the HERO's wrapper, not
  `:root`. Without the scoped copy on `.linen-hero` (verbatim from the lab's
  own declaration) every star computes to 0px and the sky dies silently —
  found on Amy's walk after a star-COUNT check passed it. Assert box size,
  never count (§8).
- **Twinkle**: near layer 800 animated at twinkleScale 1.3; far layer frozen
  EXCEPT every 8th star (127 of 1,021) via
  `.orb-sky .wk-sky__layer--far .wk-sky__star:not(:nth-child(8n))` — the
  primitive's own animation with the generator's own inline values, nothing
  re-declared. Serving A4 ("some stars... not 1,021"). Frame cost stays at
  the near layer's step; 940 total animated vs 813 before — unmeasured on
  Amy's hardware, she never reported weight (owed, §10).
- **Shooters**: two, each on its own random 50-90s period and trajectory
  (deployed instance drew 56.3s and 64.6s). The lab's one-@-60-120s averaged
  90s between runs; Amy never saw one (A4). Alternating paths on drifting
  relative phase — no cadence to catch.
- **Breath**: three layers on TWO periods, 3.7s and 8.9s, mutually prime
  (alternate cycles 7.4/17.8s). The corona rides the body's 3.7s keyframe by
  round-5 design ("the glow follows"). The 5.3s `.lo-breath-b` rule matches
  nothing — see §9 inherited notes.
- **Casino status after A4**: Amy re-set the design point from "never seen
  moving" to "subtle but alive". Her ruled casino text (no catchable loops,
  no attention-pulling repetition) still governs; drift at 0.85 px/s peak,
  staggered twinkle, and random-period shooters all comply. No setInterval,
  no repeat:-1 anywhere in the shipped system.
- **Reduced motion**: completed state, 0 running animations, frames 5s apart
  byte-identical. Depth-linked label presence still applies (distance, not
  motion).

---

## 6. THE HOVER SYSTEM

**What it does (A3 adopted; A7 softened):** pointer rests on a subject (node
or label; the always-on scrim doubles as the label's hit area, +8px pad) →
everything else eases back — labels 0.75, nodes 0.85, other orbits 0.85,
leaders 0.6 — the subject's label comes to FULL presence (deliberately
out-ranking its depth attribute: reading a far-side subject is what hover is
for), and its own orbit holds. Enter 260ms, release 420ms, product ease
`cubic-bezier(.16,1,.3,1)`. Cursor stays default — the softening exists
because a strong isolate promises a click these subjects do not have (Amy's
call, option 1 of three; option 2, real per-subject click destinations, is a
someday content round that is hers to author).

**Why geometric hit-testing, not browser boundary events — do not regress
this:** `pointerenter/leave` fail deterministically on this figure. Chromium
re-fires boundary events under a STATIONARY cursor when the hovered element
mutates, and the drift rewrites every label's transform every frame, forever.
Measured on the deploy: enter, then spurious leave, within one frame, mouse
never moving. The hover therefore tracks geometrically: rAF-throttled
`pointermove` on the section tests the pointer against each subject's label
and node boxes. **Latest-position-wins** throttling — the first version kept
a burst's FIRST position and judged a sweeping cursor by a point mid-flight.

**Where the dims land — the animation-precedence trap:** the arrival's
animations fill `both` forever and out-rank any class. Dims live only on
animation-free elements: `.lo-node-place` (a group added for exactly this),
`.lo-label-depth`, leader lines, path elements — the same reason label depth
lives on its own group. The reduced-motion `opacity:1 !important` rules
target `.lo-node`/`.lo-label` and never collide.

Mouse pointers only (`pointerType` gate): on touch a tap would latch a state
no gesture releases. Under reduced motion the state applies instantly.
Nucleus, corona and sky never dim. No glow is added to the focused subject —
full presence is the illumination; a new glow would be a second light.

**NOT built, deliberately:** hover inside the hero window card. The card is
ONE link; per-subject hover inside it would promise per-subject destinations
that do not exist.

---

## 7. THE HERO WINDOW CARVE (A6) — ONE PROPERTY, FLAGGED CROSS-LANE

`css/hero-window.css` `.lw`: `background-color:#101830` → the `.linen-hero`
ground stack VERBATIM (seven layers, same hexes; percent geometry scales to
the box). Measured: window centre lum 24.4 → 43.1 against the section's 49.1;
the residual is the window's own certified interior vignette, untouched per
her "nothing else". The shadow stack, graded ring, scrim and type are exactly
as the hero rounds left them. **The hero lanes must see this diff before any
merge** — the file was theirs; Amy's direct instruction opened it for this
property only.

---

## 8. THE INSTRUMENTS — THESE OUTLIVE THE NUCLEUS THEY MEASURED

`scripts/orbital-port-verify.js` (~73 checks, run against the DEPLOYED
preview, never local). Rebuilds made during the rounds, each after the old
instrument produced a confidently wrong number:

1. **Tangential texture measurement, on the texture-only render.** Radial
   second-differences of the full render measure the falloff's own gradient,
   not the mottle; and the old check asserted roughness RISES at the limb —
   the opposite of the eventual ruling. Now: rings at r 0.2/0.55/0.9 on
   `readBody(512, 1)` (flat base). Fineness = zero-crossings per lap;
   contrast = mean |deviation from ring mean|. No falloff in either.
2. **Constellation crowding as POINT DENSITY, not brightness**
   (`readBody(512, 2)`, pixels > threshold per ring area). The points dim
   with the limb law (one light), so a brightness mean confuses dimming with
   absence. Density crowds 1.24x limbward regardless of tune.
3. **Hot-region bearing exclusion in the no-terminator check.** The hot
   region's absolute brightness is fixed, so deeper falloff raises its
   RELATIVE share at the limb and the full-circle min/max ratio drops with no
   terminator existing. Assert on the five bearings away from it (bar 0.80);
   print the full circle. On the tip: hot-excluded 99%, full 85%.
4. **Sphere-map bands are normalized to the DISC, not the canvas** — the
   canvas is EXTENT (1.34) body radii wide and its outer third is bleed;
   normalizing to the canvas edge put the "limb" band outside the body
   entirely (once measured the silhouette at 3% of centre and produced a NaN).
5. **Sky: assert star BOX SIZE and halo count, never star count** (the `--u`
   lesson, §5). Halo bar is the lab's own measured 110, not an invented
   number.
6. **Labels: text-union boxes, never group boxes** (the scrim inflates them);
   the box walk uses each body's OWN amplitude.
7. **Hover verification moves the real mouse BY COORDINATES** —
   `page.hover()` waits for element stability and this figure librates
   forever, by design. Ties in the distance-brightness sort get tolerance
   (equal-radius bodies).

Harness discipline that held all six rounds: poll deploys on the COMMIT REF,
never branch state; prove deployed bytes with a grep of a token you just
introduced; measure before and after every fix; when an instrument and a
manual probe disagree, instrument the page directly before theorizing.

---

## 9. THE NUCLEUS — REJECTED BY AMY (A9). THE REBUILD'S INHERITANCE.

**Status: the entire current implementation is rejected — "reads flat,
removed from the scene." Ground-up rebuild in flight in worktree
`nucleus-rebuild` off this lane's tip. Everything in this section is the
failure record: what was tried, what it measured, and what the verdict was.
The rebuild inherits the record, not just the failure.**

### What is being rejected (the implementation as it stands on the tip)

One raster sphere map (`makeBody`, 512px canvas, EXTENT 1.34R), placed as a
single `<image>`; per-pixel: limb darkening `I = (1-u) + u*mu^p`, granulation
`fbm` sampled at the surface point (compresses via mu for free), additive
hot-region cap at 38%/32%, in-body constellation (240 points on the sphere,
projected), bleed drawn inside the same image past the limb, symmetric
`r^-2.2` corona centred on the body, three breath layers, surface churn (12
rows/frame, monotonic noise axis), node spheres lit toward the body. The NODE
spheres, sky, and system are NOT rejected — the central body's read is.

### The tuning ladder, all rungs rejected

| Round | u | p | variant a (tex/bleed/hot/corona) | Measured | Verdict |
|---|---|---|---|---|---|
| Lab certified (250px body) | 0.86 | 1.5 | 0.16 / 0.80 / 0.34 / 0.86 | limb 34% of centre (lab's own measure) | Amy round-2 walk (A10): "too much light... feels like a flat object still" |
| Round-2 re-tune (145→112px body) | 0.90 | 1.8 | 0.24 / 0.55 / 0.26 / 0.62 | mid band 89%, limb band 47.8% | nucleus-round directive: "still reads flat. A lit disc, not a lit ball" |
| N1 conservative | 0.94 | 2.6 | same | r0.6 79%, r0.9 23% (ring means) | not picked |
| **N2 ruled-target** | **0.96** | **3.2** | same | r0.6 72%, r0.8 33%, r0.9 17%; limb band 25.2% | picked by Amy (A8)... then **REJECTED in the scene (A9)** |
| N3 past-it | 0.975 | 4.0 | same | r0.6 63%, r0.9 14% | not picked |

Also tried in the nucleus round (all three variants, all now rejected with
them): texture contrast taper to 0.32 at the limb with the fine grain fading
harder (`(0.25 + 0.75*mu)`) — measured flat-base amplitude 5.21→2.82 with
zero-crossings 8→36; edge as a 3px smoothstep instead of a 1.4px linear ramp;
bleed floor 0.20→0.08 so no bright fringe sits outside a dark limb.

### The pattern the rebuild must not repeat

Three successive rounds deepened the falloff — limb band 34% → 48% → 25%,
mid band 89% → 72% — and **the "flat" verdict survived every rung.** In
crops, each step read rounder; in the scene, none did. The strong hypothesis
(BUILDER HYPOTHESIS, not a ruling): the falloff curve was never the binding
variable, and more falloff will not fix it. Candidates the ladder never
touched, for the rebuild to weigh:

- **No hue shift.** `ramp()` maps intensity through one colour table; the
  limb dims but never COOLS/reddens. Real luminous bodies shift hue toward
  the limb; a luminance-only gradient can read as a shaded flat disc.
- **The scene, not the sphere.** Amy's verdict was "removed from the scene".
  The corona, breath glows and bleed wrap the body in symmetric haze that may
  flatten apparent curvature regardless of the surface law; the body may also
  simply be too small (112px) for surface cues to carry, where crops (2x,
  260px) kept looking fine. Judge candidates IN THE SECTION at 1966x594,
  never in crops — the crops approved N2; the scene rejected it.
- **The hot region fights the read.** At deep falloffs its fixed brightness
  dominates the limb's relative field (full-circle bearing symmetry fell
  85%↘ as falloff deepened, hot-excluded stayed 99%) — a bright patch near
  the upper-left limb argues against "surface turning away" exactly where
  the eye checks for it.
- **One light law still stands (lab ruling, never contested by Amy):** no
  terminator, no rim light, nothing implying a second source. The rejection
  does not reopen that; it rejects this SURFACE's read.

### Inherited inconsistencies (recorded across rounds, now the rebuild's)

- `applyNucleus()` looks for `.lo-breath-b` inside the corona group; nothing
  carries that class, so the variant's corona-breath pair `[0.82, 1.00]` is
  never applied and the corona keeps `buildCorona`'s hardcoded 0.87→1.00.
  Byte-identical to the lab (diffed); what the lab walked. The 5.3s
  `.lo-breath-b` CSS rule matches nothing.
- Nucleus variants b and c in `NUCLEUS_VARIANTS` still carry the LAB's
  pre-round-2 values; only `a` (the shipped one) was re-tuned.
- `readBody(px, 1)` (texture-only) renders on a flat I=0.62 base — useful,
  it is what makes the tangential instrument falloff-independent.

---

## 10. OWED — NAMED, NOT SILENTLY RESOLVED

1. **The hero-window diff** (§7) needs hero-lane acknowledgment before merge.
2. **Frame cost with 940 animated stars** never measured on Amy's hardware;
   the lab's 30fps ruling was measured at 813. If the section feels heavy,
   the far subset drops from every-8th to every-12th in one character.
3. **Mobile composition** does not exist (list fallback below 768px) —
   inherited from the lab, still open.
4. **Offline label exhaustion for F** not re-run (§4); coverage is the
   in-browser 2,187-corner walk per verify run.
5. **Subject-click content round** (hover option 2) — someday, Amy's to
   author.
6. **Netlify subdomains for deleted branches** may serve stale deploys until
   Netlify cleans them; branch deletion stops future builds but the API does
   not reliably delete branch deploys (attempted at teardown; result in the
   close-out report).
7. **N2's u/p and the taper/edge/bleed dials remain in the tip's code** —
   the rebuild replaces them; nothing else depends on them.

## 11. TEARDOWN RECORD (executed at close; verified in the close-out report)

Deleted: branches `orbital-render-a`, `orbital-render-b`, `orbital-nuc-1`,
`orbital-nuc-2`, `orbital-nuc-3` (local + origin). Their evidentiary content
survives: N1's shared-dials commit is IN the lane history (N2 fast-forwarded
through it); every tried value is tabulated in §9; A/B's comparison is §2/§3.
`orbital-port` (the original branch name, reclaimed by the hero-lane episode)
is not this lane's to touch.

Kept: `orbital-port-lane` (the lane), `docs/orbital-port-closeout.md` (this),
`scripts/orbital-port-verify.js`, `scripts/orbital-k-solve.js`,
`scripts/orbital-fold.js` (instruments), and locally
`screenshots/port/nucleus-three.png` (the three-falloff comparison the
rebuild will want to see) plus `arrangement-f.png` (the ruled composition as
walked). All other local captures deleted; none were committed (screenshots/
is gitignored), so nothing evidentiary left the machine either way.
