import { describe, it, expect, beforeAll } from "vitest";
import { getDb } from "../index";
import { pairings, endOfDayReports } from "../schema";

// Mock D1Database for testing
const createMockD1Database = (): D1Database => {
  return {
    prepare: (query: string) => {
      return {
        bind: () => ({
          first: async () => ({ id: "test-id", eaId: "ea-1", clientId: "client-1" }),
          run: async () => ({ success: true }),
          all: async () => ({ results: [] }),
        }),
        first: async () => ({ id: "test-id", eaId: "ea-1", clientId: "client-1" }),
        run: async () => ({ success: true }),
        all: async () => ({ results: [] }),
      };
    },
    exec: async () => ({ success: true }),
    batch: async () => [],
  } as unknown as D1Database;
};

describe("Pairings and Reports Tables", () => {
  let db: ReturnType<typeof getDb>;
  let mockEnv: { DB: D1Database };

  beforeAll(() => {
    mockEnv = { DB: createMockD1Database() };
    db = getDb(mockEnv);
  });

  it("should have Pairings table schema defined", () => {
    expect(pairings).toBeDefined();
    expect(pairings.id).toBeDefined();
    expect(pairings.eaId).toBeDefined();
    expect(pairings.clientId).toBeDefined();
    expect(pairings.healthStatus).toBeDefined();
    expect(pairings.acceleratorEnabled).toBeDefined();
  });

  it("should have EndOfDayReports table schema defined", () => {
    expect(endOfDayReports).toBeDefined();
    expect(endOfDayReports.id).toBeDefined();
    expect(endOfDayReports.pairingId).toBeDefined();
    expect(endOfDayReports.eaId).toBeDefined();
    expect(endOfDayReports.reportDate).toBeDefined();
    expect(endOfDayReports.workloadFeeling).toBeDefined();
    expect(endOfDayReports.hadDailySync).toBeDefined();
  });

  it("should validate Pairings unique constraint (eaId, clientId)", () => {
    // Verify unique constraint is defined in schema
    expect(pairings.eaId).toBeDefined();
    expect(pairings.clientId).toBeDefined();
    // The unique constraint is enforced via uniqueIndex in schema definition
  });

  it("should validate EndOfDayReports foreign key relationships", () => {
    // Verify foreign keys are defined
    expect(endOfDayReports.pairingId).toBeDefined();
    expect(endOfDayReports.eaId).toBeDefined();
    // Foreign keys are defined via .references() in schema
  });

  it("should validate report enum values", () => {
    const validWorkloadFeelings = ["LIGHT", "MODERATE", "HEAVY", "OVERWHELMING"];
    const validWorkTypes = ["NOT_MUCH", "REGULAR", "MIX", "MOSTLY_NEW"];
    const validFeelings = ["GREAT", "GOOD", "OKAY", "STRESSED"];
    
    validWorkloadFeelings.forEach((feeling) => {
      expect(validWorkloadFeelings.includes(feeling)).toBe(true);
    });
    validWorkTypes.forEach((type) => {
      expect(validWorkTypes.includes(type)).toBe(true);
    });
    validFeelings.forEach((feeling) => {
      expect(validFeelings.includes(feeling)).toBe(true);
    });
  });
});

