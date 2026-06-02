import type { WaterUrgency } from "../../types";

const fill: Record<WaterUrgency, string> = {
  ok: "bg-brand",
  soon: "bg-water",
  due: "bg-water",
  overdue: "bg-danger",
};

/**
 * A thick progress bar showing how close a plant is to its next watering.
 * Decorative (the status badge carries the meaning in words), so hidden
 * from assistive tech.
 */
export function WaterProgress({
  urgency,
  progress,
}: {
  urgency: WaterUrgency;
  progress: number;
}) {
  const pct = Math.round(progress * 100);
  return (
    <div
      aria-hidden="true"
      className="h-3 w-full overflow-hidden rounded-full bg-surface-2"
    >
      <div
        className={`h-full rounded-full transition-[width] duration-500 ${fill[urgency]}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
