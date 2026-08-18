# SKY-01 — THE MARKETING PLANETARIUM, RECON

**Lane:** SKY-01, read-only, two repositories.
**Date:** 2026-08-12.
**Bases:**

| Repository | Path | Branch | SHA |
|---|---|---|---|
| Marketing | `Desktop\Wizkoo` | `main` | `76a80f61808ffaf89085070f32a68064bca05fd4` |
| App | `Desktop\wizkoo-app` | `master` | `2b52ccdad7bf9c563df59ca50fa0bfcda7f32557` |

Both checkouts were at `origin` HEAD, 0 ahead / 0 behind, at the start and at
the end of this session. Nothing was staged, committed, branched or pushed in
either repository. The only file written is this report, untracked, at the
marketing repository root.

Live evidence was taken from `https://www.wizkoo.com/` via the in-app browser
at a 1280×720 viewport. Computed styles and DOM counts read out of that page
are marked **[live]**. A screenshot could not be captured — the Browser pane
was not displayed and the page was not compositing frames — so all rendered
evidence in this report is computed-style and DOM measurement, not pixels.

---

## 0. THE HEADLINE, BEFORE THE DETAIL

**The two skies are the same code.** `css/hero-sky.css` in the marketing
repository declares itself a byte-for-byte copy of the app's
`packages/ui/src/TwoLayerSky/TwoLayerSky.css` @ `e1a90b2`
(`css/hero-sky.css:1-11`), and `js/hero-sky.js:9-13` states the same. The
marketing generator is a JavaScript transliteration of the app's
`skyGeneration.ts`: identical PRNG (`mulberry32`), identical sub-seed layout,
identical star classes, identical class names, identical keyframes.

What differs is **the FIELD it is driven at, the ground it is painted on, and
what is switched off for frame cost.** The marketing section drives the app's
own primitive at 3.21× the star count, 1.71× the colour-drift intensity and
1.42× the nebulosity intensity, over a seven-layer ground gradient instead of
the app's two-stop one, and then freezes 93% of the stars to pay for it.

Three consequences the founder should have before ruling anything:

1. **The gold light is not in the sky.** It is the orbital illustration's
   corona — a three-ring radial gradient `#FFDFA0 → #B8863A` centred on the
   nucleus, inside the SVG **[live]**. The sky's own gold contribution is a
   single 6%-alpha ellipse placed to sit just inboard of it. A surface with no
   nucleus inherits an empty stage. **Detail in §4.**
2. **The volume ordering is already ruled.** Decision Registry
   `3aa335a8-d332-8120-be55-f20468d2b9a3` ("Dark-Surface Sky — Two-Layer Law"),
   Red tier, Status Active, ruled by Amy eyes-on 2026-07-27, states the volume
   ladder as *"marketing fullest, Night Letter gentle middle, spectacle
   quietest — volume set by what the foreground is doing."* The app's
   planetarium is the spectacle surface. Raising it toward marketing's field
   reverses that ordering. **Detail in §7b.**
3. **Changing the gradient stops breaks the WP-29 guard structurally, and
   moves six colours across the 4.50:1 line.** The guard hard-asserts the two
   token names. **Detail in §5.**

---

## 1. THE MARKETING SKY, FULLY SPECIFIED

### 1.1 The section and its layer stack

The section is `<section class="linen-hero" id="linen-hero" data-orbital>` at
`index.html:2345`. The headline is `index.html:2360`. Bottom to top:

| z | Layer | Where | What it contributes |
|---|---|---|---|
| — | Ground gradient | `index.html:1055-1063` (`.linen-hero` `background`) | 7 stacked radial gradients: the vignette, the warm mid-band, the gold echo |
| 0 | `.orb-sky` star field | `index.html:2352`, mounted by `js/orbital-sky.js:110-118` | 1,834 stars + atmosphere, the app's primitive at the orbital FIELD |
| 1 | `.linen-hero::before` film grain | `index.html:1064` | fractalNoise SVG, 256px tile, `opacity:0.038` |
| 1 | `.linen-hero-text` | `index.html:1068` | headline column |
| 2 | `.orb-stage` orbital SVG | `css/orbital.css` §stage, built by `js/orbital.js` | **the light source** |

The grain is deliberately lifted to z-index 1 so it paints *over* the sky, per
`css/orbital.css:136-145` — at equal z-index the later sibling would have put
stars over grain and inverted the lab's order.

### 1.2 The ground gradient, stop by stop

`index.html:1055-1063`, verified **[live]** as computed `background-image`:

```css
.linen-hero{ background:
  radial-gradient(ellipse 55% 40% at  6% 18%, rgba(30, 80,140,0.18) 0%, transparent 65%),
  radial-gradient(ellipse 45% 55% at 78% 20%, rgba(82, 38,148,0.13) 0%, transparent 70%),
  radial-gradient(ellipse 50% 38% at 22% 72%, rgba(20, 50,130,0.15) 0%, transparent 65%),
  radial-gradient(ellipse 40% 30% at 42% 85%, rgba(14, 44,112,0.10) 0%, transparent 60%),
  radial-gradient(ellipse 55% 45% at 62% 52%, rgba(232,175, 56,0.06) 0%,
                                              rgba(232,175, 56,0.02) 45%, transparent 70%),
  radial-gradient(ellipse 35% 28% at 28% 42%, rgba(160,120, 60,0.04) 0%, transparent 60%),
  radial-gradient(at 50% 45%, #1e3060 0%, #131e3a 60%, #0d1627 100%); }
```

Read from the bottom up:

- **Layer 7 (the base).** A three-stop radial anchored at 50%/45%: `#1e3060`
  at centre, `#131e3a` at 60%, `#0d1627` at the farthest corner. This *is* the
  vignette and this *is* the warmer mid-band. Centre-to-edge luminance ratio
  **1.418:1**.
- **Layer 6.** A warm brown wash at 28%/42%, 4% alpha. Left of centre, mid
  height.
- **Layer 5.** The gold: `#E8AF38` at 6% alpha falling to 2% at 45%, centred
  at **62% x, 52% y**. Not upper right. It is placed just inboard of the
  orbital nucleus, whose measured centre is 76.1% / 50.0% **[live]**.
- **Layers 4-1.** Four cool washes — blue at 6%/18%, purple at 78%/20%, blue
  at 22%/72%, blue at 42%/85%. The strongest single overlay is the upper-left
  blue at 18% alpha; the upper-**right** overlay is the *purple* at 13%.

`--u`, the scale unit every star size rides, is declared on `.linen-hero` at
`css/orbital.css:181-184` and is copied verbatim from the lab. Without it every
star computes to 0px — that failure is recorded in the same file at lines
163-180 (1,834 stars in the DOM at computed width 0px on a deployed branch).

### 1.3 The star field: generation

`js/orbital-sky.js` does not generate anything. It swaps the FIELD constant
inside `js/hero-sky.js` (`withLabField`, `js/orbital-sky.js:80-86`), calls the
certified generator, and restores it. The FIELD is `js/orbital-sky.js:54-74`:

| Population | Count | Sampler | Size (× `--u`) | Opacity lo→hi | Twinkle dur |
|---|---|---|---|---|---|
| far · faints | 541 | clustered (10 knots, 55% share) | 1 | 0.08–0.18 → 0.24–0.40 | (3–8s) ÷ 0.55 |
| far · dust | 480 | uniform | 1 | 0.03–0.08 → 0.10–0.20 | (5–10s) ÷ 0.55 |
| near · anchors | 12 | uniform | 2.6–3.8 | 0.55–0.65 → 0.92–1.00 | (4–7s) ÷ 1.3 |
| near · brights | 98 | uniform | 1.8–2.4 | 0.42–0.54 → 0.75–0.93 | (2.5–5.5s) ÷ 1.3 |
| near · mids | 490 | clustered (8 knots, 50% share) | 1 or 1.5 | 0.20–0.35 → 0.50–0.72 | (2–6s) ÷ 1.3 |
| near · faints | 200 | clustered | 1 | 0.08–0.18 → 0.24–0.40 | (3–8s) ÷ 1.3 |
| filigree | 11–14 | gaussian, one fixed lower-left zone | 0.9–1.7 | 0.08–0.20 → 0.22–0.40 | 4–8s |

**Total 1,834 stars**, confirmed **[live]** (`data-orb-sky-stars="1834"`).
Per-class DOM counts **[live]**: 12 anchor / 98 bright / 490 mid / 741 faint /
480 dust / 13 filigree.

**Placement algorithm.** `makeClusterSampler` (`js/hero-sky.js:72-92`): N
knots at uniform positions with spread 9–20 percentage units; each star takes
a gaussian offset from a random knot with probability `clusterShare`,
otherwise uniform. **Mids and faints clump; anchors, brights and dust do
not.** There is **no content hole** — `js/hero-sky.js:69-70` removes it
explicitly ("this aperture is small enough that a hole would empty it").

**Measured variance [live]**, computed opacity and width at 1280×720:

| Class | n | opacity | width |
|---|---|---|---|
| anchor | 12 | 0.748–0.815 | 2.30–3.19px (all 12 haloed) |
| bright | 98 | 0.590–0.712 | 1.59–2.11px (all 98 haloed) |
| mid | 490 | 0.361–0.532 | 1.00–1.33px |
| faint | 741 | 0.165–0.289 | 1.00px |
| dust | 480 | 0.067–0.138 | 1.00px |
| filigree | 13 | 0.174–0.266 | 1.00–1.50px |

Note the floor: `--u` computes to 0.888px at this viewport, so **1,511 of
1,834 stars (82%) render at the 1px minimum**. The size variance is real in
code and largely collapsed at desktop width; the *opacity* variance is what is
doing the visible work — a 12× spread from dust to anchor.

**Anchors get more than size.** `.wk-sky__star--anchor` carries a radial
white highlight at 42%/40% (`css/hero-sky.css` anchor rule) and 8 of the 12
also carry `--spike`, a pair of 14px hairline cross-glow gradients. Only 8 of
12 spike **[live]** — `spike: rand() < 0.7`.

### 1.4 The star field: atmosphere

Generated by `buildAtmosphere` (`js/hero-sky.js:184-226`) at intensities
`{colorDrift:60, nebulosity:64, airglow:56, milkyWay:21, wisps:32}`
(`js/orbital-sky.js:73`).

| Element | n **[live]** | Geometry | Rendered opacity **[live]** |
|---|---|---|---|
| `atmo-wash` (colour drift) | 2 | 62%×96% at ~−10%/13%, `#52304A`; 58%×100% at ~63%/4%, `#1E4A55`; blur 26px | 0.216, 0.180 |
| `atmo-lobe` (nebulosity) | 4 | 34–56% × 20–36%, alternating left/right, `#4A2A4E`/`#3A2E5E`/`#1E4A55`; blur 16px | 0.151–0.245 |
| `nebula` | 4 | 40–66% × 22–38%, edge-hugging, `#1E3060`/`#24406F`/`#182F58`; blur 18px | 0.094–0.144 |
| `airglow` | 1 + 1 line | bottom 15%, warm `rgba(232,220,206,·)` rising | 0.168 (mid-breath; inline 0.28) |
| `bandwash` | 2 | Milky Way, rotated 22–34° | 0.042, 0.038 |
| `banddust` | 480 | 1px points on the band, gaussian σ≈9 | 0.013–0.051 |
| `wisp` | 2 | 40–58% × 6–10%, over everything, blur 11px | 0.072 |

### 1.5 Animation: what moves and what does not

**[live] at 1280×720: 123 of 1,834 stars animate; 1,711 are frozen.**

| Set | Animated | Frozen | Governed by |
|---|---|---|---|
| far (faints + dust) | **0** | 1,021 | `index.html:2160-2165` |
| near anchors | 12 | 0 | primitive |
| near brights | 98 | 0 | primitive |
| near mids | 0 | 490 | `index.html:2160-2165` |
| near faints | 0 | 200 | `index.html:2160-2165` |
| filigree | 13 | 0 | primitive |
| non-star | 15 | — | primitive |

The 15 animated non-star elements are 2 washes (drift, 110–140s, `alternate`),
4 lobes (breathe, 24–40s), 4 nebulae (breathe, 18–32s), 1 airglow (breathe,
60s), 2 wisps (drift, 130–180s) and 2 shooters (50–90s period, 3.5% duty
cycle). Star twinkle durations measured **[live]** span 1.93s–6.95s, all
`ease-in-out`, all opacity-only, all with random (not positional) delays
(`js/hero-sky.js:112`).

**Two freeze rules exist and one has been silently overridden.**

- `css/orbital.css:224-227` (specificity 0,3,0) freezes far-layer stars
  *except* every 8th, on Amy's 2026-08-02 re-ruling ("I want some stars to
  twinkle in the background... I don't want 1,021 twinkling"). Its comment
  claims "~128 of 1,021, measured on the deploy."
- `index.html:2160-2165` (2026-08-09, perf) freezes **all** `--mid`, `--faint`
  and `--dust` stars with `!important`.

The far layer is faints and dust only, so the second rule's `!important` wins
over the first rule's `:not(:nth-child(8n))` exemption. **Measured on the live
deploy: 0 far stars animate.** The 2026-08-02 ruling's every-8th subset no
longer exists in production. `css/orbital.css:224` is dead code and its "~128
measured on the deploy" comment is false against the current deploy. Reported,
not fixed.

Frozen stars are not blank: each holds `opacity:(lo+hi)/2`, the primitive's own
designed reduced-motion frame value (`js/hero-sky.js:336`).

### 1.6 The light that comes from the illustration, not the sky

`css/orbital.css:17-24` states the law verbatim:

> **THE NUCLEUS IS SELF-LUMINOUS AND IS THE ONLY LIGHT IN THE FRAME. Nothing
> here may imply another one.**

Measured **[live]** inside `.orb-stage`:

- **Nucleus centre: 76.1% x, 50.0% y** of the section; body radius ~36px.
- **Corona: three concentric rings**, `r` = 64.8 / 124.8 / 360 SVG units
  (71 / 137 / **396px** on screen), each a radial gradient running
  `#FFDFA0 → #B8863A` with peak stop-opacity 0.34 / 0.14 / 0.18 and a window
  that reaches zero with zero slope.
- The outer ring spans **60.5%–91.8% x, 25.7%–74.2% y** of the section — just
  under a third of the section's width and half its height.
- Nucleus glow gradients: `#FFF3D2` @0.45 and `#F6CB68` @0.28.
- Node halos: `#F6CB68` @0.42 → `#E8AF38` @0.13 → transparent, on 7 nodes.
- Breath: **three** live periods, 3.7s / 5.3s / 8.9s **[live]**, one per
  corona ring, plus the body's own. `css/orbital.css:79-89` claims only two
  are live ("`.lo-breath-b` at 5.3s is a rule that matches nothing"). That
  claim is **false against the current deploy**: `.lo-breath-b lo-corona-ring`
  exists and animates at 5.3s. Reported, not fixed.

`.orb-stage` contains **488 DOM nodes [live]**.

---

## 2. THE APP'S PLANETARIUM, SAME TREATMENT

### 2.1 The tokens and the ground

`packages/design-tokens/src/tokens.css:19-20`:

```css
--color-planetarium-base: #101830;
--color-planetarium-glow: #182848;
```

One gradient expression, repeated verbatim at eight sites:

```css
background: radial-gradient(ellipse at center,
  var(--color-planetarium-glow) 0%, var(--color-planetarium-base) 70%);
```

`apps/app/src/app/start/start.css:20` (`.wk-start`), `:133` (`.cl-canvas`),
`apps/app/src/app/dev/harness/harness.css:129` and `:167`,
`apps/app/src/app/dev/harness/sky-lab/sky-lab.css:71`,
`apps/app/src/app/dev/harness/loader-lab/loader-lab.css:78`, plus the
hex-literal twins at `apps/app/src/app/onboarding/arrival.css:1` (`.wk-arr`)
and `apps/app/src/app/(app)/plan/plan.css:462` (`.wk-plan__threshold`).

Two properties of this expression matter for the delta:

- **It is two stops, not three.** `70%` is the *last* stop, so the outer ~30%
  of the radius is a **flat, uniform `#101830`**. The founder's "flat top to
  bottom" reading is correct for the outer third of the ground and wrong for
  the inner two-thirds.
- **Centre-to-edge luminance ratio 1.201:1**, against marketing's 1.418:1.
  The app's ground has 42% less dynamic range across the frame.
- It says `at center` (50%/50%). The Light Standard (Notion, page
  `32d335a8d332811ab922e806deeec3fb`) and the Generation Spectacle spec both
  give the planetarium as `radial-gradient(ellipse at 50% 45%, #182848 0%,
  #101830 70%)`. The app's shipped expression has drifted 5 percentage points
  down from the ruled anchor. Reported, not fixed.

### 2.2 The star field

`packages/ui/src/TwoLayerSky/TwoLayerSky.tsx`, generation in
`skyGeneration.ts`, field constants in `packages/design-tokens/src/tokens.ts:109-159`
(`ambientSky`). Reference frame ~1232×420.

| Population | Count | Sampler | Size (px, literal) | Opacity lo→hi |
|---|---|---|---|---|
| far · faints | 170 | clustered (5 knots, 60%) | 1 | 0.08–0.18 → 0.24–0.40 |
| far · dust | 150 | uniform | 1 | 0.03–0.08 → 0.10–0.20 |
| near · anchors | 9 | uniform | 2.5–3.7 | 0.55–0.65 → 0.92–1.00 |
| near · brights | 30 | uniform | 1.8–2.4 | 0.42–0.54 → 0.75–0.93 |
| near · mids | 130 | clustered (4 knots, 50%) | 1 or 1.5 | 0.20–0.35 → 0.50–0.72 |
| near · faints | 55 | clustered | 1 | 0.08–0.18 → 0.24–0.40 |
| filigree | 27 (2 clusters) | gaussian, 2 of 4 shuffled zones | 0.8–1.6 | 0.08–0.20 → 0.22–0.40 |

**Total 571 stars.** Derived by re-running the shipped generation algorithm at
seed 20260728; the derivation reproduces `countGeometryElements = 829` exactly,
which is the repository's own asserted value at
`packages/ui/src/TwoLayerSky/TwoLayerSky.test.tsx:188`. Filigree strokes: 27.
**Total DOM nodes in one `.wk-sky`: 860.**

Three generation differences from marketing, all in the app's favour on
structure and against it on richness:

- **The content hole survives.** `inCenterHole` (`skyGeneration.ts:30-38`), an
  exponent-6 superellipse at semi-axis 18.7 with a 0.8 feather band, excludes
  the centre third from every uniform and clustered sample, from filigree, and
  from Milky Way dust. Marketing removed it.
- **Twinkle delays are a positional wave**, not random: `ambientSky.near.wave
  = true`, so `del = ((x+y)/200) × dur` (`skyGeneration.ts:133`). Marketing
  overrode this to random (`js/hero-sky.js:28-29`, "at this size a wave reads
  as synchronized").
- **Star sizes are literal pixels** (`TwoLayerSky.tsx:61-62`, `width: s.size`).
  They do not scale with viewport. Marketing emits
  `max(1px, calc(var(--u) * n))`.

### 2.3 The app's atmosphere

Intensities `{colorDrift:35, nebulosity:45, airglow:56, milkyWay:21,
wisps:32}` (`tokens.ts:150-157`). This surface is **not** evenly lit:

| Element | n | Geometry | Rendered opacity |
|---|---|---|---|
| `atmo-wash` | 2 | 44%×78% at ~−5%/25%, `#52304A`; 44%×82% at ~69%/17%, `#1E4A55` | 0.119, 0.105 |
| `atmo-lobe` | 6 | 3 patches × 2 lobes, 14–36% × 7–18% | 0.117–0.180 |
| `nebula` | 1 | edge-hugging, 30–54% × 14–26% | 0.09–0.16 |
| `airglow` | 1 + 1 line | bottom 15%, warm | 0.28 inline |
| `bandwash` | 2 | 34% × 13%, rotated 24–34° | 0.042, 0.038 |
| `banddust` | 240 | 1px, gaussian σ≈7 about the band | 0.013–0.051 |
| `wisp` | 3 | 28–40% × 3.5–5.5% | 0.051–0.077 |

**Airglow, bandwash opacity, banddust opacity, wisp opacity and nebula
opacity are numerically identical to marketing's.** Only `colorDrift` and
`nebulosity` intensities differ, plus counts and element sizes.

### 2.4 Animation

The app has **no freeze rule anywhere**. A repository-wide grep for `wk-sky`
in app and package CSS outside `TwoLayerSky.css` returns nothing. Therefore:

**All 571 stars animate, plus 15 non-star elements** (2 washes, 6 lobes, 1
airglow, 1 nebula, 2 shooters, 3 wisps) — 586 animating elements against
marketing's 138, in a field one third the size.

Reduced motion (`TwoLayerSky.css:204-230`) freezes stars, nebula, washes,
lobes, airglow and wisps and hides shooters, under both the media query and
the `[data-wk-motion='reduced']` harness attribute.

### 2.5 Which dark surfaces share the implementation, and which do not

`TwoLayerSky` is consumed at exactly five production sites, all at
`volume="spectacle"`, i.e. **one identical field**:

| Surface | File:line | Sky |
|---|---|---|
| `/start` canvas phase | `apps/app/src/app/start/SentenceCanvas.tsx:426,428` | yes (2 during cross-fade) |
| `/start` stage phase | `apps/app/src/app/start/StartCanvas.tsx:274` | yes |
| `/start/status` (4 states) | `apps/app/src/app/start/status/ReturnStatus.tsx:123,134,153,168` | yes |
| Onboarding Arrival | `apps/app/src/app/onboarding/OnboardingFlow.tsx:676` | yes |
| dev harness / sky-lab / canvas-lab | `dev/harness/**` | yes |

**Every other dark surface in the app has no sky at all — a flat colour and
nothing else:**

| Surface | File:line | Ground | Sky |
|---|---|---|---|
| Recap zone 1 | `(app)/recap/recap.css:12` | `#101830` flat | **none** |
| Recap zone 3 | `(app)/recap/recap.css:124` | `#101830` flat | **none** |
| Keepsake artifact | `w/[token]/shared-week.css:22` | `#101830` flat | **none** |
| Keepsake page field | `w/[token]/shared-week.css:7,126` | `#0C1020` flat | **none** |
| BeforeYourYear | `packages/ui/src/BeforeYourYear/BeforeYourYear.css:5` | `#101830` flat | **none** |
| Plan threshold | `(app)/plan/plan.css:462` | planetarium gradient (hex literals) | **none** |
| Instrument night menu | `packages/ui/src/Instrument/Instrument.css:100` | `#0B1226` flat | **none** |

The Arrival uses hex literals rather than the tokens
(`arrival.css:1`), so a token change would not reach it.

### 2.6 A fourth star field: the Generation Spectacle

`apps/app/src/app/generate/spectacle/GenerationSpectacle.tsx:196-266` carries
its own star field, unrelated to `TwoLayerSky`: 289 stars per 1440×640 of
viewport, clamped to 120–480, in three depth tiers (24 anchor : 65 medium :
200 soft), plus **one saffron signature star at 38%/20%** — authorized by Amy
on 2026-07-12 as a canon amendment, and the only saffron in any Wizkoo sky.
Positions are `Math.random()`, so it is non-deterministic. It is drawn to
canvas at `STAR_DIM = 0.5`. It is a 1:1 port of the *marketing footer's* field
(`components/footer.js:409`, Treatment B, `count = 289`), not of the hero.

---

## 3. THE DELTA, ITEMIZED

### 3.1 Ground

| Property | Marketing `.linen-hero` | App `.wk-start` |
|---|---|---|
| Gradient layers | **7** | **1** |
| Base stops | `#1e3060` 0% → `#131e3a` 60% → `#0d1627` 100% | `#182848` 0% → `#101830` 70% |
| Anchor | `at 50% 45%` | `at center` (50%/50%) |
| Falloff to the edge | continues to the farthest corner | **stops at 70%; outer 30% is flat** |
| Centre : edge luminance | **1.418 : 1** | **1.201 : 1** |
| Vignette | yes, the third stop | no |
| Warm mid-band | yes, `#131e3a` at 60% + brown wash at 4% | no |
| Gold in the ground | yes, `#E8AF38` @6% at 62%/52% | **no** |
| Cool directional washes | 4 (blue ×3, purple ×1), 10–18% alpha | none |
| Film grain | yes, `opacity:0.038` | **no** |
| Token or literal | literals only, no tokens | tokens |

**Are they the same colours under different names? No.** They are four
distinct values.

| | Marketing | App | Relation |
|---|---|---|---|
| Lightest | `#1e3060` (30,48,96) | `#182848` (24,40,72) | marketing is **1.147:1 lighter** |
| Darkest | `#0d1627` (13,22,39) | `#101830` (16,24,48) | marketing is **1.029:1 darker** |

Marketing's centre is lighter *and* its edge is darker. `#1e3060` is not a new
colour to the app, though: it is `ambientSky.nebula.colors[0]`
(`tokens.ts:137`) — the app already ships that exact hex as a nebula fill.

### 3.2 Field

| Property | Marketing (orbital) | App (spectacle) | Ratio |
|---|---|---|---|
| Aperture (ruled frame) | 1440×996 = 1,434,240px² | 1232×420 = 517,440px² | 2.77× |
| **Total stars** | **1,834** | **571** | **3.21×** |
| far faints / dust | 541 / 480 | 170 / 150 | 3.18× / 3.20× |
| near anchors | 12 (ruled by eye, not area) | 9 | 1.33× |
| near brights | 98 | 30 | 3.27× |
| near mids | 490 | 130 | 3.77× |
| near faints | 200 | 55 | 3.64× |
| filigree clusters / stars | 1 / 13 | 2 / 27 | 0.5× / 0.48× |
| Nebulae | 4 | 1 | 4× |
| Nebulosity lobes | 4 (34–56% wide) | 6 (14–36% wide) | fewer but ~2× larger |
| Milky Way dust | 480 | 240 | 2× |
| Wisps | 2 | 3 | 0.67× |
| Shooters | 2 @ 50–90s | 2 @ 50–70s | same count |
| Content hole | **removed** | **present** (superellipse 18.7) | — |
| Twinkle delay | random | **positional wave** | — |
| far twinkleScale | 1.3 (near) / 0.55 (far) | 1.0 (near) / 0.55 (far) | near 1.3× faster |
| Star sizing | `max(1px, calc(--u × n))` | literal px | — |

### 3.3 Atmosphere intensity

| Intensity | Marketing | App | Ratio |
|---|---|---|---|
| colorDrift | **60** | **35** | **1.71×** |
| nebulosity | **64** | **45** | **1.42×** |
| airglow | 56 | 56 | 1.00× |
| milkyWay | 21 | 21 | 1.00× |
| wisps | 32 | 32 | 1.00× |

Compounded with geometry, the drift washes are the real gap: marketing's are
**62%×96% and 58%×100%** of the frame at 0.216/0.180 opacity; the app's are
**44%×78% and 44%×82%** at 0.119/0.105. Roughly 1.7× the area at 1.8× the
opacity.

### 3.4 Motion and cost

| Property | Marketing | App | Ratio |
|---|---|---|---|
| DOM nodes in the sky | **2,349** (2,348 + root) **[live]** | **860** | 2.73× |
| Animating stars | **123** | **571** | **0.22×** |
| Frozen stars | 1,711 (93%) | 0 (0%) | — |
| Animating non-star | 15 | 15 | 1.00× |
| **Total animating elements** | **138** | **586** | **0.24×** |
| Illustration DOM nodes | 488 (`.orb-stage`) | n/a | — |

**The app animates 4.2× as many elements as the marketing section, in a field
one third the size.** The marketing sky is the richer *picture* and the
cheaper *animation*.

### 3.5 What the app has that marketing does not

- The content hole — legibility by absence of stars behind the sentence.
- Two filigree clusters instead of one, and four candidate zones instead of a
  fixed lower-left one.
- Positional-wave twinkle in the near layer.
- Six nebulosity lobes in three paired patches (base + second colour) rather
  than four independent ones.
- Three wisps rather than two.
- Deterministic sizing that does not float with viewport (a defect at small
  viewports, a virtue for pixel-stable snapshots).
- A reduced-motion frozen frame that is actually reachable: the marketing
  section's blanket `!important` freeze means the primitive's reduced-motion
  rule is redundant for 93% of its stars.

---

## 4. WHAT IS TRANSFERABLE — AND THE SUN CASE

### 4.1 The sun case, answered

**The field's quality is not separable from the light source, and the light
source is not in the sky.**

The evidence is threefold and each part is independent:

1. **Measurement.** The gold reaching the upper-right of that section comes
   from a 396px-wide three-ring corona centred on the nucleus at 76.1%/50.0%,
   rendered inside `.orb-stage` **[live]**. The sky's own gold is one ellipse
   at 6% peak alpha. Remove the illustration and 100% of the corona and 100%
   of the seven node halos go with it; the ground keeps a 6%-alpha wash with
   nothing to justify it.
2. **Declared intent.** `css/orbital.css:17-24` states that the nucleus is the
   **only** light in the frame and that nothing may imply another one. The
   ground gradient was composed *under* that law — its gold sits at 62%/52%,
   fourteen points inboard of the nucleus, precisely so it reads as spill from
   the nucleus rather than as a second source.
3. **The reversal already tried.** Round 4 of the orbital lab tested an
   asymmetric corona anchored to the nucleus's hot region; it measured 9.6
   lopsided and read as "a pale halo off the shoulder" — a second object. The
   file's standing instruction is: *"Do not re-anchor it. If the page's own
   light direction seems to argue for an asymmetric corona, that is a report,
   not a fix."* The lab has already proven that a light-like gradient without
   a body reads as an object, not as light.

**Therefore: copying the seven-layer ground onto `/start` produces a surface
with a warm patch at 62%/52% and nothing there.** The app's planetarium
surfaces host the `OrbitalLoader` — which *is* a lit nucleus with a 3.5s
breath, a 7.3s halo and saffron glow — so the app is not without a candidate
light. But it is 96px, centred, present only during the wait, and absent
entirely from Recap, keepsake, BeforeYourYear and the threshold. **A gradient
composed around a 396px off-centre light cannot be inherited by a surface
whose light is a 96px centred one, and cannot be inherited at all by the four
surfaces with no light.**

### 4.2 Element by element

| Element | Verdict | Why |
|---|---|---|
| **Base 3-stop radial** `#1e3060 → #131e3a → #0d1627` | **Adapt** | Pure atmosphere, no light bearing. Moves as a shape. But it changes both gradient stops — see §5, this is the blocker. |
| **The vignette** (third stop reaching the corner) | **Move as-is** | Adding a third stop to the app's expression is one declaration and depends on nothing. Same caveat as above. |
| **Four cool directional washes** | **Adapt** | Their positions (6%/18%, 78%/20%, 22%/72%, 42%/85%) are composed around the left text column and right orbital zone. `/start` is centre-weighted; they would need re-placing. |
| **Gold wash at 62%/52%** | **Inseparable** | It is the nucleus's spill. See §4.1. Also collides with the ruled no-saffron-in-the-sky clause (§7b). |
| **Warm brown wash at 28%/42%** | **Adapt** | Weakest layer (4%). Carries no light bearing; safe but nearly invisible on its own. |
| **Film grain** (`::before`, 0.038) | **Move as-is** | One data-URI rule, self-contained, no dependency on light or layout. The cheapest real gain in this report. |
| **Higher star density** (3.21×) | **Adapt, and it is ruled** | Only a FIELD-constant change; the app's own primitive accepts it. But it reverses the ruled volume ladder (§7b) and, without a freeze rule, would put ~1,800 animating elements on the loader's surface (§6). |
| **Freeze rule** (mid/faint/dust `!important`) | **Move as-is, and it is the precondition** | Density without it is unaffordable. But it must be reconciled with the ruled reduced-motion behaviour and with the two-layer law's "atmosphere always breathes" clause. |
| **colorDrift 60, nebulosity 64** | **Move as-is** | Two integers in `ambientSky.atmosphere`. Nothing else changes. This is the highest ratio of visible atmosphere to change surface in the report. |
| **Larger drift-wash geometry** (62%×96%) | **Adapt** | `buildColorDrift` is the app's own function; widening it is a literal change. Positions are composed around a two-column layout. |
| **4 nebulae instead of 1** | **Move as-is** | `ambientSky.nebula.count`. Edge-hugging by construction, so layout-independent. |
| **480 Milky Way dust instead of 240** | **Move as-is** | One literal in `buildMilkyWay`. |
| **Removing the content hole** | **Do not move** | Marketing removed it because its aperture was 620×376 and a hole would have emptied it. `/start` has a sentence in the centre and no `.lw-typewash` equivalent. Removing the hole puts stars behind the sentence with nothing carrying legibility. |
| **Random twinkle delay** | **Adapt** | Marketing's reason ("a wave reads as synchronized") was given for a 620×376 window. `/start` is full-viewport, where the wave was ruled to ship. Re-deciding this is a ruling. |
| **`--u` viewport-scaled sizing** | **Adapt, with a cost** | Real improvement over literal px, but it would change every rendered star size and therefore every visual snapshot in `packages/ui`. |
| **Corona / nucleus / node halos** | **Inseparable** | It is the illustration. |
| **The 12-anchor count** | **Adapt** | Ruled by eye at 12 for a 1440-wide canvas, explicitly *not* scaled by area (`js/orbital-sky.js:33-38`). The reasoning — "nothing in the sky out-argues the system on it" — applies verbatim to the loader. |

### 4.3 The honest summary of the delta's size

The founder judged the marketing sky "substantially better". Measured, the gap
splits three ways, and only one of the three is about the sky:

- **~40% of it is the illustration.** A 396px lit corona, seven glowing nodes,
  and a declared light law. The app's planetarium has a 96px loader during the
  wait and nothing at all on four of its seven dark surfaces.
- **~35% of it is the ground.** Seven layers versus one, 1.418:1 versus 1.201:1
  dynamic range, a real vignette, a warm mid-band, and grain. This part is
  genuinely transferable and cheap.
- **~25% of it is the field.** 3.21× stars and 1.71×/1.42× atmosphere. This
  part is transferable, is a handful of constants, and is the part that is
  already ruled the other way.

These proportions are the author's apportionment of measured quantities, not a
measured quantity themselves, and are offered as a reading rather than a
finding.

---

## 5. THE CONTRAST CONSEQUENCE

### 5.1 What the guard actually asserts

`apps/app/src/app/start/__tests__/planetarium-contrast.test.tsx`, 357 lines,
five tests. Verified green at `2b52ccd`: **5 passed / 5**.

1. **Line 298 — a hard structural assertion:**
   ```js
   expect(GRADIENT_STOPS).toEqual(['--color-planetarium-glow', '--color-planetarium-base'])
   ```
   `GRADIENT_STOPS` is built at line 71 by regexing `var(--color-planetarium-[a-z]+)`
   out of the `.wk-start { … }` rule read from `start.css` on disk.
2. **Line 301** — `globals.css`'s `body { color }` must equal
   `--color-planetarium-base` (both `#101830`). This is the defect stated as an
   invariant, not a target.
3. **Lines 304-320** — renders the real `StartCanvas`, completes the sentence,
   submits to reach `data-phase='stage'`, then walks every element under
   `main.wk-start` that carries its own text node and has not painted its own
   background, resolves its colour by a mini-cascade over `start.css`, and
   asserts ≥ 4.50:1 against **both** gradient stops. No declaration anywhere in
   the ancestry fails as "inherits the body colour".
4. **Lines 322-334** — the same audit against `ReturnStatus` at
   `data-phase='status-building'`.
5. **Lines 336-356** — `.wk-start__beats` must carry an explicit colour, and
   the loader label's `rgba(248,244,233,0.85)` and the failure line's
   `var(--color-warm-chalk)` must be unchanged.

### 5.2 Would it still hold if the gradient's stops changed?

**No. It breaks structurally before it evaluates a single ratio.**

| Change | Test 1 | Test 3/4 |
|---|---|---|
| Token **values** change (e.g. `--color-planetarium-base: #0d1627`) | **FAILS** at line 301 — `body`'s `#101830` no longer equals the base token | would re-evaluate correctly against the new values; the guard self-tracks values |
| Stops become **hex literals** (marketing's `#1e3060`/`#131e3a`/`#0d1627`) | **FAILS** — regex finds no `var(--color-planetarium-*)`, `GRADIENT_STOPS` is `[]` | **silently passes vacuously** — the `for (const stop of GRADIENT_STOPS)` loop at line 223 never runs, so *every* element passes unchecked |
| A **third stop** is added (still tokens) | **FAILS** — array is length 3, not 2 | would evaluate against all three, correctly |
| **Overlay gradients** are stacked above the base | passes if the base keeps its two tokens | **not evaluated at all** — line 70's regex matches the first `.wk-start{…}` block and line 71 collects only planetarium tokens; overlay colours are invisible to the guard |
| `at center` → `at 50% 45%` | passes | passes; the guard has no notion of geometry |

The vacuous-pass case is the dangerous one. A change to hex literals turns a
guard that failed red on the real defect into a guard that passes on anything,
while still reporting 5/5 green.

**And a second structural limit, independent of the stops:** the guard runs on
**two** surfaces — `/start` at `data-phase='stage'` and `/start/status` at
`data-phase='status-building'`. It does not run on the `/start` **canvas**
phase (`completeSentence` is called, then submit moves past it before
`auditSurface` is called), nor on the Arrival, Recap zones 1 and 3, the
keepsake, BeforeYourYear, the plan threshold, or the Instrument night menu.
**Seven of the app's nine dark surfaces are ungoverned.**

### 5.3 Every text colour on the app's planetarium, against the marketing stops

Backgrounds compared: the app's two current stops; marketing's three base
stops; the gold wash composited over marketing's light stop
(`rgba(232,175,56,0.06)` over `#1e3060`); and a strict lightness upper bound —
all six overlays applied at peak alpha over `#1e3060`. Translucent foregrounds
are alpha-composited over each background, WCAG 2.1 relative luminance, same
arithmetic as the shipped guard.

Surfaces surveyed: `start.css`, `arrival.css`, `recap.css` zones 1/3,
`shared-week.css`, `BeforeYourYear.css`, plus the DS v1.4 display jewels.

| Text colour | app glow | app base | mkt 0% | mkt 60% | mkt 100% | gold wash | all-overlay bound |
|---|---|---|---|---|---|---|---|
| `#F8F4E9` warm chalk | 13.31 | 15.99 | 11.60 | 14.99 | 16.46 | 10.51 | 9.54 |
| `#FAFAFA` cream white | 14.01 | 16.83 | 12.22 | 15.79 | 17.33 | 11.07 | 10.04 |
| `rgba(248,244,233,.97)` | 12.60 | 15.07 | 11.01 | 14.16 | 15.50 | 10.00 | 9.09 |
| `rgba(248,244,233,.85)` loader label | 9.99 | 11.74 | 8.82 | 11.11 | 12.04 | 8.09 | 7.40 |
| `rgba(248,244,233,.82)` | 9.40 | 10.99 | 8.33 | 10.41 | 11.26 | 7.65 | 7.02 |
| `rgba(248,244,233,.78)` | 8.64 | 10.04 | 7.69 | 9.54 | 10.27 | 7.09 | 6.52 |
| `rgba(248,244,233,.62)` | 6.02 | 6.75 | 5.46 | 6.50 | 6.87 | 5.11 | **4.76** |
| **`rgba(248,244,233,.55)`** | 5.06 | 5.58 | **4.63** | 5.40 | 5.65 | **4.38 ✗** | **4.11 ✗** |
| `rgba(250,250,250,.85)` | 10.50 | 12.34 | 9.27 | 11.67 | 12.65 | 8.49 | 7.77 |
| `rgba(250,250,250,.75)` | 8.50 | 9.81 | 7.58 | 9.34 | 10.03 | 7.01 | 6.46 |
| `rgba(250,250,250,.72)` keepsake caption | 7.95 | 9.13 | 7.11 | 8.71 | 9.32 | 6.60 | 6.09 |
| `rgba(250,250,250,.62)` keepsake parentline | 6.28 | 7.06 | 5.70 | 6.79 | 7.18 | 5.34 | **4.97** |
| **`rgba(250,250,250,.55)`** shared see-label | 5.27 | 5.82 | **4.83** | 5.64 | 5.90 | 4.56 | **4.27 ✗** |
| **`rgba(250,250,250,.5)`** keepsake eyebrow | 4.62 | 5.03 | **4.26 ✗** | **4.90** | 5.08 | **4.05 ✗** | **3.82 ✗** |
| `#E8AF38` saffron | 7.40 | 8.88 | 6.45 | 8.33 | 9.15 | 5.84 | 5.30 |
| `rgba(232,175,56,.9)` arrival crossing eyebrow | 6.25 | 7.39 | 5.49 | 6.97 | 7.58 | 5.03 | **4.59** |
| **`rgba(232,175,56,.85)`** program surprise | 5.72 | 6.70 | 5.05 | 6.35 | 6.87 | 4.65 | **4.26 ✗** |
| **`rgba(232,175,56,.82)`** arrival input / instrument | 5.42 | 6.32 | **4.80** | 5.99 | 6.47 | **4.43 ✗** | **4.07 ✗** |
| **`rgba(232,175,56,.8)`** submit-not-ready / arrival action | 5.22 | 6.07 | **4.64** | 5.76 | 6.21 | **4.29 ✗** | **3.95 ✗** |
| `#F4DD99` marquee sun | 10.90 | 13.09 | 9.50 | 12.28 | 13.48 | 8.61 | 7.81 |
| `#E4A08C` arrival error | 6.76 | 8.12 | 5.89 | 7.62 | 8.36 | 5.34 | **4.85** |
| `#E09BAA` display Garnet | 6.57 | 7.90 | 5.73 | 7.41 | 8.13 | 5.19 | **4.71** |
| `#85C19A` display Emerald | 7.03 | 8.44 | 6.13 | 7.92 | 8.69 | 5.55 | 5.04 |
| `#DAA57A` display Stone | 6.72 | 8.07 | 5.86 | 7.57 | 8.31 | 5.31 | **4.81** |
| `#76BCDD` display Mist | 6.97 | 8.37 | 6.08 | 7.85 | 8.62 | 5.51 | 5.00 |

**Already failing today at the app's own stops — carried forward and made
worse, not caused, by the proposed sky:**

| Text colour | Where | app glow | app base | mkt 0% | all-overlay bound |
|---|---|---|---|---|---|
| `rgba(248,244,233,.46)` | arrival hover states | 3.98 ✗ | 4.28 ✗ | 3.70 ✗ | 3.35 ✗ |
| `rgba(248,244,233,.45)` | `.wk-arr__step`, `.wk-arr__back` | 3.87 ✗ | 4.15 ✗ | 3.61 ✗ | 3.28 ✗ |
| `rgba(248,244,233,.38)` | overlay placeholder, ledger line, cap | 3.18 ✗ | 3.33 ✗ | 3.00 ✗ | 2.77 ✗ |
| `rgba(248,244,233,.34)` | grade ghost-inline | 2.82 ✗ | 2.92 ✗ | 2.68 ✗ | 2.51 ✗ |
| `rgba(248,244,233,.30)` | `.cl-ghost` family, arrival ghost | 2.50 ✗ | 2.55 ✗ | 2.40 ✗ | 2.26 ✗ |
| `rgba(248,244,233,.22)` | committed-slot caption | 1.95 ✗ | 1.94 ✗ | 1.90 ✗ | 1.83 ✗ |
| `rgba(250,250,250,.45)` | `.wk-arr__child-age` | 4.02 ✗ | 4.32 ✗ | 3.74 ✗ | 3.39 ✗ |
| `rgba(250,250,250,.42)` | `.wk-keepsake__blocks` | 3.69 ✗ | 3.93 ✗ | 3.46 ✗ | 3.16 ✗ |
| `rgba(250,250,250,.4)` | `.wk-shared__producttail` | 3.48 ✗ | 3.68 ✗ | 3.27 ✗ | 3.01 ✗ |
| `rgba(250,250,250,.28)` | `.wk-arr__child-sep` | 2.41 ✗ | 2.45 ✗ | 2.32 ✗ | 2.21 ✗ |
| `rgba(232,175,56,.55)` | `.cl-ghost`, unset grade | 3.19 ✗ | 3.50 ✗ | 2.93 ✗ | 2.63 ✗ |
| `rgba(114,136,180,.7)` | `.cl-program__preview` | 2.75 ✗ | 3.08 ✗ | 2.49 ✗ | 2.17 ✗ |
| `#101830` inherited body | the WP-29 defect class | **1.20 ✗** | **1.00 ✗** | 1.38 ✗ | 1.68 ✗ |

Twelve values already fail today. None sits on a surface the guard covers, so
none has ever been red. Several are legitimately decorative (`.cl-ghost` is
ghost text by design), but `.wk-keepsake__blocks`, `.wk-shared__producttail`
and `.wk-arr__child-age` are content.

### 5.4 The blockers, named in advance

**Six colours currently passing would cross below 4.50:1 under the marketing
gradient.** Ordered by how easily they fall:

| # | Colour | Site | Falls below 4.50 at |
|---|---|---|---|
| 1 | `rgba(250,250,250,.5)` | `.wk-keepsake__eyebrow` (`shared-week.css:24`) | **the marketing centre stop itself — 4.26:1** |
| 2 | `rgba(232,175,56,.8)` | `.cl-submit[data-ready='false']` (`start.css:306`), `.wk-arr__action` (`arrival.css:506`) | gold wash 4.29, bound 3.95; 4.64 at centre |
| 3 | `rgba(232,175,56,.82)` | `.wk-arr__input` (`arrival.css:191`), `.wk-arr__instrument` (`:324`) | gold wash 4.43, bound 4.07; 4.80 at centre |
| 4 | `rgba(248,244,233,.55)` | `.wk-arr__caption` (`arrival.css:1151`) | gold wash 4.38, bound 4.11; 4.63 at centre |
| 5 | `rgba(250,250,250,.55)` | `.wk-shared__seelabel` (`shared-week.css:145`) | bound 4.27; 4.83 at centre |
| 6 | `rgba(232,175,56,.85)` | `.cl-program__surprise` (`start.css:726`) | bound 4.26 |

Four more land in the 4.5–5.0 warning band under the all-overlay bound and
should be treated as at risk: `rgba(248,244,233,.62)` 4.76,
`rgba(250,250,250,.62)` 4.97, `#E09BAA` display Garnet 4.71, `#DAA57A` display
Stone 4.81, `#E4A08C` arrival error 4.85, `rgba(232,175,56,.9)` 4.59.

Two structural notes on this table:

- **Saffron is the fragile family.** Every gold-on-planetarium value is
  compressed by the marketing gradient's own gold wash — foreground and
  background moving toward each other. `OPEN_RULINGS #15` already has
  garnet-on-planetarium open as an unresolved contrast question (Notion
  `3ba335a8d3328144bbbbd8d7f5491deb`); the marketing gold wash extends that
  question to the entire saffron set.
- **The all-overlay bound is deliberately pessimistic.** No single point on the
  marketing section receives all six overlays at peak alpha. It is the ceiling,
  not a location. The gold-wash column is the realistic worst case for any text
  sitting in the section's centre-right.

### 5.5 The six dark-surface roots that declare no colour

**Filed and Open**, Notion Open Items Registry v2, page
`3ba335a8-d332-81af-b409-e82c1377e26c`, "No dark-surface root declares a text
color — six stylesheets one element away from the invisible-copy defect".
Owner Claude-command, Priority High, Track Design, added 2026-08-12, source
"WP-29 neighborhood audit". Its text names them:

> not `.wk-start`, `.wk-arr`, `.wk-recap__zone--1/3`, `.wk-shared`,
> `.wk-keepsake`, or `.wk-beforeyear`. Each is one unstyled text element away
> from reproducing the invisible-copy defect (text inherits body `#101830`,
> which IS planetarium-base, 1.00:1). … Needs a design ruling before a lane.
> WP-29's runtime guard catches the class on `/start` only.

An independent sweep of every CSS rule in `apps/app/src` and `packages/ui/src`
whose block declares a planetarium-family background found **21 such rules, 18
of which declare no `color`**. All six filed roots are confirmed. The sweep
also found **four dark roots the filed item does not name**:

| Root | File:line | Declares colour |
|---|---|---|
| `.cl-canvas` | `apps/app/src/app/start/start.css:129` | no |
| `.wk-shared__below` | `apps/app/src/app/w/[token]/shared-week.css:121` | no |
| `.wk-plan__threshold` | `apps/app/src/app/(app)/plan/plan.css:462` | no |
| `.wk-inst[data-material='night'] .wk-inst__menu` | `packages/ui/src/Instrument/Instrument.css:100` | no |

`.cl-canvas` and `.wk-shared__below` sit in stylesheets the filed item already
counts, so "six stylesheets" remains accurate. `plan.css` and `Instrument.css`
are **two stylesheets outside the filed scope**, which makes the true figure
**eight stylesheets, ten roots**. Offered as an addition to the filed item, not
a correction of it.

**Why a richer sky raises the cost of this gap.** The defect is that an
undeclared element inherits `#101830` and lands at 1.00:1 on `--color-planetarium-base`.
Change the ground to marketing's stops and the same undeclared element lands at
**1.38:1 at the centre stop, 1.03:1 at the edge, 1.68:1 under the overlay
bound** — still invisible, still catastrophic, but *no longer exactly 1.00:1*.
The pathology stops being a perfect colour match and becomes a near-match,
which is harder to spot by eye and harder to assert on: the WP-29 guard's own
line-301 invariant (`body color === planetarium-base`) is the thing that makes
the defect legible as a defect, and it is the first assertion a token change
breaks. **A richer sky does not fix the ten undeclared roots; it removes the
single clearest signature by which they can be found.**

---

## 6. PERFORMANCE AND MOTION

### 6.1 Node counts and what each animates

| | Marketing `.orb-sky` | App `.wk-sky` |
|---|---|---|
| DOM nodes | **2,349** **[live]** | **860** |
| Stars | 1,834 | 571 |
| Milky Way dust points | 480 | 240 |
| Filigree stroke `<line>`s | 12 **[live]** | 27 |
| Animating stars | **123** | **571** |
| Animating non-star | 15 | 15 |
| **Total animating** | **138** | **586** |
| Illustration nodes alongside | 488 (`.orb-stage`) | 0 (loader is ~20 nodes) |

Every animation on both sides is opacity-only, `ease-in-out`, except the
shooters (`linear`, with a `translate`) and the drift/wisp washes (which add a
small `translate`). Both stylesheets set `will-change: opacity` on every star,
which is what makes node count and *layer* count the same number.

The marketing repository records the cost directly at `index.html:2151-2159`:

> ~2,300 layers held scroll through this section at 12fps. Freezing the dim
> tiers … halves frame time (24fps measured, 36fps if every tier freezes).

That is the measured basis for the 93% freeze. **24fps with 138 animating
elements out of 2,349 nodes** is the marketing section's shipped state.

### 6.2 Would the marketing field compete with the loader's breath?

The `OrbitalLoader`'s breath is `wk-orbital-breathe` on `.core-hot` at **3.5s**
and `.core-soft` at 3.5s with a 0.4s delay, plus `wk-orbital-halo-breathe` at
**7.3s alternate** (`packages/ui/src/OrbitalLoader/OrbitalLoader.css:89,94,148`).
It is a warm saffron pulse — `rgba(255,214,120,0.65)` hot,
`rgba(232,175,56,0.28)` soft — at 96px, centred, opacity-only. Its file header
states the design intent plainly: *"The lit core's 3.5s luminance breath is the
only CSS animation."*

**Yes, it would compete — on three axes, and one of them is decisive.**

1. **Period overlap (severe).** The marketing near layer's twinkle durations
   measured **[live]** span **1.93s–6.95s**, with anchors and brights — the
   only tiers that animate — sitting at (4–7s)÷1.3 = **3.1–5.4s** and
   (2.5–5.5s)÷1.3 = **1.9–4.2s**. The loader breathes at 3.5s. **The loader's
   period sits inside the animated band, not outside it.** 110 near-layer
   stars would pulse on periods bracketing the loader's own. The app's current
   field is worse still on this axis (near `twinkleScale` 1, so 4–7s and
   2.5–5.5s, straddling 3.5s with all 571 stars live), which is an existing
   condition the founder should know about before attributing the problem to a
   change.

2. **Colour overlap (moderate).** `ambientSky.colors.warm` is
   `['#FFF6E4', '#F5EFD9']` at `warmShare: 0.22` — 22% of anchors, brights and
   mids are warm cream, which is the loader's own family. At marketing density
   that is ~132 warm stars against the app's ~37.

3. **Spatial overlap (decisive, and the reason the app's field is built the way
   it is).** The loader sits dead centre. The app's field has the exponent-6
   content hole at semi-axis 18.7 — the loader breathes inside a genuinely
   star-free region. **Marketing removed the hole.** Porting the marketing
   field as-is would put ~1,800 stars *behind and around* the loader with no
   clearing at all. This alone disqualifies a verbatim port.

### 6.3 At what density does it stop competing?

Two answers, because two different mechanisms are at work.

**On period:** density is the wrong lever. A single star pulsing at 3.5s in the
loader's neighbourhood competes; ten thousand pulsing at 40s do not. The
separation that matters is temporal, and the marketing field has already
demonstrated the mechanism — `twinkleScale`. Marketing's far layer divides by
0.55 (durations 5.5–18s, well clear) and its near layer by 1.3 (1.9–5.4s, right
on top of the loader). Whichever density is chosen, **anything animating within
roughly 2.5–5.0s of the loader's 3.5s is in its band**, and the existing
`twinkleScale` knob moves it out without touching a single count.

**On spatial competition, density does have a threshold, and it is the freeze
ratio, not the star count.** Marketing runs 1,834 stars at 123 animated. The
app runs 571 at 571 animated. The marketing section is measurably calmer
*because* of the freeze, not despite the density. **A field of any size at
marketing's 6.7% animation ratio puts fewer moving objects on screen than the
app ships today**: 1,834 × 6.7% = 123, against the app's current 571. The
crossover is at **~2,060 stars** — above that the frozen field animates more
elements than the app's current unfrozen one.

**Reported, not resolved:** the two-layer law's ratified text says *"ATMOSPHERE
(the dust tier) always breathes … constant — no beat-coupling to the
choreography"*, and the marketing section's `!important` freeze stops the dust
tier entirely. Whether a freeze rule can be imported into the product without
contradicting that clause is a founder question, not a lane decision.

**Node budget.** `ambientSky.elementCeiling = 900` (`tokens.ts:158`), described
as the "lab-proven full-stack budget (FINAL + atmosphere ~830)". The app is at
829 against a ceiling of 900. **The marketing field's geometry count is
~2,340 — 2.6× the app's declared ceiling.** Raising the app toward marketing
density means the ceiling token is superseded, which is itself a ruling.

---

## 7. TWO THINGS TO REPORT, NOT RESOLVE

### 7a. Is the library's star field the same implementation?

**No. It is a cousin, and a distant one.** The library field is an inline
`<script>` at `library.html:236-261`, not `js/hero-sky.js`. It shares nothing
but the freeze convention.

| Property | Library (`library.html:236-261`) | Granddad (`js/hero-sky.js` @ orbital FIELD) |
|---|---|---|
| Source | inline script in the page | shared certified module |
| RNG | `Math.random()` — **non-deterministic**, a different sky every load | `mulberry32(seed)` — same seed, same sky forever |
| Total | 160, fixed | 1,834, derived from aperture area |
| Animated | first **40 by DOM index** | 123 by **class** (anchors, brights, filigree) |
| Frozen | 120, at `(lo+hi)/2` | 1,711, at `(lo+hi)/2` |
| Classes | **none** — bare `<div>` with inline styles | full `wk-sky__*` BEM, so the certified stylesheet drives them |
| Keyframe | its own `libTwinkle` (`css/library.css:155-158`) | the primitive's `wk-sky-twinkle` |
| Colour | one flat `#F0F2F8` | 6-colour palette, 22% warm share, per-class assignment |
| Size | 1 / 1.5 / 2px literal (70% / 18% / 12%) | `max(1px, calc(--u × n))`, 5 classes, 0.9–3.8 units |
| Opacity | lo 0.05–0.17, hi 0.28–0.73 | per-class ladder, dust 0.03 to anchor 1.00 |
| Placement | pure uniform `Math.random()` — **no clustering** | cluster sampler on mids and faints |
| Layers | one flat container | two depth layers (far / near) |
| Filigree / shooters / Milky Way / airglow / wisps | **none** | all present |
| Nebulae | 3 static CSS `.lib-nebula` divs, blur 80px, 3–5.5% alpha | 4 generated, animated, blur 18px |
| Halos / cross-glow | none | 110 haloed, 8 spiked |
| Reduced motion | **none — `css/library.css` contains zero `prefers-reduced-motion` rules** | designed frozen frame, media query + harness attribute |
| Positioning | `position: fixed`, whole viewport | `position: absolute`, section bleed |

The one genuinely shared idea is stated in both files in nearly the same words:
freeze the majority **at the midpoint** of the range they would have oscillated
through, so the static majority is indistinguishable from the animated
minority. That convention travelled; nothing else did.

The nearer relative of the library field is the **footer** field
(`components/footer.js:403-430`) — 52 stars in Treatment A, 289 in Treatment B,
three depth tiers and a saffron signature star — which is also the field the
app's `GenerationSpectacle` ported 1:1 (§2.6). So the ecosystem holds **four**
star fields, not two: the certified primitive (app + Granddad hero), the footer
field (marketing footer + app Spectacle), the library field, and the
`GenerationSpectacle` canvas variant of the footer field.

**The library field's missing reduced-motion guard is a finding.** The ratified
two-layer law states: *"Reduced-motion guard is MANDATORY in product
implementations."* The library is a marketing surface rather than a product
one, so whether the clause reaches it is a reading, not a fact. Reported.

### 7b. Is the sky already governed by a ruling?

**Yes — and by two rulings at different altitudes. A redesign of the app's
planetarium against marketing's sky is a founder decision, not a design
exercise.**

**Ruling 1 — the sky itself.** Decision Registry entry
`3aa335a8-d332-8120-be55-f20468d2b9a3`, *"Dark-Surface Sky — Two-Layer Law:
Structure Inert, Atmosphere Breathes"*, Boundary Tier **Red**, Status
**Active**, Source Panel Strategy, Session Date **2026-07-27**, decided *"Ruled
D by Amy, eyes-on, against a five-candidate animated board including the site's
own footer implementation as ground truth."* Four clauses bear directly on this
report:

1. **The volume ladder is ruled and ordered.** *"Volume ladder (one sky, one
   grammar, three volumes): marketing fullest, Night Letter gentle middle,
   spectacle quietest — volume set by what the foreground is doing."* The app's
   planetarium is the spectacle surface. It is *ruled to be the quietest of the
   three.* Raising it toward marketing's field does not improve the app's
   execution of the ruling — it reverses the ruling's ordering. **This is the
   single most consequential finding in this report.**
2. **Marketing was the calibration source, deliberately.** *"the marketing
   site's implementation values were the extracted calibration reference, not a
   guess."* The app's field is not an inferior attempt at the marketing sky; it
   is the marketing sky's values, dialled down on purpose, by ruling.
3. **The centre third is ruled empty**, carried forward unchanged from the
   superseded entry `3aa335a8d332812fa9bffeaef816ff52` ("star tiers, stroke
   maximums, center-third, no-saffron, chalk-opening exemption **carries
   forward unchanged into this entry**"). The app honours it; **the marketing
   hero field removes it** (`js/hero-sky.js:69-70`). Porting the marketing
   field's hole-free sampler into the product contradicts a live clause.
4. **No saffron in the sky**, from the same carried-forward set. The marketing
   *ground* carries `rgba(232,175,56,0.06)` at 62%/52%. Whether a ground
   gradient counts as "the sky" for this clause is a reading, not a fact —
   but the `GenerationSpectacle`'s single saffron star required an explicit
   authorized canon amendment from Amy on 2026-07-12, which is evidence that
   the clause is read strictly in the product.

Also ruled in the same entry, and relevant to §6: *"Reduced-motion guard is
MANDATORY in product implementations: dust freezes at 0.35 opacity, structure
unaffected."*

**Ruling 2 — the ground.** The planetarium gradient
`radial-gradient(ellipse at 50% 45%, #182848 0%, #101830 70%)` is specified in
**The Light Standard** (Notion `32d335a8d332811ab922e806deeec3fb`), which
`CLAUDE.md` §4 lane 5 names as the authority on brand-level decisions. It also
appears as the surface specification in the Generation Spectacle build
specification (`33a335a8d33281b3b44ffed0fe1a5fcd`) and in the Wizkoo Creature
Companion character standard (`35b335a8d33281129d51d3d6cc680939`, "subtle
planetarium gradient atmospheric depth `#182848` center to `#101830` edges").
**Both stops and the geometry are brand-level ruled**, and the shipped app has
already drifted the anchor from `50% 45%` to `at center`.

**On the order's pointer.** `docs/decisions/DECISION_INDEX.md:64` points at
`packages/design-tokens/src/tokens.ts:68-70` — the **dark-surface display
palette** (Candidate E: `#E09BAA` / `#85C19A` / `#DAA57A` / `#76BCDD`, DS v1.4,
locked 2026-07-27, Registry `3aa335a8d33281ce931fda860430080f`). That is
**child-identity text colour on dark surfaces, not the sky and not the
ground.** It governs four of the foreground colours in §5.3, not the surface
underneath them. `command/DESIGN_DOCTRINE.md:78-88` carries it correctly, and
lists "the **two-layer sky law**" as one of five items *"specified in Notion
and with no rendering in this repository"* — which is why the sky's governing
text is not in either repository and had to be read from the Registry.

**A note on `CLAUDE.md` §5.** That section states *"you cannot read Notion."*
It is false as of this session: the Notion MCP resolved and returned all four
pages cited above. The sky's governing ruling is reachable; a session that
believed §5 would have reported the sky as ungoverned. Reported, not fixed.

---

## 8. WHAT THIS LANE DID NOT ESTABLISH

- **No pixels.** The Browser pane would not composite, so no screenshot was
  taken of either sky. Every visual claim here rests on computed styles, DOM
  measurement and source. A founder walking the two surfaces side by side has
  information this report does not.
- **No app-side live measurement.** `/start` was not rendered in a browser;
  the app's counts are derived by re-running its own shipped generation
  algorithm, validated against the repository's own asserted
  `countGeometryElements = 829` (`TwoLayerSky.test.tsx:188`). DOM node counts
  for the app are computed from the component's render tree, not observed.
- **No mobile or small-viewport measurement.** All live figures are 1280×720.
  The `--u` floor behaviour in particular changes with viewport, and the
  marketing section has a distinct sub-768px path.
- **The 40/35/25 apportionment in §4.3 is a reading**, not a measurement.
- **No design was proposed, no CSS was written, no treatment was
  recommended.**

---

## 9. THE HYPOTHESIS, ADJUDICATED

| Claim | Verdict | Evidence |
|---|---|---|
| **(a)** Marketing sky carries a light source — gold sun lighting the upper right, field falling away from it | **REFUTED as stated; the light exists but is not in the sky and is not upper-right** | The gold is the orbital corona at **76.1% x / 50.0% y**, three rings `#FFDFA0 → #B8863A`, outer ring 396px, inside `.orb-stage` **[live]**. The sky's own gold is one 6%-alpha ellipse at 62%/52%. `css/orbital.css:17-24` declares the nucleus the only light in the frame. The strongest upper-right *sky* element is **purple** at 13% (`index.html:1057`). |
| **(b)** Star variance in size, brightness and density including clumping | **CONFIRMED, with one qualification** | 5 size classes 0.9–3.8 units, opacity ladder 0.067–0.815 measured **[live]**, cluster sampler on mids and faints (`js/hero-sky.js:72-92`). Qualification: at 1280px, **82% of stars (1,511/1,834) render at the 1px floor** — the size variance is largely collapsed and the opacity variance carries the read. |
| **(c)** Atmospheric depth — a vignette, warmer through the middle band, darker at the edges | **CONFIRMED** | `index.html:1063`: `#1e3060` 0% → `#131e3a` 60% → `#0d1627` 100%, centre-to-edge **1.418:1**. Plus 4 cool washes, a 4%-alpha warm brown wash, colorDrift 60 and nebulosity 64. |
| **(d)** App's canvas sky is evenly lit | **REFUTED** | Same primitive, same atmosphere classes: 2 drift washes, 6 nebulosity lobes, airglow, Milky Way band, 3 wisps, 1 nebula. It is lit unevenly by construction — at **1.71×/1.42× lower intensity** and over smaller geometry. |
| **(e)** App's canvas sky is uniform in star size | **REFUTED** | Identical 5-class size ladder, 2.5–3.7px anchors down to 1px dust (`skyGeneration.ts:140-170`). It is *more* uniform than marketing's only in that it does not scale with viewport. |
| **(f)** App's canvas sky is flat top to bottom | **PARTLY CONFIRMED** | The 2-stop gradient's last stop is at **70%**, so the outer ~30% of the radius *is* uniform `#101830` — and there is no third stop, no vignette, no warm mid-band, and no grain. Centre-to-edge range is **1.201:1** against marketing's **1.418:1**, 42% less. But the inner two-thirds are not flat, and the sky above it is not flat at all. |

**The founder's overall judgement holds. Its attribution does not.** The
marketing sky is substantially better, and the two largest contributors to that
are the seven-layer ground and a 396px lit corona that belongs to the
illustration. The star field — the thing that reads as "the sky" — is the same
code on both sides, dialled to a ratio that has already been ruled.

---

*End of report. Nothing in either repository was modified. Read-only lane
complete.*
