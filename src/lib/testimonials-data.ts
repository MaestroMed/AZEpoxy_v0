/**
 * Témoignages clients AZ Époxy.
 */

export interface Testimonial {
  name: string;
  company?: string;
  role: string;
  quote: string;
  service: string;
  rating: number;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Julien M.",
    company: "JM Performance Auto",
    role: "Préparateur automobile",
    quote:
      "Mes clients exigent une finition irréprochable sur leurs jantes et étriers. AZ Époxy livre systématiquement un résultat au-dessus de mes attentes. La tenue dans le temps est remarquable, même sur des véhicules qui roulent au quotidien.",
    service: "jantes",
    rating: 5,
  },
  {
    name: "Sophie L.",
    role: "Particulière",
    quote:
      "J'ai confié le cadre de ma Triumph à AZ Époxy pour un thermolaquage custom rouge et noir. Le résultat est spectaculaire : couleurs profondes, finition parfaite, délai respecté. Je recommande à tous les passionnés moto.",
    service: "moto",
    rating: 5,
  },
  {
    name: "Pierre D.",
    company: "Atelier Métallerie Duval",
    role: "Artisan métallier",
    quote:
      "Nous travaillons avec AZ Époxy depuis 3 ans pour nos portails, garde-corps et escaliers. La qualité est constante, les délais sont fiables et le rapport qualité-prix est imbattable. Un vrai partenaire professionnel.",
    service: "pieces",
    rating: 5,
  },
  {
    name: "Marc B.",
    company: "Garage MB Sport",
    role: "Garagiste spécialiste compétition",
    quote:
      "Les étriers Brembo que nous avons fait traiter ont survécu à une saison complète de track days sans la moindre trace d'écaillage. La résistance thermique de la poudre époxy est impressionnante.",
    service: "voiture",
    rating: 5,
  },
  {
    name: "Élodie R.",
    role: "Particulière",
    quote:
      "J'ai fait thermolaquer mes 4 jantes en noir satiné. Le rendu est magnifique et après un hiver complet avec sel et intempéries, elles sont toujours impeccables. Le tarif est très compétitif pour ce niveau de qualité.",
    service: "jantes",
    rating: 5,
  },
  {
    name: "Thomas G.",
    company: "TG Architecture",
    role: "Architecte d'intérieur",
    quote:
      "AZ Époxy a thermolaqué 50 luminaires en acier pour un de nos projets hôteliers. La constance de teinte d'une pièce à l'autre était parfaite. Un prestataire fiable pour les projets exigeants.",
    service: "pieces",
    rating: 4,
  },
];
