import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Paramètres du site",
  type: "document",
  // Single doc — pinned in Studio via a structure customization (added later).
  fields: [
    defineField({ name: "tagline", title: "Accroche globale", type: "string" }),
    defineField({ name: "metaDescription", title: "Description SEO par défaut", type: "text", rows: 3 }),
    defineField({
      name: "phone",
      title: "Téléphone affiché",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "Email de contact",
      type: "string",
    }),
    defineField({
      name: "instagram",
      title: "Instagram URL",
      type: "url",
    }),
    defineField({
      name: "googlePlaceId",
      title: "Google Place ID (Phase 4 reviews sync)",
      type: "string",
    }),
  ],
  preview: { prepare: () => ({ title: "Paramètres du site" }) },
});
