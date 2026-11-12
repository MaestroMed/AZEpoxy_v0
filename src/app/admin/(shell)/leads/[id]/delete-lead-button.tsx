"use client";

import { useState, useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { deleteLeadAction } from "./actions";

/**
 * Suppression en deux temps : un premier clic arme le bouton, le second
 * supprime. Pas de window.confirm, pour rester dans le ton de l'admin.
 */
export function DeleteLeadButton({ leadId }: { leadId: string }) {
  const [armed, setArmed] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onDelete = () => {
    setError(null);
    const formData = new FormData();
    formData.set("leadId", leadId);
    startTransition(async () => {
      // En cas de succès l'action redirige vers la liste : on ne revient
      // ici que sur une erreur.
      const res = await deleteLeadAction(formData);
      if (res && !res.ok) {
        setError(res.error);
        setArmed(false);
      }
    });
  };

  if (!armed) {
    return (
      <button
        type="button"
        onClick={() => setArmed(true)}
        className="
          inline-flex items-center gap-1.5 rounded-full border border-red-400/25 px-3 py-1.5
          text-[11px] font-semibold uppercase tracking-[0.14em] text-red-300/85
          transition-colors hover:border-red-400/50 hover:bg-red-500/10 hover:text-red-200
        "
      >
        <Trash2 className="h-3 w-3" />
        Supprimer ce lead
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[12px] leading-relaxed text-white/70">
        Suppression définitive du lead et de son historique. Un devis rattaché
        est conservé.
      </p>
      {error && <p className="text-[12px] text-red-300">{error}</p>}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onDelete}
          disabled={pending}
          className="
            inline-flex items-center gap-1.5 rounded-full bg-red-500/85 px-3 py-1.5
            text-[11px] font-semibold uppercase tracking-[0.14em] text-white
            transition-colors hover:bg-red-500
            disabled:cursor-wait disabled:opacity-60
          "
        >
          {pending ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Trash2 className="h-3 w-3" />
          )}
          Confirmer
        </button>
        <button
          type="button"
          onClick={() => setArmed(false)}
          disabled={pending}
          className="
            rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase
            tracking-[0.14em] text-white/55 transition-colors hover:text-white
          "
        >
          Annuler
        </button>
      </div>
    </div>
  );
}
