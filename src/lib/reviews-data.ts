export interface Review {
  _id?: string;
  author: string;
  rating: number;
  body?: string;
  publishedAt?: string;
  source?: "google" | "trustpilot" | "facebook" | "manual";
}

/**
 * Avis externes synchronisés (Google/Trustpilot…). Aujourd'hui aucun flux
 * branché : renvoie un tableau vide → les sections « Avis » de l'UI ne
 * s'affichent pas. Ces avis sont destinés à l'AFFICHAGE sur les pages
 * uniquement : ils ne doivent JAMAIS alimenter le JSON-LD (aggregateRating /
 * Review), retiré volontairement du balisage — art. L.121-2 C. conso
 * (pratique commerciale trompeuse) + politique Google sur les avis
 * auto-attribués. Les témoignages saisis en admin transitent par
 * `getPublicTestimonials` (table testimonials), pas par ce module.
 */
export async function getReviews(): Promise<Review[]> {
  return [];
}

export function averageRating(reviews: Review[]): number | null {
  if (!reviews.length) return null;
  const sum = reviews.reduce((s, r) => s + (r.rating || 0), 0);
  return Number((sum / reviews.length).toFixed(2));
}
