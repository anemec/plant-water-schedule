import { describe, it, expect, beforeEach, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { usePlants } from "./usePlants";
import { PRESETS } from "../data/presets";

describe("usePlants", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, json: () => Promise.resolve({}) }),
    );
  });

  it("adds a custom plant (with a water task) and rejects duplicates", () => {
    const { result } = renderHook(() => usePlants());

    act(() => {
      expect(result.current.actions.addCustomPlant({ name: "Fern" })).toBe(true);
    });
    expect(result.current.plants).toHaveLength(1);
    expect(result.current.plants[0].tasks).toEqual([
      { type: "water", intervalDays: 7, lastDone: null },
    ]);

    act(() => {
      expect(result.current.actions.addCustomPlant({ name: "fern" })).toBe(false);
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

  it("doTask records history and updates that task's lastDone", () => {
    const { result } = renderHook(() => usePlants());
    act(() => result.current.actions.addCustomPlant({ name: "Cactus" }));
    const id = result.current.plants[0].id;

    act(() => result.current.actions.doTask(id, "water"));

    const waterTask = result.current.plants[0].tasks.find(
      (t) => t.type === "water",
    );
    expect(waterTask?.lastDone).toBeTypeOf("number");
    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0]).toMatchObject({
      plantName: "Cactus",
      taskType: "water",
    });
  });

  it("updatePlantCare replaces tasks and reminders", () => {
    const { result } = renderHook(() => usePlants());
    act(() => result.current.actions.addCustomPlant({ name: "Ivy" }));
    const id = result.current.plants[0].id;

    act(() =>
      result.current.actions.updatePlantCare(id, {
        tasks: [
          { type: "water", intervalDays: 3, lastDone: null },
          { type: "fertilize", intervalDays: 30, lastDone: null },
        ],
        reminderDays: [1, 3, 5],
        reminderTime: "08:00",
      }),
    );

    expect(result.current.plants[0].tasks).toHaveLength(2);
    expect(result.current.plants[0].reminderDays).toEqual([1, 3, 5]);
  });

  it("clears history", () => {
    const { result } = renderHook(() => usePlants());
    act(() => result.current.actions.addCustomPlant({ name: "Aloe" }));
    const id = result.current.plants[0].id;
    act(() => result.current.actions.doTask(id, "water"));
    expect(result.current.history).toHaveLength(1);
    act(() => result.current.actions.clearHistory());
    expect(result.current.history).toHaveLength(0);
  });

  it("persists plants across hook remounts", () => {
    const first = renderHook(() => usePlants());
    act(() => first.result.current.actions.addCustomPlant({ name: "Sage" }));
    first.unmount();
    const second = renderHook(() => usePlants());
    expect(second.result.current.plants.map((p) => p.name)).toContain("Sage");
  });
});
