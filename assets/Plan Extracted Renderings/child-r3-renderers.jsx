/* global React, FAMILY, ExpandedClusterRow, DirectionFrame, PRINT_DEMO, PrintCard, PrintHeader, NoteCard,
   D1, D2, D3, ChildD1, SubjectD1, ChildD2, SubjectD2, SubjectMark, ChildD3, SubjectD3, SUBJ_COLORS, SUBJ_ABBR, Sep, Caret */

// =============================================================
// ROUND THREE — Per-direction renderers
//
// Each direction needs to override BOTH child treatment AND subject
// treatment in the cluster row, because the brief is about the full
// nine-color landscape, not the four child marks alone. To do that
// without forking child-shared.jsx I render a custom expanded-cluster
// row inline per direction.
// =============================================================

// ===== Subject color tokens for each direction's "Bridge Architecture
// Lab" sibling row at the top of the phone frame (so all five subjects
// appear in context).

const SIBLING_DEMO = [
  { time: 40, name: "Bridge Architecture Lab",  subject: "math", modifier: "2 × 20-min · together",  pos: "01" },
  { time: 20, name: "Reading the Builders",      subject: "la",   modifier: "1 × 20-min · together",  pos: "02" },
];

const TRAILING_DEMO = [
  { time: 20, name: "Bridges Around the World",  subject: "gh",   modifier: "1 × 20-min · together",  pos: "04" },
  { time: 40, name: "Build Your Bridge",          subject: "ca",   modifier: "2 × 20-min · parallel",  pos: "05" },
];

// =============================================================
// Generic frame builder that lets each direction pass its own
// SubjectComponent + ChildComponent. We rebuild the cluster column
// rather than reusing the shared one, because subject form differs.
// =============================================================

function PhoneFrame({ direction, dark = false }) {
  const surface = "var(--chalk)";
  return (
    <div style={{
      width: 410,
      background: surface,
      borderRadius: 28,
      overflow: "hidden",
      boxShadow: "0 1px 0 rgba(0,0,0,0.06), 0 18px 40px -20px rgba(0,0,0,0.45)",
      fontFamily: "Plus Jakarta Sans",
    }}>
      <PhoneBandLocal/>
      <ThemeHeaderLocal/>
      <SiblingRowsLocal direction={direction} rows={SIBLING_DEMO}/>
      <ExpandedSplitCluster direction={direction}/>
      <SiblingRowsLocal direction={direction} rows={TRAILING_DEMO} hideTopRule/>
    </div>
  );
}

function PhoneBandLocal() {
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

function ThemeHeaderLocal() {
  return (
    <div style={{ padding: "20px 22px 0" }}>
      <div className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>THEME</div>
      <div className="serif" style={{ marginTop: 6, fontFamily: "Fraunces", fontWeight: 600, fontSize: 28, lineHeight: 1.05, letterSpacing: "-0.018em" }}>
        Bridges <em style={{ fontWeight: 500 }}>and</em> Engineering
      </div>
      <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10 }}>
        <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>9 BLOCKS</span>
        <Sep/>
        <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>3 HRS</span>
        <Sep/>
        <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>5 SUBJECTS</span>
        <span style={{ flex: 1 }}/>
        <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>5 CLUSTERS</span>
      </div>
    </div>
  );
}

function SiblingRowsLocal({ direction, rows, hideTopRule }) {
  return (
    <div style={{ marginTop: 18, padding: "0 22px" }}>
      {!hideTopRule && <div style={{ borderTop: "1px solid #ECE7DA" }}/>}
      {rows.map((r, i) => (
        <div key={i} style={{
          padding: "20px 0", borderBottom: "1px solid #ECE7DA",
          display: "grid", gridTemplateColumns: "36px 1fr auto",
          gap: 12, alignItems: "baseline",
        }}>
          <span className="mono" style={{ fontSize: 10, color: "var(--ink)", letterSpacing: "0.18em", alignSelf: "center" }}>{r.time}M</span>
          <div>
            <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 500, fontSize: 16, letterSpacing: "-0.008em", lineHeight: 1.25 }}>{r.name}</div>
            <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 9 }}>
              <direction.SubjectComponent subject={r.subject}/>
              <Sep/>
              <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>{r.modifier}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center", alignSelf: "center" }}>
            <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>{r.pos}</span>
            <Caret/>
          </div>
        </div>
      ))}
    </div>
  );
}

function ExpandedSplitCluster({ direction }) {
  return (
    <div style={{ padding: "20px 0 22px" }}>
      <div style={{ padding: "0 22px", display: "grid", gridTemplateColumns: "36px 1fr auto", gap: 12, alignItems: "baseline" }}>
        <span className="mono" style={{ fontSize: 10, color: "var(--ink)", letterSpacing: "0.18em", alignSelf: "center" }}>60M</span>
        <div>
          <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 500, fontSize: 16, letterSpacing: "-0.008em" }}>Engineering Problem Solving</div>
          <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 9 }}>
            <direction.SubjectComponent subject="sci"/>
            <Sep/>
            <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>3 × 20-min · split</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center", alignSelf: "center" }}>
          <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>03</span>
          <Caret open/>
        </div>
      </div>

      {/* Group 1 — Leo + Max */}
      <GroupBlock direction={direction} label="GROUP 1" kidIds={["leo","max"]} blocks={[
        { time: 20, name: "Bridge Load Testing Documentation Lab" },
        { time: 20, name: "Bridge Construction Supply Problems" },
      ]}/>
      {/* Group 2 — Jack + Jane */}
      <GroupBlock direction={direction} label="GROUP 2" kidIds={["jack","jane"]} blocks={[
        { time: 20, name: "Pressure-Resistant Habitat Design Challenge" },
      ]}/>
      <div style={{ borderBottom: "1px solid #ECE7DA", marginTop: 22 }}/>
    </div>
  );
}

function GroupBlock({ direction, label, kidIds, blocks }) {
  return (
    <div style={{ marginTop: 22, padding: "0 22px 0 58px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: 12, marginBottom: 10 }}>
        <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.22em" }}>{label}</span>
        <div style={{ display: "flex", gap: 10 }}>
          {kidIds.map(id => {
            const k = FAMILY.find(f => f.id === id);
            return <direction.ChildComponent key={id} kid={k}/>;
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
// PRINT TRANSLATION — generic, per-child line uses the direction's
// ChildComponent at print scale.
// =============================================================

function PrintExcerpt({ ChildComponent }) {
  const step = PRINT_DEMO.step;
  return (
    <PrintCard>
      <PrintHeader/>
      <h3 style={{ margin: "20px 0 10px", fontFamily: "Plus Jakarta Sans", fontWeight: 500, fontSize: 14 }}>{step.title}</h3>
      <p style={{ margin: 0, fontFamily: "Plus Jakarta Sans", fontSize: 11.5, lineHeight: 1.5, letterSpacing: "-0.003em" }}>
        Hold up two wooden blocks with a flat block laid across the gap. Ask: "What do we call this shape?"
      </p>
      <div style={{ marginTop: 14, display: "grid", rowGap: 8 }}>
        {step.perChild.map((p, i) => {
          const k = FAMILY.find(f => f.id === p.kid);
          return (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "92px 1fr", columnGap: 12, alignItems: "center" }}>
              <ChildComponent kid={k} size={17}/>
              <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 11, color: "var(--mid)", lineHeight: 1.4 }}>{p.note}</span>
            </div>
          );
        })}
      </div>
    </PrintCard>
  );
}

// =============================================================
// PALETTE CARDS — show the full nine-color landscape on Warm Chalk
// =============================================================

function PaletteCard({ direction, title, kicker }) {
  const sub = direction.subjectsForGrid;  // [{ name, hex, abbr, mark? }]
  const kids = direction.childrenForGrid; // [{ name, fill, kidName }]
  return (
    <div style={{
      width: 620, height: 560, background: "var(--chalk)",
      padding: "30px 36px", boxSizing: "border-box",
      fontFamily: "Plus Jakarta Sans", color: "var(--ink)",
    }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#8C91A5", textTransform: "uppercase" }}>
        {kicker}
      </div>
      <h2 style={{ margin: "8px 0 0", fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 500, fontSize: 28, letterSpacing: "-0.018em" }}>
        {title}
      </h2>

      {/* Subjects row */}
      <div style={{ marginTop: 22 }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>
          FIVE SUBJECTS
        </div>
        <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
          {sub.map(s => (
            <div key={s.abbr} style={{ background: "#FAFAFA", padding: "12px 12px 14px", border: "1px solid #ECE7DA" }}>
              <div style={{ height: 36, display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
                {s.swatch}
              </div>
              <div className="mono" style={{ marginTop: 8, fontSize: 9, letterSpacing: "0.18em", color: "var(--ink)" }}>{s.abbr}</div>
              <div className="mono" style={{ marginTop: 2, fontSize: 8.5, letterSpacing: "0.10em", color: "var(--faint)", textTransform: "none" }}>{s.hex}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Children row */}
      <div style={{ marginTop: 18 }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>
          FOUR CHILDREN
        </div>
        <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          {kids.map(k => (
            <div key={k.kidName} style={{ background: "#FAFAFA", padding: "12px 12px 14px", border: "1px solid #ECE7DA" }}>
              <div style={{ height: 36, display: "flex", alignItems: "center" }}>
                {k.swatch}
              </div>
              <div className="mono" style={{ marginTop: 8, fontSize: 9, letterSpacing: "0.18em", color: "var(--ink)" }}>
                {k.kidName} · {k.name}
              </div>
              <div className="mono" style={{ marginTop: 2, fontSize: 8.5, letterSpacing: "0.10em", color: "var(--faint)", textTransform: "none" }}>{k.fill}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Discrimination strip — subjects + children side by side at scale */}
      <div style={{ marginTop: 18, padding: "14px 16px", background: "var(--paper)", border: "1px solid #ECE7DA" }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>SAME-SCREEN DISCRIMINATION TEST</div>
        <div style={{ marginTop: 10, display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
          {direction.discriminationStrip}
        </div>
      </div>
    </div>
  );
}

// =============================================================
// RECAP BADGE strips per direction
// =============================================================

function RecapStrip({ ChildComponent }) {
  const RECAP_DEMO = window.RECAP_DEMO;
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
              <ChildComponent kid={k} size={20}/>
              <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 12, color: "var(--mid)", lineHeight: 1.4 }}>{s.shift}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =============================================================
// PALETTE GRID DATA per direction
// =============================================================

function dotSwatch(hex, size = 6) {
  return <span style={{ width: size, height: size, borderRadius: 6, background: hex, display: "inline-block" }}/>;
}
function chipSwatch(hex, letter) {
  return (
    <span style={{
      width: 24, height: 24, borderRadius: 5, background: hex,
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      color: "#FAFAFA", fontFamily: "Plus Jakarta Sans", fontStyle: "italic", fontWeight: 600, fontSize: 14,
    }}>{letter}</span>
  );
}

// ----- Direction 1 — Two Worlds -----
const DIRECTION_1 = {
  ChildComponent: ChildD1,
  SubjectComponent: SubjectD1,
  subjectsForGrid: Object.entries(D1.subjects).map(([k, v]) => ({
    abbr: v.abbr, hex: v.bright, swatch: dotSwatch(v.bright, 6),
  })),
  childrenForGrid: Object.entries(D1.children).map(([id, v]) => ({
    kidName: id.toUpperCase(), name: v.name, fill: v.fill,
    swatch: chipSwatch(v.fill, FAMILY.find(f => f.id === id).initial),
  })),
  discriminationStrip: (
    <>
      <SubjectD1 subject="math"/>
      <SubjectD1 subject="la"/>
      <SubjectD1 subject="sci"/>
      <SubjectD1 subject="gh"/>
      <SubjectD1 subject="ca"/>
      <span style={{ width: 1, height: 22, background: "#E0DED6" }}/>
      {FAMILY.map(k => <ChildD1 key={k.id} kid={k} size={18}/>)}
    </>
  ),
};

// ----- Direction 2 — Mono Subjects -----
const DIRECTION_2 = {
  ChildComponent: ChildD2,
  SubjectComponent: SubjectD2,
  subjectsForGrid: Object.entries(D2.subjects).map(([k, v]) => ({
    abbr: v.abbr, hex: "—", swatch: <SubjectMark kind={v.mark} size={14}/>,
  })),
  childrenForGrid: Object.entries(D2.children).map(([id, v]) => ({
    kidName: id.toUpperCase(), name: v.name, fill: v.fill,
    swatch: chipSwatch(v.fill, FAMILY.find(f => f.id === id).initial),
  })),
  discriminationStrip: (
    <>
      <SubjectD2 subject="math"/>
      <SubjectD2 subject="la"/>
      <SubjectD2 subject="sci"/>
      <SubjectD2 subject="gh"/>
      <SubjectD2 subject="ca"/>
      <span style={{ width: 1, height: 22, background: "#E0DED6" }}/>
      {FAMILY.map(k => <ChildD2 key={k.id} kid={k} size={18}/>)}
    </>
  ),
};

// ----- Direction 3 — The Underline -----
const DIRECTION_3 = {
  ChildComponent: ChildD3,
  SubjectComponent: SubjectD3,
  subjectsForGrid: Object.entries(D3.subjects).map(([k, v]) => ({
    abbr: v.abbr, hex: v.hue,
    swatch: (
      <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "flex-start" }}>
        <span className="mono" style={{ fontSize: 11, color: "var(--ink)", letterSpacing: "0.18em" }}>{v.abbr}</span>
        <span style={{ width: 36, height: 2, background: v.hue, marginTop: 3 }}/>
      </span>
    ),
  })),
  childrenForGrid: Object.entries(D3.children).map(([id, v]) => ({
    kidName: id.toUpperCase(), name: v.name, fill: v.fill,
    swatch: chipSwatch(v.fill, FAMILY.find(f => f.id === id).initial),
  })),
  discriminationStrip: (
    <>
      <SubjectD3 subject="math"/>
      <SubjectD3 subject="la"/>
      <SubjectD3 subject="sci"/>
      <SubjectD3 subject="gh"/>
      <SubjectD3 subject="ca"/>
      <span style={{ width: 1, height: 22, background: "#E0DED6" }}/>
      {FAMILY.map(k => <ChildD3 key={k.id} kid={k} size={18}/>)}
    </>
  ),
};

// =============================================================
// NOTE CONTENT
// =============================================================

function Note1() {
  return (
    <NoteCard
      persona="DIRECTION 01 · TWO WORLDS"
      title="Hue separation, form by scale."
      move={<>Subjects keep the existing dot but at refined hex values; children carry warm low-chroma chips with knockout initials. Two color rings — bright primaries for subjects, warm earth-tones for children — separated by chroma register and by mark size.</>}
      bullets={[
        ["Subject form", "Small 5px round dot beside the mono subject label. Unchanged from the locked grammar — no surface relearning."],
        ["Child form", "18×18 chip with knockout initial. ~13× the area of a subject dot. Sits on the names line, never the metadata line."],
        ["Hue logic", "Subjects ride OKLCH ≈ L 58 / C 0.18 — saturated, primary/secondary hue families. Children ride OKLCH ≈ L 52 / C 0.09 — desaturated earth, terracotta-olive-teal-plum. Subjects ring bright; children ring warm. No two hues sit close in CIE-LAB perceptual space."],
        ["J/J collision", "Resolved by chromatic opposition before letter recognition: Jack-teal + Jane-plum form the family's cool pair. The shared J on each chip never has to disambiguate."],
        ["1, 2, 3, 4 children", "Uniform — every family member always gets a chip. Single-child families get one chip on every screen the chip would appear on; the chip becomes the avatar, not the disambiguator. Parent picks chip color at onboarding from the four-color palette."],
        ["Print", "B&W: chip → ink-fill, knockout initial in chalk. Form survives, color identity is lost — but the chip-rhythm reading down the page rhymes per-child. CMYK preserves all four hues at full fidelity."],
        ["Recap badge", "20px chip integrates as sentence prefix. Subjects on the same screen render as 5px dots at the metadata line — the parent's eye never asks 'is this color a child or subject' because the form-class is too different."],
        ["Where it could fail", "If a subject ever needs to scale to chip-size (a future feature placing subject identity into a card-style bubble), the discrimination collapses. The locked rule must be: subjects never gain area; children never lose it."],
      ]}
    />
  );
}

function Note2() {
  return (
    <NoteCard
      persona="DIRECTION 02 · MONO SUBJECTS"
      title="Subjects shed color. Children own all chroma."
      move={<>Remove subject color entirely. Replace with five ink-only hairline form-marks (◇ ─ △ ○ □) plus the existing mono labels. Children carry the only color in the system: a saturated chip + knockout initial. One color axis. Conflation made architecturally impossible.</>}
      bullets={[
        ["The argument", "Two color axes is a cost. Round two accepted it because we believed children needed color. Round three asks: do subjects need color? Subjects already carry mono labels (MATH, LANG, SCI, GEO, ARTS) — the label is the recognition target. The dot was redundant. The form-mark is just as legible as the dot, costs no color, and adds a second redundant signal at the same price."],
        ["Subject form", "5 ink-only marks at 7–8px hairline (1.2px stroke): bar (LANG), diamond (MATH), triangle (SCI), circle (GEO), square (ARTS). Five geometric primitives, perceptually unambiguous, work on any surface tone, work in print, work for color-blind users."],
        ["Child form", "18×18 chip + knockout initial. With no other color on the screen, the four child-chips can occupy a richer register: vermilion / forest / indigo / amber. Saturated, distinct, OKLCH spread around the wheel."],
        ["J/J collision", "Solved chromatically — Jack indigo, Jane amber. Identical letters, opposite hues. Same rule as before; cleaner because the surrounding screen has no competing color noise."],
        ["1, 2, 3, 4 children", "Uniform; chip is always present. With no subject color the visual budget is freed entirely for the family — single-child case still earns its chip without feeling decorative."],
        ["Print", "Subject form-marks survive perfectly in 1-bit. Children's chips become ink-filled with knockout. The Block Sheet reads as a typographically pure document with chromatic chips as the only color signal — exactly the discipline the brand principle asks for."],
        ["The cost", "Subject identification slows by an estimated 80–120ms because color-as-pre-attentive-cue is gone. The bet: the parent already reads subject by label more than by color, and the freed visual budget pays for child recognition that we measured as harder. Subject is a category of five known-in-advance items; child is identity. Identity gets the color."],
        ["Where it could fail", "Block View (next session) may need subject color for at-a-glance time-allocation summaries. If so, that screen can locally re-introduce subject color in a chart context where children don't appear. Cross-axis screens stay one-axis."],
      ]}
    />
  );
}

function Note3() {
  return (
    <NoteCard
      persona="DIRECTION 03 · THE UNDERLINE"
      title="Subject color migrates beneath its label."
      move={<>Subjects keep their hues but lose the dot. Color becomes a 1.5px underline beneath the mono subject label. Children remain as chip + knockout. The two color forms now occupy architecturally opposite roles: subject is a passive wayfinder under text; child is an active mark beside text.</>}
      bullets={[
        ["Subject form", "Mono label MATH / LANG / SCI / GEO / ARTS with a 1.5px subject-tinted underline. Color delivered as text-decoration, not as a discrete object."],
        ["Child form", "18×18 filled chip + knockout initial. Unchanged from D1/D2 — the recognition unit is settled."],
        ["Why this works", "Form pairing is asymmetric in a useful way. A child mark is a foreground object; a subject mark is a typographic property. They share no shape vocabulary. Even at peripheral vision, parent reads 'underlined word = subject category, colored letter chip = person.' Two different mental categories, two different visual classes."],
        ["Hue logic", "Subjects: bright primary/secondary hues at OKLCH ≈ L 58 (visible against Warm Chalk as a thin line). Children: warm low-chroma earth tones at OKLCH ≈ L 50, terracotta / moss / steel / plum. Children stay warmer than subjects to widen perceptual distance."],
        ["J/J collision", "Same chromatic opposition rule — Jack-steel, Jane-plum. The cool pair vs the warm pair within children; no overlap with subject hue families."],
        ["1, 2, 3, 4 children", "Uniform chip rule. Underline rule unchanged regardless of family size."],
        ["Print", "Underline survives 1-bit print as a 0.5pt rule under the subject label — already a typographic device, not a color one. Child chips translate the same as D1/D2. Print fidelity is high because the color form is already type-bound."],
        ["The trap to watch", "1.5px is a hairline at phone scale. On low-density screens or after many years of OS color-correction drift, the underline could become hard to perceive. Mitigation: subject label is still legible from text alone; underline is a confirming signal, not the load-bearing one. The system degrades gracefully to mono-subject (Direction 02) if the underline ever fails."],
        ["Why this might be the right answer", "It honors both axes without giving them equal weight. Children get the louder color signal (deserved — identity) while subjects get the quieter one (deserved — category). The hierarchy of signal matches the hierarchy of meaning."],
      ]}
    />
  );
}

Object.assign(window, {
  PhoneFrame, PrintExcerpt, PaletteCard, RecapStrip,
  DIRECTION_1, DIRECTION_2, DIRECTION_3,
  Note1, Note2, Note3,
});
