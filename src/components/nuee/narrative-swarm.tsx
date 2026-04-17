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
      // eslint-disable-next-line no-console
      console.info("[NarrativeSwarm] engine mounted — WebGL2 ready");
    } catch (err) {
      // WebGL2 unavailable — log visibly so we notice in production.
      // eslint-disable-next-line no-console
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
      className="pointer-events-none fixed inset-0 z-0"
      // Explicit viewport sizing via inline style — Tailwind's h-full/w-full
      // resolved to 0×0 for this canvas in some browser contexts (likely a
      // containing-block quirk with `fixed inset-0`). Inline vw/vh units
      // bypass any containing-block ambiguity and guarantee full viewport.
      // Pointer-events disabled so content stays interactive.
      // CSS radial glow fallback so the hero is never a flat black void
      // even if WebGL2 init ever fails; WebGL draws on top.
      style={{
        width: "100vw",
        height: "100vh",
        background:
          "radial-gradient(ellipse at 50% 40%, rgba(232,93,44,0.35) 0%, rgba(232,93,44,0.14) 35%, transparent 72%)",
      }}
    />
  );
}
