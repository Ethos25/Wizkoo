/* global React, ReactDOM, DesignCanvas, DCSection, DCArtboard,
   PALETTE_J, PALETTE_K, PALETTE_L,
   FrameCardR7, CompareStripR7,
   PaletteCardR7, ConstraintCheckR7, SystemAuditR7, NineColorLandscapeR7,
   TodayViewR7, BlockSheetR7, RecapBadgeR7, RationaleNoteR7 */

function PaletteSectionR7({ palette, sid }) {
  return (
    <DCSection
      id={sid}
      title={palette.kicker + " · " + palette.title}
      subtitle={palette.tagline}
    >
      <DCArtboard id={sid + "-card"} label="The four colours · territories tagged" width={620} height={560}>
        <PaletteCardR7 palette={palette}/>
      </DCArtboard>
      <DCArtboard id={sid + "-constraints"} label="Constraint check · all four pass" width={620} height={560}>
        <ConstraintCheckR7 palette={palette}/>
      </DCArtboard>
      <DCArtboard id={sid + "-audit"} label="System audit · optimized as one set" width={620} height={560}>
        <SystemAuditR7 palette={palette}/>
      </DCArtboard>
      <DCArtboard id={sid + "-landscape"} label="Nine-colour landscape · same surface" width={760} height={560}>
        <NineColorLandscapeR7 palette={palette}/>
      </DCArtboard>
      <DCArtboard id={sid + "-today"} label="Today View · expanded cluster" width={440} height={1060}>
        <TodayViewR7 palette={palette}/>
      </DCArtboard>
      <DCArtboard id={sid + "-print"} label="Block Sheet · paper tone" width={500} height={520}>
        <BlockSheetR7 palette={palette}/>
      </DCArtboard>
      <DCArtboard id={sid + "-recap"} label="Recap badge · 20px" width={440} height={420}>
        <RecapBadgeR7 palette={palette}/>
      </DCArtboard>
      <DCArtboard id={sid + "-note"} label="Rationale" width={520} height={1100}>
        <RationaleNoteR7 palette={palette}/>
      </DCArtboard>
    </DCSection>
  );
}

function App() {
  return (
    <DesignCanvas>
      <DCSection id="overview" title="Overview" subtitle="Round seven · four slots open · three palettes optimized as systems">
        <DCArtboard id="frame" label="What round seven is solving" width={620} height={720}>
          <FrameCardR7/>
        </DCArtboard>
        <DCArtboard id="compare" label="One row · three palettes · same screen" width={880} height={620}>
          <CompareStripR7/>
        </DCArtboard>
      </DCSection>

      <PaletteSectionR7 palette={PALETTE_J} sid="j"/>
      <PaletteSectionR7 palette={PALETTE_K} sid="k"/>
      <PaletteSectionR7 palette={PALETTE_L} sid="l"/>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
