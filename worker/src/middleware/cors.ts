import { Context } from "hono";

/**
 * CORS middleware for Hono
 * Handles cross-origin requests with security best practices
 */
export const corsMiddleware = async (c: Context, next: () => Promise<void>) => {
  const origin = c.req.header("Origin");

  // Allowed origins for CORS requests
  const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "https://boundless-os-web.pages.dev",
  ];

  // More secure pattern: only allow hash-based preview deployments
  // This prevents unauthorized preview deployments from making authenticated requests
  const allowedOriginPatterns = [
    /^https:\/\/[a-f0-9]{8}\.boundless-os-web\.pages\.dev$/, // Only hash-based preview URLs
  ];

  const isAllowedOrigin =
    origin &&
    (allowedOrigins.includes(origin) || allowedOriginPatterns.some((pattern) => pattern.test(origin)));

  if (isAllowedOrigin && origin) {
    c.header("Access-Control-Allow-Origin", origin);
    c.header("Access-Control-Allow-Credentials", "true");
  }

  c.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  c.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  c.header("Access-Control-Max-Age", "86400"); // Cache preflight for 24 hours
  c.header("Vary", "Origin"); // Important for caching

  if (c.req.method === "OPTIONS") {
    return c.body(null, 204);
  }

  await next();
};

