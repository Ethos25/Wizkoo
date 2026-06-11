/* global React */
const { useState, useEffect, useRef } = React;

// =============================================================
// Shared data
// =============================================================
const DAYS = [
  { letter: "M", full: "Monday",    state: "done" },
  { letter: "T", full: "Tuesday",   state: "today" },
  { letter: "W", full: "Wednesday", state: "ahead" },
  { letter: "T", full: "Thursday",  state: "ahead", short: "Th" },
  { letter: "F", full: "Friday",    state: "ahead" },
];

const CLUSTERS_DEFAULT = [
  {
    id: "lab",
    name: "Bridge Architecture Lab",
    minutes: 50,
    blocks: 2,
    completed: 0,
    action: "Start",
    primarySubject: "math",
    blockList: [
      { id: "b1", title: "Bridge Shape Engineering Station", subject: "math",   minutes: 25, kind: "Hands-on" },
      { id: "b2", title: "Bridge Span Rice Measurement",     subject: "math",   minutes: 25, kind: "Hands-on" },
    ],
  },
  {
    id: "eps",
    name: "Engineering Problem Solving",
    minutes: 35,
    blocks: 3,
    completed: 0,
    action: "Start",
    primarySubject: "sci",
    blockList: [
      { id: "b3", title: "Load Distribution Read-Aloud",  subject: "la",  minutes: 10, kind: "Reading" },
      { id: "b4", title: "Tension and Compression Sketch", subject: "ca", minutes: 15, kind: "Studio" },
      { id: "b5", title: "Field Notes: Local Bridges",     subject: "gh", minutes: 10, kind: "Journal" },
    ],
  },
];

const SUBJECT = {
  la:   { name: "Language Arts",        deep: "var(--la-deep)",   bright: "var(--la-bright)" },
  math: { name: "Math",                  deep: "var(--math-deep)", bright: "var(--math-bright)" },
  sci:  { name: "Science",               deep: "var(--sci-deep)",  bright: "var(--sci-bright)" },
  gh:   { name: "Geography & History",   deep: "var(--gh-deep)",   bright: "var(--gh-bright)" },
  ca:   { name: "Creative Arts",         deep: "var(--ca-deep)",   bright: "var(--ca-bright)" },
};

// Hook: per-direction expanded cluster state
function useExpand(initial = null) {
  const [open, setOpen] = useState(initial);
  return [open, (id) => setOpen(prev => prev === id ? null : id)];
}

// Day strip — five letters, today highlighted, completed days marked subtly
// =============================================================

// Direction 1 — EDITORIAL
// Central choice: the day reads like the front page of a small newspaper.
// Massive Fraunces theme name dominates; clusters live below as
// numbered stories. Saffron used only as a small dateline mark.
// =============================================================
function Editorial({ clusters, openId, setOpen }) {
  return (
    <div className="frame" style={{ background: "var(--chalk)", paddingBottom: 80 }}>
      {/* Status bar */}
      <PhoneStatus tone="ink" />

      {/* Masthead */}
      <div style={{ padding: "8px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div className="mono" style={{ fontSize: 10, color: "var(--meta)" }}>The Plan · Vol. 16</div>
        <div className="mono" style={{ fontSize: 10, color: "var(--meta)" }}>Tue · 07:45</div>
      </div>

      {/* Day strip — typeset like a calendar rule */}
      <div style={{ padding: "14px 24px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 0, borderTop: "1.5px solid var(--ink)", borderBottom: "1px solid var(--rule)" }}>
          {DAYS.map((d, i) => (
            <button key={i} className="mono" style={{
              background: "transparent",
              border: "none",
              borderLeft: i === 0 ? "none" : "1px solid var(--rule)",
              padding: "10px 0 8px",
              fontSize: 11,
              color: d.state === "today" ? "var(--ink)" : "var(--faint)",
              fontWeight: d.state === "today" ? 700 : 400,
              position: "relative",
              cursor: "pointer",
            }}>
              {d.short || d.letter}
              {d.state === "done" && (
                <span style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", bottom: 2, width: 4, height: 4, borderRadius: 4, background: "var(--mid)" }} />
              )}
              {d.state === "today" && (
                <span style={{ position: "absolute", left: 0, right: 0, bottom: -1, height: 2, background: "var(--saffron)" }} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Dateline + Theme */}
      <div style={{ padding: "28px 24px 0" }}>
        <div className="mono" style={{ fontSize: 10, color: "var(--meta)", display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ display: "inline-block", width: 6, height: 6, background: "var(--saffron)" }} />
          Tuesday — Week 16
        </div>
        <h1 className="serif" style={{
          fontSize: 44, lineHeight: 1.02, margin: "10px 0 0",
          fontWeight: 600, letterSpacing: "-0.02em", color: "var(--ink)",
          textWrap: "balance",
        }}>
          Bridges <span style={{ fontStyle: "italic", fontWeight: 500 }}>and</span><br />Engineering.
        </h1>

        {/* Pace line — typeset as a single rule of running text */}
        <div style={{
          marginTop: 20,
          paddingTop: 14,
          borderTop: "1px solid var(--rule)",
          fontFamily: "Fraunces", fontSize: 14, color: "var(--mid)",
          fontStyle: "italic", lineHeight: 1.5,
        }}>
          847 of 900 hours · 28 weeks remain · <span style={{ color: "var(--ink)" }}>on pace</span>
          <span className="mono" style={{ marginLeft: 8, fontSize: 9, color: "var(--meta)", textDecoration: "underline", textUnderlineOffset: 3, fontStyle: "normal" }}>OPEN</span>
        </div>
      </div>

      {/* Clusters as numbered stories */}
      <div style={{ padding: "32px 0 0" }}>
        {clusters.map((c, i) => (
          <EditorialCluster key={c.id} c={c} index={i} open={openId === c.id} onToggle={() => setOpen(c.id)} />
        ))}
      </div>
    </div>
  );
}

function EditorialCluster({ c, index, open, onToggle }) {
  const sub = SUBJECT[c.primarySubject];
  return (
    <div style={{ borderTop: "1px solid var(--rule)" }}>
      <button onClick={onToggle} style={{
        width: "100%", textAlign: "left", background: "transparent", border: "none",
        padding: "20px 24px 18px", cursor: "pointer", display: "block",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div className="mono" style={{ fontSize: 10, color: "var(--meta)" }}>
            № {String(index + 1).padStart(2, "0")} · {sub.name}
          </div>
          <div className="mono" style={{ fontSize: 10, color: "var(--meta)" }}>
            {c.completed}/{c.blocks}
          </div>
        </div>
        <h2 className="serif" style={{
          fontSize: 26, lineHeight: 1.1, margin: "8px 0 0", fontWeight: 600,
          letterSpacing: "-0.01em", color: "var(--ink)",
        }}>
          {c.name}
        </h2>
        <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: "Fraunces", fontStyle: "italic", fontSize: 14, color: "var(--mid)" }}>
            about {c.minutes} min · {c.blocks} blocks
          </div>
          <span className="mono" style={{
            fontSize: 11, color: "var(--ink)",
            borderBottom: "1.5px solid var(--saffron)",
            paddingBottom: 2,
          }}>
            {c.action} →
          </span>
        </div>
      </button>

      {open && (
        <div style={{ padding: "0 24px 22px", background: "transparent" }}>
          <div style={{ borderTop: "1px dashed var(--rule)", paddingTop: 14 }}>
            {c.blockList.map((b, i) => {
              const s = SUBJECT[b.subject];
              return (
                <div key={b.id} style={{ display: "flex", gap: 14, padding: "10px 0", borderBottom: i === c.blockList.length - 1 ? "none" : "1px solid var(--rule)" }}>
                  <div style={{ width: 28, flexShrink: 0 }}>
                    <div className="mono" style={{ fontSize: 10, color: "var(--meta)" }}>{String(i + 1).padStart(2, "0")}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="mono" style={{ fontSize: 9, color: s.deep }}>
                      <span style={{ display: "inline-block", width: 6, height: 6, background: s.bright, marginRight: 6, verticalAlign: "middle" }} />
                      {s.name} · {b.kind}
                    </div>
                    <div className="serif" style={{ fontSize: 16, lineHeight: 1.25, marginTop: 4, color: "var(--ink)", fontWeight: 600 }}>
                      {b.title}
                    </div>
                    <div style={{ fontFamily: "Fraunces", fontStyle: "italic", fontSize: 12, color: "var(--mid)", marginTop: 2 }}>
                      {b.minutes} min
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================
// Direction 2 — PAPER & LIGHT (the saffron-shadow direction)
// Central choice: cluster cards as physical paper objects with the
// brand's signature 8/8 saffron shadow. The screen feels like a
// pinned bulletin: cards are warm, lifted, tactile.
// =============================================================
function PaperLight({ clusters, openId, setOpen }) {
  return (
    <div className="frame" style={{ background: "var(--chalk)", paddingBottom: 90 }}>
      <PhoneStatus tone="ink" />
      <div style={{ padding: "10px 22px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ width: 8, height: 8, background: "var(--saffron)", borderRadius: 8, boxShadow: "0 0 14px var(--saffron)" }} />
          <span className="mono" style={{ fontSize: 10, color: "var(--meta)" }}>TODAY · 07:45</span>
        </div>
        <button className="mono" style={{ fontSize: 10, color: "var(--meta)", background: "transparent", border: "none", letterSpacing: "0.14em" }}>
          MENU
        </button>
      </div>

      {/* Day strip — pebbles on a line */}
      <div style={{ padding: "20px 22px 0" }}>
        <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ position: "absolute", left: 14, right: 14, top: "50%", height: 1, background: "var(--rule)", zIndex: 0 }} />
          {DAYS.map((d, i) => {
            const isToday = d.state === "today";
            const isDone = d.state === "done";
            return (
              <button key={i} style={{
                position: "relative",
                width: 40, height: 40, borderRadius: 40,
                background: isToday ? "var(--ink)" : isDone ? "var(--paper)" : "var(--chalk)",
                color: isToday ? "var(--chalk)" : isDone ? "var(--ink)" : "var(--faint)",
                border: isToday ? "none" : "1px solid var(--rule)",
                fontFamily: "Plus Jakarta Sans", fontWeight: isToday ? 700 : 500,
                fontSize: 14,
                cursor: "pointer",
                boxShadow: isToday ? "4px 4px 0 0 var(--saffron)" : "none",
                zIndex: 1,
              }}>
                {d.short || d.letter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Day header */}
      <div style={{ padding: "30px 22px 0" }}>
        <div className="mono" style={{ fontSize: 10, color: "var(--meta)" }}>WEEK 16 · TUESDAY</div>
        <h1 className="serif" style={{
          margin: "8px 0 0", fontSize: 36, lineHeight: 1.05, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--ink)",
        }}>
          Bridges <span style={{ fontStyle: "italic", fontWeight: 500 }}>and</span> Engineering
        </h1>

        {/* Pace */}
        <button style={{
          marginTop: 16, padding: "12px 14px", width: "100%",
          background: "var(--paper)", border: "1px solid var(--rule)", borderRadius: 14,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          textAlign: "left", cursor: "pointer",
        }}>
          <div>
            <div className="mono" style={{ fontSize: 9, color: "var(--meta)" }}>PACE</div>
            <div style={{ fontSize: 13, color: "var(--ink)", marginTop: 3, fontWeight: 500 }}>
              847 / 900 hrs · 28 weeks left · <span style={{ fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 500 }}>on pace</span>
            </div>
          </div>
          <PaceArc value={0.94} />
        </button>
      </div>

      {/* Clusters */}
      <div style={{ padding: "26px 22px 0", display: "flex", flexDirection: "column", gap: 22 }}>
        <div className="mono" style={{ fontSize: 10, color: "var(--meta)" }}>TODAY · 2 CLUSTERS</div>
        {clusters.map((c, i) => (
          <PaperCluster key={c.id} c={c} index={i} open={openId === c.id} onToggle={() => setOpen(c.id)} />
        ))}
      </div>
    </div>
  );
}

function PaperCluster({ c, index, open, onToggle }) {
  const sub = SUBJECT[c.primarySubject];
  return (
    <div>
      <div onClick={onToggle} style={{
        background: "var(--paper)",
        border: "1.5px solid var(--ink)",
        borderRadius: 4,
        padding: "18px 18px 16px",
        boxShadow: "8px 8px 0 0 var(--saffron)",
        cursor: "pointer",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div className="mono" style={{ fontSize: 10, color: sub.deep, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, background: sub.bright, borderRadius: 1 }} />
            {sub.name.toUpperCase()}
          </div>
          <div className="mono" style={{ fontSize: 10, color: "var(--meta)" }}>{String(index + 1).padStart(2, "0")} OF 02</div>
        </div>
        <h2 className="serif" style={{
          margin: "10px 0 0", fontSize: 24, lineHeight: 1.12, fontWeight: 600, letterSpacing: "-0.01em",
        }}>
          {c.name}
        </h2>
        <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: "Fraunces", fontStyle: "italic", fontSize: 13, color: "var(--mid)" }}>
            about {c.minutes} min · {c.blocks} blocks · {c.completed}/{c.blocks} done
          </div>
        </div>
        <div style={{ marginTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 14, borderTop: "1px solid var(--rule)" }}>
          <span className="mono" style={{ fontSize: 10, color: "var(--meta)" }}>{open ? "TAP TO COLLAPSE" : "TAP TO EXPAND"}</span>
          <button onClick={(e) => e.stopPropagation()} style={{
            background: "var(--ink)", color: "var(--chalk)",
            border: "none", padding: "10px 18px", borderRadius: 999,
            fontFamily: "Plus Jakarta Sans", fontWeight: 600, fontSize: 13,
            cursor: "pointer",
          }}>
            {c.action} →
          </button>
        </div>
      </div>

      {open && (
        <div style={{ marginTop: 14, paddingLeft: 8, display: "flex", flexDirection: "column", gap: 10 }}>
          {c.blockList.map((b, i) => {
            const s = SUBJECT[b.subject];
            return (
              <div key={b.id} style={{
                background: "var(--chalk)",
                border: "1px solid var(--rule)",
                borderLeft: `3px solid ${s.bright}`,
                borderRadius: 3,
                padding: "12px 14px",
                display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="mono" style={{ fontSize: 9, color: s.deep }}>{s.name.toUpperCase()} · {b.kind.toUpperCase()}</div>
                  <div style={{ fontFamily: "Fraunces", fontWeight: 600, fontSize: 15, marginTop: 2, color: "var(--ink)" }}>
                    {b.title}
                  </div>
                </div>
                <div className="mono" style={{ fontSize: 10, color: "var(--meta)", flexShrink: 0 }}>{b.minutes}M</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PaceArc({ value }) {
  const r = 14;
  const c = 2 * Math.PI * r;
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" style={{ flexShrink: 0 }}>
      <circle cx="18" cy="18" r={r} fill="none" stroke="var(--rule)" strokeWidth="2" />
      <circle cx="18" cy="18" r={r} fill="none" stroke="var(--saffron)" strokeWidth="2"
        strokeDasharray={`${c * value} ${c}`}
        strokeLinecap="round"
        transform="rotate(-90 18 18)" />
    </svg>
  );
}

// =============================================================
// Direction 3 — INDEX (watchmaker's plate)
// Central choice: a quiet, almost diagrammatic register of the day.
// Type does the work; rules and registers do the work; the day reads
// like a watch dial — each piece labeled, no card chrome at all.
// =============================================================
function Index({ clusters, openId, setOpen }) {
  return (
    <div className="frame" style={{ background: "var(--chalk)", paddingBottom: 80 }}>
      <PhoneStatus tone="ink" />

      <div style={{ padding: "10px 22px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="mono" style={{ fontSize: 10, color: "var(--meta)" }}>WIZKOO · THE PLAN</div>
        <div className="mono" style={{ fontSize: 10, color: "var(--meta)" }}>07:45 LOCAL</div>
      </div>

      {/* Day strip — register marks */}
      <div style={{ padding: "20px 22px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", height: 36 }}>
          {DAYS.map((d, i) => {
            const isToday = d.state === "today";
            const isDone = d.state === "done";
            return (
              <button key={i} style={{
                background: "transparent", border: "none", cursor: "pointer",
                width: 56, padding: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
              }}>
                <div style={{
                  width: isToday ? 14 : 1.5,
                  height: isToday ? 14 : 16,
                  background: isToday ? "var(--saffron)" : isDone ? "var(--ink)" : "var(--rule)",
                  borderRadius: isToday ? 14 : 0,
                }} />
                <span className="mono" style={{
                  fontSize: 10,
                  color: isToday ? "var(--ink)" : "var(--faint)",
                  fontWeight: isToday ? 700 : 400,
                }}>
                  {d.short || d.letter}
                </span>
              </button>
            );
          })}
        </div>
        <div style={{ height: 1, background: "var(--rule)", marginTop: 6 }} />
      </div>

      {/* Day header — labeled register */}
      <div style={{ padding: "26px 22px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "70px 1fr", rowGap: 4, columnGap: 12 }}>
          <div className="mono" style={{ fontSize: 10, color: "var(--meta)", paddingTop: 4 }}>DAY</div>
          <div style={{ fontFamily: "Fraunces", fontWeight: 600, fontSize: 22, color: "var(--ink)", letterSpacing: "-0.01em" }}>Tuesday</div>
          <div className="mono" style={{ fontSize: 10, color: "var(--meta)", paddingTop: 4 }}>THEME</div>
          <div style={{ fontFamily: "Fraunces", fontWeight: 600, fontSize: 22, color: "var(--ink)", letterSpacing: "-0.01em" }}>
            Bridges <span style={{ fontStyle: "italic", fontWeight: 500 }}>and</span> Engineering
          </div>
          <div className="mono" style={{ fontSize: 10, color: "var(--meta)", paddingTop: 4 }}>WEEK</div>
          <div style={{ fontFamily: "Fraunces", fontWeight: 600, fontSize: 22, color: "var(--ink)", letterSpacing: "-0.01em" }}>Sixteen</div>
        </div>
      </div>

      {/* Pace as a tiny barometer */}
      <div style={{ padding: "22px 22px 0" }}>
        <div style={{ borderTop: "1px solid var(--rule)", paddingTop: 12 }}>
          <div className="mono" style={{ fontSize: 10, color: "var(--meta)", marginBottom: 8 }}>PACE</div>
          <PaceLine value={0.94} />
          <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "var(--mid)" }}>
            <span><strong style={{ color: "var(--ink)", fontWeight: 600 }}>847</strong> / 900 hrs</span>
            <span>28 weeks remain</span>
            <span style={{ fontFamily: "Fraunces", fontStyle: "italic", color: "var(--ink)" }}>on pace</span>
          </div>
        </div>
      </div>

      {/* Clusters as register entries */}
      <div style={{ padding: "26px 22px 0" }}>
        <div className="mono" style={{ fontSize: 10, color: "var(--meta)", marginBottom: 8 }}>TODAY · IN ORDER</div>
        <div style={{ borderTop: "1.5px solid var(--ink)" }}>
          {clusters.map((c, i) => (
            <IndexCluster key={c.id} c={c} index={i} open={openId === c.id} onToggle={() => setOpen(c.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PaceLine({ value }) {
  return (
    <div style={{ position: "relative", height: 8 }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 1, background: "var(--rule)" }} />
      <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: `${value * 100}%`, height: 1.5, background: "var(--ink)" }} />
      <div style={{ position: "absolute", left: `${value * 100}%`, top: "50%", transform: "translate(-50%,-50%)", width: 10, height: 10, background: "var(--saffron)", borderRadius: 10 }} />
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
        <div key={i} style={{ position: "absolute", left: `${t * 100}%`, top: 0, width: 1, height: 4, background: "var(--rule)" }} />
      ))}
    </div>
  );
}

function IndexCluster({ c, index, open, onToggle }) {
  const sub = SUBJECT[c.primarySubject];
  return (
    <div style={{ borderBottom: "1px solid var(--rule)" }}>
      <button onClick={onToggle} style={{
        width: "100%", textAlign: "left", background: "transparent", border: "none",
        padding: "16px 0 14px", cursor: "pointer", display: "block",
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "32px 1fr auto", columnGap: 10, alignItems: "baseline" }}>
          <div className="mono" style={{ fontSize: 10, color: "var(--meta)" }}>
            {String(index + 1).padStart(2, "0")}
          </div>
          <div>
            <div style={{ fontFamily: "Fraunces", fontWeight: 600, fontSize: 19, color: "var(--ink)", lineHeight: 1.18, letterSpacing: "-0.01em" }}>
              {c.name}
            </div>
            <div className="mono" style={{ fontSize: 10, color: sub.deep, marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 6, height: 6, background: sub.bright }} />
              {sub.name.toUpperCase()} · {c.blocks} BLOCKS · {c.minutes}M
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="mono" style={{ fontSize: 10, color: "var(--meta)" }}>{c.completed}/{c.blocks}</div>
            <div className="mono" style={{
              fontSize: 11, color: "var(--ink)", marginTop: 8,
              borderBottom: "1.5px solid var(--saffron)", paddingBottom: 1,
              display: "inline-block",
            }}>
              {c.action}
            </div>
          </div>
        </div>
      </button>

      {open && (
        <div style={{ paddingBottom: 14 }}>
          <div style={{ borderTop: "1px dotted var(--rule)" }}>
            {c.blockList.map((b, i) => {
              const s = SUBJECT[b.subject];
              return (
                <div key={b.id} style={{
                  display: "grid", gridTemplateColumns: "32px 1fr auto", columnGap: 10, padding: "10px 0",
                  borderBottom: i === c.blockList.length - 1 ? "none" : "1px dotted var(--rule)",
                }}>
                  <div className="mono" style={{ fontSize: 10, color: "var(--meta)" }}>
                    .{String(i + 1)}
                  </div>
                  <div>
                    <div style={{ fontFamily: "Fraunces", fontWeight: 500, fontSize: 15, color: "var(--ink)", lineHeight: 1.25 }}>
                      {b.title}
                    </div>
                    <div className="mono" style={{ fontSize: 9, color: s.deep, marginTop: 4 }}>
                      <span style={{ display: "inline-block", width: 5, height: 5, background: s.bright, marginRight: 6, verticalAlign: "middle" }} />
                      {s.name.toUpperCase()} · {b.kind.toUpperCase()}
                    </div>
                  </div>
                  <div className="mono" style={{ fontSize: 10, color: "var(--meta)", textAlign: "right" }}>
                    {b.minutes}M
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================
// Direction 4 — PLANETARIUM (atmospheric)
// Central choice: the marketing site's planetarium footer becomes the
// ambient surface of the day. Top of the screen holds a deep ink sky
// with the day as a single stanza of warm light; clusters live on
// chalk below as quiet, color-led tiles.
// =============================================================
function Planetarium({ clusters, openId, setOpen }) {
  return (
    <div className="frame" style={{ background: "var(--chalk)", paddingBottom: 80 }}>
      {/* Sky */}
      <div style={{
        background: "radial-gradient(120% 90% at 80% 0%, #1d2350 0%, #0C1020 60%, #050714 100%)",
        color: "#F2EFE1",
        padding: "0 0 26px",
        position: "relative",
        overflow: "hidden",
      }}>
        <PhoneStatus tone="chalk" />
        {/* stars */}
        <Stars />

        <div style={{ padding: "8px 22px 0", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 2 }}>
          <span className="mono" style={{ fontSize: 10, color: "rgba(248,244,233,0.55)" }}>TUE · 07:45</span>
          <span className="mono" style={{ fontSize: 10, color: "rgba(248,244,233,0.55)" }}>WEEK 16</span>
        </div>

        {/* Day strip */}
        <div style={{ padding: "20px 22px 0", position: "relative", zIndex: 2 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 4 }}>
            {DAYS.map((d, i) => {
              const isToday = d.state === "today";
              const isDone = d.state === "done";
              return (
                <button key={i} style={{
                  background: "transparent", border: "none", cursor: "pointer", padding: 0,
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                }}>
                  <span className="mono" style={{
                    fontSize: 11,
                    color: isToday ? "var(--saffron)" : isDone ? "rgba(248,244,233,0.7)" : "rgba(248,244,233,0.35)",
                    fontWeight: isToday ? 700 : 400,
                  }}>
                    {d.short || d.letter}
                  </span>
                  <span style={{
                    width: isToday ? 8 : isDone ? 4 : 3,
                    height: isToday ? 8 : isDone ? 4 : 3,
                    borderRadius: 8,
                    background: isToday ? "var(--saffron)" : isDone ? "rgba(248,244,233,0.7)" : "rgba(248,244,233,0.25)",
                    boxShadow: isToday ? "0 0 12px rgba(232,175,56,0.7)" : "none",
                  }} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Stanza */}
        <div style={{ padding: "30px 22px 4px", position: "relative", zIndex: 2 }}>
          <div className="mono" style={{ fontSize: 10, color: "rgba(232,175,56,0.85)" }}>TODAY</div>
          <h1 className="serif" style={{
            fontSize: 36, lineHeight: 1.05, fontWeight: 600, letterSpacing: "-0.02em",
            margin: "10px 0 0", color: "#F8F4E9",
            textWrap: "balance",
          }}>
            Bridges <span style={{ fontStyle: "italic", fontWeight: 500, color: "var(--saffron)" }}>and</span><br />Engineering.
          </h1>
        </div>

        {/* Pace */}
        <div style={{ padding: "20px 22px 0", position: "relative", zIndex: 2 }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            paddingTop: 14, borderTop: "1px solid rgba(248,244,233,0.15)",
            fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "rgba(248,244,233,0.7)",
          }}>
            <span>847 / 900 hrs</span>
            <span style={{ width: 4, height: 4, background: "rgba(248,244,233,0.3)", borderRadius: 4 }} />
            <span>28 weeks remain</span>
            <span style={{ width: 4, height: 4, background: "rgba(248,244,233,0.3)", borderRadius: 4 }} />
            <span style={{ fontFamily: "Fraunces", fontStyle: "italic", color: "var(--saffron)" }}>on pace</span>
          </div>
        </div>
      </div>

      {/* Sunrise — soft saffron wash where sky meets chalk */}
      <div style={{
        height: 14,
        background: "linear-gradient(to bottom, rgba(232,175,56,0.18), rgba(248,244,233,0))",
        marginTop: -14, position: "relative", zIndex: 1,
      }} />

      {/* Clusters on chalk */}
      <div style={{ padding: "20px 22px 0" }}>
        <div className="mono" style={{ fontSize: 10, color: "var(--meta)", marginBottom: 14 }}>TWO CLUSTERS · IN ORDER</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {clusters.map((c, i) => (
            <PlanetariumCluster key={c.id} c={c} index={i} open={openId === c.id} onToggle={() => setOpen(c.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Stars() {
  // deterministic small star field
  const seeds = [
    [12, 22, 1], [40, 60, 1.5], [70, 30, 1], [120, 18, 1.2], [180, 80, 1],
    [220, 36, 1.5], [260, 14, 1], [300, 70, 1], [340, 28, 1.4], [50, 110, 1],
    [110, 130, 1.2], [200, 120, 1], [280, 145, 1.3], [350, 100, 1], [80, 170, 1],
    [160, 60, 0.9], [240, 95, 1.1], [20, 80, 0.8], [330, 160, 1.2], [150, 175, 0.9],
  ];
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none" }}>
      {seeds.map(([x, y, r], i) => (
        <span key={i} style={{
          position: "absolute", left: x, top: y,
          width: r * 1.6, height: r * 1.6,
          background: "rgba(248,244,233,0.7)", borderRadius: 4,
          boxShadow: "0 0 4px rgba(248,244,233,0.4)",
        }} />
      ))}
    </div>
  );
}

function PlanetariumCluster({ c, index, open, onToggle }) {
  const sub = SUBJECT[c.primarySubject];
  return (
    <div>
      <div onClick={onToggle} style={{
        background: "var(--paper)",
        borderRadius: 16,
        border: "1px solid var(--rule)",
        padding: "16px 16px 14px",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* color halo on the corner */}
        <div style={{
          position: "absolute", top: -30, right: -30, width: 90, height: 90,
          borderRadius: 90,
          background: `radial-gradient(circle, ${sub.bright}40 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 1 }}>
          <div className="mono" style={{ fontSize: 10, color: sub.deep, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: 6, background: sub.bright }} />
            {sub.name.toUpperCase()}
          </div>
          <div className="mono" style={{ fontSize: 10, color: "var(--meta)" }}>
            {String(index + 1).padStart(2, "0")} · {c.completed}/{c.blocks}
          </div>
        </div>
        <h2 className="serif" style={{
          margin: "12px 0 0", fontSize: 22, lineHeight: 1.15, fontWeight: 600, letterSpacing: "-0.01em", color: "var(--ink)",
        }}>
          {c.name}
        </h2>
        <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: "Fraunces", fontStyle: "italic", fontSize: 13, color: "var(--mid)" }}>
            about {c.minutes} min · {c.blocks} blocks
          </div>
          <button onClick={(e) => e.stopPropagation()} style={{
            background: "transparent", color: "var(--ink)",
            border: `1.5px solid var(--ink)`, padding: "8px 16px", borderRadius: 999,
            fontFamily: "Plus Jakarta Sans", fontWeight: 600, fontSize: 12,
            cursor: "pointer", letterSpacing: "0.02em",
          }}>
            {c.action}
          </button>
        </div>
      </div>

      {open && (
        <div style={{ marginTop: 8, padding: "8px 4px 0", display: "flex", flexDirection: "column", gap: 6 }}>
          {c.blockList.map((b, i) => {
            const s = SUBJECT[b.subject];
            return (
              <div key={b.id} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 14px", background: "transparent",
              }}>
                <span style={{ width: 10, height: 10, borderRadius: 10, background: s.bright, flexShrink: 0, boxShadow: `0 0 0 3px ${s.bright}25` }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "Fraunces", fontWeight: 600, fontSize: 15, color: "var(--ink)", lineHeight: 1.2 }}>{b.title}</div>
                  <div className="mono" style={{ fontSize: 9, color: s.deep, marginTop: 3 }}>{s.name.toUpperCase()} · {b.kind.toUpperCase()}</div>
                </div>
                <div className="mono" style={{ fontSize: 10, color: "var(--meta)", flexShrink: 0 }}>{b.minutes}M</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// =============================================================
// Phone status bar (very minimal — keeps frame believable)
// =============================================================
function PhoneStatus({ tone = "ink" }) {
  const c = tone === "chalk" ? "rgba(248,244,233,0.85)" : "var(--ink)";
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "14px 22px 0", fontFamily: "Plus Jakarta Sans", fontWeight: 600, fontSize: 13,
      color: c,
    }}>
      <span>9:41</span>
      <span style={{ display: "flex", gap: 5, alignItems: "center" }}>
        <span style={{ width: 16, height: 8, border: `1.2px solid ${c}`, borderRadius: 2, position: "relative" }}>
          <span style={{ position: "absolute", inset: 1.5, background: c, width: "70%" }} />
        </span>
      </span>
    </div>
  );
}

// expose
Object.assign(window, {
  Editorial, PaperLight, Index, Planetarium,
  CLUSTERS_DEFAULT, useExpand, SUBJECT, DAYS,
});
