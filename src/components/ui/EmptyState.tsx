import type { ReactNode } from "react";

export function EmptyState({
  emoji,
  title,
  children,
}: {
  emoji: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-3xl border-2 border-dashed border-line bg-surface px-6 py-14 text-center shadow-lg shadow-black/20">
      <div aria-hidden="true" className="text-7xl">
        {emoji}
      </div>
      <h3 className="mt-4 text-2xl font-bold">{title}</h3>
      <div className="mt-2 text-xl text-ink-soft">{children}</div>
    </div>
  );
}
