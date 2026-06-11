/* global React */

// =============================================================
// Print card + Note card shared chrome (used by all four directions)
// =============================================================

function PrintCard({ children }) {
  return (
    <div style={{
      width: 460,
      minHeight: 380,
      background: "#FAFAFA",
      padding: "24px 28px 28px",
      fontFamily: "Plus Jakarta Sans",
      boxShadow: "0 1px 0 rgba(0,0,0,0.04), 0 12px 28px -16px rgba(0,0,0,0.25)",
      position: "relative",
    }}>
      {/* Trim corners */}
      <Trim pos={{ top: 8, left: 8 }} dir="tl"/>
      <Trim pos={{ top: 8, right: 8 }} dir="tr"/>
      <Trim pos={{ bottom: 8, left: 8 }} dir="bl"/>
      <Trim pos={{ bottom: 8, right: 8 }} dir="br"/>
      {children}
    </div>
  );
}

function Trim({ pos, dir }) {
  const len = 8;
  const c = "#C8C5BC";
  const styles = { position: "absolute", ...pos };
  const horiz = { width: len, height: 1, background: c };
  const vert = { width: 1, height: len, background: c };
  return (
    <>
      <span style={{ ...styles, ...horiz }}/>
      <span style={{ ...styles, ...vert }}/>
    </>
  );
}

function PrintHeader() {
  return (
    <div>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        fontFamily: "Space Mono",
        fontSize: 9,
        letterSpacing: "0.20em",
        color: "#8C91A5",
        textTransform: "uppercase",
      }}>
        <span>BLOCK 03 · TUESDAY</span>
        <span>WEEK 16 · BRIDGES &amp; ENGINEERING</span>
      </div>
      <div style={{
        marginTop: 6,
        fontFamily: "Fraunces",
        fontStyle: "italic",
        fontWeight: 400,
        fontSize: 26,
        letterSpacing: "-0.018em",
        color: "var(--ink)",
        lineHeight: 1.05,
      }}>
        Bridge Architecture Lab
      </div>
      <div style={{ marginTop: 8, height: 1, background: "#0C1020" }}/>
      <div style={{
        marginTop: 6,
        fontFamily: "Space Mono",
        fontSize: 9,
        letterSpacing: "0.20em",
        color: "#8C91A5",
        textTransform: "uppercase",
      }}>
        STEP 01 OF 03  ·  MATERIALS & SETUP TO LEFT
      </div>
    </div>
  );
}

// ---------- Note card (right-side analysis on each artboard row) ----------
function NoteCard({ persona, title, move, bullets }) {
  return (
    <div style={{
      width: 520,
      background: "#F8F4E9",
      padding: "26px 28px 28px",
      fontFamily: "Plus Jakarta Sans",
      color: "var(--ink)",
      borderLeft: "1px solid #E0DED6",
    }}>
      <div style={{
        fontFamily: "Space Mono",
        fontSize: 10,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: "#8C91A5",
      }}>
        PERSONA · {persona}
      </div>
      <h2 style={{
        margin: "8px 0 0",
        fontFamily: "Fraunces",
        fontStyle: "italic",
        fontWeight: 500,
        fontSize: 30,
        letterSpacing: "-0.018em",
        lineHeight: 1.05,
        color: "var(--ink)",
      }}>
        {title}
      </h2>
      <div style={{
        marginTop: 14,
        fontFamily: "Plus Jakarta Sans",
        fontWeight: 400,
        fontSize: 14,
        lineHeight: 1.5,
        color: "var(--mid)",
        letterSpacing: "-0.003em",
        textWrap: "pretty",
      }}>
        <strong style={{ color: "var(--ink)", fontWeight: 600 }}>The move.</strong>{" "}
        {move}
      </div>

      <div style={{
        marginTop: 18,
        borderTop: "1px solid #E0DED6",
      }}>
        {bullets.map(([label, body], i) => (
          <div key={i} style={{
            padding: "12px 0",
            borderBottom: i === bullets.length - 1 ? "none" : "1px solid #ECE7DA",
            display: "grid",
            gridTemplateColumns: "112px 1fr",
            columnGap: 14,
            alignItems: "baseline",
          }}>
            <span style={{
              fontFamily: "Space Mono",
              fontSize: 9,
              letterSpacing: "0.20em",
              textTransform: "uppercase",
              color: "#8C91A5",
              paddingTop: 2,
            }}>
              {label}
            </span>
            <span style={{
              fontFamily: "Plus Jakarta Sans",
              fontWeight: 400,
              fontSize: 12.5,
              lineHeight: 1.5,
              color: "var(--ink)",
              letterSpacing: "-0.003em",
              textWrap: "pretty",
            }}>
              {body}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { PrintCard, PrintHeader, NoteCard });
