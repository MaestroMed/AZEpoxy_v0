"use client";

import { useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";

interface ContactFormProps {
  variant?: "simple" | "full";
}

const inputClass =
  "w-full rounded-xl border border-brand-night/15 bg-white px-4 py-3 text-brand-night placeholder:text-brand-charcoal/40 focus:outline-none focus:ring-2 focus:ring-brand-orange transition-shadow";

const labelClass = "mb-1.5 block text-sm font-semibold text-brand-night";

export function ContactForm({ variant = "simple" }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-brand-success/30 bg-brand-success/10 p-8 text-center">
        <p className="heading-display text-xl text-brand-night">
          Merci !
        </p>
        <p className="mt-2 text-brand-charcoal/70">
          Nous avons bien reçu votre demande. Nous vous recontacterons sous
          24h.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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

      {/* Submit */}
      <button type="submit" className="btn-primary w-full justify-center">
        Envoyer la demande
      </button>
    </form>
  );
}
