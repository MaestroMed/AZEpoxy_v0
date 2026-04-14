/**
 * Projets et catégories pour la page Réalisations d'AZ Époxy.
 */

export interface ProjectCategory {
  key: string;
  label: string;
}

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  { key: "all", label: "Tous" },
  { key: "jantes", label: "Jantes" },
  { key: "moto", label: "Moto" },
  { key: "voiture", label: "Automobile" },
  { key: "pieces", label: "Pièces Métalliques" },
  { key: "mobilier", label: "Mobilier" },
  { key: "portail", label: "Portails & Clôtures" },
];

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  colors: string[];
  featured: boolean;
}

export const PROJECTS: Project[] = [
  // Jantes
  {
    id: "jantes-01",
    title: "Jantes 19\" BMW M4 — Noir satiné",
    category: "jantes",
    description:
      "Rénovation complète de 4 jantes 19 pouces BMW M4 Competition. Sablage, primaire zinc et thermolaquage RAL 9005 satiné. Rendu OEM+ impeccable.",
    colors: ["RAL 9005"],
    featured: true,
  },
  {
    id: "jantes-02",
    title: "Jantes Audi RS3 — Gris anthracite",
    category: "jantes",
    description:
      "Personnalisation de jantes Audi RS3 en gris anthracite RAL 7016 brillant. Résultat discret et élégant, résistant à la poussière de frein.",
    colors: ["RAL 7016"],
    featured: true,
  },
  {
    id: "jantes-03",
    title: "Jantes AMG 20\" — Aluminium blanc",
    category: "jantes",
    description:
      "Jantes Mercedes-AMG 20 pouces traitées en RAL 9006 effet aluminium. Finition métallisée fidèle à l'original.",
    colors: ["RAL 9006"],
    featured: false,
  },
  {
    id: "jantes-04",
    title: "Jantes Porsche Taycan — Blanc pur",
    category: "jantes",
    description:
      "Thermolaquage 4 jantes Porsche Taycan en RAL 9010 blanc pur mat. Look minimaliste pour un rendu premium.",
    colors: ["RAL 9010"],
    featured: false,
  },
  {
    id: "jantes-05",
    title: "Jantes Golf GTI — Gris graphite",
    category: "jantes",
    description:
      "Lot de 4 jantes VW Golf GTI décapées et thermolaquées en RAL 7024 gris graphite satiné.",
    colors: ["RAL 7024"],
    featured: false,
  },
  {
    id: "jantes-06",
    title: "Jantes Tesla Model 3 — Noir foncé brillant",
    category: "jantes",
    description:
      "Thermolaquage de jantes Tesla en noir foncé RAL 9005 brillant haute résistance.",
    colors: ["RAL 9005"],
    featured: false,
  },
  // Moto
  {
    id: "moto-01",
    title: "Cadre Yamaha MT-09 — Rouge signalisation",
    category: "moto",
    description:
      "Cadre complet de Yamaha MT-09 sablé et thermolaqué en RAL 3020 rouge signalisation brillant. Rendu custom agressif pour un look racing.",
    colors: ["RAL 3020"],
    featured: true,
  },
  {
    id: "moto-02",
    title: "Jantes Kawasaki Z900 — Vert mousse",
    category: "moto",
    description:
      "Paire de jantes Kawasaki Z900 thermolaquées en RAL 6005 vert mousse satiné, fidèle à l'esprit Kawasaki racing.",
    colors: ["RAL 6005"],
    featured: false,
  },
  {
    id: "moto-03",
    title: "Cadre Triumph Street Triple — Noir & Orangé",
    category: "moto",
    description:
      "Cadre Triumph Street Triple en bicolore RAL 9005 noir mat et RAL 2004 orangé pur sur le sous-cadre. Custom unique.",
    colors: ["RAL 9005", "RAL 2004"],
    featured: true,
  },
  {
    id: "moto-04",
    title: "Bras oscillant Honda CB650R — Noir mat",
    category: "moto",
    description:
      "Bras oscillant en aluminium Honda CB650R traité en noir mat RAL 9005. Discret et résistant.",
    colors: ["RAL 9005"],
    featured: false,
  },
  {
    id: "moto-05",
    title: "Jantes Ducati Monster — Jaune signalisation",
    category: "moto",
    description:
      "Jantes Ducati Monster thermolaquées en RAL 1003 jaune signalisation brillant. Contraste spectaculaire avec le cadre rouge.",
    colors: ["RAL 1003"],
    featured: false,
  },
  {
    id: "moto-06",
    title: "Cadre Harley Sportster — Noir foncé satiné",
    category: "moto",
    description:
      "Restauration complète du cadre Harley-Davidson Sportster en RAL 9005 noir foncé satiné. Finition digne d'une sortie d'usine.",
    colors: ["RAL 9005"],
    featured: false,
  },
  // Voiture
  {
    id: "voiture-01",
    title: "Étriers Brembo 6 pistons — Rouge feu",
    category: "voiture",
    description:
      "4 étriers Brembo 6 pistons décapés et thermolaqués en RAL 3000 rouge feu brillant. Finition haute température, résistante jusqu'à 200 °C en continu.",
    colors: ["RAL 3000"],
    featured: true,
  },
  {
    id: "voiture-02",
    title: "Arceau OMP — Blanc pur",
    category: "voiture",
    description:
      "Arceau de sécurité OMP traité en RAL 9010 blanc pur brillant pour un véhicule de compétition track day.",
    colors: ["RAL 9010"],
    featured: false,
  },
  {
    id: "voiture-03",
    title: "Cache moteur BMW M3 — Noir satiné",
    category: "voiture",
    description:
      "Cache moteur en aluminium BMW M3 thermolaqué en RAL 9005 satiné. Rendu sobre et élégant sous le capot.",
    colors: ["RAL 9005"],
    featured: false,
  },
  {
    id: "voiture-04",
    title: "Barre anti-rapprochement — Bleu gentiane",
    category: "voiture",
    description:
      "Barre anti-rapprochement en acier traitée en RAL 5010 bleu gentiane brillant. Esthétique et fonctionnel.",
    colors: ["RAL 5010"],
    featured: false,
  },
  {
    id: "voiture-05",
    title: "Étriers AP Racing — Jaune signalisation",
    category: "voiture",
    description:
      "Étriers AP Racing thermolaqués en RAL 1003 jaune signalisation pour un look sportif distinctif.",
    colors: ["RAL 1003"],
    featured: false,
  },
  {
    id: "voiture-06",
    title: "Collecteur d'admission — Noir mat",
    category: "voiture",
    description:
      "Collecteur d'admission en aluminium thermolaqué en RAL 9005 noir mat haute température.",
    colors: ["RAL 9005"],
    featured: false,
  },
  // Pièces métalliques
  {
    id: "pieces-01",
    title: "Portail coulissant 5m — Gris anthracite",
    category: "pieces",
    description:
      "Portail coulissant de 5 mètres en acier galvanisé, sablé et thermolaqué en RAL 7016 gris anthracite satiné. Résistance extérieur garantie.",
    colors: ["RAL 7016"],
    featured: true,
  },
  {
    id: "pieces-02",
    title: "Garde-corps balcon — Noir foncé",
    category: "pieces",
    description:
      "Ensemble de garde-corps pour balcon résidentiel en acier thermolaqué RAL 9005 brillant. 8 mètres linéaires traités.",
    colors: ["RAL 9005"],
    featured: false,
  },
  {
    id: "pieces-03",
    title: "Mobilier terrasse restaurant — Gris clair",
    category: "pieces",
    description:
      "Série de 20 tables et 80 chaises en acier pour terrasse de restaurant, thermolaquées en RAL 7035 gris clair satiné. Production série avec constance de teinte.",
    colors: ["RAL 7035"],
    featured: true,
  },
  {
    id: "pieces-04",
    title: "Escalier métallique hélicoïdal — Blanc pur",
    category: "pieces",
    description:
      "Escalier hélicoïdal en acier de 3 mètres de hauteur, sablé intégralement et thermolaqué en RAL 9010 blanc pur satiné.",
    colors: ["RAL 9010"],
    featured: false,
  },
  {
    id: "pieces-05",
    title: "Structure pergola bioclimatique — Gris anthracite",
    category: "pieces",
    description:
      "Charpente de pergola bioclimatique en aluminium traitée en RAL 7016 gris anthracite mat. Pièces de 4 mètres traitées en cabine 7m.",
    colors: ["RAL 7016"],
    featured: false,
  },
  {
    id: "pieces-06",
    title: "Clôture barreaudée 12m — Vert mousse",
    category: "pieces",
    description:
      "Clôture barreaudée de 12 mètres linéaires en acier, traitement complet sablage + thermolaquage RAL 6005 vert mousse satiné.",
    colors: ["RAL 6005"],
    featured: false,
  },
  // Mobilier
  {
    id: "mobilier-01",
    title: "Banc public design — Noir foncé satiné",
    category: "mobilier",
    description:
      "Mobilier urbain : banc design en acier Corten sablé et thermolaqué en RAL 9005 noir foncé satiné. Résistance extérieur garantie.",
    colors: ["RAL 9005"],
    featured: false,
  },
  {
    id: "mobilier-02",
    title: "Étagère bibliothèque — Blanc de sécurité",
    category: "mobilier",
    description:
      "Étagère en tube acier pour bibliothèque, thermolaquée en RAL 9016 blanc de sécurité mat. Finition douce au toucher.",
    colors: ["RAL 9016"],
    featured: false,
  },
  // Portails
  {
    id: "portail-01",
    title: "Portail battant fer forgé — Noir foncé",
    category: "portail",
    description:
      "Restauration d'un portail en fer forgé ancien. Sablage complet, primaire anti-corrosion et thermolaquage RAL 9005 brillant.",
    colors: ["RAL 9005"],
    featured: true,
  },
  {
    id: "portail-02",
    title: "Clôture résidentielle — Gris anthracite",
    category: "portail",
    description:
      "Ensemble clôture + portillon résidentiel en acier soudé, traité en RAL 7016 gris anthracite satiné pour s'intégrer au bardage de la maison.",
    colors: ["RAL 7016"],
    featured: false,
  },
];
