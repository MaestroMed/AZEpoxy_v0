import {
  DEPARTMENT_NAMES,
  VILLES_FALLBACK,
  type DepartmentCode,
  type Ville,
} from "@/lib/villes-data";

/**
 * Slugs URL des départements pour les pages hub
 * `/thermolaquage-{slug}` (rewrite Next vers `/villes/{slug}`).
 *
 * On exclut 75 Paris car la ville `/thermolaquage-paris` existe déjà
 * et couvre la capitale comme une "ville".
 */
export const DEPT_HUB_SLUG: Partial<Record<DepartmentCode, string>> = {
  "95": "val-d-oise",
  "92": "hauts-de-seine",
  "93": "seine-saint-denis",
  "94": "val-de-marne",
  "78": "yvelines",
  "91": "essonne",
  "77": "seine-et-marne",
  "60": "oise",
};

/** Slug → code (lookup inverse). */
export const SLUG_TO_DEPT: Record<string, DepartmentCode> = Object.entries(
  DEPT_HUB_SLUG,
).reduce(
  (acc, [code, slug]) => {
    if (slug) acc[slug] = code as DepartmentCode;
    return acc;
  },
  {} as Record<string, DepartmentCode>,
);

/** Toutes les villes d'un département + count. */
export function getDeptOverview(code: DepartmentCode): {
  code: DepartmentCode;
  name: string;
  slug: string;
  villes: Ville[];
  count: number;
  minDistanceMin: number;
  maxDistanceMin: number;
  topIndustries: string[];
} {
  const villes = VILLES_FALLBACK.filter((v) => v.departmentCode === code);
  const driveMins = villes.map((v) => v.driveTimeMin);
  const industryCounts = new Map<string, number>();
  for (const v of villes) {
    for (const i of v.industries ?? []) {
      industryCounts.set(i, (industryCounts.get(i) ?? 0) + 1);
    }
  }
  const topIndustries = Array.from(industryCounts.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([i]) => i);

  return {
    code,
    name: DEPARTMENT_NAMES[code],
    slug: DEPT_HUB_SLUG[code] ?? code,
    villes,
    count: villes.length,
    minDistanceMin: Math.min(...driveMins, 9999),
    maxDistanceMin: Math.max(...driveMins, 0),
    topIndustries,
  };
}

export function allDeptHubSlugs(): string[] {
  return Object.values(DEPT_HUB_SLUG).filter((s): s is string => Boolean(s));
}
