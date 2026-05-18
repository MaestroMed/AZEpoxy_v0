import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { PublicChrome } from "@/components/layout/public-chrome";
import { JsonLd } from "@/components/seo/json-ld";
import { MotionProvider } from "@/components/motion";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SITE } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";
import {
  localBusinessLd,
  organizationLd,
  websiteLd,
} from "@/lib/jsonld";
import { getReviews } from "@/lib/reviews-data";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F5F0" },
    { media: "(prefers-color-scheme: dark)", color: "#1A1A2E" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  ...buildMetadata({
    title:
      "AZ Époxy — Thermolaquage Poudre Époxy Professionnel | 200+ Couleurs RAL",
    description:
      "Thermolaquage poudre époxy professionnel à Bruyères-sur-Oise (95). 200+ couleurs RAL, cabine 7m, service express 48h, 0 COV. Jantes, moto, pièces métalliques, mobilier.",
    path: "/",
    keywords: [
      "thermolaquage",
      "poudre époxy",
      "peinture poudre",
      "RAL",
      "NCS",
      "sablage",
      "finitions spéciales",
      "anti-corrosion",
      "jantes thermolaquées",
      "moto art",
      "Île-de-France",
      "Bruyères-sur-Oise",
      "Val-d'Oise",
      "AZ Époxy",
      "AZ Construction",
    ],
  }),
  title: {
    default:
      "AZ Époxy — Thermolaquage Poudre Époxy Professionnel | 200+ Couleurs RAL",
    template: "%s | AZ Époxy",
  },
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  publisher: SITE.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Icons are auto-wired by Next.js from src/app/icon.svg + src/app/apple-icon.tsx
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const reviews = await getReviews();
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${outfit.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground antialiased font-sans">
        <JsonLd id="ld-business" data={localBusinessLd({ reviews })} />
        <JsonLd id="ld-organization" data={organizationLd()} />
        <JsonLd id="ld-website" data={websiteLd()} />
        <ThemeProvider>
          <MotionProvider>
            {/* PublicChrome renders the entire public-site shell
                (header, footer, swarm, easter eggs, banners) on every
                non-admin route and renders only `{children}` on
                /admin/* — the backoffice has its own visual context. */}
            <PublicChrome>{children}</PublicChrome>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
