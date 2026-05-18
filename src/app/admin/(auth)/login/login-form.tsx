"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { loginAction, type LoginState } from "./actions";

interface LoginFormProps {
  from?: string;
}

export function LoginForm({ from }: LoginFormProps) {
  const [state, formAction] = useActionState<LoginState | null, FormData>(
    loginAction,
    null,
  );

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {from && <input type="hidden" name="from" value={from} />}

      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="vous@azepoxy.fr"
        required
      />

      <Field
        label="Mot de passe"
        name="password"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        required
      />

      {state && !state.ok && (
        <div
          role="alert"
          className="rounded-lg border border-red-500/25 bg-red-500/[0.08] px-3.5 py-2.5 text-sm text-red-200"
        >
          {state.error}
        </div>
      )}

      <SubmitButton />
    </form>
  );
}

function Field({
  label,
  name,
  type,
  autoComplete,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type: string;
  autoComplete?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55">
        {label}
      </span>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required={required}
        className="
          w-full rounded-xl border border-white/10 bg-black/30 px-3.5 py-2.5 text-sm text-white
          placeholder:text-white/30
          focus:border-[#E85D2C]/55 focus:bg-black/40 focus:outline-none focus:ring-2 focus:ring-[#E85D2C]/20
          transition-colors
        "
      />
    </label>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="
        group relative mt-1 inline-flex items-center justify-center gap-2 overflow-hidden
        rounded-xl bg-gradient-to-br from-[#FF7A40] via-[#E85D2C] to-[#C84818]
        px-5 py-3 text-sm font-semibold text-white
        shadow-[0_10px_30px_-12px_rgba(232,93,44,0.65)]
        transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
        hover:shadow-[0_18px_40px_-12px_rgba(232,93,44,0.85)] hover:-translate-y-[1px]
        disabled:opacity-70 disabled:cursor-wait disabled:hover:translate-y-0
      "
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Connexion…
        </>
      ) : (
        <>
          Se connecter
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </>
      )}
    </button>
  );
}
