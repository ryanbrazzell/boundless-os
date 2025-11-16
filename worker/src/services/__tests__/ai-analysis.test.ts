import { describe, it, expect } from "vitest";
import { buildPrompt, buildBatchedPrompt, parseClaudeResponse, parseBatchedClaudeResponse } from "../ai-analysis";

describe("AI Analysis Service Logic", () => {
  it("should build prompt correctly", () => {
    const report = {
      id: "report-1",
      difficulties: "Some challenges",
      supportNeeded: "Need help",
      additionalNotes: "Notes here",
      whatCompleted: "Completed tasks",
      biggestWin: "Big win",
    } as any;

    const prompt = buildPrompt(report, "Test Rule", ["Pattern 1", "Pattern 2"]);
    
    expect(prompt).toContain("Test Rule");
    expect(prompt).toContain("Some challenges");
    expect(prompt).toContain("Pattern 1");
    expect(prompt).toContain("Pattern 2");
  });

  it("should build batched prompt correctly", () => {
    const report = {
      id: "report-1",
      difficulties: "Challenges",
      supportNeeded: "Support",
      additionalNotes: "Notes",
      whatCompleted: "Completed",
      biggestWin: "Win",
    } as any;

    const rules = [
      { id: "rule-1", name: "Rule 1", adjustableThresholds: JSON.stringify({ patterns: ["Pattern 1"] }) },
      { id: "rule-2", name: "Rule 2", adjustableThresholds: JSON.stringify({ patterns: ["Pattern 2"] }) },
    ];

    const prompt = buildBatchedPrompt(report, rules);
    
    expect(prompt).toContain("Rule 1");
    expect(prompt).toContain("Rule 2");
    expect(prompt).toContain("Pattern 1");
    expect(prompt).toContain("Pattern 2");
  });

  it("should parse Claude API response correctly", () => {
    const responseText = JSON.stringify({
      detected: true,
      confidence: 0.85,
      evidence: ["Quote 1", "Quote 2"],
      reasoning: "Clear evidence found",
    });

    const parsed = parseClaudeResponse(responseText);
    
    expect(parsed.detected).toBe(true);
    expect(parsed.confidence).toBe(0.85);
    expect(parsed.evidence).toEqual(["Quote 1", "Quote 2"]);
    expect(parsed.reasoning).toBe("Clear evidence found");
  });

  it("should parse response with markdown code blocks", () => {
    const responseText = "```json\n" + JSON.stringify({
      detected: false,
      confidence: 0.3,
      evidence: [],
      reasoning: "No evidence",
    }) + "\n```";

    const parsed = parseClaudeResponse(responseText);
    
    expect(parsed.detected).toBe(false);
    expect(parsed.confidence).toBe(0.3);
  });

  it("should parse batched response correctly", () => {
    const responseText = JSON.stringify([
      {
        ruleId: "rule-1",
        detected: true,
        confidence: 0.8,
        evidence: ["Evidence 1"],
        reasoning: "Reason 1",
      },
      {
        ruleId: "rule-2",
        detected: false,
        confidence: 0.2,
        evidence: [],
        reasoning: "Reason 2",
      },
    ]);

    const parsed = parseBatchedClaudeResponse(responseText, ["rule-1", "rule-2"]);
    
    expect(parsed.length).toBe(2);
    expect(parsed[0].ruleId).toBe("rule-1");
    expect(parsed[0].detected).toBe(true);
    expect(parsed[1].ruleId).toBe("rule-2");
    expect(parsed[1].detected).toBe(false);
  });

  it("should handle malformed responses gracefully", () => {
    const malformedResponse = "This is not JSON";
    const parsed = parseClaudeResponse(malformedResponse);
    
    expect(parsed.detected).toBe(false);
    expect(parsed.confidence).toBe(0);
    expect(parsed.reasoning).toContain("Failed to parse");
  });

  it("should clamp confidence values", () => {
    const responseText = JSON.stringify({
      detected: true,
      confidence: 1.5, // Over 1.0
      evidence: [],
      reasoning: "Test",
    });

    const parsed = parseClaudeResponse(responseText);
    expect(parsed.confidence).toBe(1.0); // Clamped to 1.0
  });
});

