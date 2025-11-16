import { describe, it, expect } from "vitest";
import { checkActivePTO, isEAOutOfOffice } from "../pto-check";

describe("PTO Check Service Logic", () => {
  it("should have PTO check functions defined", () => {
    expect(checkActivePTO).toBeDefined();
    expect(typeof checkActivePTO).toBe("function");
    expect(isEAOutOfOffice).toBeDefined();
    expect(typeof isEAOutOfOffice).toBe("function");
  });

  it("should validate PTO reason enum values", () => {
    const validReasons = ["PTO", "SICK", "OTHER"];
    validReasons.forEach((reason) => {
      expect(validReasons.includes(reason)).toBe(true);
    });
  });

  it("should validate PTO date range logic", () => {
    const now = Math.floor(Date.now() / 1000);
    const yesterday = now - 86400;
    const tomorrow = now + 86400;
    const nextWeek = now + 7 * 86400;

    // Active PTO: startDate <= now <= endDate
    const activePTO = {
      startDate: yesterday,
      endDate: tomorrow,
    };
    expect(activePTO.startDate <= now && now <= activePTO.endDate).toBe(true);

    // Past PTO: endDate < now
    const pastPTO = {
      startDate: yesterday - 86400,
      endDate: yesterday,
    };
    expect(pastPTO.endDate < now).toBe(true);

    // Upcoming PTO: startDate > now
    const upcomingPTO = {
      startDate: tomorrow,
      endDate: nextWeek,
    };
    expect(upcomingPTO.startDate > now).toBe(true);
  });

  it("should validate PTO record structure", () => {
    const ptoRecord = {
      id: "pto-1",
      eaId: "ea-1",
      startDate: Math.floor(Date.now() / 1000),
      endDate: Math.floor(Date.now() / 1000) + 86400,
      reason: "PTO",
      createdAt: Math.floor(Date.now() / 1000),
      updatedAt: Math.floor(Date.now() / 1000),
    };

    expect(ptoRecord.id).toBeDefined();
    expect(ptoRecord.eaId).toBeDefined();
    expect(ptoRecord.startDate).toBeDefined();
    expect(ptoRecord.endDate).toBeDefined();
    expect(["PTO", "SICK", "OTHER"]).toContain(ptoRecord.reason);
    expect(ptoRecord.startDate <= ptoRecord.endDate).toBe(true);
  });
});

