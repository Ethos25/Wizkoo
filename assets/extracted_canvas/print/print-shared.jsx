/* global React, PRINT */

// =============================================================
// Shared masthead — used by all three print artifacts. The
// digital planetarium band's job (anchor the surface, name the
// week, locate the brand) translated to paper as a typographic
// header with the Wizkoo wordmark, the artifact's metadata,
// and a hairline rule below.
//
// Slots:
//   variant   "left" / "center" — affects how the artifact label
//             is positioned. Default "left".
//   left      Wordmark always sits here.
//   center    Optional Fraunces moment (Week Sheet, Block Sheet).
//   right     Always carries the audit-trail line: family name +
//             generated date + small artifact-specific marker.
//   below     Sub-line under the masthead (the brand-voice line
//             for Week Sheet, the artifact name for Materials,
//             the metadata trio for Block Sheet).
// =============================================================

function Masthead({ artifactLabel, fraunces, below, family, generated, marker }) {
  return (
    <div style={{ flexShrink: 0 }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "baseline",
        columnGap: 24,
      }}>
        {/* left — wordmark + artifact label */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
          <span className="wordmark">Wizkoo</span>
          <span className="mono-print" style={{ color: "var(--meta)" }}>
            {artifactLabel}
          </span>
        </div>

        {/* center — Fraunces moment (optional) */}
        <div style={{ textAlign: "center" }}>
          {fraunces && (
            <span style={{
              fontFamily: "var(--fr)",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: 18,
              letterSpacing: "-0.01em",
              color: "var(--ink)",
              whiteSpace: "nowrap",
            }}>
              {fraunces}
            </span>
          )}
        </div>

        {/* right — audit trail + marker */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 2,
        }}>
          <span className="mono-print">{marker}</span>
          <span style={{
            fontFamily: "var(--pjs)",
            fontWeight: 400,
            fontSize: 10,
            color: "var(--meta)",
            fontStyle: "italic",
          }}>
            {family} · generated {generated}
          </span>
        </div>
      </div>

      <hr className="rule-strong" style={{ marginTop: 12 }} />

      {below && (
        <div style={{ marginTop: 10 }}>
          {below}
        </div>
      )}
    </div>
  );
}

function Footer({ pace }) {
  return (
    <div style={{ flexShrink: 0, paddingTop: 12, marginTop: "auto" }}>
      <hr className="rule" />
      <div style={{
        marginTop: 10,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <span className="mono-print">{pace}</span>
        <span className="mono-print">Wizkoo · The Plan</span>
      </div>
    </div>
  );
}

// Trim corners — quiet hairline corner ticks. Same on every sheet.
function TrimCorners() {
  return (
    <>
      <span className="trim tl" />
      <span className="trim tr" />
      <span className="trim bl" />
      <span className="trim br" />
    </>
  );
}

Object.assign(window, { Masthead, Footer, TrimCorners });
