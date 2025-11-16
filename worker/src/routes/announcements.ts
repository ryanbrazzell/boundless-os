import { Hono } from "hono";
import { getDb } from "../db";
import { companyAnnouncements, users } from "../db/schema";
import { eq, and, gte, lte, desc, or, isNull, isNotNull } from "drizzle-orm";
import { requireAuth, requireRole, adminRoles } from "../middleware/auth";
import type { AuthEnv } from "../auth/config";

type Env = AuthEnv;

const announcementsRouter = new Hono<{ Bindings: Env }>();

// Apply auth middleware to all routes
announcementsRouter.use("*", requireAuth);

// Get all announcements (with filters)
announcementsRouter.get("/", async (c) => {
  try {
    const db = getDb(c.env);
    const { isActive, expirationStatus } = c.req.query();

    let query = db.select({
      id: companyAnnouncements.id,
      title: companyAnnouncements.title,
      content: companyAnnouncements.content,
      isActive: companyAnnouncements.isActive,
      expiresAt: companyAnnouncements.expiresAt,
      createdBy: companyAnnouncements.createdBy,
      createdByName: users.name,
      createdAt: companyAnnouncements.createdAt,
      updatedAt: companyAnnouncements.updatedAt,
    })
      .from(companyAnnouncements)
      .leftJoin(users, eq(companyAnnouncements.createdBy, users.id))
      .orderBy(desc(companyAnnouncements.createdAt));

    const conditions = [];
    
    // Filter by isActive
    if (isActive === "true") {
      conditions.push(eq(companyAnnouncements.isActive, true));
    } else if (isActive === "false") {
      conditions.push(eq(companyAnnouncements.isActive, false));
    }

    // Filter by expiration status
    const now = Math.floor(Date.now() / 1000);
    if (expirationStatus === "active") {
      conditions.push(
        or(
          isNull(companyAnnouncements.expiresAt),
          gte(companyAnnouncements.expiresAt, now)
        )
      );
    } else if (expirationStatus === "expired") {
      conditions.push(
        and(
          isNotNull(companyAnnouncements.expiresAt),
          lte(companyAnnouncements.expiresAt, now)
        )
      );
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const announcements = await query.all();
    return c.json(announcements);
  } catch (error) {
    console.error("Error retrieving announcements:", error);
    return c.json({ error: "Failed to retrieve announcements" }, 500);
  }
});

// Get active announcements (public endpoint for authenticated users)
announcementsRouter.get("/active", async (c) => {
  try {
    const db = getDb(c.env);
    const now = Math.floor(Date.now() / 1000);

    const activeAnnouncements = await db
      .select({
        id: companyAnnouncements.id,
        title: companyAnnouncements.title,
        content: companyAnnouncements.content,
        expiresAt: companyAnnouncements.expiresAt,
        createdAt: companyAnnouncements.createdAt,
      })
      .from(companyAnnouncements)
      .where(
        and(
          eq(companyAnnouncements.isActive, true),
          or(
            isNull(companyAnnouncements.expiresAt),
            gte(companyAnnouncements.expiresAt, now)
          )
        )
      )
      .orderBy(desc(companyAnnouncements.createdAt))
      .all();

    return c.json(activeAnnouncements);
  } catch (error) {
    console.error("Error retrieving active announcements:", error);
    return c.json({ error: "Failed to retrieve active announcements" }, 500);
  }
});

// Create announcement (Admin only)
announcementsRouter.post("/", requireRole(adminRoles), async (c) => {
  try {
    const db = getDb(c.env);
    const body = await c.req.json();
    const { title, content, expiresAt, isActive = true } = body;
    const userId = c.get("userId") as string | undefined;

    if (!title || !content) {
      return c.json({ error: "Missing required fields: title, content" }, 400);
    }

    // Validate expiration date if provided
    if (expiresAt) {
      const expirationTimestamp = typeof expiresAt === "number" ? expiresAt : Math.floor(new Date(expiresAt).getTime() / 1000);
      const now = Math.floor(Date.now() / 1000);
      if (expirationTimestamp <= now) {
        return c.json({ error: "Expiration date must be in the future" }, 400);
      }
    }

    const newAnnouncement = await db
      .insert(companyAnnouncements)
      .values({
        title,
        content,
        isActive: isActive !== false,
        expiresAt: expiresAt ? (typeof expiresAt === "number" ? expiresAt : Math.floor(new Date(expiresAt).getTime() / 1000)) : null,
        createdBy: userId || "",
      })
      .returning()
      .get();

    return c.json({ message: "Announcement created successfully", announcement: newAnnouncement }, 201);
  } catch (error) {
    console.error("Error creating announcement:", error);
    return c.json({ error: "Failed to create announcement" }, 500);
  }
});

// Update announcement (Admin only)
announcementsRouter.put("/:announcementId", requireRole(adminRoles), async (c) => {
  try {
    const db = getDb(c.env);
    const announcementId = c.req.param("announcementId");
    const body = await c.req.json();
    const { title, content, expiresAt, isActive } = body;

    const existingAnnouncement = await db
      .select()
      .from(companyAnnouncements)
      .where(eq(companyAnnouncements.id, announcementId))
      .get();

    if (!existingAnnouncement) {
      return c.json({ error: "Announcement not found" }, 404);
    }

    // Validate expiration date if provided
    let expirationTimestamp = null;
    if (expiresAt !== undefined) {
      if (expiresAt === null) {
        expirationTimestamp = null;
      } else {
        expirationTimestamp = typeof expiresAt === "number" ? expiresAt : Math.floor(new Date(expiresAt).getTime() / 1000);
        const now = Math.floor(Date.now() / 1000);
        if (expirationTimestamp <= now) {
          return c.json({ error: "Expiration date must be in the future" }, 400);
        }
      }
    }

    await db
      .update(companyAnnouncements)
      .set({
        title: title ?? existingAnnouncement.title,
        content: content ?? existingAnnouncement.content,
        expiresAt: expiresAt !== undefined ? expirationTimestamp : existingAnnouncement.expiresAt,
        isActive: typeof isActive === "boolean" ? isActive : existingAnnouncement.isActive,
        updatedAt: Math.floor(Date.now() / 1000),
      })
      .where(eq(companyAnnouncements.id, announcementId))
      .run();

    return c.json({ message: "Announcement updated successfully" });
  } catch (error) {
    console.error("Error updating announcement:", error);
    return c.json({ error: "Failed to update announcement" }, 500);
  }
});

// Delete announcement (Admin only)
announcementsRouter.delete("/:announcementId", requireRole(adminRoles), async (c) => {
  try {
    const db = getDb(c.env);
    const announcementId = c.req.param("announcementId");

    const existingAnnouncement = await db
      .select()
      .from(companyAnnouncements)
      .where(eq(companyAnnouncements.id, announcementId))
      .get();

    if (!existingAnnouncement) {
      return c.json({ error: "Announcement not found" }, 404);
    }

    await db
      .delete(companyAnnouncements)
      .where(eq(companyAnnouncements.id, announcementId))
      .run();

    return c.json({ message: "Announcement deleted successfully" });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    return c.json({ error: "Failed to delete announcement" }, 500);
  }
});

export default announcementsRouter;

