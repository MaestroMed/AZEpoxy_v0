import { SITE } from "@/lib/utils";

/**
 * POST d'un formulaire public (contact, devis). Lève une Error dont le
 * message s'affiche tel quel au visiteur.
 *
 * La réponse d'erreur n'est pas toujours du JSON : un corps trop lourd est
 * refusé par Vercel (413, texte brut) avant d'atteindre la route. Lire
 * `res.json()` sans filet affichait alors « Unexpected token… » au visiteur.
 */
export async function postLead(url: string, init: RequestInit): Promise<void> {
  let res: Response;
  try {
    res = await fetch(url, { ...init, method: "POST" });
  } catch {
    throw new Error(
      `Connexion impossible. Vérifiez votre réseau ou appelez-nous au ${SITE.phone}.`
    );
  }
  if (res.ok) return;

  let message: string | undefined;
  try {
    const data = (await res.json()) as { error?: unknown };
    if (typeof data.error === "string") message = data.error;
  } catch {
    /* corps non JSON */
  }
  if (!message && res.status === 413) {
    message = `Vos photos sont trop lourdes pour être envoyées. Retirez-en quelques-unes ou envoyez-les à ${SITE.email}.`;
  }
  throw new Error(
    message ?? `Erreur lors de l'envoi (${res.status}). Appelez-nous au ${SITE.phone}.`
  );
}
