"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import Link from "next/link";
import { useEffect } from "react";
import { Phone, CalendarClock } from "lucide-react";
import { SITE } from "@/lib/utils";

interface BookingEmbedProps {
  /** e.g. "azepoxy/visite-atelier" — set via NEXT_PUBLIC_CALCOM_LINK. */
  calLink?: string;
}

/**
 * Cal.com inline embed. When NEXT_PUBLIC_CALCOM_LINK is missing we render a
 * graceful fallback with phone + WhatsApp so /rendez-vous still converts.
 */
export function BookingEmbed({ calLink }: BookingEmbedProps) {
  const link = calLink ?? process.env.NEXT_PUBLIC_CALCOM_LINK;

  useEffect(() => {
    if (!link) return;
    (async () => {
      const cal = await getCalApi({ namespace: "azepoxy" });
      cal("ui", {
        theme: "light",
        cssVarsPerTheme: {
          light: { "cal-brand": "#E85D2C" },
          dark: { "cal-brand": "#E85D2C" },
        },
        hideEventTypeDetails: false,
      });
    })();
  }, [link]);

  if (!link) {
    return (
      <div className="rounded-2xl border border-brand-night/10 bg-white p-8 text-center shadow-sm">
        <CalendarClock className="mx-auto h-10 w-10 text-brand-orange" />
        <h2 className="heading-display mt-4 text-2xl text-brand-night">
          Prise de rendez-vous
        </h2>
        <p className="mt-3 text-brand-charcoal/70">
          La prise de rendez-vous en ligne n&apos;est pas encore active. Appelez-nous
          directement, nous vous trouvons un créneau sous 24h.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href={SITE.phoneHref} className="btn-primary">
            <Phone className="h-4 w-4" />
            {SITE.phone}
          </a>
          <Link href="/devis" className="btn-secondary">
            Demander un devis
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-brand-night/10 bg-white shadow-sm">
      <Cal
        namespace="azepoxy"
        calLink={link}
        style={{
          width: "100%",
          height: "100%",
          minHeight: 640,
          overflow: "scroll",
        }}
        config={{ layout: "month_view" }}
      />
    </div>
  );
}
