"use client";

/**
 * NotFoundSwarmBinding — active la phase Thunder quand la page 404
 * est rendue. La tempête électrique avec éclairs sporadiques
 * dramatise l'égarement : on ne trouve pas ce qu'on cherche, la nuée
 * s'agite.
 */

import { useEffect } from "react";
import { getSwarm } from "@/lib/nuee/store";
import { THUNDER_PHASE } from "@/lib/nuee/phases/thunder";

export function NotFoundSwarmBinding() {
  useEffect(() => {
    const s = getSwarm();
    s.setAnchorOffsetX(0);
    s.setPhase(THUNDER_PHASE, { durationMs: 2400 });
    return () => {
      s.setAnchorOffsetX(0);
    };
  }, []);
  return null;
}
