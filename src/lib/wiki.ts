export interface WikiInfo {
  title: string;
  extract: string;
  description: string;
  image: string | null;
}

interface WikiSummaryResponse {
  type?: string;
  title?: string;
  extract?: string;
  description?: string;
  thumbnail?: { source?: string };
  originalimage?: { source?: string };
}

const SUMMARY_ENDPOINT =
  "https://en.wikipedia.org/api/rest_v1/page/summary/";

/**
 * Look up a plant on Wikipedia and return a photo + description.
 * Uses the public REST summary API (CORS-enabled, no key required),
 * so it works on a static GitHub Pages site. Returns null when not found.
 */
export async function lookupPlant(
  title: string,
  fetchImpl: typeof fetch = fetch,
): Promise<WikiInfo | null> {
  const url = `${SUMMARY_ENDPOINT}${encodeURIComponent(title)}?redirect=true`;
  try {
    const res = await fetchImpl(url, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as WikiSummaryResponse;
    if (!data || data.type?.includes("not_found")) return null;

    const image =
      data.thumbnail?.source ?? data.originalimage?.source ?? null;
    return {
      title: data.title ?? title,
      extract: data.extract ?? "",
      description: data.description ?? "",
      image,
    };
  } catch {
    return null;
  }
}
