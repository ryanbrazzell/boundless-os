import { neon } from "@neondatabase/serverless";

async function main() {
  const sql = neon(process.env.NEON_DATABASE_URL!);
  const rows = await sql`
    SELECT table_schema, column_name, data_type
    FROM information_schema.columns
    WHERE table_name = 'accounts'
    ORDER BY table_schema, column_name;
  `;
  console.log(rows);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

