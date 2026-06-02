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
    <div className="rounded-xl2 bg-surface px-6 py-12 text-center shadow-lg shadow-black/20">
      <div aria-hidden="true" className="text-5xl">
        {emoji}
      </div>
      <h3 className="mt-3 text-xl font-black">{title}</h3>
      <div className="mt-1 text-muted">{children}</div>
    </div>
  );
}
