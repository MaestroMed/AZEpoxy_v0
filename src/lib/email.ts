import "server-only";
import { Resend, type Attachment } from "resend";
import { SITE } from "@/lib/utils";

/**
 * Envoi des emails transactionnels (Resend) — point de passage unique.
 *
 * Le SDK Resend ne lève JAMAIS d'exception quand l'API refuse un envoi
 * (domaine non vérifié, clé révoquée, bac à sable, quota…) : il renvoie
 * `{ data: null, error }`. Les routes faisaient `await resend.emails.send()`
 * sans lire `error` : un refus passait inaperçu et le visiteur voyait
 * « Merci ! » alors que rien n'était parti. `sendEmail` lit la réponse,
 * journalise chaque refus et renvoie un résultat que l'appelant doit traiter.
 */

/** Boîte qui reçoit les demandes des formulaires. */
export const LEAD_INBOX = SITE.email;

/**
 * Expéditeur utilisé tant que RESEND_FROM n'est pas défini : le bac à sable
 * Resend, qui n'envoie QU'À l'adresse du propriétaire du compte Resend.
 */
const SANDBOX_FROM = "AZ Époxy <onboarding@resend.dev>";

/** Au-delà, on rend la main : la demande est déjà en base. */
const SEND_TIMEOUT_MS = 10_000;

export function emailFrom(): string {
  // `||` et non `??` : une variable définie mais vide doit aussi retomber
  // sur la valeur par défaut, sinon Resend refuse un expéditeur vide.
  return process.env.RESEND_FROM?.trim() || SANDBOX_FROM;
}

export function isSandboxSender(): boolean {
  return emailFrom().includes("@resend.dev");
}

export type EmailResult = { ok: true; id: string } | { ok: false; error: string };

export interface EmailMessage {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
  attachments?: Attachment[];
}

/**
 * Envoie un email. Ne lève jamais : renvoie `{ ok: false, error }` avec le
 * message exact de Resend. `context` identifie l'appelant dans les logs.
 */
export async function sendEmail(
  message: EmailMessage,
  context: string,
): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return fail(context, "RESEND_API_KEY n'est pas définie");

  try {
    const res = await Promise.race([
      new Resend(apiKey).emails.send({ from: emailFrom(), ...message }),
      new Promise<"timeout">((resolve) =>
        setTimeout(() => resolve("timeout"), SEND_TIMEOUT_MS),
      ),
    ]);
    if (res === "timeout") {
      return fail(context, `Resend n'a pas répondu en ${SEND_TIMEOUT_MS / 1000} s`);
    }
    if (res.error) {
      const { name, statusCode, message: detail } = res.error;
      return fail(context, `${name}${statusCode ? ` (${statusCode})` : ""} : ${detail}`);
    }
    return { ok: true, id: res.data.id };
  } catch (err) {
    return fail(context, err instanceof Error ? err.message : String(err));
  }
}

function fail(context: string, error: string): EmailResult {
  // Préfixe stable pour retrouver ces lignes dans les logs Vercel.
  console.error(`[email] ${context} : envoi refusé (${error}) — expéditeur ${emailFrom()}`);
  return { ok: false, error };
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;

export function isValidEmail(value: string): boolean {
  return value.length <= 254 && EMAIL_RE.test(value);
}

/** Texte saisi par le visiteur, ramené à une ligne courte pour un objet d'email. */
export function oneLine(value: string, max = 80): string {
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}

/** Lien `tel:` sûr à partir d'un numéro saisi librement. */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/**
 * Prénom/nom à afficher dans un accusé de réception envoyé à une adresse
 * saisie par le visiteur. Un robot peut mettre un lien dans le champ nom et
 * se servir de l'accusé pour spammer un tiers depuis notre domaine : tout
 * ce qui ne ressemble pas à un nom est donc écarté.
 */
export function greetingName(name: string): string {
  const clean = name.trim();
  if (clean.length > 60) return "";
  // URL, adresse, numéro de téléphone ou montant : ce n'est pas un nom.
  if (/(:\/\/|www\.|@|\.[a-z]{2,}\b|\d{3,}|[€$£])/i.test(clean)) return "";
  return clean;
}
