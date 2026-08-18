# LIB-01 — Library Standards Subsystem: Provenance Recon

**Date:** 2026-08-12
**Lane:** Read-only. No edits, no commits, no deploy.
**Base SHA:** `7ad5a1405dbbd12cfea190218a33ffb69569dbff` (HEAD == origin/main, fetched clean)
**Repo:** `Desktop\Wizkoo` (marketing)
**Database read:** Supabase project `uswqovyeltrkpjtdxjqj` (`js/supabase-config.js:11`), read-only SELECT via MCP. No writes. No credential values read or printed.

---

## Headline

The codes are real-looking. Two of them are not real. Thirty of them are labeled as the wrong framework on the live site right now. And nothing in this repository records who assigned any of them.

The provenance verdict is **(d) unknown**, with **(a) licensed source affirmatively excluded**. The exclusion is the finding that matters: a licensed CCSS/NGSS correlation dataset does not contain codes that do not exist. Whatever produced these, it was not a publisher's metadata feed.

---

## 1. The data path, end to end

Every hop, from rendered pixel back to column.

| # | Hop | Location |
|---|-----|----------|
| 1 | Rendered element | `library/book.html:990` — `<p class="bk-standards" id="bk-standards" style="display:none"></p>` |
| 2 | Text written | `js/library-book.js:449-457` — reads `book.standards`, joins `standard_code` with ` · `, prefixes `'Aligned to · '`, unhides |
| 3 | Normalized onto book object | `js/library-book.js:198` — `b.standards = (b.library_standards \|\| [])` |
| 4 | Supabase query | `js/library-book.js:88-99` — `.from('library_books').select(... 'library_standards(standard_code, standard_type)' ...).eq('slug', s).eq('status','active').single()` |
| 5 | Table | `library_standards` — `sql/library-schema.sql:80-86` |
| 6 | Columns | `id UUID`, `book_id UUID FK → library_books(id) ON DELETE CASCADE`, `standard_code TEXT NOT NULL`, `standard_type TEXT NOT NULL CHECK (standard_type IN ('CCSS','NGSS'))`, `UNIQUE(book_id, standard_code)` |
| 7 | Read policy | `sql/library-schema.sql:200-201` — `CREATE POLICY "public read standards" ... FOR SELECT USING (true)`. Public anon read. |
| 8 | Index | `sql/library-schema.sql:156` — `idx_standards_code ON library_standards(standard_code)` |

**Write path (how rows got in):**

| # | Hop | Location |
|---|-----|----------|
| 9 | Importer reads CSV column 14 | `scripts/import-library-pg.js:129` (`standards:14`) and `scripts/import-library.js:22` (documented column order) |
| 10 | Code/type split | `scripts/import-library-pg.js:117-121` — prefix parser (see §2, this is where 30 rows break) |
| 11 | Enum validation | `scripts/import-library.js:68` — `standard_type: new Set(['CCSS','NGSS'])` |
| 12 | Source CSV | **Not in the repository, and never was.** No CSV in git history contains a standards column. |

**Second consumer — the library index page:**

| # | Hop | Location |
|---|-----|----------|
| 13 | Index query fetches standards | `js/library.js:74` — same join |
| 14 | Normalized | `js/library.js:106` |
| 15 | Surfaced only in the PDF | `js/library.js:623-628` (per-book codes) and `js/library.js:607` (the ESA sentence) |

`library.html` renders no standards codes anywhere in its own DOM. Grep for `standard` / `aligned` in `library.html` returns nothing. The index page fetches the data and uses it only when generating the PDF.

**Third consumer — structured data:**

| # | Hop | Location |
|---|-----|----------|
| 16 | Custom property | `js/library-book.js:701-703` — `'wizkoo:standardsCodes': [...]` |
| 17 | schema.org alignment | `js/library-book.js:706-717` — `educationalAlignment[]` with `alignmentType: 'teaches'`, `targetName: <code>`, `educationalFramework:` `'Next Generation Science Standards'` if `standard_type === 'NGSS'`, else `'Common Core State Standards'` |
| 18 | Injected | `js/library-book.js:722-723` — written into `#bk-schema` |

Note hop 17: the framework label is derived from `standard_type` alone. It never inspects the code. That is the mechanism behind the mislabeling in §2.

---

## 2. What the codes are

**Volume (live database, read 2026-08-12):**

| Metric | Count |
|---|---|
| Books total / active | 457 / 457 |
| Books carrying at least one code | **96** (21.0%) |
| `library_standards` rows | **199** |
| Distinct codes | **92** |
| Rows typed `CCSS` | 164 |
| Rows typed `NGSS` | 35 |

**Distinct code shapes:**

| Shape | Distinct | Example |
|---|---|---|
| `CCSS.ELA-LITERACY.*` | 40 | `CCSS.ELA-LITERACY.RL.K.2` |
| `CCSS.MATH.CONTENT.*` | 13 | `CCSS.MATH.CONTENT.K.CC.A.1` |
| `NGSS.*` (dot) | 24 | `NGSS.2-LS4-1` |
| `NGSS-*` (hyphen) | 15 | `NGSS-2-LS4-1` |

### Finding 2a — Well-formed, and mostly real

Spot-checked against the published frameworks by direct fetch.

**Verified real (thecorestandards.org, Reading: Literature, Kindergarten):** the strand lists `CCSS.ELA-LITERACY.RL.K.1` through `RL.K.10`. The four K codes in our data (`RL.K.2`, `RL.K.4`, `RL.K.7`, `RL.K.9`) all exist, and the repository's string format matches the official format character for character. Example: `RL.K.7` officially reads "With prompting and support, describe the relationship between illustrations and the story in which they appear."

**Verified real (nextgenscience.org):** `K-PS2-1/2`, `K-PS3-1/2`, `K-ESS3-1/2/3`, `1-PS4-1` through `1-PS4-4`, `2-PS1-1` through `2-PS1-4`.

The CCSS.MATH codes follow the correct `CCSS.MATH.CONTENT.<grade>.<domain>.<cluster>.<n>` grammar throughout.

### Finding 2b — Two codes do not exist

| Code | Book | Why it is not real |
|---|---|---|
| `NGSS.K-PS4-1` | The Listening Walk (`/library/the-listening-walk`) | NGSS has no kindergarten PS4. Waves performance expectations begin at grade 1 (`1-PS4-1` … `1-PS4-4`, verified). Kindergarten physical science is PS2 and PS3 only. |
| `NGSS-K-PS1-1` | Mixed: A Colorful Story (`/library/mixed-a-colorful-story`) | NGSS has no kindergarten PS1. Matter performance expectations begin at grade 2 (`2-PS1-1` … `2-PS1-4`, verified). |

Corroboration: the K-PS3 page's own "Connections to other DCIs in kindergarten" lists only `K.ETS1.A` and `K.ETS1.B`, and its cross-grade articulation cites `1.PS4.B`, confirming PS4 sits at grade 1.

The signature is worth naming precisely. Both codes pair the **correct science domain** with a **grade at which that domain has no performance expectations**. The Listening Walk is a book about sound, and sound is PS4; the book is for ages 3-6, so the grade was set to K; `K-PS4-1` was assembled from those two correct facts and never checked against the actual NGSS code table. Same for color-mixing → PS1 → K. This is what a plausible fabrication looks like: right topic, right shape, no such standard.

`NGSS.K-PS4-1` is live on the public site at this moment. Fetched from `https://www.wizkoo.com/library/the-listening-walk`, the page renders:

> `ALIGNED TO · NGSS.K-PS4-1 · CCSS.ELA-LITERACY.RL.K.7`

and its JSON-LD publishes:

```json
{ "@type": "AlignmentObject", "alignmentType": "teaches",
  "educationalFramework": "Next Generation Science Standards",
  "targetName": "NGSS.K-PS4-1" }
```

### Finding 2c — Thirty NGSS codes are published as Common Core

30 rows across **25 books** hold an NGSS code with `standard_type = 'CCSS'`. Every one of them uses the hyphen form (`NGSS-2-LS4-1`) rather than the dot form (`NGSS.2-LS4-1`).

The cause is `scripts/import-library-pg.js:117-121`:

```js
if (t.startsWith('NGSS:')) return { code: t.slice(5).trim(), type: 'NGSS' };
if (t.startsWith('CCSS:')) return { code: t.slice(5).trim(), type: 'CCSS' };
if (t.startsWith('NGSS.')) return { code: t, type: 'NGSS' };
if (t.startsWith('CCSS.')) return { code: t, type: 'CCSS' };
return { code: t, type: 'CCSS' };          // ← line 121, the default
```

`NGSS-` matches none of the four prefixes, so it falls to the line-121 default and is typed CCSS. Because `js/library-book.js:711-714` derives the framework label from `standard_type` and never looks at the code, the result reaches the public as structured data asserting that an NGSS code is a Common Core standard.

Confirmed live at `https://www.wizkoo.com/library/bee-dance`:

> `Aligned to · NGSS-2-LS4-1 · CCSS.MATH.CONTENT.2.MD.A.1`

```json
{ "@type": "AlignmentObject", "alignmentType": "teaches",
  "targetName": "NGSS-2-LS4-1",
  "educationalFramework": "Common Core State Standards" }
```

`NGSS-2-LS4-1` is a real NGSS standard. The claim that it is Common Core is false, and it is machine-readable.

### Finding 2d — One malformed code

`CCSS.ELA-LITERACY.RF.1.4a` (book: Little Bear). `RF.1.4` exists and does carry substandards, but the official format is `CCSS.ELA-LITERACY.RF.1.4.A` (dot separator, uppercase letter), verified on the grade 1 Reading: Foundational Skills page. The code points at something real and is written wrong.

### Finding 2e — Grade fit is internally coherent

Mapping each code's embedded grade against the book's youngest age band:

| Age band | Rows | Mean code grade | Range |
|---|---|---|---|
| 3-4 | 62 | 0.2 | K–2 |
| 5-6 | 100 | 2.2 | K–5 |
| 7-9 | 2 | 3.0 | 3 |
| 10-12 | 32 | 4.4 | 3–5 |

The gradient is in the right direction and roughly the right magnitude. Whoever or whatever assigned these was tracking the age band, not drawing at random. That is worth stating plainly, because it is the strongest thing that can be said in the data's favor, and it is not the same as the codes being sourced.

**Tally: 92 distinct codes. 2 do not exist. 1 is malformed. 30 rows (25 books) are published under the wrong framework. The remaining ~89 distinct codes spot-check as real and correctly formatted.**

---

## 3. Who assigned them — verdict **(d) unknown**, with (a) excluded

### What the evidence shows

**The codes entered in a single import run and never again.** Grouping books by creation minute against their standards rows:

| Import window | Books | Standards rows |
|---|---|---|
| 2026-04-11 16:54–16:56 | 96 | **199** |
| 2026-04-11 22:05 → 2026-04-28 14:18 (19 later batches) | 361 | **0** |

All 199 rows landed in a three-minute window on 2026-04-11. Every subsequent import, 361 books across nineteen batches over seventeen days, added zero. The nine batch importers in `scripts/` (`import-batch*.js`, `import-modern*.js`, `import-new-notable.js`, `import-2026-batch25*.js`) each declare `standards:14` in their column map and never populate it. Standards were a one-time property of the original CSV.

**`curated_by` is not evidence.** Every book in the database reads `curated_by = 'beth-holloway'`. That value is a hardcoded string literal at `scripts/import-library-pg.js:281` and `scripts/import-library.js:393`, stamped on every row regardless of origin. It says nothing about who assigned the standards. Anyone reading the column as attribution would be reading a constant.

**The source CSV was never committed.** `git log --all --diff-filter=A` over the full history returns six CSVs: `library-content-audit.csv`, `exports/library_open_item_j_triple_tag_audit.csv`, `exports/library_orbital_score_sweep_v2.csv`, `exports/library_phase6_audit_export.csv`, `migrations/library_phase6_p1_retag_audit.csv`, `migrations/phase6_amy_approval_check.csv`. None has a standards column. `library-content-audit.csv` carries `id,title,author,age_bands,flag_type,flag_reason,recommendation`. `scripts/_audit_data.json` holds 540 book records whose keys are `title, author, year_published, book_format, reading_level, heads_up, orbital_description, hook, themes, age_bands` — no standards.

**No document anywhere records the source.** Searched `TECHNICAL_RUNBOOK.md`, `INFRASTRUCTURE.md`, `README.md`, `AGENTS.md`, `EXTRACTION_REPORT.md`, `TRANSFER_QUEUE.md`, and `docs/`. Every hit for "standards" refers to Amy's technical standards document, not educational standards. There is no README, no note, no comment, no commit message that says where CCSS or NGSS codes came from. Grep for `GELDS` across the marketing repo returns nothing.

**The whole subsystem arrived in one commit.** `git log -S "library_standards" --all` returns exactly one commit: `179f4d1`, 2026-04-11, author Ethos25, "feat(library): major library update — batch imports, content policy, UI polish", with `Co-Authored-By: Claude Sonnet 4.5`. That commit introduced `sql/library-schema.sql`, both importers, and the rendering code together.

### Why the verdict is (d), and why it is not (a)

**(a) Licensed source or publisher metadata is excluded.** A licensed correlation dataset from a standards vendor does not emit `K-PS4-1` and `K-PS1-1`. Nor would it deliver the same framework in two incompatible delimiter conventions (`NGSS.` and `NGSS-`) within one file. Nor would it produce `RF.1.4a` where the published format is `RF.1.4.A`. Three independent defects, each of a kind that a vendor feed does not have.

**(b) generated by a model or script, and (c) hand-assigned, cannot be separated from what is visible here.** The failure signature in §2b (correct domain, impossible grade) is characteristic of generation without lookup, and the co-authorship trailer on `179f4d1` shows a model was involved in writing the subsystem's *code*. Neither fact establishes who produced the *data*. The commit trailer describes authorship of JavaScript and SQL, not of the CSV, and the CSV is not in the repository. A person working quickly from age bands and subject tags could produce the same three defects. I cannot distinguish these from inside this repo, and I am not going to pick one because one of them sounds more likely.

**Verdict: (d) unknown.** With (a) ruled out on physical evidence.

### What would answer it, and who can get it

| Question | What would settle it | Who |
|---|---|---|
| Where did the CSV come from? | The original 218-book CSV file itself, and the machine or drive it was authored on. `scripts/import-library.js:19-25` documents the exact column order, so any candidate file is identifiable in seconds. | Amy — local filesystem, Drive, or the April 2026 working directory |
| Was there a generation step? | The Claude Code session transcripts for 2026-04-11 (`~/.claude/projects/...`). `migrations/_read_notion_page.py` proves session tool-results were being read back as files in this project, so transcripts from that period may still exist. | Amy — local `.claude` session history |
| Was Notion the source of truth? | The Notion library database as of April 2026, and whether it ever had a standards property. | Amy — Notion (the MCP connector is available in-session but was not queried in this read-only lane) |
| Did a human review them? | Any approval artifact from the original import. `migrations/phase6_amy_approval_check.csv` shows approval gates existed for the April 28 retag round; nothing equivalent exists for the April 11 standards import. | Amy |

---

## 4. The ESA promise

### Correction to the brief

The sentence at `js/library.js:607` is **not** in the PDF footer. It is in the **header block**, rendered immediately beneath the document title:

```
[navy header bar]  wizkoo                    BOOKS THAT ORBIT
The Library — Wonderer (Ages 3–6) · Read Together      ← title, 14pt bold
wizkoo.com/library  ·  Standards codes serve as ESA documentation.   ← line 607, 8pt
────────────────────────────────────────────
```

The actual page footer is `js/library.js:659`: `'wizkoo.com/library · Generated <date>'` plus page numbers. The ESA sentence sits at the top of page one, directly under the title. It is more prominent than the brief assumed.

### What the PDF contains

From `generatePDF()`, `js/library.js:570-664`:

- Navy header bar: "wizkoo" and "BOOKS THAT ORBIT"
- Title: "The Library — " plus band label, e.g. "Wonderer (Ages 3–6) · Read Together"
- **The ESA sentence** (line 607)
- Per book: title · author (bold), **up to 3 standard codes, right-aligned** (lines 623-628), age bands and reading level, the hook in italic, a hairline rule
- Per page: `wizkoo.com/library · Generated <date>` and page numbering

The standards codes are printed on the page, next to each title, under a header sentence telling the reader what they are for.

### What the sentence promises

"Standards codes serve as ESA documentation." To a parent, in a document they were told to hand to a provider, that reads as: these codes are the paperwork, and presenting them satisfies an ESA program's documentation requirement.

The framing is reinforced at the point of download. `library.html:201`, the email-capture modal:

> "A branded PDF with titles, authors, age bands, and reading levels, ready to hand to your librarian or **ESA provider**."

The PDF is gated behind email capture (`js/library.js:512-560`). The ESA usefulness is part of what is offered in exchange for the address.

### What backs it in the repository

Nothing. And the site's own ESA pages say the opposite.

`esa.html:233`:

> **"Wizkoo is not yet listed on ESA marketplace platforms."** We're in the approval process and will update each state's page as approvals land. In the meantime, families in states that allow direct reimbursement for educational software may be able to use ESA funds by submitting a receipt.

`esa.html:139` (FAQ, also published as FAQPage JSON-LD at `esa.html:133`):

> **"Is Wizkoo an approved ESA vendor?"** → **"Not yet. We're in the approval process."**

`esa.html:234`:

> "Before purchasing with ESA funds, check with your state's ESA program administrator to confirm that educational software subscriptions are an approved expense category."

Searched for and did not find, anywhere in the repo: a vendor approval letter, a program acceptance, a ClassWallet or Odyssey listing, a documented reimbursement path, or any state program's stated documentation requirements. The `esa/` directory holds 50 state pages, all generated by `scripts/build-esa-pages.py`; none contains a standards-based documentation claim.

**The finding:** `js/library.js:607` tells parents the codes serve as ESA documentation. `esa.html:233` tells parents Wizkoo is not an approved ESA vendor. Both are live. The library PDF makes a stronger claim about ESA usability than the ESA section of the same site is willing to make, and the codes underwriting that claim include two that do not exist.

---

## 5. Blast radius

### Numbers

| Quantity | Count |
|---|---|
| Active books | 457 |
| Books carrying codes | **96** (21.0%) |
| `library_standards` rows | 199 |
| Distinct codes | 92 |
| **Book detail pages rendering "Aligned to"** | **96** |
| **Book detail pages emitting `educationalAlignment`** | **96** |
| Books whose JSON-LD mislabels NGSS as Common Core | **25** |
| Books carrying a nonexistent code | **2** |
| PDF variants carrying the ESA sentence | every generated PDF, all bands, unconditionally |
| Repository files to touch for a full claims removal | **3** (`js/library-book.js`, `js/library.js`, `library.html`) |

One physical file, `library/book.html`, serves all 96 pages via the `/library/:slug` rewrite (`publish-allowlist.txt:61-64`). The 361 books without codes already render the page with the line absent.

### Is "Aligned to" load-bearing?

**No.** Three independent reasons:

1. The element ships hidden. `library/book.html:990` sets `style="display:none"` in the markup; `js/library-book.js:451-456` unhides only when `book.standards.length > 0`.
2. **361 of 457 books already render this page with the line hidden**, in production, today. The no-standards layout is the majority case and is already proven.
3. The live style rule is `library/book.html:381-388`: a `<p>` with `margin-top: 8px` and type properties. No flex or grid participation, no sibling selector, no reserved height. It sits between `.bk-decision-card` and `.bk-tertiary-links`, both of which carry their own top margins.

One incidental finding: `css/library.css:1287-1300` defines a *different* `.bk-standards` (flex, with `.bk-standard-pill` children) from an earlier pill-based design. `library/book.html` links only `tokens.css`, `base.css`, and `footer.css` (lines 26-28), never `library.css`, and `bk-standard-pill` is emitted by no JavaScript in the repo. Those rules are dead for this page. Noted, not touched.

### Does JSON-LD removal leave a valid document?

**Yes.** `educationalAlignment` is an optional schema.org property on `Book`. The object is assembled at `js/library-book.js:706-717` as a discrete `if` block appended after the base schema literal; removing the block leaves `@context`, `@type`, `name`, `author`, `numberOfPages`, `bookFormat`, `audience`, `typicalAgeRange`, `description`, `url`, `isPartOf`, and the `wizkoo:` extensions intact and valid. The `undefined`-pruning loop at line 720 is unaffected.

**One trap:** removing `educationalAlignment` alone does not remove the codes from the page. `js/library-book.js:701-703` independently emits `wizkoo:standardsCodes` as a raw array of the same strings. That property is not namespaced to any resolvable vocabulary, so it makes no framework claim, but the code strings including `NGSS.K-PS4-1` remain in the served HTML. A removal that stops at `educationalAlignment` leaves the fabricated code publicly readable.

### Does the PDF still make sense without the sentence?

**Yes.** Line 607 renders a single string: `'wizkoo.com/library  ·  Standards codes serve as ESA documentation.'` Truncating it to `'wizkoo.com/library'` leaves a working attribution line. Layout is unaffected: `y` advances by a fixed `+= 10` at line 608 regardless of content.

The per-book codes at `js/library.js:623-628` are a separate block, right-aligned against the title line. They can stay or go independently. If the sentence goes and the codes stay, the PDF prints bare codes with nothing explaining them. If both go, the title line loses its right-hand element and nothing else shifts, since `y` advances on `titleLines.length` only.

`library.html:201`'s "ready to hand to your librarian or ESA provider" is a third, independent surface. It is static HTML and survives any JavaScript change.

---

## 6. The options

Presented as three, not as a recommendation.

### Option A — Remove the parent-facing claims, keep the data

Delete the render at `js/library-book.js:449-457`, the `educationalAlignment` block at 706-717, the `wizkoo:standardsCodes` property at 701-703, the ESA sentence at `js/library.js:607`, the per-book codes at 623-628, and the "ESA provider" phrase at `library.html:201`. Leave `library_standards` populated.

- **Cost:** three files, roughly forty lines. No schema change, no migration, no data loss. The plan-generator query sketched at `sql/library-schema.sql:213-226` ranks candidates by standards overlap and would continue to work against the retained rows.
- **Risk:** the 199 rows stay in a publicly readable table (`sql/library-schema.sql:200-201`, `USING (true)`). Anyone with the anon key can still read `NGSS.K-PS4-1`. Lower exposure than rendering it, not zero. If the data is later reused internally for planning, two fabricated codes and 30 mistyped ones are still in it.
- **Decided by:** whether the codes have any internal use that justifies keeping unverified data. If the answer is no, the rows are pure liability.

### Option B — Keep everything

Change nothing.

- **Cost:** none today.
- **Risk:** `js/library.js:607` promises ESA documentation while `esa.html:233` states Wizkoo is not an approved ESA vendor. Both are live and both are the company's own words. `NGSS.K-PS4-1` and `NGSS-K-PS1-1` are published as standards alignments and do not exist. 25 books publish machine-readable assertions that NGSS codes are Common Core. The codes' origin is unknown and cannot be defended if asked. The claim sits above a promise about a family's education funding.
- **Decided by:** nothing available. Keeping requires evidence that does not exist in this repository. If Amy holds the source CSV and it turns out to be sourced, this becomes a live option; from what is visible here it is not.

### Option C — Between: fix the defects, narrow the claim

Several distinct sub-options, worth separating because they cost different things.

**C1 — Fix the type mislabel only.** One UPDATE normalizing the 30 `NGSS-` rows to `standard_type = 'NGSS'`, plus the delimiter, plus a fifth branch in `scripts/import-library-pg.js:117-121` so it cannot recur. Cheap, and it removes a provably false machine-readable claim. Does nothing about provenance or the ESA sentence.

**C2 — Remove only the two nonexistent codes.** Two DELETEs. Removes the sharpest single exposure. Leaves 90 codes of unknown origin still presented as alignments.

**C3 — Drop the ESA sentence, keep the "Aligned to" line.** Removes the money promise, keeps the feature. Retains the parent-facing alignment claim, which is the thing the ruled boundary is about.

**C4 — Reframe rather than remove.** Change "Aligned to" to language that describes what the codes actually are, and drop the ESA sentence. Costs no data. Per the lane's rails, I am not proposing copy.

- **Risk shared across C1-C4:** each fixes a symptom. None answers §3. A correctly typed, existent, well-formed code of unknown provenance is still a standards-alignment claim the company cannot source, and the ruled boundary is about the claim, not the formatting.
- **Decided by:** the source CSV. If it surfaces and shows a defensible origin, C is the proportionate path and validation closes the gap. If it does not surface, or shows generation without verification, C is Option B with better spelling.

### The evidence that decides all three

One artifact: **the original 218-book CSV**. Its standards column, and whatever authored it. `scripts/import-library.js:19-25` gives the exact column order to identify it. Everything above is downstream of that file, and it is the one thing this lane could not reach.

Second, smaller: **whether any state ESA program has ever stated that CCSS/NGSS codes constitute acceptable documentation**. Nothing in the repo asserts this. `esa.html:234` directs families to ask their own administrator, which is the site conceding it does not know.

---

## Appendix — verification method

- **Repo:** read-only. No file modified except this report. Nothing staged, committed, or pushed.
- **Database:** read-only `SELECT` via Supabase MCP against `uswqovyeltrkpjtdxjqj`. No writes, no DDL, no migrations. No credential value read or printed.
- **Live site:** `https://www.wizkoo.com/library/the-listening-walk` and `/library/bee-dance` loaded in the in-app browser; rendered text and `#bk-schema` JSON-LD read directly. These pages are client-rendered from Supabase, so static fetch returns an empty shell; the browser was required.
- **Framework verification:** `nextgenscience.org` DCI-arrangement pages for K-PS2, K-PS3, K-ESS3, 1-PS4, 2-PS1. `thecorestandards.org` ELA-Literacy RL/K and RF/1.
- **Not established:** the origin of the source CSV; whether a model, a script, or a person assigned the codes; whether any human reviewed them before import; whether any ESA program accepts standards codes as documentation. Each is named in §3 and §6 with what would answer it.
