import type { AppState } from "../types";

const STORAGE_KEY = "plantycare.v2";

export const emptyState: AppState = { plants: [], history: [] };

/**
 * Load app state from storage, tolerating missing/corrupt data.
 * Returns a fresh empty state on any problem.
 */
export function loadState(store: Storage = localStorage): AppState {
  try {
    const raw = store.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(emptyState);
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      plants: Array.isArray(parsed.plants) ? parsed.plants : [],
      history: Array.isArray(parsed.history) ? parsed.history : [],
    };
  } catch {
    return structuredClone(emptyState);
  }
}

/** Persist app state; failures (e.g. quota) are swallowed. */
export function saveState(state: AppState, store: Storage = localStorage): void {
  try {
    store.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore write failures (private mode, quota, etc.) */
  }
}

export { STORAGE_KEY };
