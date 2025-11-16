import { Hono } from "hono";
import { getDb } from "../db";
import { coachingNotes, users, pairings, noteTypeEnum } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth, requireRole, adminRoles } from "../middleware/auth";
import type { AuthEnv } from "../auth/config";

type Env = AuthEnv;

const coachingNotesRouter = new Hono<{ Bindings: Env }>();

// Apply auth middleware to all routes
coachingNotesRouter.use("*", requireAuth);

// Get EA-level coaching note
coachingNotesRouter.get("/ea/:eaId", async (c) => {
  try {
    const db = getDb(c.env);
    const eaId = c.req.param("eaId");
    const userRole = c.get("userRole") as string | undefined;
    const userId = c.get("userId") as string | undefined;

    // Authorization: EA can view own note, Admins can view all
    if (userRole === "EA" && userId !== eaId) {
      return c.json({ error: "Forbidden: EAs can only view their own coaching notes" }, 403);
    }

    const note = await db
      .select({
        id: coachingNotes.id,
        content: coachingNotes.content,
        updatedBy: coachingNotes.updatedBy,
        updatedByName: users.name,
        createdAt: coachingNotes.createdAt,
        updatedAt: coachingNotes.updatedAt,
      })
      .from(coachingNotes)
      .leftJoin(users, eq(coachingNotes.updatedBy, users.id))
      .where(and(eq(coachingNotes.noteType, "EA_LEVEL"), eq(coachingNotes.eaId, eaId)))
      .get();

    if (!note) {
      return c.json({ error: "EA-level coaching note not found" }, 404);
    }

    return c.json(note);
  } catch (error) {
    console.error("Error retrieving EA-level coaching note:", error);
    return c.json({ error: "Failed to retrieve coaching note" }, 500);
  }
});

// Get pairing-level coaching note
coachingNotesRouter.get("/pairing/:pairingId", async (c) => {
  try {
    const db = getDb(c.env);
    const pairingId = c.req.param("pairingId");
    const userRole = c.get("userRole") as string | undefined;
    const userId = c.get("userId") as string | undefined;

    // Get pairing to check EA ownership
    const pairing = await db.select().from(pairings).where(eq(pairings.id, pairingId)).get();
    if (!pairing) {
      return c.json({ error: "Pairing not found" }, 404);
    }

    // Authorization: EA can view own pairing notes, Admins can view all
    if (userRole === "EA" && userId !== pairing.eaId) {
      return c.json({ error: "Forbidden: EAs can only view their own pairing coaching notes" }, 403);
    }

    const note = await db
      .select({
        id: coachingNotes.id,
        content: coachingNotes.content,
        updatedBy: coachingNotes.updatedBy,
        updatedByName: users.name,
        createdAt: coachingNotes.createdAt,
        updatedAt: coachingNotes.updatedAt,
      })
      .from(coachingNotes)
      .leftJoin(users, eq(coachingNotes.updatedBy, users.id))
      .where(and(eq(coachingNotes.noteType, "PAIRING_LEVEL"), eq(coachingNotes.pairingId, pairingId)))
      .get();

    if (!note) {
      return c.json({ error: "Pairing-level coaching note not found" }, 404);
    }

    return c.json(note);
  } catch (error) {
    console.error("Error retrieving pairing-level coaching note:", error);
    return c.json({ error: "Failed to retrieve coaching note" }, 500);
  }
});

// Update or create EA-level coaching note (Admin only)
coachingNotesRouter.put("/ea/:eaId", requireRole(adminRoles), async (c) => {
  try {
    const db = getDb(c.env);
    const eaId = c.req.param("eaId");
    const body = await c.req.json();
    const { content } = body;
    const userId = c.get("userId") as string | undefined;

    if (!content || typeof content !== "string") {
      return c.json({ error: "Missing or invalid content field" }, 400);
    }

    // Check if EA exists
    const ea = await db.select().from(users).where(and(eq(users.id, eaId), eq(users.role, "EA"))).get();
    if (!ea) {
      return c.json({ error: "EA not found" }, 404);
    }

    // Check if note exists
    const existingNote = await db
      .select()
      .from(coachingNotes)
      .where(and(eq(coachingNotes.noteType, "EA_LEVEL"), eq(coachingNotes.eaId, eaId)))
      .get();

    if (existingNote) {
      // Update existing note
      await db
        .update(coachingNotes)
        .set({
          content,
          updatedBy: userId || "",
          updatedAt: Math.floor(Date.now() / 1000),
        })
        .where(eq(coachingNotes.id, existingNote.id))
        .run();

      return c.json({ message: "EA-level coaching note updated successfully" });
    } else {
      // Create new note
      await db
        .insert(coachingNotes)
        .values({
          noteType: "EA_LEVEL",
          eaId,
          pairingId: null,
          content,
          updatedBy: userId || "",
        })
        .run();

      return c.json({ message: "EA-level coaching note created successfully" }, 201);
    }
  } catch (error) {
    console.error("Error updating EA-level coaching note:", error);
    return c.json({ error: "Failed to update coaching note" }, 500);
  }
});

// Update or create pairing-level coaching note (Admin only)
coachingNotesRouter.put("/pairing/:pairingId", requireRole(adminRoles), async (c) => {
  try {
    const db = getDb(c.env);
    const pairingId = c.req.param("pairingId");
    const body = await c.req.json();
    const { content } = body;
    const userId = c.get("userId") as string | undefined;

    if (!content || typeof content !== "string") {
      return c.json({ error: "Missing or invalid content field" }, 400);
    }

    // Check if pairing exists
    const pairing = await db.select().from(pairings).where(eq(pairings.id, pairingId)).get();
    if (!pairing) {
      return c.json({ error: "Pairing not found" }, 404);
    }

    // Check if note exists
    const existingNote = await db
      .select()
      .from(coachingNotes)
      .where(and(eq(coachingNotes.noteType, "PAIRING_LEVEL"), eq(coachingNotes.pairingId, pairingId)))
      .get();

    if (existingNote) {
      // Update existing note
      await db
        .update(coachingNotes)
        .set({
          content,
          updatedBy: userId || "",
          updatedAt: Math.floor(Date.now() / 1000),
        })
        .where(eq(coachingNotes.id, existingNote.id))
        .run();

      return c.json({ message: "Pairing-level coaching note updated successfully" });
    } else {
      // Create new note
      await db
        .insert(coachingNotes)
        .values({
          noteType: "PAIRING_LEVEL",
          eaId: null,
          pairingId,
          content,
          updatedBy: userId || "",
        })
        .run();

      return c.json({ message: "Pairing-level coaching note created successfully" }, 201);
    }
  } catch (error) {
    console.error("Error updating pairing-level coaching note:", error);
    return c.json({ error: "Failed to update coaching note" }, 500);
  }
});

export default coachingNotesRouter;

