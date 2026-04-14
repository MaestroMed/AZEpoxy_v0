/**
 * Services proposés par AZ Époxy — thermolaquage, sablage,
 * métallisation et finitions spéciales.
 */

export interface Service {
  slug: string;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  icon: string;
  features: { title: string; description: string }[];
  specs: { label: string; value: string }[];
  faqs: { question: string; answer: string }[];
}

export const SERVICES: Service[] = [
  {
    slug: "thermolaquage",
    title: "Thermolaquage Poudre Époxy",
    shortTitle: "Thermolaquage",
    tagline: "Une finition durable, esthétique et respectueuse de l'environnement",
    description:
      "Le thermolaquage par poudre époxy est notre spécialité. Ce procédé consiste à appliquer une poudre thermodurcissable sur un support métallique à l'aide d'un pistolet électrostatique, puis à polymériser l'ensemble en four à 200 °C. Le résultat : un revêtement ultra-résistant, homogène et disponible dans plus de 200 teintes RAL et effets spéciaux.",
    icon: "Paintbrush",
    features: [
      {
        title: "0 % COV — zéro émission de solvant",
        description:
          "Contrairement à la peinture liquide, la poudre époxy ne contient aucun composé organique volatil. Le procédé est conforme aux réglementations environnementales les plus strictes.",
      },
      {
        title: "200+ couleurs RAL & effets spéciaux",
        description:
          "Choisissez parmi l'ensemble du nuancier RAL Classic, des collections Adaptacolor premium et des finitions mates, satinées, brillantes, texturées ou mouchetées.",
      },
      {
        title: "Résistance UV exceptionnelle",
        description:
          "Les poudres polyester et époxy-polyester que nous utilisons conservent leur teinte et leur brillant même après des années d'exposition aux rayons ultraviolets.",
      },
      {
        title: "Adhérence exceptionnelle",
        description:
          "Grâce à la charge électrostatique et à la préparation de surface par sablage, la poudre épouse parfaitement le métal. Le test de quadrillage (cross-cut ISO 2409) atteint systématiquement la note 0.",
      },
      {
        title: "Épaisseur uniforme",
        description:
          "L'application électrostatique garantit une couche régulière de 60 à 80 µm sur l'ensemble de la pièce, y compris dans les recoins et les angles difficiles d'accès.",
      },
      {
        title: "Poudre 100 % recyclable",
        description:
          "Les surplus de poudre non déposés sont récupérés par le système de filtration de notre cabine et réintégrés dans le circuit d'application, limitant les déchets à moins de 2 %.",
      },
    ],
    specs: [
      { label: "Épaisseur du film", value: "60 – 80 µm" },
      { label: "Température de cuisson", value: "200 °C" },
      { label: "Durée de cuisson", value: "15 minutes" },
      { label: "Résistance UV", value: "Excellente" },
      { label: "Résistance aux chocs", value: "> 50 kg/cm" },
      { label: "Adhérence (cross-cut test)", value: "Classe 0 (ISO 2409)" },
      { label: "Normes", value: "ISO 12944 / QUALICOAT" },
    ],
    faqs: [
      {
        question: "Quelle est la différence entre thermolaquage et peinture liquide ?",
        answer:
          "Le thermolaquage utilise une poudre sèche chargée électrostatiquement, sans solvant, polymérisée au four à 200 °C. Le résultat est un film plus épais (60-80 µm contre 25-40 µm), plus résistant aux chocs et à la corrosion, et totalement exempt de COV. La peinture liquide nécessite des solvants et offre une tenue nettement inférieure dans le temps.",
      },
      {
        question: "Quels types de métaux peut-on thermolaquer ?",
        answer:
          "Tous les métaux conducteurs supportant une cuisson à 200 °C peuvent être thermolaqués : acier, acier galvanisé, aluminium, fonte, inox. Seuls les métaux non conducteurs ou les matériaux sensibles à la chaleur (plastique, bois) ne sont pas éligibles au procédé.",
      },
      {
        question: "Le thermolaquage résiste-t-il en extérieur ?",
        answer:
          "Oui, c'est même l'une de ses principales applications. Les poudres polyester et époxy-polyester que nous utilisons sont spécialement formulées pour résister aux UV, à l'humidité et aux variations de température. C'est pourquoi le thermolaquage est le revêtement de référence pour les portails, clôtures, mobilier urbain et façades métalliques.",
      },
      {
        question: "Peut-on thermolaquer une pièce déjà peinte ?",
        answer:
          "Oui, à condition de décaper intégralement l'ancien revêtement. Notre étape de sablage élimine toute trace de peinture, rouille ou calamine, ramenant le métal nu à un état de propreté SA 2.5. La pièce est alors prête à recevoir la nouvelle poudre dans les meilleures conditions d'adhérence.",
      },
    ],
  },
  {
    slug: "sablage",
    title: "Sablage & Grenaillage",
    shortTitle: "Sablage",
    tagline: "Préparer la surface, c'est garantir la tenue du revêtement",
    description:
      "Le sablage et le grenaillage sont des techniques de préparation de surface par projection d'abrasif à haute pression. Ils éliminent la rouille, la calamine, les anciennes peintures et les impuretés, créant un profil d'ancrage optimal pour tout revêtement ultérieur. Notre cabine de sablage de 7 mètres accueille des pièces de grande dimension.",
    icon: "Wind",
    features: [
      {
        title: "Décapage rouille & calamine",
        description:
          "La projection d'abrasif élimine efficacement toute trace d'oxydation, de calamine de laminage et de corrosion, même profondément incrustée, pour retrouver un métal sain.",
      },
      {
        title: "Préparation avant peinture ou thermolaquage",
        description:
          "Le sablage crée un profil de rugosité contrôlé (25 à 75 µm) indispensable à l'adhérence mécanique de la couche de peinture ou de poudre époxy.",
      },
      {
        title: "Nettoyage de pièces industrielles",
        description:
          "Suppression des résidus de graisse, de soudure, de dépôts calcaires et de toute contamination superficielle sur des pièces mécaniques, charpentes ou structures métalliques.",
      },
      {
        title: "Rénovation & remise à neuf",
        description:
          "Redonnez une seconde vie à vos jantes, portails, garde-corps, mobilier de jardin ou équipements industriels grâce à un décapage complet avant re-thermolaquage.",
      },
    ],
    specs: [
      { label: "Granulométrie abrasif", value: "0,2 – 2,0 mm" },
      { label: "Pression de projection", value: "4 – 8 bars" },
      { label: "Cabine de sablage", value: "7 m de longueur" },
      { label: "Normes de propreté", value: "SA 2.5 / SA 3 (ISO 8501-1)" },
    ],
    faqs: [
      {
        question: "Quelle est la différence entre sablage et grenaillage ?",
        answer:
          "Le sablage utilise un abrasif minéral (corindon, silice) projeté par air comprimé, tandis que le grenaillage projette de la grenaille d'acier ou d'inox par turbine. Le grenaillage est plus adapté aux grandes séries et aux aciers épais ; le sablage offre plus de finesse sur les pièces délicates.",
      },
      {
        question: "Le sablage abîme-t-il le métal ?",
        answer:
          "Non, à condition d'adapter la pression et la granulométrie à l'épaisseur du support. Nous réglons nos paramètres pour chaque type de pièce afin de ne retirer que les couches indésirables sans altérer la géométrie ni l'intégrité structurelle du métal.",
      },
      {
        question: "Peut-on sabler de l'aluminium ?",
        answer:
          "Oui, l'aluminium se sable très bien avec un abrasif fin (corindon blanc) à basse pression (3-4 bars). Nous adaptons systématiquement le média et la pression pour éviter toute déformation ou incrustation sur les alliages légers.",
      },
    ],
  },
  {
    slug: "metallisation",
    title: "Métallisation",
    shortTitle: "Métallisation",
    tagline: "Protection anti-corrosion extrême par projection thermique",
    description:
      "La métallisation consiste à projeter du zinc ou de l'aluminium fondu sur le métal de base à l'aide d'un pistolet à arc ou à flamme. Ce dépôt de 150 à 300 µm offre une protection cathodique sacrificielle comparable à la galvanisation, mais applicable sur site et sur des pièces de toute taille. Idéal pour les structures exposées en milieu marin, industriel ou enterré.",
    icon: "Layers",
    features: [
      {
        title: "Protection cathodique sacrificielle",
        description:
          "Le zinc se corrode préférentiellement à l'acier, protégeant le substrat même en cas de rayure ou d'écaillage local du revêtement. La durée de vie atteint 25 ans et plus.",
      },
      {
        title: "Applicable sur pièces de grande dimension",
        description:
          "Contrairement à la galvanisation à chaud qui nécessite un bain, la métallisation s'effectue au pistolet et s'adapte à des structures de plusieurs mètres, sans contrainte de taille de cuve.",
      },
      {
        title: "Compatible avec le thermolaquage",
        description:
          "La métallisation constitue une sous-couche idéale avant l'application d'une poudre époxy. Le système duplex (métallisation + thermolaquage) offre la durabilité maximale, jusqu'à 40 ans en environnement C5-M.",
      },
      {
        title: "Conforme aux normes anti-corrosion",
        description:
          "Nos métallisations respectent les exigences de la norme ISO 2063 et les catégories de corrosivité C3 à C5-M définies par la norme ISO 12944. Certificat de conformité fourni sur demande.",
      },
    ],
    specs: [
      { label: "Épaisseur dépôt zinc", value: "150 – 300 µm" },
      { label: "Norme de référence", value: "ISO 2063" },
      { label: "Durée de vie estimée", value: "25+ ans (système duplex)" },
      { label: "Catégories de corrosivité", value: "C3 à C5-M (ISO 12944)" },
    ],
    faqs: [
      {
        question: "Quand faut-il métalliser plutôt que galvaniser ?",
        answer:
          "La métallisation est préférable lorsque la pièce est trop volumineuse pour un bain de galvanisation, lorsqu'elle est déjà assemblée sur site, ou lorsqu'on souhaite appliquer un thermolaquage par-dessus. Elle est également utilisée en réparation ponctuelle de galvanisation endommagée.",
      },
      {
        question: "Zinc ou aluminium : comment choisir ?",
        answer:
          "Le zinc offre une meilleure protection cathodique en milieu atmosphérique et en eau douce. L'aluminium est préféré en milieu marin (eau de mer) et à haute température. Un alliage zinc-aluminium (85/15) combine les avantages des deux métaux pour les environnements les plus agressifs.",
      },
      {
        question: "Peut-on peindre ou thermolaquer sur une métallisation ?",
        answer:
          "Oui, c'est même recommandé. Le système duplex (métallisation + peinture ou thermolaquage) combine la protection cathodique du zinc avec la barrière physique de la couche de finition. La durée de vie est multipliée par 1,5 à 2 par rapport à chaque revêtement pris séparément.",
      },
    ],
  },
  {
    slug: "finitions",
    title: "Finitions Spéciales",
    shortTitle: "Finitions",
    tagline: "Sublimez vos pièces avec des effets uniques",
    description:
      "Au-delà du nuancier RAL standard, nous proposons une gamme de finitions spéciales qui apportent texture, relief et caractère à vos réalisations. Effets mat profond, satiné velouté, brillant miroir, texturé grainé, moucheté granite ou encore traitement anti-graffiti : chaque projet peut bénéficier d'une identité visuelle unique.",
    icon: "Palette",
    features: [
      {
        title: "Mat / Satiné / Brillant",
        description:
          "Contrôlez le niveau de brillance de votre revêtement, du mat profond (< 10 gloss) au brillant miroir (> 85 gloss), en passant par le satiné (30-50 gloss) pour un rendu élégant et contemporain.",
      },
      {
        title: "Texturé & grainé",
        description:
          "Les finitions texturées apportent du relief et masquent les petites imperfections de surface. Le grain fin type « cuir » ou « sable » est particulièrement prisé pour le mobilier et les éléments architecturaux.",
      },
      {
        title: "Moucheté & granite",
        description:
          "L'effet moucheté superpose des micro-particules de couleurs contrastées pour un rendu pierre ou granite très esthétique. Idéal pour les espaces publics, il dissimule les traces d'usure quotidienne.",
      },
      {
        title: "Traitement anti-graffiti",
        description:
          "Notre revêtement anti-graffiti crée une surface non poreuse sur laquelle les peintures et marqueurs ne pénètrent pas. Le nettoyage s'effectue simplement à l'eau chaude ou au nettoyant doux, sans solvant agressif.",
      },
    ],
    specs: [],
    faqs: [
      {
        question: "Les finitions spéciales coûtent-elles plus cher ?",
        answer:
          "Le surcoût dépend de la finition choisie. Les effets mat, satiné et brillant sont au même tarif que le thermolaquage standard. Les texturés, mouchetés et anti-graffiti entraînent un léger supplément lié au coût de la poudre spéciale, généralement de l'ordre de 10 à 20 %.",
      },
      {
        question: "Peut-on combiner une finition spéciale avec une teinte RAL ?",
        answer:
          "Absolument. La majorité des effets (mat, satiné, texturé, moucheté) sont disponibles dans l'ensemble du nuancier RAL. Pour les collections premium Adaptacolor (Patina, Polaris, Dichroic, Sfera), les teintes et effets sont propres à chaque gamme.",
      },
      {
        question: "L'anti-graffiti modifie-t-il l'aspect de la pièce ?",
        answer:
          "Non, le traitement anti-graffiti est transparent et n'altère ni la teinte ni la brillance du revêtement sous-jacent. Il peut être appliqué en surcouche sur toute finition thermolaquée, qu'elle soit lisse, texturée ou mouchetée.",
      },
    ],
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
