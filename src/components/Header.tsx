import type { Theme } from "../hooks/useTheme";
import { SCALE_LABELS, type TextScale } from "../hooks/useTextScale";
import { Button } from "./ui/Button";
import { Icon } from "./ui/Icon";

export function Header({
  theme,
  onToggleTheme,
  scale,
  onCycleScale,
}: {
  theme: Theme;
  onToggleTheme: () => void;
  scale: TextScale;
  onCycleScale: () => void;
}) {
  return (
    <header className="pt-safe border-b-2 border-line bg-gradient-to-b from-surface to-canvas">
      <div className="mx-auto flex max-w-xl flex-col gap-4 px-4 py-4">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand text-2xl text-on-brand shadow-lg shadow-brand/30 ring-2 ring-brand/30 ring-offset-2 ring-offset-surface"
          >
            <Icon name="leaf" className="size-7" />
          </span>
          <div>
            <h1 className="font-display text-3xl font-semibold leading-none tracking-tight">
              Planty Care
            </h1>
            <p className="mt-1 text-base text-ink-soft">
              Happy, well-watered plants
            </p>
          </div>
        </div>

        {/* Accessibility controls, kept prominent for a low-vision user. */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="secondary"
            className="w-full"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <Icon name={theme === "dark" ? "moon" : "sun"} className="size-6" />
            {theme === "dark" ? "Dark" : "Light"}
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={onCycleScale}
            aria-label={`Change text size. Currently ${SCALE_LABELS[scale]}.`}
          >
            <Icon name="textSize" className="size-6" />
            {SCALE_LABELS[scale]}
          </Button>
        </div>
      </div>
    </header>
  );
}
