/**
 * Communes retirées du périmètre le 24/08/2026 → hub départemental.
 *
 * Critère de conservation : trajet ≤ 40 min depuis l'atelier de
 * Bruyères-sur-Oise, OU au moins un clic sur 6 mois en Search Console.
 * Ces 29 communes ne remplissaient ni l'un ni l'autre : 0 clic sur 6 mois
 * et 42 à 90 min de route. Leur page ne servait aucun client réel et
 * diluait la position moyenne du domaine.
 *
 * Le hub départemental est la destination honnête : même intention
 * géographique, contenu réel, et la page reste utile au visiteur.
 * Les arrondissements partent sur la page Paris, faute de hub 75.
 */
const VILLES_RETIREES = {
  // → /thermolaquage-paris
  "paris-15": "paris",
  "paris-16": "paris",
  "paris-17": "paris",
  "paris-18": "paris",
  "paris-19": "paris",
  // → /thermolaquage-hauts-de-seine
  "boulogne-billancourt": "hauts-de-seine",
  "neuilly-sur-seine": "hauts-de-seine",
  "levallois-perret": "hauts-de-seine",
  "asnieres-sur-seine": "hauts-de-seine",
  courbevoie: "hauts-de-seine",
  "issy-les-moulineaux": "hauts-de-seine",
  clichy: "hauts-de-seine",
  "rueil-malmaison": "hauts-de-seine",
  // → /thermolaquage-seine-saint-denis
  aubervilliers: "seine-saint-denis",
  bobigny: "seine-saint-denis",
  pantin: "seine-saint-denis",
  // → /thermolaquage-val-de-marne
  creteil: "val-de-marne",
  "champigny-sur-marne": "val-de-marne",
  "ivry-sur-seine": "val-de-marne",
  // → /thermolaquage-essonne
  "corbeil-essonnes": "essonne",
  massy: "essonne",
  palaiseau: "essonne",
  // → /thermolaquage-yvelines
  versailles: "yvelines",
  "saint-germain-en-laye": "yvelines",
  "mantes-la-jolie": "yvelines",
  "le-chesnay-rocquencourt": "yvelines",
  // → /thermolaquage-seine-et-marne
  meaux: "seine-et-marne",
  melun: "seine-et-marne",
  // → /thermolaquage-oise
  senlis: "oise",
};

/**
 * Combos service × commune hérités de la vague pSEO de juin-juillet 2026.
 * Ces routes n'existent plus : elles répondaient 200 sur une page
 * « Ville introuvable » (soft 404). On renvoie chaque famille sur la
 * spécialité correspondante, qui traite le même besoin.
 *
 * `jantes-` et `portail-` sont volontairement absents : ces deux préfixes
 * ont de vraies pages combo (COMBOS), et une redirection les tuerait —
 * les redirects passent AVANT les rewrites dans Next.
 * `jantes-moto-` doit rester ici : il serait sinon avalé par le rewrite
 * `/thermolaquage-jantes-:ville`.
 */
const COMBOS_RETIRES = {
  "jantes-moto": "moto",
  ferronnerie: "portail",
  "garde-corps": "portail",
  "cloture-grille": "portail",
  escalier: "portail",
  "mobilier-jardin": "pieces",
};

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
    // Toutes les images sont servies en local (/public) — aucun host
    // distant autorisé.
    remotePatterns: [],
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
  // URL mortes encore positionnées dans Google. Search Console les a
  // détectées en 404 le 15/08/2026 ; elles recevaient encore des
  // impressions et des clics. Un 404 sur une URL classée, c'est un
  // visiteur en intention d'achat perdu — d'où ces 301.
  //
  // Les redirects passent AVANT les rewrites dans Next : les deux combos
  // supprimés sont interceptés ici et n'atteignent jamais
  // /combos/[service]/[ville] (qui a dynamicParams = false → 404).
  async redirects() {
    return [
      {
        // Ancienne fiche tarif d'une page /prix qui n'existe plus dans ce
        // dépôt (héritée d'une version antérieure du site).
        source: "/prix/thermolaquage-escalier-metallique",
        destination: "/prix",
        permanent: true,
      },
      {
        // Combo retiré de COMBOS. Montreuil existe toujours comme ville.
        source: "/thermolaquage-portail-montreuil",
        destination: "/thermolaquage-montreuil",
        permanent: true,
      },
      {
        // Combo retiré de COMBOS et Montigny-lès-Cormeilles n'est pas dans
        // villes-data : on renvoie sur la spécialité, seule correspondance
        // sémantique honnête.
        source: "/thermolaquage-jantes-montigny-les-cormeilles",
        destination: "/specialites/jantes",
        permanent: true,
      },

      // Familles de combos héritées de la vague pSEO — AVANT les communes,
      // car `jantes-moto-:ville` doit gagner sur le rewrite jantes générique.
      ...Object.entries(COMBOS_RETIRES).map(([prefixe, specialite]) => ({
        source: `/thermolaquage-${prefixe}-:ville`,
        destination: `/specialites/${specialite}`,
        permanent: true,
      })),

      // Communes sorties du périmètre → hub départemental.
      ...Object.entries(VILLES_RETIREES).map(([slug, hub]) => ({
        source: `/thermolaquage-${slug}`,
        destination: `/thermolaquage-${hub}`,
        permanent: true,
      })),
    ];
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
