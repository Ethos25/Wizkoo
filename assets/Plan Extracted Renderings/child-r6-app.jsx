/* global React, ReactDOM, DesignCanvas, DCSection, DCArtboard,
   CANDIDATE_F, CANDIDATE_G, CANDIDATE_H,
   FrameCardR6, CompareStripR6,
   PaletteCardR6, ConstraintCheckR6, NineColorLandscapeR6,
   TodayViewR6, RecapBadgeR6, RationaleNoteR6, ExpandedClusterTestR6 */

function CandidateSectionR6({ palette, sid }) {
  return (
    <DCSection
      id={sid}
      title={palette.kicker + " · JANE = " + palette.janeName}
      subtitle={palette.tagline}
    >
      <DCArtboard id={sid + "-card"} label="The four colours · Jane open" width={620} height={560}>
        <PaletteCardR6 palette={palette}/>
      </DCArtboard>
      <DCArtboard id={sid + "-constraints"} label="Constraint check · four success criteria" width={620} height={560}>
        <ConstraintCheckR6 palette={palette}/>
      </DCArtboard>
      <DCArtboard id={sid + "-cluster"} label="Same-screen test · expanded cluster (the brief's required frame)" width={620} height={720}>
        <ExpandedClusterTestR6 palette={palette}/>
      </DCArtboard>
      <DCArtboard id={sid + "-today"} label="Today View · phone · expanded cluster" width={440} height={1060}>
        <TodayViewR6 palette={palette}/>
      </DCArtboard>
      <DCArtboard id={sid + "-landscape"} label="Nine-colour landscape · same surface" width={760} height={560}>
        <NineColorLandscapeR6 palette={palette}/>
      </DCArtboard>
      <DCArtboard id={sid + "-recap"} label="Recap badge · 20px · the chip-scale test" width={440} height={420}>
        <RecapBadgeR6 palette={palette}/>
      </DCArtboard>
      <DCArtboard id={sid + "-note"} label="Rationale" width={520} height={1100}>
        <RationaleNoteR6 palette={palette}/>
      </DCArtboard>
    </DCSection>
  );
}

function App() {
  return (
    <DesignCanvas>
      <DCSection id="overview" title="Overview" subtitle="Round six · the fourth slot · three candidates for Jane">
        <DCArtboard id="frame" label="What round six is solving" width={620} height={720}>
          <FrameCardR6/>
        </DCArtboard>
        <DCArtboard id="compare" label="One row · three candidates · only Jane changes" width={880} height={620}>
          <CompareStripR6/>
        </DCArtboard>
      </DCSection>

      <CandidateSectionR6 palette={CANDIDATE_F} sid="f"/>
      <CandidateSectionR6 palette={CANDIDATE_G} sid="g"/>
      <CandidateSectionR6 palette={CANDIDATE_H} sid="h"/>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
