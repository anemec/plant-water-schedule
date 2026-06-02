import { useState } from "react";
import type { CareType, Plant } from "../types";
import type { PlantActions } from "../hooks/usePlants";
import type { NotifyPermission } from "../lib/notifications";
import { dueTaskCount, plantSoonestDue } from "../lib/care";
import { CARE_META } from "../data/presets";
import { showToast } from "../lib/toast";
import { cn } from "../lib/util";
import { PlantCard } from "./PlantCard";
import { ScheduleDialog } from "./ScheduleDialog";
import { Button } from "./ui/Button";
import { EmptyState } from "./ui/EmptyState";
import { ScreenHeader } from "./ui/ScreenHeader";
import { PottedPlant, Sprout } from "./ui/illustrations";

export function PlantsView({
  plants,
  now,
  actions,
  permission,
  onEnableReminders,
  onGoToAdd,
}: {
  plants: Plant[];
  now: number;
  actions: PlantActions;
  permission: NotifyPermission;
  onEnableReminders: () => void;
  onGoToAdd: () => void;
}) {
  const [editing, setEditing] = useState<Plant | null>(null);

  const sorted = [...plants].sort(
    (a, b) => plantSoonestDue(a, now) - plantSoonestDue(b, now),
  );

  function handleDoTask(id: string, type: CareType) {
    const plant = plants.find((p) => p.id === id);
    actions.doTask(id, type);
    if (plant)
      showToast(`${CARE_META[type].verb} ${plant.name} ${CARE_META[type].emoji}`);
  }

  function handleRemove(id: string) {
    const plant = plants.find((p) => p.id === id);
    if (!plant) return;
    if (!window.confirm(`Remove “${plant.name}” from your plants?`)) return;
    actions.removePlant(id);
  }

  return (
    <section aria-label="My plants" className="flex flex-col gap-5">
      <ScreenHeader
        icon="🪴"
        title="My plants"
        subtitle="Tap a task when it’s done."
      />
      <ReminderBanner permission={permission} onEnable={onEnableReminders} />

      {plants.length === 0 ? (
        <EmptyState illustration={<Sprout />} title="No plants yet">
          Plant your first green friend to get started.
          <div className="mt-5">
            <Button size="lg" onClick={onGoToAdd}>
              ➕ Add a plant
            </Button>
          </div>
        </EmptyState>
      ) : (
        <div className="flex flex-col gap-5">
          <SummaryHero plants={plants} now={now} />
          {sorted.map((plant) => (
            <PlantCard
              key={plant.id}
              plant={plant}
              now={now}
              onDoTask={handleDoTask}
              onEdit={() => setEditing(plant)}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}

      <ScheduleDialog
        plant={editing}
        onClose={() => setEditing(null)}
        onSave={(patch) => {
          if (!editing) return;
          actions.updatePlantCare(editing.id, patch);
          showToast(`Care saved for ${editing.name}`);
          setEditing(null);
        }}
      />
    </section>
  );
}

function SummaryHero({ plants, now }: { plants: Plant[]; now: number }) {
  const due = dueTaskCount(plants, now);
  const allHappy = due === 0;

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-3xl border-2 bg-surface p-5 shadow-lg shadow-black/25",
        allHappy ? "border-brand" : "border-accent",
      )}
    >
      <span
        className={cn("w-16 shrink-0", allHappy ? "text-brand animate-pop" : "text-accent")}
      >
        {allHappy ? <PottedPlant /> : <Sprout />}
      </span>
      <div className="min-w-0">
        <p className="font-display text-2xl font-semibold leading-tight">
          {allHappy ? "All caught up!" : `${due} task${due === 1 ? "" : "s"} due`}
        </p>
        <p className="text-lg text-ink-soft">
          {allHappy
            ? "Every plant is happy right now."
            : `${due} care task${due === 1 ? "" : "s"} need doing today.`}
        </p>
      </div>
    </div>
  );
}

function ReminderBanner({
  permission,
  onEnable,
}: {
  permission: NotifyPermission;
  onEnable: () => void;
}) {
  if (permission === "granted") {
    return (
      <p className="rounded-2xl border-2 border-brand bg-surface px-5 py-4 text-lg">
        🔔 Reminders are on. Keep this page open to receive watering alerts.
      </p>
    );
  }
  if (permission === "unsupported" || permission === "denied") {
    return (
      <p className="rounded-2xl border-2 border-line bg-surface px-5 py-4 text-lg text-ink-soft">
        {permission === "denied"
          ? "Reminders are blocked in your browser settings."
          : "Reminders aren’t supported on this browser."}
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-3 rounded-2xl border-2 border-line bg-surface px-5 py-4">
      <p className="text-lg">Turn on reminders to get watering alerts.</p>
      <Button variant="primary" onClick={onEnable}>
        🔔 Enable reminders
      </Button>
    </div>
  );
}
