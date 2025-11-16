import { Hono } from "hono";
import { getDb } from "../db";
import {
  alertRules,
  alerts,
  endOfDayReports,
  ruleTypeValues,
  severityValues,
} from "../db/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { requireAuth, requireRole, adminRoles } from "../middleware/auth";
import type { AuthEnv } from "../auth/config";

type Env = AuthEnv;

const alertRulesRouter = new Hono<{ Bindings: Env }>();

// Apply auth middleware to all routes
alertRulesRouter.use("*", requireAuth);
alertRulesRouter.use("*", requireRole(adminRoles)); // Admin only

// Get all alert rules (with filters)
alertRulesRouter.get("/", async (c) => {
  try {
    const db = getDb(c.env);
    const { ruleType, severity, isEnabled } = c.req.query();

    let query = db.select().from(alertRules).orderBy(alertRules.ruleNumber);

    const conditions = [];

    // Filter by rule type
    if (ruleType && ruleTypeValues.includes(ruleType as any)) {
      conditions.push(eq(alertRules.ruleType, ruleType as any));
    }

    // Filter by severity
    if (severity && severityValues.includes(severity as any)) {
      conditions.push(eq(alertRules.severity, severity as any));
    }

    // Filter by enabled status
    if (isEnabled === "true") {
      conditions.push(eq(alertRules.isEnabled, true));
    } else if (isEnabled === "false") {
      conditions.push(eq(alertRules.isEnabled, false));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const rules = await query.all();
    return c.json(rules);
  } catch (error) {
    console.error("Error retrieving alert rules:", error);
    return c.json({ error: "Failed to retrieve alert rules" }, 500);
  }
});

// Get rule detail
alertRulesRouter.get("/:ruleId", async (c) => {
  try {
    const db = getDb(c.env);
    const ruleId = c.req.param("ruleId");

    const rule = await db.select().from(alertRules).where(eq(alertRules.id, ruleId)).get();

    if (!rule) {
      return c.json({ error: "Alert rule not found" }, 404);
    }

    // Get alert count for this rule
    const alertCount = await db
      .select()
      .from(alerts)
      .where(eq(alerts.ruleId, ruleId))
      .all();

    return c.json({
      ...rule,
      alertCount: alertCount.length,
    });
  } catch (error) {
    console.error("Error retrieving alert rule detail:", error);
    return c.json({ error: "Failed to retrieve alert rule detail" }, 500);
  }
});

// Update rule
alertRulesRouter.put("/:ruleId", async (c) => {
  try {
    const db = getDb(c.env);
    const ruleId = c.req.param("ruleId");
    const body = await c.req.json();
    const {
      name,
      severity,
      isEnabled,
      triggerCondition,
      adjustableThresholds,
      alertTitle,
      alertDescription,
      suggestedAction,
    } = body;

    const existingRule = await db.select().from(alertRules).where(eq(alertRules.id, ruleId)).get();
    if (!existingRule) {
      return c.json({ error: "Alert rule not found" }, 404);
    }

    // Validate enums
    if (severity && !severityValues.includes(severity)) {
      return c.json({ error: `Invalid severity. Must be one of: ${severityValues.join(", ")}` }, 400);
    }

    const updateData: any = {
      updatedAt: Math.floor(Date.now() / 1000),
    };

    if (name !== undefined) updateData.name = name;
    if (severity !== undefined) updateData.severity = severity;
    if (typeof isEnabled === "boolean") updateData.isEnabled = isEnabled;
    if (triggerCondition !== undefined) updateData.triggerCondition = typeof triggerCondition === "string" ? triggerCondition : JSON.stringify(triggerCondition);
    if (adjustableThresholds !== undefined) updateData.adjustableThresholds = typeof adjustableThresholds === "string" ? adjustableThresholds : JSON.stringify(adjustableThresholds);
    if (alertTitle !== undefined) updateData.alertTitle = alertTitle;
    if (alertDescription !== undefined) updateData.alertDescription = alertDescription;
    if (suggestedAction !== undefined) updateData.suggestedAction = suggestedAction;

    await db.update(alertRules).set(updateData).where(eq(alertRules.id, ruleId)).run();

    const updatedRule = await db.select().from(alertRules).where(eq(alertRules.id, ruleId)).get();

    return c.json({ message: "Alert rule updated successfully", rule: updatedRule });
  } catch (error) {
    console.error("Error updating alert rule:", error);
    return c.json({ error: "Failed to update alert rule" }, 500);
  }
});

// Test rule against historical reports
alertRulesRouter.post("/:ruleId/test", async (c) => {
  try {
    const db = getDb(c.env);
    const ruleId = c.req.param("ruleId");
    const body = await c.req.json();
    const { startDate, endDate } = body;

    const rule = await db.select().from(alertRules).where(eq(alertRules.id, ruleId)).get();
    if (!rule) {
      return c.json({ error: "Alert rule not found" }, 404);
    }

    // Get reports in date range (or all if no range specified)
    const now = Math.floor(Date.now() / 1000);
    const defaultStartDate = startDate || now - 30 * 24 * 60 * 60; // Last 30 days
    const defaultEndDate = endDate || now;

    const reports = await db
      .select()
      .from(endOfDayReports)
      .where(and(gte(endOfDayReports.reportDate, defaultStartDate), lte(endOfDayReports.reportDate, defaultEndDate)))
      .all();

    // Test rule against each report (simplified - would need full rule evaluation)
    // For now, return basic test results
    const testResults = {
      ruleId,
      ruleName: rule.name,
      dateRange: {
        startDate: defaultStartDate,
        endDate: defaultEndDate,
      },
      totalReports: reports.length,
      message: "Rule testing functionality - full implementation requires rule evaluation engine integration",
    };

    return c.json(testResults);
  } catch (error) {
    console.error("Error testing alert rule:", error);
    return c.json({ error: "Failed to test alert rule" }, 500);
  }
});

// Reset rule to defaults
alertRulesRouter.post("/:ruleId/reset", async (c) => {
  try {
    const db = getDb(c.env);
    const ruleId = c.req.param("ruleId");

    const existingRule = await db.select().from(alertRules).where(eq(alertRules.id, ruleId)).get();
    if (!existingRule) {
      return c.json({ error: "Alert rule not found" }, 404);
    }

    // Reset to default thresholds if available
    const updateData: any = {
      updatedAt: Math.floor(Date.now() / 1000),
    };

    if (existingRule.defaultThresholds) {
      updateData.adjustableThresholds = existingRule.defaultThresholds;
    }

    await db.update(alertRules).set(updateData).where(eq(alertRules.id, ruleId)).run();

    const resetRule = await db.select().from(alertRules).where(eq(alertRules.id, ruleId)).get();

    return c.json({ message: "Alert rule reset to defaults successfully", rule: resetRule });
  } catch (error) {
    console.error("Error resetting alert rule:", error);
    return c.json({ error: "Failed to reset alert rule" }, 500);
  }
});

export default alertRulesRouter;

