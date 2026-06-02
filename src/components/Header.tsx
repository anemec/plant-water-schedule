import { cn } from "../lib/util";

export function Header({
  largeText,
  onToggleText,
}: {
  largeText: boolean;
  onToggleText: () => void;
}) {
  return (
    <header className="pt-safe sticky top-0 z-20 border-b border-line/70 bg-canvas/80 backdrop-blur-md md:static">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <span
            aria-hidden="true"
            className="grid size-10 shrink-0 place-items-center rounded-2xl bg-brand/15 text-2xl"
          >
            🌱
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-black tracking-tight sm:text-2xl">
              Planty Care
            </h1>
            <p className="truncate text-xs text-muted">
              Happy, well-watered plants
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleText}
          aria-pressed={largeText}
          title="Toggle extra-large text"
          className={cn(
            "min-h-11 shrink-0 rounded-xl border px-3 font-black transition-colors",
            largeText
              ? "border-brand bg-brand/20 text-brand"
              : "border-line bg-surface text-ink hover:border-brand/60",
          )}
        >
          <span aria-hidden="true">A+</span>
          <span className="sr-only">Toggle extra large text</span>
        </button>
      </div>
    </header>
  );
}
