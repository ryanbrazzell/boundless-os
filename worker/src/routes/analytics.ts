import { Hono } from "hono";
import { getDb } from "../db";
import { requireAuth, requireRole, adminRoles } from "../middleware/auth";
import { calculateAnalyticsTrends } from "../services/analytics";
import type { AuthEnv } from "../auth/config";

type Env = AuthEnv;

const analyticsRouter = new Hono<{ Bindings: Env }>();

// Apply auth middleware to all routes
analyticsRouter.use("*", requireAuth);
analyticsRouter.use("*", requireRole(adminRoles)); // Admin only

// Get analytics trends
analyticsRouter.get("/trends", async (c) => {
  try {
    const db = getDb(c.env);
    const { eaId, clientId, pairingId, period = "30d", startDate, endDate } = c.req.query();

    // Validate period
    if (!["7d", "30d", "90d", "custom"].includes(period)) {
      return c.json({ error: "Invalid period. Must be: 7d, 30d, 90d, or custom" }, 400);
    }

    // Parse dates if provided
    let startDateTimestamp: number | undefined;
    let endDateTimestamp: number | undefined;

    if (startDate) {
      startDateTimestamp = typeof startDate === "string" ? parseInt(startDate) : startDate;
    }
    if (endDate) {
      endDateTimestamp = typeof endDate === "string" ? parseInt(endDate) : endDate;
    }

    const trends = await calculateAnalyticsTrends(db, {
      eaId: eaId || undefined,
      clientId: clientId || undefined,
      pairingId: pairingId || undefined,
      period: period as "7d" | "30d" | "90d" | "custom",
      startDate: startDateTimestamp,
      endDate: endDateTimestamp,
    });

    return c.json(trends);
  } catch (error) {
    console.error("Error calculating analytics trends:", error);
    return c.json({ error: "Failed to calculate analytics trends" }, 500);
  }
});

export default analyticsRouter;

