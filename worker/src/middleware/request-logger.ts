import { Context } from "hono";
import { logger } from "../utils/logger";

/**
 * Request logging middleware
 */
export const requestLogger = async (c: Context, next: () => Promise<void>) => {
  const start = Date.now();
  const method = c.req.method;
  const path = c.req.path;
  const ip = c.req.header("cf-connecting-ip") || c.req.header("x-forwarded-for") || "unknown";

  await next();

  const duration = Date.now() - start;
  const status = c.res.status;

  // Log request details
  if (status >= 500) {
    logger.error(`[${method}] ${path} - ${status} - ${duration}ms`, undefined, { ip });
  } else if (status >= 400) {
    logger.warn(`[${method}] ${path} - ${status} - ${duration}ms`, { ip });
  } else {
    logger.info(`[${method}] ${path} - ${status} - ${duration}ms`, { ip });
  }
};

