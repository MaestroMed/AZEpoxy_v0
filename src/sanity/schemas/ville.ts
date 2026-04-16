import { defineField, defineType } from "sanity";

export const ville = defineType({
  name: "ville",
  title: "Ville desservie",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Nom", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 64 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "department", title: "Département", type: "string", validation: (r) => r.required() }),
    defineField({ name: "departmentCode", title: "Code département", type: "string", validation: (r) => r.required() }),
    defineField({ name: "distance", title: "Distance", type: "string", placeholder: "15 km" }),
    defineField({ name: "driveTime", title: "Temps de trajet", type: "string", placeholder: "20 min" }),
    defineField({ name: "access", title: "Accès", type: "string", placeholder: "A15 puis RD927" }),
    defineField({ name: "localContext", title: "Contexte local (texte SEO)", type: "text", rows: 6 }),
    defineField({
      name: "nearbyVilles",
      title: "Villes proches (slugs)",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
  ],
  preview: { select: { title: "name", subtitle: "departmentCode" } },
});
