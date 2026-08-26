const fs = require("fs");
const path = require("path");
const appPath = path.resolve(__dirname, "..", "src", "App.jsx");
let app = fs.readFileSync(appPath, "utf8");
function replaceRequired(from, to, label) {
  if (!app.includes(from)) throw new Error(`v0.28 patch target missing: ${label}`);
  app = app.replace(from, to);
}
replaceRequired('const APP_VERSION = "0.27.0";', 'const APP_VERSION = "0.28.0";', "version");
replaceRequired('resizeWallFromStart, wallLengthFt', 'resizeWallFromStart, splitWallAtT, wallLengthFt', "split import");
replaceRequired('  function updateGlobalWallHeight(rawValue) {', `  function splitSelectedWall() {
    const currentWall = walls.find((wall) => wall.id === selectedWallId);
    if (!currentWall || !pxPerFt) return;
    const result = splitWallAtT(currentWall, openings, pxPerFt, 0.5);
    if (!result) {
      setStatus("The wall cannot be divided at its midpoint because an opening crosses the cut. Move the opening first.");
      return;
    }
    const [first, second] = result.walls;
    const splitDistancePx = distance(currentWall.a, result.splitPoint);
    setWalls((previous) => previous.flatMap((wall) => wall.id === currentWall.id ? result.walls : [wall]));
    setOpenings(result.openings);
    setPlacedObjects((previous) => previous.map((item) => {
      if (item.wallId !== currentWall.id) return item;
      if ((item.wallDistancePx || 0) < splitDistancePx) return { ...item, wallId: first.id };
      return { ...item, wallId: second.id, wallDistancePx: Math.max(0, (item.wallDistancePx || 0) - splitDistancePx) };
    }));
    setSelectedWallId(first.id);
    setStatus("Wall divided at midpoint. Hosted openings and snapped objects stayed attached.");
  }

  function updateGlobalWallHeight(rawValue) {`, "split action");
replaceRequired('              <button onClick={resetSelectedWallSettings}>Use global wall settings</button>', '              <button onClick={resetSelectedWallSettings}>Use global wall settings</button>\n              <button onClick={splitSelectedWall}>Divide Wall at Midpoint</button>', "split control");
fs.writeFileSync(appPath, app);
console.log("Applied Blueprint 3D Studio v0.28.0 hosted wall division upgrade.");
