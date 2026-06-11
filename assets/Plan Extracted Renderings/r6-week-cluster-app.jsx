/* global React, ReactDOM, DesignCanvas, DCSection, DCArtboard, WeekView, ClusterView */

function App() {
  return (
    <DesignCanvas
      title="The Plan — Week + Cluster"
      subtitle="Ledger Quieter applied to the two adjacent surfaces. Same band, same type discipline, same color marks.">

      <DCSection id="week" title="Week View" subtitle="Sunday-night orientation. Four days as paired sections; ~2 days per phone screen.">
        <DCArtboard id="week-default" label="Week 16 — Default" width={390} height={1720}>
          <WeekView />
        </DCArtboard>
      </DCSection>

      <DCSection id="cluster" title="Cluster View" subtitle="Sunday-prep / pre-execution. Materials, logistics, blocks.">
        <DCArtboard id="cluster-default" label="Bridge Architecture Lab — Default (logistics collapsed)" width={390} height={1100}>
          <ClusterView logisticsOpen={false} />
        </DCArtboard>
        <DCArtboard id="cluster-expanded" label="Bridge Architecture Lab — Logistics expanded" width={390} height={1240}>
          <ClusterView logisticsOpen={true} />
        </DCArtboard>
      </DCSection>

    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
