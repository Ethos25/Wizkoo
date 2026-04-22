# Section 3 Known-Good Baseline — 2026-04-22

**Commit:** cbac52e  
**File:** `index.html`  
**Section HTML root:** `<section class="ec-section">` — line 1784

---

## 1. SECTION CONTAINER STRUCTURE

### Section wrapper
```
.ec-section          background: var(--ink) / #0C1020   padding: 0   overflow: hidden   line 567
.ec-inner            max-width: none   padding: 0                                        line 568
```

### Scenario height — cascade order
| Rule | Condition | Height | Line |
|------|-----------|--------|------|
| `.ec-scenario` | base (≥768px, any height) | `80vh` | 569 |
| `@media(max-width:767px)` | narrow viewport | `auto` (overflow visible) | 628 |
| `@media(max-height:420px) and (min-width:600px)` | landscape short | `100vh` | 643 |
| `@media(max-height:700px) and (min-width:768px)` | short wide | `100vh` | 657 |

**Notes:**
- At base (desktop ≥768px, full height): `80vh`
- At short viewports (≤700px height, ≥768px width — e.g. user's 396px display): `100vh` — snaps section to fill viewport exactly. This is critical: any value taller than the viewport allows scroll-position drift that makes padding unpredictable.
- `overflow:hidden` is set at base and in landscape query; `overflow:visible` in mobile-stack query

### Section padding
`.ec-section` has `padding:0` at all breakpoints. All internal spacing is handled by `.ec-col-copy` padding-top.

---

## 2. LAYOUT STRUCTURE

### Layout paths

| Path | Trigger | Description |
|------|---------|-------------|
| **Desktop overlay** | `min-width:768px` (base) | Photo fills full scenario, copy absolutely positioned over left ~42% |
| **Landscape short** | `max-height:420px AND min-width:600px` | Photo fills full scenario, copy absolutely positioned over left 60%, compact type |
| **Mobile stack** | `max-width:767px` | Photo stacked above, copy below (position:static) |

**Breakpoint exact values:**
- Mobile stack activates at: `max-width:767px` (line 627) — triggers at ≤767px CSS width
- Landscape short activates at: `max-height:420px AND min-width:600px` (line 642)
- Short-wide override activates at: `max-height:700px AND min-width:768px` (line 656)

**Cascade note:** The landscape query (line 642) fires AFTER the mobile query (line 627). At viewport widths 600–767px with height ≤420px, the landscape query overrides `position:static` with `position:absolute`, restoring overlay layout.

### Copy column structure (desktop overlay — base)
```
.ec-col-copy   position:absolute   top:0   left:0   width:42%   height:100%
               z-index:2   overflow:hidden   display:flex   flex-direction:column
               justify-content:flex-start   padding:172px 4% 0 7%          line 579
```

### Copy column — padding-top by breakpoint
| Condition | padding-top | Line |
|-----------|-------------|------|
| Base (≥768px, full height) | 172px | 579 |
| Mobile stack (≤767px) | 48px (padding shorthand: 48px 24px 40px) | 630 |
| Landscape short (max-h:420px, min-w:600px) | 178px | 645 |
| Short wide (max-h:700px, min-w:768px) | 96px | 658 |

**Notes:**
- At the production display (Windows 200% scaling, Chrome zoom, innerWidth≈756, innerHeight≈396), the `max-height:700px AND min-width:768px` query is the active rule. The 96px value represents the tuned minimum for nav clearance at that environment.
- The `max-height:700px` query width threshold is `min-width:768px`. If effective CSS layout width is 600–767px, the landscape query (178px) controls instead.

### Photo column structure
```
.ec-col-photo   position:absolute   inset:0   overflow:hidden             line 571
```
Photo fills entire scenario container at all desktop widths. In mobile stack, overridden to `position:relative; inset:unset; height:min(67vw,50vh); min-height:160px` (line 629).

### Column ratio
- Desktop overlay: copy 42% of scenario width (photo occupies full width behind it)
- Landscape short: copy 60% of scenario width (line 645)
- No explicit gutter between copy and photo — copy is an overlay

---

## 3. TYPOGRAPHY TOKENS

### Headline
```
font-family:  'Fraunces', serif
font-style:   italic
font-weight:  500
font-size:    28px (base)   →   28px (mobile)   →   20px (landscape short)   →   28px (short-wide)
line-height:  1.08 (base)                           1.08 (landscape short)
letter-spacing: -0.02em
max-width:    320px (base)   100% (mobile)
margin:       0 0 12px (base)   0 0 6px (landscape)   0 0 8px (short-wide)
opacity:      0 → 1 on .visible (transition: 0.8s, delay: 0.7s)
color — turtle scenario:  #F2F0EA   (line 586)
color — space scenario:   #0C1020   (line 585)
```
Lines: 584–587, 635, 649, 660

### Kicker
```
font-family:  'Fraunces', serif
font-style:   italic
font-weight:  400
font-size:    22px (base)   →   18px (mobile)   →   15px (landscape short)   →   18px (short-wide)
line-height:  1.2 (base)                             1.15 (landscape short)
color:        #E8AF38  (saffron — both scenarios)
max-width:    380px (base)   100% (mobile)
margin:       0 0 30px (base)   0 0 32px (mobile)   0 0 10px (landscape)   0 0 18px (short-wide)
opacity:      0 → 1 on .visible (transition: 0.8s, delay: 0.7s)
```
Lines: 588–589, 636, 650, 661

### Eyebrow
```
font-family:    'Space Mono', monospace
font-size:      9px
letter-spacing: 0.18em
text-transform: uppercase
margin:         0 0 12px (base and short-wide)
opacity:        0 → 1 on .visible (transition: 0.4s, delay: 0.5s)
display:        none in landscape short query (line 648)
color — turtle: rgba(242,240,234,0.7)   (line 581)
color — space:  rgba(12,16,32,0.7)      (line 582)
```
Lines: 580–583

### Proof label
```
font-family:    'Space Mono', monospace
font-weight:    (normal — not specified, Space Mono default)
font-size:      11px (base)   →   9px (short-wide, line 663)   →   8px (landscape short, line 653)
letter-spacing: 0.24em (base)   →   0.16em (landscape short)
text-transform: uppercase
display:        block
margin-bottom:  2px (base)   →   1px (landscape short)
color:          Shade 3 in turtle scenario, Shade 2 in space scenario (see §9)
```
Lines: 592, 653, 663

### Proof body
```
font-family:  'Inter', system-ui, -apple-system, sans-serif
font-size:    12.5px (base)   →   12px (short-wide)   →   10px (landscape short)
line-height:  1.4 (base)   →   1.3 (landscape short)
max-width:    100% (base)   →   200px (landscape short, to enforce 2-line wrap)
margin:       0
color — turtle: rgba(242,240,234,0.92)   (line 619)
color — space:  rgba(12,16,32,0.92)      (line 606)
```
Lines: 593, 606, 619, 654, 664

---

## 4. PROOF MATRIX STRUCTURE

### Base grid (desktop overlay)
```
.ec-proofs
  display:               grid
  grid-template-columns: 1fr 1fr
  grid-template-rows:    repeat(3, auto)
  grid-auto-flow:        column
  column-gap:            4px
  row-gap:               9px
  margin:                0
```
Line: 590

**Flow:** Items fill column 1 (rows 1–3) then column 2 (rows 1–3). Reading order left column top-to-bottom: Reading, Math, Science. Right column: Atlas, Art, Elementum.

### Mobile stack grid override
```
@media(max-width:767px)
  display: block
  .ec-proof { margin-bottom: 12px }
```
Lines: 637–638

### Landscape short grid override
```
@media(max-height:420px) and (min-width:600px)
  column-gap: 8px
  row-gap:    4px
```
Line: 651

### Short-wide override
```
@media(max-height:700px) and (min-width:768px)
  .ec-proof { margin-bottom: 8px }
```
Line: 662

### Per-item styling
```
.ec-proof
  padding-left:  16px
  margin-bottom: 0 (base)
  opacity:       0 → staggered reveal (see §8)

border-left:  2px solid [subject color]   — subject-specific, see §9
```
Lines: 591, 594–618

---

## 5. PHOTOGRAPH TREATMENT

### Container dimensions
```
Desktop overlay:  position:absolute; inset:0   (fills entire scenario)   line 571
Mobile stack:     position:relative; inset:unset; height:min(67vw,50vh); min-height:160px   line 629
Landscape short:  position:absolute; inset:0; height:auto   line 644
```

### Image base
```
.ec-photo-img
  width:      100%
  height:     100%
  object-fit: cover
  display:    block
  opacity:    0 → 1 on .visible (transition: 1.2s cubic-bezier(.25,.1,.25,1))
```
Line: 572

### object-position per scenario
```
turtle scenario:  center 55%   (line 573)
space scenario:   center 30%   (line 574)
```

### Ken Burns zoom
```
@keyframes kb-zoom { from { transform:scale(1) } to { transform:scale(1.03) } }
animation: kb-zoom 8s ease-in-out infinite alternate
Disabled by: @media(prefers-reduced-motion:reduce) { .ec-photo-img { animation:none } }
```
Lines: 570, 572, 667

---

## 6. SCRIM AND OVERLAYS

Scrim is a `::after` pseudo-element on `.ec-col-photo`.

```
.ec-col-photo::after
  content:        ''
  position:       absolute
  inset:          0
  pointer-events: none
```
Line: 576

### Turtle scenario scrim
```
background: radial-gradient(ellipse 55% 100% at 20% 50%, rgba(12,16,32,0.62) 0%, transparent 100%)
```
Line: 578 — dark vignette at 62% opacity, centered on left-center to darken behind copy area

### Space scenario scrim
```
background: radial-gradient(ellipse 55% 100% at 20% 50%, rgba(12,16,32,0.15) 0%, transparent 100%)
```
Line: 577 — light vignette at 15% opacity (space photo is light-toned)

---

## 7. NAV BACKDROP

### Scroll threshold
```javascript
nav.classList.toggle('nav--scrolled', window.scrollY > 20)   // line 1392
```
Backdrop activates after 20px of page scroll.

### Light surface (default scrolled — cream/linen sections)
```css
.page-home .nav.nav--scrolled {
  background:      rgba(242,240,234,0.45)   /* linen at 45% */
  backdrop-filter: blur(6px)
}
```
Line: 1370

### Dark surface (turtle scenario, linen-hero)
```css
.page-home .nav.nav--scrolled.nav--surface-dark {
  background:      rgba(12,16,32,0.25)   /* ink at 25% */
  backdrop-filter: blur(4px)
}
```
Line: 1371  
Applied when nav overlaps: `#linen-hero` or `.ec-scenario--turtle` (line 1385–1386)

### Light surface detection
Space scenario (`.ec-scenario--space`) is registered as a light section (line 1388–1390). When nav overlaps it, `nav--surface-dark` is removed and `nav--surface-light` is toggled — no additional CSS rule at time of baseline; inherits the default scrolled style.

### Transition
```css
.page-home .nav { transition: background-color .25s cubic-bezier(.25,.1,.25,1) }   line 1369
```

---

## 8. SCROLL REVEAL ANIMATION TIMINGS

### Photo
```
opacity: 0 → 1
transition: 1.2s cubic-bezier(.25,.1,.25,1)
trigger: .ec-scenario.visible .ec-photo-img   line 575
```

### Eyebrow
```
opacity: 0 → 1
transition: 0.4s cubic-bezier(.25,.1,.25,1)   delay: 0.5s
trigger: .ec-scenario.visible .ec-eyebrow   line 583
```

### Headline
```
opacity: 0 → 1
transition: 0.8s cubic-bezier(.25,.1,.25,1)   delay: 0.7s
trigger: .ec-scenario.visible .ec-headline   line 587
```

### Kicker
```
opacity: 0 → 1
transition: 0.8s cubic-bezier(.25,.1,.25,1)   delay: 0.7s
trigger: .ec-scenario.visible .ec-kicker   line 589
```

### Proof items (staggered)
```
transition: 0.4s cubic-bezier(.25,.1,.25,1)   (no delay in base rule)
nth-child(1): delay 1.3s   line 620
nth-child(2): delay 1.4s   line 621
nth-child(3): delay 1.5s   line 622
nth-child(4): delay 1.6s   line 623
nth-child(5): delay 1.7s   line 624
nth-child(6): delay 1.8s   line 625
```

**Total composition reveal duration:** ~2.2s (from first visible trigger to last proof fade-in complete: 1.8s delay + 0.4s transition)

**Trigger mechanism:** IntersectionObserver adds `.visible` class to `.ec-scenario` when section enters viewport. `.reveal` class on each scenario element activates the observer.

---

## 9. COLOR REFERENCE

### Global tokens (`:root` — line 161)
| Token | Hex | Role |
|-------|-----|------|
| `--saffron` | `#E8AF38` | Kicker text, accents |
| `--ink` | `#0C1020` | Section background, space headline |
| `--linen` | `#F2F0EA` | Turtle headline, page background |
| `--paper` | `#FAFAFA` | — |
| `--warm-bg` | `#ECEAE3` | — |

### Subject colors — Space scenario (Shade 2, lighter)
| Subject | Border / Label hex | Line |
|---------|--------------------|------|
| Reading | `#2030A0` | 594, 600 |
| Math | `#9A8600` | 595, 601 |
| Science | `#247840` | 596, 602 |
| Atlas | `#CC6000` | 597, 603 |
| Art | `#6030B0` | 598, 604 |
| Elementum | `#247840` | 599, 605 |

### Subject colors — Turtle scenario (Shade 3, brighter)
| Subject | Border / Label hex | Line |
|---------|--------------------|------|
| Reading | `#3848D0` | 607, 613 |
| Math | `#E8D800` | 608, 614 |
| Science | `#38B060` | 609, 615 |
| Atlas | `#F08A20` | 610, 616 |
| Art | `#8848E0` | 611, 617 |
| Elementum | `#38B060` | 612, 618 |

### Proof body text colors
| Scenario | Color | Line |
|----------|-------|------|
| Space | `rgba(12,16,32,0.92)` | 606 |
| Turtle | `rgba(242,240,234,0.92)` | 619 |

---

## 10. MEDIA QUERIES THAT AFFECT SECTION 3

Listed in source order (last matching rule wins for any given property):

| Line | Query | Triggers |
|------|-------|---------|
| 564 | `@media(max-width:768px)` | Hides fireflies (`.firefly`) — not Section 3 layout |
| 627 | `@media(max-width:767px)` | **Mobile stack:** scenario height→auto; photo→relative, height:min(67vw,50vh); copy→static, full-width, padding 48px 24px 40px; proofs→block; adds solid bg to copy columns |
| 642 | `@media(max-height:420px) and (min-width:600px)` | **Landscape short:** scenario→100vh; photo→absolute inset:0; copy→absolute, 60% wide, padding-top 178px; compact type (headline 20px, kicker 15px); eyebrow hidden; proofs→2-col grid, column-gap 8px, row-gap 4px |
| 656 | `@media(max-height:700px) and (min-width:768px)` | **Short-wide (production display):** scenario→100vh; copy padding-top→96px; headline→28px/margin 8px; kicker→18px/margin 18px; proof margin-bottom→8px; label→9px; body→12px |
| 666 | `@media(prefers-reduced-motion:reduce)` | Disables Ken Burns animation on `.ec-photo-img` |

### Cascade priority at production display (innerWidth≈756, innerHeight≈396, Chrome zoom-inflated effective width ≥768px)
1. Base styles (lines 567–625): desktop overlay, copy at 172px
2. `max-width:767px` (line 627): **does not apply** at effective width ≥768px
3. `max-height:420px AND min-width:600px` (line 642): **applies** → copy at 178px, scenario 100vh
4. `max-height:700px AND min-width:768px` (line 656): **applies, wins** → copy at 96px, scenario 100vh

**Active rule at production display:** line 656–665. Section height = 100vh (exact viewport fill). Copy padding-top = 96px.

---

*Baseline captured at commit cbac52e, 2026-04-22. If Section 3 breaks, verify these values in the order listed in §10.*
