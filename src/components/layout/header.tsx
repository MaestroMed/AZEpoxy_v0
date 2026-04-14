"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { cn, SITE } from "@/lib/utils";

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
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-md bg-gradient-ember shadow-lg shadow-brand-orange/40">
            <span className="absolute inset-0 flex items-center justify-center font-display text-xl font-black text-white">
              AZ
            </span>
            <div className="absolute inset-0 animate-ember-pulse bg-gradient-heat opacity-60" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-lg font-black text-white tracking-tight">
              ÉPOXY
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-orange">
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
                className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
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
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block rounded-lg px-4 py-2.5 text-sm text-white/80 transition-colors hover:bg-brand-orange/20 hover:text-white"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
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

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden">
          <div className="container-wide border-t border-white/10 pb-8 pt-6">
            <nav className="flex flex-col gap-1">
              {navGroups.map((group) => (
                <div key={group.label} className="py-1">
                  <Link
                    href={group.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-4 py-3 text-base font-semibold text-white"
                  >
                    {group.label}
                  </Link>
                  {group.children && (
                    <div className="ml-2 flex flex-col border-l border-white/10 pl-4">
                      {group.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setOpen(false)}
                          className="rounded-lg px-4 py-2 text-sm text-white/70 transition-colors hover:text-white"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
            <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-6">
              <a
                href={SITE.phoneHref}
                className="flex items-center gap-2 text-base font-semibold text-white"
              >
                <Phone className="h-4 w-4 text-brand-orange" />
                {SITE.phone}
              </a>
              <Link
                href="/devis"
                onClick={() => setOpen(false)}
                className="btn-primary justify-center"
              >
                Demander un devis gratuit
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
