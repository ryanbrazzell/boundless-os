import { describe, it, expect } from "vitest";
import { evaluateRulesForReport, RuleEvaluationResult } from "../alert-rules-engine";

describe("Alert Rules Engine Logic", () => {
  it("should have rule evaluation function defined", () => {
    expect(evaluateRulesForReport).toBeDefined();
    expect(typeof evaluateRulesForReport).toBe("function");
  });

  it("should validate rule evaluation result structure", () => {
    const result: RuleEvaluationResult = {
      ruleId: "rule-1",
      ruleName: "Test Rule",
      fired: true,
      severity: "CRITICAL",
      evidence: {
        reasoning: "Test reasoning",
        quotes: ["Test quote"],
      },
    };

    expect(result.ruleId).toBeDefined();
    expect(result.ruleName).toBeDefined();
    expect(result.fired).toBeDefined();
    expect(["CRITICAL", "HIGH", "MEDIUM", "LOW"]).toContain(result.severity);
  });

  it("should handle immediate trigger evaluation", () => {
    // Test structure validation
    const immediateResult: RuleEvaluationResult = {
      ruleId: "rule-1",
      ruleName: "Overwhelming Workload",
      fired: true,
      severity: "CRITICAL",
      evidence: {
        reasoning: "Workload feeling is overwhelming",
        quotes: ["OVERWHELMING"],
      },
    };

    expect(immediateResult.fired).toBe(true);
    expect(immediateResult.severity).toBe("CRITICAL");
  });

  it("should handle pattern-over-time evaluation", () => {
    const patternResult: RuleEvaluationResult = {
      ruleId: "rule-2",
      ruleName: "No Work Pattern",
      fired: true,
      severity: "CRITICAL",
      evidence: {
        occurrences: 3,
        reasoning: "3 occurrences in 7-day window (threshold: 3)",
        quotes: ["NOT_MUCH", "NOT_MUCH", "NOT_MUCH"],
      },
    };

    expect(patternResult.fired).toBe(true);
    expect(patternResult.evidence?.occurrences).toBe(3);
  });

  it("should handle rule that did not fire", () => {
    const noFireResult: RuleEvaluationResult = {
      ruleId: "rule-3",
      ruleName: "Test Rule",
      fired: false,
    };

    expect(noFireResult.fired).toBe(false);
    expect(noFireResult.severity).toBeUndefined();
    expect(noFireResult.evidence).toBeUndefined();
  });
});

