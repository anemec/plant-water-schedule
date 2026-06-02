import { useEffect, useRef, useState } from "react";
import type { Plant, Weekday } from "../types";
import { WEEKDAY_LABELS } from "../data/presets";
import { cn } from "../lib/util";
import { Button } from "./ui/Button";

const ALL_DAYS: Weekday[] = [0, 1, 2, 3, 4, 5, 6];

export function ScheduleDialog({
  plant,
  onClose,
  onSave,
}: {
  plant: Plant | null;
  onClose: () => void;
  onSave: (patch: Pick<Plant, "intervalDays" | "reminderDays" | "reminderTime">) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [intervalDays, setIntervalDays] = useState(7);
  const [days, setDays] = useState<Weekday[]>([]);
  const [time, setTime] = useState("09:00");

  // Open/close the native dialog in step with the `plant` prop.
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (plant) {
      setIntervalDays(plant.intervalDays);
      setDays(plant.reminderDays);
      setTime(plant.reminderTime);
      if (!el.open) el.showModal();
    } else if (el.open) {
      el.close();
    }
  }, [plant]);

  function toggleDay(day: Weekday) {
    setDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const safeInterval =
      Number.isFinite(intervalDays) && intervalDays >= 1 && intervalDays <= 365
        ? Math.round(intervalDays)
        : 7;
    onSave({
      intervalDays: safeInterval,
      reminderDays: [...days].sort((a, b) => a - b),
      reminderTime: time || "09:00",
    });
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby="schedule-title"
      className={cn(
        "m-auto w-[92%] max-w-md rounded-xl2 bg-surface p-6 text-ink shadow-2xl",
        "backdrop:bg-black/60 backdrop:backdrop-blur-sm",
      )}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h2 id="schedule-title" className="text-2xl font-black">
          {plant ? `Schedule for ${plant.name}` : "Watering schedule"}
        </h2>

        <label className="flex flex-col gap-1.5 font-bold">
          Water every (days)
          <input
            type="number"
            min={1}
            max={365}
            inputMode="numeric"
            value={intervalDays}
            onChange={(e) => setIntervalDays(e.target.valueAsNumber)}
            className="min-h-12 rounded-xl border border-line bg-canvas px-3 text-base font-normal"
          />
        </label>

        <fieldset className="rounded-xl border border-line p-3">
          <legend className="px-1 font-bold">Remind me on these days</legend>
          <div className="flex flex-wrap gap-2">
            {ALL_DAYS.map((day) => {
              const on = days.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  aria-pressed={on}
                  className={cn(
                    "min-h-11 min-w-11 rounded-full border px-3 font-bold transition-colors",
                    on
                      ? "border-brand bg-brand text-canvas"
                      : "border-line bg-canvas text-ink hover:border-brand/60",
                  )}
                >
                  {WEEKDAY_LABELS[day]}
                </button>
              );
            })}
          </div>
        </fieldset>

        <label className="flex flex-col gap-1.5 font-bold">
          Reminder time
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="min-h-12 rounded-xl border border-line bg-canvas px-3 text-base font-normal [color-scheme:dark]"
          />
        </label>

        <div className="mt-2 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save
          </Button>
        </div>
      </form>
    </dialog>
  );
}
