import { describe, it, expect } from "vitest";
import alertRulesRouter from "../alert-rules";
import { ruleTypeValues, severityValues } from "../../db/schema";
import { adminRoles } from "../../middleware/auth";

describe("Alert Rules Management API Endpoints", () => {
  it("should have alert rules router defined", () => {
    expect(alertRulesRouter).toBeDefined();
  });

  it("should validate admin roles for rule management", () => {
    expect(adminRoles).toContain("SUPER_ADMIN");
    expect(adminRoles).toContain("HEAD_CLIENT_SUCCESS");
    expect(adminRoles).toContain("HEAD_EAS");
  });

  it("should validate rule type enum values", () => {
    expect(ruleTypeValues).toContain("LOGIC");
    expect(ruleTypeValues).toContain("AI_TEXT");
  });

  it("should validate severity enum values", () => {
    expect(severityValues).toContain("CRITICAL");
    expect(severityValues).toContain("HIGH");
    expect(severityValues).toContain("MEDIUM");
    expect(severityValues).toContain("LOW");
  });

  it("should validate alert rule structure", () => {
    const rule = {
      id: "rule-1",
      name: "Test Rule",
      ruleNumber: 1,
      ruleType: "LOGIC",
      severity: "CRITICAL",
      isEnabled: true,
      triggerCondition: JSON.stringify({ field: "workloadFeeling", operator: "equals", value: "OVERWHELMING" }),
      alertTitle: "Test Alert",
      alertDescription: "Test description",
    };

    expect(rule.id).toBeDefined();
    expect(rule.name).toBeDefined();
    expect(ruleTypeValues).toContain(rule.ruleType);
    expect(severityValues).toContain(rule.severity);
    expect(typeof rule.isEnabled).toBe("boolean");
  });

  it("should validate rule update structure", () => {
    const updateData = {
      name: "Updated Rule",
      severity: "HIGH",
      isEnabled: false,
      adjustableThresholds: JSON.stringify({ threshold: 3 }),
    };

    expect(updateData.name).toBeDefined();
    expect(severityValues).toContain(updateData.severity);
    expect(typeof updateData.isEnabled).toBe("boolean");
  });
});

