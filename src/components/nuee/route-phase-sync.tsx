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

/** Routes where OTHER components take over phase orchestration. */
const ORCHESTRATED_ROUTES = [
  /^\/$/,                         // homepage → HomepageSwarmTimeline
  /^\/couleurs-ral\/[^/]+$/,      // collection page → CollectionSwarmBinding
];

/** Fallback phase mapping for everything else. */
function fallbackPhaseFor(path: string) {
  if (/^\/devis|^\/rendez-vous|^\/contact/.test(path)) return FLOW_PHASE;
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
