import { cn } from "../lib/util";
import { Icon, type IconName } from "./ui/Icon";

export type TabId = "plants" | "add" | "explore" | "history";

const TABS: { id: TabId; label: string; icon: IconName }[] = [
  { id: "plants", label: "Plants", icon: "plant" },
  { id: "add", label: "Add", icon: "add" },
  { id: "explore", label: "Explore", icon: "explore" },
  { id: "history", label: "History", icon: "history" },
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
      <div className="mx-auto grid max-w-xl grid-cols-4 gap-2 px-4 py-3">
        {TABS.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-xl2 border-2 px-1 font-bold transition-colors",
                isActive
                  ? "border-brand bg-brand text-on-brand shadow-lg shadow-brand/30"
                  : "border-line bg-surface-2 text-ink hover:border-brand",
              )}
            >
              <Icon name={tab.icon} className="size-7" />
              <span className="text-sm">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
