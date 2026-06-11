/* global React, SUBJECT, CLUSTER, PlanetariumBandV2 */

// =============================================================
// CLUSTER VIEW
// Extension of Ledger Quieter to block-level granularity.
//
// Header band: cluster name as the Fraunces moment (the same way the
// day's theme is on Today View). Subtitle slot carries the mono trio
// "MATH · TOGETHER · ALL FOUR" so the brand line and the operative
// metadata sit in the same vertical rhythm.
//
// Working surface composition, top → bottom:
//   1. Materials checklist (Sunday-prep affordance, ignorable mid-execution)
//   2. Logistics notes (collapsed by default, single mono line)
//   3. Block list (Ledger Quieter rows, Start CTA on the right)
//
// Decisions for block rows:
//   – Completion ring on the LEFT (same vocabulary as Week)
//   – 20M time-in-margin (mono)
//   – Block name 16/500 (between Today's 17 and Week's 14)
//   – Subject dot + tag trio (MATH · HANDS-ON · PER-CHILD)
//   – Right column: a saffron-underlined "Start" affordance
//   – No position number; blocks are short enough that 1/2/3 is obvious
// =============================================================

function ClusterView({ logisticsOpen = false }) {
  const sub = SUBJECT[CLUSTER.subject];

  return (
    <div className="frame" style={{ background: "var(--chalk)", paddingBottom: 110 }}>
      <PlanetariumBandV2
        variant="cluster"
        kicker="CLUSTER · TUE"
        paceText={`${CLUSTER.pace.hours} / ${CLUSTER.pace.target} · ON PACE`}
        fraunces={CLUSTER.name}
        subtitle={`${CLUSTER.duration} · ${CLUSTER.blockCount} blocks`}
      />

      {/* Subject + modifier trio — same mono vocabulary, just below band */}
      <div style={{ padding: "14px 22px 0", display: "flex", alignItems: "center", gap: 9 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: 6, background: sub.bright, display: "inline-block" }} />
          <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>
            {sub.abbr}
          </span>
        </span>
        <span style={{ width: 1, height: 9, background: "#DCD6C5" }} />
        <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>
          {CLUSTER.modifier}
        </span>
        <span style={{ width: 1, height: 9, background: "#DCD6C5" }} />
        <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>
          {CLUSTER.who}
        </span>
      </div>

      {/* Materials */}
      <Materials items={CLUSTER.materials} checked={CLUSTER.materialsChecked} />

      {/* Logistics notes */}
      <Logistics notes={CLUSTER.logistics} open={logisticsOpen} />

      {/* Block list */}
      <BlockList blocks={CLUSTER.blocks} />
    </div>
  );
}

// ---------- Materials ----------

function Materials({ items, checked }) {
  const total = items.length;
  const done = checked.filter(Boolean).length;
  return (
    <div style={{ marginTop: 22, padding: "0 22px" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>
          MATERIALS
        </span>
        <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>
          {done} / {total} GATHERED
        </span>
      </div>

      <div style={{ marginTop: 10, borderTop: "1px solid #ECE7DA" }}>
        {items.map((m, i) => (
          <div key={i} style={{
            padding: "10px 0",
            borderBottom: i === items.length - 1 ? "none" : "1px solid #ECE7DA",
            display: "grid", gridTemplateColumns: "16px 1fr",
            gap: 12, alignItems: "center",
          }}>
            <Check checked={checked[i]} />
            <span style={{
              fontFamily: "Plus Jakarta Sans", fontWeight: 400, fontSize: 13,
              color: checked[i] ? "var(--meta)" : "var(--ink)",
              textDecoration: checked[i] ? "line-through" : "none",
              textDecorationColor: "rgba(140,145,165,0.5)",
              textDecorationThickness: "1px",
              letterSpacing: "-0.003em",
            }}>
              {m}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Check({ checked }) {
  if (checked) {
    return (
      <span style={{
        width: 12, height: 12, borderRadius: 2, background: "var(--saffron)",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="8" height="8" viewBox="0 0 8 8">
          <path d="M1.5 4 L3.4 5.8 L6.5 2" fill="none" stroke="#0C1020" strokeWidth="1.4"
                strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    );
  }
  return (
    <span style={{
      width: 12, height: 12, borderRadius: 2, border: "1px solid #B7B4A8",
      display: "inline-block", boxSizing: "border-box",
    }} />
  );
}

// ---------- Logistics ----------

function Logistics({ notes, open }) {
  return (
    <div style={{ marginTop: 22, padding: "0 22px" }}>
      <button style={{
        background: "transparent", border: "none", padding: "12px 0", cursor: "pointer",
        width: "100%", textAlign: "left",
        borderTop: "1px solid #ECE7DA",
        borderBottom: open ? "none" : "1px solid #ECE7DA",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>
          LOGISTICS NOTES{open ? "" : ` · ${notes.length}`}
        </span>
        <Caret open={open} />
      </button>

      {open && (
        <div style={{
          paddingTop: 4, paddingBottom: 16,
          borderBottom: "1px solid #ECE7DA",
        }}>
          {notes.map((n, i) => (
            <div key={i} style={{
              padding: "8px 0",
              fontFamily: "Plus Jakarta Sans", fontWeight: 400, fontSize: 13,
              color: "var(--mid)", lineHeight: 1.45, letterSpacing: "-0.003em",
              display: "grid", gridTemplateColumns: "16px 1fr", gap: 12, alignItems: "baseline",
            }}>
              <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.18em" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{n}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Caret({ open }) {
  return (
    <svg width="9" height="9" viewBox="0 0 9 9" style={{ display: "block" }}>
      {open
        ? <path d="M1 3 L4.5 6.5 L8 3" fill="none" stroke="#B7B4A8" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        : <path d="M3 1 L6.5 4.5 L3 8"  fill="none" stroke="#B7B4A8" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  );
}

// ---------- Blocks ----------

function BlockList({ blocks }) {
  return (
    <div style={{ marginTop: 26, padding: "0 22px" }}>
      <div className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>
        BLOCKS · {blocks.length}
      </div>
      <div style={{ marginTop: 10, borderTop: "1px solid #ECE7DA" }}>
        {blocks.map((b, i) => (
          <BlockRow key={b.id} b={b} isLast={i === blocks.length - 1} />
        ))}
      </div>
    </div>
  );
}

function BlockRow({ b, isLast }) {
  const sub = SUBJECT[b.subject];
  return (
    <div style={{
      padding: "20px 0",
      borderBottom: isLast ? "none" : "1px solid #ECE7DA",
      display: "grid",
      gridTemplateColumns: "16px 36px 1fr auto",
      gap: 12, alignItems: "baseline",
    }}>
      <span style={{ alignSelf: "center", justifySelf: "start" }}>
        <Ring complete={b.complete} />
      </span>

      <span className="mono" style={{ fontSize: 10, color: "var(--ink)", letterSpacing: "0.18em", alignSelf: "center" }}>
        {b.time}M
      </span>

      <div>
        <div style={{
          fontFamily: "Plus Jakarta Sans", fontWeight: 500, fontSize: 16,
          color: "var(--ink)", letterSpacing: "-0.008em", lineHeight: 1.25,
        }}>
          {b.name}
        </div>
        <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 5, height: 5, borderRadius: 5, background: sub.bright, display: "inline-block" }} />
            <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>
              {b.tags[0]}
            </span>
          </span>
          {b.tags.slice(1).map((t, i) => (
            <React.Fragment key={i}>
              <span style={{ width: 1, height: 8, background: "#DCD6C5" }} />
              <span className="mono" style={{ fontSize: 9, color: "var(--meta)", letterSpacing: "0.20em" }}>
                {t}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      <button style={{
        background: "transparent", border: "none", cursor: "pointer", alignSelf: "center",
        fontFamily: "Plus Jakarta Sans", fontWeight: 500, fontSize: 14,
        color: "var(--ink)", letterSpacing: "-0.005em",
        padding: "4px 0", borderBottom: "2px solid var(--saffron)",
      }}>
        Start
      </button>
    </div>
  );
}

function Ring({ complete }) {
  if (complete) {
    return (
      <span style={{
        width: 10, height: 10, borderRadius: 10,
        background: "var(--saffron)", display: "inline-block",
      }} />
    );
  }
  return (
    <span style={{
      width: 10, height: 10, borderRadius: 10,
      border: "1px solid #B7B4A8", display: "inline-block", boxSizing: "border-box",
    }} />
  );
}

Object.assign(window, { ClusterView });
