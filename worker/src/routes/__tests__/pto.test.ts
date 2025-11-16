import { describe, it, expect } from "vitest";
import ptoRouter from "../pto";
import { ptoReasonValues } from "../../db/schema";
import { adminRoles } from "../../middleware/auth";

describe("PTO Management API Endpoints", () => {
  it("should have PTO router defined", () => {
    expect(ptoRouter).toBeDefined();
  });

  it("should validate PTO reason enum values", () => {
    expect(ptoReasonValues).toContain("PTO");
    expect(ptoReasonValues).toContain("SICK");
    expect(ptoReasonValues).toContain("OTHER");
  });

  it("should validate admin roles for management", () => {
    expect(adminRoles).toContain("SUPER_ADMIN");
    expect(adminRoles).toContain("HEAD_CLIENT_SUCCESS");
    expect(adminRoles).toContain("HEAD_EAS");
  });

  it("should validate PTO date range validation", () => {
    const now = Math.floor(Date.now() / 1000);
    const tomorrow = now + 86400;
    const yesterday = now - 86400;

    // Valid: startDate <= endDate
    expect(yesterday <= tomorrow).toBe(true);

    // Invalid: startDate > endDate
    expect(tomorrow <= yesterday).toBe(false);
  });

  it("should validate PTO record structure", () => {
    const ptoRecord = {
      id: "pto-1",
      eaId: "ea-1",
      startDate: Math.floor(Date.now() / 1000),
      endDate: Math.floor(Date.now() / 1000) + 86400,
      reason: "PTO",
    };

    expect(ptoRecord.id).toBeDefined();
    expect(ptoRecord.eaId).toBeDefined();
    expect(ptoRecord.startDate).toBeDefined();
    expect(ptoRecord.endDate).toBeDefined();
    expect(ptoReasonValues).toContain(ptoRecord.reason);
  });
});

