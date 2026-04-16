import { defineField, defineType } from "sanity";

export const faqItem = defineType({
  name: "faqItem",
  title: "Question fréquente",
  type: "document",
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "answer",
      title: "Réponse",
      type: "text",
      rows: 4,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Catégorie",
      type: "string",
      options: {
        list: [
          { title: "Général", value: "general" },
          { title: "Tarifs", value: "tarifs" },
          { title: "Délais", value: "delais" },
          { title: "Technique", value: "technique" },
          { title: "Couleurs", value: "couleurs" },
        ],
        layout: "dropdown",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "order",
      title: "Ordre d'affichage",
      type: "number",
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: "question", subtitle: "category" },
  },
});
