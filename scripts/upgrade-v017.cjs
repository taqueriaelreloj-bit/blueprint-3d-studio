const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const appPath = path.join(root, 'src', 'App.jsx');
const cssPath = path.join(root, 'src', 'styles.css');

let app = fs.readFileSync(appPath, 'utf8');

function replaceRequired(from, to, label) {
  if (app.includes(to)) return;
  if (!app.includes(from)) throw new Error(`v0.17 patch target missing: ${label}`);
  app = app.replace(from, to);
}

replaceRequired('const APP_VERSION = "0.16.0";', 'const APP_VERSION = "0.17.0";', 'version');

// Real residential plans often fragment wall pairs around doors, fixtures and text.
// Reduce penalties that were causing connected structural candidates to be rejected.
replaceRequired('if (isolated) confidence -= 0.22;', 'if (isolated) confidence -= 0.10;', 'isolated penalty');
replaceRequired('if (!inStructuralNetwork) confidence -= 0.07;', 'if (!inStructuralNetwork) confidence -= 0.03;', 'network penalty');
replaceRequired('confidence -= item.text.dimension * (strongStructuralGeometry[index] ? 0.26 : 0.84);', 'confidence -= item.text.dimension * (strongStructuralGeometry[index] ? 0.12 : 0.78);', 'dimension penalty');
replaceRequired('if (dimensionExtensions[index]) confidence -= 0.76;', 'if (dimensionExtensions[index]) confidence -= strongStructuralGeometry[index] ? 0.34 : 0.68;', 'dimension extension penalty');
replaceRequired('if (item.thicknessScore < 0.45) confidence -= 0.22;', 'if (item.thicknessScore < 0.45) confidence -= 0.12;', 'thin geometry penalty');

// Admit connected / double-line wall geometry at a lower threshold while still excluding
// obvious dimension extensions and geometry outside the building envelope.
replaceRequired(
  'classification.classified.filter((line) => line.confidence >= 0.7),',
  `classification.classified.filter((line) => (\n      line.confidence >= 0.58 ||\n      (line.thicknessScore >= 0.58 &&\n       ((line.stats?.connections || 0) > 0 || line.inMainNetwork) &&\n       !line.dimensionExtension &&\n       !line.outsideEnvelope &&\n       line.classification !== "dimension" &&\n       line.classification !== "annotation")\n    )),`,
  'automatic structural threshold'
);

// Make the review band useful for floor plans where wall segments are interrupted by openings.
replaceRequired(
`    const classification = confidence >= 0.9
      ? "wall-clear"
      : confidence >= 0.7
        ? "wall-review"`,
`    const classification = confidence >= 0.88
      ? "wall-clear"
      : confidence >= 0.58
        ? "wall-review"`,
  'classification thresholds'
);
replaceRequired(': confidence >= 0.45\n              ? "possible"', ': confidence >= 0.36\n              ? "possible"', 'possible threshold');

// Preserve more fragmented exterior wall evidence before consolidation.
replaceRequired('if (coverage < 0.52 || !reachesStart || !reachesEnd) return;', 'if (coverage < 0.42 || (!reachesStart && !reachesEnd)) return;', 'perimeter recovery coverage');
replaceRequired('line.thicknessScore >= 0.45 &&', 'line.thicknessScore >= 0.38 &&', 'perimeter thickness');

// Review/clear labels now match v0.17 thresholds.
app = app.replaceAll('line.confidence >= 0.9 ? "clear" : "review"', 'line.confidence >= 0.88 ? "clear" : "review"');
app = app.replaceAll('line.confidence < 0.9', 'line.confidence < 0.88');
app = app.replaceAll('walls.filter((wall) => wall.confidence >= 0.9)', 'walls.filter((wall) => wall.confidence >= 0.88)');
app = app.replaceAll('confidence >= 0.9 ? "wall-clear" : "wall-review"', 'confidence >= 0.88 ? "wall-clear" : "wall-review"');
app = app.replaceAll('confidence < 0.9,', 'confidence < 0.88,');

// Improve user feedback so the detector is treated as a draft rather than silently rejecting geometry.
app = app.replace(
  '"Dimensions were used only as reference evidence, never as 3D geometry."',
  '"Connected double-line geometry is recovered as an editable wall draft; dimensions remain reference-only."'
);

fs.writeFileSync(appPath, app);

let css = fs.readFileSync(cssPath, 'utf8');
const marker = '/* v0.17.0 — residential plan wall recovery */';
if (!css.includes(marker)) css += `\n${marker}\n`;
fs.writeFileSync(cssPath, css);

console.log('Applied Blueprint 3D Studio v0.17.0 wall detector recovery upgrade.');
