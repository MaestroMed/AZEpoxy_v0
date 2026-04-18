"use client";

/**
 * usePreviewPhase — quick utility so any link can "anticipate" its
 * destination by momentarily morphing the swarm to the target phase
 * on hover/focus, then reverting on leave.
 *
 * If the user actually navigates while the preview is active, the new
 * page's binding takes over (no double-morph). If they leave, we snap
 * back to whatever was active before the hover.
 *
 * Usage :
 *   const props = usePreviewPhase(() => COLLECTION_X_PHASE);
 *   <Link href="/x" {...props} />
 */

import { useCallback, useRef } from "react";
import { getSwarm } from "./store";
import type { Phase } from "./types";

export function usePreviewPhase(getPhase: () => Phase) {
  const previousRef = useRef<Phase | null>(null);

  const onEnter = useCallback(() => {
    const s = getSwarm();
    // Remember what was playing so we can revert cleanly.
    if (previousRef.current == null) previousRef.current = s.currentPhase;
    s.setPhase(getPhase(), { durationMs: 900 });
  }, [getPhase]);

  const onLeave = useCallback(() => {
    const prev = previousRef.current;
    previousRef.current = null;
    if (!prev) return;
    getSwarm().setPhase(prev, { durationMs: 900 });
  }, []);

  return {
    onMouseEnter: onEnter,
    onMouseLeave: onLeave,
    onFocus: onEnter,
    onBlur: onLeave,
  };
}
