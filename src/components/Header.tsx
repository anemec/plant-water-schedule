import type { Theme } from "../hooks/useTheme";
import { SCALE_LABELS, type TextScale } from "../hooks/useTextScale";
import { Button } from "./ui/Button";

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
    <header className="pt-safe border-b-2 border-line bg-canvas">
      <div className="mx-auto flex max-w-xl flex-col gap-4 px-4 py-4">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="grid size-12 shrink-0 place-items-center rounded-xl2 bg-brand text-3xl"
          >
            🌱
          </span>
          <h1 className="text-3xl font-bold tracking-tight">Planty Care</h1>
        </div>

        {/* Accessibility controls, kept prominent for a low-vision user. */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="secondary"
            className="w-full"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? "🌙 Dark mode" : "☀️ Light mode"}
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={onCycleScale}
            aria-label={`Change text size. Currently ${SCALE_LABELS[scale]}.`}
          >
            🔤 Text: {SCALE_LABELS[scale]}
          </Button>
        </div>
      </div>
    </header>
  );
}
