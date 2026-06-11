/* global React, ReactDOM, Ledger */

// =============================================================
// Today View — locked. Single phone frame at the center, with a
// subtle "tap a row to expand" affordance. Default state on the
// left, a parallel "Cluster 3 expanded" state on the right so the
// expanded row can be read without interaction.
// =============================================================

function App() {
  const [openLeft] = React.useState(null);
  const [openRight] = React.useState("eps");

  // No-op setters: this is the locked presentation, not a live prototype.
  // Keep the components controlled so the open state is deterministic.
  return (
    <div style={{ minHeight: "100vh", background: "var(--canvas)", padding: "48px 24px 96px" }}>
      <Header />
      <div style={{
        display: "grid", gridTemplateColumns: "390px 390px", gap: 56,
        justifyContent: "center", marginTop: 40,
      }}>
        <Stage label="Default">
          <Ledger openId={openLeft} setOpen={() => {}} />
        </Stage>
        <Stage label="Cluster 3 expanded">
          <Ledger openId={openRight} setOpen={() => {}} />
        </Stage>
      </div>
      <Footnote />
    </div>
  );
}

function Header() {
  return (
    <div style={{ maxWidth: 880, margin: "0 auto", color: "var(--ink)" }}>
      <div className="mono" style={{ fontSize: 10, color: "var(--meta)", letterSpacing: "0.22em" }}>
        TODAY VIEW · LOCKED
      </div>
      <h1 style={{
        margin: "10px 0 0", fontFamily: "Fraunces", fontWeight: 400, fontSize: 32,
        letterSpacing: "-0.015em", color: "var(--ink)",
      }}>
        The day, in five clusters.
      </h1>
      <p style={{
        margin: "10px 0 0", maxWidth: 620,
        fontFamily: "Plus Jakarta Sans", fontWeight: 400, fontSize: 14,
        color: "var(--mid)", lineHeight: 1.55,
      }}>
        Time on the left rail. Cluster name as the line. Subject as a small dot
        and three-letter mark. Together / parallel / split sits in the meta line.
        Tap a row to see the children, the blocks, and how the work is split.
      </p>
    </div>
  );
}

function Stage({ label, children }) {
  return (
    <div>
      <div className="mono" style={{
        fontSize: 9, color: "var(--meta)", letterSpacing: "0.22em",
        marginBottom: 14, paddingLeft: 4,
      }}>
        {label.toUpperCase()}
      </div>
      <div style={{
        width: 390, borderRadius: 36, overflow: "hidden",
        boxShadow: "0 1px 0 rgba(0,0,0,0.04), 0 30px 60px -20px rgba(20, 18, 14, 0.18)",
        border: "1px solid #E7E1D2",
        background: "var(--chalk)",
      }}>
        {children}
      </div>
    </div>
  );
}

function Footnote() {
  return (
    <div style={{
      maxWidth: 880, margin: "48px auto 0",
      fontFamily: "Plus Jakarta Sans", fontWeight: 400, fontSize: 12,
      color: "var(--meta)", lineHeight: 1.6,
    }}>
      <span className="mono" style={{ letterSpacing: "0.18em", color: "var(--meta)" }}>NOTES </span>
      &nbsp;The expanded view collapses identical-roster blocks into a single
      group; when the roster differs, blocks group under their participants
      (e.g. Cluster 3, "Engineering Problem Solving"). The dotted hairline
      between blocks is the only place dots appear in the design — they read
      as "subdivisions of one row," not as their own line.
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
