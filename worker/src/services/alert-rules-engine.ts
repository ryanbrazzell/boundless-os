import { getDb } from "../db";
import { alertRules, alerts, endOfDayReports, patternState, ruleTypeEnum, severityEnum } from "../db/schema";
import { eq, and, gte, lte, ne, desc } from "drizzle-orm";
import { checkActivePTO } from "./pto-check";

export interface RuleEvaluationResult {
  ruleId: string;
  ruleName: string;
  fired: boolean;
  severity?: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  evidence?: {
    confidence?: number;
    reasoning?: string;
    quotes?: string[];
    occurrences?: number;
  };
}

export interface TriggerCondition {
  field: string;
  operator: "equals" | "not_equals" | "contains" | "empty" | "word_count_lt";
  value?: string | number;
  patternType?: "immediate" | "pattern_over_time";
  patternWindow?: number; // days
  patternThreshold?: number; // occurrences
}

/**
 * Evaluate all enabled rules against a submitted report
 */
export const evaluateRulesForReport = async (
  db: ReturnType<typeof getDb>,
  reportId: string,
  pairingId: string,
  env?: { CLAUDE_API_KEY?: string; KV?: KVNamespace }
): Promise<RuleEvaluationResult[]> => {
  // Get the report
  const report = await db
    .select()
    .from(endOfDayReports)
    .where(eq(endOfDayReports.id, reportId))
    .get();

  if (!report) {
    throw new Error("Report not found");
  }

  // Get all enabled rules
  const enabledRules = await db
    .select()
    .from(alertRules)
    .where(eq(alertRules.isEnabled, true))
    .all();

  const results: RuleEvaluationResult[] = [];

  // Check if EA has active PTO (suppress attendance-related alerts)
  const activePTO = await checkActivePTO(db, report.eaId, report.reportDate);
  const isOOO = activePTO !== null;

  // Process logic rules first
  const logicRules = enabledRules.filter((r) => r.ruleType === "LOGIC");
  for (const rule of logicRules) {
    const result = await evaluateLogicRule(db, rule, report, pairingId);
    results.push(result);

    // Create alert if rule fired, but suppress if EA is OOO and rule is attendance-related
    if (result.fired) {
      // Suppress alerts for missing reports or late arrivals if EA is OOO
      const isAttendanceRule = rule.ruleNumber === 1 || rule.name.toLowerCase().includes("report") || rule.name.toLowerCase().includes("late");
      if (isAttendanceRule && isOOO) {
        // Suppress alert - EA is out of office
        continue;
      }
      await createAlertIfNotExists(db, pairingId, rule.id, rule.severity, result.evidence);
    }
  }

  // Process AI rules
  const aiRules = enabledRules.filter((r) => r.ruleType === "AI_TEXT");
  if (aiRules.length > 0) {
    try {
      // Import AI analysis service (dynamic import to avoid circular dependencies)
      const { analyzeReportWithAI } = await import("./ai-analysis");
      
      // Get API key from environment
      const apiKey = env?.CLAUDE_API_KEY || "";
      if (apiKey) {
        try {
          const aiResults = await analyzeReportWithAI(report, aiRules, apiKey, env?.KV);
          
          for (const aiResult of aiResults) {
            const rule = aiRules.find((r) => r.id === aiResult.ruleId);
            if (!rule) continue;
            
            // Check confidence threshold (default 0.7)
            let threshold = 0.7;
            try {
              if (rule.adjustableThresholds) {
                const thresholds = JSON.parse(rule.adjustableThresholds);
                threshold = thresholds.confidenceThreshold || 0.7;
              }
            } catch {
              // Use default threshold
            }
            
            if (aiResult.detected && aiResult.confidence >= threshold) {
              results.push({
                ruleId: rule.id,
                ruleName: rule.name,
                fired: true,
                severity: rule.severity,
                evidence: {
                  confidence: aiResult.confidence,
                  reasoning: aiResult.reasoning,
                  quotes: aiResult.evidence,
                },
              });
              
              // Create alert
              await createAlertIfNotExists(db, pairingId, rule.id, rule.severity, {
                confidence: aiResult.confidence,
                reasoning: aiResult.reasoning,
                quotes: aiResult.evidence,
              });
            } else {
              results.push({
                ruleId: rule.id,
                ruleName: rule.name,
                fired: false,
              });
            }
          }
        } catch (aiError) {
          console.error("Error in AI analysis:", aiError);
          // Continue without AI results - don't block alert creation
        }
      }
    } catch (importError) {
      console.error("Error loading AI analysis service:", importError);
      // Continue without AI results
    }
  }

  return results;
};

/**
 * Evaluate a single logic rule against a report
 */
const evaluateLogicRule = async (
  db: ReturnType<typeof getDb>,
  rule: typeof alertRules.$inferSelect,
  report: typeof endOfDayReports.$inferSelect,
  pairingId: string
): Promise<RuleEvaluationResult> => {
  // Parse trigger condition from JSON
  const triggerCondition: TriggerCondition = rule.triggerCondition
    ? JSON.parse(rule.triggerCondition)
    : null;

  if (!triggerCondition) {
    return {
      ruleId: rule.id,
      ruleName: rule.name,
      fired: false,
    };
  }

  // Handle immediate triggers
  if (triggerCondition.patternType === "immediate" || !triggerCondition.patternType) {
    const fired = evaluateImmediateTrigger(report, triggerCondition);
    return {
      ruleId: rule.id,
      ruleName: rule.name,
      fired,
      severity: rule.severity,
      evidence: fired
        ? {
            reasoning: `Rule fired: ${rule.alertDescription}`,
            quotes: [getFieldValue(report, triggerCondition.field)],
          }
        : undefined,
    };
  }

  // Handle pattern-over-time detection
  if (triggerCondition.patternType === "pattern_over_time") {
    const patternResult = await evaluatePatternOverTime(
      db,
      rule,
      pairingId,
      report,
      triggerCondition
    );
    return {
      ruleId: rule.id,
      ruleName: rule.name,
      fired: patternResult.fired,
      severity: rule.severity,
      evidence: patternResult.evidence,
    };
  }

  return {
    ruleId: rule.id,
    ruleName: rule.name,
    fired: false,
  };
};

/**
 * Evaluate immediate trigger condition
 */
const evaluateImmediateTrigger = (
  report: typeof endOfDayReports.$inferSelect,
  condition: TriggerCondition
): boolean => {
  const fieldValue = getFieldValue(report, condition.field);

  switch (condition.operator) {
    case "equals":
      return String(fieldValue) === String(condition.value);
    case "not_equals":
      return String(fieldValue) !== String(condition.value);
    case "contains":
      return String(fieldValue).toLowerCase().includes(String(condition.value).toLowerCase());
    case "empty":
      return !fieldValue || String(fieldValue).trim().length === 0;
    case "word_count_lt":
      const wordCount = String(fieldValue || "").split(/\s+/).filter((w) => w.length > 0).length;
      return wordCount < (condition.value as number);
    default:
      return false;
  }
};

/**
 * Evaluate pattern-over-time detection
 */
const evaluatePatternOverTime = async (
  db: ReturnType<typeof getDb>,
  rule: typeof alertRules.$inferSelect,
  pairingId: string,
  currentReport: typeof endOfDayReports.$inferSelect,
  condition: TriggerCondition
): Promise<{ fired: boolean; evidence?: RuleEvaluationResult["evidence"] }> => {
  const windowDays = condition.patternWindow || 7;
  const threshold = condition.patternThreshold || 3;

  // Calculate window boundaries
  const windowEnd = currentReport.reportDate;
  const windowStart = windowEnd - windowDays * 24 * 60 * 60;

  // Get or create pattern state
  let pattern = await db
    .select()
    .from(patternState)
    .where(and(eq(patternState.pairingId, pairingId), eq(patternState.ruleId, rule.id)))
    .get();

  // Reset pattern if window expired
  if (pattern && pattern.windowEnd < windowStart) {
    await db.delete(patternState).where(eq(patternState.id, pattern.id));
    pattern = null;
  }

  // Check if current report matches pattern condition
  const matchesPattern = evaluateImmediateTrigger(currentReport, condition);

  if (!matchesPattern) {
    return { fired: false };
  }

  // Get recent reports within window
  const recentReports = await db
    .select()
    .from(endOfDayReports)
    .where(
      and(
        eq(endOfDayReports.pairingId, pairingId),
        gte(endOfDayReports.reportDate, windowStart),
        lte(endOfDayReports.reportDate, windowEnd)
      )
    )
    .orderBy(desc(endOfDayReports.reportDate))
    .all();

  // Count occurrences matching pattern
  const occurrences = recentReports.filter((r) => evaluateImmediateTrigger(r, condition)).length;

  // Update or create pattern state
  if (pattern) {
    await db
      .update(patternState)
      .set({
        occurrences,
        windowEnd,
        updatedAt: Math.floor(Date.now() / 1000),
      })
      .where(eq(patternState.id, pattern.id));
  } else {
    await db.insert(patternState).values({
      pairingId,
      ruleId: rule.id,
      occurrences,
      windowStart,
      windowEnd,
      windowDays,
    });
  }

  // Fire alert if threshold met
  const fired = occurrences >= threshold;

  return {
    fired,
    evidence: fired
      ? {
          occurrences,
          reasoning: `${occurrences} occurrences in ${windowDays}-day window (threshold: ${threshold})`,
          quotes: recentReports
            .filter((r) => evaluateImmediateTrigger(r, condition))
            .slice(0, 3)
            .map((r) => getFieldValue(r, condition.field)),
        }
      : undefined,
  };
};

/**
 * Get field value from report
 */
const getFieldValue = (report: typeof endOfDayReports.$inferSelect, field: string): string => {
  const fieldMap: Record<string, string> = {
    workloadFeeling: report.workloadFeeling,
    workType: report.workType,
    feelingDuringWork: report.feelingDuringWork,
    hadDailySync: report.hadDailySync ? "true" : "false",
    biggestWin: report.biggestWin || "",
    whatCompleted: report.whatCompleted || "",
    difficulties: report.difficulties || "",
    supportNeeded: report.supportNeeded || "",
    additionalNotes: report.additionalNotes || "",
  };

  return fieldMap[field] || "";
};

/**
 * Create alert if it doesn't already exist
 */
const createAlertIfNotExists = async (
  db: ReturnType<typeof getDb>,
  pairingId: string,
  ruleId: string,
  severity: typeof severityEnum[number],
  evidence?: RuleEvaluationResult["evidence"]
): Promise<void> => {
  // Check if alert already exists (not resolved)
  const existingAlert = await db
    .select()
    .from(alerts)
    .where(
      and(
        eq(alerts.pairingId, pairingId),
        eq(alerts.ruleId, ruleId),
        ne(alerts.status, "RESOLVED")
      )
    )
    .get();

  if (existingAlert) {
    // Alert already exists, skip creation
    return;
  }

  // Create new alert
  await db.insert(alerts).values({
    pairingId,
    ruleId,
    severity,
    status: "NEW",
    evidence: evidence ? JSON.stringify(evidence) : null,
  });
};

