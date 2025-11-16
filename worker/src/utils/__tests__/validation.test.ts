import { describe, it, expect } from "vitest";
import {
  isValidEmail,
  isValidDateString,
  sanitizeString,
  isValidUUID,
  isValidEnumValue,
  validatePagination,
  isValidTimestamp,
} from "../validation";

describe("Validation Utilities", () => {
  it("should validate email correctly", () => {
    expect(isValidEmail("test@example.com")).toBe(true);
    expect(isValidEmail("invalid-email")).toBe(false);
    expect(isValidEmail("test@")).toBe(false);
    expect(isValidEmail("@example.com")).toBe(false);
  });

  it("should validate date string correctly", () => {
    expect(isValidDateString("2024-01-01")).toBe(true);
    expect(isValidDateString("2024-13-01")).toBe(false);
    expect(isValidDateString("01/01/2024")).toBe(false);
    expect(isValidDateString("invalid")).toBe(false);
  });

  it("should sanitize string input", () => {
    expect(sanitizeString("  test  ")).toBe("test");
    expect(sanitizeString(null)).toBe("");
    expect(sanitizeString(undefined)).toBe("");
    expect(sanitizeString("test", 2)).toBe("te");
  });

  it("should validate UUID format", () => {
    const validUUID = "550e8400-e29b-41d4-a716-446655440000";
    const invalidUUID = "not-a-uuid";
    expect(isValidUUID(validUUID)).toBe(true);
    expect(isValidUUID(invalidUUID)).toBe(false);
  });

  it("should validate enum values", () => {
    const enumValues = ["A", "B", "C"] as const;
    expect(isValidEnumValue("A", enumValues)).toBe(true);
    expect(isValidEnumValue("D", enumValues)).toBe(false);
  });

  it("should validate pagination parameters", () => {
    const { limit, offset, errors } = validatePagination("50", "10");
    expect(limit).toBe(50);
    expect(offset).toBe(10);
    expect(errors.length).toBe(0);

    const invalid = validatePagination("invalid", "-5");
    expect(invalid.errors.length).toBeGreaterThan(0);
  });

  it("should validate timestamps", () => {
    const now = Math.floor(Date.now() / 1000);
    expect(isValidTimestamp(now)).toBe(true);
    expect(isValidTimestamp("946684800")).toBe(true);
    expect(isValidTimestamp("invalid")).toBe(false);
    expect(isValidTimestamp(0)).toBe(false);
  });
});

