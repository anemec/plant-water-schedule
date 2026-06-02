import type { HistoryEntry } from "../types";
import { formatDateTime, formatRelativeDay } from "../lib/format";
import { CARE_META } from "../data/presets";
import { Button } from "./ui/Button";
import { EmptyState } from "./ui/EmptyState";
import { ScreenHeader } from "./ui/ScreenHeader";
import { Icon } from "./ui/Icon";
import { WateringCan } from "./ui/illustrations";

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
    <section aria-label="Care history" className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ScreenHeader
          icon={<Icon name="history" />}
          title="History"
          subtitle="Everything you’ve done."
        />
        {history.length > 0 && (
          <Button variant="danger" onClick={onClear}>
            <Icon name="trash" className="size-6" />
            Clear
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <EmptyState illustration={<WateringCan />} title="No history yet">
          Care for a plant and it’ll show up here.
        </EmptyState>
      ) : (
        <ol className="flex flex-col gap-4">
          {history.map((entry) => {
            const meta = CARE_META[entry.taskType];
            return (
              <li
                key={entry.id}
                className="animate-rise flex items-center gap-4 rounded-3xl border-2 border-line border-l-8 border-l-brand bg-surface px-5 py-4 shadow-md shadow-black/20"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand/12 text-brand">
                  <Icon name={meta.icon} className="size-7" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xl font-bold">
                    {meta.verb} {entry.plantName}
                  </p>
                  <p className="text-lg text-ink-soft">
                    {formatRelativeDay(entry.at, now)} ·{" "}
                    {formatDateTime(entry.at)}
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
