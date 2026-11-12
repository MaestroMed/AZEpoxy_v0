import { NextResponse, type NextRequest } from "next/server";
import { extractIp, ratelimit } from "@/lib/ratelimit";
import { verifyTurnstile } from "@/lib/turnstile";
import { fanoutLead, recordLeadEmailFailure } from "@/lib/leads";
import {
  LEAD_INBOX,
  escapeHtml,
  greetingName,
  isValidEmail,
  oneLine,
  sendEmail,
  telHref,
} from "@/lib/email";
import { SITE } from "@/lib/utils";

const MAX_FIELD_LENGTH = 5_000;

const ERREUR_ENVOI = `Erreur lors de l'envoi. Appelez-nous au ${SITE.phone}.`;

function truncate(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, MAX_FIELD_LENGTH);
}

export async function POST(request: NextRequest) {
  const ip = extractIp(request);
  const limit = await ratelimit(ip, {
    prefix: "contact",
    limit: 5,
    window: "1 h",
  });
  if (!limit.success) {
    return NextResponse.json(
      { error: "Trop de demandes. Réessayez dans une heure." },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const name = truncate(body.name);
  const email = truncate(body.email);
  const phone = truncate(body.phone);
  const message = truncate(body.message);
  const website = truncate(body.website);
  const turnstileToken =
    typeof body.turnstileToken === "string" ? body.turnstileToken : null;

  // Honeypot — bots fill this hidden field
  if (website) {
    return NextResponse.json({ success: true });
  }

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Champs obligatoires manquants." },
      { status: 400 }
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Adresse email invalide. Vérifiez-la ou appelez-nous." },
      { status: 400 }
    );
  }

  const turnstile = await verifyTurnstile(turnstileToken, ip);
  if (!turnstile.success) {
    return NextResponse.json(
      {
        error: `Vérification anti-spam échouée. Rechargez la page ou appelez-nous au ${SITE.phone}.`,
      },
      { status: 403 }
    );
  }

  // 1. La demande en base d'abord : c'est la seule trace durable. Si Resend
  //    refuse l'envoi, elle reste consultable dans /admin/leads.
  const fanout = await fanoutLead({
    source: "contact",
    name,
    email,
    phone,
    message,
    ip,
    notifiedInbox: LEAD_INBOX,
  });

  // 2. Puis les emails, en parallèle. sendEmail ne lève jamais.
  const [notification] = await Promise.all([
    sendEmail(
      {
        to: LEAD_INBOX,
        replyTo: email,
        subject: `Nouveau message de ${oneLine(name)} — azepoxy.fr`,
        html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#1A1A2E;padding:24px;border-radius:12px 12px 0 0">
            <h1 style="color:#E85D2C;margin:0;font-size:20px">AZ Époxy — Nouveau message</h1>
          </div>
          <div style="background:#f9f9f6;padding:24px;border:1px solid #e5e5e0">
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:8px 0;color:#666;width:120px">Nom</td><td style="padding:8px 0;font-weight:600">${escapeHtml(name)}</td></tr>
              <tr><td style="padding:8px 0;color:#666">Email</td><td style="padding:8px 0"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
              ${phone ? `<tr><td style="padding:8px 0;color:#666">Téléphone</td><td style="padding:8px 0"><a href="${telHref(phone)}">${escapeHtml(phone)}</a></td></tr>` : ""}
            </table>
            <hr style="border:none;border-top:1px solid #e5e5e0;margin:16px 0">
            <p style="color:#333;white-space:pre-wrap;line-height:1.6">${escapeHtml(message)}</p>
          </div>
          <div style="background:#1A1A2E;padding:16px 24px;border-radius:0 0 12px 12px;text-align:center">
            <p style="color:#666;font-size:12px;margin:0">Envoyé depuis le formulaire de contact azepoxy.fr</p>
          </div>
        </div>
      `,
      },
      "contact:notification"
    ),
    sendEmail(
      {
        to: email,
        replyTo: LEAD_INBOX,
        subject: "Bien reçu — AZ Époxy",
        html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#1A1A2E;padding:24px;border-radius:12px 12px 0 0">
            <h1 style="color:#E85D2C;margin:0;font-size:20px">AZ Époxy</h1>
          </div>
          <div style="background:#f9f9f6;padding:24px;border:1px solid #e5e5e0">
            <p style="color:#333;font-size:16px">Bonjour${greetingName(name) ? ` ${escapeHtml(greetingName(name))}` : ""},</p>
            <p style="color:#333;line-height:1.6">Nous avons bien reçu votre message et nous vous recontacterons sous 24h.</p>
            <p style="color:#333;line-height:1.6">Si votre demande est urgente, n'hésitez pas à nous appeler au <strong>${SITE.phone}</strong> (lun-ven 8h-18h).</p>
            <p style="color:#666;font-size:14px;margin-top:24px">L'équipe AZ Époxy</p>
          </div>
          <div style="background:#1A1A2E;padding:16px 24px;border-radius:0 0 12px 12px;text-align:center">
            <p style="color:#666;font-size:12px;margin:0">23 Chemin du Bac des Aubins, 95820 Bruyères-sur-Oise</p>
          </div>
        </div>
      `,
      },
      "contact:accuse-reception"
    ),
  ]);

  if (!notification.ok) {
    if (fanout.db !== "ok") {
      // Ni email ni base : la demande serait perdue. Mieux vaut le dire au
      // visiteur que lui afficher un faux « Merci ».
      console.error("[contact] demande perdue : ni email ni base", {
        db: fanout.db,
        email: notification.error,
      });
      return NextResponse.json({ error: ERREUR_ENVOI }, { status: 500 });
    }
    await recordLeadEmailFailure(fanout.leadId, notification.error);
  }

  return NextResponse.json({ success: true });
}
