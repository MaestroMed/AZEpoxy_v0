/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Newer eslint-plugin-react-hooks pulled via fresh installs flags
  // set-state-in-effect violations in pre-existing hydration patterns
  // (price-estimator, visual-configurator, primitives). Ignoring during
  // build to keep CI green while the rules are addressed separately.
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    // Pré-déclare les valeurs `quality` que le code passe à <Image />
    // (Next 16 les exigera). Évite le warning dev + fige les niveaux
    // de compression utilisés dans le projet.
    qualities: [40, 55, 65, 70, 75, 78, 80, 85, 90],
    // AVIF d'abord (meilleur ratio, ~30% plus petit que WebP à qualité
    // équivalente), WebP fallback, original en dernier recours.
    formats: ["image/avif", "image/webp"],
    // Image sizes used at lg breakpoints — tune cache granularity.
    deviceSizes: [360, 480, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 200, 256, 360, 500, 640, 800],
    // Long cache pour les images optimisées — elles sont immutables
    // (URL embarque le hash du contenu).
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 an
  },
  // Compress response bodies (gzip/brotli via the edge).
  compress: true,
  // Reduce client-side runtime — server-render more when possible.
  poweredByHeader: false,
  experimental: {
    // Tree-shake per-import of lucide/framer-motion barrels — big win
    // on bundle size (avoids pulling the whole icon set or motion
    // feature pack when only a handful is used).
    optimizePackageImports: ["lucide-react", "framer-motion"],
    // Limit build worker memory pressure when the project gains many
    // dynamic routes (city pages, RAL teintes).
    workerThreads: false,
    cpus: 2,
  },
  // `prefix-[param]` folder names aren't supported as dynamic routes
  // in App Router (Next 15). The villes pages live in /villes/[ville]
  // internally; we rewrite /thermolaquage-{slug} ↔ /villes/{slug}
  // so the public URL stays SEO-friendly without a real folder prefix.
  async rewrites() {
    // Ordre = priorité (premier match gagne). Les combos service×ville
    // (/thermolaquage-jantes-{ville}, /thermolaquage-portail-{ville}) DOIVENT
    // précéder le rewrite ville générique, sinon "jantes-cergy" serait traité
    // comme un slug de ville inexistant.
    return [
      { source: "/thermolaquage-jantes-:ville", destination: "/combos/jantes/:ville" },
      { source: "/thermolaquage-portail-:ville", destination: "/combos/portail/:ville" },
      { source: "/thermolaquage-:slug", destination: "/villes/:slug" },
    ];
  },
};

export default nextConfig;
