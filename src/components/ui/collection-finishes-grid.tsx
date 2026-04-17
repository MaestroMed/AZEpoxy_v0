"use client";

import Image from "next/image";
import Link from "next/link";
import { m, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CollectionFinish, SubCollection } from "@/lib/collections-data";

interface CollectionFinishesGridProps {
  collectionName: string;
  accentColor: string;
  finishes: CollectionFinish[];           // utilisé si pas de subCollections
  subCollections?: SubCollection[];
}

function FinishTile({
  finish,
  onSelect,
  selected,
}: {
  finish: CollectionFinish;
  onSelect: (f: CollectionFinish) => void;
  selected: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(finish)}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-brand-night/10 bg-brand-cream text-left transition-all",
        "hover:-translate-y-0.5 hover:border-brand-night/25 hover:shadow-lg",
        selected && "ring-2 ring-brand-orange ring-offset-2",
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-brand-cream">
        {finish.imageUrl ? (
          <Image
            src={finish.imageUrl}
            alt={finish.name}
            fill
            sizes="(min-width: 1024px) 200px, (min-width: 640px) 33vw, 50vw"
            quality={65}
            loading="lazy"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div
            className="h-full w-full"
            style={{ backgroundColor: finish.hex ?? "#888" }}
          />
        )}
      </div>
      <div className="p-3">
        <p className="truncate text-xs font-semibold uppercase tracking-wide text-brand-night">
          {finish.name}
        </p>
      </div>
    </button>
  );
}

// ── Sticky preview panel ───────────────────────────────────────────────
function StickyPreview({
  finish,
  accentColor,
  onClose,
}: {
  finish: CollectionFinish | null;
  accentColor: string;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {finish && (
        <m.aside
          key={finish.id}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="sticky top-4 z-10 mb-8 overflow-hidden rounded-2xl border border-brand-night/10 bg-white shadow-lg lg:top-24"
        >
          <div className="grid gap-0 sm:grid-cols-[auto_1fr_auto] sm:items-center">
            <div className="relative h-[160px] w-full sm:h-[140px] sm:w-[140px]">
              {finish.imageUrl ? (
                <Image
                  src={finish.imageUrl}
                  alt={finish.name}
                  fill
                  sizes="160px"
                  quality={75}
                  className="object-cover"
                />
              ) : (
                <div
                  className="h-full w-full"
                  style={{ backgroundColor: finish.hex ?? "#888" }}
                />
              )}
            </div>

            <div className="px-5 py-4">
              <div
                className="mb-1 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-brand-charcoal/60"
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: accentColor }}
                />
                Finition sélectionnée
              </div>
              <h3 className="heading-display text-xl text-brand-night sm:text-2xl">
                {finish.name}
              </h3>
              {finish.description && (
                <p className="mt-1 text-sm text-brand-charcoal/70">
                  {finish.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 px-5 pb-4 sm:pb-0 sm:pr-5">
              <Link
                href={`/devis?finition=${encodeURIComponent(finish.name)}`}
                className="inline-flex items-center gap-2 rounded-full bg-brand-night px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-orange"
              >
                Demander cette finition
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fermer l'aperçu"
                className="rounded-full border border-brand-night/15 p-2 text-brand-charcoal/70 transition-colors hover:border-brand-night/30 hover:text-brand-night"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </m.aside>
      )}
    </AnimatePresence>
  );
}

export function CollectionFinishesGrid({
  collectionName,
  accentColor,
  finishes,
  subCollections,
}: CollectionFinishesGridProps) {
  const [selected, setSelected] = useState<CollectionFinish | null>(null);

  const handleSelect = (f: CollectionFinish) => {
    setSelected((prev) => (prev?.id === f.id ? null : f));
  };

  return (
    <div>
      <StickyPreview
        finish={selected}
        accentColor={accentColor}
        onClose={() => setSelected(null)}
      />

      {subCollections && subCollections.length > 0 ? (
        <div className="space-y-16">
          {subCollections.map((sub) => (
            <div key={sub.id}>
              <div className="mb-6 max-w-2xl">
                <h3 className="heading-display text-2xl text-brand-night sm:text-3xl">
                  {sub.name}
                </h3>
                {sub.description && (
                  <p className="mt-2 text-sm text-brand-charcoal/70">
                    {sub.description}
                  </p>
                )}
                <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-brand-charcoal/40">
                  {sub.finishes.length} finition{sub.finishes.length > 1 ? "s" : ""}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {sub.finishes.map((f) => (
                  <FinishTile
                    key={f.id}
                    finish={f}
                    onSelect={handleSelect}
                    selected={selected?.id === f.id}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {finishes.map((f) => (
            <FinishTile
              key={f.id}
              finish={f}
              onSelect={handleSelect}
              selected={selected?.id === f.id}
            />
          ))}
        </div>
      )}

      <p className="sr-only">
        Collection {collectionName} — {finishes.length} finitions disponibles.
      </p>
    </div>
  );
}
