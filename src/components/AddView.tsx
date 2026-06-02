import { useState } from "react";
import type { PlantActions } from "../hooks/usePlants";
import { PRESETS } from "../data/presets";
import { lookupPlant, type WikiInfo } from "../lib/wiki";
import { showToast } from "../lib/toast";
import { cn } from "../lib/util";
import { Button } from "./ui/Button";

type Result = { state: "idle" } | { state: "loading" } | { state: "done"; info: WikiInfo | null; query: string };

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
      <div className="rounded-xl2 bg-surface p-5 shadow-lg shadow-black/20">
        <h2 className="text-xl font-black">Quick add</h2>
        <p className="mt-1 text-sm text-muted">
          Pick a common houseplant to add instantly.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {PRESETS.map((preset) => {
            const added = actions.hasPlantNamed(preset.name);
            return (
              <button
                key={preset.name}
                type="button"
                disabled={added}
                onClick={() => addPreset(preset.name)}
                className={cn(
                  "flex min-h-28 flex-col items-center justify-center gap-1 rounded-xl border p-3 text-center font-bold transition-colors",
                  added
                    ? "cursor-default border-line bg-surface-2/50 text-muted"
                    : "border-line bg-surface-2 text-ink hover:border-brand/60",
                )}
              >
                <span aria-hidden="true" className="text-3xl">
                  {preset.emoji}
                </span>
                <span className="leading-tight">{preset.name}</span>
                <span className="text-xs font-semibold text-muted">
                  {added ? "Added ✓" : `every ${preset.intervalDays} days`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lookup */}
      <div className="rounded-xl2 bg-surface p-5 shadow-lg shadow-black/20">
        <h2 className="text-xl font-black">Look up a new plant</h2>
        <p className="mt-1 text-sm text-muted">
          Search any plant by name — we fetch a photo and description from
          Wikipedia.
        </p>

        <form onSubmit={handleSearch} className="mt-4 flex flex-col gap-2">
          <label htmlFor="lookup" className="sr-only">
            Plant name
          </label>
          <div className="flex flex-wrap gap-2">
            <input
              id="lookup"
              type="text"
              autoComplete="off"
              placeholder="e.g. Fiddle leaf fig"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-h-12 flex-1 rounded-xl border border-line bg-canvas px-3 text-base"
            />
            <Button type="submit" variant="primary">
              🔍 Search
            </Button>
          </div>
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
    return <p className="mt-4 italic text-muted">🔎 Searching…</p>;
  }

  const { info, query } = result;
  if (!info) {
    return (
      <div className="mt-4 rounded-xl bg-surface-2 p-4">
        <p>
          No results for “{query}”. You can still add it with default settings.
        </p>
        <div className="mt-3">
          <Button variant="secondary" onClick={() => onAddInfo(query, "", null)}>
            ➕ Add “{query}” anyway
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-wrap gap-4 rounded-xl bg-surface-2 p-4">
      {info.image ? (
        <img
          src={info.image}
          alt={`Photo of ${info.title}`}
          className="size-32 rounded-xl object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="grid size-32 place-items-center rounded-xl bg-surface text-5xl"
        >
          🪴
        </div>
      )}
      <div className="min-w-[12rem] flex-1">
        <h3 className="text-lg font-black">{info.title}</h3>
        <p className="mt-1 text-sm text-muted">
          {info.extract || "No description found."}
        </p>
        <div className="mt-3">
          <Button
            variant="primary"
            onClick={() => onAddInfo(info.title, info.description, info.image)}
          >
            ➕ Add to my plants
          </Button>
        </div>
      </div>
    </div>
  );
}
