import type { CareUrgency } from "../../types";
import { cn } from "../../lib/util";
import { Icon, type IconName } from "./Icon";

/** Solid, high-contrast pills. Each on-* pairing is chosen for AAA contrast. */
const styles: Record<CareUrgency, string> = {
  ok: "bg-brand text-on-brand",
  soon: "bg-water text-on-water",
  due: "bg-water text-on-water",
  overdue: "bg-danger text-on-danger",
};

const icons: Record<CareUrgency, IconName> = {
  ok: "check",
  soon: "clock",
  due: "water",
  overdue: "warning",
};

export function WaterBadge({
  urgency,
  label,
}: {
  urgency: CareUrgency;
  label: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full px-3.5 py-1.5 text-lg font-bold",
        styles[urgency],
      )}
    >
      <Icon name={icons[urgency]} className="size-5" />
      {label}
    </span>
  );
}
