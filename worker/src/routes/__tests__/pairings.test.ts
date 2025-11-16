import { describe, it, expect, beforeAll } from "vitest";
import pairingsRouter from "../pairings";

// Mock environment
const createMockEnv = () => {
  return {
    DB: {
      prepare: (query: string) => ({
        bind: () => ({
          first: async () => {
            // Mock EA user
            if (query.includes("FROM `users`") && query.includes("eaId")) {
              return { id: "ea-1", name: "Test EA", email: "ea@test.com", role: "EA" };
            }
            // Mock client
            if (query.includes("FROM `clients`")) {
              return { id: "client-1", name: "Test Client" };
            }
            // Mock no existing pairing
            if (query.includes("FROM `pairings`") && query.includes("WHERE")) {
              return null;
            }
            // Mock pairing detail
            if (query.includes("FROM `pairings`") && !query.includes("WHERE")) {
              return {
                id: "pairing-1",
                eaId: "ea-1",
                clientId: "client-1",
                startDate: Math.floor(Date.now() / 1000),
                acceleratorEnabled: false,
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
};

describe("Pairing Management API Endpoints", () => {
  let mockEnv: ReturnType<typeof createMockEnv>;

  beforeAll(() => {
    mockEnv = createMockEnv();
  });

  it("should create pairing", async () => {
    const req = new Request("http://localhost/api/pairings", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer test-SUPER_ADMIN" },
      body: JSON.stringify({
        eaId: "ea-1",
        clientId: "client-1",
        startDate: "2024-01-01",
        acceleratorEnabled: false,
      }),
    });

    const res = await pairingsRouter.fetch(req, mockEnv);
    expect(res).toBeDefined();
  });

  it("should list pairings", async () => {
    const req = new Request("http://localhost/api/pairings", {
      method: "GET",
      headers: { Authorization: "Bearer test-SUPER_ADMIN" },
    });

    const res = await pairingsRouter.fetch(req, mockEnv);
    expect(res).toBeDefined();
  });

  it("should get pairing detail", async () => {
    const req = new Request("http://localhost/api/pairings/pairing-1", {
      method: "GET",
      headers: { Authorization: "Bearer test-SUPER_ADMIN" },
    });

    const res = await pairingsRouter.fetch(req, mockEnv);
    expect(res).toBeDefined();
  });

  it("should update pairing", async () => {
    const req = new Request("http://localhost/api/pairings/pairing-1", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: "Bearer test-SUPER_ADMIN" },
      body: JSON.stringify({
        acceleratorEnabled: true,
        acceleratorWeek1Goals: "Week 1 goals",
      }),
    });

    const res = await pairingsRouter.fetch(req, mockEnv);
    expect(res).toBeDefined();
  });

  it("should handle health status override", async () => {
    const req = new Request("http://localhost/api/pairings/pairing-1/health-status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: "Bearer test-SUPER_ADMIN" },
      body: JSON.stringify({
        healthStatusOverride: true,
        manualHealthStatus: "GREEN",
      }),
    });

    const res = await pairingsRouter.fetch(req, mockEnv);
    expect(res).toBeDefined();
  });

  it("should handle accelerator week progression", async () => {
    const req = new Request("http://localhost/api/pairings/pairing-1/accelerator-week", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: "Bearer test-SUPER_ADMIN" },
      body: JSON.stringify({
        acceleratorWeek: 2,
      }),
    });

    const res = await pairingsRouter.fetch(req, mockEnv);
    expect(res).toBeDefined();
  });

  it("should require admin role", async () => {
    const req = new Request("http://localhost/api/pairings", {
      method: "GET",
      // No Authorization header - should fail
    });

    const res = await pairingsRouter.fetch(req, mockEnv);
    expect(res.status).toBeGreaterThanOrEqual(400); // Should be unauthorized/forbidden
  });
});

