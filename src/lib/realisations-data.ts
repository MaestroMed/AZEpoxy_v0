/**
 * Portfolio de réalisations — AZ Époxy.
 * 16 projets répartis sur 5 catégories.
 */

export interface Project {
  id: number;
  title: string;
  category: "jantes" | "moto" | "mobilier" | "industriel" | "portail";
  description: string;
  colors: string[];
  featured: boolean;
}

export const PROJECT_CATEGORIES = [
  { key: "all", label: "Tous" },
  { key: "jantes", label: "Jantes" },
  { key: "moto", label: "Moto" },
  { key: "mobilier", label: "Mobilier" },
  { key: "industriel", label: "Industriel" },
  { key: "portail", label: "Portail" },
] as const;

export type ProjectCategoryKey = (typeof PROJECT_CATEGORIES)[number]["key"];

export const PROJECTS_FALLBACK: Project[] = [
  // ── Jantes (4) ───────────────────────────────────────────────────────
  {
    id: 1,
    title: "Jantes BMW M4 — Noir satiné",
    category: "jantes",
    description:
      "Rénovation complète de 4 jantes 19 pouces BMW M4 Competition. Sablage intégral, primaire anti-corrosion et thermolaquage noir satiné pour un rendu sobre et sportif.",
    colors: ["RAL 9005"],
    featured: true,
  },
  {
    id: 2,
    title: "Jantes Audi RS3 — Gris graphite brillant",
    category: "jantes",
    description:
      "Personnalisation de jantes Audi RS3 en gris graphite brillant. Le client souhaitait un ton plus foncé que l'aluminium d'origine tout en conservant un aspect métallisé élégant.",
    colors: ["RAL 7024"],
    featured: true,
  },
  {
    id: 3,
    title: "Jantes Mercedes Classe C — Blanc pur",
    category: "jantes",
    description:
      "Thermolaquage blanc pur sur jantes Mercedes 18 pouces pour un look épuré assorti à la carrosserie blanche du véhicule. Finition brillante haute résistance.",
    colors: ["RAL 9010"],
    featured: false,
  },
  {
    id: 4,
    title: "Jantes Golf GTI — Noir & rouge racing",
    category: "jantes",
    description:
      "Réalisation bicolore : faces usinées en noir foncé, liserés et détails en rouge signalisation. Un traitement en deux cuissons pour un résultat impeccable.",
    colors: ["RAL 9005", "RAL 3020"],
    featured: false,
  },

  // ── Moto (3) ─────────────────────────────────────────────────────────
  {
    id: 5,
    title: "Cadre Triumph Street Triple — Vert mousse",
    category: "moto",
    description:
      "Sablage et thermolaquage du cadre et du sous-cadre d'une Triumph Street Triple. Teinte vert mousse choisie pour un style British racing discret et raffiné.",
    colors: ["RAL 6005"],
    featured: true,
  },
  {
    id: 6,
    title: "Jantes Ducati Monster — Rouge signalisation",
    category: "moto",
    description:
      "Thermolaquage de jantes à bâtons Ducati Monster en rouge signalisation brillant. Résistance renforcée aux projections de chaîne et au nettoyeur haute pression.",
    colors: ["RAL 3020"],
    featured: false,
  },
  {
    id: 7,
    title: "Cadre & bras oscillant Yamaha MT-07 — Noir & or",
    category: "moto",
    description:
      "Projet custom complet : cadre en noir foncé mat, bras oscillant et platines en jaune signalisation brillant pour un contraste saisissant sur cette Yamaha MT-07.",
    colors: ["RAL 9005", "RAL 1003"],
    featured: true,
  },

  // ── Mobilier (3) ─────────────────────────────────────────────────────
  {
    id: 8,
    title: "Banquettes acier pour terrasse restaurant",
    category: "mobilier",
    description:
      "Série de 12 structures de banquettes en tube acier pour la terrasse d'un restaurant parisien. Thermolaquage gris anthracite texturé, anti-UV et résistant aux intempéries.",
    colors: ["RAL 7016"],
    featured: true,
  },
  {
    id: 9,
    title: "Table basse design — Effet corten Patina",
    category: "mobilier",
    description:
      "Table basse en acier découpé au laser, thermolaquée avec la finition Patina « Corten Classique ». L'effet rouillé contraste avec le plateau en chêne massif.",
    colors: [],
    featured: false,
  },
  {
    id: 10,
    title: "Étagères murales atelier — Blanc de sécurité",
    category: "mobilier",
    description:
      "Lot de 8 étagères murales en cornières acier pour un concept-store. Thermolaquage blanc de sécurité mat pour un rendu épuré et lumineux dans l'espace de vente.",
    colors: ["RAL 9016"],
    featured: false,
  },

  // ── Industriel (3) ───────────────────────────────────────────────────
  {
    id: 11,
    title: "Charpente métallique atelier 200 m²",
    category: "industriel",
    description:
      "Sablage SA 2.5 et thermolaquage de l'ensemble de la charpente métallique d'un atelier artisanal. Système duplex métallisation zinc + poudre époxy gris clair pour une durabilité de 25 ans.",
    colors: ["RAL 7035"],
    featured: true,
  },
  {
    id: 12,
    title: "Garde-corps inox brossé — Immeuble Cergy",
    category: "industriel",
    description:
      "Thermolaquage de 45 mètres linéaires de garde-corps en acier pour un immeuble résidentiel. Finition aluminium blanc métallisé reproduisant l'aspect de l'inox brossé à moindre coût.",
    colors: ["RAL 9006"],
    featured: false,
  },
  {
    id: 13,
    title: "Supports panneaux solaires — Anti-corrosion C4",
    category: "industriel",
    description:
      "Traitement anti-corrosion de 200 supports de panneaux photovoltaïques pour une ferme solaire en milieu rural. Métallisation zinc 200 µm + thermolaquage gris fenêtre conforme ISO 12944 C4.",
    colors: ["RAL 7040"],
    featured: false,
  },

  // ── Portail (3) ──────────────────────────────────────────────────────
  {
    id: 14,
    title: "Portail coulissant 5 m — RAL 7016",
    category: "portail",
    description:
      "Portail coulissant motorisé de 5 mètres en acier, thermolaqué gris anthracite. Sablage intégral de la structure rouillée puis application du système primaire zinc + poudre époxy.",
    colors: ["RAL 7016"],
    featured: false,
  },
  {
    id: 15,
    title: "Portail battant & clôture assortie — Vert mousse",
    category: "portail",
    description:
      "Ensemble portail battant 3,50 m + portillon piéton + 25 m de clôture barreaudée. Thermolaquage vert mousse satiné pour une intégration harmonieuse dans un environnement boisé.",
    colors: ["RAL 6005"],
    featured: false,
  },
  {
    id: 16,
    title: "Portail contemporain à lames — Noir foncé mat",
    category: "portail",
    description:
      "Portail design à lames horizontales en aluminium, thermolaqué noir foncé mat. Finition haut de gamme avec traitement anti-traces de doigts pour un entretien facilité.",
    colors: ["RAL 9005"],
    featured: false,
  },
];

export function getProjectsByCategory(
  category: ProjectCategoryKey,
): Project[] {
  if (category === "all") return PROJECTS;
  return PROJECTS.filter((p) => p.category === category);
}

export function getFeaturedProjects(): Project[] {
  return PROJECTS.filter((p) => p.featured);
}

/* -------------------------------------------------------------------------- */
/*  Sanity-aware accessors                                                    */
/* -------------------------------------------------------------------------- */

import { sanityFetch } from "@/sanity/client";
import { REALISATIONS_QUERY } from "@/sanity/queries";

export const PROJECTS = PROJECTS_FALLBACK;

export async function getProjects(): Promise<Project[]> {
  const data = await sanityFetch<Project[]>(REALISATIONS_QUERY, {}, {
    tags: ["realisation:list"],
  });
  return data?.length ? data : PROJECTS_FALLBACK;
}
