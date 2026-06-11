/* global React, ReactDOM,
   PlanGeneratorPair, TodayView, WeekView, ClusterView, BlockView,
   WeekSheet, MaterialsMaster, BlockSheet, BLOCK_DATA_GH,
   KIDS, COLORS, SUBJECTS, NameB, ChipB, SubjectMark */

// =============================================================
// PRINT APP — one artboard per page. No design-canvas chrome,
// no pan/zoom. Each <Page> is sized to fit landscape A4 / Letter
// at 0.5cm margin and break-after:page.
// =============================================================

function Page({ label, w, h, children }) {
  // Fit any artboard onto a landscape page (1100 × 800 working area
  // after 0.5cm margins on US Letter / A4 landscape ≈ 1080 × 770 at 96dpi).
  const PAGE_W = 1080;
  const PAGE_H = 770;
  const scale = Math.min(PAGE_W / w, PAGE_H / h, 1);
  return (
    <section style={{
      width: PAGE_W, minHeight: PAGE_H, background: "#FFFFFF",
      breakAfter: "page", pageBreakAfter: "always",
      padding: "12px 0 0", display: "flex", flexDirection: "column",
      alignItems: "center", boxSizing: "border-box", overflow: "hidden",
    }}>
      <div className="mono" style={{
        fontSize: 9, letterSpacing: "0.22em", color: "#8C91A5",
        marginBottom: 8, alignSelf: "flex-start", paddingLeft: 16,
      }}>{label}</div>
      <div style={{
        width: w, height: h,
        transform: `scale(${scale})`, transformOrigin: "top center",
        marginBottom: -((1 - scale) * h),
      }}>
        {children}
      </div>
    </section>
  );
}

function PrintApp() {
  return (
    <div>
      <Page label="PLAN GENERATOR · PHONE FRAME" w={920} h={1300}>
        <PlanGeneratorPair/>
      </Page>
      <Page label="VIEW 1 · TODAY" w={1080} h={920}>
        <TodayView/>
      </Page>
      <Page label="VIEW 2 · WEEK" w={1240} h={870}>
        <WeekView/>
      </Page>
      <Page label="VIEW 3 · CLUSTER" w={1080} h={1000}>
        <ClusterView/>
      </Page>
      <Page label="VIEW 4 · BLOCK" w={1080} h={1180}>
        <BlockView/>
      </Page>
      <Page label="PRINT 1 · WEEK SHEET" w={1300} h={920}>
        <WeekSheet/>
      </Page>
      <Page label="PRINT 2 · MATERIALS MASTER" w={800} h={1140}>
        <MaterialsMaster/>
      </Page>
      <Page label="PRINT 3 · BLOCK SHEET" w={800} h={1140}>
        <BlockSheet data={BLOCK_DATA_GH}/>
      </Page>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<PrintApp/>);

// Auto-print once fonts + JSX are ready.
(async () => {
  try {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
  } catch (e) { /* noop */ }
  setTimeout(() => { window.print(); }, 700);
})();
