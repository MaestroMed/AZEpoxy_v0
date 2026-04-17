#!/usr/bin/env node
/**
 * build-adapta.mjs
 *
 * 1. Reads images from public/adapta/{patina,polaris,dichroic,sfera}/...
 * 2. Maps them to finish names (hardcoded from public/adapta/references.txt).
 * 3. Renames + copies to public/images/collections/adapta/<collection>/...
 * 4. Generates src/lib/data/adapta-collections.generated.ts.
 *
 * Windows-safe: uses a staging folder to avoid case-insensitive rename clashes.
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC_DIR = path.join(ROOT, "public", "adapta");
const OUT_DIR = path.join(ROOT, "public", "images", "collections", "adapta");
const GENERATED_TS = path.join(ROOT, "src", "lib", "data", "adapta-collections.generated.ts");

// ── Slugify ────────────────────────────────────────────────────────────
function slugify(s) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip combining marks
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/\./g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ── Reference data (from public/adapta/references.txt) ─────────────────
const PATINA_SUBS = [
  {
    id: "plain-oxide-patina",
    name: "Plain Oxide Patina",
    description: "Codes RAL revisités en finition oxyde corten authentique.",
    folder: "Plain Oxide Patina",
    names: [
      "RT-8283-I", "RT-8281-I", "RT-8286-I", "RT-8102-I",
      "RT-8107-I", "RF-8284-XW", "RT-1702-I", "RF-6296-XW",
      "DF-1536-XW", "RF-6297-XW", "RT-6302-I", "RF-6300-IW",
    ],
  },
  {
    id: "tile-patina",
    name: "Tile Patina",
    description: "Effets argileux et érodés inspirés des terres cuites millénaires.",
    folder: "Tile Patina",
    names: [
      "GENTLE EROSION", "RESILIENT CLAY", "LATENT HERMITS", "LOST FOOTPRINTS",
      "SERENE SAFARI", "GILT SUNSET", "PRISTINE COVES", "TOP HAND-CRAFTING",
      "UNSPOILT BEACHES", "DUNE PLATEAU", "SOFT PEAT", "WARM TIMANFAYA",
    ],
  },
  {
    id: "oxide-patina-i",
    name: "Oxide Patina I",
    description: "Premier opus — tonalités feu, terre et lave figée.",
    folder: "Oxide Patina 1",
    names: [
      "LAND OF FIRE", "LETHARGIC SAVANNAH", "SPICY CRATER", "POWERFUL TWISTER",
      "EFFERVESCENT EARTH", "GLOWING SLURRY", "DESERT MIST", "WILDLIFE SANCTUARY",
      "CROWDED OASIS", "MUSICAL WATERFALL", "MAGNIFICIENT SHORE", "BITTER WATER",
    ],
  },
  {
    id: "oxide-patina-ii",
    name: "Oxide Patina II",
    description: "Second opus — nuances vertes, cuivrées et minérales.",
    folder: "Oxide Patina 2",
    names: [
      "TURQUOISE COPPER", "UNTOUCHED STEPPES", "QUIET PATAGONIA", "BRIGHT MOSS",
      "LUSH VEGETATION", "TEMPERATE RAINFOREST", "OCEAN BREEZE", "TOUGH EVERGLADES",
      "SUSPICIOUS MARSH", "GOLDEN SOIL", "LATE AFTERNOON", "SILENT ICE",
    ],
  },
  {
    id: "soft-patina",
    name: "Soft Patina",
    description: "Douceur poudrée — patines feutrées et voilées.",
    folder: "Soft Patina",
    names: [
      "CALM CAPPADOCIA", "FROZEN STREAMS", "HASTY WIND", "NORTHERN THUNDER",
      "COLD CLIFFS", "WAVES CRASHING", "FRINGING REEFS", "SUNNY WETLAND",
      "WILD AMAZON", "OUTLANDISH TIMBUKTU", "MYSTERIOUS BERMUDAS", "MANGROVE SWAMP",
    ],
  },
  {
    id: "crystal-patina",
    name: "Crystal Patina",
    description: "Effet cristallin translucide sur base métallique.",
    folder: "Crystal Patina",
    names: [
      "RW-9261-XW", "RW-9006-XW", "RW-9007-XW", "RW-7100-XW",
      "RW-1703-XW", "RW-8285-XW", "RW-6301", "RW-1170-XW",
      "RW-3197", "RW-6289", "RW-6303-XW", "RW-5228",
    ],
  },
];

const POLARIS_SUBS = [
  {
    id: "chamaleon",
    name: "Chamaleon",
    description: "Métalliques caméléons — reflets qui changent selon l'angle.",
    folder: "Chamaleon",
    names: ["RB-7182-I", "RB-5112-I", "RB-1101-I", "RB-2108-I", "RB-6123-I", "RB-7183-I"],
  },
  {
    id: "sculptur",
    name: "Sculptur",
    description: "Granulations métalliques — grain sculpté haute définition.",
    folder: "Sculptur",
    names: ["RL-1501-XW", "RL-1502-XW", "RL-3104-XW", "RL-5106-XW", "RL-6108-XW", "RL-7117-XW"],
  },
  {
    id: "boreal",
    name: "Boreal",
    description: "Effets aurore boréale — profondeurs iridescentes.",
    folder: "Boreal",
    names: ["RH-5107", "RH-6127", "RH-7184", "RH-1515"],
  },
  {
    id: "orion",
    name: "Orion",
    description: "Métaux sombres — finitions brossées constellation.",
    folder: "Orion",
    names: [
      "RX-7188-XW", "RX-7190-XW", "RX-1514-XW", "RX-4104-XW", "RX-5114-XW",
      "RX-6125-XW", "RX-7177-XW", "RX-8121-XW", "RX-2107-XW",
    ],
  },
  {
    id: "pegassus",
    name: "Pegassus",
    description: "Gris et neutres métalliques à fort caractère.",
    folder: "Pegassus",
    names: ["RL-7193-X", "RL-7125-X", "RL-9939-X", "RL-9940-X", "RL-9941-X"],
  },
  {
    id: "phoenix",
    name: "Phoenix",
    description: "Métalliques haute brillance aux reflets ardents.",
    folder: "Phoenix",
    names: [
      "HX-7129-X", "HX-7177-X", "HX-7178-X", "HX-7159-X", "HF-7164-X",
      "HF-7188-X", "HX-7210-X", "HX-1531-X", "HX-8116-X",
    ],
  },
  {
    id: "hydra",
    name: "Hydra",
    description: "Nuances de gris métalliques structurés.",
    folder: "Hydra",
    names: [
      "RX-9006-X", "RX-9007-X", "RX-7167-X", "RX-7141-TZ",
      "RX-7100-TZ", "RX-7191-X", "RX-7168-X",
    ],
  },
];

// Dichroic — 24 finishes, all "X & Y" format (architectural dichroic)
const DICHROIC_NAMES = [
  "D & 500", "ODD & EVEN", "BONNIE & CLYDE", "HEADS & TAILS",
  "SKY & DREAMS", "LUCKY & UNLUCKY", "SIDE & SIDE", "EBONY & IVORY",
  "UP & DOWN", "GOLD & SILVER", "GARUDA & ADURAG", "TANTIMA & AMITANT",
  "RED & FIRE", "YIN & YANG", "CRAZY & HORSE", "PIXIE & DIXIE",
  "QUEENS & KINGS", "EAST & WEST", "WINNERS & LOSERS", "LAUREL & HARDY",
  "GUNS & ROSES", "DR. JEKYLL & MR. HIDE", "ON & OFF", "ROCK & ROLL",
];

// Sfera — 13 finishes (Spanish names)
const SFERA_NAMES = [
  "azul caballa", "negro cosmos", "plata cosmos", "rojo fuego", "azul anod.",
  "cobre anod.", "verde anod.", "latón anod.", "acero anod.", "bronce anod.",
  "gris plata anod.", "plata anod.", "azul ártico",
];

// ── File listing helpers ────────────────────────────────────────────────
async function listImages(absDir) {
  const files = await fs.readdir(absDir);
  return files
    .filter((f) => /\.jpe?g$/i.test(f))
    .filter((f) => !/\(\d+\)\.jpe?g$/i.test(f)) // drop "name (1).jpg" dupes
    .sort((a, b) => {
      const na = parseInt(a.match(/^\d+/)?.[0] ?? "0", 10);
      const nb = parseInt(b.match(/^\d+/)?.[0] ?? "0", 10);
      return na - nb;
    });
}

async function ensureDir(d) {
  await fs.mkdir(d, { recursive: true });
}

async function rmrfSilent(d) {
  try {
    await fs.rm(d, { recursive: true, force: true });
  } catch {
    /* ignore */
  }
}

// ── Copy one sub-collection ─────────────────────────────────────────────
async function processSub(collection, sub) {
  const srcDir = path.join(SRC_DIR, collection, sub.folder);
  const dstDir = path.join(OUT_DIR, collection, sub.id);
  await ensureDir(dstDir);

  const files = await listImages(srcDir);
  const used = files.slice(0, sub.names.length); // drop extras
  const finishes = [];

  for (let i = 0; i < sub.names.length; i++) {
    const name = sub.names[i];
    const slug = slugify(name);
    const srcFile = used[i];
    let imageUrl;
    if (srcFile) {
      const dstFile = path.join(dstDir, `${slug}.jpg`);
      await fs.copyFile(path.join(srcDir, srcFile), dstFile);
      imageUrl = `/images/collections/adapta/${collection}/${sub.id}/${slug}.jpg`;
    }
    finishes.push({ id: slug, name, imageUrl });
  }

  if (files.length > sub.names.length) {
    const extra = files.length - sub.names.length;
    console.warn(`  ! ${sub.folder}: ${extra} image(s) en trop (ignorée)`);
  }
  if (files.length < sub.names.length) {
    const missing = sub.names.length - files.length;
    console.warn(`  ! ${sub.folder}: ${missing} finition(s) sans image`);
  }

  return { id: sub.id, name: sub.name, description: sub.description, finishes };
}

// ── Flat collection (dichroic, sfera) ───────────────────────────────────
async function processFlat(collection, names) {
  const srcDir = path.join(SRC_DIR, collection);
  const dstDir = path.join(OUT_DIR, collection);
  await ensureDir(dstDir);

  const files = await listImages(srcDir);
  const used = files.slice(0, names.length);
  const finishes = [];

  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    const slug = slugify(name);
    const srcFile = used[i];
    let imageUrl;
    if (srcFile) {
      const dstFile = path.join(dstDir, `${slug}.jpg`);
      await fs.copyFile(path.join(srcDir, srcFile), dstFile);
      imageUrl = `/images/collections/adapta/${collection}/${slug}.jpg`;
    }
    finishes.push({ id: slug, name, imageUrl });
  }
  if (files.length < names.length) {
    console.warn(`  ! ${collection}: ${names.length - files.length} finition(s) sans image`);
  }
  return finishes;
}

// ── Emit TS ─────────────────────────────────────────────────────────────
function emitTs({ patina, polaris, dichroic, sfera }) {
  const j = (x) => JSON.stringify(x, null, 2);
  return `/**
 * AUTO-GENERATED by scripts/build-adapta.mjs
 * Do not edit by hand. Run \`node scripts/build-adapta.mjs && node scripts/optimize-adapta.mjs\`.
 */

export interface AdaptaFinish {
  id: string;
  name: string;
  imageUrl?: string;
}

export interface AdaptaSub {
  id: string;
  name: string;
  description?: string;
  finishes: AdaptaFinish[];
}

export const ADAPTA_PATINA_SUBS: AdaptaSub[] = ${j(patina)};

export const ADAPTA_POLARIS_SUBS: AdaptaSub[] = ${j(polaris)};

export const ADAPTA_DICHROIC_FINISHES: AdaptaFinish[] = ${j(dichroic)};

export const ADAPTA_SFERA_FINISHES: AdaptaFinish[] = ${j(sfera)};
`;
}

// ── Main ────────────────────────────────────────────────────────────────
async function main() {
  console.log("▶ build-adapta — cleaning output dir");
  await rmrfSilent(OUT_DIR);
  await ensureDir(OUT_DIR);

  console.log("▶ patina");
  const patina = [];
  for (const sub of PATINA_SUBS) {
    console.log(`  • ${sub.folder}`);
    patina.push(await processSub("patina", sub));
  }

  console.log("▶ polaris");
  const polaris = [];
  for (const sub of POLARIS_SUBS) {
    console.log(`  • ${sub.folder}`);
    polaris.push(await processSub("polaris", sub));
  }

  console.log("▶ dichroic");
  const dichroic = await processFlat("dichroic", DICHROIC_NAMES);

  console.log("▶ sfera");
  const sfera = await processFlat("sfera", SFERA_NAMES);

  await ensureDir(path.dirname(GENERATED_TS));
  await fs.writeFile(GENERATED_TS, emitTs({ patina, polaris, dichroic, sfera }), "utf8");
  console.log(`▶ wrote ${path.relative(ROOT, GENERATED_TS)}`);
  console.log("✓ done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
