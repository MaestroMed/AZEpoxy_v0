"use client";

/**
 * TimelinePhaseSync — time-driven phase cycling.
 *
 * Unlike scroll-phase-sync, this component plays a fixed-duration cinematic
 * in the narrative swarm, looping forever. Used on the homepage hero so
 * the viewer sees the full AZ → Flow → Galaxy narrative even if they never
 * scroll.
 *
 * Each entry specifies how long to HOLD in that phase (after its transition
 * in completed). The transition duration is the one passed to setPhase.
 *
 * We use `setTimeout` chains rather than a rAF scheduler — setPhase is
 * idempotent per-phase, and ms-level precision is all the narrative needs.
 */

import { useEffect, useRef } from "react";
import type { Phase } from "@/lib/nuee/types";
import { getSwarm } from "@/lib/nuee/store";

export interface TimelineCue {
  phase: Phase;
  holdMs: number;        // time to dwell in this phase
  transitionMs?: number; // duration of A→B morph when entering this phase
}

export function TimelinePhaseSync({ cues, loop = true }: { cues: TimelineCue[]; loop?: boolean }) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idxRef = useRef(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    if (cues.length === 0) return;
    idxRef.current = 0;
    pausedRef.current = false;

    const play = () => {
      if (pausedRef.current) return;
      const cue = cues[idxRef.current];
      getSwarm().setPhase(cue.phase, { durationMs: cue.transitionMs ?? 1600 });

      const stepDuration = (cue.transitionMs ?? 1600) + cue.holdMs;
      timerRef.current = setTimeout(() => {
        idxRef.current += 1;
        if (idxRef.current >= cues.length) {
          if (!loop) return;
          idxRef.current = 0;
        }
        play();
      }, stepDuration);
    };

    // Pause the timeline when the tab is backgrounded — we don't want the
    // phase to keep "advancing" while the animation itself is paused.
    const onVis = () => {
      pausedRef.current = document.hidden;
      if (!document.hidden && timerRef.current === null) {
        // Re-kick the loop when coming back into focus.
        play();
      }
    };
    document.addEventListener("visibilitychange", onVis);

    play();

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = null;
      pausedRef.current = true;
    };
  }, [cues, loop]);

  return null;
}
