const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const appPath = path.join(root, "src", "App.jsx");
const cssPath = path.join(root, "src", "styles.css");

function replaceRequired(text, from, to, label) {
  if (!text.includes(from)) throw new Error(`v0.23 patch target missing: ${label}`);
  return text.replace(from, to);
}

let app = fs.readFileSync(appPath, "utf8");
app = replaceRequired(app, 'const APP_VERSION = "0.22.0";', 'const APP_VERSION = "0.23.0";', "version");
app = replaceRequired(
  app,
  'import { appendHistorySnapshot, stepProjectHistoryRedo, stepProjectHistoryUndo } from "./projectHistory.js";',
  'import { appendHistorySnapshot, stepProjectHistoryRedo, stepProjectHistoryUndo } from "./projectHistory.js";\nimport { distance, nearestPointOnSegment, openingsOverlapOnWall, projectOpening, wallLengthFt, wallOpeningsRemainValid, wallVector } from "./wallGeometry.js";',
  "wall geometry import",
);

const embeddedFunctions = [
`function distance(a, b) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

`,
`function wallLengthFt(wall, pxPerFt) {
  if (!pxPerFt) return 0;
  return distance(wall.a, wall.b) / pxPerFt;
}

`,
`function nearestPointOnSegment(p, a, b) {
  const abx = b.x - a.x;
  const aby = b.y - a.y;
  const len2 = abx * abx + aby * aby;
  if (!len2) return { point: a, t: 0, distance: distance(p, a) };
  let t = ((p.x - a.x) * abx + (p.y - a.y) * aby) / len2;
  t = Math.max(0, Math.min(1, t));
  const point = { x: a.x + abx * t, y: a.y + aby * t };
  return { point, t, distance: distance(p, point) };
}

`,
`function projectOpening(opening, wall) {
  return {
    x: wall.a.x + (wall.b.x - wall.a.x) * opening.t,
    y: wall.a.y + (wall.b.y - wall.a.y) * opening.t,
  };
}

`,
`function openingIntervalFt(opening, wall, pxPerFt) {
  if (!opening || !wall || !pxPerFt) return null;
  const lengthFt = wallLengthFt(wall, pxPerFt);
  const centerFt = clamp(opening.t ?? 0.5, 0, 1) * lengthFt;
  const halfWidthFt = Math.max(0, Number(opening.widthFt) || 0) / 2;
  return {
    startFt: centerFt - halfWidthFt,
    endFt: centerFt + halfWidthFt,
  };
}

`,
`function openingsOverlapOnWall(candidate, existing, wall, pxPerFt, clearanceFt = 0.05) {
  const a = openingIntervalFt(candidate, wall, pxPerFt);
  const b = openingIntervalFt(existing, wall, pxPerFt);
  if (!a || !b) return false;
  return a.startFt < b.endFt + clearanceFt && a.endFt > b.startFt - clearanceFt;
}

`,
`function wallOpeningsRemainValid(wall, openings, pxPerFt, wallHeightFt) {
  if (!wall || !pxPerFt) return false;
  const wallFt = wallLengthFt(wall, pxPerFt);
  const effectiveHeight = wall.heightFt ?? wallHeightFt;
  const related = openings.filter((opening) => opening.wallId === wall.id);
  for (const opening of related) {
    if (!Number.isFinite(opening.widthFt) || opening.widthFt <= 0 || wallFt <= opening.widthFt + 0.1) return false;
    if (opening.type === "window") {
      const sill = Math.max(0, Number(opening.sillFt) || 0);
      const height = Math.max(0, Number(opening.heightFt) || 0);
      if (sill + height > effectiveHeight + 0.001) return false;
    } else if ((Number(opening.heightFt) || 0) > effectiveHeight + 0.001) {
      return false;
    }
  }
  for (let i = 0; i < related.length; i += 1) {
    for (let j = i + 1; j < related.length; j += 1) {
      if (openingsOverlapOnWall(related[i], related[j], wall, pxPerFt)) return false;
    }
  }
  return true;
}

`,
`function wallVector(wall) {
  const dx = wall.b.x - wall.a.x;
  const dy = wall.b.y - wall.a.y;
  const len = Math.hypot(dx, dy) || 1;
  return { dx, dy, len, ux: dx / len, uy: dy / len };
}

`,
];

for (const [index, embedded] of embeddedFunctions.entries()) {
  app = replaceRequired(app, embedded, "", `embedded wall helper ${index + 1}`);
}
fs.writeFileSync(appPath, app);

let css = fs.readFileSync(cssPath, "utf8");
const marker = "/* v0.23.0 — tested wall and opening geometry */";
if (!css.includes(marker)) css += `\n${marker}\n`;
fs.writeFileSync(cssPath, css);

console.log("Applied Blueprint 3D Studio v0.23.0 tested wall geometry upgrade.");
