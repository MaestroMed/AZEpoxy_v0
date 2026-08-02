"use client";

import { useEffect } from "react";
import { trackEvent } from "@/components/analytics/ga4";

/**
 * Suivi des trois conversions qui comptent pour un artisan :
 * clic téléphone, clic e-mail, envoi de formulaire.
 *
 * Le suivi passe par un écouteur délégué posé sur `document`, pas par des
 * handlers ajoutés composant par composant : n'importe quel `tel:` ou
 * `mailto:` ajouté plus tard est mesuré sans qu'on ait à y penser.
 *
 * Chaque événement porte un paramètre `source` qui dit *d'où* vient le clic
 * (header, footer, barre collante, section…). Sans lui on sait qu'on a reçu
 * dix appels, mais pas quel emplacement les a produits.
 *
 * `trackEvent` ne fait rien tant que gtag n'est pas chargé — c'est-à-dire tant
 * que le visiteur n'a pas accepté les cookies. Aucun appel réseau n'a donc lieu
 * avant le consentement.
 */

/** Remonte les ancêtres pour nommer l'emplacement, du plus précis au plus vague. */
function resolveSource(start: Element | null): string {
  for (let node: Element | null = start; node; node = node.parentElement) {
    const explicit = node.getAttribute("data-analytics-source");
    if (explicit) return explicit;

    const tag = node.tagName.toLowerCase();
    if (tag === "header") return "header";
    if (tag === "footer") return "footer";
    if (tag === "nav") return "nav";

    // `className` n'est une chaîne que sur les éléments HTML — sur un SVG
    // c'est un SVGAnimatedString, d'où le contrôle de type.
    const cls = typeof node.className === "string" ? node.className : "";
    if (/\b(sticky|fixed)\b/.test(cls)) return "sticky";

    if (tag === "section" && node.id) return node.id;
  }
  return "page";
}

export default function ConversionTracking() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest("a[href]");
      if (!link) return;

      const href = link.getAttribute("href") ?? "";
      const source = resolveSource(link);

      if (href.startsWith("tel:")) {
        trackEvent("contact_phone", { source });
      } else if (href.startsWith("mailto:")) {
        trackEvent("contact_email", { source });
      }
    };

    const onSubmit = (event: Event) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;

      trackEvent("contact_form", {
        source: resolveSource(form),
        form: form.getAttribute("name") || form.id || "sans-nom",
      });
    };

    // En phase de capture : l'événement est compté même si un handler en aval
    // appelle stopPropagation ou remplace la navigation.
    document.addEventListener("click", onClick, true);
    document.addEventListener("submit", onSubmit, true);

    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("submit", onSubmit, true);
    };
  }, []);

  return null;
}
