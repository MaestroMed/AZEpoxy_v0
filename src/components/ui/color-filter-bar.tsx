"use client";

import { Search } from "lucide-react";
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

export function ColorFilterBar({
  families,
  activeFamily,
  onFamilyChange,
  searchQuery,
  onSearchChange,
}: ColorFilterBarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
        {/* "All" chip */}
        <button
          onClick={() => onFamilyChange(null)}
          className={cn(
            "flex-shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all",
            activeFamily === null
              ? "bg-brand-orange text-white shadow-md"
              : "border border-brand-night/15 bg-white text-brand-night hover:border-brand-night/30"
          )}
        >
          Tous
        </button>

        {/* Family chips */}
        {families.map((family) => (
          <button
            key={family.key}
            onClick={() => onFamilyChange(family.key)}
            className={cn(
              "flex flex-shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all",
              activeFamily === family.key
                ? "bg-brand-orange text-white shadow-md"
                : "border border-brand-night/15 bg-white text-brand-night hover:border-brand-night/30"
            )}
          >
            <span
              className="h-3 w-3 rounded-full border border-black/10"
              style={{ backgroundColor: family.hex }}
              aria-hidden="true"
            />
            {family.label}
          </button>
        ))}
      </div>

      {/* Search input */}
      {onSearchChange && (
        <div className="relative flex-shrink-0">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-charcoal/40" />
          <input
            type="text"
            placeholder="Rechercher une couleur..."
            value={searchQuery ?? ""}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-full border border-brand-night/15 bg-white py-2 pl-10 pr-4 text-sm text-brand-night placeholder:text-brand-charcoal/40 focus:outline-none focus:ring-2 focus:ring-brand-orange sm:w-64"
          />
        </div>
      )}
    </div>
  );
}
