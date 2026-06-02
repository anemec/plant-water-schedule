import { useEffect, useRef, useState } from "react";
import type { PlantActions } from "../hooks/usePlants";
import {
  getFeatured,
  getTaxonDetail,
  type Taxon,
  type TaxonDetail,
} from "../lib/inaturalist";
import { showToast } from "../lib/toast";
import { PlantAutocomplete } from "./PlantAutocomplete";
import { Button } from "./ui/Button";

export function ExploreView({ actions }: { actions: PlantActions }) {
  const [featured, setFeatured] = useState<Taxon[] | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    void getFeatured().then((t) => alive && setFeatured(t));
    return () => {
      alive = false;
    };
  }, []);

  const hero = featured?.[0];
  const rest = featured?.slice(1) ?? [];

  return (
    <section aria-label="Explore plants" className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold">Explore plants 🌍</h2>
        <p className="mt-1 text-lg text-ink-soft">
          Search the living encyclopedia, or tap a plant to learn about it.
        </p>
      </div>

      <PlantAutocomplete
        placeholder="Search any plant…"
        onSelect={(t) => setSelectedId(t.id)}
      />

      {featured === null ? (
        <p className="text-lg text-ink-soft">🌱 Loading a few favorites…</p>
      ) : featured.length === 0 ? (
        <p className="text-lg text-ink-soft">
          Couldn’t reach the plant library — check your connection and try again.
        </p>
      ) : (
        <>
          {hero && <HeroCard taxon={hero} onOpen={() => setSelectedId(hero.id)} />}
          <div className="grid grid-cols-2 gap-4">
            {rest.map((t) => (
              <GalleryCard
                key={t.id}
                taxon={t}
                onOpen={() => setSelectedId(t.id)}
              />
            ))}
          </div>
          <p className="text-center text-sm text-ink-soft">
            Photos &amp; data from the iNaturalist community 🐛🌿
          </p>
        </>
      )}

      <DetailDialog
        id={selectedId}
        onClose={() => setSelectedId(null)}
        onAdd={(t) => {
          const ok = actions.addCustomPlant({
            name: t.commonName ?? t.scientificName,
            species: t.scientificName,
            image: t.photo,
          });
          showToast(
            ok
              ? `${t.commonName ?? t.scientificName} added 🌱`
              : "Already in your plants",
          );
        }}
      />
    </section>
  );
}

function HeroCard({ taxon, onOpen }: { taxon: Taxon; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group overflow-hidden rounded-3xl border-2 border-line bg-surface text-left"
    >
      {taxon.photo && (
        <div className="relative h-56 w-full">
          <img
            src={taxon.photo}
            alt={`Photo of ${taxon.commonName ?? taxon.scientificName}`}
            className="h-full w-full object-cover"
          />
          <span className="absolute left-3 top-3 rounded-full bg-brand px-3 py-1 text-base font-bold text-on-brand">
            ✨ Featured
          </span>
        </div>
      )}
      <div className="p-5">
        <h3 className="text-2xl font-bold leading-tight">
          {taxon.commonName ?? taxon.scientificName}
        </h3>
        {taxon.commonName && (
          <p className="text-lg italic text-ink-soft">{taxon.scientificName}</p>
        )}
        <span className="mt-2 inline-block text-lg font-bold text-brand">
          Learn more →
        </span>
      </div>
    </button>
  );
}

function GalleryCard({ taxon, onOpen }: { taxon: Taxon; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex flex-col overflow-hidden rounded-2xl border-2 border-line bg-surface text-left"
    >
      {taxon.photo ? (
        <img
          src={taxon.photo}
          alt={`Photo of ${taxon.commonName ?? taxon.scientificName}`}
          loading="lazy"
          className="h-32 w-full object-cover"
        />
      ) : (
        <div className="grid h-32 w-full place-items-center bg-surface-2 text-4xl">
          🪴
        </div>
      )}
      <span className="p-3 text-lg font-bold leading-tight">
        {taxon.commonName ?? taxon.scientificName}
      </span>
    </button>
  );
}

function DetailDialog({
  id,
  onClose,
  onAdd,
}: {
  id: number | null;
  onClose: () => void;
  onAdd: (t: TaxonDetail) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [detail, setDetail] = useState<TaxonDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (id == null) {
      if (el.open) el.close();
      return;
    }
    setDetail(null);
    setLoading(true);
    if (!el.open) el.showModal();
    let alive = true;
    void getTaxonDetail(id).then((d) => {
      if (!alive) return;
      setDetail(d);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [id]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby="explore-detail-title"
      className="m-auto max-h-[90vh] w-[94%] max-w-lg overflow-auto rounded-xl2 border-2 border-line bg-surface p-0 text-ink backdrop:bg-black/70"
    >
      {loading && <p className="p-6 text-lg text-ink-soft">🌱 Loading…</p>}
      {!loading && !detail && (
        <p className="p-6 text-lg text-ink-soft">Couldn’t load this plant.</p>
      )}
      {detail && (
        <article>
          {detail.photo && (
            <img
              src={detail.photo}
              alt={`Photo of ${detail.commonName ?? detail.scientificName}`}
              className="h-60 w-full object-cover"
            />
          )}
          <div className="flex flex-col gap-3 p-6">
            <div>
              <h2
                id="explore-detail-title"
                className="text-3xl font-bold leading-tight"
              >
                {detail.commonName ?? detail.scientificName}
              </h2>
              {detail.commonName && (
                <p className="text-xl italic text-ink-soft">
                  {detail.scientificName}
                </p>
              )}
            </div>

            {detail.summary && (
              <p className="text-lg leading-relaxed">{detail.summary}</p>
            )}

            {detail.observations != null && (
              <p className="text-base text-ink-soft">
                👁 {detail.observations.toLocaleString()} observations on
                iNaturalist
              </p>
            )}
            {detail.photoAttribution && (
              <p className="text-sm text-ink-soft">
                📷 {detail.photoAttribution}
              </p>
            )}

            <div className="mt-1 flex flex-col gap-3">
              <Button size="lg" variant="primary" onClick={() => onAdd(detail)}>
                ➕ Add to my plants
              </Button>
              <div className="grid grid-cols-2 gap-3">
                {detail.wikipediaUrl && (
                  <a
                    href={detail.wikipediaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-13 items-center justify-center rounded-xl2 border-2 border-line bg-surface-2 px-5 text-lg font-bold text-ink hover:border-brand"
                  >
                    📖 Wikipedia
                  </a>
                )}
                <Button
                  variant="ghost"
                  className={detail.wikipediaUrl ? "" : "col-span-2"}
                  onClick={onClose}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </article>
      )}
    </dialog>
  );
}
