/* global React, KIDS, RECAP, PALETTES_R12, SUBJECTS_R12, FormB, ChipB, SubjectUnderline */

function PaletteHero({ palette }) {
  return (
    <div style={{ width: 760, height: 580, background: "var(--chalk)", padding: "32px 38px", boxSizing: "border-box", fontFamily: "Plus Jakarta Sans", color: "var(--ink)" }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#8C91A5" }}>{palette.badge}</div>
      <h2 style={{ margin: "10px 0 0", fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 500, fontSize: 36, letterSpacing: "-0.018em" }}>{palette.title}</h2>
      <p style={{ marginTop: 6, fontSize: 13, color: "var(--mid)", lineHeight: 1.55, letterSpacing: "-0.003em" }}>{palette.tagline}</p>
      <div className="mono" style={{ marginTop: 8, fontSize: 9, letterSpacing: "0.20em", color: "#3CA85A" }}>{palette.semantic}</div>
      <div style={{ marginTop: 22, padding: "26px 28px", background: "#FAFAFA", border: "1px solid #ECE7DA" }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>FOUR CHILDREN · DISPLAY SCALE</div>
        <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, alignItems: "baseline" }}>
          {KIDS.map(k => <FormB key={k.id} kid={k} palette={palette} scale={1.5}/>)}
        </div>
      </div>
      <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
        {KIDS.map(k => { const c = palette.family[k.id]; return (
          <div key={k.id} style={{ padding: "10px 12px", background: "var(--paper)", border: "1px solid #ECE7DA" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 18, height: 18, borderRadius: 4, background: c.fill }}/>
              <span style={{ fontFamily: "Fraunces", fontStyle: "italic", fontSize: 14, fontWeight: 500 }}>{c.name}</span>
            </div>
            <div className="mono" style={{ marginTop: 4, fontSize: 8.5, letterSpacing: "0.10em", color: "var(--faint)", textTransform: "none" }}>{c.fill}</div>
          </div>); })}
      </div>
      <div style={{ marginTop: 12, padding: "10px 14px", background: "var(--paper)", border: "1px solid #ECE7DA" }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>20px CHIPS · vs ALL 8 SUBJECTS</div>
        <div style={{ marginTop: 8, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          {KIDS.map(k => <ChipB key={k.id} kid={k} palette={palette}/>)}
          <span style={{ width: 1, height: 16, background: "#E0DED6", margin: "0 6px" }}/>
          {Object.keys(SUBJECTS_R12).map(s => <SubjectUnderline key={s} subject={s} dense/>)}
        </div>
      </div>
    </div>
  );
}

function PaletteRationale({ palette }) {
  return (
    <div style={{ width: 580, height: 540, background: "var(--paper)", padding: "30px 36px", boxSizing: "border-box", fontFamily: "Plus Jakarta Sans", color: "var(--ink)", border: "1px solid #ECE7DA" }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#8C91A5" }}>{palette.badge} · RATIONALE</div>
      <h3 style={{ margin: "8px 0 0", fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 500, fontSize: 22, letterSpacing: "-0.018em", lineHeight: 1.2 }}>{palette.title}</h3>
      <p style={{ marginTop: 14, fontSize: 12, color: "var(--ink)", lineHeight: 1.6, letterSpacing: "-0.003em", textWrap: "pretty" }}>{palette.rationale}</p>
      <div style={{ marginTop: 14, padding: "10px 14px", background: "var(--chalk)", border: "1px solid #ECE7DA" }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#C83030" }}>RISK</div>
        <p style={{ marginTop: 6, fontSize: 11.5, color: "var(--mid)", lineHeight: 1.5 }}>{palette.risk}</p>
      </div>
      <div style={{ marginTop: 14 }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>PER-COLOR NOTE</div>
        <div style={{ marginTop: 8 }}>
          {KIDS.map(k => { const c = palette.family[k.id]; return (
            <div key={k.id} style={{ padding: "8px 0", borderTop: "1px solid #ECE7DA", display: "grid", gridTemplateColumns: "auto 90px 1fr", columnGap: 10, alignItems: "baseline" }}>
              <span style={{ width: 14, height: 14, borderRadius: 3, background: c.fill }}/>
              <span style={{ fontFamily: "Fraunces", fontStyle: "italic", fontSize: 13 }}>{c.name}</span>
              <span style={{ fontSize: 10.5, color: "var(--mid)", lineHeight: 1.45 }}>{c.note}</span>
            </div>);
          })}
        </div>
      </div>
    </div>
  );
}

function RecapBadge({ palette }) {
  return (
    <div style={{ width: 460, height: 480, background: "#FAFAFA", padding: "26px 30px", boxSizing: "border-box", fontFamily: "Plus Jakarta Sans", color: "var(--ink)" }}>
      <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>RECAP · MASTERY SHIFTS · WK 16 — {palette.title.toUpperCase()}</div>
      <hr style={{ marginTop: 10, border: "none", borderTop: "1px solid #0C1020" }}/>
      <div style={{ marginTop: 10 }}>
        {RECAP.map(r => { const k = KIDS.find(x => x.id === r.id);
          return (<div key={r.id} style={{ display: "grid", gridTemplateColumns: "140px 1fr", columnGap: 14, alignItems: "center", padding: "12px 0", borderBottom: "1px solid #ECE7DA" }}>
            <FormB kid={k} palette={palette} scale={1.05}/>
            <span style={{ fontSize: 12, color: "var(--mid)", lineHeight: 1.4 }}>{r.shift}</span>
          </div>);
        })}
      </div>
    </div>
  );
}

function ComparisonRow() {
  return (
    <div style={{ width: 1240, height: 280, background: "var(--chalk)", padding: "26px 32px", boxSizing: "border-box", fontFamily: "Plus Jakarta Sans", color: "var(--ink)" }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#8C91A5" }}>FIVE PALETTES · ONE SCREEN · GLANCE TEST</div>
      <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14 }}>
        {PALETTES_R12.map(p => (
          <div key={p.id} style={{ padding: "14px 14px 16px", background: "#FAFAFA", border: "1px solid #ECE7DA" }}>
            <div className="mono" style={{ fontSize: 8.5, letterSpacing: "0.20em", color: "#8C91A5" }}>{p.badge}</div>
            <div style={{ marginTop: 4, fontFamily: "Fraunces", fontStyle: "italic", fontSize: 16, fontWeight: 500, letterSpacing: "-0.018em" }}>{p.title}</div>
            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              {KIDS.map(k => { const c = p.family[k.id]; return <span key={k.id} style={{ width: 32, height: 32, borderRadius: 6, background: c.fill }}/>; })}
            </div>
            <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center" }}>
              {KIDS.map(k => <ChipB key={k.id} kid={k} palette={p}/>)}
            </div>
            <div className="mono" style={{ marginTop: 10, fontSize: 8, letterSpacing: "0.16em", color: "var(--faint)", textTransform: "none" }}>
              {Object.values(p.family).map(c => c.name).join(" · ")}
            </div>
          </div>))}
      </div>
    </div>
  );
}

function FrameCard() {
  return (
    <div style={{ width: 760, height: 540, background: "var(--chalk)", padding: "32px 38px", boxSizing: "border-box", fontFamily: "Plus Jakarta Sans", color: "var(--ink)" }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#8C91A5" }}>ROUND TWELVE · FIVE PALETTES · ONE SHIPS</div>
      <h2 style={{ margin: "10px 0 0", fontFamily: "Fraunces", fontWeight: 600, fontSize: 32, lineHeight: 1.05, letterSpacing: "-0.018em" }}>Three suggested. Two carte blanche.</h2>
      <p style={{ marginTop: 12, fontSize: 13, color: "var(--mid)", lineHeight: 1.55, textWrap: "pretty" }}>
        Five fully calibrated palettes, each four colors holding against the eight-subject landscape, gender-neutral, no internal pairing, equity at 20px. Three follow the briefed directions. Two are mine — what *elite* looks like when the only constraint is design quality at the highest standard.
      </p>
      <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
        {PALETTES_R12.map(p => (
          <div key={p.id} style={{ padding: "12px 12px", background: "#FAFAFA", border: "1px solid #ECE7DA" }}>
            <div className="mono" style={{ fontSize: 8.5, letterSpacing: "0.18em", color: "#8C91A5" }}>{p.badge}</div>
            <div style={{ marginTop: 4, fontFamily: "Fraunces", fontStyle: "italic", fontSize: 15, fontWeight: 500 }}>{p.title}</div>
            <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 4 }}>
              {KIDS.map(k => { const c = p.family[k.id]; return <span key={k.id} style={{ height: 22, borderRadius: 3, background: c.fill }}/>; })}
            </div>
          </div>))}
      </div>
      <div style={{ marginTop: 14, padding: "12px 14px", background: "var(--paper)", border: "1px solid #ECE7DA" }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5" }}>MY VOTE</div>
        <p style={{ margin: "6px 0 0", fontSize: 12, color: "var(--ink)", lineHeight: 1.55 }}>
          <strong>The Dye Studio</strong> (Carte Blanche I) — Madder · Woad · Walnut · Weld. Named for professions, accurate to historical chemistry, inclusive across cultures (every culture had indigo, every culture had madder), widest hue range that still reads as one workshop. Form B's Fraunces colored initial set in <em>Madder</em> at L 35 — that is the answer to <em>elite</em> at this altitude.
        </p>
      </div>
    </div>
  );
}

Object.assign(window, { PaletteHero, PaletteRationale, RecapBadge, ComparisonRow, FrameCard });
