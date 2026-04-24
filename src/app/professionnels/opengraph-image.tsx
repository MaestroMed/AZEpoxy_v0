import { ImageResponse } from "next/og";
import { ogTemplate } from "@/lib/og";

export const runtime = "edge";
export const alt = "Espace Pro — AZ Époxy";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function ProfessionnelsOg() {
  return new ImageResponse(
    ogTemplate({
      label: "Espace Pro",
      title: "Votre partenaire thermolaquage.",
      tagline:
        "Tarifs dégressifs · planning réservé · facturation mensuelle · B2B.",
    }),
    size,
  );
}
