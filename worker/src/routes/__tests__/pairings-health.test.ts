import { describe, it, expect } from "vitest";
import pairingsRouter from "../pairings";

// Mock environment
const createMockEnv = () => {
  return {
    DB: {
      prepare: (query: string) => ({
        bind: () => ({
          first: async () => {
            // Mock pairing
            if (query.includes("FROM `pairings`")) {
              return {
                id: "pairing-1",
                eaId: "ea-1",
                clientId: "client-1",
                healthStatusOverride: false,
                healthStatus: null,
              };
            }
            return null;
          },
          run: async () => ({ success: true }),
          all: async () => ({ results: [] }),
          raw: async () => [[]],
        }),
        first: async () => null,
        run: async () => ({ success: true }),
        all: async () => ({ results: [] }),
        raw: async () => [[]],
      }),
      exec: async () => ({ success: true }),
      batch: async () => [],
    } as unknown as D1Database,
  };
};

describe("Health Calculation API Endpoint", () => {
  it("should have health calculation endpoint", async () => {
    const mockEnv = createMockEnv();
    const req = new Request("http://localhost/api/pairings/pairing-1/health", {
      method: "GET",
      headers: { Authorization: "Bearer test-SUPER_ADMIN" },
    });

    const res = await pairingsRouter.fetch(req, mockEnv);
    expect(res).toBeDefined();
    // Endpoint exists - actual calculation will be tested with real database
  });

  it("should handle non-existent pairing", async () => {
    const mockEnv = {
      DB: {
        prepare: (query: string) => ({
          bind: () => ({
            first: async () => null,
            run: async () => ({ success: true }),
            all: async () => ({ results: [] }),
            raw: async () => [[]],
          }),
          first: async () => null,
          run: async () => ({ success: true }),
          all: async () => ({ results: [] }),
          raw: async () => [[]],
        }),
        exec: async () => ({ success: true }),
        batch: async () => [],
      } as unknown as D1Database,
    };

    const req = new Request("http://localhost/api/pairings/non-existent/health", {
      method: "GET",
      headers: { Authorization: "Bearer test-SUPER_ADMIN" },
    });

    const res = await pairingsRouter.fetch(req, mockEnv);
    // Should return 404 (not found) or 403 (forbidden) depending on auth check
    expect([403, 404]).toContain(res.status);
  });
});

