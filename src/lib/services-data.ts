/**
 * Services proposés par AZ Époxy — thermolaquage, sablage et finitions
 * spéciales. Tous les revêtements suivent les exigences QUALICOAT et les
 * normes ISO 12944 / 8501 / 2409 applicables.
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

export const SERVICES_FALLBACK: Service[] = [
  {
    slug: "thermolaquage",
    title: "Thermolaquage Poudre Époxy",
    shortTitle: "Thermolaquage",
    tagline:
      "Une finition durable, esthétique et respectueuse de l'environnement",
    description:
      "Le thermolaquage par poudre époxy est notre spécialité. Le procédé consiste à appliquer une poudre thermodurcissable de qualité architecturale sur un support métallique à l'aide d'un pistolet électrostatique, puis à polymériser l'ensemble en four. La durée de cuisson est ajustée à la masse et à la géométrie de chaque pièce. Le résultat : un revêtement ultra-résistant, homogène et disponible dans plus de 200 teintes RAL et NCS, plus une gamme d'effets spéciaux.",
    icon: "Paintbrush",
    features: [
      {
        title: "0 % COV — zéro émission de solvant",
        description:
          "Contrairement à la peinture liquide, la poudre époxy ne contient aucun composé organique volatil. Le procédé est conforme aux réglementations environnementales les plus strictes.",
      },
      {
        title: "200+ couleurs RAL & nuancier NCS",
        description:
          "Choisissez parmi l'ensemble du nuancier RAL Classic et du Natural Color System (NCS), avec des finitions mates, satinées, brillantes, texturées, mouchetées ou à effets architecturaux (corten, métalliques, irisés, anodisés).",
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
        title: "Poudre neuve, jamais réintégrée",
        description:
          "Nous travaillons exclusivement avec de la poudre certifiée fraîche : aucune réintégration en circuit d'application. C'est la garantie d'un rendu de finition irréprochable, sans micro-pollution ni dérive de teinte.",
      },
    ],
    specs: [
      { label: "Épaisseur du film", value: "60 – 80 µm" },
      { label: "Durée de cuisson", value: "Variable selon la pièce" },
      { label: "Résistance UV", value: "Excellente" },
      { label: "Résistance aux chocs", value: "> 50 kg/cm" },
      { label: "Adhérence (cross-cut test)", value: "Classe 0 (ISO 2409)" },
      { label: "Référentiel qualité", value: "QUALICOAT / ISO 12944" },
    ],
    faqs: [
      {
        question:
          "Quelle est la différence entre thermolaquage et peinture liquide ?",
        answer:
          "Le thermolaquage utilise une poudre sèche chargée électrostatiquement, sans solvant, polymérisée au four. Le résultat est un film plus épais (60-80 µm contre 25-40 µm), plus résistant aux chocs et à la corrosion, et totalement exempt de COV. La peinture liquide nécessite des solvants et offre une tenue nettement inférieure dans le temps.",
      },
      {
        question: "Quels types de métaux peut-on thermolaquer ?",
        answer:
          "Tous les métaux conducteurs supportant une cuisson en four peuvent être thermolaqués : acier, acier galvanisé, aluminium, fonte, inox. Seuls les métaux non conducteurs ou les matériaux sensibles à la chaleur (plastique, bois) ne sont pas éligibles au procédé.",
      },
      {
        question: "Le thermolaquage résiste-t-il en extérieur ?",
        answer:
          "Oui, c'est même l'une de ses principales applications. Les poudres polyester et époxy-polyester que nous utilisons sont spécialement formulées pour résister aux UV, à l'humidité et aux variations de température. C'est pourquoi le thermolaquage est le revêtement de référence pour les portails, clôtures, mobilier urbain, façades métalliques et structures de chaudronnerie.",
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
      "Le sablage et le grenaillage sont des techniques de préparation de surface par projection d'abrasif à haute pression. Ils éliminent la rouille, la calamine, les anciennes peintures et les impuretés, créant un profil d'ancrage optimal pour tout revêtement ultérieur. Notre cabine 7 × 3 × 4 m accueille des pièces de chaudronnerie, des charpentes, des portails et des structures industrielles de grande dimension.",
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
        title: "Pièces de chaudronnerie & structures",
        description:
          "Suppression des résidus de soudure, des dépôts calcaires et de toute contamination superficielle sur les pièces de chaudronnerie, charpentes, portails ou structures métalliques de grande série.",
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
      { label: "Cabine de sablage", value: "7 × 3 × 4 m" },
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
    slug: "finitions",
    title: "Finitions Spéciales",
    shortTitle: "Finitions",
    tagline: "Sublimez vos pièces avec des effets uniques",
    description:
      "Au-delà des nuanciers RAL et NCS, nous proposons une gamme de finitions spéciales qui apportent texture, relief et caractère à vos réalisations. Effets mat profond, satiné velouté, brillant miroir, texturé grainé, moucheté granite, effets architecturaux corten, métalliques, irisés, anodisés ou encore traitement anti-graffiti : chaque projet bénéficie d'une identité visuelle unique, le tout dans le respect du référentiel QUALICOAT.",
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
        title: "Effets architecturaux",
        description:
          "Effets corten (oxydation stabilisée), finitions métalliques structurées, reflets irisés et finitions anodisées profondes — quatre familles d'effets premium pour les projets d'architecture et de design qui sortent du nuancier classique.",
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
          "Le surcoût dépend de la finition choisie. Les effets mat, satiné et brillant sont au même tarif que le thermolaquage standard. Les texturés, mouchetés, anti-graffiti et effets architecturaux entraînent un léger supplément lié au coût de la poudre certifiée, généralement de l'ordre de 10 à 20 %.",
      },
      {
        question:
          "Peut-on combiner une finition spéciale avec une teinte RAL ou NCS ?",
        answer:
          "Absolument. La majorité des effets (mat, satiné, texturé, moucheté) sont disponibles dans l'ensemble des nuanciers RAL et NCS. Les effets architecturaux (corten, métalliques, irisés, anodisés) ont leur propre palette de teintes propres à chaque famille.",
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

export const SERVICES = SERVICES_FALLBACK;

export async function getServices(): Promise<Service[]> {
  return SERVICES_FALLBACK;
}

export async function getServiceBySlugAsync(
  slug: string
): Promise<Service | undefined> {
  return SERVICES_FALLBACK.find((s) => s.slug === slug);
}
