#!/usr/bin/env node
/**
 * optimize-adapta.mjs
 *
 * Walks public/images/collections/adapta/ and converts every JPG to WebP
 * (800x800 max, quality 78). Deletes source JPGs. Replaces .jpg with .webp
 * in src/lib/data/adapta-collections.generated.ts.
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const IMG_DIR = path.join(ROOT, "public", "images", "collections", "adapta");
const GENERATED_TS = path.join(ROOT, "src", "lib", "data", "adapta-collections.generated.ts");

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...(await walk(p)));
    else files.push(p);
  }
  return files;
}

async function main() {
  const all = await walk(IMG_DIR);
  const jpgs = all.filter((f) => /\.jpe?g$/i.test(f));
  console.log(`▶ optimizing ${jpgs.length} JPGs → WebP`);

  let before = 0;
  let after = 0;
  let done = 0;
  for (const jpg of jpgs) {
    const webp = jpg.replace(/\.jpe?g$/i, ".webp");
    const stat = await fs.stat(jpg);
    before += stat.size;
    await sharp(jpg)
      .resize({ width: 800, height: 800, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(webp);
    const wstat = await fs.stat(webp);
    after += wstat.size;
    await fs.rm(jpg);
    done++;
    if (done % 20 === 0) console.log(`  ${done}/${jpgs.length}`);
  }

  console.log(`✓ ${done} files converted`);
  console.log(
    `  ${(before / 1024 / 1024).toFixed(1)} MB JPG → ${(after / 1024 / 1024).toFixed(1)} MB WebP (${Math.round(
      (1 - after / before) * 100,
    )}% smaller)`,
  );

  // ── Update generated TS: .jpg → .webp ────────────────────────────────
  const src = await fs.readFile(GENERATED_TS, "utf8");
  const out = src.replace(/\.jpg/g, ".webp");
  if (src !== out) {
    await fs.writeFile(GENERATED_TS, out, "utf8");
    console.log("✓ updated adapta-collections.generated.ts (.jpg → .webp)");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
