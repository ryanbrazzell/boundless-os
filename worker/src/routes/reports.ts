import { Hono } from "hono";
import { getDb } from "../db";
import type { AuthEnv } from "../auth/config";
import {
  endOfDayReports,
  pairings,
  users,
  clients,
  eas,
  workloadFeelingValues,
  workTypeValues,
  feelingDuringWorkValues,
} from "../db/schema";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import { requireAuth } from "../middleware/auth";
import { evaluateRulesForReport } from "../services/alert-rules-engine";

type Env = AuthEnv;

const reportsRouter = new Hono<{ Bindings: Env }>();

// Apply auth middleware to all routes
reportsRouter.use("*", requireAuth);

// Helper function to get date at midnight in EA's timezone
const getReportDate = (eaTimezone: string | null, reportDate?: string): number => {
  const tz = eaTimezone || "UTC";
  const date = reportDate ? new Date(reportDate) : new Date();
  
  // For simplicity, use UTC date calculation
  // In production, use a timezone library like date-fns-tz
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  const midnight = new Date(Date.UTC(year, month, day));
  
  return Math.floor(midnight.getTime() / 1000);
};

// Submit report
reportsRouter.post("/submit", async (c) => {
  try {
    const body = await c.req.json();
    const {
      pairingId,
      eaId,
      reportDate,
      workloadFeeling,
      workType,
      feelingDuringWork,
      biggestWin,
      whatCompleted,
      pendingTasks,
      hadDailySync,
      difficulties,
      supportNeeded,
      additionalNotes,
    } = body;

    // Validate required fields
    if (
      !pairingId ||
      !eaId ||
      !workloadFeeling ||
      !workType ||
      !feelingDuringWork ||
      !biggestWin ||
      !whatCompleted ||
      hadDailySync === undefined
    ) {
      return c.json(
        {
          error:
            "Missing required fields: pairingId, eaId, workloadFeeling, workType, feelingDuringWork, biggestWin, whatCompleted, hadDailySync",
        },
        400
      );
    }

    // Validate UUIDs
    const { isValidUUID } = await import("../utils/validation");
    if (!isValidUUID(pairingId)) {
      return c.json({ error: "Invalid pairingId format" }, 400);
    }
    if (!isValidUUID(eaId)) {
      return c.json({ error: "Invalid eaId format" }, 400);
    }

    // Validate enum values
    if (!workloadFeelingValues.includes(workloadFeeling)) {
      return c.json({ error: "Invalid workloadFeeling value" }, 400);
    }
    if (!workTypeValues.includes(workType)) {
      return c.json({ error: "Invalid workType value" }, 400);
    }
    if (!feelingDuringWorkValues.includes(feelingDuringWork)) {
      return c.json({ error: "Invalid feelingDuringWork value" }, 400);
    }

    const db = getDb(c.env);

    // Validate pairing exists
    const pairing = await db.select().from(pairings).where(eq(pairings.id, pairingId)).get();
    if (!pairing) {
      return c.json({ error: "Invalid pairing ID" }, 400);
    }

    // Validate EA exists and get timezone
    const ea = await db.select().from(eas).where(eq(eas.id, eaId)).get();
    if (!ea) {
      return c.json({ error: "Invalid EA ID" }, 400);
    }

    // Calculate reportDate (use EA's timezone)
    const reportDateTimestamp = getReportDate(ea.timezone || null, reportDate);

    // Check for duplicate report (pairingId, reportDate) unique constraint
    const existingReport = await db
      .select()
      .from(endOfDayReports)
      .where(
        and(
          eq(endOfDayReports.pairingId, pairingId),
          eq(endOfDayReports.reportDate, reportDateTimestamp)
        )
      )
      .get();

    if (existingReport) {
      return c.json(
        {
          error: "Report already exists for this pairing on this date",
          reportId: existingReport.id,
        },
        409
      );
    }

    // Create report
    const [newReport] = await db
      .insert(endOfDayReports)
      .values({
        pairingId,
        eaId,
        reportDate: reportDateTimestamp,
        workloadFeeling,
        workType,
        feelingDuringWork,
        biggestWin,
        whatCompleted,
        pendingTasks: pendingTasks || null,
        hadDailySync,
        difficulties: difficulties || null,
        supportNeeded: supportNeeded || null,
        additionalNotes: additionalNotes || null,
      })
      .returning();

    // Trigger alert rules engine evaluation (async, don't block response)
    // Fire and forget - errors are logged but don't affect report submission
    evaluateRulesForReport(db, newReport.id, pairingId, {
      CLAUDE_API_KEY: c.env.CLAUDE_API_KEY,
      KV: c.env.KV,
    }).catch((error) => {
      console.error("Error evaluating alert rules:", error);
    });

    return c.json({ report: newReport }, 201);
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// Get report history
reportsRouter.get("/history", async (c) => {
  try {
    const eaId = c.req.query("eaId");
    const limit = parseInt(c.req.query("limit") || "30");
    const offset = parseInt(c.req.query("offset") || "0");
    const pairingId = c.req.query("pairingId");
    const startDate = c.req.query("startDate");
    const endDate = c.req.query("endDate");

    // Check authorization - EA can view own reports, Admins can view all
    const userRole = c.get("userRole") as string | undefined;
    const userId = c.get("userId") as string | undefined;
    const adminRoles = ["SUPER_ADMIN", "HEAD_CLIENT_SUCCESS", "HEAD_EAS"];

    if (!eaId) {
      return c.json({ error: "Missing required parameter: eaId" }, 400);
    }

    if (userRole === "EA" && userId !== eaId) {
      return c.json({ error: "Forbidden: EAs can only view their own reports" }, 403);
    }
    if (userRole && !adminRoles.includes(userRole) && userRole !== "EA") {
      return c.json({ error: "Forbidden: Insufficient permissions" }, 403);
    }

    // Validate UUID
    const { isValidUUID } = await import("../utils/validation");
    if (!isValidUUID(eaId)) {
      return c.json({ error: "Invalid eaId format" }, 400);
    }

    const db = getDb(c.env);

    // Build query
    let query = db
      .select({
        id: endOfDayReports.id,
        reportDate: endOfDayReports.reportDate,
        workloadFeeling: endOfDayReports.workloadFeeling,
        workType: endOfDayReports.workType,
        biggestWin: endOfDayReports.biggestWin,
        pairingId: endOfDayReports.pairingId,
        clientName: clients.name,
      })
      .from(endOfDayReports)
      .innerJoin(pairings, eq(endOfDayReports.pairingId, pairings.id))
      .innerJoin(clients, eq(pairings.clientId, clients.id))
      .where(eq(endOfDayReports.eaId, eaId));

    // Apply filters
    if (pairingId) {
      query = query.where(eq(endOfDayReports.pairingId, pairingId)) as any;
    }

    // Date range filter (last 30 days by default)
    const now = Math.floor(Date.now() / 1000);
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60;
    const dateFilter = startDate
      ? gte(endOfDayReports.reportDate, Math.floor(new Date(startDate).getTime() / 1000))
      : gte(endOfDayReports.reportDate, thirtyDaysAgo);

    query = query.where(dateFilter) as any;

    if (endDate) {
      query = query.where(lte(endOfDayReports.reportDate, Math.floor(new Date(endDate).getTime() / 1000))) as any;
    }

    // Order by date descending, limit, offset
    const reports = await query.orderBy(desc(endOfDayReports.reportDate)).limit(limit).offset(offset);

    return c.json({ reports, limit, offset });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// Get report detail
reportsRouter.get("/:reportId", async (c) => {
  try {
    const reportId = c.req.param("reportId");
    
    // Validate UUID
    const { isValidUUID } = await import("../utils/validation");
    if (!isValidUUID(reportId)) {
      return c.json({ error: "Invalid reportId format" }, 400);
    }

    const db = getDb(c.env);

    const report = await db
      .select()
      .from(endOfDayReports)
      .where(eq(endOfDayReports.id, reportId))
      .get();

    if (!report) {
      return c.json({ error: "Report not found" }, 404);
    }

    // Check authorization - EA can view own reports, Admins can view all
    const userRole = c.get("userRole") as string | undefined;
    const userId = c.get("userId") as string | undefined;
    const adminRoles = ["SUPER_ADMIN", "HEAD_CLIENT_SUCCESS", "HEAD_EAS"];

    if (userRole === "EA" && userId !== report.eaId) {
      return c.json({ error: "Forbidden: EAs can only view their own reports" }, 403);
    }
    if (userRole && !adminRoles.includes(userRole) && userRole !== "EA") {
      return c.json({ error: "Forbidden: Insufficient permissions" }, 403);
    }

    // Get pairing and client info
    const pairing = await db.select().from(pairings).where(eq(pairings.id, report.pairingId)).get();
    const client = pairing
      ? await db.select().from(clients).where(eq(clients.id, pairing.clientId)).get()
      : null;
    const ea = await db.select().from(users).where(eq(users.id, report.eaId)).get();

    return c.json({
      report,
      pairing: pairing || null,
      client: client || null,
      ea: ea ? { id: ea.id, name: ea.name, email: ea.email } : null,
    });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

export default reportsRouter;

