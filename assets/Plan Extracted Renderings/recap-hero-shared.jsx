/* global React */

// =============================================================
// THE RECAP — Hero exploration
// Locked tokens (inherited from The Plan / Light Standard)
// =============================================================

const RECAP_TOKENS = {
  chalk:      "#F8F4E9",   // Warm Chalk surface
  ink:        "#0C1020",   // Ultramarine ink
  saffron:    "#E8AF38",   // Saffron underline (active tab)
  rule:       "#E8E2D4",   // Hairline rule beneath chrome
};

// Photograph placeholder — warm-toned, soft directional sidelight,
// monospace tag describing what the production photo carries.
// We deliberately don't draw illustrative SVGs; the tag and the
// light gradient convey the photographic intent.
function PhotoPlaceholder({ width, height, tag, tone = "afternoon" }) {
  // Warm tonal placeholders that read as "kitchen counter, sidelight"
  // without inventing imagery. Slight grain via repeating gradient.
  const palettes = {
    afternoon: {
      a: "#E8DDC4",  // warm sidelit chalk
      b: "#C9B796",  // mid wood / counter
      c: "#7A6850",  // shadow under hands
      hi: "#F4EAD3", // window highlight
    },
    morning: {
      a: "#E5D9BE",
      b: "#BFA988",
      c: "#6E5B45",
      hi: "#F8EFD8",
    },
    shadow: {
      a: "#D9C9A8",
      b: "#A48C6A",
      c: "#4A3D2D",
      hi: "#EFE2C2",
    },
    collapsed: {
      a: "#DBC9A2",
      b: "#B49874",
      c: "#5C4A36",
      hi: "#EEE0BC",
    },
  };
  const p = palettes[tone] || palettes.afternoon;

  return (
    <div style={{
      width, height, position: "relative", overflow: "hidden",
      background: `
        radial-gradient(ellipse 70% 50% at 18% 8%, ${p.hi} 0%, transparent 55%),
        radial-gradient(ellipse 90% 70% at 30% 30%, ${p.a} 0%, transparent 60%),
        radial-gradient(ellipse 80% 80% at 80% 90%, ${p.c} 0%, transparent 65%),
        linear-gradient(135deg, ${p.a} 0%, ${p.b} 55%, ${p.c} 100%)
      `,
    }}>
      {/* subtle grain via diagonal lines */}
      <div style={{
        position: "absolute", inset: 0,
        background: `repeating-linear-gradient(
          112deg,
          rgba(255,255,255,0.018) 0px,
          rgba(255,255,255,0.018) 1px,
          transparent 1px,
          transparent 4px)`,
        mixBlendMode: "overlay",
      }}/>
      {/* soft window vignette top-left */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(circle at 12% 0%, rgba(255,250,235,0.28), transparent 38%)`,
      }}/>
      {/* deep vignette bottom-right */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(circle at 100% 100%, rgba(20,12,4,0.22), transparent 50%)`,
      }}/>
      {/* monospace tag, lower-left, ink at low opacity */}
      <div style={{
        position: "absolute", left: 10, bottom: 8,
        fontFamily: "Space Mono, monospace",
        fontSize: 7.5, letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "rgba(248,244,233,0.55)",
      }}>{tag}</div>
    </div>
  );
}

// Phone status bar — locked
function StatusBar() {
  return (
    <div style={{
      height: 44,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      paddingLeft: 32, paddingRight: 28,
      fontFamily: "Plus Jakarta Sans", fontWeight: 600, fontSize: 13,
      color: RECAP_TOKENS.ink,
    }}>
      <div>9:47</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {/* signal — three rising bars */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 1.5, height: 10 }}>
          <div style={{ width: 3, height: 4,  background: RECAP_TOKENS.ink, borderRadius: 0.5 }}/>
          <div style={{ width: 3, height: 6,  background: RECAP_TOKENS.ink, borderRadius: 0.5 }}/>
          <div style={{ width: 3, height: 8,  background: RECAP_TOKENS.ink, borderRadius: 0.5 }}/>
          <div style={{ width: 3, height: 10, background: RECAP_TOKENS.ink, borderRadius: 0.5 }}/>
        </div>
        {/* wifi */}
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
          <path d="M1 3.2C2.7 1.7 4.7 0.8 7 0.8C9.3 0.8 11.3 1.7 13 3.2" stroke={RECAP_TOKENS.ink} strokeWidth="1.2" strokeLinecap="round"/>
          <path d="M3 5.4C4.1 4.5 5.5 4 7 4C8.5 4 9.9 4.5 11 5.4" stroke={RECAP_TOKENS.ink} strokeWidth="1.2" strokeLinecap="round"/>
          <circle cx="7" cy="8.4" r="1" fill={RECAP_TOKENS.ink}/>
        </svg>
        {/* battery */}
        <div style={{ position: "relative", width: 22, height: 10 }}>
          <div style={{
            position: "absolute", inset: 0,
            border: `1px solid ${RECAP_TOKENS.ink}`,
            borderRadius: 2.5, opacity: 0.55,
          }}/>
          <div style={{
            position: "absolute", left: 1.5, top: 1.5, bottom: 1.5,
            width: 14, background: RECAP_TOKENS.ink, borderRadius: 1,
          }}/>
          <div style={{
            position: "absolute", right: -2, top: 3, width: 1.5, height: 4,
            background: RECAP_TOKENS.ink, opacity: 0.55,
            borderRadius: "0 1px 1px 0",
          }}/>
        </div>
      </div>
    </div>
  );
}

// Tab strip — THE PLAN · THE RECAP · THE RECORD, RECAP active
function TabStrip() {
  const tabs = [
    { label: "THE PLAN",   active: false },
    { label: "THE RECAP",  active: true  },
    { label: "THE RECORD", active: false },
  ];
  return (
    <div style={{
      paddingTop: 14, paddingBottom: 13,
      borderBottom: `1px solid ${RECAP_TOKENS.rule}`,
      display: "flex", justifyContent: "center",
      gap: 22,
    }}>
      {tabs.map((t) => (
        <div key={t.label} style={{ position: "relative" }}>
          <span style={{
            fontFamily: "Space Mono", fontWeight: 400,
            fontSize: 10, letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: RECAP_TOKENS.ink,
            opacity: t.active ? 1 : 0.4,
          }}>{t.label}</span>
          {t.active && (
            <div style={{
              position: "absolute", left: 0, right: 0,
              bottom: -5, height: 1.5,
              background: RECAP_TOKENS.saffron,
            }}/>
          )}
        </div>
      ))}
    </div>
  );
}

// Metadata strip — Space Mono 9.5px, 0.22em tracking, ink 50%, round-dot separator
function MetadataStrip({ align = "left" }) {
  const sep = (
    <span style={{
      display: "inline-block", width: 3, height: 3, borderRadius: "50%",
      background: RECAP_TOKENS.ink, opacity: 0.7,
      marginLeft: 10, marginRight: 10,
      verticalAlign: "middle", position: "relative", top: -1,
    }}/>
  );
  return (
    <div style={{
      fontFamily: "Space Mono", fontWeight: 400,
      fontSize: 9.5, letterSpacing: "0.22em",
      textTransform: "uppercase",
      color: RECAP_TOKENS.ink, opacity: 0.5,
      textAlign: align,
      whiteSpace: "nowrap",
    }}>
      WEEK 14{sep}MAR 30 — APR 3{sep}THE OGUNTALAS
    </div>
  );
}

// Voice line — Fraunces italic 500, opsz 144, ink, line-height 1.10, -0.018em
function VoiceLine({ children, size = 32, color }) {
  return (
    <div style={{
      fontFamily: "Fraunces",
      fontStyle: "italic",
      fontWeight: 500,
      fontSize: size,
      lineHeight: 1.10,
      letterSpacing: "-0.018em",
      fontVariationSettings: '"opsz" 144',
      color: color || RECAP_TOKENS.ink,
    }}>{children}</div>
  );
}

// Story rule beneath the Hero — 1px, #E8E2D4, full width
function StoryRule() {
  return <div style={{ height: 1, background: RECAP_TOKENS.rule, width: "100%" }}/>;
}

Object.assign(window, {
  RECAP_TOKENS, PhotoPlaceholder, StatusBar, TabStrip,
  MetadataStrip, VoiceLine, StoryRule,
});
