import { useEffect, useId, useRef, useState } from "react";
import { searchTaxa, type Taxon } from "../lib/inaturalist";
import { Icon } from "./ui/Icon";

/**
 * Accessible type-ahead search for plants, following the WAI-ARIA combobox
 * pattern (role=combobox + listbox/option, aria-activedescendant, arrow/Enter/
 * Escape keys). Debounced, with a race guard so stale responses never win.
 */
export function PlantAutocomplete({
  onSelect,
  placeholder = "Search plants…",
  debounceMs = 300,
}: {
  onSelect: (taxon: Taxon) => void;
  placeholder?: string;
  debounceMs?: number;
}) {
  const listId = useId();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Taxon[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(-1);
  const latest = useRef(0);

  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const token = ++latest.current;
    const timer = setTimeout(async () => {
      const found = await searchTaxa(term);
      // Ignore responses from anything but the most recent request.
      if (token !== latest.current) return;
      setResults(found);
      setOpen(true);
      setActive(found.length > 0 ? 0 : -1);
      setLoading(false);
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  function choose(taxon: Taxon) {
    onSelect(taxon);
    setQuery("");
    setResults([]);
    setOpen(false);
    setActive(-1);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter" && active >= 0) {
      e.preventDefault();
      choose(results[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const showList = open && (results.length > 0 || (!loading && query.trim().length >= 2));

  return (
    <div className="relative">
      <input
        type="text"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={
          active >= 0 ? `${listId}-opt-${active}` : undefined
        }
        autoComplete="off"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={() => results.length > 0 && setOpen(true)}
        className="min-h-14 w-full rounded-xl2 border-2 border-line bg-canvas px-4 text-xl text-ink placeholder:text-ink-soft"
      />
      {loading && (
        <p
          className="mt-2 flex items-center gap-2 text-base text-ink-soft"
          role="status"
        >
          <Icon name="search" className="size-5" />
          Searching…
        </p>
      )}

      {showList && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Plant search results"
          className="mt-2 flex flex-col gap-1 rounded-xl2 border-2 border-line bg-surface p-2"
        >
          {results.length === 0 ? (
            <li className="px-3 py-3 text-lg text-ink-soft">
              No plants found. Try another name.
            </li>
          ) : (
            results.map((t, i) => (
              <li
                key={t.id}
                id={`${listId}-opt-${i}`}
                role="option"
                aria-selected={i === active}
                onMouseDown={(e) => {
                  // Prevent the input blur from closing the list first.
                  e.preventDefault();
                  choose(t);
                }}
                onMouseEnter={() => setActive(i)}
                className={`flex cursor-pointer items-center gap-3 rounded-xl p-2 ${
                  i === active ? "bg-surface-2" : ""
                }`}
              >
                {t.thumb ? (
                  <img
                    src={t.thumb}
                    alt=""
                    className="size-14 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="grid size-14 shrink-0 place-items-center rounded-lg bg-surface-2 text-brand"
                  >
                    <Icon name="leaf" className="size-7" />
                  </span>
                )}
                <span className="min-w-0">
                  <span className="block truncate text-lg font-bold">
                    {t.commonName ?? t.scientificName}
                  </span>
                  {t.commonName && (
                    <span className="block truncate text-base italic text-ink-soft">
                      {t.scientificName}
                    </span>
                  )}
                </span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
