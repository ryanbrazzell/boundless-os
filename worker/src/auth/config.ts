import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "../db";
import { users, sessions, accounts, verifications } from "../db/schema";

export interface AuthEnv {
  NEON_DATABASE_URL?: string;
  DB?: D1Database;
  BETTER_AUTH_SECRET?: string;
  BETTER_AUTH_URL?: string;
}

export const createAuth = (env: AuthEnv) => {
  const db = getDb(env);
  const provider = env.DB ? "sqlite" : "pg";

  return betterAuth({
    baseURL: env.BETTER_AUTH_URL ?? "http://localhost:8788",
    secret: env.BETTER_AUTH_SECRET ?? "dev-secret-change-me",
    database: drizzleAdapter(db, {
      provider,
      schema: {
        user: users,
        session: sessions,
        account: accounts,
        verification: verifications,
      },
    }),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    session: {
      expiresIn: 60 * 60 * 24 * 30, // 30 days
      cookieCache: {
        enabled: true,
        maxAge: 60 * 5, // 5 minutes
      },
    },
    user: {
      additionalFields: {
        role: {
          type: "string",
          required: true,
        },
        isActive: {
          type: "boolean",
          required: true,
          defaultValue: true,
        },
      },
    },
    // Advanced session configuration
    advanced: {
      cookieOptions: {
        httpOnly: true,
        secure: env.BETTER_AUTH_URL?.startsWith("https://") ?? false,
        sameSite: "lax", // Changed from default "strict" to allow cross-site navigation with cookies
        path: "/",
      },
    },
  });
};

