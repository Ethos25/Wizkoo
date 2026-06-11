/* global React, ReactDOM, DesignCanvas, DCSection, DCArtboard, PALETTE_M, PALETTE_N, PALETTE_O,
   FrameCardR8, CompareStripR8, PaletteCardR8, ConstraintCheckR8, SystemAuditR8, NineColorLandscapeR8,
   TodayViewR8, BlockSheetR8, RecapBadgeR8, RationaleNoteR8 */

function PaletteSectionR8({ palette, sid }) {
  return (
    <DCSection id={sid} title={palette.kicker + " · " + palette.title} subtitle={palette.tagline}>
      <DCArtboard id={sid + "-card"} label="The four colours · one family" width={620} height={560}><PaletteCardR8 palette={palette}/></DCArtboard>
      <DCArtboard id={sid + "-constraints"} label="Constraint check · all four pass" width={620} height={560}><ConstraintCheckR8 palette={palette}/></DCArtboard>
      <DCArtboard id={sid + "-audit"} label="System audit · the family holds" width={620} height={560}><SystemAuditR8 palette={palette}/></DCArtboard>
      <DCArtboard id={sid + "-landscape"} label="Nine-colour landscape" width={760} height={560}><NineColorLandscapeR8 palette={palette}/></DCArtboard>
      <DCArtboard id={sid + "-today"} label="Today View · expanded cluster" width={440} height={1060}><TodayViewR8 palette={palette}/></DCArtboard>
      <DCArtboard id={sid + "-print"} label="Block Sheet · paper tone" width={500} height={520}><BlockSheetR8 palette={palette}/></DCArtboard>
      <DCArtboard id={sid + "-recap"} label="Recap badge · 20px" width={440} height={420}><RecapBadgeR8 palette={palette}/></DCArtboard>
      <DCArtboard id={sid + "-note"} label="Rationale" width={520} height={1100}><RationaleNoteR8 palette={palette}/></DCArtboard>
    </DCSection>
  );
}

function App() {
  return (
    <DesignCanvas>
      <DCSection id="overview" title="Overview" subtitle="Round eight · one family · cream → brown · three takes">
        <DCArtboard id="frame" label="What round eight is solving" width={620} height={700}><FrameCardR8/></DCArtboard>
        <DCArtboard id="compare" label="One row · three palettes · same screen" width={880} height={620}><CompareStripR8/></DCArtboard>
      </DCSection>
      <PaletteSectionR8 palette={PALETTE_M} sid="m"/>
      <PaletteSectionR8 palette={PALETTE_N} sid="n"/>
      <PaletteSectionR8 palette={PALETTE_O} sid="o"/>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
