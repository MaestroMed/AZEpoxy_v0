/**
 * Foire aux questions — AZ Époxy.
 * 20 questions réparties en 5 catégories (4 par catégorie).
 */

export interface FAQ {
  category: "general" | "tarifs" | "delais" | "technique" | "couleurs";
  question: string;
  answer: string;
}

export const FAQ_CATEGORIES = [
  { key: "general", label: "Général" },
  { key: "tarifs", label: "Tarifs" },
  { key: "delais", label: "Délais" },
  { key: "technique", label: "Technique" },
  { key: "couleurs", label: "Couleurs" },
] as const;

export type FAQCategoryKey = (typeof FAQ_CATEGORIES)[number]["key"];

export const FAQS: FAQ[] = [
  // ── Général ──────────────────────────────────────────────────────────
  {
    category: "general",
    question: "Qu'est-ce que le thermolaquage ?",
    answer:
      "Le thermolaquage (ou peinture poudre) consiste à appliquer une poudre thermodurcissable sur un support métallique à l'aide d'un pistolet électrostatique, puis à polymériser l'ensemble dans un four à 200 °C pendant 15 minutes. Le résultat est un revêtement de 60 à 80 µm, extrêmement résistant aux chocs, à la corrosion et aux UV, et 100 % exempt de solvant.",
  },
  {
    category: "general",
    question: "Quels types de pièces acceptez-vous ?",
    answer:
      "Nous traitons toutes les pièces métalliques conductrices supportant une cuisson à 200 °C : acier, aluminium, fonte, inox, acier galvanisé. Cela comprend les jantes, cadres moto, portails, garde-corps, mobilier, pièces industrielles et éléments architecturaux. Les pièces en plastique, bois ou matériaux composites ne sont pas éligibles.",
  },
  {
    category: "general",
    question: "Où êtes-vous situés et comment vous confier mes pièces ?",
    answer:
      "Notre atelier se situe au 23 Chemin du Bac des Aubins, 95820 Bruyères-sur-Oise, au nord de Paris. Vous pouvez déposer vos pièces sur place du lundi au vendredi (8h-17h) ou nous les envoyer par transporteur. Nous assurons également l'enlèvement sur site pour les commandes professionnelles importantes.",
  },
  {
    category: "general",
    question: "AZ Époxy est-elle liée à AZ Construction ?",
    answer:
      "Oui, AZ Époxy est la division thermolaquage du groupe AZ Construction. Cette synergie nous permet de traiter les ouvrages métalliques issus des chantiers du groupe (charpentes, garde-corps, escaliers) tout en offrant nos services de thermolaquage à une clientèle extérieure de particuliers et professionnels.",
  },

  // ── Tarifs ───────────────────────────────────────────────────────────
  {
    category: "tarifs",
    question: "Comment sont calculés vos tarifs ?",
    answer:
      "Nos tarifs dépendent de la surface à traiter, de l'état initial de la pièce (décapage nécessaire ou non), du type de préparation (sablage simple ou métallisation) et de la finition choisie (standard RAL ou collection premium). Un devis détaillé est systématiquement établi après inspection visuelle ou sur photos.",
  },
  {
    category: "tarifs",
    question: "Quel est le tarif pour thermolaquer un portail ?",
    answer:
      "Le prix varie selon la taille et la complexité du portail. À titre indicatif, un portail battant standard (3 m, barreaudé) revient entre 250 € et 400 € TTC, sablage et thermolaquage compris. Un portail coulissant de 5 m ou un portail à lames pleines sera facturé entre 400 € et 700 € TTC. Nous vous invitons à demander un devis précis.",
  },
  {
    category: "tarifs",
    question: "Proposez-vous des tarifs professionnels ?",
    answer:
      "Oui, nous disposons d'une grille tarifaire dédiée aux professionnels (serruriers, métalliers, architectes, préparateurs auto). Les tarifs sont dégressifs en fonction du volume et de la régularité des commandes. Facturation à 30 jours sur présentation d'un Kbis. Contactez-nous pour ouvrir un compte pro.",
  },
  {
    category: "tarifs",
    question: "Le devis est-il gratuit ?",
    answer:
      "Oui, l'établissement du devis est entièrement gratuit et sans engagement. Vous pouvez nous envoyer des photos de vos pièces par e-mail à contact@azepoxy.fr ou les déposer à l'atelier pour une estimation sur place. Nous répondons sous 24 à 48 heures ouvrées.",
  },

  // ── Délais ───────────────────────────────────────────────────────────
  {
    category: "delais",
    question: "Quel est le délai moyen de traitement ?",
    answer:
      "Le délai standard est de 5 à 7 jours ouvrés pour les pièces courantes (jantes, petites pièces auto, garde-corps). Les pièces de grande dimension ou les commandes en série peuvent nécessiter 10 à 15 jours. Les collections premium Adaptacolor demandent un délai additionnel de 3 à 5 jours lié à l'approvisionnement des poudres spéciales.",
  },
  {
    category: "delais",
    question: "Proposez-vous un service express ?",
    answer:
      "Oui, sous réserve de disponibilité, nous pouvons traiter vos pièces en 48 à 72 heures avec un supplément express de 30 %. Ce service est particulièrement apprécié des professionnels confrontés à des urgences de chantier. Appelez-nous au 09 71 35 74 96 pour vérifier la faisabilité.",
  },
  {
    category: "delais",
    question: "Comment suivre l'avancement de ma commande ?",
    answer:
      "À la réception de vos pièces, nous vous envoyons un accusé de réception par e-mail avec le délai estimé. Vous recevez ensuite une notification lorsque le traitement est terminé et que vos pièces sont prêtes à être retirées ou expédiées. Vous pouvez également nous appeler à tout moment pour connaître l'état d'avancement.",
  },
  {
    category: "delais",
    question: "Livrez-vous les pièces terminées ?",
    answer:
      "Oui, nous proposons la livraison par transporteur sur toute la France métropolitaine. Les frais d'expédition sont calculés en fonction du poids et du volume des pièces. Pour les professionnels en Île-de-France, nous assurons des tournées de livraison hebdomadaires à tarif préférentiel.",
  },

  // ── Technique ────────────────────────────────────────────────────────
  {
    category: "technique",
    question: "Quelle est la résistance du thermolaquage aux chocs ?",
    answer:
      "Le revêtement époxy offre une résistance aux chocs supérieure à 50 kg/cm (test au choc direct selon ISO 6272). C'est nettement supérieur à une peinture liquide classique (15-25 kg/cm). Cette robustesse explique pourquoi le thermolaquage est le revêtement de choix pour les jantes, garde-corps et mobilier urbain soumis à des sollicitations mécaniques.",
  },
  {
    category: "technique",
    question: "Le thermolaquage est-il compatible avec l'alimentaire ?",
    answer:
      "Certaines poudres époxy sont certifiées pour le contact alimentaire indirect (selon le règlement européen CE 1935/2004). Si votre projet concerne des équipements de cuisine professionnelle, des présentoirs alimentaires ou du mobilier de restauration, précisez-le lors de la demande de devis afin que nous sélectionnions une poudre adaptée.",
  },
  {
    category: "technique",
    question: "Comment entretenir une pièce thermolaquée ?",
    answer:
      "L'entretien est minimal : un nettoyage à l'eau tiède additionnée d'un détergent doux suffit. Évitez les nettoyants abrasifs, les solvants chlorés et le nettoyage haute pression à moins de 30 cm. Pour les pièces extérieures, un lavage biannuel permet de conserver l'éclat d'origine pendant 15 à 20 ans.",
  },
  {
    category: "technique",
    question: "Quelle est la durée de vie d'un revêtement thermolaqué ?",
    answer:
      "En conditions normales d'utilisation, un revêtement thermolaqué conserve ses propriétés esthétiques et protectrices pendant 15 à 20 ans en extérieur et 25 ans et plus en intérieur. En système duplex (métallisation + thermolaquage), la durée de vie peut atteindre 40 ans, y compris en environnement marin ou industriel.",
  },

  // ── Couleurs ─────────────────────────────────────────────────────────
  {
    category: "couleurs",
    question: "Combien de couleurs proposez-vous ?",
    answer:
      "Nous proposons l'intégralité du nuancier RAL Classic (plus de 200 teintes) ainsi que quatre collections premium Adaptacolor (Patina, Polaris, Dichroic, Sfera) offrant des effets corten, métallisés, irisés et anodisés. Au total, plus de 250 références sont disponibles pour couvrir tous les projets.",
  },
  {
    category: "couleurs",
    question: "Comment choisir la bonne teinte RAL ?",
    answer:
      "Nous vous recommandons de consulter notre nuancier en ligne ou de passer à l'atelier pour visualiser les échantillons physiques. Les écrans d'ordinateur et de smartphone ne restituent pas fidèlement les couleurs. Si vous hésitez, nous pouvons réaliser un échantillon de test sur une petite plaque métallique moyennant un léger supplément.",
  },
  {
    category: "couleurs",
    question: "Peut-on obtenir une couleur hors nuancier RAL ?",
    answer:
      "Oui, nous pouvons commander des poudres sur mesure auprès de nos fournisseurs à partir d'un échantillon de couleur ou d'une référence Pantone, NCS ou autre. Le délai d'approvisionnement est de 10 à 15 jours et une quantité minimale de poudre est généralement requise. Contactez-nous pour étudier la faisabilité.",
  },
  {
    category: "couleurs",
    question: "Les collections Adaptacolor sont-elles disponibles en stock ?",
    answer:
      "Les teintes les plus courantes des collections Polaris et Sfera sont maintenues en stock. Les références Patina et Dichroic, plus spécifiques, sont commandées à la demande avec un délai de 5 à 7 jours ouvrés supplémentaires. Nous vous conseillons de planifier votre projet en conséquence pour les finitions premium.",
  },
];

export function getFAQsByCategory(category: FAQCategoryKey): FAQ[] {
  return FAQS.filter((faq) => faq.category === category);
}
