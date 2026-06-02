import Link from "next/link";
import { Instagram, Mail, MapPin, Phone, ExternalLink } from "lucide-react";
import { SITE } from "@/lib/utils";
import {
  DEPARTMENT_NAMES,
  VILLES_FALLBACK,
  type DepartmentCode,
} from "@/lib/villes-data";
import { DEPT_HUB_SLUG } from "@/lib/villes/departments";

const cols = [
  {
    title: "Services",
    links: [
      { label: "Thermolaquage poudre", href: "/services/thermolaquage" },
      { label: "Sablage & grenaillage", href: "/services/sablage" },
      { label: "Finitions spéciales", href: "/services/finitions" },
    ],
  },
  {
    title: "Couleurs",
    links: [
      { label: "Nuancier RAL & NCS", href: "/couleurs-ral" },
      { label: "Configurateur visuel", href: "/configurateur" },
      { label: "Effets Corten", href: "/couleurs-ral/patina" },
      { label: "Effets Métalliques", href: "/couleurs-ral/polaris" },
      { label: "Effets Irisés", href: "/couleurs-ral/dichroic" },
      { label: "Effets Anodisés", href: "/couleurs-ral/sfera" },
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
    title: "Guides & blog",
    links: [
      { label: "Tous les articles", href: "/blog" },
      {
        label: "Thermolaquage vs peinture",
        href: "/blog/thermolaquage-vs-peinture-liquide",
      },
      {
        label: "Guide complet du RAL",
        href: "/blog/couleurs-ral-guide-complet",
      },
      {
        label: "Préparer ses jantes",
        href: "/blog/preparer-jantes-thermolaquage",
      },
      {
        label: "Normes & qualité",
        href: "/blog/normes-qualite-thermolaquage-qualicoat",
      },
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
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(5,1fr)]">
          {/* Brand block */}
          <div className="space-y-6">
            <Link
              href="/"
              className="group inline-flex items-center gap-3.5"
              aria-label="AZ Époxy — Accueil"
            >
              <div className="az-mark-container relative h-12 w-12 shrink-0">
                <div className="absolute inset-0 rounded-[13px] bg-brand-night ring-1 ring-white/10" />
                <div
                  aria-hidden
                  className="az-mark-glow absolute inset-0 rounded-[13px]"
                  style={{
                    background:
                      "radial-gradient(140% 100% at 95% 112%, rgba(232,93,44,0.62) 0%, rgba(200,72,24,0.24) 38%, transparent 72%)",
                  }}
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-[1px] rounded-[12px]"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.07) 0%, transparent 28%)",
                  }}
                />
                <svg
                  className="relative h-full w-full"
                  viewBox="0 0 44 44"
                  fill="none"
                  role="img"
                  aria-label="AZ"
                >
                  <defs>
                    <linearGradient
                      id="az-mark-ember-footer"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="1"
                    >
                      <stop
                        className="az-mark-stop-1"
                        offset="0%"
                        stopColor="#FF9A5C"
                      />
                      <stop
                        className="az-mark-stop-2"
                        offset="55%"
                        stopColor="#E85D2C"
                      />
                      <stop offset="100%" stopColor="#8B2E0A" />
                    </linearGradient>
                    <radialGradient
                      id="az-mark-spark-footer"
                      cx="50%"
                      cy="50%"
                      r="50%"
                    >
                      <stop offset="0%" stopColor="#FFF5E0" />
                      <stop offset="55%" stopColor="#FFB780" stopOpacity="0.85" />
                      <stop offset="100%" stopColor="#FF9A5C" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <path
                    className="az-mark-path az-mark-path--a"
                    d="M 7 33 L 15 9 L 23 33 M 10 26 L 20 26"
                    stroke="#FFFFFF"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    className="az-mark-path az-mark-path--z"
                    d="M 25 11 L 37 11 L 25 31 L 37 31"
                    stroke="url(#az-mark-ember-footer)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    className="az-mark-spark"
                    cx="37"
                    cy="11"
                    r="2.6"
                    fill="url(#az-mark-spark-footer)"
                  />
                </svg>
              </div>
              <span className="font-display text-xl font-black uppercase tracking-[0.02em] leading-none text-white">
                ÉPOXY
              </span>
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
              Finition premium, 200+ couleurs RAL & NCS, cabine 7 × 3 × 4 m,
              service express 48h. Depuis notre atelier de 1 800 m² à
              Bruyères-sur-Oise.
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

        {/* Villes desservies — super-mesh interne. Liste compacte des
            communes par département. Donne à Google ~76 inbound links
            sitewide vers les pages thermolaquage-[ville]. */}
        <section
          aria-label="Villes desservies en Île-de-France"
          className="mt-16 border-t border-white/10 pt-10"
        >
          <h3 className="mb-6 text-[11px] font-bold uppercase tracking-[0.22em] text-brand-orange">
            Thermolaquage en Île-de-France & Oise
          </h3>
          <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {(["95", "75", "92", "93", "94", "78", "91", "77", "60"] as DepartmentCode[])
              .map((code) => {
                const villes = VILLES_FALLBACK.filter(
                  (v) => v.departmentCode === code,
                );
                if (villes.length === 0) return null;
                const deptSlug = DEPT_HUB_SLUG[code];
                return (
                  <div key={code}>
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/55">
                      {deptSlug ? (
                        <Link
                          href={`/thermolaquage-${deptSlug}`}
                          className="transition-colors hover:text-brand-orange"
                        >
                          {DEPARTMENT_NAMES[code]} ({code}) →
                        </Link>
                      ) : (
                        <>
                          {DEPARTMENT_NAMES[code]} ({code})
                        </>
                      )}
                    </p>
                    <ul className="flex flex-wrap gap-x-2.5 gap-y-1.5 text-[12px]">
                      {villes.map((v) => (
                        <li key={v.slug}>
                          <Link
                            href={`/thermolaquage-${v.slug}`}
                            className="text-white/55 transition-colors hover:text-brand-orange"
                          >
                            {v.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
          </div>
        </section>

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
