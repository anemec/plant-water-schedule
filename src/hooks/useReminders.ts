import { useCallback, useEffect, useState } from "react";
import type { Plant } from "../types";
import {
  currentPermission,
  requestPermission,
  scheduleReminders,
  type NotifyPermission,
} from "../lib/notifications";

/**
 * Manages notification permission and (re)schedules reminders whenever the
 * plant list changes. Returns the current permission and an enable() action.
 */
export function useReminders(plants: Plant[]): {
  permission: NotifyPermission;
  enable: () => Promise<void>;
} {
  const [permission, setPermission] = useState<NotifyPermission>(() =>
    currentPermission(),
  );

  const enable = useCallback(async () => {
    setPermission(await requestPermission());
  }, []);

  useEffect(() => {
    if (permission !== "granted") return;
    const cancel = scheduleReminders(plants);
    return cancel;
  }, [plants, permission]);

  return { permission, enable };
}
