import { useState } from "react";
import type { PlantActions } from "../hooks/usePlants";
import type { Taxon } from "../lib/inaturalist";
import { PRESETS } from "../data/presets";
import { showToast } from "../lib/toast";
import { cn } from "../lib/util";
import { Button } from "./ui/Button";
import { PlantAutocomplete } from "./PlantAutocomplete";
import { ScreenHeader } from "./ui/ScreenHeader";

export function AddView({
  actions,
  onAdded,
}: {
  actions: PlantActions;
  onAdded: () => void;
}) {
  const [selected, setSelected] = useState<Taxon | null>(null);

  function addPreset(name: string) {
    const preset = PRESETS.find((p) => p.name === name);
    if (!preset) return;
    actions.addPreset(preset);
    showToast(`${preset.name} added 🌱`);
    onAdded();
  }

  function addSelected() {
    if (!selected) return;
    const name = selected.commonName ?? selected.scientificName;
    const ok = actions.addCustomPlant({
      name,
      species: selected.scientificName,
      image: selected.photo,
    });
    showToast(ok ? `${name} added 🌱` : `${name} is already in your list`);
    if (ok) {
      setSelected(null);
      onAdded();
    }
  }

  return (
    <section aria-label="Add a plant" className="flex flex-col gap-6">
      <ScreenHeader
        icon="➕"
        title="Add a plant"
        subtitle="From the favorites, or search for any plant."
      />

      {/* Quick add */}
      <div className="rounded-3xl border-2 border-line bg-surface p-5 shadow-lg shadow-black/25">
        <h2 className="font-display text-2xl font-semibold">Quick add</h2>
        <p className="mt-1 text-lg text-ink-soft">
          Pick a common houseplant to add right away.
        </p>
        <div className="mt-4 flex flex-col gap-3">
          {PRESETS.map((preset) => {
            const added = actions.hasPlantNamed(preset.name);
            return (
              <button
                key={preset.name}
                type="button"
                disabled={added}
                onClick={() => addPreset(preset.name)}
                className={cn(
                  "flex min-h-16 items-center gap-4 rounded-xl2 border-2 px-5 text-left font-bold transition-colors",
                  added
                    ? "cursor-default border-line bg-surface-2 text-ink-soft"
                    : "border-line bg-surface-2 text-ink hover:border-brand",
                )}
              >
                <span aria-hidden="true" className="text-4xl">
                  {preset.emoji}
                </span>
                <span className="flex-1">
                  <span className="block text-xl">{preset.name}</span>
                  <span className="block text-base font-normal text-ink-soft">
                    {added ? "Added ✓" : `Water every ${preset.intervalDays} days`}
                  </span>
                </span>
                {!added && (
                  <span aria-hidden="true" className="text-2xl">
                    ➕
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Type-ahead search */}
      <div className="rounded-3xl border-2 border-line bg-surface p-5 shadow-lg shadow-black/25">
        <h2 className="font-display text-2xl font-semibold">Search for a plant</h2>
        <p className="mt-1 text-lg text-ink-soft">
          Start typing a name — we’ll find it, with a photo.
        </p>
        <div className="mt-4">
          <PlantAutocomplete onSelect={setSelected} />
        </div>

        {selected && (
          <div className="mt-4 flex flex-col gap-4 rounded-2xl border-2 border-brand bg-surface-2 p-4">
            <div className="flex items-center gap-4">
              {selected.photo ? (
                <img
                  src={selected.photo}
                  alt={`Photo of ${selected.commonName ?? selected.scientificName}`}
                  className="size-24 shrink-0 rounded-xl object-cover"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="grid size-24 shrink-0 place-items-center rounded-xl bg-surface text-4xl"
                >
                  🪴
                </span>
              )}
              <div className="min-w-0">
                <p className="text-xl font-bold leading-tight">
                  {selected.commonName ?? selected.scientificName}
                </p>
                {selected.commonName && (
                  <p className="text-lg italic text-ink-soft">
                    {selected.scientificName}
                  </p>
                )}
              </div>
            </div>
            <Button size="lg" variant="primary" onClick={addSelected}>
              ➕ Add to my plants
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
