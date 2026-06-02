import type { AppState, CareType, HistoryEntry, Plant } from "../types";

const STORAGE_KEY = "plantycare.v2";

export const emptyState: AppState = { plants: [], history: [] };

/** Legacy (pre-care-tasks) plant shape, used only for migration. */
interface LegacyPlant {
  intervalDays?: number;
  lastWatered?: number | null;
  tasks?: unknown;
  [k: string]: unknown;
}

/** Normalize a stored plant into the current shape (adds care tasks). */
function normalizePlant(p: LegacyPlant): Plant {
  const tasks = Array.isArray(p.tasks)
    ? (p.tasks as Plant["tasks"])
    : [
        {
          type: "water" as CareType,
          intervalDays: typeof p.intervalDays === "number" ? p.intervalDays : 7,
          lastDone: (p.lastWatered as number | null | undefined) ?? null,
        },
      ];
  return {
    id: String(p.id ?? ""),
    name: String(p.name ?? ""),
    species: String(p.species ?? ""),
    emoji: String(p.emoji ?? "🪴"),
    image: (p.image as string | null) ?? null,
    tasks,
    reminderDays: Array.isArray(p.reminderDays)
      ? (p.reminderDays as Plant["reminderDays"])
      : [],
    reminderTime: typeof p.reminderTime === "string" ? p.reminderTime : "09:00",
  };
}

function normalizeHistory(h: Record<string, unknown>): HistoryEntry {
  return {
    id: String(h.id ?? ""),
    plantId: String(h.plantId ?? ""),
    plantName: String(h.plantName ?? ""),
    taskType: (h.taskType as CareType) ?? "water",
    at: typeof h.at === "number" ? h.at : 0,
  };
}

/**
 * Load app state from storage, tolerating missing/corrupt/legacy data.
 * Returns a fresh empty state on any problem.
 */
export function loadState(store: Storage = localStorage): AppState {
  try {
    const raw = store.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(emptyState);
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      plants: Array.isArray(parsed.plants)
        ? parsed.plants.map((p) => normalizePlant(p as unknown as LegacyPlant))
        : [],
      history: Array.isArray(parsed.history)
        ? parsed.history.map((h) =>
            normalizeHistory(h as unknown as Record<string, unknown>),
          )
        : [],
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
