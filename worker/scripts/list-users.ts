import { neon } from "@neondatabase/serverless";

async function main() {
  const sql = neon(process.env.NEON_DATABASE_URL!);
  const rows = await sql`
    SELECT id, email, role, created_at
    FROM users
    ORDER BY created_at DESC
    LIMIT 20;
  `;
  console.log(rows);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


