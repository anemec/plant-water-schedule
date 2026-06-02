import { useEffect, useState } from "react";
import { usePlants } from "./hooks/usePlants";
import { useTheme } from "./hooks/useTheme";
import { useTextScale } from "./hooks/useTextScale";
import { useReminders } from "./hooks/useReminders";
import { Header } from "./components/Header";
import { TabBar, type TabId } from "./components/TabBar";
import { PlantsView } from "./components/PlantsView";
import { AddView } from "./components/AddView";
import { HistoryView } from "./components/HistoryView";
import { ToastHost } from "./components/ui/ToastHost";

export default function App() {
  const { plants, history, actions } = usePlants();
  const { theme, toggle: toggleTheme } = useTheme();
  const { scale, cycle: cycleScale } = useTextScale();
  const { permission, enable } = useReminders(plants);
  const [tab, setTab] = useState<TabId>("plants");

  // Re-render once a minute so "days until due" stays current.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="min-h-svh">
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        scale={scale}
        onCycleScale={cycleScale}
      />
      <TabBar active={tab} onChange={setTab} />

      {/* Single, centered, narrow column — friendly to a narrow visual field. */}
      <main className="mx-auto max-w-xl px-4 py-6 pb-24">
        {tab === "plants" && (
          <PlantsView
            plants={plants}
            now={now}
            actions={actions}
            permission={permission}
            onEnableReminders={() => void enable()}
            onGoToAdd={() => setTab("add")}
          />
        )}
        {tab === "add" && (
          <AddView actions={actions} onAdded={() => setTab("plants")} />
        )}
        {tab === "history" && (
          <HistoryView
            history={history}
            now={now}
            onClear={() => {
              if (window.confirm("Clear the entire watering history?")) {
                actions.clearHistory();
              }
            }}
          />
        )}
      </main>

      <ToastHost />
    </div>
  );
}
