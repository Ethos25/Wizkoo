/* global React, ReactDOM, DesignCanvas, DCSection, DCArtboard,
   DirectionKR_Mockup, DirectionKR_Print, DirectionKR_Note,
   DirectionDK_Mockup, DirectionDK_Print, DirectionDK_Note,
   DirectionBR_Mockup, DirectionBR_Print, DirectionBR_Note,
   DirectionJP_Mockup, DirectionJP_Print, DirectionJP_Note,
   FAMILY, MarkJP, ChildKR, ChildDK, ChildBR, ChildJP, TONE, HUE */

// =============================================================
// PER-CHILD VISUAL IDENTITY — four divergent directions
// One artboard row per direction:
//   [ Phone mockup ]  [ Print Block Sheet excerpt ]  [ Persona note ]
// Plus an overview row at the top: brief recap, name palette
// comparison strip, and a key shared moment (Recap badges).
// =============================================================

function App() {
  return (
    <DesignCanvas>

      <DCSection id="overview" title="Overview" subtitle="Same family, four design instincts. Read across each row.">
        <DCArtboard id="brief-recap" label="Brief recap" width={620} height={520}>
          <BriefRecap/>
        </DCArtboard>
        <DCArtboard id="palette-strip" label="Name treatment, side by side" width={620} height={520}>
          <PaletteStrip/>
        </DCArtboard>
        <DCArtboard id="recap-badges" label="Same family on the Recap surface" width={620} height={520}>
          <RecapStrip/>
        </DCArtboard>
      </DCSection>

      <DCSection id="kr" title="01 · Korean" subtitle="The Italic, Resolved. — typographic single gesture, no second axis">
        <DCArtboard id="kr-cluster" label="Expanded cluster · phone" width={420} height={780}>
          <DirectionKR_Mockup/>
        </DCArtboard>
        <DCArtboard id="kr-print" label="Block Sheet · per-child notes" width={520} height={520}>
          <DirectionKR_Print/>
        </DCArtboard>
        <DCArtboard id="kr-note" label="Rationale" width={580} height={780}>
          <DirectionKR_Note/>
        </DCArtboard>
      </DCSection>

      <DCSection id="dk" title="02 · Danish" subtitle="The Tonal Quartet. — subtraction, four committed values of existing ink">
        <DCArtboard id="dk-cluster" label="Expanded cluster · phone" width={420} height={780}>
          <DirectionDK_Mockup/>
        </DCArtboard>
        <DCArtboard id="dk-print" label="Block Sheet · per-child notes" width={520} height={520}>
          <DirectionDK_Print/>
        </DCArtboard>
        <DCArtboard id="dk-note" label="Rationale" width={580} height={780}>
          <DirectionDK_Note/>
        </DCArtboard>
      </DCSection>

      <DCSection id="br" title="03 · Brazilian" subtitle="The Signature Mark. — a 3px tertiary-warm mark, the binding signature of a hand-bound book">
        <DCArtboard id="br-cluster" label="Expanded cluster · phone" width={420} height={780}>
          <DirectionBR_Mockup/>
        </DCArtboard>
        <DCArtboard id="br-print" label="Block Sheet · per-child notes" width={520} height={520}>
          <DirectionBR_Print/>
        </DCArtboard>
        <DCArtboard id="br-note" label="Rationale" width={580} height={780}>
          <DirectionBR_Note/>
        </DCArtboard>
      </DCSection>

      <DCSection id="jp" title="04 · Japanese" subtitle="The Mark and the Space. — each child rendered as object, not letter">
        <DCArtboard id="jp-cluster" label="Expanded cluster · phone" width={420} height={780}>
          <DirectionJP_Mockup/>
        </DCArtboard>
        <DCArtboard id="jp-print" label="Block Sheet · per-child notes" width={520} height={520}>
          <DirectionJP_Print/>
        </DCArtboard>
        <DCArtboard id="jp-note" label="Rationale" width={580} height={780}>
          <DirectionJP_Note/>
        </DCArtboard>
      </DCSection>

    </DesignCanvas>
  );
}

// ---------- Brief recap card ----------
function BriefRecap() {
  return (
    <div style={{
      width: 620, height: 520, background: "#F8F4E9",
      padding: "32px 36px", boxSizing: "border-box",
      fontFamily: "Plus Jakarta Sans", color: "var(--ink)",
    }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#8C91A5", textTransform: "uppercase" }}>
        BRIEF · PER-CHILD IDENTITY
      </div>
      <h2 style={{
        margin: "10px 0 0",
        fontFamily: "Fraunces", fontWeight: 600, fontSize: 32, lineHeight: 1.05, letterSpacing: "-0.018em",
      }}>
        Distinguish four children<br/>
        <em style={{ fontWeight: 500 }}>at glance speed,</em> across digital and print.
      </h2>
      <p style={{
        marginTop: 18, fontSize: 13.5, lineHeight: 1.55, color: "var(--mid)", letterSpacing: "-0.003em",
        textWrap: "pretty",
      }}>
        Italic-only is the floor — disciplined, but probably failing the J/J case at glance. The four directions below
        treat per-child as fully open. Each is a divergent solve, not a variant. The deliverable is the option space.
      </p>

      <div style={{ marginTop: 22, borderTop: "1px solid #E0DED6" }}>
        {[
          ["KR · Korean",   "One typographic gesture · italic + ‹age› tag"],
          ["DK · Danish",   "Subtraction · four values of existing ink"],
          ["BR · Brazilian","Tertiary-warm signature mark · 3px"],
          ["JP · Japanese", "Mark as object · ● ▬ ◆ ○"],
        ].map(([k, v]) => (
          <div key={k} style={{
            padding: "11px 0", borderBottom: "1px solid #ECE7DA",
            display: "grid", gridTemplateColumns: "128px 1fr", gap: 14, alignItems: "baseline",
          }}>
            <span className="mono" style={{ fontSize: 10, letterSpacing: "0.20em", color: "var(--ink)", textTransform: "uppercase" }}>
              {k}
            </span>
            <span style={{ fontSize: 13, color: "var(--ink)", letterSpacing: "-0.003em" }}>{v}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 22 }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#8C91A5", textTransform: "uppercase" }}>
          THE FAMILY
        </div>
        <div style={{ marginTop: 8, display: "flex", gap: 18, fontSize: 13, color: "var(--ink)" }}>
          <span><em style={{ fontFamily: "Fraunces", fontStyle: "italic" }}>Max</em> · 10</span>
          <span><em style={{ fontFamily: "Fraunces", fontStyle: "italic" }}>Leo</em> · 8</span>
          <span><em style={{ fontFamily: "Fraunces", fontStyle: "italic" }}>Jack</em> · 6</span>
          <span><em style={{ fontFamily: "Fraunces", fontStyle: "italic" }}>Jane</em> · 5</span>
        </div>
      </div>
    </div>
  );
}

// ---------- Palette comparison strip — name as it renders in each direction ----------
function PaletteStrip() {
  const rows = [
    { label: "01 · KR · italic + ‹age› tag", render: (k) => <ChildKR kid={k}/> },
    { label: "02 · DK · tonal quartet",      render: (k) => <ChildDK kid={k}/> },
    { label: "03 · BR · signature mark",     render: (k) => <ChildBR kid={k}/> },
    { label: "04 · JP · object mark",        render: (k) => <ChildJP kid={k}/> },
  ];
  return (
    <div style={{
      width: 620, height: 520, background: "#FAFAFA",
      padding: "32px 36px", boxSizing: "border-box",
      fontFamily: "Plus Jakarta Sans", color: "var(--ink)",
    }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#8C91A5", textTransform: "uppercase" }}>
        ROSTER · COMPARED
      </div>
      <h2 style={{
        margin: "8px 0 0",
        fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 500, fontSize: 28, letterSpacing: "-0.018em",
      }}>
        the same four names, four ways
      </h2>

      <div style={{ marginTop: 22, borderTop: "1px solid #E0DED6" }}>
        {rows.map((r, i) => (
          <div key={i} style={{
            padding: "20px 0",
            borderBottom: i === rows.length - 1 ? "none" : "1px solid #ECE7DA",
          }}>
            <div className="mono" style={{ fontSize: 9, letterSpacing: "0.20em", color: "#8C91A5", textTransform: "uppercase" }}>
              {r.label}
            </div>
            <div style={{ marginTop: 10, display: "flex", gap: 22, alignItems: "center", flexWrap: "wrap" }}>
              {FAMILY.map(k => (
                <span key={k.id}>{r.render(k)}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Recap badges strip — same surface, four treatments ----------
function RecapStrip() {
  const shifts = [
    { kid: "max",  shift: "from naming to classifying",  concept: "bridge typology" },
    { kid: "leo",  shift: "from comparing to predicting", concept: "load distribution" },
    { kid: "jack", shift: "from watching to building",    concept: "supports & spans" },
    { kid: "jane", shift: "from labeling to defining",    concept: "structural vocabulary" },
  ];
  const treatments = [
    { label: "KR", render: (k) => <ChildKR kid={k}/> },
    { label: "DK", render: (k) => <ChildDK kid={k}/> },
    { label: "BR", render: (k) => <ChildBR kid={k}/> },
    { label: "JP", render: (k) => <ChildJP kid={k}/> },
  ];

  return (
    <div style={{
      width: 620, height: 520, background: "#F8F4E9",
      padding: "32px 36px", boxSizing: "border-box",
      fontFamily: "Plus Jakarta Sans", color: "var(--ink)",
    }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#8C91A5", textTransform: "uppercase" }}>
        RECAP · MASTERY SHIFTS · WEEK 16
      </div>
      <h2 style={{
        margin: "8px 0 0",
        fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 500, fontSize: 24, letterSpacing: "-0.015em",
      }}>
        couch read, Friday 6pm
      </h2>

      <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {treatments.map((t, ti) => (
          <div key={t.label} style={{
            padding: "14px 14px",
            background: "#FAFAFA",
            border: "1px solid #ECE7DA",
          }}>
            <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5", textTransform: "uppercase" }}>
              {t.label}
            </div>
            <div style={{ marginTop: 10, display: "grid", rowGap: 8 }}>
              {shifts.map(s => {
                const k = FAMILY.find(f => f.id === s.kid);
                return (
                  <div key={s.kid} style={{ fontSize: 11.5, color: "var(--mid)", lineHeight: 1.4 }}>
                    {t.render(k)}{" "}
                    <span style={{ color: "var(--mid)" }}>{s.shift}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
