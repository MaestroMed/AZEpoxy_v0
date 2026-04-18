import { ImageResponse } from "next/og";
import { ogTemplate } from "@/lib/og";

export const runtime = "edge";
export const alt = "À propos — AZ Époxy";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function AProposOg() {
  return new ImageResponse(
    ogTemplate({
      label: "Entreprise",
      title: "L'excellence industrielle.",
      tagline:
        "1 800 m² d'atelier · 15+ ans d'expérience · 2 000 projets/an.",
    }),
    size,
  );
}
