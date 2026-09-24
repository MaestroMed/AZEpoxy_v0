"use server";

import { requireAdmin } from "@/lib/admin/session";
import { logActivity } from "@/lib/admin/activity";
import { LEAD_INBOX, emailFrom, sendEmail } from "@/lib/email";

export type TestEmailResult =
  | { ok: true; to: string }
  | { ok: false; error: string };

/**
 * Envoie un email de test à la boîte qui reçoit les formulaires, avec
 * l'expéditeur de production. Renvoie le message exact de Resend en cas de
 * refus : c'est le diagnostic le plus court d'une panne d'email.
 */
export async function sendTestEmailAction(): Promise<TestEmailResult> {
  const admin = await requireAdmin();
  const from = emailFrom();

  const result = await sendEmail(
    {
      to: LEAD_INBOX,
      subject: "Test d'envoi — formulaires azepoxy.fr",
      html: `<div style="font-family:Arial,sans-serif;max-width:560px">
        <p>Cet email de test a été demandé depuis l'admin par ${admin.email}.</p>
        <p>S'il est arrivé, les notifications des formulaires de contact et de devis arrivent aussi dans cette boîte.</p>
        <p style="color:#666;font-size:13px">Expéditeur : ${from.replace(/</g, "&lt;")}</p>
      </div>`,
    },
    "admin:test"
  );

  await logActivity({
    actor: admin.email,
    action: "email.test",
    summary: result.ok
      ? `Email de test envoyé à ${LEAD_INBOX}`
      : `Email de test refusé : ${result.error}`,
    meta: { from },
  });

  return result.ok ? { ok: true, to: LEAD_INBOX } : { ok: false, error: result.error };
}
