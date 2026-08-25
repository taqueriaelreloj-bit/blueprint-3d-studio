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
  ['version', 'const APP_VERSION = "0.22.0";'],
  ['centralized history import', 'from "./projectHistory.js"'],
  ['all-line overlay state', 'showDetectedLines'],
  ['AI wall overlay data', 'walls: result.walls'],
  ['AI source trace overlay', 'ai-wall-trace'],
  ['9 ft garage door', 'garage-door-9'],
  ['16 ft garage door', 'garage-door-16'],
  ['18 ft garage door', 'garage-door-18'],
  ['sectional garage 3D', 'garage-panel-${index}'],
  ['global undo', 'function undo()'],
  ['global redo', 'function redo()'],
  ['3D wall opening continuity', 'key: `above-${o.id}`'],
  ['v0.20 short segment threshold', 'Math.max(8, Math.round(Math.min(width, height) * 0.010))'],
  ['v0.20 merge gap', 'estimatedPxPerFt * 2.25'],
  ['v0.20 consolidation tolerance', 'estimatedPxPerFt * 0.18'],
  ['v0.20 centerline guard', 'const centerDelta = Math.abs(group.p - line.p);'],
  ['v0.18 automatic threshold', 'line.confidence >= 0.50 ||'],
  ['v0.17 clear threshold', 'const classification = confidence >= 0.88'],
  ['v0.17 possible threshold', 'confidence >= 0.36'],
];

for (const [label, marker] of requiredAppMarkers) {
  if (!app.includes(marker)) fail(`${label} marker is missing.`);
}

// The actual rendered toolbar is verified by Playwright. Dormant kitchen code
// can legitimately retain the old label without exposing a toolbar button.
if (!css.includes('v0.14.0 — pre-classification line-strengthening overlay')) fail('v0.14 detected-line overlay styles are missing.');
if (!css.includes('v0.15.0 — sectional garage-door 3D rendering')) fail('v0.15 garage-door styles are missing.');
if (!css.includes('v0.17.0 — residential plan wall recovery')) fail('v0.17 wall recovery marker is missing.');
if (!css.includes('v0.19.0 — AI wall trace directly over source blueprint')) fail('v0.19 source wall trace styles are missing.');
if (!css.includes('v0.20.0 — manual-ground-truth wall centerline fidelity')) fail('v0.20 wall fidelity marker is missing.');
if (!css.includes('v0.21.0 — AI Kitchen Layout removed from toolbar')) fail('v0.21 AI Kitchen removal marker is missing.');
if (!css.includes('v0.22.0 — centralized project history module')) fail('v0.22 centralized history marker is missing.');

const openingContinuityChecks = [
  'if (o.type === "window")',
  'bottomFt: topOfWindow',
  'bottomFt: o.heightFt',
  'topFt: effectiveWallHeightFt',
];
for (const marker of openingContinuityChecks) {
  if (!app.includes(marker)) fail(`wall opening continuity marker missing: ${marker}`);
}

console.log('Blueprint 3D Studio v0.22.0 source validation PASSED.');
console.log(`App.jsx: ${app.length} characters`);
console.log(`styles.css: ${css.length} characters`);
