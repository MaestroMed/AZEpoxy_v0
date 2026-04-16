import { defineField, defineType } from "sanity";

export const lead = defineType({
  name: "lead",
  title: "Lead (formulaire)",
  type: "document",
  // Phase 3 will write to this from the API routes. Read access stays locked
  // by default — the dataset must require auth for "lead" docs.
  fields: [
    defineField({
      name: "source",
      title: "Source",
      type: "string",
      options: { list: ["contact", "devis", "guide", "abandoned", "other"] },
      validation: (r) => r.required(),
      initialValue: "contact",
    }),
    defineField({
      name: "name",
      title: "Nom",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "phone", title: "Téléphone", type: "string" }),
    defineField({ name: "company", title: "Entreprise", type: "string" }),
    defineField({ name: "message", title: "Message", type: "text", rows: 5 }),
    defineField({ name: "projectType", title: "Type de projet", type: "string" }),
    defineField({ name: "ralCode", title: "Code RAL", type: "string" }),
    defineField({ name: "ipHash", title: "IP (hashed)", type: "string", readOnly: true }),
    defineField({
      name: "status",
      title: "Statut",
      type: "string",
      options: { list: ["new", "contacted", "qualified", "won", "lost"] },
      initialValue: "new",
    }),
    defineField({
      name: "submittedAt",
      title: "Soumis le",
      type: "datetime",
      readOnly: true,
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "source", status: "status" },
    prepare({ title, subtitle, status }) {
      return { title, subtitle: `${subtitle ?? "?"} · ${status ?? "new"}` };
    },
  },
});
