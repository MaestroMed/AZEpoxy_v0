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

interface DevisAttachment {
  filename: string;
  content: string; // base64
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Trop de demandes. Réessayez dans une heure." }, { status: 429 });
  }

  try {
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const service = formData.get("service") as string;
    const piece = formData.get("piece") as string;
    const dimensions = formData.get("dimensions") as string;
    const quantite = formData.get("quantite") as string;
    const ral = formData.get("ral") as string;
    const message = formData.get("message") as string;
    const website = formData.get("website") as string;

    // Honeypot
    if (website) {
      return NextResponse.json({ success: true });
    }

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Champs obligatoires manquants." }, { status: 400 });
    }

    // Process uploaded photos
    const attachments: DevisAttachment[] = [];
    const photoEntries = formData.getAll("photos");
    for (const entry of photoEntries) {
      if (entry instanceof File && entry.size > 0) {
        if (entry.size > 10 * 1024 * 1024) continue; // Skip files > 10MB
        const buffer = await entry.arrayBuffer();
        attachments.push({
          filename: entry.name,
          content: Buffer.from(buffer).toString("base64"),
        });
      }
    }

    const photoInfo = attachments.length > 0
      ? `<p style="color:#E85D2C;font-weight:600">📎 ${attachments.length} photo(s) jointe(s)</p>`
      : `<p style="color:#999">Aucune photo jointe</p>`;

    // Build detail rows
    const rows = [
      { label: "Nom", value: name },
      { label: "Email", value: email },
      { label: "Téléphone", value: phone },
      { label: "Service", value: service },
      { label: "Pièce", value: piece },
      { label: "Dimensions", value: dimensions },
      { label: "Quantité", value: quantite },
      { label: "Couleur RAL", value: ral },
    ]
      .filter((r) => r.value)
      .map(
        (r) =>
          `<tr><td style="padding:8px 0;color:#666;width:140px;vertical-align:top">${r.label}</td><td style="padding:8px 0;font-weight:600">${escapeHtml(r.value)}</td></tr>`
      )
      .join("");

    // Send to AZ Époxy
    await getResend().emails.send({
      from: "AZ Époxy <onboarding@resend.dev>",
      to: ["contact@azepoxy.fr"],
      replyTo: email,
      subject: `Demande de devis — ${name}${service ? ` — ${service}` : ""}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#1A1A2E;padding:24px;border-radius:12px 12px 0 0">
            <h1 style="color:#E85D2C;margin:0;font-size:20px">🔥 Nouvelle demande de devis</h1>
          </div>
          <div style="background:#f9f9f6;padding:24px;border:1px solid #e5e5e0">
            <table style="width:100%;border-collapse:collapse">${rows}</table>
            <hr style="border:none;border-top:1px solid #e5e5e0;margin:16px 0">
            <p style="color:#666;font-size:13px;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Message</p>
            <p style="color:#333;white-space:pre-wrap;line-height:1.6">${escapeHtml(message)}</p>
            <hr style="border:none;border-top:1px solid #e5e5e0;margin:16px 0">
            ${photoInfo}
          </div>
          <div style="background:#1A1A2E;padding:16px 24px;border-radius:0 0 12px 12px;text-align:center">
            <p style="color:#666;font-size:12px;margin:0">Envoyé depuis le formulaire de devis azepoxy.fr</p>
          </div>
        </div>
      `,
      attachments: attachments.map((a) => ({
        filename: a.filename,
        content: a.content,
      })),
    });

    // Confirmation to client
    await getResend().emails.send({
      from: "AZ Époxy <onboarding@resend.dev>",
      to: [email],
      subject: "Devis en cours — AZ Époxy",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#1A1A2E;padding:24px;border-radius:12px 12px 0 0">
            <h1 style="color:#E85D2C;margin:0;font-size:20px">AZ Époxy</h1>
          </div>
          <div style="background:#f9f9f6;padding:24px;border:1px solid #e5e5e0">
            <p style="color:#333;font-size:16px">Bonjour ${escapeHtml(name)},</p>
            <p style="color:#333;line-height:1.6">Nous avons bien reçu votre demande de devis${service ? ` pour <strong>${escapeHtml(service)}</strong>` : ""}. Notre équipe l'étudie et vous recontactera sous 24h avec un chiffrage personnalisé.</p>
            <p style="color:#333;line-height:1.6">Si votre demande est urgente, appelez-nous au <strong>09 71 35 74 96</strong> (lun-ven 8h-18h).</p>
            <p style="color:#666;font-size:14px;margin-top:24px">L'équipe AZ Époxy<br>23 Chemin du Bac des Aubins, 95820 Bruyères-sur-Oise</p>
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
