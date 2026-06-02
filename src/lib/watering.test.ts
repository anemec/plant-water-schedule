import { describe, it, expect } from "vitest";
import type { Plant, Weekday } from "../types";
import {
  DAY_MS,
  byUrgency,
  daysUntilDue,
  nextReminderTime,
  waterStatus,
  wateringProgress,
} from "./watering";

function makePlant(overrides: Partial<Plant> = {}): Plant {
  return {
    id: "p1",
    name: "Test",
    species: "",
    emoji: "🪴",
    intervalDays: 7,
    lastWatered: null,
    image: null,
    reminderDays: [],
    reminderTime: "09:00",
    ...overrides,
  };
}

const NOW = new Date("2026-06-02T12:00:00").getTime();

describe("daysUntilDue", () => {
  it("is 0 for a plant that has never been watered", () => {
    expect(daysUntilDue(makePlant(), NOW)).toBe(0);
  });

  it("equals the interval right after watering", () => {
    const plant = makePlant({ intervalDays: 7, lastWatered: NOW });
    expect(daysUntilDue(plant, NOW)).toBe(7);
  });

  it("counts down as time passes", () => {
    const plant = makePlant({ intervalDays: 7, lastWatered: NOW - 3 * DAY_MS });
    expect(daysUntilDue(plant, NOW)).toBe(4);
  });

  it("goes negative when overdue", () => {
    const plant = makePlant({ intervalDays: 7, lastWatered: NOW - 10 * DAY_MS });
    expect(daysUntilDue(plant, NOW)).toBe(-3);
  });
});

describe("waterStatus", () => {
  it("reports 'due' today for a never-watered plant", () => {
    const s = waterStatus(makePlant(), NOW);
    expect(s.urgency).toBe("due");
    expect(s.label).toMatch(/today/i);
  });

  it("reports 'soon' when due tomorrow", () => {
    const plant = makePlant({ intervalDays: 7, lastWatered: NOW - 6 * DAY_MS });
    expect(waterStatus(plant, NOW).urgency).toBe("soon");
  });

  it("reports 'ok' when comfortably ahead", () => {
    const plant = makePlant({ intervalDays: 7, lastWatered: NOW });
    expect(waterStatus(plant, NOW).urgency).toBe("ok");
  });

  it("pluralizes overdue days correctly", () => {
    const one = makePlant({ intervalDays: 7, lastWatered: NOW - 8 * DAY_MS });
    expect(waterStatus(one, NOW).label).toBe("Overdue by 1 day");
    const many = makePlant({ intervalDays: 7, lastWatered: NOW - 10 * DAY_MS });
    expect(waterStatus(many, NOW).label).toBe("Overdue by 3 days");
  });
});

describe("wateringProgress", () => {
  it("is 1 for a never-watered plant", () => {
    expect(wateringProgress(makePlant(), NOW)).toBe(1);
  });

  it("is 0 right after watering", () => {
    expect(wateringProgress(makePlant({ lastWatered: NOW }), NOW)).toBe(0);
  });

  it("is ~0.5 halfway through the interval", () => {
    const plant = makePlant({ intervalDays: 8, lastWatered: NOW - 4 * DAY_MS });
    expect(wateringProgress(plant, NOW)).toBeCloseTo(0.5, 5);
  });

  it("clamps to 1 when overdue", () => {
    const plant = makePlant({ intervalDays: 7, lastWatered: NOW - 20 * DAY_MS });
    expect(wateringProgress(plant, NOW)).toBe(1);
  });
});

describe("byUrgency", () => {
  it("sorts the most urgent plant first", () => {
    const fresh = makePlant({ id: "fresh", lastWatered: NOW });
    const overdue = makePlant({ id: "overdue", lastWatered: NOW - 10 * DAY_MS });
    const sorted = [fresh, overdue].sort((a, b) => byUrgency(a, b, NOW));
    expect(sorted[0].id).toBe("overdue");
  });
});

describe("nextReminderTime", () => {
  it("returns null with no days selected", () => {
    expect(nextReminderTime([], "09:00", NOW)).toBeNull();
  });

  it("finds a later time on the same day", () => {
    // NOW is a Tuesday at 12:00; 18:00 the same day should be next.
    const tuesday = new Date(NOW).getDay() as Weekday;
    const next = nextReminderTime([tuesday], "18:00", NOW);
    expect(next).not.toBeNull();
    expect(new Date(next!).getHours()).toBe(18);
    expect(new Date(next!).getDate()).toBe(new Date(NOW).getDate());
  });

  it("rolls to next week when the time today has passed", () => {
    const tuesday = new Date(NOW).getDay() as Weekday;
    const next = nextReminderTime([tuesday], "06:00", NOW);
    expect(next).not.toBeNull();
    expect(next! - NOW).toBeGreaterThan(6 * DAY_MS);
  });

  it("returns null for an invalid time string", () => {
    expect(nextReminderTime([1], "not-a-time", NOW)).toBeNull();
  });
});
