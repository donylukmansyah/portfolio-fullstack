import "dotenv/config";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { skills } from "../db/schema/skills";
import { seedSkills } from "../db/seed-data/skills";
import { eq } from "drizzle-orm";

// Load .env.local (overrides .env)
config({ path: ".env.local", override: true });

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ DATABASE_URL or DIRECT_URL is not configured.");
  process.exit(1);
}

const client = postgres(connectionString, { prepare: false });
const db = drizzle({ client });

async function main() {
  console.log("🚀 Starting skills seeding...\n");

  // First, clear existing skills
  console.log("🗑️  Clearing existing skills...");
  await db.delete(skills);

  // Insert all skills with Indonesian descriptions
  let sortOrder = 0;
  for (const skill of seedSkills) {
    sortOrder++;
    await db.insert(skills).values({
      name: skill.name,
      description: skill.description,
      rating: skill.rating,
      iconKey: skill.iconKey,
      isFeatured: skill.isFeatured ?? false,
      sortOrder,
    });
    console.log(`  ✅ ${skill.name} — ⭐${skill.rating} ${skill.isFeatured ? "(featured)" : ""}`);
  }

  console.log(`\n🎉 Successfully seeded ${seedSkills.length} skills with Indonesian descriptions!`);
  
  // Close the connection
  await client.end();
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Error seeding skills:", err);
  process.exit(1);
});
