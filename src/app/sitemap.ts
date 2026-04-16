import type { MetadataRoute } from "next";
import { VILLES } from "@/lib/villes-data";
import { BLOG_ARTICLES } from "@/lib/blog-data";

const BASE = "https://www.azepoxy.fr";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/services/thermolaquage`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/services/sablage`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/services/metallisation`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/services/finitions`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/couleurs-ral`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/couleurs-ral/patina`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/couleurs-ral/polaris`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/couleurs-ral/dichroic`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/couleurs-ral/sfera`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/specialites/jantes`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/specialites/moto`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/specialites/voiture`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/specialites/pieces`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/realisations`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/a-propos`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${BASE}/devis`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${BASE}/rendez-vous`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE}/mentions-legales`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/cgv`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/confidentialite`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const villePages: MetadataRoute.Sitemap = VILLES.map((v) => ({
    url: `${BASE}/thermolaquage-${v.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const blogPages: MetadataRoute.Sitemap = BLOG_ARTICLES.map((a) => ({
    url: `${BASE}/blog/${a.slug}`,
    lastModified: new Date(a.date),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...villePages, ...blogPages];
}
