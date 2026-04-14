"use client";

import { useState, useMemo, useCallback } from "react";
import { RAL_COLORS, RAL_FAMILIES } from "@/lib/ral-colors";
import { ColorSwatch } from "@/components/ui/color-swatch";
import { ColorFilterBar } from "@/components/ui/color-filter-bar";

export function RalPickerSection() {
  const [activeFamily, setActiveFamily] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleFamilyChange = useCallback((family: string | null) => {
    setActiveFamily(family);
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

        {/* Count display */}
        <div className="mt-6 mb-8 flex items-center justify-between">
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

        {/* Color grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
            {filtered.map((color) => (
              <ColorSwatch
                key={color.code}
                code={color.code}
                name={color.name}
                hex={color.hex}
                size="sm"
              />
            ))}
          </div>
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
