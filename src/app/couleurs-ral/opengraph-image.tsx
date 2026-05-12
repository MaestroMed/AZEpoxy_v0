import { ImageResponse } from "next/og";
import { ogTemplate } from "@/lib/og";

export const runtime = "edge";
export const alt = "Nuancier RAL — AZ Époxy";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function CouleursRalOg() {
  return new ImageResponse(
    ogTemplate({
      label: "Couleurs",
      title: "Un nuancier qui respire.",
      tagline:
        "Nuanciers RAL & NCS · 4 familles d'effets architecturaux premium.",
    }),
    size,
  );
}
