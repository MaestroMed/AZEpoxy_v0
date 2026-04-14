import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeader } from "@/components/ui/section-header";
import { ContactForm } from "@/components/ui/contact-form";
import { CtaBand } from "@/components/ui/cta-band";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { SITE } from "@/lib/utils";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez AZ Époxy pour vos projets de thermolaquage, sablage et métallisation. Devis gratuit sous 24h. Bruyères-sur-Oise, Val-d'Oise.",
};

const CONTACT_CARDS = [
  {
    icon: Phone,
    label: "Téléphone",
    value: SITE.phone,
    href: `tel:${SITE.phone.replace(/\s/g, "")}`,
    sub: "Lun — Ven : 8h00 — 18h00",
  },
  {
    icon: Mail,
    label: "Email",
    value: SITE.email,
    href: `mailto:${SITE.email}`,
    sub: "Réponse sous 24 heures",
  },
  {
    icon: MapPin,
    label: "Adresse",
    value: "23 Chemin du Bac des Aubins",
    href: undefined,
    sub: "95820 Bruyères-sur-Oise, France",
  },
  {
    icon: Clock,
    label: "Horaires",
    value: "Lundi — Vendredi",
    href: undefined,
    sub: "8h00 — 18h00",
  },
];

export default function ContactPage() {
  return (
    <>
      {/* ── Hero ───────────────────────────────────────────── */}
      <PageHero
        label="Contact"
        title={
          <>
            Contactez
            <br />
            <span className="bg-gradient-ember bg-clip-text text-transparent">
              nous
            </span>
          </>
        }
        description="Une question, un projet ? Notre équipe est à votre écoute."
        variant="night"
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Contact" },
        ]}
      />

      {/* ── Contact Split ──────────────────────────────────── */}
      <section className="bg-brand-cream bg-industrial-grid py-24">
        <div className="container-wide">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12">
            {/* Form */}
            <ScrollReveal>
              <ContactForm variant="simple" />
            </ScrollReveal>

            {/* Info Cards */}
            <ScrollReveal delay={0.15}>
              <div className="space-y-4">
                {CONTACT_CARDS.map((card) => {
                  const Icon = card.icon;
                  const Wrapper = card.href ? "a" : "div";
                  const wrapperProps = card.href
                    ? { href: card.href }
                    : {};

                  return (
                    <Wrapper
                      key={card.label}
                      {...wrapperProps}
                      className="flex gap-4 rounded-xl border border-brand-night/10 bg-white p-5 transition hover:shadow-md"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-orange/10">
                        <Icon className="h-5 w-5 text-brand-orange" />
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-brand-charcoal/50 mb-0.5">
                          {card.label}
                        </p>
                        <p className="font-semibold text-brand-night">
                          {card.value}
                        </p>
                        {card.sub && (
                          <p className="text-sm text-brand-charcoal/60 mt-0.5">
                            {card.sub}
                          </p>
                        )}
                      </div>
                    </Wrapper>
                  );
                })}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Access ─────────────────────────────────────────── */}
      <section className="bg-gradient-night bg-noise py-24">
        <div className="container-wide">
          <ScrollReveal>
            <SectionHeader
              label="Accès"
              title={
                <>
                  Comment{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    venir
                  </span>
                </>
              }
              description="Notre atelier est facilement accessible depuis Paris et toute l'Île-de-France."
              dark
            />
          </ScrollReveal>

          <div className="mt-12 grid lg:grid-cols-2 gap-12 items-start">
            <ScrollReveal delay={0.1}>
              <div className="space-y-4 text-white/70 leading-relaxed">
                <p>
                  Situé à Bruyères-sur-Oise dans le Val-d&apos;Oise (95), notre
                  atelier se trouve à proximité immédiate des autoroutes A1 et A16,
                  à seulement 40 minutes au nord de Paris.
                </p>
                <p>
                  Un parking gratuit est à votre disposition sur place pour le
                  dépôt et le retrait de vos pièces. Nous pouvons également
                  organiser la livraison en Île-de-France pour les commandes
                  importantes.
                </p>
                <div className="pt-4">
                  <p className="text-white font-semibold mb-1">
                    23 Chemin du Bac des Aubins
                  </p>
                  <p className="text-white/50">
                    95820 Bruyères-sur-Oise, France
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="rounded-2xl bg-brand-charcoal/50 aspect-video flex items-center justify-center">
                <p className="text-white/30 text-sm font-medium">
                  Carte interactive
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <CtaBand
        title="Besoin d'un devis détaillé ?"
        description="Décrivez votre projet et recevez un chiffrage précis sous 24 heures."
        primaryHref="/devis"
        primaryLabel="Demander un devis"
      />
    </>
  );
}
