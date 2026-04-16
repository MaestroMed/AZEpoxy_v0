import "server-only";
import crypto from "node:crypto";
import { sanityWriteClient } from "@/sanity/client";

/**
 * Lead pipeline fan-out. Every form submission goes to three sinks:
 *   1. Resend email (existing behaviour)
 *   2. Sanity `lead` document (durable storage for the owner)
 *   3. Outbound HMAC-signed webhook (CRM integrations, Zapier, Make, etc.)
 *
 * Sinks 2 and 3 are gated on their own env vars — a missing integration
 * never blocks the email or fails the POST. All sinks run through
 * Promise.allSettled so one failure can't take down another.
 */

export interface LeadPayload {
  source: "contact" | "devis" | "guide" | "abandoned" | "other";
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
  projectType?: string;
  ralCode?: string;
  /** Raw IP (will be hashed before storage). */
  ip?: string;
  /** Extra payload-specific data forwarded to the webhook. */
  extra?: Record<string, unknown>;
}

export interface LeadFanoutResult {
  sanity: "ok" | "skipped" | "error";
  webhook: "ok" | "skipped" | "error";
}

function hashIp(ip: string | undefined): string | undefined {
  if (!ip) return undefined;
  return crypto.createHash("sha256").update(ip).digest("hex").slice(0, 16);
}

async function writeLeadToSanity(lead: LeadPayload): Promise<"ok" | "skipped" | "error"> {
  if (!sanityWriteClient) return "skipped";
  try {
    await sanityWriteClient.create({
      _type: "lead",
      source: lead.source,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      message: lead.message,
      projectType: lead.projectType,
      ralCode: lead.ralCode,
      ipHash: hashIp(lead.ip),
      status: "new",
      submittedAt: new Date().toISOString(),
    });
    return "ok";
  } catch (err) {

    console.error("[leads] Sanity write failed", err);
    return "error";
  }
}

async function dispatchWebhook(lead: LeadPayload): Promise<"ok" | "skipped" | "error"> {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return "skipped";

  const secret = process.env.LEAD_WEBHOOK_SECRET;
  const body = JSON.stringify({
    source: lead.source,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    company: lead.company,
    message: lead.message,
    projectType: lead.projectType,
    ralCode: lead.ralCode,
    extra: lead.extra,
    submittedAt: new Date().toISOString(),
  });

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "User-Agent": "AZEpoxy/lead-webhook",
  };
  if (secret) {
    const sig = crypto.createHmac("sha256", secret).update(body).digest("hex");
    headers["X-AZEpoxy-Signature"] = `sha256=${sig}`;
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body,
      // Short timeout — webhook downtime must never block the form response.
      signal: AbortSignal.timeout(5_000),
    });
    if (!res.ok) {

      console.error(`[leads] webhook responded ${res.status}`);
      return "error";
    }
    return "ok";
  } catch (err) {

    console.error("[leads] webhook dispatch failed", err);
    return "error";
  }
}

/**
 * Fire-and-wait fan-out. Awaits all sinks in parallel but never rejects —
 * the API route logs the result map and returns success to the user as long
 * as the email step (the caller) succeeded.
 */
export async function fanoutLead(lead: LeadPayload): Promise<LeadFanoutResult> {
  const [sanityResult, webhookResult] = await Promise.allSettled([
    writeLeadToSanity(lead),
    dispatchWebhook(lead),
  ]);

  return {
    sanity: sanityResult.status === "fulfilled" ? sanityResult.value : "error",
    webhook: webhookResult.status === "fulfilled" ? webhookResult.value : "error",
  };
}
