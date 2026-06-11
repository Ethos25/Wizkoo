/* global React, RECAP_TOKENS, PhotoPlaceholder, StatusBar, TabStrip,
   MetadataStrip, VoiceLine, StoryRule */

// =============================================================
// THE RECAP — Four Hero compositions
// 390px viewport. Voice / metadata / chrome locked; layout is the variable.
// =============================================================

const PHONE_W = 390;

// Voice lines: each tuned to its photograph and its compositional logic.
// All draw from the brief's content register: bridge-building week,
// quiet observational tone, no exclamation, no marketing.

const VOICE = {
  d1: "The bridges this week were less about bridges than about what holds.",
  d2: "She placed the brace before either of us thought to ask why.",
  d3: "The third one fell, and that became the lesson.",
  d4: "He worked through Tuesday quiet, and the geometry was the conversation.",
};

// Photographs — one per direction, chosen from the brief's photo system.
const PHOTOS = {
  d1: { tag: "PHOTO · HANDS ON BRIDGE · WINDOW SIDE-LIGHT",      tone: "afternoon" },
  d2: { tag: "PHOTO · CHILD'S HANDS PLACING BRACE",              tone: "morning"   },
  d3: { tag: "PHOTO · COLLAPSED BRIDGE · THREE STICKS IN FAILED GEOMETRY", tone: "collapsed" },
  d4: { tag: "PHOTO · CHILD'S SHADOW BESIDE BRIDGE · POV",       tone: "shadow"    },
};

// =============================================================
// PHONE FRAME — outer device chrome. Soft shadow. Inner is Warm Chalk.
// =============================================================
function PhoneFrame({ children, height }) {
  return (
    <div style={{
      width: PHONE_W,
      height,
      background: RECAP_TOKENS.chalk,
      position: "relative",
      overflow: "hidden",
      boxShadow: "0 1px 0 rgba(12,16,32,0.04), 0 24px 60px -20px rgba(12,16,32,0.18)",
    }}>
      {children}
    </div>
  );
}

// =============================================================
// DIRECTION 1 — Editorial Classic
// Photo at canonical 4:3 inside 24px margins; metadata above as eyebrow;
// voice line 32px below with generous breathing room.
// =============================================================
function Direction1() {
  const photoW = PHONE_W - 48;        // 24px each side
  const photoH = Math.round(photoW * 3 / 4); // 4:3
  const totalH = 700;

  return (
    <PhoneFrame height={totalH}>
      <StatusBar />
      <TabStrip />

      {/* Metadata as eyebrow above photo */}
      <div style={{ paddingLeft: 24, paddingRight: 24, paddingTop: 28, paddingBottom: 14 }}>
        <MetadataStrip align="left" />
      </div>

      {/* Photograph */}
      <div style={{ paddingLeft: 24, paddingRight: 24 }}>
        <PhotoPlaceholder width={photoW} height={photoH}
          tag={PHOTOS.d1.tag} tone={PHOTOS.d1.tone} />
      </div>

      {/* Voice line — generous space above and below */}
      <div style={{ paddingLeft: 24, paddingRight: 24, paddingTop: 30, paddingBottom: 32 }}>
        <VoiceLine size={32}>{VOICE.d1}</VoiceLine>
      </div>

      <StoryRule />
    </PhoneFrame>
  );
}

// =============================================================
// DIRECTION 2 — Magazine Spread
// Photo bleeds edge-to-edge. Voice sits below in chalk with 40px+ breathing.
// Metadata strip relocated to below the voice line, not above the photo.
// =============================================================
function Direction2() {
  const photoW = PHONE_W;             // full bleed
  const photoH = Math.round(photoW * 5 / 4); // taller — 4:5 magazine plate
  const totalH = 760;

  return (
    <PhoneFrame height={totalH}>
      <StatusBar />
      <TabStrip />

      {/* Photograph — full bleed, no horizontal padding */}
      <div style={{ marginTop: 18 }}>
        <PhotoPlaceholder width={photoW} height={photoH}
          tag={PHOTOS.d2.tag} tone={PHOTOS.d2.tone} />
      </div>

      {/* Voice line — deep breathing, asymmetric left margin honoring print */}
      <div style={{ paddingLeft: 28, paddingRight: 36, paddingTop: 44 }}>
        <VoiceLine size={32}>{VOICE.d2}</VoiceLine>
      </div>

      {/* Metadata BELOW the voice line — caption position */}
      <div style={{ paddingLeft: 28, paddingRight: 28, paddingTop: 42, paddingBottom: 28 }}>
        <MetadataStrip align="left" />
      </div>

      <StoryRule />
    </PhoneFrame>
  );
}

// =============================================================
// DIRECTION 3 — Caption Integration
// Photo at 4:3, voice line composed AS the caption: smaller (25px), tight to photo.
// Metadata sits beneath the voice line; the whole reads as one editorial unit.
// =============================================================
function Direction3() {
  const photoW = PHONE_W - 48;
  const photoH = Math.round(photoW * 3 / 4);
  const totalH = 660;

  return (
    <PhoneFrame height={totalH}>
      <StatusBar />
      <TabStrip />

      <div style={{ height: 32 }}/>

      {/* Photograph */}
      <div style={{ paddingLeft: 24, paddingRight: 24 }}>
        <PhotoPlaceholder width={photoW} height={photoH}
          tag={PHOTOS.d3.tag} tone={PHOTOS.d3.tone} />
      </div>

      {/* Voice as caption — 12px below the photo, narrower measure */}
      <div style={{ paddingLeft: 24, paddingRight: 56, paddingTop: 12 }}>
        <VoiceLine size={25}>{VOICE.d3}</VoiceLine>
      </div>

      {/* Metadata immediately under voice — continuous unit */}
      <div style={{ paddingLeft: 24, paddingRight: 24, paddingTop: 14, paddingBottom: 30 }}>
        <MetadataStrip align="left" />
      </div>

      <StoryRule />
    </PhoneFrame>
  );
}

// =============================================================
// DIRECTION 4 — Asymmetric / Negative-space-led
// Photo occupies ~63% of width on the right; voice sits to the LEFT
// of the photo, breaking the grid downward. Metadata as a vertical
// eyebrow at top-left. Inspired by Apartamento's grid-breaking.
// =============================================================
function Direction4() {
  const totalH = 700;
  // Photo: right-aligned, 63% width, vertical 4:5 plate, full-bleed right
  const photoW = Math.round(PHONE_W * 0.63);   // 246
  const photoH = Math.round(photoW * 5 / 4);   // 308

  return (
    <PhoneFrame height={totalH}>
      <StatusBar />
      <TabStrip />

      {/* Top metadata eyebrow, anchored left */}
      <div style={{ paddingLeft: 24, paddingTop: 28, paddingBottom: 14 }}>
        <MetadataStrip align="left" />
      </div>

      {/* Asymmetric row: voice column on left, photo bleeds right edge */}
      <div style={{
        display: "flex", alignItems: "flex-start",
        gap: 0,
      }}>
        {/* Voice column — left third, anchored to photo's vertical center */}
        <div style={{
          width: PHONE_W - photoW,
          paddingLeft: 24, paddingRight: 14,
          paddingTop: 28,
        }}>
          <VoiceLine size={32}>{VOICE.d4}</VoiceLine>
        </div>

        {/* Photo — right two-thirds, bleeds the right edge */}
        <PhotoPlaceholder width={photoW} height={photoH}
          tag={PHOTOS.d4.tag} tone={PHOTOS.d4.tone} />
      </div>

      <div style={{ height: 50 }}/>

      <StoryRule />
    </PhoneFrame>
  );
}

Object.assign(window, { Direction1, Direction2, Direction3, Direction4 });
