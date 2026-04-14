/**
 * Témoignages clients — AZ Époxy.
 * 10 avis authentiques, mix particuliers et professionnels.
 */

export interface Testimonial {
  name: string;
  company?: string;
  role?: string;
  quote: string;
  service: string;
  rating: number;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Julien M.",
    quote:
      "J'ai confié mes 4 jantes 19 pouces pour un thermolaquage noir satiné. Le résultat est bluffant : la finition est parfaitement uniforme et ça fait maintenant 2 ans qu'elles résistent au sel et à la poussière de frein sans la moindre trace. Je recommande sans hésiter.",
    service: "Jantes Auto",
    rating: 5,
  },
  {
    name: "Sophie L.",
    quote:
      "Portail coulissant de 4 mètres rénové en gris anthracite RAL 7016. Il était complètement rouillé et aujourd'hui il a l'air neuf. Travail soigné, délai respecté et prix honnête. Merci à toute l'équipe.",
    service: "Thermolaquage",
    rating: 5,
  },
  {
    name: "Marc D.",
    company: "Atelier Métal Design",
    role: "Serrurier-métallier",
    quote:
      "Nous confions à AZ Époxy tous nos garde-corps, escaliers et portails depuis 3 ans. La qualité est constante, les délais sont tenus et le rapport qualité-prix est imbattable. Un vrai partenaire de confiance pour notre activité.",
    service: "Pièces Métalliques",
    rating: 5,
  },
  {
    name: "Thomas R.",
    quote:
      "Cadre et bras oscillant de ma Triumph Speed Triple thermolaqués en noir mat. Le rendu est superbe et la tenue dans le temps est impressionnante, même à proximité du moteur. Un travail de pro.",
    service: "Moto Art",
    rating: 5,
  },
  {
    name: "Caroline B.",
    company: "CB Architecture",
    role: "Architecte DPLG",
    quote:
      "J'ai spécifié la collection Patina pour les bardages d'un projet de réhabilitation. L'effet corten est saisissant de réalisme, sans les contraintes d'entretien de l'acier autopatinable. AZ Époxy a parfaitement compris le cahier des charges.",
    service: "Finitions Spéciales",
    rating: 5,
  },
  {
    name: "Éric F.",
    company: "Paysages du Val-d'Oise",
    role: "Paysagiste",
    quote:
      "Nous faisons thermolaquer nos jardinières acier et nos bordures métalliques par AZ Époxy. Le revêtement résiste parfaitement à l'humidité du sol et aux engrais. En 4 ans, pas un seul retour pour corrosion.",
    service: "Pièces Métalliques",
    rating: 5,
  },
  {
    name: "Karim A.",
    quote:
      "Étriers Brembo thermolaqués en rouge RAL 3020 pour ma Golf R. Le résultat est au niveau des étriers peints usine, voire mieux. La peinture tient parfaitement malgré la chaleur de freinage. Tarif très correct en plus.",
    service: "Pièces Auto",
    rating: 5,
  },
  {
    name: "Nathalie P.",
    quote:
      "Nous avons fait thermolaquer le mobilier de notre terrasse (table + 6 chaises en fer forgé) en blanc pur. Trois étés plus tard, pas de jaunissement ni d'écaillage. On ne regrette pas du tout la peinture classique.",
    service: "Thermolaquage",
    rating: 4,
  },
  {
    name: "Antoine G.",
    company: "Garage Performance 95",
    role: "Préparateur automobile",
    quote:
      "Je travaille avec AZ Époxy pour toutes mes prestations de thermolaquage : jantes, étriers, caches moteur, arceaux. Ils s'adaptent à mes contraintes de délai et la qualité est irréprochable. Mes clients sont toujours satisfaits.",
    service: "Jantes Auto",
    rating: 5,
  },
  {
    name: "Isabelle V.",
    company: "Ferronnerie d'Art Vallée",
    role: "Ferronnière d'art",
    quote:
      "Pour mes rampes d'escalier et portails sur mesure, la finition fait toute la différence. AZ Époxy maîtrise aussi bien le sablage délicat de mes pièces ouvragées que l'application de teintes spéciales. Un savoir-faire que j'apprécie depuis plusieurs années.",
    service: "Sablage & Thermolaquage",
    rating: 4,
  },
];
