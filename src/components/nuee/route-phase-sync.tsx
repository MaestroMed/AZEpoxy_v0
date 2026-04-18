"use client";

/**
 * RoutePhaseSync — global component mounted in the layout, listens to the
 * current pathname and automatically switches the narrative swarm to the
 * phase that page "belongs to".
 *
 * For pages that already set their own phase (e.g. homepage via
 * HomepageSwarmTimeline, collection pages via CollectionSwarmBinding),
 * this component defers — those mount-time declarations take precedence
 * because they setPhase AFTER us.
 *
 * We use this for the "generic" fallback routes that don't ship their
 * own nuée declaration (about, contact, blog, services, legal pages):
 * they all get the Galaxy phase by default — cosmic backdrop feels
 * right for text-heavy content.
 */

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getSwarm } from "@/lib/nuee/store";
import { GALAXY_PHASE } from "@/lib/nuee/phases/galaxy";
import { FLOW_PHASE } from "@/lib/nuee/phases/flow";
import { MOLTEN_POOL_PHASE } from "@/lib/nuee/phases/molten-pool";
import { RAL_CASCADE_PHASE } from "@/lib/nuee/phases/ral-cascade";
import { PAINT_GUN_PHASE } from "@/lib/nuee/phases/paint-gun";
import { OVEN_PHASE } from "@/lib/nuee/phases/oven";
import { SHIELD_PHASE } from "@/lib/nuee/phases/shield";
import { THUNDER_PHASE } from "@/lib/nuee/phases/thunder";
import type { Phase } from "@/lib/nuee/types";

/** Routes where OTHER components take over phase orchestration. */
const ORCHESTRATED_ROUTES = [
  /^\/$/,                         // homepage → HomepageSwarmTimeline
  /^\/couleurs-ral$/,             // RAL index → CouleursRalSwarmBinding
  /^\/couleurs-ral\/[^/]+$/,      // collection page → CollectionSwarmBinding
];

/**
 * Phase mapping for non-orchestrated routes. Each page of the site gets
 * a phase that resonates with its content :
 *
 *  /services/thermolaquage → Molten Pool (200°C bath, le cœur du métier)
 *  /services/sablage        → Paint Gun (projection, similar mechanic)
 *  /services/finitions      → RAL Cascade (le choix des teintes)
 *  /services/metallisation  → Flow (couche liquide sur le métal)
 *  /services                → Molten Pool (représente la spécialité principale)
 *  /specialites/*           → Galaxy (éventail, cosmique)
 *  /realisations            → Galaxy (portfolio, diversité)
 *  /devis, /rendez-vous, /contact → Flow (conversion, guidage fluide)
 *  /a-propos, /faq, /blog   → Galaxy (contemplatif)
 *  /thermolaquage-[ville]   → Molten Pool (local SEO mais métier central)
 *  Legal (cgv, mentions, confidentialite) → Galaxy (subtle, ne distrait pas)
 *  Default                  → Galaxy
 */
function fallbackPhaseFor(path: string): Phase {
  // Thermolaquage = le four (Oven), feu + chaleur pulsante
  if (/^\/services\/thermolaquage/.test(path)) return OVEN_PHASE;
  if (/^\/services\/sablage/.test(path)) return PAINT_GUN_PHASE;
  if (/^\/services\/finitions/.test(path)) return RAL_CASCADE_PHASE;
  if (/^\/services\/metallisation/.test(path)) return FLOW_PHASE;
  // Services index = le bain de fusion, la spécialité qui fonde tout
  if (/^\/services$/.test(path)) return MOLTEN_POOL_PHASE;
  // Pages SEO ville = Oven (on présente le four dans chaque ville)
  if (/^\/thermolaquage-/.test(path)) return OVEN_PHASE;
  if (/^\/devis|^\/rendez-vous|^\/contact/.test(path)) return FLOW_PHASE;
  // "Protection à vie" : bouclier pour /a-propos et les specialités
  // (l'expertise qui protège).
  if (/^\/a-propos|^\/specialites/.test(path)) return SHIELD_PHASE;
  return GALAXY_PHASE;
}

export function RoutePhaseSync() {
  const pathname = usePathname();

  useEffect(() => {
    // Record current path in the store so phases can read it if they want.
    getSwarm().setRoute(pathname);

    const orchestrated = ORCHESTRATED_ROUTES.some((re) => re.test(pathname));
    if (orchestrated) return;

    // Fire a phase swap for generic routes. Other declarations on the
    // same page (should any be added later) can override us by calling
    // setPhase themselves after mount.
    getSwarm().setPhase(fallbackPhaseFor(pathname), { durationMs: 1800 });
  }, [pathname]);

  return null;
}
