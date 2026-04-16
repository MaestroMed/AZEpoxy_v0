"use client";

const STORAGE_KEY = "azepoxy:devis-draft";
const VERSION = 1;

export interface DevisDraft {
  version: number;
  updatedAt: number;
  step: number;
  data: Record<string, unknown>;
}

/**
 * Persist the current wizard state to sessionStorage. Silently no-ops when
 * the environment doesn't expose sessionStorage (SSR, private mode).
 */
export function saveDevisDraft(step: number, data: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  try {
    const payload: DevisDraft = {
      version: VERSION,
      updatedAt: Date.now(),
      step,
      data,
    };
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* quota exceeded / disabled — not worth interrupting the user */
  }
}

export function loadDevisDraft(): DevisDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DevisDraft;
    if (parsed.version !== VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearDevisDraft(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Fire an abandon beacon for wizards that got past the first step but never
 * submitted. The server uses the payload to schedule a recovery email.
 */
export function reportAbandonedDevis(draft: DevisDraft): void {
  if (typeof window === "undefined") return;
  // Only send when the user actually entered personal data (step >= 2 in
  // the current wizard means contact details exist).
  if (draft.step < 2) return;

  const email = (draft.data as { email?: string }).email;
  if (!email) return;

  const body = JSON.stringify(draft);
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/leads/abandoned", blob);
    } else {
      void fetch("/api/leads/abandoned", {
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
        keepalive: true,
      });
    }
  } catch {
    /* ignore */
  }
}
