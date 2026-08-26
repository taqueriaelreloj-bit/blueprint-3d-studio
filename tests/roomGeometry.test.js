import assert from "node:assert/strict";
import test from "node:test";
import { createRoomPerimeterWalls, polygonAreaPx, rectangleRoomPoints } from "../src/roomGeometry.js";

test("rectangular room points form a closed clockwise perimeter", () => {
  const points = rectangleRoomPoints({ x: 10, y: 20 }, { x: 110, y: 80 });
  assert.deepEqual(points, [
    { x: 10, y: 20 }, { x: 110, y: 20 }, { x: 110, y: 80 }, { x: 10, y: 80 },
  ]);
  assert.equal(polygonAreaPx(points), 6000);
});

test("room perimeter closes automatically and reuses a shared wall", () => {
  let nextId = 1;
  const first = createRoomPerimeterWalls(rectangleRoomPoints({ x: 0, y: 0 }, { x: 100, y: 100 }), [], {
    levelId: "level-1", createId: () => `wall-${nextId++}`,
  });
  assert.equal(first.length, 4);
  assert.deepEqual(first.at(-1).b, first[0].a);
  const adjacent = createRoomPerimeterWalls(rectangleRoomPoints({ x: 100, y: 0 }, { x: 200, y: 100 }), first, {
    levelId: "level-1", createId: () => `wall-${nextId++}`,
  });
  assert.equal(adjacent.length, 3);
  assert.equal([...first, ...adjacent].length, 7);
});

test("invalid or collapsed room perimeters do not create walls", () => {
  assert.deepEqual(rectangleRoomPoints({ x: 0, y: 0 }, { x: 0, y: 20 }), []);
  assert.deepEqual(createRoomPerimeterWalls([{ x: 0, y: 0 }, { x: 10, y: 0 }]), []);
});
