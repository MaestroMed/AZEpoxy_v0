import type { DepartmentCode } from "@/lib/villes-data";

/**
 * Copy long-form unique par département. Chaque entrée est rédigée à
 * la main (~250-350 mots) et reflète un vrai contexte économique
 * vérifiable du département. Sert à pousser les pages hub au-dessus
 * de 800 mots, avec du contenu Editorial-grade plutôt que du
 * remplissage SEO templated.
 *
 * Anti-doorway : la véracité prime — pas d'invention. Chaque dept
 * mentionne ses vraies industries, infrastructures et bassins d'emploi
 * principaux.
 */

export interface DeptLongForm {
  /** Titre court de section (~5 mots). */
  sectionTitle: string;
  /** Paragraphes — 2 à 3 blocs de 80-150 mots chacun. */
  paragraphs: string[];
  /** 3-5 use-cases concrets ancrés au territoire. */
  useCases: { title: string; description: string }[];
}

export const DEPT_LONGFORM: Partial<Record<DepartmentCode, DeptLongForm>> = {
  "95": {
    sectionTitle: "Le thermolaquage en Val-d'Oise",
    paragraphs: [
      "Le Val-d'Oise concentre une économie hybride entre couronne périurbaine et tissu industriel historique. À l'ouest, le bassin Cergy-Pontoise abrite l'agglomération nouvelle, son université, ses sièges sociaux et un dense réseau d'artisans bâtiment. À l'est, Sarcelles, Garges-lès-Gonesse et le pôle aéroportuaire Roissy-CDG portent les chantiers de rénovation urbaine ANRU et les flux logistiques. Notre atelier de Bruyères-sur-Oise, au nord du département, est à moins de 30 minutes de la plupart des communes — un avantage logistique décisif pour les pièces volumineuses ou les enlèvements groupés.",
      "Les demandes les plus fréquentes que nous recevons du 95 concernent les portails et clôtures résidentielles, les garde-corps de copropriétés en réhabilitation, les ferronneries d'art autour de Montmorency / Enghien-les-Bains, et les pièces de chaudronnerie ou de structure métallique pour les zones d'activité de Saint-Ouen-l'Aumône, Persan et Argenteuil. Le délai standard de 5 à 10 jours ouvrés permet d'absorber les cadences hebdomadaires des serruriers et métalliers locaux.",
    ],
    useCases: [
      {
        title: "Bailleurs sociaux Sarcelles / Garges",
        description:
          "Reprise complète de garde-corps de balcon, clôtures et portails dans le cadre des opérations ANRU.",
      },
      {
        title: "Promoteurs Cergy-Pontoise",
        description:
          "Fourniture de menuiseries aluminium thermolaquées pour les programmes neufs du Grand Paris.",
      },
      {
        title: "Particuliers Montmorency / Enghien",
        description:
          "Restauration de portails domaniaux, balcons en fer forgé et grilles de villas Belle Époque.",
      },
      {
        title: "Industriels Saint-Ouen-l'Aumône",
        description:
          "Pièces de série, châssis, structures pour les zones d'activité de la vallée de l'Oise.",
      },
    ],
  },

  "92": {
    sectionTitle: "Le thermolaquage en Hauts-de-Seine",
    paragraphs: [
      "Le 92 est l'un des départements les plus tertiarisés de France, dominé par La Défense — premier quartier d'affaires européen — et son chapelet de tours qui s'étend de Courbevoie à Puteaux. En contrepoint, le territoire conserve un tissu industriel et artisanal solide : l'axe Seine de Boulogne à Gennevilliers, les ateliers historiques de Nanterre (quartier des Groues), et les fronts de réhabilitation du Trapèze à Boulogne. Les commandes que nous recevons depuis le 92 viennent autant des grands chantiers tertiaires que des particuliers haut de gamme de Neuilly-sur-Seine et Boulogne-Billancourt.",
      "Ce territoire densifié appelle un traitement de surface qui résiste à l'air marin léger de la Seine, aux particules urbaines, et aux écarts thermiques entre îlots de chaleur et passages d'ombre des tours. Le thermolaquage poudre époxy y est particulièrement adapté : protection longue durée sans entretien, finitions ferronnerie d'art ou architecturales, et une compatibilité totale avec les exigences environnementales locales (0 COV, sans solvant).",
    ],
    useCases: [
      {
        title: "Architectes & BE La Défense",
        description:
          "Conseil amont sur teintes RAL et NCS, échantillons sur chantier, garde-corps et menuiseries pour bureaux haut de gamme.",
      },
      {
        title: "Promoteurs Boulogne / Issy-les-Moulineaux",
        description:
          "Ferronnerie de bâtiment et mobilier extérieur pour les programmes neufs du Trapèze et de l'Île Seguin.",
      },
      {
        title: "Particuliers Neuilly / Suresnes",
        description:
          "Restauration de balcons haussmanniens, portails de villas et mobilier de jardin haut de gamme.",
      },
      {
        title: "Industriels Asnières / Gennevilliers",
        description:
          "Pièces de série pour les zones portuaires et les ateliers de la rive Seine.",
      },
    ],
  },

  "93": {
    sectionTitle: "Le thermolaquage en Seine-Saint-Denis",
    paragraphs: [
      "Le 93 vit une mutation industrielle accélérée. La Plaine Saint-Denis, ancien bassin sidérurgique, est devenue un pôle tertiaire et culturel majeur avec le Stade de France et les hubs media. Mais en parallèle, le tissu chaudronnier et métallier reste actif sur Aubervilliers, Bobigny, Drancy, Pantin — autant de communes où nos clients sont des PME industrielles, des bailleurs sociaux pour les grandes opérations de rénovation, et des architectes engagés dans le réaménagement post-JO 2024.",
      "Le 93 est aussi un département où la résistance au vandalisme et à la sollicitation urbaine compte particulièrement. Nous proposons systématiquement un traitement anti-graffiti et des finitions résistantes au nettoyage haute pression. Pour le mobilier urbain des collectivités du département, le thermolaquage poudre époxy reste la finition de référence — durabilité 15-20 ans, anti-UV, anti-corrosion, et compatible avec les exigences ANRU.",
    ],
    useCases: [
      {
        title: "Chaudronniers La Plaine Saint-Denis",
        description:
          "Sous-traitance de finition pour pièces et ensembles chaudronnés, cabine 7 × 3 × 4 m capable d'accueillir les ouvrages volumineux.",
      },
      {
        title: "Bailleurs sociaux Bobigny / Drancy",
        description:
          "Reprise massive de garde-corps de balcon et clôtures dans le cadre des projets de réhabilitation urbaine.",
      },
      {
        title: "Mobilier urbain Saint-Denis",
        description:
          "Bancs, candélabres, abris bus et signalétique — traitement anti-graffiti compatible nettoyage haute pression.",
      },
      {
        title: "Promoteurs JO 2024",
        description:
          "Ferronnerie de bâtiment pour les opérations héritage du village des athlètes et des équipements sportifs.",
      },
    ],
  },

  "94": {
    sectionTitle: "Le thermolaquage en Val-de-Marne",
    paragraphs: [
      "Le Val-de-Marne combine pôle administratif (Créteil), tissu pavillonnaire résidentiel et bordures de Marne où subsiste un héritage industriel actif. Le département est traversé par le Grand Paris Express en construction, qui multiplie les chantiers de génie civil et de réaménagement. Nos demandes types depuis le 94 : ferronnerie d'art autour de Saint-Maur-des-Fossés et Vincennes, structures métalliques pour les ZAC de Vitry-sur-Seine et Ivry-sur-Seine, et des projets résidentiels haut de gamme à Joinville et Champigny.",
      "Le Val-de-Marne a une spécificité intéressante : sa proximité avec les chantiers du Grand Paris (Olympiades, gare de Vitry, prolongement Métro 14, RER E à Champigny) génère une demande continue de pièces métalliques sur-mesure. Notre service express 48 h est régulièrement sollicité pour absorber les pics liés à ces chantiers.",
    ],
    useCases: [
      {
        title: "Ferronniers Saint-Maur / Vincennes",
        description:
          "Restauration de grilles ouvragées, balcons en fer forgé et portails de demeures bourgeoises.",
      },
      {
        title: "BTP Grand Paris Express",
        description:
          "Pièces métalliques sur-mesure pour les chantiers d'infrastructure et de stations.",
      },
      {
        title: "Industriels Vitry / Ivry",
        description:
          "Sous-traitance de finition pour les zones d'activité de la rive Seine.",
      },
      {
        title: "Particuliers Joinville / Champigny",
        description:
          "Portails, clôtures et mobilier extérieur pour les quartiers pavillonnaires.",
      },
    ],
  },

  "78": {
    sectionTitle: "Le thermolaquage en Yvelines",
    paragraphs: [
      "Le 78 est le département de l'IDF qui mêle le plus densément patrimoine classé et industrie de pointe. Versailles concentre les ferronniers d'art et les chantiers de restauration du patrimoine royal. Saint-Germain-en-Laye et la boucle de Seine attirent une clientèle haut de gamme attentive aux finitions. Poissy et Aulnay-sous-Bois (95 limitrophe) restent des poumons industriels automobiles (PSA / Stellantis). Mantes-la-Jolie joue le rôle de pôle économique de l'ouest francilien avec son hôpital intercommunal et ses zones d'activité Buchelay.",
      "Cette double identité — patrimoine classé d'un côté, industrie technique de l'autre — appelle des finitions de très haut niveau. Nos clients yvelinois sont autant des artisans ferronniers (avec qui nous collaborons sur des finitions mates et patinées spécifiques) que des ateliers automobiles (qui nous confient jantes, carénages et pièces custom). Le respect des normes Qualicoat / ISO 12944 est particulièrement scruté ici, notamment sur les chantiers d'architectes du patrimoine.",
    ],
    useCases: [
      {
        title: "Ferronnerie d'art Versailles",
        description:
          "Restauration de grilles d'hôtels particuliers, ferronneries de jardin et menuiseries classées avec finitions mates et patines architecturales.",
      },
      {
        title: "Architectes du patrimoine",
        description:
          "Conseil amont sur teintes RAL conformes aux ABF, échantillons et suivi de chantier sur monuments classés.",
      },
      {
        title: "Automobile Poissy / Mantes",
        description:
          "Jantes, carénages et pièces custom auto haut de gamme — toute la palette RAL + collections premium.",
      },
      {
        title: "Particuliers Saint-Germain / Le Vésinet",
        description:
          "Portails de villas, balcons et mobilier extérieur pour les propriétés de prestige de la boucle de Seine.",
      },
    ],
  },

  "91": {
    sectionTitle: "Le thermolaquage en Essonne",
    paragraphs: [
      "Le 91 est un département moins dense mais à fort potentiel technologique. Le plateau de Saclay, avec ses grandes écoles, l'École Polytechnique et le Génopole d'Évry-Courcouronnes, attire une clientèle de PME tech et de bureaux d'études exigeants sur la qualité de finition. Massy joue le rôle de hub transport (TGV, RER B, RER C). Corbeil-Essonnes conserve un tissu industriel actif autour de l'imprimerie et de la métallerie.",
      "Le 91 est en outre un département à forte demande résidentielle, avec de nombreux lotissements neufs sur sa moitié sud (Savigny-sur-Orge, Sainte-Geneviève-des-Bois). Les particuliers nous confient leurs portails, clôtures et mobilier de jardin pour des finitions tenant 15 à 20 ans sans entretien. Pour les chantiers tertiaires du plateau de Saclay et de Massy, nous proposons un planning dédié et un suivi de chantier compatible avec les exigences des bureaux d'études.",
    ],
    useCases: [
      {
        title: "Bureaux d'études Saclay / Massy",
        description:
          "Conseil amont sur teintes RAL et NCS, ferronnerie d'architecture pour les programmes tertiaires.",
      },
      {
        title: "Industriels Corbeil-Essonnes",
        description:
          "Pièces de série, châssis, structures métalliques pour le tissu PMI de la sud-est francilienne.",
      },
      {
        title: "Particuliers lotissements sud-91",
        description:
          "Portails, clôtures et mobilier de jardin pour les programmes pavillonnaires neufs.",
      },
      {
        title: "Recherche & Génopole",
        description:
          "Pièces techniques pour laboratoires et équipements de recherche — précision et homogénéité de finition.",
      },
    ],
  },

  "77": {
    sectionTitle: "Le thermolaquage en Seine-et-Marne",
    paragraphs: [
      "Le 77 est le département le plus vaste de l'IDF et l'un des plus diversifiés. Meaux concentre une croissance démographique soutenue qui appuie la demande en construction neuve (lotissements, copropriétés, ferronnerie de bâtiment). Marne-la-Vallée et Chelles forment un pôle économique en lien direct avec Paris via le RER A. Melun, préfecture, abrite des PME industrielles diverses. Fontainebleau et son canton attirent une clientèle de châteaux, équidés et résidences secondaires haut de gamme.",
      "Le 77 a la particularité d'être un département où le tissu rural / agricole côtoie des pôles urbains modernes. Cette diversité se reflète dans nos demandes : portails de fermes restaurées, structures de hangars agricoles, équipements équestres (boxes, barrières), aux côtés de menuiseries aluminium de logements neufs et de ferronnerie d'art pour les châteaux du Brie. Le délai et la logistique d'enlèvement sont calibrés en fonction de la commune, sachant que les villes les plus éloignées (Fontainebleau, Melun) bénéficient d'un transport groupé optimisé.",
    ],
    useCases: [
      {
        title: "Constructeurs maisons individuelles Meaux",
        description:
          "Portails et clôtures pour les lotissements neufs en pleine croissance démographique.",
      },
      {
        title: "Ferronnerie d'art Fontainebleau",
        description:
          "Restauration de grilles de châteaux et résidences secondaires haut de gamme.",
      },
      {
        title: "Agricole & équestre Brie",
        description:
          "Structures de hangars, boxes équestres, barrières et équipements de fermes restaurées.",
      },
      {
        title: "PMI Melun / Marne-la-Vallée",
        description:
          "Sous-traitance de finition pour les zones d'activité du pôle économique de l'est francilien.",
      },
    ],
  },

  "60": {
    sectionTitle: "Le thermolaquage dans l'Oise (60)",
    paragraphs: [
      "L'Oise est limitrophe du Val-d'Oise — nos communes proches comme Beaumont-sur-Oise, Persan ou Bruyères se prolongent naturellement vers Chantilly, Senlis, Creil et au-delà. C'est un territoire à forte identité patrimoniale (Chantilly et ses écuries, Senlis cité médiévale) couplé à un tissu industriel actif autour de Creil (sidérurgie historique reconvertie en métallerie) et Beauvais (préfecture, sous-traitance industrielle).",
      "Notre proximité immédiate avec ces communes (15 à 45 minutes selon la destination) nous permet d'absorber les commandes du sud Oise avec la même réactivité qu'un atelier local. Les clients typiques : ateliers métalliers de la vallée de l'Oise, propriétaires d'écuries et de manoirs autour de Chantilly avec des demandes de très haute finition, et industriels de Beauvais et Creil pour la sous-traitance de série.",
    ],
    useCases: [
      {
        title: "Écuries & manoirs Chantilly",
        description:
          "Entretien de boxes équestres métalliques, portails domaniaux et mobilier extérieur haut de gamme.",
      },
      {
        title: "Métalliers vallée de l'Oise",
        description:
          "Cadences hebdomadaires pour portails, garde-corps et structures soudées — logistique courte distance.",
      },
      {
        title: "Industriels Creil / Beauvais",
        description:
          "Sous-traitance de série, châssis et structures pour le bassin économique du sud-Oise.",
      },
      {
        title: "Patrimoine Senlis",
        description:
          "Restauration de ferronneries d'art et menuiseries métalliques de la cité médiévale.",
      },
    ],
  },
};
