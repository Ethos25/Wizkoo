/* global React, ReactDOM, DesignCanvas, DCSection, DCArtboard, useExpand,
   Ledger, LedgerQuieter, LedgerCut */

function App() {
  const [origA, setOrigA] = useExpand(null);
  const [origB, setOrigB] = useExpand("eps");
  const [qA, setQA] = useExpand(null);
  const [qB, setQB] = useExpand("eps");
  const [cA, setCA] = useExpand(null);
  const [cB, setCB] = useExpand("eps");

  return (
    <DesignCanvas
      title="Today View — Round 5: Ledger at the floor"
      subtitle="Original Ledger (R4 baseline) alongside Quieter and Cut. Two artboards each: default + Cluster 3 expanded.">

      <DCSection id="floor" title="Ledger · Quieter · Cut" subtitle="Three takes on the same logic. Originals first, then variants.">
        <DCArtboard id="orig-default"  label="Ledger (R4 baseline) — Default"  width={390} height={1100}>
          <Ledger openId={origA} setOpen={setOrigA} />
        </DCArtboard>
        <DCArtboard id="orig-expanded" label="Ledger (R4 baseline) — Expanded" width={390} height={1500}>
          <Ledger openId={origB} setOpen={setOrigB} />
        </DCArtboard>

        <DCArtboard id="quieter-default"  label="A · Ledger Quieter — Default"  width={390} height={1300}>
          <LedgerQuieter openId={qA} setOpen={setQA} />
        </DCArtboard>
        <DCArtboard id="quieter-expanded" label="A · Ledger Quieter — Expanded" width={390} height={1700}>
          <LedgerQuieter openId={qB} setOpen={setQB} />
        </DCArtboard>

        <DCArtboard id="cut-default"  label="B · Ledger Cut — Default"  width={390} height={1300}>
          <LedgerCut openId={cA} setOpen={setCA} />
        </DCArtboard>
        <DCArtboard id="cut-expanded" label="B · Ledger Cut — Expanded" width={390} height={1700}>
          <LedgerCut openId={cB} setOpen={setCB} />
        </DCArtboard>
      </DCSection>

    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
