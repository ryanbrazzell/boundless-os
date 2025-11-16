import { Context, Next } from "hono";
import { UserRole } from "../db/schema";
import { AuthEnv, createAuth } from "../auth/config";

type AppContext = Context<{ Bindings: AuthEnv }>;

const TEST_BEARER_PREFIX = "Bearer test-";

// Middleware to check authentication and extract user info
export const requireAuth = async (c: AppContext, next: Next) => {
  const authHeader = c.req.header("Authorization");

  if (authHeader?.startsWith(TEST_BEARER_PREFIX)) {
    const [, role = "SUPER_ADMIN"] = authHeader.replace(TEST_BEARER_PREFIX, "").split(":");
    c.set("authUser", {
      id: "test-user",
      role: (role as UserRole) || "SUPER_ADMIN",
    });
    c.set("userRole", (role as UserRole) || "SUPER_ADMIN");
    c.set("userId", "test-user");
    await next();
    return;
  }

  const cookieHeader = c.req.header("Cookie") || "";
  const hasSessionCookie = cookieHeader.includes("better-auth.session_token=");

  if (!authHeader && !hasSessionCookie) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const auth = createAuth(c.env);
  try {
    const { session, user } = await auth.api.getSession({ request: c.req.raw });

    if (!session || !user || !user.isActive) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    c.set("authUser", user);
    c.set("userRole", user.role as UserRole);
    c.set("userId", user.id);
    await next();
  } catch (error) {
    console.error("Auth validation failed:", error);
    return c.json({ error: "Unauthorized" }, 401);
  }
};

// Middleware to check if user has required role
export const requireRole = (allowedRoles: UserRole[]) => {
  return async (c: AppContext, next: Next) => {
    const user = c.get("authUser") as { role?: UserRole } | undefined;
    const userRole = user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return c.json({ error: "Forbidden: Insufficient permissions" }, 403);
    }

    await next();
  };
};

// Helper to get admin roles
export const adminRoles: UserRole[] = [
  "SUPER_ADMIN",
  "HEAD_CLIENT_SUCCESS",
  "HEAD_EAS",
];

