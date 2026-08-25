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

// Remove only the visible AI Kitchen Layout toolbar button. Dormant kitchen
// generator code may still contain the same label internally and is intentionally
// preserved so wall-detection work does not risk unrelated regressions.
const labelIndex = app.indexOf('AI Kitchen Layout');
if (labelIndex >= 0) {
  const buttonStart = app.lastIndexOf('<button', labelIndex);
  const buttonEnd = app.indexOf('</button>', labelIndex);
  if (buttonStart >= 0 && buttonEnd >= 0) {
    app = app.slice(0, buttonStart) + app.slice(buttonEnd + '</button>'.length);
  }
}

fs.writeFileSync(appPath, app);

let css = fs.readFileSync(cssPath, 'utf8');
const marker = '/* v0.21.0 — AI Kitchen Layout removed from toolbar */';
if (!css.includes(marker)) css += `\n${marker}\n`;
fs.writeFileSync(cssPath, css);

console.log('Applied Blueprint 3D Studio v0.21.0: AI Kitchen Layout removed from toolbar.');
