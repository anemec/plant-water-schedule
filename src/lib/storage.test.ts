import { describe, it, expect, beforeEach } from "vitest";
import { loadState, saveState, emptyState, STORAGE_KEY } from "./storage";
import type { AppState } from "../types";

describe("storage", () => {
  beforeEach(() => localStorage.clear());

  it("returns an empty (non-shared) state when nothing is stored", () => {
    const a = loadState();
    expect(a).toEqual(emptyState);
    // Mutating the result must not affect the shared empty constant.
    a.plants.push({
      id: "x",
      name: "x",
      species: "",
      emoji: "🪴",
      intervalDays: 7,
      lastWatered: null,
      image: null,
      reminderDays: [],
      reminderTime: "09:00",
    });
    expect(emptyState.plants).toHaveLength(0);
  });

  it("round-trips state through save/load", () => {
    const state: AppState = {
      plants: [
        {
          id: "p1",
          name: "Pothos",
          species: "Epipremnum aureum",
          emoji: "🌿",
          intervalDays: 7,
          lastWatered: 1000,
          image: null,
          reminderDays: [1, 4],
          reminderTime: "08:30",
        },
      ],
      history: [
        { id: "h1", plantId: "p1", plantName: "Pothos", emoji: "🌿", at: 999 },
      ],
    };
    saveState(state);
    expect(loadState()).toEqual(state);
  });

  it("recovers from corrupt JSON", () => {
    localStorage.setItem(STORAGE_KEY, "{not valid json");
    expect(loadState()).toEqual(emptyState);
  });

  it("tolerates partial/missing fields", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ plants: "oops" }));
    expect(loadState()).toEqual({ plants: [], history: [] });
  });
});
