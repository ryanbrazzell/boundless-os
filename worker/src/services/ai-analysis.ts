import { endOfDayReports, alertRules } from "../db/schema";

export interface AIAnalysisRequest {
  reportId: string;
  report: typeof endOfDayReports.$inferSelect;
  rules: Array<typeof alertRules.$inferSelect>;
}

export interface AIAnalysisResult {
  ruleId: string;
  detected: boolean;
  confidence: number;
  evidence: string[];
  reasoning: string;
}

export interface ClaudeAPIResponse {
  detected: boolean;
  confidence: number;
  evidence: string[];
  reasoning: string;
}

/**
 * Build structured prompt for Claude API
 */
export const buildPrompt = (
  report: typeof endOfDayReports.$inferSelect,
  ruleName: string,
  patterns: string[]
): string => {
  const prompt = `You are analyzing an EA's daily report for potential churn risk signals.

Report Fields:
- Difficulties: "${report.difficulties || ""}"
- Support Needed: "${report.supportNeeded || ""}"
- Additional Notes: "${report.additionalNotes || ""}"
- What Completed: "${report.whatCompleted || ""}"
- Biggest Win: "${report.biggestWin || ""}"

Analyze for: ${ruleName}

Patterns to detect:
${patterns.map((p) => `- ${p}`).join("\n")}

Return JSON:
{
  "detected": boolean,
  "confidence": 0.0 to 1.0,
  "evidence": ["specific quotes from text"],
  "reasoning": "brief explanation"
}

Only return detected:true if there is clear evidence. When in doubt, return false.`;

  return prompt;
};

/**
 * Build batched prompt for multiple rules
 */
export const buildBatchedPrompt = (
  report: typeof endOfDayReports.$inferSelect,
  rules: Array<{ id: string; name: string; adjustableThresholds: string | null }>
): string => {
  const reportFields = `Report Fields:
- Difficulties: "${report.difficulties || ""}"
- Support Needed: "${report.supportNeeded || ""}"
- Additional Notes: "${report.additionalNotes || ""}"
- What Completed: "${report.whatCompleted || ""}"
- Biggest Win: "${report.biggestWin || ""}"`;

  const ruleAnalyses = rules.map((rule) => {
    let patterns: string[] = [];
    try {
      if (rule.adjustableThresholds) {
        const thresholds = JSON.parse(rule.adjustableThresholds);
        patterns = thresholds.patterns || [];
      }
    } catch {
      // Use default patterns if parsing fails
      patterns = [];
    }

    return `Rule: ${rule.name}
Patterns to detect:
${patterns.map((p) => `- ${p}`).join("\n")}`;
  });

  const prompt = `You are analyzing an EA's daily report for potential churn risk signals.

${reportFields}

Analyze for the following rules:

${ruleAnalyses.join("\n\n")}

For each rule, return JSON:
{
  "ruleId": "rule-id",
  "detected": boolean,
  "confidence": 0.0 to 1.0,
  "evidence": ["specific quotes from text"],
  "reasoning": "brief explanation"
}

Return an array of results, one per rule. Only return detected:true if there is clear evidence. When in doubt, return false.`;

  return prompt;
};

/**
 * Call Claude API
 */
export const callClaudeAPI = async (
  prompt: string,
  apiKey: string,
  model: string = "claude-3-5-sonnet-20241022"
): Promise<string> => {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Claude API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return data.content[0].text;
};

/**
 * Parse Claude API JSON response
 */
export const parseClaudeResponse = (responseText: string): ClaudeAPIResponse => {
  // Try to extract JSON from response (may have markdown code blocks)
  let jsonText = responseText.trim();

  // Remove markdown code blocks if present
  if (jsonText.startsWith("```json")) {
    jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
  } else if (jsonText.startsWith("```")) {
    jsonText = jsonText.replace(/```\n?/g, "");
  }

  try {
    const parsed = JSON.parse(jsonText);
    return {
      detected: Boolean(parsed.detected),
      confidence: typeof parsed.confidence === "number" ? Math.max(0, Math.min(1, parsed.confidence)) : 0,
      evidence: Array.isArray(parsed.evidence) ? parsed.evidence.map(String) : [],
      reasoning: String(parsed.reasoning || ""),
    };
  } catch (error) {
    // Fallback: return safe default
    return {
      detected: false,
      confidence: 0,
      evidence: [],
      reasoning: `Failed to parse response: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
};

/**
 * Parse batched Claude API response
 */
export const parseBatchedClaudeResponse = (responseText: string, ruleIds: string[]): AIAnalysisResult[] => {
  const parsed = parseClaudeResponse(responseText);
  
  // If response is an array, parse each result
  let jsonText = responseText.trim();
  if (jsonText.startsWith("```json")) {
    jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
  } else if (jsonText.startsWith("```")) {
    jsonText = jsonText.replace(/```\n?/g, "");
  }

  try {
    const parsedArray = JSON.parse(jsonText);
    if (Array.isArray(parsedArray)) {
      return parsedArray.map((item, index) => ({
        ruleId: item.ruleId || ruleIds[index] || "",
        detected: Boolean(item.detected),
        confidence: typeof item.confidence === "number" ? Math.max(0, Math.min(1, item.confidence)) : 0,
        evidence: Array.isArray(item.evidence) ? item.evidence.map(String) : [],
        reasoning: String(item.reasoning || ""),
      }));
    }
  } catch {
    // Fallback: single result split across rules
  }

  // Fallback: return single result for first rule
  return [
    {
      ruleId: ruleIds[0] || "",
      ...parsed,
    },
  ];
};

/**
 * Analyze report with AI rules (with retry logic)
 */
export const analyzeReportWithAI = async (
  report: typeof endOfDayReports.$inferSelect,
  rules: Array<typeof alertRules.$inferSelect>,
  apiKey: string,
  cache?: KVNamespace,
  maxRetries: number = 3
): Promise<AIAnalysisResult[]> => {
  // Check cache first
  if (cache) {
    const cacheKey = `ai-analysis:${report.id}`;
    const cached = await cache.get(cacheKey);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // Cache invalid, continue
      }
    }
  }

  // Filter to AI rules only
  const aiRules = rules.filter((r) => r.ruleType === "AI_TEXT" && r.isEnabled);
  if (aiRules.length === 0) {
    return [];
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // Build batched prompt
      const prompt = buildBatchedPrompt(report, aiRules);
      
      // Call Claude API
      const responseText = await callClaudeAPI(prompt, apiKey);
      
      // Parse response
      const results = parseBatchedClaudeResponse(responseText, aiRules.map((r) => r.id));

      // Cache results
      if (cache && results.length > 0) {
        const cacheKey = `ai-analysis:${report.id}`;
        await cache.put(cacheKey, JSON.stringify(results), { expirationTtl: 86400 }); // 24 hours
      }

      return results;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Exponential backoff
      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // Fallback: return empty results if all retries fail
  console.error("AI analysis failed after retries:", lastError);
  return aiRules.map((rule) => ({
    ruleId: rule.id,
    detected: false,
    confidence: 0,
    evidence: [],
    reasoning: `AI analysis failed: ${lastError?.message || "Unknown error"}`,
  }));
};

