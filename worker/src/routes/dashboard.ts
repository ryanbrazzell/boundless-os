import { Hono } from "hono";
import { getDb } from "../db";
import {
  users,
  eas,
  coachingNotes,
  companyAnnouncements,
  startOfDayLogs,
  pairings,
  alerts,
  clients,
  endOfDayReports,
  ptoRecords,
  healthStatusValues,
} from "../db/schema";
import { eq, and, desc, isNull, isNotNull, gte, lte, sql } from "drizzle-orm";
import { requireAuth, requireRole, adminRoles } from "../middleware/auth";
import type { AuthEnv } from "../auth/config";

type Env = AuthEnv;

const dashboardRouter = new Hono<{ Bindings: Env }>();

// Apply auth middleware to all routes
dashboardRouter.use("*", requireAuth);

// EA Status endpoint (EA role only, own data)
dashboardRouter.get("/ea/status", async (c) => {
  try {
    const userId = c.get("userId") as string | undefined;
    const userRole = c.get("userRole") as string | undefined;

    if (userRole !== "EA") {
      return c.json({ error: "Forbidden: EA role required" }, 403);
    }

    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const db = getDb(c.env);

    // Get EA record
    const ea = await db.select().from(eas).where(eq(eas.id, userId)).get();
    if (!ea) {
      return c.json({ error: "EA not found" }, 404);
    }

    // Get user record
    const user = await db.select().from(users).where(eq(users.id, userId)).get();

    // Get today's start of day log
    const now = Math.floor(Date.now() / 1000);
    const todayStart = Math.floor(new Date().setHours(0, 0, 0, 0) / 1000);
    const todayEnd = todayStart + 86400;

    const todayLog = await db
      .select()
      .from(startOfDayLogs)
      .where(and(eq(startOfDayLogs.eaId, userId), gte(startOfDayLogs.logDate, todayStart), lte(startOfDayLogs.logDate, todayEnd)))
      .orderBy(desc(startOfDayLogs.loggedAt))
      .get();

    // Calculate on-time status
    let onTimeStatus: "on-time" | "late" | "not-logged" = "not-logged";
    if (todayLog) {
      if (todayLog.wasLate) {
        onTimeStatus = "late";
      } else {
        onTimeStatus = "on-time";
      }
    }

    return c.json({
      onTimeStatus,
      healthcareEligibilityDate: ea.healthcareEligibilityDate,
      lastStartOfDayLog: todayLog || null,
      expectedShowUpTime: ea.expectedShowUpTime,
      timezone: ea.timezone,
    });
  } catch (error) {
    console.error("Error retrieving EA status:", error);
    return c.json({ error: "Failed to retrieve EA status" }, 500);
  }
});

// EA Coaching Notes endpoint (EA role only)
dashboardRouter.get("/ea/coaching-notes", async (c) => {
  try {
    const userId = c.get("userId") as string | undefined;
    const userRole = c.get("userRole") as string | undefined;

    if (userRole !== "EA") {
      return c.json({ error: "Forbidden: EA role required" }, 403);
    }

    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const db = getDb(c.env);

    // Get EA-level coaching note
    const note = await db
      .select()
      .from(coachingNotes)
      .where(and(eq(coachingNotes.eaId, userId), eq(coachingNotes.noteType, "EA_LEVEL")))
      .get();

    return c.json({ coachingNote: note || null });
  } catch (error) {
    console.error("Error retrieving coaching notes:", error);
    return c.json({ error: "Failed to retrieve coaching notes" }, 500);
  }
});

// Announcements endpoint (all authenticated users)
dashboardRouter.get("/announcements", async (c) => {
  try {
    const db = getDb(c.env);
    const now = Math.floor(Date.now() / 1000);

    // Get active, non-expired announcements
    const activeAnnouncements = await db
      .select()
      .from(companyAnnouncements)
      .where(
        and(
          eq(companyAnnouncements.isActive, true),
          sql`(${companyAnnouncements.expiresAt} IS NULL OR ${companyAnnouncements.expiresAt} > ${now})`
        )
      )
      .orderBy(desc(companyAnnouncements.createdAt))
      .all();

    return c.json({ announcements: activeAnnouncements });
  } catch (error) {
    console.error("Error retrieving announcements:", error);
    return c.json({ error: "Failed to retrieve announcements" }, 500);
  }
});

// Clients Dashboard endpoint (Admin only)
dashboardRouter.get("/clients", requireRole(["SUPER_ADMIN", "HEAD_CLIENT_SUCCESS"]), async (c) => {
  try {
    const db = getDb(c.env);
    const { healthStatus, hasAlerts } = c.req.query();

    // Get all clients with aggregated data
    const clients = await db.select().from(clients).all();

    const clientsWithMetrics = await Promise.all(
      clients.map(async (client) => {
        // Get pairings for this client
        const clientPairings = await db.select().from(pairings).where(eq(pairings.clientId, client.id)).all();

        // Calculate health status (worst pairing health)
        let worstHealth: "GREEN" | "YELLOW" | "RED" = "GREEN";
        let activeAlertsCount = 0;
        let lastReportDate: number | null = null;

        for (const pairing of clientPairings) {
          // Get health status
          if (pairing.healthStatus === "RED") {
            worstHealth = "RED";
          } else if (pairing.healthStatus === "YELLOW" && worstHealth !== "RED") {
            worstHealth = "YELLOW";
          }

          // Count active alerts
          const pairingAlerts = await db
            .select()
            .from(alerts)
            .where(and(eq(alerts.pairingId, pairing.id), eq(alerts.status, "NEW")))
            .all();
          activeAlertsCount += pairingAlerts.length;

          // Get last report date
          const lastReport = await db
            .select()
            .from(endOfDayReports)
            .where(eq(endOfDayReports.pairingId, pairing.id))
            .orderBy(desc(endOfDayReports.reportDate))
            .get();

          if (lastReport && (!lastReportDate || lastReport.reportDate > lastReportDate)) {
            lastReportDate = lastReport.reportDate;
          }
        }

        return {
          clientId: client.id,
          name: client.name,
          healthStatus: worstHealth,
          activeAlertsCount,
          pairingsCount: clientPairings.length,
          lastReportDate,
        };
      })
    );

    // Apply filters
    let filtered = clientsWithMetrics;
    if (healthStatus) {
      filtered = filtered.filter((c) => c.healthStatus === healthStatus);
    }
    if (hasAlerts === "true") {
      filtered = filtered.filter((c) => c.activeAlertsCount > 0);
    }

    return c.json({ clients: filtered });
  } catch (error) {
    console.error("Error retrieving clients dashboard:", error);
    return c.json({ error: "Failed to retrieve clients dashboard" }, 500);
  }
});

// Client detail endpoint
dashboardRouter.get("/clients/:clientId", requireRole(["SUPER_ADMIN", "HEAD_CLIENT_SUCCESS"]), async (c) => {
  try {
    const clientId = c.req.param("clientId");
    const db = getDb(c.env);

    const client = await db.select().from(clients).where(eq(clients.id, clientId)).get();
    if (!client) {
      return c.json({ error: "Client not found" }, 404);
    }

    // Get all pairings for this client
    const clientPairings = await db.select().from(pairings).where(eq(pairings.clientId, clientId)).all();

    const pairingsWithDetails = await Promise.all(
      clientPairings.map(async (pairing) => {
        const ea = await db.select().from(users).where(eq(users.id, pairing.eaId)).get();
        const pairingAlerts = await db
          .select()
          .from(alerts)
          .where(and(eq(alerts.pairingId, pairing.id), eq(alerts.status, "NEW")))
          .all();

        return {
          ...pairing,
          eaName: ea?.name || null,
          activeAlertsCount: pairingAlerts.length,
        };
      })
    );

    return c.json({
      client,
      pairings: pairingsWithDetails,
    });
  } catch (error) {
    console.error("Error retrieving client detail:", error);
    return c.json({ error: "Failed to retrieve client detail" }, 500);
  }
});

// Assistants Dashboard endpoint (Head of EAs, SUPER_ADMIN only)
dashboardRouter.get("/assistants", requireRole(["SUPER_ADMIN", "HEAD_EAS"]), async (c) => {
  try {
    const db = getDb(c.env);
    const now = Math.floor(Date.now() / 1000);
    const sevenDaysAgo = now - 7 * 24 * 60 * 60;
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60;

    // Get all EA users
    const eas = await db.select().from(users).where(eq(users.role, "EA")).all();

    const easWithMetrics = await Promise.all(
      eas.map(async (ea) => {
        // Get recent alerts (last 7 days)
        const eaPairings = await db.select().from(pairings).where(eq(pairings.eaId, ea.id)).all();
        const pairingIds = eaPairings.map((p) => p.id);
        let recentAlertsCount = 0;
        if (pairingIds.length > 0) {
          // Query alerts for each pairing (simpler approach for SQLite)
          const allAlerts = await Promise.all(
            pairingIds.map((pairingId) =>
              db
                .select()
                .from(alerts)
                .where(and(eq(alerts.pairingId, pairingId), gte(alerts.detectedAt, sevenDaysAgo)))
                .all()
            )
          );
          recentAlertsCount = allAlerts.flat().length;
        }

        // Calculate attendance (last 30 days)
        const attendanceLogs = await db
          .select()
          .from(startOfDayLogs)
          .where(and(eq(startOfDayLogs.eaId, ea.id), gte(startOfDayLogs.logDate, thirtyDaysAgo)))
          .all();

        // Check for active PTO
        const activePTO = await db
          .select()
          .from(ptoRecords)
          .where(and(eq(ptoRecords.eaId, ea.id), lte(ptoRecords.startDate, now), gte(ptoRecords.endDate, now)))
          .get();

        let attendanceStatus: "On-time" | "Late" | "OOO" = "On-time";
        if (activePTO) {
          attendanceStatus = "OOO";
        } else {
          const lateCount = attendanceLogs.filter((log) => log.wasLate).length;
          if (lateCount > 0) {
            attendanceStatus = `Late (${lateCount} times)` as any;
          }
        }

        // Calculate report submission rate (last 30 days)
        const expectedReports = 22; // Approximate business days in 30 days
        const actualReports = await db
          .select()
          .from(endOfDayReports)
          .where(and(eq(endOfDayReports.eaId, ea.id), gte(endOfDayReports.reportDate, thirtyDaysAgo)))
          .all();

        const reportSubmissionRate = expectedReports > 0 ? Math.round((actualReports.length / expectedReports) * 100) : 0;

        // Health indicator (based on active alerts)
        let healthIndicator: "good" | "warning" | "critical" = "good";
        if (recentAlertsCount >= 5) {
          healthIndicator = "critical";
        } else if (recentAlertsCount >= 2) {
          healthIndicator = "warning";
        }

        return {
          eaId: ea.id,
          name: ea.name,
          recentAlertsCount,
          attendanceStatus,
          reportSubmissionRate,
          healthIndicator,
        };
      })
    );

    return c.json({ assistants: easWithMetrics });
  } catch (error) {
    console.error("Error retrieving assistants dashboard:", error);
    return c.json({ error: "Failed to retrieve assistants dashboard" }, 500);
  }
});

// EA Profile endpoint (Head of EAs, SUPER_ADMIN only)
dashboardRouter.get("/assistants/:eaId", requireRole(["SUPER_ADMIN", "HEAD_EAS"]), async (c) => {
  try {
    const eaId = c.req.param("eaId");
    const db = getDb(c.env);

    const ea = await db.select().from(users).where(and(eq(users.id, eaId), eq(users.role, "EA"))).get();
    if (!ea) {
      return c.json({ error: "EA not found" }, 404);
    }

    const eaRecord = await db.select().from(eas).where(eq(eas.id, eaId)).get();

    // Get pairings
    const eaPairings = await db.select().from(pairings).where(eq(pairings.eaId, eaId)).all();

    // Get attendance history (last 30 days)
    const thirtyDaysAgo = Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60;
    const attendanceHistory = await db
      .select()
      .from(startOfDayLogs)
      .where(and(eq(startOfDayLogs.eaId, eaId), gte(startOfDayLogs.logDate, thirtyDaysAgo)))
      .orderBy(desc(startOfDayLogs.logDate))
      .all();

    // Get report submission history (last 30 days)
    const reportHistory = await db
      .select()
      .from(endOfDayReports)
      .where(and(eq(endOfDayReports.eaId, eaId), gte(endOfDayReports.reportDate, thirtyDaysAgo)))
      .orderBy(desc(endOfDayReports.reportDate))
      .all();

    // Get recent alerts
    const pairingIds = eaPairings.map((p) => p.id);
    let recentAlerts: any[] = [];
    if (pairingIds.length > 0) {
      // Query alerts for each pairing and combine
      const allAlerts = await Promise.all(
        pairingIds.map((pairingId) =>
          db
            .select()
            .from(alerts)
            .where(eq(alerts.pairingId, pairingId))
            .orderBy(desc(alerts.detectedAt))
            .all()
        )
      );
      recentAlerts = allAlerts
        .flat()
        .sort((a, b) => b.detectedAt - a.detectedAt)
        .slice(0, 10);
    }

    // Get coaching notes
    const coachingNotesList = await db
      .select()
      .from(coachingNotes)
      .where(eq(coachingNotes.eaId, eaId))
      .all();

    // Get PTO records
    const ptoRecordsList = await db.select().from(ptoRecords).where(eq(ptoRecords.eaId, eaId)).all();

    return c.json({
      ea: { ...ea, ...eaRecord },
      pairings: eaPairings,
      attendanceHistory,
      reportHistory,
      recentAlerts,
      coachingNotes: coachingNotesList,
      ptoRecords: ptoRecordsList,
    });
  } catch (error) {
    console.error("Error retrieving EA profile:", error);
    return c.json({ error: "Failed to retrieve EA profile" }, 500);
  }
});

// Pairings Dashboard endpoint (Admin only)
dashboardRouter.get("/pairings", requireRole(["SUPER_ADMIN", "HEAD_CLIENT_SUCCESS", "HEAD_EAS"]), async (c) => {
  try {
    const db = getDb(c.env);
    const { healthStatus, eaId, clientId, acceleratorStatus, hasAlerts } = c.req.query();

    // Get all pairings
    let query = db.select().from(pairings);

    // Apply filters
    if (eaId) {
      query = query.where(eq(pairings.eaId, eaId)) as any;
    }
    if (clientId) {
      query = query.where(eq(pairings.clientId, clientId)) as any;
    }
    if (healthStatus) {
      query = query.where(eq(pairings.healthStatus, healthStatus as any)) as any;
    }
    if (acceleratorStatus === "enabled") {
      query = query.where(eq(pairings.acceleratorEnabled, true)) as any;
    } else if (acceleratorStatus === "disabled") {
      query = query.where(eq(pairings.acceleratorEnabled, false)) as any;
    }

    const allPairings = await query.all();

    const pairingsWithDetails = await Promise.all(
      allPairings.map(async (pairing) => {
        const ea = await db.select().from(users).where(eq(users.id, pairing.eaId)).get();
        const client = await db.select().from(clients).where(eq(clients.id, pairing.clientId)).get();

        // Get last report date
        const lastReport = await db
          .select()
          .from(endOfDayReports)
          .where(eq(endOfDayReports.pairingId, pairing.id))
          .orderBy(desc(endOfDayReports.reportDate))
          .get();

        // Get active alerts count
        const activeAlerts = await db
          .select()
          .from(alerts)
          .where(and(eq(alerts.pairingId, pairing.id), eq(alerts.status, "NEW")))
          .all();

        return {
          pairingId: pairing.id,
          eaName: ea?.name || null,
          clientName: client?.name || null,
          healthStatus: pairing.healthStatus,
          healthStatusOverride: pairing.healthStatusOverride,
          lastReportDate: lastReport?.reportDate || null,
          acceleratorStatus: pairing.acceleratorEnabled ? (pairing.acceleratorWeek ? `Week ${pairing.acceleratorWeek}` : "Complete") : "Disabled",
          activeAlertsCount: activeAlerts.length,
        };
      })
    );

    // Apply hasAlerts filter
    let filtered = pairingsWithDetails;
    if (hasAlerts === "true") {
      filtered = filtered.filter((p) => p.activeAlertsCount > 0);
    }

    return c.json({ pairings: filtered });
  } catch (error) {
    console.error("Error retrieving pairings dashboard:", error);
    return c.json({ error: "Failed to retrieve pairings dashboard" }, 500);
  }
});

// Pairing detail endpoint
dashboardRouter.get("/pairings/:pairingId", requireRole(["SUPER_ADMIN", "HEAD_CLIENT_SUCCESS", "HEAD_EAS"]), async (c) => {
  try {
    const pairingId = c.req.param("pairingId");
    const db = getDb(c.env);

    const pairing = await db.select().from(pairings).where(eq(pairings.id, pairingId)).get();
    if (!pairing) {
      return c.json({ error: "Pairing not found" }, 404);
    }

    const ea = await db.select().from(users).where(eq(users.id, pairing.eaId)).get();
    const client = await db.select().from(clients).where(eq(clients.id, pairing.clientId)).get();

    // Get recent reports
    const recentReports = await db
      .select()
      .from(endOfDayReports)
      .where(eq(endOfDayReports.pairingId, pairingId))
      .orderBy(desc(endOfDayReports.reportDate))
      .limit(10)
      .all();

    // Get active alerts
    const activeAlerts = await db
      .select()
      .from(alerts)
      .where(and(eq(alerts.pairingId, pairingId), eq(alerts.status, "NEW")))
      .orderBy(desc(alerts.detectedAt))
      .all();

    // Get coaching notes for this pairing
    const coachingNotesList = await db
      .select()
      .from(coachingNotes)
      .where(and(eq(coachingNotes.pairingId, pairingId), eq(coachingNotes.noteType, "PAIRING_LEVEL")))
      .all();

    return c.json({
      pairing: {
        ...pairing,
        eaName: ea?.name || null,
        clientName: client?.name || null,
      },
      recentReports,
      activeAlerts,
      coachingNotes: coachingNotesList,
    });
  } catch (error) {
    console.error("Error retrieving pairing detail:", error);
    return c.json({ error: "Failed to retrieve pairing detail" }, 500);
  }
});

// Health status override endpoint
dashboardRouter.patch("/pairings/:pairingId/health-status", requireRole(["SUPER_ADMIN", "HEAD_CLIENT_SUCCESS", "HEAD_EAS"]), async (c) => {
  try {
    const pairingId = c.req.param("pairingId");
    const body = await c.req.json();
    const { healthStatusOverride, manualHealthStatus } = body;

    const db = getDb(c.env);

    const existingPairing = await db.select().from(pairings).where(eq(pairings.id, pairingId)).get();
    if (!existingPairing) {
      return c.json({ error: "Pairing not found" }, 404);
    }

    const updateData: any = {
      updatedAt: Math.floor(Date.now() / 1000),
    };

    if (typeof healthStatusOverride === "boolean") {
      updateData.healthStatusOverride = healthStatusOverride;
    }

    if (manualHealthStatus && healthStatusValues.includes(manualHealthStatus as any)) {
      updateData.healthStatus = manualHealthStatus;
    } else if (healthStatusOverride === false) {
      // Clear manual override - health will be calculated automatically
      updateData.healthStatus = null; // Will be recalculated
    }

    await db.update(pairings).set(updateData).where(eq(pairings.id, pairingId)).run();

    const updatedPairing = await db.select().from(pairings).where(eq(pairings.id, pairingId)).get();

    return c.json({ message: "Health status updated successfully", pairing: updatedPairing });
  } catch (error) {
    console.error("Error updating health status:", error);
    return c.json({ error: "Failed to update health status" }, 500);
  }
});

export default dashboardRouter;

