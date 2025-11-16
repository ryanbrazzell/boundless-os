import { Hono } from "hono";
import { getDb } from "./db";
import { createAuth, AuthEnv } from "./auth/config";
import { corsMiddleware } from "./middleware/cors";
import { errorHandler } from "./middleware/error-handler";
import { rateLimit } from "./middleware/rate-limit";
import { requestLogger } from "./middleware/request-logger";

type Env = AuthEnv & {
  KV: KVNamespace;
  CLAUDE_API_KEY?: string;
};

const app = new Hono<{ Bindings: Env }>();

// Global middleware
app.use("*", corsMiddleware);
app.use("*", requestLogger);
app.use("*", rateLimit(100, 60)); // 100 requests per minute
app.onError(errorHandler);

app.get("/", (c) => {
  return c.json({ message: "Boundless OS Worker API" });
});

app.get("/health", async (c) => {
  try {
    const db = getDb(c.env);
    // Simple health check - will be expanded as schema is added
    return c.json({ status: "ok", database: "connected" });
  } catch (error) {
    return c.json({ status: "error", error: String(error) }, 500);
  }
});

// Authentication routes
// Handle OPTIONS separately before Better Auth
app.options("/api/auth/*", (c) => {
  // CORS middleware already set headers
  return c.body(null, 204);
});

// Handle actual auth requests
app.all("/api/auth/*", async (c) => {
  try {
    const auth = createAuth(c.env as AuthEnv);
    return await auth.handler(c.req.raw);
    // CORS middleware already added headers, no need to duplicate
  } catch (error) {
    console.error("Better Auth error:", error);
    return c.json({ error: "Authentication failed" }, 500);
  }
});

// User management routes
import usersRouter from "./routes/users";
app.route("/api/users", usersRouter);

// Start of day routes
import startOfDayRouter from "./routes/start-of-day";
app.route("/api/start-of-day", startOfDayRouter);

// Pairing management routes
import pairingsRouter from "./routes/pairings";
app.route("/api/pairings", pairingsRouter);

// CSV import routes (mount before pairings to avoid conflict)
import importRouter from "./routes/pairings-import";
pairingsRouter.route("/import", importRouter);

// Report submission routes
import reportsRouter from "./routes/reports";
app.route("/api/reports", reportsRouter);

// Coaching notes routes
import coachingNotesRouter from "./routes/coaching-notes";
app.route("/api/coaching-notes", coachingNotesRouter);

// Announcements routes
import announcementsRouter from "./routes/announcements";
app.route("/api/announcements", announcementsRouter);

// PTO routes
import ptoRouter from "./routes/pto";
app.route("/api/pto", ptoRouter);

// Analytics routes
import analyticsRouter from "./routes/analytics";
app.route("/api/analytics", analyticsRouter);

// Alert management routes
import alertsRouter from "./routes/alerts";
app.route("/api/alerts", alertsRouter);

// Alert rules management routes
import alertRulesRouter from "./routes/alert-rules";
app.route("/api/alert-rules", alertRulesRouter);

// Dashboard routes
import dashboardRouter from "./routes/dashboard";
app.route("/api/dashboard", dashboardRouter);

export default app;

