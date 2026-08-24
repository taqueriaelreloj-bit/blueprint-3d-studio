const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const appPath = path.join(root, 'src', 'App.jsx');
const cssPath = path.join(root, 'src', 'styles.css');

function replaceOnce(text, from, to, label) {
  if (text.includes(to)) return text;
  if (!text.includes(from)) throw new Error(`v0.14 patch target missing: ${label}`);
  return text.replace(from, to);
}

let app = fs.readFileSync(appPath, 'utf8');
app = replaceOnce(app, 'const APP_VERSION = "0.13.0";', 'const APP_VERSION = "0.14.0";', 'version');
app = replaceOnce(app,
  '  { id: "cased-opening", group: "Doors", label: "Cased Opening", shortLabel: "Opening", type: "door", style: "cased", widthFt: 3, heightFt: 7, icon: "opening" },',
  '  { id: "cased-opening", group: "Doors", label: "Cased Opening", shortLabel: "Opening", type: "door", style: "cased", widthFt: 3, heightFt: 7, icon: "opening" },\n  { id: "garage-door-16", group: "Doors", label: "Double Garage Door 16\\\'", shortLabel: "Garage 16\\\'", type: "door", style: "garage", widthFt: 16, heightFt: 7, icon: "garage-door" },',
  'garage door catalog');
app = replaceOnce(app,
  '  const [showPossibleWalls, setShowPossibleWalls] = useState(false);',
  '  const [showPossibleWalls, setShowPossibleWalls] = useState(false);\n  const [showDetectedLines, setShowDetectedLines] = useState(true);',
  'detected-line state');
app = replaceOnce(app,
  '        setWallAnalysis(result ? {\n          ...result.analysis,\n          possibleWalls: result.possibleWalls,',
  '        setWallAnalysis(result ? {\n          ...result.analysis,\n          candidates: result.candidates,\n          possibleWalls: result.possibleWalls,',
  'candidate storage');
app = replaceOnce(app,
`        ) : item.style === "cased" ? null : (
          <>
            <line className="catalog-leaf" x1="18" y1="8" x2="18" y2="36" />
            <path className="catalog-swing" d="M46 8 A28 28 0 0 1 18 36" />
          </>
        )`,
`        ) : item.style === "garage" ? (
          <>
            <rect className="catalog-window-elevation" x="17" y="18" width="30" height="24" rx="1" />
            <line className="catalog-mullion" x1="17" y1="26" x2="47" y2="26" />
            <line className="catalog-mullion" x1="17" y1="34" x2="47" y2="34" />
          </>
        ) : item.style === "cased" ? null : (
          <>
            <line className="catalog-leaf" x1="18" y1="8" x2="18" y2="36" />
            <path className="catalog-swing" d="M46 8 A28 28 0 0 1 18 36" />
          </>
        )`, 'garage catalog icon');
app = replaceOnce(app,
`      {opening.type === "window" && (
        <>`,
`      {opening.type === "door" && style === "garage" && (
        <>
          <line className="garage-door-panel" x1={-half} y1="-4" x2={half} y2="-4" />
          <line className="garage-door-panel" x1={-half} y1="0" x2={half} y2="0" />
          <line className="garage-door-panel" x1={-half} y1="4" x2={half} y2="4" />
          <line className="garage-door-center" x1="0" y1="-7" x2="0" y2="7" />
        </>
      )}

      {opening.type === "window" && (
        <>`, 'garage opening symbol');
app = replaceOnce(app,
`                  {showPossibleWalls && (wallAnalysis?.possibleWalls || []).map((candidate) => (`,
`                  {showDetectedLines && (wallAnalysis?.candidates || []).map((candidate, index) => {
                    const a = candidate.orientation === "horizontal"
                      ? { x: candidate.a, y: candidate.p }
                      : { x: candidate.p, y: candidate.a };
                    const b = candidate.orientation === "horizontal"
                      ? { x: candidate.b, y: candidate.p }
                      : { x: candidate.p, y: candidate.b };
                    return (
                      <line
                        key={\`detected-\${index}\`}
                        x1={a.x}
                        y1={a.y}
                        x2={b.x}
                        y2={b.y}
                        className={\`detected-line classification-\${candidate.classification || "unknown"}\`}
                      >
                        <title>{\`Detected line — \${candidate.classification || "unclassified"} — \${candidate.confidencePercent ?? Math.round((candidate.confidence || 0) * 100)}%\`}</title>
                      </line>
                    );
                  })}

                  {showPossibleWalls && (wallAnalysis?.possibleWalls || []).map((candidate) => (`, 'all-line overlay');
app = replaceOnce(app,
  '<span className={autoBuildBusy || wallAnalysis ? "done" : ""}>Analyze line types</span>',
  '<span className={autoBuildBusy || wallAnalysis ? "done" : ""}>Detect + strengthen all lines</span>',
  'workflow detection label');
app = replaceOnce(app,
  '<span className={wallAnalysis ? "done" : ""}>Reject dimensions</span>',
  '<span className={wallAnalysis ? "done" : ""}>Classify / reject dimensions</span>',
  'workflow classification label');
app = replaceOnce(app,
  '                <p className="analysis-rule"><strong>Measurements help verify scale and length; their lines never become walls.</strong></p>',
`                <p className="analysis-rule"><strong>Every detected line is strengthened first. Classification happens after detection, so wall geometry is not confused with measurement lines.</strong></p>
                <button
                  className={showDetectedLines ? "possible-toggle active" : "possible-toggle"}
                  onClick={() => setShowDetectedLines((current) => !current)}
                >
                  {showDetectedLines ? "Hide" : "Show"} All Detected Lines ({wallAnalysis.totalCandidates})
                </button>
                <p className="measurement-help">Black/gray overlay = raw detected geometry. Green/purple walls are the structural model after classification.</p>`, 'classifier controls');
app = app.replace('setStatus(`Loaded ${file.name}. AI Auto Build is analyzing the blueprint...`);', 'setStatus(`Loaded ${file.name}. Detecting and strengthening every line before wall classification...`);');
app = app.replace('? "AI Auto Build is detecting wall geometry and building the 3D model..."', '? "AI Auto Build is detecting and strengthening every line, then classifying structural walls..."');
fs.writeFileSync(appPath, app);

let css = fs.readFileSync(cssPath, 'utf8');
const marker = '/* v0.14.0 — pre-classification line-strengthening overlay */';
if (!css.includes(marker)) {
  css += `\n${marker}\n.drawing-overlay line.detected-line {\n  stroke: rgba(15, 23, 42, .78);\n  stroke-width: 2.8;\n  vector-effect: non-scaling-stroke;\n  pointer-events: none;\n}\n.drawing-overlay line.detected-line.classification-dimension,\n.drawing-overlay line.detected-line.classification-annotation,\n.drawing-overlay line.detected-line.classification-rejected-geometry {\n  stroke: rgba(71, 85, 105, .52);\n  stroke-width: 2.2;\n}\n.drawing-overlay line.detected-line.classification-wall-clear,\n.drawing-overlay line.detected-line.classification-wall-review,\n.drawing-overlay line.detected-line.classification-possible {\n  stroke: rgba(15, 23, 42, .9);\n  stroke-width: 3.4;\n}\n.architectural-opening.style-garage .garage-door-panel,\n.architectural-opening.style-garage .garage-door-center {\n  stroke: #0f172a;\n  stroke-width: 2;\n  vector-effect: non-scaling-stroke;\n}\n`;
}
fs.writeFileSync(cssPath, css);
console.log('Applied Blueprint 3D Studio v0.14.0 upgrade.');
