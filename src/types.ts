/** Day of week as returned by Date.getDay(): 0 = Sunday … 6 = Saturday. */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** The kinds of recurring care a plant can need. */
export type CareType = "water" | "fertilize" | "rotate" | "repot";

export interface CareTask {
  type: CareType;
  /** How often this task is due, in days. */
  intervalDays: number;
  /** Epoch ms this task was last done, or null if never. */
  lastDone: number | null;
}

export interface Plant {
  id: string;
  name: string;
  species: string;
  emoji: string;
  /** Photo URL (e.g. from Wikipedia), or null. */
  image: string | null;
  /** Recurring care tasks; always includes a "water" task. */
  tasks: CareTask[];
  /** Weekdays to send the watering reminder. */
  reminderDays: Weekday[];
  /** Reminder time as "HH:MM" (24h). */
  reminderTime: string;
}

export interface HistoryEntry {
  id: string;
  plantId: string;
  plantName: string;
  /** Which care task was completed. */
  taskType: CareType;
  /** Epoch ms when done. */
  at: number;
}

export interface AppState {
  plants: Plant[];
  history: HistoryEntry[];
}

/** A built-in plant the user can add with one tap. */
export interface Preset {
  name: string;
  emoji: string;
  species: string;
  /** Wikipedia article title used to fetch a photo + description. */
  wikiTitle: string;
  /** Default watering interval, in days. */
  intervalDays: number;
}

export type CareUrgency = "ok" | "soon" | "due" | "overdue";

export interface CareStatus {
  urgency: CareUrgency;
  /** Whole days until due; negative when overdue. */
  daysUntilDue: number;
  label: string;
}
