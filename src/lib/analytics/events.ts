/**
 * Typed analytics events. All site instrumentation goes through `track()` so
 * future providers (Plausible, Segment, PostHog…) can be added at one call
 * site. Today it forwards to GA4 via the existing trackEvent() helper.
 *
 * Usage: `track("cta_click", { placement: "hero", target: "/devis" })`.
 *
 * Keep event names snake_case and parameters JSON-serializable. If you add a
 * new event, extend AnalyticsEvents so TypeScript rejects typos at the call
 * site.
 */

import { trackEvent, type TrackEventParams } from "@/components/analytics/ga4";

type CtaPlacement =
  | "hero"
  | "header"
  | "footer"
  | "sticky_mobile"
  | "exit_intent"
  | "ral_recommender"
  | "cta_band"
  | "pricing"
  | "gallery"
  | "services"
  | "specialite"
  | "whatsapp_float";

export interface AnalyticsEvents {
  cta_click: {
    placement: CtaPlacement;
    target: string;
    label?: string;
  };
  form_start: {
    variant: "simple" | "full" | "wizard" | "guide";
  };
  form_step: {
    variant: "wizard";
    step: number;
    label: string;
  };
  form_submit: {
    variant: "simple" | "full" | "wizard" | "guide";
    status?: "ok" | "error";
  };
  form_error: {
    variant: "simple" | "full" | "wizard" | "guide";
    reason: string;
  };
  price_estimate_calculated: {
    type: string;
    quantity: number;
    amount: number;
  };
  booking_open: {
    source: string;
  };
  guide_download: {
    status: "requested" | "delivered" | "error";
  };
  recommender_suggestion: {
    use?: string;
    mood?: string;
    top: string;
  };
  review_scroll: {
    direction: "left" | "right";
  };
  exit_intent_triggered: {
    platform: "desktop" | "mobile";
  };
  exit_intent_dismissed: {
    via: "close" | "cta" | "phone" | "backdrop";
  };
  faq_expand: {
    question: string;
  };
  color_cart: {
    action: "add" | "remove";
    code: string;
  };
  color_filter: {
    family: string;
  };
  realisation_filter: {
    category: string;
  };
}

export type AnalyticsEventName = keyof AnalyticsEvents;

export function track<K extends AnalyticsEventName>(
  name: K,
  params: AnalyticsEvents[K]
): void {
  try {
    trackEvent(name, params as unknown as TrackEventParams);
  } catch {
    /* never throw from analytics */
  }
}
