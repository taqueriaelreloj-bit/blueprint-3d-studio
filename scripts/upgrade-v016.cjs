const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const appPath = path.join(root, 'src', 'App.jsx');

let app = fs.readFileSync(appPath, 'utf8');
app = app
  .replace('const APP_VERSION = "0.15.0";', 'const APP_VERSION = "0.16.0";')
  .replace('const APP_VERSION = "0.14.0";', 'const APP_VERSION = "0.16.0";');

const garageSet = `  { id: "garage-door-9", group: "Doors", label: "Garage Door 9'", shortLabel: "Garage 9'", type: "door", style: "garage", widthFt: 9, heightFt: 7, icon: "garage-door" },\n  { id: "garage-door-16", group: "Doors", label: "Double Garage Door 16'", shortLabel: "Garage 16'", type: "door", style: "garage", widthFt: 16, heightFt: 7, icon: "garage-door" },\n  { id: "garage-door-18", group: "Doors", label: "Double Garage Door 18'", shortLabel: "Garage 18'", type: "door", style: "garage", widthFt: 18, heightFt: 7, icon: "garage-door" },`;

if (!app.includes('garage-door-9')) {
  const target = /^\s*\{ id: "garage-door-16"[^\n]*$/m;
  if (!target.test(app)) throw new Error('v0.16 garage catalog target missing');
  app = app.replace(target, garageSet);
}

fs.writeFileSync(appPath, app);
console.log('Applied Blueprint 3D Studio v0.16.0 upgrade.');
