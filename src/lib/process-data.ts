/**
 * Étapes du processus de thermolaquage industriel — AZ Époxy.
 *
 * Chaque étape inclut un numéro, titre, description détaillée et
 * le nom d'une icône lucide-react correspondante.
 */

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
  icon: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: 1,
    title: "Réception & inspection visuelle",
    description:
      "Chaque pièce est réceptionnée et minutieusement inspectée. Nous vérifions l'état de surface, les dimensions et la compatibilité du support métallique avec le procédé de thermolaquage. Un devis détaillé est établi à cette étape.",
    icon: "Search",
  },
  {
    step: 2,
    title: "Sablage / grenaillage",
    description:
      "La surface est décapée par projection d'abrasif (corindon ou grenaille d'acier) afin d'obtenir une propreté SA 2.5 selon la norme ISO 8501-1. Cette préparation crée un profil d'ancrage idéal pour garantir l'adhérence du revêtement.",
    icon: "Sparkles",
  },
  {
    step: 3,
    title: "Application primaire zinc 80 µ",
    description:
      "Lorsqu'une protection anti-corrosion renforcée est requise, une couche de primaire riche en zinc de 80 µm est appliquée au pistolet électrostatique. Ce traitement offre une protection cathodique comparable à la galvanisation à chaud.",
    icon: "Shield",
  },
  {
    step: 4,
    title: "Cuisson primaire — 180 °C / 15 min",
    description:
      "La pièce est placée dans notre four de polymérisation à 180 °C pendant 15 minutes. La cuisson assure la réticulation complète du primaire zinc et prépare la surface pour la couche de finition époxy.",
    icon: "Flame",
  },
  {
    step: 5,
    title: "Application poudre époxy 60-80 µ",
    description:
      "La poudre époxy est projetée uniformément au pistolet électrostatique dans notre cabine ventilée. L'épaisseur cible de 60 à 80 µm garantit une finition homogène et une résistance optimale aux UV, aux chocs et à la corrosion.",
    icon: "Paintbrush",
  },
  {
    step: 6,
    title: "Cuisson finale 200 °C / 15 min + contrôle qualité",
    description:
      "La polymérisation finale s'effectue à 200 °C pendant 15 minutes. Après refroidissement, chaque pièce subit un contrôle qualité rigoureux : mesure d'épaisseur au micromètre, test d'adhérence (cross-cut) et inspection visuelle avant expédition.",
    icon: "CheckCircle",
  },
];
