import { ImageResponse } from "next/og";
import { ogTemplate } from "@/lib/og";

export const runtime = "edge";
export const alt = "Contact — AZ Époxy";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function ContactOg() {
  return new ImageResponse(
    ogTemplate({
      label: "Contact",
      title: "Parlons de votre projet.",
      tagline:
        "Bruyères-sur-Oise · Val-d'Oise · Lun–Ven 8h–18h · Réponse sous 24h.",
    }),
    size,
  );
}
