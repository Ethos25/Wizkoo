# RE-FILED COPY — SON / SPACE PANEL

**RE-FILED FOR: ESA pages / retargeting / social.**

**Written 2026-08-02, at the cut of the homepage son/space panel.** These are
ruled Copy Room strings. They were certified, deployed, and are now out of the
homepage flow. They are not retired — they are re-filed. Nothing here is a draft.

Every string below was copied out of `index.html` at `f7a55e9` before the cut,
not retyped from memory. The rendered form is what a reader saw; the source form
is the exact byte sequence that shipped, HTML entities included.

---

## 1. LINEAGE

| | |
|---|---|
| **Surface** | Wizkoo homepage, `index.html` |
| **Section** | "Everything connects" (`.ec-section`), second of two scenario panels |
| **Shipped as** | `.ec-scenario--space`, markup at lines 2086–2121 |
| **Cut** | 2026-08-02, ruled by Amy |
| **Grounds** | Space collision with the hero demo window. The hero already runs a space theme ("Maya, 6, exploring space"). Two space beats in one scroll undermine the infinite-range argument the section exists to make. |
| **Full record** | `morgue/2026-08-02-son-space-panel.html` — screenshot as deployed, frozen markup and styles, standalone render |
| **Sibling that stays** | `.ec-scenario--turtle` — "Your daughter found a turtle in the backyard." Found-object origin, the anti-curriculum proof. Untouched. |

---

## 2. THE STRINGS

Eight ruled strings.

### Headline

> Your son wouldn't stop talking about space.

Source: `<em>Your son wouldn&#8217;t stop talking about space.</em>`
(curly apostrophe as `&#8217;`, wrapped in `<em>` — the panel headline is italic by
class, the `<em>` is structural not decorative.)

### Kicker

> Every subject just found its center of gravity.

Source: `Every subject just found its center of gravity.`

### The six subject lines

Each shipped as a label + body pair. The label is the subject name; the body is
the ruled line. Order is the grid's fill order — down the left column, then down
the right.

| Subject | Line |
|---|---|
| **Reading** | The true story of the Apollo 11 mission. |
| **Math** | How far is the moon? Measure it in school buses. |
| **Science** | Why do astronauts float? What is gravity, really? |
| **Atlas** | Visit Kazakhstan. Find the launchpad where it all started. |
| **Art** | Paint the phases of the moon. Observe tonight, draw tomorrow. |
| **Elementum** | Helium: the element that lifts balloons and powers the sun. |

No entities in any of the six. They are plain ASCII and can be lifted directly.

---

## 3. WHAT ALSO SHIPPED, AND WHAT IT IS

**Eyebrow: "Everything connects."** Not re-filed as a son/space string — it is
the section's shared eyebrow and is still live on the turtle panel. Listed here
only so a future reader knows the panel carried it.

**Photograph: `assets/boy-rocket.jpg`.** Not re-filed and not reusable. It was an
unlicensed Stocksy comp (asset ID `stocksy.com/7751997`, 1200×800, watermark
visible in the deployed crop). Deleted with the cut. If any of this copy is
rebuilt on another surface, it needs a licensed photograph. See section 5 of
`docs/hero-handoff.md` for the swap path pattern.

---

## 4. CONSTRAINT ON REUSE

The grounds for the cut were **placement**, not quality. The strings are ruled
and hold. But the reason they left the homepage travels with them: they are a
space set, and they collide with any surface that already runs a space beat.

**Safe:** ESA pages, retargeting, social — surfaces where this is the only space
theme in view.

**Not safe:** anywhere the hero demo window ("Maya, 6, exploring space") is also
on screen. That is the collision that cut them.

A replacement son panel for the homepage is a **separate future round** with a
**non-space theme**. Its copy goes through the Copy Room first. Do not rebuild
this set onto the homepage.
