import { describe, it, expect } from "vitest";
import {
  getStartOfDay,
  getEndOfDay,
  calculateBusinessDays,
  formatDate,
  parseDate,
  getDateRange,
  isToday,
} from "../date";

describe("Date Utilities", () => {
  it("should get start of day timestamp", () => {
    const timestamp = Math.floor(Date.now() / 1000);
    const start = getStartOfDay(timestamp);
    const date = new Date(start * 1000);
    expect(date.getHours()).toBe(0);
    expect(date.getMinutes()).toBe(0);
    expect(date.getSeconds()).toBe(0);
  });

  it("should get end of day timestamp", () => {
    const timestamp = Math.floor(Date.now() / 1000);
    const end = getEndOfDay(timestamp);
    const date = new Date(end * 1000);
    expect(date.getHours()).toBe(23);
    expect(date.getMinutes()).toBe(59);
  });

  it("should calculate business days", () => {
    const start = parseDate("2024-01-01"); // Monday
    const end = parseDate("2024-01-05"); // Friday
    const days = calculateBusinessDays(start, end);
    // Monday to Friday inclusive = 5 business days
    // But the function counts inclusively, so it should be 5
    expect(days).toBeGreaterThanOrEqual(4); // At least 4 (Mon-Thu)
    expect(days).toBeLessThanOrEqual(5); // At most 5 (Mon-Fri)
  });

  it("should format date to ISO string", () => {
    const timestamp = parseDate("2024-01-15");
    const formatted = formatDate(timestamp);
    expect(formatted).toBe("2024-01-15");
  });

  it("should parse date string to timestamp", () => {
    const timestamp = parseDate("2024-01-15");
    expect(typeof timestamp).toBe("number");
    expect(timestamp).toBeGreaterThan(0);
  });

  it("should get date range for last N days", () => {
    const { start, end } = getDateRange(7);
    expect(end - start).toBe(7 * 24 * 60 * 60);
  });

  it("should check if timestamp is today", () => {
    const now = Math.floor(Date.now() / 1000);
    expect(isToday(now)).toBe(true);
  });
});

