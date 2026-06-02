import { describe, it, expect, beforeEach, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { usePlants } from "./usePlants";
import { PRESETS } from "../data/presets";

describe("usePlants", () => {
  beforeEach(() => {
    localStorage.clear();
    // Avoid real network from addPreset's background photo fetch.
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, json: () => Promise.resolve({}) }),
    );
  });

  it("adds a custom plant and rejects duplicates (case-insensitive)", () => {
    const { result } = renderHook(() => usePlants());

    act(() => {
      const ok = result.current.actions.addCustomPlant({ name: "Fern" });
      expect(ok).toBe(true);
    });
    expect(result.current.plants).toHaveLength(1);

    act(() => {
      const ok = result.current.actions.addCustomPlant({ name: "fern" });
      expect(ok).toBe(false);
    });
    expect(result.current.plants).toHaveLength(1);
  });

  it("adds a preset only once", () => {
    const { result } = renderHook(() => usePlants());
    const pothos = PRESETS[0];

    act(() => result.current.actions.addPreset(pothos));
    act(() => result.current.actions.addPreset(pothos));

    expect(
      result.current.plants.filter((p) => p.name === pothos.name),
    ).toHaveLength(1);
  });

  it("watering records history and updates lastWatered", () => {
    const { result } = renderHook(() => usePlants());

    act(() => {
      result.current.actions.addCustomPlant({ name: "Cactus" });
    });
    const id = result.current.plants[0].id;

    act(() => result.current.actions.waterPlant(id));

    expect(result.current.plants[0].lastWatered).toBeTypeOf("number");
    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0].plantName).toBe("Cactus");
  });

  it("updates a schedule and clears history", () => {
    const { result } = renderHook(() => usePlants());
    act(() => result.current.actions.addCustomPlant({ name: "Ivy" }));
    const id = result.current.plants[0].id;

    act(() =>
      result.current.actions.updateSchedule(id, {
        intervalDays: 3,
        reminderDays: [1, 3, 5],
      }),
    );
    expect(result.current.plants[0].intervalDays).toBe(3);
    expect(result.current.plants[0].reminderDays).toEqual([1, 3, 5]);

    act(() => result.current.actions.waterPlant(id));
    expect(result.current.history).toHaveLength(1);
    act(() => result.current.actions.clearHistory());
    expect(result.current.history).toHaveLength(0);
  });

  it("persists plants across hook remounts", () => {
    const first = renderHook(() => usePlants());
    act(() => first.result.current.actions.addCustomPlant({ name: "Aloe" }));
    first.unmount();

    const second = renderHook(() => usePlants());
    expect(second.result.current.plants.map((p) => p.name)).toContain("Aloe");
  });
});
