/** Day of week as returned by Date.getDay(): 0 = Sunday … 6 = Saturday. */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface Plant {
  id: string;
  name: string;
  species: string;
  emoji: string;
  /** How often the plant should be watered, in days. */
  intervalDays: number;
  /** Epoch ms of the last watering, or null if never watered. */
  lastWatered: number | null;
  /** Photo URL (e.g. from Wikipedia), or null. */
  image: string | null;
  /** Weekdays on which to remind. */
  reminderDays: Weekday[];
  /** Reminder time as "HH:MM" (24h). */
  reminderTime: string;
}

export interface HistoryEntry {
  id: string;
  plantId: string;
  plantName: string;
  emoji: string;
  /** Epoch ms when watered. */
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
  intervalDays: number;
}

export type WaterUrgency = "ok" | "soon" | "due" | "overdue";

export interface WaterStatus {
  urgency: WaterUrgency;
  /** Whole days until due; negative when overdue. */
  daysUntilDue: number;
  label: string;
}
