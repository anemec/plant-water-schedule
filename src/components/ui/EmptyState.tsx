import type { ReactNode } from "react";

export function EmptyState({
  illustration,
  title,
  children,
}: {
  /** A botanical illustration (rendered in the brand color). */
  illustration: ReactNode;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="animate-rise rounded-3xl border-2 border-dashed border-line bg-surface px-6 py-14 text-center shadow-lg shadow-black/25">
      <div className="mx-auto mb-2 w-28 text-brand">{illustration}</div>
      <h3 className="font-display text-3xl font-semibold">{title}</h3>
      <div className="mt-2 text-xl text-ink-soft">{children}</div>
    </div>
  );
}
