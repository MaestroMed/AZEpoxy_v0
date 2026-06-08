export interface PriceRange {
  min: number;
  max: number;
}

export interface PieceType {
  slug: string;
  label: string;
  icon: string; // lucide icon name
  unit: string; // "pièce", "m²", "ml"
  sizes?: { label: string; range: PriceRange }[];
  baseRange?: PriceRange;
}

export const PIECE_TYPES: PieceType[] = [
  {
    slug: "jantes",
    label: "Jantes",
    icon: "CircleDot",
    unit: "jante",
    sizes: [
      { label: "15-17 pouces", range: { min: 80, max: 120 } },
      { label: "18-20 pouces", range: { min: 100, max: 150 } },
      { label: "21-22 pouces", range: { min: 130, max: 200 } },
    ],
  },
  {
    slug: "moto",
    label: "Cadre moto",
    icon: "Bike",
    unit: "pièce",
    baseRange: { min: 200, max: 400 },
  },
  {
    slug: "portail",
    label: "Portail",
    icon: "DoorOpen",
    unit: "m²",
    baseRange: { min: 25, max: 45 },
  },
  {
    slug: "garde-corps",
    label: "Garde-corps",
    icon: "Fence",
    unit: "ml",
    baseRange: { min: 20, max: 35 },
  },
  {
    slug: "cadres",
    label: "Cadres / chaudronnerie",
    icon: "Frame",
    unit: "pièce",
    baseRange: { min: 40, max: 120 },
  },
  {
    slug: "mobilier",
    label: "Mobilier",
    icon: "Armchair",
    unit: "pièce",
    baseRange: { min: 50, max: 150 },
  },
  {
    slug: "autre",
    label: "Autre pièce",
    icon: "Package",
    unit: "m²",
    baseRange: { min: 25, max: 50 },
  },
];

export const OPTIONS = {
  primaire: { label: "Primaire anti-corrosion", multiplier: 1.3 },
  premium: { label: "Effets architecturaux (corten, métalliques, irisés…)", multiplier: 1.2 },
};

/**
 * Estimation indicative live pour le wizard de devis — même source que le
 * PriceEstimator. Renvoie une fourchette + un mode d'affichage selon le type :
 *   • "total"   : jantes (quantité × taille connues) → fourchette totale
 *   • "perUnit" : autres pièces → fourchette par unité ("à partir de … /unité")
 * Renvoie null si le type est inconnu (pas d'estimation fiable).
 */
export function estimateWizardPrice(input: {
  projectType?: string;
  nbJantes?: string;
  tailleJantes?: string;
  finition?: string;
}): { min: number; max: number; unit: string; mode: "total" | "perUnit" } | null {
  const pt = PIECE_TYPES.find((p) => p.slug === input.projectType);
  if (!pt) return null;

  let base: PriceRange | null = null;
  let qty = 1;
  let mode: "total" | "perUnit" = "perUnit";

  if (pt.slug === "jantes" && pt.sizes) {
    // tailleJantes est une plage ("15-17 pouces"…) → on prend le PREMIER
    // nombre (sinon "18-20" → "1820" tombe dans le mauvais palier).
    const pouces = parseInt((input.tailleJantes || "").match(/\d+/)?.[0] || "0", 10);
    const idx = !pouces ? 0 : pouces <= 17 ? 0 : pouces <= 20 ? 1 : 2;
    base = pt.sizes[idx].range;
    qty = Math.max(1, parseInt(input.nbJantes || "4", 10) || 4);
    mode = "total";
  } else if (pt.baseRange) {
    base = pt.baseRange;
    mode = "perUnit";
  }
  if (!base) return null;

  let { min, max } = base;
  // Finition à effet → léger surcoût (même multiplicateur que le PriceEstimator).
  if (input.finition && /effet|m[ée]tall|corten|iris|premium/i.test(input.finition)) {
    min *= OPTIONS.premium.multiplier;
    max *= OPTIONS.premium.multiplier;
  }
  min *= qty;
  max *= qty;

  return { min: Math.round(min), max: Math.round(max), unit: pt.unit, mode };
}
