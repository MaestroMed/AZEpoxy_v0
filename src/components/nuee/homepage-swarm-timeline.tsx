"use client";

/**
 * Homepage narrative timeline for the swarm.
 *
 * Time-driven cycle, looping forever:
 *   AZ → Flow → Paint-Gun → Galaxy → AZ …
 *
 * This plays regardless of scroll position, so a viewer landing on the
 * page gets the full narrative even if they never scroll. Scroll-driven
 * phases are layered separately on other pages.
 *
 * Also sets a page-level horizontal anchor offset so the swarm sits on
 * the right half of the hero on desktop, leaving the left for the
 * heading text. Mobile stays centered.
 */

import { useEffect } from "react";
import { TimelinePhaseSync } from "./timeline-phase-sync";
import { AZ_PHASE } from "@/lib/nuee/phases/az";
import { FLOW_PHASE } from "@/lib/nuee/phases/flow";
import { GALAXY_PHASE } from "@/lib/nuee/phases/galaxy";
import { PAINT_GUN_PHASE } from "@/lib/nuee/phases/paint-gun";
import { MOLTEN_POOL_PHASE } from "@/lib/nuee/phases/molten-pool";
import { getSwarm } from "@/lib/nuee/store";

function responsiveOffset(): number {
  if (typeof window === "undefined") return 0;
  const w = window.innerWidth;
  const h = window.innerHeight;
  const aspect = w / h;
  // Portrait or near-square viewports: centered, no shift — the hero
  // stacks text above swarm vertically, shifting right would crop it.
  if (aspect < 1.15) return 0;
  if (w < 768) return 0;      // ultra narrow landscape (rare)
  if (w < 1024) return 0.35;  // small landscape
  if (w < 1280) return 0.6;   // laptop
  return 0.85;                 // desktop widescreen
}

function useResponsiveAnchor() {
  useEffect(() => {
    const apply = () => getSwarm().setAnchorOffsetX(responsiveOffset());
    apply();
    window.addEventListener("resize", apply);
    return () => {
      window.removeEventListener("resize", apply);
      // Reset when homepage unmounts so other routes start centered.
      getSwarm().setAnchorOffsetX(0);
    };
  }, []);
}

export function HomepageSwarmTimeline() {
  useResponsiveAnchor();
  return (
    <TimelinePhaseSync
      cues={[
        // 1. AZ identity beat — the brand introduces itself.
        { phase: AZ_PHASE, holdMs: 5500, transitionMs: 1800 },
        // 2. Molten Pool — 200°C en bain de fusion, cœur blanc-jaune,
        //    vapeur qui monte. La promesse thermique rendue poétique.
        { phase: MOLTEN_POOL_PHASE, holdMs: 5500, transitionMs: 2200 },
        // 3. Flow — courant post-fusion, orange brassé et blanc chaud.
        { phase: FLOW_PHASE, holdMs: 4500, transitionMs: 2000 },
        // 4. Paint gun — projection en action. Money shot.
        { phase: PAINT_GUN_PHASE, holdMs: 6500, transitionMs: 2200 },
        // 5. Galaxy — zoom out cosmique, "protection à vie".
        { phase: GALAXY_PHASE, holdMs: 7000, transitionMs: 2400 },
      ]}
    />
  );
}
