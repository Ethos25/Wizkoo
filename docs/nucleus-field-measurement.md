# Nucleus v5 — In-Section Verification & Falloff Measurement

**Surface:** the Granddad section (`#linen-hero`) on the deployed
`https://nucleus-rebuild--wizkoo.netlify.app`, viewport 1966×594 (Amy's
production environment), arrival complete, emission field settled.
**Measured at commit `9640e82`** (this artifact is a docs-only follow-up;
the measured code is byte-identical). Instrument:
differential — a frame with the star (nucleus + corona, cage layers
hidden, breath paused) minus a frame without it, so the sky, its vignette
and its stars cancel exactly; per-channel max diff, 16 directions.

## Falloff (per-255 diff vs sky, median of 16 directions)

| radius (body radii) | 1.1 | 1.5 | 2.0 | 3.0 | 4.0 | 5.0 |
|---|---|---|---|---|---|---|
| median | 82 | 27 | 12 | 4 | 1 | 1 |

One smooth monotone decline — no radius steps, no moat. Visible-glow
radius (median > 2/255): **3.40 body radii**. The inner subjects orbit at
2.2R; the field is perceivable there (12 at 2R) and fades to a trace by
4–5R, matching the nodes' own distance-dimmed faces.

## Per-direction spread (symmetry evidence)

- r1.5: 26–29 across all 16 directions (median 27)
- r2.0: 11–13 (median 12)
- r3.0: 3–4 (median 4)

The field is radially symmetric to within ±1.5/255 everywhere outside the
body's own raster. At r1.1 the spread is 72–91: that asymmetry is the
subsurface halation INSIDE the body's image extent (1.35R) — the bleed
the certified law places inside the body's own picture, brightest where
the internal core sits nearest the limb.

## The laws, verified as fact on the deploy

- **Symmetric corona:** all three shells centred at the frame centre
  (720, 472) exactly; gradients radial; per-direction spread above.
- **No directional terminator:** the body's gradient anchors to a point
  INSIDE the sphere (subsurface core); no external light direction exists
  in the shader; the shell's darkest values come from core distance, not
  from a lamp.
- **Scale ceiling:** `NUC_RATIO` read off the live page = **0.200**.
- **One-light / no double-lighting:** the corona group is the back
  layer's FIRST child — every node paints OVER the field, so lit faces
  and terminators are untouched by it. Every node sphere's rotation aims
  its lit face at the nucleus: max aim error across all seven = **0.07°**.
- **Casino test:** the motion inventory of the live section contains ONLY
  the pre-existing certified animations — `lo-breath` at 3.7s/5.3s/8.9s
  (five elements: two interior glows, three shells; no common beat) and
  the one-shot arrival animations (draw, node-in/pop, label-rise,
  emit-in) which latch. v5 added no continuous motion.

## Cumulative-lever position in v5

| Lever | Status |
|---|---|
| 1 Temperature gradient | **In** — carried by the lantern's own subsurface exposure (2.05) and saffron ramp: white-gold heart to deep-saffron floor. e1's literal values are not applied (levers elevate photo-a only). |
| 2 Convection octaves | **In** — three octave groups [[2.6,.16],[6.2,.10],[13,.06]], large cells dominating, surface-sampled. |
| 3 Limb sequence | **In** — chromosphere line (w .013, A .70, I 1.34), scaled by core-to-limb proximity; surface → line → soft corona → space. |
| 4 Glow reach | **Superseded, consciously** — Amy's registry filing: "light leaves AND travels." Field bridges to 7.5R; the falloff table above is the receipt. |
| 5 Living surface | **Cut by its own law** — measured keyframe delta 4.16–4.50/255 mean (saturated), below perception at 80px. Machinery dormant in `js/orbital.js`. |
