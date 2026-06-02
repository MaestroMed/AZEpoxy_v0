import "server-only";
import { PROJECTS_FALLBACK, type Project } from "@/lib/realisations-data";

/**
 * Accès serveur au portfolio : réalisations gérées en base (admin) si
 * présentes, sinon le dataset statique. Isolé dans un module `server-only`
 * pour ne jamais embarquer le code DB (drizzle) dans un bundle client —
 * `realisations-data.ts` reste pur/partagé. Tant que la table est vide ou
 * que DATABASE_URL est absent, le comportement est identique au static.
 */
export async function getProjects(): Promise<Project[]> {
  if (process.env.DATABASE_URL) {
    try {
      const { getPublicRealisations } = await import("@/lib/admin/content");
      const rows = await getPublicRealisations();
      if (rows.length > 0) {
        return rows.map((r, i): Project => ({
          id: 100_000 + i,
          title: r.title,
          category: r.category,
          description: r.description ?? "",
          colors: [],
          featured: r.featured,
          image: r.image ?? undefined,
        }));
      }
    } catch {
      // DB indisponible → fallback statique silencieux.
    }
  }
  return PROJECTS_FALLBACK;
}
