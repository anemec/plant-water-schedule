import { useState } from "react";
import type { Plant } from "../types";
import type { PlantActions } from "../hooks/usePlants";
import type { NotifyPermission } from "../lib/notifications";
import { byUrgency } from "../lib/watering";
import { showToast } from "../lib/toast";
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
      <ReminderBanner
        permission={permission}
        onEnable={onEnableReminders}
      />

      {plants.length === 0 ? (
        <EmptyState emoji="🌿" title="No plants yet">
          Tap <strong>Add</strong> to plant your first green friend.
          <div className="mt-4">
            <Button onClick={onGoToAdd}>➕ Add a plant</Button>
          </div>
        </EmptyState>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

function ReminderBanner({
  permission,
  onEnable,
}: {
  permission: NotifyPermission;
  onEnable: () => void;
}) {
  if (permission === "granted") {
    return (
      <p className="rounded-xl bg-brand/10 px-4 py-3 text-sm text-brand">
        🔔 Reminders are on. Keep this page open to receive watering alerts.
      </p>
    );
  }
  if (permission === "unsupported" || permission === "denied") {
    return (
      <p className="rounded-xl bg-surface px-4 py-3 text-sm text-muted">
        {permission === "denied"
          ? "Reminders are blocked in your browser settings."
          : "Reminders aren’t supported on this browser."}
      </p>
    );
  }
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-surface px-4 py-3">
      <p className="text-sm text-muted">
        Turn on reminders to get watering alerts.
      </p>
      <Button variant="secondary" onClick={onEnable}>
        🔔 Enable reminders
      </Button>
    </div>
  );
}
