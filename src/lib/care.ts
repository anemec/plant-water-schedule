import type { CareStatus, CareTask, Plant, Weekday } from "../types";

export const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Whole days until a care task is next due.
 * A task that has never been done is due now (0); negative means overdue.
 */
export function daysUntilDue(task: CareTask, now: number = Date.now()): number {
  if (task.lastDone == null) return 0;
  const elapsedDays = (now - task.lastDone) / DAY_MS;
  return Math.ceil(task.intervalDays - elapsedDays);
}

/** Human-friendly status for a single care task. */
export function careStatus(task: CareTask, now: number = Date.now()): CareStatus {
  const days = daysUntilDue(task, now);

  if (days <= -1) {
    const n = Math.abs(days);
    return {
      urgency: "overdue",
      daysUntilDue: days,
      label: `Overdue by ${n} day${n === 1 ? "" : "s"}`,
    };
  }
  if (days === 0) return { urgency: "due", daysUntilDue: 0, label: "Due today" };
  if (days === 1) return { urgency: "soon", daysUntilDue: 1, label: "Due tomorrow" };
  return { urgency: "ok", daysUntilDue: days, label: `Due in ${days} days` };
}

/**
 * Progress toward a task being due, 0..1 (0 = just done, 1 = due/overdue).
 */
export function careProgress(task: CareTask, now: number = Date.now()): number {
  if (task.lastDone == null || task.intervalDays <= 0) return 1;
  const elapsedDays = (now - task.lastDone) / DAY_MS;
  return Math.min(1, Math.max(0, elapsedDays / task.intervalDays));
}

/** The soonest-due (smallest) days-until-due across all of a plant's tasks. */
export function plantSoonestDue(plant: Plant, now: number = Date.now()): number {
  if (plant.tasks.length === 0) return Number.POSITIVE_INFINITY;
  return Math.min(...plant.tasks.map((t) => daysUntilDue(t, now)));
}

/** Total number of (plant, task) pairs that are due or overdue right now. */
export function dueTaskCount(plants: Plant[], now: number = Date.now()): number {
  return plants.reduce(
    (sum, p) => sum + p.tasks.filter((t) => daysUntilDue(t, now) <= 0).length,
    0,
  );
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
