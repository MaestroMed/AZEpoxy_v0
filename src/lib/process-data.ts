/**
 * Étapes du processus de thermolaquage industriel — AZ Époxy.
 *
 * Chaque étape inclut un numéro, titre, description détaillée et
 * le nom d'une icône lucide-react correspondante. Le procédé suit le
 * référentiel QUALICOAT et les normes ISO 12944 / 8501 / 2409.
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
    title: "Dégraissage & rinçage",
    description:
      "Élimination des résidus d'huile, de graisse et de poussières issus de la préparation. Le support est ensuite rincé puis séché, prêt à recevoir le primaire dans des conditions de propreté optimales.",
    icon: "Droplets",
  },
  {
    step: 4,
    title: "Application du primaire",
    description:
      "Lorsqu'une protection anti-corrosion renforcée est requise, une couche de primaire est appliquée au pistolet électrostatique. Cette sous-couche améliore l'adhérence et prolonge la durée de vie du système de revêtement.",
    icon: "Shield",
  },
  {
    step: 5,
    title: "Application poudre époxy 60-80 µ",
    description:
      "La poudre époxy certifiée de qualité architecturale est projetée uniformément au pistolet électrostatique dans notre cabine ventilée. L'épaisseur cible de 60 à 80 µm garantit une finition homogène et une résistance optimale aux UV, aux chocs et à la corrosion. Aucune réintégration de poudre dans le circuit d'application : finition irréprochable garantie.",
    icon: "Paintbrush",
  },
  {
    step: 6,
    title: "Cuisson en four & contrôle qualité",
    description:
      "La polymérisation s'effectue en four de cuisson, avec une durée ajustée à la masse et à la géométrie de chaque pièce. Après refroidissement, chaque pièce subit un contrôle qualité rigoureux : mesure d'épaisseur au micromètre, test d'adhérence (cross-cut ISO 2409) et inspection visuelle avant expédition.",
    icon: "CheckCircle",
  },
];
