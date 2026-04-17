"use client";

/**
 * CollectionSwarmBinding — mounted on each /couleurs-ral/[slug] page.
 *
 * Declares that while this page is active, the narrative swarm should be
 * in the collection-name phase (e.g. "PATINA" in corten-brown). On unmount,
 * the swarm naturally transitions back to whatever the next page declares.
 *
 * This is the per-route "phase declaration" pattern: each page knows what
 * the swarm should be doing for it. No central route registry needed.
 */

import { useEffect, useMemo } from "react";
import { getSwarm } from "@/lib/nuee/store";
import { createCollectionNamePhase } from "@/lib/nuee/phases/collection-name";

export function CollectionSwarmBinding({
  name,
  accentHex,
}: {
  name: string;
  accentHex: string;
}) {
  const phase = useMemo(
    () => createCollectionNamePhase(name, accentHex),
    [name, accentHex],
  );

  useEffect(() => {
    getSwarm().setPhase(phase, { durationMs: 2000 });
  }, [phase]);

  return null;
}
