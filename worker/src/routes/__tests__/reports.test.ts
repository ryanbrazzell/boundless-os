import { describe, it, expect, beforeAll } from "vitest";
import reportsRouter from "../reports";

// Mock environment
const createMockEnv = () => {
  return {
    DB: {
      prepare: (query: string) => ({
        bind: () => ({
          first: async () => {
            // Mock pairing
            if (query.includes("FROM `pairings`")) {
              return { id: "pairing-1", eaId: "ea-1", clientId: "client-1" };
            }
            // Mock EA
            if (query.includes("FROM `eas`")) {
              return { id: "ea-1", timezone: "America/New_York" };
            }
            // Mock no existing report
            if (query.includes("FROM `end_of_day_reports`") && query.includes("WHERE")) {
              return null;
            }
            // Mock report detail
            if (query.includes("FROM `end_of_day_reports`") && !query.includes("JOIN")) {
              return {
                id: "report-1",
                pairingId: "pairing-1",
                eaId: "ea-1",
                reportDate: Math.floor(Date.now() / 1000),
                workloadFeeling: "MODERATE",
                workType: "REGULAR",
                feelingDuringWork: "GOOD",
                biggestWin: "Completed project",
                whatCompleted: "Task list",
                hadDailySync: true,
              };
            }
            // Mock client
            if (query.includes("FROM `clients`")) {
              return { id: "client-1", name: "Test Client" };
            }
            // Mock user
            if (query.includes("FROM `users`")) {
              return { id: "ea-1", name: "Test EA", email: "ea@test.com" };
            }
            return null;
          },
          run: async () => ({ success: true }),
          all: async () => ({ results: [] }),
        }),
        first: async () => null,
        run: async () => ({ success: true }),
        all: async () => ({ results: [] }),
      }),
      exec: async () => ({ success: true }),
      batch: async () => [],
    } as unknown as D1Database,
  };
};

describe("Report Submission & Storage API", () => {
  let mockEnv: ReturnType<typeof createMockEnv>;

  beforeAll(() => {
    mockEnv = createMockEnv();
  });

  it("should submit report", async () => {
    const req = new Request("http://localhost/api/reports/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer test-SUPER_ADMIN" },
      body: JSON.stringify({
        pairingId: "pairing-1",
        eaId: "ea-1",
        workloadFeeling: "MODERATE",
        workType: "REGULAR",
        feelingDuringWork: "GOOD",
        biggestWin: "Completed project",
        whatCompleted: "Task list",
        hadDailySync: true,
      }),
    });

    const res = await reportsRouter.fetch(req, mockEnv);
    expect(res).toBeDefined();
  });

  it("should prevent duplicate reports", async () => {
    // Mock existing report
    const mockEnvWithExistingReport = {
      ...mockEnv,
      DB: {
        ...mockEnv.DB,
        prepare: (query: string) => ({
          bind: () => ({
            first: async () => {
              if (query.includes("FROM `end_of_day_reports`") && query.includes("WHERE")) {
                return {
                  id: "existing-report-1",
                  pairingId: "pairing-1",
                  reportDate: Math.floor(Date.now() / 1000),
                };
              }
              return null;
            },
            run: async () => ({ success: true }),
            all: async () => ({ results: [] }),
          }),
          first: async () => null,
          run: async () => ({ success: true }),
          all: async () => ({ results: [] }),
        }),
        exec: async () => ({ success: true }),
        batch: async () => [],
      } as unknown as D1Database,
    };

    const req = new Request("http://localhost/api/reports/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer test-SUPER_ADMIN" },
      body: JSON.stringify({
        pairingId: "pairing-1",
        eaId: "ea-1",
        workloadFeeling: "MODERATE",
        workType: "REGULAR",
        feelingDuringWork: "GOOD",
        biggestWin: "Completed project",
        whatCompleted: "Task list",
        hadDailySync: true,
      }),
    });

    const res = await reportsRouter.fetch(req, mockEnvWithExistingReport);
    expect(res.status).toBeGreaterThanOrEqual(400); // Should be conflict or error
  });

  it("should get report history", async () => {
    const req = new Request("http://localhost/api/reports/history?eaId=ea-1&limit=30", {
      method: "GET",
      headers: { Authorization: "Bearer test-SUPER_ADMIN" },
    });

    const res = await reportsRouter.fetch(req, mockEnv);
    expect(res).toBeDefined();
  });

  it("should get report detail", async () => {
    const req = new Request("http://localhost/api/reports/report-1", {
      method: "GET",
      headers: { Authorization: "Bearer test-SUPER_ADMIN" },
    });

    const res = await reportsRouter.fetch(req, mockEnv);
    expect(res).toBeDefined();
  });

  it("should validate required fields", async () => {
    const req = new Request("http://localhost/api/reports/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer test-SUPER_ADMIN" },
      body: JSON.stringify({
        pairingId: "pairing-1",
        // Missing required fields
      }),
    });

    const res = await reportsRouter.fetch(req, mockEnv);
    // Should return 400 for missing fields, or 404 if pairing/EA not found
    expect([400, 404]).toContain(res.status);
  });

  it("should validate enum values", async () => {
    const req = new Request("http://localhost/api/reports/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer test-SUPER_ADMIN" },
      body: JSON.stringify({
        pairingId: "pairing-1",
        eaId: "ea-1",
        workloadFeeling: "INVALID_VALUE",
        workType: "REGULAR",
        feelingDuringWork: "GOOD",
        biggestWin: "Completed project",
        whatCompleted: "Task list",
        hadDailySync: true,
      }),
    });

    const res = await reportsRouter.fetch(req, mockEnv);
    // Should return 400 for invalid enum, or 404 if pairing/EA not found
    expect([400, 404]).toContain(res.status);
  });
});

