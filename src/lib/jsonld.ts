import { SITE } from "@/lib/utils";
import { TESTIMONIALS } from "@/lib/testimonials-data";
import type { Review } from "@/lib/reviews-data";

/**
 * Typed JSON-LD builders. Every page that needs structured data should import
 * one of these helpers and feed the result through <JsonLd> (or a raw <script>
 * tag) instead of hand-writing schema.org objects inline.
 */

const BUSINESS_ID = `${SITE.url}#business`;
const ORG_ID = `${SITE.url}#organization`;
const WEBSITE_ID = `${SITE.url}#website`;

const BASE_BUSINESS = {
  "@type": "LocalBusiness" as const,
  "@id": BUSINESS_ID,
  name: SITE.name,
  alternateName: "AZ Epoxy",
  url: SITE.url,
  telephone: SITE.phone,
  email: SITE.email,
  priceRange: "€€",
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.city,
    postalCode: SITE.address.zip,
    addressCountry: "FR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 49.147,
    longitude: 2.327,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "18:00",
    },
  ],
  parentOrganization: {
    "@type": "Organization",
    name: SITE.parent.name,
    url: SITE.parent.url,
  },
};

interface LocalBusinessOptions {
  description?: string;
  areaServed?: Array<{ type?: string; name: string; containedIn?: string }>;
  /** Pass `false` to omit the rating object (e.g. when no reviews are loaded). */
  withAggregateRating?: boolean;
  /** When provided, the AggregateRating is derived from these real reviews
   *  instead of the hardcoded testimonials dataset. */
  reviews?: Review[];
  /** When true (default), inline up to 5 Review entries — Google
   *  Search Console pénalise les AggregateRating sans Review attachés. */
  withReviewList?: boolean;
}

export function localBusinessLd(options: LocalBusinessOptions = {}) {
  const {
    description = "Thermolaquage poudre époxy professionnel, 200+ couleurs RAL, sablage, finitions spéciales, finitions spéciales.",
    areaServed = [
      { type: "AdministrativeArea", name: "Île-de-France" },
      { type: "AdministrativeArea", name: "Val-d'Oise" },
    ],
    withAggregateRating = true,
    reviews,
    withReviewList = true,
  } = options;

  const rating = withAggregateRating
    ? reviews?.length
      ? aggregateRatingFromReviews(reviews)
      : aggregateRatingFromTestimonials()
    : undefined;

  // Individual Review entries — Google strongly recommends linking
  // AggregateRating to actual Review objects pour éviter le warning
  // "AggregateRating without reviews" en Search Console. On limite à 5
  // pour ne pas alourdir le markup.
  const reviewList =
    withReviewList && rating
      ? reviews?.length
        ? reviewsToSchema(reviews.slice(0, 5))
        : testimonialsToSchema(5)
      : undefined;

  return {
    "@context": "https://schema.org",
    ...BASE_BUSINESS,
    description,
    areaServed: areaServed.map((a) => ({
      "@type": a.type ?? "AdministrativeArea",
      name: a.name,
      ...(a.containedIn
        ? {
            containedInPlace: {
              "@type": "AdministrativeArea",
              name: a.containedIn,
            },
          }
        : {}),
    })),
    ...(rating ? { aggregateRating: rating } : {}),
    ...(reviewList && reviewList.length > 0 ? { review: reviewList } : {}),
  };
}

/* ── Review schema helpers ─────────────────────────────────────── */

function reviewsToSchema(reviews: Review[]) {
  return reviews
    .filter((r) => r.author && r.rating)
    .map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.author },
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1,
      },
      ...(r.body ? { reviewBody: r.body } : {}),
      ...(r.publishedAt ? { datePublished: r.publishedAt } : {}),
    }));
}

function testimonialsToSchema(limit: number) {
  return TESTIMONIALS.slice(0, limit)
    .filter((t) => t.name && t.rating)
    .map((t) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: t.name,
        ...(t.role || t.company
          ? { jobTitle: [t.role, t.company].filter(Boolean).join(" — ") }
          : {}),
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: t.rating,
        bestRating: 5,
        worstRating: 1,
      },
      ...(t.quote ? { reviewBody: t.quote } : {}),
    }));
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE.url,
    name: SITE.name,
    inLanguage: "fr-FR",
    publisher: { "@id": BUSINESS_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/og-image.jpg`,
    sameAs: [SITE.social.instagram],
  };
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/**
 * Build a BreadcrumbList. Pass items WITHOUT the leading "Accueil" — it is
 * prepended automatically. The last item should not have an `href` (it is the
 * current page).
 */
export function breadcrumbLd(items: BreadcrumbItem[]) {
  const list = [{ label: "Accueil", href: "/" }, ...items];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: list.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.label,
      ...(item.href ? { item: absoluteUrl(item.href) } : {}),
    })),
  };
}

interface ServiceLdInput {
  name: string;
  description: string;
  serviceType?: string;
  areaServed?: string;
  url?: string;
}

export function serviceLd(input: ServiceLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    serviceType: input.serviceType ?? input.name,
    areaServed: input.areaServed ?? "Île-de-France",
    provider: { "@id": BUSINESS_ID },
    ...(input.url ? { url: absoluteUrl(input.url) } : {}),
  };
}

interface ArticleLdInput {
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  url: string;
  section?: string;
}

export function articleLd(input: ArticleLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    image: input.image ? [absoluteUrl(input.image)] : [`${SITE.url}/og-image.jpg`],
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(input.url),
    },
    author: { "@id": ORG_ID },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: {
        "@type": "ImageObject",
        url: `${SITE.url}/og-image.jpg`,
      },
    },
    ...(input.section ? { articleSection: input.section } : {}),
  };
}

export interface FaqPair {
  question: string;
  answer: string;
}

export function faqPageLd(items: FaqPair[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.question,
      acceptedAnswer: { "@type": "Answer", text: it.answer },
    })),
  };
}

export function reviewLd(input: {
  author: string;
  body: string;
  rating: number;
  itemReviewed?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    author: { "@type": "Person", name: input.author },
    reviewBody: input.body,
    reviewRating: {
      "@type": "Rating",
      ratingValue: input.rating,
      bestRating: 5,
      worstRating: 1,
    },
    itemReviewed: { "@id": BUSINESS_ID, name: input.itemReviewed ?? SITE.name },
  };
}

/**
 * Aggregate rating computed from the local testimonials dataset. When real
 * Google reviews land in Phase 4 this should fall back to the synced data.
 */
function aggregateRatingFromReviews(reviews: Review[]) {
  if (!reviews.length) return undefined;
  const total = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
  const value = total / reviews.length;
  return {
    "@type": "AggregateRating",
    ratingValue: Number(value.toFixed(2)),
    bestRating: 5,
    worstRating: 1,
    reviewCount: reviews.length,
  };
}

export function aggregateRatingFromTestimonials() {
  if (!TESTIMONIALS.length) return undefined;
  const total = TESTIMONIALS.reduce((sum, t) => sum + t.rating, 0);
  const value = total / TESTIMONIALS.length;
  return {
    "@type": "AggregateRating",
    ratingValue: Number(value.toFixed(2)),
    bestRating: 5,
    worstRating: 1,
    reviewCount: TESTIMONIALS.length,
  };
}

function absoluteUrl(href: string): string {
  if (/^https?:\/\//i.test(href)) return href;
  return `${SITE.url}${href.startsWith("/") ? href : `/${href}`}`;
}
