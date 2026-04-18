"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { RAL_COLORS, RAL_FAMILIES } from "@/lib/ral-colors";
import { ColorSwatch } from "@/components/ui/color-swatch";
import { ColorFilterBar } from "@/components/ui/color-filter-bar";
import { track } from "@/lib/analytics/events";
import { LayoutGrid, List, ShoppingBag, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const CART_KEY = "azepoxy-color-cart";

function loadCart(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveCart(codes: string[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(codes));
}

export function RalPickerSection() {
  const [activeFamily, setActiveFamily] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [cart, setCart] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    setCart(loadCart());
  }, []);

  const toggleCart = useCallback((code: string) => {
    setCart((prev) => {
      const next = prev.includes(code)
        ? prev.filter((c) => c !== code)
        : [...prev, code];
      saveCart(next);
      track("color_cart", { action: prev.includes(code) ? "remove" : "add", code });
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    saveCart([]);
  }, []);

  const filtered = useMemo(() => {
    let result = RAL_COLORS;

    if (activeFamily) {
      result = result.filter((c) => c.family === activeFamily);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (c) =>
          c.code.toLowerCase().includes(q) ||
          c.name.toLowerCase().includes(q)
      );
    }

    return result;
  }, [activeFamily, searchQuery]);

  const cartColors = useMemo(
    () => cart.map((code) => RAL_COLORS.find((c) => c.code === code)).filter(Boolean),
    [cart]
  );

  const handleFamilyChange = useCallback((family: string | null) => {
    setActiveFamily(family);
    track("color_filter", { family: family || "all" });
  }, []);

  const handleSearchChange = useCallback((q: string) => {
    setSearchQuery(q);
  }, []);

  return (
    <section className="bg-brand-cream py-24">
      <div className="container-wide">
        {/* Filter bar */}
        <ColorFilterBar
          families={RAL_FAMILIES}
          activeFamily={activeFamily}
          onFamilyChange={handleFamilyChange}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />

        {/* Toolbar: count + view toggle + cart */}
        <div className="mt-6 mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <p className="text-sm font-semibold text-brand-charcoal/60">
              {filtered.length} couleur{filtered.length !== 1 ? "s" : ""}
            </p>
            {(activeFamily || searchQuery) && (
              <button
                onClick={() => {
                  setActiveFamily(null);
                  setSearchQuery("");
                }}
                className="text-sm font-semibold text-brand-orange transition-colors hover:text-brand-orange/80"
              >
                Effacer les filtres
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex rounded-lg border border-brand-night/15 bg-white p-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "rounded-md p-1.5 transition-colors",
                  viewMode === "grid"
                    ? "bg-brand-orange text-white"
                    : "text-brand-charcoal/50 hover:text-brand-night"
                )}
                aria-label="Vue grille"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "rounded-md p-1.5 transition-colors",
                  viewMode === "list"
                    ? "bg-brand-orange text-white"
                    : "text-brand-charcoal/50 hover:text-brand-night"
                )}
                aria-label="Vue liste"
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* Cart button */}
            <button
              onClick={() => setCartOpen(!cartOpen)}
              aria-expanded={cartOpen}
              data-magnetic
              className={cn(
                "group relative flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-semibold transition-all duration-300",
                cart.length > 0
                  ? "border-brand-orange bg-brand-orange/10 text-brand-orange shadow-[0_6px_18px_-10px_rgba(232,93,44,0.45)] hover:bg-brand-orange/15"
                  : "border-brand-night/15 bg-white text-brand-charcoal/60 hover:border-brand-night/30 hover:text-brand-night",
              )}
            >
              <ShoppingBag className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-6" />
              <span className="hidden sm:inline">Ma sélection</span>
              {cart.length > 0 && (
                <span
                  className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-orange text-[10px] font-bold tabular-nums text-white shadow-sm"
                  key={cart.length /* force remount so animate-stat-pop plays on change */}
                  style={{
                    animation: "stat-pop 400ms cubic-bezier(0.22,1,0.36,1) 1",
                  }}
                >
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Cart panel — stagger reveal + chips animés */}
        <div
          aria-hidden={!cartOpen}
          className={cn(
            "overflow-hidden transition-[max-height,opacity,margin-bottom] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            cartOpen
              ? "max-h-[600px] opacity-100 mb-8"
              : "pointer-events-none max-h-0 opacity-0"
          )}
        >
          <div className="relative overflow-hidden rounded-2xl border border-brand-orange/25 bg-gradient-to-br from-white via-brand-orange/[0.02] to-white p-6 shadow-[0_12px_32px_-18px_rgba(232,93,44,0.35)]">
            {/* Corner accent */}
            <span
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-orange/10 blur-3xl"
            />

            <div className="relative mb-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-orange">
                  Ma sélection
                </p>
                <h3 className="font-display text-lg font-semibold text-brand-night">
                  {cart.length} couleur{cart.length !== 1 ? "s" : ""} retenue
                  {cart.length !== 1 ? "s" : ""}
                </h3>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-[11px] font-semibold uppercase tracking-wider text-brand-charcoal/45 transition-colors hover:text-red-500"
                >
                  Tout supprimer
                </button>
              )}
            </div>

            {cart.length === 0 ? (
              <p className="relative text-sm text-brand-charcoal/55">
                Cliquez sur le <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-brand-orange/15 text-[11px] font-bold text-brand-orange align-middle">+</span> d&apos;une couleur pour l&apos;ajouter à votre sélection.
              </p>
            ) : (
              <>
                <div className="relative mb-5 flex flex-wrap gap-2">
                  {cartColors.map((color, i) =>
                    color ? (
                      <div
                        key={color.code}
                        className="group/chip flex items-center gap-2 rounded-full border border-brand-night/10 bg-white px-3 py-1.5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-orange/40 hover:shadow-md"
                        style={{
                          animation: cartOpen
                            ? `stat-pop 420ms cubic-bezier(0.22,1,0.36,1) ${i * 30}ms both`
                            : undefined,
                        }}
                      >
                        <span
                          className="h-4 w-4 rounded-full border border-black/10 shadow-sm"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="font-mono text-[11px] font-bold text-brand-night">
                          {color.code}
                        </span>
                        <span className="max-w-[8rem] truncate text-[11px] text-brand-charcoal/55">
                          {color.name}
                        </span>
                        <button
                          onClick={() => toggleCart(color.code)}
                          className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full text-brand-charcoal/30 transition-all hover:bg-red-50 hover:text-red-500 hover:scale-110"
                          aria-label={`Retirer ${color.code}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : null,
                  )}
                </div>
                <Link
                  href={`/devis?ral=${cart.join(",")}`}
                  data-magnetic
                  className="group/cta relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-orange/35 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-orange/50"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-br from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover/cta:translate-x-full"
                  />
                  <span className="relative">
                    Demander un devis avec ces couleurs
                  </span>
                  <ArrowRight className="relative h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Color display */}
        {filtered.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
              {filtered.map((color) => (
                <ColorSwatch
                  key={color.code}
                  code={color.code}
                  name={color.name}
                  hex={color.hex}
                  size="sm"
                  inCart={cart.includes(color.code)}
                  onToggleCart={() => toggleCart(color.code)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((color) => (
                <div
                  key={color.code}
                  className="flex items-center gap-4 rounded-xl border border-brand-night/10 bg-white p-3 transition-all hover:shadow-md"
                >
                  <span
                    className="h-10 w-10 shrink-0 rounded-lg border border-black/10"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-sm font-semibold text-brand-night">
                      {color.code}
                    </p>
                    <p className="text-sm text-brand-charcoal/60 truncate">
                      {color.name}
                    </p>
                  </div>
                  <span className="hidden sm:block font-mono text-xs text-brand-charcoal/40">
                    {color.hex}
                  </span>
                  <button
                    onClick={() => toggleCart(color.code)}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all",
                      cart.includes(color.code)
                        ? "border-brand-orange bg-brand-orange/10 text-brand-orange"
                        : "border-brand-night/15 text-brand-charcoal/50 hover:border-brand-orange hover:text-brand-orange"
                    )}
                  >
                    {cart.includes(color.code) ? "Sélectionnée" : "Sélectionner"}
                  </button>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 h-16 w-16 rounded-full bg-brand-night/5 flex items-center justify-center">
              <svg
                className="h-8 w-8 text-brand-charcoal/30"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </div>
            <p className="text-lg font-semibold text-brand-night">
              Aucune couleur trouvée
            </p>
            <p className="mt-2 text-sm text-brand-charcoal/60">
              Essayez un autre terme de recherche ou changez de famille de couleurs.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
