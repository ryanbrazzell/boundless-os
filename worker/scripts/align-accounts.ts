import { neon } from "@neondatabase/serverless";

type Statement = {
  run: () => Promise<unknown>;
  description: string;
  ignoreCodes?: string[];
};

async function main() {
  const connectionString = process.env.NEON_DATABASE_URL;
  if (!connectionString) {
    console.error("NEON_DATABASE_URL is not set.");
    process.exit(1);
  }

  const sql = neon(connectionString);

  const statements: Statement[] = [
    {
      description: `ALTER TABLE "accounts" RENAME COLUMN "expires_at" TO "access_token_expires_at"`,
      run: () => sql`ALTER TABLE "accounts" RENAME COLUMN "expires_at" TO "access_token_expires_at"`,
      ignoreCodes: ["42703"],
    },
    {
      description: `ALTER TABLE "accounts" ALTER COLUMN "access_token_expires_at" TYPE timestamptz`,
      run: () =>
        sql`ALTER TABLE "accounts" ALTER COLUMN "access_token_expires_at" TYPE timestamptz USING ("access_token_expires_at")::timestamptz`,
    },
    {
      description: `ALTER TABLE "accounts" ADD COLUMN "id_token"`,
      run: () => sql`ALTER TABLE "accounts" ADD COLUMN "id_token" text`,
      ignoreCodes: ["42701"],
    },
    {
      description: `ALTER TABLE "accounts" ADD COLUMN "refresh_token_expires_at"`,
      run: () => sql`ALTER TABLE "accounts" ADD COLUMN "refresh_token_expires_at" timestamptz`,
      ignoreCodes: ["42701"],
    },
    {
      description: `ALTER TABLE "accounts" ADD COLUMN "scope"`,
      run: () => sql`ALTER TABLE "accounts" ADD COLUMN "scope" text`,
      ignoreCodes: ["42701"],
    },
    {
      description: `ALTER TABLE "accounts" ADD COLUMN "password"`,
      run: () => sql`ALTER TABLE "accounts" ADD COLUMN "password" text`,
      ignoreCodes: ["42701"],
    },
  ];

  for (const statement of statements) {
    try {
      await statement.run();
      console.log(`Executed: ${statement.description}`);
    } catch (error: any) {
      if (statement.ignoreCodes?.includes(error?.code)) {
        console.log(`Skipping statement (${error.code}): ${statement.description}`);
        continue;
      }
      console.error(`Failed statement: ${statement.description}`);
      throw error;
    }
  }

  console.log("Accounts table aligned with Better Auth schema.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

