import type { Plant } from "../types";
import { waterStatus } from "../lib/watering";
import { formatDateTime } from "../lib/format";
import { WEEKDAY_LABELS } from "../data/presets";
import { cn } from "../lib/util";
import { WaterBadge } from "./ui/Badge";
import { Button } from "./ui/Button";

const borderByUrgency = {
  ok: "border-line",
  soon: "border-water",
  due: "border-water",
  overdue: "border-danger",
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
      : "🔕 No reminder set";

  return (
    <article
      className={cn(
        "overflow-hidden rounded-xl2 border-2 bg-surface",
        borderByUrgency[status.urgency],
      )}
    >
      {plant.image ? (
        <img
          src={plant.image}
          alt={`Photo of ${plant.name}`}
          loading="lazy"
          className="h-52 w-full object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="grid h-52 w-full place-items-center bg-surface-2 text-7xl"
        >
          {plant.emoji}
        </div>
      )}

      <div className="flex flex-col gap-3 p-5">
        <div>
          <h3 className="text-2xl font-bold leading-tight">{plant.name}</h3>
          {plant.species && (
            <p className="text-lg text-ink-soft">{plant.species}</p>
          )}
        </div>

        <WaterBadge urgency={status.urgency} label={status.label} />

        <div className="text-lg text-ink-soft">
          <p>💧 Water every {plant.intervalDays} days</p>
          <p>🗓️ Last watered: {formatDateTime(plant.lastWatered)}</p>
          <p>{reminder}</p>
        </div>

        <div className="mt-1 flex flex-col gap-3">
          <Button size="lg" variant="water" onClick={() => onWater(plant.id)}>
            💧 Water now
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              aria-label={`Edit schedule for ${plant.name}`}
              onClick={() => onEdit(plant.id)}
            >
              ⚙️ Edit
            </Button>
            <Button
              variant="secondary"
              aria-label={`Remove ${plant.name}`}
              onClick={() => onRemove(plant.id)}
            >
              🗑️ Remove
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
