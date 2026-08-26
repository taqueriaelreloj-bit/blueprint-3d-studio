const fs = require("fs");
const path = require("path");

const appPath = path.resolve(__dirname, "..", "src", "App.jsx");
let app = fs.readFileSync(appPath, "utf8");

function replaceRequired(from, to, label) {
  if (!app.includes(from)) throw new Error(`v0.24 patch target missing: ${label}`);
  app = app.replace(from, to);
}

replaceRequired('const APP_VERSION = "0.23.0";', 'const APP_VERSION = "0.24.0";', "version");
replaceRequired(
  'import { distance, nearestPointOnSegment, openingsOverlapOnWall, projectOpening, wallLengthFt, wallOpeningsRemainValid, wallVector } from "./wallGeometry.js";',
  'import { distance, nearestPointOnSegment, openingReservationPx, openingsOverlapOnWall, projectOpening, wallLengthFt, wallOpeningsRemainValid, wallVector } from "./wallGeometry.js";',
  "opening reservation import",
);
replaceRequired("  walls,\n  placedObjects,", "  walls,\n  openings = [],\n  placedObjects,", "placement openings input");
replaceRequired(
  "  const occupied = [];\n  placedObjects.forEach((other) => {",
  "  const occupied = [];\n  openings.forEach((opening) => {\n    if (opening.wallId !== wall.id) return;\n    const reservation = openingReservationPx(opening, wall, pxPerFt);\n    if (reservation) occupied.push(reservation);\n  });\n  placedObjects.forEach((other) => {",
  "opening reservations",
);
replaceRequired("      walls: activeWalls,\n      placedObjects: activePlacedObjects,", "      walls: activeWalls,\n      openings: activeOpenings,\n      placedObjects: activePlacedObjects,", "active openings input");

fs.writeFileSync(appPath, app);
console.log("Applied Blueprint 3D Studio v0.24.0 opening-aware cabinet snap upgrade.");
