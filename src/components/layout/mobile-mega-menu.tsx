"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Phone,
  Search,
  X,
} from "lucide-react";
import { cn, SITE } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Data — group definitions + per-tile photographic backdrop                  */
/* -------------------------------------------------------------------------- */

export type MobileNavChild = {
  label: string;
  href: string;
  image?: string;
  tagline?: string;
};

export type MobileNavGroup = {
  label: string;
  href: string;
  image: string;
  tagline: string;
  children?: MobileNavChild[];
};

export const MOBILE_NAV_GROUPS: MobileNavGroup[] = [
  {
    label: "Services",
    href: "/services",
    image: "/images/heros/services-thermolaquage.webp",
    tagline: "Thermolaquage · Sablage · Finitions",
    children: [
      {
        label: "Thermolaquage poudre",
        href: "/services/thermolaquage",
        image: "/images/services/thermolaquage.webp",
        tagline: "Normes Qualicoat / ISO 12944 — 200+ teintes RAL & NCS",
      },
      {
        label: "Sablage & grenaillage",
        href: "/services/sablage",
        image: "/images/services/sablage.webp",
        tagline: "Préparation SA 2.5 · cabine 7 × 3 × 4 m",
      },
      {
        label: "Finitions spéciales",
        href: "/services/finitions",
        image: "/images/services/finitions.webp",
        tagline: "Mat, satiné, texturé, mouchetés, effets architecturaux",
      },
    ],
  },
  {
    label: "Couleurs",
    href: "/couleurs-ral",
    image: "/images/heros/services-finitions.webp",
    tagline: "200+ teintes RAL & NCS · 4 collections d'effets",
    children: [
      {
        label: "Nuancier RAL complet",
        href: "/couleurs-ral",
        image: "/images/heros/services-finitions.webp",
        tagline: "RAL Classic + Natural Color System",
      },
      {
        label: "Configurateur visuel",
        href: "/configurateur",
        image: "/images/heros/services-thermolaquage.webp",
        tagline: "Visualisez la couleur sur votre pièce",
      },
      {
        label: "Effets Corten",
        href: "/couleurs-ral/patina",
        image: "/images/collections/patina.webp",
        tagline: "Aspect oxydé & métal patiné",
      },
      {
        label: "Effets Métalliques",
        href: "/couleurs-ral/polaris",
        image: "/images/collections/polaris.webp",
        tagline: "Reflets structurés haute brillance",
      },
      {
        label: "Effets Irisés",
        href: "/couleurs-ral/dichroic",
        image: "/images/collections/dichroic.webp",
        tagline: "Reflets multi-tons selon l'angle",
      },
      {
        label: "Effets Anodisés",
        href: "/couleurs-ral/sfera",
        image: "/images/collections/sfera.webp",
        tagline: "Teintes profondes haute densité",
      },
    ],
  },
  {
    label: "Spécialités",
    href: "/specialites/jantes",
    image: "/images/heros/specialites-jantes.webp",
    tagline: "Jantes · Moto · Pièces auto · Industriel",
    children: [
      {
        label: "Jantes auto",
        href: "/specialites/jantes",
        image: "/images/specialites/jantes.webp",
        tagline: "Rénovation & personnalisation alliage",
      },
      {
        label: "Moto Art",
        href: "/specialites/moto",
        image: "/images/specialites/moto.webp",
        tagline: "Cadres, bras oscillants, jantes — custom",
      },
      {
        label: "Pièces auto",
        href: "/specialites/voiture",
        image: "/images/specialites/voiture.webp",
        tagline: "Étriers, caches moteur, arceaux",
      },
      {
        label: "Pièces métalliques",
        href: "/specialites/pieces",
        image: "/images/specialites/pieces.webp",
        tagline: "Portails, mobilier, charpentes",
      },
    ],
  },
  {
    label: "Réalisations",
    href: "/realisations",
    image: "/images/heros/realisations.webp",
    tagline: "16 pièces · catalogue raisonné",
  },
  {
    label: "Professionnels",
    href: "/professionnels",
    image: "/images/heros/contact-shared.webp",
    tagline: "Compte pro · tarifs dégressifs · livraison",
  },
  {
    label: "Ressources",
    href: "/faq",
    image: "/images/heros/blog.webp",
    tagline: "Blog · FAQ · Glossaire · À propos",
    children: [
      {
        label: "Blog",
        href: "/blog",
        image: "/images/heros/blog.webp",
        tagline: "Guides techniques & retours d'expérience",
      },
      {
        label: "FAQ",
        href: "/faq",
        image: "/images/heros/faq.webp",
        tagline: "Réponses aux questions fréquentes",
      },
      {
        label: "Glossaire",
        href: "/glossaire",
        image: "/images/heros/faq.webp",
        tagline: "Lexique technique du thermolaquage",
      },
      {
        label: "À propos",
        href: "/a-propos",
        image: "/images/heros/a-propos.webp",
        tagline: "Notre atelier · histoire · équipe",
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

interface MobileMegaMenuProps {
  open: boolean;
  onClose: () => void;
  pathname: string | null;
}

export function MobileMegaMenu({ open, onClose, pathname }: MobileMegaMenuProps) {
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  // Reset to root view when the menu closes
  useEffect(() => {
    if (!open) {
      // Delay to let the close animation finish before snapping back.
      const t = setTimeout(() => setActiveGroup(null), 350);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (activeGroup) setActiveGroup(null);
        else onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, activeGroup, onClose]);

  const current = activeGroup
    ? MOBILE_NAV_GROUPS.find((g) => g.label === activeGroup)
    : null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-40 overflow-hidden lg:hidden",
        "transition-[opacity,visibility] duration-500 ease-out",
        open
          ? "pointer-events-auto visible opacity-100"
          : "pointer-events-none invisible opacity-0",
      )}
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
      aria-label="Menu principal"
    >
      {/* Backdrop — soft photographic moodboard behind the menu, fades into
          deep brand-night so the type stays legible. */}
      <div
        className="absolute inset-0 bg-brand-night"
        aria-hidden="true"
      />
      <Image
        src={current?.image ?? "/images/heros/services-thermolaquage.webp"}
        alt=""
        fill
        priority
        sizes="100vw"
        className={cn(
          "object-cover opacity-30 transition-opacity duration-700",
          open ? "scale-100" : "scale-105",
        )}
        style={{ transition: "transform 1.2s cubic-bezier(0.22, 1, 0.36, 1)" }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-brand-night/85 via-brand-night/75 to-brand-night/95 backdrop-blur-xl"
      />

      {/* Sliding panel container — two stacked views slide horizontally. */}
      <div className="relative flex h-full w-full overflow-hidden">
        <div
          className="flex h-full w-[200%] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            transform: activeGroup ? "translateX(-50%)" : "translateX(0)",
          }}
        >
          {/* ── View 1 : Root grid of group tiles ───────────────────── */}
          <div className="flex h-full w-1/2 flex-col">
            <div className="flex-1 overflow-y-auto px-5 pb-6 pt-24">
              <ul className="flex flex-col gap-3">
                {MOBILE_NAV_GROUPS.map((group, i) => (
                  <li
                    key={group.label}
                    style={{
                      transitionDelay: open ? `${80 + i * 50}ms` : "0ms",
                      opacity: open ? 1 : 0,
                      transform: open ? "translateY(0)" : "translateY(12px)",
                      transition:
                        "opacity 480ms cubic-bezier(0.22, 1, 0.36, 1), transform 480ms cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                  >
                    <GroupTile
                      group={group}
                      active={
                        pathname
                          ? pathname === group.href ||
                            pathname.startsWith(`${group.href}/`)
                          : false
                      }
                      onOpenChildren={
                        group.children
                          ? () => setActiveGroup(group.label)
                          : undefined
                      }
                      onNavigate={() => onClose()}
                    />
                  </li>
                ))}
              </ul>

              {/* RAL search — Apple-style command pill */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  // Small delay so the close animation completes before the
                  // command palette pops in.
                  setTimeout(() => {
                    window.dispatchEvent(
                      new KeyboardEvent("keydown", {
                        key: "k",
                        metaKey: true,
                        ctrlKey: true,
                      }),
                    );
                  }, 350);
                }}
                className="mt-6 flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-left text-white/70 transition-all active:bg-white/[0.08]"
                style={{
                  transitionDelay: open ? `${80 + MOBILE_NAV_GROUPS.length * 50}ms` : "0ms",
                  opacity: open ? 1 : 0,
                  transform: open ? "translateY(0)" : "translateY(12px)",
                  transition:
                    "opacity 480ms cubic-bezier(0.22, 1, 0.36, 1), transform 480ms cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                <Search className="h-4 w-4 text-brand-orange" />
                <span className="flex-1 text-sm font-medium">
                  Chercher un RAL, une teinte…
                </span>
                <kbd className="rounded border border-white/15 bg-white/[0.07] px-1.5 py-0.5 font-mono text-[10px] text-white/60">
                  ⌘K
                </kbd>
              </button>
            </div>

            {/* Sticky footer CTAs */}
            <FooterCTAs open={open} onClose={onClose} />
          </div>

          {/* ── View 2 : Sub-nav (children of `current`) ────────────── */}
          <div className="flex h-full w-1/2 flex-col">
            <div className="flex items-center gap-3 px-5 pt-24 pb-2">
              <button
                type="button"
                onClick={() => setActiveGroup(null)}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-medium text-white/80 transition-colors active:bg-white/[0.08]"
                aria-label="Retour au menu principal"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour
              </button>
              <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                {current?.label}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-6 pt-4">
              {current?.children && (
                <>
                  <Link
                    href={current.href}
                    onClick={onClose}
                    className="mb-4 flex items-center justify-between rounded-2xl border border-brand-orange/30 bg-brand-orange/10 px-5 py-3.5 text-white"
                  >
                    <span className="flex flex-col">
                      <span className="text-xs font-medium uppercase tracking-[0.12em] text-brand-orange">
                        Vue d&apos;ensemble
                      </span>
                      <span className="text-sm font-semibold">
                        Tout {current.label.toLowerCase()}
                      </span>
                    </span>
                    <ArrowRight className="h-4 w-4 text-brand-orange" />
                  </Link>

                  <ul className="flex flex-col gap-3">
                    {current.children.map((child, i) => (
                      <li
                        key={child.href}
                        style={{
                          transitionDelay: activeGroup ? `${80 + i * 40}ms` : "0ms",
                          opacity: activeGroup ? 1 : 0,
                          transform: activeGroup
                            ? "translateY(0)"
                            : "translateY(12px)",
                          transition:
                            "opacity 380ms cubic-bezier(0.22, 1, 0.36, 1), transform 380ms cubic-bezier(0.22, 1, 0.36, 1)",
                        }}
                      >
                        <ChildTile
                          child={child}
                          active={pathname === child.href}
                          onNavigate={onClose}
                        />
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <FooterCTAs open={open} onClose={onClose} />
          </div>
        </div>
      </div>

      {/* Floating close button (top-right) — high z so it sits above
          both panels. */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Fermer le menu"
        className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white backdrop-blur-md transition-colors active:bg-white/[0.12]"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Tile components                                                            */
/* -------------------------------------------------------------------------- */

function GroupTile({
  group,
  active,
  onOpenChildren,
  onNavigate,
}: {
  group: MobileNavGroup;
  active: boolean;
  onOpenChildren?: () => void;
  onNavigate: () => void;
}) {
  // Tile is a Link to the section landing page, but if children exist we
  // intercept the tap on a side chevron to slide into the sub-view.
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02] shadow-sm",
        active && "ring-1 ring-brand-orange/40",
      )}
    >
      <Image
        src={group.image}
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-50 transition-transform duration-500 group-hover:scale-105"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-brand-night/85 via-brand-night/55 to-brand-night/20"
      />

      <div className="relative flex items-stretch">
        <Link
          href={group.href}
          onClick={onNavigate}
          className="flex-1 px-5 py-5"
        >
          <p className="font-display text-xl font-black leading-tight text-white">
            {group.label}
          </p>
          <p className="mt-1 text-[12px] leading-snug text-white/70">
            {group.tagline}
          </p>
          {active && (
            <span className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-orange">
              <span className="h-1 w-1 rounded-full bg-brand-orange" />
              Vous êtes ici
            </span>
          )}
        </Link>

        {onOpenChildren && (
          <button
            type="button"
            onClick={onOpenChildren}
            aria-label={`Voir les sous-rubriques de ${group.label}`}
            className="relative flex w-14 items-center justify-center border-l border-white/8 bg-white/[0.02] text-white/70 transition-colors active:bg-white/[0.08]"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}

function ChildTile({
  child,
  active,
  onNavigate,
}: {
  child: MobileNavChild;
  active: boolean;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={child.href}
      onClick={onNavigate}
      className={cn(
        "group relative flex overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02]",
        active && "ring-1 ring-brand-orange/50",
      )}
    >
      {child.image && (
        <div className="relative aspect-[4/3] w-28 shrink-0 overflow-hidden">
          <Image
            src={child.image}
            alt=""
            fill
            sizes="112px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-transparent to-brand-night/40"
          />
        </div>
      )}
      <div className="flex flex-1 items-center justify-between gap-3 px-4 py-3">
        <div>
          <p className="font-display text-base font-bold leading-tight text-white">
            {child.label}
          </p>
          {child.tagline && (
            <p className="mt-1 text-[11px] leading-snug text-white/55">
              {child.tagline}
            </p>
          )}
        </div>
        <ArrowRight
          className={cn(
            "h-4 w-4 shrink-0 transition-colors",
            active ? "text-brand-orange" : "text-white/40",
          )}
        />
      </div>
    </Link>
  );
}

function FooterCTAs({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className="border-t border-white/10 bg-brand-night/85 px-5 pb-[max(env(safe-area-inset-bottom),20px)] pt-4 backdrop-blur-lg"
      style={{
        transitionDelay: open ? "320ms" : "0ms",
        opacity: open ? 1 : 0,
        transform: open ? "translateY(0)" : "translateY(8px)",
        transition:
          "opacity 500ms cubic-bezier(0.22, 1, 0.36, 1), transform 500ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <div className="flex gap-3">
        <a
          href={SITE.phoneHref}
          onClick={onClose}
          aria-label={`Appeler ${SITE.phone}`}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-white active:bg-white/[0.08]"
        >
          <Phone className="h-5 w-5 text-brand-orange" />
        </a>
        <Link
          href="/devis"
          onClick={onClose}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-orange py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-orange/30 active:bg-brand-orange-dark"
        >
          Devis gratuit sous 24h
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <p className="mt-3 text-center text-[10px] uppercase tracking-[0.18em] text-white/35">
        Thermolaquage premium · Île-de-France
      </p>
    </div>
  );
}
