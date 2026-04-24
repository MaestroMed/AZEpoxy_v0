import {
  Eye,
  Palette,
  Sparkles,
  ArrowRight,
  Info,
} from "lucide-react";

import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeader } from "@/components/ui/section-header";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { FeatureCard } from "@/components/ui/feature-card";
import { CtaBand } from "@/components/ui/cta-band";
import { VisualConfigurator } from "@/components/ui/visual-configurator";

export const metadata = buildMetadata({
  title: "Configurateur Visuel — Visualisez votre pièce",
  description:
    "Configurez votre jante, portail, mobilier ou cadre moto avec la couleur RAL et la finition de votre choix. Aperçu temps réel, devis instantané.",
  path: "/configurateur",
});

export default function ConfigurateurPage() {
  return (
    <>
      <PageHero
        label="Configurateur"
        title={
          <>
            Visualisez votre{" "}
            <span className="block bg-gradient-ember bg-clip-text text-transparent">
              finition
            </span>
          </>
        }
        description="Choisissez votre pièce, votre couleur RAL et votre finition — l'aperçu se met à jour en temps réel. Projetez-vous avant même de commander."
        variant="transparent"
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Configurateur" },
        ]}
      />

      {/* ── Configurator ───────────────────────────────── */}
      <section className="bg-brand-cream bg-industrial-grid py-20">
        <div className="container-wide">
          <VisualConfigurator />

          {/* Disclaimer */}
          <div className="mx-auto mt-12 flex max-w-3xl items-start gap-3 rounded-2xl border border-brand-night/10 bg-white/60 p-4 text-sm text-brand-charcoal/70 backdrop-blur-sm">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" />
            <p>
              L&apos;aperçu est une illustration indicative. Les rendus réels
              peuvent varier selon la pièce, la texture et l&apos;éclairage.
              Pour une validation parfaite, nous pouvons vous fournir un
              échantillon physique sur demande.
            </p>
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="container-wide">
          <ScrollReveal>
            <SectionHeader
              label="Pourquoi configurer en ligne"
              title={
                <>
                  Un projet{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    maîtrisé
                  </span>
                </>
              }
              description="Moins d'allers-retours, plus de précision dans votre devis."
              centered
            />
          </ScrollReveal>

          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            <ScrollReveal delay={0.1}>
              <FeatureCard
                icon={<Eye className="h-6 w-6" />}
                title="Aperçu temps réel"
                description="Visualisez immédiatement le rendu de la couleur RAL appliquée à votre type de pièce, sans aucun logiciel à installer."
              />
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <FeatureCard
                icon={<Palette className="h-6 w-6" />}
                title="Palette complète"
                description="14 couleurs populaires directement dans le configurateur, et accès au nuancier complet RAL 213 couleurs pour les demandes spécifiques."
              />
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <FeatureCard
                icon={<Sparkles className="h-6 w-6" />}
                title="Finitions multiples"
                description="Mat, satiné ou brillant — chaque finition a son propre rendu. Testez les trois pour trouver le caractère qui correspond à votre pièce."
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────── */}
      <section className="bg-gradient-night bg-noise py-24">
        <div className="container-wide">
          <ScrollReveal>
            <SectionHeader
              label="Fonctionnement"
              title={
                <>
                  En{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    3 étapes
                  </span>
                </>
              }
              description="De la visualisation à la commande, un parcours simple et transparent."
              dark
              centered
            />
          </ScrollReveal>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Choisissez votre pièce",
                description:
                  "Jante auto, portail, mobilier métal ou cadre moto — sélectionnez le type le plus proche de votre projet.",
              },
              {
                step: "02",
                title: "Testez couleurs et finitions",
                description:
                  "Parcourez les RAL les plus demandés, comparez mat/satiné/brillant et trouvez l'accord parfait pour votre pièce.",
              },
              {
                step: "03",
                title: "Finalisez votre devis",
                description:
                  "Un clic sur « Demander un devis » pré-remplit le formulaire avec votre configuration. Retour sous 24 h ouvrées.",
              },
            ].map((item, i) => (
              <ScrollReveal key={item.step} delay={0.1 + i * 0.1}>
                <div className="group relative h-full rounded-2xl border border-white/10 bg-white/[0.02] p-8 transition-all hover:border-brand-orange/40 hover:bg-white/[0.04]">
                  <span className="heading-display block text-5xl text-brand-orange/80">
                    {item.step}
                  </span>
                  <h3 className="heading-display mt-4 text-xl text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">
                    {item.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <a
              href="#top"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-all hover:border-white hover:bg-white/10"
            >
              Tester le configurateur
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <CtaBand
        title="Besoin d'un échantillon physique ?"
        description="Pour les projets exigeants, nous pouvons thermolaquer un coupon témoin avec votre couleur et votre finition exactes avant lancement."
        primaryHref="/contact"
        primaryLabel="Demander un échantillon"
      />
    </>
  );
}
