"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Circle,
  DoorClosed,
  Armchair,
  Bike,
  Check,
  Palette,
  Sparkles,
  RotateCcw,
  Share2,
} from "lucide-react";
import {
  ProductIllustration,
  type ConfiguratorProductId,
} from "@/components/ui/configurator-products";
import { POPULAR_RAL, RAL_COLORS, type RALColor } from "@/lib/ral-colors";
import { cn } from "@/lib/utils";

interface ProductOption {
  id: ConfiguratorProductId;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  priceFrom: string;
}

const PRODUCTS: ProductOption[] = [
  {
    id: "jante",
    label: "Jante auto",
    description: "Jantes 16 à 22 pouces, tous diamètres",
    icon: Circle,
    priceFrom: "80 € / jante",
  },
  {
    id: "portail",
    label: "Portail",
    description: "Battant ou coulissant, jusqu'à 7 m",
    icon: DoorClosed,
    priceFrom: "450 € / portail",
  },
  {
    id: "chaise",
    label: "Mobilier",
    description: "Chaise, table, mobilier métal",
    icon: Armchair,
    priceFrom: "35 € / pièce",
  },
  {
    id: "moto",
    label: "Cadre moto",
    description: "Cadre, jantes, pièces carrosserie",
    icon: Bike,
    priceFrom: "280 € / cadre",
  },
];

interface FinishOption {
  id: "mat" | "satin" | "brillant";
  label: string;
  description: string;
  brightness: number;
}

const FINISHES: FinishOption[] = [
  {
    id: "mat",
    label: "Mat",
    description: "Surface absolue sans reflet",
    brightness: 85,
  },
  {
    id: "satin",
    label: "Satiné",
    description: "Léger reflet, toucher doux",
    brightness: 100,
  },
  {
    id: "brillant",
    label: "Brillant",
    description: "Reflet miroir, finition premium",
    brightness: 115,
  },
];

/** Extended palette — popular 14 plus a few extras for variety */
const CONFIGURATOR_PALETTE: RALColor[] = [
  ...POPULAR_RAL,
  RAL_COLORS.find((c) => c.code === "RAL 6018")!, // Vert jaune
  RAL_COLORS.find((c) => c.code === "RAL 5002")!, // Bleu outremer
  RAL_COLORS.find((c) => c.code === "RAL 8017")!, // Brun chocolat
  RAL_COLORS.find((c) => c.code === "RAL 4005")!, // Violet bleu
].filter(Boolean);

const PRODUCT_IDS: ConfiguratorProductId[] = [
  "jante",
  "portail",
  "chaise",
  "moto",
];

const DEFAULT_PRODUCT: ConfiguratorProductId = "jante";
const DEFAULT_COLOR_CODE = "RAL 9005";
const DEFAULT_FINISH: FinishOption["id"] = "satin";

export function VisualConfigurator() {
  const defaultColor =
    CONFIGURATOR_PALETTE.find((c) => c.code === DEFAULT_COLOR_CODE) ??
    CONFIGURATOR_PALETTE[0];

  // Initial state always matches SSR render (no reads from URL) to avoid
  // hydration mismatches. URL-based hydration happens client-side via the
  // useEffect below.
  const [product, setProduct] =
    useState<ConfiguratorProductId>(DEFAULT_PRODUCT);
  const [color, setColor] = useState<RALColor>(defaultColor);
  const [finishId, setFinishId] =
    useState<FinishOption["id"]>(DEFAULT_FINISH);
  const [copied, setCopied] = useState(false);

  // Hydrate from URL on client after mount — safe because it happens after
  // hydration completes.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const p = params.get("p");
    const c = params.get("c");
    const f = params.get("f");
    if (p && PRODUCT_IDS.includes(p as ConfiguratorProductId)) {
      setProduct(p as ConfiguratorProductId);
    }
    if (c) {
      const match = CONFIGURATOR_PALETTE.find((rc) => rc.code === c);
      if (match) setColor(match);
    }
    if (f === "mat" || f === "satin" || f === "brillant") {
      setFinishId(f);
    }
  }, []);

  const finish = FINISHES.find((f) => f.id === finishId) ?? FINISHES[1];
  const productOpt = PRODUCTS.find((p) => p.id === product) ?? PRODUCTS[0];

  const devisHref = useMemo(() => {
    const params = new URLSearchParams({
      produit: productOpt.label,
      ral: color.code,
      finition: finish.label,
    });
    return `/devis?${params.toString()}`;
  }, [productOpt.label, color.code, finish.label]);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams({
      p: product,
      c: color.code,
      f: finishId,
    });
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  }, [product, color.code, finishId]);

  const reset = useCallback(() => {
    setProduct(DEFAULT_PRODUCT);
    setColor(defaultColor);
    setFinishId(DEFAULT_FINISH);
    if (typeof window !== "undefined") {
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [defaultColor]);

  const share = useCallback(async () => {
    if (!shareUrl) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Ma configuration ${productOpt.label} ${color.code}`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2400);
      }
    } catch {
      // User dismissed the share sheet — silently ignore.
    }
  }, [shareUrl, productOpt.label, color.code]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      {/* ── Preview panel ──────────────────────────────── */}
      <div className="flex flex-col gap-6">
        {/* Product tabs */}
        <div
          role="tablist"
          aria-label="Type de pièce"
          className="grid grid-cols-2 gap-3 rounded-2xl border border-brand-night/10 bg-white p-3 sm:grid-cols-4"
        >
          {PRODUCTS.map((p) => {
            const Icon = p.icon;
            const active = p.id === product;
            return (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setProduct(p.id)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl p-3 text-center transition-all",
                  active
                    ? "bg-brand-night text-white shadow-md"
                    : "text-brand-night/70 hover:bg-brand-cream hover:text-brand-night",
                )}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs font-semibold">{p.label}</span>
              </button>
            );
          })}
        </div>

        {/* Preview canvas */}
        <div className="relative overflow-hidden rounded-2xl border border-brand-night/10 bg-gradient-to-br from-brand-cream via-white to-brand-cream">
          <div className="absolute inset-0 bg-industrial-grid opacity-40" />
          <div className="absolute right-6 top-6 rounded-full border border-brand-night/10 bg-white/80 px-3 py-1 backdrop-blur-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-charcoal/70">
              Aperçu temps réel
            </p>
          </div>
          <div className="relative flex aspect-square items-center justify-center p-8 sm:p-12">
            <ProductIllustration
              product={product}
              color={color.hex}
              brightness={finish.brightness}
              className="h-full w-full max-w-[420px]"
            />
          </div>
        </div>

        {/* Summary bar */}
        <div className="rounded-2xl border border-brand-night/10 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <div
                aria-hidden
                className="h-10 w-10 rounded-lg border border-brand-night/10 shadow-sm"
                style={{ backgroundColor: color.hex }}
              />
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-brand-charcoal/60">
                  {color.code}
                </p>
                <p className="text-sm font-semibold text-brand-night">
                  {color.name}
                </p>
              </div>
            </div>
            <div className="hidden h-10 w-px bg-brand-night/10 sm:block" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-brand-charcoal/60">
                Finition
              </p>
              <p className="text-sm font-semibold text-brand-night">
                {finish.label}
              </p>
            </div>
            <div className="hidden h-10 w-px bg-brand-night/10 sm:block" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-brand-charcoal/60">
                À partir de
              </p>
              <p className="text-sm font-semibold text-brand-orange">
                {productOpt.priceFrom}
              </p>
            </div>
            <div className="ml-auto flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={reset}
                title="Réinitialiser la configuration"
                className="inline-flex items-center gap-2 rounded-full border border-brand-night/10 bg-white px-4 py-2.5 text-sm font-semibold text-brand-night transition-all hover:border-brand-night hover:bg-brand-cream"
              >
                <RotateCcw className="h-4 w-4" />
                <span className="hidden sm:inline">Réinitialiser</span>
              </button>
              <button
                type="button"
                onClick={share}
                title="Copier le lien de cette configuration"
                aria-live="polite"
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all",
                  copied
                    ? "border-green-600 bg-green-50 text-green-700"
                    : "border-brand-night/10 bg-white text-brand-night hover:border-brand-night hover:bg-brand-cream",
                )}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Lien copié&nbsp;!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Partager</span>
                  </>
                )}
              </button>
              <Link
                href={devisHref}
                className="btn-primary inline-flex items-center gap-2"
              >
                Demander un devis
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Controls panel ─────────────────────────────── */}
      <aside className="flex flex-col gap-6">
        {/* Color picker */}
        <div className="rounded-2xl border border-brand-night/10 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Palette className="h-4 w-4 text-brand-orange" />
            <h3 className="heading-display text-sm uppercase tracking-[0.15em] text-brand-night">
              Couleur RAL
            </h3>
          </div>
          <div className="grid grid-cols-4 gap-2.5">
            {CONFIGURATOR_PALETTE.map((c) => {
              const active = c.code === color.code;
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => setColor(c)}
                  aria-label={`${c.code} — ${c.name}`}
                  aria-pressed={active}
                  title={`${c.code} — ${c.name}`}
                  className={cn(
                    "relative aspect-square rounded-lg border transition-all",
                    active
                      ? "border-brand-night scale-105 shadow-md"
                      : "border-brand-night/10 hover:scale-105 hover:border-brand-night/40",
                  )}
                  style={{ backgroundColor: c.hex }}
                >
                  {active && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="rounded-full bg-white p-0.5 shadow-md">
                        <Check className="h-3 w-3 text-brand-night" />
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          <Link
            href="/couleurs-ral"
            className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand-orange transition-colors hover:text-brand-night"
          >
            Voir les 213 couleurs RAL
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Finish selector */}
        <div className="rounded-2xl border border-brand-night/10 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand-orange" />
            <h3 className="heading-display text-sm uppercase tracking-[0.15em] text-brand-night">
              Finition
            </h3>
          </div>
          <div className="flex flex-col gap-2">
            {FINISHES.map((f) => {
              const active = f.id === finish.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFinishId(f.id)}
                  aria-pressed={active}
                  className={cn(
                    "flex items-start justify-between gap-3 rounded-xl border p-3 text-left transition-all",
                    active
                      ? "border-brand-orange bg-brand-orange/5"
                      : "border-brand-night/10 hover:border-brand-night/30 hover:bg-brand-cream",
                  )}
                >
                  <div>
                    <p
                      className={cn(
                        "font-semibold",
                        active ? "text-brand-orange" : "text-brand-night",
                      )}
                    >
                      {f.label}
                    </p>
                    <p className="mt-0.5 text-xs text-brand-charcoal/60">
                      {f.description}
                    </p>
                  </div>
                  {active && (
                    <Check className="mt-1 h-4 w-4 shrink-0 text-brand-orange" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product info */}
        <div className="rounded-2xl border border-brand-night/10 bg-brand-cream p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-brand-charcoal/60">
            Pièce sélectionnée
          </p>
          <p className="mt-1 heading-display text-lg text-brand-night">
            {productOpt.label}
          </p>
          <p className="mt-1 text-xs text-brand-charcoal/70">
            {productOpt.description}
          </p>
        </div>
      </aside>
    </div>
  );
}
