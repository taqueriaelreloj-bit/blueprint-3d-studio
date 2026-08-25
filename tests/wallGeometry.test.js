import assert from "node:assert/strict";
import test from "node:test";
import {
  distance,
  nearestPointOnSegment,
  openingIntervalFt,
  openingsOverlapOnWall,
  projectOpening,
  wallLengthFt,
  wallOpeningsRemainValid,
  wallVector,
} from "../src/wallGeometry.js";

const wall = { id: "wall-1", a: { x: 0, y: 0 }, b: { x: 100, y: 0 }, heightFt: 9 };

test("wall geometry calculates calibrated length and normalized direction", () => {
  assert.equal(distance(wall.a, wall.b), 100);
  assert.equal(wallLengthFt(wall, 10), 10);
  assert.deepEqual(wallVector(wall), { dx: 100, dy: 0, len: 100, ux: 1, uy: 0 });
  assert.equal(wallLengthFt(wall, 0), 0);
});

test("nearest point projection clamps to the wall segment", () => {
  assert.deepEqual(nearestPointOnSegment({ x: 40, y: 20 }, wall.a, wall.b), {
    point: { x: 40, y: 0 }, t: 0.4, distance: 20,
  });
  assert.equal(nearestPointOnSegment({ x: 140, y: 0 }, wall.a, wall.b).t, 1);
  assert.equal(nearestPointOnSegment({ x: -10, y: 0 }, wall.a, wall.b).t, 0);
});

test("opening projection and intervals follow the host wall", () => {
  const opening = { t: 0.4, widthFt: 3 };
  assert.deepEqual(projectOpening(opening, wall), { x: 40, y: 0 });
  assert.deepEqual(openingIntervalFt(opening, wall, 10), { startFt: 2.5, endFt: 5.5 });
});

test("opening collision detection includes required clearance", () => {
  const first = { t: 0.3, widthFt: 3 };
  const overlapping = { t: 0.5, widthFt: 2 };
  const separate = { t: 0.8, widthFt: 2 };
  assert.equal(openingsOverlapOnWall(first, overlapping, wall, 10), true);
  assert.equal(openingsOverlapOnWall(first, separate, wall, 10), false);
});

test("wall opening validation protects width, height, sill and overlap", () => {
  const door = { id: "door", wallId: wall.id, type: "door", t: 0.25, widthFt: 3, heightFt: 7 };
  const window = { id: "window", wallId: wall.id, type: "window", t: 0.75, widthFt: 3, heightFt: 4, sillFt: 3 };
  assert.equal(wallOpeningsRemainValid(wall, [door, window], 10, 9), true);
  assert.equal(wallOpeningsRemainValid(wall, [{ ...door, widthFt: 10 }], 10, 9), false);
  assert.equal(wallOpeningsRemainValid(wall, [{ ...door, heightFt: 10 }], 10, 9), false);
  assert.equal(wallOpeningsRemainValid(wall, [{ ...window, sillFt: 6 }], 10, 9), false);
  assert.equal(wallOpeningsRemainValid(wall, [door, { ...window, t: 0.3 }], 10, 9), false);
});
