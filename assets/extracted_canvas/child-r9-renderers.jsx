/* global React, FAMILY, SUBJECTS_R9, SubjectR9, ChildR9, ChildChipR9,
   PrintCard, PrintHeader, NoteCard, PRINT_DEMO, RECAP_DEMO,
   PALETTE_P, PALETTE_Q, PALETTE_R, letterColorR9 */

function PhoneBandR9() {
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
function SepR9() { return <span style={{ width: 1, height: 9, background: "#DCD6C5" }}/>; }
function CaretR9({ open }) {
  return (<svg width="9" height="9" viewBox="0 0 9 9">{open ? <path d="M1 3 L4.5 6.5 L8 3" fill="none" stroke="#B7B4A8" strokeWidth="1" strokeLinecap="round"/> : <path d="M3 1 L6.5 4.5 L3 8" fill="none" stroke="#B7B4A8" strokeWidth="1" strokeLinecap="round"/>}</svg>);
}

function TodayViewR9({ palette }) {
  return (
    <div style={{ width: 410, background: "var(--chalk)", borderRadius: 28, overflow: "hidden", boxShadow: "0 1px 0 rgba(0,0,0,0.06), 0 18px 40px -20px rgba(0,0,0,0.45)", fontFamily: "Plus Jakarta Sans" }}>
      <PhoneBandR9/>
      <div style={{ padding: "20px 22px 0" }}>
        <div className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>THEME</div>
        <div style={{ marginTop: 6, fontFamily: "Fraunces", fontWeight: 600, fontSize: 28, lineHeight: 1.05, letterSpacing: "-0.018em" }}>Maps <em style={{ fontWeight: 500 }}>and</em> Borders</div>
        <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10 }}>
          <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>9 BLOCKS</span><SepR9/>
          <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>3 HRS</span><SepR9/>
          <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>5 SUBJECTS</span>
        </div>
      </div>
      <div style={{ marginTop: 18, padding: "0 22px" }}>
        <div style={{ borderTop: "1px solid #ECE7DA" }}/>
        <SiblingRowR9 row={{ time: 40, name: "Cartography Lab", subject: "math", modifier: "2 × 20-min · together", pos: "01" }}/>
        <SiblingRowR9 row={{ time: 20, name: "Border Stories", subject: "la", modifier: "1 × 20-min · together", pos: "02" }}/>
      </div>
      <ExpandedSplitR9 palette={palette}/>
      <div style={{ padding: "0 22px" }}>
        <SiblingRowR9 row={{ time: 20, name: "Mountains, Rivers, Lines", subject: "sci", modifier: "1 × 20-min · together", pos: "04" }}/>
        <SiblingRowR9 row={{ time: 40, name: "Draw Your Map", subject: "ca", modifier: "2 × 20-min · parallel", pos: "05" }}/>
      </div>
    </div>
  );
}

function SiblingRowR9({ row }) {
  return (
    <div style={{ padding: "20px 0", borderBottom: "1px solid #ECE7DA", display: "grid", gridTemplateColumns: "36px 1fr auto", gap: 12, alignItems: "baseline" }}>
      <span className="mono" style={{ fontSize: 10, color: "var(--ink)", letterSpacing: "0.18em", alignSelf: "center" }}>{row.time}M</span>
      <div>
        <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 500, fontSize: 16, letterSpacing: "-0.008em", lineHeight: 1.25 }}>{row.name}</div>
        <div style={{ marginTop: 6, display: "flex", alignItems: "flex-end", gap: 9 }}>
          <SubjectR9 subject={row.subject}/><SepR9/>
          <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>{row.modifier}</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, alignItems: "center", alignSelf: "center" }}>
        <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>{row.pos}</span><CaretR9/>
      </div>
    </div>
  );
}

function ExpandedSplitR9({ palette }) {
  return (
    <div style={{ padding: "20px 0 22px" }}>
      <div style={{ padding: "0 22px", display: "grid", gridTemplateColumns: "36px 1fr auto", gap: 12, alignItems: "baseline" }}>
        <span className="mono" style={{ fontSize: 10, color: "var(--ink)", letterSpacing: "0.18em", alignSelf: "center" }}>60M</span>
        <div>
          <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 500, fontSize: 16, letterSpacing: "-0.008em" }}>Geography of Empire</div>
          <div style={{ marginTop: 6, display: "flex", alignItems: "flex-end", gap: 9 }}>
            <SubjectR9 subject="gh"/><SepR9/>
            <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>3 × 20-min · split</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center", alignSelf: "center" }}>
          <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>03</span><CaretR9 open/>
        </div>
      </div>
      <GroupBlockR9 palette={palette} label="GROUP 1" kidIds={["leo","max"]} blocks={[
        { time: 20, name: "Trade Routes of the Roman Empire" },
        { time: 20, name: "Border Disputes — Case Studies" }]}/>
      <GroupBlockR9 palette={palette} label="GROUP 2" kidIds={["jack","jane"]} blocks={[
        { time: 20, name: "Mapmakers Through History" }]}/>
      <div style={{ borderBottom: "1px solid #ECE7DA", marginTop: 22 }}/>
    </div>
  );
}

function GroupBlockR9({ palette, label, kidIds, blocks }) {
  return (
    <div style={{ marginTop: 22, padding: "0 22px 0 58px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: 12, marginBottom: 10 }}>
        <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.22em" }}>{label}</span>
        <div style={{ display: "flex", gap: 10 }}>{kidIds.map(id => { const k = FAMILY.find(f => f.id === id); return <ChildR9 key={id} kid={k} palette={palette}/>; })}</div>
      </div>
      {blocks.map((b, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "36px 1fr", gap: 12, alignItems: "baseline", padding: "8px 0" }}>
          <span className="mono" style={{ fontSize: 10, color: "var(--ink)", letterSpacing: "0.18em", alignSelf: "center" }}>{b.time}M</span>
          <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 500, fontSize: 14, letterSpacing: "-0.005em", lineHeight: 1.3 }}>{b.name}</div>
        </div>))}
    </div>
  );
}

function BlockSheetR9({ palette }) {
  const step = PRINT_DEMO.step;
  return (
    <PrintCard>
      <PrintHeader/>
      <h3 style={{ margin: "20px 0 4px", fontFamily: "Plus Jakarta Sans", fontWeight: 500, fontSize: 14 }}>Geography of Empire — Step 1</h3>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 10 }}>
        <SubjectR9 subject="gh" dense/><SepR9/>
        <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>STEP 01 · 5 MIN</span>
      </div>
      <p style={{ margin: 0, fontFamily: "Plus Jakarta Sans", fontSize: 11.5, lineHeight: 1.5, letterSpacing: "-0.003em" }}>
        Lay the world map on the table. Ask each child to point to a place they have heard of and tell what they know.
      </p>
      <div style={{ marginTop: 14, display: "grid", rowGap: 8 }}>
        {step.perChild.map((p, i) => { const k = FAMILY.find(f => f.id === p.kid);
          return (<div key={i} style={{ display: "grid", gridTemplateColumns: "92px 1fr", columnGap: 12, alignItems: "center" }}>
            <ChildR9 kid={k} palette={palette} size={17}/>
            <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "var(--mid)", lineHeight: 1.4 }}>{p.note}</span>
          </div>);
        })}
      </div>
    </PrintCard>
  );
}

function RecapBadgeR9({ palette }) {
  return (
    <div style={{ width: 420, height: 420, background: "#FAFAFA", padding: "24px 28px", boxSizing: "border-box", fontFamily: "Plus Jakarta Sans", color: "var(--ink)" }}>
      <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>RECAP · MASTERY SHIFTS · WK 16</div>
      <hr style={{ marginTop: 10, border: "none", borderTop: "1px solid #0C1020" }}/>
      <div style={{ marginTop: 4 }}>
        {RECAP_DEMO.map(s => { const k = FAMILY.find(f => f.id === s.kid);
          return (<div key={s.kid} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 10, alignItems: "center", padding: "10px 0" }}>
            <ChildR9 kid={k} palette={palette} size={20} hideName/>
            <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "var(--mid)", lineHeight: 1.4 }}>
              <strong style={{ color: "var(--ink)", fontWeight: 600, fontStyle: "italic" }}>{k.name}</strong> — {s.shift}
            </span></div>); })}
      </div>
      <div style={{ marginTop: 14, padding: "12px 14px", background: "var(--chalk)" }}>
        <div className="mono" style={{ fontSize: 8.5, letterSpacing: "0.22em", color: "#8C91A5" }}>SMALLEST SCALE · 20px · vs ALL 8 SUBJECTS</div>
        <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {FAMILY.map(k => <ChildChipR9 key={k.id} kid={k} palette={palette} size={20}/>)}
          <span style={{ width: 1, height: 18, background: "#E0DED6", margin: "0 6px" }}/>
          {Object.keys(SUBJECTS_R9).map(s => <SubjectR9 key={s} subject={s} dense/>)}
        </div>
      </div>
    </div>
  );
}

function PaletteCardR9({ palette }) {
  const kids = ["leo","max","jack","jane"].map(id => ({ id, kid: FAMILY.find(f => f.id === id), token: palette.family[id] }));
  return (
    <div style={{ width: 620, height: 580, background: "var(--chalk)", padding: "30px 36px", boxSizing: "border-box", fontFamily: "Plus Jakarta Sans", color: "var(--ink)" }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#8C91A5" }}>{palette.kicker}</div>
      <h2 style={{ margin: "8px 0 0", fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 500, fontSize: 32, letterSpacing: "-0.018em" }}>{palette.title}</h2>
      <p style={{ marginTop: 4, fontSize: 13, color: "var(--mid)", letterSpacing: "-0.003em" }}>{palette.tagline}</p>
      <div className="mono" style={{ marginTop: 8, fontSize: 9, letterSpacing: "0.20em", color: "#3CA85A" }}>{palette.semantic}</div>
      <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
        {kids.map(({ id, kid, token }) => (
          <div key={id} style={{ background: "#FAFAFA", padding: "14px 12px 14px", border: "1px solid #ECE7DA" }}>
            <div style={{ height: 64, display: "flex", alignItems: "center" }}>
              <span style={{ width: 56, height: 56, borderRadius: 10, background: token.fill, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "Plus Jakarta Sans", fontStyle: "italic", fontWeight: 600, fontSize: 32, color: letterColorR9(token), lineHeight: 1 }}>{kid.initial}</span>
            </div>
            <div className="mono" style={{ marginTop: 10, fontSize: 9, letterSpacing: "0.18em", color: "var(--ink)" }}>{kid.name.toUpperCase()} · {token.name}</div>
            <div className="mono" style={{ marginTop: 2, fontSize: 8.5, letterSpacing: "0.10em", color: "var(--faint)", textTransform: "none" }}>{token.fill}</div>
            <div className="mono" style={{ marginTop: 4, fontSize: 8.5, letterSpacing: "0.18em", color: "#8C91A5" }}>↳ {token.territoryShort}</div>
          </div>))}
      </div>
      <div style={{ marginTop: 14, padding: "12px 14px", background: "var(--paper)", border: "1px solid #ECE7DA" }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>RECAP-BADGE TEST · 20px · vs SUBJECTS</div>
        <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {kids.map(({ id, kid }) => <ChildChipR9 key={id} kid={kid} palette={palette} size={20}/>)}
          <span style={{ width: 1, height: 18, background: "#E0DED6", margin: "0 4px" }}/>
          {Object.keys(SUBJECTS_R9).map(s => <SubjectR9 key={s} subject={s} dense/>)}
        </div>
      </div>
    </div>
  );
}

function ConstraintCheckR9({ palette }) {
  return (
    <div style={{ width: 660, height: 600, background: "var(--chalk)", padding: "30px 36px", boxSizing: "border-box", fontFamily: "Plus Jakarta Sans", color: "var(--ink)" }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#8C91A5" }}>{palette.kicker} · CONSTRAINT CHECK · 8 SUBJECTS</div>
      <h2 style={{ margin: "8px 0 0", fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 500, fontSize: 26, letterSpacing: "-0.018em" }}>Four constraints. Eight subjects.</h2>
      <div style={{ marginTop: 18, borderTop: "1px solid #E0DED6" }}>
        {palette.rationale.constraints.map(([k, v], i) => (
          <div key={i} style={{ padding: "14px 0", borderBottom: i === palette.rationale.constraints.length - 1 ? "none" : "1px solid #ECE7DA", display: "grid", gridTemplateColumns: "auto 200px 1fr", columnGap: 14, alignItems: "baseline" }}>
            <span className="mono" style={{ fontSize: 10, letterSpacing: "0.20em", color: "#3CA85A" }}>✓ PASS</span>
            <span className="mono" style={{ fontSize: 9.5, letterSpacing: "0.20em", color: "var(--ink)" }}>{k}</span>
            <span style={{ fontSize: 12, color: "var(--ink)", letterSpacing: "-0.003em", lineHeight: 1.5 }}>{v}</span>
          </div>))}
      </div>
      <div style={{ marginTop: 12, padding: "12px 14px", background: "var(--paper)", border: "1px solid #ECE7DA" }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>TBD-SUBJECT REASONING</div>
        <p style={{ margin: "8px 0 0", fontSize: 11.5, color: "var(--mid)", lineHeight: 1.5, letterSpacing: "-0.003em" }}>{palette.rationale.tbdReasoning}</p>
      </div>
      <div style={{ marginTop: 10, padding: "12px 14px", background: "var(--paper)", border: "1px solid #ECE7DA" }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>INCLUSION-SEMANTIC CHECK</div>
        <p style={{ margin: "8px 0 0", fontSize: 11.5, color: "var(--mid)", lineHeight: 1.5, letterSpacing: "-0.003em" }}>{palette.rationale.inclusion}</p>
      </div>
    </div>
  );
}

function TenColorLandscapeR9({ palette }) {
  const subj = Object.entries(SUBJECTS_R9);
  const kids = ["leo","max","jack","jane"].map(id => ({ id, kid: FAMILY.find(f => f.id === id), token: palette.family[id] }));
  return (
    <div style={{ width: 800, height: 620, background: "var(--chalk)", padding: "30px 36px", boxSizing: "border-box", fontFamily: "Plus Jakarta Sans", color: "var(--ink)" }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#8C91A5" }}>{palette.kicker} · TEN-COLOR LANDSCAPE</div>
      <h2 style={{ margin: "8px 0 0", fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 500, fontSize: 26, letterSpacing: "-0.018em" }}>Eight subjects, four children.</h2>
      <p style={{ marginTop: 4, fontSize: 12, color: "var(--mid)", lineHeight: 1.5 }}>Two distinct families. Subjects: bright, label-bound underlines. Children: contained, restrained fills.</p>
      <div style={{ marginTop: 18 }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>EIGHT SUBJECTS · 6 NAMED + 2 TBD</div>
        <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 8 }}>
          {subj.map(([k, v]) => (
            <div key={k} style={{ background: "#FAFAFA", padding: "10px 9px 12px", border: "1px solid #ECE7DA" }}>
              <div style={{ height: 28, display: "flex", alignItems: "center" }}>
                <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "flex-start" }}>
                  <span className="mono" style={{ fontSize: 9.5, color: "var(--ink)", letterSpacing: "0.16em" }}>{v.abbr}</span>
                  <span style={{ width: 36, height: 2, background: v.hue, marginTop: 4, opacity: v.family === "tbd" ? 0.4 : 1 }}/>
                </span>
              </div>
              <div className="mono" style={{ marginTop: 6, fontSize: 7.5, letterSpacing: "0.10em", color: "var(--faint)", textTransform: "none" }}>{v.hue}</div>
              <div className="mono" style={{ marginTop: 1, fontSize: 7.5, letterSpacing: "0.14em", color: "#8C91A5" }}>{v.name.toUpperCase()}</div>
            </div>))}
        </div>
      </div>
      <div style={{ marginTop: 18 }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>FOUR CHILDREN</div>
        <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          {kids.map(({ id, kid, token }) => (
            <div key={id} style={{ background: "#FAFAFA", padding: "12px 12px 14px", border: "1px solid #ECE7DA" }}>
              <div style={{ height: 38, display: "flex", alignItems: "center" }}>
                <ChildChipR9 kid={kid} palette={palette} size={28}/>
              </div>
              <div className="mono" style={{ marginTop: 6, fontSize: 8.5, letterSpacing: "0.18em", color: "var(--ink)" }}>{kid.name.toUpperCase()} · {token.name.toUpperCase()}</div>
              <div className="mono" style={{ marginTop: 1, fontSize: 8.5, letterSpacing: "0.10em", color: "var(--faint)", textTransform: "none" }}>{token.fill}</div>
              <div className="mono" style={{ marginTop: 1, fontSize: 8.5, letterSpacing: "0.16em", color: "#8C91A5" }}>{token.territoryShort}</div>
            </div>))}
        </div>
      </div>
      <div style={{ marginTop: 16, padding: "16px 18px", background: "#FAFAFA", border: "1px solid #ECE7DA" }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>SAME-SCREEN · ALL TEN</div>
        <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          {subj.map(([k]) => <SubjectR9 key={k} subject={k} dense/>)}
          <span style={{ width: 1, height: 22, background: "#0C1020" }}/>
          {kids.map(({ id, kid }) => <ChildR9 key={id} kid={kid} palette={palette} size={20}/>)}
        </div>
      </div>
    </div>
  );
}

function RationaleNoteR9({ palette }) {
  return (<NoteCard persona={palette.kicker + " · " + palette.title.toUpperCase()} title={palette.rationale.headline} move={<>{palette.rationale.move}</>} bullets={palette.rationale.bullets}/>);
}

function FrameCardR9() {
  return (
    <div style={{ width: 660, height: 720, background: "var(--chalk)", padding: "30px 36px", boxSizing: "border-box", fontFamily: "Plus Jakarta Sans", color: "var(--ink)" }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#8C91A5" }}>ROUND NINE · EIGHT-SUBJECT REALITY</div>
      <h2 style={{ margin: "10px 0 0", fontFamily: "Fraunces", fontWeight: 600, fontSize: 28, lineHeight: 1.05, letterSpacing: "-0.018em" }}>Three corrections.<br/>One floor, two pushes past it.</h2>
      <div style={{ marginTop: 14, padding: "12px 14px", background: "#FAFAFA", border: "1px solid #ECE7DA" }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#C83030" }}>WHAT CHANGED</div>
        <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: "120px 1fr", rowGap: 6, columnGap: 12, alignItems: "baseline" }}>
          {[["MATH", "Polar #18A0B8 (teal). Not yellow. All prior teal candidates would collide."],
            ["GEO & HISTORY", "Vermilion #C83030 (red). Not orange. All prior reds (Wine, Bordeaux, Burgundy) collided directly."],
            ["EIGHT SUBJECTS", "PE Ember #F08A20 added. Two TBD slots reserved. Children palette must hold against all."]].map(([n, v]) => (
            <React.Fragment key={n}>
              <span className="mono" style={{ fontSize: 9, letterSpacing: "0.20em", color: "var(--ink)" }}>{n}</span>
              <span style={{ fontSize: 12, color: "var(--ink)", letterSpacing: "-0.003em", lineHeight: 1.45 }}>{v}</span>
            </React.Fragment>))}
        </div>
      </div>
      <div style={{ marginTop: 14, padding: "12px 14px", background: "#FAFAFA", border: "1px solid #ECE7DA" }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>CLOSED TERRITORIES</div>
        <p style={{ margin: "8px 0 0", fontSize: 11.5, color: "var(--mid)", lineHeight: 1.5 }}>
          Reds, teals, greens, oranges, blues, purples — all collide with current subjects.
          Pinks fail gender-neutrality. Near-blacks fail visual equity.
          Open: <strong style={{ color: "var(--ink)" }}>earth tones</strong>, <strong style={{ color: "var(--ink)" }}>aubergine/brown-purple</strong>, <strong style={{ color: "var(--ink)" }}>stone/mushroom warm-greys</strong>.
        </p>
      </div>
      <div style={{ marginTop: 14 }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#8C91A5" }}>THREE PALETTES</div>
        <div style={{ marginTop: 10, borderTop: "1px solid #E0DED6" }}>
          {[["P · SINGLE EARTH REFINED",  "Cocoa / Clay / Camel / Fawn — the floor, with the Cream→Fawn equity fix."],
            ["Q · AUBERGINE GARDEN",     "Aubergine / Mulberry / Mushroom / Greige — brown-purple register; considered beauty."],
            ["R · STONE & METAL",        "Graphite / Brass / Sandstone / Alabaster — four-territory mineral cabinet."]].map(([k, v]) => (
            <div key={k} style={{ padding: "10px 0", borderBottom: "1px solid #ECE7DA", display: "grid", gridTemplateColumns: "230px 1fr", gap: 14, alignItems: "baseline" }}>
              <span className="mono" style={{ fontSize: 9.5, letterSpacing: "0.18em", color: "var(--ink)" }}>{k}</span>
              <span style={{ fontSize: 12, color: "var(--ink)", letterSpacing: "-0.003em" }}>{v}</span>
            </div>))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { TodayViewR9, BlockSheetR9, RecapBadgeR9, PaletteCardR9, ConstraintCheckR9, TenColorLandscapeR9, RationaleNoteR9, FrameCardR9 });
