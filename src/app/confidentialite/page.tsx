import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export const metadata: Metadata = {
  title: "Politique de Confidentialité",
  description:
    "Politique de confidentialité et protection des données personnelles du site AZ Époxy, conformément au RGPD.",
};

const SECTIONS = [
  {
    title: "1. Données collectées",
    content: (
      <>
        <p>
          Dans le cadre de l&apos;utilisation du site azepoxy.fr et de nos
          formulaires de contact et de demande de devis, nous sommes amenés à
          collecter les données personnelles suivantes :
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Nom et prénom</li>
          <li>Adresse email</li>
          <li>Numéro de téléphone</li>
          <li>Nom de l&apos;entreprise (le cas échéant)</li>
          <li>Message et description du projet</li>
        </ul>
        <p>
          Ces données sont collectées lorsque vous remplissez volontairement un
          formulaire sur notre site.
        </p>
      </>
    ),
  },
  {
    title: "2. Finalité du traitement",
    content: (
      <>
        <p>Les données collectées sont utilisées exclusivement pour :</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Répondre à vos demandes de renseignements</li>
          <li>Établir des devis personnalisés</li>
          <li>Assurer le suivi de votre commande et de la relation client</li>
          <li>
            Vous contacter dans le cadre de la prestation demandée
          </li>
        </ul>
        <p>
          Vos données ne sont jamais utilisées à des fins de prospection
          commerciale non sollicitée.
        </p>
      </>
    ),
  },
  {
    title: "3. Base légale",
    content: (
      <>
        <p>Le traitement de vos données personnelles repose sur :</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>L&apos;intérêt légitime</strong> : dans le cadre de la
            relation commerciale (réponse à une demande de devis, suivi client)
          </li>
          <li>
            <strong>Votre consentement</strong> : lorsque vous remplissez
            volontairement un formulaire de contact sur notre site
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "4. Durée de conservation",
    content: (
      <p>
        Vos données personnelles sont conservées pendant une durée maximale de 3
        ans à compter de votre dernier contact avec AZ Époxy. Passé ce délai,
        vos données sont supprimées de manière sécurisée. Les données relatives
        à une commande effectuée sont conservées conformément aux obligations
        légales comptables (10 ans).
      </p>
    ),
  },
  {
    title: "5. Destinataires des données",
    content: (
      <p>
        Vos données personnelles sont strictement réservées à l&apos;usage
        interne d&apos;AZ Époxy et ne sont transmises à aucun tiers, partenaire
        commercial ou organisme extérieur, sauf obligation légale. Seuls les
        membres de l&apos;équipe AZ Époxy en charge de la relation client et de
        la réalisation des devis ont accès à vos informations.
      </p>
    ),
  },
  {
    title: "6. Vos droits",
    content: (
      <>
        <p>
          Conformément au Règlement Général sur la Protection des Données (RGPD)
          et à la loi Informatique et Libertés, vous disposez des droits
          suivants :
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Droit d&apos;accès</strong> : obtenir la communication de
            vos données
          </li>
          <li>
            <strong>Droit de rectification</strong> : corriger des données
            inexactes
          </li>
          <li>
            <strong>Droit de suppression</strong> : demander l&apos;effacement
            de vos données
          </li>
          <li>
            <strong>Droit à la portabilité</strong> : recevoir vos données dans
            un format structuré
          </li>
          <li>
            <strong>Droit d&apos;opposition</strong> : vous opposer au
            traitement de vos données
          </li>
          <li>
            <strong>Droit à la limitation</strong> : restreindre le traitement
            de vos données
          </li>
        </ul>
        <p>
          Pour exercer ces droits, contactez-nous par email à{" "}
          <a
            href="mailto:contact@azepoxy.fr"
            className="text-brand-orange hover:underline font-medium"
          >
            contact@azepoxy.fr
          </a>{" "}
          ou par courrier à l&apos;adresse : AZ Époxy, 23 Chemin du Bac des
          Aubins, 95820 Bruyères-sur-Oise. Nous nous engageons à répondre dans
          un délai de 30 jours.
        </p>
        <p>
          Vous disposez également du droit d&apos;introduire une réclamation
          auprès de la CNIL (Commission Nationale de l&apos;Informatique et des
          Libertés).
        </p>
      </>
    ),
  },
  {
    title: "7. Cookies",
    content: (
      <>
        <p>
          Le site azepoxy.fr utilise uniquement des cookies techniques
          strictement nécessaires au bon fonctionnement du site (cookies de
          session, préférences d&apos;affichage).
        </p>
        <p>
          <strong>
            Aucun cookie publicitaire, de suivi ou d&apos;analyse tiers
          </strong>{" "}
          n&apos;est déposé sur votre appareil. En conséquence, aucun bandeau de
          consentement aux cookies n&apos;est nécessaire.
        </p>
      </>
    ),
  },
  {
    title: "8. Contact — Délégué à la Protection des Données",
    content: (
      <>
        <p>
          Pour toute question relative à la protection de vos données
          personnelles, vous pouvez nous contacter :
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Par email :{" "}
            <a
              href="mailto:contact@azepoxy.fr"
              className="text-brand-orange hover:underline font-medium"
            >
              contact@azepoxy.fr
            </a>
          </li>
          <li>Par téléphone : 09 71 35 74 96</li>
          <li>
            Par courrier : AZ Époxy, 23 Chemin du Bac des Aubins, 95820
            Bruyères-sur-Oise, France
          </li>
        </ul>
      </>
    ),
  },
];

export default function ConfidentialitePage() {
  return (
    <>
      {/* ── Hero ───────────────────────────────────────────── */}
      <PageHero
        label="Juridique"
        title={
          <>
            Politique de{" "}
            <span className="bg-gradient-ember bg-clip-text text-transparent">
              Confidentialité
            </span>
          </>
        }
        variant="night"
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Confidentialité" },
        ]}
      />

      {/* ── Content ────────────────────────────────────────── */}
      <section className="bg-brand-cream py-24">
        <div className="container-tight">
          <ScrollReveal>
            <p className="text-brand-charcoal/60 text-sm mb-12">
              Dernière mise à jour : avril 2026 — Conforme au RGPD (UE)
              2016/679
            </p>

            <div className="space-y-12">
              {SECTIONS.map((section) => (
                <div key={section.title}>
                  <h2 className="heading-display text-2xl text-brand-night mb-4">
                    {section.title}
                  </h2>
                  <div className="text-brand-charcoal/80 leading-relaxed space-y-3">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
