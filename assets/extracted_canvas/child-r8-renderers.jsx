/* global React, FAMILY, SUBJECTS_R8, SubjectR8, ChildR8, ChildChipR8,
   PrintCard, PrintHeader, NoteCard, PRINT_DEMO, RECAP_DEMO,
   PALETTE_M, PALETTE_N, PALETTE_O, letterColorR8 */

function PhoneBandR8() {
  return (
    <div style={{ background: "#0C1020", color: "#F8F4E9", padding: "14px 22px 16px", fontFamily: "Plus Jakarta Sans" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Space Mono", fontSize: 11, fontWeight: 700 }}>
        <span>9:41</span>
        <span><svg width="16" height="10" viewBox="0 0 16 10"><rect x="0.5" y="0.5" width="13" height="9" rx="1.5" fill="none" stroke="#F8F4E9" strokeOpacity="0.6"/><rect x="2" y="2" width="9" height="6" fill="#F8F4E9"/><rect x="14" y="3" width="1.5" height="4" fill="#F8F4E9" fillOpacity="0.6"/></svg></span>
      </div>
      <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", fontFamily: "Space Mono", fontSize: 9, letterSpacing: "0.20em", color: "rgba(248,244,233,0.62)" }}>
        <span>TUESDAY · WEEK 16</span><span style={{ color: "rgba(248,244,233,0.85)" }}>847 / 900 · ON&nbsp;PACE</span>
      </div>
      <div style={{ marginTop: 14, fontFamily: "Fraunces", fontStyle: "italic", fontSize: 17, color: "rgba(248,244,233,0.78)" }}>the day is made</div>
    </div>
  );
}
function SepR8() { return <span style={{ width: 1, height: 9, background: "#DCD6C5" }}/>; }
function CaretR8({ open }) {
  return (<svg width="9" height="9" viewBox="0 0 9 9">{open ? <path d="M1 3 L4.5 6.5 L8 3" fill="none" stroke="#B7B4A8" strokeWidth="1" strokeLinecap="round"/> : <path d="M3 1 L6.5 4.5 L3 8" fill="none" stroke="#B7B4A8" strokeWidth="1" strokeLinecap="round"/>}</svg>);
}

function TodayViewR8({ palette }) {
  return (
    <div style={{ width: 410, background: "var(--chalk)", borderRadius: 28, overflow: "hidden", boxShadow: "0 1px 0 rgba(0,0,0,0.06), 0 18px 40px -20px rgba(0,0,0,0.45)", fontFamily: "Plus Jakarta Sans" }}>
      <PhoneBandR8/>
      <div style={{ padding: "20px 22px 0" }}>
        <div className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>THEME</div>
        <div style={{ marginTop: 6, fontFamily: "Fraunces", fontWeight: 600, fontSize: 28, lineHeight: 1.05, letterSpacing: "-0.018em" }}>Bridges <em style={{ fontWeight: 500 }}>and</em> Engineering</div>
        <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10 }}>
          <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>9 BLOCKS</span><SepR8/>
          <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>3 HRS</span><SepR8/>
          <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>5 SUBJECTS</span>
        </div>
      </div>
      <div style={{ marginTop: 18, padding: "0 22px" }}>
        <div style={{ borderTop: "1px solid #ECE7DA" }}/>
        {[{ time: 40, name: "Bridge Architecture Lab", subject: "math", modifier: "2 × 20-min · together", pos: "01" },
          { time: 20, name: "Reading the Builders", subject: "la", modifier: "1 × 20-min · together", pos: "02" }].map((r, i) => <SiblingRowR8 key={i} row={r}/>)}
      </div>
      <ExpandedSplitR8 palette={palette}/>
      <div style={{ padding: "0 22px" }}>
        {[{ time: 20, name: "Bridges Around the World", subject: "gh", modifier: "1 × 20-min · together", pos: "04" },
          { time: 40, name: "Build Your Bridge", subject: "ca", modifier: "2 × 20-min · parallel", pos: "05" }].map((r, i) => <SiblingRowR8 key={i} row={r}/>)}
      </div>
    </div>
  );
}

function SiblingRowR8({ row }) {
  return (
    <div style={{ padding: "20px 0", borderBottom: "1px solid #ECE7DA", display: "grid", gridTemplateColumns: "36px 1fr auto", gap: 12, alignItems: "baseline" }}>
      <span className="mono" style={{ fontSize: 10, color: "var(--ink)", letterSpacing: "0.18em", alignSelf: "center" }}>{row.time}M</span>
      <div>
        <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 500, fontSize: 16, letterSpacing: "-0.008em", lineHeight: 1.25 }}>{row.name}</div>
        <div style={{ marginTop: 6, display: "flex", alignItems: "flex-end", gap: 9 }}>
          <SubjectR8 subject={row.subject}/><SepR8/>
          <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>{row.modifier}</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, alignItems: "center", alignSelf: "center" }}>
        <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>{row.pos}</span><CaretR8/>
      </div>
    </div>
  );
}

function ExpandedSplitR8({ palette }) {
  return (
    <div style={{ padding: "20px 0 22px" }}>
      <div style={{ padding: "0 22px", display: "grid", gridTemplateColumns: "36px 1fr auto", gap: 12, alignItems: "baseline" }}>
        <span className="mono" style={{ fontSize: 10, color: "var(--ink)", letterSpacing: "0.18em", alignSelf: "center" }}>60M</span>
        <div>
          <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 500, fontSize: 16, letterSpacing: "-0.008em" }}>Engineering Problem Solving</div>
          <div style={{ marginTop: 6, display: "flex", alignItems: "flex-end", gap: 9 }}>
            <SubjectR8 subject="sci"/><SepR8/>
            <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>3 × 20-min · split</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center", alignSelf: "center" }}>
          <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>03</span><CaretR8 open/>
        </div>
      </div>
      <GroupBlockR8 palette={palette} label="GROUP 1" kidIds={["leo","max"]} blocks={[
        { time: 20, name: "Bridge Load Testing Documentation Lab" },
        { time: 20, name: "Bridge Construction Supply Problems" }]}/>
      <GroupBlockR8 palette={palette} label="GROUP 2" kidIds={["jack","jane"]} blocks={[
        { time: 20, name: "Pressure-Resistant Habitat Design Challenge" }]}/>
      <div style={{ borderBottom: "1px solid #ECE7DA", marginTop: 22 }}/>
    </div>
  );
}

function GroupBlockR8({ palette, label, kidIds, blocks }) {
  return (
    <div style={{ marginTop: 22, padding: "0 22px 0 58px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: 12, marginBottom: 10 }}>
        <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.22em" }}>{label}</span>
        <div style={{ display: "flex", gap: 10 }}>{kidIds.map(id => { const k = FAMILY.find(f => f.id === id); return <ChildR8 key={id} kid={k} palette={palette}/>; })}</div>
      </div>
      {blocks.map((b, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "36px 1fr", gap: 12, alignItems: "baseline", padding: "8px 0" }}>
          <span className="mono" style={{ fontSize: 10, color: "var(--ink)", letterSpacing: "0.18em", alignSelf: "center" }}>{b.time}M</span>
          <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 500, fontSize: 14, letterSpacing: "-0.005em", lineHeight: 1.3 }}>{b.name}</div>
        </div>))}
    </div>
  );
}

function BlockSheetR8({ palette }) {
  const step = PRINT_DEMO.step;
  return (
    <PrintCard>
      <PrintHeader/>
      <h3 style={{ margin: "20px 0 4px", fontFamily: "Plus Jakarta Sans", fontWeight: 500, fontSize: 14 }}>{step.title}</h3>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 10 }}>
        <SubjectR8 subject="sci" dense/><SepR8/>
        <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>STEP 01 · 5 MIN</span>
      </div>
      <p style={{ margin: 0, fontFamily: "Plus Jakarta Sans", fontSize: 11.5, lineHeight: 1.5, letterSpacing: "-0.003em" }}>
        Hold up two wooden blocks with a flat block laid across the gap. Ask: "What do we call this shape?"
      </p>
      <div style={{ marginTop: 14, display: "grid", rowGap: 8 }}>
        {step.perChild.map((p, i) => { const k = FAMILY.find(f => f.id === p.kid);
          return (<div key={i} style={{ display: "grid", gridTemplateColumns: "92px 1fr", columnGap: 12, alignItems: "center" }}>
            <ChildR8 kid={k} palette={palette} size={17}/>
            <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "var(--mid)", lineHeight: 1.4 }}>{p.note}</span>
          </div>);
        })}
      </div>
    </PrintCard>
  );
}

function RecapBadgeR8({ palette }) {
  return (
    <div style={{ width: 420, height: 420, background: "#FAFAFA", padding: "24px 28px", boxSizing: "border-box", fontFamily: "Plus Jakarta Sans", color: "var(--ink)" }}>
      <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>RECAP · MASTERY SHIFTS · WK 16</div>
      <hr style={{ marginTop: 10, border: "none", borderTop: "1px solid #0C1020" }}/>
      <div style={{ marginTop: 4 }}>
        {RECAP_DEMO.map(s => { const k = FAMILY.find(f => f.id === s.kid);
          return (<div key={s.kid} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 10, alignItems: "center", padding: "10px 0" }}>
            <ChildR8 kid={k} palette={palette} size={20} hideName/>
            <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "var(--mid)", lineHeight: 1.4 }}>
              <strong style={{ color: "var(--ink)", fontWeight: 600, fontStyle: "italic" }}>{k.name}</strong> — {s.shift}
            </span></div>); })}
      </div>
      <div style={{ marginTop: 14, padding: "12px 14px", background: "var(--chalk)" }}>
        <div className="mono" style={{ fontSize: 8.5, letterSpacing: "0.22em", color: "#8C91A5" }}>SMALLEST SCALE · 20px</div>
        <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
          {FAMILY.map(k => <ChildChipR8 key={k.id} kid={k} palette={palette} size={20}/>)}
          <span style={{ width: 1, height: 18, background: "#E0DED6", margin: "0 6px" }}/>
          {Object.keys(SUBJECTS_R8).map(s => <SubjectR8 key={s} subject={s} dense/>)}
        </div>
      </div>
    </div>
  );
}

function PaletteCardR8({ palette }) {
  const kids = ["leo","max","jack","jane"].map(id => ({ id, kid: FAMILY.find(f => f.id === id), token: palette.family[id] }));
  return (
    <div style={{ width: 620, height: 560, background: "var(--chalk)", padding: "30px 36px", boxSizing: "border-box", fontFamily: "Plus Jakarta Sans", color: "var(--ink)" }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#8C91A5" }}>{palette.kicker}</div>
      <h2 style={{ margin: "8px 0 0", fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 500, fontSize: 32, letterSpacing: "-0.018em" }}>{palette.title}</h2>
      <p style={{ marginTop: 4, fontSize: 13, color: "var(--mid)", letterSpacing: "-0.003em" }}>{palette.tagline}</p>
      <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
        {kids.map(({ id, kid, token }) => (
          <div key={id} style={{ background: "#FAFAFA", padding: "14px 12px 14px", border: "1px solid #ECE7DA" }}>
            <div style={{ height: 64, display: "flex", alignItems: "center" }}>
              <span style={{ width: 56, height: 56, borderRadius: 10, background: token.fill, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "Plus Jakarta Sans", fontStyle: "italic", fontWeight: 600, fontSize: 32, color: letterColorR8(token), lineHeight: 1 }}>{kid.initial}</span>
            </div>
            <div className="mono" style={{ marginTop: 10, fontSize: 9, letterSpacing: "0.18em", color: "var(--ink)" }}>{kid.name.toUpperCase()} · {token.name}</div>
            <div className="mono" style={{ marginTop: 2, fontSize: 8.5, letterSpacing: "0.10em", color: "var(--faint)", textTransform: "none" }}>{token.fill}</div>
            <div className="mono" style={{ marginTop: 4, fontSize: 8.5, letterSpacing: "0.18em", color: "#8C91A5" }}>↳ {token.territoryShort}</div>
          </div>))}
      </div>
      <div style={{ marginTop: 18, padding: "14px 16px", background: "var(--paper)", border: "1px solid #ECE7DA" }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>FOUR POSITIONS IN ONE FAMILY</div>
        <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          {kids.map(({ id, kid, token }) => (
            <div key={id} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ width: "100%", height: 4, background: token.fill }}/>
              <span className="mono" style={{ fontSize: 8.5, letterSpacing: "0.18em", color: "var(--ink)" }}>{token.territoryShort}</span>
              <span className="mono" style={{ fontSize: 8.5, letterSpacing: "0.10em", color: "var(--faint)", textTransform: "none" }}>{kid.name} · {token.name}</span>
            </div>))}
        </div>
      </div>
      <div style={{ marginTop: 14, padding: "10px 14px", background: "var(--paper)", border: "1px solid #ECE7DA" }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>RECAP-BADGE TEST · 20px</div>
        <div style={{ marginTop: 8, display: "flex", gap: 10, alignItems: "center" }}>
          {kids.map(({ id, kid }) => <ChildChipR8 key={id} kid={kid} palette={palette} size={20}/>)}
          <span style={{ flex: 1 }}/>
          <span className="mono" style={{ fontSize: 8.5, color: "#8C91A5", letterSpacing: "0.18em" }}>FAMILY HOLDS</span>
        </div>
      </div>
    </div>
  );
}

function SystemAuditR8({ palette }) {
  const kids = ["leo","max","jack","jane"].map(id => ({ id, kid: FAMILY.find(f => f.id === id), token: palette.family[id] }));
  return (
    <div style={{ width: 620, height: 560, background: "var(--chalk)", padding: "30px 36px", boxSizing: "border-box", fontFamily: "Plus Jakarta Sans", color: "var(--ink)" }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#8C91A5" }}>{palette.kicker} · SYSTEM AUDIT</div>
      <h2 style={{ margin: "8px 0 0", fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 500, fontSize: 26, letterSpacing: "-0.018em" }}>One family. Four positions.</h2>
      <div style={{ marginTop: 18, borderTop: "1px solid #E0DED6" }}>
        {[["CHROMATIC INTENSITY", palette.audit.chroma],["VALUE LADDER", palette.audit.value],["TEMPERATURE", palette.audit.temperature],["HUE PROGRESSION", palette.audit.territories]].map(([k, v], i) => (
          <div key={i} style={{ padding: "14px 0", borderBottom: i === 3 ? "none" : "1px solid #ECE7DA", display: "grid", gridTemplateColumns: "auto 175px 1fr", columnGap: 14, alignItems: "baseline" }}>
            <span className="mono" style={{ fontSize: 10, letterSpacing: "0.20em", color: "#3CA85A" }}>✓ PASS</span>
            <span className="mono" style={{ fontSize: 9.5, letterSpacing: "0.20em", color: "var(--ink)" }}>{k}</span>
            <span style={{ fontSize: 12.5, color: "var(--ink)", letterSpacing: "-0.003em", lineHeight: 1.5 }}>{v}</span>
          </div>))}
      </div>
      <div style={{ marginTop: 14, padding: "12px 14px", background: "var(--paper)", border: "1px solid #ECE7DA" }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>PER-COLOR NOTES</div>
        <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: "90px 1fr", rowGap: 5, columnGap: 10 }}>
          {kids.map(({ id, kid, token }) => (
            <React.Fragment key={id}>
              <span className="mono" style={{ fontSize: 8.5, letterSpacing: "0.18em", color: "var(--ink)" }}>{kid.name.toUpperCase()} · {token.name.toUpperCase()}</span>
              <span style={{ fontSize: 11, color: "var(--mid)", lineHeight: 1.4, letterSpacing: "-0.003em" }}>{token.note}</span>
            </React.Fragment>))}
        </div>
      </div>
    </div>
  );
}

function ConstraintCheckR8({ palette }) {
  return (
    <div style={{ width: 620, height: 560, background: "var(--chalk)", padding: "30px 36px", boxSizing: "border-box", fontFamily: "Plus Jakarta Sans", color: "var(--ink)" }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#8C91A5" }}>{palette.kicker} · CONSTRAINT CHECK</div>
      <h2 style={{ margin: "8px 0 0", fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 500, fontSize: 26, letterSpacing: "-0.018em" }}>Four constraints. Defended explicitly.</h2>
      <div style={{ marginTop: 18, borderTop: "1px solid #E0DED6" }}>
        {palette.rationale.constraints.map(([k, v], i) => (
          <div key={i} style={{ padding: "14px 0", borderBottom: i === palette.rationale.constraints.length - 1 ? "none" : "1px solid #ECE7DA", display: "grid", gridTemplateColumns: "auto 175px 1fr", columnGap: 14, alignItems: "baseline" }}>
            <span className="mono" style={{ fontSize: 10, letterSpacing: "0.20em", color: "#3CA85A" }}>✓ PASS</span>
            <span className="mono" style={{ fontSize: 9.5, letterSpacing: "0.20em", color: "var(--ink)" }}>{k}</span>
            <span style={{ fontSize: 12.5, color: "var(--ink)", letterSpacing: "-0.003em", lineHeight: 1.5 }}>{v}</span>
          </div>))}
      </div>
    </div>
  );
}

function NineColorLandscapeR8({ palette }) {
  const subj = Object.entries(SUBJECTS_R8);
  const kids = ["leo","max","jack","jane"].map(id => ({ id, kid: FAMILY.find(f => f.id === id), token: palette.family[id] }));
  return (
    <div style={{ width: 760, height: 560, background: "var(--chalk)", padding: "30px 36px", boxSizing: "border-box", fontFamily: "Plus Jakarta Sans", color: "var(--ink)" }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#8C91A5" }}>{palette.kicker} · NINE-COLOR LANDSCAPE</div>
      <h2 style={{ margin: "8px 0 0", fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 500, fontSize: 26, letterSpacing: "-0.018em" }}>Five subjects, four earths.</h2>
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
            </div>))}
        </div>
      </div>
      <div style={{ marginTop: 18 }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>FOUR CHILDREN · ONE FAMILY</div>
        <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          {kids.map(({ id, kid, token }) => (
            <div key={id} style={{ background: "#FAFAFA", padding: "12px 12px 14px", border: "1px solid #ECE7DA" }}>
              <div style={{ height: 38, display: "flex", alignItems: "center" }}>
                <ChildChipR8 kid={kid} palette={palette} size={28}/>
              </div>
              <div className="mono" style={{ marginTop: 6, fontSize: 8.5, letterSpacing: "0.18em", color: "var(--ink)" }}>{kid.name.toUpperCase()} · {token.name.toUpperCase()}</div>
              <div className="mono" style={{ marginTop: 1, fontSize: 8.5, letterSpacing: "0.10em", color: "var(--faint)", textTransform: "none" }}>{token.fill}</div>
              <div className="mono" style={{ marginTop: 1, fontSize: 8.5, letterSpacing: "0.16em", color: "#8C91A5" }}>{token.territoryShort}</div>
            </div>))}
        </div>
      </div>
      <div style={{ marginTop: 18, padding: "16px 18px", background: "#FAFAFA", border: "1px solid #ECE7DA" }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>SAME-SCREEN · ALL NINE</div>
        <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          {subj.map(([k]) => <SubjectR8 key={k} subject={k} dense/>)}
          <span style={{ width: 1, height: 22, background: "#0C1020" }}/>
          {kids.map(({ id, kid }) => <ChildR8 key={id} kid={kid} palette={palette} size={20}/>)}
        </div>
      </div>
    </div>
  );
}

function RationaleNoteR8({ palette }) {
  return (<NoteCard persona={palette.kicker + " · " + palette.title.toUpperCase()} title={palette.rationale.headline} move={<>{palette.rationale.move}</>} bullets={palette.rationale.bullets}/>);
}

function FrameCardR8() {
  return (
    <div style={{ width: 620, height: 700, background: "var(--chalk)", padding: "30px 36px", boxSizing: "border-box", fontFamily: "Plus Jakarta Sans", color: "var(--ink)" }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#8C91A5" }}>ROUND EIGHT · ONE FAMILY</div>
      <h2 style={{ margin: "10px 0 0", fontFamily: "Fraunces", fontWeight: 600, fontSize: 30, lineHeight: 1.05, letterSpacing: "-0.018em" }}>Cream → Brown.<br/>One family, four positions.</h2>
      <p style={{ marginTop: 12, fontSize: 12.5, lineHeight: 1.55, color: "var(--mid)", letterSpacing: "-0.003em", textWrap: "pretty" }}>
        User direction: keep the four colors in a single earth family — cream, oat, clay, brown. The risk is reading as four shades; the defense is a strict lightness ladder plus deliberate hue progression inside the warm-earth wedge.
      </p>
      <div style={{ marginTop: 16, padding: "12px 14px", background: "#FAFAFA", border: "1px solid #ECE7DA" }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>HOW THE FAMILY HOLDS</div>
        <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: "auto 1fr", rowGap: 6, columnGap: 12, alignItems: "baseline" }}>
          {[["LIGHTNESS", "Strict 4-band ladder. No two colors within 15 L points."],
            ["HUE",       "Each color sits at a different position in the warm-earth wedge — yellow-cream → red-clay → cool-brown."],
            ["CHROMA",    "Most palettes match low; one (Earth Wide) opens up to leather-card range."],
            ["KNOCKOUT",  "Cream and Bone need ink letters at small scale; the renderer chooses per-token."]].map(([n, v]) => (
              <React.Fragment key={n}>
                <span className="mono" style={{ fontSize: 9, letterSpacing: "0.20em", color: "var(--ink)" }}>{n}</span>
                <span style={{ fontSize: 12, color: "var(--ink)", letterSpacing: "-0.003em", lineHeight: 1.45 }}>{v}</span>
              </React.Fragment>))}
        </div>
      </div>
      <div style={{ marginTop: 14 }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#8C91A5" }}>THREE PALETTES</div>
        <div style={{ marginTop: 10, borderTop: "1px solid #E0DED6" }}>
          {[["M · SINGLE EARTH",      "Cocoa / Clay / Oat / Cream — strict tonal ladder, all earth."],
            ["N · EARTH, WITH WINE",  "Wine / Clay / Oat / Cream — keep the red anchor at the family's red edge."],
            ["O · EARTH WIDE",        "Walnut / Terracotta / Camel / Bone — leather sample card, more chroma."]].map(([k, v]) => (
            <div key={k} style={{ padding: "10px 0", borderBottom: "1px solid #ECE7DA", display: "grid", gridTemplateColumns: "210px 1fr", gap: 14, alignItems: "baseline" }}>
              <span className="mono" style={{ fontSize: 9.5, letterSpacing: "0.18em", color: "var(--ink)" }}>{k}</span>
              <span style={{ fontSize: 12, color: "var(--ink)", letterSpacing: "-0.003em" }}>{v}</span>
            </div>))}
        </div>
      </div>
    </div>
  );
}

function CompareStripR8() {
  return (
    <div style={{ width: 880, height: 620, background: "#FAFAFA", padding: "30px 36px", boxSizing: "border-box", fontFamily: "Plus Jakarta Sans", color: "var(--ink)" }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#8C91A5" }}>SAME ROW · THREE PALETTES</div>
      <h2 style={{ margin: "8px 0 0", fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 500, fontSize: 26, letterSpacing: "-0.018em" }}>the screen the parent sees</h2>
      <p style={{ marginTop: 6, fontSize: 12, color: "var(--mid)", lineHeight: 1.5, letterSpacing: "-0.003em" }}>Expanded cluster, both groups. Single-family palettes tested in the brief's required composition.</p>
      <div style={{ marginTop: 18, borderTop: "1px solid #E0DED6" }}>
        {[PALETTE_M, PALETTE_N, PALETTE_O].map((p, i) => (
          <div key={p.id} style={{ padding: "16px 0", borderBottom: i === 2 ? "none" : "1px solid #ECE7DA" }}>
            <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 18, alignItems: "center" }}>
              <div>
                <div className="mono" style={{ fontSize: 9, letterSpacing: "0.20em", color: "#8C91A5" }}>{p.kicker}</div>
                <div style={{ marginTop: 4, fontFamily: "Fraunces", fontStyle: "italic", fontSize: 18, fontWeight: 500, letterSpacing: "-0.018em" }}>{p.title}</div>
                <div className="mono" style={{ marginTop: 2, fontSize: 8.5, letterSpacing: "0.10em", color: "var(--faint)", textTransform: "none" }}>{["leo","max","jack","jane"].map(id => p.family[id].fill).join(" · ")}</div>
              </div>
              <div style={{ padding: "14px 16px", background: "var(--chalk)", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                <SubjectR8 subject="sci"/><SepR8/>
                <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>SPLIT</span>
                <span style={{ width: 1, height: 16, background: "#E0DED6", margin: "0 4px" }}/>
                <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.22em" }}>G1</span>
                {["leo","max"].map(id => { const k = FAMILY.find(f => f.id === id); return <ChildR8 key={id} kid={k} palette={p}/>; })}
                <span style={{ width: 1, height: 14, background: "#E0DED6" }}/>
                <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.22em" }}>G2</span>
                {["jack","jane"].map(id => { const k = FAMILY.find(f => f.id === id); return <ChildR8 key={id} kid={k} palette={p}/>; })}
              </div>
            </div>
          </div>))}
      </div>
      <div style={{ marginTop: 12, padding: "12px 16px", background: "var(--chalk)", border: "1px solid #ECE7DA" }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>RECAP-BADGE STRIP · ALL THREE · 20px</div>
        <div style={{ marginTop: 10, display: "flex", gap: 24, alignItems: "center" }}>
          {[PALETTE_M, PALETTE_N, PALETTE_O].map(p => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="mono" style={{ fontSize: 8.5, letterSpacing: "0.18em", color: "var(--ink)" }}>{p.kicker.split(" · ")[0]}</span>
              {["leo","max","jack","jane"].map(id => { const k = FAMILY.find(f => f.id === id); return <ChildChipR8 key={id} kid={k} palette={p} size={20}/>; })}
            </div>))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { TodayViewR8, BlockSheetR8, RecapBadgeR8, PaletteCardR8, ConstraintCheckR8, SystemAuditR8, NineColorLandscapeR8, RationaleNoteR8, FrameCardR8, CompareStripR8 });
