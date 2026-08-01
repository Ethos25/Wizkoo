# Orbital Lab — handoff

`/lab/orbital.html`. Standalone, `noindex`, linked from nowhere. Nothing outside
this route was touched: `git diff --stat` against the branch point is empty, and
`index.html`, `css/hero-sky.css`, `js/hero-sky.js` are byte-identical to HEAD.

Branch `excellence-round-1`.

---

## PORT CONSTRAINT — read this before moving anything into the homepage

**Every orbit's minor semi-axis must be smaller than the nucleus radius.**

That is the whole three-dimensional read. An orbit whose `ry` is not smaller than
the nucleus radius never crosses the body; its arcs pass outside the disc, the
front and back halves become indistinguishable, and the section degrades from an
object into a flat diagram. Nothing errors. Nothing looks broken. The cue is just
gone, and it is very hard to see that it was ever there.

```
this lab      nucleus radius 125    orbits ry 115 / 101 / 82     all cross
homepage      nucleus radius  42    orbits ry 178 / 160 / 135    none cross
```

The homepage's current diagram fails the rule three times over. That is exactly
how it lost the cue, and it is why the orbits here are far flatter than the ones
it carries today. **A port that keeps the homepage's ellipse geometry throws away
the entire round.** The geometry has to travel with the material.

Two further conditions, same category:

- **At least one node must straddle each limb**, at the parameter where
  `|P − C|` equals the nucleus radius — one in front, one behind. Here that is
  SCIENCE and ART. Without them the occlusion is true but never demonstrated.
- **Front arcs must silhouette dark where they cross the body.** Saffron on
  saffron vanishes, and a vanishing arc reads as *behind* — the opposite of the
  truth.

Round 2 adds three more of the same kind:

- **Nothing in the frame may imply a light source other than the nucleus.** No
  terminator, no rim light, no directional lighting filter, and no corona centred
  on the body. The nodes must be lit *by* the nucleus — bright side facing in.
- **Label presence must track orbital depth continuously and never react.** A
  fade triggered by a detected overlap is a visible pop, and a pop reads as UI.
- **The motion is libration, not revolution, and that is load-bearing.** Section
  4 proves why: under revolution, readable labels and no-reactive-logic cannot
  both hold in a frame this size.

All six are asserted, not remembered. `node scripts/lab-orbital-shots.js <url>`
covers the occlusion three; `node scripts/lab-orbital-r2.js <url>` covers the
light and label three. Both exit non-zero on failure. Keep them alive through the
port.

---

Everything below is a lab result. Rulings are marked **RULED**.

**Round 2 (second walk)** replaced the light model, moved orbits from static
to drift, and rebuilt label behaviour. One thing in it is a deviation from what
was asked, and it is flagged as such in section 4.

**Round 3 (third walk)** found the nucleus still reading flat and the corona
still reading detached, and the drift too slow to register. The body is now one
raster sphere map rather than a stack of gradients and filters, and the
libration is per-node. Sections 2 and 4.

**Round 4 (correction)** put the outer glow back — round 3 had overcorrected and
left the star pasted onto the sky — and gave the nodes and the orbit lines the
same treatment the body got. Section 2a.

**Round 5** made the system the mark: three real orbital planes instead of
near-parallel rings, a constellation inside the body, and three more places
where the light does work. Section 2b.

---

## Files

| file | what it is |
| --- | --- |
| `lab/orbital.html` | the route, plus the lab panel and the scroll runway that puts the section below the fold |
| `css/lab-orbital.css` | the system's stylesheet, and the lab chrome (chrome is deleted at port time) |
| `js/lab-orbital.js` | geometry, material, the arrival beat, the drift variant, the panel |
| `js/lab-orbital-sky.js` | the certified sky's FIELD re-derived for this aperture — no second generator |
| `scripts/lab-orbital-sky-report.js` | the density drift measurement |
| `scripts/lab-orbital-shots.js` | round-1 evidence stills and the occlusion assertion |
| `scripts/lab-orbital-r2.js` | round-2 assertions: one light, nodes lit outward, the whole label excursion |
| `scripts/lab-orbital-label-solve.js` | the label placement proof, offline |
| `scripts/lab-orbital-record.js` | the 60-second recording |

---

## 1. The sky

Not a second sky. `js/hero-sky.js` — the certified generator — driven at a
different FIELD, exactly as the hero window re-tuned it for its own aperture.
`css/hero-sky.css` is untouched, so twinkle, nebula breath, the shooter and the
designed reduced-motion frozen frame are still the product's own. The report
asserts the swap does not leak: the hero window's star count is re-measured after
the lab build and must be unchanged.

Aperture 1440 × 996 (the linen-hero band at a 900px viewport), 1,434,240px²,
6.15× the hero window.

```
/start reference density   1.278 stars per 1000px² of starred field
orbital aperture           1,834 stars  ->  1.279
drift                      0.1%   (tolerance 12%)
```

Anchors were ruled rather than scaled: 4 in the hero window scales to 25, and
twenty-five haloed stars would compete with the gold nodes for the same reading.
Held at 12; the 13 stars that cut go back into mids so the density still lands on
the product's number.

## 2. The nucleus — **RULED round 2: self-luminous**

**The finding, from the walk:** the frame contained two contradictory light
sources. The sphere was lit like a planet — diffuse falloff from a point at
38% 32%, a terminator gathering opposite it, a rim light on the far limb — and
then wrapped in a symmetrical corona that was largest and brightest behind and
around it. The sphere said a lamp was over there; the corona said a sun was
behind. What a viewer feels, without needing to name it, is an object in front of
a light rather than a light.

**The ruling: the nucleus is self-luminous and is the only light in the frame.**
Built from variant a. Four parts:

1. **Limb darkening, no terminator.** A star dims toward its edge in *every*
   direction, because at the limb you look through a longer, cooler slant of its
   atmosphere. That falloff is radially symmetric and carries no direction at
   all, which is exactly why it is the right shading for a body that makes its
   own light. The terminator and rim passes are deleted.
2. **The hot region stays, upper left, and is purely additive.** It can brighten
   the surface and can never shade it, and the disc underneath is already
   complete without it. That is the difference between a bright region of the
   surface and light arriving from off-frame.
3. **Granulation, not relief.** Round 1's surface came from `feDiffuseLighting`
   with a distant light at azimuth 225 — micro-shadows cast by an external
   source, precisely the cue being removed. The same turbulence now drives
   brightness instead: flattened to grey, contrast-stretched about mid-grey,
   blended in overlay. Convection cells, not craters. No direction in it.
4. **The corona anchors to the hot region.** Every layer is centred on the hot
   patch, not the body, and every gradient peaks *inside* the body where it
   cannot be seen — so the near limb sits at about 28% of the first layer's
   radius and the far limb at about 72%, and the same gradient gives a strong
   bleed on the hot side and almost nothing opposite. A corona centred on the
   body peaks in a ring around the whole silhouette, and a bright ring around a
   silhouette is a backlight.

### Round 3: what was still wrong, and what it took

Two findings, and both were about whether the sphere reads as a sphere.

**Limb darkening was too weak.** With the terminator gone, the falloff toward
the edge is the only cue that this is a body, and it has to carry the whole job
alone. It was not carrying it: the silhouette sat at 54% of centre luminance,
which reads as a disc.

**The texture did not follow the curve.** Granulation was drawn at uniform scale
across the face. On a real body the pattern compresses hard toward the limb as
the surface turns away, and uniform texture on a curved body is the flat-sphere
tell. No SVG filter performs a spherical map.

**Both are fixed by rendering the body as a sphere map** on a canvas, once, and
placing it as a single `<image>`. For every pixel inside the disc:

```
mu  = sqrt(1 - r^2)                        the surface normal's z
I   = (1 - u) + u * mu^p                   limb darkening, u = 0.86, p = 1.5
I  *= 1 + tex * fbm(nx, ny, mu)            granulation sampled AT THE SURFACE
I  += hot * cap(n . h)                     the hot region, a cap on the sphere
```

Sampling the noise at `(nx, ny, mu)` rather than at `(x, y)` is the whole fix for
the second finding: near the limb `mu` changes fast for a small step in screen
position, so the pattern runs through many periods in few pixels — exactly, and
for free. The hot region as a cap on the sphere foreshortens near the limb for
the same reason, like anything else on a surface.

The limb law departs from physics twice, deliberately. The real profile is
`u ~ 0.6` and `p = 1`, which puts almost all of its drop in the final one or two
percent of the radius — right for a photograph of the Sun and useless on a body
250px across. `u = 0.86` takes the true limb to 14% of centre instead of 40%, and
`p = 1.5` starts the falloff early enough to be legible across the outer third.
It cannot read as shadow, because it is identical in every direction.

**Measured off the rendered pixels, every run:**

```
centre luminance        248.9
mean limb luminance      84.8      34% of centre   (was 54%)
darkening by bearing     weakest is 84% of strongest — every edge, not one
texture roughness        centre 0.60  mid 0.70  limb 1.13
                         1.89x finer at the edge, and monotonic
```

**The corona was still a separate light.** A pale halo floated off the upper-left
shoulder — the backlight relocated rather than removed. It came from the wide
layers being centred on the hot region: at five body radii, an offset that reads
as anchoring at one radius reads as a second object at another.

The bleed is now drawn **inside the body's own image**, past the limb, with an
exponential falloff that is gone within a third of a radius — and coloured from
the limb it leaves, so it is continuous with the surface rather than a bright
line along the edge. A glow drawn inside the body's own picture cannot read as an
object standing beside it. Outside the body there is now exactly one element: a
faint symmetric tint centred on the body, asserted to be centred and asserted not
to reach past 2.8 radii.

### Round 4: the glow back, under the constraint that killed the ghost

Deleting the outer corona overcorrected. A body this bright has to light the
space around it, and without that it reads as pasted onto the sky.

What made round 2's version a ghost was that it was **centred on the hot
region**. An asymmetric glow at several body radii has a centre of its own, and
anything with a centre of its own is a second object. A symmetric one cannot be:
it has no position apart from the body's.

So the restored corona is centred on the body, radially symmetric, and
monotonically decreasing from the limb outward on an inverse power law — `r^-2.2`
— because a power law has no characteristic scale and therefore no radius at
which anything appears to happen. It is multiplied by a window that reaches zero
**with zero slope** at the gradient's edge, so the element's own boundary is not
a boundary: the alpha there is not merely small, its derivative is zero too.

Its stops are spaced **logarithmically in radius**. Evenly-spaced stops put a
measurable kink at `r/R 1.34`, because a gradient interpolates linearly and this
profile is far steeper just outside the limb than anywhere else. Log spacing puts
the stops where the curvature is.

**Measured off the rendered frame, differencing round 4 against round 3 — same
page, same seed, same sky, so what is left is the glow and nothing else:**

```
  r/R    round 2   round 3   round 4    the glow alone     lopsidedness of the glow
         (ghost)   (none)    (restored) r4-r3    r2-r3     round 4    round 2
  1.1      78.9     53.3      83.0      +29.6    +25.6      15.2       22.5
  1.4      68.2     49.8      69.6      +19.8    +18.4       1.2        9.6
  1.8      55.9     47.0      56.5       +9.4     +8.9       1.9        8.4
  2.3      49.3     44.3      49.5       +5.2     +5.1       1.1        2.0
  2.9      45.0     42.7      45.0       +2.3     +2.4       0.4        1.8
  3.6      41.3     40.4      41.7       +1.3     +0.9       0.7        1.2
  4.4      38.3     38.2      39.1       +0.9     +0.1       0.1        1.1
```

- **The sky near it is measurably brighter**: +29.6 luminance at the limb, still
  above a point at four body radii.
- **Monotonically decreasing outward**, everywhere.
- **No discernible boundary.** The largest rise in the falloff rate anywhere is
  1.10 luminance units; the same statistic measured with *no corona present* is
  1.06. The wiggle is the instrument — 8-bit quantisation, the section's film
  grain, a median over a finite sector — not an edge.
- **Symmetric where it has to be.** Inside 1.34 radii the near bleed is
  hot-biased, which the ruling allows. Beyond it the worst lopsidedness is 1.9,
  against the ghost's 9.6 over the same radii.
- **Stars read through it**: at 1.5 radii the 90th percentile sits 4.4 above the
  median, so the field is dimmed, not filled.

### Round 4: the nodes, and the orbit lines

**The nodes were asserted lit and read as plain gold discs.** The assertion was
true and the picture was not — a gradient offset toward the nucleus is a lit
disc, which is the mistake round 1 made at the other scale. A node is a rendered
sphere now: Lambertian, lit from the side, with a limb term that takes every edge
down including the lit one so the bright side does not become a rim.

One canvas serves all seven. A sphere lit from a direction in the plane of the
sky is symmetric about that direction, so the same image *rotated* to point at
the nucleus is exact for any bearing — no per-frame re-render, and the light
visibly swings as a body librates. Only intensity needs its own render, and
intensity changes slowly.

The terminator **wraps** rather than cutting. The star is not a point at that
distance; it subtends a wide angle from a node, so light carries past the
geometric terminator. A hard edge down the middle of a small sphere reads as a
cut-out, and it is also wrong.

**The orbit lines were three treatments encoding nothing.** Chalk, saffron and
ocean at 1.2 / 1.1 / 1.0, and the one thing they might have carried — depth —
they did not: both halves of every orbit were drawn at the same opacity. Now one
colour, one weight, and depth in opacity alone, **continuous along each arc**.
Two flat halves meet at the major-axis extremes and a step there is a seam
exactly where the eye is tracking the line, so each orbit is cut into 15-degree
segments taking their opacity from the depth at their own midpoint. The three are
still told apart, by the only thing that should tell them apart — their geometry.

### Round 5: the system becomes the mark

**The rings were near-parallel.** Round 4's three sat at 71 / 79 / 78 degrees of
inclination — spread in screen rotation but near-identical in tilt, which is why
they read as concentric rings on one plane. What decides tilt is `ry/rx`, and
round 4's were 0.323 / 0.184 / 0.210: two of them the same ellipse turned.

```
        rx    ry   rot    ry/rx   inclination   z-reach
  c    356   112    88    0.315      71.7 deg    338  (0.71)
  b    446    84    32    0.188      79.1 deg    438  (0.92)
  a    480    56   -28    0.117      83.3 deg    477  (1.00)
```

Each about a third flatter than the last. **`ry` is capped by the nucleus radius
and not by taste**: an orbit whose minor semi-axis reaches 125 stops crossing the
body, and the occlusion cue goes with it. So the spread had to be bought at the
flat end. 112 is as open as the system can go while still cutting a real chord
across the disc. Rotations sit 56, 64 and 60 degrees apart — the logo's own
arrangement. The occlusion assertion still passes on all three.

**The rings differ, and none of them is styled.** Round 4 varied opacity with
`sin(t)` — depth *within* a ring but not *between* them. The real depth is
`z = sin(t)·sqrt(rx² − ry²)`: a flatter orbit swings further toward and away from
the eye, so its near arc comes closest and reads brightest and marginally
heaviest, and an orbit lying more open never reaches either extreme. One formula,
three results.

**The constellation inside the body.** Points placed on the *sphere* — random
unit vectors kept when they face the viewer — then projected. A uniform density
on a sphere projects to a density rising as `1/mu` toward the limb, so they crowd
and compress at the edge exactly, with no code saying so. They dim with the same
limb law as the surface and step aside under the hot region.

```
in-body star field, mean brightness by band
  centre 1.47   mid 2.00   limb 2.43      1.65x denser at the edge, monotonic
  peak band mean 2.4 of 255 — a whisper
```

**The surface churns.** The body is a raster, so evolving it means re-rendering
it, and a full 512-square render is a fifth of a second. So the render is
**resumable**: twelve rows a frame, then a five-second cross-fade over the one
before it. The noise's fourth axis only ever goes forward. Twelve rows and not
forty — round 5's first attempt spent the whole frame budget on it.

**The corona rides the body's own breath**, the same keyframe rather than its own
rhythm, at an amplitude deliberately under the body's. The glow follows; it does
not lead.

**Nodes brighten with proximity.** This was already true of the model and
quantised out of the picture: the sphere was only re-rendered when intensity
moved by 0.02, four visible steps across an excursion. Two fixes — a 0.004 step,
which is under one part in 255 of the rendered value, and an intensity ceiling
raised from 1.0 to 1.8, because the two bodies that straddle the limb live
entirely inside the old ceiling and were pinned at full brightness for their
whole excursion. The two most visible bodies in the frame were the only two not
answering to distance.

```
node brightness across its own excursion
  reading    370-442    intensity 0.475-0.567    16.2%
  writing    377-473              0.444-0.556    20.1%
  math       363-442              0.475-0.578    17.8%
  science     81-172              1.217-1.800    32.4%
  geo        364-473              0.444-0.577    23.1%
  art         92-169              1.246-1.800    30.8%
  history    289-353              0.595-0.727    18.2%
```

**And the demonstration: light travels outward.** Each node's bright side faces
the nucleus and its dark side faces away, with brightness falling off with
distance. Asserted rather than admired — the verification measures the dot
product between each node's lit point and the direction of the nucleus:

```
              distance   lit-side dot   dark-side dot   intensity
science          125        +1.000         -1.000          1.00
art              125        +1.000         -1.000          1.00
history          345        +1.000         -1.000          0.61
reading          442        +1.000         -1.000          0.47
math             442        +1.000         -1.000          0.47
writing          473        +1.000         -1.000          0.44
geo              473        +1.000         -1.000          0.44
```

The distance used is the **screen** separation, not the true three-dimensional
one. On a circular orbit a node is always the same distance from the star, so
true distance would give every node on an orbit the same brightness and the
falloff — which is the demonstration — would never be visible. The eye reads
depth from screen separation, so screen separation drives it.

**Machine-checked, every run:** no `feDistantLight` / `fePointLight` /
`feSpotLight` and no `feDiffuseLighting` / `feSpecularLighting` anywhere in the
frame; no terminator or rim pass on the nucleus; all five corona layers centred
on the hot region rather than on the body.

**Variants.** The light model is now fixed across a / b / c. They move
granulation strength, corona reach and breath amplitude — how much star, not
what kind of light. Round 1's variants differed in a way that could make the
frame more or less wrong; these cannot.

## 3. The orbits — the occlusion

An orbit is a circle in 3D; projected it is an ellipse, and the ellipse's **major
axis is the projection of the line of nodes**. So the front/back split is not a
judgement call. With

```
P(t) = C + (rx cos t)·u + (ry sin t)·v
```

`sin t > 0` is the near half and `sin t < 0` the far half, for every point and
every node, no special cases. Each orbit is two half-ellipse paths; the far half
paints before the nucleus, the near half after.

**The one number that decides whether this reads as an object or a diagram:**
every orbit's minor semi-axis must be smaller than the nucleus radius, or the
arcs clear the body and nothing ever crosses anything.

```
nucleus radius 125
orbit c   rx 380  ry 115  rot  85     crosses the body
orbit a   rx 480  ry 101  rot -22     crosses the body
orbit b   rx 446  ry  82  rot  31     crosses the body
```

The homepage's orbits are ry 178/160/135 against a 42-unit nucleus. Nothing there
can ever cross anything, which is why that diagram has no depth cue at all. Any
port has to bring this geometry with it or the round is lost.

Two nodes sit exactly on the limb, where `|P − C|` equals the nucleus radius:

```
reading   orbit b  BEHIND  |P-C| 442
writing   orbit a  BEHIND  |P-C| 473
math      orbit b  FRONT   |P-C| 442
science   orbit a  FRONT   |P-C| 125   straddles the near limb, in front of the body
geo       orbit a  FRONT   |P-C| 473
art       orbit b  BEHIND  |P-C| 125   straddles the far limb, cut in half by it
history   orbit c  BEHIND  |P-C| 368
```

Same geometry, opposite z. The sphere cuts one of them.

**HISTORY — RULED in, seventh, matching the homepage.** It went on orbit C at
t=195: top centre, behind. Three reasons, in order of weight. Orbit C carried no
subject at all before it, which left a third of the system's structure with
nothing to explain it. Top centre was the only large empty label lane left, and a
centred label there gives the composition an apex against four corner labels.
And behind is right for it — the past is the far side.

**The silhouette layer.** Painting the front arcs in saffron over a saffron body
made them vanish — which read as the arc going *behind*, the opposite of the
truth. A thin ring passing in front of a star is not brighter than the star; it
silhouettes against it. Three extra paths, clipped to the disc, draw the near
halves dark. Physically right, and it needs no new hue.

## 4. Motion — **RULED round 2: drift, not static** — and the one deviation

Arrival is **2.5s**, ruled. Everything else about the beat stands: fires once on
`IntersectionObserver` at 0.4, latches, HISTORY opening the sweep at the apex,
nucleus present rather than animated in, members before structure, each orbit
drawing as one continuous stroke that vanishes behind the body and re-emerges in
front.

### The deviation: libration, not revolution

Slow drift was ruled, and separately labels were ruled to stay readable through
crossings with no reactive collision logic. **Built as a slow revolution, those
two rulings cannot both hold.** That is not a tuning problem; it is a theorem,
and it is worth stating in full because it decided the round.

Under revolution, any two nodes eventually arrive at the same screen point. When
they do, both are near the body, so both are near *full* presence — and
depth-linked opacity cannot separate two things that are equally close. The first
round-2 build hit exactly this: ART and HISTORY, both at 0.98 presence, labels
overlapping by 8,336px squared. Unreadable.

The only static remedy is to give each orbit its own band of label radius. That
cannot fit. A radial gap separates two labels only if it exceeds the label's
extent *along the radial direction*, which for a 186 by 52 block is 186 when that
direction is horizontal. Three bands plus two 186px gaps put the outer edge
625px from centre; the frame allows 512.

So the choice was reactive collision handling, which the same ruling forbids, or
a motion that does not produce the collision. **I took the second, and changed
the motion rather than smuggling in collision logic.**

Each node now **librates** about its composed position instead of revolving.
Libration is not a fudge — it is real orbital behaviour, the thing the Moon and
the Trojan asteroids do.

Round 2's settings were 1801 / 2803 / 4507 seconds and a 16 degree bound, at
0.183 px/s. Round 3 raised both — see below.

The floor for seeing a small object move against a static reference is near
0.6 px/s. At 0.183 it is never caught in the act, and it has plainly moved if you
look away and come back. It also passes the casino test *better* than a
revolution would: a revolution eventually returns the system to its starting
configuration, which is a loop. Three incommensurate components never do.

What is lost: nodes no longer travel the whole orbit, so the layer swap that
demonstrates occlusion in motion fires only for the two nodes whose excursion
crosses the line of nodes. The occlusion itself is unaffected — it is still there
statically, and the arrival still draws each orbit through it.

**If full revolution is wanted instead, the honest price is reactive label
handling, and that should be ruled on directly rather than picked here.**

### Round 3: the excursion, raised

Eleven pixels a minute sat below the threshold of registering a change on
return, which was the point of having motion at all. Two things moved.

**Amplitude is now per node**, set inversely to `|dP/dtheta|` at each body's own
position. On an ellipse that factor swings from `ry` at the major-axis extreme to
`rx` at the minor — 101 against 480 on orbit a — so one uniform angular amplitude
makes a body at its turning point crawl while a body crossing the face flies, at
4.7x the difference. Setting amplitude inversely gives every body the **same peak
screen speed**, which is what a viewer actually reads. Each body librating by its
own angle is legitimate: amplitude belongs to the body's motion, not to the orbit
under it.

**The bodies are decorrelated by period, not by phase.** Node *i* runs the three
components at `k_i` times their base periods and carries `k_i` on its amplitude
to compensate, so peak speed is identical while each rhythm is its own. Every
sine starts at zero, which means `librate(node, 0)` is exactly the composed
position — and that matters more than it sounds, because the composed state is
what the arrival lands on, what "static" shows, and what carries the ruled
limb-straddling geometry. Round 3's first attempt used time offsets instead and
broke exactly this: the system jumped the moment it started.

```
components          307 / 491 / 787 seconds, all prime, spread per node
amplitude           27.0 / 21.9 / 28.6 / 6.3 / 23.9 / 7.3 / 22.6 degrees
                    reading / writing / math / science / geo / art / history
peak screen speed   0.85 px/s, identical on every body
averaged            17px in thirty seconds
```

**0.85 px/s is deliberately at the perceptual boundary, and there is no setting
comfortably clear of both sides of the ruling.** Detecting motion against a
static reference takes roughly 1 to 2 arcmin per second, which at a normal
viewing distance is about 0.7 to 1.3 px/s. The rate is sinusoidal, so a body is
near peak only briefly and spends most of a swing well under it. Registering a
change after half a minute away needs something in the tens of pixels. Those two
requirements meet here and nowhere roomier.

**Amplitude is capped by the labels, not by taste.** `K = 3000` is clean across
the excursion box; `K = 3500` puts a 7px squared overlap into it and `K = 5000`
puts 2,208. The rate is set by the periods and is independent of the cap, which
is why the excursion could be raised from 16 degrees to 28 without touching the
label guarantee.

### Labels — depth-linked presence, no reactive logic

Presence tracks orbital depth continuously: opacity `0.35 + 0.65*u^0.85` and
scale `0.93 + 0.07*u`, where `u = 0.5 + 0.5*sin t`. Written every frame from the
model, never triggered by anything. Three nested groups keep it honest — depth
opacity on the outer, the arrival's animation on the middle, the arrival's
translate on the inner — because an animation out-ranks an inline style, so depth
written onto the animated element would simply lose.

A soft radial scrim sits behind every label, in the night's own hue, always on.
Invisible on open sky; decisive where a label crosses the corona or an orbit
line. Nothing switches it.

Labels sit radially outward from their own node with a floor that clears the
body, and a tether whose length falls to zero on its own when the label sits on
its node. No state, nothing toggles.

**Verified:** the whole excursion box exhausted — 823,543 configurations against
the model offline, 2,187 cross-checked in the browser against real rendered text
— **no two labels overlap anywhere the system can reach.** Largest presence
change in any ten seconds of libration: 0.002. There is no step anywhere.

### Reduced motion

Completed state rendered, no arrival, no libration. Depth-linked presence still
applies, because it is distance, not motion. Verified: 0 running animations,
frames at +0.9s and +5.9s byte-identical.

## 5. The cost — **RULED**, and the ruling applied

Ruling, 2026-08-01: *move the far layer off per-element animation. Keep the stars
rendered so density holds, but static — twinkle stays on the near layer and
anchors, where it actually reads. 15fps is not shippable at any density; effort
spent below perception is cost, not craft.*

Applied as eight lines of CSS in `css/lab-orbital.css`, scoped to
`.lab-orbital__sky .wk-sky__layer--far .wk-sky__star`. Specificity 0,3,0 against
the primitive's 0,1,0, so it wins without `!important` and without touching
`css/hero-sky.css`. The stars do not go blank: each keeps the inline
mid-brightness the generator wrote for it, which is the exact value the
primitive's own reduced-motion frozen frame holds it at. This is the primitive's
designed still, applied to one layer instead of all of them.

```
                                      stars     twinkling
before                                1,834         1,834
after                                 1,834           813    near layer + filigree
```

**Density is unchanged.** 1,834 stars rendered, 1.279 per 1000px², 0.1% drift.
Nothing was removed from the field; only the animation on 1,021 faints and dust
whose twinkle swings inside a band the eye cannot resolve.

Measured on GPU-rasterising Chromium, Intel Iris Xe, 1440×900, median rAF
interval, three rounds each, run back to back in one process so they are directly
comparable:

```
homepage linen-hero as it ships today   33.3  33.4  33.3 ms     30fps
orbital lab, far layer static (ruled)   16.7  33.3  33.3 ms     30fps
orbital lab, before the ruling                66.7 ms           15fps
orbital lab, near layer static too      16.7  16.7  16.7 ms     60fps
orbital lab, sky removed entirely       16.7  16.7  16.7 ms     60fps
```

**The lab now costs exactly what the section costs today** — the same 30fps step
— while carrying 1,834 stars at certified density instead of the 376 the section
ships with. The beat holds the same number during the arrival, not just at rest.

The last two rows are the honest floor: the remaining 813 near-layer stars are
the only thing between this and a hard 60fps, and the ruling reserves them, so
30fps is the floor under it. Everything else on the page — nucleus, two SVG
relief filters, blend modes, the breath, seven nodes, the draw, the atmosphere
blurs — costs nothing measurable. Static sky and the page holds 60fps exactly.

Four mitigations were measured before the ruling and none of them moved it;
element count was always the whole story:

```
will-change:auto on stars                  worse
+ layers promoted / contain:paint          no change
box-shadow halos removed                   no change
spike pseudo-elements off                  no change
```

## 6. Variants on the panel (lab only, never ships)

- **Nucleus a / b / c** — texture strength, corona size and breath amplitude move
  together. `a` restrained, `b` default, `c` pronounced.
- **Arrival 2.5s / 4.0s.**
- **Orbits static / slow drift** — drift advances each node along its own ellipse
  by rAF and **re-parents it between the back and front layers the moment it
  crosses the line of nodes**, so the occlusion is live rather than composed.
  Periods 228 / 264 / 300s.
- **Simulate reduced** — flips `[data-wk-motion='reduced']`, which the certified
  stylesheet already honours.
- **Replay** — the beat latches, so this is the only way to see it twice.
- The panel title collapses it, because it sits over the WRITING label.

## 7. Rulings taken, and what is still open

**Taken 2026-08-01:**

1. Far layer off per-element animation (§5). Applied and measured.
2. HISTORY in, seventh, orbit C top centre (§3).
3. Dashed middle orbit stays gone. A dash pattern and a dash-offset draw are the
   same property, and the draw is the beat; the three orbits separate by colour
   and weight instead.
4. The occlusion rule is the round's value, and is now recorded as a port
   constraint at the top of this file and asserted by the shots script.

**Still open, for the walk:**

- **Nucleus variant.** Default is `a`, per ruling. `b` and `c` carry the same
  light model with more granulation, more bleed and a hotter active region.
- **The 0.85 px/s drift.** It sits on the perceptual boundary by construction.
  If it turns out to be catchable on your display, the periods can be
  lengthened without touching the excursion or the label proof.
- **Libration versus revolution** (section 4). The one place this build departed
  from the brief. Revolution is available if reactive label handling is
  acceptable; it is not available otherwise.
- **The 30fps floor.** The lab matches what the section costs today, which is the
  honest bar, but it is not 60. Getting there means touching the near layer,
  which the ruling reserves.
