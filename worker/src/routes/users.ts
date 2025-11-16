import { Hono } from "hono";
import { getDb } from "../db";
import { users, eas, userRoleValues } from "../db/schema";
import type { AuthEnv } from "../auth/config";
import { eq } from "drizzle-orm";
import { requireAuth, requireRole, adminRoles } from "../middleware/auth";

type Env = AuthEnv;

const usersRouter = new Hono<{ Bindings: Env }>();

// Apply auth middleware to all routes
usersRouter.use("*", requireAuth);
usersRouter.use("*", requireRole(adminRoles));

// Create user
usersRouter.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const { name, email, role, expectedShowUpTime, timezone, healthcareEligibilityDate } = body;

    if (!name || !email || !role) {
      return c.json({ error: "Missing required fields: name, email, role" }, 400);
    }

    // Validate email format
    const { isValidEmail } = await import("../utils/validation");
    if (!isValidEmail(email)) {
      return c.json({ error: "Invalid email format" }, 400);
    }

    if (!userRoleValues.includes(role)) {
      return c.json({ error: "Invalid role" }, 400);
    }

    const db = getDb(c.env);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        role,
        isActive: true,
        emailVerified: false,
      })
      .returning();

    // If EA role, create EA record
    if (role === "EA") {
      await db.insert(eas).values({
        id: newUser.id,
        expectedShowUpTime: expectedShowUpTime || null,
        timezone: timezone || null,
        healthcareEligibilityDate: healthcareEligibilityDate
          ? Math.floor(new Date(healthcareEligibilityDate).getTime() / 1000)
          : null,
      });
    }

    // Email verification is handled automatically by Better Auth

    return c.json({ user: newUser }, 201);
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// List users
usersRouter.get("/", async (c) => {
  try {
    const roleFilter = c.req.query("role");
    const db = getDb(c.env);

    let query = db.select().from(users);

    if (roleFilter && userRoleValues.includes(roleFilter as any)) {
      query = query.where(eq(users.role, roleFilter as any)) as any;
    }

    const userList = await query;

    return c.json({ users: userList });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// Get user by ID
usersRouter.get("/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const db = getDb(c.env);

    const user = await db.select().from(users).where(eq(users.id, userId)).get();

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json({ user });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// Update user
usersRouter.put("/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const body = await c.req.json();
    const { name, role, isActive, expectedShowUpTime, timezone, healthcareEligibilityDate } = body;

    const db = getDb(c.env);

    // Update user
    const updateData: any = {};
    if (name) updateData.name = name;
    if (role && userRoleValues.includes(role)) updateData.role = role;
    if (typeof isActive === "boolean") updateData.isActive = isActive;
    updateData.updatedAt = new Date();

    await db.update(users).set(updateData).where(eq(users.id, userId));

    // If EA role, update EA record
    if (role === "EA" || (await db.select().from(users).where(eq(users.id, userId)).get())?.role === "EA") {
      const eaUpdateData: any = {};
      if (expectedShowUpTime !== undefined) eaUpdateData.expectedShowUpTime = expectedShowUpTime;
      if (timezone !== undefined) eaUpdateData.timezone = timezone;
      if (healthcareEligibilityDate !== undefined) {
        eaUpdateData.healthcareEligibilityDate = healthcareEligibilityDate
          ? Math.floor(new Date(healthcareEligibilityDate).getTime() / 1000)
          : null;
      }
      eaUpdateData.updatedAt = Math.floor(Date.now() / 1000);

      await db.update(eas).set(eaUpdateData).where(eq(eas.id, userId));
    }

    const updatedUser = await db.select().from(users).where(eq(users.id, userId)).get();

    return c.json({ user: updatedUser });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// Toggle user active status
usersRouter.patch("/:userId/status", async (c) => {
  try {
    const userId = c.req.param("userId");
    const body = await c.req.json();
    const { isActive } = body;

    if (typeof isActive !== "boolean") {
      return c.json({ error: "isActive must be a boolean" }, 400);
    }

    const db = getDb(c.env);

    await db
      .update(users)
      .set({
        isActive,
        updatedAt: Math.floor(Date.now() / 1000),
      })
      .where(eq(users.id, userId));

    const updatedUser = await db.select().from(users).where(eq(users.id, userId)).get();

    return c.json({ user: updatedUser });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

export default usersRouter;

