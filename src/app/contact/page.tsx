import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeader } from "@/components/ui/section-header";
import { ContactForm } from "@/components/ui/contact-form";
import { CtaBand } from "@/components/ui/cta-band";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { SITE } from "@/lib/utils";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export const metadata = buildMetadata({
  title: "Contact",
  description:
    "Contactez AZ Époxy pour vos projets de thermolaquage, sablage et métallisation. Devis gratuit sous 24h. Bruyères-sur-Oise, Val-d'Oise.",
  path: "/contact",
});

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
        variant="transparent"
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
                      data-magnetic={card.href ? "" : undefined}
                      className="group relative flex gap-4 overflow-hidden rounded-xl border border-brand-night/10 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-orange/40 hover:shadow-[0_12px_32px_-18px_rgba(232,93,44,0.35)]"
                    >
                      {/* Sheen on hover */}
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-br from-transparent via-brand-orange/6 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                      />
                      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-orange/10 transition-colors duration-300 group-hover:bg-brand-orange group-hover:text-white">
                        <Icon className="h-5 w-5 text-brand-orange transition-colors duration-300 group-hover:text-white" />
                      </div>
                      <div className="relative">
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
              <div className="overflow-hidden rounded-2xl aspect-video">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2595.3!2d2.327!3d49.147!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s23+Chemin+du+Bac+des+Aubins%2C+95820+Bruy%C3%A8res-sur-Oise!5e0!3m2!1sfr!2sfr"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="AZ Époxy — 23 Chemin du Bac des Aubins, Bruyères-sur-Oise"
                  className="h-full w-full"
                />
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="https://www.google.com/maps/dir//23+Chemin+du+Bac+des+Aubins,+95820+Bruy%C3%A8res-sur-Oise"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:border-brand-orange hover:bg-brand-orange"
                >
                  Itinéraire Google Maps
                </a>
                <p className="flex items-center text-sm text-white/50">
                  Accès poids lourds possible — Parking gratuit
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
