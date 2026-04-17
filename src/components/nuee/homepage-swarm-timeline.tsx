"use client";

/**
 * Homepage narrative timeline for the swarm.
 *
 * Time-driven cycle, looping forever:
 *   AZ (6s) → morph (2s) → Flow (5s) → morph (2.4s) → Galaxy (7s) → morph (2s) → AZ …
 *
 * This plays regardless of scroll position, so a viewer landing on the
 * page gets the full narrative even if they never scroll. Scroll-driven
 * phases are layered separately on other pages.
 */

import { TimelinePhaseSync } from "./timeline-phase-sync";
import { AZ_PHASE } from "@/lib/nuee/phases/az";
import { FLOW_PHASE } from "@/lib/nuee/phases/flow";
import { GALAXY_PHASE } from "@/lib/nuee/phases/galaxy";

export function HomepageSwarmTimeline() {
  return (
    <TimelinePhaseSync
      cues={[
        { phase: AZ_PHASE, holdMs: 6000, transitionMs: 1800 },
        { phase: FLOW_PHASE, holdMs: 5000, transitionMs: 2000 },
        { phase: GALAXY_PHASE, holdMs: 7000, transitionMs: 2400 },
      ]}
    />
  );
}
