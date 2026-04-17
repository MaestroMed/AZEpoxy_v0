"use client";

/**
 * NarrativeSwarm — the persistent canvas.
 *
 * Mounted once in app/layout.tsx, never unmounts on navigation. Renders a
 * WebGL2 point cloud whose shape is driven by the `useSwarm` store.
 *
 * Inputs wired here:
 *   • window mousemove → store.setMouse (rAF-throttled, normalized -1..1)
 *   • window scroll    → store.setScroll (document progress, 0..1)
 *   • document visibility / reduced-motion → store.setPaused
 *
 * Phase changes are driven by OTHER components (scroll-phase-sync,
 * route-phase-sync, per-page declarations) via store.setPhase.
 */

import { useEffect, useRef } from "react";
import { createEngine } from "@/lib/nuee/engine";
import { getSwarm, useSwarm } from "@/lib/nuee/store";

export function NarrativeSwarm() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const setPaused = useSwarm((s) => s.setPaused);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Respect the user's reduced-motion preference outright — no WebGL, no
    // render loop. The canvas simply stays blank.
    const prefersReduced = matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (prefersReduced) {
      setPaused(true);
      return;
    }

    let handle: ReturnType<typeof createEngine> | null = null;
    try {
      handle = createEngine(canvas);
    } catch (err) {
      // WebGL2 unavailable — silently skip. (Fallback can be added later.)
      console.warn("[NarrativeSwarm] engine init failed:", err);
      return;
    }

    // ── Mouse tracking (rAF-throttled, normalized -1..1) ───────────────
    const store = getSwarm;
    let raf = 0;
    let pendingMouse: [number, number] | null = null;
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -((e.clientY / window.innerHeight) * 2 - 1);
      pendingMouse = [nx, ny];
      if (!raf) {
        raf = requestAnimationFrame(() => {
          if (pendingMouse) store().setMouse([pendingMouse[0], pendingMouse[1], 0]);
          pendingMouse = null;
          raf = 0;
        });
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    // ── Scroll progress (document-relative, 0..1) ──────────────────────
    const onScroll = () => {
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      store().setScroll(window.scrollY / max);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // ── Visibility → pause saves battery when tab is backgrounded ──────
    const onVis = () => store().setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVis);
      if (raf) cancelAnimationFrame(raf);
      handle?.dispose();
    };
  }, [setPaused]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      // z-0 + fixed puts the canvas above body background but below any
      // positioned content (main, header, footer — they all have
      // position:relative which creates stacking context above us).
      // Pointer-events disabled so content stays interactive.
    />
  );
}
