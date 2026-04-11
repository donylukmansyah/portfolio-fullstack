import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local", override: true });

export default defineConfig({
  schema: "./db/schema",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DIRECT_URL || process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
