/* global React, FAMILY, SUBJECTS_R6, SubjectR6, ChildR6, ChildChipR6,
   PrintCard, PrintHeader, NoteCard, PRINT_DEMO, RECAP_DEMO,
   CANDIDATE_F, CANDIDATE_G, CANDIDATE_H, LOCKED_R6 */

// =============================================================
// ROUND SIX — Renderers. Same vocabulary as r5, parameterised by
// a "candidate" palette (Wine + Sand + Slate locked, Jane variable).
// =============================================================

function PhoneBandR6() {
  return (
    <div style={{
      background: "#0C1020", color: "#F8F4E9",
      padding: "14px 22px 16px", fontFamily: "Plus Jakarta Sans",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Space Mono", fontSize: 11, fontWeight: 700 }}>
        <span>9:41</span>
        <span>
          <svg width="16" height="10" viewBox="0 0 16 10"><rect x="0.5" y="0.5" width="13" height="9" rx="1.5" fill="none" stroke="#F8F4E9" strokeOpacity="0.6"/><rect x="2" y="2" width="9" height="6" fill="#F8F4E9"/><rect x="14" y="3" width="1.5" height="4" fill="#F8F4E9" fillOpacity="0.6"/></svg>
        </span>
      </div>
      <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", fontFamily: "Space Mono", fontSize: 9, letterSpacing: "0.20em", color: "rgba(248,244,233,0.62)" }}>
        <span>TUESDAY · WEEK 16</span>
        <span style={{ color: "rgba(248,244,233,0.85)" }}>847 / 900 · ON&nbsp;PACE</span>
      </div>
      <div style={{ marginTop: 14, fontFamily: "Fraunces", fontStyle: "italic", fontSize: 17, color: "rgba(248,244,233,0.78)" }}>
        the day is made
      </div>
    </div>
  );
}

function SepR6() { return <span style={{ width: 1, height: 9, background: "#DCD6C5" }}/>; }
function CaretR6({ open }) {
  return (
    <svg width="9" height="9" viewBox="0 0 9 9">
      {open
        ? <path d="M1 3 L4.5 6.5 L8 3" fill="none" stroke="#B7B4A8" strokeWidth="1" strokeLinecap="round"/>
        : <path d="M3 1 L6.5 4.5 L3 8"  fill="none" stroke="#B7B4A8" strokeWidth="1" strokeLinecap="round"/>}
    </svg>
  );
}

// 1 · TODAY VIEW
function TodayViewR6({ palette }) {
  return (
    <div style={{
      width: 410, background: "var(--chalk)", borderRadius: 28, overflow: "hidden",
      boxShadow: "0 1px 0 rgba(0,0,0,0.06), 0 18px 40px -20px rgba(0,0,0,0.45)",
      fontFamily: "Plus Jakarta Sans",
    }}>
      <PhoneBandR6/>
      <div style={{ padding: "20px 22px 0" }}>
        <div className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>THEME</div>
        <div style={{ marginTop: 6, fontFamily: "Fraunces", fontWeight: 600, fontSize: 28, lineHeight: 1.05, letterSpacing: "-0.018em" }}>
          Bridges <em style={{ fontWeight: 500 }}>and</em> Engineering
        </div>
        <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10 }}>
          <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>9 BLOCKS</span>
          <SepR6/>
          <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>3 HRS</span>
          <SepR6/>
          <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>5 SUBJECTS</span>
        </div>
      </div>
      <div style={{ marginTop: 18, padding: "0 22px" }}>
        <div style={{ borderTop: "1px solid #ECE7DA" }}/>
        {[
          { time: 40, name: "Bridge Architecture Lab", subject: "math", modifier: "2 × 20-min · together", pos: "01" },
          { time: 20, name: "Reading the Builders",     subject: "la",   modifier: "1 × 20-min · together", pos: "02" },
        ].map((r, i) => <SiblingRowR6 key={i} row={r}/>)}
      </div>
      <ExpandedSplitR6 palette={palette}/>
      <div style={{ padding: "0 22px" }}>
        {[
          { time: 20, name: "Bridges Around the World", subject: "gh", modifier: "1 × 20-min · together", pos: "04" },
          { time: 40, name: "Build Your Bridge",        subject: "ca", modifier: "2 × 20-min · parallel", pos: "05" },
        ].map((r, i) => <SiblingRowR6 key={i} row={r}/>)}
      </div>
    </div>
  );
}

function SiblingRowR6({ row }) {
  return (
    <div style={{
      padding: "20px 0", borderBottom: "1px solid #ECE7DA",
      display: "grid", gridTemplateColumns: "36px 1fr auto", gap: 12, alignItems: "baseline",
    }}>
      <span className="mono" style={{ fontSize: 10, color: "var(--ink)", letterSpacing: "0.18em", alignSelf: "center" }}>{row.time}M</span>
      <div>
        <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 500, fontSize: 16, letterSpacing: "-0.008em", lineHeight: 1.25 }}>{row.name}</div>
        <div style={{ marginTop: 6, display: "flex", alignItems: "flex-end", gap: 9 }}>
          <SubjectR6 subject={row.subject}/>
          <SepR6/>
          <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>{row.modifier}</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, alignItems: "center", alignSelf: "center" }}>
        <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>{row.pos}</span>
        <CaretR6/>
      </div>
    </div>
  );
}

function ExpandedSplitR6({ palette }) {
  return (
    <div style={{ padding: "20px 0 22px" }}>
      <div style={{ padding: "0 22px", display: "grid", gridTemplateColumns: "36px 1fr auto", gap: 12, alignItems: "baseline" }}>
        <span className="mono" style={{ fontSize: 10, color: "var(--ink)", letterSpacing: "0.18em", alignSelf: "center" }}>60M</span>
        <div>
          <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 500, fontSize: 16, letterSpacing: "-0.008em" }}>Engineering Problem Solving</div>
          <div style={{ marginTop: 6, display: "flex", alignItems: "flex-end", gap: 9 }}>
            <SubjectR6 subject="sci"/>
            <SepR6/>
            <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>3 × 20-min · split</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center", alignSelf: "center" }}>
          <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>03</span>
          <CaretR6 open/>
        </div>
      </div>
      <GroupBlockR6 palette={palette} label="GROUP 1" kidIds={["leo","max"]} blocks={[
        { time: 20, name: "Bridge Load Testing Documentation Lab" },
        { time: 20, name: "Bridge Construction Supply Problems" },
      ]}/>
      <GroupBlockR6 palette={palette} label="GROUP 2" kidIds={["jack","jane"]} blocks={[
        { time: 20, name: "Pressure-Resistant Habitat Design Challenge" },
      ]}/>
      <div style={{ borderBottom: "1px solid #ECE7DA", marginTop: 22 }}/>
    </div>
  );
}

function GroupBlockR6({ palette, label, kidIds, blocks }) {
  return (
    <div style={{ marginTop: 22, padding: "0 22px 0 58px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: 12, marginBottom: 10 }}>
        <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.22em" }}>{label}</span>
        <div style={{ display: "flex", gap: 10 }}>
          {kidIds.map(id => {
            const k = FAMILY.find(f => f.id === id);
            return <ChildR6 key={id} kid={k} palette={palette}/>;
          })}
        </div>
      </div>
      {blocks.map((b, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "36px 1fr", gap: 12, alignItems: "baseline", padding: "8px 0" }}>
          <span className="mono" style={{ fontSize: 10, color: "var(--ink)", letterSpacing: "0.18em", alignSelf: "center" }}>{b.time}M</span>
          <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 500, fontSize: 14, letterSpacing: "-0.005em", lineHeight: 1.3 }}>{b.name}</div>
        </div>
      ))}
    </div>
  );
}

// 2 · RECAP BADGE
function RecapBadgeR6({ palette }) {
  return (
    <div style={{
      width: 420, height: 420, background: "#FAFAFA",
      padding: "24px 28px", boxSizing: "border-box",
      fontFamily: "Plus Jakarta Sans", color: "var(--ink)",
    }}>
      <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5", textTransform: "uppercase" }}>
        RECAP · MASTERY SHIFTS · WK 16
      </div>
      <hr style={{ marginTop: 10, border: "none", borderTop: "1px solid #0C1020" }}/>
      <div style={{ marginTop: 4 }}>
        {RECAP_DEMO.map(s => {
          const k = FAMILY.find(f => f.id === s.kid);
          return (
            <div key={s.kid} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 10, alignItems: "center", padding: "10px 0" }}>
              <ChildR6 kid={k} palette={palette} size={20} hideName/>
              <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "var(--mid)", lineHeight: 1.4 }}>
                <strong style={{ color: "var(--ink)", fontWeight: 600, fontStyle: "italic" }}>{k.name}</strong> — {s.shift}
              </span>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 14, padding: "12px 14px", background: "var(--chalk)" }}>
        <div className="mono" style={{ fontSize: 8.5, letterSpacing: "0.22em", color: "#8C91A5" }}>SMALLEST SCALE · 20px</div>
        <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
          {FAMILY.map(k => <ChildChipR6 key={k.id} kid={k} palette={palette} size={20}/>)}
          <span style={{ width: 1, height: 18, background: "#E0DED6", margin: "0 6px" }}/>
          {Object.keys(SUBJECTS_R6).map(s => <SubjectR6 key={s} subject={s} dense/>)}
        </div>
      </div>
    </div>
  );
}

// 3 · PALETTE CARD — locked-three + candidate-Jane, with Jane highlighted
function PaletteCardR6({ palette }) {
  const kids = ["leo","max","jack","jane"].map(id => ({
    id, kid: FAMILY.find(f => f.id === id), token: palette.family[id],
    locked: id !== "jane",
  }));
  return (
    <div style={{
      width: 620, height: 560, background: "var(--chalk)",
      padding: "30px 36px", boxSizing: "border-box",
      fontFamily: "Plus Jakarta Sans", color: "var(--ink)",
    }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#8C91A5", textTransform: "uppercase" }}>
        {palette.kicker} · JANE = {palette.janeName.toUpperCase()}
      </div>
      <h2 style={{ margin: "8px 0 0", fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 500, fontSize: 32, letterSpacing: "-0.018em" }}>
        {palette.title}
      </h2>
      <p style={{ marginTop: 4, fontSize: 13, color: "var(--mid)", letterSpacing: "-0.003em" }}>{palette.tagline}</p>

      <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
        {kids.map(({ id, kid, token, locked }) => (
          <div key={id} style={{
            background: "#FAFAFA",
            padding: "14px 12px 14px",
            border: locked ? "1px solid #ECE7DA" : "1px solid #0C1020",
            position: "relative",
          }}>
            <div className="mono" style={{
              position: "absolute", top: 8, right: 10,
              fontSize: 7.5, letterSpacing: "0.22em",
              color: locked ? "#8C91A5" : "var(--ink)",
            }}>
              {locked ? "LOCKED" : "OPEN"}
            </div>
            <div style={{ height: 64, display: "flex", alignItems: "center" }}>
              <span style={{
                width: 56, height: 56, borderRadius: 10, background: token.fill,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontFamily: "Plus Jakarta Sans", fontStyle: "italic", fontWeight: 600,
                fontSize: 32, color: "#FAFAFA", lineHeight: 1,
              }}>{kid.initial}</span>
            </div>
            <div className="mono" style={{ marginTop: 10, fontSize: 9, letterSpacing: "0.18em", color: "var(--ink)" }}>
              {kid.name.toUpperCase()} · {token.name}
            </div>
            <div className="mono" style={{ marginTop: 2, fontSize: 8.5, letterSpacing: "0.10em", color: "var(--faint)", textTransform: "none" }}>
              {token.fill}
            </div>
            <div className="mono" style={{ marginTop: 4, fontSize: 8.5, letterSpacing: "0.18em", color: "#8C91A5" }}>
              ↳ {token.territoryShort}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 18, padding: "14px 16px", background: "var(--paper)", border: "1px solid #ECE7DA" }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>FOUR DIFFERENT TERRITORIES</div>
        <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          {kids.map(({ id, kid, token }) => (
            <div key={id} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ width: "100%", height: 4, background: token.fill }}/>
              <span className="mono" style={{ fontSize: 8.5, letterSpacing: "0.18em", color: "var(--ink)" }}>{token.territoryShort}</span>
              <span className="mono" style={{ fontSize: 8.5, letterSpacing: "0.10em", color: "var(--faint)", textTransform: "none" }}>{kid.name} · {token.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 14, padding: "10px 14px", background: "var(--paper)", border: "1px solid #ECE7DA" }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>RECAP-BADGE TEST · 20px</div>
        <div style={{ marginTop: 8, display: "flex", gap: 10, alignItems: "center" }}>
          {kids.map(({ id, kid }) => <ChildChipR6 key={id} kid={kid} palette={palette} size={20}/>)}
          <span style={{ flex: 1 }}/>
          <span className="mono" style={{ fontSize: 8.5, color: "#8C91A5", letterSpacing: "0.18em" }}>JANE HOLDS</span>
        </div>
      </div>
    </div>
  );
}

// 4 · CONSTRAINT CHECK — four success criteria from the brief
function ConstraintCheckR6({ palette }) {
  return (
    <div style={{
      width: 620, height: 560, background: "var(--chalk)",
      padding: "30px 36px", boxSizing: "border-box",
      fontFamily: "Plus Jakarta Sans", color: "var(--ink)",
    }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#8C91A5", textTransform: "uppercase" }}>
        {palette.kicker} · CONSTRAINT CHECK
      </div>
      <h2 style={{ margin: "8px 0 0", fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 500, fontSize: 26, letterSpacing: "-0.018em" }}>
        Jane = {palette.janeName}. Defended explicitly.
      </h2>

      <div style={{ marginTop: 18, borderTop: "1px solid #E0DED6" }}>
        {palette.rationale.constraints.map(([k, v], i) => (
          <div key={i} style={{
            padding: "14px 0",
            borderBottom: i === palette.rationale.constraints.length - 1 ? "none" : "1px solid #ECE7DA",
            display: "grid", gridTemplateColumns: "auto 175px 1fr", columnGap: 14, alignItems: "baseline",
          }}>
            <span className="mono" style={{ fontSize: 10, letterSpacing: "0.20em", color: "#3CA85A" }}>✓ PASS</span>
            <span className="mono" style={{ fontSize: 9.5, letterSpacing: "0.20em", color: "var(--ink)" }}>{k}</span>
            <span style={{ fontSize: 12.5, color: "var(--ink)", letterSpacing: "-0.003em", lineHeight: 1.5 }}>{v}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 14, padding: "12px 14px", background: "var(--paper)", border: "1px solid #ECE7DA" }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>JANE · HUE NOTE</div>
        <p style={{ marginTop: 6, marginBottom: 0, fontSize: 11.5, color: "var(--mid)", letterSpacing: "-0.003em", lineHeight: 1.5 }}>
          {palette.family.jane.note}
        </p>
      </div>
    </div>
  );
}

// 5 · EXPANDED-CLUSTER TEST — the brief's required composition
//     "Today View expanded cluster · Group 1 Leo+Max / Group 2 Jack+Jane"
//     This is the same-screen test the brief specifically calls for.
function ExpandedClusterTestR6({ palette }) {
  return (
    <div style={{
      width: 620, height: 720, background: "#FAFAFA",
      padding: "30px 36px", boxSizing: "border-box",
      fontFamily: "Plus Jakarta Sans", color: "var(--ink)",
    }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#8C91A5", textTransform: "uppercase" }}>
        {palette.kicker} · SAME-SCREEN TEST
      </div>
      <h2 style={{ margin: "8px 0 0", fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 500, fontSize: 26, letterSpacing: "-0.018em" }}>
        the four children, on the screen the parent sees
      </h2>
      <p style={{ marginTop: 6, fontSize: 12, color: "var(--mid)", lineHeight: 1.5, letterSpacing: "-0.003em" }}>
        Expanded cluster, SCI underline, both groups. The required composition.
      </p>

      <div style={{
        marginTop: 18, padding: "20px 22px", background: "var(--chalk)",
        border: "1px solid #ECE7DA",
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "36px 1fr auto", gap: 12, alignItems: "baseline" }}>
          <span className="mono" style={{ fontSize: 10, color: "var(--ink)", letterSpacing: "0.18em", alignSelf: "center" }}>60M</span>
          <div>
            <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 500, fontSize: 16, letterSpacing: "-0.008em" }}>
              Engineering Problem Solving
            </div>
            <div style={{ marginTop: 6, display: "flex", alignItems: "flex-end", gap: 9 }}>
              <SubjectR6 subject="sci"/>
              <SepR6/>
              <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>3 × 20-min · split</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center", alignSelf: "center" }}>
            <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>03</span>
            <CaretR6 open/>
          </div>
        </div>

        <div style={{ marginTop: 22, paddingLeft: 48 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", marginBottom: 10 }}>
            <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.22em" }}>GROUP 1</span>
            <div style={{ display: "flex", gap: 12 }}>
              {["leo","max"].map(id => {
                const k = FAMILY.find(f => f.id === id);
                return <ChildR6 key={id} kid={k} palette={palette}/>;
              })}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "36px 1fr", gap: 12, padding: "8px 0", alignItems: "baseline" }}>
            <span className="mono" style={{ fontSize: 10, color: "var(--ink)", letterSpacing: "0.18em" }}>20M</span>
            <div style={{ fontSize: 14, fontWeight: 500, letterSpacing: "-0.005em" }}>Bridge Load Testing Documentation Lab</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "36px 1fr", gap: 12, padding: "8px 0", alignItems: "baseline" }}>
            <span className="mono" style={{ fontSize: 10, color: "var(--ink)", letterSpacing: "0.18em" }}>20M</span>
            <div style={{ fontSize: 14, fontWeight: 500, letterSpacing: "-0.005em" }}>Bridge Construction Supply Problems</div>
          </div>
        </div>

        <div style={{ marginTop: 18, paddingLeft: 48 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", marginBottom: 10 }}>
            <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.22em" }}>GROUP 2</span>
            <div style={{ display: "flex", gap: 12 }}>
              {["jack","jane"].map(id => {
                const k = FAMILY.find(f => f.id === id);
                return <ChildR6 key={id} kid={k} palette={palette}/>;
              })}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "36px 1fr", gap: 12, padding: "8px 0", alignItems: "baseline" }}>
            <span className="mono" style={{ fontSize: 10, color: "var(--ink)", letterSpacing: "0.18em" }}>20M</span>
            <div style={{ fontSize: 14, fontWeight: 500, letterSpacing: "-0.005em" }}>Pressure-Resistant Habitat Design Challenge</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 18, padding: "14px 16px", background: "var(--paper)", border: "1px solid #ECE7DA" }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>FOUR CHIPS · BADGE SCALE</div>
        <div style={{ marginTop: 10, display: "flex", gap: 14, alignItems: "center" }}>
          {["leo","max","jack","jane"].map(id => {
            const k = FAMILY.find(f => f.id === id);
            return (
              <div key={id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                <ChildChipR6 kid={k} palette={palette} size={28}/>
                <span className="mono" style={{ fontSize: 8.5, letterSpacing: "0.18em", color: "#8C91A5" }}>
                  {k.name.toUpperCase()}
                </span>
              </div>
            );
          })}
          <span style={{ flex: 1 }}/>
          <span style={{ fontFamily: "Fraunces", fontStyle: "italic", fontSize: 14, color: "var(--mid)" }}>
            Equal weight, four territories.
          </span>
        </div>
      </div>
    </div>
  );
}

// 6 · NINE-COLOR LANDSCAPE
function NineColorLandscapeR6({ palette }) {
  const subj = Object.entries(SUBJECTS_R6);
  const kids = ["leo","max","jack","jane"].map(id => ({
    id, kid: FAMILY.find(f => f.id === id), token: palette.family[id],
  }));
  return (
    <div style={{
      width: 760, height: 560, background: "var(--chalk)",
      padding: "30px 36px", boxSizing: "border-box",
      fontFamily: "Plus Jakarta Sans", color: "var(--ink)",
    }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#8C91A5", textTransform: "uppercase" }}>
        {palette.kicker} · NINE-COLOR LANDSCAPE
      </div>
      <h2 style={{ margin: "8px 0 0", fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 500, fontSize: 26, letterSpacing: "-0.018em" }}>
        Five subjects, four children — Jane = {palette.janeName}.
      </h2>

      <div style={{ marginTop: 22 }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>FIVE SUBJECTS · LOCKED</div>
        <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
          {subj.map(([k, v]) => (
            <div key={k} style={{ background: "#FAFAFA", padding: "12px 12px 14px", border: "1px solid #ECE7DA" }}>
              <div style={{ height: 38, display: "flex", alignItems: "center" }}>
                <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "flex-start" }}>
                  <span className="mono" style={{ fontSize: 11, color: "var(--ink)", letterSpacing: "0.18em" }}>{v.abbr}</span>
                  <span style={{ width: 44, height: 2, background: v.hue, marginTop: 4 }}/>
                </span>
              </div>
              <div className="mono" style={{ marginTop: 6, fontSize: 8.5, letterSpacing: "0.10em", color: "var(--faint)", textTransform: "none" }}>{v.hue}</div>
              <div className="mono" style={{ marginTop: 1, fontSize: 8.5, letterSpacing: "0.16em", color: "#8C91A5" }}>{v.family.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>FOUR CHILDREN · THREE LOCKED, ONE OPEN</div>
        <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          {kids.map(({ id, kid, token }) => {
            const isJane = id === "jane";
            return (
              <div key={id} style={{
                background: "#FAFAFA", padding: "12px 12px 14px",
                border: isJane ? "1px solid #0C1020" : "1px solid #ECE7DA",
                position: "relative",
              }}>
                <div style={{ height: 38, display: "flex", alignItems: "center" }}>
                  <ChildChipR6 kid={kid} palette={palette} size={28}/>
                </div>
                <div className="mono" style={{ marginTop: 6, fontSize: 8.5, letterSpacing: "0.18em", color: "var(--ink)" }}>{kid.name.toUpperCase()} · {token.name.toUpperCase()}</div>
                <div className="mono" style={{ marginTop: 1, fontSize: 8.5, letterSpacing: "0.10em", color: "var(--faint)", textTransform: "none" }}>{token.fill}</div>
                <div className="mono" style={{ marginTop: 1, fontSize: 8.5, letterSpacing: "0.16em", color: "#8C91A5" }}>{token.territoryShort}</div>
                {isJane && <div className="mono" style={{ position: "absolute", top: 8, right: 10, fontSize: 7.5, letterSpacing: "0.22em", color: "var(--ink)" }}>OPEN</div>}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: 18, padding: "16px 18px", background: "#FAFAFA", border: "1px solid #ECE7DA" }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>SAME-SCREEN · ALL NINE</div>
        <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          {subj.map(([k]) => <SubjectR6 key={k} subject={k} dense/>)}
          <span style={{ width: 1, height: 22, background: "#0C1020" }}/>
          {kids.map(({ id, kid }) => <ChildR6 key={id} kid={kid} palette={palette} size={20}/>)}
        </div>
      </div>
    </div>
  );
}

// 7 · RATIONALE NOTE
function RationaleNoteR6({ palette }) {
  return (
    <NoteCard
      persona={palette.kicker + " · JANE = " + palette.janeName.toUpperCase()}
      title={palette.rationale.headline}
      move={<>{palette.rationale.move}</>}
      bullets={palette.rationale.bullets}
    />
  );
}

// 8 · FRAME / OVERVIEW — the round-six brief, summarised
function FrameCardR6() {
  return (
    <div style={{
      width: 620, height: 720, background: "var(--chalk)",
      padding: "30px 36px", boxSizing: "border-box",
      fontFamily: "Plus Jakarta Sans", color: "var(--ink)",
    }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#8C91A5", textTransform: "uppercase" }}>
        ROUND SIX · FOURTH SLOT · JANE
      </div>
      <h2 style={{ margin: "10px 0 0", fontFamily: "Fraunces", fontWeight: 600, fontSize: 30, lineHeight: 1.05, letterSpacing: "-0.018em" }}>
        Three slots locked.<br/>One slot open.
      </h2>
      <p style={{ marginTop: 12, fontSize: 12.5, lineHeight: 1.55, color: "var(--mid)", letterSpacing: "-0.003em", textWrap: "pretty" }}>
        Five rounds. Three colours have held: Wine, Sand, Slate. The fourth — Jane — is
        the unsolved problem. Onyx, Taupe and gray-leaning answers under-coloured her;
        Rose and Brick reached chromatic but failed structural constraints. Three
        candidates here, each defending a different territory.
      </p>

      <div style={{ marginTop: 16, padding: "12px 14px", background: "#FAFAFA", border: "1px solid #ECE7DA" }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>LOCKED FROM ROUND FIVE</div>
        <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {["leo","max","jack"].map(id => {
            const kid = FAMILY.find(f => f.id === id);
            const t = LOCKED_R6[id];
            return (
              <div key={id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{
                  width: 36, height: 36, borderRadius: 7, background: t.fill,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "Plus Jakarta Sans", fontStyle: "italic", fontWeight: 600,
                  fontSize: 20, color: "#FAFAFA", lineHeight: 1,
                }}>{kid.initial}</span>
                <div>
                  <div className="mono" style={{ fontSize: 9, letterSpacing: "0.18em", color: "var(--ink)" }}>{kid.name.toUpperCase()} · {t.name.toUpperCase()}</div>
                  <div className="mono" style={{ marginTop: 1, fontSize: 8.5, letterSpacing: "0.10em", color: "var(--faint)", textTransform: "none" }}>{t.fill} · {t.territoryShort}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: 14, padding: "12px 14px", background: "#FAFAFA", border: "1px solid #ECE7DA" }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>FAILURES TO AVOID</div>
        <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: "auto 1fr", rowGap: 6, columnGap: 12, alignItems: "baseline" }}>
          {[
            ["ONYX",   "near-black — read as the absence of colour."],
            ["TAUPE",  "under-coloured Jane next to Wine and Sand."],
            ["ROSE",   "failed for any family with boys."],
            ["BRICK",  "second-red pairing with Wine."],
            ["BRONZE", "too close to Geo orange at glance."],
          ].map(([n, v]) => (
            <React.Fragment key={n}>
              <span className="mono" style={{ fontSize: 9, letterSpacing: "0.20em", color: "var(--ink)" }}>{n}</span>
              <span style={{ fontSize: 12, color: "var(--ink)", letterSpacing: "-0.003em", lineHeight: 1.45 }}>{v}</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 14, padding: "12px 14px", background: "#FAFAFA", border: "1px solid #ECE7DA" }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>FOUR SUCCESS CRITERIA</div>
        <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: "auto 1fr", rowGap: 6, columnGap: 12, alignItems: "baseline" }}>
          {[
            ["01", "Chromatic and present — visually equal to Wine, Sand, Slate."],
            ["02", "Outside every subject hue family at full strength."],
            ["03", "Visually distinct from Wine, Sand, Slate — no warm-dark, warm-light, or cool pairings."],
            ["04", "Gender-neutral — holds for any family configuration."],
          ].map(([n, v]) => (
            <React.Fragment key={n}>
              <span className="mono" style={{ fontSize: 9, letterSpacing: "0.20em", color: "var(--ink)" }}>{n}</span>
              <span style={{ fontSize: 12, color: "var(--ink)", letterSpacing: "-0.003em", lineHeight: 1.45 }}>{v}</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#8C91A5", textTransform: "uppercase" }}>THREE CANDIDATES</div>
        <div style={{ marginTop: 10, borderTop: "1px solid #E0DED6" }}>
          {[
            ["F · AUBERGINE", "#4A2A38", "Brown-shifted purple. The brief's first preferred territory."],
            ["G · TEAL",      "#1F4A4F", "Blue-shifted green. The brief's second preferred territory."],
            ["H · LODEN",     "#3E4A36", "Defended forest. A third territory the brief implicitly leaves open."],
          ].map(([k, hex, v]) => (
            <div key={k} style={{
              padding: "10px 0", borderBottom: "1px solid #ECE7DA",
              display: "grid", gridTemplateColumns: "20px 165px 1fr", gap: 12, alignItems: "center",
            }}>
              <span style={{ width: 18, height: 18, background: hex, borderRadius: 4 }}/>
              <span className="mono" style={{ fontSize: 9.5, letterSpacing: "0.18em", color: "var(--ink)" }}>{k}</span>
              <span style={{ fontSize: 12, color: "var(--ink)", letterSpacing: "-0.003em" }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 9 · COMPARE STRIP — three candidates on the same row
function CompareStripR6() {
  return (
    <div style={{
      width: 880, height: 620, background: "#FAFAFA",
      padding: "30px 36px", boxSizing: "border-box",
      fontFamily: "Plus Jakarta Sans", color: "var(--ink)",
    }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#8C91A5", textTransform: "uppercase" }}>
        SAME ROW · THREE CANDIDATES
      </div>
      <h2 style={{ margin: "8px 0 0", fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 500, fontSize: 26, letterSpacing: "-0.018em" }}>
        only Jane changes
      </h2>
      <p style={{ marginTop: 6, fontSize: 12, color: "var(--mid)", lineHeight: 1.5, letterSpacing: "-0.003em" }}>
        Wine, Sand, Slate hold. The fourth chip moves through Aubergine, Teal, Loden. The expanded cluster is the frame the brief asks for.
      </p>

      <div style={{ marginTop: 18, borderTop: "1px solid #E0DED6" }}>
        {[CANDIDATE_F, CANDIDATE_G, CANDIDATE_H].map((p, i) => (
          <div key={p.id} style={{ padding: "16px 0", borderBottom: i === 2 ? "none" : "1px solid #ECE7DA" }}>
            <div style={{ display: "grid", gridTemplateColumns: "165px 1fr", gap: 18, alignItems: "center" }}>
              <div>
                <div className="mono" style={{ fontSize: 9, letterSpacing: "0.20em", color: "#8C91A5" }}>
                  {p.kicker}
                </div>
                <div style={{ marginTop: 4, fontFamily: "Fraunces", fontStyle: "italic", fontSize: 20, fontWeight: 500, letterSpacing: "-0.018em" }}>
                  Jane = {p.janeName}
                </div>
                <div className="mono" style={{ marginTop: 2, fontSize: 8.5, letterSpacing: "0.10em", color: "var(--faint)", textTransform: "none" }}>
                  {p.family.jane.fill}
                </div>
              </div>
              <div style={{
                padding: "14px 16px", background: "var(--chalk)",
                display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap",
              }}>
                <SubjectR6 subject="sci"/>
                <SepR6/>
                <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>SPLIT</span>
                <span style={{ width: 1, height: 16, background: "#E0DED6", margin: "0 4px" }}/>
                <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.22em" }}>G1</span>
                {["leo","max"].map(id => {
                  const k = FAMILY.find(f => f.id === id);
                  return <ChildR6 key={id} kid={k} palette={p}/>;
                })}
                <span style={{ width: 1, height: 14, background: "#E0DED6" }}/>
                <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.22em" }}>G2</span>
                {["jack","jane"].map(id => {
                  const k = FAMILY.find(f => f.id === id);
                  return <ChildR6 key={id} kid={k} palette={p}/>;
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12, padding: "12px 16px", background: "var(--chalk)", border: "1px solid #ECE7DA" }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>RECAP-BADGE STRIP · ALL THREE · 20px</div>
        <div style={{ marginTop: 10, display: "flex", gap: 24, alignItems: "center" }}>
          {[CANDIDATE_F, CANDIDATE_G, CANDIDATE_H].map(p => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="mono" style={{ fontSize: 8.5, letterSpacing: "0.18em", color: "var(--ink)" }}>{p.janeName.toUpperCase()}</span>
              {["leo","max","jack","jane"].map(id => {
                const k = FAMILY.find(f => f.id === id);
                return <ChildChipR6 key={id} kid={k} palette={p} size={20}/>;
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  TodayViewR6, RecapBadgeR6, PaletteCardR6,
  ConstraintCheckR6, ExpandedClusterTestR6, NineColorLandscapeR6,
  RationaleNoteR6, FrameCardR6, CompareStripR6,
});
