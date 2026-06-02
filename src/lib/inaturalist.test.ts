import { describe, it, expect, vi } from "vitest";
import { searchTaxa, getTaxonDetail } from "./inaturalist";

function mockFetch(payload: unknown, ok = true): typeof fetch {
  return vi.fn().mockResolvedValue({
    ok,
    json: () => Promise.resolve(payload),
  }) as unknown as typeof fetch;
}

describe("searchTaxa", () => {
  it("returns [] for short queries without calling the API", async () => {
    const f = vi.fn() as unknown as typeof fetch;
    expect(await searchTaxa("m", f)).toEqual([]);
    expect(f).not.toHaveBeenCalled();
  });

  it("maps results and filters out non-plants", async () => {
    const f = mockFetch({
      results: [
        {
          id: 1,
          name: "Monstera deliciosa",
          rank: "species",
          preferred_common_name: "swiss cheese plant",
          iconic_taxon_name: "Plantae",
          default_photo: { medium_url: "m.jpg", square_url: "s.jpg" },
          observations_count: 42,
        },
        {
          id: 2,
          name: "Canis lupus",
          rank: "species",
          iconic_taxon_name: "Mammalia",
        },
      ],
    });
    const out = await searchTaxa("monstera", f);
    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({
      id: 1,
      scientificName: "Monstera deliciosa",
      commonName: "Swiss Cheese Plant", // title-cased
      photo: "m.jpg",
      thumb: "s.jpg",
      observations: 42,
    });
  });

  it("returns [] on HTTP error", async () => {
    expect(await searchTaxa("monstera", mockFetch({}, false))).toEqual([]);
  });
});

describe("getTaxonDetail", () => {
  it("maps detail, strips HTML from the summary, and builds a gallery", async () => {
    const f = mockFetch({
      results: [
        {
          id: 1,
          name: "Monstera deliciosa",
          rank: "species",
          wikipedia_summary: "<p>A <b>climbing</b> plant.</p>",
          taxon_photos: [
            { photo: { medium_url: "a.jpg" } },
            { photo: { medium_url: "b.jpg" } },
          ],
        },
      ],
    });
    const d = await getTaxonDetail(1, f);
    expect(d?.summary).toBe("A climbing plant.");
    expect(d?.photos).toEqual(["a.jpg", "b.jpg"]);
  });

  it("returns null when there are no results", async () => {
    expect(await getTaxonDetail(1, mockFetch({ results: [] }))).toBeNull();
  });
});
