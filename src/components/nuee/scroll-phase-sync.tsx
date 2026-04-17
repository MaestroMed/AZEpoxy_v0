"use client";

/**
 * ScrollPhaseSync — page-level component that declares WHICH phases the
 * narrative swarm should morph between as the user scrolls.
 *
 * Pass an ordered list of phases + the scroll thresholds (0..1) at which
 * each becomes the target. When the scroll position crosses a threshold,
 * we call store.setPhase with the new phase.
 *
 * Example:
 *   <ScrollPhaseSync
 *     timeline={[
 *       { at: 0.00, phase: AZ_PHASE },
 *       { at: 0.20, phase: GALAXY_PHASE },
 *     ]}
 *   />
 */

import { useEffect, useRef } from "react";
import type { Phase } from "@/lib/nuee/types";
import { getSwarm, useSwarm } from "@/lib/nuee/store";

export interface TimelineEntry {
  at: number;        // 0..1 scroll progress at which this phase becomes active
  phase: Phase;
  durationMs?: number; // transition duration when we cross INTO this phase
}

export function ScrollPhaseSync({ timeline }: { timeline: TimelineEntry[] }) {
  const scroll = useSwarm((s) => s.scroll);
  const lastIndexRef = useRef<number>(-1);

  useEffect(() => {
    // Find the highest entry whose `at` <= current scroll.
    let idx = 0;
    for (let i = 0; i < timeline.length; i++) {
      if (timeline[i].at <= scroll) idx = i;
    }
    if (idx === lastIndexRef.current) return;
    lastIndexRef.current = idx;

    const entry = timeline[idx];
    getSwarm().setPhase(entry.phase, { durationMs: entry.durationMs ?? 1600 });
  }, [scroll, timeline]);

  // Also ensure initial phase is set on mount, regardless of starting scroll.
  useEffect(() => {
    if (timeline.length === 0) return;
    getSwarm().setPhase(timeline[0].phase, { durationMs: 0 });
  }, [timeline]);

  return null;
}
