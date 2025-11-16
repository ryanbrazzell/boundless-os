import { createAuth } from "../src/auth/config";

const env = {
  NEON_DATABASE_URL: process.env.NEON_DATABASE_URL!,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET!,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || "http://localhost:8788",
};

const auth = createAuth(env);

const email = process.env.SEED_EMAIL || "founder@boundlessos.com";
const password = process.env.SEED_PASSWORD || "Boundless!123";
const name = process.env.SEED_NAME || "Boundless Founder";
const role = process.env.SEED_ROLE || "SUPER_ADMIN";

async function main() {
  const res = await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
      role,
    },
  });

  console.log("Seed user response:", res);
}

main().catch((err) => {
  console.error("Failed to seed user:", err);
  process.exit(1);
});

