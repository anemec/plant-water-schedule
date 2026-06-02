// Client for the iNaturalist API (https://api.inaturalist.org/v1).
// Open, CORS-enabled, and key-free, so it works on a static GitHub Pages
// site. Used for type-ahead plant search and the Explore encyclopedia.

export interface Taxon {
  id: number;
  scientificName: string;
  commonName: string | null;
  rank: string;
  /** Medium photo URL. */
  photo: string | null;
  /** Square thumbnail URL. */
  thumb: string | null;
  photoAttribution: string | null;
  wikipediaUrl: string | null;
  observations: number | null;
}

export interface TaxonDetail extends Taxon {
  /** Plain-text summary (HTML stripped), if any. */
  summary: string | null;
  /** Additional photo URLs for a gallery. */
  photos: string[];
}

interface ApiPhoto {
  square_url?: string;
  medium_url?: string;
  attribution?: string;
}
interface ApiTaxon {
  id: number;
  name: string;
  rank: string;
  preferred_common_name?: string;
  default_photo?: ApiPhoto | null;
  wikipedia_url?: string | null;
  wikipedia_summary?: string | null;
  observations_count?: number;
  iconic_taxon_name?: string | null;
  taxon_photos?: { photo?: ApiPhoto }[];
}

const API = "https://api.inaturalist.org/v1";

function titleCase(s: string): string {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

function mapTaxon(t: ApiTaxon): Taxon {
  return {
    id: t.id,
    scientificName: t.name,
    commonName: t.preferred_common_name
      ? titleCase(t.preferred_common_name)
      : null,
    rank: t.rank,
    photo: t.default_photo?.medium_url ?? null,
    thumb: t.default_photo?.square_url ?? t.default_photo?.medium_url ?? null,
    photoAttribution: t.default_photo?.attribution ?? null,
    wikipediaUrl: t.wikipedia_url ?? null,
    observations: t.observations_count ?? null,
  };
}

/** Strip HTML tags + decode a few common entities from a summary string. */
function stripHtml(html: string | null | undefined): string | null {
  if (!html) return null;
  const text = html
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
  return text || null;
}

/**
 * Type-ahead search for plant taxa. Returns up to 8 plant matches
 * (filtered to the Plantae kingdom). Empty for queries under 2 chars.
 */
export async function searchTaxa(
  query: string,
  fetchImpl: typeof fetch = fetch,
): Promise<Taxon[]> {
  const term = query.trim();
  if (term.length < 2) return [];
  try {
    const res = await fetchImpl(
      `${API}/taxa/autocomplete?per_page=8&q=${encodeURIComponent(term)}`,
    );
    if (!res.ok) return [];
    const data = (await res.json()) as { results?: ApiTaxon[] };
    return (data.results ?? [])
      .filter((t) => t.iconic_taxon_name === "Plantae")
      .map(mapTaxon);
  } catch {
    return [];
  }
}

/** Full detail for one taxon (summary + photo gallery). */
export async function getTaxonDetail(
  id: number,
  fetchImpl: typeof fetch = fetch,
): Promise<TaxonDetail | null> {
  try {
    const res = await fetchImpl(`${API}/taxa/${id}`);
    if (!res.ok) return null;
    const data = (await res.json()) as { results?: ApiTaxon[] };
    const t = data.results?.[0];
    if (!t) return null;
    const base = mapTaxon(t);
    const gallery = (t.taxon_photos ?? [])
      .map((p) => p.photo?.medium_url)
      .filter((u): u is string => Boolean(u));
    return {
      ...base,
      summary: stripHtml(t.wikipedia_summary),
      photos: gallery.length > 0 ? gallery : base.photo ? [base.photo] : [],
    };
  } catch {
    return null;
  }
}

/** Popular houseplants for the Explore gallery (resolved via search). */
export const FEATURED_QUERIES = [
  "Monstera deliciosa",
  "Epipremnum aureum",
  "Dracaena trifasciata",
  "Ficus lyrata",
  "Zamioculcas zamiifolia",
  "Spathiphyllum",
  "Chlorophytum comosum",
  "Aloe vera",
  "Strelitzia reginae",
  "Philodendron",
  "Calathea",
  "Echeveria",
];

let featuredCache: Taxon[] | null = null;

/** Resolve the featured houseplants (cached for the session). */
export async function getFeatured(
  fetchImpl: typeof fetch = fetch,
): Promise<Taxon[]> {
  if (featuredCache) return featuredCache;
  const results = await Promise.all(
    FEATURED_QUERIES.map((q) =>
      searchTaxa(q, fetchImpl).then((r) => r[0] ?? null),
    ),
  );
  featuredCache = results.filter((t): t is Taxon => Boolean(t?.photo));
  return featuredCache;
}
