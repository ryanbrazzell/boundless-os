import { Hono } from "hono";
import { getDb } from "../db";
import { ptoRecords, users, ptoReasonValues } from "../db/schema";
import { eq, and, lte, gte, desc } from "drizzle-orm";
import { requireAuth, requireRole, adminRoles } from "../middleware/auth";
import type { AuthEnv } from "../auth/config";

type Env = AuthEnv;

const ptoRouter = new Hono<{ Bindings: Env }>();

// Apply auth middleware to all routes
ptoRouter.use("*", requireAuth);

// Get all PTO records (with filters)
ptoRouter.get("/", requireRole(adminRoles), async (c) => {
  try {
    const db = getDb(c.env);
    const { eaId, startDate, endDate, reason, status } = c.req.query();

    let query = db
      .select({
        id: ptoRecords.id,
        eaId: ptoRecords.eaId,
        eaName: users.name,
        startDate: ptoRecords.startDate,
        endDate: ptoRecords.endDate,
        reason: ptoRecords.reason,
        createdAt: ptoRecords.createdAt,
        updatedAt: ptoRecords.updatedAt,
      })
      .from(ptoRecords)
      .leftJoin(users, eq(ptoRecords.eaId, users.id))
      .orderBy(desc(ptoRecords.startDate));

    const conditions = [];

    // Filter by EA
    if (eaId) {
      conditions.push(eq(ptoRecords.eaId, eaId));
    }

    // Filter by reason
    if (reason && ptoReasonValues.includes(reason as any)) {
      conditions.push(eq(ptoRecords.reason, reason as any));
    }

    // Filter by date range
    if (startDate) {
      const startTimestamp = typeof startDate === "string" ? parseInt(startDate) : startDate;
      conditions.push(gte(ptoRecords.endDate, startTimestamp));
    }
    if (endDate) {
      const endTimestamp = typeof endDate === "string" ? parseInt(endDate) : endDate;
      conditions.push(lte(ptoRecords.startDate, endTimestamp));
    }

    // Filter by status (active/upcoming/past)
    const now = Math.floor(Date.now() / 1000);
    if (status === "active") {
      conditions.push(and(lte(ptoRecords.startDate, now), gte(ptoRecords.endDate, now)));
    } else if (status === "upcoming") {
      conditions.push(gte(ptoRecords.startDate, now));
    } else if (status === "past") {
      conditions.push(lte(ptoRecords.endDate, now));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const records = await query.all();
    return c.json(records);
  } catch (error) {
    console.error("Error retrieving PTO records:", error);
    return c.json({ error: "Failed to retrieve PTO records" }, 500);
  }
});

// Get active PTO for an EA
ptoRouter.get("/ea/:eaId/active", async (c) => {
  try {
    const db = getDb(c.env);
    const eaId = c.req.param("eaId");
    const userRole = c.get("userRole") as string | undefined;
    const userId = c.get("userId") as string | undefined;

    // Authorization: EA can view own PTO, Admins can view all
    if (userRole === "EA" && userId !== eaId) {
      return c.json({ error: "Forbidden: EAs can only view their own PTO" }, 403);
    }

    const { checkActivePTO } = await import("../services/pto-check");
    const activePTO = await checkActivePTO(db, eaId);

    if (!activePTO) {
      return c.json({ active: false });
    }

    return c.json({ active: true, pto: activePTO });
  } catch (error) {
    console.error("Error checking active PTO:", error);
    return c.json({ error: "Failed to check active PTO" }, 500);
  }
});

// Create PTO record (Admin only)
ptoRouter.post("/", requireRole(adminRoles), async (c) => {
  try {
    const db = getDb(c.env);
    const body = await c.req.json();
    const { eaId, startDate, endDate, reason } = body;

    if (!eaId || !startDate || !endDate || !reason) {
      return c.json({ error: "Missing required fields: eaId, startDate, endDate, reason" }, 400);
    }

    if (!ptoReasonValues.includes(reason)) {
      return c.json({ error: `Invalid reason. Must be one of: ${ptoReasonValues.join(", ")}` }, 400);
    }

    // Validate dates
    const startTimestamp = typeof startDate === "number" ? startDate : Math.floor(new Date(startDate).getTime() / 1000);
    const endTimestamp = typeof endDate === "number" ? endDate : Math.floor(new Date(endDate).getTime() / 1000);

    if (startTimestamp > endTimestamp) {
      return c.json({ error: "Start date must be before or equal to end date" }, 400);
    }

    // Check if EA exists and is an EA
    const ea = await db.select().from(users).where(and(eq(users.id, eaId), eq(users.role, "EA"))).get();
    if (!ea) {
      return c.json({ error: "EA not found" }, 404);
    }

    const newPTO = await db
      .insert(ptoRecords)
      .values({
        eaId,
        startDate: startTimestamp,
        endDate: endTimestamp,
        reason,
      })
      .returning()
      .get();

    return c.json({ message: "PTO record created successfully", pto: newPTO }, 201);
  } catch (error) {
    console.error("Error creating PTO record:", error);
    return c.json({ error: "Failed to create PTO record" }, 500);
  }
});

// Update PTO record (Admin only)
ptoRouter.put("/:ptoId", requireRole(adminRoles), async (c) => {
  try {
    const db = getDb(c.env);
    const ptoId = c.req.param("ptoId");
    const body = await c.req.json();
    const { startDate, endDate, reason } = body;

    const existingPTO = await db.select().from(ptoRecords).where(eq(ptoRecords.id, ptoId)).get();
    if (!existingPTO) {
      return c.json({ error: "PTO record not found" }, 404);
    }

    // Validate dates if provided
    let startTimestamp = existingPTO.startDate;
    let endTimestamp = existingPTO.endDate;

    if (startDate !== undefined) {
      startTimestamp = typeof startDate === "number" ? startDate : Math.floor(new Date(startDate).getTime() / 1000);
    }
    if (endDate !== undefined) {
      endTimestamp = typeof endDate === "number" ? endDate : Math.floor(new Date(endDate).getTime() / 1000);
    }

    if (startTimestamp > endTimestamp) {
      return c.json({ error: "Start date must be before or equal to end date" }, 400);
    }

    // Validate reason if provided
    if (reason !== undefined && !ptoReasonValues.includes(reason)) {
      return c.json({ error: `Invalid reason. Must be one of: ${ptoReasonEnum.join(", ")}` }, 400);
    }

    await db
      .update(ptoRecords)
      .set({
        startDate: startTimestamp,
        endDate: endTimestamp,
        reason: reason ?? existingPTO.reason,
        updatedAt: Math.floor(Date.now() / 1000),
      })
      .where(eq(ptoRecords.id, ptoId))
      .run();

    return c.json({ message: "PTO record updated successfully" });
  } catch (error) {
    console.error("Error updating PTO record:", error);
    return c.json({ error: "Failed to update PTO record" }, 500);
  }
});

// Delete PTO record (Admin only)
ptoRouter.delete("/:ptoId", requireRole(adminRoles), async (c) => {
  try {
    const db = getDb(c.env);
    const ptoId = c.req.param("ptoId");

    const existingPTO = await db.select().from(ptoRecords).where(eq(ptoRecords.id, ptoId)).get();
    if (!existingPTO) {
      return c.json({ error: "PTO record not found" }, 404);
    }

    await db.delete(ptoRecords).where(eq(ptoRecords.id, ptoId)).run();

    return c.json({ message: "PTO record deleted successfully" });
  } catch (error) {
    console.error("Error deleting PTO record:", error);
    return c.json({ error: "Failed to delete PTO record" }, 500);
  }
});

export default ptoRouter;

