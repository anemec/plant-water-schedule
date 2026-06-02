import { useState } from "react";
import type { PlantActions } from "../hooks/usePlants";
import { PRESETS } from "../data/presets";
import { lookupPlant, type WikiInfo } from "../lib/wiki";
import { showToast } from "../lib/toast";
import { cn } from "../lib/util";
import { Button } from "./ui/Button";

type Result =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "done"; info: WikiInfo | null; query: string };

export function AddView({
  actions,
  onAdded,
}: {
  actions: PlantActions;
  onAdded: () => void;
}) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<Result>({ state: "idle" });

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const term = query.trim();
    if (!term) return;
    setResult({ state: "loading" });
    const info = await lookupPlant(term);
    setResult({ state: "done", info, query: term });
  }

  function addPreset(name: string) {
    const preset = PRESETS.find((p) => p.name === name);
    if (!preset) return;
    actions.addPreset(preset);
    showToast(`${preset.name} added 🌱`);
    onAdded();
  }

  function addCustom(name: string, species: string, image: string | null) {
    const ok = actions.addCustomPlant({ name, species, image });
    showToast(ok ? `${name} added 🌱` : `${name} is already in your list`);
    if (ok) {
      setQuery("");
      setResult({ state: "idle" });
      onAdded();
    }
  }

  return (
    <section aria-label="Add or look up a plant" className="flex flex-col gap-6">
      {/* Quick add */}
      <div className="rounded-xl2 border-2 border-line bg-surface p-5">
        <h2 className="text-2xl font-bold">Quick add</h2>
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
                {!added && <span aria-hidden="true" className="text-2xl">➕</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lookup */}
      <div className="rounded-xl2 border-2 border-line bg-surface p-5">
        <h2 className="text-2xl font-bold">Look up a new plant</h2>
        <p className="mt-1 text-lg text-ink-soft">
          Search any plant by name. We fetch a photo and description from
          Wikipedia.
        </p>

        <form onSubmit={handleSearch} className="mt-4 flex flex-col gap-3">
          <label htmlFor="lookup" className="text-lg font-bold">
            Plant name
          </label>
          <input
            id="lookup"
            type="text"
            autoComplete="off"
            placeholder="e.g. Fiddle leaf fig"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-h-14 w-full rounded-xl2 border-2 border-line bg-canvas px-4 text-xl text-ink placeholder:text-ink-soft"
          />
          <Button type="submit" size="lg" variant="primary">
            🔍 Search
          </Button>
        </form>

        <LookupResult result={result} onAddInfo={addCustom} />
      </div>
    </section>
  );
}

function LookupResult({
  result,
  onAddInfo,
}: {
  result: Result;
  onAddInfo: (name: string, species: string, image: string | null) => void;
}) {
  if (result.state === "idle") return null;
  if (result.state === "loading") {
    return <p className="mt-4 text-xl text-ink-soft">🔎 Searching…</p>;
  }

  const { info, query } = result;
  if (!info) {
    return (
      <div className="mt-4 rounded-xl2 border-2 border-line bg-surface-2 p-5">
        <p className="text-lg">
          No results for “{query}”. You can still add it with default settings.
        </p>
        <div className="mt-4">
          <Button
            size="lg"
            variant="secondary"
            onClick={() => onAddInfo(query, "", null)}
          >
            ➕ Add “{query}” anyway
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-4 rounded-xl2 border-2 border-line bg-surface-2 p-5">
      {info.image ? (
        <img
          src={info.image}
          alt={`Photo of ${info.title}`}
          className="h-48 w-full rounded-xl2 object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="grid h-48 w-full place-items-center rounded-xl2 bg-surface text-6xl"
        >
          🪴
        </div>
      )}
      <div>
        <h3 className="text-2xl font-bold">{info.title}</h3>
        <p className="mt-1 text-lg text-ink-soft">
          {info.extract || "No description found."}
        </p>
      </div>
      <Button
        size="lg"
        variant="primary"
        onClick={() => onAddInfo(info.title, info.description, info.image)}
      >
        ➕ Add to my plants
      </Button>
    </div>
  );
}
