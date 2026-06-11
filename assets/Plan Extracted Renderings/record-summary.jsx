/* global React */

// =============================================================
// THE RECORD — In-app surfaces
// 390px phone viewport. Inherits Recap For You register:
//   warm-tinted surface #F2EBDA, eyebrow w/ privacy marker,
//   Fraunces 600 headline numbers, scannable diagnostic in 3 seconds.
// =============================================================

const INK     = "#0C1020";
const CHALK   = "#F8F4E9";
const TINT    = "#F2EBDA";  // For You warm tint
const SAFFRON = "#E8AF38";
const RULE    = "#E8E2D4";
const INK_55  = "rgba(12,16,32,0.55)";
const INK_70  = "rgba(12,16,32,0.70)";
const BEHIND  = "#8A4838";

const HUE = { la:"#3848D0", math:"#18A0B8", sci:"#38B060", gh:"#C83030",
              ca:"#8848E0", pe:"#F08A20",  wl:"#B4B2A9",  ls:"#B4B2A9" };

// 90% saturation against chalk — locked Pass 2 D2
const desat = (hex, surface = "248,244,233") => {
  const h = hex.replace("#","");
  const r = parseInt(h.slice(0,2),16), g = parseInt(h.slice(2,4),16), b = parseInt(h.slice(4,6),16);
  const [sr, sg, sb] = surface.split(",").map(Number);
  const t = 0.10;
  return `rgb(${Math.round(r+(sr-r)*t)},${Math.round(g+(sg-g)*t)},${Math.round(b+(sb-b)*t)})`;
};

// Atelier Jewels (per-child)
const KIDS = {
  leo:  { initial: "L", rest: "eo",  fill: "#5A2030" },
  max:  { initial: "M", rest: "ax",  fill: "#1F4E3D" },
  jack: { initial: "J", rest: "ack", fill: "#1F3858" },
  jane: { initial: "J", rest: "ane", fill: "#C09444" },
};

// =============================================================
// SHARED CHROME — phone status bar + tab strip (THE RECORD active)
// =============================================================
function StatusBar() {
  return (
    <div style={{
      height: 44, paddingLeft: 32, paddingRight: 28,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      fontFamily: "Plus Jakarta Sans", fontWeight: 600, fontSize: 13,
      color: INK,
    }}>
      <div>9:47</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 1.5, height: 10 }}>
          <div style={{ width: 3, height: 4,  background: INK, borderRadius: 0.5 }}/>
          <div style={{ width: 3, height: 6,  background: INK, borderRadius: 0.5 }}/>
          <div style={{ width: 3, height: 8,  background: INK, borderRadius: 0.5 }}/>
          <div style={{ width: 3, height: 10, background: INK, borderRadius: 0.5 }}/>
        </div>
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
          <path d="M1 3.2C2.7 1.7 4.7 0.8 7 0.8C9.3 0.8 11.3 1.7 13 3.2" stroke={INK} strokeWidth="1.2" strokeLinecap="round"/>
          <path d="M3 5.4C4.1 4.5 5.5 4 7 4C8.5 4 9.9 4.5 11 5.4" stroke={INK} strokeWidth="1.2" strokeLinecap="round"/>
          <circle cx="7" cy="8.4" r="1" fill={INK}/>
        </svg>
        <div style={{ position: "relative", width: 22, height: 10 }}>
          <div style={{ position: "absolute", inset: 0, border: `1px solid ${INK}`, borderRadius: 2.5, opacity: 0.55 }}/>
          <div style={{ position: "absolute", left: 1.5, top: 1.5, bottom: 1.5, width: 14, background: INK, borderRadius: 1 }}/>
          <div style={{ position: "absolute", right: -2, top: 3, width: 1.5, height: 4, background: INK, opacity: 0.55, borderRadius: "0 1px 1px 0" }}/>
        </div>
      </div>
    </div>
  );
}

function TabStrip() {
  const tabs = [
    { label: "THE PLAN",   active: false },
    { label: "THE RECAP",  active: false },
    { label: "THE RECORD", active: true  },
  ];
  return (
    <div style={{
      paddingTop: 14, paddingBottom: 13,
      borderBottom: `1px solid ${RULE}`,
      display: "flex", justifyContent: "center", gap: 22,
      background: CHALK,
    }}>
      {tabs.map((t) => (
        <div key={t.label} style={{ position: "relative" }}>
          <span style={{
            fontFamily: "Space Mono", fontWeight: 400,
            fontSize: 10, letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: INK, opacity: t.active ? 1 : 0.4,
          }}>{t.label}</span>
          {t.active && (
            <div style={{
              position: "absolute", left: 0, right: 0, bottom: -5,
              height: 1.5, background: SAFFRON,
            }}/>
          )}
        </div>
      ))}
    </div>
  );
}

// Page CTA — shared-underline pattern (Light Standard)
function ExportCTA() {
  return (
    <div style={{
      display: "inline-flex", alignItems: "baseline", gap: 8,
      borderBottom: `1px solid ${INK}`,
      paddingBottom: 4,
      cursor: "pointer",
    }}>
      <span style={{
        fontFamily: "Plus Jakarta Sans", fontWeight: 500,
        fontSize: 13, color: INK, letterSpacing: "0.005em",
      }}>Export PDF</span>
      <span style={{
        fontFamily: "Space Mono", fontWeight: 400,
        fontSize: 9, letterSpacing: "0.22em",
        textTransform: "uppercase", color: INK_55,
      }}>For Georgia review</span>
    </div>
  );
}

// =============================================================
// ANNUAL COMPLIANCE SUMMARY — phone view
// Five elements: identity header (provenance), three numbers,
// pace context, subject table, methodology footer + Export CTA
// =============================================================

const SUMMARY_ROWS = [
  { k:"la",   name:"Language Arts",       logged:78.5, required:75.0, status:"MET" },
  { k:"math", name:"Mathematics",         logged:71.0, required:75.0, status:"IN PROGRESS" },
  { k:"sci",  name:"Science",             logged:52.5, required:50.0, status:"MET" },
  { k:"gh",   name:"Geography & History", logged:48.0, required:50.0, status:"IN PROGRESS" },
  { k:"ca",   name:"Creative Arts",       logged:56.0, required:40.0, status:"MET" },
  { k:"pe",   name:"PE & Health",         logged:42.5, required:40.0, status:"MET" },
  { k:"wl",   name:"World Languages",     logged:38.5, required:40.0, status:"IN PROGRESS" },
  { k:"ls",   name:"Life Skills",         logged:34.0, required:50.0, status:"BEHIND" },
];

function SummaryStatus({ s }) {
  const base = {
    fontFamily: "Space Mono", fontWeight: 400,
    fontSize: 9, letterSpacing: "0.22em",
    textTransform: "uppercase", whiteSpace: "nowrap",
  };
  if (s === "MET")         return <span style={{ ...base, color: SAFFRON }}>MET</span>;
  if (s === "IN PROGRESS") return <span style={{ ...base, color: INK_55 }}>IN PROG.</span>;
  return <span style={{ ...base, color: BEHIND }}>BEHIND</span>;
}

// LOCK · The header sits ABOVE the warm tint, on chalk — it carries provenance
// (institutional quiet) not diagnostic register. The tint band starts beneath
// the double rule; the eyebrow privacy marker opens it.
function ComplianceSummary() {
  return (
    <div style={{ background: CHALK, color: INK, fontFamily: "Plus Jakarta Sans" }}>
      <StatusBar />
      <TabStrip />

      {/* IDENTITY (provenance, on chalk) */}
      <div style={{ paddingTop: 26, paddingLeft: 24, paddingRight: 24 }}>
        <div style={{
          fontFamily: "Plus Jakarta Sans", fontWeight: 500,
          fontSize: 13, letterSpacing: "0.005em",
          color: INK, lineHeight: 1.25,
        }}>
          The Oguntala Family · Georgia
        </div>
        <div style={{
          fontFamily: "Space Mono", fontWeight: 400,
          fontSize: 9, letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: INK_55,
          marginTop: 6,
        }}>
          Declaration of Intent · Year 2025–2026
        </div>
        {/* Transcript double rule — same vocabulary as PDF */}
        <div style={{ marginTop: 14 }}>
          <div style={{ height: 1,   background: INK }}/>
          <div style={{ height: 2.5 }}/>
          <div style={{ height: 0.5, background: INK }}/>
        </div>
      </div>

      {/* WARM-TINT BAND — diagnostic register starts here */}
      <div style={{ background: TINT, marginTop: 24, paddingBottom: 32 }}>
        {/* Privacy eyebrow */}
        <div style={{ paddingTop: 22, paddingLeft: 24, paddingRight: 24 }}>
          <div style={{
            fontFamily: "Space Mono", fontWeight: 400,
            fontSize: 9, letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: INK_55,
          }}>
            For You · Private to this device
          </div>
        </div>

        {/* Three headline numbers — stacked on phone, ledger on tablet+ */}
        <div style={{
          paddingTop: 20, paddingLeft: 24, paddingRight: 24,
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          columnGap: 16,
        }}>
          {[
            { v: "421.0", l: "Hours" },
            { v: "142",   l: "Days Logged" },
            { v: "38",    l: "Days Left" },
          ].map((n) => (
            <div key={n.l}>
              <div style={{
                fontFamily: "Fraunces", fontWeight: 600,
                fontSize: 36, lineHeight: 0.95,
                letterSpacing: "-0.020em",
                color: INK,
                fontVariationSettings: '"opsz" 144',
                fontFeatureSettings: '"lnum" 1, "tnum" 1',
              }}>{n.v}</div>
              <div style={{
                fontFamily: "Space Mono", fontWeight: 400,
                fontSize: 8.5, letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: INK_55,
                marginTop: 9,
              }}>{n.l}</div>
            </div>
          ))}
        </div>

        {/* Pace diagnostic — Fraunces italic, the answer to "am I okay" */}
        <div style={{
          paddingTop: 26, paddingLeft: 24, paddingRight: 24,
        }}>
          <div style={{
            fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 500,
            fontSize: 22, lineHeight: 1.20,
            letterSpacing: "-0.018em",
            color: INK,
            fontVariationSettings: '"opsz" 144',
          }}>
            On pace for the year. Ahead by twelve hours overall, behind in Life Skills.
          </div>
        </div>
      </div>

      {/* SUBJECT TABLE — on chalk again, transcript-style, same vocabulary as PDF */}
      <div style={{ paddingTop: 28, paddingLeft: 24, paddingRight: 24 }}>
        <table style={{
          width: "100%", borderCollapse: "collapse",
          fontFamily: "Plus Jakarta Sans", tableLayout: "fixed",
        }}>
          <colgroup>
            <col style={{ width: "44%" }}/>
            <col style={{ width: "16%" }}/>
            <col style={{ width: "16%" }}/>
            <col style={{ width: "24%" }}/>
          </colgroup>
          <thead>
            <tr style={{ borderBottom: `1px solid ${INK}` }}>
              {["Subject","Logged","Req.","Status"].map((h, i) => (
                <th key={h} style={{
                  textAlign: i === 0 ? "left" : "right",
                  paddingBottom: 8,
                  fontFamily: "Space Mono", fontWeight: 400,
                  fontSize: 8.5, letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: INK_55,
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SUMMARY_ROWS.map((r) => (
              <tr key={r.k}>
                <td style={{ padding: "11px 0", verticalAlign: "top" }}>
                  <span style={{
                    display: "inline-flex", flexDirection: "column",
                    fontFamily: "Plus Jakarta Sans", fontWeight: 500,
                    fontSize: 11.5, color: INK, letterSpacing: "0.005em",
                    lineHeight: 1.0,
                  }}>
                    <span>{r.name}</span>
                    <span style={{
                      height: 1, background: desat(HUE[r.k]),
                      marginTop: 3, width: "100%",
                    }}/>
                  </span>
                </td>
                <td style={{
                  padding: "11px 0", textAlign: "right", verticalAlign: "top",
                  fontFamily: "Space Mono", fontWeight: 400,
                  fontSize: 10.5, color: INK,
                  fontVariantNumeric: "tabular-nums", lineHeight: 1.0,
                }}>{r.logged.toFixed(1)}</td>
                <td style={{
                  padding: "11px 0", textAlign: "right", verticalAlign: "top",
                  fontFamily: "Space Mono", fontWeight: 400,
                  fontSize: 10.5, color: INK_55,
                  fontVariantNumeric: "tabular-nums", lineHeight: 1.0,
                }}>{r.required.toFixed(1)}</td>
                <td style={{
                  padding: "11px 0", textAlign: "right", verticalAlign: "top",
                  lineHeight: 1.0,
                }}>
                  <SummaryStatus s={r.status}/>
                </td>
              </tr>
            ))}
            <tr><td colSpan={4} style={{ padding: 0 }}>
              <div style={{ height: 1, background: INK, marginTop: 4 }}/>
            </td></tr>
            <tr>
              <td style={{
                paddingTop: 12,
                fontFamily: "Space Mono", fontWeight: 400,
                fontSize: 8.5, letterSpacing: "0.22em",
                textTransform: "uppercase", color: INK_55,
              }}>Total Hours</td>
              <td style={{
                paddingTop: 12, textAlign: "right",
                fontFamily: "Fraunces", fontWeight: 600,
                fontSize: 13, color: INK,
                fontVariantNumeric: "tabular-nums",
                letterSpacing: "-0.010em",
                fontVariationSettings: '"opsz" 144',
                fontFeatureSettings: '"lnum" 1, "tnum" 1',
              }}>421.0</td>
              <td style={{
                paddingTop: 12, textAlign: "right",
                fontFamily: "Space Mono", fontWeight: 400,
                fontSize: 10.5, color: INK_55,
                fontVariantNumeric: "tabular-nums",
              }}>420.0</td>
              <td/>
            </tr>
          </tbody>
        </table>
      </div>

      {/* EXPORT CTA — page shared-underline, calm not urgent */}
      <div style={{ paddingTop: 28, paddingLeft: 24, paddingRight: 24 }}>
        <ExportCTA/>
      </div>

      {/* DEEPER PROGRESS affordance */}
      <div style={{ paddingTop: 36, paddingLeft: 24, paddingRight: 24, paddingBottom: 28 }}>
        <div style={{ height: 0.5, background: INK, opacity: 0.18, marginBottom: 14 }}/>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "baseline",
        }}>
          <div style={{
            fontFamily: "Plus Jakarta Sans", fontWeight: 500,
            fontSize: 12.5, color: INK, letterSpacing: "0.005em",
          }}>Deeper progress</div>
          <div style={{
            fontFamily: "Space Mono", fontWeight: 400,
            fontSize: 9, letterSpacing: "0.22em",
            textTransform: "uppercase", color: INK_55,
          }}>Show more ↓</div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ComplianceSummary });
