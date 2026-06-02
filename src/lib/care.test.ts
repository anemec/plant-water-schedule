import { describe, it, expect } from "vitest";
import type { CareTask, Plant, Weekday } from "../types";
import {
  DAY_MS,
  careProgress,
  careStatus,
  daysUntilDue,
  dueTaskCount,
  nextReminderTime,
  plantSoonestDue,
} from "./care";

const NOW = new Date("2026-06-02T12:00:00").getTime();

function task(overrides: Partial<CareTask> = {}): CareTask {
  return { type: "water", intervalDays: 7, lastDone: null, ...overrides };
}

function plant(tasks: CareTask[]): Plant {
  return {
    id: "p1",
    name: "Test",
    species: "",
    emoji: "🪴",
    image: null,
    tasks,
    reminderDays: [],
    reminderTime: "09:00",
  };
}

describe("daysUntilDue", () => {
  it("is 0 for a task never done", () => {
    expect(daysUntilDue(task(), NOW)).toBe(0);
  });
  it("equals the interval right after doing it", () => {
    expect(daysUntilDue(task({ lastDone: NOW }), NOW)).toBe(7);
  });
  it("counts down over time", () => {
    expect(daysUntilDue(task({ lastDone: NOW - 3 * DAY_MS }), NOW)).toBe(4);
  });
  it("goes negative when overdue", () => {
    expect(daysUntilDue(task({ lastDone: NOW - 10 * DAY_MS }), NOW)).toBe(-3);
  });
});

describe("careStatus", () => {
  it("reports 'due' today for a never-done task", () => {
    const s = careStatus(task(), NOW);
    expect(s.urgency).toBe("due");
    expect(s.label).toMatch(/today/i);
  });
  it("reports 'soon' when due tomorrow", () => {
    expect(careStatus(task({ lastDone: NOW - 6 * DAY_MS }), NOW).urgency).toBe(
      "soon",
    );
  });
  it("reports 'ok' when comfortably ahead", () => {
    expect(careStatus(task({ lastDone: NOW }), NOW).urgency).toBe("ok");
  });
  it("pluralizes overdue days", () => {
    expect(careStatus(task({ lastDone: NOW - 8 * DAY_MS }), NOW).label).toBe(
      "Overdue by 1 day",
    );
    expect(careStatus(task({ lastDone: NOW - 10 * DAY_MS }), NOW).label).toBe(
      "Overdue by 3 days",
    );
  });
});

describe("careProgress", () => {
  it("is 1 for a task never done", () => {
    expect(careProgress(task(), NOW)).toBe(1);
  });
  it("is 0 right after doing it", () => {
    expect(careProgress(task({ lastDone: NOW }), NOW)).toBe(0);
  });
  it("is ~0.5 halfway through", () => {
    expect(
      careProgress(task({ intervalDays: 8, lastDone: NOW - 4 * DAY_MS }), NOW),
    ).toBeCloseTo(0.5, 5);
  });
  it("clamps to 1 when overdue", () => {
    expect(
      careProgress(task({ intervalDays: 7, lastDone: NOW - 20 * DAY_MS }), NOW),
    ).toBe(1);
  });
});

describe("plantSoonestDue / dueTaskCount", () => {
  it("returns the most urgent task's days for a plant", () => {
    const p = plant([
      task({ type: "water", lastDone: NOW }), // +7
      task({ type: "fertilize", intervalDays: 30, lastDone: NOW - 35 * DAY_MS }), // -5
    ]);
    expect(plantSoonestDue(p, NOW)).toBe(-5);
  });

  it("counts every due/overdue task across plants", () => {
    const plants = [
      plant([task({ lastDone: NOW }), task({ type: "rotate" })]), // 1 due (rotate, never)
      plant([task({ lastDone: NOW - 10 * DAY_MS })]), // 1 overdue
    ];
    expect(dueTaskCount(plants, NOW)).toBe(2);
  });
});

describe("nextReminderTime", () => {
  it("returns null with no days", () => {
    expect(nextReminderTime([], "09:00", NOW)).toBeNull();
  });
  it("finds a later time the same day", () => {
    const today = new Date(NOW).getDay() as Weekday;
    const next = nextReminderTime([today], "18:00", NOW);
    expect(new Date(next!).getHours()).toBe(18);
  });
  it("returns null for an invalid time", () => {
    expect(nextReminderTime([1], "nope", NOW)).toBeNull();
  });
});
