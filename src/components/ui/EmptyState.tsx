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
    <div className="rounded-xl2 border-2 border-line bg-surface px-6 py-12 text-center">
      <div aria-hidden="true" className="text-6xl">
        {emoji}
      </div>
      <h3 className="mt-4 text-2xl font-bold">{title}</h3>
      <div className="mt-2 text-xl text-ink-soft">{children}</div>
    </div>
  );
}
