# TRANSFER QUEUE — Notion Sync Pending

Items in this file have been applied locally and are waiting to be synced to
their Notion destination. Clear each entry once Notion has been updated.

---

## ENTRY 001
Date: 2026-04-24
Status: PENDING NOTION SYNC
Priority: HIGH — governance update, needed for future section work

Item: Technical Runbook update — Viewport overflow/min-height coupling rule
      and fifth target viewport (Amy production environment 1440×396)

Source: Local TECHNICAL_RUNBOOK.md, 2026-04-24 update
  - Section updated: VIEWPORT REALITY CONSTRAINTS (Layer 4)
  - Subsection renamed: "THE FOUR TARGET VIEWPORTS" → "THE FIVE TARGET VIEWPORTS"
  - New subsection added: "OVERFLOW + MIN-HEIGHT COUPLING RULE"
  - Fifth viewport added: AMY PRODUCTION ENVIRONMENT (1440×396)
  - Verification requirement updated throughout: four → five viewports

Destination: Notion Technical Runbook page
  Page ID: 347335a8d332818bbd18d10b2a2170de

Content to transfer:

─────────────────────────────────────────────────────────────────────────────
FIFTH TARGET VIEWPORT — AMY PRODUCTION ENVIRONMENT
─────────────────────────────────────────────────────────────────────────────

Add to THE FIVE TARGET VIEWPORTS list (after iPhone 15 Pro Max entry):

AMY PRODUCTION ENVIRONMENT
  Dimensions: 1440×396.
  Context: Windows 200% OS scaling + Chrome bookmarks bar + Chrome zoom.
    Matches the documented production display environment described in the
    Wizkoo Viewport Standard (Tier 1).
  Role: Amy's actual working viewport. A section passing all other four target
    viewports while failing at 1440×396 means the section fails for Amy
    specifically — a real failure, not an edge case. Added 2026-04-24 following
    Section 2 (.linen-hero) bleed diagnostic.

Update verification requirement to read:

  "Open index.html in dev server. Verify at five target viewports per Layer 4
  Viewport Reality Constraints: (1) 1440×900 native, (2) 1280×540 emulated
  compressed desktop, (3) 1440×396 Amy production environment, (4) 375×667
  iPhone SE, (5) 430×932 iPhone 15 Pro Max. Submit button must be visible
  without scroll at compressed desktop and reachable within one scroll gesture
  on both mobile viewports. No section boundary bleed at any viewport. Report
  any viewport that fails the check."

─────────────────────────────────────────────────────────────────────────────
NEW SUBSECTION — OVERFLOW + MIN-HEIGHT COUPLING RULE
─────────────────────────────────────────────────────────────────────────────

Insert after THE FIVE TARGET VIEWPORTS subsection, before THE VERIFICATION
REQUIREMENT subsection.

Added: 2026-04-24
Status: Active — apply to all sections, present and future
Source: Section 2 (.linen-hero) bleed diagnostic, 2026-04-24

THE RULE

If a section declares overflow:hidden (or overflow:hidden!important) AND
min-height:100dvh (or 100vh, or 100svh) at any breakpoint, the section
MUST use min-height:calc(100dvh + 96px) instead.

Minimum buffer value: 96px.
Maximum: discretionary, but 96px is the verified-working baseline from
Section 2 remediation.

WHY THIS RULE EXISTS

When overflow:hidden and min-height:100dvh co-exist, min-height stops
acting as a floor (minimum) and becomes a ceiling (maximum). The section
is forced to be exactly the viewport size — no more, no less.

At exact viewport size, the next section's first pixel lands on the
current section's terminal edge. Any rendering variance — font load
timing, browser rounding, webfont metrics — causes the next section to
bleed into the current viewport frame as a visible strip at the bottom.

The +96px buffer extends the section past the viewport fold by a
structurally guaranteed amount, eliminating the bleed regardless of
content height or rendering variance.

DIAGNOSTIC QUESTION

If a strip of the next section is visible at the bottom of a
full-viewport section at any viewport:

  Does this section have overflow:hidden paired with
  min-height:100dvh (or 100vh, or 100svh)?

If YES → this is the cause. Fix by changing min-height to
calc(100dvh + 96px).

If NO → different issue. Diagnose separately.

COMPLIANT vs NON-COMPLIANT EXAMPLES

NON-COMPLIANT:
  .my-section {
    min-height: 100dvh;
    overflow: hidden;
  }

NON-COMPLIANT:
  @media (max-height: 420px) and (min-width: 600px) {
    .my-section {
      min-height: 100dvh;
      overflow: hidden !important;
    }
  }

COMPLIANT (option A — add buffer):
  .my-section {
    min-height: calc(100dvh + 96px);
    overflow: hidden;
  }

COMPLIANT (option B — remove clip):
  .my-section {
    min-height: 100dvh;
    overflow: visible;
  }

Choose Option A when the section must clip overflow for design reasons
(e.g., full-bleed photograph must not bleed past section boundary).
Choose Option B when natural content expansion is acceptable.

─────────────────────────────────────────────────────────────────────────────
END ENTRY 001
─────────────────────────────────────────────────────────────────────────────
