"use client";

import { useRef, useState, useTransition } from "react";
import { Loader2, Plus } from "lucide-react";
import { addNoteAction } from "./actions";

export function NoteForm({ leadId }: { leadId: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const res = await addNoteAction(formData);
      if (res.ok) {
        formRef.current?.reset();
      } else {
        setError(res.error);
      }
    });
  };

  return (
    <form ref={formRef} action={onSubmit} className="flex flex-col gap-2">
      <input type="hidden" name="leadId" value={leadId} />
      <textarea
        name="note"
        rows={3}
        placeholder="Note interne : suivi téléphonique, devis envoyé, contexte client…"
        className="
          w-full resize-y rounded-lg border border-white/[0.08] bg-black/30 px-3 py-2.5
          text-sm leading-relaxed text-white placeholder:text-white/30
          focus:border-[#E85D2C]/55 focus:outline-none focus:ring-2 focus:ring-[#E85D2C]/15
        "
      />
      {error && (
        <p className="text-[12px] text-red-300">{error}</p>
      )}
      <div className="flex items-center justify-end">
        <button
          type="submit"
          disabled={pending}
          className="
            inline-flex items-center gap-1.5 rounded-full bg-white/[0.08] px-3 py-1.5
            text-[11px] font-semibold uppercase tracking-[0.14em] text-white/85
            transition-colors hover:bg-white/[0.12] hover:text-white
            disabled:opacity-60 disabled:cursor-wait
          "
        >
          {pending ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Plus className="h-3 w-3" />
          )}
          Ajouter
        </button>
      </div>
    </form>
  );
}
