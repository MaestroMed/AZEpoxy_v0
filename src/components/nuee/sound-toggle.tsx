"use client";

/**
 * SoundToggle — discreet button bottom-left of the viewport that toggles
 * the procedural ambient sound engine.
 *
 * First click triggers AudioContext creation (browsers require a user
 * gesture). Preference persists in localStorage so the user's choice
 * survives reloads. Defaults to OFF — we respect users who don't want
 * audio ambush.
 *
 * Mounted globally in the layout. Listens for phase transitions in the
 * store to trigger a subtle whoosh when a new phase takes over.
 */

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { getSoundEngine } from "@/lib/nuee/sound";
import { useSwarm } from "@/lib/nuee/store";

const STORAGE_KEY = "az-swarm-sound";

export function SoundToggle() {
  const [enabled, setEnabled] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Restore preference on mount — hydration-safe.
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "on") {
      setEnabled(true);
      getSoundEngine().enable();
    }
    setHydrated(true);
  }, []);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    window.localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
    if (next) getSoundEngine().enable();
    else getSoundEngine().disable();
  };

  // Whoosh on phase transition (when store starts morphing to a new target).
  const lastPhaseIdRef = useRef<string | null>(null);
  const targetPhase = useSwarm((s) => s.targetPhase);
  useEffect(() => {
    if (!targetPhase) return;
    if (lastPhaseIdRef.current === targetPhase.id) return;
    lastPhaseIdRef.current = targetPhase.id;
    if (enabled) getSoundEngine().whoosh(0.6);
  }, [targetPhase, enabled]);

  // Don't render until hydrated to avoid SSR/client mismatch on the icon.
  if (!hydrated) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={enabled ? "Couper le son ambiant" : "Activer le son ambiant"}
      data-magnetic
      className="group fixed bottom-5 left-5 z-[80] flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white/80 backdrop-blur-md transition-colors hover:border-white/45 hover:text-white"
    >
      {enabled ? (
        <Volume2 className="h-4 w-4" />
      ) : (
        <VolumeX className="h-4 w-4 opacity-70" />
      )}
      {/* Pulse ring when enabled */}
      {enabled && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full border border-white/30 motion-safe:animate-ping"
          style={{ animationDuration: "2.4s" }}
        />
      )}
    </button>
  );
}
