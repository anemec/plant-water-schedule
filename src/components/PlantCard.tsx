import type { CareTask, CareType, Plant } from "../types";
import { careProgress, careStatus, daysUntilDue } from "../lib/care";
import { formatDateTime } from "../lib/format";
import { CARE_META, CARE_TYPES, WEEKDAY_LABELS } from "../data/presets";
import { cn } from "../lib/util";
import { WaterBadge } from "./ui/Badge";
import { WaterProgress } from "./ui/WaterProgress";
import { Button } from "./ui/Button";

const borderByUrgency = {
  ok: "border-line",
  soon: "border-water/70",
  due: "border-water",
  overdue: "border-danger",
} as const;

function orderedTasks(plant: Plant): CareTask[] {
  return [...plant.tasks].sort(
    (a, b) => CARE_TYPES.indexOf(a.type) - CARE_TYPES.indexOf(b.type),
  );
}

export function PlantCard({
  plant,
  now,
  onDoTask,
  onEdit,
  onRemove,
}: {
  plant: Plant;
  now: number;
  onDoTask: (id: string, type: CareType) => void;
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const tasks = orderedTasks(plant);
  // Card border reflects the most urgent task.
  const mostUrgent = tasks.reduce<CareTask | null>(
    (acc, t) =>
      acc == null || daysUntilDue(t, now) < daysUntilDue(acc, now) ? t : acc,
    null,
  );
  const borderUrgency = mostUrgent
    ? careStatus(mostUrgent, now).urgency
    : "ok";

  const reminder =
    plant.reminderDays.length > 0
      ? `🔔 ${plant.reminderDays
          .slice()
          .sort((a, b) => a - b)
          .map((d) => WEEKDAY_LABELS[d])
          .join(", ")} at ${plant.reminderTime}`
      : "🔕 No watering reminder";

  return (
    <article
      className={cn(
        "overflow-hidden rounded-3xl border-2 bg-surface",
        borderByUrgency[borderUrgency],
      )}
    >
      <div className="relative">
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
            className="grid h-52 w-full place-items-center bg-gradient-to-br from-surface-2 to-surface text-7xl"
          >
            {plant.emoji}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 p-5">
        <div>
          <h3 className="text-2xl font-bold leading-tight">{plant.name}</h3>
          {plant.species && (
            <p className="text-lg text-ink-soft">{plant.species}</p>
          )}
        </div>

        {tasks.map((task) => (
          <TaskRow
            key={task.type}
            task={task}
            now={now}
            onDo={() => onDoTask(plant.id, task.type)}
          />
        ))}

        <p className="text-base text-ink-soft">{reminder}</p>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="secondary"
            aria-label={`Edit care for ${plant.name}`}
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
    </article>
  );
}

function TaskRow({
  task,
  now,
  onDo,
}: {
  task: CareTask;
  now: number;
  onDo: () => void;
}) {
  const meta = CARE_META[task.type];
  const status = careStatus(task, now);

  return (
    <div className="rounded-2xl bg-surface-2 p-4">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <span className="text-lg font-bold">
          <span aria-hidden="true">{meta.emoji}</span> {meta.label}
        </span>
        <WaterBadge urgency={status.urgency} label={status.label} />
      </div>
      <WaterProgress urgency={status.urgency} progress={careProgress(task, now)} />
      <p className="mt-2 text-base text-ink-soft">
        Every {task.intervalDays} days · Last: {formatDateTime(task.lastDone)}
      </p>
      <div className="mt-3">
        <Button size="lg" variant="water" onClick={onDo}>
          {meta.emoji} {meta.label} now
        </Button>
      </div>
    </div>
  );
}
