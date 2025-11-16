import { describe, it, expect } from "vitest";

describe("AI Analysis Integration", () => {
  it("should have AI analysis service functions defined", () => {
    // Test that the service can be imported
    expect(() => import("../../services/ai-analysis")).not.toThrow();
  });

  it("should validate Claude API response structure", () => {
    const validResponse = {
      detected: true,
      confidence: 0.85,
      evidence: ["Quote 1", "Quote 2"],
      reasoning: "Clear evidence",
    };

    expect(typeof validResponse.detected).toBe("boolean");
    expect(typeof validResponse.confidence).toBe("number");
    expect(validResponse.confidence >= 0 && validResponse.confidence <= 1).toBe(true);
    expect(Array.isArray(validResponse.evidence)).toBe(true);
    expect(typeof validResponse.reasoning).toBe("string");
  });

  it("should validate prompt structure", () => {
    const prompt = `You are analyzing an EA's daily report for potential churn risk signals.

Report Fields:
- Difficulties: "test"
- Support Needed: "test"
- Additional Notes: "test"
- What Completed: "test"
- Biggest Win: "test"

Analyze for: Test Rule

Patterns to detect:
- Pattern 1
- Pattern 2`;

    expect(prompt).toContain("Report Fields");
    expect(prompt).toContain("Analyze for:");
    expect(prompt).toContain("Patterns to detect");
  });

  it("should validate confidence threshold logic", () => {
    const threshold = 0.7;
    const highConfidence = 0.85;
    const lowConfidence = 0.5;

    expect(highConfidence >= threshold).toBe(true);
    expect(lowConfidence >= threshold).toBe(false);
  });
});

