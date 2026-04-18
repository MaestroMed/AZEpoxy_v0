"use client";

import { useCallback, useState, useRef, type FormEvent } from "react";
import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";
import { PhotoUpload } from "@/components/ui/photo-upload";
import { TurnstileWidget } from "@/components/ui/turnstile";
import { track } from "@/lib/analytics/events";
import { getSwarm } from "@/lib/nuee/store";
import { getSoundEngine } from "@/lib/nuee/sound";

interface ContactFormProps {
  variant?: "simple" | "full";
}

// Input styles — premium feel. Focus ring is applied globally from
// globals.css (brand-orange glow + shadow), so we don't repeat it here.
const inputClass =
  "w-full rounded-xl border border-brand-night/15 bg-white px-4 py-3.5 text-brand-night placeholder:text-brand-charcoal/35 focus:outline-none";

const labelClass =
  "mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-charcoal/80";

type Status = "idle" | "loading" | "success" | "error";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function ContactForm({ variant = "simple" }: ContactFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const formStartTracked = useRef(false);

  // Stable callback so the Turnstile widget effect doesn't re-run every render.
  const handleTurnstile = useCallback((token: string | null) => {
    setTurnstileToken(token);
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = e.currentTarget;

    try {
      if (variant === "full") {
        // Devis: send as FormData (multipart) to support file uploads
        const formData = new FormData(form);
        for (const photo of photos) {
          formData.append("photos", photo);
        }
        if (turnstileToken) formData.set("turnstileToken", turnstileToken);
        const res = await fetch("/api/devis", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Erreur lors de l'envoi.");
      } else {
        // Contact: send as JSON
        const formData = new FormData(form);
        const body = Object.fromEntries(formData.entries());
        if (turnstileToken) body.turnstileToken = turnstileToken;
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Erreur lors de l'envoi.");
      }
      track("form_submit", { variant, status: "ok" });
      setStatus("success");
      // Burst + whoosh de célébration, même logique que le wizard devis.
      try {
        getSwarm().triggerBurst(1200);
        getSoundEngine().whoosh(0.7);
        track("swarm_burst", { trigger: "form_success" });
      } catch {
        /* engine not init — silent */
      }
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Erreur lors de l'envoi. Appelez-nous au 09 71 35 74 96."
      );
    }
  };

  if (status === "success") {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-brand-success/30 bg-gradient-to-br from-brand-success/15 via-brand-success/8 to-brand-success/5 p-10 text-center shadow-[0_16px_40px_-20px_rgba(76,175,80,0.35)]">
        {/* Ripple décoratif */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent motion-safe:animate-[stat-pop_1200ms_cubic-bezier(0.22,1,0.36,1)_1]"
        />
        <div className="relative">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-success text-white shadow-lg shadow-brand-success/40">
            <Check className="h-6 w-6" strokeWidth={3} />
          </div>
          <p className="heading-display text-2xl text-brand-night">Merci !</p>
          <p className="mx-auto mt-3 max-w-sm text-brand-charcoal/75 leading-relaxed">
            Nous avons bien reçu votre demande. Notre équipe vous recontactera
            sous <strong className="text-brand-night">24h</strong>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Honeypot — invisible to users, catches bots */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Name */}
      <div>
        <label htmlFor="contact-name" className={labelClass}>
          Nom complet
        </label>
        <input
          id="contact-name"
          type="text"
          name="name"
          required
          placeholder="Jean Dupont"
          className={inputClass}
          onFocus={() => {
            if (!formStartTracked.current) {
              formStartTracked.current = true;
              track("form_start", { variant });
            }
          }}
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="contact-email" className={labelClass}>
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          name="email"
          required
          placeholder="jean@exemple.fr"
          className={inputClass}
        />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="contact-phone" className={labelClass}>
          Téléphone
        </label>
        <input
          id="contact-phone"
          type="tel"
          name="phone"
          placeholder="06 12 34 56 78"
          className={inputClass}
        />
      </div>

      {/* Full variant fields */}
      {variant === "full" && (
        <>
          {/* Service type */}
          <div>
            <label htmlFor="contact-service" className={labelClass}>
              Type de service
            </label>
            <select
              id="contact-service"
              name="service"
              className={cn(inputClass, "appearance-none")}
              defaultValue=""
            >
              <option value="" disabled>
                Sélectionner un service
              </option>
              <option value="thermolaquage">Thermolaquage</option>
              <option value="sablage">Sablage</option>
              <option value="metallisation">Métallisation</option>
              <option value="finitions">Finitions spéciales</option>
            </select>
          </div>

          {/* Description piece */}
          <div>
            <label htmlFor="contact-piece" className={labelClass}>
              Description de la pièce
            </label>
            <input
              id="contact-piece"
              type="text"
              name="piece"
              placeholder="Ex : Jantes alu 18 pouces, portail fer forgé..."
              className={inputClass}
            />
          </div>

          {/* Dimensions */}
          <div>
            <label htmlFor="contact-dimensions" className={labelClass}>
              Dimensions (L x l x H)
            </label>
            <input
              id="contact-dimensions"
              type="text"
              name="dimensions"
              placeholder="Ex : 200 x 100 x 50 cm"
              className={inputClass}
            />
          </div>

          {/* Quantity */}
          <div>
            <label htmlFor="contact-quantite" className={labelClass}>
              Quantité
            </label>
            <input
              id="contact-quantite"
              type="text"
              name="quantite"
              placeholder="Ex : 4 pièces"
              className={inputClass}
            />
          </div>

          {/* RAL color */}
          <div>
            <label htmlFor="contact-ral" className={labelClass}>
              Couleur RAL souhaitée{" "}
              <span className="font-normal text-brand-charcoal/50">
                (optionnel)
              </span>
            </label>
            <input
              id="contact-ral"
              type="text"
              name="ral"
              placeholder="Ex : RAL 9005 Noir foncé"
              className={inputClass}
            />
          </div>

          {/* Photo upload */}
          <div>
            <label className={labelClass}>
              Photos de vos pièces{" "}
              <span className="font-normal text-brand-charcoal/50">
                (optionnel)
              </span>
            </label>
            <PhotoUpload files={photos} onChange={setPhotos} />
          </div>
        </>
      )}

      {/* Message */}
      <div>
        <label htmlFor="contact-message" className={labelClass}>
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          required
          placeholder="Décrivez votre projet..."
          className={cn(inputClass, "resize-y")}
        />
      </div>

      {/* Turnstile (no-ops when site key missing) */}
      <TurnstileWidget siteKey={TURNSTILE_SITE_KEY} onToken={handleTurnstile} />

      {/* Error */}
      {status === "error" && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "loading"}
        className={cn(
          "btn-primary w-full justify-center",
          status === "loading" && "pointer-events-none opacity-70"
        )}
      >
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Envoi en cours...
          </>
        ) : (
          "Envoyer la demande"
        )}
      </button>
    </form>
  );
}
