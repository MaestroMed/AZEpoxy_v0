import { ImageResponse } from "next/og";
import { ogTemplate } from "@/lib/og";

export const runtime = "edge";
export const alt = "FAQ — AZ Époxy";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function FaqOg() {
  return new ImageResponse(
    ogTemplate({
      label: "FAQ",
      title: "Toutes les réponses.",
      tagline:
        "Questions fréquentes sur le thermolaquage, sablage, métallisation et finitions.",
    }),
    size,
  );
}
