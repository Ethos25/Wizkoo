# TECHNICAL_RUNBOOK.md — Extraction Report

**Source:** `TECHNICAL_RUNBOOK.md` (original, unmodified)
**Output files:**
- `AMY_TECHNICAL_STANDARDS.md` — project-agnostic technical standards
- `TECHNICAL_RUNBOOK.md` — Wizkoo-specific runbook (inherits from Standards)

**Bias applied:** Conservative. If a section is Wizkoo-specific in practice even if reusable in principle, it stayed Wizkoo-specific. Global classification required genuine project-agnosticism.

**Report version:** Final (post-review). Reflects decisions on Flags 2, 3, 4.

---

## Classification Table

| Original Section | Classification | Destination | Rationale |
|---|---|---|---|
| **LAYER 0 — Identity & Orientation** | | | |
| One-sentence summary of what Wizkoo is | WIZKOO | TECHNICAL_RUNBOOK.md L0 | Names specific product |
| Notion mirror IDs, page hierarchy | WIZKOO | TECHNICAL_RUNBOOK.md L0 | Wizkoo-specific Notion structure |
| Quality filter ("Someone who loves children made this") | WIZKOO | TECHNICAL_RUNBOOK.md L0 | Brand-specific quality language |
| Hierarchy rule (runbook → Standards) | META | TECHNICAL_RUNBOOK.md L0 header | New governance note added during split |
| Maintenance rule | WIZKOO | TECHNICAL_RUNBOOK.md L0 | Names the runbook itself |
| **LAYER 1 — Session Protocol** | | | |
| Session startup: pre-flight audit steps | GLOBAL | AMY_TECHNICAL_STANDARDS.md §1 | Same 5 steps apply to any project |
| Session startup: Transfer Queue pull (Notion page ID) | WIZKOO | TECHNICAL_RUNBOOK.md L1 | Specific to Wizkoo Transfer Queue page ID |
| Session startup: Notion mirror sync check | WIZKOO | TECHNICAL_RUNBOOK.md L1 | Wizkoo has 9 Notion child pages — project-specific |
| Session close: 10-step protocol (generic) | GLOBAL | AMY_TECHNICAL_STANDARDS.md §1 | Steps themselves are project-agnostic |
| Session close: ATC Flight Log write (DB ID, field names) | WIZKOO | TECHNICAL_RUNBOOK.md L1 | Specific Notion DB ID and schema |
| Session close: Transfer Queue push (Notion page ID) | WIZKOO | TECHNICAL_RUNBOOK.md L1 | Specific Notion page ID |
| Wizkoo verification gate (file paths) | WIZKOO | TECHNICAL_RUNBOOK.md L1 | Names css/, components/nav.js, /games/, plan-generator |
| Git protocol (commit message format) | GLOBAL | AMY_TECHNICAL_STANDARDS.md §1 | Not specific to Wizkoo |
| $200 Standard reference in session protocol | WIZKOO | TECHNICAL_RUNBOOK.md L1 | Cross-reference to Wizkoo design system |
| **LAYER 2 — Live State** | | | |
| Page status table (index, games, themes…) | WIZKOO | TECHNICAL_RUNBOOK.md L2 | Lists Wizkoo-specific pages |
| 7 Known Bugs (file paths, line numbers, fix specs) | WIZKOO | TECHNICAL_RUNBOOK.md L2 | All bugs name specific Wizkoo files |
| Nav hold notice | WIZKOO | TECHNICAL_RUNBOOK.md L2 | Wizkoo nav component hold |
| ~25 Locked Decisions | WIZKOO | TECHNICAL_RUNBOOK.md L2 | All reference Wizkoo design choices |
| **LAYER 3 — System Map** | | | |
| Two codebase locations (Windows paths) | WIZKOO | TECHNICAL_RUNBOOK.md L3 | Wizkoo-specific directory structure |
| Critical file maps (both repos) | WIZKOO | TECHNICAL_RUNBOOK.md L3 | Names Wizkoo-specific files |
| Environment variables (all repos) | WIZKOO | TECHNICAL_RUNBOOK.md L3 | Wizkoo API keys and Vercel/Netlify config |
| Content moderation 3-layer architecture | WIZKOO | TECHNICAL_RUNBOOK.md L3 | Specific to plan generator's validate-theme.js |
| BLOCKLIST / BLOCKLIST_EXACT dual-tier | WIZKOO | TECHNICAL_RUNBOOK.md L3 | Implementation in Wizkoo index.html |
| claude-sonnet-4-20250514 / claude-haiku-4-5-20251001 model IDs | WIZKOO | TECHNICAL_RUNBOOK.md L3 | Wizkoo plan generator API calls |
| Dependency inventory | WIZKOO | TECHNICAL_RUNBOOK.md L3 | Specific to Wizkoo packages |
| Deployment protocols (Netlify + Vercel) | WIZKOO | TECHNICAL_RUNBOOK.md L3 | Wizkoo-specific deployment targets |
| **LAYER 4 — Design System** | | | |
| Three Worlds (Linen, Night Sky, Day Sky) | WIZKOO | TECHNICAL_RUNBOOK.md L4 | Core Wizkoo brand concept |
| Environment map (surface definitions) | WIZKOO | TECHNICAL_RUNBOOK.md L4 | Wizkoo-specific UX metaphor |
| Color system (saffron #E8AF38, all tokens) | WIZKOO | TECHNICAL_RUNBOOK.md L4 | Wizkoo brand colors |
| Typography (Sora weights 200/300/700/800) | WIZKOO | TECHNICAL_RUNBOOK.md L4 | Wizkoo typeface choice |
| Motion identity | WIZKOO | TECHNICAL_RUNBOOK.md L4 | Wizkoo animation language |
| Nav system v4.1 | WIZKOO | TECHNICAL_RUNBOOK.md L4 | Wizkoo nav component versioning |
| Text hierarchy rules | WIZKOO | TECHNICAL_RUNBOOK.md L4 | References Sora specifically |
| $200 Standard (full content, linen/saffron metaphors) | WIZKOO | TECHNICAL_RUNBOOK.md L4 | Brand-specific quality language |
| Viewport Reality Constraints (756×396 derived constraints) | WIZKOO | TECHNICAL_RUNBOOK.md L4 | Wizkoo-specific breakpoints derived from viewport; hardware facts moved to Standards §5 |
| Cross-system consistency rules | WIZKOO | TECHNICAL_RUNBOOK.md L4 | References Night Sky / Linen specifics |
| **LAYER 5 — Component Specs** | | | |
| Generation Spectacle | WIZKOO | TECHNICAL_RUNBOOK.md L5 | Wizkoo-specific component |
| Firefly animation | WIZKOO | TECHNICAL_RUNBOOK.md L5 | Wizkoo-specific component |
| Homepage Hero locked state | WIZKOO | TECHNICAL_RUNBOOK.md L5 | Names specific Wizkoo homepage |
| Atlas Continent Palette | WIZKOO | TECHNICAL_RUNBOOK.md L5 | Wizkoo-specific visual component |
| Section 3 Tier 3 implementation reference | WIZKOO | TECHNICAL_RUNBOOK.md L5 | Wizkoo homepage structure |
| **LAYER 6 — Deep Reference / Failure Prevention** | | | |
| Completion Standard | GLOBAL | AMY_TECHNICAL_STANDARDS.md §2 | Definition applies to any project |
| Paid-Tier Test (concept abstracted from $200 Standard) | GLOBAL | AMY_TECHNICAL_STANDARDS.md §2 | NEW: abstract quality bar; project defines its own dollar figure; Wizkoo's figure ($200) stays in TECHNICAL_RUNBOOK.md L4 |
| Operating Principles 1–7 (text only, cleaned) | GLOBAL | AMY_TECHNICAL_STANDARDS.md §2 | Principles are universal; Wizkoo-specific governance language stripped |
| Wizkoo-specific governance on each Operating Principle | WIZKOO | TECHNICAL_RUNBOOK.md L1 | Governs Claude's behavior specifically on this project; enforcement cross-reference added |
| Pattern 1–7 (generic text) | GLOBAL | AMY_TECHNICAL_STANDARDS.md §6 | Failure patterns apply across projects |
| Pattern 8 (client/server list divergence, validate-theme.js) | WIZKOO | TECHNICAL_RUNBOOK.md L6 | Specific to Wizkoo moderation architecture; retains Pattern 8 designation in Wizkoo numbering |
| Patterns 9–13 (generic text, renumbered 8–12) | GLOBAL | AMY_TECHNICAL_STANDARDS.md §6 | Renumbered sequentially; gap removed |
| Homepage Form Preservation Locks (36 items, Clusters A–F) | WIZKOO | TECHNICAL_RUNBOOK.md L6 | Specific to Wizkoo homepage v3.0 |
| Open Items 1–10 | WIZKOO | TECHNICAL_RUNBOOK.md L6 | All name Wizkoo files or decisions |
| Accessibility minimums (concept only) | GLOBAL | AMY_TECHNICAL_STANDARDS.md §7 | WCAG targets are not product-specific |
| Accessibility target device (2020 iPad Air) | WIZKOO | TECHNICAL_RUNBOOK.md L6 | Wizkoo-specific test target |
| Performance targets (concept only) | GLOBAL | AMY_TECHNICAL_STANDARDS.md §8 | Core Web Vitals thresholds are universal |
| Performance targets (Wizkoo Lighthouse scores) | WIZKOO | TECHNICAL_RUNBOOK.md L6 | Specific to Wizkoo production pages |
| **LAYER 7 — CSS & API Reference** | | | |
| CSS custom properties (static site repo) | WIZKOO | TECHNICAL_RUNBOOK.md L7 | Wizkoo token names |
| CSS custom properties (plan generator repo) | WIZKOO | TECHNICAL_RUNBOOK.md L7 | Wizkoo plan generator tokens |
| External API surface | WIZKOO | TECHNICAL_RUNBOOK.md L7 | Wizkoo OpenAI / Anthropic usage |
| Prompt template system | WIZKOO | TECHNICAL_RUNBOOK.md L7 | Wizkoo plan generator prompts |
| **LAYER 8 — Version History** | | | |
| Version history v1.0–v3.x | WIZKOO | TECHNICAL_RUNBOOK.md L8 | Documents Wizkoo runbook evolution |
| v4.0 entry (this split) | NEW | TECHNICAL_RUNBOOK.md L8 | Added during extraction to document the split |
| **Cross-cutting: Prompt Engineering** | | | |
| Six-section prompt standard (TASK/SCOPE/…) | GLOBAL | AMY_TECHNICAL_STANDARDS.md §3 | Format applies to any project |
| Return rule (what to return after changes) | GLOBAL | AMY_TECHNICAL_STANDARDS.md §3 | Not product-specific |
| Minimum viable prompt definition | GLOBAL | AMY_TECHNICAL_STANDARDS.md §3 | Universal |
| Pre-written hygiene prompts (generic templates) | GLOBAL | AMY_TECHNICAL_STANDARDS.md §4 | Template structure with [PLACEHOLDER] paths |
| Pre-written hygiene prompts (Wizkoo paths filled in) | WIZKOO | TECHNICAL_RUNBOOK.md L1 | Names css/, components/nav.js, /games/ |
| **Cross-cutting: Code Hygiene** | | | |
| Four-layer hygiene framework | GLOBAL | AMY_TECHNICAL_STANDARDS.md §4 | Layer names/definitions are universal |
| Optimization-vs-refactor distinction | GLOBAL | AMY_TECHNICAL_STANDARDS.md §4 | Conceptual — not product-specific |
| Hygiene trigger conditions | GLOBAL | AMY_TECHNICAL_STANDARDS.md §4 | Apply to any project |
| **Cross-cutting: Viewport & Responsive** | | | |
| Five target viewports (including 1440×396 hardware facts) | GLOBAL | AMY_TECHNICAL_STANDARDS.md §5 | Amy's hardware setup across all projects; note to update per-project |
| Wizkoo breakpoint constraints derived from 756×396 canvas | WIZKOO | TECHNICAL_RUNBOOK.md L4 | These are Wizkoo implementation decisions, not hardware facts |
| overflow:hidden + min-height:100dvh coupling rule | GLOBAL | AMY_TECHNICAL_STANDARDS.md §5 | CSS behavior — not Wizkoo-specific |
| Section-height rule | GLOBAL | AMY_TECHNICAL_STANDARDS.md §5 | Generic responsive rule |
| Nav safe-zone rule | GLOBAL | AMY_TECHNICAL_STANDARDS.md §5 | Generic — applies wherever nav overlaps content |

---

## Decisions Made on Previously Flagged Items

### Flag 2 — $200 Standard quality concept → RESOLVED
**Decision:** Extract the abstract quality heuristic into Standards §2 as "The Paid-Tier Test." The $200 Standard full content (with linen, saffron, and parent-experience language) stays Wizkoo-only. Standards §2 now contains a generic one-paragraph version that names Wizkoo's figure as an example and instructs each project to define its own.

### Flag 4 — Pattern numbering gap → RESOLVED
**Decision:** Standards §6 renumbered sequentially 1–12. No placeholder row. Original Patterns 9–13 are now 8–12. Wizkoo's moderation pattern retains the "Pattern 8" label within the TECHNICAL_RUNBOOK.md Layer 6 numbering scheme (a Wizkoo-internal designation, not a Standards number).

### Flag 3 — Operating Principles governance split → CONFIRMED + MECHANISM ADDED
**Decision:** Architecture confirmed correct. Enforcement cross-references added to every governance section in TECHNICAL_RUNBOOK.md. Format: "Enforces Standards §X.Y via [mechanism]." Applied to: Session Startup, Build Session Close, Wizkoo Verification Gate, Operating Principles scope, Code Hygiene Prompts, Preservation Locks Registry.

---

## Sections Reorganized, Merged, or Rewritten

| Action | What Changed | Why |
|---|---|---|
| **Reorganized** | Standards structured into 8 numbered sections (§1–§8) vs. runbook's layer numbering | Made Standards readable as standalone doc without layer metaphor |
| **Rewritten (cleaned)** | Operating Principles 1–7 in Standards §2 | Stripped Wizkoo-specific examples and file references; kept principle text |
| **Rewritten (cleaned)** | Hygiene prompt templates in Standards §4 | Replaced Wizkoo file paths with `[PATH]` / `[COMPONENT]` placeholders |
| **Rewritten (cleaned)** | Patterns 1–7 in Standards §6 | Removed Wizkoo-specific examples; kept failure mechanism descriptions |
| **Renumbered** | Patterns 9–13 → 8–12 in Standards §6 | Closed gap left by Pattern 8 moving to Wizkoo-only |
| **Abstracted (new)** | Paid-Tier Test added to Standards §2 | Extracted quality concept from $200 Standard without brand language |
| **Merged** | Five target viewports + overflow coupling rule + section-height rule + nav safe-zone rule → Standards §5 | Related concepts combined into one section |
| **New entry added** | v4.0 in TECHNICAL_RUNBOOK.md L8 | Documents the split; wasn't in original |
| **Enforcement references added** | "Enforces Standards §X.Y via [mechanism]" in 6 TECHNICAL_RUNBOOK.md governance sections | New; implements Flag 3 decision |
| **Cross-reference notes added** | TECHNICAL_RUNBOOK.md L1, L5 | Notes like "Global framework: AMY_TECHNICAL_STANDARDS.md §5" where content moved out |

---

## Content Intentionally Dropped

| Content | Reason Dropped |
|---|---|
| Notion page IDs in AMY_TECHNICAL_STANDARDS.md | IDs are Wizkoo-specific; Standards must be project-agnostic |
| Windows absolute file paths in AMY_TECHNICAL_STANDARDS.md | Paths are Wizkoo-specific |
| Wizkoo-specific example language in Operating Principles (Standards version) | Kept principle, dropped Wizkoo illustration |
| Wizkoo-specific example language in Failure Patterns (Standards version) | Kept failure mechanism, dropped product context |
| ATC Flight Log DB schema fields in AMY_TECHNICAL_STANDARDS.md session close steps | DB schema is Wizkoo's Notion structure |
| Redundant section headers that duplicated layer titles | Formatting cleanup only; no content lost |

**Nothing was dropped from TECHNICAL_RUNBOOK.md.** All original content is preserved there in full.

---

## Section Count Summary

| Classification | Count | Notes |
|---|---|---|
| **GLOBAL** | ~24 sections/subsections | AMY_TECHNICAL_STANDARDS.md (includes 2 new: Paid-Tier Test, Pattern 8 renumbered from 9) |
| **WIZKOO** | ~41 sections/subsections | TECHNICAL_RUNBOOK.md |
| **NEW** | 3 additions | v4.0 history entry; Paid-Tier Test §2; 6 enforcement cross-references |
| **Ambiguous (resolved)** | 4 → 0 remaining | All four flags decided and implemented |

Dominant classification: **WIZKOO (~63%)** — the runbook was deeply product-specific. Global content is mostly methodology, process, and quality framework.
