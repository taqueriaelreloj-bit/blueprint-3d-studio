import assert from "node:assert/strict";
import test from "node:test";
import {
  HISTORY_LIMIT,
  appendHistorySnapshot,
  stepProjectHistoryRedo,
  stepProjectHistoryUndo,
} from "../src/projectHistory.js";

test("history keeps only the most recent snapshots", () => {
  let history = [];
  for (let id = 1; id <= HISTORY_LIMIT + 5; id += 1) {
    history = appendHistorySnapshot(history, { id });
  }
  assert.equal(history.length, HISTORY_LIMIT);
  assert.equal(history[0].id, 6);
  assert.equal(history.at(-1).id, HISTORY_LIMIT + 5);
});

test("undo moves the current snapshot to the redo stack without mutation", () => {
  const past = [{ id: "a" }, { id: "b" }];
  const future = [{ id: "d" }];
  const transition = stepProjectHistoryUndo(past, { id: "c" }, future);

  assert.deepEqual(transition, {
    past: [{ id: "a" }],
    current: { id: "b" },
    future: [{ id: "d" }, { id: "c" }],
  });
  assert.deepEqual(past, [{ id: "a" }, { id: "b" }]);
  assert.deepEqual(future, [{ id: "d" }]);
});

test("redo restores the latest future snapshot and preserves ordering", () => {
  const transition = stepProjectHistoryRedo(
    [{ id: "a" }],
    { id: "b" },
    [{ id: "d" }, { id: "c" }],
  );
  assert.deepEqual(transition, {
    past: [{ id: "a" }, { id: "b" }],
    current: { id: "c" },
    future: [{ id: "d" }],
  });
});

test("undo and redo return null when no transition is available", () => {
  assert.equal(stepProjectHistoryUndo([], { id: "a" }, []), null);
  assert.equal(stepProjectHistoryRedo([], { id: "a" }, []), null);
  assert.equal(stepProjectHistoryUndo([{ id: "a" }], null, []), null);
});
