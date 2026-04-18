"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * LIVE ATELIER BANNER.
 *
 * Thin persistent strip mounted above the header, showing a simulated
 * "live" atelier state. Crossfades every ~45 seconds between entries.
 *
 * Editorial intent : the audit praised the site's craft but noted it
 * "politely avoids the risk" of a strong editorial voice. This banner
 * gives the site a permanent heartbeat — a tiny proof of an atelier
 * behind the screen, updating throughout the day.
 *
 * Time-aware : different banks of states are chosen based on the wall
 * clock. The atelier is "closed" at night and on weekends. We simulate
 * using deterministic pseudo-randomness keyed to the minute so the same
 * state is shown consistently for all viewers in the same minute — no
 * client/server hydration mismatch.
 */

type AtelierState = {
  label: string;   // short all-caps prefix
  text: string;    // main live update
  accent?: "orange" | "success" | "night"; // dot color, defaults to orange
};

// ── STATE LIBRARIES (morning / afternoon / night / weekend) ─────────

const MORNING_STATES: AtelierState[] = [
  { label: "Atelier", text: "Dégraissage alcalin · 12 pièces en cabine A · 8h42" },
  { label: "En cours", text: "Four à 198°C · RAL 7016 · sortie prévue 9h15" },
  { label: "Sablage", text: "Charpente industrielle · poste 2 · SA 2.5" },
  { label: "Atelier", text: "Contrôle Elcometer · 80 µm moyen · conforme Qualicoat" },
  { label: "En cabine", text: "Poudrage électrostatique · jantes 19\" · RAL 9005" },
];

const AFTERNOON_STATES: AtelierState[] = [
  { label: "Cuisson", text: "Four à 200°C · 23 pièces · polymérisation 15 min" },
  { label: "Sortie four", text: "Cadre Triumph Street Triple · RAL 6005 · 14h32" },
  { label: "En cabine", text: "RAL 9016 blanc de sécurité · étagères murales" },
  { label: "Contrôle", text: "Test adhérence cross-cut · Gt0 · conforme" },
  { label: "Atelier", text: "Préparation prochain batch · 16 pièces clients" },
  { label: "Sortie four", text: "Jantes Audi RS3 · RAL 7024 graphite · refroidissement" },
];

const EVENING_STATES: AtelierState[] = [
  { label: "Dernière cuisson", text: "Four redescend de 200°C · nettoyage cabines" },
  { label: "Atelier", text: "Préparation planning demain · 9 pièces en file" },
  { label: "Atelier", text: "Derniers contrôles qualité du jour" },
];

const CLOSED_STATES: AtelierState[] = [
  { label: "Atelier fermé", text: "Réouverture demain 8h00 · devis par e-mail 24h/24", accent: "night" },
  { label: "Atelier fermé", text: "Bruyères-sur-Oise · 1 800 m² · reprise lundi 8h00", accent: "night" },
];

// Always-visible seed state (SSR-safe, deterministic)
const SEED_STATE: AtelierState = {
  label: "En atelier",
  text: "Thermolaquage poudre époxy · Bruyères-sur-Oise",
};

/** Pick a state bank given the current hour + day. */
function pickStateBank(now: Date): AtelierState[] {
  const day = now.getDay(); // 0 = Sunday, 6 = Saturday
  const hour = now.getHours();

  if (day === 0 || day === 6) return CLOSED_STATES;
  if (hour < 7 || hour >= 19) return CLOSED_STATES;
  if (hour < 12) return MORNING_STATES;
  if (hour < 17) return AFTERNOON_STATES;
  return EVENING_STATES;
}

/** Deterministic index given the minute — same minute → same state. */
function pickIndex(bank: AtelierState[], now: Date): number {
  const minute = Math.floor(now.getTime() / 45_000); // changes every 45s
  return minute % bank.length;
}

export function LiveAtelierBanner() {
  // Client-only: we never render real state server-side to avoid any
  // hydration mismatch between the SSR snapshot and the time-aware
  // client evaluation. Before mount we show the seed state with
  // suppressHydrationWarning on the dynamic spans.
  const [state, setState] = useState<AtelierState>(SEED_STATE);
  const [mounted, setMounted] = useState(false);
  const [nowMs, setNowMs] = useState<number>(() => Date.now());

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const bank = pickStateBank(now);
      const idx = pickIndex(bank, now);
      setState(bank[idx]);
      setNowMs(now.getTime());
    };
    setMounted(true);
    tick();
    const id = setInterval(tick, 5_000); // re-evaluate every 5s, banner updates when pickIndex flips (every 45s)
    return () => clearInterval(id);
  }, []);

  const formattedTime = useMemo(() => {
    if (!mounted) return "";
    return new Date(nowMs).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [mounted, nowMs]);

  const accentClass =
    state.accent === "success"
      ? "bg-brand-success"
      : state.accent === "night"
      ? "bg-white/40"
      : "bg-brand-orange";

  const ringClass =
    state.accent === "success"
      ? "bg-brand-success/45"
      : state.accent === "night"
      ? "bg-white/20"
      : "bg-brand-orange/50";

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      data-mounted={mounted ? "true" : "false"}
      data-accent={state.accent ?? "orange"}
      data-label={state.label}
      className="fixed inset-x-0 top-0 z-[60] hidden border-b border-white/5 bg-brand-night-deep text-white md:block"
    >
      <div className="container-wide flex h-9 items-center gap-3 overflow-hidden text-[11px] tracking-[0.04em]">
        {/* Pulse dot */}
        <span aria-hidden className="relative flex h-2 w-2 shrink-0">
          <span
            className={`absolute inset-0 rounded-full ${ringClass} motion-safe:animate-ping`}
            style={{ animationDuration: "2.4s" }}
          />
          <span className={`relative inline-flex h-2 w-2 rounded-full ${accentClass}`} />
        </span>

        {/* Content — key forces a subtle fade-in on each state change
            via CSS (no framer-motion dep; AnimatePresence + LazyMotion
            had a mode="wait" exit-freeze interaction that kept the
            stale seed content in place). */}
        <div
          key={state.text}
          className="flex min-w-0 flex-1 items-center gap-3 whitespace-nowrap motion-safe:animate-[fade-rise_0.42s_cubic-bezier(0.22,1,0.36,1)]"
        >
          <span
            className={`shrink-0 font-mono font-bold uppercase tracking-[0.22em] ${
              state.accent === "night" ? "text-white/55" : "text-brand-orange/90"
            }`}
          >
            {state.label}
          </span>
          <span aria-hidden className="h-2 w-px shrink-0 bg-white/15" />
          <span className="truncate text-white/75">{state.text}</span>
        </div>

        {/* Live clock — right side, monospaced */}
        {mounted && formattedTime && (
          <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.22em] text-white/35">
            {formattedTime} · Bruyères-sur-Oise
          </span>
        )}
      </div>
    </div>
  );
}
