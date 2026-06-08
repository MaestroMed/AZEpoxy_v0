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
 * branché : renvoie un tableau vide → l'UI retombe sur les témoignages et le
 * JSON-LD omet AggregateRating. Les vrais avis saisis en admin transitent par
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
