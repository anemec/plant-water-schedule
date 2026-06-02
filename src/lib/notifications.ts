import type { Plant } from "../types";
import { nextReminderTime } from "./care";

export type NotifyPermission = "default" | "granted" | "denied" | "unsupported";

export function notificationsSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export function currentPermission(): NotifyPermission {
  if (!notificationsSupported()) return "unsupported";
  return Notification.permission;
}

export async function requestPermission(): Promise<NotifyPermission> {
  if (!notificationsSupported()) return "unsupported";
  return Notification.requestPermission();
}

/**
 * Schedule the next reminder for each plant that has reminder days set.
 * Returns a cleanup function that cancels all pending timers.
 *
 * Note: timers only fire while the page is open — a static site can't push
 * to a closed tab without a service worker + push server.
 */
export function scheduleReminders(plants: Plant[]): () => void {
  if (currentPermission() !== "granted") return () => {};

  const timers: ReturnType<typeof setTimeout>[] = [];

  for (const plant of plants) {
    const next = nextReminderTime(plant.reminderDays, plant.reminderTime);
    if (next == null) continue;

    const delay = Math.max(0, next - Date.now());
    // setTimeout caps near 24.8 days; reminder windows are always < 7 days.
    const timer = setTimeout(() => fireReminder(plant), delay);
    timers.push(timer);
  }

  return () => timers.forEach(clearTimeout);
}

function fireReminder(plant: Plant): void {
  const waterTask = plant.tasks.find((t) => t.type === "water");
  try {
    new Notification(`🌱 Time to water ${plant.name}!`, {
      body: waterTask
        ? `Planty Care reminder · water every ${waterTask.intervalDays} days.`
        : "Planty Care watering reminder.",
      icon: plant.image ?? undefined,
      tag: `plantycare-${plant.id}`,
    });
  } catch {
    /* ignore */
  }
}
