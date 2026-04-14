/**
 * Collections premium Adaptacolor — effets spéciaux haut de gamme
 * proposés par AZ Époxy en complément du nuancier RAL Classic.
 */

export interface Collection {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  gradient: string;
  characteristics: string[];
  colors: { name: string; hex: string; finish: string }[];
  applications: string[];
  leadTime: string;
}

export const COLLECTIONS: Collection[] = [
  {
    slug: "patina",
    name: "Patina",
    tagline: "Effets corten & oxyde",
    description:
      "La collection Patina reproduit fidèlement l'aspect du métal patiné par le temps : corten oxydé, cuivre vieilli, bronze antique. Chaque pièce acquiert un caractère unique grâce aux variations subtiles de tonalité propres au procédé. Un revêtement qui raconte une histoire, sans les inconvénients de la corrosion réelle.",
    gradient: "from-amber-800 via-orange-700 to-red-900",
    characteristics: [
      "Effet vieilli naturel — imitation corten, cuivre et bronze",
      "Texture organique avec micro-reliefs aléatoires",
      "Chaque pièce est unique grâce aux variations du procédé",
      "Protection anti-corrosion réelle sous l'aspect oxydé",
      "Résistance UV pour une tenue extérieure durable",
    ],
    colors: [
      { name: "Corten Classique", hex: "#8B4513", finish: "texturé mat" },
      { name: "Rouille Toscane", hex: "#A0522D", finish: "texturé mat" },
      { name: "Cuivre Florentin", hex: "#B87333", finish: "satiné" },
      { name: "Bronze Antique", hex: "#6B4226", finish: "satiné" },
      { name: "Terre Brûlée", hex: "#7C3A1A", finish: "texturé mat" },
      { name: "Ocre Provençal", hex: "#C48A3F", finish: "texturé mat" },
      { name: "Fer Forgé", hex: "#4A3728", finish: "texturé mat" },
      { name: "Oxide Bourgogne", hex: "#6D2E2E", finish: "satiné" },
    ],
    applications: [
      "Façades architecturales et bardages",
      "Mobilier urbain et signalétique",
      "Aménagement intérieur — hôtellerie, restaurants",
      "Portails et clôtures haut de gamme",
    ],
    leadTime: "7-10 jours ouvrés",
  },
  {
    slug: "polaris",
    name: "Polaris",
    tagline: "Métalliques structurés",
    description:
      "La collection Polaris sublime le métal par des reflets profonds et un grain métallique prononcé. Inspirées de l'aluminium anodisé et de l'acier brossé, ces teintes apportent une élégance industrielle contemporaine. Le rendu structuré capte et diffuse la lumière pour un effet visuel saisissant.",
    gradient: "from-slate-500 via-zinc-400 to-slate-700",
    characteristics: [
      "Reflets profonds avec effet miroir directionnel",
      "Grain métallique visible — texture micro-brossée",
      "Résistance supérieure aux rayures et à l'abrasion",
      "Entretien minimal — surface anti-traces de doigts",
      "Idéal pour les environnements architecturaux modernes",
    ],
    colors: [
      { name: "Aluminium Brossé", hex: "#A8A9AD", finish: "métallisé satiné" },
      { name: "Acier Polaire", hex: "#71797E", finish: "métallisé brillant" },
      { name: "Titane Clair", hex: "#878681", finish: "métallisé satiné" },
      { name: "Chrome Noir", hex: "#3B3C3E", finish: "métallisé brillant" },
      { name: "Platine Fumé", hex: "#B0B0B0", finish: "métallisé mat" },
      { name: "Graphite Structuré", hex: "#53565A", finish: "texturé métallisé" },
      { name: "Étain Ancien", hex: "#6E6E6D", finish: "métallisé satiné" },
      { name: "Argent Glacier", hex: "#C0C0C0", finish: "métallisé brillant" },
    ],
    applications: [
      "Menuiseries aluminium et façades vitrées",
      "Mobilier design — bureaux, showrooms",
      "Équipements commerciaux et PLV",
      "Garde-corps et mains courantes architecturaux",
    ],
    leadTime: "5-7 jours ouvrés",
  },
  {
    slug: "dichroic",
    name: "Dichroic",
    tagline: "Reflets irisés",
    description:
      "Inspirée du verre dichroïque et des ailes de papillon, la collection Dichroic offre des reflets irisés qui changent de couleur selon l'angle d'observation et l'éclairage. Un effet spectaculaire et contemporain pour les projets qui osent se démarquer.",
    gradient: "from-fuchsia-500 via-cyan-400 to-indigo-600",
    characteristics: [
      "Effet multi-reflets — la couleur varie selon l'angle de vue",
      "Pigments interférentiels de dernière génération",
      "Rendu unique à chaque orientation lumineuse",
      "Compatible intérieur et extérieur (résistance UV renforcée)",
      "Finition lisse ultra-brillante pour un maximum d'effet",
    ],
    colors: [
      { name: "Prisme Aurore", hex: "#E040FB", finish: "irisé brillant" },
      { name: "Spectre Océan", hex: "#00BCD4", finish: "irisé brillant" },
      { name: "Néon Cobalt", hex: "#3D5AFE", finish: "irisé brillant" },
      { name: "Hologramme Jade", hex: "#1DE9B6", finish: "irisé satiné" },
      { name: "Caméléon Violet", hex: "#9C27B0", finish: "irisé brillant" },
      { name: "Mirage Cuivre", hex: "#FF7043", finish: "irisé satiné" },
      { name: "Opale Boréale", hex: "#80DEEA", finish: "irisé brillant" },
      { name: "Fusion Magenta", hex: "#F50057", finish: "irisé brillant" },
    ],
    applications: [
      "Art et sculpture contemporaine",
      "Architecture d'exception — halls, atriums",
      "Customisation automobile et moto haut de gamme",
      "Événementiel et scénographie",
    ],
    leadTime: "10-14 jours ouvrés",
  },
  {
    slug: "sfera",
    name: "Sfera",
    tagline: "Cosmos anodisé",
    description:
      "La collection Sfera s'inspire des nébuleuses et des reflets cosmiques pour créer des teintes profondes à l'aspect anodisé. Des violets galactiques aux ors solaires en passant par des roses stellaires, chaque couleur évoque l'immensité de l'univers avec une finition d'une rare intensité.",
    gradient: "from-amber-500 via-rose-500 to-purple-900",
    characteristics: [
      "Teintes profondes inspirées de l'univers et des nébuleuses",
      "Aspect anodisé haute densité — brillance intense",
      "Pigments nacrés multicouches pour une profondeur remarquable",
      "Excellente tenue des couleurs dans le temps",
      "Effet « candy » translucide sur les teintes les plus claires",
    ],
    colors: [
      { name: "Nébuleuse Or", hex: "#D4A017", finish: "anodisé brillant" },
      { name: "Soleil Rouge", hex: "#C62828", finish: "anodisé brillant" },
      { name: "Supernova Rose", hex: "#E91E63", finish: "anodisé satiné" },
      { name: "Cosmos Violet", hex: "#4A148C", finish: "anodisé brillant" },
      { name: "Éclipse Cuivre", hex: "#BF5700", finish: "anodisé satiné" },
      { name: "Voie Lactée", hex: "#1A237E", finish: "anodisé brillant" },
      { name: "Pulsar Ambre", hex: "#FF8F00", finish: "anodisé brillant" },
      { name: "Horizon Boréal", hex: "#6A1B9A", finish: "anodisé satiné" },
    ],
    applications: [
      "Jantes et pièces automobiles premium",
      "Carénages moto et pièces custom",
      "Mobilier design et luminaires",
      "Éléments décoratifs et objets d'art",
    ],
    leadTime: "10-14 jours ouvrés",
  },
];

export function getCollectionBySlug(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}
