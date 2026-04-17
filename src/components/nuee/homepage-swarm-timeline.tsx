"use client";

/**
 * Homepage-specific scroll timeline for the narrative swarm.
 *
 * Wrapped as a client component so the server-rendered page.tsx can compose
 * it without worrying about the non-serializable Phase objects.
 */

import { ScrollPhaseSync } from "./scroll-phase-sync";
import { AZ_PHASE } from "@/lib/nuee/phases/az";
import { GALAXY_PHASE } from "@/lib/nuee/phases/galaxy";

export function HomepageSwarmTimeline() {
  return (
    <ScrollPhaseSync
      timeline={[
        // Hero — particles form the AZ letters.
        { at: 0.0, phase: AZ_PHASE, durationMs: 0 },
        // Past the hero, particles explode outward into a slow 3D galaxy
        // that becomes the backdrop for the rest of the page.
        { at: 0.18, phase: GALAXY_PHASE, durationMs: 2400 },
      ]}
    />
  );
}
