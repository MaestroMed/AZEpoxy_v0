import type { MetadataRoute } from "next";

/**
 * robots.txt — bloque les zones non publiques (admin, api, drafts) et
 * pointe les crawlers vers le sitemap. Le X-Robots-Tag noindex est aussi
 * appliqué via headers dans vercel.json pour la défense en profondeur.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/studio/"],
      },
    ],
    sitemap: [
      "https://www.azepoxy.fr/sitemap.xml",
      "https://www.azepoxy.fr/sitemap-images.xml",
    ],
    host: "https://www.azepoxy.fr",
  };
}
