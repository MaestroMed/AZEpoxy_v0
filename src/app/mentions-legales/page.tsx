import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export const metadata: Metadata = {
  title: "Mentions Légales",
  description:
    "Mentions légales du site AZ Époxy — thermolaquage et traitement de surface à Bruyères-sur-Oise.",
};

const SECTIONS = [
  {
    title: "Éditeur du site",
    content: (
      <>
        <p>
          <strong>AZ Époxy</strong> — Activité de thermolaquage du groupe AZ
          Construction
        </p>
        <p>23 Chemin du Bac des Aubins, 95820 Bruyères-sur-Oise, France</p>
        <p>Téléphone : 09 71 35 74 96</p>
        <p>Email : contact@azepoxy.fr</p>
        <p>SIRET : En cours d&apos;enregistrement</p>
      </>
    ),
  },
  {
    title: "Directeur de la publication",
    content: (
      <p>
        Le gérant de la société AZ Construction, en qualité de responsable de la
        publication du site azepoxy.fr.
      </p>
    ),
  },
  {
    title: "Hébergeur",
    content: (
      <>
        <p>
          <strong>Vercel Inc.</strong>
        </p>
        <p>340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</p>
        <p>Site web : vercel.com</p>
      </>
    ),
  },
  {
    title: "Propriété intellectuelle",
    content: (
      <>
        <p>
          L&apos;ensemble du contenu du site azepoxy.fr — incluant textes,
          images, logos, icônes, éléments graphiques et logiciels — est la
          propriété exclusive d&apos;AZ Époxy ou de ses partenaires, et est
          protégé par les lois françaises et internationales relatives à la
          propriété intellectuelle.
        </p>
        <p>
          Toute reproduction, représentation, modification, publication ou
          adaptation de tout ou partie des éléments du site, quel que soit le
          moyen ou le procédé utilisé, est interdite sans l&apos;autorisation
          écrite préalable d&apos;AZ Époxy.
        </p>
      </>
    ),
  },
  {
    title: "Limitation de responsabilité",
    content: (
      <>
        <p>
          AZ Époxy s&apos;efforce de fournir sur le site des informations aussi
          précises que possible. Toutefois, elle ne pourra être tenue
          responsable des omissions, inexactitudes ou carences dans la mise à
          jour, qu&apos;elles soient de son fait ou du fait des tiers
          partenaires qui lui fournissent ces informations.
        </p>
        <p>
          Les informations présentes sur le site sont données à titre indicatif
          et sont susceptibles d&apos;évoluer. Elles ne sont en aucun cas
          contractuelles.
        </p>
      </>
    ),
  },
  {
    title: "Crédits photographiques",
    content: (
      <p>
        Images d&apos;illustration : Unsplash (licence libre). Les
        photographies de réalisations sont la propriété d&apos;AZ Époxy.
      </p>
    ),
  },
  {
    title: "Droit applicable",
    content: (
      <p>
        Le présent site et ses conditions d&apos;utilisation sont régis par le
        droit français. En cas de litige, et après échec de toute tentative de
        recherche d&apos;une solution amiable, les tribunaux de Pontoise seront
        seuls compétents.
      </p>
    ),
  },
];

export default function MentionsLegalesPage() {
  return (
    <>
      {/* ── Hero ───────────────────────────────────────────── */}
      <PageHero
        label="Juridique"
        title={
          <>
            Mentions{" "}
            <span className="bg-gradient-ember bg-clip-text text-transparent">
              Légales
            </span>
          </>
        }
        variant="night"
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Mentions légales" },
        ]}
      />

      {/* ── Content ────────────────────────────────────────── */}
      <section className="bg-brand-cream py-24">
        <div className="container-tight">
          <ScrollReveal>
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
