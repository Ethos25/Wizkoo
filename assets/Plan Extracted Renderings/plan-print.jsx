/* global React, KIDS, SUBJECTS, COLORS, NameB, SubjectMark, WEEK_DATA */

// =============================================================
// PRINT — paper register
// Same vocabulary, recalibrated for paper: white surface,
// heavier rules, slightly larger body, no saffron (paper has
// no light source). Fridge / kitchen-counter scale.
// =============================================================

const PAPER_BG    = "#FDFCF8";   // warm white, prints clean
const PAPER_RULE  = "#1A1A20";   // near-black for paper rules
const PAPER_FAINT = "#9E9C92";   // muted gray for meta
const PAPER_INK   = "#0C1020";

// =============================================================
// ARTIFACT 1 — WEEK SHEET (landscape · taped to fridge)
// =============================================================
function WeekSheet() {
  return (
    <div style={{ width: 1300, height: 920, background: PAPER_BG, fontFamily: "Plus Jakarta Sans", color: PAPER_INK, padding: "44px 48px", boxSizing: "border-box", border: "1px solid #E0DDD2", boxShadow: "inset 0 0 0 0.5px #FAF7EC" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "1.5px solid " + PAPER_RULE, paddingBottom: 14 }}>
        <div>
          <div className="mono" style={{ fontSize: 10.5, color: PAPER_FAINT, letterSpacing: "0.26em" }}>WEEK 16 · OCT 21–25 · LEO MAX JACK JANE</div>
          <h1 style={{ margin: "10px 0 0", fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 400, fontSize: 50, letterSpacing: "-0.02em", lineHeight: 1 }}>The week.</h1>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="mono" style={{ fontSize: 9.5, color: PAPER_FAINT, letterSpacing: "0.24em" }}>FRIDGE COPY · WK 16</div>
          <div style={{ marginTop: 6, display: "flex", gap: 14, alignItems: "baseline", justifyContent: "flex-end" }}>
            {KIDS.map(k => <NameB key={k.id} kid={k} scale={0.85}/>)}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", borderLeft: "1px solid #1A1A20", borderTop: "1px solid #1A1A20" }}>
        {WEEK_DATA.map(d => (
          <div key={d.day} style={{ borderRight: "1px solid #1A1A20", borderBottom: "1px solid #1A1A20", padding: "14px 14px 18px", minHeight: 540, position: "relative" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, paddingBottom: 10, borderBottom: "1px solid #C8C5BC" }}>
              <span className="mono" style={{ fontSize: 11, color: PAPER_INK, letterSpacing: "0.24em", fontWeight: 700 }}>{d.day}</span>
              <span style={{ fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 400, fontSize: 24, color: PAPER_INK, letterSpacing: "-0.02em" }}>{d.date}</span>
            </div>
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 11 }}>
              {d.clusters.map((c, i) => (
                <div key={i} style={{ paddingBottom: 10, borderBottom: i < d.clusters.length - 1 ? "1px dashed #D2CFC2" : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span className="mono" style={{ fontSize: 9.5, color: PAPER_FAINT, letterSpacing: "0.20em" }}>{c.time}</span>
                    {c.split && <span className="mono" style={{ fontSize: 9, color: PAPER_INK, letterSpacing: "0.22em" }}>SPLIT</span>}
                  </div>
                  <div style={{ marginTop: 5, fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 500, fontSize: 14, color: PAPER_INK, letterSpacing: "-0.012em", lineHeight: 1.2 }}>{c.title}</div>
                  <div style={{ marginTop: 6 }}><SubjectMark subject={c.subject} width={66} dense/></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 18, display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: 12, borderTop: "1px solid #C8C5BC" }}>
        <div style={{ display: "flex", gap: 24 }}>
          <span className="mono" style={{ fontSize: 9, color: PAPER_FAINT, letterSpacing: "0.22em" }}>WEEK FOCUS</span>
          <span style={{ fontFamily: "Fraunces", fontStyle: "italic", fontSize: 13, color: PAPER_INK }}>Roman trade · fractions of a whole · plant cells.</span>
        </div>
        <span className="mono" style={{ fontSize: 9, color: PAPER_FAINT, letterSpacing: "0.22em" }}>PRINTED MON 06:00</span>
      </div>
    </div>
  );
}

// =============================================================
// ARTIFACT 2 — MATERIALS MASTER (portrait · location-organized)
// =============================================================
const MASTER = [
  { locale: "Kitchen island",       items: [
    { name: "Wall map · Mediterranean",     subject: "gh",   blocks: ["TUE 10:00", "WED 10:00"] },
    { name: "Trade-route key (printed)",    subject: "gh",   blocks: ["TUE 10:00"] },
    { name: "Lab notebook · plant cells",   subject: "sci",  blocks: ["TUE 11:30", "WED 11:30"] },
    { name: "Fraction strips · 1/2, 1/4, 1/8", subject: "math", blocks: ["TUE 09:15", "FRI 09:15"] },
  ]},
  { locale: "Bay window · reading nook", items: [
    { name: "Carthage primary (printed × 4)", subject: "gh",   blocks: ["TUE 10:00", "WED 10:00"] },
    { name: "Margin sheets · Jane × 3, Jack × 3", subject: "gh", perChild: true, blocks: ["TUE 10:00"] },
    { name: "Reading log book",                subject: "la",   blocks: ["MON, WED, FRI 08:30"] },
  ]},
  { locale: "Studio · back hall",   items: [
    { name: "Charcoal · 2B + 4B",     subject: "ca", blocks: ["TUE 14:00"] },
    { name: "Newsprint pad · A2",     subject: "ca", blocks: ["TUE 14:00", "FRI 14:00"] },
    { name: "Watercolor box · refill blues", subject: "ca", blocks: ["MON 11:30"] },
  ]},
  { locale: "Front entry · grab on way", items: [
    { name: "Swim bag · Leo + Max",   subject: "pe", perChild: true, blocks: ["TUE 15:30"] },
    { name: "Run shoes · all four",   subject: "pe", blocks: ["THU 15:30"] },
  ]},
];

function MaterialsMaster() {
  return (
    <div style={{ width: 800, height: 1140, background: PAPER_BG, fontFamily: "Plus Jakarta Sans", color: PAPER_INK, padding: "44px 50px", boxSizing: "border-box", border: "1px solid #E0DDD2" }}>
      <div style={{ borderBottom: "1.5px solid " + PAPER_RULE, paddingBottom: 14 }}>
        <div className="mono" style={{ fontSize: 10.5, color: PAPER_FAINT, letterSpacing: "0.26em" }}>WEEK 16 · MATERIALS MASTER · KEEP ON COUNTER</div>
        <h1 style={{ margin: "10px 0 0", fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 400, fontSize: 44, letterSpacing: "-0.02em", lineHeight: 1 }}>What goes where.</h1>
        <p style={{ margin: "10px 0 0", fontSize: 13, color: "#52514A", lineHeight: 1.5, fontStyle: "italic", fontFamily: "Fraunces" }}>Organized by location. Walk the room once on Sunday and everything is in place for the week.</p>
      </div>

      <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 18 }}>
        {MASTER.map((sec, i) => (
          <div key={i}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, paddingBottom: 8, borderBottom: "1px solid #C8C5BC" }}>
              <span className="mono" style={{ fontSize: 10, color: PAPER_INK, letterSpacing: "0.24em", fontWeight: 700 }}>{i + 1}.</span>
              <span style={{ fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 500, fontSize: 19, letterSpacing: "-0.018em" }}>{sec.locale}</span>
            </div>
            <ul style={{ margin: "10px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 7 }}>
              {sec.items.map((it, j) => (
                <li key={j} style={{ display: "grid", gridTemplateColumns: "20px 1fr 130px 110px", alignItems: "baseline", columnGap: 10, padding: "5px 0" }}>
                  <span style={{ width: 13, height: 13, border: "1.3px solid #1A1A20", display: "inline-block", marginTop: 2 }}/>
                  <span style={{ fontSize: 12.5, color: PAPER_INK, lineHeight: 1.4 }}>
                    {it.name}
                    {it.perChild && <span className="mono" style={{ marginLeft: 8, fontSize: 8.5, color: PAPER_FAINT, letterSpacing: "0.22em" }}>PER-CHILD</span>}
                  </span>
                  <SubjectMark subject={it.subject} width={64} dense/>
                  <span className="mono" style={{ fontSize: 9, color: PAPER_FAINT, letterSpacing: "0.18em", textAlign: "right" }}>{it.blocks.join(", ")}</span>
                </li>))}
            </ul>
          </div>))}
      </div>

      {/* Notes for the week — bottom */}
      <div style={{ marginTop: 22, paddingTop: 14, borderTop: "1.5px solid " + PAPER_RULE }}>
        <div className="mono" style={{ fontSize: 9.5, color: PAPER_FAINT, letterSpacing: "0.24em" }}>NOTES FOR THE WEEK</div>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { id: "leo",  note: "asked for fewer colors on Tuesday's map. Keep to graphite." },
            { id: "max",  note: "the legend is his — let him own the cross-check." },
            { id: "jack", note: "reads ahead when nervous. Slow him down at the underlines." },
            { id: "jane", note: "ready for the glossary independently." },
          ].map(n => { const k = KIDS.find(x => x.id === n.id);
            return (
              <div key={n.id} style={{ display: "grid", gridTemplateColumns: "120px 1fr", alignItems: "baseline", columnGap: 14 }}>
                <NameB kid={k} scale={0.95}/>
                <span style={{ fontSize: 12, color: "#52514A", lineHeight: 1.5, fontFamily: "Fraunces", fontStyle: "italic" }}>{n.note}</span>
              </div>);
          })}
        </div>
      </div>
    </div>
  );
}

// =============================================================
// ARTIFACT 3 — BLOCK SHEETS (portrait · one per block)
// Per-child notes at the bottom — load-bearing use of Form B on paper.
// =============================================================
function BlockSheet({ data }) {
  return (
    <div style={{ width: 800, height: 1140, background: PAPER_BG, fontFamily: "Plus Jakarta Sans", color: PAPER_INK, padding: "44px 48px", boxSizing: "border-box", border: "1px solid #E0DDD2" }}>
      {/* Masthead */}
      <div style={{ borderBottom: "1.5px solid " + PAPER_RULE, paddingBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span className="mono" style={{ fontSize: 10.5, color: PAPER_FAINT, letterSpacing: "0.26em" }}>{data.day} · {data.time} · BLOCK SHEET</span>
          <span className="mono" style={{ fontSize: 10, color: PAPER_INK, letterSpacing: "0.22em", fontWeight: 700 }}>{data.format}</span>
        </div>
        <h1 style={{ margin: "10px 0 0", fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 400, fontSize: 42, letterSpacing: "-0.02em", lineHeight: 1.05 }}>{data.title}</h1>
        <div style={{ marginTop: 12 }}><SubjectMark subject={data.subject} width={92}/></div>
      </div>

      {/* Two-column body */}
      <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "260px 1fr", columnGap: 26 }}>
        {/* LEFT — materials + setup */}
        <div>
          <div className="mono" style={{ fontSize: 9.5, color: PAPER_FAINT, letterSpacing: "0.24em" }}>MATERIALS</div>
          <ul style={{ margin: "10px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
            {data.materials.map((m, i) => (
              <li key={i} style={{ display: "grid", gridTemplateColumns: "16px 1fr", columnGap: 9, alignItems: "baseline" }}>
                <span style={{ width: 12, height: 12, border: "1.3px solid #1A1A20", marginTop: 3 }}/>
                <span style={{ fontSize: 12, color: PAPER_INK, lineHeight: 1.4 }}>{m}</span>
              </li>))}
          </ul>
          <div style={{ marginTop: 22 }}>
            <div className="mono" style={{ fontSize: 9.5, color: PAPER_FAINT, letterSpacing: "0.24em" }}>SETUP</div>
            <p style={{ margin: "8px 0 0", fontSize: 12, color: PAPER_INK, lineHeight: 1.55 }}>{data.setup}</p>
          </div>
          <div style={{ marginTop: 22 }}>
            <div className="mono" style={{ fontSize: 9.5, color: PAPER_FAINT, letterSpacing: "0.24em" }}>IF SHORT</div>
            <p style={{ margin: "8px 0 0", fontSize: 12, color: PAPER_INK, lineHeight: 1.55, fontStyle: "italic", fontFamily: "Fraunces" }}>{data.shortcut}</p>
          </div>
        </div>

        {/* RIGHT — activity */}
        <div>
          <div className="mono" style={{ fontSize: 9.5, color: PAPER_FAINT, letterSpacing: "0.24em" }}>ACTIVITY</div>
          <p style={{ margin: "10px 0 0", fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 400, fontSize: 17, color: PAPER_INK, lineHeight: 1.5, textWrap: "pretty" }}>{data.lede}</p>

          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            {data.steps.map((s, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "26px 1fr", columnGap: 12, alignItems: "baseline" }}>
                <span className="mono" style={{ fontSize: 11, color: PAPER_INK, letterSpacing: "0.18em", fontWeight: 700 }}>{String(i+1).padStart(2,"0")}</span>
                <span style={{ fontSize: 12.5, color: PAPER_INK, lineHeight: 1.55 }}>{s}</span>
              </div>))}
          </div>

          {/* Per-child notes — load-bearing use of Form B on paper */}
          <div style={{ marginTop: 24, paddingTop: 14, borderTop: "1.5px solid " + PAPER_RULE }}>
            <div className="mono" style={{ fontSize: 9.5, color: PAPER_FAINT, letterSpacing: "0.24em" }}>PER-CHILD · READ AT THE COUNTER</div>
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 12 }}>
              {data.perChild.map(p => { const k = KIDS.find(x => x.id === p.id);
                return (
                  <div key={p.id}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                      <NameB kid={k} scale={0.92}/>
                      {p.tag && <span className="mono" style={{ fontSize: 8.5, color: PAPER_FAINT, letterSpacing: "0.22em" }}>{p.tag}</span>}
                    </div>
                    <p style={{ margin: "5px 0 0", fontSize: 12, color: "#3A3933", lineHeight: 1.55, fontFamily: "Fraunces", fontStyle: "italic", textWrap: "pretty" }}>{p.note}</p>
                  </div>);
              })}
            </div>
          </div>

          {/* Completion footer */}
          <div style={{ marginTop: 18, paddingTop: 12, borderTop: "1px solid #C8C5BC", display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ width: 16, height: 16, border: "1.5px solid #1A1A20", display: "inline-block" }}/>
            <span className="mono" style={{ fontSize: 9.5, color: PAPER_INK, letterSpacing: "0.22em" }}>DONE · TICK & FILE</span>
            <span style={{ flex: 1 }}/>
            <span className="mono" style={{ fontSize: 9, color: PAPER_FAINT, letterSpacing: "0.22em" }}>HANDS OFF AT {data.handoff}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const BLOCK_DATA_GH = {
  day: "TUE", time: "10:00 — 11:00", format: "3 × 20-MIN · SPLIT",
  title: "Roman trade routes.",
  subject: "gh",
  materials: ["Wall map · taped above kitchen island", "Carthage primary · printed × 4", "Pencils · 4, soft erasers", "Trade-route key · printed", "Margin sheets · one per child"],
  setup: "Wall map up before breakfast. Carthage primary on the bay-window table. Pencils in the basin tin.",
  shortcut: "Drop the third swap. Two rounds is enough — each child has done both.",
  lede: "Open with the Mediterranean. Two pairs in parallel — one tracing routes by hand, one reading the primary aloud — then they swap, twice.",
  steps: [
    "Gather at the wall map. Name the sea, name the three home cities (Rome, Carthage, Alexandria).",
    "Split: Group 1 (Leo + Max) at the map. Group 2 (Jack + Jane) at the bay window with the primary.",
    "Run 20 minutes. Two short bell tones. Swap. Run 20 more. Bell. Swap. Run 20 more.",
    "Reconvene at the map. Each child names one port that surprised them.",
  ],
  perChild: [
    { id: "leo",  tag: "MAP TABLE",    note: "Trace by hand, pencil only — Leo asked for fewer colors. Hold the line." },
    { id: "max",  tag: "MAP TABLE",    note: "Name each port aloud as Leo passes it. Cross-check against the legend. The legend is his." },
    { id: "jack", tag: "READING NOOK", note: "Read the Carthage primary slowly. Pause at every underlined word — pacing is the lesson here. If he speeds up, ask him to read the last sentence again." },
    { id: "jane", tag: "READING NOOK", note: "Annotate the margin with the meaning of each underlined word. One word per line. Glossary is on the back; she has it." },
  ],
  handoff: "11:00",
};

Object.assign(window, { WeekSheet, MaterialsMaster, BlockSheet, BLOCK_DATA_GH });
