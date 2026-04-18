"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ColorFamily {
  key: string;
  label: string;
  hex: string;
}

interface ColorFilterBarProps {
  families: ColorFamily[];
  activeFamily: string | null;
  onFamilyChange: (family: string | null) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

/**
 * ColorFilterBar — chips filtrables + search. Polish award :
 *   • Chips avec indicator active (ring + shadow ember) + hover lift
 *   • Family dot scale 1.15 sur active chip
 *   • Search input : icon scale+color au focus, clear button animé si
 *     query non vide, background glow subtle au focus
 */
export function ColorFilterBar({
  families,
  activeFamily,
  onFamilyChange,
  searchQuery,
  onSearchChange,
}: ColorFilterBarProps) {
  const hasQuery = (searchQuery ?? "").length > 0;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Filter chips */}
      <div
        className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide sm:pb-0"
        role="tablist"
      >
        {/* "All" chip */}
        <button
          onClick={() => onFamilyChange(null)}
          role="tab"
          aria-selected={activeFamily === null}
          className={cn(
            "group flex-shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300",
            activeFamily === null
              ? "bg-brand-orange text-white shadow-[0_6px_16px_-8px_rgba(232,93,44,0.5)] ring-1 ring-brand-orange/40 ring-offset-2 ring-offset-brand-cream"
              : "border border-brand-night/15 bg-white text-brand-night hover:-translate-y-0.5 hover:border-brand-night/30 hover:shadow-sm",
          )}
        >
          Tous
        </button>

        {/* Family chips */}
        {families.map((family) => {
          const isActive = activeFamily === family.key;
          return (
            <button
              key={family.key}
              onClick={() => onFamilyChange(family.key)}
              role="tab"
              aria-selected={isActive}
              className={cn(
                "group flex flex-shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300",
                isActive
                  ? "bg-brand-orange text-white shadow-[0_6px_16px_-8px_rgba(232,93,44,0.5)] ring-1 ring-brand-orange/40 ring-offset-2 ring-offset-brand-cream"
                  : "border border-brand-night/15 bg-white text-brand-night hover:-translate-y-0.5 hover:border-brand-night/30 hover:shadow-sm",
              )}
            >
              <span
                className={cn(
                  "h-3 w-3 rounded-full border border-black/10 shadow-sm transition-transform duration-300",
                  isActive ? "scale-110" : "group-hover:scale-110",
                )}
                style={{ backgroundColor: family.hex }}
                aria-hidden="true"
              />
              {family.label}
            </button>
          );
        })}
      </div>

      {/* Search input */}
      {onSearchChange && (
        <div className="group relative flex-shrink-0">
          <Search
            className={cn(
              "absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 transition-all duration-300",
              hasQuery
                ? "text-brand-orange scale-110"
                : "text-brand-charcoal/40 group-focus-within:text-brand-orange group-focus-within:scale-110",
            )}
          />
          <input
            type="text"
            placeholder="Rechercher une couleur ou un code..."
            value={searchQuery ?? ""}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Rechercher parmi les RAL"
            className="w-full rounded-full border border-brand-night/15 bg-white py-2.5 pl-10 pr-10 text-sm text-brand-night placeholder:text-brand-charcoal/40 focus:outline-none sm:w-72"
          />
          {hasQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Effacer la recherche"
              className="absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-brand-night/8 text-brand-charcoal/50 transition-all hover:bg-brand-orange hover:text-white hover:scale-110"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
