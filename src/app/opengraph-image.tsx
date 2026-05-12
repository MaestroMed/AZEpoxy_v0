import { ImageResponse } from "next/og";
import { ogTemplate } from "@/lib/og";

export const runtime = "edge";
export const alt = "AZ Époxy — Thermolaquage poudre époxy";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    ogTemplate({
      label: "Thermolaquage",
      title: "Thermolaquage premium",
      tagline:
        "200+ couleurs RAL & NCS · cabine 7 × 3 × 4 m · express 48 h · 0 COV",
    }),
    size
  );
}
