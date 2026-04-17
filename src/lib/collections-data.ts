/**
 * Collections premium Adaptacolor — effets spéciaux haut de gamme
 * proposés par AZ Époxy en complément du nuancier RAL Classic.
 *
 * Les finitions (imageUrl, noms) sont générées par `scripts/build-adapta.mjs`
 * dans `./data/adapta-collections.generated.ts`.
 */

import {
  ADAPTA_DICHROIC_FINISHES,
  ADAPTA_PATINA_SUBS,
  ADAPTA_POLARIS_SUBS,
  ADAPTA_SFERA_FINISHES,
  type AdaptaFinish,
  type AdaptaSub,
} from "./data/adapta-collections.generated";

export interface CollectionFinish {
  id: string;
  name: string;
  description?: string;
  hex?: string;
  imageUrl?: string;
}

export interface SubCollection {
  id: string;
  name: string;
  description?: string;
  finishes: CollectionFinish[];
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  longDescription: string;
  url: string;            // catalogue Adapta officiel
  accentColor: string;    // pour le spotlight hero
  bgGradient: string;     // ex: "from-amber-950 via-orange-900 to-stone-900"
  tags: string[];
  characteristics: string[];
  applications: string[];
  leadTime: string;
  finishes: CollectionFinish[];
  subCollections?: SubCollection[];
}

// Helper: aplatis les sous-collections en une liste de finitions.
const flatten = (subs: AdaptaSub[]): CollectionFinish[] =>
  subs.flatMap((s) => s.finishes);

// Helper: cast AdaptaFinish/AdaptaSub (depuis le fichier generated) vers
// nos types publics (compatibles — même shape).
const toFinish = (f: AdaptaFinish): CollectionFinish => ({ ...f });
const toSub = (s: AdaptaSub): SubCollection => ({
  id: s.id,
  name: s.name,
  description: s.description,
  finishes: s.finishes.map(toFinish),
});

export const COLLECTIONS: Collection[] = [
  {
    id: "patina",
    slug: "patina",
    name: "Patina",
    subtitle: "Oxide & corten effects",
    description:
      "La collection Patina reproduit fidèlement l'aspect du métal patiné par le temps : corten oxydé, cuivre vieilli, bronze antique. Chaque pièce acquiert un caractère unique grâce aux variations subtiles de tonalité propres au procédé.",
    longDescription:
      "Six sous-collections — Plain Oxide, Tile, Oxide I & II, Soft et Crystal Patina — pour couvrir toute la palette des effets vieillis : du corten brut aux patines feutrées, en passant par les oxydations minérales et les cristaux translucides. Un revêtement qui raconte une histoire, sans les inconvénients de la corrosion réelle. Protection anti-corrosion réelle sous l'aspect oxydé, résistance UV pour une tenue extérieure durable.",
    url: "https://adaptacolor.com/fr/catalogoPatina",
    accentColor: "#A0522D",
    bgGradient: "from-amber-950 via-orange-900 to-stone-900",
    tags: ["Corten", "Oxyde", "Vieilli", "Texturé"],
    characteristics: [
      "Effet vieilli naturel — imitation corten, cuivre et bronze",
      "Texture organique avec micro-reliefs aléatoires",
      "Chaque pièce est unique grâce aux variations du procédé",
      "Protection anti-corrosion réelle sous l'aspect oxydé",
      "Résistance UV pour une tenue extérieure durable",
    ],
    applications: [
      "Façades architecturales et bardages",
      "Mobilier urbain et signalétique",
      "Aménagement intérieur — hôtellerie, restaurants",
      "Portails et clôtures haut de gamme",
    ],
    leadTime: "7-10 jours ouvrés",
    finishes: flatten(ADAPTA_PATINA_SUBS),
    subCollections: ADAPTA_PATINA_SUBS.map(toSub),
  },
  {
    id: "polaris",
    slug: "polaris",
    name: "Polaris",
    subtitle: "For industrial design",
    description:
      "La collection Polaris sublime le métal par des reflets profonds et un grain métallique prononcé. Inspirées de l'aluminium anodisé et de l'acier brossé, ces teintes apportent une élégance industrielle contemporaine.",
    longDescription:
      "Sept sous-collections techniques — Chamaleon, Sculptur, Boreal, Orion, Pegassus, Phoenix et Hydra — qui explorent chacune une facette du métal : caméléon changeant, grain sculpté, aurore boréale, constellations brossées, neutres à fort caractère, métalliques ardents et gris structurés. Le rendu structuré capte et diffuse la lumière pour un effet visuel saisissant. Entretien minimal — surface anti-traces de doigts, résistance supérieure aux rayures.",
    url: "https://adaptacolor.com/fr/catalogoPolaris",
    accentColor: "#4A6FA5",
    bgGradient: "from-slate-900 via-blue-950 to-slate-800",
    tags: ["Métallisé", "Brossé", "Structuré", "Industriel"],
    characteristics: [
      "Reflets profonds avec effet miroir directionnel",
      "Grain métallique visible — texture micro-brossée",
      "Résistance supérieure aux rayures et à l'abrasion",
      "Entretien minimal — surface anti-traces de doigts",
      "Idéal pour les environnements architecturaux modernes",
    ],
    applications: [
      "Menuiseries aluminium et façades vitrées",
      "Mobilier design — bureaux, showrooms",
      "Équipements commerciaux et PLV",
      "Garde-corps et mains courantes architecturaux",
    ],
    leadTime: "5-7 jours ouvrés",
    finishes: flatten(ADAPTA_POLARIS_SUBS),
    subCollections: ADAPTA_POLARIS_SUBS.map(toSub),
  },
  {
    id: "dichroic",
    slug: "dichroic",
    name: "Dichroic",
    subtitle: "For architectural design",
    description:
      "Inspirée du verre dichroïque et des ailes de papillon, la collection Dichroic offre des reflets irisés qui changent de couleur selon l'angle d'observation et l'éclairage.",
    longDescription:
      "Vingt-quatre finitions bichromes — chacune un duo de teintes qui se révèlent au gré de la lumière. Pigments interférentiels de dernière génération, rendu unique à chaque orientation lumineuse. Compatible intérieur et extérieur avec résistance UV renforcée, finition lisse ultra-brillante pour un maximum d'effet. Un choix de caractère pour les projets architecturaux qui osent se démarquer.",
    url: "https://adaptacolor.com/fr/catalogoDichroic",
    accentColor: "#7B2FBE",
    bgGradient: "from-violet-950 via-purple-900 to-indigo-950",
    tags: ["Irisé", "Bichrome", "Architectural", "Spectaculaire"],
    characteristics: [
      "Effet multi-reflets — la couleur varie selon l'angle de vue",
      "Pigments interférentiels de dernière génération",
      "Rendu unique à chaque orientation lumineuse",
      "Compatible intérieur et extérieur (résistance UV renforcée)",
      "Finition lisse ultra-brillante pour un maximum d'effet",
    ],
    applications: [
      "Art et sculpture contemporaine",
      "Architecture d'exception — halls, atriums",
      "Customisation automobile et moto haut de gamme",
      "Événementiel et scénographie",
    ],
    leadTime: "10-14 jours ouvrés",
    finishes: ADAPTA_DICHROIC_FINISHES.map(toFinish),
  },
  {
    id: "sfera",
    slug: "sfera",
    name: "Sfera",
    subtitle: "Cosmos anodisé",
    description:
      "La collection Sfera s'inspire des nébuleuses et des reflets cosmiques pour créer des teintes profondes à l'aspect anodisé, à la fois intenses et translucides.",
    longDescription:
      "Treize teintes anodisées haute densité — des violets galactiques aux bronzes solaires en passant par des verts anodisés et des bleus arctiques. Pigments nacrés multicouches pour une profondeur remarquable, excellente tenue des couleurs dans le temps, effet « candy » translucide sur les teintes les plus claires. Idéal pour les jantes, pièces automobiles premium et le mobilier design.",
    url: "https://adaptacolor.com/fr/catalogoSfera",
    accentColor: "#B87333",
    bgGradient: "from-amber-900 via-yellow-900 to-stone-900",
    tags: ["Anodisé", "Candy", "Automobile", "Premium"],
    characteristics: [
      "Teintes profondes inspirées de l'univers et des nébuleuses",
      "Aspect anodisé haute densité — brillance intense",
      "Pigments nacrés multicouches pour une profondeur remarquable",
      "Excellente tenue des couleurs dans le temps",
      "Effet « candy » translucide sur les teintes les plus claires",
    ],
    applications: [
      "Jantes et pièces automobiles premium",
      "Carénages moto et pièces custom",
      "Mobilier design et luminaires",
      "Éléments décoratifs et objets d'art",
    ],
    leadTime: "10-14 jours ouvrés",
    finishes: ADAPTA_SFERA_FINISHES.map(toFinish),
  },
];

export function getCollectionBySlug(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}
