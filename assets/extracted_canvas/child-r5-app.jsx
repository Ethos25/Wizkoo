/* global React, ReactDOM, DesignCanvas, DCSection, DCArtboard,
   PALETTE_D, PALETTE_E,
   FrameCardR5, CompareStripR5,
   PaletteCardR5, ConstraintCheckR5, NineColorLandscapeR5,
   TodayViewR5, BlockSheetR5, RecapBadgeR5, RationaleNoteR5 */

function PaletteSectionR5({ palette, sid }) {
  return (
    <DCSection
      id={sid}
      title={palette.kicker + " · " + palette.title}
      subtitle={palette.tagline}
    >
      <DCArtboard id={sid + "-card"} label="The four colors · territories tagged" width={620} height={560}>
        <PaletteCardR5 palette={palette}/>
      </DCArtboard>
      <DCArtboard id={sid + "-constraints"} label="Constraint check · all four pass" width={620} height={560}>
        <ConstraintCheckR5 palette={palette}/>
      </DCArtboard>
      <DCArtboard id={sid + "-landscape"} label="Nine-color landscape · same surface" width={760} height={560}>
        <NineColorLandscapeR5 palette={palette}/>
      </DCArtboard>
      <DCArtboard id={sid + "-today"} label="Today View · expanded cluster" width={440} height={1060}>
        <TodayViewR5 palette={palette}/>
      </DCArtboard>
      <DCArtboard id={sid + "-print"} label="Block Sheet · paper tone" width={500} height={520}>
        <BlockSheetR5 palette={palette}/>
      </DCArtboard>
      <DCArtboard id={sid + "-recap"} label="Recap badge · 20px" width={440} height={420}>
        <RecapBadgeR5 palette={palette}/>
      </DCArtboard>
      <DCArtboard id={sid + "-note"} label="Rationale" width={520} height={1100}>
        <RationaleNoteR5 palette={palette}/>
      </DCArtboard>
    </DCSection>
  );
}

function App() {
  return (
    <DesignCanvas>
      <DCSection id="overview" title="Overview" subtitle="Round-five frame · four constraints, defended explicitly · two palettes compared">
        <DCArtboard id="frame" label="What round five is solving" width={620} height={620}>
          <FrameCardR5/>
        </DCArtboard>
        <DCArtboard id="compare" label="One row · two palettes · same screen" width={760} height={560}>
          <CompareStripR5/>
        </DCArtboard>
      </DCSection>

      <PaletteSectionR5 palette={PALETTE_D} sid="d"/>
      <PaletteSectionR5 palette={PALETTE_E} sid="e"/>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
