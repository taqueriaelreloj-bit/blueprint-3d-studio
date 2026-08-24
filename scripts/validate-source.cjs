const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const appPath = path.join(root, 'src', 'App.jsx');
const cssPath = path.join(root, 'src', 'styles.css');

function fail(message) {
  console.error(`VALIDATION FAILED: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(appPath)) fail('src/App.jsx is missing.');
if (!fs.existsSync(cssPath)) fail('src/styles.css is missing.');

const app = fs.readFileSync(appPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');

const requiredAppMarkers = [
  ['version', 'const APP_VERSION = "0.16.0";'],
  ['all-line overlay state', 'showDetectedLines'],
  ['9 ft garage door', 'garage-door-9'],
  ['16 ft garage door', 'garage-door-16'],
  ['18 ft garage door', 'garage-door-18'],
  ['sectional garage 3D', 'garage-panel-${index}'],
  ['global undo', 'function undo()'],
  ['global redo', 'function redo()'],
  ['3D wall opening continuity', 'key: `above-${o.id}`'],
];

for (const [label, marker] of requiredAppMarkers) {
  if (!app.includes(marker)) fail(`${label} marker is missing.`);
}

if (!css.includes('v0.14.0 — pre-classification line-strengthening overlay')) {
  fail('v0.14 detected-line overlay styles are missing.');
}
if (!css.includes('v0.15.0 — sectional garage-door 3D rendering')) {
  fail('v0.15 garage-door styles are missing.');
}

const openingContinuityChecks = [
  'if (o.type === "window")',
  'bottomFt: topOfWindow',
  'bottomFt: o.heightFt',
  'topFt: effectiveWallHeightFt',
];
for (const marker of openingContinuityChecks) {
  if (!app.includes(marker)) fail(`wall opening continuity marker missing: ${marker}`);
}

console.log('Blueprint 3D Studio v0.16.0 source validation PASSED.');
console.log(`App.jsx: ${app.length} characters`);
console.log(`styles.css: ${css.length} characters`);
