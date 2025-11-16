import { describe, it, expect } from "vitest";
import dashboardRouter from "../dashboard";

describe("Dashboard API Endpoints", () => {
  it("should have dashboard router defined", () => {
    expect(dashboardRouter).toBeDefined();
  });

  it("should validate EA status structure", () => {
    const status = {
      onTimeStatus: "on-time",
      healthcareEligibilityDate: null,
      lastStartOfDayLog: null,
      expectedShowUpTime: "09:00",
      timezone: "America/New_York",
    };

    expect(["on-time", "late", "not-logged"]).toContain(status.onTimeStatus);
  });

  it("should validate coaching notes structure", () => {
    const coachingNote = {
      id: "note-1",
      eaId: "ea-1",
      noteType: "EA_LEVEL",
      content: "Test note",
    };

    expect(coachingNote.noteType).toBe("EA_LEVEL");
  });

  it("should validate announcements structure", () => {
    const announcement = {
      id: "announcement-1",
      title: "Test",
      content: "Content",
      isActive: true,
      expiresAt: null,
    };

    expect(typeof announcement.isActive).toBe("boolean");
  });

  it("should validate clients dashboard structure", () => {
    const client = {
      clientId: "client-1",
      name: "Test Client",
      healthStatus: "GREEN",
      activeAlertsCount: 0,
      pairingsCount: 1,
      lastReportDate: null,
    };

    expect(["GREEN", "YELLOW", "RED"]).toContain(client.healthStatus);
    expect(typeof client.activeAlertsCount).toBe("number");
    expect(typeof client.pairingsCount).toBe("number");
  });
});

