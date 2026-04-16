import { defineField, defineType } from "sanity";

export const review = defineType({
  name: "review",
  title: "Avis Google (synced)",
  type: "document",
  // Phase 4 syncs Google Place reviews into this document type. Until then it
  // serves as a placeholder so AggregateRating can include real reviews.
  fields: [
    defineField({
      name: "author",
      title: "Auteur",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "rating",
      title: "Note (1-5)",
      type: "number",
      validation: (r) => r.required().min(1).max(5).integer(),
    }),
    defineField({ name: "body", title: "Avis", type: "text", rows: 4 }),
    defineField({ name: "language", title: "Langue", type: "string", initialValue: "fr" }),
    defineField({ name: "publishedAt", title: "Date", type: "datetime" }),
    defineField({
      name: "source",
      title: "Source",
      type: "string",
      options: { list: ["google", "trustpilot", "facebook", "manual"] },
      initialValue: "google",
    }),
    defineField({
      name: "externalId",
      title: "Identifiant externe",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "author", subtitle: "body", rating: "rating" },
    prepare({ title, subtitle, rating }) {
      return {
        title: `${title} — ${"\u2605".repeat(rating ?? 0)}`,
        subtitle,
      };
    },
  },
});
