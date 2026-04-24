import Link from "next/link";
import { Instagram, Mail, MapPin, Phone, ExternalLink } from "lucide-react";
import { SITE } from "@/lib/utils";

const cols = [
  {
    title: "Services",
    links: [
      { label: "Thermolaquage poudre", href: "/services/thermolaquage" },
      { label: "Sablage & grenaillage", href: "/services/sablage" },
      { label: "Métallisation", href: "/services/metallisation" },
      { label: "Finitions spéciales", href: "/services/finitions" },
    ],
  },
  {
    title: "Couleurs",
    links: [
      { label: "Nuancier RAL 209+", href: "/couleurs-ral" },
      { label: "Configurateur visuel", href: "/configurateur" },
      { label: "Collection Patina", href: "/couleurs-ral/patina" },
      { label: "Collection Polaris", href: "/couleurs-ral/polaris" },
      { label: "Collection Dichroic", href: "/couleurs-ral/dichroic" },
      { label: "Collection Sfera", href: "/couleurs-ral/sfera" },
    ],
  },
  {
    title: "Spécialités",
    links: [
      { label: "Jantes auto", href: "/specialites/jantes" },
      { label: "Moto Art", href: "/specialites/moto" },
      { label: "Pièces auto", href: "/specialites/voiture" },
      { label: "Pièces métalliques", href: "/specialites/pieces" },
    ],
  },
  {
    title: "Entreprise",
    links: [
      { label: "À propos", href: "/a-propos" },
      { label: "Espace pro", href: "/professionnels" },
      { label: "Réalisations", href: "/realisations" },
      { label: "Glossaire technique", href: "/glossaire" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
      { label: "Devis gratuit", href: "/devis" },
    ],
  },
];

// Lien avec underline animé gauche → droite au hover (signature award).
function LinkUnderline({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group relative inline-flex items-center text-sm text-white/65 transition-colors hover:text-white"
    >
      <span>{children}</span>
      <span
        aria-hidden
        className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-brand-orange/60 transition-transform duration-300 ease-out group-hover:scale-x-100"
      />
    </Link>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden bg-brand-night-deep text-white">
      <div className="absolute inset-0 bg-industrial-grid-dark opacity-40" />
      <div className="absolute -top-40 left-1/2 h-80 w-[90%] -translate-x-1/2 rounded-full bg-brand-orange/10 blur-3xl" />

      <div className="container-wide relative py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_repeat(4,1fr)]">
          {/* Brand block */}
          <div className="space-y-6">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="relative h-11 w-11 overflow-hidden rounded-md bg-gradient-ember shadow-lg shadow-brand-orange/40">
                <span className="absolute inset-0 flex items-center justify-center font-display text-xl font-black text-white">
                  AZ
                </span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-xl font-black text-white tracking-tight">
                  ÉPOXY
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-orange">
                  Thermolaquage
                </span>
              </div>
            </Link>

            {/* Status indicator — atelier ouvert. */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] font-medium text-white/75">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-brand-success/60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-success" />
              </span>
              <span>Atelier ouvert · Bruyères-sur-Oise</span>
            </div>

            <p className="max-w-sm text-sm leading-relaxed text-white/60">
              Thermolaquage poudre époxy professionnel en Île-de-France.
              Finition premium, 200+ couleurs RAL, cabine 7m, service express
              48h. Depuis notre atelier de 1 800 m² à Bruyères-sur-Oise.
            </p>

            <div className="space-y-3 text-sm">
              <a
                href={SITE.phoneHref}
                className="group flex items-center gap-3 text-white/70 transition-colors hover:text-brand-orange"
              >
                <Phone className="h-4 w-4 text-brand-orange" />
                <span className="relative">
                  {SITE.phone}
                  <span
                    aria-hidden
                    className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-brand-orange transition-transform duration-300 ease-out group-hover:scale-x-100"
                  />
                </span>
              </a>
              <a
                href={SITE.emailHref}
                className="group flex items-center gap-3 text-white/70 transition-colors hover:text-brand-orange"
              >
                <Mail className="h-4 w-4 text-brand-orange" />
                <span className="relative">
                  {SITE.email}
                  <span
                    aria-hidden
                    className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-brand-orange transition-transform duration-300 ease-out group-hover:scale-x-100"
                  />
                </span>
              </a>
              <div className="flex items-start gap-3 text-white/70">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-orange" />
                <span>
                  {SITE.address.street}
                  <br />
                  {SITE.address.zip} {SITE.address.city}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={SITE.social.instagram}
                aria-label="Instagram AZ Époxy"
                data-magnetic
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-all hover:border-brand-orange hover:bg-brand-orange hover:text-white"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="mb-5 text-[11px] font-bold uppercase tracking-[0.22em] text-brand-orange">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <LinkUnderline href={link.href}>{link.label}</LinkUnderline>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Parent company link */}
        <div className="mt-16 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange">
              Groupe AZ
            </p>
            <p className="mt-1 text-sm text-white/80">
              Besoin de métallerie sur mesure ? Portails, garde-corps,
              escaliers, verrières — découvrez notre activité métallerie.
            </p>
          </div>
          <a
            href={SITE.parent.url}
            target="_blank"
            rel="noopener noreferrer"
            data-magnetic
            className="inline-flex items-center gap-2 self-start rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:border-brand-orange hover:bg-brand-orange sm:self-center"
          >
            Voir AZ Construction
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} AZ Époxy — Tous droits réservés
            <span className="mx-2 text-white/20">·</span>
            <span className="text-white/40">Bruyères-sur-Oise · Val-d&apos;Oise</span>
          </p>
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <LinkUnderline href="/mentions-legales">Mentions légales</LinkUnderline>
            <LinkUnderline href="/cgv">CGV</LinkUnderline>
            <LinkUnderline href="/confidentialite">Confidentialité</LinkUnderline>
          </nav>
        </div>
      </div>

      {/* Giant typographic watermark — signature award-tier. S'étale
          sur toute la largeur, presque invisible mais donne de la
          profondeur. Masqué pour les screen readers (aria-hidden). */}
      <div
        aria-hidden
        className="pointer-events-none relative overflow-hidden pb-6 pt-4"
      >
        <div className="container-wide">
          <p
            className="select-none font-display text-[clamp(5rem,22vw,18rem)] font-black leading-none tracking-[-0.04em]"
            style={{
              background:
                "linear-gradient(180deg, rgba(232,93,44,0.08) 0%, rgba(255,255,255,0.0) 70%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            AZ ÉPOXY
          </p>
        </div>
      </div>
    </footer>
  );
}
