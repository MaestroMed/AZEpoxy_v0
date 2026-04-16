"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CircleDot,
  Bike,
  DoorOpen,
  Fence,
  Armchair,
  Package,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PIECE_TYPES, OPTIONS, type PieceType } from "@/lib/pricing-data";
import { track } from "@/lib/analytics/events";

const ICON_MAP: Record<string, typeof CircleDot> = {
  CircleDot,
  Bike,
  DoorOpen,
  Fence,
  Armchair,
  Package,
};

export function PriceEstimator() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [sizeIndex, setSizeIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [zinc, setZinc] = useState(false);
  const [premium, setPremium] = useState(false);

  const piece = PIECE_TYPES.find((p) => p.slug === selectedType) ?? null;

  // Calculate price range
  const estimate = (() => {
    if (!piece) return null;
    let base: { min: number; max: number };
    if (piece.sizes) {
      base = piece.sizes[sizeIndex]?.range ?? piece.sizes[0].range;
    } else if (piece.baseRange) {
      base = piece.baseRange;
    } else {
      return null;
    }
    let min = base.min * quantity;
    let max = base.max * quantity;
    if (zinc) {
      min = Math.round(min * OPTIONS.zinc.multiplier);
      max = Math.round(max * OPTIONS.zinc.multiplier);
    }
    if (premium) {
      min = Math.round(min * OPTIONS.premium.multiplier);
      max = Math.round(max * OPTIONS.premium.multiplier);
    }
    return { min, max };
  })();

  // Track estimate
  useEffect(() => {
    if (estimate && selectedType) {
      track("price_estimate_calculated", {
        type: selectedType,
        quantity,
        amount: Math.round((estimate.min + estimate.max) / 2),
      });
    }
  }, [estimate?.min, estimate?.max, selectedType, quantity]);

  const reset = () => {
    setSelectedType(null);
    setSizeIndex(0);
    setQuantity(1);
    setZinc(false);
    setPremium(false);
  };

  const inputClass =
    "w-full rounded-xl border border-brand-night/15 bg-white px-4 py-3 text-brand-night placeholder:text-brand-charcoal/40 focus:outline-none focus:ring-2 focus:ring-brand-orange transition-shadow";

  const labelClass = "mb-1.5 block text-sm font-semibold text-brand-night";

  return (
    <div className="rounded-2xl border border-brand-night/10 bg-white p-6 sm:p-8 shadow-sm">
      {/* Type selection grid */}
      {!selectedType ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {PIECE_TYPES.map((type) => {
            const Icon = ICON_MAP[type.icon] ?? Package;
            return (
              <button
                key={type.slug}
                type="button"
                onClick={() => setSelectedType(type.slug)}
                className="rounded-xl border border-brand-night/10 bg-white p-4 text-center hover:border-brand-orange cursor-pointer transition-colors"
              >
                <Icon className="mx-auto h-6 w-6 text-brand-orange mb-2" />
                <span className="text-sm font-semibold text-brand-night">
                  {type.label}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="space-y-5">
          {/* Header with reset */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-brand-night">
              {piece?.label}
            </h3>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 text-sm text-brand-charcoal/60 hover:text-brand-orange transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Changer de pièce
            </button>
          </div>

          {/* Size selection (jantes only) */}
          {piece?.sizes && (
            <div>
              <label className={labelClass}>Taille</label>
              <div className="flex flex-wrap gap-2">
                {piece.sizes.map((size, i) => (
                  <button
                    key={size.label}
                    type="button"
                    onClick={() => setSizeIndex(i)}
                    className={cn(
                      "rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                      sizeIndex === i
                        ? "border-brand-orange bg-brand-orange/5 text-brand-orange"
                        : "border-brand-night/15 text-brand-charcoal/70 hover:border-brand-orange/50"
                    )}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <label htmlFor="estimator-qty" className={labelClass}>
              Quantité ({piece?.unit})
            </label>
            <input
              id="estimator-qty"
              type="number"
              min={1}
              max={100}
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, Math.min(100, Number(e.target.value))))
              }
              className={cn(inputClass, "max-w-32")}
            />
          </div>

          {/* Options */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={zinc}
                onChange={(e) => setZinc(e.target.checked)}
                className="h-4 w-4 rounded border-brand-night/15 text-brand-orange focus:ring-brand-orange"
              />
              <span className="text-sm text-brand-charcoal/80">
                {OPTIONS.zinc.label}{" "}
                <span className="text-brand-charcoal/50">(+30%)</span>
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={premium}
                onChange={(e) => setPremium(e.target.checked)}
                className="h-4 w-4 rounded border-brand-night/15 text-brand-orange focus:ring-brand-orange"
              />
              <span className="text-sm text-brand-charcoal/80">
                {OPTIONS.premium.label}{" "}
                <span className="text-brand-charcoal/50">(+20%)</span>
              </span>
            </label>
          </div>

          {/* Estimate display */}
          {estimate && (
            <div className="rounded-xl bg-brand-orange/5 border border-brand-orange/20 p-5 text-center">
              <p className="text-sm text-brand-charcoal/60 mb-1">
                Estimation indicative
              </p>
              <p className="text-3xl font-bold text-brand-night">
                Entre {estimate.min}&euro; et {estimate.max}&euro;{" "}
                <span className="text-base font-normal text-brand-charcoal/50">
                  HT
                </span>
              </p>
            </div>
          )}

          {/* Disclaimer */}
          <p className="text-xs text-brand-charcoal/50 leading-relaxed">
            Estimation indicative. Le tarif final dépend de l&apos;état initial
            de la pièce et de la complexité du traitement.
          </p>

          {/* CTA */}
          <Link
            href={`/devis?type=${selectedType}&quantity=${quantity}`}
            className="btn-primary w-full justify-center"
          >
            Confirmer avec un devis précis
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
