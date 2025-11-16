import { drizzle as drizzleD1 } from "drizzle-orm/d1";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { neon, neonConfig } from "@neondatabase/serverless";
import * as schema from "./schema";

type DbEnv = {
  NEON_DATABASE_URL?: string;
  DB?: D1Database;
};

let cached: {
  url: string;
  db: ReturnType<typeof drizzleNeon>;
} | null = null;

export const getDb = (env: DbEnv) => {
  if (env.DB) {
    return drizzleD1(env.DB, { schema });
  }

  if (!env.NEON_DATABASE_URL) {
    throw new Error("NEON_DATABASE_URL is not set");
  }

  if (cached && cached.url === env.NEON_DATABASE_URL) {
    return cached.db;
  }

  neonConfig.poolQueryMode = true;
  const sql = neon(env.NEON_DATABASE_URL);
  const client = (query: string, params: unknown[] = [], options?: unknown) =>
    (sql as any).query(query, params, options);
  const db = drizzleNeon(client as any, { schema });
  cached = { url: env.NEON_DATABASE_URL, db };
  return db;
};

export type Database = ReturnType<typeof getDb>;
export { schema };

