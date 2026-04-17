import type { ReactElement } from "react";
import { SITE } from "@/lib/utils";

interface OgTemplateInput {
  /** Small uppercase eyebrow, e.g. "Devis" or "Blog". */
  label: string;
  /** Big headline — keep it short, two lines max. */
  title: string;
  /** Single-line supporting copy. Shown under the title. */
  tagline: string;
  /** City / region shown in the footer. Defaults to the atelier city. */
  footerLeft?: string;
}

/**
 * Brand-consistent OG template. Returns the JSX passed into `ImageResponse`
 * from each route-level `opengraph-image.tsx`. All styles are inline because
 * Satori (the edge renderer behind ImageResponse) does not parse Tailwind.
 */
export function ogTemplate({
  label,
  title,
  tagline,
  footerLeft = `${SITE.address.city} · Île-de-France`,
}: OgTemplateInput): ReactElement {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px",
        background:
          "linear-gradient(135deg, #1A1A2E 0%, #0F0F1A 60%, #1A1A2E 100%)",
        color: "#F5F5F0",
        fontFamily: "system-ui, sans-serif",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -200,
          left: -200,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "rgba(232, 93, 44, 0.45)",
          filter: "blur(140px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -160,
          right: -160,
          width: 520,
          height: 520,
          borderRadius: "50%",
          background: "rgba(232, 93, 44, 0.25)",
          filter: "blur(140px)",
        }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 12,
            background: "linear-gradient(135deg, #E85D2C 0%, #C84818 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 900,
            fontSize: 28,
            color: "white",
            letterSpacing: -1,
          }}
        >
          AZ
        </div>
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
          <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: -0.5 }}>
            ÉPOXY
          </div>
          <div
            style={{
              fontSize: 13,
              marginTop: 6,
              color: "#E85D2C",
              letterSpacing: 4,
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            {label}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            fontSize: 80,
            fontWeight: 800,
            lineHeight: 0.95,
            letterSpacing: -2,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 30,
            color: "rgba(245,245,240,0.72)",
            lineHeight: 1.25,
            maxWidth: 980,
          }}
        >
          {tagline}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 22,
          color: "rgba(245,245,240,0.55)",
        }}
      >
        <div>{footerLeft}</div>
        <div style={{ color: "#E85D2C", fontWeight: 700 }}>
          {SITE.url.replace(/^https?:\/\//, "")}
        </div>
      </div>
    </div>
  );
}
