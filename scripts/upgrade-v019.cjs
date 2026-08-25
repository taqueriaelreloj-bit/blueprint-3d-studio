const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const appPath = path.join(root, 'src', 'App.jsx');
const cssPath = path.join(root, 'src', 'styles.css');

function replaceOnce(text, from, to, label) {
  if (text.includes(to)) return text;
  if (!text.includes(from)) throw new Error(`v0.19 patch target missing: ${label}`);
  return text.replace(from, to);
}

let app = fs.readFileSync(appPath, 'utf8');
app = replaceOnce(app, 'const APP_VERSION = "0.18.0";', 'const APP_VERSION = "0.19.0";', 'version');

app = replaceOnce(
  app,
  '          candidates: result.candidates,\n          possibleWalls: result.possibleWalls,',
  '          candidates: result.candidates,\n          walls: result.walls,\n          possibleWalls: result.possibleWalls,',
  'store accepted walls for source overlay'
);

const detectedOverlayMarker = '                  {showDetectedLines && (wallAnalysis?.candidates || []).map((candidate, index) => {';
const wallTraceOverlay = `                  {(wallAnalysis?.walls || []).map((wall, index) => (\n                    <line\n                      key={\`ai-wall-trace-\${wall.id || index}\`}\n                      x1={wall.a.x}\n                      y1={wall.a.y}\n                      x2={wall.b.x}\n                      y2={wall.b.y}\n                      className={\`ai-wall-trace \${wall.reviewRequired ? "review" : "accepted"}\`}\n                    >\n                      <title>{\`AI wall trace — \${wall.confidencePercent ?? Math.round((wall.confidence || 0) * 100)}%\`}</title>\n                    </line>\n                  ))}\n\n${detectedOverlayMarker}`;
app = replaceOnce(app, detectedOverlayMarker, wallTraceOverlay, 'AI wall source trace overlay');

fs.writeFileSync(appPath, app);

let css = fs.readFileSync(cssPath, 'utf8');
const marker = '/* v0.19.0 — AI wall trace directly over source blueprint */';
if (!css.includes(marker)) {
  css += `\n${marker}\n.drawing-overlay line.ai-wall-trace {\n  fill: none;\n  stroke: #f59e0b;\n  stroke-width: 4.2;\n  stroke-dasharray: 9 6;\n  stroke-linecap: round;\n  vector-effect: non-scaling-stroke;\n  pointer-events: none;\n  opacity: .96;\n}\n.drawing-overlay line.ai-wall-trace.review {\n  stroke: #a855f7;\n  stroke-width: 3.8;\n  stroke-dasharray: 8 6;\n  opacity: .92;\n}\n`;
}
fs.writeFileSync(cssPath, css);
console.log('Applied Blueprint 3D Studio v0.19.0 source-overlay wall tracing upgrade.');
