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

// Remove only a real JSX button whose own markup contains the label.
// Other dormant kitchen code may legitimately contain the same string.
let searchFrom = 0;
let removedToolbarButton = false;
while (searchFrom < app.length) {
  const labelIndex = app.indexOf('AI Kitchen Layout', searchFrom);
  if (labelIndex < 0) break;

  const buttonStart = app.lastIndexOf('<button', labelIndex);
  const buttonEnd = app.indexOf('</button>', labelIndex);
  const validButton =
    buttonStart >= 0 &&
    buttonEnd >= labelIndex &&
    labelIndex - buttonStart <= 900 &&
    buttonEnd + '</button>'.length - buttonStart <= 1800;

  if (validButton) {
    app = app.slice(0, buttonStart) + app.slice(buttonEnd + '</button>'.length);
    removedToolbarButton = true;
    break;
  }

  searchFrom = labelIndex + 'AI Kitchen Layout'.length;
}

if (!removedToolbarButton) {
  console.log('AI Kitchen Layout toolbar button was already absent; no UI removal needed.');
}

fs.writeFileSync(appPath, app);

let css = fs.readFileSync(cssPath, 'utf8');
const marker = '/* v0.21.0 — AI Kitchen Layout removed from toolbar */';
if (!css.includes(marker)) css += `\n${marker}\n`;
fs.writeFileSync(cssPath, css);

console.log('Applied Blueprint 3D Studio v0.21.0: AI Kitchen Layout removed from toolbar.');
