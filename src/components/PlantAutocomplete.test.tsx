import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PlantAutocomplete } from "./PlantAutocomplete";
import * as inat from "../lib/inaturalist";
import type { Taxon } from "../lib/inaturalist";

vi.mock("../lib/inaturalist", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../lib/inaturalist")>();
  return { ...actual, searchTaxa: vi.fn() };
});

const taxon: Taxon = {
  id: 1,
  scientificName: "Monstera deliciosa",
  commonName: "Swiss Cheese Plant",
  rank: "species",
  photo: "m.jpg",
  thumb: "s.jpg",
  photoAttribution: "x",
  wikipediaUrl: null,
  observations: 10,
};

describe("PlantAutocomplete", () => {
  beforeEach(() => vi.mocked(inat.searchTaxa).mockResolvedValue([taxon]));

  it("exposes a combobox and lists results as options", async () => {
    render(<PlantAutocomplete onSelect={() => {}} debounceMs={0} />);
    const input = screen.getByRole("combobox");
    await userEvent.type(input, "monstera");
    const option = await screen.findByRole("option");
    expect(option).toHaveTextContent("Swiss Cheese Plant");
    expect(option).toHaveTextContent("Monstera deliciosa");
  });

  it("calls onSelect when a result is chosen", async () => {
    const onSelect = vi.fn();
    render(<PlantAutocomplete onSelect={onSelect} debounceMs={0} />);
    await userEvent.type(screen.getByRole("combobox"), "monstera");
    const option = await screen.findByRole("option");
    await userEvent.click(option);
    expect(onSelect).toHaveBeenCalledWith(taxon);
  });
});
