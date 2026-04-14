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
  zinc: { label: "Primaire anti-corrosion zinc", multiplier: 1.3 },
  premium: { label: "Collection premium Adaptacolor", multiplier: 1.2 },
};
