import { NextResponse } from "next/server";
import {
  DEPARTMENT_NAMES,
  VILLES_FALLBACK,
  type DepartmentCode,
} from "@/lib/villes-data";
import { allDeptHubSlugs, DEPT_HUB_SLUG } from "@/lib/villes/departments";
import {
  PROJECTS_FALLBACK,
  getProjectSlug,
  getProjectImage,
} from "@/lib/realisations-data";

/**
 * Image sitemap (protocole Google) — déclare les visuels associés à
 * chaque page indexable. Aide à indexer dans Google Image search.
 *
 * Format : http://www.google.com/schemas/sitemap-image/1.1
 *
 * Stratégie :
 *  - Pour chaque page ville → image hero du dept correspondant
 *  - Pour chaque dept hub → image hero du dept
 *  - Pour chaque réalisation → image du projet (si fournie)
 */

const BASE = "https://www.azepoxy.fr";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

interface ImageEntry {
  loc: string;
  title?: string;
  caption?: string;
}

interface UrlEntry {
  loc: string;
  images: ImageEntry[];
}

function buildXml(urls: UrlEntry[]): string {
  const urlBlocks = urls
    .map((u) => {
      const images = u.images
        .map(
          (img) => `    <image:image>
      <image:loc>${escapeXml(img.loc)}</image:loc>${img.title ? `\n      <image:title>${escapeXml(img.title)}</image:title>` : ""}${img.caption ? `\n      <image:caption>${escapeXml(img.caption)}</image:caption>` : ""}
    </image:image>`,
        )
        .join("\n");
      return `  <url>
    <loc>${escapeXml(u.loc)}</loc>
${images}
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlBlocks}
</urlset>`;
}

export async function GET() {
  const urls: UrlEntry[] = [];

  // Dept hubs → leur image hero
  for (const code of Object.keys(DEPT_HUB_SLUG) as DepartmentCode[]) {
    const slug = DEPT_HUB_SLUG[code];
    if (!slug) continue;
    urls.push({
      loc: `${BASE}/thermolaquage-${slug}`,
      images: [
        {
          loc: `${BASE}/images/villes/${code}.webp`,
          title: `Thermolaquage en ${DEPARTMENT_NAMES[code]} — atelier AZ Époxy`,
          caption: `Image éditoriale représentative du département ${DEPARTMENT_NAMES[code]} (${code})`,
        },
      ],
    });
  }

  // Page /villes index → image 95 (home dept)
  urls.push({
    loc: `${BASE}/villes`,
    images: [
      {
        loc: `${BASE}/images/villes/95.webp`,
        title: "Toutes les villes desservies — AZ Époxy thermolaquage",
      },
    ],
  });

  // Villes individuelles → image du dept
  for (const v of VILLES_FALLBACK) {
    urls.push({
      loc: `${BASE}/thermolaquage-${v.slug}`,
      images: [
        {
          loc: `${BASE}/images/villes/${v.departmentCode}.webp`,
          title: `Thermolaquage à ${v.name} (${v.departmentCode}) — AZ Époxy`,
        },
      ],
    });
  }

  // Réalisations — chaque projet pointe sur sa page avec le VRAI fichier
  // image (mapping id → nom numéroté, via getProjectImage). On saute les
  // projets sans image plutôt que de référencer une URL morte.
  for (const p of PROJECTS_FALLBACK) {
    const slug = getProjectSlug(p);
    const imagePath = getProjectImage(p);
    if (!imagePath) continue;
    urls.push({
      loc: `${BASE}/realisations/${slug}`,
      images: [
        {
          loc: `${BASE}${imagePath}`,
          title: p.title,
          caption: p.description.slice(0, 200),
        },
      ],
    });
  }

  const xml = buildXml(urls);
  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control":
        "public, max-age=3600, s-maxage=86400, stale-while-revalidate=43200",
    },
  });
}
