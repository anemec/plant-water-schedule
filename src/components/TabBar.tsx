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
    // Sticky at the top, but the controls stay inside the centered column
    // so they remain within a narrow (tunnel) visual field.
    <nav
      aria-label="Main sections"
      className="sticky top-0 z-20 border-b-2 border-line bg-canvas"
    >
      <div className="mx-auto grid max-w-xl grid-cols-3 gap-2 px-4 py-3">
        {TABS.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-xl2 border-2 font-bold transition-colors",
                isActive
                  ? "border-brand bg-brand text-on-brand shadow-lg shadow-brand/30"
                  : "border-line bg-surface-2 text-ink hover:border-brand",
              )}
            >
              <span aria-hidden="true" className="text-2xl">
                {tab.icon}
              </span>
              <span className="text-base">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
