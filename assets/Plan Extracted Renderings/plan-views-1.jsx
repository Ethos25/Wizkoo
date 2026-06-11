/* global React, KIDS, SUBJECTS, COLORS, NameB, ChipB, SubjectMark */

// =============================================================
// VIEW 1 — TODAY (re-rendered with locked treatments)
// Inherits Ledger Quieter grammar from prior locked spec.
// =============================================================
function CollapsedRow({ time, subject, kidsIds, status }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "70px 110px 1fr 100px", alignItems: "center", padding: "16px 24px", borderBottom: "1px solid #ECE7DA" }}>
      <div className="mono" style={{ fontSize: 10, color: "var(--meta)", letterSpacing: "0.2em" }}>{time}</div>
      <SubjectMark subject={subject} width={84}/>
      <div style={{ display: "flex", gap: 16, alignItems: "baseline" }}>
        {kidsIds.map(id => { const k = KIDS.find(x => x.id === id); return <NameB key={id} kid={k} scale={0.78}/>; })}
      </div>
      <div className="mono" style={{ fontSize: 9, color: status === "DONE" ? "var(--mid)" : "var(--meta)", letterSpacing: "0.2em", textAlign: "right" }}>{status}</div>
    </div>
  );
}

function ExpandedCluster() {
  return (
    <div style={{ background: "#FAFAFA", padding: "26px 30px 28px", borderTop: "2px solid var(--ink)", borderBottom: "2px solid var(--ink)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "70px 1fr 110px", alignItems: "flex-start", gap: 16 }}>
        <div className="mono" style={{ fontSize: 10, color: "var(--ink)", letterSpacing: "0.2em", paddingTop: 4 }}>10:00</div>
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 500, fontSize: 22, letterSpacing: "-0.018em", color: "var(--ink)", lineHeight: 1 }}>Roman trade routes.</span>
            <SubjectMark subject="gh" width={84}/>
            <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>3 × 20-MIN · SPLIT</span>
          </div>
          <p style={{ margin: "10px 0 0", fontSize: 12, color: "var(--mid)", lineHeight: 1.5, maxWidth: 540, textWrap: "pretty" }}>
            The map opens with the Mediterranean. Group 1 traces routes by hand on the wall map. Group 2 reads the Carthage primary source aloud, then they swap.
          </p>
        </div>
        <div className="mono" style={{ fontSize: 9, color: "var(--saffron)", letterSpacing: "0.20em", textAlign: "right", paddingTop: 6 }}>NOW</div>
      </div>

      <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "70px 1fr", gap: 16 }}>
        <div/>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          {[
            { label: "GROUP ONE · MAP TABLE",     ids: ["leo","max"],   tasks: { leo: "tracing routes · pencil only", max: "naming ports · checking against legend" }, materials: "wall map · graphite · trade-route key" },
            { label: "GROUP TWO · READING NOOK",  ids: ["jack","jane"], tasks: { jack: "Carthage source · read aloud", jane: "annotating · margin notes" },              materials: "printed primary · pencil · margin sheet" },
          ].map((g, i) => (
            <div key={i} style={{ background: "var(--chalk)", padding: "18px 18px 20px", border: "1px solid #ECE7DA" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.22em" }}>{g.label}</span>
                <span className="mono" style={{ fontSize: 9, color: "var(--ink)", letterSpacing: "0.20em" }}>0:08 / 0:20</span>
              </div>
              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                {g.ids.map(id => { const k = KIDS.find(x => x.id === id);
                  return (
                    <div key={id} style={{ display: "grid", gridTemplateColumns: "100px 1fr", alignItems: "center", columnGap: 12 }}>
                      <NameB kid={k} scale={1}/>
                      <span style={{ fontSize: 11, color: "var(--mid)", lineHeight: 1.4 }}>{g.tasks[id]}</span>
                    </div>);
                })}
              </div>
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid #E0DED6", display: "flex", gap: 14 }}>
                <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>MATERIALS</span>
                <span style={{ fontSize: 11, color: "var(--ink)", fontStyle: "italic" }}>{g.materials}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "70px 1fr", gap: 16 }}>
        <div/>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "var(--paper)", border: "1px solid #ECE7DA" }}>
          <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.22em" }}>SWAP AT</span>
          <span className="mono" style={{ fontSize: 10, color: "var(--ink)", letterSpacing: "0.18em" }}>0:20 → 0:40 → 0:60</span>
          <span style={{ flex: 1 }}/>
          <span style={{ fontSize: 11, color: "var(--mid)", fontStyle: "italic" }}>Two short bell tones at the swap. Materials stay on the table.</span>
        </div>
      </div>
    </div>
  );
}

function TodayView() {
  return (
    <div style={{ width: 1080, minHeight: 820, background: "var(--chalk)", fontFamily: "Plus Jakarta Sans", color: "var(--ink)", padding: "0 0 40px" }}>
      <div style={{ padding: "32px 40px 22px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "1px solid #E0DED6" }}>
        <div>
          <div className="mono" style={{ fontSize: 10, color: "var(--meta)", letterSpacing: "0.24em" }}>TUESDAY · WEEK 16 · OCT 22</div>
          <h1 style={{ margin: "8px 0 0", fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 400, fontSize: 44, letterSpacing: "-0.02em", lineHeight: 1 }}>Today.</h1>
        </div>
        <div style={{ display: "flex", gap: 26, alignItems: "baseline" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.22em" }}>WITH YOU</span>
            <div style={{ display: "flex", gap: 14, alignItems: "baseline" }}>
              {KIDS.map(k => <NameB key={k.id} kid={k} scale={0.78}/>)}
            </div>
          </div>
          <div style={{ width: 1, height: 28, background: "#DCD6C5" }}/>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.22em" }}>WEATHER</span>
            <span style={{ fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 400, fontSize: 16, color: "var(--ink)" }}>cool · clear · 14°</span>
          </div>
        </div>
      </div>
      <div style={{ background: "var(--paper)" }}>
        <CollapsedRow time="08:30" subject="la"   kidsIds={["leo","max","jack","jane"]} status="DONE"/>
        <CollapsedRow time="09:15" subject="math" kidsIds={["leo","max","jack","jane"]} status="DONE"/>
        <ExpandedCluster/>
        <CollapsedRow time="11:30" subject="sci"  kidsIds={["leo","max","jack","jane"]} status="UPCOMING"/>
        <CollapsedRow time="14:00" subject="ca"   kidsIds={["leo","max","jack","jane"]} status="UPCOMING"/>
        <CollapsedRow time="15:30" subject="pe"   kidsIds={["leo","max"]}                status="UPCOMING"/>
      </div>
      <div style={{ padding: "20px 40px 0", display: "flex", gap: 28, alignItems: "center", color: "var(--meta)" }}>
        <span className="mono" style={{ fontSize: 9, letterSpacing: "0.22em" }}>NEXT HANDOFF</span>
        <span style={{ fontSize: 12, fontStyle: "italic", fontFamily: "Fraunces", color: "var(--ink)" }}>Sam picks up Leo & Max at 15:15 for swim.</span>
        <span style={{ flex: 1 }}/>
        <span className="mono" style={{ fontSize: 9, letterSpacing: "0.22em" }}>RECAP UNLOCKS</span>
        <span style={{ fontSize: 12, fontStyle: "italic", fontFamily: "Fraunces", color: "var(--ink)" }}>17:30</span>
      </div>
    </div>
  );
}

// =============================================================
// VIEW 2 — WEEK
// Five-day grid with subject underlines on every cluster row.
// Children do not appear in default Week View state.
// =============================================================
const WEEK_DATA = [
  { day: "MON", date: "21", clusters: [
    { time: "08:30", title: "Sentence patterns", subject: "la"   },
    { time: "09:15", title: "Place value drill", subject: "math" },
    { time: "10:00", title: "Plant cells",        subject: "sci"  },
    { time: "11:30", title: "Watercolor study",   subject: "ca"   },
  ]},
  { day: "TUE", date: "22", today: true, clusters: [
    { time: "08:30", title: "Reading log",                  subject: "la"   },
    { time: "09:15", title: "Fractions of a whole",         subject: "math" },
    { time: "10:00", title: "Roman trade routes", subject: "gh", current: true, split: true },
    { time: "11:30", title: "Lab notebook",                 subject: "sci"  },
    { time: "14:00", title: "Charcoal still life",          subject: "ca"   },
    { time: "15:30", title: "Swim · Leo + Max",             subject: "pe"   },
  ]},
  { day: "WED", date: "23", clusters: [
    { time: "08:30", title: "Vocabulary",        subject: "la"   },
    { time: "09:15", title: "Long division",     subject: "math" },
    { time: "10:00", title: "Carthage primary",  subject: "gh"   },
    { time: "11:30", title: "Magnets",           subject: "sci"  },
    { time: "14:00", title: "Group sing",        subject: "ca"   },
  ]},
  { day: "THU", date: "24", clusters: [
    { time: "08:30", title: "Composition",       subject: "la"   },
    { time: "09:15", title: "Geometry · angles", subject: "math" },
    { time: "10:00", title: "Roman roads",       subject: "gh"   },
    { time: "11:30", title: "Field sketch",      subject: "sci", split: true },
    { time: "15:30", title: "Run · all four",    subject: "pe"   },
  ]},
  { day: "FRI", date: "25", clusters: [
    { time: "08:30", title: "Recitation",        subject: "la"   },
    { time: "09:15", title: "Word problems",     subject: "math" },
    { time: "10:00", title: "Atlas day",         subject: "gh"   },
    { time: "14:00", title: "Studio · finals",   subject: "ca"   },
  ]},
];

function WeekView() {
  return (
    <div style={{ width: 1240, minHeight: 820, background: "var(--chalk)", fontFamily: "Plus Jakarta Sans", color: "var(--ink)", padding: "0 0 40px" }}>
      <div style={{ padding: "32px 40px 22px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "1px solid #E0DED6" }}>
        <div>
          <div className="mono" style={{ fontSize: 10, color: "var(--meta)", letterSpacing: "0.24em" }}>WEEK 16 · OCT 21–25</div>
          <h1 style={{ margin: "8px 0 0", fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 400, fontSize: 44, letterSpacing: "-0.02em", lineHeight: 1 }}>The week.</h1>
        </div>
        <div style={{ display: "flex", gap: 26, alignItems: "baseline" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.22em" }}>WITH YOU</span>
            <div style={{ display: "flex", gap: 14, alignItems: "baseline" }}>
              {KIDS.map(k => <NameB key={k.id} kid={k} scale={0.78}/>)}
            </div>
          </div>
          <div style={{ width: 1, height: 28, background: "#DCD6C5" }}/>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.22em" }}>PACE</span>
            <span style={{ fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 400, fontSize: 16, color: "var(--ink)" }}>on track · 24 of 26</span>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", background: "var(--paper)" }}>
        {WEEK_DATA.map(d => (
          <div key={d.day} style={{ borderRight: "1px solid #ECE7DA", padding: "20px 18px 24px", background: d.today ? "#FAFAFA" : "transparent", position: "relative" }}>
            {d.today && <span style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "var(--saffron)" }}/>}
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span className="mono" style={{ fontSize: 10, color: d.today ? "var(--ink)" : "var(--meta)", letterSpacing: "0.22em" }}>{d.day}</span>
              <span style={{ fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 400, fontSize: 22, color: "var(--ink)", letterSpacing: "-0.02em" }}>{d.date}</span>
              {d.today && <span className="mono" style={{ fontSize: 9, color: "var(--saffron)", letterSpacing: "0.22em", marginLeft: "auto" }}>TODAY</span>}
            </div>
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
              {d.clusters.map((c, i) => (
                <div key={i} style={{ paddingBottom: 11, borderBottom: i < d.clusters.length - 1 ? "1px solid #ECE7DA" : "none", background: c.current ? "#F2EEE0" : "transparent", margin: c.current ? "-4px -8px 0" : 0, padding: c.current ? "8px 8px 12px" : "0 0 11px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>{c.time}</span>
                    {c.current && <span className="mono" style={{ fontSize: 8.5, color: "var(--saffron)", letterSpacing: "0.20em" }}>NOW</span>}
                    {c.split && !c.current && <span className="mono" style={{ fontSize: 8.5, color: "var(--meta)", letterSpacing: "0.20em" }}>SPLIT</span>}
                  </div>
                  <div style={{ marginTop: 5, fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 500, fontSize: 14, color: "var(--ink)", letterSpacing: "-0.012em", lineHeight: 1.2 }}>{c.title}</div>
                  <div style={{ marginTop: 6 }}><SubjectMark subject={c.subject} width={64} dense/></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: "18px 40px 0", display: "flex", gap: 28, alignItems: "center", color: "var(--meta)" }}>
        <span className="mono" style={{ fontSize: 9, letterSpacing: "0.22em" }}>WEEK FOCUS</span>
        <span style={{ fontSize: 12, fontStyle: "italic", fontFamily: "Fraunces", color: "var(--ink)" }}>Roman trade · fractions · plant cells.</span>
        <span style={{ flex: 1 }}/>
        <span className="mono" style={{ fontSize: 9, letterSpacing: "0.22em" }}>RECAP UNLOCKS FRI</span>
        <span style={{ fontSize: 12, fontStyle: "italic", fontFamily: "Fraunces", color: "var(--ink)" }}>17:30</span>
      </div>
    </div>
  );
}

Object.assign(window, { TodayView, WeekView, CollapsedRow, ExpandedCluster, WEEK_DATA });
