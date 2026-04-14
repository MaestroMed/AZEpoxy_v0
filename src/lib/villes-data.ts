/**
 * Données SEO des villes desservies par AZ Époxy
 * depuis l'atelier de Bruyères-sur-Oise (95820).
 */

export interface Ville {
  slug: string;
  name: string;
  department: string;
  departmentCode: string;
  distance: string;
  driveTime: string;
  access: string;
  localContext: string;
  nearbyVilles: string[];
}

export const VILLES: Ville[] = [
  {
    slug: "cergy",
    name: "Cergy",
    department: "Val-d'Oise",
    departmentCode: "95",
    distance: "15 km",
    driveTime: "20 min",
    access: "A15 puis RD927",
    localContext:
      "Ville nouvelle dynamique avec son université, son quartier d'affaires Major et le port fluvial de Cergy-Pontoise, Cergy accueille de nombreux professionnels du bâtiment et de l'industrie. Nos services de thermolaquage répondent aux exigences des projets architecturaux du Grand Paris et des rénovations de garde-corps, portails et mobilier urbain dans l'agglomération.",
    nearbyVilles: ["pontoise", "taverny", "argenteuil", "nanterre"],
  },
  {
    slug: "pontoise",
    name: "Pontoise",
    department: "Val-d'Oise",
    departmentCode: "95",
    distance: "12 km",
    driveTime: "15 min",
    access: "A15 sortie Pontoise Centre",
    localContext:
      "Préfecture du Val-d'Oise et cité d'art chargée d'histoire, Pontoise mêle patrimoine médiéval et développement urbain moderne. Les artisans ferronniers, les architectes du centre historique et les copropriétés de la ville font régulièrement appel au thermolaquage pour rénover rampes d'escalier, grilles ouvragées et menuiseries métalliques.",
    nearbyVilles: ["cergy", "taverny", "montmorency", "lisle-adam"],
  },
  {
    slug: "sarcelles",
    name: "Sarcelles",
    department: "Val-d'Oise",
    departmentCode: "95",
    distance: "25 km",
    driveTime: "30 min",
    access: "A1 puis A16 direction Beauvais",
    localContext:
      "Deuxième commune du Val-d'Oise par sa population, Sarcelles connaît un vaste programme de rénovation urbaine dans ses grands ensembles. Le thermolaquage y est très demandé pour le traitement des garde-corps de balcon, des portails résidentiels et des clôtures de copropriétés dans le cadre des opérations ANRU.",
    nearbyVilles: ["argenteuil", "montmorency", "saint-denis", "enghien-les-bains"],
  },
  {
    slug: "argenteuil",
    name: "Argenteuil",
    department: "Val-d'Oise",
    departmentCode: "95",
    distance: "30 km",
    driveTime: "35 min",
    access: "A15 puis A115 direction Paris",
    localContext:
      "Plus grande ville du Val-d'Oise, Argenteuil allie tissu industriel historique le long de la Seine et quartiers résidentiels en pleine mutation. Les ateliers mécaniques, les chantiers de réhabilitation de la ZAC des Berges et les particuliers amateurs d'automobile font d'Argenteuil un bassin de demande important pour le thermolaquage de jantes, châssis et pièces industrielles.",
    nearbyVilles: ["nanterre", "sarcelles", "enghien-les-bains", "cergy"],
  },
  {
    slug: "enghien-les-bains",
    name: "Enghien-les-Bains",
    department: "Val-d'Oise",
    departmentCode: "95",
    distance: "22 km",
    driveTime: "25 min",
    access: "A15 puis RD311",
    localContext:
      "Ville thermale et résidentielle prisée, Enghien-les-Bains se distingue par ses villas Belle Époque, son casino et les façades élégantes bordant le lac. Le thermolaquage haut de gamme y est recherché pour la restauration de ferronneries d'art, de balcons en fer forgé et de portails de prestige, avec une attention particulière aux finitions mates et satinées.",
    nearbyVilles: ["montmorency", "sarcelles", "argenteuil", "saint-denis"],
  },
  {
    slug: "montmorency",
    name: "Montmorency",
    department: "Val-d'Oise",
    departmentCode: "95",
    distance: "20 km",
    driveTime: "25 min",
    access: "A115 puis RD928",
    localContext:
      "Perchée sur la colline qui porte son nom, Montmorency est connue pour sa forêt, ses cerisiers et le musée Jean-Jacques Rousseau. Les propriétaires de maisons individuelles et de résidences de caractère y sollicitent le thermolaquage pour entretenir portails, volets métalliques et mobilier de jardin dans des teintes classiques ou sur mesure.",
    nearbyVilles: ["enghien-les-bains", "taverny", "sarcelles", "pontoise"],
  },
  {
    slug: "taverny",
    name: "Taverny",
    department: "Val-d'Oise",
    departmentCode: "95",
    distance: "15 km",
    driveTime: "20 min",
    access: "A115 puis RD928 direction Taverny",
    localContext:
      "Située en lisière de la forêt de Montmorency, Taverny conjugue cadre verdoyant et proximité de la capitale. L'ancienne base aérienne reconvertie et les nombreux pavillons résidentiels génèrent une demande régulière de thermolaquage pour portails, clôtures et structures métalliques de jardin.",
    nearbyVilles: ["montmorency", "pontoise", "cergy", "lisle-adam"],
  },
  {
    slug: "lisle-adam",
    name: "L'Isle-Adam",
    department: "Val-d'Oise",
    departmentCode: "95",
    distance: "8 km",
    driveTime: "10 min",
    access: "RD4 direction L'Isle-Adam",
    localContext:
      "Petite ville de charme en bord d'Oise, L'Isle-Adam est réputée pour sa plage fluviale, son patrimoine architectural et ses demeures de caractère. La proximité immédiate avec notre atelier de Bruyères-sur-Oise en fait l'une des communes les plus faciles à desservir pour le thermolaquage de garde-corps, grilles et mobilier extérieur.",
    nearbyVilles: ["beaumont-sur-oise", "persan", "taverny", "chantilly"],
  },
  {
    slug: "beaumont-sur-oise",
    name: "Beaumont-sur-Oise",
    department: "Val-d'Oise",
    departmentCode: "95",
    distance: "3 km",
    driveTime: "5 min",
    access: "RD1001 direction Beaumont",
    localContext:
      "Voisine immédiate de Bruyères-sur-Oise, Beaumont-sur-Oise bénéficie de la proximité la plus directe avec notre atelier. La commune, traversée par l'Oise et dotée d'un riche patrimoine bâti, fait appel à nos services pour la rénovation de rambardes de pont, le traitement de menuiseries métalliques et le thermolaquage de pièces pour les artisans locaux.",
    nearbyVilles: ["persan", "lisle-adam", "pontoise", "creil"],
  },
  {
    slug: "persan",
    name: "Persan",
    department: "Val-d'Oise",
    departmentCode: "95",
    distance: "5 km",
    driveTime: "8 min",
    access: "RD1001 via Bruyères-sur-Oise",
    localContext:
      "Commune limitrophe de Bruyères-sur-Oise, Persan dispose d'une zone industrielle active et d'un tissu de PME dans le secteur de la métallurgie et de la construction. Notre atelier situé à quelques minutes permet d'assurer des délais de livraison très courts pour le thermolaquage de pièces industrielles, mobilier et éléments de serrurerie.",
    nearbyVilles: ["beaumont-sur-oise", "lisle-adam", "creil", "senlis"],
  },
  {
    slug: "paris",
    name: "Paris",
    department: "Paris",
    departmentCode: "75",
    distance: "40 km",
    driveTime: "45 min",
    access: "A1 ou A16 puis Périphérique",
    localContext:
      "Capitale et premier marché français, Paris concentre une demande intense en thermolaquage : architectes d'intérieur, designers de mobilier, restaurateurs de ferronneries haussmanniennes, garages automobiles haut de gamme et entreprises du BTP. Nous desservons l'ensemble des arrondissements et proposons un service de collecte et livraison pour les volumes importants.",
    nearbyVilles: ["saint-denis", "nanterre", "boulogne-billancourt", "montreuil"],
  },
  {
    slug: "saint-denis",
    name: "Saint-Denis",
    department: "Seine-Saint-Denis",
    departmentCode: "93",
    distance: "35 km",
    driveTime: "40 min",
    access: "A1 direction Paris, sortie Saint-Denis",
    localContext:
      "Ville olympique en pleine transformation, Saint-Denis voit émerger de nombreux projets architecturaux autour du Stade de France et du Village olympique. Le thermolaquage est très sollicité pour les structures métalliques, garde-corps et mobilier urbain de ces grands chantiers, ainsi que pour les ateliers d'artistes installés dans les anciennes friches industrielles.",
    nearbyVilles: ["paris", "sarcelles", "bobigny", "argenteuil"],
  },
  {
    slug: "montreuil",
    name: "Montreuil",
    department: "Seine-Saint-Denis",
    departmentCode: "93",
    distance: "45 km",
    driveTime: "50 min",
    access: "A1 puis A3 direction Montreuil",
    localContext:
      "Haut lieu de la création artistique et du design en Ile-de-France, Montreuil accueille des centaines d'ateliers de designers, de fabricants de mobilier et de créateurs d'objets métalliques. Le thermolaquage y est prisé pour les finitions sur mesure, les teintes originales et les petites séries de pièces uniques en acier et aluminium.",
    nearbyVilles: ["paris", "bobigny", "creteil", "saint-denis"],
  },
  {
    slug: "bobigny",
    name: "Bobigny",
    department: "Seine-Saint-Denis",
    departmentCode: "93",
    distance: "40 km",
    driveTime: "45 min",
    access: "A1 puis A3 direction Bobigny",
    localContext:
      "Préfecture de la Seine-Saint-Denis, Bobigny est au coeur d'un vaste bassin industriel et tertiaire. Les entreprises de construction métallique, les chantiers du Grand Paris Express et les copropriétés en rénovation constituent une clientèle régulière pour nos prestations de sablage, métallisation et thermolaquage.",
    nearbyVilles: ["saint-denis", "montreuil", "paris", "sarcelles"],
  },
  {
    slug: "nanterre",
    name: "Nanterre",
    department: "Hauts-de-Seine",
    departmentCode: "92",
    distance: "40 km",
    driveTime: "45 min",
    access: "A15 puis A86 direction Nanterre",
    localContext:
      "Siège du quartier d'affaires de La Défense et préfecture des Hauts-de-Seine, Nanterre associe tours de bureaux et quartiers résidentiels en mutation. Le thermolaquage y répond aux besoins des promoteurs immobiliers, des architectes de La Défense et des copropriétés du centre-ville pour le traitement de menuiseries aluminium, garde-corps et structures décoratives.",
    nearbyVilles: ["paris", "boulogne-billancourt", "argenteuil", "cergy"],
  },
  {
    slug: "boulogne-billancourt",
    name: "Boulogne-Billancourt",
    department: "Hauts-de-Seine",
    departmentCode: "92",
    distance: "45 km",
    driveTime: "50 min",
    access: "A15 puis A86 direction Boulogne",
    localContext:
      "Ville la plus peuplée d'Ile-de-France après Paris, Boulogne-Billancourt abrite studios de télévision, sièges sociaux et résidences haut de gamme le long de la Seine. Le thermolaquage de qualité premium y est demandé pour du mobilier design, des éléments de façade et des pièces automobiles de collection, avec une exigence forte sur les finitions et la tenue des couleurs.",
    nearbyVilles: ["paris", "nanterre", "versailles", "saint-germain-en-laye"],
  },
  {
    slug: "versailles",
    name: "Versailles",
    department: "Yvelines",
    departmentCode: "78",
    distance: "55 km",
    driveTime: "55 min",
    access: "A15 puis A86 et A13 direction Versailles",
    localContext:
      "Célèbre pour son château et ses jardins, Versailles est aussi une ville résidentielle exigeante où le patrimoine architectural impose des standards élevés. Les ferronneries des hôtels particuliers, les grilles de parcs privés et les portails des quartiers résidentiels de Saint-Louis et de Montreuil nécessitent un thermolaquage soigné dans des teintes traditionnelles ou contemporaines.",
    nearbyVilles: ["saint-germain-en-laye", "boulogne-billancourt", "nanterre", "paris"],
  },
  {
    slug: "saint-germain-en-laye",
    name: "Saint-Germain-en-Laye",
    department: "Yvelines",
    departmentCode: "78",
    distance: "45 km",
    driveTime: "45 min",
    access: "A15 puis A104 direction Saint-Germain",
    localContext:
      "Ville royale surplombant la vallée de la Seine, Saint-Germain-en-Laye allie forêt domaniale, terrasse Le Nôtre et centre-ville animé. Les propriétaires de maisons bourgeoises et les syndics de copropriété du secteur font appel au thermolaquage pour la restauration de balcons, volets métalliques et portails en fer forgé, souvent dans le respect des prescriptions de l'Architecte des Bâtiments de France.",
    nearbyVilles: ["versailles", "nanterre", "cergy", "pontoise"],
  },
  {
    slug: "beauvais",
    name: "Beauvais",
    department: "Oise",
    departmentCode: "60",
    distance: "50 km",
    driveTime: "45 min",
    access: "A16 direction Beauvais, sortie 14",
    localContext:
      "Préfecture de l'Oise et ville d'art célèbre pour sa cathédrale gothique, Beauvais est aussi un pôle industriel et aéroportuaire. L'aéroport Paris-Beauvais et les zones d'activités environnantes génèrent une demande soutenue en traitement de surface pour structures métalliques, équipements aéronautiques et mobilier de bureaux professionnels.",
    nearbyVilles: ["creil", "senlis", "chantilly", "persan"],
  },
  {
    slug: "creil",
    name: "Creil",
    department: "Oise",
    departmentCode: "60",
    distance: "25 km",
    driveTime: "25 min",
    access: "A16 puis RD1016 direction Creil",
    localContext:
      "Ancienne ville sidérurgique sur les bords de l'Oise, Creil conserve un fort tissu industriel et un savoir-faire métallurgique. La zone industrielle de Creil-Nogent abrite de nombreuses PME de la mécanique et de la chaudronnerie qui recourent régulièrement au sablage et au thermolaquage pour le traitement de pièces en série ou unitaires.",
    nearbyVilles: ["senlis", "chantilly", "beaumont-sur-oise", "persan"],
  },
  {
    slug: "senlis",
    name: "Senlis",
    department: "Oise",
    departmentCode: "60",
    distance: "30 km",
    driveTime: "30 min",
    access: "A16 puis A1 direction Senlis",
    localContext:
      "Joyau médiéval aux ruelles pavées et aux remparts gallo-romains, Senlis attire résidents fortunés et entreprises du secteur tertiaire. Les exigences patrimoniales des bâtiments classés et l'entretien des demeures de caractère créent une demande de thermolaquage de qualité pour grilles, portails et éléments décoratifs en fer forgé dans des teintes sobres et élégantes.",
    nearbyVilles: ["chantilly", "creil", "meaux", "beauvais"],
  },
  {
    slug: "chantilly",
    name: "Chantilly",
    department: "Oise",
    departmentCode: "60",
    distance: "25 km",
    driveTime: "25 min",
    access: "A16 puis D1016 direction Chantilly",
    localContext:
      "Mondialement connue pour son château, ses écuries et son hippodrome, Chantilly est une ville d'exception où l'esthétique compte. Les propriétaires d'écuries, de manoirs et de résidences de prestige font appel au thermolaquage pour l'entretien de boxes équestres métalliques, de portails domaniaux et de mobilier extérieur haut de gamme.",
    nearbyVilles: ["senlis", "creil", "lisle-adam", "beauvais"],
  },
  {
    slug: "creteil",
    name: "Créteil",
    department: "Val-de-Marne",
    departmentCode: "94",
    distance: "55 km",
    driveTime: "55 min",
    access: "A1 puis A86 direction Créteil",
    localContext:
      "Préfecture du Val-de-Marne, Créteil est un pôle administratif et universitaire majeur du sud-est francilien. Les chantiers du Grand Paris Express, la rénovation du quartier du Lac et les copropriétés des Choux de Gérard Grandval maintiennent une demande constante en thermolaquage de garde-corps, structures métalliques et mobilier urbain.",
    nearbyVilles: ["paris", "montreuil", "evry", "bobigny"],
  },
  {
    slug: "evry",
    name: "Évry-Courcouronnes",
    department: "Essonne",
    departmentCode: "91",
    distance: "70 km",
    driveTime: "60 min",
    access: "A1 puis A6 direction Évry",
    localContext:
      "Préfecture de l'Essonne et ville nouvelle, Évry-Courcouronnes est un centre universitaire et technologique en développement. Le quartier d'affaires Évry Centre République, le Génopole et les zones d'activités du sud francilien font appel au thermolaquage pour des projets allant du mobilier de bureau à la signalétique industrielle en passant par les aménagements extérieurs.",
    nearbyVilles: ["creteil", "paris", "versailles", "meaux"],
  },
  {
    slug: "meaux",
    name: "Meaux",
    department: "Seine-et-Marne",
    departmentCode: "77",
    distance: "60 km",
    driveTime: "55 min",
    access: "A1 puis A104 direction Meaux",
    localContext:
      "Sous-préfecture de Seine-et-Marne, Meaux est une ville en pleine expansion démographique avec de nombreux lotissements et programmes immobiliers neufs. La demande en thermolaquage y est portée par les constructeurs de maisons individuelles, les poseurs de portails et clôtures, ainsi que les particuliers souhaitant rénover leurs garde-corps et mobilier de jardin.",
    nearbyVilles: ["senlis", "bobigny", "creteil", "chantilly"],
  },
];

export function getVilleBySlug(slug: string): Ville | undefined {
  return VILLES.find((v) => v.slug === slug);
}
