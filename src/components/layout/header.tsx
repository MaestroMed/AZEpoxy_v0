"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { cn, SITE } from "@/lib/utils";
import { NavPreviewLink } from "@/components/nuee/nav-preview-link";

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
      { label: "Métallisation", href: "/services/metallisation" },
      { label: "Finitions spéciales", href: "/services/finitions" },
    ],
  },
  {
    label: "Couleurs",
    href: "/couleurs-ral",
    children: [
      { label: "Nuancier RAL complet", href: "/couleurs-ral" },
      { label: "Collection Patina", href: "/couleurs-ral/patina" },
      { label: "Collection Polaris", href: "/couleurs-ral/polaris" },
      { label: "Collection Dichroic", href: "/couleurs-ral/dichroic" },
      { label: "Collection Sfera", href: "/couleurs-ral/sfera" },
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
  { label: "FAQ", href: "/faq" },
  { label: "À propos", href: "/a-propos" },
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
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled || open
          ? "bg-brand-night/95 backdrop-blur-xl shadow-lg shadow-black/10"
          : "bg-transparent"
      )}
    >
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[60] focus:rounded focus:bg-brand-orange focus:px-4 focus:py-2 focus:text-white">
        Aller au contenu principal
      </a>
      <div className="container-wide flex h-20 items-center justify-between">
        <Link href="/" className="group flex items-center gap-3" data-magnetic>
          <div className="relative h-10 w-10 overflow-hidden rounded-md bg-gradient-ember shadow-lg shadow-brand-orange/40 transition-all duration-500 group-hover:shadow-brand-orange/70 group-hover:shadow-xl">
            {/* AZ label avec transition de scale subtle */}
            <span className="absolute inset-0 z-10 flex items-center justify-center font-display text-xl font-black text-white transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110">
              AZ
            </span>
            {/* Ember pulse existant */}
            <div className="absolute inset-0 animate-ember-pulse bg-gradient-heat opacity-60" />
            {/* Conic sweep au hover — rotation rapide d'un gradient
                conique quand la souris survole, comme une étincelle
                qui parcourt l'icône. */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background:
                  "conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(255,255,255,0.28) 45deg, transparent 90deg, transparent 360deg)",
                animation: "logo-sweep 1.6s linear infinite",
              }}
            />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-lg font-black text-white tracking-tight transition-colors duration-300 group-hover:text-white">
              ÉPOXY
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-orange transition-all duration-300 group-hover:tracking-[0.24em]">
              Thermolaquage
            </span>
          </div>
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
            <span className="uppercase tracking-[0.12em]">Chercher</span>
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

      {/* Mobile menu — fullscreen takeover avec stagger reveal. */}
      <div
        className={cn(
          "fixed inset-0 top-20 z-40 overflow-y-auto bg-brand-night-deep/98 backdrop-blur-2xl lg:hidden",
          "transition-[opacity,transform] duration-500 ease-out",
          open
            ? "pointer-events-auto opacity-100 translate-y-0"
            : "pointer-events-none opacity-0 -translate-y-4"
        )}
        aria-hidden={!open}
      >
        <div className="container-wide flex min-h-full flex-col justify-between pb-10 pt-8">
          <nav className="flex flex-col gap-1">
            {navGroups.map((group, gi) => (
              <div
                key={group.label}
                className="py-1"
                style={{
                  transitionDelay: open ? `${60 + gi * 40}ms` : "0ms",
                  opacity: open ? 1 : 0,
                  transform: open ? "translateX(0)" : "translateX(-12px)",
                  transition:
                    "opacity 420ms cubic-bezier(0.22, 1, 0.36, 1), transform 420ms cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                <Link
                  href={group.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-4 py-3 font-display text-xl font-semibold transition-colors",
                    isSectionActive(pathname, group.href)
                      ? "bg-brand-orange/10 text-white"
                      : "text-white/90 hover:bg-white/[0.04]"
                  )}
                >
                  <span>{group.label}</span>
                  {isSectionActive(pathname, group.href) && (
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
                  )}
                </Link>
                {group.children && (
                  <div className="ml-4 mt-1 flex flex-col border-l border-white/10 pl-4">
                    {group.children.map((child, ci) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "rounded-lg px-3 py-2 text-[13px] transition-colors",
                          pathname === child.href
                            ? "text-brand-orange"
                            : "text-white/60 hover:text-white"
                        )}
                        style={{
                          transitionDelay: open ? `${90 + gi * 40 + ci * 20}ms` : "0ms",
                          opacity: open ? 1 : 0,
                          transition:
                            "opacity 380ms cubic-bezier(0.22, 1, 0.36, 1)",
                        }}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Footer sticky CTAs in the drawer. */}
          <div
            className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6"
            style={{
              transitionDelay: open ? "280ms" : "0ms",
              opacity: open ? 1 : 0,
              transform: open ? "translateY(0)" : "translateY(8px)",
              transition:
                "opacity 500ms cubic-bezier(0.22, 1, 0.36, 1), transform 500ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            <a
              href={SITE.phoneHref}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-base font-semibold text-white"
            >
              <span className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-brand-orange" />
                {SITE.phone}
              </span>
              <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/40">
                Appel direct
              </span>
            </a>
            <Link
              href="/devis"
              onClick={() => setOpen(false)}
              className="btn-primary justify-center py-4"
            >
              Demander un devis gratuit
            </Link>
            <p className="mt-2 text-center text-[11px] uppercase tracking-[0.18em] text-white/30">
              Thermolaquage · Île-de-France
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
