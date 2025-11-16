import { Hono } from "hono";
import { getDb } from "../db";
import {
  alerts,
  alertRules,
  pairings,
  users,
  clients,
  endOfDayReports,
  alertStatusValues,
  severityValues,
} from "../db/schema";
import { eq, and, gte, lte, desc, or, isNull, isNotNull, sql } from "drizzle-orm";
import { requireAuth, requireRole, adminRoles } from "../middleware/auth";
import type { AuthEnv } from "../auth/config";

type Env = AuthEnv;

const alertsRouter = new Hono<{ Bindings: Env }>();

// Apply auth middleware to all routes
alertsRouter.use("*", requireAuth);
alertsRouter.use("*", requireRole(adminRoles)); // Admin only

// Get all alerts (with filters)
alertsRouter.get("/", async (c) => {
  try {
    const db = getDb(c.env);
    const { severity, pairingId, startDate, endDate, assignedTo, status } = c.req.query();

    // Query alerts with joins - use separate queries to avoid complex join issues
    const allAlerts = await db
      .select()
      .from(alerts)
      .orderBy(desc(alerts.detectedAt))
      .all();

    // Enrich with related data
    const enrichedAlerts = await Promise.all(
      allAlerts.map(async (alert) => {
        const rule = await db.select().from(alertRules).where(eq(alertRules.id, alert.ruleId)).get();
        const pairing = await db.select().from(pairings).where(eq(pairings.id, alert.pairingId)).get();
        const ea = pairing ? await db.select().from(users).where(eq(users.id, pairing.eaId)).get() : null;
        const client = pairing ? await db.select().from(clients).where(eq(clients.id, pairing.clientId)).get() : null;
        const assignedToUser = alert.assignedTo
          ? await db.select().from(users).where(eq(users.id, alert.assignedTo)).get()
          : null;

        return {
          id: alert.id,
          pairingId: alert.pairingId,
          ruleId: alert.ruleId,
          ruleName: rule?.name || null,
          severity: alert.severity,
          status: alert.status,
          assignedTo: alert.assignedTo,
          assignedToName: assignedToUser?.name || null,
          detectedAt: alert.detectedAt,
          resolvedAt: alert.resolvedAt,
          eaName: ea?.name || null,
          clientName: client?.name || null,
        };
      })
    );

    let filteredAlerts = enrichedAlerts;

    // Apply filters
    if (severity && severityValues.includes(severity as any)) {
      filteredAlerts = filteredAlerts.filter((a) => a.severity === severity);
    }
    if (pairingId) {
      filteredAlerts = filteredAlerts.filter((a) => a.pairingId === pairingId);
    }
    if (assignedTo === "unassigned") {
      filteredAlerts = filteredAlerts.filter((a) => a.assignedTo === null);
    } else if (assignedTo) {
      filteredAlerts = filteredAlerts.filter((a) => a.assignedTo === assignedTo);
    }
    if (status && alertStatusValues.includes(status as any)) {
      filteredAlerts = filteredAlerts.filter((a) => a.status === status);
    }
    if (startDate) {
      const startTimestamp = typeof startDate === "string" ? parseInt(startDate) : startDate;
      filteredAlerts = filteredAlerts.filter((a) => a.detectedAt >= startTimestamp);
    }
    if (endDate) {
      const endTimestamp = typeof endDate === "string" ? parseInt(endDate) : endDate;
      filteredAlerts = filteredAlerts.filter((a) => a.detectedAt <= endTimestamp);
    }

    return c.json(filteredAlerts);
  } catch (error) {
    console.error("Error retrieving alerts:", error);
    return c.json({ error: "Failed to retrieve alerts" }, 500);
  }
});

// Get alert detail
alertsRouter.get("/:alertId", async (c) => {
  try {
    const db = getDb(c.env);
    const alertId = c.req.param("alertId");

    const alertRecord = await db.select().from(alerts).where(eq(alerts.id, alertId)).get();
    if (!alertRecord) {
      return c.json({ error: "Alert not found" }, 404);
    }

    const rule = await db.select().from(alertRules).where(eq(alertRules.id, alertRecord.ruleId)).get();
    const pairing = await db.select().from(pairings).where(eq(pairings.id, alertRecord.pairingId)).get();
    
    if (!pairing) {
      return c.json({ error: "Pairing not found" }, 404);
    }

    const ea = await db.select().from(users).where(eq(users.id, pairing.eaId)).get();
    const client = await db.select().from(clients).where(eq(clients.id, pairing.clientId)).get();
    const assignedToUser = alertRecord.assignedTo
      ? await db.select().from(users).where(eq(users.id, alertRecord.assignedTo)).get()
      : null;

    // Get related reports (recent reports for this pairing)
    const relatedReports = await db
      .select()
      .from(endOfDayReports)
      .where(eq(endOfDayReports.pairingId, pairing.id))
      .orderBy(desc(endOfDayReports.reportDate))
      .limit(5)
      .all();

    return c.json({
      alert: alertRecord,
      rule,
      pairing,
      ea,
      client,
      assignedToUser,
      relatedReports,
    });
  } catch (error) {
    console.error("Error retrieving alert detail:", error);
    return c.json({ error: "Failed to retrieve alert detail" }, 500);
  }
});

// Update alert status
alertsRouter.patch("/:alertId/status", async (c) => {
  try {
    const db = getDb(c.env);
    const alertId = c.req.param("alertId");
    const body = await c.req.json();
    const { status } = body;

    if (!status || !alertStatusValues.includes(status)) {
      return c.json({ error: `Invalid status. Must be one of: ${alertStatusValues.join(", ")}` }, 400);
    }

    const existingAlert = await db.select().from(alerts).where(eq(alerts.id, alertId)).get();
    if (!existingAlert) {
      return c.json({ error: "Alert not found" }, 404);
    }

    const updateData: any = {
      status,
      updatedAt: Math.floor(Date.now() / 1000),
    };

    // Set resolvedAt when status is RESOLVED
    if (status === "RESOLVED" && !existingAlert.resolvedAt) {
      updateData.resolvedAt = Math.floor(Date.now() / 1000);
    }
    // Clear resolvedAt if status changes from RESOLVED
    if (status !== "RESOLVED" && existingAlert.resolvedAt) {
      updateData.resolvedAt = null;
    }

    await db.update(alerts).set(updateData).where(eq(alerts.id, alertId)).run();

    return c.json({ message: "Alert status updated successfully" });
  } catch (error) {
    console.error("Error updating alert status:", error);
    return c.json({ error: "Failed to update alert status" }, 500);
  }
});

// Assign alert
alertsRouter.patch("/:alertId/assign", async (c) => {
  try {
    const db = getDb(c.env);
    const alertId = c.req.param("alertId");
    const body = await c.req.json();
    const { assignedTo } = body;

    const existingAlert = await db.select().from(alerts).where(eq(alerts.id, alertId)).get();
    if (!existingAlert) {
      return c.json({ error: "Alert not found" }, 404);
    }

    // Validate assignedTo user if provided
    if (assignedTo !== null && assignedTo !== undefined) {
      const user = await db.select().from(users).where(eq(users.id, assignedTo)).get();
      if (!user) {
        return c.json({ error: "User not found" }, 404);
      }
    }

    await db
      .update(alerts)
      .set({
        assignedTo: assignedTo || null,
        updatedAt: Math.floor(Date.now() / 1000),
      })
      .where(eq(alerts.id, alertId))
      .run();

    return c.json({ message: "Alert assignment updated successfully" });
  } catch (error) {
    console.error("Error updating alert assignment:", error);
    return c.json({ error: "Failed to update alert assignment" }, 500);
  }
});

// Update alert notes
alertsRouter.patch("/:alertId/notes", async (c) => {
  try {
    const db = getDb(c.env);
    const alertId = c.req.param("alertId");
    const body = await c.req.json();
    const { notes } = body;

    const existingAlert = await db.select().from(alerts).where(eq(alerts.id, alertId)).get();
    if (!existingAlert) {
      return c.json({ error: "Alert not found" }, 404);
    }

    await db
      .update(alerts)
      .set({
        notes: notes || null,
        updatedAt: Math.floor(Date.now() / 1000),
      })
      .where(eq(alerts.id, alertId))
      .run();

    return c.json({ message: "Alert notes updated successfully" });
  } catch (error) {
    console.error("Error updating alert notes:", error);
    return c.json({ error: "Failed to update alert notes" }, 500);
  }
});

export default alertsRouter;

