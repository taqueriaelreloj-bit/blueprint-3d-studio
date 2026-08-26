const fs = require("fs");
const path = require("path");
const appPath = path.resolve(__dirname, "..", "src", "App.jsx");
let app = fs.readFileSync(appPath, "utf8");
function replaceRequired(from, to, label) {
  if (!app.includes(from)) throw new Error(`v0.29 patch target missing: ${label}`);
  app = app.replace(from, to);
}
replaceRequired('const APP_VERSION = "0.28.0";', 'const APP_VERSION = "0.29.0";', "version");
replaceRequired('distance, nearestPointOnSegment', 'distance, mergeConnectedCollinearWalls, nearestPointOnSegment', "merge import");
replaceRequired('  function updateGlobalWallHeight(rawValue) {', `  function joinSelectedWall() {
    const currentWall = activeWalls.find((wall) => wall.id === selectedWallId);
    if (!currentWall || !pxPerFt) return;
    let joined = null;
    let neighbor = null;
    for (const candidate of activeWalls) {
      if (candidate.id === currentWall.id) continue;
      const result = mergeConnectedCollinearWalls(currentWall, candidate, openings, pxPerFt, SNAP_PX / 3);
      if (result) { joined = result; neighbor = candidate; break; }
    }
    if (!joined || !neighbor) {
      setStatus("No connected collinear wall can be joined. Corners and disconnected walls are intentionally preserved.");
      return;
    }
    const mergedVector = wallVector(joined.wall);
    setWalls((previous) => previous.filter((wall) => wall.id !== neighbor.id).map((wall) => wall.id === currentWall.id ? joined.wall : wall));
    setOpenings(joined.openings);
    setPlacedObjects((previous) => previous.map((item) => {
      if (item.wallId !== currentWall.id && item.wallId !== neighbor.id) return item;
      const oldWall = item.wallId === currentWall.id ? currentWall : neighbor;
      const oldVector = wallVector(oldWall);
      const physicalPoint = { x: oldWall.a.x + oldVector.ux * (item.wallDistancePx || 0), y: oldWall.a.y + oldVector.uy * (item.wallDistancePx || 0) };
      const projection = nearestPointOnSegment(physicalPoint, joined.wall.a, joined.wall.b);
      return { ...item, wallId: joined.wall.id, wallDistancePx: projection.t * mergedVector.len };
    }));
    setStatus("Connected collinear walls joined. Openings and snapped objects kept their physical positions.");
  }

  function updateGlobalWallHeight(rawValue) {`, "join action");
replaceRequired('              <button onClick={splitSelectedWall}>Divide Wall at Midpoint</button>', '              <button onClick={splitSelectedWall}>Divide Wall at Midpoint</button>\n              <button onClick={joinSelectedWall}>Join Collinear Neighbor</button>', "join control");
fs.writeFileSync(appPath, app);
console.log("Applied Blueprint 3D Studio v0.29.0 safe collinear wall join upgrade.");
