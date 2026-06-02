/**
 * One-shot asset processing post-audit :
 *  1. og-image.jpg site-wide (1200×630, depuis l'OG brandée Higgsfield)
 *  2. /images/villes/og/75.webp (OG Paris manquant) depuis le hero 75
 *  3. Recompression des heros villes lourds (>250KB) à q72
 *
 * Lancé manuellement : node scripts/process-assets.mjs
 */
import sharp from "sharp";
import { statSync, existsSync, readFileSync, writeFileSync } from "node:fs";

const KB = (p) => (existsSync(p) ? Math.round(statSync(p).size / 1024) : "—");

async function main() {
  // 1. og-image.jpg — 1200×630 cover, qualité 82
  await sharp(".asset-tmp/og-brand-raw.jpeg")
    .resize(1200, 630, { fit: "cover", position: "centre" })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile("public/og-image.jpg");
  console.log(`✓ public/og-image.jpg → ${KB("public/og-image.jpg")} KB (1200×630)`);

  // 2. OG Paris manquant — depuis le hero 75 (Paris rooftops), 1200×630
  await sharp("public/images/villes/75.webp")
    .resize(1200, 630, { fit: "cover", position: "centre" })
    .webp({ quality: 80 })
    .toFile("public/images/villes/og/75.webp");
  console.log(`✓ public/images/villes/og/75.webp → ${KB("public/images/villes/og/75.webp")} KB`);

  // 3. Recompression des heros villes lourds. Cible <250KB.
  //    Max-width 1600 (largeur d'affichage hero max) + q72.
  const heavy = ["78", "77", "91", "92", "75"];
  for (const code of heavy) {
    const src = `public/images/villes/${code}.webp`;
    if (!existsSync(src)) continue;
    const before = KB(src);
    // Lire les bytes en mémoire AVANT toute écriture pour éviter le
    // verrou read+write sur le même path (Windows).
    const inputBytes = readFileSync(src);
    const out = await sharp(inputBytes)
      .resize(1600, null, { withoutEnlargement: true })
      .webp({ quality: 72 })
      .toBuffer();
    writeFileSync(src, out);
    console.log(`✓ villes/${code}.webp → ${before} KB → ${KB(src)} KB`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
