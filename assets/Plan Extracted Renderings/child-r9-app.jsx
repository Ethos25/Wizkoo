/* global React, ReactDOM, DesignCanvas, DCSection, DCArtboard, PALETTE_P, PALETTE_Q, PALETTE_R,
   FrameCardR9, PaletteCardR9, ConstraintCheckR9, TenColorLandscapeR9,
   TodayViewR9, BlockSheetR9, RecapBadgeR9, RationaleNoteR9 */

function PaletteSectionR9({ palette, sid }) {
  return (
    <DCSection id={sid} title={palette.kicker + " · " + palette.title} subtitle={palette.tagline}>
      <DCArtboard id={sid + "-card"} label="The four colours · semantic + chips" width={620} height={580}><PaletteCardR9 palette={palette}/></DCArtboard>
      <DCArtboard id={sid + "-constraints"} label="Four constraints · 8-subject defense + TBD + inclusion" width={660} height={600}><ConstraintCheckR9 palette={palette}/></DCArtboard>
      <DCArtboard id={sid + "-landscape"} label="Ten-colour landscape · all subjects + children" width={800} height={620}><TenColorLandscapeR9 palette={palette}/></DCArtboard>
      <DCArtboard id={sid + "-today"} label="Today View · expanded · vs Vermilion red underline" width={440} height={1080}><TodayViewR9 palette={palette}/></DCArtboard>
      <DCArtboard id={sid + "-print"} label="Block Sheet · paper · vs subject underline" width={500} height={520}><BlockSheetR9 palette={palette}/></DCArtboard>
      <DCArtboard id={sid + "-recap"} label="Recap badge · 20px · vs all 8 subjects" width={440} height={420}><RecapBadgeR9 palette={palette}/></DCArtboard>
      <DCArtboard id={sid + "-note"} label="Rationale" width={520} height={1100}><RationaleNoteR9 palette={palette}/></DCArtboard>
    </DCSection>
  );
}

function App() {
  return (
    <DesignCanvas>
      <DCSection id="overview" title="Overview" subtitle="Round nine · eight-subject reality · floor + two pushes">
        <DCArtboard id="frame" label="What round nine is solving" width={660} height={720}><FrameCardR9/></DCArtboard>
      </DCSection>
      <PaletteSectionR9 palette={PALETTE_P} sid="p"/>
      <PaletteSectionR9 palette={PALETTE_Q} sid="q"/>
      <PaletteSectionR9 palette={PALETTE_R} sid="r"/>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
