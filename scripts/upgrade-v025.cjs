const fs = require("fs");
const path = require("path");

const appPath = path.resolve(__dirname, "..", "src", "App.jsx");
let app = fs.readFileSync(appPath, "utf8");

function replaceRequired(from, to, label) {
  if (!app.includes(from)) throw new Error(`v0.25 patch target missing: ${label}`);
  app = app.replace(from, to);
}

replaceRequired('const APP_VERSION = "0.24.0";', 'const APP_VERSION = "0.25.0";', "version");
replaceRequired(
  'import { distance, nearestPointOnSegment, openingReservationPx, openingsOverlapOnWall, projectOpening, wallLengthFt, wallOpeningsRemainValid, wallVector } from "./wallGeometry.js";',
  'import { distance, nearestPointOnSegment, openingClearancesFt, openingIntervalFt, openingReservationPx, openingsOverlapOnWall, projectOpening, resizeWallFromStart, wallLengthFt, wallOpeningsRemainValid, wallVector } from "./wallGeometry.js";',
  "wall resize import",
);
replaceRequired(
  "  function updateGlobalWallHeight(rawValue) {",
  `  function updateSelectedWallLength(rawValue) {
    const value = Number(rawValue);
    if (!selectedWallId || !Number.isFinite(value) || value <= 0 || !pxPerFt) return;
    const currentWall = walls.find((wall) => wall.id === selectedWallId);
    const candidateWall = resizeWallFromStart(currentWall, value, pxPerFt);
    if (!candidateWall || !wallOpeningsRemainValid(candidateWall, activeOpenings, pxPerFt, activeWallHeightFt)) {
      setStatus("That wall length would leave a door/window outside the wall or cause openings to overlap.");
      return;
    }
    setWalls((previous) => previous.map((wall) => (wall.id === selectedWallId ? candidateWall : wall)));
    setStatus(\`Selected wall length updated to \${value.toFixed(2)} ft; start point and angle preserved.\`);
  }

  function updateGlobalWallHeight(rawValue) {`,
  "wall length updater",
);
replaceRequired(
  '  const selectedOpening = openings.find((opening) => opening.id === selectedOpeningId) || null;',
  `  const selectedOpening = openings.find((opening) => opening.id === selectedOpeningId) || null;
  const selectedOpeningClearances = (() => {
    if (!selectedOpening || !pxPerFt) return null;
    const hostWall = activeWalls.find((wall) => wall.id === selectedOpening.wallId);
    if (!hostWall) return null;
    const obstacles = activeOpenings
      .filter((opening) => opening.wallId === hostWall.id && opening.id !== selectedOpening.id)
      .map((opening) => ({ ...openingIntervalFt(opening, hostWall, pxPerFt), kind: opening.type }));
    activePlacedObjects.forEach((item) => {
      if (item.wallId !== hostWall.id || !Number.isFinite(item.wallDistancePx)) return;
      const definition = definitionForPlacedObject(item);
      if (!definition?.widthFt) return;
      const centerFt = item.wallDistancePx / pxPerFt;
      obstacles.push({ startFt: centerFt - definition.widthFt / 2, endFt: centerFt + definition.widthFt / 2, kind: definition.label });
    });
    return openingClearancesFt(selectedOpening, hostWall, pxPerFt, obstacles);
  })();`,
  "opening clearance calculation",
);
replaceRequired(
  '              <div className="opening-edit-actions">',
  `              {selectedOpeningClearances && (
                <div className="two-col">
                  <div className="metric"><span>Left to {selectedOpeningClearances.leftKind}</span><strong>{selectedOpeningClearances.leftFt.toFixed(2)} ft</strong></div>
                  <div className="metric"><span>Right to {selectedOpeningClearances.rightKind}</span><strong>{selectedOpeningClearances.rightFt.toFixed(2)} ft</strong></div>
                </div>
              )}
              <div className="opening-edit-actions">`,
  "opening clearance display",
);
replaceRequired(
  '              <div className="metric"><span>Length</span><strong>{wallLengthFt(selectedWall, pxPerFt).toFixed(2)} ft</strong></div>',
  `              <label>
                Length (ft)
                <input type="number" min="0.25" max="500" step="0.25"
                  value={Number(wallLengthFt(selectedWall, pxPerFt).toFixed(2))}
                  onChange={(event) => updateSelectedWallLength(event.target.value)}
                  title="Resizes endpoint B while preserving endpoint A and the wall angle" />
              </label>`,
  "wall length control",
);

fs.writeFileSync(appPath, app);
console.log("Applied Blueprint 3D Studio v0.25.0 parametric wall length upgrade.");
