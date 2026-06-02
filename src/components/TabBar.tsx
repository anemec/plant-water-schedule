import { cn } from "../lib/util";

export type TabId = "plants" | "add" | "history";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "plants", label: "My Plants", icon: "🪴" },
  { id: "add", label: "Add", icon: "➕" },
  { id: "history", label: "History", icon: "📋" },
];

export function TabBar({
  active,
  onChange,
}: {
  active: TabId;
  onChange: (tab: TabId) => void;
}) {
  return (
    <nav
      aria-label="Main sections"
      className={cn(
        // Mobile: fixed bottom bar in the thumb zone.
        "pb-safe fixed inset-x-0 bottom-0 z-20 border-t border-line bg-canvas/90 backdrop-blur-md",
        // Desktop: a centered top bar under the header.
        "md:sticky md:top-0 md:border-t-0 md:border-b md:bg-canvas/80",
      )}
    >
      <div className="mx-auto flex max-w-4xl">
        {TABS.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 font-bold transition-colors",
                "min-h-15 md:min-h-14 md:flex-row md:gap-2 md:text-lg",
                isActive
                  ? "text-brand"
                  : "text-muted hover:text-ink",
              )}
            >
              <span aria-hidden="true" className="text-2xl md:text-xl">
                {tab.icon}
              </span>
              <span className="text-xs md:text-base">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
