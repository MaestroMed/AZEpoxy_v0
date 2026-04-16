import { defineField, defineType } from "sanity";

const titleDescription = {
  type: "object",
  fields: [
    defineField({ name: "title", title: "Titre", type: "string", validation: (r) => r.required() }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3, validation: (r) => r.required() }),
  ],
};

export const specialite = defineType({
  name: "specialite",
  title: "Spécialité",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Titre", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 64 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "tagline", title: "Accroche", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 6 }),
    defineField({ name: "icon", title: "Icône (lucide)", type: "string" }),
    defineField({
      name: "benefits",
      title: "Bénéfices",
      type: "array",
      of: [titleDescription],
    }),
    defineField({
      name: "popularColors",
      title: "Codes RAL populaires",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({ name: "priceFrom", title: "Tarif à partir de", type: "string" }),
    defineField({ name: "turnaround", title: "Délai indicatif", type: "string" }),
    defineField({
      name: "faqs",
      title: "FAQ",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "question", type: "string", validation: (r) => r.required() }),
            defineField({ name: "answer", type: "text", rows: 4, validation: (r) => r.required() }),
          ],
        },
      ],
    }),
    defineField({ name: "order", title: "Ordre d'affichage", type: "number", initialValue: 0 }),
  ],
  preview: { select: { title: "title", subtitle: "tagline" } },
});
