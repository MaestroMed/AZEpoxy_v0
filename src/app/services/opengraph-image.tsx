import { ImageResponse } from "next/og";
import { ogTemplate } from "@/lib/og";

export const runtime = "edge";
export const alt = "Nos services — AZ Époxy";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function ServicesOg() {
  return new ImageResponse(
    ogTemplate({
      label: "Services",
      title: "4 métiers. 1 exigence.",
      tagline:
        "Thermolaquage · sablage · métallisation · finitions spéciales.",
    }),
    size
  );
}
