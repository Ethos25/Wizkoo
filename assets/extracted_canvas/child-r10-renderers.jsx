/* global React, FAMILY, SUBJECTS_R10, SubjectR10, ChildR10, ChildChipR10,
   PrintCard, PrintHeader, PRINT_DEMO, RECAP_DEMO, PALETTE_LOCK, letterColorR10 */

function PhoneBandR10() {
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
function SepR10() { return <span style={{ width: 1, height: 9, background: "#DCD6C5" }}/>; }
function CaretR10({ open }) {
  return (<svg width="9" height="9" viewBox="0 0 9 9">{open ? <path d="M1 3 L4.5 6.5 L8 3" fill="none" stroke="#B7B4A8" strokeWidth="1" strokeLinecap="round"/> : <path d="M3 1 L6.5 4.5 L3 8" fill="none" stroke="#B7B4A8" strokeWidth="1" strokeLinecap="round"/>}</svg>);
}

function TodayViewR10({ palette }) {
  return (
    <div style={{ width: 410, background: "var(--chalk)", borderRadius: 28, overflow: "hidden", boxShadow: "0 1px 0 rgba(0,0,0,0.06), 0 18px 40px -20px rgba(0,0,0,0.45)", fontFamily: "Plus Jakarta Sans" }}>
      <PhoneBandR10/>
      <div style={{ padding: "20px 22px 0" }}>
        <div className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>THEME</div>
        <div style={{ marginTop: 6, fontFamily: "Fraunces", fontWeight: 600, fontSize: 28, lineHeight: 1.05, letterSpacing: "-0.018em" }}>Maps <em style={{ fontWeight: 500 }}>and</em> Borders</div>
        <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10 }}>
          <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>9 BLOCKS</span><SepR10/>
          <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>3 HRS</span><SepR10/>
          <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>5 SUBJECTS</span>
        </div>
      </div>
      <div style={{ marginTop: 18, padding: "0 22px" }}>
        <div style={{ borderTop: "1px solid #ECE7DA" }}/>
        <SiblingRowR10 row={{ time: 40, name: "Cartography Lab", subject: "math", modifier: "2 × 20-min · together", pos: "01" }}/>
        <SiblingRowR10 row={{ time: 20, name: "Border Stories", subject: "la", modifier: "1 × 20-min · together", pos: "02" }}/>
      </div>
      <ExpandedSplitR10 palette={palette}/>
      <div style={{ padding: "0 22px" }}>
        <SiblingRowR10 row={{ time: 20, name: "Mountains, Rivers, Lines", subject: "sci", modifier: "1 × 20-min · together", pos: "04" }}/>
        <SiblingRowR10 row={{ time: 40, name: "Draw Your Map", subject: "ca", modifier: "2 × 20-min · parallel", pos: "05" }}/>
      </div>
    </div>
  );
}

function SiblingRowR10({ row }) {
  return (
    <div style={{ padding: "20px 0", borderBottom: "1px solid #ECE7DA", display: "grid", gridTemplateColumns: "36px 1fr auto", gap: 12, alignItems: "baseline" }}>
      <span className="mono" style={{ fontSize: 10, color: "var(--ink)", letterSpacing: "0.18em", alignSelf: "center" }}>{row.time}M</span>
      <div>
        <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 500, fontSize: 16, letterSpacing: "-0.008em", lineHeight: 1.25 }}>{row.name}</div>
        <div style={{ marginTop: 6, display: "flex", alignItems: "flex-end", gap: 9 }}>
          <SubjectR10 subject={row.subject}/><SepR10/>
          <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>{row.modifier}</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, alignItems: "center", alignSelf: "center" }}>
        <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>{row.pos}</span><CaretR10/>
      </div>
    </div>
  );
}

function ExpandedSplitR10({ palette }) {
  return (
    <div style={{ padding: "20px 0 22px" }}>
      <div style={{ padding: "0 22px", display: "grid", gridTemplateColumns: "36px 1fr auto", gap: 12, alignItems: "baseline" }}>
        <span className="mono" style={{ fontSize: 10, color: "var(--ink)", letterSpacing: "0.18em", alignSelf: "center" }}>60M</span>
        <div>
          <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 500, fontSize: 16, letterSpacing: "-0.008em" }}>Geography of Empire</div>
          <div style={{ marginTop: 6, display: "flex", alignItems: "flex-end", gap: 9 }}>
            <SubjectR10 subject="gh"/><SepR10/>
            <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>3 × 20-min · split</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center", alignSelf: "center" }}>
          <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>03</span><CaretR10 open/>
        </div>
      </div>
      <GroupBlockR10 palette={palette} label="GROUP 1" kidIds={["leo","max"]} blocks={[
        { time: 20, name: "Trade Routes of the Roman Empire" },
        { time: 20, name: "Border Disputes — Case Studies" }]}/>
      <GroupBlockR10 palette={palette} label="GROUP 2" kidIds={["jack","jane"]} blocks={[
        { time: 20, name: "Mapmakers Through History" }]}/>
      <div style={{ borderBottom: "1px solid #ECE7DA", marginTop: 22 }}/>
    </div>
  );
}

function GroupBlockR10({ palette, label, kidIds, blocks }) {
  return (
    <div style={{ marginTop: 22, padding: "0 22px 0 58px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: 12, marginBottom: 10 }}>
        <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.22em" }}>{label}</span>
        <div style={{ display: "flex", gap: 10 }}>{kidIds.map(id => { const k = FAMILY.find(f => f.id === id); return <ChildR10 key={id} kid={k} palette={palette}/>; })}</div>
      </div>
      {blocks.map((b, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "36px 1fr", gap: 12, alignItems: "baseline", padding: "8px 0" }}>
          <span className="mono" style={{ fontSize: 10, color: "var(--ink)", letterSpacing: "0.18em", alignSelf: "center" }}>{b.time}M</span>
          <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 500, fontSize: 14, letterSpacing: "-0.005em", lineHeight: 1.3 }}>{b.name}</div>
        </div>))}
    </div>
  );
}

function BlockSheetR10({ palette }) {
  const step = PRINT_DEMO.step;
  return (
    <PrintCard>
      <PrintHeader/>
      <h3 style={{ margin: "20px 0 4px", fontFamily: "Plus Jakarta Sans", fontWeight: 500, fontSize: 14 }}>Geography of Empire — Step 1</h3>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 10 }}>
        <SubjectR10 subject="gh" dense/><SepR10/>
        <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>STEP 01 · 5 MIN</span>
      </div>
      <p style={{ margin: 0, fontFamily: "Plus Jakarta Sans", fontSize: 11.5, lineHeight: 1.5, letterSpacing: "-0.003em" }}>
        Lay the world map on the table. Ask each child to point to a place they have heard of and tell what they know.
      </p>
      <div style={{ marginTop: 14, display: "grid", rowGap: 8 }}>
        {step.perChild.map((p, i) => { const k = FAMILY.find(f => f.id === p.kid);
          return (<div key={i} style={{ display: "grid", gridTemplateColumns: "92px 1fr", columnGap: 12, alignItems: "center" }}>
            <ChildR10 kid={k} palette={palette} size={17}/>
            <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "var(--mid)", lineHeight: 1.4 }}>{p.note}</span>
          </div>);
        })}
      </div>
    </PrintCard>
  );
}

function RecapBadgeR10({ palette }) {
  return (
    <div style={{ width: 420, height: 460, background: "#FAFAFA", padding: "24px 28px", boxSizing: "border-box", fontFamily: "Plus Jakarta Sans", color: "var(--ink)" }}>
      <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>RECAP · MASTERY SHIFTS · WK 16</div>
      <hr style={{ marginTop: 10, border: "none", borderTop: "1px solid #0C1020" }}/>
      <div style={{ marginTop: 4 }}>
        {RECAP_DEMO.map(s => { const k = FAMILY.find(f => f.id === s.kid);
          return (<div key={s.kid} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 10, alignItems: "center", padding: "10px 0" }}>
            <ChildR10 kid={k} palette={palette} size={20} hideName/>
            <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "var(--mid)", lineHeight: 1.4 }}>
              <strong style={{ color: "var(--ink)", fontWeight: 600, fontStyle: "italic" }}>{k.name}</strong> — {s.shift}
            </span></div>); })}
      </div>
      <div style={{ marginTop: 14, padding: "12px 14px", background: "var(--chalk)" }}>
        <div className="mono" style={{ fontSize: 8.5, letterSpacing: "0.22em", color: "#8C91A5" }}>EQUITY TEST · 20px · vs CHALK</div>
        <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {FAMILY.map(k => <ChildChipR10 key={k.id} kid={k} palette={palette} size={20}/>)}
          <span style={{ width: 1, height: 18, background: "#E0DED6", margin: "0 6px" }}/>
          {Object.keys(SUBJECTS_R10).map(s => <SubjectR10 key={s} subject={s} dense/>)}
        </div>
      </div>
    </div>
  );
}

function PaletteCardR10({ palette }) {
  const kids = ["leo","max","jack","jane"].map(id => ({ id, kid: FAMILY.find(f => f.id === id), token: palette.family[id] }));
  return (
    <div style={{ width: 700, height: 620, background: "var(--chalk)", padding: "32px 38px", boxSizing: "border-box", fontFamily: "Plus Jakarta Sans", color: "var(--ink)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#8C91A5" }}>{palette.kicker}</div>
        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#3CA85A" }}>✓ CALIBRATION COMPLETE</div>
      </div>
      <h2 style={{ margin: "10px 0 0", fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 500, fontSize: 36, letterSpacing: "-0.018em" }}>{palette.title}</h2>
      <p style={{ marginTop: 6, fontSize: 13, color: "var(--mid)", letterSpacing: "-0.003em" }}>{palette.tagline}</p>
      <div className="mono" style={{ marginTop: 8, fontSize: 9, letterSpacing: "0.20em", color: "#3CA85A" }}>{palette.semantic}</div>
      <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {kids.map(({ id, kid, token }) => (
          <div key={id} style={{ background: "#FAFAFA", padding: "16px 14px 16px", border: "1px solid #ECE7DA" }}>
            <div style={{ height: 76, display: "flex", alignItems: "center" }}>
              <span style={{ width: 68, height: 68, borderRadius: 12, background: token.fill, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "Plus Jakarta Sans", fontStyle: "italic", fontWeight: 600, fontSize: 38, color: letterColorR10(token), lineHeight: 1 }}>{kid.initial}</span>
            </div>
            <div className="mono" style={{ marginTop: 12, fontSize: 9, letterSpacing: "0.18em", color: "var(--ink)" }}>{kid.name.toUpperCase()}</div>
            <div style={{ marginTop: 2, fontFamily: "Fraunces", fontStyle: "italic", fontSize: 18, fontWeight: 500, color: "var(--ink)", letterSpacing: "-0.018em" }}>{token.name}</div>
            <div className="mono" style={{ marginTop: 4, fontSize: 9, letterSpacing: "0.10em", color: "var(--ink)", textTransform: "none" }}>{token.fill}</div>
            <div className="mono" style={{ marginTop: 4, fontSize: 8.5, letterSpacing: "0.18em", color: "#8C91A5" }}>↳ {token.territoryShort}</div>
          </div>))}
      </div>
      <div style={{ marginTop: 16, padding: "12px 14px", background: "var(--paper)", border: "1px solid #ECE7DA" }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>EQUITY TEST · 20px · vs WARM CHALK SURFACE</div>
        <div style={{ marginTop: 10, display: "flex", gap: 10, alignItems: "center" }}>
          {kids.map(({ id, kid }) => <ChildChipR10 key={id} kid={kid} palette={palette} size={20}/>)}
          <span style={{ flex: 1 }}/>
          <span className="mono" style={{ fontSize: 8.5, color: "#3CA85A", letterSpacing: "0.18em" }}>✓ ALL FOUR HOLD CHROMA</span>
        </div>
      </div>
    </div>
  );
}

function CalibrationNoteR10({ palette }) {
  return (
    <div style={{ width: 660, height: 540, background: "var(--chalk)", padding: "30px 36px", boxSizing: "border-box", fontFamily: "Plus Jakarta Sans", color: "var(--ink)" }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#8C91A5" }}>{palette.kicker} · TWO CALIBRATIONS</div>
      <h2 style={{ margin: "8px 0 0", fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 500, fontSize: 26, letterSpacing: "-0.018em" }}>The Mulberry trap and the Greige trap, avoided.</h2>
      <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ padding: "16px 18px", background: "#FAFAFA", border: "1px solid #ECE7DA" }}>
          <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>PLUM · MAX</div>
          <div style={{ marginTop: 8, display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ width: 36, height: 36, background: "#7E4858", borderRadius: 6 }}/>
            <span style={{ fontSize: 18, color: "var(--faint)" }}>→</span>
            <span style={{ width: 36, height: 36, background: "#5E2E48", borderRadius: 6 }}/>
          </div>
          <div className="mono" style={{ marginTop: 8, fontSize: 8.5, letterSpacing: "0.10em", color: "var(--faint)", textTransform: "none" }}>#7E4858 (Mulberry) → #5E2E48 (Plum)</div>
          <p style={{ marginTop: 10, fontSize: 11.5, color: "var(--mid)", lineHeight: 1.5, letterSpacing: "-0.003em" }}>
            Hue shifted 35° toward purple (350° → 315°). Chroma raised slightly (0.07 → 0.08). Lightness held.
            <br/><br/>Result: clearly purple at glance. 60° hue away from Vermilion, half its chroma. Dye-vat plum, not red.
          </p>
        </div>
        <div style={{ padding: "16px 18px", background: "#FAFAFA", border: "1px solid #ECE7DA" }}>
          <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>OAT · JANE</div>
          <div style={{ marginTop: 8, display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ width: 36, height: 36, background: "#D8CCB8", borderRadius: 6 }}/>
            <span style={{ fontSize: 18, color: "var(--faint)" }}>→</span>
            <span style={{ width: 36, height: 36, background: "#CDB68C", borderRadius: 6 }}/>
          </div>
          <div className="mono" style={{ marginTop: 8, fontSize: 8.5, letterSpacing: "0.10em", color: "var(--faint)", textTransform: "none" }}>#D8CCB8 (Greige) → #CDB68C (Oat)</div>
          <p style={{ marginTop: 10, fontSize: 11.5, color: "var(--mid)", lineHeight: 1.5, letterSpacing: "-0.003em" }}>
            Chroma raised 2.5× (0.03 → 0.075). Lightness lowered 7 points (80 → 73). Hue held at warm grain.
            <br/><br/>Result: chromatic grain. Holds against #F8F4E9 chalk surface as a colored container, not as outline + letter.
          </p>
        </div>
      </div>
      <div style={{ marginTop: 14, padding: "12px 16px", background: "#FAFAFA", border: "1px solid #ECE7DA" }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>SIDE-BY-SIDE · BEFORE → AFTER · vs CHALK</div>
        <div style={{ marginTop: 10, display: "flex", gap: 16, alignItems: "center", padding: "12px 16px", background: "var(--chalk)" }}>
          <span className="mono" style={{ fontSize: 8.5, letterSpacing: "0.18em", color: "var(--ink)" }}>BEFORE</span>
          <span style={{ width: 24, height: 24, background: "#3A2A38", borderRadius: 5 }}/>
          <span style={{ width: 24, height: 24, background: "#7E4858", borderRadius: 5 }}/>
          <span style={{ width: 24, height: 24, background: "#A89888", borderRadius: 5 }}/>
          <span style={{ width: 24, height: 24, background: "#D8CCB8", borderRadius: 5 }}/>
          <span style={{ width: 1, height: 24, background: "#0C1020", margin: "0 6px" }}/>
          <span className="mono" style={{ fontSize: 8.5, letterSpacing: "0.18em", color: "#3CA85A" }}>AFTER</span>
          <span style={{ width: 24, height: 24, background: "#3A2A38", borderRadius: 5 }}/>
          <span style={{ width: 24, height: 24, background: "#5E2E48", borderRadius: 5 }}/>
          <span style={{ width: 24, height: 24, background: "#A89888", borderRadius: 5 }}/>
          <span style={{ width: 24, height: 24, background: "#CDB68C", borderRadius: 5 }}/>
        </div>
      </div>
    </div>
  );
}

function CollisionAuditR10({ palette }) {
  const rows = [
    { kid: "leo",  name: "Aubergine", subject: "Amethyst purple #8848E0", check: "PASS", detail: "320° / C 0.06 / L 28 vs 270° / C 0.16 / L 50 — 50° hue, 22 L, 60% chroma differential. Brown-shift visible." },
    { kid: "max",  name: "Plum",      subject: "Vermilion red #C83030",   check: "PASS", detail: "315° / C 0.08 / L 28 vs 15° / C 0.18 / L 45 — 60° hue, 17 L, 55% chroma differential. Purple-shift unambiguous." },
    { kid: "max",  name: "Plum",      subject: "Amethyst purple #8848E0", check: "PASS", detail: "315° / C 0.08 / L 28 vs 270° / C 0.16 / L 50 — 45° hue, 22 L, 50% chroma differential. Brown-purple, not label-purple." },
    { kid: "jack", name: "Stone",     subject: "all subjects",            check: "PASS", detail: "60° / C 0.04 / L 65 — neutral warm-grey, far from every chromatic subject." },
    { kid: "jane", name: "Oat",       subject: "Ember orange #F08A20",    check: "PASS", detail: "70° / C 0.075 / L 73 vs 50° / C 0.18 / L 65 — 20° hue, 8 L, 40% chroma differential. Grain, not orange-label." },
    { kid: "jane", name: "Oat",       subject: "Warm Chalk #F8F4E9 surface", check: "PASS", detail: "Oat L 73 vs Chalk L 95 — 22 L gap. Plus chroma differential C 0.075 vs C 0.01. Reads as colored container, not surface." },
  ];
  return (
    <div style={{ width: 760, height: 580, background: "var(--chalk)", padding: "30px 36px", boxSizing: "border-box", fontFamily: "Plus Jakarta Sans", color: "var(--ink)" }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#8C91A5" }}>{palette.kicker} · SUBJECT COLLISION AUDIT</div>
      <h2 style={{ margin: "8px 0 0", fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 500, fontSize: 26, letterSpacing: "-0.018em" }}>All four hold against the eight-subject landscape.</h2>
      <div style={{ marginTop: 18, borderTop: "1px solid #E0DED6" }}>
        {rows.map((r, i) => { const k = FAMILY.find(f => f.id === r.kid);
          return (
            <div key={i} style={{ padding: "12px 0", borderBottom: i === rows.length - 1 ? "none" : "1px solid #ECE7DA", display: "grid", gridTemplateColumns: "auto 130px 220px 1fr", columnGap: 14, alignItems: "center" }}>
              <ChildChipR10 kid={k} palette={palette} size={18}/>
              <span className="mono" style={{ fontSize: 10, letterSpacing: "0.18em", color: "var(--ink)" }}>{r.name.toUpperCase()}</span>
              <span style={{ fontSize: 11.5, color: "var(--mid)" }}>vs {r.subject}</span>
              <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 10, alignItems: "baseline" }}>
                <span className="mono" style={{ fontSize: 9.5, letterSpacing: "0.20em", color: "#3CA85A" }}>✓ {r.check}</span>
                <span style={{ fontSize: 11, color: "var(--ink)", lineHeight: 1.4, letterSpacing: "-0.003em" }}>{r.detail}</span>
              </div>
            </div>);
        })}
      </div>
      <div style={{ marginTop: 14, padding: "12px 14px", background: "var(--paper)", border: "1px solid #ECE7DA" }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>TBD-SUBJECT NOTE</div>
        <p style={{ margin: "8px 0 0", fontSize: 11, color: "var(--mid)", lineHeight: 1.5, letterSpacing: "-0.003em" }}>
          The brown-purple-grain register leaves yellow, gold, pink/coral territories open for World Languages and Life Skills.
          Hue 90°–340° (excluding the children's narrow bands at 60–70° and 315–320°) remains usable at full chroma without collision.
        </p>
      </div>
    </div>
  );
}

function TenColorLandscapeR10({ palette }) {
  const subj = Object.entries(SUBJECTS_R10);
  const kids = ["leo","max","jack","jane"].map(id => ({ id, kid: FAMILY.find(f => f.id === id), token: palette.family[id] }));
  return (
    <div style={{ width: 800, height: 600, background: "var(--chalk)", padding: "30px 36px", boxSizing: "border-box", fontFamily: "Plus Jakarta Sans", color: "var(--ink)" }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#8C91A5" }}>{palette.kicker} · TEN-COLOR LANDSCAPE</div>
      <h2 style={{ margin: "8px 0 0", fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 500, fontSize: 26, letterSpacing: "-0.018em" }}>Six subjects. Two TBD. Four children.</h2>
      <div style={{ marginTop: 18 }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>EIGHT SUBJECTS · UNDERLINES</div>
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
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>FOUR CHILDREN · CONTAINERS</div>
        <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {kids.map(({ id, kid, token }) => (
            <div key={id} style={{ background: "#FAFAFA", padding: "12px 12px 14px", border: "1px solid #ECE7DA" }}>
              <div style={{ height: 38, display: "flex", alignItems: "center" }}>
                <ChildChipR10 kid={kid} palette={palette} size={28}/>
              </div>
              <div className="mono" style={{ marginTop: 6, fontSize: 8.5, letterSpacing: "0.18em", color: "var(--ink)" }}>{kid.name.toUpperCase()} · {token.name.toUpperCase()}</div>
              <div className="mono" style={{ marginTop: 1, fontSize: 8.5, letterSpacing: "0.10em", color: "var(--faint)", textTransform: "none" }}>{token.fill}</div>
              <div className="mono" style={{ marginTop: 1, fontSize: 8.5, letterSpacing: "0.16em", color: "#8C91A5" }}>{token.territoryShort}</div>
            </div>))}
        </div>
      </div>
      <div style={{ marginTop: 16, padding: "16px 18px", background: "#FAFAFA", border: "1px solid #ECE7DA" }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>SAME-SCREEN · ALL TEN · TWO DISTINCT FAMILIES</div>
        <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          {subj.map(([k]) => <SubjectR10 key={k} subject={k} dense/>)}
          <span style={{ width: 1, height: 22, background: "#0C1020" }}/>
          {kids.map(({ id, kid }) => <ChildR10 key={id} kid={kid} palette={palette} size={20}/>)}
        </div>
      </div>
    </div>
  );
}

function FrameCardR10() {
  return (
    <div style={{ width: 700, height: 600, background: "var(--chalk)", padding: "32px 38px", boxSizing: "border-box", fontFamily: "Plus Jakarta Sans", color: "var(--ink)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#8C91A5" }}>ROUND TEN · CALIBRATION LOCK</div>
        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#3CA85A" }}>✓ DIRECTION LOCKED</div>
      </div>
      <h2 style={{ margin: "12px 0 0", fontFamily: "Fraunces", fontWeight: 600, fontSize: 32, lineHeight: 1.05, letterSpacing: "-0.018em" }}>Aubergine · Plum · Stone · Oat.</h2>
      <p style={{ marginTop: 10, fontSize: 13, color: "var(--mid)", lineHeight: 1.55, letterSpacing: "-0.003em", textWrap: "pretty" }}>
        Direction locked. Names locked. Two slots calibrated: Plum pulled from Mulberry's red-leaning hue toward true plum; Oat pulled from Greige's near-neutral toward chromatic warm grain.
      </p>
      <div style={{ marginTop: 16, padding: "14px 16px", background: "#FAFAFA", border: "1px solid #ECE7DA" }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>THE FOUR HEX VALUES</div>
        <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "auto 110px 90px 90px 1fr", rowGap: 8, columnGap: 12, alignItems: "center" }}>
          {[["#3A2A38", "AUBERGINE", "Leo",   "LOCKED",     "Holds — brown-shifted purple, far from Amethyst."],
            ["#5E2E48", "PLUM",      "Max",   "CALIBRATED", "Hue 350° → 315°. Clearly purple, not red."],
            ["#A89888", "STONE",     "Jack",  "LOCKED",     "Holds — warm greige, neutral connector."],
            ["#CDB68C", "OAT",       "Jane",  "CALIBRATED", "C 0.03 → 0.075. Chromatic grain, not surface."]].map(([hex, name, owner, status, note]) => (
            <React.Fragment key={hex}>
              <span style={{ width: 28, height: 28, borderRadius: 5, background: hex }}/>
              <span className="mono" style={{ fontSize: 10, letterSpacing: "0.20em", color: "var(--ink)" }}>{name}</span>
              <span style={{ fontFamily: "Fraunces", fontStyle: "italic", fontSize: 14, color: "var(--mid)" }}>{owner}</span>
              <span className="mono" style={{ fontSize: 8.5, letterSpacing: "0.20em", color: status === "CALIBRATED" ? "#3CA85A" : "#8C91A5" }}>{status === "CALIBRATED" ? "✓ " : ""}{status}</span>
              <span style={{ fontSize: 11, color: "var(--ink)", letterSpacing: "-0.003em" }}>{note}</span>
            </React.Fragment>))}
        </div>
      </div>
      <div style={{ marginTop: 14, padding: "12px 14px", background: "var(--paper)", border: "1px solid #ECE7DA" }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>SEMANTIC</div>
        <p style={{ margin: "6px 0 0", fontSize: 12, color: "var(--ink)", lineHeight: 1.5, letterSpacing: "-0.003em" }}>
          <em style={{ fontFamily: "Fraunces", fontWeight: 500 }}>Considered beauty.</em> The kitchen garden, the dye-vat, the linen cupboard. A quiet adult palette that the brand can stand behind. Inclusion preserved as quiet undertone — multiracial families read the deep-to-light range without it being the foreground claim.
        </p>
      </div>
    </div>
  );
}

Object.assign(window, { TodayViewR10, BlockSheetR10, RecapBadgeR10, PaletteCardR10, CalibrationNoteR10, CollisionAuditR10, TenColorLandscapeR10, FrameCardR10 });
