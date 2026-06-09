import "server-only";
import crypto from "node:crypto";
import { getDb, leads, leadEvents, type LeadSource } from "@/lib/db";

/**
 * Lead pipeline fan-out. Every form submission goes to three sinks:
 *   1. Resend email (existing behaviour, owned by the calling route)
 *   2. Postgres `leads` row (durable storage — the backoffice reads this)
 *   3. Outbound HMAC-signed webhook (CRM integrations, Zapier, Make, etc.)
 *
 * Sinks 2 and 3 are gated on their own env vars / config — a missing
 * integration never blocks the email or fails the POST. All sinks run
 * through Promise.allSettled so one failure can't take down another.
 *
 * Writing to Postgres also inserts a `created` event in lead_events so
 * the admin timeline starts populated from the very first submission.
 */

export interface LeadPayload {
  source: LeadSource;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
  projectType?: string;
  ralCode?: string;
  /** Raw IP (will be hashed before storage). */
  ip?: string;
  /** Extra payload-specific data forwarded to the webhook + stored as JSONB. */
  extra?: Record<string, unknown>;
}

export interface LeadFanoutResult {
  /** Postgres write status (renamed for clarity — was `sanity`). */
  db: "ok" | "skipped" | "error";
  webhook: "ok" | "skipped" | "error";
  /** The created lead id, when the DB write succeeded. */
  leadId?: string;
}

function hashIp(ip: string | undefined): string | undefined {
  if (!ip) return undefined;
  // HMAC plutôt que SHA-256 nu : l'espace IPv4 est trivial à énumérer, un
  // hash sans clé se renverse donc par force brute. La clé reste côté serveur.
  const key = process.env.ADMIN_JWT_SECRET ?? "az-ip-salt-dev";
  return crypto
    .createHmac("sha256", key)
    .update(ip)
    .digest("hex")
    .slice(0, 16);
}

function nullable(value: string | undefined): string | null {
  return value && value.trim().length > 0 ? value : null;
}

async function writeLeadToDb(
  lead: LeadPayload,
): Promise<{ status: "ok" | "skipped" | "error"; leadId?: string }> {
  if (!process.env.DATABASE_URL) return { status: "skipped" };

  try {
    const db = getDb();
    const [row] = await db
      .insert(leads)
      .values({
        source: lead.source,
        status: "new",
        name: lead.name,
        email: nullable(lead.email),
        phone: nullable(lead.phone),
        company: nullable(lead.company),
        message: nullable(lead.message),
        projectType: nullable(lead.projectType),
        ralCode: nullable(lead.ralCode),
        extra: lead.extra ?? null,
        ipHash: hashIp(lead.ip) ?? null,
      })
      .returning({ id: leads.id });

    if (!row) return { status: "error" };

    // Audit: every lead gets an opening "created" event so the
    // admin timeline always has at least one entry.
    await db.insert(leadEvents).values({
      leadId: row.id,
      type: "created",
      actor: "system",
      payload: { source: lead.source },
    });

    return { status: "ok", leadId: row.id };
  } catch (err) {
    console.error("[leads] Postgres write failed", err);
    return { status: "error" };
  }
}

async function dispatchWebhook(
  lead: LeadPayload,
): Promise<"ok" | "skipped" | "error"> {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return "skipped";

  const secret = process.env.LEAD_WEBHOOK_SECRET;

  // Champs de confort "speed-to-lead" : un résumé prêt à pousser en SMS/
  // WhatsApp et un lien d'appel cliquable, pour qu'un automatisme (Make,
  // Zapier…) alerte le gérant en < 5 min sans retraiter le payload.
  const callUrl = lead.phone
    ? `tel:${lead.phone.replace(/[^\d+]/g, "")}`
    : undefined;
  const summary = [
    "🔔 Nouveau lead AZ Époxy",
    lead.name,
    lead.projectType ? `· ${lead.projectType}` : "",
    lead.phone ? `· 📞 ${lead.phone}` : "",
    lead.email ? `· ${lead.email}` : "",
    "— à rappeler vite",
  ]
    .filter(Boolean)
    .join(" ");

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
    // Confort pour automatisations d'alerte
    summary,
    callUrl,
    adminUrl: "https://www.azepoxy.fr/admin/leads",
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
 * Notification email à l'admin sur nouveau lead — activée via le toggle
 * `notifyOnLead` du profil entreprise (site_settings). No-op silencieux
 * si désactivé, si Resend n'est pas configuré, ou si pas d'email cible.
 */
async function notifyAdminOfLead(
  lead: LeadPayload,
): Promise<"ok" | "skipped" | "error"> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !process.env.DATABASE_URL) return "skipped";
  try {
    // Lecture lazy du module DB (server-only) pour ne pas l'embarquer.
    const { getSettings } = await import("@/lib/admin/content");
    const settings = await getSettings();
    if (!settings.notifyOnLead) return "skipped";
    const to = settings.notifyEmail || "contact@azepoxy.fr";

    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const rows = [
      ["Source", lead.source],
      ["Nom", lead.name],
      ["Email", lead.email],
      ["Téléphone", lead.phone],
      ["Entreprise", lead.company],
      ["Type de projet", lead.projectType],
      ["Code RAL", lead.ralCode],
    ]
      .filter(([, v]) => v)
      .map(([k, v]) => {
        const sv = escapeHtml(String(v));
        // Téléphone et email cliquables → rappel en 1 tap (speed-to-lead).
        let cell = sv;
        if (k === "Téléphone")
          cell = `<a href="tel:${String(v).replace(/[^\d+]/g, "")}" style="color:#B5420F;font-weight:700;text-decoration:none">📞 ${sv}</a>`;
        else if (k === "Email")
          cell = `<a href="mailto:${sv}" style="color:#B5420F;text-decoration:none">${sv}</a>`;
        return `<tr><td style="padding:4px 12px 4px 0;color:#666">${k}</td><td style="padding:4px 0;font-weight:600">${cell}</td></tr>`;
      })
      .join("");

    // `onboarding@resend.dev` (sandbox) marche avec juste une clé API mais
    // n'envoie qu'au propriétaire du compte Resend. En prod : vérifier le
    // domaine azepoxy.fr puis définir RESEND_FROM (ex. "AZ Époxy
    // <contact@azepoxy.fr>") — aucun changement de code requis.
    const from = process.env.RESEND_FROM || "AZ Époxy <onboarding@resend.dev>";
    await resend.emails.send({
      from,
      to: [to],
      subject: `🔔 Nouveau lead — ${lead.name}${lead.projectType ? ` · ${lead.projectType}` : ""}`,
      html: `<div style="font-family:Arial,sans-serif;max-width:560px">
        <div style="background:#1A1A2E;padding:20px;border-radius:10px 10px 0 0">
          <h2 style="color:#E85D2C;margin:0;font-size:17px">🔔 Nouveau lead reçu</h2>
        </div>
        <div style="background:#f9f9f6;padding:20px;border:1px solid #e5e5e0">
          <table style="border-collapse:collapse">${rows}</table>
          ${lead.message ? `<hr style="border:none;border-top:1px solid #e5e5e0;margin:14px 0"><p style="color:#333;white-space:pre-wrap;line-height:1.5">${escapeHtml(lead.message)}</p>` : ""}
          <p style="margin-top:16px"><a href="https://www.azepoxy.fr/admin/leads" style="color:#E85D2C;font-weight:600">Ouvrir dans l'admin →</a></p>
        </div>
      </div>`,
    });
    return "ok";
  } catch (err) {
    console.error("[leads] admin notification failed", err);
    return "error";
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Fire-and-wait fan-out. Awaits all sinks in parallel but never rejects —
 * the API route logs the result map and returns success to the user as long
 * as the email step (the caller) succeeded.
 */
export async function fanoutLead(
  lead: LeadPayload,
): Promise<LeadFanoutResult> {
  const [dbResult, webhookResult] = await Promise.allSettled([
    writeLeadToDb(lead),
    dispatchWebhook(lead),
    notifyAdminOfLead(lead),
  ]);

  const db =
    dbResult.status === "fulfilled" ? dbResult.value : { status: "error" as const };

  return {
    db: db.status,
    leadId: db.leadId,
    webhook:
      webhookResult.status === "fulfilled" ? webhookResult.value : "error",
  };
}
