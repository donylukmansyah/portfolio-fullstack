import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

declare global {
  var postgresClient: postgres.Sql | undefined;
}

function createPostgresClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.");
  }

  return postgres(connectionString, { prepare: false });
}

const client = globalThis.postgresClient ?? createPostgresClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.postgresClient = client;
}

export const db = drizzle({ client });
