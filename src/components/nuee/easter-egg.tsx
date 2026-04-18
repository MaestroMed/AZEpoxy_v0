"use client";

/**
 * EasterEgg — guette les séquences de touches et déclenche un burst
 * de la nuée narrative. Minimal, global, opt-in par effet.
 *
 * Séquences actives :
 *   • "az"         → burst 900ms (brand signature)
 *   • "boom"       → burst 1500ms (plus long, plus dramatique)
 *   • Konami code  → burst 2000ms + sound whoosh
 *
 * Détection : on accumule les keystrokes dans un rolling buffer
 * de 12 caractères, on check chaque frappe. Ignore les frappes
 * quand l'utilisateur est focus sur un input/textarea (ne veut pas
 * exploser la nuée pendant qu'on tape son nom).
 */

import { useEffect } from "react";
import { getSwarm } from "@/lib/nuee/store";
import { getSoundEngine } from "@/lib/nuee/sound";

const SEQUENCES: Array<{
  match: string;
  burstMs: number;
  withWhoosh?: boolean;
}> = [
  { match: "az", burstMs: 900 },
  { match: "boom", burstMs: 1500, withWhoosh: true },
  { match: "arrowuparrowuparrowdownarrowdownarrowleftarrowrightarrowleftarrowrightba", burstMs: 2200, withWhoosh: true },
];

const BUFFER_MAX = 64;

export function EasterEgg() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let buffer = "";
    let lastKeyAt = 0;
    const RESET_AFTER_MS = 1800; // timeout between keystrokes

    const onKey = (e: KeyboardEvent) => {
      // Skip while typing in a field — les eggs sont global mais pas
      // quand l'user remplit un formulaire.
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        target?.isContentEditable
      ) {
        return;
      }

      const now = performance.now();
      if (now - lastKeyAt > RESET_AFTER_MS) buffer = "";
      lastKeyAt = now;

      // Normalize — arrow keys to "arrowup" etc, letters lowercase.
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key.toLowerCase();
      buffer = (buffer + key).slice(-BUFFER_MAX);

      for (const seq of SEQUENCES) {
        if (buffer.endsWith(seq.match)) {
          getSwarm().triggerBurst(seq.burstMs);
          if (seq.withWhoosh) getSoundEngine().whoosh(0.9);
          buffer = "";
          break;
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return null;
}
