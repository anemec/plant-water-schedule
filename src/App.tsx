import { useEffect, useState } from "react";
import { usePlants } from "./hooks/usePlants";
import { useTextSize } from "./hooks/useTextSize";
import { useReminders } from "./hooks/useReminders";
import { Header } from "./components/Header";
import { TabBar, type TabId } from "./components/TabBar";
import { PlantsView } from "./components/PlantsView";
import { AddView } from "./components/AddView";
import { HistoryView } from "./components/HistoryView";
import { ToastHost } from "./components/ui/ToastHost";

export default function App() {
  const { plants, history, actions } = usePlants();
  const { large, toggle } = useTextSize();
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
      <Header largeText={large} onToggleText={toggle} />

      <main className="mx-auto max-w-4xl px-4 pt-5 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-8">
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

      <TabBar active={tab} onChange={setTab} />
      <ToastHost />
    </div>
  );
}
