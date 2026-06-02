import { describe, it, expect, beforeEach } from "vitest";
import { loadState, saveState, emptyState, STORAGE_KEY } from "./storage";
import type { AppState } from "../types";

describe("storage", () => {
  beforeEach(() => localStorage.clear());

  it("returns a fresh empty state when nothing is stored", () => {
    const a = loadState();
    expect(a).toEqual(emptyState);
    a.plants.push({
      id: "x",
      name: "x",
      species: "",
      emoji: "🪴",
      image: null,
      tasks: [{ type: "water", intervalDays: 7, lastDone: null }],
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
          image: null,
          tasks: [
            { type: "water", intervalDays: 7, lastDone: 1000 },
            { type: "fertilize", intervalDays: 30, lastDone: null },
          ],
          reminderDays: [1, 4],
          reminderTime: "08:30",
        },
      ],
      history: [
        { id: "h1", plantId: "p1", plantName: "Pothos", taskType: "water", at: 999 },
      ],
    };
    saveState(state);
    expect(loadState()).toEqual(state);
  });

  it("recovers from corrupt JSON", () => {
    localStorage.setItem(STORAGE_KEY, "{not valid json");
    expect(loadState()).toEqual(emptyState);
  });

  it("migrates legacy (watering-only) plants into a water task", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        plants: [
          {
            id: "old",
            name: "Fern",
            species: "",
            emoji: "🌿",
            intervalDays: 5,
            lastWatered: 1234,
            reminderDays: [2],
            reminderTime: "07:00",
          },
        ],
        history: [{ id: "h", plantId: "old", plantName: "Fern", at: 1 }],
      }),
    );
    const state = loadState();
    expect(state.plants[0].tasks).toEqual([
      { type: "water", intervalDays: 5, lastDone: 1234 },
    ]);
    // Legacy history entries default to the water task type.
    expect(state.history[0].taskType).toBe("water");
  });
});
