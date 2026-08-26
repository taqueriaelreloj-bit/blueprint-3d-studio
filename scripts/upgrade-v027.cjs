const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..");
const appPath = path.join(root, "src", "App.jsx");
const cssPath = path.join(root, "src", "styles.css");
let app = fs.readFileSync(appPath, "utf8");
function replaceRequired(from, to, label) {
  if (!app.includes(from)) throw new Error(`v0.27 patch target missing: ${label}`);
  app = app.replace(from, to);
}
replaceRequired('const APP_VERSION = "0.26.0";', 'const APP_VERSION = "0.27.0";', "version");
replaceRequired('from "./wallGeometry.js";', 'from "./wallGeometry.js";\nimport { createRoomPerimeterWalls, rectangleRoomPoints } from "./roomGeometry.js";', "room import");
replaceRequired('  const [draftStart, setDraftStart] = useState(null);', '  const [draftStart, setDraftStart] = useState(null);\n  const [roomDragStart, setRoomDragStart] = useState(null);\n  const [roomPolygonPoints, setRoomPolygonPoints] = useState([]);', "room state");
replaceRequired('    setActiveDesignSection("build");', '    setActiveDesignSection("rooms");', "room section");
replaceRequired('    const snapped = snapCandidate(raw, draftStart);', '    const snapped = snapCandidate(raw, roomDragStart || roomPolygonPoints.at(-1) || draftStart);', "preview snap");
replaceRequired('  function onOverlayMouseMove(e) {', `  function addRoomPerimeter(points) {
    const created = createRoomPerimeterWalls(points, activeWalls, { levelId: activeLevelId, tolerancePx: SNAP_PX / 3 });
    if (!created.length) { setStatus("That room is too small or its perimeter already exists."); return false; }
    setWalls((previous) => [...previous, ...created]);
    setSelectedWallId(created[0].id);
    setMode("select");
    setRoomDragStart(null);
    setRoomPolygonPoints([]);
    setStatus(\`Room created with \${created.length} new walls; shared walls were reused.\`);
    return true;
  }

  function onRoomPointerDown(event) {
    if (mode !== "room-rect" || !pxPerFt) return;
    setRoomDragStart(snapCandidate(pointerFromEvent(event)).point);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }

  function onRoomPointerUp(event) {
    if (mode !== "room-rect" || !roomDragStart) return;
    const end = snapCandidate(pointerFromEvent(event), roomDragStart).point;
    addRoomPerimeter(rectangleRoomPoints(roomDragStart, end));
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  }

  function onOverlayMouseMove(e) {`, "room actions");
replaceRequired('              <p>Select a detected room to name it, apply a floor or request AI furnishing.</p>', `              <p>Create a room, then name it, apply a floor or request AI furnishing.</p>
              <div className="large-tool-grid">
                <button className={mode === "room-rect" ? "active" : ""} onClick={() => onActivateMode("room-rect")}>▭ Rectangle Room</button>
                <button className={mode === "room-poly" ? "active" : ""} onClick={() => onActivateMode("room-poly")}>⬠ Polygon Room</button>
              </div>
              <div className="library-tip">Rectangle: click-drag. Polygon: click each corner, then click the first corner to close.</div>`, "room tools");
replaceRequired('    setMovingOpeningId(null);', '    setMovingOpeningId(null);\n    setRoomDragStart(null);\n    setRoomPolygonPoints([]);', "reset draft");
replaceRequired('      nextMode === "window" ? "Click a wall to place a window." :', '      nextMode === "window" ? "Click a wall to place a window." :\n      nextMode === "room-rect" ? "Create Room: click and drag from one corner to the opposite corner." :\n      nextMode === "room-poly" ? "Polygon Room: click each corner, then click the first corner to close." :', "room status");
replaceRequired('    if (mode === "door" || mode === "window") {', `    if (mode === "room-poly") {
      const point = snapCandidate(raw, roomPolygonPoints.at(-1) || null).point;
      if (roomPolygonPoints.length >= 3 && distance(point, roomPolygonPoints[0]) <= SNAP_PX) addRoomPerimeter(roomPolygonPoints);
      else { setRoomPolygonPoints((previous) => [...previous, point]); setStatus("Polygon room: add another corner or click the first corner to close."); }
      return;
    }

    if (mode === "door" || mode === "window") {`, "polygon clicks");
replaceRequired('                  onMouseMove={onOverlayMouseMove}', '                  onMouseMove={onOverlayMouseMove}\n                  onPointerDown={onRoomPointerDown}\n                  onPointerUp={onRoomPointerUp}', "drag handlers");
replaceRequired('                  {(wallAnalysis?.walls || []).map((wall, index) => (', `                  {mode === "room-rect" && roomDragStart && mousePoint && (() => {
                    const points = rectangleRoomPoints(roomDragStart, mousePoint);
                    if (!points.length) return null;
                    const widthFt = Math.abs(mousePoint.x - roomDragStart.x) / pxPerFt;
                    const depthFt = Math.abs(mousePoint.y - roomDragStart.y) / pxPerFt;
                    return <g className="room-create-preview">
                      <polygon points={points.map((point) => \`\${point.x},\${point.y}\`).join(" ")} />
                      <text x={(roomDragStart.x + mousePoint.x) / 2} y={(roomDragStart.y + mousePoint.y) / 2}>{widthFt.toFixed(1)}' × {depthFt.toFixed(1)}'</text>
                    </g>;
                  })()}
                  {mode === "room-poly" && roomPolygonPoints.length > 0 && (
                    <g className="room-create-preview">
                      <polyline points={[...roomPolygonPoints, ...(mousePoint ? [mousePoint] : [])].map((point) => \`\${point.x},\${point.y}\`).join(" ")} />
                      {roomPolygonPoints.map((point, index) => <circle key={index} cx={point.x} cy={point.y} r="5" />)}
                    </g>
                  )}

                  {(wallAnalysis?.walls || []).map((wall, index) => (`, "preview");
fs.writeFileSync(appPath, app);
let css = fs.readFileSync(cssPath, "utf8");
css += `
/* v0.27.0 — professional Create Room tools */
.room-create-preview polygon { fill:#38bdf822; stroke:#38bdf8; stroke-width:3; stroke-dasharray:9 5; }
.room-create-preview polyline { fill:none; stroke:#38bdf8; stroke-width:3; stroke-dasharray:9 5; }
.room-create-preview circle { fill:#e0f2fe; stroke:#0284c7; stroke-width:2; }
.room-create-preview text { fill:#e0f2fe; stroke:#082f49; stroke-width:3; paint-order:stroke; font-weight:800; text-anchor:middle; }
`;
fs.writeFileSync(cssPath, css);
console.log("Applied Blueprint 3D Studio v0.27.0 Create Room upgrade.");
