import { describe, it, expect } from "vitest";
import { formatDateTime, formatRelativeDay } from "./format";

const DAY = 24 * 60 * 60 * 1000;
const NOW = new Date("2026-06-02T12:00:00").getTime();

describe("formatDateTime", () => {
  it("returns 'Never' for null", () => {
    expect(formatDateTime(null)).toBe("Never");
  });

  it("formats a timestamp into a non-empty string", () => {
    expect(formatDateTime(NOW)).toMatch(/\w/);
  });
});

describe("formatRelativeDay", () => {
  it("labels the same day as Today", () => {
    expect(formatRelativeDay(NOW, NOW)).toBe("Today");
  });

  it("labels the previous day as Yesterday", () => {
    expect(formatRelativeDay(NOW - DAY, NOW)).toBe("Yesterday");
  });

  it("labels a few days back with 'N days ago'", () => {
    expect(formatRelativeDay(NOW - 3 * DAY, NOW)).toBe("3 days ago");
  });
});
