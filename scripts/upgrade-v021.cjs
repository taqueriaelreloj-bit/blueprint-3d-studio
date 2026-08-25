const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const appPath = path.join(root, 'src', 'App.jsx');
const cssPath = path.join(root, 'src', 'styles.css');

let app = fs.readFileSync(appPath, 'utf8');

if (!app.includes('const APP_VERSION = "0.21.0";')) {
  if (!app.includes('const APP_VERSION = "0.20.0";')) {
    throw new Error('v0.21 patch target missing: version');
  }
  app = app.replace('const APP_VERSION = "0.20.0";', 'const APP_VERSION = "0.21.0";');
}

// Remove the AI Kitchen Layout command from the main toolbar. The kitchen
// generator code is intentionally left dormant for now so this change is safe
// and reversible while wall detection remains the active development focus.
if (app.includes('AI Kitchen Layout')) {
  const labelIndex = app.indexOf('AI Kitchen Layout');
  const buttonStart = app.lastIndexOf('<button', labelIndex);
  const buttonEnd = app.indexOf('</button>', labelIndex);
  if (buttonStart < 0 || buttonEnd < 0) {
    throw new Error('v0.21 patch target missing: AI Kitchen Layout button bounds');
  }
  app = app.slice(0, buttonStart) + app.slice(buttonEnd + '</button>'.length);
}

if (app.includes('AI Kitchen Layout')) {
  throw new Error('v0.21 failed to remove AI Kitchen Layout UI');
}

fs.writeFileSync(appPath, app);

let css = fs.readFileSync(cssPath, 'utf8');
const marker = '/* v0.21.0 — AI Kitchen Layout removed from toolbar */';
if (!css.includes(marker)) css += `\n${marker}\n`;
fs.writeFileSync(cssPath, css);

console.log('Applied Blueprint 3D Studio v0.21.0: AI Kitchen Layout removed from toolbar.');
