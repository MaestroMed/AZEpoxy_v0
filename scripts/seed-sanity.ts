/**
 * One-shot import of the hardcoded data files into Sanity. Slugs are locked
 * to the current values so existing URLs (and SEO equity) survive the move.
 *
 * Usage:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID=xxx \
 *   NEXT_PUBLIC_SANITY_DATASET=production \
 *   SANITY_WRITE_TOKEN=sk... \
 *   npx tsx scripts/seed-sanity.ts
 *
 * Re-runnable. Existing docs are matched by deterministic _id and updated
 * via createOrReplace, so the script is idempotent.
 */

import { sanityWriteClient } from "../src/sanity/client";
import { isSanityConfigured, writeToken } from "../src/sanity/env";
import { BLOG_ARTICLES_FALLBACK } from "../src/lib/blog-data";
import { PROJECTS_FALLBACK } from "../src/lib/realisations-data";
import { TESTIMONIALS_FALLBACK } from "../src/lib/testimonials-data";
import { SERVICES_FALLBACK } from "../src/lib/services-data";
import { SPECIALTIES_FALLBACK } from "../src/lib/specialites-data";
import { VILLES_FALLBACK } from "../src/lib/villes-data";
import { FAQS_FALLBACK } from "../src/lib/faq-data";

if (!isSanityConfigured || !writeToken || !sanityWriteClient) {
  console.error(
    "Sanity not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, and SANITY_WRITE_TOKEN."
  );
  process.exit(1);
}

const tx = sanityWriteClient.transaction();

function id(prefix: string, key: string) {
  return `${prefix}.${key}`;
}

for (const post of BLOG_ARTICLES_FALLBACK) {
  tx.createOrReplace({
    _id: id("post", post.slug),
    _type: "post",
    title: post.title,
    slug: { _type: "slug", current: post.slug },
    description: post.description,
    date: post.date,
    readTime: post.readTime,
    category: post.category,
    content: post.content,
  });
}

for (const project of PROJECTS_FALLBACK) {
  tx.createOrReplace({
    _id: id("realisation", String(project.id)),
    _type: "realisation",
    title: project.title,
    category: project.category,
    description: project.description,
    colors: project.colors,
    featured: project.featured,
    order: project.id,
  });
}

for (let i = 0; i < TESTIMONIALS_FALLBACK.length; i++) {
  const t = TESTIMONIALS_FALLBACK[i];
  const slug = t.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  tx.createOrReplace({
    _id: id("testimonial", `${slug}-${i}`),
    _type: "testimonial",
    name: t.name,
    company: t.company,
    role: t.role,
    quote: t.quote,
    service: t.service,
    rating: t.rating,
    order: i,
  });
}

for (const s of SERVICES_FALLBACK) {
  tx.createOrReplace({
    _id: id("service", s.slug),
    _type: "service",
    title: s.title,
    shortTitle: s.shortTitle,
    slug: { _type: "slug", current: s.slug },
    tagline: s.tagline,
    description: s.description,
    icon: s.icon,
    features: s.features,
    specs: s.specs,
    faqs: s.faqs,
  });
}

for (const sp of SPECIALTIES_FALLBACK) {
  tx.createOrReplace({
    _id: id("specialite", sp.slug),
    _type: "specialite",
    title: sp.title,
    slug: { _type: "slug", current: sp.slug },
    tagline: sp.tagline,
    description: sp.description,
    icon: sp.icon,
    benefits: sp.benefits,
    popularColors: sp.popularColors,
    priceFrom: sp.priceFrom,
    turnaround: sp.turnaround,
    faqs: sp.faqs,
  });
}

for (const v of VILLES_FALLBACK) {
  tx.createOrReplace({
    _id: id("ville", v.slug),
    _type: "ville",
    name: v.name,
    slug: { _type: "slug", current: v.slug },
    department: v.department,
    departmentCode: v.departmentCode,
    distance: v.distance,
    driveTime: v.driveTime,
    access: v.access,
    localContext: v.localContext,
    nearbyVilles: v.nearbyVilles,
  });
}

for (let i = 0; i < FAQS_FALLBACK.length; i++) {
  const f = FAQS_FALLBACK[i];
  const slug = f.question
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .slice(0, 50);
  tx.createOrReplace({
    _id: id("faq", `${f.category}-${slug}`),
    _type: "faqItem",
    question: f.question,
    answer: f.answer,
    category: f.category,
    order: i,
  });
}

const result = await tx.commit({ visibility: "async" });

console.log(`Seed committed. Documents touched: ${result.results.length}`);

console.log(
  `Counts:\n  posts:        ${BLOG_ARTICLES_FALLBACK.length}\n  realisations: ${PROJECTS_FALLBACK.length}\n  testimonials: ${TESTIMONIALS_FALLBACK.length}\n  services:     ${SERVICES_FALLBACK.length}\n  specialites:  ${SPECIALTIES_FALLBACK.length}\n  villes:       ${VILLES_FALLBACK.length}\n  faqs:         ${FAQS_FALLBACK.length}`
);
