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
              className={cn(
                "relative flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-semibold transition-all",
                cart.length > 0
                  ? "border-brand-orange bg-brand-orange/10 text-brand-orange"
                  : "border-brand-night/15 bg-white text-brand-charcoal/60"
              )}
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Ma sélection</span>
              {cart.length > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-orange text-[10px] font-bold text-white">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Cart panel */}
        {cartOpen && (
          <div className="mb-8 rounded-2xl border border-brand-orange/20 bg-white p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-brand-night text-sm">
                Ma sélection ({cart.length} couleur{cart.length !== 1 ? "s" : ""})
              </h3>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-brand-charcoal/50 hover:text-red-500 transition-colors"
                >
                  Tout supprimer
                </button>
              )}
            </div>

            {cart.length === 0 ? (
              <p className="text-sm text-brand-charcoal/50">
                Cliquez sur le + d&apos;une couleur pour l&apos;ajouter à votre sélection.
              </p>
            ) : (
              <>
                <div className="flex flex-wrap gap-2 mb-4">
                  {cartColors.map((color) =>
                    color ? (
                      <div
                        key={color.code}
                        className="flex items-center gap-2 rounded-full border border-brand-night/10 bg-brand-cream px-3 py-1.5"
                      >
                        <span
                          className="h-4 w-4 rounded-full border border-black/10"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-xs font-semibold text-brand-night">
                          {color.code}
                        </span>
                        <span className="text-xs text-brand-charcoal/50">
                          {color.name}
                        </span>
                        <button
                          onClick={() => toggleCart(color.code)}
                          className="ml-1 text-brand-charcoal/30 hover:text-red-500 transition-colors"
                          aria-label={`Retirer ${color.code}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : null
                  )}
                </div>
                <Link
                  href={`/devis?ral=${cart.join(",")}`}
                  className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-orange/90 hover:shadow-lg"
                >
                  Demander un devis avec ces couleurs
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            )}
          </div>
        )}

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
