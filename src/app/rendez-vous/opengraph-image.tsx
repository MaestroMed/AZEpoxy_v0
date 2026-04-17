import { ImageResponse } from "next/og";
import { ogTemplate } from "@/lib/og";

export const runtime = "edge";
export const alt = "Prendre rendez-vous — AZ Époxy";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function RendezVousOg() {
  return new ImageResponse(
    ogTemplate({
      label: "Rendez-vous",
      title: "Prendre rendez-vous à l'atelier.",
      tagline:
        "Visitez nos 1 800 m² à Bruyères-sur-Oise. Créneaux sous 48 h.",
    }),
    size
  );
}
