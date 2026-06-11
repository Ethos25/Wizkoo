/* global React, ReactDOM, DesignCanvas, DCSection, DCArtboard, useExpand,
   Diagrammatic, Ledger */

function App() {
  const [diaA, setDiaA] = useExpand(null);
  const [diaB, setDiaB] = useExpand("eps");
  const [ledA, setLedA] = useExpand(null);
  const [ledB, setLedB] = useExpand("eps");

  return (
    <DesignCanvas
      title="Diagrammatic vs. Ledger — side by side"
      subtitle="Two finalists. Default and Cluster 3 expanded for each, all in one row at 390px.">

      <DCSection id="compare" title="Diagrammatic · Ledger" subtitle="Default + Cluster 3 expanded for each — drag to reorder, click an artboard to focus.">
        <DCArtboard id="dia-default"  label="Diagrammatic — Default"             width={390} height={1500}>
          <Diagrammatic openId={diaA} setOpen={setDiaA} />
        </DCArtboard>
        <DCArtboard id="dia-expanded" label="Diagrammatic — Cluster 3 expanded"  width={390} height={1800}>
          <Diagrammatic openId={diaB} setOpen={setDiaB} />
        </DCArtboard>
        <DCArtboard id="led-default"  label="Ledger — Default"                   width={390} height={1100}>
          <Ledger openId={ledA} setOpen={setLedA} />
        </DCArtboard>
        <DCArtboard id="led-expanded" label="Ledger — Cluster 3 expanded"        width={390} height={1500}>
          <Ledger openId={ledB} setOpen={setLedB} />
        </DCArtboard>
      </DCSection>

    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
