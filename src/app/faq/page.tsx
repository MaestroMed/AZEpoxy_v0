import { buildMetadata } from "@/lib/seo";
import { faqPageLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHero } from "@/components/ui/page-hero";
import { CtaBand } from "@/components/ui/cta-band";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { SITE } from "@/lib/utils";
import { Phone, Mail } from "lucide-react";
import { FaqSection } from "./faq-section";
import { FAQS } from "@/lib/faq-data";

export const metadata = buildMetadata({
  title: "Questions Fréquentes",
  description:
    "Retrouvez les réponses aux questions les plus fréquentes sur nos prestations de thermolaquage, sablage et métallisation à Bruyères-sur-Oise.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <JsonLd id="ld-faq" data={faqPageLd(FAQS)} />

      {/* ── Hero ───────────────────────────────────────────── */}
      <PageHero
        label="FAQ"
        title={
          <>
            Questions
            <br />
            <span className="bg-gradient-ember bg-clip-text text-transparent">
              Fréquentes
            </span>
          </>
        }
        description="Tout ce que vous devez savoir sur nos prestations de thermolaquage, sablage et métallisation."
        variant="night"
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "FAQ" },
        ]}
      />

      {/* ── FAQ Accordion Section ──────────────────────────── */}
      <FaqSection />

      {/* ── Contact Block ──────────────────────────────────── */}
      <section className="bg-gradient-night bg-noise py-24">
        <div className="container-wide">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center mb-12">
              <h2 className="heading-display text-3xl md:text-4xl text-white mb-4">
                Vous ne trouvez pas votre réponse&nbsp;?
              </h2>
              <p className="text-white/60 text-lg">
                Notre équipe est à votre disposition pour répondre à toutes vos
                questions. N&apos;hésitez pas à nous contacter directement.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div className="mx-auto max-w-3xl grid md:grid-cols-2 gap-6">
              {/* Phone card */}
              <a
                href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                className="group rounded-2xl border border-white/10 bg-white/[0.02] p-8 transition hover:bg-white/[0.05]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange/10 mb-5">
                  <Phone className="h-6 w-6 text-brand-orange" />
                </div>
                <p className="text-sm text-white/50 mb-1">Téléphone</p>
                <p className="text-xl font-semibold text-white group-hover:text-brand-orange transition-colors">
                  {SITE.phone}
                </p>
                <p className="text-sm text-white/40 mt-2">
                  Lun — Ven : 8h00 — 18h00
                </p>
              </a>

              {/* Email card */}
              <a
                href={`mailto:${SITE.email}`}
                className="group rounded-2xl border border-white/10 bg-white/[0.02] p-8 transition hover:bg-white/[0.05]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange/10 mb-5">
                  <Mail className="h-6 w-6 text-brand-orange" />
                </div>
                <p className="text-sm text-white/50 mb-1">Email</p>
                <p className="text-xl font-semibold text-white group-hover:text-brand-orange transition-colors">
                  {SITE.email}
                </p>
                <p className="text-sm text-white/40 mt-2">
                  Réponse sous 24 heures
                </p>
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <CtaBand
        title="Prêt à lancer votre projet ?"
        description="Demandez un devis gratuit et recevez une réponse sous 24 heures."
        primaryHref="/devis"
        primaryLabel="Demander un devis gratuit"
      />
    </>
  );
}
