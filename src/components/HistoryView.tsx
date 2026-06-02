import type { HistoryEntry } from "../types";
import { formatDateTime, formatRelativeDay } from "../lib/format";
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
    <section aria-label="Watering history" className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-black">Watering History</h2>
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
        <ol className="flex flex-col gap-3">
          {history.map((entry) => (
            <li
              key={entry.id}
              className="flex items-center gap-3 rounded-xl border-l-4 border-water bg-surface px-4 py-3 shadow-md shadow-black/20"
            >
              <span aria-hidden="true" className="text-2xl">
                {entry.emoji || "💧"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-black">{entry.plantName}</p>
                <p className="text-sm text-muted">
                  {formatRelativeDay(entry.at, now)} · {formatDateTime(entry.at)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
