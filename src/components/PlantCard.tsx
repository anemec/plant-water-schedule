import type { CareTask, CareType, Plant } from "../types";
import { careProgress, careStatus, daysUntilDue } from "../lib/care";
import { formatDateTime } from "../lib/format";
import { CARE_META, CARE_TYPES, WEEKDAY_LABELS } from "../data/presets";
import { cn } from "../lib/util";
import { WaterBadge } from "./ui/Badge";
import { WaterProgress } from "./ui/WaterProgress";
import { Button } from "./ui/Button";
import { Icon } from "./ui/Icon";
import { PottedPlant } from "./ui/illustrations";

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
  const mostUrgent = tasks.reduce<CareTask | null>(
    (acc, t) =>
      acc == null || daysUntilDue(t, now) < daysUntilDue(acc, now) ? t : acc,
    null,
  );
  const borderUrgency = mostUrgent ? careStatus(mostUrgent, now).urgency : "ok";

  const reminderText =
    plant.reminderDays.length > 0
      ? `${plant.reminderDays
          .slice()
          .sort((a, b) => a - b)
          .map((d) => WEEKDAY_LABELS[d])
          .join(", ")} at ${plant.reminderTime}`
      : "No watering reminder";

  return (
    <article
      className={cn(
        "animate-rise overflow-hidden rounded-3xl border-2 bg-surface shadow-lg shadow-black/25",
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
            className="grid h-52 w-full place-items-center bg-gradient-to-br from-surface-2 to-surface"
          >
            <PottedPlant className="w-24 text-brand/70" />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 p-5">
        <div>
          <h3 className="font-display text-2xl font-semibold leading-tight">
            {plant.name}
          </h3>
          {plant.species && (
            <p className="text-lg italic text-ink-soft">{plant.species}</p>
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

        <p className="flex items-center gap-2 text-base text-ink-soft">
          <Icon
            name={plant.reminderDays.length > 0 ? "bell" : "bellOff"}
            className="size-5 shrink-0"
          />
          {reminderText}
        </p>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="secondary"
            aria-label={`Edit care for ${plant.name}`}
            onClick={() => onEdit(plant.id)}
          >
            <Icon name="edit" className="size-6" />
            Edit
          </Button>
          <Button
            variant="secondary"
            aria-label={`Remove ${plant.name}`}
            onClick={() => onRemove(plant.id)}
          >
            <Icon name="trash" className="size-6" />
            Remove
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
        <span className="flex items-center gap-2 text-lg font-bold">
          <Icon name={meta.icon} className="size-6 text-brand" />
          {meta.label}
        </span>
        <WaterBadge urgency={status.urgency} label={status.label} />
      </div>
      <WaterProgress urgency={status.urgency} progress={careProgress(task, now)} />
      <p className="mt-2 text-base text-ink-soft">
        Every {task.intervalDays} days · Last: {formatDateTime(task.lastDone)}
      </p>
      <div className="mt-3">
        <Button size="lg" variant="water" onClick={onDo}>
          <Icon name={meta.icon} className="size-6" />
          {meta.label} now
        </Button>
      </div>
    </div>
  );
}
