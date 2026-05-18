import type { Config } from "drizzle-kit";
import { config as loadEnv } from "dotenv";

// Drizzle Kit runs outside Next.js' env loader — explicitly load
// .env.local so DATABASE_URL is available.
loadEnv({ path: ".env.local" });

/**
 * Drizzle Kit config — `npx drizzle-kit generate` to produce migrations,
 * `npx drizzle-kit push` to apply directly to the DB (dev convenience).
 *
 * DATABASE_URL is provisioned by the Vercel Neon integration and pulled
 * to .env.local via `vercel env pull`.
 */
export default {
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
  strict: true,
  verbose: true,
} satisfies Config;
