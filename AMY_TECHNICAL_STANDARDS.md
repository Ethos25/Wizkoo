# ⚠️ SCOPE GUARD — READ FIRST

**Scope:** Global engineering standards. Project-agnostic. Inherited by every project Technical Runbook.

**Do NOT add project-specific content to this document.** If unsure whether content is global or project-specific, default to project-specific — it goes in the project runbook, not here.

**Promotion rule:** Content earns global status by being used identically across two or more projects. One project = anecdote. Two projects = pattern.

---

# AMY TECHNICAL STANDARDS

Personal technical standards. Project-agnostic. Referenced by individual project runbooks.

Extracted from TECHNICAL_RUNBOOK.md (Wizkoo) — April 2026.
Apply to every project. Add project-specific content to the project runbook, not here.

---

## TABLE OF CONTENTS

1. Session Mechanics — Startup, Close, Git Protocol
2. Quality Standards — Completion Standard, Operating Principles (1–7)
3. Prompt Engineering — Six-Section Prompt Standard
4. Code Hygiene — Four-Layer Framework, Triggers, Template Prompts
5. Viewport & Responsive Engineering — Five-Viewport Requirement, Coupling Rules
6. Claude Code Failure Patterns (Project-Agnostic)
7. Accessibility Minimums
8. Performance Targets

---

═══════════════════════════════════════
SECTION 1 — SESSION MECHANICS
Execute every session. Every project. No exceptions.
═══════════════════════════════════════

## SESSION STARTUP

Execute all steps before touching any file.

STEP 1 — CONFIRM YOU READ THE PROJECT RUNBOOK
State out loud:
  1. Both local codebase paths (or single path if single repo)
  2. The canonical accent color hex value for this project
  3. The environment assigned to the page you will work on today
  4. Confirm all seven Operating Principles are active by naming each one
Do not begin work until all items are confirmed. Stating the principles
is not optional — it confirms they are active for the session.

STEP 2 — CHECK THE BACKLOG
Every project maintains a mechanism for pending decisions or deferred items.
Check it before any work begins. Apply any pending items to the runbook.
If the backlog is clear, state: "Backlog clear. Proceeding."
Do not skip this step. A decision deposited by a prior session not applied
before work begins will be overwritten or ignored by this session's changes.
Project-specific backlog mechanism is defined in the project runbook.

STEP 3 — GIT STATUS CHECK
Run: git status
Run: git log --oneline -3
Report findings before touching any file.
If uncommitted changes exist from a prior session:
  "WARNING: [X] uncommitted files from prior session.
  Files: [list]. Commit, review, or discard?"
Do not begin new work until the owner responds.

STEP 4 — BEGIN WORK
State what the session will accomplish. Then proceed.

---

## BUILD SESSION CLOSE PROTOCOL

Mandatory. Every session. Non-negotiable.

TRIGGER LANGUAGE — initiate without being asked when the owner says any of:
  "wrap it up" / "close it out" / "let's close"
  "I'm done" / "that's it" / "stepping away"
  "write the baton" / "pass it off"
  OR when the primary deliverable is complete and context is getting heavy.
Do not wait to be asked. When the signal fires, run the protocol immediately.

STEP 1 — DELIVERABLE CHECK
Is the primary task complete per the Completion Standard?
Built. Migrated. Verified. Old version removed. System in clean unambiguous state.
If any step is incomplete, name it explicitly.
Never present partial completion as done.

STEP 2 — OPEN ITEMS SWEEP
What was started but not finished this session?
What was discovered that needs a follow-up session?
What was deferred and why?
Each item goes into the project runbook. Not noted in chat. Written to file.

STEP 3 — DECISION WRITE-BACK
Every decision made this session that affects the codebase gets written to
LOCKED DECISIONS in the project runbook before closing.
If it reverses a prior locked decision, remove the old entry and note why.
A decision that exists only in the chat transcript does not exist.
It will be relitigated next session.

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
If yes: add it to Known Claude Code Failure Patterns in the project runbook.
Name it. Describe it. State the prevention rule.
If nothing new: state "No new failure patterns this session."
The system learns from its failures only if they are documented before closing.

STEP 6 — RUNBOOK UPDATE
Update the project runbook with everything that changed:
  New files: add to file map with path and purpose.
  Changed tokens: update design token section.
  Resolved bugs: mark resolved with fix summary and location.
  New bugs: add with file, line, root cause, fix spec.
  New failure patterns: add with name, description, prevention rule.
Copy updated runbook to all codebase folders it must live in.

STEP 7 — VERIFICATION GATE
Produce this ledger before closing:

  BUILD SESSION WRITE-BACK VERIFICATION
  ✓ UPDATED: [what] → [runbook filename] ([X] lines)
  ✓ COPIED TO: [path 1] / [path 2] (if multiple repos)
  ✓ FAILURE PATTERNS: [captured OR "none this session"]
  ✗ NOT DONE: [item] → [deferred reason — owner decision or technical blocker only]

  Project-specific additions to this ledger are defined in the project runbook.
  Line counts must match across all copies. If they differ, the copy failed. Redo it.
  Identifying the work IS the instruction to do the work.
  "Recommend updating" is not a valid close.

STEP 8 — GIT CLOSE
Run: git status
Stage all changes including runbook updates.
Commit with a descriptive message:
  "YYYY-MM-DD — [what was built/fixed/changed]"
  Specific enough that reading git log tomorrow tells you exactly what this session did.
Run: git push
Confirm: "Committed and pushed. Remote is current."

STEP 9 — PRODUCTIVITY LOG
Write a brief entry to the project's productivity record.
Format is defined per project. Keep it scannable. Ten lines maximum.
This is a morning read, not a technical log.

STEP 10 — VERSION LOG
Add one line to the project runbook's version history:
  v[next] — [date] — [one sentence: what this session did]
Also update the "Last updated" date at the top of the project runbook.

MINIMUM VIABLE CLOSE:
Steps 3, 6, 7, 8, 9, and 10. Never less than that.
If owner says "just close it" push back once:
  "Minimum close is Steps 3, 6, 7, 8, 9, and 10. Under five minutes. Proceeding now."

---

## GIT PROTOCOL — EVERY SESSION

SESSION OPEN (before any work begins):
Run: git status
Run: git log --oneline -5
Report findings before touching any file.
If uncommitted changes exist from a prior session:
  State: "WARNING: Uncommitted changes exist from a prior session.
  Affected files: [list]. Commit, review, or discard before proceeding?"
Do not begin new work until the owner responds.

SESSION CLOSE (final step, after all other close steps):
Run: git status
Commit all changes with a descriptive message.
Commit message format: "YYYY-MM-DD — [what was built/fixed/changed]"
Run: git push
Confirm: "Committed and pushed. Remote is current."
If push is deferred by the owner, state explicitly:
  "[X] commits staged locally. Remote is behind. Push required before next deploy."

COMMIT MESSAGE STANDARD:
Specific enough that reading git log tomorrow tells you exactly what changed.
Never: "fix" "updates" "changes" "wip"
Always: what changed, where, and why in one sentence.

RULES:
Never close a session with uncommitted work without explicitly flagging it first.
Never build on top of uncommitted work from a prior session without surfacing it.

---

═══════════════════════════════════════
SECTION 2 — QUALITY STANDARDS
Apply to every task on every project.
═══════════════════════════════════════

## THE COMPLETION STANDARD

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

THE TEST: If someone opens this codebase tomorrow with no verbal briefing,
will they find one clean consistent state? Or artifacts, duplicates,
and half-finished work that requires explanation?
If it requires explanation, it is not done.

CLAUDE CODE APPLICATION:
Before presenting any task as complete, walk the chain:
Did I build it, migrate it, verify it, remove the old version,
and confirm the system is consistent?

If any step is incomplete, name it explicitly:
  "I have completed steps 1–3. Steps 4–5 remain: the old CSS rule
  needs to be removed and the specificity conflict needs to be verified.
  Want me to do that now?"

Never present 60% of a task as 100% of a task.
Never leave an old rule in place when a new one has been added.
Never add a new CSS rule when the winning rule should be changed at source.

---

## THE PAID-TIER TEST

Every shipped artifact must clear a named quality bar. The bar is phrased as a question: "Would I pay for this?" Each project defines its own price point based on what it costs the user — in money, trust, or time. If the answer is "it's fine but not worth paying for," the artifact is not ready. Wizkoo uses $200 as its named figure. Name the figure in each project's runbook before applying this test.

---

## CLAUDE CODE OPERATING PRINCIPLES

Non-negotiable rules that govern every Claude Code session on every project.

CONTEXT:
These principles exist because accumulated technical debt from
additive-without-reconciliation changes compounds into unrecoverable states
requiring full resets. Born from a session where five consecutive tweak prompts
layered conflicting CSS rules without reconciling them, producing a broken state
requiring a full reset. The correction revealed the underlying principle:
Claude Code's default is additive, not reconciliative. Reconciliation must be
made explicit.

THE STANDARD:
Every Claude Code session operates under the seven principles below.
Non-negotiable. Apply equally at session start, mid-session, and in final deploy.
"Fast but accumulates debt" is not permitted.

PRINCIPLE 1 — PRE-FLIGHT AUDIT
Before executing any visual or structural change, report the current state of
the affected element: its CSS rules, HTML structure, JavaScript bindings.
Confirm understanding before touching code.
This is not optional commentary. It is a verification checkpoint. If the
pre-flight audit reveals conflicts or ambiguities the prompt did not address,
stop and report. Do not proceed on assumptions.

PRINCIPLE 2 — CLEAN STATE REQUIREMENT
Every change leaves the affected system in a known-clean state. New rules
replace old rules. Old rules are removed. No orphaned CSS, no dead variables,
no commented-out code left as "just in case." If the change supersedes prior
work, the prior work is deleted, not left dormant.
The test: if someone else opens this codebase tomorrow with no verbal briefing,
will they find one clean, consistent state? Or artifacts and half-finished work?

PRINCIPLE 3 — REPORT SUPERSEDED RULES
As part of any change, list the specific CSS rules, HTML elements, or JavaScript
that will be removed or modified. This list is part of the pre-flight audit and
part of the execution report. It is not optional.
Purpose: the owner can catch an unintended supersession before execution.
If skipped, unintended deletions are discovered only after deployment.

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
underlying rule cannot be modified. Never to resolve an internal specificity
conflict within project code.

PRINCIPLE 6 — ONE SOURCE OF TRUTH PER COMPONENT
Each visual element has one governing CSS rule set. Each HTML component has
one governing template. Each JavaScript behavior has one governing function.
When rules, templates, or behaviors are distributed across multiple files or
scopes, consolidate during the change. If consolidation is out of scope for the
current change, flag it and propose a separate cleanup pass. Do not add to a
distributed mess.

PRINCIPLE 7 — VIEWPORT VERIFICATION REQUIREMENT
Any visual change to a page with a viewport-height-locked section must include
verification at the five target viewports defined in Section 5 of this document
before signoff. Verification belongs in the VERIFICATION section of the
six-section prompt standard. Not optional on visual changes.

SESSION-START INSTRUCTION (verbatim, every session):
  "This session operates under Claude Code Operating Principles
   (see project technical runbook). Apply all seven principles to every
   change in this session. Pre-flight audit before every non-trivial
   change. Report superseded rules as part of every change. If three
   consecutive tweaks fail, request a reset."

WHY THESE PRINCIPLES EXIST:
Claude Code's default behavior, given a change request, is to find the
smallest delta that produces the requested change. "Smallest delta" often means:
add a new rule with higher specificity, leave the old rule in place, move on.
This default is not wrong in isolation. It is catastrophically wrong at scale.
Across a multi-prompt session, accumulated orphaned rules produce a codebase
where every change fights invisible competing rules from earlier changes.
The principles make reconciliation explicit. They do not slow the work.
They prevent the compounding failure that is slower than the work itself.

GOVERNANCE:
  Additions require the owner's explicit decision.
  Removals are not permitted without explicit decision.
  Applies to every Claude Code session on every project.

---

═══════════════════════════════════════
SECTION 3 — PROMPT ENGINEERING
Apply to every prompt sent to Claude Code.
═══════════════════════════════════════

## WHY THIS SECTION EXISTS

Claude Code's default behavior is additive. Given a request to fix X, it produces
the smallest delta that makes X work — usually by adding a new rule on top of
existing rules, leaving superseded rules in place. Across a multi-prompt session,
these leftover rules accumulate into competing logic that every future change
must navigate around. The compound effect is a codebase where prompts get harder
to land because the noise drowns out the signal.

The most common operator mistake: "do not touch anything else." That instruction
forbids reconciliation. It protects against unwanted structural changes, but also
prevents the executor from cleaning up what its own change replaces.

The fix: distinguish scope (what may be changed) from reconciliation (what cleanup
is authorized within scope). Every prompt must name both, explicitly and separately.

---

## THE SIX-SECTION PROMPT STANDARD

Every prompt sent to Claude Code must contain all six sections, in this order,
with the section headers written as stated. If any section is missing, the prompt
is not ready. Return it to the drafter before sending.

  1. TASK
  2. SCOPE
  3. RECONCILIATION AUTHORIZED
  4. PRESERVATION LOCKS
  5. REPORTING
  6. VERIFICATION

---

### SECTION 1 — TASK

  Purpose: give Claude Code a verifiable goal.
  Contents: what needs to happen, stated as a concrete outcome, not a process.

  Good: "Fix the announcement bar text color so it reads on all non-homepage pages."
  Not good: "Help me figure out what is wrong with the announcement bar."

  A task without a concrete outcome cannot be declared done.

### SECTION 2 — SCOPE

  Purpose: draw the boundary. Prevent Claude Code from touching code it was not
    invited to touch.
  Contents: which files, components, or surfaces may be changed, named explicitly.
    Out-of-scope items named explicitly as well.

  Good: "In scope: components/nav.js lines 80–100. Out of scope: all other files."
  Not good: "Just fix the nav."

### SECTION 3 — RECONCILIATION AUTHORIZED

  Purpose: separate narrow protection from additive-only execution.
    Scope says what Claude Code MAY touch. This section says what it SHOULD clean up.
  Contents: what cleanup is explicitly permitted within scope — removal of superseded
    rules, deletion of dead code, consolidation of duplicates. Also what cleanup
    is NOT authorized (restructuring, renaming, refactoring).

  Not good: silence. If missing, Claude Code defaults to additive-only —
    the failure mode this section exists to prevent.

### SECTION 4 — PRESERVATION LOCKS

  Purpose: name fragile systems explicitly so Claude Code cannot accidentally
    break them, even within authorized scope.
  Contents: what must not change, even if the executor believes a change would
    improve things. Reference the project's Preservation Locks Registry where
    one exists.

  Not good: "Do not break anything." Vague preservation instructions are not enforceable.

### SECTION 5 — REPORTING

  Purpose: prevent silent changes. Every modification must be nameable.

  Two kinds:
    Pre-execution: "Before making any change, list every file you will modify
      and the specific change per file. Wait for approval."
    Post-execution: "After completing, produce a ledger of files changed,
      selectors removed, lines affected, and any finding from the audit
      you chose not to execute."

### SECTION 6 — VERIFICATION

  Purpose: establish the gate between "change applied" and "change shipped."

  Typical steps:
    Run git status and git diff --stat before committing.
    Confirm no file outside the named scope was modified.
    Open relevant pages in the dev server. Confirm no console errors or
      visual regressions.
    Run the build if one exists.
    Commit with a descriptive message.
    Do not push without explicit approval from the owner.

### DISTINGUISHING REPORTING FROM VERIFICATION

  REPORTING answers:    "What did you change?"
  VERIFICATION answers: "Did it work and is the system still sound?"

  Reporting is a narrative Claude Code writes about its own work.
  Verification is a test Claude Code or the owner runs against the result.

  A prompt can have thorough reporting and fail verification.
  Both sections must be present. They serve different functions.

### THE RETURN RULE

Any prompt missing one or more sections is not ready for execution.
Return it to the drafter for completion before sending.

This applies when:
  The owner drafts the prompt.
  A chat assistant drafts the prompt for the owner.
  A prior session's baton includes a prompt to re-send.

The executor enforces this on the receiving side: when a prompt arrives missing
sections, Claude Code must request clarification and list the missing sections by
name before executing.

### MINIMUM VIABLE PROMPT

For genuinely trivial changes (typo fixes, single-line comment corrections,
one-word copy edits with no structural impact):

  TASK: [what]
  SCOPE: [where — single file, single line]
  RECONCILIATION: none needed
  PRESERVATION: none at risk
  REPORTING: show the diff
  VERIFICATION: confirm no unintended matches in grep before committing

All six sections still named. Content compressed because the change is small.
Do not use this pattern for anything touching a component, system, or multiple files.

---

═══════════════════════════════════════
SECTION 4 — CODE HYGIENE
Periodic maintenance. Runs on trigger, not continuously.
═══════════════════════════════════════

## WHY THIS SECTION EXISTS

In-the-moment hygiene catches most accumulation. The Completion Standard enforces
old-thing removal at write time. Operating Principle 2 enforces clean state after
every change. These rules cover the 80% case.

The remaining 20% requires periodic passes. Orphaned rules slip in when a component
is rewritten and the old rule is not caught. Token drift accumulates over dozens of
files. Breakpoint systems get confused when multiple sessions touch responsive logic
without the full picture. These failures require a scheduled scan.

---

## THE FOUR LAYERS

Layer 1 — Dead code removal.
  Delete CSS selectors, JS functions, and HTML elements nothing references.
  Lowest risk. Removal is mechanical. Substantial debt accumulates here.

Layer 2 — Token consolidation.
  Find hardcoded values in component files and replace with var(--token-name)
  references to the design token registry. Low risk, compounding payoff —
  one-line updates later when tokens evolve.

Layer 3 — Responsive strategy audit.
  Examine breakpoints for coherence. Identify conflicts between width-based and
  height-based breakpoints. Decide whether to consolidate or formally document
  rules of engagement. Judgment-heavy. Not mechanical.

Layer 4 — Full refactor.
  Reorganize how code is structured without changing what it does. Biggest lift.
  Highest risk. Only runs when a specific new feature is blocked by current
  architecture. Never prophylactically.

---

## THE OPTIMIZATION DISTINCTION

Optimization is not hygiene. Hygiene is about correctness and maintainability.
Optimization is about performance. They are different disciplines with different
triggers, different risks, and different success criteria.

Hygiene triggers on accumulation. Optimization triggers on measured slow performance.
"Feels slow" is not an optimization trigger — instrumentation is.
Before optimizing, measure. If the measurement does not show a problem, do not optimize.

If Claude Code notices an optimization opportunity during a hygiene pass, flag it as
a separate task. Do not bundle performance changes into a hygiene commit.
The risks are different and mixing them makes regression diagnosis impossible.

---

## TRIGGERS

Layer 1 (Dead code removal) runs when:
- Before any major redesign that will touch existing surfaces.
- After locking a design direction (to clean up abandoned iterations).
- When prompts start taking longer to land than they used to (compounding debt signal).
- Every 50–100 build prompts as a default cadence.

Layer 2 (Token consolidation) runs when:
- All Layer 1 triggers above, typically paired with a Layer 1 pass.
- After any session that added or changed design tokens.

Layer 3 (Responsive strategy audit) runs when:
- Before major layout changes that will touch breakpoints.
- When rendering bugs appear at odd screen sizes and it is unclear which rule is winning.

Layer 4 (Full refactor) runs when:
- A specific new feature is blocked by current code architecture. The trigger is
  mechanical: "I tried to add X and it broke Y because of how the code is organized."
- Never prophylactically. Never because the code "feels messy."

---

## TEMPLATE PROMPTS

These follow the six-section Prompt Construction Discipline standard.
Fill in [project-specific file paths] before using.
Project runbooks may contain pre-filled versions using actual file paths.

---

TEMPLATE 1 — LAYER 1 DEAD CODE AUDIT (REPORT-ONLY)

TASK: Audit the codebase for dead CSS. Produce DEAD_CSS_AUDIT_REPORT.md at repo
  root. No modifications to any file.

SCOPE: In scope: [all CSS files, inline <style> blocks in HTML pages, CSS inside
  component files]. Out of scope: [list exclusions — third-party dirs, generated
  files, etc.].

RECONCILIATION AUTHORIZED: None. Report-only. Do not modify any file.

PRESERVATION LOCKS: All files. No modifications of any kind permitted in this pass.

REPORTING: Produce DEAD_CSS_AUDIT_REPORT.md with findings in four categories:
  orphaned selectors, unused custom properties, commented-out rule blocks, duplicate
  selectors. Each finding includes file path, line number, evidence (grep commands
  run and files searched), confidence level (HIGH/MEDIUM/LOW), recommendation
  (SAFE_TO_REMOVE / REVIEW_REQUIRED / KEEP_WITH_NOTE).

VERIFICATION: Confirm DEAD_CSS_AUDIT_REPORT.md was created at repo root. Confirm no
  other file was modified (git status shows only the new report). Stop. Do not
  execute any deletions. Owner reviews the report before any execution prompt runs.

---

TEMPLATE 2 — LAYER 1 DEAD CODE EXECUTION (AFTER AUDIT REVIEW)

TASK: Execute dead CSS cleanup based on DEAD_CSS_AUDIT_REPORT.md. Remove all
  HIGH-confidence findings in Categories 1 (orphaned selectors) and 2 (unused
  custom properties). Defer Category 4 (duplicates) unless explicitly approved
  per-finding.

SCOPE: [list files flagged for modification in the audit report].
  Out of scope: [exclusions].

RECONCILIATION AUTHORIZED: Remove all HIGH-confidence findings per the audit report.
  Remove responsive override rules in media queries if their main rule is being
  deleted in the same pass (dependency cleanup). Do NOT restructure surviving code.
  Do NOT rename any selector. Do NOT refactor file organization.

PRESERVATION LOCKS: [Reference the project's Preservation Locks Registry.
  List any surface that must not be touched.]

REPORTING: Before executing, list every file to modify or delete and the specific
  changes per file. Wait for approval. After executing, produce a ledger: files
  deleted with line counts, files modified with selectors removed and line deltas,
  total lines removed, any finding not executed with reason.

VERIFICATION: Run git status and git diff --stat. Confirm scope integrity. Open
  representative pages in dev server, confirm no console errors or visual regressions.
  Commit with descriptive message. Do NOT push — owner reviews before push.

---

TEMPLATE 3 — LAYER 2 TOKEN CONSOLIDATION

TASK: Find hardcoded color, spacing, and typography values in component files that
  should use existing CSS custom properties from [token source file]. Produce a
  consolidation report, then execute approved replacements.

SCOPE: In scope: [all CSS files except the token source, inline <style> blocks in
  HTML, CSS-in-JS in component files]. Out of scope: [exclusions — values
  intentionally unique to one component].

RECONCILIATION AUTHORIZED: Replace hardcoded values with var(--token-name) references
  where an exact match exists in the token source. Remove any token that becomes
  unused as a result. Do NOT invent new tokens. Do NOT rename existing tokens.
  If a hardcoded value has no matching token, report it but leave it.

PRESERVATION LOCKS: Do not touch [token source file] except to remove tokens that
  become unused. [Add any other project-specific locks.]

REPORTING: Before executing, produce a report: every hardcoded value found, file and
  line, which token it would map to, confidence the match is correct. Include hardcoded
  values with no token match, separately. Wait for approval. After executing: replacements
  made per file, tokens removed, values left hardcoded with reason.

VERIFICATION: Run git status. Confirm scope integrity. Open representative pages in dev
  server, confirm no visual regressions. Commit with descriptive message. Do NOT push.

---

TEMPLATE 4 — LAYER 3 RESPONSIVE STRATEGY AUDIT

TASK: Audit the codebase's breakpoint strategy. Document the current system, identify
  conflicts between width-based and height-based breakpoints, and recommend
  consolidation OR formalize rules of engagement. Produce RESPONSIVE_AUDIT_REPORT.md.
  Do not modify any file.

SCOPE: In scope: all @media queries in all CSS files and inline style blocks, any
  JS-driven viewport logic. Out of scope: [exclusions].

RECONCILIATION AUTHORIZED: None. Report-only.

PRESERVATION LOCKS: All files. Report-only.

REPORTING: Produce RESPONSIVE_AUDIT_REPORT.md with complete inventory of every
  breakpoint (file and line), analysis of overlap, analysis of coverage gaps,
  recommendation per conflict (consolidate / document intentional split / revise).

VERIFICATION: Confirm RESPONSIVE_AUDIT_REPORT.md was created at repo root. Confirm no
  other file was modified. Stop. Owner reviews and decides next action.

---

TEMPLATE 5 — LAYER 4 REFACTOR SCOPING (NOT EXECUTION)

TASK: A specific new feature is blocked by current code architecture. Assess whether
  a refactor is the right answer, what surface area it would touch, and what the risk
  profile is. Produce a scoping document. Do not execute any refactor.
  [Replace this line with the specific blocked feature context before running.]

SCOPE: In scope: analysis only, targeting the named blocked feature.
  Out of scope: all other refactor candidates, any execution.

RECONCILIATION AUTHORIZED: None. Scoping only.

PRESERVATION LOCKS: All files. No modifications.

REPORTING: Produce REFACTOR_SCOPING.md with: the blocked feature named explicitly;
  the current architecture blocking it; the minimum refactor scope that would unblock
  (not the ideal — the minimum); files and functions touched; risk profile; estimated
  effort; alternative approaches that would avoid the refactor entirely.

VERIFICATION: Confirm REFACTOR_SCOPING.md was created. Confirm no other file was
  modified. Stop. Owner reviews and decides.

---

═══════════════════════════════════════
SECTION 5 — VIEWPORT & RESPONSIVE ENGINEERING
Apply to any page with a viewport-height-locked section.
═══════════════════════════════════════

## WHY THIS SECTION EXISTS

Breakpoint values documented in CSS are not the same as the viewports real users
see. A codebase can have correct 768px and 1024px breakpoints and still fail in
production because the actual usable viewport of a real user's setup does not
match the theoretical width.

Most common source of mismatch: DPI scale. A 1440×900 laptop at 200% DPI renders
as if the viewport is 1280×540. Add a Chrome bookmarks bar and usable vertical
drops to ~500px. This is not an edge case — parents over 40 with standard eyesight
turn up DPI scaling by default. A significant share of the actual audience
experiences this compressed viewport.

---

## THE FIVE TARGET VIEWPORTS

Any visual change to a page with a viewport-height-locked section must be verified
at all five viewports before signoff. Not "designed for." Actually verified.

PRIMARY DESKTOP
  Dimensions: 1440×900 native resolution.
  DPI scale: 100%.
  Chrome bookmarks bar: absent.
  Role: baseline design target. Most screenshots and mockups are produced at
  this setting.

COMPRESSED DESKTOP
  Dimensions: 1440×900 at 200% DPI scale = 1280×540 usable viewport.
  Chrome bookmarks bar: present (standard Chrome default).
  Usable vertical after browser chrome + bookmarks bar: approximately 500px.
  Role: represents a major real user segment. NOT an edge case. Any critical
  UI (submit buttons, primary CTAs) must be visible or reachable at this setting.

MOBILE SMALL (iPhone SE equivalent)
  Dimensions: 375×667.
  Role: narrow mobile floor. Critical UI must be reachable within one scroll gesture.

MOBILE LARGE (iPhone 15 Pro Max equivalent)
  Dimensions: 430×932.
  Role: tall mobile ceiling. Content should not leave awkward empty space vertically.

OWNER PRODUCTION ENVIRONMENT
  Dimensions: document per project. Default: 1440×396.
  Context: typical at Windows 200% OS scaling + Chrome bookmarks bar + Chrome zoom.
  Role: the owner's actual working viewport. A section failing here is a real
  failure, not an edge case.
  NOTE: Update this viewport definition in the project runbook to match the actual
  setup of the person who will be reviewing every build.

---

## OVERFLOW + MIN-HEIGHT COUPLING RULE

THE RULE:
If a section declares overflow:hidden (or overflow:hidden!important) AND
min-height:100dvh (or 100vh, or 100svh) at any breakpoint, the section
MUST use min-height:calc(100dvh + 96px) instead.

Minimum buffer value: 96px.

WHY:
When overflow:hidden and min-height:100dvh co-exist, min-height stops acting as
a floor (minimum) and becomes a ceiling (maximum). The section is forced to be
exactly the viewport size — no more, no less.

At exact viewport size, the next section's first pixel lands on the current
section's terminal edge. Any rendering variance — font load timing, browser
rounding, webfont metrics — causes the next section to bleed into the current
viewport frame as a visible strip at the bottom.

The +96px buffer extends the section past the viewport fold by a structurally
guaranteed amount, eliminating the bleed regardless of content height or
rendering variance.

NON-COMPLIANT:
  .my-section {
    min-height: 100dvh;
    overflow: hidden;
  }

NON-COMPLIANT (media query version):
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

Choose Option A when the section must clip overflow for design reasons.
Choose Option B when natural content expansion is acceptable.

DIAGNOSTIC:
If a strip of the next section is visible at the bottom of a full-viewport section:
  Does this section have overflow:hidden paired with min-height:100dvh?
  If YES → this is the cause. Fix: change min-height to calc(100dvh + 96px).
  If NO → different issue. Diagnose separately.

---

## UNIVERSAL SECTION-HEIGHT RULE

Any section with a full-bleed photograph or full-viewport background MUST use
height:100vh at short-viewport breakpoints (e.g. max-height:700px and below).

NEVER use height:max(Nvh, fixed-px) where fixed-px can exceed the viewport.

WHY: A section taller than the viewport allows scroll-position drift. At a short
viewport, a 500px section in a 396px viewport means the user's scroll landing
position determines how much top padding is visible — any padding value appears
unreliable and "jumps" between refreshes. height:100vh is the only value that
makes padding-top consistent.

---

## UNIVERSAL NAV SAFE-ZONE RULE

Minimum padding-top at short-viewport breakpoints: 96px on the first content
element.

WHY: Combined nav + announcement bar reaches ~100px CSS at compressed production
display. Content with padding-top below 96px will appear behind or immediately
adjacent to the nav. 96px provides clearance across zoom ranges.

Standard at base desktop (no max-height limit): 172px, which reserves space for
the full nav + announcement bar stack plus buffer.

---

═══════════════════════════════════════
SECTION 6 — CLAUDE CODE FAILURE PATTERNS
Read before every session. Do not repeat them.
═══════════════════════════════════════

These are documented failure modes Claude Code has exhibited in production
codebases. Project-specific patterns belong in the project runbook.

PATTERN 1 — CACHE BLAME
When a visual fix does not land, Claude Code defaults to blaming browser cache.
If the problem persists in incognito, it is not cache. It is the wrong file or
the wrong rule. Require a source hunt before accepting any cache explanation.

PATTERN 2 — DESTINATION-BASED ANIMATION
Claude Code defaults to bezier-from-A-to-B animation for any movement task. This
produces mechanical, predictable motion. For organic movement (firefly, particles,
ambient elements), the architecture must be velocity-based with steering, not
destination-based. If you find yourself writing a bezier to a point, the
architecture is wrong.

PATTERN 3 — WRONG FILE EDITED
When a specificity conflict exists, Claude Code will sometimes edit a secondary
file instead of finding and changing the winning rule at source. Always run a full
specificity audit before making any CSS change. Find the winning rule. Change it
there. Do not add new rules on top of conflicting ones.

PATTERN 4 — PARTIAL COMPLETION PRESENTED AS DONE
Claude Code will sometimes complete steps 1–2 of a 5-step task and present the
result as finished. Apply the Completion Standard to every task: built, migrated,
verified, old version removed, system clean. If any step is missing, name it.

PATTERN 5 — HARDCODED VALUES INSTEAD OF TOKENS
Claude Code will hardcode values (colors, spacing, easing curves) directly in
components instead of consuming the CSS custom property. Every recurring value
should have a token definition. Use the variable. Never the raw value in a
component file. If you see a raw hardcoded value in a component, that is a bug.

PATTERN 6 — APPROXIMATED VALUES
When Claude Code cannot immediately find a source value, it will sometimes use a
close approximation instead of reading the source file. This is never acceptable.
If a value is in the runbook, use that exact value. If not, navigate to the source
file and read it. Never approximate.

PATTERN 7 — HARDCODED TEMPORAL VALUES IN PROCEDURAL INSTRUCTIONS
When writing procedural instructions (close protocol, startup sequence, log steps),
Claude Code will sometimes embed the current session's date directly into instruction
text — values that must stay dynamic.
Prevention rule: Any date, hash, or session-specific value inside a procedural
instruction must use a placeholder or formula, never a literal from the current session.
Correct: "today's actual date in YYYY-MM-DD format"
Wrong: "2026-04-17"
If you wrote a literal where a formula belongs, that is a bug. Correct it before closing.

PATTERN 8 — CLASS-NAME AUDIT MISSES VISUAL CONSTRUCTS
When an audit searches for a visual by class name (e.g. "find the L-bracket"), it
will miss constructs whose visual effect is produced through a mechanism whose CSS
class name does not match the visual's name — box-shadow tricks, pseudo-elements,
or positioned siblings named for semantic role, not appearance.
Prevention rule: If an audit returns "element does not exist" but the visual is
clearly present in the rendered page, the audit has failed. Re-scan using the
visual's mechanism as the search target — the color value, the property name, the
specific CSS rule. Never accept "not present" until a mechanism-based search
confirms absence.

PATTERN 9 — RESPONSIVE OVERRIDE MISS
When removing a dead top-level selector, the audit will miss corresponding responsive
overrides for that same selector defined inside @media query blocks lower in the
same file.
Prevention rule: After removing any top-level dead selector, immediately grep for
that selector name across all @media blocks in the same file before declaring the
removal complete. Any responsive override for a dead selector is also dead.
The audit is not complete until both the top-level rule and all responsive overrides
have been confirmed removed.

PATTERN 10 — SECTION HEIGHT OVERFLOW CAUSES PHANTOM PADDING DRIFT
When a full-bleed section is taller than the viewport (e.g. height:max(80vh,500px)
at a 396px viewport = 500px section), the user's scroll landing position determines
how much top padding is above the fold. This makes padding-top appear unreliable —
the same value produces different headline positions on different loads depending
on scroll velocity and browser snap. Claude Code's failure mode: increase padding-top
repeatedly without diagnosing root cause. Each change appears to work then regresses.
Prevention rule: Before tuning padding-top on a full-bleed section, verify the
section height equals 100vh at the active breakpoint. Fix section height first.
See the Universal Section-Height Rule in Section 5.

PATTERN 11 — PLAYWRIGHT / DEV-SERVER / LIVE-SITE VERIFICATION GAP
Playwright screenshots can report "changes visible, match target" while the real
browser shows a different state — pre-commit, partial, or cached. Root cause:
Playwright renders a clean headless environment with no browser cache, no CDN cache.
Prevention rule: Before declaring a visual commit "verified," run three-layer
verification: (1) Playwright screenshot at target viewport, (2) curl the served
file to confirm it matches the committed file byte-for-byte, (3) state explicitly
"Owner should hard-refresh and/or restart the dev server before visual review."
For post-push verification: "Owner should wait for CDN propagation before judging
the live site; TTL varies by provider." When the owner reports "my render doesn't
match your screenshot," default to diagnostic mode — compare served vs committed
file, then check build log, then check CDN — before iterating on new CSS.

PATTERN 12 — SPEC/IMPLEMENTATION NAMING DIVERGENCE
When a spec and the live codebase use different names for the same architectural
element, Claude Code will infer a content-based mapping and may place content in
the wrong location.
Prevention rule: When column names or section names conflict between a spec and the
current codebase, do not infer mapping. Ask explicitly: "The spec calls this X but
the current codebase labels it Y. Do you mean X or Y?" One clarifying question
costs 30 seconds. A wrong placement costs a second deploy.

---

═══════════════════════════════════════
SECTION 7 — ACCESSIBILITY MINIMUMS
Non-negotiable. Apply to every project.
═══════════════════════════════════════

prefers-reduced-motion: kills all particle effects and motion animations.
  Opacity-only transitions as the fallback. Never omit.
All interactive elements: keyboard equivalents required.
Dynamic state changes: aria-live regions required.
Contrast: text on all surfaces must pass WCAG AAA (7:1) at body text size.
Audio: any sudden-onset sounds must be suppressible via a preference setting.
Forms: all validation must be accessible — aria-invalid, aria-describedby
  on error, visually-hidden aria-live for announcements.

---

═══════════════════════════════════════
SECTION 8 — PERFORMANCE TARGETS
Non-negotiable. Set a target device per project.
═══════════════════════════════════════

Before optimizing, measure. "Feels slow" is not a trigger. Instrumentation is.
If measurement does not show a problem, do not optimize.

Animation loops: pause via IntersectionObserver when offscreen.
No CSS filter:blur() on simultaneously visible tiles (cost is non-linear at scale).
Particle/animation density: one orbiting particle per visible tile maximum.
Target device: name the lower bound of the intended audience in the project runbook.
  No project is exempt from naming this. The target device governs all performance
  decisions.

If Claude Code notices an optimization opportunity during feature or hygiene work,
flag it as a separate task. Do not bundle performance changes into other commits.
