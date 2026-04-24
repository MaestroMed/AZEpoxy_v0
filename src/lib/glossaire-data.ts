/**
 * Technical glossary — AZ Époxy.
 * 28 terms covering thermolaquage, poudres, préparation, normes, finitions.
 * Each entry is indexed by slug for anchor links (#ral, #thermolaquage...).
 */

export interface GlossaryTerm {
  slug: string;
  term: string;
  category: GlossaryCategory;
  definition: string;
  /** Optional 2-4 bullet points with additional detail */
  details?: string[];
  /** Cross-references to other terms in the glossary (slugs) */
  related?: string[];
}

export type GlossaryCategory =
  | "procede"
  | "poudre"
  | "preparation"
  | "finition"
  | "norme"
  | "materiaux";

export const GLOSSARY_CATEGORIES: {
  key: GlossaryCategory;
  label: string;
  description: string;
}[] = [
  {
    key: "procede",
    label: "Procédé",
    description: "Étapes et techniques d'application",
  },
  {
    key: "poudre",
    label: "Poudres",
    description: "Chimies, liants, pigments",
  },
  {
    key: "preparation",
    label: "Préparation",
    description: "Traitement de surface préalable",
  },
  {
    key: "finition",
    label: "Finitions",
    description: "Aspects, textures, effets visuels",
  },
  {
    key: "norme",
    label: "Normes & Qualité",
    description: "Certifications et contrôles",
  },
  {
    key: "materiaux",
    label: "Matériaux",
    description: "Supports compatibles",
  },
];

export const GLOSSARY: GlossaryTerm[] = [
  // ── PROCÉDÉ ─────────────────────────────────────────────
  {
    slug: "thermolaquage",
    term: "Thermolaquage",
    category: "procede",
    definition:
      "Procédé de finition industrielle consistant à appliquer une poudre thermodurcissable sur une pièce métallique, puis à la polymériser au four à 180-220 °C pour obtenir un revêtement durable, homogène et sans solvant.",
    details: [
      "Application par pulvérisation électrostatique",
      "Polymérisation en four entre 15 et 30 minutes",
      "Épaisseur typique : 60 à 120 microns",
      "Durée de vie : 15-25 ans selon exposition",
    ],
    related: ["polymerisation", "electrostatique", "cabine-thermolaquage"],
  },
  {
    slug: "electrostatique",
    term: "Application électrostatique",
    category: "procede",
    definition:
      "Technique d'application où la poudre est chargée électriquement (+60 à +100 kV) avant d'être projetée sur la pièce reliée à la terre. L'attraction électrique assure un dépôt uniforme, même dans les zones difficiles d'accès.",
    details: [
      "Rendement de poudre : 95 à 99 %",
      "Effet cage de Faraday pour les angles rentrants",
      "Récupération des surplus de poudre en cabine",
    ],
    related: ["thermolaquage", "pistolet"],
  },
  {
    slug: "polymerisation",
    term: "Polymérisation",
    category: "procede",
    definition:
      "Réaction chimique déclenchée par la chaleur du four qui transforme la poudre appliquée en un film plastique tridimensionnel réticulé, formant la couche de finition définitive.",
    details: [
      "Température four : 160 à 220 °C selon la poudre",
      "Durée : 10 à 25 minutes",
      "La poudre non polymérisée reste poreuse — la cuisson est critique",
    ],
    related: ["thermolaquage", "four", "reticulation"],
  },
  {
    slug: "reticulation",
    term: "Réticulation",
    category: "procede",
    definition:
      "Création de liaisons chimiques tridimensionnelles entre les chaînes polymères pendant la cuisson. Plus la réticulation est dense, plus le revêtement est dur, résistant aux solvants et aux UV.",
    related: ["polymerisation"],
  },
  {
    slug: "cabine-thermolaquage",
    term: "Cabine de thermolaquage",
    category: "procede",
    definition:
      "Enceinte fermée équipée d'un système d'aspiration et de récupération, dans laquelle les pistolets appliquent la poudre. Le confinement évite la contamination croisée et permet de récupérer la poudre excédentaire.",
    details: [
      "Notre cabine : 7 m × 2,5 m × 2,5 m",
      "Ventilation filtrante pour la santé des opérateurs",
      "Possibilité de changement rapide de teinte",
    ],
    related: ["thermolaquage", "pistolet"],
  },
  {
    slug: "pistolet",
    term: "Pistolet électrostatique",
    category: "procede",
    definition:
      "Outil d'application qui charge la poudre électriquement et la projette sur la pièce via de l'air comprimé. Le réglage de la tension, du débit d'air et du débit de poudre conditionne la qualité du dépôt.",
    related: ["electrostatique"],
  },
  {
    slug: "four",
    term: "Four de polymérisation",
    category: "procede",
    definition:
      "Enceinte chauffée à température contrôlée dans laquelle la pièce poudrée est cuite pour déclencher la polymérisation. Peut être électrique, gaz ou à infrarouge selon les énergies disponibles.",
    details: [
      "Montée en température contrôlée",
      "Palier de cuisson précis (± 5 °C)",
      "Refroidissement avant manipulation",
    ],
    related: ["polymerisation"],
  },

  // ── POUDRES ────────────────────────────────────────────
  {
    slug: "poudre-epoxy",
    term: "Poudre époxy",
    category: "poudre",
    definition:
      "Poudre thermodurcissable à base de résine époxy, reconnue pour son excellente adhérence et sa résistance chimique. Recommandée pour les applications intérieures et anti-corrosion primaire, moins résistante aux UV que le polyester.",
    related: ["poudre-polyester", "poudre-epoxy-polyester"],
  },
  {
    slug: "poudre-polyester",
    term: "Poudre polyester",
    category: "poudre",
    definition:
      "Poudre thermodurcissable à base de résine polyester, offrant une excellente résistance aux UV et aux intempéries. Solution standard pour les applications extérieures : portails, mobilier urbain, menuiseries aluminium.",
    related: ["poudre-epoxy", "qualicoat"],
  },
  {
    slug: "poudre-epoxy-polyester",
    term: "Poudre époxy-polyester",
    category: "poudre",
    definition:
      "Poudre hybride combinant les avantages de l'époxy (adhérence, résistance chimique) et du polyester (tenue UV limitée). Utilisée en intérieur et pour les applications semi-exposées comme les radiateurs.",
    related: ["poudre-epoxy", "poudre-polyester"],
  },
  {
    slug: "qualicoat",
    term: "Qualicoat",
    category: "norme",
    definition:
      "Label qualité international pour le thermolaquage de l'aluminium. Impose des contraintes sur la préparation, l'application, la polymérisation et les contrôles finaux (épaisseur, adhérence, brillance, test climatique).",
    details: [
      "Catégorie 1 : standard",
      "Catégorie 2 : haute durabilité",
      "Catégorie 3 : très haute durabilité (qualicoat Seaside)",
      "Audit annuel par organisme tiers",
    ],
    related: ["qualisteelcoat", "iso-12944"],
  },
  {
    slug: "qualisteelcoat",
    term: "Qualisteelcoat",
    category: "norme",
    definition:
      "Équivalent Qualicoat dédié au thermolaquage de l'acier. Couvre la préparation anti-corrosion (sablage, grenaillage), le primaire zinc et la finition polyester. Classification selon catégories de corrosivité ISO 12944.",
    related: ["qualicoat", "iso-12944", "c5"],
  },

  // ── PRÉPARATION ───────────────────────────────────────
  {
    slug: "sablage",
    term: "Sablage",
    category: "preparation",
    definition:
      "Projection de grains abrasifs (sable, corindon, grenaille) sur une surface pour la décaper, créer un profil d'ancrage et améliorer l'adhérence du revêtement. Indispensable sur acier corrodé ou pièces anciennes.",
    details: [
      "Rugosité mesurée en microns (Ra)",
      "Grades de préparation : Sa 2, Sa 2½, Sa 3",
      "Alternative au décapage chimique",
    ],
    related: ["grenaillage", "degraissage"],
  },
  {
    slug: "grenaillage",
    term: "Grenaillage",
    category: "preparation",
    definition:
      "Variante du sablage utilisant de la grenaille d'acier angulaire ou sphérique. Plus agressif que le sablage au sable, il convient aux pièces épaisses et aux traces de rouille importantes.",
    related: ["sablage"],
  },
  {
    slug: "degraissage",
    term: "Dégraissage",
    category: "preparation",
    definition:
      "Élimination des huiles, graisses et contaminants organiques à la surface d'une pièce avant traitement. Réalisé en bains chauffés alcalins, à la vapeur ou par aspersion. Critique pour l'accroche ultérieure.",
    related: ["phosphatation", "sablage"],
  },
  {
    slug: "phosphatation",
    term: "Phosphatation",
    category: "preparation",
    definition:
      "Traitement chimique qui dépose une couche de cristaux de phosphate métallique sur l'acier. Améliore l'adhérence et la résistance à la corrosion. Étape intermédiaire entre le dégraissage et la finition.",
    related: ["degraissage", "anti-corrosion"],
  },
  {
    slug: "primaire",
    term: "Primaire",
    category: "preparation",
    definition:
      "Première couche appliquée avant la finition, généralement un époxy ou un primaire zinc. Sert à améliorer l'adhérence, à apporter une protection anti-corrosion et à uniformiser la surface.",
    related: ["anti-corrosion", "poudre-epoxy"],
  },

  // ── FINITIONS ─────────────────────────────────────────
  {
    slug: "ral",
    term: "Nuancier RAL",
    category: "finition",
    definition:
      "Système de référence européen de 213 couleurs standards (RAL Classic). Chaque couleur est identifiée par un code à 4 chiffres, dont le premier indique la famille (1000 : jaunes, 2000 : oranges, 3000 : rouges, etc.).",
    details: [
      "RAL Classic : 213 teintes",
      "RAL Design : 1 825 teintes par incréments de luminance",
      "RAL Effect : 490 teintes métallisées",
    ],
    related: ["brillance", "finition-mate"],
  },
  {
    slug: "brillance",
    term: "Brillance (gloss)",
    category: "finition",
    definition:
      "Pourcentage de lumière réfléchie par la surface, mesuré à 60°. Détermine l'aspect visuel : mat (0-10 %), satiné (10-30 %), semi-brillant (30-70 %), brillant (70-90 %), ultra-brillant (>90 %).",
    related: ["finition-mate", "finition-satinee", "finition-brillante"],
  },
  {
    slug: "finition-mate",
    term: "Finition mate",
    category: "finition",
    definition:
      "Finition sans reflet, à l'aspect velouté. Masque bien les petits défauts de surface. Privilégiée pour les ambiances contemporaines et minimalistes. Brillance inférieure à 10 %.",
    related: ["brillance"],
  },
  {
    slug: "finition-satinee",
    term: "Finition satinée",
    category: "finition",
    definition:
      "Finition à demi-reflet, entre mat et brillant. Compromis idéal pour la plupart des usages : facile d'entretien, masque correctement les rayures, rendu élégant sans excès. Brillance 20-30 %.",
    related: ["brillance"],
  },
  {
    slug: "finition-brillante",
    term: "Finition brillante",
    category: "finition",
    definition:
      "Finition à fort reflet, quasi-miroir. Maximise la profondeur de la couleur mais met en évidence le moindre défaut du support. Réservée aux pièces à préparation parfaite. Brillance supérieure à 70 %.",
    related: ["brillance"],
  },
  {
    slug: "finition-texturee",
    term: "Finition texturée",
    category: "finition",
    definition:
      "Surface présentant un micro-relief obtenu par des agents matifiants ou structurants dans la poudre. Masque très bien les défauts, offre un toucher technique recherché. Variantes : fine, moyenne, grosse peau d'orange.",
    related: ["finition-mate"],
  },
  {
    slug: "metallisation",
    term: "Métallisation",
    category: "procede",
    definition:
      "Projection de zinc ou d'aluminium fondu sur l'acier à haute vitesse, formant une couche de 60 à 250 μm anode sacrificielle. Protection anti-corrosion active qui peut être recouverte d'un thermolaquage.",
    details: [
      "Zinc : protection cathodique excellente",
      "Aluminium : atmosphère saline, plus léger",
      "Combinée au thermolaquage : système duplex 25+ ans",
    ],
    related: ["anti-corrosion", "c5"],
  },

  // ── NORMES ────────────────────────────────────────────
  {
    slug: "iso-12944",
    term: "ISO 12944",
    category: "norme",
    definition:
      "Norme internationale définissant les systèmes de peinture pour la protection anti-corrosion des structures acier. Classe les environnements de C1 (intérieur sec) à C5 (industriel ou marin très agressif).",
    details: [
      "C1 : intérieur chauffé",
      "C2 : rural, urbain peu pollué",
      "C3 : urbain, industriel modéré",
      "C4 : chimique, côtier",
      "C5 : industriel lourd, marin",
    ],
    related: ["c5", "qualisteelcoat"],
  },
  {
    slug: "c5",
    term: "Classe C5 (anti-corrosion)",
    category: "norme",
    definition:
      "Environnement de corrosivité très élevée selon ISO 12944 : zones côtières, industries chimiques, offshore. Requiert un système duplex (métallisation + thermolaquage) pour une durabilité supérieure à 15 ans.",
    related: ["iso-12944", "metallisation"],
  },
  {
    slug: "cov",
    term: "COV (Composés Organiques Volatils)",
    category: "norme",
    definition:
      "Composés organiques s'évaporant à température ambiante, nocifs pour la santé et l'environnement. Les peintures solvantées en émettent ; le thermolaquage poudre en émet zéro, ce qui en fait la finition la plus écologique.",
  },

  // ── MATÉRIAUX ─────────────────────────────────────────
  {
    slug: "aluminium",
    term: "Aluminium",
    category: "materiaux",
    definition:
      "Métal léger, non magnétique, résistant à la corrosion. Support de prédilection pour le thermolaquage extérieur (menuiseries, garde-corps, mobilier urbain). Requiert un chromatage ou un prétraitement spécifique.",
    related: ["qualicoat"],
  },
  {
    slug: "acier",
    term: "Acier",
    category: "materiaux",
    definition:
      "Alliage fer-carbone, support métal le plus courant. Nécessite une préparation rigoureuse (sablage + dégraissage + primaire) pour éviter la corrosion sous revêtement. Compatible tous types de poudres.",
    related: ["sablage", "qualisteelcoat"],
  },
  {
    slug: "anti-corrosion",
    term: "Anti-corrosion",
    category: "norme",
    definition:
      "Ensemble des techniques visant à protéger un métal de l'oxydation : préparation mécanique, primaire zinc, métallisation, revêtement étanche. Le choix dépend de la classe d'exposition ISO 12944.",
    related: ["iso-12944", "c5", "metallisation", "primaire"],
  },
];
