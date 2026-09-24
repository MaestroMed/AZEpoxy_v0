"use client";

import Script from "next/script";
import { useEffect, useId, useRef, useState } from "react";

const TURNSTILE_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

interface TurnstileWidgetProps {
  siteKey: string | undefined;
  /** Invoked with the verification token (or null on reset/error). */
  onToken: (token: string | null) => void;
  /** Optional label rendered above the widget; defaults hidden. */
  label?: string;
  /**
   * Incrémenter pour obtenir un nouveau token : un token Turnstile ne se
   * vérifie qu'une fois, il faut donc réinitialiser le widget après chaque
   * envoi refusé, sinon le deuxième essai échoue à coup sûr.
   */
  resetKey?: number;
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
export function TurnstileWidget({ siteKey, onToken, label, resetKey }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const inputId = useId();

  useEffect(() => {
    if (!siteKey || !scriptReady || !containerRef.current) return;
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
  }, [siteKey, scriptReady, onToken]);

  useEffect(() => {
    if (!resetKey || !widgetIdRef.current || !window.turnstile) return;
    onToken(null);
    window.turnstile.reset(widgetIdRef.current);
  }, [resetKey, onToken]);

  if (!siteKey) return null;

  return (
    <div>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-brand-night">
          {label}
        </label>
      )}
      {/* `onReady` et non `onLoad` : next/script n'appelle onLoad qu'au
          premier chargement du script. Au remontage du widget (retour à
          l'étape 4 du devis, navigation /contact → /devis), onLoad ne se
          redéclenche pas : le widget ne s'affichait plus, aucun token ne
          partait et le serveur refusait l'envoi. */}
      <Script
        src={TURNSTILE_SRC}
        strategy="lazyOnload"
        onReady={() => setScriptReady(true)}
      />
      <div ref={containerRef} id={inputId} className="min-h-[65px]" />
    </div>
  );
}
