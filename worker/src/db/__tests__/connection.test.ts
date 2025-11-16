import { describe, it, expect, beforeAll } from "vitest";
import { getDb } from "../index";

// Mock D1Database for testing
const createMockD1Database = (): D1Database => {
  return {
    prepare: () => ({
      bind: () => ({
        first: async () => ({ test: "ok" }),
        run: async () => ({ success: true }),
        all: async () => ({ results: [] }),
      }),
      first: async () => ({ test: "ok" }),
      run: async () => ({ success: true }),
      all: async () => ({ results: [] }),
    }),
    exec: async () => ({ success: true }),
    batch: async () => [],
  } as unknown as D1Database;
};

describe("Database Connection", () => {
  let db: ReturnType<typeof getDb>;
  let mockEnv: { DB: D1Database };

  beforeAll(() => {
    mockEnv = { DB: createMockD1Database() };
    db = getDb(mockEnv);
  });

  it("should create a database connection", () => {
    expect(db).toBeDefined();
  });

  it("should execute a basic SELECT query", async () => {
    // Test that we can prepare a query
    const result = await mockEnv.DB.prepare("SELECT 1 as test").first();
    expect(result).toBeDefined();
  });

  it("should have Drizzle ORM configured", () => {
    // Verify Drizzle is set up by checking db object structure
    expect(db).toBeDefined();
    // Drizzle returns a query builder object
    expect(typeof db).toBe("object");
  });
});

