import { Suspense } from "react";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeader } from "@/components/ui/section-header";
import { DevisWizard } from "@/components/ui/devis-wizard";
import { CtaBand } from "@/components/ui/cta-band";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { SITE } from "@/lib/utils";
import { Check, FileText, PhoneCall, Truck } from "lucide-react";

export const metadata = buildMetadata({
  title: "Devis Gratuit",
  description:
    "Demandez un devis gratuit pour vos projets de thermolaquage, sablage ou métallisation. Réponse sous 24h. AZ Époxy, Bruyères-sur-Oise.",
  path: "/devis",
});

const REASSURANCE = [
  {
    title: "100% Gratuit",
    description:
      "Notre devis est entièrement gratuit et sans surprise. Vous recevez un chiffrage clair et détaillé.",
  },
  {
    title: "Sans engagement",
    description:
      "Aucune obligation de votre part. Comparez et décidez en toute sérénité.",
  },
  {
    title: "Réponse express 24h",
    description:
      "Notre équipe s'engage à vous répondre sous 24 heures ouvrées, avec un devis précis et personnalisé.",
  },
];

const STEPS = [
  {
    num: "01",
    icon: FileText,
    title: "Envoyez vos informations",
    description:
      "Remplissez le formulaire ci-dessus avec les détails de votre projet. Joignez des photos si possible pour un chiffrage plus précis.",
  },
  {
    num: "02",
    icon: PhoneCall,
    title: "On vous rappelle sous 24h",
    description:
      "Notre équipe étudie votre demande, vous recontacte pour échanger sur votre projet et vous envoie un chiffrage détaillé.",
  },
  {
    num: "03",
    icon: Truck,
    title: "Livraison en 5-10 jours",
    description:
      "Après validation, nous réalisons le traitement dans notre atelier et vous livrons vos pièces dans les délais convenus.",
  },
];

export default function DevisPage() {
  return (
    <>
      {/* ── Hero ───────────────────────────────────────────── */}
      <PageHero
        label="Devis"
        title={
          <>
            Un projet ?{" "}
            <span className="block bg-gradient-ember bg-clip-text text-transparent">
              Une réponse.
            </span>
          </>
        }
        description="Décrivez votre projet en quelques clics. Nous vous envoyons un chiffrage précis et personnalisé dans les 24 heures ouvrées — gratuit, sans engagement."
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Devis" },
        ]}
      />

      {/* ── Wizard Section ────────────────────────────────── */}
      <section className="bg-brand-cream bg-industrial-grid py-24">
        <div className="container-wide max-w-3xl mx-auto">
          <ScrollReveal>
            <Suspense
              fallback={
                <div className="relative h-96 overflow-hidden rounded-2xl bg-brand-night/[0.04]">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent motion-safe:animate-skeleton-shimmer"
                  />
                </div>
              }
            >
              <DevisWizard />
            </Suspense>
          </ScrollReveal>

          {/* Reassurance — below wizard */}
          <ScrollReveal delay={0.15}>
            <div className="mt-8 grid sm:grid-cols-3 gap-4">
              {REASSURANCE.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-brand-night/10 bg-white p-5 text-center"
                >
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-orange/10">
                    <Check className="h-5 w-5 text-brand-orange" />
                  </div>
                  <h3 className="font-semibold text-brand-night text-sm mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-brand-charcoal/60 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── How it Works ───────────────────────────────────── */}
      <section className="bg-gradient-night bg-noise py-24">
        <div className="container-wide">
          <ScrollReveal>
            <SectionHeader
              label="Processus"
              title={
                <>
                  Comment ça{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    marche ?
                  </span>
                </>
              }
              description="Un processus simple et transparent, du devis à la livraison."
              dark
              centered
            />
          </ScrollReveal>

          <div className="mt-16 grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-px bg-white/10" />

            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <ScrollReveal key={step.num} delay={0.1 + i * 0.1}>
                  <div className="relative text-center">
                    {/* Number circle */}
                    <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-brand-orange text-white text-xl font-bold relative z-10">
                      {step.num}
                    </div>

                    {/* Icon */}
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.05]">
                      <Icon className="h-6 w-6 text-brand-orange" />
                    </div>

                    <h3 className="text-lg font-semibold text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed max-w-xs mx-auto">
                      {step.description}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <CtaBand
        title="Préférez-vous nous appeler ?"
        description={`Notre équipe est disponible du lundi au vendredi de 8h à 18h au ${SITE.phone}.`}
        primaryHref={`tel:${SITE.phone.replace(/\s/g, "")}`}
        primaryLabel="Appeler maintenant"
      />
    </>
  );
}
