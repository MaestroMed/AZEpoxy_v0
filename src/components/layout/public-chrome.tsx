"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CookieConsent } from "@/components/ui/cookie-consent";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { MobileStickyCta } from "@/components/ui/mobile-sticky-cta";
import { LiveAtelierBanner } from "@/components/ui/live-atelier-banner";
import { NarrativeSwarm } from "@/components/nuee/narrative-swarm";
import { RoutePhaseSync } from "@/components/nuee/route-phase-sync";
import { CustomCursor } from "@/components/nuee/custom-cursor";
import { SoundToggle } from "@/components/nuee/sound-toggle";
import { CommandPalette } from "@/components/nuee/command-palette";
import { ScrollToTop } from "@/components/nuee/scroll-to-top";
import { EasterEgg } from "@/components/nuee/easter-egg";
import GA4 from "@/components/analytics/ga4";

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
