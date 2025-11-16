import { defineConfig } from "drizzle-kit";

if (!process.env.NEON_DATABASE_URL) {
  console.warn("NEON_DATABASE_URL is not set. Drizzle may fail to connect.");
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.NEON_DATABASE_URL || "",
  },
  verbose: true,
  strict: true,
});

