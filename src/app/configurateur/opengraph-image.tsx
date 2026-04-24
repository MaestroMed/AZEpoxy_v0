import { ImageResponse } from "next/og";
import { ogTemplate } from "@/lib/og";

export const runtime = "edge";
export const alt = "Configurateur visuel — AZ Époxy";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function ConfigurateurOg() {
  return new ImageResponse(
    ogTemplate({
      label: "Configurateur",
      title: "Visualisez votre finition.",
      tagline:
        "Jante, portail, mobilier, moto · 18 RAL · 3 finitions · aperçu temps réel.",
    }),
    size,
  );
}
