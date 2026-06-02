import { describe, it, expect, vi } from "vitest";
import { lookupPlant } from "./wiki";

function mockFetch(response: unknown, ok = true): typeof fetch {
  return vi.fn().mockResolvedValue({
    ok,
    json: () => Promise.resolve(response),
  }) as unknown as typeof fetch;
}

describe("lookupPlant", () => {
  it("maps a successful summary into WikiInfo", async () => {
    const fetchImpl = mockFetch({
      title: "Monstera deliciosa",
      extract: "A species of flowering plant.",
      description: "Species of plant",
      thumbnail: { source: "https://example.com/monstera.jpg" },
    });
    const info = await lookupPlant("Monstera", fetchImpl);
    expect(info).toEqual({
      title: "Monstera deliciosa",
      extract: "A species of flowering plant.",
      description: "Species of plant",
      image: "https://example.com/monstera.jpg",
    });
  });

  it("falls back to the original image when no thumbnail", async () => {
    const fetchImpl = mockFetch({
      title: "Fern",
      originalimage: { source: "https://example.com/fern.jpg" },
    });
    const info = await lookupPlant("Fern", fetchImpl);
    expect(info?.image).toBe("https://example.com/fern.jpg");
  });

  it("returns null on a not-found response", async () => {
    const fetchImpl = mockFetch({
      type: "https://mediawiki.org/wiki/HyperSwitch/errors/not_found",
    });
    expect(await lookupPlant("zzzz", fetchImpl)).toBeNull();
  });

  it("returns null on an HTTP error", async () => {
    const fetchImpl = mockFetch({}, false);
    expect(await lookupPlant("anything", fetchImpl)).toBeNull();
  });

  it("returns null when fetch throws (offline)", async () => {
    const fetchImpl = vi
      .fn()
      .mockRejectedValue(new Error("network")) as unknown as typeof fetch;
    expect(await lookupPlant("anything", fetchImpl)).toBeNull();
  });
});
