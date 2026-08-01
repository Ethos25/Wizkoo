# Orbital Lab — handoff

`/lab/orbital.html`. Standalone, `noindex`, linked from nowhere. Nothing outside
this route was touched: `git diff --stat` against the branch point is empty, and
`index.html`, `css/hero-sky.css`, `js/hero-sky.js` are byte-identical to HEAD.

Branch `excellence-round-1`. Everything below is a lab result awaiting a ruling.

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
twenty-five haloed stars would compete with six gold nodes for the same reading.
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
carries on this page (`.hero-cta-circle`, `index.html`). Nucleus and all six
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
science   orbit a  FRONT   |P-C| 125   straddles the near limb, in front of the body
art       orbit b  BEHIND  |P-C| 125   straddles the far limb, cut in half by it
```

Same geometry, opposite z. The sphere cuts one of them.

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
node stagger     0.30s               0.19s
paths begin      1.95s               1.22s
half-orbit draw  0.80s               0.52s
complete         3.93s               2.50s
```

Default is the slower one: six labels have to be legible as they arrive, and at
2.5s the last three land on top of each other. Amy's call.

**Ambient after:** the nucleus breath, star twinkle, the shooter. Nothing else.

**Reduced motion:** completed state rendered, no arrival, no drift. Verified — 0
running animations, and the frame at +0.8s and +5.8s is byte-identical.

## 5. The cost — the finding that needs a ruling

Measured on GPU-rasterising Chromium, Intel Iris Xe, 1440×900, median rAF
interval in the settled ambient state:

```
homepage linen-hero today (376 stars)      33.4ms   30fps
orbital lab at certified density (1,834)   66.7ms   15fps
the same lab with the sky static           16.7ms   60fps
```

The orbital system itself — nucleus, two SVG relief filters, blend modes, the
breath, the six nodes, the draw — costs **nothing measurable**. Static sky and
the page holds 60fps exactly. The entire delta is per-star opacity animation, and
the count is what the density ruling produces at this aperture.

Four mitigations were measured and none moved it:

```
will-change:auto on stars                  83.3ms   worse
+ layers promoted / contain:paint          66.7ms   no change
box-shadow halos removed                   holds
spike pseudo-elements off                  holds
```

Cutting the twinkling count to 900 or below returns it to 33ms — the shipping
section's number. So the shape of the decision is clean, and it is a port-time
decision, not a lab one:

- **hold certified density** and accept ~2× the frame cost the section carries
  today, or
- **move the far layer off per-element animation** — 1,021 of the 1,834 are
  faints and dust at opacity ≤ 0.24, individually near-invisible, and could carry
  their twinkle on a canvas or in far fewer elements without changing what the
  field looks like.

I have not taken that decision. The lab ships at certified density because
density is what was ruled and weight was explicitly not capped here.

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

## 7. Open questions for the walk

1. Frame cost (§5) — hold density, or move the far layer.
2. Nucleus variant. `c`'s texture starts to read as banding rather than
   cratering; `a` may be too quiet to justify the pass.
3. Arrival timing.
4. The brief named six subjects; the homepage carries seven. HISTORY is not in
   this lab. Six is what was ruled here — the seventh needs a position and a
   label lane before any port.
5. The homepage's dashed middle orbit is gone. A dash pattern and a dash-offset
   draw are the same property, and the draw is the beat; the three orbits are
   separated by colour and weight instead.
