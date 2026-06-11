/* global React, PRINT, Masthead, Footer, TrimCorners */

// =============================================================
// THE BLOCK SHEET — portrait US Letter
// One page per block. The masthead carries the block index, the
// day, the Fraunces italic block name, and a small completion
// checkbox in the upper right.
//
// Body sequence:
//   1. Materials for this block (small list, checkboxes)
//   2. Setup (one short paragraph)
//   3. Numbered steps with per-child notes inline at each step
//   4. Per-child early finisher options
//
// The structure is the same step sequence as the digital Block
// View, but per-child detail is printed in full (paper has no
// expand affordance).
// =============================================================

// Children's names render in plain ultramarine ink, matching the digital
// surfaces. Subject is the only thing color-keyed in the system; per-child
// color was an experiment that wasn't already part of the design language,
// so it's cut from print rather than introduced as a new system.

function BlockSheet() {
  const w = PRINT.week;
  const b = PRINT.block;

  return (
    <div className="sheet portrait">
      <TrimCorners />
      <div className="live">
        <Masthead
          artifactLabel={`${b.indexLabel} · ${b.day}`}
          fraunces={null}
          below={
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              alignItems: "flex-end",
              columnGap: 24,
              marginTop: 6,
            }}>
              <div>
                <div style={{
                  fontFamily: "var(--fr)",
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: 36,
                  letterSpacing: "-0.018em",
                  color: "var(--ink)",
                  lineHeight: 1.05,
                  textWrap: "balance",
                }}>
                  {b.name}
                </div>
                <div style={{
                  marginTop: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  flexWrap: "wrap",
                }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <span className={`dot dot-${b.subject}`} />
                    <span className="mono-print" style={{ color: "var(--ink)" }}>{b.subjectLabel}</span>
                  </span>
                  <span style={{ color: "var(--rule-strong)" }}>·</span>
                  <span className="mono-print">{b.duration} MIN</span>
                  <span style={{ color: "var(--rule-strong)" }}>·</span>
                  <span style={{
                    fontFamily: "var(--pjs)",
                    fontStyle: "italic",
                    fontSize: 11.5,
                    color: "var(--mid)",
                  }}>
                    {b.modifier}
                  </span>
                  <span style={{ color: "var(--rule-strong)" }}>·</span>
                  <span style={{
                    fontFamily: "var(--pjs)",
                    fontSize: 11.5,
                    color: "var(--meta)",
                  }}>
                    from <em style={{ fontFamily: "var(--fr)", fontStyle: "italic" }}>{b.cluster}</em>
                  </span>
                </div>
              </div>

              {/* Completion checkbox */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                paddingBottom: 4,
              }}>
                <span className="box lg" style={{ width: 22, height: 22 }} />
                <span className="mono-print" style={{ fontSize: 8 }}>DONE</span>
              </div>
            </div>
          }
          family={PRINT.family}
          generated={PRINT.generated}
          marker={`WEEK ${w.number} · ${w.theme.toUpperCase()}`}
        />

        {/* Two-column layout under the header — materials/setup left, steps right */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "200px 1fr",
          columnGap: 28,
          marginTop: 24,
          flexGrow: 1,
        }}>
          {/* LEFT — materials + setup */}
          <aside>
            <BlockMaterials items={b.materials} />
            <BlockSetup body={b.setup} />
          </aside>

          {/* RIGHT — steps + early finishers */}
          <main>
            <BlockSteps steps={b.steps} />
            <EarlyFinishers list={b.earlyFinishers} />
          </main>
        </div>

        <Footer pace={w.pace} />
      </div>
    </div>
  );
}

function BlockMaterials({ items }) {
  return (
    <section>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        marginBottom: 8,
      }}>
        <span className="mono-print" style={{ color: "var(--ink)" }}>MATERIALS</span>
        <span className="mono-print">{items.length}</span>
      </div>
      <hr className="rule-strong" />
      <div style={{ marginTop: 4 }}>
        {items.map((it, i) => (
          <div key={i} style={{
            padding: "6px 0",
            display: "grid",
            gridTemplateColumns: "16px 1fr",
            columnGap: 8,
            alignItems: "baseline",
            borderBottom: i === items.length - 1 ? "none" : "1px solid var(--rule-faint)",
          }}>
            <span className="box xs" />
            <span style={{
              fontFamily: "var(--pjs)",
              fontWeight: 400,
              fontSize: 11.5,
              color: "var(--ink)",
              letterSpacing: "-0.003em",
              lineHeight: 1.35,
            }}>
              {it}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function BlockSetup({ body }) {
  return (
    <section style={{ marginTop: 22 }}>
      <span className="mono-print" style={{ color: "var(--ink)" }}>SETUP</span>
      <hr className="rule-strong" style={{ marginTop: 8 }} />
      <p style={{
        margin: "10px 0 0",
        fontFamily: "var(--pjs)",
        fontWeight: 400,
        fontSize: 11.5,
        color: "var(--ink)",
        lineHeight: 1.5,
        letterSpacing: "-0.003em",
        textWrap: "pretty",
      }}>
        {body}
      </p>
    </section>
  );
}

function BlockSteps({ steps }) {
  return (
    <section>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        marginBottom: 8,
      }}>
        <span className="mono-print" style={{ color: "var(--ink)" }}>THE ACTIVITY</span>
        <span className="mono-print">{steps.length} STEPS</span>
      </div>
      <hr className="rule-strong" />

      <div>
        {steps.map((s) => <Step key={s.n} s={s} />)}
      </div>
    </section>
  );
}

function Step({ s }) {
  return (
    <article style={{
      padding: "16px 0",
      borderBottom: "1px solid var(--rule)",
      display: "grid",
      gridTemplateColumns: "44px 1fr",
      columnGap: 14,
      alignItems: "flex-start",
    }}>
      <div style={{
        fontFamily: "var(--mono)",
        fontSize: 22,
        color: "var(--ink)",
        letterSpacing: "0",
        lineHeight: 1,
        paddingTop: 2,
      }}>
        {String(s.n).padStart(2, "0")}
      </div>
      <div>
        <div style={{
          fontFamily: "var(--pjs)",
          fontWeight: 500,
          fontSize: 14,
          color: "var(--ink)",
          letterSpacing: "-0.005em",
          marginBottom: 6,
          textWrap: "balance",
        }}>
          {s.title}
        </div>
        <p style={{
          margin: "0 0 10px",
          fontFamily: "var(--pjs)",
          fontWeight: 400,
          fontSize: 11.5,
          color: "var(--ink)",
          lineHeight: 1.5,
          letterSpacing: "-0.003em",
          textWrap: "pretty",
        }}>
          {parseEm(s.body)}
        </p>

        {/* per-child notes — small, indented, color-keyed by name */}
        <div style={{ display: "grid", rowGap: 4 }}>
          {s.perChild.map((p, i) => (
            <div key={i} style={{
              display: "grid",
              gridTemplateColumns: "60px 1fr",
              columnGap: 10,
              alignItems: "baseline",
            }}>
              <span style={{
                fontFamily: "var(--pjs)",
                fontStyle: "italic",
                fontWeight: 500,
                fontSize: 11,
                color: "var(--ink)",
                letterSpacing: "-0.003em",
              }}>
                {p.kid}
              </span>
              <span style={{
                fontFamily: "var(--pjs)",
                fontWeight: 400,
                fontSize: 11,
                color: "var(--mid)",
                lineHeight: 1.4,
                letterSpacing: "-0.003em",
                textWrap: "pretty",
              }}>
                {parseEm(p.note)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function EarlyFinishers({ list }) {
  return (
    <section style={{ marginTop: 16 }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        marginBottom: 8,
      }}>
        <span className="mono-print" style={{ color: "var(--ink)" }}>IF SOMEONE FINISHES EARLY</span>
        <span className="mono-print">{list.length}</span>
      </div>
      <hr className="rule-strong" />

      <div style={{ marginTop: 6 }}>
        {list.map((p, i) => (
          <div key={i} style={{
            padding: "7px 0",
            borderBottom: i === list.length - 1 ? "none" : "1px solid var(--rule-faint)",
            display: "grid",
            gridTemplateColumns: "60px 1fr 16px",
            columnGap: 10,
            alignItems: "baseline",
          }}>
            <span style={{
              fontFamily: "var(--pjs)",
              fontStyle: "italic",
              fontWeight: 500,
              fontSize: 11,
              color: "var(--ink)",
            }}>
              {p.kid}
            </span>
            <span style={{
              fontFamily: "var(--pjs)",
              fontWeight: 400,
              fontSize: 11.5,
              color: "var(--ink)",
              lineHeight: 1.45,
              letterSpacing: "-0.003em",
              textWrap: "pretty",
            }}>
              {p.note}
            </span>
            <span className="box xs" style={{ justifySelf: "end" }} />
          </div>
        ))}
      </div>
    </section>
  );
}

// Tiny markdown-ish parser for *italics* — used in step bodies and per-child notes.
function parseEm(s) {
  const parts = s.split(/(\*[^*]+\*)/g).filter(Boolean);
  return parts.map((p, i) =>
    p.startsWith("*") && p.endsWith("*")
      ? <em key={i} style={{ fontFamily: "var(--fr)", fontStyle: "italic", fontSize: "1.02em" }}>{p.slice(1, -1)}</em>
      : <React.Fragment key={i}>{p}</React.Fragment>
  );
}

Object.assign(window, { BlockSheet });
