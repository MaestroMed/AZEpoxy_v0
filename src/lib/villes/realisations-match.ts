import {
  PROJECTS_FALLBACK,
  getProjectSlug,
  type Project,
  type ProjectCategoryKey,
} from "@/lib/realisations-data";
import type { Industry, Ville } from "@/lib/villes-data";

/**
 * Match les réalisations existantes au profil économique d'une ville.
 *
 * Les Projects ne sont pas géolocalisés, donc on ne peut pas filtrer par
 * distance. À la place : on score chaque projet selon la pertinence avec
 * les `industries[]` de la ville, et on retourne les N meilleurs.
 *
 * Ex : Cergy a industries=["metallerie","promotion","architectes",
 * "particuliers"] → on priorise portails / mobilier / industriel,
 * dévalorise jantes/moto. Carrossier-friendly ville (Argenteuil avec
 * "automobile") → priorise jantes/moto.
 */

const INDUSTRY_TO_CATEGORY: Record<Industry, ProjectCategoryKey[]> = {
  metallerie: ["portail", "mobilier", "industriel"],
  ferronnerie: ["portail", "mobilier"],
  automobile: ["jantes"],
  moto: ["moto"],
  industrie: ["industriel"],
  promotion: ["portail", "mobilier", "industriel"],
  architectes: ["mobilier", "portail"],
  "mobilier-urbain": ["mobilier", "industriel"],
  particuliers: ["jantes", "portail", "mobilier"],
  chaudronnerie: ["industriel"],
  renovation: ["portail", "mobilier", "industriel"],
};

function scoreProject(project: Project, ville: Ville): number {
  const industries = ville.industries ?? [];
  if (industries.length === 0) {
    // Pas d'industries déclarées → on privilégie les featured
    return project.featured ? 10 : 5;
  }

  let score = project.featured ? 3 : 0;
  for (const industry of industries) {
    const preferredCategories = INDUSTRY_TO_CATEGORY[industry] ?? [];
    if (preferredCategories.includes(project.category)) {
      // Premier match = +10, suivants décroissants
      score += 10 - preferredCategories.indexOf(project.category) * 2;
    }
  }
  return score;
}

export function getRelevantRealisationsForVille(
  ville: Ville,
  limit = 3,
): Project[] {
  return [...PROJECTS_FALLBACK]
    .map((p) => ({ project: p, score: scoreProject(p, ville) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ project }) => project);
}

export { getProjectSlug };
