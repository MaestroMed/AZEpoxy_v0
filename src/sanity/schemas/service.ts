import { defineField, defineType } from "sanity";

const labelValue = {
  type: "object",
  fields: [
    defineField({ name: "label", title: "Libellé", type: "string", validation: (r) => r.required() }),
    defineField({ name: "value", title: "Valeur", type: "string", validation: (r) => r.required() }),
  ],
};

const titleDescription = {
  type: "object",
  fields: [
    defineField({ name: "title", title: "Titre", type: "string", validation: (r) => r.required() }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3, validation: (r) => r.required() }),
  ],
};

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "shortTitle",
      title: "Titre court",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 64 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "tagline",
      title: "Accroche",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description longue",
      type: "text",
      rows: 6,
    }),
    defineField({
      name: "icon",
      title: "Icône (lucide name)",
      type: "string",
      placeholder: "Flame, Wrench, Layers, Palette…",
    }),
    defineField({
      name: "features",
      title: "Points forts",
      type: "array",
      of: [titleDescription],
    }),
    defineField({
      name: "specs",
      title: "Spécifications techniques",
      type: "array",
      of: [labelValue],
    }),
    defineField({
      name: "faqs",
      title: "FAQ spécifique au service",
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
    defineField({
      name: "order",
      title: "Ordre d'affichage",
      type: "number",
      initialValue: 0,
    }),
  ],
  preview: { select: { title: "title", subtitle: "tagline" } },
});
