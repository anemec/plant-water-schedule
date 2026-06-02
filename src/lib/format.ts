/** "Never" or a short, locale-aware date+time, e.g. "Mon, Jun 2, 9:00 AM". */
export function formatDateTime(ts: number | null): string {
  if (ts == null) return "Never";
  return new Date(ts).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Friendly relative day label: "Today", "Yesterday", or "3 days ago". */
export function formatRelativeDay(ts: number, now: number = Date.now()): string {
  const startOfDay = (t: number) => {
    const d = new Date(t);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };
  const diffDays = Math.round(
    (startOfDay(now) - startOfDay(ts)) / (24 * 60 * 60 * 1000),
  );
  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return new Date(ts).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}
