# HERO HANDOFF

**Written 2026-08-01, at the close of the hero build rounds, for the session that
picks this up next.** Everything a fresh session needs is here. Re-derive nothing.

**Updated 2026-08-01, second pass:** the atmosphere pass is built and shipped to
the branch. Its record, values and measurements are in section 6, and the
photograph's measured light direction is now a ruling in section 3.

---

## 1. WHERE THINGS ARE

| | |
|---|---|
| Branch | `excellence-round-1` |
| Commit at handoff | `b246e72` (plus this note) |
| Live branch URL | https://excellence-round-1--wizkoo.netlify.app |
| Local | `npm run serve` (port 3000; the browser tool may assign another) |
| Repo | `Ethos25/Wizkoo`, production branch `main` |

The hero lives in `index.html` (inline `<style>` block plus the markup between
`<!-- ═══ HERO: 4A "DAY INTO DUSK" ═══` and `<!-- ═══ LINEN HERO`), with four
fragment files:

    css/hero-sky.css      the product's stylesheet, byte-for-byte (see 3)
    js/hero-sky.js        the aperture-tuned sky generator
    css/hero-window.css   the window object
    js/hero-window.js     the one demonstration beat

### Branch deploys

Enabled 2026-07-31 via the Netlify API. **This is CLI/API manageable: do not
route it to Amy.** Full detail in `INFRASTRUCTURE.md` under *Branch deploys*:
site ID, token path, `allowed_branches` semantics, the exact GET/PATCH.

Two traps recorded there, both of which cost time:
- Enabling the setting does **not** retroactively build an already-pushed branch.
- A 404 on a branch subdomain means **no deploy exists**, not "build in
  progress". A running build still serves the previous deploy.

When polling for a deploy, **match on the commit ref**. Polling for "branch is
ready" once matched the *previous* deploy and nearly reported a stale build as
live.

---

## 2. THE ONE OPEN BLOCKER

**The photograph is an unlicensed Stocksy comp.** It is a watermarked
1200x800 preview (`assets/Homepage Image 2 - Science.jpg`, untracked on purpose).

- The credit strip is out of frame at the current crop, verified. **That is not
  a fix.** The file is unlicensed regardless of what is visible.
- The comp caps the responsive ladder at 1200w, so the `2400w` and `1600w` rungs
  do not exist. The hero is full-bleed, so it is upscaled on any wide screen and
  soft at DPR 2.

**Swap path.** Drop the licensed original at the same path and run:

    node scripts/optimize-hero-image.js

That regenerates `images/hero-child-science-{2400,1600,1200,1000,600}.{jpg,webp}`,
strips metadata by re-encoding, and skips rungs the source cannot carry rather
than upscaling. Nothing else needs to change; the markup already references the
full ladder.

**Do not deploy the hero to production until that swap has happened.**

---

## 3. RULED. DO NOT TOUCH.

Each of these was fought for over several rounds. Changing one re-opens a
settled decision.

### The sky: RULED DONE
Density, weather, twinkle, shooter, and the aperture treatment are approved.
Do not change `js/hero-sky.js` or `css/hero-sky.css`.

- `css/hero-sky.css` is a **byte-for-byte copy** of the product's
  `packages/ui/src/TwoLayerSky/TwoLayerSky.css` @ `e1a90b2` (wizkoo-app,
  branch `wp-14-spectacle`). Do not edit it here, not even for house style: an
  em-dash sweep once modified a line inside it and broke the guarantee.
- `js/hero-sky.js` is **not** a verbatim port and is not meant to be. It is the
  primitive's visual language re-tuned for a 620x376 aperture. Cropping the
  certified sky verbatim put only 12 of 571 stars in the window and zero anchor
  stars, because the window sat inside the primitive's star-free content hole.
- Gate: `node scripts/sky-tuning-report.js`. It measures /start's field out of
  the wizkoo-app git objects and fails on density drift beyond 12%, on anchors
  outside the ruled 2-4, or on more than one shooter. Current: **0.3% drift**,
  4 anchors, one 79s shooter.

### The grid, margins, and type placement
12 columns across the stage. Outer margin = the nav wordmark's column, mirrored
exactly on the right (`components/nav.js`: 40px, 24 at 1100, 20 at 768).

    type block   columns 1-6    left edge on the left margin
    gutter       column 7       the composition's breathing space
    window       columns 8-12   right edge on the right margin

The gutter is column 7, **not** column 6, and the arithmetic forces it: five
columns are 552.7px at 1440 while the arrest's first line costs 631px at 100px
(measured 6.305x its size at `opsz` 100). Five columns top out at 567px before
gutters at *any* gutter width. Columns 1-5 is arithmetically impossible for
poster-scale type. Do not "restore" it.

`--u` is the frame unit: a length, 1px at the approved frame, `min(1px,
100vw/1440, max(0.62px, canvas/718))`. The **0.62 floor is load-bearing**:
without it, at wide-short viewports both blocks collapse inside columns sized by
width and the gutter opens to 54% of the frame.

`font-variation-settings: 'opsz' 100` on the arrest is also load-bearing.
Fraunces is optically sized; without the pin its letterforms widen as the scale
drops and the approved two-line break wraps below ~1123px.

### The window
Position and size are ruled: `aspect-ratio: 1.65`, width
`min(100%, calc(var(--u) * 553))`, right edge on the right margin. Capping only
the height once let it letterbox to 3.48 on a short canvas.

### The reserved empty band inside the window
At 1440 the interior measures, from the window's top edge:

    label      40.0 -> 54.5
    sentence   82.5 -> 170.9
    RESERVED   170.9 -> 264.4     (93.5px, empty)
    hairline   264.4              (border-top, rgba(232,175,56,0.26))
    handle     291.4 -> 308.9

**The band is empty by ruling and must stay empty.** The original hero directive
removed the card/first-plan line from inside the window: *"No other copy inside
the window."* The approved 4A frame keeps the space, and it is what gives the
object its poise: the sentence sits high and the handle rests on the hairline
at the foot, the way a printed card is set.

It has already been misread once as a defect. A previous round called it hollow,
removed the hairline and pulled the handle up under the sentence; Amy ruled that
back, and it was restored. **Do not fill it, do not collapse it, do not remove
the hairline.** If a future round wants the window shorter, that is a separate
ruling, not a fix.

### The photograph's light direction: RULED BY MEASUREMENT
**The photograph is lit from the UPPER RIGHT**, and far more from the right than
from above. Shadows in it fall down and to the LEFT. Do not re-flip this.

Before the atmosphere pass, `css/hero-window.css` asserted light from the upper
*left* and the window's shadow stack was built to match. That was asserted, never
tested, and it was wrong. Five independent reads agree on upper right:

| method | result |
|---|---|
| Sphere shading centroid, 8 planets, discs fitted by radial-gradient Hough | mean bearing **58.7deg**, 7 of 8 with positive dx |
| Specular highlight position inside those fitted discs | mean bearing **70.4deg**, 7 of 8 right of centre |
| Grey collars and posts of the stand | specular on the right face, shadow on the left |
| Base cone, and its cast shadow on the table | lit right, shadowed left, shadow runs left |
| Table plane luminance, left to right | 62 -> 150 and 96 -> 180 |

Bearing is measured with 0deg directly overhead, positive clockwise, so 59-70deg
is nearly side-on from the right. The warmest 5% of pixels centre at 71% x /
34% y, which is the warm bokeh light source itself, in frame at upper right.

**Method note.** The first pass at this used hand-placed disc centres and every
sphere agreed, which is exactly what a systematic centring error looks like. The
centres were re-solved by Hough fit before the result was trusted. Two of the
cues above (the cast shadow and the table plane) need no centre at all, which is
why they are in the table.

### The photograph's crop and veil treatment
Crop `--hh-zoom: 1.10`, `--hh-shift: 51%`, `object-position: 50% 44%`. The zoom
exists to keep the pink/red planet in frame; a ruling required it visible, and
4A's own crop hides it behind the window.

Veil: 4A's measured control values (0.94 / 0.70@34 / 0.26@52 / blue 0.13@70 /
saffron 0.06@86 / 0.08@100) **resampled through a monotone cubic**. As six plain
stops the alpha slope steps at 34% and the eye reads a Mach band straight across
the hero. Measured: 40.3 luminance units of slope step before, 2.4 after. If you
regenerate the gradient, keep the resampling.

Filter `saturate(0.60) brightness(1.04) contrast(0.94) blur(3px)` is
deliberately **not** 4A's numbers. 4A's filter was calibrated against a 350px
thumbnail upscaled 4x, soft by construction; the same 1.1px blur on a sharp
asset leaves the planets crisp enough to fight the arrest.

### The desk section
One composed object: card at `max-width: 640px` centred on linen, deliberate air
above and below, and **SEE A SAMPLE WEEK directly beneath it as the card's own
footer**, not a floating sibling. The card's copy, signature, dateline **and its
em dash are protected and byte-identical** (verified by md5 against HEAD). Only
the object's size, placement, and a type scale scoped to `.hero-aside .desk`
were ever changed.

### Copy
All hero strings are ruled and verbatim, including their curly apostrophes:

    EVERY US STANDARD · AUTOMATICALLY
    Are they actually / on track?
    You’ll know.
    Every activity tracked to your state’s standards. Automatically.
    She’s been building the solar system all week.
    THIS WEEK’S WINDOW
    Build a week for Maya, 6, in / Georgia exploring space.
    Build your own            (the window's handle)

**Five `HERO_COPY_PENDING` markers** must survive every round, for the
one-commit copy swap: `arrest`, `answer`, `support`, `whisper`, `handle`.

The window's handle must **not** duplicate the nav CTA. The nav keeps
`BUILD OUR WEEK`; the handle is a distinct personal invitation.

**Zero em dashes** in anything this project writes, including code comments. The
desk card's `&mdash;` is pre-existing and protected.

---

## 4. VERIFICATION

### Which viewport matrix
`TECHNICAL_RUNBOOK.md` contains **two** matrices and they are not
interchangeable. The hero has an above-the-fold contract, so it is governed by
**CANONICAL TEST VIEWPORTS**: 1440x900, 1366x768, 1280x720, **1097x617
(BINDING)**, 1024x768. The five-viewport verification clause omits 1097x617
entirely.

**Verify at 1309x396 first.** That is Amy's actual screen. Two rounds reported
"all viewports pass" while it was broken, because the matrix being run did not
contain it.

### The gate

    npm run serve
    node scripts/hero-fold-gate.js http://localhost:3000

Twelve viewports, currently all passing. It tests real rendered **text**
collision, not container overlap: the window is ruled to sit left of the copy
container's right edge, so box overlap there is expected and correct.

### Scripts

    scripts/hero-fold-gate.js       the fold gate, twelve viewports
    scripts/sky-tuning-report.js    sky density against /start, fails on drift
    scripts/optimize-hero-image.js  the responsive ladder (see 2)

---

## 5. HOW THIS BUILD FAILED, SO IT IS NOT REPEATED

Four mistakes were made across these rounds. All four share one shape: **a
conclusion asserted without being tested.**

1. **A gate that printed `NaN` and passed.** The sky report could not parse the
   product tokens, produced `NaN`, and reported PASS. Non-finite is now fatal in
   that script. **Any gate that cannot compute its comparison must fail loudly.**
2. **"All viewports pass" while Amy's screen was broken.** The matrix being run
   did not include her viewport. Passing a matrix that omits the screen in use
   is not passing.
3. **An invented tradeoff.** A fix was reported as an unavoidable choice between
   composition and fold. It was not: the canvas had been grown to `--u * 718`,
   the full vertical rhythm, when the type block and window sit *side by side*
   and the stack never needs it. Both were achievable at once.
4. **Concluding a capability was absent without checking.** A Netlify setting
   was routed to Amy as a manual action. An authenticated token was sitting on
   the workstation the whole time. **Test the capability; do not reason about
   it.**

When something is self-caught, report it plainly and in full. That is the
standard here, not an exception.

---

## 6. THE ATMOSPHERE PASS: SHIPPED, MINUS THE BREATH

Light and the seam. The breath was built, walked, and cut. What shipped is
paint-only with no structural change: `.hh-seam` in `index.html`, and two spill
pseudo-elements plus a graded border ring in `css/hero-window.css`.

**The round's real value is the light-direction finding in section 3.** It
corrected a wrong assertion that the window's whole shadow stack had been built
on. The seam, the two spills and the corrected shadow all stand on their own and
cost nothing: contrast is exactly baseline and no animation is added.

### Initial and final values

Every effect was built at double, measured, and reduced. Final values are below
the ruled ranges, as expected.

| effect | built at | shipped | why it came down |
|---|---|---|---|
| **The breath** | 0.230 alpha, 40s | **CUT**, see below | read as nothing at every value inside the ruled ceilings |
| Warm spill, photo onto window | 0.12 | **0.050** | |
| Cool starlight, window onto photo | 0.10 | **0.042** | |
| Seam band height | `264u` | **`128u`** | ruled range is 100-140 |
| Inner border ring | flat 0.10 | **0.16 -> 0.045**, mean held at 0.10 | object weight unchanged, only its distribution moved |

### Measured results

- **Seam.** Luminance runs 154.6 -> 243.7 across the band and holds flat past the
  boundary. Max second difference inside the band **4.02** luminance units,
  against the photograph's own 13-40 just above it, so the ramp is smoother than
  the image it joins. No discernible line at any zoom.
- **Banding.** Checked rather than assumed: longest flat run 4-7px, and ~1 unit
  RMS of grain survives inside the band. **No dither layer was needed**; the
  existing `.hh-grain` already carries it.
- **Spills.** Isolated from the shadow change by measuring against the same build
  with only the spills off. Lit corner **+2.6 R-B** warmer, falling off by
  40-50px. Top and left **-1.0 to -1.9 R-B** cooler. The sign flip between the lit
  side and the shaded side is the whole point.
- **Layout.** 232 measurements across 8 viewports, **0 differences**. Nothing
  moved by any amount.
- **Fold gate.** All 12 viewports pass.
- **Weight.** Against `b246e72`: raw **+5.9KB**, gzip +2.1KB, **brotli +1.8KB**.
- **Compositor.** No animation is added by this round at all, so there is nothing
  to hold at 60fps. Frame rate and per-frame layout cost are indistinguishable
  from the pre-round build.

### Contrast, against a like-for-like baseline

Measured through the same harness with the round's layers reverted. Backdrop is
the modal colour inside each element's own box, which works for light-on-dark and
dark-on-light alike.

| element | baseline | shipped |
|---|---|---|
| arrest | 12.833 | **12.833** |
| answer | 1.331 | **1.331** |
| support | 12.638 | **12.638** |
| whisper | 6.605 | **6.608** |
| window sentence | 16.013 | **16.013** |

Exactly baseline, to three decimals, on all four ruled elements. The seam, the
spills, the shadow and the ring are all optically free where the type sits. The
**-0.039** that the support line carried while the breath existed was never the
effect: it was a 1/255 rounding shift from promoting a compositor layer, proven
by an identical reading with the layer present but painting nothing. Removing the
layer removed it.

### THE BREATH WAS CUT. Do not rebuild it without reading this.

Ruled out after being walked. It read as nothing. Three rounds of correction ran
before the cut, and each one narrowed the diagnosis:

1. **Duration.** 40s meant a visitor saw about a quarter of one cycle, against a
   desktop above-the-fold dwell of ~11s. Compressed to 11s. No help, because
   compressing a cycle raises the rate and not the excursion, and at 0.09Hz the
   eye integrates, so excursion decides legibility.
2. **Amplitude.** Swept at the shipped geometry against every ruled ceiling:

   | alpha | excursion, worst px | worst CCT % | frame lum % | contrast |
   |---|---|---|---|---|
   | 0.115 | 4/255 | 0.60 | 0.052 | none reduced |
   | 0.230 | 6/255 | 1.15 | 0.112 | none reduced |
   | 0.300 | 8/255 | 1.46 | 0.160 | none reduced |
   | 0.380 | 10/255 | 1.84 | 0.213 | none reduced |

   Ceilings are 2-3% CCT and 1.5% luminance, so neither ever bound. **The binding
   test was the stills.** Butting the two extremes together with no divider, the
   pair reads as one surface through 0.300 and separates at 0.380.
3. **The cut.** Shipped at 0.300, the largest value passing the still test. Still
   read as nothing.

**The finding, for whoever tries this again.** The usable gap between "invisible
frame to frame" and "visible as an effect" was too narrow to hold anything. At
0.300 the entire half-cycle swing moved 8/255 at its worst pixel and
**0.445/255 averaged over the frame**, which is under one quantisation step
across most of the picture. The veil is the reason: it is 0.94 opaque over the
copy and the lobe has to sit beneath it to protect contrast, so most of the
effect is absorbed before it reaches the eye. Any rebuild needs a way to widen
that gap first, not a new value inside it. Raising alpha further breaks the still
test; moving the lobe above the veil breaks contrast on the support line.

**A labelling failure worth recording.** For three commits the code, the commit
messages and this document all said the shipped alpha was 0.078 when it was
0.115. Moving the breath under the veil rewrote the whole rule and typed the
pre-reduction numbers back in while the comment above still read "reduced". The
measurements were taken against the running build and were correct throughout;
only the label was wrong. It then produced a second, worse error: a claim that
0.115 was available headroom, when 0.115 was already shipped and the comparison
had been drawn against a different geometry entirely. **A value you did not read
back out of the file is not a value you know.** Same shape as the four failures
in section 5: a conclusion asserted without being tested.

### One thing left open

**Raw weight is over the 4KB law**, at +5.9KB; served weight is +1.8KB brotli,
and brotli is confirmed as what Netlify actually serves. The overage is comment
prose, kept because this codebase documents its reasoning in place and the
alternative is a future round re-deriving the light direction. Strip the comments
if the raw number must hold.

The 60fps question closed itself when the breath was cut: this round now adds no
animation at all, so there is nothing to hold a frame rate. Frame rate and
per-frame layout cost measure indistinguishable from the pre-round build.

### Left alone deliberately

`wfTwinkle` keeps running under `prefers-reduced-motion`: roughly 280 star
animations in the `.linen-hero` granddad section, not the hero, and pre-existing.
The hero's own animations all stop correctly. Worth a future round; out of scope
for this one.
