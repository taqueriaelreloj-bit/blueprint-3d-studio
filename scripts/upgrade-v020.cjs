const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const appPath = path.join(root, 'src', 'App.jsx');
const cssPath = path.join(root, 'src', 'styles.css');

function replaceOnce(text, from, to, label) {
  if (text.includes(to)) return text;
  if (!text.includes(from)) throw new Error(`v0.20 patch target missing: ${label}`);
  return text.replace(from, to);
}

let app = fs.readFileSync(appPath, 'utf8');
app = replaceOnce(app, 'const APP_VERSION = "0.19.0";', 'const APP_VERSION = "0.20.0";', 'version');

// Ground-truth fidelity tuning from the manually traced Maricopa plan.
// Preserve short wall stubs instead of dropping them before classification.
app = replaceOnce(
  app,
  '  const minLength = Math.max(18, Math.round(Math.min(width, height) * 0.020));',
  '  const minLength = Math.max(8, Math.round(Math.min(width, height) * 0.010));',
  'short wall segment threshold'
);

// Do not bridge unrelated collinear walls across entire rooms. Most legitimate
// door/opening interruptions are much smaller than the previous four-foot span.
app = replaceOnce(
  app,
  '  const mergeGap = clamp(estimatedPxPerFt * 4, 48, 140);',
  '  const mergeGap = clamp(estimatedPxPerFt * 2.25, 30, 84);',
  'pre-classification collinear merge gap'
);

// Consolidation previously allowed nearby parallel walls to collapse together,
// moving the final centerline away from the actual wall center. Tighten both
// lateral and longitudinal grouping using the calibrated plan scale.
app = replaceOnce(
  app,
  '  const maxGap = estimatedPxPerFt * 5.2;',
  '  const maxGap = estimatedPxPerFt * 3.4;',
  'structural consolidation max gap'
);
app = replaceOnce(
  app,
  '  const positionTolerance = estimatedPxPerFt * 0.35;',
  '  const positionTolerance = estimatedPxPerFt * 0.18;',
  'structural consolidation centerline tolerance'
);

// Avoid centerline drift when several fragments are merged. Keep the position
// of the longer supporting fragment unless the two centers are essentially the
// same line, in which case a length-weighted average is safe.
app = replaceOnce(
  app,
  '      group.p = (group.p * groupLength + line.p * lineLength) / (groupLength + lineLength);',
  `      const centerDelta = Math.abs(group.p - line.p);\n      if (centerDelta <= estimatedPxPerFt * 0.08) {\n        group.p = (group.p * groupLength + line.p * lineLength) / (groupLength + lineLength);\n      } else if (lineLength > groupLength) {\n        group.p = line.p;\n      }`,
  'centerline drift guard'
);

// The manual ground truth contains many short but connected partition returns.
// Give a small structural credit to connected short lines rather than requiring
// length itself to provide confidence.
app = replaceOnce(
  app,
  '    const lengthScore = clamp((lengthFt - 2) / 12, 0, 1);',
  '    const lengthScore = clamp((lengthFt - 1) / 10, 0, 1);',
  'short structural length score'
);

fs.writeFileSync(appPath, app);

let css = fs.readFileSync(cssPath, 'utf8');
const marker = '/* v0.20.0 — manual-ground-truth wall centerline fidelity */';
if (!css.includes(marker)) css += `\n${marker}\n`;
fs.writeFileSync(cssPath, css);
console.log('Applied Blueprint 3D Studio v0.20.0 ground-truth wall fidelity upgrade.');
