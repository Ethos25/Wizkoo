/* global React, KIDS, SUBJECTS, COLORS, NameB, ChipB, SubjectMark */

// =============================================================
// VIEW 3 — CLUSTER (re-rendered)
// One cluster, full detail. Shows split-group state + per-child format.
// =============================================================
function ClusterView() {
  return (
    <div style={{ width: 1080, minHeight: 980, background: "var(--chalk)", fontFamily: "Plus Jakarta Sans", color: "var(--ink)", padding: "0 0 40px" }}>
      {/* Header */}
      <div style={{ padding: "32px 40px 22px", borderBottom: "1px solid #E0DED6" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div className="mono" style={{ fontSize: 10, color: "var(--meta)", letterSpacing: "0.24em" }}>TUESDAY · WEEK 16 · 10:00 — 11:00</div>
          <span className="mono" style={{ fontSize: 9, color: "var(--saffron)", letterSpacing: "0.22em" }}>NOW · 0:08 / 0:60</span>
        </div>
        <div style={{ marginTop: 10, display: "flex", alignItems: "baseline", gap: 18, flexWrap: "wrap" }}>
          <h1 style={{ margin: 0, fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 400, fontSize: 42, letterSpacing: "-0.02em", lineHeight: 1 }}>Roman trade routes.</h1>
          <SubjectMark subject="gh" width={92}/>
          <span className="mono" style={{ fontSize: 10, color: "var(--meta)", letterSpacing: "0.22em" }}>3 × 20-MIN · SPLIT</span>
        </div>
        <p style={{ margin: "14px 0 0", fontSize: 13, color: "var(--mid)", lineHeight: 1.55, maxWidth: 720, textWrap: "pretty" }}>
          The map opens with the Mediterranean. Two pairs work in parallel — one tracing routes by hand, one reading the Carthage primary aloud — then they swap, twice. By the third round each child has done both.
        </p>
      </div>

      {/* Split groups — full detail */}
      <div style={{ padding: "26px 40px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
        {[
          { label: "GROUP ONE · MAP TABLE",     locale: "KITCHEN ISLAND", ids: ["leo","max"],
            tasks: { leo: "Trace the three trade routes by hand. Pencil only — Leo asked for fewer colors.", max: "Name each port aloud as Leo passes it. Cross-check against the legend." },
            materials: ["wall map (taped above island)", "graphite, two pencils", "trade-route key (printed)"],
            mod: "PER-CHILD" },
          { label: "GROUP TWO · READING NOOK",  locale: "BAY WINDOW", ids: ["jack","jane"],
            tasks: { jack: "Read the Carthage primary aloud, slowly. Pause at each underlined word.", jane: "Annotate the margin with the meaning of each underlined word." },
            materials: ["Carthage primary (printed)", "pencil, soft eraser", "margin sheet (one per child)"],
            mod: "PER-CHILD" },
        ].map((g, i) => (
          <div key={i} style={{ background: "var(--paper)", padding: "20px 22px 22px", border: "1px solid #ECE7DA" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span className="mono" style={{ fontSize: 9.5, color: "var(--meta)", letterSpacing: "0.22em" }}>{g.label}</span>
              <span className="mono" style={{ fontSize: 9, color: "var(--ink)", letterSpacing: "0.22em" }}>{g.mod}</span>
            </div>
            <div className="mono" style={{ marginTop: 4, fontSize: 8.5, color: "var(--faint)", letterSpacing: "0.22em" }}>{g.locale}</div>

            <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 14 }}>
              {g.ids.map(id => { const k = KIDS.find(x => x.id === id);
                return (
                  <div key={id} style={{ display: "grid", gridTemplateColumns: "110px 1fr", alignItems: "baseline", columnGap: 14 }}>
                    <NameB kid={k} scale={1}/>
                    <span style={{ fontSize: 12, color: "var(--mid)", lineHeight: 1.5, textWrap: "pretty" }}>{g.tasks[id]}</span>
                  </div>);
              })}
            </div>

            <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid #E0DED6" }}>
              <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.22em" }}>MATERIALS</span>
              <ul style={{ margin: "8px 0 0", padding: "0 0 0 0", listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
                {g.materials.map((m, j) => (
                  <li key={j} style={{ fontSize: 12, color: "var(--ink)", lineHeight: 1.45, display: "flex", gap: 10 }}>
                    <span style={{ width: 14, height: 14, border: "1.2px solid #C8C5BC", marginTop: 2, flexShrink: 0 }}/>
                    <span>{m}</span>
                  </li>))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Swap rhythm */}
      <div style={{ padding: "22px 40px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", background: "var(--paper)", border: "1px solid #ECE7DA" }}>
          <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.22em" }}>SWAP AT</span>
          <span className="mono" style={{ fontSize: 10.5, color: "var(--ink)", letterSpacing: "0.18em" }}>0:20 → 0:40 → 0:60</span>
          <span style={{ flex: 1 }}/>
          <span style={{ fontSize: 12, color: "var(--mid)", fontStyle: "italic" }}>Two short bell tones at the swap. Materials stay on the table; the children move.</span>
        </div>
      </div>

      {/* Logistics + handoffs */}
      <div style={{ padding: "22px 40px 0", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18 }}>
        <div>
          <div className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.22em" }}>BEFORE START</div>
          <p style={{ margin: "6px 0 0", fontSize: 12, color: "var(--ink)", lineHeight: 1.5 }}>Wall map taped above the island. Carthage primary printed (one per child).</p>
        </div>
        <div>
          <div className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.22em" }}>HANDS OFF AT</div>
          <p style={{ margin: "6px 0 0", fontSize: 12, color: "var(--ink)", lineHeight: 1.5 }}>11:00. Materials back to bin. Lab notebook out for next.</p>
        </div>
        <div>
          <div className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.22em" }}>IF SHORT ON TIME</div>
          <p style={{ margin: "6px 0 0", fontSize: 12, color: "var(--ink)", lineHeight: 1.5 }}>Drop the third swap. Two rounds is enough — each child has done both.</p>
        </div>
      </div>

      {/* Start CTA */}
      <div style={{ padding: "28px 40px 0" }}>
        <button style={{ background: "var(--ink)", color: "var(--chalk)", border: "none", padding: "16px 28px", fontFamily: "Plus Jakarta Sans", fontWeight: 600, fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer" }}>Start the block →</button>
      </div>
    </div>
  );
}

// =============================================================
// VIEW 4 — BLOCK (new visual direction)
// Execution surface. Step-by-step + per-child differentiation +
// materials confirmation + completion + photo capture.
// =============================================================
function BlockView() {
  return (
    <div style={{ width: 1080, minHeight: 1140, background: "var(--chalk)", fontFamily: "Plus Jakarta Sans", color: "var(--ink)", padding: "0 0 40px" }}>
      {/* Block masthead */}
      <div style={{ padding: "32px 40px 22px", borderBottom: "1px solid #E0DED6", display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "flex-end" }}>
        <div>
          <div className="mono" style={{ fontSize: 10, color: "var(--meta)", letterSpacing: "0.24em" }}>BLOCK · 10:00 — 11:00 · ROUND 1 OF 3</div>
          <h1 style={{ margin: "8px 0 0", fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 400, fontSize: 44, letterSpacing: "-0.02em", lineHeight: 1 }}>Roman trade routes.</h1>
          <div style={{ marginTop: 10, display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
            <SubjectMark subject="gh" width={92}/>
            <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.22em" }}>3 × 20-MIN · SPLIT · PER-CHILD</span>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="mono" style={{ fontSize: 9, color: "var(--saffron)", letterSpacing: "0.22em" }}>NOW PLAYING</div>
          <div style={{ fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 500, fontSize: 30, color: "var(--ink)", marginTop: 6, letterSpacing: "-0.018em" }}>0:08 <span style={{ color: "var(--faint)", fontSize: 18 }}>/ 0:20</span></div>
          {/* Pace bar */}
          <div style={{ width: 200, height: 3, background: "#E0DED6", marginTop: 10, position: "relative" }}>
            <span style={{ position: "absolute", inset: 0, width: "40%", background: "var(--saffron)" }}/>
          </div>
        </div>
      </div>

      {/* Lede + materials confirmation */}
      <div style={{ padding: "26px 40px 0", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 26 }}>
        <div>
          <p style={{ margin: 0, fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 400, fontSize: 18, color: "var(--ink)", lineHeight: 1.45, letterSpacing: "-0.01em", textWrap: "pretty" }}>
            Open with the Mediterranean. Two pairs run in parallel — one tracing routes, one reading the primary — then swap.
          </p>
          <p style={{ margin: "12px 0 0", fontSize: 13, color: "var(--mid)", lineHeight: 1.55 }}>
            The map already stays on the wall through the whole hour. Children move; materials don't.
          </p>
        </div>
        <div style={{ background: "var(--paper)", border: "1px solid #ECE7DA", padding: "16px 18px" }}>
          <div className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.22em" }}>MATERIALS · CONFIRM BEFORE START</div>
          <ul style={{ margin: "10px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
            {["Wall map · taped above island","Carthage primary · 4 copies","Pencils · 4, soft erasers","Trade-route key · printed","Margin sheets · one per child"].map((m, i) => (
              <li key={i} style={{ fontSize: 12, color: "var(--ink)", lineHeight: 1.45, display: "flex", gap: 10, alignItems: "baseline" }}>
                <span style={{ width: 13, height: 13, border: "1.2px solid #C8C5BC", display: "inline-block", flexShrink: 0, position: "relative", top: 1 }}/>
                <span>{m}</span>
              </li>))}
          </ul>
        </div>
      </div>

      {/* Per-child instruction grid — load-bearing use of Form B */}
      <div style={{ padding: "28px 40px 0" }}>
        <div className="mono" style={{ fontSize: 9.5, color: "var(--meta)", letterSpacing: "0.24em" }}>WHAT EACH CHILD IS DOING — ROUND ONE</div>
        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          {[
            { id: "leo",  group: "MAP TABLE",    instr: "Trace the three trade routes by hand. Pencil only — start with Rome → Carthage, then Rome → Alexandria, then the long arc to Gades.", note: "Leo asked for fewer colors. Hold the line." },
            { id: "max",  group: "MAP TABLE",    instr: "As Leo traces, name each port aloud. Cross-check against the legend. If a port is unfamiliar, mark it with a tick — return to it after the swap.", note: "Max likes the cross-check. Let him own the legend." },
            { id: "jack", group: "READING NOOK", instr: "Read the Carthage primary aloud, slowly. Pause at each underlined word. Don't skip — pacing is the lesson here.", note: "Jack reads ahead when nervous. If he speeds up, ask him to read the last sentence again." },
            { id: "jane", group: "READING NOOK", instr: "As Jack reads, annotate the margin with the meaning of each underlined word. One word per line. Use the glossary on the back if stuck.", note: "Jane has done glossary work. Let her use it independently." },
          ].map(p => { const k = KIDS.find(x => x.id === p.id); const c = COLORS[p.id];
            return (
              <div key={p.id} style={{ background: "var(--paper)", border: "1px solid #ECE7DA", padding: "18px 20px 20px", position: "relative" }}>
                {/* Left rule in child color — subtle, 2px, not full border */}
                <span style={{ position: "absolute", left: 0, top: 18, bottom: 18, width: 2, background: c.fill }}/>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <NameB kid={k} scale={1}/>
                  <span className="mono" style={{ fontSize: 8.5, color: "var(--faint)", letterSpacing: "0.22em" }}>{p.group}</span>
                </div>
                <p style={{ margin: "12px 0 0", fontSize: 13, color: "var(--ink)", lineHeight: 1.55, textWrap: "pretty" }}>{p.instr}</p>
                <p style={{ margin: "10px 0 0", paddingTop: 10, borderTop: "1px dashed #E0DED6", fontSize: 11.5, color: "var(--mid)", fontStyle: "italic", lineHeight: 1.5 }}>{p.note}</p>
              </div>);
          })}
        </div>
      </div>

      {/* Swap rhythm + completion */}
      <div style={{ padding: "26px 40px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div style={{ background: "var(--paper)", border: "1px solid #ECE7DA", padding: "14px 18px" }}>
          <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.22em" }}>SWAP RHYTHM</span>
          <div style={{ marginTop: 10, display: "flex", gap: 14, alignItems: "center" }}>
            {[
              { t: "0:20", state: "now",  label: "ROUND 1" },
              { t: "0:40", state: "next", label: "SWAP"    },
              { t: "1:00", state: "next", label: "DONE"    },
            ].map((r, i) => (
              <span key={i} style={{ display: "inline-flex", flexDirection: "column", gap: 2 }}>
                <span className="mono" style={{ fontSize: 10, color: r.state === "now" ? "var(--saffron)" : "var(--ink)", letterSpacing: "0.22em" }}>{r.t}</span>
                <span className="mono" style={{ fontSize: 8.5, color: "var(--meta)", letterSpacing: "0.20em" }}>{r.label}</span>
              </span>))}
          </div>
        </div>
        <div style={{ background: "var(--paper)", border: "1px solid #ECE7DA", padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ width: 18, height: 18, border: "1.5px solid var(--ink)", display: "inline-block", flexShrink: 0 }}/>
          <span style={{ fontSize: 12.5, color: "var(--ink)", fontFamily: "Fraunces", fontStyle: "italic" }}>Mark the round complete.</span>
          <span style={{ flex: 1 }}/>
          <button style={{ background: "transparent", border: "1px solid #C8C5BC", padding: "6px 12px", fontFamily: "Space Mono", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink)", cursor: "pointer" }}>+ photo</button>
        </div>
      </div>

      {/* Footer ledger */}
      <div style={{ padding: "22px 40px 0", display: "flex", gap: 28, alignItems: "center", color: "var(--meta)", borderTop: "1px solid #E0DED6", marginTop: 24, paddingTop: 18 }}>
        <span className="mono" style={{ fontSize: 9, letterSpacing: "0.22em" }}>NEXT BLOCK</span>
        <span style={{ fontSize: 12, fontStyle: "italic", fontFamily: "Fraunces", color: "var(--ink)" }}>11:30 · Lab notebook · Science.</span>
        <span style={{ flex: 1 }}/>
        <span className="mono" style={{ fontSize: 9, letterSpacing: "0.22em" }}>RECAP UNLOCKS</span>
        <span style={{ fontSize: 12, fontStyle: "italic", fontFamily: "Fraunces", color: "var(--ink)" }}>17:30</span>
      </div>
    </div>
  );
}

Object.assign(window, { ClusterView, BlockView });
