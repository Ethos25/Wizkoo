/* global React */

// =============================================================
// THE RECORD — Typography Test Sheet
// Pass 1: headline numbers — Fraunces {500, 600, 700} × {36, 42, 48, 54}px
//         × {lining, old-style} figures. 24 triplet renders total.
// Pass 2: subject table — row height × col-ratio × underline weight matrix,
//         plus BEHIND tone candidates.
// Real Warm Chalk surface. Real fonts. Production-scale @ 96dpi.
// =============================================================

const INK = "#0C1020";
const CHALK = "#F8F4E9";
const SAFFRON = "#E8AF38";
const RULE = "#E8E2D4";

const SUBJECT_HUES = {
  la:   "#3848D0",
  math: "#18A0B8",
  sci:  "#38B060",
  gh:   "#C83030",
  ca:   "#8848E0",
  pe:   "#F08A20",
  wl:   "#B4B2A9",
  ls:   "#B4B2A9",
};

// =============================================================
// HEADLINE NUMBER TRIPLET — for testing
// 421 / 142 / 38 across an inline ledger row
// =============================================================
function NumberTriplet({ size, weight, figureStyle, letterSpacing = -0.022 }) {
  const fvs = `"opsz" 144`;
  const fontFeature = figureStyle === "oldstyle"
    ? '"onum" 1, "lnum" 0'
    : '"lnum" 1, "onum" 0';

  const numberStyle = {
    fontFamily: "Fraunces",
    fontWeight: weight,
    fontSize: size,
    lineHeight: 0.95,
    letterSpacing: `${letterSpacing}em`,
    color: INK,
    fontVariationSettings: fvs,
    fontFeatureSettings: fontFeature,
  };
  const labelStyle = {
    fontFamily: "Space Mono", fontWeight: 400,
    fontSize: 9, letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: "rgba(12,16,32,0.55)",
    marginTop: 10,
  };
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      columnGap: 24,
      width: 624,    // production-scale measure (US Letter inner width @ 1" margin)
    }}>
      <div>
        <div style={numberStyle}>421.0</div>
        <div style={labelStyle}>Hours Accumulated</div>
      </div>
      <div>
        <div style={numberStyle}>142</div>
        <div style={labelStyle}>Days Logged</div>
      </div>
      <div>
        <div style={numberStyle}>38</div>
        <div style={labelStyle}>Days Remaining</div>
      </div>
    </div>
  );
}

// One labeled triplet card
function TripletCard({ size, weight, figureStyle }) {
  return (
    <div style={{
      background: CHALK,
      padding: "32px 32px 28px",
      width: 624 + 64,
      borderTop: `0.5px solid ${RULE}`,
    }}>
      <div style={{
        fontFamily: "Space Mono", fontWeight: 400,
        fontSize: 9, letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: "rgba(12,16,32,0.55)",
        marginBottom: 22,
      }}>
        Fraunces {weight} · {size}px · {figureStyle === "oldstyle" ? "Old-style figures" : "Lining figures"}
      </div>
      <NumberTriplet size={size} weight={weight} figureStyle={figureStyle}/>
    </div>
  );
}

// =============================================================
// PASS 1 SHEET — every (weight × size × figure) combination
// =============================================================
function Pass1Sheet() {
  const sizes   = [36, 42, 48, 54];
  const weights = [500, 600, 700];
  const figs    = ["lining", "oldstyle"];

  return (
    <section style={{ width: 624 + 64, background: CHALK }}>
      <SheetHeader
        eyebrow="PASS 1"
        title="Headline numbers"
        body="Three numbers, twelve sizing combinations, both figure styles. Production scale on Warm Chalk. Real Fraunces, opsz 144 throughout."
      />
      {weights.map((w) =>
        figs.map((f) =>
          sizes.map((s) => (
            <TripletCard key={`${w}-${s}-${f}`} size={s} weight={w} figureStyle={f}/>
          ))
        )
      )}
    </section>
  );
}

// =============================================================
// PASS 2 — Subject table matrices
// =============================================================
const TABLE_ROWS = [
  { key: "la",   name: "Language Arts",       logged: 78.5, required: 75.0, status: "MET" },
  { key: "math", name: "Mathematics",         logged: 71.0, required: 75.0, status: "IN PROGRESS" },
  { key: "sci",  name: "Science",             logged: 52.5, required: 50.0, status: "MET" },
  { key: "gh",   name: "Geography & History", logged: 48.0, required: 50.0, status: "IN PROGRESS" },
  { key: "ca",   name: "Creative Arts",       logged: 56.0, required: 40.0, status: "MET" },
  { key: "pe",   name: "PE & Health",         logged: 42.5, required: 40.0, status: "MET" },
  { key: "wl",   name: "World Languages",     logged: 38.5, required: 40.0, status: "IN PROGRESS" },
  { key: "ls",   name: "Life Skills",         logged: 34.0, required: 50.0, status: "BEHIND" },
];

function StatusType({ status, behindHex }) {
  const style = {
    fontFamily: "Space Mono", fontWeight: 400,
    fontSize: 9.5, letterSpacing: "0.22em",
    textTransform: "uppercase", whiteSpace: "nowrap",
  };
  if (status === "MET") return <span style={{ ...style, color: SAFFRON }}>MET</span>;
  if (status === "IN PROGRESS") return <span style={{ ...style, color: "rgba(12,16,32,0.55)" }}>IN PROGRESS</span>;
  return <span style={{ ...style, color: behindHex }}>BEHIND</span>;
}

// One configurable subject table
function SubjectTable({
  rowPad = 13,
  cols = "44/16/16/24",          // subject / logged / required / status percent
  underlineWeight = 1.5,
  underlineWidth = "full",       // 'full' | 'half' | 'tab'
  underlineSatScale = 1,         // 1 = full saturation, 0.9 = -10%, 0.8 = -20%
  behindHex = "#8C6A2E",
  measure = 624,
}) {
  const [c1, c2, c3, c4] = cols.split("/").map(Number);

  const headerCell = {
    fontFamily: "Space Mono", fontWeight: 400,
    fontSize: 9, letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: "rgba(12,16,32,0.55)",
    paddingBottom: 10,
  };

  // Saturation scaling: convert hex → rgba and lerp toward chalk
  const lerpToChalk = (hex, sat) => {
    if (sat === 1) return hex;
    const h = hex.replace("#","");
    const r = parseInt(h.slice(0,2),16);
    const g = parseInt(h.slice(2,4),16);
    const b = parseInt(h.slice(4,6),16);
    // lerp toward chalk #F8F4E9 = (248, 244, 233)
    const t = 1 - sat;
    const lr = Math.round(r + (248 - r) * t);
    const lg = Math.round(g + (244 - g) * t);
    const lb = Math.round(b + (233 - b) * t);
    return `rgb(${lr},${lg},${lb})`;
  };

  return (
    <table style={{
      width: measure, borderCollapse: "collapse",
      fontFamily: "Plus Jakarta Sans",
      tableLayout: "fixed",
    }}>
      <colgroup>
        <col style={{ width: `${c1}%` }}/>
        <col style={{ width: `${c2}%` }}/>
        <col style={{ width: `${c3}%` }}/>
        <col style={{ width: `${c4}%` }}/>
      </colgroup>
      <thead>
        <tr style={{ borderBottom: `1px solid ${INK}` }}>
          <th style={{ ...headerCell, textAlign: "left"  }}>Subject</th>
          <th style={{ ...headerCell, textAlign: "right" }}>Logged</th>
          <th style={{ ...headerCell, textAlign: "right" }}>Required</th>
          <th style={{ ...headerCell, textAlign: "right" }}>Status</th>
        </tr>
      </thead>
      <tbody>
        {TABLE_ROWS.map((r) => {
          const hue = lerpToChalk(SUBJECT_HUES[r.key], underlineSatScale);
          return (
            <tr key={r.key}>
              <td style={{ padding: `${rowPad}px 0` }}>
                <span style={{
                  fontFamily: "Plus Jakarta Sans", fontWeight: 500,
                  fontSize: 12, color: INK, letterSpacing: "0.005em",
                  display: "inline-flex", flexDirection: "column",
                  alignItems: "flex-start",
                }}>
                  <span>{r.name}</span>
                  <span style={{
                    height: underlineWeight,
                    background: hue,
                    width: underlineWidth === "full" ? "100%" :
                           underlineWidth === "half" ? "50%" : 24,
                    marginTop: 3,
                    alignSelf: "stretch",
                    ...(underlineWidth === "full" ? {} : { alignSelf: "flex-start" }),
                  }}/>
                </span>
              </td>
              <td style={{
                padding: `${rowPad}px 0`, textAlign: "right",
                fontFamily: "Space Mono", fontWeight: 400,
                fontSize: 11, color: INK,
                fontVariantNumeric: "tabular-nums",
              }}>{r.logged.toFixed(1)}</td>
              <td style={{
                padding: `${rowPad}px 0`, textAlign: "right",
                fontFamily: "Space Mono", fontWeight: 400,
                fontSize: 11, color: "rgba(12,16,32,0.55)",
                fontVariantNumeric: "tabular-nums",
              }}>{r.required.toFixed(1)}</td>
              <td style={{
                padding: `${rowPad}px 0`, textAlign: "right",
              }}>
                <StatusType status={r.status} behindHex={behindHex}/>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function TableCard({ note, children }) {
  return (
    <div style={{ background: CHALK, padding: "30px 32px 36px", borderTop: `0.5px solid ${RULE}` }}>
      <div style={{
        fontFamily: "Space Mono", fontWeight: 400,
        fontSize: 9, letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: "rgba(12,16,32,0.55)",
        marginBottom: 24,
      }}>{note}</div>
      {children}
    </div>
  );
}

function Pass2Sheet() {
  return (
    <section style={{ width: 624 + 64, background: CHALK }}>
      <SheetHeader
        eyebrow="PASS 2"
        title="Subject table"
        body="Row height, column ratios, underline weight, underline saturation, and BEHIND tone — tested in isolation and combination."
      />

      {/* ---------- Row height ---------- */}
      <SubsectionHeader title="A. Row height" subtitle="11px / 13px / 15px vertical padding" />

      <TableCard note="A1 · 11px row pad">
        <SubjectTable rowPad={11}/>
      </TableCard>
      <TableCard note="A2 · 13px row pad (working draft)">
        <SubjectTable rowPad={13}/>
      </TableCard>
      <TableCard note="A3 · 15px row pad">
        <SubjectTable rowPad={15}/>
      </TableCard>

      {/* ---------- Column widths ---------- */}
      <SubsectionHeader title="B. Column widths" subtitle="Subject / Logged / Required / Status" />

      <TableCard note="B1 · 50 / 14 / 14 / 22">
        <SubjectTable cols="50/14/14/22"/>
      </TableCard>
      <TableCard note="B2 · 44 / 16 / 16 / 24 (working draft)">
        <SubjectTable cols="44/16/16/24"/>
      </TableCard>
      <TableCard note="B3 · 40 / 18 / 18 / 24">
        <SubjectTable cols="40/18/18/24"/>
      </TableCard>

      {/* ---------- Underline weight ---------- */}
      <SubsectionHeader title="C. Underline weight" subtitle="0.75px / 1px / 1.5px" />

      <TableCard note="C1 · 0.75px underline">
        <SubjectTable underlineWeight={0.75}/>
      </TableCard>
      <TableCard note="C2 · 1px underline">
        <SubjectTable underlineWeight={1}/>
      </TableCard>
      <TableCard note="C3 · 1.5px underline (Plan spec)">
        <SubjectTable underlineWeight={1.5}/>
      </TableCard>

      {/* ---------- Underline saturation (swatch-chart resolution) ---------- */}
      <SubsectionHeader
        title="D. Underline saturation"
        subtitle="Swatch-chart failure-mode resolution. Full / 90% / 80% saturation against chalk."
      />

      <TableCard note="D1 · 100% saturation, 1px">
        <SubjectTable underlineWeight={1} underlineSatScale={1}/>
      </TableCard>
      <TableCard note="D2 · 90% saturation, 1px">
        <SubjectTable underlineWeight={1} underlineSatScale={0.9}/>
      </TableCard>
      <TableCard note="D3 · 80% saturation, 1px">
        <SubjectTable underlineWeight={1} underlineSatScale={0.8}/>
      </TableCard>

      {/* ---------- BEHIND tone ---------- */}
      <SubsectionHeader
        title="E. BEHIND tone"
        subtitle="Attention without alarm. Three candidates."
      />

      <TableCard note="E1 · #8A4838 burnt sienna">
        <SubjectTable behindHex="#8A4838"/>
      </TableCard>
      <TableCard note="E2 · #B86850 deepened terracotta (Light Standard reserve dusty accent)">
        <SubjectTable behindHex="#B86850"/>
      </TableCard>
      <TableCard note="E3 · #C83030 muted vermilion @ 60% opacity">
        <SubjectTable behindHex="rgba(200,48,48,0.60)"/>
      </TableCard>
      <TableCard note="E4 · #8C6A2E muted warm (working draft, for comparison)">
        <SubjectTable behindHex="#8C6A2E"/>
      </TableCard>

    </section>
  );
}

// =============================================================
// SHEET FRAME — header per pass
// =============================================================
function SheetHeader({ eyebrow, title, body }) {
  return (
    <div style={{
      background: CHALK,
      padding: "56px 32px 36px",
    }}>
      <div style={{
        fontFamily: "Space Mono", fontWeight: 400,
        fontSize: 9, letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: "rgba(12,16,32,0.55)",
        marginBottom: 14,
      }}>{eyebrow}</div>
      <div style={{
        fontFamily: "Fraunces", fontWeight: 500, fontStyle: "italic",
        fontSize: 36, lineHeight: 1.05,
        letterSpacing: "-0.018em",
        color: INK,
        fontVariationSettings: '"opsz" 144',
        marginBottom: 14,
      }}>{title}</div>
      <div style={{
        fontFamily: "Plus Jakarta Sans", fontWeight: 400,
        fontSize: 13, lineHeight: 1.55,
        color: "rgba(12,16,32,0.75)",
        maxWidth: 560,
      }}>{body}</div>
    </div>
  );
}

function SubsectionHeader({ title, subtitle }) {
  return (
    <div style={{
      background: CHALK, padding: "36px 32px 12px",
      borderTop: `1px solid ${INK}`,
    }}>
      <div style={{
        fontFamily: "Plus Jakarta Sans", fontWeight: 600,
        fontSize: 13, color: INK, letterSpacing: "0.01em",
        marginBottom: 4,
      }}>{title}</div>
      <div style={{
        fontFamily: "Space Mono", fontWeight: 400,
        fontSize: 9, letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: "rgba(12,16,32,0.55)",
      }}>{subtitle}</div>
    </div>
  );
}

// =============================================================
// CONTACT SHEET WRAPPER
// =============================================================
function TestSheet() {
  return (
    <div style={{
      background: "#2a2926",
      minHeight: "100vh",
      padding: "60px 0 120px",
      display: "flex", flexDirection: "column",
      alignItems: "center", gap: 64,
    }}>
      {/* Cover */}
      <div style={{
        background: CHALK,
        width: 624 + 64,
        padding: "72px 32px 60px",
      }}>
        <div style={{
          fontFamily: "Space Mono", fontWeight: 400,
          fontSize: 9, letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(12,16,32,0.55)",
          marginBottom: 16,
        }}>The Record · Refinement</div>
        <div style={{
          fontFamily: "Fraunces", fontWeight: 500, fontStyle: "italic",
          fontSize: 56, lineHeight: 1.0,
          letterSpacing: "-0.022em",
          color: INK,
          fontVariationSettings: '"opsz" 144',
          marginBottom: 24,
          maxWidth: 560,
        }}>Typography test sheet.</div>
        <div style={{
          fontFamily: "Plus Jakarta Sans", fontWeight: 400,
          fontSize: 14, lineHeight: 1.55,
          color: "rgba(12,16,32,0.78)",
          maxWidth: 560,
        }}>
          Pass 1 — headline numbers across weight × size × figure-style. Pass 2 — subject table across row-height, column-width, underline weight, underline saturation, and BEHIND tone. Production scale on Warm Chalk. Real fonts. Diagnose, lock, advance.
        </div>
      </div>

      <Pass1Sheet />
      <Pass2Sheet />
    </div>
  );
}

Object.assign(window, { TestSheet });
