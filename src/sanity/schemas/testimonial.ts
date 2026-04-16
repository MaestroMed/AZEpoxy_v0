import { defineField, defineType } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Témoignage",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nom",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({ name: "company", title: "Entreprise", type: "string" }),
    defineField({ name: "role", title: "Fonction", type: "string" }),
    defineField({
      name: "quote",
      title: "Citation",
      type: "text",
      rows: 5,
      validation: (r) => r.required().max(800),
    }),
    defineField({
      name: "service",
      title: "Service concerné",
      type: "string",
      placeholder: "Jantes Auto, Thermolaquage…",
    }),
    defineField({
      name: "rating",
      title: "Note (1-5)",
      type: "number",
      validation: (r) => r.required().min(1).max(5).integer(),
      initialValue: 5,
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
    }),
    defineField({
      name: "order",
      title: "Ordre d'affichage",
      type: "number",
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "service", rating: "rating" },
    prepare({ title, subtitle, rating }) {
      return {
        title,
        subtitle: `${"\u2605".repeat(rating ?? 0)} · ${subtitle ?? ""}`,
      };
    },
  },
});
