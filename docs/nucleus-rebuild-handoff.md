# Nucleus Rebuild — Close-Out Handoff

**Closed by Amy, 2026-08-02.** The bridging-field direction stands —
**"light leaves AND travels" supersedes the lever-4 tight-glow cut, filed
to the registry as a conscious supersession.** The lane ends with
**saffron-lantern v5** pinned on `nucleus-rebuild` and deployed in the
Granddad section at `https://nucleus-rebuild--wizkoo.netlify.app`
(section `#linen-hero`) — **the section is the only surface that
approves; crops kept approving what the scene rejected.** Nothing has
merged anywhere — merging into `orbital-port-lane` (and onward) is Amy's
explicit call, not this lane's. `nuc-saffron` pins the same candidate.
The in-section verification facts and the falloff measurement live in
`docs/nucleus-field-measurement.md`.

## The ruled object, in one paragraph

A subsurface saffron ball: radiance falls with 3D distance from a molten
core inside the sphere (upper-left, `sub: {dir:[0.38,0.32], depth:0.36,
zc:0.50, k:3.0}`, exposure 2.05), so the shell burns white-gold over the
heart and the far side drops to node-shadow depths while staying
saffron-warm (ramp floor [64,42,20]). Mixed-scale surface cells carry
foreshortening. The limb hands off to a thin bright chromosphere line and
halation that both scale with core-to-limb proximity, then a three-shell
symmetric corona bridges continuously out past the inner subjects
(1.35R/A.34/p3.2 · 2.6R/A.14/p2.0 · 7.5R/A.18/p1.5). Arc segments catch
the star's light under the same screen-distance law the nodes obey.
Everything outside the nucleus scope is byte-identical to the lane tip
(`js/orbital.js` and `css/orbital.css` are the only files that differ).

## The laws this lane discovered (already in auto-memory; canonical here)

1. **The flatness law.** A perfectly radial glow carries no
   shape-from-shading — it is geometrically a vignette on a flat disc.
   Every round Amy read as 3D broke symmetry (texture, side light,
   displaced core); every flat round was radially symmetric. Luminous
   bodies at page scale need a **displaced energy core + foreshortening
   texture**, never pure radial falloff.
2. **Additive cannot close a value gap.** The hot-cap could only raise;
   matching the nodes' bright-to-dark range required the subsurface model
   (light anchored to a point INSIDE the body — no external lamp, so the
   self-luminous read survives).
3. **The moat law.** If the source visibly lights objects at 2.2–5R, the
   field between must decline continuously. Source → dark gap → lit
   objects is the unnatural tell. Supersedes round 9 lever 4's "light
   leaves, not surrounds": light leaves AND travels. Measured on the
   deploy (differential instrument): 82/27/12/4/1 per-255 at
   1.1/1.5/2/3/4R — one smooth decline.
4. **The saffron axis.** The system's gold family holds G/R ≈ 0.7–0.8
   (#E8AF38, NODE_RAMP). Ramp stops that fall toward G/R ≈ 0.5 read as
   orange fighting the system; toward pale high-B, as lemon. The lantern's
   ramp holds the axis from white-gold to its deep floor.
5. **Calibration traps** (subsurface): a strong mu term crushes the pole
   below the white knee (use 0.60+0.40·mu); k below ~3 reads matte.
6. **Instrument law.** Glow must be measured DIFFERENTIALLY (star frame
   minus no-star frame; the sky's own vignette defeats absolute probes),
   and `.lo-corona` lives inside `.lo-layer--back` — re-show it when
   hiding layers. Always probe `WizkooOrbital.CFG` after touching
   candidate wiring: the lever overrides silently masked self-contained
   candidates once (fixed — levers apply to `photo-a` only).

## Branch map (all pushed; all are the record, none deletable casually)

| Branch | What it holds |
|---|---|
| `nucleus-rebuild` | Base + full history; pins the RULED `saffron-lantern` |
| `nuc-saffron` | Same content; the deploy URL Amy judged on |
| `nuc-r7-ignition/-molten/-aura` | Round 7 (rejected: glow-led) |
| `nuc-r8-photo-a/-b` | Round 8 (photo-a became the base) |
| `nuc-e1..e4` | Round 9 cumulative levers on photo-a |
| `nuc-node-star` | The literal scaled node (self-luminous law suspended there only) |

## Open items for whichever session inherits

- **Merge**: `nuc-saffron`/`nucleus-rebuild` → `orbital-port-lane` awaits
  Amy's explicit instruction. The diff is two files.
- **Lab verifiers are stale**: `scripts/lab-orbital-r2.js` asserts the old
  N2 falloff model. Re-instrument against the subsurface model before
  trusting any pass/fail.
- **Lever 5 (living surface)** was built, measured at 4.16–4.50/255 mean
  keyframe delta (below perception at 80px), and cut by its own law. The
  dormant keyframe machinery remains in `js/orbital.js`; a legible living
  surface needs a bigger body, not a knob.
- The round-9 elevation branches and node-star stay as the record of the
  paths not taken.
