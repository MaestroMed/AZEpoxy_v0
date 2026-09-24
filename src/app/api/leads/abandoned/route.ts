import { NextResponse, type NextRequest } from "next/server";
import { Client } from "@upstash/qstash";
import { Receiver } from "@upstash/qstash";
import { fanoutLead, hasDevisLeadSince } from "@/lib/leads";
import { extractIp, ratelimit } from "@/lib/ratelimit";
import {
  escapeHtml,
  greetingName,
  isValidEmail,
  LEAD_INBOX,
  sendEmail,
  type EmailResult,
} from "@/lib/email";
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
/** Plafond global : même avec des IP et des adresses variées, pas plus. */
const MAX_RELANCES_PAR_JOUR = 30;

/**
 * Types de projet du wizard. La relance part vers une adresse saisie par le
 * visiteur : aucun texte libre de sa part ne doit y figurer, sinon un robot
 * s'en sert pour envoyer son propre message depuis notre domaine.
 */
const PROJECT_TYPES = new Set(["jantes", "moto", "portail", "mobilier", "industriel", "autre"]);
const RAL_RE = /^RAL \d{4}(, RAL \d{4})*$/;

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

/** Ne garde du brouillon que ce qui est utile, borné et sans texte libre. */
function sanitize(payload: AbandonedPayload): AbandonedPayload | null {
  const d = payload?.data ?? {};
  const email = typeof d.email === "string" ? d.email.trim() : "";
  if (!isValidEmail(email)) return null;
  const text = (v: unknown, max: number) =>
    typeof v === "string" ? v.trim().slice(0, max) : undefined;
  return {
    step: Number.isFinite(payload.step) ? Number(payload.step) : 0,
    updatedAt: Number.isFinite(payload.updatedAt) ? Number(payload.updatedAt) : Date.now(),
    data: {
      email,
      name: text(d.name, 100),
      phone: text(d.phone, 40),
      projectType:
        typeof d.projectType === "string" && PROJECT_TYPES.has(d.projectType)
          ? d.projectType
          : undefined,
      ralCode:
        typeof d.ralCode === "string" && RAL_RE.test(d.ralCode) ? d.ralCode : undefined,
    },
  };
}

/** Clé de limitation : `jean+1@x.fr` et `jean+2@x.fr` sont la même boîte. */
function throttleKey(email: string): string {
  const [local, domain] = email.toLowerCase().split("@");
  return `${local.split("+")[0]}@${domain}`;
}

async function sendRecoveryEmail(
  payload: AbandonedPayload,
  email: string
): Promise<EmailResult> {
  const { data } = payload;
  const prenom = greetingName(data.name ?? "");

  const query = new URLSearchParams();
  if (data.projectType) query.set("type", data.projectType);
  if (data.ralCode) query.set("ral", data.ralCode);
  const devisUrl = `${SITE.url}/devis${query.size ? `?${query}` : ""}`;

  return sendEmail(
    {
      to: email,
      replyTo: LEAD_INBOX,
      subject: "Votre devis AZ Époxy — on reprend où vous en étiez ?",
      html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#1A1A2E;padding:24px;border-radius:12px 12px 0 0">
          <h1 style="color:#E85D2C;margin:0;font-size:20px">AZ Époxy</h1>
        </div>
        <div style="background:#f9f9f6;padding:24px;border:1px solid #e5e5e0">
          <p style="color:#333;font-size:16px">Bonjour${prenom ? ` ${escapeHtml(prenom)}` : ""},</p>
          <p style="color:#333;line-height:1.6">
            Nous avons vu que vous aviez commencé une demande de devis sur azepoxy.fr
            ${data.projectType ? `pour <strong>${escapeHtml(data.projectType)}</strong>` : ""}.
            Le lien ci-dessous rouvre le formulaire avec votre type de projet et
            votre couleur déjà choisis&nbsp;: il ne reste que quelques champs.
          </p>
          <p style="margin:24px 0;text-align:center">
            <a href="${devisUrl}" style="background:#E85D2C;color:white;text-decoration:none;padding:12px 24px;border-radius:999px;font-weight:600;display:inline-block">
              Reprendre mon devis
            </a>
          </p>
          <p style="color:#333;line-height:1.6">
            Une question&nbsp;? Appelez-nous au <strong>${SITE.phone}</strong> (lun-ven 8h-18h).
          </p>
          <p style="color:#666;font-size:14px;margin-top:24px">L'équipe AZ Époxy</p>
          <p style="color:#999;font-size:12px;margin-top:16px">
            Ce rappel est unique. Pour ne plus rien recevoir de notre part,
            répondez simplement «&nbsp;STOP&nbsp;» à cet email.
          </p>
        </div>
      </div>
    `,
    },
    "abandon:relance"
  );
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
  if (signature) {
    if (!qstashReceiver) {
      // Sans clés de signature, la livraison serait prise pour un nouveau
      // beacon et reprogrammée au lieu d'envoyer la relance.
      console.error("[abandoned] livraison QStash reçue sans QSTASH_*_SIGNING_KEY");
      return NextResponse.json({ error: "Signing keys missing" }, { status: 503 });
    }
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

    let payload: AbandonedPayload | null;
    try {
      payload = sanitize(JSON.parse(rawBody) as AbandonedPayload);
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    if (!payload) return NextResponse.json({ ok: true });
    const email = payload.data.email as string;

    // Le prospect a pu envoyer sa demande depuis le départ de l'onglet :
    // lui proposer de « reprendre son devis » serait alors à contresens.
    if (await hasDevisLeadSince(email, new Date(payload.updatedAt || 0))) {
      return NextResponse.json({ ok: true, skipped: "devis déjà envoyé" });
    }

    const relance = await sendRecoveryEmail(payload, email);
    await fanoutLead({
      source: "abandoned",
      name: payload.data.name || "Devis abandonné",
      email,
      phone: payload.data.phone,
      projectType: payload.data.projectType,
      ralCode: payload.data.ralCode,
      // Pas d'IP : celle de cette requête est celle de QStash, pas du prospect.
      extra: {
        step: payload.step,
        updatedAt: payload.updatedAt,
        relance: relance.ok ? "envoyée" : `échec — ${relance.error}`,
      },
    });
    // 200 même si l'email a échoué : un nouvel essai QStash recréerait le
    // lead en double, et l'échec est déjà tracé sur la fiche.
    return NextResponse.json({ ok: true });
  }

  /* ---------- Browser beacon scheduling a recovery ---------- */
  // Un beacon légitime vient de nos pages. Une page tierce qui ferait
  // POSTer ses visiteurs ici porte son propre Origin : refusé en silence.
  const origin = request.headers.get("origin");
  if (origin) {
    let sameHost = false;
    try {
      sameHost = new URL(origin).host === request.headers.get("host");
    } catch {
      /* Origin illisible */
    }
    if (!sameHost) return NextResponse.json({ ok: true }, { status: 202 });
  }

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

  let payload: AbandonedPayload | null;
  try {
    payload = sanitize(JSON.parse(rawBody) as AbandonedPayload);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!payload) {
    return NextResponse.json({ ok: true }, { status: 202 });
  }

  // Throttle par email en plus du ratelimit IP : une relance / 24 h. Chaque
  // changement d'onglet émet un beacon ; sans ce verrou, le même prospect
  // recevrait plusieurs relances. Dépassement : 200 silencieux.
  const emailLimit = await ratelimit(
    `abandon-email:${throttleKey(payload.data.email as string)}`,
    { prefix: "abandoned-email", limit: 1, window: "24 h" }
  );
  if (!emailLimit.success) {
    return NextResponse.json({ ok: true });
  }

  const globalLimit = await ratelimit("global", {
    prefix: "abandoned-global",
    limit: MAX_RELANCES_PAR_JOUR,
    window: "24 h",
  });
  if (!globalLimit.success) {
    console.error("[abandoned] plafond global de relances atteint");
    return NextResponse.json({ ok: true }, { status: 202 });
  }

  if (!qstashClient) {
    // No scheduler configured — just log the abandon for later inspection.
    console.log("[abandoned] received without QStash; skipping delay", {
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
