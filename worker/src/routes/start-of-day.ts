import { Hono } from "hono";
import { getDb } from "../db";
import { startOfDayLogs, eas, pairings } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "../middleware/auth";
import { checkActivePTO } from "../services/pto-check";
import type { AuthEnv } from "../auth/config";

type Env = AuthEnv;

const startOfDayRouter = new Hono<{ Bindings: Env }>();

// Apply auth middleware
startOfDayRouter.use("*", requireAuth);

// Helper function to parse time string (HH:MM) to minutes since midnight
const timeToMinutes = (timeStr: string | null): number | null => {
  if (!timeStr) return null;
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

// Helper function to get minutes since midnight for a timestamp
const timestampToMinutes = (timestamp: number, timezone?: string): number => {
  const date = new Date(timestamp * 1000);
  // For now, use local time. In production, use timezone parameter
  return date.getHours() * 60 + date.getMinutes();
};


// Create start of day log
startOfDayRouter.post("/log", async (c) => {
  try {
    const body = await c.req.json();
    const { eaId, loggedAt } = body;

    if (!eaId) {
      return c.json({ error: "Missing required field: eaId" }, 400);
    }

    const db = getDb(c.env);

    // Get EA record
    const ea = await db.select().from(eas).where(eq(eas.id, eaId)).get();
    if (!ea) {
      return c.json({ error: "EA not found" }, 404);
    }

    // Validate EA has expectedShowUpTime set (optional but recommended)
    // We'll still allow logging without it, but can't detect lateness

    // Calculate logDate (today's date as timestamp at midnight)
    const now = loggedAt ? new Date(loggedAt * 1000) : new Date();
    const logDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const logDateTimestamp = Math.floor(logDate.getTime() / 1000);

    // Check for duplicate log (eaId, logDate) unique constraint
    const existingLog = await db
      .select()
      .from(startOfDayLogs)
      .where(
        and(
          eq(startOfDayLogs.eaId, eaId),
          eq(startOfDayLogs.logDate, logDateTimestamp)
        )
      )
      .get();

    if (existingLog) {
      return c.json(
        {
          error: "Start of day already logged for this date",
          logId: existingLog.id,
          wasLate: existingLog.wasLate,
          minutesLate: existingLog.minutesLate,
        },
        409
      );
    }

    // Get loggedAt timestamp (default to now)
    const loggedAtTimestamp = loggedAt || Math.floor(Date.now() / 1000);

    // Calculate late detection
    let wasLate = false;
    let minutesLate: number | null = null;

    if (ea.expectedShowUpTime) {
      const expectedMinutes = timeToMinutes(ea.expectedShowUpTime);
      const loggedMinutes = timestampToMinutes(loggedAtTimestamp, ea.timezone || undefined);

      if (expectedMinutes !== null) {
        const difference = loggedMinutes - expectedMinutes;
        if (difference > 30) {
          wasLate = true;
          minutesLate = difference;
        }
      }
    }

    // Check for active PTO
    const activePTO = await checkActivePTO(db, eaId, logDateTimestamp);
    const isOOO = activePTO !== null;

    // Create StartOfDayLogs record
    const [newLog] = await db
      .insert(startOfDayLogs)
      .values({
        eaId,
        logDate: logDateTimestamp,
        loggedAt: loggedAtTimestamp,
        expectedShowUpTime: ea.expectedShowUpTime || null,
        wasLate,
        minutesLate,
      })
      .returning();

    // Note: Late alerts are handled by the Alert Rules Engine when reports are submitted
    // Start of Day logging tracks attendance but doesn't create alerts directly
    // Alerts are created based on report patterns and attendance data
    // The isOOO flag is stored in the log for reference

    return c.json({
      success: true,
      logId: newLog.id,
      wasLate,
      minutesLate,
      isOOO,
    });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

export default startOfDayRouter;

