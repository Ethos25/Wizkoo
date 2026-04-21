# TECHNICAL RUNBOOK — WIZKOO
# Filename: TECHNICAL_RUNBOOK.md
# Version 2.0 — April 17, 2026
#
# ══════════════════════════════════════
# TO START EVERY BUILD SESSION:
# Say: "Run the Technical Runbook"
# That single instruction triggers everything below.
# ══════════════════════════════════════
#
# Read this file end to end.
# Confirm you have read it by stating the four items
# in the SESSION STARTUP INSTRUCTION in Layer 1.
# Then execute the startup sequence before any work begins.

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
347335a8d332818bbd18d10b2a2170de) is a chat-session-facing copy kept in sync with this
file through the Transfer Queue. If the local file and the Notion mirror disagree,
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

Last updated: April 21, 2026
Maintained by: Amy Oguntala

---

## TABLE OF CONTENTS

LAYER 0 — IDENTITY: Governing documents, quality filter, hierarchy rule, maintenance rule
LAYER 1 — OPERATIONAL PROTOCOLS: Session startup, close protocol, git protocol, completion standard
LAYER 2 — LIVE STATE: Pages status, known bugs, nav deliberate hold, locked decisions
LAYER 3 — SYSTEM MAP: Codebase locations, file maps, environment variables, dependencies, deployment
LAYER 4 — DESIGN SYSTEM: Surfaces, color system, typography, motion, nav system, $200 standard
LAYER 5 — COMPONENT SPECS: Generation spectacle, firefly, homepage hero, atlas continent palette
LAYER 6 — FAILURE PREVENTION: Known Claude Code failure patterns, accessibility, performance
LAYER 7 — DEEP REFERENCE: CSS custom properties (both codebases), API surface, prompt templates
LAYER 8 — HISTORY: Version history

---

═══════════════════════════════════════
LAYER 1 — OPERATIONAL PROTOCOLS
Read this layer at the start and end of every session.
These are the mandatory procedures that govern how all work is done.
═══════════════════════════════════════

## SESSION STARTUP INSTRUCTION

Every build session starts with one line from Amy:
"Run the Technical Runbook"

Execute all four steps before touching any file.

STEP 1 — CONFIRM YOU READ THIS FILE
State out loud:
  1. Both local codebase paths
  2. Canonical saffron hex value
  3. Environment assigned to the page you will work on today
  4. Confirm Operating Principles active by naming all six by number:
     (1) Pre-flight audit, (2) Clean state requirement,
     (3) Report superseded rules, (4) Three-strike reset rule,
     (5) Specificity hygiene, (6) One source of truth per component.
Do not begin work until all four are confirmed. Stating the principles
is not optional — it confirms they are active for the session, not
just present in the document.

STEP 2 — CHECK THE TRANSFER QUEUE
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

If queue is empty:
  State: "Transfer Queue clear. Proceeding."

Do not skip this step. A decision deposited by a chat
session that is not applied before work begins will be
overwritten or ignored by this session's changes.

STEP 3 — GIT STATUS CHECK
Run: git status
Run: git log --oneline -3
Report findings before touching any file.
If uncommitted changes exist from a prior session:
  "WARNING: [X] uncommitted files from prior session.
  Files: [list]. Commit, review, or discard?"
Do not begin new work until Amy responds.

STEP 4 — BEGIN WORK
State what the session will accomplish.
Then proceed.

---

## BUILD SESSION CLOSE PROTOCOL

Mandatory. Every session. Non-negotiable.

TRIGGER LANGUAGE — Claude Code initiates without being asked
when Amy says any of the following:
  "wrap it up" / "close it out" / "let's close"
  "I'm done" / "that's it" / "stepping away"
  "write the baton" / "pass it off"
  OR when primary deliverable is complete and context
  is getting heavy.
Do not wait to be asked. When the signal fires, run
the protocol immediately.

STEP 1 — DELIVERABLE CHECK
Is the primary task complete per the Completion Standard?
Built. Migrated. Verified. Old version removed.
System in clean unambiguous state.
If any step is incomplete, name it explicitly.
Never present partial completion as done.

STEP 2 — OPEN ITEMS SWEEP
What was started but not finished this session?
What was discovered that needs a follow-up session?
What was deferred and why?
Each item goes into KNOWN BUGS or OPEN ITEMS in the
Technical Runbook. Not noted in chat. Written to file.

STEP 3 — DECISION WRITE-BACK (two directions)

Direction 1 — Codebase decisions to Technical Runbook:
Every decision made this session that affects the codebase
gets written to LOCKED DECISIONS before closing.
If it reverses a prior locked decision, remove the old
entry and note why it was superseded.
A decision that exists only in the chat transcript
does not exist. It will be relitigated next session.

Direction 2 — Product/brand decisions to Transfer Queue:
If this session surfaced any decision that affects the
chat-side system (new surface assignment, product direction,
GTM implication, brand decision, design principle):
Use the Notion tool to add it to the Transfer Queue:
  Page: 345335a8d33281ea9f86e19c5018624a
  Format:
    DATE: [today]
    SECTION: [which Technical Runbook section this belongs in]
    DECISION: [exactly what needs to be added or changed]
    STATUS: PENDING
If nothing to deposit: state "Nothing to deposit to
Transfer Queue this session."

STEP 4 — CODEBASE IMPACT TRACE
What else in the codebase is affected by what changed?
What components consume a token that was modified?
What files import from a file that was renamed or moved?
What adjacent code shares a failure pattern that was fixed?
Verify those surfaces before closing.
If broken: fix it or document it as a known bug.
Do not leave a downstream breakage undocumented.

STEP 5 — FAILURE PATTERN SWEEP
Did this session reveal a new Claude Code failure pattern?
A new way the executor gets things wrong in this codebase?
If yes: add it to KNOWN CLAUDE CODE FAILURE PATTERNS
in Layer 6. Name it. Describe it. State the prevention rule.
If nothing new: state "No new failure patterns this session."
This is the build session equivalent of Twin Calibration.
The system learns from its failures only if they are
documented before the session closes.

STEP 6 — RUNBOOK UPDATE
Update TECHNICAL_RUNBOOK.md with everything that changed:
New files: add to CRITICAL FILE MAP with path and purpose.
Changed tokens: update CSS CUSTOM PROPERTIES section.
Resolved bugs: mark resolved with fix summary and location.
New bugs: add with file, line, root cause, fix spec.
New failure patterns: add to Layer 6.
Copy updated file to both codebase folders.

MANDATORY MIRROR SYNC: Also update the Notion mirror to match.
For every layer modified this session, fetch the corresponding
layer child page under the Technical Runbook — Wizkoo parent
(347335a8d332818bbd18d10b2a2170de) and apply the same change to
that page. Child page IDs are listed in Step 2 of the Session
Startup Instruction. The Notion mirror sync is same-tier as
copying between the two local repo folders: not optional, not
deferrable. The Verification Gate in Step 7 must include a line
confirming every modified layer was synced to Notion.

STEP 7 — VERIFICATION GATE
Produce this ledger before closing:

BUILD SESSION WRITE-BACK VERIFICATION
✓ UPDATED: [what] → TECHNICAL_RUNBOOK.md ([X] lines)
✓ COPIED: C:\Users\amyog\Desktop\wizkoo ([X] lines)
✓ COPIED: C:\Users\amyog\Desktop\wizkoo-plan-generator ([X] lines)
✓ NOTION MIRROR SYNCED: [list of layer child pages updated] OR "no layers modified this session"
✓ TRANSFER QUEUE: [items deposited OR "nothing to deposit"]
✓ FAILURE PATTERNS: [captured OR "none this session"]
✗ NOT DONE: [item] → [Amy deferred / technical blocker only]

Line counts must match across both copies.
If they differ, the copy failed. Redo it.
Identifying the work IS the instruction to do the work.
"Recommend updating" is not a valid close.

STEP 8 — GIT CLOSE
Run: git status
Stage all changes including runbook updates.
Commit with descriptive message:
  "YYYY-MM-DD — [what was built/fixed/changed]"
  Specific enough that reading git log tomorrow tells
  you exactly what this session did.
Run: git push
Confirm: "Committed and pushed. Remote is current."

STEP 9 — FLIGHT LOG ENTRY
Use the Notion tool to write to the ATC Flight Log.
Database ID: b132ce969d3041348b4b7b6a6082cb99
Data source: 4a4a8f2e-3c19-4e23-9b9d-5d4084fee57e

First: search the database for a page where
date:Date:start matches today's actual date in YYYY-MM-DD format.

If today's page EXISTS:
  Fetch it. Append a BUILD SESSION block to its content.

If today's page DOES NOT EXIST:
  Create a new page with these properties:
    Day: "[full day name + date — compute from today's actual date.
      Example format: Friday, April 17, 2026]"
    date:Date:start: "2026-04-17"
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
Morning Amy reads this to know what the build system
produced. Keep it scannable. Ten lines maximum.

STEP 10 — VERSION LOG
Add one line to VERSION HISTORY in the Technical Runbook:
  v[next] — [date] — [one sentence: what this session did]
  Also update the MAINTENANCE RULE "Last updated" date
  in Layer 0 to today's date.

MINIMUM VIABLE CLOSE:
Steps 3, 6, 7, 8, 9, and 10. Never less than that.
If Amy says "just close it" push back once:
"Minimum close is Steps 3, 6, 7, 8, 9, and 10.
Under five minutes. Proceeding now."

---

## GIT PROTOCOL — EVERY SESSION

SESSION OPEN (before any work begins):
Run: git status
Run: git log --oneline -5
Report findings before touching any file.
If uncommitted changes exist from a prior session:
  State: "WARNING: Uncommitted changes exist from a
  prior session. Affected files: [list]. Commit,
  review, or discard before proceeding?"
Do not begin new work until Amy responds.

SESSION CLOSE (final step, after all other close steps):
Run: git status
Commit all changes with a descriptive message.
Commit message format:
  "YYYY-MM-DD — [what was built/fixed/changed]"
  Example: "2026-04-17 — firefly velocity rebuilt,
  nav rgba source hunt, runbook updated"
Run: git push
Confirm: "Committed and pushed. Remote is current."
If push is deferred by Amy, state explicitly:
  "[X] commits staged locally. Remote is behind.
  Push required before next deploy."

COMMIT MESSAGE STANDARD:
Specific enough that reading git log tomorrow tells
you exactly what each session changed.
Never: "fix" "updates" "changes" "wip"
Always: what changed, where, and why in one sentence.

RULES:
Never close a session with uncommitted work without
explicitly flagging it to Amy first.
Never build on top of uncommitted work from a prior
session without surfacing it to Amy first.

---

## THE COMPLETION STANDARD (from Operating Philosophy)

Source document (Notion): 334335a8d33281e894a0f75017d48957

"Done" does not mean "the new thing exists."
Done means the full chain is complete:

1. BUILD the new thing.
2. MIGRATE the data from the old thing.
3. VERIFY the migration is correct.
4. REMOVE the old thing.
5. CONFIRM the system is in a clean, unambiguous state.

Stopping at step 2 creates two sources of truth.
Two sources of truth is worse than one bad source.
Nobody knows which one is current.

THE TEST: If someone opens this codebase tomorrow with no verbal briefing
from Amy, will they find one clean consistent state? Or artifacts, duplicates,
and half-finished work that requires Amy to explain?
If it requires explanation, it is not done.

CLAUDE CODE APPLICATION:
Before presenting any task as complete, walk the chain:
Did I build it, migrate it, verify it, remove the old version,
and confirm the system is consistent?

If any step is incomplete, name it explicitly:
"I have completed steps 1-3. Steps 4-5 remain: the old CSS rule
needs to be removed and the specificity conflict needs to be verified
in DevTools. Want me to do that now?"

Never present 60% of a task as 100% of a task.
Never leave an old rule in place when a new one has been added.
Never add a new CSS rule when the winning rule should be changed at source.

---

## THE $200 STANDARD — SUMMARY

Quality floor: every surface feels crafted, not assembled.
One plastic cup collapses the entire $200 illusion.
The answer to "will a parent screenshot this?" must be yes.
→ Full content: LAYER 4 — THE $200 STANDARD (Quality Floor Directive)

---

## CLAUDE CODE OPERATING PRINCIPLES

Source: Amy Oguntala, April 19, 2026, after the Wizkoo homepage hero reset session.
Notion: Technical Runbook — Wizkoo (347335a8d332818bbd18d10b2a2170de), Section 2.

Non-negotiable rules that govern every Claude Code session on Wizkoo.
Same tier as the Wizkoo Operating Philosophy and the Completion Standard.
These principles exist because accumulated technical debt from
additive-without-reconciliation changes has been observed to compound into
unrecoverable states that require full resets. These principles prevent
that class of failure.

CONTEXT:
Born from a homepage hero build session where five consecutive tweak prompts
layered conflicting CSS rules without reconciling them, producing a broken state
that required a full reset. The correction revealed the principle underneath:
Claude Code's default is additive, not reconciliative. Reconciliation must be
made explicit.

THE STANDARD:
Every Claude Code session operates under the six principles below. They are
non-negotiable. They apply equally at the start of a session, mid-session,
and in the final deploy. "Fast but accumulates debt" is not permitted. The
Completion Standard applies to code the same way it applies to every other
Wizkoo output.

PRINCIPLE 1 — PRE-FLIGHT AUDIT
Before executing any visual or structural change, report the current state of
the affected element: its CSS rules, HTML structure, JavaScript bindings.
Confirm understanding before touching code.
This is not optional commentary. It is a verification checkpoint. If the
pre-flight audit reveals conflicts or ambiguities that the prompt did not
address, stop and report. Do not proceed on assumptions.

PRINCIPLE 2 — CLEAN STATE REQUIREMENT
Every change leaves the affected system in a known-clean state. New rules
replace old rules. Old rules are removed. No orphaned CSS, no dead variables,
no commented-out code left as "just in case." If the change supersedes prior
work, the prior work is deleted, not left dormant.
The test: if someone else opens this codebase tomorrow with no verbal briefing
from Amy, will they find one clean, consistent state? Or will they find
artifacts, duplicates, and half-finished work?

PRINCIPLE 3 — REPORT SUPERSEDED RULES
As part of any change, list the specific CSS rules, HTML elements, or
JavaScript that will be removed or modified. This list is part of the
pre-flight audit and part of the execution report. It is not optional.
The purpose: Amy can catch a supersession that was not intended before the
change is executed. If Principle 3 is skipped, unintended deletions are
discovered only after deployment — which is too late.

PRINCIPLE 4 — THREE-STRIKE RESET RULE
If three consecutive tweak prompts on the same element do not produce the
intended result, stop tweaking. The problem is no longer the tweak — it is
the foundation.
Request a reset of that element. Reset means: identify and strip all CSS
rules, HTML structure, and JavaScript related to the element that are not
being preserved in the final intent, then rebuild from the preserved intent
as if starting fresh.
Iterative tweaking of a broken foundation is always slower than a reset.
The reset rule prevents compounding failure.

PRINCIPLE 5 — SPECIFICITY HYGIENE
When multiple CSS rules could apply to an element, the winning rule is stated
explicitly and competing rules are removed. Do not use !important to win
specificity fights. If specificity is unclear, consolidate the rules.
!important is permitted only for third-party override scenarios where the
underlying rule cannot be modified. It is never used to resolve an internal
specificity conflict within Wizkoo code.

PRINCIPLE 6 — ONE SOURCE OF TRUTH PER COMPONENT
Each visual element has one governing CSS rule set. Each HTML component has
one governing template. Each JavaScript behavior has one governing function.
When rules, templates, or behaviors are distributed across multiple files or
scopes, consolidate during the change. If consolidation is out of scope for
the current change, flag it and propose a separate cleanup pass. Do not add
to a distributed mess.

SESSION-START INSTRUCTION (verbatim, every session):
  "This session operates under Claude Code Operating Principles
   (see Wizkoo technical runbook). Apply all six principles to every
   change in this session. Pre-flight audit before every non-trivial
   change. Report superseded rules as part of every change. If three
   consecutive tweaks fail, request a reset."

WHY THESE PRINCIPLES EXIST:
Claude Code's default behavior, given a change request, is to find the
smallest delta that produces the requested visual or functional change.
"Smallest delta" often means: add a new rule with higher specificity,
leave the old rule in place, move on.
This default is not wrong in isolation. It is catastrophically wrong at
scale. Across a multi-prompt session, the accumulated orphaned rules produce
a codebase where every change fights invisible competing rules from earlier
changes. Eventually the fight is unwinnable and a full reset is required.
The six principles make reconciliation explicit. They do not slow the work.
They prevent the compounding failure that is slower than the work itself.

GOVERNANCE:
  Additions require Amy's explicit decision.
  Removals are not permitted.
  Applies to every Claude Code session on Wizkoo — wizkoo.com and
  the plan generator.

---

## PROMPT CONSTRUCTION DISCIPLINE

### WHY THIS SUBSECTION EXISTS

Claude Code's default behavior is additive. Given a request to fix X,
it produces the smallest delta that makes X work — usually by adding a
new rule on top of existing rules, leaving superseded rules in place.
Across a multi-prompt session, these leftover rules accumulate into
competing logic that every future change has to navigate around. The
compound effect is a codebase where prompts get harder to land because
the noise drowns out the signal.

The most common operator mistake that feeds this failure is the phrase
"do not touch anything else." That instruction forbids reconciliation.
It protects the operator from unwanted structural changes, but it also
prevents the executor from cleaning up what its own change replaces.

The fix is not to remove scope protection. The fix is to distinguish
scope (what the executor may change) from reconciliation (what cleanup
is authorized within scope). Every prompt to Claude Code must name both,
explicitly and separately.

This subsection defines the six-section standard that makes that
distinction enforceable.

### THE SIX-SECTION PROMPT STANDARD

Every prompt sent to Claude Code must contain all six sections, in this
order, with the section headers written as stated. If any section is
missing, the prompt is not ready. Return it to the drafter before
sending.

  1. TASK
  2. SCOPE
  3. RECONCILIATION AUTHORIZED
  4. PRESERVATION LOCKS
  5. REPORTING
  6. VERIFICATION

Each section is defined below with its purpose and what goes in it.

### SECTION 1 — TASK

  Purpose: give Claude Code a verifiable goal.
  Contents: what needs to happen, stated as a concrete outcome, not a
    process.

  Good: "Fix the announcement bar text color so it reads saffron on all
    non-homepage pages."
  Not good: "Help me figure out what is wrong with the announcement bar."

  A task without a concrete outcome cannot be declared done.

### SECTION 2 — SCOPE

  Purpose: draw the boundary. Prevent Claude Code from wandering into
    code it was not invited to touch.
  Contents: which files, components, or surfaces the executor may change,
    named explicitly. Out-of-scope items named explicitly as well.

  Good: "In scope: components/nav.js lines 80 to 100. Out of scope: all
    other files, all other components, the plan generator entirely."
  Not good: "Just fix the nav."

### SECTION 3 — RECONCILIATION AUTHORIZED

  Purpose: separate narrow protection from additive-only execution.
    Scope says what Claude Code MAY touch. This section says what
    Claude Code SHOULD clean up when it touches.
  Contents: what cleanup is explicitly permitted within scope. Removal
    of superseded rules, deletion of dead code, consolidation of
    duplicates. Also what cleanup is NOT authorized (restructuring,
    renaming, refactoring).

  Good: "You are authorized to remove the current .announce-text color
    rule and any superseded overrides related to announcement bar text
    color within the named scope. You are not authorized to restructure
    the nav component or rename any selector."
  Not good: silence. If this section is missing, Claude Code defaults
    to additive-only, which is the failure mode this subsection exists
    to prevent.

### SECTION 4 — PRESERVATION LOCKS

  Purpose: name fragile systems explicitly so Claude Code cannot
    accidentally break them, even within authorized scope.
  Contents: what must not change, even if the executor believes a change
    would improve things. Pulls from the Preservation Locks Registry
    (see Layer 6) for any prompt touching a system with registered locks.

  Good: "Do not touch: any form-related code in index.html, any
    BLOCKLIST or BLOCKLIST_EXACT array, netlify/functions/validate-
    theme.js, any :root design token definition."
  Not good: "Do not break anything." Vague preservation instructions
    are not enforceable.

### SECTION 5 — REPORTING

  Purpose: prevent silent changes. Every modification Claude Code makes
    must be nameable. If it cannot be named, it should not have happened.
  Contents: what findings and changes Claude Code must state in its
    response.

  Two kinds of reporting:
    Pre-execution: "Before making any change, list every file you will
      modify and the specific change per file. Wait for approval."
    Post-execution: "After completing, produce a ledger of files
      changed, selectors removed, lines affected, and any finding from
      the audit you chose not to execute."

### SECTION 6 — VERIFICATION

  Purpose: establish the gate between "change applied" and "change
    shipped." Catch broken states before they hit the remote repository.
  Contents: how correctness and integrity get confirmed.

  Typical verification steps:
    Run git status and git diff --stat before committing.
    Confirm no file outside the named scope was modified.
    Open the relevant pages in the dev server. Confirm no console
      errors and no visual regressions.
    Run the build if one exists.
    Commit with a descriptive message.
    Do not push without explicit approval from Amy.

### DISTINGUISHING REPORTING FROM VERIFICATION

The two sections are easy to confuse. Keep this distinction in mind:

  REPORTING answers:    "What did you change?"
  VERIFICATION answers: "Did it work and is the system still sound?"

Reporting is a narrative Claude Code writes about its own work.
Verification is a test Claude Code or Amy runs against the result.

A prompt can have thorough reporting and fail verification — the change
was named honestly and also broke the page. A prompt can pass
verification with weak reporting — the page still renders, but nobody
can tell what changed or why. Both sections must be present. They serve
different functions.

### THE RETURN RULE

Any prompt missing one or more sections is not ready for execution.
Return it to the drafter for completion before sending.

This rule applies equally when:
  Amy drafts the prompt herself.
  A chat assistant drafts the prompt for Amy.
  A prior session's baton includes a prompt to re-send.

The executor (Claude Code) enforces this rule on the receiving side:
when a prompt arrives missing one or more sections, Claude Code must
request clarification and list the missing sections by name before
executing. The drafter enforces this rule on the sending side.

Two-sided enforcement prevents silent bypass.

### MINIMUM VIABLE PROMPT

For genuinely trivial changes (typo fixes, single-line comment
corrections, one-word copy edits with no structural impact), a
compressed prompt is acceptable:

  TASK: [what]
  SCOPE: [where — single file, single line]
  RECONCILIATION: none needed
  PRESERVATION: none at risk
  REPORTING: show the diff
  VERIFICATION: confirm no unintended matches in grep before committing

All six sections are still named. The content is compressed because the
change is small. Do not use this pattern for anything that touches a
component, a system, or more than one file.

---

## PERIODIC CODE HYGIENE PROTOCOL

### WHY THIS SUBSECTION EXISTS

In-the-moment hygiene catches most accumulation. The Completion Standard
enforces old-thing removal at write time. Principle 2 (Clean State
Requirement) enforces clean state after every change. Pattern 5 (Raw Hex
Instead of Token) catches hardcoded values as they are written. These
rules cover the 80% case.

The remaining 20% requires periodic passes. Orphaned rules slip in when
a component is rewritten and the old rule is not caught. Token drift
accumulates over dozens of files. Breakpoint systems get confused when
multiple sessions touch responsive logic without the full picture. These
failures are not caught by in-the-moment rules. They require a scheduled
scan.

This subsection defines when to run each periodic pass, what each pass
does, and which prompt to use. The protocol moves the decision of when
and how out of Amy's working memory and into a checklist that lives in
the runbook.

### THE FOUR LAYERS

Code hygiene is an umbrella discipline with four distinct layers. Each
layer addresses a different kind of accumulated mess. Each has its own
risk profile and its own trigger.

Layer 1 — Dead code removal. Delete CSS selectors, JS functions, and
HTML elements that nothing references. Lowest risk because dead code
cannot break what it does not touch. Highest immediate payoff because
removal is mechanical and substantial debt accumulates here.

Layer 2 — Token consolidation. Find hardcoded values in component files
and replace with var(--token-name) references to the existing design
token registry. Low risk, compounding payoff (one-line updates later
when tokens evolve).

Layer 3 — Responsive strategy audit. Examine breakpoints for coherence.
Identify conflicts between width-based and height-based breakpoints.
Decide whether to consolidate or formally document rules of engagement.
Judgment-heavy. Not mechanical.

Layer 4 — Full refactor. Reorganize how code is structured without
changing what it does. Biggest lift. Highest risk. Only runs when a
specific new feature is blocked by current architecture, never
prophylactically.

### THE OPTIMIZATION DISTINCTION

Optimization is not hygiene. Hygiene is about correctness and
maintainability. Optimization is about performance. They are different
disciplines with different triggers, different risks, and different
success criteria.

Hygiene triggers on accumulation. Optimization triggers on measured slow
performance. "Feels slow" is not an optimization trigger — instrumentation
is. Before optimizing, measure. If the measurement does not show a problem,
do not optimize.

If Claude Code notices an optimization opportunity during a hygiene pass,
flag it as a separate task. Do not bundle performance changes into a
hygiene commit. The risks are different and mixing them makes regression
diagnosis impossible.

### TRIGGERS

Layer 1 (Dead code removal) runs when:
- Before any major redesign that will touch existing surfaces.
- After locking a design direction (to clean up the abandoned iterations).
- When prompts start taking longer to land than they used to (compounding
  debt signal).
- As a default cadence every 50 to 100 build prompts.

Layer 2 (Token consolidation) runs when:
- All Layer 1 triggers above, typically paired with a Layer 1 pass.
- After any session that added or changed design tokens (to catch
  hardcoded values that slipped in elsewhere).

Layer 3 (Responsive strategy audit) runs when:
- Before major layout changes that will touch breakpoints (run before
  the redesign, not after).
- When rendering bugs appear at odd screen sizes and it is unclear which
  rule is winning.

Layer 4 (Full refactor) runs when:
- A specific new feature is blocked by current code architecture. The
  trigger is mechanical: "I tried to add X and it broke Y because of
  how the code is organized."
- Never prophylactically. Never because the code "feels messy." The
  trigger is a named blocked feature.

### PRE-WRITTEN PROMPTS

Five prompts below, all following the six-section Prompt Construction
Discipline standard. Copy, adjust specifics as needed, paste into
Claude Code.

PROMPT 1 — LAYER 1 DEAD CODE AUDIT (REPORT-ONLY)

TASK: Audit the marketing site codebase for dead CSS. Produce a findings
  report in DEAD_CSS_AUDIT_REPORT.md. No modifications to any file.

SCOPE: In scope: all CSS files under css/ at repo root, any <style>
  blocks in index.html and all top-level HTML pages, any CSS inside
  components/nav.js. Out of scope: /games/ subdirectory, plan generator
  repo entirely, any JavaScript logic.

RECONCILIATION AUTHORIZED: None. This is report-only. Do not modify
  any file.

PRESERVATION LOCKS: All files. No modifications of any kind permitted
  in this pass.

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
  (Preservation Locks Registry item 18). Do not touch any form-related
  code.

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
     Nobody updated the default to match the spec.
   What has been attempted: Nothing documented. The homepage override exists as evidence
     that saffron was the intended color — someone fixed it for the homepage and
     forgot the default.
   The fix (exact):
     In C:\Users\amyog\Desktop\wizkoo\components\nav.js, change line 84 from:
       '  color:rgba(12,16,32,0.75);',
     to:
       '  color:rgba(232,175,56,0.60);',
     That is the only change required. The homepage inline override at lines 288–289
     can remain — it uses rgba(232,175,56,0.75) (slightly brighter) which is fine on
     the solid #0C1020 bar. The default change brings all other pages into spec.
   Verify in browser: Open ages.html (a linen page with the standard bar, not the
     homepage). Inspect the announcement bar text. It should be legible saffron
     against the dark bar, not nearly invisible dark ink. Check the same on
     library.html (night-sky surface) to confirm it reads on dark backgrounds too.

2. NAV CTA STYLE — GHOST VS FILLED (REQUIRES AMY CONFIRMATION BEFORE FIXING)
   What is broken: The Light Standard spec says Nav CTA must be saffron fill:
     background: #E8AF38, color: #0C1020 (dark text on saffron button).
     The current implementation at nav.js lines 199–219 is ghost style:
     background: transparent, color: #E8AF38, border: 1px solid rgba(232,175,56,0.65).
   Origin: C:\Users\amyog\Desktop\wizkoo\components\nav.js lines 199–219 (.nav-cta rule)
   Root cause theory: The nav background was changed from frosted glass to solid dark
     (rgba(12,16,32,0.96)) as a locked decision. A filled saffron CTA against an opaque
     dark bar creates a visually heavy look — someone may have switched to ghost to
     reduce visual weight and never documented the change as intentional. Alternatively
     it may simply be an unrecorded decision.
   What has been attempted: Nothing documented. This state has been in the codebase
     since at least April 12, 2026. The Locked Decisions section records the nav
     background change but says nothing about the CTA style.
   DO NOT FIX without Amy confirming this is a bug and not an intentional design choice.
     Ask: "The nav CTA is currently ghost style (transparent, saffron border). The Light
     Standard says it should be saffron fill. Should I change it back to filled?"
   If Amy confirms it is a bug, the fix (exact):
     In C:\Users\amyog\Desktop\wizkoo\components\nav.js, change lines 206–214:
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
   Verify in browser: Nav CTA should render as a solid saffron rectangle (#E8AF38)
     with dark ink text (#0C1020). Hover should lighten to #EDBA45. No translation
     (translateY) on hover — spec says NO translation.

3. PRICING PAGE — CTA FIREFLY MISSING
   What is broken: pricing.html has no firefly implementation at all. The "Firefly fix
     pending" note in Pages Status refers to this page, not to the #pricing section of
     index.html. The pricing.html CTA section (.cta / .cta-btn) has no animation.
   Origin: C:\Users\amyog\Desktop\wizkoo\pricing.html — no firefly code exists anywhere
     in the file (confirmed by search of all 258 lines). The page has a .cta section
     (lines 82–88, 197–201) with class .cta-btn on the primary button (line 201).
   Root cause: The CTA firefly in index.html (lines 2356–2401) targets
     document.getElementById('pricing') and cta.querySelector('.btn-main'). Neither
     selector matches anything in pricing.html. That code only runs on index.html. The
     pricing page was never given its own firefly implementation.
   What has been attempted: Nothing. The "fix pending" note records the intent to add
     a firefly but it was never built.
   The fix (exact): Add the following script to pricing.html, immediately before
     </body> (after the existing scroll-reveal script block). Adapt element selectors
     from index.html's implementation to match pricing.html's class names:

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

   BEFORE adding this: verify the .cta element has position:relative (it does —
     pricing.html line 82: .cta{...position:relative;overflow:hidden}). The overflow:hidden
     will clip the firefly if it drifts outside .cta bounds. The drift range is ±14px
     horizontally and ±10px vertically from the button center — ensure the .cta section
     is tall enough that the firefly won't be clipped at its extremes.
   Verify in browser: Scroll the pricing.html CTA section ("Ready to build your first
     week?") into view. Within 300ms of intersection, a 5px saffron dot should appear
     at the left edge of the "Build Your Plan" button and drift for 2.6s then fade out.
     Confirm it is clipped by .cta bounds (not visible outside the section).
     Confirm it does not appear on mobile (<768px) or with prefers-reduced-motion.

4. GAMES PAGES — INVALID SORA WEIGHT VALUES
   What is broken: Multiple elements across the games pages use Sora font-weight 600,
     which is not in the approved Sora weight set (200, 300, 700, 800 only).
     Weight 600 is a prohibited weight that does not exist in the licensed Sora subset
     and falls back to the nearest available weight — producing inconsistent rendering.
   NOTE on "Nav": All three games pages correctly load components/nav.js via
     <div id="wizkoo-nav"> + <script src="/components/nav.js">. No nav bugs confirmed
     by code inspection. If a visual nav issue exists it requires a browser audit session.
   NOTE on "Saffron deployment": No wrong saffron colors found (all usages are either
     #E8AF38 or var(--saffron) or correctly using saffron). Hardcoded hex strings in
     JS inline styles (games.html line 101) are functionally correct even if they could
     use CSS vars. Not a saffron deployment error in the color-correctness sense.

   SUB-BUG 4a — atlas.html, Sora weight 600 on postcard body text:
     File: C:\Users\amyog\Desktop\wizkoo\games\atlas.html, line 94
     Current: font-family:'Sora',sans-serif;font-weight:600;font-size:0.95rem;
     Wrong because: 600 is not a loaded Sora weight.
     Fix: Change font-weight:600 to font-weight:700 on that inline style.

   SUB-BUG 4b — elementum.html, Sora weight 600 on element name label:
     File: C:\Users\amyog\Desktop\wizkoo\games\elementum.html, line 62
     Current: style="font-family:'Sora',sans-serif;font-weight:600;font-size:1rem;..."
     Wrong because: 600 is not a loaded Sora weight.
     Fix: Change font-weight:600 to font-weight:700 on that inline style.

   Additional weight-system audit needed: pricing.html also has invalid Sora weights:
     pricing.html line 58: .feature-title font-weight:600 → change to 700
     pricing.html line 76: .faq-q font-weight:500 → change to 700
     pricing.html line 47: .hero-btn font-weight:600 → change to 700
     pricing.html line 87: .cta-btn font-weight:600 → change to 700
     (pricing.html is NOT listed in the games bug but has the same class of error)

   Verify in browser: Inspect any element using font-family Sora in the games or pricing
     pages. In DevTools > Computed, the resolved font-weight must be 200, 300, 700, or
     800. Any other value (400 fallback from 500/600 mismatch) is a bug. The most
     visible symptom: a headline that looks thinner than expected (600 falling back to
     400 because 600 isn't loaded).

5. METHODOLOGY PAGE — NEEDS RETHINK
   What is broken: Full content and layout redesign required. Page does not
     meet the $200 Standard or current design language.
   Location: C:\Users\amyog\Desktop\wizkoo\methodology.html
   Status: Unresolved. Requires a design session before any code work.

6. HOMEPAGE ENVIRONMENT — UNRESOLVED
   What is broken: The environment assignment for the homepage is TBD.
     The decision between "linen only" or "multi-surface" has not been made.
   Location: ENVIRONMENT MAP section of this document.
   Status: Unresolved. No code work should proceed on homepage surface until
     this is decided and locked into the Environment Map.

7. --ease-out-expo TOKEN NOT LINKED IN index.html
   What is broken: `--ease-out-expo` is defined in css/tokens.css (same curve as
     --expo: cubic-bezier(0.16, 1, 0.3, 1)) but css/tokens.css is NOT linked from
     index.html. All var(--ease-out-expo) references in index.html inline CSS fall
     back to browser default `ease` instead of the editorial expo curve.
   Origin: css/tokens.css defines the token; index.html links its own inline :root
     with --expo but not tokens.css.
   Root cause: Two parallel token definitions were never unified. The inline :root
     in index.html has --expo but not --ease-out-expo. Linked files (animations.css,
     components.css) that reference --ease-out-expo resolve it from tokens.css — but
     inline styles in index.html cannot reach tokens.css rules.
   Fix: Either (a) add --ease-out-expo to index.html's inline :root, or (b) link
     css/tokens.css from index.html and remove the inline --expo duplication.
     Option (b) is the correct long-term fix per Operating Principle 6.
   Status: Unresolved. Low visual impact (fallback `ease` is close). Fix in a
     dedicated tokens cleanup session.

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
- Kicker and kicker rule in hero left column: removed with the time masthead. First visible element above headline is empty space. Do not reintroduce either element.
- Hero left column alignment rule: `.nh-left{padding-top:305px}` governs baseline alignment at 1440px. Alignment is container-driven, not element-driven. Do not change without re-verifying diff measurement.
- Desk note width: 50% of `.nh-right` content area. Single tape piece (`::after` only), centered at `left:calc(50% - 28px)`. Do not add a second tape piece.
- Blocklist architecture: `suicide`, `murder`, `weed` are BLOCKLIST_EXACT (exact-match only). Phrased uses ("murder mystery", "suicide prevention", "garden weeds") pass to Layer 3 AI moderation. Both client (index.html) and server (validate-theme.js) lists must stay in sync.
- Email provider for moderation digest: Resend. Do not swap provider without updating both sendEmail() and env var names in moderation-digest.js.
- `.cta-needs-ready` gating: uses `color: rgba(12,16,32,0.40)` on unready state, NOT `opacity`. Box-shadow stays full saffron always. Transition is `color`, not `opacity`. Source of truth: css/components.css. Root cause of prior pale-yellow bug was element-level opacity dimming the box-shadow.
- Wax seal (editorial note): inline SVG, 56×56px display, 80×80 viewBox. Organic blob path (not circle). 3-layer W monogram (shadow/base/highlight text offsets). Do not revert to div+span. Do not use the 6-lobe deboss-filter variant (reverted — user rejected it).
- Hero headline line 2 ("homeschool plans."): locked at 192px. Was 216px. Reduced April 20, 2026 per user request.
- CTA button typography ("SHOW ME THIS WEEK →"): Sora 600, 0.68rem, letter-spacing 0.06em. Matches Open Seat page `.btn-sky` treatment. Not Space Mono.
- css/components.css easing (lines 24/25/26): cubic-bezier(0.16,1,0.3,1) left hardcoded intentionally. Consumers (index.html, the-open-seat.html) do not link tokens.css and have no --ease-out-expo in scope. Replacing with var(--ease-out-expo) would produce unresolved custom property. Option A per April 21, 2026 token consolidation pass. Revisit when OPEN ITEM 6 (link tokens.css to 8 pages) is resolved.

---

═══════════════════════════════════════
LAYER 3 — SYSTEM MAP
Read this layer when you need to find a file, understand the codebase
structure, or check environment setup and deployment configuration.
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
  index.html          Homepage. Hero, plan split, same-room, games band, philosophy, FAQ.
                      Contains inline firefly JS (lines 1897–2159).
  about.html          About page.
  ages.html           Age guide. Locked environment: Linen.
  contact.html        Contact form.
  pricing.html        Pricing. Environment: Linen. CTA firefly "fix pending".
  esa.html            Education Savings Account page (~34 KB).
  games.html          Games hub.
  library.html        Book library. Environment: Night Sky.
  methodology.html    The Science. Needs rethink — full content and layout redesign.
  the-open-seat.html  The Open Seat. Environment: Day Sky. LOCKED FINAL.
  what-we-believe.html Philosophy/beliefs page.
  scope.html          Scope document.
  privacy.html        Privacy policy.
  terms.html          Terms of service.
  404.html            Error page.
  README.md           Points to this Technical Runbook. First file
                      any AI or developer reads when opening the repo.

Config and tooling:
  CLAUDE.md           Claude Code project instructions. Dev server setup
                      (npm run serve → localhost:3000) and Playwright
                      visual verification workflow for this codebase.
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
                      and .footer-fade gradient transition zone. The dark
                      planetarium background lives in footer.js inline styles.
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
  screenshot.js       Playwright screenshot automation. Captures full-page
                      screenshots of every marketing page for visual QA.
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
                      skipTrailingSlashRedirect: true.
  tsconfig.json       Path alias @/* → ./src/*. Target ES2017. Strict mode.
  drizzle.config.ts   ORM migrations from /drizzle directory.
  vercel.json         Vercel deployment config.
  README.md           Points to this Technical Runbook. First file
                      any AI or developer reads when opening the repo.
  sentry.*.config.ts  Sentry error tracking (client and server configs).

Global design tokens:
  src/app/globals.css Three-layer token system (primitives → semantic →
                      component). Contains all keyframe animations and utility
                      classes. (~1444 lines). See CSS CUSTOM PROPERTIES section.

App routes (src/app/):
  layout.tsx                Root layout: fonts, providers.
  (app)/dashboard/          Authenticated dashboard.
  (app)/generate/spectacle/ Loading animation during plan generation.
    SpectacleVisualLayer.tsx  9-subsystem spectacle (1157 lines). See below.
  (app)/onboarding/         5-step intake flow.
    page.tsx                  Reads URL params at lines 474–495. See below.
  (app)/plans/[id]/         Plan view and print routes.
  (app)/orbit-reports/      Weekly learning reports.
  (app)/settings/           User settings.
  (marketing)/              Unauthenticated pages (landing, pricing, legal).
  api/                      Next.js App Router API route handlers.

Components (src/components/):
  GenerationSpectacle.tsx   Canvas-based plan generation animation.
                            1293 lines. See GENERATION SPECTACLE section.
  Footer.tsx                Plan generator footer. 107 lines. See below.
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
  No .env files. No build step. No server-side secrets in the
  static site itself.

  Supabase credentials are exposed as window globals in:
    C:\Users\amyog\Desktop\wizkoo\js\supabase-config.js
    WIZKOO_SUPABASE_URL      — Supabase project URL
    WIZKOO_SUPABASE_ANON_KEY — Supabase anon/public key
  These are intentionally public-facing. Row Level Security
  policies (sql/library-schema.sql) control data access.

  Netlify Functions (set in Netlify Dashboard > Site Settings >
  Environment Variables — NOT committed to repo):

    OPENAI_API_KEY        — OpenAI Moderation API (Layer 3 of
                            theme content moderation). Used by
                            netlify/functions/validate-theme.js.

    NOTION_API_KEY        — Notion API key for writing rejected
                            theme logs to the moderation database.

    NOTION_MODERATION_DB_ID — Notion database for moderation logs.
                            Value: c8506fad-4656-4dac-b0a0-13aed19067be
                            (Theme / Timestamp / Layer / IP Hash / Status)

    IP_HASH_SALT          — One-time generated salt for IP address
                            hashing. MUST NEVER ROTATE. Rotating breaks
                            repeat-offender hash comparability across
                            all historical log entries.

    RESEND_API_KEY        — Resend API key for weekly moderation
                            digest email (moderation-digest.js).

    RESEND_FROM_EMAIL     — Sending address for moderation digest.
                            Value: moderation@wizkoo.com

    ADMIN_EMAIL           — Recipient for moderation digest.
                            Value: amy@wizkoo.com

  Source commits: 857b057 (Layer 1 implementation), b042e35
  (BLOCKLIST_EXACT dual-tier, regex fix, test matrix).

PLAN GENERATOR (C:\Users\amyog\Desktop\wizkoo-plan-generator)
  Source: .env.example (22 variables)
  All secrets go in .env.local (never committed).

  Database:
    DATABASE_URL          — Postgres connection string (pooler via Supabase)
    DIRECT_URL            — Direct DB URL for drizzle-kit migrations.
                            Must use db.{ref}.supabase.co:5432, NOT pooler host.

  Clerk Authentication (5 vars):
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY — Client-side Clerk key
    CLERK_SECRET_KEY                  — Server-side Clerk key
    CLERK_WEBHOOK_SECRET              — Verifies Clerk webhook signatures
    NEXT_PUBLIC_CLERK_SIGN_IN_URL     — Set to /sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_URL     — Set to /sign-up
    (NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL and AFTER_SIGN_UP_URL
     also in .env.example: /dashboard and /onboarding)

  Stripe Payments (4 + 2 price IDs):
    STRIPE_SECRET_KEY              — Server-side Stripe key
    STRIPE_WEBHOOK_SECRET          — Verifies Stripe webhook events
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY — Client-side Stripe key
    STRIPE_MONTHLY_PRICE_ID        — Monthly plan price ID from Stripe Dashboard
    STRIPE_ANNUAL_PRICE_ID         — Annual plan price ID from Stripe Dashboard

  AI:
    ANTHROPIC_API_KEY    — Claude API key (main plan generation + orbit reports + safety)

  Email:
    RESEND_API_KEY       — Resend transactional email service

  Error tracking:
    SENTRY_DSN           — Sentry project DSN (client + server configs)

  Analytics:
    POSTHOG_API_KEY      — PostHog product analytics

  Rate limiting:
    UPSTASH_REDIS_REST_URL   — Upstash Redis REST endpoint
    UPSTASH_REDIS_REST_TOKEN — Upstash Redis auth token

  Cron job auth:
    CRON_SECRET          — Bearer token checked by all four /api/cron/* routes

---

## CONTENT MODERATION ARCHITECTURE

Applies to: netlify/functions/validate-theme.js,
            index.html (client-side IIFE),
            netlify/functions/moderation-digest.js

Three-layer architecture. Every theme submission passes all three
layers in sequence. A rejection at any layer stops submission.

LAYER 1 — CLIENT-SIDE BLOCKLIST (index.html)
  ~100 terms. Evaluated before any network request.
  Matching: word-boundary regex (\bterm\b) — catches plurals and
    suffixes without false positives on substrings.
  Leetspeak normalization applied before matching:
    0→o, 3→e, 1→i and l, 4→a, 5→s, @→a, !→i
  Dual-tier structure (applied in same client-side pass):
    BLOCKLIST       — word-boundary match. Catches plurals, suffixes,
                      compounds. For terms that should never appear.
    BLOCKLIST_EXACT — full-input match only. For terms (e.g. "weed",
                      "murder") that must allow legitimate phrased use
                      but should be rejected as standalone themes.

LAYER 2 — SERVER-SIDE BLOCKLIST (netlify/functions/validate-theme.js)
  Same blocklist as Layer 1, re-run server-side. Prevents client-side
  bypass. Fail-closed: 3-second timeout blocks submission with a
  generic error message. Never fails open.

LAYER 3 — OPENAI MODERATION API (validate-theme.js)
  Endpoint: https://api.openai.com/v1/moderations
  Threshold: topScore > 0.5 OR flagged === true → reject.
  Timeout: 3 seconds. On timeout, submission is blocked (fail-closed).

REJECTION LOGGING
  Rejected themes are written to Notion database:
    NOTION_MODERATION_DB_ID: c8506fad-4656-4dac-b0a0-13aed19067be
  Fields: Theme, Timestamp, Layer (which layer caught it), IP Hash,
          Status.
  IP address is hashed with IP_HASH_SALT before storage.
  If Notion write fails: console.error fallback to Netlify function logs.

REJECTION UI
  Inline error below theme field: "Let's try a different theme."
  "See suggestions" link surfaces a random Tier 1 safe word.
  Submit button shows "Checking…" during validation.

WEEKLY DIGEST
  netlify/functions/moderation-digest.js sends a weekly summary via
  Resend (RESEND_API_KEY) from RESEND_FROM_EMAIL to ADMIN_EMAIL.

FILES AFFECTED
  index.html                              — Layer 1 IIFE (client blocklist)
  netlify/functions/validate-theme.js     — Layers 2 and 3
  netlify/functions/moderation-digest.js  — Weekly Resend digest

---

## DEPENDENCY INVENTORY

MARKETING SITE (C:\Users\amyog\Desktop\wizkoo\package.json)
  devDependencies (3):
    @playwright/test  ^1.58.2   — Playwright test runner (screenshot automation)
    pg                ^8.20.0   — PostgreSQL client (library data import scripts)
    serve             ^14.2.6   — Local static dev server (npm run serve)
  No runtime dependencies. Static site. No build step.
  Package manager: npm (no lockfile constraint).

PLAN GENERATOR (C:\Users\amyog\Desktop\wizkoo-plan-generator\package.json)
  Package manager: pnpm ONLY. (preinstall script enforces this.)
  Node required: >=20.0.0

  dependencies (23):
    @anthropic-ai/sdk   ^0.82.0    — Anthropic Claude API client
    @clerk/nextjs       ^7.0.8     — Clerk auth (Next.js integration)
    @sentry/nextjs      ^10.47.0   — Sentry error tracking
    @supabase/supabase-js ^2.101.1 — Supabase JS client
    @tanstack/react-query ^5.96.1  — Server state management
    @upstash/ratelimit  ^2.0.8     — Rate limiting (uses Upstash Redis)
    @upstash/redis      ^1.37.0    — Upstash Redis client
    clsx                ^2.1.1     — Class name utility
    drizzle-orm         ^0.45.2    — ORM for Postgres/Supabase
    framer-motion       ^12.38.0   — Animation library
    nanoid              ^5.1.7     — Unique ID generation
    next                16.2.2     — Next.js framework (PINNED — do not auto-upgrade)
    postgres            ^3.4.8     — Postgres driver (used by Drizzle)
    posthog-js          ^1.364.7   — PostHog analytics (client-side)
    posthog-node        ^5.28.11   — PostHog analytics (server-side)
    qrcode.react        ^4.2.0     — QR code generation (plan sharing)
    react               19.2.4     — React (PINNED — matches Next.js 16 requirement)
    react-dom           19.2.4     — React DOM (PINNED)
    resend              ^6.10.0    — Transactional email
    stripe              ^22.0.0    — Stripe payments SDK
    svix                ^1.90.0    — Webhook signature verification (Clerk webhooks)
    tailwind-merge      ^3.5.0     — Tailwind class merging utility
    zod                 ^4.3.6     — Schema validation
    zustand             ^5.0.12    — Client state management

  devDependencies (8):
    @tailwindcss/postcss  ^4       — Tailwind v4 PostCSS integration
    @types/node           ^20      — Node.js TypeScript types
    @types/react          ^19      — React TypeScript types
    @types/react-dom      ^19      — React DOM TypeScript types
    drizzle-kit           ^0.31.10 — Drizzle ORM migration CLI
    eslint                ^9       — Linter
    eslint-config-next    16.2.2   — Next.js ESLint config (PINNED to match Next)
    tailwindcss           ^4       — Tailwind CSS v4
    typescript            ^5       — TypeScript compiler

  PIN NOTE: next@16.2.2, react@19.2.4, react-dom@19.2.4, and
  eslint-config-next@16.2.2 are intentionally pinned. React 19
  and Next 16 are paired versions. Do not upgrade without a
  dedicated upgrade session.

---

## DEPLOYMENT PROTOCOL

MARKETING SITE → Netlify (wizkoo.com)
  Config file: C:\Users\amyog\Desktop\wizkoo\netlify.toml
  Publish directory: . (repo root — serves static files directly)
  Build command: none (no build step)
  Deploy trigger: push to main branch on GitHub (Ethos25/Wizkoo)

  Proxy rules (netlify.toml):
    /plan      → https://wizkoo-plan-generator.vercel.app/plan   (200 proxy)
    /plan/*    → https://wizkoo-plan-generator.vercel.app/plan/:splat (200 proxy)
  Legacy redirects (301):
    /planner     → /plan
    /planner.html → /plan
    /what-we-believe.html → /what-we-believe
    /games.html  → /games
    /methodology.html → /methodology
  Library book detail rewrite (200):
    /library/:slug → /library/book.html

  Deploy checklist:
    1. Ensure TECHNICAL_RUNBOOK.md changes are committed
    2. Push to main: git push
    3. Netlify auto-deploys within ~60s
    4. Verify at wizkoo.com — no build logs to check

PLAN GENERATOR → Vercel (wizkoo.com/plan)
  Config file: C:\Users\amyog\Desktop\wizkoo-plan-generator\vercel.json
  Framework: Next.js (auto-detected by Vercel)
  Build command: pnpm build (next build)
  Output: .next directory
  basePath: /plan (set in next.config.ts)
  Deploy trigger: push to master branch

  Environment variables: all 22 vars from ENVIRONMENT VARIABLES
  section above must be set in Vercel Dashboard > Settings > Environment Variables
  for both Production and Preview environments.

  Cron jobs (vercel.json — runs on Vercel's cron infrastructure):
    orbit-report      — 0 6 * * 0   (Sundays 6am UTC)
                        Path: /plan/api/cron/orbit-report
                        Generates weekly learning narrative emails.
    plan-lifecycle    — 0 3 * * *   (Daily 3am UTC)
                        Path: /plan/api/cron/plan-lifecycle
                        Handles plan expiry, archiving, subscription checks.
    auth-reconciliation — 0 7 * * 1 (Mondays 7am UTC)
                        Path: /plan/api/cron/auth-reconciliation
                        Syncs Clerk auth state with database user records.
    re-engagement     — 0 14 * * *  (Daily 2pm UTC)
                        Path: /plan/api/cron/re-engagement
                        Sends re-engagement emails to inactive users.
  All cron routes validate CRON_SECRET bearer token before executing.

  Deploy checklist:
    1. Ensure pnpm build passes locally: pnpm build
    2. Push to master: git push
    3. Monitor Vercel dashboard for build logs (~2-3 min build time)
    4. Verify at wizkoo.com/plan after deploy completes

---

═══════════════════════════════════════
LAYER 4 — DESIGN SYSTEM
Read this layer before touching any visual element, color, type,
motion, or surface. All design values live here.
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
  Four layers in order (top = first):
    Layer 1: Saffron sun bleed — ellipse 100% 20% at 50% 0%, rgba(232,175,56,0.06)
    Layer 2: Deep space center glow — ellipse at 50% 45%, rgba(24,40,72,0.60) → rgba(16,24,48,0.30)
    Layer 3: Pinstripe texture — repeating 60px vertical lines, rgba(255,255,255,0.012)
    Layer 4: Base — #0C1020
  Note: Base is #0C1020 NOT #101830. Confirmed April 12, 2026.
  Note: The saffron sun layer (Layer 1) must be present. Earlier versions of this
        document omitted it. The source file is the authority.

  Star field implementation (footer.js lines 322–344):
    Container: <div class="wf-stars"> — position:absolute; inset:0; z-index:0;
               pointer-events:none. Sits behind all footer content (z-index:1).
    Count: 120 stars generated by JS loop.
    Each star is a <div> with inline styles:
      position: absolute; border-radius: 50%; background: #F0F2F8;
      left: [0–100]%; top: [0–100]%;
      width/height: 1px (70% of stars), 1.5px (20%), or 2px (10%)
        (determined by: r<0.7 → 1px, r<0.9 → 1.5px, else → 2px)
      animation: wfTwinkle [dur]s ease-in-out infinite [del]s;
      --lo: [0.05–0.17] (random, min opacity)
      --hi: [0.28–0.73] (random, max opacity)
      dur: 2–6 seconds (random)
      del: 0–5 seconds (random)
    Keyframe (footer.js lines 17–20):
      @keyframes wfTwinkle {
        0%, 100% { opacity: var(--lo, 0.12); }
        50%       { opacity: var(--hi, 0.55); }
      }
  STAR FIELD IS THE SOURCE OF TRUTH. Copy from footer.js. Never rebuild from scratch.

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
  Replaces generic black (#0A0A0A) across the entire ecosystem.
  #0C1020 — Ink (96% dark). All text, borders, card outlines on Wizkoo.
  #0C1428 — Sidebar/overlay. Deepest UI layer. Modal backgrounds.
  #101830 — App background base (Atlas, Elementum, night sky pages).
  #182848 — App background center glow. Creates planetarium effect.
  rgba(12,16,32,0.95) + backdrop-filter blur — Nav/footer.
  #1A2A5A — Link hover, focus rings, subtle UI accents in apps.
  #0A41B2 — Cursor phenomenon (exclusion-blend of saffron on linen).
             ONLY at point-scale: cursor, task dots, focus rings.
             NEVER a surface color.
  #7898D0 — Atlas ocean. Bright, watery. Lightest ultramarine member.

DAY SKY (the threshold — the open world between parent and child)
  Locked April 12, 2026. The sky at high noon.
  Emotional register: aspiration, access, openness. A deep breath.

  Sky background gradient:
  linear-gradient(180deg,
    #1A4EC2 0%, #1E54C6 8%, #2260CC 18%,
    #2868CC 30%, #2E6ECE 42%, #306CCC 54%,
    #2C68C6 64%, #2860B8 74%, #2054A8 84%,
    #174496 92%, #123485 100%)

  Sky midpoint reference: #2868CC

  DEPRECATED — NEVER USE: #1848B8
  This appeared in early briefing documents. It is wrong.
  Any session referencing #1848B8 must be corrected before work proceeds.

  Sun corona (above sky, radial at top center):
  radial-gradient(ellipse 90% 60% at 50% -5%,
    rgba(200,130,0,0.90) 0%,
    rgba(232,175,56,0.72) 8%,
    rgba(232,175,56,0.48) 20%,
    rgba(232,175,56,0.24) 36%,
    rgba(220,162,38,0.08) 54%,
    transparent 70%)

  Sun disc (above corona, tight bright core):
  radial-gradient(ellipse 22% 18% at 50% -2%,
    rgba(255,255,220,0.85) 0%,
    rgba(255,240,140,0.65) 18%,
    rgba(232,175,56,0.45) 38%,
    transparent 65%)

  Text on day sky:
    Primary: #FAFAFA
    Secondary: rgba(255,255,255,0.42)
    Eyebrow/label: rgba(255,255,255,0.30)
    Saffron accent: #E8AF38 (unchanged on all surfaces)

---

## TYPOGRAPHY SYSTEM

Marketing Site (Wizkoo):
  Sora — Display headlines, hero text, CTA buttons
    Weights: 200, 300, 700, 800 ONLY
    Weights 400, 500, 600 never appear in headlines
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

These are pixel-identical across linen, night sky, and day sky. No exceptions.

1. Typefaces: Sora + Space Mono + Inter on marketing. No others.
2. Saffron: #E8AF38 exactly. Never adjusted per surface.
3. Eyebrow treatment: Space Mono, 10px, 0.14em, uppercase. Surface-appropriate color.
4. Saffron rule: 32px, 1.5px, #E8AF38. Above every hero eyebrow.
5. Nav: one treatment, all pages. Never transparent. Never surface-matched.

---

## NAV SYSTEM (v4.1 — final locked spec, April 12, 2026)

NAV STATUS: DELIBERATE HOLD — April 17, 2026

Four unresolved questions requiring a dedicated nav session.
Do not touch the nav in any session that does not
explicitly state "this is the nav session."

QUESTION 1 — SPEC VS IMPLEMENTATION
Light Standard specifies frosted glass nav.
Deployed code is solid rgba(12,16,32,0.96).
Amy must decide which is correct.
This is a design decision. Claude Code does not decide.

QUESTION 2 — MARKETING NAV ITEM INVENTORY
The full item list for the marketing nav has not
been finalized. Do not add or remove nav items
without explicit instruction.

QUESTION 3 — PLAN GENERATOR NAV ITEM INVENTORY
The plan generator nav serves authenticated parents only.
Its full item list has not been finalized.
Do not assume marketing nav items apply here.

QUESTION 4 — VISUAL RELATIONSHIP BETWEEN THE TWO NAVS
Whether both navs share the same visual treatment
or are intentionally distinct has not been decided.

All four require a single dedicated nav session.
Until that session happens and answers are recorded here:
nav is frozen exactly as deployed.
Zero nav changes. Zero nav suggestions in other sessions.

---

Source files:
  Marketing nav:       C:\Users\amyog\Desktop\wizkoo\components\nav.js (403 lines)
  Plan generator nav:  C:\Users\amyog\Desktop\wizkoo-plan-generator\src\components\NavBar.tsx (128 lines)

One nav component. Zero modifications per page.
Floats above all three environments unchanged.
One nav. Three moods. Zero code differences.

IMPORTANT — SPEC vs IMPLEMENTATION DIVERGENCE (nav.js lines 90–105):
  The Light Standard spec describes a frosted glass gradient nav. The actual
  implementation was changed to a solid dark nav. Locked decision:
  "Frosted glass nav on linen: solved with dark nav. Do not suggest reverting."
  The current implementation below is what is actually deployed.

Nav Bar CSS — ACTUAL CURRENT CODE (nav.js lines 90–105, .nav rule):
  height: 52px;
  margin: 0;
  padding: 0 40px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(12,16,32,0.96);
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  box-shadow: 0 1px 0 rgba(255,255,255,0.08), 0 4px 24px rgba(12,16,32,0.08);
  isolation: isolate;
  pointer-events: auto;

Container sticky behavior (nav.js lines 274–276):
  #wizkoo-nav element: position:sticky; top:-30px; z-index:20;
  (top:-30px = negative of announce bar height — bar clips above viewport
   as page scrolls 30px, then nav locks at top of viewport)

Nav ::before (noise texture, lines 108–117):
  opacity: 0.030; background-size: 256px 256px; SVG fractalNoise grain; z-index:-1;

Nav links (.nav-link, lines 167–196):
  font-family: 'Space Mono', monospace;
  font-weight: 400; font-size: 7.5px; letter-spacing: 0.15em; text-transform: uppercase;
  color: rgba(255,255,255,0.65);
  ::after underline: height 1px, background #E8AF38, width:0 → 100% on hover
  Hover: rgba(255,255,255,0.90)
  Active: color #FAFAFA, ::after width:100% (permanent)

Nav links are absolute-centered (.nav-center, lines 153–164):
  position: absolute; left: 50%; transform: translateX(-50%);
  gap: 26px between links.

Nav CTA — ACTUAL CURRENT CODE (nav.js lines 199–219, .nav-cta):
  NOTE: Current implementation is GHOST style (transparent bg, saffron border/text).
  The Light Standard spec says saffron fill (#E8AF38 bg, #0C1020 text).
  This is a known divergence. The ghost CTA is what is deployed.
  font-family: 'Sora', sans-serif; font-weight: 700; font-size: 9px;
  letter-spacing: 0.07em; text-transform: uppercase;
  padding: 8px 18px;
  background: transparent; color: #E8AF38;
  border: 1px solid rgba(232,175,56,0.65);
  Hover: border-color rgba(232,175,56,1.0);
         box-shadow: 0 0 0 1px rgba(232,175,56,0.20), 0 2px 12px rgba(232,175,56,0.18);

Announcement Bar — ACTUAL CURRENT CODE (nav.js lines 58–87, .announce):
  height: 30px; position: relative;
  background: rgba(12,16,32,0.44); backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  Text (.announce-text): Space Mono, 7px, letter-spacing 0.28em, uppercase
  Text color (non-homepage): rgba(12,16,32,0.75)   ← DARK INK (see bug note)
  Text color (homepage only): rgba(232,175,56,0.75) ← saffron via inline override
  Homepage bar background override: #0C1020, backdrop-filter: none.
  NOTE: Light Standard spec says text color rgba(232,175,56,0.60) (saffron) on
        all pages. Current code only applies saffron on homepage. See KNOWN BUGS.

Nav Wordmark (nav.js lines 131–148):
  font-family: 'Sora'; font-weight: 800; font-size: 17px;
  letter-spacing: -0.04em; color: #FAFAFA;
  'k': color: var(--saffron), rotate(8deg), transform-origin bottom center;
  Hover 'k': animation kGiggle 0.8s ease-in-out;
  .wm-dot (the superscript saffron circle): position absolute, ::after pseudo-element,
    width .22em height .22em, border-radius 50%, background var(--saffron),
    top .1em right -.2em

Mobile (nav.js lines 259–265):
  < 768px: center nav hidden, hamburger shown, CTA font-size 8px, padding 6px 12px.
  Mobile menu: position:fixed top:52px, slides in with 300ms cubic-bezier(0.16,1,0.3,1).

IMPLEMENTATION WARNING: Most common failure = parent element with overflow: hidden
clipping position: sticky. Verify no parent above #wizkoo-nav has overflow: hidden.
If nav disappears on scroll, that is the cause.

Plan Generator Nav (authenticated — separate from marketing nav):
  File: C:\Users\amyog\Desktop\wizkoo-plan-generator\src\components\NavBar.tsx
  Functional destinations only: Dashboard, Settings.
  Does not contain any marketing nav items.
  A logged-in parent never sees The Plan, The Science, The Ages, etc.
  Links: Space Mono, uppercase, 0.5rem, saffron underline (animated scaleX).
  Scroll behavior: saffron gradient border fades in at scrollY > 10.

---

## TEXT COLOR HIERARCHY — DARK SURFACES

Three planes at rest (Lotte van der Berg + Jiu Yoon):
  Foreground: #F0F2F8 — Names, titles, headlines (always visible)
  Midground:  #C8CDDA — Body text, descriptions (always visible)
  Background: Family color at 35% or #8C91A5 — Labels (always visible)

On engagement (adds two more):
  Meta:   #8C91A5 — Dates, progress, counters
  Ghost:  #50556E — Ambient detail

Accent (moments only): #E8AF38

Maximum five text treatments on any single viewport.
Three at rest. Five on engagement. Never all seven simultaneously.

Why #F0F2F8 not white: Pure white floats on ultramarine.
Cool-tinted white sits — it shares the blue DNA of the surface.

---

## THE $200 STANDARD (Quality Floor Directive)

Source document (Notion): 338335a8d33281f699d4d705f973d430
Read the full document before any build session on the plan generator.
Everything below is binding. Do not weaken it.

### What $200 Feels Like

You know the feeling when you walk into a hotel and within 3 seconds
you know it costs $400 a night? Nobody told you the price.
The lighting is warmer than it needs to be. The spacing is more generous
than it needs to be. Every surface communicates: someone spent more time
on this than they had to.

That is what Wizkoo must feel like.

A parent opens the app. Within 3 seconds, before they read a word:
the linen warmth. The weight of the typography. The saffron that appears
in exactly two places and nowhere else. The silence where other apps
would have confetti. The space between elements that says "we chose not
to cram more in."

They don't think "$200 product." They feel "this is unusually good."
Then they see $50 and the gap between what they feel and what they pay
becomes the story they tell their friend.

THAT GAP IS THE PRODUCT.

### What Kills the $200 Feeling (instantly, not gradually)

A rounded corner where everything else is sharp. Dead.
A system font where Sora should be. Dead.
A green checkmark in a product that uses saffron. Dead.
A "Loading..." where a breathing saffron dot should be. Dead.
A bounce animation where editorial easing should be. Dead.
An error message that says "Oops! Something went wrong!" Dead.
A default Tailwind gray where the warm paper-crease border should be. Dead.

One plastic cup and the entire illusion collapses.
The parent doesn't think "everything else was great but the cup was cheap."
The parent thinks "this place is pretending."

Your job: zero plastic cups.
"Style the card nicely" is how plastic cups get in.
"Paper background (#FAFAFA), 1.5px border in #0C1020, 8px saffron offset
pseudo-element shadow, sharp corners (2px), hover lifts translateY(-2px)
with cubic-bezier(0.16,1,0.3,1) while shadow stays planted" is how
you prevent them.

### The Parent's Internal Monologue (the sequence that must not break)

SECOND 1:  "Oh. This is warm. This doesn't look like an app. Stationery."
SECOND 3:  "That font. Light but confident. Like a magazine, not a website."
SECOND 5:  "Gold. Not yellow. Just a touch of it. Expensive feeling."
SECOND 10: "The cursor changed. The card lifted. Someone built every detail."
MINUTE 1:  "It's using my child's name. In a sentence a person wrote. While I watch."
MINUTE 2:  "This plan looks like it came from a design studio. I want to print this."
MINUTE 3:  "This is $50? How is this $50?"

If any step breaks, the parent never reaches the last thought.
Miss one and the cascade fails.

### $50 vs $200 — Concrete Examples

THE DASHBOARD
  $50: Rounded corners, gray shadow, "1 Plan Generated" stat, green badge, system font.
  $200: Sharp corners, saffron offset pseudo-element shadow, no stat cards (the plan
        IS the dashboard), saffron dot for subscription status, Space Mono uppercase
        nav with saffron underline on hover, parent's family initial floating quietly
        on the right.

THE ONBOARDING
  $50: Multi-field form, "Submit" button, progress dots, "Enter your child's name."
  $200: Full-viewport single question per screen. "Who's learning this week?" in
        Sora 200. Cursor already blinking in the name field. Input borders invisible
        at rest, bloom saffron on focus. "Generate Our Plan" as the singular saffron
        moment. A 2px saffron progress line that slides forward silently.

THE ERROR
  $50: Red box, exclamation icon. "Oops! Something went wrong. Please try again later."
  $200: No box. No red. No icon. Calm text in existing layout. "Taking longer than
        usual. Try again?" One button. Same typography as everything else. The error
        doesn't scream. It speaks.

THE GENERATION WAIT
  $50: Spinning circle. "Loading your plan..."
  $200: A 12px saffron dot that breathes (scale 0.85 to 1.15). No text. The parent
        watches. Then their child's name appears, woven into a sentence about what
        the plan is building. The parent's breath catches. The dot is still breathing.
        The plan materializes.

### The Final Test

Open the product on your phone at 10 PM in a dark room.
Hold it at arm's length.
Does it glow like a luxury object?
Does the linen feel warm?
Does the saffron feel precious?
Does the typography feel editorial?
Does the silence between elements feel intentional?

Yes = $200 product.
"Sort of" = $100 product.
"It looks fine" = $50 product that will be replaced by the next app that looks fine.

### The Prompt Standard

Before writing any Claude Code prompt, ask:
"Will this produce a surface a parent would screenshot and send to a friend?"

If the answer is "probably" or "most of it" — the prompt is not specific enough.
The answer must be "yes, because every color traces to a token, every font has
a specific weight, every animation has a named curve, and every pixel has a reason."

---

═══════════════════════════════════════
LAYER 5 — COMPONENT SPECS
Read this layer when working on animated or interactive components.
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
  CSS tokens for spectacle:
    C:\Users\amyog\Desktop\wizkoo-plan-generator\src\app\globals.css lines 176–252
    All --spectacle-* custom properties. See CSS CUSTOM PROPERTIES section.

Background: Must match footer night sky exactly.
  Navigate to: C:\Users\amyog\Desktop\wizkoo\components\footer.js
  Read the #wizkoo-footer background value (lines 23–41). Copy it exactly.
  Do not approximate. See SURFACE ARCHITECTURE — World 2 for the gradient values.

Star field: Copied from footer.js implementation exactly (lines 322–344).
  Same density (120 stars), same size distribution, same opacity ranges,
  same twinkle timing. z-index must sit beneath ALL existing spectacle elements.

Elements that may NEVER be touched in the spectacle:
  - Nucleus and glow effects
  - Orbital connector lines
  - Child name labels and positioning
  - Subject dot elements and animations
  - Theme headline
  - Generation progress copy
  - Saffron progress bar
  - Any timing, easing, or animation on existing elements

SpectacleVisualLayer phase states: idle | waiting | streaming | assembling |
  settling | crystallizing | complete | error

---

## FIREFLY — MARKETING SITE

Source file: C:\Users\amyog\Desktop\wizkoo\index.html
  DOM element: <div class="firefly" id="firefly"> at line 1152
  Main firefly JS: lines 1897–2159 (IIFE, runs immediately on DOMContentLoaded)
  CSS: lines 585–596 (inline <style> in index.html)
    .firefly { display:none!important }  ← hidden by default
    .firefly.alive { opacity:1 }         ← class added by JS at 2s
    @keyframes fireflyPulse { ... }      ← defined but glow handled by JS
  CTA Firefly (#pricing section): lines 2356–2401 (separate IIFE)

Current animation state:
  The main firefly is ACTIVE. display:none!important is overridden when the
  .alive class is added. Mobile (<768px) and prefers-reduced-motion: hidden.
  The hero-firefly element (line 1211) has display:none inline style — HIDDEN,
  parked. Do not reintroduce.

State machine (6 states):
  waiting → birth → t_move ↔ t_pause → idle ↔ a_move ↔ a_flee
  waiting:  parked at spawn, 2s delay before any motion
  birth:    fade + scale in over 350ms using cbEase (Newton-Raphson bezier solver)
  t_move:   travel hop — quadratic bezier arc, 580–880ms per hop
  t_pause:  brief rest between travel hops, 200–480ms
  idle:     hovering in place, 800–1800ms. Two incommensurate sin frequencies
            (1.8 Hz + 2.9 Hz) → 2–3px vertical drift
  a_move:   autonomous hop inside play area, 42–68px, 600–900ms
  a_flee:   mouse within 80px → dart 42–68px away, 300–420ms, then enter idle

Spawn (lines 1931–1937):
  Origin: .nav-wm .wm-dot element getBoundingClientRect().
  Exact math: x = el.right + fontSize*0.09, y = el.top + fontSize*0.21
  (centers on the ::after saffron circle superscript)
  Spawns 2000ms after page load.

Travel (lines 1996–2046):
  7–10 hops of 42–68px each toward .nh-right play area.
  Each hop is a quadratic bezier arc with ±14/11px control point jitter.
  Play area bounds: .nh-right getBoundingClientRect(), 20px inset on all sides.

Glow system — independent of movement (lines 1975–1993):
  States: dim → flash → fade → dim
  Flash: 0 → 1 in 80ms
  Fade: 1 → 0.55 over 600–1000ms
  Next flash interval: 2000–4000ms after fade completes
  Applied via JS: opacity = 0.4 + gAmt*0.6; boxShadow = dual saffron rings
  Inner ring: rgba(232,175,56,0.25–0.75), 3–11px blur
  Outer ring: rgba(232,175,56,0.07–0.24), 7–18px blur

Flee (lines 2070–2082):
  Mouse within 80px (6400 px² dist check) → doFlee()
  Dart angle: atan2(ffy-my, ffx-mx) ± 0.32 radians
  Distance: 42–68px, duration 300–420ms
  After flee: enter idle 800–1600ms

Hide on deep scroll (lines 2215–2223):
  Opacity → 0 when scrollY > 1.5× viewport height.
  Restores when scrolled back up.

CTA Firefly — #pricing section (lines 2356–2401):
  Separate IIFE. Triggered by IntersectionObserver at 0.4 threshold.
  One-shot: fires once when #pricing scrolls 40% into view.
  Spawns at left edge of .btn-main, drifts 2600ms with sin/cos pattern:
    x offset: sin(t*2.1)*14 + sin(t*4.7)*6
    y offset: cos(t*1.6)*10 + cos(t*3.3)*4
  Fades out after 2600ms. Does not repeat.
  Size: 5px circle, #E8AF38, box-shadow saffron glow.
  Status: Fix pending (see KNOWN BUGS).

Mobile below 768px: hidden (display:none!important in CSS).
  Resize handler kills and hides if window shrinks below 768px.
prefers-reduced-motion: hidden (display:none!important in CSS).
JS only. requestAnimationFrame loop. No CSS keyframes for movement.

---

## HOMEPAGE HERO — LOCKED STATE

Hero (Section 1): Full linen, full width. No split environments.
No entrance animation (removed permanently).

Left column (62%):
  Saffron rule: 32px, 1.5px, #E8AF38
  Eyebrow: "ONE PRICE. EVERY CHILD." Space Mono, 10px, letterspaced uppercase
  H1 span 1: "Personalized weekly" — Sora 200, rgba(12,16,32,0.72), display:block
  H1 span 2: "homeschool plans." — Sora 800, #0C1020, display:block
  H1 span 3: "And tracking." — Sora 700, #E8AF38, 0.65em. PERIOD. NEVER EXCLAMATION.
  Line break locked after "weekly": add <br> tag, not browser-dependent.
  Subtext 1: "...so you always know where you stand." Sora 300, italic,
             rgba(12,16,32,0.52), padding-left: 20px
  Subtext 2: "Covers every domain of every US educational standard. Automatically."
             Sora 300, rgba(12,16,32,0.72)

Right column (38%):
  Saffron left border: 2px, #E8AF38 (column separator)
  Label: "TELL US ABOUT YOUR FAMILY." Space Mono, 9px, rgba(12,16,32,0.38)
  Field 1: child name (text input)
  Field 2: age select — 1-12, NUMBERS ONLY, NO "years old" descriptor
  Field 3: theme text input
  Suggestion buttons: DINOSAURS / SPACE / OCEANS / ANCIENT EGYPT
    Space Mono, sharp corners, saffron on hover, NO EMOJI EVER
  Submit: "BUILD MY FAMILY'S WEEK →" — saffron fill, L-bracket detail
  Microcopy: "Have more kids? Add them on the next screen."
  Firefly: 3px, #E8AF38, breathing drift animation, 2s delay

Handoff URL:
  wizkoo.com/plan/onboarding?childName=[name]&childAge=[age]&theme=[theme]
  Confirmed working. Parameters read in onboarding/page.tsx lines 474-495.

Section 2 (Granddad):
  Full night sky both panels.
  "Granddad broke his foot." Existing orbital diagram. Seven subject labels.

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

═══════════════════════════════════════
LAYER 6 — FAILURE PREVENTION
Read this layer before every session. These are the documented ways
this project has gone wrong — do not repeat them.
═══════════════════════════════════════

## KNOWN CLAUDE CODE FAILURE PATTERNS

These are documented failure modes Claude Code has
exhibited in this codebase. Read before every session.
Do not repeat them.

PATTERN 1 — CACHE BLAME
When a visual fix does not land, Claude Code defaults
to blaming browser cache. If the problem persists in
incognito, it is not cache. It is the wrong file or
the wrong rule. Require a source hunt before accepting
any cache explanation.

PATTERN 2 — DESTINATION-BASED ANIMATION
Claude Code defaults to bezier-from-A-to-B animation
for any movement task. This produces mechanical,
predictable motion. For organic movement (firefly,
particles, ambient elements) the architecture must be
velocity-based with steering, not destination-based.
If you find yourself writing a bezier to a point,
the architecture is wrong.

PATTERN 3 — WRONG FILE EDITED
When a specificity conflict exists, Claude Code will
sometimes edit a secondary file instead of finding
and changing the winning rule at source. Always run
a full specificity audit before making any CSS change.
Find the winning rule. Change it there. Do not add
new rules on top of conflicting ones.

PATTERN 4 — PARTIAL COMPLETION PRESENTED AS DONE
Claude Code will sometimes complete steps 1-2 of a
5-step task and present the result as finished.
Apply the Completion Standard to every task:
built, migrated, verified, old version removed,
system clean. If any step is missing, name it.

PATTERN 5 — RAW HEX INSTEAD OF TOKEN
Claude Code will hardcode color values directly in
components instead of consuming the CSS custom property.
Every color in this codebase has a token definition.
Use the variable. Never the raw hex in a component.
If you see a raw hex in a component file, that is a bug.

PATTERN 6 — APPROXIMATED VALUES
When Claude Code cannot immediately find a source value,
it will sometimes use a close approximation instead of
reading the source file. This is never acceptable.
If a value is in the runbook, use that exact value.
If a value is not in the runbook, navigate to the source
file and read it. Never approximate.

PATTERN 8 — CLIENT/SERVER LIST DIVERGENCE
When a moderation rule exists in both a server function
(validate-theme.js) and a client-side IIFE (index.html),
Claude Code will update one and not the other. The two
lists are independent copies — they do not share a module.
Prevention rule: Any change to BLOCKLIST or BLOCKLIST_EXACT
must be applied to BOTH files in the same commit. After
editing either file, grep the other for the changed term
before committing. A commit that updates one list and not
the other is incomplete by definition.

PATTERN 7 — HARDCODED TEMPORAL VALUES IN PROCEDURAL INSTRUCTIONS
When writing procedural instructions (close protocol, startup
sequence, flight log steps), Claude Code will sometimes embed
the current session's date or context-specific values directly
into the instruction text — values that must stay dynamic.
Example: writing "2026-04-17" into a step that will be
executed on future dates with different values.
Prevention rule: Any date, hash, or session-specific value
inside a procedural instruction must use a placeholder or
formula, never a literal from the current session.
Correct: "today's actual date in YYYY-MM-DD format"
Wrong: "2026-04-17"
If you wrote a literal where a formula belongs, it is a bug.
Correct it before closing the session.

PATTERN 9 — CLASS-NAME AUDIT MISSES VISUAL CONSTRUCTS
When an audit searches for a visual by class name (e.g. "find
the L-bracket") it will miss constructs whose visual effect is
produced through a mechanism whose CSS class name does not match
the visual's name — e.g. box-shadow tricks, pseudo-elements,
or positioned siblings named for their semantic role, not their
appearance.
Example: the Open Seat hero button had `box-shadow: 6px 6px 0
#E8AF38` producing the L-bracket effect, but the class was
`.btn-sky`. Searching "bracket" found nothing and the audit
reported the element as absent.
Prevention rule: If an audit returns "element does not exist"
but the visual is clearly present in the rendered page, the
audit has failed. Re-scan using the visual's mechanism as the
search target (the color value, the property name, the specific
CSS rule), not the semantic label you expected the class to have.
Never accept "not present" until a mechanism-based search
confirms absence.

PATTERN 10 — RESPONSIVE OVERRIDE MISS
When removing a dead top-level selector, the audit will miss
corresponding responsive overrides for that same selector
defined inside @media query blocks lower in the same file.
Example: During the April 2026 dead CSS cleanup, top-level
rules like .hero-eyebrow, .hero-cascade, .hcard* and .id-tags-*
were correctly identified and removed, but their mobile overrides
inside @media(max-width:768px) were not flagged in the original
audit and were only caught during execution.
Prevention rule: After removing any top-level dead selector,
immediately grep for that selector name across all @media
blocks in the same file before declaring the removal complete.
Any responsive override for a dead selector is also dead.
The audit pass is not complete until both the top-level rule
and all its responsive overrides have been confirmed removed.

---

## PRESERVATION LOCKS REGISTRY

### WHY THIS SECTION EXISTS

Preservation locks are systems, files, or code sections that must not
be modified even when Claude Code believes a modification would improve
things. Without a registry, these locks live only in Amy's prompt
context — listed manually every session that touches a surface with
locked systems. Forgetting to include a lock in a prompt produces
silent breaks: Claude Code sees the locked code, assesses it as
cleanable, and modifies it. The break is not discovered until the
broken system is exercised.

This registry moves the locks from per-prompt recitation to session-
start ambient protection. The Session Startup Instruction loads Layer 6
at every session. Locks registered here are known to Claude Code from
the first prompt forward. Amy's prompts reference the registry by name
instead of re-listing items.

### HOW TO USE THE REGISTRY

Operator side (Amy drafting prompts): in the PRESERVATION LOCKS section
of any prompt touching a registered surface, reference the registry by
name. Example: "Do not touch any item in the Homepage Form Preservation
Locks Registry." Do not re-list items inline. If the prompt targets a
specific registered surface, name it. If the prompt is broader,
reference all relevant registries.

Executor side (Claude Code receiving prompts): Layer 6 is loaded at
session start. Every registered lock is known from session open. If a
prompt appears to touch a registered surface but does not explicitly
reference the registry in its PRESERVATION LOCKS section, Claude Code
must proactively apply the registry and confirm with Amy before
executing. Enforcement by default, not by invocation.

### HOMEPAGE FORM PRESERVATION LOCKS

Surface: the intake form on the homepage hero (index.html). Origin:
three-layer content moderation architecture and Notion logging
integration built April 2026. Breaking any item below produces silent
form failures in production.

Item 1  — BLOCKLIST array (~100 terms). Client-side Layer 1 word-
           boundary match list. Catches plurals and suffixes.

Item 2  — BLOCKLIST_EXACT array (~12 terms). Client-side Layer 1 full-
           input match list. For terms that must allow legitimate phrased
           use but block exact submission.

Item 3  — normalizeLeet() function. Leet-speak conversion (0→o, 3→e,
           1→i/l, 4→a, 5→s, @→a, !→i). Prevents bypass via character
           substitution.

Item 4  — isThemeBlocked() and isExactBlocked() functions. Check
           functions that consume the blocklists.

Item 5  — Capture-phase submit listener. First interception. Runs
           Layer 1 client blocklist check, then POSTs to
           /api/validate-theme for Layer 2 and 3 checks.

Item 6  — Bubble-phase submit listener. Runs after capture phase
           clears. Handles progress gate display and email capture flow.

Item 7  — checkReady() function. Submit button gating logic. Enables
           or disables submit based on form state.

Item 8  — Theme field keydown handler. Prevents 3rd word and double
           spaces. Enforces theme format constraint at input time.

Item 9  — Paste sanitizer. Prevents multi-line pastes and mass-paste
           attack vectors.

Item 10 — 60-char maxlength on theme input. Enforced in HTML attribute.

Item 11 — 30-char maxlength on name input. Enforced in HTML attribute.

Item 12 — #theme-error element. DOM element consumed by validation
           error display logic.

Item 13 — #theme-network-error element. DOM element consumed by
           network/API error display logic.

Item 14 — "See suggestions" Tier 1 word fallback link. Referenced by
           error state logic.

Item 15 — "Checking..." submit state. Transient submit button state
           during /api/validate-theme call.

Item 16 — Notion logging. Uses NOTION_API_KEY and
           NOTION_MODERATION_DB_ID environment variables. Logs all
           moderation rejections to Notion database
           c8506fad-4656-4dac-b0a0-13aed19067be. Console.error fallback
           on Notion failure.

Item 17 — Submit URL to wizkoo-plan-generator.vercel.app. Specific
           param names (childName, childAge, theme, email, wigglyKid).
           Changing param names breaks the handoff.

Item 18 — All existing :root design tokens in index.html. Token removal
           is a Layer 2 hygiene task with its own scoped prompt, not a
           side effect of form work.

Item 19 — netlify/functions/validate-theme.js. Entire file is locked
           from form-work prompts. Server-side Layer 2 and 3 moderation
           logic lives here.

### ADDING NEW REGISTRIES

This section is designed to expand. Candidate surfaces that may warrant
their own preservation registries as they harden: Plan Generator
onboarding form (Next.js app), Plan Generator webhook handlers (Stripe,
Clerk), Plan Generator cron jobs, Elementum game state management
(game.js monolith), Atlas continent palette and geographic data, Safety
gate logic (safety.ts).

New registries are added via the Transfer Queue. Each new registry
follows the same format: surface name, origin context, numbered items
with one-line rationale per item. Registries never shrink except by
deliberate decision logged in LOCKED DECISIONS with a superseding entry.

---

## OPEN ITEMS (post-launch follow-up)

1. BRUSHSTROKE SVG ASSET — UPGRADE REQUIRED
   Current state: The brushstroke checkmark in the homepage hero form (Field 1
     fill, Field 2 fill, Wiggly kid toggle on-state) uses a close approximation
     built from a single quadratic bezier path (SVG <path> Q command). It reads
     as a checkmark but lacks genuine hand-drawn character.
   Location: index.html — three identical inline SVG instances within .brushcheck
     elements; wiggly toggle uses fourth instance in .wiggly-check-svg.
   What to do: Commission a hand-drawn brushstroke checkmark illustration (Figma
     with pen tool, Procreate, or Illustrator) and export as optimized SVG.
     Replace placeholder <path> across all four instances. The SVG must have
     stroke-dasharray/stroke-dashoffset set to path length so the SMIL draw
     animation works. Measure the new path length and update both attributes.
   Priority: Post-launch polish. Current state passes visual QA at normal reading
     distance. Do not block launch on this.

2. css/components.css — FUTURE PAGES MUST LINK
   Current state: css/components.css was created April 19, 2026 as the single
     source of truth for .l-bracket-cta per Operating Principle 6.
     Currently linked from: index.html, the-open-seat.html.
   What to do: Every page that uses the L-bracket CTA pattern must link
     css/components.css in its <head>. Do not duplicate the rule inline.
     Before adding any new L-bracket to a new page, confirm the link exists.
   Prevention: Add to pre-flight audit checklist for any new page build:
     "Does this page link css/components.css if it uses .l-bracket-cta?"

3. --expo EASING TOKEN — CONSOLIDATION REQUIRED
   Current state: --expo is defined in index.html's inline :root. --ease-out-expo
     is defined in css/tokens.css. They are the same curve. css/tokens.css is not
     linked from index.html. Components and linked stylesheets (components.css)
     use --ease-out-expo from tokens.css. Inline index.html styles
     use --expo. This is fragmentation of the same token across two files.
   What to do: Link css/tokens.css from index.html. Remove --expo from the inline
     :root (or alias it to --ease-out-expo for backwards compatibility). Update all
     inline index.html references from var(--expo) to var(--ease-out-expo).
     This unifies the token under one name, one file, one definition.
   Related: Known Bug #7 (--ease-out-expo not linked in index.html).
   Priority: Dedicated tokens cleanup session. Do not mix into feature work.

4. .lib-active-filters DUPLICATE — DEFERRED
   Current state: .lib-active-filters is defined twice in css/library.css:
     once in the main block (~line 228) and again in the responsive section
     (~line 746). These are structurally distinct contexts (base vs. mobile
     override), but the duplication was flagged in the April 2026 dead CSS
     audit as Category 4 Finding 4.1 and deferred by Amy's explicit decision.
   What to do: Audit both blocks. If one is genuinely dead, remove it.
     If both are live but producing the same output, consolidate.
   Priority: Dedicated library.css cleanup session.

5. components.css line 48 — rgba(232,175,56,1) STILL HARDCODED
   Current state: @keyframes bracket-pulse contains two keyframe stops using
     rgba(232,175,56,1) at 0%/100% and rgba(232,175,56,0.9) at 50%.
     The 0%/100% value was an approved Section B MEDIUM replacement in the
     April 21, 2026 token consolidation pass, but was skipped at execution
     time because it is inside a keyframe interpolation. Replacing with
     var(--saffron) is technically safe (custom properties resolve before
     animation interpolation) but was conservatively excluded per preflight
     rules.
   Location: css/components.css — @keyframes bracket-pulse, line 48.
   What to do: Replace rgba(232,175,56,1) with var(--saffron) in the
     0%/100% keyframe stop. Verify the bracket-pulse animation still
     renders correctly in browser (saffron fully opaque → 0.9 opacity
     pulse should be imperceptible but intact).
   Note: rgba(232,175,56,0.9) at the 50% stop has no matching token
     (no opacity tint tokens exist). Leave that value hardcoded.
   Priority: Next token consolidation pass or standalone 1-line fix.

6. 8 HTML PAGES — INLINE :root INSTEAD OF LINKING tokens.css
   Current state: ages.html, contact.html, esa.html, pricing.html,
     privacy.html, terms.html, what-we-believe.html, the-open-seat.html
     each define their own inline :root block with token values
     (--saffron, --ink, --linen, --paper, etc.) instead of linking
     css/tokens.css. This creates 8 parallel sources of truth for the
     same token values. Any future token change must be applied in 9
     places (tokens.css + 8 inline blocks).
   What to do: For each page: add <link rel="stylesheet" href="css/tokens.css">
     to <head>, then remove or reduce the inline :root to only page-specific
     overrides (e.g. --expo, --snap, --m-col if not in tokens.css).
     Verify the page renders correctly after each change.
   Note: index.html is excluded (Preservation Lock item 18).
   Priority: Dedicated tokens cleanup session. Coordinate with OPEN ITEM 3
     (--expo / --ease-out-expo consolidation) — both should be resolved
     in the same pass.

7. HOVER QUERY CENTRALIZATION INTO base.css — DEFERRED
   Current state: All pages now use consistent OR syntax
     `(hover:none),(pointer:coarse)` (standardized April 21, 2026).
     However, each page still declares its own hover media query inline
     rather than inheriting from css/base.css, which already declares
     the correct OR form at line 29.
   What to do: For each page that declares `@media(hover:none),(pointer:coarse)`
     inline, verify that css/base.css:29 already covers the same selectors,
     then remove the per-page inline declaration. Pages to audit:
     index.html (lines 543, 569, 849), about.html (134), pricing.html (91),
     what-we-believe.html (81), ages.html (62), esa.html (129).
   Note: Some per-page blocks contain page-specific hover resets
     (e.g. about.html .tier:hover, what-we-believe.html .belief:hover)
     that cannot move to base.css without creating specificity dependencies.
     These must remain per-page; only the shared .cursor{display:none}
     pattern is a candidate for centralization.
   Priority: Dedicated hover centralization session. Do not mix into
     feature work. Deferred from April 21, 2026 responsive audit (Conflict 4).

---

## ACCESSIBILITY (non-negotiable)

prefers-reduced-motion: kills all particle effects. Opacity-only transitions.
All interactive elements: keyboard equivalents.
Dragon state changes: aria-live.
Tier transitions: aria-live='assertive'.
Contrast: #0C1020 on all surfaces must pass WCAG AAA (7:1) at body text size.
Audio: "gentle sounds" mode removes all sudden-onset sounds.

---

## PERFORMANCE (non-negotiable)

Target device: 2020 iPad Air, Safari, 3 tabs open.
No CSS filter:blur() on simultaneously visible tiles.
One orbiting particle per tile maximum on grid.
All animation loops pause via IntersectionObserver when offscreen.

---

═══════════════════════════════════════
LAYER 7 — DEEP REFERENCE
Read this layer only when you need exact token values, API details,
or prompt system internals. Do not read on every session.
═══════════════════════════════════════

## CSS CUSTOM PROPERTIES — MARKETING SITE

Source: C:\Users\amyog\Desktop\wizkoo\css\tokens.css (62 lines, :root block)

Colors:
  --saffron:              #E8AF38                                         (line 3)
  --saffron-pale:         #FFF9EE                                         (line 4)
  --ink:                  #0C1020                                         (line 5)
  --paper:                #FAFAFA                                         (line 6)
  --warm-bg:              #ECEAE3                                         (line 7)
  --mid:                  #4A4850                                         (line 8)
  --faint:                #A8A6B0                                         (line 9)
  --rule:                 #E0DED6                                         (line 10)
  --linen:                #F2F0EA                                         (line 30)
  --section-light:        var(--linen)                                    (line 33)
  --section-warm:         var(--warm-bg)                                  (line 34)

Spacing:
  --section-pad:          80px                                            (line 13)
  --section-pad-mobile:   48px                                            (line 14)
  --content-pad:          48px                                            (line 15)
  --content-pad-mobile:   24px                                            (line 16)
  --max-width:            1200px                                          (line 17)

Type scale:
  --hero-size:            4.8rem                                          (line 20)
  --hero-size-mobile:     2.4rem                                          (line 21)
  --h2-size:              2.8rem                                          (line 22)
  --h2-size-mobile:       1.8rem                                          (line 23)
  --body-size:            1.05rem                                         (line 24)
  --small-size:           0.95rem                                         (line 25)
  --tag-size:             0.6rem                                          (line 26)
  --button-size:          0.78rem                                         (line 27)

Shadows:
  --shadow-soft:          0 4px 24px rgba(10, 10, 10, 0.06)              (line 37)
  --shadow-card:          0 8px 32px rgba(10, 10, 10, 0.08)              (line 38)
  --shadow-elevated:      0 16px 48px rgba(10, 10, 10, 0.12)             (line 39)
  --shadow-saffron-glow:  0 8px 32px rgba(232, 175, 56, 0.15)            (line 40)

Element family colors (Elementum app):
  --elem-nonmetal:        #5B8C5A                                         (line 43)
  --elem-noble-gas:       #7B68AE                                         (line 44)
  --elem-transition:      #4A7FB5                                         (line 45)
  --elem-metalloid:       #8B7355                                         (line 46)

Program colors:
  --prog-atlas:           #2D7A8A                                         (line 49)
  --prog-elementum:       var(--saffron)                                  (line 50)

Animation:
  --ease-out-expo:        cubic-bezier(0.16, 1, 0.3, 1)                  (line 53)
  --ease-out-back:        cubic-bezier(0.34, 1.56, 0.64, 1)              (line 54)
  --duration-normal:      400ms                                           (line 55)
  --duration-slow:        700ms                                           (line 56)
  --duration-reveal:      900ms                                           (line 57)

Texture:
  --grain-opacity:        0.03                                            (line 60)
  --noise-url:            SVG data URL (fractalNoise baseFrequency 0.9, 4 octaves) (line 61)

Additional tokens defined inline in nav.js (injected into :root, lines 27–31):
  --expo:                 cubic-bezier(0.16,1,0.3,1)
  --saffron:              #E8AF38   (duplicate — nav ensures fallback)
  --ink:                  #0C1020   (duplicate — nav ensures fallback)

---

## CSS CUSTOM PROPERTIES — PLAN GENERATOR

Source: C:\Users\amyog\Desktop\wizkoo-plan-generator\src\app\globals.css

LAYER 1: PRIMITIVE TOKENS (lines 13–125)

Colors — The Triad:
  --color-saffron:                    #E8AF38                            (line 15)
  --color-saffron-hover:              #F0BD50                            (line 16)
  --color-saffron-pressed:            #D4A030                            (line 17)
  --color-ink:                        #0C1020                            (line 18)
  --color-linen:                      #F2F0EA                            (line 19)
  --color-paper:                      #FAFAFA                            (line 20)
  --color-warm-bg:                    #ECEAE3                            (line 21)
  --color-rule:                       #E0DED6                            (line 22)

Colors — Ultramarine spectrum:
  --color-ultramarine-sidebar:        #0C1428                            (line 25)
  --color-ultramarine-base:           #101830                            (line 26)
  --color-ultramarine-glow:           #182848                            (line 27)
  --color-ultramarine-mid:            #1A2A5A                            (line 28)
  --color-ultramarine-cursor:         #0A41B2                            (line 29)

Colors — Semantic states:
  --color-error:                      #E85A5A                            (line 35)
  --color-warning:                    rgba(232, 175, 56, 0.6)            (line 36)

Colors — Text on light surfaces:
  --color-text-primary:               #0C1020                            (line 39)
  --color-text-secondary:             #4A4850                            (line 40)
  --color-text-tertiary:              #666666                            (line 41)
  --color-text-muted:                 #999999                            (line 42)
  --color-text-muted-aa:              #666666  (WCAG AA fix)             (line 46)

Colors — Text on dark surfaces:
  --color-text-primary-dark:          #F0F2F8                            (line 49)
  --color-text-body-dark:             #C8CDDA                            (line 50)
  --color-text-meta-dark:             #8C91A5                            (line 51)
  --color-text-ghost-dark:            #50556E                            (line 52)

Colors — Dark surface elevations:
  --color-surface-sidebar:            #0C1428                            (line 55)
  --color-surface-floor:              #101830                            (line 56)
  --color-surface-card-dark:          #1A2440                            (line 57)
  --color-surface-modal-dark:         #202C4A                            (line 58)

Spacing (4px base):
  --space-xs:    4px                                                     (line 61)
  --space-sm:    8px                                                     (line 62)
  --space-md:    16px                                                    (line 63)
  --space-lg:    24px                                                    (line 64)
  --space-xl:    32px                                                    (line 65)
  --space-2xl:   48px                                                    (line 66)
  --space-3xl:   64px                                                    (line 67)
  --space-4xl:   80px                                                    (line 68)

Typography — font families:
  --font-display:    var(--font-sora, 'Sora', sans-serif)                (line 71)
  --font-body:       var(--font-inter, 'Inter', system-ui, -apple-system, sans-serif) (line 72)
  --font-mono:       var(--font-space-mono, 'Space Mono', monospace)     (line 73)

Typography — size scale:
  --text-xs:     0.42rem                                                 (line 76)
  --text-sm:     0.48rem                                                 (line 77)
  --text-base:   0.72rem                                                 (line 78)
  --text-md:     0.82rem                                                 (line 79)
  --text-lg:     0.92rem                                                 (line 80)
  --text-xl:     1.0rem                                                  (line 81)
  --text-2xl:    1.2rem                                                  (line 82)
  --text-3xl:    1.8rem                                                  (line 83)
  --text-4xl:    2.4rem                                                  (line 84)
  --text-hero:   clamp(2.25rem, 5vw, 4rem)                              (line 85)

Animation — easings:
  --ease-editorial:  cubic-bezier(0.16, 1, 0.3, 1)                      (line 88)
  --ease-snap:       cubic-bezier(0.22, 1, 0.36, 1)                     (line 89)
  --ease-bounce:     cubic-bezier(0.34, 1.56, 0.64, 1)                  (line 90)

Animation — durations:
  --duration-instant:    80ms                                            (line 93)
  --duration-fast:       150ms                                           (line 94)
  --duration-normal:     280ms                                           (line 95)
  --duration-slow:       400ms                                           (line 96)
  --duration-entrance:   600ms                                           (line 97)

Elevation — saffron offset shadows:
  --shadow-card:          8px 8px 0 var(--color-saffron)                (line 100)
  --shadow-card-hover:    12px 12px 0 var(--color-saffron)              (line 101)
  --shadow-card-completed: 8px 8px 0 #D4D8E8                            (line 102)
  --shadow-button:        6px 6px 0 var(--color-saffron)                (line 103)
  --shadow-button-hover:  9px 9px 0 var(--color-saffron)                (line 104)
  --shadow-subtle:        0 2px 4px rgba(12,16,32,0.04),
                          0 8px 24px rgba(12,16,32,0.06)                (line 105)

Border radius:
  --radius-none:   0px                                                   (line 108)
  --radius-sm:     2px                                                   (line 109)
  --radius-md:     4px                                                   (line 110)
  --radius-lg:     8px                                                   (line 111)
  --radius-full:   9999px                                                (line 112)

Z-index scale:
  --z-base:        0                                                     (line 115)
  --z-card:        1                                                     (line 116)
  --z-sticky:      10                                                    (line 117)
  --z-overlay:     100                                                   (line 118)
  --z-spectacle:   200                                                   (line 119)
  --z-nav:         1000                                                  (line 120)
  --z-cursor:      999999  (above Clerk popover)                        (line 124)

LAYER 2: SEMANTIC TOKENS (lines 129–150)

  --accent-primary:           var(--color-saffron)                       (line 130)
  --accent-primary-hover:     var(--color-saffron-hover)                 (line 131)
  --accent-primary-pressed:   var(--color-saffron-pressed)               (line 132)
  --bg-page:                  var(--color-linen)                         (line 134)
  --bg-card:                  var(--color-paper)                         (line 135)
  --bg-section-alt:           var(--color-warm-bg)                       (line 136)
  --bg-input:                 var(--color-paper)                         (line 137)
  --border-default:           var(--color-ink)                           (line 139)
  --border-subtle:            var(--color-rule)                          (line 140)
  --focus-ring-color:         var(--color-ultramarine-cursor)            (line 142)
  --focus-ring-width:         2px                                        (line 143)
  --focus-ring-offset:        2px                                        (line 144)
  --nav-height:               48px                                       (line 147)
  --nav-bg:                   rgba(12, 16, 32, 0.95)                    (line 148)
  --blur-nav:                 12px                                       (line 149)

LAYER 3: COMPONENT TOKENS (lines 154–172)

Plan card:
  --plan-card-bg:             var(--bg-card)                             (line 156)
  --plan-card-border-width:   1.5px                                      (line 157)
  --plan-card-radius:         var(--radius-sm)                           (line 158)
  --plan-card-padding:        var(--space-lg)                            (line 159)
  --plan-card-shadow-offset:  8px                                        (line 160)
  --plan-card-shadow-color:   var(--color-saffron)                       (line 161)

Block card:
  --block-card-border-left:   2px solid var(--accent-primary)            (line 164)
  --block-card-bg-hover:      rgba(232, 175, 56, 0.03)                   (line 165)
  --block-card-bg-completed:  rgba(232, 175, 56, 0.02)                   (line 166)

Intake:
  --intake-max-width:         480px                                      (line 169)
  --intake-progress-height:   2px                                        (line 170)
  --intake-continue-height:   56px                                       (line 171)

SPECTACLE TOKENS (lines 176–252) — all prefixed --spectacle-*

Nucleus Glow (A9):
  --spectacle-nucleus-glow-opacity-min:          0.04                   (line 178)
  --spectacle-nucleus-glow-opacity-max:          0.06                   (line 179)
  --spectacle-nucleus-glow-opacity-spike:        0.12                   (line 180)
  --spectacle-nucleus-glow-cycle-resting:        6s                     (line 181)
  --spectacle-nucleus-glow-cycle-active:         4.5s                   (line 182)
  --spectacle-nucleus-glow-radius:               40%                    (line 183)
  --spectacle-nucleus-glow-radius-mobile:        50%                    (line 184)
  --spectacle-nucleus-glow-radius-contracted:    36%                    (line 185)
  --spectacle-nucleus-glow-materialize-duration: 800ms                  (line 186)

Orbital Paths (A9):
  --spectacle-orbit-stroke-opacity-1:       0.05                        (line 189)
  --spectacle-orbit-stroke-opacity-2:       0.04                        (line 190)
  --spectacle-orbit-stroke-opacity-3:       0.03                        (line 191)
  --spectacle-orbit-stroke-opacity-4:       0.025                       (line 192)
  --spectacle-orbit-stroke-width-1:         1px                         (line 193)
  --spectacle-orbit-stroke-width-4:         0.8px                       (line 194)
  --spectacle-orbit-rotation-resting:       120s                        (line 195)
  --spectacle-orbit-rotation-assembling:    180s                        (line 196)
  --spectacle-orbit-entrance-stagger:       150ms                       (line 197)
  --spectacle-orbit-entrance-start:         400ms                       (line 198)
  --spectacle-orbit-fade-duration:          500ms                       (line 199)

Breathing Dot (A9):
  --spectacle-dot-size-birth:               12px                        (line 202)
  --spectacle-dot-size-evolved:             6px                         (line 203)
  --spectacle-dot-migration-duration:       400ms                       (line 204)
  --spectacle-dot-breathe-cycle:            2s                          (line 205)

Tier Warmth (D17-020):
  --spectacle-tier-warmth-base:             1.0                         (line 208)
  --spectacle-tier-warmth-returning:        1.1  (5–19 plans)           (line 209)
  --spectacle-tier-warmth-veteran:          1.15 (≥20 plans)            (line 210)

Freshness (D17-018):
  --spectacle-freshness-angle-variance:     15                          (line 213)

Settle Revert (D17-024/D17-026):
  --spectacle-settle-revert-duration:       150ms                       (line 216)

Ember Dots (A10):
  --spectacle-ember-size:                   5px                         (line 219)
  --spectacle-ember-opacity-resting:        0.4                         (line 220)
  --spectacle-ember-opacity-flash:          0.8                         (line 221)
  --spectacle-ember-glow-radius-resting:    8px                         (line 222)
  --spectacle-ember-glow-radius-flash:      20px                        (line 223)
  --spectacle-ember-flash-duration:         600ms                       (line 224)
  --spectacle-ember-drift-streaming:        0.7                         (line 225)
  --spectacle-ember-drift-assembling:       0.4                         (line 226)
  --spectacle-ember-drift-settling:         0.05                        (line 227)
  --spectacle-ember-converge-duration:      300ms                       (line 228)

Resolve Mode (A11):
  --spectacle-resolve-clip-start:           circle(36% at 50% 50%)      (line 231)
  --spectacle-resolve-transform-duration:   500ms                       (line 232)
  --spectacle-resolve-transform-delay:      300ms                       (line 233)

Crystallization Tone (A11):
  --spectacle-tone-freq-warm:               196  (G3 Hz)                (line 236)
  --spectacle-tone-freq-cool:               247  (B3 Hz)                (line 237)
  --spectacle-tone-volume:                  0.4                         (line 238)
  --spectacle-tone-attack:                  200ms                       (line 239)
  --spectacle-tone-sustain:                 600ms                       (line 240)
  --spectacle-tone-release:                 700ms                       (line 241)

Haptic (A11):
  --spectacle-haptic-duration:              15  (ms)                    (line 244)

Afterglow (A11):
  --spectacle-afterglow-bg-opacity:         0.03                        (line 247)
  --spectacle-afterglow-duration:           3s                          (line 248)

Shadow Settle (A11):
  --spectacle-shadow-settle-duration:       800ms                       (line 251)
  --spectacle-shadow-settle-dip:            0.95                        (line 252)

Tailwind 4 integration (lines 257–262):
  --color-background:   var(--bg-page)                                   (line 258)
  --color-foreground:   var(--color-text-primary)                        (line 259)
  --font-sans:          var(--font-body)                                 (line 260)
  --font-mono:          var(--font-mono)                                 (line 261)

---

## EXTERNAL API SURFACE

ANTHROPIC / CLAUDE
  Client: C:\Users\amyog\Desktop\wizkoo-plan-generator\src\lib\ai\client.ts
    Lazy singleton. Model pinned: claude-sonnet-4-20250514 (main generation).
    claude-haiku-4-5-20251001 used in safety.ts for contextual safety check.
  Plan generation: src\lib\ai\compose-prompt.ts → tool use via generate_weekly_plan
  Orbit reports: src\lib\ai\orbit.ts → structured JSON narrative generation
  Safety classifier: src\lib\ai\safety.ts → 6-category rubric via Haiku

SUPABASE (Database)
  Marketing site: window globals in js/supabase-config.js (anon key, public)
    Used for: library book queries, reading progress data
  Plan generator: @supabase/supabase-js via NEXT_PUBLIC_SUPABASE_* (anon) +
    DATABASE_URL + DIRECT_URL (server-side Drizzle ORM queries)
    Used for: user plans, family profiles, learning objectives, orbit reports
  Schema: drizzle/ directory (migration files)

CLERK (Authentication)
  Package: @clerk/nextjs
  Used in: middleware.ts (route protection), server components (currentUser()),
    API routes (auth()), webhooks (CLERK_WEBHOOK_SECRET validation via svix)
  Webhook handler: syncs Clerk user events (created, updated, deleted)
    to Supabase user table via auth-reconciliation cron

STRIPE (Payments)
  Package: stripe (server-side), NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (client)
  Used for: subscription creation, webhook handling (payment events),
    subscription status checks in plan-lifecycle cron
  Webhook handler: validates STRIPE_WEBHOOK_SECRET, processes subscription
    lifecycle events (created, updated, canceled)

RESEND (Email)
  Package: resend
  Used for: orbit report delivery, re-engagement emails, transactional emails
  Called from: orbit-report cron, re-engagement cron

SENTRY (Error Tracking)
  Package: @sentry/nextjs
  Configs: sentry.client.config.ts, sentry.server.config.ts (repo root)
  SENTRY_DSN required at build time and runtime

POSTHOG (Analytics)
  Packages: posthog-js (client), posthog-node (server)
  Used for: product analytics, feature flag reads, session recording

UPSTASH REDIS (Rate Limiting)
  Packages: @upstash/redis, @upstash/ratelimit
  Used for: API route rate limiting (plan generation endpoint)
  Protects: /plan/api/generate from abuse

---

## PROMPT TEMPLATE SYSTEM

Source directory: C:\Users\amyog\Desktop\wizkoo-plan-generator\src\lib\ai\

ASSEMBLY — compose-prompt.ts
  Assembles three message components for Claude tool use:
    Static system prompt: t-system + t-safety + t-negative + t-schema
                          + t-quality + t-progress (age-filtered objectives)
    Dynamic section: filtered learning objectives for children's age range
    User message: t-profile + t-theme + t-history + weekly volume

  Primary model: claude-sonnet-4-20250514
  Tool use: generate_weekly_plan (defined in tool-schema.ts)
  Output schema validated before delivery (Gate 2 — schema check)
  Safety validated after schema (Gate 3 — safety.ts)

TEMPLATES (src\lib\ai\templates\ — 9 files)
  t-system.txt   — Core role: Orbital Learning methodology, parent-facing tone,
                   three personalization tiers (new/returning/veteran)
  t-safety.txt   — Physical/developmental/content/materials safety rules by
                   age range. Non-negotiable constraints for all activities.
  t-negative.txt — Anti-patterns: generic activities, filler, jargon,
                   passive screen activities. What Claude must not produce.
  t-schema.txt   — Tool schema guidance: plan_header, clusters, blocks.
                   Describes required output structure.
  t-quality.txt  — 8 required block components, prescriptiveness gradient
                   (activities get more specific as children get older)
  t-progress.txt — Dynamic injection point: age-filtered learning objectives
                   from the Orbital Learning curriculum framework
  t-profile.txt  — Family-specific injection: children names/ages, parent
                   preferences, household notes
  t-theme.txt    — Theme of the week + any prior theme history.
                   Contains SECURITY NOTICE for prompt injection prevention.
  t-history.txt  — Spiral learning rules: revisit windows, topic rotation,
                   no-regeneration rule (identical theme cannot repeat <6 weeks)

TOOL SCHEMA — tool-schema.ts
  Defines generate_weekly_plan tool for Claude tool use.
  Output shape:
    plan_header: { family_name, week_of, theme, theme_rationale, week_summary }
    clusters: [ { cluster_id, day, subject_area, blocks: [...] } ]
    block fields: block_id, type, learning_objective_id, duration, activity,
                  differentiation, subject_tag, game_integration, is_tell_someone,
                  spiral_reference, preference_adaptations, materials
    governance: { safety_attestation, age_appropriateness_check, materials_check }

ORBIT REPORT — orbit.ts
  Separate generation flow (not compose-prompt.ts).
  Model: claude-sonnet-4-20250514 (max_tokens: 1500)
  Output: JSON with narrative (400-600 words), headline, vocabularyHighlights,
          completionSummary
  Called by: orbit-report cron job (Sundays 6am UTC)

SAFETY — safety.ts
  Two-pass gate. Runs after schema validation.
  Pass 1: Keyword scan (safety-keywords.json, <1ms, no API call)
           Tight keyword list. Fails on exact match. Zero false negatives.
  Pass 2: Haiku contextual classifier (~$0.001, ~200ms)
           6-category rubric. Only runs if Pass 1 clears.
           Fails OPEN on Haiku error (returns pass:true to prevent
           availability risk from a false safety rejection)
  Model: claude-haiku-4-5-20251001

UPGRADE PROTOCOL — UPGRADE_PROTOCOL.md (in src\lib\ai\)
  Documents how to safely update prompts, models, and schemas.
  Read before modifying any file in src\lib\ai\.

---

═══════════════════════════════════════
LAYER 8 — HISTORY
A record of what changed and when. Read when you need to understand
what version of the document you are working with.
═══════════════════════════════════════

## VERSION HISTORY

v1.0 — April 17, 2026
  Initial runbook created from Light Standard, session decisions,
  and design system values.

v1.1 — April 17, 2026
  Gap-filling session 1: file maps, token registry, known bugs added,
  footer fourth layer corrected (saffron sun bleed layer was missing),
  star field implementation documented.

v1.2 — April 17, 2026
  Gap-filling session 2: all six known bugs expanded to cold-start
  standard (file path, line number, root cause, fix spec, verification
  steps for each).

v1.3 — April 17, 2026
  Elite runbook session: build session close protocol, git protocol,
  known Claude Code failure patterns, environment variables,
  dependency inventory, deployment protocol, external API surface,
  prompt template system, nav deliberate hold added.

v1.4 — April 17, 2026 — v24 snapshot file removed from repo root.

v1.5 — April 17, 2026 — Full document restructure. Content unchanged.
  Reorganized into 8 labeled layers with table of contents for AI
  and developer readability.

v1.6 — April 17, 2026
  Document renamed to Technical Runbook.
  Header updated with single-line session trigger.
  Session Startup Instruction updated with Transfer Queue
  check (Notion page 345335a8d33281ea9f86e19c5018624a).
  System now fully wired: one line starts every session.

v1.7 — April 17, 2026
  Document renamed to Technical Runbook — WIZKOO.
  Single-line session trigger added to header.
  Session Startup Instruction: autonomous Transfer Queue
  check via Notion tool (Step 2), git status check (Step 3).
  Build Session Close Protocol expanded to 10 steps:
  trigger language, two-direction decision write-back,
  failure pattern sweep, autonomous flight log write to
  ATC Flight Log (b132ce969d3041348b4b7b6a6082cb99),
  version log. Minimum viable close updated to
  Steps 3, 6, 7, 8, 9, 10.

v1.8 — April 17, 2026 — Six corrections applied:
  hardcoded flight log date made dynamic, README.md added
  to both file maps, Games status corrected (nav loads
  correctly), CLAUDE.md reference resolved, close protocol
  Step 10 updated to include Maintenance Rule date update.

v1.9 — April 17, 2026 — Session close. Pattern 7 added to
  Layer 6 (hardcoded temporal values in procedural
  instructions). No code files touched this session.

v2.0 — April 17, 2026 — File renamed from WIZKOO_REFERENCES.md
  to TECHNICAL_RUNBOOK.md. All internal references and
  README pointers updated.

v2.1 — April 19, 2026
  Hero editorial pass + moderation hardening session.
  Fix A: left column padding-top 305px for zero-diff baseline
  alignment. Fix B: desk note 50% width, single centered tape
  piece. Time masthead, kicker, kicker rule removed from hero
  left column. suicide/murder/weed moved to BLOCKLIST_EXACT in
  both client (index.html) and server (validate-theme.js).
  Pattern 8 added (client/server list divergence). Locked
  decisions updated with masthead removal, desk spec, blocklist
  architecture, and Resend as digest email provider.

v2.1 — April 19, 2026 — Claude Code Operating Principles added to
  Layer 1 (six principles, session-start instruction, governance rules).
  Session Startup Step 1 updated from three-item to four-item confirmation
  (item 4: name all six Operating Principles before work begins).
  Notion mirror updated in same session. Transfer Queue cleared.

v2.2 — April 20, 2026
  Hero CTA + wax seal + headline session.
  Fix A: L-bracket CTA pale-yellow resolved — `.cta-needs-ready` now uses
    `color` gating (not opacity) in css/components.css; box-shadow stays
    full saffron in all states.
  Fix B: CTA typography set to Sora 600 0.68rem 0.06em (matching Open Seat
    page). Padding 10px 24px.
  Fix C: Wax seal rebuilt as inline SVG — organic blob path, 3-layer W
    monogram (shadow/base/highlight), grain texture, gloss, double ring.
    Replaces prior div+span implementation.
  Fix D: "homeschool plans." font reduced 216px → 192px across all
    breakpoints.
  Locked decisions updated: cta-needs-ready color gate, wax seal spec,
    headline line 2 size, CTA typography.
  Form audit (read-only) completed. No code changes from audit.

v2.8 — April 21, 2026
  Layer 3 Responsive Strategy Audit: RESPONSIVE_AUDIT_REPORT.md produced
  (5 conflicts, 4 coverage gaps). All 5 conflicts resolved mechanically:
  Conflict 1: index.html 767px → 768px (.hz1 padding). Conflict 2:
  index.html 1023px → 1024px (hero headline type tier). Conflict 3:
  index.html JS comparator < 768 → <= 768 (CTA firefly guard). Conflict 4:
  hover query AND → OR across 8 locations in 6 files. Conflict 5:
  nav.js:258 comment documenting 1100px as nav-internal breakpoint.
  Hover centralization into base.css deferred → OPEN ITEM 7.
  3 commits pushed: 391090f (Pass 1), d23562d (Pass 2), 2087f59 (annotation).

v2.6 — April 21, 2026
  Dead CSS audit execution (HIGH-confidence findings only):
  Deleted 4 orphaned CSS files: css/homepage.css (~21.2 KB),
    css/planner.css (~17.8 KB), css/nav.css (~6.8 KB),
    css/animations.css (~2.3 KB). Combined ~48 KB removed.
  Removed 5 unused tokens from css/tokens.css (67 → 62 lines):
    --elem-alkali, --prog-reading, --prog-handson, --prog-mystery,
    --duration-fast.
  Removed 6 dead selector blocks from css/library.css
    (1250 → 1146 lines): .abc-tagline-placeholder, .lib-chips group
    (6 selectors), .lib-theme-label/.lib-theme-pdf-btn group,
    .lib-band-header group, .book-card-hook.
  Removed 19 dead inline style blocks from index.html plus 4
    surgical media query edits (3216 → 3030 lines). Key removals:
    .hero-cascade/.hcard* group, .id-tags-* group,
    .thread-section group, .arrival group, .hz3 group,
    .open-seat-zone group, and all responsive overrides for these.
  Removed 3 dead JS null-guards from index.html.
  Preserved: getOSDotPos() null-guard (still called by live
    firefly animation — element absent from DOM but function
    required for coordinate fallback).
  Deferred: .lib-active-filters duplicate (Category 4 Finding 4.1)
    by Amy's explicit decision. Logged in OPEN ITEMS item 4.
  New failure pattern documented: Pattern 10 — Responsive Override
    Miss (responsive overrides for dead selectors not caught by
    top-level-only audit pass).
  CRITICAL FILE MAP and CSS CUSTOM PROPERTIES sections updated
    to reflect deleted files and removed tokens.

v2.5 — April 21, 2026
  Periodic Code Hygiene Protocol added to Layer 1 (four-layer taxonomy:
  dead code, token consolidation, responsive audit, full refactor;
  triggers for each; optimization distinction; 5 pre-written prompts
  following the six-section Prompt Construction Discipline standard).
  Preservation Locks Registry added to Layer 6 as a new section with
  Homepage Form subsection covering 19 locked items. Registry designed
  to expand as additional surfaces harden.

v2.4 — April 21, 2026
  Notion mirror sync enforcement added: Layer 0 Hierarchy Rule
  disambiguated (Technical Runbook authority separated from Light
  Standard authority); Layer 1 Step 2 extended with mirror sync
  requirement and 9 child page IDs; Close Protocol Step 6 extended
  with MANDATORY MIRROR SYNC paragraph; Verification Gate ledger
  extended with NOTION MIRROR SYNCED line. Closes the drift gap
  between local TECHNICAL_RUNBOOK.md and Notion mirror.

v2.3 — April 21, 2026
  Three Transfer Queue items applied:
  (1) Environment Variables section updated: Marketing Site now
    documents 7 Netlify Function env vars (OPENAI_API_KEY,
    NOTION_API_KEY, NOTION_MODERATION_DB_ID, IP_HASH_SALT,
    RESEND_API_KEY, RESEND_FROM_EMAIL, ADMIN_EMAIL) with source
    commits 857b057 and b042e35.
  (2) Content Moderation Architecture section added to Layer 3:
    three-layer architecture documented (client blocklist /
    server blocklist / OpenAI Moderation API), dual-tier
    BLOCKLIST vs BLOCKLIST_EXACT structure, fail-closed posture,
    rejection logging, weekly digest, affected files.
  (3) Prompt Construction Discipline subsection added to Layer 1
    (after Operating Principles, before Layer 2): six-section
    prompt standard (TASK, SCOPE, RECONCILIATION AUTHORIZED,
    PRESERVATION LOCKS, REPORTING, VERIFICATION), Return Rule,
    and Minimum Viable Prompt pattern. Layer 0 Last updated
    date updated to April 21, 2026.

v2.7 — April 21, 2026
  Token consolidation pass (Layer 2 — PROMPT 3). 53 hardcoded
  values replaced with var(--token) references across 16 files:
  css/base.css (2), css/components.css (4), css/games.css (2),
  css/library.css (17), 11 HTML pages (21), components/nav.js (7).
  Tokens used: --saffron, --ink, --linen, --paper, --ease-out-expo,
  --expo. 1 approved replacement skipped (components.css line 48
  rgba keyframe interpolation — see OPEN ITEM 5). 3 replacements
  deferred per Option A (components.css lines 24/25/26 easing —
  see LOCKED DECISIONS). Structural finding: 8 pages with inline
  :root instead of tokens.css link (see OPEN ITEM 6). Commit cce9476.
  OPEN ITEMS 5 and 6 added. LOCKED DECISIONS updated with
  components.css easing decision.
