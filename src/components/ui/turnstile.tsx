"use client";

import Script from "next/script";
import { useEffect, useId, useRef, useState } from "react";

const TURNSTILE_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";

interface TurnstileWidgetProps {
  siteKey: string | undefined;
  /** Invoked with the verification token (or null on reset/error). */
  onToken: (token: string | null) => void;
  /** Optional label rendered above the widget; defaults hidden. */
  label?: string;
}

interface TurnstileApi {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      callback?: (token: string) => void;
      "error-callback"?: () => void;
      "expired-callback"?: () => void;
      "timeout-callback"?: () => void;
      theme?: "light" | "dark" | "auto";
      size?: "normal" | "compact" | "flexible";
    }
  ) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

/**
 * Cloudflare Turnstile widget. Renders nothing when `siteKey` is missing so
 * dev environments aren't blocked — the server-side verify then short-circuits
 * with success + a `skipped` flag.
 */
export function TurnstileWidget({ siteKey, onToken, label }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const inputId = useId();

  useEffect(() => {
    if (!siteKey || !scriptLoaded || !containerRef.current) return;
    const api = window.turnstile;
    if (!api) return;

    widgetIdRef.current = api.render(containerRef.current, {
      sitekey: siteKey,
      theme: "auto",
      size: "flexible",
      callback: (token) => onToken(token),
      "expired-callback": () => onToken(null),
      "error-callback": () => onToken(null),
      "timeout-callback": () => onToken(null),
    });

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, scriptLoaded, onToken]);

  if (!siteKey) return null;

  return (
    <div>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-brand-night">
          {label}
        </label>
      )}
      <Script
        src={TURNSTILE_SRC}
        strategy="lazyOnload"
        onLoad={() => setScriptLoaded(true)}
      />
      <div ref={containerRef} id={inputId} className="min-h-[65px]" />
    </div>
  );
}
