import type { ReactNode } from "react";

/** Consistent per-screen heading (editorial display title + subtitle). */
export function ScreenHeader({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      {icon && (
        <span
          aria-hidden="true"
          className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand/12 text-3xl text-brand"
        >
          {icon}
        </span>
      )}
      <div className="min-w-0">
        <h2 className="font-display text-3xl font-semibold leading-tight">
          {title}
        </h2>
        {subtitle && <p className="text-lg text-ink-soft">{subtitle}</p>}
      </div>
    </div>
  );
}
