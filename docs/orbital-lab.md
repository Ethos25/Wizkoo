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

All three are asserted, not remembered: `node scripts/lab-orbital-shots.js <url>`
prints a PASS/FAIL on them and exits non-zero if any fails. Keep that check alive
through the port.

---

Everything below is a lab result. Rulings taken on 2026-08-01 are marked **RULED**.

---

## Files

| file | what it is |
| --- | --- |
| `lab/orbital.html` | the route, plus the lab panel and the scroll runway that puts the section below the fold |
| `css/lab-orbital.css` | the system's stylesheet, and the lab chrome (chrome is deleted at port time) |
| `js/lab-orbital.js` | geometry, material, the arrival beat, the drift variant, the panel |
| `js/lab-orbital-sky.js` | the certified sky's FIELD re-derived for this aperture — no second generator |
| `scripts/lab-orbital-sky-report.js` | the density drift measurement |
| `scripts/lab-orbital-shots.js` | evidence stills |
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

## 2. The nucleus

Four passes, because one radial gradient makes a lit **disc**, not a body:

1. **shading** — diffuse falloff from the light at 38% 32%
2. **limb darkening** — centred, transparent through the middle, dark at the rim
   on *every* side. This is the pass the first build was missing, and it is the
   whole difference between a ball and a body.
3. **terminator** — the warm gather where the lit face turns away
4. **rim** — a hairline of the body's own light on the far limb

**Surface** is `feTurbulence` → `feDiffuseLighting` at two scales — craters in
`overlay`, grain in `soft-light` — lit at azimuth 225 / elevation 40, the same
upper-left bearing as the gradient, so nothing on the surface argues with the
terminator. The body group is isolated so the blend cannot reach into the sky.

The first build set `baseFrequency` to 0.0055, which on a 250-unit body is one
and a half features across the whole sphere: it read as a smudge. 0.022 is a
45-unit feature, five or six across the face, which is cratering.

**Light direction** is not invented. 38% 32% is the value the product already
carries on this page (`.hero-cta-circle`, `index.html`). Nucleus and all seven
nodes take the same relative light, so a node is the same material as the body it
orbits at a sixth of the radius.

**The breath is not periodic.** A single 4s alternate cycle is exactly the loop a
viewer catches, and the bar forbids that. Three glow layers run at 3.7s, 5.3s and
8.9s — mutually prime — so the summed luminosity has amplitude inside any 3–5
second window and a composite period no one will sit through. Opacity only.

One thing the first build got wrong and is worth not repeating: the breath was
put **on** the corona, so the corona's opacity never rose above 0.38 and the
bleed effectively disappeared. The corona now has a standing full-strength
presence and the breath is a separate pair of layers over it. Light added, not
light gated.

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

## 4. Motion

**Orbits do not revolve** in the default. Believable orbital speed is
imperceptible; anything faster reads as a screensaver.

**The arrival**, once, on `IntersectionObserver` at 0.4, then latched — the
observer is disconnected on fire, so it cannot re-run.

The nucleus is **not** animated in. It is the given: the one obsession is already
there when you arrive, and the subjects come to it. Animating it in would make
the centre an event rather than a premise.

Then nodes, then paths. **Members before structure** — drawing the paths first
would state the system before its subjects, which is the difference between an
object and a diagram.

Nodes ignite in a **clockwise sweep from the first node past twelve o'clock**.
Not reading order, not depth order: a sweep circles the nucleus, which restates
the thesis while it plays.

Each orbit draws as **one continuous stroke that happens to live in two
z-layers** — far half first, vanishing behind the body, near half picking it up
on the other side and crossing in front. The occlusion is demonstrated by the
drawing of it, not merely present in the still. Orbits go in order of decreasing
minor axis, so each lies flatter than the last and the final stroke is the one
that runs straight across the face.

Easing is the product's own `cubic-bezier(.16,1,.3,1)` for nodes and labels; the
paths use a gentler `cubic-bezier(.22,.68,.18,1)` so the stroke settles rather
than snaps.

```
                 slow (default)      brisk
node 1 ignites   0.15s               0.10s
node stagger     0.26s               0.165s
paths begin      2.00s               1.24s
half-orbit draw  0.78s               0.51s
complete         3.88s               2.48s
```

Re-spaced when HISTORY went in. The two totals are the ruled ones; the stagger
absorbed the seventh node rather than the beat getting longer.

Default is the slower one: seven labels have to be legible as they arrive, and at
2.5s the last three land on top of each other. Amy's call.

With a node now sitting at the apex the sweep has a true starting point, so it
begins on the node nearest twelve rather than the first one past it. HISTORY
opens the beat.

**Ambient after:** the nucleus breath, star twinkle, the shooter. Nothing else.

**Reduced motion:** completed state rendered, no arrival, no drift. Verified — 0
running animations, and the frame at +0.8s and +5.8s is byte-identical.

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

- **Nucleus variant.** `c`'s texture starts to read as banding rather than
  cratering; `a` may be too quiet to justify the pass. Default is `b`.
- **Arrival timing.** 3.88s or 2.48s.
- **Orbits static or slow drift.** Static is the ruled default and nothing in the
  build argues against it; the drift variant exists so the question is settled by
  eye rather than by argument.
- **The 30fps floor.** The lab matches what the section costs today, which is the
  honest bar, but it is not 60. Getting there means touching the near layer,
  which the ruling reserves.
