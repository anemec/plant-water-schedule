import { useState } from "react";
import type { Plant } from "../types";
import type { PlantActions } from "../hooks/usePlants";
import type { NotifyPermission } from "../lib/notifications";
import { byUrgency, daysUntilDue } from "../lib/watering";
import { showToast } from "../lib/toast";
import { cn } from "../lib/util";
import { PlantCard } from "./PlantCard";
import { ScheduleDialog } from "./ScheduleDialog";
import { Button } from "./ui/Button";
import { EmptyState } from "./ui/EmptyState";

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

  const sorted = [...plants].sort((a, b) => byUrgency(a, b, now));

  function handleWater(id: string) {
    const plant = plants.find((p) => p.id === id);
    actions.waterPlant(id);
    if (plant) showToast(`Watered ${plant.name} 💧`);
  }

  function handleRemove(id: string) {
    const plant = plants.find((p) => p.id === id);
    if (!plant) return;
    if (!window.confirm(`Remove “${plant.name}” from your plants?`)) return;
    actions.removePlant(id);
  }

  return (
    <section aria-label="My plants" className="flex flex-col gap-5">
      <ReminderBanner permission={permission} onEnable={onEnableReminders} />

      {plants.length === 0 ? (
        <EmptyState emoji="🌿" title="No plants yet">
          Tap <strong>Add</strong> to plant your first green friend.
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
              onWater={handleWater}
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
          actions.updateSchedule(editing.id, patch);
          showToast(`Schedule saved for ${editing.name}`);
          setEditing(null);
        }}
      />
    </section>
  );
}

function SummaryHero({ plants, now }: { plants: Plant[]; now: number }) {
  const needWater = plants.filter((p) => daysUntilDue(p, now) <= 0).length;
  const allHappy = needWater === 0;

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-3xl border-2 bg-surface p-5 shadow-lg shadow-black/20",
        allHappy ? "border-brand" : "border-water",
      )}
    >
      <span aria-hidden="true" className="text-5xl">
        {allHappy ? "🌿" : "💧"}
      </span>
      <div>
        <p className="text-2xl font-bold leading-tight">
          {allHappy ? "All caught up!" : `${needWater} need water`}
        </p>
        <p className="text-lg text-ink-soft">
          {allHappy
            ? "Every plant is happy right now."
            : `${needWater} of your ${plants.length} plants ${
                needWater === 1 ? "is" : "are"
              } due today.`}
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
      <p className="rounded-xl2 border-2 border-brand bg-surface px-5 py-4 text-lg">
        🔔 Reminders are on. Keep this page open to receive watering alerts.
      </p>
    );
  }
  if (permission === "unsupported" || permission === "denied") {
    return (
      <p className="rounded-xl2 border-2 border-line bg-surface px-5 py-4 text-lg text-ink-soft">
        {permission === "denied"
          ? "Reminders are blocked in your browser settings."
          : "Reminders aren’t supported on this browser."}
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-3 rounded-xl2 border-2 border-line bg-surface px-5 py-4">
      <p className="text-lg">Turn on reminders to get watering alerts.</p>
      <Button variant="primary" onClick={onEnable}>
        🔔 Enable reminders
      </Button>
    </div>
  );
}
