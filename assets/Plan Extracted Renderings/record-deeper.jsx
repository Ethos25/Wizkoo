/* global React */

// =============================================================
// THE RECORD — Deeper Progress (4 cards, 390px viewport)
// Inherits Recap Deeper Read structural pattern: collapsed default,
// inline expansion, no modals, per-card memory.
// =============================================================

const INK     = "#0C1020";
const CHALK   = "#F8F4E9";
const TINT    = "#F2EBDA";
const SAFFRON = "#E8AF38";
const RULE    = "#E8E2D4";
const INK_55  = "rgba(12,16,32,0.55)";
const BEHIND  = "#8A4838";

const HUE = { la:"#3848D0", math:"#18A0B8", sci:"#38B060", gh:"#C83030",
              ca:"#8848E0", pe:"#F08A20",  wl:"#B4B2A9",  ls:"#B4B2A9" };
const SUBJ = {
  la:   { abbr:"LANG", name:"Language Arts" },
  math: { abbr:"MATH", name:"Mathematics" },
  sci:  { abbr:"SCI",  name:"Science" },
  gh:   { abbr:"GEO",  name:"Geography & History" },
  ca:   { abbr:"ARTS", name:"Creative Arts" },
  pe:   { abbr:"PE",   name:"PE & Health" },
  wl:   { abbr:"WL?",  name:"World Languages" },
  ls:   { abbr:"LS?",  name:"Life Skills" },
};
const desat = (hex) => {
  const h = hex.replace("#",""); const r=parseInt(h.slice(0,2),16), g=parseInt(h.slice(2,4),16), b=parseInt(h.slice(4,6),16);
  const t=0.10; return `rgb(${Math.round(r+(248-r)*t)},${Math.round(g+(244-g)*t)},${Math.round(b+(233-b)*t)})`;
};

const KIDS = {
  leo:  { initial:"L", rest:"eo",  fill:"#5A2030" },
  max:  { initial:"M", rest:"ax",  fill:"#1F4E3D" },
  jack: { initial:"J", rest:"ack", fill:"#1F3858" },
  jane: { initial:"J", rest:"ane", fill:"#C09444" },
};

// Form B name — colored Fraunces italic initial + body in ink
function NameB({ kid, scale = 1 }) {
  const k = KIDS[kid];
  return (
    <span style={{ display: "inline-flex", alignItems: "baseline", lineHeight: 1 }}>
      <span style={{
        fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 500,
        fontSize: 28*scale, color: k.fill, letterSpacing: "-0.02em",
        fontVariationSettings: '"opsz" 144', lineHeight: 0.85,
      }}>{k.initial}</span>
      <span style={{
        fontFamily: "Plus Jakarta Sans", fontStyle: "italic", fontWeight: 500,
        fontSize: 15*scale, color: INK, letterSpacing: "-0.005em", marginLeft: 1,
      }}>{k.rest}</span>
    </span>
  );
}

// Subject mark — Space Mono uppercase + colored 1.5px underline (Plan-locked)
function SubjectMark({ k, width = 86 }) {
  const s = SUBJ[k];
  return (
    <span style={{ display: "inline-flex", flexDirection: "column", lineHeight: 1, width }}>
      <span style={{
        fontFamily: "Space Mono", fontWeight: 400,
        fontSize: 9, letterSpacing: "0.22em",
        textTransform: "uppercase", color: INK,
      }}>{s.abbr}</span>
      <span style={{ width: "100%", height: 1.5, background: HUE[k], marginTop: 3 }}/>
    </span>
  );
}

// =============================================================
// CARD SHELL — collapsed-by-default header + expanded body
// Always shown expanded here for review; collapsed state is the
// header alone with a "Show more ↓" affordance to the right.
// =============================================================
function Card({ index, eyebrow, title, summary, children, expanded = true }) {
  return (
    <div style={{ background: CHALK }}>
      <div style={{ height: 0.5, background: INK, opacity: 0.18 }}/>
      <div style={{ paddingLeft: 24, paddingRight: 24, paddingTop: 22, paddingBottom: expanded ? 18 : 22 }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16,
        }}>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontFamily: "Space Mono", fontWeight: 400,
              fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase",
              color: INK_55,
            }}>{eyebrow}</div>
            <div style={{
              fontFamily: "Plus Jakarta Sans", fontWeight: 500,
              fontSize: 15, color: INK, letterSpacing: "0.005em",
              marginTop: 6,
            }}>{title}</div>
            {summary && (
              <div style={{
                fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 500,
                fontSize: 16, lineHeight: 1.25,
                letterSpacing: "-0.012em",
                color: INK,
                fontVariationSettings: '"opsz" 144',
                marginTop: 10,
              }}>{summary}</div>
            )}
          </div>
          <div style={{
            fontFamily: "Space Mono", fontWeight: 400,
            fontSize: 9, letterSpacing: "0.22em",
            textTransform: "uppercase", color: INK_55, whiteSpace: "nowrap",
          }}>{expanded ? "Show less ↑" : "Show more ↓"}</div>
        </div>
      </div>
      {expanded && (
        <div style={{ paddingLeft: 24, paddingRight: 24, paddingBottom: 28 }}>
          {children}
        </div>
      )}
    </div>
  );
}

// =============================================================
// CARD 1 — The Year by Subject. Year-scale typographic bar.
// Each subject is a row: name / underline / hours label / proportional ledger fill.
// Fill is INK at 100% for the logged portion, 0.18 ink for the remaining required portion.
// No color in the bar — color stays in the underline. The bar is ledger, not chart.
// =============================================================
const C1_ROWS = [
  { k:"la",   logged:78.5, max:90 },
  { k:"math", logged:71.0, max:90 },
  { k:"sci",  logged:52.5, max:60 },
  { k:"gh",   logged:48.0, max:60 },
  { k:"ca",   logged:56.0, max:60 },
  { k:"pe",   logged:42.5, max:50 },
  { k:"wl",   logged:38.5, max:50 },
  { k:"ls",   logged:34.0, max:60 },
];

function Card1() {
  const max = Math.max(...C1_ROWS.map(r => r.max));
  return (
    <Card
      index={1}
      eyebrow="Card 01"
      title="The year by subject"
      summary="421 hours across eight subjects, distributed roughly as the pathway anticipated."
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 10 }}>
        {C1_ROWS.map((r) => {
          const pct = (r.logged / max) * 100;
          return (
            <div key={r.k}>
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "baseline",
                marginBottom: 6,
              }}>
                <span style={{
                  fontFamily: "Plus Jakarta Sans", fontWeight: 500,
                  fontSize: 12, color: INK, letterSpacing: "0.005em",
                }}>{SUBJ[r.k].name}</span>
                <span style={{
                  fontFamily: "Space Mono", fontWeight: 400,
                  fontSize: 10, color: INK,
                  fontVariantNumeric: "tabular-nums",
                }}>{r.logged.toFixed(1)} <span style={{ color: INK_55 }}>· {r.max}</span></span>
              </div>
              {/* Ledger bar — colored hairline beneath, ink fill above. Architecture, not chart. */}
              <div style={{ position: "relative", height: 3 }}>
                <div style={{ position: "absolute", inset: 0, background: INK, opacity: 0.10 }}/>
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${pct}%`, background: INK }}/>
              </div>
              <div style={{ height: 1.5, background: desat(HUE[r.k]), marginTop: 2 }}/>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// =============================================================
// CARD 2 — Concepts. Searchable mastery library, grouped by subject.
// Per-child rendering uses Form B. Subject groupings use locked underline.
// Show one subject group expanded as proof; scroll-implied below.
// =============================================================
const C2_CONCEPTS_MATH = [
  { name: "Equivalent fractions",      mastery: "Secure",     exposure: 14, child: "max"  },
  { name: "Long division",             mastery: "Secure",     exposure: 22, child: "max"  },
  { name: "Coordinate plane",          mastery: "Practiced",  exposure: 9,  child: "leo"  },
  { name: "Place value to millions",   mastery: "Secure",     exposure: 11, child: "jack" },
  { name: "Order of operations",       mastery: "Practiced",  exposure: 8,  child: "leo"  },
  { name: "Decimals to thousandths",   mastery: "Introduced", exposure: 4,  child: "jane" },
];

function MasteryDot({ level }) {
  // Mastery as typography — three pips, filled left-to-right. No color.
  const filled = level === "Secure" ? 3 : level === "Practiced" ? 2 : 1;
  return (
    <span style={{ display: "inline-flex", gap: 3, alignItems: "center" }}>
      {[0,1,2].map((i) => (
        <span key={i} style={{
          width: 4, height: 4, borderRadius: "50%",
          background: i < filled ? INK : "transparent",
          border: `1px solid ${INK}`, opacity: i < filled ? 1 : 0.30,
        }}/>
      ))}
    </span>
  );
}

function Card2() {
  return (
    <Card
      index={2}
      eyebrow="Card 02"
      title="Concepts"
      summary="218 concepts touched across the year. Searchable by name, child, or subject."
    >
      {/* Search affordance */}
      <div style={{
        marginTop: 10, marginBottom: 18,
        display: "flex", alignItems: "center",
        borderBottom: `1px solid ${INK}`, paddingBottom: 8,
      }}>
        <span style={{
          fontFamily: "Space Mono", fontWeight: 400,
          fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase",
          color: INK_55,
        }}>Search</span>
        <span style={{ flex: 1 }}/>
        <span style={{
          fontFamily: "Space Mono", fontWeight: 400,
          fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase",
          color: INK_55,
        }}>Sort · By subject</span>
      </div>

      {/* Subject group header */}
      <div style={{ marginBottom: 12, display: "flex", alignItems: "baseline", gap: 12 }}>
        <SubjectMark k="math"/>
        <span style={{
          fontFamily: "Space Mono", fontWeight: 400,
          fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase",
          color: INK_55, marginLeft: "auto",
        }}>42 concepts</span>
      </div>

      {/* Concept rows */}
      <div>
        {C2_CONCEPTS_MATH.map((c, i) => (
          <div key={c.name} style={{
            display: "flex", alignItems: "baseline", gap: 12,
            paddingTop: 11, paddingBottom: 11,
            borderTop: i === 0 ? "none" : `0.5px solid ${RULE}`,
          }}>
            <NameB kid={c.child} scale={0.62}/>
            <span style={{
              fontFamily: "Plus Jakarta Sans", fontWeight: 500,
              fontSize: 12, color: INK, letterSpacing: "0.005em",
              flex: 1, minWidth: 0,
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>{c.name}</span>
            <MasteryDot level={c.mastery}/>
            <span style={{
              fontFamily: "Space Mono", fontWeight: 400,
              fontSize: 10, color: INK_55,
              fontVariantNumeric: "tabular-nums",
              minWidth: 18, textAlign: "right",
            }}>×{c.exposure}</span>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 16,
        fontFamily: "Space Mono", fontWeight: 400,
        fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase",
        color: INK_55,
      }}>Show 36 more in math ↓</div>
    </Card>
  );
}

// =============================================================
// CARD 3 — The Pattern. Quiet weekly grid. Private to parent.
// 36 weeks × 1 row. Filled = active week, lighter = quieter week.
// No streaks. No shame. Useful self-knowledge.
// =============================================================
function Card3() {
  // Synthetic but realistic weekly data: 36 weeks of academic year.
  // Density 0..3, where 0 = quiet, 3 = full.
  const WEEKS = [
    3,3,2,3,3,3,2,1,3,3,3,2,3,3,2,3,3,3,1,2,3,3,3,2,3,3,3,3,2,3,3,3,3,2,1,0,
  ];
  // April through current — final 9 weeks not yet realized (lightest tone).
  return (
    <Card
      index={3}
      eyebrow="Card 03 · Private"
      title="The pattern"
      summary="Thirty-one active weeks. Five quieter ones — Thanksgiving, the December break, and three weeks in February."
    >
      <div style={{
        marginTop: 14,
        fontFamily: "Space Mono", fontWeight: 400,
        fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase",
        color: INK_55, marginBottom: 10,
      }}>Sep — May · By week</div>

      {/* Quiet grid — 36 cells, ink at varying opacity */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(18, 1fr)",
        gap: 4,
      }}>
        {WEEKS.map((d, i) => (
          <div key={i} style={{
            aspectRatio: "1 / 1",
            background: INK,
            opacity: d === 0 ? 0.06 : d === 1 ? 0.16 : d === 2 ? 0.34 : 0.62,
          }}/>
        ))}
      </div>

      <div style={{
        marginTop: 14,
        fontFamily: "Plus Jakarta Sans", fontWeight: 400,
        fontSize: 11.5, lineHeight: 1.55,
        color: INK_55,
        fontStyle: "italic",
      }}>
        For your eyes. Patterns surface without judgment — quieter weeks are weeks, not failures.
      </div>
    </Card>
  );
}

// =============================================================
// CARD 4 — Assessments. Per-child standardized test record cards.
// Form B name, date, score type, percentile, threshold.
// =============================================================
const C4_ASSESSMENTS = [
  {
    child: "leo",
    date: "Mar 14, 2026",
    type: "Iowa Assessments · Form E",
    grade: "Grade 5 reference",
    rows: [
      { label: "Reading",     pct: 84, threshold: 30 },
      { label: "Mathematics", pct: 79, threshold: 30 },
      { label: "Language",    pct: 72, threshold: 30 },
    ],
  },
  {
    child: "max",
    date: "Mar 14, 2026",
    type: "Iowa Assessments · Form E",
    grade: "Grade 3 reference",
    rows: [
      { label: "Reading",     pct: 91, threshold: 30 },
      { label: "Mathematics", pct: 88, threshold: 30 },
      { label: "Language",    pct: 81, threshold: 30 },
    ],
  },
];

function AssessmentRecord({ a }) {
  return (
    <div style={{
      borderTop: `1px solid ${INK}`,
      paddingTop: 16, paddingBottom: 18,
    }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <NameB kid={a.child} scale={0.85}/>
        <span style={{
          fontFamily: "Space Mono", fontWeight: 400,
          fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase",
          color: INK_55,
        }}>{a.date}</span>
      </div>
      <div style={{
        marginTop: 8,
        fontFamily: "Plus Jakarta Sans", fontWeight: 500,
        fontSize: 12, color: INK, letterSpacing: "0.005em",
      }}>{a.type}</div>
      <div style={{
        fontFamily: "Space Mono", fontWeight: 400,
        fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase",
        color: INK_55, marginTop: 4,
      }}>{a.grade}</div>

      {/* Score table */}
      <div style={{ marginTop: 14 }}>
        {a.rows.map((r, i) => (
          <div key={r.label} style={{
            display: "grid",
            gridTemplateColumns: "1fr auto auto",
            columnGap: 12,
            alignItems: "baseline",
            paddingTop: 9, paddingBottom: 9,
            borderTop: i === 0 ? "none" : `0.5px solid ${RULE}`,
          }}>
            <span style={{
              fontFamily: "Plus Jakarta Sans", fontWeight: 500,
              fontSize: 11.5, color: INK,
            }}>{r.label}</span>
            <span style={{
              fontFamily: "Fraunces", fontWeight: 600,
              fontSize: 18, color: INK,
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "-0.012em",
              fontVariationSettings: '"opsz" 144',
              fontFeatureSettings: '"lnum" 1, "tnum" 1',
              lineHeight: 1,
            }}>{r.pct}<span style={{ fontSize: 10, color: INK_55, fontWeight: 400, marginLeft: 1 }}>%ile</span></span>
            <span style={{
              fontFamily: "Space Mono", fontWeight: 400,
              fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase",
              color: SAFFRON,
              minWidth: 56, textAlign: "right",
            }}>Above {r.threshold}</span>
          </div>
        ))}
      </div>

      {/* Photo attachment affordance */}
      <div style={{
        marginTop: 14,
        display: "inline-flex", alignItems: "baseline", gap: 8,
        borderBottom: `1px solid ${INK}`, paddingBottom: 3,
      }}>
        <span style={{
          fontFamily: "Plus Jakarta Sans", fontWeight: 500,
          fontSize: 11.5, color: INK,
        }}>View score report</span>
        <span style={{
          fontFamily: "Space Mono", fontWeight: 400,
          fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase",
          color: INK_55,
        }}>2 photos</span>
      </div>
    </div>
  );
}

function Card4() {
  return (
    <Card
      index={4}
      eyebrow="Card 04"
      title="Assessments"
      summary="Two standardized assessments on file. Both above the Georgia 30th-percentile threshold across all sections."
    >
      <div style={{ marginTop: 8 }}>
        {C4_ASSESSMENTS.map((a, i) => (
          <AssessmentRecord key={i} a={a}/>
        ))}
      </div>

      {/* Add assessment affordance */}
      <div style={{
        marginTop: 18,
        display: "inline-flex", alignItems: "baseline", gap: 8,
        borderBottom: `1px solid ${INK}`, paddingBottom: 3,
      }}>
        <span style={{
          fontFamily: "Plus Jakarta Sans", fontWeight: 500,
          fontSize: 12, color: INK,
        }}>Add assessment</span>
        <span style={{
          fontFamily: "Space Mono", fontWeight: 400,
          fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase",
          color: INK_55,
        }}>Photo or manual entry</span>
      </div>
    </Card>
  );
}

function DeeperProgress() {
  return (
    <div>
      {/* Section eyebrow */}
      <div style={{
        background: CHALK,
        paddingLeft: 24, paddingRight: 24, paddingTop: 4, paddingBottom: 18,
      }}>
        <div style={{
          fontFamily: "Space Mono", fontWeight: 400,
          fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase",
          color: INK_55,
        }}>Deeper progress · Four cards</div>
      </div>
      <Card1/>
      <Card2/>
      <Card3/>
      <Card4/>
    </div>
  );
}

Object.assign(window, { DeeperProgress });
