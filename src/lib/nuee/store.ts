"use client";

import { create } from "zustand";
import type { Phase, SwarmState, Vec3 } from "./types";
import { AZ_PHASE } from "./phases/az";

/**
 * The single source of truth for the narrative swarm.
 *
 * The engine reads `currentPhase` / `targetPhase` / `transitionProgress`
 * each frame to compute particle targets. Pages write to it via `setPhase`
 * to trigger a cross-route or scroll-driven transition.
 *
 * NOTE: this store is process-scoped; the engine is the ONLY ticker of
 * `tickTransition`. Pages should never call it directly.
 */
export const useSwarm = create<SwarmState>((set, get) => ({
  currentPhase: AZ_PHASE,
  targetPhase: null,
  transitionProgress: 0,
  transitionDurationMs: 1600,
  mouse: [0, 0, 0] as Vec3,
  scroll: 0,
  routePath: "/",
  paused: false,
  anchorOffsetX: 0,
  burstUntil: 0,

  setPhase(next: Phase, opts) {
    const { currentPhase, targetPhase } = get();
    // No-op if we're already targeting this phase (or already there with no transition).
    if (targetPhase?.id === next.id) return;
    if (!targetPhase && currentPhase.id === next.id) return;

    set({
      targetPhase: next,
      transitionProgress: 0,
      transitionDurationMs: opts?.durationMs ?? 1600,
    });
  },

  setMouse(m: Vec3) {
    set({ mouse: m });
  },

  setScroll(s: number) {
    set({ scroll: Math.max(0, Math.min(1, s)) });
  },

  setPaused(p: boolean) {
    set({ paused: p });
  },

  setRoute(path: string) {
    set({ routePath: path });
  },

  setAnchorOffsetX(x: number) {
    set({ anchorOffsetX: x });
  },

  triggerBurst(durationMs = 900) {
    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
    set({ burstUntil: now + durationMs });
  },

  tickTransition(dt: number) {
    const { targetPhase, transitionProgress, transitionDurationMs } = get();
    if (!targetPhase) return;
    const next = transitionProgress + dt / transitionDurationMs;
    if (next >= 1) {
      set({
        currentPhase: targetPhase,
        targetPhase: null,
        transitionProgress: 0,
      });
    } else {
      set({ transitionProgress: next });
    }
  },
}));

/** Non-reactive getter for use inside the render loop (avoids re-renders). */
export const getSwarm = useSwarm.getState;
