import { NextResponse, type NextRequest } from "next/server";
import { Client } from "@upstash/qstash";
import { Receiver } from "@upstash/qstash";
import { Resend } from "resend";
import { fanoutLead } from "@/lib/leads";
import { extractIp, ratelimit } from "@/lib/ratelimit";
import { SITE } from "@/lib/utils";

/**
 * Abandoned-devis recovery flow.
 *
 * POST without QStash signature → schedule a recovery email via QStash.
 * POST with QStash signature     → QStash delivering the scheduled job;
 *                                   send the email.
 *
 * When QStash isn't configured we simply log the abandon and return 202 so
 * the client beacon completes successfully.
 */

const DEFAULT_DELAY_SECONDS = 60 * 60; // 1 hour

interface AbandonedPayload {
  step: number;
  updatedAt: number;
  data: {
    name?: string;
    email?: string;
    phone?: string;
    projectType?: string;
    ralCode?: string;
  };
}

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

function escapeHtml(str: string | undefined | null): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function sendRecoveryEmail(payload: AbandonedPayload): Promise<void> {
  const { data } = payload;
  if (!data.email) return;

  const query = new URLSearchParams();
  if (data.projectType) query.set("type", data.projectType);
  if (data.ralCode) query.set("ral", data.ralCode);
  const devisUrl = `${SITE.url}/devis${query.size ? `?${query}` : ""}`;

  await getResend().emails.send({
    from: "AZ Époxy <onboarding@resend.dev>",
    to: [data.email],
    subject: "Votre devis AZ Époxy — on reprend où vous en étiez ?",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#1A1A2E;padding:24px;border-radius:12px 12px 0 0">
          <h1 style="color:#E85D2C;margin:0;font-size:20px">AZ Époxy</h1>
        </div>
        <div style="background:#f9f9f6;padding:24px;border:1px solid #e5e5e0">
          <p style="color:#333;font-size:16px">Bonjour ${escapeHtml(data.name) || ""},</p>
          <p style="color:#333;line-height:1.6">
            Nous avons vu que vous aviez commencé une demande de devis sur azepoxy.fr
            ${data.projectType ? `pour <strong>${escapeHtml(data.projectType)}</strong>` : ""}.
            Votre progression a été sauvegardée&nbsp;: vous pouvez la reprendre en un clic.
          </p>
          <p style="margin:24px 0;text-align:center">
            <a href="${devisUrl}" style="background:#E85D2C;color:white;text-decoration:none;padding:12px 24px;border-radius:999px;font-weight:600;display:inline-block">
              Reprendre mon devis
            </a>
          </p>
          <p style="color:#333;line-height:1.6">
            Une question&nbsp;? Appelez-nous au <strong>${SITE.phone}</strong> (lun-ven 8h-18h), nous répondons sous 1h.
          </p>
          <p style="color:#666;font-size:14px;margin-top:24px">L'équipe AZ Époxy</p>
        </div>
      </div>
    `,
  });
}

const qstashToken = process.env.QSTASH_TOKEN;
const qstashClient = qstashToken ? new Client({ token: qstashToken }) : null;

const qstashReceiver =
  process.env.QSTASH_CURRENT_SIGNING_KEY && process.env.QSTASH_NEXT_SIGNING_KEY
    ? new Receiver({
        currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY,
        nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY,
      })
    : null;

export async function POST(request: NextRequest) {
  const signature = request.headers.get("Upstash-Signature");
  const rawBody = await request.text();

  /* ---------- QStash delivering a scheduled job ---------- */
  if (signature && qstashReceiver) {
    const origin = new URL(request.url);
    const scheduledUrl = `${origin.protocol}//${origin.host}${origin.pathname}`;
    try {
      const valid = await qstashReceiver.verify({
        signature,
        body: rawBody,
        url: scheduledUrl,
      });
      if (!valid) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    } catch {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    try {
      const payload = JSON.parse(rawBody) as AbandonedPayload;
      await sendRecoveryEmail(payload);
      await fanoutLead({
        source: "abandoned",
        name: payload.data.name || "Devis abandonné",
        email: payload.data.email,
        phone: payload.data.phone,
        projectType: payload.data.projectType,
        ralCode: payload.data.ralCode,
        ip: extractIp(request),
        extra: { step: payload.step, updatedAt: payload.updatedAt },
      });
      return NextResponse.json({ ok: true });
    } catch (err) {

      console.error("[abandoned] recovery email failed", err);
      return NextResponse.json({ error: "Recovery failed" }, { status: 500 });
    }
  }

  /* ---------- Browser beacon scheduling a recovery ---------- */
  const ip = extractIp(request);
  const limit = await ratelimit(ip, {
    prefix: "abandoned",
    limit: 10,
    window: "1 h",
  });
  if (!limit.success) {
    // Silent success — we don't want bots to probe this endpoint.
    return NextResponse.json({ ok: true }, { status: 202 });
  }

  let payload: AbandonedPayload;
  try {
    payload = JSON.parse(rawBody) as AbandonedPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!payload?.data?.email) {
    return NextResponse.json({ ok: true }, { status: 202 });
  }

  if (!qstashClient) {
    // No scheduler configured — just log the abandon for later inspection.

    console.log("[abandoned] received without QStash; skipping delay", {
      email: payload.data.email,
      step: payload.step,
    });
    return NextResponse.json({ ok: true, scheduled: false }, { status: 202 });
  }

  try {
    const origin = new URL(request.url);
    const destination = `${origin.protocol}//${origin.host}${origin.pathname}`;
    await qstashClient.publishJSON({
      url: destination,
      body: payload,
      delay: DEFAULT_DELAY_SECONDS,
      retries: 2,
    });
    return NextResponse.json({ ok: true, scheduled: true }, { status: 202 });
  } catch (err) {

    console.error("[abandoned] QStash publish failed", err);
    return NextResponse.json({ ok: true, scheduled: false }, { status: 202 });
  }
}
