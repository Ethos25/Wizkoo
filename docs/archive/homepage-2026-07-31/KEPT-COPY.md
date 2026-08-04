# KEPT COPY — Excellence Round 1 (2026-07-31)

**These strings are ruled KEEPERS awaiting placement in a future round.**

They are **protected, not dead**. They were removed from the shipped page only because their host
(the intake form) was retired this round. They are held here for REHOME.

Standing constraints on this file:
- Neither string may appear **broken or orphaned** on the shipped page. Verified: both are absent
  from the shipped page as of this round, not half-present. See the orphan grep in the round report.
- Neither string may be **deleted from this manifest**.
- Rehoming requires a ruling. Nothing here ships without one.

---

## KEEPER 1 — The wiggly question and its movement promise

**Verbatim, as it rendered:**

> **Wiggly kid?**
>
> We weave themed movement in — dance breaks, obstacle play, outdoor missions.

| Part | Verbatim string | Original location |
|---|---|---|
| Question (visible label) | `Wiggly kid?` | index.html:1515 — `<div class="field-label">` |
| Question (a11y legend) | `Wiggly kid?` | index.html:1513 — `<legend class="visually-hidden">` |
| Movement promise | `We weave themed movement in — dance breaks, obstacle play, outdoor missions.` | index.html:1528 — `<p class="toggle-note" id="wiggly-note">`; also index.html:2671 as JS constant `wigglyNoteYes` |

### Companion string — preserved by judgment, flagged for ruling

The toggle was a **pair**. The "No" branch swapped the promise sentence:

| Part | Verbatim string | Original location |
|---|---|---|
| Focus promise ("No" branch) | `We build deeper focus in — deep reads, long builds, big questions.` | index.html:2672 — JS constant `wigglyNoteNo` |

**Why it is here and not in KILLED-COPY:** the directive named the movement sentence as the keeper.
This is its other half. Retiring one branch of a two-branch promise would orphan the motif at rehome
time — the exact failure the KEPT manifest exists to prevent. Preserved so the pair stays whole.
**Flagged for Amy's ruling:** keep the pair, or retire this half.

> **Note on the em-dash rule.** Both promise sentences contain an em dash. They are quoted here
> verbatim because this is an archival manifest, not shipped copy. If either is rehomed onto the page,
> the em dash must be resolved first under the standing no-em-dash rule.

---

## KEEPER 2 — The multi-child telegraph

**Verbatim, as it rendered:**

> MORE KIDS? · ADD THEM NEXT

| Part | Verbatim string | Original location |
|---|---|---|
| Prompt | `MORE KIDS?` | index.html:1540 — `<span class="sub-cta" id="more-kids-cta">` |
| Action | `ADD THEM NEXT` | index.html:1540 — `<span class="sub-cta-action">` |

Rendered as painted uppercase in Space Mono. The `·` separator was injected by CSS
(`.sub-cta-action::before{content:'· '}`, index.html:1013), not authored in the string.

**Truth status:** verified TRUE and product-backed in the 2026-07-30 audit. Its sibling claim
`Up to 4 kids` (index.html:1456) was retired to `KILLED-COPY.md` with the form head; this telegraph
is the surviving carrier of the multi-child promise and is the reason the claim must be rehomed
rather than dropped.

---

**Count: 2 ruled keepers (3 strings) + 1 companion string flagged for ruling.**
