"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { cn, SITE } from "@/lib/utils";
import { NavPreviewLink } from "@/components/nuee/nav-preview-link";
import { MobileMegaMenu } from "@/components/layout/mobile-mega-menu";

function isSectionActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

const navGroups = [
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Thermolaquage poudre", href: "/services/thermolaquage" },
      { label: "Sablage & grenaillage", href: "/services/sablage" },
      { label: "Finitions spéciales", href: "/services/finitions" },
    ],
  },
  {
    label: "Couleurs",
    href: "/couleurs-ral",
    children: [
      { label: "Nuancier RAL & NCS", href: "/couleurs-ral" },
      { label: "Configurateur visuel", href: "/configurateur" },
      { label: "Effets Corten", href: "/couleurs-ral/patina" },
      { label: "Effets Métalliques", href: "/couleurs-ral/polaris" },
      { label: "Effets Irisés", href: "/couleurs-ral/dichroic" },
      { label: "Effets Anodisés", href: "/couleurs-ral/sfera" },
    ],
  },
  {
    label: "Spécialités",
    href: "/specialites/jantes",
    children: [
      { label: "Jantes auto", href: "/specialites/jantes" },
      { label: "Portail & ferronnerie", href: "/specialites/portail" },
      { label: "Sablage & aérogommage", href: "/specialites/sablage-aerogommage" },
      { label: "Moto Art", href: "/specialites/moto" },
      { label: "Pièces auto", href: "/specialites/voiture" },
      { label: "Pièces métalliques", href: "/specialites/pieces" },
    ],
  },
  { label: "Réalisations", href: "/realisations" },
  {
    label: "Zones",
    href: "/villes",
    children: [
      { label: "Toutes les villes", href: "/villes" },
      { label: "Val-d'Oise (95)", href: "/thermolaquage-val-d-oise" },
      { label: "Hauts-de-Seine (92)", href: "/thermolaquage-hauts-de-seine" },
      { label: "Seine-Saint-Denis (93)", href: "/thermolaquage-seine-saint-denis" },
      { label: "Val-de-Marne (94)", href: "/thermolaquage-val-de-marne" },
      { label: "Yvelines (78)", href: "/thermolaquage-yvelines" },
      { label: "Essonne (91)", href: "/thermolaquage-essonne" },
      { label: "Seine-et-Marne (77)", href: "/thermolaquage-seine-et-marne" },
      { label: "Oise (60)", href: "/thermolaquage-oise" },
      { label: "Paris (75)", href: "/thermolaquage-paris" },
    ],
  },
  { label: "Pros", href: "/professionnels" },
  {
    label: "Ressources",
    href: "/faq",
    children: [
      { label: "FAQ", href: "/faq" },
      { label: "Glossaire technique", href: "/glossaire" },
      { label: "Blog", href: "/blog" },
      { label: "À propos", href: "/a-propos" },
    ],
  },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 md:top-9",
        scrolled || open
          ? "bg-brand-night/95 backdrop-blur-xl shadow-lg shadow-black/10"
          : "bg-transparent"
      )}
    >
      {/* Thin gradient line under the header — visible only when
          scrolled, signals "the header is now a shelf". */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 h-px origin-center bg-gradient-to-r from-transparent via-brand-orange/40 to-transparent transition-opacity duration-500",
          scrolled || open ? "opacity-100" : "opacity-0"
        )}
      />
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[60] focus:rounded focus:bg-brand-orange focus:px-4 focus:py-2 focus:text-white">
        Aller au contenu principal
      </a>
      <div className="container-wide flex h-20 items-center justify-between">
        <Link
          href="/"
          className="group flex items-center gap-3.5"
          data-magnetic
          aria-label="AZ Époxy — Accueil"
        >
          {/* Mark — geometric AZ monogram on a dark squircle.
              4 animation layers : stroke-draw on mount, ember gradient
              drift idle, underglow breath idle, hover spark + lift.
              All gracefully degraded for prefers-reduced-motion. */}
          <div className="az-mark-container relative h-11 w-11 shrink-0">
            {/* Base squircle */}
            <div className="absolute inset-0 rounded-[12px] bg-brand-night-deep ring-1 ring-white/10" />
            {/* Ember underglow — kiln-door-ajar, breath animation */}
            <div
              aria-hidden
              className="az-mark-glow absolute inset-0 rounded-[12px]"
              style={{
                background:
                  "radial-gradient(140% 100% at 95% 112%, rgba(232,93,44,0.62) 0%, rgba(200,72,24,0.24) 38%, transparent 72%)",
              }}
            />
            {/* Top-edge bevel highlight */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-[1px] rounded-[11px]"
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
                {/* Ember linear gradient — first two stops drift in
                    color over 8s for a subtle "living ember" feel. */}
                <linearGradient
                  id="az-mark-ember"
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
                {/* Spark radial — appears at Z's top-right on hover. */}
                <radialGradient id="az-mark-spark" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFF5E0" />
                  <stop offset="55%" stopColor="#FFB780" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#FF9A5C" stopOpacity="0" />
                </radialGradient>
              </defs>
              {/* A — white, draws first (120ms delay) */}
              <path
                className="az-mark-path az-mark-path--a"
                d="M 7 33 L 15 9 L 23 33 M 10 26 L 20 26"
                stroke="#FFFFFF"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Z — ember, draws second (420ms delay) */}
              <path
                className="az-mark-path az-mark-path--z"
                d="M 25 11 L 37 11 L 25 31 L 37 31"
                stroke="url(#az-mark-ember)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Spark — fades in + scales up at the top of Z on hover */}
              <circle
                className="az-mark-spark"
                cx="37"
                cy="11"
                r="2.6"
                fill="url(#az-mark-spark)"
              />
            </svg>
          </div>
          <span className="font-display text-lg font-black uppercase tracking-[0.02em] leading-none text-white">
            ÉPOXY
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navGroups.map((group) => (
            <div
              key={group.label}
              className="relative"
              onMouseEnter={() => setActiveGroup(group.label)}
              onMouseLeave={() => setActiveGroup(null)}
            >
              <Link
                href={group.href}
                aria-current={
                  isSectionActive(pathname, group.href) ? "page" : undefined
                }
                className={cn(
                  "flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors hover:text-white",
                  isSectionActive(pathname, group.href)
                    ? "text-white after:mx-auto after:mt-0.5 after:block after:h-0.5 after:w-6 after:rounded-full after:bg-brand-orange"
                    : "text-white/80"
                )}
              >
                {group.label}
                {group.children && (
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                )}
              </Link>
              {group.children && activeGroup === group.label && (
                <div className="absolute left-0 top-full pt-2">
                  <div className="min-w-[240px] overflow-hidden rounded-xl border border-white/10 bg-brand-night-deep/95 p-2 shadow-2xl backdrop-blur-xl">
                    {group.children.map((child) => (
                      <NavPreviewLink
                        key={child.href}
                        href={child.href}
                        className="block rounded-lg px-4 py-2.5 text-sm text-white/80 transition-colors hover:bg-brand-orange/20 hover:text-white"
                      >
                        {child.label}
                      </NavPreviewLink>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {/* ⌘K hint — fires the command palette on click (same shortcut too). */}
          <button
            type="button"
            aria-label="Chercher un RAL — ouvrir la palette de commandes"
            onClick={() => {
              window.dispatchEvent(
                new KeyboardEvent("keydown", { key: "k", metaKey: true, ctrlKey: true }),
              );
            }}
            className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-white/60 transition-all hover:border-white/25 hover:text-white/90"
          >
            <span className="uppercase tracking-[0.12em]">Chercher un RAL</span>
            <kbd
              aria-hidden
              className="rounded border border-white/15 bg-white/[0.07] px-1.5 py-0.5 font-mono text-[10px] text-white/70 group-hover:border-white/30"
            >
              ⌘K
            </kbd>
          </button>
          <a
            href={SITE.phoneHref}
            className="flex items-center gap-2 text-sm font-semibold text-white/90 transition-colors hover:text-brand-orange"
          >
            <Phone className="h-4 w-4" />
            {SITE.phone}
          </a>
          <Link
            href="/devis"
            className="rounded-full bg-brand-orange-dark px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-orange/30 transition-all hover:bg-[#A63A12] hover:-translate-y-0.5"
          >
            Devis gratuit
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          aria-label="Menu"
          onClick={() => setOpen(!open)}
          className="relative z-50 rounded-full border border-white/20 bg-white/5 p-2.5 text-white lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile mega menu — fullscreen Apple-like takeover with image tiles
          and a 2-level sliding panel. */}
      <MobileMegaMenu
        open={open}
        onClose={() => setOpen(false)}
        pathname={pathname}
      />
    </header>
  );
}
