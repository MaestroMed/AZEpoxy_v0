/**
 * Smoke test: every page.tsx under src/app must export metadata or
 * generateMetadata. Run as part of CI or `npm run check:metadata` before
 * shipping a refactor.
 *
 * Usage: npx tsx scripts/check-metadata.ts
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = join(process.cwd(), "src", "app");

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      out.push(...walk(full));
    } else if (entry === "page.tsx" || entry === "page.ts") {
      out.push(full);
    }
  }
  return out;
}

const pages = walk(ROOT);
const missing: string[] = [];

for (const p of pages) {
  const src = readFileSync(p, "utf8");
  const hasMetadata =
    /export\s+const\s+metadata\b/.test(src) ||
    /export\s+async\s+function\s+generateMetadata\b/.test(src) ||
    /export\s+function\s+generateMetadata\b/.test(src);
  if (!hasMetadata) missing.push(relative(process.cwd(), p));
}

if (missing.length > 0) {


  console.error(
    `\u274c  Missing metadata in ${missing.length} page(s):\n - ` +
      missing.join("\n - ")
  );
  process.exit(1);
}



console.log(`\u2705  All ${pages.length} pages export metadata.`);
