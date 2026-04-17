import { ImageResponse } from "next/og";
import { ogTemplate } from "@/lib/og";

export const runtime = "edge";
export const alt = "Nos réalisations — AZ Époxy";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function RealisationsOg() {
  return new ImageResponse(
    ogTemplate({
      label: "Portfolio",
      title: "Nos réalisations.",
      tagline:
        "Jantes, moto, portails, mobilier, pièces industrielles — un aperçu de l'atelier.",
    }),
    size
  );
}
