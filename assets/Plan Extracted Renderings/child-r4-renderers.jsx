/* global React, FAMILY, SUBJECTS_R4, SubjectR4, ChildR4, ChildChipR4, PrintCard, PrintHeader, NoteCard, PRINT_DEMO, RECAP_DEMO */

// =============================================================
// ROUND FOUR — Renderers
// One set of components, parameterised by `palette`. The architecture
// is locked, so every screen has the same structure across A/B/C —
// only the children palette changes.
// =============================================================

// ---------- Phone band (chrome shared with prior rounds) ----------
function PhoneBandR4() {
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

function SepR4() { return <span style={{ width: 1, height: 9, background: "#DCD6C5" }}/>; }
function CaretR4({ open }) {
  return (
    <svg width="9" height="9" viewBox="0 0 9 9">
      {open
        ? <path d="M1 3 L4.5 6.5 L8 3" fill="none" stroke="#B7B4A8" strokeWidth="1" strokeLinecap="round"/>
        : <path d="M3 1 L6.5 4.5 L3 8"  fill="none" stroke="#B7B4A8" strokeWidth="1" strokeLinecap="round"/>}
    </svg>
  );
}

// =============================================================
// 1 · TODAY VIEW — expanded cluster, both children-color and
//   subject-color visible on the same screen.
// =============================================================
function TodayView({ palette }) {
  return (
    <div style={{
      width: 410, background: "var(--chalk)", borderRadius: 28, overflow: "hidden",
      boxShadow: "0 1px 0 rgba(0,0,0,0.06), 0 18px 40px -20px rgba(0,0,0,0.45)",
      fontFamily: "Plus Jakarta Sans",
    }}>
      <PhoneBandR4/>

      <div style={{ padding: "20px 22px 0" }}>
        <div className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>THEME</div>
        <div style={{ marginTop: 6, fontFamily: "Fraunces", fontWeight: 600, fontSize: 28, lineHeight: 1.05, letterSpacing: "-0.018em" }}>
          Bridges <em style={{ fontWeight: 500 }}>and</em> Engineering
        </div>
        <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10 }}>
          <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>9 BLOCKS</span>
          <SepR4/>
          <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>3 HRS</span>
          <SepR4/>
          <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>5 SUBJECTS</span>
        </div>
      </div>

      {/* Sibling rows — top */}
      <div style={{ marginTop: 18, padding: "0 22px" }}>
        <div style={{ borderTop: "1px solid #ECE7DA" }}/>
        {[
          { time: 40, name: "Bridge Architecture Lab", subject: "math", modifier: "2 × 20-min · together", pos: "01" },
          { time: 20, name: "Reading the Builders",     subject: "la",   modifier: "1 × 20-min · together", pos: "02" },
        ].map((r, i) => (
          <SiblingRow key={i} row={r}/>
        ))}
      </div>

      {/* Expanded cluster — split groups, both colors present */}
      <ExpandedSplit palette={palette}/>

      {/* Trailing rows */}
      <div style={{ padding: "0 22px" }}>
        {[
          { time: 20, name: "Bridges Around the World", subject: "gh", modifier: "1 × 20-min · together", pos: "04" },
          { time: 40, name: "Build Your Bridge",        subject: "ca", modifier: "2 × 20-min · parallel", pos: "05" },
        ].map((r, i) => <SiblingRow key={i} row={r}/>)}
      </div>
    </div>
  );
}

function SiblingRow({ row }) {
  return (
    <div style={{
      padding: "20px 0", borderBottom: "1px solid #ECE7DA",
      display: "grid", gridTemplateColumns: "36px 1fr auto", gap: 12, alignItems: "baseline",
    }}>
      <span className="mono" style={{ fontSize: 10, color: "var(--ink)", letterSpacing: "0.18em", alignSelf: "center" }}>{row.time}M</span>
      <div>
        <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 500, fontSize: 16, letterSpacing: "-0.008em", lineHeight: 1.25 }}>{row.name}</div>
        <div style={{ marginTop: 6, display: "flex", alignItems: "flex-end", gap: 9 }}>
          <SubjectR4 subject={row.subject}/>
          <SepR4/>
          <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>{row.modifier}</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, alignItems: "center", alignSelf: "center" }}>
        <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>{row.pos}</span>
        <CaretR4/>
      </div>
    </div>
  );
}

function ExpandedSplit({ palette }) {
  return (
    <div style={{ padding: "20px 0 22px" }}>
      <div style={{ padding: "0 22px", display: "grid", gridTemplateColumns: "36px 1fr auto", gap: 12, alignItems: "baseline" }}>
        <span className="mono" style={{ fontSize: 10, color: "var(--ink)", letterSpacing: "0.18em", alignSelf: "center" }}>60M</span>
        <div>
          <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 500, fontSize: 16, letterSpacing: "-0.008em" }}>Engineering Problem Solving</div>
          <div style={{ marginTop: 6, display: "flex", alignItems: "flex-end", gap: 9 }}>
            <SubjectR4 subject="sci"/>
            <SepR4/>
            <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>3 × 20-min · split</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center", alignSelf: "center" }}>
          <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>03</span>
          <CaretR4 open/>
        </div>
      </div>

      <GroupBlock palette={palette} label="GROUP 1" kidIds={["leo","max"]} blocks={[
        { time: 20, name: "Bridge Load Testing Documentation Lab" },
        { time: 20, name: "Bridge Construction Supply Problems" },
      ]}/>
      <GroupBlock palette={palette} label="GROUP 2" kidIds={["jack","jane"]} blocks={[
        { time: 20, name: "Pressure-Resistant Habitat Design Challenge" },
      ]}/>
      <div style={{ borderBottom: "1px solid #ECE7DA", marginTop: 22 }}/>
    </div>
  );
}

function GroupBlock({ palette, label, kidIds, blocks }) {
  return (
    <div style={{ marginTop: 22, padding: "0 22px 0 58px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: 12, marginBottom: 10 }}>
        <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.22em" }}>{label}</span>
        <div style={{ display: "flex", gap: 10 }}>
          {kidIds.map(id => {
            const k = FAMILY.find(f => f.id === id);
            return <ChildR4 key={id} kid={k} palette={palette}/>;
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

// =============================================================
// 2 · BLOCK SHEET — print, paper-tone background, subject underline
//   AND child container both present.
// =============================================================
function BlockSheetR4({ palette }) {
  const step = PRINT_DEMO.step;
  return (
    <PrintCard>
      <PrintHeader/>
      <h3 style={{ margin: "20px 0 4px", fontFamily: "Plus Jakarta Sans", fontWeight: 500, fontSize: 14 }}>{step.title}</h3>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 10 }}>
        <SubjectR4 subject="sci" dense/>
        <SepR4/>
        <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>STEP 01 · 5 MIN</span>
      </div>
      <p style={{ margin: 0, fontFamily: "Plus Jakarta Sans", fontSize: 11.5, lineHeight: 1.5, letterSpacing: "-0.003em" }}>
        Hold up two wooden blocks with a flat block laid across the gap. Ask: "What do we call this shape?"
      </p>
      <div style={{ marginTop: 14, display: "grid", rowGap: 8 }}>
        {step.perChild.map((p, i) => {
          const k = FAMILY.find(f => f.id === p.kid);
          return (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "92px 1fr", columnGap: 12, alignItems: "center" }}>
              <ChildR4 kid={k} palette={palette} size={17}/>
              <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "var(--mid)", lineHeight: 1.4 }}>{p.note}</span>
            </div>
          );
        })}
      </div>
    </PrintCard>
  );
}

// =============================================================
// 3 · RECAP BADGE — smallest scale; the moment that breaks weak palettes.
// =============================================================
function RecapBadgeR4({ palette }) {
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
              <ChildR4 kid={k} palette={palette} size={20} hideName/>
              <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "var(--mid)", lineHeight: 1.4 }}>
                <strong style={{ color: "var(--ink)", fontWeight: 600, fontStyle: "italic", fontFamily: "Plus Jakarta Sans" }}>{k.name}</strong> — {s.shift}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 14, padding: "12px 14px", background: "var(--chalk)" }}>
        <div className="mono" style={{ fontSize: 8.5, letterSpacing: "0.22em", color: "#8C91A5" }}>SMALLEST SCALE · 20px</div>
        <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
          {FAMILY.map(k => <ChildChipR4 key={k.id} kid={k} palette={palette} size={20}/>)}
          <span style={{ width: 1, height: 18, background: "#E0DED6", margin: "0 6px" }}/>
          {Object.keys(SUBJECTS_R4).map(s => <SubjectR4 key={s} subject={s} dense/>)}
        </div>
      </div>
    </div>
  );
}

// =============================================================
// PALETTE CARD — the four colors named, plus hue-territory check.
// =============================================================
function PaletteCardR4({ palette }) {
  const kids = ["leo","max","jack","jane"].map(id => ({
    id, kid: FAMILY.find(f => f.id === id), token: palette.family[id],
  }));
  return (
    <div style={{
      width: 620, height: 560, background: "var(--chalk)",
      padding: "30px 36px", boxSizing: "border-box",
      fontFamily: "Plus Jakarta Sans", color: "var(--ink)",
    }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#8C91A5", textTransform: "uppercase" }}>
        {palette.kicker}
      </div>
      <h2 style={{ margin: "8px 0 0", fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 500, fontSize: 32, letterSpacing: "-0.018em" }}>
        {palette.title}
      </h2>
      <p style={{ marginTop: 4, fontSize: 13, color: "var(--mid)", letterSpacing: "-0.003em" }}>{palette.tagline}</p>

      <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
        {kids.map(({ id, kid, token }) => (
          <div key={id} style={{ background: "#FAFAFA", padding: "14px 12px 14px", border: "1px solid #ECE7DA" }}>
            <div style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
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
            <div className="mono" style={{ marginTop: 1, fontSize: 8.5, letterSpacing: "0.16em", color: "#8C91A5" }}>
              {token.territory.toUpperCase()}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 18, padding: "14px 16px", background: "var(--paper)", border: "1px solid #ECE7DA" }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>HUE TERRITORY CHECK</div>
        <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: "auto 1fr", rowGap: 5, columnGap: 12, alignItems: "baseline" }}>
          {kids.map(({ id, kid, token }) => (
            <React.Fragment key={id}>
              <span className="mono" style={{ fontSize: 8.5, letterSpacing: "0.18em", color: "var(--ink)" }}>{kid.name.toUpperCase()}</span>
              <span style={{ fontSize: 11, color: "var(--mid)", letterSpacing: "-0.003em", lineHeight: 1.4 }}>{token.note}</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 14, padding: "10px 14px", background: "var(--paper)", border: "1px solid #ECE7DA" }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>INTERNAL DIFFERENTIATION · 20px</div>
        <div style={{ marginTop: 8, display: "flex", gap: 10, alignItems: "center" }}>
          {kids.map(({ id, kid }) => <ChildChipR4 key={id} kid={kid} palette={palette} size={20}/>)}
          <span style={{ flex: 1 }}/>
          <span className="mono" style={{ fontSize: 8.5, color: "#8C91A5", letterSpacing: "0.18em" }}>RECAP-BADGE SCALE</span>
        </div>
      </div>
    </div>
  );
}

// =============================================================
// LANDSCAPE — the full nine-color grid, two distinct families.
// =============================================================
function NineColorLandscape({ palette }) {
  const subj = Object.entries(SUBJECTS_R4);
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
        Two distinct families, one considered system.
      </h2>
      <p style={{ marginTop: 4, fontSize: 12.5, color: "var(--mid)", letterSpacing: "-0.003em", maxWidth: 540 }}>
        Five subjects on top — bright, primary, label-bound. Four children below — earthen or jewel-toned, contained, letter-bound. The eye sees two systems.
      </p>

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
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>FOUR CHILDREN · THIS PALETTE</div>
        <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          {kids.map(({ id, kid, token }) => (
            <div key={id} style={{ background: "#FAFAFA", padding: "12px 12px 14px", border: "1px solid #ECE7DA" }}>
              <div style={{ height: 38, display: "flex", alignItems: "center" }}>
                <ChildChipR4 kid={kid} palette={palette} size={28}/>
              </div>
              <div className="mono" style={{ marginTop: 6, fontSize: 8.5, letterSpacing: "0.18em", color: "var(--ink)" }}>{kid.name.toUpperCase()} · {token.name.toUpperCase()}</div>
              <div className="mono" style={{ marginTop: 1, fontSize: 8.5, letterSpacing: "0.10em", color: "var(--faint)", textTransform: "none" }}>{token.fill}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 18, padding: "16px 18px", background: "#FAFAFA", border: "1px solid #ECE7DA" }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>SAME-SCREEN · ALL NINE</div>
        <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          {subj.map(([k]) => <SubjectR4 key={k} subject={k} dense/>)}
          <span style={{ width: 1, height: 22, background: "#0C1020" }}/>
          {kids.map(({ id, kid }) => <ChildR4 key={id} kid={kid} palette={palette} size={20}/>)}
        </div>
      </div>
    </div>
  );
}

// =============================================================
// RATIONALE NOTE — palette-specific argument
// =============================================================
function RationaleNoteR4({ palette }) {
  return (
    <NoteCard
      persona={palette.kicker + " · " + palette.title.toUpperCase()}
      title={palette.tagline}
      move={<>{palette.rationale.move}</>}
      bullets={palette.rationale.bullets}
    />
  );
}

// =============================================================
// FRAME / OVERVIEW CARD
// =============================================================
function FrameCardR4() {
  return (
    <div style={{
      width: 620, height: 560, background: "var(--chalk)",
      padding: "30px 36px", boxSizing: "border-box",
      fontFamily: "Plus Jakarta Sans", color: "var(--ink)",
    }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#8C91A5", textTransform: "uppercase" }}>
        ROUND FOUR · FRAME
      </div>
      <h2 style={{ margin: "10px 0 0", fontFamily: "Fraunces", fontWeight: 600, fontSize: 30, lineHeight: 1.05, letterSpacing: "-0.018em" }}>
        Hue territory the subjects don't touch.
      </h2>
      <p style={{ marginTop: 14, fontSize: 13, lineHeight: 1.55, color: "var(--mid)", letterSpacing: "-0.003em", textWrap: "pretty" }}>
        Architecture is locked: subject = ultramarine ink word with 1.5px colored underline,
        child = filled letter container with white knockout. Round four refines the children
        palette only. Children-color must sit clearly outside every subject hue family.
      </p>

      <div style={{ marginTop: 18, padding: "12px 14px", background: "#FAFAFA", border: "1px solid #ECE7DA" }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>OCCUPIED HUE FAMILIES · SUBJECTS</div>
        <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
          {Object.entries(SUBJECTS_R4).map(([k, v]) => (
            <div key={k} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span className="mono" style={{ fontSize: 9, letterSpacing: "0.18em", color: "var(--ink)" }}>{v.abbr}</span>
              <span style={{ width: "100%", height: 2, background: v.hue }}/>
              <span className="mono" style={{ fontSize: 8.5, letterSpacing: "0.16em", color: "#8C91A5" }}>{v.family.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 14, padding: "12px 14px", background: "#FAFAFA", border: "1px solid #ECE7DA" }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>AVAILABLE TERRITORY · CHILDREN</div>
        <div style={{ marginTop: 8, fontSize: 12, color: "var(--ink)", lineHeight: 1.55, letterSpacing: "-0.003em" }}>
          Reds, burgundies, wines, oxbloods · pinks, rose · browns, cocoa, sand, taupe, camel ·
          cool grays, steel, slate, blue-gray · warm grays, charcoal · desaturated near-blacks.
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#8C91A5", textTransform: "uppercase" }}>THREE PALETTES</div>
        <div style={{ marginTop: 10, borderTop: "1px solid #E0DED6" }}>
          {[
            ["A · WINES & STONES", "Burgundy / Cocoa / Slate / Rose — textile pigments."],
            ["B · EARTH & IRON",   "Oxblood / Camel / Charcoal / Brick — leather and clay."],
            ["C · INK & SAND",     "Wine / Sand / Steel / Onyx — one accent, three neutrals."],
          ].map(([k, v]) => (
            <div key={k} style={{
              padding: "10px 0", borderBottom: "1px solid #ECE7DA",
              display: "grid", gridTemplateColumns: "175px 1fr", gap: 14, alignItems: "baseline",
            }}>
              <span className="mono" style={{ fontSize: 9.5, letterSpacing: "0.18em", color: "var(--ink)" }}>{k}</span>
              <span style={{ fontSize: 12.5, color: "var(--ink)", letterSpacing: "-0.003em" }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =============================================================
// COMPARE STRIP — all three palettes, same row, same screen excerpt
// =============================================================
function CompareStripR4() {
  return (
    <div style={{
      width: 760, height: 560, background: "#FAFAFA",
      padding: "30px 36px", boxSizing: "border-box",
      fontFamily: "Plus Jakarta Sans", color: "var(--ink)",
    }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#8C91A5", textTransform: "uppercase" }}>
        SAME ROW · THREE PALETTES
      </div>
      <h2 style={{ margin: "8px 0 0", fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 500, fontSize: 26, letterSpacing: "-0.018em" }}>
        the screen the parent actually sees
      </h2>
      <p style={{ marginTop: 6, fontSize: 12, color: "var(--mid)", lineHeight: 1.5, letterSpacing: "-0.003em" }}>
        One block, one subject, one group of children — rendered three ways. Each row shows the children-color
        next to the SCI underline so the parent's discrimination test is visible in context.
      </p>

      <div style={{ marginTop: 18, borderTop: "1px solid #E0DED6" }}>
        {[window.PALETTE_A, window.PALETTE_B, window.PALETTE_C].map((p, i) => (
          <div key={p.id} style={{
            padding: "20px 0",
            borderBottom: i === 2 ? "none" : "1px solid #ECE7DA",
          }}>
            <div className="mono" style={{ fontSize: 9, letterSpacing: "0.20em", color: "#8C91A5" }}>
              {p.kicker} · {p.title.toUpperCase()}
            </div>
            <div style={{
              marginTop: 10, padding: "16px 18px", background: "var(--chalk)",
              display: "grid", gridTemplateColumns: "36px 1fr", gap: 12, alignItems: "baseline",
            }}>
              <span className="mono" style={{ fontSize: 10, color: "var(--ink)", letterSpacing: "0.18em", alignSelf: "center" }}>60M</span>
              <div>
                <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 500, fontSize: 16, letterSpacing: "-0.008em" }}>
                  Engineering Problem Solving
                </div>
                <div style={{ marginTop: 6, display: "flex", alignItems: "flex-end", gap: 9 }}>
                  <SubjectR4 subject="sci"/>
                  <SepR4/>
                  <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>3 × 20-min · split</span>
                </div>
                <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                  <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.22em" }}>GROUP 1</span>
                  {["leo","max"].map(id => {
                    const k = FAMILY.find(f => f.id === id);
                    return <ChildR4 key={id} kid={k} palette={p}/>;
                  })}
                  <span style={{ width: 1, height: 14, background: "#E0DED6" }}/>
                  <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.22em" }}>GROUP 2</span>
                  {["jack","jane"].map(id => {
                    const k = FAMILY.find(f => f.id === id);
                    return <ChildR4 key={id} kid={k} palette={p}/>;
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, {
  TodayView, BlockSheetR4, RecapBadgeR4, PaletteCardR4,
  NineColorLandscape, RationaleNoteR4, FrameCardR4, CompareStripR4,
});
