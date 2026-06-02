import type { Plant, WaterStatus, Weekday } from "../types";

export const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Whole days until a plant is next due for watering.
 * A plant that has never been watered is due now (0).
 * Negative values mean it is overdue.
 */
export function daysUntilDue(plant: Plant, now: number = Date.now()): number {
  if (plant.lastWatered == null) return 0;
  const elapsedDays = (now - plant.lastWatered) / DAY_MS;
  return Math.ceil(plant.intervalDays - elapsedDays);
}

/** Human-friendly watering status used to drive the UI. */
export function waterStatus(plant: Plant, now: number = Date.now()): WaterStatus {
  const days = daysUntilDue(plant, now);

  if (days <= -1) {
    const n = Math.abs(days);
    return {
      urgency: "overdue",
      daysUntilDue: days,
      label: `Overdue by ${n} day${n === 1 ? "" : "s"}`,
    };
  }
  if (days === 0) {
    return { urgency: "due", daysUntilDue: 0, label: "Water today" };
  }
  if (days === 1) {
    return { urgency: "soon", daysUntilDue: 1, label: "Water tomorrow" };
  }
  return { urgency: "ok", daysUntilDue: days, label: `Water in ${days} days` };
}

/**
 * Progress toward the next watering, 0..1 (0 = just watered, 1 = due/overdue).
 * A never-watered plant reads as fully due (1).
 */
export function wateringProgress(plant: Plant, now: number = Date.now()): number {
  if (plant.lastWatered == null || plant.intervalDays <= 0) return 1;
  const elapsedDays = (now - plant.lastWatered) / DAY_MS;
  const fraction = elapsedDays / plant.intervalDays;
  return Math.min(1, Math.max(0, fraction));
}

/** Sort comparator: most urgent (smallest days-until-due) first. */
export function byUrgency(a: Plant, b: Plant, now: number = Date.now()): number {
  return daysUntilDue(a, now) - daysUntilDue(b, now);
}

/**
 * Epoch ms of the next reminder for the given weekdays + "HH:MM" time,
 * or null if no weekday is selected. Looks up to 7 days ahead.
 */
export function nextReminderTime(
  days: Weekday[],
  time: string,
  now: number = Date.now(),
): number | null {
  if (days.length === 0) return null;
  const [hh, mm] = time.split(":").map(Number);
  if (Number.isNaN(hh) || Number.isNaN(mm)) return null;

  const base = new Date(now);
  for (let add = 0; add <= 7; add++) {
    const cand = new Date(
      base.getFullYear(),
      base.getMonth(),
      base.getDate() + add,
      hh,
      mm,
      0,
      0,
    );
    if (days.includes(cand.getDay() as Weekday) && cand.getTime() > now) {
      return cand.getTime();
    }
  }
  return null;
}
