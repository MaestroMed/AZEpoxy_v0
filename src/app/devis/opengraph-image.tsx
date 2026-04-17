import { ImageResponse } from "next/og";
import { ogTemplate } from "@/lib/og";

export const runtime = "edge";
export const alt = "Demander un devis gratuit — AZ Époxy";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function DevisOg() {
  return new ImageResponse(
    ogTemplate({
      label: "Devis gratuit",
      title: "Votre devis en 2 minutes.",
      tagline:
        "Envoyez vos photos, recevez un chiffrage personnalisé sous 24 h.",
    }),
    size
  );
}
