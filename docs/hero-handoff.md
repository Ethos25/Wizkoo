# HERO HANDOFF

**Written 2026-08-01, at the close of the hero build rounds, for the session that
picks this up next.** Everything a fresh session needs is here. Re-derive nothing.

The next round is **THE ATMOSPHERE PASS** (light, breath, and the seam). It was
ruled but deliberately not started: it is a full build, not a pass, and every
value in it is sub-perceptual by design, so it needs a fresh session.

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

## 6. THE NEXT ROUND

**THE ATMOSPHERE PASS**, light, breath, and the seam. Ruled, not started.
Three parts, all sub-perceptual by design:

1. **The photograph breathes.** A ~40s loop moving only the *veil's* warmth and
   luminance, never the image: no zoom, no pan, no translation. Warm centre
   drifts 4-6% of frame width, colour temperature shifts no more than 2-3%,
   luminance varies no more than 1.5%. Stills at t=0 and t=20 must look
   identical side by side while thirty seconds of live page feels like a warm
   room.
2. **Light crosses the seam.** Warm spill from photo onto the window's near
   edge; cool starlight from window onto the photograph, 80-120px falloff;
   asymmetric layered shadows agreeing with the light direction; the 1px inner
   border catching marginally more light where it crosses a bright region. The
   light direction must be **read from the image and reported**, not assumed.
3. **The seam dissolves.** The photograph's lower boundary fades into linen over
   100-140px with no discernible line, verified by sampling luminance at 10px
   intervals. If banding appears, break it with a 1-2% dithered noise layer.

Required process: **build each effect at double strength, then reduce until it
disappears from conscious notice.** Report initial and final values for every
effect. Performance law: compositor-friendly properties only, 60fps measured
under idle, under 4KB added. `prefers-reduced-motion` disables the breath (the
photograph renders at the cycle midpoint) and the static light and seam
treatments remain. No contrast ratio in the hero may drop; verify the arrest,
answer, support and the window's sentence at both breath extremes.

Nothing structural changes in that round.
