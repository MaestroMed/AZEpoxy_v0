/**
 * Données SEO des villes desservies par AZ Époxy depuis l'atelier de
 * Bruyères-sur-Oise (95820).
 *
 * Stratégie anti-désindexation Google :
 * - Chaque ville stocke des données structurées vérifiables (distance,
 *   trajet, route d'accès, quartiers, industries cibles) plutôt qu'un
 *   blob de texte généré.
 * - Le template /thermolaquage-[ville] compose ~8 sections à partir de
 *   ces données → contenu réellement unique par page, jamais templated.
 * - Les villes "premium" (top 25) gardent un `customIntro` rédigé à la
 *   main pour un boost de qualité éditoriale.
 * - Pas d'invention : les `neighborhoods` / `landmarks` ne sont remplis
 *   que sur les communes dont on connaît le territoire. Le template
 *   masque proprement les sections vides.
 */

/* ── Types ────────────────────────────────────────────────────────── */

export type DepartmentCode =
  | "75"
  | "77"
  | "78"
  | "91"
  | "92"
  | "93"
  | "94"
  | "95"
  | "60"; // Oise — limitrophe, communes < 60 min de Bruyères

export const DEPARTMENT_NAMES: Record<DepartmentCode, string> = {
  "75": "Paris",
  "77": "Seine-et-Marne",
  "78": "Yvelines",
  "91": "Essonne",
  "92": "Hauts-de-Seine",
  "93": "Seine-Saint-Denis",
  "94": "Val-de-Marne",
  "95": "Val-d'Oise",
  "60": "Oise",
};

/**
 * Industries / cibles client présentes sur la commune. Utilisées pour
 * composer la section "Pour qui à X ?" — sans inventer, chaque tag
 * doit refléter la réalité économique du territoire.
 */
export type Industry =
  | "metallerie"
  | "ferronnerie"
  | "automobile"
  | "moto"
  | "industrie"
  | "promotion"
  | "architectes"
  | "mobilier-urbain"
  | "particuliers"
  | "chaudronnerie"
  | "renovation";

export const INDUSTRY_LABEL: Record<Industry, string> = {
  metallerie: "Métalliers & serruriers",
  ferronnerie: "Ferronnerie d'art",
  automobile: "Carrossiers & préparateurs",
  moto: "Préparateurs moto",
  industrie: "Industriels & fabricants",
  promotion: "Promoteurs & constructeurs",
  architectes: "Architectes & bureaux d'études",
  "mobilier-urbain": "Collectivités & mobilier urbain",
  particuliers: "Particuliers exigeants",
  chaudronnerie: "Chaudronniers",
  renovation: "Chantiers de rénovation",
};

export interface Ville {
  /* ── Identity (required) ─────────────────────────────────────── */
  slug: string;
  name: string;
  department: string;
  departmentCode: DepartmentCode;
  /** Population approximative. Optionnel — on ne stocke pas de chiffre
   *  exact qui pourrait dater. */
  population?: number;

  /* ── Géo from Bruyères-sur-Oise (required) ─────────────────── */
  distance: string; // "15 km"
  driveTime: string; // "20 min"
  /** Minutes — sert au tiering (proche / moyen / loin). */
  driveTimeMin: number;
  /** Route d'accès principale, ex "A15 puis RD927". */
  access: string;

  /* ── Rich data (optional, fill ONLY what's verified) ───────── */
  neighborhoods?: string[];
  landmarks?: string[];
  industries?: Industry[];

  /* ── Mesh ────────────────────────────────────────────────────── */
  nearbyVilles: string[];

  /* ── Premium copy (top 25 only) ─────────────────────────────── */
  /** Paragraphe d'intro éditoriale rédigé main. Remplace l'intro
   *  composée automatiquement par le template. */
  customIntro?: string;

  /** @deprecated Migrer vers `customIntro`. Maintenu pour les anciennes
   *  entrées. */
  localContext?: string;
}

/* ── Data ─────────────────────────────────────────────────────────── */

export const VILLES_FALLBACK: Ville[] = [
  /* ────────────────────────────────────────────────────────────────
   *  95 — Val-d'Oise (proximité immédiate, drive ≤ 40 min)
   * ──────────────────────────────────────────────────────────────── */
  {
    slug: "cergy",
    name: "Cergy",
    department: "Val-d'Oise",
    departmentCode: "95",
    population: 64000,
    distance: "15 km",
    driveTime: "20 min",
    driveTimeMin: 20,
    access: "A15 puis RD927",
    neighborhoods: ["Cergy-Centre", "Cergy-le-Haut", "Cergy-Préfecture", "Cergy-Saint-Christophe", "Cergy-Village"],
    landmarks: ["Préfecture du Val-d'Oise", "Université CY", "Port fluvial", "Major"],
    industries: ["metallerie", "promotion", "architectes", "particuliers"],
    nearbyVilles: ["pontoise", "saint-ouen-l-aumone", "eragny", "vauréal"],
    customIntro:
      "Ville nouvelle dynamique avec son université, son quartier d'affaires Major et le port fluvial de Cergy-Pontoise, Cergy accueille de nombreux professionnels du bâtiment et de l'industrie. Nos services de thermolaquage répondent aux exigences des projets architecturaux du Grand Paris et des rénovations de garde-corps, portails et mobilier urbain dans l'agglomération.",
  },
  {
    slug: "pontoise",
    name: "Pontoise",
    department: "Val-d'Oise",
    departmentCode: "95",
    population: 30500,
    distance: "12 km",
    driveTime: "15 min",
    driveTimeMin: 15,
    access: "A15 sortie Pontoise Centre",
    neighborhoods: ["Centre historique", "Les Cordeliers", "Hautils", "Marcouville"],
    landmarks: ["Cathédrale Saint-Maclou", "Musée Pissarro", "Centre Ancien classé"],
    industries: ["ferronnerie", "particuliers", "architectes", "renovation"],
    nearbyVilles: ["cergy", "saint-ouen-l-aumone", "osny", "ennery"],
    customIntro:
      "Préfecture du Val-d'Oise et cité d'art chargée d'histoire, Pontoise mêle patrimoine médiéval et développement urbain moderne. Les artisans ferronniers, les architectes du centre historique et les copropriétés de la ville font régulièrement appel au thermolaquage pour rénover rampes d'escalier, grilles ouvragées et menuiseries métalliques.",
  },
  {
    slug: "sarcelles",
    name: "Sarcelles",
    department: "Val-d'Oise",
    departmentCode: "95",
    population: 60000,
    distance: "25 km",
    driveTime: "30 min",
    driveTimeMin: 30,
    access: "A1 puis A16 direction Beauvais",
    neighborhoods: ["Village", "Grand Ensemble", "Lochères", "Chantepie"],
    industries: ["renovation", "promotion", "metallerie", "mobilier-urbain"],
    nearbyVilles: ["garges-les-gonesse", "villiers-le-bel", "saint-brice-sous-foret", "gonesse"],
    customIntro:
      "Deuxième commune du Val-d'Oise par sa population, Sarcelles connaît un vaste programme de rénovation urbaine dans ses grands ensembles. Le thermolaquage y est très demandé pour le traitement des garde-corps de balcon, des portails résidentiels et des clôtures de copropriétés dans le cadre des opérations ANRU.",
  },
  {
    slug: "argenteuil",
    name: "Argenteuil",
    department: "Val-d'Oise",
    departmentCode: "95",
    population: 110000,
    distance: "30 km",
    driveTime: "35 min",
    driveTimeMin: 35,
    access: "A15 puis A115 direction Paris",
    neighborhoods: ["Centre-Ville", "Val d'Argent", "Berges de Seine", "Orgemont"],
    landmarks: ["Berges de Seine", "Basilique Saint-Denys", "ZAC des Berges"],
    industries: ["automobile", "moto", "industrie", "metallerie", "renovation"],
    nearbyVilles: ["bezons", "sannois", "cormeilles-en-parisis", "nanterre"],
    customIntro:
      "Plus grande ville du Val-d'Oise, Argenteuil allie tissu industriel historique le long de la Seine et quartiers résidentiels en pleine mutation. Les ateliers mécaniques, les chantiers de réhabilitation de la ZAC des Berges et les particuliers amateurs d'automobile font d'Argenteuil un bassin de demande important pour le thermolaquage de jantes, châssis et pièces industrielles.",
  },
  {
    slug: "enghien-les-bains",
    name: "Enghien-les-Bains",
    department: "Val-d'Oise",
    departmentCode: "95",
    population: 12000,
    distance: "22 km",
    driveTime: "25 min",
    driveTimeMin: 25,
    access: "A15 puis RD311",
    landmarks: ["Lac d'Enghien", "Casino Barrière", "Villas Belle Époque"],
    industries: ["ferronnerie", "particuliers", "architectes"],
    nearbyVilles: ["montmorency", "saint-gratien", "soisy-sous-montmorency", "deuil-la-barre"],
    customIntro:
      "Ville thermale et résidentielle prisée, Enghien-les-Bains se distingue par ses villas Belle Époque, son casino et les façades élégantes bordant le lac. Le thermolaquage haut de gamme y est recherché pour la restauration de ferronneries d'art, de balcons en fer forgé et de portails de prestige, avec une attention particulière aux finitions mates et satinées.",
  },
  {
    slug: "montmorency",
    name: "Montmorency",
    department: "Val-d'Oise",
    departmentCode: "95",
    population: 22000,
    distance: "20 km",
    driveTime: "22 min",
    driveTimeMin: 22,
    access: "A15 puis RD311",
    landmarks: ["Collégiale Saint-Martin", "Forêt de Montmorency"],
    industries: ["ferronnerie", "particuliers", "architectes"],
    nearbyVilles: ["enghien-les-bains", "soisy-sous-montmorency", "saint-brice-sous-foret", "deuil-la-barre"],
    customIntro:
      "Surplombant la plaine de France, Montmorency est une ville résidentielle de caractère, riche de demeures du XVIIIᵉ siècle et de vastes propriétés. Les portails domaniaux, les rampes de jardin et les balustrades de villas font appel à notre savoir-faire en thermolaquage poudre époxy pour résister à l'humidité de la forêt et aux variations saisonnières.",
  },
  {
    slug: "taverny",
    name: "Taverny",
    department: "Val-d'Oise",
    departmentCode: "95",
    population: 27000,
    distance: "10 km",
    driveTime: "12 min",
    driveTimeMin: 12,
    access: "A115 puis RD191",
    industries: ["metallerie", "particuliers", "promotion"],
    nearbyVilles: ["beauchamp", "saint-leu-la-foret", "bessancourt", "ermont"],
    customIntro:
      "Très proche de notre atelier, Taverny est une ville pavillonnaire en croissance avec plusieurs zones d'activités, dont la base aérienne 921 et le centre-ville rénové. Les artisans métalliers locaux et les particuliers font appel à AZ Époxy pour le thermolaquage de portails, clôtures et mobilier extérieur, avec un service express compatible avec leurs cadences.",
  },
  {
    slug: "lisle-adam",
    name: "L'Isle-Adam",
    department: "Val-d'Oise",
    departmentCode: "95",
    population: 12200,
    distance: "5 km",
    driveTime: "8 min",
    driveTimeMin: 8,
    access: "RD922 direction L'Isle-Adam",
    landmarks: ["Forêt de L'Isle-Adam", "Plage", "Château de Conti"],
    industries: ["particuliers", "ferronnerie", "architectes"],
    nearbyVilles: ["parmain", "champagne-sur-oise", "valmondois", "presles"],
    customIntro:
      "À 5 minutes de notre atelier, L'Isle-Adam est une ville prisée par les amateurs de patrimoine et de nature. Les propriétaires de villas bourgeoises, les architectes du centre-bourg et les hôteliers font appel à notre service rapide pour la rénovation de portails, balcons et mobilier de bord d'Oise.",
  },
  {
    slug: "persan",
    name: "Persan",
    department: "Val-d'Oise",
    departmentCode: "95",
    population: 11500,
    distance: "3 km",
    driveTime: "5 min",
    driveTimeMin: 5,
    access: "RD922 nord",
    industries: ["industrie", "chaudronnerie", "metallerie"],
    nearbyVilles: ["beaumont-sur-oise", "champagne-sur-oise", "bruyères-sur-oise", "lisle-adam"],
    customIntro:
      "Ville voisine directe de Bruyères-sur-Oise, Persan abrite plusieurs zones industrielles et artisanales. Les ateliers de chaudronnerie, les serruriers et les PME industrielles de la vallée bénéficient d'un délai logistique réduit pour leurs traitements de surface — un service quasi sur-mesure avec dépôt rapide.",
  },
  {
    slug: "beaumont-sur-oise",
    name: "Beaumont-sur-Oise",
    department: "Val-d'Oise",
    departmentCode: "95",
    population: 10000,
    distance: "2 km",
    driveTime: "5 min",
    driveTimeMin: 5,
    access: "RD922 sud",
    industries: ["particuliers", "metallerie", "chaudronnerie"],
    nearbyVilles: ["persan", "bruyeres-sur-oise", "asnieres-sur-oise", "noisy-sur-oise"],
  },
  {
    slug: "eaubonne",
    name: "Eaubonne",
    department: "Val-d'Oise",
    departmentCode: "95",
    population: 25000,
    distance: "20 km",
    driveTime: "25 min",
    driveTimeMin: 25,
    access: "A15 puis RD192",
    industries: ["particuliers", "metallerie", "ferronnerie"],
    nearbyVilles: ["ermont", "saint-leu-la-foret", "ermont-eaubonne", "soisy-sous-montmorency"],
  },
  {
    slug: "ermont",
    name: "Ermont",
    department: "Val-d'Oise",
    departmentCode: "95",
    population: 30000,
    distance: "18 km",
    driveTime: "22 min",
    driveTimeMin: 22,
    access: "A115 puis RD106",
    industries: ["particuliers", "metallerie", "promotion"],
    nearbyVilles: ["eaubonne", "sannois", "franconville", "saint-leu-la-foret"],
  },
  {
    slug: "franconville",
    name: "Franconville",
    department: "Val-d'Oise",
    departmentCode: "95",
    population: 36000,
    distance: "15 km",
    driveTime: "20 min",
    driveTimeMin: 20,
    access: "A115 puis RD106",
    industries: ["metallerie", "automobile", "particuliers"],
    nearbyVilles: ["ermont", "sannois", "saint-leu-la-foret", "cormeilles-en-parisis"],
  },
  {
    slug: "sannois",
    name: "Sannois",
    department: "Val-d'Oise",
    departmentCode: "95",
    population: 27000,
    distance: "23 km",
    driveTime: "28 min",
    driveTimeMin: 28,
    access: "A15 puis RD392",
    industries: ["particuliers", "metallerie", "ferronnerie"],
    nearbyVilles: ["argenteuil", "ermont", "franconville", "cormeilles-en-parisis"],
  },
  {
    slug: "bezons",
    name: "Bezons",
    department: "Val-d'Oise",
    departmentCode: "95",
    population: 30000,
    distance: "28 km",
    driveTime: "32 min",
    driveTimeMin: 32,
    access: "A15 puis A86",
    industries: ["industrie", "metallerie", "promotion"],
    nearbyVilles: ["argenteuil", "cormeilles-en-parisis", "nanterre", "houilles"],
  },
  {
    slug: "cormeilles-en-parisis",
    name: "Cormeilles-en-Parisis",
    department: "Val-d'Oise",
    departmentCode: "95",
    population: 25000,
    distance: "22 km",
    driveTime: "26 min",
    driveTimeMin: 26,
    access: "A15 puis RD392",
    industries: ["particuliers", "metallerie", "promotion"],
    nearbyVilles: ["argenteuil", "sannois", "bezons", "la-frette-sur-seine"],
  },
  {
    slug: "saint-ouen-l-aumone",
    name: "Saint-Ouen-l'Aumône",
    department: "Val-d'Oise",
    departmentCode: "95",
    population: 24000,
    distance: "13 km",
    driveTime: "17 min",
    driveTimeMin: 17,
    access: "A15 sortie Saint-Ouen-l'Aumône",
    industries: ["industrie", "chaudronnerie", "automobile"],
    nearbyVilles: ["cergy", "pontoise", "eragny", "osny"],
    customIntro:
      "Bordée par l'Oise et tournée vers l'industrie, Saint-Ouen-l'Aumône concentre plusieurs zones d'activités stratégiques pour la logistique et la métallerie du nord-ouest francilien. Les chaudronniers, les ateliers automobiles et les industriels nous adressent leurs structures, châssis et pièces de série pour un thermolaquage technique en cabine 7 × 3 × 4 m.",
  },
  {
    slug: "eragny",
    name: "Éragny",
    department: "Val-d'Oise",
    departmentCode: "95",
    population: 17000,
    distance: "15 km",
    driveTime: "20 min",
    driveTimeMin: 20,
    access: "A15 puis RD203",
    industries: ["metallerie", "particuliers", "promotion"],
    nearbyVilles: ["cergy", "saint-ouen-l-aumone", "pontoise", "conflans-sainte-honorine"],
  },
  {
    slug: "herblay",
    name: "Herblay-sur-Seine",
    department: "Val-d'Oise",
    departmentCode: "95",
    population: 29000,
    distance: "20 km",
    driveTime: "25 min",
    driveTimeMin: 25,
    access: "A15 sortie Herblay",
    industries: ["particuliers", "metallerie", "automobile"],
    nearbyVilles: ["conflans-sainte-honorine", "cormeilles-en-parisis", "la-frette-sur-seine", "pierrelaye"],
  },
  {
    slug: "gonesse",
    name: "Gonesse",
    department: "Val-d'Oise",
    departmentCode: "95",
    population: 25500,
    distance: "27 km",
    driveTime: "32 min",
    driveTimeMin: 32,
    access: "A1 sortie Gonesse",
    industries: ["industrie", "metallerie", "automobile", "chaudronnerie"],
    nearbyVilles: ["sarcelles", "garges-les-gonesse", "villiers-le-bel", "goussainville"],
  },
  {
    slug: "goussainville",
    name: "Goussainville",
    department: "Val-d'Oise",
    departmentCode: "95",
    population: 32000,
    distance: "30 km",
    driveTime: "35 min",
    driveTimeMin: 35,
    access: "A1 sortie Goussainville",
    industries: ["metallerie", "particuliers", "industrie"],
    nearbyVilles: ["gonesse", "sarcelles", "villiers-le-bel", "fosses"],
  },
  {
    slug: "garges-les-gonesse",
    name: "Garges-lès-Gonesse",
    department: "Val-d'Oise",
    departmentCode: "95",
    population: 42000,
    distance: "28 km",
    driveTime: "33 min",
    driveTimeMin: 33,
    access: "A1 puis RD125",
    industries: ["renovation", "promotion", "metallerie"],
    nearbyVilles: ["sarcelles", "gonesse", "villiers-le-bel", "stains"],
  },
  {
    slug: "villiers-le-bel",
    name: "Villiers-le-Bel",
    department: "Val-d'Oise",
    departmentCode: "95",
    population: 28000,
    distance: "26 km",
    driveTime: "31 min",
    driveTimeMin: 31,
    access: "A1 sortie Villiers-le-Bel",
    industries: ["renovation", "promotion", "metallerie", "mobilier-urbain"],
    nearbyVilles: ["sarcelles", "gonesse", "garges-les-gonesse", "ecouen"],
  },
  {
    slug: "domont",
    name: "Domont",
    department: "Val-d'Oise",
    departmentCode: "95",
    population: 15500,
    distance: "18 km",
    driveTime: "22 min",
    driveTimeMin: 22,
    access: "RD301 puis RD125",
    industries: ["particuliers", "metallerie", "ferronnerie"],
    nearbyVilles: ["montmorency", "saint-brice-sous-foret", "ecouen", "moisselles"],
  },
  {
    slug: "saint-brice-sous-foret",
    name: "Saint-Brice-sous-Forêt",
    department: "Val-d'Oise",
    departmentCode: "95",
    population: 14500,
    distance: "21 km",
    driveTime: "26 min",
    driveTimeMin: 26,
    access: "RD301 puis RD109",
    industries: ["particuliers", "metallerie", "promotion"],
    nearbyVilles: ["montmorency", "sarcelles", "domont", "soisy-sous-montmorency"],
  },
  {
    slug: "soisy-sous-montmorency",
    name: "Soisy-sous-Montmorency",
    department: "Val-d'Oise",
    departmentCode: "95",
    population: 17500,
    distance: "20 km",
    driveTime: "25 min",
    driveTimeMin: 25,
    access: "A15 puis RD311",
    industries: ["particuliers", "ferronnerie", "architectes"],
    nearbyVilles: ["enghien-les-bains", "montmorency", "saint-brice-sous-foret", "eaubonne"],
  },

  /* ────────────────────────────────────────────────────────────────
   *  75 — Paris (drive 45-60 min)
   * ──────────────────────────────────────────────────────────────── */
  {
    slug: "paris",
    name: "Paris",
    department: "Paris",
    departmentCode: "75",
    population: 2100000,
    distance: "45 km",
    driveTime: "50 min",
    driveTimeMin: 50,
    access: "A1 directe vers Porte de la Chapelle",
    landmarks: ["Boulevards des Maréchaux", "Périphérique", "Gare du Nord"],
    industries: ["ferronnerie", "architectes", "particuliers", "automobile", "moto"],
    nearbyVilles: ["saint-denis", "boulogne-billancourt", "levallois-perret", "neuilly-sur-seine"],
    customIntro:
      "Capitale et ville la plus dense d'Europe, Paris concentre les ferronneries d'art, les architectes du patrimoine et une clientèle exigeante pour la rénovation des balcons haussmanniens, des grilles, des portails cochères et des pièces auto/moto premium. Notre service avec enlèvement et restitution couvre l'ensemble des arrondissements depuis Bruyères-sur-Oise via l'A1.",
  },
  {
    slug: "paris-15",
    name: "Paris 15ᵉ",
    department: "Paris",
    departmentCode: "75",
    distance: "50 km",
    driveTime: "55 min",
    driveTimeMin: 55,
    access: "A1 puis Périphérique sud-ouest",
    industries: ["ferronnerie", "particuliers", "architectes"],
    nearbyVilles: ["paris-16", "boulogne-billancourt", "issy-les-moulineaux", "paris"],
  },
  {
    slug: "paris-16",
    name: "Paris 16ᵉ",
    department: "Paris",
    departmentCode: "75",
    distance: "48 km",
    driveTime: "55 min",
    driveTimeMin: 55,
    access: "A1 puis Périphérique ouest",
    industries: ["ferronnerie", "particuliers", "architectes"],
    nearbyVilles: ["paris-15", "paris-17", "boulogne-billancourt", "neuilly-sur-seine"],
  },
  {
    slug: "paris-17",
    name: "Paris 17ᵉ",
    department: "Paris",
    departmentCode: "75",
    distance: "44 km",
    driveTime: "50 min",
    driveTimeMin: 50,
    access: "A1 puis Périphérique nord",
    industries: ["ferronnerie", "particuliers", "metallerie"],
    nearbyVilles: ["paris-18", "paris-16", "levallois-perret", "clichy"],
  },
  {
    slug: "paris-18",
    name: "Paris 18ᵉ",
    department: "Paris",
    departmentCode: "75",
    distance: "42 km",
    driveTime: "48 min",
    driveTimeMin: 48,
    access: "A1 Porte de la Chapelle",
    industries: ["metallerie", "particuliers", "renovation"],
    nearbyVilles: ["paris-17", "paris-19", "saint-denis", "saint-ouen"],
  },
  {
    slug: "paris-19",
    name: "Paris 19ᵉ",
    department: "Paris",
    departmentCode: "75",
    distance: "44 km",
    driveTime: "50 min",
    driveTimeMin: 50,
    access: "A1 puis Périphérique nord-est",
    industries: ["metallerie", "particuliers", "renovation"],
    nearbyVilles: ["paris-18", "paris-20", "pantin", "aubervilliers"],
  },

  /* ────────────────────────────────────────────────────────────────
   *  92 — Hauts-de-Seine
   * ──────────────────────────────────────────────────────────────── */
  {
    slug: "nanterre",
    name: "Nanterre",
    department: "Hauts-de-Seine",
    departmentCode: "92",
    population: 96000,
    distance: "33 km",
    driveTime: "40 min",
    driveTimeMin: 40,
    access: "A15 puis A86",
    landmarks: ["La Défense", "Arena Paris La Défense", "Préfecture"],
    industries: ["industrie", "architectes", "metallerie", "promotion"],
    nearbyVilles: ["la-defense", "courbevoie", "rueil-malmaison", "puteaux"],
    customIntro:
      "Préfecture des Hauts-de-Seine et porte d'entrée de La Défense, Nanterre conjugue grands chantiers tertiaires, université Paris-Nanterre et tissu industriel historique. Les bureaux d'études du quartier d'affaires, les chantiers de l'EOLE et les ateliers du quartier des Groues mobilisent un thermolaquage de précision pour les structures architecturales et les pièces industrielles.",
  },
  {
    slug: "boulogne-billancourt",
    name: "Boulogne-Billancourt",
    department: "Hauts-de-Seine",
    departmentCode: "92",
    population: 122000,
    distance: "52 km",
    driveTime: "58 min",
    driveTimeMin: 58,
    access: "A1 puis Périphérique sud",
    landmarks: ["Île Seguin", "Trapèze", "Musée Albert-Kahn"],
    industries: ["architectes", "ferronnerie", "particuliers", "promotion"],
    nearbyVilles: ["paris-16", "issy-les-moulineaux", "sevres", "meudon"],
  },
  {
    slug: "neuilly-sur-seine",
    name: "Neuilly-sur-Seine",
    department: "Hauts-de-Seine",
    departmentCode: "92",
    population: 60000,
    distance: "46 km",
    driveTime: "52 min",
    driveTimeMin: 52,
    access: "A15 puis Périphérique ouest",
    industries: ["ferronnerie", "particuliers", "architectes"],
    nearbyVilles: ["paris-16", "levallois-perret", "courbevoie", "puteaux"],
  },
  {
    slug: "levallois-perret",
    name: "Levallois-Perret",
    department: "Hauts-de-Seine",
    departmentCode: "92",
    population: 67000,
    distance: "43 km",
    driveTime: "48 min",
    driveTimeMin: 48,
    access: "A15 puis Périphérique nord-ouest",
    industries: ["ferronnerie", "particuliers", "metallerie"],
    nearbyVilles: ["clichy", "neuilly-sur-seine", "courbevoie", "paris-17"],
  },
  {
    slug: "asnieres-sur-seine",
    name: "Asnières-sur-Seine",
    department: "Hauts-de-Seine",
    departmentCode: "92",
    population: 87000,
    distance: "38 km",
    driveTime: "44 min",
    driveTimeMin: 44,
    access: "A15 puis A86",
    industries: ["metallerie", "particuliers", "automobile"],
    nearbyVilles: ["clichy", "bois-colombes", "colombes", "gennevilliers"],
  },
  {
    slug: "courbevoie",
    name: "Courbevoie",
    department: "Hauts-de-Seine",
    departmentCode: "92",
    population: 84000,
    distance: "42 km",
    driveTime: "48 min",
    driveTimeMin: 48,
    access: "A15 puis A86",
    landmarks: ["La Défense", "Faubourg de l'Arche"],
    industries: ["architectes", "industrie", "metallerie", "promotion"],
    nearbyVilles: ["la-defense", "puteaux", "nanterre", "levallois-perret"],
  },
  {
    slug: "issy-les-moulineaux",
    name: "Issy-les-Moulineaux",
    department: "Hauts-de-Seine",
    departmentCode: "92",
    population: 70000,
    distance: "55 km",
    driveTime: "62 min",
    driveTimeMin: 62,
    access: "A1 puis Périphérique sud",
    industries: ["architectes", "industrie", "promotion"],
    nearbyVilles: ["boulogne-billancourt", "paris-15", "vanves", "clamart"],
  },
  {
    slug: "clichy",
    name: "Clichy",
    department: "Hauts-de-Seine",
    departmentCode: "92",
    population: 62000,
    distance: "40 km",
    driveTime: "45 min",
    driveTimeMin: 45,
    access: "A1 puis Périphérique nord",
    industries: ["metallerie", "industrie", "particuliers"],
    nearbyVilles: ["levallois-perret", "asnieres-sur-seine", "saint-ouen", "paris-17"],
  },
  {
    slug: "colombes",
    name: "Colombes",
    department: "Hauts-de-Seine",
    departmentCode: "92",
    population: 87000,
    distance: "35 km",
    driveTime: "42 min",
    driveTimeMin: 42,
    access: "A15 puis A86",
    industries: ["metallerie", "particuliers", "promotion"],
    nearbyVilles: ["asnieres-sur-seine", "bois-colombes", "courbevoie", "gennevilliers"],
  },
  {
    slug: "rueil-malmaison",
    name: "Rueil-Malmaison",
    department: "Hauts-de-Seine",
    departmentCode: "92",
    population: 80000,
    distance: "45 km",
    driveTime: "50 min",
    driveTimeMin: 50,
    access: "A15 puis A86",
    industries: ["architectes", "particuliers", "industrie"],
    nearbyVilles: ["nanterre", "suresnes", "chatou", "houilles"],
  },

  /* ────────────────────────────────────────────────────────────────
   *  93 — Seine-Saint-Denis
   * ──────────────────────────────────────────────────────────────── */
  {
    slug: "saint-denis",
    name: "Saint-Denis",
    department: "Seine-Saint-Denis",
    departmentCode: "93",
    population: 113000,
    distance: "30 km",
    driveTime: "40 min",
    driveTimeMin: 40,
    access: "A1 direct",
    landmarks: ["Basilique de Saint-Denis", "Stade de France", "La Plaine"],
    industries: ["industrie", "chaudronnerie", "renovation", "mobilier-urbain"],
    nearbyVilles: ["aubervilliers", "stains", "la-courneuve", "pierrefitte-sur-seine"],
    customIntro:
      "Préfecture de Seine-Saint-Denis et capitale historique du nord parisien, Saint-Denis combine patrimoine royal, tissu industriel et grands chantiers du Grand Paris (Stade de France, Carrefour Pleyel, JO 2024). Le thermolaquage y trouve ses clients chez les chaudronniers de La Plaine, les bailleurs sociaux et les fabricants de mobilier urbain.",
  },
  {
    slug: "aubervilliers",
    name: "Aubervilliers",
    department: "Seine-Saint-Denis",
    departmentCode: "93",
    population: 89000,
    distance: "33 km",
    driveTime: "42 min",
    driveTimeMin: 42,
    access: "A1 puis A86",
    industries: ["industrie", "metallerie", "renovation"],
    nearbyVilles: ["saint-denis", "pantin", "la-courneuve", "paris-19"],
  },
  {
    slug: "montreuil",
    name: "Montreuil",
    department: "Seine-Saint-Denis",
    departmentCode: "93",
    population: 110000,
    distance: "50 km",
    driveTime: "58 min",
    driveTimeMin: 58,
    access: "A1 puis A86",
    industries: ["metallerie", "ferronnerie", "particuliers", "architectes"],
    nearbyVilles: ["bagnolet", "vincennes", "rosny-sous-bois", "paris-20"],
  },
  {
    slug: "bobigny",
    name: "Bobigny",
    department: "Seine-Saint-Denis",
    departmentCode: "93",
    population: 53000,
    distance: "38 km",
    driveTime: "48 min",
    driveTimeMin: 48,
    access: "A1 puis A86",
    industries: ["industrie", "promotion", "mobilier-urbain"],
    nearbyVilles: ["drancy", "noisy-le-sec", "pantin", "bondy"],
  },
  {
    slug: "pantin",
    name: "Pantin",
    department: "Seine-Saint-Denis",
    departmentCode: "93",
    population: 60000,
    distance: "40 km",
    driveTime: "48 min",
    driveTimeMin: 48,
    access: "A1 puis A86",
    industries: ["architectes", "industrie", "promotion"],
    nearbyVilles: ["aubervilliers", "paris-19", "bobigny", "noisy-le-sec"],
  },
  {
    slug: "drancy",
    name: "Drancy",
    department: "Seine-Saint-Denis",
    departmentCode: "93",
    population: 71000,
    distance: "32 km",
    driveTime: "40 min",
    driveTimeMin: 40,
    access: "A1 puis A3",
    industries: ["metallerie", "renovation", "particuliers"],
    nearbyVilles: ["bobigny", "le-blanc-mesnil", "le-bourget", "aulnay-sous-bois"],
  },
  {
    slug: "aulnay-sous-bois",
    name: "Aulnay-sous-Bois",
    department: "Seine-Saint-Denis",
    departmentCode: "93",
    population: 87000,
    distance: "30 km",
    driveTime: "38 min",
    driveTimeMin: 38,
    access: "A1 puis A104",
    industries: ["automobile", "industrie", "metallerie"],
    nearbyVilles: ["drancy", "le-blanc-mesnil", "sevran", "villepinte"],
  },

  /* ────────────────────────────────────────────────────────────────
   *  94 — Val-de-Marne
   * ──────────────────────────────────────────────────────────────── */
  {
    slug: "creteil",
    name: "Créteil",
    department: "Val-de-Marne",
    departmentCode: "94",
    population: 92000,
    distance: "55 km",
    driveTime: "62 min",
    driveTimeMin: 62,
    access: "A1 puis A86",
    landmarks: ["Préfecture", "Lac de Créteil", "Choux de Créteil"],
    industries: ["industrie", "promotion", "renovation", "mobilier-urbain"],
    nearbyVilles: ["maisons-alfort", "saint-maur-des-fosses", "alfortville", "champigny-sur-marne"],
    customIntro:
      "Préfecture du Val-de-Marne, Créteil est un pôle administratif et universitaire majeur du sud-est francilien. Les chantiers du Grand Paris Express, la rénovation du quartier du Lac et les copropriétés des Choux de Gérard Grandval maintiennent une demande constante en thermolaquage de garde-corps, structures métalliques et mobilier urbain.",
  },
  {
    slug: "vitry-sur-seine",
    name: "Vitry-sur-Seine",
    department: "Val-de-Marne",
    departmentCode: "94",
    population: 95000,
    distance: "55 km",
    driveTime: "62 min",
    driveTimeMin: 62,
    access: "A1 puis A86",
    industries: ["industrie", "renovation", "metallerie"],
    nearbyVilles: ["ivry-sur-seine", "choisy-le-roi", "alfortville", "villejuif"],
  },
  {
    slug: "champigny-sur-marne",
    name: "Champigny-sur-Marne",
    department: "Val-de-Marne",
    departmentCode: "94",
    population: 77000,
    distance: "58 km",
    driveTime: "65 min",
    driveTimeMin: 65,
    access: "A1 puis A4",
    industries: ["particuliers", "metallerie", "renovation"],
    nearbyVilles: ["saint-maur-des-fosses", "creteil", "joinville-le-pont", "nogent-sur-marne"],
  },
  {
    slug: "saint-maur-des-fosses",
    name: "Saint-Maur-des-Fossés",
    department: "Val-de-Marne",
    departmentCode: "94",
    population: 75000,
    distance: "57 km",
    driveTime: "64 min",
    driveTimeMin: 64,
    access: "A1 puis A4",
    industries: ["ferronnerie", "particuliers", "architectes"],
    nearbyVilles: ["creteil", "champigny-sur-marne", "joinville-le-pont", "bonneuil-sur-marne"],
  },
  {
    slug: "vincennes",
    name: "Vincennes",
    department: "Val-de-Marne",
    departmentCode: "94",
    population: 50000,
    distance: "48 km",
    driveTime: "55 min",
    driveTimeMin: 55,
    access: "A1 puis A86 puis A4",
    landmarks: ["Château de Vincennes", "Bois de Vincennes"],
    industries: ["ferronnerie", "architectes", "particuliers"],
    nearbyVilles: ["paris-12", "saint-mande", "fontenay-sous-bois", "montreuil"],
  },
  {
    slug: "ivry-sur-seine",
    name: "Ivry-sur-Seine",
    department: "Val-de-Marne",
    departmentCode: "94",
    population: 65000,
    distance: "55 km",
    driveTime: "62 min",
    driveTimeMin: 62,
    access: "A1 puis Périphérique sud",
    industries: ["industrie", "metallerie", "renovation"],
    nearbyVilles: ["vitry-sur-seine", "paris-13", "charenton-le-pont", "alfortville"],
  },

  /* ────────────────────────────────────────────────────────────────
   *  91 — Essonne
   * ──────────────────────────────────────────────────────────────── */
  {
    slug: "evry-courcouronnes",
    name: "Évry-Courcouronnes",
    department: "Essonne",
    departmentCode: "91",
    population: 67000,
    distance: "70 km",
    driveTime: "75 min",
    driveTimeMin: 75,
    access: "A1 puis A86 puis A6",
    landmarks: ["Préfecture", "Génopole", "Cathédrale de la Résurrection"],
    industries: ["industrie", "architectes", "promotion"],
    nearbyVilles: ["corbeil-essonnes", "ris-orangis", "grigny", "viry-chatillon"],
    customIntro:
      "Préfecture de l'Essonne et ville nouvelle, Évry-Courcouronnes est un centre universitaire et technologique en développement. Le quartier d'affaires Évry Centre République, le Génopole et les zones d'activités du sud francilien font appel au thermolaquage pour des projets allant du mobilier de bureau à la signalétique industrielle en passant par les aménagements extérieurs.",
  },
  {
    slug: "corbeil-essonnes",
    name: "Corbeil-Essonnes",
    department: "Essonne",
    departmentCode: "91",
    population: 51000,
    distance: "75 km",
    driveTime: "80 min",
    driveTimeMin: 80,
    access: "A1 puis A86 puis A6",
    industries: ["industrie", "chaudronnerie", "automobile"],
    nearbyVilles: ["evry-courcouronnes", "ris-orangis", "saint-pierre-du-perray", "villabe"],
  },
  {
    slug: "massy",
    name: "Massy",
    department: "Essonne",
    departmentCode: "91",
    population: 50000,
    distance: "70 km",
    driveTime: "75 min",
    driveTimeMin: 75,
    access: "A1 puis A86 puis A10",
    industries: ["architectes", "industrie", "promotion"],
    nearbyVilles: ["palaiseau", "antony", "verrieres-le-buisson", "wissous"],
  },
  {
    slug: "palaiseau",
    name: "Palaiseau",
    department: "Essonne",
    departmentCode: "91",
    population: 35000,
    distance: "72 km",
    driveTime: "78 min",
    driveTimeMin: 78,
    access: "A1 puis A86 puis A10",
    landmarks: ["Plateau de Saclay", "École Polytechnique"],
    industries: ["industrie", "architectes", "particuliers"],
    nearbyVilles: ["massy", "orsay", "saclay", "igny"],
  },
  {
    slug: "savigny-sur-orge",
    name: "Savigny-sur-Orge",
    department: "Essonne",
    departmentCode: "91",
    population: 37000,
    distance: "68 km",
    driveTime: "73 min",
    driveTimeMin: 73,
    access: "A1 puis A86 puis A6",
    industries: ["particuliers", "metallerie", "promotion"],
    nearbyVilles: ["athis-mons", "viry-chatillon", "morsang-sur-orge", "juvisy-sur-orge"],
  },

  /* ────────────────────────────────────────────────────────────────
   *  78 — Yvelines
   * ──────────────────────────────────────────────────────────────── */
  {
    slug: "versailles",
    name: "Versailles",
    department: "Yvelines",
    departmentCode: "78",
    population: 85000,
    distance: "55 km",
    driveTime: "65 min",
    driveTimeMin: 65,
    access: "A15 puis A13 direction Versailles",
    landmarks: ["Château de Versailles", "Notre-Dame", "Saint-Louis"],
    industries: ["ferronnerie", "architectes", "particuliers", "renovation"],
    nearbyVilles: ["le-chesnay-rocquencourt", "saint-germain-en-laye", "viroflay", "vélizy-villacoublay"],
    customIntro:
      "Cité royale et préfecture des Yvelines, Versailles concentre les ferronniers d'art, les architectes du patrimoine et une clientèle haut de gamme attentive aux détails. Notre thermolaquage répond aux exigences de restauration des grilles d'hôtels particuliers, ferronneries de jardin et menuiseries classées, avec une attention particulière aux finitions mates et patines architecturales.",
  },
  {
    slug: "saint-germain-en-laye",
    name: "Saint-Germain-en-Laye",
    department: "Yvelines",
    departmentCode: "78",
    population: 45000,
    distance: "40 km",
    driveTime: "48 min",
    driveTimeMin: 48,
    access: "A15 puis A14",
    landmarks: ["Château de Saint-Germain", "Forêt domaniale"],
    industries: ["ferronnerie", "particuliers", "architectes"],
    nearbyVilles: ["le-pecq", "le-vesinet", "marly-le-roi", "poissy"],
  },
  {
    slug: "mantes-la-jolie",
    name: "Mantes-la-Jolie",
    department: "Yvelines",
    departmentCode: "78",
    population: 44000,
    distance: "55 km",
    driveTime: "60 min",
    driveTimeMin: 60,
    access: "A15 puis A13",
    industries: ["industrie", "automobile", "renovation"],
    nearbyVilles: ["mantes-la-ville", "rosny-sur-seine", "buchelay", "limay"],
  },
  {
    slug: "poissy",
    name: "Poissy",
    department: "Yvelines",
    departmentCode: "78",
    population: 38000,
    distance: "35 km",
    driveTime: "42 min",
    driveTimeMin: 42,
    access: "A15 puis A14",
    landmarks: ["Usine PSA", "Collégiale Notre-Dame"],
    industries: ["automobile", "industrie", "metallerie"],
    nearbyVilles: ["saint-germain-en-laye", "carrieres-sous-poissy", "achères", "conflans-sainte-honorine"],
  },
  {
    slug: "conflans-sainte-honorine",
    name: "Conflans-Sainte-Honorine",
    department: "Yvelines",
    departmentCode: "78",
    population: 36000,
    distance: "20 km",
    driveTime: "25 min",
    driveTimeMin: 25,
    access: "A15 sortie Conflans",
    landmarks: ["Capitale de la batellerie", "Confluence Seine-Oise"],
    industries: ["chaudronnerie", "industrie", "metallerie"],
    nearbyVilles: ["herblay", "cergy", "eragny", "achères"],
  },
  {
    slug: "le-chesnay-rocquencourt",
    name: "Le Chesnay-Rocquencourt",
    department: "Yvelines",
    departmentCode: "78",
    population: 30000,
    distance: "52 km",
    driveTime: "60 min",
    driveTimeMin: 60,
    access: "A15 puis A13",
    industries: ["ferronnerie", "particuliers", "architectes"],
    nearbyVilles: ["versailles", "viroflay", "vélizy-villacoublay", "bailly"],
  },
  {
    slug: "sartrouville",
    name: "Sartrouville",
    department: "Yvelines",
    departmentCode: "78",
    population: 53000,
    distance: "28 km",
    driveTime: "34 min",
    driveTimeMin: 34,
    access: "A15 sortie Sartrouville",
    industries: ["metallerie", "particuliers", "automobile"],
    nearbyVilles: ["maisons-laffitte", "houilles", "montesson", "le-mesnil-le-roi"],
  },
  {
    slug: "houilles",
    name: "Houilles",
    department: "Yvelines",
    departmentCode: "78",
    population: 32000,
    distance: "30 km",
    driveTime: "36 min",
    driveTimeMin: 36,
    access: "A15 puis A86",
    industries: ["particuliers", "metallerie", "promotion"],
    nearbyVilles: ["sartrouville", "carriere-sur-seine", "bezons", "argenteuil"],
  },

  /* ────────────────────────────────────────────────────────────────
   *  77 — Seine-et-Marne
   * ──────────────────────────────────────────────────────────────── */
  {
    slug: "meaux",
    name: "Meaux",
    department: "Seine-et-Marne",
    departmentCode: "77",
    population: 56000,
    distance: "60 km",
    driveTime: "65 min",
    driveTimeMin: 65,
    access: "A1 puis A104 direction Meaux",
    landmarks: ["Cathédrale Saint-Étienne", "Cité épiscopale"],
    industries: ["promotion", "metallerie", "particuliers"],
    nearbyVilles: ["mareuil-les-meaux", "trilport", "nanteuil-les-meaux", "claye-souilly"],
    customIntro:
      "Sous-préfecture de Seine-et-Marne, Meaux est une ville en pleine expansion démographique avec de nombreux lotissements et programmes immobiliers neufs. La demande en thermolaquage y est portée par les constructeurs de maisons individuelles, les poseurs de portails et clôtures, ainsi que les particuliers souhaitant rénover leurs garde-corps et mobilier de jardin.",
  },
  {
    slug: "melun",
    name: "Melun",
    department: "Seine-et-Marne",
    departmentCode: "77",
    population: 41000,
    distance: "85 km",
    driveTime: "90 min",
    driveTimeMin: 90,
    access: "A1 puis A86 puis A5",
    landmarks: ["Préfecture", "Île Saint-Étienne"],
    industries: ["industrie", "metallerie", "promotion"],
    nearbyVilles: ["dammarie-les-lys", "vaux-le-penil", "le-mee-sur-seine", "savigny-le-temple"],
  },
  {
    slug: "chelles",
    name: "Chelles",
    department: "Seine-et-Marne",
    departmentCode: "77",
    population: 56000,
    distance: "48 km",
    driveTime: "55 min",
    driveTimeMin: 55,
    access: "A1 puis A104",
    industries: ["metallerie", "promotion", "particuliers"],
    nearbyVilles: ["vaires-sur-marne", "brou-sur-chantereine", "champs-sur-marne", "noisy-le-grand"],
  },
  {
    slug: "fontainebleau",
    name: "Fontainebleau",
    department: "Seine-et-Marne",
    departmentCode: "77",
    population: 14500,
    distance: "100 km",
    driveTime: "100 min",
    driveTimeMin: 100,
    access: "A1 puis A86 puis A6",
    landmarks: ["Château de Fontainebleau", "Forêt"],
    industries: ["ferronnerie", "architectes", "particuliers"],
    nearbyVilles: ["avon", "bois-le-roi", "samois-sur-seine", "vulaines-sur-seine"],
  },

  /* ────────────────────────────────────────────────────────────────
   *  60 — Oise (limitrophe, drive ≤ 45 min)
   * ──────────────────────────────────────────────────────────────── */
  {
    slug: "chantilly",
    name: "Chantilly",
    department: "Oise",
    departmentCode: "60",
    population: 11000,
    distance: "30 km",
    driveTime: "35 min",
    driveTimeMin: 35,
    access: "A1 puis RD1017",
    landmarks: ["Château de Chantilly", "Hippodrome", "Grandes Écuries"],
    industries: ["ferronnerie", "particuliers", "architectes"],
    nearbyVilles: ["senlis", "creil", "lisle-adam", "gouvieux"],
    customIntro:
      "Mondialement connue pour son château, ses écuries et son hippodrome, Chantilly est une ville d'exception où l'esthétique compte. Les propriétaires d'écuries, de manoirs et de résidences de prestige font appel au thermolaquage pour l'entretien de boxes équestres métalliques, de portails domaniaux et de mobilier extérieur haut de gamme.",
  },
  {
    slug: "creil",
    name: "Creil",
    department: "Oise",
    departmentCode: "60",
    population: 35000,
    distance: "35 km",
    driveTime: "40 min",
    driveTimeMin: 40,
    access: "A1 puis RD1016",
    industries: ["industrie", "chaudronnerie", "automobile"],
    nearbyVilles: ["chantilly", "senlis", "nogent-sur-oise", "montataire"],
  },
  {
    slug: "senlis",
    name: "Senlis",
    department: "Oise",
    departmentCode: "60",
    population: 16500,
    distance: "40 km",
    driveTime: "45 min",
    driveTimeMin: 45,
    access: "A1 sortie Senlis",
    landmarks: ["Cathédrale Notre-Dame", "Cité médiévale"],
    industries: ["ferronnerie", "particuliers", "architectes"],
    nearbyVilles: ["chantilly", "creil", "pont-sainte-maxence", "fleurines"],
  },
  {
    slug: "beauvais",
    name: "Beauvais",
    department: "Oise",
    departmentCode: "60",
    population: 56000,
    distance: "55 km",
    driveTime: "60 min",
    driveTimeMin: 60,
    access: "A16 direct",
    landmarks: ["Cathédrale Saint-Pierre", "Préfecture"],
    industries: ["industrie", "metallerie", "promotion"],
    nearbyVilles: ["compiegne", "noyon", "creil", "pontoise"],
  },
];

/* ── Public API ───────────────────────────────────────────────────── */

/** Légacy alias, gardé pour les autres modules qui l'importaient. */
export const VILLES = VILLES_FALLBACK;

export function getVilleBySlug(slug: string): Ville | undefined {
  return VILLES_FALLBACK.find((v) => v.slug === slug);
}

/**
 * Async wrappers — l'app appelle souvent en `await` car l'ancien code
 * passait par Sanity. On garde la signature, la source est maintenant
 * 100 % en-repo.
 */
export async function getVilles(): Promise<Ville[]> {
  return VILLES_FALLBACK;
}

export async function getVilleBySlugAsync(
  slug: string,
): Promise<Ville | undefined> {
  return VILLES_FALLBACK.find((v) => v.slug === slug);
}

/** Toutes les villes d'un département (hub pages). */
export function getVillesByDepartment(code: DepartmentCode): Ville[] {
  return VILLES_FALLBACK.filter((v) => v.departmentCode === code);
}

/** Tier de proximité, sert au template et au tri. */
export type DriveTier = "proche" | "moyen" | "loin";

export function driveTier(min: number): DriveTier {
  if (min <= 25) return "proche";
  if (min <= 55) return "moyen";
  return "loin";
}
