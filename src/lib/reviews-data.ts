import { sanityFetch } from "@/sanity/client";
import { REVIEWS_QUERY } from "@/sanity/queries";

export interface Review {
  _id?: string;
  author: string;
  rating: number;
  body?: string;
  publishedAt?: string;
  source?: "google" | "trustpilot" | "facebook" | "manual";
}

/**
 * Fetch synced reviews from Sanity. Returns an empty array when Sanity isn't
 * configured or the sync hasn't happened yet — the UI falls back to
 * testimonials and JSON-LD omits AggregateRating in that case.
 */
export async function getReviews(): Promise<Review[]> {
  const data = await sanityFetch<Review[]>(REVIEWS_QUERY, {}, {
    tags: ["review:list"],
  });
  return data ?? [];
}

export function averageRating(reviews: Review[]): number | null {
  if (!reviews.length) return null;
  const sum = reviews.reduce((s, r) => s + (r.rating || 0), 0);
  return Number((sum / reviews.length).toFixed(2));
}
