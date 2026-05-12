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
      { label: "Moto Art", href: "/specialites/moto" },
      { label: "Pièces auto", href: "/specialites/voiture" },
      { label: "Pièces métalliques", href: "/specialites/pieces" },
    ],
  },
  { label: "Réalisations", href: "/realisations" },
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
          {/* Mark — geometric AZ monogram on a dark squircle. The Z's
              strokes carry the ember gradient (the thermolaquage
              signal); the A stays white for contrast and balance.
              Soft ember underglow from the bottom-right reads as
              "kiln door cracked open". */}
          <div className="relative h-11 w-11 shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]">
            <div className="absolute inset-0 rounded-[12px] bg-brand-night-deep ring-1 ring-white/10" />
            <div
              aria-hidden
              className="absolute inset-0 rounded-[12px] animate-ember-pulse"
              style={{
                background:
                  "radial-gradient(140% 100% at 95% 112%, rgba(232,93,44,0.55) 0%, rgba(200,72,24,0.22) 38%, transparent 72%)",
              }}
            />
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
                <linearGradient
                  id="az-mark-ember"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#FF9A5C" />
                  <stop offset="55%" stopColor="#E85D2C" />
                  <stop offset="100%" stopColor="#8B2E0A" />
                </linearGradient>
              </defs>
              <path
                d="M 8 33 L 16 10 L 24 33 M 11 26 L 21 26"
                stroke="#FFFFFF"
                strokeWidth="2.4"
                strokeLinecap="square"
                strokeLinejoin="miter"
              />
              <path
                d="M 26 12 L 37 12 L 26 32 L 37 32"
                stroke="url(#az-mark-ember)"
                strokeWidth="2.4"
                strokeLinecap="square"
                strokeLinejoin="miter"
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
            aria-label="Ouvrir la palette de commandes"
            onClick={() => {
              window.dispatchEvent(
                new KeyboardEvent("keydown", { key: "k", metaKey: true, ctrlKey: true }),
              );
            }}
            className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-white/60 transition-all hover:border-white/25 hover:text-white/90"
          >
            <span className="uppercase tracking-[0.12em]">Chercher un RAL</span>
            <kbd className="rounded border border-white/15 bg-white/[0.07] px-1.5 py-0.5 font-mono text-[10px] text-white/70 group-hover:border-white/30">
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
            className="rounded-full bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-orange/30 transition-all hover:bg-brand-orange-dark hover:-translate-y-0.5"
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
