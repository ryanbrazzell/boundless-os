import { Context } from "hono";
import { HTTPException } from "hono/http-exception";

/**
 * Global error handler middleware for Hono
 */
export const errorHandler = async (err: Error, c: Context) => {
  console.error("Error:", err);

  // Handle HTTP exceptions
  if (err instanceof HTTPException) {
    return c.json(
      {
        error: err.message || "An error occurred",
        status: err.status,
      },
      err.status
    );
  }

  // Handle validation errors
  if (err.name === "ValidationError" || err.message.includes("validation")) {
    return c.json(
      {
        error: err.message || "Validation error",
        status: 400,
      },
      400
    );
  }

  // Handle database errors
  if (err.message.includes("UNIQUE constraint") || err.message.includes("duplicate")) {
    return c.json(
      {
        error: "Duplicate entry",
        status: 409,
      },
      409
    );
  }

  if (err.message.includes("NOT NULL constraint") || err.message.includes("required")) {
    return c.json(
      {
        error: "Missing required field",
        status: 400,
      },
      400
    );
  }

  // Handle foreign key constraint errors
  if (err.message.includes("FOREIGN KEY constraint") || err.message.includes("not found")) {
    return c.json(
      {
        error: "Referenced resource not found",
        status: 404,
      },
      404
    );
  }

  // Default error response
  // In production, hide error details; in development, show them
  const isProduction = c.env.BETTER_AUTH_URL?.includes("boundless") || false;
  return c.json(
    {
      error: isProduction ? "Internal server error" : err.message,
      status: 500,
    },
    500
  );
};

/**
 * Async error wrapper for route handlers
 */
export const asyncHandler = (fn: (c: Context) => Promise<Response>) => {
  return async (c: Context) => {
    try {
      return await fn(c);
    } catch (error) {
      return errorHandler(error as Error, c);
    }
  };
};

