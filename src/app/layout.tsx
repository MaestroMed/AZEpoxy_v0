import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SITE } from "@/lib/utils";

export const viewport: Viewport = {
  themeColor: "#1A1A2E",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "AZ Époxy — Thermolaquage Poudre Époxy Professionnel | 200+ Couleurs RAL",
    template: "%s | AZ Époxy",
  },
  description:
    "Thermolaquage poudre époxy professionnel à Bruyères-sur-Oise (95). 200+ couleurs RAL, cabine 7m, service express 48h, 0 COV. Jantes, moto, pièces métalliques, mobilier.",
  keywords: [
    "thermolaquage",
    "poudre époxy",
    "peinture poudre",
    "RAL",
    "sablage",
    "métallisation",
    "anti-corrosion",
    "jantes thermolaquées",
    "moto art",
    "Île-de-France",
    "Bruyères-sur-Oise",
    "Val-d'Oise",
    "AZ Époxy",
    "AZ Construction",
  ],
  authors: [{ name: "AZ Époxy" }],
  creator: "AZ Époxy",
  publisher: "AZ Époxy",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE.url,
    title: "AZ Époxy — Thermolaquage Poudre Époxy Professionnel",
    description:
      "200+ couleurs RAL, cabine 7m, express 48h, 0 COV. Finition premium pour jantes, moto, pièces métalliques et mobilier.",
    siteName: "AZ Époxy",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AZ Époxy — Thermolaquage poudre époxy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AZ Époxy — Thermolaquage Poudre Époxy",
    description:
      "200+ couleurs RAL, cabine 7m, express 48h. Finition premium industrielle.",
    images: ["/og-image.jpg"],
  },
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
  alternates: {
    canonical: SITE.url,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE.url}#business`,
  name: SITE.name,
  alternateName: "AZ Epoxy",
  description:
    "Thermolaquage poudre époxy professionnel, 200+ couleurs RAL, sablage, métallisation, finitions spéciales.",
  url: SITE.url,
  telephone: SITE.phone,
  email: SITE.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.city,
    postalCode: SITE.address.zip,
    addressCountry: "FR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 49.147,
    longitude: 2.327,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "18:00",
    },
  ],
  areaServed: [
    { "@type": "AdministrativeArea", name: "Île-de-France" },
    { "@type": "AdministrativeArea", name: "Val-d'Oise" },
  ],
  parentOrganization: {
    "@type": "Organization",
    name: SITE.parent.name,
    url: SITE.parent.url,
  },
  priceRange: "€€",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-background antialiased">
        <Script
          id="ld-json-business"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <Header />
        <main className="relative">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
