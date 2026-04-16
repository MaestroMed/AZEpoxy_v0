import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./src/sanity/schemas";
import {
  apiVersion,
  dataset,
  projectId,
  studioUrl,
} from "./src/sanity/env";

/**
 * Standalone Studio config. Run with `npx sanity dev` (or `npx sanity deploy`).
 *
 * The marketing site does not embed the Studio — Sanity's hard React 19.2
 * peer requirement clashes with Next 15.5's bundled "react-builtin", so the
 * Studio runs as its own dev server. Schemas + content live in this repo so
 * the same source-of-truth ships to both surfaces.
 */
export default defineConfig({
  basePath: studioUrl,
  name: "azepoxy",
  title: "AZ Époxy CMS",
  projectId: projectId ?? "placeholder",
  dataset,
  apiVersion,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Contenu")
          .items([
            S.listItem()
              .title("Paramètres du site")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings")
              ),
            S.divider(),
            S.documentTypeListItem("post").title("Articles de blog"),
            S.documentTypeListItem("realisation").title("Réalisations"),
            S.documentTypeListItem("testimonial").title("Témoignages"),
            S.divider(),
            S.documentTypeListItem("service").title("Services"),
            S.documentTypeListItem("specialite").title("Spécialités"),
            S.documentTypeListItem("ville").title("Villes desservies"),
            S.documentTypeListItem("faqItem").title("FAQ"),
            S.divider(),
            S.documentTypeListItem("lead").title("Leads (formulaires)"),
            S.documentTypeListItem("review").title("Avis Google"),
          ]),
    }),
  ],
});
