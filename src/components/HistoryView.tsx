import type { HistoryEntry } from "../types";
import { formatDateTime, formatRelativeDay } from "../lib/format";
import { CARE_META } from "../data/presets";
import { Button } from "./ui/Button";
import { EmptyState } from "./ui/EmptyState";

export function HistoryView({
  history,
  now,
  onClear,
}: {
  history: HistoryEntry[];
  now: number;
  onClear: () => void;
}) {
  return (
    <section aria-label="Watering history" className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold">Watering History</h2>
        {history.length > 0 && (
          <Button variant="danger" onClick={onClear}>
            🗑️ Clear
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <EmptyState emoji="💧" title="No waterings yet">
          Water a plant and it’ll show up here.
        </EmptyState>
      ) : (
        <ol className="flex flex-col gap-4">
          {history.map((entry) => {
            const meta = CARE_META[entry.taskType];
            return (
              <li
                key={entry.id}
                className="flex items-center gap-4 rounded-xl2 border-2 border-line border-l-8 border-l-water bg-surface px-5 py-4"
              >
                <span aria-hidden="true" className="text-4xl">
                  {meta.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xl font-bold">
                    {meta.verb} {entry.plantName}
                  </p>
                  <p className="text-lg text-ink-soft">
                    {formatRelativeDay(entry.at, now)} · {formatDateTime(entry.at)}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
