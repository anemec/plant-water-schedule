import type { WaterUrgency } from "../../types";
import { cn } from "../../lib/util";

const styles: Record<WaterUrgency, string> = {
  ok: "bg-brand/15 text-brand",
  soon: "bg-water/15 text-water",
  due: "bg-water/25 text-water",
  overdue: "bg-danger/20 text-danger",
};

const icons: Record<WaterUrgency, string> = {
  ok: "✓",
  soon: "⏳",
  due: "💧",
  overdue: "⚠️",
};

export function WaterBadge({
  urgency,
  label,
}: {
  urgency: WaterUrgency;
  label: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold",
        styles[urgency],
      )}
    >
      <span aria-hidden="true">{icons[urgency]}</span>
      {label}
    </span>
  );
}
