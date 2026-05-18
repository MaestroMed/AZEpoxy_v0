import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * Drizzle ORM client over the Neon HTTP driver. HTTP-only keeps us
 * edge-runtime compatible — no WebSocket, no connection pool to manage.
 *
 * Lazy init so a missing DATABASE_URL doesn't crash build-time module
 * evaluation (it only crashes when something actually runs a query).
 */

let _db: ReturnType<typeof createDb> | null = null;

function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Run `vercel env pull` (or set it manually) before using the database.",
    );
  }
  const sql = neon(url);
  return drizzle(sql, { schema });
}

export function getDb() {
  if (!_db) _db = createDb();
  return _db;
}

/** Re-export the schema so callers can import everything from one place. */
export * from "./schema";
