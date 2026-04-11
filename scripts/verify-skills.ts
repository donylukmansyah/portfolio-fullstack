import "dotenv/config";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { skills } from "../db/schema/skills";
import { asc } from "drizzle-orm";

config({ path: ".env.local", override: true });

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const client = postgres(connectionString!, { prepare: false });
const db = drizzle({ client });

async function main() {
  const rows = await db.select({
    name: skills.name,
    description: skills.description,
    rating: skills.rating,
    isFeatured: skills.isFeatured,
  }).from(skills).orderBy(asc(skills.sortOrder));

  console.table(rows);
  console.log(`Total: ${rows.length} skills`);
  await client.end();
}

main();
