/* global React, ReactDOM, DesignCanvas, DCSection, DCArtboard,
   PALETTE_A, PALETTE_B, PALETTE_C, PALETTES_R4,
   FrameCardR4, CompareStripR4,
   PaletteCardR4, NineColorLandscape, TodayView, BlockSheetR4, RecapBadgeR4, RationaleNoteR4 */

// =============================================================
// PER-CHILD COLOR PALETTE · ROUND FOUR
// Hue Territory Refinement — three palettes, architecture locked.
// =============================================================

function PaletteSection({ palette, sid }) {
  return (
    <DCSection
      id={sid}
      title={palette.kicker + " · " + palette.title}
      subtitle={palette.tagline}
    >
      <DCArtboard id={sid + "-card"} label="The four colors" width={620} height={560}>
        <PaletteCardR4 palette={palette}/>
      </DCArtboard>
      <DCArtboard id={sid + "-landscape"} label="Nine-color landscape · same surface" width={760} height={560}>
        <NineColorLandscape palette={palette}/>
      </DCArtboard>
      <DCArtboard id={sid + "-today"} label="Today View · expanded cluster" width={440} height={1060}>
        <TodayView palette={palette}/>
      </DCArtboard>
      <DCArtboard id={sid + "-print"} label="Block Sheet · paper tone" width={500} height={520}>
        <BlockSheetR4 palette={palette}/>
      </DCArtboard>
      <DCArtboard id={sid + "-recap"} label="Recap badge · 20px" width={440} height={420}>
        <RecapBadgeR4 palette={palette}/>
      </DCArtboard>
      <DCArtboard id={sid + "-note"} label="Rationale" width={520} height={1060}>
        <RationaleNoteR4 palette={palette}/>
      </DCArtboard>
    </DCSection>
  );
}

function App() {
  return (
    <DesignCanvas>
      <DCSection id="overview" title="Overview" subtitle="Round-four frame · architecture locked · three palettes compared">
        <DCArtboard id="frame" label="What round four is solving" width={620} height={560}>
          <FrameCardR4/>
        </DCArtboard>
        <DCArtboard id="compare" label="One row · three palettes · same screen" width={760} height={560}>
          <CompareStripR4/>
        </DCArtboard>
      </DCSection>

      <PaletteSection palette={PALETTE_A} sid="a"/>
      <PaletteSection palette={PALETTE_B} sid="b"/>
      <PaletteSection palette={PALETTE_C} sid="c"/>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
