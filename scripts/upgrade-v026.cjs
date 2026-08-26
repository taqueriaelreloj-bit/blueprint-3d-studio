const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const appPath = path.join(root, "src", "App.jsx");
const cssPath = path.join(root, "src", "styles.css");
let app = fs.readFileSync(appPath, "utf8");

function replaceRequired(from, to, label) {
  if (!app.includes(from)) throw new Error(`v0.26 patch target missing: ${label}`);
  app = app.replace(from, to);
}

replaceRequired('const APP_VERSION = "0.25.0";', 'const APP_VERSION = "0.26.0";', "version");
replaceRequired('useState("Upload a blueprint PDF to begin.")', 'useState("Start a blank design or optionally import a blueprint.")', "initial status");
replaceRequired("  function pointerFromEvent(e) {", `  function startBlankDesign() {
    if (projectSnapshotHasContent(projectSnapshot) && !window.confirm("Start a new blank design? Unsaved project changes will be replaced.")) return;
    setPdfDoc(null);
    setFileName("Untitled Design");
    setPageSize({ width: 1200, height: 800 });
    setPageNumber(1);
    setPageCount(1);
    setPxPerFt(20);
    setScaleSource("manual");
    setWalls([]);
    setOpenings([]);
    setPlacedObjects([]);
    setRoomNames({});
    setRoomTypes({});
    setRoomMaterials({});
    setWallAnalysis(null);
    setSelectedWallId(null);
    setSelectedOpeningId(null);
    setSelectedObjectId(null);
    setDraftStart(null);
    setModelView("2d");
    setModelLayout("normal");
    setActiveDesignSection("build");
    setDesignDrawerOpen(true);
    setMode("draw");
    setStatus("Blank design ready at 20 px/ft. Draw the first wall or choose a room tool from the Design Library.");
  }

  function pointerFromEvent(e) {`, "blank design action");
replaceRequired(`        <label className="upload-button">
          Upload Blueprint PDF
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => loadPdf(e.target.files?.[0])}
          />
        </label>`, `        <div className="design-start-actions">
          <button className="new-design-button" onClick={startBlankDesign}>＋ New Design</button>
          <details className="import-scan-menu">
            <summary>Import / Scan ▾</summary>
            <div className="import-scan-popover">
              <strong>Optional blueprint workflow</strong>
              <span>Import a PDF only when you want AI-assisted tracing.</span>
              <label className="upload-button">
                Import Blueprint PDF
                <input type="file" accept="application/pdf" onChange={(e) => loadPdf(e.target.files?.[0])} />
              </label>
              <button className="ai-button" onClick={() => runAutoBuild()} disabled={!pdfDoc || autoBuildBusy}>
                {autoBuildBusy ? "Analyzing..." : "AI Auto Build"}
              </button>
            </div>
          </details>
        </div>`, "design-first header");
const toolbarStart = app.indexOf('<section className="toolbar">');
const toolbarScanStart = app.indexOf('<button className="ai-button" onClick={() => runAutoBuild()} disabled={!pdfDoc || autoBuildBusy}>', toolbarStart);
if (toolbarStart < 0 || toolbarScanStart < 0) throw new Error("v0.26 patch target missing: toolbar scan");
app = `${app.slice(0, toolbarScanStart)}{false && ${app.slice(toolbarScanStart)}`;
const hiddenScanStart = toolbarScanStart;
const hiddenScanEnd = app.indexOf('</button>', hiddenScanStart);
if (hiddenScanStart < 0 || hiddenScanEnd < 0) throw new Error("v0.26 patch target missing: hidden scan close");
app = `${app.slice(0, hiddenScanEnd)}</button>}${app.slice(hiddenScanEnd + 9)}`;
replaceRequired('disabled={!pdfDoc || !pxPerFt}', 'disabled={!pageSize.width || !pxPerFt}', "blank wall drawing");
replaceRequired('<strong>Blueprint / 2D Editor</strong>', '<strong>2D Design Editor</strong>', "editor title");
replaceRequired('{pdfDoc ? `Page ${pageNumber} of ${pageCount} • Ctrl + wheel also zooms` : "Upload a PDF"}', '{pdfDoc ? `Imported blueprint • Page ${pageNumber} of ${pageCount}` : pageSize.width ? "Blank design canvas" : "Create a design or optionally import a blueprint"}', "editor subtitle");
replaceRequired('{!pdfDoc && (', '{!pdfDoc && !pageSize.width && (', "empty state condition");
replaceRequired(`<div className="empty-icon">PDF</div>
                <h2>Upload a floor plan</h2>
                <p>Upload a floor plan. AI Auto Build creates the first model, then you review and edit it.</p>`, `<div className="empty-icon">3D</div>
                <h2>Start designing</h2>
                <p>Create a blank project and draw freely. Blueprint scanning is available from the optional Import / Scan submenu.</p>
                <button className="primary" onClick={startBlankDesign}>Create Blank Design</button>`, "design empty state");
replaceRequired('{pdfDoc && (\n              <div\n                className="blueprint-stage"', '{Boolean(pageSize.width) && (\n              <div\n                className="blueprint-stage"', "blank stage");
replaceRequired('<canvas ref={pdfCanvasRef} className="pdf-canvas" />', '{pdfDoc && <canvas ref={pdfCanvasRef} className="pdf-canvas" />}', "optional PDF canvas");
fs.writeFileSync(appPath, app);

let css = fs.readFileSync(cssPath, "utf8");
css += `
/* v0.26.0 — design-first project entry */
.design-start-actions { display:flex; align-items:center; gap:10px; }
.new-design-button { background:#2563eb; color:#fff; border-color:#60a5fa; font-weight:800; }
.import-scan-menu { position:relative; }
.import-scan-menu summary { list-style:none; cursor:pointer; padding:10px 14px; border:1px solid #475569; border-radius:8px; font-weight:700; }
.import-scan-popover { position:absolute; z-index:50; right:0; top:calc(100% + 8px); width:270px; padding:14px; border:1px solid #475569; border-radius:10px; background:#0f172a; box-shadow:0 18px 45px #020617aa; display:grid; gap:10px; }
.import-scan-popover span { color:#cbd5e1; font-size:.82rem; line-height:1.35; }
`;
fs.writeFileSync(cssPath, css);
console.log("Applied Blueprint 3D Studio v0.26.0 design-first entry upgrade.");
