const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const appPath = path.join(root, 'src', 'App.jsx');
const cssPath = path.join(root, 'src', 'styles.css');

let app = fs.readFileSync(appPath, 'utf8');

app = app
  .replace('const APP_VERSION = "0.14.0";', 'const APP_VERSION = "0.15.0";')
  .replace('const APP_VERSION = "0.13.0";', 'const APP_VERSION = "0.15.0";');

const openingAnchor = '  const style = opening.style || (opening.type === "door" ? "single" : "fixed");\n\n  if (opening.type === "window") {';
const garage3D = `  const style = opening.style || (opening.type === "door" ? "single" : "fixed");\n\n  if (opening.type === "door" && style === "garage") {\n    const panelCount = 4;\n    const panelHeight = height / panelCount;\n    const panelGap = Math.max(0.006, panelHeight * 0.025);\n    return (\n      <group position={[ftToM(centerFt), height / 2, 0]}>\n        <FurnitureBox size={[trim, height + trim, frameDepth]} position={[-width / 2, 0, 0]} color=\"#d6d3d1\" />\n        <FurnitureBox size={[trim, height + trim, frameDepth]} position={[width / 2, 0, 0]} color=\"#d6d3d1\" />\n        <FurnitureBox size={[width + trim, trim, frameDepth]} position={[0, height / 2, 0]} color=\"#d6d3d1\" />\n        {Array.from({ length: panelCount }, (_, index) => {\n          const y = -height / 2 + panelHeight * (index + 0.5);\n          return (\n            <FurnitureBox\n              key={\`garage-panel-\${index}\`}\n              size={[Math.max(0.02, width - trim * 1.5), Math.max(0.02, panelHeight - panelGap), Math.max(0.025, thickM * 0.2)]}\n              position={[0, y, 0]}\n              color={index === panelCount - 1 ? \"#cbd5e1\" : \"#dbe4ea\"}\n            />\n          );\n        })}\n        <FurnitureBox size={[Math.max(0.018, trim * .45), height * .96, frameDepth * .42]} position={[0, 0, frameDepth * .08]} color=\"#94a3b8\" />\n      </group>\n    );\n  }\n\n  if (opening.type === "window") {`;

if (!app.includes('garage-panel-${index}')) {
  if (!app.includes(openingAnchor)) throw new Error('v0.15 opening 3D target missing');
  app = app.replace(openingAnchor, garage3D);
}

fs.writeFileSync(appPath, app);

let css = fs.readFileSync(cssPath, 'utf8');
const marker = '/* v0.15.0 — sectional garage-door 3D rendering */';
if (!css.includes(marker)) {
  css += `\n${marker}\n.architectural-opening.style-garage { cursor: pointer; }\n.architectural-opening.style-garage .garage-door-panel { stroke-linecap: square; }\n`;
}
fs.writeFileSync(cssPath, css);

console.log('Applied Blueprint 3D Studio v0.15.0 upgrade.');
