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
      { label: "Réalisations", href: "/realisations" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
      { label: "Devis gratuit", href: "/devis" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-brand-night-deep text-white">
      <div className="absolute inset-0 bg-industrial-grid-dark opacity-40" />
      <div className="absolute -top-40 left-1/2 h-80 w-[90%] -translate-x-1/2 rounded-full bg-brand-orange/10 blur-3xl" />

      <div className="container-wide relative py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_repeat(4,1fr)]">
          {/* Brand block */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3">
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
            <p className="max-w-sm text-sm leading-relaxed text-white/60">
              Thermolaquage poudre époxy professionnel en Île-de-France.
              Finition premium, 200+ couleurs RAL, cabine 7m, service express
              48h. Depuis notre atelier de 1 800 m² à Bruyères-sur-Oise.
            </p>
            <div className="space-y-3 text-sm">
              <a
                href={SITE.phoneHref}
                className="flex items-center gap-3 text-white/70 transition-colors hover:text-brand-orange"
              >
                <Phone className="h-4 w-4 text-brand-orange" />
                {SITE.phone}
              </a>
              <a
                href={SITE.emailHref}
                className="flex items-center gap-3 text-white/70 transition-colors hover:text-brand-orange"
              >
                <Mail className="h-4 w-4 text-brand-orange" />
                {SITE.email}
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
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-all hover:border-brand-orange hover:bg-brand-orange hover:text-white"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
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
            className="inline-flex items-center gap-2 self-start rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:border-brand-orange hover:bg-brand-orange sm:self-center"
          >
            Voir AZ Construction
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 AZ Époxy — Tous droits réservés</p>
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link
              href="/mentions-legales"
              className="transition-colors hover:text-white"
            >
              Mentions légales
            </Link>
            <Link href="/cgv" className="transition-colors hover:text-white">
              CGV
            </Link>
            <Link
              href="/confidentialite"
              className="transition-colors hover:text-white"
            >
              Confidentialité
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
