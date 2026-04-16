/**
 * GROQ queries. Tag conventions:
 *   - Collection list:  `<type>:list`
 *   - Single doc:       `<type>:<slug>`
 * The webhook in /api/revalidate fires both tags on every mutation so a
 * single content edit can refresh the list page and the detail page.
 */

export const POSTS_QUERY = /* groq */ `
  *[_type == "post" && defined(slug.current)] | order(date desc) {
    "slug": slug.current,
    title,
    description,
    date,
    readTime,
    category,
    image,
    content
  }
`;

export const POST_BY_SLUG_QUERY = /* groq */ `
  *[_type == "post" && slug.current == $slug][0] {
    "slug": slug.current,
    title,
    description,
    date,
    readTime,
    category,
    image,
    content
  }
`;

export const REALISATIONS_QUERY = /* groq */ `
  *[_type == "realisation"] | order(featured desc, order asc, _createdAt desc) {
    _id,
    title,
    category,
    description,
    colors,
    image,
    gallery,
    featured
  }
`;

export const TESTIMONIALS_QUERY = /* groq */ `
  *[_type == "testimonial"] | order(order asc, _createdAt desc) {
    _id,
    name,
    company,
    role,
    quote,
    service,
    rating,
    date
  }
`;

export const FAQS_QUERY = /* groq */ `
  *[_type == "faqItem"] | order(category asc, order asc) {
    _id,
    question,
    answer,
    category
  }
`;

export const SERVICES_QUERY = /* groq */ `
  *[_type == "service"] | order(order asc) {
    "slug": slug.current,
    title,
    shortTitle,
    tagline,
    description,
    icon,
    features,
    specs,
    faqs
  }
`;

export const SERVICE_BY_SLUG_QUERY = /* groq */ `
  *[_type == "service" && slug.current == $slug][0] {
    "slug": slug.current,
    title,
    shortTitle,
    tagline,
    description,
    icon,
    features,
    specs,
    faqs
  }
`;

export const SPECIALITES_QUERY = /* groq */ `
  *[_type == "specialite"] | order(order asc) {
    "slug": slug.current,
    title,
    tagline,
    description,
    icon,
    benefits,
    popularColors,
    priceFrom,
    turnaround,
    faqs
  }
`;

export const SPECIALITE_BY_SLUG_QUERY = /* groq */ `
  *[_type == "specialite" && slug.current == $slug][0] {
    "slug": slug.current,
    title,
    tagline,
    description,
    icon,
    benefits,
    popularColors,
    priceFrom,
    turnaround,
    faqs
  }
`;

export const VILLES_QUERY = /* groq */ `
  *[_type == "ville"] | order(name asc) {
    "slug": slug.current,
    name,
    department,
    departmentCode,
    distance,
    driveTime,
    access,
    localContext,
    nearbyVilles
  }
`;

export const VILLE_BY_SLUG_QUERY = /* groq */ `
  *[_type == "ville" && slug.current == $slug][0] {
    "slug": slug.current,
    name,
    department,
    departmentCode,
    distance,
    driveTime,
    access,
    localContext,
    nearbyVilles
  }
`;

export const REVIEWS_QUERY = /* groq */ `
  *[_type == "review"] | order(publishedAt desc) {
    _id,
    author,
    rating,
    body,
    publishedAt,
    source
  }
`;
