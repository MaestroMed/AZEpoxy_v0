import { defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "Article de blog",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      validation: (r) => r.required().max(120),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "Description (meta + résumé)",
      type: "text",
      rows: 3,
      validation: (r) => r.required().max(220),
    }),
    defineField({
      name: "date",
      title: "Date de publication",
      type: "date",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "readTime",
      title: "Temps de lecture",
      type: "string",
      placeholder: "6 min",
    }),
    defineField({
      name: "category",
      title: "Catégorie",
      type: "string",
      options: {
        list: ["Guide", "Tutoriel", "Conseil", "Actualité", "Étude de cas"],
      },
    }),
    defineField({
      name: "image",
      title: "Image de couverture",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Texte alternatif",
        }),
      ],
    }),
    defineField({
      name: "content",
      title: "Contenu (HTML)",
      type: "text",
      rows: 30,
      description:
        "HTML rendu via dangerouslySetInnerHTML. Utilisez les balises <h2>, <p>, <ul>, <li>, <strong>.",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "category", media: "image" },
  },
});
