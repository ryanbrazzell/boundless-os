import { Hono } from "hono";
import { getDb } from "../db";
import { pairings, users, clients, healthStatusValues } from "../db/schema";
import type { AuthEnv } from "../auth/config";
import { eq, and } from "drizzle-orm";
import { requireAuth, requireRole, adminRoles } from "../middleware/auth";

type Env = AuthEnv;

const pairingsRouter = new Hono<{ Bindings: Env }>();

// Apply auth middleware to all routes
pairingsRouter.use("*", requireAuth);
pairingsRouter.use("*", requireRole(adminRoles));

// Create pairing
pairingsRouter.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const {
      eaId,
      clientId,
      startDate,
      acceleratorEnabled,
      acceleratorWeek1Goals,
      acceleratorWeek2Goals,
      acceleratorWeek3Goals,
      acceleratorWeek4Goals,
    } = body;

    // Validate required fields
    if (!eaId || !clientId || !startDate) {
      return c.json({ error: "Missing required fields: eaId, clientId, startDate" }, 400);
    }

    // Validate UUIDs
    const { isValidUUID } = await import("../utils/validation");
    if (!isValidUUID(eaId)) {
      return c.json({ error: "Invalid eaId format" }, 400);
    }
    if (!isValidUUID(clientId)) {
      return c.json({ error: "Invalid clientId format" }, 400);
    }

    const db = getDb(c.env);

    // Validate EA exists
    const ea = await db.select().from(users).where(eq(users.id, eaId)).get();
    if (!ea || ea.role !== "EA") {
      return c.json({ error: "Invalid EA ID" }, 400);
    }

    // Validate client exists
    const client = await db.select().from(clients).where(eq(clients.id, clientId)).get();
    if (!client) {
      return c.json({ error: "Invalid client ID" }, 400);
    }

    // Check for duplicate pairing
    const existingPairing = await db
      .select()
      .from(pairings)
      .where(and(eq(pairings.eaId, eaId), eq(pairings.clientId, clientId)))
      .get();

    if (existingPairing) {
      return c.json({ error: "Pairing already exists for this EA and Client" }, 409);
    }

    // Convert startDate to timestamp
    const startDateTimestamp = Math.floor(new Date(startDate).getTime() / 1000);

    // Create pairing
    const [newPairing] = await db
      .insert(pairings)
      .values({
        eaId,
        clientId,
        startDate: startDateTimestamp,
        acceleratorEnabled: acceleratorEnabled || false,
        acceleratorWeek: acceleratorEnabled ? 1 : null,
        acceleratorWeek1Goals: acceleratorWeek1Goals || null,
        acceleratorWeek2Goals: acceleratorWeek2Goals || null,
        acceleratorWeek3Goals: acceleratorWeek3Goals || null,
        acceleratorWeek4Goals: acceleratorWeek4Goals || null,
        healthStatusOverride: false,
      })
      .returning();

    return c.json({ pairing: newPairing }, 201);
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// List pairings
pairingsRouter.get("/", async (c) => {
  try {
    const eaId = c.req.query("eaId");
    const clientId = c.req.query("clientId");
    const healthStatus = c.req.query("healthStatus");
    const acceleratorStatus = c.req.query("acceleratorStatus");

    const db = getDb(c.env);

    let query = db.select().from(pairings);

    // Apply filters
    if (eaId) {
      query = query.where(eq(pairings.eaId, eaId)) as any;
    }
    if (clientId) {
      query = query.where(eq(pairings.clientId, clientId)) as any;
    }
    if (healthStatus && healthStatusValues.includes(healthStatus as any)) {
      query = query.where(eq(pairings.healthStatus, healthStatus as any)) as any;
    }
    if (acceleratorStatus === "enabled") {
      query = query.where(eq(pairings.acceleratorEnabled, true)) as any;
    } else if (acceleratorStatus === "disabled") {
      query = query.where(eq(pairings.acceleratorEnabled, false)) as any;
    }

    const pairingList = await query;

    // Join with users and clients to get names
    // For now, return basic pairing data

    return c.json({ pairings: pairingList });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// Get pairing detail
pairingsRouter.get("/:pairingId", async (c) => {
  try {
    const pairingId = c.req.param("pairingId");
    const db = getDb(c.env);

    const pairing = await db.select().from(pairings).where(eq(pairings.id, pairingId)).get();

    if (!pairing) {
      return c.json({ error: "Pairing not found" }, 404);
    }

    // Pairing detail includes basic info - use specific endpoints for reports/alerts
    // For now, return basic pairing data

    return c.json({ pairing });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// Update pairing
pairingsRouter.put("/:pairingId", async (c) => {
  try {
    const pairingId = c.req.param("pairingId");
    const body = await c.req.json();
    const {
      startDate,
      acceleratorEnabled,
      acceleratorWeek,
      acceleratorWeek1Goals,
      acceleratorWeek2Goals,
      acceleratorWeek3Goals,
      acceleratorWeek4Goals,
    } = body;

    const db = getDb(c.env);

    const updateData: any = {
      updatedAt: Math.floor(Date.now() / 1000),
    };

    if (startDate) {
      updateData.startDate = Math.floor(new Date(startDate).getTime() / 1000);
    }
    if (typeof acceleratorEnabled === "boolean") {
      updateData.acceleratorEnabled = acceleratorEnabled;
      if (!acceleratorEnabled) {
        updateData.acceleratorWeek = null;
      }
    }
    if (acceleratorWeek !== undefined) {
      if (acceleratorWeek === null || (acceleratorWeek >= 1 && acceleratorWeek <= 4)) {
        updateData.acceleratorWeek = acceleratorWeek;
      }
    }
    if (acceleratorWeek1Goals !== undefined) updateData.acceleratorWeek1Goals = acceleratorWeek1Goals;
    if (acceleratorWeek2Goals !== undefined) updateData.acceleratorWeek2Goals = acceleratorWeek2Goals;
    if (acceleratorWeek3Goals !== undefined) updateData.acceleratorWeek3Goals = acceleratorWeek3Goals;
    if (acceleratorWeek4Goals !== undefined) updateData.acceleratorWeek4Goals = acceleratorWeek4Goals;

    await db.update(pairings).set(updateData).where(eq(pairings.id, pairingId));

    const updatedPairing = await db.select().from(pairings).where(eq(pairings.id, pairingId)).get();

    return c.json({ pairing: updatedPairing });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// Health status override
pairingsRouter.patch("/:pairingId/health-status", async (c) => {
  try {
    const pairingId = c.req.param("pairingId");
    const body = await c.req.json();
    const { healthStatusOverride, manualHealthStatus } = body;

    if (typeof healthStatusOverride !== "boolean") {
      return c.json({ error: "healthStatusOverride must be a boolean" }, 400);
    }

    const db = getDb(c.env);

    const updateData: any = {
      healthStatusOverride,
      updatedAt: Math.floor(Date.now() / 1000),
    };

    if (healthStatusOverride && manualHealthStatus) {
      if (!healthStatusValues.includes(manualHealthStatus)) {
        return c.json({ error: "Invalid health status" }, 400);
      }
      updateData.healthStatus = manualHealthStatus;
    } else if (!healthStatusOverride) {
      // Clear manual override - set healthStatus to null to use automatic calculation
      updateData.healthStatus = null;
    }

    await db.update(pairings).set(updateData).where(eq(pairings.id, pairingId));

    const updatedPairing = await db.select().from(pairings).where(eq(pairings.id, pairingId)).get();

    return c.json({ pairing: updatedPairing });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// Accelerator settings update
pairingsRouter.patch("/:pairingId/accelerator", requireRole(adminRoles), async (c) => {
  try {
    const pairingId = c.req.param("pairingId");
    const body = await c.req.json();
    const {
      acceleratorEnabled,
      acceleratorWeek1Goals,
      acceleratorWeek2Goals,
      acceleratorWeek3Goals,
      acceleratorWeek4Goals,
    } = body;

    const db = getDb(c.env);

    const existingPairing = await db.select().from(pairings).where(eq(pairings.id, pairingId)).get();
    if (!existingPairing) {
      return c.json({ error: "Pairing not found" }, 404);
    }

    const updateData: any = {
      updatedAt: Math.floor(Date.now() / 1000),
    };

    // Handle accelerator enabled/disabled
    if (typeof acceleratorEnabled === "boolean") {
      updateData.acceleratorEnabled = acceleratorEnabled;
      // When enabling, set to Week 1 if not already set
      if (acceleratorEnabled && existingPairing.acceleratorWeek === null) {
        updateData.acceleratorWeek = 1;
      }
      // When disabling, clear week
      if (!acceleratorEnabled) {
        updateData.acceleratorWeek = null;
      }
    }

    // Update weekly goals
    if (acceleratorWeek1Goals !== undefined) updateData.acceleratorWeek1Goals = acceleratorWeek1Goals || null;
    if (acceleratorWeek2Goals !== undefined) updateData.acceleratorWeek2Goals = acceleratorWeek2Goals || null;
    if (acceleratorWeek3Goals !== undefined) updateData.acceleratorWeek3Goals = acceleratorWeek3Goals || null;
    if (acceleratorWeek4Goals !== undefined) updateData.acceleratorWeek4Goals = acceleratorWeek4Goals || null;

    await db.update(pairings).set(updateData).where(eq(pairings.id, pairingId)).run();

    const updatedPairing = await db.select().from(pairings).where(eq(pairings.id, pairingId)).get();

    return c.json({ message: "Accelerator settings updated successfully", pairing: updatedPairing });
  } catch (error) {
    console.error("Error updating accelerator settings:", error);
    return c.json({ error: "Failed to update accelerator settings" }, 500);
  }
});

// Accelerator week progression
pairingsRouter.patch("/:pairingId/accelerator-week", requireRole(adminRoles), async (c) => {
  try {
    const pairingId = c.req.param("pairingId");
    const body = await c.req.json();
    const { acceleratorWeek } = body;

    if (acceleratorWeek !== null && (acceleratorWeek < 1 || acceleratorWeek > 4)) {
      return c.json({ error: "acceleratorWeek must be 1, 2, 3, 4, or null" }, 400);
    }

    const db = getDb(c.env);

    const existingPairing = await db.select().from(pairings).where(eq(pairings.id, pairingId)).get();
    if (!existingPairing) {
      return c.json({ error: "Pairing not found" }, 404);
    }

    await db
      .update(pairings)
      .set({
        acceleratorWeek: acceleratorWeek,
        updatedAt: Math.floor(Date.now() / 1000),
      })
      .where(eq(pairings.id, pairingId))
      .run();

    const updatedPairing = await db.select().from(pairings).where(eq(pairings.id, pairingId)).get();

    return c.json({ message: "Accelerator week updated successfully", pairing: updatedPairing });
  } catch (error) {
    console.error("Error updating accelerator week:", error);
    return c.json({ error: "Failed to update accelerator week" }, 500);
  }
});

// Get EA's active pairings (for EA role, own pairings only)
pairingsRouter.get("/ea/:eaId", async (c) => {
  try {
    const eaId = c.req.param("eaId");
    const userId = c.get("userId") as string | undefined;
    const userRole = c.get("userRole") as string | undefined;

    // Authorization: EA can view own pairings, Admins can view all
    if (userRole === "EA" && userId !== eaId) {
      return c.json({ error: "Forbidden: EAs can only view their own pairings" }, 403);
    }

    const db = getDb(c.env);

    // Get EA's active pairings with client names
    const eaPairings = await db
      .select({
        id: pairings.id,
        clientId: pairings.clientId,
        clientName: clients.name,
        startDate: pairings.startDate,
        healthStatus: pairings.healthStatus,
      })
      .from(pairings)
      .innerJoin(clients, eq(pairings.clientId, clients.id))
      .where(eq(pairings.eaId, eaId))
      .orderBy(desc(pairings.startDate))
      .all();

    return c.json({ pairings: eaPairings });
  } catch (error) {
    console.error("Error retrieving EA pairings:", error);
    return c.json({ error: "Failed to retrieve EA pairings" }, 500);
  }
});

// Get pairing coaching note (EA can view own pairing notes)
pairingsRouter.get("/:pairingId/coaching-note", async (c) => {
  try {
    const pairingId = c.req.param("pairingId");
    const userId = c.get("userId") as string | undefined;
    const userRole = c.get("userRole") as string | undefined;

    const db = getDb(c.env);

    // Get pairing to verify EA ownership
    const pairing = await db.select().from(pairings).where(eq(pairings.id, pairingId)).get();
    if (!pairing) {
      return c.json({ error: "Pairing not found" }, 404);
    }

    // Authorization: EA can view own pairing notes, Admins can view all
    if (userRole === "EA" && userId !== pairing.eaId) {
      return c.json({ error: "Forbidden: EAs can only view their own pairing notes" }, 403);
    }

    // Get pairing-level coaching note
    const coachingNote = await db
      .select()
      .from(coachingNotes)
      .where(and(eq(coachingNotes.pairingId, pairingId), eq(coachingNotes.noteType, "PAIRING_LEVEL")))
      .get();

    return c.json({ coachingNote: coachingNote || null });
  } catch (error) {
    console.error("Error retrieving pairing coaching note:", error);
    return c.json({ error: "Failed to retrieve pairing coaching note" }, 500);
  }
});

// Health calculation
pairingsRouter.get("/:pairingId/health", async (c) => {
  try {
    const pairingId = c.req.param("pairingId");
    const db = getDb(c.env);

    const { calculatePairingHealth } = await import("../services/health-scoring");
    const healthResult = await calculatePairingHealth(db, pairingId);

    return c.json(healthResult);
  } catch (error) {
    if (error instanceof Error && error.message === "Pairing not found") {
      return c.json({ error: error.message }, 404);
    }
    return c.json({ error: String(error) }, 500);
  }
});

export default pairingsRouter;

