export function distance(a, b) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

export function wallLengthFt(wall, pxPerFt) {
  if (!wall || !pxPerFt) return 0;
  return distance(wall.a, wall.b) / pxPerFt;
}

export function nearestPointOnSegment(point, start, end) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSquared = dx * dx + dy * dy;
  if (!lengthSquared) return { point: start, t: 0, distance: distance(point, start) };
  const projection = ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared;
  const t = Math.max(0, Math.min(1, projection));
  const nearest = { x: start.x + dx * t, y: start.y + dy * t };
  return { point: nearest, t, distance: distance(point, nearest) };
}

export function projectOpening(opening, wall) {
  const t = Math.max(0, Math.min(1, Number(opening?.t ?? 0.5)));
  return {
    x: wall.a.x + (wall.b.x - wall.a.x) * t,
    y: wall.a.y + (wall.b.y - wall.a.y) * t,
  };
}

export function openingIntervalFt(opening, wall, pxPerFt) {
  if (!opening || !wall || !pxPerFt) return null;
  const lengthFt = wallLengthFt(wall, pxPerFt);
  const centerFt = Math.max(0, Math.min(1, opening.t ?? 0.5)) * lengthFt;
  const halfWidthFt = Math.max(0, Number(opening.widthFt) || 0) / 2;
  return { startFt: centerFt - halfWidthFt, endFt: centerFt + halfWidthFt };
}

export function openingReservationPx(opening, wall, pxPerFt, clearanceFt = 0.1) {
  const interval = openingIntervalFt(opening, wall, pxPerFt);
  if (!interval) return null;
  const startFt = Math.max(0, interval.startFt - Math.max(0, clearanceFt));
  const endFt = Math.min(wallLengthFt(wall, pxPerFt), interval.endFt + Math.max(0, clearanceFt));
  if (endFt <= startFt) return null;
  return {
    center: ((startFt + endFt) / 2) * pxPerFt,
    width: (endFt - startFt) * pxPerFt,
  };
}

export function openingClearancesFt(opening, wall, pxPerFt, obstacles = []) {
  const interval = openingIntervalFt(opening, wall, pxPerFt);
  if (!interval) return null;
  const wallFt = wallLengthFt(wall, pxPerFt);
  let leftBoundary = 0;
  let rightBoundary = wallFt;
  let leftKind = "wall end";
  let rightKind = "wall end";
  for (const obstacle of obstacles) {
    if (!Number.isFinite(obstacle?.startFt) || !Number.isFinite(obstacle?.endFt)) continue;
    if (obstacle.endFt <= interval.startFt && obstacle.endFt > leftBoundary) {
      leftBoundary = obstacle.endFt;
      leftKind = obstacle.kind || "object";
    }
    if (obstacle.startFt >= interval.endFt && obstacle.startFt < rightBoundary) {
      rightBoundary = obstacle.startFt;
      rightKind = obstacle.kind || "object";
    }
  }
  return {
    leftFt: Math.max(0, interval.startFt - leftBoundary),
    rightFt: Math.max(0, rightBoundary - interval.endFt),
    leftKind,
    rightKind,
  };
}

export function openingsOverlapOnWall(candidate, existing, wall, pxPerFt, clearanceFt = 0.05) {
  const a = openingIntervalFt(candidate, wall, pxPerFt);
  const b = openingIntervalFt(existing, wall, pxPerFt);
  if (!a || !b) return false;
  return a.startFt < b.endFt + clearanceFt && a.endFt > b.startFt - clearanceFt;
}

export function wallOpeningsRemainValid(wall, openings, pxPerFt, defaultWallHeightFt) {
  if (!wall || !pxPerFt) return false;
  const wallFt = wallLengthFt(wall, pxPerFt);
  const effectiveHeight = wall.heightFt ?? defaultWallHeightFt;
  const related = openings.filter((opening) => opening.wallId === wall.id);

  for (const opening of related) {
    if (!Number.isFinite(opening.widthFt) || opening.widthFt <= 0 || wallFt <= opening.widthFt + 0.1) return false;
    const interval = openingIntervalFt(opening, wall, pxPerFt);
    if (!interval || interval.startFt < -0.001 || interval.endFt > wallFt + 0.001) return false;
    const height = Math.max(0, Number(opening.heightFt) || 0);
    if (opening.type === "window") {
      const sill = Math.max(0, Number(opening.sillFt) || 0);
      if (sill + height > effectiveHeight + 0.001) return false;
    } else if (height > effectiveHeight + 0.001) {
      return false;
    }
  }

  for (let index = 0; index < related.length; index += 1) {
    for (let otherIndex = index + 1; otherIndex < related.length; otherIndex += 1) {
      if (openingsOverlapOnWall(related[index], related[otherIndex], wall, pxPerFt)) return false;
    }
  }
  return true;
}

export function wallVector(wall) {
  const dx = wall.b.x - wall.a.x;
  const dy = wall.b.y - wall.a.y;
  const len = Math.hypot(dx, dy) || 1;
  return { dx, dy, len, ux: dx / len, uy: dy / len };
}

export function resizeWallFromStart(wall, lengthFt, pxPerFt) {
  if (!wall || !Number.isFinite(lengthFt) || lengthFt <= 0 || !pxPerFt) return null;
  const vector = wallVector(wall);
  const lengthPx = lengthFt * pxPerFt;
  return { ...wall, b: { x: wall.a.x + vector.ux * lengthPx, y: wall.a.y + vector.uy * lengthPx } };
}
