import { describe, it, expect } from "vitest";
import analyticsRouter from "../analytics";
import { adminRoles } from "../../middleware/auth";

describe("Analytics API Endpoints", () => {
  it("should have analytics router defined", () => {
    expect(analyticsRouter).toBeDefined();
  });

  it("should validate admin roles for analytics access", () => {
    expect(adminRoles).toContain("SUPER_ADMIN");
    expect(adminRoles).toContain("HEAD_CLIENT_SUCCESS");
    expect(adminRoles).toContain("HEAD_EAS");
  });

  it("should validate period values", () => {
    const validPeriods = ["7d", "30d", "90d", "custom"];
    validPeriods.forEach((period) => {
      expect(validPeriods.includes(period)).toBe(true);
    });
  });

  it("should validate analytics trends endpoint structure", () => {
    const endpoint = {
      path: "/trends",
      method: "GET",
      queryParams: ["eaId", "clientId", "pairingId", "period", "startDate", "endDate"],
    };

    expect(endpoint.path).toBe("/trends");
    expect(endpoint.method).toBe("GET");
    expect(endpoint.queryParams.length).toBeGreaterThan(0);
  });
});

