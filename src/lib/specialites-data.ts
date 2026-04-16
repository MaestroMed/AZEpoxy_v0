/**
 * Spécialités — marchés cibles d'AZ Époxy :
 * jantes auto, moto, pièces auto et pièces métalliques industrielles.
 */

export interface Specialty {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  benefits: { title: string; description: string }[];
  popularColors: string[];
  priceFrom: string;
  turnaround: string;
  faqs: { question: string; answer: string }[];
}

export const SPECIALTIES_FALLBACK: Specialty[] = [
  {
    slug: "jantes",
    title: "Jantes Auto",
    tagline: "Rénovation et personnalisation de jantes alliage",
    description:
      "Redonnez un éclat neuf à vos jantes ou personnalisez-les dans la couleur de votre choix. Notre procédé de thermolaquage offre une résistance supérieure à la poussière de frein, au sel de déneigement, aux projections de graviers et aux rayons UV. Résultat : des jantes impeccables, saison après saison.",
    icon: "CircleDot",
    benefits: [
      {
        title: "Résistance à la poussière de frein",
        description:
          "Le revêtement époxy forme une barrière chimique contre les particules de frein incandescentes, évitant l'incrustation et le ternissement prématuré de vos jantes.",
      },
      {
        title: "Protection contre le sel de déneigement",
        description:
          "En hiver, le sel et les fondants routiers attaquent l'aluminium. Notre traitement anti-corrosion (sablage + primaire zinc + poudre époxy) protège vos jantes même dans les conditions les plus rudes.",
      },
      {
        title: "Résistance aux projections de graviers",
        description:
          "Avec une épaisseur de 60 à 80 µm et une résistance aux chocs supérieure à 50 kg/cm, le thermolaquage encaisse les impacts de cailloux sans écaillage.",
      },
      {
        title: "Tenue UV et brillance durable",
        description:
          "Les poudres polyester que nous sélectionnons conservent leur teinte et leur brillant au fil des années, même exposées en plein soleil. Pas de jaunissement, pas de farinage.",
      },
    ],
    popularColors: ["RAL 9005", "RAL 7016", "RAL 9010", "RAL 9006", "RAL 7024"],
    priceFrom: "80 € / jante",
    turnaround: "5-7 jours",
    faqs: [
      {
        question: "Combien coûte le thermolaquage de 4 jantes ?",
        answer:
          "Le tarif dépend du diamètre, de l'état initial et de la finition souhaitée. Pour 4 jantes standards (17-19 pouces) en bon état, comptez à partir de 320 € TTC (80 € par jante), sablage et thermolaquage compris. Un devis précis est établi après inspection visuelle.",
      },
      {
        question: "Faut-il démonter les pneus avant de vous envoyer les jantes ?",
        answer:
          "Oui, les jantes doivent nous parvenir nues, sans pneu, sans capteur TPMS ni plombs d'équilibrage. Le démontage et remontage des pneumatiques peuvent être réalisés chez votre garagiste ou centre auto avant et après notre intervention.",
      },
      {
        question: "Peut-on thermolaquer des jantes en aluminium forgé ?",
        answer:
          "Absolument. Les jantes en aluminium forgé supportent parfaitement la cuisson à 200 °C. Nous adaptons la pression de sablage pour préserver la dureté et les tolérances de ces jantes haut de gamme. Le résultat est identique en termes de finition et de durabilité.",
      },
      {
        question: "Proposez-vous des finitions spéciales pour les jantes ?",
        answer:
          "Oui, au-delà des teintes RAL classiques, nous proposons des finitions métallisées (type aluminium brossé), des effets bicolores (face usinée + flanc peint) et les teintes premium de nos collections Adaptacolor (Polaris, Sfera). Demandez-nous un nuancier.",
      },
    ],
  },
  {
    slug: "moto",
    title: "Moto Art",
    tagline: "Custom et protection pour passionnés de deux-roues",
    description:
      "Cadres, jantes, bras oscillant, couvre-culasses, platines repose-pieds… Chaque pièce de votre moto peut être thermolaquée dans la couleur et la finition de votre choix. Nos poudres haute température résistent à la chaleur dégagée à proximité du moteur et de l'échappement, tout en offrant une palette de couleurs vibrantes.",
    icon: "Bike",
    benefits: [
      {
        title: "Design custom sur mesure",
        description:
          "Créez la moto de vos rêves en choisissant parmi plus de 200 teintes RAL, nos collections premium ou des combinaisons bicolores. Nous conseillons chaque client pour un rendu harmonieux et personnel.",
      },
      {
        title: "Résistance à la chaleur moteur",
        description:
          "Nos poudres époxy supportent des températures continues de 200 °C et des pics à 250 °C, ce qui les rend adaptées aux pièces proches du moteur et de la ligne d'échappement (hors collecteur direct).",
      },
      {
        title: "Couleurs vibrantes et durables",
        description:
          "Contrairement à la peinture aérosol, le thermolaquage offre des teintes profondes et éclatantes qui ne s'estompent pas sous l'effet des UV, des intempéries ou des lavages haute pression.",
      },
      {
        title: "Protection intégrale du châssis",
        description:
          "Le revêtement époxy protège le cadre et le bras oscillant contre la corrosion, les projections de graviers, les fluides mécaniques et l'usure quotidienne, prolongeant significativement la durée de vie de la moto.",
      },
    ],
    popularColors: ["RAL 9005", "RAL 3020", "RAL 5010", "RAL 1003", "RAL 2004"],
    priceFrom: "150 € / pièce",
    turnaround: "7-10 jours",
    faqs: [
      {
        question: "Quelles pièces de moto peut-on thermolaquer ?",
        answer:
          "Toutes les pièces métalliques démontables : cadre, sous-cadre, bras oscillant, jantes, té de fourche, platines, couvre-culasses, carters (après nettoyage). Les pièces en plastique (carénages, garde-boue) ne sont pas compatibles avec le procédé.",
      },
      {
        question: "Le thermolaquage résiste-t-il à la chaleur d'un moteur ?",
        answer:
          "Oui, pour les pièces situées à proximité du moteur (cadre, carters latéraux). Nos poudres résistent en continu jusqu'à 200 °C. Pour les collecteurs et pots d'échappement exposés à des températures supérieures à 300 °C, nous recommandons un traitement céramique spécifique.",
      },
      {
        question: "Quel délai pour un cadre complet de moto ?",
        answer:
          "Comptez 7 à 10 jours ouvrés pour un cadre complet (sablage + primaire éventuel + thermolaquage + contrôle). En période de forte activité (printemps), le délai peut atteindre 12 jours. Nous vous communiquons une date de retrait précise à la réception de la pièce.",
      },
    ],
  },
  {
    slug: "voiture",
    title: "Pièces Auto",
    tagline: "Étriers, caches moteur, arceaux et éléments de carrosserie",
    description:
      "Thermolaquage de pièces automobiles : étriers de frein, caches moteur, arceaux de sécurité, supports moteur, barres anti-rapprochement, élargisseurs d'ailes métalliques et tout composant en acier ou aluminium. Le revêtement époxy résiste à la chaleur du compartiment moteur, aux projections d'huile et aux vibrations mécaniques.",
    icon: "Car",
    benefits: [
      {
        title: "Résistance à la chaleur du compartiment moteur",
        description:
          "Les caches moteur, étriers et pièces sous capot sont exposés à des températures élevées. Nos poudres supportent 200 °C en continu, bien au-delà des conditions thermiques habituelles du compartiment moteur.",
      },
      {
        title: "Esthétique et personnalisation",
        description:
          "Étriers de frein rouge vif, arceau assorti à la carrosserie, cache moteur noir satiné… Le thermolaquage apporte une touche esthétique soignée qui valorise votre véhicule.",
      },
      {
        title: "Protection anti-corrosion renforcée",
        description:
          "Le sablage préalable suivi de l'application de poudre époxy crée une barrière hermétique contre l'humidité, le sel, les fluides mécaniques et les projections abrasives du soubassement.",
      },
    ],
    popularColors: ["RAL 3020", "RAL 9005", "RAL 1003", "RAL 5010", "RAL 7016"],
    priceFrom: "50 € / pièce",
    turnaround: "5-7 jours",
    faqs: [
      {
        question: "Peut-on thermolaquer des étriers de frein ?",
        answer:
          "Oui, c'est l'une de nos prestations les plus demandées. Les étriers sont sablés, puis thermolaqués avec une poudre haute température résistant à 200 °C en continu. Le tarif démarre à 50 € par étrier pour un traitement complet (sablage + thermolaquage).",
      },
      {
        question: "Le thermolaquage résiste-t-il aux vibrations mécaniques ?",
        answer:
          "Parfaitement. Grâce à sa flexibilité et à son adhérence exceptionnelle (classe 0 au test de quadrillage), le revêtement époxy absorbe les vibrations sans fissurer ni s'écailler, contrairement à une peinture liquide classique qui se craquelle sous l'effet des contraintes mécaniques.",
      },
      {
        question: "Traitez-vous les pièces en série pour les préparateurs auto ?",
        answer:
          "Oui, nous travaillons régulièrement avec des préparateurs et des garages spécialisés. Nous proposons des tarifs dégressifs à partir de 10 pièces et pouvons assurer des livraisons régulières. Contactez-nous pour établir un partenariat.",
      },
    ],
  },
  {
    slug: "pieces",
    title: "Pièces Métalliques",
    tagline: "Industriel, architectural et mobilier — toutes dimensions",
    description:
      "Notre cabine de sablage et notre four de 7 mètres de longueur nous permettent de traiter des pièces métalliques de grande dimension : portails, garde-corps, escaliers, charpentes, mobilier urbain, structures industrielles. Du prototype unitaire à la série de plusieurs centaines de pièces, nous adaptons notre organisation pour respecter vos délais et vos exigences qualité.",
    icon: "Factory",
    benefits: [
      {
        title: "Capacité grande dimension — cabine 7 m",
        description:
          "Notre cabine de sablage et notre four de polymérisation de 7 mètres accueillent des pièces de grande envergure : portails coulissants, garde-corps de balcon, structures métalliques assemblées.",
      },
      {
        title: "Protection anti-corrosion longue durée",
        description:
          "Pour les environnements agressifs (milieu marin, industriel, enterré), nous proposons le système duplex métallisation zinc + thermolaquage époxy, conforme à la norme ISO 12944 catégorie C5-M, avec une durée de vie de 25 ans et plus.",
      },
      {
        title: "Production en série et répétabilité",
        description:
          "Nous garantissons une constance de teinte et d'épaisseur d'un lot à l'autre grâce à nos procédures de contrôle qualité : mesure d'épaisseur systématique, test d'adhérence et archivage des paramètres de cuisson.",
      },
    ],
    popularColors: ["RAL 7016", "RAL 9005", "RAL 9010", "RAL 7035", "RAL 6005"],
    priceFrom: "Sur devis",
    turnaround: "5-15 jours selon volume",
    faqs: [
      {
        question: "Quelle est la taille maximale des pièces que vous pouvez traiter ?",
        answer:
          "Notre four et notre cabine de sablage mesurent 7 mètres de longueur. Pour les pièces dépassant cette dimension, nous étudions au cas par cas la possibilité d'un traitement en plusieurs passes ou d'une intervention sur site par métallisation.",
      },
      {
        question: "Travaillez-vous avec les professionnels du bâtiment ?",
        answer:
          "Oui, une part importante de notre activité concerne les serruriers, métalliers, architectes, paysagistes et entreprises de construction métallique. Nous proposons un compte professionnel avec tarifs préférentiels, facturation à 30 jours et enlèvement possible.",
      },
      {
        question: "Pouvez-vous traiter des séries de plusieurs centaines de pièces ?",
        answer:
          "Absolument. Notre organisation est dimensionnée pour absorber des séries allant de l'unité à plusieurs centaines de pièces. Pour les volumes importants, nous planifions la production en amont afin de garantir le respect des délais convenus. Un devis détaillé avec planning est établi pour chaque commande série.",
      },
    ],
  },
];

export function getSpecialtyBySlug(slug: string): Specialty | undefined {
  return SPECIALTIES.find((s) => s.slug === slug);
}

import { sanityFetch } from "@/sanity/client";
import { SPECIALITES_QUERY, SPECIALITE_BY_SLUG_QUERY } from "@/sanity/queries";

export const SPECIALTIES = SPECIALTIES_FALLBACK;

export async function getSpecialties(): Promise<Specialty[]> {
  const data = await sanityFetch<Specialty[]>(SPECIALITES_QUERY, {}, {
    tags: ["specialite:list"],
  });
  return data?.length ? data : SPECIALTIES_FALLBACK;
}

export async function getSpecialtyBySlugAsync(
  slug: string
): Promise<Specialty | undefined> {
  const data = await sanityFetch<Specialty | null>(
    SPECIALITE_BY_SLUG_QUERY,
    { slug },
    { tags: [`specialite:${slug}`] }
  );
  return data ?? SPECIALTIES_FALLBACK.find((s) => s.slug === slug);
}
