"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CookieConsent } from "@/components/ui/cookie-consent";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { MobileStickyCta } from "@/components/ui/mobile-sticky-cta";
import { LiveAtelierBanner } from "@/components/ui/live-atelier-banner";
import GA4 from "@/components/analytics/ga4";

/**
 * Décorations clientes lourdes / non-critiques chargées en différé
 * (`ssr: false`) — elles sortent du chunk critique, donc du chemin de
 * rendu initial. Gain LCP/TBT sur mobile sans rien changer au contenu
 * ni au SEO (ce sont des couches interactives/visuelles).
 *
 * • NarrativeSwarm  : moteur WebGL de la nuée (le plus lourd à évaluer)
 * • CommandPalette  : recherche RAL fuzzy (fuse.js), déclenchée à ⌘K
 * • CustomCursor / SoundToggle / EasterEgg : delights desktop
 * • RoutePhaseSync / ScrollToTop : pilotage nuée + retour haut de page
 */
const NarrativeSwarm = dynamic(
  () => import("@/components/nuee/narrative-swarm").then((m) => m.NarrativeSwarm),
  { ssr: false },
);
const CommandPalette = dynamic(
  () => import("@/components/nuee/command-palette").then((m) => m.CommandPalette),
  { ssr: false },
);
const CustomCursor = dynamic(
  () => import("@/components/nuee/custom-cursor").then((m) => m.CustomCursor),
  { ssr: false },
);
const SoundToggle = dynamic(
  () => import("@/components/nuee/sound-toggle").then((m) => m.SoundToggle),
  { ssr: false },
);
const RoutePhaseSync = dynamic(
  () => import("@/components/nuee/route-phase-sync").then((m) => m.RoutePhaseSync),
  { ssr: false },
);
const ScrollToTop = dynamic(
  () => import("@/components/nuee/scroll-to-top").then((m) => m.ScrollToTop),
  { ssr: false },
);
const EasterEgg = dynamic(
  () => import("@/components/nuee/easter-egg").then((m) => m.EasterEgg),
  { ssr: false },
);

/**
 * Public-site chrome — header, footer, persistent canvas, easter eggs,
 * cookie banner, etc. Renders absolutely nothing on /admin routes so the
 * backoffice has its own isolated visual context.
 */
export function PublicChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <NarrativeSwarm />
      <RoutePhaseSync />
      <CustomCursor />
      <SoundToggle />
      <CommandPalette />
      <ScrollToTop />
      <EasterEgg />
      <LiveAtelierBanner />
      <Header />
      <main id="main-content" className="relative">
        {children}
      </main>
      <Footer />
      <GA4 />
      <WhatsAppButton />
      <MobileStickyCta />
      <CookieConsent />
    </>
  );
}
