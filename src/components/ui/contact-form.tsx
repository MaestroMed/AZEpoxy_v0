"use client";

import { useState, useRef, type FormEvent } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { PhotoUpload } from "@/components/ui/photo-upload";
import { trackEvent } from "@/components/analytics/ga4";

interface ContactFormProps {
  variant?: "simple" | "full";
}

const inputClass =
  "w-full rounded-xl border border-brand-night/15 bg-white px-4 py-3 text-brand-night placeholder:text-brand-charcoal/40 focus:outline-none focus:ring-2 focus:ring-brand-orange transition-shadow";

const labelClass = "mb-1.5 block text-sm font-semibold text-brand-night";

type Status = "idle" | "loading" | "success" | "error";

export function ContactForm({ variant = "simple" }: ContactFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const formStartTracked = useRef(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = e.currentTarget;

    try {
      if (variant === "full") {
        // Devis: send as FormData (multipart) to support file uploads
        const formData = new FormData(form);
        // Remove the honeypot from visible data but keep it for the API
        for (const photo of photos) {
          formData.append("photos", photo);
        }
        const res = await fetch("/api/devis", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Erreur lors de l'envoi.");
      } else {
        // Contact: send as JSON
        const formData = new FormData(form);
        const body = Object.fromEntries(formData.entries());
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Erreur lors de l'envoi.");
      }
      trackEvent("form_submit", { variant });
      setStatus("success");
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
      <div className="rounded-2xl border border-brand-success/30 bg-brand-success/10 p-8 text-center">
        <p className="heading-display text-xl text-brand-night">Merci !</p>
        <p className="mt-2 text-brand-charcoal/70">
          Nous avons bien reçu votre demande. Nous vous recontacterons sous
          24h.
        </p>
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
              trackEvent("form_start", { variant });
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
