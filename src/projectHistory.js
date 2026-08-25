export const HISTORY_LIMIT = 80;

export function appendHistorySnapshot(stack, snapshot, limit = HISTORY_LIMIT) {
  if (!snapshot || limit < 1) return [...stack];
  return [...stack.slice(-(limit - 1)), snapshot];
}

export function stepProjectHistoryUndo(past, current, future) {
  if (!past.length || !current) return null;
  return {
    past: past.slice(0, -1),
    current: past[past.length - 1],
    future: appendHistorySnapshot(future, current),
  };
}

export function stepProjectHistoryRedo(past, current, future) {
  if (!future.length || !current) return null;
  return {
    past: appendHistorySnapshot(past, current),
    current: future[future.length - 1],
    future: future.slice(0, -1),
  };
}
