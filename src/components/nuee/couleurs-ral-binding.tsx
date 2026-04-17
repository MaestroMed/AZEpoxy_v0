"use client";

/**
 * CouleursRalSwarmBinding — mounted on /couleurs-ral.
 *
 * Activates the RAL_CASCADE phase : each particle holds its own RAL
 * hue and drifts slowly, celebrating the palette. Resets anchor offset
 * to 0 (centered cascade, spans full hero).
 *
 * Also registers the route in the orchestrated list (via RoutePhaseSync
 * regex) — we rely on priority: this binding's setPhase runs AFTER
 * RoutePhaseSync's fallback, taking precedence.
 */

import { useEffect } from "react";
import { getSwarm } from "@/lib/nuee/store";
import { RAL_CASCADE_PHASE } from "@/lib/nuee/phases/ral-cascade";

export function CouleursRalSwarmBinding() {
  useEffect(() => {
    const s = getSwarm();
    s.setAnchorOffsetX(0);              // cascade is centered / full-width
    s.setPhase(RAL_CASCADE_PHASE, { durationMs: 2200 });
    return () => {
      // On leaving the page, the next route's binding will take over.
      // Reset offset so we don't leak homepage's right-bias.
      s.setAnchorOffsetX(0);
    };
  }, []);
  return null;
}
