/* global React */

// =============================================================
// THE RECORD — Final locked PDF render (v1.3 spec)
// US Letter portrait · 8.5" × 11" @ 96dpi = 816 × 1056
//
// All four passes locked. Every decision documented at the end of
// this file in the LOCKS block, ready for Claude Code handoff.
// =============================================================

const PAGE_W   = 816;
const PAGE_H   = 1056;
const MARGIN_X = 96;       // 1.00" left/right
const MARGIN_T = 88;       // 0.92" top  — pulls header up to optical center
const MARGIN_B = 88;       // 0.92" bottom

const INK     = "#0C1020";
const CHALK   = "#F8F4E9";
const SAFFRON = "#E8AF38";

const INK_45  = "rgba(12,16,32,0.45)";   // IN PROGRESS, Required column, eyebrows
const INK_55  = "rgba(12,16,32,0.55)";   // secondary metadata
const INK_18  = "rgba(12,16,32,0.18)";   // methodology top rule

// ============== Subject palette — Plan-locked Atelier Jewels =================
const SUBJECT_HUES = {
  la:   "#3848D0",   // Lang Ink
  math: "#18A0B8",   // Math Polar
  sci:  "#38B060",   // Sci Malachite
  gh:   "#C83030",   // Geo Vermilion
  ca:   "#8848E0",   // Arts Amethyst
  pe:   "#F08A20",   // PE Ember
  wl:   "#B4B2A9",   // World Languages — placeholder gray
  ls:   "#B4B2A9",   // Life Skills — placeholder gray
};

// ============== Subject rows ================================================
const ROWS = [
  { key: "la",   name: "Language Arts and Reading", logged: 78.5, required: 75.0, status: "MET" },
  { key: "math", name: "Mathematics",               logged: 71.0, required: 75.0, status: "IN PROGRESS" },
  { key: "sci",  name: "Science",                   logged: 52.5, required: 50.0, status: "MET" },
  { key: "gh",   name: "Geography & History",       logged: 48.0, required: 50.0, status: "IN PROGRESS" },
  { key: "ca",   name: "Creative Arts",             logged: 56.0, required: 40.0, status: "MET" },
  { key: "pe",   name: "PE & Health",               logged: 42.5, required: 40.0, status: "MET" },
  { key: "wl",   name: "World Languages",           logged: 38.5, required: 40.0, status: "IN PROGRESS" },
  { key: "ls",   name: "Life Skills",               logged: 34.0, required: 50.0, status: "BEHIND" },
];
const TOTAL_LOGGED   = 421.0;
const TOTAL_REQUIRED = 420.0;

// =============================================================
// HEADLINE NUMBER — Plus Jakarta Sans 500, tabular-lining, 42px
// Pass 1 lock: 42px sits between scan-in-1.2s threshold (≥38px) and
// the editorial-at-display threshold (≥48px) where Plus Jakarta
// loses institutional restraint. 500 reads as transcript;
// 600 read as report. Letter-spacing -0.012em — Plus Jakarta
// at display scale tightens slightly to hold the digit pairs.
// =============================================================
function HeadlineNumber({ value, label }) {
  return (
    <div>
      <div style={{
        fontFamily: "Plus Jakarta Sans, system-ui, sans-serif",
        fontWeight: 500,
        fontSize: 42,
        lineHeight: 1.0,
        letterSpacing: "-0.012em",
        color: INK,
        fontVariantNumeric: "tabular-nums lining-nums",
        fontFeatureSettings: '"tnum" 1, "lnum" 1',
      }}>{value}</div>
      <div style={{
        fontFamily: "Space Mono, monospace",
        fontWeight: 400,
        fontSize: 9,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: INK_55,
        marginTop: 14,   // baseline → cap-height: ~14px reads as architecture
      }}>{label}</div>
    </div>
  );
}

// =============================================================
// STATUS CELL — v1.3 lock
// MET: full ink. IN PROGRESS: ink @45%. BEHIND: full saffron.
// Space Mono 400 across all three — 500 amplifies saffron into alarm
// (Refinement Failure 4); 400 holds saffron as direction.
// =============================================================
function StatusCell({ status }) {
  const base = {
    fontFamily: "Space Mono, monospace",
    fontWeight: 400,
    fontSize: 9.5,
    letterSpacing: "0.20em",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  };
  if (status === "MET")         return <span style={{ ...base, color: INK }}>MET</span>;
  if (status === "IN PROGRESS") return <span style={{ ...base, color: INK_45 }}>IN PROGRESS</span>;
  return <span style={{ ...base, color: SAFFRON }}>BEHIND</span>;
}

// =============================================================
// WORDMARK — Sora 800, K rotated 8°, terminal dot at superscript register
// Pass 3 lock: 15px. The dot sits in superscript register per Light
// Standard v6.2 — its baseline aligns with the cap-height of the base
// letters, putting the dot above x-height in registered-trademark
// register. Matches the canonical wizkoo.com nav-bar wordmark.
//
// "wizkoo" is rendered lowercase per the production reference.
// Sora 800 cap-height ≈ 0.72em. Dot is ~0.30em diameter, with its
// baseline (bottom edge) sitting on the cap-height line — i.e. its
// bottom edge is ~0.72em above the wordmark baseline.
// =============================================================
function Wordmark({ size = 15 }) {
  const dotSize = size * 0.30;
  // Bottom of dot sits at cap-height of base letters.
  // Sora 800 cap-height ≈ 0.72em above baseline.
  const dotBottom = size * 0.72;
  return (
    <span style={{
      fontFamily: "Sora, 'Plus Jakarta Sans', sans-serif",
      fontWeight: 800,
      fontSize: size,
      letterSpacing: "-0.01em",
      lineHeight: 1.0,
      color: INK,
      display: "inline-flex",
      alignItems: "baseline",
      position: "relative",
    }}>
      <span>wiz</span>
      <span style={{
        display: "inline-block",
        color: SAFFRON,
        transform: "rotate(8deg)",
        transformOrigin: "50% 70%",
      }}>k</span>
      <span style={{ position: "relative" }}>
        oo
        <span style={{
          position: "absolute",
          left: "100%",
          bottom: dotBottom,
          marginLeft: 1,
          width: dotSize,
          height: dotSize,
          background: SAFFRON,
          borderRadius: "50%",
        }}/>
      </span>
    </span>
  );
}

// =============================================================
// SUBJECT TABLE — Pass 2 locks
// Row pad 13px. Cols 46/14/14/26. Underline 1px @ 90% saturation
// (resolves swatch-chart failure). Underline 3px below baseline.
// Header 8.5px Space Mono. Subtotal: top rule only at 0.75px.
// Hour values 10.5px Space Mono. Required column @ 45% opacity.
// =============================================================

// 90% saturation lerp toward chalk — one notch off full saturation.
// Resolves the swatch-chart reading at compressed table density.
const lerp90 = (hex) => {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const t = 0.10;
  const lr = Math.round(r + (248 - r) * t);
  const lg = Math.round(g + (244 - g) * t);
  const lb = Math.round(b + (233 - b) * t);
  return `rgb(${lr},${lg},${lb})`;
};

function SubjectCell({ name, hueKey }) {
  const hue = lerp90(SUBJECT_HUES[hueKey]);
  return (
    <span style={{
      display: "inline-flex",
      flexDirection: "column",
      alignItems: "flex-start",
    }}>
      <span style={{
        fontFamily: "Plus Jakarta Sans, system-ui, sans-serif",
        fontWeight: 500,
        fontSize: 12,
        color: INK,
        letterSpacing: "0.005em",
        lineHeight: 1.2,
      }}>{name}</span>
      <span style={{
        height: 1,
        background: hue,
        width: "100%",
        marginTop: 3,         // 3px from baseline reads as architecture
        alignSelf: "stretch", // full-word-width per Plan spec
      }}/>
    </span>
  );
}

function SubjectTable() {
  const headerCell = {
    fontFamily: "Space Mono, monospace",
    fontWeight: 400,
    fontSize: 8.5,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: INK_55,
    paddingTop: 0,
    paddingBottom: 11,
  };
  const numCell = {
    fontFamily: "Space Mono, monospace",
    fontWeight: 400,
    fontSize: 10.5,
    fontVariantNumeric: "tabular-nums lining-nums",
    fontFeatureSettings: '"tnum" 1, "lnum" 1',
    padding: "13px 0",
    textAlign: "right",
  };

  return (
    <table style={{
      width: "100%",
      borderCollapse: "collapse",
      tableLayout: "fixed",
    }}>
      <colgroup>
        <col style={{ width: "46%" }}/>
        <col style={{ width: "14%" }}/>
        <col style={{ width: "14%" }}/>
        <col style={{ width: "26%" }}/>
      </colgroup>
      <thead>
        <tr style={{ borderBottom: `0.75px solid ${INK}` }}>
          <th style={{ ...headerCell, textAlign: "left" }}>Subject of Instruction</th>
          <th style={{ ...headerCell, textAlign: "right" }}>Logged</th>
          <th style={{ ...headerCell, textAlign: "right" }}>Required</th>
          <th style={{ ...headerCell, textAlign: "right" }}>Status</th>
        </tr>
      </thead>
      <tbody>
        {ROWS.map((r) => (
          <tr key={r.key}>
            <td style={{ padding: "13px 0", verticalAlign: "top" }}>
              <SubjectCell name={r.name} hueKey={r.key}/>
            </td>
            <td style={{ ...numCell, color: INK }}>{r.logged.toFixed(1)}</td>
            <td style={{ ...numCell, color: INK_45 }}>{r.required.toFixed(1)}</td>
            <td style={{ padding: "13px 0", textAlign: "right", verticalAlign: "top" }}>
              <span style={{ display: "inline-block", paddingTop: 1 }}>
                <StatusCell status={r.status}/>
              </span>
            </td>
          </tr>
        ))}
        {/* Subtotal row — top rule only at 0.75px. No double rule;
            transcript convention without financial-statement formality. */}
        <tr>
          <td colSpan={4} style={{ padding: 0 }}>
            <div style={{ height: 0.75, background: INK, marginTop: 6 }}/>
          </td>
        </tr>
        <tr>
          <td style={{
            paddingTop: 14,
            fontFamily: "Space Mono, monospace",
            fontWeight: 400,
            fontSize: 8.5,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: INK_55,
            verticalAlign: "top",
          }}>Total Instructional Hours</td>
          <td style={{
            paddingTop: 14, textAlign: "right",
            fontFamily: "Space Mono, monospace",
            fontWeight: 700,
            fontSize: 11.5,
            color: INK,
            fontVariantNumeric: "tabular-nums lining-nums",
            fontFeatureSettings: '"tnum" 1, "lnum" 1',
          }}>{TOTAL_LOGGED.toFixed(1)}</td>
          <td style={{
            paddingTop: 14, textAlign: "right",
            fontFamily: "Space Mono, monospace",
            fontWeight: 400,
            fontSize: 10.5,
            color: INK_45,
            fontVariantNumeric: "tabular-nums lining-nums",
            fontFeatureSettings: '"tnum" 1, "lnum" 1',
          }}>{TOTAL_REQUIRED.toFixed(1)}</td>
          <td/>
        </tr>
      </tbody>
    </table>
  );
}

// =============================================================
// THE RECORD — assembled
// =============================================================
function RecordPDF() {
  return (
    <div style={{
      width: PAGE_W, height: PAGE_H,
      background: CHALK,
      color: INK,
      position: "relative",
      fontFamily: "Plus Jakarta Sans, system-ui, sans-serif",
      boxShadow: "0 24px 60px -20px rgba(12,16,32,0.22)",
    }}>
      <div style={{
        position: "absolute",
        top: MARGIN_T, left: MARGIN_X, right: MARGIN_X, bottom: MARGIN_B,
        display: "flex", flexDirection: "column",
      }}>
        {/* ============ IDENTITY HEADER ============ */}
        {/* Pass 3 lock: top rule 1.5px solid ink (transcript anchor),
            bottom rule 0.5px @ 18% (closing breath, not formal close). */}
        <div>
          <div style={{ height: 1.5, background: INK }}/>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "baseline",
            paddingTop: 14, paddingBottom: 14,
          }}>
            <div>
              <div style={{
                fontFamily: "Space Mono, monospace",
                fontWeight: 400, fontSize: 8,
                letterSpacing: "0.20em", textTransform: "uppercase",
                color: INK_55,
                marginBottom: 6,    // 6px above family name reads as architecture
              }}>Annual Compliance Summary</div>
              <div style={{
                fontFamily: "Plus Jakarta Sans, system-ui, sans-serif",
                fontWeight: 500, fontSize: 13,
                letterSpacing: "0.005em",
                color: INK,
              }}>The Oguntala Family · Georgia</div>
            </div>
            <div style={{
              fontFamily: "Space Mono, monospace",
              fontWeight: 400, fontSize: 9,
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: INK_55,
              fontVariantNumeric: "tabular-nums lining-nums",
            }}>School Year 2025 — 2026</div>
          </div>
          <div style={{ height: 0.5, background: INK_18 }}/>
        </div>

        {/* ============ HEADLINE NUMBERS ============ */}
        {/* Pass 4: 56px above, 56px below — air calibrated so the
            triplet holds the optical center of the upper third. */}
        <div style={{ height: 56 }}/>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          columnGap: 24,
        }}>
          <HeadlineNumber value="421.0" label="Hours Accumulated" />
          <HeadlineNumber value="142"   label="Days Logged" />
          <HeadlineNumber value="38"    label="Days Remaining" />
        </div>
        <div style={{ height: 56 }}/>

        {/* ============ SUBJECT TABLE ============ */}
        <SubjectTable/>

        {/* spacer pushes methodology + footer to page bottom */}
        <div style={{ flex: 1, minHeight: 32 }}/>

        {/* ============ METHODOLOGY ============ */}
        {/* Top rule 0.5px @ 18% — same closing breath as identity bottom. */}
        <div style={{
          borderTop: `0.5px solid ${INK_18}`,
          paddingTop: 14,
          marginBottom: 28,
          maxWidth: "82%",
        }}>
          <div style={{
            fontFamily: "Space Mono, monospace",
            fontWeight: 400, fontSize: 8,
            letterSpacing: "0.20em", textTransform: "uppercase",
            color: INK_55,
            marginBottom: 9,
          }}>Methodology</div>
          <div style={{
            fontFamily: "Space Mono, monospace",
            fontWeight: 400, fontSize: 9,
            lineHeight: 1.65,
            color: INK,
            letterSpacing: "0.005em",
          }}>
            Instructional hours reflect actual time spent on educational activities.
            Activities spanning multiple subjects distribute time proportionally
            across tagged subjects. Total reported hours equal total instructional
            time without duplication.
          </div>
        </div>

        {/* ============ FOOTER — date stamp + wordmark ============ */}
        <div style={{
          display: "flex", alignItems: "flex-end",
          justifyContent: "space-between",
        }}>
          <div style={{
            fontFamily: "Space Mono, monospace",
            fontWeight: 400, fontSize: 9,
            letterSpacing: "0.14em", textTransform: "uppercase",
            color: INK_55,
            fontVariantNumeric: "tabular-nums lining-nums",
          }}>
            Generated May 4, 2026 · 4:37 PM EST
          </div>
          <Wordmark size={15}/>
        </div>
      </div>
    </div>
  );
}

// =============================================================
// LOCKED DECISIONS — for Claude Code handoff
// =============================================================
// PAGE
//   US Letter portrait 816 × 1056 @ 96dpi
//   Margins: 96px L/R (1.00"), 88px T/B (0.92")
//
// SURFACE
//   Background: #F8F4E9 (Warm Chalk)
//   Ink:        #0C1020 (ultramarine ink)
//
// IDENTITY HEADER
//   Top rule:    1.5px solid #0C1020
//   Bottom rule: 0.5px solid rgba(12,16,32,0.18)
//   Eyebrow:     Space Mono 400 / 8px / 0.20em / uppercase / ink @55%
//                "Annual Compliance Summary"
//   Family:      Plus Jakarta Sans 500 / 13px / 0.005em / ink
//                "The Oguntala Family · Georgia"
//   Year:        Space Mono 400 / 9px / 0.18em / uppercase / ink @55% / tabular-lining
//                Right-aligned, baseline-aligned to family name
//   Eyebrow → family vertical: 6px
//   Block padding: 14px top, 14px bottom (between rules)
//
// HEADLINE NUMBERS (3-column grid, 24px column gap)
//   Number:      Plus Jakarta Sans 500 / 42px / line-height 1.0 / -0.012em
//                font-variant-numeric: tabular-nums lining-nums
//   Label:       Space Mono 400 / 9px / 0.18em / uppercase / ink @55%
//   Number → label: 14px (baseline of number → cap-height of label)
//   Vertical air: 56px above, 56px below
//
// SUBJECT TABLE
//   Columns: 46% / 14% / 14% / 26% (Subject / Logged / Required / Status)
//   Row padding: 13px top, 13px bottom
//   Header rule below: 0.75px solid #0C1020
//   Header type: Space Mono 400 / 8.5px / 0.18em / uppercase / ink @55% / 11px bottom pad
//
//   Subject name: Plus Jakarta Sans 500 / 12px / 0.005em / ink
//   Subject underline: 1px solid · 90%-saturated subject hue (lerped toward chalk)
//                      full-word-width · 3px below name baseline
//
//   Logged value:  Space Mono 400 / 10.5px / tabular-lining / ink / right-aligned
//   Required value: Space Mono 400 / 10.5px / tabular-lining / ink @45% / right-aligned
//   Decimal precision: .0 throughout (transcript convention)
//
//   Status cell: Space Mono 400 / 9.5px / 0.20em / uppercase / right-aligned
//     MET         → ink #0C1020 @ 100%
//     IN PROGRESS → ink #0C1020 @ 45%
//     BEHIND      → saffron #E8AF38 @ 100%
//   (Weight 400 across all three — 500 amplifies saffron into alarm.)
//
//   Subtotal: top rule 0.75px solid ink, 6px above, 14px below
//     Label: Space Mono 400 / 8.5px / 0.18em / uppercase / ink @55%
//     Logged total: Space Mono 700 / 11.5px / tabular-lining / ink
//     Required total: Space Mono 400 / 10.5px / tabular-lining / ink @45%
//
// SUBJECT HUES (Plan-locked Atelier Jewels, rendered at 90% saturation)
//   Language Arts and Reading  #3848D0 → rgb(72,75,196)
//   Mathematics                #18A0B8 → rgb(40,164,184)
//   Science                    #38B060 → rgb(80,178,103)
//   Geography & History        #C83030 → rgb(196,69,68)
//   Creative Arts              #8848E0 → rgb(140,77,222)
//   PE & Health                #F08A20 → rgb(238,144,52)
//   World Languages            #B4B2A9 (placeholder, no lerp needed)
//   Life Skills                #B4B2A9 (placeholder, no lerp needed)
//
// METHODOLOGY
//   Top rule: 0.5px solid rgba(12,16,32,0.18)
//   Eyebrow: Space Mono 400 / 8px / 0.20em / uppercase / ink @55%
//   Body: Space Mono 400 / 9px / line-height 1.65 / 0.005em / ink
//   Max-width: 82% of inner page width (legible measure)
//   Eyebrow → body: 9px
//   Block bottom margin: 28px
//
// WORDMARK (footer right) — Light Standard v6.2
//   "wizkoo" lowercase, Sora 800 / 15px / -0.01em / ink
//   K rotated 8° in saffron #E8AF38
//   Terminal dot in saffron, ~0.30em diameter, in superscript register:
//     dot's baseline (bottom edge) aligns with cap-height of base letters
//     (≈ 0.72em above wordmark baseline). Tight to right of second 'o'.
//
// DATE STAMP (footer left, baseline-aligned to wordmark)
//   Space Mono 400 / 9px / 0.14em / uppercase / ink @55% / tabular-lining
//   "Generated [date] · [time] EST"
//
// SAFFRON DISCIPLINE
//   Saffron appears in exactly two places: BEHIND status cell, and the
//   wordmark's K + terminal dot. Nowhere else. No saffron rules, fills,
//   underlines, or decorative marks.
// =============================================================

Object.assign(window, { RecordPDF });
