/**
 * Apply pending Drizzle migrations to the database pointed at by
 * DATABASE_URL.
 *
 *   npx tsx scripts/db-migrate.ts
 *
 * Idempotent — Drizzle tracks applied migrations in a
 * `__drizzle_migrations` table.
 */
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }

  const sql = neon(url);
  const db = drizzle(sql);

  console.log("[db-migrate] applying pending migrations …");
  await migrate(db, { migrationsFolder: "./drizzle/migrations" });
  console.log("[db-migrate] done");
}

main().catch((err) => {
  console.error("[db-migrate] failed", err);
  process.exit(1);
});
