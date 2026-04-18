import { CalendarClock, MessageCircle, Phone } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/page-hero";
import { BookingEmbed } from "@/components/ui/booking-embed";
import { CtaBand } from "@/components/ui/cta-band";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { SITE } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Prendre rendez-vous",
  description:
    "Planifiez un rendez-vous atelier ou un appel conseil avec AZ Époxy. Visite de notre atelier de 1 800 m² à Bruyères-sur-Oise, conseil couleur RAL, validation devis.",
  path: "/rendez-vous",
});

const HIGHLIGHTS = [
  {
    title: "Visite atelier 30 min",
    description:
      "Découvrez notre cabine de thermolaquage 7 m, notre stock de poudres et les collections premium Adaptacolor en vrai.",
  },
  {
    title: "Conseil couleur RAL",
    description:
      "Présentation d'échantillons thermolaqués et aide au choix de finition selon votre projet.",
  },
  {
    title: "Revue de devis",
    description:
      "Apportez vos pièces ou vos photos — nous validons le chiffrage et le protocole de traitement ensemble.",
  },
];

export default function RendezVousPage() {
  return (
    <>
      <PageHero
        label="Rendez-vous"
        title={
          <>
            Un créneau avec{" "}
            <span className="bg-gradient-ember bg-clip-text text-transparent">
              notre équipe
            </span>
          </>
        }
        description="Visite de l'atelier, conseil couleur ou revue de devis — choisissez le format qui vous convient et réservez directement en ligne."
        variant="transparent"
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Rendez-vous" },
        ]}
      />

      <section className="bg-brand-cream bg-industrial-grid py-24">
        <div className="container-wide grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <ScrollReveal>
            <BookingEmbed />
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="space-y-6">
              <div>
                <span className="section-label">
                  <CalendarClock className="h-3 w-3" />
                  À prévoir
                </span>
                <h2 className="heading-display mt-4 text-2xl text-brand-night">
                  Ce que vous pouvez attendre du rendez-vous
                </h2>
              </div>
              <ul className="space-y-4">
                {HIGHLIGHTS.map((h) => (
                  <li
                    key={h.title}
                    className="rounded-2xl border border-brand-night/10 bg-white p-5"
                  >
                    <p className="font-display text-lg font-semibold text-brand-night">
                      {h.title}
                    </p>
                    <p className="mt-1 text-sm text-brand-charcoal/70 leading-relaxed">
                      {h.description}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="rounded-2xl bg-brand-night p-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-orange">
                  Urgence chantier
                </p>
                <p className="mt-3 text-lg font-semibold">
                  Besoin d&apos;une réponse dans l&apos;heure&nbsp;?
                </p>
                <p className="mt-2 text-sm text-white/70">
                  Appelez-nous ou joignez-nous sur WhatsApp — nous gérons les
                  urgences chantier en Île-de-France.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a href={SITE.phoneHref} className="btn-primary">
                    <Phone className="h-4 w-4" />
                    {SITE.phone}
                  </a>
                  <a
                    href={`https://wa.me/${SITE.phoneHref.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost-light"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <CtaBand
        title="Préférez envoyer vos photos d'abord&nbsp;?"
        description="Envoyez-nous votre projet, nous vous rappelons avec un chiffrage sous 24h."
        primaryHref="/devis"
        primaryLabel="Demander un devis écrit"
      />
    </>
  );
}
