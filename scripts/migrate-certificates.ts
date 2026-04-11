import "dotenv/config";
import { config } from "dotenv";
import postgres from "postgres";

config({ path: ".env.local", override: true });

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!connectionString) {
  console.error("❌ DATABASE_URL or DIRECT_URL is not configured.");
  process.exit(1);
}

const sql = postgres(connectionString, { prepare: false });

async function main() {
  console.log("🚀 Running migration: contributions → certificates\n");

  // Drop the old contributions table
  console.log("  🗑️  Dropping contributions table...");
  await sql`DROP TABLE IF EXISTS contributions CASCADE`;

  // Create the new certificates table
  console.log("  🏗️  Creating certificates table...");
  await sql`
    CREATE TABLE IF NOT EXISTS certificates (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      issuer TEXT NOT NULL,
      image_url TEXT,
      image_public_id TEXT,
      is_featured BOOLEAN DEFAULT false,
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT now() NOT NULL,
      updated_at TIMESTAMP DEFAULT now() NOT NULL
    )
  `;

  console.log("\n✅ Migration completed successfully!");
  await sql.end();
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Migration error:", err);
  process.exit(1);
});
