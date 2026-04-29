# ⚠️ PROJECT GUARD — READ FIRST

**Project:** Wizkoo.

**Scope:** This document governs the Wizkoo codebase — BOTH the marketing site at wizkoo/ AND the plan generator at wizkoo-plan-generator/. Plan-generator folder contains a pointer file, not a duplicate runbook.

**Do not apply updates from this document to any other project's Technical Runbook.** If you find yourself reading this while working on Learnkoo or any other project, stop — you have the wrong file open.

**Inherits from:** AMY_TECHNICAL_STANDARDS.md (located at C:\Users\amyog\Desktop\wizkoo\AMY_TECHNICAL_STANDARDS.md). Read that first.

---

# TECHNICAL RUNBOOK — WIZKOO
# Filename: TECHNICAL_RUNBOOK.md

Project-specific runbook. Inherits global standards from AMY_TECHNICAL_STANDARDS.md — read that first.

This file contains only what is specific to Wizkoo. Global session mechanics, Operating
Principles, prompt standards, code hygiene, failure patterns, accessibility, and performance
targets live in AMY_TECHNICAL_STANDARDS.md and are not duplicated here.

---
TO START EVERY BUILD SESSION: Say "Run the Technical Runbook"
That single instruction triggers everything below.
Read this file end to end. Confirm you have read it by stating the four items
in the SESSION STARTUP INSTRUCTION. Then execute the startup sequence.
---

Last updated: April 29, 2026
Maintained by: Amy Oguntala

---

## TABLE OF CONTENTS

LAYER 0 — IDENTITY: Governing documents, quality filter, hierarchy rule, maintenance rule
LAYER 1 — OPERATIONAL PROTOCOLS: Wizkoo-specific session steps, decision write-back, $200 standard
LAYER 2 — LIVE STATE: Pages status, known bugs, nav deliberate hold, locked decisions
LAYER 3 — SYSTEM MAP: Codebase locations, file maps, environment variables, dependencies, deployment
LAYER 4 — DESIGN SYSTEM: Surfaces, color system, typography, motion, nav system, $200 standard
LAYER 5 — COMPONENT SPECS: Generation spectacle, firefly, homepage hero, atlas continent palette, Section 3
LAYER 6 — FAILURE PREVENTION: Wizkoo-specific failure patterns, preservation locks, open items
LAYER 7 — DEEP REFERENCE: CSS custom properties (both codebases), API surface, prompt templates
LAYER 8 — HISTORY: Version history

---

═══════════════════════════════════════
LAYER 0 — IDENTITY
Read this layer first, every session. It defines what this document is,
who it answers to, and what the quality bar is.
═══════════════════════════════════════

## GOVERNING DOCUMENTS

Light Standard v4 (Notion): 32d335a8d332811ab922e806deeec3fb
Build Spec Addendum (Notion): 32e335a8d33281ab802feee19d8ce22d
$200 Standard (Notion): 338335a8d33281f699d4d705f973d430

HIERARCHY RULE: The Light Standard (Notion page 32d335a8d332811ab922e806deeec3fb) is
the authority for design system values. This file extracts them for fast lookup.
If this file and the Light Standard disagree, THE LIGHT STANDARD WINS.
If this file and the code disagree, THE LIGHT STANDARD WINS.

TECHNICAL RUNBOOK AUTHORITY: This local file (TECHNICAL_RUNBOOK.md) is the source of
truth for the Technical Runbook itself. The Notion mirror (page
347335a8d332818bbd18d10b2a2170de) is a chat-session-facing copy kept in sync with
this file through the Transfer Queue. If the local file and the Notion mirror disagree,
THE LOCAL FILE WINS and the mirror is re-synced.

---

## THE ONE-SENTENCE SUMMARY

"Warm surface. Warm energy. Cool architecture.
The proportions shift. The system never changes."

---

## THE QUALITY FILTER (read before every session)

"Someone who loves children made this."
Every surface, every interaction, every sound passes through one filter:
does this feel crafted, or does it feel assembled?
If the answer is "it's fine" — it is not ready.

---

## MAINTENANCE RULE

This file is only as good as its accuracy.
When a value is locked: add it here before closing the session.
When a file path changes: update it here immediately.
When a decision is made: add it to Locked Decisions before closing.
When the Light Standard updates: reconcile this file against it.
The Light Standard is always the authority. This file is the fast lookup.

---

═══════════════════════════════════════
LAYER 1 — OPERATIONAL PROTOCOLS
Read AMY_TECHNICAL_STANDARDS.md first for global session mechanics.
This layer contains Wizkoo-specific additions to those protocols.
═══════════════════════════════════════

## SESSION STARTUP INSTRUCTION
Enforces Standards §1.1 (Session Startup) via Wizkoo-specific confirmation items and Transfer Queue pull.

Every build session starts with one line from Amy: "Run the Technical Runbook"

Execute all four steps before touching any file. The global framework is in
AMY_TECHNICAL_STANDARDS.md Section 1. Wizkoo-specific content follows.

STEP 1 — CONFIRM YOU READ THIS FILE (Wizkoo specifics)
State out loud:
  1. Both local codebase paths:
       Marketing site: C:\Users\amyog\Desktop\wizkoo
       Plan generator: C:\Users\amyog\Desktop\wizkoo-plan-generator
  2. Canonical saffron hex value: #E8AF38
  3. Environment assigned to the page you will work on today (from ENVIRONMENT MAP in Layer 4)
  4. Confirm Operating Principles active by naming all seven by number:
     (1) Pre-flight audit, (2) Clean state requirement,
     (3) Report superseded rules, (4) Three-strike reset rule,
     (5) Specificity hygiene, (6) One source of truth per component,
     (7) Viewport verification requirement.
Do not begin work until all four are confirmed.

STEP 2 — CHECK THE TRANSFER QUEUE (Wizkoo backlog mechanism)
Use the Notion tool to fetch page:
345335a8d33281ea9f86e19c5018624a
(Technical Runbook Transfer Queue)

Read the Pending Transfers section completely.

If any items show STATUS: PENDING:
  Read each item fully.
  Apply it to the correct section of this document (both local copies).
  Also update the Notion mirror: fetch the corresponding layer child
  page under the Technical Runbook — Wizkoo parent
  (347335a8d332818bbd18d10b2a2170de) and apply the same change to
  that page. The Notion mirror must match the local file after every
  Transfer Queue application. If a change spans multiple layers,
  update all affected child pages.
  Update that item in Notion: change STATUS to APPLIED,
  add today's date, which section(s) it was applied to,
  and confirm the Notion mirror was also updated.
  Log what was applied in VERSION HISTORY.
  State: "Applied [X] items from Transfer Queue.
  Notion mirror synced: [list of child pages updated]."

  Notion mirror child page IDs:
    Layer 0 — Identity:             347335a8d33281d19118c3595b673eee
    Layer 1 — Operational Protocols: 347335a8d332810ea482e135a30c0830
    Layer 2 — Live State:            347335a8d3328166b24bd77f35e44d15
    Layer 3 — System Map:            347335a8d33281039f71fad4c5dbdd3b
    Layer 4 — Design System:         347335a8d3328182a7c7d69739dac96b
    Layer 5 — Component Specs:       347335a8d33281dda1c4c3c75d0a6843
    Layer 6 — Failure Prevention:    347335a8d3328176bf8fea86cffa41d2
    Layer 7 — Deep Reference:        347335a8d33281148b84f97714ff1523
    Layer 8 — History:               347335a8d33281698c4ccacaf86fbdbf

If queue is empty: State "Transfer Queue clear. Proceeding."
Do not skip this step.

STEP 3 — GIT STATUS CHECK
(Per AMY_TECHNICAL_STANDARDS.md Section 1)

STEP 4 — BEGIN WORK
State what the session will accomplish. Then proceed.

---

## BUILD SESSION CLOSE PROTOCOL — WIZKOO ADDITIONS
Enforces Standards §1.2 (Build Session Close Protocol) via Transfer Queue deposit, mandatory Notion mirror sync, and Wizkoo-specific ledger format.

The global close protocol (10 steps) is in AMY_TECHNICAL_STANDARDS.md Section 1.
Wizkoo adds the following requirements on top of the global protocol.

ADDITIONAL STEP — DIRECTION 2: TRANSFER QUEUE
If this session surfaced any decision that affects the chat-side system (new surface
assignment, product direction, GTM implication, brand decision, design principle):
Use the Notion tool to add it to the Transfer Queue:
  Page: 345335a8d33281ea9f86e19c5018624a
  Format:
    DATE: [today]
    SECTION: [which Technical Runbook section this belongs in]
    DECISION: [exactly what needs to be added or changed]
    STATUS: PENDING
If nothing to deposit: state "Nothing to deposit to Transfer Queue this session."

MANDATORY MIRROR SYNC (added to Step 6):
For every layer modified this session, fetch the corresponding layer child page
under the Technical Runbook — Wizkoo parent (347335a8d332818bbd18d10b2a2170de)
and apply the same change to that page. Child page IDs are listed in the
Session Startup Step 2. The Notion mirror sync is same-tier as copying between
the two local repo folders: not optional, not deferrable.

WIZKOO VERIFICATION GATE (replaces global Step 7 ledger):
Enforces Standards §1.2 Step 7 via Wizkoo-specific line-count checks and Notion mirror confirmation.

  BUILD SESSION WRITE-BACK VERIFICATION
  ✓ UPDATED: [what] → TECHNICAL_RUNBOOK.md ([X] lines)
  ✓ COPIED: C:\Users\amyog\Desktop\wizkoo ([X] lines)
  ✓ COPIED: C:\Users\amyog\Desktop\wizkoo-plan-generator ([X] lines)
  ✓ NOTION MIRROR SYNCED: [list of layer child pages updated] OR "no layers modified this session"
  ✓ TRANSFER QUEUE: [items deposited OR "nothing to deposit"]
  ✓ FAILURE PATTERNS: [captured OR "none this session"]
  ✗ NOT DONE: [item] → [Amy deferred / technical blocker only]

  Line counts must match across both copies. If they differ, the copy failed. Redo it.

WIZKOO FLIGHT LOG (added to Step 9):
Use the Notion tool to write to the ATC Flight Log.
Database ID: b132ce969d3041348b4b7b6a6082cb99
Data source: 4a4a8f2e-3c19-4e23-9b9d-5d4084fee57e

First: search the database for a page where date:Date:start matches today's actual
date in YYYY-MM-DD format.

If today's page EXISTS:
  Fetch it. Append a BUILD SESSION block to its content.

If today's page DOES NOT EXIST:
  Create a new page with these properties:
    Day: "[full day name + date — compute from today's actual date.
          Example format: Friday, April 17, 2026]"
    date:Date:start: "[today in YYYY-MM-DD format]"
    date:Date:is_datetime: 0
    Status: "Open"
    Session Count: 1
  Then write the build session entry as page content.

BUILD SESSION ENTRY FORMAT:
---
BUILD SESSION — [time if known, otherwise omit]
Intended: [what Amy opened this session to accomplish]
Shipped: [what actually got committed and pushed]
Commit: [hash]
Still open: [what carries to next session, or "Nothing"]
Drift: [did session expand beyond intent? brief note]
---

This is Amy's productivity record. Not a technical log.
Morning Amy reads this to know what the build system produced.
Keep it scannable. Ten lines maximum.

---

## THE $200 STANDARD — SUMMARY

Quality floor: every surface feels crafted, not assembled.
One plastic cup collapses the entire $200 illusion.
The answer to "will a parent screenshot this?" must be yes.
→ Full content: LAYER 4 — THE $200 STANDARD (Quality Floor Directive)

---

## CLAUDE CODE OPERATING PRINCIPLES — WIZKOO SCOPE
Enforces Standards §2 (Claude Code Operating Principles) via Amy-approval gate on additions and permanent-lock on removals.

Full principle definitions: AMY_TECHNICAL_STANDARDS.md Section 2.

WIZKOO GOVERNANCE:
  Additions require Amy's explicit decision.
  Removals are not permitted.
  Applies to every Claude Code session on Wizkoo — wizkoo.com and the plan generator.

SESSION-START INSTRUCTION (verbatim, every session):
  "This session operates under Claude Code Operating Principles
   (see Wizkoo technical runbook). Apply all seven principles to every
   change in this session. Pre-flight audit before every non-trivial
   change. Report superseded rules as part of every change. If three
   consecutive tweaks fail, request a reset."

---

## WIZKOO CODE HYGIENE PROMPTS
Enforces Standards §4 (Code Hygiene) via templates pre-filled with Wizkoo file paths and scoped exclusion lists.

Global hygiene framework: AMY_TECHNICAL_STANDARDS.md Section 4.
The prompts below are the Wizkoo-specific versions of the five templates,
with actual file paths filled in.

PROMPT 1 — LAYER 1 DEAD CODE AUDIT (REPORT-ONLY)

TASK: Audit the marketing site codebase for dead CSS. Produce a findings
  report in DEAD_CSS_AUDIT_REPORT.md. No modifications to any file.

SCOPE: In scope: all CSS files under css/ at repo root, any <style>
  blocks in index.html and all top-level HTML pages, any CSS inside
  components/nav.js. Out of scope: /games/ subdirectory, plan generator
  repo entirely, any JavaScript logic.

RECONCILIATION AUTHORIZED: None. This is report-only. Do not modify any file.

PRESERVATION LOCKS: All files. No modifications of any kind permitted in this pass.

REPORTING: Produce DEAD_CSS_AUDIT_REPORT.md with findings in four
  categories: orphaned selectors, unused custom properties, commented-
  out rule blocks, duplicate selectors. Each finding includes file path,
  line number, evidence (grep commands run and files searched),
  confidence level (HIGH/MEDIUM/LOW), recommendation (SAFE_TO_REMOVE /
  REVIEW_REQUIRED / KEEP_WITH_NOTE).

VERIFICATION: Confirm DEAD_CSS_AUDIT_REPORT.md was created at repo root.
  Confirm no other file was modified (git status shows only the new
  report). Stop. Do not execute any deletions. Amy reviews the report
  before any execution prompt runs.

PROMPT 2 — LAYER 1 DEAD CODE EXECUTION (AFTER AUDIT REVIEW)

TASK: Execute dead CSS cleanup based on DEAD_CSS_AUDIT_REPORT.md.
  Remove all HIGH-confidence findings in Categories 1 (orphaned
  selectors) and 2 (unused custom properties). Defer Category 4
  (duplicates) unless explicitly approved per-finding.

SCOPE: Marketing site repo only. In scope: files flagged for full
  deletion in the audit report, inline <style> block selectors flagged
  in the report, CSS file selector removals flagged in the report,
  unused token removals in css/tokens.css, inert JavaScript null-guards
  for removed elements (only if their sole purpose was handling now-
  removed elements). Out of scope: /games/ subdirectory, plan generator
  repo, components/nav.js runtime injection, any form-related code.

RECONCILIATION AUTHORIZED: Remove all HIGH-confidence findings per the
  audit report. Remove responsive override rules in media queries if
  their main rule is being deleted in the same pass (dependency cleanup).
  Do NOT restructure surviving code. Do NOT rename any selector. Do NOT
  refactor file organization.

PRESERVATION LOCKS: Do not touch any item in the Homepage Form
  Preservation Locks Registry (see Layer 6). Do not touch
  netlify/functions/ at all. Do not touch plan generator code. Do not
  touch files in /games/.

REPORTING: Before executing, list every file to modify or delete and
  the specific changes per file. Wait for approval. After executing,
  produce a ledger: files deleted with line counts, files modified with
  selectors removed and line deltas, total lines removed net, any
  finding not executed with reason.

VERIFICATION: Run git status and git diff --stat. Confirm scope
  integrity. Open representative pages in dev server, confirm no console
  errors or visual regressions. Commit with descriptive message. Do NOT
  push — Amy reviews before push.

PROMPT 3 — LAYER 2 TOKEN CONSOLIDATION

TASK: Find hardcoded color, spacing, and typography values in component
  files that should be using existing CSS custom properties from
  css/tokens.css. Produce a consolidation report, then execute approved
  replacements.

SCOPE: In scope: all CSS files under css/ except tokens.css (which is
  the source), inline <style> blocks in HTML pages, CSS-in-JS inside
  components/nav.js. Out of scope: /games/ subdirectory, plan generator
  repo, images and SVGs, any value that is intentionally unique to one
  component and not meant to be shared.

RECONCILIATION AUTHORIZED: Replace hardcoded values with var(--token-name)
  references where an exact match exists in tokens.css. Remove any token
  in tokens.css that becomes unused as a result of consolidation. Do NOT
  invent new tokens. Do NOT rename existing tokens. If a hardcoded value
  has no matching token, report it but leave it.

PRESERVATION LOCKS: Do not touch tokens.css itself except to remove tokens
  that become unused. Do not touch any :root block in index.html
  (Preservation Locks Registry item 18). Do not touch any form-related code.

REPORTING: Before executing, produce a report: every hardcoded value
  found, which file and line, which token it would map to, confidence
  the match is correct. Include any hardcoded values that have no token
  match, separately. Wait for approval. After executing, produce a
  ledger: replacements made per file, tokens removed, any values left
  hardcoded with reason.

VERIFICATION: Run git status. Confirm scope integrity. Open representative
  pages in dev server, confirm no visual regressions. Commit with
  descriptive message. Do NOT push — Amy reviews before push.

PROMPT 4 — LAYER 3 RESPONSIVE STRATEGY AUDIT

TASK: Audit the marketing site's breakpoint strategy. Document the
  current system, identify conflicts between width-based and height-
  based breakpoints, and recommend consolidation OR formalize rules of
  engagement for the current split. Produce RESPONSIVE_AUDIT_REPORT.md.
  Do not modify any file.

SCOPE: In scope: all @media queries in all CSS files, all @media queries
  in inline <style> blocks, any JS-driven viewport logic. Out of scope:
  /games/, plan generator repo.

RECONCILIATION AUTHORIZED: None. Report-only.

PRESERVATION LOCKS: All files. Report-only.

REPORTING: Produce RESPONSIVE_AUDIT_REPORT.md with complete inventory
  of every breakpoint (width-based and height-based) and which file and
  line; analysis of overlap; analysis of coverage gaps; recommendation
  for each conflict (consolidate, document intentional split, or revise).

VERIFICATION: Confirm RESPONSIVE_AUDIT_REPORT.md was created at repo
  root. Confirm no other file was modified. Stop. Amy reviews and decides
  next action.

PROMPT 5 — LAYER 4 REFACTOR SCOPING (NOT EXECUTION)

TASK: A specific new feature is blocked by current code architecture.
  Assess whether a refactor is the right answer, what surface area it
  would touch, and what the risk profile is. Produce a scoping document.
  Do not execute any refactor.

  [Amy: replace this line with the specific blocked feature context
  before running this prompt.]

SCOPE: In scope: analysis only, targeting the named blocked feature.
  Out of scope: all other refactor candidates, any execution.

RECONCILIATION AUTHORIZED: None. Scoping only.

PRESERVATION LOCKS: All files. No modifications.

REPORTING: Produce REFACTOR_SCOPING.md with the blocked feature named
  explicitly; the current architecture blocking it; the minimum refactor
  scope that would unblock (not the ideal, the minimum); files and
  functions touched; risk profile; estimated effort; alternative
  approaches that would avoid the refactor entirely.

VERIFICATION: Confirm REFACTOR_SCOPING.md was created. Confirm no other
  file was modified. Stop. Amy reviews and decides.

---

═══════════════════════════════════════
LAYER 2 — LIVE STATE
Read this layer before any build session to understand what is broken,
what is frozen, and what decisions are locked.
═══════════════════════════════════════

## PAGES STATUS

  Homepage          | Active work    | Nav, warm right column, spacing
  Plan (/plan)      | Elite          | Touch nothing
  Games             | Below standard | Saffron deployment, weight system
  Library           | Elite          | Touch nothing
  Methodology       | Needs rethink  | Full content and layout redesign
  Ages              | Strong         | Verify nav color landing
  Open Seat         | LOCKED FINAL   | Day sky exactly as built. NEVER CHANGE.
  Pricing           | Strong         | Firefly fix pending

---

## KNOWN BUGS

1. ANNOUNCEMENT BAR TEXT COLOR — NON-HOMEPAGE PAGES
   What is broken: The announcement bar text on every page except the homepage is
     dark ink (rgba(12,16,32,0.75)) on a semi-transparent dark bar. On linen pages
     this text is barely visible. On night-sky pages it is nearly invisible. The Light
     Standard spec and the homepage both use saffron rgba(232,175,56,0.60).
   Origin: C:\Users\amyog\Desktop\wizkoo\components\nav.js line 84
     Current value: color:rgba(12,16,32,0.75);
     Correct value: color:rgba(232,175,56,0.60);
   Root cause: The default .announce-text rule was written with dark ink. The homepage
     is a special case that applies saffron via an inline override at nav.js lines
     288–289 (the _hp branch). All other pages fall through to the default dark value.
   The fix (exact):
     In nav.js, change line 84 from:
       '  color:rgba(12,16,32,0.75);',
     to:
       '  color:rgba(232,175,56,0.60);',
   Verify in browser: Open ages.html (linen surface). Inspect announcement bar text.
     Should be legible saffron against the dark bar. Check library.html (night sky) too.

2. NAV CTA STYLE — GHOST VS FILLED (REQUIRES AMY CONFIRMATION BEFORE FIXING)
   What is broken: Light Standard spec says Nav CTA must be saffron fill:
     background: #E8AF38, color: #0C1020 (dark text on saffron button).
     Current implementation at nav.js lines 199–219 is ghost style.
   DO NOT FIX without Amy confirming this is a bug and not an intentional design choice.
   Ask: "The nav CTA is currently ghost style (transparent, saffron border). The Light
   Standard says it should be saffron fill. Should I change it back to filled?"
   If Amy confirms it is a bug, the fix (exact):
     In nav.js, change lines 206–214:
       Current:
         '  background:transparent;',
         '  color:#E8AF38;',
         '  border:1px solid rgba(232,175,56,0.65);',
         '  box-shadow:none;',
       Change to:
         '  background:#E8AF38;',
         '  color:#0C1020;',
         '  border:1px solid rgba(232,175,56,0.90);',
         '  box-shadow:inset 0 1px 0 rgba(255,255,255,0.20);',
       And lines 216–219 (hover state):
       Current:
         '  border-color:rgba(232,175,56,1.0);',
         '  box-shadow:0 0 0 1px rgba(232,175,56,0.20),0 2px 12px rgba(232,175,56,0.18);',
       Change to:
         '  background:#EDBA45;',
         '  filter:brightness(1.04);',
         (remove the border-color and box-shadow lines from hover)
   Verify: Nav CTA should render as solid saffron (#E8AF38), dark ink text (#0C1020).
     Hover lightens to #EDBA45. No translateY on hover — spec says NO translation.

3. PRICING PAGE — CTA FIREFLY MISSING
   What is broken: pricing.html has no firefly implementation.
   Origin: C:\Users\amyog\Desktop\wizkoo\pricing.html — no firefly code anywhere.
   The fix (exact): Add the following script to pricing.html, immediately before
     </body> (after the existing scroll-reveal script block):

     <script>
     /* ─── CTA Firefly — pricing page ─── */
     (function () {
       if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
       if (window.innerWidth < 768) return;
       var cta = document.querySelector('.cta');
       if (!cta) return;
       var btn = cta.querySelector('.cta-btn');
       if (!btn) return;

       var ff = document.createElement('div');
       ff.style.cssText = 'position:absolute;width:5px;height:5px;border-radius:50%;' +
         'background:#E8AF38;pointer-events:none;z-index:10;opacity:0;' +
         'transition:opacity 0.4s ease;' +
         'box-shadow:0 0 8px 3px rgba(232,175,56,.4),0 0 20px 6px rgba(232,175,56,.15);';
       cta.appendChild(ff);

       var triggered = false;
       if (!window.IntersectionObserver) return;
       var obs = new IntersectionObserver(function (entries) {
         if (entries[0].isIntersecting && !triggered) {
           triggered = true;
           obs.disconnect();
           setTimeout(launch, 300);
         }
       }, { threshold: 0.4 });
       obs.observe(cta);

       function launch() {
         var cr = cta.getBoundingClientRect();
         var br = btn.getBoundingClientRect();
         var x0 = (br.left - cr.left) + br.width * 0.15;
         var y0 = (br.top  - cr.top)  + br.height * 0.5;
         ff.style.left = x0 + 'px';
         ff.style.top  = y0 + 'px';
         requestAnimationFrame(function () { ff.style.opacity = '1'; });
         var t = 0, start = Date.now(), dur = 2600;
         (function drift() {
           t += 0.018;
           if (Date.now() - start >= dur) {
             ff.style.transition = 'opacity 0.5s ease';
             ff.style.opacity = '0';
             return;
           }
           ff.style.left = (x0 + Math.sin(t * 2.1) * 14 + Math.sin(t * 4.7) * 6) + 'px';
           ff.style.top  = (y0 + Math.cos(t * 1.6) * 10 + Math.cos(t * 3.3) * 4) + 'px';
           requestAnimationFrame(drift);
         })();
       }
     })();
     </script>

   BEFORE adding: verify .cta has position:relative (it does — pricing.html line 82).
   Verify in browser: Scroll CTA section into view. Within 300ms of intersection,
     a 5px saffron dot appears at left edge of "Build Your Plan" button, drifts
     2.6s then fades. Does not appear on mobile (<768px) or prefers-reduced-motion.

4. GAMES PAGES — INVALID SORA WEIGHT VALUES
   Multiple elements use Sora font-weight 600, not in the approved weight set (200, 300, 700, 800).

   SUB-BUG 4a — atlas.html, Sora weight 600 on postcard body text:
     File: C:\Users\amyog\Desktop\wizkoo\games\atlas.html, line 94
     Fix: Change font-weight:600 to font-weight:700.

   SUB-BUG 4b — elementum.html, Sora weight 600 on element name label:
     File: C:\Users\amyog\Desktop\wizkoo\games\elementum.html, line 62
     Fix: Change font-weight:600 to font-weight:700.

   Additional — pricing.html also has invalid Sora weights:
     pricing.html line 58: .feature-title font-weight:600 → change to 700
     pricing.html line 76: .faq-q font-weight:500 → change to 700
     pricing.html line 47: .hero-btn font-weight:600 → change to 700
     pricing.html line 87: .cta-btn font-weight:600 → change to 700

   Verify: In DevTools > Computed, resolved font-weight must be 200, 300, 700, or 800.

5. METHODOLOGY PAGE — NEEDS RETHINK
   What is broken: Full content and layout redesign required.
   Location: C:\Users\amyog\Desktop\wizkoo\methodology.html
   Status: Unresolved. Requires a design session before any code work.

6. HOMEPAGE ENVIRONMENT — UNRESOLVED
   What is broken: The environment assignment for the homepage is TBD.
     The decision between "linen only" or "multi-surface" has not been made.
   Status: Unresolved. No code work on homepage surface until decided and locked.

7. --ease-out-expo TOKEN NOT LINKED IN index.html
   What is broken: --ease-out-expo is defined in css/tokens.css but css/tokens.css
     is NOT linked from index.html. All var(--ease-out-expo) references in index.html
     inline CSS fall back to browser default ease.
   Fix: Either (a) add --ease-out-expo to index.html's inline :root, or (b) link
     css/tokens.css from index.html and remove the inline --expo duplication.
     Option (b) is the correct long-term fix per Operating Principle 6.
   Status: Low visual impact. Fix in a dedicated tokens cleanup session.

---

## NAV DELIBERATE HOLD

NAV STATUS: DELIBERATE HOLD — April 17, 2026
Four unresolved questions. Nav frozen exactly as deployed.
Full entry with technical specs: LAYER 4 — NAV SYSTEM section.

---

## LOCKED DECISIONS — DO NOT REOPEN

- Open Seat: day sky surface exactly as built. Permanent. Final. Never change.
- Hamburger nav on desktop: permanently off the table.
- Entrance animation on homepage: removed. Done.
- "And tracking." — period. Never exclamation mark.
- Theme suggestion buttons: Space Mono, NO EMOJI. Ever.
- Two Claude Code sessions on same codebase simultaneously: never.
- Firefly in wordmark: parked. Do not reintroduce.
- Homepage fully dark: parked. Do not reopen.
- Saffron announcement bar as full-width surface: Light Standard violation. Never.
- Column ratio: 62/38. Locked.
- Age dropdown: numbers only 1-12. No "years old."
- Deprecated day sky color #1848B8: never use.
- Three equal saffron lines in headline: never. One saffron moment per headline.
- Frosted glass nav on linen: solved with dark nav. Do not suggest reverting.
- Time masthead ("08:17 · THURSDAY · WK 4 · SPRING TERM"): removed April 19, 2026. Do not reintroduce.
- Kicker and kicker rule in hero left column: removed with the time masthead. Do not reintroduce either element.
- Hero left column alignment rule: .nh-left{padding-top:305px} governs baseline alignment at 1440px. Container-driven, not element-driven.
- Desk note width: 50% of .nh-right content area. Single tape piece (::after only), centered at left:calc(50% - 28px). Do not add a second tape piece.
- Blocklist architecture: suicide, murder, weed are BLOCKLIST_EXACT (exact-match only). Both client (index.html) and server (validate-theme.js) lists must stay in sync.
- Email provider for moderation digest: Resend. Do not swap provider without updating both sendEmail() and env var names in moderation-digest.js.
- .cta-needs-ready gating: uses color: rgba(12,16,32,0.40) on unready state, NOT opacity. Box-shadow stays full saffron always. Transition is color, not opacity. Source of truth: css/components.css.
- Wax seal (editorial note): inline SVG, 56×56px display, 80×80 viewBox. Organic blob path (not circle). 3-layer W monogram (shadow/base/highlight text offsets). Do not revert to div+span.
- Hero headline line 2 ("homeschool plans."): locked at 192px. Reduced April 20, 2026 per user request.
- CTA button typography ("SHOW ME THIS WEEK →"): Sora 600, 0.68rem, letter-spacing 0.06em. Matches Open Seat page .btn-sky treatment. Not Space Mono.
- css/components.css easing (lines 24/25/26): cubic-bezier(0.16,1,0.3,1) left hardcoded intentionally. Consumers do not link tokens.css. Revisit when OPEN ITEM 6 is resolved.
- Section height at max-height:700px: MUST be height:100vh. NEVER height:max(Nvh, fixed-px). Locked April 22, 2026.
- ec-proofs column-gap (desktop base): 4px. Locked April 22, 2026.
- ec-col-copy padding-top at short-wide query (max-height:700px, min-width:768px): 96px. Locked April 22, 2026. Minimum for nav clearance. Do not reduce below 96px.
- Footer link vocabulary: the /themes page link must read "Themes to Explore" — never the shorter "Themes". Locked April 26, 2026.
- Footer column placement for "Themes to Explore": LEARN MORE column (wf-learn), not PRODUCT column (wf-nav). Locked April 26, 2026.
- Footer column naming discrepancy: production footer uses Product / Learn More / Connect. Light Standard v5 spec calls them Learn / Join / Wizkoo. Known divergence. Do not rename without explicit instruction.
- Canonical guard format — three-file architecture locked April 27, 2026: AMY_TECHNICAL_STANDARDS.md uses SCOPE GUARD (project-agnostic scope, Do NOT add project-specific content, Promotion rule). wizkoo/TECHNICAL_RUNBOOK.md uses PROJECT GUARD with explicit Scope (both codebases + pointer note), Do not apply cross-project warning, full Standards path. Learnkoo TECHNICAL_RUNBOOK.md uses PROJECT GUARD with Scope (Learnkoo only), Do not apply cross-project warning, full Standards path. Do not paraphrase or abbreviate guard text.
- Standards path in guards: C:\Users\amyog\Desktop\wizkoo\AMY_TECHNICAL_STANDARDS.md — full absolute path used in both project guards. Do not shorten to filename-only.
- Band-Name Pairing Rule (locked April 29, 2026): band name must always appear with age range on any public-facing surface. Format: Name · Ages X-Y (e.g. Wonderer · Ages 3-4, Apprentice · Ages 5-6, Artisan · Ages 7-9, Scholar · Ages 10-12). Reserved bands follow same pattern when shipped. The Luminary takes no age pairing. Architecture-level lock — not a copy preference. Do not render bare band names on any public surface.
- cover_quality field (locked April 29, 2026): TEXT DEFAULT 'standard' CHECK (cover_quality IN ('featured','standard','hidden')). Featured cluster in renderFeaturedCluster() gates exclusively on cover_quality = 'featured'. If no featured book is available for a band slot, that slot is omitted entirely — never fall back to standard-quality books. Starter set: 9 books as of April 29, 2026. Any expansion requires a curator pass, not a code change.
- Two-tier cover height system (locked April 29, 2026): band grid cards: height: min(180px, 25vh); featured cluster cards: height: min(280px, 35vh). Both: object-fit: contain; background: var(--linen) for letterbox fill on non-portrait covers. The min() function self-adjusts across viewport sizes including 200% display scaling. Do not revert to fixed-px heights or aspect-ratio approach.

---

═══════════════════════════════════════
LAYER 3 — SYSTEM MAP
Read when you need to find a file, understand codebase structure,
or check environment setup and deployment configuration.
═══════════════════════════════════════

## CODEBASE LOCATIONS

Marketing Site
  Local path: C:\Users\amyog\Desktop\wizkoo
  Deploys to: wizkoo.com via Netlify

Plan Generator
  Local path: C:\Users\amyog\Desktop\wizkoo-plan-generator
  Deploys to: wizkoo.com/plan via Vercel

Cross-Reference Rule:
When a task requires a value from the other codebase, navigate to that
local path, open the source file, read the value exactly as written,
copy it exactly. Never approximate. Never guess. Always read from source.

---

## CRITICAL FILE MAP — MARKETING SITE

Root-level pages (every HTML file is a self-contained page):
  index.html          Homepage. Hero, plan split, same-room, games band, FAQ.
                      Philosophy section removed (April 26, 2026). Firefly JS inline.
  about.html          About page.
  ages.html           Age guide. Locked environment: Linen.
  contact.html        Contact form.
  pricing.html        Pricing. Environment: Linen. CTA firefly "fix pending".
  esa.html            Education Savings Account page (~34 KB).
  games.html          Games hub.
  library.html        Book library. Environment: Night Sky.
  methodology.html    The Science. 8 sections + philosophy section (added April 26, 2026)
                      as final section before footer. Fraunces + Plus Jakarta Sans loaded
                      for philosophy styles. .phi IntersectionObserver in inline JS.
  the-open-seat.html  The Open Seat. Environment: Day Sky. LOCKED FINAL.
  themes.html         Themes to Explore. 70 curated weekly themes, 4 age stages
                      (Wonderer 3-4, Apprentice 5-6, Artisan 7-9, Scholar 10-12).
                      Expand interaction per row. 7 Heads Up lead lines (sensitive
                      themes). 5 JSON-LD blocks. Landscape-short viewport fix.
                      Environment: Linen. Route: /themes (301 from themes.html).
                      Shipped April 26, 2026.
  what-we-believe.html Philosophy/beliefs page.
  scope.html          Scope document.
  privacy.html        Privacy policy.
  terms.html          Terms of service.
  404.html            Error page.
  README.md           Points to this Technical Runbook. First file any AI or developer
                      reads when opening the repo.
  SECTION_3_BASELINE_2026-04-22.md
                      Known-good baseline snapshot for Section 3 (ec-scenario)
                      captured April 22, 2026. All CSS line numbers, active query
                      logic, locked values. Superseded structurally by TIER 1–3 in
                      Layer 5, but retained as standalone restore reference.

Config and tooling:
  CLAUDE.md           Claude Code project instructions. Dev server and Playwright workflow.
  package.json        Node dependencies: serve, @playwright/test, pg.
  netlify.toml        Netlify config: /plan proxy redirect to Vercel.
  _redirects          Netlify redirect rules (clean URL rewrites, .html removal).
  serve.json          Local dev server config.
  robots.txt          SEO robots.
  sitemap.xml         XML sitemap.

CSS directory (C:\Users\amyog\Desktop\wizkoo\css\):
  tokens.css          Root CSS custom properties. Single source of truth for all
                      design tokens. All pages import this first.
  base.css            Global reset, custom cursor, wordmark, primary/secondary
                      buttons, skip-nav. (~4.9 KB)
  footer.css          Footer styles. Primarily nav resets inside footer context
                      and .footer-fade gradient transition zone.
  library.css         Library and book pages. Dark space theme, star field,
                      age band selector, filter pills, book grid, book cards,
                      book detail (.bk-*), modal. (1146 lines, ~30 KB)
  games.css           Games pages: hub cards, showcase hero, feature blocks,
                      postcard grid, element cards, CTA section. (~6.8 KB)

Components (C:\Users\amyog\Desktop\wizkoo\components\):
  nav.js              SINGLE SOURCE OF TRUTH for site navigation.
                      Injects canonical nav into #wizkoo-nav.
                      Contains all nav CSS in injected <style id="wn-styles">.
                      (~16.3 KB, 403 lines)
  footer.js           SINGLE SOURCE OF TRUTH for site footer.
                      Injects canonical footer into #site-footer.
                      Contains all footer CSS in injected <style id="wf-styles">.
                      Contains star field JS generator (lines 322–344).
                      (~15 KB, 346 lines)

JavaScript (C:\Users\amyog\Desktop\wizkoo\js\):
  library.js          Library page filtering logic. (~25 KB)
  library-book.js     Individual book detail page logic. (~19.6 KB)
  reveal.js           IntersectionObserver scroll reveal. (577 bytes)
  supabase-config.js  Supabase client initialization. (510 bytes)

Scripts (C:\Users\amyog\Desktop\wizkoo\scripts\):
  screenshot.js       Playwright screenshot automation. Full-page screenshots for QA.
                      Run with: node scripts/screenshot.js
  build-esa-pages.py  Generates ESA content pages.
  import-library.js   Bulk library data import.
  (29 total scripts — data pipeline and build tooling)

ESA pages (C:\Users\amyog\Desktop\wizkoo\esa\):
  One subdirectory per US state (50 total), each with index.html.
  Generated pages. Do not edit manually.

---

## CRITICAL FILE MAP — PLAN GENERATOR

Root config:
  package.json        Next.js 16.2.2, React 19.2.4. Key deps: @anthropic-ai/sdk
                      0.82.0, @clerk/nextjs 7.0.8, Supabase, Drizzle ORM,
                      framer-motion 12.38.0. Package manager: pnpm only.
  next.config.ts      basePath: /plan. Exposes NEXT_PUBLIC_BASE_PATH=/plan.
  tsconfig.json       Path alias @/* → ./src/*. Target ES2017. Strict mode.
  drizzle.config.ts   ORM migrations from /drizzle directory.
  vercel.json         Vercel deployment config.

Global design tokens:
  src/app/globals.css Three-layer token system (primitives → semantic → component).
                      Contains all keyframe animations and utility classes. (~1444 lines).

App routes (src/app/):
  layout.tsx                Root layout: fonts, providers.
  (app)/dashboard/          Authenticated dashboard.
  (app)/generate/spectacle/ Loading animation during plan generation.
    SpectacleVisualLayer.tsx  9-subsystem spectacle (1157 lines).
  (app)/onboarding/         5-step intake flow.
    page.tsx                  Reads URL params at lines 474–495.
  (app)/plans/[id]/         Plan view and print routes.
  (app)/orbit-reports/      Weekly learning reports.
  (app)/settings/           User settings.
  (marketing)/              Unauthenticated pages (landing, pricing, legal).
  api/                      Next.js App Router API route handlers.

Components (src/components/):
  GenerationSpectacle.tsx   Canvas-based plan generation animation. 1293 lines.
  Footer.tsx                Plan generator footer. 107 lines.
  NavBar.tsx                Authenticated nav (Dashboard, Settings). 128 lines.

Other key source dirs:
  src/lib/            AI, DB, email, auth utilities.
  src/types/          TypeScript definitions.
  src/hooks/          Custom React hooks.
  src/data/           Static JSON learning progressions.
  drizzle/            Database migration files.

---

## ENVIRONMENT VARIABLES

MARKETING SITE (C:\Users\amyog\Desktop\wizkoo)
  No .env files. No build step. No server-side secrets in the static site itself.

  Supabase credentials: window globals in C:\Users\amyog\Desktop\wizkoo\js\supabase-config.js
    WIZKOO_SUPABASE_URL      — Supabase project URL (intentionally public-facing)
    WIZKOO_SUPABASE_ANON_KEY — Supabase anon/public key (intentionally public-facing)
    Row Level Security (sql/library-schema.sql) controls data access.

  Netlify Functions (set in Netlify Dashboard — NOT committed to repo):
    OPENAI_API_KEY        — OpenAI Moderation API (Layer 3 theme content moderation).
                            Used by netlify/functions/validate-theme.js.
    NOTION_API_KEY        — Notion API key for rejected theme logs.
    NOTION_MODERATION_DB_ID — Notion database for moderation logs.
                            Value: c8506fad-4656-4dac-b0a0-13aed19067be
    IP_HASH_SALT          — MUST NEVER ROTATE. Rotating breaks repeat-offender
                            hash comparability across all historical log entries.
    RESEND_API_KEY        — Resend API key for weekly moderation digest email.
    RESEND_FROM_EMAIL     — Value: moderation@wizkoo.com
    ADMIN_EMAIL           — Value: amy@wizkoo.com

  Source commits: 857b057 (Layer 1 implementation), b042e35 (BLOCKLIST_EXACT dual-tier).

PLAN GENERATOR (C:\Users\amyog\Desktop\wizkoo-plan-generator)
  Source: .env.example (22 variables). All secrets in .env.local (never committed).

  Database:
    DATABASE_URL          — Postgres connection string (pooler via Supabase)
    DIRECT_URL            — Direct DB URL for drizzle-kit migrations.
                            Must use db.{ref}.supabase.co:5432, NOT pooler host.

  Clerk Authentication:
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    CLERK_SECRET_KEY
    CLERK_WEBHOOK_SECRET
    NEXT_PUBLIC_CLERK_SIGN_IN_URL     — Set to /sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_URL     — Set to /sign-up

  Stripe Payments:
    STRIPE_SECRET_KEY
    STRIPE_WEBHOOK_SECRET
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    STRIPE_MONTHLY_PRICE_ID
    STRIPE_ANNUAL_PRICE_ID

  AI:
    ANTHROPIC_API_KEY    — Claude API key (main plan generation + orbit reports + safety)

  Email:
    RESEND_API_KEY       — Resend transactional email service

  Error tracking:
    SENTRY_DSN           — Sentry project DSN

  Analytics:
    POSTHOG_API_KEY      — PostHog product analytics

  Rate limiting:
    UPSTASH_REDIS_REST_URL
    UPSTASH_REDIS_REST_TOKEN

  Cron job auth:
    CRON_SECRET          — Bearer token checked by all four /api/cron/* routes

---

## CONTENT MODERATION ARCHITECTURE

Applies to: netlify/functions/validate-theme.js,
            index.html (client-side IIFE),
            netlify/functions/moderation-digest.js

Three-layer architecture. Every theme submission passes all three layers.

LAYER 1 — CLIENT-SIDE BLOCKLIST (index.html)
  ~100 terms. Evaluated before any network request.
  Matching: word-boundary regex (\bterm\b).
  Leetspeak normalization applied first: 0→o, 3→e, 1→i and l, 4→a, 5→s, @→a, !→i
  Dual-tier structure:
    BLOCKLIST       — word-boundary match. For terms that should never appear.
    BLOCKLIST_EXACT — full-input match only. For terms like "weed", "murder" that
                      allow legitimate phrased use but reject as standalone themes.

LAYER 2 — SERVER-SIDE BLOCKLIST (netlify/functions/validate-theme.js)
  Same blocklist as Layer 1, re-run server-side. Fail-closed: 3-second timeout.

LAYER 3 — OPENAI MODERATION API (validate-theme.js)
  Endpoint: https://api.openai.com/v1/moderations
  Threshold: topScore > 0.5 OR flagged === true → reject.
  Timeout: 3 seconds. On timeout, submission is blocked (fail-closed).

REJECTION LOGGING
  Notion database: NOTION_MODERATION_DB_ID c8506fad-4656-4dac-b0a0-13aed19067be
  Fields: Theme, Timestamp, Layer, IP Hash, Status.

WEEKLY DIGEST
  netlify/functions/moderation-digest.js sends weekly summary via Resend.

FILES AFFECTED
  index.html                              — Layer 1 IIFE (client blocklist)
  netlify/functions/validate-theme.js     — Layers 2 and 3
  netlify/functions/moderation-digest.js  — Weekly Resend digest

---

## DEPENDENCY INVENTORY

MARKETING SITE
  devDependencies (3):
    @playwright/test  ^1.58.2   — Playwright test runner (screenshot automation)
    pg                ^8.20.0   — PostgreSQL client (library data import scripts)
    serve             ^14.2.6   — Local static dev server (npm run serve)
  No runtime dependencies. Static site. No build step.
  Package manager: npm.

PLAN GENERATOR
  Package manager: pnpm ONLY. (preinstall script enforces this.)
  Node required: >=20.0.0

  Key dependencies:
    next                16.2.2     — PINNED — do not auto-upgrade
    react               19.2.4     — PINNED — matches Next.js 16 requirement
    react-dom           19.2.4     — PINNED
    @anthropic-ai/sdk   ^0.82.0
    @clerk/nextjs       ^7.0.8
    @sentry/nextjs      ^10.47.0
    @supabase/supabase-js ^2.101.1
    @tanstack/react-query ^5.96.1
    @upstash/ratelimit  ^2.0.8
    @upstash/redis      ^1.37.0
    drizzle-orm         ^0.45.2
    framer-motion       ^12.38.0
    posthog-js          ^1.364.7
    posthog-node        ^5.28.11
    resend              ^6.10.0
    stripe              ^22.0.0
    zod                 ^4.3.6
    zustand             ^5.0.12
    (+ clsx, nanoid, postgres, qrcode.react, svix, tailwind-merge)

  devDependencies:
    @tailwindcss/postcss  ^4
    drizzle-kit           ^0.31.10
    eslint-config-next    16.2.2   — PINNED to match Next
    tailwindcss           ^4
    typescript            ^5

  PIN NOTE: next@16.2.2, react@19.2.4, react-dom@19.2.4, eslint-config-next@16.2.2
  are intentionally pinned. Do not upgrade without a dedicated upgrade session.

---

## DEPLOYMENT PROTOCOL

MARKETING SITE → Netlify (wizkoo.com)
  Config file: C:\Users\amyog\Desktop\wizkoo\netlify.toml
  Publish directory: . (repo root — static files served directly)
  Build command: none
  Deploy trigger: push to main branch on GitHub (Ethos25/Wizkoo)

  Proxy rules (netlify.toml):
    /plan      → https://wizkoo-plan-generator.vercel.app/plan (200 proxy)
    /plan/*    → https://wizkoo-plan-generator.vercel.app/plan/:splat (200 proxy)
  Legacy redirects (301):
    /planner → /plan  |  /planner.html → /plan
    /what-we-believe.html → /what-we-believe
    /games.html → /games  |  /methodology.html → /methodology
  Library book detail rewrite (200): /library/:slug → /library/book.html

  Deploy checklist:
    1. Ensure TECHNICAL_RUNBOOK.md changes are committed
    2. Push to main: git push
    3. Netlify auto-deploys within ~60s
    4. Verify at wizkoo.com — no build logs to check

PLAN GENERATOR → Vercel (wizkoo.com/plan)
  Config file: C:\Users\amyog\Desktop\wizkoo-plan-generator\vercel.json
  Build command: pnpm build (next build)
  basePath: /plan (set in next.config.ts)
  Deploy trigger: push to master branch

  Cron jobs (vercel.json):
    orbit-report        — 0 6 * * 0   (Sundays 6am UTC)
    plan-lifecycle      — 0 3 * * *   (Daily 3am UTC)
    auth-reconciliation — 0 7 * * 1   (Mondays 7am UTC)
    re-engagement       — 0 14 * * *  (Daily 2pm UTC)
  All cron routes validate CRON_SECRET bearer token before executing.

  Deploy checklist:
    1. Ensure pnpm build passes locally: pnpm build
    2. Push to master: git push
    3. Monitor Vercel dashboard for build logs (~2-3 min)
    4. Verify at wizkoo.com/plan after deploy completes

---

═══════════════════════════════════════
LAYER 4 — DESIGN SYSTEM
Read before touching any visual element, color, type,
motion, or surface. All Wizkoo design values live here.
═══════════════════════════════════════

## SURFACE ARCHITECTURE — THREE WORLDS, ONE DOOR

World 1 — Linen: The parent's table
  Pages: Plan Generator, The Price, The Ages, Homepage (TBD)
  The parent is in control here.

World 2 — Night Sky: The child's universe
  Pages: The Library, The Science, The Games
  Background: radial-gradient(ellipse at 50% 45%, #182848 0%, #101830 70%)
  A flat dark reads as a wall. A graduated dark reads as a room.

World 3 — Day Sky: The threshold
  Pages: The Open Seat (anchor). Homepage under consideration.
  Scarce by design. Adding pages requires design session + Light Standard v5.

Universal Footer: Every page. No exceptions.
  Source file: C:\Users\amyog\Desktop\wizkoo\components\footer.js
  Background base: #0C1020
  Full CSS (exact from footer.js lines 23–41, #wizkoo-footer rule):
  background:
    radial-gradient(ellipse 100% 20% at 50% 0%,
      rgba(232, 175, 56, 0.06) 0%,
      transparent 100%),
    radial-gradient(ellipse at 50% 45%,
      rgba(24, 40, 72, 0.60) 0%,
      rgba(16, 24, 48, 0.30) 70%),
    repeating-linear-gradient(
      90deg,
      transparent, transparent 59px,
      rgba(255,255,255,0.012) 59px,
      rgba(255,255,255,0.012) 60px
    ),
    #0C1020;
  Four layers:
    Layer 1: Saffron sun bleed — ellipse 100% 20% at 50% 0%, rgba(232,175,56,0.06)
    Layer 2: Deep space center glow — rgba(24,40,72,0.60) → rgba(16,24,48,0.30)
    Layer 3: Pinstripe texture — repeating 60px vertical lines, rgba(255,255,255,0.012)
    Layer 4: Base — #0C1020 (NOT #101830)
  Note: The saffron sun layer (Layer 1) must be present. Earlier versions omitted it.
  STAR FIELD: footer.js lines 322–344. 120 stars. IS THE SOURCE OF TRUTH.

---

## ENVIRONMENT MAP (locked April 12, 2026)

  Homepage            | TBD          | UNRESOLVED (linen only OR multi-surface)
  The Plan Generator  | Linen        | Locked
  The Price           | Linen        | Locked
  The Ages            | Linen        | Locked (reassigned from Day Sky in v4)
  The Open Seat       | Day Sky      | Locked — NEVER CHANGE. Page is final.
  The Library         | Night Sky    | Locked
  The Science         | Night Sky    | Locked
  The Games           | Night Sky    | Locked
  Footer              | Universal    | Locked — every page, no exceptions

Rule: New pages do not get built until their environment is assigned above first.

---

## COLOR SYSTEM — THE TRIAD

SAFFRON (canonical brand accent)
  #E8AF38
  The ONE accent color. Appears wherever the Wizkoo brand is present.
  Never adjusted for any surface. Never lightened for dark. Never darkened for light.
  If saffron does not read, the surface is wrong — not the saffron.
  PRECIOUS. Small doses. Never as a background surface. Never geographic.
  Product variants (apps only — not brand):
    Elementum gold: #FFD54F
    Atlas amber: #D4884A

LINEN (the warm surface you trust)
  #F2F0EA — Primary background
  #FAFAFA — Paper (card surfaces)
  #ECEAE3 — Warm BG (section backgrounds)
  #E0DED6 — Rule (borders)
  Emotional register: trust, warmth, the parent's domestic world.

ULTRAMARINE (the cool architecture that holds everything)
  #0C1020 — Ink (96% dark). All text, borders, card outlines.
  #0C1428 — Sidebar/overlay. Deepest UI layer. Modal backgrounds.
  #101830 — App background base (Atlas, Elementum, night sky pages).
  #182848 — App background center glow. Creates planetarium effect.
  rgba(12,16,32,0.95) + backdrop-filter blur — Nav/footer.
  #1A2A5A — Link hover, focus rings, subtle UI accents in apps.
  #0A41B2 — Cursor phenomenon (exclusion-blend of saffron on linen).
             ONLY at point-scale: cursor, task dots, focus rings. NEVER a surface.
  #7898D0 — Atlas ocean.

DAY SKY (the threshold — the open world between parent and child)
  Locked April 12, 2026. The sky at high noon.
  Sky background gradient:
  linear-gradient(180deg,
    #1A4EC2 0%, #1E54C6 8%, #2260CC 18%,
    #2868CC 30%, #2E6ECE 42%, #306CCC 54%,
    #2C68C6 64%, #2860B8 74%, #2054A8 84%,
    #174496 92%, #123485 100%)
  Sky midpoint reference: #2868CC
  DEPRECATED — NEVER USE: #1848B8

  Sun corona:
  radial-gradient(ellipse 90% 60% at 50% -5%,
    rgba(200,130,0,0.90) 0%, rgba(232,175,56,0.72) 8%,
    rgba(232,175,56,0.48) 20%, rgba(232,175,56,0.24) 36%,
    rgba(220,162,38,0.08) 54%, transparent 70%)

  Sun disc:
  radial-gradient(ellipse 22% 18% at 50% -2%,
    rgba(255,255,220,0.85) 0%, rgba(255,240,140,0.65) 18%,
    rgba(232,175,56,0.45) 38%, transparent 65%)

  Text on day sky:
    Primary: #FAFAFA  |  Secondary: rgba(255,255,255,0.42)
    Eyebrow/label: rgba(255,255,255,0.30)  |  Saffron accent: #E8AF38 (unchanged)

---

## TYPOGRAPHY SYSTEM

Marketing Site (Wizkoo):
  Sora — Display headlines, hero text, CTA buttons
    Weights: 200, 300, 700, 800 ONLY. Weights 400, 500, 600 never appear in headlines.
  Inter — Body, UI, descriptions, form fields, prose
  Space Mono — Labels, eyebrows, nav, buttons, micro-copy (uppercase, letterspaced)

Apps:
  Atlas: DM Serif Display + Inter + Space Mono
  Elementum: Outfit (900/700) + Quicksand (500) + Inter + Space Mono

NO OTHER TYPEFACE ENTERS ANY CODEBASE. If found, remove it.

Sora Weight System:
  200 — light display lines
  300 — body and subtext
  700 — saffron accent lines
  800 — bold headline lines

Eyebrow Treatment (universal — every page, every section header):
  Font: Space Mono, 10px, weight 400, letter-spacing 0.14em, uppercase
  On linen: rgba(12,16,32,0.45)
  On day sky: rgba(255,255,255,0.30)
  On night sky: #E8AF38

Saffron Rule (above every eyebrow on every hero section):
  Width: 32px. Height: 1.5px. Background: #E8AF38.
  Margin-bottom: 12px. Same on every surface. No exceptions.

---

## MOTION IDENTITY

Wizkoo:     cubic-bezier(0.16, 1, 0.3, 1) — Editorial. A page turning.
Elementum:  cubic-bezier(.34, 1.56, .64, 1) — Cosmic play. Spring bounce.
Atlas:      cubic-bezier(.22, .68, 0, 1.04) — Compass precision.
Snap (Plan Generator UI): cubic-bezier(0.22, 1, 0.36, 1) — 280ms state changes.

---

## CROSS-SYSTEM CONSISTENCY — FIVE IMMUTABLE ELEMENTS

Pixel-identical across linen, night sky, and day sky. No exceptions.

1. Typefaces: Sora + Space Mono + Inter on marketing. No others.
2. Saffron: #E8AF38 exactly. Never adjusted per surface.
3. Eyebrow treatment: Space Mono, 10px, 0.14em, uppercase. Surface-appropriate color.
4. Saffron rule: 32px, 1.5px, #E8AF38. Above every hero eyebrow.
5. Nav: one treatment, all pages. Never transparent. Never surface-matched.

---

## NAV SYSTEM (v4.1 — final locked spec, April 12, 2026)

NAV STATUS: DELIBERATE HOLD — April 17, 2026
Do not touch the nav in any session that does not explicitly state
"this is the nav session."

QUESTION 1 — SPEC VS IMPLEMENTATION
Light Standard specifies frosted glass nav. Deployed code is solid rgba(12,16,32,0.96).
Amy must decide which is correct.

QUESTION 2 — MARKETING NAV ITEM INVENTORY
The full item list has not been finalized. Do not add or remove items without explicit instruction.

QUESTION 3 — PLAN GENERATOR NAV ITEM INVENTORY
Serves authenticated parents only. Item list not finalized.

QUESTION 4 — VISUAL RELATIONSHIP BETWEEN THE TWO NAVS
Whether both navs share visual treatment has not been decided.

Source files:
  Marketing nav:       C:\Users\amyog\Desktop\wizkoo\components\nav.js (403 lines)
  Plan generator nav:  C:\Users\amyog\Desktop\wizkoo-plan-generator\src\components\NavBar.tsx (128 lines)

Nav Bar CSS — ACTUAL CURRENT CODE (nav.js lines 90–105, .nav rule):
  height: 52px; margin: 0; padding: 0 40px;
  position: relative; display: flex; align-items: center; justify-content: space-between;
  background: rgba(12,16,32,0.96); backdrop-filter: none; -webkit-backdrop-filter: none;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  box-shadow: 0 1px 0 rgba(255,255,255,0.08), 0 4px 24px rgba(12,16,32,0.08);
  isolation: isolate; pointer-events: auto;

Container sticky behavior (nav.js lines 274–276):
  #wizkoo-nav: position:sticky; top:-30px; z-index:20;

Nav links (.nav-link, lines 167–196):
  font-family: 'Space Mono', monospace; font-weight: 400; font-size: 7.5px;
  letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.65);
  ::after underline: height 1px, background #E8AF38, width:0 → 100% on hover

Nav links are absolute-centered (.nav-center, lines 153–164):
  position: absolute; left: 50%; transform: translateX(-50%); gap: 26px.

Nav CTA — ACTUAL CURRENT CODE (ghost style, light Standard says filled — see Known Bug 2):
  font-family: 'Sora'; font-weight: 700; font-size: 9px; letter-spacing: 0.07em;
  padding: 8px 18px; background: transparent; color: #E8AF38;
  border: 1px solid rgba(232,175,56,0.65);

Announcement Bar — ACTUAL CURRENT CODE (nav.js lines 58–87):
  height: 30px; background: rgba(12,16,32,0.44); backdrop-filter: blur(14px);
  Text: Space Mono, 7px, letter-spacing 0.28em, uppercase
  Text color (non-homepage): rgba(12,16,32,0.75) ← DARK INK (see Known Bug 1)
  Text color (homepage only): rgba(232,175,56,0.75) ← saffron via inline override

Nav Wordmark (nav.js lines 131–148):
  font-family: 'Sora'; font-weight: 800; font-size: 17px; letter-spacing: -0.04em;
  'k': color: var(--saffron), rotate(8deg), transform-origin bottom center;

Mobile (<768px): center nav hidden, hamburger shown.
IMPLEMENTATION WARNING: Parent overflow:hidden clips position:sticky. Verify no parent
above #wizkoo-nav has overflow:hidden. If nav disappears on scroll, that is the cause.

---

## TEXT COLOR HIERARCHY — DARK SURFACES

Three planes at rest:
  Foreground: #F0F2F8 — Names, titles, headlines (always visible)
  Midground:  #C8CDDA — Body text, descriptions (always visible)
  Background: #8C91A5 — Labels (always visible)

On engagement (two more):
  Meta:   #8C91A5 — Dates, progress, counters
  Ghost:  #50556E — Ambient detail

Accent (moments only): #E8AF38
Maximum five text treatments on any single viewport.
Why #F0F2F8 not white: Pure white floats on ultramarine. Cool-tinted white sits.

---

## THE $200 STANDARD (Quality Floor Directive)

Source document (Notion): 338335a8d33281f699d4d705f973d430
Read the full document before any build session on the plan generator.

### What $200 Feels Like

You know the feeling when you walk into a hotel and within 3 seconds you know it
costs $400 a night? Nobody told you the price. The lighting is warmer than it needs
to be. The spacing is more generous than it needs to be. Every surface communicates:
someone spent more time on this than they had to.

That is what Wizkoo must feel like.

A parent opens the app. Within 3 seconds, before they read a word:
the linen warmth. The weight of the typography. The saffron that appears
in exactly two places and nowhere else. The silence where other apps
would have confetti. The space between elements that says "we chose not to cram more in."

They don't think "$200 product." They feel "this is unusually good."
Then they see $50 and the gap between what they feel and what they pay
becomes the story they tell their friend. THAT GAP IS THE PRODUCT.

### What Kills the $200 Feeling (instantly, not gradually)

A rounded corner where everything else is sharp. Dead.
A system font where Sora should be. Dead.
A green checkmark in a product that uses saffron. Dead.
A "Loading..." where a breathing saffron dot should be. Dead.
A bounce animation where editorial easing should be. Dead.
An error message that says "Oops! Something went wrong!" Dead.
A default Tailwind gray where the warm paper-crease border should be. Dead.

One plastic cup and the entire illusion collapses.
"Style the card nicely" is how plastic cups get in.
"Paper background (#FAFAFA), 1.5px border in #0C1020, 8px saffron offset
pseudo-element shadow, sharp corners (2px), hover lifts translateY(-2px)
with cubic-bezier(0.16,1,0.3,1) while shadow stays planted" is how you prevent them.

### The Parent's Internal Monologue

SECOND 1:  "Oh. This is warm. This doesn't look like an app. Stationery."
SECOND 3:  "That font. Light but confident. Like a magazine, not a website."
SECOND 5:  "Gold. Not yellow. Just a touch of it. Expensive feeling."
SECOND 10: "The cursor changed. The card lifted. Someone built every detail."
MINUTE 1:  "It's using my child's name. In a sentence a person wrote. While I watch."
MINUTE 2:  "This plan looks like it came from a design studio. I want to print this."
MINUTE 3:  "This is $50? How is this $50?"

If any step breaks, the parent never reaches the last thought.

### The Prompt Standard

Before writing any Claude Code prompt, ask:
"Will this produce a surface a parent would screenshot and send to a friend?"

The answer must be "yes, because every color traces to a token, every font has
a specific weight, every animation has a named curve, and every pixel has a reason."

---

## VIEWPORT REALITY CONSTRAINTS

The global framework (five viewports, overflow/min-height coupling rule, section-height
rule, nav safe-zone rule) is in AMY_TECHNICAL_STANDARDS.md Section 5.

WIZKOO PRIMARY DEVELOPMENT ENVIRONMENT:
  window.innerWidth:   ≈756 CSS px
  window.innerHeight:  ≈396 CSS px
  devicePixelRatio:    2.625
  OS scaling:          Windows 200%
  Chrome zoom:         Below 100%

Chrome zoom inflation note: Chrome zoom below 100% inflates effective CSS layout
width. window.innerWidth ≈756 but effective CSS layout width may be ≥1100px.
Site renders at desktop breakpoints (≥768px) even though window.innerWidth suggests
narrow. Playwright screenshots do NOT replicate this inflation — always test at both
756×396 and 1440×396.

THE FOUR LAYOUT REGIME BREAKPOINTS (site-wide):
  Desktop overlay:  base styles (≥768px, no max-height limit)
  Mobile stack:     @media(max-width:767px)
  Landscape short:  @media(max-height:420px) and (min-width:600px)
  Short-wide:       @media(max-height:700px) and (min-width:768px)
  Cascade order is load-bearing: landscape short declared AFTER mobile stack.

FIVE-VIEWPORT VERIFICATION CLAUSE (use in VERIFICATION section of any prompt
touching homepage visual surface):
  "Open index.html in dev server. Verify at five target viewports per Layer 4
  Viewport Reality Constraints: (1) 1440×900 native, (2) 1280×540 compressed
  desktop, (3) 1440×396 Amy production environment, (4) 375×667 iPhone SE,
  (5) 430×932 iPhone 15 Pro Max. Submit button must be visible without scroll at
  compressed desktop and reachable within one scroll gesture on mobile. No section
  boundary bleed at any viewport. Report any viewport that fails."

DIAGNOSTIC PROTOCOL — run these checks IN ORDER before making CSS changes:

CHECK 1 — Get the actual viewport
  Have user paste into DevTools console:
    window.innerWidth + ', ' + window.innerHeight + ', ' + window.devicePixelRatio
  Production display returns: 756, 396, 2.625

CHECK 2 — Identify the active media query
  Is effective CSS layout width ≥768px? (Chrome zoom inflates past innerWidth)
  Does height ≤700px? → short-wide fires (padding:96px wins)
  Does height ≤420px AND effective width ≥600px? → landscape short fires (178px)
  Is innerWidth (raw) ≤767px? → mobile stack fires (position:static)
  If #2 and #3 both fire, #2 wins (declared later in source).

CHECK 3 — Verify dev server is serving current file
  Restart: npx serve . -p 3000

CHECK 4 — Verify user is viewing correct URL
  Must be: localhost:3000 — NOT file:/// or any mockup variant.

CHECK 5 — Playwright screenshots at user's actual CSS dimensions
  await p.setViewportSize({ width: 756, height: 396 });   // shows mobile stack
  await p.setViewportSize({ width: 1440, height: 396 });  // approximates inflated layout
  Force .visible class to bypass IntersectionObserver opacity gates:
    await p.evaluate(() =>
      document.querySelectorAll('.ec-scenario').forEach(el => el.classList.add('visible'))
    );

---

═══════════════════════════════════════
LAYER 5 — COMPONENT SPECS
Read when working on animated or interactive components.
Every spec here is locked — do not approximate from memory.
═══════════════════════════════════════

## GENERATION SPECTACLE — PLAN GENERATOR

Source files:
  Canvas animation component:
    C:\Users\amyog\Desktop\wizkoo-plan-generator\src\components\GenerationSpectacle.tsx
    1293 lines. Canvas-based. Four phases: firefly (0–6s) → portal (6–62s)
    → orbital (62s+) → convergence (when AI generation completes).
  Visual layer component:
    C:\Users\amyog\Desktop\wizkoo-plan-generator\src\app\(app)\generate\spectacle\SpectacleVisualLayer.tsx
    1157 lines. 9 subsystems: Nucleus Glow, Orbital Paths, Ember Dots,
    Breathing Dot, Resolve Transform, Crystallization Tone, Editorial Pacing,
    Signature Capture, Afterglow.

Background: Must match footer night sky exactly.
  Navigate to: C:\Users\amyog\Desktop\wizkoo\components\footer.js
  Read #wizkoo-footer background (lines 23–41). Copy it exactly.

Elements that may NEVER be touched in the spectacle:
  - Nucleus and glow effects
  - Orbital connector lines
  - Child name labels and positioning
  - Subject dot elements and animations
  - Theme headline, generation progress copy, saffron progress bar
  - Any timing, easing, or animation on existing elements

SpectacleVisualLayer phase states: idle | waiting | streaming | assembling |
  settling | crystallizing | complete | error

---

## FIREFLY — MARKETING SITE

Source file: C:\Users\amyog\Desktop\wizkoo\index.html
  DOM element: <div class="firefly" id="firefly"> at line 1152
  Main firefly JS: lines 1897–2159 (IIFE, runs immediately on DOMContentLoaded)
  CSS: lines 585–596 (inline <style> in index.html)
  CTA Firefly (#pricing section): lines 2356–2401 (separate IIFE)

State machine (6 states):
  waiting → birth → t_move ↔ t_pause → idle ↔ a_move ↔ a_flee
  waiting:  parked at spawn, 2s delay
  birth:    fade + scale in over 350ms
  t_move:   travel hop — quadratic bezier arc, 580–880ms per hop
  t_pause:  brief rest between hops, 200–480ms
  idle:     hovering in place, 800–1800ms. Two incommensurate sin frequencies
            (1.8 Hz + 2.9 Hz) → 2–3px vertical drift
  a_move:   autonomous hop inside play area, 42–68px, 600–900ms
  a_flee:   mouse within 80px → dart 42–68px away, 300–420ms, then idle

Spawn (lines 1931–1937):
  Origin: .nav-wm .wm-dot getBoundingClientRect().
  x = el.right + fontSize*0.09, y = el.top + fontSize*0.21

Glow system (lines 1975–1993):
  Flash: 0 → 1 in 80ms. Fade: 1 → 0.55 over 600–1000ms.
  Next flash interval: 2000–4000ms.
  Inner ring: rgba(232,175,56,0.25–0.75), 3–11px blur
  Outer ring: rgba(232,175,56,0.07–0.24), 7–18px blur

Flee (lines 2070–2082): Mouse within 80px → dart 42–68px away.

CTA Firefly — #pricing section (lines 2356–2401):
  One-shot. IntersectionObserver at 0.4 threshold.
  Spawns at left edge of .btn-main, drifts 2600ms then fades.
  Drift: x = sin(t*2.1)*14 + sin(t*4.7)*6 / y = cos(t*1.6)*10 + cos(t*3.3)*4
  Size: 5px circle, #E8AF38.

Mobile below 768px: hidden. prefers-reduced-motion: hidden.

---

## HOMEPAGE HERO — LOCKED STATE

Hero (Section 1): Full linen, full width. No split environments.
No entrance animation (removed permanently).

Left column (62%):
  Saffron rule: 32px, 1.5px, #E8AF38
  Eyebrow: "ONE PRICE. EVERY CHILD." Space Mono, 10px, letterspaced uppercase
  H1 span 1: "Personalized weekly" — Sora 200, rgba(12,16,32,0.72), display:block
  H1 span 2: "homeschool plans." — Sora 800, #0C1020, display:block, 192px
  H1 span 3: "And tracking." — Sora 700, #E8AF38, 0.65em. PERIOD. NEVER EXCLAMATION.
  Line break locked after "weekly": <br> tag, not browser-dependent.
  Subtext 1: "...so you never wonder what's missing." Sora 300, italic, rgba(12,16,32,0.52)
  Subtext 2: "Covers every domain..." Sora 300, rgba(12,16,32,0.72)

Right column (38%):
  Saffron left border: 2px, #E8AF38
  Label: "TELL US ABOUT YOUR FAMILY." Space Mono, 9px, rgba(12,16,32,0.38)
  Field 1: child name (text input)
  Field 2: age select — 1-12, NUMBERS ONLY, NO "years old"
  Field 3: theme text input
  Suggestion buttons: DINOSAURS / SPACE / OCEANS / ANCIENT EGYPT
    Space Mono, sharp corners, saffron on hover, NO EMOJI EVER
  Submit: "BUILD MY FAMILY'S WEEK →" — saffron fill, L-bracket detail
  Microcopy: "Have more kids? Add them on the next screen."
  Firefly: 3px, #E8AF38, breathing drift animation, 2s delay

Handoff URL:
  wizkoo.com/plan/onboarding?childName=[name]&childAge=[age]&theme=[theme]
  Parameters read in onboarding/page.tsx lines 474–495.

---

## ATLAS CONTINENT PALETTE (Montessori-verified, locked)

  Asia:          #E0C84A (yellow — NOT saffron, clearly distinct)
  North America: #D4884A (orange-amber)
  South America: #D06878 (deep rose)
  Europe:        #C05050 (terracotta-red)
  Africa:        #4A8A4A (forest green)
  Oceania:       #A07850 (earth brown, NOT green)
  Antarctica:    as-is (white/light)
  Ocean:         #7898D0 (bright watery blue — ultramarine family)

Saffron (#E8AF38) NEVER appears as a geographic color.

---

## SECTION 3 — "EVERYTHING CONNECTS" RESPONSIVE STANDARD

Global viewport rules (Tier 1 and Tier 2) are now in AMY_TECHNICAL_STANDARDS.md
Section 5. This section documents the Section 3 implementation reference only (Tier 3).

Section HTML root: <section class="ec-section"> line 1784
Two scenarios: .ec-scenario--turtle (line 1787) and .ec-scenario--space (line 1826)
Commit: cbac52e

SECTION CONTAINER:
  .ec-section    background:var(--ink)  padding:0  overflow:hidden     line 567
  .ec-inner      max-width:none  padding:0                              line 568
  .ec-scenario   position:relative  height:80vh  overflow:hidden        line 569

SCENARIO HEIGHT BY MEDIA QUERY:
  Base (≥768px, no height limit):                    80vh              line 569
  max-width:767px:                                   auto              line 628
  max-height:420px AND min-width:600px:              100vh             line 643
  max-height:700px AND min-width:768px (active):     100vh  ← CRITICAL  line 657

COPY COLUMN PADDING-TOP BY BREAKPOINT:
  Base desktop:                          172px   line 579
  Mobile stack (max-w:767px):             48px   line 630
  Landscape short (max-h:420, min-w:600): 178px  line 645
  Short-wide (max-h:700, min-w:768):       96px  line 658  ← production display

PROOF MATRIX (.ec-proofs):
  display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: repeat(3, auto);
  grid-auto-flow: column; column-gap: 4px; row-gap: 9px
  Flow: col 1 (rows 1-3) = Reading, Math, Science
        col 2 (rows 1-3) = Atlas, Art, Elementum

PHOTOGRAPH TREATMENT:
  Desktop: position:absolute; inset:0; overflow:hidden
  Mobile: position:relative; inset:unset; height:min(67vw,50vh); min-height:160px

SCROLL REVEAL STAGGER:
  Photo:    1.2s  delay 0s    |  Eyebrow:  0.4s  delay 0.5s
  Headline: 0.8s  delay 0.7s  |  Kicker:   0.8s  delay 0.7s
  Proofs 1–6: 0.4s, delays 1.3s–1.8s (0.1s stagger)
  Total composition reveal: 2.2s

SUBJECT COLORS:
  Reading:   Turtle #3848D0 / Space #2030A0
  Math:      Turtle #E8D800 / Space #9A8600
  Science:   Turtle #38B060 / Space #247840
  Atlas:     Turtle #F08A20 / Space #CC6000
  Art:       Turtle #8848E0 / Space #6030B0
  Elementum: Turtle #38B060 / Space #247840

---

═══════════════════════════════════════
LAYER 6 — FAILURE PREVENTION
Read before every session.
═══════════════════════════════════════

## WIZKOO-SPECIFIC FAILURE PATTERNS

Global failure patterns (1–12) are in AMY_TECHNICAL_STANDARDS.md Section 6.

PATTERN 8 — CLIENT/SERVER LIST DIVERGENCE
When a moderation rule exists in both a server function (validate-theme.js) and a
client-side IIFE (index.html), Claude Code will update one and not the other. The
two lists are independent copies — they do not share a module.
Prevention rule: Any change to BLOCKLIST or BLOCKLIST_EXACT must be applied to BOTH
files in the same commit. After editing either file, grep the other for the changed
term before committing. A commit that updates one list and not the other is
incomplete by definition.

---

PATTERN 9 — DOM INSPECTION DEFERRED TOO LATE
When a render anomaly is suspected (wrong element appearing in the wrong location),
the default diagnostic sequence runs outward — JS logic, API response, browser cache,
service worker, CDN headers — before ever inspecting the DOM to confirm where the
suspect element actually renders.
In the Phase 6C "Sheltie" investigation, six diagnostic rounds (API replication, JS
source audit, browser cache rules-out, service worker check, CDN headers, unique deploy
URL) all returned clean before DOM inspection revealed the element was never inside the
suspected DOM container to begin with. It was rendering in an adjacent section.
Prevention rule: DOM inspection of the actual suspect element is the FIRST diagnostic,
not the last. Open DevTools → Elements → locate the element → confirm its actual parent
container before running any other diagnostic. A render bug cannot be in the JS if the
JS is not writing to the location you think it is.

---

## PRESERVATION LOCKS REGISTRY
Enforces Standards §3.4 (Preservation Locks prompt section) via a session-start ambient registry, eliminating per-prompt recitation.

### WHY THIS SECTION EXISTS

Preservation locks are systems, files, or code sections that must not be modified
even when Claude Code believes a modification would improve things. Without a registry,
these locks live only in Amy's prompt context — listed manually every session.
Forgetting one produces a silent break discovered only when the broken system is
exercised. This registry moves locks from per-prompt recitation to session-start
ambient protection.

### HOW TO USE THE REGISTRY

Operator side (Amy): in the PRESERVATION LOCKS section of any prompt touching a
registered surface, reference the registry by name. Example: "Do not touch any item
in the Homepage Form Preservation Locks Registry." Do not re-list items inline.

Executor side (Claude Code): Layer 6 is loaded at session start. Every registered
lock is known from session open. If a prompt appears to touch a registered surface
but does not reference the registry, apply the registry proactively and confirm with
Amy before executing.

### HOMEPAGE FORM PRESERVATION LOCKS

Surface: the intake form on the homepage hero (index.html).
Registry version: v3.0 (2026-04-22). 35 items across Clusters A–F.
Items 1–25 anchored against commit 2087f59. Items 26–35 added 2026-04-21 evening.
Retired items (4, 10, 11, 14, 15, 25) remain as retirement markers.

ANCHORING CONVENTION: Every item lists semantic description (primary, stable),
element ID or selector (stable), and line number (drifts — re-verify each session).

CLUSTER A — STRUCTURAL LOCKS (SEO + ACCESSIBILITY)

Item 1  — Visually-hidden H1 for SEO. Selector: h1.visually-hidden. Line ~1565.
Item 2  — novalidate on both forms. All validation is JS-driven. Line ~1592, 1669.
Item 3  — Wiggly kid fieldset semantics. <fieldset> + <legend class="visually-hidden">
           + radio inputs with default checked on yes. Selector: fieldset[name="wigglyKid"].
Item 4  — RETIRED (2026-04-21 V14 Q6). Age combobox ARIA contract. Superseded by
           Item 26 (native number input stepper).

CLUSTER B — COPY LOCKS

Item 5  — H1 three-line composition: "Personalized weekly / homeschool plans. /
           And tracking." Three lines. Not two. Not merged. Selectors: .nh-h1-line1/2/3.
Item 6  — Subline: "...so you never wonder what's missing." Selector: .nh-subline.
Item 7  — Desk note kernel: "What your child can't stop talking about. Dragons.
           Tornadoes. Volcanoes." Three-noun cadence is the distinctive voice element.
Item 8  — Desk signature pair: "— THE WIZKOO DESK" plus dateline. Both halves required.
Item 9  — Proof line: "ONE PRICE · UP TO 4 CHILDREN" — locked wording, locked position.

CLUSTER C — THEME FIELD MECHANICS

Item 10 — RETIRES WITH V14. Theme-sizer auto-expand. Superseded by static placeholder.
Item 11 — RETIRES WITH V14. Rotating placeholder system. Superseded by tag chips.
Item 12 — Two-word cap via keydown. Hyphens and apostrophes are NOT word separators.
Item 13 — Paste sanitizer: collapses whitespace, takes first two tokens, uses
           execCommand('insertText') for cursor-aware insertion.

CLUSTER D — AGE INPUT MECHANICS

Item 14 — RETIRES WITH V14. Position:fixed anchoring for age panel.
Item 15 — RETIRES WITH V14. Scroll-close on capture phase.
Item 16 — Age range placeholder: 3-12. Status: RESOLVED automatically by V14 Prompt 1.
Item 26 — Age Stepper Native-First Contract. Native <input type="number"> with
           min=3, max=12, step=1, required, inputmode="numeric", autocomplete="off",
           aria-describedby="age-error". readonly attribute added (2026-04-22):
           no typing permitted. Steppers, wheel, keyboard arrows, touch-hold only.
           Selector: #f-age, .age-box, .stepper-decrement, .stepper-increment, #age-error.

CLUSTER E — SUBMIT VALIDATION CHAIN (THE CONTENT GATE)

Item 17 — Capture-phase submit intercept. Two listeners, two phases, one validationPassed
           flag. Do NOT consolidate without understanding this architecture.
Item 18 — Client blocklist with leet normalization. BLOCKLIST + normalizeLeet() + isThemeBlocked().
Item 19 — Exact-match blocklist. BLOCKLIST_EXACT + isExactBlocked(). Do NOT collapse into BLOCKLIST.
Item 20 — Server-side validation via /api/validate-theme (Netlify function). 3-second timeout.
Item 21 — Error UI states (UPDATED V14 Q7): two states — theme-error (blocked) and
           theme-network-error (timeout). Both use aria-live="polite". See-suggestions link RETIRED.
Item 22 — Blocked-theme recovery flow (UPDATED V14 Q7): clear input + show error + chip sweep.
Item 27 — Content Gate Tier Structure. Tier 0 = safety-critical (ZERO UI feedback).
           Tier 1 = age-appropriateness (chip sweep + saffron error). MUST SURVIVE.
Item 28 — 3-Second Server Validation Progress Signal. Saffron progress hairline animates
           during server validation. prefers-reduced-motion: static hairline. MUST SURVIVE.
Item 29 — Content Gate Error Register. saffron #B88414 text, NO red, NO exclamation,
           NO apology copy. Chip-row sweep 600ms on Tier 1 rejection. MUST SURVIVE.

CLUSTER F — GATE READY STATE + SAMPLE DISPLAY

Item 23 — Two-stage gate (PARTIALLY SUPERSEDED V14 Q8): progress state retained
           (single 3-second saffron hairline). Ready state: displays matched static
           sample week, not a generated plan.
Item 24 — Onboarding URL construction (CONTRACT EVOLVED V14 Q8+Q4):
           Children stored as array; passed via sessionStorage OR query params
           (decision pending). Email NOT captured at this handoff.
Item 25 — RETIRED (V14 Q8). Email capture moved to Phase 2 subscription checkout.
Item 30 — No Live Generation on Homepage Submit. Submit chain terminates at lookup
           + render only. NO calls to generation API in public-path code. MUST SURVIVE.
Item 31 — RETIRED (V14 Prompt 9). Homepage CTA Expectation Microcopy deleted.
           Grep for class "cta-note" in index.html must return zero matches.
Item 32 — Primary CTA Button Text: EXACTLY "See a sample week →". No substitutions.
           Load-bearing honesty under Q8 product model.
Item 33 — Sample Label Template: "This is a sample week for age [X]. Subscribe to
           build [Name]'s plan around what they said in the car." MUST SURVIVE.
Item 34 — Subscribe CTA: "Start [Name]'s plan →". Name bound to form input.
           Secondary link "How Wizkoo works" below (typographic, not button). MUST SURVIVE.
Item 35 — Email Capture at Subscription, Not Pre-Subscription. No email input on
           homepage or gate ready state. Grep for type="email" must return zero. MUST SURVIVE.
Item 36 — CTA + Sub-CTA Unit Integrity. Primary CTA and sub-CTA ("MORE KIDS? · ADD THEM NEXT")
           are one visual unit. They move together, align together. Never separate them
           independently. MUST SURVIVE.

### ADDING NEW REGISTRIES

Candidate surfaces for their own registries as they harden:
Plan Generator onboarding form, webhook handlers (Stripe, Clerk), cron jobs,
Elementum game state management (game.js), Atlas geographic data, safety.ts.

New registries are added via the Transfer Queue. Format: surface name, origin context,
numbered items with one-line rationale. Registries never shrink except by deliberate
decision logged in LOCKED DECISIONS.

---

## OPEN ITEMS (post-launch follow-up)

1. BRUSHSTROKE SVG ASSET — UPGRADE REQUIRED
   Current: placeholder quadratic bezier checkmark in .brushcheck elements (4 instances).
   What to do: Commission hand-drawn brushstroke checkmark, export as optimized SVG
     with stroke-dasharray/stroke-dashoffset for SMIL draw animation.
   Priority: Post-launch polish. Does not block launch.

2. css/components.css — FUTURE PAGES MUST LINK
   Current: linked from index.html and the-open-seat.html only.
   What to do: Every page using L-bracket CTA must link css/components.css.
   Prevention: Pre-flight checklist item for new page builds.

3. --expo EASING TOKEN — CONSOLIDATION REQUIRED
   Current: --expo in index.html inline :root; --ease-out-expo in css/tokens.css. Same curve.
   What to do: Link tokens.css from index.html. Remove --expo from inline :root.
   Priority: Dedicated tokens cleanup session. Coordinate with OPEN ITEM 6.

4. .lib-active-filters DUPLICATE — DEFERRED
   Current: defined twice in css/library.css (~line 228 and ~line 746).
   What to do: Audit both blocks. Consolidate if duplicate.
   Priority: Dedicated library.css cleanup session.

5. components.css line 48 — rgba(232,175,56,1) STILL HARDCODED
   What to do: Replace with var(--saffron) in @keyframes bracket-pulse 0%/100% stop.
   Note: rgba(232,175,56,0.9) at 50% stop has no matching token — leave hardcoded.
   Priority: Next token consolidation pass.

6. 8 HTML PAGES — INLINE :root INSTEAD OF LINKING tokens.css
   Pages: ages.html, contact.html, esa.html, pricing.html, privacy.html,
          terms.html, what-we-believe.html, the-open-seat.html.
   What to do: Add <link rel="stylesheet" href="css/tokens.css"> to each, then remove
     duplicate inline :root values. index.html is excluded (Preservation Lock item 18).
   Priority: Dedicated tokens cleanup session.

7. HOVER QUERY CENTRALIZATION INTO base.css — DEFERRED
   Current: All pages use consistent OR syntax (hover:none),(pointer:coarse) but
     declare it per-page instead of inheriting from css/base.css:29.
   What to do: Audit per-page blocks; remove those covered by base.css.
     Note: page-specific hover resets must remain per-page.
   Priority: Dedicated hover centralization session.

8. GOOGLE SEARCH CONSOLE — /themes INDEXING SUBMISSION PENDING
   What to do: GSC → wizkoo.com → URL Inspection → paste wizkoo.com/themes → Request Indexing.
   Priority: Amy to complete manually (requires browser login).

9. GOOGLE RICH RESULTS TEST — /themes PENDING
   What to do: search.google.com/test/rich-results → paste wizkoo.com/themes.
   Priority: Amy to complete manually.

10. ORPHANED SELECTORS IN index.html — CLEANUP DEFERRED
    (a) .philo-section rule (~line 1166): targets a class not in any HTML.
    (b) .phi in querySelectorAll (~line 2206): no .phi elements on homepage after section move.
    What to do: Remove both in the next Layer 1 dead code hygiene pass.

11. COVER URL VALIDATION PASS
    Current: library_books.cover_image_url values are not validated against live HTTP
      responses. Broken URLs were observed during Phase 6C curator pass. Books with
      broken URLs are invisible at /library due to the null-cover filter in state.allBooks.
    What to do: HTTP HEAD-check every library_books.cover_image_url; surface 4xx/5xx
      responses and entries with non-image content-types for re-sourcing or removal.
    Priority: Separate pass before next cover_quality curator expansion.

12. TRIPLE-TAG AUDIT — 76 POPULATION C BOOKS
    Current: 76 books carry the structural triple-tag default (3-4 + 5-6 + 7-9) assigned
      during Session 13 Phase 6 audit. Not all may genuinely scale across all three bands.
    What to do: Beth-led per-book confirmation pass. Example flagged by Amy during Phase 6C
      curator pass: How to Find a Fox (likely too late at 7-9). Estimated 30-45 minutes.
    Priority: Pre-next-library-iteration.

---

## ACCESSIBILITY (non-negotiable)

Global minimums: AMY_TECHNICAL_STANDARDS.md Section 7.

Wizkoo-specific:
prefers-reduced-motion: kills all particle effects. Opacity-only transitions.
All interactive elements: keyboard equivalents.
Dragon state changes: aria-live.
Tier transitions: aria-live='assertive'.
Contrast: #0C1020 on all surfaces must pass WCAG AAA (7:1) at body text size.
Audio: "gentle sounds" mode removes all sudden-onset sounds.

---

## PERFORMANCE (non-negotiable)

Global targets: AMY_TECHNICAL_STANDARDS.md Section 8.

Wizkoo target device: 2020 iPad Air, Safari, 3 tabs open.
No CSS filter:blur() on simultaneously visible tiles.
One orbiting particle per tile maximum on grid.
All animation loops pause via IntersectionObserver when offscreen.

---

═══════════════════════════════════════
LAYER 7 — DEEP REFERENCE
Read only when you need exact token values, API details,
or prompt system internals. Do not read on every session.
═══════════════════════════════════════

## CSS CUSTOM PROPERTIES — MARKETING SITE

Source: C:\Users\amyog\Desktop\wizkoo\css\tokens.css (62 lines, :root block)

Colors:
  --saffron:              #E8AF38                (line 3)
  --saffron-pale:         #FFF9EE                (line 4)
  --ink:                  #0C1020                (line 5)
  --paper:                #FAFAFA                (line 6)
  --warm-bg:              #ECEAE3                (line 7)
  --mid:                  #4A4850                (line 8)
  --faint:                #A8A6B0                (line 9)
  --rule:                 #E0DED6                (line 10)
  --linen:                #F2F0EA                (line 30)
  --section-light:        var(--linen)           (line 33)
  --section-warm:         var(--warm-bg)         (line 34)

Spacing:
  --section-pad:          80px                   (line 13)
  --section-pad-mobile:   48px                   (line 14)
  --content-pad:          48px                   (line 15)
  --content-pad-mobile:   24px                   (line 16)
  --max-width:            1200px                 (line 17)

Type scale:
  --hero-size:            4.8rem                 (line 20)
  --hero-size-mobile:     2.4rem                 (line 21)
  --h2-size:              2.8rem                 (line 22)
  --h2-size-mobile:       1.8rem                 (line 23)
  --body-size:            1.05rem                (line 24)
  --small-size:           0.95rem                (line 25)
  --tag-size:             0.6rem                 (line 26)
  --button-size:          0.78rem                (line 27)

Shadows:
  --shadow-soft:          0 4px 24px rgba(10,10,10,0.06)              (line 37)
  --shadow-card:          0 8px 32px rgba(10,10,10,0.08)              (line 38)
  --shadow-elevated:      0 16px 48px rgba(10,10,10,0.12)             (line 39)
  --shadow-saffron-glow:  0 8px 32px rgba(232,175,56,0.15)            (line 40)

Element family colors (Elementum app):
  --elem-nonmetal:        #5B8C5A                (line 43)
  --elem-noble-gas:       #7B68AE                (line 44)
  --elem-transition:      #4A7FB5                (line 45)
  --elem-metalloid:       #8B7355                (line 46)

Program colors:
  --prog-atlas:           #2D7A8A                (line 49)
  --prog-elementum:       var(--saffron)         (line 50)

Animation:
  --ease-out-expo:        cubic-bezier(0.16,1,0.3,1)                  (line 53)
  --ease-out-back:        cubic-bezier(0.34,1.56,0.64,1)              (line 54)
  --duration-normal:      400ms                  (line 55)
  --duration-slow:        700ms                  (line 56)
  --duration-reveal:      900ms                  (line 57)

Texture:
  --grain-opacity:        0.03                   (line 60)
  --noise-url:            SVG data URL (fractalNoise baseFrequency 0.9, 4 octaves) (line 61)

Additional tokens injected by nav.js into :root (lines 27–31):
  --expo:    cubic-bezier(0.16,1,0.3,1)   (duplicate of --ease-out-expo)
  --saffron: #E8AF38                       (duplicate — nav ensures fallback)
  --ink:     #0C1020                       (duplicate — nav ensures fallback)

---

## CSS CUSTOM PROPERTIES — PLAN GENERATOR

Source: C:\Users\amyog\Desktop\wizkoo-plan-generator\src\app\globals.css

LAYER 1: PRIMITIVE TOKENS (lines 13–125)

Colors — The Triad:
  --color-saffron:                    #E8AF38        (line 15)
  --color-saffron-hover:              #F0BD50        (line 16)
  --color-saffron-pressed:            #D4A030        (line 17)
  --color-ink:                        #0C1020        (line 18)
  --color-linen:                      #F2F0EA        (line 19)
  --color-paper:                      #FAFAFA        (line 20)
  --color-warm-bg:                    #ECEAE3        (line 21)
  --color-rule:                       #E0DED6        (line 22)

Colors — Ultramarine spectrum:
  --color-ultramarine-sidebar:        #0C1428        (line 25)
  --color-ultramarine-base:           #101830        (line 26)
  --color-ultramarine-glow:           #182848        (line 27)
  --color-ultramarine-mid:            #1A2A5A        (line 28)
  --color-ultramarine-cursor:         #0A41B2        (line 29)

Colors — Semantic states:
  --color-error:                      #E85A5A        (line 35)
  --color-warning:                    rgba(232,175,56,0.6) (line 36)

Colors — Text on light surfaces:
  --color-text-primary:               #0C1020        (line 39)
  --color-text-secondary:             #4A4850        (line 40)
  --color-text-tertiary:              #666666        (line 41)
  --color-text-muted:                 #999999        (line 42)
  --color-text-muted-aa:              #666666  (WCAG AA fix) (line 46)

Colors — Text on dark surfaces:
  --color-text-primary-dark:          #F0F2F8        (line 49)
  --color-text-body-dark:             #C8CDDA        (line 50)
  --color-text-meta-dark:             #8C91A5        (line 51)
  --color-text-ghost-dark:            #50556E        (line 52)

Colors — Dark surface elevations:
  --color-surface-sidebar:            #0C1428        (line 55)
  --color-surface-floor:              #101830        (line 56)
  --color-surface-card-dark:          #1A2440        (line 57)
  --color-surface-modal-dark:         #202C4A        (line 58)

Spacing (4px base):
  --space-xs: 4px  --space-sm: 8px  --space-md: 16px  --space-lg: 24px
  --space-xl: 32px  --space-2xl: 48px  --space-3xl: 64px  --space-4xl: 80px

Typography — font families:
  --font-display:    var(--font-sora, 'Sora', sans-serif)
  --font-body:       var(--font-inter, 'Inter', system-ui, sans-serif)
  --font-mono:       var(--font-space-mono, 'Space Mono', monospace)

Typography — size scale:
  --text-xs: 0.42rem  --text-sm: 0.48rem  --text-base: 0.72rem  --text-md: 0.82rem
  --text-lg: 0.92rem  --text-xl: 1.0rem   --text-2xl: 1.2rem    --text-3xl: 1.8rem
  --text-4xl: 2.4rem  --text-hero: clamp(2.25rem, 5vw, 4rem)

Animation — easings:
  --ease-editorial:  cubic-bezier(0.16,1,0.3,1)
  --ease-snap:       cubic-bezier(0.22,1,0.36,1)
  --ease-bounce:     cubic-bezier(0.34,1.56,0.64,1)

Animation — durations:
  --duration-instant: 80ms  --duration-fast: 150ms  --duration-normal: 280ms
  --duration-slow: 400ms    --duration-entrance: 600ms

Elevation — saffron offset shadows:
  --shadow-card:          8px 8px 0 var(--color-saffron)
  --shadow-card-hover:    12px 12px 0 var(--color-saffron)
  --shadow-button:        6px 6px 0 var(--color-saffron)
  --shadow-button-hover:  9px 9px 0 var(--color-saffron)

Border radius:
  --radius-none: 0px  --radius-sm: 2px  --radius-md: 4px  --radius-lg: 8px  --radius-full: 9999px

Z-index scale:
  --z-base: 0  --z-card: 1  --z-sticky: 10  --z-overlay: 100
  --z-spectacle: 200  --z-nav: 1000  --z-cursor: 999999

LAYER 2: SEMANTIC TOKENS (lines 129–150)
  --accent-primary:           var(--color-saffron)
  --bg-page:                  var(--color-linen)
  --bg-card:                  var(--color-paper)
  --bg-section-alt:           var(--color-warm-bg)
  --focus-ring-color:         var(--color-ultramarine-cursor)
  --nav-height:               48px
  --nav-bg:                   rgba(12,16,32,0.95)
  --blur-nav:                 12px

LAYER 3: COMPONENT TOKENS (lines 154–172)
  Plan card: --plan-card-bg, --plan-card-border-width: 1.5px, --plan-card-radius: var(--radius-sm)
             --plan-card-padding: var(--space-lg), --plan-card-shadow-offset: 8px
  Block card: --block-card-border-left: 2px solid var(--accent-primary)
  Intake:     --intake-max-width: 480px  --intake-progress-height: 2px  --intake-continue-height: 56px

SPECTACLE TOKENS (lines 176–252) — all prefixed --spectacle-*
  Full list in TECHNICAL_RUNBOOK.md Layer 7 (original). Abbreviated here:
  Nucleus Glow: opacity-min 0.04, opacity-max 0.06, opacity-spike 0.12, cycle-resting 6s
  Orbital Paths: stroke opacities 0.05/0.04/0.03/0.025, rotation-resting 120s
  Breathing Dot: size-birth 12px, size-evolved 6px, breathe-cycle 2s
  Tier Warmth: base 1.0, returning 1.1, veteran 1.15
  Ember Dots: size 5px, opacity-resting 0.4, opacity-flash 0.8, flash-duration 600ms
  Resolve Mode: clip-start circle(36% at 50% 50%), transform-duration 500ms
  Crystallization: freq-warm 196Hz (G3), freq-cool 247Hz (B3), volume 0.4
  Afterglow: bg-opacity 0.03, duration 3s

---

## EXTERNAL API SURFACE

ANTHROPIC / CLAUDE
  Client: src\lib\ai\client.ts — lazy singleton.
  Model pinned: claude-sonnet-4-20250514 (main generation).
  claude-haiku-4-5-20251001 for safety.ts contextual safety check.
  Plan generation: src\lib\ai\compose-prompt.ts → tool use via generate_weekly_plan
  Orbit reports: src\lib\ai\orbit.ts → structured JSON narrative generation
  Safety classifier: src\lib\ai\safety.ts → 6-category rubric via Haiku

SUPABASE (Database)
  Marketing site: window globals in js/supabase-config.js (anon key, public)
    Used for: library book queries, reading progress data
  Plan generator: @supabase/supabase-js via NEXT_PUBLIC_SUPABASE_* + Drizzle ORM
    Used for: user plans, family profiles, learning objectives, orbit reports
  Schema: drizzle/ directory (migration files)

CLERK (Authentication)
  Package: @clerk/nextjs
  Used in: middleware.ts, server components (currentUser()), API routes (auth())
  Webhook: syncs Clerk user events to Supabase via auth-reconciliation cron

STRIPE (Payments)
  Package: stripe (server), NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (client)
  Webhook: validates STRIPE_WEBHOOK_SECRET, processes subscription lifecycle events

RESEND (Email)
  Package: resend
  Used for: orbit report delivery, re-engagement emails, transactional emails

SENTRY (Error Tracking)
  Configs: sentry.client.config.ts, sentry.server.config.ts

POSTHOG (Analytics)
  Packages: posthog-js (client), posthog-node (server)
  Used for: product analytics, feature flags, session recording

UPSTASH REDIS (Rate Limiting)
  Packages: @upstash/redis, @upstash/ratelimit
  Protects: /plan/api/generate from abuse

---

## PROMPT TEMPLATE SYSTEM

Source directory: C:\Users\amyog\Desktop\wizkoo-plan-generator\src\lib\ai\

ASSEMBLY — compose-prompt.ts
  Static system prompt: t-system + t-safety + t-negative + t-schema + t-quality + t-progress
  Dynamic section: filtered learning objectives for children's age range
  User message: t-profile + t-theme + t-history + weekly volume
  Primary model: claude-sonnet-4-20250514
  Tool use: generate_weekly_plan (defined in tool-schema.ts)

TEMPLATES (src\lib\ai\templates\ — 9 files)
  t-system.txt   — Core role: Orbital Learning methodology, parent-facing tone,
                   three personalization tiers (new/returning/veteran)
  t-safety.txt   — Physical/developmental/content/materials safety rules by age range.
  t-negative.txt — Anti-patterns: generic activities, filler, jargon, passive screen.
  t-schema.txt   — Tool schema guidance: plan_header, clusters, blocks.
  t-quality.txt  — 8 required block components, prescriptiveness gradient by age.
  t-progress.txt — Dynamic injection: age-filtered learning objectives.
  t-profile.txt  — Family-specific: children names/ages, parent preferences, household notes.
  t-theme.txt    — Theme of week + prior history. SECURITY NOTICE for prompt injection.
  t-history.txt  — Spiral learning rules: revisit windows, no-regeneration rule (<6 weeks).

TOOL SCHEMA — tool-schema.ts
  Output shape:
    plan_header: { family_name, week_of, theme, theme_rationale, week_summary }
    clusters: [ { cluster_id, day, subject_area, blocks: [...] } ]
    governance: { safety_attestation, age_appropriateness_check, materials_check }

ORBIT REPORT — orbit.ts
  Model: claude-sonnet-4-20250514 (max_tokens: 1500)
  Output: narrative (400-600 words), headline, vocabularyHighlights, completionSummary
  Called by: orbit-report cron (Sundays 6am UTC)

SAFETY — safety.ts
  Pass 1: Keyword scan (safety-keywords.json, <1ms, no API call). Fails on exact match.
  Pass 2: Haiku contextual classifier (~$0.001, ~200ms). 6-category rubric.
  Fails OPEN on Haiku error (returns pass:true to prevent false safety rejections).
  Model: claude-haiku-4-5-20251001

UPGRADE PROTOCOL — UPGRADE_PROTOCOL.md in src\lib\ai\
  Read before modifying any file in src\lib\ai\.

---

═══════════════════════════════════════
LAYER 8 — HISTORY
A record of what changed and when.
═══════════════════════════════════════

## VERSION HISTORY

v1.0 — April 17, 2026: Initial runbook created from Light Standard, session decisions, design system values.
v1.1 — April 17, 2026: File maps, token registry, known bugs, footer fourth layer corrected, star field documented.
v1.2 — April 17, 2026: All six known bugs expanded to cold-start standard.
v1.3 — April 17, 2026: Build session close protocol, git protocol, failure patterns, env vars, dependencies, deployment, API surface, prompt templates, nav deliberate hold.
v1.4 — April 17, 2026: v24 snapshot file removed from repo root.
v1.5 — April 17, 2026: Full document restructure. 8 labeled layers with table of contents.
v1.6 — April 17, 2026: Document renamed to Technical Runbook. Header updated. Transfer Queue check added to startup.
v1.7 — April 17, 2026: Session trigger added. Transfer Queue autonomous check (Notion). Build Session Close expanded to 10 steps: flight log (ATC), two-direction write-back, failure pattern sweep, version log.
v1.8 — April 17, 2026: Six corrections: hardcoded date made dynamic, README.md added, Games status corrected.
v1.9 — April 17, 2026: Pattern 7 added (hardcoded temporal values in procedural instructions).
v2.0 — April 17, 2026: File renamed from WIZKOO_REFERENCES.md to TECHNICAL_RUNBOOK.md.
v2.1 — April 19, 2026: Hero editorial pass + moderation hardening. Left column padding-top 305px. Desk note 50% width, single tape piece. Time masthead/kicker removed. suicide/murder/weed moved to BLOCKLIST_EXACT. Pattern 8 added.
v2.1 — April 19, 2026: Claude Code Operating Principles added to Layer 1 (six principles → seven with Principle 7 added later). Notion mirror updated.
v2.2 — April 20, 2026: Hero CTA + wax seal + headline session. L-bracket CTA pale-yellow resolved via color gating in components.css. CTA typography set Sora 600 0.68rem. Wax seal rebuilt as inline SVG. "homeschool plans." reduced 216px → 192px.
v2.9 — April 21, 2026: Homepage Form Preservation Locks Registry upgraded to 25 items.
v3.0 — April 22, 2026: Wizkoo Viewport Standard added to Layer 5 as Section 3 three-tier standard. SECTION_3_BASELINE_2026-04-22.md written.
v3.1 — April 22, 2026: Viewport Reality Constraints added to Layer 4. Principle 7 added. Five target viewports codified.
v3.2 — April 22, 2026: Layer 6 registry synchronized from Notion v3.0. Items 26–35 added. Items 4, 10, 11, 14, 15, 25 retired.
v3.3 — April 25, 2026: Three Transfer Queue items applied: Item 31 retired, Item 36 added, Pattern 12 added.
v3.4 — April 26, 2026: /themes page shipped. Footer "Themes to Explore" in Learn More column. Locked decisions: footer vocabulary lock, column placement, naming discrepancy. Pattern 13 added.
v3.5 — April 26, 2026: Phase 8: .the-moment removed from index.html. .philo section moved to methodology.html. Open Item 10 added.
v4.0 — April 26, 2026: Runbook split into AMY_TECHNICAL_STANDARDS.md (project-agnostic) and TECHNICAL_RUNBOOK.md (this file). Global engineering standards extracted to standalone document. Wizkoo-specific content retained here with references to Standards.
v4.1 — April 27, 2026: Project guard headers added to all three local runbook files. Canonical guard format locked for AMY_TECHNICAL_STANDARDS.md (SCOPE GUARD), wizkoo/TECHNICAL_RUNBOOK.md (PROJECT GUARD — Wizkoo), and Learnkoo/TECHNICAL_RUNBOOK.md (PROJECT GUARD — Learnkoo). Full absolute path to Standards locked in both project guards.
v4.2 — April 29, 2026: Phase 6C shipped to production. Band-Name Pairing Rule locked (Architecture-level, public-facing surfaces). cover_quality schema added to library_books (CHECK constraint, default standard, starter set 9 books). Two-tier cover height min() system locked (180px/25vh band grid, 280px/35vh featured cluster). Pattern 9 added (DOM inspection deferred too late). Open Items 11–12 added (cover URL validation pass, triple-tag audit). PR #7 merged phase-6c-cover-and-pairing → main, SHA 46106b11.
