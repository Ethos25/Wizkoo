/* global React, PRINT, Masthead, Footer, TrimCorners */

// =============================================================
// THE MATERIALS MASTER — portrait US Letter
// Two-column body. Sections by location: Kitchen, Craft drawer,
// Library, Outdoors, To acquire. Each item has a small empty
// checkbox. To-acquire items have a "where" suffix.
//
// "Notes for the week" lives at the bottom, full-width, above
// the footer. Each note is preceded by its cluster name in
// small mono (so the parent can map the note back to the
// cluster it originated in).
// =============================================================

function MaterialsMaster() {
  const w = PRINT.week;
  // Distribute sections across two columns. Kitchen + Craft drawer
  // are the heaviest, so they each get their own column space.
  // Library, Outdoors, To acquire stack in the right column.
  const left  = [PRINT.materials[0], PRINT.materials[1]];                          // KITCHEN, CRAFT DRAWER
  const right = [PRINT.materials[2], PRINT.materials[3], PRINT.materials[4]];      // LIBRARY, OUTDOORS, TO ACQUIRE

  return (
    <div className="sheet portrait">
      <TrimCorners />
      <div className="live">
        <Masthead
          artifactLabel="THE MATERIALS MASTER"
          fraunces={null}
          below={
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}>
              <span style={{
                fontFamily: "var(--fr)",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: 22,
                letterSpacing: "-0.012em",
                color: "var(--ink)",
              }}>
                Everything you need this week
              </span>
              <span className="mono-print">
                WEEK {w.number} · {totalItems()} ITEMS
              </span>
            </div>
          }
          family={PRINT.family}
          generated={PRINT.generated}
          marker="ONE PAGE · KITCHEN · CRAFT DRAWER · LIBRARY"
        />

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          columnGap: 36,
          marginTop: 22,
          flexGrow: 1,
        }}>
          <div>{left.map(s => <MaterialsSection key={s.location} section={s} />)}</div>
          <div>{right.map(s => <MaterialsSection key={s.location} section={s} />)}</div>
        </div>

        <NotesForTheWeek />

        <Footer pace={w.pace} />
      </div>
    </div>
  );
}

function MaterialsSection({ section }) {
  return (
    <section style={{ marginBottom: 22 }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        marginBottom: 8,
      }}>
        <span className="mono-print" style={{ color: "var(--ink)" }}>
          {section.location}
        </span>
        <span className="mono-print">
          {section.items.length} ITEMS
        </span>
      </div>
      <hr className="rule-strong" />

      <div style={{ marginTop: 4 }}>
        {section.items.map((item, i) => (
          <MaterialsItem key={i} item={item} isLast={i === section.items.length - 1} />
        ))}
      </div>

      {section.notes && (
        <div style={{ marginTop: 8 }}>
          {section.notes.map((n, i) => (
            <div key={i} style={{
              fontFamily: "var(--pjs)",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: 11,
              color: "var(--meta)",
              paddingLeft: 22,
            }}>
              — {n}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function MaterialsItem({ item, isLast }) {
  const isObj = typeof item === "object";
  const text = isObj ? item.text : item;
  const where = isObj ? item.where : null;
  // Render markdown-ish *italics* tokens for book titles
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean);
  return (
    <div style={{
      padding: "7px 0",
      borderBottom: isLast ? "none" : "1px solid var(--rule-faint)",
      display: "grid",
      gridTemplateColumns: "16px 1fr auto",
      columnGap: 10,
      alignItems: "baseline",
    }}>
      <span className="box" style={{ marginTop: 1 }} />
      <span style={{
        fontFamily: "var(--pjs)",
        fontWeight: 400,
        fontSize: 12,
        color: "var(--ink)",
        letterSpacing: "-0.003em",
        lineHeight: 1.4,
      }}>
        {parts.map((p, i) =>
          p.startsWith("*") && p.endsWith("*")
            ? <em key={i} style={{ fontFamily: "var(--fr)", fontStyle: "italic" }}>{p.slice(1, -1)}</em>
            : <React.Fragment key={i}>{p}</React.Fragment>
        )}
      </span>
      {where && (
        <span style={{
          fontFamily: "var(--mono)",
          fontSize: 8.5,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--meta)",
          whiteSpace: "nowrap",
          alignSelf: "center",
        }}>
          {where}
        </span>
      )}
    </div>
  );
}

function NotesForTheWeek() {
  return (
    <section style={{ marginTop: 14 }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        marginBottom: 8,
      }}>
        <span className="mono-print" style={{ color: "var(--ink)" }}>
          NOTES FOR THE WEEK
        </span>
        <span className="mono-print">
          {PRINT.notes.length} NOTES
        </span>
      </div>
      <hr className="rule-strong" />

      <div style={{ marginTop: 8 }}>
        {PRINT.notes.map((n, i) => (
          <div key={i} style={{
            padding: "9px 0",
            borderBottom: i === PRINT.notes.length - 1 ? "none" : "1px dotted var(--rule)",
            display: "grid",
            gridTemplateColumns: "200px 1fr",
            columnGap: 16,
            alignItems: "baseline",
          }}>
            <span className="mono-print" style={{ color: "var(--ink)" }}>
              {n.cluster}
            </span>
            <span style={{
              fontFamily: "var(--pjs)",
              fontWeight: 400,
              fontSize: 12,
              color: "var(--ink)",
              lineHeight: 1.45,
              letterSpacing: "-0.003em",
              textWrap: "pretty",
            }}>
              {n.text}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function totalItems() {
  return PRINT.materials.reduce((n, s) => n + s.items.length, 0);
}

Object.assign(window, { MaterialsMaster });
