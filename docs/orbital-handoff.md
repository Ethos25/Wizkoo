# ORBITAL HANDOFF

**Written 2026-08-01, at the close of the hero atmosphere pass, for the session
that opens the orbital round.**

This is not a hero document. `docs/hero-handoff.md` holds the hero's own rulings
and stays authoritative for it. This carries forward only what the orbital round
needs: the infrastructure, the patterns that were proved on the hero and should
be reused, and the rules that bound the work. Every number here was read back out
of the file or measured, not remembered.

---

## 0. THE HARD RULE: THE HOMEPAGE IS NOT TOUCHED

**`index.html` is closed for the orbital round.** So are its fragments:

    css/hero-sky.css     css/hero-window.css
    js/hero-sky.js       js/hero-window.js

The hero went through the excellence rounds and the atmosphere pass and is
settled. It is on a branch, walked, and holding. Reopening it to make an orbital
change fit is not a fix, it is a regression against several rounds of ruling.

If orbital work appears to require a homepage change, that is a separate ruling
and it goes to Amy as one. Do not take it yourself. The one exception already on
the books is the unlicensed photograph in `docs/hero-handoff.md` section 2, and
that is a swap at a fixed path, not a design change.

There is a live gate for this. Before committing an orbital round:

    git diff --stat main -- index.html css/hero-sky.css css/hero-window.css js/hero-sky.js js/hero-window.js

Anything other than empty output means the rule was broken.

---

## 1. BRANCH AND DEPLOY

| | |
|---|---|
| Repo | `Ethos25/Wizkoo`, production branch `main` |
| Working branch | make a new one off `main`; do not build on `excellence-round-1` |
| URL form | `https://<branch>--wizkoo.netlify.app` |
| Site ID | `1050d98d-dd09-4e80-81e9-41b911a08451` |
| Local | `npm run serve`, or let the preview tool assign a port |

Branch deploys are enabled and **this is CLI/API manageable. Do not route it to
Amy.** The token is on the workstation at
`%APPDATA%\netlify\Config\config.json` under `users[userId].auth.token`. Full
detail, including the exact GET/PATCH and the `allowed_branches` semantics, is in
`INFRASTRUCTURE.md` under *Branch deploys*.

Three things that have each cost time. The third was nearly repeated this round.

1. Enabling branch deploys does **not** retroactively build an already-pushed
   branch. The subdomain stays 404 until the next build.
2. A 404 on a branch subdomain means **no deploy exists**, not "build in
   progress". A running build still serves the previous deploy.
3. **Poll on the commit ref, never on "branch is ready".** Polling for branch
   state once matched the *previous* deploy and almost reported a stale build as
   live. The pattern that works:

       GET https://api.netlify.com/api/v1/sites/<siteID>/deploys?per_page=5
       -> find the entry whose commit_ref starts with your sha
       -> require state === 'ready' on THAT entry

   Then fetch the deployed asset and grep it for a token you just introduced.
   API state is not proof that the bytes changed; the fetch is.

---

## 2. THE CERTIFIED SKY PORT PATTERN

This is the most reusable thing the hero produced. If the orbital round renders
anything generative that also exists in the product, copy this shape.

### The split: stylesheet locked, generation re-tuned

    css/hero-sky.css   BYTE-FOR-BYTE copy of the product stylesheet. Do not edit.
    js/hero-sky.js     NOT a verbatim port, and not meant to be. Re-tuned.

`css/hero-sky.css` is a byte-for-byte copy of
`packages/ui/src/TwoLayerSky/TwoLayerSky.css` @ `e1a90b2` (wizkoo-app, branch
`wp-14-spectacle`), plus the authorized primitive amendment `a62dc1d` (filigree
q3 quantize, generation-side only, no CSS change). Star rendering, twinkle curve,
nebula breath, shooter and the reduced-motion frozen frame are all the product's
own.

**Do not edit that file here, not even for house style.** An em-dash sweep once
modified a line inside it and broke the byte-for-byte guarantee. If the primitive
changes upstream, re-copy it whole and re-run the gate.

`js/hero-sky.js` is deliberately not verbatim. Cropping the certified sky
verbatim into a 620x376 aperture put **12 of 571 stars** in the window and **zero
anchor stars**, because the window sat inside the primitive's star-free content
hole. The port therefore preserves the visual language, not the bits.

### The methodology: match perceived density, not count

This is the transferable idea. What must hold across a size change is not
bit-exactness but **perceived density**, measured per unit of *starred* field
with any deliberate empty region excluded.

`scripts/sky-tuning-report.js` measures both sides and fails on drift:

- Reads the reference out of the **wizkoo-app git objects** at pin `a62dc1d`,
  from `packages/design-tokens/src/tokens.ts`. The target is read from the
  product, never remembered in this repo.
- Sums the token blocks: `far` = faints + dust, `near` = anchors + brights +
  mids + faints, `filigree` = mean(starsMin, starsMax) x clusters.
- Excludes the content hole by computing the **superellipse** area
  `|x/a|^n + |y/b|^n = 1` via a lgamma implementation, because the hole is not an
  ellipse and treating it as one overstates the density.
- Compares stars per 1000px2 of starred field.

Current, verified 2026-08-01:

    reference   1232x420, 572 stars, 69,758px2 hole excluded, exponent 6
                1.278 stars per 1000px2
    window      620x376, 297 stars, no content hole
                1.274 stars per 1000px2
    drift       0.3%   (tolerance 12%)
    anchors     4      (ruled 2 to 4)
    shooters    1 at 79s  (ruled one, 60-120s)
    PASS

### Gate discipline

The script fails hard on: density drift beyond 12%, anchors outside 2 to 4, more
than one shooter, a shooter period outside 60-120s, **and on any non-finite
value**. That last one is not decoration. An earlier version could not parse the
product tokens, produced `NaN`, and printed PASS. **Any gate that cannot compute
its comparison must fail loudly.**

One caveat to know. If `wizkoo-app` is not on the machine the script prints
`SKIPPED` and **exits 0**. That is correct for a laptop without the product
checkout, but it means a green exit code is not by itself proof the gate ran.
Read the output, or set `WIZKOO_APP` and require the PASS line. It is present on
this workstation at `%USERPROFILE%\Desktop\wizkoo-app`.

---

## 3. THE LIGHT DIRECTION, RULED BY MEASUREMENT

**The homepage photograph is lit from the UPPER RIGHT**, far more from the right
than from above. Shadows in it fall down and to the LEFT.

This matters to the orbital round only if it renders anything that shares a frame
with that photograph or has to look lit by the same source. It is recorded here
because it was the hero round's real find and because of *how* it was arrived at.

`css/hero-window.css` had asserted upper *left* and the window's entire shadow
stack had been built to match. Asserted, never tested, and wrong. Five
independent reads agree on upper right:

| method | result |
|---|---|
| Sphere shading centroid, 8 planets, discs Hough-fitted | bearing **58.7deg**, 7 of 8 positive dx |
| Specular highlight position in those discs | bearing **70.4deg**, 7 of 8 right of centre |
| Grey collars and posts of the stand | specular right face, shadow left |
| Base cone and its cast shadow on the table | lit right, shadowed left, shadow runs left |
| Table plane luminance, left to right | 62 -> 150 and 96 -> 180 |

0deg is directly overhead, positive clockwise.

**The method note is the point.** The first pass used hand-placed disc centres
and all eight spheres agreed, which is also exactly what a systematic centring
error looks like. The centres were re-solved by a radial-gradient Hough fit
before the result was trusted, and two of the five cues were chosen because they
need no centre at all. Unanimity among measurements that share a bias is not
evidence. Build at least one cue that cannot carry the bias.

---

## 4. THE MOTION LAWS

Four laws, enforced in `js/hero-window.js` and quoted from it rather than
paraphrased. They are the house rules for any beat the orbital round adds.

1. **ONCE PER SIGHT.** `IntersectionObserver` at threshold 0.5, so the beat plays
   when the element arrives before her eyes, not on mount.
2. **LATCHED.** A boolean set before the first frame; the observer disconnects on
   play. Nothing re-triggers it: not hover, not focus, not resize, not scrolling
   back.
3. **SETTLED, NOT LOOPING.** It ends on its final state and stops. No interval,
   no rAF loop, no timer left running.
4. **REDUCED MOTION.** The settled state, no beat, no timers created.

Two supporting rules that carry the same intent:

- **The settled state is what ships in the markup.** With JS disabled or motion
  reduced, the content reads correctly and the component still works. The
  animation is an enhancement over a correct static state, never the thing that
  produces it.
- **Nothing periodic may read as a loop.** The sky's single shooter is on a
  randomised 60-120s period for exactly this reason, and it is gated: more than
  one shooter, or a period outside that window, fails
  `scripts/sky-tuning-report.js`.

### One term I could not verify: the "casino test"

Amy named the casino test as one of the motion laws to carry forward. **It does
not appear anywhere in this repository.** `casino`, `slot machine` and `jackpot`
return zero matches across all source, docs and runbooks.

I am not going to write a definition I inferred and leave it here to be quoted
back as settled. What I can say is which existing rules appear to be pointing at
it: law 3 (settled, not looping), and the shooter's randomised 60-120s period
described in `js/hero-sky.js` as chosen "so it never reads as a loop". Both are
about motion that must never acquire the rhythm of a machine cycling.

**Action for the orbital session: get the wording from Amy and record it here.**
Until then treat it as undefined rather than as the two rules above.

---

## 5. THE STILL-TEST FINDING, AND WHEN AN EFFECT IS NOT WORTH SHIPPING

The atmosphere pass built a slow warm breath over the hero photograph as its
centrepiece, then cut it after it was walked. The full record is in
`docs/hero-handoff.md` section 6. The transferable finding:

**A sub-perceptual effect needs a usable gap between "invisible frame to frame"
and "visible as an effect". Measure that gap before building into it.**

The breath was swept against every ruled ceiling at its shipped geometry:

| alpha | excursion, worst px | worst CCT % | frame lum % | contrast |
|---|---|---|---|---|
| 0.115 | 4/255 | 0.60 | 0.052 | none reduced |
| 0.230 | 6/255 | 1.15 | 0.112 | none reduced |
| 0.300 | 8/255 | 1.46 | 0.160 | none reduced |
| 0.380 | 10/255 | 1.84 | 0.213 | none reduced |

The ceilings were 2-3% colour temperature and 1.5% luminance. **Neither ever
bound.** The binding test was the stills: butting the cycle's two extremes
together with no divider, the pair reads as one surface through 0.300 and
separates at 0.380. Shipped at 0.300, the largest passing value, it still read as
nothing, because the entire half-cycle swing moved **0.445/255 averaged over the
frame**, under one quantisation step across most of the picture.

Three things worth carrying:

- **The stated ceiling is often not the binding constraint.** Find which
  constraint actually binds before tuning against the one you were given.
- **Duration is not amplitude.** Compressing a 40s cycle to 11s raised the rate
  and not the excursion. At these frequencies the eye integrates, so excursion
  decides legibility.
- **Cut cleanly and keep what stands.** Removing the layer returned contrast to
  exact baseline on all four ruled text elements, removed a compositor layer, and
  left the seam, both light spills, the corrected shadow and the graded border
  ring untouched. Those were the round's real value and none of them depended on
  the effect that failed.

---

## 6. VERIFICATION INSTRUMENTS THAT PAID FOR THEMSELVES

Rebuild these rather than eyeballing. Each caught something that eyes did not.

- **Layout diff.** Snapshot `getBoundingClientRect` for every element in the
  component across the full viewport matrix, with the round's changes reverted by
  injected CSS and again with them live. Any difference at all is a failure for a
  paint-only round. Ran 232 measurements across 8 viewports.
- **Amplified frame diff.** Render two states, subtract, multiply by 20 to 60.
  This shows the *shape* of what moves when nothing is visible at true strength.
  It is how the drift was confirmed to be a coherent lobe and not noise.
- **Adjacent-crop still test.** Butt two states together with no divider. Far
  harsher than side by side, because a real difference shows as a seam.
- **Second difference through a gradient.** Sampling luminance every 10px and
  taking the second difference finds a Mach band long before it is visible. It
  is how the seam ramp was confirmed smoother than the photograph it joins.
- **Attribution by isolation.** When a metric moves, re-measure with one layer
  disabled at a time. The support line's contrast drop looked like the effect;
  isolating it proved it was compositor layer promotion, because the same build
  with the layer present but *painting nothing* measured identically.

Four harness bugs that produced confidently wrong numbers, all worth guarding
against:

1. **Cold-load paint.** `networkidle` fires before the hero photograph paints. A
   frame of bare linen inflated every contrast ratio by 30%. Wait on
   `img.complete && img.naturalWidth > 0`, then two `requestAnimationFrame`s.
2. **Polarity assumption in backdrop sampling.** Taking the bright tail of a text
   box as its background works for dark-on-light and reports nonsense for
   light-on-dark. Use the modal quantised colour instead; it is correct for both.
3. **Scroll not settled.** Smooth scrolling made every geometry read come back
   shifted. Force `scroll-behavior: auto` and assert the scroll position landed.
4. **Independent motion inside the frame.** The certified sky drifts on its own
   and is not driven by CSS animation, so pausing animations does not stop it.
   Mask its rect out of any frame-to-frame statistic.

---

## 7. THE FAILURE SHAPE THIS PROJECT KEEPS REPEATING

`docs/hero-handoff.md` section 5 records four. The atmosphere pass added a fifth,
and all five are the same shape: **a conclusion asserted without being tested.**

5. **A value not read back out of the file is not a value you know.** For three
   commits the code, the commit messages and the handoff all said the shipped
   alpha was 0.078 when the file said 0.115: a block was rewritten and the
   pre-reduction numbers typed back in while the comment above still read
   "reduced". The measurements were taken against the running build and were
   right throughout; only the label was wrong. That label then produced a worse
   error, a claim of available headroom at a value that was already shipped,
   compared against a geometry the build had abandoned. It reached Amy and she
   ruled on it before it was caught.

The guard is cheap. Before reporting any value, grep it out of the file, and for
anything deployed, out of the deployed asset.

When something is self-caught, report it plainly and in full. That is the
standard here, not an exception.
