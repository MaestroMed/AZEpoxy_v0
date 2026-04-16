import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/page-hero";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export const metadata = buildMetadata({
  title: "Conditions Générales de Vente",
  description:
    "Conditions générales de vente d'AZ Époxy — prestations de thermolaquage, sablage et métallisation.",
  path: "/cgv",
});

const SECTIONS = [
  {
    title: "Article 1 — Objet",
    content: (
      <p>
        Les présentes conditions générales de vente (CGV) s&apos;appliquent à
        l&apos;ensemble des prestations de services proposées par AZ Époxy,
        incluant le thermolaquage, le sablage, la métallisation et tout
        traitement de surface associé. Toute commande implique
        l&apos;acceptation sans réserve des présentes CGV.
      </p>
    ),
  },
  {
    title: "Article 2 — Devis et commandes",
    content: (
      <>
        <p>
          Tout devis établi par AZ Époxy est valable pendant une durée de 30
          jours calendaires à compter de sa date d&apos;émission. Passé ce
          délai, AZ Époxy se réserve le droit de modifier les tarifs.
        </p>
        <p>
          La commande est considérée comme confirmée dès réception de
          l&apos;acceptation écrite du client (par email ou signature du devis).
          Toute modification de commande après confirmation devra faire
          l&apos;objet d&apos;un nouveau devis.
        </p>
      </>
    ),
  },
  {
    title: "Article 3 — Tarifs",
    content: (
      <>
        <p>
          Les prix sont exprimés en euros hors taxes (HT). La TVA applicable au
          taux en vigueur (20 %) sera ajoutée au montant HT. Les tarifs sont
          calculés sur devis personnalisé en fonction de la nature des pièces, de
          leur dimension, de la quantité, de la couleur et de la finition
          choisies.
        </p>
        <p>
          Un supplément pourra être appliqué pour les couleurs hors stock RAL,
          les finitions spéciales (texturé, sablé, métallisé) et le service
          express 48h.
        </p>
      </>
    ),
  },
  {
    title: "Article 4 — Délais de réalisation",
    content: (
      <>
        <p>
          Le délai standard de réalisation est de 5 à 10 jours ouvrés à compter
          de la réception des pièces dans notre atelier et de la confirmation de
          la commande.
        </p>
        <p>
          Un service express sous 48 heures est disponible moyennant un
          supplément, sous réserve de la disponibilité de la couleur et de la
          capacité de production. Les délais sont donnés à titre indicatif et ne
          constituent pas un engagement contractuel ferme.
        </p>
      </>
    ),
  },
  {
    title: "Article 5 — Livraison et retrait",
    content: (
      <>
        <p>
          Le retrait des pièces s&apos;effectue sur notre site au 23 Chemin du
          Bac des Aubins, 95820 Bruyères-sur-Oise, aux horaires d&apos;ouverture
          (lundi au vendredi, 8h00 — 18h00).
        </p>
        <p>
          La livraison en Île-de-France est possible sur demande et fera
          l&apos;objet d&apos;un devis complémentaire. Le client est responsable
          de l&apos;emballage et du transport des pièces lors du dépôt et du
          retrait.
        </p>
      </>
    ),
  },
  {
    title: "Article 6 — Conditions de paiement",
    content: (
      <>
        <p>
          Le règlement s&apos;effectue par virement bancaire, chèque ou espèces.
          Sauf accord particulier, le paiement est dû à la livraison ou au
          retrait des pièces.
        </p>
        <p>
          Pour les commandes d&apos;un montant supérieur à 500 € HT, un acompte
          de 30 % pourra être demandé à la confirmation de commande. Tout retard
          de paiement entraînera l&apos;application de pénalités de retard au
          taux légal en vigueur.
        </p>
      </>
    ),
  },
  {
    title: "Article 7 — Garantie",
    content: (
      <>
        <p>
          AZ Époxy garantit ses prestations de thermolaquage contre tout défaut
          d&apos;adhérence, de tenue de couleur ou d&apos;aspect pendant une
          durée de 2 ans à compter de la date de livraison, dans des conditions
          normales d&apos;utilisation.
        </p>
        <p>
          Cette garantie ne couvre pas l&apos;usure normale, les dommages
          résultant d&apos;un usage inapproprié, d&apos;un choc mécanique, de
          produits chimiques agressifs ou d&apos;un défaut du support métallique
          non signalé au préalable par le client.
        </p>
      </>
    ),
  },
  {
    title: "Article 8 — Responsabilité",
    content: (
      <>
        <p>
          La responsabilité d&apos;AZ Époxy est limitée au montant de la
          prestation facturée. AZ Époxy ne saurait être tenue responsable des
          dommages indirects (perte de chiffre d&apos;affaires, préjudice
          commercial, etc.).
        </p>
        <p>
          Le client est tenu de vérifier la conformité des pièces lors du retrait
          ou de la livraison. Toute réclamation doit être formulée par écrit dans
          un délai de 7 jours suivant la réception.
        </p>
      </>
    ),
  },
  {
    title: "Article 9 — Droit applicable et litiges",
    content: (
      <p>
        Les présentes CGV sont soumises au droit français. En cas de litige
        relatif à l&apos;interprétation ou à l&apos;exécution des présentes, et
        à défaut de résolution amiable, le tribunal compétent sera celui de
        Pontoise (Val-d&apos;Oise).
      </p>
    ),
  },
];

export default function CgvPage() {
  return (
    <>
      {/* ── Hero ───────────────────────────────────────────── */}
      <PageHero
        label="Juridique"
        title={
          <>
            Conditions Générales{" "}
            <span className="bg-gradient-ember bg-clip-text text-transparent">
              de Vente
            </span>
          </>
        }
        variant="night"
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "CGV" },
        ]}
      />

      {/* ── Content ────────────────────────────────────────── */}
      <section className="bg-brand-cream py-24">
        <div className="container-tight">
          <ScrollReveal>
            <p className="text-brand-charcoal/60 text-sm mb-12">
              Dernière mise à jour : avril 2026
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
