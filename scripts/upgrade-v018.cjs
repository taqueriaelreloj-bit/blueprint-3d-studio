const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const appPath = path.join(root, 'src', 'App.jsx');

function replaceOnce(text, from, to, label) {
  if (text.includes(to)) return text;
  if (!text.includes(from)) throw new Error(`v0.18 patch target missing: ${label}`);
  return text.replace(from, to);
}

let app = fs.readFileSync(appPath, 'utf8');
app = replaceOnce(app, 'const APP_VERSION = "0.17.0";', 'const APP_VERSION = "0.18.0";', 'version');
app = replaceOnce(
  app,
  '  const minLength = Math.max(52, Math.round(Math.min(width, height) * 0.055));',
  '  const minLength = Math.max(18, Math.round(Math.min(width, height) * 0.020));',
  'minimum wall segment length'
);
app = app.replaceAll('extractDarkRuns(values, minLength)', 'extractDarkRuns(values, minLength, 4)');
app = app.replaceAll('.filter((edge) => edge.thickness <= 9);', '.filter((edge) => edge.thickness <= 14);');
app = replaceOnce(
  app,
  '      if (overlap < minOverlap || overlap < shorter * 0.65) continue;',
  '      if (overlap < minOverlap || overlap < shorter * 0.45) continue;',
  'parallel edge overlap tolerance'
);
app = replaceOnce(
  app,
  '    item.thicknessScore >= 0.58 && (item.text.dimension < 0.45 || strongStructuralGeometry[index])',
  '    item.thicknessScore >= 0.48 && (item.text.dimension < 0.45 || strongStructuralGeometry[index])',
  'network eligibility'
);
app = replaceOnce(
  app,
  '      line.confidence >= 0.58 ||',
  '      line.confidence >= 0.50 ||',
  'automatic confidence threshold'
);
app = replaceOnce(
  app,
  '(line.thicknessScore >= 0.58 &&',
  '(line.thicknessScore >= 0.50 &&',
  'automatic thickness threshold'
);

fs.writeFileSync(appPath, app);
console.log('Applied Blueprint 3D Studio v0.18.0 fine wall-segment detector upgrade.');
