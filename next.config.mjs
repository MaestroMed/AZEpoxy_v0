/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.sanity.io" },
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
  },
  // Sanity Studio (and next-sanity) call React 19.2 hooks like useEffectEvent
  // that aren't exposed by Next's bundled "react-builtin". Letting Next
  // transpile them forces resolution against the project's own React.
  transpilePackages: ["sanity", "next-sanity", "@sanity/vision"],
};

export default nextConfig;
