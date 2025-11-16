import { neon } from "@neondatabase/serverless";

async function main() {
  const sql = neon(process.env.NEON_DATABASE_URL!);
  await sql`ALTER TABLE "accounts" ALTER COLUMN "expires_at" SET DATA TYPE timestamptz USING to_timestamp("expires_at")`;
  await sql`ALTER TABLE "accounts" ALTER COLUMN "created_at" SET DATA TYPE timestamptz USING to_timestamp("created_at")`;
  await sql`ALTER TABLE "accounts" ALTER COLUMN "created_at" SET DEFAULT now()`;
  await sql`ALTER TABLE "accounts" ALTER COLUMN "updated_at" SET DATA TYPE timestamptz USING to_timestamp("updated_at")`;
  await sql`ALTER TABLE "accounts" ALTER COLUMN "updated_at" SET DEFAULT now()`;

  await sql`ALTER TABLE "users" ALTER COLUMN "created_at" SET DATA TYPE timestamptz USING to_timestamp("created_at")`;
  await sql`ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT now()`;
  await sql`ALTER TABLE "users" ALTER COLUMN "updated_at" SET DATA TYPE timestamptz USING to_timestamp("updated_at")`;
  await sql`ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT now()`;

  await sql`ALTER TABLE "sessions" ALTER COLUMN "expires_at" SET DATA TYPE timestamptz USING to_timestamp("expires_at")`;
  await sql`ALTER TABLE "sessions" ALTER COLUMN "created_at" SET DATA TYPE timestamptz USING to_timestamp("created_at")`;
  await sql`ALTER TABLE "sessions" ALTER COLUMN "created_at" SET DEFAULT now()`;
  await sql`ALTER TABLE "sessions" ALTER COLUMN "updated_at" SET DATA TYPE timestamptz USING to_timestamp("updated_at")`;
  await sql`ALTER TABLE "sessions" ALTER COLUMN "updated_at" SET DEFAULT now()`;

  await sql`ALTER TABLE "verifications" ALTER COLUMN "expires_at" SET DATA TYPE timestamptz USING to_timestamp("expires_at")`;
  await sql`ALTER TABLE "verifications" ALTER COLUMN "created_at" SET DATA TYPE timestamptz USING to_timestamp("created_at")`;
  await sql`ALTER TABLE "verifications" ALTER COLUMN "created_at" SET DEFAULT now()`;
  await sql`ALTER TABLE "verifications" ALTER COLUMN "updated_at" SET DATA TYPE timestamptz USING to_timestamp("updated_at")`;
  await sql`ALTER TABLE "verifications" ALTER COLUMN "updated_at" SET DEFAULT now()`;

  console.log("Updated auth-related timestamp columns to timestamptz.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

