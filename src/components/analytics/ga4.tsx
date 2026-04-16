"use client";

import { useState, useEffect } from "react";
import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA4_ID;

export default function GA4() {
  const [consented, setConsented] = useState<boolean | null>(null);

  useEffect(() => {
    if (localStorage.getItem("cookie-consent") === "accepted") {
      setConsented(true);
    }
  }, []);

  useEffect(() => {
    const handler = () => {
      if (localStorage.getItem("cookie-consent") === "accepted") {
        setConsented(true);
      }
    };
    window.addEventListener("cookie-consent-changed", handler);
    return () => window.removeEventListener("cookie-consent-changed", handler);
  }, []);

  if (!consented || !GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-config" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}

export type TrackEventParams = Record<
  string,
  string | number | boolean | undefined | null
>;

export function trackEvent(name: string, params?: TrackEventParams) {
  if (typeof window !== "undefined" && "gtag" in window) {
    (window as unknown as { gtag: (...args: unknown[]) => void }).gtag(
      "event",
      name,
      params
    );
  }
}
