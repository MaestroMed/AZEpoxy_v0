import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

const rateLimit = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + 3600_000 });
    return false;
  }
  entry.count++;
  return entry.count > 3;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Trop de demandes. Réessayez dans une heure." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const { name, email, phone, message, website } = body;

    // Honeypot — bots fill this hidden field
    if (website) {
      return NextResponse.json({ success: true });
    }

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Champs obligatoires manquants." }, { status: 400 });
    }

    // Send notification to AZ Époxy
    await getResend().emails.send({
      from: "AZ Époxy <onboarding@resend.dev>",
      to: ["contact@azepoxy.fr"],
      replyTo: email,
      subject: `Nouveau message de ${name} — azepoxy.fr`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#1A1A2E;padding:24px;border-radius:12px 12px 0 0">
            <h1 style="color:#E85D2C;margin:0;font-size:20px">AZ Époxy — Nouveau message</h1>
          </div>
          <div style="background:#f9f9f6;padding:24px;border:1px solid #e5e5e0">
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:8px 0;color:#666;width:120px">Nom</td><td style="padding:8px 0;font-weight:600">${escapeHtml(name)}</td></tr>
              <tr><td style="padding:8px 0;color:#666">Email</td><td style="padding:8px 0"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
              ${phone ? `<tr><td style="padding:8px 0;color:#666">Téléphone</td><td style="padding:8px 0"><a href="tel:${escapeHtml(phone)}">${escapeHtml(phone)}</a></td></tr>` : ""}
            </table>
            <hr style="border:none;border-top:1px solid #e5e5e0;margin:16px 0">
            <p style="color:#333;white-space:pre-wrap;line-height:1.6">${escapeHtml(message)}</p>
          </div>
          <div style="background:#1A1A2E;padding:16px 24px;border-radius:0 0 12px 12px;text-align:center">
            <p style="color:#666;font-size:12px;margin:0">Envoyé depuis le formulaire de contact azepoxy.fr</p>
          </div>
        </div>
      `,
    });

    // Send confirmation to client
    await getResend().emails.send({
      from: "AZ Époxy <onboarding@resend.dev>",
      to: [email],
      subject: "Bien reçu — AZ Époxy",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#1A1A2E;padding:24px;border-radius:12px 12px 0 0">
            <h1 style="color:#E85D2C;margin:0;font-size:20px">AZ Époxy</h1>
          </div>
          <div style="background:#f9f9f6;padding:24px;border:1px solid #e5e5e0">
            <p style="color:#333;font-size:16px">Bonjour ${escapeHtml(name)},</p>
            <p style="color:#333;line-height:1.6">Nous avons bien reçu votre message et nous vous recontacterons sous 24h.</p>
            <p style="color:#333;line-height:1.6">Si votre demande est urgente, n'hésitez pas à nous appeler au <strong>09 71 35 74 96</strong> (lun-ven 8h-18h).</p>
            <p style="color:#666;font-size:14px;margin-top:24px">L'équipe AZ Époxy</p>
          </div>
          <div style="background:#1A1A2E;padding:16px 24px;border-radius:0 0 12px 12px;text-align:center">
            <p style="color:#666;font-size:12px;margin:0">23 Chemin du Bac des Aubins, 95820 Bruyères-sur-Oise</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur lors de l'envoi. Appelez-nous au 09 71 35 74 96." }, { status: 500 });
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
