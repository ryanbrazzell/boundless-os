import { createAuth } from "../src/auth/config";

const env = {
  NEON_DATABASE_URL: process.env.NEON_DATABASE_URL!,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET!,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || "http://localhost:8788",
};

const auth = createAuth(env);
console.log("Auth keys:", Object.keys(auth));
console.log("API keys:", Object.keys(auth.api ?? {}));

