"use client";

import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ColorSwatchProps {
  code: string;
  name: string;
  hex: string;
  size?: "sm" | "md" | "lg";
  inCart?: boolean;
  onToggleCart?: () => void;
}

const sizeClasses = {
  sm: "h-20",
  md: "h-32",
  lg: "h-40",
} as const;

export function ColorSwatch({
  code,
  name,
  hex,
  size = "md",
  inCart,
  onToggleCart,
}: ColorSwatchProps) {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(hex);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = hex;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <m.div
      whileHover={{ scale: 1.04, y: -4 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      onClick={handleClick}
      className={cn(
        "group relative w-full cursor-pointer overflow-hidden rounded-xl shadow-[0_6px_20px_-10px_rgba(0,0,0,0.3)] transition-shadow hover:shadow-[0_14px_32px_-14px_rgba(0,0,0,0.4)]",
        sizeClasses[size]
      )}
      style={{ backgroundColor: hex }}
      role="button"
      tabIndex={0}
      aria-label={`${code} ${name} — cliquer pour copier ${hex}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Sheen diagonal au hover (subtile, adaptable sur n'importe
          quelle couleur grâce au mix-blend-overlay). */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-br from-transparent via-white/30 to-transparent opacity-0 mix-blend-overlay transition-all duration-700 group-hover:translate-x-full group-hover:opacity-100"
      />

      {/* Bottom gradient overlay for text legibility */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent transition-opacity duration-300 group-hover:from-black/70"
        aria-hidden="true"
      />

      {/* Cart toggle button */}
      {onToggleCart && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleCart();
          }}
          className={cn(
            "absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-300",
            inCart
              ? "bg-brand-orange text-white scale-100 shadow-lg shadow-brand-orange/40"
              : "bg-white/85 text-brand-night/70 scale-0 group-hover:scale-100 hover:bg-white"
          )}
          aria-label={inCart ? `Retirer ${code} de la sélection` : `Ajouter ${code} à la sélection`}
        >
          {inCart ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
        </button>
      )}

      {/* Hex pill — revealed top-left on hover, shows the exact hex. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-2 top-2 rounded-full bg-white/85 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-brand-night/80 backdrop-blur-sm opacity-0 transition-all duration-300 translate-y-[-4px] group-hover:opacity-100 group-hover:translate-y-0"
      >
        {hex}
      </div>

      {/* Color info */}
      <div className="absolute inset-x-0 bottom-0 p-3">
        <p className="font-mono text-xs font-semibold uppercase tracking-wider text-white/90">
          {code}
        </p>
        <p className="text-sm font-semibold text-white leading-snug">{name}</p>
      </div>

      {/* Copied toast — avec framer-motion fade+scale */}
      <AnimatePresence>
        {copied && (
          <m.div
            key="toast"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center bg-black/45 backdrop-blur-sm"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-night shadow-xl">
              <Check className="h-3.5 w-3.5 text-brand-orange" />
              Hex copié
            </span>
          </m.div>
        )}
      </AnimatePresence>
    </m.div>
  );
}
