import type { WaterUrgency } from "../../types";
import { cn } from "../../lib/util";

/** Solid, high-contrast pills. Each on-* pairing is chosen for AAA contrast. */
const styles: Record<WaterUrgency, string> = {
  ok: "bg-brand text-on-brand",
  soon: "bg-water text-on-water",
  due: "bg-water text-on-water",
  overdue: "bg-danger text-on-danger",
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
        "inline-flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-lg font-bold",
        styles[urgency],
      )}
    >
      <span aria-hidden="true" className="text-xl">
        {icons[urgency]}
      </span>
      {label}
    </span>
  );
}
