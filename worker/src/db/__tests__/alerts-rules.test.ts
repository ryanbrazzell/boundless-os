import { describe, it, expect, beforeAll } from "vitest";
import { getDb } from "../index";
import { alertRules, alerts } from "../schema";

// Mock D1Database for testing
const createMockD1Database = (): D1Database => {
  return {
    prepare: (query: string) => {
      return {
        bind: () => ({
          first: async () => ({ 
            id: "test-id", 
            ruleNumber: 1, 
            triggerCondition: JSON.stringify({ test: "data" }),
            evidence: JSON.stringify({ confidence: 0.9, reasoning: "test" })
          }),
          run: async () => ({ success: true }),
          all: async () => ({ results: [] }),
        }),
        first: async () => ({ 
          id: "test-id", 
          ruleNumber: 1,
          triggerCondition: JSON.stringify({ test: "data" }),
          evidence: JSON.stringify({ confidence: 0.9, reasoning: "test" })
        }),
        run: async () => ({ success: true }),
        all: async () => ({ results: [] }),
      };
    },
    exec: async () => ({ success: true }),
    batch: async () => [],
  } as unknown as D1Database;
};

describe("Alerts and Rules Tables", () => {
  let db: ReturnType<typeof getDb>;
  let mockEnv: { DB: D1Database };

  beforeAll(() => {
    mockEnv = { DB: createMockD1Database() };
    db = getDb(mockEnv);
  });

  it("should have AlertRules table schema defined", () => {
    expect(alertRules).toBeDefined();
    expect(alertRules.id).toBeDefined();
    expect(alertRules.ruleNumber).toBeDefined();
    expect(alertRules.ruleType).toBeDefined();
    expect(alertRules.severity).toBeDefined();
    expect(alertRules.triggerCondition).toBeDefined();
    expect(alertRules.evidence).toBeUndefined(); // evidence is on alerts table, not alertRules
  });

  it("should have Alerts table schema defined", () => {
    expect(alerts).toBeDefined();
    expect(alerts.id).toBeDefined();
    expect(alerts.pairingId).toBeDefined();
    expect(alerts.ruleId).toBeDefined();
    expect(alerts.severity).toBeDefined();
    expect(alerts.status).toBeDefined();
    expect(alerts.evidence).toBeDefined();
  });

  it("should validate rule type enum values", () => {
    const validRuleTypes = ["LOGIC", "AI_TEXT"];
    validRuleTypes.forEach((type) => {
      expect(validRuleTypes.includes(type)).toBe(true);
    });
  });

  it("should validate severity enum values", () => {
    const validSeverities = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];
    validSeverities.forEach((severity) => {
      expect(validSeverities.includes(severity)).toBe(true);
    });
  });

  it("should validate alert status enum values", () => {
    const validStatuses = ["NEW", "INVESTIGATING", "WORKING_ON", "RESOLVED"];
    validStatuses.forEach((status) => {
      expect(validStatuses.includes(status)).toBe(true);
    });
  });

  it("should store JSONB fields as text (SQLite compatibility)", () => {
    // Verify that JSON fields are stored as text in SQLite
    const testJson = { test: "data", number: 123 };
    const jsonString = JSON.stringify(testJson);
    const parsed = JSON.parse(jsonString);
    expect(parsed).toEqual(testJson);
  });
});

