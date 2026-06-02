import type { Plant } from "../types";
import { waterStatus } from "../lib/watering";
import { formatDateTime } from "../lib/format";
import { WEEKDAY_LABELS } from "../data/presets";
import { cn } from "../lib/util";
import { WaterBadge } from "./ui/Badge";
import { Button } from "./ui/Button";

const ringByUrgency = {
  ok: "ring-line",
  soon: "ring-water/40",
  due: "ring-water/70",
  overdue: "ring-danger/70",
} as const;

export function PlantCard({
  plant,
  now,
  onWater,
  onEdit,
  onRemove,
}: {
  plant: Plant;
  now: number;
  onWater: (id: string) => void;
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const status = waterStatus(plant, now);

  const reminder =
    plant.reminderDays.length > 0
      ? `🔔 ${plant.reminderDays
          .slice()
          .sort((a, b) => a - b)
          .map((d) => WEEKDAY_LABELS[d])
          .join(", ")} at ${plant.reminderTime}`
      : "No reminder set";

  return (
    <article
      className={cn(
        "flex flex-col overflow-hidden rounded-xl2 bg-surface ring-1 transition-shadow",
        "shadow-lg shadow-black/20",
        ringByUrgency[status.urgency],
      )}
    >
      {plant.image ? (
        <img
          src={plant.image}
          alt={`Photo of ${plant.name}`}
          loading="lazy"
          className="h-44 w-full object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="grid h-44 w-full place-items-center bg-surface-2 text-6xl"
        >
          {plant.emoji}
        </div>
      )}

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div>
          <h3 className="text-xl font-black leading-tight">{plant.name}</h3>
          {plant.species && (
            <p className="text-sm italic text-muted">{plant.species}</p>
          )}
        </div>

        <WaterBadge urgency={status.urgency} label={status.label} />

        <p className="text-sm text-muted">
          💧 Every {plant.intervalDays} days · Last:{" "}
          {formatDateTime(plant.lastWatered)}
        </p>
        <p className="text-sm text-muted">{reminder}</p>

        <div className="mt-auto flex gap-2 pt-1">
          <Button
            variant="water"
            className="flex-1"
            onClick={() => onWater(plant.id)}
          >
            💧 Water now
          </Button>
          <Button
            variant="secondary"
            size="icon"
            aria-label={`Edit schedule for ${plant.name}`}
            title="Edit schedule"
            onClick={() => onEdit(plant.id)}
          >
            ⚙️
          </Button>
          <Button
            variant="secondary"
            size="icon"
            aria-label={`Remove ${plant.name}`}
            title="Remove plant"
            onClick={() => onRemove(plant.id)}
          >
            🗑️
          </Button>
        </div>
      </div>
    </article>
  );
}
