"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Phone, X } from "lucide-react";
import { cn, SITE } from "@/lib/utils";

const COOKIE_NAME = "azepoxy_exit_intent_dismissed";
const COOKIE_DAYS = 7;

function setDismissedCookie() {
  if (typeof document === "undefined") return;
  const expires = new Date();
  expires.setDate(expires.getDate() + COOKIE_DAYS);
  document.cookie = `${COOKIE_NAME}=1; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

function isDismissed(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split(";").some((c) => c.trim().startsWith(`${COOKIE_NAME}=1`));
}

interface ExitIntentModalProps {
  /** When true, heuristic fires once per session on desktop and on mobile back-button. */
  enabled?: boolean;
}

/**
 * Lightweight exit-intent modal. On desktop it triggers when the pointer
 * leaves the top edge of the viewport. On mobile it triggers on the first
 * history popstate (back button heuristic). Both paths respect a 7-day
 * dismiss cookie so users who clicked "not now" aren't bothered again.
 */
export function ExitIntentModal({ enabled = true }: ExitIntentModalProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    if (isDismissed()) return;

    let fired = false;
    const trigger = () => {
      if (fired) return;
      fired = true;
      setOpen(true);
    };

    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && e.relatedTarget === null) trigger();
    };

    const onPopState = () => {
      trigger();
      // Rewrite the state so the user doesn't actually navigate away.
      window.history.pushState(null, "", window.location.href);
    };

    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    if (isMobile) {
      window.history.pushState(null, "", window.location.href);
      window.addEventListener("popstate", onPopState);
    } else {
      document.addEventListener("mouseleave", onMouseLeave);
    }

    return () => {
      if (isMobile) window.removeEventListener("popstate", onPopState);
      else document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [enabled]);

  const dismiss = () => {
    setDismissedCookie();
    setOpen(false);
  };

  return (
    <div
      aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300",
        open ? "opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      <button
        type="button"
        aria-label="Fermer"
        onClick={dismiss}
        className="absolute inset-0 bg-brand-night/80 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="exit-intent-title"
        className={cn(
          "relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl transition-transform duration-300",
          open ? "translate-y-0" : "translate-y-4"
        )}
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label="Fermer la fenêtre"
          className="absolute right-4 top-4 z-10 rounded-full p-1 text-brand-charcoal/60 transition-colors hover:bg-brand-cream hover:text-brand-night"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="bg-gradient-ember px-6 py-5 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/80">
            Avant de partir…
          </p>
          <h2
            id="exit-intent-title"
            className="heading-display mt-2 text-2xl leading-tight"
          >
            Votre devis en 2 minutes.
          </h2>
        </div>

        <div className="space-y-4 px-6 py-6">
          <p className="text-brand-charcoal/80 leading-relaxed">
            Envoyez-nous une photo et quelques infos, et nous revenons vers vous
            sous 24h avec un chiffrage personnalisé. <strong>C&apos;est gratuit et sans engagement.</strong>
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/devis"
              onClick={dismiss}
              className="btn-primary w-full justify-center"
            >
              Demander mon devis
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={SITE.phoneHref}
              onClick={dismiss}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-night/15 bg-white px-6 py-3 text-sm font-semibold text-brand-night transition-colors hover:bg-brand-cream"
            >
              <Phone className="h-4 w-4" />
              Appeler {SITE.phone}
            </a>
            <button
              type="button"
              onClick={dismiss}
              className="text-xs text-brand-charcoal/50 hover:text-brand-charcoal"
            >
              Non merci, je continue ma visite
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
