/* global React, ReactDOM, DesignCanvas, DCSection, DCArtboard, PALETTE_LOCK,
   FrameCardR10, PaletteCardR10, CalibrationNoteR10, CollisionAuditR10,
   TenColorLandscapeR10, TodayViewR10, BlockSheetR10, RecapBadgeR10 */

function App() {
  return (
    <DesignCanvas>
      <DCSection id="lock" title="The Lock · Aubergine · Plum · Stone · Oat" subtitle="Round ten · calibration complete">
        <DCArtboard id="frame"        label="The four hex values · final" width={700} height={600}><FrameCardR10/></DCArtboard>
        <DCArtboard id="card"         label="The palette · containers + equity test" width={700} height={620}><PaletteCardR10 palette={PALETTE_LOCK}/></DCArtboard>
        <DCArtboard id="calibration"  label="Two calibrations · Mulberry → Plum · Greige → Oat" width={660} height={540}><CalibrationNoteR10 palette={PALETTE_LOCK}/></DCArtboard>
        <DCArtboard id="collision"    label="Subject collision audit · all 8 subjects" width={760} height={580}><CollisionAuditR10 palette={PALETTE_LOCK}/></DCArtboard>
        <DCArtboard id="landscape"    label="Ten-colour landscape · two distinct families" width={800} height={600}><TenColorLandscapeR10 palette={PALETTE_LOCK}/></DCArtboard>
      </DCSection>
      <DCSection id="tests" title="Same-screen tests" subtitle="Today View vs Vermilion · Block Sheet · Recap badge at 20px">
        <DCArtboard id="today" label="Today View · expanded · Plum vs Vermilion red underline" width={440} height={1080}><TodayViewR10 palette={PALETTE_LOCK}/></DCArtboard>
        <DCArtboard id="print" label="Block Sheet · paper-tone · Vermilion subject + Plum container" width={500} height={520}><BlockSheetR10 palette={PALETTE_LOCK}/></DCArtboard>
        <DCArtboard id="recap" label="Recap badge · 20×20px · the equity test" width={440} height={460}><RecapBadgeR10 palette={PALETTE_LOCK}/></DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
