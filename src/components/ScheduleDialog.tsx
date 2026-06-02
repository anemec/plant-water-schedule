import { useEffect, useRef, useState } from "react";
import type { CareTask, CareType, Plant, Weekday } from "../types";
import { CARE_META, CARE_TYPES, WEEKDAY_LABELS } from "../data/presets";
import { cn } from "../lib/util";
import { Button } from "./ui/Button";

const ALL_DAYS: Weekday[] = [0, 1, 2, 3, 4, 5, 6];

interface TaskDraft {
  enabled: boolean;
  intervalDays: number;
  lastDone: number | null;
}

type Drafts = Record<CareType, TaskDraft>;

function draftsFromPlant(plant: Plant | null): Drafts {
  const byType = new Map(plant?.tasks.map((t) => [t.type, t]) ?? []);
  const make = (type: CareType): TaskDraft => {
    const existing = byType.get(type);
    return {
      enabled: type === "water" ? true : Boolean(existing),
      intervalDays: existing?.intervalDays ?? CARE_META[type].defaultInterval,
      lastDone: existing?.lastDone ?? null,
    };
  };
  return {
    water: make("water"),
    fertilize: make("fertilize"),
    rotate: make("rotate"),
    repot: make("repot"),
  };
}

export function ScheduleDialog({
  plant,
  onClose,
  onSave,
}: {
  plant: Plant | null;
  onClose: () => void;
  onSave: (patch: {
    tasks: CareTask[];
    reminderDays: Weekday[];
    reminderTime: string;
  }) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [drafts, setDrafts] = useState<Drafts>(() => draftsFromPlant(null));
  const [days, setDays] = useState<Weekday[]>([]);
  const [time, setTime] = useState("09:00");

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (plant) {
      setDrafts(draftsFromPlant(plant));
      setDays(plant.reminderDays);
      setTime(plant.reminderTime);
      if (!el.open) el.showModal();
    } else if (el.open) {
      el.close();
    }
  }, [plant]);

  function setDraft(type: CareType, patch: Partial<TaskDraft>) {
    setDrafts((d) => ({ ...d, [type]: { ...d[type], ...patch } }));
  }

  function toggleDay(day: Weekday) {
    setDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const tasks: CareTask[] = CARE_TYPES.filter((t) => drafts[t].enabled).map(
      (t) => {
        const iv = drafts[t].intervalDays;
        return {
          type: t,
          intervalDays: Number.isFinite(iv) && iv >= 1 && iv <= 365 ? Math.round(iv) : CARE_META[t].defaultInterval,
          lastDone: drafts[t].lastDone,
        };
      },
    );
    onSave({
      tasks,
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
        "m-auto max-h-[90vh] w-[92%] max-w-lg overflow-auto rounded-xl2 border-2 border-line bg-surface p-6 text-ink",
        "backdrop:bg-black/70",
      )}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <h2 id="schedule-title" className="text-2xl font-bold">
          {plant ? `Care for ${plant.name}` : "Care schedule"}
        </h2>

        <fieldset className="flex flex-col gap-3">
          <legend className="mb-1 text-lg font-bold">Care tasks</legend>
          {CARE_TYPES.map((type) => {
            const meta = CARE_META[type];
            const draft = drafts[type];
            const locked = type === "water";
            return (
              <div key={type} className="rounded-2xl border-2 border-line p-3">
                <label className="flex items-center gap-3 text-lg font-bold">
                  <input
                    type="checkbox"
                    checked={draft.enabled}
                    disabled={locked}
                    onChange={(e) => setDraft(type, { enabled: e.target.checked })}
                    className="size-6 accent-brand"
                  />
                  <span aria-hidden="true">{meta.emoji}</span> {meta.label}
                  {locked && (
                    <span className="text-base font-normal text-ink-soft">
                      (always on)
                    </span>
                  )}
                </label>
                {draft.enabled && (
                  <label className="mt-3 flex items-center justify-between gap-3 text-base font-bold">
                    Every (days)
                    <input
                      type="number"
                      min={1}
                      max={365}
                      inputMode="numeric"
                      value={draft.intervalDays}
                      onChange={(e) =>
                        setDraft(type, { intervalDays: e.target.valueAsNumber })
                      }
                      className="min-h-12 w-28 rounded-xl border-2 border-line bg-canvas px-3 text-lg font-normal"
                    />
                  </label>
                )}
              </div>
            );
          })}
        </fieldset>

        <fieldset className="rounded-2xl border-2 border-line p-4">
          <legend className="px-1 text-lg font-bold">Watering reminder</legend>
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
                    "min-h-13 min-w-13 rounded-xl2 border-2 px-3 text-lg font-bold transition-colors",
                    on
                      ? "border-brand bg-brand text-on-brand"
                      : "border-line bg-canvas text-ink hover:border-brand",
                  )}
                >
                  {WEEKDAY_LABELS[day]}
                </button>
              );
            })}
          </div>
          <label className="mt-3 flex items-center justify-between gap-3 text-base font-bold">
            Time
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="min-h-12 rounded-xl border-2 border-line bg-canvas px-3 text-lg font-normal"
            />
          </label>
        </fieldset>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            💾 Save
          </Button>
        </div>
      </form>
    </dialog>
  );
}
