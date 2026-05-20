import { VILLES_FALLBACK, getVilles } from "../src/lib/villes-data";

async function main() {
  console.log("Count:", VILLES_FALLBACK.length);
  console.log("First slug:", VILLES_FALLBACK[0]?.slug);
  const all = await getVilles();
  console.log("getVilles count:", all.length);
  console.log("cergy?", all.find((v) => v.slug === "cergy")?.name);
  console.log("nanterre?", all.find((v) => v.slug === "nanterre")?.name);
}

main().catch(console.error);
