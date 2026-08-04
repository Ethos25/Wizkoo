# Orbital section — certified state, and the port handoff

This is the complete certified state of `/lab/orbital.html` as ruled through six
rounds. It is written so a port session can rebuild the section inside the
homepage's "Granddad broke his foot" block **without re-deriving anything**.

Everything here has been ruled. Where a number looks arbitrary it is not, and the
reason is given — the reasons are the expensive part.

Lab: `orbital-lab--wizkoo.netlify.app` · certified commit in `docs/orbital-lab.md`
Source: `lab/orbital.html`, `css/lab-orbital.css`, `js/lab-orbital.js`,
`js/lab-orbital-sky.js`. The lab panel and the scroll runway are chrome and are
deleted at port time; nothing else in those files is.

---

## 0. THE THREE THINGS THAT WILL BE GOT WRONG

Read these before anything else. Each one was found the expensive way.

**1. The shipped homepage geometry is REJECTED and must not survive the port.**
`index.html` currently carries `ry 178 / 160 / 135` against a nucleus radius of
42, in a viewBox 1011 units wide. That geometry is not to be reused, reintroduced
or interpolated toward. It is rejected on two counts: its nucleus is less than
half the certified ratio, and its orbits are three near-identical ellipses at
clustered rotations. If a port finds itself keeping the existing `<ellipse>`
elements and restyling them, it has already failed.

**2. The certified arrangement declines the occlusion cue, deliberately.**
Rounds 1 to 5 built the section around orbits that cross the body. Round 6 ruled
that the system, not the star, is the subject — and openness is what makes three
rings read as a cage. The two cannot both be had (§2). A port must not "fix" the
missing cue by flattening the rings back, and must not assume the cue is present.

**3. Frame cost is measured against the previous build in the same process, never
against a number.** This box measured the same commit at 33ms and at 50ms hours
apart with nothing changed but its load. `scripts/lab-orbital-r2.js` re-measures
the prior commit alongside every run. Keep that.

---

## 1. GEOMETRY — certified

Frame `0 0 1440 984`, `preserveAspectRatio="xMidYMid meet"`, centre `(720, 472)`.
At a 1440-wide viewport one SVG unit is one CSS pixel, which is why the labels
can be the homepage's literal 14px/12px rather than a scaled guess.

```
nucleus radius R = 125

orbit    rx    ry    rot    O = ry/rx    E = rx/R    O*E     nearest   farthest
  c     480   275     25      0.573        3.84      2.20      275       480
  a     434   248    148      0.571        3.47      1.98      248       434
  b     372   209    172      0.562        2.98      1.67      209       372

crossing angles    25 / 148 / 172 degrees
nucleus / envelope 0.260   (R 125 against the largest rx 480)
```

**Nucleus-to-envelope ratio 0.260.** The shipped section's is 0.135 — C carries
nearly twice the nucleus at the same openness. Candidates that pushed the ratio
to 0.46 and 0.51 were rejected on the walk: the star swallowed the composition
and inverted the hierarchy.

**OCCLUSION ASSERTION: FAIL, and that is the ruling.** No orbit comes inside the
body: minor semi-axes 275 / 248 / 209 against R 125. `scripts/lab-orbital-r2.js`
states this and passes, because the arrangement declares `occlusion: false` and
the geometry agrees with what it declares. A check that cannot fail is not a
check — so it verifies intent, not taste.

### The minor-semi-axis law, and its failing assertion

Recorded because it is true and will be needed again, not because this build
obeys it.

> **An orbit's arc crosses the nucleus if and only if its minor semi-axis is
> smaller than the nucleus radius.** Below that, the near half passes in front of
> the body and the far half behind it, and paint order makes the system read as
> three-dimensional. At or above it, nothing ever crosses anything and the depth
> cue is simply absent — with no error, and no way to see that it was ever meant
> to be there.

And the inequality that makes it a trade rather than a setting:

```
    ry < R   <=>   O * rx < R   <=>   O * E < 1
```

Openness `O` is what makes a ring read as a circle seen at an angle rather than
as a stroke; envelope `E` is how far the orbits reach relative to the nucleus.
They are one budget. The certified arrangement spends it on openness — `O*E` of
2.20 / 1.98 / 1.67, all above 1.

Two ways to buy the cue back, if a later round wants it:

- **Shrink the envelope or grow the nucleus.** Both rejected on the walk for
  inverting the hierarchy. `E` must fall to about 1.75 before `O` of 0.57 fits.
- **Put the nucleus at the orbit's FOCUS rather than its centre**, which is where
  a star sits on any orbit that is not a perfect circle. Nearest approach becomes
  `|ry − offset|`, so openness and crossing stop being alternatives. Built and
  measured as arrangement D: openness 0.50 with nearest approaches of 90 / 85 /
  78 against R 125, occlusion PASS. Not ruled. Kept in the code.

The assertion lives in `scripts/lab-orbital-r2.js` and in
`scripts/lab-orbital-arrangement.js`. Keep both alive through the port.

### The seven subjects

Copy is the homepage's, verbatim. Positions are the orbital parameter `t`.

```
  reading  orbit b  t 188      writing  orbit a  t 350      math   orbit b  t 8
  science  orbit a  solved     geo      orbit a  t 170      art    orbit b  solved
  history  orbit c  t 195
```

`science` and `art` are **solved at mount**, not written down: the code scans
±45° around their composed position for the parameter that puts them nearest the
nucleus radius. Under an arrangement that crosses the body they land straddling
the limb, one in front and one behind. Under C they land at the closest approach
their orbit allows — 260 and 217 units. The scan is deliberately narrow: every
orbit has two solutions and the far one silently re-composes the frame.

HISTORY is on orbit c, which carried no subject before round 3 — a third of the
system's structure with nothing to explain it.

---

## 2. THE LIGHT MODEL — certified, and not to be touched

Ruled good at round 5 and unchanged since. The nucleus is **self-luminous and is
the only light in the frame**. Nothing anywhere may imply another one.

### The body

One raster sphere map, rendered to a canvas and placed as a single `<image>`.
**No SVG filters remain on the nucleus at all**, and the verification asserts
zero `feDistantLight` / `fePointLight` / `feSpotLight` /
`feDiffuseLighting` / `feSpecularLighting` anywhere in the frame.

Per pixel inside the disc:

```
mu  = sqrt(1 - r^2)                       the surface normal's z
I   = (1 - u) + u * mu^p                  limb darkening, u = 0.86, p = 1.5
I  *= 1 + tex * fbm4(nx, ny, mu, w)       granulation, sampled AT THE SURFACE
I  += hot * cap(n . h)^3                  the hot region, a cap on the sphere
I  += stars[x, y]                         the in-body constellation
```

- **Limb darkening carries the whole job of saying "sphere"**, because there is
  no terminator. `u = 0.86` and `mu^1.5` are deliberate departures from physics:
  the real profile (`u ≈ 0.6`, `p = 1`) puts almost all its drop in the final one
  or two percent of the radius, which is right for a photograph of the Sun and
  useless on a body 250px across. Measured: the silhouette sits at **34% of centre
  luminance**, and the weakest bearing darkens **84% as much as the strongest** —
  every edge, not one. It cannot read as shadow because it is identical in every
  direction.
- **No terminator and no rim pass.** Both deleted at round 2. A terminator says a
  lamp is over there; a rim light says something is behind. Either one puts a
  second source in the frame.
- **Granulation is sampled at `(nx, ny, mu)`**, the surface point, not at screen
  `(x, y)`. Near the limb `mu` changes fast for a small step in screen position,
  so the pattern runs through many periods in few pixels — the compression is
  exact and free. Measured **1.87× finer at the edge than at the centre, and
  monotonic**. Uniform texture on a curved body is the flat-sphere tell.
- **The hot region, upper left at 38% 32%**, is a cap on the sphere and is
  **purely additive** — it can brighten the surface and can never shade it, and
  the disc is complete without it. It foreshortens near the limb like anything
  else on a surface. 38% 32% is not invented: it is the value the product already
  carries on this page in `.hero-cta-circle`.
- **The in-body constellation**: 240 points placed as random unit vectors on the
  sphere, kept when they face the viewer, then projected. A uniform density on a
  sphere projects to a density rising as `1/mu` toward the limb, so they crowd at
  the edge exactly, with nothing in the code asking for it. They dim with the same
  limb law and step aside under the hot region. Measured **1.65× denser at the
  limb, monotonic, peak band mean 2.4 of 255** — a whisper. At a glance the
  sphere is a star; at a stare, there is something inside it.

### The bleed and the corona

- **The bleed past the limb is drawn inside the body's own image**, gone within a
  third of a radius, and **coloured from the limb it leaves** so it is continuous
  with the surface rather than a bright line along the edge. A glow drawn inside
  the body's own picture cannot read as an object standing beside it.
- **The outer corona is centred on the BODY**, radially symmetric, monotonically
  decreasing from the limb on `r^-2.2`, times a window that reaches zero **with
  zero slope** at the gradient's edge. Its stops are spaced **logarithmically in
  radius** — evenly spaced stops put a measurable kink at `r/R 1.34`, because a
  gradient interpolates linearly and this profile is far steeper just outside the
  limb than anywhere else.

  Measured against the same build with the corona removed: **+29.6 luminance at
  the limb**, above a point at four body radii, monotonic throughout. The largest
  rise in the falloff rate anywhere is 1.10 units; the same statistic with **no
  corona present** is 1.06 — the wiggle is the instrument, not an edge. Beyond
  the near bleed the worst lopsidedness is 1.9 (an earlier hot-region-centred
  version measured 9.6, and read as a pale halo off the shoulder).

  **Anything centred anywhere but the body will eventually read as a second
  object.** That is what an offset at several body radii becomes.

### The nodes

Each node is a **rendered sphere**, not a gradient. A gradient offset toward the
nucleus is a lit disc, which is the same mistake at a smaller scale.

- Lambertian, lit from the side, with a limb term that takes every edge down
  **including the lit one**, so the bright side does not become a rim.
- **One canvas serves all seven.** A sphere lit from a direction in the plane of
  the sky is symmetric about that direction, so the same image *rotated* to point
  at the nucleus is exact for any bearing — no per-frame re-render, and the light
  visibly swings as a body librates.
- **The terminator wraps** rather than cutting: the star subtends a wide angle
  from a node, so light carries past the geometric terminator. A hard edge down
  the middle of a small sphere is a cut-out, and it is also wrong.
- **Brightness falls with distance from the nucleus**, and the distance used is
  the SCREEN separation, not the true three-dimensional one. On a circular orbit
  a node is always the same distance from the star, so true distance would give
  every node on an orbit the same brightness and the falloff — which is the
  demonstration — would never be visible.

  ```
  I = clamp(210 / max(dist, 60), 0.42, 1.8)
  ramp input = 0.44 + 0.58 * I^0.6
  re-render step 0.004 of intensity   (under one part in 255 of the rendered value)
  ```

  The ceiling is 1.8 and not 1.0 because at 1.0 any node inside 210 units is
  pinned at full brightness for its whole excursion. The step is 0.004 and not
  0.02 because at 0.02 the change arrives as four visible jumps rather than a
  slide.

**This is the demonstration that settles the light.** Once light is visibly
travelling outward from the middle of the frame, nobody asks where it comes from.
The verification measures the dot product between each node's lit point and the
direction of the nucleus and requires `+1.000` on all seven.

---

## 3. MOTION

### Libration, not revolution

Each body **librates** about its composed position rather than revolving.
Libration is real orbital behaviour — the Moon and the Trojan asteroids do it —
and it is here because revolution and the label guarantee cannot both hold:
under revolution any two nodes eventually meet on screen, both near the body,
both at near-full presence, where depth-linked opacity cannot separate them.

```
components        307 / 491 / 787 seconds, all prime, spread per node by k_i
amplitude         K / |dP/dtheta| * k_i,  K = 3000
                  under C: 13 / 11 / 14 / 7 / 12 / 9 / 11 degrees
peak screen speed 0.85 px/s, identical on every body
averaged          about 16px in thirty seconds
```

- **Amplitude is per body**, set inversely to `|dP/dtheta|` at its own position.
  On an ellipse that factor runs from `ry` to `rx`, so one uniform angle makes a
  body at its turning point crawl while a body crossing the face flies. Setting
  it inversely gives every body the same peak screen speed, which is what a
  viewer actually reads.
- **Bodies are decorrelated by PERIOD, not by phase.** Node *i* runs the
  components at `k_i` times their base periods and carries `k_i` on its
  amplitude to compensate. Every sine starts at zero, so `librate(node, 0)` is
  **exactly** the composed position — which matters, because that is what the
  arrival lands on and what "static" shows. An earlier version used time offsets
  and the system jumped the moment it started.
- **0.85 px/s is on the perceptual boundary by construction.** Catching motion
  against a static reference takes roughly 1 to 2 arcmin per second, about 0.7 to
  1.3 px/s at a normal viewing distance; registering a change after half a minute
  away needs tens of pixels. Those two requirements meet here and nowhere
  roomier. The rate is sinusoidal, so a body is near peak only briefly.

**Amplitude ceiling at C: `K = 4000`.** The build sits at `K = 3000`, a third
under it — C's rounder orbits have larger `|dP/dtheta|`, so the same `K` buys
smaller angles and more headroom than round 5 had. **Nothing was reduced to fit.**

### The surface churns

The body is a raster, so evolving it means re-rendering it, and a full
512-square render is a fifth of a second. The render is **resumable**: 12 rows a
frame into an offscreen canvas, then a five-second cross-fade over the one
before it. The noise's fourth axis only ever goes forward, so nothing repeats.
PNG encoding uses `toBlob`, not `toDataURL`, so it is not on the frame either.

12 rows and not 40 — an earlier setting spent the whole frame budget on it.

### The corona breathes with the body

The corona rides the **body's own breath keyframe**, not its own rhythm, at an
amplitude under the body's. The glow follows; it does not lead.

The body's breath itself is **not periodic**: three glow layers at 3.7s, 5.3s and
8.9s, mutually prime, so the summed luminosity has amplitude inside any 3–5
second window and no beat a viewer can catch repeating.

---

## 4. LABELS

**Presence tracks orbital depth continuously.** Written every frame from the
model, never triggered by anything:

```
u        = 0.5 + 0.5 * sin(t)
opacity  = 0.35 + 0.65 * u^0.85
scale    = 0.93 + 0.07 * u
```

Three nested groups keep it honest — depth opacity on the outer, the arrival's
animation on the middle, the arrival's translate on the inner. They multiply.
Writing depth onto the element the arrival animates would simply lose: an
animation out-ranks an inline style.

- **Radial placement**: a label sits outward from its own node, on the far side
  from the centre, with a floor of `max(dist + 54, R + 80, 252)`. The 252 is not
  decorative — a smaller floor pulls every label inward and reopens collisions
  the exhaustion had already closed.
- **A soft radial scrim** sits behind every label, in the night's own hue, always
  on. Invisible on open sky; decisive over an orbit line or a bright star.
- **A tether** whose length falls to zero on its own when a label sits on its
  node. No state, nothing toggles.

**NO REACTIVE COLLISION LOGIC, ever.** A fade triggered by a detected overlap is
a visible pop, and a pop reads as UI in a frame that has to read as physics. This
is why the motion is libration and not revolution: the geometry was changed so
the collision does not arise, rather than handled after it does.

### The guarantee, and how it is verified

The bar is **not** "labels never overlap". It is: *wherever two labels touch, the
dimmer has already receded to background* — 0.45 or under on the 0.35-to-1.0
presence range.

Verified by exhausting the excursion box: every node walked to the corners of
**its own** libration amplitude, independently, on a grid. Under C: **no two
labels overlap anywhere the system can reach.**

Two bugs to not reintroduce, both found in the verification itself:

- It walked a **fixed ±16°** box from round 2 to round 6. That was right while
  amplitude was uniform and quietly wrong from round 5, when amplitude became
  per-body and reached 28.6°. It must walk each body's own amplitude.
- It checked **"no overlap at all"** rather than the ruled bar, which reports a
  failure where the mechanism is working as designed.

---

## 5. THE ARRIVAL BEAT

Fires **once**, on `IntersectionObserver` at threshold **0.4**, then **latches**
— the observer is disconnected on fire, so it cannot re-run. Total **2.5s**.

```
node 1 ignites   0.10s        paths begin      1.24s
node stagger     0.165s       orbit stagger    0.11s
node duration    0.42s        half-orbit draw  0.51s
label lag        0.10s        complete         2.48s
```

- **The nucleus is not animated in.** It is the given: the one obsession is
  already there when you arrive, and the subjects come to it. Animating it in
  would make the centre an event rather than a premise.
- **Members before structure** — nodes, then paths. Drawing the paths first would
  state the system before its subjects, which is the difference between an object
  and a diagram.
- Nodes ignite in a **clockwise sweep starting at twelve o'clock**. Not reading
  order and not depth order: a sweep circles the nucleus, which restates the
  thesis while it plays. HISTORY sits at the apex and opens the beat.
- **Each orbit draws as one continuous stroke** handed from segment to segment,
  the far half first and the near half picking it up on the other side.
- Easing is the product's own `cubic-bezier(.16,1,.3,1)` for nodes and labels;
  paths use a gentler `cubic-bezier(.22,.68,.18,1)` so the stroke settles rather
  than snaps.

### The casino latch

Nothing may loop in a way a viewer can catch repeating. After the beat, the only
things that move are: the nucleus breath (three mutually prime periods), the
certified star twinkle, the rare shooter, the libration (three prime periods,
per-body `k_i`), and the surface churn (a monotonically advancing axis). None of
them has a period anyone will sit through.

---

## 6. RING TREATMENT

**One treatment for all three. Depth is carried in opacity alone, and nothing is
styled.**

```
stroke           rgba(226,234,248,1)      one colour
width            1.1 * (0.86 + 0.28 * u)  one weight, modulated
opacity          0.26 * (0.34 + 0.66 * u)
where u          = 0.5 + 0.5 * z / Z_MAX
and  z           = sin(t) * sqrt(rx^2 - ry^2)
```

The depth that matters is **z**, not `sin(t)`. A flatter orbit swings further
toward and away from the eye, so its near arc comes closest and reads brightest
and marginally heaviest, while an orbit lying more open never reaches either
extreme. One formula, three results — the rings look different because they are
in different places, which is the only reason anything here may look different
from anything else.

Opacity is **continuous along each arc**: each orbit is cut into 15° segments
taking their value from the depth at their own midpoint. Two flat halves meet at
the major-axis extremes and a step there is a seam exactly where the eye is
tracking the line.

**No dashed orbit.** A dash pattern and a dash-offset draw are the same property,
and the draw is the beat.

**The silhouette layer** — near arcs drawn dark where they cross the disc,
because a thin ring in front of a star silhouettes against it rather than being
brighter than it — is still in the code and renders nothing under C, since no arc
crosses. Leave it: it is three lines and it is what makes the cue work the moment
an arrangement wants it back.

---

## 7. THE SKY

The certified `TwoLayerSky` primitive, driven at a re-derived FIELD.
`css/hero-sky.css` is **untouched** — byte-for-byte the product's own. Only
counts move, and they move because the area moved.

```
aperture           1440 x 996   (the linen-hero band at a 900px viewport)
/start reference   1.278 stars per 1000px^2 of starred field
this aperture      1,834 stars  ->  1.279     drift 0.1%
anchors            12, ruled by eye rather than scaled by area
```

Anchors do not scale with area: 4 in the hero window scales to 25, and
twenty-five haloed stars would compete with the gold nodes for the same reading.
The 13 that were cut go back into mids so the density still lands on the
product's number.

### The far-layer static ruling

**The far layer keeps its stars and loses its twinkle.**

```
1,834 stars rendered   813 twinkling   (the near layer plus filigree)
```

Eight lines of CSS scoped to `.lab-orbital__sky .wk-sky__layer--far .wk-sky__star`
— specificity 0,3,0 against the primitive's 0,1,0, so it wins without
`!important` and without touching the certified stylesheet. The stars do not go
blank: each keeps the inline mid-brightness the generator wrote for it, which is
the exact value the primitive's own reduced-motion frozen frame uses.

The reason: 1,021 faints and dust whose twinkle swings inside a band the eye
cannot resolve, costing more frame time than everything else on the page
combined. Effort spent below perception is cost, not craft. The measurement that
settled it — the lab at full density ran 15fps; with the far layer static, the
same 30fps the section already shipped at.

---

## 8. REDUCED MOTION

The completed state, rendered. No arrival, no libration, no churn. Depth-linked
label presence **still applies**, because it is distance, not motion.

Verified: **0 running animations**, and frames at +0.9s and +5.9s are
**byte-identical**. The certified sky's own designed frozen frame does the rest.

Honoured both from the media query and from `[data-wk-motion='reduced']` on the
root, which is the harness the product already uses.

---

## 9. WHAT THE PORT MUST DO

1. Replace the existing `<svg id="hz2-orbital-svg">` contents in the
   `.linen-hero` section entirely. **Do not restyle the existing ellipses.**
2. Mount the sky as the section's full-bleed ground, behind the system, at the
   FIELD in `js/lab-orbital-sky.js`. Keep `css/hero-sky.css` untouched.
3. Carry `js/lab-orbital.js` across whole, minus the lab panel handler and the
   arrangement switcher. Set the arrangement to **C** and drop the others, or
   keep them behind a constant — but ship C.
4. The section is below the fold on the homepage already, so the
   `IntersectionObserver` at 0.4 is a real arrival. Keep the latch.
5. Delete: `.lab-runway`, `.lab-panel`, the `?arr=` switch, and the drift-speed
   accelerator. Everything else in `css/lab-orbital.css` ships.
6. Re-run `scripts/lab-orbital-r2.js` against the ported page. Every check should
   pass, including the occlusion check reporting that this arrangement declines
   the cue and the geometry agrees.
7. Re-run `scripts/lab-orbital-sky-report.js`. Density drift must stay inside 12%
   of the product's own; it currently sits at 0.1%.
8. Frame cost: measure the ported page against the pre-port page in one process.

### Verification scripts to carry across

```
scripts/lab-orbital-r2.js             light model, labels, libration, reduced motion, paired frame cost
scripts/lab-orbital-sky-report.js     sky density drift against the product's own tokens
scripts/lab-orbital-corona.js         the corona's radial profile, measured off rendered pixels
scripts/lab-orbital-arrangement.js    the geometry diagnosis and the occlusion assertion
scripts/lab-orbital-label-solve.js    the label placement proof, offline
scripts/lab-orbital-drift-solve.js    the amplitude ceiling against the label guarantee
```

---

## 10. WHAT IS STILL OPEN

- **The occlusion cue is not in the certified build.** Arrangement D shows it can
  be had at C's openness by putting the nucleus at the orbit's focus. Built,
  measured, not ruled.
- **The frame cost sits at the 30fps step**, matching what the section already
  ships at. Getting to 60 means touching the near layer's twinkle, which the
  far-layer ruling deliberately reserved.
- **The lab is 1440-first.** Amy's production viewport is 1440×396; the section
  floors at `max(100dvh + 96px, 760px)` so the system never scales below
  legibility, and the page scrolls instead. Mobile has not been composed.
