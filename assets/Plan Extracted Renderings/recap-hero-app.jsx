/* global React, ReactDOM, DesignCanvas, DCSection, DCArtboard,
   Direction1, Direction2, Direction3, Direction4 */

function RecapHeroApp() {
  return (
    <DesignCanvas title="The Recap — Hero Compositions"
      subtitle="Four directions · 390px viewport · Atelier Jewels / Light Standard tokens"
    >
      <DCSection
        id="hero-explorations"
        title="Hero Compositions"
        subtitle="Each direction defeats one of the five named failure modes. Compare against The Single Test: could a parent mistake this for a magazine page?"
      >
        <DCArtboard id="d1" label="Direction 1 · Editorial classic — defeats Failure 1 (marketing copy)" width={390} height={700}>
          <Direction1 />
        </DCArtboard>

        <DCArtboard id="d2" label="Direction 2 · Magazine spread — defeats Failure 4 (UI dressed as magazine)" width={390} height={760}>
          <Direction2 />
        </DCArtboard>

        <DCArtboard id="d3" label="Direction 3 · Caption integration — defeats Failure 2 (voice floats untethered)" width={390} height={660}>
          <Direction3 />
        </DCArtboard>

        <DCArtboard id="d4" label="Direction 4 · Asymmetric / negative-space — defeats Failure 3 (photo dominates)" width={390} height={700}>
          <Direction4 />
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RecapHeroApp />);
