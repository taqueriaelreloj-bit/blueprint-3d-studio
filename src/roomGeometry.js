function pointDistance(a, b) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function samePoint(a, b, tolerancePx) {
  return pointDistance(a, b) <= tolerancePx;
}

export function rectangleRoomPoints(start, end) {
  if (!start || !end || start.x === end.x || start.y === end.y) return [];
  return [
    { x: start.x, y: start.y },
    { x: end.x, y: start.y },
    { x: end.x, y: end.y },
    { x: start.x, y: end.y },
  ];
}

export function polygonAreaPx(points) {
  if (!Array.isArray(points) || points.length < 3) return 0;
  return Math.abs(points.reduce((sum, point, index) => {
    const next = points[(index + 1) % points.length];
    return sum + point.x * next.y - next.x * point.y;
  }, 0) / 2);
}

export function createRoomPerimeterWalls(points, existingWalls = [], options = {}) {
  const tolerancePx = Math.max(0.01, Number(options.tolerancePx) || 1);
  const createId = options.createId || (() => crypto.randomUUID());
  if (!Array.isArray(points) || points.length < 3 || polygonAreaPx(points) < tolerancePx * tolerancePx) return [];
  const created = [];
  for (let index = 0; index < points.length; index += 1) {
    const a = points[index];
    const b = points[(index + 1) % points.length];
    if (pointDistance(a, b) <= tolerancePx) continue;
    const duplicate = [...existingWalls, ...created].some((wall) => (
      (samePoint(wall.a, a, tolerancePx) && samePoint(wall.b, b, tolerancePx)) ||
      (samePoint(wall.a, b, tolerancePx) && samePoint(wall.b, a, tolerancePx))
    ));
    if (duplicate) continue;
    created.push({ id: createId(), a: { ...a }, b: { ...b }, source: "manual-room", levelId: options.levelId });
  }
  return created;
}
