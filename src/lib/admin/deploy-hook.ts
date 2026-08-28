import "server-only";

/**
 * Redéploiement de production déclenché depuis l'admin.
 *
 * Pourquoi c'est nécessaire
 * ─────────────────────────
 * `/realisations/[slug]` porte `dynamicParams = false` : seuls les slugs
 * renvoyés par `generateStaticParams` existent, tout le reste répond 404.
 * C'est ce qui ferme la surface de soft-404 (cf. le correctif du 24/08/2026).
 * Mais `generateStaticParams` ne tourne QU'AU BUILD. Une réalisation publiée
 * depuis l'admin après le dernier déploiement n'aurait donc pas de fiche.
 *
 * Pourquoi presque jamais
 * ───────────────────────
 * Un rebuild n'est utile que si **l'ensemble des slugs** change. Le slug vient
 * du titre, et la liste ne retient que les réalisations publiées. Donc :
 *
 *   création · suppression · titre modifié · publication basculée  → rebuild
 *   description, image, couleurs, mise en avant, ordre d'affichage → rien
 *
 * Le contenu d'une fiche est relu en base à chaque revalidation ISR (600 s) :
 * modifier une description n'a jamais besoin d'un build. Cette distinction
 * n'est pas cosmétique — chaque déclenchement consomme des build minutes
 * Vercel, et l'écrasante majorité des éditions n'en a pas besoin.
 *
 * Sans `DEPLOY_HOOK_URL` (développement local, environnement de test), la
 * fonction ne fait rien et le dit. Elle n'échoue jamais bruyamment : un hook
 * injoignable ne doit pas faire échouer l'enregistrement d'une réalisation.
 */

export type ResultatRedeploiement = "declenche" | "desactive" | "echec";

export async function declencherRedeploiement(): Promise<ResultatRedeploiement> {
  const url = process.env.DEPLOY_HOOK_URL;
  if (!url) return "desactive";

  try {
    const reponse = await fetch(url, { method: "POST", cache: "no-store" });
    return reponse.ok ? "declenche" : "echec";
  } catch {
    return "echec";
  }
}

/**
 * L'ensemble des slugs publiés change-t-il ? Seul cas où un build est utile.
 * `avant` vaut null à la création.
 */
export function slugsImpactes(
  avant: { title: string; published: boolean } | null,
  apres: { title: string; published: boolean },
): boolean {
  if (!avant) return apres.published;
  if (avant.published !== apres.published) return true;
  // Le slug dérive du titre : un titre qui bouge déplace l'URL de la fiche.
  return avant.published && avant.title !== apres.title;
}
