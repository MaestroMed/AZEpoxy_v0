import { ImageResponse } from "next/og";
import { ogTemplate } from "@/lib/og";

export const runtime = "edge";
export const alt = "Glossaire — AZ Époxy";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function GlossaireOg() {
  return new ImageResponse(
    ogTemplate({
      label: "Glossaire",
      title: "Le lexique du thermolaquage.",
      tagline:
        "30 termes techniques · procédés · poudres · normes · finitions.",
    }),
    size,
  );
}
